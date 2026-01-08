---
name: hackernews-ai-digest
description: Fetch latest AI news from Hacker News API and translate to Chinese
version: 1.0.0
---

# Hacker News AI 新闻摘要 Skill

## Overview
此 Skill 使用 Hacker News 官方 API 获取最新新闻，自动筛选 AI 相关内容（包含 AI、LLM、GPT、Claude、机器学习等关键词），翻译成中文后以 Markdown 格式输出。

## When to Use This Skill
Use this skill when:
- 需要获取最新的 AI/ML 技术新闻
- 想要了解 Hacker News 上的 AI 热门讨论
- 需要中文版的科技新闻摘要
- 进行 AI 行业动态追踪

## Quick Reference

### Hacker News API 端点

| 端点 | 说明 | URL |
|------|------|-----|
| 最新新闻 | 最近 500 条新闻 ID | `https://hacker-news.firebaseio.com/v0/newstories.json` |
| 热门新闻 | 前 500 条热门新闻 | `https://hacker-news.firebaseio.com/v0/topstories.json` |
| 最佳新闻 | 最佳新闻排名 | `https://hacker-news.firebaseio.com/v0/beststories.json` |
| 新闻详情 | 单条新闻内容 | `https://hacker-news.firebaseio.com/v0/item/{id}.json` |

### AI 关键词过滤

```python
AI_KEYWORDS = [
    'ai', 'artificial intelligence', 'machine learning', 'ml',
    'deep learning', 'neural network', 'llm', 'large language model',
    'gpt', 'chatgpt', 'openai', 'claude', 'anthropic', 'gemini',
    'deepseek', 'mistral', 'llama', 'transformer', 'diffusion',
    'stable diffusion', 'midjourney', 'dall-e', 'sora',
    'agi', 'artificial general intelligence',
    'nlp', 'natural language processing',
    'computer vision', 'reinforcement learning',
    'ai agent', 'copilot', 'coding assistant'
]
```

### Python 脚本使用

```bash
# 安装依赖
pip install requests

# 运行脚本获取 AI 新闻
python scripts/fetch_ai_news.py

# 指定获取数量
python scripts/fetch_ai_news.py --count 20

# 输出到文件
python scripts/fetch_ai_news.py --output ai_news.md

# 使用热门新闻源
python scripts/fetch_ai_news.py --source top
```

### 输出格式

生成的 Markdown 文件格式：

```markdown
# Hacker News AI 新闻精选

> 更新时间：2026-01-08
> 来源：Hacker News

---

## 1. 新闻标题（中文翻译）

**原标题**: Original English Title

**摘要**: 新闻内容摘要...

**热度**: 🔥 256 points | 💬 128 comments

**来源**: [Hacker News #12345678](https://news.ycombinator.com/item?id=12345678)

---
```

### API 响应结构

单条新闻的 JSON 结构：

```json
{
  "id": 12345678,
  "type": "story",
  "by": "username",
  "time": 1704672000,
  "title": "Show HN: AI-powered code review tool",
  "url": "https://example.com/article",
  "score": 256,
  "descendants": 128,
  "kids": [12345679, 12345680]
}
```

### 完整代码示例

```python
import requests
import json
from datetime import datetime

class HackerNewsAI:
    BASE_URL = "https://hacker-news.firebaseio.com/v0"

    AI_KEYWORDS = [
        'ai', 'artificial intelligence', 'machine learning',
        'llm', 'gpt', 'chatgpt', 'openai', 'claude', 'anthropic',
        'gemini', 'deepseek', 'neural', 'transformer'
    ]

    def fetch_story_ids(self, source='new'):
        """获取新闻 ID 列表"""
        endpoints = {
            'new': f"{self.BASE_URL}/newstories.json",
            'top': f"{self.BASE_URL}/topstories.json",
            'best': f"{self.BASE_URL}/beststories.json"
        }
        response = requests.get(endpoints.get(source, endpoints['new']))
        return response.json()

    def fetch_story(self, story_id):
        """获取单条新闻详情"""
        url = f"{self.BASE_URL}/item/{story_id}.json"
        response = requests.get(url)
        return response.json()

    def is_ai_related(self, story):
        """检查是否为 AI 相关新闻"""
        if not story or 'title' not in story:
            return False
        title = story.get('title', '').lower()
        url = story.get('url', '').lower()
        text = story.get('text', '').lower() if story.get('text') else ''

        content = f"{title} {url} {text}"
        return any(keyword in content for keyword in self.AI_KEYWORDS)

    def get_ai_news(self, count=10, source='new'):
        """获取 AI 相关新闻"""
        story_ids = self.fetch_story_ids(source)
        ai_stories = []

        for story_id in story_ids:
            if len(ai_stories) >= count:
                break
            story = self.fetch_story(story_id)
            if self.is_ai_related(story):
                ai_stories.append(story)

        return ai_stories

    def generate_markdown(self, stories):
        """生成 Markdown 格式输出"""
        now = datetime.now().strftime("%Y-%m-%d %H:%M")

        md = f"""# Hacker News AI 新闻精选

> 更新时间：{now}
> 来源：[Hacker News](https://news.ycombinator.com/)

---

"""
        for i, story in enumerate(stories, 1):
            title = story.get('title', 'No Title')
            score = story.get('score', 0)
            comments = story.get('descendants', 0)
            story_id = story.get('id')
            url = story.get('url', '')

            md += f"""## {i}. {title}

**热度**: 🔥 {score} points | 💬 {comments} comments

**链接**: {url if url else 'N/A'}

**来源**: [Hacker News #{story_id}](https://news.ycombinator.com/item?id={story_id})

---

"""
        return md

# 使用示例
if __name__ == "__main__":
    hn = HackerNewsAI()
    stories = hn.get_ai_news(count=10, source='top')
    markdown = hn.generate_markdown(stories)
    print(markdown)
```

### 中文翻译整合

使用 Claude API 进行标题翻译：

```python
import anthropic

def translate_title(title: str) -> str:
    """使用 Claude API 翻译标题"""
    client = anthropic.Anthropic()

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=100,
        messages=[{
            "role": "user",
            "content": f"将以下英文标题翻译成简洁的中文，只返回翻译结果：\n{title}"
        }]
    )

    return message.content[0].text
```

### 定时任务配置

使用 cron 每日自动更新：

```bash
# 每天早上 8 点更新 AI 新闻
0 8 * * * cd /path/to/skill && python scripts/fetch_ai_news.py --output daily_ai_news.md
```

## Best Practices

### 1. 请求限制
- Hacker News API 无速率限制，但建议间隔 0.5 秒
- 批量请求时使用异步提高效率

### 2. 关键词优化
- 定期更新 AI 关键词列表
- 根据热度调整权重
- 排除误匹配（如 "AI" 作为人名缩写）

### 3. 缓存策略
- 缓存已获取的新闻内容
- 使用 story ID 作为缓存键
- 设置合理的过期时间

### 4. 错误处理
```python
def fetch_with_retry(url, retries=3):
    for i in range(retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            if i == retries - 1:
                raise
            time.sleep(1)
```

## Common Issues

### API 请求失败
1. 检查网络连接
2. 验证 API 端点是否正确
3. 添加重试机制

### 关键词匹配不准确
1. 使用小写比较
2. 添加词边界检查
3. 结合上下文判断

### 翻译质量问题
1. 保留技术术语原文
2. 使用专业翻译 prompt
3. 人工审核重要内容

## Reference Documentation
- Hacker News API: https://github.com/HackerNews/API
- Firebase REST API: https://firebase.google.com/docs/reference/rest/database
- Anthropic API: https://docs.anthropic.com/
