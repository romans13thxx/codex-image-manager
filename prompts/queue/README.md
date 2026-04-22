# 标准任务队列

这里存放已经结构化后的 prompt 队列。

默认导出文件：

- `prompt_queue.jsonl`

每一行建议至少包含这些字段：

- `sequence`
- `id`
- `prompt`
- `author`
- `lang`
- `sourceUrl`
- `referenceImages`
- `variants`
- `status`

Codex 做批量出图时，优先读取这里，而不是直接扫原始数据源。