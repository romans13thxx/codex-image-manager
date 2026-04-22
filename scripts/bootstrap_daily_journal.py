#!/usr/bin/env python3
from __future__ import annotations

import argparse
from datetime import date
from pathlib import Path


WORKFLOW_ROOT = Path(__file__).resolve().parents[1]
JOURNAL_ROOT = WORKFLOW_ROOT / "memory" / "journals" / "daily"
TEMPLATE_PATH = JOURNAL_ROOT / "TEMPLATE.md"
LEGACY_TEMPLATE_PATH = WORKFLOW_ROOT / "memory" / "daily-journal" / "TEMPLATE.md"


DEFAULT_TEMPLATE = """# {{DATE}} 出图日记

## 今日目标

- 

## 今日任务单

- 

## 成功结果

- 

## 失败原因

- 

## 待验证假设

- 

## 可以提升为长期记忆的候选

- 

## 明日继续

- 
"""


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Create today's image generation daily journal if it does not exist.",
    )
    parser.add_argument(
        "--date",
        dest="journal_date",
        default=date.today().isoformat(),
        help="Journal date in YYYY-MM-DD format. Defaults to today.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite the target file if it already exists.",
    )
    return parser


def load_template() -> str:
    if TEMPLATE_PATH.exists():
        return TEMPLATE_PATH.read_text(encoding="utf-8")
    if LEGACY_TEMPLATE_PATH.exists():
        return LEGACY_TEMPLATE_PATH.read_text(encoding="utf-8")
    return DEFAULT_TEMPLATE


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    journal_year = args.journal_date[:4]
    target_dir = JOURNAL_ROOT / journal_year
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{args.journal_date}.md"

    if target_path.exists() and not args.force:
        print(f"Journal already exists: {target_path}")
        return 0

    content = load_template().replace("{{DATE}}", args.journal_date)
    target_path.write_text(content, encoding="utf-8")
    print(f"Created journal: {target_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())