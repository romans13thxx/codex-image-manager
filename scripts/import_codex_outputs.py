#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

WORKFLOW_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = WORKFLOW_ROOT.parent
DEFAULT_BACKUP_ROOT = WORKFLOW_ROOT / "output" / "backups" / "codex"
DEFAULT_MANIFEST_ROOT = WORKFLOW_ROOT / "jobs" / "results-manifests"
ORGANIZER_SCRIPT = WORKFLOW_ROOT / "scripts" / "organize_batch_outputs.py"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Backup Codex-generated images into the workflow and create a results manifest.",
    )
    parser.add_argument(
        "--source",
        type=Path,
        action="append",
        required=True,
        help="Source file or directory containing Codex-generated images. Repeat the flag for multiple sources.",
    )
    parser.add_argument(
        "--recursive",
        action="store_true",
        help="Recursively scan directory sources for image files.",
    )
    parser.add_argument("--job-name", required=True, help="Job name, ideally prefixed with YYYY-MM-DD-.")
    parser.add_argument("--title", required=True, help="Human-readable title for the manifest entry.")
    parser.add_argument("--prompt-id", default=None, help="Prompt id stored in the manifest. Defaults to a slug from job name.")
    parser.add_argument("--date", default=None, help="Optional backup date override in YYYY-MM-DD format.")
    parser.add_argument("--top-category", required=True, help="Top category such as 2d-anime, 3d, or real-human.")
    parser.add_argument("--sub-category", required=True, help="Subcategory such as home-lifestyle or shonen.")
    parser.add_argument("--scene", required=True, help="Scene tag such as indoor-home or studio.")
    parser.add_argument("--skin-tone", required=True, help="Skin tone tag such as light, warm-yellow, or dark.")
    parser.add_argument("--appeal", required=True, help="Appeal tag such as cute, elegant, or cinematic.")
    parser.add_argument("--subject", required=True, help="Subject tag such as female, male, or mixed.")
    parser.add_argument("--selected-index", type=int, default=1, help="1-based index of the selected source file.")
    parser.add_argument(
        "--selection-reason",
        default="Imported from a Codex generation batch and preserved in the workflow backup.",
        help="Selection reason written to the manifest entry.",
    )
    parser.add_argument(
        "--failure-reason",
        action="append",
        default=[],
        help="Failure reason for non-selected variants. Repeat for multiple reasons.",
    )
    parser.add_argument(
        "--backup-root",
        type=Path,
        default=DEFAULT_BACKUP_ROOT,
        help="Root directory for Codex backup copies inside the workflow.",
    )
    parser.add_argument(
        "--manifest-root",
        type=Path,
        default=DEFAULT_MANIFEST_ROOT,
        help="Directory where the generated manifest should be written.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview the backup + manifest + organizer flow without copying files.",
    )
    parser.add_argument(
        "--no-organize",
        action="store_true",
        help="Only back up files and write the manifest. Skip organize_batch_outputs.py.",
    )
    return parser


def slugify(value: str) -> str:
    token = value.strip().lower()
    result = []
    previous_dash = False
    for char in token:
        if char.isalnum():
            result.append(char)
            previous_dash = False
        else:
            if not previous_dash:
                result.append("-")
                previous_dash = True
    return "".join(result).strip("-") or "item"


def resolve_job_date(job_name: str, override: str | None) -> str:
    if override:
        datetime.strptime(override, "%Y-%m-%d")
        return override

    prefix = job_name[:10]
    try:
        datetime.strptime(prefix, "%Y-%m-%d")
        return prefix
    except ValueError:
        return date.today().isoformat()


def iter_directory_images(directory: Path, recursive: bool) -> list[Path]:
    pattern = "**/*" if recursive else "*"
    return sorted(
        path for path in directory.glob(pattern) if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def collect_source_files(sources: list[Path], recursive: bool) -> list[Path]:
    resolved: list[Path] = []
    for source in sources:
        candidate = source.resolve()
        if not candidate.exists():
            raise FileNotFoundError(f"Source path does not exist: {candidate}")
        if candidate.is_dir():
            resolved.extend(iter_directory_images(candidate, recursive=recursive))
            continue
        if candidate.suffix.lower() not in IMAGE_EXTENSIONS:
            raise ValueError(f"Unsupported image extension: {candidate}")
        resolved.append(candidate)

    unique: list[Path] = []
    seen: set[Path] = set()
    for path in resolved:
        if path in seen:
            continue
        seen.add(path)
        unique.append(path)

    if not unique:
        raise ValueError("No image files found in the provided sources.")
    return unique


def build_backup_dir(backup_root: Path, job_date: str, job_name: str) -> Path:
    return backup_root.resolve() / job_date / slugify(job_name)


def copy_backup_files(source_files: list[Path], backup_dir: Path, dry_run: bool) -> tuple[list[str], list[str]]:
    if not dry_run:
        backup_dir.mkdir(parents=True, exist_ok=True)

    backup_relative_paths: list[str] = []
    original_paths: list[str] = []
    for index, source_path in enumerate(source_files, start=1):
        suffix = source_path.suffix.lower() or ".png"
        backup_name = f"{index:03d}-{slugify(source_path.stem)}{suffix}"
        target_path = backup_dir / backup_name
        if not dry_run:
            shutil.copy2(source_path, target_path)

        backup_relative_paths.append(str(target_path.relative_to(REPO_ROOT)).replace("\\", "/"))
        original_paths.append(str(source_path))
    return backup_relative_paths, original_paths


def build_manifest(
    args: argparse.Namespace,
    job_date: str,
    backup_dir: Path,
    backup_relative_paths: list[str],
    original_paths: list[str],
) -> dict:
    return {
        "jobName": args.job_name,
        "jobDate": job_date,
        "reportName": f"{args.job_name}-selection-report.md",
        "sourceType": "codex-import",
        "backupDir": str(backup_dir.relative_to(REPO_ROOT)).replace("\\", "/"),
        "entries": [
            {
                "sequence": 1,
                "promptId": args.prompt_id or slugify(args.job_name),
                "title": args.title,
                "topCategory": args.top_category,
                "subCategory": args.sub_category,
                "scene": args.scene,
                "skinTone": args.skin_tone,
                "appeal": args.appeal,
                "subject": args.subject,
                "sourceFiles": backup_relative_paths,
                "originalSourceFiles": original_paths,
                "selectedSourceIndex": args.selected_index,
                "selectionReason": args.selection_reason,
                "failureReasons": args.failure_reason,
            }
        ],
    }


def write_manifest(manifest: dict, manifest_path: Path, dry_run: bool) -> None:
    if dry_run:
        return
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def cleanup_file(path: Path) -> None:
    if path.exists():
        path.unlink()


def run_organizer(manifest_path: Path, dry_run: bool) -> None:
    command = [sys.executable, str(ORGANIZER_SCRIPT), "--manifest", str(manifest_path)]
    if dry_run:
        command.append("--dry-run")
    completed = subprocess.run(command, check=False, capture_output=True, text=True)
    if completed.stdout:
        print(completed.stdout.rstrip())
    if completed.stderr:
        print(completed.stderr.rstrip(), file=sys.stderr)
    if completed.returncode != 0:
        raise RuntimeError(f"organize_batch_outputs.py failed with exit code {completed.returncode}")


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    source_files = collect_source_files(args.source, recursive=args.recursive)
    if args.selected_index < 1 or args.selected_index > len(source_files):
        raise ValueError(f"selected-index must be between 1 and {len(source_files)}")

    job_date = resolve_job_date(args.job_name, args.date)
    backup_dir = build_backup_dir(args.backup_root, job_date, args.job_name)
    manifest_path = args.manifest_root.resolve() / f"{args.job_name}.json"

    backup_relative_paths, original_paths = copy_backup_files(
        source_files=source_files,
        backup_dir=backup_dir,
        dry_run=args.dry_run,
    )
    manifest = build_manifest(
        args=args,
        job_date=job_date,
        backup_dir=backup_dir,
        backup_relative_paths=backup_relative_paths,
        original_paths=original_paths,
    )
    write_manifest(manifest=manifest, manifest_path=manifest_path, dry_run=args.dry_run)

    print(f"Prepared {len(source_files)} source image(s) for job {args.job_name}")
    print(f"Backup directory: {backup_dir}")
    print(f"Manifest path: {manifest_path}")
    print(f"Selected source index: {args.selected_index}")

    if args.no_organize:
        print("Organizer step skipped (--no-organize).")
        if args.dry_run:
            print("Dry run only; no files were copied and no manifest was written.")
        return 0

    if args.dry_run:
        dry_run_stem = f".{slugify(args.job_name)}-dry-run"
        dry_run_manifest_path = manifest_path.with_name(f"{dry_run_stem}.json")
        dry_run_manifest = dict(manifest)
        dry_run_manifest["reportName"] = f"{dry_run_stem}-selection-report.md"
        dry_run_manifest_path.parent.mkdir(parents=True, exist_ok=True)
        dry_run_manifest_path.write_text(json.dumps(dry_run_manifest, ensure_ascii=False, indent=2), encoding="utf-8")
        try:
            run_organizer(manifest_path=dry_run_manifest_path, dry_run=True)
        finally:
            cleanup_file(dry_run_manifest_path)
            cleanup_file(dry_run_manifest_path.with_name(f"{dry_run_manifest_path.stem}.normalized.json"))
            cleanup_file(WORKFLOW_ROOT / "output" / "reports" / dry_run_manifest["reportName"])
        print("Dry run only; backup copy and manifest write were rolled back after validation.")
        return 0

    run_organizer(manifest_path=manifest_path, dry_run=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())