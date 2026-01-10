---
name: claude-md-guide
description: Guide for creating and configuring CLAUDE.md files for Claude Code projects
version: 2.0.0
---

# CLAUDE.md 配置指南 Skill

## Overview
CLAUDE.md 是 Claude Code 的核心配置文件，作为 AI 助手的**身份与偏好文档**。它定义了开发者的身份、技术偏好和工作约束。当 Claude Code 启动时会自动加载此文件，帮助 AI 更好地理解项目需求和个人工作风格。

**设计哲学：** CLAUDE.md 只放身份/偏好，具体约束放 rules，技能放 skills，工作流放 commands。

## When to Use This Skill
Use this skill when:
- 创建新项目的 CLAUDE.md 配置文件
- 设计三层配置架构（Rules、Skills、Commands）
- 配置防御性编程规则
- 创建团队共享的编码规范
- 设置自定义 slash 命令和工作流

## Quick Reference

### 三层配置架构

```
~/.claude/                    # 用户级配置（全局生效）
├── CLAUDE.md                 # 身份/偏好（简洁）
├── settings.json             # 权限设置
├── commands/                 # 用户级命令
│   ├── commit-msg.md
│   └── code-review.md
├── rules/                    # 始终加载的约束规则
│   └── claude-code-defensive.md
├── skills/                   # 按需触发的技能
│   ├── go-dev/
│   ├── java-dev/
│   ├── frontend-dev/
│   └── python-dev/
├── tasks/                    # 任务配置
└── templates/                # 模板文件

project-root/                 # 项目级配置
├── CLAUDE.md                 # 项目记忆（团队共享）
├── CLAUDE.local.md           # 本地配置（.gitignore）
└── .claude/
    ├── settings.json
    ├── commands/             # 项目级命令
    └── rules/                # 项目级规则
```

**配置层级说明：**
| 类型 | 位置 | 加载方式 | 用途 |
|------|------|----------|------|
| Rules | `.claude/rules/` | 始终加载 | 防御性约束、编码规范 |
| Skills | `.claude/skills/` | 条件触发 | 技术栈开发标准 |
| Commands | `.claude/commands/` | 显式调用 | 工作流自动化 |

### CLAUDE.md 核心模板

**设计原则：保持简洁，只放身份和偏好**

```markdown
# Claude Code 配置

**维护者**: [姓名] | **版本**: v1.0 | **更新日期**: 2025-01-08

## 身份定位
全栈开发者，技术栈：Go、TypeScript、Vue、PostgreSQL

## 沟通原则
- 直接切入要点，避免冗长铺垫
- 代码优先，结构化展示
- 中英混合表达（技术术语用英文）

## 技术偏好
- 后端：Gin + GORM (Go) / FastAPI (Python)
- 前端：Vue 3 + TypeScript + Vite
- 数据库：SQLite (开发) / PostgreSQL (生产)

## 决策优先级
简单 > 复杂 | 复用 > 新建 | 直接实现 > 抽象

## 工作约束
详见规则文件：`claude-code-defensive.md`
```

### 防御性编程规则

创建 `.claude/rules/claude-code-defensive.md`：

```markdown
# 防御性编程规则 v3.0

## 严格禁止 ❌

### 1. 测试篡改（最严重）
> 测试失败时，修复实现代码，而不是修改测试来匹配错误代码

### 2. 过度工程化
- 不添加未要求的功能
- 不过度抽象简单需求
- 不创建"以防万一"的代码

### 3. 盲目修改
- 不在未理解代码的情况下修改
- 不中途放弃任务而不说明原因
- 不保留注释掉的"幽灵代码"

### 4. 主动行为
- 不主动创建文档文件
- 不添加未要求的元数据
- 不进行未经确认的重构

## 必须遵循 ✅

### 1. Type-First 原则
先定义数据结构，再写业务逻辑：
```go
// 1. 先定义类型
type User struct {
    ID   int64  `json:"id"`
    Name string `json:"name"`
}

// 2. 再写业务逻辑
func CreateUser(name string) (*User, error) {
    // ...
}
```

### 2. 复杂任务工作流
1. 说明计划 → 等待确认
2. 逐步实现 → 阶段验证
3. 完成验证 → 全面测试

### 3. 修改前检查清单
- [ ] 搜索类似功能是否存在
- [ ] 了解现有模式和约定
- [ ] 确认不破坏现有功能

### 4. 大文件处理策略
文件超过 token 限制时：
- 使用 Grep 定位目标内容
- 使用 Read 读取特定区域
- 分块处理，避免一次加载

## 发现问题时

### 必须报告
- 类型错误和类型不匹配
- 潜在的空指针/未定义访问
- 缺失的错误处理

### 建议优化
- 更优雅的写法
- 性能改进机会
- 代码重复消除
```

### 自定义命令示例

#### 代码审查命令
`.claude/commands/code-review.md`：

```markdown
# 代码审查

执行当前分支的代码审查，遵循"净正向 > 完美"原则。

## 可用工具
- `git diff`, `git status`, `git log`
- 文件读取、全局匹配、内容搜索

## 审查优先级
1. **架构设计**（关键）- 设计是否合理
2. **功能正确性**（关键）- 逻辑是否正确
3. **安全性**（必须）- 是否存在漏洞
4. **可维护性**（重要）- 代码是否清晰
5. **测试覆盖**（重要）- 测试是否充分
6. **性能优化**（注意）- 是否有性能问题

## 输出格式
### 🔴 严重问题
[必须修复的问题]

### 🟡 改进建议
[建议改进的地方]

### 🟢 细节建议
[可选的优化点]

使用简体中文，提供具体、可操作的反馈。
```

**使用方式：** `/project:code-review` 或 `/user:code-review`

#### Commit Message 生成
`.claude/commands/commit-msg.md`：

```markdown
# Git Commit Message 生成

分析代码变更并生成规范的 commit message。

## 步骤
1. 执行 `git diff --staged` 获取已暂存变更
2. 分析变更类型：feat/fix/refactor/style/docs/test/chore
3. 生成符合规范的 commit message

## 格式规范
- 主题行：50字符以内（中文）
- 类型标识：feat/fix/refactor/style/docs/test/chore
- 详情：列表形式
- 不使用表情符号

## 输出示例
```
feat(user): 添加用户注册功能

- 实现邮箱验证逻辑
- 添加密码强度检查
- 集成短信验证码服务
```

## 参数
- 默认：分析已暂存变更
- `all`：分析所有未提交变更
```

**使用方式：** `/project:commit-msg` 或 `/project:commit-msg all`

#### 调试命令
`.claude/commands/debug.md`：

```markdown
# 调试助手

帮助定位和修复问题：$ARGUMENTS

## 调试流程
1. 复现问题 - 确认问题描述
2. 定位原因 - 追踪代码路径
3. 分析根因 - 找出根本原因
4. 提出方案 - 给出修复建议
5. 验证修复 - 确认问题解决

## 输出格式
### 问题描述
[问题的简要描述]

### 根因分析
[问题产生的根本原因]

### 修复方案
[具体的修复步骤和代码]

### 验证方法
[如何验证问题已修复]
```

**使用方式：** `/project:debug 用户登录失败`

#### 新功能开发
`.claude/commands/new-feature.md`：

```markdown
# 新功能开发

开发新功能：$ARGUMENTS

## 开发流程
1. **需求确认** - 理解功能需求
2. **设计方案** - 制定技术方案（等待确认）
3. **类型定义** - Type-First，先定义接口
4. **核心实现** - 实现业务逻辑
5. **测试编写** - 编写单元测试
6. **集成验证** - 确保不破坏现有功能

## 检查清单
- [ ] 搜索是否有类似功能
- [ ] 遵循项目现有模式
- [ ] 添加必要的错误处理
- [ ] 编写测试用例
- [ ] 更新相关文档（如需要）
```

**使用方式：** `/project:new-feature 添加用户头像上传`

### 技术栈 Skills

#### Go 开发 Skill
`.claude/skills/go-dev/SKILL.md`：

```markdown
# Go 开发规范

## 触发条件
当检测到 `go.mod` 或 `.go` 文件时自动加载

## 代码风格
- 使用 gofmt 格式化
- 遵循 Effective Go 指南
- 错误处理优先，不忽略 error

## 项目结构
```
project/
├── cmd/           # 入口点
├── internal/      # 内部包
├── pkg/           # 公共包
├── api/           # API 定义
└── configs/       # 配置文件
```

## 常用模式
```go
// 错误处理
if err != nil {
    return fmt.Errorf("操作失败: %w", err)
}

// 依赖注入
type Service struct {
    repo Repository
}

func NewService(repo Repository) *Service {
    return &Service{repo: repo}
}
```

## 技术栈
- Web: Gin / Echo / Fiber
- ORM: GORM / sqlx
- 配置: Viper
- 日志: Zap / Zerolog
```

#### 前端开发 Skill
`.claude/skills/frontend-dev/SKILL.md`：

```markdown
# 前端开发规范

## 触发条件
当检测到 `package.json` 且包含前端框架时加载

## Vue 3 规范
- 使用 Composition API + `<script setup>`
- Props 使用 `defineProps<T>()`
- Emits 使用 `defineEmits<T>()`
- 状态管理使用 Pinia

## React 规范
- 使用函数组件 + Hooks
- Props 使用 TypeScript interface
- 状态管理使用 Zustand / Jotai

## 通用规范
- TypeScript 严格模式
- ESLint + Prettier 格式化
- 组件使用 PascalCase
- 工具函数使用 camelCase
```

### 部署配置

将配置从仓库部署到用户目录：

```bash
#!/bin/bash
# deploy.sh

# 备份现有配置
cp ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.backup 2>/dev/null

# 部署新配置
cp .claude/CLAUDE.md ~/.claude/
cp -r .claude/rules ~/.claude/
cp -r .claude/commands ~/.claude/
cp -r .claude/skills ~/.claude/

echo "配置已部署到 ~/.claude/"
```

### settings.json 权限配置

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(pnpm *)",
      "Bash(go build *)",
      "Bash(go test *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Read(*)",
      "Write(src/**)",
      "Write(internal/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Write(.env*)",
      "Write(**/secrets/**)"
    ]
  },
  "env": {
    "NODE_ENV": "development",
    "GO_ENV": "development"
  }
}
```

## Best Practices

### 1. 分离关注点
- **CLAUDE.md**: 只放身份和偏好（简洁）
- **Rules**: 始终生效的约束规则
- **Skills**: 按需加载的技术标准
- **Commands**: 显式调用的工作流

### 2. 防御性配置
- 禁止测试篡改
- 禁止过度工程化
- 要求 Type-First 开发
- 强制修改前检查

### 3. 回复标注规则来源
配置 Claude 在回复时标注遵循的规则：
```
> 📋 本回复遵循规则：`claude-code-defensive.md` - Type-First
```

### 4. 决策优先级
```
简单 > 复杂
复用 > 新建
直接实现 > 抽象
```

### 5. 沟通规范
- 直接切入要点
- 代码优先展示
- 不确定时列出选项供选择
- 避免过度解释

## Common Issues

### 规则不生效
1. 检查文件路径是否正确
2. 确认使用 `.md` 扩展名
3. 重启 Claude Code 会话

### Skills 未触发
1. 检查触发条件是否满足
2. 确认 SKILL.md 格式正确
3. 查看是否被其他规则覆盖

### 命令不可用
1. 检查命令文件位置（`commands/` 目录）
2. 使用正确前缀：`/project:` 或 `/user:`
3. 确认参数格式：`$ARGUMENTS`

## Reference Documentation
- 配置仓库示例: https://github.com/doccker/cc-use-exp
- Claude Code 官方文档: https://docs.anthropic.com/claude-code
- CLAUDE.md 详解: https://blog.csdn.net/Dontla/article/details/150590085
- 配置指南: https://cloud.tencent.com/developer/article/2566484
