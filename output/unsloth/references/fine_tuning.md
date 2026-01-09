# Unsloth - Fine Tuning

**Pages:** 43

---

## (2) Continued training from a saved LoRA adapter

**URL:** llms-txt#(2)-continued-training-from-a-saved-lora-adapter

---

## 3x Faster LLM Training with Unsloth Kernels + Packing

**URL:** llms-txt#3x-faster-llm-training-with-unsloth-kernels-+-packing

**Contents:**
  - :drum:Fused QK RoPE Triton Kernel with packing
  - :railway\_car:Int64 Indexing for Triton Kernels
  - :abacus:Why is padding needed & mathematical speedup
  - :clapper:Padding-Free by Default
  - :spades:Uncontaminated Packing 2-5x faster training
  - :beach:Analysis and Benchmarks
  - :sparkles:How to enable packing?

Learn how Unsloth increases training throughput and eliminates padding waste for fine-tuning.

Unsloth now supports up to **5× faster** (typically 3x) training with our new custom **RoPE and MLP Triton kernels**, plus our new smart auto packing. Unsloth's new kernels + features not only increase training speed, but also further **reduces VRAM use (30% - 90%)** with no accuracy loss. [Unsloth GitHub](https://github.com/unslothai/unsloth)\
\
This means you can now train LLMs like [Qwen3](https://docs.unsloth.ai/models/qwen3-how-to-run-and-fine-tune)-4B not only on just **3GB VRAM**, but also 3x faster.

Our auto [padding-free](#padding-free-by-default) uncontaminated packing is smartly enabled for all training runs without any changes, and all fast attention backends (FlashAttention 3, xFormers, SDPA). [Benchmarks](#analysis-and-benchmarks) show training losses match non-packing runs **exactly**.

* **2.3x faster QK Rotary Embedding** fused Triton kernel with packing support
* Updated SwiGLU, GeGLU kernels with **int64 indexing for long context**
* **2.5x to 5x faster uncontaminated packing** with xformers, SDPA, FA3 backends
* **2.1x faster padding free, 50% less VRAM**, 0% accuracy change
* Unsloth also now has improved SFT loss stability and more predictable GPU utilization.
* This new upgrade works **for all training methods** e.g. full fine-tuning, pretraining etc.

### :drum:Fused QK RoPE Triton Kernel with packing

Back in December 2023, we introduced a RoPE kernel coded up in Triton as part of our Unsloth launch. In March 2024, a community member made end to end training 1-2% faster by optimizing the RoPE kernel to allow launching a block for a group of heads. See [PR 238](https://github.com/unslothai/unsloth/pull/238).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FewadBu05vK7zAmJRJcj6%2Frope_varlen_qk_rope_kernel_benchmark_v5.png?alt=media&#x26;token=04d277d4-c289-4943-9312-e3d3e2d60bec" alt="" width="563"><figcaption></figcaption></figure>

One issue is for each Q and K, there are 2 Triton kernels. We merged them into 1 Triton kernel now, and enabled variable length RoPE, which was imperative for padding free and packing support. This makes the RoPE kernel in micro benchmarks **2.3x faster on longer context lengths**, and 1.9x faster on shorter context lengths.

We also eliminated all clones and contiguous transpose operations, and so **RoPE is now fully inplace**, reducing further GPU memory. Note for the backward pass, we see that `sin1 = -sin1` since:

### :railway\_car:Int64 Indexing for Triton Kernels

During 500K long context training which we introduced in [500k-context-length-fine-tuning](https://docs.unsloth.ai/new/500k-context-length-fine-tuning "mention"), we would get CUDA out of bounds errors. This was because MLP kernels for SwiGLU, GeGLU had int32 indexing which is by default in Triton and CUDA.

We can't just do `tl.program_id(0).to(tl.int64)` since training will be slightly slower due to int64 indexing. We instead make this a `LONG_INDEXING: tl.constexpr` variable so the Triton compiler can specialize this. This allows shorter and longer context runs to both run great!

{% code overflow="wrap" %}

### :abacus:Why is padding needed & mathematical speedup

Computers and GPUs cannot process different length datasets, so we have to pad them with 0s. This causes wastage. Assume we have a dataset of 50% short sequences S, and 50% long sequences L, then in the worst case, padding will cause token usage to be $$\text{batchsize} \times L$$ since the longest sequence length dominates.

By packing multiple examples into a single, long one-dimensional tensor, we can eliminate a significant amount of padding. In fact we get the below token usage:

$$
\text{Token Usage} = \frac{\text{batchsize}}{2}L+\frac{\text{batchsize}}{2}S
$$

By some math and algebra, we can work out the speedup via:

$$
\text{Speedup} = \frac{\text{batchsize} \times L}{\frac{\text{batchsize}}{2}L+\frac{\text{batchsize}}{2}S} = 2 \frac{L}{L + S}
$$

By assuming $$S\rightarrow0$$ then we get a 2x theoretical speedup since $$2 \frac{L}{L + 0} = 2$$

By changing the ratio of 50% short sequences, and assuming we have MORE short sequences, for eg 20% long sequences and 80% short sequences, we get $$\frac{L}{0.2L + 0.8S}\rightarrow\frac{L}{0.2L}=5$$ so 5x faster training! This means packing's speedup depends on how short rows your dataset has (the more shorter, the faster).

### :clapper:Padding-Free by Default

In addition to large throughput gains available when setting `packing = True` in your `SFTConfig` , we will **automatically use padding-free batching** in order to reduce padding waste improve throughput and increases tokens/s throughput, while resulting in the ***exact same loss*** as seen in the previous version of Unsloth.

For example for Qwen3-8B and Qwen3-32B, we see memory usage decrease by 60%, be 2x faster, and have the same exact loss and grad norm curves!

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FPATEJoJwIotXNPsYT1hu%2FW%26B%20Chart%2010_12_2025%2C%203_57_51%20am.png?alt=media&#x26;token=e31ee2cd-cd6e-4fd2-9c59-7f2148179815" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FjjnXdgPSgUxL9WNzx9wc%2FW%26B%20Chart%2010_12_2025%2C%203_58_19%20am.png?alt=media&#x26;token=54368c73-2ce1-4faa-a1f4-c82341638be3" alt=""><figcaption></figcaption></figure></div>

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FA61fgCtUj0K9dhrHCt0C%2FW%26B%20Chart%2010_12_2025%2C%203_54_40%20am.png?alt=media&#x26;token=b8472635-4b05-430e-9df1-3820ed381c3f" alt="" width="563"><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FPh0Xfaup0CTz8REL6P9F%2FW%26B%20Chart%2010_12_2025%2C%203_56_38%20am.png?alt=media&#x26;token=86ed33c3-e5ac-4b71-82c3-f8f86ca79862" alt="" width="563"><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F6FKM6pkRkQX3gzQLdcIP%2FW%26B%20Chart%2010_12_2025%2C%203_55_38%20am.png?alt=media&#x26;token=48d2c1d3-e6f2-420c-8209-70ef247ce63d" alt="" width="563"><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FxbhcPeELu78xh3M01xkf%2FW%26B%20Chart%2010_12_2025%2C%203_56_07%20am.png?alt=media&#x26;token=375c3f27-5af8-43e5-93eb-3818cb401f95" alt="" width="563"><figcaption></figcaption></figure></div>

### :spades:Uncontaminated Packing 2-5x faster training

Real datasets can contain different sequence lengths, so increasing the batch size to 32 for example will cause padding, making training slower and use more VRAM.

{% hint style="success" %}
In the past, increasing `batch_size` to large numbers (>32) will make training SLOWER, not faster. This was due to padding - we can now eliminate this issue via `packing = True`, and so training is FASTER!
{% endhint %}

When we pack multiple samples into a single one-dimensional tensor, we keep sequence length metadata around in order to properly mask samples, without leaking attention between samples. We also need the RoPE kernel described in [#fused-qk-rope-triton-kernel-with-packing](#fused-qk-rope-triton-kernel-with-packing "mention") to allow reset position ids.

{% columns %}
{% column width="41.66666666666667%" %}

<div align="center" data-full-width="false"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F508zS4YN2sYnYjYkt8ej%2Fimage.png?alt=media&#x26;token=a05f917a-f593-4abd-a834-2f3f6652ca5a" alt="" width="563"><figcaption><p>4 examples without packing wastes space</p></figcaption></figure></div>

{% column width="58.33333333333333%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F8azEy9wbeF2RWSWbNdma%2Fimage.png?alt=media&#x26;token=a4b96567-244a-45ed-8b18-b16074bac88c" alt=""><figcaption><p>Uncontaminated packing creates correct attention pattern</p></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

By changing the ratio of 50% short sequences, and assuming we have MORE short sequences, for eg 20% long sequences and 80% long sequences, we get $$\frac{L}{0.2L + 0.8S}\rightarrow\frac{L}{0.2L}=5$$ so 5x faster training! This means packing's speedup depends on how short rows your dataset has (the more shorter, the faster).

### :beach:Analysis and Benchmarks

To demonstrate the various improvements when training with our new kernels and packed data, we ran fine-tuning runs with [Qwen3-32B](https://docs.unsloth.ai/models/qwen3-how-to-run-and-fine-tune), Qwen3-8B, Llama 3 8B on the `yahma/alpaca-cleaned` dataset and measured various [training loss](#padding-free-by-default) throughput and efficiency metrics. We compared our new runs vs. a standard optimized training run with our own kernels/optimizations turned on and kernels like Flash Attention 3 (FA3) enabled. We fixed `max_length = 1024` and varied the batch size in {1, 2, 4, 8, 16, 32}. This allows the maximum token count per batch to vary in {1024, 2048, 4096, 8192, 16K, 32K}.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FFfmdok7AmeretPSGlZjg%2Fnew%20rope%20kernel%20graph.png?alt=media&#x26;token=d890fd95-c8c0-4817-9ee3-18e3095cde5f" alt="" width="563"><figcaption></figcaption></figure>

The above shows how tokens per second (tokens/s) training throughput varies for new Unsloth with varying batch size. This translates into training your model on an epoch of your dataset **1.7-3x faster (sometimes even 5x or more)**! These gains will be more pronounced if there are many short sequences in your data and if you have longer training runs, as described in [#why-is-padding-needed-and-mathematical-speedup](#why-is-padding-needed-and-mathematical-speedup "mention")

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FReViERxLWBHnT8GOv0ql%2Fpacking_efficiency_by_per_device_train_batch_size.png?alt=media&#x26;token=1c4a78c7-a611-4374-ac03-94aabb1d3184" alt="" width="563"><figcaption></figcaption></figure>

The above shows the average percentage of tokens per batch that are valid (i.e., non-padding). As the batch size length grows, many more padding tokens are seen in the unpacked case, while we achieve a high packing efficiency in the packed case regardless of max sequence length.

Note that, since the batching logic trims batches to the maximum sequence length seen in the batch, when the batch size is 1, the unpacked data is all valid tokens (i.e., no padding). However, as more examples are added into the batch, padding increases on average, hitting nearly 50% padding with batch size is 8! Our sample packing implementation eliminates that waste.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FRfzNZVz9uzDPhEe3frGe%2Funknown.png?alt=media&#x26;token=e9fe893e-6b94-4c0d-b144-ef8315067c1e" alt="" width="563"><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FTHtcpIdQ0z0mGRYYBfuF%2Funknown.png?alt=media&#x26;token=ec52b2c1-1e60-4ed2-969a-d760af26be2a" alt="" width="563"><figcaption></figcaption></figure></div>

The first graph (above) plots progress on `yahma/alpaca-cleaned` with `max_length = 2048`, Unsloth new with packing + kernels (maroon) vs. Unsloth old (gray). Both are trained with `max_steps = 500`, but we plot the x-axis in wall-clock time. Notice that we train on nearly 40% of an epoch in the packed case in the same amount of steps (and only a bit more wall-clock time) that it takes to train less than 5% of an epoch in the unpacked case.

Similarly, the 2nd graph (above) plots loss from the same runs, this time plotted with training steps on the x-axis. Notice that the losses match in scale and trend, but the loss in the packing case is less variable since the model is seeing more tokens per training step.

### :sparkles:How to enable packing?

**Update Unsloth first and padding free is done by default**! So all training is immediately 1.1 to 2x faster with 30% less memory usage at least and 0 change in loss curve metric!

{% code overflow="wrap" %}

We also support Flash Attention 3 via Xformers, SDPA support, Flash Attention 2, and this works on old GPUs (Tesla T4, RTX 2080) and new GPUs like H100s, B200s etc! Sample packing works *regardless of choice of attention backend or model family*, so enjoy the same speedups previously had with these fast attention implementations!

If you want to enable explicit packing, then add `packing = True` to enable up to 5x faster training!

{% hint style="warning" %}
Note `packing=True` will change the training loss and will make the dataset number of rows truncated, since multiple short sequences are packed into 1 sequence. You might see the number of examples in the dataset shrink.

To not get different training loss numbers, simply set `packing=False` and we will enable auto padding-free, which already makes training faster!
{% endhint %}

All our notebooks are automatically faster (no need to do anything). See [unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks "mention")

{% columns %}
{% column %}
Qwen3 14B faster:

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_(14B)-Reasoning-Conversational.ipynb>" %}
{% endcolumn %}

{% column %}
Llama 3.1 Conversational faster:

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_(1B_and_3B)-Conversational.ipynb>" %}
{% endcolumn %}
{% endcolumns %}

Thank you! If you're interested, see our [500k-context-length-fine-tuning](https://docs.unsloth.ai/new/500k-context-length-fine-tuning "mention") blog, [memory-efficient-rl](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl "mention") blog and [long-context-gpt-oss-training](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/long-context-gpt-oss-training "mention") blog for more topics on kernels and performance gains!

**Examples:**

Example 1 (unknown):
```unknown
Q * cos + rotate_half(Q) * sin
is equivalent to
Q * cos + Q @ R * sin
where R is a rotation matrix [ 0,  I]
                             [-I,  0]
dC/dY = dY * cos + dY @ R.T * sin
where R.T is again the same  [ 0, -I]
but the minus is transposed. [ I,  0]
```

Example 2 (python):
```python
block_idx = tl.program_id(0)
if LONG_INDEXING:
    offsets = block_idx.to(tl.int64) * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE).to(tl.int64)
    n_elements = tl.cast(n_elements, tl.int64)
else:
    offsets = block_idx * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)
```

Example 3 (bash):
```bash
pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth
pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth_zoo
```

Example 4 (python):
```python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig

model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/Qwen3-14B",
)

trainer = SFTTrainer(
    model = model,
    processing_class = tokenizer,
    train_dataset = dataset,
    args = SFTConfig(
        per_device_train_batch_size = 1,
        max_length = 4096,
        …,
        packing = True, # required to enable sample packing!
    ),
)
trainer.train()
```

---

## 500K Context Length Fine-tuning

**URL:** llms-txt#500k-context-length-fine-tuning

**Contents:**
  - 📐 Unsloth Loss Refactoring: Chunk & Fuse
  - 🏁 Unsloth Gradient Checkpointing Enhancements

Learn how to enable >500K token context window fine-tuning with Unsloth.

We’re introducing new algorithms in Unsloth that push the limits of long-context training for **any LLM and VLM**. Training LLMs like gpt-oss-20b can now reach **500K+ context lengths** on a single 80GB H100 GPU, compared to 80K previously with no accuracy degradation.

You can reach >**750K context windows** on a B200 192GB GPU.

> **Try 500K-context gpt-oss-20b fine-tuning on our** [**80GB A100 Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_500K_Context_Fine_tuning.ipynb)**.**

We’ve significantly improved how Unsloth handles memory usage patterns, speed, and context lengths:

* **60% lower VRAM use** with **3.2x longer context** via Unsloth’s new [fused and chunked cross-entropy](#unsloth-loss-refactoring-chunk-and-fuse) loss, with no degradation in speed or accuracy
* Enhanced activation offloading in Unsloth’s [**Gradient Checkpointing**](#unsloth-gradient-checkpointing-enhanced)
* Collabing with Stas Bekman from Snowflake on [Tiled MLP](#tiled-mlp-unlocking-500k), enabling 2× more contexts

Unsloth’s algorithms allows gpt-oss-20b QLoRA (4bit) with 290K context possible on a H100 with no accuracy loss, and 500K+ with Tiled MLP enabled, altogether delivering >**6.4x longer context lengths.**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F8Ha930qR5XXBOK7M7oiy%2Fline_chart_light_tiled.png?alt=media&#x26;token=51467f68-a77b-4037-b9d9-e668223868c5" alt="" width="563"><figcaption></figcaption></figure>

### 📐 Unsloth Loss Refactoring: Chunk & Fuse

Our new fused loss implementation adds **dynamic sequence chunking**: instead of computing language model head logits and cross-entropies over the entire sequence at once, we process manageable slices along the flattened sequence dimension. This cuts peak memory from GBs to a smaller chunk sizes. Each chunk still runs a fully fused forward + backward pass via `torch.func.grad_and_value` , and retains mixed precision accuracy by upcasting to float32 if necessary. **These changes do not degrade training speed or accuracy.**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FFF43WA1X8Y4vADBrCi8T%2Fline_chart_light.png?alt=media&#x26;token=7afc7f73-bc54-403a-9674-8a16841ec659" alt="" width="563"><figcaption></figcaption></figure>

The key innovation is that the **chunk size is chosen automatically at runtime** based on available VRAM.

* If you have more free VRAM, larger chunks are used for faster runs
* If you have less VRAM, it increases the number of chunks to avoid memory blowouts.

This **removes manual tuning** and keeps our algorithm robust across old and new GPUs, workloads and different sequence lengths.

{% hint style="success" %}
Due to automatic tuning, **smaller contexts will use more VRAM** (fewer chunks) to **avoid unnecessary overhead**. For the plots above, we adjust the number of loss chunks to reflect realistic VRAM tiers. With 80GB VRAM, this yields >3.2× longer contexts.
{% endhint %}

### 🏁 Unsloth Gradient Checkpointing Enhancements

Our [Unsloth Gradient Checkpointing](https://unsloth.ai/blog/long-context) algorithm, **introduced in April 2024**, quickly became popular and the standard across the industry, having been integrated into most training packages nowadays. It offloads activations to CPU RAM which allowed 10x longer context lengths. Our new enhancements uses CUDA Streams and other tricks to add at most **0.1%** training overhead with no impact on accuracy. Previously it added 1 to 3% training overhead.

{% code expandable="true" %}

---

## Add LoRA adapter to the model for parameter efficient fine tuning

**URL:** llms-txt#add-lora-adapter-to-the-model-for-parameter-efficient-fine-tuning

**Contents:**
- :butterfly:Qwen 2.5 VL Vision RL Issues and Quirks
- :medal:Reward Functions to reduce gibberish
- :checkered\_flag:GSPO Reinforcement Learning

model = FastVisionModel.get_peft_model(
    model,

finetune_vision_layers     = False,# fast_inference doesn't support finetune_vision_layers yet :(
    finetune_language_layers   = True, # False if not finetuning language layers
    finetune_attention_modules = True, # False if not finetuning attention layers
    finetune_mlp_modules       = True, # False if not finetuning MLP layers

r = lora_rank, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
    lora_alpha = lora_rank*2, # *2 speeds up training
    use_gradient_checkpointing = "unsloth", # Reduces memory usage
    random_state = 3407,
)

addCriterion
 <tool_call>\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n\n addCriterion\n\n 自动生成\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n addCriterion\n\n\n addCriterion\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n

Figure is an overhead view of the path taken by a race car driver as his car collides with the racetrack wall. Just before the collision, he is traveling at speed $v_i=70 \mathrm{~m} / \mathrm{s}$ along a straight line at $30^{\circ}$ from the wall. Just after the collision, he is traveling at speed $v_f=50 \mathrm{~m} / \mathrm{s}$ along a straight line at $10^{\circ}$ from the wall. His mass $m$ is $80 \mathrm{~kg}$. The collision lasts for $14 \mathrm{~ms}$. What is the magnitude of the average force on the driver during the collision?
python
def formatting_reward_func(completions,**kwargs):
    import re
    thinking_pattern = f'{REASONING_START}(.*?){REASONING_END}'
    answer_pattern = f'{SOLUTION_START}(.*?){SOLUTION_END}'

scores = []
    for completion in completions:
        score = 0
        thinking_matches = re.findall(thinking_pattern, completion, re.DOTALL)
        answer_matches = re.findall(answer_pattern, completion, re.DOTALL)
        if len(thinking_matches) == 1:
            score += 1.0
        if len(answer_matches) == 1:
            score += 1.0

# Fix up addCriterion issues
        # See https://docs.unsloth.ai/new/vision-reinforcement-learning-vlm-rl#qwen-2.5-vl-vision-rl-issues-and-quirks
        # Penalize on excessive addCriterion and newlines
        if len(completion) != 0:
            removal = completion.replace("addCriterion", "").replace("\n", "")
            if (len(completion)-len(removal))/len(completion) >= 0.5:
                score -= 2.0

scores.append(score)
    return scores
python
training_args = GRPOConfig(
    output_dir = "vlm-grpo-unsloth",
    per_device_train_batch_size = 8,
    gradient_accumulation_steps = 4,
    learning_rate = 5e-6,
    adam_beta1 = 0.9,
    adam_beta2 = 0.99,
    weight_decay = 0.1,
    warmup_ratio = 0.1,
    lr_scheduler_type = "cosine",
    optim = "adamw_8bit",
    # beta = 0.00,
    epsilon = 3e-4,
    epsilon_high = 4e-4,
    num_generations = 8,    
    max_prompt_length = 1024,
    max_completion_length = 1024,
    log_completions = False,
    max_grad_norm = 0.1,
    temperature = 0.9,
    # report_to = "none", # Set to "wandb" if you want to log to Weights & Biases
    num_train_epochs = 2, # For a quick test run, increase for full training
    report_to = "none"
    
    # GSPO is below:
    importance_sampling_level = "sequence",
    
    # Dr GRPO / GAPO etc
    loss_type = "dr_grpo",
)
```

Overall, Unsloth now with VLM vLLM fast inference enables for both 90% reduced memory usage but also 1.5-2x faster speed with GRPO and GSPO!

If you'd like to read more about reinforcement learning, check out out RL guide:

[](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide "mention")

***Authors:** A huge thank you to* [*Keith*](https://www.linkedin.com/in/keith-truongcao-7bb84a23b/) *and* [*Datta*](https://www.linkedin.com/in/datta0/) *for contributing to this article!*

**Examples:**

Example 1 (unknown):
```unknown
## :butterfly:Qwen 2.5 VL Vision RL Issues and Quirks

During RL for Qwen 2.5 VL, you might see the following inference output:

{% code overflow="wrap" %}
```

Example 2 (unknown):
```unknown
{% endcode %}

This was [reported](https://github.com/QwenLM/Qwen2.5-VL/issues/759) as well in Qwen2.5-VL-7B-Instruct output unexpected results "addCriterion". In fact we see this as well! We tried both non Unsloth, bfloat16 and float16 machines and other things, but it appears still. For example item 165 ie `train_dataset[165]` from the [AI4Math/MathVista](https://huggingface.co/datasets/AI4Math/MathVista) dataset is below:

{% code overflow="wrap" %}
```

Example 3 (unknown):
```unknown
{% endcode %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-61a659529171fcc10ed6398a15912b21d6b1a076%2FUntitled.png?alt=media" alt="" width="128"><figcaption></figcaption></figure>

And then we get the above gibberish output. One could add a reward function to penalize the addition of addCriterion, or penalize gibberish outputs. However, the other approach is to train it for longer. For example only after 60 steps ish do we see the model actually learning via RL:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5f34f66f0ac6508fd28343b16592c59b889ec5ca%2Fimage.webp?alt=media" alt=""><figcaption></figcaption></figure>

{% hint style="success" %}
Forcing `<|assistant|>` during generation will reduce the occurrences of these gibberish results as expected since this is an Instruct model, however it's still best to add a reward function to penalize bad generations, as described in the next section.
{% endhint %}

## :medal:Reward Functions to reduce gibberish

To penalize `addCriterion` and gibberish outputs, we edited the reward function to penalize too much of `addCriterion` and newlines.
```

Example 4 (unknown):
```unknown
## :checkered\_flag:GSPO Reinforcement Learning

This update in addition adds GSPO ([Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071)) which is a variant of GRPO made by the Qwen team at Alibaba. They noticed that GRPO implicitly results in importance weights for each token, even though explicitly advantages do not scale or change with each token.

This lead to the creation of GSPO, which now assigns the importance on the sequence likelihood rather than the individual token likelihoods of the tokens. The difference between these two algorithms can be seen below, both from the GSPO paper from Qwen and Alibaba:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-45d743dd5dcd590626777ce09cfab61808aa8c24%2Fimage.png?alt=media" alt="" width="563"><figcaption><p>GRPO Algorithm, Source: <a href="https://arxiv.org/abs/2507.18071">Qwen</a></p></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ee755850cbe17482ce240dde227d55c62e9a3e64%2Fimage.png?alt=media" alt="" width="563"><figcaption><p>GSPO algorithm, Source: <a href="https://arxiv.org/abs/2507.18071">Qwen</a></p></figcaption></figure>

In Equation 1, it can be seen that the advantages scale each of the rows into the token logprobs before that tensor is sumed. Essentially, each token is given the same scaling even though that scaling was given to the entire sequence rather than each individual token. A simple diagram of this can be seen below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b3c944808a15dde0a7ff45782f9f074993304bf1%2FCopy%20of%20GSPO%20diagram%20(1).jpg?alt=media" alt="" width="286"><figcaption><p>GRPO Logprob Ratio row wise scaled with advantages</p></figcaption></figure>

Equation 2 shows that the logprob ratios for each sequence is summed and exponentiated after the Logprob ratios are computed, and only the resulting now sequence ratios get row wise multiplied by the advantages.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-62fc5b50921e79cce155d2794201c9b96faf941e%2FGSPO%20diagram%20(1).jpg?alt=media" alt="" width="313"><figcaption><p>GSPO Sequence Ratio row wise scaled with advantages</p></figcaption></figure>

Enabling GSPO is simple, all you need to do is set the `importance_sampling_level = "sequence"` flag in the GRPO config.
```

---

## Advanced RL Documentation

**URL:** llms-txt#advanced-rl-documentation

**Contents:**
- Training Parameters
- Generation Parameters
- Batch & Throughput Parameters
  - Parameters that control batches
  - GRPO Batch Examples
  - Quick Formula Reference

Advanced documentation settings when using Unsloth with GRPO.

Detailed guides on doing GRPO with Unsloth for Batching, Generation & Training Parameters:

## Training Parameters

* **`beta`** *(float, default 0.0)*: KL coefficient.
  * `0.0` ⇒ no reference model loaded (lower memory, faster).
  * Higher `beta` constrains the policy to stay closer to the ref policy.
* **`num_iterations`** *(int, default 1)*: PPO epochs per batch (μ in the algorithm).\
  Replays data within each gradient accumulation step; e.g., `2` = two forward passes per accumulation step.
* **`epsilon`** *(float, default 0.2)*: Clipping value for token-level log-prob ratios (typical ratio range ≈ \[-1.2, 1.2] with default ε).
* **`delta`** *(float, optional)*: Enables **upper** clipping bound for **two-sided GRPO** when set. If `None`, standard GRPO clipping is used. Recommended `> 1 + ε` when enabled (per INTELLECT-2 report).
* **`epsilon_high`** *(float, optional)*: Upper-bound epsilon; defaults to `epsilon` if unset. DAPO recommends **0.28**.
* **`importance_sampling_level`** *(“token” | “sequence”, default "token")*:
  * `"token"`: raw per-token ratios (one weight per token).
  * `"sequence"`: average per-token ratios to a single sequence-level ratio.\
    GSPO shows sequence-level sampling often gives more stable training for sequence-level rewards.
* **`reward_weights`** *(list\[float], optional)*: One weight per reward. If `None`, all weights = 1.0.
* **`scale_rewards`** *(str|bool, default "group")*:
  * `True` or `"group"`: scale by **std within each group** (unit variance in group).
  * `"batch"`: scale by **std across the entire batch** (per PPO-Lite).
  * `False` or `"none"`: **no scaling**. Dr. GRPO recommends not scaling to avoid difficulty bias from std scaling.
* **`loss_type`** *(str, default "dapo")*:
  * `"grpo"`: normalizes over sequence length (length bias; not recommended).
  * `"dr_grpo"`: normalizes by a **global constant** (introduced in Dr. GRPO; removes length bias). Constant ≈ `max_completion_length`.
  * `"dapo"` **(default)**: normalizes by **active tokens in the global accumulated batch** (introduced in DAPO; removes length bias).
  * `"bnpo"`: normalizes by **active tokens in the local batch** only (results can vary with local batch size; equals GRPO when `per_device_train_batch_size == 1`).
* **`mask_truncated_completions`** *(bool, default False)*:\
  When `True`, truncated completions are excluded from loss (recommended by DAPO for stability).\
  **Note**: There are some KL issues with this flag, so we recommend to disable it.

This can zero out all `completion_mask` entries when many completions are truncated, making `n_mask_per_reward = 0` and causing KL to become NaN. [See](https://github.com/unslothai/unsloth-zoo/blob/e705f7cb50aa3470a0b6e36052c61b7486a39133/unsloth_zoo/rl_replacements.py#L184)
* **`vllm_importance_sampling_correction`** *(bool, default True)*:\
  Applies **Truncated Importance Sampling (TIS)** to correct off-policy effects when generation (e.g., vLLM / fast\_inference) differs from training backend.\
  In Unsloth, this is **auto-set to True** if you’re using vLLM/fast\_inference; otherwise **False**.
* **`vllm_importance_sampling_cap`** *(float, default 2.0)*:\
  Truncation parameter **C** for TIS; sets an upper bound on the importance sampling ratio to improve stability.
* **`dtype`** when choosing float16 or bfloat16, see [fp16-vs-bf16-for-rl](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/fp16-vs-bf16-for-rl "mention")

## Generation Parameters

* `temperature (float, defaults to 1.0):`\
  Temperature for sampling. The higher the temperature, the more random the completions. Make sure you use a relatively high (1.0) temperature to have diversity in generations which helps learning.
* `top_p (float, optional, defaults to 1.0):`\
  Float that controls the cumulative probability of the top tokens to consider. Must be in (0, 1]. Set to 1.0 to consider all tokens.
* `top_k (int, optional):`\
  Number of highest probability vocabulary tokens to keep for top-k-filtering. If None, top-k-filtering is disabled and all tokens are considered.
* `min_p (float, optional):`\
  Minimum token probability, which will be scaled by the probability of the most likely token. It must be a value between 0.0 and 1.0. Typical values are in the 0.01-0.2 range.
* `repetition_penalty (float, optional, defaults to 1.0):`\
  Float that penalizes new tokens based on whether they appear in the prompt and the generated text so far. Values > 1.0 encourage the model to use new tokens, while values < 1.0 encourage the model to repeat tokens.
* `steps_per_generation: (int, optional):`\
  Number of steps per generation. If None, it defaults to `gradient_accumulation_steps`. Mutually exclusive with `generation_batch_size`.

{% hint style="info" %}
It is a bit confusing to mess with this parameter, it is recommended to edit `per_device_train_batch_size` and gradient accumulation for the batch sizes
{% endhint %}

## Batch & Throughput Parameters

### Parameters that control batches

* **`train_batch_size`**: Number of samples **per process** per step.\
  If this integer is **less than `num_generations`**, it will default to `num_generations`.
* **`steps_per_generation`**: Number of **microbatches** that contribute to **one generation’s** loss calculation (forward passes only).\
  A new batch of data is generated every `steps_per_generation` steps; backpropagation timing depends on `gradient_accumulation_steps`.
* **`num_processes`**: Number of distributed training processes (e.g., GPUs / workers).
* **`gradient_accumulation_steps`** (aka `gradient_accumulation`): Number of microbatches to accumulate **before** applying backpropagation and optimizer update.
* **Effective batch size**:

Total samples contributing to gradients before an update (across all processes and steps).
* **Optimizer steps per generation**:

Example: `4 / 2 = 2`.
* **`num_generations`**: Number of generations produced **per prompt** (applied **after** computing `effective_batch_size`).\
  The number of **unique prompts** in a generation cycle is:

**Must be > 2** for GRPO to work.

### GRPO Batch Examples

The tables below illustrate how batches flow through steps, when optimizer updates occur, and how new batches are generated.

**Generation cycle A**

| Step | Batch    | Notes                                  |
| ---: | -------- | -------------------------------------- |
|    0 | \[0,0,0] |                                        |
|    1 | \[1,1,1] | → optimizer update (accum = 2 reached) |
|    2 | \[2,2,2] |                                        |
|    3 | \[3,3,3] | optimizer update                       |

**Generation cycle B**

| Step | Batch    | Notes                                  |
| ---: | -------- | -------------------------------------- |
|    0 | \[4,4,4] |                                        |
|    1 | \[5,5,5] | → optimizer update (accum = 2 reached) |
|    2 | \[6,6,6] |                                        |
|    3 | \[7,7,7] | optimizer update                       |

**Generation cycle A**

| Step | Batch    | Notes                                |
| ---: | -------- | ------------------------------------ |
|    0 | \[0,0,0] |                                      |
|    1 | \[1,1,1] |                                      |
|    2 | \[2,2,2] |                                      |
|    3 | \[3,3,3] | optimizer update (accum = 4 reached) |

**Generation cycle B**

| Step | Batch    | Notes                                |
| ---: | -------- | ------------------------------------ |
|    0 | \[4,4,4] |                                      |
|    1 | \[5,5,5] |                                      |
|    2 | \[6,6,6] |                                      |
|    3 | \[7,7,7] | optimizer update (accum = 4 reached) |

**Generation cycle A**

| Step | Batch    | Notes                                |
| ---: | -------- | ------------------------------------ |
|    0 | \[0,0,0] |                                      |
|    1 | \[0,1,1] |                                      |
|    2 | \[1,1,3] |                                      |
|    3 | \[3,3,3] | optimizer update (accum = 4 reached) |

**Generation cycle B**

| Step | Batch    | Notes                                |
| ---: | -------- | ------------------------------------ |
|    0 | \[4,4,4] |                                      |
|    1 | \[4,5,5] |                                      |
|    2 | \[5,5,6] |                                      |
|    3 | \[6,6,6] | optimizer update (accum = 4 reached) |

**Generation cycle A**

| Step | Batch           | Notes                                |
| ---: | --------------- | ------------------------------------ |
|    0 | \[0,0,0, 1,1,1] |                                      |
|    1 | \[2,2,2, 3,3,3] | optimizer update (accum = 2 reached) |

**Generation cycle B**

| Step | Batch           | Notes                                |
| ---: | --------------- | ------------------------------------ |
|    0 | \[4,4,4, 5,5,5] |                                      |
|    1 | \[6,6,6, 7,7,7] | optimizer update (accum = 2 reached) |

### Quick Formula Reference

**Examples:**

Example 1 (python):
```python
# If mask_truncated_completions is enabled, zero out truncated completions in completion_mask
  if self.mask_truncated_completions:
      truncated_completions = ~is_eos.any(dim=1)
      completion_mask = completion_mask * (~truncated_completions).unsqueeze(1).int()
```

Example 2 (unknown):
```unknown
effective_batch_size = steps_per_generation * num_processes * train_batch_size
```

Example 3 (unknown):
```unknown
optimizer_steps_per_generation = steps_per_generation / gradient_accumulation_steps
```

Example 4 (unknown):
```unknown
unique_prompts = effective_batch_size / num_generations
```

---

## Continued Pretraining

**URL:** llms-txt#continued-pretraining

**Contents:**
- What is Continued Pretraining?
- Advanced Features:
  - Loading LoRA adapters for continued finetuning
  - Continued Pretraining & Finetuning the `lm_head` and `embed_tokens` matrices

AKA as Continued Finetuning. Unsloth allows you to continually pretrain so a model can learn a new language.

* The [text completion notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_\(7B\)-Text_Completion.ipynb) is for continued pretraining/raw text.
* The [continued pretraining notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-CPT.ipynb) is for learning another language.

You can read more about continued pretraining and our release in our [blog post](https://unsloth.ai/blog/contpretraining).

## What is Continued Pretraining?

Continued or continual pretraining (CPT) is necessary to “steer” the language model to understand new domains of knowledge, or out of distribution domains. Base models like Llama-3 8b or Mistral 7b are first pretrained on gigantic datasets of trillions of tokens (Llama-3 for e.g. is 15 trillion).

But sometimes these models have not been well trained on other languages, or text specific domains, like law, medicine or other areas. So continued pretraining (CPT) is necessary to make the language model learn new tokens or datasets.

## Advanced Features:

### Loading LoRA adapters for continued finetuning

If you saved a LoRA adapter through Unsloth, you can also continue training using your LoRA weights. The optimizer state will be reset as well. To load even optimizer states to continue finetuning, see the next section.

### Continued Pretraining & Finetuning the `lm_head` and `embed_tokens` matrices

Add `lm_head` and `embed_tokens`. For Colab, sometimes you will go out of memory for Llama-3 8b. If so, just add `lm_head`.

Then use 2 different learning rates - a 2-10x smaller one for the `lm_head` or `embed_tokens` like so:

**Examples:**

Example 1 (python):
```python
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "LORA_MODEL_NAME",
    max_seq_length = max_seq_length,
    dtype = dtype,
    load_in_4bit = load_in_4bit,
)
trainer = Trainer(...)
trainer.train()
```

Example 2 (python):
```python
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj",
                      "lm_head", "embed_tokens",],
    lora_alpha = 16,
)
```

Example 3 (python):
```python
from unsloth import UnslothTrainer, UnslothTrainingArguments

trainer = UnslothTrainer(
    ....
    args = UnslothTrainingArguments(
        ....
        learning_rate = 5e-5,
        embedding_learning_rate = 5e-6, # 2-10x smaller than learning_rate
    ),
)
```

---

## Datasets Guide

**URL:** llms-txt#datasets-guide

**Contents:**
- What is a Dataset?
  - Data Format
- Getting Started
- Formatting the Data
  - Common Data Formats for LLM Training
  - Applying Chat Templates with Unsloth
  - Formatting Data Q\&A
- Synthetic Data Generation
  - Synthetic Dataset Notebook
  - Using a local LLM or ChatGPT for synthetic data

Learn how to create & prepare a dataset for fine-tuning.

## What is a Dataset?

For LLMs, datasets are collections of data that can be used to train our models. In order to be useful for training, text data needs to be in a format that can be tokenized. You'll also learn how to [use datasets inside of Unsloth](#applying-chat-templates-with-unsloth).

One of the key parts of creating a dataset is your [chat template](https://docs.unsloth.ai/basics/chat-templates) and how you are going to design it. Tokenization is also important as it breaks text into tokens, which can be words, sub-words, or characters so LLMs can process it effectively. These tokens are then turned into embeddings and are adjusted to help the model understand the meaning and context.

To enable the process of tokenization, datasets need to be in a format that can be read by a tokenizer.

<table data-full-width="false"><thead><tr><th>Format</th><th>Description</th><th>Training Type</th></tr></thead><tbody><tr><td>Raw Corpus</td><td>Raw text from a source such as a website, book, or article.</td><td>Continued Pretraining (CPT)</td></tr><tr><td>Instruct</td><td>Instructions for the model to follow and an example of the output to aim for.</td><td>Supervised fine-tuning (SFT)</td></tr><tr><td>Conversation</td><td>Multiple-turn conversation between a user and an AI assistant.</td><td>Supervised fine-tuning (SFT)</td></tr><tr><td>RLHF</td><td>Conversation between a user and an AI assistant, with the assistant's responses being ranked by a script, another model or human evaluator.</td><td>Reinforcement Learning (RL)</td></tr></tbody></table>

{% hint style="info" %}
It's worth noting that different styles of format exist for each of these types.
{% endhint %}

Before we format our data, we want to identify the following:

{% stepper %}
{% step %} <mark style="color:green;">Purpose of dataset</mark>

Knowing the purpose of the dataset will help us determine what data we need and format to use.

The purpose could be, adapting a model to a new task such as summarization or improving a model's ability to role-play a specific character. For example:

* Chat-based dialogues (Q\&A, learn a new language, customer support, conversations).
* Structured tasks ([classification](https://colab.research.google.com/github/timothelaborie/text_classification_scripts/blob/main/unsloth_classification.ipynb), summarization, generation tasks).
* Domain-specific data (medical, finance, technical).
  {% endstep %}

{% step %} <mark style="color:green;">Style of output</mark>

The style of output will let us know what sources of data we will use to reach our desired output.

For example, the type of output you want to achieve could be JSON, HTML, text or code. Or perhaps you want it to be Spanish, English or German etc.
{% endstep %}

{% step %} <mark style="color:green;">Data source</mark>

When we know the purpose and style of the data we need, we need to analyze the quality and [quantity](#how-big-should-my-dataset-be) of the data. Hugging Face and Wikipedia are great sources of datasets and Wikipedia is especially useful if you are looking to train a model to learn a language.

The Source of data can be a CSV file, PDF or even a website. You can also [synthetically generate](#synthetic-data-generation) data but extra care is required to make sure each example is high quality and relevant.
{% endstep %}
{% endstepper %}

{% hint style="success" %}
One of the best ways to create a better dataset is by combining it with a more generalized dataset from Hugging Face like ShareGPT to make your model smarter and diverse. You could also add [synthetically generated data](#synthetic-data-generation).
{% endhint %}

## Formatting the Data

When we have identified the relevant criteria, and collected the necessary data, we can then format our data into a machine readable format that is ready for training.

### Common Data Formats for LLM Training

For [**continued pretraining**](https://docs.unsloth.ai/basics/continued-pretraining), we use raw text format without specific structure:

This format preserves natural language flow and allows the model to learn from continuous text.

If we are adapting a model to a new task, and intend for the model to output text in a single turn based on a specific set of instructions, we can use **Instruction** format in [Alpaca style](https://docs.unsloth.ai/basics/tutorial-how-to-finetune-llama-3-and-use-in-ollama#id-6.-alpaca-dataset)

When we want multiple turns of conversation we can use the ShareGPT format:

The template format uses the "from"/"value" attribute keys and messages alternates between `human`and `gpt`, allowing for natural dialogue flow.

The other common format is OpenAI's ChatML format and is what Hugging Face defaults to. This is probably the most used format, and alternates between `user` and `assistant`

### Applying Chat Templates with Unsloth

For datasets that usually follow the common chatml format, the process of preparing the dataset for training or finetuning, consists of four simple steps:

* Check the chat templates that Unsloth currently supports:\\

\
  This will print out the list of templates currently supported by Unsloth. Here is an example output:\\

\\
* Use `get_chat_template` to apply the right chat template to your tokenizer:\\

\\
* Define your formatting function. Here's an example:\\

\
  \
  This function loops through your dataset applying the chat template you defined to each sample.\\
* Finally, let's load the dataset and apply the required modifications to our dataset: \\

\
  If your dataset uses the ShareGPT format with "from"/"value" keys instead of the ChatML "role"/"content" format, you can use the `standardize_sharegpt` function to convert it first. The revised code will now look as follows:\
  \\

### Formatting Data Q\&A

<mark style="color:green;">**Q:**</mark> How can I use the Alpaca instruct format?

<mark style="color:green;">**A:**</mark> If your dataset is already formatted in the Alpaca format, then follow the formatting steps as shown in the Llama3.1 [notebook ](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_\(8B\)-Alpaca.ipynb#scrollTo=LjY75GoYUCB8). If you need to convert your data to the Alpaca format, one approach is to create a Python script to process your raw data. If you're working on a summarization task, you can use a local LLM to generate instructions and outputs for each example.

<mark style="color:green;">**Q:**</mark> Should I always use the standardize\_sharegpt method?

<mark style="color:green;">**A:**</mark> Only use the standardize\_sharegpt method if your target dataset is formatted in the sharegpt format, but your model expect a ChatML format instead.

\ <mark style="color:green;">**Q:**</mark> Why not use the apply\_chat\_template function that comes with the tokenizer.

<mark style="color:green;">**A:**</mark> The `chat_template` attribute when a model is first uploaded by the original model owners sometimes contains errors and may take time to be updated. In contrast, at Unsloth, we thoroughly check and fix any errors in the `chat_template` for every model when we upload the quantized versions to our repositories. Additionally, our `get_chat_template` and `apply_chat_template` methods offer advanced data manipulation features, which are fully documented on our Chat Templates documentation [page](https://docs.unsloth.ai/basics/chat-templates).

<mark style="color:green;">**Q:**</mark> What if my template is not currently supported by Unsloth?

<mark style="color:green;">**A:**</mark> Submit a feature request on the unsloth github issues [forum](https://github.com/unslothai/unsloth). As a temporary workaround, you could also use the tokenizer's own apply\_chat\_template function until your feature request is approved and merged.

## Synthetic Data Generation

You can also use any local LLM like Llama 3.3 (70B) or OpenAI's GPT 4.5 to generate synthetic data. Generally, it is better to use a bigger like Llama 3.3 (70B) to ensure the highest quality outputs. You can directly use inference engines like vLLM, Ollama or llama.cpp to generate synthetic data but it will require some manual work to collect it and prompt for more data. There's 3 goals for synthetic data:

* Produce entirely new data - either from scratch or from your existing dataset
* Diversify your dataset so your model does not [overfit](https://docs.unsloth.ai/get-started/lora-hyperparameters-guide#avoiding-overfitting-and-underfitting) and become too specific
* Augment existing data e.g. automatically structure your dataset in the correct chosen format

### Synthetic Dataset Notebook

We collaborated with Meta to launch a free notebook for creating Synthetic Datasets automatically using local models like Llama 3.2. [Access the notebook here.](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Meta_Synthetic_Data_Llama3_2_\(3B\).ipynb)

What the notebook does:

* Auto-parses PDFs, websites, YouTube videos and more
* Uses Meta’s Synthetic Data Kit + Llama 3.2 (3B) to generate QA pairs
* Cleans and filters the data automatically
* Fine-tunes the dataset with Unsloth + Llama
* Notebook is fully done locally with no API calling necessary

### Using a local LLM or ChatGPT for synthetic data

Your goal is to prompt the model to generate and process QA data that is in your specified format. The model will need to learn the structure that you provided and also the context so ensure you at least have 10 examples of data already. Examples prompts:

* **Prompt for generating more dialogue on an existing dataset**:

<pre data-overflow="wrap"><code><strong>Using the dataset example I provided, follow the structure and generate conversations based on the examples.
  </strong></code></pre>
* **Prompt if you no have dataset**:

{% code overflow="wrap" %}

{% endcode %}
* **Prompt for a dataset without formatting**:

{% code overflow="wrap" %}

It is recommended to check the quality of generated data to remove or improve on irrelevant or poor-quality responses. Depending on your dataset it may also have to be balanced in many areas so your model does not overfit. You can then feed this cleaned dataset back into your LLM to regenerate data, now with even more guidance.

## Dataset FAQ + Tips

### How big should my dataset be?

We generally recommend using a bare minimum of at least 100 rows of data for fine-tuning to achieve reasonable results. For optimal performance, a dataset with over 1,000 rows is preferable, and in this case, more data usually leads to better outcomes. If your dataset is too small you can also add synthetic data or add a dataset from Hugging Face to diversify it. However, the effectiveness of your fine-tuned model depends heavily on the quality of the dataset, so be sure to thoroughly clean and prepare your data.

### How should I structure my dataset if I want to fine-tune a reasoning model?

If you want to fine-tune a model that already has reasoning capabilities like the distilled versions of DeepSeek-R1 (e.g. DeepSeek-R1-Distill-Llama-8B), you will need to still follow question/task and answer pairs however, for your answer you will need to change the answer so it includes reasoning/chain-of-thought process and the steps it took to derive the answer.\
\
For a model that does not have reasoning and you want to train it so that it later encompasses reasoning capabilities, you will need to utilize a standard dataset but this time without reasoning in its answers. This is training process is known as [Reinforcement Learning and GRPO](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide).

### Multiple datasets

If you have multiple datasets for fine-tuning, you can either:

* Standardize the format of all datasets, combine them into a single dataset, and fine-tune on this unified dataset.
* Use the [Multiple Datasets](https://colab.research.google.com/drive/1njCCbE1YVal9xC83hjdo2hiGItpY_D6t?usp=sharing) notebook to fine-tune on multiple datasets directly.

### Can I fine-tune the same model multiple times?

You can fine-tune an already fine-tuned model multiple times, but it's best to combine all the datasets and perform the fine-tuning in a single process instead. Training an already fine-tuned model can potentially alter the quality and knowledge acquired during the previous fine-tuning process.

## Using Datasets in Unsloth

See an example of using the Alpaca dataset inside of Unsloth on Google Colab:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1d66d8714e44d90513dd87b9356eec67886ab3f7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

We will now use the Alpaca Dataset created by calling GPT-4 itself. It is a list of 52,000 instructions and outputs which was very popular when Llama-1 was released, since it made finetuning a base LLM be competitive with ChatGPT itself.

You can access the GPT4 version of the Alpaca dataset [here](https://huggingface.co/datasets/vicgalle/alpaca-gpt4.). Below shows some examples of the dataset:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0dde50e386e7b245d3e8a57e10a4a81755b3769a%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

You can see there are 3 columns in each row - an instruction, and input and an output. We essentially combine each row into 1 large prompt like below. We then use this to finetune the language model, and this made it very similar to ChatGPT. We call this process **supervised instruction finetuning**.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8b3663c5d80adcb935ff77661500f08e13c9af2d%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

### Multiple columns for finetuning

But a big issue is for ChatGPT style assistants, we only allow 1 instruction / 1 prompt, and not multiple columns / inputs. For example in ChatGPT, you can see we must submit 1 prompt, and not multiple prompts.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d90162c2685ced871f4151369aadcaee40a9c54f%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

This essentially means we have to "merge" multiple columns into 1 large prompt for finetuning to actually function!

For example the very famous Titanic dataset has many many columns. Your job was to predict whether a passenger has survived or died based on their age, passenger class, fare price etc. We can't simply pass this into ChatGPT, but rather, we have to "merge" this information into 1 large prompt.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a2df04874bfc879182cb66c789341d49700227ea%2FMerge.png?alt=media" alt=""><figcaption></figcaption></figure>

For example, if we ask ChatGPT with our "merged" single prompt which includes all the information for that passenger, we can then ask it to guess or predict whether the passenger has died or survived.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b3da2b36afe37469cd3962f37186e758871864a5%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Other finetuning libraries require you to manually prepare your dataset for finetuning, by merging all your columns into 1 prompt. In Unsloth, we simply provide the function called `to_sharegpt` which does this in 1 go!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-62b94dc44f2e343020d31de575f52eb22be4b0fc%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Now this is a bit more complicated, since we allow a lot of customization, but there are a few points:

* You must enclose all columns in curly braces `{}`. These are the column names in the actual CSV / Excel file.
* Optional text components must be enclosed in `[[]]`. For example if the column "input" is empty, the merging function will not show the text and skip this. This is useful for datasets with missing values.
* Select the output or target / prediction column in `output_column_name`. For the Alpaca dataset, this will be `output`.

For example in the Titanic dataset, we can create a large merged prompt format like below, where each column / piece of text becomes optional.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e6228cf6e5c0bb4e4b45e6f3e045910d567c33d2%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

For example, pretend the dataset looks like this with a lot of missing data:

| Embarked | Age | Fare |
| -------- | --- | ---- |
| S        | 23  |      |
|          | 18  | 7.25 |

Then, we do not want the result to be:

1. The passenger embarked from S. Their age is 23. Their fare is **EMPTY**.
2. The passenger embarked from **EMPTY**. Their age is 18. Their fare is $7.25.

Instead by optionally enclosing columns using `[[]]`, we can exclude this information entirely.

1. \[\[The passenger embarked from S.]] \[\[Their age is 23.]] \[\[Their fare is **EMPTY**.]]
2. \[\[The passenger embarked from **EMPTY**.]] \[\[Their age is 18.]] \[\[Their fare is $7.25.]]

1. The passenger embarked from S. Their age is 23.
2. Their age is 18. Their fare is $7.25.

### Multi turn conversations

A bit issue if you didn't notice is the Alpaca dataset is single turn, whilst remember using ChatGPT was interactive and you can talk to it in multiple turns. For example, the left is what we want, but the right which is the Alpaca dataset only provides singular conversations. We want the finetuned language model to somehow learn how to do multi turn conversations just like ChatGPT.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2a65cd74ddd03a6bcbbc9827d9d034e4879a8e6a%2Fdiff.png?alt=media" alt=""><figcaption></figcaption></figure>

So we introduced the `conversation_extension` parameter, which essentially selects some random rows in your single turn dataset, and merges them into 1 conversation! For example, if you set it to 3, we randomly select 3 rows and merge them into 1! Setting them too long can make training slower, but could make your chatbot and final finetune much better!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2b1b3494b260f1102942d86143a885225c6a06f2%2Fcombine.png?alt=media" alt=""><figcaption></figcaption></figure>

Then set `output_column_name` to the prediction / output column. For the Alpaca dataset dataset, it would be the output column.

We then use the `standardize_sharegpt` function to just make the dataset in a correct format for finetuning! Always call this!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7bf83bf802191bda9e417bbe45afa181e7f24f38%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## Vision Fine-tuning

The dataset for fine-tuning a vision or multimodal model also includes image inputs. For example, the [Llama 3.2 Vision Notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(11B\)-Vision.ipynb#scrollTo=vITh0KVJ10qX) uses a radiography case to show how AI can help medical professionals analyze X-rays, CT scans, and ultrasounds more efficiently.

We'll be using a sampled version of the ROCO radiography dataset. You can access the dataset [here](https://www.google.com/url?q=https%3A%2F%2Fhuggingface.co%2Fdatasets%2Funsloth%2FRadiology_mini). The dataset includes X-rays, CT scans and ultrasounds showcasing medical conditions and diseases. Each image has a caption written by experts describing it. The goal is to finetune a VLM to make it a useful analysis tool for medical professionals.

Let's take a look at the dataset, and check what the 1st example shows:

| Image                                                                                                                                                                                                                                                                              | Caption                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| <div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-97d4489827403bd4795494f33d01a10979788c30%2Fxray.png?alt=media" alt="" width="164"><figcaption></figcaption></figure></div> | Panoramic radiography shows an osteolytic lesion in the right posterior maxilla with resorption of the floor of the maxillary sinus (arrows). |

To format the dataset, all vision finetuning tasks should be formatted as follows:

We will craft an custom instruction asking the VLM to be an expert radiographer. Notice also instead of just 1 instruction, you can add multiple turns to make it a dynamic conversation.

Let's convert the dataset into the "correct" format for finetuning:

The first example is now structured like below:

{% code overflow="wrap" %}

Before we do any finetuning, maybe the vision model already knows how to analyse the images? Let's check if this is the case!

For more details, view our dataset section in the [notebook here](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(11B\)-Vision.ipynb#scrollTo=vITh0KVJ10qX).

**Examples:**

Example 1 (json):
```json
"text": "Pasta carbonara is a traditional Roman pasta dish. The sauce is made by mixing raw eggs with grated Pecorino Romano cheese and black pepper. The hot pasta is then tossed with crispy guanciale (cured pork cheek) and the egg mixture, creating a creamy sauce from the residual heat. Despite popular belief, authentic carbonara never contains cream or garlic. The dish likely originated in Rome in the mid-20th century, though its exact origins are debated..."
```

Example 2 (json):
```json
"Instruction": "Task we want the model to perform."

"Input": "Optional, but useful, it will essentially be the user's query."

"Output": "The expected result of the task and the output of the model."
```

Example 3 (json):
```json
{
  "conversations": [
    {
      "from": "human",
      "value": "Can you help me make pasta carbonara?"
    },
    {
      "from": "gpt",
      "value": "Would you like the traditional Roman recipe, or a simpler version?"
    },
    {
      "from": "human",
      "value": "The traditional version please"
    },
    {
      "from": "gpt",
      "value": "The authentic Roman carbonara uses just a few ingredients: pasta, guanciale, eggs, Pecorino Romano, and black pepper. Would you like the detailed recipe?"
    }
  ]
}
```

Example 4 (unknown):
```unknown
{
  "messages": [
    {
      "role": "user",
      "content": "What is 1+1?"
    },
    {
      "role": "assistant",
      "content": "It's 2!"
    },
  ]
}
```

---

## Do model patching and add fast LoRA weights

**URL:** llms-txt#do-model-patching-and-add-fast-lora-weights

model = FastLanguageModel.get_peft_model(
    model,
    r = 64,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj",],
    lora_alpha = 64,
    lora_dropout = 0, # Supports any, but = 0 is optimized
    bias = "none",    # Supports any, but = "none" is optimized
    # [NEW] "unsloth" uses 30% less VRAM, fits 2x larger batch sizes!
    use_gradient_checkpointing = "unsloth", # True or "unsloth" for very long context
    random_state = 3407,
    max_seq_length = max_seq_length,
)

dpo_trainer = DPOTrainer(
    model = model,
    ref_model = None,
    args = TrainingArguments(
        per_device_train_batch_size = 4,
        gradient_accumulation_steps = 8,
        warmup_ratio = 0.1,
        num_train_epochs = 3,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        seed = 42,
        output_dir = "outputs",
    ),
    beta = 0.1,
    train_dataset = YOUR_DATASET_HERE,
    # eval_dataset = YOUR_DATASET_HERE,
    tokenizer = tokenizer,
    max_length = 1024,
    max_prompt_length = 512,
)
dpo_trainer.train()
```

---

## FAQ + Is Fine-tuning Right For Me?

**URL:** llms-txt#faq-+-is-fine-tuning-right-for-me?

**Contents:**
- Understanding Fine-Tuning
  - Real-World Applications of Fine-Tuning
- The Benefits of Fine-Tuning
- Common Misconceptions
  - Does Fine-Tuning Add New Knowledge to a Model?
  - Is RAG Always Better Than Fine-Tuning?
  - Is Fine-Tuning Expensive?
- FAQ:
  - Why You Should Combine RAG & Fine-Tuning
  - LoRA vs. QLoRA: Which One to Use?

If you're stuck on if fine-tuning is right for you, see here! Learn about fine-tuning misconceptions, how it compared to RAG and more:

## Understanding Fine-Tuning

Fine-tuning an LLM customizes its behavior, deepens its domain expertise, and optimizes its performance for specific tasks. By refining a pre-trained model (e.g. *Llama-3.1-8B*) with specialized data, you can:

* **Update Knowledge** – Introduce new, domain-specific information that the base model didn’t originally include.
* **Customize Behavior** – Adjust the model’s tone, personality, or response style to fit specific needs or a brand voice.
* **Optimize for Tasks** – Improve accuracy and relevance on particular tasks or queries your use-case requires.

Think of fine-tuning as creating a specialized expert out of a generalist model. Some debate whether to use Retrieval-Augmented Generation (RAG) instead of fine-tuning, but fine-tuning can incorporate knowledge and behaviors directly into the model in ways RAG cannot. In practice, combining both approaches yields the best results - leading to greater accuracy, better usability, and fewer hallucinations.

### Real-World Applications of Fine-Tuning

Fine-tuning can be applied across various domains and needs. Here are a few practical examples of how it makes a difference:

* **Sentiment Analysis for Finance** – Train an LLM to determine if a news headline impacts a company positively or negatively, tailoring its understanding to financial context.
* **Customer Support Chatbots** – Fine-tune on past customer interactions to provide more accurate and personalized responses in a company’s style and terminology.
* **Legal Document Assistance** – Fine-tune on legal texts (contracts, case law, regulations) for tasks like contract analysis, case law research, or compliance support, ensuring the model uses precise legal language.

## The Benefits of Fine-Tuning

Fine-tuning offers several notable benefits beyond what a base model or a purely retrieval-based system can provide:

#### Fine-Tuning vs. RAG: What’s the Difference?

Fine-tuning can do mostly everything RAG can - but not the other way around. During training, fine-tuning embeds external knowledge directly into the model. This allows the model to handle niche queries, summarize documents, and maintain context without relying on an outside retrieval system. That’s not to say RAG lacks advantages as it is excels at accessing up-to-date information from external databases. It is in fact possible to retrieve fresh data with fine-tuning as well, however it is better to combine RAG with fine-tuning for efficiency.

#### Task-Specific Mastery

Fine-tuning deeply integrates domain knowledge into the model. This makes it highly effective at handling structured, repetitive, or nuanced queries, scenarios where RAG-alone systems often struggle. In other words, a fine-tuned model becomes a specialist in the tasks or content it was trained on.

#### Independence from Retrieval

A fine-tuned model has no dependency on external data sources at inference time. It remains reliable even if a connected retrieval system fails or is incomplete, because all needed information is already within the model’s own parameters. This self-sufficiency means fewer points of failure in production.

#### Faster Responses

Fine-tuned models don’t need to call out to an external knowledge base during generation. Skipping the retrieval step means they can produce answers much more quickly. This speed makes fine-tuned models ideal for time-sensitive applications where every second counts.

#### Custom Behavior and Tone

Fine-tuning allows precise control over how the model communicates. This ensures the model’s responses stay consistent with a brand’s voice, adhere to regulatory requirements, or match specific tone preferences. You get a model that not only knows *what* to say, but *how* to say it in the desired style.

#### Reliable Performance

Even in a hybrid setup that uses both fine-tuning and RAG, the fine-tuned model provides a reliable fallback. If the retrieval component fails to find the right information or returns incorrect data, the model’s built-in knowledge can still generate a useful answer. This guarantees more consistent and robust performance for your system.

## Common Misconceptions

Despite fine-tuning’s advantages, a few myths persist. Let’s address two of the most common misconceptions about fine-tuning:

### Does Fine-Tuning Add New Knowledge to a Model?

**Yes - it absolutely can.** A common myth suggests that fine-tuning doesn’t introduce new knowledge, but in reality it does. If your fine-tuning dataset contains new domain-specific information, the model will learn that content during training and incorporate it into its responses. In effect, fine-tuning *can and does* teach the model new facts and patterns from scratch.

### Is RAG Always Better Than Fine-Tuning?

**Not necessarily.** Many assume RAG will consistently outperform a fine-tuned model, but that’s not the case when fine-tuning is done properly. In fact, a well-tuned model often matches or even surpasses RAG-based systems on specialized tasks. Claims that “RAG is always better” usually stem from fine-tuning attempts that weren’t optimally configured - for example, using incorrect [LoRA parameters](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide) or insufficient training.

Unsloth takes care of these complexities by automatically selecting the best parameter configurations for you. All you need is a good-quality dataset, and you'll get a fine-tuned model that performs to its fullest potential.

### Is Fine-Tuning Expensive?

**Not at all!** While full fine-tuning or pretraining can be costly, these are not necessary (pretraining is especially not necessary). In most cases, LoRA or QLoRA fine-tuning can be done for minimal cost. In fact, with Unsloth’s [free notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks) for Colab or Kaggle, you can fine-tune models without spending a dime. Better yet, you can even fine-tune locally on your own device.

### Why You Should Combine RAG & Fine-Tuning

Instead of choosing between RAG and fine-tuning, consider using **both** together for the best results. Combining a retrieval system with a fine-tuned model brings out the strengths of each approach. Here’s why:

* **Task-Specific Expertise** – Fine-tuning excels at specialized tasks or formats (making the model an expert in a specific area), while RAG keeps the model up-to-date with the latest external knowledge.
* **Better Adaptability** – A fine-tuned model can still give useful answers even if the retrieval component fails or returns incomplete information. Meanwhile, RAG ensures the system stays current without requiring you to retrain the model for every new piece of data.
* **Efficiency** – Fine-tuning provides a strong foundational knowledge base within the model, and RAG handles dynamic or quickly-changing details without the need for exhaustive re-training from scratch. This balance yields an efficient workflow and reduces overall compute costs.

### LoRA vs. QLoRA: Which One to Use?

When it comes to implementing fine-tuning, two popular techniques can dramatically cut down the compute and memory requirements: **LoRA** and **QLoRA**. Here’s a quick comparison of each:

* **LoRA (Low-Rank Adaptation)** – Fine-tunes only a small set of additional “adapter” weight matrices (in 16-bit precision), while leaving most of the original model unchanged. This significantly reduces the number of parameters that need updating during training.
* **QLoRA (Quantized LoRA)** – Combines LoRA with 4-bit quantization of the model weights, enabling efficient fine-tuning of very large models on minimal hardware. By using 4-bit precision where possible, it dramatically lowers memory usage and compute overhead.

We recommend starting with **QLoRA**, as it’s one of the most efficient and accessible methods available. Thanks to Unsloth’s [dynamic 4-bit](https://unsloth.ai/blog/dynamic-4bit) quants, the accuracy loss compared to standard 16-bit LoRA fine-tuning is now negligible.

### Experimentation is Key

There’s no single “best” approach to fine-tuning - only best practices for different scenarios. It’s important to experiment with different methods and configurations to find what works best for your dataset and use case. A great starting point is **QLoRA (4-bit)**, which offers a very cost-effective, resource-friendly way to fine-tune models without heavy computational requirements.

{% content-ref url="../fine-tuning-llms-guide/lora-hyperparameters-guide" %}
[lora-hyperparameters-guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide)
{% endcontent-ref %}

---

## Finetuning from Last Checkpoint

**URL:** llms-txt#finetuning-from-last-checkpoint

**Contents:**
  - Wandb Integration

Checkpointing allows you to save your finetuning progress so you can pause it and then continue.

You must edit the `Trainer` first to add `save_strategy` and `save_steps`. Below saves a checkpoint every 50 steps to the folder `outputs`.

Then in the trainer do:

Which will start from the latest checkpoint and continue training.

### Wandb Integration

**Examples:**

Example 1 (python):
```python
trainer = SFTTrainer(
    ....
    args = TrainingArguments(
        ....
        output_dir = "outputs",
        save_strategy = "steps",
        save_steps = 50,
    ),
)
```

Example 2 (python):
```python
trainer_stats = trainer.train(resume_from_checkpoint = True)
```

---

## Fine-tuning LLMs Guide

**URL:** llms-txt#fine-tuning-llms-guide

**Contents:**
- 1. Understand Fine-tuning
- 2. Choose the Right Model + Method
- 3. Your Dataset
- 4. Understand Training Hyperparameters
- 5. Installing + Requirements
- 6. Training + Evaluation
  - Evaluation
- 7. Running + Saving the model
  - Saving the model
- 8. We're done!

Learn all the basics and best practices of fine-tuning. Beginner-friendly.

## 1. Understand Fine-tuning

Fine-tuning an LLM customizes its behavior, enhances + injects knowledge, and optimizes performance for domains/specific tasks. For example:

* **GPT-5** serves as a base model; however, OpenAI fine-tuned it to better comprehend instructions and prompts, leading to the creation of ChatGPT-5 which everyone uses today.
* ​**DeepSeek-R1-Distill-Llama-8B** is a fine-tuned version of Llama-3.1-8B. DeepSeek utilized data generated by DeepSeek-R1, to fine-tune Llama-3.1-8B. This process, known as distillation (a subcategory of fine-tuning), injects the data into the Llama model to learn reasoning capabilities.

With [Unsloth](https://github.com/unslothai/unsloth), you can fine-tune for free on Colab, Kaggle, or locally with just 3GB VRAM by using our [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks). By fine-tuning a pre-trained model (e.g. Llama-3.1-8B) on a specialized dataset, you can:

* **Update + Learn New Knowledge**: Inject and learn new domain-specific information.
* **Customize Behavior**: Adjust the model’s tone, personality, or response style.
* **Optimize for Tasks**: Improve accuracy and relevance for specific use cases.

**Example usecases**:

* Train LLM to predict if a headline impacts a company positively or negatively.
* Use historical customer interactions for more accurate and custom responses.
* Fine-tune LLM on legal texts for contract analysis, case law research, and compliance.

You can think of a fine-tuned model as a specialized agent designed to do specific tasks more effectively and efficiently. **Fine-tuning can replicate all of RAG's capabilities**, but not vice versa.

#### Fine-tuning misconceptions:

You may have heard that fine-tuning does not make a model learn new knowledge or RAG performs better than fine-tuning. That is **false**. Read more FAQ + misconceptions [here](https://docs.unsloth.ai/fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me#fine-tuning-vs.-rag-whats-the-difference):

{% content-ref url="fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me" %}
[faq-+-is-fine-tuning-right-for-me](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me)
{% endcontent-ref %}

## 2. Choose the Right Model + Method

If you're a beginner, it is best to start with a small instruct model like Llama 3.1 (8B) and experiment from there. You'll also need to decide between QLoRA and LoRA training:

* **LoRA:** Fine-tunes small, trainable matrices in 16-bit without updating all model weights.
* **QLoRA:** Combines LoRA with 4-bit quantization to handle very large models with minimal resources.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-cfc51c261e6d24df3aa967d9b9a482313465cbc1%2Fmodel%20name%20change.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

You can change the model name to whichever model you like by matching it with model's name on Hugging Face e.g. 'unsloth/llama-3.1-8b-unsloth-bnb-4bit'.

We recommend starting with **Instruct models**, as they allow direct fine-tuning using conversational chat templates (ChatML, ShareGPT etc.) and require less data compared to **Base models** (which uses Alpaca, Vicuna etc). Learn more about the differences between [instruct and base models here](https://docs.unsloth.ai/get-started/what-model-should-i-use#instruct-or-base-model).

* Model names ending in **`unsloth-bnb-4bit`** indicate they are [**Unsloth dynamic 4-bit**](https://unsloth.ai/blog/dynamic-4bit) **quants**. These models consume slightly more VRAM than standard BitsAndBytes 4-bit models but offer significantly higher accuracy.
* If a model name ends with just **`bnb-4bit`**, without "unsloth", it refers to a standard BitsAndBytes 4-bit quantization.
* Models with **no suffix** are in their original **16-bit or 8-bit formats**. While they are the original models from the official model creators, we sometimes include important fixes - such as chat template or tokenizer fixes. So it's recommended to use our versions when available.

There are other settings which you can toggle:

* **`max_seq_length = 2048`** – Controls context length. While Llama-3 supports 8192, we recommend 2048 for testing. Unsloth enables 4× longer context fine-tuning.
* **`dtype = None`** – Defaults to None; use `torch.float16` or `torch.bfloat16` for newer GPUs.
* **`load_in_4bit = True`** – Enables 4-bit quantization, reducing memory use 4× for fine-tuning. Disabling it enables LoRA 16-bit fine-tuning. You can also enable 16-bit LoRA with `load_in_16bit = True`
* To enable full fine-tuning (FFT), set `full_finetuning = True`. For 8-bit fine-tuning, set `load_in_8bit = True`.
* **Note:** Only one training method can be set to `True` at a time.

We recommend starting with QLoRA, as it is one of the most accessible and effective methods for training models. Our [dynamic 4-bit](https://unsloth.ai/blog/dynamic-4bit) quants, the accuracy loss for QLoRA compared to LoRA is now largely recovered.

You can also do [Text-to-speech (TTS)](https://docs.unsloth.ai/basics/text-to-speech-tts-fine-tuning), [reasoning (GRPO)](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide), [vision](https://docs.unsloth.ai/basics/vision-fine-tuning), [reinforcement learning](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/reinforcement-learning-dpo-orpo-and-kto) (DPO, ORPO, KTO), [continued pretraining](https://docs.unsloth.ai/basics/continued-pretraining), text completion and other training methodologies with Unsloth.

Read our detailed guide on choosing the right model:

{% content-ref url="fine-tuning-llms-guide/what-model-should-i-use" %}
[what-model-should-i-use](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/what-model-should-i-use)
{% endcontent-ref %}

For LLMs, datasets are collections of data that can be used to train our models. In order to be useful for training, text data needs to be in a format that can be tokenized.

* You will need to create a dataset usually with 2 columns - question and answer. The quality and amount will largely reflect the end result of your fine-tune so it's imperative to get this part right.
* You can [synthetically generate data](https://docs.unsloth.ai/get-started/datasets-guide#synthetic-data-generation) and structure your dataset (into QA pairs) using ChatGPT or local LLMs.
* You can also use our new Synthetic Dataset notebook which automatically parses documents (PDFs, videos etc.), generates QA pairs and auto cleans data using local models like Llama 3.2. [Access the notebook here.](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Meta_Synthetic_Data_Llama3_2_\(3B\).ipynb)
* Fine-tuning can learn from an existing repository of documents and continuously expand its knowledge base, but just dumping data alone won’t work as well. For optimal results, curate a well-structured dataset, ideally as question-answer pairs. This enhances learning, understanding, and response accuracy.
* But, that's not always the case, e.g. if you are fine-tuning a LLM for code, just dumping all your code data can actually enable your model to yield significant performance improvements, even without structured formatting. So it really depends on your use case.

***Read more about creating your dataset:***

{% content-ref url="fine-tuning-llms-guide/datasets-guide" %}
[datasets-guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/datasets-guide)
{% endcontent-ref %}

For most of our notebook examples, we utilize the [Alpaca dataset](https://docs.unsloth.ai/basics/tutorial-how-to-finetune-llama-3-and-use-in-ollama#id-6.-alpaca-dataset) however other notebooks like Vision will use different datasets which may need images in the answer ouput as well.

## 4. Understand Training Hyperparameters

Learn how to choose the right [hyperparameters](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide) using best practices from research and real-world experiments - and understand how each one affects your model's performance.

**For a complete guide on how hyperparameters affect training, see:**

{% content-ref url="fine-tuning-llms-guide/lora-hyperparameters-guide" %}
[lora-hyperparameters-guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide)
{% endcontent-ref %}

## 5. Installing + Requirements

We would recommend beginners to utilise our pre-made [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks) first as it's the easiest way to get started with guided steps. However, if installing locally is a must, you can install and use Unsloth via [docker](https://docs.unsloth.ai/get-started/install-and-update/docker "mention") or `pip install unsloth` - just make sure you have all the right requirements necessary. Also depending on the model and quantization you're using, you'll need enough VRAM and resources. See all the details here:

{% content-ref url="fine-tuning-for-beginners/unsloth-requirements" %}
[unsloth-requirements](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/unsloth-requirements)
{% endcontent-ref %}

Next, you'll need to install Unsloth. Unsloth currently only supports Windows and Linux devices. Once you install Unsloth, you can copy and paste our notebooks and use them in your own local environment. We have many installation methods:

{% content-ref url="install-and-update" %}
[install-and-update](https://docs.unsloth.ai/get-started/install-and-update)
{% endcontent-ref %}

## 6. Training + Evaluation

Once you have everything set, it's time to train! If something's not working, remember you can always change hyperparameters, your dataset etc.

You’ll see a log of numbers during training. This is the training loss, which shows how well the model is learning from your dataset. For many cases, a loss around 0.5 to 1.0 is a good sign, but it depends on your dataset and task. If the loss is not going down, you might need to adjust your settings. If the loss goes to 0, that could mean overfitting, so it's important to check validation too.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-feb9b0f5763d41cecaec9a3a9cd227ad918f0ca7%2Fimage.png?alt=media" alt="" width="375"><figcaption><p>The training loss will appear as numbers</p></figcaption></figure>

We generally recommend keeping the default settings unless you need longer training or larger batch sizes.

* **`per_device_train_batch_size = 2`** – Increase for better GPU utilization but beware of slower training due to padding. Instead, increase `gradient_accumulation_steps` for smoother training.
* **`gradient_accumulation_steps = 4`** – Simulates a larger batch size without increasing memory usage.
* **`max_steps = 60`** – Speeds up training. For full runs, replace with `num_train_epochs = 1` (1–3 epochs recommended to avoid overfitting).
* **`learning_rate = 2e-4`** – Lower for slower but more precise fine-tuning. Try values like `1e-4`, `5e-5`, or `2e-5`.

In order to evaluate, you could do manually evaluation by just chatting with the model and see if it's to your liking. You can also enable evaluation for Unsloth, but keep in mind it can be time-consuming depending on the dataset size. To speed up evaluation you can: reduce the evaluation dataset size or set `evaluation_steps = 100`.

For testing, you can also take 20% of your training data and use that for testing. If you already used all of the training data, then you have to manually evaluate it. You can also use automatic eval tools like EleutherAI’s [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness). Keep in mind that automated tools may not perfectly align with your evaluation criteria.

## 7. Running + Saving the model

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f2d5f23fa62ec89e06bf20fea433f9a1e42a2fe3%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Now let's run the model after we completed the training process! You can edit the yellow underlined part! In fact, because we created a multi turn chatbot, we can now also call the model as if it saw some conversations in the past like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-cdf5d779635901dce7793df92531dbf3caf0fb0a%2Fimage%20(47).png?alt=media" alt=""><figcaption></figcaption></figure>

Reminder Unsloth itself provides **2x faster inference** natively as well, so always do not forget to call `FastLanguageModel.for_inference(model)`. If you want the model to output longer responses, set `max_new_tokens = 128` to some larger number like 256 or 1024. Notice you will have to wait longer for the result as well!

For saving and using your model in desired inference engines like Ollama, vLLM, Open WebUI, we can have more information here:

{% content-ref url="../basics/inference-and-deployment" %}
[inference-and-deployment](https://docs.unsloth.ai/basics/inference-and-deployment)
{% endcontent-ref %}

We can now save the finetuned model as a small 100MB file called a LoRA adapter like below. You can instead push to the Hugging Face hub as well if you want to upload your model! Remember to get a Hugging Face token via: <https://huggingface.co/settings/tokens> and add your token!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8c577103f7c4fe883cabaf35c8437307c6501686%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

After saving the model, we can again use Unsloth to run the model itself! Use `FastLanguageModel` again to call it for inference!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1a1be852ca551240bdce47cf99e6ccd7d31c1326%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

You've successfully fine-tuned a language model and exported it to your desired inference engine with Unsloth!

To learn more about fine-tuning tips and tricks, head over to our blogs which provide tremendous and educational value: <https://unsloth.ai/blog/>

If you need any help on fine-tuning, you can also join our Discord server [here](https://discord.gg/unsloth) or [Reddit r/unsloth](https://www.reddit.com/r/unsloth/). Thanks for reading and hopefully this was helpful!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-69482ba90d417f7bf98dddaf83795cdd3eb20efc%2Fsloth%20sparkling%20square.png?alt=media" alt="" width="188"><figcaption></figcaption></figure>

---

## Fine-tuning LLMs with Blackwell, RTX 50 series & Unsloth

**URL:** llms-txt#fine-tuning-llms-with-blackwell,-rtx-50-series-&-unsloth

**Contents:**
  - Pip install

Learn how to fine-tune LLMs on NVIDIA's Blackwell RTX 50 series and B200 GPUs with our step-by-step guide.

Unsloth now supports NVIDIA’s Blackwell architecture GPUs, including RTX 50-series GPUs (5060–5090), RTX PRO 6000, and GPUS such as B200, B40, GB100, GB102 and more! You can read the official [NVIDIA blogpost here](https://developer.nvidia.com/blog/train-an-llm-on-an-nvidia-blackwell-desktop-with-unsloth-and-scale-it/).

Unsloth is now compatible with every NVIDIA GPU from 2018+ including the [DGX Spark](https://docs.unsloth.ai/basics/fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth).

> **Our new** [**Docker image**](#docker) **supports Blackwell. Run the Docker image and start training!** [**Guide**](https://docs.unsloth.ai/basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth)

Simply install Unsloth:

If you see issues, another option is to create a separate isolated environment:

Note it might be `pip3` or `pip3.13` and also `python3` or `python3.13`

You might encounter some Xformers issues, in which cause you should build from source:

{% code overflow="wrap" %}

**Examples:**

Example 1 (bash):
```bash
pip install unsloth
```

Example 2 (bash):
```bash
python -m venv unsloth
source unsloth/bin/activate
pip install unsloth
```

---

## Fine-tuning LLMs with NVIDIA DGX Spark and Unsloth

**URL:** llms-txt#fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth

**Contents:**
  - ⚡ Step-by-Step Tutorial

Tutorial on how to fine-tune and do reinforcement learning (RL) with OpenAI gpt-oss on NVIDIA DGX Spark.

Unsloth enables local fine-tuning of LLMs with up to **200B parameters** on the NVIDIA DGX™ Spark. With 128 GB of unified memory, you can train massive models such as **gpt-oss-120b**, and run or deploy inference directly on DGX Spark.

As shown at [OpenAI DevDay](https://x.com/UnslothAI/status/1976284209842118714), gpt-oss-20b was trained with RL and Unsloth on DGX Spark to auto-win 2048. You can train using Unsloth in a Docker container or virtual environment on DGX Spark.

<div align="center" data-full-width="false"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ff5c4752dccb8f922b937f8e3b0db58e2d836507%2Funsloth%20nvidia%20dgx%20spark.png?alt=media" alt="" width="375"><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a8472482c49e1763378b609f8f537ca89df60260%2FNotebooks%20on%20dgx.png?alt=media" alt="" width="375"><figcaption></figcaption></figure></div>

In this tutorial, we’ll train gpt-oss-20b with RL using Unsloth notebooks after installing Unsloth on your DGX Spark. gpt-oss-120b will use around **68GB** of unified memory.

After 1,000 steps and 4 hours of RL training, the gpt-oss model greatly outperforms the original on 2048, and longer training would further improve results.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3bdcb0fda2ad188142e58f04c855b6dcfbd5ba94%2Fopenai%20devday%20unsloth%20feature.png?alt=media" alt="" width="375"><figcaption><p>You can watch Unsloth featured on OpenAI DevDay 2025 <a href="https://youtu.be/1HL2YHRj270?si=8SR6EChF34B1g-5r&#x26;t=1080">here</a>.</p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4a8bd4ecc7ee3d123c19158df5dfdcec35df8532%2FScreenshot%202025-10-13%20at%204.22.32%E2%80%AFPM.png?alt=media" alt="" width="375"><figcaption><p>gpt-oss trained with RL consistently outperforms on 2048.</p></figcaption></figure></div>

### ⚡ Step-by-Step Tutorial

{% stepper %}
{% step %}
**Start with Unsloth Docker image for DGX Spark**

First, build the Docker image using the DGX Spark Dockerfile which can be [found here](https://raw.githubusercontent.com/unslothai/notebooks/main/Dockerfile_DGX_Spark). You can also run the below in a Terminal in the DGX Spark:

Then, build the training Docker image using saved Dockerfile:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7ebcf195c154b0e569115e1f9513cf002ee57b16%2Fdgx1.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

<summary>You can also click to see the full DGX Spark Dockerfile</summary>

```python
FROM nvcr.io/nvidia/pytorch:25.09-py3

**Examples:**

Example 1 (bash):
```bash
sudo apt update && sudo apt install -y wget
wget -O Dockerfile "https://raw.githubusercontent.com/unslothai/notebooks/main/Dockerfile_DGX_Spark"
```

Example 2 (bash):
```bash
docker build -f Dockerfile -t unsloth-dgx-spark .
```

---

## For Q8_0:

**URL:** llms-txt#for-q8_0:

**Contents:**
- :question:Why is Q8\_K\_XL slower than Q8\_0 GGUF?
- :question:How to do Evaluation
- :question:Evaluation Loop - Out of Memory or crashing.
- :question:How do I do Early Stopping?
- :question:Downloading gets stuck at 90 to 95%
- :question:RuntimeError: CUDA error: device-side assert triggered
- :question:All labels in your dataset are -100. Training losses will be all 0.
- :question:Some weights of Gemma3nForConditionalGeneration were not initialized from the model checkpoint
- :question:NotImplementedError: A UTF-8 locale is required. Got ANSI
- :green\_book:Citing Unsloth

python llama.cpp/convert_hf_to_gguf.py merged_model \
    --outfile model-Q8_0.gguf --outtype q8_0 \
    --split-max-size 50G
python
new_dataset = dataset.train_test_split(
    test_size = 0.01, # 1% for test size can also be an integer for # of rows
    shuffle = True, # Should always set to True!
    seed = 3407,
)

train_dataset = new_dataset["train"] # Dataset for training
eval_dataset = new_dataset["test"] # Dataset for evaluation
python
from trl import SFTTrainer, SFTConfig
trainer = SFTTrainer(
    args = SFTConfig(
        fp16_full_eval = True,         # Set this to reduce memory usage
        per_device_eval_batch_size = 2,# Increasing this will use more memory
        eval_accumulation_steps = 4,   # You can increase this include of batch_size
        eval_strategy = "steps",       # Runs eval every few steps or epochs.
        eval_steps = 1,                # How many evaluations done per # of training steps
    ),
    train_dataset = new_dataset["train"],
    eval_dataset = new_dataset["test"],
    ...
)
trainer.train()
python
new_dataset = dataset.train_test_split(test_size = 0.01)

from trl import SFTTrainer, SFTConfig
trainer = SFTTrainer(
    args = SFTConfig(
        fp16_full_eval = True,
        per_device_eval_batch_size = 2,
        eval_accumulation_steps = 4,
        eval_strategy = "steps",
        eval_steps = 1,
    ),
    train_dataset = new_dataset["train"],
    eval_dataset = new_dataset["test"],
    ...
)
python
from trl import SFTConfig, SFTTrainer
trainer = SFTTrainer(
    args = SFTConfig(
        fp16_full_eval = True,
        per_device_eval_batch_size = 2,
        eval_accumulation_steps = 4,
        output_dir = "training_checkpoints", # location of saved checkpoints for early stopping
        save_strategy = "steps",             # save model every N steps
        save_steps = 10,                     # how many steps until we save the model
        save_total_limit = 3,                # keep ony 3 saved checkpoints to save disk space
        eval_strategy = "steps",             # evaluate every N steps
        eval_steps = 10,                     # how many steps until we do evaluation
        load_best_model_at_end = True,       # MUST USE for early stopping
        metric_for_best_model = "eval_loss", # metric we want to early stop on
        greater_is_better = False,           # the lower the eval loss, the better
    ),
    model = model,
    tokenizer = tokenizer,
    train_dataset = new_dataset["train"],
    eval_dataset = new_dataset["test"],
)
python
from transformers import EarlyStoppingCallback
early_stopping_callback = EarlyStoppingCallback(
    early_stopping_patience = 3,     # How many steps we will wait if the eval loss doesn't decrease
                                     # For example the loss might increase, but decrease after 3 steps
    early_stopping_threshold = 0.0,  # Can set higher - sets how much loss should decrease by until
                                     # we consider early stopping. For eg 0.01 means if loss was
                                     # 0.02 then 0.01, we consider to early stop the run.
)
trainer.add_callback(early_stopping_callback)
python
import os
os.environ["UNSLOTH_STABLE_DOWNLOADS"] = "1"

from unsloth import FastLanguageModel
python
import os
os.environ["UNSLOTH_COMPILE_DISABLE"] = "1"
os.environ["UNSLOTH_DISABLE_FAST_GENERATION"] = "1"
python
from unsloth.chat_templates import train_on_responses_only
trainer = train_on_responses_only(
    trainer,
    instruction_part = "<|start_header_id|>user<|end_header_id|>\n\n",
    response_part = "<|start_header_id|>assistant<|end_header_id|>\n\n",
)
python
from unsloth.chat_templates import train_on_responses_only
trainer = train_on_responses_only(
    trainer,
    instruction_part = "<start_of_turn>user\n",
    response_part = "<start_of_turn>model\n",
)
python
import locale
locale.getpreferredencoding = lambda: "UTF-8"

@misc{unsloth_2025_qwen3_30b_a3b,
  author       = {Unsloth AI and Han-Chen, Daniel and Han-Chen, Michael},
  title        = {Qwen3-30B-A3B-GGUF:Q8\_K\_XL},
  year         = {2025},
  publisher    = {Hugging Face},
  howpublished = {\url{https://huggingface.co/unsloth/Qwen3-30B-A3B-GGUF}}
}

@misc{unsloth,
  author       = {Unsloth AI and Han-Chen, Daniel and Han-Chen, Michael},
  title        = {Unsloth},
  year         = {2025},
  publisher    = {Github},
  howpublished = {\url{https://github.com/unslothai/unsloth}}
}
```

**Examples:**

Example 1 (unknown):
```unknown
## :question:Why is Q8\_K\_XL slower than Q8\_0 GGUF?

On Mac devices, it seems like that BF16 might be slower than F16. Q8\_K\_XL upcasts some layers to BF16, so hence the slowdown, We are actively changing our conversion process to make F16 the default choice for Q8\_K\_XL to reduce performance hits.

## :question:How to do Evaluation

To set up evaluation in your training run, you first have to split your dataset into a training and test split. You should <mark style="background-color:green;">**always shuffle the selection of the dataset**</mark>, otherwise your evaluation is wrong!
```

Example 2 (unknown):
```unknown
Then, we can set the training arguments to enable evaluation. Reminder evaluation can be very very slow especially if you set `eval_steps = 1` which means you are evaluating every single step. If you are, try reducing the eval\_dataset size to say 100 rows or something.
```

Example 3 (unknown):
```unknown
## :question:Evaluation Loop - Out of Memory or crashing.

A common issue when you OOM is because you set your batch size too high. Set it lower than 2 to use less VRAM. Also use `fp16_full_eval=True` to use float16 for evaluation which cuts memory by 1/2.

First split your training dataset into a train and test split. Set the trainer settings for evaluation to:
```

Example 4 (unknown):
```unknown
This will cause no OOMs and make it somewhat faster. You can also use `bf16_full_eval=True` for bf16 machines. By default Unsloth should have set these flags on by default as of June 2025.

## :question:How do I do Early Stopping?

If you want to stop the finetuning / training run since the evaluation loss is not decreasing, then you can use early stopping which stops the training process. Use `EarlyStoppingCallback`.

As usual, set up your trainer and your evaluation dataset. The below is used to stop the training run if the `eval_loss` (the evaluation loss) is not decreasing after 3 steps or so.
```

---

## FP16 vs BF16 for RL

**URL:** llms-txt#fp16-vs-bf16-for-rl

**Contents:**
  - Float16 vs Bfloat16
  - :exploding\_head:A100 Cascade Attention Bug
  - :fire:Using float16 in Unsloth RL

Defeating the Training-Inference Mismatch via FP16 https\://arxiv.org/pdf/2510.26788 shows how using float16 is better than bfloat16

### Float16 vs Bfloat16

There was a paper titled "**Defeating the Training-Inference Mismatch via FP16**" <https://arxiv.org/pdf/2510.26788> showing how using float16 precision can dramatically be better than using bfloat16 when doing reinforcement learning.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Frec4qe1aQS0xyMzGvS9c%2Fimage.png?alt=media&#x26;token=2137e766-0f1f-48ec-b25f-2292d6f149f4" alt=""><figcaption></figcaption></figure>

In fact the longer the generation, the worse it gets when using bfloat16:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FWs7ioB2lraTbDbUCOAnn%2Fimage.png?alt=media&#x26;token=ac2b4f8e-210f-4bcc-bcbb-6e68f80781a6" alt=""><figcaption></figcaption></figure>

We did an investigation, and **DO find float16 to be more stable** than bfloat16 with much smaller gradient norms see <https://x.com/danielhanchen/status/1985557028295827482> and <https://x.com/danielhanchen/status/1985562902531850472>

{% columns %}
{% column width="50%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FhvQ1W5wtV6TTfsetp7y2%2FG44d7ZFbIAANBBd.jpg?alt=media&#x26;token=35181a07-de3e-4321-b54e-4436b4a201ff" alt=""><figcaption></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F62HkxnGcaKvxnSxbZMZu%2FG44c20SbwAAGo8j.jpg?alt=media&#x26;token=e0c7ecb8-6f0c-4ecf-b1a0-50f1b2a9a807" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column width="50%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fsi18IkGqE4IuUvzroyHh%2FG44ix5FbQAM0L5l.jpg?alt=media&#x26;token=bc3b97ce-5df4-4b69-aa50-a8e339f21601" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### :exploding\_head:A100 Cascade Attention Bug

As per <https://x.com/RichardYRLi/status/1984858850143715759> and <https://yingru.notion.site/When-Speed-Kills-Stability-Demystifying-RL-Collapse-from-the-Training-Inference-Mismatch-271211a558b7808d8b12d403fd15edda>, older vLLM versions (before 0.11.0) had broken attention mechanisms for A100 and similar GPUs. Please update vLLM! We also by default disable cascade attention in vLLM during Unsloth reinforcement learning if we detect an older vLLM version.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FnkCLRVIIGLADXBSCe58e%2Fimage.png?alt=media&#x26;token=6669642f-8690-44bf-b2de-6aa89acf2332" alt=""><figcaption></figcaption></figure>

Different hardware also changes results, where newer and more expensive GPUs have less KL difference between the inference and training sides:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FaroTTz68zzyofy6nagtH%2Fimage.webp?alt=media&#x26;token=3be09506-b8a0-42eb-8d17-af72496a9cd1" alt=""><figcaption></figcaption></figure>

### :fire:Using float16 in Unsloth RL

To use float16 precision in Unsloth GRPO and RL, you just need to set `dtype = torch.float16` and we'll take care of the rest!

{% code overflow="wrap" %}

**Examples:**

Example 1 (python):
```python
from unsloth import FastLanguageModel
import torch
max_seq_length = 2048 # Can increase for longer reasoning traces
lora_rank = 32 # Larger rank = smarter, but slower

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen3-4B-Base",
    max_seq_length = max_seq_length,
    load_in_4bit = False, # False for LoRA 16bit
    fast_inference = True, # Enable vLLM fast inference
    max_lora_rank = lora_rank,
    gpu_memory_utilization = 0.9, # Reduce if out of memory
    
    dtype = torch.float16, # Use torch.float16, torch.bfloat16
)
```

---

## FP8 Reinforcement Learning

**URL:** llms-txt#fp8-reinforcement-learning

**Contents:**
  - :sunflower:FP8 vs BF16 Training
  - :zap:FP8 Performance Benchmarks
  - :shinto\_shrine:Inference = 96% of RL training
  - :1234:60% less memory usage
  - :question:How to use FP8 RL / installation
  - :cd:Implementing FP8 Training
  - 🔥TorchAO Collab
  - :bird:On the fly TorchAO FP8 quantization
  - :tada:Unsloth FP8 uploads
  - :person\_tipping\_hand:Acknowledgements

Train reinforcement learning (RL) and GRPO in FP8 precision with Unsloth.

We're introducing FP8-precision training for RL, making FP8 GRPO now possible on **consumer GPUs** (RTX 40, 50 etc). DeepSeek-R1 demonstrated how powerful FP8 can be and with Unsloth, Qwen3-1.7B FP8 GRPO now works on just **5GB of VRAM**.

Faster RL inference is critical as it's the most compute-intensive workload in RL. We collabed with [TorchAO](https://github.com/pytorch/ao) from PyTorch to enable performance gains with no loss in accuracy.

* **\~1.4× faster** RL inference via [vLLM](https://github.com/vllm-project/vllm) • 2x longer context vs. BF16 and FP16
* **60% less VRAM** and **10× longer** context than other FP8 RL implementations
* Unsloth is the **only framework** to make FP8 RL LoRA work on consumer GPUs (e.g. NVIDIA GeForce RTX 40 and 50 Series). Also works on H100, H200, B200 etc.
* Use `load_in_fp8 = True` within `FastLanguageModel` to enable FP8 RL.
* Though Qwen3-8B fits in 16GB VRAM, free Colab NVIDIA Tesla T4 GPUs **don’t support FP8**. So our notebooks use **24GB L4 GPUs which fits Qwen3-14B**.

**Notebooks:** [Qwen3-8B FP8 GRPO](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_8B_FP8_GRPO.ipynb) and [Llama-3.2-1B FP8 GRPO](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama_FP8_GRPO.ipynb)

{% hint style="success" %}
Bonus: You’ll notice Unsloth now uses much less VRAM. We’ll share details in a new blog soon.
{% endhint %}

Our FP8 support uses Unsloth’s [weight-sharing feature](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl), reducing VRAM use by another **50%**, enabling **10× more** context with no accuracy loss. We use [vLLM](https://github.com/vllm-project/vllm) for fast inference and, our techniques like Unsloth [Standby](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl) and [Flex Attention](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/long-context-gpt-oss-training) to further reduce VRAM use. TorchAO enables universal on the fly FP8, so Llama, Gemma, Mistral & more work. We’ve also [uploaded](#unsloth-fp8-uploads) most FP8 models (including Qwen3).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FNhbi7jRc6zwCAeuddBBk%2Foutput(14).png?alt=media&#x26;token=80ad0712-4626-4536-aa57-29bc53b40540" alt="" width="375"><figcaption><p>Reward plot shows FP8 following the same trend as BF16</p></figcaption></figure>

### :sunflower:FP8 vs BF16 Training

Research shows that FP8 training can largely match BF16 accuracy and if you serve models in FP8, **training and serving in the same precision** helps preserve accuracy. Also FP8 vs BF16 yields 1.6x higher throughput on H100s and has 2x lower memory usage.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FApLfXUBVZSbjpPhRJG6z%2Ffp8%20f16%20quant.png?alt=media&#x26;token=77a2917a-f191-44a7-8597-6796fcf24ed7" alt="" width="375"><figcaption></figcaption></figure>

#### Weight scales & FP8 types

Quantized training stores a low-precision weight (e.g., FP8) plus a higher-precision scale (FP16/BF16/FP32). You approximately recover the original weight via: `original_weight ≈ quantized_weight * weight_scale`

The scale maps the weight’s range into FP8’s representable range. More scales usually improve accuracy, but scales cost extra high-precision memory, so it’s a tradeoff. [DeepSeek R1](https://arxiv.org/abs/2501.12948), for instance, mostly favors block quantization.

There are 3 common FP8 types as defined by vLLM's [llm-compressor](https://github.com/vllm-project/llm-compressor). We benchmarked Qwen3-8B on all 3 types, and also checked throughput, MMLU Pro and GQPA Diamond. We find **FP8 Block-Wise or Per-Channel (-FP8-Dynamic) is the best** in terms of accuracy and throughput.

<table><thead><tr><th width="121">Type</th><th width="225.20001220703125"></th><th width="126.4000244140625">Throughput</th><th width="121.60003662109375">MMLU Pro</th><th>GQPA Diamond</th></tr></thead><tbody><tr><td></td><td>Bfloat16 Baseline</td><td>11,367</td><td><strong>62.04%</strong></td><td>28.79%</td></tr><tr><td>Block-wise</td><td>Scales per block (128X128)</td><td>12,041</td><td><strong>62.37%</strong></td><td><strong>29.29%</strong></td></tr><tr><td>Per-Channel</td><td>1 scale per row or column</td><td>12,963</td><td>61.89%</td><td><strong>31.82%</strong></td></tr><tr><td>Per-Tensor</td><td>1 scale for the whole tensor</td><td><strong>13,681</strong></td><td>61.83%</td><td>27.78%</td></tr></tbody></table>

### :zap:FP8 Performance Benchmarks

Unsloth FP8 RL inference via vLLM is generally 1.4x faster than BF16. You may see even more speed improvements if the model is larger!

#### Accuracy Training loss Benchmarks

We tested multiple models including Qwen3-4B, 8B, 14B, Llama 3.2 1B, 3B, Qwen3-VL-2B, Qwen3-VL 4B and many more. All were trained both in BF16 and FP8. As seen in the plots, the **loss curves during SFT for BF16 and FP8 closely track each other**. There isn’t much to choose between the two data types in terms of training loss:

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FR6Hx9RtgqPXnYxvx5BbR%2FW%26B%20Chart%2025_11_2025%2C%208_54_56%20am.png?alt=media&#x26;token=d1d70d59-df00-45bb-8352-e833f9b5f3cd" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FlUzs2uNkCyF1ulNdrVRc%2FW%26B%20Chart%2025_11_2025%2C%208_56_50%20am.png?alt=media&#x26;token=09545235-c9fa-4b76-a834-ffe0ceb8f639" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

For GRPO specifically, due to generation differences, the goal is to see if the reward plots at least match up and not diverge (sometimes for eg Qwen3-14B runs might not be exactly similar)

{% columns %}
{% column width="50%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FeLBs5GrQb988GcrYVzpF%2FW%26B%20Chart%2025_11_2025%2C%209_00_50%20am.png?alt=media&#x26;token=59220833-33c6-4c28-abe7-b5d0d93a0a17" alt=""><figcaption></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FPqXVeofauAIr5Qngm9d2%2FW%26B%20Chart%2025_11_2025%2C%209_08_06%20am.png?alt=media&#x26;token=16498cf1-17e1-4984-b933-fe3633e19a6b" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column width="50%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FC76ql9G59SB0v3nG3pbL%2FW%26B%20Chart%2025_11_2025%2C%209_05_32%20am.png?alt=media&#x26;token=554b6fe8-c121-48a4-8b33-41f28fc38ebb" alt=""><figcaption></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FqM5NKHjOxqJv0hrzmr2B%2FW%26B%20Chart%2025_11_2025%2C%209_07_12%20am.png?alt=media&#x26;token=a7ad9eb0-0ea2-4364-982a-0875ec63459f" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### :shinto\_shrine:Inference = 96% of RL training

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FTvC7GqMM5XAfV8Zv2tpf%2Fimage.avif?alt=media&#x26;token=62b40c34-3111-40a9-b02a-4bfa8826402d" alt=""><figcaption></figcaption></figure>

In RL, we have to call the LLM / VLM to generate some possible candidate solutions to some run, then we score each possible solution and **reward good solutions, and penalize bad answers**. To achieve maximum efficiency, we must make inference nearly 100% of the training run. In Unsloth, we **managed to make training take only <4% of the entire RL run, with 96% being purely vLLM inference.**

For example for Qwen-3-8B, which is 1.15x faster on shorter sequence lengths, vLLM FP8 itself for inference (without training) throughput is also 1.15x faster. We see our RL run in Unsloth attains also 1.15x faster on tokens processed, showing how **training overhead is negligible in Unsloth.**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F105iKEPXAor00mdUPTfo%2FTokens%20Processed%20during%20RL.svg?alt=media&#x26;token=ca1c1d76-64b2-4019-91ac-7043f0ab79fd" alt=""><figcaption></figcaption></figure>

### :1234:60% less memory usage

In theory, you’d expect memory savings to roughly **equal to the model’s weight memory**, because: optimizer states are still stored in high precision and activations are also stored in high precision (for now). Our findings match the theory. For LoRA fine-tuning, we observed: **\~30 GB saved** for **Qwen3-32B, \~14 GB saved** for **Qwen2.5-14B** and **\~8 GB saved** for **Qwen3-8B**

For **BF16 LoRA fine-tuning on** Qwen3-32B, we were ooming at higher batch sizes and had to shrink the batch. The **FP8 variant had no such issues**, and we could use **larger batch sizes** without OOMing.

Also reminder in Unsloth we share vLLM's memory space for the weights as introduced in [memory-efficient-rl](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl "mention") - we have bought this trick over to the FP8 domain!

| 80GB GPU                                                                                                                                                            | Inference Engine   | Training Engine                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------- |
| Model Weights                                                                                                                                                       | **8GB SHARED FP8** | **<<< SHARED**                           |
| <p><mark style="background-color:purple;"><strong>Multi-purpose</strong></mark></p><p><mark style="background-color:purple;"><strong>72GB space</strong></mark></p> | KV Cache           | Activations, Gradients, Optimizer States |

To enable [Unsloth Standby](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/memory-efficient-rl) for FP8 (or BF16) RL, simply add the below to all RL / GRPO training runs before any Unsloth import:

### :question:How to use FP8 RL / installation

Simply update Unsloth or install Unsloth in a new virtual environment for H100, L4, RTX 50x, RTX 40x, H200s, B200s, and any NVIDIA GPU (consumer or data center grade) released after the RTX 4090.

To update Unsloth: `pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth unsloth_zoo`Or make a new environment:

{% code overflow="wrap" %}

Then use `load_in_fp8 = True` and you're good to go! We'll auto map the model name to the Float8 variant, or we'll on the fly convert the model to Float8!

<pre class="language-python" data-overflow="wrap"><code class="lang-python">import os
os.environ['UNSLOTH_VLLM_STANDBY'] = "1" # Unsloth standby saves 30%+ memory for RL
from unsloth import FastLanguageModel
import torch
max_seq_length = 2048 # Can increase for longer reasoning traces
lora_rank = 32 # Larger rank = smarter, but slower
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen3-8B",
    max_seq_length = max_seq_length,
    load_in_4bit = False, # False for LoRA 16bit
    fast_inference = True, # Enable vLLM fast inference
    max_lora_rank = lora_rank,
<strong>    load_in_fp8 = True, # Float8 RL / GRPO!
</strong>)
</code></pre>

For example on a RTX 5090 (reminder to set `os.environ["UNSLOTH_VLLM_STANDBY"] = "1"` )

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FlVA3v7E5J8pHb1QKLi2V%2Fimage.png?alt=media&#x26;token=20b5329c-6ac2-479a-a4cc-2a0d74486696" alt="" width="375"><figcaption></figcaption></figure>

Then use our 2 FP8 notebooks for RL:

{% columns %}
{% column %}
**Qwen3-8B FP8 RL Colab**

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_8B_FP8_GRPO.ipynb>" %}
{% endcolumn %}

{% column %}
**Llama-3.2-1B-FP8 RL Colab**

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama_FP8_GRPO.ipynb>" %}
{% endcolumn %}
{% endcolumns %}

### :cd:Implementing FP8 Training

Our first reference point was `transformers`, which already supports FP8 in a couple of ways. One of them is a block-quantized matmul implementation: when a layer receives 16‑bit activations, it quantizes them and passes them to a custom FP8 matmul kernel. After wiring this up and benchmarking on an NVIDIA H100, we saw the opposite of what we wanted: fine-tuning became about **4× slower** than standard BF16 fine-tuning.

So we worked with the [TorchAO](https://github.com/pytorch/ao) team (huge thanks to[ Andrew](https://github.com/unslothai/unsloth/pull/3440)) to incorporate TorchAO’s FP8 support into our RL workloads and saw around **1.4× faster throughput** and up to **60% less model memory usage**. At a high level:

* We store the frozen LoRA weights in FP8.
* During the forward pass, we apply dynamic FP8 quantization to the input activations, while keeping the trainable LoRA adapters in BF16.
* These FP8 weights share the same buffers as the vLLM model weights, so there’s only a single FP8 copy of the model in memory at any time (no “double model” memory overhead).
* In the backward pass, we dequantize the LoRA weights so all gradient computation is done in BF16 for better accuracy.

This general setup works across all supported RL algorithms, including [GSPO](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/gspo-reinforcement-learning), Dr. GRPO, PPO, and DPO.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FUir0hB7T0xBtWUTnK3aG%2Funknown.png?alt=media&#x26;token=d225cd2e-fdf4-4521-8e9f-72bd684eb9e4" alt="" width="375"><figcaption></figcaption></figure>

TorchAO provides PyTorch-native FP8 support for both training and inference, offering a variety of scaling granularities including tensorwise, row-wise, and 128x128 blockwise (prototype). TorchAO’s FP8 support can improve inference throughput by up to [1.64x at 27B scale](https://huggingface.co/pytorch/gemma-3-27b-it-FP8/blob/main/README.md#results-h100-machine) with row-wise scaling granularity. For more details, visit the TorchAO [FP8 README](https://github.com/pytorch/ao/blob/main/torchao/float8/README.md).

#### TorchAO’s block-quantized FP8 matmul

We used TorchAO’s block‑quantized FP8 matmul implementation which provided:

* **80% of BF16 throughput**
* Without degrading loss or training stability

So for a while, this became our default FP8 matmul backend, until FBGEMM caught up - we know default to using FBGEMM's implementation, if your GPU supports it! The current version of Unsloth can automatically choose the best backend based on what’s installed. If you have the right packages, you don’t have to leave performance on the table 🙂

PS: We also experimented with DeepSeek’s DeepGEMM, but couldn’t get it fully integrated end‑to‑end to run clean, apples‑to‑apples comparisons.

### :bird:On the fly TorchAO FP8 quantization

Massive thanks to [Andrew](https://github.com/unslothai/unsloth/pull/3440) from TorchAO, Unsloth FP8 RL also lets you quantize the model on the fly by doing quantization within the model load time and passing that on to vLLM. This way, you need not explicitly quantize the model yourself (we handle it for you). You can do this by setting `load_in_fp8 = True` in the model load arguments, and will do offline FP8 if we don't find a suitable pre-quantized checkpoint.

### :tada:Unsloth FP8 uploads

For convenience, we uploaded FP8 Dynamic and FP8 Block models on Hugging Face. You can use them for FP8 training or also efficient & fast serving/deployment via [vLLM](https://docs.unsloth.ai/basics/inference-and-deployment/vllm-guide)/[SGLang](https://docs.unsloth.ai/basics/inference-and-deployment/sglang-guide) etc.

FP8 Dynamic offers slightly faster training and lower VRAM usage than FP8 Block, but with a small trade-off in accuracy. [See here](https://docs.unsloth.ai/get-started/unsloth-model-catalog#fp8) for our full list of FP8 quants, but here the most popular ones:

| Model                 | FP8 uploads                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Qwen3 (2507)**      | <p>4B Instruct — <a href="https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-FP8">FP8</a><br>4B Thinking — <a href="https://huggingface.co/unsloth/Qwen3-4B-Thinking-2507-FP8">FP8</a><br>30B-A3B Instruct — <a href="https://huggingface.co/unsloth/Qwen3-30B-A3B-Instruct-2507-FP8">FP8</a><br>30B-A3B Thinking — <a href="https://huggingface.co/unsloth/Qwen3-30B-A3B-Thinking-2507-FP8">FP8</a></p>                                                                                                                                                                                                                                                                                                                                 |
| **Qwen3-VL**          | <p>4B Instruct — <a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-FP8">FP8</a><br>4B Thinking — <a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-FP8">FP8</a><br>8B Instruct — <a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-FP8">FP8</a><br>8B Thinking — <a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-FP8">FP8</a></p>                                                                                                                                                                                                                                                                                                                                                             |
| **Llama 3.1**         | <p>8B Instruct — <a href="https://huggingface.co/unsloth/Llama-3.1-8B-Instruct-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.1-8B-Instruct-FP8-Block">Block</a><br>8B Base — <a href="https://huggingface.co/unsloth/Llama-3.1-8B-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.1-8B-FP8-Block">Block</a><br>70B — <a href="https://huggingface.co/unsloth/Llama-3.1-70B-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.1-70B-FP8-Block">Block</a></p>                                                                                                                                                                                                |
| **Qwen3**             | <p>0.6B — <a href="https://huggingface.co/unsloth/Qwen3-0.6B-FP8">FP8</a><br>1.7B — <a href="https://huggingface.co/unsloth/Qwen3-1.7B-FP8">FP8</a><br>4B — <a href="https://huggingface.co/unsloth/Qwen3-4B-FP8">FP8</a><br>8B — <a href="https://huggingface.co/unsloth/Qwen3-8B-FP8">FP8</a><br>14B — <a href="https://huggingface.co/unsloth/Qwen3-14B-FP8">FP8</a><br>32B — <a href="https://huggingface.co/unsloth/Qwen3-32B-FP8">FP8</a></p>                                                                                                                                                                                                                                                                                         |
| **Llama 3.3**         | 70B — [Dynamic](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-FP8-Block)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Llama 3.2**         | <p>1B Base — <a href="https://huggingface.co/unsloth/Llama-3.2-1B-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.2-1B-FP8-Block">Block</a><br>1B Instruct — <a href="https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-FP8-Block">Block</a><br>3B Base — <a href="https://huggingface.co/unsloth/Llama-3.2-3B-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.2-3B-FP8-Block">Block</a><br>3B Instruct — <a href="https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-FP8-Dynamic">Dynamic</a> · <a href="https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-FP8-Block">Block</a></p> |
| **Granite 4.0**       | <p>h-tiny — <a href="https://huggingface.co/unsloth/granite-4.0-h-tiny-FP8-Dynamic">FP8 Dynamic</a><br>h-small — <a href="https://huggingface.co/unsloth/granite-4.0-h-small-FP8-Dynamic">FP8 Dynamic</a></p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Magistral Small**   | [FP8 Dynamic](https://huggingface.co/unsloth/Magistral-Small-2509-FP8-Dynamic) · [FP8 torchao](https://huggingface.co/unsloth/Magistral-Small-2509-FP8-torchao)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Mistral Small 3.2** | [FP8](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506-FP8)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Gemma 3**           | <p>270m — <a href="https://huggingface.co/unsloth/gemma-3-270m-it-FP8-Dynamic">FP8</a><br>1B — <a href="https://huggingface.co/unsloth/gemma-3-1b-it-FP8-Dynamic">FP8</a><br>4B — <a href="https://huggingface.co/unsloth/gemma-3-4b-it-FP8-Dynamic">FP8</a><br>12B — <a href="https://huggingface.co/unsloth/gemma-3-12B-it-FP8-Dynamic">FP8</a><br>27B — <a href="https://huggingface.co/unsloth/gemma-3-27b-it-FP8-Dynamic">FP8</a></p>                                                                                                                                                                                                                                                                                                  |

### :person\_tipping\_hand:Acknowledgements

Huge thanks to the entire PyTorch and TorchAO team for their help and collaboration! A huge thank you especially to: Andrew Or, Jerry Zhang, Supriya Rao, Scott Roy and Mergen Nachin for helping on many discussions on FP8 RL, and on helping to integrate it into Unsloth! Also thanks to the Executorch team as well!

**Examples:**

Example 1 (python):
```python
import os
os.environ["UNSLOTH_VLLM_STANDBY"] = "1"
```

Example 2 (bash):
```bash
python -m venv unsloth_env
source unsloth_env/bin/activate

pip install unsloth vllm
pip install --pre torchao --index-url https://download.pytorch.org/whl/nightly/cu128 --force-reinstall
pip install --pre fbgemm-gpu fbgemm-gpu-genai --index-url https://download.pytorch.org/whl/cu128 --force-reinstall
pip install --upgrade numba numpy
```

Example 3 (python):
```python
from unsloth import FastLanguageModel
fp8_model = FastLanguageModel.from_pretrained(
    "unsloth/Llama-3.3-70B-Instruct", # Can be any model name!
    load_in_fp8 = True, # Can be "block" for block FP8, True for row FP8, False
)
```

---

## FunctionGemma: How to Run & Fine-tune

**URL:** llms-txt#functiongemma:-how-to-run-&-fine-tune

**Contents:**
  - ⚙️ Usage Guide
- 🖥️ Run FunctionGemma

Learn how to run and fine-tune FunctionGemma locally on your device and phone.

FunctionGemma is a new 270M parameter model by Google designed for function-calling and fine-tuning. Based on [Gemma 3](https://docs.unsloth.ai/models/gemma-3-how-to-run-and-fine-tune) 270M and trained specifically for text-only tool-calling, its small size makes it great to deploy on your own phone.

You can run the full precision model on **550MB RAM** (CPU) and you can now **fine-tune** it locally with Unsloth. Thank you to Google DeepMind for partnering with Unsloth for day-zero support!

<a href="#run-functiongemma" class="button secondary">Running Tutorial</a><a href="#fine-tuning-functiongemma" class="button primary">Fine-tuning FunctionGemma</a>

* FunctionGemma GGUF to run: [unsloth/functiongemma-270m-it-GGUF](https://huggingface.co/unsloth/functiongemma-270m-it-GGUF)

* Fine-tune to **reason/think before tool calls** using our [FunctionGemma notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\).ipynb)
* Do **multi-turn tool calling** in a free [Multi Turn tool calling notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\)-Multi-Turn-Tool-Calling.ipynb)
* Fine-tune to **enable mobile actions** (calendar, set timer) in our [Mobile Actions notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\)-Mobile-Actions.ipynb)

Google recommends these settings for inference:

* `top_k = 64`
* `top_p = 0.95`
* `temperature = 1.0`
* maximum context length = `32,768`&#x20;

The chat template format is found when we use the below:

{% code overflow="wrap" %}

#### FunctionGemma chat template format:

{% hint style="info" %}
FunctionGemma requires the system or **developer message** as `You are a model that can do function calling with the following functions` Unsloth versions have this pre-built in if you forget to pass one, so please use [unsloth/functiongemma-270m-it](https://huggingface.co/unsloth/functiongemma-270m-it)
{% endhint %}

{% code overflow="wrap" lineNumbers="true" %}

## 🖥️ Run FunctionGemma

See below for a local desktop guide or you can view our Phone Deployment Guide.

#### Llama.cpp Tutorial (GGUF):

Instructions to run in llama.cpp (note we will be using 4-bit to fit most devices):

{% stepper %}
{% step %}
Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% code overflow="wrap" %}

{% endcode %}
{% endstep %}

{% step %}
You can directly pull from Hugging Face. Because the model is so small, we'll be using the unquantized full-precision BF16 variant.

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `BF16` or other quantized versions (though it's not recommended to go lower than 4-bit) due to the small model size.

**Examples:**

Example 1 (python):
```python
def get_today_date():
    """ Gets today's date """
    return {"today_date": "18 December 2025"}
    
tokenizer.apply_chat_template(
    [
        {"role" : "user", "content" : "what is today's date?"},
    ],
    tools = [get_today_date], add_generation_prompt = True, tokenize = False,
)
```

Example 2 (unknown):
```unknown
<bos><start_of_turn>developer\nYou are a model that can do function calling with the following functions<start_function_declaration>declaration:get_today_date{description:<escape>Gets today's date<escape>,parameters:{type:<escape>OBJECT<escape>}}<end_function_declaration><end_of_turn>\n<start_of_turn>user\nwhat is today's date?<end_of_turn>\n<start_of_turn>model\n
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
    -hf unsloth/functiongemma-270m-it-GGUF:BF16 \
    --jinja -ngl 99 --threads -1 --ctx-size 32768 \
    --top-k 64 --top-p 0.95 --temp 1.0
```

---

## How to Fine-tune LLMs with Unsloth & Docker

**URL:** llms-txt#how-to-fine-tune-llms-with-unsloth-&-docker

**Contents:**
  - ⚡ Step-by-Step Tutorial
  - 📖 Usage Example

Learn how to fine-tune LLMs or do Reinforcement Learning (RL) with Unsloth's Docker image.

Local training can be complex due to dependency hell or breaking environments. Unsloth’s [Docker image](https://hub.docker.com/r/unsloth/unsloth) can bypass these issues. No setup is needed: pull and run the image and start training.

* **Unsloth official Docker image:** [**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth)

**Why Use Unsloth & Docker?**

Unsloth’s Docker image is stable, up-to-date and works in [supported setups](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/unsloth-requirements#system-requirements) like Windows.

* Fully contained dependencies keep your system clean. Runs safely without root.
* Use locally or on any platform with pre-installed notebooks.

{% hint style="success" %}
You can now use our main Docker image `unsloth/unsloth` for Blackwell and 50-series GPUs - no separate image needed.
{% endhint %}

### ⚡ Step-by-Step Tutorial

{% stepper %}
{% step %}
**Install Docker and NVIDIA Container Toolkit.**

Install Docker via [Linux](https://docs.docker.com/engine/install/) or [Desktop](https://docs.docker.com/desktop/) (other).\
Then install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation):

<pre class="language-bash"><code class="lang-bash"><strong>export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.17.8-1
</strong>sudo apt-get update &#x26;&#x26; sudo apt-get install -y \
  nvidia-container-toolkit=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
  nvidia-container-toolkit-base=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
  libnvidia-container-tools=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
  libnvidia-container1=${NVIDIA_CONTAINER_TOOLKIT_VERSION}
</code></pre>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-41cae231ed4761f844ce9836e03b17aabd7c803c%2Fnvidia%20toolkit.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Run the container.**

[**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth) is Unsloth's only Docker image. For [Blackwell](https://docs.unsloth.ai/basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth) and 50-series GPUs, use this same image - no separate image needed. If using DGX Spark, you'll need to follow our [DGX guide](https://docs.unsloth.ai/basics/fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2b50d78c5d54eaf189c0a40d46c405585ea23082%2Fdocker%20run.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Access Jupyter Lab**

Go to [http://localhost:8888](http://localhost:8888/) and open Unsloth.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-828df0a668fd94025c1193c24a7f09c1d58dcbd8%2Fjupyter.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

Access the `unsloth-notebooks` tabs to see Unsloth notebooks.

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e7a3f620a3ec5bff335632ff9b0cb422f76528a1%2FScreenshot_from_2025-09-30_21-38-15.png?alt=media" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-531882c33eb96dec24e2d7673471d6a3928a3951%2FScreenshot_from_2025-09-30_21-39-41.png?alt=media" alt=""><figcaption></figcaption></figure></div>
{% endstep %}

{% step %}
**Start training with Unsloth**

If you're new, follow our step-by-step [Fine-tuning Guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide), [RL Guide](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) or just save/copy any of our premade [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-665f900b008991ddcd8fdabb773b292de3c41e72%2FScreenshot_from_2025-09-30_21-40-29.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

#### 📂 Container Structure

* `/workspace/work/` — Your mounted work directory
* `/workspace/unsloth-notebooks/` — Example fine-tuning notebooks
* `/home/unsloth/` — User home directory

#### Setting up SSH Key

If you don't have an SSH key pair:

**Examples:**

Example 1 (bash):
```bash
docker run -d -e JUPYTER_PASSWORD="mypassword" \
  -p 8888:8888 -p 2222:22 \
  -v $(pwd)/work:/workspace/work \
  --gpus all \
  unsloth/unsloth
```

Example 2 (bash):
```bash
docker run -d -e JUPYTER_PORT=8000 \
  -e JUPYTER_PASSWORD="mypassword" \
  -e "SSH_KEY=$(cat ~/.ssh/container_key.pub)" \
  -e USER_PASSWORD="unsloth2024" \
  -p 8000:8000 -p 2222:22 \
  -v $(pwd)/work:/workspace/work \
  --gpus all \
  unsloth/unsloth
```

---

## How to Run and Deploy LLMs on your iOS or Android Phone

**URL:** llms-txt#how-to-run-and-deploy-llms-on-your-ios-or-android-phone

**Contents:**
  - 🦥 Training Your Model

Tutorial for fine-tuning your own LLM and deploying it on your Android or iPhone with ExecuTorch.

We’re excited to show how you can train LLMs then **deploy them locally** to **Android phones** and **iPhones**. We collabed with [ExecuTorch](https://github.com/pytorch/executorch/) from PyTorch & Meta to create a streamlined workflow using quantization-aware training ([QAT](https://docs.unsloth.ai/basics/quantization-aware-training-qat)) then deploy them directly to edge devices. With [Unsloth](https://github.com/unslothai/unsloth), TorchAO and ExecuTorch, we show how you can:

* Use the same tech (ExecuTorch) Meta has to power billions on Instagram, WhatsApp
* Deploy Qwen3-0.6B locally to **Pixel 8** and **iPhone 15 Pro at \~40 tokens/s**
* Apply QAT via TorchAO to recover 70% of accuracy
* Get privacy first, instant responses and offline capabilities
* Use our [free Colab notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(0_6B\)-Phone_Deployment.ipynb) to fine-tune Qwen3 0.6B and export it for phone deployment

<a href="#ios-deployment" class="button secondary" data-icon="apple">iOS Tutorial</a><a href="#android-deployment" class="button secondary" data-icon="android">Android Tutorial</a>

{% columns %}
{% column %}
**Qwen3-4B** deployed on a iPhone 15 Pro

<div align="left"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F7tFjmj9c3p6o4eN3oHQq%2Funknown.png?alt=media&#x26;token=009699b3-e48f-4a94-bcd0-26cf6dedb8eb" alt="" width="188"><figcaption></figcaption></figure></div>
{% endcolumn %}

{% column %}
**Qwen3-0.6B** running at \~40 tokens/s

<div align="left"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FWI9nU1RQVrPbVXrIihfA%2Fimage.png?alt=media&#x26;token=5d58eb94-aeb3-42c3-a891-561ceb4e22db" alt="" width="188"><figcaption></figcaption></figure></div>
{% endcolumn %}
{% endcolumns %}

### 🦥 Training Your Model

We support Qwen3, Gemma3, Llama3, Qwen2.5, Phi4 and many other models for phone deployment! Follow the [**free Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(0_6B\)-Phone_Deployment.ipynb) **for Qwen3-0.6B deployment:**

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_(0_6B)-Phone_Deployment.ipynb>" %}

First update Unsloth and install TorchAO and Executorch.

Then simply use `qat_scheme = "phone-deployment"` to signify we want to deploy it to a phone. Note we also set `full_finetuning = True` for full finetuning!

We’re using `qat_scheme = "phone-deployment"` we actually use `qat_scheme = "int8-int4"` under the hood to enable Unsloth/TorchAO QAT that *simulates* INT8 dynamic activation quantization with INT4 weight quantization for Linear layers during training (via fake quantization operations) while keeping computations in 16bits. After training, the model is converted to a real quantized version so the on-device model is smaller and typically **retains accuracy better than naïve PTQ**.

After finetuning as described in the [Colab notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(0_6B\)-Phone_Deployment.ipynb), we then save it to a `.pte` file via Executorch:

{% code expandable="true" %}

**Examples:**

Example 1 (bash):
```bash
pip install --upgrade unsloth unsloth_zoo
pip install torchao==0.14.0 executorch pytorch_tokenizers
```

Example 2 (python):
```python
from unsloth import FastLanguageModel
import torch
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen3-0.6B",
    max_seq_length = 1024,
    full_finetuning = True,
    qat_scheme = "phone-deployment", # Flag for phone deployment
)
```

---

## Long Context gpt-oss Training

**URL:** llms-txt#long-context-gpt-oss-training

**Contents:**
- 🦥Introducing Unsloth Flex Attention Support
- :dark\_sunglasses: Attention Sinks
- :triangular\_ruler:Unsloth's Flex Attention implementation
- :scroll: Mathematical derivation for attention sinks
- 💾**NEW: Saving to GGUF, vLLM after gpt-oss training**
  - :diamonds:Fine-tuning gpt-oss directly
- 🐛Bug Fixes for gpt-oss
- :1234: Implementations for Sink Attention

We’re excited to introduce Unsloth Flex Attention support for OpenAI gpt-oss training that enables **>8× longer context lengths**, **>50% less VRAM usage** and **>1.5× faster training (with no accuracy degradation)** vs. all implementations including those using Flash Attention 3 (FA3). Unsloth Flex Attention makes it possible to train with a **60K context length** on a 80GB VRAM H100 GPU for BF16 LoRA. Also:

* You can [now export/save](#new-saving-to-gguf-vllm-after-gpt-oss-training) your QLoRA fine-tuned gpt-oss model to llama.cpp, vLLM, Ollama or HF
* We [**fixed gpt-oss training**](#bug-fixes-for-gpt-oss) **losses going to infinity** on float16 GPUs (like T4 Colab)
* We [fixed gpt-oss implementation](#bug-fixes-for-gpt-oss) issues irrelevant to Unsloth, most notably ensuring that `swiglu_limit = 7.0` is properly applied during MXFP4 inference in transformers

## 🦥Introducing Unsloth Flex Attention Support

With Unsloth's Flex Attention support, a single 80GB VRAM H100 can handle up to 81K context length with QLoRA and 60K context with BF16 LoRA! These gains are applied to **BOTH** gpt-oss-20b and **gpt-oss-120b**! The more context length you use, the more gains you'll get from Unsloth Flex Attention:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-90bdd5dfd0776f9e38a6fc895f81217ee76ef90b%2Foutput%20(7).png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

In comparison, all other non-Unsloth implementations max out at 9K context length on an 80GB GPU, and can only reach 15K context with FA3. But, **FA3 is unsuitable for gpt-oss training since it lacks backward pass support for attention sinks**. So if you were previously using FA3 for gpt-oss training, we'd recommend you to **not use it** for now. Thus, the max context length you can get without Unsloth on 80GB VRAM is \~9K.

Training with Unsloth Flex Attention delivers at least a 1.3× speedup, with gains growing as context length increases, reaching up to 2× faster. Because Flex Attention scales with context, longer sequences yield bigger savings in both VRAM and training time, as [described here](#unsloths-flex-attention-implementation).

A huge thank you to Rohan Pandey for his [Flex Attention implementation](https://x.com/khoomeik/status/1955693558914310608), which directly inspired the development of Unsloth's Flex Attention implementation.

## :dark\_sunglasses: Attention Sinks

OpenAI's GPT OSS model uses an **alternating pattern of sliding window attention, full attention**, sliding window attention and so on (SWA, FA, SWA, FA, etc). Each sliding window only attends to **128 tokens** (including the current token), so computation is vastly reduced. However, this also means long context retrieval and reasoning becomes useless due to the small sliding window. Most labs fix this by expanding the sliding window to 2048 or 4096 tokens.

OpenAI leveraged **Attention Sinks** from the Efficient Streaming Language Models with Attention Sinks [paper](https://arxiv.org/abs/2309.17453) which shows that you can use a small sliding window, except you must add a global attention on the first token! The paper provides a good illustration below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e57c0afcf9770807fd8f26b2824ea3773201c375%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

The paper finds that the **attention mechanism seems to assign a lot of weight to the first few tokens (1 to 4)**, and by removing them during the sliding window operation, these "important" first few tokens disappear, and causes bad long context retrieval.

If we plot log perplexity (higher is worse), and do long context inference after the pretrained model's set context length, we see the perplexity shoots up (not good). However the red line (uses Attention Sinks) stays low, which is very good!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2b26acf879cdb806185b6a0a1b25a10b3e5ef1a6%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

The paper also shows that the [Attention Is Off By One method](https://www.evanmiller.org/attention-is-off-by-one.html) does partially work, except one must also add a few extra sink tokens to get lower perplexities. **The paper shows that adding a single sink token that is learnable does remarkably well! And that's what OpenAI did for GPT-OSS!**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d7b555ee7ac82a16aaa88f63b8205e008050f89d%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## :triangular\_ruler:Unsloth's Flex Attention implementation

Flex Attention <https://pytorch.org/blog/flexattention/> is extremely powerful as it provides the practitioner 2 customization routes for the attention mechanism - a **score modifier (f)** and a **masking function (M)**.

The **score modifier (f)** allows us to edit the attention logits before the softmax operation, and the **masking function (M)** allows us to skip operations if we don't need them (for eg sliding window attention only sees last 128 tokens).

<mark style="background-color:green;">**The trick is Flex Attention provides fast auto generated Triton kernels with arbitrary score modifiers and masking functions!**</mark>

<p align="center"><span class="math">\sigma\bigg(s\times\bold{f}(QK^T+\bold{M})\bigg)</span><br></p>

This means we can use Flex Attention to implement attention sinks! Implementing a single attention sink is provided both in [OpenAI's original GPT-OSS repo](#implementations-for-sink-attention) and HuggingFace's transformers's implementation.

The above shows we concatenate the sink at the very end of the `Q @ K.T` , do the softmax, and remove the last column which was the sink token.

By using some visualization utilities from [Flex Attention's Github repo](https://github.com/meta-pytorch/attention-gym), we can visualize this. Assume the sequence length was 16, and a sliding window of 5. On the left is the last sink column (default implementation), and on the right is if we move the sink location to index 0 (our implementation).

{% columns %}
{% column %}
***Sink location at the end (default)***

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-aa9a210e0ab394633017dcefb93ad30f0d42483c%2FUntitled-1.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
***Move sink location to index 0***

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0da608ddbc5cd883059cede7c516c8fd2dc6ec3c%2FUntitled%20(2).png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

**Interesting finding**: The official Flex Attention sliding window implementations considers the window size as the number of last tokens **PLUS ONE** as it includes the current token. The HuggingFace and GPT OSS implementations strictly only sees the last N tokens. Ie the below is from <https://pytorch.org/blog/flexattention/> and <https://github.com/meta-pytorch/attention-gym>:

{% code overflow="wrap" %}

{% columns %}
{% column %}
Default Flex Attention (3+1 tokens)

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-09f63ae1b6321f2714c951dcc0d47758adf5a7f2%2FUntitled.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
HuggingFace, GPT-OSS (3+0 tokens)

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1f533635a0f285850ba2e4fb8a545756dbd66aad%2FUntitled-1.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

We also confirmed through OpenAI's official GPT-OSS implementation on whether we attend to the last N or N+1 tokens here: <https://github.com/openai/gpt-oss/blob/main/gpt_oss/torch/model.py>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-6651df15be25b69c789c99be862bcc79a9f4cefb%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

And we see only the last 3 tokens (not 3+1) are attended to! This means instead of using `<= SLIDING_WINDOW`, use `< SLIDING_WINDOW` (ie use less than, not the equals).

Also since we moved the sink token index to the first, we have to add 1 to the q\_idx to index correctly:

To confirm our index 0 implementation, we verified that the training loss remains consistent with standard Hugging Face runs (without Unsloth Flex Attention), as shown in our graph:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f5716bdb17d4f0b49483edb7c1b0113fe33b69b6%2Funsloth%20flex%20vs%20no%20flex.png?alt=media" alt="" width="375"><figcaption></figcaption></figure>

## :scroll: Mathematical derivation for attention sinks

There is another way to calculate the attention sinks without padding K and V. We first note the softmax operation does, and we want to 2nd version with sinks for now as a scalar:\\

$$
A(x) = \frac{\exp(x\_i)}{\sum{\exp{(x\_i)}}} \\
A\_{sink}(x) = \frac{\exp(x\_i)}{\exp{(s)}+ \sum{\exp{(x\_i)}}}
$$

We can obtain the logsumexp from Flex Attention via `return_lse = True` , and so we do:

$$
A(x) = \frac{\exp(x\_i)}{\sum{\exp{(x\_i)}}} \\
\frac{\exp(x\_i)}{\exp{(s)}+ \sum{\exp{(x\_i)}}} =  \frac{\exp(x\_i)}{\sum{\exp{(x\_i)}}} \frac{\sum{\exp{(x\_i)}}}{\exp{(s)}+ \sum{\exp{(x\_i)}}} \\
\text{LSE}(x) = \text{logsumexp}(x) = \log{\sum\exp(x\_i)} \\
\exp{(\text{LSE}(x))} = \exp{\big(\log{\sum\exp(x\_i)}\big)} = \sum\exp(x\_i)
$$

And we can now easily derive the sink version of attention. We do find however this process has somewhat higher error than the zero padding approach, so we still default to our original version.

## 💾**NEW: Saving to GGUF, vLLM after gpt-oss training**

You can now QLoRA fine-tune gpt-oss and directly save, export, or merge the model to **llama.cpp**, **vLLM**, or **HF** - not just Unsloth. We will be releasing a free notebook hopefully soon.

Previously, any QLoRA fine-tuned gpt-oss model was restricted to running in Unsloth. We’ve removed that limitation by introducing the ability to merge in **MXFP4** **native format** using `save_method="mxfp4"` and **on-demand dequantization of MXFP4** base models (like gpt-oss) making it possible to **export your fine-tuned model in bf16 format using** `save_method="merged_16bit"` .

The **MXFP4** native merge format offers significant performance improvements compared to the **bf16 format**: it uses up to 75% less disk space, reduces VRAM consumption by 50%, accelerates merging by 5-10x, and enables much faster conversion to **GGUF** format.

After fine-tuning your gpt-oss model, you can merge it into **MXFP4** format with:

If you prefer to merge the model and push to the hugging-face hub, use:

To run inference on the merged model, you can use vLLM and Llama.cpp among others. OpenAI recommends these [inference settings](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/..#recommended-settings) for both models: `temperature=1.0`, `top_p=1.0`, `top_k=0`

#### :sparkles: Saving to Llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Convert the **MXFP4** merged model:

3. Run inference on the quantized model:

<summary><span data-gb-custom-inline data-tag="emoji" data-code="2728">✨</span> Saving to SGLang</summary>

1. Build SGLang from source:\\

2. Launch SGLang server:\\

### :diamonds:Fine-tuning gpt-oss directly

We also added support for directly fine-tuning of gpt-oss models by implementing patches that allow loading the native MXFP4 quantized format. This makes it possible to load the 'openai/gpt-oss' model with less than 24GB of VRAM, and QLoRA fine-tune it. Simply load the model using:

add a Peft layer using `FastLanguageModel.get_peft_model` and run SFT fine-tuning over the Peft model.

## 🐛Bug Fixes for gpt-oss

We [recently collaborated with Hugging Face](https://github.com/huggingface/transformers/pull/40197) to resolve inference issues by using OpenAI’s kernels and ensuring that `swiglu_limit = 7.0` is correctly applied during MXFP4 inference.

Based on user feedback, we discovered that extended QLoRA training runs (beyond 60 steps) could cause the **loss to diverge and eventually error out**. This issue only occurred on devices that do not support BF16 and instead fall back to F16 (e.g., T4 GPUs). Importantly, it did not impact QLoRA training on A100 or H100 GPUs, nor LoRA training on f16 GPUs.

**After extensive investigation, we’ve now aligned training loss behavior across all GPU setups, including GPUs limited to F16**. If you were previously experiencing issues because of this, we recommend using our new updated gpt-oss notebook!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3807b155e5c1a5a2ca3c8478c9adae0975ddeba5%2FFloat16%20NaN%20Experiments.png?alt=media" alt=""><figcaption></figcaption></figure>

We had to do many many experiments to move float16's training loss curve to be equivalent to bfloat16 machines (blue line). We found the following:

1. **Pure float16 will go to infinity on step 50**
2. **We found the down projections in the MoE to have huge outliers**
3. **Activations must be saved in bfloat16 or float32**

**Below shows the absolute magnitude activations for GPT OSS 20B, and some really spike - this will overflow in float16 machines since float16's maximum range is 65504.**

**We fixed this in Unsloth, so all float16 training works out of the box!**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-db77ec5b3577f95335fd92bec2f4ce53c3f1f175%2F480854617-181c4557-632e-4cbc-8a6f-bcbfe824895a.png?alt=media" alt=""><figcaption></figcaption></figure>

## :1234: Implementations for Sink Attention

OpenAI's sink token implementation is [provided here](https://github.com/openai/gpt-oss/blob/main/gpt_oss/torch/model.py). We provide it below:

{% code fullWidth="false" %}

The HuggingFace transformers implementation is [provided here](https://github.com/huggingface/transformers/blob/main/src/transformers/models/gpt_oss/modeling_gpt_oss.py). We also provide it below:

{% code fullWidth="false" %}

**Examples:**

Example 1 (python):
```python
combined_logits = torch.cat([attn_weights, sinks], dim=-1)
probs = F.softmax(combined_logits, dim=-1)
scores = probs[..., :-1]
```

Example 2 (python):
```python
def sliding_window_causal(b, h, q_idx, kv_idx):
    causal_mask = q_idx >= kv_idx
    window_mask = q_idx - kv_idx <= SLIDING_WINDOW 
    return causal_mask & window_mask
```

Example 3 (python):
```python
mask = torch.triu(Q.new_full((n_tokens, n_tokens), -float("inf")), diagonal=1)
if sliding_window > 0:
    mask += torch.tril(
        mask.new_full((n_tokens, n_tokens), -float("inf")), diagonal=-sliding_window
    )
```

Example 4 (python):
```python
def sliding_window_causal(b, h, q_idx, kv_idx):
    causal_mask = q_idx >= kv_idx
    window_mask = q_idx - kv_idx <= SLIDING_WINDOW # Default Flex Attention
    window_mask = q_idx - kv_idx <  SLIDING_WINDOW # GPT-OSS version
    return causal_mask & window_mask
```

---

## LoRA fine-tuning Hyperparameters Guide

**URL:** llms-txt#lora-fine-tuning-hyperparameters-guide

**Contents:**
- :1234: Key Fine-tuning Hyperparameters
  - **Learning Rate**
  - **Epochs**
  - **LoRA or QLoRA**
  - Hyperparameters & Recommendations:
- :deciduous\_tree: Gradient Accumulation and Batch Size equivalency
  - Effective Batch Size
  - The VRAM & Performance Trade-off
  - :sloth: Unsloth Gradient Accumulation Fix
- 🦥 **LoRA Hyperparameters in Unsloth**

Optimal lora rank. alpha, number of epochs, batch size & gradient accumulation, QLoRA vs LoRA, target modules and more!

LoRA hyperparameters are adjustable parameters that control how Low-Rank Adaptation (LoRA) fine-tunes LLMs. With many options (such as learning rate and epochs) and millions of possible combinations, selecting the right values is crucial for achieving accuracy, stability, quality, and fewer hallucinations during fine-tuning.

You'll learn the best practices for these parameters, based on insights from hundreds of research papers and experiments, and see how they impact the model. **While we recommend using Unsloth's defaults**, understanding these concepts will give you full control.\
\
The goal is to change hyperparameter numbers to increase accuracy while counteracting [**overfitting or underfitting**](#overfitting-poor-generalization-too-specialized). Overfitting occurs when the model memorizes the training data, harming its ability to generalize to new, unseen inputs. The objective is a model that generalizes well, not one that simply memorizes.

{% columns %}
{% column %}

#### :question:But what is LoRA?

In LLMs, we have model weights. Llama 70B has 70 billion numbers. Instead of changing all 70b numbers, we instead add thin matrices A and B to each weight, and optimize those. This means we only optimize 1% of weights.
{% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-715b6260aae497f160d7f9a1019bcfa472675dcf%2Fimage%20(7)%20(1)%20(1).png?alt=media" alt=""><figcaption><p>Instead of optimizing Model Weights (yellow), we optimize 2 thin matrices A and B.</p></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

## :1234: Key Fine-tuning Hyperparameters

### **Learning Rate**

Defines how much the model’s weights are adjusted during each training step.

* **Higher Learning Rates**: Lead to faster initial convergence but can cause training to become unstable or fail to find an optimal minimum if set too high.
* **Lower Learning Rates**: Result in more stable and precise training but may require more epochs to converge, increasing overall training time. While low learning rates are often thought to cause underfitting, they actually can lead to **overfitting** or even prevent the model from learning.
* **Typical Range**: `2e-4` (0.0002) to `5e-6` (0.000005).\
  :green\_square: ***For normal LoRA/QLoRA Fine-tuning***, *we recommend* **`2e-4`** *as a starting point.*\
  :blue\_square: ***For Reinforcement Learning** (DPO, GRPO etc.), we recommend* **`5e-6` .**\
  :white\_large\_square: ***For Full Fine-tuning,** lower learning rates are generally more appropriate.*

The number of times the model sees the full training dataset.

* **More Epochs:** Can help the model learn better, but a high number can cause it to **memorize the training data**, hurting its performance on new tasks.
* **Fewer Epochs:** Reduces training time and can prevent overfitting, but may result in an undertrained model if the number is insufficient for the model to learn the dataset's underlying patterns.
* **Recommended:** 1-3 epochs. For most instruction-based datasets, training for more than 3 epochs offers diminishing returns and increases the risk of overfitting.

### **LoRA or QLoRA**

LoRA uses 16-bit precision, while QLoRA is a 4-bit fine-tuning method.

* **LoRA:** 16-bit fine-tuning. It's slightly faster and slightly more accurate, but consumes significantly more VRAM (4× more than QLoRA). Recommended for 16-bit environments and scenarios where maximum accuracy is required.
* **QLoRA:** 4-bit fine-tuning. Slightly slower and marginally less accurate, but uses much less VRAM (4× less).\
  :sloth: *70B LLaMA fits in <48GB VRAM with QLoRA in Unsloth -* [*more details here*](https://unsloth.ai/blog/llama3-3)*.*

### Hyperparameters & Recommendations:

<table><thead><tr><th width="154.39678955078125">Hyperparameter</th><th width="383.6192626953125">Function</th><th>Recommended Settings</th></tr></thead><tbody><tr><td><strong>LoRA Rank</strong> (<code>r</code>)</td><td>Controls the number of trainable parameters in the LoRA adapter matrices. A higher rank increases model capacity but also memory usage.</td><td>8, 16, 32, 64, 128<br><br>Choose 16 or 32</td></tr><tr><td><strong>LoRA Alpha</strong> (<code>lora_alpha</code>)</td><td>Scales the strength of the fine-tuned adjustments in relation to the rank (<code>r</code>).</td><td><code>r</code> (standard) or <code>r * 2</code> (common heuristic). <a href="#lora-alpha-and-rank-relationship">More details here</a>.</td></tr><tr><td><strong>LoRA Dropout</strong></td><td>A regularization technique that randomly sets a fraction of LoRA activations to zero during training to prevent overfitting. <strong>Not that useful</strong>, so we default set it to 0.</td><td>0 (default) to 0.1</td></tr><tr><td><strong>Weight Decay</strong></td><td>A regularization term that penalizes large weights to prevent overfitting and improve generalization. Don't use too large numbers!</td><td>0.01 (recommended) - 0.1</td></tr><tr><td><strong>Warmup Steps</strong></td><td>Gradually increases the learning rate at the start of training.</td><td>5-10% of total steps</td></tr><tr><td><strong>Scheduler Type</strong></td><td>Adjusts the learning rate dynamically during training.</td><td><code>linear</code> or <code>cosine</code></td></tr><tr><td><strong>Seed (<code>random_state</code>)</strong></td><td>A fixed number to ensure reproducibility of results.</td><td>Any integer (e.g., <code>42</code>, <code>3407</code>)</td></tr><tr><td><strong>Target Modules</strong></td><td><p>Specify which parts of the model you want to apply LoRA adapters to — either the attention, the MLP, or both.</p><p><br>Attention: <code>q_proj, k_proj, v_proj, o_proj</code><br><br>MLP: <code>gate_proj, up_proj, down_proj</code></p></td><td>Recommended to target all major linear layers: <code>q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj</code>.</td></tr></tbody></table>

## :deciduous\_tree: Gradient Accumulation and Batch Size equivalency

### Effective Batch Size

Correctly configuring your batch size is critical for balancing training stability with your GPU's VRAM limitations. This is managed by two parameters whose product is the **Effective Batch Size**.\
\
**Effective Batch Size** = `batch_size * gradient_accumulation_steps`

* A **larger Effective Batch Size** generally leads to smoother, more stable training.
* A **smaller Effective Batch Size** may introduce more variance.

While every task is different, the following configuration provides a great starting point for achieving a stable **Effective Batch Size** of 16, which works well for most fine-tuning tasks on modern GPUs.

| Parameter                                                 | Description                                                                                                                                                                                                                                                                     | Recommended Setting                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Batch Size** (`batch_size`)                             | <p>The number of samples processed in a single forward/backward pass on one GPU.<br><br><strong>Primary Driver of VRAM Usage</strong>. Higher values can improve hardware utilization and speed up training, but only if they fit in memory.</p>                                | 2                                               |
| **Gradient Accumulation** (`gradient_accumulation_steps`) | <p>The number of micro-batches to process before performing a single model weight update.<br><br><strong>Primary Driver of Training Time.</strong> Allows simulation of a larger <code>batch\_size</code> to conserve VRAM. Higher values increase training time per epoch.</p> | 8                                               |
| **Effective Batch Size** (Calculated)                     | The true batch size used for each gradient update. It directly influences training stability, quality, and final model performance.                                                                                                                                             | <p>4 to 16<br>Recommended: 16 (from 2 \* 8)</p> |

### The VRAM & Performance Trade-off

Assume you want 32 samples of data per training step. Then you can use any of the following configurations:

* `batch_size = 32, gradient_accumulation_steps = 1`
* `batch_size = 16, gradient_accumulation_steps = 2`
* `batch_size = 8, gradient_accumulation_steps = 4`
* `batch_size = 4, gradient_accumulation_steps = 8`
* `batch_size = 2, gradient_accumulation_steps = 16`
* `batch_size = 1, gradient_accumulation_steps = 32`

While all of these are equivalent for the model's weight updates, they have vastly different hardware requirements.

The first configuration (`batch_size = 32`) uses the **most VRAM** and will likely fail on most GPUs. The last configuration (`batch_size = 1`) uses the **least VRAM,** but at the cost of slightly slower trainin&#x67;**.** To avoid OOM (out of memory) errors, always prefer to set a smaller `batch_size` and increase `gradient_accumulation_steps` to reach your target **Effective Batch Size**.

### :sloth: Unsloth Gradient Accumulation Fix

Gradient accumulation and batch sizes <mark style="color:green;">**are now fully equivalent in Unsloth**</mark> due to our bug fixes for gradient accumulation. We have implemented specific bug fixes for gradient accumulation that resolve a common issue where the two methods did not produce the same results. This was a known challenge in the wider community, but for Unsloth users, the two methods are now interchangeable.

[Read our blog post](https://unsloth.ai/blog/gradient) for more details.

Prior to our fixes, combinations of `batch_size` and `gradient_accumulation_steps` that yielded the same **Effective Batch Size** (i.e., `batch_size × gradient_accumulation_steps = 16`) did not result in equivalent training behavior. For example, configurations like `b1/g16`, `b2/g8`, `b4/g4`, `b8/g2`, and `b16/g1` all have an **Effective Batch Size** of 16, but as shown in the graph, the loss curves did not align when using standard gradient accumulation:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-66eb907fd9ce38ab29dacef82794d0525057aeb4%2FBefore_-_Standard_gradient_accumulation_UQOFkUggudXuV9dzrh8MA.svg?alt=media" alt=""><figcaption><p>(Before - Standard Gradient Accumulation)</p></figcaption></figure>

After applying our fixes, the loss curves now align correctly, regardless of how the **Effective Batch Size** of 16 is achieved:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-61f7c60412a2a39584f75cce5dca41e3e35eb7f2%2FAfter_-_Unsloth_gradient_accumulation_6Y4pJdJF0vruzradUpymY.svg?alt=media" alt=""><figcaption><p>(After - 🦥 <mark style="color:green;">Unsloth Gradient Accumulation</mark>)</p></figcaption></figure>

## 🦥 **LoRA Hyperparameters in Unsloth**

The following demonstrates a standard configuration. **While Unsloth provides optimized defaults**, understanding these parameters is key to manual tuning.

<div data-full-width="false"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-9843f8cc26aac6445236250f5c32394186eace59%2Fnotebook_parameter_screenshott.png?alt=media" alt=""><figcaption></figcaption></figure></div>

The rank (`r`) of the fine-tuning process. A larger rank uses more memory and will be slower, but can increase accuracy on complex tasks. We suggest ranks like 8 or 16 (for fast fine-tunes) and up to 128. Using a rank that is too large can cause overfitting and harm your model's quality.\\
2.

For optimal performance, <mark style="background-color:blue;">**LoRA should be applied to all major linear layers**</mark>. [Research has shown](#lora-target-modules-and-qlora-vs-lora) that targeting all major layers is crucial for matching the performance of full fine-tuning. While it's possible to remove modules to reduce memory usage, we strongly advise against it to preserve maximum quality as the savings are minimal.\\
3.

A scaling factor that controls the strength of the fine-tuned adjustments. Setting it equal to the rank (`r`) is a reliable baseline. A popular and effective heuristic is to set it to double the rank (`r * 2`), which makes the model learn more aggressively by giving more weight to the LoRA updates. [More details here](#lora-alpha-and-rank-relationship).\\
4.

A regularization technique that helps [prevent overfitting](#overfitting-poor-generalization-too-specialized) by randomly setting a fraction of the LoRA activations to zero during each training step. [Recent research suggests](https://arxiv.org/abs/2410.09692) that for **the short training runs** common in fine-tuning, `lora_dropout` may be an unreliable regularizer.\
   🦥 *Unsloth's internal code can optimize training when* `lora_dropout = 0`*, making it slightly faster, but we recommend a non-zero value if you suspect overfitting.*\\
5.

Leave this as `"none"` for faster training and reduced memory usage. This setting avoids training the bias terms in the linear layers, which adds trainable parameters for little to no practical gain.\\
6.

Options are `True`, `False`, and `"unsloth"`.\
   🦥 *We recommend* `"unsloth"` *as it reduces memory usage by an extra 30% and supports extremely long context fine-tunes. You can read more on* [*our blog post about long context training*](https://unsloth.ai/blog/long-context)*.*\\
7.

The seed to ensure deterministic, reproducible runs. Training involves random numbers, so setting a fixed seed is essential for consistent experiments.\\
8.

An advanced feature that implements [**Rank-Stabilized LoRA**](https://arxiv.org/abs/2312.03732). If set to `True`, the effective scaling becomes `lora_alpha / sqrt(r)` instead of the standard `lora_alpha / r`. This can sometimes improve stability, particularly for higher ranks. [More details here](#lora-alpha-and-rank-relationship).\\
9.

An advanced technique, as proposed in [**LoftQ**](https://arxiv.org/abs/2310.08659), initializes LoRA matrices with the top 'r' singular vectors from the pretrained weights. This can improve accuracy but may cause a significant memory spike at the start of training.

### **Verifying LoRA Weight Updates:**

When validating that **LoRA** adapter weights have been updated after fine-tuning, avoid using **np.allclose()** for comparison. This method can miss subtle but meaningful changes, particularly in **LoRA A**, which is initialized with small Gaussian values. These changes may not register as significant under loose numerical tolerances. Thanks to [contributors](https://github.com/unslothai/unsloth/issues/3035) for this section.

To reliably confirm weight updates, we recommend:

* Using **checksum or hash comparisons** (e.g., MD5)
* Computing the **sum of absolute differences** between tensors
* Inspecting t**ensor statistics** (e.g., mean, variance) manually
* Or using **np.array\_equal()** if exact equality is expected

## :triangular\_ruler:LoRA Alpha and Rank relationship

{% hint style="success" %}
It's best to set `lora_alpha = 2 * lora_rank` or `lora_alpha = lora_rank`
{% endhint %}

{% columns %}
{% column width="50%" %}
$$
\hat{W} = W + \frac{\alpha}{\text{rank}} \times AB
$$

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8e4f60c002f22e8ca9c534b48323e9e77e4b5ea6%2Fimage.png?alt=media" alt=""><figcaption><p>rsLoRA other scaling options. sqrt(r) is the best.</p></figcaption></figure>

$$
\hat{W}\_{\text{rslora}} = W + \frac{\alpha}{\sqrt{\text{rank}}} \times AB
$$
{% endcolumn %}

{% column %}
The formula for LoRA is on the left. We need to scale the thin matrices A and B by alpha divided by the rank. <mark style="background-color:blue;">**This means we should keep alpha/rank at least = 1**</mark>.

According to the [rsLoRA (rank stabilized lora) paper](https://arxiv.org/abs/2312.03732), we should instead scale alpha by the sqrt of the rank. Other options exist, but theoretically this is the optimum. The left plot shows other ranks and their perplexities (lower is better). To enable this, set `use_rslora = True` in Unsloth.

Our recommendation is to set the <mark style="background-color:green;">**alpha to equal to the rank, or at least 2 times the rank.**</mark> This means alpha/rank = 1 or 2.
{% endcolumn %}
{% endcolumns %}

## :dart: LoRA Target Modules and QLoRA vs LoRA

{% hint style="success" %}
Use:\
`target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj",]` to target both **MLP** and **attention** layers to increase accuracy.

**QLoRA uses 4-bit precision**, reducing VRAM usage by over 75%.

**LoRA (16-bit)** is slightly more accurate and faster.
{% endhint %}

According to empirical experiments and research papers like the original [QLoRA paper](https://arxiv.org/pdf/2305.14314), it's best to apply LoRA to both attention and MLP layers.

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-16bef8165ccace21d0533f1941b8268a165c6a37%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
The chart shows RougeL scores (higher is better) for different target module configurations, comparing LoRA vs QLoRA.

The first 3 dots show:

1. **QLoRA-All:** LoRA applied to all FFN/MLP and Attention layers.\
   :fire: *This performs best overall.*
2. **QLoRA-FFN**: LoRA only on FFN.\
   Equivalent to: `gate_proj`, `up_proj`, `down_proj.`
3. **QLoRA-Attention**: LoRA applied only to Attention layers.\
   Equivalent to: `q_proj`, `k_proj`, `v_proj`, `o_proj`.
   {% endcolumn %}
   {% endcolumns %}

## :sunglasses: Training on completions only, masking out inputs

The [QLoRA paper](https://arxiv.org/pdf/2305.14314) shows that masking out inputs and **training only on completions** (outputs or assistant messages) can further **increase accuracy** by a few percentage points (*1%*). Below demonstrates how this is done in Unsloth:

{% columns %}
{% column %}
**NOT** training on completions only:

**USER:** <mark style="background-color:green;">Hello what is 2+2?</mark>\
**ASSISTANT:** <mark style="background-color:green;">The answer is 4.</mark>\
**USER:** <mark style="background-color:green;">Hello what is 3+3?</mark>\
**ASSISTANT:** <mark style="background-color:green;">The answer is 6.</mark>
{% endcolumn %}

{% column %}
**Training** on completions only:

**USER:** ~~Hello what is 2+2?~~\
**ASSISTANT:** <mark style="background-color:green;">The answer is 4.</mark>\
**USER:** ~~Hello what is 3+3?~~\
**ASSISTANT:** <mark style="background-color:green;">The answer is 6</mark><mark style="background-color:green;">**.**</mark>
{% endcolumn %}
{% endcolumns %}

The QLoRA paper states that **training on completions only** increases accuracy by quite a bit, especially for multi-turn conversational finetunes! We do this in our [conversational notebooks here](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(1B_and_3B\)-Conversational.ipynb).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7e73b480d1db1dd3d52dd0d4a7e24caff6a54be0%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

To enable **training on completions** in Unsloth, you will need to define the instruction and assistant parts. :sloth: *We plan to further automate this for you in the future!*

For Llama 3, 3.1, 3.2, 3.3 and 4 models, you define the parts as follows:

For Gemma 2, 3, 3n models, you define the parts as follows:

## :key: **Avoiding Overfitting & Underfitting**

### **Overfitting** (Poor Generalization/Too Specialized)

The model memorizes the training data, including its statistical noise, and consequently fails to generalize to unseen data.

{% hint style="success" %}
If your training loss drops below 0.2, your model is likely **overfitting** — meaning it may perform poorly on unseen tasks.

One simple trick is LoRA alpha scaling — just multiply the alpha value of each LoRA matrix by 0.5. This effectively scales down the impact of fine-tuning.

**This is closely related to merging / averaging weights.**\
You can take the original base (or instruct) model, add the LoRA weights, then divide the result by 2. This gives you an averaged model — which is functionally equivalent to reducing the `alpha` by half.
{% endhint %}

* **Adjust the learning rate:** A high learning rate often leads to overfitting, especially during short training runs. For longer training, a higher learning rate may work better. It’s best to experiment with both to see which performs best.
* **Reduce the number of training epochs**. Stop training after 1, 2, or 3 epochs.
* **Increase** `weight_decay`. A value of `0.01` or `0.1` is a good starting point.
* **Increase** `lora_dropout`. Use a value like `0.1` to add regularization.
* **Increase batch size or gradient accumulation steps**.
* **Dataset expansion** - make your dataset larger by combining or concatenating open source datasets with your dataset. Choose higher quality ones.
* **Evaluation early stopping** - enable evaluation and stop when the evaluation loss increases for a few steps.
* **LoRA Alpha Scaling** - scale the alpha down after training and during inference - this will make the finetune less pronounced.
* **Weight averaging** - literally add the original instruct model and the finetune and divide the weights by 2.

### **Underfitting** (Too Generic)

The model fails to capture the underlying patterns in the training data, often due to insufficient complexity or training duration.

* **Adjust the Learning Rate:** If the current rate is too low, increasing it may speed up convergence, especially for short training runs. For longer runs, try lowering the learning rate instead. Test both approaches to see which works best.
* **Increase Training Epochs:** Train for more epochs, but monitor validation loss to avoid overfitting.
* **Increase LoRA Rank** (`r`) and alpha: Rank should at least equal to the alpha number, and rank should be bigger for smaller models/more complex datasets; it usually is between 4 and 64.
* **Use a More Domain-Relevant Dataset**: Ensure the training data is high-quality and directly relevant to the target task.
* **Decrease batch size to 1**. This will cause the model to update more vigorously.

{% hint style="success" %}
Fine-tuning has no single "best" approach, only best practices. Experimentation is key to finding what works for your specific needs. Our notebooks automatically set optimal parameters based on many papers research and our experiments, giving you a great starting point. Happy fine-tuning!
{% endhint %}

***Acknowledgements:** A huge thank you to* [*Eyera*](https://huggingface.co/Orenguteng) *for contributing to this guide!*

**Examples:**

Example 1 (python):
```python
r = 16, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
```

Example 2 (python):
```python
target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                     "gate_proj", "up_proj", "down_proj",],
```

Example 3 (python):
```python
lora_alpha = 16,
```

Example 4 (python):
```python
lora_dropout = 0, # Supports any, but = 0 is optimized
```

---

## LoRA Hot Swapping Guide

**URL:** llms-txt#lora-hot-swapping-guide

**Contents:**
  - :shaved\_ice: vLLM LoRA Hot Swapping / Dynamic LoRAs

### :shaved\_ice: vLLM LoRA Hot Swapping / Dynamic LoRAs

To enable LoRA serving for at most 4 LoRAs at 1 time (these are hot swapped / changed), first set the environment flag to allow hot swapping:

Then, serve it with LoRA support:

To load a LoRA dynamically (set the lora name as well), do:

To remove it from the pool:

For example when finetuning with Unsloth:

{% code overflow="wrap" %}

Then after training, we save the LoRAs:

We can then load the LoRA:

{% code overflow="wrap" %}

**Examples:**

Example 1 (bash):
```bash
export VLLM_ALLOW_RUNTIME_LORA_UPDATING=True
```

Example 2 (bash):
```bash
export VLLM_ALLOW_RUNTIME_LORA_UPDATING=True
vllm serve unsloth/Llama-3.1-8B-Instruct \
    --quantization fp8 \
    --kv-cache-dtype fp8
    --gpu-memory-utilization 0.8 \
    --max-model-len 65536 \
    --enable-lora \
    --max-loras 4 \
    --max-lora-rank 64
```

Example 3 (bash):
```bash
curl -X POST http://localhost:8000/v1/load_lora_adapter \
    -H "Content-Type: application/json" \
    -d '{
        "lora_name": "LORA_NAME",
        "lora_path": "/path/to/LORA"
    }'
```

Example 4 (bash):
```bash
curl -X POST http://localhost:8000/v1/unload_lora_adapter \
    -H "Content-Type: application/json" \
    -d '{
        "lora_name": "LORA_NAME"
    }'
```

---

## Memory Efficient RL

**URL:** llms-txt#memory-efficient-rl

**Contents:**
- :sparkles:How to enable optimizations
- :mortar\_board:No more `gpu_memory_utilization`!
- :interrobang:Why does RL use so much memory?
- 🦥Unsloth Standby
- 🧪Performance Experiments
  - H100 Experiments
  - Previous A100 40GB experiments
- :tada:Other optimizations
- :books:GRPO Notebooks

We're excited to introduce more efficient reinforcement learning (RL) in Unsloth with multiple algorithmic advancements:

* **1.2 to 1.7x increased context lengths** with no slowdown and no extra memory usage!
* **10% faster RL training runs** with revamped kernels and async data movements
* **2x faster `torch.compile` times** during model loading

Unsloth **already** increases RL training speed, context window and reduces VRAM usage by 50–90% vs. all other setups with FA2, but now [**Unsloth's Standby**](#unsloth-standby) improves this even further. Our Standby feature uniquely limits speed degradation compared to other implementations and sometimes makes training even faster!

Now, Qwen3-32B LoRA 16-bit can attain 6,144 context lengths vs 3,600 (**1.7x longer**) before on 1xH100 80GB GPU. Llama-3.1-8B QLoRA 4bit can attain 47,500 lengths vs 42,000 before (1.13x longer).

We made RL runs 10% faster through various kernel optimizations, and removed the LoRA communication channel between the CPU and GPU when switching from training to inference mode. Finally, we used custom `torch.compile` flags to make vLLM's rollout faster by 10%, and reduced compilation time by 2x.

## :sparkles:How to enable optimizations

To enable **Unsloth's Standby** feature, set the environment variable `UNSLOTH_VLLM_STANDBY` before any Unsloth import. Then set `gpu_memory_utilization = 0.95` and that's it!

## :mortar\_board:No more `gpu_memory_utilization`!

With Unsloth's new RL improvements, you NEVER have to worry about tuning or setting `gpu_memory_utilization` ever again - simply set it to 90% or 95% of GPU utilization - 100% sadly won't work since some space is needed for small tensors. Previously one had to tune it from 30% to 95% - no more now! Set it to the maximum and Unsloth will handle the rest!

## :interrobang:Why does RL use so much memory?

GRPO (and many RL variants) rely heavily on generation which is primarily powered by vLLM. But this comes comes with a steep cost since it requires constant **GPU memory for weights, activations, and the KV Cache**.

{% columns %}
{% column %}
Inference takes a lot of VRAM

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7e25501083081b201d59f6000219cafa535d2b2d%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
Whilst Training also uses VRAM!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-189fd45a9e7a6fa1e98d1c9646b57bd0ec48481d%2Ffig6-2.avif?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

This means RL needs to keep 2 sets of VRAM / memory on the GPU at the same time:

1. Inference engine (has model weights, KV cache)
2. Training engine (has model weights, activations, gradients, optimizer states)

Current RL frameworks have to split 50/50 for a 80GB GPU with 50% for inference and 50% for training. And moving weights from training mode to inference mode can take quite some time.

<table><thead><tr><th width="251.51666259765625">80GB GPU</th><th>Inference Engine (50%)</th><th>Training Engine (50%)</th></tr></thead><tbody><tr><td>Model Weights</td><td>16GB</td><td>16GB</td></tr><tr><td>KV Cache</td><td>24GB</td><td></td></tr><tr><td>Activations, Gradients, Optimizer States</td><td></td><td>24GB</td></tr></tbody></table>

Previous Unsloth versions already smartly optimizes the above, as we **share vLLM's weight space directly which removes the double memory usage of the model weights**. This frees up 16GB of space for example which can be used to increase context length or the speed of generation. Also, we don't need to do memory movements, which makes training faster.

| 80GB GPU                                 | Inference Engine (50%) | Training Engine (50%) |
| ---------------------------------------- | ---------------------- | --------------------- |
| Model Weights                            | **16GB SHARED**        | **<<< SHARED**        |
| KV Cache                                 | 24GB + 8GB= **32GB**   |                       |
| Activations, Gradients, Optimizer States |                        | 24GB + 8GB=**32GB**   |

But we can go further - we first note RL does inference then training then inference then training etc.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-6e9b6a2f7381de84ed6eeb0feedc566cd443acf3%2F5b957843-eb58-4778-8b90-f25767c51495.png?alt=media" alt=""><figcaption></figcaption></figure>

This means the memory space for inference and training can in theory be re-used, since inference and training are separate modes - this is where [vLLM's sleep mode feature](https://docs.vllm.ai/en/latest/features/sleep_mode.html#rlhf-weight-updates) comes in, which has 2 options:

1. `level = 1` copies weights to the CPU and deletes KV cache
2. `level = 2` deletes weights and deletes KV cache

But reminder in Unsloth we share vLLM's memory space for the weights - this means we need a new way to delete the KV cache, and ignore deletion of the weights, and we call this Unsloth Standby.

| 80GB GPU                                                                                                                                                            | Inference Engine | Training Engine                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------- |
| Model Weights                                                                                                                                                       | **16GB SHARED**  | **<<< SHARED**                           |
| <p><mark style="background-color:purple;"><strong>Multi-purpose</strong></mark></p><p><mark style="background-color:purple;"><strong>64GB space</strong></mark></p> | KV Cache         | Activations, Gradients, Optimizer States |

To enable this, simply add the below to all RL / GRPO training runs before any Unsloth import:

## 🧪Performance Experiments

Here you will find out how we benchmarked memory usage and context length for GRPO. Note that we do **2 generations per prompt because for GRPO to work**, we need at least 2 generations for which to calculate the sample mean and variance. **Without 2 generations, the standard deviation of one sample is 0**. This causes the advantages which uses this: (reward - mean)/std **to be undefined**.

$$
Z=\frac{r\_i - \mu}{\sqrt{\frac{1}{n}\sum(r\_i-\mu)^2}} \\
Z\_{n=1}=\frac{r\_1 - \mu}{\sqrt{\frac{1}{1}\sum(r\_1-\mu)^2}}=\frac{0}{0}=\text{undefined}
$$

This means for GRPO specifically, a maximum context length of 6,144 for Qwen-3 32B is actually 6,144 multiplied by 2 generations ie 12,288 in length.

We provide experiments for Llama-3.1 8B on both LoRA (16bit) and QLoRA (4bit) below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2f83185e373186aa67bc2ce7d1814b2edb0f3ce6%2Foutput%20(10).png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

**If you notice any training time differences, it isn’t much**. In our apples to apples comparison we noticed <1% training time slowdowns or even speedups which can be attributed to margin of error.

We also theorize speedups are possible due to reduced memory pressure, so there might be less memory cleanup on the CUDA memory allocator side.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-db26f62f9080dba942add171880537c3f516f065%2Fgpu%20mem%20cofigure.png?alt=media" alt=""><figcaption></figcaption></figure>

In the above image, you see the difference between baseline and standby mode on a single T4 GPU for Qwen 3 4B. <mark style="background-color:green;">**We can stretch the vllm's**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`gpu_memory_utilisation`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**to as high as 0.95 without worrying that it'd affect training**</mark>. This means you can fit higher context length sequences and more sequences can be processed. In the first case, for example, we have enough memory to fit and process 32K length sequences provided training allows where as previously, any inputs longer than 2K would potentially not fit in and end up causing OOMs (out of memory).

<table data-full-width="true"><thead><tr><th>Experiments</th><th>Config</th><th>Status</th><th>GPU Memory usage</th><th>Comments</th></tr></thead><tbody><tr><td><ol><li><a href="https://colab.research.google.com/drive/18CssBY5C0mStnLvu2Hlt4aFLoPugRG0K?usp=sharing">u0.95gen2ga1s Qwen3_(4B)-GRPO.ipynb</a></li></ol></td><td><p><code>standby True</code></p><p><code>vllm_gpu_util 0.95</code></p><p><code>num_gen 2</code></p><p><code>grad_acc_steps 2</code></p></td><td>Runs for 40 steps/ 40 minutes</td><td><p>14.5 GiB (set by vllm_gpu_util)</p><p><br></p></td><td>Enough to fit in 32K KVCache with chunk of 2-4K or say 16K KVCache + 16K chunks</td></tr><tr><td><ol start="2"><li><a href="https://colab.research.google.com/drive/1q0TOUychygfreI2wKpg51sqnRhs5cYnX?usp=sharing">u9ge2ga2s Qwen3_(4B)-GRPO.ipynb</a></li></ol></td><td><p><code>standby True</code></p><p><code>vllm_gpu_util 0.9</code></p><p><code>num_gen 2</code></p><p><code>grad_acc_steps 2</code></p></td><td>Runs 32 steps in 40 m</td><td>13.8 GiB (set by…)</td><td>Approx enough to fit in ~28K KVCache with chunk of 2-4K or say 15K KVCache + 15K chunks</td></tr><tr><td><ol start="3"><li><a href="https://colab.research.google.com/drive/12Uw8y5beLzPtx11mCWCYyh9Z_PEHHdId?usp=sharing">u9ge2ga2ns Qwen3_(4B)-GRPO.ipynb</a></li></ol></td><td><p><code>standby False</code></p><p><code>vllm_gpu_util 0.9</code></p><p><code>num_gen 2</code></p><p><code>grad_acc_steps 2</code></p></td><td>model loads but can’t train because even batch size of 1 doesn’t fit</td><td>OOM</td><td><br></td></tr><tr><td><ol start="4"><li><a href="https://colab.research.google.com/drive/1GwTlaP5CLsW-BcE1LqZWkz6S8VTWYdJ2?usp=sharing">u8ge2ga2ns Qwen3_(4B)-GRPO.ipynb</a></li></ol></td><td><p><code>standby False</code></p><p><code>vllm_gpu_util 0.8</code></p><p><code>num_gen 2</code></p><p><code>grad_acc_steps 2</code></p></td><td>model loads but can’t train because even batch size of 1 doesn’t fit</td><td>OOM</td><td><br></td></tr><tr><td><ol start="5"><li><a href="https://colab.research.google.com/drive/1IuSUNzEBTiURK-vbTQuRDuUl0Ya2pz2t?usp=sharing">u7ge2ga2ns Qwen3_(4B)-GRPO.ipynb</a></li></ol></td><td><p><code>standby False</code></p><p><code>vllm_gpu_util 0.7</code></p><p><code>num_gen 2</code></p><p><code>grad_acc_steps 2</code></p></td><td><p>Trains fine</p><p>28 steps take 39min</p></td><td>~15.1GiB</td><td>any input slightly longer will result in OOM on colab</td></tr><tr><td><ol start="6"><li><a href="https://colab.research.google.com/drive/1RY7HwpZ0luJT70OyLJ6zXKZQ2COdT9QJ?usp=sharing">u7gen2ga2s Qwen3_(4B)-GRPO.ipynb</a></li></ol></td><td><p><code>standby True</code></p><p><code>vllm_gpu_util 0.7</code></p><p><code>num_gen 2</code></p><p><code>grad_acc_steps 2</code></p></td><td><p>Trains fine</p><p>29 steps take 40min</p></td><td>13GiB but most of the time around 10-11GB</td><td>At the same config, we save 2GiB aka 15% memory here.<br>Can be higher for longer sequences</td></tr></tbody></table>

| Model                | GPU                   | Seq Len | Num Generations | Grad Acc Steps |
| -------------------- | --------------------- | ------- | --------------- | -------------- |
| Qwen2.5-14B-Instruct | NVIDIA H100 80GB PCIe | 32,768  | 8               | 4              |

In our collapsible results below, you can see there is a 9GiB difference in the peak memory used (note that 90% of the time, the GPU memory usage is equal to the peak memory in our case). **To put things into perspective, using TRL and LoRA we were able to only fine-tune an 8B parameter model with a context length of 1024 at max (32x less).** Anything with higher sequence length (with similar configuration) results in the process failing with OOM.

<summary>Click for Unsloth Standby Mode vs. no Standby Benchmarks</summary>

The image below shows how standby compares against non standby training with Unsloth. It is averaged over 3 runs to make sure the metrics aren’t noisy. In fact, if you zoom in close enough, you’d see that enabling standby makes it faster as well, probably due to less memory pressure as discussed before.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2f285043ea8afa38d1082513e424662d8cd04b90%2Ftrainglobalstep.png?alt=media" alt=""><figcaption></figcaption></figure>

### Previous A100 40GB experiments

In our previous experiments on A100 40GB GPU with Qwen-2.5-3b-instruct and 8 generations per sample, we observed that without standby, the GRPO training (model loaded in 16bit, LoRA, only weights trainable), we could only fit 6K sequence lengths. With our standby feature, we were able to fit 10K and beyond! **For comparison TRL can only give you context lengths of up to 1K while holding the same batch size.**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-c7cd807b5d513b04f5f3a6219bfcea0fb12e442a%2Fqwen3%20gpu%20mem.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

## :tada:Other optimizations

We now select better compilation flags and reduce compile times by 50% or more. We also managed to dynamically patch any vLLM version to handle `gc.collect` better for backwards compatibility reasons, as inspired from this [vLLM pull request](https://github.com/vllm-project/vllm/pull/21146). This reduces compilation times from 2 minutes to under 40 seconds.

We also optimized `torch.compile` flags and tried turning on some flags - unfortunately `combo_kernels` and `multi_kernel` could not function correctly on vLLM 0.10 and Torch 2.8/2.9 nightly and `coordinate_descent_tuning` made autotuning all kernels dramatically slower. It used to compile in under a minute, but enabling it took over 13 minutes and more, with minimal performance gains.

## :books:GRPO Notebooks

All our GRPO notebooks have Unsloth Standby on by default and all optimizations! See <https://docs.unsloth.ai/get-started/unsloth-notebooks> for all our GRPO notebooks, or try the below:

* [**Qwen3 (4B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-GRPO.ipynb) **-** Advanced GRPO LoRA
* [**DeepSeek-R1-0528-Qwen3 (8B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/DeepSeek_R1_0528_Qwen3_\(8B\)_GRPO.ipynb) (for multilingual usecases)
* [Gemma 3 (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(1B\)-GRPO.ipynb)
* [Llama 3.2 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Advanced_Llama3_2_\(3B\)_GRPO_LoRA.ipynb) - Advanced GRPO LoRA
* [Llama 3.1 (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_\(8B\)-GRPO.ipynb)
* [Phi-4 (14B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_4_\(14B\)-GRPO.ipynb)
* [Mistral v0.3 (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-GRPO.ipynb)
* [Qwen2.5 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_\(3B\)-GRPO.ipynb)

**Examples:**

Example 1 (python):
```python
import os
os.environ["UNSLOTH_VLLM_STANDBY"] = "1"

from unsloth import FastLanguageModel
import torch
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen3-8B-Base",
    max_seq_length = 2048, # Can increase for longer reasoning traces
    load_in_4bit = False, # False for LoRA 16bit
    fast_inference = True,
    max_lora_rank = 32, # Larger rank = smarter, but slower
    gpu_memory_utilization = 0.95,
)
```

Example 2 (python):
```python
import os
os.environ["UNSLOTH_VLLM_STANDBY"] = "1"
```

Example 3 (unknown):
```unknown
Standy mode enabled:

|===========================================================================|
|                  PyTorch CUDA memory summary, device ID 0                 |
|---------------------------------------------------------------------------|
|            CUDA OOMs: 0            |        cudaMalloc retries: 0         |
|===========================================================================|
|        Metric         | Cur Usage  | Peak Usage | Tot Alloc  | Tot Freed  |
|---------------------------------------------------------------------------|
| Allocated memory      |  32249 MiB |  43042 MiB | 128336 GiB | 128305 GiB |
|       from large pool |  31415 MiB |  42165 MiB | 127204 GiB | 127173 GiB |
|       from small pool |    834 MiB |   1184 MiB |   1132 GiB |   1131 GiB |
|---------------------------------------------------------------------------|
| Active memory         |  32249 MiB |  43042 MiB | 128336 GiB | 128305 GiB |
|       from large pool |  31415 MiB |  42165 MiB | 127204 GiB | 127173 GiB |
|       from small pool |    834 MiB |   1184 MiB |   1132 GiB |   1131 GiB |
|---------------------------------------------------------------------------|
| Requested memory      |  32199 MiB |  42987 MiB | 128176 GiB | 128145 GiB |
|       from large pool |  31364 MiB |  42110 MiB | 127047 GiB | 127016 GiB |
|       from small pool |    834 MiB |   1184 MiB |   1129 GiB |   1128 GiB |
|---------------------------------------------------------------------------|
| GPU reserved memory   |  37644 MiB |  47504 MiB | 705806 MiB | 668162 MiB |
|       from large pool |  36376 MiB |  46588 MiB | 682818 MiB | 646442 MiB |
|       from small pool |   1268 MiB |   1284 MiB |  22988 MiB |  21720 MiB |
|---------------------------------------------------------------------------|
| Non-releasable memory | 713142 KiB |   4633 MiB | 103206 GiB | 103205 GiB |
|       from large pool | 525312 KiB |   4594 MiB | 101923 GiB | 101922 GiB |
|       from small pool | 187830 KiB |    250 MiB |   1283 GiB |   1283 GiB |
|---------------------------------------------------------------------------|
| Allocations           |    3460    |    4809    |   15606 K  |   15603 K  |
|       from large pool |     395    |     563    |    2812 K  |    2811 K  |
|       from small pool |    3065    |    4270    |   12794 K  |   12791 K  |
|---------------------------------------------------------------------------|
| Active allocs         |    3460    |    4809    |   15606 K  |   15603 K  |
|       from large pool |     395    |     563    |    2812 K  |    2811 K  |
|       from small pool |    3065    |    4270    |   12794 K  |   12791 K  |
|---------------------------------------------------------------------------|
| GPU reserved segments |     913    |     920    |   13260    |   12347    |
|       from large pool |     279    |     305    |    1766    |    1487    |
|       from small pool |     634    |     642    |   11494    |   10860    |
|---------------------------------------------------------------------------|
| Non-releasable allocs |     422    |     628    |    4766 K  |    4765 K  |
|       from large pool |      66    |      92    |    1290 K  |    1289 K  |
|       from small pool |     356    |     555    |    3476 K  |    3475 K  |
|---------------------------------------------------------------------------|
| Oversize allocations  |       0    |       0    |       0    |       0    |
|---------------------------------------------------------------------------|
| Oversize GPU segments |       0    |       0    |       0    |       0    |
|===========================================================================|


Without Standby:

|===========================================================================|
|                  PyTorch CUDA memory summary, device ID 0                 |
|---------------------------------------------------------------------------|
|            CUDA OOMs: 0            |        cudaMalloc retries: 0         |
|===========================================================================|
|        Metric         | Cur Usage  | Peak Usage | Tot Alloc  | Tot Freed  |
|---------------------------------------------------------------------------|
| Allocated memory      |  32711 MiB |  52084 MiB | 142756 GiB | 142724 GiB |
|       from large pool |  31877 MiB |  51207 MiB | 141499 GiB | 141467 GiB |
|       from small pool |    834 MiB |   1184 MiB |   1257 GiB |   1256 GiB |
|---------------------------------------------------------------------------|
| Active memory         |  32711 MiB |  52084 MiB | 142756 GiB | 142724 GiB |
|       from large pool |  31877 MiB |  51207 MiB | 141499 GiB | 141467 GiB |
|       from small pool |    834 MiB |   1184 MiB |   1257 GiB |   1256 GiB |
|---------------------------------------------------------------------------|
| Requested memory      |  32572 MiB |  51658 MiB | 141898 GiB | 141866 GiB |
|       from large pool |  31738 MiB |  50780 MiB | 140644 GiB | 140613 GiB |
|       from small pool |    833 MiB |   1184 MiB |   1253 GiB |   1252 GiB |
|---------------------------------------------------------------------------|
| GPU reserved memory   |  49552 MiB |  52188 MiB |  86354 MiB |  36802 MiB |
|       from large pool |  48320 MiB |  51300 MiB |  84740 MiB |  36420 MiB |
|       from small pool |   1232 MiB |   1232 MiB |   1614 MiB |    382 MiB |
|---------------------------------------------------------------------------|
| Non-releasable memory |      0 B   |      0 B   |      0 B   |      0 B   |
|       from large pool |      0 B   |      0 B   |      0 B   |      0 B   |
|       from small pool |      0 B   |      0 B   |      0 B   |      0 B   |
|---------------------------------------------------------------------------|
| Allocations           |    3460    |    4809    |   17440 K  |   17437 K  |
|       from large pool |     395    |     564    |    2742 K  |    2741 K  |
|       from small pool |    3065    |    4270    |   14698 K  |   14695 K  |
|---------------------------------------------------------------------------|
| Active allocs         |    3460    |    4809    |   17440 K  |   17437 K  |
|       from large pool |     395    |     564    |    2742 K  |    2741 K  |
|       from small pool |    3065    |    4270    |   14698 K  |   14695 K  |
|---------------------------------------------------------------------------|
| GPU reserved segments |       0    |       0    |       0    |       0    |
|       from large pool |       0    |       0    |       0    |       0    |
|       from small pool |       0    |       0    |       0    |       0    |
|---------------------------------------------------------------------------|
| Non-releasable allocs |       0    |       0    |       0    |       0    |
|       from large pool |       0    |       0    |       0    |       0    |
|       from small pool |       0    |       0    |       0    |       0    |
|---------------------------------------------------------------------------|
| Oversize allocations  |       0    |       0    |       0    |       0    |
|---------------------------------------------------------------------------|
| Oversize GPU segments |       0    |       0    |       0    |       0    |
|===========================================================================|
```

---

## model.push_to_hub("your_name/lora_model", token = "...") # Online saving

**URL:** llms-txt#model.push_to_hub("your_name/lora_model",-token-=-"...")-#-online-saving

---

## Multi-GPU Fine-tuning with Distributed Data Parallel (DDP)

**URL:** llms-txt#multi-gpu-fine-tuning-with-distributed-data-parallel-(ddp)

**Contents:**
  - Use the Unsloth CLI!

Learn how to use the Unsloth CLI to train on multiple GPUs with Distributed Data Parallel (DDP)!

Let’s assume we have multiple GPUs, and we want to fine-tune a model using all of them! To do so, the most straightforward strategy is to use Distributed Data Parallel (DDP), which creates one copy of the model on each GPU device, feeding each copy distinct samples from the dataset during training and aggregating their contributions to weight updates per optimizer step.

Why would we want to do this? Well, as we add more GPUs into the training process, we scale the number of samples our models train on per step, making each gradient update more stable and increasing our training throughput dramatically with each added GPU.

Here’s a step-by-step guide on how to do this using Unsloth’s command-line interface (CLI)!

**Note:** Unsloth DDP will work with any of your training scripts, not just via our CLI! More details below.

#### Install Unsloth from source

We’ll clone Unsloth from GitHub and install it. Please consider using a [virtual environment](https://docs.python.org/3/tutorial/venv.html); we like to use `uv venv –python 3.12 && source .venv/bin/activate`, but any virtual environment creation tooling will do.

#### Choose target model and dataset for finetuning

In this demo, we will fine-tune [Qwen/Qwen3-8B](https://huggingface.co/Qwen/Qwen3-8B) on the [yahma/alpaca-cleaned](https://huggingface.co/datasets/yahma/alpaca-cleaned) chat dataset. This is a Supervised Fine-Tuning (SFT) workload that is commonly used when attempting to adapt a base model to a desired conversational style, or improve the model’s performance on a downstream task.

### Use the Unsloth CLI!

First, let’s take a look at the help message built-in to the CLI (we’ve abbreviated here with “...” in various places for brevity):

{% code expandable="true" %}

This should give you a sense of what options are available for you to pass into the CLI for training your model!

For multi-GPU training (DDP in this case), we will use the [torchrun](https://docs.pytorch.org/docs/stable/elastic/run.html) launcher, which allows you to spin up multiple distributed training processes in single-node or multi-node settings. In our case, we will focus on the single-node (i.e., one machine) case with two H100 GPUs.

Let’s also check our GPUs’ status by using the `nvidia-smi` command-line tool:

{% code expandable="true" %}

Great! We have two H100 GPUs, as expected. Both are sitting at 0MiB memory usage as we’re currently not training anything, or have any model loaded into memory.

To start your training run, issue a command like the following:

{% code expandable="true" %}

**Examples:**

Example 1 (bash):
```bash
git clone https://github.com/unslothai/unsloth.git
cd unsloth
pip install .
```

Example 2 (bash):
```bash
$ python unsloth-cli.py --help
usage: unsloth-cli.py [-h] [--model_name MODEL_NAME] [--max_seq_length MAX_SEQ_LENGTH] [--dtype DTYPE]
                      [--load_in_4bit] [--dataset DATASET] [--r R] [--lora_alpha LORA_ALPHA]
                      [--lora_dropout LORA_DROPOUT] [--bias BIAS]
                      [--use_gradient_checkpointing USE_GRADIENT_CHECKPOINTING]
…

🦥 Fine-tune your llm faster using unsloth!

options:
  -h, --help            show this help message and exit

🤖 Model Options:
  --model_name MODEL_NAME
                        Model name to load
  --max_seq_length MAX_SEQ_LENGTH
                        Maximum sequence length, default is 2048. We auto support RoPE Scaling
                        internally!
…

🧠 LoRA Options:
  These options are used to configure the LoRA model.

  --r R                 Rank for Lora model, default is 16. (common values: 8, 16, 32, 64, 128)
  --lora_alpha LORA_ALPHA
                        LoRA alpha parameter, default is 16. (common values: 8, 16, 32, 64, 128)
…

🎓 Training Options:
  --per_device_train_batch_size PER_DEVICE_TRAIN_BATCH_SIZE
                        Batch size per device during training, default is 2.
  --per_device_eval_batch_size PER_DEVICE_EVAL_BATCH_SIZE
                        Batch size per device during evaluation, default is 4.
  --gradient_accumulation_steps GRADIENT_ACCUMULATION_STEPS
                        Number of gradient accumulation steps, default is 4.
…
```

Example 3 (bash):
```bash
$ nvidia-smi
Mon Nov 24 12:53:00 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.95.05              Driver Version: 580.95.05      CUDA Version: 13.0     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H100 80GB HBM3          On  |   00000000:04:00.0 Off |                    0 |
| N/A   32C    P0             69W /  700W |       0MiB /  81559MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA H100 80GB HBM3          On  |   00000000:05:00.0 Off |                    0 |
| N/A   30C    P0             68W /  700W |       0MiB /  81559MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```

---

## Multi-GPU Fine-tuning with Unsloth

**URL:** llms-txt#multi-gpu-fine-tuning-with-unsloth

Learn how to fine-tune LLMs on multiple GPUs and parallelism with Unsloth.

Unsloth currently supports multi-GPU setups through libraries like Accelerate and DeepSpeed. This means you can already leverage parallelism methods such as **FSDP** and **DDP** with Unsloth.

#### **See our new Distributed Data Parallel** [**(DDP) multi-GPU Guide here**](https://docs.unsloth.ai/basics/multi-gpu-training-with-unsloth/ddp)**.**

We know that the process can be complex and requires manual setup. We’re working hard to make multi-GPU support much simpler and more user-friendly, and we’ll be announcing official multi-GPU support for Unsloth soon.

For now, you can use our [Magistral-2509 Kaggle notebook](https://docs.unsloth.ai/models/tutorials-how-to-fine-tune-and-run-llms/magistral-how-to-run-and-fine-tune#fine-tuning-magistral-with-unsloth) as an example which utilizes multi-GPU Unsloth to fit the 24B parameter model or our [DDP guide](https://docs.unsloth.ai/basics/multi-gpu-training-with-unsloth/ddp).

**In the meantime**, to enable multi GPU for DDP, do the following:

1. Create your training script as `train.py` (or similar). For example, you can use one of our [training scripts](https://github.com/unslothai/notebooks/tree/main/python_scripts) created from our various notebooks!
2. Run `accelerate launch train.py` or `torchrun --nproc_per_node N_GPUS train.py` where `N_GPUS` is the number of GPUs you have.

**Pipeline / model splitting loading** is also allowed, so if you do not have enough VRAM for 1 GPU to load say Llama 70B, no worries - we will split the model for you on each GPU! To enable this, use the `device_map = "balanced"` flag:

**Stay tuned for our official announcement!**\
For more details, check out our ongoing [Pull Request](https://github.com/unslothai/unsloth/issues/2435) discussing multi-GPU support.

**Examples:**

Example 1 (python):
```python
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/Llama-3.3-70B-Instruct",
    load_in_4bit = True,
    device_map = "balanced",
)
```

---

## Print output

**URL:** llms-txt#print-output

**Contents:**
  - 🦥 Unsloth: Run DeepSeek-OCR Tutorial
- 🦥 **Fine-tuning DeepSeek-OCR**
  - Fine-tuned Evaluation Results:

for output in model_outputs:
    print(output.outputs[0].text)
python
from unsloth import FastVisionModel
import torch
from transformers import AutoModel
import os
os.environ["UNSLOTH_WARN_UNINITIALIZED"] = '0'

from huggingface_hub import snapshot_download
snapshot_download("unsloth/DeepSeek-OCR", local_dir = "deepseek_ocr")
model, tokenizer = FastVisionModel.from_pretrained(
    "./deepseek_ocr",
    load_in_4bit = False, # Use 4bit to reduce memory use. False for 16bit LoRA.
    auto_model = AutoModel,
    trust_remote_code = True,
    unsloth_force_compile = True,
    use_gradient_checkpointing = "unsloth", # True or "unsloth" for long context
)

prompt = "<image>\nFree OCR. "
image_file = 'your_image.jpg'
output_path = 'your/output/dir'
res = model.infer(tokenizer, prompt=prompt, image_file=image_file, output_path = output_path, base_size = 1024, image_size = 640, crop_mode=True, save_results = True, test_compress = False)

============================================================
Baseline Model Performance
============================================================
Number of samples: 200
Mean CER: 149.07%
Median CER: 80.00%
Std Dev: 310.39%
Min CER: 0.00%
Max CER: 3500.00%
============================================================

Best Predictions (Lowest CER):

Sample 5024 (CER: 0.00%)
Reference:  چون هستی خیلی زیاد...
Prediction: چون هستی خیلی زیاد...

Sample 3517 (CER: 0.00%)
Reference:  تو ایران هیچوقت از اینها وجود نخواهد داشت...
Prediction: تو ایران هیچوقت از اینها وجود نخواهد داشت...

Sample 9949 (CER: 0.00%)
Reference:  کاش میدونستم هیچی بیخیال...
Prediction: کاش میدونستم هیچی بیخیال...

Worst Predictions (Highest CER):

Sample 11155 (CER: 3500.00%)
Reference:  خسو...
Prediction: \[ \text{CH}_3\text{CH}_2\text{CH}_2\text{CH}_2\text{CH}_2\text{CH}_2\text{CH}_2\text{CH}_2\text{CH}...

Sample 13366 (CER: 1900.00%)
Reference:  مشو...
Prediction: \[\begin{align*}\underline{\mathfrak{su}}_0\end{align*}\]...

Sample 10552 (CER: 1014.29%)
Reference:  هیییییچ...
Prediction: e
```

{% column %}
**DeepSeek-OCR Fine-tuned**

With 60 steps, we reduced CER from 149.07% to 60.43% (89% CER improvement)

<pre><code><strong>============================================================
</strong>Fine-tuned Model Performance
============================================================
Number of samples: 200
Mean CER: 60.43%
Median CER: 50.00%
Std Dev: 80.63%
Min CER: 0.00%
Max CER: 916.67%
============================================================

Best Predictions (Lowest CER):

Sample 301 (CER: 0.00%)
Reference:  باشه بابا تو لاکچری، تو خاص، تو خفن...
Prediction: باشه بابا تو لاکچری، تو خاص، تو خفن...

Sample 2512 (CER: 0.00%)
Reference:  از شخص حاج عبدالله زنجبیلی میگیرنش...
Prediction: از شخص حاج عبدالله زنجبیلی میگیرنش...

Sample 2713 (CER: 0.00%)
Reference:  نمی دونم والا تحمل نقد ندارن ظاهرا...
Prediction: نمی دونم والا تحمل نقد ندارن ظاهرا...

Worst Predictions (Highest CER):

Sample 14270 (CER: 916.67%)
Reference:  ۴۳۵۹۴۷۴۷۳۸۹۰...
Prediction: پروپریپریپریپریپریپریپریپریپریپریپریپریپریپریپریپریپریپریپیپریپریپریپریپریپریپریپریپریپریپریپریپریپر...

Sample 3919 (CER: 380.00%)
Reference:  ۷۵۵۰۷۱۰۶۵۹...
Prediction: وادووووووووووووووووووووووووووووووووووو...

Sample 3718 (CER: 333.33%)
Reference:  ۳۲۶۷۲۲۶۵۵۸۴۶...
Prediction: پُپُسوپُسوپُسوپُسوپُسوپُسوپُسوپُسوپُسوپُ...
</code></pre>

{% endcolumn %}
{% endcolumns %}

An example from the 200K Persian dataset we used (you may use your own), showing the image on the left and the corresponding text on the right.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2afa75f90055db094d5cae1c635b200c05e97aac%2FScreenshot%202025-11-04%20at%206.10.16%E2%80%AFAM.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

### 🦥 Unsloth: Run DeepSeek-OCR Tutorial

1. Obtain the latest `unsloth` via `pip install --upgrade unsloth` . If you already have Unsloth, update it via `pip install --upgrade --force-reinstall --no-deps --no-cache-dir unsloth unsloth_zoo`
2. Then use the code below to run DeepSeek-OCR:

{% code overflow="wrap" %}
```

Example 2 (unknown):
```unknown
{% endcode %}

## 🦥 **Fine-tuning DeepSeek-OCR**

Unsloth supports fine-tuning of DeepSeek-OCR. Since the default model isn't runnable on the latest `transformers` version, we added changes from the [Stranger Vision HF](https://huggingface.co/strangervisionhf) team, to then enable inference. As usual, Unsloth trains DeepSeek-OCR 1.4x faster with 40% less VRAM and 5x longer context lengths - no accuracy degradation.\
\
We created two free DeepSeek-OCR Colab notebooks (with and without eval):

* DeepSeek-OCR: [Fine-tuning only notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Deepseek_OCR_\(3B\).ipynb)
* DeepSeek-OCR: [Fine-tuning + Evaluation notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Deepseek_OCR_\(3B\)-Eval.ipynb) (A100)

Fine-tuning DeepSeek-OCR on a 200K sample Persian dataset resulted in substantial gains in Persian text detection and understanding. We evaluated the base model against our fine-tuned version on 200 Persian transcript samples, observing an **88.26% absolute improvement** in Character Error Rate (CER). After only 60 training steps (batch size = 8), the mean CER decreased from **149.07%** to a mean of **60.81%**. This means the fine-tuned model is **57%** more accurate at understanding Persian.

You can replace the Persian dataset with your own to improve DeepSeek-OCR for other use-cases.\
\
For replica-table eval results, use our eval notebook above. For detailed eval results, see below:

### Fine-tuned Evaluation Results:

{% columns fullWidth="true" %}
{% column %}
**DeepSeek-OCR Baseline**

Mean Baseline Model Performance: 149.07% CER for this eval set!
```

---

## Quantization-Aware Training (QAT)

**URL:** llms-txt#quantization-aware-training-(qat)

**Contents:**
  - :books:Quantization
  - :fire:Smarter Quantization
  - :mag:Quantization-Aware Training
  - :sparkles:QAT + LoRA finetuning
  - :teapot:Exporting QAT models

Quantize models to 4-bit with Unsloth and PyTorch to recover accuracy.

In collaboration with PyTorch, we're introducing QAT (Quantization-Aware Training) in Unsloth to enable **trainable quantization** that recovers as much accuracy as possible. This results in significantly better model quality compared to standard 4-bit naive quantization. QAT can recover up to **70% of the lost accuracy** and achieve a **1–3%** model performance improvement on benchmarks such as GPQA and MMLU Pro.

> **Try QAT with our free** [**Qwen3 (4B) notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)_Instruct-QAT.ipynb)

### :books:Quantization

{% columns %}
{% column width="50%" %}
Naively quantizing a model is called **post-training quantization** (PTQ). For example, assume we want to quantize to 8bit integers:

1. Find `max(abs(W))`
2. Find `a = 127/max(abs(W))` where a is int8's maximum range which is 127
3. Quantize via `qW = int8(round(W * a))`
   {% endcolumn %}

{% column width="50%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f3e1cee8e4047dcbbbace7548694ad63af9869de%2Fquant-freeze.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

Dequantizing back to 16bits simply does the reverse operation by `float16(qW) / a` . Post-training quantization (PTQ) can greatly reduce storage and inference costs, but quite often degrades accuracy when representing high-precision values with fewer bits - especially at 4-bit or lower. One way to solve this to utilize our [**dynamic GGUF quants**](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs), which uses a calibration dataset to change the quantization procedure to allocate more importance to important weights. The other way is to make **quantization smarter, by making it trainable or learnable**!

### :fire:Smarter Quantization

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1f6260ef5c041ada2f8b1fb4c6aad114f61061d4%2F4bit_QAT_recovery_sideways_clipped75_bigtext_all(1).png?alt=media" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ad1ac9d29482ea07cbabb6efa18a0d1f06b297e9%2FQLoRA_QAT_Accuracy_Boosts_v7_bigaxes_nogrid_600dpi.png?alt=media" alt=""><figcaption></figcaption></figure></div>

To enable smarter quantization, we collaborated with the [TorchAO](https://github.com/pytorch/ao) team to add **Quantization-Aware Training (QAT)** directly inside of Unsloth - so now you can fine-tune models in Unsloth and then export them to 4-bit QAT format directly with accuracy improvements!

In fact, **QAT recovers 66.9%** of Gemma3-4B on GPQA, and increasing the raw accuracy by +1.0%. Gemma3-12B on BBH recovers 45.5%, and **increased the raw accuracy by +2.1%**. QAT has no extra overhead during inference, and uses the same disk and memory usage as normal naive quantization! So you get all the benefits of low-bit quantization, but with much increased accuracy!

### :mag:Quantization-Aware Training

QAT simulates the true quantization procedure by "**fake quantizing**" weights and optionally activations during training, which typically means rounding high precision values to quantized ones (while staying in high precision dtype, e.g. bfloat16) and then immediately dequantizing them.

TorchAO enables QAT by first (1) inserting fake quantize operations into linear layers, and (2) transforms the fake quantize operations to actual quantize and dequantize operations after training to make it inference ready. Step 1 enables us to train a more accurate quantization representation.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3d990e2bf19ef1aa7e65a8dd07e4b71cf8882a2a%2Fqat_diagram.png?alt=media" alt=""><figcaption></figcaption></figure>

### :sparkles:QAT + LoRA finetuning

QAT in Unsloth can additionally be combined with LoRA fine-tuning to enable the benefits of both worlds: significantly reducing storage and compute requirements during training while mitigating quantization degradation! We support multiple methods via `qat_scheme` including `fp8-int4`, `fp8-fp8`, `int8-int4`, `int4` . We also plan to add custom definitions for QAT in a follow up release!

{% code overflow="wrap" %}

### :teapot:Exporting QAT models

After fine-tuning in Unsloth, you can call `model.save_pretrained_torchao` to save your trained model using TorchAO’s PTQ format. You can also upload these to the HuggingFace hub! We support any config, and we plan to make text based methods as well, and to make the process more simpler for everyone! But first, we have to prepare the QAT model for the final conversion step via:

{% code overflow="wrap" %}

And now we can select which QAT style you want:

{% code overflow="wrap" %}

**Examples:**

Example 1 (python):
```python
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen3-4B-Instruct-2507",
    max_seq_length = 2048,
    load_in_16bit = True,
)
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj",],
    lora_alpha = 32,
    
    # We support fp8-int4, fp8-fp8, int8-int4, int4
    qat_scheme = "int4",
)
```

Example 2 (python):
```python
from torchao.quantization import quantize_
from torchao.quantization.qat import QATConfig
quantize_(model, QATConfig(step = "convert"))
```

---

## Saving to Ollama

**URL:** llms-txt#saving-to-ollama

**Contents:**
  - Saving on Google Colab
  - Exporting to Ollama
  - Automatic `Modelfile` creation
  - Ollama Inference
  - Running in Unsloth works well, but after exporting & running on Ollama, the results are poor

See our guide below for the complete process on how to save to [Ollama](https://github.com/ollama/ollama):

{% content-ref url="../../get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama" %}
[tutorial-how-to-finetune-llama-3-and-use-in-ollama](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama)
{% endcontent-ref %}

### Saving on Google Colab

You can save the finetuned model as a small 100MB file called a LoRA adapter like below. You can instead push to the Hugging Face hub as well if you want to upload your model! Remember to get a Hugging Face token via: <https://huggingface.co/settings/tokens> and add your token!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8c577103f7c4fe883cabaf35c8437307c6501686%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

After saving the model, we can again use Unsloth to run the model itself! Use `FastLanguageModel` again to call it for inference!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1a1be852ca551240bdce47cf99e6ccd7d31c1326%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

### Exporting to Ollama

Finally we can export our finetuned model to Ollama itself! First we have to install Ollama in the Colab notebook:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-24f9429ed4a8b3a630dc8f68dcf81555da0a80ee%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Then we export the finetuned model we have to llama.cpp's GGUF formats like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-56991ea7e2685bb9905af9baf2f3f685123dcdd8%2Fimage%20(52).png?alt=media" alt=""><figcaption></figcaption></figure>

Reminder to convert `False` to `True` for 1 row, and not change every row to `True`, or else you'll be waiting for a very time! We normally suggest the first row getting set to `True`, so we can export the finetuned model quickly to `Q8_0` format (8 bit quantization). We also allow you to export to a whole list of quantization methods as well, with a popular one being `q4_k_m`.

Head over to <https://github.com/ggerganov/llama.cpp> to learn more about GGUF. We also have some manual instructions of how to export to GGUF if you want here: <https://github.com/unslothai/unsloth/wiki#manually-saving-to-gguf>

You will see a long list of text like below - please wait 5 to 10 minutes!!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-271b392fdafd0e7d01c525d7a11a97ee5c34b713%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

And finally at the very end, it'll look like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a554bd388fd0394dd8cdef85fd9d208bfd7feee7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Then, we have to run Ollama itself in the background. We use `subprocess` because Colab doesn't like asynchronous calls, but normally one just runs `ollama serve` in the terminal / command prompt.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e431609dfc5c742f0b5ab2388dbbd0d8e15c7670%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

### Automatic `Modelfile` creation

The trick Unsloth provides is we automatically create a `Modelfile` which Ollama requires! This is a just a list of settings and includes the chat template which we used for the finetune process! You can also print the `Modelfile` generated like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-6945ba10a2e25cfc198848c0e863001375c32c4c%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

We then ask Ollama to create a model which is Ollama compatible, by using the `Modelfile`

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d431a64613b39d913d1780c22cde37edc6564272%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

And we can now call the model for inference if you want to do call the Ollama server itself which is running on your own local machine / in the free Colab notebook in the background. Remember you can edit the yellow underlined part.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-49b93efa192fdd741f3ac8484cef8c3fd7415283%2FInference.png?alt=media" alt=""><figcaption></figcaption></figure>

### Running in Unsloth works well, but after exporting & running on Ollama, the results are poor

You might sometimes encounter an issue where your model runs and produces good results on Unsloth, but when you use it on another platform like Ollama, the results are poor or you might get gibberish, endless/infinite generations *or* repeated output&#x73;**.**

* The most common cause of this error is using an <mark style="background-color:blue;">**incorrect chat template**</mark>**.** It’s essential to use the SAME chat template that was used when training the model in Unsloth and later when you run it in another framework, such as llama.cpp or Ollama. When inferencing from a saved model, it's crucial to apply the correct template.
* You must use the correct `eos token`. If not, you might get gibberish on longer generations.
* It might also be because your inference engine adds an unnecessary "start of sequence" token (or the lack of thereof on the contrary) so ensure you check both hypotheses!
* <mark style="background-color:green;">**Use our conversational notebooks to force the chat template - this will fix most issues.**</mark>
  * Qwen-3 14B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(14B\)-Reasoning-Conversational.ipynb)
  * Gemma-3 4B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\).ipynb)
  * Llama-3.2 3B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(1B_and_3B\)-Conversational.ipynb)
  * Phi-4 14B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_4-Conversational.ipynb)
  * Mistral v0.3 7B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-Conversational.ipynb)
  * **More notebooks in our** [**notebooks docs**](https://docs.unsloth.ai/get-started/unsloth-notebooks)

---

## Setting up Wandb

**URL:** llms-txt#setting-up-wandb

**Contents:**
- :question:How do I do Early Stopping?

os.environ["WANDB_PROJECT"] = "<name>"
os.environ["WANDB_LOG_MODEL"] = "checkpoint"

report_to = "wandb",
logging_steps = 1, # Change if needed
save_steps = 100 # Change if needed
run_name = "<name>" # (Optional)

import wandb
run = wandb.init()
artifact = run.use_artifact('<username>/<Wandb-project-name>/<run-id>', type='model')
artifact_dir = artifact.download()
trainer.train(resume_from_checkpoint=artifact_dir)
python
from trl import SFTConfig, SFTTrainer
trainer = SFTTrainer(
    args = SFTConfig(
        fp16_full_eval = True,
        per_device_eval_batch_size = 2,
        eval_accumulation_steps = 4,
        output_dir = "training_checkpoints", # location of saved checkpoints for early stopping
        save_strategy = "steps",             # save model every N steps
        save_steps = 10,                     # how many steps until we save the model
        save_total_limit = 3,                # keep ony 3 saved checkpoints to save disk space
        eval_strategy = "steps",             # evaluate every N steps
        eval_steps = 10,                     # how many steps until we do evaluation
        load_best_model_at_end = True,       # MUST USE for early stopping
        metric_for_best_model = "eval_loss", # metric we want to early stop on
        greater_is_better = False,           # the lower the eval loss, the better
    ),
    model = model,
    tokenizer = tokenizer,
    train_dataset = new_dataset["train"],
    eval_dataset = new_dataset["test"],
)
python
from transformers import EarlyStoppingCallback
early_stopping_callback = EarlyStoppingCallback(
    early_stopping_patience = 3,     # How many steps we will wait if the eval loss doesn't decrease
                                     # For example the loss might increase, but decrease after 3 steps
    early_stopping_threshold = 0.0,  # Can set higher - sets how much loss should decrease by until
                                     # we consider early stopping. For eg 0.01 means if loss was
                                     # 0.02 then 0.01, we consider to early stop the run.
)
trainer.add_callback(early_stopping_callback)
```

Then train the model as usual via `trainer.train() .`

**Examples:**

Example 1 (unknown):
```unknown
Then in `TrainingArguments()` set
```

Example 2 (unknown):
```unknown
To train the model, do `trainer.train()`; to resume training, do
```

Example 3 (unknown):
```unknown
## :question:How do I do Early Stopping?

If you want to stop or pause the finetuning / training run since the evaluation loss is not decreasing, then you can use early stopping which stops the training process. Use `EarlyStoppingCallback`.

As usual, set up your trainer and your evaluation dataset. The below is used to stop the training run if the `eval_loss` (the evaluation loss) is not decreasing after 3 steps or so.
```

Example 4 (unknown):
```unknown
We then add the callback which can also be customized:
```

---

## Text-to-Speech (TTS) Fine-tuning

**URL:** llms-txt#text-to-speech-(tts)-fine-tuning

**Contents:**
  - Fine-tuning Notebooks:
  - Choosing and Loading a TTS Model
  - Preparing Your Dataset

Learn how to to fine-tune TTS & STT voice models with Unsloth.

Fine-tuning TTS models allows them to adapt to your specific dataset, use case, or desired style and tone. The goal is to customize these models to clone voices, adapt speaking styles and tones, support new languages, handle specific tasks and more. We also support **Speech-to-Text (STT)** models like OpenAI's Whisper.

With [Unsloth](https://github.com/unslothai/unsloth), you can fine-tune **any** TTS model (`transformers` compatible) 1.5x faster with 50% less memory than other implementations with Flash Attention 2.

⭐ **Unsloth supports any `transformers` compatible TTS model.** Even if we don’t have a notebook or upload for it yet, it’s still supported e.g., try fine-tuning Dia-TTS or Moshi.

{% hint style="info" %}
Zero-shot cloning captures tone but misses pacing and expression, often sounding robotic and unnatural. Fine-tuning delivers far more accurate and realistic voice replication. [Read more here](#fine-tuning-voice-models-vs.-zero-shot-voice-cloning).
{% endhint %}

### Fine-tuning Notebooks:

We've also uploaded TTS models (original and quantized) to our [Hugging Face page](https://huggingface.co/collections/unsloth/text-to-speech-tts-models-68007ab12522e96be1e02155).

| [Sesame-CSM (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Sesame_CSM_\(1B\)-TTS.ipynb) | [Orpheus-TTS (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Orpheus_\(3B\)-TTS.ipynb) | [Whisper Large V3](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Whisper.ipynb) (STT) |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [Spark-TTS (0.5B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Spark_TTS_\(0_5B\).ipynb)   | [Llasa-TTS (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llasa_TTS_\(1B\).ipynb)     | [Oute-TTS (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Oute_TTS_\(1B\).ipynb)  |

{% hint style="success" %}
If you notice that the output duration reaches a maximum of 10 seconds, increase`max_new_tokens = 125` from its default value of 125. Since 125 tokens corresponds to 10 seconds of audio, you'll need to set a higher value for longer outputs.
{% endhint %}

### Choosing and Loading a TTS Model

For TTS, smaller models are often preferred due to lower latency and faster inference for end users. Fine-tuning a model under 3B parameters is often ideal, and our primary examples uses Sesame-CSM (1B) and Orpheus-TTS (3B), a Llama-based speech model.

#### Sesame-CSM (1B) Details

**CSM-1B** is a base model, while **Orpheus-ft** is fine-tuned on 8 professional voice actors, making voice consistency the key difference. CSM requires audio context for each speaker to perform well, whereas Orpheus-ft has this consistency built in.

Fine-tuning from a base model like CSM generally needs more compute, while starting from a fine-tuned model like Orpheus-ft offers better results out of the box.

To help with CSM, we’ve added new sampling options and an example showing how to use audio context for improved voice consistency.

#### Orpheus-TTS (3B) Details

Orpheus is pre-trained on a large speech corpus and excels at generating realistic speech with built-in support for emotional cues like laughs and sighs. Its architecture makes it one of the easiest TTS models to utilize and train as it can be exported via llama.cpp meaning it has great compatibility across all inference engines. For unsupported models, you'll only be able to save the LoRA adapter safetensors.

#### Loading the models

Because voice models are usually small in size, you can train the models using LoRA 16-bit or full fine-tuning FFT which may provide higher quality results. To load it in LoRA 16-bit:

When this runs, Unsloth will download the model weights if you prefer 8-bit, you could use `load_in_8bit = True`, or for full fine-tuning set `full_finetuning = True` (ensure you have enough VRAM). You can also replace the model name with other TTS models.

{% hint style="info" %}
**Note:** Orpheus’s tokenizer already includes special tokens for audio output (more on this later). You do *not* need a separate vocoder – Orpheus will output audio tokens directly, which can be decoded to a waveform.
{% endhint %}

### Preparing Your Dataset

At minimum, a TTS fine-tuning dataset consists of **audio clips and their corresponding transcripts** (text). Let’s use the [*Elise* dataset](https://huggingface.co/datasets/MrDragonFox/Elise) which is \~3 hour single-speaker English speech corpus. There are two variants:

* [`MrDragonFox/Elise`](https://huggingface.co/datasets/MrDragonFox/Elise) – an augmented version with **emotion tags** (e.g. \<sigh>, \<laughs>) embedded in the transcripts. These tags in angle brackets indicate expressions (laughter, sighs, etc.) and are treated as special tokens by Orpheus’s tokenizer
* [`Jinsaryko/Elise`](https://huggingface.co/datasets/Jinsaryko/Elise) – base version with transcripts without special tags.

The dataset is organized with one audio and transcript per entry. On Hugging Face, these datasets have fields such as `audio` (the waveform), `text` (the transcription), and some metadata (speaker name, pitch stats, etc.). We need to feed Unsloth a dataset of audio-text pairs.

{% hint style="success" %}
Instead of solely focusing on tone, cadence, and pitch, the priority should be ensuring your dataset is fully annotated and properly normalized.
{% endhint %}

{% hint style="info" %}
With some models like **Sesame-CSM-1B**, you might notice voice variation across generations using speaker ID 0 because it's a **base model**—it doesn’t have fixed voice identities. Speaker ID tokens mainly help maintain **consistency within a conversation**, not across separate generations.

To get a consistent voice, provide **contextual examples**, like a few reference audio clips or prior utterances. This helps the model mimic the desired voice more reliably. Without this, variation is expected, even with the same speaker ID.
{% endhint %}

**Option 1: Using Hugging Face Datasets library** – We can load the Elise dataset using Hugging Face’s `datasets` library:

```python
from datasets import load_dataset, Audio

**Examples:**

Example 1 (python):
```python
from unsloth import FastModel

model_name = "unsloth/orpheus-3b-0.1-pretrained"
model, tokenizer = FastModel.from_pretrained(
    model_name,
    load_in_4bit=False  # use 4-bit precision (QLoRA)
)
```

---

## tokenizer.push_to_hub("your_name/lora_model", token = "...") # Online saving

**URL:** llms-txt#tokenizer.push_to_hub("your_name/lora_model",-token-=-"...")-#-online-saving

**Contents:**
  - Fine-tuning Voice models vs. Zero-shot voice cloning

This saves the model weights (for LoRA, it might save only adapter weights if the base is not fully fine-tuned). If you used `--push_model` in CLI or `trainer.push_to_hub()`, you could upload it to Hugging Face Hub directly.

Now you should have a fine-tuned TTS model in the directory. The next step is to test it out and if supported, you can use llama.cpp to convert it into a GGUF file.

### Fine-tuning Voice models vs. Zero-shot voice cloning

People say you can clone a voice with just 30 seconds of audio using models like XTTS - no training required. That’s technically true, but it misses the point.

Zero-shot voice cloning, which is also available in models like Orpheus and CSM, is an approximation. It captures the general **tone and timbre** of a speaker’s voice, but it doesn’t reproduce the full expressive range. You lose details like speaking speed, phrasing, vocal quirks, and the subtleties of prosody - things that give a voice its **personality and uniqueness**.

If you just want a different voice and are fine with the same delivery patterns, zero-shot is usually good enough. But the speech will still follow the **model’s style**, not the speaker’s.

For anything more personalized or expressive, you need training with methods like LoRA to truly capture how someone speaks.

---

## Tokenize the text transcripts

**URL:** llms-txt#tokenize-the-text-transcripts

def preprocess_function(example):
    # Tokenize the text (keep the special tokens like <laugh> intact)
    tokens = tokenizer(example["text"], return_tensors="pt")
    # Flatten to list of token IDs
    input_ids = tokens["input_ids"].squeeze(0)
    # The model will generate audio tokens after these text tokens.
    # For training, we can set labels equal to input_ids (so it learns to predict next token).
    # But that only covers text tokens predicting the next text token (which might be an audio token or end).
    # A more sophisticated approach: append a special token indicating start of audio, and let the model generate the rest.
    # For simplicity, use the same input as labels (the model will learn to output the sequence given itself).
    return {"input_ids": input_ids, "labels": input_ids}

train_data = dataset.map(preprocess_function, remove_columns=dataset.column_names)
python
from transformers import TrainingArguments,Trainer,DataCollatorForSeq2Seq
from unsloth import is_bfloat16_supported

trainer = Trainer(
    model = model,
    train_dataset = dataset,
    args = TrainingArguments(
        per_device_train_batch_size = 1,
        gradient_accumulation_steps = 4,
        warmup_steps = 5,
        # num_train_epochs = 1, # Set this for 1 full training run.
        max_steps = 60,
        learning_rate = 2e-4,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "linear",
        seed = 3407,
        output_dir = "outputs",
        report_to = "none", # Use this for WandB etc
    ),
)
python
model.save_pretrained("lora_model")  # Local saving
tokenizer.save_pretrained("lora_model")

**Examples:**

Example 1 (unknown):
```unknown
{% hint style="info" %}
The above is a simplification. In reality, to fine-tune Orpheus properly, you would need the *audio tokens as part of the training labels*. Orpheus’s pre-training likely involved converting audio to discrete tokens (via an audio codec) and training the model to predict those given the preceding text. For fine-tuning on new voice data, you would similarly need to obtain the audio tokens for each clip (using Orpheus’s audio codec). The Orpheus GitHub provides a script for data processing – it encodes audio into sequences of `<custom_token_x>` tokens.
{% endhint %}

However, **Unsloth may abstract this away**: if the model is a FastModel with an associated processor that knows how to handle audio, it might automatically encode the audio in the dataset to tokens. If not, you’d have to manually encode each audio clip to token IDs (using Orpheus’s codebook). This is an advanced step beyond this guide, but keep in mind that simply using text tokens won’t teach the model the actual audio – it needs to match the audio patterns.

Let's assume Unsloth provides a way to feed audio directly (for example, by setting `processor` and passing the audio array). If Unsloth does not yet support automatic audio tokenization, you might need to use the Orpheus repository’s `encode_audio` function to get token sequences for the audio, then use those as labels. (The dataset entries do have `phonemes` and some acoustic features which suggests a pipeline.)

**Step 3: Set up training arguments and Trainer**
```

Example 2 (unknown):
```unknown
We do 60 steps to speed things up, but you can set `num_train_epochs=1` for a full run, and turn off `max_steps=None`. Using a per\_device\_train\_batch\_size >1 may lead to errors if multi-GPU setup to avoid issues, ensure CUDA\_VISIBLE\_DEVICES is set to a single GPU (e.g., CUDA\_VISIBLE\_DEVICES=0). Adjust as needed.

**Step 4: Begin fine-tuning**

This will start the training loop. You should see logs of loss every 50 steps (as set by `logging_steps`). The training might take some time depending on GPU – for example, on a Colab T4 GPU, a few epochs on 3h of data may take 1-2 hours. Unsloth’s optimizations will make it faster than standard HF training.

**Step 5: Save the fine-tuned model**

After training completes (or if you stop it mid-way when you feel it’s sufficient), save the model. This ONLY saves the LoRA adapters, and not the full model. To save to 16bit or GGUF, scroll down!
```

---

## to save the model at the end of training:

**URL:** llms-txt#to-save-the-model-at-the-end-of-training:

---

## Tutorial: How to Finetune Llama-3 and Use In Ollama

**URL:** llms-txt#tutorial:-how-to-finetune-llama-3-and-use-in-ollama

**Contents:**
- 1. What is Unsloth?
- 2. What is Ollama?
- 3. Install Unsloth
- 4. Selecting a model to finetune
- 5. Parameters for finetuning
- 6. Alpaca Dataset
- 7. Multiple columns for finetuning
- 8. Multi turn conversations
- 9. Customizable Chat Templates
- 10. Train the model

Beginner's Guide for creating a customized personal assistant (like ChatGPT) to run locally on Ollama

By the end of this tutorial, you will create a custom chatbot by **finetuning Llama-3** with [**Unsloth**](https://github.com/unslothai/unsloth) for free. It can run locally via [**Ollama**](https://github.com/ollama/ollama) on your PC, or in a free GPU instance through [**Google Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb). You will be able to interact with the chatbot interactively like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-cf9aed2029e54afbb65889b480134e6d5e1cf3a7%2FAssistant%20example.png?alt=media" alt=""><figcaption></figcaption></figure>

**Unsloth** makes finetuning much easier, and can automatically export the finetuned model to **Ollama** with integrated automatic `Modelfile` creation! If you need help, you can join our Discord server: <https://discord.com/invite/unsloth>

{% hint style="warning" %}
**If you’d like to copy or save the code, everything is available in our** [**Ollama Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb)**. You can use it directly there or adapt it for your local setup:** [**https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3\_(8B)-Ollama.ipynb**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb)
{% endhint %}

## 1. What is Unsloth?

[Unsloth](https://github.com/unslothai/unsloth) makes finetuning LLMs like Llama-3, Mistral, Phi-3 and Gemma 2x faster, use 70% less memory, and with no degradation in accuracy! We will be using Google Colab which provides a free GPU during this tutorial. You can access our free notebooks below:

* [Ollama Llama-3 Alpaca](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb) (notebook which we will be using)
* [CSV/Excel Ollama Guide](https://colab.research.google.com/drive/1VYkncZMfGFkeCEgN2IzbZIKEDkyQuJAS?usp=sharing)

#### ***You will also need to login into your Google account!***

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-bca149bda83c2192982b136cfeb096999c469a2e%2FColab%20Screen.png?alt=media" alt=""><figcaption></figcaption></figure>

## 2. What is Ollama?

[Ollama ](https://github.com/ollama/ollama)allows you to run language models from your own computer in a quick and simple way! It quietly launches a program which can run a language model like Llama-3 in the background. If you suddenly want to ask the language model a question, you can simply submit a request to Ollama, and it'll quickly return the results to you! We'll be using Ollama as our inference engine!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-fd25844766001d93ed0949fc8f57957f49b1e6e5%2FOllama.png?alt=media" alt=""><figcaption></figcaption></figure>

## 3. Install Unsloth

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4d1b1778f3c8bde62a40130d7b4395b8bb1ce90f%2FColab%20Options.png?alt=media" alt=""><figcaption></figcaption></figure>

If you have never used a Colab notebook, a quick primer on the notebook itself:

1. **Play Button at each "cell".** Click on this to run that cell's code. You must not skip any cells and you must run every cell in chronological order. If you encounter any errors, simply rerun the cell you did not run before. Another option is to click CTRL + ENTER if you don't want to click the play button.
2. **Runtime Button in the top toolbar.** You can also use this button and hit "Run all" to run the entire notebook in 1 go. This will skip all the customization steps, and can be a good first try.
3. **Connect / Reconnect T4 button.** You can click here for more advanced system statistics.

The first installation cell looks like below: Remember to click the PLAY button in the brackets \[ ]. We grab our open source Github package, and install some other packages.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3ae88d2cf9ba1c59b13d701864750ac311a60426%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 4. Selecting a model to finetune

Let's now select a model for finetuning! We defaulted to Llama-3 from Meta / Facebook which was trained on a whopping 15 trillion "tokens". Assume a token is like 1 English word. That's approximately 350,000 thick Encyclopedias worth! Other popular models include Mistral, Phi-3 (trained using GPT-4 output) and Gemma from Google (13 trillion tokens!).

Unsloth supports these models and more! In fact, simply type a model from the Hugging Face model hub to see if it works! We'll error out if it doesn't work.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4fb10a1ce3e457310c11f74ca5b6347ad556fab0%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

There are 3 other settings which you can toggle:

This determines the context length of the model. Gemini for example has over 1 million context length, whilst Llama-3 has 8192 context length. We allow you to select ANY number - but we recommend setting it 2048 for testing purposes. Unsloth also supports very long context finetuning, and we show we can provide 4x longer context lengths than the best.
2.

Keep this as None, but you can select torch.float16 or torch.bfloat16 for newer GPUs.
3.

We do finetuning in 4 bit quantization. This reduces memory usage by 4x, allowing us to actually do finetuning in a free 16GB memory GPU. 4 bit quantization essentially converts weights into a limited set of numbers to reduce memory usage. A drawback of this is there is a 1-2% accuracy degradation. Set this to False on larger GPUs like H100s if you want that tiny extra accuracy.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a44ac84348a2c5973dd542866c4c6727a00b3744%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

If you run the cell, you will get some print outs of the Unsloth version, which model you are using, how much memory your GPU has, and some other statistics. Ignore this for now.

## 5. Parameters for finetuning

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-495edc79c5353f0f47c1eea58df045631bfef1e0%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Now to customize your finetune, you can edit the numbers above, but you can ignore it, since we already select quite reasonable numbers.

The goal is to change these numbers to increase accuracy, but also **counteract over-fitting**. Over-fitting is when you make the language model memorize a dataset, and not be able to answer novel new questions. We want to a final model to answer unseen questions, and not do memorization.

The rank of the finetuning process. A larger number uses more memory and will be slower, but can increase accuracy on harder tasks. We normally suggest numbers like 8 (for fast finetunes), and up to 128. Too large numbers can causing over-fitting, damaging your model's quality.
2.

We select all modules to finetune. You can remove some to reduce memory usage and make training faster, but we highly do not suggest this. Just train on all modules!
3.

The scaling factor for finetuning. A larger number will make the finetune learn more about your dataset, but can promote over-fitting. We suggest this to equal to the rank `r`, or double it.
4.

Leave this as 0 for faster training! Can reduce over-fitting, but not that much.
5.

Leave this as 0 for faster and less over-fit training!
6.

Options include `True`, `False` and `"unsloth"`. We suggest `"unsloth"` since we reduce memory usage by an extra 30% and support extremely long context finetunes.You can read up here: <https://unsloth.ai/blog/long-context> for more details.
7.

The number to determine deterministic runs. Training and finetuning needs random numbers, so setting this number makes experiments reproducible.
8.

Advanced feature to set the `lora_alpha = 16` automatically. You can use this if you want!
9.

Advanced feature to initialize the LoRA matrices to the top r singular vectors of the weights. Can improve accuracy somewhat, but can make memory usage explode at the start.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1d66d8714e44d90513dd87b9356eec67886ab3f7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

We will now use the Alpaca Dataset created by calling GPT-4 itself. It is a list of 52,000 instructions and outputs which was very popular when Llama-1 was released, since it made finetuning a base LLM be competitive with ChatGPT itself.

You can access the GPT4 version of the Alpaca dataset here: <https://huggingface.co/datasets/vicgalle/alpaca-gpt4>. An older first version of the dataset is here: <https://github.com/tatsu-lab/stanford_alpaca>. Below shows some examples of the dataset:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0dde50e386e7b245d3e8a57e10a4a81755b3769a%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

You can see there are 3 columns in each row - an instruction, and input and an output. We essentially combine each row into 1 large prompt like below. We then use this to finetune the language model, and this made it very similar to ChatGPT. We call this process **supervised instruction finetuning**.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8b3663c5d80adcb935ff77661500f08e13c9af2d%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 7. Multiple columns for finetuning

But a big issue is for ChatGPT style assistants, we only allow 1 instruction / 1 prompt, and not multiple columns / inputs. For example in ChatGPT, you can see we must submit 1 prompt, and not multiple prompts.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d90162c2685ced871f4151369aadcaee40a9c54f%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

This essentially means we have to "merge" multiple columns into 1 large prompt for finetuning to actually function!

For example the very famous Titanic dataset has many many columns. Your job was to predict whether a passenger has survived or died based on their age, passenger class, fare price etc. We can't simply pass this into ChatGPT, but rather, we have to "merge" this information into 1 large prompt.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a2df04874bfc879182cb66c789341d49700227ea%2FMerge.png?alt=media" alt=""><figcaption></figcaption></figure>

For example, if we ask ChatGPT with our "merged" single prompt which includes all the information for that passenger, we can then ask it to guess or predict whether the passenger has died or survived.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b3da2b36afe37469cd3962f37186e758871864a5%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Other finetuning libraries require you to manually prepare your dataset for finetuning, by merging all your columns into 1 prompt. In Unsloth, we simply provide the function called `to_sharegpt` which does this in 1 go!

To access the Titanic finetuning notebook or if you want to upload a CSV or Excel file, go here: <https://colab.research.google.com/drive/1VYkncZMfGFkeCEgN2IzbZIKEDkyQuJAS?usp=sharing>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-62b94dc44f2e343020d31de575f52eb22be4b0fc%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Now this is a bit more complicated, since we allow a lot of customization, but there are a few points:

* You must enclose all columns in curly braces `{}`. These are the column names in the actual CSV / Excel file.
* Optional text components must be enclosed in `[[]]`. For example if the column "input" is empty, the merging function will not show the text and skip this. This is useful for datasets with missing values.
* Select the output or target / prediction column in `output_column_name`. For the Alpaca dataset, this will be `output`.

For example in the Titanic dataset, we can create a large merged prompt format like below, where each column / piece of text becomes optional.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e6228cf6e5c0bb4e4b45e6f3e045910d567c33d2%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

For example, pretend the dataset looks like this with a lot of missing data:

| Embarked | Age | Fare |
| -------- | --- | ---- |
| S        | 23  |      |
|          | 18  | 7.25 |

Then, we do not want the result to be:

1. The passenger embarked from S. Their age is 23. Their fare is **EMPTY**.
2. The passenger embarked from **EMPTY**. Their age is 18. Their fare is $7.25.

Instead by optionally enclosing columns using `[[]]`, we can exclude this information entirely.

1. \[\[The passenger embarked from S.]] \[\[Their age is 23.]] \[\[Their fare is **EMPTY**.]]
2. \[\[The passenger embarked from **EMPTY**.]] \[\[Their age is 18.]] \[\[Their fare is $7.25.]]

1. The passenger embarked from S. Their age is 23.
2. Their age is 18. Their fare is $7.25.

## 8. Multi turn conversations

A bit issue if you didn't notice is the Alpaca dataset is single turn, whilst remember using ChatGPT was interactive and you can talk to it in multiple turns. For example, the left is what we want, but the right which is the Alpaca dataset only provides singular conversations. We want the finetuned language model to somehow learn how to do multi turn conversations just like ChatGPT.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2a65cd74ddd03a6bcbbc9827d9d034e4879a8e6a%2Fdiff.png?alt=media" alt=""><figcaption></figcaption></figure>

So we introduced the `conversation_extension` parameter, which essentially selects some random rows in your single turn dataset, and merges them into 1 conversation! For example, if you set it to 3, we randomly select 3 rows and merge them into 1! Setting them too long can make training slower, but could make your chatbot and final finetune much better!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2b1b3494b260f1102942d86143a885225c6a06f2%2Fcombine.png?alt=media" alt=""><figcaption></figcaption></figure>

Then set `output_column_name` to the prediction / output column. For the Alpaca dataset dataset, it would be the output column.

We then use the `standardize_sharegpt` function to just make the dataset in a correct format for finetuning! Always call this!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7bf83bf802191bda9e417bbe45afa181e7f24f38%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 9. Customizable Chat Templates

We can now specify the chat template for finetuning itself. The very famous Alpaca format is below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-59737e6dcb09fed15487d5a57c69f07cb40bb8e7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

But remember we said this was a bad idea because ChatGPT style finetunes require only 1 prompt? Since we successfully merged all dataset columns into 1 using Unsloth, we essentially can create the below style chat template with 1 input column (instruction) and 1 output:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d54582ae98c396d51bfb85628b46c54f2517d030%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

We just require you must put a `{INPUT}` field for the instruction and an `{OUTPUT}` field for the model's output field. We in fact allow an optional `{SYSTEM}` field as well which is useful to customize a system prompt just like in ChatGPT. For example, below are some cool examples which you can customize the chat template to be:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-cc455dc380d3d44ef136e485754964159dc773d8%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

For the ChatML format used in OpenAI models:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-15bfca9cfadf10d54b4d3f66e3050044317d62c5%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Or you can use the Llama-3 template itself (which only functions by using the instruct version of Llama-3): We in fact allow an optional `{SYSTEM}` field as well which is useful to customize a system prompt just like in ChatGPT.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-80a2ed4de2ca323ac192c513cac65e9e8bf475db%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Or in the Titanic prediction task where you had to predict if a passenger died or survived in this Colab notebook which includes CSV and Excel uploading: <https://colab.research.google.com/drive/1VYkncZMfGFkeCEgN2IzbZIKEDkyQuJAS?usp=sharing>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-20911ab305c1a10e85859c703157b80175141eb1%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 10. Train the model

Let's train the model now! We normally suggest people to not edit the below, unless if you want to finetune for longer steps or want to train on large batch sizes.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f55503cea4d84b5885d0bcea0563fd716a0d2ed6%2Fimage%20(43).png?alt=media" alt=""><figcaption></figcaption></figure>

We do not normally suggest changing the parameters above, but to elaborate on some of them:

Increase the batch size if you want to utilize the memory of your GPU more. Also increase this to make training more smooth and make the process not over-fit. We normally do not suggest this, since this might make training actually slower due to padding issues. We normally instead ask you to increase `gradient_accumulation_steps` which just does more passes over the dataset.
2.

Equivalent to increasing the batch size above itself, but does not impact memory consumption! We normally suggest people increasing this if you want smoother training loss curves.
3.

We set steps to 60 for faster training. For full training runs which can take hours, instead comment out `max_steps`, and replace it with `num_train_epochs = 1`. Setting it to 1 means 1 full pass over your dataset. We normally suggest 1 to 3 passes, and no more, otherwise you will over-fit your finetune.
4.

Reduce the learning rate if you want to make the finetuning process slower, but also converge to a higher accuracy result most likely. We normally suggest 2e-4, 1e-4, 5e-5, 2e-5 as numbers to try.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-feb9b0f5763d41cecaec9a3a9cd227ad918f0ca7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

You’ll see a log of numbers during training. This is the training loss, which shows how well the model is learning from your dataset. For many cases, a loss around 0.5 to 1.0 is a good sign, but it depends on your dataset and task. If the loss is not going down, you might need to adjust your settings. If the loss goes to 0, that could mean overfitting, so it's important to check validation too.

## 11. Inference / running the model

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f2d5f23fa62ec89e06bf20fea433f9a1e42a2fe3%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Now let's run the model after we completed the training process! You can edit the yellow underlined part! In fact, because we created a multi turn chatbot, we can now also call the model as if it saw some conversations in the past like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-cdf5d779635901dce7793df92531dbf3caf0fb0a%2Fimage%20(47).png?alt=media" alt=""><figcaption></figcaption></figure>

Reminder Unsloth itself provides **2x faster inference** natively as well, so always do not forget to call `FastLanguageModel.for_inference(model)`. If you want the model to output longer responses, set `max_new_tokens = 128` to some larger number like 256 or 1024. Notice you will have to wait longer for the result as well!

## 12. Saving the model

We can now save the finetuned model as a small 100MB file called a LoRA adapter like below. You can instead push to the Hugging Face hub as well if you want to upload your model! Remember to get a Hugging Face token via <https://huggingface.co/settings/tokens> and add your token!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8c577103f7c4fe883cabaf35c8437307c6501686%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

After saving the model, we can again use Unsloth to run the model itself! Use `FastLanguageModel` again to call it for inference!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1a1be852ca551240bdce47cf99e6ccd7d31c1326%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 13. Exporting to Ollama

Finally we can export our finetuned model to Ollama itself! First we have to install Ollama in the Colab notebook:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-24f9429ed4a8b3a630dc8f68dcf81555da0a80ee%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Then we export the finetuned model we have to llama.cpp's GGUF formats like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-56991ea7e2685bb9905af9baf2f3f685123dcdd8%2Fimage%20(52).png?alt=media" alt=""><figcaption></figcaption></figure>

Reminder to convert `False` to `True` for 1 row, and not change every row to `True`, or else you'll be waiting for a very time! We normally suggest the first row getting set to `True`, so we can export the finetuned model quickly to `Q8_0` format (8 bit quantization). We also allow you to export to a whole list of quantization methods as well, with a popular one being `q4_k_m`.

Head over to <https://github.com/ggerganov/llama.cpp> to learn more about GGUF. We also have some manual instructions of how to export to GGUF if you want here: <https://github.com/unslothai/unsloth/wiki#manually-saving-to-gguf>

You will see a long list of text like below - please wait 5 to 10 minutes!!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-271b392fdafd0e7d01c525d7a11a97ee5c34b713%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

And finally at the very end, it'll look like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a554bd388fd0394dd8cdef85fd9d208bfd7feee7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Then, we have to run Ollama itself in the background. We use `subprocess` because Colab doesn't like asynchronous calls, but normally one just runs `ollama serve` in the terminal / command prompt.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e431609dfc5c742f0b5ab2388dbbd0d8e15c7670%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 14. Automatic `Modelfile` creation

The trick Unsloth provides is we automatically create a `Modelfile` which Ollama requires! This is a just a list of settings and includes the chat template which we used for the finetune process! You can also print the `Modelfile` generated like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-6945ba10a2e25cfc198848c0e863001375c32c4c%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

We then ask Ollama to create a model which is Ollama compatible, by using the `Modelfile`

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d431a64613b39d913d1780c22cde37edc6564272%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## 15. Ollama Inference

And we can now call the model for inference if you want to do call the Ollama server itself which is running on your own local machine / in the free Colab notebook in the background. Remember you can edit the yellow underlined part.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-49b93efa192fdd741f3ac8484cef8c3fd7415283%2FInference.png?alt=media" alt=""><figcaption></figcaption></figure>

## 16. Interactive ChatGPT style

But to actually run the finetuned model like a ChatGPT, we have to do a bit more! First click the terminal icon![](https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-9c24108bc5152f946a7afab054974890318d2c02%2Fimage.png?alt=media) and a Terminal will pop up. It's on the left sidebar.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2239315eff2820bf9f224975f0b184d51bd89cb7%2FWhere_Terminal.png?alt=media" alt=""><figcaption></figcaption></figure>

Then, you might have to press ENTER twice to remove some weird output in the Terminal window. Wait a few seconds and type `ollama run unsloth_model` then hit ENTER.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e83ac484e4257eacad1c7d033811d2ece59a444c%2FTerminal_Type.png?alt=media" alt=""><figcaption></figcaption></figure>

And finally, you can interact with the finetuned model just like an actual ChatGPT! Hit CTRL + D to exit the system, and hit ENTER to converse with the chatbot!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-120703475091e1ce74a38a05949ae51af0a36f72%2FAssistant.png?alt=media" alt=""><figcaption></figcaption></figure>

You've successfully finetuned a language model and exported it to Ollama with Unsloth 2x faster and with 70% less VRAM! And all this for free in a Google Colab notebook!

If you want to learn how to do reward modelling, do continued pretraining, export to vLLM or GGUF, do text completion, or learn more about finetuning tips and tricks, head over to our [Github](https://github.com/unslothai/unsloth#-finetune-for-free).

If you need any help on finetuning, you can also join our Discord server [here](https://discord.gg/unsloth). If you want help with Ollama, you can also join their server [here](https://discord.gg/ollama).

And finally, we want to thank you for reading and following this far! We hope this made you understand some of the nuts and bolts behind finetuning language models, and we hope this was useful!

To access our Alpaca dataset example click [here](https://colab.research.google.com/drive/1WZDi7APtQ9VsvOrQSSC5DDtxq159j8iZ?usp=sharing), and our CSV / Excel finetuning guide is [here](https://colab.research.google.com/drive/1VYkncZMfGFkeCEgN2IzbZIKEDkyQuJAS?usp=sharing).

**Examples:**

Example 1 (unknown):
```unknown
max_seq_length = 2048
```

Example 2 (unknown):
```unknown
dtype = None
```

Example 3 (unknown):
```unknown
load_in_4bit = True
```

Example 4 (unknown):
```unknown
r = 16, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
```

---

## Tutorial: How to Fine-tune gpt-oss

**URL:** llms-txt#tutorial:-how-to-fine-tune-gpt-oss

**Contents:**
- 🌐 Colab gpt-oss Fine-tuning
- 🖥️ Local gpt-oss Fine-tuning

Learn step-by-step how to train OpenAI gpt-oss locally with Unsloth.

In this guide with screenshots, you'll learn to fine-tune your own custom gpt-oss model either [locally](#local-gpt-oss-fine-tuning) on your machine or for free using [Google Colab](#colab-gpt-oss-fine-tuning). We'll walk you through the entire process, from setup to running and saving your trained model.

{% hint style="success" %}
[**Aug 28 update**](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support)**:** You can now export/save your QLoRA fine-tuned gpt-oss model to llama.cpp, vLLM, HF etc.

We also introduced [Unsloth Flex Attention](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support) which enables **>8× longer context lengths**, **>50% less VRAM usage** and **>1.5× faster training** vs. all implementations. [Read more here](https://docs.unsloth.ai/models/long-context-gpt-oss-training#introducing-unsloth-flex-attention-support)
{% endhint %}

> **Quickstart:** Fine-tune gpt-oss-20b for free with our: [Colab notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-Fine-tuning.ipynb)

Unsloth gpt-oss fine-tuning, when compared to all other FA2 implementations, achieves 1.5× faster training, 70% reduction in VRAM use, and 10x longer context lengths - with no accuracy loss.

* **QLoRA requirements:** gpt-oss-20b = 14GB VRAM • gpt-oss-120b = 65GB VRAM.
* **BF16 LoRA requirements:** gpt-oss-20b = 44GB VRAM • gpt-oss-120b = 210GB VRAM.

<a href="#local-gpt-oss-fine-tuning" class="button secondary">Local Guide</a><a href="#colab-gpt-oss-fine-tuning" class="button secondary">Colab Guide</a>

## 🌐 Colab gpt-oss Fine-tuning

This section covers fine-tuning gpt-oss using our Google Colab [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks). You can also save and use the gpt-oss notebook into your favorite code editor and follow our [local gpt-oss guide](#local-gpt-oss-fine-tuning).

{% stepper %}
{% step %}

#### Install Unsloth (in Colab)

In Colab, run cells **from top to bottom**. Use **Run all** for the first pass. The first cell installs Unsloth (and related dependencies) and prints GPU/memory info. If a cell throws an error, simply re-run it.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b5e2d89ed2815aa5dd6be7e4d2424df454c46ca0%2Fchrome_wTbzfmSI21.png?alt=media" alt=""><figcaption></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-bbea9a8316e670247b6e69ff62d45a0dea189f35%2Fchrome_yPnb553OGW.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Configuring gpt-oss and Reasoning Effort

We’ll load **`gpt-oss-20b`** using Unsloth's [linearized version](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/..#making-efficient-gpt-oss-fine-tuning-work) (as no other version will work).

Configure the following parameters:

* `max_seq_length = 1024`
  * Recommended for quick testing and initial experiments.
* `load_in_4bit = True`
  * Use `False` for LoRA training (note: setting this to `False` will need at least 43GB VRAM). You ***MUST*** also set **`model_name = "unsloth/gpt-oss-20b-BF16"`**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-eff24652551c00dccb790fda29fc3d580823cb31%2Fchrome_3qSe2UIFN0.png?alt=media" alt=""><figcaption></figcaption></figure>

You should see output similar to the example below. Note: We explicitly change the `dtype` to `float32` to ensure correct training behavior.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-6bd982cfb20d01502802a926938b9a62abd9b1e7%2Fchrome_DGMDHldw0J.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Fine-tuning Hyperparameters (LoRA)

Now it's time to adjust your training hyperparameters. For a deeper dive into how, when, and what to tune, check out our [detailed hyperparameters guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide).

{% hint style="info" %}
To avoid [overfitting](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide#avoiding-overfitting-and-underfitting), monitor your training loss and avoid setting these values too high.
{% endhint %}

This step adds LoRA adapters for parameter-efficient fine-tuning. Only about 1% of the model’s parameters are trained, which makes the process significantly more efficient.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-83a37bf7602d892fe7b8350e5025b1d5a1ad75b6%2Fchrome_ucj0VKT1lh.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

In the notebook, there's a section called *"Reasoning Effort"* that demonstrates gpt-oss inference running in Colab. You can skip this step, but you'll still need to run the model later once you've finished fine-tuning it.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-395308c7013021932a20a4eef85e2b17f8b6b029%2Fchrome_o2rLNfES8e.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Data Preparation

For this example, we will use the [`HuggingFaceH4/Multilingual-Thinking`](https://huggingface.co/datasets/HuggingFaceH4/Multilingual-Thinking). This dataset contains chain-of-thought reasoning examples derived from user questions translated from English into four additional languages.

This is the same dataset referenced in OpenAI's fine-tuning cookbook.

The goal of using a multilingual dataset is to help the model learn and generalize reasoning patterns across multiple languages.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a63d7b6555b7ffdccb506ed44a34deb0370e7a90%2Fchrome_rRKmU99f0T.png?alt=media" alt=""><figcaption></figcaption></figure>

gpt-oss introduces a reasoning effort system that controls how much reasoning the model performs. By default, the reasoning effort is set to `low`, but you can change it by setting the `reasoning_effort` parameter to `low`, `medium` or `high`.

To format the dataset, we apply a customized version of the gpt-oss prompt:

Let's inspect the dataset by printing the first example:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-999632c15fd6bc73e3f7c1a11b74c8cedf563478%2Fchrome_sjbDtIhP5e.png?alt=media" alt=""><figcaption></figcaption></figure>

One unique feature of gpt-oss is its use of the [**OpenAI Harmony format**](https://github.com/openai/harmony)**,** which supports structured conversations, reasoning output, and tool calling. This format includes tags such as `<|start|>` , `<|message|>` , and `<|return|>` .

{% hint style="info" %}
🦥 Unsloth fixes the chat template to ensure it is correct. See this [tweet](https://x.com/danielhanchen/status/1953901104150065544) for technical details on our template fix.
{% endhint %}

Feel free to adapt the prompt and structure to suit your own dataset or use-case. For more guidance, refer to our [dataset guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/datasets-guide).
{% endstep %}

We've pre-selected training hyperparameters for optimal results. However, you can modify them based on your specific use case. Refer to our [hyperparameters guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide).

In this example, we train for 60 steps to speed up the process. For a full training run, set `num_train_epochs=1` and disable the step limiting by setting `max_steps=None`.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-942bbba058a27b056cab8a21bed15d988e39fafc%2Fchrome_R85PmZRHMQ.png?alt=media" alt=""><figcaption></figcaption></figure>

During training, monitor the loss to ensure that it is decreasing over time. This confirms that the training process is functioning correctly.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5ace71760531cf39f14499baf9ca0f78d8018756%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Inference: Run your trained model

Now it's time to run inference with your fine-tuned model. You can modify the instruction and input, but leave the output blank.

In this example, we test the model's ability to reason in French by adding a specific instruction to the system prompt, following the same structure used in our dataset.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-85e0e0aac7ae30bf7108470795fbabf815176abe%2Fchrome_jbJmBTaY7B.png?alt=media" alt=""><figcaption></figcaption></figure>

This should produce an output similar to:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0cb10ed022a5b451fe0bf4a4b9b35bef94364a5b%2Fchrome_ORco4bpZZ6.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Save/export your model

To save your fine-tuned model, you can export your fine-tuned model both in **bf16 format ,** with our **on-demand dequantization of MXFP4** base models using `save_method="merged_16bit"`or in native **MXFP4** Safetensors format using `save_method="mxfp4"` .

The **MXFP4** native merge format offers significant performance improvements compared to the **bf16 format**: it uses up to 75% less disk space, reduces VRAM consumption by 50%, accelerates merging by 5-10x, and enables much faster conversion to **GGUF** format.

{% hint style="success" %}
New: Saving or merging QLoRA fine-tuned models to GGUF is now supported for use in other frameworks (e.g. Hugging Face, llama.cpp with GGUF).
{% endhint %}

After fine-tuning your gpt-oss model, you can merge it into **MXFP4** format with:

If you prefer to merge the model and push to the hugging-face hub directly:

#### :sparkles: Saving to Llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Convert the **MXFP4** merged model:

3. Run inference on the quantized model:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4379581da4820a0b717e8ae2456814c6c90c344b%2Fchrome_fKEKXHti5r.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

## 🖥️ Local gpt-oss Fine-tuning

This chapter covers fine-tuning gpt-oss on your local device. While **gpt-oss-20b** fine-tuning can operate on just 14GB VRAM, we recommend having at least 16GB VRAM available to ensure stable and reliable training runs.

{% hint style="info" %}
We recommend downloading or incorporating elements from our Colab [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks) into your local setup for easier use.
{% endhint %}

{% stepper %}
{% step %}

#### Install Unsloth Locally

Ensure your device is [Unsloth compatible](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/unsloth-requirements) and you can read our detailed [installation guide](https://docs.unsloth.ai/get-started/install-and-update).

Note that `pip install unsloth` will not work for this setup, as we need to use the latest PyTorch, Triton and related packages. Install Unsloth using this specific command:

**Examples:**

Example 1 (python):
```python
tokenizer.apply_chat_template(
    text, 
    tokenize = False, 
    add_generation_prompt = False,
    reasoning_effort = "medium",
)
```

Example 2 (python):
```python
from unsloth.chat_templates import standardize_sharegpt
dataset = standardize_sharegpt(dataset)
dataset = dataset.map(formatting_prompts_func, batched = True,)
```

Example 3 (unknown):
```unknown
<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-999632c15fd6bc73e3f7c1a11b74c8cedf563478%2Fchrome_sjbDtIhP5e.png?alt=media" alt=""><figcaption></figcaption></figure>

One unique feature of gpt-oss is its use of the [**OpenAI Harmony format**](https://github.com/openai/harmony)**,** which supports structured conversations, reasoning output, and tool calling. This format includes tags such as `<|start|>` , `<|message|>` , and `<|return|>` .

{% hint style="info" %}
🦥 Unsloth fixes the chat template to ensure it is correct. See this [tweet](https://x.com/danielhanchen/status/1953901104150065544) for technical details on our template fix.
{% endhint %}

Feel free to adapt the prompt and structure to suit your own dataset or use-case. For more guidance, refer to our [dataset guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/datasets-guide).
{% endstep %}

{% step %}

#### Train the model

We've pre-selected training hyperparameters for optimal results. However, you can modify them based on your specific use case. Refer to our [hyperparameters guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide).

In this example, we train for 60 steps to speed up the process. For a full training run, set `num_train_epochs=1` and disable the step limiting by setting `max_steps=None`.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-942bbba058a27b056cab8a21bed15d988e39fafc%2Fchrome_R85PmZRHMQ.png?alt=media" alt=""><figcaption></figcaption></figure>

During training, monitor the loss to ensure that it is decreasing over time. This confirms that the training process is functioning correctly.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5ace71760531cf39f14499baf9ca0f78d8018756%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}

#### Inference: Run your trained model

Now it's time to run inference with your fine-tuned model. You can modify the instruction and input, but leave the output blank.

In this example, we test the model's ability to reason in French by adding a specific instruction to the system prompt, following the same structure used in our dataset.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-85e0e0aac7ae30bf7108470795fbabf815176abe%2Fchrome_jbJmBTaY7B.png?alt=media" alt=""><figcaption></figcaption></figure>

This should produce an output similar to:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0cb10ed022a5b451fe0bf4a4b9b35bef94364a5b%2Fchrome_ORco4bpZZ6.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}

#### Save/export your model

To save your fine-tuned model, you can export your fine-tuned model both in **bf16 format ,** with our **on-demand dequantization of MXFP4** base models using `save_method="merged_16bit"`or in native **MXFP4** Safetensors format using `save_method="mxfp4"` .

The **MXFP4** native merge format offers significant performance improvements compared to the **bf16 format**: it uses up to 75% less disk space, reduces VRAM consumption by 50%, accelerates merging by 5-10x, and enables much faster conversion to **GGUF** format.

{% hint style="success" %}
New: Saving or merging QLoRA fine-tuned models to GGUF is now supported for use in other frameworks (e.g. Hugging Face, llama.cpp with GGUF).
{% endhint %}

After fine-tuning your gpt-oss model, you can merge it into **MXFP4** format with:
```

Example 4 (unknown):
```unknown
If you prefer to merge the model and push to the hugging-face hub directly:
```

---

## Tutorial: How to Train gpt-oss with RL

**URL:** llms-txt#tutorial:-how-to-train-gpt-oss-with-rl

Learn to train OpenAI gpt-oss with GRPO to autonomously beat 2048 locally or on Colab.

LLMs often struggle with tasks that involve complex environments. However, by applying [reinforcement learning](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) (RL) and designing a custom [reward function](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide#reward-functions-verifiers), these challenges can be overcome.

RL can be adapted for tasks such as auto kernel or strategy creation. This tutorial shows how to train **gpt-oss** with [**GRPO**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide#from-rlhf-ppo-to-grpo-and-rlvr) and Unsloth to autonomously beat 2048.

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
**Hardware:** The 2048 example runs on a free Colab T4, but training will be slow. A100/H100 is much faster. 4‑bit loading + LoRA lets you fit a 20B model into modest VRAM.
{% endhint %}

{% stepper %}
{% step %}

Run this cell at the top of a notebook (works on Colab).

#### Load gpt-oss with Unsloth

Load the 20B model in 4‑bit QLoRA for memory efficiency, then wrap it with a LoRA adapter. You can also train it in 16-bit LoRA but it will use 4x more memory. For more settings view our [configuration guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide#id-2.-choose-the-right-model--method).

{% hint style="info" %}
If you hit OOM, try lowering `max_seq_length`, `lora_rank`, or `num_generations` (later), and keep `load_in_4bit=True`.
{% endhint %}
{% endstep %}

#### 2048 game environment (minimal)

* A `GameBoard` class supporting **W/A/S/D** moves
* Merge/score logic
* `execute_with_time_limit` wrapper so poorly written strategies can’t hang the kernel

You can quickly smoke‑test with a trivial policy:

#### Safe code execution & anti‑cheat checks

Generated strategies are **Python functions**. To keep execution safe and prevent reward hacking:

* **Module whitelist check** — only allow Python stdlib symbols:

* **Block disallowed imports** (e.g., NumPy):

* **Lock down execution** to a sandboxed function:

* **Enforce a hard wall‑clock limit** on strategy runs:

{% step %}
\### Prompt & dataset

We prompt the model to **emit a short strategy function** inside triple backticks:

python
def strategy(board):
    return "W"  # Example
`

Create a tiny synthetic dataset (reusing the same prompt) and compute the prompt length so GRPO knows how many completion tokens to sample:

{% hint style="info" %} You can replace this dataset with real prompts for your own RL task. {% endhint %} {% endstep %}

#### Reward function time!

1. **Extract the code block** from the model’s reply:

") >= 2:
           first = text.find("", first)
           fx = text[first:second].strip()
           fx = fx.removeprefix("python\n")
           fx = fx[fx.find("def"):]
           if fx.startswith("def strategy(board):"):
               return fx
       return None
   python
   from unsloth import create_locked_down_function, check_python_modules

def function_works(completions, **kwargs):
       scores = []
       for completion in completions:
           response = completion[0]["content"]
           function = extract_function(response)
           if function is None:
               scores.append(-2.0)
               continue
           ok, info = check_python_modules(function)
           if "error" in info:
               scores.append(-2.0)
               continue
           try:
               _ = create_locked_down_function(function)
               scores.append(1.0)
           except Exception:
               scores.append(-0.5)
       return scores
   python
   def no_cheating(completions, **kwargs):
       scores = []
       for completion in completions:
           response = completion[0]["content"]
           function = extract_function(response)
           if function is None:
               scores.append(-1.0)
               continue
           ok, _ = check_python_modules(function)
           scores.append(1.0 if ok else -20.0)  # heavy penalty if cheating
       return scores
   python
   import numpy as np

PRINTER = 0  # occasionally print for debugging

def strategy_succeeds(completions, **kwargs):
       global PRINTER
       scores = []
       seed = np.random.randint(10000)
       for completion in completions:
           response = completion[0]["content"]
           function = extract_function(response)
           if function is None:
               scores.append(-2.0)
               continue
           try:
               new_strategy = create_locked_down_function(function)
           except Exception:
               scores.append(0.0)
               continue
           try:
               game = GameBoard(size=6, seed=seed, target=2048, probability_fours=0.10)
               steps, state = execute_strategy(new_strategy, game)
               if PRINTER % 5 == 0:
                   print(function)
                   print(f"Steps={steps} State={state}")
                   print(game.board().pretty())
               PRINTER += 1
               if state == "success":
                   scores.append(20.0)
               else:
                   scores.append(2.0)   # worked but didn’t reach 2048
           except TimeoutError:
               scores.append(-1.0)      # timed out
           except Exception:
               scores.append(-3.0)      # crashed
       return scores
   python
from trl import GRPOConfig, GRPOTrainer

max_prompt_length     = maximum_length + 1
max_completion_length = max_seq_length - max_prompt_length

training_args = GRPOConfig(
    temperature=1.0,
    learning_rate=5e-5,
    weight_decay=0.01,
    warmup_ratio=0.1,
    lr_scheduler_type="linear",
    optim="adamw_8bit",
    logging_steps=1,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=1,    # bump to 4 for smoother reward signals
    num_generations=2,                # lower if you OOM
    max_prompt_length=max_prompt_length,
    max_completion_length=max_completion_length,
    max_steps=1000,                   # or set num_train_epochs=1
    save_steps=100,
    report_to="none",
    output_dir="outputs",
)

trainer = GRPOTrainer(
    model=model,
    processing_class=tokenizer,
    reward_funcs=[function_works, no_cheating, strategy_succeeds],
    args=training_args,
    train_dataset=dataset,
    # Optional eval split:
    # train_dataset=new_dataset["train"],
    # eval_dataset=new_dataset["test"],
)
python
trainer.train()
python
from transformers import TextStreamer

text = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    tokenize=False,
    add_generation_prompt=True,
    reasoning_effort="low",
)

_ = model.generate(
    **tokenizer(text, return_tensors="pt").to("cuda"),
    temperature=1.0,
    max_new_tokens=1024,
    streamer=TextStreamer(tokenizer, skip_prompt=False)

python
  model.save_pretrained_merged("finetuned_model", tokenizer, save_method="merged_16bit")
  # or push
  model.push_to_hub_merged("<org_or_user>/<repo>", tokenizer, token="<hf_token>", save_method="merged_16bit")
  ```

#### Troubleshooting & tips

* **OOM / slow**: reduce `max_seq_length`, `num_generations`, `lora_rank`; keep 4‑bit; try A100 if available.
* **No reward improvement**: increase training steps, soften penalties, or add curriculum (start with smaller boards / lower targets).
* **Reward hacking**: keep `check_python_modules` strict; validate strategy behavior across multiple random seeds.
* **Unstable training**: raise `gradient_accumulation_steps` to smooth updates; lower `learning_rate` (e.g., 2e‑5).
* **Long hangs**: ensure `execute_with_time_limit` wraps any strategy execution.
  {% endstep %}

#### Adapt to your own RL task

* Replace the 2048 env with your own environment and **three rewards**: (a) syntax/compilation, (b) anti‑cheat/safety, (c) task success.
* Update the **prompt** to request the kind of function or output you need.
* Keep the same Unsloth + GRPO scaffolding; only swap the env and rewards.
  {% endstep %}
  {% endstepper %}

**Examples:**

Example 1 (bash):
```bash
!pip install --upgrade -qqq uv
try: import numpy; get_numpy = f"numpy=={numpy.__version__}"
except: get_numpy = "numpy"
!uv pip install -qqq \
    "torch>=2.8.0" "triton>=3.4.0" {get_numpy} torchvision bitsandbytes "transformers==4.56.2" \
    "unsloth_zoo[base] @ git+https://github.com/unslothai/unsloth-zoo" \
    "unsloth[base] @ git+https://github.com/unslothai/unsloth" \
    git+https://github.com/triton-lang/triton.git@05b2c186c1b6c9a08375389d5efe9cb4c401c075#subdirectory=python/triton_kernels
!uv pip install --upgrade --no-deps transformers==4.56.2 tokenizers
!uv pip install --no-deps trl==0.22.2
```

Example 2 (python):
```python
from unsloth import FastLanguageModel
import torch

max_seq_length = 768        # Increase if your task needs longer outputs
lora_rank      = 4          # Higher rank → better but more VRAM/compute

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name        = "unsloth/gpt-oss-20b",  # or unsloth/gpt-oss-20b-BF16 on H100
    max_seq_length    = max_seq_length,
    load_in_4bit      = True,                    # False for 16‑bit
    offload_embedding = True,                    # saves ~1GB VRAM
)

model = FastLanguageModel.get_peft_model(
    model,
    r = lora_rank,
    target_modules = [
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
    lora_alpha = lora_rank * 2,
    use_gradient_checkpointing = "unsloth",     # big memory saver
    random_state = 3407,
)
```

Example 3 (python):
```python
def always_move_left(board):
    return "W"

steps, outcome = execute_strategy(always_move_left, GameBoard(size=8, seed=42, target=2048, probability_fours=0.10))
```

Example 4 (python):
```python
from unsloth import check_python_modules
  ok, info = check_python_modules("""
  def strategy(board):
      import math
      from typing import Callable
      return "W"
  """)
  # ok == True means only Python‑level imports were used
```

---

## Unsloth Benchmarks

**URL:** llms-txt#unsloth-benchmarks

**Contents:**
- Context length benchmarks
  - **Llama 3.1 (8B) max. context length**
  - **Llama 3.3 (70B) max. context length**

Unsloth recorded benchmarks on NVIDIA GPUs.

* For more detailed benchmarks, read our [Llama 3.3 Blog](https://unsloth.ai/blog/llama3-3).
* Benchmarking of Unsloth was also conducted by [🤗Hugging Face](https://huggingface.co/blog/unsloth-trl).

Tested on H100 and [Blackwell](https://docs.unsloth.ai/basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth) GPUs. We tested using the Alpaca Dataset, a batch size of 2, gradient accumulation steps of 4, rank = 32, and applied QLoRA on all linear layers (q, k, v, o, gate, up, down):

<table data-full-width="false"><thead><tr><th>Model</th><th>VRAM</th><th>🦥Unsloth speed</th><th>🦥VRAM reduction</th><th>🦥Longer context</th><th>😊Hugging Face + FA2</th></tr></thead><tbody><tr><td>Llama 3.3 (70B)</td><td>80GB</td><td>2x</td><td>>75%</td><td>13x longer</td><td>1x</td></tr><tr><td>Llama 3.1 (8B)</td><td>80GB</td><td>2x</td><td>>70%</td><td>12x longer</td><td>1x</td></tr></tbody></table>

## Context length benchmarks

{% hint style="info" %}
The more data you have, the less VRAM Unsloth uses due to our [gradient checkpointing](https://unsloth.ai/blog/long-context) algorithm + Apple's CCE algorithm!
{% endhint %}

### **Llama 3.1 (8B) max. context length**

We tested Llama 3.1 (8B) Instruct and did 4bit QLoRA on all linear layers (Q, K, V, O, gate, up and down) with rank = 32 with a batch size of 1. We padded all sequences to a certain maximum sequence length to mimic long context finetuning workloads.

| GPU VRAM | 🦥Unsloth context length | Hugging Face + FA2 |
| -------- | ------------------------ | ------------------ |
| 8 GB     | 2,972                    | OOM                |
| 12 GB    | 21,848                   | 932                |
| 16 GB    | 40,724                   | 2,551              |
| 24 GB    | 78,475                   | 5,789              |
| 40 GB    | 153,977                  | 12,264             |
| 48 GB    | 191,728                  | 15,502             |
| 80 GB    | 342,733                  | 28,454             |

### **Llama 3.3 (70B) max. context length**

We tested Llama 3.3 (70B) Instruct on a 80GB A100 and did 4bit QLoRA on all linear layers (Q, K, V, O, gate, up and down) with rank = 32 with a batch size of 1. We padded all sequences to a certain maximum sequence length to mimic long context finetuning workloads.

| GPU VRAM | 🦥Unsloth context length | Hugging Face + FA2 |
| -------- | ------------------------ | ------------------ |
| 48 GB    | 12,106                   | OOM                |
| 80 GB    | 89,389                   | 6,916              |

---

## Unsloth Docs

**URL:** llms-txt#unsloth-docs

**Contents:**
  - 🦥 Why Unsloth?
  - ⭐ Key Features
  - Quickstart
  - What is Fine-tuning and RL? Why?

Train your own model with Unsloth, an open-source framework for LLM fine-tuning and reinforcement learning.

At Unsloth, our mission is to make AI as accurate and accessible as possible. Train, run, evaluate and save gpt-oss, Llama, DeepSeek, TTS, Qwen, Mistral, Gemma LLMs 2x faster with 70% less VRAM.

Our docs will guide you through running & training your own model locally.

<a href="fine-tuning-for-beginners" class="button primary">Get started</a> <a href="https://github.com/unslothai/unsloth" class="button secondary">Our GitHub</a>

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-cover data-type="image">Cover image</th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>New 3x Faster Training</strong></td><td>Introducing our new Unsloth Triton kernels!</td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FICSa2F6HWtYJgUWiArtd%2F3x%20faster%20training.png?alt=media&#x26;token=2498e2fa-a74e-4298-95eb-55b706f577a3">3x faster training.png</a></td><td><a href="../new/3x-faster-training-packing">3x-faster-training-packing</a></td></tr><tr><td><strong>Nemotron 3 Nano</strong></td><td>Run &#x26; fine-tune NVIDIA's new reasoning models. </td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F5AeVpAiKFQAgLpA7caad%2Fnemotron%20nano%203%20promo.png?alt=media&#x26;token=e2f879a3-cf82-4253-8d62-9f0c0ac69375">nemotron nano 3 promo.png</a></td><td><a href="../models/nemotron-3">nemotron-3</a></td></tr><tr><td><strong>500K Context Fine-tuning</strong></td><td>You can now train with >500K context.</td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F0dJ0Z6vfIeR4qfLniuEz%2F500k%20context.png?alt=media&#x26;token=ed144b31-4fef-4a5d-8896-632d8e83ef97">500k context.png</a></td><td><a href="../new/500k-context-length-fine-tuning">500k-context-length-fine-tuning</a></td></tr></tbody></table>

{% columns %}
{% column width="50%" %}
{% content-ref url="fine-tuning-llms-guide" %}
[fine-tuning-llms-guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide)
{% endcontent-ref %}

{% content-ref url="unsloth-notebooks" %}
[unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks)
{% endcontent-ref %}
{% endcolumn %}

{% column width="50%" %}
{% content-ref url="unsloth-model-catalog" %}
[unsloth-model-catalog](https://docs.unsloth.ai/get-started/unsloth-model-catalog)
{% endcontent-ref %}

{% content-ref url="../models/tutorials-how-to-fine-tune-and-run-llms" %}
[tutorials-how-to-fine-tune-and-run-llms](https://docs.unsloth.ai/models/tutorials-how-to-fine-tune-and-run-llms)
{% endcontent-ref %}
{% endcolumn %}
{% endcolumns %}

* Unsloth streamlines local training, evaluation, saving, and deployment with Ollama, llama.cpp, and vLLM.
* We directly collab with teams behind [gpt-oss](https://docs.unsloth.ai/new/gpt-oss-how-to-run-and-fine-tune#unsloth-fixes-for-gpt-oss), [Qwen3](https://www.reddit.com/r/LocalLLaMA/comments/1kaodxu/qwen3_unsloth_dynamic_ggufs_128k_context_bug_fixes/), [Llama 4](https://github.com/ggml-org/llama.cpp/pull/12889), [Mistral](https://docs.unsloth.ai/models/tutorials-how-to-fine-tune-and-run-llms/devstral-how-to-run-and-fine-tune), [Gemma 1–3](https://news.ycombinator.com/item?id=39671146) and [Phi-4](https://unsloth.ai/blog/phi4), where we’ve **fixed critical bugs** that greatly improved model accuracy.
* Unsloth is the only training framework to support all models: [vision](https://docs.unsloth.ai/basics/vision-fine-tuning), [TTS](https://docs.unsloth.ai/basics/text-to-speech-tts-fine-tuning), BERT, [RL](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) while remaining highly customizable with flexible chat templates, dataset formatting and ready-to-use notebooks.

* Supports **full-finetuning**, pretraining, 4-bit, 16-bit and **8-bit** training.
* Most efficient reinforcement learning (RL) library, using 80% less VRAM. Supports GRPO, GSPO etc.
* Supports **all models**: [TTS,](https://docs.unsloth.ai/basics/text-to-speech-tts-fine-tuning) multimodal, [BERT](https://docs.unsloth.ai/get-started/unsloth-notebooks#other-important-notebooks) and more. Any model that works in transformers works in Unsloth.
* **0% loss in accuracy** - no quantization or approximation methods - all exact.
* [MultiGPU](https://docs.unsloth.ai/basics/multi-gpu-training-with-unsloth) works already but a much better version is coming!
* Unsloth supports Linux, [Windows](https://docs.unsloth.ai/get-started/install-and-update/windows-installation), Colab, Kaggle, **NVIDIA** and [**AMD**](https://docs.unsloth.ai/new/fine-tuning-llms-on-amd-gpus-with-unsloth) & **Intel**. See:

{% content-ref url="fine-tuning-for-beginners/unsloth-requirements" %}
[unsloth-requirements](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/unsloth-requirements)
{% endcontent-ref %}

**Install locally with pip (recommended)** for Linux or WSL devices:

Use our official **Docker image**: `unsloth/unsloth`. Read our [**Docker guide**](https://docs.unsloth.ai/get-started/install-and-update/docker)**.**

For Windows install instructions, see [here](https://docs.unsloth.ai/get-started/install-and-update/windows-installation).

{% content-ref url="install-and-update" %}
[install-and-update](https://docs.unsloth.ai/get-started/install-and-update)
{% endcontent-ref %}

### What is Fine-tuning and RL? Why?

[**Fine-tuning** an LLM](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide) customizes its behavior, enhances domain knowledge, and optimizes performance for specific tasks. By fine-tuning a pre-trained model (e.g. Llama-3.1-8B) on a dataset, you can:

* **Update Knowledge**: Introduce new domain-specific information.
* **Customize Behavior**: Adjust the model’s tone, personality, or response style.
* **Optimize for Tasks**: Improve accuracy and relevance for specific use cases.

[**Reinforcement Learning (RL)**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) is where an "agent" learns to make decisions by interacting with an environment and receiving **feedback** in the form of **rewards** or **penalties**.

* **Action:** What the model generates (e.g. a sentence).
* **Reward:** A signal indicating how good or bad the model's action was (e.g. did the response follow instructions? was it helpful?).
* **Environment:** The scenario or task the model is working on (e.g. answering a user’s question).

**Example use-cases of fine-tuning or RL:**

* Train LLM to predict if a headline impacts a company positively or negatively.
* Use historical customer interactions for more accurate and custom responses.
* Train LLM on legal texts for contract analysis, case law research, and compliance.

You can think of a fine-tuned model as a specialized agent designed to do specific tasks more effectively and efficiently. **Fine-tuning can replicate all of RAG's capabilities**, but not vice versa.

{% content-ref url="fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me" %}
[faq-+-is-fine-tuning-right-for-me](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me)
{% endcontent-ref %}

{% content-ref url="reinforcement-learning-rl-guide" %}
[reinforcement-learning-rl-guide](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide)
{% endcontent-ref %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-134302f2507d4313b9575917c9a43b0a0028856c%2Flarge%20sloth%20wave.png?alt=media" alt="" width="188"><figcaption></figcaption></figure>

**Examples:**

Example 1 (bash):
```bash
pip install unsloth
```

---

## Unsloth Inference

**URL:** llms-txt#unsloth-inference

Learn how to run your finetuned model with Unsloth's faster inference.

Unsloth supports natively 2x faster inference. For our inference only notebook, click [here](https://colab.research.google.com/drive/1aqlNQi7MMJbynFDyOQteD2t0yVfjb9Zh?usp=sharing).

All QLoRA, LoRA and non LoRA inference paths are 2x faster. This requires no change of code or any new dependencies.

<pre class="language-python"><code class="lang-python"><strong>from unsloth import FastLanguageModel
</strong>model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "lora_model", # YOUR MODEL YOU USED FOR TRAINING
    max_seq_length = max_seq_length,
    dtype = dtype,
    load_in_4bit = load_in_4bit,
)
FastLanguageModel.for_inference(model) # Enable native 2x faster inference
text_streamer = TextStreamer(tokenizer)
_ = model.generate(**inputs, streamer = text_streamer, max_new_tokens = 64)
</code></pre>

#### NotImplementedError: A UTF-8 locale is required. Got ANSI

Sometimes when you execute a cell [this error](https://github.com/googlecolab/colabtools/issues/3409) can appear. To solve this, in a new cell, run the below:

**Examples:**

Example 1 (python):
```python
import locale
locale.getpreferredencoding = lambda: "UTF-8"
```

---

## Vision Fine-tuning

**URL:** llms-txt#vision-fine-tuning

**Contents:**
  - Vision Fine-tuning Dataset
  - Multi-image training

Learn how to fine-tune vision/multimodal LLMs with Unsloth

Fine-tuning vision models enables model to excel at certain tasks normal LLMs won't be as good as such as object/movement detection. **You can also train** [**VLMs with RL**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/vision-reinforcement-learning-vlm-rl)**.** We have many free notebooks for vision fine-tuning:

* **NEW: Qwen3-VL (8B) Vision:** [**Notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision.ipynb)
* **Gemma 3 (4B) Vision:** [Notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision.ipynb)
* **Llama 3.2 Vision** fine-tuning for radiography: [Notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(11B\)-Vision.ipynb)\
  How can we assist medical professionals in analyzing Xrays, CT Scans & ultrasounds faster.
* **Qwen2.5 VL** fine-tuning for converting handwriting to LaTeX: [Notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_VL_\(7B\)-Vision.ipynb)\
  This allows complex math formulas to be easily transcribed as LaTeX without manually writing it.
* **Pixtral 12B 2409** vision fine-tuning for general Q\&A: [Notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Pixtral_\(12B\)-Vision.ipynb)\
  One can concatenate general Q\&A datasets with more niche datasets to make the finetune not forget base model skills.

{% hint style="info" %}
It is best to ensure your dataset has images of all the same size/dimensions. Use dimensions of 300-1000px to ensure your training does not take too long or use too many resources.
{% endhint %}

To finetune vision models, we now allow you to select which parts of the mode to finetune. You can select to only finetune the vision layers, or the language layers, or the attention / MLP layers! We set them all on by default!

### Vision Fine-tuning Dataset

The dataset for fine-tuning a vision or multimodal model is similar to standard question & answer pair [datasets ](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/datasets-guide), but this time, they also includes image inputs. For example, the [Llama 3.2 Vision Notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(11B\)-Vision.ipynb#scrollTo=vITh0KVJ10qX) uses a radiography case to show how AI can help medical professionals analyze X-rays, CT scans, and ultrasounds more efficiently.

We'll be using a sampled version of the ROCO radiography dataset. You can access the dataset [here](https://www.google.com/url?q=https%3A%2F%2Fhuggingface.co%2Fdatasets%2Funsloth%2FRadiology_mini). The dataset includes X-rays, CT scans and ultrasounds showcasing medical conditions and diseases. Each image has a caption written by experts describing it. The goal is to finetune a VLM to make it a useful analysis tool for medical professionals.

Let's take a look at the dataset, and check what the 1st example shows:

| Image                                                                                                                                                                                                                                                                              | Caption                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| <div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-97d4489827403bd4795494f33d01a10979788c30%2Fxray.png?alt=media" alt="" width="164"><figcaption></figcaption></figure></div> | Panoramic radiography shows an osteolytic lesion in the right posterior maxilla with resorption of the floor of the maxillary sinus (arrows). |

To format the dataset, all vision finetuning tasks should be formatted as follows:

We will craft an custom instruction asking the VLM to be an expert radiographer. Notice also instead of just 1 instruction, you can add multiple turns to make it a dynamic conversation.

Let's convert the dataset into the "correct" format for finetuning:

The first example is now structured like below:

{% code overflow="wrap" %}

Before we do any finetuning, maybe the vision model already knows how to analyse the images? Let's check if this is the case!

For more details, view our dataset section in the [notebook here](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(11B\)-Vision.ipynb#scrollTo=vITh0KVJ10qX).

### Multi-image training

In order to fine-tune or train a VLM like Qwen3-VL with multi-images the most straightforward change is to swap

Using map kicks in dataset standardization and arrow processing rules which can be strict and more complicated to define.

**Examples:**

Example 1 (python):
```python
model = FastVisionModel.get_peft_model(
    model,
    finetune_vision_layers     = True, # False if not finetuning vision layers
    finetune_language_layers   = True, # False if not finetuning language layers
    finetune_attention_modules = True, # False if not finetuning attention layers
    finetune_mlp_modules       = True, # False if not finetuning MLP layers

    r = 16,                           # The larger, the higher the accuracy, but might overfit
    lora_alpha = 16,                  # Recommended alpha == r at least
    lora_dropout = 0,
    bias = "none",
    random_state = 3407,
    use_rslora = False,               # We support rank stabilized LoRA
    loftq_config = None,               # And LoftQ
    target_modules = "all-linear",    # Optional now! Can specify a list if needed
    modules_to_save=[
        "lm_head",
        "embed_tokens",
    ],
)
```

Example 2 (unknown):
```unknown
Dataset({
    features: ['image', 'image_id', 'caption', 'cui'],
    num_rows: 1978
})
```

Example 3 (python):
```python
[
{ "role": "user",
  "content": [{"type": "text",  "text": instruction}, {"type": "image", "image": image} ]
},
{ "role": "assistant",
  "content": [{"type": "text",  "text": answer} ]
},
]
```

Example 4 (unknown):
```unknown
Let's convert the dataset into the "correct" format for finetuning:
```

---

## What Model Should I Use for Fine-tuning?

**URL:** llms-txt#what-model-should-i-use-for-fine-tuning?

**Contents:**
- Llama, Qwen, Mistral, Phi or?
- Instruct or Base Model?
  - Instruct Models
  - **Base Models**
  - Should I Choose Instruct or Base?
- Fine-tuning models with Unsloth
  - Experimentation is Key

## Llama, Qwen, Mistral, Phi or?

When preparing for fine-tuning, one of the first decisions you'll face is selecting the right model. Here's a step-by-step guide to help you choose:

{% stepper %}
{% step %}
**Choose a model that aligns with your usecase**

* E.g. For image-based training, select a vision model such as *Llama 3.2 Vision*. For code datasets, opt for a specialized model like *Qwen Coder 2.5*.
* **Licensing and Requirements**: Different models may have specific licensing terms and [system requirements](https://docs.unsloth.ai/fine-tuning-for-beginners/unsloth-requirements#system-requirements). Be sure to review these carefully to avoid compatibility issues.
  {% endstep %}

{% step %}
**Assess your storage, compute capacity and dataset**

* Use our [VRAM guideline](https://docs.unsloth.ai/fine-tuning-for-beginners/unsloth-requirements#approximate-vram-requirements-based-on-model-parameters) to determine the VRAM requirements for the model you’re considering.
* Your dataset will reflect the type of model you will use and amount of time it will take to train
  {% endstep %}

{% step %}
**Select a Model and Parameters**

* We recommend using the latest model for the best performance and capabilities. For instance, as of January 2025, the leading 70B model is *Llama 3.3*.
* You can stay up to date by exploring our [model catalog](https://docs.unsloth.ai/get-started/unsloth-model-catalog) to find the newest and relevant options.
  {% endstep %}

{% step %}
**Choose Between Base and Instruct Models**

Further details below:
{% endstep %}
{% endstepper %}

## Instruct or Base Model?

When preparing for fine-tuning, one of the first decisions you'll face is whether to use an instruct model or a base model.

Instruct models are pre-trained with built-in instructions, making them ready to use without any fine-tuning. These models, including GGUFs and others commonly available, are optimized for direct usage and respond effectively to prompts right out of the box. Instruct models work with conversational chat templates like ChatML or ShareGPT.

Base models, on the other hand, are the original pre-trained versions without instruction fine-tuning. These are specifically designed for customization through fine-tuning, allowing you to adapt them to your unique needs. Base models are compatible with instruction-style templates like [Alpaca or Vicuna](https://docs.unsloth.ai/basics/chat-templates), but they generally do not support conversational chat templates out of the box.

### Should I Choose Instruct or Base?

The decision often depends on the quantity, quality, and type of your data:

* **1,000+ Rows of Data**: If you have a large dataset with over 1,000 rows, it's generally best to fine-tune the base model.
* **300–1,000 Rows of High-Quality Data**: With a medium-sized, high-quality dataset, fine-tuning the base or instruct model are both viable options.
* **Less than 300 Rows**: For smaller datasets, the instruct model is typically the better choice. Fine-tuning the instruct model enables it to align with specific needs while preserving its built-in instructional capabilities. This ensures it can follow general instructions without additional input unless you intend to significantly alter its functionality.
* For information how how big your dataset should be, [see here](https://docs.unsloth.ai/get-started/datasets-guide#how-big-should-my-dataset-be)

## Fine-tuning models with Unsloth

You can change the model name to whichever model you like by matching it with model's name on Hugging Face e.g. 'unsloth/llama-3.1-8b-unsloth-bnb-4bit'.

We recommend starting with **Instruct models**, as they allow direct fine-tuning using conversational chat templates (ChatML, ShareGPT etc.) and require less data compared to **Base models** (which uses Alpaca, Vicuna etc). Learn more about the differences between [instruct and base models here](#instruct-or-base-model).

* Model names ending in **`unsloth-bnb-4bit`** indicate they are [**Unsloth dynamic 4-bit**](https://unsloth.ai/blog/dynamic-4bit) **quants**. These models consume slightly more VRAM than standard BitsAndBytes 4-bit models but offer significantly higher accuracy.
* If a model name ends with just **`bnb-4bit`**, without "unsloth", it refers to a standard BitsAndBytes 4-bit quantization.
* Models with **no suffix** are in their original **16-bit or 8-bit formats**. While they are the original models from the official model creators, we sometimes include important fixes - such as chat template or tokenizer fixes. So it's recommended to use our versions when available.

### Experimentation is Key

{% hint style="info" %}
We recommend experimenting with both models when possible. Fine-tune each one and evaluate the outputs to see which aligns better with your goals.
{% endhint %}

---

## --learning_rate, --max_seq_length, --per_device_train_batch_size, --gradient_accumulation_steps, --max_steps

**URL:** llms-txt#--learning_rate,---max_seq_length,---per_device_train_batch_size,---gradient_accumulation_steps,---max_steps

---
