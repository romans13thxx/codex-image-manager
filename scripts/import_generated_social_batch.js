#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");

const WORKFLOW_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WORKFLOW_ROOT, "..");
const HOME_DIR = process.env.USERPROFILE || process.env.HOME || "";
const CODEX_HOME = process.env.CODEX_HOME || path.join(HOME_DIR, ".codex");
const GENERATED_ROOT = path.join(CODEX_HOME, "generated_images");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  for (const key of Object.keys(args)) {
    if (key.includes("-")) {
      const camel = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      if (args[camel] === undefined) args[camel] = args[key];
    }
  }
  return args;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function relativeToRepo(filePath) {
  return path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
}

function copyFileNoOverwrite(source, target) {
  ensureDir(path.dirname(target));
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
    return target;
  }
  const ext = path.extname(target);
  const stem = target.slice(0, -ext.length);
  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${stem}-${index}${ext}`;
    if (!fs.existsSync(candidate)) {
      fs.copyFileSync(source, candidate);
      return candidate;
    }
  }
  throw new Error(`Could not find non-conflicting target for ${target}`);
}

function walkImages(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(resolved, files);
    } else if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(resolved);
    }
  }
  return files;
}

function parseSince(value) {
  if (!value) return 0;
  const ms = Date.parse(value);
  if (Number.isFinite(ms)) return ms;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  throw new Error(`Invalid --since value: ${value}`);
}

function loadPromptRows(jobName, promptFileArg) {
  const promptFile = promptFileArg
    ? path.resolve(promptFileArg)
    : path.join(WORKFLOW_ROOT, "output", "references", "social", jobName, "generation-prompts.jsonl");
  if (!fs.existsSync(promptFile)) {
    throw new Error(`Prompt JSONL not found: ${promptFile}`);
  }
  const rows = fs.readFileSync(promptFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  return { promptFile, rows };
}

function loadExplicitSources(args) {
  const values = [];
  if (args.sourceList) {
    const sourceListPath = path.resolve(args.sourceList);
    if (!fs.existsSync(sourceListPath)) {
      throw new Error(`Source list not found: ${sourceListPath}`);
    }
    values.push(
      ...fs.readFileSync(sourceListPath, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    );
  }
  if (args.sources) {
    values.push(...String(args.sources).split(";").map((item) => item.trim()).filter(Boolean));
  }
  if (!values.length) return null;
  return values.map((source) => {
    const filePath = path.resolve(source);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Explicit source does not exist: ${filePath}`);
    }
    if (!IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
      throw new Error(`Explicit source is not an image: ${filePath}`);
    }
    return { filePath, stat: fs.statSync(filePath) };
  });
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildOutputDir(base, entry, jobDate) {
  return path.join(
    base,
    jobDate,
    slugify(entry.topCategory),
    slugify(entry.subCategory),
    slugify(entry.scene),
    slugify(entry.skinTone),
    slugify(entry.appeal),
  );
}

function buildBaseName(entry) {
  return [
    "img",
    String(entry.sequence).padStart(3, "0"),
    entry.topCategory,
    entry.subCategory,
    entry.scene,
    entry.skinTone,
    entry.appeal,
    entry.subject,
  ].map(slugify).join("-");
}

function buildReport(manifest, normalizedEntries) {
  const lines = [
    `# ${manifest.jobName} selection report`,
    "",
    "## Summary",
    "",
    `- Entries: ${normalizedEntries.length}`,
    `- Source type: ${manifest.sourceType}`,
    `- Date: ${manifest.jobDate}`,
    "",
    "## Selected Images",
    "",
  ];
  for (const entry of normalizedEntries) {
    lines.push(`### ${String(entry.sequence).padStart(3, "0")} ${entry.title}`);
    lines.push("");
    lines.push(`- Prompt id: ${entry.promptId}`);
    lines.push(`- Selected file: ${entry.selectedFile}`);
    lines.push(`- Raw file: ${entry.sourceFiles[0] || ""}`);
    lines.push(`- Reference file: ${entry.referenceFile || "none"}`);
    lines.push(`- Reason: ${entry.selectionReason}`);
    if (entry.failureReasons.length) {
      lines.push(`- Watch-outs: ${entry.failureReasons.join("; ")}`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}

function writeSelectedReadme(selectedDir) {
  const readmePath = path.join(selectedDir, "README.md");
  if (fs.existsSync(readmePath)) return;
  const content = `# Selected Images

Selection standard for this folder:

- Adult real-human blonde OOTD subject remains clear.
- No copied public creator identity, celebrity likeness, watermark, username, platform UI, or readable brand text.
- Hands, face, clothing, and shoes are usable.
- The image works as a vertical social-fashion fit-check or OOTD post.
`;
  fs.writeFileSync(readmePath, content, "utf8");
}

function main() {
  const args = parseArgs(process.argv);
  const jobName = args.jobName;
  if (!jobName) throw new Error("--job-name is required");
  const jobDate = args.date || jobName.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(jobDate)) {
    throw new Error("--date is required when job name does not start with YYYY-MM-DD");
  }
  const count = Number.parseInt(args.count || "4", 10);
  if (!Number.isFinite(count) || count < 1) {
    throw new Error("--count must be a positive integer");
  }
  const sinceMs = parseSince(args.since);
  const { promptFile, rows } = loadPromptRows(jobName, args.prompts);
  if (rows.length < count) {
    throw new Error(`Prompt file only contains ${rows.length} rows; need ${count}`);
  }

  const explicitSources = loadExplicitSources(args);
  const images = explicitSources || walkImages(GENERATED_ROOT)
    .map((filePath) => ({ filePath, stat: fs.statSync(filePath) }))
    .filter((item) => item.stat.mtimeMs >= sinceMs)
    .sort((a, b) => a.stat.mtimeMs - b.stat.mtimeMs);

  if (images.length < count) {
    throw new Error(`Found ${images.length} generated image(s) after --since; need ${count}`);
  }

  const selectedImages = images.slice(-count);
  const referenceMetadataPath = path.join(WORKFLOW_ROOT, "output", "references", "social", jobName, "metadata.json");
  const referenceMetadata = readJsonIfExists(referenceMetadataPath);
  const references = referenceMetadata?.references || [];

  const backupDir = path.join(WORKFLOW_ROOT, "output", "backups", "codex", jobDate, jobName);
  const imagegenDir = path.join(WORKFLOW_ROOT, "output", "imagegen", jobName);
  const manifestDir = path.join(WORKFLOW_ROOT, "jobs", "results-manifests");
  const reportDir = path.join(WORKFLOW_ROOT, "output", "reports");
  ensureDir(backupDir);
  ensureDir(imagegenDir);
  ensureDir(manifestDir);
  ensureDir(reportDir);

  const normalizedEntries = [];
  for (let index = 0; index < count; index += 1) {
    const promptRow = rows[index];
    const generated = selectedImages[index];
    const ext = path.extname(generated.filePath).toLowerCase() || ".png";
    const backupPath = copyFileNoOverwrite(
      generated.filePath,
      path.join(backupDir, `${String(index + 1).padStart(3, "0")}-${slugify(promptRow.id)}${ext}`),
    );
    const stagingPath = copyFileNoOverwrite(
      generated.filePath,
      path.join(imagegenDir, `${String(index + 1).padStart(3, "0")}-${slugify(promptRow.id)}${ext}`),
    );

    const baseName = buildBaseName(promptRow);
    const rawDir = buildOutputDir(path.join(WORKFLOW_ROOT, "output", "images"), promptRow, jobDate);
    const selectedDir = buildOutputDir(path.join(WORKFLOW_ROOT, "output", "selected"), promptRow, jobDate);
    ensureDir(rawDir);
    ensureDir(selectedDir);
    writeSelectedReadme(selectedDir);

    const rawPath = copyFileNoOverwrite(backupPath, path.join(rawDir, `${baseName}-v1${ext}`));
    const selectedPath = copyFileNoOverwrite(backupPath, path.join(selectedDir, `${baseName}-final${ext}`));
    const reference = references[index] || null;

    normalizedEntries.push({
      sequence: promptRow.sequence,
      promptId: promptRow.id,
      title: promptRow.title,
      topCategory: promptRow.topCategory,
      subCategory: promptRow.subCategory,
      scene: promptRow.scene,
      skinTone: promptRow.skinTone,
      appeal: promptRow.appeal,
      subject: promptRow.subject,
      prompt: promptRow.prompt,
      referenceFile: reference?.localFile || "",
      referenceSourceUrl: reference?.sourceUrl || "",
      sourceFiles: [relativeToRepo(rawPath)],
      backupFiles: [relativeToRepo(backupPath)],
      stagingFiles: [relativeToRepo(stagingPath)],
      selectedFile: relativeToRepo(selectedPath),
      selectedSourceIndex: 1,
      selectionReason:
        "Selected as the first-pass output for this prompt: it preserves the adult street-fashion OOTD subject, fit-check readability, and original non-identifiable model constraint.",
      failureReasons: [
        "Manual visual QA is still recommended for hands, face, readable text, and accidental platform UI before publishing.",
      ],
    });
  }

  const manifest = {
    jobName,
    jobDate,
    reportName: `${jobName}-selection-report.md`,
    sourceType: "codex-imagegen",
    promptFile: relativeToRepo(promptFile),
    backupDir: relativeToRepo(backupDir),
    entries: normalizedEntries,
  };
  const manifestPath = path.join(manifestDir, `${jobName}.json`);
  const normalizedPath = path.join(manifestDir, `${jobName}.normalized.json`);
  const reportPath = path.join(reportDir, manifest.reportName);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(normalizedPath, `${JSON.stringify({ ...manifest, dateSubfolder: jobDate, report: relativeToRepo(reportPath) }, null, 2)}\n`, "utf8");
  fs.writeFileSync(reportPath, buildReport(manifest, normalizedEntries), "utf8");

  console.log(`Imported ${normalizedEntries.length} generated image(s) for ${jobName}`);
  console.log(`Manifest: ${relativeToRepo(manifestPath)}`);
  console.log(`Report: ${relativeToRepo(reportPath)}`);
  console.log(`Selected dir: ${path.dirname(normalizedEntries[0].selectedFile)}`);
}

main();
