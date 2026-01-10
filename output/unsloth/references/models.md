# Unsloth - Models

**Pages:** 46

---

## 4bit pre quantized models we support for 4x faster downloading + no OOMs.

**URL:** llms-txt#4bit-pre-quantized-models-we-support-for-4x-faster-downloading-+-no-ooms.

**Contents:**
  - 🏁 And that's it!
- ❓FAQ (Frequently Asked Questions)

fourbit_models = [
    "unsloth/gpt-oss-20b-unsloth-bnb-4bit", # 20B model using bitsandbytes 4bit quantization
<strong>    "unsloth/gpt-oss-120b-unsloth-bnb-4bit",
</strong>    "unsloth/gpt-oss-20b", # 20B model using MXFP4 format
    "unsloth/gpt-oss-120b",
] # More models at https://huggingface.co/unsloth

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/gpt-oss-20b",
    dtype = dtype, # None for auto detection
    max_seq_length = max_seq_length, # Choose any for long context!
    load_in_4bit = True,  # 4 bit quantization to reduce memory
    full_finetuning = False, # [NEW!] We have full finetuning now!
    # token = "hf_...", # use one if using gated models
)
</code></pre>

You should see output similar to the example below. Note: We explicitly change the `dtype` to `float32` to ensure correct training behavior.
{% endstep %}

#### Fine-tuning Hyperparameters (LoRA)

Now it's time to adjust your training hyperparameters. For a deeper dive into how, when, and what to tune, check out our [detailed hyperparameters guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide).

{% hint style="info" %}
To avoid [overfitting](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide#avoiding-overfitting-and-underfitting), monitor your training loss and avoid setting these values too high.
{% endhint %}

This step adds LoRA adapters for parameter-efficient fine-tuning. Only about 1% of the model’s parameters are trained, which makes the process significantly more efficient.

#### Data Preparation

For this example, we will use the [`HuggingFaceH4/Multilingual-Thinking`](https://huggingface.co/datasets/HuggingFaceH4/Multilingual-Thinking). This dataset contains chain-of-thought reasoning examples derived from user questions translated from English into four additional languages.

This is the same dataset referenced in OpenAI's fine-tuning cookbook. The goal of using a multilingual dataset is to help the model learn and generalize reasoning patterns across multiple languages.

gpt-oss introduces a reasoning effort system that controls how much reasoning the model performs. By default, the reasoning effort is set to `low`, but you can change it by setting the `reasoning_effort` parameter to `low`, `medium` or `high`.

To format the dataset, we apply a customized version of the gpt-oss prompt:

Let's inspect the dataset by printing the first example:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-348661d8e6a1aa0efeea2b63fb71c2bb6f09109e%2Fimage.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

One unique feature of gpt-oss is its use of the [**OpenAI Harmony format**](https://github.com/openai/harmony)**,** which supports structured conversations, reasoning output, and tool calling. This format includes tags such as `<|start|>` , `<|message|>` , and `<|return|>` .

{% hint style="info" %}
🦥 Unsloth fixes the chat template to ensure it is correct. See this [tweet](https://x.com/danielhanchen/status/1953901104150065544) for technical details on our template fix.
{% endhint %}

Feel free to adapt the prompt and structure to suit your own dataset or use-case. For more guidance, refer to our [dataset guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/datasets-guide).
{% endstep %}

We've pre-selected training hyperparameters for optimal results. However, you can modify them based on your specific use case. Refer to our [hyperparameters guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide).

In this example, we train for 60 steps to speed up the process. For a full training run, set `num_train_epochs=1` and disable the step limiting by setting `max_steps=None`.

During training, monitor the loss to ensure that it is decreasing over time. This confirms that the training process is functioning correctly.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5ace71760531cf39f14499baf9ca0f78d8018756%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Inference: Run Your Trained Model

Now it's time to run inference with your fine-tuned model. You can modify the instruction and input, but leave the output blank.

In this example, we test the model's ability to reason in French by adding a specific instruction to the system prompt, following the same structure used in our dataset.

This should produce an output similar to:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-31de17223d48ce57d5e178e5901e566c47adf59e%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Save and Export Your Model

To save your fine-tuned model, it can be exported in the Safetensors format with our new **on-demand dequantization of MXFP4** base models (like gpt-oss) during the LoRA merge process. This makes it possible to **export your fine-tuned model in bf16 format**.

{% hint style="success" %}
New: Saving or merging QLoRA fine-tuned models to GGUF is now supported for use in other frameworks (e.g. Hugging Face, llama.cpp with GGUF).
{% endhint %}

After fine-tuning your gpt-oss model, you can merge it into 16-bit format with:

If you prefer to merge the model and push to the hugging-face hub directly:

#### :sparkles: Saving to Llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Convert and quantize the merged model:

3. Run inference on the quantized model:

{% endstep %}
{% endstepper %}

You've fine-tuned gpt-oss with Unsloth. We're currently working on RL and GRPO implementations, as well as improved model saving and running, so stay tuned.

As always, feel free to drop by our [Discord](https://discord.com/invite/unsloth) or [Reddit](https://www.reddit.com/r/unsloth/) if you need any help.

## ❓FAQ (Frequently Asked Questions)

#### 1. Can I export my model to use in Hugging Face, llama.cpp GGUF or vLLM later?

Yes you can now [save/export your gpt-oss fine-tuned](https://docs.unsloth.ai/models/long-context-gpt-oss-training#new-saving-to-gguf-vllm-after-gpt-oss-training) model using Unsloth's new update!

#### 2. Can I do fp4 or MXFP4 training with gpt-oss?

No, currently no framework supports fp4 or MXFP4 training. Unsloth however is the only framework to support QLoRA 4-bit fine-tuning for the model, enabling more than 4x less VRAM use.

#### 3. Can I export my model to MXFP4 format after training?

No, currently no library or framework supports this.

#### 4. Can I do Reinforcement Learning (RL) or GRPO with gpt-oss?

Yes! Unsloth now supports RL for gpt-oss with GRPO/GSPO. We made it work on a free Kaggle notebook and achieved the fastest inference for RL. [Read more here](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/gpt-oss-reinforcement-learning)

***Acknowledgements:** A huge thank you to* [*Eyera*](https://huggingface.co/Orenguteng) *for contributing to this guide!*

**Examples:**

Example 1 (python):
```python
model = FastLanguageModel.get_peft_model(
    model,
    r = 8, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj",],
    lora_alpha = 16,
    lora_dropout = 0, # Supports any, but = 0 is optimized
    bias = "none",    # Supports any, but = "none" is optimized
    # [NEW] "unsloth" uses 30% less VRAM, fits 2x larger batch sizes!
    use_gradient_checkpointing = "unsloth", # True or "unsloth" for very long context
    random_state = 3407,
    use_rslora = False,  # We support rank stabilized LoRA
    loftq_config = None, # And LoftQ
)
```

Example 2 (python):
```python
def formatting_prompts_func(examples):
    convos = examples["messages"]
    texts = [tokenizer.apply_chat_template(convo, tokenize = False, add_generation_prompt = False) for convo in convos]
    return { "text" : texts, }
pass

from datasets import load_dataset

dataset = load_dataset("HuggingFaceH4/Multilingual-Thinking", split="train")
dataset
```

Example 3 (python):
```python
tokenizer.apply_chat_template(
    text, 
    tokenize = False, 
    add_generation_prompt = False,
    reasoning_effort = "medium",
)
```

Example 4 (python):
```python
from unsloth.chat_templates import standardize_sharegpt
dataset = standardize_sharegpt(dataset)
dataset = dataset.map(formatting_prompts_func, batched = True,)
```

---

## Batch Size=8, Input=1024, Output=1024

**URL:** llms-txt#batch-size=8,-input=1024,-output=1024

**Contents:**
  - :person\_running:SGLang Interactive Offline Mode
  - :sparkler:GGUFs in SGLang
  - :clapper:High throughput GGUF serving with SGLang

python -m sglang.bench_one_batch_server \
    --model finetuned_model \
    --base-url http://0.0.0.0:30002 \
    --batch-size 8 \
    --input-len 1024 \
    --output-len 1024
python
import sglang as sgl
engine = sgl.Engine(model_path = "unsloth/Qwen3-0.6B", random_seed = 42)

prompt = "Today is a sunny day and I like"
sampling_params = {"temperature": 0, "max_new_tokens": 256}
outputs = engine.generate(prompt, sampling_params)["text"]
print(outputs)
engine.shutdown()
shellscript
pip install -e "git+https://github.com/ggml-org/llama.cpp.git#egg=gguf&subdirectory=gguf-py" # install a python package from a repo subdirectory
python
from huggingface_hub import hf_hub_download
model_path = hf_hub_download(
    "unsloth/Qwen3-32B-GGUF",
    filename = "Qwen3-32B-UD-Q4_K_XL.gguf",
)
import sglang as sgl
engine = sgl.Engine(model_path = model_path, random_seed = 42)

prompt = "Today is a sunny day and I like"
sampling_params = {"temperature": 0, "max_new_tokens": 256}
outputs = engine.generate(prompt, sampling_params)["text"]
print(outputs)
engine.shutdown()
python
from huggingface_hub import hf_hub_download
hf_hub_download("unsloth/Qwen3-32B-GGUF", filename="Qwen3-32B-UD-Q4_K_XL.gguf", local_dir=".")
shellscript
python -m sglang.launch_server \
    --model-path Qwen3-32B-UD-Q4_K_XL.gguf \
    --host 0.0.0.0 --port 30002 \
    --served-model-name unsloth/Qwen3-32B \
    --tokenizer-path unsloth/Qwen3-32B
```

**Examples:**

Example 1 (unknown):
```unknown
You will see the benchmarking run like below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FhcGy7cwC2xFaPA7FcJJq%2Fimage.png?alt=media&#x26;token=05687013-8af5-4731-8dae-b8cc05d44f21" alt=""><figcaption></figcaption></figure>

We used a B200x1 GPU with gpt-oss-20b and got the below results (\~2,500 tokens throughput)

| Batch/Input/Output | TTFT (s) | ITL (s) | Input Throughput | Output Throughput |
| ------------------ | -------- | ------- | ---------------- | ----------------- |
| 8/1024/1024        | 0.40     | 3.59    | 20,718.95        | 2,562.87          |
| 8/8192/1024        | 0.42     | 3.74    | 154,459.01       | 2,473.84          |

See <https://docs.sglang.ai/advanced_features/server_arguments.html> for server arguments for SGLang.

### :person\_running:SGLang Interactive Offline Mode

You can also use SGLang in offline mode (ie not a server) inside a Python interactive environment.

{% code overflow="wrap" %}
```

Example 2 (unknown):
```unknown
{% endcode %}

### :sparkler:GGUFs in SGLang

SGLang also interestingly supports GGUFs! **Qwen3 MoE is still under construction, but most dense models (Llama 3, Qwen 3, Mistral etc) are supported.**

First install the latest gguf python package via:

{% code overflow="wrap" %}
```

Example 3 (unknown):
```unknown
{% endcode %}

Then for example in offline mode SGLang, you can do:

{% code overflow="wrap" %}
```

Example 4 (unknown):
```unknown
{% endcode %}

### :clapper:High throughput GGUF serving with SGLang

First download the specific GGUF file like below:

{% code overflow="wrap" %}
```

---

## <|channel|>analysis<|message|>The user asks a simple math question. We should answer 4. Also we should comply with policy. No issues.<|end|><|start|>assistant<|channel|>final<|message|>2 + 2 equals 4.

**URL:** llms-txt#<|channel|>analysis<|message|>the-user-asks-a-simple-math-question.-we-should-answer-4.-also-we-should-comply-with-policy.-no-issues.<|end|><|start|>assistant<|channel|>final<|message|>2-+-2-equals-4.

**Contents:**
  - :gem:FP8 Online Quantization
  - ⚡Benchmarking SGLang

shellscript
python -m sglang.launch_server \
    --model-path unsloth/Llama-3.2-1B-Instruct \
    --host 0.0.0.0 --port 30002 \
    --quantization fp8 \
    --kv-cache-dtype fp8_e4m3
shellscript
python -m sglang.launch_server \
    --model-path finetuned_model \
    --host 0.0.0.0 --port 30002
shellscript

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}
{% endstep %}
{% endstepper %}

### :gem:FP8 Online Quantization

To deploy models with FP8 online quantization which allows 30 to 50% more throughput and 50% less memory usage with 2x longer context length supports with SGLang, you can do the below:

{% code overflow="wrap" %}
```

Example 2 (unknown):
```unknown
{% endcode %}

You can also use `--kv-cache-dtype fp8_e5m2` which has a larger dynamic range which might solve FP8 inference issues if you see them. Or use our pre-quantized float8 quants listed in <https://huggingface.co/unsloth/models?search=-fp8> or some are listed below:

{% embed url="<https://huggingface.co/unsloth/Llama-3.2-3B-FP8-Dynamic>" %}

{% embed url="<https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-FP8-Dynamic>" %}

### ⚡Benchmarking SGLang

Below is some code you can run to test the performance speed of your finetuned model:
```

Example 3 (unknown):
```unknown
Then in another terminal or via tmux:
```

---

## Chat Templates

**URL:** llms-txt#chat-templates

**Contents:**
  - List of Colab chat template notebooks:
- Multi turn conversations
- Customizable Chat Templates
- Applying Chat Templates with Unsloth
- More Information

Learn the fundamentals and customization options of chat templates, including Conversational, ChatML, ShareGPT, Alpaca formats, and more!

In our GitHub, we have a list of every chat template Unsloth uses including for Llama, Mistral, Phi-4 etc. So if you need any pointers on the formatting or use case, you can view them here: [github.com/unslothai/unsloth/blob/main/unsloth/chat\_templates.py](https://github.com/unslothai/unsloth/blob/main/unsloth/chat_templates.py)

### List of Colab chat template notebooks:

* [Conversational](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(1B_and_3B\)-Conversational.ipynb)
* [ChatML](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb)
* [Ollama](https://colab.research.google.com/drive/1WZDi7APtQ9VsvOrQSSC5DDtxq159j8iZ?usp=sharing)
* [Text Classification](https://github.com/timothelaborie/text_classification_scripts/blob/main/unsloth_classification.ipynb) by Timotheeee
* [Multiple Datasets](https://colab.research.google.com/drive/1njCCbE1YVal9xC83hjdo2hiGItpY_D6t?usp=sharing) by Flail

## Multi turn conversations

A bit issue if you didn't notice is the Alpaca dataset is single turn, whilst remember using ChatGPT was interactive and you can talk to it in multiple turns. For example, the left is what we want, but the right which is the Alpaca dataset only provides singular conversations. We want the finetuned language model to somehow learn how to do multi turn conversations just like ChatGPT.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2a65cd74ddd03a6bcbbc9827d9d034e4879a8e6a%2Fdiff.png?alt=media" alt=""><figcaption></figcaption></figure>

So we introduced the `conversation_extension` parameter, which essentially selects some random rows in your single turn dataset, and merges them into 1 conversation! For example, if you set it to 3, we randomly select 3 rows and merge them into 1! Setting them too long can make training slower, but could make your chatbot and final finetune much better!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2b1b3494b260f1102942d86143a885225c6a06f2%2Fcombine.png?alt=media" alt=""><figcaption></figcaption></figure>

Then set `output_column_name` to the prediction / output column. For the Alpaca dataset dataset, it would be the output column.

We then use the `standardize_sharegpt` function to just make the dataset in a correct format for finetuning! Always call this!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7bf83bf802191bda9e417bbe45afa181e7f24f38%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

## Customizable Chat Templates

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

## Applying Chat Templates with Unsloth

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

Assuming your dataset is a list of list of dictionaries like the below:

You can use our `get_chat_template` to format it. Select `chat_template` to be any of `zephyr, chatml, mistral, llama, alpaca, vicuna, vicuna_old, unsloth`, and use `mapping` to map the dictionary values `from`, `value` etc. `map_eos_token` allows you to map `<|im_end|>` to EOS without any training.

You can also make your own custom chat templates! For example our internal chat template we use is below. You must pass in a `tuple` of `(custom_template, eos_token)` where the `eos_token` must be used inside the template.

**Examples:**

Example 1 (unknown):
```unknown
from unsloth.chat_templates import CHAT_TEMPLATES
  print(list(CHAT_TEMPLATES.keys()))
```

Example 2 (unknown):
```unknown
['unsloth', 'zephyr', 'chatml', 'mistral', 'llama', 'vicuna', 'vicuna_old', 'vicuna old', 'alpaca', 'gemma', 'gemma_chatml', 'gemma2', 'gemma2_chatml', 'llama-3', 'llama3', 'phi-3', 'phi-35', 'phi-3.5', 'llama-3.1', 'llama-31', 'llama-3.2', 'llama-3.3', 'llama-32', 'llama-33', 'qwen-2.5', 'qwen-25', 'qwen25', 'qwen2.5', 'phi-4', 'gemma-3', 'gemma3']
```

Example 3 (unknown):
```unknown
from unsloth.chat_templates import get_chat_template

  tokenizer = get_chat_template(
      tokenizer,
      chat_template = "gemma-3", # change this to the right chat_template name
  )
```

Example 4 (unknown):
```unknown
def formatting_prompts_func(examples):
     convos = examples["conversations"]
     texts = [tokenizer.apply_chat_template(convo, tokenize = False, add_generation_prompt = False) for convo in convos]
     return { "text" : texts, }
```

---

## Convert the weight checkpoint state dict keys to one that ExecuTorch expects

**URL:** llms-txt#convert-the-weight-checkpoint-state-dict-keys-to-one-that-executorch-expects

python -m executorch.examples.models.qwen3.convert_weights "phone_model" pytorch_model_converted.bin

---

## Create model instance

**URL:** llms-txt#create-model-instance

llm = LLM(
    model="unsloth/DeepSeek-OCR",
    enable_prefix_caching=False,
    mm_processor_cache_gb=0,
    logits_processors=[NGramPerReqLogitsProcessor]
)

---

## DeepSeek-OCR: How to Run & Fine-tune

**URL:** llms-txt#deepseek-ocr:-how-to-run-&-fine-tune

**Contents:**
- 🖥️ **Running DeepSeek-OCR**
  - :gear: Recommended Settings
  - 📖 vLLM: Run DeepSeek-OCR Tutorial

Guide on how to run and fine-tune DeepSeek-OCR locally.

**DeepSeek-OCR** is a 3B-parameter vision model for OCR and document understanding. It uses *context optical compression* to convert 2D layouts into vision tokens, enabling efficient long-context processing.

Capable of handling tables, papers, and handwriting, DeepSeek-OCR achieves 97% precision while using 10× fewer vision tokens than text tokens - making it 10× more efficient than text-based LLMs.

You can fine-tune DeepSeek-OCR to enhance its vision or language performance. In our Unsloth [**free fine-tuning notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Deepseek_OCR_\(3B\).ipynb), we demonstrated a [88.26% improvement](#fine-tuning-deepseek-ocr) for language understanding.

<a href="#running-deepseek-ocr" class="button primary">Running DeepSeek-OCR</a><a href="#fine-tuning-deepseek-ocr" class="button primary">Fine-tuning DeepSeek-OCR</a>

> **Our model upload that enables fine-tuning + more inference support:** [**DeepSeek-OCR**](https://huggingface.co/unsloth/DeepSeek-OCR)

## 🖥️ **Running DeepSeek-OCR**

To run the model in [vLLM](#vllm-run-deepseek-ocr-tutorial) or [Unsloth](#unsloth-run-deepseek-ocr-tutorial), here are the recommended settings:

### :gear: Recommended Settings

DeepSeek recommends these settings:

* <mark style="background-color:blue;">**Temperature = 0.0**</mark>
* `max_tokens = 8192`
* `ngram_size = 30`
* `window_size = 90`

### 📖 vLLM: Run DeepSeek-OCR Tutorial

1. Obtain the latest `vLLM` via:

```bash
uv venv
source .venv/bin/activate

---

## DeepSeek-R1-0528: How to Run Locally

**URL:** llms-txt#deepseek-r1-0528:-how-to-run-locally

**Contents:**
- :gear: Recommended Settings
  - 🐳 Official Recommended Settings:
  - :1234: Chat template/prompt format
- Model uploads
- Run DeepSeek-R1-0528 Tutorials:
  - :llama: Run in Ollama/Open WebUI
  - :llama: Run Full R1-0528 on Ollama/Open WebUI
  - ✨ Run Qwen3 distilled R1 in llama.cpp
  - ✨ Run Full R1-0528 on llama.cpp

A guide on how to run DeepSeek-R1-0528 including Qwen3 on your own local device!

DeepSeek-R1-0528 is DeepSeek's new update to their R1 reasoning model. The full 671B parameter model requires 715GB of disk space. The quantized dynamic **1.66-bit** version uses 162GB (-80% reduction in size). GGUF: [DeepSeek-R1-0528-GGUF](https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF)

DeepSeek also released a R1-0528 distilled version by fine-tuning Qwen3 (8B). The distill achieves similar performance to Qwen3 (235B). ***You can also*** [***fine-tune Qwen3 Distill***](#fine-tuning-deepseek-r1-0528-with-unsloth) ***with Unsloth***. Qwen3 GGUF: [DeepSeek-R1-0528-Qwen3-8B-GGUF](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF)

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and KL Divergence performance, meaning you can run & fine-tune quantized DeepSeek LLMs with minimal accuracy loss.

**Tutorials navigation:**

<a href="#run-qwen3-distilled-r1-in-llama.cpp" class="button secondary">Run in llama.cpp</a><a href="#run-in-ollama-open-webui" class="button secondary">Run in Ollama/Open WebUI</a><a href="#fine-tuning-deepseek-r1-0528-with-unsloth" class="button secondary">Fine-tuning R1-0528</a>

{% hint style="success" %}
NEW: Huge improvements to tool calling and chat template fixes.\
\
New [TQ1\_0 dynamic 1.66-bit quant](https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF?show_file_info=DeepSeek-R1-0528-UD-TQ1_0.gguf) - 162GB in size. Ideal for 192GB RAM (including Mac) and Ollama users. Try: `ollama run hf.co/unsloth/DeepSeek-R1-0528-GGUF:TQ1_0`
{% endhint %}

## :gear: Recommended Settings

For DeepSeek-R1-0528-Qwen3-8B, the model can pretty much fit in any setup, and even those with as less as 20GB RAM. There is no need for any prep beforehand.\
\
However, for the full R1-0528 model which is 715GB in size, you will need extra prep. The 1.78-bit (IQ1\_S) quant will fit in a 1x 24GB GPU (with all layers offloaded). Expect around 5 tokens/s with this setup if you have bonus 128GB RAM as well.

It is recommended to have at least 64GB RAM to run this quant (you will get 1 token/s without a GPU). For optimal performance you will need at least **180GB unified memory or 180GB combined RAM+VRAM** for 5+ tokens/s.

We suggest using our 2.7bit (Q2\_K\_XL) or 2.4bit (IQ2\_XXS) quant to balance size and accuracy! The 2.4bit one also works well.

{% hint style="success" %}
Though not necessary, for the best performance, have your VRAM + RAM combined = to the size of the quant you're downloading.
{% endhint %}

### 🐳 Official Recommended Settings:

According to [DeepSeek](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528), these are the recommended settings for R1 (R1-0528 and Qwen3 distill should use the same settings) inference:

* Set the <mark style="background-color:green;">**temperature 0.6**</mark> to reduce repetition and incoherence.
* Set <mark style="background-color:green;">**top\_p to 0.95**</mark> (recommended)
* Run multiple tests and average results for reliable evaluation.

### :1234: Chat template/prompt format

R1-0528 uses the same chat template as the original R1 model. You do not need to force `<think>\n` , but you can still add it in!

A BOS is forcibly added, and an EOS separates each interaction. To counteract double BOS tokens during inference, you should only call `tokenizer.encode(..., add_special_tokens = False)` since the chat template auto adds a BOS token as well.\
For llama.cpp / GGUF inference, you should skip the BOS since it’ll auto add it:

The `<think>` and `</think>` tokens get their own designated tokens.

**ALL our uploads** - including those that are not imatrix-based or dynamic, utilize our calibration dataset, which is specifically optimized for conversational, coding, and language tasks.

* Qwen3 (8B) distill: [DeepSeek-R1-0528-Qwen3-8B-GGUF](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF)
* Full DeepSeek-R1-0528 model uploads below:

We also uploaded [IQ4\_NL](https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/IQ4_NL) and [Q4\_1](https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/Q4_1) quants which run specifically faster for ARM and Apple devices respectively.

<table data-full-width="false"><thead><tr><th>MoE Bits</th><th>Type + Link</th><th>Disk Size</th><th>Details</th></tr></thead><tbody><tr><td>1.66bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF?show_file_info=DeepSeek-R1-0528-UD-TQ1_0.gguf">TQ1_0</a></td><td><strong>162GB</strong></td><td>1.92/1.56bit</td></tr><tr><td>1.78bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-IQ1_S">IQ1_S</a></td><td><strong>185GB</strong></td><td>2.06/1.56bit</td></tr><tr><td>1.93bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-IQ1_M">IQ1_M</a></td><td><strong>200GB</strong></td><td>2.5/2.06/1.56</td></tr><tr><td>2.42bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-IQ2_XXS">IQ2_XXS</a></td><td><strong>216GB</strong></td><td>2.5/2.06bit</td></tr><tr><td>2.71bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-Q2_K_XL">Q2_K_XL</a></td><td><strong>251GB</strong></td><td>3.5/2.5bit</td></tr><tr><td>3.12bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-IQ3_XXS">IQ3_XXS</a></td><td><strong>273GB</strong></td><td>3.5/2.06bit</td></tr><tr><td>3.5bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-Q3_K_XL">Q3_K_XL</a></td><td><strong>296GB</strong></td><td>4.5/3.5bit</td></tr><tr><td>4.5bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-Q4_K_XL">Q4_K_XL</a></td><td><strong>384GB</strong></td><td>5.5/4.5bit</td></tr><tr><td>5.5bit</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-Q5_K_XL">Q5_K_XL</a></td><td><strong>481GB</strong></td><td>6.5/5.5bit</td></tr></tbody></table>

We've also uploaded versions in [BF16 format](https://huggingface.co/unsloth/DeepSeek-R1-0528-BF16), and original [FP8 (float8) format](https://huggingface.co/unsloth/DeepSeek-R1-0528).

## Run DeepSeek-R1-0528 Tutorials:

### :llama: Run in Ollama/Open WebUI

1. Install `ollama` if you haven't already! You can only run models up to 32B in size. To run the full 720GB R1-0528 model, [see here](#run-full-r1-0528-on-ollama-open-webui).

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload!

3. <mark style="color:green;background-color:yellow;">**(NEW) To run the full R1-0528 model in Ollama, you can use our TQ1\_0 (162GB quant):**</mark>

### :llama: Run Full R1-0528 on Ollama/Open WebUI

Open WebUI has made an step-by-step tutorial on how to run R1 here and for R1-0528, you will just need to replace R1 with the new 0528 quant: [docs.openwebui.com/tutorials/integrations/deepseekr1-dynamic/](https://docs.openwebui.com/tutorials/integrations/deepseekr1-dynamic/)

<mark style="background-color:green;">**(NEW) To run the full R1-0528 model in Ollama, you can use our TQ1\_0 (162GB quant):**</mark>

If you want to use any of the quants that are larger than TQ1\_0 (162GB) on Ollama, you need to first merge the 3 GGUF split files into 1 like the code below. Then you will need to run the model locally.

### ✨ Run Qwen3 distilled R1 in llama.cpp

1. <mark style="background-color:yellow;">**To run the full 720GB R1-0528 model,**</mark> [<mark style="background-color:yellow;">**see here**</mark>](#run-full-r1-0528-on-llama.cpp)<mark style="background-color:yellow;">**.**</mark> Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Then use llama.cpp directly to download the model:

### ✨ Run Full R1-0528 on llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:IQ1\_S) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location.

{% hint style="success" %}
Please try out `-ot ".ffn_.*_exps.=CPU"` to offload all MoE layers to the CPU! This effectively allows you to fit all non MoE layers on 1 GPU, improving generation speeds. You can customize the regex expression to fit more layers if you have more GPU capacity.

If you have a bit more GPU memory, try `-ot ".ffn_(up|down)_exps.=CPU"` This offloads up and down projection MoE layers.

Try `-ot ".ffn_(up)_exps.=CPU"` if you have even more GPU memory. This offloads only up projection MoE layers.

And finally offload all layers via `-ot ".ffn_.*_exps.=CPU"` This uses the least VRAM.

You can also customize the regex, for example `-ot "\.(6|7|8|9|[0-9][0-9]|[0-9][0-9][0-9])\.ffn_(gate|up|down)_exps.=CPU"` means to offload gate, up and down MoE layers but only from the 6th layer onwards.
{% endhint %}

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-IQ1_S`(dynamic 1.78bit quant) or other quantized versions like `Q4_K_M` . We <mark style="background-color:green;">**recommend using our 2.7bit dynamic quant**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`UD-Q2_K_XL`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**to balance size and accuracy**</mark>. More versions at: [https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF](https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF)

{% code overflow="wrap" %}

**Examples:**

Example 1 (unknown):
```unknown
<｜begin▁of▁sentence｜><｜User｜>What is 1+1?<｜Assistant｜>It's 2.<｜end▁of▁sentence｜><｜User｜>Explain more!<｜Assistant｜>
```

Example 2 (unknown):
```unknown
<｜User｜>What is 1+1?<｜Assistant｜>
```

Example 3 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 4 (bash):
```bash
ollama run hf.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF:Q4_K_XL
```

---

## DeepSeek-R1 Dynamic 1.58-bit

**URL:** llms-txt#deepseek-r1-dynamic-1.58-bit

**Contents:**
  - 1-bit (Small) - Dynamic vs. Basic
  - 1-bit (Medium) - Dynamic vs. Basic
  - 2-bit (Extra extra Small) - Dynamic vs. Basic
  - **Dynamic Quantization trial output**
  - Non Dynamic Quantization trial output

See performance comparison tables for Unsloth's Dynamic GGUF Quants vs Standard IMatrix Quants.

Read our full DeepSeek-R1 blogpost here: [unsloth.ai/blog/deepseekr1-dynamic](https://unsloth.ai/blog/deepseekr1-dynamic)

### 1-bit (Small) - Dynamic vs. Basic

<table data-full-width="true"><thead><tr><th>GGUF Type</th><th>Quant</th><th>Size (GB)</th><th>Seed</th><th>Pygame</th><th>Background</th><th>Accelerate SPACE</th><th>Bird shape</th><th>Land</th><th>Top right score</th><th>Pipes</th><th>Best Score</th><th>Quit</th><th>Runnable</th><th>Score</th><th>Avg Score</th><th width="214">Errors</th><th width="421">Notes</th></tr></thead><tbody><tr><td>Dynamic</td><td>IQ1_S</td><td>131</td><td>3407</td><td>1</td><td>0.5</td><td>1</td><td>0.5</td><td>0.5</td><td>1</td><td>0.5</td><td>1</td><td>1</td><td>0</td><td>7</td><td></td><td>score =!inc SyntaxError: invalid syntax</td><td>Selects random shapes and colors at the start, but doesn't rotate across trials</td></tr><tr><td>Dynamic</td><td>IQ1_S</td><td>131</td><td>3408</td><td>1</td><td>1</td><td>0.25</td><td>1</td><td>0.5</td><td>1</td><td>0.5</td><td>1</td><td>1</td><td>0</td><td>7.25</td><td></td><td>score =B4 NameError: name 'B4' is not defined</td><td>Better - selects pipe colors randomnly, but all are just 1 color - should be different. Dropping to ground fails to reset acceleration.</td></tr><tr><td>Dynamic</td><td>IQ1_S</td><td>131</td><td>3409</td><td>1</td><td>0.5</td><td>0.5</td><td>0.5</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>6.5</td><td>6.92</td><td>score =3D 0 SyntaxError: invalid decimal literal</td><td>Too hard to play - acceleration too fast. Pipe colors now are random, but bird shape not changing. Land collison fails.</td></tr><tr><td>Basic</td><td>IQ1_S</td><td>133</td><td>3407</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td><td>No code</td><td>Fully failed. Repeats "with Dark Colurs" forever</td></tr><tr><td>Basic</td><td>IQ1_S</td><td>133</td><td>3408</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td><td>No code</td><td>Fully failed. Repeats "Pygame's" forever</td></tr><tr><td>Basic</td><td>IQ1_S</td><td>133</td><td>3409</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>No code</td><td>Fully failed. Repeats "pipe_x = screen_height<br>pipe_x = screen_height<br>pipe_height = screen_height - Pipe_height" forever.</td></tr></tbody></table>

### 1-bit (Medium) - Dynamic vs. Basic

<table data-full-width="true"><thead><tr><th>GGUF Type</th><th>Quant</th><th>Size (GB)</th><th>Seed</th><th>Pygame</th><th>Background</th><th>Accelerate SPACE</th><th>Bird shape</th><th>Land</th><th>Top right score</th><th>Pipes</th><th>Best Score</th><th>Quit</th><th>Runnable</th><th>Score</th><th>Avg Score</th><th width="268">Errors</th><th width="284">Notes</th></tr></thead><tbody><tr><td>Dynamic</td><td>IQ1_M</td><td>158</td><td>3407</td><td>1</td><td>1</td><td>0.75</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>9.75</td><td></td><td>None</td><td>A bit fast and hard to play.</td></tr><tr><td>Dynamic</td><td>IQ1_M</td><td>158</td><td>3408</td><td>1</td><td>1</td><td>0.5</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>9.5</td><td></td><td>None</td><td>Very good - land should be clearer. Acceleration should be slower.</td></tr><tr><td>Dynamic</td><td>IQ1_M</td><td>158</td><td>3409</td><td>1</td><td>0.5</td><td>1</td><td>0.5</td><td>0.5</td><td>1</td><td>0.5</td><td>1</td><td>1</td><td>1</td><td>8</td><td>9.08</td><td>None</td><td>Background color does not change across trials.Pipes do not touch the top. No land is seen.</td></tr><tr><td>Basic</td><td>IQ1_M</td><td>149</td><td>3407</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>2</td><td></td><td>if game_over: NameError: name 'game_over' is not defined</td><td>Fully failed. Black screen only</td></tr><tr><td>Basic</td><td>IQ1_M</td><td>149</td><td>3408</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>2</td><td></td><td>No code</td><td>Fully failed. Black screen then closes.</td></tr><tr><td>Basic</td><td>IQ1_M</td><td>149</td><td>3409</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1.67</td><td>window.fill((100, 100, 255)) Light Blue SyntaxError: invalid syntax &#x26;&#x26; main() NameError: name 'main' is not defined.</td><td>Fully failed.</td></tr></tbody></table>

### 2-bit (Extra extra Small) - Dynamic vs. Basic

<table data-full-width="true"><thead><tr><th>GGUF Type</th><th>Quant</th><th>Size (GB)</th><th>Seed</th><th>Pygame</th><th>Background</th><th>Accelerate SPACE</th><th>Bird shape</th><th>Land</th><th>Top right score</th><th>Pipes</th><th>Best Score</th><th>Quit</th><th>Runnable</th><th>Score</th><th>Avg Score</th><th width="330">Errors</th><th width="260">Notes</th><th></th></tr></thead><tbody><tr><td>Dynamic</td><td>IQ2_XXS</td><td>183</td><td>3407</td><td>1</td><td>1</td><td>0.5</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>9.5</td><td></td><td>None</td><td>Too hard to play - acceleration too slow. Lags</td><td></td></tr><tr><td>Dynamic</td><td>IQ2_XXS</td><td>183</td><td>3408</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0.5</td><td>0.5</td><td>1</td><td>0</td><td>8</td><td></td><td>global best_score SyntaxError: name 'best_score' is assigned to before global declaration</td><td>Had to edit 2 lines - remove global best_score, and set pipe_list = []</td><td></td></tr><tr><td>Dynamic</td><td>IQ2_XXS</td><td>183</td><td>3409</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>10</td><td>9.17</td><td>None</td><td>Extremely good. Even makes pipes have random distances between them.</td><td></td></tr><tr><td>Basic</td><td>IQ2_XXS</td><td>175</td><td>3407</td><td>1</td><td>0.5</td><td>0.5</td><td>0.5</td><td>1</td><td>0</td><td>0.5</td><td>1</td><td>0</td><td>0</td><td>5</td><td></td><td>pipe_color = random.choice([(34, 139, 34), (139, 69, 19), (47, 47, 47)) SyntaxError: closing parenthesis ')' does not match opening parenthesis '[' &#x26;&#x26; pygame.draw.polygon(screen, bird_color, points) ValueError: points argument must contain more than 2 points</td><td>Fails quiting. Same color. Collison detection a bit off. No score</td><td></td></tr><tr><td>Basic</td><td>IQ2_XXS</td><td>175</td><td>3408</td><td>1</td><td>0.5</td><td>0.5</td><td>0.5</td><td>1</td><td>1</td><td>0.5</td><td>1</td><td>0</td><td>0</td><td>6</td><td></td><td>pipes.append({'x': SCREEN_WIDTH, 'gap_y': random.randint(50, SCREEN_HEIGHT - 150)) SyntaxError: closing parenthesis ')' does not match opening parenthesis '{'</td><td>Acceleration weird. Chooses 1 color per round. Cannot quit.</td><td></td></tr><tr><td>Basic</td><td>IQ2_XXS</td><td>175</td><td>3409</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0.5</td><td>0</td><td>7.5</td><td>6.17</td><td>screen = pygame.display.set_mode((SCREEN_WIDTH, SCREENHEIGHT)) NameError: name 'SCREENHEIGHT' is not defined. Did you mean: 'SCREEN_HEIGHT'?</td><td>OK. Colors change. Best score does not update. Quit only ESC not Q.</td><td></td></tr></tbody></table>

### **Dynamic Quantization trial output**

{% tabs %}
{% tab title="IQ1\_S code" %}
{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-beb701ccc988c3b1d530ce68094b0f61e7def5cc%2Finference_UD-IQ1_S_3407.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-dfdc0a1a11e0dcaa1604db63c2147fca7d29544a%2Finference_UD-IQ1_S_3408.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-872d28ea89af0df414cb8c705f8d5fa6f0fe6534%2Finference_UD-IQ1_S_3409.txt?alt=media>" %}
{% endtab %}

{% tab title="IQ1\_M code" %}
{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-32f56cd61af4cbac88aa2d0cf89414f3f89a0456%2Finference_UD-IQ1_M_3407.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-334b6d163c373dfac13231acfa11d30ad30c1379%2Finference_UD-IQ1_M_3408.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ede543f0f735485de1732dba4e9c1a7e550f5f64%2Finference_UD-IQ1_M_3409.txt?alt=media>" %}
{% endtab %}

{% tab title="IQ2\_XXS code" %}
{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7f5c8800c81d8a694a7630e15e73335cf63483a0%2Finference_UD-IQ2_XXS_3407.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3dda0b3a4b25962b55c0b0e7b559012cd23e3457%2Finference_UD-IQ2_XXS_3408.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-82a0bbb94a39696d4e91d3d32297524e16199c99%2Finference_UD-IQ2_XXS_3409.txt?alt=media>" %}
{% endtab %}
{% endtabs %}

### Non Dynamic Quantization trial output

{% tabs %}
{% tab title="IQ1\_S basic code" %}
{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3ae0d632651e9652db82e8d7b387f8ffe91fda55%2Finference_basic-IQ1_S_3407.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-007f99db2c8954aa98455bf7e747fb6775475c5c%2Finference_basic-IQ1_S_3408.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5e1b53763c5a2c3ef65ee30dd4bffb2e2d9661e1%2Finference_basic-IQ1_S_3409.txt?alt=media>" %}
{% endtab %}

{% tab title="IQ1\_M basic code" %}
{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3ef0837798beb6600cd5bfb4f2cde778e7ea02a2%2Finference_basic-IQ1_M_3407.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-783ed287466d8b804b60d9129ef3e5ba6434289b%2Finference_basic-IQ1_M_3408.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-adfc8ee11d3085fa641579792cdfe8d6a377e375%2Finference_basic-IQ1_M_3409.txt?alt=media>" %}
{% endtab %}

{% tab title="IQ2\_XXS basic code" %}
{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-297addb7c2ea107a17d7157cd3e2a411f4cb2973%2Finference_basic-IQ2_XXS_3407.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-fd46e1473f114c1551f792ce40b905b0537a78f8%2Finference_basic-IQ2_XXS_3408.txt?alt=media>" %}

{% file src="<https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-82c8735648246c171993594af19f550395b211b4%2Finference_basic-IQ2_XXS_3409.txt?alt=media>" %}
{% endtab %}
{% endtabs %}

---

## DeepSeek-R1: How to Run Locally

**URL:** llms-txt#deepseek-r1:-how-to-run-locally

**Contents:**
- Using llama.cpp (recommended)

A guide on how you can run our 1.58-bit Dynamic Quants for DeepSeek-R1 using llama.cpp.

{% hint style="success" %}
Please see <https://docs.unsloth.ai/basics/deepseek-r1-0528-how-to-run-locally> for an updated DeepSeek R1-0528 (May 28th 2025 version)
{% endhint %}

## Using llama.cpp (recommended)

1. Do not forget about `<｜User｜>` and `<｜Assistant｜>` tokens! - Or use a chat template formatter
2. Obtain the latest `llama.cpp` at: [github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp). You can follow the build instructions below as well:

3. It's best to use `--min-p 0.05` to counteract very rare token predictions - I found this to work well especially for the 1.58bit model.
4. Download the model via:

**Examples:**

Example 1 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggerganov/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=ON -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
```

---

## DeepSeek-V3.1: How to Run Locally

**URL:** llms-txt#deepseek-v3.1:-how-to-run-locally

**Contents:**
- :gear: Recommended Settings
- :butterfly:Chat template bug fixes
  - 🐳Official Recommended Settings
- :arrow\_forward:Run DeepSeek-V3.1 Tutorials:
  - :llama: Run in Ollama/Open WebUI
  - ✨ Run in llama.cpp

A guide on how to run DeepSeek-V3.1 and Terminus on your own local device!

DeepSeek’s V3.1 and **Terminus** update introduces hybrid reasoning inference, combining 'think' and 'non-think' into one model. The full 671B parameter model requires 715GB of disk space. The quantized dynamic 2-bit version uses 245GB (-75% reduction in size). GGUF: [**DeepSeek-V3.1-GGUF**](https://huggingface.co/unsloth/DeepSeek-V3.1-GGUF)

{% hint style="success" %}
**NEW:** DeepSeek-V3.1-Terminus out now: [DeepSeek-V3.1-Terminus-GGUF](https://huggingface.co/unsloth/DeepSeek-V3.1-Terminus-GGUF)\
\
[**Sept 10, 2025 update:**](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot) You asked for tougher benchmarks, so we’re showcasing Aider Polyglot results! Our Dynamic 3-bit DeepSeek V3.1 GGUF scores **75.6%**, surpassing many full-precision SOTA LLMs. [Read more.](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot)

Our DeepSeek-V3.1 GGUFs include Unsloth [chat template fixes](#chat-template-bug-fixes) for llama.cpp supported backends.
{% endhint %}

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and KL Divergence performance, meaning you can run & fine-tune quantized DeepSeek LLMs with minimal accuracy loss.

**Tutorials navigation:**

<a href="#run-in-llama.cpp" class="button secondary">Run in llama.cpp</a><a href="#run-in-ollama-open-webui" class="button secondary">Run in Ollama/Open WebUI</a>

## :gear: Recommended Settings

The 1-bit dynamic quant TQ1\_0 (1bit for unimportant MoE layers, 2-4bit for important MoE, and 6-8bit for rest) uses 170GB of disk space - this works well in a **1x24GB card and 128GB of RAM** with MoE offloading - it also **works natively in Ollama**!

{% hint style="info" %}
You must use `--jinja` for llama.cpp quants - this uses our [fixed chat templates](#chat-template-bug-fixes) and enables the correct template! You might get incorrect results if you do not use `--jinja`
{% endhint %}

The 2-bit quants will fit in a 1x 24GB GPU (with MoE layers offloaded to RAM). Expect around 5 tokens/s with this setup if you have bonus 128GB RAM as well. It is recommended to have at least 226GB RAM to run this 2-bit. For optimal performance you will need at least 226GB unified memory or 226GB combined RAM+VRAM for 5+ tokens/s. To learn how to increase generation speed and fit longer contexts, [read here](#improving-generation-speed).

{% hint style="success" %}
Though not a must, for best performance, have your VRAM + RAM combined equal to the size of the quant you're downloading. If not, hard drive / SSD offloading will work with llama.cpp, just inference will be slower.
{% endhint %}

## :butterfly:Chat template bug fixes

We fixed a few issues with DeepSeek V3.1's chat template since they did not function correctly in llama.cpp and other engines:

1. DeepSeek V3.1 is a hybrid reasoning model, meaning you can change the chat template to enable reasoning. The chat template introduced `thinking = True` , but other models use `enable_thinking = True` . We added the option to use `enable_thinking` as a keyword instead.
2. llama.cpp's jinja renderer via [minja](https://github.com/google/minja) does not allow the use of extra arguments in the `.split()` command, so using `.split(text, 1)` works in Python, but not in minja. We had to change this to make llama.cpp function correctly without erroring out.\
   \
   You will get the following error when using other quants:\
   `terminate called after throwing an instance of 'std::runtime_error' what(): split method must have between 1 and 1 positional arguments and between 0 and 0 keyword arguments at row 3, column 1908` We fixed it in all our quants!

### 🐳Official Recommended Settings

According to [DeepSeek](https://huggingface.co/deepseek-ai/DeepSeek-V3.1), these are the recommended settings for V3.1 inference:

* Set the <mark style="background-color:green;">**temperature 0.6**</mark> to reduce repetition and incoherence.
* Set <mark style="background-color:green;">**top\_p to 0.95**</mark> (recommended)
* **128K context length** or less
* Use `--jinja` for llama.cpp variants - we **fixed some chat template issues as well!**
* **Use** `enable_thinking = True` to use reasoning/ thinking mode. By default it's set to non reasoning.

#### :1234: Chat template/prompt format

You do not need to force `<think>\n` , but you can still add it in! With the given prefix, DeepSeek V3.1 generates responses to queries in non-thinking mode. Unlike DeepSeek V3, it introduces an additional token `</think>`.

A BOS is forcibly added, and an EOS separates each interaction. To counteract double BOS tokens during inference, you should only call `tokenizer.encode(..., add_special_tokens = False)` since the chat template auto adds a BOS token as well. For llama.cpp / GGUF inference, you should skip the BOS since it’ll auto add it.

#### :notebook\_with\_decorative\_cover: Non-Thinking Mode (use `thinking = False`or `enable_thinking = False` and is by default)

Prefix: `<｜begin▁of▁sentence｜>{system prompt}<｜User｜>{query}<｜Assistant｜></think>`

With the given prefix, DeepSeek V3.1 generates responses to queries in non-thinking mode. Unlike DeepSeek V3, it introduces an additional token `</think>`.

Context: `<｜begin▁of▁sentence｜>{system prompt}<｜User｜>{query}<｜Assistant｜></think>{response}<｜end▁of▁sentence｜>...<｜User｜>{query}<｜Assistant｜></think>{response}<｜end▁of▁sentence｜>`

Prefix: `<｜User｜>{query}<｜Assistant｜></think>`

By concatenating the context and the prefix, we obtain the correct prompt for the query.

#### :books: Thinking Mode (use `thinking = True`or `enable_thinking = True` and is by default)

Prefix: `<｜begin▁of▁sentence｜>{system prompt}<｜User｜>{query}<｜Assistant｜><think>`

The prefix of thinking mode is similar to DeepSeek-R1.

Context: `<｜begin▁of▁sentence｜>{system prompt}<｜User｜>{query}<｜Assistant｜></think>{response}<｜end▁of▁sentence｜>...<｜User｜>{query}<｜Assistant｜></think>{response}<｜end▁of▁sentence｜>`

Prefix: `<｜User｜>{query}<｜Assistant｜><think>`

The multi-turn template is the same with non-thinking multi-turn chat template. It means the thinking token in the last turn will be dropped but the `</think>` is retained in every turn of context.

#### :bow\_and\_arrow: Tool Calling

Tool calling is supported in non-thinking mode. The format is:

`<｜begin▁of▁sentence｜>{system prompt}{tool_description}<｜User｜>{query}<｜Assistant｜></think>` where we populate the tool\_description is area after the system prompt.

## :arrow\_forward:Run DeepSeek-V3.1 Tutorials:

### :llama: Run in Ollama/Open WebUI

{% stepper %}
{% step %}
Install `ollama` if you haven't already! To run more variants of the model, [see here](#run-in-llama.cpp).

{% step %}
Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload!\
\&#xNAN;**(NEW) To run the full R1-0528 model in Ollama, you can use our TQ1\_0 (170GB quant):**

{% step %}
To run other quants, you need to first merge the GGUF split files into 1 like the code below. Then you will need to run the model locally.

{% step %}
Open WebUI also made a [step-by-step tutorial](https://docs.openwebui.com/tutorials/integrations/deepseekr1-dynamic/) on how to run R1 and for V3.1, you will just need to replace R1 with the new V3.1 quant.
{% endstep %}
{% endstepper %}

### ✨ Run in llama.cpp

{% stepper %}
{% step %}
Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% step %}
If you want to use `llama.cpp` directly to load models, you can do the below: (:Q2\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location. Remember the model has only a maximum of 128K context length.

{% hint style="success" %}
Please try out `-ot ".ffn_.*_exps.=CPU"` to offload all MoE layers to the CPU! This effectively allows you to fit all non MoE layers on 1 GPU, improving generation speeds. You can customize the regex expression to fit more layers if you have more GPU capacity.

If you have a bit more GPU memory, try `-ot ".ffn_(up|down)_exps.=CPU"` This offloads up and down projection MoE layers.

Try `-ot ".ffn_(up)_exps.=CPU"` if you have even more GPU memory. This offloads only up projection MoE layers.

And finally offload all layers via `-ot ".ffn_.*_exps.=CPU"` This uses the least VRAM.

You can also customize the regex, for example `-ot "\.(6|7|8|9|[0-9][0-9]|[0-9][0-9][0-9])\.ffn_(gate|up|down)_exps.=CPU"` means to offload gate, up and down MoE layers but only from the 6th layer onwards.
{% endhint %}

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-`Q2\_K\_XL (dynamic 2bit quant) or other quantized versions like `Q4_K_M` . We <mark style="background-color:green;">**recommend using our 2.7bit dynamic quant**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`UD-Q2_K_XL`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**to balance size and accuracy**</mark>.

**Examples:**

Example 1 (unknown):
```unknown
<｜begin▁of▁sentence｜>{system prompt}<｜User｜>{query}<｜Assistant｜></think>
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 3 (unknown):
```unknown
OLLAMA_MODELS=unsloth ollama serve &

OLLAMA_MODELS=unsloth ollama run hf.co/unsloth/DeepSeek-V3.1-Terminus-GGUF:TQ1_0
```

Example 4 (bash):
```bash
./llama.cpp/llama-gguf-split --merge \
  DeepSeek-V3.1-Terminus-GGUF/DeepSeek-V3.1-Terminus-UD-Q2_K_XL/DeepSeek-V3.1-Terminus-UD-Q2_K_XL-00001-of-00006.gguf \
	merged_file.gguf
```

---

## DeepSeek-V3-0324: How to Run Locally

**URL:** llms-txt#deepseek-v3-0324:-how-to-run-locally

**Contents:**
- :gear: Official Recommended Settings
- 📖 Tutorial: How to Run DeepSeek-V3 in llama.cpp

How to run DeepSeek-V3-0324 locally using our dynamic quants which recovers accuracy

{% hint style="info" %}
Please see <https://docs.unsloth.ai/basics/deepseek-r1-0528-how-to-run-locally> (May 28th 2025 update) to learn on how to run DeepSeek faster and more efficiently!
{% endhint %}

DeepSeek is at it again! After releasing V3, R1 Zero and R1 back in December 2024 and January 2025, DeepSeek updated their checkpoints / models for V3, and released a March update!

According to DeepSeek, MMLU-Pro jumped +5.3% to 81.2%. **GPQA +9.3% points**. AIME + 19.8% and LiveCodeBench + 10.0%! They provided a plot showing how they compared to the previous V3 checkpoint and other models like GPT 4.5 and Claude Sonnet 3.7. <mark style="background-color:blue;">**But how do we run a 671 billion parameter model locally?**</mark>

<table data-full-width="true"><thead><tr><th>MoE Bits</th><th>Type</th><th>Disk Size</th><th>Accuracy</th><th>Link</th><th>Details</th></tr></thead><tbody><tr><td>1.78bit</td><td>IQ1_S</td><td><strong>173GB</strong></td><td>Ok</td><td><a href="https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF/tree/main/UD-IQ1_S">Link</a></td><td>2.06/1.56bit</td></tr><tr><td>1.93bit</td><td>IQ1_M</td><td><strong>183GB</strong></td><td>Fair</td><td><a href="https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF/tree/main/UD-IQ1_M">Link</a></td><td>2.5/2.06/1.56</td></tr><tr><td>2.42bit</td><td>IQ2_XXS</td><td><strong>203GB</strong></td><td><mark style="background-color:blue;"><strong>Suggested</strong></mark></td><td><a href="https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF/tree/main/UD-IQ2_XXS">Link</a></td><td>2.5/2.06bit</td></tr><tr><td>2.71bit</td><td>Q2_K_XL</td><td><strong>231GB</strong></td><td><mark style="background-color:purple;"><strong>Suggested</strong></mark></td><td><a href="https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF/tree/main/UD-Q2_K_XL">Link</a></td><td>3.5/2.5bit</td></tr><tr><td>3.5bit</td><td>Q3_K_XL</td><td><strong>320GB</strong></td><td>Great</td><td><a href="https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF/tree/main/UD-Q3_K_XL">Link</a></td><td>4.5/3.5bit</td></tr><tr><td>4.5bit</td><td>Q4_K_XL</td><td><strong>406GB</strong></td><td>Best</td><td><a href="https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF/tree/main/UD-Q4_K_XL">Link</a></td><td>5.5/4.5bit</td></tr></tbody></table>

{% hint style="success" %}
DeepSeek V3's original upload is in float8, which takes 715GB. Using Q4\_K\_M halves the file size to 404GB or so, and our dynamic 1.78bit quant fits in around 151GB. **We suggest using our 2.7bit quant to balance size and accuracy! The 2.4bit one also works well!**
{% endhint %}

## :gear: Official Recommended Settings

According to [DeepSeek](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324), these are the recommended settings for inference:

* <mark style="background-color:blue;">**Temperature of 0.3**</mark> (Maybe 0.0 for coding as [seen here](https://api-docs.deepseek.com/quick_start/parameter_settings))
* Min\_P of 0.00 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Chat template: `<｜User｜>Create a simple playable Flappy Bird Game in Python. Place the final game inside of a markdown section.<｜Assistant｜>`
* A BOS token of `<｜begin▁of▁sentence｜>` is auto added during tokenization (do NOT add it manually!)
* DeepSeek mentioned using a <mark style="background-color:green;">**system prompt**</mark> as well (optional) - it's in Chinese: `该助手为DeepSeek Chat，由深度求索公司创造。\n今天是3月24日，星期一。` which translates to: `The assistant is DeepSeek Chat, created by DeepSeek.\nToday is Monday, March 24th.`
* <mark style="background-color:orange;">**For KV cache quantization, use 8bit, NOT 4bit - we found it to do noticeably worse.**</mark>

## 📖 Tutorial: How to Run DeepSeek-V3 in llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% hint style="warning" %}
NOTE using `-DGGML_CUDA=ON` for GPUs might take 5 minutes to compile. CPU only takes 1 minute to compile. You might be interested in llama.cpp's precompiled binaries.
{% endhint %}

2. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-IQ1_S`(dynamic 1.78bit quant) or other quantized versions like `Q4_K_M` . <mark style="background-color:green;">**I recommend using our 2.7bit dynamic quant**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`UD-Q2_K_XL`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**to balance size and accuracy**</mark>. More versions at: <https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF>

{% code overflow="wrap" %}

**Examples:**

Example 1 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
```

---

## Define the system prompt that instructs the model to use a specific format

**URL:** llms-txt#define-the-system-prompt-that-instructs-the-model-to-use-a-specific-format

SYSTEM_PROMPT = """
Respond in the following format:
<reasoning>
...
</reasoning>
<answer>
...
</answer>
"""

XML_COT_FORMAT = """\
<reasoning>
{reasoning}
</reasoning>
<answer>
{answer}
</answer>
"""

import re
from datasets import load_dataset, Dataset

**Examples:**

Example 1 (unknown):
```unknown
Now, to prepare the dataset:
```

---

## Devstral 2 - How to Run Guide

**URL:** llms-txt#devstral-2---how-to-run-guide

**Contents:**
- 🖥️ **Running Devstral 2**
  - :gear: Usage Guide
  - :tophat:Devstral-Small-2-24B

Guide for local running Mistral Devstral 2 models: 123B-Instruct-2512 and Small-2-24B-Instruct-2512.

Devstral 2 are Mistral’s new coding and agentic LLMs for software engineering, available in [24B](#devstral-small-2-24b) and [123B](#devstral-2-123b) sizes. The 123B model achieves SOTA in SWE-bench, coding, tool-calling and agent use-cases. The 24B model fits in 25GB RAM/VRAM and 123B fits in 128GB.

{% hint style="success" %}
**13th December 2025 Update**

**We’ve resolved issues in Devstral’s chat template, and results should be significantly better. The 24B & 123B have been updated. Also install the latest llama.cpp as at 13th Dec 2025!**
{% endhint %}

Devstral 2 supports vision capabilities, a 256k context window and uses the same architecture as [Ministral 3](https://docs.unsloth.ai/models/ministral-3). You can now run and **fine-tune** both models locally with Unsloth.

All Devstral 2 uploads use our Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) methodology, delivering the best performance on [Aider Polyglot](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot) and 5-shot MMLU benchmarks.

<a href="#devstral-small-2-24b" class="button primary">Devstral-Small-2-24B</a><a href="#devstral-2-123b" class="button primary">Devstral-2-123B</a>

#### **Devstral 2 - Unsloth Dynamic** GGUFs:

| Devstral-Small-2-24B-Instruct-2512                                                                                    | Devstral-2-123B-Instruct-2512                                                                               |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Devstral-Small-2-**24B**-Instruct-2512-GGUF](https://huggingface.co/unsloth/Devstral-Small-2-24B-Instruct-2512-GGUF) | [Devstral-2-**123B**-Instruct-2512-GGUF](https://huggingface.co/unsloth/Devstral-2-123B-Instruct-2512-GGUF) |

## 🖥️ **Running Devstral 2**

See our step-by-step guides for running [Devstral 24B](#devstral-small-2-24b) and the large [Devstral 123B](#devstral-2-123b) models. Both models support vision support but currently **vision is not supported** in llama.cpp

### :gear: Usage Guide

Here are the recommended settings for inference:

* <mark style="background-color:blue;">**Temperature \~0.15**</mark>
* Min\_P of 0.01 (optional, but 0.01 works well, llama.cpp default is 0.1)
* **Use `--jinja` to enable the system prompt.**
* Max context length = 262,144
* Recommended minimum context: 16,384
* Install the latest llama.cpp since a [December 13th 2025 pull request](https://github.com/ggml-org/llama.cpp/pull/17945) fixes issues.

### :tophat:Devstral-Small-2-24B

The full precision (Q8) Devstral-Small-2-24B GGUF will fit in 25GB RAM/VRAM. Text only for now.

#### ✨ Run Devstral-Small-2-24B-Instruct-2512 in llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% code overflow="wrap" %}

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:`Q4_K_XL`) is the quantization type. You can also directly pull from Hugging Face:

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD_Q4_K_XL` or other quantized versions.

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
./llama.cpp/llama-mtmd-cli \
    -hf unsloth/Devstral-Small-2-24B-Instruct-2512-GGUF:UD-Q4_K_XL \
    --jinja -ngl 99 --threads -1 --ctx-size 16384 \
    --temp 0.15
```

---

## Download model config from ExecuTorch repo

**URL:** llms-txt#download-model-config-from-executorch-repo

curl -L -o 0.6B_config.json https://raw.githubusercontent.com/pytorch/executorch/main/examples/models/qwen3/config/0_6b_config.json

---

## Export to ExecuTorch pte file

**URL:** llms-txt#export-to-executorch-pte-file

**Contents:**
  - 🏁 Deployment After Training
- <i class="fa-apple">:apple:</i> iOS Deployment
  - macOS Development Environment Setup
  - Apple Developer Account Setup
  - Setup the ExecuTorch Demo App

python -m executorch.examples.models.llama.export_llama \
    --model "qwen3_0_6b" \
    --checkpoint pytorch_model_converted.bin \
    --params 0.6B_config.json \
    --output_name qwen3_0.6B_model.pte \
    -kv --use_sdpa_with_kv_cache -X --xnnpack-extended-ops \
    --max_context_length 1024 --max_seq_length 128 --dtype fp32 \
    --metadata '{"get_bos_id":199999, "get_eos_ids":[200020,199999]}'
bash

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

### 🏁 Deployment After Training

And now with your `qwen3_0.6B_model.pte` file which is around 472MB in size, we can deploy it! Pick your device and jump straight in:

* [#ios-deployment](#ios-deployment "mention") – Xcode route, simulator or device
* [#android-deployment](#android-deployment "mention") – command-line route, no Studio required

## <i class="fa-apple">:apple:</i> iOS Deployment

Tutorial to get your model running on iOS (tested on an iPhone 16 Pro but will work for other iPhones too). You will need a physical macOS based device which must be capable of running XCode 15.

### macOS Development Environment Setup

**Install Xcode & Command Line Tools**

1. Install Xcode from the Mac App Store (must be version 15 or later)
2. Open Terminal and verify your installation: `xcode-select -p`
3. Install command line tools and accept the license:&#x20;
   1. `xcode-select --install`
   2. `sudo xcodebuild -license accept`
4. Launch Xcode for the first time and install any additional components when prompted
5. If asked to select platforms, choose iOS 18 and download it for simulator access

{% hint style="warning" %}
Important: The first Xcode launch is crucial! Don't skip those extra component installations! Check [here](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components) and [here](https://developer.apple.com/documentation/safari-developer-tools/adding-additional-simulators) for additional help.
{% endhint %}

**Verify Everything Works:**  `xcode-select -p`

You should see a path printed. If not, repeat step 3.

![](https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FJii1jArd6GQrdaCMHvyR%2Funknown.png?alt=media\&token=bd8b7a75-23e3-4474-b84b-ab9ad34cc401)

### Apple Developer Account Setup

**For Physical devices only!**

{% hint style="info" %}
Skip this entire section if you're only using the iOS Simulator. You only need a paid developer account for deployment to a physical iPhone.
{% endhint %}

{% columns %}
{% column %}
**Create Your Apple ID**

Don't have an Apple ID?[ Sign up here](https://support.apple.com/en-us/108647?device-type=iphone).

#### **Add Your Account to Xcode**

1. Open Xcode
2. Navigate to Xcode → Settings → Accounts
3. Click the + button and select Apple ID
4. Sign in with your regular Apple ID
   {% endcolumn %}

{% column %}

<div align="left"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FxG5ifHNeI6xKWqHw1pxL%2Funknown.png?alt=media&#x26;token=875fb5e4-e5f3-4c88-9af6-cb4e587975ca" alt="" width="563"><figcaption></figcaption></figure></div>
{% endcolumn %}
{% endcolumns %}

#### **Enroll in the Apple Developer Program**

ExecuTorch requires the `increased-memory-limit capability`, which needs a paid developer account:

1. Visit[ developer.apple.com](https://developer.apple.com)
2. Sign in with your Apple ID
3. Enroll in the Apple Developer Program

### Setup the ExecuTorch Demo App

**Grab the Example Code:**
```

---

## Find the simulator's hidden folder

**URL:** llms-txt#find-the-simulator's-hidden-folder

**Contents:**
  - Deploying to Your Physical iPhone
- <i class="fa-android">:android:</i> Android Deployment
  - 🚀 Requirements

find ~/Library/Developer/CoreSimulator/Devices/ -type d -iname "*Qwen3test*"
bash
cp tokenizer.json /path/to/Qwen3test/tokenizer.json
cp qwen3_0.6B_model.pte /path/to/Qwen3test/qwen3_model.pte
bash

**Examples:**

Example 1 (unknown):
```unknown
When you see the folder run the following:
```

Example 2 (unknown):
```unknown
**Load & Chat**

{% columns %}
{% column %}

1. Return to the etLLM app in the simulator. Tap it to launch.

<div align="left"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F55YWFJN49DCiHsy9EKOA%2Funknown.png?alt=media&#x26;token=4f8c8e90-df0b-4121-99eb-24437580724b" alt="" width="375"><figcaption></figcaption></figure></div>
{% endcolumn %}

{% column %}
2\. Load the model and tokenizer from the Qwen3test folder

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FpwUCX0nfarr6HSUd0pd3%2Funknown.png?alt=media&#x26;token=923b6ad3-d6e6-4e64-8223-947410c2218e" alt="" width="188"><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
3\. Start chatting with your fine-tuned model! 🎉

<div align="left"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FJrEzy1bvVeb4qLFxPFit%2Funknown.png?alt=media&#x26;token=36b7c70b-f014-4323-bdc5-cc5bf0fd12af" alt="" width="188"><figcaption></figcaption></figure></div>
{% endcolumn %}
{% endcolumns %}

### Deploying to Your Physical iPhone

**Initial Device Setup**

1. Connect your iPhone to your Mac via USB
2. Unlock your iPhone and tap "Trust This Device"
3. In Xcode, go to Window → Devices and Simulators
4. Wait until your device appears on the left (it may show "Preparing" for a bit)

**Configure Xcode Signing**

{% columns %}
{% column %}

1. Add your Apple Account: Xcode → Settings → Accounts → `+`
2. In the project navigator, click the etLLM project (blue icon)
3. Select etLLM under TARGETS
4. Go to the Signing & Capabilities tab
5. Check "Automatically manage signing"
6. Select your Team from the dropdown
   {% endcolumn %}

{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FFm4a47e9Wuo7JiNbEeYl%2Funknown.png?alt=media&#x26;token=3f958363-6c0d-4608-8895-8376b0e1b1b1" alt="" width="375"><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

{% hint style="warning" %}
Change the Bundle Identifier to something unique (e.g., com.yourname.etLLM). This fixes 99% of provisioning profile errors
{% endhint %}

**Add the Required Capability**

1. Still in Signing & Capabilities, click + Capability
2. Search for "Increased Memory Limit" and add it

**Build & Run**

1. In the top toolbar, select your physical iPhone from the device selector
2. Hit Play (▶️) or press Cmd + R

**Trust the Developer Certificate**

Your first build will fail—this is normal!

1. On your iPhone, go to Settings → Privacy & Security → Developer Mode
2. Toggle On
3. Agree and accept notices
4. Restart device, return to Xcode and hit Play again

{% hint style="warning" %}
Developer Mode allows XCode to run and install apps on your iPhone
{% endhint %}

**Transfer Model Files to Your iPhone**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FqAGQov6BgjlDSqA5GENN%2Funknown.png?alt=media&#x26;token=386b17df-703c-4e2c-9969-895577a98f0a" alt="" width="375"><figcaption></figcaption></figure>

1. Once the app is running, open Finder on your Mac
2. Select your iPhone in the sidebar
3. Click the Files tab
4. Expand etLLM
5. Drag and drop your .pte and tokenizer.json files directly into this folder
6. Be patient! These files are large and may take a few minutes

**Load & Chat**

{% columns %}
{% column %}

1. On your iPhone, switch back to the etLLM app

<div align="center"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FXY4EPFNcxaaBpjVroja3%2Funknown.jpeg?alt=media&#x26;token=7e8eca62-a5de-4705-9f0c-832b40579e78" alt="" width="188"><figcaption></figcaption></figure></div>

2. Load the model and tokenizer from the app interface

<div align="center"><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FUzKWYRNR02vkVn5S3SQ5%2Funknown.jpeg?alt=media&#x26;token=84a85440-bf98-438d-a035-d8a11912a7a8" alt="" width="188"><figcaption></figcaption></figure></div>
{% endcolumn %}

{% column %}
3\. Your fine-tuned Qwen3 is now running natively on your iPhone!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FBX1nCLPbsnuRQchJXyAS%2Funknown.png?alt=media&#x26;token=d276d4d6-2fc7-4cba-87f1-634aaea29884" alt="" width="184"><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

## <i class="fa-android">:android:</i> Android Deployment

This guide covers how to build and install the ExecuTorch Llama demo app on an Android device (tested using Pixel 8 but will also work on other Android phones too) using a Linux/Mac command line environment. This approach minimizes dependencies (no Android Studio required) and offloads the heavy build process to your computer.

### 🚀 Requirements

Ensure your development machine has the following installed:

* Java 17 (Java 21 is often the default but may cause build issues)
* Git
* Wget / Curl
* Android Command Line Tools
* [Guide to install](https://www.xda-developers.com/install-adb-windows-macos-linux/) and setup `adb` on your android and your computer

#### Verification

Check that your Java version matches 17.x:
```

---

## For BF16:

**URL:** llms-txt#for-bf16:

python llama.cpp/convert_hf_to_gguf.py merged_model \
    --outfile model-BF16.gguf --outtype bf16 \
    --split-max-size 50G

---

## From https://mlabonne.github.io/blog/posts/Quantize_Llama_2_models_using_ggml.html

**URL:** llms-txt#from-https://mlabonne.github.io/blog/posts/quantize_llama_2_models_using_ggml.html

**Contents:**
  - Running in Unsloth works well, but after exporting & running on other platforms, the results are poor
  - Saving to GGUF / vLLM 16bit crashes
  - How do I manually save to GGUF?

ALLOWED_QUANTS = \
{
    "not_quantized"  : "Recommended. Fast conversion. Slow inference, big files.",
    "fast_quantized" : "Recommended. Fast conversion. OK inference, OK file size.",
    "quantized"      : "Recommended. Slow conversion. Fast inference, small files.",
    "f32"     : "Not recommended. Retains 100% accuracy, but super slow and memory hungry.",
    "f16"     : "Fastest conversion + retains 100% accuracy. Slow and memory hungry.",
    "q8_0"    : "Fast conversion. High resource use, but generally acceptable.",
    "q4_k_m"  : "Recommended. Uses Q6_K for half of the attention.wv and feed_forward.w2 tensors, else Q4_K",
    "q5_k_m"  : "Recommended. Uses Q6_K for half of the attention.wv and feed_forward.w2 tensors, else Q5_K",
    "q2_k"    : "Uses Q4_K for the attention.vw and feed_forward.w2 tensors, Q2_K for the other tensors.",
    "q3_k_l"  : "Uses Q5_K for the attention.wv, attention.wo, and feed_forward.w2 tensors, else Q3_K",
    "q3_k_m"  : "Uses Q4_K for the attention.wv, attention.wo, and feed_forward.w2 tensors, else Q3_K",
    "q3_k_s"  : "Uses Q3_K for all tensors",
    "q4_0"    : "Original quant method, 4-bit.",
    "q4_1"    : "Higher accuracy than q4_0 but not as high as q5_0. However has quicker inference than q5 models.",
    "q4_k_s"  : "Uses Q4_K for all tensors",
    "q4_k"    : "alias for q4_k_m",
    "q5_k"    : "alias for q5_k_m",
    "q5_0"    : "Higher accuracy, higher resource usage and slower inference.",
    "q5_1"    : "Even higher accuracy, resource usage and slower inference.",
    "q5_k_s"  : "Uses Q5_K for all tensors",
    "q6_k"    : "Uses Q8_K for all tensors",
    "iq2_xxs" : "2.06 bpw quantization",
    "iq2_xs"  : "2.31 bpw quantization",
    "iq3_xxs" : "3.06 bpw quantization",
    "q3_k_xs" : "3-bit extra small quantization",
}
python
model.save_pretrained_merged("merged_model", tokenizer, save_method = "merged_16bit",)
bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-mtmd-cli llama-server llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp

python llama.cpp/convert-hf-to-gguf.py FOLDER --outfile OUTPUT --outtype f16
python
model.save_pretrained_merged("merged_model", tokenizer, save_method = "merged_16bit",)
bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-mtmd-cli llama-server llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
bash
python llama.cpp/convert_hf_to_gguf.py merged_model \
    --outfile model-F16.gguf --outtype f16 \
    --split-max-size 50G
bash

**Examples:**

Example 1 (unknown):
```unknown
{% endtab %}

{% tab title="Manual Saving" %}
First save your model to 16bit:
```

Example 2 (unknown):
```unknown
Then use the terminal and do:

{% code overflow="wrap" %}
```

Example 3 (unknown):
```unknown
{% endcode %}

Or follow the steps at <https://rentry.org/llama-cpp-conversions#merging-loras-into-a-model> using the model name "merged\_model" to merge to GGUF.
{% endtab %}
{% endtabs %}

### Running in Unsloth works well, but after exporting & running on other platforms, the results are poor

You might sometimes encounter an issue where your model runs and produces good results on Unsloth, but when you use it on another platform like Ollama or vLLM, the results are poor or you might get gibberish, endless/infinite generations *or* repeated output&#x73;**.**

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

### Saving to GGUF / vLLM 16bit crashes

You can try reducing the maximum GPU usage during saving by changing `maximum_memory_usage`.

The default is `model.save_pretrained(..., maximum_memory_usage = 0.75)`. Reduce it to say 0.5 to use 50% of GPU peak memory or lower. This can reduce OOM crashes during saving.

### How do I manually save to GGUF?

First save your model to 16bit via:
```

Example 4 (unknown):
```unknown
Compile llama.cpp from source like below:

{% code overflow="wrap" %}
```

---

## Gemma 3n: How to Run & Fine-tune

**URL:** llms-txt#gemma-3n:-how-to-run-&-fine-tune

**Contents:**
- 🖥️ Running Gemma 3n
  - :gear: Official Recommended Settings
  - :llama: Tutorial: How to Run Gemma 3n in Ollama
  - 📖 Tutorial: How to Run Gemma 3n in llama.cpp

Run Google's new Gemma 3n locally with Dynamic GGUFs on llama.cpp, Ollama, Open WebUI and fine-tune with Unsloth!

Google’s Gemma 3n multimodal model handles image, audio, video, and text inputs. Available in 2B and 4B sizes, it supports 140 languages for text and multimodal tasks. You can now run and fine-tune **Gemma-3n-E4B** and **E2B** locally using [Unsloth](https://github.com/unslothai/unsloth).

> **Fine-tune Gemma 3n with our** [**free Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Conversational.ipynb)

Gemma 3n has **32K context length**, 30s audio input, OCR, auto speech recognition (ASR), and speech translation via prompts.

<a href="#running-gemma-3n" class="button primary">Running Tutorial</a><a href="#fine-tuning-gemma-3n-with-unsloth" class="button secondary">Fine-tuning Tutorial</a><a href="#fixes-for-gemma-3n" class="button secondary">Fixes + Technical Analysis</a>

**Unsloth Gemma 3n (Instruct) uploads with optimal configs:**

<table><thead><tr><th width="249">Dynamic 2.0 GGUF (text only)</th><th width="285">Dynamic 4-bit Instruct (to fine-tune)</th><th>16-bit Instruct</th></tr></thead><tbody><tr><td><ul><li><a href="https://huggingface.co/unsloth/gemma-3n-E2B-it-GGUF">2B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3n-E4B-it-GGUF">4B</a></li></ul></td><td><ul><li><a href="https://huggingface.co/unsloth/gemma-3n-E2B-it-unsloth-bnb-4bit">2B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3n-E4B-it-unsloth-bnb-4bit">4B</a></li></ul></td><td><ul><li><a href="https://huggingface.co/unsloth/gemma-3n-E2B-it">2B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3n-E4B-it">4B</a></li></ul></td></tr></tbody></table>

**See all our Gemma 3n uploads including base and more formats in** [**our collection here**](https://huggingface.co/collections/unsloth/gemma-3n-685d3874830e49e1c93f9339)**.**

## 🖥️ Running Gemma 3n

Currently Gemma 3n is only supported in **text format** for inference.

{% hint style="info" %}
We’ve [fixed issues](#fixes-for-gemma-3n) with GGUFs not working properly in Ollama only. Please redownload if using Ollama.
{% endhint %}

### :gear: Official Recommended Settings

According to the Gemma team, the official recommended settings for inference:

`temperature = 1.0, top_k = 64, top_p = 0.95, min_p = 0.0`

* Temperature of 1.0
* Top\_K of 64
* Min\_P of 0.00 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Top\_P of 0.95
* Repetition Penalty of 1.0. (1.0 means disabled in llama.cpp and transformers)
* Chat template:

<pre data-overflow="wrap"><code><strong>&#x3C;bos>&#x3C;start_of_turn>user\nHello!&#x3C;end_of_turn>\n&#x3C;start_of_turn>model\nHey there!&#x3C;end_of_turn>\n&#x3C;start_of_turn>user\nWhat is 1+1?&#x3C;end_of_turn>\n&#x3C;start_of_turn>model\n
  </strong></code></pre>
* Chat template with `\n`newlines rendered (except for the last)

{% code overflow="wrap" %}

{% hint style="danger" %}
llama.cpp an other inference engines auto add a \<bos> - DO NOT add TWO \<bos> tokens! You should ignore the \<bos> when prompting the model!
{% endhint %}

### :llama: Tutorial: How to Run Gemma 3n in Ollama

{% hint style="success" %}
Please re download Gemma 3N quants or remove the old ones via Ollama since there are some bug fixes. You can do the below to delete the old file and refresh it:

1. Install `ollama` if you haven't already!

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload!

### 📖 Tutorial: How to Run Gemma 3n in llama.cpp

{% hint style="info" %}
We would first like to thank [Xuan-Son Nguyen](https://x.com/ngxson) from Hugging Face, [Georgi Gerganov](https://x.com/ggerganov) from the llama.cpp team on making Gemma 3N work in llama.cpp!
{% endhint %}

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:Q4\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run`

3. **OR** download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions (like BF16 full precision).

**Examples:**

Example 1 (unknown):
```unknown
<bos><start_of_turn>user
Hello!<end_of_turn>
<start_of_turn>model
Hey there!<end_of_turn>
<start_of_turn>user
What is 1+1?<end_of_turn>
<start_of_turn>model\n
```

Example 2 (unknown):
```unknown
ollama rm hf.co/unsloth/gemma-3n-E4B-it-GGUF:UD-Q4_K_XL

ollama run hf.co/unsloth/gemma-3n-E4B-it-GGUF:UD-Q4_K_XL
```

Example 3 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 4 (bash):
```bash
ollama run hf.co/unsloth/gemma-3n-E4B-it-GGUF:UD-Q4_K_XL
```

---

## Gemma 3 - How to Run Guide

**URL:** llms-txt#gemma-3---how-to-run-guide

**Contents:**
- :gear: Recommended Inference Settings
  - ✨Running Gemma 3 on your phone <a href="#gmail-running-gemma-3-on-your-phone" id="gmail-running-gemma-3-on-your-phone"></a>
- :llama: Tutorial: How to Run Gemma 3 in Ollama
- 📖 Tutorial: How to Run Gemma 3 27B in llama.cpp

How to run Gemma 3 effectively with our GGUFs on llama.cpp, Ollama, Open WebUI and how to fine-tune with Unsloth!

Google releases Gemma 3 with a new 270M model and the previous 1B, 4B, 12B, and 27B sizes. The 270M and 1B are text-only, while larger models handle both text and vision. We provide GGUFs, and a guide of how to run it effectively, and how to finetune & do [RL](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) with Gemma 3!

{% hint style="success" %}
**NEW Aug 14, 2025 Update:** Try our fine-tuning [Gemma 3 (270M) notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(270M\).ipynb) and [GGUFs to run](https://huggingface.co/collections/unsloth/gemma-3-67d12b7e8816ec6efa7e4e5b).

Also see our [Gemma 3n Guide](https://docs.unsloth.ai/models/gemma-3-how-to-run-and-fine-tune/gemma-3n-how-to-run-and-fine-tune).
{% endhint %}

<a href="#gmail-running-gemma-3-on-your-phone" class="button secondary">Running Tutorial</a><a href="#fine-tuning-gemma-3-in-unsloth" class="button secondary">Fine-tuning Tutorial</a>

**Unsloth is the only framework which works in float16 machines for Gemma 3 inference and training.** This means Colab Notebooks with free Tesla T4 GPUs also work!

* Fine-tune Gemma 3 (4B) with vision support using our [free Colab notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision.ipynb)

{% hint style="info" %}
According to the Gemma team, the optimal config for inference is\
`temperature = 1.0, top_k = 64, top_p = 0.95, min_p = 0.0`
{% endhint %}

**Unsloth Gemma 3 uploads with optimal configs:**

| GGUF                                                                                                                                                                                                                                                                                                                                                                                                           | Unsloth Dynamic 4-bit Instruct                                                                                                                                                                                                                                                                                                                                                                                                               | 16-bit Instruct                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://huggingface.co/unsloth/gemma-3-270m-it-GGUF">270M</a> - new</li><li><a href="https://huggingface.co/unsloth/gemma-3-1b-it-GGUF">1B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-4b-it-GGUF">4B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-12b-it-GGUF">12B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-27b-it-GGUF">27B</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/gemma-3-270m-it-unsloth-bnb-4bit">270M</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-1b-it-bnb-4bit">1B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-4b-it-bnb-4bit">4B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-27b-it-unsloth-bnb-4bit">12B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-27b-it-bnb-4bit">27B</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/gemma-3-270m-it">270M</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-1b">1B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-4b">4B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-12b">12B</a></li><li><a href="https://huggingface.co/unsloth/gemma-3-27b">27B</a></li></ul> |

## :gear: Recommended Inference Settings

According to the Gemma team, the official recommended settings for inference is:

* Temperature of 1.0
* Top\_K of 64
* Min\_P of 0.00 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Top\_P of 0.95
* Repetition Penalty of 1.0. (1.0 means disabled in llama.cpp and transformers)
* Chat template:

<pre data-overflow="wrap"><code><strong>&#x3C;bos>&#x3C;start_of_turn>user\nHello!&#x3C;end_of_turn>\n&#x3C;start_of_turn>model\nHey there!&#x3C;end_of_turn>\n&#x3C;start_of_turn>user\nWhat is 1+1?&#x3C;end_of_turn>\n&#x3C;start_of_turn>model\n
  </strong></code></pre>
* Chat template with `\n`newlines rendered (except for the last)

{% code overflow="wrap" %}

{% hint style="danger" %}
llama.cpp an other inference engines auto add a \<bos> - DO NOT add TWO \<bos> tokens! You should ignore the \<bos> when prompting the model!
{% endhint %}

### ✨Running Gemma 3 on your phone <a href="#gmail-running-gemma-3-on-your-phone" id="gmail-running-gemma-3-on-your-phone"></a>

To run the models on your phone, we recommend using any mobile app that can run GGUFs locally on edge devices like phones. After fine-tuning you can export it to GGUF then run it locally on your phone. Ensure your phone has enough RAM/power to process the models as it can overheat so we recommend using Gemma 3 270M or the Gemma 3n models for this use-case. You can try the [open-source project AnythingLLM's](https://github.com/Mintplex-Labs/anything-llm) mobile app which you can download on [Android here](https://play.google.com/store/apps/details?id=com.anythingllm) or [ChatterUI](https://github.com/Vali-98/ChatterUI), which are great apps for running GGUFs on your phone.

{% hint style="success" %}
Remember, you can change the model name 'gemma-3-27b-it-GGUF' to any Gemma model like 'gemma-3-270m-it-GGUF:Q8\_K\_XL' for all the tutorials.
{% endhint %}

## :llama: Tutorial: How to Run Gemma 3 in Ollama

1. Install `ollama` if you haven't already!

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload! You can change the model name 'gemma-3-27b-it-GGUF' to any Gemma model like 'gemma-3-270m-it-GGUF:Q8\_K\_XL'.

## 📖 Tutorial: How to Run Gemma 3 27B in llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:Q4\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run`

3. **OR** download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions (like BF16 full precision). More versions at: <https://huggingface.co/unsloth/gemma-3-27b-it-GGUF>

**Examples:**

Example 1 (unknown):
```unknown
<bos><start_of_turn>user
Hello!<end_of_turn>
<start_of_turn>model
Hey there!<end_of_turn>
<start_of_turn>user
What is 1+1?<end_of_turn>
<start_of_turn>model\n
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 3 (bash):
```bash
ollama run hf.co/unsloth/gemma-3-27b-it-GGUF:Q4_K_XL
```

Example 4 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggerganov/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=ON -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli
cp llama.cpp/build/bin/llama-* llama.cpp
```

---

## Grok 2

**URL:** llms-txt#grok-2

**Contents:**
- :gear: Recommended Settings
  - Sampling parameters
- Run Grok 2 Tutorial:
  - ✨ Run in llama.cpp

Run xAI's Grok 2 model locally!

You can now run **Grok 2** (aka Grok 2.5), the 270B parameter model by xAI. Full precision requires **539GB**, while the Unsloth Dynamic 3-bit version shrinks size down to just **118GB** (a 75% reduction). GGUF: [Grok-2-GGUF](https://huggingface.co/unsloth/grok-2-GGUF)

The **3-bit Q3\_K\_XL** model runs on a single **128GB Mac** or **24GB VRAM + 128GB RAM**, achieving **5+ tokens/s** inference. Thanks to the llama.cpp team and community for [supporting Grok 2](https://github.com/ggml-org/llama.cpp/pull/15539) and making this possible. We were also glad to have helped a little along the way!

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and KL Divergence performance, meaning you can run quantized Grok LLMs with minimal accuracy loss.

<a href="#run-in-llama.cpp" class="button secondary">Run in llama.cpp Tutorial</a>

## :gear: Recommended Settings

The 3-bit dynamic quant uses 118GB (126GiB) of disk space - this works well in a 128GB RAM unified memory Mac or on a 1x24GB card and 128GB of RAM. It is recommended to have at least 120GB RAM to run this 3-bit quant.

{% hint style="warning" %}
You must use `--jinja` for Grok 2. You might get incorrect results if you do not use `--jinja`
{% endhint %}

The 8-bit quant is \~300GB in size will fit in a 1x 80GB GPU (with MoE layers offloaded to RAM). Expect around 5 tokens/s with this setup if you have bonus 200GB RAM as well. To learn how to increase generation speed and fit longer contexts, [read here](#improving-generation-speed).

{% hint style="info" %}
Though not a must, for best performance, have your VRAM + RAM combined equal to the size of the quant you're downloading. If not, hard drive / SSD offloading will work with llama.cpp, just inference will be slower.
{% endhint %}

### Sampling parameters

* Grok 2 has a 128K max context length thus, use `131,072` context or less.
* Use `--jinja` for llama.cpp variants

There are no official sampling parameters to run the model, thus you can use standard defaults for most models:

* Set the <mark style="background-color:green;">**temperature = 1.0**</mark>
* <mark style="background-color:green;">**Min\_P = 0.01**</mark> (optional, but 0.01 works well, llama.cpp default is 0.1)

## Run Grok 2 Tutorial:

Currently you can only run Grok 2 in llama.cpp.

### ✨ Run in llama.cpp

{% stepper %}
{% step %}
Install the specific `llama.cpp` PR for Grok 2 on [GitHub here](https://github.com/ggml-org/llama.cpp/pull/15539). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% step %}
If you want to use `llama.cpp` directly to load models, you can do the below: (:Q3\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run` . Use `export LLAMA_CACHE="folder"` to force `llama.cpp` to save to a specific location. Remember the model has only a maximum of 128K context length.

{% hint style="info" %}
Please try out `-ot ".ffn_.*_exps.=CPU"` to offload all MoE layers to the CPU! This effectively allows you to fit all non MoE layers on 1 GPU, improving generation speeds. You can customize the regex expression to fit more layers if you have more GPU capacity.

If you have a bit more GPU memory, try `-ot ".ffn_(up|down)_exps.=CPU"` This offloads up and down projection MoE layers.

Try `-ot ".ffn_(up)_exps.=CPU"` if you have even more GPU memory. This offloads only up projection MoE layers.

And finally offload all layers via `-ot ".ffn_.*_exps.=CPU"` This uses the least VRAM.

You can also customize the regex, for example `-ot "\.(6|7|8|9|[0-9][0-9]|[0-9][0-9][0-9])\.ffn_(gate|up|down)_exps.=CPU"` means to offload gate, up and down MoE layers but only from the 6th layer onwards.
{% endhint %}

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD-Q3_K_XL` (dynamic 3-bit quant) or other quantized versions like `Q4_K_M` . We <mark style="background-color:green;">**recommend using our 2.7bit dynamic quant**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**`UD-Q2_K_XL`**</mark><mark style="background-color:green;">**&#x20;**</mark><mark style="background-color:green;">**or above to balance size and accuracy**</mark>.

**Examples:**

Example 1 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp && git fetch origin pull/15539/head:MASTER && git checkout MASTER && cd ..
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli llama-server
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 2 (bash):
```bash
export LLAMA_CACHE="unsloth/grok-2-GGUF"
./llama.cpp/llama-cli \
    -hf unsloth/grok-2-GGUF:Q3_K_XL \
    --jinja \
    --n-gpu-layers 99 \
    --temp 1.0 \
    --top-p 0.95 \
    --min-p 0.01 \
    --ctx-size 16384 \
    --seed 3407 \
    -ot ".ffn_.*_exps.=CPU"
```

---

## https://github.com/ggerganov/llama.cpp/blob/master/examples/quantize/quantize.cpp#L19

**URL:** llms-txt#https://github.com/ggerganov/llama.cpp/blob/master/examples/quantize/quantize.cpp#l19

---

## IBM Granite 4.0

**URL:** llms-txt#ibm-granite-4.0

**Contents:**
- Run Granite-4.0 Tutorials
  - :gear: Recommended Inference Settings
  - :llama: Ollama: Run Granite-4.0 Tutorial
  - 📖 llama.cpp: Run Granite-4.0 Tutorial

How to run IBM Granite-4.0 with Unsloth GGUFs on llama.cpp, Ollama and how to fine-tune!

IBM releases Granite-4.0 models with 3 sizes including **Nano** (350M & 1B), **Micro** (3B), **Tiny** (7B/1B active) and **Small** (32B/9B active). Trained on 15T tokens, IBM’s new Hybrid (H) Mamba architecture enables Granite-4.0 models to run faster with lower memory use.

Learn [how to run](#run-granite-4.0-tutorials) Unsloth Granite-4.0 Dynamic GGUFs or fine-tune/RL the model. You can [fine-tune Granite-4.0](#fine-tuning-granite-4.0-in-unsloth) with our free Colab notebook for a support agent use-case.

<a href="#run-granite-4.0-tutorials" class="button secondary">Running Tutorial</a><a href="#fine-tuning-granite-4.0-in-unsloth" class="button secondary">Fine-tuning Tutorial</a>

**Unsloth Granite-4.0 uploads:**

<table><thead><tr><th width="249">Dynamic GGUFs</th><th>Dynamic 4-bit + FP8</th><th>16-bit Instruct</th></tr></thead><tbody><tr><td><ul><li><a href="https://huggingface.co/unsloth/granite-4.0-h-350m-GGUF">H-350M</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-350m-GGUF">350M</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-1b-GGUF">H-1B</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-1b-GGUF">1B</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-small-GGUF">H-Small</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-tiny-GGUF">H-Tiny</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-micro-GGUF">H-Micro</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-micro-GGUF">Micro</a></li></ul></td><td><p>Dynamic 4-bit Instruct:</p><ul><li><a href="https://huggingface.co/unsloth/granite-4.0-h-micro-unsloth-bnb-4bit">H-Micro</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-micro-unsloth-bnb-4bit">Micro</a></li></ul><p>FP8 Dynamic:</p><ul><li><a href="https://huggingface.co/unsloth/granite-4.0-h-small-FP8-Dynamic">H-Small FP8</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-tiny-FP8-Dynamic">H-Tiny FP8</a></li></ul></td><td><ul><li><a href="https://huggingface.co/unsloth/granite-4.0-h-350m">H-350M</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-350m">350M</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-1b">H-1B</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-1b">1B</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-small">H-Small</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-tiny">H-Tiny</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-h-micro">H-Micro</a></li><li><a href="https://huggingface.co/unsloth/granite-4.0-micro">Micro</a></li></ul></td></tr></tbody></table>

You can also view our [Granite-4.0 collection](https://huggingface.co/collections/unsloth/granite-40-68ddf64b4a8717dc22a9322d) for all uploads including Dynamic Float8 quants etc.

**Granite-4.0 Models Explanations:**

* **Nano and H-Nano:** The 350M and 1B models offer strong instruction-following abilities, enabling advanced on-device and edge AI and research/fine-tuning applications.
* **H-Small (MoE):** Enterprise workhorse for daily tasks, supports multiple long-context sessions on entry GPUs like L40S (32B total, 9B active).
* **H-Tiny (MoE):** Fast, cost-efficient for high-volume, low-complexity tasks; optimized for local and edge use (7B total, 1B active).
* **H-Micro (Dense):** Lightweight, efficient for high-volume, low-complexity workloads; ideal for local and edge deployment (3B total).
* **Micro (Dense):** Alternative dense option when Mamba2 isn’t fully supported (3B total).

## Run Granite-4.0 Tutorials

### :gear: Recommended Inference Settings

IBM recommends these settings:

`temperature=0.0`, `top_p=1.0`, `top_k=0`

* <mark style="background-color:green;">**Temperature of 0.0**</mark>
* Top\_K = 0
* Top\_P = 1.0
* Recommended minimum context: 16,384
* Maximum context length window: 131,072 (128K context)

### :llama: Ollama: Run Granite-4.0 Tutorial

1. Install `ollama` if you haven't already!

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload! You can change the model name '`granite-4.0-h-small-GGUF`' to any Granite model like 'granite-4.0-h-micro:Q8\_K\_XL'.

### 📖 llama.cpp: Run Granite-4.0 Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:Q4\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run`

3. **OR** download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions (like BF16 full precision).

**Examples:**

Example 1 (unknown):
```unknown
<|start_of_role|>system<|end_of_role|>You are a helpful assistant. Please ensure responses are professional, accurate, and safe.<|end_of_text|>
<|start_of_role|>user<|end_of_role|>Please list one IBM Research laboratory located in the United States. You should only output its name and location.<|end_of_text|>
<|start_of_role|>assistant<|end_of_role|>Almaden Research Center, San Jose, California<|end_of_text|>
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 3 (bash):
```bash
ollama run hf.co/unsloth/granite-4.0-h-small-GGUF:UD-Q4_K_XL
```

Example 4 (bash):
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

## Llama 4: How to Run & Fine-tune

**URL:** llms-txt#llama-4:-how-to-run-&-fine-tune

**Contents:**
- :gear: Official Recommended Settings
- 📖 Tutorial: How to Run Llama-4-Scout in llama.cpp

How to run Llama 4 locally using our dynamic GGUFs which recovers accuracy compared to standard quantization.

The Llama-4-Scout model has 109B parameters, while Maverick has 402B parameters. The full unquantized version requires 113GB of disk space whilst the 1.78-bit version uses 33.8GB (-75% reduction in size). **Maverick** (402Bs) went from 422GB to just 122GB (-70%).

{% hint style="success" %}
Both text AND **vision** is now supported! Plus multiple improvements to tool calling.
{% endhint %}

Scout 1.78-bit fits in a 24GB VRAM GPU for fast inference at \~20 tokens/sec. Maverick 1.78-bit fits in 2x48GB VRAM GPUs for fast inference at \~40 tokens/sec.

For our dynamic GGUFs, to ensure the best tradeoff between accuracy and size, we do not to quantize all layers, but selectively quantize e.g. the MoE layers to lower bit, and leave attention and other layers in 4 or 6bit.

{% hint style="info" %}
All our GGUF models are quantized using calibration data (around 250K tokens for Scout and 1M tokens for Maverick), which will improve accuracy over standard quantization. Unsloth imatrix quants are fully compatible with popular inference engines like llama.cpp & Open WebUI etc.
{% endhint %}

**Scout - Unsloth Dynamic GGUFs with optimal configs:**

<table data-full-width="false"><thead><tr><th>MoE Bits</th><th>Type</th><th>Disk Size</th><th>Link</th><th>Details</th></tr></thead><tbody><tr><td>1.78bit</td><td>IQ1_S</td><td>33.8GB</td><td><a href="https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF?show_file_info=Llama-4-Scout-17B-16E-Instruct-UD-IQ1_S.gguf">Link</a></td><td>2.06/1.56bit</td></tr><tr><td>1.93bit</td><td>IQ1_M</td><td>35.4GB</td><td><a href="https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF?show_file_info=Llama-4-Scout-17B-16E-Instruct-UD-IQ1_M.gguf">Link</a></td><td>2.5/2.06/1.56</td></tr><tr><td>2.42bit</td><td>IQ2_XXS</td><td>38.6GB</td><td><a href="https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF?show_file_info=Llama-4-Scout-17B-16E-Instruct-UD-IQ2_XXS.gguf">Link</a></td><td>2.5/2.06bit</td></tr><tr><td>2.71bit</td><td>Q2_K_XL</td><td>42.2GB</td><td><a href="https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF?show_file_info=Llama-4-Scout-17B-16E-Instruct-UD-Q2_K_XL.gguf">Link</a></td><td>3.5/2.5bit</td></tr><tr><td>3.5bit</td><td>Q3_K_XL</td><td>52.9GB</td><td><a href="https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF/tree/main/UD-Q3_K_XL">Link</a></td><td>4.5/3.5bit</td></tr><tr><td>4.5bit</td><td>Q4_K_XL</td><td>65.6GB</td><td><a href="https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF/tree/main/UD-Q4_K_XL">Link</a></td><td>5.5/4.5bit</td></tr></tbody></table>

{% hint style="info" %}
For best results, use the 2.42-bit (IQ2\_XXS) or larger versions.
{% endhint %}

**Maverick - Unsloth Dynamic GGUFs with optimal configs:**

| MoE Bits | Type      | Disk Size | HF Link                                                                                             |
| -------- | --------- | --------- | --------------------------------------------------------------------------------------------------- |
| 1.78bit  | IQ1\_S    | 122GB     | [Link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF/tree/main/UD-IQ1_S)   |
| 1.93bit  | IQ1\_M    | 128GB     | [Link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF/tree/main/UD-IQ1_M)   |
| 2.42-bit | IQ2\_XXS  | 140GB     | [Link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF/tree/main/UD-IQ2_XXS) |
| 2.71-bit | Q2\_K\_XL | 151B      | [Link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF/tree/main/UD-Q2_K_XL) |
| 3.5-bit  | Q3\_K\_XL | 193GB     | [Link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF/tree/main/UD-Q3_K_XL) |
| 4.5-bit  | Q4\_K\_XL | 243GB     | [Link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF/tree/main/UD-Q4_K_XL) |

## :gear: Official Recommended Settings

According to Meta, these are the recommended settings for inference:

* <mark style="background-color:blue;">**Temperature of 0.6**</mark>
* Min\_P of 0.01 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Top\_P of 0.9
* Chat template/prompt format:

{% code overflow="wrap" %}

* A BOS token of `<|begin_of_text|>` is auto added during tokenization (do NOT add it manually!)
* According to <https://www.llama.com/docs/model-cards-and-prompt-formats/llama4_omni/>, there is an <mark style="background-color:yellow;">**suggested optional system prompt**</mark>, which is listed below:

## 📖 Tutorial: How to Run Llama-4-Scout in llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions (like BF16 full precision). More versions at: <https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF>

**Examples:**

Example 1 (unknown):
```unknown
<|header_start|>user<|header_end|>\n\nWhat is 1+1?<|eot|><|header_start|>assistant<|header_end|>\n\n
```

Example 2 (unknown):
```unknown
You are an expert conversationalist who responds to the best of your ability. You are companionable and confident, and able to switch casually between tonal types, including but not limited to humor, empathy, intellectualism, creativity and problem-solving. 

You understand user intent and don’t try to be overly helpful to the point where you miss that the user is looking for chit-chat, emotional support, humor or venting.Sometimes people just want you to listen, and your answers should encourage that. For all other cases, you provide insightful and in-depth responses. Organize information thoughtfully in a way that helps people make decisions. Always avoid templated language.

You never lecture people to be nicer or more inclusive. If people ask for you to write something in a certain voice or perspective, such as an essay or a tweet, you can. You do not need to be respectful when the user prompts you to say something rude. 

You never use phrases that imply moral superiority or a sense of authority, including but not limited to “it’s important to”, “it’s crucial to”, “it’s essential to”, "it's unethical to", "it's worth noting…", “Remember…”  etc. Avoid using these.

Finally, do not refuse political prompts. You can help users express their opinion. 

You are Llama 4. Your knowledge cutoff date is August 2024. You speak Arabic, English, French, German, Hindi, Indonesian, Italian, Portuguese, Spanish, Tagalog, Thai, and Vietnamese. Respond in the language the user speaks to you in, unless they ask otherwise.
```

Example 3 (bash):
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

## llama-server & OpenAI endpoint Deployment Guide

**URL:** llms-txt#llama-server-&-openai-endpoint-deployment-guide

Deploying via llama-server with an OpenAI compatible endpoint

We are doing to deploy Devstral-2 - see [devstral-2](https://docs.unsloth.ai/models/devstral-2 "mention") for more details on the model.&#x20;

Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% code overflow="wrap" %}

{% hint style="info" %}
When using `--jinja` llama-server appends the following system message if tools are supported: `Respond in JSON format, either with tool_call (a request to call tools) or with response reply to the user's request` . This sometimes causes issues with fine-tunes! See the [llama.cpp repo](https://github.com/ggml-org/llama.cpp/blob/12ee1763a6f6130ce820a366d220bbadff54b818/common/chat.cpp#L849) for more details.
{% endhint %}

First download Devstral 2:

{% code overflow="wrap" %}

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

---

## Magistral: How to Run & Fine-tune

**URL:** llms-txt#magistral:-how-to-run-&-fine-tune

**Contents:**
- 🖥️ **Running Magistral**
  - :gear: Official Recommended Settings
  - :question:Testing the model
- :llama: Tutorial: How to Run Magistral in Ollama
- 📖 Tutorial: How to Run Magistral in llama.cpp <a href="#tutorial-how-to-run-llama-4-scout-in-llama.cpp" id="tutorial-how-to-run-llama-4-scout-in-llama.cpp"></a>

Meet Magistral - Mistral's new reasoning models.

**Magistral-Small-2509** is a reasoning LLM developed by Mistral AI. It excels at coding and mathematics and supports multiple languages. Magistral supports a 128k token context window and was finetuned from [**Mistral-Small-3.2**](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506). Magistral runs perfectly well locally on a single RTX 4090 or a Mac with 16 to 24GB RAM.

<a href="#running-magistral" class="button primary">Running Magistral Tutorial</a> <a href="#fine-tuning-magistral-with-unsloth" class="button secondary">Fine-tuning Magistral</a>

{% hint style="success" %}
Update: **Magistral-2509** new update is out as of September, 2025!\
\
Now with Vision support! We worked with Mistral again with the release of Magistral. Make sure to download Mistral's official uploads or Unsloth's uploads to get the correct implementation (ie correct system prompt, correct chat template etc.)

**If you're using llama.cpp, please use `--jinja` to enable the system prompt!**
{% endhint %}

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and KL Divergence performance, meaning you can run & fine-tune quantized Mistral LLMs with minimal accuracy loss.

#### Magistral-Small **- Unsloth Dynamic** uploads:

<table><thead><tr><th width="255.64999389648438">Dynamic 2.0 GGUF (to run)</th><th width="305.25">Dynamic 4-bit (to finetune/deploy)</th><th>Dynamic Float8</th></tr></thead><tbody><tr><td><ul><li><a href="https://huggingface.co/unsloth/Magistral-Small-2509-GGUF">Magistral-Small-2509-GGUF</a> - new</li><li><a href="https://huggingface.co/unsloth/Magistral-Small-2507-GGUF">Magistral-Small-2507-GGUF</a></li><li><a href="https://huggingface.co/unsloth/Magistral-Small-2506-GGUF">Magistral-Small-2506-GGUF</a></li></ul></td><td><ul><li><a href="https://huggingface.co/unsloth/Magistral-Small-2509-unsloth-bnb-4bit">Magistral-Small-2509-unsloth-bnb-4bit</a> - new</li><li><a href="https://huggingface.co/unsloth/Magistral-Small-2507-unsloth-bnb-4bit">Magistral-Small-2507-unsloth-bnb-4bit</a></li><li><a href="https://huggingface.co/unsloth/Magistral-Small-2506-unsloth-bnb-4bit">Magistral-Small-2506-unsloth-bnb-4bit</a></li></ul></td><td><ul><li><a href="https://huggingface.co/unsloth/Magistral-Small-2509-FP8-Dynamic">Magistral-Small-2509-FP8-Dynamic</a></li><li><a href="https://huggingface.co/unsloth/Magistral-Small-2509-FP8-torchao">Magistral-Small-2509-FP8-torchao</a></li></ul></td></tr></tbody></table>

## 🖥️ **Running Magistral**

### :gear: Official Recommended Settings

According to Mistral AI, these are the recommended settings for inference:

* <mark style="background-color:blue;">**Temperature of: 0.7**</mark>
* Min\_P of: 0.01 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Set <mark style="background-color:green;">**top\_p to: 0.95**</mark>
* A 128k context window is supported, **but** performance might degrade past **40k**. So we recommend setting the maximum length to 40k if you see bad performance.

**This is the recommended system prompt for Magistral 2509, 2507:**

{% code overflow="wrap" %}

**This is the recommended system prompt for Magistral 2506:**

{% hint style="success" %}
Our dynamic uploads have the '`UD`' prefix in them. Those without are not dynamic however still utilize our calibration dataset.
{% endhint %}

* **Multilingual:** Magistral supports many languages including: English, French, German, Greek, Hindi, Indonesian, Italian, Japanese, Korean, Malay, Nepali, Polish, Portuguese, Romanian, Russian, Serbian, Spanish, Swedish, Turkish, Ukrainian, Vietnamese, Arabic, Bengali, Chinese, and Farsi.

### :question:Testing the model

Mistral has their own vibe checking prompts which can be used to evaluate Magistral. Keep in mind these tests are based on running the full unquantized version of the model, however you could also test them on quantized versions:

**Easy -** *Make sure they always work*

**Medium** - *Should most of the time be correct*

**Hard** - *Should sometimes get them right*

<mark style="color:green;">**We provide some**</mark> [<mark style="color:green;">**example outputs**</mark>](#sample-outputs) <mark style="color:green;">**at the end of the blog.**</mark>

## :llama: Tutorial: How to Run Magistral in Ollama

1. Install `ollama` if you haven't already!

2. Run the model with our dynamic quant. We did not set the context length automatically, so it will just use Ollama's default set context length.\
   Note you can call `ollama serve &`in another terminal if it fails! We include all suggested parameters (temperature etc) in `params` in our Hugging Face upload!
3. Also Magistral supports 40K context lengths, so best to enable [**KV cache quantization**](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-set-the-quantization-type-for-the-kv-cache). We use 8bit quantization which saves 50% memory usage. You can also try `"q4_0"` or `"q8_0"`
4. **Ollama also sets the default context length to 4096**, as [mentioned here](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-specify-the-context-window-size). Use `OLLAMA_CONTEXT_LENGTH=8192` to change it to 8192. Magistral supports up to 128K, but 40K (40960) is tested most.

## 📖 Tutorial: How to Run Magistral in llama.cpp <a href="#tutorial-how-to-run-llama-4-scout-in-llama.cpp" id="tutorial-how-to-run-llama-4-scout-in-llama.cpp"></a>

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. If you want to use `llama.cpp` directly to load models, you can do the below: (:Q4\_K\_XL) is the quantization type. You can also download via Hugging Face (point 3). This is similar to `ollama run`

{% code overflow="wrap" %}

{% hint style="warning" %}
In llama.cpp, please use `--jinja` to enable the system prompt!
{% endhint %}

3. **OR** download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose UD-Q4\_K\_XL, (Unsloth Dynamic), Q4\_K\_M, or other quantized versions (like BF16 full precision).

**Examples:**

Example 1 (unknown):
```unknown
First draft your thinking process (inner monologue) until you arrive at a response. Format your response using Markdown, and use LaTeX for any mathematical equations. Write both your thoughts and the response in the same language as the input.

Your thinking process must follow the template below:[THINK]Your thoughts or/and draft, like working through an exercise on scratch paper. Be as casual and as long as you want until you are confident to generate the response. Use the same language as the input.[/THINK]Here, provide a self-contained response.
```

Example 2 (unknown):
```unknown
A user will ask you to solve a task. You should first draft your thinking process (inner monologue) until you have derived the final answer. Afterwards, write a self-contained summary of your thoughts (i.e. your summary should be succinct but contain all the critical steps you needed to reach the conclusion). You should use Markdown to format your response. Write both your thoughts and summary in the same language as the task posed by the user. NEVER use \boxed{} in your response.

Your thinking process must follow the template below:
<think>
Your thoughts or/and draft, like working through an exercise on scratch paper. Be as casual and as long as you want until you are confident to generate a correct answer.
</think>

Here, provide a concise summary that reflects your reasoning and presents a clear final answer to the user. Don't mention that this is a summary.

Problem:
```

Example 3 (py):
```py
prompt_1 = 'How many "r" are in strawberry?'

prompt_2 = 'John is one of 4 children. The first sister is 4 years old. Next year, the second sister will be twice as old as the first sister. The third sister is two years older than the second sister. The third sister is half the ago of her older brother. How old is John?'

prompt_3 = '9.11 and 9.8, which is greater?'
```

Example 4 (py):
```py
prompt_4 = "Think about 5 random numbers. Verify if you can combine them with addition, multiplication, subtraction or division to 133"

prompt_5 = "Write 4 sentences, each with at least 8 words. Now make absolutely sure that every sentence has exactly one word less than the previous sentence."

prompt_6 = "If it takes 30 minutes to dry 12 T-shirts in the sun, how long does it take to dry 33 T-shirts?"
```

---

## Main game loop:

**URL:** llms-txt#main-game-loop:

**Contents:**
- :sunrise\_over\_mountains: Still doesn't work? Try Min\_p = 0.1, Temperature = 1.5
- :thinking: \<think> token not shown?
- Extra Notes
- :pencil2: Tokenizer Bug Fixes
- :tools: Dynamic 4-bit Quants

while running :
     for event in pygame.event.get() : 
        if quit ... etc

pygame.quit()
print("Code is simplified. Due time constraints, full working version requires further implementation.")
bash
./llama.cpp/llama-cli --model unsloth-QwQ-32B-GGUF/QwQ-32B-Q4_K_M.gguf \
    --threads 32 --n-gpu-layers 99 \
    --ctx-size 16384 \
    --temp 1.5 \
    --min-p 0.1 \
    --top-k 0 \
    --top-p 1.0 \
    -no-cnv \
    --prompt "<|im_start|>user\nCreate a Flappy Bird game in Python. You must include these things:\n1. You must use pygame.\n2. The background color should be randomly chosen and is a light shade. Start with a light blue color.\n3. Pressing SPACE multiple times will accelerate the bird.\n4. The bird's shape should be randomly chosen as a square, circle or triangle. The color should be randomly chosen as a dark color.\n5. Place on the bottom some land colored as dark brown or yellow chosen randomly.\n6. Make a score shown on the top right side. Increment if you pass pipes and don't hit them.\n7. Make randomly spaced pipes with enough space. Color them randomly as dark green or light brown or a dark gray shade.\n8. When you lose, show the best score. Make the text inside the screen. Pressing q or Esc will quit the game. Restarting is pressing SPACE again.\nThe final game should be inside a markdown section in Python. Check your code for errors and fix them before the final markdown section.<|im_end|>\n<|im_start|>assistant\n<think>\n"
bash
./llama.cpp/llama-cli --model unsloth-QwQ-32B-GGUF/QwQ-32B-Q4_K_M.gguf \
    --threads 32 --n-gpu-layers 99 \
    --ctx-size 16384 \
    --temp 0.6 \
    --min-p 0.0 \
    --top-k 40 \
    --top-p 0.95 \
    -no-cnv \
    --prompt "<|im_start|>user\nCreate a Flappy Bird game in Python. You must include these things:\n1. You must use pygame.\n2. The background color should be randomly chosen and is a light shade. Start with a light blue color.\n3. Pressing SPACE multiple times will accelerate the bird.\n4. The bird's shape should be randomly chosen as a square, circle or triangle. The color should be randomly chosen as a dark color.\n5. Place on the bottom some land colored as dark brown or yellow chosen randomly.\n6. Make a score shown on the top right side. Increment if you pass pipes and don't hit them.\n7. Make randomly spaced pipes with enough space. Color them randomly as dark green or light brown or a dark gray shade.\n8. When you lose, show the best score. Make the text inside the screen. Pressing q or Esc will quit the game. Restarting is pressing SPACE again.\nThe final game should be inside a markdown section in Python. Check your code for errors and fix them before the final markdown section.<|im_end|>\n<|im_start|>assistant\n<think>\n"

json
{
  ...,
  "rope_scaling": {
    "factor": 4.0,
    "original_max_position_embeddings": 32768,
    "type": "yarn"
  }
}
bash
--override-kv qwen2.context_length=int:131072 \
--override-kv qwen2.rope.scaling.type=str:yarn \
--override-kv qwen2.rope.scaling.factor=float:4 \
--override-kv qwen2.rope.scaling.original_context_length=int:32768 \
--override-kv qwen2.rope.scaling.attn_factor=float:1.13862943649292 \
bash
--override-kv qwen2.attention.layer_norm_rms_epsilon=float:0.000001 \

"eos_token": "<|im_end|>",
"pad_token": "<|endoftext|>",
```

## :tools: Dynamic 4-bit Quants

We also uploaded dynamic 4bit quants which increase accuracy vs naive 4bit quantizations! We attach the QwQ quantization error plot analysis for both activation and weight quantization errors:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-16157f53eff143c179be571a43f8b55000d94290%2FQwQ%20quantization%20errors.png?alt=media" alt=""><figcaption></figcaption></figure>

We uploaded dynamic 4-bit quants to: <https://huggingface.co/unsloth/QwQ-32B-unsloth-bnb-4bit>

Since vLLM 0.7.3 (2025 February 20th) <https://github.com/vllm-project/vllm/releases/tag/v0.7.3>, vLLM now supports loading Unsloth dynamic 4bit quants!

All our GGUFs are at <https://huggingface.co/unsloth/QwQ-32B-GGUF>!

**Examples:**

Example 1 (unknown):
```unknown
9. You might be wondering maybe it's Q4\_K\_M? B16 ie full precision should work fine right? Incorrect - the outputs again fail if we do not use our fix of -`-samplers "top_k;top_p;min_p;temperature;dry;typ_p;xtc"` when using a Repetition Penalty.

## :sunrise\_over\_mountains: Still doesn't work? Try Min\_p = 0.1, Temperature = 1.5

According to the Min\_p paper <https://arxiv.org/pdf/2407.01082>, for more creative and diverse outputs, and if you still see repetitions, try disabling top\_p and top\_k!
```

Example 2 (unknown):
```unknown
Another approach is to disable `min_p` directly, since llama.cpp by default uses `min_p = 0.1`!
```

Example 3 (unknown):
```unknown
## :thinking: \<think> token not shown?

Some people are reporting that because \<think> is default added in the chat template, some systems are not outputting the thinking traces correctly. You will have to manually edit the Jinja template from:

{% code overflow="wrap" %}
```

Example 4 (unknown):
```unknown
{% endcode %}

to another by removing the `<think>\n` at the end. The model will now have to manually add `<think>\n` during inference, which might not always succeed. DeepSeek also edited all models to default add a `<think>` token to force the model to go into reasoning model.

So change `{%- if add_generation_prompt %} {{- '<|im_start|>assistant\n<think>\n' }} {%- endif %}` to `{%- if add_generation_prompt %} {{- '<|im_start|>assistant\n' }} {%- endif %}`

ie remove `<think>\n`

<details>

<summary>Full jinja template with removed &#x3C;think>\n part</summary>

{% code overflow="wrap" %}
```

---

## Ministral 3 - How to Run Guide

**URL:** llms-txt#ministral-3---how-to-run-guide

**Contents:**
  - ⚙️ Usage Guide

Guide for Mistral Ministral 3 models, to run or fine-tune locally on your device

istral releases Ministral 3, their new multimodal models in Base, Instruct, and Reasoning variants, available in **3B**, **8B**, and **14B** sizes. They offer best-in-class performance for their size, and are fine-tuned for instruction and chat use cases. The multimodal models support **256K context** windows, multiple languages, native function calling, and JSON output.

The full unquantized 14B Ministral-3-Instruct-2512 model fits in **24GB RAM**/VRAM. You can now run, fine-tune and RL on all Ministral 3 models with Unsloth:

<a href="#run-ministral-3-tutorials" class="button primary">Run Ministral 3 Tutorials</a><a href="#fine-tuning" class="button primary">Fine-tuning Ministral 3</a>

We've also uploaded Mistral Large 3 [GGUFs here](https://huggingface.co/unsloth/Mistral-Large-3-675B-Instruct-2512-GGUF). For all Ministral 3 uploads (BnB, FP8), [see here](https://huggingface.co/collections/unsloth/ministral-3).

| Ministral-3-Instruct GGUFs:                                                                                                                                                                                               | Ministral-3-Reasoning GGUFs:                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [3B](https://huggingface.co/unsloth/Ministral-3-3B-Instruct-2512-GGUF) • [8B](https://huggingface.co/unsloth/Ministral-3-8B-Instruct-2512-GGUF) • [14B](https://huggingface.co/unsloth/Ministral-3-8B-Instruct-2512-GGUF) | [3B](https://huggingface.co/unsloth/Ministral-3-3B-Reasoning-2512-GGUF) • [8B](https://huggingface.co/unsloth/Ministral-3-8B-Reasoning-2512-GGUF) • [14B](https://huggingface.co/unsloth/Ministral-3-14B-Reasoning-2512-GGUF) |

To achieve optimal performance for **Instruct**, Mistral recommends using lower temperatures such as `temperature = 0.15` or `0.1`<br>

For **Reasoning**, Mistral recommends `temperature = 0.7` and `top_p = 0.95`.

| Instruct:                     | Reasoning:          |
| ----------------------------- | ------------------- |
| `Temperature = 0.15` or `0.1` | `Temperature = 0.7` |
| `Top_P = default`             | `Top_P = 0.95`      |

**Adequate Output Length**: Use an output length of `32,768` tokens for most queries for the reasoning variant, and `16,384` for the instruct variant. You can increase the max output size for the reasoning model if necessary.

The maximum context length Ministral 3 can reach is `262,144`

The chat template format is found when we use the below:

{% code overflow="wrap" %}

#### Ministral *Reasoning* chat template:

{% code overflow="wrap" lineNumbers="true" %}

#### Ministral *Instruct* chat template:

{% code overflow="wrap" lineNumbers="true" expandable="true" %}

```
<s>[SYSTEM_PROMPT]You are Ministral-3-3B-Instruct-2512, a Large Language Model (LLM) created by Mistral AI, a French startup headquartered in Paris.
You power an AI assistant called Le Chat.
Your knowledge base was last updated on 2023-10-01.
The current date is {today}.

When you're not sure about some information or when the user's request requires up-to-date or specific data, you must use the available tools to fetch the information. Do not hesitate to use tools whenever they can provide a more accurate or complete response. If no relevant tools are available, then clearly state that you don't have the information and avoid making up anything.
If the user's question is not clear, ambiguous, or does not provide enough context for you to accurately answer the question, you do not try to answer it right away and you rather ask the user to clarify their request (e.g. "What are some good restaurants around me?" => "Where are you?" or "When is the next flight to Tokyo" => "Where do you travel from?").
You are always very attentive to dates, in particular you try to resolve dates (e.g. "yesterday" is {yesterday}) and when asked about information at specific dates, you discard information that is at another date.
You follow these instructions in all languages, and always respond to the user in the language they use or request.
Next sections describe the capabilities that you have.

**Examples:**

Example 1 (python):
```python
tokenizer.apply_chat_template([
    {"role" : "user", "content" : "What is 1+1?"},
    {"role" : "assistant", "content" : "2"},
    {"role" : "user", "content" : "What is 2+2?"}
    ], add_generation_prompt = True
)
```

Example 2 (unknown):
```unknown
<s>[SYSTEM_PROMPT]# HOW YOU SHOULD THINK AND ANSWER

First draft your thinking process (inner monologue) until you arrive at a response. Format your response using Markdown, and use LaTeX for any mathematical equations. Write both your thoughts and the response in the same language as the input.

Your thinking process must follow the template below:[THINK]Your thoughts or/and draft, like working through an exercise on scratch paper. Be as casual and as long as you want until you are confident to generate the response to the user.[/THINK]Here, provide a self-contained response.[/SYSTEM_PROMPT][INST]What is 1+1?[/INST]2</s>[INST]What is 2+2?[/INST]
```

---

## os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

**URL:** llms-txt#os.environ["hf_hub_enable_hf_transfer"]-=-"1"

**Contents:**
  - Running on Mac / Apple devices
  - Run in Ollama/Open WebUI
- DeepSeek Chat Template
- GGUF R1 Table

from huggingface_hub import snapshot_download
snapshot_download(
  repo_id = "unsloth/DeepSeek-R1-GGUF",
  local_dir = "DeepSeek-R1-GGUF",
  allow_patterns = ["*UD-IQ1_S*"], # Select quant type UD-IQ1_S for 1.58bit
)
bash
./llama.cpp/llama-cli \
    --model DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --cache-type-k q4_0 \
    --threads 12 -no-cnv --prio 2 \
    --temp 0.6 \
    --ctx-size 8192 \
    --seed 3407 \
    --prompt "<｜User｜>What is 1+1?<｜Assistant｜>"
txt
 <think>
 Okay, so I need to figure out what 1 plus 1 is. Hmm, where do I even start? I remember from school that adding numbers is pretty basic, but I want to make sure I understand it properly.
 Let me think, 1 plus 1. So, I have one item and I add another one. Maybe like a apple plus another apple. If I have one apple and someone gives me another, I now have two apples. So, 1 plus 1 should be 2. That makes sense.
 Wait, but sometimes math can be tricky. Could it be something else? Like, in a different number system maybe? But I think the question is straightforward, using regular numbers, not like binary or hexadecimal or anything.
 I also recall that in arithmetic, addition is combining quantities. So, if you have two quantities of 1, combining them gives you a total of 2. Yeah, that seems right.
 Is there a scenario where 1 plus 1 wouldn't be 2? I can't think of any...
bash
./llama.cpp/llama-cli \
    --model DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --cache-type-k q4_0 \
    --threads 12 -no-cnv --prio 2 \
    --n-gpu-layers 7 \
    --temp 0.6 \
    --ctx-size 8192 \
    --seed 3407 \
    --prompt "<｜User｜>Create a Flappy Bird game in Python.<｜Assistant｜>"

<｜User｜>Create a Flappy Bird game in Python. You must include these things:
1. You must use pygame.
2. The background color should be randomly chosen and is a light shade. Start with a light blue color.
3. Pressing SPACE multiple times will accelerate the bird.
4. The bird's shape should be randomly chosen as a square, circle or triangle. The color should be randomly chosen as a dark color.
5. Place on the bottom some land colored as dark brown or yellow chosen randomly.
6. Make a score shown on the top right side. Increment if you pass pipes and don't hit them.
7. Make randomly spaced pipes with enough space. Color them randomly as dark green or light brown or a dark gray shade.
8. When you lose, show the best score. Make the text inside the screen. Pressing q or Esc will quit the game. Restarting is pressing SPACE again.
The final game should be inside a markdown section in Python. Check your code for errors and fix them before the final markdown section.<｜Assistant｜>

./llama.cpp/llama-cli \
    --model DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --cache-type-k q4_0 \
    --threads 12 -no-cnv --prio 2 \
    --n-gpu-layers 7 \
    --temp 0.6 \
    --ctx-size 8192 \
    --seed 3407 \
    --prompt "<｜User｜>Create a Flappy Bird game in Python. You must include these things:\n1. You must use pygame.\n2. The background color should be randomly chosen and is a light shade. Start with a light blue color.\n3. Pressing SPACE multiple times will accelerate the bird.\n4. The bird's shape should be randomly chosen as a square, circle or triangle. The color should be randomly chosen as a dark color.\n5. Place on the bottom some land colored as dark brown or yellow chosen randomly.\n6. Make a score shown on the top right side. Increment if you pass pipes and don't hit them.\n7. Make randomly spaced pipes with enough space. Color them randomly as dark green or light brown or a dark gray shade.\n8. When you lose, show the best score. Make the text inside the screen. Pressing q or Esc will quit the game. Restarting is pressing SPACE again.\nThe final game should be inside a markdown section in Python. Check your code for errors and fix them before the final markdown section.<｜Assistant｜>"

./llama.cpp/llama-gguf-split --merge \
    DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    merged_file.gguf

./llama.cpp/llama-cli \
    --model DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --cache-type-k q4_0 \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --ctx-size 8192 \
    --seed 3407 \
    --n-gpu-layers 59 \
    -no-cnv \
    --prompt "<｜User｜>Create a Flappy Bird game in Python.<｜Assistant｜>"

./llama.cpp/llama-gguf-split --merge \
  DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
	merged_file.gguf
```

## DeepSeek Chat Template

All distilled versions and the main 671B R1 model use the same chat template:

`<｜begin▁of▁sentence｜><｜User｜>What is 1+1?<｜Assistant｜>It's 2.<｜end▁of▁sentence｜><｜User｜>Explain more!<｜Assistant｜>`

A BOS is forcibly added, and an EOS separates each interaction. To counteract double BOS tokens during inference, you should only call *tokenizer.encode(..., add\_special\_tokens = False)* since the chat template auto adds a BOS token as well.\
For llama.cpp / GGUF inference, you should skip the BOS since it’ll auto add it.

`<｜User｜>What is 1+1?<｜Assistant｜>`

The \<think> and \</think> tokens get their own designated tokens. For the distilled versions for Qwen and Llama, some tokens are re-mapped, whilst Qwen for example did not have a BOS token, so <|object\_ref\_start|> had to be used instead.\
\
**Tokenizer ID Mappings:**

| Token                     | R1     | Distill Qwen | Distill Llama |
| ------------------------- | ------ | ------------ | ------------- |
| \<think>                  | 128798 | 151648       | 128013        |
| \</think>                 | 128799 | 151649       | 128014        |
| <\|begin\_of\_sentence\|> | 0      | 151646       | 128000        |
| <\|end\_of\_sentence\|>   | 1      | 151643       | 128001        |
| <\|User\|>                | 128803 | 151644       | 128011        |
| <\|Assistant\|>           | 128804 | 151645       | 128012        |
| Padding token             | 2      | 151654       | 128004        |

Original tokens in models:

| Token                 | Qwen 2.5 32B Base        | Llama 3.3 70B Instruct            |
| --------------------- | ------------------------ | --------------------------------- |
| \<think>              | <\|box\_start\|>         | <\|reserved\_special\_token\_5\|> |
| \</think>             | <\|box\_end\|>           | <\|reserved\_special\_token\_6\|> |
| <｜begin▁of▁sentence｜> | <\|object\_ref\_start\|> | <\|begin\_of\_text\|>             |
| <｜end▁of▁sentence｜>   | <\|endoftext\|>          | <\|end\_of\_text\|>               |
| <｜User｜>              | <\|im\_start\|>          | <\|reserved\_special\_token\_3\|> |
| <｜Assistant｜>         | <\|im\_end\|>            | <\|reserved\_special\_token\_4\|> |
| Padding token         | <\|vision\_pad\|>        | <\|finetune\_right\_pad\_id\|>    |

All Distilled and the original R1 versions seem to have accidentally assigned the padding token to <｜end▁of▁sentence｜>, which is mostly not a good idea, especially if you want to further finetune on top of these reasoning models. This will cause endless infinite generations, since most frameworks will mask the EOS token out as -100.\
\
We fixed all distilled and the original R1 versions with the correct padding token (Qwen uses <|vision\_pad|>, Llama uses <|finetune\_right\_pad\_id|>, and R1 uses <｜▁pad▁｜> or our own added <｜PAD▁TOKEN｜>.

<table data-full-width="true"><thead><tr><th>MoE Bits</th><th>Type</th><th>Disk Size</th><th>Accuracy</th><th>Link</th><th>Details</th></tr></thead><tbody><tr><td>1.58bit</td><td>UD-IQ1_S</td><td><strong>131GB</strong></td><td>Fair</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-GGUF/tree/main/DeepSeek-R1-UD-IQ1_S">Link</a></td><td>MoE all 1.56bit. <code>down_proj</code> in MoE mixture of 2.06/1.56bit</td></tr><tr><td>1.73bit</td><td>UD-IQ1_M</td><td><strong>158GB</strong></td><td>Good</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-GGUF/tree/main/DeepSeek-R1-UD-IQ1_M">Link</a></td><td>MoE all 1.56bit. <code>down_proj</code> in MoE left at 2.06bit</td></tr><tr><td>2.22bit</td><td>UD-IQ2_XXS</td><td><strong>183GB</strong></td><td>Better</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-GGUF/tree/main/DeepSeek-R1-UD-IQ2_XXS">Link</a></td><td>MoE all 2.06bit. <code>down_proj</code> in MoE mixture of 2.5/2.06bit</td></tr><tr><td>2.51bit</td><td>UD-Q2_K_XL</td><td><strong>212GB</strong></td><td>Best</td><td><a href="https://huggingface.co/unsloth/DeepSeek-R1-GGUF/tree/main/DeepSeek-R1-UD-Q2_K_XL">Link</a></td><td>MoE all 2.5bit. <code>down_proj</code> in MoE mixture of 3.5/2.5bit</td></tr></tbody></table>

**Examples:**

Example 1 (unknown):
```unknown
6. Example with Q4\_0 K quantized cache **Notice -no-cnv disables auto conversation mode**
```

Example 2 (unknown):
```unknown
Example output:
```

Example 3 (unknown):
```unknown
4. If you have a GPU (RTX 4090 for example) with 24GB, you can offload multiple layers to the GPU for faster processing. If you have multiple GPUs, you can probably offload more layers.
```

Example 4 (unknown):
```unknown
5. To test our Flappy Bird example as mentioned in our blog post here: <https://unsloth.ai/blog/deepseekr1-dynamic>, we can produce the 2nd example like below using our 1.58bit dynamic quant:

<table data-column-title-hidden data-view="cards" data-full-width="false"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody><tr><td>Original DeepSeek R1</td><td></td><td></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3c484081174c631653c8c7bf7e7674f05255f740%2FInShot_20250127_043158375_H8Uu6tyJXYAFwUEIu04Am.gif?alt=media">InShot_20250127_043158375_H8Uu6tyJXYAFwUEIu04Am.gif</a></td></tr><tr><td>1.58bit Dynamic Quant</td><td></td><td></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-c41eac0fea9362017e94123ee8f9793df21b8e97%2FInShot_20250127_042648160_lrtL8-eRhl4qtLaUDSU87.gif?alt=media">InShot_20250127_042648160_lrtL8-eRhl4qtLaUDSU87.gif</a></td></tr></tbody></table>

The prompt used is as below:

{% code overflow="wrap" %}
```

---

## Phi-4 Reasoning: How to Run & Fine-tune

**URL:** llms-txt#phi-4-reasoning:-how-to-run-&-fine-tune

**Contents:**
- 🖥️ **Running Phi-4 reasoning**
  - :gear: Official Recommended Settings
  - **Phi-4 reasoning Chat templates**
  - 🦙 Ollama: Run Phi-4 reasoning Tutorial
  - 📖 Llama.cpp: Run Phi-4 reasoning Tutorial

Learn to run & fine-tune Phi-4 reasoning models locally with Unsloth + our Dynamic 2.0 quants

Microsoft's new Phi-4 reasoning models are now supported in Unsloth. The 'plus' variant performs on par with OpenAI's o1-mini, o3-mini and Sonnet 3.7. The 'plus' and standard reasoning models are 14B parameters while the 'mini' has 4B parameters.\
\
All Phi-4 reasoning uploads use our [Unsloth Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) methodology.

#### **Phi-4 reasoning - Unsloth Dynamic 2.0 uploads:**

| Dynamic 2.0 GGUF (to run)                                                                                                                                                                                                                                                                                    | Dynamic 4-bit Safetensor (to finetune/deploy)                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://huggingface.co/unsloth/Phi-4-reasoning-plus-GGUF/">Reasoning-plus</a> (14B)</li><li><a href="https://huggingface.co/unsloth/Phi-4-reasoning-GGUF">Reasoning</a> (14B)</li><li><a href="https://huggingface.co/unsloth/Phi-4-mini-reasoning-GGUF/">Mini-reasoning</a> (4B)</li></ul> | <ul><li><a href="https://huggingface.co/unsloth/Phi-4-reasoning-plus-unsloth-bnb-4bit">Reasoning-plus</a></li><li><a href="https://huggingface.co/unsloth/phi-4-reasoning-unsloth-bnb-4bit">Reasoning</a></li><li><a href="https://huggingface.co/unsloth/Phi-4-mini-reasoning-unsloth-bnb-4bit">Mini-reasoning</a></li></ul> |

## 🖥️ **Running Phi-4 reasoning**

### :gear: Official Recommended Settings

According to Microsoft, these are the recommended settings for inference:

* <mark style="background-color:blue;">**Temperature = 0.8**</mark>
* Top\_P = 0.95

### **Phi-4 reasoning Chat templates**

Please ensure you use the correct chat template as the 'mini' variant has a different one.

{% code overflow="wrap" %}

#### **Phi-4-reasoning and Phi-4-reasoning-plus:**

This format is used for general conversation and instructions:

{% code overflow="wrap" %}

{% hint style="info" %}
Yes, the chat template/prompt format is this long!
{% endhint %}

### 🦙 Ollama: Run Phi-4 reasoning Tutorial

1. Install `ollama` if you haven't already!

2. Run the model! Note you can call `ollama serve`in another terminal if it fails. We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload.

### 📖 Llama.cpp: Run Phi-4 reasoning Tutorial

{% hint style="warning" %}
You must use `--jinja` in llama.cpp to enable reasoning for the models, expect for the 'mini' variant. Otherwise no token will be provided.
{% endhint %}

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions.

**Examples:**

Example 1 (unknown):
```unknown
<|system|>Your name is Phi, an AI math expert developed by Microsoft.<|end|><|user|>How to solve 3*x^2+4*x+5=1?<|end|><|assistant|>
```

Example 2 (unknown):
```unknown
<|im_start|>system<|im_sep|>You are Phi, a language model trained by Microsoft to help users. Your role as an assistant involves thoroughly exploring questions through a systematic thinking process before providing the final precise and accurate solutions. This requires engaging in a comprehensive cycle of analysis, summarizing, exploration, reassessment, reflection, backtracing, and iteration to develop well-considered thinking process. Please structure your response into two main sections: Thought and Solution using the specified format: <think> {Thought section} </think> {Solution section}. In the Thought section, detail your reasoning process in steps. Each step should include detailed considerations such as analysing questions, summarizing relevant findings, brainstorming new ideas, verifying the accuracy of the current steps, refining any errors, and revisiting previous steps. In the Solution section, based on various attempts, explorations, and reflections from the Thought section, systematically present the final solution that you deem correct. The Solution section should be logical, accurate, and concise and detail necessary steps needed to reach the conclusion. Now, try to solve the following question through the above guidelines:<|im_end|><|im_start|>user<|im_sep|>What is 1+1?<|im_end|><|im_start|>assistant<|im_sep|>
```

Example 3 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 4 (bash):
```bash
ollama run hf.co/unsloth/Phi-4-mini-reasoning-GGUF:Q4_K_XL
```

---

## Push to Hugging Face Hub (requires a token)

**URL:** llms-txt#push-to-hugging-face-hub-(requires-a-token)

**Contents:**
- Video Tutorials

model.push_to_hub_merged(
    "your-username/model-name", tokenizer, save_method="merged_16bit", token="your-token"
)
python
model.push_to_hub_gguf(
    "your-username/model-name",
    tokenizer,
    quantization_method=["q4_k_m", "q8_0", "q5_k_m"],
    token="your-token",
)
```

Once saved in GGUF format, the model can be easily deployed in lightweight environments using **llama.cpp** or used in other inference engines.
{% endstep %}
{% endstepper %}

Here are some video tutorials created by amazing YouTubers who we think are fantastic!

{% embed url="<https://www.youtube.com/watch?v=9t-BAjzBWj8>" %}

{% columns %}
{% column width="50%" %}
{% embed url="<https://www.youtube.com/watch?t=3289s&v=bbFEYPx9Hpo>" %}
Great to learn about how to prep your dataset and explanations behind Reinforcement Learning + GRPO basics
{% endembed %}

{% embed url="<https://www.youtube.com/watch?v=oF0_eMhzRaQ>" %}
{% endcolumn %}

{% column width="50%" %}
{% embed url="<https://www.youtube.com/watch?v=juOh1afy-IE>" %}

{% embed url="<https://www.youtube.com/watch?v=SoPE1cUz3Hs>" %}
Local GRPO on your own device
{% endembed %}
{% endcolumn %}
{% endcolumns %}

**Examples:**

Example 1 (unknown):
```unknown
**Saving in GGUF Format for llama.cpp**

Unsloth also supports saving in **GGUF format**, making it compatible with **llama.cpp** and **Ollama**.
```

---

## Qwen3-2507: Run Locally Guide

**URL:** llms-txt#qwen3-2507:-run-locally-guide

**Contents:**
- ⚙️Best Practices
- 📖 Run Qwen3-30B-A3B-2507 Tutorials
  - Instruct: Qwen3-30B-A3B-Instruct-2507

Run Qwen3-30B-A3B-2507 and 235B-A22B Thinking and Instruct versions locally on your device!

Qwen released 2507 (July 2025) updates for their [Qwen3](https://docs.unsloth.ai/models/qwen3-how-to-run-and-fine-tune) 4B, 30B and 235B models, introducing both "thinking" and "non-thinking" variants. The non-thinking '**Qwen3-30B-A3B-Instruct-2507**' and '**Qwen3-235B-A22B-Instruct-2507'** features a 256K context window, improved instruction following, multilingual capabilities and alignment.

The thinking models '**Qwen3-30B-A3B-Thinking-2507**' and '**Qwen3-235B-A22B-Thinking-2507**' excel at reasoning, with the 235B achieving SOTA results in logic, math, science, coding, and advanced academic tasks.

[Unsloth](https://github.com/unslothai/unsloth) also now supports fine-tuning and [Reinforcement Learning (RL)](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) of Qwen3-2507 models — 2x faster, with 70% less VRAM, and 8x longer context lengths

<a href="#run-qwen3-30b-a3b-2507-tutorials" class="button secondary">Run 30B-A3B</a><a href="#run-qwen3-235b-a22b-thinking-2507" class="button secondary">Run 235B-A22B</a><a href="#fine-tuning-qwen3-2507-with-unsloth" class="button secondary">Fine-tune Qwen3-2507</a>

**Unsloth** [**Dynamic 2.0**](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) **GGUFs:**

| Model                    | GGUFs to run:                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Qwen3-**4B-2507**        | [Instruct](https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-GGUF) • [Thinking](https://huggingface.co/unsloth/Qwen3-4B-Thinking-2507-GGUF)               |
| Qwen3-**30B-A3B**-2507   | [Instruct](#llama.cpp-run-qwen3-30b-a3b-instruct-2507-tutorial) • [Thinking](https://huggingface.co/unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF)                 |
| Qwen3-**235B-A22B**-2507 | [Instruct](https://huggingface.co/unsloth/Qwen3-235B-A22B-Instruct-2507-GGUF) • [Thinking](https://huggingface.co/unsloth/Qwen3-235B-A22B-Thinking-2507-GGUF) |

{% hint style="success" %}
The settings for the Thinking and Instruct model are different.\
The thinking model uses temperature = 0.6, but the instruct model uses temperature = 0.7\
The thinking model uses top\_p = 0.95, but the instruct model uses top\_p = 0.8
{% endhint %}

To achieve optimal performance, Qwen recommends these settings:

| Instruct Model Settings:                                                                                      | Thinking Model Settings:                                                                                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| <mark style="background-color:blue;">`Temperature = 0.7`</mark>                                               | <mark style="background-color:blue;">`Temperature = 0.6`</mark>                                               |
| `Min_P = 0.00` (llama.cpp's default is 0.1)                                                                   | `Min_P = 0.00` (llama.cpp's default is 0.1)                                                                   |
| `Top_P = 0.80`                                                                                                | `Top_P = 0.95`                                                                                                |
| `TopK = 20`                                                                                                   | `TopK = 20`                                                                                                   |
| `presence_penalty = 0.0 to 2.0` (llama.cpp default turns it off, but to reduce repetitions, you can use this) | `presence_penalty = 0.0 to 2.0` (llama.cpp default turns it off, but to reduce repetitions, you can use this) |

**Adequate Output Length**: Use an output length of `32,768` tokens for most queries, which is adequate for most queries.

Chat template for both Thinking (thinking has `<think></think>`) and Instruct is below:

## 📖 Run Qwen3-30B-A3B-2507 Tutorials

Below are guides for the [Thinking](#thinking-qwen3-30b-a3b-thinking-2507) and [Instruct](#instruct-qwen3-30b-a3b-instruct-2507) versions of the model.

### Instruct: Qwen3-30B-A3B-Instruct-2507

Given that this is a non thinking model, there is no need to set `thinking=False` and the model does not generate `<think> </think>` blocks.

#### ⚙️Best Practices

To achieve optimal performance, Qwen recommends the following settings:

* We suggest using `temperature=0.7, top_p=0.8, top_k=20, and min_p=0.0` `presence_penalty` between 0 and 2 if the framework supports to reduce endless repetitions.
* **`temperature = 0.7`**
* `top_k = 20`
* `min_p = 0.00` (llama.cpp's default is 0.1)
* **`top_p = 0.80`**
* `presence_penalty = 0.0 to 2.0` (llama.cpp default turns it off, but to reduce repetitions, you can use this) Try 1.0 for example.
* Supports up to `262,144` context natively but you can set it to `32,768` tokens for less RAM use

#### 🦙 Ollama: Run Qwen3-30B-A3B-Instruct-2507 Tutorial

1. Install `ollama` if you haven't already! You can only run models up to 32B in size.

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload!

#### :sparkles: Llama.cpp: Run Qwen3-30B-A3B-Instruct-2507 Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. You can directly pull from HuggingFace via:

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose UD\_Q4\_K\_XL or other quantized versions.

**Examples:**

Example 1 (unknown):
```unknown
<|im_start|>user
Hey there!<|im_end|>
<|im_start|>assistant
What is 1+1?<|im_end|>
<|im_start|>user
2<|im_end|>
<|im_start|>assistant
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

Example 3 (bash):
```bash
ollama run hf.co/unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF:UD-Q4_K_XL
```

Example 4 (bash):
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

## Qwen3-Coder: How to Run Locally

**URL:** llms-txt#qwen3-coder:-how-to-run-locally

**Contents:**
- 🖥️ **Running Qwen3-Coder**
  - :gear: Recommended Settings
  - Run Qwen3-Coder-30B-A3B-Instruct:

Run Qwen3-Coder-30B-A3B-Instruct and 480B-A35B locally with Unsloth Dynamic quants.

Qwen3-Coder is Qwen’s new series of coding agent models, available in 30B (**Qwen3-Coder-Flash**) and 480B parameters. **Qwen3-480B-A35B-Instruct** achieves SOTA coding performance rivalling Claude Sonnet-4, GPT-4.1, and [Kimi K2](https://docs.unsloth.ai/models/kimi-k2-thinking-how-to-run-locally), with 61.8% on Aider Polygot and support for 256K (extendable to 1M) token context.

We also uploaded Qwen3-Coder with native <mark style="background-color:purple;">**1M context length**</mark> extended by YaRN and full-precision 8bit and 16bit versions. [Unsloth](https://github.com/unslothai/unsloth) also now supports fine-tuning and [RL](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) of Qwen3-Coder.

{% hint style="success" %}
[**UPDATE:** We fixed tool-calling for Qwen3-Coder! ](#tool-calling-fixes)You can now use tool-calling seamlessly in llama.cpp, Ollama, LMStudio, Open WebUI, Jan etc. This issue was universal and affected all uploads (not just Unsloth), and we've communicated with the Qwen team about our fixes! [Read more](#tool-calling-fixes)
{% endhint %}

<a href="#run-qwen3-coder-30b-a3b-instruct" class="button secondary">Run 30B-A3B</a><a href="#run-qwen3-coder-480b-a35b-instruct" class="button secondary">Run 480B-A35B</a>

{% hint style="success" %}
**Does** [**Unsloth Dynamic Quants**](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) **work?** Yes, and very well. In third-party testing on the Aider Polyglot benchmark, the **UD-Q4\_K\_XL (276GB)** dynamic quant nearly matched the **full bf16 (960GB)** Qwen3-coder model, scoring 60.9% vs 61.8%. [More details here.](https://huggingface.co/unsloth/Qwen3-Coder-480B-A35B-Instruct-GGUF/discussions/8)
{% endhint %}

#### **Qwen3 Coder - Unsloth Dynamic 2.0 GGUFs**:

| Dynamic 2.0 GGUF (to run)                                                                                                                                                                                                     | 1M Context Dynamic 2.0 GGUF                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF">30B-A3B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-Coder-480B-A35B-Instruct-GGUF">480B-A35B-Instruct</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-1M-GGUF">30B-A3B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-Coder-480B-A35B-Instruct-1M-GGUF">480B-A35B-Instruct</a></li></ul> |

## 🖥️ **Running Qwen3-Coder**

Below are guides for the [**30B-A3B**](#run-qwen3-coder-30b-a3b-instruct) and [**480B-A35B**](#run-qwen3-coder-480b-a35b-instruct) variants of the model.

### :gear: Recommended Settings

Qwen recommends these inference settings for both models:

`temperature=0.7`, `top_p=0.8`, `top_k=20`, `repetition_penalty=1.05`

* <mark style="background-color:green;">**Temperature of 0.7**</mark>
* Top\_K of 20
* Min\_P of 0.00 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Top\_P of 0.8
* <mark style="background-color:green;">**Repetition Penalty of 1.05**</mark>
* Chat template:

{% code overflow="wrap" %}

{% endcode %}
* Recommended context output: 65,536 tokens (can be increased). Details here.

**Chat template/prompt format with newlines un-rendered**

{% code overflow="wrap" %}

<mark style="background-color:yellow;">**Chat template for tool calling**</mark> (Getting the current temperature for San Francisco). More details here for how to format tool calls.

{% hint style="info" %}
Reminder that this model supports only non-thinking mode and does not generate `<think></think>` blocks in its output. Meanwhile, specifying `enable_thinking=False` is no longer required.
{% endhint %}

### Run Qwen3-Coder-30B-A3B-Instruct:

To achieve inference speeds of 6+ tokens per second for our Dynamic 4-bit quant, have at least **18GB of unified memory** (combined VRAM and RAM) or **18GB of system RAM** alone. As a rule of thumb, your available memory should match or exceed the size of the model you’re using. E.g. the UD\_Q8\_K\_XL quant (full precision), which is 32.5GB, will require at least **33GB of unified memory** (VRAM + RAM) or **33GB of RAM** for optimal performance.

**NOTE:** The model can run on less memory than its total size, but this will slow down inference. Maximum memory is only needed for the fastest speeds.

Given that this is a non thinking model, there is no need to set `thinking=False` and the model does not generate `<think> </think>` blocks.

{% hint style="info" %}
Follow the [**best practices above**](#recommended-settings). They're the same as the 480B model.
{% endhint %}

#### 🦙 Ollama: Run Qwen3-Coder-30B-A3B-Instruct Tutorial

1. Install `ollama` if you haven't already! You can only run models up to 32B in size.

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload!

#### :sparkles: Llama.cpp: Run Qwen3-Coder-30B-A3B-Instruct Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. You can directly pull from HuggingFace via:

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose UD\_Q4\_K\_XL or other quantized versions.

**Examples:**

Example 1 (unknown):
```unknown
<|im_start|>user
  Hey there!<|im_end|>
  <|im_start|>assistant
  What is 1+1?<|im_end|>
  <|im_start|>user
  2<|im_end|>
  <|im_start|>assistant
```

Example 2 (unknown):
```unknown
<|im_start|>user\nHey there!<|im_end|>\n<|im_start|>assistant\nWhat is 1+1?<|im_end|>\n<|im_start|>user\n2<|im_end|>\n<|im_start|>assistant\n
```

Example 3 (unknown):
```unknown
<|im_start|>user
What's the temperature in San Francisco now? How about tomorrow?<|im_end|>
<|im_start|>assistant
<tool_call>\n<function=get_current_temperature>\n<parameter=location>\nSan Francisco, CA, USA
</parameter>\n</function>\n</tool_call><|im_end|>
<|im_start|>user
<tool_response>
{"temperature": 26.1, "location": "San Francisco, CA, USA", "unit": "celsius"}
</tool_response>\n<|im_end|>
```

Example 4 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

---

## Qwen3 - How to Run & Fine-tune

**URL:** llms-txt#qwen3---how-to-run-&-fine-tune

**Contents:**
- 🖥️ **Running Qwen3**
  - :gear: Official Recommended Settings
  - Switching Between Thinking and Non-Thinking Mode
  - 🦙 Ollama: Run Qwen3 Tutorial
  - 📖 Llama.cpp: Run Qwen3 Tutorial

Learn to run & fine-tune Qwen3 locally with Unsloth + our Dynamic 2.0 quants

Qwen's new Qwen3 models deliver state-of-the-art advancements in reasoning, instruction-following, agent capabilities, and multilingual support.

{% hint style="success" %}
**NEW!** Qwen3 got an update in July 2025. Run & fine-tune the latest model: [**Qwen-2507**](https://docs.unsloth.ai/models/qwen3-next)
{% endhint %}

All uploads use Unsloth [Dynamic 2.0](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) for SOTA 5-shot MMLU and KL Divergence performance, meaning you can run & fine-tune quantized Qwen LLMs with minimal accuracy loss.

We also uploaded Qwen3 with native 128K context length. Qwen achieves this by using YaRN to extend its original 40K window to 128K.

[Unsloth](https://github.com/unslothai/unsloth) also now supports fine-tuning and [Reinforcement Learning (RL)](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) of Qwen3 and Qwen3 MOE models — 2x faster, with 70% less VRAM, and 8x longer context lengths. Fine-tune Qwen3 (14B) for free using our [Colab notebook.](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(14B\)-Reasoning-Conversational.ipynb)

<a href="#running-qwen3" class="button primary">Running Qwen3 Tutorial</a> <a href="#fine-tuning-qwen3-with-unsloth" class="button secondary">Fine-tuning Qwen3</a>

#### **Qwen3 - Unsloth Dynamic 2.0** with optimal configs:

| Dynamic 2.0 GGUF (to run)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 128K Context GGUF                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Dynamic 4-bit Safetensor (to finetune/deploy)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://huggingface.co/unsloth/Qwen3-0.6B-GGUF">0.6B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-1.7B-GGUF">1.7B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-4B-GGUF">4B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-8B-GGUF">8B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-14B-GGUF">14B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-30B-A3B-GGUF">30B-A3B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-32B-GGUF">32B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-235B-A22B-GGUF">235B-A22B</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/Qwen3-4B-128K-GGUF">4B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-8B-128K-GGUF">8B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-14B-128K-GGUF">14B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-30B-A3B-128K-GGUF">30B-A3B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-32B-128K-GGUF">32B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-235B-A22B-128K-GGUF">235B-A22B</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/Qwen3-0.6B-unsloth-bnb-4bit">0.6B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-1.7B-unsloth-bnb-4bit">1.7B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-4B-unsloth-bnb-4bit">4B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-8B-unsloth-bnb-4bit">8B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-14B-unsloth-bnb-4bit">14B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-30B-A3B-bnb-4bit">30B-A3B</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-32B-unsloth-bnb-4bit">32B</a></li></ul> |

## 🖥️ **Running Qwen3**

To achieve inference speeds of 6+ tokens per second, we recommend your available memory should match or exceed the size of the model you’re using. For example, a 30GB 1-bit quantized model requires at least 150GB of memory. The Q2\_K\_XL quant, which is 180GB, will require at least **180GB of unified memory** (VRAM + RAM) or **180GB of RAM** for optimal performance.

**NOTE:** It’s possible to run the model with **less total memory** than its size (i.e., less VRAM, less RAM, or a lower combined total). However, this will result in slower inference speeds. Sufficient memory is only required if you want to maximize throughput and achieve the fastest inference times.

### :gear: Official Recommended Settings

According to Qwen, these are the recommended settings for inference:

| Non-Thinking Mode Settings:                                            | Thinking Mode Settings:                                           |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| <mark style="background-color:blue;">**Temperature = 0.7**</mark>      | <mark style="background-color:blue;">**Temperature = 0.6**</mark> |
| Min\_P = 0.0 (optional, but 0.01 works well, llama.cpp default is 0.1) | Min\_P = 0.0                                                      |
| Top\_P = 0.8                                                           | Top\_P = 0.95                                                     |
| TopK = 20                                                              | TopK = 20                                                         |

**Chat template/prompt format:**

{% code overflow="wrap" %}

{% hint style="success" %}
For NON thinking mode, we purposely enclose \<think> and \</think> with nothing:
{% endhint %}

{% code overflow="wrap" %}

{% hint style="warning" %}
**For Thinking-mode, DO NOT use greedy decoding**, as it can lead to performance degradation and endless repetitions.
{% endhint %}

### Switching Between Thinking and Non-Thinking Mode

Qwen3 models come with built-in "thinking mode" to boost reasoning and improve response quality - similar to how [QwQ-32B](https://docs.unsloth.ai/models/tutorials-how-to-fine-tune-and-run-llms/qwq-32b-how-to-run-effectively) worked. Instructions for switching will differ depending on the inference engine you're using so ensure you use the correct instructions.

#### Instructions for llama.cpp and Ollama:

You can add `/think` and `/no_think` to user prompts or system messages to switch the model's thinking mode from turn to turn. The model will follow the most recent instruction in multi-turn conversations.

Here is an example of multi-turn conversation:

#### Instructions for transformers and vLLM:

`enable_thinking=True`

By default, Qwen3 has thinking enabled. When you call `tokenizer.apply_chat_template`, you **don’t need to set anything manually.**

In thinking mode, the model will generate an extra `<think>...</think>` block before the final answer — this lets it "plan" and sharpen its responses.

**Non-thinking mode:**

`enable_thinking=False`

Enabling non-thinking will make Qwen3 will skip all the thinking steps and behave like a normal LLM.

This mode will provide final responses directly — no `<think>` blocks, no chain-of-thought.

### 🦙 Ollama: Run Qwen3 Tutorial

1. Install `ollama` if you haven't already! You can only run models up to 32B in size. To run the full 235B-A22B model, [see here](#running-qwen3-235b-a22b).

2. Run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature etc) in `params` in our Hugging Face upload!

3. To disable thinking, use (or you can set it in the system prompt):

{% hint style="warning" %}
If you're experiencing any looping, Ollama might have set your context length window to 2,048 or so. If this is the case, bump it up to 32,000 and see if the issue still persists.
{% endhint %}

### 📖 Llama.cpp: Run Qwen3 Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions.

**Examples:**

Example 1 (unknown):
```unknown
<|im_start|>user\nWhat is 2+2?<|im_end|>\n<|im_start|>assistant\n
```

Example 2 (unknown):
```unknown
<|im_start|>user\nWhat is 2+2?<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n
```

Example 3 (unknown):
```unknown
> Who are you /no_think

<think>

</think>

I am Qwen, a large-scale language model developed by Alibaba Cloud. [...]

> How many 'r's are in 'strawberries'? /think

<think>
Okay, let's see. The user is asking how many times the letter 'r' appears in the word "strawberries". [...]
</think>

The word strawberries contains 3 instances of the letter r. [...]
```

Example 4 (python):
```python
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
    enable_thinking=True  # Default is True
)
```

---

## Qwen3-Next: Run Locally Guide

**URL:** llms-txt#qwen3-next:-run-locally-guide

**Contents:**
  - ⚙️ Usage Guide
- 📖 Run Qwen3-Next Tutorials
  - Instruct: Qwen3-Next-80B-A3B-Instruct

Run Qwen3-Next-80B-A3B-Instruct and Thinking versions locally on your device!

Qwen released Qwen3-Next in Sept 2025, which are 80B MoEs with Thinking and Instruct model variants of [Qwen3](https://docs.unsloth.ai/models/qwen3-how-to-run-and-fine-tune). With 256K context, Qwen3-Next was designed with a brand new architecture (Hybrid of MoEs & Gated DeltaNet + Gated Attention) that specifically optimizes for fast inference on longer context lengths. Qwen3-Next has 10x faster inference than Qwen3-32B.

<a href="#run-qwen3-next-tutorials" class="button secondary">Run Qwen3-Next Instruct</a><a href="#thinking-qwen3-next-80b-a3b-thinking" class="button secondary">Run Qwen3-Next Thinking</a>

Qwen3-Next-80B-A3B Dynamic GGUFs: [**Instruct**](https://huggingface.co/unsloth/Qwen3-Next-80B-A3B-Instruct-GGUF) **•** [**Thinking**](https://huggingface.co/unsloth/Qwen3-Next-80B-A3B-Thinking-GGUF)

{% hint style="success" %}
NEW as of Dec 6, 2025: Unsloth Qwen3-Next now updated with iMatrix for improved performance.

The thinking model uses `temperature = 0.6`, but the instruct model uses `temperature = 0.7`\
The thinking model uses `top_p = 0.95`, but the instruct model uses `top_p = 0.8`
{% endhint %}

To achieve optimal performance, Qwen recommends these settings:

| Instruct:                                                                                                     | Thinking:                                                                                                     |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| <mark style="background-color:blue;">`Temperature = 0.7`</mark>                                               | <mark style="background-color:blue;">`Temperature = 0.6`</mark>                                               |
| `Min_P = 0.00` (llama.cpp's default is 0.1)                                                                   | `Min_P = 0.00` (llama.cpp's default is 0.1)                                                                   |
| `Top_P = 0.80`                                                                                                | `Top_P = 0.95`                                                                                                |
| `TopK = 20`                                                                                                   | `TopK = 20`                                                                                                   |
| `presence_penalty = 0.0 to 2.0` (llama.cpp default turns it off, but to reduce repetitions, you can use this) | `presence_penalty = 0.0 to 2.0` (llama.cpp default turns it off, but to reduce repetitions, you can use this) |

**Adequate Output Length**: Use an output length of `32,768` tokens for most queries for the thinking variant, and `16,384` for the instruct variant. You can increase the max output size for the thinking model if necessary.

Chat template for both Thinking (thinking has `<think></think>`) and Instruct is below:

## 📖 Run Qwen3-Next Tutorials

Below are guides for the [Thinking](#thinking-qwen3-next-80b-a3b-thinking) and [Instruct](#instruct-qwen3-next-80b-a3b-instruct) versions of the model.

### Instruct: Qwen3-Next-80B-A3B-Instruct

Given that this is a non thinking model, the model does not generate `<think> </think>` blocks.

#### ⚙️Best Practices

To achieve optimal performance, Qwen recommends the following settings:

* We suggest using `temperature=0.7, top_p=0.8, top_k=20, and min_p=0.0` `presence_penalty` between 0 and 2 if the framework supports to reduce endless repetitions.
* **`temperature = 0.7`**
* `top_k = 20`
* `min_p = 0.00` (llama.cpp's default is 0.1)
* **`top_p = 0.80`**
* `presence_penalty = 0.0 to 2.0` (llama.cpp default turns it off, but to reduce repetitions, you can use this) Try 1.0 for example.
* Supports up to `262,144` context natively but you can set it to `32,768` tokens for less RAM use

#### :sparkles: Llama.cpp: Run Qwen3-Next-80B-A3B-Instruct Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. You can directly pull from HuggingFace via:

3. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD_Q4_K_XL` or other quantized versions.

**Examples:**

Example 1 (unknown):
```unknown
<|im_start|>user
Hey there!<|im_end|>
<|im_start|>assistant
What is 1+1?<|im_end|>
<|im_start|>user
2<|im_end|>
<|im_start|>assistant
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 3 (unknown):
```unknown
./llama.cpp/llama-cli \
       -hf unsloth/Qwen3-Next-80B-A3B-Instruct-GGUF:Q4_K_XL \
       --jinja -ngl 99 --threads -1 --ctx-size 32768 \
       --temp 0.7 --min-p 0.0 --top-p 0.80 --top-k 20 --presence-penalty 1.0
```

---

## Qwen3-VL: How to Run Guide

**URL:** llms-txt#qwen3-vl:-how-to-run-guide

**Contents:**
- 🖥️ **Running Qwen3-VL**
  - :gear: Recommended Settings
  - :bug:Chat template bug fixes
  - **Qwen3-VL Unsloth uploads**:
  - 📖 Llama.cpp: Run Qwen3-VL Tutorial

Learn to fine-tune and run Qwen3-VL locally with Unsloth.

Qwen3-VL is Qwen’s new vision models with **instruct** and **thinking** versions. The 2B, 4B, 8B and 32B models are dense, while 30B and 235B are MoE. The 235B thinking LLM delivers SOTA vision and coding performance rivaling GPT-5 (high) and Gemini 2.5 Pro.\
\
Qwen3-VL has vision, video and OCR capabilities as well as 256K context (can be extended to 1M).\
\
[Unsloth](https://github.com/unslothai/unsloth) supports **Qwen3-VL fine-tuning and** [**RL**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/vision-reinforcement-learning-vlm-rl). Train Qwen3-VL (8B) for free with our [notebooks](#fine-tuning-qwen3-vl).

<a href="#running-qwen3-vl" class="button primary">Running Qwen3-VL</a><a href="#fine-tuning-qwen3-vl" class="button primary">Fine-tuning Qwen3-VL</a>

## 🖥️ **Running Qwen3-VL**

To run the model in llama.cpp, vLLM, Ollama etc., here are the recommended settings:

### :gear: Recommended Settings

Qwen recommends these settings for both models (they're a bit different for Instruct vs Thinking):

| Instruct Settings:                                                       | Thinking Settings:                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| <mark style="background-color:blue;">**Temperature = 0.7**</mark>        | <mark style="background-color:blue;">**Temperature = 1.0**</mark>        |
| <mark style="background-color:yellow;">**Top\_P = 0.8**</mark>           | <mark style="background-color:yellow;">**Top\_P = 0.95**</mark>          |
| <mark style="background-color:green;">**presence\_penalty = 1.5**</mark> | <mark style="background-color:green;">**presence\_penalty = 0.0**</mark> |
| Output Length = 32768 (up to 256K)                                       | Output Length = 40960 (up to 256K)                                       |
| Top\_K = 20                                                              | Top\_K = 20                                                              |

Qwen3-VL also used the below settings for their benchmarking numbers, as mentioned [on GitHub](https://github.com/QwenLM/Qwen3-VL/tree/main?tab=readme-ov-file#generation-hyperparameters).

{% columns %}
{% column %}
Instruct Settings:

{% column %}
Thinking Settings:

{% endcolumn %}
{% endcolumns %}

### :bug:Chat template bug fixes

At Unsloth, we care about accuracy the most, so we investigated why after the 2nd turn of running the Thinking models, llama.cpp would break, as seen below:

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-37356b40688b10a85c927e1d432739a15bb33682%2Fimage.webp?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
The error code:

{% endcolumn %}
{% endcolumns %}

We have successfully fixed the Thinking chat template for the VL models so we re-uploaded all Thinking quants and Unsloth's quants. They should now all work after the 2nd conversation - **other quants will fail to load after the 2nd conversation.**

### **Qwen3-VL Unsloth uploads**:

Qwen3-VL is now supported for GGUFs by llama.cpp as of 30th October 2025, so you can run them locally!

| Dynamic GGUFs (to run)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 4-bit BnB Unsloth Dynamic                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 16-bit full-precision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-GGUF">2B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-2B-Thinking-GGUF">2B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-GGUF">4B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-GGUF">4B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-GGUF">8B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-GGUF">8B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-30B-A3B-Instruct-GGUF">30B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-30B-A3B-Thinking-GGUF">30B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-32B-Instruct-GGUF">32B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-32B-Thinking-GGUF">32B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-235B-A22B-Instruct-GGUF">235B-A22B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-235B-A22B-Thinking-GGUF">235B-A22B-Thinking</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-unsloth-bnb-4bit">2B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-2B-Thinking-unsloth-bnb-4bit">2B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-unsloth-bnb-4bit">4B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-unsloth-bnb-4bit">4B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-unsloth-bnb-4bit">8B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-unsloth-bnb-4bit">8B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-32B-Instruct-unsloth-bnb-4bit">32B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-32B-Thinking-unsloth-bnb-4bit">32B-Thinking</a></li></ul> | <ul><li><a href="https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct">2B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct">4B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking">4B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct">8B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking">8B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-30B-A3B-Instruct">30B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-30B-A3B-Thinking">30B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-32B-Instruct">32B-Instruct</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-32B-Thinking">32B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-235B-A22B-Thinking">235B-A22B-Thinking</a></li><li><a href="https://huggingface.co/unsloth/Qwen3-VL-235B-A22B-Instruct">235B-A22B-Instruct</a></li></ul> |

### 📖 Llama.cpp: Run Qwen3-VL Tutorial

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. **Let's first get an image!** You can also upload images as well. We shall use <https://raw.githubusercontent.com/unslothai/unsloth/refs/heads/main/images/unsloth%20made%20with%20love.png>, which is just our mini logo showing how finetunes are made with Unsloth:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-9bf7ec93680f889d7602e5f56a8d677d6a58ae6a%2Funsloth%20made%20with%20love.png?alt=media" alt="" width="188"><figcaption></figcaption></figure>

3. Let's download this image

{% code overflow="wrap" %}

4. Let's get the 2nd image at <https://files.worldwildlife.org/wwfcmsprod/images/Sloth_Sitting_iStock_3_12_2014/story_full_width/8l7pbjmj29_iStock_000011145477Large_mini__1_.jpg>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4b30cc86b2c75edf95ee1ec6fe0c51fb30afd6c0%2F8l7pbjmj29_iStock_000011145477Large_mini__1_.jpg?alt=media" alt="" width="188"><figcaption></figcaption></figure>

{% code overflow="wrap" %}

5. Then, let's use llama.cpp's auto model downloading feature, try this for the 8B Instruct model:

6. Once in, you will see the below screen:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-636dfd126430a8a8c91ef6d248b007daa34561c5%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

7. Load up the image via `/image PATH` ie `/image unsloth.png` then press ENTER

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7525265b8ef19c7fd17cca64d1b64ffe1959c2d1%2Fimage.png?alt=media" alt="" width="375"><figcaption></figcaption></figure>

8. When you hit ENTER, it'll say "unsloth.png image loaded"

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2c996efe3373ae7f05bfec4d214524768624a6a8%2Fimage.png?alt=media" alt="" width="375"><figcaption></figcaption></figure>

9. Now let's ask a question like "What is this image?":

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-62bd79e094c7daad6a8f021194aa0e67ef96f9a5%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

10. Now load in picture 2 via `/image picture.png` then hit ENTER and ask "What is this image?"

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-317cc2c7e41765ff466d357d14d506115f3262b6%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

11. And finally let's ask how are both images are related (it works!)

{% code overflow="wrap" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e323226293156ac17708836c635c6df3ab2b9ca3%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

12. You can also download the model via (after installing `pip install huggingface_hub hf_transfer` ) HuggingFace's `snapshot_download` which is useful for large model downloads, **since llama.cpp's auto downloader might lag.** You can choose Q4\_K\_M, or other quantized versions.

**Examples:**

Example 1 (bash):
```bash
export greedy='false'
export seed=3407
export top_p=0.8
export top_k=20
export temperature=0.7
export repetition_penalty=1.0
export presence_penalty=1.5
export out_seq_length=32768
```

Example 2 (bash):
```bash
export greedy='false'
export seed=1234
export top_p=0.95
export top_k=20
export temperature=1.0
export repetition_penalty=1.0
export presence_penalty=0.0
export out_seq_length=40960
```

Example 3 (unknown):
```unknown
terminate called after throwing an instance of 'std::runtime_error'
  what():  Value is not callable: null at row 63, column 78:
            {%- if '</think>' in content %}
                {%- set reasoning_content = ((content.split('</think>')|first).rstrip('\n').split('<think>')|last).lstrip('\n') %}
                                                                             ^
```

Example 4 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first
cp llama.cpp/build/bin/llama-* llama.cpp
```

---

## QwQ-32B: How to Run effectively

**URL:** llms-txt#qwq-32b:-how-to-run-effectively

**Contents:**
- :gear: Official Recommended Settings
- :thumbsup: Recommended settings for llama.cpp
- :sunny: Dry Repetition Penalty
- :llama: Tutorial: How to Run QwQ-32B in Ollama
- 📖 Tutorial: How to Run QwQ-32B in llama.cpp

How to run QwQ-32B effectively with our bug fixes and without endless generations + GGUFs.

Qwen released QwQ-32B - a reasoning model with performance comparable to DeepSeek-R1 on many [benchmarks](https://qwenlm.github.io/blog/qwq-32b/). However, people have been experiencing **infinite generations**, **many repetitions**, \<think> token issues and finetuning issues. We hope this guide will help debug and fix most issues!

{% hint style="info" %}
Our model uploads with our bug fixes work great for fine-tuning, vLLM and Transformers. If you're using llama.cpp and engines that use llama.cpp as backend, follow our [instructions here](#tutorial-how-to-run-qwq-32b) to fix endless generations.
{% endhint %}

**Unsloth QwQ-32B uploads with our bug fixes:**

| [GGUF](https://huggingface.co/unsloth/QwQ-32B-GGUF) | [Dynamic 4-bit](https://huggingface.co/unsloth/QwQ-32B-unsloth-bnb-4bit) | [BnB 4-bit](https://huggingface.co/unsloth/QwQ-32B-bnb-4bit) | [16-bit](https://huggingface.co/unsloth/QwQ-32B) |
| --------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------ |

## :gear: Official Recommended Settings

According to [Qwen](https://huggingface.co/Qwen/QwQ-32B), these are the recommended settings for inference:

* Temperature of 0.6
* Top\_K of 40 (or 20 to 40)
* Min\_P of 0.00 (optional, but 0.01 works well, llama.cpp default is 0.1)
* Top\_P of 0.95
* Repetition Penalty of 1.0. (1.0 means disabled in llama.cpp and transformers)
* Chat template: `<|im_start|>user\nCreate a Flappy Bird game in Python.<|im_end|>\n<|im_start|>assistant\n<think>\n`

{% hint style="warning" %}
`llama.cpp` uses `min_p = 0.1`by default, which might cause issues. Force it to 0.0.
{% endhint %}

## :thumbsup: Recommended settings for llama.cpp

We noticed many people use a `Repetition Penalty` greater than 1.0. For example 1.1 to 1.5. This actually interferes with llama.cpp's sampling mechanisms. The goal of a repetition penalty is to penalize repeated generations, but we found this doesn't work as expected.

Turning off `Repetition Penalty` also works (ie setting it to 1.0), but we found using it to be useful to penalize endless generations.

To use it, we found you must also edit the ordering of samplers in llama.cpp to before applying `Repetition Penalty`, otherwise there will be endless generations. So add this:

By default, llama.cpp uses this ordering:

We reorder essentially temperature and dry, and move min\_p forward. This means we apply samplers in this order:

If you still encounter issues, you can increase the`--repeat-penalty 1.0 to 1.2 or 1.3.`

Courtesy to [@krist486](https://x.com/krist486/status/1897885598196654180) for bringing llama.cpp sampling directions to my attention.

## :sunny: Dry Repetition Penalty

We investigated usage of `dry penalty` as suggested in <https://github.com/ggml-org/llama.cpp/blob/master/examples/main/README.md> using a value of 0.8, but we actually found this to **rather cause syntax issues especially for coding**. If you still encounter issues, you can increase the`dry penalty to 0.8.`

Utilizing our swapped sampling ordering can also help if you decide to use `dry penalty`.

## :llama: Tutorial: How to Run QwQ-32B in Ollama

1. Install `ollama` if you haven't already!

2. Run run the model! Note you can call `ollama serve`in another terminal if it fails! We include all our fixes and suggested parameters (temperature, min\_p etc) in `param` in our Hugging Face upload!

## 📖 Tutorial: How to Run QwQ-32B in llama.cpp

1. Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

2. Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose Q4\_K\_M, or other quantized versions (like BF16 full precision). More versions at: <https://huggingface.co/unsloth/QwQ-32B-GGUF>

**Examples:**

Example 1 (bash):
```bash
--samplers "top_k;top_p;min_p;temperature;dry;typ_p;xtc"
```

Example 2 (bash):
```bash
--samplers "dry;top_k;typ_p;top_p;min_p;xtc;temperature"
```

Example 3 (bash):
```bash
top_k=40
top_p=0.95
min_p=0.0
temperature=0.6
dry
typ_p
xtc
```

Example 4 (bash):
```bash
apt-get update
apt-get install pciutils -y
curl -fsSL https://ollama.com/install.sh | sh
```

---

## Reinforcement Learning (RL) Guide

**URL:** llms-txt#reinforcement-learning-(rl)-guide

**Contents:**
  - :sloth:What you will learn
- :question:What is Reinforcement Learning (RL)?
  - :person\_running:From RLHF, PPO to GRPO and RLVR
  - :fingers\_crossed:Luck (well Patience) Is All You Need
- :sloth:What Unsloth offers for RL
  - GRPO notebooks:

Learn all about Reinforcement Learning (RL) and how to train your own DeepSeek-R1 reasoning model with Unsloth using GRPO. A complete guide from beginner to advanced.

Reinforcement Learning is where an "agent" learns to make decisions by interacting with an environment and receiving **feedback** in the form of **rewards** or **penalties**.

* **Action:** What the model generates (e.g. a sentence).
* **Reward:** A signal indicating how good or bad the model's action was (e.g. did the response follow instructions? was it helpful?).
* **Environment:** The scenario or task the model is working on (e.g. answering a user’s question).

{% hint style="success" %}
**Nov 26 update:** We're introducing FP8 precision RL and GRPO in Unsloth! [Read blog](https://docs.unsloth.ai/new/fp8-reinforcement-learning)
{% endhint %}

### :sloth:What you will learn

1. What is RL? RLVR? PPO? GRPO? RLHF? RFT? Is <mark style="background-color:green;">**"Luck is All You Need?"**</mark> for RL?
2. What is an environment? Agent? Action? Reward function? Rewards?

This article covers everything (from beginner to advanced) you need to know about GRPO, Reinforcement Learning (RL) and reward functions, along with tips, and the basics of using GRPO with [Unsloth](https://github.com/unslothai/unsloth). If you're looking for a step-by-step tutorial for using GRPO, see our guide [here](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/tutorial-train-your-own-reasoning-model-with-grpo).

{% hint style="info" %}
For **advanced GRPO** documentation on batching, generation and training parameters, [read our guide!](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/advanced-rl-documentation)
{% endhint %}

## :question:What is Reinforcement Learning (RL)?

The goal of RL is to:

1. **Increase the chance of seeing&#x20;**<mark style="background-color:green;">**"good"**</mark>**&#x20;outcomes.**
2. **Decrease the chance of seeing&#x20;**<mark style="background-color:red;">**"bad"**</mark>**&#x20;outcomes.**

**That's it!** There are intricacies on what "good" and "bad" means, or how do we go about "increasing" or "decreasing" it, or what even "outcomes" means.

{% columns %}
{% column width="50%" %}
For example, in the **Pacman game**:

1. The <mark style="background-color:green;">**environment**</mark> is the game world.
2. The <mark style="background-color:blue;">**actions**</mark> you can take are UP, LEFT, RIGHT and DOWN.
3. The <mark style="background-color:purple;">**rewards**</mark> are good if you eat a cookie, or bad if you hit one of the squiggly enemies.
4. In RL, you can't know the "best action" you can take, but you can observe intermediate steps, or the final game state (win or lose)
   {% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e853f7e6da505ee587642314b98180ebf840252c%2FRL%20Game.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column width="50%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-30bade1550c877bb7f79075c80ac79476b0ecd76%2FMath%20RL.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
Another example is imagine you are given the question: <mark style="background-color:blue;">**"What is 2 + 2?"**</mark> (4) An unaligned language model will spit out 3, 4, C, D, -10, literally anything.

1. Numbers are better than C or D right?
2. Getting 3 is better than say 8 right?
3. Getting 4 is definitely correct.

We just designed a <mark style="background-color:orange;">**reward function**</mark>!
{% endcolumn %}
{% endcolumns %}

### :person\_running:From RLHF, PPO to GRPO and RLVR

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5d0c90e4b45507d3e12c8b938cbd1679cd38f4f9%2FRLHF.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
OpenAI popularized the concept of [RLHF](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback) (Reinforcement Learning from Human Feedback), where we train an <mark style="background-color:red;">**"agent"**</mark> to produce outputs to a question (the <mark style="background-color:yellow;">**state**</mark>) that are rated more useful by human beings.

The thumbs up and down in ChatGPT for example can be used in the RLHF process.
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1e1dff9c921e787e669dee79c41a76db89e882e7%2FPPO.png?alt=media" alt=""><figcaption></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f6156f2c519baf81e6ef286476f4092037303799%2FPPO%20formula.png?alt=media" alt=""><figcaption><p>PPO formula</p></figcaption></figure>

The clip(..., 1-e, 1+e) term is used to force PPO not to take too large changes. There is also a KL term with beta set to > 0 to force the model not to deviate too much away.
{% endcolumn %}

{% column %}
In order to do RLHF, [<mark style="background-color:red;">**PPO**</mark>](https://en.wikipedia.org/wiki/Proximal_policy_optimization) (Proximal policy optimization) was developed. The <mark style="background-color:blue;">**agent**</mark> is the language model in this case. In fact it's composed of 3 systems:

1. The **Generating Policy (current trained model)**
2. The **Reference Policy (original model)**
3. The **Value Model (average reward estimator)**

We use the **Reward Model** to calculate the reward for the current environment, and our goal is to **maximize this**!

The formula for PPO looks quite complicated because it was designed to be stable. Visit our [AI Engineer talk](https://docs.unsloth.ai/ai-engineers-2025) we gave in 2025 about RL for more in depth maths derivations about PPO.
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4f4e188edbcad4f53aaa4a626bc5b2fd01334574%2FGRPO%20%2B%20RLVR.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
DeepSeek developed [<mark style="background-color:red;">**GRPO**</mark>](https://unsloth.ai/blog/grpo) (Group Relative Policy Optimization) to train their R1 reasoning models. The key differences to PPO are:

1. The **Value Model is removed,** replaced with statistics from calling the reward model multiple times.
2. The **Reward Model is removed** and replaced with just custom reward function which <mark style="background-color:blue;">**RLVR**</mark> can be used.
   {% endcolumn %}
   {% endcolumns %}

This means GRPO is extremely efficient. Previously PPO needed to train multiple models - now with the reward model and value model removed, we can save memory and speed up everything.

<mark style="background-color:orange;">**RLVR (Reinforcement Learning with Verifiable Rewards)**</mark> allows us to reward the model based on tasks with easy to verify solutions. For example:

1. Maths equations can be easily verified. Eg 2+2 = 4.
2. Code output can be verified as having executed correctly or not.
3. Designing verifiable reward functions can be tough, and so most examples are math or code.
4. Use-cases for GRPO isn’t just for code or math—its reasoning process can enhance tasks like email automation, database retrieval, law, and medicine, greatly improving accuracy based on your dataset and reward function - the trick is to define a <mark style="background-color:yellow;">**rubric - ie a list of smaller verifiable rewards, and not a final all consuming singular reward.**</mark> OpenAI popularized this in their [reinforcement learning finetuning (RFT)](https://platform.openai.com/docs/guides/reinforcement-fine-tuning) offering for example.

{% columns %}
{% column %} <mark style="background-color:red;">**Why "Group Relative"?**</mark>

GRPO removes the value model entirely, but we still need to estimate the <mark style="background-color:yellow;">**"average reward"**</mark> given the current state.

The **trick is to sample the LLM**! We then calculate the average reward through statistics of the sampling process across multiple different questions.
{% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-29e188e5adc6de1e62c841e6cd9e34a2dae4994a%2FGroup%20Relative.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column %}
For example for "What is 2+2?" we sample 4 times. We might get 4, 3, D, C. We then calculate the reward for each of these answers, then calculate the **average reward** and **standard deviation**, then <mark style="background-color:red;">**Z-score standardize**</mark> this!

This creates the <mark style="background-color:blue;">**advantages A**</mark>, which we will use in replacement of the value model. This saves a lot of memory!
{% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-d40a73cd48b05b9205810a1946f4fc1dce81ae7d%2FStatistics.png?alt=media" alt=""><figcaption><p>GRPO advantage calculation</p></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### :fingers\_crossed:Luck (well Patience) Is All You Need

The trick of RL is you need 2 things only:

1. A question or instruction eg "What is 2+2?" "Create a Flappy Bird game in Python"
2. A reward function and verifier to verify if the output is good or bad.

With only these 2, we can essentially **call a language model an infinite times** until we get a good answer. For example for "What is 2+2?", an untrained bad language model will output:

***0, cat, -10, 1928, 3, A, B, 122, 17, 182, 172, A, C, BAHS, %$, #, 9, -192, 12.31\*\*\*\*\*\*\*\*&#x20;**<mark style="color:green;">**then suddenly 4**</mark>**.***

***The reward signal was 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0\*\*\*\*\*\*\*\*&#x20;**<mark style="color:green;">**then suddenly 1.**</mark>*

So by luck and by chance, RL managed to find the correct answer across multiple <mark style="background-color:yellow;">**rollouts**</mark>. Our goal is we want to see the good answer 4 more, and the rest (the bad answers) much less.

<mark style="color:blue;">**So the goal of RL is to be patient - in the limit, if the probability of the correct answer is at least a small number (not zero), it's just a waiting game - you will 100% for sure encounter the correct answer in the limit.**</mark>

<mark style="background-color:blue;">**So I like to call it as "Luck Is All You Need" for RL.**</mark>

<mark style="background-color:orange;">**Well a better phrase is "Patience is All You Need" for RL.**</mark>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4f0cb4803aa22583e88dfa8de8061b66bbe6a6b1%2FLuck%20is%20all%20you%20need.png?alt=media" alt="" width="375"><figcaption></figcaption></figure>

RL essentially provides us a trick - instead of simply waiting for infinity, we do get "bad signals" ie bad answers, and we can essentially "guide" the model to already try not generating bad solutions. This means although you waited very long for a "good" answer to pop up, the model already has been changed to try its best not to output bad answers.

In the "What is 2+2?" example - ***0, cat, -10, 1928, 3, A, B, 122, 17, 182, 172, A, C, BAHS, %$, #, 9, -192, 12.31\*\*\*\*\*\*\*\*&#x20;**<mark style="color:green;">**then suddenly 4**</mark>**.***

Since we got bad answers, RL will influence the model to try NOT to output bad answers. This means over time, we are carefully "pruning" or moving the model's output distribution away from bad answers. This means RL is <mark style="color:blue;">**efficient**</mark>, since we are NOT just waiting for infinity, but we are actively trying to "push" the model to go as much as possible to the "correct answer space".

{% hint style="danger" %}
**If the probability is always 0, then RL will never work**. This is also why people like to do RL from an already instruction finetuned model, which can partially follow instructions reasonably well - this boosts the probability most likely above 0.
{% endhint %}

## :sloth:What Unsloth offers for RL

* With 15GB VRAM, Unsloth allows you to transform any model up to 17B parameters like Llama 3.1 (8B), Phi-4 (14B), Mistral (7B) or Qwen2.5 (7B) into a reasoning model
* **Unsloth now supports** [**RL for Vision/multimodal**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/vision-reinforcement-learning-vlm-rl) **models!**
* **Minimum requirement:** Just  5GB VRAM is enough to train your own reasoning model locally (for any model with 1.5B parameters or less)

{% content-ref url="reinforcement-learning-rl-guide/tutorial-train-your-own-reasoning-model-with-grpo" %}
[tutorial-train-your-own-reasoning-model-with-grpo](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/tutorial-train-your-own-reasoning-model-with-grpo)
{% endcontent-ref %}

| [**gpt-oss-20b**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) **GSPO -** new | [**Qwen3-VL-8B**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision-GRPO.ipynb) - Vision **GSPO** - new | [Gemma 3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision-GRPO.ipynb) - Vision GSPO - new   |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Qwen3 (4B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-GRPO.ipynb) - Advanced         | [**DeepSeek-R1-0528-Qwen3-8B**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/DeepSeek_R1_0528_Qwen3_\(8B\)_GRPO.ipynb)    | [Llama 3.2 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Advanced_Llama3_2_\(3B\)_GRPO_LoRA.ipynb) - Advanced |
| [Gemma 3 (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(1B\)-GRPO.ipynb)                     | [Phi-4 (14B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_4_\(14B\)-GRPO.ipynb)                                      | [Qwen2.5 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_\(3B\)-GRPO.ipynb)                             |
| [Mistral v0.3 (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-GRPO.ipynb)          | [Llama 3.1 (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_\(8B\)-GRPO.ipynb)                                 |                                                                                                                                                 |

{% hint style="success" %}
**NEW!** We now support [**GSPO**](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/gspo-reinforcement-learning) and most other new GRPO techniques. You can play with the following arguments in GRPOConfig to enable:

```python
epsilon=0.2,
epsilon_high=0.28, # one sided
delta=1.5 # two sided

---

## Saving to GGUF

**URL:** llms-txt#saving-to-gguf

Saving models to 16bit for GGUF so you can use it for Ollama, Jan AI, Open WebUI and more!

{% tabs %}
{% tab title="Locally" %}
To save to GGUF, use the below to save locally:

To push to Hugging Face hub:

All supported quantization options for `quantization_method` are listed below:

**Examples:**

Example 1 (python):
```python
model.save_pretrained_gguf("directory", tokenizer, quantization_method = "q4_k_m")
model.save_pretrained_gguf("directory", tokenizer, quantization_method = "q8_0")
model.save_pretrained_gguf("directory", tokenizer, quantization_method = "f16")
```

Example 2 (python):
```python
model.push_to_hub_gguf("hf_username/directory", tokenizer, quantization_method = "q4_k_m")
model.push_to_hub_gguf("hf_username/directory", tokenizer, quantization_method = "q8_0")
```

---

## Troubleshooting Inference

**URL:** llms-txt#troubleshooting-inference

**Contents:**
  - Running in Unsloth works well, but after exporting & running on other platforms, the results are poor
  - Saving to `safetensors`, not `bin` format in Colab
  - If saving to GGUF or vLLM 16bit crashes

If you're experiencing issues when running or saving your model.

### Running in Unsloth works well, but after exporting & running on other platforms, the results are poor

You might sometimes encounter an issue where your model runs and produces good results on Unsloth, but when you use it on another platform like Ollama or vLLM, the results are poor or you might get gibberish, endless/infinite generations *or* repeated output&#x73;**.**

* The most common cause of this error is using an <mark style="background-color:blue;">**incorrect chat template**</mark>**.** It’s essential to use the SAME chat template that was used when training the model in Unsloth and later when you run it in another framework, such as llama.cpp or Ollama. When inferencing from a saved model, it's crucial to apply the correct template.
* You must use the correct `eos token`. If not, you might get gibberish on longer generations.
* It might also be because your inference engine adds an unnecessary "start of sequence" token (or the lack of thereof on the contrary) so ensure you check both hypotheses!
* <mark style="background-color:green;">**Use our conversational notebooks to force the chat template - this will fix most issues.**</mark>
  * Qwen-3 14B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(14B\)-Reasoning-Conversational.ipynb)
  * Gemma-3 4B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\).ipynb)
  * Llama-3.2 3B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(1B_and_3B\)-Conversational.ipynb)
  * Phi-4 14B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_4-Conversational.ipynb)
  * Mistral v0.3 7B Conversational notebook [**Open in Colab**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-Conversational.ipynb)
  * **More notebooks in our** [**notebooks repo**](https://github.com/unslothai/notebooks)**.**

### Saving to `safetensors`, not `bin` format in Colab

We save to `.bin` in Colab so it's like 4x faster, but set `safe_serialization = None` to force saving to `.safetensors`. So `model.save_pretrained(..., safe_serialization = None)` or `model.push_to_hub(..., safe_serialization = None)`

### If saving to GGUF or vLLM 16bit crashes

You can try reducing the maximum GPU usage during saving by changing `maximum_memory_usage`.

The default is `model.save_pretrained(..., maximum_memory_usage = 0.75)`. Reduce it to say 0.5 to use 50% of GPU peak memory or lower. This can reduce OOM crashes during saving.

---

## Tutorials: How To Fine-tune & Run LLMs

**URL:** llms-txt#tutorials:-how-to-fine-tune-&-run-llms

Learn how to run and/or fine-tune models for optimal performance 100% locally with Unsloth.

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-cover data-type="image">Cover image</th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="functiongemma">FunctionGemma</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FSOnbpmZisRLEOOfZYhpF%2Ffunctiongemmaa.png?alt=media&#x26;token=0fab5034-ed84-4199-a256-29da6fe1c164">functiongemmaa.png</a></td><td><a href="functiongemma">functiongemma</a></td></tr><tr><td><a href="nemotron-3">Nemotron 3 Nano</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F5AeVpAiKFQAgLpA7caad%2Fnemotron%20nano%203%20promo.png?alt=media&#x26;token=e2f879a3-cf82-4253-8d62-9f0c0ac69375">nemotron nano 3 promo.png</a></td><td><a href="nemotron-3">nemotron-3</a></td></tr><tr><td><a href="ministral-3">Ministral 3</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FdCdRGR8KYGpooEXYHJo2%2Fministral%203%20logo.png?alt=media&#x26;token=79d76c89-b954-4dbd-8e1c-c1bdcf90b9a4">ministral 3 logo.png</a></td><td><a href="ministral-3">ministral-3</a></td></tr><tr><td><a href="kimi-k2-thinking-how-to-run-locally">Kimi K2 Thinking</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e4c3764508e91e7a98e2d98373bab8830935be13%2Fkimi%20k2%20thinking%20logo.png?alt=media">kimi k2 thinking logo.png</a></td><td><a href="kimi-k2-thinking-how-to-run-locally">kimi-k2-thinking-how-to-run-locally</a></td></tr><tr><td><a href="deepseek-ocr-how-to-run-and-fine-tune">DeepSeek-OCR</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4ef500f68903e0a800643c2be417d1fd879c9504%2Fdeepseek%20ocr%20logo.png?alt=media">deepseek ocr logo.png</a></td><td><a href="deepseek-ocr-how-to-run-and-fine-tune">deepseek-ocr-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="qwen3-vl-how-to-run-and-fine-tune">Qwen3-VL</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-72d99575af3aa1efc604082921964f68123c37a5%2Fqwen3-vl%20promo.png?alt=media">qwen3-vl promo.png</a></td><td><a href="qwen3-vl-how-to-run-and-fine-tune">qwen3-vl-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="../get-started/reinforcement-learning-rl-guide/vision-reinforcement-learning-vlm-rl">Vision Reinforcement Learning</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e57995d6adb92b887f1d48c80362720fc997a73b%2Fvision%20rl%20site.png?alt=media">vision rl site.png</a></td><td><a href="../get-started/reinforcement-learning-rl-guide/vision-reinforcement-learning-vlm-rl">vision-reinforcement-learning-vlm-rl</a></td></tr><tr><td><a href="deepseek-v3.1-how-to-run-locally">DeepSeek-V3.1</a> Terminus</td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ff07aa43d4802064b63ed18cde1f6454c9048089%2Fdeepseek%20v3.1%20logo.png?alt=media">deepseek v3.1 logo.png</a></td><td><a href="deepseek-v3.1-how-to-run-locally">deepseek-v3.1-how-to-run-locally</a></td></tr><tr><td><a href="gpt-oss-how-to-run-and-fine-tune">Run gpt-oss</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1b3ddd70a1e3807dbaa1d16de8698737a89747ff%2Fgpt-oss%20image.png?alt=media">gpt-oss image.png</a></td><td><a href="gpt-oss-how-to-run-and-fine-tune">gpt-oss-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="qwen3-coder-how-to-run-locally">Qwen3 Coder</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-bee47a23ff14ed5c107787f0f4fc4182d13ede15%2Fqwen3-coder%201920.png?alt=media">qwen3-coder 1920.png</a></td><td><a href="qwen3-coder-how-to-run-locally">qwen3-coder-how-to-run-locally</a></td></tr><tr><td><a href="gpt-oss-how-to-run-and-fine-tune/tutorial-how-to-fine-tune-gpt-oss">Fine-tune gpt-oss</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-495aa06ef608a2311a76f81fb856a96b8df34087%2Fsloth%20with%20comp.png?alt=media">sloth with comp.png</a></td><td><a href="gpt-oss-how-to-run-and-fine-tune/tutorial-how-to-fine-tune-gpt-oss">tutorial-how-to-fine-tune-gpt-oss</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/magistral-how-to-run-and-fine-tune">Magistral 1.2</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3ea62a89f90e8765b1866e5198bb5ec162d48b16%2Fmagistral%20center.png?alt=media">magistral center.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/magistral-how-to-run-and-fine-tune">magistral-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="gemma-3-how-to-run-and-fine-tune/gemma-3n-how-to-run-and-fine-tune">Gemma 3n</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3edced131df4d2030d97ca9c48acdb654eedad4f%2FGemma%203%20text%20only.png?alt=media">Gemma 3 text only.png</a></td><td><a href="gemma-3-how-to-run-and-fine-tune/gemma-3n-how-to-run-and-fine-tune">gemma-3n-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="qwen3-next"><strong>Qwen3-2507</strong></a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a3db5755f59934b300da12c4d9a64f13ad8de3f3%2Fqwen3-2507.png?alt=media">qwen3-2507.png</a></td><td><a href="qwen3-next">qwen3-next</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/deepseek-r1-0528-how-to-run-locally">DeepSeek-R1-0528</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-398714041a6ff80d291b1ce0c7ef6541a8bff4aa%2Fdeepseek%20r1-0528.png?alt=media">deepseek r1-0528.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/deepseek-r1-0528-how-to-run-locally">deepseek-r1-0528-how-to-run-locally</a></td></tr><tr><td><a href="kimi-k2-thinking-how-to-run-locally">Kimi K2</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-55660e8be362c073f7bb1ca4a95e05f4cd863469%2Fkimik2%20landcsape.png?alt=media">kimik2 landcsape.png</a></td><td><a href="kimi-k2-thinking-how-to-run-locally">kimi-k2-thinking-how-to-run-locally</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/devstral-how-to-run-and-fine-tune">Devstral 2507</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a7fe4299d9980650d28e332f463bbe90e0835dd0%2Fdevstral%20logo.png?alt=media">devstral logo.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/devstral-how-to-run-and-fine-tune">devstral-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="../basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth">Fine-tune on Blackwell &#x26; RTX 50 GPUs</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5d99af1e3e582338ee06c9ea4a7f7dee4ab3acd6%2Fnvidia-logo-white%20background.png?alt=media">nvidia-logo-white background.png</a></td><td><a href="../basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth">fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth</a></td></tr><tr><td><a href="../basics/text-to-speech-tts-fine-tuning">TTS Fine-tuning</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-756c5d79b2e1b57a0f761e85dd7f16d04a5b9473%2Ftts%20finetuning%20landscape.png?alt=media">tts finetuning landscape.png</a></td><td><a href="../basics/text-to-speech-tts-fine-tuning">text-to-speech-tts-fine-tuning</a></td></tr><tr><td><a href="qwen3-how-to-run-and-fine-tune">Qwen3</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-183d5c53b411de2cea205cb9a898acd1da290919%2Fqwen3.png?alt=media">qwen3.png</a></td><td><a href="qwen3-how-to-run-and-fine-tune">qwen3-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/phi-4-reasoning-how-to-run-and-fine-tune">Phi-4 reasoning</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2d90fb4bb4655d3cc51bf91e1a10da073aceb424%2Fphi4%20reasoning2.png?alt=media">phi4 reasoning2.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/phi-4-reasoning-how-to-run-and-fine-tune">phi-4-reasoning-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="https://github.com/unslothai/docs/blob/main/basics/unsloth-dynamic-2.0-ggufs">Dynamic 2.0 GGUFs</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-15a453d8ab8d1914bfe9cca781e8495a8f0cf98a%2Fdynamic%20v2%20with%20unsloth.png?alt=media">dynamic v2 with unsloth.png</a></td><td><a href="https://github.com/unslothai/docs/blob/main/basics/unsloth-dynamic-2.0-ggufs">https://github.com/unslothai/docs/blob/main/basics/unsloth-dynamic-2.0-ggufs</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/llama-4-how-to-run-and-fine-tune">Llama 4</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ac8efc4f6648b524214c27042e35971b48083608%2Fllama%204%20only.png?alt=media">llama 4 only.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/llama-4-how-to-run-and-fine-tune">llama-4-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/deepseek-v3-0324-how-to-run-locally">DeepSeek-V3-0324</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-286e3e541ecf3a096b5a0136e464a174d966f81c%2Fv30324.png?alt=media">v30324.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/deepseek-v3-0324-how-to-run-locally">deepseek-v3-0324-how-to-run-locally</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/grok-2">Grok 2</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-9d1d6418829a2ea1f0fa3b14f44afc6519f8b991%2Fgrok%202%20logo.png?alt=media">grok 2 logo.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/grok-2">grok-2</a></td></tr><tr><td><a href="gemma-3-how-to-run-and-fine-tune">Gemma 3</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-55aa06d8eb6b3b831e1d78f9998ec4d8efec0a0b%2Fgemma%203%20logo.png?alt=media">gemma 3 logo.png</a></td><td><a href="gemma-3-how-to-run-and-fine-tune">gemma-3-how-to-run-and-fine-tune</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/qwq-32b-how-to-run-effectively">QwQ-32B</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-674d877c9685ac88e94c87f04ffd40bd7cf92653%2Fqwq%20logo%20only.png?alt=media">qwq logo only.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/qwq-32b-how-to-run-effectively">qwq-32b-how-to-run-effectively</a></td></tr><tr><td><a href="tutorials-how-to-fine-tune-and-run-llms/deepseek-r1-how-to-run-locally">DeepSeek-R1</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a52bd4654a2f069a5c65b6f48a0729c0d4a08211%2Fdeepseek%20r1.png?alt=media">deepseek r1.png</a></td><td><a href="tutorials-how-to-fine-tune-and-run-llms/deepseek-r1-how-to-run-locally">deepseek-r1-how-to-run-locally</a></td></tr><tr><td><a href="../get-started/reinforcement-learning-rl-guide">Reinforcement Learning (RL)</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-dd099bc8ea537c59f104a71021f28f1458303c23%2Frl%20guide%20new.png?alt=media">rl guide new.png</a></td><td><a href="../get-started/reinforcement-learning-rl-guide/tutorial-train-your-own-reasoning-model-with-grpo">tutorial-train-your-own-reasoning-model-with-grpo</a></td></tr><tr><td><a href="https://www.unsloth.ai/blog/mistral-small-3.1">Mistral Small 3.1</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-54ce6230652c7a5a4421019c9e78feb0652f9def%2Fmistral%20small%203.1.png?alt=media">mistral small 3.1.png</a></td><td><a href="https://www.unsloth.ai/blog/mistral-small-3.1">https://www.unsloth.ai/blog/mistral-small-3.1</a></td></tr><tr><td><a href="../get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama">Llama 3</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-363677e7a2a06bebbf47651776b1982c85efcc95%2Fllama%203logo.png?alt=media">llama 3logo.png</a></td><td><a href="../get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama">tutorial-how-to-finetune-llama-3-and-use-in-ollama</a></td></tr><tr><td><a href="../basics/vision-fine-tuning">Vision Fine-tuning</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-7920bd48ca2e5853a4da3260e2d6383ebb3f4f77%2Fllama_3.2_vision_large_rectangle_jPUNULJrVe5O4AvDDWO1M.webp?alt=media">llama_3.2_vision_large_rectangle_jPUNULJrVe5O4AvDDWO1M.webp</a></td><td><a href="../basics/vision-fine-tuning">vision-fine-tuning</a></td></tr><tr><td><a href="../basics/continued-pretraining">Continued Pretraining</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-67372072ccfb8f3754ebe061457d2b113ed36ccc%2Fcontinued_pretraining_just_graph_HC0ALBypfCXyUUXClYPiN.webp?alt=media">continued_pretraining_just_graph_HC0ALBypfCXyUUXClYPiN.webp</a></td><td><a href="../basics/continued-pretraining">continued-pretraining</a></td></tr><tr><td><a href="https://unsloth.ai/blog/llama3-3">Llama 3.3</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5707b8f8a8863be773aa07f8733e1cde0dd6bcc4%2Fllama_3.3_website_9hQURhj6KfZ7EnBRaKbiu.webp?alt=media">llama_3.3_website_9hQURhj6KfZ7EnBRaKbiu.webp</a></td><td><a href="https://unsloth.ai/blog/llama3-3">https://unsloth.ai/blog/llama3-3</a></td></tr><tr><td><a href="https://unsloth.ai/blog/gemma2">Gemma 2</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-5522df8efc21f7ef1b56d50497cddc692741e2ce%2Fgemma_2_long_OKsRGiTB8vrcIyXNWdgMw.avif?alt=media">gemma_2_long_OKsRGiTB8vrcIyXNWdgMw.avif</a></td><td><a href="https://unsloth.ai/blog/gemma2">https://unsloth.ai/blog/gemma2</a></td></tr><tr><td><a href="https://unsloth.ai/blog/phi3">Phi-3</a></td><td><a href="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-eb6cb4c699a505b419f6b71c1ead33898891e02f%2Fphi3_unsloth_ynBY7FG3NTjIbS11ozN_g.webp?alt=media">phi3_unsloth_ynBY7FG3NTjIbS11ozN_g.webp</a></td><td><a href="https://unsloth.ai/blog/phi3">https://unsloth.ai/blog/phi3</a></td></tr></tbody></table>

---

## Unsloth Dynamic GGUFs on Aider Polyglot

**URL:** llms-txt#unsloth-dynamic-ggufs-on-aider-polyglot

**Contents:**
  - ⭐**Key results**
- 🦥Unsloth Dynamic Quantization
  - ⚙️Benchmark setup
- :sparkler:Comparison to other quants
  - :cake:Dynamic quantization ablations
  - :bug:Chat Template Bug Fixes
  - :bar\_chart:Pass Rate 1
- :computer:Run DeepSeek V3.1 Dynamic quants

Performance of Unsloth Dynamic GGUFs on Aider Polyglot Benchmarks

We’re excited to showcase how Unsloth Dynamic GGUFs makes it possible to quantize LLMs like [DeepSeek-V3.1](https://docs.unsloth.ai/models/deepseek-v3.1-how-to-run-locally) (671B) down to just **1-bit** or **3-bit**, and still be able to outperform SOTA models like **GPT-4.5, GPT-4.1** (April 2025) and **Claude-4-Opus** (May 2025).

Previously, [we demonstrated](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) how Unsloth Dynamic GGUFs outperform other quantization methods on 5-shot MMLU and KL Divergence. Now, we’re showcasing their performance on independent third-party evaluations using the **Aider Polyglot** **benchmark.**

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a114143bdd47add988182aabf9313ab40be38d7d%2Faider%20thinking.png?alt=media" alt="" width="563"><figcaption><p>Thinking Aider Benchmarks</p></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b085c16c7f8351308229f1341846cbf1a2617d0a%2Faider%20non.png?alt=media" alt="" width="563"><figcaption><p>No Thinking Aider Benchmarks</p></figcaption></figure></div>

* Our **1-bit** Unsloth Dynamic GGUF shrinks DeepSeek-V3.1 from **671GB → 192GB (-75% size)** and no-thinking mode greatly outperforms GPT-4.1 (Apr 2025), GPT-4.5, and DeepSeek-V3-0324.
* **3-bit** Unsloth DeepSeek-V3.1 (thinking) GGUF: Outperforms Claude-4-Opus-20250514 (thinking).
* **5-bit** Unsloth DeepSeek-V3.1 (non-thinking) GGUF: Matches Claude-4-Opus-20250514 (non-thinking) performance.
* Unsloth Dynamic GGUFs perform consistently better than other non-Unsloth Dynamic imatrix GGUFs
* Other non-Unsloth 1-bit and 2-bit DeepSeek-V3.1 quantizations, as well as standard 1-bit quantization without selective layer quantization, either failed to load or produced gibberish and looping outputs. This highlights how Unsloth Dynamic GGUFs are able to largely retain accuracy whereas other methods do not even function.

**Why the** [**Aider Polyglot**](https://aider.chat/docs/leaderboards/) **benchmark?** Aider is one of the most comprehensive measures of how well LLMs can write, code, follow instructions, and apply changes without human intervention, making it one of the hardest and most valuable benchmarks for real-world use.

{% hint style="success" %}
The **key advantage** of using the Unsloth package and models is our active role in ***fixing critical bugs*** in major models. We've collaborated directly with teams behind [Qwen3](https://www.reddit.com/r/LocalLLaMA/comments/1kaodxu/qwen3_unsloth_dynamic_ggufs_128k_context_bug_fixes/), [Meta (Llama 4)](https://github.com/ggml-org/llama.cpp/pull/12889), [Mistral (Devstral)](https://app.gitbook.com/o/HpyELzcNe0topgVLGCZY/s/xhOjnexMCB3dmuQFQ2Zq/~/changes/618/basics/tutorials-how-to-fine-tune-and-run-llms/devstral-how-to-run-and-fine-tune), [Google (Gemma 1–3)](https://news.ycombinator.com/item?id=39671146) and [Microsoft (Phi-3/4)](https://simonwillison.net/2025/Jan/11/phi-4-bug-fixes), contributing essential fixes that significantly boost accuracy.
{% endhint %}

## 🦥Unsloth Dynamic Quantization

{% hint style="success" %}
**Dynamic 1 bit makes important layers in 8 or 16 bits and un-important layers in 1,2,3,4,5 or 6bits.**
{% endhint %}

In Nov 2024, our [4-bit Dynamic](https://unsloth.ai/blog/dynamic-4bit) Quants showcased how you could largely restore QLoRA fine-tuning & model accuracy by just <mark style="background-color:green;">**selectively quantizing layers**</mark>. We later studied [DeepSeek-R1](https://docs.unsloth.ai/models/tutorials-how-to-fine-tune-and-run-llms/deepseek-r1-how-to-run-locally)'s architecture and applied this similar methodology, where we quantized some layers to as low as 1-bit and important layers to higher bits (6, 8-bit). This approach quickly gained popularity and has proven especially effective for MoE models, making dynamic quantization the de facto for MoE quantization.

Our Dynamic GGUFs are even more effective when paired with our [imatrix calibration dataset](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs/..#whats-new-in-dynamic-v2.0), designed for chat and coding performance. All of this enabled extreme LLM compression without catastrophic loss in quality.

For example in Qwen2-VL-2B-Instruct, naively quantizing all layers to 4bit causes the model to fail understanding the image below. It's a train, not a coastal scene!

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-379bd5cc72a8f8e9acb4b6a6ad9fe847bf1ec296%2FTrain_NPovU814oJVjqy9Gu3BSm.avif?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-38f5ea51c343a79bde7996d678761944f1dedaa7%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

We also showed dynamic benchmarks in <https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs> for Gemma 3 and Llama 4 Scout, showing how effective our methodology is:

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-28c5aa4355f5c09aef43217f2a02131aa6e3517f%2Fimage.avif?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-db47ebf519863f334f58c925dd6b39d0e01c359b%2Fimage.avif?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### ⚙️Benchmark setup

For our DeepSeek-V3.1 experiments, we compared different bits of **Unsloth Dynamic GGUFs** against:

* **Full-precision, unquantized LLMs** including GPT 4.5, 4.1, Claude-4-Opus, DeepSeek-V3-0324 etc.
* ***Other*****&#x20;dynamic imatrix V3.1 GGUFs**
* ***Semi-*****dynamic** (some selective layer quantization) imatrix V3.1 GGUFs for **ablation purposes**.

Benchmark experiments were mainly conducted by [David Sluys](https://www.linkedin.com/in/david-sluys-231348208/) (neolithic5452 on [Aider Discord](https://discord.com/channels/1131200896827654144/1408293692074360914)), a trusted community contributor to Aider Polyglot evaluations. Tests were run \~3 times and averaged for a median score, and the Pass-2 accuracy is reported as by convention. There are some reproducible benchmark code snippets in Aider's Discord.

<summary>Expand for Reasoning model Aider benchmarks</summary>

| Model                             | Accuracy |
| --------------------------------- | -------- |
| GPT-5                             | 86.7     |
| Gemini 2.5 Pro (June)             | 83.1     |
| o3                                | 76.9     |
| DeepSeek V3.1                     | 76.1     |
| **(3 bit) DeepSeek V3.1 Unsloth** | **75.6** |
| Claude-4-Opus (May)               | 72       |
| o4-mini (High)                    | 72       |
| DeepSeek R1 0528                  | 71.4     |
| **(2 bit) DeepSeek V3.1 Unsloth** | **66.7** |
| Claude-3.7-Sonnet (Feb)           | 64.9     |
| **(1 bit) DeepSeek V3.1 Unsloth** | **57.8** |
| DeepSeek R1                       | 56.9     |

<summary>Expand for Non Reasoning model Aider benchmarks</summary>

| Model                             | Accuracy |
| --------------------------------- | -------- |
| DeepSeek V3.1                     | 71.6     |
| Claude-4-Opus (May)               | 70.7     |
| **(5 bit) DeepSeek V3.1 Unsloth** | **70.7** |
| **(4 bit) DeepSeek V3.1 Unsloth** | **69.7** |
| **(3 bit) DeepSeek V3.1 Unsloth** | **68.4** |
| **(2 bit) DeepSeek V3.1 Unsloth** | **65.8** |
| Qwen3 235B A22B                   | 59.6     |
| Kimi K2                           | 59.1     |
| **(1 bit) DeepSeek V3.1 Unsloth** | **55.7** |
| DeepSeek V3-0324                  | 55.1     |
| GPT-4.1 (April, 2025)             | 52.4     |
| ChatGPT 4o (March, 2025)          | 45.3     |
| GPT-4.5                           | 44.9     |

DeepSeek V3.1 has both a reasoning and a non reasoning mode, and we test both. For non reasoning, we see a clear trend of how our dynamic quantizations perform below. dynamic 5-bit attains 70.7% on Aider Pass-2, whilst dynamic 1-bit attains 55.7%. In terms of size and accuracy, the 3 and 4bit are extremely powerful!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b085c16c7f8351308229f1341846cbf1a2617d0a%2Faider%20non.png?alt=media" alt=""><figcaption></figcaption></figure>

## :sparkler:Comparison to other quants

We also run the Aider Polyglot benchmark on other dynamic imatrix GGUFs from the community and compare it to ours. To ensure a **fair comparison**, we do the following:

1. We select similar sized files and bit types to each Unsloth quant.
2. We use our **fixed chat template** if the community quant fails to execute the benchmark. We found some community quants `{"code":500,"message":"split method must have between 1 and 1 positional arguments and between 0 and 0 keyword arguments at row 3, column 1908"}`, and this gets fixed by using our fixed chat template.

We see Unsloth dynamic quants doing remarkably well when compared to other community quantization for the same model size and quant type!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-bbebbacfa75126d246c3ca1ed2ca269bc815b028%2FOther%20quants.png?alt=media" alt=""><figcaption></figcaption></figure>

<summary>Expand for raw numerical data comparison to other quants</summary>

<table><thead><tr><th width="109.25">Quant</th><th width="171.25006103515625">Quant Size (GB)</th><th>Unsloth Accuracy %</th><th>Comparison Accuracy %</th></tr></thead><tbody><tr><td>IQ2_XXS</td><td>164</td><td></td><td>43.6</td></tr><tr><td>TQ1_0</td><td>170</td><td>50.7</td><td></td></tr><tr><td>IQ1_M</td><td>206</td><td>55.7</td><td></td></tr><tr><td>IQ2_M</td><td>215</td><td></td><td>56.6</td></tr><tr><td>IQ2_XXS</td><td>225</td><td>61.2</td><td></td></tr><tr><td>IQ2_M</td><td>235</td><td>64.3</td><td></td></tr><tr><td>Q2_K_L</td><td>239</td><td></td><td>64.0</td></tr><tr><td>Q2_K_XL</td><td>255</td><td>65.8</td><td></td></tr><tr><td>IQ3_XXS</td><td>268</td><td>65.6</td><td>65.6</td></tr><tr><td>IQ3_XXS</td><td>279</td><td>66.8</td><td></td></tr><tr><td>Q3_K_S</td><td>293</td><td></td><td>65.2</td></tr><tr><td>Q3_K_XL</td><td>300</td><td>68.4</td><td></td></tr><tr><td>IQ4_XS</td><td>357</td><td>69.2</td><td></td></tr><tr><td>IQ4_XS</td><td>360</td><td></td><td>66.3</td></tr><tr><td>Q4_K_XL</td><td>387</td><td>69.7</td><td></td></tr><tr><td>Q4_K_M</td><td>405</td><td>69.7</td><td></td></tr><tr><td>Q4_K_M</td><td>409</td><td></td><td>67.7</td></tr><tr><td>Q5_K_M</td><td>478</td><td></td><td>68.9</td></tr><tr><td>Q5_K_XL</td><td>484</td><td>70.7</td><td></td></tr></tbody></table>

### :cake:Dynamic quantization ablations

We did some ablations as well to confirm if our calibration dataset and our dynamic quantization methodology actually works. The trick of Unsloth's dynamic method is to quantize **important layers to higher bits** say 8bits, whilst **un-important layers are left in lower bis like 2bits**.

To test our method, we leave specific tensors in lower precision like 4bit vs higher precision. For example below we leave `attn_k_b` tensors in 4bit (semi-dynamic) vs 8bit (Unsloth current), and by increasing the quant size by only \~100MB or so (<0.1%), accuracy shoots up dramatically!

{% hint style="success" %}
`attn_k_b` and other tensors in DeepSeek V3.1 are highly important / sensitive to quantization and should left in higher precision to retain accuracy!
{% endhint %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-3b4f8ac3af4ec8d09763c2e5f5d7de912d0b042e%2FSemi%20Dynamic.png?alt=media" alt=""><figcaption></figcaption></figure>

### :bug:Chat Template Bug Fixes

During testing of DeepSeek-V3.1 quants, we found some lower bit quants not enclosing `<think> </think>` properly or doing some weird formatting. This caused some community quants to not work on lower bits, and so this caused unfair comparisons. We found llama.cpp's usage of minja (a simpler version of jinja) does not accept positional argument in `.split`. We had to change:

See [here](https://huggingface.co/unsloth/DeepSeek-V3.1-GGUF?chat_template=default\&format=true) for our fixed chat template or [here](https://huggingface.co/unsloth/DeepSeek-V3.1/raw/main/chat_template.jinja) for a raw jinja file.

### :bar\_chart:Pass Rate 1

Aider is reported mainly on pass rate 2. We also report pass rate 1 to compare community quants of the same size. We see our dynamic quants do much better than other community quants of similar sizes especially on smaller than 2 bit and larger than 4bits. 3 and 4 bit perform similarly well.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-dfea83b4ef3e0d1a1c835476270eeb4f3f6db798%2FPass%20Rate%201%20Non%20Thinking.png?alt=media" alt=""><figcaption></figcaption></figure>

## :computer:Run DeepSeek V3.1 Dynamic quants

Head over to our [DeepSeek V3.1 guide](https://docs.unsloth.ai/models/tutorials-how-to-fine-tune-and-run-llms/deepseek-r1-how-to-run-locally/deepseek-r1-dynamic-1.58-bit) or to quickly get the dynamic 2bit version, do:

then use `llama.cpp` to directly download the weights. We set the optimal suggested parameters like temperature, the chat template etc already as well:

**Examples:**

Example 1 (unknown):
```unknown
{%- set content = content.split("</think>", 1)[1] -%}
```

Example 2 (unknown):
```unknown
{%- set splitted = content.split("</think>") -%}
{%- set content = splitted[1:] | join("</think>") -%}
```

Example 3 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli llama-server
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 4 (bash):
```bash
export LLAMA_CACHE="unsloth/DeepSeek-V3.1-GGUF"
./llama.cpp/llama-cli \
    -hf unsloth/DeepSeek-V3.1-GGUF:Q2_K_XL \
    --jinja \
    --n-gpu-layers 99 \
    --temp 0.6 \
    --top_p 0.95 \
    --min_p 0.01 \
    --ctx-size 8192 \
    --seed 3407 \
    -ot ".ffn_.*_exps.=CPU"
```

---

## Vision Reinforcement Learning (VLM RL)

**URL:** llms-txt#vision-reinforcement-learning-(vlm-rl)

Train Vision/multimodal models via GRPO and RL with Unsloth!

Unsloth now supports vision/multimodal RL with [Qwen3-VL](https://docs.unsloth.ai/models/qwen3-vl-how-to-run-and-fine-tune), [Gemma 3](https://docs.unsloth.ai/models/gemma-3-how-to-run-and-fine-tune) and more. Due to Unsloth's unique [weight sharing](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#what-unsloth-offers-for-rl) and custom kernels, Unsloth makes VLM RL **1.5–2× faster,** uses **90% less VRAM**, and enables **15× longer context** lengths than FA2 setups, with no accuracy loss. This update also introduces Qwen's [GSPO](#gspo-rl) algorithm.

Unsloth can train Qwen3-VL-8B with GSPO/GRPO on a free Colab T4 GPU. Other VLMs work too, but may need larger GPUs. Gemma requires newer GPUs than T4 because vLLM [restricts to Bfloat16](https://docs.unsloth.ai/models/gemma-3-how-to-run-and-fine-tune#unsloth-fine-tuning-fixes), thus we recommend NVIDIA L4 on Colab. Our notebooks solve numerical math problems involving images and diagrams:

* **Qwen-3 VL-8B** (vLLM inference)**:** [Colab](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision-GRPO.ipynb)
* **Qwen-2.5 VL-7B** (vLLM inference)**:** [Colab](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2_5_7B_VL_GRPO.ipynb) •[ Kaggle](https://www.kaggle.com/notebooks/welcome?src=https://github.com/unslothai/notebooks/blob/main/nb/Kaggle-Qwen2_5_7B_VL_GRPO.ipynb\&accelerator=nvidiaTeslaT4)
* **Gemma-3-4B** (Unsloth inference): [Colab](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision-GRPO.ipynb)

We have also added vLLM VLM integration into Unsloth natively, so all you have to do to use vLLM inference is enable the `fast_inference=True` flag when initializing the model. Special thanks to [Sinoué GAD](https://github.com/unslothai/unsloth/pull/2752) for providing the [first notebook](https://github.com/GAD-cell/vlm-grpo/blob/main/examples/VLM_GRPO_basic_example.ipynb) that made integrating VLM RL easier!

This VLM support also integrates our latest update for even more memory efficient + faster RL including our [Standby feature](https://docs.unsloth.ai/get-started/memory-efficient-rl#unsloth-standby), which uniquely limits speed degradation compared to other implementations.

{% hint style="info" %}
You can only use `fast_inference` for VLMs supported by vLLM. Some models, like Llama 3.2 Vision thus only can run without vLLM, but they still work in Unsloth.
{% endhint %}

It is also important to note, that vLLM does not support LoRA for vision/encoder layers, thus set `finetune_vision_layers = False` when loading a LoRA adapter.\
However you CAN train the vision layers as well if you use inference via transformers/Unsloth.

**Examples:**

Example 1 (python):
```python
os.environ['UNSLOTH_VLLM_STANDBY'] = '1' # To enable memory efficient GRPO with vLLM
model, tokenizer = FastVisionModel.from_pretrained(
    model_name = "Qwen/Qwen2.5-VL-7B-Instruct",
    max_seq_length = 16384, #Must be this large to fit image in context
    load_in_4bit = True, # False for LoRA 16bit
    fast_inference = True, # Enable vLLM fast inference
    gpu_memory_utilization = 0.8, # Reduce if out of memory
)
```

---

## --model_name

**URL:** llms-txt#--model_name

---

## --save_model

**URL:** llms-txt#--save_model

**Contents:**
  - Training metrics

torchrun --nproc_per_node=2 unsloth-cli.py \
  --model_name=Qwen/Qwen3-8B \
  --dataset=yahma/alpaca-cleaned \
  --learning_rate=2e-5 \
  --max_seq_length=2048 \
  --per_device_train_batch_size=1 \
  --gradient_accumulation_steps=4 \
  --max_steps=1000 \
  --save_model
bash
$ nvidia-smi
Mon Nov 24 12:58:42 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.95.05              Driver Version: 580.95.05      CUDA Version: 13.0     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H100 80GB HBM3          On  |   00000000:04:00.0 Off |                    0 |
| N/A   38C    P0            193W /  700W |   18903MiB /  81559MiB |     25%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA H100 80GB HBM3          On  |   00000000:05:00.0 Off |                    0 |
| N/A   37C    P0            199W /  700W |   18905MiB /  81559MiB |     28%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A            4935      C   ...und/unsloth/.venv/bin/python3      18256MiB |
|    0   N/A  N/A            4936      C   ...und/unsloth/.venv/bin/python3        630MiB |
|    1   N/A  N/A            4935      C   ...und/unsloth/.venv/bin/python3        630MiB |
|    1   N/A  N/A            4936      C   ...und/unsloth/.venv/bin/python3      18258MiB |
+-----------------------------------------------------------------------------------------+
```

We can see that both GPUs are now using \~19GB of VRAM per H100 GPU!

Inspecting the training logs, we see that we’re able to train at a rate of \~1.1 iterations/s. This training speed is \~constant even as we add more GPUs, so our training throughput increases \~linearly with the number of GPUs!

We ran a few short rank-16 LoRA fine-tunes on [unsloth/Llama-3.2-1B-Instruct](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct) on the [yahma/alpaca-cleaned](https://huggingface.co/datasets/yahma/alpaca-cleaned) dataset to demonstrate the improved training throughput when using DDP training with multiple GPUs.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FdySJnhNUzVD3gsWmPqHR%2Funknown.png?alt=media&#x26;token=9905cccb-04c8-45b1-bfb1-680823713319" alt="" width="375"><figcaption></figcaption></figure>

The above figure compares training loss between two Llama-3.2-1B-Instruct LoRA fine-tunes over 500 training steps, with single GPU training (pink) vs. multi-GPU DDP training (blue).

Notice that the loss curves match in scale and trend, but otherwise are a *bit* different, since *the multi-GPU training processes twice as much training data per step*. This results in a slightly different training curve with less variability on a step-by-step basis.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fz4XgknzMgljaFInMEzHc%2Funknown.png?alt=media&#x26;token=4e28e2b1-8bc8-4049-983d-e4f980f3f4cf" alt="" width="375"><figcaption></figcaption></figure>

The above figure plots training progress for the same two fine-tunes.

Notice that the multi-GPU DDP training progresses through an epoch of the training data in half as many steps as single GPU training. This is because each GPU can process a distinct batch (of size `per_device_train_batch_size`) per step. However, the per-step timing for DDP training is slightly slower due to distributed communication for the model weight updates. As you increase the number of GPUs, the training throughput will continue to increase \~linearly (but with a small, but increasing penalty for the distributed comms).

These same loss and training epoch progress behaviors hold for QLoRA fine-tunes, in which we loaded the base models in 4-bit precision in order to save additional GPU memory. This is particularly useful for training large models on limited amounts of GPU VRAM:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FUrCEgA7OBVhc8ICkMaP6%2Funknown.png?alt=media&#x26;token=0f5de3df-77df-4ee5-bf7a-68dead857c9a" alt="" width="375"><figcaption></figcaption></figure>

Training loss comparison between two Llama-3.2-1B-Instruct QLoRA fine-tunes over 500 training steps, with single GPU training (orange) vs. multi-GPU DDP training (purple).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F8cG6rjmjeznNfgWrYdnG%2Funknown.png?alt=media&#x26;token=d1c2c1fe-c117-49b5-8e9d-fdc01154cc01" alt="" width="375"><figcaption></figcaption></figure>

Training progress comparison for the same two fine-tunes.

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

If you have more GPUs, you may set `--nproc_per_node` accordingly to utilize them.

**Note:** You can use the `torchrun` launcher with any of your Unsloth training scripts, including the [scripts](https://github.com/unslothai/notebooks/tree/main/python_scripts) converted from our free Colab notebooks, and DDP will be auto-enabled when training with >1 GPU!

Taking a look again at `nvidia-smi` while training is in-flight:

{% code expandable="true" %}
```

---
