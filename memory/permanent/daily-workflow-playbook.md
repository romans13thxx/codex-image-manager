# 每日出图节奏手册（daily workflow playbook）

一份"从早到晚"的出图流水线。目标是每天按同一个节拍走，避免 Codex 和人都在"自由发挥"。

---

## 早上：开箱 30 分钟

1. **整理 inbox**：翻一遍 `workflow/prompts/inbox/` 里的草稿，合并重复主题、删掉无效想法。
2. **初始化日记**：
   ```bash
   python workflow/scripts/bootstrap_daily_journal.py
   ```
   当日日志是一天所有产出的收口点。
3. **导出队列**：带上分类标签导出，不允许"空标签"上工。
   ```bash
   python workflow/scripts/export_prompt_queue.py \
     --limit 20 --top-category real-human --sub-category home-lifestyle \
     --scene indoor-home --skin-tone warm-yellow --appeal cute --subject female
   ```
4. **打开永久记忆里今天要用的那一页**：例如 `permanent/style-library/real-human/home-lifestyle.md`，先看成功样式再出图。

## 白天：循环 × N

每一轮循环 = 一个批次：

1. 从 queue 里挑 5–10 条做一个"任务单"，写进 `workflow/jobs/<job-name>.md`。
2. Codex 按 skill 流程出图 → `workflow/output/images/<日期>/...`。
3. **当场筛图**：不要攒到晚上。筛完立刻更新 `workflow/jobs/results-manifests/<job-name>.json` 的 `selectedSourceIndex` 和 `selectionReason`。
4. 跑整理脚本：
   ```bash
   python workflow/scripts/organize_batch_outputs.py --manifest workflow/jobs/results-manifests/<job-name>.json
   ```
5. 在日记 `命名与归档记录` 一行写清：用了哪个 manifest、产出了几张、入选几张。

## 晚上：复盘 20 分钟

1. 翻一遍 `workflow/output/reports/<today>` 下的所有选图报告。
2. 在日记里分四块写：
   - **成功结果**：只写"可复用的条件"，不写感慨。
   - **失败原因**：归到具体轴（prompt / 模型 / 筛图标准 / 分类错）。
   - **待验证假设**：出现 1 次但看着有潜力的样式。
   - **可提升为长期记忆的候选**：已经连续出现 ≥ 3 次的规则。
3. 只把第 4 块里"真正复现 3 次以上"的条目迁到 `permanent/` 或 `preferences/`。
4. 需要留给未来自己的反思 → `lessons/experiments/` 或 `lessons/pitfalls/`。

## 每周一次：周复盘

1. 新建 `workflow/memory/journals/weekly/<YYYY>/<YYYY-WW>.md`（照 TEMPLATE 来）。
2. 把当周 7 份 daily 的"候选"汇总。
3. 决策：哪些要提升、哪些要丢弃、哪个项目需要新建 `projects/active/<name>/`。

## 每月一次：月度归档

1. `workflow/memory/journals/monthly/<YYYY>/<YYYY-MM>.md` 做趋势总结。
2. 已收尾的项目：整个目录从 `projects/active/` 搬到 `projects/archived/<YYYY-MM>-<name>/`。
3. 回顾 `permanent/pitfalls/` 是否有已经不再出现的坑，可以打 `[solved]` 标签但不要删。

## 中断恢复

如果某天中途掉线或换设备：

1. 先看 `workflow/jobs/` 里最后一个 job 的 manifest，确认批次状态。
2. 再看今日日记的"命名与归档记录"最后一行。
3. 最后扫一眼 `workflow/output/images/<日期>/` 有没有"孤儿文件"（没有进 selected 也没有 failure 记录）。
4. 三个信号一致 → 继续；不一致 → 停下来补记录，不要先出图。
