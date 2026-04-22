#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path

REQUIRED_AXES = ("topCategory", "subCategory", "scene", "skinTone", "appeal", "subject")

WORKFLOW_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = WORKFLOW_ROOT.parent
DEFAULT_LOCAL_CONFIG = WORKFLOW_ROOT / "config" / "image-workflow.local.json"
DEFAULT_CONFIG = WORKFLOW_ROOT / "config" / "image-workflow.example.json"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Organize batch outputs into category folders and generate a selection report.",
    )
    parser.add_argument("--manifest", type=Path, required=True, help="Path to the results manifest JSON file.")
    parser.add_argument("--config", type=Path, default=None, help="Optional workflow config path.")
    parser.add_argument("--dry-run", action="store_true", help="Preview planned names and report output without copying files.")
    parser.add_argument("--date", default=None, help="Date subfolder override (YYYY-MM-DD). Defaults to manifest jobDate or today.")
    parser.add_argument("--no-date-subfolder", action="store_true", help="Disable the YYYY-MM-DD subfolder even if the config enables it.")
    parser.add_argument("--strict", action="store_true", help="Fail if any manifest entry is missing a required taxonomy axis.")
    return parser


def resolve_date_subfolder(manifest: dict, override: str | None) -> str:
    if override:
        datetime.strptime(override, "%Y-%m-%d")
        return override
    job_date = manifest.get("jobDate")
    if job_date:
        datetime.strptime(job_date, "%Y-%m-%d")
        return job_date
    job_name = manifest.get("jobName", "")
    match = re.match(r"(\d{4}-\d{2}-\d{2})", job_name)
    if match:
        return match.group(1)
    return date.today().isoformat()


def validate_entry_axes(entry: dict) -> list[str]:
    return [axis for axis in REQUIRED_AXES if not entry.get(axis)]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def resolve_config(config_path: Path | None) -> Path:
    if config_path is not None:
        return config_path.resolve()
    if DEFAULT_LOCAL_CONFIG.exists():
        return DEFAULT_LOCAL_CONFIG
    return DEFAULT_CONFIG


def slugify(value: str) -> str:
    lowered = value.strip().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", lowered)
    return slug.strip("-") or "item"


def resolve_source(path_value: str, manifest_parent: Path) -> Path:
    source_path = Path(path_value)
    if source_path.is_absolute():
        return source_path
    candidate = (manifest_parent / source_path).resolve()
    if candidate.exists():
        return candidate
    return (REPO_ROOT / source_path).resolve()


def build_base_name(entry: dict, prefix: str, width: int) -> str:
    tokens = [
        prefix,
        f"{int(entry.get('sequence', 0)):0{width}d}",
        entry.get("topCategory", ""),
        entry.get("subCategory", ""),
        entry.get("scene", ""),
        entry.get("skinTone", ""),
        entry.get("appeal", ""),
        entry.get("subject", ""),
    ]
    return "-".join(slugify(token) for token in tokens if token)


def build_output_dir(base_dir: Path, entry: dict) -> Path:
    parts = [
        entry.get("topCategory", "unsorted"),
        entry.get("subCategory", "general"),
        entry.get("scene", "general"),
        entry.get("skinTone", "general"),
        entry.get("appeal", "general"),
    ]
    resolved = base_dir
    for part in parts:
        resolved /= slugify(part)
    return resolved


def copy_variants(
    entry: dict,
    manifest_parent: Path,
    draft_dir: Path,
    selected_dir: Path,
    prefix: str,
    width: int,
    dry_run: bool,
) -> dict:
    base_name = build_base_name(entry, prefix=prefix, width=width)
    raw_target_dir = build_output_dir(draft_dir, entry)
    selected_target_dir = build_output_dir(selected_dir, entry)
    raw_target_dir.mkdir(parents=True, exist_ok=True)
    selected_target_dir.mkdir(parents=True, exist_ok=True)

    source_files = entry.get("sourceFiles", [])
    copied_variants: list[str] = []
    selected_file = ""
    selected_index = int(entry.get("selectedSourceIndex", 1))

    for index, source in enumerate(source_files, start=1):
        source_path = resolve_source(source, manifest_parent=manifest_parent)
        suffix = source_path.suffix or ".png"
        target_path = raw_target_dir / f"{base_name}-v{index}{suffix}"
        copied_variants.append(str(target_path.relative_to(REPO_ROOT)))

        if not dry_run and source_path.exists():
            shutil.copy2(source_path, target_path)

        if index == selected_index:
            selected_path = selected_target_dir / f"{base_name}-final{suffix}"
            selected_file = str(selected_path.relative_to(REPO_ROOT))
            if not dry_run and source_path.exists():
                shutil.copy2(source_path, selected_path)

    if not source_files:
        selected_file = str((selected_target_dir / f"{base_name}-final.png").relative_to(REPO_ROOT))

    return {
        "baseName": base_name,
        "rawDir": str(raw_target_dir.relative_to(REPO_ROOT)),
        "selectedDir": str(selected_target_dir.relative_to(REPO_ROOT)),
        "variantFiles": copied_variants,
        "selectedFile": selected_file,
    }


def resolve_label(taxonomy: dict, axis: str, key: str) -> str:
    if not key:
        return "未指定"
    if axis == "topCategory":
        return taxonomy["topCategories"].get(key, {}).get("label", key)
    if axis == "subCategory":
        top_category = taxonomy["topCategories"].get(key.split(":")[0], {})
        return top_category.get("subcategories", {}).get(key.split(":")[-1], key)
    return taxonomy.get("axes", {}).get(axis, {}).get(key, key)


def build_report(job_name: str, entries: list[dict], taxonomy: dict) -> str:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for entry in entries:
        grouped[entry["topCategory"]].append(entry)

    lines = [f"# {job_name} 选图报告", "", "## 总览", ""]
    lines.append(f"- 条目总数：{len(entries)}")
    for top_category, items in grouped.items():
        label = resolve_label(taxonomy, "topCategory", top_category)
        lines.append(f"- {label}：{len(items)}")

    for top_category, items in grouped.items():
        label = resolve_label(taxonomy, "topCategory", top_category)
        lines.extend(["", f"## {label}", ""])

        for item in items:
            category = taxonomy["topCategories"].get(item["topCategory"], {})
            sub_label = category.get("subcategories", {}).get(item["subCategory"], item["subCategory"])
            scene_label = resolve_label(taxonomy, "scene", item.get("scene", ""))
            skin_label = resolve_label(taxonomy, "skinTone", item.get("skinTone", ""))
            appeal_label = resolve_label(taxonomy, "appeal", item.get("appeal", ""))
            subject_label = resolve_label(taxonomy, "subject", item.get("subject", ""))
            lines.append(f"### {item['sequence']:03d} {item.get('title', item.get('promptId', '未命名条目'))}")
            lines.append("")
            lines.append(f"- 子类：{sub_label}")
            lines.append(f"- 场景：{scene_label}")
            lines.append(f"- 肤色：{skin_label}")
            lines.append(f"- 气质：{appeal_label}")
            lines.append(f"- 主体：{subject_label}")
            lines.append(f"- 入选文件：{item['selectedFile']}")
            lines.append(f"- 选中原因：{item.get('selectionReason', '待补充')}")
            failure_reasons = item.get("failureReasons", [])
            if failure_reasons:
                lines.append(f"- 失败原因：{'；'.join(failure_reasons)}")
            else:
                lines.append("- 失败原因：无")
            lines.append("")

    return "\n".join(lines).strip() + "\n"


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    manifest_path = args.manifest.resolve()
    config_path = resolve_config(args.config)
    config = load_json(config_path)
    taxonomy_path = (REPO_ROOT / config["taxonomy"]["path"]).resolve()
    taxonomy = load_json(taxonomy_path)
    manifest = load_json(manifest_path)

    draft_dir = (REPO_ROOT / config["output"]["draftDir"]).resolve()
    selected_dir = (REPO_ROOT / config["output"]["selectedDir"]).resolve()
    report_dir = (REPO_ROOT / config["output"]["reportDir"]).resolve()
    report_dir.mkdir(parents=True, exist_ok=True)

    use_date_subfolder = bool(config.get("output", {}).get("dailySubfolder", True))
    if args.no_date_subfolder:
        use_date_subfolder = False
    date_subfolder = resolve_date_subfolder(manifest, args.date) if use_date_subfolder else ""
    if date_subfolder:
        draft_dir = draft_dir / date_subfolder
        selected_dir = selected_dir / date_subfolder

    has_missing_axes = False
    for entry in manifest.get("entries", []):
        missing = validate_entry_axes(entry)
        if missing:
            has_missing_axes = True
            print(
                f"[warn] entry seq={entry.get('sequence', '?')} id={entry.get('promptId', '?')} "
                f"missing axes: {', '.join(missing)} (will fall back to 'general')",
                file=sys.stderr,
            )
    if has_missing_axes and args.strict:
        print("[error] --strict set and missing axes detected. Aborting.", file=sys.stderr)
        return 2

    prefix = config["generationDefaults"]["filenamePrefix"]
    width = int(config["generationDefaults"]["numberWidth"])

    normalized_entries = []
    for entry in manifest.get("entries", []):
        naming_result = copy_variants(
            entry=entry,
            manifest_parent=manifest_path.parent,
            draft_dir=draft_dir,
            selected_dir=selected_dir,
            prefix=prefix,
            width=width,
            dry_run=args.dry_run,
        )
        normalized_entry = dict(entry)
        normalized_entry.update(naming_result)
        normalized_entries.append(normalized_entry)

    report_name = manifest.get("reportName") or f"{manifest.get('jobName', 'batch')}-selection-report.md"
    report_path = report_dir / report_name
    report_content = build_report(
        job_name=manifest.get("jobName", "batch"),
        entries=normalized_entries,
        taxonomy=taxonomy,
    )
    report_path.write_text(report_content, encoding="utf-8")

    normalized_manifest_path = manifest_path.with_name(f"{manifest_path.stem}.normalized.json")
    normalized_manifest = {
        "jobName": manifest.get("jobName"),
        "jobDate": manifest.get("jobDate"),
        "dateSubfolder": date_subfolder,
        "report": str(report_path.relative_to(REPO_ROOT)),
        "dryRun": args.dry_run,
        "entries": normalized_entries,
    }
    normalized_manifest_path.write_text(
        json.dumps(normalized_manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    action = "Planned" if args.dry_run else "Organized"
    suffix = f" under date subfolder {date_subfolder}" if date_subfolder else ""
    print(f"{action} {len(normalized_entries)} entries{suffix}")
    if args.dry_run:
        print("  seq  top/sub/scene/skin/appeal -> selected dir")
        for item in normalized_entries:
            print(
                f"  {int(item.get('sequence', 0)):03d}  "
                f"{item.get('topCategory', '?')}/{item.get('subCategory', '?')}/"
                f"{item.get('scene', '?')}/{item.get('skinTone', '?')}/"
                f"{item.get('appeal', '?')} -> {item['selectedDir']}"
            )
    print(f"Report written to {report_path}")
    print(f"Normalized manifest written to {normalized_manifest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
