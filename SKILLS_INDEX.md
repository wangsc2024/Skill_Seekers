# Skills Index

A comprehensive index of all available skills and configurations for Skill Seekers.

> **Quick Start:** `skill-seekers scrape --config configs/<name>.json --enhance-local`

---

## Available Skills (Ready to Use)

These skills are pre-built and ready for immediate use. They can be installed to Claude AI, Gemini, OpenAI, or exported as Markdown.

### AI/ML Frameworks

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[LangChain](output/langchain/)** | Build AI agents with LCEL pipelines, RAG, LangGraph workflows, MCP integration, and LangSmith observability | `langchain`, `LCEL`, `LangGraph`, `RAG pipeline` |
| **[DSPy](output/dspy/)** | Stanford's declarative prompt optimization framework with signatures, modules, teleprompters (MIPRO), and MCP support | `dspy`, `prompt optimization`, `teleprompter`, `MIPRO` |
| **[AutoGen](output/autogen/)** | Microsoft's multi-agent framework with AgentChat, Teams (Swarm, Magentic-One, GraphFlow), and AutoGen Studio | `autogen`, `multi-agent`, `AgentChat`, `Swarm` |
| **[Unsloth](output/unsloth/)** | 2-5x faster LLM fine-tuning with LoRA/QLoRA, GRPO/DPO/ORPO reinforcement learning, 500K context, vision models | `unsloth`, `fine-tuning`, `LoRA`, `QLoRA`, `GRPO` |
| **[vLLM](output/vllm/)** | Fast LLM inference and serving with PagedAttention, continuous batching, tensor parallelism | `vllm`, `inference`, `serving`, `PagedAttention` |
| **[RAG](output/rag/)** | Comprehensive RAG guide covering vector databases, embeddings, chunking strategies, hybrid search, reranking, RAGAS evaluation | `RAG`, `vector database`, `embeddings`, `chunking`, `RAGAS` |
| **[Deep Learning](output/deep-learning/)** | Core DL techniques: CNN, RNN, LSTM, Transformer architectures, Dropout, Batch Normalization | `deep learning`, `CNN`, `RNN`, `LSTM`, `Transformer` |

### LLM API Providers

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[Groq](output/groq/)** | Ultra-fast LLM inference API for chat completions, speech-to-text (Whisper), text-to-speech, vision, tool use, Groq Compound | `groq`, `Whisper`, `fast inference` |
| **[Mistral](output/mistral/)** | Mistral AI API for chat completions, vision, audio transcription, function calling, embeddings, fine-tuning, agents | `mistral`, `mistral-large`, `mistral-small` |

### Frontend Development

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[React](output/react/)** | React framework for building user interfaces with hooks, components, and state management | `react`, `hooks`, `useState`, `useEffect`, `JSX` |
| **[Tiptap](output/tiptap/)** | Headless rich text editor based on ProseMirror for building custom WYSIWYG editors | `tiptap`, `ProseMirror`, `rich text`, `WYSIWYG`, `editor` |

### Testing & DevTools

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[Playwright](output/playwright/)** | Browser automation and E2E testing framework by Microsoft for cross-browser web testing | `playwright`, `E2E`, `browser automation`, `testing` |
| **[Chrome DevTools](output/chrome-devtools/)** | Chrome browser developer tools for debugging, profiling, and web development | `devtools`, `chrome`, `debugging`, `profiling` |
| **[Vue DevTools](output/vue-devtools/)** | Vue.js browser devtools for debugging Vue applications | `vue devtools`, `vue debugging` |

### Personal Growth & Learning

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[Atomic Habits](output/atomic-habits/)** | James Clear's behavior change methodology: Four Laws, habit stacking, two-minute rule, identity-based habits | `atomic habits`, `habit`, `behavior change`, `James Clear` |
| **[Learning Mastery](output/learning-mastery/)** | Five-layer learning framework (記懂網拓活) based on 楊大輝《深度學習的技術》 | `learning`, `study`, `memory`, `Feynman technique` |

### Creative Writing

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[Writing Masters](output/writing-masters/)** | Western literary masters' techniques: Hemingway's iceberg theory, minimalism, narrative techniques | `writing`, `Hemingway`, `iceberg theory`, `creative writing` |
| **[Storytelling Masters](output/storytelling-masters/)** | Storytelling techniques from Annette Simmons, Nancy Duarte, Joseph Campbell's Hero's Journey | `storytelling`, `hero's journey`, `presentation`, `narrative` |

### Travel & Lifestyle

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[大阪旅遊](skills/大阪旅遊/)** | Complete Osaka travel guide: attractions, food, transportation, itineraries, Kansai region | `大阪`, `osaka`, `日本旅遊`, `關西` |

### Automation & Tools

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[ntfy-notify](skills/ntfy-notify/)** | Send task completion notifications via ntfy.sh push service | `通知`, `提醒`, `notify`, `完成後通知`, `做完通知` |
| **[rloop](skills/rloop/rloop/)** | Ralph autonomous development loop for Claude Code with intelligent exit detection | `rloop`, `ralph`, `autonomous`, `development loop` |
| **[Skill Seekers](skills/skill-seekers/)** | Create skills from documentation websites, GitHub repos, and PDFs | `skill seekers`, `create skill`, `documentation scraper` |

### Other

| Skill | Description | Triggers |
|-------|-------------|----------|
| **[Claude MD Guide](output/claude-md-guide/)** | Guide for writing CLAUDE.md project instructions | `CLAUDE.md`, `project instructions` |
| **[HackerNews AI Digest](output/hackernews-ai-digest/)** | AI-focused HackerNews digest and summaries | `hackernews`, `AI news`, `tech news` |

---

## Scraping Configurations

These configs are used to scrape documentation and generate new skills.

### AI/ML Frameworks

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[LangChain](configs/langchain.json)** | Build AI agents with LCEL pipelines, RAG, LangGraph workflows | 400 | `skill-seekers scrape --config configs/langchain.json` |
| **[DSPy](configs/dspy.json)** | Stanford's declarative prompt optimization framework | 350 | `skill-seekers scrape --config configs/dspy.json` |
| **[AutoGen](configs/autogen.json)** | Microsoft's multi-agent framework | 400 | `skill-seekers scrape --config configs/autogen.json` |
| **[Unsloth](configs/unsloth.json)** | 2-5x faster LLM fine-tuning | 250 | `skill-seekers scrape --config configs/unsloth.json` |

### Web Frameworks

#### Frontend

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[React](configs/react.json)** | React framework for building user interfaces | 300 | `skill-seekers scrape --config configs/react.json` |
| **[Vue](configs/vue.json)** | Progressive JavaScript framework for UIs | 200 | `skill-seekers scrape --config configs/vue.json` |
| **[Astro](configs/astro.json)** | Content-focused web framework with islands architecture | 100 | `skill-seekers scrape --config configs/astro.json` |
| **[Tailwind CSS](configs/tailwind.json)** | Utility-first CSS framework | 100 | `skill-seekers scrape --config configs/tailwind.json` |

#### Backend

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[FastAPI](configs/fastapi.json)** | Modern Python web framework with automatic OpenAPI docs | 250 | `skill-seekers scrape --config configs/fastapi.json` |
| **[Django](configs/django.json)** | Python web framework with ORM, admin panel | 500 | `skill-seekers scrape --config configs/django.json` |
| **[Laravel](configs/laravel.json)** | PHP web framework with Eloquent ORM | 500 | `skill-seekers scrape --config configs/laravel.json` |
| **[Hono](configs/hono.json)** | Ultrafast web framework for edge computing | 50 | `skill-seekers scrape --config configs/hono.json` |

### DevOps & Infrastructure

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[Kubernetes](configs/kubernetes.json)** | Container orchestration | 1000 | `skill-seekers scrape --config configs/kubernetes.json` |
| **[Ansible Core](configs/ansible-core.json)** | IT automation | 800 | `skill-seekers scrape --config configs/ansible-core.json` |

### Game Development

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[Godot](configs/godot.json)** | Open-source game engine | 500 | `skill-seekers scrape --config configs/godot.json` |
| **[Godot (Large)](configs/godot-large-example.json)** | Complete Godot documentation | 40000 | `skill-seekers scrape --config configs/godot-large-example.json` |

### Developer Tools

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[Claude Code](configs/claude-code.json)** | Anthropic's AI coding assistant CLI | 200 | `skill-seekers scrape --config configs/claude-code.json` |

### Gaming & Economy

| Config | Description | Pages | Command |
|--------|-------------|-------|---------|
| **[Steam Economy](configs/steam-economy-complete.json)** | Steam partner documentation for in-game economies | 1000 | `skill-seekers scrape --config configs/steam-economy-complete.json` |

---

## Unified Configs (Multi-Source)

These configs combine documentation + GitHub code analysis for comprehensive skills with conflict detection.

| Config | Sources | Command |
|--------|---------|---------|
| **[React Unified](configs/react_unified.json)** | Docs + GitHub | `skill-seekers unified --config configs/react_unified.json` |
| **[Django Unified](configs/django_unified.json)** | Docs + GitHub | `skill-seekers unified --config configs/django_unified.json` |
| **[FastAPI Unified](configs/fastapi_unified.json)** | Docs + GitHub | `skill-seekers unified --config configs/fastapi_unified.json` |
| **[Godot Unified](configs/godot_unified.json)** | Docs + GitHub | `skill-seekers unified --config configs/godot_unified.json` |

---

## Quick Reference

### One-Command Install (Recommended)

```bash
# Scrape, enhance, package, and upload in one command
skill-seekers install --config react

# With specific target platform
skill-seekers install --config langchain --target gemini
```

### Scrape a Skill

```bash
# Basic scraping
skill-seekers scrape --config configs/react.json

# With AI enhancement (recommended)
skill-seekers scrape --config configs/react.json --enhance-local

# Async mode (2-3x faster)
skill-seekers scrape --config configs/react.json --async --workers 8
```

### Estimate Before Scraping

```bash
skill-seekers estimate configs/kubernetes.json
```

### Package and Upload

```bash
# Package for Claude AI (default)
skill-seekers package output/react/

# Package for other platforms
skill-seekers package output/react/ --target gemini
skill-seekers package output/react/ --target openai
skill-seekers package output/react/ --target markdown

# Package and upload
skill-seekers package output/react/ --upload
```

### Unified Multi-Source

```bash
# Combine docs + GitHub + PDF
skill-seekers unified --config configs/react_unified.json

# With Claude-enhanced merging
skill-seekers unified --config configs/django_unified.json --merge-mode claude-enhanced
```

---

## Skill Categories by Use Case

### Building AI Agents
- **LangChain** - Production-ready agent framework with tools and memory
- **AutoGen** - Multi-agent orchestration with team patterns
- **DSPy** - Optimized prompts with automatic tuning
- **RAG** - Retrieval-augmented generation systems

### Fine-tuning & Serving LLMs
- **Unsloth** - Fast fine-tuning with LoRA, RLHF, vision models
- **vLLM** - High-throughput LLM serving
- **Groq** - Ultra-fast inference API
- **Mistral** - Mistral AI models and APIs

### Web Development
- **React/Vue/Astro** - Frontend frameworks
- **FastAPI/Django/Laravel** - Backend frameworks
- **Tailwind** - CSS utilities
- **Tiptap** - Rich text editing

### Testing & Automation
- **Playwright** - Browser automation and E2E testing
- **Chrome DevTools** - Browser debugging

### Personal Development
- **Atomic Habits** - Build good habits, break bad ones
- **Learning Mastery** - Effective learning techniques

### Creative Work
- **Writing Masters** - Literary writing techniques
- **Storytelling Masters** - Presentation and narrative skills

### Task Automation
- **ntfy-notify** - Push notifications on task completion
- **rloop** - Autonomous development loops

---

## Test & Example Configs

These are for testing purposes and not recommended for production use.

| Config | Purpose |
|--------|---------|
| `python-tutorial-test.json` | Small test config (10 pages) |
| `test-manual.json` | Manual testing |
| `example_pdf.json` | PDF extraction example |
| `fastapi_unified_test.json` | Unified scraping test |
| `godot_github.json` | GitHub-only scraping test |
| `react_github.json` | GitHub-only scraping test |
| `deck_deck_go_local.json` | Local repository test |

---

## Contributing New Skills

### Create from Config

1. Create a new JSON file in `configs/`
2. Use an existing config as template
3. Test with `--dry-run` first:
   ```bash
   skill-seekers scrape --config configs/new.json --dry-run
   ```
4. Estimate page count:
   ```bash
   skill-seekers estimate configs/new.json
   ```
5. Submit PR with the new config

### Create Manual Skill

1. Create directory in `skills/<skill-name>/`
2. Create `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Short description for when to use this skill
   triggers:
     - "keyword1"
     - "keyword2"
   ---
   ```
3. Add skill content following the template
4. Submit PR

See [CLAUDE.md](CLAUDE.md) for detailed documentation.

---

## Directory Structure

```
Skill_Seekers/
├── configs/              # Scraping configurations
├── output/               # Generated skills from scraping
│   ├── langchain/
│   ├── react/
│   └── ...
├── skills/               # Manual/custom skills
│   ├── 大阪旅遊/
│   ├── ntfy-notify/
│   ├── rloop/
│   └── skill-seekers/
└── SKILLS_INDEX.md       # This file
```
