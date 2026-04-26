# Moni-UI-Prototype 协作规则

## 基本原则

- 永远用中文写协作说明和项目文档
- 所有新增代码必须包含必要的中文注释
- 本仓库是独立原型仓库，不是主仓库的运行时依赖
- 工作流遵循主仓库 `PROTOTYPE_DRIVEN_WORKFLOW_v3.md`

## 仓库解耦

- 禁止通过 `import`、`require`、alias、workspace、npm link、submodule 指针或相对路径引用主仓库代码
- 禁止让主仓库通过任何运行时方式引用本仓库代码
- 可以复制代码，但复制后代码属于当前仓库
- mock / fixtures 必须留在本仓库，不能迁移到主仓库正式运行时

## 原型代码要求

- 技术栈与主仓库保持一致：TypeScript、React、Vite、Tailwind、同版本级依赖
- 组件 props 和 mock service 签名要尽量对齐主仓库真实接口
- 不允许用 `any` 绕过类型；确有未知结构时使用 `unknown` 并显式收窄
- 不允许在组件内部硬编码业务数据；数据必须来自 mock / fixtures / facade 层
- 当前不启用 Design Scope 导航脚手架，页面导航维持状态驱动

## 审查交付

每个原型交付必须说明：

- 启动命令
- 状态路径清单
- 覆盖范围
- 不覆盖范围
- 已运行验证
- 与主仓库实现存在的已知偏差
