# Unsloth - Inference

**Pages:** 16

---

## Cogito v2.1: How to Run Locally

**URL:** llms-txt#cogito-v2.1:-how-to-run-locally

**Contents:**
- :gem: Model Sizes and Uploads
- 🐳 Run Cogito 671B MoE in llama.cpp

Cogito v2.1 LLMs are one of the strongest open models in the world trained with IDA. Also v1 comes in 4 sizes: 70B, 109B, 405B and 671B, allowing you to select which size best matches your hardware.

{% hint style="success" %}
Deep Cogito v2.1 is an updated 671B MoE that is the most powerful open weights model as of 19 November 2025.
{% endhint %}

Cogito v2.1 comes in 1 671B MoE size, whilst Cogito v2 Preview is [Deep Cogito](https://www.deepcogito.com/)'s release of models spans 4 model sizes ranging from 70B to 671B. By using **IDA (Iterated Distillation & Amplification)**, these models are trained with the model internalizing the reasoning process using iterative policy improvement, rather than simply searching longer at inference time (like DeepSeek R1).

Deep Cogito is based in [San Fransisco, USA](https://techcrunch.com/2025/04/08/deep-cogito-emerges-from-stealth-with-hybrid-ai-reasoning-models/) (like Unsloth :flag\_us:) and we're excited to provide quantized dynamic models for all 4 model sizes! All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and KL Divergence performance, meaning you can run & fine-tune quantized these LLMs with minimal accuracy loss!

**Tutorials navigation:**

<a href="https://docs.unsloth.ai/basics/tutorials-how-to-fine-tune-and-run-llms/cogito-v2-how-to-run-locally#run-cogito-671b-moe-in-llama.cpp" class="button secondary">Run 671B MoE</a><a href="https://docs.unsloth.ai/basics/tutorials-how-to-fine-tune-and-run-llms/cogito-v2-how-to-run-locally#run-cogito-109b-moe-in-llama.cpp" class="button secondary">Run 109B MoE</a><a href="https://docs.unsloth.ai/basics/tutorials-how-to-fine-tune-and-run-llms/cogito-v2-how-to-run-locally#run-cogito-405b-dense-in-llama.cpp" class="button secondary">Run 405B Dense</a><a href="https://docs.unsloth.ai/basics/tutorials-how-to-fine-tune-and-run-llms/cogito-v2-how-to-run-locally#run-cogito-70b-dense-in-llama.cpp" class="button secondary">Run 70B Dense</a>

{% hint style="success" %}
Choose which model size fits your hardware! We upload 1.58bit to 16bit variants for all 4 model sizes!
{% endhint %}

## :gem: Model Sizes and Uploads

There are 4 model sizes:

1. 2 Dense models based off from Llama - 70B and 405B
2. 2 MoE models based off from Llama 4 Scout (109B) and DeepSeek R1 (671B)

<table data-full-width="false"><thead><tr><th>Model Sizes</th><th width="256.9999694824219">Recommended Quant &#x26; Link</th><th>Disk Size</th><th>Architecture</th></tr></thead><tbody><tr><td>70B Dense</td><td><a href="https://huggingface.co/unsloth/cogito-v2-preview-llama-70B-GGUF">UD-Q4_K_XL</a></td><td><strong>44GB</strong></td><td>Llama 3 70B</td></tr><tr><td>109B MoE</td><td><a href="https://huggingface.co/unsloth/cogito-v2-preview-llama-109B-MoE-GGUF">UD-Q3_K_XL</a></td><td><strong>50GB</strong></td><td>Llama 4 Scout</td></tr><tr><td>405B Dense</td><td><a href="https://huggingface.co/unsloth/cogito-v2-preview-llama-405B-GGUF">UD-Q2_K_XL</a></td><td><strong>152GB</strong></td><td>Llama 3 405B</td></tr><tr><td>671B MoE</td><td><a href="https://huggingface.co/unsloth/cogito-v2-preview-deepseek-671B-MoE-GGUF">UD-Q2_K_XL</a></td><td><strong>251GB</strong></td><td>DeepSeek R1</td></tr></tbody></table>

{% hint style="success" %}
Though not necessary, for the best performance, have your VRAM + RAM combined = to the size of the quant you're downloading. If you have less VRAM + RAM, then the quant will still function, just be much slower.
{% endhint %}

## 🐳 Run Cogito 671B MoE in llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% code overflow="wrap" %}

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:IQ1\_S) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location.

{% hint style="success" %}
Please try out `-ot ".ffn_.*_exps.=CPU"` to offload all MoE layers to the CPU! This effectively allows you to fit all non MoE layers on 1 GPU, improving generation speeds. You can customize the regex expression to fit more layers if you have more GPU capacity.

If you have a bit more GPU memory, try `-ot ".ffn_(up|down)_exps.=CPU"` This offloads up and down projection MoE layers.

Try `-ot ".ffn_(up)_exps.=CPU"` if you have even more GPU memory. This offloads only up projection MoE layers.

And finally offload all layers via `-ot ".ffn_.*_exps.=CPU"` This uses the least VRAM.

You can also customize the regex, for example `-ot "\.(6|7|8|9|[0-9][0-9]|[0-9][0-9][0-9])\.ffn_(gate|up|down)_exps.=CPU"` means to offload gate, up and down MoE layers but only from the 6th layer onwards.
{% endhint %}

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-IQ1_S`(dynamic 1.78bit quant) or other quantized versions like `Q4_K_M` . We <mark style="background-color:green;">**recommend using our 2.7bit dynamic quant**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`UD-Q2_K_XL`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**to balance size and accuracy**</mark>. More versions at: <https://huggingface.co/unsloth/cogito-671b-v2.1-GGUF>

{% code overflow="wrap" %}

**Examples:**

Example 1 (shellscript):
```shellscript
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 2 (shellscript):
```shellscript
export LLAMA_CACHE="unsloth/cogito-671b-v2.1-GGUF"
./llama.cpp/llama-cli \
    -hf unsloth/cogito-671b-v2.1-GGUF:UD-Q2_K_XL \
    --n-gpu-layers 99 \
    --temp 0.6 \
    --top_p 0.95 \
    --min_p 0.01 \
    --ctx-size 16384 \
    --seed 3407 \
    --jinja \
    -ot ".ffn_.*_exps.=CPU"
```

---

## Devstral: How to Run & Fine-tune

**URL:** llms-txt#devstral:-how-to-run-&-fine-tune

**Contents:**
- 🖥️ **Running Devstral**
  - :gear: Official Recommended Settings
- :llama: Tutorial: How to Run Devstral in Ollama
- 📖 Tutorial: How to Run Devstral in llama.cpp <a href="#tutorial-how-to-run-llama-4-scout-in-llama.cpp" id="tutorial-how-to-run-llama-4-scout-in-llama.cpp"></a>

Run and fine-tune Mistral Devstral 1.1, including Small-2507 and 2505.

**Devstral-Small-2507** (Devstral 1.1) is Mistral's new agentic LLM for software engineering. It excels at tool-calling, exploring codebases, and powering coding agents. Mistral AI released the original 2505 version in May, 2025.

Finetuned from [**Mistral-Small-3.1**](https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503-GGUF), Devstral supports a 128k context window. Devstral Small 1.1 has improved performance, achieving a score of 53.6% performance on [SWE-bench verified](https://openai.com/index/introducing-swe-bench-verified/), making it (July 10, 2025) the #1 open model on the benchmark.

Unsloth Devstral 1.1 GGUFs contain additional <mark style="background-color:green;">**tool-calling support**</mark> and <mark style="background-color:green;">**chat template fixes**</mark>. Devstral 1.1 still works well with OpenHands but now also generalizes better to other prompts and coding environments.

As text-only, Devstral’s vision encoder was removed prior to fine-tuning. We've added [*<mark style="background-color:green;">**optional Vision support**</mark>*](#possible-vision-support) for the model.

{% hint style="success" %}
We also worked with Mistral behind the scenes to help debug, test and correct any possible bugs and issues! Make sure to **download Mistral's official downloads or Unsloth's GGUFs** / dynamic quants to get the **correct implementation** (ie correct system prompt, correct chat template etc)

Please use `--jinja` in llama.cpp to enable the system prompt!
{% endhint %}

All Devstral uploads use our Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) methodology, delivering the best performance on 5-shot MMLU and KL Divergence benchmarks. This means, you can run and fine-tune quantized Mistral LLMs with minimal accuracy loss!

#### **Devstral - Unsloth Dynamic** quants:

| Devstral 2507 (new)                                                                                                    | Devstral 2505                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| GGUF: [Devstral-Small-2507-GGUF](https://huggingface.co/unsloth/Devstral-Small-2507-GGUF)                              | [Devstral-Small-2505-GGUF](https://huggingface.co/unsloth/Devstral-Small-2505-GGUF)                         |
| 4-bit BnB: [Devstral-Small-2507-unsloth-bnb-4bit](https://huggingface.co/unsloth/Devstral-Small-2507-unsloth-bnb-4bit) | [Devstral-Small-2505-unsloth-bnb-4bit](https://huggingface.co/unsloth/Devstral-Small-2505-unsloth-bnb-4bit) |

## 🖥️ **Running Devstral**

### :gear: Official Recommended Settings

According to Mistral AI, these are the recommended settings for inference:

* <mark style="background-color:blue;">**Temperature from 0.0 to 0.15**</mark>
* Min\_P of 0.01 (optional, but 0.01 works well, llama.cpp default is 0.1)
* <mark style="background-color:orange;">**Use**</mark><mark style="background-color:orange;">**&#x20;**</mark><mark style="background-color:orange;">**`--jinja`**</mark><mark style="background-color:orange;">**&#x20;**</mark><mark style="background-color:orange;">**to enable the system prompt.**</mark>

**A system prompt is recommended**, and is a derivative of Open Hand's system prompt. The full system prompt is provided [here](https://huggingface.co/unsloth/Devstral-Small-2505/blob/main/SYSTEM_PROMPT.txt).

{% hint style="success" %}
Our dynamic uploads have the '`UD`' prefix in them. Those without are not dynamic however still utilize our calibration dataset.
{% endhint %}

## :llama: Tutorial: How to Run Devstral in Ollama

1. Install `ollama` if you haven't already!

2. Run the model with our dynamic quant. Note you can call `ollama serve &`in another terminal if it fails! We include all suggested parameters (temperature etc) in `params` in our Hugging Face upload!
3. Also Devstral supports 128K context lengths, so best to enable [**KV cache quantization**](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-set-the-quantization-type-for-the-kv-cache). We use 8bit quantization which saves 50% memory usage. You can also try `"q4_0"`

## 📖 Tutorial: How to Run Devstral in llama.cpp <a href="#tutorial-how-to-run-llama-4-scout-in-llama.cpp" id="tutorial-how-to-run-llama-4-scout-in-llama.cpp"></a>

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:Q4\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run`

3. **OR** download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions (like BF16 full precision).

**Examples:**

Example 1 (unknown):
```unknown
You are Devstral, a helpful agentic model trained by Mistral AI and using the OpenHands scaffold. You can interact with a computer to solve tasks.

<ROLE>
Your primary role is to assist users by executing commands, modifying code, and solving technical problems effectively. You should be thorough, methodical, and prioritize quality over speed.
* If the user asks a question, like "why is X happening", don't try to fix the problem. Just give an answer to the question.
</ROLE>

.... SYSTEM PROMPT CONTINUES ....
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 3 (bash):
```bash
export OLLAMA_KV_CACHE_TYPE="q8_0"
ollama run hf.co/unsloth/Devstral-Small-2507-GGUF:UD-Q4_K_XL
```

Example 4 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggerganov/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli
cp llama.cpp/build/bin/llama-* llama.cpp
```

---

## Generate new key pair

**URL:** llms-txt#generate-new-key-pair

ssh-keygen -t rsa -b 4096 -f ~/.ssh/container_key

---

## Generate output

**URL:** llms-txt#generate-output

model_outputs = llm.generate(model_input, sampling_param)

---

## Generate SSH key pair

**URL:** llms-txt#generate-ssh-key-pair

ssh-keygen -t rsa -b 4096 -f ~/.ssh/container_key

---

## GLM-4.6: Run Locally Guide

**URL:** llms-txt#glm-4.6:-run-locally-guide

**Contents:**
  - Unsloth Chat Template fixes
- :gear: Usage Guide
  - Recommended Settings
- Run GLM-4.6 Tutorials:
  - GLM-4.6V-Flash

A guide on how to run Z.ai GLM-4.6 and GLM-4.6V-Flash model on your own local device!

GLM-4.6 and **GLM-4.6V-Flash** are the latest reasoning models from **Z.ai**, achieving SOTA performance on coding and agent benchmarks while offering improved conversational chats. [**GLM-4.6V-Flash**](#glm-4.6v-flash) **the smaller 9B model was released in December, 2025 and you can run it now too.**

The full 355B parameter model requires **400GB** of disk space, while the Unsloth Dynamic 2-bit GGUF reduces the size to **135GB** (-**75%)**. [**GLM-4.6-GGUF**](https://huggingface.co/unsloth/GLM-4.6-GGUF)

{% hint style="success" %}
We did multiple [**chat template fixes**](#unsloth-chat-template-fixes) for GLM-4.6 to make `llama.cpp/llama-cli --jinja` work - please only use `--jinja` otherwise the output will be wrong!

You asked for benchmarks on our quants, so we’re showcasing Aider Polyglot results! Our Dynamic 3-bit DeepSeek V3.1 GGUF scores **75.6%**, surpassing many full-precision SOTA LLMs. [Read more.](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot)
{% endhint %}

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and Aider performance, meaning you can run & fine-tune quantized GLM LLMs with minimal accuracy loss.

**Tutorials navigation:**

<a href="#glm-4.6v-flash" class="button secondary">Run GLM-4.6V-Flash</a><a href="#glm-4.6" class="button secondary">Run GLM-4.6</a>

### Unsloth Chat Template fixes

One of the significant fixes we did addresses an issue with prompting GGUFs, where the second prompt wouldn’t work. We fixed this issue however, this problem still persists in GGUFs without our fixes. For example, when using any non-Unsloth GLM-4.6 GGUF, the first conversation works fine, but the second one breaks.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f1a25a7b2dbbabd5d04d079ae4dcf352bc326964%2Ftool-calling-on-glm-4-6-with-unsloths-ggufs-v0-oys0k2088nuf1.webp?alt=media" alt="" width="563"><figcaption></figcaption></figure>

We’ve resolved this in our chat template, so when using our version, conversations beyond the second (third, fourth, etc.) work without any errors. There are still some issues with tool-calling, which we haven’t fully investigated yet due to bandwidth limitations. We’ve already informed the GLM team about these remaining issues.

## :gear: Usage Guide

The 2-bit dynamic quant UD-Q2\_K\_XL uses 135GB of disk space - this works well in a **1x24GB card and 128GB of RAM** with MoE offloading. The 1-bit UD-TQ1 GGUF also **works natively in Ollama**!

{% hint style="info" %}
You must use `--jinja` for llama.cpp quants - this uses our [fixed chat templates](#chat-template-bug-fixes) and enables the correct template! You might get incorrect results if you do not use `--jinja`
{% endhint %}

The 4-bit quants will fit in a 1x 40GB GPU (with MoE layers offloaded to RAM). Expect around 5 tokens/s with this setup if you have bonus 165GB RAM as well. It is recommended to have at least 205GB RAM to run this 4-bit. For optimal performance you will need at least 205GB unified memory or 205GB combined RAM+VRAM for 5+ tokens/s. To learn how to increase generation speed and fit longer contexts, [read here](#improving-generation-speed).

{% hint style="success" %}
Though not a must, for best performance, have your VRAM + RAM combined equal to the size of the quant you're downloading. If not, hard drive / SSD offloading will work with llama.cpp, just inference will be slower.
{% endhint %}

### Recommended Settings

According to Z.ai, there are different settings for GLM-4.6V-Flash & GLM-4.6 inference:

| GLM-4.6V-Flash                                                              | GLM-4.6                                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| <mark style="background-color:green;">**temperature = 0.8**</mark>          | <mark style="background-color:green;">**temperature = 1.0**</mark>                      |
| <mark style="background-color:green;">**top\_p = 0.6**</mark> (recommended) | <mark style="background-color:green;">**top\_p = 0.95**</mark> (recommended for coding) |
| <mark style="background-color:green;">**top\_k = 2**</mark> (recommended)   | <mark style="background-color:green;">**top\_k = 40**</mark> (recommended for coding)   |
| **128K context length** or less                                             | **200K context length** or less                                                         |
| **repeat\_penalty = 1.1**                                                   |                                                                                         |
| **max\_generate\_tokens = 16,384**                                          | **max\_generate\_tokens = 16,384**                                                      |

* Use `--jinja` for llama.cpp variants - we **fixed some chat template issues as well!**

## Run GLM-4.6 Tutorials:

See our step-by-step guides for running [GLM-4.6V-Flash](#glm-4.6v-flash) and the large [GLM-4.6](#glm-4.6) models.

{% hint style="success" %}
**NEW as of Dec 16, 2025: GLM-4.6-V is now updated with vision support!**
{% endhint %}

#### ✨ Run in llama.cpp

{% stepper %}
{% step %}
Obtain the latest `llama.cpp` on [GitHub](https://github.com/ggml-org/llama.cpp). You can also use the build instructions below. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% step %}
If you want to use `llama.cpp` directly to load models, you can do the below: (:Q8\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location. Remember the model has only a maximum of 128K context length.

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-`Q4\_K\_XL (dynamic 4bit quant) or other quantized versions like `Q8_K_XL` .

**Examples:**

Example 1 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggerganov/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli llama-server
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 2 (bash):
```bash
export LLAMA_CACHE="unsloth/GLM-4.6V-Flash-GGUF"
./llama.cpp/llama-cli \
    --model GLM-4.6V-Flash-GGUF/UD-Q8_K_XL/GLM-4.6V-Flash-UD-Q8_K_XL.gguf \
    --n-gpu-layers 99 \
    --jinja \
    --ctx-size 16384 \
    --flash-attn on \
    --temp 0.8 \
    --top-p 0.6 \
    --top-k 2 \
    --ctx-size 16384 \
    --repeat_penalty 1.1 \
    -ot ".ffn_.*_exps.=CPU"
```

---

## GLM-4.7: How to Run Locally Guide

**URL:** llms-txt#glm-4.7:-how-to-run-locally-guide

**Contents:**
  - :gear: Usage Guide
  - Recommended Settings
- Run GLM-4.7 Tutorials:
  - ✨ Run in llama.cpp

A guide on how to run Z.ai GLM-4.7 model on your own local device!

GLM-4.7 is Z.ai’s latest thinking model, delivering stronger coding, agent, and chat performance than [GLM-4.6](https://docs.unsloth.ai/models/glm-4.6-how-to-run-locally). It achieves SOTA performance on on SWE-bench (73.8%, +5.8), SWE-bench Multilingual (66.7%, +12.9), and Terminal Bench 2.0 (41.0%, +16.5).

The full 355B parameter model requires **400GB** of disk space, while the Unsloth Dynamic 2-bit GGUF reduces the size to **134GB** (-**75%)**. [**GLM-4.7-GGUF**](https://huggingface.co/unsloth/GLM-4.7-GGUF)

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and Aider performance, meaning you can run & fine-tune quantized GLM LLMs with minimal accuracy loss.

### :gear: Usage Guide

The 2-bit dynamic quant UD-Q2\_K\_XL uses 135GB of disk space - this works well in a **1x24GB card and 128GB of RAM** with MoE offloading. The 1-bit UD-TQ1 GGUF also **works natively in Ollama**!

{% hint style="info" %}
You must use `--jinja` for llama.cpp quants - this uses our [fixed chat templates](#chat-template-bug-fixes) and enables the correct template! You might get incorrect results if you do not use `--jinja`
{% endhint %}

The 4-bit quants will fit in a 1x 40GB GPU (with MoE layers offloaded to RAM). Expect around 5 tokens/s with this setup if you have bonus 165GB RAM as well. It is recommended to have at least 205GB RAM to run this 4-bit. For optimal performance you will need at least 205GB unified memory or 205GB combined RAM+VRAM for 5+ tokens/s. To learn how to increase generation speed and fit longer contexts, [read here](#improving-generation-speed).

{% hint style="success" %}
Though not a must, for best performance, have your VRAM + RAM combined equal to the size of the quant you're downloading. If not, hard drive / SSD offloading will work with llama.cpp, just inference will be slower.
{% endhint %}

### Recommended Settings

Use distinct settings for different use cases. Recommended settings for default and multi-turn agentic use cases:

| Default Settings (Most Tasks)                                      | Terminal Bench, SWE Bench Verified                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| <mark style="background-color:green;">**temperature = 1.0**</mark> | <mark style="background-color:green;">**temperature = 0.7**</mark> |
| <mark style="background-color:green;">**top\_p = 0.95**</mark>     | <mark style="background-color:green;">**top\_p = 1.0**</mark>      |
| `131072` **max new tokens**                                        | `16384` **max new tokens**                                         |

* Use `--jinja` for llama.cpp variants - we **fixed some chat template issues as well!**
* **Maximum context window:** `131,072`

## Run GLM-4.7 Tutorials:

See our step-by-step guides for running GLM-4.7 in [Ollama](#run-in-ollama) and [llama.cpp](#run-in-llama.cpp).

### ✨ Run in llama.cpp

{% stepper %}
{% step %}
Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% step %}
If you want to use `llama.cpp` directly to load models, you can do the below: (:Q2\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location. Remember the model has only a maximum of 128K context length.

{% hint style="info" %}
Please try out `-ot ".ffn_.*_exps.=CPU"` to offload all MoE layers to the CPU! This effectively allows you to fit all non MoE layers on 1 GPU, improving generation speeds. You can customize the regex expression to fit more layers if you have more GPU capacity.

If you have a bit more GPU memory, try `-ot ".ffn_(up|down)_exps.=CPU"` This offloads up and down projection MoE layers.

Try `-ot ".ffn_(up)_exps.=CPU"` if you have even more GPU memory. This offloads only up projection MoE layers.

And finally offload all layers via `-ot ".ffn_.*_exps.=CPU"` This uses the least VRAM.

You can also customize the regex, for example `-ot "\.(6|7|8|9|[0-9][0-9]|[0-9][0-9][0-9])\.ffn_(gate|up|down)_exps.=CPU"` means to offload gate, up and down MoE layers but only from the 6th layer onwards.
{% endhint %}
{% endstep %}

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-`Q2\_K\_XL (dynamic 2bit quant) or other quantized versions like `Q4_K_XL` . We <mark style="background-color:green;">**recommend using our 2.7bit dynamic quant**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`UD-Q2_K_XL`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**to balance size and accuracy**</mark>.

**Examples:**

Example 1 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-mtmd-cli llama-server llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 2 (bash):
```bash
export LLAMA_CACHE="unsloth/GLM-4.7-GGUF"
./llama.cpp/llama-cli \
    --model GLM-4.7-GGUF/UD-Q2_K_XL/GLM-4.7-UD-Q2_K_XL-00001-of-00003.gguf \
    --n-gpu-layers 99 \
    --jinja \
    --ctx-size 16384 \
    --flash-attn on \
    --temp 1.0 \
    --top-p 0.95 \
    -ot ".ffn_.*_exps.=CPU"
```

---

## gpt-oss: How to Run Guide

**URL:** llms-txt#gpt-oss:-how-to-run-guide

**Contents:**
- :scroll:Unsloth fixes for gpt-oss
  - :1234: Precision issues
- 🖥️ **Running gpt-oss**
  - :gear: Recommended Settings
  - Run gpt-oss-20B

Run & fine-tune OpenAI's new open-source models!

OpenAI releases '**gpt-oss-120b'** and '**gpt-oss-20b'**, two SOTA open language models under the Apache 2.0 license. Both 128k context models outperform similarly sized open models in reasoning, tool use, and agentic tasks. You can now run & fine-tune them locally with Unsloth!

<a href="#run-gpt-oss-20b" class="button secondary">Run gpt-oss-20b</a><a href="#run-gpt-oss-120b" class="button secondary">Run gpt-oss-120b</a><a href="#fine-tuning-gpt-oss-with-unsloth" class="button primary">Fine-tune gpt-oss</a>

{% hint style="success" %}
[**Aug 28 update**](https://docs.unsloth.ai/models/long-context-gpt-oss-training#new-saving-to-gguf-vllm-after-gpt-oss-training)**:** You can now export/save your QLoRA fine-tuned gpt-oss model to llama.cpp, vLLM, HF etc.

We also introduced [Unsloth Flex Attention](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support) which enables **>8× longer context lengths**, **>50% less VRAM usage** and **>1.5× faster training** vs. all implementations. [Read more here](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support)
{% endhint %}

> [**Fine-tune**](#fine-tuning-gpt-oss-with-unsloth) **gpt-oss-20b for free with our** [**Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-Fine-tuning.ipynb)

Trained with [RL](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide), **gpt-oss-120b** rivals o4-mini and **gpt-oss-20b** rivals o3-mini. Both excel at function calling and CoT reasoning, surpassing o1 and GPT-4o.

#### **gpt-oss - Unsloth GGUFs:**

{% hint style="success" %}
**Includes Unsloth's** [**chat template fixes**](#unsloth-fixes-for-gpt-oss)**. For best results, use our uploads & train with Unsloth!**
{% endhint %}

* 20B: [gpt-oss-**20B**](https://huggingface.co/unsloth/gpt-oss-20b-GGUF)
* 120B: [gpt-oss-**120B**](https://huggingface.co/unsloth/gpt-oss-120b-GGUF)

## :scroll:Unsloth fixes for gpt-oss

{% hint style="info" %}
Some of our fixes were pushed upstream to OpenAI's official model on Hugging Face. [See](https://huggingface.co/openai/gpt-oss-20b/discussions/94/files)
{% endhint %}

OpenAI released a standalone parsing and tokenization library called [Harmony](https://github.com/openai/harmony) which allows one to tokenize conversations to OpenAI's preferred format for gpt-oss.

Inference engines generally use the jinja chat template instead and not the Harmony package, and we found some issues with them after comparing with Harmony directly. If you see below, the top is the correct rendered form as from Harmony. The below is the one rendered by the current jinja chat template. There are quite a few differences!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-9b377044965ac55a125d6c703ec1c50555157266%2FScreenshot%202025-08-08%20at%2008-19-49%20Untitled151.ipynb%20-%20Colab.png?alt=media" alt=""><figcaption></figcaption></figure>

We also made some functions to directly allow you to use OpenAI's Harmony library directly without a jinja chat template if you desire - you can simply parse in normal conversations like below:

Then use the `encode_conversations_with_harmony` function from Unsloth:

The harmony format includes multiple interesting things:

1. `reasoning_effort = "medium"` You can select low, medium or high, and this changes gpt-oss's reasoning budget - generally the higher the better the accuracy of the model.
2. `developer_instructions` is like a system prompt which you can add.
3. `model_identity` is best left alone - you can edit it, but we're unsure if custom ones will function.

We find multiple issues with current jinja chat templates (there exists multiple implementations across the ecosystem):

1. Function and tool calls are rendered with `tojson`, which is fine it's a dict, but if it's a string, speech marks and other **symbols become backslashed**.
2. There are some **extra new lines** in the jinja template on some boundaries.
3. Tool calling thoughts from the model should have the **`analysis` tag and not `final` tag**.
4. Other chat templates seem to not utilize `<|channel|>final` at all - one should use this for the final assistant message. You should not use this for thinking traces or tool calls.

Our chat templates for the GGUF, our BnB and BF16 uploads and all versions are fixed! For example when comparing both ours and Harmony's format, we get no different characters:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4c42f3d83194ea2fbe436670a550e1b6f148f4cd%2FScreenshot%202025-08-08%20at%2008-20-00%20Untitled151.ipynb%20-%20Colab.png?alt=media" alt=""><figcaption></figcaption></figure>

### :1234: Precision issues

We found multiple precision issues in Tesla T4 and float16 machines primarily since the model was trained using BF16, and so outliers and overflows existed. MXFP4 is not actually supported on Ampere and older GPUs, so Triton provides `tl.dot_scaled` for MXFP4 matrix multiplication. It upcasts the matrices to BF16 internaly on the fly.

We made a [MXFP4 inference notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/GPT_OSS_MXFP4_\(20B\)-Inference.ipynb) as well in Tesla T4 Colab!

{% hint style="info" %}
[Software emulation](https://triton-lang.org/main/python-api/generated/triton.language.dot_scaled.html) enables targeting hardware architectures without native microscaling operation support. Right now for such case, microscaled lhs/rhs are upcasted to `bf16` element type beforehand for dot computation,
{% endhint %}

We found if you use float16 as the mixed precision autocast data-type, you will get infinities after some time. To counteract this, we found doing the MoE in bfloat16, then leaving it in either bfloat16 or float32 precision. If older GPUs don't even have bfloat16 support (like T4), then float32 is used.

We also change all precisions of operations (like the router) to float32 for float16 machines.

## 🖥️ **Running gpt-oss**

Below are guides for the [20B](#run-gpt-oss-20b) and [120B](#run-gpt-oss-120b) variants of the model.

{% hint style="info" %}
Any quant smaller than F16, including 2-bit has minimal accuracy loss, since only some parts (e.g., attention layers) are lower bit while most remain full-precision. That’s why sizes are close to the F16 model; for example, the 2-bit (11.5 GB) version performs nearly the same as the full 16-bit (14 GB) one. Once llama.cpp supports better quantization for these models, we'll upload them ASAP.
{% endhint %}

The `gpt-oss` models from OpenAI include a feature that allows users to adjust the model's "reasoning effort." This gives you control over the trade-off between the model's performance and its response speed (latency) which by the amount of token the model will use to think.

The `gpt-oss` models offer three distinct levels of reasoning effort you can choose from:

* **Low**: Optimized for tasks that need very fast responses and don't require complex, multi-step reasoning.
* **Medium**: A balance between performance and speed.
* **High**: Provides the strongest reasoning performance for tasks that require it, though this results in higher latency.

### :gear: Recommended Settings

OpenAI recommends these inference settings for both models:

`temperature=1.0`, `top_p=1.0`, `top_k=0`

* <mark style="background-color:green;">**Temperature of 1.0**</mark>
* Top\_K = 0 (or experiment with 100 for possible better results)
* Top\_P = 1.0
* Recommended minimum context: 16,384
* Maximum context length window: 131,072

The end of sentence/generation token: EOS is `<|return|>`

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-920b641670a166258845bbe8152999983b1e68af%2Fgpt-oss-20b.svg?alt=media" alt=""><figcaption></figcaption></figure>

To achieve inference speeds of 6+ tokens per second for our Dynamic 4-bit quant, have at least **14GB of unified memory** (combined VRAM and RAM) or **14GB of system RAM** alone. As a rule of thumb, your available memory should match or exceed the size of the model you’re using. GGUF Link: [unsloth/gpt-oss-20b-GGUF](https://huggingface.co/unsloth/gpt-oss-20b-GGUF)

**NOTE:** The model can run on less memory than its total size, but this will slow down inference. Maximum memory is only needed for the fastest speeds.

{% hint style="info" %}
Follow the [**best practices above**](#recommended-settings). They're the same as the 120B model.
{% endhint %}

You can run the model on Google Colab, Docker, LM Studio or llama.cpp for now. See below:

> **You can run gpt-oss-20b for free with our** [**Google Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/GPT_OSS_MXFP4_\(20B\)-Inference.ipynb)

#### 🐋 Docker: Run gpt-oss-20b Tutorial

If you already have Docker desktop, all you need to do is run the command below and you're done:

#### :sparkles: Llama.cpp: Run gpt-oss-20b Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. You can directly pull from Hugging Face via:

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ).

**Examples:**

Example 1 (python):
```python
messages = [
    {"role" : "user", "content" : "What is 1+1?"},
    {"role" : "assistant", "content" : "2"},
    {"role": "user",  "content": "What's the temperature in San Francisco now? How about tomorrow? Today's date is 2024-09-30."},
    {"role": "assistant",  "content": "User asks: 'What is the weather in San Francisco?' We need to use get_current_temperature tool.", "thinking" : ""},
    {"role": "assistant", "content": "", "tool_calls": [{"name": "get_current_temperature", "arguments": '{"location": "San Francisco, California, United States", "unit": "celsius"}'}]},
    {"role": "tool", "name": "get_current_temperature", "content": '{"temperature": 19.9, "location": "San Francisco, California, United States", "unit": "celsius"}'},
]
```

Example 2 (python):
```python
from unsloth_zoo import encode_conversations_with_harmony

def encode_conversations_with_harmony(
    messages,
    reasoning_effort = "medium",
    add_generation_prompt = True,
    tool_calls = None,
    developer_instructions = None,
    model_identity = "You are ChatGPT, a large language model trained by OpenAI.",
)
```

Example 3 (unknown):
```unknown
<|start|>system<|message|>You are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2024-06\nCurrent date: 2025-08-05\n\nReasoning: medium\n\n# Valid channels: analysis, commentary, final. Channel must be included for every message.<|end|><|start|>user<|message|>Hello<|end|><|start|>assistant<|channel|>final<|message|>Hi there!<|end|><|start|>user<|message|>What is 1+1?<|end|><|start|>assistant
```

Example 4 (bash):
```bash
docker model run hf.co/unsloth/gpt-oss-20b-GGUF:F16
```

---

## gpt-oss Reinforcement Learning

**URL:** llms-txt#gpt-oss-reinforcement-learning

**Contents:**
- ⚡Making Inference Much Faster
- 🛠️ gpt-oss Flex Attention Issues and Quirks
  - 🔍 Flash Attention Investigation
- ⚠️ Can We Counter Reward Hacking?
- :trophy:Reward Hacking
- Tutorial: How to Train gpt-oss with RL

You can now train OpenAI [gpt-oss](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune) with RL and GRPO via [Unsloth](https://github.com/unslothai/unsloth). Unsloth now offers the **fastest inference** (3x faster), **lowest VRAM usage** (50% less) and **longest context** (8x longer) for gpt-oss RL vs. any implementation - with no accuracy degradation.\
\
Since reinforcement learning (RL) on gpt-oss isn't yet vLLM compatible, we had to rewrite the inference code from Transformers code to deliver 3x faster inference for gpt-oss at \~21 tokens/s. For BF16, Unsloth also achieves the fastest inference (\~30 tokens/s), especially relative to VRAM usage, using 50% less VRAM vs. any other RL implementation. We plan to support our [50% weight sharing feature](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl) once vLLM becomes compatible with RL.

* **Free notebook:** [**gpt-oss-20b GRPO Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb)\
  This notebook automatically creates **faster matrix multiplication kernels** and uses 4 new Unsloth reward functions. We also show how to [counteract reward-hacking](#can-we-counter-reward-hacking) which is one of RL's biggest challenges.\\

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0217fec82f064279c090618091109c6b36c724de%2FAuto%20generated.png?alt=media" alt=""><figcaption></figcaption></figure>

With Unsloth, you can train gpt-oss-20b with GRPO on 15GB VRAM and for **free** on Colab. We introduced embedding offloading which reduces usage by 1GB as well via `offload_embeddings`. Unloth's new inference runs faster on **any** GPU including A100, H100 and old T4's. gpt-oss-120b fits nicely on a 120GB VRAM GPU.

Unsloth is the only framework to support 4-bit RL for gpt-oss. All performance gains are due to Unsloth's unique [weight sharing](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide#what-unsloth-offers-for-rl), [Flex Attention](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl), [Standby](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl#unsloth-standby) and custom kernels.

{% hint style="warning" %}
Reminder: **Flash Attention 3 (FA3) is** [**unsuitable for gpt-oss**](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support) **training** since it currently does not support the backward pass for attention sinks, causing **incorrect training losses**. If you’re **not** using Unsloth, FA3 may be enabled by default, so please double-check it’s not in use!\
\
Disabling FA3 will incur **O(N^2)** memory usage as well, so Unsloth is the only RL framework to offer **O(N)** memory usage for gpt-oss via our Flex attention implementation.
{% endhint %}

## ⚡Making Inference Much Faster

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-6e9b6a2f7381de84ed6eeb0feedc566cd443acf3%2F5b957843-eb58-4778-8b90-f25767c51495.png?alt=media" alt=""><figcaption></figcaption></figure>

Inference is crucial in RL training, since we need it to generate candidate solutions before maximizing some reward function ([see here](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) for a more detailed explanation). To achieve the fastest inference speed for gpt-oss without vLLM, we rewrote Transformers inference code and integrated many innovations including custom algorithms like Unsloth [Flex Attention](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support), using special flags within `torch.compile` (like combo kernels). Our new inference code for gpt-oss was evaluated against an already optimized baseline (2x faster than native Transformers).

vLLM does not support RL for gpt-oss since it lacks BF16 training and LoRA support for gpt-oss. Without Unsloth, only training via full precision BF16 works, making memory use **800%+ higher**. Most frameworks enable FA3 (Flash Attention 3) by default (which reduces VRAM use & increases speed) **but this causes incorrect training loss**. See [Issue 1797](https://github.com/Dao-AILab/flash-attention/issues/1797) in the FA3 repo. You must disable FA3 though, since it'll prevent long-context training since FA3 uses O(N) memory usage, whilst naive attention will balloon with O(N^2) usage. So to enable attention sinks to be differentiable, we implemented [Unsloth Flex Attention](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/long-context-gpt-oss-training).

We evaluated gpt-oss RL inference by benchmarking BitsandBytes 4-bit and also did separate tests for BF16. Unsloth’s 4-bit inference is \~4x faster, and BF16 is also more efficient, especially in VRAM use.

The best part about Unsloth's gpt-oss RL is that it can work on any GPU, even those that do not support BF16. Our free gpt-oss-20b Colab notebooks use older 15GB T4 GPUs, so the inference examples work well!

## 🛠️ gpt-oss Flex Attention Issues and Quirks

We had to change our implementation for attention sinks as [described here](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/long-context-gpt-oss-training) to allow generation to work with left padding. We had to get the logsumexp and apply the sigmoid activation to alter the attention weights like below:

$$
A(X) = \sigma \bigg( \frac{1}{\sqrt{d}}QK^T \bigg)V \\

A(X) = \frac{\exp{\frac{1}{\sqrt{d}}QK^T}}{\sum{\exp{\frac{1}{\sqrt{d}}QK^T}}}V \\

\text{LSE} = \log{\sum{\exp{\frac{1}{\sqrt{d}}QK^T}}} \\

A\_{sinks}(X) = A(X) \odot \sigma (\text{LSE} - \text{sinks})
$$

Left padded masking during inference was also a tricky issue to deal with in gpt-oss. We found that we had to not only account for KV Cache prefill during generations of tokens, but also account for a unique amount of pad tokens in each prompt for batch generations which would change the way we would need to store the block mask. Example of such and example can be seen below:

**Normal Causal Mask:**

**For inference in general case (decoding)**

**If we naively use the same masking strategy, this'll fail:**

For generation (decoding phase), we usually only care about the last row of the attention matrix, since there’s just one query token attending to all previous key tokens. If we naively apply the causal mask (`q_idx ≥ k_idx`), this fails as our single query has index 0, while there are n\_k key tokens. To fix this, we need an offset in mask creation to decide which tokens to attend. But a naïve approach is slow, since offsets change each step, forcing mask and kernel regeneration. We solved this with cache and compile optimizations.

The harder part is batch generation. Sequences differ in length, so padding complicates mask creation. Flex Attention had a lot of [challenges](https://github.com/meta-pytorch/attention-gym/issues/15#issuecomment-2284148665) and dynamic masks are tricky. Worse, if not compiled, it falls back to eager attention which is slow and memory-heavy (quadratic vs. linear in sequence length).

> *Quote from* [*https://github.com/meta-pytorch/attention-gym/issues/15#issuecomment-2284148665*](https://github.com/meta-pytorch/attention-gym/issues/15#issuecomment-2284148665)
>
> You need to call this with \_compile=True. We essentially map your block mask over a full Q\_LEN x KV\_LEN matrix in order to produce the block mask. Without compile, we need to materialize this full thing, and it can cause OOMs on long sequences.
>
> As well, you need to run `flex_attention = torch.compile(flex_attention)`. Without compile, flex falls back to a non-fused eager implementation that is great for debugging, but it is much slower and materializes the full scores matrix.

Ultimately, the mask must dynamically handle prefill vs decode with the KV Cache, batch and padding tokens per sequence, remain `torch.compile` friendly, and support sliding windows.

### 🔍 Flash Attention Investigation

Another interesting direction we explored was trying to integrate Flash Attention. Its advantages are widely recognized, but one limitation is that it does not support attention sinks during the backward pass for gpt-oss. To work around this, we restructured the attention mechanism so that it operates solely on the attention output and the logsumexp values that FlashAttention readily provides. Given these benefits, it seemed like an obvious choice to try.

However, we soon began noticing issues. While the first few layers behaved as expected, the later layers, particularly layers 18 through 24, produced outputs that diverged significantly from the eager-mode implementation in transformers. Importantly, this discrepancy cannot be attributed to error accumulation, since the inputs to each method are identical at every layer. For further validation, we also compared the results against Unsloth **FlexAttention**.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1c7a04d20aa814cd04065001d59e338c27426f19%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

This needs further investigation into why only the last few layers show such a drastic difference between flash attention implementation vs. the others.

{% hint style="danger" %}
**Flash Attention 3 doesn't support the backwards pass for attention sinks**

FA3 is often enabled by default for most training packages (not Unsloth), but this is incorrect for gpt-oss. Using FA3 will make training loss completely wrong as FA3 doesn’t support gpt-oss backward passes for attention sinks. Many people are still unaware of this so please be cautious!
{% endhint %}

## ⚠️ Can We Counter Reward Hacking?

The ultimate goal of RL is to maximize some reward (say speed, revenue, some metric). But RL can **cheat.** When the RL algorithm learns a trick or exploits something to increase the reward, without actually doing the task at end, this is called "**Reward Hacking**".

It's the reason models learn to modify unit tests to pass coding challenges, and these are critical blockers for real world deployment. Some other good examples are from [Wikipedia](https://en.wikipedia.org/wiki/Reward_hacking).

<div align="center"><figure><img src="https://i.pinimg.com/originals/55/e0/1b/55e01b94a9c5546b61b59ae300811c83.gif" alt="" width="188"><figcaption></figcaption></figure></div>

In our [free gpt-oss RL notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) we explore how to counter reward hacking in a code generation setting and showcase tangible solutions to common error modes. We saw the model edit the timing function, outsource to other libraries, cache the results, and outright cheat. After countering, the result is our model generates genuinely optimized matrix multiplication kernels, not clever cheats.

## :trophy:Reward Hacking

Some common examples of reward hacking during RL include:

RL learns to use Numpy, Torch, other libraries, which calls optimized CUDA kernels. We can stop the RL algorithm from calling optimized code by inspecting if the generated code imports other non standard Python libraries.

#### Caching & Cheating

RL learns to cache the result of the output and RL learns to find the actual output by inspecting Python global variables.

We can stop the RL algorithm from using cached data by wiping the cache with a large fake matrix. We also have to benchmark carefully with multiple loops and turns.

RL learns to edit the timing function to make it output 0 time as passed. We can stop the RL algorithm from using global or cached variables by restricting it's `locals` and `globals`. We are also going to use `exec` to create the function, so we have to save the output to an empty dict. We also disallow global variable access via `types.FunctionType(f.__code__, {})`\\

## Tutorial: How to Train gpt-oss with RL

LLMs often struggle with tasks that involve complex environments. However, by applying [reinforcement learning](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) (RL) and designing a custom [reward function](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide#reward-functions-verifiers), these challenges can be overcome.

RL can be adapted for tasks such as auto kernel or strategy creation. This tutorial shows how to train **gpt-oss** with [**GRPO**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide#from-rlhf-ppo-to-grpo-and-rlvr) and Unsloth to autonomously beat 2048.

Our notebooks include step-by-step guides on how to navigate the whole process already.

| [2048 notebook](https://colab.research.google.com/github/openai/gpt-oss/blob/main/examples/reinforcement-fine-tuning.ipynb) (Official OpenAI example) | [Kernel generation notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |

**What you’ll build:**

* Train gpt-oss-20b so the model can automatically win 2048
* Create a minimal 2048 environment the model can interact with
* Define **reward functions** that:
  1. Check the generated strategy compiles and runs,
  2. Prevent reward hacking (disallow external imports), and
  3. Reward actual game success
* Run inference and export the model (MXFP4 4‑bit or merged FP16)

{% hint style="info" %}
**Hardware:** The 2048 example runs on a free Colab T4, but training will be slow. A100/H100 is much faster. 4‑bit loading + LoRA lets you fit a 20B model into modest VRAM
{% endhint %}

**Examples:**

Example 1 (unknown):
```unknown
k0 k1 k2 k3 k4   <-- keys
q0  X
q1  X  X
q2  X  X  X
q3  X  X  X  X
q4  X  X  X  X  X   <-- last query row (most important for decoding)
```

Example 2 (unknown):
```unknown
k0 k1 k2 k3 k4
q0
q1
q2
q3
q4   X  X  X  X  X
```

Example 3 (unknown):
```unknown
k0 k1 k2 k3 k4
q0
q1
q2
q3
q4   X   (note that q4 has q_idx=0 as this is the first query in current setup)
```

---

## How to Run Local LLMs with Docker: Step-by-Step Guide

**URL:** llms-txt#how-to-run-local-llms-with-docker:-step-by-step-guide

**Contents:**
- :gear: Hardware Info + Performance
- ⚡ Step-by-Step Tutorials
  - Method #1: Docker Terminal
  - Method #2: Docker Desktop (no code)
  - What Is the Docker Model Runner?

Learn how to run Large Language Models (LLMs) with Docker & Unsloth on your local device.

You can now run any model, including Unsloth [Dynamic GGUFs](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs), on Mac, Windows or Linux with a single line of code or **no code** at all. We collabed with Docker to simplify model deployment, and Unsloth now powers most GGUF models on Docker.

Before you start, make sure to look over [hardware requirements](#hardware-info--performance) and [our tips](#hardware-info--performance) for optimizing performance when running LLMs on your device.

<a href="#method-1-docker-terminal" class="button primary">Docker Terminal Tutorial</a><a href="#method-2-docker-desktop-no-code" class="button primary">Docker no-code Tutorial</a>

To get started, run OpenAI [gpt-oss](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune) with a single command:

Or to run a specific [Unsloth model](https://docs.unsloth.ai/get-started/unsloth-model-catalog) / quant from Hugging Face:

{% hint style="success" %}
You don’t need Docker Desktop, Docker CE is enough to run models.
{% endhint %}

#### **Why Unsloth + Docker?**

We collab with model labs like Google Gemma to fix model bugs and boost accuracy. Our Dynamic GGUFs consistently outperform other quant methods, giving you high-accuracy, efficient inference.

If you use Docker, you can run models instantly with zero setup. Docker uses [Docker Model Runner](https://github.com/docker/model-runner) (DMR), which lets you run LLMs as easily as containers with no dependency issues. DMR uses Unsloth models and `llama.cpp` under the hood for fast, efficient, up-to-date inference.

## :gear: Hardware Info + Performance

For the best performance, aim for your VRAM + RAM combined to be at least equal to the size of the quantized model you're downloading. If you have less, the model will still run, but significantly slower.

Make sure your device also has enough disk space to store the model. If your model only barely fits in memory, you can expect around \~5 tokens/s, depending on model size.

Having extra RAM/VRAM available will improve inference speed, and additional VRAM will enable the biggest performance boost (provided the entire model fits)

{% hint style="info" %}
**Example:** If you're downloading gpt-oss-20b (F16) and the model is 13.8 GB, ensure that your disk space and RAM + VRAM > 13.8 GB.
{% endhint %}

**Quantization recommendations:**

* For models under 30B parameters, use at least 4-bit (Q4).
* For models 70B parameters or larger, use a minimum of 2-bit quantization (e.g., UD\_Q2\_K\_XL).

## ⚡ Step-by-Step Tutorials

Below are **two ways** to run models with Docker: one using the [terminal](#method-1-docker-terminal), and the other using [Docker Desktop](#method-2-docker-desktop-no-code) with no code:

### Method #1: Docker Terminal

{% stepper %}
{% step %}

Docker Model Runner is already available in **both** [Docker Desktop](https://docs.docker.com/ai/model-runner/get-started/#docker-desktop) and [**Docker CE**](https://docs.docker.com/ai/model-runner/get-started/#docker-engine)**.**
{% endstep %}

Decide on a model to run, then run the command via terminal.

* Browse the verified catalog of trusted models available on [Docker Hub](https://hub.docker.com/r/ai) or [Unsloth's Hugging Face](https://huggingface.co/unsloth) page.
* Go to Terminal to run the commands. To verify if you have `docker` installed, you can type 'docker' and enter.
* Docker Hub defaults to running Unsloth Dynamic 4-bit, however you can select your own quantization level (see step #3).

For example, to run OpenAI `gpt-oss-20b` in a single command:

Or to run a specific [Unsloth](https://docs.unsloth.ai/get-started/unsloth-model-catalog) gpt-oss quant from Hugging Face:

**This is how running gpt-oss-20b should look via CLI:**

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FNQQGqQfLuX2a40i07Es1%2Funknown.png?alt=media&#x26;token=6006e370-a298-4e5f-af9f-5c4e8c4a0fc8" alt="" width="563"><figcaption><p>gpt-oss-20b from Docker Hub</p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FFtzowkLonKo4N2LzEnhe%2Fgptoss%20ud8kxl.png?alt=media&#x26;token=08eb6244-0626-4ad8-adbe-f5c4e5aa6d72" alt="" width="563"><figcaption><p>gpt-oss-20b with Unsloths' UD-Q8_K_XL quantization</p></figcaption></figure></div>
{% endstep %}

#### To run a specific quantization level:

If you want to run a specific quantization of a model, append `:` and the quantization name to the model (e.g., `Q4` for Docker or `UD-Q4_K_XL`). You can view all available quantizations on each model’s Docker Hub page. e.g. see the listed quantizations for gpt-oss [here](https://hub.docker.com/r/ai/gpt-oss#gptoss).

The same applies to Unsloth quants on Hugging Face: visit the [model’s HF page](https://huggingface.co/unsloth/gpt-oss-20b-GGUF?show_file_info=gpt-oss-20b-Q2_K_L.gguf), choose a quantization, then run something like: `docker model run hf.co/unsloth/gpt-oss-20b-GGUF:Q2_K_L`

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FI7MrphUugkU8eZ1f7lJz%2FScreenshot%202025-11-16%20at%2010.52.25%E2%80%AFPM.png?alt=media&#x26;token=ae777fdb-258e-46d0-b06e-b68434f7fa58" alt="" width="563"><figcaption><p>gpt-oss quantization levels on <a href="https://hub.docker.com/r/ai/gpt-oss#gptoss">Docker Hub</a></p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F73UWIs9VAZ6Iz1omgZSm%2FScreenshot%202025-11-16%20at%2010.54.53%E2%80%AFPM.png?alt=media&#x26;token=e8dee7f3-1b8b-4dda-a455-26df58102d16" alt="" width="563"><figcaption><p>Unsloth gpt-oss quantization levels on<a href="https://huggingface.co/unsloth/gpt-oss-20b-GGUF"> Hugging Face</a></p></figcaption></figure></div>
{% endstep %}
{% endstepper %}

### Method #2: Docker Desktop (no code)

{% stepper %}
{% step %}

#### Install Docker Desktop

Docker Model Runner is already available in [Docker Desktop](https://docs.docker.com/ai/model-runner/get-started/#docker-desktop).

1. Decide on a model to run, open Docker Desktop, then click on the models tab.
2. Click 'Add models +' or Docker Hub. Search for the model.

Browse the verified model catalog available on [Docker Hub](https://hub.docker.com/r/ai).

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F6R8uxbedMklVHsriLgpZ%2FScreenshot%202025-11-16%20at%206.36.49%E2%80%AFAM.png?alt=media&#x26;token=0fb849f5-bc72-4883-9b25-1a756334ab4b" alt=""><figcaption><p>#1. Click 'Models' tab then 'Add models +'</p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fj7I69xgxDeHXkvVbjemq%2FScreenshot%202025-11-16%20at%206.46.47%E2%80%AFAM.png?alt=media&#x26;token=3e25d495-f34b-47d6-9185-f145610eed10" alt=""><figcaption><p>#2. Search for your desired model.</p></figcaption></figure></div>
{% endstep %}

Click the model you want to run to see available quantizations.

* Quantizations range from 1–16 bits. For models under 30B parameters, use at least 4-bit (`Q4`).
* Choose a size that fits your hardware: ideally, your combined unified memory, RAM, or VRAM should be equal to or greater than the model size. For example, an 11GB model runs well on 12GB unified memory.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FdQnwVwsMhYtWTzAGFih3%2FScreenshot%202025-11-16%20at%206.47.26%E2%80%AFAM.png?alt=media&#x26;token=b1f0e29a-b3de-4d96-b79a-931441744565" alt=""><figcaption><p>#3. Select which quantization you would like to pull.</p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FFGMZEXgQjBdVqP0vFTX3%2FScreenshot%202025-11-16%20at%206.54.09%E2%80%AFAM.png?alt=media&#x26;token=b7f0c0d8-ebef-4e7e-99a9-c44c4c5f0844" alt=""><figcaption><p>#4. Wait for model to finish downloading, then Run it.</p></figcaption></figure></div>
{% endstep %}

Type any prompt in the 'Ask a question' box and use the LLM like you would use ChatGPT.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F9nVjWcVsYK9CeT8gk3nQ%2FScreenshot%202025-11-16%20at%206.54.50%E2%80%AFAM.png?alt=media&#x26;token=d7e5b63d-9c3e-42b0-882c-de046bbcfc9a" alt="" width="563"><figcaption><p>An example of running Qwen3-4B <code>UD-Q8_K_XL</code></p></figcaption></figure>
{% endstep %}
{% endstepper %}

#### **To run the latest models:**

You can run any new model on Docker as long as it’s supported by `llama.cpp` or `vllm` and available on Docker Hub.

### What Is the Docker Model Runner?

The Docker Model Runner (DMR) is an open-source tool that lets you pull and run AI models as easily as you run containers. GitHub: <https://github.com/docker/model-runner>

It provides a consistent runtime for models, similar to how Docker standardized app deployment. Under the hood, it uses optimized backends (like `llama.cpp`) for smooth, hardware-efficient inference on your machine.

Whether you’re a researcher, developer, or hobbyist, you can now:

* Run open models locally in seconds.
* Avoid dependency hell, everything is handled in Docker.
* Share and reproduce model setups effortlessly.

**Examples:**

Example 1 (bash):
```bash
docker model run ai/gpt-oss:20B
```

Example 2 (bash):
```bash
docker model run hf.co/unsloth/gpt-oss-20b-GGUF:F16
```

Example 3 (bash):
```bash
docker model run ai/gpt-oss:20B
```

Example 4 (bash):
```bash
docker model run hf.co/unsloth/gpt-oss-20b-GGUF:UD-Q8_K_XL
```

---

## Inference & Deployment

**URL:** llms-txt#inference-&-deployment

Learn how to save your finetuned model so you can run it in your favorite inference engine.

You can also run your fine-tuned models by using [Unsloth's 2x faster inference](https://docs.unsloth.ai/basics/inference-and-deployment/unsloth-inference).

<table data-card-size="large" data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="inference-and-deployment/saving-to-gguf">llama.cpp - Saving to GGUF</a></td><td><a href="inference-and-deployment/saving-to-gguf">saving-to-gguf</a></td><td><a href="inference-and-deployment/saving-to-gguf">saving-to-gguf</a></td></tr><tr><td><a href="inference-and-deployment/saving-to-ollama">Ollama</a></td><td><a href="inference-and-deployment/saving-to-ollama">saving-to-ollama</a></td><td><a href="inference-and-deployment/saving-to-ollama">saving-to-ollama</a></td></tr><tr><td><a href="inference-and-deployment/vllm-guide">vLLM</a></td><td><a href="inference-and-deployment/vllm-guide">vllm-guide</a></td><td><a href="inference-and-deployment/vllm-guide">vllm-guide</a></td></tr><tr><td><a href="inference-and-deployment/sglang-guide">SGLang</a></td><td><a href="inference-and-deployment/sglang-guide">sglang-guide</a></td><td><a href="inference-and-deployment/vllm-guide/vllm-engine-arguments">vllm-engine-arguments</a></td></tr><tr><td><a href="inference-and-deployment/unsloth-inference">Unsloth Inference</a></td><td><a href="inference-and-deployment/unsloth-inference">unsloth-inference</a></td><td><a href="inference-and-deployment/unsloth-inference">unsloth-inference</a></td></tr><tr><td><a href="inference-and-deployment/troubleshooting-inference">Troubleshooting</a></td><td><a href="inference-and-deployment/troubleshooting-inference">troubleshooting-inference</a></td><td><a href="inference-and-deployment/troubleshooting-inference">troubleshooting-inference</a></td></tr><tr><td><a href="inference-and-deployment/llama-server-and-openai-endpoint">llama-server &#x26; OpenAI endpoint</a></td><td><a href="inference-and-deployment/llama-server-and-openai-endpoint">llama-server-and-openai-endpoint</a></td><td></td></tr><tr><td><a href="inference-and-deployment/vllm-guide/vllm-engine-arguments">vLLM Engine Arguments</a></td><td><a href="inference-and-deployment/vllm-guide/vllm-engine-arguments">vllm-engine-arguments</a></td><td><a href="inference-and-deployment/sglang-guide">sglang-guide</a></td></tr><tr><td><a href="inference-and-deployment/vllm-guide/lora-hot-swapping-guide">LoRA Hotswapping</a></td><td><a href="inference-and-deployment/vllm-guide/lora-hot-swapping-guide">lora-hot-swapping-guide</a></td><td></td></tr></tbody></table>

---

## Kimi K2 Thinking: Run Locally Guide

**URL:** llms-txt#kimi-k2-thinking:-run-locally-guide

**Contents:**
  - :gear: Recommended Requirements
- 💭Kimi-K2-Thinking Guide
  - 🌙 Official Recommended Settings:
  - ✨ Run Kimi K2 Thinking in llama.cpp

Guide on running Kimi-K2-Thinking and Kimi-K2 on your own local device!

{% hint style="success" %}
Kimi-K2-Thinking got released. Read our [Thinking guide](#kimi-k2-thinking-guide) or access [GGUFs here](https://huggingface.co/unsloth/Kimi-K2-Thinking-GGUF).

We also collaborated with the Kimi team on [**system prompt fix**](#tokenizer-quirks-and-bug-fixes) for Kimi-K2-Thinking.
{% endhint %}

Kimi-K2 and **Kimi-K2-Thinking** achieve SOTA performance in knowledge, reasoning, coding, and agentic tasks. The full 1T parameter models from Moonshot AI requires 1.09TB of disk space, while the quantized **Unsloth Dynamic 1.8-bit** version reduces this to just 230GB (-80% size)**:** [**Kimi-K2-GGUF**](https://huggingface.co/unsloth/Kimi-K2-Instruct-GGUF)

You can also now run our [**Kimi-K2-Thinking** GGUFs](https://huggingface.co/unsloth/Kimi-K2-Thinking-GGUF).

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA [Aider Polyglot](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot) and 5-shot MMLU performance. See how our Dynamic 1–2 bit GGUFs perform on [coding benchmarks here](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot).

<a href="#kimi-k2-thinking-guide" class="button primary">Run Thinking</a><a href="#kimi-k2-instruct-guide" class="button primary">Run Instruct</a>

### :gear: Recommended Requirements

{% hint style="info" %}
You need **247GB of disk space** to run the 1bit quant!

The only requirement is **`disk space + RAM + VRAM ≥ 247GB`**. That means you do not need to have that much RAM or VRAM (GPU) to run the model, but it will be much slower.
{% endhint %}

The 1.8-bit (UD-TQ1\_0) quant will fit in a 1x 24GB GPU (with all MoE layers offloaded to system RAM or a fast disk). Expect around \~1-2 tokens/s with this setup if you have bonus 256GB RAM as well. The full Kimi K2 Q8 quant is 1.09TB in size and will need at least 8 x H200 GPUs.

For optimal performance you will need at least **247GB unified memory or 247GB combined RAM+VRAM** for 5+ tokens/s. If you have less than 247GB combined RAM+VRAM, then the speed of the model will definitely take a hit.

**If you do not have 247GB of RAM+VRAM, no worries!** llama.cpp inherently has **disk offloading**, so through mmaping, it'll still work, just be slower - for example before you might get 5 to 10 tokens / second, now it's under 1 token.

We suggest using our **UD-Q2\_K\_XL (360GB)** quant to balance size and accuracy!

{% hint style="success" %}
For the best performance, have your VRAM + RAM combined = the size of the quant you're downloading. If not, it'll still work via disk offloading, just it'll be slower!
{% endhint %}

## 💭Kimi-K2-Thinking Guide

Kimi-K2-Thinking should generally follow the same instructions as the Instruct model, with a few key differences, particularly in areas such as settings and the chat template.

{% hint style="success" %}
**To run the model in full precision, you only need to use the 4-bit or 5-bit Dynamic GGUFs (e.g. UD\_Q4\_K\_XL) because the model was originally released in INT4 format.**

You can choose a higher-bit quantization just to be safe in case of small quantization differences, but in most cases this is unnecessary.
{% endhint %}

### 🌙 Official Recommended Settings:

According to [Moonshot AI](https://huggingface.co/moonshotai/Kimi-K2-Thinking), these are the recommended settings for Kimi-K2-Thinking inference:

* Set the <mark style="background-color:green;">**temperature 1.0**</mark> to reduce repetition and incoherence.
* Suggested context length = 98,304 (up to 256K)
* Note: Using different tools may require different settings

{% hint style="info" %}
We recommend setting <mark style="background-color:green;">**min\_p to 0.01**</mark> to suppress the occurrence of unlikely tokens with low probabilities.
{% endhint %}

For example given a user message of "What is 1+1?", we get:

{% code overflow="wrap" %}

### ✨ Run Kimi K2 Thinking in llama.cpp

{% hint style="success" %}
You can now use the latest update of [llama.cpp](https://github.com/ggml-org/llama.cpp) to run the model:
{% endhint %}

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:UD-TQ1\_0) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location.

3. The above will use around 8GB of GPU memory. If you have around 360GB of combined GPU memory, remove `-ot ".ffn_.*_exps.=CPU"` to get maximum speed!

{% hint style="info" %}
Please try out `-ot ".ffn_.*_exps.=CPU"` to offload all MoE layers to the CPU! This effectively allows you to fit all non MoE layers on 1 GPU, improving generation speeds. You can customize the regex expression to fit more layers if you have more GPU capacity.

If you have a bit more GPU memory, try `-ot ".ffn_(up|down)_exps.=CPU"` This offloads up and down projection MoE layers.

Try `-ot ".ffn_(up)_exps.=CPU"` if you have even more GPU memory. This offloads only up projection MoE layers.

And finally offload all layers via `-ot ".ffn_.*_exps.=CPU"` This uses the least VRAM.

You can also customize the regex, for example `-ot "\.(6|7|8|9|[0-9][0-9]|[0-9][0-9][0-9])\.ffn_(gate|up|down)_exps.=CPU"` means to offload gate, up and down MoE layers but only from the 6th layer onwards.
{% endhint %}

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). We recommend using our 2bit dynamic quant UD-Q2\_K\_XL to balance size and accuracy. All versions at: [huggingface.co/unsloth/Kimi-K2-Thinking-GGUF](https://huggingface.co/unsloth/Kimi-K2-Thinking-GGUF)

{% code overflow="wrap" %}

**Examples:**

Example 1 (unknown):
```unknown
<|im_system|>system<|im_middle|>You are Kimi, an AI assistant created by Moonshot AI.<|im_end|><|im_user|>user<|im_middle|>What is 1+1?<|im_end|><|im_assistant|>assistant<|im_middle|>
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 3 (bash):
```bash
export LLAMA_CACHE="unsloth/Kimi-K2-Thinking-GGUF"
./llama.cpp/llama-cli \
    -hf unsloth/Kimi-K2-Thinking-GGUF:UD-TQ1_0 \
    --n-gpu-layers 99 \
    --temp 1.0 \
    --min-p 0.01 \
    --ctx-size 16384 \
    --seed 3407 \
    -ot ".ffn_.*_exps.=CPU"
```

---

## NVIDIA Nemotron 3 Nano - How To Run Guide

**URL:** llms-txt#nvidia-nemotron-3-nano---how-to-run-guide

**Contents:**
  - ⚙️ Usage Guide
  - 🖥️ Run Nemotron-3-Nano-30B-A3B

Run & fine-tune NVIDIA Nemotron 3 Nano locally on your device!

NVIDIA releases Nemotron 3 Nano, a 30B parameter hybrid reasoning MoE model with \~3.6B active parameters - built for fast, accurate coding, math and agentic tasks. It has a **1M context window** and is best amongst its size class on SWE-Bench, GPQA Diamond, reasoning, chat and throughput.

Nemotron 3 Nano runs on **24GB RAM**/VRAM (or unified memory) and you can now **fine-tune** it locally. Thanks NVIDIA for providing Unsloth with day-zero support.

<a href="#run-nemotron-3-nano-30b-a3b" class="button primary">Running Tutorial</a><a href="https://docs.unsloth.ai/models/nemotron-3#fine-tuning-nemotron-3-nano-and-rl" class="button secondary">Fine-tuning Nano 3</a>

NVIDIA Nemotron 3 Nano GGUF to run: [unsloth/Nemotron-3-Nano-30B-A3B-GGUF](https://huggingface.co/unsloth/Nemotron-3-Nano-30B-A3B-GGUF)\
We also uploaded [BF16](https://huggingface.co/unsloth/Nemotron-3-Nano-30B-A3B) and [FP8](https://huggingface.co/unsloth/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8) variants.

NVIDIA recommends these settings for inference:

**General chat/instruction (default):**

* `temperature = 1.0`
* `top_p = 1.0`

**Tool calling use-cases:**

* `temperature = 0.6`
* `top_p = 0.95`

**For most local use, set:**

* `max_new_tokens` = `32,768` to `262,144` for standard prompts with a max of 1M tokens
* Increase for deep reasoning or long-form generation as your RAM/VRAM allows.

The chat template format is found when we use the below:

{% code overflow="wrap" %}

#### Nemotron 3 chat template format:

{% hint style="info" %}
Nemotron 3 uses `<think>` with token ID 12 and `</think>` with token ID 13 for reasoning. Use `--special` to see the tokens for llama.cpp. You might also need `--verbose-prompt` to see `<think>` since it's prepended.
{% endhint %}

{% code overflow="wrap" lineNumbers="true" %}

### 🖥️ Run Nemotron-3-Nano-30B-A3B

Depending on your use-case you will need to use different settings. Some GGUFs end up similar in size because the model architecture (like [gpt-oss](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune)) has dimensions not divisible by 128, so parts can’t be quantized to lower bits.

#### Llama.cpp Tutorial (GGUF):

Instructions to run in llama.cpp (note we will be using 4-bit to fit most devices):

{% stepper %}
{% step %}
Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% code overflow="wrap" %}

{% endcode %}
{% endstep %}

{% step %}
You can directly pull from Hugging Face. You can increase the context to 1M as your RAM/VRAM allows.

Follow this for **general instruction** use-cases:

Follow this for **tool-calling** use-cases:

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-Q4_K_XL` or other quantized versions.

**Examples:**

Example 1 (python):
```python
tokenizer.apply_chat_template([
    {"role" : "user", "content" : "What is 1+1?"},
    {"role" : "assistant", "content" : "2"},
    {"role" : "user", "content" : "What is 2+2?"}
    ], add_generation_prompt = True, tokenize = False,
)
```

Example 2 (unknown):
```unknown
<|im_start|>system\n<|im_end|>\n<|im_start|>user\nWhat is 1+1?<|im_end|>\n<|im_start|>assistant\n<think></think>2<|im_end|>\n<|im_start|>user\nWhat is 2+2?<|im_end|>\n<|im_start|>assistant\n<think>\n
```

Example 3 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-mtmd-cli llama-server llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 4 (bash):
```bash
./llama.cpp/llama-cli \
    -hf unsloth/Nemotron-3-Nano-30B-A3B-GGUF:UD-Q4_K_XL \
    --jinja -ngl 99 --threads -1 --ctx-size 32768 \
    --temp 1.0 --top-p 1.0
```

---

## SGLang Deployment & Inference Guide

**URL:** llms-txt#sglang-deployment-&-inference-guide

**Contents:**
  - :computer:Installing SGLang

Guide on saving and deploying LLMs to SGLang for serving LLMs in production

You can serve any LLM or fine-tuned model via [SGLang](https://github.com/sgl-project/sglang) for low-latency, high-throughput inference. SGLang supports text, image/video model inference on any GPU setup, with support for some GGUFs.

### :computer:Installing SGLang

To install SGLang and Unsloth on NVIDIA GPUs, you can use the below in a virtual environment (which won't break your other Python libraries)

---

## Unsloth Dynamic 2.0 GGUFs

**URL:** llms-txt#unsloth-dynamic-2.0-ggufs

**Contents:**
  - 💡 What's New in Dynamic v2.0?
- 📊 Why KL Divergence?
- ⚖️ Calibration Dataset Overfitting
- :1234: MMLU Replication Adventure
- :sparkles: Gemma 3 QAT Replication, Benchmarks
- :llama: Llama 4 Bug Fixes + Run
  - Running Llama 4 Scout:

A big new upgrade to our Dynamic Quants!

We're excited to introduce our Dynamic v2.0 quantization method - a major upgrade to our previous quants. This new method outperforms leading quantization methods and sets new benchmarks for 5-shot MMLU and KL Divergence.

This means you can now run + fine-tune quantized LLMs while preserving as much accuracy as possible! You can run the 2.0 GGUFs on any inference engine like llama.cpp, Ollama, Open WebUI etc.

{% hint style="success" %}
[**Sept 10, 2025 update:**](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot) You asked for tougher benchmarks, so we’re showcasing Aider Polyglot results! Our Dynamic 3-bit DeepSeek V3.1 GGUF scores **75.6%**, surpassing many full-precision SOTA LLMs. [Read more.](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot)

The **key advantage** of using the Unsloth package and models is our active role in ***fixing critical bugs*** in major models. We've collaborated directly with teams behind [Qwen3](https://www.reddit.com/r/LocalLLaMA/comments/1kaodxu/qwen3_unsloth_dynamic_ggufs_128k_context_bug_fixes/), [Meta (Llama 4)](https://github.com/ggml-org/llama.cpp/pull/12889), [Mistral (Devstral)](https://app.gitbook.com/o/HpyELzcNe0topgVLGCZY/s/xhOjnexMCB3dmuQFQ2Zq/~/changes/618/basics/tutorials-how-to-fine-tune-and-run-llms/devstral-how-to-run-and-fine-tune), [Google (Gemma 1–3)](https://news.ycombinator.com/item?id=39671146) and [Microsoft (Phi-3/4)](https://simonwillison.net/2025/Jan/11/phi-4-bug-fixes), contributing essential fixes that significantly boost accuracy.
{% endhint %}

Detailed analysis of our benchmarks and evaluation further below.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a114143bdd47add988182aabf9313ab40be38d7d%2Faider%20thinking.png?alt=media" alt="" width="563"><figcaption><p>Thinking Aider Benchmarks</p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-76662317725a3b76fb1e5e33b586c86e712bee6f%2F5shotmmlu.png?alt=media" alt="" width="563"><figcaption><p>5-shot MMLU Benchmarks</p></figcaption></figure></div>

### 💡 What's New in Dynamic v2.0?

* **Revamped Layer Selection for GGUFs + safetensors:** Unsloth Dynamic 2.0 now selectively quantizes layers much more intelligently and extensively. Rather than modifying only select layers, we now dynamically adjust the quantization type of every possible layer, and the combinations will differ for each layer and model.
* Current selected and all future GGUF uploads will utilize Dynamic 2.0 and our new calibration dataset. The dataset contains more than >1.5M **tokens** (depending on model) and comprise of high-quality, hand-curated and cleaned data - to greatly enhance conversational chat performance.
* Previously, our Dynamic quantization (DeepSeek-R1 1.58-bit GGUF) was effective only for MoE architectures. <mark style="background-color:green;">**Dynamic 2.0 quantization now works on all models (including MOEs & non-MoEs)**</mark>.
* **Model-Specific Quants:** Each model now uses a custom-tailored quantization scheme. E.g. the layers quantized in Gemma 3 differ significantly from those in Llama 4.
* To maximize efficiency, especially on Apple Silicon and ARM devices, we now also add Q4\_NL, Q5.1, Q5.0, Q4.1, and Q4.0 formats.

To ensure accurate benchmarking, we built an internal evaluation framework to match official reported 5-shot MMLU scores of Llama 4 and Gemma 3. This allowed apples-to-apples comparisons between full-precision vs. Dynamic v2.0, **QAT** and standard **imatrix** GGUF quants.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-fd0a92a2bea8efa37b71946ea934a22f00589f40%2Fkldivergence%20graph.png?alt=media" alt="" width="563"><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-76662317725a3b76fb1e5e33b586c86e712bee6f%2F5shotmmlu.png?alt=media" alt="" width="563"><figcaption></figcaption></figure></div>

All future GGUF uploads will utilize Unsloth Dynamic 2.0, and our Dynamic 4-bit safe tensor quants will also benefit from this in the future.

## 📊 Why KL Divergence?

[Accuracy is Not All You Need](https://arxiv.org/pdf/2407.09141) showcases how pruning layers, even by selecting unnecessary ones still yields vast differences in terms of "flips". A "flip" is defined as answers changing from incorrect to correct or vice versa. The paper shows how MMLU might not decrease as we prune layers or do quantization,but that's because some incorrect answers might have "flipped" to become correct. Our goal is to match the original model, so measuring "flips" is a good metric.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5a97c101b0df31fb49df20ce4241930897098cf8%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e4a60354ad8613b6f2361f63fa82c552e00fdda9%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
**KL Divergence** should be the **gold standard for reporting quantization errors** as per the research paper "Accuracy is Not All You Need". **Using perplexity is incorrect** since output token values can cancel out, so we must use KLD!
{% endhint %}

The paper also shows that interestingly KL Divergence is highly correlated with flips, and so our goal is to reduce the mean KL Divergence whilst increasing the disk space of the quantization as less as possible.

## ⚖️ Calibration Dataset Overfitting

Most frameworks report perplexity and KL Divergence using a test set of Wikipedia articles. However, we noticed using the calibration dataset which is also Wikipedia related causes quants to overfit, and attain lower perplexity scores. We utilize [Calibration\_v3](https://gist.github.com/bartowski1182/eb213dccb3571f863da82e99418f81e8) and [Calibration\_v5](https://gist.github.com/tristandruyen/9e207a95c7d75ddf37525d353e00659c/) datasets for fair testing which includes some wikitext data amongst other data. <mark style="background-color:red;">**Also instruct models have unique chat templates, and using text only calibration datasets is not effective for instruct models**</mark> (base models yes). In fact most imatrix GGUFs are typically calibrated with these issues. As a result, they naturally perform better on KL Divergence benchmarks that also use Wikipedia data, since the model is essentially optimized for that domain.

To ensure a fair and controlled evaluation, we do not to use our own calibration dataset (which is optimized for chat performance) when benchmarking KL Divergence. Instead, we conducted tests using the same standard Wikipedia datasets, allowing us to directly compare the performance of our Dynamic 2.0 method against the baseline imatrix approach.

## :1234: MMLU Replication Adventure

* Replicating MMLU 5 shot was nightmarish. We <mark style="background-color:red;">**could not**</mark> replicate MMLU results for many models including Llama 3.1 (8B) Instruct, Gemma 3 (12B) and others due to <mark style="background-color:yellow;">**subtle implementation issues**</mark>. Llama 3.1 (8B) for example should be getting \~68.2%, whilst using incorrect implementations can attain <mark style="background-color:red;">**35% accuracy.**</mark>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-cc2b4b2bc512b3c9bc065250930259b9b9a9fce0%2FMMLU%20differences.png?alt=media" alt="" width="375"><figcaption><p>MMLU implementation issues</p></figcaption></figure>

* Llama 3.1 (8B) Instruct has a MMLU 5 shot accuracy of 67.8% using a naive MMLU implementation. We find however Llama **tokenizes "A" and "\_A" (A with a space in front) as different token ids**. If we consider both spaced and non spaced tokens, we get 68.2% <mark style="background-color:green;">(+0.4%)</mark>
* Interestingly Llama 3 as per Eleuther AI's [LLM Harness](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/lm_eval/tasks/llama3/instruct/mmlu/_continuation_template_yaml) also appends <mark style="background-color:purple;">**"The best answer is"**</mark> to the question, following Llama 3's original MMLU benchmarks.
* There are many other subtle issues, and so to benchmark everything in a controlled environment, we designed our own MMLU implementation from scratch by investigating [github.com/hendrycks/test](https://github.com/hendrycks/test) directly, and verified our results across multiple models and comparing to reported numbers.

## :sparkles: Gemma 3 QAT Replication, Benchmarks

The Gemma team released two QAT (quantization aware training) versions of Gemma 3:

1. Q4\_0 GGUF - Quantizes all layers to Q4\_0 via the formula `w = q * block_scale` with each block having 32 weights. See [llama.cpp wiki ](https://github.com/ggml-org/llama.cpp/wiki/Tensor-Encoding-Schemes)for more details.
2. int4 version - presumably [TorchAO int4 style](https://github.com/pytorch/ao/blob/main/torchao/quantization/README.md)?

We benchmarked all Q4\_0 GGUF versions, and did extensive experiments on the 12B model. We see the **12B Q4\_0 QAT model gets 67.07%** whilst the full bfloat16 12B version gets 67.15% on 5 shot MMLU. That's very impressive! The 27B model is mostly nearly there!

<table><thead><tr><th>Metric</th><th>1B</th><th valign="middle">4B</th><th>12B</th><th>27B</th></tr></thead><tbody><tr><td>MMLU 5 shot</td><td>26.12%</td><td valign="middle">55.13%</td><td><mark style="background-color:blue;"><strong>67.07% (67.15% BF16)</strong></mark></td><td><strong>70.64% (71.5% BF16)</strong></td></tr><tr><td>Disk Space</td><td>0.93GB</td><td valign="middle">2.94GB</td><td><strong>7.52GB</strong></td><td>16.05GB</td></tr><tr><td><mark style="background-color:green;"><strong>Efficiency*</strong></mark></td><td>1.20</td><td valign="middle">10.26</td><td><strong>5.59</strong></td><td>2.84</td></tr></tbody></table>

We designed a new **Efficiency metric** which calculates the usefulness of the model whilst also taking into account its disk size and MMLU 5 shot score:

$$
\text{Efficiency} = \frac{\text{MMLU 5 shot score} - 25}{\text{Disk Space GB}}
$$

{% hint style="warning" %}
We have to **minus 25** since MMLU has 4 multiple choices - A, B, C or D. Assume we make a model that simply randomly chooses answers - it'll get 25% accuracy, and have a disk space of a few bytes. But clearly this is not a useful model.
{% endhint %}

On KL Divergence vs the base model, below is a table showcasing the improvements. Reminder the closer the KL Divergence is to 0, the better (ie 0 means identical to the full precision model)

| Quant     | Baseline KLD | GB    | New KLD  | GB    |
| --------- | ------------ | ----- | -------- | ----- |
| IQ1\_S    | 1.035688     | 5.83  | 0.972932 | 6.06  |
| IQ1\_M    | 0.832252     | 6.33  | 0.800049 | 6.51  |
| IQ2\_XXS  | 0.535764     | 7.16  | 0.521039 | 7.31  |
| IQ2\_M    | 0.26554      | 8.84  | 0.258192 | 8.96  |
| Q2\_K\_XL | 0.229671     | 9.78  | 0.220937 | 9.95  |
| Q3\_K\_XL | 0.087845     | 12.51 | 0.080617 | 12.76 |
| Q4\_K\_XL | 0.024916     | 15.41 | 0.023701 | 15.64 |

If we plot the ratio of the disk space increase and the KL Divergence ratio change, we can see a much clearer benefit! Our dynamic 2bit Q2\_K\_XL reduces KLD quite a bit (around 7.5%).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5b352d0449e723556e6e871396c2ee78ae8ec3dc%2Fchart(2).svg?alt=media" alt=""><figcaption></figcaption></figure>

Truncated table of results for MMLU for Gemma 3 (27B). See below.

1. **Our dynamic 4bit version is 2GB smaller whilst having +1% extra accuracy vs the QAT version!**
2. Efficiency wise, 2bit Q2\_K\_XL and others seem to do very well!

| Quant          | Unsloth   | Unsloth + QAT | Disk Size | Efficiency |
| -------------- | --------- | ------------- | --------- | ---------- |
| IQ1\_M         | 48.10     | 47.23         | 6.51      | 3.42       |
| IQ2\_XXS       | 59.20     | 56.57         | 7.31      | 4.32       |
| IQ2\_M         | 66.47     | 64.47         | 8.96      | 4.40       |
| Q2\_K\_XL      | 68.70     | 67.77         | 9.95      | 4.30       |
| Q3\_K\_XL      | 70.87     | 69.50         | 12.76     | 3.49       |
| **Q4\_K\_XL**  | **71.47** | **71.07**     | **15.64** | **2.94**   |
| **Google QAT** |           | **70.64**     | **17.2**  | **2.65**   |

<summary><mark style="color:green;">Click here</mark> for Full Google's Gemma 3 (27B) QAT Benchmarks:</summary>

| Model          | Unsloth   | Unsloth + QAT | Disk Size | Efficiency |
| -------------- | --------- | ------------- | --------- | ---------- |
| IQ1\_S         | 41.87     | 43.37         | 6.06      | 3.03       |
| IQ1\_M         | 48.10     | 47.23         | 6.51      | 3.42       |
| IQ2\_XXS       | 59.20     | 56.57         | 7.31      | 4.32       |
| IQ2\_M         | 66.47     | 64.47         | 8.96      | 4.40       |
| Q2\_K          | 68.50     | 67.60         | 9.78      | 4.35       |
| Q2\_K\_XL      | 68.70     | 67.77         | 9.95      | 4.30       |
| IQ3\_XXS       | 68.27     | 67.07         | 10.07     | 4.18       |
| Q3\_K\_M       | 70.70     | 69.77         | 12.51     | 3.58       |
| Q3\_K\_XL      | 70.87     | 69.50         | 12.76     | 3.49       |
| Q4\_K\_M       | 71.23     | 71.00         | 15.41     | 2.98       |
| **Q4\_K\_XL**  | **71.47** | **71.07**     | **15.64** | **2.94**   |
| Q5\_K\_M       | 71.77     | 71.23         | 17.95     | 2.58       |
| Q6\_K          | 71.87     | 71.60         | 20.64     | 2.26       |
| Q8\_0          | 71.60     | 71.53         | 26.74     | 1.74       |
| **Google QAT** |           | **70.64**     | **17.2**  | **2.65**   |

## :llama: Llama 4 Bug Fixes + Run

We also helped and fixed a few Llama 4 bugs:

* Llama 4 Scout changed the RoPE Scaling configuration in their official repo. We helped resolve issues in llama.cpp to enable this [change here](https://github.com/ggml-org/llama.cpp/pull/12889)

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7ff8229dfa96425f50c2c87f9ca988ef9cc99eff%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
* Llama 4's QK Norm's epsilon for both Scout and Maverick should be from the config file - this means using 1e-05 and not 1e-06. We helped resolve these in [llama.cpp](https://github.com/ggml-org/llama.cpp/pull/12889) and [transformers](https://github.com/huggingface/transformers/pull/37418)
* The Llama 4 team and vLLM also independently fixed an issue with QK Norm being shared across all heads (should not be so) [here](https://github.com/vllm-project/vllm/pull/16311). MMLU Pro increased from 68.58% to 71.53% accuracy.
* [Wolfram Ravenwolf](https://x.com/WolframRvnwlf/status/1909735579564331016) showcased how our GGUFs via llama.cpp attain much higher accuracy than third party inference providers - this was most likely a combination of the issues explained above, and also probably due to quantization issues.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-76c49d8c8e3e42f7407f431a2cede369f87878e4%2FGoC79hYXwAAPTMs.jpg?alt=media" alt=""><figcaption></figcaption></figure>

As shown in our graph, our 4-bit Dynamic QAT quantization deliver better performance on 5-shot MMLU while also being smaller in size.

### Running Llama 4 Scout:

To run Llama 4 Scout for example, first clone llama.cpp:

Then download out new dynamic v 2.0 quant for Scout:

**Examples:**

Example 1 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
```

---

## Use the public key in docker run

**URL:** llms-txt#use-the-public-key-in-docker-run

-e "SSH_KEY=$(cat ~/.ssh/container_key.pub)"

---
