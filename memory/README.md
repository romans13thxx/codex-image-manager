# 记忆系统

这套记忆系统现在不是单文件，而是一个可以长期统筹多个项目的分层目录。

## 总体结构

```text
workflow/memory/
├─ permanent-memory.md      # 永久记忆入口索引
├─ user-preferences.md      # 用户偏好入口索引
├─ permanent/               # 永久知识库
│  ├─ style-library/        # 风格库
│  ├─ lessons-learned/      # 长期有效经验
│  └─ pitfalls/             # 高频踩坑与规避方法
├─ preferences/             # 用户偏好库
│  └─ category-profiles/    # 2D动漫 / 3D / 真人偏好画像
├─ journals/                # 日志系统
│  ├─ daily/
│  ├─ weekly/
│  └─ monthly/
├─ lessons/                 # 运行中的实验、成功与失败归档
│  ├─ wins/
│  ├─ pitfalls/
│  └─ experiments/
├─ projects/                # 多项目统筹区
│  ├─ active/
│  └─ archived/
└─ daily-journal/           # 旧路径，仅保留 TEMPLATE 作重定向
```

## 1. 永久记忆

目录：`permanent/`

用途：

- 稳定有效的方法论
- 多次验证成功的 prompt 结构
- 文件命名、分类归档、筛图标准
- 风格种类库和长期经验

## 2. 用户偏好

目录：`preferences/`

用途：

- 你个人长期稳定的审美偏好
- 各类别风格偏好与禁忌项
- 常用分辨率、构图、配色、镜头感

## 3. 日志系统

目录：`journals/`

用途：

- `daily/` 记录当天任务、结果、失败和下一步
- `weekly/` 汇总一周的主题、产出和问题
- `monthly/` 汇总长期趋势和策略变化

## 4. 经验与教训

目录：`lessons/` 和 `permanent/pitfalls/`

用途：

- 沉淀做对了什么
- 记录哪里踩坑
- 总结以后如何避免重复犯错

## 5. 多项目统筹

目录：`projects/`

用途：

- 为不同项目建立独立记忆档案
- 在 `active/` 维护当前项目
- 在 `archived/` 归档已收尾项目

## 提升规则

- 只出现一次的结论，不要直接写进 `permanent/`。
- 连续复现 3 次以上的规则，才提升为永久记忆候选。
- 明显属于个人口味的内容，不进永久记忆，直接进 `preferences/`。
- 某次踩坑如果会反复发生，优先写进 `permanent/pitfalls/`。
- 临时实验和当天感受，先留在 `journals/daily/` 或 `lessons/experiments/`。