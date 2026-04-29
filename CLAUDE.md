# CLAUDE.md — Moni-UI-Prototype

本文件记录原型仓库当前阶段的任务状态、执行边界和动态口径。

## 当前定位

- 本仓库是 Moni UI 表现层的独立原型仓库
- 工作流遵循主仓库根文档 `PROTOTYPE_DRIVEN_WORKFLOW_v3.md`
- 原型仓库是 UI 表现层 source of truth，主仓库是下游消费者
- 主仓库与原型仓库各自独立运行、独立构建，禁止运行时互相引用
- 当前项目暂不启用 v3 第五章 Design Scope 导航脚手架，仍使用与主仓库一致的状态驱动导航

## 当前基线

- 已将主仓库当前首页、记账页、设置页表现层复制同步到本仓库
- 已将原型仓库升级为 React 19 + TypeScript + Vite 7 + Tailwind 3
- 已新增原型本地 `appFacade` mock、Capacitor mock、AI 批处理器桩和随手记输入类型桩
- 已将历史 JSX 手机边框版源码移动到 `.archive/legacy-js-prototype-2026-04-26/`，当前 `src/` 只保留同构运行源码
- 已从主仓库 `window.__MONI_DEBUG__.home.getReadModel()` 导出首页 fixture，默认首页视觉状态与主仓库当前状态对齐
- 当前入口为 `src/main.tsx` -> `src/App.tsx`
- 当前新增 design scope：首页拖拽细则面板 `DragDetailPanel` + 交易详情页细化定义；该 scope 只补新增原型，不反向改写既有首页固定规格，拖拽投放后的 `ReasonDialog` 继续保留
- 当前拖拽面板口径已新增三条硬约束：面板底边必须始终锚定屏幕底侧之外，视觉上从底部长出；展开态虚线驻留区需尽量与真实展开判定区对齐，不能出现承接视觉与交互判定脱节；展开态下拖拽预览卡片必须明显落在驻留区内，且信息内容需尽量完整消费当前首页读模型

## 独立运行约束

- 禁止从主仓库 runtime 引用本仓库代码
- 禁止本仓库从主仓库 runtime 引用代码
- 禁止使用 `npm link`、workspace、跨仓库 alias、跨仓库相对路径或 submodule 指针建立代码耦合
- 允许从主仓库复制当前表现层代码到本仓库，复制后代码归本仓库所有
- 允许从本仓库复制已确认原型代码到主仓库，复制后代码归主仓库所有
- mock / fixtures 必须留在原型仓库，迁移到主仓库时只能替换为真实 service import

## 当前任务看板

| 任务 | 状态 | 说明 |
|------|------|------|
| 同步主仓库当前表现层 | Done | 首页、记账页、设置页与 `moni-home` feature 已复制到 `src/ui` |
| 原型仓库 TypeScript 化 | Done | 已补 `tsconfig`、`vite.config.ts`、React 19 依赖与严格类型检查 |
| mock 层隔离 | Done | `src/bootstrap/appFacade.ts` 提供与主仓库 facade 对齐的 mock 签名 |
| 状态驱动导航 | Done | `src/App.tsx` 只维护 `home / entry / settings` 状态切换，不启用 scope router |
| 表现层状态对齐 | Done | 首页 fixture、设置页可见状态、真实支付宝 zip 密码页均已对齐主仓库当前表现 |
| 首页拖拽细则面板与详情页细化原型 | In Progress | 新增底部 `DragDetailPanel`，并把详情页返回方式统一为左上角返回按钮；当前系统不存在 `memo` 字段，备注继续使用 `remark`；拖拽面板已切换为“底边锚定、向上增高、驻留区整块框选并承接拖拽预览卡片”的展开方式，且按当前口径固定为“Collapsed 展示分类结果，Expanded 只展示交易细则，并优先展示完整时间与原始判断线索字段” |
| 审查交付文档 | Done | `README.md` 与 `AGENTS.md` 已写入启动方式、状态路径和范围边界 |

## 验证状态

- `npm run typecheck`：已通过
- `npm run build`：已通过
- Playwright 隔离 Chromium：已用 `390 x 844` 视口对比主仓库与原型仓库首页、设置页、记账页、支付宝真实 zip 密码页，console error 为 0
- 对比截图：`/tmp/main-aligned-home.png`、`/tmp/prototype-aligned-home.png`、`/tmp/main-aligned-settings.png`、`/tmp/prototype-aligned-settings.png`、`/tmp/main-aligned-password.png`、`/tmp/prototype-aligned-password.png`

## 后续使用方式

1. 新 UI/UX 表现层变更先在本仓库探索
2. 使用 mock / fixtures 覆盖正常、异常、空态、边界状态
3. 用户确认原型后，再由主仓库复制迁移
4. 主仓库实现若发现原型不可落地，必须回到本仓库修正并重新确认
