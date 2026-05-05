# 备份目录

这里保存从 Codex 或其他外部生成位置复制回 workflow 的原始备份图。

当前约定：

- Codex 结果统一进入 `output/backups/codex/<YYYY-MM-DD>/<jobName>/`。
- 这些文件是“回收站式备份”和 `sourceFiles` 的溯源副本，不直接作为最终交付目录。
- 正式归档仍然通过 `jobs/results-manifests/*.json` + `scripts/organize_batch_outputs.py` 进入 `output/images/` 和 `output/selected/`。

导入命令示例：

```bash
python scripts/import_codex_outputs.py \
  --source "C:/path/to/codex-output" \
  --job-name "2026-04-22-home-lifestyle-codex-batch" \
  --title "Codex home lifestyle batch" \
  --top-category real-human \
  --sub-category home-lifestyle \
  --scene indoor-home \
  --skin-tone warm-yellow \
  --appeal cute \
  --subject female
```