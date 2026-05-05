---
name: auto-image-workflow
description: Orchestrate local image generation from prompt sources, memory files, and review rules, then save outputs and logs into the current workspace.
---

# Auto Image Workflow

Use this skill when the user wants fully automated local image generation, batch generation, or iterative prompt production.

## Primary inputs (read in this order)

1. `workflow/config/image-workflow.local.json` if it exists, otherwise `workflow/config/image-workflow.example.json`.
2. `workflow/config/taxonomy/style-taxonomy.json`.
3. `workflow/memory/permanent/file-management-playbook.md`.
4. `workflow/memory/permanent/daily-workflow-playbook.md`.
5. `workflow/memory/permanent/` (style-library, lessons-learned, pitfalls).
6. `workflow/memory/preferences/category-profiles/{2d-anime,3d,real-human}.md`.
7. The latest file under `workflow/memory/journals/daily/<year>/`.
8. Any active project under `workflow/memory/projects/active/<slug>/` that matches the job.
9. `workflow/memory/permanent-memory.md` and `workflow/memory/user-preferences.md` (index stubs only — never write here).
10. Prompt sources: `workflow/prompts/queue/`, `workflow/prompts/inbox/`, `gpt_image2_prompts.json`.

## Capability preflight

Before starting generation, verify at least one of these is true:

1. The current Codex runtime exposes a real image-generation capability.
2. The workspace or user has a configured external image API and a valid writable output path.

If neither is true:

- Do not say generation has started.
- Do not load or cite guessed system paths such as `C:/Users/wf/.codex/skills/system/imaggen/SKILL.md`.
- Switch to fallback mode: refresh the queue, create the job manifest, prepare the review checklist and daily journal entry, and optionally run `scripts/import_codex_outputs.py` for already-generated files.

## Required workflow

When the user says `开始出图`, `批量出图`, `自动出图`, or `开始今天的出图流程`:

1. Run the capability preflight above. If it fails, stop after the fallback artifacts and do not fabricate image output.
2. Normalize the user's goal into a job spec; pin a `jobName` of the form `YYYY-MM-DD-<slug>`.
3. Ensure today's daily journal exists (`workflow/memory/journals/daily/<year>/<date>.md`). Run `bootstrap_daily_journal.py` if missing.
4. Refresh `workflow/prompts/queue/prompt_queue.jsonl` through `export_prompt_queue.py` — every entry must carry `topCategory`, `subCategory`, `scene`, `skinTone`, `appeal`, `subject`. Reject entries with missing axes; fix at the queue stage, not downstream.
5. Create a job manifest under `workflow/jobs/<jobName>.md` (or `.json`) before any generation.
6. For each prompt, generate the configured number of variants (default 3). Assign `2d-anime` / `3d` / `real-human` and the correct subcategory.
7. Save raw variants under `workflow/output/images/<date>/<topCategory>/<subCategory>/<scene>/<skinTone>/<appeal>/`.
8. Save the selected winner under `workflow/output/selected/<date>/...` using the same nested path.
9. Update `workflow/jobs/results-manifests/<jobName>.json` with `sourceFiles`, `selectedSourceIndex`, `selectionReason`, `failureReasons`.
10. Run `organize_batch_outputs.py --manifest ...` to enforce naming, produce the normalized manifest, and generate the selection report under `workflow/output/reports/`.
11. Append the outcome to the daily journal: 分类概览, 成功结果, 失败原因, 命名与归档记录, 选图报告回链, 待验证假设, 可提升为长期记忆的候选.
12. At end of day, only the "可提升" candidates confirmed ≥ 3 times move into `workflow/memory/permanent/` or `workflow/memory/preferences/`.
13. For a named project, write project-specific lessons into `workflow/memory/projects/active/<slug>/lessons.md` instead of permanent memory.

If Codex generated images outside the workflow tree first:

1. Run `scripts/import_codex_outputs.py` before `organize_batch_outputs.py`.
2. Let it copy the images into `workflow/output/backups/codex/<date>/<jobName>/`.
3. Use those backup copies as the only allowed `sourceFiles` entries for the manifest.

## File management discipline (teach the user by following it)

- Never put an image at the top of `workflow/output/images/`; always follow the seven-layer path in the file management playbook.
- Never rename a file that already lives under `selected/`. If the name is wrong, fix the manifest and re-run `organize_batch_outputs.py`.
- Never reuse the same `jobName` across days — always prefix with `YYYY-MM-DD-`.
- Never let Codex copy images from ad-hoc paths; every source must appear in `sourceFiles` of the manifest.
- Never write into `permanent-memory.md` or `user-preferences.md` — they are index stubs only.

## Daily folder management (teach the user by enforcing it)

- The date subfolder `YYYY-MM-DD/` under `output/images/` and `output/selected/` is created automatically by `organize_batch_outputs.py` when `output.dailySubfolder` is true (default).
- At most one daily journal per calendar date. Use `bootstrap_daily_journal.py --date YYYY-MM-DD --force` only if the user explicitly wants to rebuild it.
- Weekly rollups go to `workflow/memory/journals/weekly/<YYYY>/<YYYY-WW>.md` using the provided TEMPLATE.
- Monthly rollups go to `workflow/memory/journals/monthly/<YYYY>/<YYYY-MM>.md` using the provided TEMPLATE.
- When a project finishes, move `workflow/memory/projects/active/<slug>/` to `workflow/memory/projects/archived/<YYYY-MM>-<slug>/`.

## Per-category style management

Before generating for any category, load the matching preference + style-library file pair:

| Category | Preferences file | Style library |
| --- | --- | --- |
| 2d-anime | `preferences/category-profiles/2d-anime.md` | `permanent/style-library/2d-anime/<subcategory>.md` |
| 3d | `preferences/category-profiles/3d.md` | `permanent/style-library/3d/<subcategory>.md` |
| real-human | `preferences/category-profiles/real-human.md` | `permanent/style-library/real-human/<subcategory>.md` |

Rules:

- Preferences define taste; style-library defines proven patterns. If they conflict for a one-off, preferences win. For a project, project `style-guide.md` wins.
- Do not mix style rules across categories. Real-human prompts must not borrow from 2d-anime style-library and vice versa.

## Quality bar

- Reject anatomy errors, unreadable typography, watermarks, severe identity drift, unusable composition.
- Every selected image must be traceable to a specific prompt id, manifest entry, and job name.
- Do not overwrite existing output files. If a collision is detected, bump the sequence and update the manifest.
- If image generation is unavailable, still produce the queue, naming plan, job manifest, review checklist, and next-step report so work can resume deterministically.

## Report format

Always report back to the user:

- Prompts or queue range used.
- Output paths written (including the date subfolder).
- Category folders touched.
- Which images were selected and why.
- Which failures need another iteration.
- Which memory items are promotion candidates (and which file they will land in).
