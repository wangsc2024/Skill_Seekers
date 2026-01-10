---
name: unsloth
description: Unsloth is a library for 2-5x faster LLM fine-tuning with 80% less memory. Use this skill when fine-tuning language models (Llama, Mistral, Gemma, Qwen, DeepSeek, Phi), optimizing training with LoRA/QLoRA, handling long context (up to 500K tokens), multi-GPU training, vision model fine-tuning, or exporting to GGUF/vLLM formats.
---

# Unsloth Skill

Comprehensive assistance with unsloth development, generated from official documentation.

## When to Use This Skill

This skill should be triggered when:
- Working with unsloth
- Asking about unsloth features or APIs
- Implementing unsloth solutions
- Debugging unsloth code
- Learning unsloth best practices

## Quick Reference

### Common Patterns

*Quick reference patterns will be added as you use the skill.*

### Example Code Patterns

**Example 1** (bash):
```bash
conda create --name unsloth_env \
    python=3.11 \
    pytorch-cuda=12.1 \
    pytorch cudatoolkit xformers -c pytorch -c nvidia -c xformers \
    -y
conda activate unsloth_env

pip install unsloth
```

**Example 2** (bash):
```bash
docker run -d -e JUPYTER_PASSWORD="mypassword" \
  -p 8888:8888 -p 2222:22 \
  -v $(pwd)/work:/workspace/work \
  --gpus all \
  unsloth/unsloth
```

**Example 3** (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

**Example 4** (bash):
```bash
apt install python3.10-venv python3.11-venv python3.12-venv python3.13-venv -y

python -m venv unsloth_env
source unsloth_env/bin/activate
```

**Example 5** (bash):
```bash
pip install --upgrade torch==2.8.0 pytorch-triton-rocm torchvision torchaudio torchao==0.13.0 xformers --index-url https://download.pytorch.org/whl/rocm6.4
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **datasets.md** - Datasets documentation
- **export.md** - Export documentation
- **fine_tuning.md** - Fine Tuning documentation
- **getting_started.md** - Getting Started documentation
- **inference.md** - Inference documentation
- **models.md** - Models documentation
- **optimization.md** - Optimization documentation
- **other.md** - Other documentation
- **vision.md** - Vision documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
The quick reference section above contains common patterns extracted from the official docs.

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed explanations
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, boilerplate, or example projects here.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from common usage examples in the docs

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
