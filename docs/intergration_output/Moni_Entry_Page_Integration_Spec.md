# Moni 记账页组件业务逻辑与表现层 / 逻辑层集成规格
> 本文档参照主仓库 `../moni-master/docs/Moni_Homepage_Integration_Spec.md` 的结构与口径整理，用于当前原型仓库的记账页集成实施。

## 0. 文档定位

本文件用于把记账页原型相关的四类信息收口到一处：

1. `docs/Moni_Entry_Page_Spec_v1.md` 中已经确认的 UI / UX 规则
2. `docs/Moni_Manual_Entry_Spec_v3.md` 中与手动录入持久化 / 逻辑层相关的字段与动作
3. `docs/Moni_Requirements_v3.md` 中已经冻结的记账页产品边界
4. 当前前端原型代码的实际组件拆分与现状实现

本文件不是新的视觉设计源头，不替代 `DESIGN.md` 与记账页原型规格。  
涉及交互与视觉定稿时，仍以 `DESIGN.md` 与 `docs/Moni_Entry_Page_Spec_v1.md` 为执行标准。  
本文件的职责是：为记账页表现层实现、逻辑层动作设计、联调与验收提供统一口径。

---

## 1. 参考来源与权重

### 1.1 权重顺序

1. `DESIGN.md`：全局 UI / UX 唯一执行标准
2. `docs/Moni_Entry_Page_Spec_v1.md`：记账页页面结构、静态口径与交互流程
3. `docs/Moni_Manual_Entry_Spec_v3.md`：手动录入持久化层、逻辑层、字段映射
4. `docs/Moni_Requirements_v3.md`：功能边界与全局导航职责
5. 当前原型代码：仅代表现状，不自动等同于最终规格

### 1.2 本文使用的状态标记

- 已定稿：已在规格文档中冻结，可直接执行
- 原型态：前端代码已有展示 / 交互，但仍是 mock
- 待联调：需要表现层与逻辑层约定读模型、动作、字段或错误处理

---

## 2. 记账页总页面边界

### 2.1 记账页产品职责

记账页承担两类核心职责：

1. 作为导入账单入口，承接微信 / 支付宝账单导入
2. 作为随手记入口，以低摩擦方式完成一条手动记录

### 2.2 记账页不承担的职责

以下内容不得塞回记账页主界面：

1. 账本管理
2. AI 配置细项
3. 标签体系管理
4. 预算规则编辑
5. 手动录入的历史统计页
6. 全量流水浏览与复杂筛选

### 2.3 本轮集成不展开的内容

1. 导入流程中的文件选择器与解析结果预览
2. 手动录入成功后的持久化写盘
3. 录入成功后的首页读模型刷新策略
4. 去重候选提示与裁决流程

### 2.4 记账页组件树

当前原型代码中，记账页主要由以下组件组成：

1. 页面壳层：`MoniEntryPrototype.jsx`
2. 背景装饰：`Decor`
3. Header：`Logo` + 账本选择器
4. 数据导入卡：`ImportCard`
5. 最近流水参考区：`RecentReferenceList`
6. 主操作按钮：`EntryButton`
7. 分类投放蒙版：`CategoryOverlay`
8. 录入面板：`EntryFormPanel`
9. 成功反馈：`SuccessToast`
10. 底部导航：`EntryBottomNav`

---

## 3. 记账页全局状态模型

### 3.1 前端需要持有的核心状态

记账页至少需要消费并维护以下状态：

1. `currentLedger`
2. `entryPageRecentReferences`
3. `entryDragSessionState`
4. `entryPanelState`
5. `entrySaveFeedbackState`
6. `entryImportEntryPoints`

### 3.2 推荐的录入 UI 状态机

记账页 UI 层建议使用以下有限状态：

- `idle`：静态态，按钮可点击 / 可长按
- `selecting`：已打开分类蒙版，等待点击分类
- `dragging`：长按后进入拖拽态，悬浮 token 跟手移动
- `form`：已投放到分类，打开二级录入面板

### 3.3 表现层 / 逻辑层事件口径

记账页联调建议统一使用“读模型 + 动作”的模式：

1. 表现层读取聚合后的记账页读模型
2. 用户操作通过显式逻辑层动作发起
3. 导入流程、手动录入、成功提示通过状态更新驱动界面切换

---

## 4. 组件级业务逻辑规格

## 4.1 页面壳层 MoniEntry

### 业务职责

1. 编排记账页组件顺序
2. 协调导入卡、最近流水参考区、主操作按钮之间的视觉层级
3. 协调长按拖拽、分类命中、录入面板、成功反馈等跨组件交互

### 前端输入

- `currentLedger`
- `entryRecentReferences`
- `categoryDefinitions`

### 对逻辑层依赖

- 记账页聚合读模型
- 手动录入动作
- 账单导入入口动作

### 待联调点

- 需要在页面初始化时一次性拿到当前账本、最近流水参考区数据、分类定义
- 手动录入成功后是否同步刷新参考区，必须由逻辑层给出统一策略

---

## 4.2 Header：Logo + 账本选择器

### 已定稿规格

1. 左侧固定为完整 `Moni` 字标
2. 右侧为账本选择器
3. 记账页账本选择器只负责切换，不负责复杂管理
4. Header 为粘性顶部元素

### 推荐读模型 / 动作口径

#### 表现层读取

```json
{
  "currentLedger": {
    "id": "ledger_daily",
    "name": "日常开销"
  },
  "availableLedgers": [
    { "id": "ledger_daily", "name": "日常开销" },
    { "id": "ledger_trip", "name": "旅行账本" }
  ]
}
```

#### 逻辑层动作

`switchLedger(ledgerId)`

---

## 4.3 数据导入卡 ImportCard

### 业务职责

1. 展示数据导入主入口
2. 展示微信 / 支付宝来源入口
3. 提供导入帮助入口

### 表现层读取

```json
{
  "importEntryPoints": [
    { "source": "wechat", "label": "微信账单", "enabled": true },
    { "source": "alipay", "label": "支付宝账单", "enabled": true }
  ],
  "importGuide": {
    "label": "不知道怎么导出账单？查看导入指南",
    "enabled": true
  }
}
```

### 逻辑层动作

- `startImport(sourceType)`
- `openImportGuide()`

### 联调规则

1. 这里只负责导入入口，不在本页承载完整文件流程
2. 来源入口可由逻辑层按平台能力启用 / 禁用

---

## 4.4 最近流水参考区 RecentReferenceList

### 业务职责

1. 为用户提供最近消费语境
2. 作为信息参考区，而非严格统计区
3. 在用户准备随手记时降低回忆成本

### 已定稿规则

1. 展示的是**首页最新一天中的最新两条记录**
2. **不区分来源**
3. **不受首页 data range 约束**
4. 该区不是本页独立筛选结果，不承担精确统计含义

### 推荐读模型口径

```json
{
  "entryRecentReferences": [
    {
      "id": "tx_1001",
      "title": "杨国福麻辣烫",
      "amount": 45,
      "category": "正餐",
      "icon": "🍜"
    },
    {
      "id": "tx_1002",
      "title": "滴滴出行",
      "amount": 23,
      "category": "交通",
      "icon": "🚕"
    }
  ]
}
```

### 逻辑层生成规则

建议由逻辑层直接返回 `entryRecentReferences`，不要让表现层自己从首页 `dayGroups` 和 `dataRange` 中二次拼装。

推荐规则：

1. 取当前账本下日期最新的一天
2. 在该日内按时间倒序取前两条
3. 不过滤来源类型
4. 不应用首页 data range

### 待联调点

- 若同一账本当天没有记录，返回空数组还是回退到更早一天，需要逻辑层统一定义
- 若手动录入成功，是否立即把新条目并入该参考区，需要在集成阶段明确

---

## 4.5 主操作按钮 EntryButton

### 业务职责

1. 承载随手记主入口
2. 点击打开分类选择蒙版
3. 长按后进入拖拽投放流程

### 已定稿规格

1. 按钮位于页面下半部分居中
2. 与底部导航中央首页 icon 保持明确间距
3. 静态态按钮较窄，保持悬浮感
4. 长按后收缩为黑色铅笔悬浮 token

### 逻辑层关系

无直接后端依赖，主要是本地 UI 状态机。

---

## 4.6 分类投放蒙版 CategoryOverlay

### 业务职责

1. 展示全部分类投放目标
2. 承接点击选择与拖拽命中两种分类选择方式
3. 提供拖拽态的视觉反馈

### 已定稿规则

1. 蒙版除顶部描述文案外，其余视觉与交互反馈统一沿用首页 DragOverlay 范式
2. 顶部描述文案保持记账页自己的口径："拖放到分类中，开始记一笔"
3. 悬浮 token 保持记账页专用的黑色铅笔样式

### 表现层读取

```json
{
  "categoryDefinitions": [
    { "key": "正餐", "label": "正餐", "color": "#D85A30", "icon": "🍜" }
  ]
}
```

### 逻辑层动作

无直接后端动作，投放成功后进入 `openEntryPanel(category)`。

---

## 4.7 二级录入面板 EntryFormPanel

### 业务职责

1. 在分类确定后采集手动录入所需字段
2. 调用手动录入动作
3. 给出成功 / 失败反馈

### 前端表单字段

1. `amount`
2. `direction`
3. `category`
4. `subject`
5. `description`
6. `date`

### 逻辑层动作

`addManualEntry(ledgerId, manualEntryInput)`

### 推荐动作签名

```json
{
  "ledgerId": "ledger_daily",
  "input": {
    "amount": 45,
    "direction": "out",
    "category": "正餐",
    "subject": "火锅聚餐",
    "description": "周年纪念",
    "date": "2026-04-09"
  }
}
```

### 联调规则

1. 字段语义与 `docs/Moni_Manual_Entry_Spec_v3.md` 保持一致
2. 表现层不直接决定持久化字段映射
3. 逻辑层负责校验与落盘，表现层只负责展示表单与反馈

---

## 4.8 成功反馈 SuccessToast

### 业务职责

1. 在用户保存成功后给出轻量确认
2. 不打断用户继续录入下一条

### 联调规则

1. 成功反馈优先使用本地 optimistic UI
2. 若逻辑层返回失败，则不显示成功 Toast，改为错误态提示

---

## 5. 推荐读模型总览

记账页聚合读模型建议至少包含：

```json
{
  "currentLedger": {
    "id": "ledger_daily",
    "name": "日常开销"
  },
  "importEntryPoints": [
    { "source": "wechat", "label": "微信账单", "enabled": true },
    { "source": "alipay", "label": "支付宝账单", "enabled": true }
  ],
  "entryRecentReferences": [
    {
      "id": "tx_1001",
      "title": "杨国福麻辣烫",
      "amount": 45,
      "category": "正餐",
      "icon": "🍜"
    }
  ],
  "categoryDefinitions": [
    { "key": "正餐", "label": "正餐", "color": "#D85A30", "icon": "🍜" }
  ]
}
```

---

## 6. 推荐动作总览

记账页联调建议至少暴露以下动作：

1. `switchLedger(ledgerId)`
2. `startImport(sourceType)`
3. `openImportGuide()`
4. `addManualEntry(ledgerId, input)`

---

## 7. 当前原型现状

### 已实现

1. 页面壳层与底部导航切换
2. 数据导入卡静态结构
3. 最近记录参考区原型展示
4. 点击选分类与长按拖拽两条入口
5. 二级录入面板与成功反馈

### 原型态 / 待联调

1. 导入入口仍是 mock
2. 手动录入尚未接真实逻辑层
3. 最近记录参考区当前由本地 mock 数据生成
4. 保存成功后尚未与首页真实读模型联动

---

## 8. 验收要点

1. 记账页最近记录参考区必须不受首页 data range 影响
2. 最近记录参考区必须不区分来源
3. 主按钮必须位于页面下半部分居中，小字与按钮整体紧贴最近流水卡片下方，并与首页 icon 拉开距离
4. 长按按钮后必须收缩为黑色铅笔 token，并跟手移动
5. 投放分类后必须打开录入面板，而不是直接静默保存
