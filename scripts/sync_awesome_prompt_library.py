#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
from dataclasses import asdict, dataclass
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen


WORKFLOW_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE_ROOT = WORKSPACE_ROOT / "awesome-gpt-image-2-prompts"
DEFAULT_OUTPUT_ROOT = WORKFLOW_ROOT / "prompts" / "library" / "awesome-gpt-image-2"

SECTION_FOLDER_MAP = {
    "Portrait & Photography Cases": "portraits",
    "Poster & Illustration Cases": "posters",
    "Character Design Cases": "characters",
    "UI & Social Media Mockup Cases": "ui-mockups",
    "Comparison & Community Examples": "comparisons",
}

SECTION_IMAGE_PREFIX = {
    "Portrait & Photography Cases": "portrait_case",
    "Poster & Illustration Cases": "poster_case",
    "Character Design Cases": "character_case",
    "UI & Social Media Mockup Cases": "ui_case",
    "Comparison & Community Examples": "comparison_case",
}

SECTION_WORKFLOW_NOTES = {
    "Portrait & Photography Cases": "Primary fit: real-human. Add subject, scene, appeal, and safety normalization before queue export.",
    "Poster & Illustration Cases": "Mixed fit: 2d-anime, 3d, or real-human depending on composition. Tag by deliverable type first.",
    "Character Design Cases": "Primary fit: 2d-anime or stylized 3d. Add character role, costume, and sheet-layout tags before queue export.",
    "UI & Social Media Mockup Cases": "Mixed fit: UI, infographic, mockup, and screenshot generation. Add layout and text-density tags before queue export.",
    "Comparison & Community Examples": "Use as experiment references, A/B tests, and benchmark cases. Add evaluation criteria before queue export.",
}

SECTION_ORDER = list(SECTION_FOLDER_MAP)

SECTION_RE = re.compile(r"^## (?P<title>.+)$")
CASE_RE = re.compile(
    r"^### Case (?P<number>\d+): \[(?P<title>.+?)\]\((?P<case_url>https://[^)]+)\) \(by \[@(?P<author>[^\]]+)\]\((?P<author_url>https://[^)]+)\)\)$"
)
IMAGE_RE = re.compile(r'\.\/images\/(?P<folder>[^/]+)/output\.jpg')


@dataclass
class PromptCase:
    section: str
    sectionFolder: str
    caseNumber: int
    title: str
    slug: str
    caseUrl: str
    author: str
    authorUrl: str
    imageFolder: str
    prompt: str
    sourceReadmeLine: int
    sourceReadmePath: str
    fallbackImageUrl: str = ""
    imageStatus: str = "missing"

    @property
    def caseFolderName(self) -> str:
        return f"case-{self.caseNumber:02d}-{self.slug}"

    @property
    def relativeCaseDir(self) -> Path:
        return Path(self.sectionFolder) / self.caseFolderName


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Sync the awesome-gpt-image-2 prompt gallery into the standalone workflow library.",
    )
    parser.add_argument(
        "--source-root",
        type=Path,
        default=DEFAULT_SOURCE_ROOT,
        help="Path to the awesome-gpt-image-2-prompts repository.",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=DEFAULT_OUTPUT_ROOT,
        help="Path to the generated prompt library root.",
    )
    parser.add_argument(
        "--preserve-existing",
        action="store_true",
        help="Do not remove the existing output root before regenerating files.",
    )
    return parser


def slugify(text: str) -> str:
    lowered = text.lower()
    lowered = re.sub(r"[^a-z0-9]+", "-", lowered)
    lowered = re.sub(r"-{2,}", "-", lowered)
    return lowered.strip("-") or "untitled"


def parse_cases(readme_path: Path) -> list[PromptCase]:
    lines = readme_path.read_text(encoding="utf-8").splitlines()
    cases: list[PromptCase] = []
    current_section: str | None = None
    line_index = 0

    while line_index < len(lines):
        section_match = SECTION_RE.match(lines[line_index])
        if section_match:
            title = section_match.group("title")
            if title in SECTION_FOLDER_MAP:
                current_section = title
            line_index += 1
            continue

        case_match = CASE_RE.match(lines[line_index])
        if not case_match or current_section is None:
            line_index += 1
            continue

        image_folder = ""
        prompt_text = ""
        probe_index = line_index + 1

        while probe_index < len(lines):
            next_line = lines[probe_index]
            if CASE_RE.match(next_line) or (SECTION_RE.match(next_line) and next_line.startswith("## ")):
                break

            if not image_folder:
                image_match = IMAGE_RE.search(next_line)
                if image_match:
                    image_folder = image_match.group("folder")

            if next_line.strip() == "**Prompt:**":
                probe_index += 1
                while probe_index < len(lines) and not lines[probe_index].strip().startswith("```"):
                    probe_index += 1

                if probe_index >= len(lines):
                    raise ValueError(f"Prompt fence not found after line {line_index + 1} in {readme_path}")

                probe_index += 1
                prompt_lines: list[str] = []
                while probe_index < len(lines) and not lines[probe_index].strip().startswith("```"):
                    prompt_lines.append(lines[probe_index])
                    probe_index += 1
                prompt_text = "\n".join(prompt_lines).strip()
                break

            probe_index += 1

        if not image_folder:
            image_folder = f"{SECTION_IMAGE_PREFIX[current_section]}{case_match.group('number')}"
        if not prompt_text:
            raise ValueError(f"Prompt block not found for case at line {line_index + 1} in {readme_path}")

        case = PromptCase(
            section=current_section,
            sectionFolder=SECTION_FOLDER_MAP[current_section],
            caseNumber=int(case_match.group("number")),
            title=case_match.group("title"),
            slug=slugify(case_match.group("title")),
            caseUrl=case_match.group("case_url"),
            author=case_match.group("author"),
            authorUrl=case_match.group("author_url"),
            imageFolder=image_folder,
            prompt=prompt_text,
            sourceReadmeLine=line_index + 1,
            sourceReadmePath=str(readme_path),
        )
        cases.append(case)
        line_index = probe_index + 1

    return cases


def load_media_index(json_path: Path) -> dict[str, str]:
    if not json_path.exists():
        return {}

    records = json.loads(json_path.read_text(encoding="utf-8"))
    index: dict[str, str] = {}
    for record in records:
        media = record.get("media") or []
        first_photo_url = next(
            (item.get("url") for item in media if item.get("type") == "photo" and item.get("url")),
            "",
        )
        if record.get("url") and first_photo_url:
            index[record["url"]] = first_photo_url
    return index


def render_root_readme(cases: list[PromptCase]) -> str:
    lines = [
        "# Awesome GPT-Image-2 Prompt Library",
        "",
        "This library mirrors the curated cases from the sibling `awesome-gpt-image-2-prompts` project into the standalone workflow.",
        "Every case is stored as a self-contained Markdown folder with its result image so the workflow can browse, reuse, and queue prompts without depending on the source repository layout.",
        "",
        "## Included Sections",
        "",
        "| Section | Folder | Cases | Suggested workflow use |",
        "| --- | --- | ---: | --- |",
    ]

    for section in SECTION_ORDER:
        section_cases = [case for case in cases if case.section == section]
        folder = SECTION_FOLDER_MAP[section]
        lines.append(
            f"| {section} | [{folder}](./{folder}/README.md) | {len(section_cases)} | {SECTION_WORKFLOW_NOTES[section]} |"
        )

    lines.extend(
        [
            "",
            f"Total cases: {len(cases)}",
            "",
            "## Sync",
            "",
            "Regenerate this library with:",
            "",
            "```bash",
            "python scripts/sync_awesome_prompt_library.py",
            "```",
        ]
    )
    return "\n".join(lines) + "\n"


def render_section_readme(section: str, cases: list[PromptCase]) -> str:
    lines = [
        f"# {section}",
        "",
        SECTION_WORKFLOW_NOTES[section],
        "",
        "| Case | Title | Author | Prompt doc | Result |",
        "| ---: | --- | --- | --- | --- |",
    ]

    for case in cases:
        case_path = f"./{case.caseFolderName}/README.md"
        result_cell = f"![](./{case.caseFolderName}/output.jpg)" if case.imageStatus != "missing" else "Missing image"
        lines.append(
            f"| {case.caseNumber} | {case.title} | [@{case.author}]({case.authorUrl}) | [{case.caseFolderName}]({case_path}) | {result_cell} |"
        )

    return "\n".join(lines) + "\n"


def render_case_readme(case: PromptCase) -> str:
    lines = [
        f"# {case.title}",
        "",
        "## Source",
        "",
        f"- Section: {case.section}",
        f"- Case: {case.caseNumber}",
        f"- Author: [@{case.author}]({case.authorUrl})",
        f"- Original case: [{case.caseUrl}]({case.caseUrl})",
        f"- Source image folder: `{case.imageFolder}`",
        "",
    ]

    if case.imageStatus != "missing":
        lines.extend(
            [
                "## Result",
                "",
                "![Result](./output.jpg)",
                "",
            ]
        )
    else:
        lines.extend(
            [
                "## Result",
                "",
                "- Result image is not available in the source repository and no downloadable fallback was resolved.",
                "",
            ]
        )

    lines.extend(
        [
        "## Workflow Use",
        "",
        f"- Suggested handling: {SECTION_WORKFLOW_NOTES[case.section]}",
        "- Before queue export, add your own taxonomy tags such as `topCategory`, `subCategory`, `scene`, `appeal`, and `subject`.",
        "",
        "## Prompt",
        "",
        "```text",
        case.prompt,
        "```",
        ]
    )
    return "\n".join(lines) + "\n"


def try_download_image(url: str, destination: Path) -> bool:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urlopen(request, timeout=20) as response, destination.open("wb") as handle:
            shutil.copyfileobj(response, handle)
    except URLError:
        return False
    return True


def write_case(output_root: Path, source_images_root: Path, case: PromptCase) -> PromptCase:
    case_dir = output_root / case.relativeCaseDir
    case_dir.mkdir(parents=True, exist_ok=True)

    source_image_path = source_images_root / case.imageFolder / "output.jpg"
    destination_path = case_dir / "output.jpg"

    if source_image_path.exists():
        shutil.copy2(source_image_path, destination_path)
        case.imageStatus = "local"
    elif case.fallbackImageUrl and try_download_image(case.fallbackImageUrl, destination_path):
        case.imageStatus = "remote"
    else:
        case.imageStatus = "missing"
        if destination_path.exists():
            destination_path.unlink()
        print(f"[warn] Missing image for {case.sectionFolder}/{case.caseFolderName}")

    readme_path = case_dir / "README.md"
    readme_path.write_text(render_case_readme(case), encoding="utf-8")
    return case


def write_library(
    source_root: Path,
    output_root: Path,
    cases: list[PromptCase],
    preserve_existing: bool,
    media_index: dict[str, str],
) -> list[PromptCase]:
    if output_root.exists() and not preserve_existing:
        shutil.rmtree(output_root)

    output_root.mkdir(parents=True, exist_ok=True)
    source_images_root = source_root / "images"
    updated_cases: list[PromptCase] = []

    for section in SECTION_ORDER:
        section_dir = output_root / SECTION_FOLDER_MAP[section]
        section_dir.mkdir(parents=True, exist_ok=True)
        section_cases = [case for case in cases if case.section == section]

        for case in section_cases:
            case.fallbackImageUrl = media_index.get(case.caseUrl, "")
            updated_cases.append(write_case(output_root, source_images_root, case))

        updated_section_cases = [case for case in updated_cases if case.section == section]
        (section_dir / "README.md").write_text(
            render_section_readme(section, updated_section_cases),
            encoding="utf-8",
        )

    (output_root / "README.md").write_text(render_root_readme(updated_cases), encoding="utf-8")
    (output_root / "catalog.json").write_text(
        json.dumps([asdict(case) for case in updated_cases], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return updated_cases


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    source_root = args.source_root.resolve()
    output_root = args.output_root.resolve()
    readme_path = source_root / "README.md"
    json_path = source_root / "gpt_image2_prompts.json"

    if not readme_path.exists():
        raise FileNotFoundError(f"Source README not found: {readme_path}")

    cases = parse_cases(readme_path)
    media_index = load_media_index(json_path)
    cases = write_library(
        source_root=source_root,
        output_root=output_root,
        cases=cases,
        preserve_existing=args.preserve_existing,
        media_index=media_index,
    )

    counts = {
        SECTION_FOLDER_MAP[section]: len([case for case in cases if case.section == section])
        for section in SECTION_ORDER
    }
    print(f"Synced {len(cases)} cases to {output_root}")
    print(json.dumps(counts, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())