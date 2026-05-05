# 文件管理手册（file management playbook）

这份手册是这套工作流最重要的"不混乱保证"。核心目标：**未来任何一张图，光看路径和文件名就能复原它属于哪一类、哪一天、哪一次任务、哪个版本。**

---

## 1. 三个"永远不要"

1. **永远不要**把图片直接放进 `workflow/output/images/` 根目录。必须落到 `<topCategory>/<subCategory>/<scene>/<skinTone>/<appeal>/` 下。
2. **永远不要**跨类别复用同一个子文件夹。例如 2D 动漫的"school"场景，绝不能塞进真人的 `real-human/` 里。
3. **永远不要**手改已经进了 `selected/` 的文件名。入选文件名 = 追溯凭证，改名会切断所有溯源链。

## 2. 三条"必须做"

1. **必须**先建 results manifest，再跑 `organize_batch_outputs.py`，由脚本统一改名。
2. **必须**每天运行前先 `bootstrap_daily_journal.py`，当天所有产出都要回链到当日日记。
3. **必须**在 `selected/` 每一个分类子目录里放一个 `README.md`，标明这个目录的筛选标准（比例、风格、禁忌项）。
4. **必须**先把外部 Codex 产图复制进 `workflow/output/backups/codex/<日期>/<jobName>/`，再把这份备份路径写进 `sourceFiles`。优先用 `scripts/import_codex_outputs.py` 自动完成。

## 3. 命名构造

脚本使用的命名模式（见 `image-workflow.example.json`）：

```
{prefix}-{sequence}-{topCategory}-{subCategory}-{scene}-{skinTone}-{appeal}-{subject}
```

例：`img-001-real-human-home-lifestyle-indoor-home-warm-yellow-cute-female-v2.png`

读文件名的习惯：

- 看到 `-v1 / -v2 / -v3` = 同一 prompt 的多版本候选。
- 看到 `-final` = 入选版本，放在 `selected/`。
- 如果命名缺字段（比如没有 `skinTone`），说明 queue 导出阶段漏打标签，**不要**在下游补，而是退回 queue 重跑。

## 4. 目录结构（七层心智模型）

```
workflow/output/
└─ <draft|selected>/
   └─ <YYYY-MM-DD>/           # 第 1 层：日期（启用 dailySubfolder 时）
      └─ <topCategory>/        # 第 2 层：2d-anime / 3d / real-human
         └─ <subCategory>/     # 第 3 层：shonen / home-lifestyle / ...
            └─ <scene>/        # 第 4 层：indoor-home / studio / ...
               └─ <skinTone>/  # 第 5 层：light / warm-yellow / dark
                  └─ <appeal>/ # 第 6 层：cute / sexy / elegant / ...
                     └─ *.png  # 第 7 层：文件本体
```

判断一张图该去哪个文件夹，照着这七层依次问一次自己即可。若任何一层"说不清"，回 queue 先补标签，不要先堆图。

## 5. 防混淆检查清单

每次 `organize_batch_outputs.py` 跑完必须人工看一眼：

- [ ] `draft/` 和 `selected/` 的日期文件夹对得上。
- [ ] 每条 manifest entry 的 `selectedSourceIndex` 不是空的。
- [ ] `reports/` 下的选图报告出现了今天所有 top category。
- [ ] `normalized.json` 里没有 `"general"` fallback（意味着某个轴缺标签）。
- [ ] 当日日记的"命名与归档记录"回链到了选图报告。

## 6. 当看到疑似"混乱信号"时怎么办

| 信号 | 可能原因 | 处理 |
| --- | --- | --- |
| 同一张人脸出现在 `2d-anime` 也出现在 `real-human` | 分类标签写反或 prompt 跨类 | 回 queue 改 topCategory，并整个任务重跑 |
| `reports/` 里两份同名报告 | 两次 manifest 同名 | `jobName` 前缀加 `YYYY-MM-DD-` |
| `selected/` 比 `draft/` 多文件 | 选了 draft 外的图 | 回源头 `sourceFiles`，禁止手贴图 |
| 文件夹深度突然只有 4 层 | `scene/skinTone/appeal` 缺字段 | 不补救下游，退回 queue |
| 外部 Codex 目录里的图和 workflow 内溯源断开 | 只保留了外部目录，没有回收备份 | 先跑 `import_codex_outputs.py`，让 `sourceFiles` 指向 workflow 内备份副本 |
