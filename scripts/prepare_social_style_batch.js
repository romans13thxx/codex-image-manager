#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");

const WORKFLOW_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WORKFLOW_ROOT, "..");

const DEFAULT_SEED_TAGS = [
  "#美式辣妹",
  "#金发",
  "#我的穿搭日记",
  "#又酷又飒的早秋ootd",
];

const CURATED_SIMILAR_TAGS = [
  "#辣妹穿搭",
  "#ootd穿搭",
  "#fitcheck",
  "#ootd",
  "#今天穿什么",
  "#今天长这样",
  "#美式复古",
  "#欧美穿搭",
  "#早秋穿搭",
  "#酷飒穿搭",
  "#街拍",
  "#拍照",
  "#拍照姿势分享",
  "#氛围感",
  "#美丽坏女人",
  "#感觉至上",
  "#liveinmyfeelings",
  "#LAgirl",
  "#洛杉矶",
  "#闺蜜穿搭",
];

const POSES = [
  {
    id: "street-crosswalk-fitcheck",
    title: "Street crosswalk fit check",
    scene: "downtown sidewalk at golden hour, crosswalk stripes, parked cars, glass storefront reflections",
    pose: "full-body fit-check stance, one hand lifting sunglasses, one knee relaxed forward, confident direct gaze",
    outfit: "black cropped leather jacket, fitted white baby tee, low-rise faded denim mini skirt, black knee-high boots, slim belt, tiny shoulder bag",
    light: "late-afternoon sun mixed with small on-camera flash, crisp shadow, compact-camera realism",
  },
  {
    id: "parking-lot-paparazzi",
    title: "Parking lot paparazzi flash",
    scene: "generic outdoor parking lot with blue-gray asphalt, concrete curb, anonymous retail wall, no readable signs",
    pose: "three-quarter walking pose, hair moving, looking back over shoulder, one hand holding a small silver phone",
    outfit: "charcoal tube top, cropped moto vest, low-rise cargo mini skirt, chunky black platform boots, silver hoops, stacked bracelets",
    light: "hard sun from the side plus direct fill flash, slight lens flare, point-and-shoot snapshot texture",
  },
  {
    id: "mirror-selfie-denim",
    title: "Denim mirror selfie OOTD",
    scene: "clean apartment hallway mirror, white wall, coat rack edge, soft daylight from one side",
    pose: "standing mirror selfie, phone partly covering cheek but face still readable, hip angled, free hand at waist",
    outfit: "cropped vintage varsity jacket, pale ribbed tank, low-rise wide-leg jeans, pointed black ankle boots, layered necklaces",
    light: "natural window light with mild flash reflection, handheld phone crop, realistic mirror depth",
  },
  {
    id: "rooftop-early-fall",
    title: "Early fall rooftop cool girl",
    scene: "urban rooftop parking deck, pale concrete, metal railing, distant city blocks, warm early-fall sky",
    pose: "leaning against railing, one elbow back, chin slightly lifted, legs crossed at ankle, cool unsmiling expression",
    outfit: "oversized black bomber jacket off one shoulder, fitted gray crop top, low-rise denim shorts over sheer black tights, pointed boots, narrow sunglasses",
    light: "cool dusk ambient with direct compact flash, subtle film grain, high-detail fashion editorial",
  },
];

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
  return args;
}

function todayIso() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function decodeHtml(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function uniq(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const normalized = String(value).trim();
    if (!normalized || seen.has(normalized.toLowerCase())) continue;
    seen.add(normalized.toLowerCase());
    result.push(normalized);
  }
  return result;
}

function buildSearchQueries(seedTags) {
  const seedText = seedTags.map((tag) => tag.replace(/^#/, "")).join(" ");
  return [
    {
      platform: "douyin",
      type: "web",
      query: `site:douyin.com ${seedText}`,
    },
    {
      platform: "douyin",
      type: "web",
      query: "site:douyin.com 辣妹穿搭 金发 fitcheck ootd",
    },
    {
      platform: "xiaohongshu",
      type: "web",
      query: `site:xiaohongshu.com ${seedText}`,
    },
    {
      platform: "xiaohongshu",
      type: "web",
      query: "小红书 美式辣妹 金发 OOTD 辣妹穿搭",
    },
  ];
}

function buildImageQueries(seedTags) {
  const seedText = seedTags.map((tag) => tag.replace(/^#/, "")).join(" ");
  return [
    {
      platform: "douyin",
      query: `site:douyin.com ${seedText}`,
    },
    {
      platform: "xiaohongshu",
      query: `site:xiaohongshu.com ${seedText}`,
    },
    {
      platform: "mixed",
      query: `${seedText} 小红书 抖音 辣妹穿搭 ootd`,
    },
    {
      platform: "mixed",
      query: "美式复古 辣妹穿搭 金发 fitcheck ootd",
    },
  ];
}

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    },
  }).finally(() => clearTimeout(timeout));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function fetchBuffer(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: "https://www.bing.com/",
    },
  }).finally(() => clearTimeout(timeout));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const arrayBuffer = await response.arrayBuffer();
  return { bytes: Buffer.from(arrayBuffer), contentType };
}

function extensionFromContentType(contentType, fallbackUrl) {
  const lower = contentType.toLowerCase();
  if (lower.includes("png")) return ".png";
  if (lower.includes("webp")) return ".webp";
  if (lower.includes("jpeg") || lower.includes("jpg")) return ".jpg";
  const clean = String(fallbackUrl).split(/[?#]/)[0].toLowerCase();
  const ext = path.extname(clean);
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return ext;
  return ".jpg";
}

function extractHashtags(html) {
  const decoded = decodeHtml(html);
  const matches = decoded.match(/#[\p{Script=Han}A-Za-z0-9_.-]+/gu) || [];
  return matches
    .map((tag) => tag.replace(/[，。,.!！?？:：;；)）\]】]+$/u, ""))
    .filter((tag) => {
      if (tag.length <= 1 || tag.length > 28) return false;
      if (/^#[0-9a-f]{3,8}$/i.test(tag)) return false;
      if (!/\p{Script=Han}/u.test(tag)) {
        return /^#(ootd|fitcheck|liveinmyfeelings|lagirl)$/i.test(tag);
      }
      return !/^#?[\w-]+$/u.test(tag.slice(1)) || /\p{Script=Han}/u.test(tag);
    });
}

function extractBingImageResults(html, queryInfo) {
  const decoded = decodeHtml(html);
  const results = [];
  const seen = new Set();
  const objectRegex = /m="({.*?})"/g;
  let objectMatch;
  while ((objectMatch = objectRegex.exec(decoded)) !== null) {
    try {
      const data = JSON.parse(objectMatch[1]);
      const imageUrl = data.murl || data.turl;
      if (!imageUrl || seen.has(imageUrl)) continue;
      seen.add(imageUrl);
      results.push({
        platform: queryInfo.platform,
        query: queryInfo.query,
        imageUrl,
        thumbnailUrl: data.turl || "",
        sourceUrl: data.purl || "",
        title: data.t || "",
      });
    } catch {
      // Bing may occasionally emit non-JSON attributes; skip them.
    }
  }

  const murlRegex = /"murl":"(.*?)"/g;
  let match;
  while ((match = murlRegex.exec(decoded)) !== null) {
    const imageUrl = match[1].replace(/\\u002f/g, "/");
    if (!imageUrl || seen.has(imageUrl)) continue;
    seen.add(imageUrl);
    results.push({
      platform: queryInfo.platform,
      query: queryInfo.query,
      imageUrl,
      thumbnailUrl: "",
      sourceUrl: "",
      title: "",
    });
  }
  return results;
}

function promptForPose(jobName, pose, similarTags) {
  const tagLine = similarTags.slice(0, 12).join(" ");
  return [
    `Use case: photorealistic-natural`,
    `Asset type: vertical 9:16 social-fashion image for ${jobName}`,
    `Primary request: create an original adult "American baddie" blonde OOTD fashion image with the same subject grammar as the seed tags, not the same real person.`,
    `Subject: adult female fashion model, clearly 22+, blonde hair with soft waves, confident cool expression, real human proportions, clear face, natural hands.`,
    `Scene/backdrop: ${pose.scene}.`,
    `Outfit: ${pose.outfit}.`,
    `Composition/framing: ${pose.pose}; vertical 9:16 phone-photo crop, full-body or three-quarter OOTD readability, candid Xiaohongshu/Douyin-style fashion post energy without platform UI.`,
    `Style/medium: photorealistic compact-camera fashion editorial, light grain, slight motion imperfection, point-and-shoot flash, cross-processed slide-film color, early-fall cool-girl styling.`,
    `Lighting/mood: ${pose.light}.`,
    `Reference tag mood: ${tagLine}.`,
    `Constraints: original non-identifiable model only; do not copy any creator, celebrity, watermark, username, platform interface, or exact source image; keep clothing and pose readable.`,
    `Avoid: avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no minors, no teen-coded body, no celebrity likeness, no watermark, no readable social app UI, no brand logos, no duplicated limbs, no broken fingers, no deformed shoes, no plastic skin, no extreme sexualized pose.`,
  ].join("\n");
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeJsonl(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

function relativeToRepo(filePath) {
  return path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
}

async function discoverTags(searchQueries, sourceDir) {
  const discovered = [];
  const pages = [];
  for (const queryInfo of searchQueries) {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(queryInfo.query)}`;
    try {
      const html = await fetchText(url);
      const file = path.join(sourceDir, `${queryInfo.platform}-${slugify(queryInfo.query)}.html`);
      fs.writeFileSync(file, html, "utf8");
      pages.push({ ...queryInfo, url, savedHtml: relativeToRepo(file) });
      discovered.push(...extractHashtags(html));
    } catch (error) {
      pages.push({ ...queryInfo, url, error: error.message });
    }
  }
  return { discoveredTags: uniq(discovered), pages };
}

async function downloadReferenceImages(imageQueries, referenceDir, count) {
  const candidates = [];
  const searchPages = [];
  for (const queryInfo of imageQueries) {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(queryInfo.query)}&form=HDRSC2`;
    try {
      const html = await fetchText(url);
      const file = path.join(referenceDir, `bing-images-${queryInfo.platform}-${slugify(queryInfo.query)}.html`);
      fs.writeFileSync(file, html, "utf8");
      searchPages.push({ ...queryInfo, url, savedHtml: relativeToRepo(file) });
      candidates.push(...extractBingImageResults(html, queryInfo));
    } catch (error) {
      searchPages.push({ ...queryInfo, url, error: error.message });
    }
  }

  const downloaded = [];
  const failures = [];
  const seenImageUrls = new Set();
  for (const candidate of candidates) {
    if (downloaded.length >= count) break;
    if (seenImageUrls.has(candidate.imageUrl)) continue;
    seenImageUrls.add(candidate.imageUrl);
    try {
      const { bytes, contentType } = await fetchBuffer(candidate.imageUrl);
      if (!contentType.toLowerCase().startsWith("image/")) {
        throw new Error(`not an image: ${contentType || "unknown content type"}`);
      }
      if (/fw240|thumb|thumbnail/i.test(candidate.imageUrl)) {
        throw new Error("likely thumbnail or non-reference asset");
      }
      if (bytes.length < 50000) {
        throw new Error(`image too small: ${bytes.length} bytes`);
      }
      const ext = extensionFromContentType(contentType, candidate.imageUrl);
      const filename = `reference-${String(downloaded.length + 1).padStart(3, "0")}${ext}`;
      const filePath = path.join(referenceDir, filename);
      fs.writeFileSync(filePath, bytes);
      downloaded.push({
        ...candidate,
        localFile: relativeToRepo(filePath),
        contentType,
        bytes: bytes.length,
      });
    } catch (error) {
      failures.push({
        imageUrl: candidate.imageUrl,
        sourceUrl: candidate.sourceUrl,
        platform: candidate.platform,
        query: candidate.query,
        error: error.message,
      });
    }
  }

  return { downloaded, failures, searchPages, candidatesSeen: candidates.length };
}

function buildJobMarkdown({ jobName, jobDate, seedTags, similarTags, references, promptRows }) {
  const promptList = promptRows.map((row) => `- ${row.id}: ${row.title}`).join("\n");
  const refList = references.length
    ? references.map((item) => `- ${item.localFile} (${item.platform}; ${item.sourceUrl || item.query})`).join("\n")
    : "- No downloadable public reference images were found; prompts remain ready for generation.";
  return `# ${jobName}

## Theme

Adult real-human "American baddie" blonde OOTD set inspired by public social-platform tag grammar, with original non-identifiable models only.

## Source Tags

${seedTags.join(" ")}

## Similar Tags

${similarTags.join(" ")}

## Reference Images

${refList}

## Queue Range

${promptList}

## Versions Per Prompt

One generated image per prompt. The generated count should match the saved reference image count or the requested count, whichever is larger in the run manifest.

## Output Plan

- Reference board: \`output/references/social/${jobName}/\`
- Prompt queue: \`prompts/queue/${jobName}.jsonl\`
- Generated image staging: \`output/imagegen/${jobName}/\`
- Organized images: \`output/images/${jobDate}/real-human/outdoor-street/street/light/cool/\`
- Selected images: \`output/selected/${jobDate}/real-human/outdoor-street/street/light/cool/\`
- Results manifest: \`jobs/results-manifests/${jobName}.json\`

## Selection Criteria

- Adult appearance is clear; no minor or teen-coded styling.
- Blonde American baddie / cool early-fall OOTD subject stays consistent.
- No copied creator identity, celebrity likeness, watermark, username, platform UI, or readable brand text.
- Hands, face, shoes, and clothing anatomy are usable.
- Full outfit remains readable enough for OOTD/fit-check usage.

## Failure Fallback

- If the model becomes too generic: add "compact-camera flash, fit-check posture, low-rise denim, moto/leather layer, early-fall street style".
- If the output is too explicit: add "fashion editorial, confident but non-explicit pose, streetwear focus".
- If the output copies a public figure or creator: regenerate with "fictional non-identifiable adult model, different face and location".
`;
}

function buildInboxMarkdown({ jobName, seedTags, similarTags, promptRows }) {
  return `# ${jobName} prompt pack

## Seed

${seedTags.join(" ")}

## Similar tag pool

${similarTags.join(" ")}

## Generation prompts

${promptRows
  .map((row, index) => `### ${String(index + 1).padStart(2, "0")} ${row.title}\n\n\`\`\`text\n${row.prompt}\n\`\`\``)
  .join("\n\n")}
`;
}

async function main() {
  const args = parseArgs(process.argv);
  const count = Number.parseInt(args.count || "4", 10);
  if (!Number.isFinite(count) || count < 1) {
    throw new Error("--count must be a positive integer");
  }
  const jobDate = args.date || todayIso();
  const slug = args.slug || "american-baddie-blonde-ootd";
  const jobName = `${jobDate}-${slugify(slug)}`;
  const seedTags = args.seedTags
    ? args.seedTags.split(/[,\s]+/).filter(Boolean).map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    : DEFAULT_SEED_TAGS;

  const referenceDir = path.join(WORKFLOW_ROOT, "output", "references", "social", jobName);
  const sourceDir = path.join(referenceDir, "search-pages");
  ensureDir(referenceDir);
  ensureDir(sourceDir);
  ensureDir(path.join(WORKFLOW_ROOT, "prompts", "queue"));
  ensureDir(path.join(WORKFLOW_ROOT, "prompts", "inbox"));
  ensureDir(path.join(WORKFLOW_ROOT, "jobs"));

  const searchQueries = buildSearchQueries(seedTags);
  const imageQueries = buildImageQueries(seedTags);
  const { discoveredTags, pages } = await discoverTags(searchQueries, sourceDir);
  const similarTags = uniq([...seedTags, ...CURATED_SIMILAR_TAGS, ...discoveredTags]).slice(0, 36);

  const imageResult = args.noDownload
    ? { downloaded: [], failures: [], searchPages: [], candidatesSeen: 0 }
    : await downloadReferenceImages(imageQueries, referenceDir, count);

  const outputCount = Math.max(count, imageResult.downloaded.length);
  const promptRows = POSES.slice(0, outputCount).map((pose, index) => ({
    id: `${jobName}-${String(index + 1).padStart(2, "0")}-${pose.id}`,
    sequence: index + 1,
    title: pose.title,
    topCategory: "real-human",
    subCategory: "outdoor-street",
    scene: "street",
    skinTone: "light",
    appeal: "cool",
    subject: "female",
    prompt: promptForPose(jobName, pose, similarTags),
  }));

  const promptQueuePath = path.join(WORKFLOW_ROOT, "prompts", "queue", `${jobName}.jsonl`);
  const inboxPath = path.join(WORKFLOW_ROOT, "prompts", "inbox", `${jobName}.md`);
  const jobPath = path.join(WORKFLOW_ROOT, "jobs", `${jobName}.md`);
  const promptJsonPath = path.join(referenceDir, "generation-prompts.json");
  const promptJsonlPath = path.join(referenceDir, "generation-prompts.jsonl");
  const tagPath = path.join(referenceDir, "similar-tags.json");
  const metadataPath = path.join(referenceDir, "metadata.json");

  writeJsonl(promptQueuePath, promptRows);
  writeJsonl(promptJsonlPath, promptRows);
  writeJson(promptJsonPath, promptRows);
  writeJson(tagPath, { seedTags, similarTags, discoveredTags, curatedSimilarTags: CURATED_SIMILAR_TAGS });
  writeJson(metadataPath, {
    jobName,
    jobDate,
    seedTags,
    similarTags,
    searchQueries,
    imageQueries,
    searchPages: pages,
    imageSearchPages: imageResult.searchPages,
    references: imageResult.downloaded,
    failedDownloads: imageResult.failures.slice(0, 50),
    candidatesSeen: imageResult.candidatesSeen,
    generatedAt: new Date().toISOString(),
    note:
      "Reference images are saved for local visual research only. Generated prompts require original non-identifiable adult models and must not copy creator identity or exact source images.",
  });
  fs.writeFileSync(jobPath, buildJobMarkdown({ jobName, jobDate, seedTags, similarTags, references: imageResult.downloaded, promptRows }), "utf8");
  fs.writeFileSync(inboxPath, buildInboxMarkdown({ jobName, seedTags, similarTags, promptRows }), "utf8");

  console.log(`Prepared social style batch: ${jobName}`);
  console.log(`Reference images saved: ${imageResult.downloaded.length}/${count}`);
  console.log(`Prompt queue: ${relativeToRepo(promptQueuePath)}`);
  console.log(`Job file: ${relativeToRepo(jobPath)}`);
  console.log(`Metadata: ${relativeToRepo(metadataPath)}`);
  console.log(`Prompt JSONL: ${relativeToRepo(promptJsonlPath)}`);
}

main().catch((error) => {
  console.error(`[error] ${error.message}`);
  process.exit(1);
});
