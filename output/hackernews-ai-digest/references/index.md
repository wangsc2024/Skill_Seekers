# Hacker News AI 新闻摘要 - 参考索引

## API 文档
- [Hacker News API](https://github.com/HackerNews/API) - 官方 API 文档
- [Firebase REST API](https://firebase.google.com/docs/reference/rest/database)

## API 端点

| 端点 | URL | 说明 |
|------|-----|------|
| 最新新闻 | `/v0/newstories.json` | 最近 500 条 |
| 热门新闻 | `/v0/topstories.json` | 热门 500 条 |
| 最佳新闻 | `/v0/beststories.json` | 最佳排名 |
| 新闻详情 | `/v0/item/{id}.json` | 单条新闻 |
| 用户信息 | `/v0/user/{id}.json` | 用户资料 |

## 脚本使用

```bash
# 基本使用
python scripts/fetch_ai_news.py

# 获取 20 条热门 AI 新闻
python scripts/fetch_ai_news.py --count 20 --source top

# 输出到文件
python scripts/fetch_ai_news.py --output ai_news.md

# 查看帮助
python scripts/fetch_ai_news.py --help
```

## AI 关键词列表

### LLM 模型
- GPT, ChatGPT, GPT-4, GPT-5
- Claude, Anthropic
- Gemini, Bard
- LLaMA, Meta AI
- DeepSeek, Mistral, Mixtral

### 技术术语
- Transformer, Attention
- Diffusion, Stable Diffusion
- Embedding, Vector Database, RAG
- Fine-tuning, LoRA, QLoRA
- Prompt Engineering

### 应用领域
- AI Agent, Agentic
- Copilot, Coding Assistant
- NLP, Computer Vision
- Reinforcement Learning

## 输出格式

生成的 Markdown 包含：
- 新闻标题（中英文）
- 热度统计（points, comments）
- 原文链接
- HN 讨论链接
- 汇总统计

## 依赖

```
requests>=2.28.0
```

## 定时任务

```bash
# crontab 配置示例
# 每天早上 8 点更新
0 8 * * * python /path/to/fetch_ai_news.py -o /path/to/daily.md
```
