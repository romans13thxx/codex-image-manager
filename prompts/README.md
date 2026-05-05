# 提示词工作区

这个目录现在分成三层：

1. `inbox/`：临时草稿、待整理灵感、客户需求碎片。
2. `queue/`：已经结构化、可直接进入批量出图流程的标准队列。
3. `library/`：长期可复用的提示词案例库，按 Markdown 文档归档，并尽量携带结果配图。

## 推荐使用顺序

1. 先在 `inbox/` 收集原始想法。
2. 从 `library/` 挑选接近的案例做改写或组合。
3. 整理成标准字段后导出到 `queue/`。

## 当前已接入的案例库

- [awesome-gpt-image-2](./library/awesome-gpt-image-2/README.md)：从相邻仓库同步过来的长期案例库，包含分类索引、单 case Markdown 文档和对应结果图。

## 同步命令

```bash
python scripts/sync_awesome_prompt_library.py
```