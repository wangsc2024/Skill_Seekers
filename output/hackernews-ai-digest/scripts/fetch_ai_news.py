#!/usr/bin/env python3
"""
Hacker News AI 新闻抓取工具

使用 Hacker News API 获取最新的 AI 相关新闻，并生成中文摘要。

用法:
    python fetch_ai_news.py                    # 获取 10 条 AI 新闻
    python fetch_ai_news.py --count 20         # 获取 20 条
    python fetch_ai_news.py --source top       # 使用热门新闻源
    python fetch_ai_news.py --output news.md   # 输出到文件
"""

import argparse
import json
import requests
import time
from datetime import datetime
from typing import List, Dict, Optional


class HackerNewsAI:
    """Hacker News AI 新闻抓取器"""

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

    # 排除关键词（避免误匹配）
    EXCLUDE_KEYWORDS = [
        'air', 'aide', 'aim', 'aid',
    ]

    def __init__(self, rate_limit: float = 0.1):
        """
        初始化抓取器

        Args:
            rate_limit: 请求间隔（秒）
        """
        self.rate_limit = rate_limit
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'HackerNewsAI/1.0'
        })

    def fetch_story_ids(self, source: str = 'new') -> List[int]:
        """
        获取新闻 ID 列表

        Args:
            source: 新闻源 ('new', 'top', 'best')

        Returns:
            新闻 ID 列表
        """
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
        """
        获取单条新闻详情

        Args:
            story_id: 新闻 ID

        Returns:
            新闻详情字典
        """
        url = f"{self.BASE_URL}/item/{story_id}.json"

        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"获取新闻 {story_id} 失败: {e}")
            return None

    def is_ai_related(self, story: Dict) -> bool:
        """
        检查是否为 AI 相关新闻

        Args:
            story: 新闻字典

        Returns:
            是否为 AI 相关
        """
        if not story or story.get('type') != 'story':
            return False

        title = story.get('title', '').lower()
        url = story.get('url', '').lower()
        text = (story.get('text', '') or '').lower()

        content = f" {title} {url} {text} "

        # 检查是否包含 AI 关键词
        for keyword in self.AI_KEYWORDS:
            # 使用空格边界检查，避免部分匹配
            if f" {keyword} " in content or f" {keyword}." in content or \
               f" {keyword}," in content or f" {keyword}:" in content or \
               content.startswith(f"{keyword} ") or content.endswith(f" {keyword}"):
                return True

            # 对于多词关键词，直接检查
            if ' ' in keyword and keyword in content:
                return True

        return False

    def get_ai_news(self, count: int = 10, source: str = 'new',
                    max_scan: int = 200) -> List[Dict]:
        """
        获取 AI 相关新闻

        Args:
            count: 需要获取的数量
            source: 新闻源
            max_scan: 最大扫描数量

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
                ai_stories.append(story)
                print(f"  [{len(ai_stories)}/{count}] {story.get('title', '')[:50]}...")

            time.sleep(self.rate_limit)

        print(f"扫描 {scanned} 条新闻，找到 {len(ai_stories)} 条 AI 相关")
        return ai_stories

    def translate_title(self, title: str) -> str:
        """
        翻译标题（简单的规则翻译）

        Args:
            title: 英文标题

        Returns:
            中文翻译（或原文）
        """
        # 常见术语映射
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

        return result

    def generate_markdown(self, stories: List[Dict],
                          translate: bool = True) -> str:
        """
        生成 Markdown 格式输出

        Args:
            stories: 新闻列表
            translate: 是否翻译

        Returns:
            Markdown 字符串
        """
        now = datetime.now().strftime("%Y-%m-%d %H:%M")

        md = f"""# Hacker News AI 新闻精选

> 更新时间：{now}
> 来源：[Hacker News](https://news.ycombinator.com/)
> 筛选条件：AI / ML / LLM 相关

---

"""
        for i, story in enumerate(stories, 1):
            title = story.get('title', 'No Title')
            translated = self.translate_title(title) if translate else title
            score = story.get('score', 0)
            comments = story.get('descendants', 0) or 0
            story_id = story.get('id')
            url = story.get('url', '')
            author = story.get('by', 'unknown')
            timestamp = story.get('time', 0)
            date_str = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M") if timestamp else 'N/A'

            md += f"""## {i}. {translated}

**原标题**: {title}

**热度**: 🔥 {score} points | 💬 {comments} comments | 👤 {author}

**时间**: {date_str}

"""
            if url:
                md += f"""**原文链接**: [{url[:60]}{'...' if len(url) > 60 else ''}]({url})

"""

            md += f"""**HN 讨论**: [Hacker News #{story_id}](https://news.ycombinator.com/item?id={story_id})

---

"""

        # 添加统计信息
        total_score = sum(s.get('score', 0) for s in stories)
        total_comments = sum(s.get('descendants', 0) or 0 for s in stories)

        md += f"""
## 统计

| 指标 | 数值 |
|------|------|
| 新闻数量 | {len(stories)} |
| 总热度 | {total_score} points |
| 总评论 | {total_comments} comments |
| 平均热度 | {total_score // len(stories) if stories else 0} points |
"""

        return md


def main():
    parser = argparse.ArgumentParser(
        description='获取 Hacker News AI 相关新闻'
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
        '--no-translate', action='store_true',
        help='不翻译标题'
    )
    parser.add_argument(
        '--max-scan', type=int, default=200,
        help='最大扫描数量 (默认: 200)'
    )

    args = parser.parse_args()

    # 创建抓取器
    hn = HackerNewsAI(rate_limit=0.1)

    # 获取 AI 新闻
    stories = hn.get_ai_news(
        count=args.count,
        source=args.source,
        max_scan=args.max_scan
    )

    if not stories:
        print("未找到 AI 相关新闻")
        return

    # 生成 Markdown
    markdown = hn.generate_markdown(
        stories,
        translate=not args.no_translate
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
