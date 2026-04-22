#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = REPO_ROOT / "gpt_image2_prompts.json"
DEFAULT_OUTPUT = REPO_ROOT / "workflow" / "prompts" / "queue" / "prompt_queue.jsonl"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Export a normalized prompt queue from gpt_image2_prompts.json.",
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help="Path to the source JSON file.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Path to the output JSONL queue.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Maximum number of prompts to export.",
    )
    parser.add_argument(
        "--lang",
        action="append",
        default=[],
        help="Filter by language. Repeat the flag for multiple languages.",
    )
    parser.add_argument(
        "--keyword",
        default=None,
        help="Case-insensitive keyword filter applied to prompt text.",
    )
    parser.add_argument(
        "--variants",
        type=int,
        default=3,
        help="Default variant count for each exported prompt.",
    )
    parser.add_argument(
        "--top-category",
        default="unsorted",
        help="Top category such as 2d-anime, 3d, or real-human.",
    )
    parser.add_argument(
        "--sub-category",
        default="general",
        help="Subcategory inside the top category.",
    )
    parser.add_argument(
        "--scene",
        default="",
        help="Scene tag such as indoor-home or outdoor-street.",
    )
    parser.add_argument(
        "--skin-tone",
        default="",
        help="Skin tone tag such as light, warm-yellow, or dark.",
    )
    parser.add_argument(
        "--appeal",
        default="",
        help="Appeal tag such as cute, sexy, or elegant.",
    )
    parser.add_argument(
        "--subject",
        default="",
        help="Subject tag such as female, male, or androgynous.",
    )
    parser.add_argument(
        "--style-tag",
        action="append",
        default=[],
        help="Additional style tag. Repeat the flag for multiple tags.",
    )
    return parser


def normalize_prompt(text: str) -> str:
    return " ".join(text.split())


def matches_filters(record: dict, languages: set[str], keyword: str | None) -> bool:
    if languages and record.get("lang") not in languages:
        return False

    if keyword is None:
        return True

    prompt_text = record.get("text", "")
    return keyword.lower() in prompt_text.lower()


def build_queue_entry(index: int, record: dict, variants: int, metadata: dict) -> dict:
    media = record.get("media", [])
    return {
        "sequence": index,
        "id": record.get("id"),
        "prompt": normalize_prompt(record.get("text", "")),
        "author": record.get("author"),
        "lang": record.get("lang"),
        "sourceUrl": record.get("url"),
        "createdAt": record.get("createdAt"),
        "referenceImages": [item.get("url") for item in media if item.get("url")],
        "variants": variants,
        "topCategory": metadata["topCategory"],
        "subCategory": metadata["subCategory"],
        "scene": metadata["scene"],
        "skinTone": metadata["skinTone"],
        "appeal": metadata["appeal"],
        "subject": metadata["subject"],
        "styleTags": metadata["styleTags"],
        "status": "todo",
    }


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    source_path = args.source.resolve()
    output_path = args.output.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    records = json.loads(source_path.read_text(encoding="utf-8"))
    languages = set(args.lang)
    filtered = [
        record
        for record in records
        if matches_filters(record, languages, args.keyword)
    ]

    if args.limit is not None:
        filtered = filtered[: args.limit]

    metadata = {
        "topCategory": args.top_category,
        "subCategory": args.sub_category,
        "scene": args.scene,
        "skinTone": args.skin_tone,
        "appeal": args.appeal,
        "subject": args.subject,
        "styleTags": args.style_tag,
    }

    entries = [
        build_queue_entry(
            index=index,
            record=record,
            variants=args.variants,
            metadata=metadata,
        )
        for index, record in enumerate(filtered, start=1)
    ]

    with output_path.open("w", encoding="utf-8") as handle:
        for entry in entries:
            handle.write(json.dumps(entry, ensure_ascii=False) + "\n")

    print(f"Exported {len(entries)} prompts to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())