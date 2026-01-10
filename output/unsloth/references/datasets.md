# Unsloth - Datasets

**Pages:** 6

---

## (4) Customized chat templates

**URL:** llms-txt#(4)-customized-chat-templates

---

## Ensure all audio is at 24 kHz sampling rate (Orpheus’s expected rate)

**URL:** llms-txt#ensure-all-audio-is-at-24-khz-sampling-rate-(orpheus’s-expected-rate)

**Contents:**
  - Fine-Tuning TTS with Unsloth

dataset = dataset.cast_column("audio", Audio(sampling_rate=24000))

filename,text
  0001.wav,Hello there!
  0002.wav,<sigh> I am very tired.
  python
  from datasets import Audio
  dataset = load_dataset("csv", data_files="mydata.csv", split="train")
  dataset = dataset.cast_column("filename", Audio(sampling_rate=24000))
  python
from unsloth import FastLanguageModel
import torch
dtype = None # None for auto detection. Float16 for Tesla T4, V100, Bfloat16 for Ampere+
load_in_4bit = False # Use 4bit quantization to reduce memory usage. Can be False.

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/orpheus-3b-0.1-ft",
    max_seq_length= 2048, # Choose any for long context!
    dtype = dtype,
    load_in_4bit = load_in_4bit,
    #token = "hf_...", # use one if using gated models like meta-llama/Llama-2-7b-hf
)

from datasets import load_dataset
dataset = load_dataset("MrDragonFox/Elise", split = "train")
python

**Examples:**

Example 1 (unknown):
```unknown
This will download the dataset (\~328 MB for \~1.2k samples). Each item in `dataset` is a dictionary with at least:

* `"audio"`: the audio clip (waveform array and metadata like sampling rate), and
* `"text"`: the transcript string

Orpheus supports tags like `<laugh>`, `<chuckle>`, `<sigh>`, `<cough>`, `<sniffle>`, `<groan>`, `<yawn>`, `<gasp>`, etc. For example: `"I missed you <laugh> so much!"`. These tags are enclosed in angle brackets and will be treated as special tokens by the model (they match [Orpheus’s expected tags](https://github.com/canopyai/Orpheus-TTS) like `<laugh>` and `<sigh>`. During training, the model will learn to associate these tags with the corresponding audio patterns. The Elise dataset with tags already has many of these (e.g., 336 occurrences of “laughs”, 156 of “sighs”, etc. as listed in its card). If your dataset lacks such tags but you want to incorporate them, you can manually annotate the transcripts where the audio contains those expressions.

**Option 2: Preparing a custom dataset** – If you have your own audio files and transcripts:

* Organize audio clips (WAV/FLAC files) in a folder.
* Create a CSV or TSV file with columns for file path and transcript. For example:
```

Example 2 (unknown):
```unknown
* Use `load_dataset("csv", data_files="mydata.csv", split="train")` to load it. You might need to tell the dataset loader how to handle audio paths. An alternative is using the `datasets.Audio` feature to load audio data on the fly:
```

Example 3 (unknown):
```unknown
Then `dataset[i]["audio"]` will contain the audio array.
* **Ensure transcripts are normalized** (no unusual characters that the tokenizer might not know, except the emotion tags if used). Also ensure all audio have a consistent sampling rate (resample them if necessary to the target rate the model expects, e.g. 24kHz for Orpheus).

In summary, for **dataset preparation**:

* You need a **list of (audio, text)** pairs.
* Use the HF `datasets` library to handle loading and optional preprocessing (like resampling).
* Include any **special tags** in the text that you want the model to learn (ensure they are in `<angle_brackets>` format so the model treats them as distinct tokens).
* (Optional) If multi-speaker, you could include a speaker ID token in the text or use a separate speaker embedding approach, but that’s beyond this basic guide (Elise is single-speaker).

### Fine-Tuning TTS with Unsloth

Now, let’s start fine-tuning! We’ll illustrate using Python code (which you can run in a Jupyter notebook, Colab, etc.).

**Step 1: Load the Model and Dataset**

In all our TTS notebooks, we enable LoRA (16-bit) training and disable QLoRA (4-bit) training with: `load_in_4bit = False`. This is so the model can usually learn your dataset better and have higher accuracy.
```

Example 4 (unknown):
```unknown
{% hint style="info" %}
If memory is very limited or if dataset is large, you can stream or load in chunks. Here, 3h of audio easily fits in RAM. If using your own dataset CSV, load it similarly.
{% endhint %}

**Step 2: Advanced - Preprocess the data for training (Optional)**

We need to prepare inputs for the Trainer. For text-to-speech, one approach is to train the model in a causal manner: concatenate text and audio token IDs as the target sequence. However, since Orpheus is a decoder-only LLM that outputs audio, we can feed the text as input (context) and have the audio token ids as labels. In practice, Unsloth’s integration might do this automatically if the model’s config identifies it as text-to-speech. If not, we can do something like:
```

---

## Function to prepare the GSM8K dataset

**URL:** llms-txt#function-to-prepare-the-gsm8k-dataset

def get_gsm8k_questions(split="train") -> Dataset:
    data = load_dataset("openai/gsm8k", "main")[split]
    data = data.map(
        lambda x: {
            "prompt": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": x["question"]},
            ],
            "answer": extract_hash_answer(x["answer"]),
        }
    )
    return data

dataset = get_gsm8k_questions()
python
epsilon=0.2,
epsilon_high=0.28, # one sided
delta=1.5 # two sided

**Examples:**

Example 1 (unknown):
```unknown
The dataset is prepared by extracting the answers and formatting them as structured strings.
{% endstep %}

{% step %}

#### Reward Functions/Verifier

[Reward Functions/Verifiers](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#reward-functions-verifier) lets us know if the model is doing well or not according to the dataset you have provided. Each generation run will be assessed on how it performs to the score of the average of the rest of generations. You can create your own reward functions however we have already pre-selected them for you with [Will's GSM8K](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#gsm8k-reward-functions) reward functions. With this, we have 5 different ways which we can reward each generation.

You can input your generations into an LLM like ChatGPT 4o or Llama 3.1 (8B) and design a reward function and verifier to evaluate it. For example, feed your generations into a LLM of your choice and set a rule: "If the answer sounds too robotic, deduct 3 points." This helps refine outputs based on quality criteria. **See examples** of what they can look like [here](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#reward-function-examples).

**Example Reward Function for an Email Automation Task:**

* **Question:** Inbound email
* **Answer:** Outbound email
* **Reward Functions:**
  * If the answer contains a required keyword → **+1**
  * If the answer exactly matches the ideal response → **+1**
  * If the response is too long → **-1**
  * If the recipient's name is included → **+1**
  * If a signature block (phone, email, address) is present → **+1**

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-95cd00b6a52b8161b31a2399e25863ee0349920e%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}

#### Train your model

We have pre-selected hyperparameters for the most optimal results however you could change them. Read all about [parameters here](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide). For **advanced GRPO** documentation on batching, generation and training parameters, [read our guide!](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/advanced-rl-documentation)

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a22d3475d925d2d858c9fcc228f0e13893eff0f9%2Fimage.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

The **GRPOConfig** defines key hyperparameters for training:

* `use_vllm`: Activates fast inference using vLLM.
* `learning_rate`: Determines the model's learning speed.
* `num_generations`: Specifies the number of completions generated per prompt.
* `max_steps`: Sets the total number of training steps.

{% hint style="success" %}
**NEW!** We now support DAPO, Dr. GRPO and most other new GRPO techniques. You can play with the following arguments in GRPOConfig to enable:
```

---

## Get LAION dataset

**URL:** llms-txt#get-laion-dataset

url = "https://huggingface.co/datasets/laion/OIG/resolve/main/unified_chip2.jsonl"
dataset = load_dataset("json", data_files = {"train" : url}, split = "train")

---

## Load the Elise dataset (e.g., the version with emotion tags)

**URL:** llms-txt#load-the-elise-dataset-(e.g.,-the-version-with-emotion-tags)

dataset = load_dataset("MrDragonFox/Elise", split="train")
print(len(dataset), "samples")  # ~1200 samples in Elise

---

## --dataset

**URL:** llms-txt#--dataset

---
