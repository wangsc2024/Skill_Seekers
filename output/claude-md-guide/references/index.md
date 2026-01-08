# CLAUDE.md 配置指南 - 参考索引

## 快速链接
- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [CLAUDE.md 详解](https://blog.csdn.net/Dontla/article/details/150590085)
- [配置最佳实践](https://cloud.tencent.com/developer/article/2566484)

## 主题目录

### 基础配置
1. 文件位置与层级
2. 基本结构模板
3. 配置优先级

### 技术栈示例
- React/Next.js 项目配置
- Python/FastAPI 项目配置
- Vue.js 项目配置
- Node.js 项目配置

### 自定义命令
- 项目级命令 (`/project:`)
- 用户级命令 (`/user:`)
- 带参数的命令

### 高级配置
- Monorepo 配置
- 团队协作配置
- 权限管理 (settings.json)

### 最佳实践
- 配置内容建议
- 团队共享策略
- 常见问题解决

## 配置文件清单

| 文件 | 位置 | 用途 |
|------|------|------|
| CLAUDE.md | 项目根目录 | 项目记忆（团队共享） |
| CLAUDE.local.md | 项目根目录 | 本地配置（不提交） |
| settings.json | .claude/ | 项目共享设置 |
| settings.local.json | .claude/ | 个人本地设置 |
| commands/*.md | .claude/commands/ | 自定义命令 |
