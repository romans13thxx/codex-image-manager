# 永久记忆（入口索引）

> 只读索引。不要把真正的长期经验写进这个文件。
> 所有永久记忆条目请写进 `workflow/memory/permanent/` 下的对应子目录。

## 写入位置速查

| 想记录的内容 | 应该写进 |
| --- | --- |
| 稳定的 prompt 模板 / 流程规则 | `workflow/memory/permanent/lessons-learned/` |
| 某个风格的长期成功样式 | `workflow/memory/permanent/style-library/<category>/<subcategory>.md` |
| 反复踩到的同一个坑 | `workflow/memory/permanent/pitfalls/` |
| 文件命名 / 归档 / 日常节奏 | `workflow/memory/permanent/file-management-playbook.md` |
| 每日流程 / 筛图判断 | `workflow/memory/permanent/daily-workflow-playbook.md` |
| 个人口味、审美偏好 | `workflow/memory/preferences/`（不进永久记忆） |
| 临时结论、未验证想法 | `workflow/memory/journals/daily/` |

## 提升规则

1. 至少复现 3 次，才允许提升到 `permanent/`。
2. 偶然成功 → 先写 `journals/daily/` 的"待验证假设"。
3. 个人口味 → 永远只进 `preferences/`，不进 `permanent/`。
4. 踩坑 → 写进 `permanent/pitfalls/` 的同时，在 `daily` 日记末尾回链一次。
