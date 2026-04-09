# Moni 设置页 UI/UX 规格文档

**版本**：v1
**日期**：2026-04-09
**状态**：设置页可交互原型配套规格文档，供编码 agent 在主仓库集成时执行

---

## 0. 文档定位

本文件是设置页 UI/UX 的唯一执行标准，与 `MoniSettingsPrototype.jsx` 原型互为补充：

- **JSX 原型**：视觉参考与交互可感知演示，重点在于"看到的样子"和"操作的感觉"
- **本文件**：视觉规格的精确数值、交互流程的完整状态图、边界情况的处理规则

当原型与本文件存在任何表述冲突时，以本文件为准。

本文件应与以下文档配合阅读：

- `DESIGN.md`：全局 UI/UX 标准（本文件已被收录为第 24 章）
- `Moni_Settings_Spec_v1.md`：设置系统功能规格（数据模型、作用域、页面树）
- `AI_SELF_LEARNING_DESIGN_v7.md`：标签变更重分类交互流程
- `Moni_Budget_System_Spec_v2.md`：预算设置 UI 规格

---

## 1. 信息架构总览

### 1.1 页面层级

```
设置页 Root（一级总览）
├── 全局区（SectionCard）
│   ├── AI 配置  → 二级页
│   ├── 自述    → 二级页
│   ├── 账本管理 → 二级页
│   ├── 数据导出 → 预留入口（不展开）
│   └── 关于    → 二级页
└── 账本区（SectionCard）
    ├── 标签管理      → 二级页（含 S32 渐进式重分类弹窗链路）
    ├── AI 记忆       → 二级页（含快照历史底部抽屉）
    ├── 预算设置      → 二级页
    ├── 学习设置      → 二级页
    └── 全量重新分类   → 二级页（含确认弹窗）
```

### 1.2 导航模式

- Root → 二级页：页面内切换（同一个手机容器内），无动画（由编码 agent 决定是否加滑动过渡）
- 二级页 → Root：左上角返回箭头
- 弹窗（Dialog）：居中叠加层，点击遮罩或取消按钮关闭
- 底部抽屉（BottomSheet）：从底部滑出，带拖拽条，点击遮罩关闭
- 不存在三级页面。所有需要确认、测试、批量操作的动作，使用 Dialog 或 BottomSheet

---

## 2. Root 页面视觉规格

### 2.1 Header

- 左侧：Logo 组件（复用首页 Logo SVG）
- 右侧：文字"设置"，fontSize 14，fontWeight 700
- padding：`14px 16px 8px`
- position: sticky, top: 0, zIndex: 10, background: C.bg

### 2.2 区块卡片（SectionCard）

设置页 Root 的核心视觉元素。全局区和账本区各一张 SectionCard。

- margin: `0 16px 14px`
- background: `C.white`
- border: `2px solid C.dark`（主卡片规格）
- borderRadius: `16px`
- padding: `16px 16px 6px`
- 区块标题：fontSize 13, fontWeight 700, letterSpacing 0.5

账本区标题右侧显示副标题"当前账本配置"，fontSize 10, color C.sub。

### 2.3 设置行项（SettingRow）

每个设置入口在 SectionCard 内部表现为一行。

- padding: `14px 0`
- 左侧：36×36 圆角(10px)图标容器，blueBg 底色（危险项使用 pinkBg）
- 中间：标签名 fontSize 14 fontWeight 600，描述 fontSize 11 color C.sub
- 右侧：摘要值 fontSize 12 color C.sub + ChevronRight 箭头
- 底部：`0.5px solid C.line` 分隔线

### 2.4 Memphis 装饰

- 使用 `seededShapes(555, 6, ...)` 生成
- 二级页面使用不同 seed（777）避免视觉重复
- 装饰层 zIndex: 0，内容层 zIndex: 1

### 2.5 底部导航

完全复用首页/记账页的 BottomNav 组件：

- 设置图标（GearIcon）处于 active 态：描边加粗(1.8)、深色、文字加粗
- 中央品牌按钮、记账图标保持非 active 态

---

## 3. 二级页面通用规格

### 3.1 SubPageHeader

- 左侧返回箭头 BackArrow：20×20 SVG，strokeWidth 2.2
- 标题：fontSize 17, fontWeight 700
- padding: `14px 16px 10px`
- position: sticky, top: 0, background: C.bg

### 3.1.1 文案边界

- 二级页中禁止出现写给设计师、开发者或评审者看的解释性小字
- 页面内只允许出现面向最终用户的字段标题、状态、提示和反馈文案
- 表单动作按钮放在对应内容块底部，不放在 header 右上角

### 3.2 内容区

- flex: 1, overflowY: auto
- padding: `0 16px 24px`
- 底部留足 24px 呼吸空间

### 3.3 弹窗 Dialog

- 遮罩：`rgba(0,0,0,.35)`
- 容器：width 85%, maxHeight 75%, borderRadius 18, border `2px solid C.dark`
- padding: `20px 18px 16px`
- 标题：fontSize 16, fontWeight 700, marginBottom 14

### 3.4 底部抽屉 BottomSheet

- 遮罩：`rgba(0,0,0,.3)`
- 容器：bottom 0, borderRadius `20px 20px 0 0`, border `2px solid C.dark`（无 borderBottom）
- 顶部拖拽条：width 36, height 4, borderRadius 2, background C.border
- maxHeight: 70%

### 3.5 Toast

- position: absolute, top: 60, zIndex 60
- 居中水平，border `2px solid C.dark`, borderRadius 12
- 左侧 22×22 薄荷绿圆角方块 ✓ 图标
- 自动消失时间由调用方控制（通常 2-2.5 秒）

### 3.6 按钮（Btn）

四种变体：

| variant | background | color | border |
|---------|-----------|-------|--------|
| primary | C.dark | C.bg | 2px solid C.dark |
| secondary | C.white | C.dark | 1.5px solid C.border |
| danger | C.pinkBg | C.coral | 1.5px solid C.pinkBd |
| mint | C.mint | C.white | 2px solid C.mint |

- borderRadius: 12
- fontWeight: 700
- small 态：padding `8px 14px`, fontSize 12
- 常规态：padding `12px 20px`, fontSize 14
- disabled 态：opacity 0.45, cursor not-allowed

---

## 4. AI 配置页（S1-S5）

### 4.1 提供方选择

- 6 个预设 + 1 个自定义
- pill 式选择器，flex-wrap
- 选中态：`2px solid C.dark`, background C.dark, color C.bg
- 未选中态：`1.5px solid C.border`, background C.white
- 选中"自定义"时额外展示 Base URL 输入框

### 4.2 API Key

- 已填态：输入框显示掩码，不允许显示明文，不允许复制
- 已填态右侧按钮为"清空"
- 未填态：输入框可编辑，右侧按钮为"填入"
- 用户必须先清空，才能重新输入新的 API Key

### 4.3 当前模型

- 只读展示，monospace 字体
- 右侧绿色"● 生效中"状态标签
- DeepSeek / Moonshot / SiliconFlow / ModelScope / 智谱 AI 使用真实预设模型名
- 自定义 provider 提供 3 个可编辑模型槽位，用户可手动填写模型名并选择当前生效槽位

### 4.4 推理参数

- Max Tokens / Temperature：静态展示，不提供编辑能力
- Max Tokens 默认展示高值（当前冻结为 `8192`）
- 启用思考：Toggle 开关

### 4.5 测试连接

- 全宽主按钮
- 点击后进入 "测试中…" disabled 态
- 成功后展示绿底成功反馈条
- 失败则展示红底失败反馈条

---

## 5. 自述页（S8）

- 暖色提示卡（warmBg + warmBd）解释自述作用
- 默认文案必须明确是 demo 示例，不使用会被误认为真实用户画像的写法
- 推荐默认文案：`Demo 示例：我平时会把咖啡、奶茶、小零食分开记，也希望 AI 先按常见消费场景帮我分类。你可以把这里改成自己的真实习惯。`
- 全宽 textarea，minHeight 240，自由文本
- `textarea` 允许编辑，且 `maxLength = 200`
- 右下角字数统计使用 `current/200` 形式，例如 `66/200`
- 保存按钮放在文本块底部右侧 → Toast 反馈

---

## 6. 账本管理页（S9-S12）

### 6.1 账本列表

每行包含：

- 左侧：Radio 圆点（选中态 6px solid C.mint，未选中 2px solid C.border）
- 中间：账本名 + "默认账本/自建账本 · 当前使用"
- 右侧："改名" secondary 按钮 + "删除" danger 按钮（默认账本无删除）

### 6.2 新建账本

- Dialog 弹窗
- 单一输入框 + 取消/创建 双按钮

### 6.3 重命名

- Dialog 弹窗
- 输入框预填当前名称

### 6.4 删除确认

- Dialog 弹窗
- 红色警告文案说明不可恢复 + 影响范围
- 取消 + "确认删除" danger 按钮

---

## 7. 标签管理页（S15-S18 + S32）

### 7.1 标签列表

每行包含：

- 左侧：8px 状态圆点（普通标签 C.mint，系统兜底标签 C.gray）
- 中间：标签名 fontSize 14 + 描述 fontSize 11
- 右侧："编辑"+"删除" 按钮（"其他"标签无操作按钮）
- 不允许把“改名”“编辑说明”“删除”三个动作直接平铺在列表行里，避免挤压标签文本可读性

### 7.1.1 空态

- 当不存在任何自定义标签时，不显示“其他”占位条目
- 列表区域改为一张空态提示卡，文案应鼓励用户创建第一个标签
- 推荐文案：`还没有标签。先创建一个你最常用的分类，让 Moni 从第一条开始学你怎么记账。`

### 7.2 新增标签

- Dialog 弹窗
- 标签名称 input + 标签描述 textarea（必填）
- 描述为空时"新增"按钮 disabled
- 新增成功后自动触发 S32 渐进式重分类弹窗

### 7.3 编辑描述

### 7.3 编辑面板

- 点击列表行的"编辑"按钮后，打开统一编辑 Dialog
- Dialog 顶部使用两个互斥标签页：
- 左侧：`重命名键`
- 右侧：`编辑描述`
- 用户同一时间只能停留在一个标签页中，不允许同时改键名和描述
- 标签页本身使用主题强调色，但主体表单区域仍保持浅背景和轻边框，不整面染色
- `重命名键` 标签页使用主题青色系高亮
- `编辑描述` 标签页使用主题红色系高亮
- `重命名键` 页签下展示单行输入框
- `编辑描述` 页签下展示多行 textarea
- 保存成功后按当前标签页对应的修改类型给出反馈

### 7.4 删除标签

- 先弹出删除确认 Dialog
- 确认后执行删除
- 删除完成后自动触发 S32 范围确认弹窗

### 7.5 S32 渐进式重分类 UI 链路

这是设置页交互设计中最复杂的部分。三种标签操作分别对应不同的渐进式披露流程：

#### 7.5.1 新增标签后

```
→ Dialog："标签「xxx」已新增"
    → [暂时跳过] → 关闭
    → [现在启动分类] → 关闭（仅通知消费端，不生产新任务）
```

#### 7.5.2 删除标签后

```
→ Dialog："选择重分类范围"
    → [仅受影响的交易] → 关闭（对受影响日期入队）
    → [全账本所有未锁定交易] → BottomSheet 展示锁定交易列表
        → 用户勾选要解锁的锁定交易
        → [确认并开始重分类] → 关闭
    → [稍后处理] → 关闭
```

#### 7.5.3 修改描述后

```
→ Dialog："标签定义已更改"
    → [暂时跳过] → 关闭
    → [该标签下仅未锁定交易] → 关闭（对该标签范围入队）
    → [该标签下所有交易] → BottomSheet 展示锁定交易列表
        → 用户勾选 + [确认并开始重分类]
```

#### 7.5.4 锁定交易列表 BottomSheet

- 标题："以下锁定交易将被包含"
- 说明文案
- 列表每行：checkbox + 交易摘要 + "已锁定"标签（orangeBg + amber 文字）
- 底部：取消 + 确认 双按钮

---

## 8. AI 记忆页（S19-S24）

### 8.1 状态栏

两张小指标卡水平排列：

- "实例库"：greenBg 底，显示 `距离上次学习的增量 / 实例库总量`
- "记忆条数"：blueBg 底

补充规则：

- 第一张指标卡本质上是“实例库入口”，不是纯展示型数字块
- 用户点击该卡后，进入实例库相关入口或明细视图
- 若暂无实例，则显示 `0 / 0`

### 8.2 操作按钮

两个按钮水平排列：

- "⚡ 立即学习"：primary 样式
- "📋 历史版本"：secondary 样式

### 8.3 记忆列表

- 白底容器，1.5px C.border 边框
- 每条记忆：序号（C.mint） + 内容文本
- 浏览态下不允许点击条目直接进入编辑
- 通过右下角“编辑记忆”按钮切换到编辑态
- 编辑态：右侧出现 × 删除按钮（C.coral）
- 用户在编辑态按下回车后，立即在下方插入一个新的空白条目
- 新条目生成后焦点自动落到该空条目，序号同步维护更新
- 编辑期间只维护前端草稿，不得自动保存
- 点击“完成”后统一提交；保存编辑时应创建 `user_edit` 快照

### 8.4 立即学习确认 Dialog

- 说明文案 → 取消 / 开始学习 双按钮
- 学习中展示 Toast："AI 正在学习新的偏好…"
- 学习成功后展示成功 Toast，例如：`学习完成，AI 已更新当前账本记忆。`
- 学习成功后需要刷新当前记忆列表与学习设置页摘要

### 8.5 历史版本 BottomSheet

- 按时间倒序的快照列表
- 每行：日期（monospace）+ 当前标签（C.mint 胶囊） + trigger 图标 + summary
- 非当前快照：回退 / 删除 操作按钮
- 当前快照不可删除

---

## 9. 预算设置页（S29-S30）

### 9.1 月度总预算

- ¥ 符号 + 大字号 input（fontSize 22, fontWeight 700）
- border: `2px solid C.dark`（主卡片级别强调）

### 9.2 分类预算

- 列表展示所有非系统标签
- 每行：标签名 + ¥ input
- 合计显示在列表上方：`合计 ¥xxx / ¥月度总预算`
- 超出时合计文字变红 + 容器边框变 pinkBd

### 9.3 约束

- 分类预算之和不应超过月度总预算
- 未设月度总预算时无上限校验
- 留空 = 不设该分类预算

---

## 10. 学习设置页（S25-S27）

### 10.1 自动学习开关

- Toggle 组件（44×24，滑块 20×20）
- 开启：C.mint 底，滑块靠右
- 关闭：C.border 底，滑块靠左

### 10.2 学习阈值

- range slider，min 1, max 20
- accentColor: C.mint
- 当前值以 monospace 大字显示
- 两端标注"敏感/保守"

### 10.3 收编阈值

- range slider，min 10, max 60
- accentColor: C.amber
- 两端标注数值

---

## 11. 全量重分类页（S31）

### 11.1 说明卡

- warmBg 底，解释全量重分类的含义

### 11.2 账本概况

- 三行数据：总交易数、未锁定（amber）、已锁定（mint）

### 11.3 警告

- pinkBg 底，固定使用以下两句风险提示：
- `全量重分类，会清理未锁定交易的实例库记录。`
- `并根据当前启用的记忆重新分类，请确认当前 AI 记忆情况，谨慎操作。`

### 11.4 确认流程

- 点击"开始全量重新分类" → Dialog 确认
- 确认后进入 running 态，按钮变 disabled
- Toast 提示"重分类任务已入队"

---

## 12. 关于页（S13）

- 视觉与 `refer/MoniSettingsPrototype.jsx` 中的 AboutPage 保持 1:1 一致
- 品牌大按钮（72×72）居中
- 应用名 Moni + 副标题
- 产品定位简述
- 版本号 + 构建时间
- 三个 ghost 按钮：反馈 / 文档 / 致谢

---

## 13. 跨页面联动规则

编码 agent 集成时必须注意的联动关系：

1. **标签管理 → 预算设置**：新增/删除标签后，分类预算整体失效（categoryBudgets 置 null）
2. **标签管理 → 全量重分类**：S32 渐进式弹窗中"全账本所有未锁定交易"选项，与全量重分类页的触发层接口共用相同逻辑
3. **AI 记忆 ↔ 学习设置**：学习阈值参数影响 AI 记忆页的实例库增量解释与学习反馈刷新，两页必须共用同一账本上下文
4. **账本管理 → 账本区所有页面**：切换账本后，标签、记忆、预算、学习设置、重分类全部切换上下文
5. **账本管理 → Header**：首页 Header 账本选择器应同步更新

---

## 14. 编码 agent 集成指引

### 14.1 文件组织建议

```
src/ui/components/mobile/settings/
├── SettingsPage.tsx           // Root + 路由控制
├── AIConfigPage.tsx           // S1-S5
├── SelfDescPage.tsx           // S8
├── LedgerManagePage.tsx       // S9-S12
├── TagManagePage.tsx          // S15-S18 + S32
├── AIMemoryPage.tsx           // S19-S24
├── BudgetPage.tsx             // S29-S30
├── LearningSettingsPage.tsx   // S25-S27
├── FullReclassPage.tsx        // S31
├── AboutPage.tsx              // S13
└── shared/
    ├── Dialog.tsx
    ├── BottomSheet.tsx
    ├── SettingRow.tsx
    ├── SectionCard.tsx
    ├── SubPageHeader.tsx
    └── Toast.tsx
```

### 14.2 状态管理

- Root 页面不持有复杂状态，只负责导航
- 每个二级页面独立管理自己的状态
- 跨页面联动通过服务层（LedgerService / BudgetManager / MemoryManager）实现
- 标签变更后的 S32 弹窗链路，建议在 TagManagePage 内部完整实现，不拆到外部

### 14.3 与主仓库逻辑层的对接

| 设置页功能 | 主仓库服务 |
|-----------|-----------|
| AI 配置读写 | ConfigManager |
| 自述读写 | SelfDescriptionManager |
| 账本 CRUD | LedgerManager |
| 标签 CRUD | LedgerService |
| AI 记忆读写 | MemoryManager + SnapshotManager |
| 立即学习 | LearningSession |
| 预算读写 | BudgetManager |
| 学习设置读写 | LedgerPreferencesManager |
| 全量重分类 | ClassifyTrigger |
| S32 渐进式重分类 | ClassifyTrigger（按按钮拆分的触发层接口） |

---

## 15. 本文结论

设置页原型以"一级总览 + 二级详情页"的稳定流转为骨架，以 Dialog 和 BottomSheet 作为叶子节点的确认/操作容器，在视觉上完全继承首页的 Memphis 风格和品牌色系。

S32 渐进式重分类是设置页中唯一跨越多个弹窗层级的复杂交互链路，其 UI 状态机在本文件中已完整定义。编码 agent 集成时应以本文件为准，不应简化或裁剪 S32 的任何分支。
