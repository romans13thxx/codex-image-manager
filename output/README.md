# 输出目录

- `backups/` 保存从 Codex 或外部目录复制回来的原始备份图。
- `images/` 保存原始批量输出。
- `selected/` 保存最终确认的图片。

建议：

- 外部生成结果先进入 `backups/`，再通过 manifest 进入正式归档。
- 原始图不要覆盖。
- 最终图要保留对应 prompt 和任务单编号。