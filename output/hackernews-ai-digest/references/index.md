# Hacker News AI 新闻摘要 - 参考索引 v2.0

## v2.0 新功能

| 功能 | 说明 | 参数 |
|------|------|------|
| 📄 完整内容 | 抓取原文网页 | `--full` |
| 🌐 中文翻译 | Claude API 翻译 | `--translate` |
| 💬 热门评论 | HN 讨论区评论 | `--max-comments N` |

## 使用模式

```bash
# 摘要模式（快速）
python scripts/fetch_ai_news.py

# 完整内容模式
python scripts/fetch_ai_news.py --full

# 完整 + 翻译（推荐）
python scripts/fetch_ai_news.py --full --translate

# 输出到文件
python scripts/fetch_ai_news.py -f -t -o ai_news.md
```

## 依赖安装

```bash
# 必需
pip install requests

# 完整内容功能
pip install beautifulsoup4

# 翻译功能
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

## API 端点

| 端点 | URL | 说明 |
|------|-----|------|
| 最新新闻 | `/v0/newstories.json` | 最近 500 条 |
| 热门新闻 | `/v0/topstories.json` | 热门 500 条 |
| 最佳新闻 | `/v0/beststories.json` | 最佳排名 |
| 新闻详情 | `/v0/item/{id}.json` | 单条新闻 |

## 输出格式

### 完整内容模式

```markdown
## 1. 标题中文翻译

**原标题**: English Title
**热度**: 🔥 256 points | 💬 128 comments
**来源**: domain.com
**HN 讨论**: https://news.ycombinator.com/item?id=xxx

### 📄 文章内容（中文翻译）
完整的文章内容翻译...

### 💬 热门评论
**1. @user**: 评论内容翻译...
```

## 翻译策略

| 类型 | 策略 |
|------|------|
| 标题 | 简洁准确，保留术语 |
| 正文 | 保持段落，流畅自然 |
| 评论 | 保留口语风格 |

## 定时任务

```bash
# 每日完整更新
0 8 * * * python fetch_ai_news.py -f -t -o daily.md

# 每小时快速更新
0 * * * * python fetch_ai_news.py -o hourly.md
```

## 参考文档

- [Hacker News API](https://github.com/HackerNews/API)
- [Anthropic API](https://docs.anthropic.com/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)
