# Moni — Stitch 使用攻略 & 逐屏 Prompt

## 第一部分：Stitch 工作流基础

### 什么是 Stitch

Google Stitch 是一个 AI 驱动的 UI 设计工具，输入自然语言描述或参考图，输出高保真 UI 设计 + HTML/Tailwind 代码。它不是 Figma 的替代品，而是设计流程的起点——用 Stitch 快速探索方向，然后导出到 Figma 精修，或直接用代码作为开发参考。

### 核心能力

- 文字描述 → 完整 UI 界面（支持多屏同时生成）
- 上传参考图/手绘草图 → AI 理解风格后生成匹配设计
- 语音交互：直接用语音描述修改需求
- 直接编辑：点击文字元素直接修改，不需要重新生成
- 导出：HTML + Tailwind CSS 代码 / 导出到 Figma / 可分享原型链接

### 四种模式

| 模式 | 用途 | 消耗 | 推荐场景 |
|------|------|------|---------|
| **Ideate** | 早期探索，不确定要什么 | 低 | 项目初期，试方向 |
| **3 Flash** | 快速生成，知道要什么了 | 低 | 批量出屏幕 |
| **Thinking** | 最高质量输出，用 Gemini 2.5 Pro | 高 | 最终打磨 |
| **Redesign** | 改造已有设计 | 中 | 基于截图/草图重做 |

免费额度：每月 350 次标准生成（Flash），Thinking 模式消耗更多额度。

### DESIGN.md 机制

Stitch 支持一个名为 DESIGN.md 的纯文本设计系统文件。在这个文件里定义颜色、字体、间距规范后，所有后续生成的屏幕都会遵循这套规范，保持跨屏一致性。**强烈建议在生成第一个屏幕之前先创建 DESIGN.md。**

---

### 推荐工作流（适合你们的情况）

```
步骤 1：创建 DESIGN.md
  在 Stitch 画布上，用 Prompt 让 AI 帮你生成一份 DESIGN.md
  输入你的 Memphis 参考图 + 品牌色方向描述
  AI 会输出一份包含颜色、字体、组件规范的设计系统文件

步骤 2：逐屏生成（先 Ideate 探索，再 Flash 定型）
  每次专注一个屏幕
  上传参考图 + 粘贴下方的 Prompt
  Stitch 生成 2-3 个变体，选最接近的那个

步骤 3：Direct Edit 微调
  点击文字直接改措辞
  调整间距和细节
  不满意的局部用追加 Prompt 修改，不要重新生成整个页面

步骤 4：导出
  方案 A：导出到 Figma → 元希精修
  方案 B：下载 HTML/Tailwind 代码 → 给开发作为视觉参考
  方案 C：获取可分享链接 → 团队预览

步骤 5：迭代
  用 Redesign 模式上传上一轮的截图进行改进
  或用语音描述修改需求
```

### Prompt 写法原则（Zoom-Out-Zoom-In 框架）

Stitch 的 Prompt 遵循"先给大背景，再聚焦具体屏幕"的结构：

```
[产品上下文] — 1-2 句话说清楚这是什么产品、给谁用的
[屏幕目标] — 这个屏幕的职责是什么，用户在这里要完成什么
[布局层级] — 从上到下，每个区域包含什么内容
[视觉关键词] — 风格、情绪、参考
[不要什么] — 明确的负面约束
```

---

## 第二部分：DESIGN.md 生成 Prompt

先在 Stitch 中运行这段 Prompt，生成你的设计系统文件：

```
Create a DESIGN.md for a mobile finance app called "Moni".

Visual style: Memphis Design — inspired by the uploaded reference image.
- Background: warm off-white/cream (not pure white)
- Cards: white with 2px black rounded borders (border-radius 14-16px)
- Accent colors: coral/salmon pink, sky blue, sunny yellow, mint/teal green
- Decorative elements: small Memphis geometric shapes (circles, triangles, zigzag lines) at low opacity in margins
- Typography: rounded sans-serif for headings, monospace for financial numbers
- Icons: bold outlines, simple shapes, category-colored backgrounds

Key UI patterns:
- Bottom nav bar with 3 items, center item is oversized brand button
- Cards with bold 2px black borders for primary content, 1.5px gray borders for secondary
- Pill-shaped filter buttons with dark fill for active state
- Progress bars that change color based on value (green→amber→coral)
- Skeleton loading states for async content

Color semantics:
- Spending amounts: coral/red
- Income amounts: teal/green
- Warning/uncategorized: warm amber/orange
- AI status active: teal glow
- Budget healthy: teal, budget warning: amber, budget over: coral

Do NOT use: dark backgrounds, gradients, drop shadows, neon colors, or generic Material Design patterns.
```

上传孟菲斯参考图后运行此 Prompt。Stitch 会生成一份 DESIGN.md，后续所有屏幕生成都会参照它。

---

## 第三部分：逐屏 Prompt

### 屏幕 1：首页 — 正常态（有预算）

```
Mobile app screen for "Moni", a personal finance tracker. Memphis design style per DESIGN.md.

This is the main home screen — the user's financial dashboard and transaction feed combined in one scrollable view.

Layout from top to bottom:

TOP BAR (sticky — always fixed at top during scrolling, never scrolls away):
- Left: "Moni" in Nunito ExtraBold (800) font, all four letters unified. Three-color brand accent decorations (coral circle, blue circle, yellow diamond) clustered above the M-to-o junction area — not pushed far right. A tiny coral dot at the baseline between M and o. A faint teal line past the i as light secondary decoration. (See Brand Design Spec for exact SVG.)
- Right: ledger selector pill button showing "日常开销" with a dropdown chevron

DASHBOARD CARD (prominent, bold black border):
- A budget progress card
- Top edge: thin progress bar spanning full width, 62% filled in teal
- Left side: label "4月预算", large number "¥3,128", subtitle "剩余 ¥1,872 · 还有 24 天" in teal
- Right side: "日均可用" label, "¥78" number
- Below the card: 2 carousel dots (first dot filled, second hollow)

STATS BAR (3 small cards in a row):
- "本月支出 ¥3,128" in coral
- "本月收入 ¥5,000" in teal  
- "共计 96 笔" in dark

CATEGORY OVERVIEW CARD (light border):
- Header: "分类概览" left, "本月 ›" right in teal (tappable)
- A horizontal stacked bar: 45% coral, 20% blue, 15% yellow, 12% gray, 8% hatched/semi-transparent (uncategorized)
- Legend row with colored squares and percentages

FILTER PILLS (horizontally scrollable):
- "全部" (dark fill, active), "正餐", "交通", "零食", "未分类 · 3" (warm pink background, warning style)

TRANSACTION DAY CARD (bold black border, "今天"):
- Header: "今天" left, "−¥187" right in coral
- Row 1: coral icon area, "杨国福麻辣烫", category tag "正餐", below it a subtle green AI tag "AI: 餐饮商户，正餐时段", time "18:10", amount "¥45"
- Row 2: blue icon, "滴滴出行", tag "交通", AI tag "AI: 出行平台", "16:30", "¥23"
- Row 3: dashed-border icon with "?", "益禾堂", tag "未分类" in warning style, "19:40", "¥12"

COLLAPSED DAY CARD (light border, slightly dimmed):
- "昨天", "−¥256", "4 笔 · 全部已分类 ✓"

BOTTOM NAV BAR:
- Left: settings icon, label "设置"
- Center: oversized rounded-square button (dark background #222, rounded corners) containing a hand-drawn cat-ear M in cream with brand three-color accents (coral circle, blue circle, yellow diamond). This is the Moni brand icon, identical to the App Icon. Button is visually elevated above the nav bar. Small teal status dot at bottom-right corner. Label "首页"
- Right: list+plus icon, label "记账"

Scattered Memphis decorations: 2-3 very low opacity geometric shapes in corners of the screen (a yellow circle near top-right, a blue triangle, a coral dot)

Do NOT include: any text that says "AI分类中", dark background, pie charts, or detailed transaction expansion.
```

### 屏幕 2：首页 — 趋势图卡片（轮播第二张）

```
Same home screen as before, but the dashboard carousel has swiped to the second card.

DASHBOARD CARD now shows a 7-day spending trend:
- Header: "近 7 天支出" left, "← 滑动查看更多" right in muted text
- A lightweight line chart: thin teal line with subtle fill underneath, no grid lines, no Y-axis labels
- X-axis: 7 date labels (3/31 through 4/6), the current day label highlighted in teal
- The peak day has a small dot marker on the line
- The chart should feel airy and lightweight — not a heavy data visualization
- Carousel dots: second dot filled, first hollow

Everything else on the screen remains the same as Screen 1.
```

### 屏幕 3：首页 — 预算警戒态

```
Same home screen layout, but the budget is at 91% used, changing the visual mood.

DASHBOARD CARD changes:
- Progress bar is 91% filled in amber/orange (not teal)
- Card border color shifts from black to amber/warm brown
- Label becomes "4月预算 · 接近上限" in amber
- Large number "¥4,560"
- Subtitle "剩余 ¥440 · 还有 24 天" in amber
- Daily allowance "¥18" in amber, emphasized

CONTEXTUAL HINT CARD appears between dashboard and stats:
- Light peach background, warm border
- "本周消费偏高" as title
- "比上周同期多 ¥320，主要来自正餐分类" as subtitle
- No action button, just informational

Stats bar labels remain "本月支出" etc. The category overview bar shows "正餐" segment slightly larger with an upward arrow indicator.

The overall feel should be subtly warmer — the app is gently signaling "you're spending more than usual" without being alarming.
```

### 屏幕 4：首页 — 无预算态

```
Same home screen, but the user has not configured a budget.

DASHBOARD CARD shows ONLY the 7-day trend chart (no budget card, no carousel, no dots).
The card has standard black border (no color tinting).

No contextual hint card.

Stats bar and everything below remains the same.
```

### 屏幕 5：首页 — 空态（无数据）

```
Mobile screen for Moni. The user has just finished onboarding but has no transaction data yet.

TOP BAR: same as other screens (Moni wordmark + ledger selector "日常开销")

CENTER CONTENT (vertically centered in the main area):
- A cluster of Memphis geometric shapes (circles, triangles, zigzag lines) in brand colors, creating a playful abstract illustration — not a literal picture, just geometric art
- Below it: "你的财务助手" in medium text
- Below that: "越用越懂你" as a subtitle in muted color

Two prominent action buttons stacked vertically:
- Primary: "📄 导入微信/支付宝账单" — bold style, dark background or strong border
- Secondary: "✏️ 随手记一笔" — lighter style, outlined

At the bottom (above nav bar): small muted text link "已有账本？切换账本 →"

BOTTOM NAV BAR: same as always

The screen should feel inviting and warm, not empty or broken. The geometric art fills the void with personality.
```

### 屏幕 6：首页 — AI 引擎工作态

```
Same home screen, but the AI classification engine is currently processing one day's transactions.

The day card for "4月4日" has a special border treatment:
- Instead of the normal 2px black border, the card has a flowing brand three-color border — cycling through coral (#FF6B6B), yellow (#F9D56E), sky blue (#7EC8E3), and mint (#4ECDC4) in a smooth gradient strip flowing clockwise. These are the same colors used in the Moni brand mark.
- Inside the card, the first transaction row shows normally (already classified)
- The second and third rows are skeleton placeholders — subtle pulsing gray bars where text and numbers would be, indicating data is being processed

The center nav button in the bottom bar has a brand three-color glow ring matching the card border effect, and its label reads "运行中" in teal instead of "首页"

Everything else on screen remains normal. The two effects (card border + button glow) use the same brand three-color accent system, creating a synchronized visual link.
```

### 屏幕 7：拖拽分类交互态

```
Mobile screen showing the drag-to-classify interaction in progress.

A semi-transparent dark overlay covers the entire screen (40-50% opacity).

ABOVE THE TRANSACTION LIST AREA, a grid of category drop targets appears:
- 2 columns, 3 rows of rounded-rectangle bins
- Each bin is labeled with a category name and colored with its category accent color
- Example: "正餐" (coral), "交通" (blue), "零食" (yellow), "购物" (purple), "娱乐" (pink), "生活服务" (gray)
- One bin (e.g., "正餐") is slightly enlarged and brightened — the user is hovering over it

A transaction item floats under the user's finger, slightly scaled up with a subtle shadow, visually "lifted" from the list:
- Shows the merchant name "益禾堂" and amount "¥12"

Below, the transaction list is dimmed behind the overlay, with the slot where the item was picked up showing as an empty dashed outline.

The overall feel: satisfying, game-like, tactile. Dropping an item into a bin should feel like sorting puzzle pieces.
```

### 屏幕 8：初始化引导 — 步骤 1（账本命名）

```
Mobile onboarding screen, step 1 of 4. Memphis style.

Progress indicator at top: 4 dots, first one filled.

CENTER CONTENT:
- Memphis geometric illustration (abstract, playful — circles, triangles, the M shape)
- Headline: "欢迎使用 Moni"
- Subtitle: "给你的第一个账本起个名字吧"
- Text input field, pre-filled with "日常开销", editable
- Below: a small hint "你可以在设置中随时修改"

BOTTOM: large "下一步" button

Warm, inviting, quick. This should feel like it takes 5 seconds.
```

### 屏幕 9：初始化引导 — 步骤 2（分类标签）

```
Mobile onboarding screen, step 2 of 4.

Progress: 4 dots, second filled.

Headline: "设置分类标签"
Subtitle: "这些标签帮助 AI 理解你的消费，随时可以修改"

A list of default categories, each as a small card/row:
- 正餐 — 日常用餐支出 (coral dot)
- 交通 — 出行打车公交 (blue dot)
- 零食饮品 — 奶茶咖啡小吃 (yellow dot)
- 购物 — 网购日用品 (purple dot)
- 娱乐 — 游戏会员订阅 (pink dot)
- 生活服务 — 水电话费理发 (gray dot)
Each row has a small × to remove.

Below the list: "+ 添加分类" button (outlined)

A hint: "其他分类会自动添加"

BOTTOM: two buttons side by side
- "使用默认设置" (primary, for lazy users)
- "下一步" (secondary, for those who customized)
```

### 屏幕 10：初始化引导 — 步骤 3（预算）

```
Mobile onboarding screen, step 3 of 4.

Progress: 4 dots, third filled.

Headline: "要不要设一个月预算？"
Subtitle: "预算帮你感知消费节奏，不用精确——大概就好"

A large, prominent number input for monthly budget, with ¥ prefix.
Placeholder text: "例：5000"

Below: an expandable section "按分类设预算（可选）" — collapsed by default, with a chevron to expand

BOTTOM: two options
- "设置预算" button (primary)
- "暂不设置，跳过" text link below
```

### 屏幕 11：初始化引导 — 步骤 4（导入）

```
Mobile onboarding screen, step 4 of 4.

Progress: 4 dots, fourth filled.

Headline: "导入你的第一份账单"
Subtitle: "从微信或支付宝导出 CSV 文件"

Primary button: "📄 导入 CSV 文件" (large, prominent)
Secondary button: "✏️ 先手动记一笔" (outlined, smaller)
Text link at bottom: "稍后再说 →"

A small tip section: "如何导出 CSV？" with brief instructions or a link
```

### 屏幕 12：记账页

```
Mobile screen for the "记账" tab. Two sections.

SECTION 1 — Import:
A card with file icon: "导入微信/支付宝账单"
Subtitle: "选择 CSV 文件，自动解析并合并"

SECTION 2 — Manual entry form:
Header: "随手记"
- Amount input (large, prominent, with ¥ prefix) — required
- Direction toggle: "支出" (default, active) / "收入"
- Category pills (horizontally scrollable, matching the home page filter pills) — required, tap to select
- Subject/description field (optional): placeholder "例：和女朋友吃火锅"
- Notes field (optional): placeholder "备注"
- Date: "今天 4月6日" (tappable to change)
- Save button: "✓ 保存" (prominent, bottom)

The form should feel minimal and fast — two required fields (amount + category), everything else optional. No clutter.
```

### 屏幕 13：设置页

```
Mobile settings screen. A scrollable list divided into two sections.

SECTION HEADER: "全局设置"
- AI 服务配置 (icon + label + chevron) — API Key, model selection
- 自述 — 让 AI 了解你 (shows preview of first line)
- 账本管理 (list of ledgers)
- 关于 Moni

SECTION HEADER: "日常开销" (current ledger name)
- 分类标签管理
- AI 记忆 (shows count: "已学习 23 条偏好")
- 预算设置
- 重新分类
- 学习设置 (threshold + learn now button)

Each item is a simple list row with left icon, label, and right chevron. Clean, standard mobile settings pattern. Memphis decorations minimal here — this is a utility screen.
```

### 屏幕 14：Date Range Picker 弹窗

```
A centered modal overlay on the home screen (semi-transparent background behind it).

Quick-select buttons in a row at top:
"今天" "本周" "本月" "近三月" — pill-shaped, tap to select and close

Below: a custom range section
- Two date inputs: start date and end date
- Or: a visual dual-thumb slider on a timeline, with subtle bar chart backdrop showing transaction density by week

Bottom: "确定" and "取消" buttons

The modal has a white background with rounded corners and Memphis-style border.
```

---

## 第四部分：常见问题

**Q: 生成的结果不满意怎么办？**
不要重新生成整个页面。用追加 Prompt 修改具体部分："Move the budget card progress bar to the top edge of the card" 或 "Change the category bar to show an uncategorized segment at the end with diagonal hatching"。

**Q: 多个屏幕之间风格不一致怎么办？**
确保 DESIGN.md 已经创建并激活。如果还是不一致，在 Prompt 中明确引用 DESIGN.md："Follow the DESIGN.md color system and card styles."

**Q: 英文 Prompt 还是中文？**
Prompt 用英文效果更好（Stitch 底层是 Gemini，英文理解更精确）。界面内的文字内容用中文写在 Prompt 里就行，Stitch 会正确渲染中文。

**Q: 怎么处理交互动画？**
Stitch 生成的是静态 UI。交互动画（拖拽、轮播、折叠展开）需要在开发阶段用 Framer Motion 实现。Stitch 的价值是确定"每个状态长什么样"，动画是开发的事。

**Q: 需要分几次生成？**
建议顺序：
1. 先生成 DESIGN.md
2. 首页正常态（屏幕 1）— 确认大方向
3. 首页其他状态（屏幕 2-6）— 验证状态变化的视觉一致性
4. 拖拽交互态（屏幕 7）
5. 初始化引导（屏幕 8-11）
6. 记账页 + 设置页（屏幕 12-13）
7. 弹窗类（屏幕 14）
每次 1-2 个屏幕，不要贪多。

---

## 第五部分：品牌元素生成指南

### App Icon 生成

App Icon 基于导航栏按钮的定稿 SVG（见品牌设计规范 3.2 节）。流程：
1. 将定稿 SVG 截图或导出为图片
2. 喂给生图 AI（Midjourney / DALL-E），用以下 Prompt 让它在此基础上精修为适合 App Icon 的 PNG

```
A mobile app icon in Memphis style. Rounded square with solid dark background (#222222). Center: a hand-drawn style letter "M" in cream white (#F5F0EB) with rounded stroke endings. The M's two peaks are subtly rounded to suggest cat ears — elegant typographic treatment, not cartoon. Near the top-right of the M, three small geometric elements clustered: a coral pink circle (#FF6B6B, largest), a sky blue circle (#7EC8E3, medium), a sunny yellow diamond rotated 15 degrees (#F9D56E, smallest). Perfectly flat, no gradient, no shadow. Must read clearly at 60x60px.

Negative: text other than M, realistic cat, background pattern, 3D effects
```

3. 选定后导出为 1024×1024 PNG，用各平台工具裁切适配

### 吉祥物 Moni 猫（P2 储备）

```
A cute minimal mascot of an orange tabby cat, sitting front-facing, calm slightly sleepy expression (half-closed eyes, gentle smile). Two pointed ears clearly form the letter "M". Memphis style: bold 2px black outlines, flat colors, no gradients. Small floating decorations: coral circle (#FF6B6B), sky blue circle (#7EC8E3), yellow diamond (#F9D56E). Orange (#E8945A) fur, cream (#F5F0EB) belly. Flat vector, works from 24px icon to full-screen.

Negative: realistic, 3D, photographic, dark colors, aggressive, standing, clothes
```
