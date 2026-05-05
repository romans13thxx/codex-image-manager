# 2026-04-27-shanhaijing-dongfeng-posters

## Goal

Generate GPT Image 2 东风美学海报 for 20 distinct 《山海经》/上古异兽 themes.

Each theme must produce exactly 3 separate images:

- `16:9` landscape, size `2048x1152`
- `9:16` portrait, size `1152x2048`
- `4:3` standard poster, size `2048x1536`

## Status

Blocked from live generation because `OPENAI_API_KEY` is not set in the current shell.

Prepared:

- Batch input: `tmp/imagegen/2026-04-27-shanhaijing-dongfeng-posters.jsonl`
- Intended output directory: `output/imagegen/2026-04-27-shanhaijing-dongfeng-posters/`

## Execution Command

```powershell
python "$env:CODEX_HOME\skills\.system\imagegen\scripts\image_gen.py" generate-batch `
  --input tmp/imagegen/2026-04-27-shanhaijing-dongfeng-posters.jsonl `
  --out-dir output/imagegen/2026-04-27-shanhaijing-dongfeng-posters `
  --concurrency 3
```

## Required Count

- Themes: 20
- Images per theme: 3
- Total images: 60

## Aspect Rules

Every theme has three independent jobs. Do not use `n=3`; each aspect ratio needs its own prompt and its own size.

