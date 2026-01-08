#!/usr/bin/env python3
"""
Hacker News AI 新闻抓取工具 v2.0

使用 Hacker News API 获取最新的 AI 相关新闻，
抓取完整文章内容并提供中文翻译。

用法:
    python fetch_ai_news.py                       # 获取 10 条 AI 新闻（摘要）
    python fetch_ai_news.py --full                # 获取完整内容
    python fetch_ai_news.py --full --translate    # 完整内容 + 中文翻译
    python fetch_ai_news.py --count 20            # 获取 20 条
    python fetch_ai_news.py --source top          # 使用热门新闻源
    python fetch_ai_news.py --output news.md      # 输出到文件
"""

import argparse
import json
import os
import re
import requests
import time
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from html import unescape
from urllib.parse import urlparse

# 可选依赖
try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False


class HackerNewsAI:
    """Hacker News AI 新闻抓取器 v2.0"""

    BASE_URL = "https://hacker-news.firebaseio.com/v0"

    # AI 相关关键词
    AI_KEYWORDS = [
        # 通用 AI 术语
        'ai', 'artificial intelligence', 'machine learning', 'ml',
        'deep learning', 'neural network', 'neural net',
        # LLM 相关
        'llm', 'large language model', 'language model',
        'gpt', 'gpt-4', 'gpt-5', 'chatgpt',
        'claude', 'anthropic',
        'gemini', 'bard',
        'llama', 'meta ai',
        'deepseek', 'mistral', 'mixtral',
        'openai', 'open ai',
        # 技术术语
        'transformer', 'attention mechanism',
        'diffusion', 'stable diffusion', 'midjourney', 'dall-e', 'sora',
        'embedding', 'vector database', 'rag',
        'fine-tuning', 'fine tuning', 'lora', 'qlora',
        'prompt engineering', 'prompt',
        # 应用领域
        'ai agent', 'ai agents', 'agentic',
        'copilot', 'coding assistant', 'code generation',
        'text-to-image', 'text-to-video', 'text-to-speech',
        'nlp', 'natural language processing',
        'computer vision', 'cv',
        'reinforcement learning', 'rl',
        # AGI 相关
        'agi', 'artificial general intelligence',
        'superintelligence', 'alignment',
        # 公司/产品
        'hugging face', 'huggingface',
        'replicate', 'together ai',
        'perplexity', 'cursor', 'windsurf',
    ]

    def __init__(self, rate_limit: float = 0.1):
        """初始化抓取器"""
        self.rate_limit = rate_limit
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; HackerNewsAI/2.0)'
        })
        self.translator = None
        if HAS_ANTHROPIC and os.environ.get('ANTHROPIC_API_KEY'):
            self.translator = anthropic.Anthropic()

    def fetch_story_ids(self, source: str = 'new') -> List[int]:
        """获取新闻 ID 列表"""
        endpoints = {
            'new': f"{self.BASE_URL}/newstories.json",
            'top': f"{self.BASE_URL}/topstories.json",
            'best': f"{self.BASE_URL}/beststories.json",
        }
        url = endpoints.get(source, endpoints['new'])
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"获取新闻列表失败: {e}")
            return []

    def fetch_story(self, story_id: int) -> Optional[Dict]:
        """获取单条新闻详情"""
        url = f"{self.BASE_URL}/item/{story_id}.json"
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"获取新闻 {story_id} 失败: {e}")
            return None

    def fetch_comments(self, story: Dict, max_comments: int = 10) -> List[Dict]:
        """
        获取新闻评论

        Args:
            story: 新闻字典
            max_comments: 最大评论数

        Returns:
            评论列表
        """
        comments = []
        kids = story.get('kids', [])[:max_comments]

        for kid_id in kids:
            comment = self.fetch_story(kid_id)
            if comment and comment.get('text'):
                comments.append({
                    'by': comment.get('by', 'anonymous'),
                    'text': self._clean_html(comment.get('text', '')),
                    'time': comment.get('time', 0),
                })
            time.sleep(self.rate_limit)

        return comments

    def fetch_article_content(self, url: str) -> Optional[str]:
        """
        获取文章完整内容

        Args:
            url: 文章 URL

        Returns:
            文章正文内容
        """
        if not url or not HAS_BS4:
            return None

        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # 移除脚本和样式
            for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                tag.decompose()

            # 尝试多种内容选择器
            content = None
            selectors = [
                'article',
                'main',
                '[role="main"]',
                '.post-content',
                '.article-content',
                '.entry-content',
                '.content',
                '#content',
            ]

            for selector in selectors:
                element = soup.select_one(selector)
                if element:
                    content = element.get_text(separator='\n', strip=True)
                    break

            if not content:
                # 回退到 body
                body = soup.find('body')
                if body:
                    content = body.get_text(separator='\n', strip=True)

            if content:
                # 清理内容
                lines = [line.strip() for line in content.split('\n') if line.strip()]
                content = '\n'.join(lines)
                # 限制长度
                if len(content) > 10000:
                    content = content[:10000] + '\n\n[... 内容已截断 ...]'
                return content

        except Exception as e:
            print(f"  获取文章内容失败: {e}")

        return None

    def _clean_html(self, html: str) -> str:
        """清理 HTML 标签"""
        if not html:
            return ''
        # 简单的 HTML 清理
        text = re.sub(r'<[^>]+>', ' ', html)
        text = unescape(text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def translate_text(self, text: str, text_type: str = 'content') -> str:
        """
        使用 Claude API 翻译文本

        Args:
            text: 要翻译的文本
            text_type: 文本类型 ('title', 'content', 'comment')

        Returns:
            翻译后的中文文本
        """
        if not self.translator or not text:
            return self._simple_translate(text) if text_type == 'title' else text

        prompts = {
            'title': f"将以下英文标题翻译成简洁的中文，保留技术术语原文（如 LLM、GPT、Claude 等），只返回翻译结果：\n\n{text}",
            'content': f"""将以下英文文章翻译成流畅的中文。要求：
1. 保留技术术语原文（如 LLM、GPT、Claude、API 等）
2. 保持段落结构
3. 翻译要通顺自然
4. 只返回翻译结果，不要添加额外说明

原文：
{text}""",
            'comment': f"将以下 Hacker News 评论翻译成中文，保留技术术语原文，只返回翻译结果：\n\n{text}"
        }

        try:
            message = self.translator.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                messages=[{
                    "role": "user",
                    "content": prompts.get(text_type, prompts['content'])
                }]
            )
            return message.content[0].text
        except Exception as e:
            print(f"  翻译失败: {e}")
            return text

    def _simple_translate(self, title: str) -> str:
        """简单的规则翻译"""
        translations = {
            'Show HN:': '展示：',
            'Ask HN:': '提问：',
            'Tell HN:': '分享：',
            'Launch HN:': '发布：',
            'artificial intelligence': '人工智能',
            'machine learning': '机器学习',
            'deep learning': '深度学习',
            'neural network': '神经网络',
            'large language model': '大语言模型',
            'open source': '开源',
            'self-hosted': '自托管',
            'real-time': '实时',
        }
        result = title
        for en, zh in translations.items():
            result = result.replace(en, zh)
            result = result.replace(en.title(), zh)
        return result

    def is_ai_related(self, story: Dict) -> bool:
        """检查是否为 AI 相关新闻"""
        if not story or story.get('type') != 'story':
            return False

        title = story.get('title', '').lower()
        url = story.get('url', '').lower()
        text = (story.get('text', '') or '').lower()
        content = f" {title} {url} {text} "

        for keyword in self.AI_KEYWORDS:
            if f" {keyword} " in content or f" {keyword}." in content or \
               f" {keyword}," in content or f" {keyword}:" in content or \
               content.startswith(f"{keyword} ") or content.endswith(f" {keyword}"):
                return True
            if ' ' in keyword and keyword in content:
                return True
        return False

    def get_ai_news(self, count: int = 10, source: str = 'new',
                    max_scan: int = 200, full_content: bool = False,
                    translate: bool = False, max_comments: int = 5) -> List[Dict]:
        """
        获取 AI 相关新闻

        Args:
            count: 需要获取的数量
            source: 新闻源
            max_scan: 最大扫描数量
            full_content: 是否获取完整内容
            translate: 是否翻译
            max_comments: 最大评论数

        Returns:
            AI 相关新闻列表
        """
        print(f"正在从 {source} 获取新闻列表...")
        story_ids = self.fetch_story_ids(source)

        if not story_ids:
            print("无法获取新闻列表")
            return []

        print(f"共 {len(story_ids)} 条新闻，开始筛选 AI 相关内容...")

        ai_stories = []
        scanned = 0

        for story_id in story_ids[:max_scan]:
            if len(ai_stories) >= count:
                break

            story = self.fetch_story(story_id)
            scanned += 1

            if story and self.is_ai_related(story):
                print(f"  [{len(ai_stories)+1}/{count}] {story.get('title', '')[:50]}...")

                # 获取完整内容
                if full_content:
                    url = story.get('url', '')
                    if url:
                        print(f"    获取文章内容...")
                        article_content = self.fetch_article_content(url)
                        story['article_content'] = article_content

                        if translate and article_content:
                            print(f"    翻译文章内容...")
                            story['article_content_zh'] = self.translate_text(
                                article_content[:5000], 'content'
                            )

                    # 获取评论
                    print(f"    获取热门评论...")
                    comments = self.fetch_comments(story, max_comments)
                    story['top_comments'] = comments

                    if translate and comments:
                        print(f"    翻译评论...")
                        for comment in comments:
                            comment['text_zh'] = self.translate_text(
                                comment['text'][:1000], 'comment'
                            )

                # 翻译标题
                if translate:
                    story['title_zh'] = self.translate_text(story.get('title', ''), 'title')

                ai_stories.append(story)

            time.sleep(self.rate_limit)

        print(f"扫描 {scanned} 条新闻，找到 {len(ai_stories)} 条 AI 相关")
        return ai_stories

    def generate_markdown(self, stories: List[Dict], full_content: bool = False,
                          translate: bool = False) -> str:
        """生成 Markdown 格式输出"""
        now = datetime.now().strftime("%Y-%m-%d %H:%M")

        md = f"""# Hacker News AI 新闻精选

> 更新时间：{now}
> 来源：[Hacker News](https://news.ycombinator.com/)
> 筛选条件：AI / ML / LLM 相关
> 模式：{'完整内容' if full_content else '摘要'} | {'中文翻译' if translate else '原文'}

---

"""
        for i, story in enumerate(stories, 1):
            title = story.get('title', 'No Title')
            title_zh = story.get('title_zh', self._simple_translate(title))
            score = story.get('score', 0)
            comments = story.get('descendants', 0) or 0
            story_id = story.get('id')
            url = story.get('url', '')
            author = story.get('by', 'unknown')
            timestamp = story.get('time', 0)
            date_str = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M") if timestamp else 'N/A'

            md += f"""## {i}. {title_zh}

**原标题**: {title}

**热度**: 🔥 {score} points | 💬 {comments} comments | 👤 {author}

**时间**: {date_str}

"""
            if url:
                domain = urlparse(url).netloc
                md += f"""**来源**: [{domain}]({url})

"""

            md += f"""**HN 讨论**: [Hacker News #{story_id}](https://news.ycombinator.com/item?id={story_id})

"""

            # 完整内容
            if full_content:
                article_zh = story.get('article_content_zh')
                article_en = story.get('article_content')

                if article_zh:
                    md += f"""### 📄 文章内容（中文翻译）

{article_zh}

"""
                elif article_en:
                    md += f"""### 📄 文章内容（原文）

{article_en[:3000]}{'...' if len(article_en) > 3000 else ''}

"""

                # 热门评论
                top_comments = story.get('top_comments', [])
                if top_comments:
                    md += f"""### 💬 热门评论

"""
                    for j, comment in enumerate(top_comments, 1):
                        text = comment.get('text_zh') if translate else comment.get('text')
                        if text:
                            text_preview = text[:500] + '...' if len(text) > 500 else text
                            md += f"""**{j}. @{comment.get('by', 'anonymous')}**:

> {text_preview}

"""

            md += """---

"""

        # 统计信息
        total_score = sum(s.get('score', 0) for s in stories)
        total_comments = sum(s.get('descendants', 0) or 0 for s in stories)

        md += f"""
## 📊 统计

| 指标 | 数值 |
|------|------|
| 新闻数量 | {len(stories)} |
| 总热度 | {total_score} points |
| 总评论 | {total_comments} comments |
| 平均热度 | {total_score // len(stories) if stories else 0} points |

---

> 由 hackernews-ai-digest skill 生成
> {'使用 Claude API 进行翻译' if translate and self.translator else '使用规则翻译'}
"""

        return md


def main():
    parser = argparse.ArgumentParser(
        description='获取 Hacker News AI 相关新闻（支持完整内容和中文翻译）'
    )
    parser.add_argument(
        '--count', '-c', type=int, default=10,
        help='获取新闻数量 (默认: 10)'
    )
    parser.add_argument(
        '--source', '-s', choices=['new', 'top', 'best'], default='top',
        help='新闻源 (默认: top)'
    )
    parser.add_argument(
        '--output', '-o', type=str, default=None,
        help='输出文件路径 (默认: 打印到终端)'
    )
    parser.add_argument(
        '--full', '-f', action='store_true',
        help='获取完整文章内容和评论'
    )
    parser.add_argument(
        '--translate', '-t', action='store_true',
        help='翻译成中文 (需要 ANTHROPIC_API_KEY)'
    )
    parser.add_argument(
        '--max-scan', type=int, default=200,
        help='最大扫描数量 (默认: 200)'
    )
    parser.add_argument(
        '--max-comments', type=int, default=5,
        help='每条新闻最大评论数 (默认: 5)'
    )

    args = parser.parse_args()

    # 检查依赖
    if args.full and not HAS_BS4:
        print("警告: 未安装 beautifulsoup4，无法获取完整内容")
        print("  安装: pip install beautifulsoup4")

    if args.translate and not HAS_ANTHROPIC:
        print("警告: 未安装 anthropic，无法使用 Claude API 翻译")
        print("  安装: pip install anthropic")
        print("  设置: export ANTHROPIC_API_KEY=sk-ant-...")
    elif args.translate and not os.environ.get('ANTHROPIC_API_KEY'):
        print("警告: 未设置 ANTHROPIC_API_KEY，将使用规则翻译")

    # 创建抓取器
    hn = HackerNewsAI(rate_limit=0.2 if args.full else 0.1)

    # 获取 AI 新闻
    stories = hn.get_ai_news(
        count=args.count,
        source=args.source,
        max_scan=args.max_scan,
        full_content=args.full,
        translate=args.translate,
        max_comments=args.max_comments
    )

    if not stories:
        print("未找到 AI 相关新闻")
        return

    # 生成 Markdown
    markdown = hn.generate_markdown(
        stories,
        full_content=args.full,
        translate=args.translate
    )

    # 输出
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(markdown)
        print(f"\n已保存到: {args.output}")
    else:
        print("\n" + "=" * 60)
        print(markdown)


if __name__ == "__main__":
    main()
