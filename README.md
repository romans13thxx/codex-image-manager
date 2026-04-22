# codex全自动出图流程，本地出图工作流，agent.skill

这个目录把当前仓库从“提示词案例库”扩成“本地出图工作流发源站”。

核心目标只有四件事：

1. 统一提示词入口。
2. 统一批量出图和筛图流程。
3. 统一记忆沉淀方式。
4. 让 Codex 可以按固定口令自动执行整套流程。

## 目录结构

```text
workflow/
├─ config/                  # 工作流配置模板和本地覆盖配置
│  └─ taxonomy/             # 输出分类和风格 taxonomy
├─ prompts/
│  ├─ inbox/                # 新提示词草稿、临时想法、待整理素材
│  └─ queue/                # 导出的标准任务队列
├─ jobs/                    # 每次批量出图的任务单
│  └─ results-manifests/    # 批量命名、结果汇总和选图报告的输入清单
├─ output/
│  ├─ images/               # 原始批量输出，按类别归档
│  ├─ selected/             # 最终选中的图片，按类别归档
│  └─ reports/              # 选图报告和汇总结果
├─ logs/                    # 运行日志、复盘记录、错误摘要
├─ memory/
│  ├─ permanent-memory.md   # 永久记忆入口索引
│  ├─ user-preferences.md   # 用户偏好入口索引
│  ├─ permanent/            # 永久知识库、风格库、经验库、踩坑库
│  ├─ preferences/          # 用户偏好分层目录
│  ├─ journals/             # 每日日志、周记、月记
│  ├─ lessons/              # 成功案例、实验记录、踩坑总结
│  ├─ projects/             # 跨项目记忆和项目归档
│  └─ daily-journal/        # 旧路径兼容保留
├─ scripts/                 # 队列导出、日志初始化等辅助脚本
└─ codex/skills/            # 仓库内维护的 skill 副本
```

## 完整流程

### 0. 先读两份教学文档

- `workflow/memory/permanent/file-management-playbook.md`：文件管理、命名、防混淆的全部规则。
- `workflow/memory/permanent/daily-workflow-playbook.md`：每日节奏（早 / 中 / 晚 / 周 / 月）。

这两份是这套系统的"宪法"，所有脚本、skill、日记的组织都围绕它们。

### 1. 收集提示词

- 把临时想法、新主题、新客户需求丢进 `workflow/prompts/inbox/`。
- 如果直接复用仓库数据源，则从 `gpt_image2_prompts.json` 导出标准队列。

### 2. 生成任务队列

运行：

```bash
python workflow/scripts/export_prompt_queue.py --limit 20 --top-category real-human --sub-category home-lifestyle --scene indoor-home --skin-tone warm-yellow --appeal cute --subject female
```

这个脚本会把 `gpt_image2_prompts.json` 转成 `workflow/prompts/queue/prompt_queue.jsonl`，并允许你在导出阶段就打上 `2d-anime / 3d / real-human` 以及场景、肤色、气质等标签，方便 Codex 或后续工具批量处理。

### 3. 初始化今日日志

运行：

```bash
python workflow/scripts/bootstrap_daily_journal.py
```

这个脚本会在 `workflow/memory/journals/daily/<year>/` 下创建当天日志，作为今天所有试图、筛图、失败经验、命名结果和下一步动作的收口点。

### 4. 分类归档、批量命名与选图报告

准备一份结果清单：

- 模板位置：`workflow/jobs/results-manifests/TEMPLATE.json`
- 生成脚本：`workflow/scripts/organize_batch_outputs.py`

运行：

```bash
python workflow/scripts/organize_batch_outputs.py --manifest workflow/jobs/results-manifests/TEMPLATE.json --dry-run
```

这个脚本会做三件事：

1. 按 `<日期>/2d-anime / 3d / real-human` 和子类型生成标准目录（日期子目录由 `output.dailySubfolder` 控制，默认开启）。
2. 生成统一的批量命名方案。
3. 输出选图报告和结果汇总，并在任何一条缺失 taxonomy 轴时打印 `[warn]`。加 `--strict` 时直接报错退出。

如果 manifest 里带了真实图片路径，它还会把图片复制到对应分类目录。

### 4.5 新建项目记忆

```bash
python workflow/scripts/new_project.py --name "spring-campaign-2026" --category real-human --description "春季客片"
```

会在 `workflow/memory/projects/active/<slug>/` 下生成 `README.md / style-guide.md / lessons.md / prompts.md` 四件套。收尾时把整个目录手动迁到 `workflow/memory/projects/archived/<YYYY-MM>-<slug>/`。

### 5. 命令 Codex 自动执行

标准口令示例：

```text
开始出图：读取 workflow/config/image-workflow.local.json、workflow/memory/、workflow/prompts/queue/prompt_queue.jsonl，每条提示词出 3 个版本，筛 1 张进 workflow/output/selected，把所有结果写入 workflow/jobs/ 和今日日志。
```

当前 Codex 环境如果已经有内置出图能力，自定义 skill 负责的是“流程编排”，不是重新安装模型。

### 6. 批量筛图与复盘

- 原始图统一放在 `workflow/output/images/<top-category>/...`。
- 最终图统一放在 `workflow/output/selected/<top-category>/...`。
- 选图报告统一放在 `workflow/output/reports/`。
- 每个任务要在 `workflow/jobs/` 留下任务单，至少记录：来源、版本数、筛选理由、失败点。

### 7. 提升记忆

- 某条规则稳定复现 3 次以上，再提升到 `workflow/memory/permanent/`。
- 明显属于你个人审美和操作习惯的内容，放进 `workflow/memory/preferences/`。
- 当天临时结论和未确认想法，只写进 `workflow/memory/journals/daily/`。
- 可复用的教训、踩坑和实验结论，分别归档到 `workflow/memory/lessons/` 与 `workflow/memory/permanent/pitfalls/`。

## 建议的日常节奏

1. 上午先整理 `inbox`，去掉重复和无效提示词。
2. 导出标准队列，建立当天任务单。
3. 批量出图后先做第一轮筛选，只保留能交付的版本。
4. 跑一次结果整理脚本，把命名、归档和选图报告自动落盘。
5. 用每日日志记录失败类型和成功样式。
6. 晚上只提升真正稳定的规则，不把偶然成功误写成永久记忆。

## 你可以直接对 Codex 这样说

```text
开始出图。
读取 workflow/config/image-workflow.local.json。
先检查 permanent-memory、user-preferences、permanent/、preferences/ 和今天的 daily journal。
从 workflow/prompts/queue/prompt_queue.jsonl 取前 10 条，每条出 3 个版本。
按 taxonomy 归类到 2d-anime、3d、real-human。
筛 1 张进入 workflow/output/selected。
生成结果 manifest 和选图报告。
失败原因写入今日日志，稳定规则提升到永久记忆候选区。
```

```text
复盘今天出图。
请把 workflow/output/selected 对应的成功经验、失败原因、下一步动作整理进今天的 daily journal。
```
