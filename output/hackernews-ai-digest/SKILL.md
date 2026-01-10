---
name: hackernews-ai-digest
description: Fetch latest AI news from Hacker News API with full content and Chinese translation
version: 2.0.0
---

# Hacker News AI 新闻摘要 Skill v2.0

## Overview
此 Skill 使用 Hacker News 官方 API 获取最新新闻，自动筛选 AI 相关内容，**抓取完整文章内容**并提供**中文翻译**。支持获取热门评论，生成完整的中文新闻摘要。

## When to Use This Skill
Use this skill when:
- 需要获取最新的 AI/ML 技术新闻**完整内容**
- 想要阅读 Hacker News 上 AI 文章的**中文翻译**
- 需要了解 HN 社区对 AI 话题的讨论和评论
- 进行 AI 行业动态追踪和研究

## Quick Reference

### v2.0 新功能

| 功能 | 说明 |
|------|------|
| 📄 完整内容获取 | 抓取原文网页完整内容 |
| 🌐 中文翻译 | 使用 Claude API 翻译标题、正文、评论 |
| 💬 热门评论 | 获取 HN 讨论区热门评论 |
| 🔧 灵活配置 | 支持摘要/完整模式切换 |

### 使用方式

```bash
# 安装依赖
pip install requests beautifulsoup4 anthropic

# 设置 API Key（用于翻译）
export ANTHROPIC_API_KEY=sk-ant-...

# 基本使用（摘要模式）
python scripts/fetch_ai_news.py

# 完整内容模式
python scripts/fetch_ai_news.py --full

# 完整内容 + 中文翻译（推荐）
python scripts/fetch_ai_news.py --full --translate

# 指定数量和输出文件
python scripts/fetch_ai_news.py --full --translate --count 15 --output ai_news.md

# 使用最新新闻源
python scripts/fetch_ai_news.py --full --translate --source new
```

### 命令行参数

| 参数 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--count` | `-c` | 获取新闻数量 | 10 |
| `--source` | `-s` | 新闻源 (new/top/best) | top |
| `--output` | `-o` | 输出文件路径 | 终端 |
| `--full` | `-f` | 获取完整内容 | 否 |
| `--translate` | `-t` | 中文翻译 | 否 |
| `--max-scan` | - | 最大扫描数量 | 200 |
| `--max-comments` | - | 每条新闻最大评论数 | 5 |

### 输出格式对比

#### 摘要模式（默认）

```markdown
## 1. 展示：AI 代码审查工具

**原标题**: Show HN: AI-powered code review tool
**热度**: 🔥 256 points | 💬 128 comments
**来源**: github.com
**HN 讨论**: https://news.ycombinator.com/item?id=12345678
```

#### 完整内容 + 翻译模式（--full --translate）

```markdown
## 1. 展示：AI 驱动的代码审查工具

**原标题**: Show HN: AI-powered code review tool
**热度**: 🔥 256 points | 💬 128 comments
**来源**: github.com
**HN 讨论**: https://news.ycombinator.com/item?id=12345678

### 📄 文章内容（中文翻译）

我们很高兴地宣布推出一款全新的 AI 驱动代码审查工具。
这个工具使用 LLM 技术来分析你的代码，识别潜在问题，
并提供改进建议。

主要功能：
- 自动检测代码异味和反模式
- 安全漏洞扫描
- 性能优化建议
- 与 GitHub PR 工作流集成

我们使用了 Claude API 作为核心引擎，它能够理解代码
上下文并提供有意义的反馈...

### 💬 热门评论

**1. @developer123**:
> 我已经在我的团队中使用了两周，效果非常好。它发现了
> 几个我们人工审查漏掉的安全问题。唯一的缺点是对于
> 大型 PR 有时会超时。

**2. @airesearcher**:
> 有趣的是你们选择了 Claude 而不是 GPT-4。能分享一下
> 选择的原因吗？在我的测试中，Claude 在代码理解方面
> 确实表现更好。
```

## 完整代码示例

### 获取完整内容并翻译

```python
from fetch_ai_news import HackerNewsAI

# 创建抓取器
hn = HackerNewsAI()

# 获取 AI 新闻（完整模式）
stories = hn.get_ai_news(
    count=10,
    source='top',
    full_content=True,    # 获取完整文章
    translate=True,       # 中文翻译
    max_comments=5        # 每条新闻 5 条评论
)

# 生成 Markdown
markdown = hn.generate_markdown(
    stories,
    full_content=True,
    translate=True
)

# 保存文件
with open('ai_news_full.md', 'w', encoding='utf-8') as f:
    f.write(markdown)
```

### 仅翻译标题

```python
hn = HackerNewsAI()

stories = hn.get_ai_news(count=20, source='top')

for story in stories:
    title = story.get('title', '')
    title_zh = hn.translate_text(title, 'title')
    print(f"原文: {title}")
    print(f"翻译: {title_zh}")
    print()
```

### 自定义翻译 Prompt

```python
def custom_translate(self, text: str) -> str:
    """自定义翻译方法"""
    prompt = f"""请将以下技术文章翻译成中文：

要求：
1. 保留所有技术术语原文（如 API、LLM、GPU 等）
2. 使用专业的技术写作风格
3. 保持原文的逻辑结构
4. 翻译要准确流畅

原文：
{text}
"""
    message = self.translator.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=8192,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text
```

## 依赖说明

### 必需依赖

```bash
pip install requests
```

### 可选依赖

```bash
# 获取完整文章内容（--full）
pip install beautifulsoup4

# 中文翻译（--translate）
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

### 功能可用性

| 功能 | 必需依赖 | 可选依赖 |
|------|----------|----------|
| 基本摘要 | requests | - |
| 完整内容 | requests | beautifulsoup4 |
| 中文翻译 | requests | anthropic + API Key |
| 完整+翻译 | requests | beautifulsoup4 + anthropic |

## 翻译策略

### Claude API 翻译（推荐）

当设置了 `ANTHROPIC_API_KEY` 时使用：

- **标题翻译**: 简洁准确，保留技术术语
- **正文翻译**: 保持段落结构，流畅自然
- **评论翻译**: 保留口语化风格

### 规则翻译（回退）

无 API Key 时使用基于规则的翻译：

```python
translations = {
    'Show HN:': '展示：',
    'Ask HN:': '提问：',
    'artificial intelligence': '人工智能',
    'machine learning': '机器学习',
    'large language model': '大语言模型',
    ...
}
```

## 定时任务配置

### 每日更新完整新闻

```bash
# crontab -e
# 每天早上 8 点获取完整 AI 新闻并翻译
0 8 * * * cd /path/to/skill && \
  python scripts/fetch_ai_news.py \
    --full --translate \
    --count 15 \
    --output /path/to/daily_ai_news.md
```

### 每小时快速更新

```bash
# 每小时获取摘要（不翻译，速度快）
0 * * * * cd /path/to/skill && \
  python scripts/fetch_ai_news.py \
    --count 10 \
    --output /path/to/hourly_ai_news.md
```

## Best Practices

### 1. 翻译质量优化

- 设置 `ANTHROPIC_API_KEY` 使用 Claude 翻译
- 对于长文章，翻译前会自动截断到 5000 字符
- 技术术语保持原文

### 2. 性能优化

- 摘要模式比完整模式快 5-10 倍
- 使用 `--max-scan 100` 减少扫描量
- 使用 `--max-comments 3` 减少评论获取

### 3. API 成本控制

- 仅对重要新闻使用翻译
- 使用 `claude-sonnet-4-20250514` 平衡质量和成本
- 批量处理时设置合理间隔

## Common Issues

### 无法获取文章内容

1. 检查是否安装 beautifulsoup4
2. 某些网站有反爬虫保护
3. 付费内容无法获取

### 翻译功能不工作

1. 检查 `ANTHROPIC_API_KEY` 是否设置
2. 检查 API Key 是否有效
3. 检查网络连接

### API 请求失败

1. 增加请求间隔 `rate_limit`
2. 检查网络代理设置
3. HN API 无速率限制，但建议控制请求频率

## Reference Documentation
- Hacker News API: https://github.com/HackerNews/API
- Anthropic API: https://docs.anthropic.com/
- BeautifulSoup: https://www.crummy.com/software/BeautifulSoup/
