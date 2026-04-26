# Moni-UI-Prototype

Moni UI 表现层独立原型仓库。

本仓库遵循 `PROTOTYPE_DRIVEN_WORKFLOW_v3.md`，作为主仓库 UI/UX 表现层的长期 source of truth。主仓库只消费经确认的原型规格和复制后的代码，禁止运行时直接引用本仓库。

## 启动

```bash
npm install
npm run dev
```

## 验证

```bash
npm run typecheck
npm run build
```

## 当前审查入口

当前暂不启用 Design Scope 导航脚手架，审查者从应用自然入口进入：

- 首页：启动后默认页面
- 记账页：首页底部右侧“记账”
- 设置页：首页底部左侧“设置”
- 账单密码页：记账页点击“支付宝账单”，选择文件后触发 mock 密码状态；原型密码为 `123456`
- 随手记表单：记账页长按底部记账按钮并选择分类
- 首页交易详情：点击日卡片内交易条目
- 首页拖拽分类：长按交易条目拖到分类面板

## 范围边界

- 覆盖：首页、记账页、设置页当前主仓库表现层状态
- 覆盖：原型本地 mock 数据、账单导入探测/密码/成功状态、随手记新增、账本切换等关键 UI 状态
- 不覆盖：真实文件系统、真实账本持久化、真实 LLM、Android 原生文件选择器权限、真实 Capacitor 插件行为
- 不启用：v3 第五章 Design Scope 导航脚手架

## 目录

```text
src/
├── App.tsx                    # 状态驱动页面壳
├── main.tsx                   # Vite 入口
├── bootstrap/appFacade.ts     # 原型本地 mock facade
├── ui/                        # 与主仓库表现层同步的页面、hook、feature
├── shared/types/              # 复制后的共享类型
├── system/                    # 原型本地 Capacitor / device mock
└── logic/                     # 原型本地最小类型与 AI 批处理桩
```

## 解耦规则

- 禁止主仓库直接 import 本仓库代码
- 禁止本仓库直接 import 主仓库代码
- 禁止跨仓库 alias、workspace、npm link、submodule runtime 依赖
- 允许复制代码；复制后代码归目标仓库所有
- 原型 mock 不迁移到主仓库，迁移时替换为真实 service import
