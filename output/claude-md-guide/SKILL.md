---
name: claude-md-guide
description: Guide for creating and configuring CLAUDE.md files for Claude Code projects
version: 1.0.0
---

# CLAUDE.md 配置指南 Skill

## Overview
CLAUDE.md 是 Claude Code 的核心配置文件，用于定义项目的开发规范、工具链配置和代码风格指南。当 Claude Code 启动对话或执行任务时，会自动加载此文件作为上下文，帮助 AI 更好地理解项目需求。

## When to Use This Skill
Use this skill when:
- 创建新项目的 CLAUDE.md 配置文件
- 优化现有项目的 Claude Code 配置
- 设置团队共享的编码规范
- 创建自定义 slash 命令
- 配置项目特定的工作流程

## Quick Reference

### 文件位置与层级

```
project-root/
├── CLAUDE.md              # 项目记忆文件（团队共享，提交到 Git）
├── CLAUDE.local.md        # 本地配置（加入 .gitignore）
├── .claude/
│   ├── settings.json      # 项目共享配置
│   ├── settings.local.json # 个人本地配置
│   ├── commands/          # 项目级自定义命令
│   │   └── review.md
│   └── agents/            # 子代理配置
└── src/
    └── module/
        └── CLAUDE.md      # 子目录配置（可选）
```

**配置层级优先级：**
1. 子目录 `CLAUDE.md`（最高优先级）
2. 项目根目录 `CLAUDE.md`
3. 用户级 `~/.claude/CLAUDE.md`（最低优先级）

### 基本结构模板

```markdown
# Project Name

## 项目概述
简要描述项目用途和技术栈。

## 常用命令
- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run test`: 运行测试
- `npm run lint`: 代码检查

## 代码风格
- 使用 TypeScript 严格模式
- 使用 ES 模块语法 (import/export)
- 组件使用 PascalCase 命名
- 函数使用 camelCase 命名

## 项目结构
- `src/components/`: React 组件
- `src/hooks/`: 自定义 Hooks
- `src/utils/`: 工具函数
- `src/types/`: TypeScript 类型定义

## 工作流程
1. 修改代码后运行 `npm run typecheck`
2. 提交前运行 `npm run lint`
3. 单个测试优先于整个测试套件

## 注意事项
- 不要直接修改 `generated/` 目录
- API 密钥存放在 `.env.local`
```

### 不同技术栈示例

#### React/Next.js 项目

```markdown
# React Project CLAUDE.md

## 技术栈
- React 18 + TypeScript
- Next.js 14 (App Router)
- Tailwind CSS
- Zustand 状态管理

## 命令
- `npm run dev`: 开发服务器 (http://localhost:3000)
- `npm run build`: 生产构建
- `npm run test`: Jest 单元测试
- `npm run e2e`: Playwright E2E 测试

## 代码规范
- 组件使用函数式组件 + Hooks
- Props 使用 interface 定义，命名为 `ComponentNameProps`
- 使用 `use client` 指令区分客户端组件
- CSS 优先使用 Tailwind，复杂样式用 CSS Modules

## 目录结构
- `app/`: Next.js App Router 页面
- `components/ui/`: 基础 UI 组件
- `components/features/`: 业务组件
- `lib/`: 工具库和配置
- `hooks/`: 自定义 Hooks

## 状态管理
- 全局状态使用 Zustand store
- 服务端状态使用 React Query
- 表单状态使用 React Hook Form
```

#### Python/FastAPI 项目

```markdown
# FastAPI Project CLAUDE.md

## 技术栈
- Python 3.11+
- FastAPI + Pydantic v2
- SQLAlchemy 2.0 (async)
- PostgreSQL + Redis

## 命令
- `make dev`: 启动开发服务器
- `make test`: 运行 pytest
- `make lint`: ruff + mypy 检查
- `make migrate`: 数据库迁移

## 代码规范
- 使用 type hints 全覆盖
- Pydantic models 用于请求/响应
- SQLAlchemy models 用于数据库
- 使用 async/await 异步编程

## 目录结构
- `app/api/`: API 路由
- `app/models/`: SQLAlchemy 模型
- `app/schemas/`: Pydantic 模式
- `app/services/`: 业务逻辑
- `app/core/`: 配置和依赖

## 环境
- 使用 pyenv 管理 Python 版本
- 使用 poetry 管理依赖
- 开发环境: `.env.development`
- 测试环境: `.env.test`
```

#### Vue.js 项目

```markdown
# Vue Project CLAUDE.md

## 技术栈
- Vue 3 + TypeScript
- Vite 构建工具
- Pinia 状态管理
- Vue Router 4

## 命令
- `pnpm dev`: 开发服务器
- `pnpm build`: 生产构建
- `pnpm test:unit`: Vitest 单元测试
- `pnpm lint`: ESLint 检查

## 代码规范
- 使用 Composition API + `<script setup>`
- 组件使用 SFC 单文件组件
- Props 使用 defineProps<T>() 定义
- Emits 使用 defineEmits<T>() 定义

## 命名约定
- 组件: PascalCase (MyComponent.vue)
- Composables: use 前缀 (useCounter.ts)
- Stores: use 前缀 + Store 后缀 (useUserStore.ts)
```

### 自定义命令

#### 创建项目级命令

```markdown
<!-- .claude/commands/review.md -->
请审查当前的代码变更：

1. 检查代码质量和最佳实践
2. 识别潜在的 bug 和安全问题
3. 评估性能影响
4. 验证测试覆盖率
5. 提供改进建议

使用项目的代码规范进行审查。
```

**使用方式：** `/project:review`

#### 创建用户级命令

```markdown
<!-- ~/.claude/commands/commit.md -->
请根据当前的变更生成 commit message：

1. 遵循 Conventional Commits 规范
2. type: feat/fix/docs/style/refactor/test/chore
3. 简洁描述变更内容
4. 如有需要，添加详细说明

格式：
<type>(<scope>): <subject>

<body>
```

**使用方式：** `/user:commit`

#### 带参数的命令

```markdown
<!-- .claude/commands/test.md -->
为以下功能编写测试用例：$ARGUMENTS

要求：
1. 覆盖正常情况和边界情况
2. 使用项目的测试框架
3. 遵循 AAA 模式 (Arrange-Act-Assert)
4. 添加清晰的测试描述
```

**使用方式：** `/project:test 用户登录功能`

### 高级配置

#### Monorepo 配置

```markdown
# Root CLAUDE.md (monorepo-root/)
## Monorepo 结构
- `packages/web/`: 前端应用
- `packages/api/`: 后端服务
- `packages/shared/`: 共享库

## 全局命令
- `pnpm install`: 安装所有依赖
- `pnpm build`: 构建所有包
- `pnpm test`: 运行所有测试

## 工作空间
使用 pnpm workspaces 管理依赖
```

```markdown
# packages/web/CLAUDE.md
继承根目录配置，专注于前端开发。

## 特定命令
- `pnpm dev`: 启动前端开发服务器
- `pnpm storybook`: 启动组件文档
```

#### 团队协作配置

```markdown
# CLAUDE.md

## Git 工作流
- 主分支: main
- 开发分支: develop
- 功能分支: feature/xxx
- 修复分支: fix/xxx

## PR 要求
1. 必须通过 CI 检查
2. 至少一人 Code Review
3. 合并使用 Squash and Merge

## Commit 规范
遵循 Conventional Commits:
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具变更
```

### 动态添加内容

在对话中使用 `#` 可以动态向 CLAUDE.md 添加内容：

```
# 添加新的注意事项：API v2 已弃用，使用 v3
```

这会自动追加到 CLAUDE.md 文件中。

### settings.json 配置

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff)",
      "Read(*)",
      "Write(src/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Write(.env*)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

## Best Practices

### 1. 保持简洁
- 只包含 Claude 需要知道的信息
- 避免冗余的文档内容
- 聚焦于规范和约定

### 2. 及时更新
- 随项目演进更新配置
- 记录重要的架构决策
- 添加新发现的注意事项

### 3. 分层配置
- 通用配置放在用户级
- 项目特定配置放在项目级
- 模块特定配置放在子目录

### 4. 团队共享
- `CLAUDE.md` 提交到 Git
- `CLAUDE.local.md` 加入 `.gitignore`
- 定期 review 和更新配置

### 5. 命令规范
- 命令名使用小写和连字符
- 添加清晰的使用说明
- 参数使用 `$ARGUMENTS` 占位符

## Common Issues

### 配置不生效
1. 检查文件名是否正确（大小写敏感）
2. 确认文件位于正确位置
3. 重启 Claude Code 会话

### 配置冲突
- 子目录配置优先级更高
- 使用 `CLAUDE.local.md` 覆盖团队配置
- 明确指定优先使用的规范

### 命令不可用
1. 检查命令文件位置
2. 确认文件扩展名为 `.md`
3. 使用正确的前缀 (`/project:` 或 `/user:`)

## Reference Documentation
- Claude Code 官方文档: https://docs.anthropic.com/claude-code
- CLAUDE.md 介绍: https://blog.csdn.net/Dontla/article/details/150590085
- 配置指南: https://cloud.tencent.com/developer/article/2566484
- 使用技巧: https://zhuanlan.zhihu.com/p/1928918331810886674
