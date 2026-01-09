# Unsloth - Export

**Pages:** 5

---

## (1) Saving to GGUF / merging to 16bit for vLLM

**URL:** llms-txt#(1)-saving-to-gguf-/-merging-to-16bit-for-vllm

---

## Clone and build

**URL:** llms-txt#clone-and-build

**Contents:**
  - Docker
  - uv
  - Conda or mamba (Advanced)
  - WSL-Specific Notes

pip install ninja
export TORCH_CUDA_ARCH_LIST="12.0"
git clone --depth=1 https://github.com/facebookresearch/xformers --recursive
cd xformers && python setup.py install && cd ..
bash
uv pip install unsloth
bash
   curl -LsSf https://astral.sh/uv/install.sh | sh && source $HOME/.local/bin/env
   bash
   mkdir 'unsloth-blackwell' && cd 'unsloth-blackwell'
   uv venv .venv --python=3.12 --seed
   source .venv/bin/activate
   bash
   uv pip install -U vllm --torch-backend=cu128
   bash
   uv pip install unsloth unsloth_zoo bitsandbytes
   bash
   uv pip install -qqq \
   "unsloth_zoo[base] @ git+https://github.com/unslothai/unsloth-zoo" \
   "unsloth[base] @ git+https://github.com/unslothai/unsloth"
   bash
   # First uninstall xformers installed by previous libraries
   pip uninstall xformers -y

# Clone and build
   pip install ninja
   export TORCH_CUDA_ARCH_LIST="12.0"
   git clone --depth=1 https://github.com/facebookresearch/xformers --recursive
   cd xformers && python setup.py install && cd ..
   bash
   uv pip install -U transformers
   bash
   curl -L -O "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
   bash
   bash Miniforge3-$(uname)-$(uname -m).sh
   bash
   conda create --name unsloth-blackwell python==3.12 -y
   bash
   conda activate unsloth-blackwell
   bash
   pip install -U vllm --extra-index-url https://download.pytorch.org/whl/cu128
   bash
   pip install unsloth unsloth_zoo bitsandbytes
   bash
   # First uninstall xformers installed by previous libraries
   pip uninstall xformers -y

# Clone and build
   pip install ninja
   export TORCH_CUDA_ARCH_LIST="12.0"
   git clone --depth=1 https://github.com/facebookresearch/xformers --recursive
   cd xformers && python setup.py install && cd ..
   bash
   pip install -U triton>=3.3.1
   bash
   uv pip install -U transformers
   bash
   # Create or edit .wslconfig in your Windows user directory
   # (typically C:\Users\YourUsername\.wslconfig)

# Add these lines to the file
   [wsl2]
   memory=16GB  # Minimum 16GB recommended for xformers compilation
   processors=4  # Adjust based on your CPU cores
   swap=2GB
   localhostForwarding=true
   powershell
   wsl --shutdown
   bash
   # Set CUDA architecture for Blackwell GPUs
   export TORCH_CUDA_ARCH_LIST="12.0"

# Install xformers from source with optimized build flags
   pip install -v --no-build-isolation -U git+https://github.com/facebookresearch/xformers.git@main#egg=xformers
   ```

The `--no-build-isolation` flag helps avoid potential build issues in WSL environments.

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

### Docker

[**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth) is Unsloth's only Docker image. For Blackwell and 50-series GPUs, use this same image - no separate image needed.

For installation instructions, please follow our [Unsloth Docker guide](https://docs.unsloth.ai/new/how-to-fine-tune-llms-with-unsloth-and-docker).

### uv
```

Example 2 (unknown):
```unknown
#### uv (Advanced)

The installation order is important, since we want the overwrite bundled dependencies with specific versions (namely, `xformers` and `triton`).

1. I prefer to use `uv` over `pip` as it's faster and better for resolving dependencies, especially for libraries which depend on `torch` but for which a specific `CUDA` version is required per this scenario.

   Install `uv`
```

Example 3 (unknown):
```unknown
Create a project dir and venv:
```

Example 4 (unknown):
```unknown
2. Install `vllm`
```

---

## Helper functions to extract answers from different formats

**URL:** llms-txt#helper-functions-to-extract-answers-from-different-formats

def extract_xml_answer(text: str) -> str:
    answer = text.split("<answer>")[-1]
    answer = answer.split("</answer>")[0]
    return answer.strip()

def extract_hash_answer(text: str) -> str | None:
    if "####" not in text:
        return None
    return text.split("####")[1].strip()

---

## Save to 16-bit precision

**URL:** llms-txt#save-to-16-bit-precision

model.save_pretrained_merged("model", tokenizer, save_method="merged_16bit")
python

**Examples:**

Example 1 (unknown):
```unknown
**Pushing to Hugging Face Hub**

To share your model, we’ll push it to the Hugging Face Hub using the `push_to_hub_merged` method. This allows saving the model in multiple quantization formats.
```

---

## vLLM Engine Arguments

**URL:** llms-txt#vllm-engine-arguments

**Contents:**
  - :tada:Float8 Quantization
  - :shaved\_ice:LoRA Hot Swapping / Dynamic LoRAs

vLLM engine arguments, flags, options for serving models on vLLM.

<table><thead><tr><th width="212.9000244140625">Argument</th><th>Example and use-case</th></tr></thead><tbody><tr><td><strong><code>--gpu-memory-utilization</code></strong></td><td>Default 0.9. How much VRAM usage vLLM can use. Reduce if going out of memory. Try setting this to 0.95 or 0.97.</td></tr><tr><td><strong><code>--max-model-len</code></strong></td><td>Set maximum sequence length. Reduce this if going out of memory! For example set <strong><code>--max-model-len 32768</code></strong> to use only 32K sequence lengths.</td></tr><tr><td><strong><code>--quantization</code></strong></td><td>Use fp8 for dynamic float8 quantization. Use this in tandem with <strong><code>--kv-cache-dtype</code></strong> fp8 to enable float8 KV cache as well.</td></tr><tr><td><strong><code>--kv-cache-dtype</code></strong></td><td>Use <code>fp8</code> for float8 KV cache to reduce memory usage by 50%.</td></tr><tr><td><strong><code>--port</code></strong></td><td>Default is 8000. How to access vLLM's localhost ie http://localhost:8000</td></tr><tr><td><strong><code>--api-key</code></strong></td><td>Optional - Set the password (or no password) to access the model.</td></tr><tr><td><strong><code>--tensor-parallel-size</code></strong></td><td>Default is 1. Splits model across tensors. Set this to how many GPUs you are using - if you have 4, set this to 4. 8, then 8. You should have NCCL, otherwise this might be slow.</td></tr><tr><td><strong><code>--pipeline-parallel-size</code></strong></td><td>Default is 1. Splits model across layers. Use this with <strong><code>--pipeline-parallel-size</code></strong> where TP is used within each node, and PP is used across multi-node setups (set PP to number of nodes)</td></tr><tr><td><strong><code>--enable-lora</code></strong></td><td>Enables LoRA serving. Useful for serving Unsloth finetuned LoRAs.</td></tr><tr><td><strong><code>--max-loras</code></strong></td><td>How many LoRAs you want to serve at 1 time. Set this to 1 for 1 LoRA, or say 16. This is a queue so LoRAs can be hot-swapped.</td></tr><tr><td><strong><code>--max-lora-rank</code></strong></td><td>Maximum rank of all LoRAs. Possible choices are <code>8</code>, <code>16</code>, <code>32</code>, <code>64</code>, <code>128</code>, <code>256</code>, <code>320</code>, <code>512</code></td></tr><tr><td><strong><code>--dtype</code></strong></td><td>Allows <code>auto</code>, <code>bfloat16</code>, <code>float16</code> Float8 and other quantizations use a different flag - see <code>--quantization</code></td></tr><tr><td><strong><code>--tokenizer</code></strong></td><td>Specify the tokenizer path like <code>unsloth/gpt-oss-20b</code> if the served model has a different tokenizer.</td></tr><tr><td><strong><code>--hf-token</code></strong></td><td>Add your HuggingFace token if needed for gated models</td></tr><tr><td><strong><code>--swap-space</code></strong></td><td>Default is 4GB. CPU offloading usage. Reduce if you have VRAM, or increase for low memory GPUs.</td></tr><tr><td><strong><code>--seed</code></strong></td><td>Default is 0 for vLLM</td></tr><tr><td><strong><code>--disable-log-stats</code></strong></td><td>Disables logging like throughput, server requests.</td></tr><tr><td><strong><code>--enforce-eager</code></strong></td><td>Disables compilation. Faster to load, but slower for inference.</td></tr><tr><td><strong><code>--disable-cascade-attn</code></strong></td><td>Useful for Reinforcement Learning runs for vLLM &#x3C; 0.11.0, as Cascade Attention was slightly buggy on A100 GPUs (Unsloth fixes this)</td></tr></tbody></table>

### :tada:Float8 Quantization

For example to host Llama 3.3 70B Instruct (supports 128K context length) with Float8 KV Cache and quantization, try:

### :shaved\_ice:LoRA Hot Swapping / Dynamic LoRAs

To enable LoRA serving for at most 4 LoRAs at 1 time (these are hot swapped / changed), first set the environment flag to allow hot swapping:

See our [lora-hot-swapping-guide](https://docs.unsloth.ai/basics/inference-and-deployment/vllm-guide/lora-hot-swapping-guide "mention") for more details.

**Examples:**

Example 1 (bash):
```bash
vllm serve unsloth/Llama-3.3-70B-Instruct \
    --quantization fp8 \
    --kv-cache-dtype fp8
    --gpu-memory-utilization 0.97 \
    --max-model-len 65536
```

---
