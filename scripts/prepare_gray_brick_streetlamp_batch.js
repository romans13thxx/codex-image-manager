#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");

const WORKFLOW_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WORKFLOW_ROOT, "..");

const DEFAULT_SEED_TAGS = [
  "#Y2K穿搭",
  "#辣妹穿搭",
  "#破洞牛仔裤穿搭",
  "#街拍",
  "#夜景街拍",
  "#闪光灯拍照",
  "#老街拍照",
  "#路灯拍照",
  "#OOTD",
  "#fitcheck",
];

const CURATED_SIMILAR_TAGS = [
  "#轻亚辣妹y2k穿搭",
  "#破洞牛仔裤穿搭",
  "#晒出你的辣妹穿搭",
  "#我的春日穿搭look",
  "#今日穿搭look",
  "#ootd穿搭只为取悦自己",
  "#辣妹穿搭",
  "#辣妹ootd穿搭攻略",
  "#酷女孩穿搭",
  "#甜酷穿搭",
  "#美式复古",
  "#千禧辣妹",
  "#亚文化穿搭",
  "#废土风穿搭",
  "#街拍穿搭",
  "#时尚街拍",
  "#拍照姿势",
  "#拍照姿势分享",
  "#氛围感拍照",
  "#夜景人像",
  "#夜景拍照",
  "#闪光灯拍照",
  "#直闪拍照",
  "#老街拍照",
  "#灰砖墙拍照",
  "#路灯拍照",
  "#今日穿搭",
  "#每日穿搭",
  "#ootd每日穿搭",
  "#穿出自己的风格",
  "#牛仔裤穿搭",
  "#破洞牛仔裤",
  "#宽松牛仔裤",
  "#无袖背心穿搭",
  "#鸭舌帽穿搭",
  "#街头穿搭",
];

const SOURCE_NOTES = [
  {
    platform: "douyin",
    url: "https://jingxuan.douyin.com/m/video/7485342809168284967",
    tags: ["#轻亚辣妹y2k穿搭"],
  },
  {
    platform: "douyin",
    url: "https://jingxuan.douyin.com/m/video/7627752090252757410",
    tags: ["#破洞牛仔裤穿搭"],
  },
  {
    platform: "douyin",
    url: "https://jingxuan.douyin.com/m/video/7628723920968143033",
    tags: ["#轻熟穿搭", "#晒出你的辣妹穿搭", "#我的春日穿搭look", "#今日穿搭look", "#ootd穿搭只为取悦自己"],
  },
  {
    platform: "douyin",
    url: "https://jingxuan.douyin.com/m/video/7532825207050145084",
    tags: ["#牛仔", "#辣妹穿搭"],
  },
  {
    platform: "douyin",
    url: "https://www.douyin.com/shipin/7277598330150242315",
    tags: ["#y2k", "#亚文化穿搭", "#千禧", "#穿出自己的风格"],
  },
];

const POSES = [
  {
    id: "gray-brick-doorway-lamp-lean",
    title: "Gray brick doorway lamp lean",
    scene:
      "a quiet old gray-brick lane at night, dark wooden doorway, black streetlamp pole beside the subject, uneven stone sidewalk, anonymous address plate with unreadable numbers",
    pose:
      "full-body OOTD stance, leaning lightly near the lamp pole, one thumb hooked in the jean pocket, the other hand holding a phone and small silver bag, legs relaxed but not copied from the reference",
    camera:
      "vertical 9:16 phone-photo crop, 28mm compact-camera perspective, full outfit readable, camera slightly below eye level",
    light:
      "hard on-camera flash lighting the model, cool blue-gray brick shadows, very dark background falloff, realistic night street snapshot",
    difference:
      "change the doorway layout, change the street number, shift the lamp pole to a different side, use a new face and new hand placement",
  },
  {
    id: "dusk-globe-lamp-fitcheck",
    title: "Dusk globe lamp fit check",
    scene:
      "urban roadside at blue-hour dusk, a tall black lamp pole with a glowing round globe above, peach-purple sky, dark building silhouettes, distant car light streaks, no readable storefronts",
    pose:
      "standing fit-check pose directly under the lamp, shoulders squared, one knee slightly forward, one hand resting on belt loop, the other hand holding the phone at thigh level",
    camera:
      "vertical 9:16 social-fashion frame, full-body centered, enough sky above to show the glowing lamp, compact phone-camera realism",
    light:
      "mix of warm globe light, fading sunset sky, and direct flash on face and outfit, high contrast but clean skin texture",
    difference:
      "make the skyline and lamp head different, avoid the exact same stance, use a fictional non-identifiable adult model",
  },
  {
    id: "brick-wall-close-crop",
    title: "Brick wall close crop",
    scene:
      "narrow gray-brick old street, black utility pole, dark recessed window and wooden door behind, subtle wall stains and mortar texture, no exact visible place markers",
    pose:
      "three-quarter close street portrait from knees up, body angled toward the pole, one hand at waistband, one hand holding phone and bag strap, direct calm gaze",
    camera:
      "vertical 9:16 close OOTD crop, 35mm compact camera look, face clear, top and distressed jeans details readable",
    light:
      "direct flash with cool ambient fill, glossy highlights on hair, textured bricks visible, shadow edge behind the pole",
    difference:
      "crop and expression differ from the source, change wall geometry and accessories placement, no copied face or exact text",
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
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
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
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

function relativeToRepo(filePath) {
  return path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
}

function buildSearchQueries(seedTags) {
  const seedText = seedTags.map((tag) => tag.replace(/^#/, "")).join(" ");
  return [
    {
      platform: "douyin",
      type: "web",
      query: `site:douyin.com ${seedText} 破洞牛仔 街拍`,
    },
    {
      platform: "douyin",
      type: "web",
      query: "site:douyin.com 轻亚辣妹y2k穿搭 破洞牛仔裤穿搭 街拍",
    },
    {
      platform: "xiaohongshu",
      type: "web",
      query: `site:xiaohongshu.com ${seedText} 灰砖墙 路灯`,
    },
    {
      platform: "xiaohongshu",
      type: "web",
      query: "小红书 y2k 辣妹穿搭 破洞牛仔 夜景街拍 闪光灯拍照",
    },
  ];
}

function buildImageQueries(seedTags) {
  const seedText = seedTags.map((tag) => tag.replace(/^#/, "")).join(" ");
  return [
    {
      platform: "mixed",
      query: `${seedText} 灰砖墙 老街 路灯 破洞牛仔裤`,
    },
    {
      platform: "douyin",
      query: "site:douyin.com 轻亚辣妹y2k穿搭 破洞牛仔裤穿搭 街拍",
    },
    {
      platform: "xiaohongshu",
      query: "site:xiaohongshu.com y2k 辣妹穿搭 破洞牛仔 夜景街拍",
    },
    {
      platform: "mixed",
      query: "Y2K 辣妹穿搭 破洞牛仔裤 夜景街拍 闪光灯",
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
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
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
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
  return matches.filter((tag) => {
    if (tag.length <= 1 || tag.length > 32) return false;
    if (/^#[0-9a-f]{3,8}$/i.test(tag)) return false;
    return /\p{Script=Han}/u.test(tag) || /^#(ootd|fitcheck)$/i.test(tag);
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
      // Ignore malformed Bing attributes.
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

function promptForPose(jobName, pose, similarTags) {
  const tagLine = similarTags.slice(0, 18).join(" ");
  return [
    "Use case: photorealistic-natural",
    `Asset type: vertical 9:16 social-fashion image for ${jobName}`,
    "Primary request: create one original image with the same subject grammar as the provided references: adult Y2K streetwear OOTD, gray-brick old street, black lamp pole, direct flash, white sleeveless crop tank, heavily distressed baggy jeans. It must not be an identical copy.",
    "Subject: fictional non-identifiable adult East Asian female fashion model, clearly 22+, long dark-brown loose hair, dark washed newsboy cap, clear face, cool calm expression, real human proportions, natural hands.",
    "Outfit: white sleeveless cropped graphic tank with abstract unreadable print, black choker, thin layered necklace, white belt, oversized light-wash baggy jeans with heavy ripped panels and frayed openings, black platform sandals, silver shoulder bag, black wrist cuff, rings and bracelets, phone in hand.",
    `Scene/backdrop: ${pose.scene}.`,
    `Composition/framing: ${pose.pose}; ${pose.camera}.`,
    "Style/medium: photorealistic compact-camera night street editorial, Xiaohongshu/Douyin OOTD energy without app UI, direct-flash snapshot, cross-processed cool blue-gray shadows, detailed brick and denim texture, slight phone-camera grain.",
    `Lighting/mood: ${pose.light}.`,
    `Reference tag mood: ${tagLine}.`,
    `Required variation: ${pose.difference}.`,
    "Rare-style layer: nocturnal direct-flash street editorial, cross-processed slide-film color, urban texture realism, compact-camera fit-check framing.",
    "Constraints: original non-identifiable model only; same outfit category and scene language, but different face, pose, wall geometry, lamp position, crop, and micro-accessories; no exact source image recreation.",
    "Avoid: avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no minors, no teen-coded body, no celebrity likeness, no creator likeness, no watermark, no readable social app UI, no readable street number, no brand logos, no duplicated limbs, no broken fingers, no deformed shoes, no plastic skin, no extreme sexualized pose.",
  ].join("\n");
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeJsonl(filePath, rows) {
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
}

function buildJobMarkdown({ jobName, jobDate, seedTags, similarTags, references, promptRows }) {
  const promptList = promptRows.map((row) => `- ${row.id}: ${row.title}`).join("\n");
  const refList = references.length
    ? references.map((item) => `- ${item.localFile} (${item.platform}; ${item.sourceUrl || item.query})`).join("\n")
    : "- No downloadable public reference images were found; use the user's three attached references plus the prompt pack.";
  return `# ${jobName}

## Theme

Adult real-human Y2K streetwear OOTD set based on the provided three-reference subject: gray-brick old street, black streetlamp, direct flash, white sleeveless crop tank, distressed baggy denim. The output count is pinned to 3 to match the user-provided image count.

## Source Tags

${seedTags.join(" ")}

## Similar Tags

${similarTags.join(" ")}

## Reference Images

${refList}

## Queue Range

${promptList}

## Versions Per Prompt

One generated image per prompt, exactly 3 total. Each prompt keeps the same subject grammar while changing face, pose, lamp placement, wall geometry, crop, and micro-accessories.

## Output Plan

- Reference board: \`output/references/social/${jobName}/\`
- Prompt queue: \`prompts/queue/${jobName}.jsonl\`
- Generated image staging: \`output/imagegen/${jobName}/\`
- Organized images: \`output/images/${jobDate}/real-human/outdoor-street/street/light/cool/\`
- Selected images: \`output/selected/${jobDate}/real-human/outdoor-street/street/light/cool/\`
- Results manifest after generation: \`jobs/results-manifests/${jobName}.json\`

## Selection Criteria

- Adult appearance is clear; no minor or teen-coded body or styling.
- Same visual subject: white sleeveless crop tank, distressed baggy jeans, cap, silver bag, old gray-brick street, black lamp pole, direct flash.
- Not identical: different fictional face, pose, crop, street layout, lamp placement, wall signs, and hand positions.
- No copied creator identity, celebrity likeness, watermark, username, platform UI, readable street number, or readable brand text.
- Hands, face, shoes, denim rips, and bag strap are usable.

## Failure Fallback

- If the model drifts away from the reference subject: add "dark newsboy cap, white sleeveless graphic crop tank, oversized heavily ripped light-wash baggy jeans, black lamp pole, gray-brick old street, direct flash".
- If it becomes too explicit: add "fashion editorial fit-check, confident but non-explicit pose, outfit readability first".
- If it copies a public person or the reference too closely: regenerate with "fictional non-identifiable adult model, different face, different wall geometry and pose".
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
  .map((row, index) => `### ${String(index + 1).padStart(2, "0")} ${row.title}

\`\`\`text
${row.prompt}
\`\`\``)
  .join("\n\n")}
`;
}

async function main() {
  const args = parseArgs(process.argv);
  const count = Number.parseInt(args.count || "3", 10);
  if (!Number.isFinite(count) || count < 1) throw new Error("--count must be a positive integer");
  if (count > POSES.length) throw new Error(`This batch has ${POSES.length} curated poses; requested ${count}`);

  const jobDate = args.date || todayIso();
  const slug = args.slug || "gray-brick-streetlamp-y2k-ootd";
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
  const sourceTags = SOURCE_NOTES.flatMap((item) => item.tags);
  const similarTags = uniq([...seedTags, ...sourceTags, ...CURATED_SIMILAR_TAGS, ...discoveredTags]).slice(0, 48);

  const imageResult = args.noDownload
    ? { downloaded: [], failures: [], searchPages: [], candidatesSeen: 0 }
    : await downloadReferenceImages(imageQueries, referenceDir, count);

  const promptRows = POSES.slice(0, count).map((pose, index) => ({
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
  writeJson(tagPath, {
    seedTags,
    similarTags,
    discoveredTags,
    curatedSimilarTags: CURATED_SIMILAR_TAGS,
    sourceNotes: SOURCE_NOTES,
  });
  writeJson(metadataPath, {
    jobName,
    jobDate,
    requestedCount: count,
    seedImageCount: 3,
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
      "Reference images are saved for local visual research only. Generated images must use original non-identifiable adult models and must not copy any creator identity, exact source frame, watermark, or platform UI.",
  });
  fs.writeFileSync(
    jobPath,
    buildJobMarkdown({ jobName, jobDate, seedTags, similarTags, references: imageResult.downloaded, promptRows }),
    "utf8",
  );
  fs.writeFileSync(inboxPath, buildInboxMarkdown({ jobName, seedTags, similarTags, promptRows }), "utf8");

  console.log(`Prepared gray-brick streetlamp batch: ${jobName}`);
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
