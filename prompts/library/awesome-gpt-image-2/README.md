# Awesome GPT-Image-2 Prompt Library

This library mirrors the curated cases from the sibling `awesome-gpt-image-2-prompts` project into the standalone workflow.
Every case is stored as a self-contained Markdown folder with its result image so the workflow can browse, reuse, and queue prompts without depending on the source repository layout.

## Included Sections

| Section | Folder | Cases | Suggested workflow use |
| --- | --- | ---: | --- |
| Portrait & Photography Cases | [portraits](./portraits/README.md) | 18 | Primary fit: real-human. Add subject, scene, appeal, and safety normalization before queue export. |
| Poster & Illustration Cases | [posters](./posters/README.md) | 43 | Mixed fit: 2d-anime, 3d, or real-human depending on composition. Tag by deliverable type first. |
| Character Design Cases | [characters](./characters/README.md) | 7 | Primary fit: 2d-anime or stylized 3d. Add character role, costume, and sheet-layout tags before queue export. |
| UI & Social Media Mockup Cases | [ui-mockups](./ui-mockups/README.md) | 24 | Mixed fit: UI, infographic, mockup, and screenshot generation. Add layout and text-density tags before queue export. |
| Comparison & Community Examples | [comparisons](./comparisons/README.md) | 15 | Use as experiment references, A/B tests, and benchmark cases. Add evaluation criteria before queue export. |

Total cases: 107

## Sync

Regenerate this library with:

```bash
python scripts/sync_awesome_prompt_library.py
```
