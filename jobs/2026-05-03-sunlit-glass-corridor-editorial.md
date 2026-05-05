# 2026-05-03-sunlit-glass-corridor-editorial

## Goal

Generate a reusable adult real-human fashion editorial image set based on the user-provided sunlit glass corridor references.

The set should preserve:

- glass corridor / campus lobby background
- hard sunlight, bloom, window-grid geometry, glossy floor reflections
- adult fashion model with rose-gold hair
- ivory knit top, beige plaid skirt, black belt, white socks, chunky black shoes
- white quilted bag/backpack and window/block props
- pose continuity across lean, walking, crouch, and window-touch frames
- optional faint screenshot UI layer

Avoid copying:

- exact face or identity from references
- minors or school-uniform coding
- watermarks, readable social UI, platform names, usernames, hashtags
- brand logos and random text

## Taxonomy

- `topCategory`: `real-human`
- `subCategory`: `fashion-editorial`
- `scene`: `indoor-home` in current taxonomy; actual scene is public glass corridor.
- `skinTone`: `light`
- `appeal`: `cute`
- `subject`: `female`

## Prompt Source

- `memory/projects/active/sunlit-glass-corridor-editorial/prompts.md`
- `prompts/library/2026-05-03-sunlit-glass-corridor-editorial.md`

## Initial Generation Plan

Generate four images first:

- `v01-vending-block-lean`
- `v03-corridor-walk-spin`
- `v04-window-crouch`
- `v05-window-touch-turn`

Expected final archive:

- Raw backup: `output/backups/codex/2026-05-03/2026-05-03-sunlit-glass-corridor-editorial/`
- Organized raw: `output/images/2026-05-03/real-human/fashion-editorial/indoor-home/light/cute/`
- Selected: `output/selected/2026-05-03/real-human/fashion-editorial/indoor-home/light/cute/`
- Manifest: `jobs/results-manifests/2026-05-03-sunlit-glass-corridor-editorial.json`
- Report: `output/reports/2026-05-03-sunlit-glass-corridor-editorial-selection-report.md`

## Status

Prepared manually because the local Python runtime is the Microsoft Store placeholder, so `rare-style-explorer/scripts/explore_styles.py` and organizer scripts are not runnable in this shell.

