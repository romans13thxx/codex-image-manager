#!/usr/bin/env python3
"""Scaffold a new project memory folder under workflow/memory/projects/active/.

Usage:
    python workflow/scripts/new_project.py --name "spring-campaign-2026" \
        --category real-human --description "Client portraits for spring campaign"
"""
from __future__ import annotations

import argparse
import re
from datetime import date
from pathlib import Path


WORKFLOW_ROOT = Path(__file__).resolve().parents[1]
PROJECTS_ROOT = WORKFLOW_ROOT / "memory" / "projects" / "active"


def slugify(value: str) -> str:
    lowered = value.strip().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", lowered)
    return slug.strip("-") or "project"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scaffold a new active project memory folder.")
    parser.add_argument("--name", required=True, help="Project human name.")
    parser.add_argument(
        "--category",
        choices=["2d-anime", "3d", "real-human", "mixed"],
        default="mixed",
        help="Primary top-category.",
    )
    parser.add_argument("--description", default="", help="One-line description.")
    parser.add_argument("--force", action="store_true", help="Overwrite if exists.")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    slug = slugify(args.name)
    project_dir = PROJECTS_ROOT / slug
    if project_dir.exists() and not args.force:
        print(f"Project already exists: {project_dir}")
        return 1
    project_dir.mkdir(parents=True, exist_ok=True)

    today = date.today().isoformat()

    files = {
        "README.md": (
            f"# {args.name}\n\n"
            f"- slug: `{slug}`\n"
            f"- 主分类: `{args.category}`\n"
            f"- 开始日期: {today}\n"
            f"- 描述: {args.description or '（待补充）'}\n\n"
            "## 目标\n\n- \n\n"
            "## 关键里程碑\n\n- \n\n"
            "## 关联任务（job manifests）\n\n- \n\n"
            "## 收尾条件\n\n- 满足后将目录迁到 `workflow/memory/projects/archived/<YYYY-MM>-"
            f"{slug}/`。\n"
        ),
        "style-guide.md": (
            f"# {args.name} — 风格手册\n\n"
            "> 项目级风格约束。和 `preferences/` 冲突时，本文件优先。\n\n"
            "## 必须遵守\n\n- \n\n"
            "## 尽量遵守\n\n- \n\n"
            "## 禁忌\n\n- \n"
        ),
        "lessons.md": (
            f"# {args.name} — 项目教训\n\n"
            "## 成功\n\n- \n\n"
            "## 失败\n\n- \n\n"
            "## 待验证\n\n- \n"
        ),
        "prompts.md": (
            f"# {args.name} — 项目 prompt 片段\n\n"
            "> 不进 queue 的常驻片段：角色身份锁、品牌色卡、固定道具等。\n\n"
            "## 身份锁\n\n- \n\n"
            "## 品牌/主题\n\n- \n\n"
            "## 负面约束\n\n- \n"
        ),
    }

    for name, content in files.items():
        target = project_dir / name
        if target.exists() and not args.force:
            continue
        target.write_text(content, encoding="utf-8")

    print(f"Created project: {project_dir}")
    for name in files:
        print(f"  - {(project_dir / name).relative_to(WORKFLOW_ROOT.parent)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
