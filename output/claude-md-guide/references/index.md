# CLAUDE.md 配置指南 - 参考索引 v2.0

## 快速链接
- [配置仓库示例 (cc-use-exp)](https://github.com/doccker/cc-use-exp)
- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [CLAUDE.md 详解](https://blog.csdn.net/Dontla/article/details/150590085)

## 三层配置架构

| 类型 | 位置 | 加载方式 | 用途 |
|------|------|----------|------|
| **Rules** | `.claude/rules/` | 始终加载 | 防御性约束、编码规范 |
| **Skills** | `.claude/skills/` | 条件触发 | 技术栈开发标准 |
| **Commands** | `.claude/commands/` | 显式调用 | 工作流自动化 |

## 目录结构

### 用户级配置 (`~/.claude/`)
```
├── CLAUDE.md              # 身份/偏好
├── settings.json          # 权限设置
├── commands/              # 用户级命令
├── rules/                 # 始终加载规则
├── skills/                # 按需触发技能
├── tasks/                 # 任务配置
└── templates/             # 模板文件
```

### 项目级配置 (`project-root/`)
```
├── CLAUDE.md              # 项目记忆
├── CLAUDE.local.md        # 本地配置
└── .claude/
    ├── settings.json
    ├── commands/
    └── rules/
```

## 主题目录

### 核心配置
1. CLAUDE.md 核心模板
2. 三层配置架构设计
3. 配置层级与优先级

### 防御性编程
1. 严格禁止行为
2. 必须遵循流程
3. Type-First 原则
4. 修改前检查清单

### 自定义命令
- `code-review.md` - 代码审查
- `commit-msg.md` - Commit 生成
- `debug.md` - 调试助手
- `new-feature.md` - 新功能开发
- `project-scan.md` - 项目扫描
- `security-review.md` - 安全审查

### 技术栈 Skills
- `go-dev/` - Go 开发规范
- `java-dev/` - Java 开发规范
- `frontend-dev/` - 前端开发规范
- `python-dev/` - Python 开发规范

### 最佳实践
1. 分离关注点
2. 防御性配置
3. 决策优先级
4. 沟通规范

## 设计哲学

```
CLAUDE.md 只放身份/偏好
具体约束放 rules
技能放 skills
工作流放 commands
```

## 决策优先级

```
简单 > 复杂
复用 > 新建
直接实现 > 抽象
```
