# CLAUDE.md — Moni-UI-Prototype

## 项目基本信息

### 项目概述

**Moni-UI-Prototype** 是 AI 原生个人财务助手 Moni 的 UI/UX 可交互原型仓库。

本仓库不含正式后端实现，只包含前端可视原型与配套规格文档。原型使用与正式产品完全一致的技术栈，确保设计确认后可直接迁移集成到主仓库（PixelBill / Moni 主工程）。

> **当前阶段：首页规格收口与集成准备**
> - 目标：完成首页原型、需求文档、AI 规格文档之间的口径收敛，为后续逻辑层 / 表现层集成提供执行依据
> - 设计权威文档：`DESIGN.md`（UI/UX 唯一执行标准）
> - 首页集成文档：`docs/Moni_Homepage_Integration_Spec.md`
> - 预算系统文档：`docs/Moni_Budget_System_Spec.md`
> - 功能需求参考：`docs/Moni_Requirements_v2.md`
>
> **当前仓库角色**
> - 当前目录已作为主开发仓库下的原型参考子仓库使用
> - 此仓库的目标是保持文档与原型状态稳定、可追溯、可供主仓库引用
> - 若后续继续进行原型开发，建议复制到新的工作目录中进行，避免污染参考源

### 架构设计

本仓库是一个标准 React 单页应用，用于原型展示和交互验证。

**技术栈**：React + javaScript + Vite + Tailwind CSS + Framer Motion

**核心文件结构**（组件拆分自 Claude 产出的单文件 JSX 原型）：

- `config` — 主题色、分类数据、mock 数据、常量
- `helpers` — 工具函数（日期、分类、统计、随机装饰）
- `components` — UI 组件（Logo、NavIcon、TagRail、DayCard、BottomNav、DragOverlay 等）
- `MoniHome` — 首页主容器（状态管理、手势处理、布局编排）

### 协作模式

本仓库的设计方案由两方协作产出：

- **Claude（网页端）**：负责 0→1，产出 JSX 可视原型 + DESIGN.md 规格文档
- **编码 Agent（本地）**：负责 1→10，按 DESIGN.md 规格落地工程实现

**同步方式**：Claude 产出 JSX 作为视觉参考 + DESIGN.md 作为执行规格，编码 Agent 照规格实现。两方不直接共享工程目录，通过文件级粘贴同步。

**执行原则**：
- DESIGN.md 是唯一设计权威，代码必须符合 DESIGN.md
- 若 DESIGN.md 与代码冲突，以 DESIGN.md 为准
- 若 DESIGN.md 本身需要修改，必须先更新 DESIGN.md，再改代码
- 编码 Agent 不得自行发明交互行为，所有交互必须在 DESIGN.md 中有依据

---

## 项目目录结构

```
moni-ui-prototype/
├── docs/                          # 项目文档
│   ├── DESIGN.md                  # UI/UX 唯一设计标准（核心）
│   ├── Moni_Brand_Design_Spec.md  # 品牌视觉与 SVG 资产
│   ├── Moni_Requirements_v2.md    # 功能需求参考
│   ├── Moni_Homepage_Integration_Spec.md  # 首页表现层 / 逻辑层集成规格
│   ├── Moni_Budget_System_Spec.md  # 预算系统专项规格
│   ├── AI_SELF_LEARNING_DESIGN_v6.md  # AI 自学习功能设计
│   └── reference/                 # 历史设计稿、聊天沉淀与归档参考
├── src/
│   ├── features/
│   │   └── moni-home/
│   │       ├── config.js          # 主题色、分类数据、mock 交易数据
│   │       ├── helpers.js         # 工具函数
│   │       └── components.jsx     # UI 组件集合
│   ├── pages/
│   │   └── MoniHomePrototype.jsx  # 首页主容器
│   ├── App.tsx                    # 应用入口
│   └── index.css                  # 全局样式（含手势防御 CSS）
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── CLAUDE.md                      # 本文件
└── DESIGN.md                      # → 软链接或复制自 docs/DESIGN.md
```

> 注：实际目录结构以仓库 `ls` 结果为准，以上为规划结构。如有出入请先执行 `find . -type f` 确认再操作。

---

## 重要文档索引表

| 文档名称 | 内容描述 | 文件路径 |
|----------|----------|----------|
| UI/UX 设计标准 | 唯一执行标准，含首页全部交互规则、手势实现规范 | `DESIGN.md` |
| 品牌视觉规范 | 品牌色、字体、SVG 资产、Memphis 装饰规则 | `Moni_Brand_Design_Spec.md` |
| 功能需求文档 | 产品功能需求（设计实现以 DESIGN.md 为准） | `Moni_Requirements_v2.md` |
| 首页集成规格 | 首页组件业务逻辑、表现层 / 逻辑层动作、联调边界 | `docs/Moni_Homepage_Integration_Spec.md` |
| 预算系统规格 | 月度总预算的显示层、逻辑层、持久化层与本轮范围 | `docs/Moni_Budget_System_Spec.md` |
| AI 自学习设计 | 后端 AI 功能设计参考（原型阶段不直接涉及） | `AI_SELF_LEARNING_DESIGN_v6.md` |
| 历史参考归档 | 聊天沉淀、旧设计稿、原型草稿、辅助说明 | `docs/reference/` |

---

## 项目代码规范

### 技术栈约束

- React 18 + TypeScript（JSX/TSX 均可，逐步向 TSX 迁移）
- Vite 构建
- Tailwind CSS（可与 inline style 混用，逐步迁移）
- Framer Motion（手势交互必须使用，见 DESIGN.md 第 23 节）
- 目标运行平台：Capacitor Android WebView

### 代码风格

- **所有代码必须包含详细中文注释**
- 复杂逻辑需要解释"为什么"而非"做什么"
- 组件 Props 需要 JSDoc 说明
- 使用 ES Module（`import/export`），不使用 CommonJS
- 使用函数组件 + Hooks，不使用 Class 组件

### 手势代码规范（核心）

详见 DESIGN.md 第 23 节。以下为摘要：

1. **全局 CSS 防御层**必须在 `index.css` 中设置（`touch-action: manipulation`、`-webkit-touch-callout: none`、`overscroll-behavior: none` 等 6 条规则）
2. **禁止**在动态弹出的子元素上依赖 `onPointerMove`（指针已被父元素隐式捕获）
3. **禁止**使用 `onPointerLeave` 作为取消手势的手段
4. 需要跨元素追踪指针时，使用 `window.addEventListener` 全局监听或在已捕获元素上用 `clientY` + `elementFromPoint` 判定
5. 拖拽/长按激活期间必须锁定 body 滚动

### Git 规范

- 使用语义化提交信息：`feat:`, `fix:`, `refactor:`, `docs:`, `style:`
- 除非用户要求，否则不要自行 `git add` 和 `git commit`
- **绝对禁止自行 `git push`**
- 永远不要删除文件，需要删除的一律移动到 `.archive/`

---

## 开发测试闭环 SOP

### 启动开发环境

```bash
npm run dev
# 浏览器访问 http://localhost:5173
# 打开 F12 → 切换到移动设备模式（如 iPhone 12 Pro 或自定义 390×860）
```

### 交互测试流程

在 F12 移动设备模式下逐一测试以下场景（对应 DESIGN.md 23.5 节）：

1. 看板卡片上下滑动
2. 折线图卡内左右滑动
3. 标签轨道横向滚动
4. 长按条目 → 拖拽分类
5. 拖拽投放 / 拖拽取消
6. **长按中央按钮 → 不松手 → 滑到控制条 → 松手触发**
7. 页面连续滚动 + 标签轨道吸附

### Android 真机验证（里程碑节点执行）

```bash
npm run build
npx cap sync
npx cap run android
```

验证项见 DESIGN.md 23.5 节"Android 额外验证"。

---

## 项目当前进展和任务列表

### 已完成 ✅

| 任务 | 说明 |
|------|------|
| 首页信息架构 | Header / 看板 / 统计 / 概览 / 标签轨道 / 日卡片列表 / 底部导航 |
| 品牌视觉系统 | Moni 字标 / 猫耳 M 按钮 / 三色装饰 / Memphis 印花 |
| 分类数据系统 | 11 类分类 + 色彩 + emoji 图标组 |
| 看板轮播 | 预算卡 ↔ 折线图卡上下切换（基础可用） |
| 折线图时间窗口 | 左右滑动切换 7 天窗口（基础可用） |
| 统计摘要 + 分类概览 | 联动 Data Range Picker |
| 标签轨道筛选 | 横向滚动 + 点击筛选 + sticky 吸附 |
| 三阶段日卡片折叠/展开 | 初始→过渡→完全 三阶段滚动逻辑 |
| 长按拖拽分类 | 拖拽阶段全局监听实现（基本可用） |
| AI 工作态三色联动 | 日卡片边框流光 + 中央按钮发光 + 骨架屏 |
| AI 控制条弹出 | 长按弹出开关条（视觉已实现，交互有 bug） |
| 首页业务规格收口 | 已完成首页原型、需求文档、AI 设计文档之间的口径交叉核对 |
| 首页集成规格文档 | 已新增 `docs/Moni_Homepage_Integration_Spec.md`，明确首页组件级业务逻辑与表现层 / 逻辑层边界 |
| 需求文档修订 | 已更新 `docs/Moni_Requirements_v2.md`，修正过时内容并补充当前冻结边界 |
| 预算系统专项规格 | 已新增 `docs/Moni_Budget_System_Spec.md`，明确月度总预算的显示层、逻辑层与持久化层最小范围 |
| 参考资料归档整理 | 已将历史聊天沉淀与旧设计稿整理进 `docs/reference/` |

### 进行中 / 待修复 🚧

**当前重点：文档侧已收口，代码侧集成与交互修复待下一阶段执行**

| 任务 ID | 任务名称 | 优先级 | 状态 | 具体描述 |
|---------|----------|--------|------|----------|
| DOC-01 | 首页文档闭环 | P0 | 已完成 | `DESIGN.md`、`Moni_Requirements_v2.md`、`AI_SELF_LEARNING_DESIGN_v6.md`、首页原型代码之间的首页业务口径已完成交叉核对 |
| DOC-02 | 首页集成规格输出 | P0 | 已完成 | 已形成首页集成专用执行文档，供主仓库协作者联调使用 |
| DOC-03 | 预算系统规格输出 | P0 | 已完成 | 已形成预算系统专项文档，冻结月度总预算本轮范围 |
| GES-01 | 全局 CSS 防御层 | P0 | 待执行 | 在代码阶段按 DESIGN.md 23.1 节补齐 6 条全局规则 |
| GES-02 | AI 控制条指针追踪修复 | P0 | 待执行 | 见下方详细方案 |
| GES-03 | AI 控制条 pointerleave 误触修复 | P0 | 待执行 | 见下方详细方案 |
| GES-04 | 条目长按 pointerleave 误取消修复 | P0 | 待执行 | 见下方详细方案 |
| INT-01 | 首页聚合读模型接入 | P0 | 待执行 | 让看板、统计、概览、流水、AI 状态统一消费逻辑层读模型 |
| INT-02 | AI 引擎状态接入 | P0 | 待执行 | 接入 AI 工作态、软停止状态、范围外 backlog 感知 |
| INT-03 | 月度总预算接入 | P0 | 待执行 | 按预算系统专项文档接入首页预算卡所需字段与无预算态分支 |
| INT-04 | 手动记录条目显示接入 | P1 | 待执行 | 在首页流水中支持“AI reasoning 留空 + 来源显示手动记录” |
| GES-09 | 交互全场景 F12 回归测试 | P0 | 待执行 | 在代码侧改动落地后回归 DESIGN.md 23.5 节全部测试项 |

---

## 用户规则

- **永远用中文回答用户问题，中文撰写项目 CLAUDE.md 文件**
- **所有代码必须包含详细中文注释**
- 当用户要求查看项目，总览项目，扫描项目目录时：**必须递归的查看项目目录结构**
- 用户要求读取/查看任何图片/文档时，**必须真正阅读图片/文档内容**
- **行动偏好更改**：如果用户的指令略显模糊，**不要**基于经验做出假设并直接执行，**必须先询问用户具体需求**，先给出建议，**用户确认后再执行**
- **绝对禁止先干活，后汇报**：在执行代码修改和命令运行前，必须先**描述清楚意图**，然后再执行
- **交互设计红线**：涉及前端交互逻辑变更，必须先汇报计划的设计细则并获得用户明确"确认"指令授权后方可实施代码；严禁未授权修改，且仅明确肯定回复视为确认
- DESIGN.md 是唯一理念/视觉/功能设计指导
- 文件操作：永远不要删除文件，需要删除的一律移动到 `.archive/`
