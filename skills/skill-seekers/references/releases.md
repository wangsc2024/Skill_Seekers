# Releases

Version history for this repository (11 releases).

## v2.5.1: v2.5.1
**Published:** 2025-12-30

## [2.5.1] - 2025-12-30

### 🐛 Critical Bug Fix - PyPI Package Broken

This **patch release** fixes a critical packaging bug that made v2.5.0 completely unusable for PyPI users.

### Fixed

- **CRITICAL**: Added missing `skill_seekers.cli.adaptors` module to packages list in pyproject.toml ([#221](https://github.com/yusufkaraaslan/Skill_Seekers/pull/221))
  - **Issue**: v2.5.0 on PyPI throws `ModuleNotFoundError: No module named 'skill_seekers.cli.adaptors'`
  - **Impact**: Broke 100% of multi-platform features (Claude, Gemini, OpenAI, Markdown)
  - **Cause**: The adaptors module was missing from the explicit packages list
  - **Fix**: Added `skill_seekers.cli.adaptors` to packages in pyproject.toml
  - **Credit**: Thanks to [@MiaoDX](https://github.com/MiaoDX) for finding and fixing this issue!

### Package Structure

The `skill_seekers.cli.adaptors` module contains the platform adaptor architecture:
- `base.py` - Abstract base class for all adaptors
- `claude.py` - Claude AI platform implementation
- `gemini.py` - Google Gemini platform implementation
- `openai.py` - OpenAI ChatGPT platform implementation
- `markdown.py` - Generic markdown export

**Note**: v2.5.0 is broken on PyPI. All users should upgrade to v2.5.1 immediately.

---



[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.5.1)

---

## v2.5.0: v2.5.0 - Multi-Platform Feature Parity
**Published:** 2025-12-28

# 🚀 Multi-Platform Feature Parity - 4 LLM Platforms Supported

This **major feature release** adds complete multi-platform support for **Claude AI**, **Google Gemini**, **OpenAI ChatGPT**, and **Generic Markdown** export. All features now work across all platforms with full feature parity.

## 🎯 Highlights

### Multi-LLM Platform Support
- ✅ **4 platforms supported**: Claude AI, Google Gemini, OpenAI ChatGPT, Generic Markdown
- ✅ **Complete feature parity**: All skill modes work with all platforms
- ✅ **Platform adaptors**: Clean architecture with platform-specific implementations
- ✅ **Unified workflow**: Same scraping output works for all platforms
- ✅ **Smart enhancement**: Platform-specific AI models (Claude Sonnet 4, Gemini 2.0 Flash, GPT-4o)

### Platform-Specific Capabilities

| Platform | Format | Upload | Enhancement | Unique Features |
|----------|--------|--------|-------------|----------------|
| **Claude AI** | ZIP + YAML | Skills API | Sonnet 4 | MCP integration |
| **Google Gemini** | tar.gz | Files API | Gemini 2.0 | 1M token context |
| **OpenAI ChatGPT** | ZIP + Vector | Assistants API | GPT-4o | Semantic search |
| **Generic Markdown** | ZIP | Manual | - | Universal compatibility |

### Complete Feature Parity

**All skill modes work with all platforms:**
- 📄 Documentation scraping → All 4 platforms
- 🐙 GitHub repository analysis → All 4 platforms
- 📕 PDF extraction → All 4 platforms
- 🔀 Unified multi-source → All 4 platforms
- 💻 Local repository analysis → All 4 platforms

### 18 MCP Tools with Multi-Platform Support
- `package_skill` - Now accepts `target` parameter (claude, gemini, openai, markdown)
- `upload_skill` - Now accepts `target` parameter (claude, gemini, openai)
- `enhance_skill` - **NEW** standalone tool with `target` parameter
- `install_skill` - Full multi-platform workflow automation

## 📦 Installation

```bash
# Core package (Claude support)
pip install skill-seekers==2.5.0

# With Gemini support
pip install skill-seekers[gemini]==2.5.0

# With OpenAI support
pip install skill-seekers[openai]==2.5.0

# With all platforms
pip install skill-seekers[all-llms]==2.5.0
```

## 🚀 Quick Start - Multi-Platform

```bash
# Scrape documentation (platform-agnostic)
skill-seekers scrape --config configs/react.json

# Package for different platforms
skill-seekers package output/react/ --target claude     # ZIP
skill-seekers package output/react/ --target gemini     # tar.gz
skill-seekers package output/react/ --target openai     # ZIP with vector
skill-seekers package output/react/ --target markdown   # ZIP universal

# Upload to platforms (requires API keys)
export ANTHROPIC_API_KEY=sk-ant-...
export GOOGLE_API_KEY=AIzaSy...
export OPENAI_API_KEY=sk-proj-...

skill-seekers upload output/react.zip --target claude
skill-seekers upload output/react-gemini.tar.gz --target gemini
skill-seekers upload output/react-openai.zip --target openai
```

## 📚 Documentation

- 📊 [Complete Feature Matrix](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/docs/FEATURE_MATRIX.md)
- 📤 [Multi-Platform Upload Guide](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/docs/UPLOAD_GUIDE.md)
- ✨ [Enhancement Guide](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/docs/ENHANCEMENT.md)
- 🔧 [MCP Setup](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/docs/MCP_SETUP.md)

## 📈 Stats

- **16 commits** since v2.4.0
- **700 tests** passing (up from 427, +273 new tests)
- **4 platforms** supported (was 1)
- **18 MCP tools** (up from 17)
- **5 documentation guides** updated/created
- **29 files changed**, 6,349 insertions(+), 253 deletions(-)

## 🎉 What's New

See [CHANGELOG.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CHANGELOG.md) for complete details.

## 🙏 Contributors

- @yusufkaraaslan - Multi-platform architecture, all platform adaptors, comprehensive testing

---

**Full Changelog**: https://github.com/yusufkaraaslan/Skill_Seekers/compare/v2.4.0...v2.5.0

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.5.0)

---

## v2.4.0: v2.4.0
**Published:** 2025-12-25

## [2.4.0] - 2025-12-25

### 🚀 MCP 2025 Upgrade - Multi-Agent Support & HTTP Transport

This **major release** upgrades the MCP infrastructure to the 2025 specification with support for 5 AI coding agents, dual transport modes (stdio + HTTP), and a complete FastMCP refactor.

### 🎯 Major Features

#### MCP SDK v1.25.0 Upgrade
- **Upgraded from v1.18.0 to v1.25.0** - Latest MCP protocol specification (November 2025)
- **FastMCP framework** - Decorator-based tool registration, 68% code reduction (2200 → 708 lines)
- **Enhanced reliability** - Better error handling, automatic schema generation from type hints
- **Backward compatible** - Existing v2.3.0 configurations continue to work

#### Dual Transport Support
- **stdio transport** (default) - Standard input/output for Claude Code, VS Code + Cline
- **HTTP transport** (new) - Server-Sent Events for Cursor, Windsurf, IntelliJ IDEA
- **Health check endpoint** - `GET /health` for monitoring
- **SSE endpoint** - `GET /sse` for real-time communication
- **Configurable server** - `--http`, `--port`, `--host`, `--log-level` flags
- **uvicorn-powered** - Production-ready ASGI server

#### Multi-Agent Auto-Configuration
- **5 AI agents supported**:
  - Claude Code (stdio)
  - Cursor (HTTP)
  - Windsurf (HTTP)
  - VS Code + Cline (stdio)
  - IntelliJ IDEA (HTTP)
- **Automatic detection** - `agent_detector.py` scans for installed agents
- **One-command setup** - `./setup_mcp.sh` configures all detected agents
- **Smart config merging** - Preserves existing MCP servers, only adds skill-seeker
- **Automatic backups** - Timestamped backups before modifications
- **HTTP server management** - Auto-starts HTTP server for HTTP-based agents

#### Expanded Tool Suite (17 Tools)
- **Config Tools (3)**: generate_config, list_configs, validate_config
- **Scraping Tools (4)**: estimate_pages, scrape_docs, scrape_github, scrape_pdf
- **Packaging Tools (3)**: package_skill, upload_skill, install_skill
- **Splitting Tools (2)**: split_config, generate_router
- **Source Tools (5)**: fetch_config, submit_config, add_config_source, list_config_sources, remove_config_source

### Added

#### Core Infrastructure
- **`server_fastmcp.py`** (708 lines) - New FastMCP-based MCP server
  - Decorator-based tool registration (`@safe_tool_decorator`)
  - Modular tool architecture (5 tool modules)
  - HTTP transport with uvicorn
  - stdio transport (default)
  - Comprehensive error handling

- **`agent_detector.py`** (333 lines) - Multi-agent detection and configuration
  - Detects 5 AI coding agents across platforms (Linux, macOS, Windows)
  - Generates agent-specific config formats (JSON, XML)
  - Auto-selects transport type (stdio vs HTTP)
  - Cross-platform path resolution

- **Tool modules** (5 modules, 1,676 total lines):
  - `tools/config_tools.py` (249 lines) - Configuration management
  - `tools/scraping_tools.py` (423 lines) - Documentation scraping
  - `tools/packaging_tools.py` (514 lines) - Skill packaging and upload
  - `tools/splitting_tools.py` (195 lines) - Config splitting and routing
  - `tools/source_tools.py` (295 lines) - Config source management

#### Setup & Configuration
- **`setup_mcp.sh`** (rewritten, 661 lines) - Multi-agent auto-configuration
  - Detects installed agents automatically
  - Offers configure all or select individual agents
  - Manages HTTP server startup
  - Smart config merging with existing configurations
  - Comprehensive validation and testing

- **HTTP server** - Production-ready HTTP transport
  - Health endpoint: `/health`
  - SSE endpoint: `/sse`
  - Messages endpoint: `/messages/`
  - CORS middleware for cross-origin requests
  - Configurable host and port
  - Debug logging support

#### Documentation
- **`docs/MCP_SETUP.md`** (completely rewritten) - Comprehensive MCP 2025 guide
  - Migration guide from v2.3.0
  - Transport modes explained (stdio vs HTTP)
  - Agent-specific configuration for all 5 agents
  - Troubleshooting for both transports
  - Advanced configuration (systemd, launchd services)

- **`docs/HTTP_TRANSPORT.md`** (434 lines, new) - HTTP transport guide
- **`docs/MULTI_AGENT_SETUP.md`** (643 lines, new) - Multi-agent setup guide
- **`docs/SETUP_QUICK_REFERENCE.md`** (387 lines, new) - Quick reference card
- **`SUMMARY_HTTP_TRANSPORT.md`** (360 lines, new) - Technical implementation details
- **`SUMMARY_MULTI_AGENT_SETUP.md`** (556 lines, new) - Multi-agent technical summary

#### Testing
- **`test_mcp_fastmcp.py`** (960 lines, 63 tests) - Comprehensive FastMCP server tests
  - All 17 tools tested
  - Error handling validation
  - Type validation
  - Integration workflows

- **`test_server_fastmcp_http.py`** (165 lines, 6 tests) - HTTP transport tests
  - Health check endpoint
  - SSE endpoint
  - CORS middleware
  - Argument parsing

- **All tests passing**: 602/609 tests (99.1% pass rate)

### Changed

#### MCP Server Architecture
- **Refactored to FastMCP** - Decorator-based, modular, maintainable
- **Code reduction** - 68% smaller (2200 → 708 lines)
- **Modular tools** - Separated into 5 category modules
- **Type safety** - Full type hints on all tool functions
- **Improved error handling** - Graceful degradation, clear error messages

#### Server Compatibility
- **`server.py`** - Now a compatibility shim (delegates to `server_fastmcp.py`)
- **Deprecation warning** - Alerts users to migrate to `server_fastmcp`
- **Backward compatible** - Existing configurations continue to work
- **Migration path** - Clear upgrade instructions in docs

#### Setup Experience
- **Multi-agent workflow** - One script configures all agents
- **Interactive prompts** - User-friendly with sensible defaults
- **Validation** - Config file validation before writing
- **Backup safety** - Automatic timestamped backups
- **Color-coded output** - Visual feedback (success/warning/error)

#### Documentation
- **README.md** - Added comprehensive multi-agent section
- **MCP_SETUP.md** - Completely rewritten for v2.4.0
- **CLAUDE.md** - Updated with new server details
- **Version badges** - Updated to v2.4.0

### Fixed
- Import issues in test files (updated to use new tool modules)
- CLI version test (updated to expect v2.3.0)
- Graceful MCP import handling (no sys.exit on import)
- Server compatibility for testing environments

### Deprecated
- **`server.py`** - Use `server_fastmcp.py` instead
  - Compatibility shim provided
  - Will be removed in v3.0.0 (6+ months)
  - Migration guide available

### Infrastructure
- **Python 3.10+** - Recommended for best compatibility
- **MCP SDK**: v1.25.0 (pinned to v1.x)
- **uvicorn**: v0.40.0+ (for HTTP transport)
- **starlette**: v0.50.0+ (for HTTP transport)

### Migration from v2.3.0

**Upgrade Steps:**
1. Update dependencies: `pip install -e ".[mcp]"`
2. Update MCP config to use `server_fastmcp`:
   ```json
   {
     "mcpServers": {
       "skill-seeker": {
         "command": "python",
         "args": ["-m", "skill_seekers.mcp.server_fastmcp"]
       }
     }
   }
   ```
3. For HTTP agents, start HTTP server: `python -m skill_seekers.mcp.server_fastmcp --http`
4. Or use auto-configuration: `./setup_mcp.sh`

**Breaking Changes:** None - fully backward compatible

**New Capabilities:**
- Multi-agent support (5 agents)
- HTTP transport for web-based agents
- 8 new MCP tools
- Automatic agent detection and configuration

### Contributors
- Implementation: Claude Sonnet 4.5
- Testing & Review: @yusufkaraaslan

---



[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.4.0)

---

## v2.2.0: v2.2.0
**Published:** 2025-12-21

## [2.2.0] - 2025-12-21

### 🚀 Private Config Repositories - Team Collaboration Unlocked

This major release adds **git-based config sources**, enabling teams to fetch configs from private/team repositories in addition to the public API. This unlocks team collaboration, enterprise deployment, and custom config collections.

### 🎯 Major Features

#### Git-Based Config Sources (Issue [#211](https://github.com/yusufkaraaslan/Skill_Seekers/issues/211))
- **Multi-source config management** - Fetch from API, git URL, or named sources
- **Private repository support** - GitHub, GitLab, Bitbucket, Gitea, and custom git servers
- **Team collaboration** - Share configs across 3-5 person teams with version control
- **Enterprise scale** - Support 500+ developers with priority-based resolution
- **Secure authentication** - Environment variable tokens only (GITHUB_TOKEN, GITLAB_TOKEN, etc.)
- **Intelligent caching** - Shallow clone (10-50x faster), auto-pull updates
- **Offline mode** - Works with cached repos when offline
- **Backward compatible** - Existing API-based configs work unchanged

#### New MCP Tools
- **`add_config_source`** - Register git repositories as config sources
  - Auto-detects source type (GitHub, GitLab, etc.)
  - Auto-selects token environment variable
  - Priority-based resolution for multiple sources
  - SSH URL support (auto-converts to HTTPS + token)

- **`list_config_sources`** - View all registered sources
  - Shows git URL, branch, priority, token env
  - Filter by enabled/disabled status
  - Sorted by priority (lower = higher priority)

- **`remove_config_source`** - Unregister sources
  - Removes from registry (cache preserved for offline use)
  - Helpful error messages with available sources

- **Enhanced `fetch_config`** - Three modes
  1. **Named source mode** - `fetch_config(source="team", config_name="react-custom")`
  2. **Git URL mode** - `fetch_config(git_url="https://...", config_name="react-custom")`
  3. **API mode** - `fetch_config(config_name="react")` (unchanged)

### Added

#### Core Infrastructure
- **GitConfigRepo class** (`src/skill_seekers/mcp/git_repo.py`, 283 lines)
  - `clone_or_pull()` - Shallow clone with auto-pull and force refresh
  - `find_configs()` - Recursive *.json discovery (excludes .git)
  - `get_config()` - Load config with case-insensitive matching
  - `inject_token()` - Convert SSH to HTTPS with token authentication
  - `validate_git_url()` - Support HTTPS, SSH, and file:// URLs
  - Comprehensive error handling (auth failures, missing repos, corrupted caches)

- **SourceManager class** (`src/skill_seekers/mcp/source_manager.py`, 260 lines)
  - `add_source()` - Register/update sources with validation
  - `get_source()` - Retrieve by name with helpful errors
  - `list_sources()` - List all/enabled sources sorted by priority
  - `remove_source()` - Unregister sources
  - `update_source()` - Modify specific fields
  - Atomic file I/O (write to temp, then rename)
  - Auto-detect token env vars from source type

#### Storage & Caching
- **Registry file**: `~/.skill-seekers/sources.json`
  - Stores source metadata (URL, branch, priority, timestamps)
  - Version-controlled schema (v1.0)
  - Atomic writes prevent corruption

- **Cache directory**: `$SKILL_SEEKERS_CACHE_DIR` (default: `~/.skill-seekers/cache/`)
  - One subdirectory per source
  - Shallow git clones (depth=1, single-branch)
  - Configurable via environment variable

#### Documentation
- **docs/GIT_CONFIG_SOURCES.md** (800+ lines) - Comprehensive guide
  - Quick start, architecture, authentication
  - MCP tools reference with examples
  - Use cases (small teams, enterprise, open source)
  - Best practices, troubleshooting, advanced topics
  - Complete API reference

- **configs/example-team/** - Example repository for testing
  - `react-custom.json` - Custom React config with metadata
  - `vue-internal.json` - Internal Vue config
  - `company-api.json` - Company API config example
  - `README.md` - Usage guide and best practices
  - `test_e2e.py` - End-to-end test script (7 steps, 100% passing)

- **README.md** - Updated with git source examples
  - New "Private Config Repositories" section in Key Features
  - Comprehensive usage examples (quick start, team collaboration, enterprise)
  - Supported platforms and authentication
  - Example workflows for different team sizes

### Dependencies
- **GitPython>=3.1.40** - Git operations (clone, pull, branch switching)
  - Replaces subprocess calls with high-level API
  - Better error handling and cross-platform support

### Testing
- **83 new tests** (100% passing)
  - `tests/test_git_repo.py` (35 tests) - GitConfigRepo functionality
    - Initialization, URL validation, token injection
    - Clone/pull operations, config discovery, error handling
  - `tests/test_source_manager.py` (48 tests) - SourceManager functionality
    - Add/get/list/remove/update sources
    - Registry persistence, atomic writes, default token env
  - `tests/test_mcp_git_sources.py` (18 tests) - MCP integration
    - All 3 fetch modes (API, Git URL, Named Source)
    - Source management tools (add/list/remove)
    - Complete workflow (add → fetch → remove)
    - Error scenarios (auth failures, missing configs)

### Improved
- **MCP server** - Now supports 12 tools (up from 9)
  - Maintains backward compatibility
  - Enhanced error messages with available sources
  - Priority-based config resolution

### Use Cases

**Small Teams (3-5 people):**
```bash
# One-time setup
add_config_source(name="team", git_url="https://github.com/myteam/configs.git")

# Daily usage
fetch_config(source="team", config_name="react-internal")
```

**Enterprise (500+ developers):**
```bash
# IT pre-configures sources
add_config_source(name="platform", ..., priority=1)
add_config_source(name="mobile", ..., priority=2)

# Developers use transparently
fetch_config(config_name="platform-api")  # Finds in platform source
```

**Example Repository:**
```bash
cd /path/to/Skill_Seekers
python3 configs/example-team/test_e2e.py  # Test E2E workflow
```

### Backward Compatibility
- ✅ All existing configs work unchanged
- ✅ API mode still default (no registration needed)
- ✅ No breaking changes to MCP tools or CLI
- ✅ New parameters are optional (git_url, source, refresh)

### Security
- ✅ Tokens via environment variables only (not in files)
- ✅ Shallow clones minimize attack surface
- ✅ No token storage in registry file
- ✅ Secure token injection (auto-converts SSH to HTTPS)

### Performance
- ✅ Shallow clone: 10-50x faster than full clone
- ✅ Minimal disk space (no git history)
- ✅ Auto-pull: Only fetches changes (not full re-clone)
- ✅ Offline mode: Works with cached repos

### Files Changed
- Modified (2): `pyproject.toml`, `src/skill_seekers/mcp/server.py`
- Added (6): 3 source files + 3 test files + 1 doc + 1 example repo
- Total lines added: ~2,600

### Migration Guide

No migration needed! This is purely additive:

```python
# Before v2.2.0 (still works)
fetch_config(config_name="react")

# New in v2.2.0 (optional)
add_config_source(name="team", git_url="...")
fetch_config(source="team", config_name="react-custom")
```

### Known Limitations
- MCP async tests require pytest-asyncio (added to dev dependencies)
- Example repository uses 'master' branch (git init default)

### See Also
- [GIT_CONFIG_SOURCES.md](docs/GIT_CONFIG_SOURCES.md) - Complete guide
- [configs/example-team/](configs/example-team/) - Example repository
- [Issue #211](https://github.com/yusufkaraaslan/Skill_Seekers/issues/211) - Original feature request

---



[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.2.0)

---

## v2.1.1: v2.1.1 - GitHub Repository Analysis Enhancements
**Published:** 2025-11-30

## 🚀 GitHub Repository Analysis Enhancements

This release significantly improves GitHub repository scraping with unlimited local analysis, configurable directory exclusions, and numerous bug fixes.

### ✨ New Features

- **Configurable directory exclusions** for local repository analysis ([#203](https://github.com/yusufkaraaslan/Skill_Seekers/issues/203))
  - `exclude_dirs_additional`: Extend default exclusions with custom directories
  - `exclude_dirs`: Replace default exclusions entirely (advanced users)
  - 19 comprehensive tests covering all scenarios
  - Logging: INFO for extend mode, WARNING for replace mode
- **Unlimited local repository analysis** via `local_repo_path` configuration parameter
- **Auto-exclusion** of virtual environments, build artifacts, and cache directories
- **Support for analyzing repositories without GitHub API rate limits** (50 → unlimited files)
- **Skip llms.txt option** - Force HTML scraping even when llms.txt is detected ([#198](https://github.com/yusufkaraaslan/Skill_Seekers/pull/198))

### 🐛 Bug Fixes

- Fixed logger initialization error causing `AttributeError: 'NoneType' object has no attribute 'setLevel'` ([#190](https://github.com/yusufkaraaslan/Skill_Seekers/issues/190))
- Fixed 3 NoneType subscriptable errors in release tag parsing
- Fixed relative import paths causing `ModuleNotFoundError`
- Fixed hardcoded 50-file analysis limit preventing comprehensive code analysis
- Fixed GitHub API file tree limitation (140 → 345 files discovered)
- Fixed AST parser "not iterable" errors eliminating 100% of parsing failures (95 → 0 errors)
- Fixed virtual environment file pollution reducing file tree noise by 95%
- Fixed `force_rescrape` flag not checked before interactive prompt causing EOFError in CI/CD environments

### 📈 Improvements

- **Code analysis coverage:** 14% → 93.6% (+79.6 percentage points)
- **File discovery:** 140 → 345 files (+146%)
- **Class extraction:** 55 → 585 classes (+964%)
- **Function extraction:** 512 → 2,784 functions (+444%)
- **Test suite:** Expanded to 427 tests (up from 391)

### 📦 Installation

```bash
# Install from PyPI (recommended)
pip install skill-seekers==2.1.1

# Or upgrade existing installation
pip install --upgrade skill-seekers
```

### 📚 Documentation

- [CHANGELOG.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CHANGELOG.md) - Full changelog
- [README.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/README.md) - Complete documentation
- [CLAUDE.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CLAUDE.md) - Technical architecture

**Full Changelog:** https://github.com/yusufkaraaslan/Skill_Seekers/compare/v2.1.0...v2.1.1

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.1.1)

---

## v2.1.0: v2.1.0: Quality Assurance + Race Condition Fixes
**Published:** 2025-11-12

## 🎉 Major Enhancement: Quality Assurance + Race Condition Fixes

This release focuses on quality and reliability improvements, adding comprehensive quality checks and fixing critical race conditions in the enhancement workflow.

### 🚀 Key Features

#### Comprehensive Quality Checker
- ✅ Automatic quality validation before packaging
- ✅ Quality scoring system (0-100 score with A-F grades)
- ✅ Enhancement verification (checks for template text, code examples, sections)
- ✅ Structure validation (SKILL.md, references/ directory)
- ✅ Content quality checks (YAML frontmatter, language tags, "When to Use" section)
- ✅ Link validation (validates internal markdown links)
- ✅ Detailed reporting with errors, warnings, and info messages

#### Headless Enhancement Mode (Default)
- ✅ No terminal windows - runs enhancement in background by default
- ✅ Proper waiting - main console waits for enhancement to complete
- ✅ Timeout protection - 10-minute default timeout (configurable)
- ✅ Verification - checks that SKILL.md was actually updated
- ✅ Progress messages - clear status updates during enhancement
- ✅ Interactive mode available - use `--interactive-enhancement` flag

### 📊 Statistics

- **391 tests passing** (up from 379 in v2.0.0)
- **+12 quality checker tests** - comprehensive validation testing
- **0 test failures** - all tests green
- **5 commits** in this release

### 🔄 Breaking Changes

- **Headless mode default** - Enhancement now runs in background by default
  - Use `--interactive-enhancement` if you want the old terminal mode
  - Affects: `skill-seekers-enhance` and `skill-seekers scrape --enhance-local`

### 📦 Installation

```bash
# PyPI (recommended)
pip install skill-seekers==2.1.0

# Or with uv
uv tool install skill-seekers==2.1.0
```

### 🔧 Migration Guide

**If you want the old terminal mode behavior:**
```bash
# Old (v2.0.0): Default was terminal mode
skill-seekers-enhance output/react/

# New (v2.1.0): Use --interactive-enhancement
skill-seekers-enhance output/react/ --interactive-enhancement
```

**If you want to skip quality checks:**
```bash
# Add --skip-quality-check to package command
skill-seekers-package output/react/ --skip-quality-check
```

### 📝 What's Changed

**New Features:**
- Comprehensive quality checker module
- Headless enhancement mode (default)
- Quality checks in packaging workflow
- MCP server skips interactive checks
- Enhanced error handling and timeout protection

**Bug Fixes:**
- Fixed enhancement race condition
- Fixed MCP stdin errors in CI
- Fixed terminal detection tests for headless default

**See [CHANGELOG.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CHANGELOG.md) for complete details**

### 📚 Documentation

- [Installation Guide](https://github.com/yusufkaraaslan/Skill_Seekers#installation)
- [Quick Start](https://github.com/yusufkaraaslan/Skill_Seekers#quick-start)
- [CHANGELOG](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CHANGELOG.md)

---

**Full Changelog**: https://github.com/yusufkaraaslan/Skill_Seekers/compare/v2.0.0...v2.1.0

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.1.0)

---

## v2.0.0: v2.0.0 - Unified Multi-Source Scraping
**Published:** 2025-10-26

# 🎉 Now Available on PyPI!

**Skill Seekers is now published on the Python Package Index!**

Install with a single command:

```bash
pip install skill-seekers
```

No cloning, no setup - just install and use!

[![PyPI version](https://badge.fury.io/py/skill-seekers.svg)](https://pypi.org/project/skill-seekers/)
[![PyPI - Downloads](https://img.shields.io/pypi/dm/skill-seekers.svg)](https://pypi.org/project/skill-seekers/)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/skill-seekers.svg)](https://pypi.org/project/skill-seekers/)

**Links:**
- 📦 [PyPI Project Page](https://pypi.org/project/skill-seekers/)
- 📚 [Installation Guide](https://github.com/yusufkaraaslan/Skill_Seekers#quick-start)
- 📖 [Changelog](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CHANGELOG.md)

---

## 🚀 Quick Start

```bash
# Install from PyPI
pip install skill-seekers

# Use the unified CLI
skill-seekers scrape --config configs/react.json
skill-seekers github --repo facebook/react
skill-seekers package output/react/
```

---

## ✨ What's New in v2.0.0

### Modern Python Packaging
- ✅ Published to PyPI (`pip install skill-seekers`)
- ✅ Unified CLI (`skill-seekers` command with subcommands)
- ✅ pyproject.toml-based configuration
- ✅ src/ layout for best practices
- ✅ Entry points for all commands

### Testing & Quality (Updated Nov 11, 2025)
- ✅ **379 passing tests** (up from 369, 0 failures)
- ✅ Fixed all import paths for src/ layout
- ✅ Updated test suite for package structure
- ✅ MCP server tests fully passing
- ✅ Comprehensive pytest configuration

---

# 🚀 Skill Seekers v2.0.0 - Unified Multi-Source Scraping

**Release Date:** October 26, 2025  
**Updated:** November 11, 2025 (PyPI Publication)  
**Status:** Production Ready

---

## 🎯 Major Features

### Unified Multi-Source Scraping
Combine **documentation websites, GitHub repositories, and PDFs** into a single comprehensive skill!

**New Capabilities:**
- ✅ **Multi-source configs** - One config file, multiple sources
- ✅ **GitHub code analysis** - AST parsing for Python, JS, TS, Java, C++, Go
- ✅ **Conflict detection** - Compare docs vs actual code implementation
- ✅ **Smart merging** - Rule-based or Claude-enhanced merging
- ✅ **MCP integration** - Natural language: "Scrape GitHub repo facebook/react"

**Example unified config:**
```json
{
  "name": "react_complete",
  "merge_mode": "claude-enhanced",
  "sources": [
    {"type": "documentation", "base_url": "https://react.dev/"},
    {"type": "github", "repo": "facebook/react", "extract_api": true}
  ]
}
```

### GitHub Repository Scraping (C1 Task Group)
Deep code analysis and repository understanding:

- ✅ **AST parsing** - Extract functions, classes, types with full signatures
- ✅ **Repository metadata** - README, file tree, language stats, stars/forks
- ✅ **Issues & PRs** - Fetch open/closed issues with labels
- ✅ **CHANGELOG tracking** - Automatically extract version history
- ✅ **API extraction** - Complete API reference from actual code

### Conflict Detection
Compare documentation against actual code:

- ✅ **Missing APIs** - Find documented APIs not in code
- ✅ **Undocumented APIs** - Find code APIs missing from docs
- ✅ **Signature mismatches** - Detect parameter differences
- ✅ **Detailed reports** - JSON output with file locations

---

## 🛠️ New Tools & Commands

### Unified CLI (New!)
```bash
# Single command, multiple subcommands
skill-seekers --help

# Available commands:
skill-seekers scrape    # Documentation scraping
skill-seekers github    # GitHub repository scraping
skill-seekers pdf       # PDF extraction
skill-seekers unified   # Multi-source scraping
skill-seekers enhance   # AI enhancement
skill-seekers package   # Package to .zip
skill-seekers upload    # Upload to Claude
skill-seekers estimate  # Estimate page count
```

### Legacy CLI (Still supported)
```bash
# Original method still works
python3 src/skill_seekers/cli/doc_scraper.py --config configs/react.json
python3 src/skill_seekers/cli/github_scraper.py --repo facebook/react
python3 src/skill_seekers/cli/unified_scraper.py --config configs/react_unified.json
```

### MCP Tools (Enhanced)
All MCP tools now support unified configs:

```bash
# In Claude Code (natural language):
"Scrape React docs and GitHub repo into one skill"
"Generate unified config for Next.js"
"Detect conflicts in FastAPI docs vs code"
```

---

## 📦 What's Included

### New Files (19)
- `src/skill_seekers/cli/github_scraper.py` (786 lines) - GitHub repo scraper
- `src/skill_seekers/cli/code_analyzer.py` (491 lines) - AST code analysis
- `src/skill_seekers/cli/conflict_detector.py` (495 lines) - Docs vs code comparison
- `src/skill_seekers/cli/unified_scraper.py` (449 lines) - Multi-source orchestrator
- `src/skill_seekers/cli/merge_sources.py` (513 lines) - Intelligent merging
- `src/skill_seekers/cli/unified_skill_builder.py` (433 lines) - Skill generator
- `src/skill_seekers/cli/config_validator.py` (367 lines) - Config validation
- `src/skill_seekers/cli/main.py` (285 lines) - Unified CLI entry point
- `docs/UNIFIED_SCRAPING.md` (633 lines) - Complete guide
- `FUTURE_RELEASES.md` (288 lines) - Roadmap document
- 8 new unified config examples
- `tests/test_github_scraper.py` (734 lines) - GitHub tests
- `tests/test_setup_scripts.py` (221 lines) - Bash script tests
- `tests/test_unified_mcp_integration.py` (187 lines) - MCP tests

### Enhanced Files (5)
- `src/skill_seekers/mcp/server.py` - Updated with unified scraping support
- `README.md` - Added PyPI badges, reordered installation options
- `CHANGELOG.md` - Complete v2.0.0 release notes with PyPI info
- `QUICKSTART.md` - Added unified scraping examples
- `pyproject.toml` - Modern packaging configuration

---

## 🧪 Testing

**Total Tests:** 379 (up from 369)

**New Test Coverage:**
- ✅ GitHub scraper tests (40 tests)
- ✅ Unified MCP integration (4 tests)
- ✅ Bash script validation (19 tests)
- ✅ Path consistency checks (4 tests)
- ✅ Package structure tests (10 tests)

**Test Results:**
- ✅ 379/379 tests passing (100%)
- ✅ All import paths fixed for src/ layout
- ✅ MCP server tests fully working
- ✅ GitHub Actions CI passing
- ✅ All configs verified working

---

## 🐛 Bug Fixes

### Fixed Issue #157
- ✅ Updated setup_mcp.sh with correct paths
- ✅ Fixed 27 old `mcp/` references in docs
- ✅ Added bash script tests to prevent regression

### Fixed Issue #168 (PyPI Publication)
- ✅ Modern Python packaging with pyproject.toml
- ✅ Fixed all import paths for src/ layout
- ✅ Updated test suite for package structure
- ✅ Fixed merge_sources.py import error
- ✅ Fixed MCP server test imports

### Path Consistency
- ✅ All references now use `src/skill_seekers/` directory
- ✅ Tests validate path consistency across codebase
- ✅ Entry points properly configured

---

## 📊 Statistics

**Code Added:** +6,904 lines
**Code Removed:** -1,939 lines
**Net Change:** +4,965 lines

**Lines by Component:**
- GitHub scraper: 786 lines
- Unified scraping: 3,200+ lines
- Unified CLI: 285 lines
- Tests: 1,142 lines
- Documentation: 921 lines (includes FUTURE_RELEASES.md)
- Config examples: 200+ lines

---

## 🎓 Documentation

**New Guides:**
- [Unified Scraping Guide](docs/UNIFIED_SCRAPING.md) - Complete tutorial
- [Future Releases Roadmap](FUTURE_RELEASES.md) - Upcoming features
- Enhanced README with PyPI installation
- [Changelog](CHANGELOG.md) - Complete v2.0.0 release notes

**Updated Guides:**
- QUICKSTART.md - Added unified examples
- MCP_SETUP.md - Updated paths
- CLAUDE.md - Added unified scraping architecture
- README.md - PyPI badges and installation options

---

## 🔄 Upgrade Guide

### From v1.x to v2.0.0

**No breaking changes!** v1.x configs still work perfectly.

**Recommended migration:**

```bash
# Old way (still works)
git clone https://github.com/yusufkaraaslan/Skill_Seekers.git
cd Skill_Seekers
pip install -r requirements.txt
python3 src/skill_seekers/cli/doc_scraper.py --config configs/react.json

# New way (recommended)
pip install skill-seekers
skill-seekers scrape --config configs/react.json
```

**To use new unified features:**

1. **Create unified config:**
```json
{
  "name": "myproject",
  "merge_mode": "rule-based",
  "sources": [
    {"type": "documentation", "base_url": "https://docs.example.com"},
    {"type": "github", "repo": "user/repo"}
  ]
}
```

2. **Run unified scraper:**
```bash
skill-seekers unified --config configs/myproject.json
```

3. **Optional: Detect conflicts:**
```bash
# Coming soon - conflict detection subcommand
```

---

## 🙏 Credits

This release completes the **C1 task group** (GitHub scraping and unified multi-source support) and **Issue #168** (PyPI publication).

**Development:**
- 19 new files created
- 379 tests (100% passing)
- 921 lines of documentation
- 8 example configs
- Published to PyPI

**Community:**
- Fixed Issue #157 (setup_mcp.sh paths)
- Fixed Issue #168 (PyPI publication)
- Cleaned up 8 redundant files
- Improved test coverage

---

## 📝 Next Steps

Check out the roadmap for upcoming features in [FUTURE_RELEASES.md](FUTURE_RELEASES.md):

**v2.1.0 (Dec 2025):**
- Fix 12 unified scraping tests
- Improve test coverage to 60%+
- Enhanced error handling

**v2.2.0 (Q1 2026):**
- GitHub Pages website
- Plugin system foundation
- Additional documentation formats

See [FLEXIBLE_ROADMAP.md](FLEXIBLE_ROADMAP.md) for the complete task catalog (134 tasks).

---

**Happy skill building! 🚀**

```bash
# Try it now:
pip install skill-seekers
skill-seekers scrape --config configs/react.json
```

**Full documentation:** [docs/UNIFIED_SCRAPING.md](docs/UNIFIED_SCRAPING.md)

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v2.0.0)

---

## v1.3.0: v1.3.0 - Refactoring & Performance (2-3x Faster)
**Published:** 2025-10-26

# 🚀 v1.3.0 - Refactoring & Performance Improvements

Major refactoring release with async support, improved code quality, and better package structure.

## 🎯 Performance Highlights

- **2-3x faster scraping** with async mode (18 pg/s → 55 pg/s)
- **66% less memory** (120 MB → 40 MB)
- **299 tests** (92 new tests added)

## ✨ New Features

### Async/Await Support for Parallel Scraping
```bash
# Enable async mode with 8 workers (recommended for large docs)
python3 cli/doc_scraper.py --config configs/react.json --async --workers 8
```

**Performance Comparison:**
- Sync: ~18 pages/sec, 120 MB memory
- Async: ~55 pages/sec, 40 MB memory
- **3x faster with 66% less memory!**

### Python Package Structure
- Proper `__init__.py` files for clean imports
- `cli/` package with organized modules
- `skill_seeker_mcp/` package (renamed from mcp/)
- Better IDE support and maintainability

### Centralized Configuration
- New `cli/constants.py` with 18 configuration constants
- All magic numbers centralized and configurable
- Easy to customize defaults

## 🔧 Code Quality Improvements

- **71 print statements → proper logging** (logger.info, logger.warning, logger.error)
- **Type hints added** to all DocToSkillConverter methods
- **mypy type checking** - all issues fixed
- **Better error handling** with comprehensive logging

## 📚 Documentation

- New `ASYNC_SUPPORT.md` - Complete async guide
- Updated README.md with async examples
- Updated CLAUDE.md with technical details
- Comprehensive CHANGELOG.md

## 🧪 Testing

- **299 tests passing** (was 207)
- 92 new tests added:
  - 11 async scraping tests
  - 26 integration tests
  - 13 llms.txt tests
  - 21 constants tests
  - 21 package structure tests
- 100% test pass rate
- Fixed test isolation issues

## 🔄 Breaking Changes

**None!** This is a backwards-compatible refactoring release.

## 📦 What's Changed

### Added
- Async/await support with `--async` flag
- Connection pooling for better performance
- asyncio.Semaphore for concurrency control
- Python package structure with proper imports
- Centralized configuration module
- Type hints throughout codebase
- Comprehensive test coverage

### Changed
- All print() → logging calls
- Better IDE support with package structure
- Code quality improved from 5.5/10 to 6.5/10
- Test count: 207 → 299

### Fixed
- Test isolation issues
- Import issues (no more sys.path.insert hacks)
- All mypy type checking issues

## 📖 Full Changelog

See [CHANGELOG.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/CHANGELOG.md#130---2025-10-26) for complete details.

## 🙏 Acknowledgments

This refactoring was completed as Phase 0 of our development roadmap, setting a solid foundation for future features.

---

**Installation:**
```bash
git clone https://github.com/yusufkaraaslan/Skill_Seekers.git
cd Skill_Seekers
pip install -r requirements.txt
```

**Quick Start:**
```bash
# Try async mode
python3 cli/doc_scraper.py --config configs/react.json --async --workers 8
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v1.3.0)

---

## v1.2.0: v1.2.0 - PDF Advanced Features Release
**Published:** 2025-10-23

# v1.2.0 - PDF Advanced Features Release

**Date:** October 23, 2025

Major enhancement to PDF extraction capabilities with advanced features for handling any type of PDF documentation.

## 🚀 What's New

### Enhanced PDF Support
- **OCR for Scanned PDFs** - Automatically extract text from scanned documents using Tesseract OCR
  - Intelligent fallback when text content is low (< 50 characters)
  - Works with pytesseract and Pillow
  - Command: `--ocr`

- **Password-Protected PDFs** - Handle encrypted PDF files securely
  - Clear error messages for authentication issues
  - Command: `--password PASSWORD`

- **Table Extraction** - Extract complex tables from PDF documents
  - Captures table data as structured 2D arrays
  - Includes metadata (bounding box, row/column counts)
  - Integrates seamlessly with skill references
  - Command: `--extract-tables`

### Performance Improvements
- **3x Faster Processing** - Parallel page processing using multi-threading
  - Auto-detects CPU count or accepts custom worker specification
  - Activates automatically for PDFs with 5+ pages
  - Benchmark: 500-page PDF reduced from 4m 10s to 1m 15s
  - Commands: `--parallel` and `--workers N`

- **Intelligent Caching** - 50% faster on subsequent runs
  - In-memory cache for expensive operations (text extraction, code detection, quality scoring)
  - Enabled by default, disable with `--no-cache`

## 📚 Usage Examples

### Basic PDF Extraction
```bash
python3 cli/pdf_scraper.py --pdf docs/manual.pdf --name myskill
```

### Maximum Performance
```bash
python3 cli/pdf_scraper.py --pdf docs/manual.pdf --name myskill \
    --extract-tables \
    --parallel \
    --workers 8
```

### Scanned PDFs
```bash
pip3 install pytesseract Pillow
python3 cli/pdf_scraper.py --pdf docs/scanned.pdf --name myskill --ocr
```

### Password-Protected PDFs
```bash
python3 cli/pdf_scraper.py --pdf docs/encrypted.pdf --name myskill --password mypassword
```

### All Features Combined
```bash
python3 cli/pdf_scraper.py --pdf docs/manual.pdf --name myskill \
    --ocr \
    --extract-tables \
    --parallel \
    --workers 8 \
    --verbose
```

## 📊 Performance Benchmarks

| Pages | Sequential | Parallel (4 workers) | Parallel (8 workers) |
|-------|-----------|---------------------|---------------------|
| 50    | 25s       | 10s (2.5x)          | 8s (3.1x)           |
| 100   | 50s       | 18s (2.8x)          | 15s (3.3x)          |
| 500   | 4m 10s    | 1m 30s (2.8x)       | 1m 15s (3.3x)       |
| 1000  | 8m 20s    | 3m 00s (2.8x)       | 2m 30s (3.3x)       |

## 🧪 Testing

- **New Test Suite:** test_pdf_advanced_features.py (26 comprehensive tests)
  - OCR Support (5 tests)
  - Password Protection (4 tests)
  - Table Extraction (5 tests)
  - Parallel Processing (4 tests)
  - Intelligent Caching (5 tests)
  - Integration (3 tests)

- **Updated Tests:** test_pdf_extractor.py (23 tests, all passing)
- **Total PDF Tests:** 49/49 passing (100%)
- **Overall Project:** 142/142 tests passing (100%)

## 📖 Documentation

- **New Guide:** docs/PDF_ADVANCED_FEATURES.md (580 lines)
  - Complete usage guide
  - Installation instructions
  - Performance benchmarks
  - Best practices
  - Troubleshooting
  - API reference

## 📦 Dependencies

### New Required Dependencies
```bash
pip3 install Pillow==11.0.0 pytesseract==0.3.13
```

### Optional System Dependency
- Tesseract OCR engine (for scanned PDF support)
  - Ubuntu/Debian: sudo apt-get install tesseract-ocr
  - macOS: brew install tesseract

## 🔧 What's Changed

- Enhanced cli/pdf_extractor_poc.py with all advanced features
- Added cli/pdf_scraper.py for full workflow support
- Updated requirements.txt with new dependencies
- Updated README.md with advanced features showcase
- Updated docs/TESTING.md with comprehensive test documentation
- Added extensive PDF documentation (7 new guides)

## 🐛 Bug Fixes

- Fixed function signature mismatches in tests
- Updated language detection confidence thresholds
- Corrected chapter detection patterns
- Fixed code block merging with proper metadata

## 📝 Full Changelog

See CHANGELOG.md for complete version history.

---

**Full Diff:** https://github.com/yusufkaraaslan/Skill_Seekers/compare/v1.1.0...v1.2.0

---

This release represents a major step forward in PDF documentation processing capabilities. Now you can extract comprehensive skills from virtually any PDF, whether it's a modern digital document, a scanned paper book, or an encrypted technical manual! 🎉

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v1.2.0)

---

## v1.1.0: v1.1.0 - Parallel Scraping & Enhanced Testing 🚀
**Published:** 2025-10-22

# v1.1.0 - Parallel Scraping & Enhanced Testing 🚀

**Release Date:** October 22, 2025  
**Commits Since v1.0.0:** 29 commits  
**Contributors:** @yusufkaraaslan, @schuyler, @jjshanks, @justSteve

---

## 🎯 Highlights

This release brings **massive performance improvements** with parallel scraping, unlimited mode, and comprehensive test coverage improvements.

### ⚡ Performance Boost
- **8x faster scraping** with parallel mode (8 workers)
- **Unlimited scraping** mode for large documentation sites
- **Configurable rate limiting** for optimal speed vs politeness

### 🧪 Quality & Reliability
- **100+ new tests** added across CLI utilities
- **Test isolation fixes** for reliable CI/CD
- **All 158 tests passing** consistently

### 📚 New Configs
- **Ansible Core** documentation support
- **Claude Code** documentation support

---

## 🚀 Major Features

### Parallel Scraping Mode (#144)
Speed up documentation scraping with multiple workers:

```bash
# Use 4 workers (4x faster)
python3 cli/doc_scraper.py --config configs/react.json --workers 4

# Maximum speed (8 workers)
python3 cli/doc_scraper.py --config configs/godot.json --workers 8
```

**Performance:**
- 1 worker (default): 100 pages in ~50 seconds
- 4 workers: 100 pages in ~15 seconds (3.3x faster)
- 8 workers: 100 pages in ~8 seconds (6.25x faster)

**Thread-Safe Implementation:**
- Proper locking for shared state
- Safe URL deduplication
- Coordinated rate limiting across workers

### Unlimited Scraping Mode (#144)
Scrape entire documentation sites without page limits:

```bash
# Unlimited mode
python3 cli/doc_scraper.py --config configs/vue.json --unlimited

# Or via config
{
  "max_pages": null  // or -1
}
```

**Use Cases:**
- Complete documentation archives
- Large API reference sites
- Comprehensive framework docs

### Flexible Rate Limiting (#144)
Fine-tune scraping speed:

```bash
# Fast scraping (0.1s delay)
python3 cli/doc_scraper.py --config configs/react.json --rate-limit 0.1

# No rate limit (maximum speed, use carefully!)
python3 cli/doc_scraper.py --config configs/react.json --no-rate-limit

# Polite scraping (2s delay)
python3 cli/doc_scraper.py --config configs/react.json --rate-limit 2.0
```

---

## 🐛 Bug Fixes

### Critical Fixes
- **Fix flaky upload_skill tests** (0c55151) - Proper test isolation with cwd restoration
- **Fix CLI path references** (#145, 581dbc7) - All paths now use `cli/` prefix correctly
- **Fix anchor fragment handling** (#5) - Strip URL anchors to prevent duplicates
- **Fix broken configs** (#7) - Django, Laravel, Astro, Tailwind all working

### Test Infrastructure
- **Add comprehensive CLI utilities tests** (13fcce1) - 100+ new tests
- **Add parallel scraping tests** (7e94c27) - 17 tests for new features
- **Fix test isolation** (0c55151) - Tests no longer interfere with each other

---

## 📝 Documentation Updates

### New Guides
- **BULLETPROOF_QUICKSTART.md** (#8) - Complete beginner guide
- **TROUBLESHOOTING.md** (#8) - Comprehensive troubleshooting
- **Virtual environment setup** (#149) - Clean dependency management

### Documentation Improvements
- **Updated all CLI examples** (#145) - Use `cli/` directory consistently
- **Fixed path references** (66719cd) - Correct paths throughout docs
- **Added Ansible config docs** (#147) - Configuration examples

---

## 🆕 New Configurations

### Production Configs Added
- **`configs/ansible-core.json`** (#147) - Ansible Core documentation
- **`configs/claude-code.json`** (e5f4d10) - Claude Code documentation
- **`configs/laravel.json`** (#7) - Laravel 9.x framework

### Config Fixes
- ✅ **Django** - Fixed selector
- ✅ **Astro** - Fixed selector
- ✅ **Tailwind** - Fixed selector
- ✅ **All 11 configs verified working**

---

## 🧪 Testing Improvements

### Test Coverage
- **158 tests total** (up from ~50)
- **100% pass rate** in CI/CD
- **All platforms tested** (Ubuntu, macOS, Windows)

### New Test Suites
- `tests/test_parallel_scraping.py` - 17 tests for parallel mode
- `tests/test_upload_skill.py` - 7 tests for upload functionality
- `tests/test_utilities.py` - 24 tests for CLI utilities
- `tests/test_cli_paths.py` - Path reference validation

### Test Quality
- Proper setUp/tearDown in all test classes
- Test isolation maintained across suites
- No more flaky tests in CI

---

## 🔧 Technical Improvements

### Code Quality
- **Thread-safe parallel scraping** with proper locking
- **Improved error handling** in subprocess calls
- **Better exception propagation** in worker threads
- **Consistent path handling** across all CLI tools

### Performance Optimizations
- **Batch URL processing** for efficiency
- **Per-worker rate limiting** for fair resource usage
- **Optimized checkpoint saving** during scraping

### Developer Experience
- **Better CLI error messages**
- **Clearer progress indicators**
- **Improved debugging output**

---

## 📊 Statistics

### Changes
- **29 commits** since v1.0.0
- **5 pull requests** merged
- **8 issues** resolved
- **100+ new tests** added
- **3 new configs** added

### Files Changed
- `cli/doc_scraper.py` - Parallel scraping, unlimited mode
- `cli/enhance_skill.py` - Path fixes
- `cli/enhance_skill_local.py` - Path fixes
- `cli/package_skill.py` - Path fixes
- `tests/` - Comprehensive new test suites

### Contributors
Special thanks to:
- @schuyler - Claude Code config contribution
- @jjshanks - Anchor fragment fix
- @justSteve - Bug reports and validation testing

---

## 🚀 Upgrade Instructions

### From v1.0.0 to v1.1.0

```bash
# Pull latest changes
git pull origin main

# No breaking changes - fully backward compatible!
# All existing configs and commands work as before

# Try new features
python3 cli/doc_scraper.py --config configs/react.json --workers 4
python3 cli/doc_scraper.py --config configs/godot.json --unlimited
```

### New Dependencies
No new dependencies required! Still just:
```bash
pip3 install requests beautifulsoup4
```

---

## 🔜 What's Next

### Planned for v1.2.0
- **GitHub repository scraping** (#54, #55, #62)
- **Enhanced MCP server tools** (#139)
- **Config validation improvements**
- **More preset configurations**

See our [FLEXIBLE_ROADMAP.md](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/FLEXIBLE_ROADMAP.md) for the complete feature list.

---

## 📋 Full Changelog

### Features
- Add parallel scraping with multiple workers (#144)
- Add unlimited scraping mode (#144)
- Add configurable rate limiting (#144)
- Add Ansible Core config (#147)
- Add Claude Code config (e5f4d10)
- Add virtual environment setup (#149)

### Bug Fixes
- Fix flaky upload_skill tests (0c55151)
- Fix CLI path references throughout codebase (#145)
- Fix anchor fragment handling (#5)
- Fix broken configs for Django, Laravel, Astro, Tailwind (#7)
- Fix test isolation issues (0c55151)

### Documentation
- Add BULLETPROOF_QUICKSTART.md (#8)
- Add TROUBLESHOOTING.md (#8)
- Update all CLI examples to use cli/ directory (#145)
- Fix path references in documentation (66719cd)

### Tests
- Add comprehensive CLI utilities tests (13fcce1)
- Add parallel scraping tests (7e94c27)
- Add CLI path validation tests (c031865)
- Fix test isolation with proper setUp/tearDown (0c55151)

### Closed Issues
- #117 - Tasks already complete
- #125 - Tasks already complete
- #146 - CLI path reference bug
- #147 - Ansible config request
- #149 - Virtual environment setup

---

## 🙏 Thank You!

Thank you to everyone who contributed, tested, reported bugs, and provided feedback. Your input makes Skill Seekers better! 🎉

**Feedback?** Open an issue at https://github.com/yusufkaraaslan/Skill_Seekers/issues

**Questions?** Check our docs at https://github.com/yusufkaraaslan/Skill_Seekers

---

**Full Diff:** https://github.com/yusufkaraaslan/Skill_Seekers/compare/v1.0.0...v1.1.0

[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v1.1.0)

---

## v1.0.0: v1.0.0 - Production Ready 🚀
**Published:** 2025-10-19

# Release v1.0.0 - Production Ready 🚀

First production-ready release of Skill Seekers!

## 🎉 Major Features

### Smart Auto-Upload
- Automatic skill upload with API key detection
- Graceful fallback to manual instructions
- Cross-platform folder opening
- New `upload_skill.py` CLI tool

### 9 MCP Tools for Claude Code
1. list_configs
2. generate_config
3. validate_config
4. estimate_pages
5. scrape_docs
6. package_skill (enhanced with auto-upload)
7. **upload_skill (NEW!)**
8. split_config
9. generate_router

### Large Documentation Support
- Handle 10K-40K+ page documentation
- Intelligent config splitting
- Router/hub skill generation
- Checkpoint/resume for long scrapes
- Parallel scraping support

## ✨ What's New

- ✅ Smart API key detection and auto-upload
- ✅ Enhanced package_skill with --upload flag
- ✅ Cross-platform utilities (macOS/Linux/Windows)
- ✅ Improved error messages and UX
- ✅ Complete test coverage (14/14 tests passing)

## 🐛 Bug Fixes

- Fixed missing `import os` in mcp/server.py
- Fixed package_skill.py exit codes
- Improved error handling throughout

## 📚 Documentation

- All documentation updated to reflect 9 tools
- Enhanced upload guide
- MCP setup guide improvements
- Comprehensive test documentation
- New CHANGELOG.md
- New CONTRIBUTING.md

## 📦 Installation

```bash
# Install dependencies
pip3 install requests beautifulsoup4

# Optional: MCP integration
./setup_mcp.sh

# Optional: API-based features
pip3 install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

## 🚀 Quick Start

```bash
# Scrape React docs
python3 cli/doc_scraper.py --config configs/react.json --enhance-local

# Package and upload
python3 cli/package_skill.py output/react/ --upload
```

## 🧪 Testing

- **Total Tests:** 14/14 PASSED ✅
- **CLI Tests:** 8/8 ✅
- **MCP Tests:** 6/6 ✅
- **Pass Rate:** 100%

## 📊 Statistics

- **Files Changed:** 49
- **Lines Added:** +7,980
- **Lines Removed:** -296
- **New Features:** 10+
- **Bug Fixes:** 3

## 🔗 Links

- [Documentation](https://github.com/yusufkaraaslan/Skill_Seekers#readme)
- [MCP Setup Guide](docs/MCP_SETUP.md)
- [Upload Guide](docs/UPLOAD_GUIDE.md)
- [Large Documentation Guide](docs/LARGE_DOCUMENTATION.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

**Full Changelog:** [af87572...7aa5f0d](https://github.com/yusufkaraaslan/Skill_Seekers/compare/af87572...7aa5f0d)


[View on GitHub](https://github.com/yusufkaraaslan/Skill_Seekers/releases/tag/v1.0.0)

---

