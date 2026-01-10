# Unsloth - Getting Started

**Pages:** 23

---

## Conda Install

**URL:** llms-txt#conda-install

To install Unsloth locally on Conda, follow the steps below:

{% hint style="warning" %}
Only use Conda if you have it. If not, use [Pip](https://docs.unsloth.ai/get-started/install-and-update/pip-install).
{% endhint %}

Select either `pytorch-cuda=11.8,12.1` for CUDA 11.8 or CUDA 12.1. We support `python=3.10,3.11,3.12`.

If you're looking to install Conda in a Linux environment, [read here](https://docs.anaconda.com/miniconda/), or run the below:

**Examples:**

Example 1 (bash):
```bash
conda create --name unsloth_env \
    python=3.11 \
    pytorch-cuda=12.1 \
    pytorch cudatoolkit xformers -c pytorch -c nvidia -c xformers \
    -y
conda activate unsloth_env

pip install unsloth
```

Example 2 (bash):
```bash
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm -rf ~/miniconda3/miniconda.sh
~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh
```

---

## Docker

**URL:** llms-txt#docker

**Contents:**
  - ⚡ Quickstart
  - 📖 Usage Example

Install Unsloth using our official Docker container

Learn how to use our Docker containers with all dependencies pre-installed for immediate installation. No setup required, just run and start training!

Unsloth Docker image: [**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth)

{% hint style="success" %}
You can now use our main Docker image `unsloth/unsloth` for Blackwell and 50-series GPUs - no separate image needed.
{% endhint %}

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

[**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth) is Unsloth's only Docker image. For Blackwell and 50-series GPUs, use this same image - no separate one needed.

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

## Fine-tuning for Beginners

**URL:** llms-txt#fine-tuning-for-beginners

If you're a beginner, here might be the first questions you'll ask before your first fine-tune. You can also always ask our community by joining our [Reddit page](https://www.reddit.com/r/unsloth/).

<table data-view="cards"><thead><tr><th data-type="content-ref"></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="fine-tuning-llms-guide">fine-tuning-llms-guide</a></td><td>Step-by-step on how to fine-tune!</td><td>Learn the core basics of training.</td><td><a href="fine-tuning-llms-guide">fine-tuning-llms-guide</a></td></tr><tr><td><a href="fine-tuning-llms-guide/what-model-should-i-use">what-model-should-i-use</a></td><td>Instruct or Base Model?</td><td>How big should my dataset be?</td><td><a href="fine-tuning-llms-guide/what-model-should-i-use">what-model-should-i-use</a></td></tr><tr><td><a href="../models/tutorials-how-to-fine-tune-and-run-llms">tutorials-how-to-fine-tune-and-run-llms</a></td><td>How to Run &#x26; Fine-tune DeepSeek?</td><td>What settings should I set when running Gemma 3?</td><td><a href="../models/tutorials-how-to-fine-tune-and-run-llms">tutorials-how-to-fine-tune-and-run-llms</a></td></tr><tr><td><a href="fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me">faq-+-is-fine-tuning-right-for-me</a></td><td>What can fine-tuning do for me?</td><td>RAG vs. Fine-tuning?</td><td><a href="fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me">faq-+-is-fine-tuning-right-for-me</a></td></tr><tr><td><a href="install-and-update">install-and-update</a></td><td>How do I install Unsloth locally?</td><td>How to update Unsloth?</td><td><a href="install-and-update">install-and-update</a></td></tr><tr><td><a href="fine-tuning-llms-guide/datasets-guide">datasets-guide</a></td><td>How do I structure/prepare my dataset?</td><td>How do I collect data?</td><td></td></tr><tr><td><a href="fine-tuning-for-beginners/unsloth-requirements">unsloth-requirements</a></td><td>Does Unsloth work on my GPU?</td><td>How much VRAM will I need?</td><td><a href="fine-tuning-for-beginners/unsloth-requirements">unsloth-requirements</a></td></tr><tr><td><a href="../basics/inference-and-deployment">inference-and-deployment</a></td><td>How do I save my model locally?</td><td>How do I run my model via Ollama or vLLM?</td><td><a href="../basics/inference-and-deployment">inference-and-deployment</a></td></tr><tr><td><a href="fine-tuning-llms-guide/lora-hyperparameters-guide">lora-hyperparameters-guide</a></td><td>What happens when I change a parameter?</td><td>What parameters should I change?</td><td></td></tr></tbody></table>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-559e7890f607e34fd6004517296e65e942c93b41%2FLarge%20sloth%20Question%20mark.png?alt=media" alt="" width="188"><figcaption></figcaption></figure>

---

## First uninstall xformers installed by previous libraries

**URL:** llms-txt#first-uninstall-xformers-installed-by-previous-libraries

pip uninstall xformers -y

---

## Install API 34 and NDK 25

**URL:** llms-txt#install-api-34-and-ndk-25

**Contents:**
  - Step 4: Get the Code
  - Step 5: Fix Common Compilation Issues
  - Step 6: Build the APK
  - Step 7: Install on your Android device
  - Step 8: Transfer Model Files
  - Troubleshooting
  - Transferring model to your phone
  - :mobile\_phone:ExecuTorch powers billions <a href="#docs-internal-guid-7d7d5aee-7fff-f138-468c-c35853fee9ca" id="docs-internal-guid-7d7d5aee-7fff-f138-468c-c35853fee9ca"></a>
- :tada:Other model support

sdkmanager "platforms;android-34" "platform-tools" "build-tools;34.0.0" "ndk;25.0.8775105"
bash
export ANDROID_NDK=$ANDROID_HOME/ndk/25.0.8775105
bash
cd ~
git clone https://github.com/meta-pytorch/executorch-examples.git
cd executorch-examples
bash
echo "sdk.dir=$HOME/android-sdk" > llm/android/LlamaDemo/local.properties
bash
sed -i 's/e.getDetailedError()/e.getMessage()/g' llm/android/LlamaDemo/app/src/main/java/com/example/executorchllamademo/MainActivity.java
bash
   cd llm/android/LlamaDemo
   bash
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
   ./gradlew :app:assembleDebug
   
   app/build/outputs/apk/debug/app-debug.apk
   bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
shellscript
adb devices 
shellscript
adb shell mkdir -p /data/local/tmp/llama
adb shell chmod 777 /data/local/tmp/llama
shellscript
adb shell ls -l /data/local/tmp/llama
total 0
shellscript
adb push <path_to_tokenizer.json on your computer> /data/local/tmp/llama
adb push <path_to_model.pte on your computer> /data/local/tmp/llama
```

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FwqtWYiRBiyAOhi3aecn9%2Fimage.png?alt=media&#x26;token=ab04a1d1-194d-420d-a980-3336f90e7e42" alt="" width="563"><figcaption></figcaption></figure>

{% columns %}
{% column %}

1. Open the `executorchllamademo` app you installed in Step 5, then tap the gear icon in the top-right to open Settings.
2. Tap the arrow next to Model to open the picker and select a model.\
   If you see a blank white dialog with no filename, your ADB model push likely failed - redo that step. Also note it may initially show “no model selected.”
3. After you select a model, the app should display the model filename.
   {% endcolumn %}

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FmwIP3Fg2xWNfq5h719rE%2Funknown.png?alt=media&#x26;token=3b560fc2-6820-4dd1-a8fa-1a76e5523672" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F5ft9HycpKPtCYhWgTmMn%2Funknown.png?alt=media&#x26;token=dc35909b-9541-4fb1-9c7a-7a4be242afd4" alt=""><figcaption></figcaption></figure></div>
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column %}
5\. Now repeat the same for tokenizer. Click on the arrow next to the tokenizer field and select the corresponding file.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fhga4tR05b5D0IqLvB2PM%2Funknown.png?alt=media&#x26;token=fb00738e-9429-4014-836d-3e35821279cd" alt="" width="180"><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
6\. You might need to select the model type depending on which model you're uploading. Qwen3 is selected here.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FjAZd67Ruub3gfblDrwUs%2Funknown.png?alt=media&#x26;token=cf0f6938-2e9c-4bf4-b0f2-c7512b5506ad" alt="" width="180"><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
7\. Once you have selected both files, click on the "Load Model" button.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FGaPBdnweeeRIWgWsK9Fg%2Funknown.png?alt=media&#x26;token=73ec7e74-d9f8-4080-a6b0-ef239fd640d9" alt="" width="180"><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column %}
8\. It will take you back to the original screen with the chat window, and it might show "model loading". It might take a few seconds to finish loading depending on your phone's RAM and storage speeds.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F1XHwMpnWEB2JiwNAR6hy%2Funknown.png?alt=media&#x26;token=18bcff85-b67c-4bbe-a961-28f5c5e58ce3" alt="" width="180"><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
9\. Once it says "successfully loaded model," you can start chatting with the model.\
\
Et Voila, you now have an LLM running natively on your Android phone!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FRoYe3aDedHoovwfPJVOh%2Funknown.png?alt=media&#x26;token=e9a2cc0a-2407-4c0b-adf1-6e2ba122212c" alt="" width="180"><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### :mobile\_phone:ExecuTorch powers billions <a href="#docs-internal-guid-7d7d5aee-7fff-f138-468c-c35853fee9ca" id="docs-internal-guid-7d7d5aee-7fff-f138-468c-c35853fee9ca"></a>

ExecuTorch [powers on-device ML experiences for billions of people](https://engineering.fb.com/2025/07/28/android/executorch-on-device-ml-meta-family-of-apps/) on Instagram, WhatsApp, Messenger, and Facebook. Instagram Cutouts uses ExecuTorch to extract editable stickers from photos. In encrypted applications like Messenger, ExecuTorch enables on-device privacy aware language identification and translation. ExecuTorch supports over a dozen hardware backends across Apple, Qualcomm, ARM and [Meta’s Quest 3 and Ray Bans](https://ai.meta.com/blog/executorch-reality-labs-on-device-ai/).

## :tada:Other model support

* All Qwen 3 dense models ([Qwen3-0.6B](https://huggingface.co/unsloth/Qwen3-0.6B), [Qwen3-4B](https://huggingface.co/unsloth/Qwen3-4B), [Qwen3-32B](https://huggingface.co/unsloth/Qwen3-32B) etc)
* All Gemma 3 models ([Gemma3-270M](https://huggingface.co/unsloth/gemma-3-270m-it), [Gemma3-4B](https://huggingface.co/unsloth/gemma-3-4b-it), [Gemma3-27B](https://huggingface.co/unsloth/gemma-3-27b-it) etc)
* All Llama 3 models ([Llama 3.1 8B](https://huggingface.co/unsloth/Llama-3.1-8B-Instruct), [Llama 3.3 70B Instruct](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct) etc)
* Qwen 2.5, Phi 4 Mini models, and much more!

You can customize the [**free Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(0_6B\)-Phone_Deployment.ipynb) for Qwen3-0.6B to allow phone deployment for any of the models above!

{% columns %}
{% column %}
**Qwen3 0.6B main phone deployment notebook**

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_(0_6B)-Phone_Deployment.ipynb>" %}
{% endcolumn %}

{% column %}
Works with Gemma 3

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_(4B).ipynb>" %}
{% endcolumn %}

{% column %}
Works with Llama 3

{% embed url="<https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_(1B_and_3B)-Conversational.ipynb>" %}
{% endcolumn %}
{% endcolumns %}

Go to our [unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks "mention") page for all other notebooks!

**Examples:**

Example 1 (unknown):
```unknown
Set the NDK variable:
```

Example 2 (unknown):
```unknown
### Step 4: Get the Code

We use the `executorch-examples` repository, which contains the updated Llama demo.
```

Example 3 (unknown):
```unknown
### Step 5: Fix Common Compilation Issues

Note that the current code doesn't have these issues but we have faced them previously and might be helpful to you:

**Fix "SDK Location not found":**

Create a `local.properties` file to explicitly tell Gradle where the SDK is:
```

Example 4 (unknown):
```unknown
**Fix `cannot find symbol` error:**

The current code uses a deprecated method `getDetailedError()`. Patch it with this command:
```

---

## Install library

**URL:** llms-txt#install-library

!pip install wandb --upgrade

---

## Install openai via pip install openai

**URL:** llms-txt#install-openai-via-pip-install-openai

**Contents:**
  - 🦥Deploying Unsloth finetunes in SGLang
- OR to upload to HuggingFace:
- OR to upload to HuggingFace
  - :railway\_car:gpt-oss-20b: Unsloth & SGLang Deployment Guide
- For gpt-oss specific mxfp4 conversions:
- OUTPUT ##

from openai import OpenAI
import json
openai_client = OpenAI(
    base_url = "http://0.0.0.0:30000/v1",
    api_key = "sk-no-key-required",
)
completion = openai_client.chat.completions.create(
    model = "unsloth/Llama-3.2-1B-Instruct",
    messages = [{"role": "user", "content": "What is 2+2?"},],
)
print(completion.choices[0].message.content)
python
from unsloth import FastLanguageModel
import torch
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/gpt-oss-20b",
    max_seq_length = 2048,
    load_in_4bit = True,
)
model = FastLanguageModel.get_peft_model(model)
python
model.save_pretrained_merged("finetuned_model", tokenizer, save_method = "merged_16bit")
## OR to upload to HuggingFace:
model.push_to_hub_merged("hf/model", tokenizer, save_method = "merged_16bit", token = "")
python
model.save_pretrained("finetuned_model")
tokenizer.save_pretrained("finetuned_model")
python
model.save_pretrained_merged("model", tokenizer, save_method = "lora")
## OR to upload to HuggingFace
model.push_to_hub_merged("hf/model", tokenizer, save_method = "lora", token = "")
python
model.save_pretrained_merged(
    "finetuned_model", 
    tokenizer, 
    save_method = "merged_16bit",
)
## For gpt-oss specific mxfp4 conversions:
model.save_pretrained_merged(
    "finetuned_model", 
    tokenizer, 
    save_method = "mxfp4", # (ONLY FOR gpt-oss otherwise choose "merged_16bit")
)
shellscript
python -m sglang.launch_server \
    --model-path finetuned_model \
    --host 0.0.0.0 --port 30002
python
from openai import OpenAI
import json
openai_client = OpenAI(
    base_url = "http://0.0.0.0:30002/v1",
    api_key = "sk-no-key-required",
)
completion = openai_client.chat.completions.create(
    model = "finetuned_model",
    messages = [{"role": "user", "content": "What is 2+2?"},],
)
print(completion.choices[0].message.content)

**Examples:**

Example 1 (unknown):
```unknown
And you will get `2 + 2 = 4.`

### 🦥Deploying Unsloth finetunes in SGLang

After fine-tuning [fine-tuning-llms-guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide "mention") or using our notebooks at [unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks "mention"), you can save or deploy your models directly through SGLang within a single workflow. An example Unsloth finetuning script for eg:
```

Example 2 (unknown):
```unknown
**To save to 16-bit for SGLang, use:**
```

Example 3 (unknown):
```unknown
**To save just the LoRA adapters**, either use:
```

Example 4 (unknown):
```unknown
Or just use our builtin function to do that:
```

---

## Install Rust, outlines-core then SGLang

**URL:** llms-txt#install-rust,-outlines-core-then-sglang

**Contents:**
  - :bug:Debugging SGLang Installation issues
  - :truck:Deploying SGLang models

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env && sudo apt-get install -y pkg-config libssl-dev
pip install --upgrade pip && pip install uv
uv pip install "sglang" && uv pip install unsloth
shellscript
docker run --gpus all \
    --shm-size 32g \
    -p 30000:30000 \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    --env "HF_TOKEN=<secret>" \
    --ipc=host \
    lmsysorg/sglang:latest \
    python3 -m sglang.launch_server --model-path unsloth/Llama-3.1-8B-Instruct --host 0.0.0.0 --port 30000

hint: This usually indicates a problem with the package or the build environment.
  help: `outlines-core` (v0.1.26) was included because `sglang` (v0.5.5.post2) depends on `outlines` (v0.1.11) which depends on `outlines-core`

/home/daniel/.cache/flashinfer/0.5.2/100a/generated/batch_prefill_with_kv_cache_dtype_q_bf16_dtype_kv_bf16_dtype_o_bf16_dtype_idx_i32_head_dim_qk_64_head_dim_vo_64_posenc_0_use_swa_False_use_logits_cap_False_f16qk_False/batch_prefill_ragged_kernel_mask_1.cu:1:10: fatal error: flashinfer/attention/prefill.cuh: No such file or directory
    1 | #include <flashinfer/attention/prefill.cuh>
      |          ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
compilation terminated.
ninja: build stopped: subcommand failed.

Possible solutions:
1. set --mem-fraction-static to a smaller value (e.g., 0.8 or 0.7)
2. set --cuda-graph-max-bs to a smaller value (e.g., 16)
3. disable torch compile by not using --enable-torch-compile
4. disable CUDA graph by --disable-cuda-graph. (Not recommended. Huge performance loss)
Open an issue on GitHub https://github.com/sgl-project/sglang/issues/new/choose
shellscript
python3 -m sglang.launch_server \
    --model-path unsloth/Llama-3.2-1B-Instruct \
    --host 0.0.0.0 --port 30000
python

**Examples:**

Example 1 (unknown):
```unknown
For **Docker** setups run:

{% code overflow="wrap" %}
```

Example 2 (unknown):
```unknown
{% endcode %}

### :bug:Debugging SGLang Installation issues

Note if you see the below, update Rust and outlines-core as specified in [#setting-up-sglang](#setting-up-sglang "mention")

{% code overflow="wrap" %}
```

Example 3 (unknown):
```unknown
{% endcode %}

If you see a Flashinfer issue like below:
```

Example 4 (unknown):
```unknown
Remove the flashinfer cache via `rm -rf .cache/flashinfer` and also the directory listed in the error message ie `rm -rf ~/.cache/flashinfer`

### :truck:Deploying SGLang models

To deploy any model like for example [unsloth/Llama-3.2-1B-Instruct](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct), do the below in a separate terminal (otherwise it'll block your current terminal - you can also use tmux):

{% code overflow="wrap" %}
```

---

## Install triton from source for latest blackwell support

**URL:** llms-txt#install-triton-from-source-for-latest-blackwell-support

RUN git clone https://github.com/triton-lang/triton.git && \
    cd triton && \
    git checkout c5d671f91d90f40900027382f98b17a3e04045f6 && \
    pip install -r python/requirements.txt && \
    pip install . && \
    cd ..

---

## Install unsloth and other dependencies

**URL:** llms-txt#install-unsloth-and-other-dependencies

RUN pip install unsloth unsloth_zoo bitsandbytes==0.48.0 transformers==4.56.2 trl==0.22.2

---

## Install xformers from source for blackwell support

**URL:** llms-txt#install-xformers-from-source-for-blackwell-support

RUN git clone --depth=1 https://github.com/facebookresearch/xformers --recursive && \
    cd xformers && \
    export TORCH_CUDA_ARCH_LIST="12.1" && \
    python setup.py install && \
    cd ..

---

## Instal Unsloth via pip and uv

**URL:** llms-txt#instal-unsloth-via-pip-and-uv

**Contents:**
- **Recommended installation method**
- Uninstall or Reinstall
- Advanced Pip Installation

To install Unsloth locally via Pip, follow the steps below:

## **Recommended installation method**

**Install with pip (recommended) for the latest pip release:**

To install **vLLM and Unsloth** together, do:

To install the **latest main branch** of Unsloth, do:

{% code overflow="wrap" %}

For **venv and virtual environments installs** to isolate your installation to not break system packages, and to reduce irreparable damage to your system, use venv:

{% code overflow="wrap" %}

If you're installing Unsloth in Jupyter, Colab, or other notebooks, be sure to prefix the command with `!`. This isn't necessary when using a terminal

{% hint style="info" %}
Python 3.13 is now supported!
{% endhint %}

## Uninstall or Reinstall

If you're still encountering dependency issues with Unsloth, many users have resolved them by forcing uninstalling and reinstalling Unsloth:

{% code overflow="wrap" %}

## Advanced Pip Installation

{% hint style="warning" %}
Do **NOT** use this if you have [Conda](https://docs.unsloth.ai/get-started/install-and-update/conda-install).
{% endhint %}

Pip is a bit more complex since there are dependency issues. The pip command is different for `torch 2.2,2.3,2.4,2.5` and CUDA versions.

For other torch versions, we support `torch211`, `torch212`, `torch220`, `torch230`, `torch240` and for CUDA versions, we support `cu118` and `cu121` and `cu124`. For Ampere devices (A100, H100, RTX3090) and above, use `cu118-ampere` or `cu121-ampere` or `cu124-ampere`.

For example, if you have `torch 2.4` and `CUDA 12.1`, use:

Another example, if you have `torch 2.5` and `CUDA 12.4`, use:

Or, run the below in a terminal to get the **optimal** pip installation command:

Or, run the below manually in a Python REPL:

{% code overflow="wrap" %}

**Examples:**

Example 1 (bash):
```bash
pip install unsloth
```

Example 2 (bash):
```bash
pip install --upgrade pip && pip install uv
uv pip install unsloth
```

Example 3 (bash):
```bash
uv pip install unsloth vllm
```

Example 4 (bash):
```bash
pip install unsloth
pip uninstall unsloth unsloth_zoo -y && pip install --no-deps git+https://github.com/unslothai/unsloth_zoo.git && pip install --no-deps git+https://github.com/unslothai/unsloth.git
```

---

## pip install huggingface_hub hf_transfer

**URL:** llms-txt#pip-install-huggingface_hub-hf_transfer

---

## !pip install huggingface_hub hf_transfer

**URL:** llms-txt#!pip-install-huggingface_hub-hf_transfer

import os
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"
from huggingface_hub import snapshot_download
snapshot_download(
    repo_id = "unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF",
    local_dir = "unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF",
    allow_patterns = ["*IQ2_XXS*"],
)
bash
./llama.cpp/llama-cli \
    --model unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF/Llama-4-Scout-17B-16E-Instruct-UD-IQ2_XXS.gguf \
    --threads 32 \
    --ctx-size 16384 \
    --n-gpu-layers 99 \
    -ot ".ffn_.*_exps.=CPU" \
    --seed 3407 \
    --prio 3 \
    --temp 0.6 \
    --min-p 0.01 \
    --top-p 0.9 \
    -no-cnv \
    --prompt "<|header_start|>user<|header_end|>\n\nCreate a Flappy Bird game.<|eot|><|header_start|>assistant<|header_end|>\n\n"
```

{% hint style="success" %}
Read more on running Llama 4 here: <https://docs.unsloth.ai/basics/tutorial-how-to-run-and-fine-tune-llama-4>
{% endhint %}

**Examples:**

Example 1 (unknown):
```unknown
And and let's do inference!

{% code overflow="wrap" %}
```

---

## Troubleshooting & FAQs

**URL:** llms-txt#troubleshooting-&-faqs

**Contents:**
  - Running in Unsloth works well, but after exporting & running on other platforms, the results are poor
  - Saving to GGUF / vLLM 16bit crashes
  - How do I manually save to GGUF?

Tips to solve issues, and frequently asked questions.

If you're still encountering any issues with versions or depencies, please use our [Docker image](https://docs.unsloth.ai/get-started/install-and-update/docker) which will have everything pre-installed.

{% hint style="success" %}
**Try always to update Unsloth if you find any issues.**

`pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth unsloth_zoo`
{% endhint %}

### Running in Unsloth works well, but after exporting & running on other platforms, the results are poor

You might sometimes encounter an issue where your model runs and produces good results on Unsloth, but when you use it on another platform like Ollama or vLLM, the results are poor or you might get gibberish, endless/infinite generations *or* repeated output&#x73;**.**

* The most common cause of this error is using an <mark style="background-color:blue;">**incorrect chat template**</mark>**.** It’s essential to use the SAME chat template that was used when training the model in Unsloth and later when you run it in another framework, such as llama.cpp or Ollama. When inferencing from a saved model, it's crucial to apply the correct template.
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

Compile llama.cpp from source like below:

Then, save the model to F16:

**Examples:**

Example 1 (python):
```python
model.save_pretrained_merged("merged_model", tokenizer, save_method = "merged_16bit",)
```

Example 2 (bash):
```bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggerganov/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=ON -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-quantize llama-cli llama-gguf-split llama-mtmd-cli
cp llama.cpp/build/bin/llama-* llama.cpp
```

Example 3 (bash):
```bash
python llama.cpp/convert_hf_to_gguf.py merged_model \
    --outfile model-F16.gguf --outtype f16 \
    --split-max-size 50G
```

---

## Tutorial: Train your own Reasoning model with GRPO

**URL:** llms-txt#tutorial:-train-your-own-reasoning-model-with-grpo

**Contents:**
  - Quickstart

Beginner's Guide to transforming a model like Llama 3.1 (8B) into a reasoning model by using Unsloth and GRPO.

DeepSeek developed [GRPO](https://unsloth.ai/blog/grpo) (Group Relative Policy Optimization) to train their R1 reasoning models.

These instructions are for our pre-made Google Colab [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks). If you are installing Unsloth locally, you can also copy our notebooks inside your favorite code editor. We'll be using any of these notebooks:

| [**gpt-oss-20b**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) **-** GSPO | [**Qwen2.5-VL**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2_5_7B_VL_GRPO.ipynb) - Vision GSPO                  | [Gemma 3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision-GRPO.ipynb) - Vision GSPO         |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Qwen3 (4B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-GRPO.ipynb) - Advanced     | [**DeepSeek-R1-0528-Qwen3-8B**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/DeepSeek_R1_0528_Qwen3_\(8B\)_GRPO.ipynb) | [Llama 3.2 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Advanced_Llama3_2_\(3B\)_GRPO_LoRA.ipynb) - Advanced |

{% stepper %}
{% step %}

If you're using our Colab notebook, click **Runtime > Run all**. We'd highly recommend you checking out our [Fine-tuning Guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide) before getting started.

If installing locally, ensure you have the correct [requirements](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/unsloth-requirements) and use `pip install unsloth` on Linux or follow our [Windows install ](https://docs.unsloth.ai/get-started/install-and-update/windows-installation)instructions.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-313fa39c229225ae9d39b7c7a0d05c9005ddb94c%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endstep %}

#### Learn about GRPO & Reward Functions

Before we get started, it is recommended to learn more about GRPO, reward functions and how they work. Read more about them including [tips & tricks](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#basics-tips)[ here](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#basics-tips).

You will also need enough VRAM. In general, model parameters = amount of VRAM you will need. In Colab, we are using their free 16GB VRAM GPUs which can train any model up to 16B in parameters.
{% endstep %}

#### Configure desired settings

We have pre-selected optimal settings for the best results for you already and you can change the model to whichever you want listed in our [supported models](https://docs.unsloth.ai/get-started/unsloth-model-catalog). Would not recommend changing other settings if you're a beginner.

{% hint style="success" %}
For **advanced GRPO** documentation on batching, generation and training parameters, [read our guide!](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/advanced-rl-documentation)
{% endhint %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b1e9fac448706ac87dff7e7eff1298655dda456e%2Fimage.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>
{% endstep %}

#### Data preparation

We have pre-selected OpenAI's [GSM8K](https://huggingface.co/datasets/openai/gsm8k) dataset which contains grade school math problems but you could change it to your own or any public one on Hugging Face. You can read more about [datasets here](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/datasets-guide).

Your dataset should still have at least 2 columns for question and answer pairs. However the answer must not reveal the reasoning behind how it derived the answer from the question. See below for an example:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-14a1ee796547f725abbd1097f2b0f9e4e6cc5976%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

We'll structure the data to prompt the model to articulate its reasoning before delivering an answer. To start, we'll establish a clear format for both prompts and responses.

---

## Unsloth Installation

**URL:** llms-txt#unsloth-installation

Learn to install Unsloth locally or online.

Unsloth works on Linux, Windows, NVIDIA, AMD, Google Colab and more. See our [system requirements](https://docs.unsloth.ai/get-started/fine-tuning-for-beginners/unsloth-requirements).

{% columns %}
{% column width="50%" %}
**Recommended install methods:**

{% column width="50%" %}
**To update Unsloth**

{% code overflow="wrap" %}

{% endcode %}
{% endcolumn %}
{% endcolumns %}

<table data-view="cards"><thead><tr><th data-type="content-ref"></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="install-and-update/pip-install">pip-install</a></td><td><a href="install-and-update/pip-install">pip-install</a></td></tr><tr><td><a href="install-and-update/docker">docker</a></td><td></td></tr><tr><td><a href="install-and-update/windows-installation">windows-installation</a></td><td></td></tr><tr><td><a href="install-and-update/updating">updating</a></td><td><a href="install-and-update/updating">updating</a></td></tr><tr><td><a href="install-and-update/amd">amd</a></td><td></td></tr><tr><td><a href="install-and-update/conda-install">conda-install</a></td><td><a href="install-and-update/conda-install">conda-install</a></td></tr><tr><td><a href="install-and-update/google-colab">google-colab</a></td><td><a href="install-and-update/google-colab">google-colab</a></td></tr></tbody></table>

**Examples:**

Example 1 (bash):
```bash
pip install unsloth
```

Example 2 (bash):
```bash
uv pip install unsloth
```

Example 3 (bash):
```bash
pip install --upgrade unsloth
```

---

## Unsloth Model Catalog

**URL:** llms-txt#unsloth-model-catalog

Unsloth model catalog for all our [Dynamic](https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs) GGUF, 4-bit, 16-bit models on Hugging Face.

{% tabs %}
{% tab title="• GGUF + 4-bit" %} <a href="#deepseek-models" class="button secondary">DeepSeek</a><a href="#llama-models" class="button secondary">Llama</a><a href="#gemma-models" class="button secondary">Gemma</a><a href="#qwen-models" class="button secondary">Qwen</a><a href="#mistral-models" class="button secondary">Mistral</a><a href="#phi-models" class="button secondary">Phi</a>

**GGUFs** let you run models in tools like Ollama, Open WebUI, and llama.cpp.\
**Instruct (4-bit)** safetensors can be used for inference or fine-tuning.

#### New & recommended models:

| Model                                                                                | Variant            | GGUF                                                                                                                                                            | Instruct (4-bit)                                                                                                                                                                       |
| ------------------------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**gpt-oss**](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune)       | 120B               | [link](https://huggingface.co/unsloth/gpt-oss-120b-GGUF)                                                                                                        | [link](https://huggingface.co/unsloth/gpt-oss-120b-unsloth-bnb-4bit)                                                                                                                   |
|                                                                                      | 20B                | [link](https://huggingface.co/unsloth/gpt-oss-20b-GGUF)                                                                                                         | [link](https://huggingface.co/unsloth/gpt-oss-20b-unsloth-bnb-4bit)                                                                                                                    |
| NVIDIA [Nemotron 3](https://docs.unsloth.ai/models/nemotron-3)                       | 30B                | [link](https://huggingface.co/unsloth/Nemotron-3-Nano-30B-A3B-GGUF)                                                                                             | —                                                                                                                                                                                      |
| [**Ministral 3**](https://docs.unsloth.ai/models/ministral-3)                        | 3B                 | [Instruct](https://huggingface.co/unsloth/Ministral-3-3B-Instruct-2512-GGUF) • [Reasoning](https://huggingface.co/unsloth/Ministral-3-3B-Reasoning-2512-GGUF)   | [Instruct](https://huggingface.co/unsloth/Ministral-3-14B-Instruct-2512-unsloth-bnb-4bit) • [Reasoning](https://huggingface.co/unsloth/Ministral-3-3B-Reasoning-2512-GGUF)             |
|                                                                                      | 8B                 | [Instruct](https://huggingface.co/unsloth/Ministral-3-8B-Instruct-2512-GGUF) • [Reasoning](https://huggingface.co/unsloth/Ministral-3-8B-Reasoning-2512-GGUF)   | [Instruct](https://huggingface.co/unsloth/Ministral-3-8B-Instruct-2512-unsloth-bnb-4bit) • [Reasoning](https://huggingface.co/unsloth/Ministral-3-8B-Reasoning-2512-unsloth-bnb-4bit)  |
|                                                                                      | 14B                | [Instruct](https://huggingface.co/unsloth/Ministral-3-14B-Instruct-2512-GGUF) • [Reasoning](https://huggingface.co/unsloth/Ministral-3-14B-Reasoning-2512-GGUF) | [Instruct](https://huggingface.co/unsloth/Ministral-3-3B-Instruct-2512-unsloth-bnb-4bit) • [Reasoning](https://huggingface.co/unsloth/Ministral-3-14B-Reasoning-2512-unsloth-bnb-4bit) |
| [**Devstral 2**](https://docs.unsloth.ai/models/devstral-2)                          | 24B                | [link](https://huggingface.co/unsloth/Devstral-Small-2-24B-Instruct-2512-GGUF)                                                                                  | —                                                                                                                                                                                      |
|                                                                                      | 123B               | [link](https://huggingface.co/unsloth/Devstral-2-123B-Instruct-2512-GGUF)                                                                                       | —                                                                                                                                                                                      |
| **Mistral Large 3**                                                                  | 675B               | [link](https://huggingface.co/unsloth/Mistral-Large-3-675B-Instruct-2512-GGUF)                                                                                  | [link](https://huggingface.co/unsloth/Mistral-Large-3-675B-Instruct-2512-NVFP4)                                                                                                        |
| [**FunctionGemma**](https://docs.unsloth.ai/models/functiongemma)                    | 270M               | [link](https://huggingface.co/unsloth/functiongemma-270m-it-GGUF)                                                                                               | —                                                                                                                                                                                      |
| FLUX.2                                                                               | dev                | [link](https://huggingface.co/unsloth/FLUX.2-dev-GGUF)                                                                                                          | —                                                                                                                                                                                      |
| [**Qwen3-Next**](https://docs.unsloth.ai/models/qwen3-next)                          | 80B-A3B-Instruct   | [link](https://huggingface.co/unsloth/Qwen3-Next-80B-A3B-Instruct-GGUF)                                                                                         | [link](https://huggingface.co/unsloth/Qwen3-Next-80B-A3B-Instruct-bnb-4bit/)                                                                                                           |
|                                                                                      | 80B-A3B-Thinking   | [link](https://huggingface.co/unsloth/Qwen3-Next-80B-A3B-Thinking-GGUF)                                                                                         | —                                                                                                                                                                                      |
| [**Qwen3-VL**](https://docs.unsloth.ai/models/qwen3-vl-how-to-run-and-fine-tune)     | 2B-Instruct        | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-GGUF)                                                                                                | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-unsloth-bnb-4bit)                                                                                                           |
|                                                                                      | 2B-Thinking        | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Thinking-GGUF)                                                                                                | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Thinking-unsloth-bnb-4bit)                                                                                                           |
|                                                                                      | 4B-Instruct        | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-GGUF)                                                                                                | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-unsloth-bnb-4bit)                                                                                                           |
|                                                                                      | 4B-Thinking        | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-GGUF)                                                                                                | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-unsloth-bnb-4bit)                                                                                                           |
|                                                                                      | 8B-Instruct        | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-GGUF)                                                                                                | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-unsloth-bnb-4bit)                                                                                                           |
|                                                                                      | 8B-Thinking        | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-GGUF)                                                                                                | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-unsloth-bnb-4bit)                                                                                                           |
|                                                                                      | 30B-A3B-Instruct   | [link](https://huggingface.co/unsloth/Qwen3-VL-30B-A3B-Instruct-GGUF)                                                                                           | —                                                                                                                                                                                      |
|                                                                                      | 30B-A3B-Thinking   | [link](https://huggingface.co/unsloth/Qwen3-VL-30B-A3B-Thinking-GGUF)                                                                                           | —                                                                                                                                                                                      |
|                                                                                      | 32B-Instruct       | [link](https://huggingface.co/unsloth/Qwen3-VL-32B-Instruct-GGUF)                                                                                               | [link](https://huggingface.co/unsloth/Qwen3-VL-32B-Instruct-unsloth-bnb-4bit)                                                                                                          |
|                                                                                      | 32B-Thinking       | [link](https://huggingface.co/unsloth/Qwen3-VL-32B-Thinking-GGUF)                                                                                               | [link](https://huggingface.co/unsloth/Qwen3-VL-32B-Thinking-unsloth-bnb-4bit)                                                                                                          |
|                                                                                      | 235B-A22B-Instruct | [link](https://huggingface.co/unsloth/Qwen3-VL-235B-A22B-Instruct-GGUF)                                                                                         | —                                                                                                                                                                                      |
|                                                                                      | 235B-A22B-Thinking | [link](https://huggingface.co/unsloth/Qwen3-VL-235B-A22B-Thinking-GGUF)                                                                                         | —                                                                                                                                                                                      |
| [**Qwen3-2507**](https://docs.unsloth.ai/models/qwen3-next)                          | 30B-A3B-Instruct   | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF)                                                                                         | —                                                                                                                                                                                      |
|                                                                                      | 30B-A3B-Thinking   | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF)                                                                                         | —                                                                                                                                                                                      |
|                                                                                      | 235B-A22B-Thinking | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B-Thinking-2507-GGUF/)                                                                                      | —                                                                                                                                                                                      |
|                                                                                      | 235B-A22B-Instruct | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B-Instruct-2507-GGUF/)                                                                                      | —                                                                                                                                                                                      |
| [**Qwen3-Coder**](https://docs.unsloth.ai/models/qwen3-coder-how-to-run-locally)     | 30B-A3B            | [link](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF)                                                                                        | —                                                                                                                                                                                      |
|                                                                                      | 480B-A35B          | [link](https://huggingface.co/unsloth/Qwen3-Coder-480B-A35B-Instruct-GGUF)                                                                                      | —                                                                                                                                                                                      |
| [**GLM**](https://docs.unsloth.ai/models/glm-4.6-how-to-run-locally)                 | 4.6V-Flash         | [link](https://huggingface.co/unsloth/GLM-4.6V-Flash-GGUF)                                                                                                      | —                                                                                                                                                                                      |
|                                                                                      | 4.6                | [link](https://huggingface.co/unsloth/GLM-4.6-GGUF)                                                                                                             | —                                                                                                                                                                                      |
|                                                                                      | 4.5-Air            | [link](https://huggingface.co/unsloth/GLM-4.5-Air-GGUF)                                                                                                         | —                                                                                                                                                                                      |
| [**DeepSeek-V3.1**](https://docs.unsloth.ai/models/deepseek-v3.1-how-to-run-locally) | Terminus           | [link](https://huggingface.co/unsloth/DeepSeek-V3.1-Terminus-GGUF)                                                                                              | —                                                                                                                                                                                      |
|                                                                                      | V3.1               | [link](https://huggingface.co/unsloth/DeepSeek-V3.1-GGUF)                                                                                                       | —                                                                                                                                                                                      |
| **Granite-4.0**                                                                      | H-Small            | [link](https://huggingface.co/unsloth/granite-4.0-h-small-GGUF)                                                                                                 | [link](https://huggingface.co/unsloth/granite-4.0-h-small-unsloth-bnb-4bit)                                                                                                            |
| **Kimi-K2**                                                                          | Thinking           | [link](https://huggingface.co/unsloth/Kimi-K2-Thinking-GGUF)                                                                                                    | —                                                                                                                                                                                      |
|                                                                                      | 0905               | [link](https://huggingface.co/unsloth/Kimi-K2-Instruct-0905-GGUF)                                                                                               | —                                                                                                                                                                                      |
| **Gemma 3n**                                                                         | E2B                | [link](https://huggingface.co/unsloth/gemma-3n-E2B-it-GGUF)                                                                                                     | [link](https://huggingface.co/unsloth/gemma-3n-E2B-it-unsloth-bnb-4bit)                                                                                                                |
|                                                                                      | E4B                | [link](https://huggingface.co/unsloth/gemma-3n-E4B-it-GGUF)                                                                                                     | [link](https://huggingface.co/unsloth/gemma-3n-E4B-it-unsloth-bnb-4bit)                                                                                                                |
| **DeepSeek-R1-0528**                                                                 | R1-0528-Qwen3-8B   | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF)                                                                                           | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-unsloth-bnb-4bit)                                                                                                      |
|                                                                                      | R1-0528            | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF)                                                                                                    | —                                                                                                                                                                                      |

#### DeepSeek models:

| Model             | Variant                | GGUF                                                                      | Instruct (4-bit)                                                                      |
| ----------------- | ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **DeepSeek-V3.1** | Terminus               | [link](https://huggingface.co/unsloth/DeepSeek-V3.1-Terminus-GGUF)        |                                                                                       |
|                   | V3.1                   | [link](https://huggingface.co/unsloth/DeepSeek-V3.1-GGUF)                 |                                                                                       |
| **DeepSeek-V3**   | V3-0324                | [link](https://huggingface.co/unsloth/DeepSeek-V3-0324-GGUF)              | —                                                                                     |
|                   | V3                     | [link](https://huggingface.co/unsloth/DeepSeek-V3-GGUF)                   | —                                                                                     |
| **DeepSeek-R1**   | R1-0528                | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF)              | —                                                                                     |
|                   | R1-0528-Qwen3-8B       | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF)     | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-unsloth-bnb-4bit)     |
|                   | R1                     | [link](https://huggingface.co/unsloth/DeepSeek-R1-GGUF)                   | —                                                                                     |
|                   | R1 Zero                | [link](https://huggingface.co/unsloth/DeepSeek-R1-Zero-GGUF)              | —                                                                                     |
|                   | Distill Llama 3 8 B    | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF)  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit)  |
|                   | Distill Llama 3.3 70 B | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-70B-GGUF) | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-70B-bnb-4bit)         |
|                   | Distill Qwen 2.5 1.5 B | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF) | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-1.5B-unsloth-bnb-4bit) |
|                   | Distill Qwen 2.5 7 B   | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF)   | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-7B-unsloth-bnb-4bit)   |
|                   | Distill Qwen 2.5 14 B  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-14B-GGUF)  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-14B-unsloth-bnb-4bit)  |
|                   | Distill Qwen 2.5 32 B  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B-GGUF)  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B-bnb-4bit)          |

| Model         | Variant             | GGUF                                                                           | Instruct (4-bit)                                                                       |
| ------------- | ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Llama 4**   | Scout 17 B-16 E     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF)     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-unsloth-bnb-4bit) |
|               | Maverick 17 B-128 E | [link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct-GGUF) | —                                                                                      |
| **Llama 3.3** | 70 B                | [link](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-GGUF)             | [link](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-bnb-4bit)                 |
| **Llama 3.2** | 1 B                 | [link](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-GGUF)              | [link](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-bnb-4bit)                  |
|               | 3 B                 | [link](https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-GGUF)              | [link](https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-bnb-4bit)                  |
|               | 11 B Vision         | —                                                                              | [link](https://huggingface.co/unsloth/Llama-3.2-11B-Vision-Instruct-unsloth-bnb-4bit)  |
|               | 90 B Vision         | —                                                                              | [link](https://huggingface.co/unsloth/Llama-3.2-90B-Vision-Instruct-bnb-4bit)          |
| **Llama 3.1** | 8 B                 | [link](https://huggingface.co/unsloth/Llama-3.1-8B-Instruct-GGUF)              | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit)             |
|               | 70 B                | —                                                                              | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct-bnb-4bit)            |
|               | 405 B               | —                                                                              | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-405B-Instruct-bnb-4bit)           |
| **Llama 3**   | 8 B                 | —                                                                              | [link](https://huggingface.co/unsloth/llama-3-8b-Instruct-bnb-4bit)                    |
|               | 70 B                | —                                                                              | [link](https://huggingface.co/unsloth/llama-3-70b-bnb-4bit)                            |
| **Llama 2**   | 7 B                 | —                                                                              | [link](https://huggingface.co/unsloth/llama-2-7b-chat-bnb-4bit)                        |
|               | 13 B                | —                                                                              | [link](https://huggingface.co/unsloth/llama-2-13b-bnb-4bit)                            |
| **CodeLlama** | 7 B                 | —                                                                              | [link](https://huggingface.co/unsloth/codellama-7b-bnb-4bit)                           |
|               | 13 B                | —                                                                              | [link](https://huggingface.co/unsloth/codellama-13b-bnb-4bit)                          |
|               | 34 B                | —                                                                              | [link](https://huggingface.co/unsloth/codellama-34b-bnb-4bit)                          |

| Model             | Variant       | GGUF                                                              | Instruct (4-bit)                                                             |
| ----------------- | ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **FunctionGemma** | 270M          | [link](https://huggingface.co/unsloth/functiongemma-270m-it-GGUF) | —                                                                            |
| **Gemma 3n**      | E2B           | ​[link](https://huggingface.co/unsloth/gemma-3n-E2B-it-GGUF)      | [link](https://huggingface.co/unsloth/gemma-3n-E2B-it-unsloth-bnb-4bit)      |
|                   | E4B           | [link](https://huggingface.co/unsloth/gemma-3n-E4B-it-GGUF)       | [link](https://huggingface.co/unsloth/gemma-3n-E4B-it-unsloth-bnb-4bit)      |
| **Gemma 3**       | 270M          | [link](https://huggingface.co/unsloth/gemma-3-270m-it-GGUF)       | [link](https://huggingface.co/unsloth/gemma-3-270m-it)                       |
|                   | 1 B           | [link](https://huggingface.co/unsloth/gemma-3-1b-it-GGUF)         | [link](https://huggingface.co/unsloth/gemma-3-1b-it-unsloth-bnb-4bit)        |
|                   | 4 B           | [link](https://huggingface.co/unsloth/gemma-3-4b-it-GGUF)         | [link](https://huggingface.co/unsloth/gemma-3-4b-it-unsloth-bnb-4bit)        |
|                   | 12 B          | [link](https://huggingface.co/unsloth/gemma-3-12b-it-GGUF)        | [link](https://huggingface.co/unsloth/gemma-3-12b-it-unsloth-bnb-4bit)       |
|                   | 27 B          | [link](https://huggingface.co/unsloth/gemma-3-27b-it-GGUF)        | [link](https://huggingface.co/unsloth/gemma-3-27b-it-unsloth-bnb-4bit)       |
| **MedGemma**      | 4 B (vision)  | [link](https://huggingface.co/unsloth/medgemma-4b-it-GGUF)        | [link](https://huggingface.co/unsloth/medgemma-4b-it-unsloth-bnb-4bit)       |
|                   | 27 B (vision) | [link](https://huggingface.co/unsloth/medgemma-27b-it-GGUF)       | [link](https://huggingface.co/unsloth/medgemma-27b-text-it-unsloth-bnb-4bit) |
| **Gemma 2**       | 2 B           | [link](https://huggingface.co/unsloth/gemma-2-it-GGUF)            | [link](https://huggingface.co/unsloth/gemma-2-2b-it-bnb-4bit)                |
|                   | 9 B           | —                                                                 | [link](https://huggingface.co/unsloth/gemma-2-9b-it-bnb-4bit)                |
|                   | 27 B          | —                                                                 | [link](https://huggingface.co/unsloth/gemma-2-27b-it-bnb-4bit)               |

| Model                                                                            | Variant            | GGUF                                                                         | Instruct (4-bit)                                                                |
| -------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [**Qwen3-VL**](https://docs.unsloth.ai/models/qwen3-vl-how-to-run-and-fine-tune) | 2B-Instruct        | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-GGUF)             | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-unsloth-bnb-4bit)    |
|                                                                                  | 2B-Thinking        | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Thinking-GGUF)             | [link](https://huggingface.co/unsloth/Qwen3-VL-2B-Thinking-unsloth-bnb-4bit)    |
|                                                                                  | 4B-Instruct        | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-GGUF)             | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-unsloth-bnb-4bit)    |
|                                                                                  | 4B-Thinking        | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-GGUF)             | [link](https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-unsloth-bnb-4bit)    |
|                                                                                  | 8B-Instruct        | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-GGUF)             | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-unsloth-bnb-4bit)    |
|                                                                                  | 8B-Thinking        | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-GGUF)             | [link](https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-unsloth-bnb-4bit)    |
| **Qwen3-Coder**                                                                  | 30B-A3B            | [link](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF)     | —                                                                               |
|                                                                                  | 480B-A35B          | [link](https://huggingface.co/unsloth/Qwen3-Coder-480B-A35B-Instruct-GGUF)   | —                                                                               |
| [**Qwen3-2507**](https://docs.unsloth.ai/models/qwen3-next)                      | 30B-A3B-Instruct   | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF)      | —                                                                               |
|                                                                                  | 30B-A3B-Thinking   | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF)      | —                                                                               |
|                                                                                  | 235B-A22B-Thinking | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B-Thinking-2507-GGUF/)   | —                                                                               |
|                                                                                  | 235B-A22B-Instruct | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B-Instruct-2507-GGUF/)   | —                                                                               |
| **Qwen 3**                                                                       | 0.6 B              | [link](https://huggingface.co/unsloth/Qwen3-0.6B-GGUF)                       | [link](https://huggingface.co/unsloth/Qwen3-0.6B-unsloth-bnb-4bit)              |
|                                                                                  | 1.7 B              | [link](https://huggingface.co/unsloth/Qwen3-1.7B-GGUF)                       | [link](https://huggingface.co/unsloth/Qwen3-1.7B-unsloth-bnb-4bit)              |
|                                                                                  | 4 B                | [link](https://huggingface.co/unsloth/Qwen3-4B-GGUF)                         | [link](https://huggingface.co/unsloth/Qwen3-4B-unsloth-bnb-4bit)                |
|                                                                                  | 8 B                | [link](https://huggingface.co/unsloth/Qwen3-8B-GGUF)                         | [link](https://huggingface.co/unsloth/Qwen3-8B-unsloth-bnb-4bit)                |
|                                                                                  | 14 B               | [link](https://huggingface.co/unsloth/Qwen3-14B-GGUF)                        | [link](https://huggingface.co/unsloth/Qwen3-14B-unsloth-bnb-4bit)               |
|                                                                                  | 30 B-A3B           | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-GGUF)                    | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-bnb-4bit)                   |
|                                                                                  | 32 B               | [link](https://huggingface.co/unsloth/Qwen3-32B-GGUF)                        | [link](https://huggingface.co/unsloth/Qwen3-32B-unsloth-bnb-4bit)               |
|                                                                                  | 235 B-A22B         | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B-GGUF)                  | —                                                                               |
| **Qwen 2.5 Omni**                                                                | 3 B                | [link](https://huggingface.co/unsloth/Qwen2.5-Omni-3B-GGUF)                  | —                                                                               |
|                                                                                  | 7 B                | [link](https://huggingface.co/unsloth/Qwen2.5-Omni-7B-GGUF)                  | —                                                                               |
| **Qwen 2.5 VL**                                                                  | 3 B                | [link](https://huggingface.co/unsloth/Qwen2.5-VL-3B-Instruct-GGUF)           | [link](https://huggingface.co/unsloth/Qwen2.5-VL-3B-Instruct-unsloth-bnb-4bit)  |
|                                                                                  | 7 B                | [link](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF)           | [link](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-unsloth-bnb-4bit)  |
|                                                                                  | 32 B               | [link](https://huggingface.co/unsloth/Qwen2.5-VL-32B-Instruct-GGUF)          | [link](https://huggingface.co/unsloth/Qwen2.5-VL-32B-Instruct-unsloth-bnb-4bit) |
|                                                                                  | 72 B               | [link](https://huggingface.co/unsloth/Qwen2.5-VL-72B-Instruct-GGUF)          | [link](https://huggingface.co/unsloth/Qwen2.5-VL-72B-Instruct-unsloth-bnb-4bit) |
| **Qwen 2.5**                                                                     | 0.5 B              | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-0.5B-Instruct-bnb-4bit)           |
|                                                                                  | 1.5 B              | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-1.5B-Instruct-bnb-4bit)           |
|                                                                                  | 3 B                | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-3B-Instruct-bnb-4bit)             |
|                                                                                  | 7 B                | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-7B-Instruct-bnb-4bit)             |
|                                                                                  | 14 B               | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-14B-Instruct-bnb-4bit)            |
|                                                                                  | 32 B               | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-32B-Instruct-bnb-4bit)            |
|                                                                                  | 72 B               | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2.5-72B-Instruct-bnb-4bit)            |
| **Qwen 2.5 Coder (128 K)**                                                       | 0.5 B              | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-0.5B-Instruct-128K-GGUF) | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-0.5B-Instruct-bnb-4bit)     |
|                                                                                  | 1.5 B              | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-1.5B-Instruct-128K-GGUF) | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-1.5B-Instruct-bnb-4bit)     |
|                                                                                  | 3 B                | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-3B-Instruct-128K-GGUF)   | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-3B-Instruct-bnb-4bit)       |
|                                                                                  | 7 B                | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-7B-Instruct-128K-GGUF)   | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-7B-Instruct-bnb-4bit)       |
|                                                                                  | 14 B               | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-14B-Instruct-128K-GGUF)  | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-14B-Instruct-bnb-4bit)      |
|                                                                                  | 32 B               | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-32B-Instruct-128K-GGUF)  | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-32B-Instruct-bnb-4bit)      |
| **QwQ**                                                                          | 32 B               | [link](https://huggingface.co/unsloth/QwQ-32B-GGUF)                          | [link](https://huggingface.co/unsloth/QwQ-32B-unsloth-bnb-4bit)                 |
| **QVQ (preview)**                                                                | 72 B               | —                                                                            | [link](https://huggingface.co/unsloth/QVQ-72B-Preview-bnb-4bit)                 |
| **Qwen 2 (chat)**                                                                | 1.5 B              | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2-1.5B-Instruct-bnb-4bit)             |
|                                                                                  | 7 B                | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2-7B-Instruct-bnb-4bit)               |
|                                                                                  | 72 B               | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2-72B-Instruct-bnb-4bit)              |
| **Qwen 2 VL**                                                                    | 2 B                | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2-VL-2B-Instruct-unsloth-bnb-4bit)    |
|                                                                                  | 7 B                | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2-VL-7B-Instruct-unsloth-bnb-4bit)    |
|                                                                                  | 72 B               | —                                                                            | [link](https://huggingface.co/unsloth/Qwen2-VL-72B-Instruct-bnb-4bit)           |

| Model             | Variant           | GGUF                                                                            | Instruct (4-bit)                                                                            |
| ----------------- | ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Magistral**     | Small (2506)      | [link](https://huggingface.co/unsloth/Magistral-Small-2506-GGUF)                | [link](https://huggingface.co/unsloth/Magistral-Small-2506-unsloth-bnb-4bit)                |
|                   | Small (2509)      | [link](https://huggingface.co/unsloth/Magistral-Small-2509-GGUF)                | [link](https://huggingface.co/unsloth/Magistral-Small-2509-unsloth-bnb-4bit)                |
|                   | Small (2507)      | [link](https://huggingface.co/unsloth/Magistral-Small-2507-GGUF)                | [link](https://huggingface.co/unsloth/Magistral-Small-2507-unsloth-bnb-4bit)                |
| **Mistral Small** | 3.2-24 B (2506)   | [link](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF) | [link](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506-unsloth-bnb-4bit) |
|                   | 3.1-24 B (2503)   | [link](https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503-GGUF) | [link](https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503-unsloth-bnb-4bit) |
|                   | 3-24 B (2501)     | [link](https://huggingface.co/unsloth/Mistral-Small-24B-Instruct-2501-GGUF)     | [link](https://huggingface.co/unsloth/Mistral-Small-24B-Instruct-2501-unsloth-bnb-4bit)     |
|                   | 2409-22 B         | —                                                                               | [link](https://huggingface.co/unsloth/Mistral-Small-Instruct-2409-bnb-4bit)                 |
| **Devstral**      | Small-24 B (2507) | [link](https://huggingface.co/unsloth/Devstral-Small-2507-GGUF)                 | [link](https://huggingface.co/unsloth/Devstral-Small-2507-unsloth-bnb-4bit)                 |
|                   | Small-24 B (2505) | [link](https://huggingface.co/unsloth/Devstral-Small-2505-GGUF)                 | [link](https://huggingface.co/unsloth/Devstral-Small-2505-unsloth-bnb-4bit)                 |
| **Pixtral**       | 12 B (2409)       | —                                                                               | [link](https://huggingface.co/unsloth/Pixtral-12B-2409-bnb-4bit)                            |
| **Mistral NeMo**  | 12 B (2407)       | [link](https://huggingface.co/unsloth/Mistral-Nemo-Instruct-2407-GGUF)          | [link](https://huggingface.co/unsloth/Mistral-Nemo-Instruct-2407-bnb-4bit)                  |
| **Mistral Large** | 2407              | —                                                                               | [link](https://huggingface.co/unsloth/Mistral-Large-Instruct-2407-bnb-4bit)                 |
| **Mistral 7 B**   | v0.3              | —                                                                               | [link](https://huggingface.co/unsloth/mistral-7b-instruct-v0.3-bnb-4bit)                    |
|                   | v0.2              | —                                                                               | [link](https://huggingface.co/unsloth/mistral-7b-instruct-v0.2-bnb-4bit)                    |
| **Mixtral**       | 8 × 7 B           | —                                                                               | [link](https://huggingface.co/unsloth/Mixtral-8x7B-Instruct-v0.1-unsloth-bnb-4bit)          |

| Model       | Variant          | GGUF                                                             | Instruct (4-bit)                                                             |
| ----------- | ---------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Phi-4**   | Reasoning-plus   | [link](https://huggingface.co/unsloth/Phi-4-reasoning-plus-GGUF) | [link](https://huggingface.co/unsloth/Phi-4-reasoning-plus-unsloth-bnb-4bit) |
|             | Reasoning        | [link](https://huggingface.co/unsloth/Phi-4-reasoning-GGUF)      | [link](https://huggingface.co/unsloth/phi-4-reasoning-unsloth-bnb-4bit)      |
|             | Mini-Reasoning   | [link](https://huggingface.co/unsloth/Phi-4-mini-reasoning-GGUF) | [link](https://huggingface.co/unsloth/Phi-4-mini-reasoning-unsloth-bnb-4bit) |
|             | Phi-4 (instruct) | [link](https://huggingface.co/unsloth/phi-4-GGUF)                | [link](https://huggingface.co/unsloth/phi-4-unsloth-bnb-4bit)                |
|             | mini (instruct)  | [link](https://huggingface.co/unsloth/Phi-4-mini-instruct-GGUF)  | [link](https://huggingface.co/unsloth/Phi-4-mini-instruct-unsloth-bnb-4bit)  |
| **Phi-3.5** | mini             | —                                                                | [link](https://huggingface.co/unsloth/Phi-3.5-mini-instruct-bnb-4bit)        |
| **Phi-3**   | mini             | —                                                                | [link](https://huggingface.co/unsloth/Phi-3-mini-4k-instruct-bnb-4bit)       |
|             | medium           | —                                                                | [link](https://huggingface.co/unsloth/Phi-3-medium-4k-instruct-bnb-4bit)     |

#### Other (GLM, Orpheus, Smol, Llava etc.) models:

| Model           | Variant              | GGUF                                                                           | Instruct (4-bit)                                                          |
| --------------- | -------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| GLM             | 4.5-Air              | [link](https://huggingface.co/unsloth/GLM-4.5-Air-GGUF)                        | —                                                                         |
|                 | 4.5                  | [4.5](https://huggingface.co/unsloth/GLM-4.5-GGUF)                             | —                                                                         |
|                 | 4-32B-0414           | [4-32B-0414](https://huggingface.co/unsloth/GLM-4-32B-0414-GGUF)               | —                                                                         |
| **Grok 2**      | 270B                 | [link](https://huggingface.co/unsloth/grok-2-GGUF)                             | —                                                                         |
| **Baidu-ERNIE** | 4.5-21B-A3B-Thinking | [link](https://huggingface.co/unsloth/ERNIE-4.5-21B-A3B-Thinking-GGUF)         | —                                                                         |
| Hunyuan         | A13B                 | [link](https://huggingface.co/unsloth/Hunyuan-A13B-Instruct-GGUF)              | —                                                                         |
| Orpheus         | 0.1-ft (3B)          | [link](https://app.gitbook.com/o/HpyELzcNe0topgVLGCZY/s/xhOjnexMCB3dmuQFQ2Zq/) | [link](https://huggingface.co/unsloth/orpheus-3b-0.1-ft-unsloth-bnb-4bit) |
| **LLava**       | 1.5 (7 B)            | —                                                                              | [link](https://huggingface.co/unsloth/llava-1.5-7b-hf-bnb-4bit)           |
|                 | 1.6 Mistral (7 B)    | —                                                                              | [link](https://huggingface.co/unsloth/llava-v1.6-mistral-7b-hf-bnb-4bit)  |
| **TinyLlama**   | Chat                 | —                                                                              | [link](https://huggingface.co/unsloth/tinyllama-chat-bnb-4bit)            |
| **SmolLM 2**    | 135 M                | [link](https://huggingface.co/unsloth/SmolLM2-135M-Instruct-GGUF)              | [link](https://huggingface.co/unsloth/SmolLM2-135M-Instruct-bnb-4bit)     |
|                 | 360 M                | [link](https://huggingface.co/unsloth/SmolLM2-360M-Instruct-GGUF)              | [link](https://huggingface.co/unsloth/SmolLM2-360M-Instruct-bnb-4bit)     |
|                 | 1.7 B                | [link](https://huggingface.co/unsloth/SmolLM2-1.7B-Instruct-GGUF)              | [link](https://huggingface.co/unsloth/SmolLM2-1.7B-Instruct-bnb-4bit)     |
| **Zephyr-SFT**  | 7 B                  | —                                                                              | [link](https://huggingface.co/unsloth/zephyr-sft-bnb-4bit)                |
| **Yi**          | 6 B (v1.5)           | —                                                                              | [link](https://huggingface.co/unsloth/Yi-1.5-6B-bnb-4bit)                 |
|                 | 6 B (v1.0)           | —                                                                              | [link](https://huggingface.co/unsloth/yi-6b-bnb-4bit)                     |
|                 | 34 B (chat)          | —                                                                              | [link](https://huggingface.co/unsloth/yi-34b-chat-bnb-4bit)               |
|                 | 34 B (base)          | —                                                                              | [link](https://huggingface.co/unsloth/yi-34b-bnb-4bit)                    |
| {% endtab %}    |                      |                                                                                |                                                                           |

{% tab title="• Instruct 16-bit" %}
16-bit and 8-bit Instruct models are used for inference or fine-tuning:

| Model                | Variant                | Instruct (16-bit)                                                          |
| -------------------- | ---------------------- | -------------------------------------------------------------------------- |
| **gpt-oss** (new)    | 20b                    | [link](https://huggingface.co/unsloth/gpt-oss-20b)                         |
|                      | 120b                   | [link](https://huggingface.co/unsloth/gpt-oss-120b)                        |
| **Gemma 3n**         | E2B                    | [link](https://huggingface.co/unsloth/gemma-3n-E4B-it)                     |
|                      | E4B                    | [link](https://huggingface.co/unsloth/gemma-3n-E2B-it)                     |
| **DeepSeek-R1-0528** | R1-0528-Qwen3-8B       | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B)           |
|                      | R1-0528                | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528)                    |
| **Mistral**          | Small 3.2 24B (2506)   | [link](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506) |
|                      | Small 3.1 24B (2503)   | [link](https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503) |
|                      | Small 3.0 24B (2501)   | [link](https://huggingface.co/unsloth/Mistral-Small-24B-Instruct-2501)     |
|                      | Magistral Small (2506) | [link](https://huggingface.co/unsloth/Magistral-Small-2506)                |
| **Qwen 3**           | 0.6 B                  | [link](https://huggingface.co/unsloth/Qwen3-0.6B)                          |
|                      | 1.7 B                  | [link](https://huggingface.co/unsloth/Qwen3-1.7B)                          |
|                      | 4 B                    | [link](https://huggingface.co/unsloth/Qwen3-4B)                            |
|                      | 8 B                    | [link](https://huggingface.co/unsloth/Qwen3-8B)                            |
|                      | 14 B                   | [link](https://huggingface.co/unsloth/Qwen3-14B)                           |
|                      | 30B-A3B                | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B)                       |
|                      | 32 B                   | [link](https://huggingface.co/unsloth/Qwen3-32B)                           |
|                      | 235B-A22B              | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B)                     |
| **Llama 4**          | Scout 17B-16E          | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct)      |
|                      | Maverick 17B-128E      | [link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct)  |
| **Qwen 2.5 Omni**    | 3 B                    | [link](https://huggingface.co/unsloth/Qwen2.5-Omni-3B)                     |
|                      | 7 B                    | [link](https://huggingface.co/unsloth/Qwen2.5-Omni-7B)                     |
| **Phi-4**            | Reasoning-plus         | [link](https://huggingface.co/unsloth/Phi-4-reasoning-plus)                |
|                      | Reasoning              | [link](https://huggingface.co/unsloth/Phi-4-reasoning)                     |

| Model           | Variant               | Instruct (16-bit)                                                    |
| --------------- | --------------------- | -------------------------------------------------------------------- |
| **DeepSeek-V3** | V3-0324               | [link](https://huggingface.co/unsloth/DeepSeek-V3-0324)              |
|                 | V3                    | [link](https://huggingface.co/unsloth/DeepSeek-V3)                   |
| **DeepSeek-R1** | R1-0528               | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528)              |
|                 | R1-0528-Qwen3-8B      | [link](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B)     |
|                 | R1                    | [link](https://huggingface.co/unsloth/DeepSeek-R1)                   |
|                 | R1 Zero               | [link](https://huggingface.co/unsloth/DeepSeek-R1-Zero)              |
|                 | Distill Llama 3 8B    | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B)  |
|                 | Distill Llama 3.3 70B | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-70B) |
|                 | Distill Qwen 2.5 1.5B | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-1.5B) |
|                 | Distill Qwen 2.5 7B   | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-7B)   |
|                 | Distill Qwen 2.5 14B  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-14B)  |
|                 | Distill Qwen 2.5 32B  | [link](https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B)  |

| Family        | Variant           | Instruct (16-bit)                                                         |
| ------------- | ----------------- | ------------------------------------------------------------------------- |
| **Llama 4**   | Scout 17B-16E     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct)     |
|               | Maverick 17B-128E | [link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct) |
| **Llama 3.3** | 70 B              | [link](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct)             |
| **Llama 3.2** | 1 B               | [link](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct)              |
|               | 3 B               | [link](https://huggingface.co/unsloth/Llama-3.2-3B-Instruct)              |
|               | 11 B Vision       | [link](https://huggingface.co/unsloth/Llama-3.2-11B-Vision-Instruct)      |
|               | 90 B Vision       | [link](https://huggingface.co/unsloth/Llama-3.2-90B-Vision-Instruct)      |
| **Llama 3.1** | 8 B               | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct)         |
|               | 70 B              | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct)        |
|               | 405 B             | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-405B-Instruct)       |
| **Llama 3**   | 8 B               | [link](https://huggingface.co/unsloth/llama-3-8b-Instruct)                |
|               | 70 B              | [link](https://huggingface.co/unsloth/llama-3-70b-Instruct)               |
| **Llama 2**   | 7 B               | [link](https://huggingface.co/unsloth/llama-2-7b-chat)                    |

| Model        | Variant | Instruct (16-bit)                                      |
| ------------ | ------- | ------------------------------------------------------ |
| **Gemma 3n** | E2B     | [link](https://huggingface.co/unsloth/gemma-3n-E4B-it) |
|              | E4B     | [link](https://huggingface.co/unsloth/gemma-3n-E2B-it) |
| **Gemma 3**  | 1 B     | [link](https://huggingface.co/unsloth/gemma-3-1b-it)   |
|              | 4 B     | [link](https://huggingface.co/unsloth/gemma-3-4b-it)   |
|              | 12 B    | [link](https://huggingface.co/unsloth/gemma-3-12b-it)  |
|              | 27 B    | [link](https://huggingface.co/unsloth/gemma-3-27b-it)  |
| **Gemma 2**  | 2 B     | [link](https://huggingface.co/unsloth/gemma-2b-it)     |
|              | 9 B     | [link](https://huggingface.co/unsloth/gemma-9b-it)     |
|              | 27 B    | [link](https://huggingface.co/unsloth/gemma-27b-it)    |

| Family                   | Variant   | Instruct (16-bit)                                                       |
| ------------------------ | --------- | ----------------------------------------------------------------------- |
| **Qwen 3**               | 0.6 B     | [link](https://huggingface.co/unsloth/Qwen3-0.6B)                       |
|                          | 1.7 B     | [link](https://huggingface.co/unsloth/Qwen3-1.7B)                       |
|                          | 4 B       | [link](https://huggingface.co/unsloth/Qwen3-4B)                         |
|                          | 8 B       | [link](https://huggingface.co/unsloth/Qwen3-8B)                         |
|                          | 14 B      | [link](https://huggingface.co/unsloth/Qwen3-14B)                        |
|                          | 30B-A3B   | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B)                    |
|                          | 32 B      | [link](https://huggingface.co/unsloth/Qwen3-32B)                        |
|                          | 235B-A22B | [link](https://huggingface.co/unsloth/Qwen3-235B-A22B)                  |
| **Qwen 2.5 Omni**        | 3 B       | [link](https://huggingface.co/unsloth/Qwen2.5-Omni-3B)                  |
|                          | 7 B       | [link](https://huggingface.co/unsloth/Qwen2.5-Omni-7B)                  |
| **Qwen 2.5 VL**          | 3 B       | [link](https://huggingface.co/unsloth/Qwen2.5-VL-3B-Instruct)           |
|                          | 7 B       | [link](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct)           |
|                          | 32 B      | [link](https://huggingface.co/unsloth/Qwen2.5-VL-32B-Instruct)          |
|                          | 72 B      | [link](https://huggingface.co/unsloth/Qwen2.5-VL-72B-Instruct)          |
| **Qwen 2.5**             | 0.5 B     | [link](https://huggingface.co/unsloth/Qwen2.5-0.5B-Instruct)            |
|                          | 1.5 B     | [link](https://huggingface.co/unsloth/Qwen2.5-1.5B-Instruct)            |
|                          | 3 B       | [link](https://huggingface.co/unsloth/Qwen2.5-3B-Instruct)              |
|                          | 7 B       | [link](https://huggingface.co/unsloth/Qwen2.5-7B-Instruct)              |
|                          | 14 B      | [link](https://huggingface.co/unsloth/Qwen2.5-14B-Instruct)             |
|                          | 32 B      | [link](https://huggingface.co/unsloth/Qwen2.5-32B-Instruct)             |
|                          | 72 B      | [link](https://huggingface.co/unsloth/Qwen2.5-72B-Instruct)             |
| **Qwen 2.5 Coder 128 K** | 0.5 B     | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-0.5B-Instruct-128K) |
|                          | 1.5 B     | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-1.5B-Instruct-128K) |
|                          | 3 B       | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-3B-Instruct-128K)   |
|                          | 7 B       | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-7B-Instruct-128K)   |
|                          | 14 B      | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-14B-Instruct-128K)  |
|                          | 32 B      | [link](https://huggingface.co/unsloth/Qwen2.5-Coder-32B-Instruct-128K)  |
| **QwQ**                  | 32 B      | [link](https://huggingface.co/unsloth/QwQ-32B)                          |
| **QVQ (preview)**        | 72 B      | —                                                                       |
| **Qwen 2 (Chat)**        | 1.5 B     | [link](https://huggingface.co/unsloth/Qwen2-1.5B-Instruct)              |
|                          | 7 B       | [link](https://huggingface.co/unsloth/Qwen2-7B-Instruct)                |
|                          | 72 B      | [link](https://huggingface.co/unsloth/Qwen2-72B-Instruct)               |
| **Qwen 2 VL**            | 2 B       | [link](https://huggingface.co/unsloth/Qwen2-VL-2B-Instruct)             |
|                          | 7 B       | [link](https://huggingface.co/unsloth/Qwen2-VL-7B-Instruct)             |
|                          | 72 B      | [link](https://huggingface.co/unsloth/Qwen2-VL-72B-Instruct)            |

| Model            | Variant        | Instruct (16-bit)                                                  |
| ---------------- | -------------- | ------------------------------------------------------------------ |
| **Mistral**      | Small 2409-22B | [link](https://huggingface.co/unsloth/Mistral-Small-Instruct-2409) |
| **Mistral**      | Large 2407     | [link](https://huggingface.co/unsloth/Mistral-Large-Instruct-2407) |
| **Mistral**      | 7B v0.3        | [link](https://huggingface.co/unsloth/mistral-7b-instruct-v0.3)    |
| **Mistral**      | 7B v0.2        | [link](https://huggingface.co/unsloth/mistral-7b-instruct-v0.2)    |
| **Pixtral**      | 12B 2409       | [link](https://huggingface.co/unsloth/Pixtral-12B-2409)            |
| **Mixtral**      | 8×7B           | [link](https://huggingface.co/unsloth/Mixtral-8x7B-Instruct-v0.1)  |
| **Mistral NeMo** | 12B 2407       | [link](https://huggingface.co/unsloth/Mistral-Nemo-Instruct-2407)  |
| **Devstral**     | Small 2505     | [link](https://huggingface.co/unsloth/Devstral-Small-2505)         |

| Model       | Variant        | Instruct (16-bit)                                               |
| ----------- | -------------- | --------------------------------------------------------------- |
| **Phi-4**   | Reasoning-plus | [link](https://huggingface.co/unsloth/Phi-4-reasoning-plus)     |
|             | Reasoning      | [link](https://huggingface.co/unsloth/Phi-4-reasoning)          |
|             | Phi-4 (core)   | [link](https://huggingface.co/unsloth/Phi-4)                    |
|             | Mini-Reasoning | [link](https://huggingface.co/unsloth/Phi-4-mini-reasoning)     |
|             | Mini           | [link](https://huggingface.co/unsloth/Phi-4-mini)               |
| **Phi-3.5** | Mini           | [link](https://huggingface.co/unsloth/Phi-3.5-mini-instruct)    |
| **Phi-3**   | Mini           | [link](https://huggingface.co/unsloth/Phi-3-mini-4k-instruct)   |
|             | Medium         | [link](https://huggingface.co/unsloth/Phi-3-medium-4k-instruct) |

#### Text-to-Speech (TTS) models:

| Model                  | Instruct (16-bit)                                                |
| ---------------------- | ---------------------------------------------------------------- |
| Orpheus-3B (v0.1 ft)   | [link](https://huggingface.co/unsloth/orpheus-3b-0.1-ft)         |
| Orpheus-3B (v0.1 pt)   | [link](https://huggingface.co/unsloth/orpheus-3b-0.1-pretrained) |
| Sesame-CSM 1B          | [link](https://huggingface.co/unsloth/csm-1b)                    |
| Whisper Large V3 (STT) | [link](https://huggingface.co/unsloth/whisper-large-v3)          |
| Llasa-TTS 1B           | [link](https://huggingface.co/unsloth/Llasa-1B)                  |
| Spark-TTS 0.5B         | [link](https://huggingface.co/unsloth/Spark-TTS-0.5B)            |
| Oute-TTS 1B            | [link](https://huggingface.co/unsloth/Llama-OuteTTS-1.0-1B)      |
| {% endtab %}           |                                                                  |

{% tab title="• Base 4 & 16-bit" %}
Base models are usually used for fine-tuning purposes:

| Model        | Variant           | Base (16-bit)                                                    | Base (4-bit)                                                                           |
| ------------ | ----------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Gemma 3n** | E2B               | [link](https://huggingface.co/unsloth/gemma-3n-E2B)              | [link](https://huggingface.co/unsloth/gemma-3n-E2B-unsloth-bnb-4bit)                   |
|              | E4B               | [link](https://huggingface.co/unsloth/gemma-3n-E4B)              | [link](https://huggingface.co/unsloth/gemma-3n-E4B-unsloth-bnb-4bit)                   |
| **Qwen 3**   | 0.6 B             | [link](https://huggingface.co/unsloth/Qwen3-0.6B-Base)           | [link](https://huggingface.co/unsloth/Qwen3-0.6B-Base-unsloth-bnb-4bit)                |
|              | 1.7 B             | [link](https://huggingface.co/unsloth/Qwen3-1.7B-Base)           | [link](https://huggingface.co/unsloth/Qwen3-1.7B-Base-unsloth-bnb-4bit)                |
|              | 4 B               | [link](https://huggingface.co/unsloth/Qwen3-4B-Base)             | [link](https://huggingface.co/unsloth/Qwen3-4B-Base-unsloth-bnb-4bit)                  |
|              | 8 B               | [link](https://huggingface.co/unsloth/Qwen3-8B-Base)             | [link](https://huggingface.co/unsloth/Qwen3-8B-Base-unsloth-bnb-4bit)                  |
|              | 14 B              | [link](https://huggingface.co/unsloth/Qwen3-14B-Base)            | [link](https://huggingface.co/unsloth/Qwen3-14B-Base-unsloth-bnb-4bit)                 |
|              | 30B-A3B           | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Base)        | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Base-bnb-4bit)                     |
| **Llama 4**  | Scout 17B 16E     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E)     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct-unsloth-bnb-4bit) |
|              | Maverick 17B 128E | [link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E) | —                                                                                      |

#### **Llama models:**

| Model         | Variant           | Base (16-bit)                                                    | Base (4-bit)                                                |
| ------------- | ----------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| **Llama 4**   | Scout 17B 16E     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E)     | —                                                           |
|               | Maverick 17B 128E | [link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E) | —                                                           |
| **Llama 3.3** | 70 B              | [link](https://huggingface.co/unsloth/Llama-3.3-70B)             | —                                                           |
| **Llama 3.2** | 1 B               | [link](https://huggingface.co/unsloth/Llama-3.2-1B)              | —                                                           |
|               | 3 B               | [link](https://huggingface.co/unsloth/Llama-3.2-3B)              | —                                                           |
|               | 11 B Vision       | [link](https://huggingface.co/unsloth/Llama-3.2-11B-Vision)      | —                                                           |
|               | 90 B Vision       | [link](https://huggingface.co/unsloth/Llama-3.2-90B-Vision)      | —                                                           |
| **Llama 3.1** | 8 B               | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-8B)         | —                                                           |
|               | 70 B              | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-70B)        | —                                                           |
| **Llama 3**   | 8 B               | [link](https://huggingface.co/unsloth/llama-3-8b)                | [link](https://huggingface.co/unsloth/llama-3-8b-bnb-4bit)  |
| **Llama 2**   | 7 B               | [link](https://huggingface.co/unsloth/llama-2-7b)                | [link](https://huggingface.co/unsloth/llama-2-7b-bnb-4bit)  |
|               | 13 B              | [link](https://huggingface.co/unsloth/llama-2-13b)               | [link](https://huggingface.co/unsloth/llama-2-13b-bnb-4bit) |

#### **Qwen models:**

| Model        | Variant | Base (16-bit)                                             | Base (4-bit)                                                               |
| ------------ | ------- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Qwen 3**   | 0.6 B   | [link](https://huggingface.co/unsloth/Qwen3-0.6B-Base)    | [link](https://huggingface.co/unsloth/Qwen3-0.6B-Base-unsloth-bnb-4bit)    |
|              | 1.7 B   | [link](https://huggingface.co/unsloth/Qwen3-1.7B-Base)    | [link](https://huggingface.co/unsloth/Qwen3-1.7B-Base-unsloth-bnb-4bit)    |
|              | 4 B     | [link](https://huggingface.co/unsloth/Qwen3-4B-Base)      | [link](https://huggingface.co/unsloth/Qwen3-4B-Base-unsloth-bnb-4bit)      |
|              | 8 B     | [link](https://huggingface.co/unsloth/Qwen3-8B-Base)      | [link](https://huggingface.co/unsloth/Qwen3-8B-Base-unsloth-bnb-4bit)      |
|              | 14 B    | [link](https://huggingface.co/unsloth/Qwen3-14B-Base)     | [link](https://huggingface.co/unsloth/Qwen3-14B-Base-unsloth-bnb-4bit)     |
|              | 30B-A3B | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Base) | [link](https://huggingface.co/unsloth/Qwen3-30B-A3B-Base-unsloth-bnb-4bit) |
| **Qwen 2.5** | 0.5 B   | [link](https://huggingface.co/unsloth/Qwen2.5-0.5B)       | [link](https://huggingface.co/unsloth/Qwen2.5-0.5B-bnb-4bit)               |
|              | 1.5 B   | [link](https://huggingface.co/unsloth/Qwen2.5-1.5B)       | [link](https://huggingface.co/unsloth/Qwen2.5-1.5B-bnb-4bit)               |
|              | 3 B     | [link](https://huggingface.co/unsloth/Qwen2.5-3B)         | [link](https://huggingface.co/unsloth/Qwen2.5-3B-bnb-4bit)                 |
|              | 7 B     | [link](https://huggingface.co/unsloth/Qwen2.5-7B)         | [link](https://huggingface.co/unsloth/Qwen2.5-7B-bnb-4bit)                 |
|              | 14 B    | [link](https://huggingface.co/unsloth/Qwen2.5-14B)        | [link](https://huggingface.co/unsloth/Qwen2.5-14B-bnb-4bit)                |
|              | 32 B    | [link](https://huggingface.co/unsloth/Qwen2.5-32B)        | [link](https://huggingface.co/unsloth/Qwen2.5-32B-bnb-4bit)                |
|              | 72 B    | [link](https://huggingface.co/unsloth/Qwen2.5-72B)        | [link](https://huggingface.co/unsloth/Qwen2.5-72B-bnb-4bit)                |
| **Qwen 2**   | 1.5 B   | [link](https://huggingface.co/unsloth/Qwen2-1.5B)         | [link](https://huggingface.co/unsloth/Qwen2-1.5B-bnb-4bit)                 |
|              | 7 B     | [link](https://huggingface.co/unsloth/Qwen2-7B)           | [link](https://huggingface.co/unsloth/Qwen2-7B-bnb-4bit)                   |

#### **Llama models:**

| Model         | Variant           | Base (16-bit)                                                    | Base (4-bit)                                                |
| ------------- | ----------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| **Llama 4**   | Scout 17B 16E     | [link](https://huggingface.co/unsloth/Llama-4-Scout-17B-16E)     | —                                                           |
|               | Maverick 17B 128E | [link](https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E) | —                                                           |
| **Llama 3.3** | 70 B              | [link](https://huggingface.co/unsloth/Llama-3.3-70B)             | —                                                           |
| **Llama 3.2** | 1 B               | [link](https://huggingface.co/unsloth/Llama-3.2-1B)              | —                                                           |
|               | 3 B               | [link](https://huggingface.co/unsloth/Llama-3.2-3B)              | —                                                           |
|               | 11 B Vision       | [link](https://huggingface.co/unsloth/Llama-3.2-11B-Vision)      | —                                                           |
|               | 90 B Vision       | [link](https://huggingface.co/unsloth/Llama-3.2-90B-Vision)      | —                                                           |
| **Llama 3.1** | 8 B               | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-8B)         | —                                                           |
|               | 70 B              | [link](https://huggingface.co/unsloth/Meta-Llama-3.1-70B)        | —                                                           |
| **Llama 3**   | 8 B               | [link](https://huggingface.co/unsloth/llama-3-8b)                | [link](https://huggingface.co/unsloth/llama-3-8b-bnb-4bit)  |
| **Llama 2**   | 7 B               | [link](https://huggingface.co/unsloth/llama-2-7b)                | [link](https://huggingface.co/unsloth/llama-2-7b-bnb-4bit)  |
|               | 13 B              | [link](https://huggingface.co/unsloth/llama-2-13b)               | [link](https://huggingface.co/unsloth/llama-2-13b-bnb-4bit) |

#### **Gemma models**

| Model       | Variant | Base (16-bit)                                         | Base (4-bit)                                                           |
| ----------- | ------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| **Gemma 3** | 1 B     | [link](https://huggingface.co/unsloth/gemma-3-1b-pt)  | [link](https://huggingface.co/unsloth/gemma-3-1b-pt-unsloth-bnb-4bit)  |
|             | 4 B     | [link](https://huggingface.co/unsloth/gemma-3-4b-pt)  | [link](https://huggingface.co/unsloth/gemma-3-4b-pt-unsloth-bnb-4bit)  |
|             | 12 B    | [link](https://huggingface.co/unsloth/gemma-3-12b-pt) | [link](https://huggingface.co/unsloth/gemma-3-12b-pt-unsloth-bnb-4bit) |
|             | 27 B    | [link](https://huggingface.co/unsloth/gemma-3-27b-pt) | [link](https://huggingface.co/unsloth/gemma-3-27b-pt-unsloth-bnb-4bit) |
| **Gemma 2** | 2 B     | [link](https://huggingface.co/unsloth/gemma-2-2b)     | —                                                                      |
|             | 9 B     | [link](https://huggingface.co/unsloth/gemma-2-9b)     | —                                                                      |
|             | 27 B    | [link](https://huggingface.co/unsloth/gemma-2-27b)    | —                                                                      |

#### **Mistral models:**

| Model       | Variant          | Base (16-bit)                                                      | Base (4-bit)                                                    |
| ----------- | ---------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Mistral** | Small 24B 2501   | [link](https://huggingface.co/unsloth/Mistral-Small-24B-Base-2501) | —                                                               |
|             | NeMo 12B 2407    | [link](https://huggingface.co/unsloth/Mistral-Nemo-Base-2407)      | —                                                               |
|             | 7B v0.3          | [link](https://huggingface.co/unsloth/mistral-7b-v0.3)             | [link](https://huggingface.co/unsloth/mistral-7b-v0.3-bnb-4bit) |
|             | 7B v0.2          | [link](https://huggingface.co/unsloth/mistral-7b-v0.2)             | [link](https://huggingface.co/unsloth/mistral-7b-v0.2-bnb-4bit) |
|             | Pixtral 12B 2409 | [link](https://huggingface.co/unsloth/Pixtral-12B-Base-2409)       | —                                                               |

#### **Other (TTS, TinyLlama) models:**

| Model          | Variant        | Base (16-bit)                                                    | Base (4-bit)                                                                      |
| -------------- | -------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **TinyLlama**  | 1.1 B (Base)   | [link](https://huggingface.co/unsloth/tinyllama)                 | [link](https://huggingface.co/unsloth/tinyllama-bnb-4bit)                         |
| **Orpheus-3b** | 0.1-pretrained | [link](https://huggingface.co/unsloth/orpheus-3b-0.1-pretrained) | [link](https://huggingface.co/unsloth/orpheus-3b-0.1-pretrained-unsloth-bnb-4bit) |
| {% endtab %}   |                |                                                                  |                                                                                   |

{% tab title="• FP8" %}
You can use our FP8 uploads for training or serving/deployment.

FP8 Dynamic offers slightly faster training and lower VRAM usage than FP8 Block, but with a small trade-off in accuracy.

| Model                 | Variant                                                                                                                                                                                                                                                                                                                                                                                                                                                       | FP8 (Dynamic / Block)                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Llama 3.3**         | 70B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [Dynamic](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.3-70B-Instruct-FP8-Block)         |
| **Llama 3.2**         | 1B Base                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [Dynamic](https://huggingface.co/unsloth/Llama-3.2-1B-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.2-1B-FP8-Block)                             |
|                       | 1B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [Dynamic](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-FP8-Block)           |
|                       | 3B Base                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [Dynamic](https://huggingface.co/unsloth/Llama-3.2-3B-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.2-3B-FP8-Block)                             |
|                       | 3B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [Dynamic](https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-FP8-Block)           |
| **Llama 3.1**         | 8B Base                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [Dynamic](https://huggingface.co/unsloth/Llama-3.1-8B-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.1-8B-FP8-Block)                             |
|                       | 8B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [Dynamic](https://huggingface.co/unsloth/Llama-3.1-8B-Instruct-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.1-8B-Instruct-FP8-Block)           |
|                       | 70B Base                                                                                                                                                                                                                                                                                                                                                                                                                                                      | [Dynamic](https://huggingface.co/unsloth/Llama-3.1-70B-FP8-Dynamic) · [Block](https://huggingface.co/unsloth/Llama-3.1-70B-FP8-Block)                           |
| **Qwen3**             | 0.6B                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [FP8](https://huggingface.co/unsloth/Qwen3-0.6B-FP8)                                                                                                            |
|                       | 1.7B                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [FP8](https://huggingface.co/unsloth/Qwen3-1.7B-FP8)                                                                                                            |
|                       | 4B                                                                                                                                                                                                                                                                                                                                                                                                                                                            | [FP8](https://huggingface.co/unsloth/Qwen3-4B-FP8)                                                                                                              |
|                       | 8B                                                                                                                                                                                                                                                                                                                                                                                                                                                            | [FP8](https://huggingface.co/unsloth/Qwen3-8B-FP8)                                                                                                              |
|                       | 14B                                                                                                                                                                                                                                                                                                                                                                                                                                                           | [FP8](https://huggingface.co/unsloth/Qwen3-14B-FP8)                                                                                                             |
|                       | 32B                                                                                                                                                                                                                                                                                                                                                                                                                                                           | [FP8](https://huggingface.co/unsloth/Qwen3-32B-FP8)                                                                                                             |
|                       | 235B-A22B                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [FP8](https://huggingface.co/unsloth/Qwen3-235B-A22B-FP8)                                                                                                       |
| **Qwen3 (2507)**      | 4B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [FP8](https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-FP8)                                                                                                |
|                       | 4B Thinking                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [FP8](https://huggingface.co/unsloth/Qwen3-4B-Thinking-2507-FP8)                                                                                                |
|                       | 30B-A3B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                              | [FP8](https://huggingface.co/unsloth/Qwen3-30B-A3B-Instruct-2507-FP8)                                                                                           |
|                       | 30B-A3B Thinking                                                                                                                                                                                                                                                                                                                                                                                                                                              | [FP8](https://huggingface.co/unsloth/Qwen3-30B-A3B-Thinking-2507-FP8)                                                                                           |
|                       | 235B-A22B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                            | [FP8](https://huggingface.co/unsloth/Qwen3-235B-A22B-Instruct-2507-FP8)                                                                                         |
|                       | 235B-A22B Thinking                                                                                                                                                                                                                                                                                                                                                                                                                                            | [FP8](https://huggingface.co/unsloth/Qwen3-235B-A22B-Thinking-2507-FP8)                                                                                         |
| **Qwen3-VL**          | 4B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [FP8](https://huggingface.co/unsloth/Qwen3-VL-4B-Instruct-FP8)                                                                                                  |
|                       | 4B Thinking                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [FP8](https://huggingface.co/unsloth/Qwen3-VL-4B-Thinking-FP8)                                                                                                  |
|                       | 8B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [FP8](https://huggingface.co/unsloth/Qwen3-VL-8B-Instruct-FP8)                                                                                                  |
|                       | 8B Thinking                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [FP8](https://huggingface.co/unsloth/Qwen3-VL-8B-Thinking-FP8)                                                                                                  |
| **Qwen3-Coder**       | 480B-A35B Instruct                                                                                                                                                                                                                                                                                                                                                                                                                                            | [FP8](https://huggingface.co/unsloth/Qwen3-Coder-480B-A35B-Instruct-FP8)                                                                                        |
| **Granite 4.0**       | h-tiny                                                                                                                                                                                                                                                                                                                                                                                                                                                        | [FP8 Dynamic](https://huggingface.co/unsloth/granite-4.0-h-tiny-FP8-Dynamic)                                                                                    |
|                       | h-small                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [FP8 Dynamic](https://huggingface.co/unsloth/granite-4.0-h-small-FP8-Dynamic)                                                                                   |
| **Magistral Small**   | 2509                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [FP8 Dynamic](https://huggingface.co/unsloth/Magistral-Small-2509-FP8-Dynamic) · [FP8 torchao](https://huggingface.co/unsloth/Magistral-Small-2509-FP8-torchao) |
| **Mistral Small 3.2** | 24B Instruct-2506                                                                                                                                                                                                                                                                                                                                                                                                                                             | [FP8](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506-FP8)                                                                                   |
| **Gemma 3**           | <p>270M-it torchao<br>270m — <a href="https://huggingface.co/unsloth/gemma-3-270m-it-FP8-Dynamic">FP8</a><br>1B — <a href="https://huggingface.co/unsloth/gemma-3-1b-it-FP8-Dynamic">FP8</a><br>4B — <a href="https://huggingface.co/unsloth/gemma-3-4b-it-FP8-Dynamic">FP8</a><br>12B — <a href="https://huggingface.co/unsloth/gemma-3-12B-it-FP8-Dynamic">FP8</a><br>27B — <a href="https://huggingface.co/unsloth/gemma-3-27b-it-FP8-Dynamic">FP8</a></p> | [FP8 torchao](https://huggingface.co/unsloth/gemma-3-270m-it-torchao-FP8)                                                                                       |
| {% endtab %}          |                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                                                                                                                                                                 |
| {% endtabs %}         |                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                                                                                                                                                                 |

---

## Unsloth Requirements

**URL:** llms-txt#unsloth-requirements

**Contents:**
- System Requirements
- Fine-tuning VRAM requirements:

Here are Unsloth's requirements including system and GPU VRAM requirements.

## System Requirements

* **Operating System**: Works on Linux and [Windows](https://docs.unsloth.ai/get-started/install-and-update/windows-installation)
* Supports NVIDIA GPUs since 2018+ including [Blackwell RTX 50](https://docs.unsloth.ai/basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth) and [DGX Spark](https://docs.unsloth.ai/basics/fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth)
  * [fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth](https://docs.unsloth.ai/basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth "mention")
  * [fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth](https://docs.unsloth.ai/basics/fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth "mention")
* Minimum CUDA Capability 7.0 (V100, T4, Titan V, RTX 20 & 50, A100, H100, L40 etc) [Check your GPU!](https://developer.nvidia.com/cuda-gpus) GTX 1070, 1080 works, but is slow.
* The official [Unsloth Docker image](https://hub.docker.com/r/unsloth/unsloth) `unsloth/unsloth` is available on Docker Hub
  * [how-to-run-llms-with-docker](https://docs.unsloth.ai/models/how-to-run-llms-with-docker "mention")
* Unsloth works on [AMD](https://docs.unsloth.ai/new/fine-tuning-llms-on-amd-gpus-with-unsloth) and [Intel](https://github.com/unslothai/unsloth/pull/2621) GPUs! Apple/Silicon/MLX is in the works
* If you have different versions of torch, transformers etc., `pip install unsloth` will automatically install all the latest versions of those libraries so you don't need to worry about version compatibility.
* Your device should have `xformers`, `torch`, `BitsandBytes` and `triton` support.

{% hint style="info" %}
Python 3.13 is now supported!
{% endhint %}

## Fine-tuning VRAM requirements:

How much GPU memory do I need for LLM fine-tuning using Unsloth?

{% hint style="info" %}
A common issue when you OOM or run out of memory is because you set your batch size too high. Set it to 1, 2, or 3 to use less VRAM.

**For context length benchmarks, see** [**here**](https://docs.unsloth.ai/basics/unsloth-benchmarks#context-length-benchmarks)**.**
{% endhint %}

Check this table for VRAM requirements sorted by model parameters and fine-tuning method. QLoRA uses 4-bit, LoRA uses 16-bit. Keep in mind that sometimes more VRAM is required depending on the model so these numbers are the absolute minimum:

| Model parameters | QLoRA (4-bit) VRAM | LoRA (16-bit) VRAM |
| ---------------- | ------------------ | ------------------ |
| 3B               | 3.5 GB             | 8 GB               |
| 7B               | 5 GB               | 19 GB              |
| 8B               | 6 GB               | 22 GB              |
| 9B               | 6.5 GB             | 24 GB              |
| 11B              | 7.5 GB             | 29 GB              |
| 14B              | 8.5 GB             | 33 GB              |
| 27B              | 22GB               | 64GB               |
| 32B              | 26 GB              | 76 GB              |
| 40B              | 30GB               | 96GB               |
| 70B              | 41 GB              | 164 GB             |
| 81B              | 48GB               | 192GB              |
| 90B              | 53GB               | 212GB              |
| 405B             | 237 GB             | 950 GB             |

---

## Until v0.11.1 release, you need to install vLLM from nightly build

**URL:** llms-txt#until-v0.11.1-release,-you-need-to-install-vllm-from-nightly-build

uv pip install -U vllm --pre --extra-index-url https://wheels.vllm.ai/nightly
python
from vllm import LLM, SamplingParams
from vllm.model_executor.models.deepseek_ocr import NGramPerReqLogitsProcessor
from PIL import Image

**Examples:**

Example 1 (unknown):
```unknown
2. Then run the following code:

{% code overflow="wrap" %}
```

---

## vLLM Deployment & Inference Guide

**URL:** llms-txt#vllm-deployment-&-inference-guide

**Contents:**
  - :computer:Installing vLLM
  - :truck:Deploying vLLM models
  - :fire\_engine:vLLM Deployment Server Flags, Engine Arguments & Options
  - 🦥Deploying Unsloth finetunes in vLLM
- OR to upload to HuggingFace:
- OR to upload to HuggingFace
- To upload to HuggingFace:
  - [vllm-engine-arguments](https://docs.unsloth.ai/basics/inference-and-deployment/vllm-guide/vllm-engine-arguments "mention")
  - [lora-hot-swapping-guide](https://docs.unsloth.ai/basics/inference-and-deployment/vllm-guide/lora-hot-swapping-guide "mention")

Guide on saving and deploying LLMs to vLLM for serving LLMs in production

### :computer:Installing vLLM

For NVIDIA GPUs, use uv and run:

For AMD GPUs, please use the nightly Docker image: `rocm/vllm-dev:nightly`

For the nightly branch for NVIDIA GPUs, run:

{% code overflow="wrap" %}

See [vLLM docs](https://docs.vllm.ai/en/stable/getting_started/installation) for more details

### :truck:Deploying vLLM models

After saving your fine-tune, you can simply do:

### :fire\_engine:vLLM Deployment Server Flags, Engine Arguments & Options

Some important server flags to use are at [#vllm-deployment-server-flags-engine-arguments-and-options](#vllm-deployment-server-flags-engine-arguments-and-options "mention")

### 🦥Deploying Unsloth finetunes in vLLM

After fine-tuning [fine-tuning-llms-guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide "mention") or using our notebooks at [unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks "mention"), you can save or deploy your models directly through vLLM within a single workflow. An example Unsloth finetuning script for eg:

**To save to 16-bit for vLLM, use:**

{% code overflow="wrap" %}

**To save just the LoRA adapters**, either use:

Or just use our builtin function to do that:

{% code overflow="wrap" %}

To merge to 4bit to load on HuggingFace, first call `merged_4bit`. Then use `merged_4bit_forced` if you are certain you want to merge to 4bit. I highly discourage you, unless you know what you are going to do with the 4bit model (ie for DPO training for eg or for HuggingFace's online inference engine)

{% code overflow="wrap" %}

Then to load the finetuned model in vLLM in another terminal:

You might have to provide the full path if the above doesn't work ie:

### [vllm-engine-arguments](https://docs.unsloth.ai/basics/inference-and-deployment/vllm-guide/vllm-engine-arguments "mention")

### [lora-hot-swapping-guide](https://docs.unsloth.ai/basics/inference-and-deployment/vllm-guide/lora-hot-swapping-guide "mention")

**Examples:**

Example 1 (bash):
```bash
pip install --upgrade pip
pip install uv
uv pip install -U vllm --torch-backend=auto
```

Example 2 (bash):
```bash
pip install --upgrade pip
pip install uv
uv pip install -U vllm --torch-backend=auto --extra-index-url https://wheels.vllm.ai/nightly
```

Example 3 (bash):
```bash
vllm serve unsloth/gpt-oss-120b
```

Example 4 (python):
```python
from unsloth import FastLanguageModel
import torch
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/gpt-oss-20b",
    max_seq_length = 2048,
    load_in_4bit = True,
)
model = FastLanguageModel.get_peft_model(model)
```

---

## We're installing the latest Torch, Triton, OpenAI's Triton kernels, Transformers and Unsloth!

**URL:** llms-txt#we're-installing-the-latest-torch,-triton,-openai's-triton-kernels,-transformers-and-unsloth!

!pip install --upgrade -qqq uv
try: import numpy; install_numpy = f"numpy=={numpy.__version__}"
except: install_numpy = "numpy"
!uv pip install -qqq \
    "torch>=2.8.0" "triton>=3.4.0" {install_numpy} \
    "unsloth_zoo[base] @ git+https://github.com/unslothai/unsloth-zoo" \
    "unsloth[base] @ git+https://github.com/unslothai/unsloth" \
    torchvision bitsandbytes \
    git+https://github.com/huggingface/transformers \
    git+https://github.com/triton-lang/triton.git@05b2c186c1b6c9a08375389d5efe9cb4c401c075#subdirectory=python/triton_kernels
```

#### Configuring gpt-oss and Reasoning Effort

We’ll load **`gpt-oss-20b`** using Unsloth's [linearized version](https://docs.unsloth.ai/models/gpt-oss-how-to-run-and-fine-tune/..#making-efficient-gpt-oss-fine-tuning-work) (as no other version will work for QLoRA fine-tuning). Configure the following parameters:

* `max_seq_length = 2048`
  * Recommended for quick testing and initial experiments.
* `load_in_4bit = True`
  * Use `False` for LoRA training (note: setting this to `False` will need at least 43GB VRAM). You ***MUST*** also set **`model_name = "unsloth/gpt-oss-20b-BF16"`**

<pre class="language-python"><code class="lang-python">from unsloth import FastLanguageModel
import torch
max_seq_length = 1024
dtype = None

---

## Windows Installation

**URL:** llms-txt#windows-installation

**Contents:**
- Method #1 - Docker:
- Method #2 - WSL:
- Method #3 - Windows directly:
  - **Notes**
  - **Advanced/Troubleshooting**
- Method #3 - Windows using PowerShell:

See how to install Unsloth on Windows with or without WSL.

For Windows, `pip install unsloth` now works, however you must have Pytorch previously installed.

## Method #1 - Docker:

Docker might be the easiest way for Windows users to get started with Unsloth as there is no setup needed or dependency issues. [**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth) is Unsloth's only Docker image. For [Blackwell](https://docs.unsloth.ai/basics/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth) and 50-series GPUs, use this same image - no separate image needed.

For installation instructions, please follow our [Docker guide](https://docs.unsloth.ai/new/how-to-fine-tune-llms-with-unsloth-and-docker), otherwise here is a quickstart guide:

{% stepper %}
{% step %}
**Install Docker and NVIDIA Container Toolkit.**

Install Docker via [Linux](https://docs.docker.com/engine/install/) or [Desktop](https://docs.docker.com/desktop/) (other). Then install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation):

<pre class="language-bash"><code class="lang-bash"><strong>export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.17.8-1
</strong>sudo apt-get update &#x26;&#x26; sudo apt-get install -y \
  nvidia-container-toolkit=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
  nvidia-container-toolkit-base=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
  libnvidia-container-tools=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
  libnvidia-container1=${NVIDIA_CONTAINER_TOOLKIT_VERSION}
</code></pre>

{% step %}
**Run the container.**

[**`unsloth/unsloth`**](https://hub.docker.com/r/unsloth/unsloth) is Unsloth's only Docker image.

{% step %}
**Access Jupyter Lab**

Go to [http://localhost:8888](http://localhost:8888/) and open Unsloth. Access the `unsloth-notebooks` tabs to see Unsloth notebooks.
{% endstep %}

{% step %}
**Start training with Unsloth**

If you're new, follow our step-by-step [Fine-tuning Guide](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide), [RL Guide](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide) or just save/copy any of our premade [notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks).
{% endstep %}

{% step %}
**Docker issues - GPU not discovered?**

Try doing WSL via [#method-2-wsl](#method-2-wsl "mention")
{% endstep %}
{% endstepper %}

{% stepper %}
{% step %}
**Install WSL**

Open up Command Prompt, the Terminal, and install Ubuntu. Set the password if asked.

{% step %} <mark style="color:$primary;background-color:orange;">**If you did NOT do (1), so you already installed WSL**</mark>**, enter WSL by typing `wsl` and ENTER in the command prompt**

{% step %}
**Install Python**

{% code overflow="wrap" %}

{% endcode %}
{% endstep %}

{% step %}
**Install PyTorch**

{% code overflow="wrap" %}

If you encounter permission issues, use `–break-system-packages` so `pip install torch torchvision --force-reinstall --index-url https://download.pytorch.org/whl/cu130 –break-system-packages`
{% endstep %}

{% step %}
**Install Unsloth and Jupyter Notebook**

{% code overflow="wrap" %}

If you encounter permission issues, use `–break-system-packages` so `pip install unsloth jupyter –break-system-packages`
{% endstep %}

{% step %}
**Launch Unsloth via Jupyter Notebook**

{% code overflow="wrap" %}

Then open up our notebooks within [unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks "mention")and load them up! You can also go to Colab notebooks and download > download .ipynb and load them.

![](https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FVbqNWsG2CCHKJJjrnU4s%2Funknown.png?alt=media\&token=854a6d0e-fc84-4e44-bf8e-4bf254801692)
{% endstep %}
{% endstepper %}

## Method #3 - Windows directly:

{% hint style="info" %}
Python 3.13 now works with Unsloth!
{% endhint %}

{% stepper %}
{% step %}
**Install NVIDIA Video Driver**

You should install the latest version of your GPUs driver. Download drivers here: [NVIDIA GPU Drive](https://www.nvidia.com/Download/index.aspx)
{% endstep %}

{% step %}
**Install Visual Studio C++**

You will need Visual Studio, with C++ installed. By default, C++ is not installed with Visual Studio, so make sure you select all of the C++ options. Also select options for Windows 10/11 SDK.

* Launch the Installer here: [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/)
* In the installer, navigate to individual components and select all the options listed here:
  * **.NET Framework 4.8 SDK**
  * **.NET Framework 4.7.2 targeting pack**
  * **C# and Visual Basic Roslyn compilers**
  * **MSBuild**
  * **MSVC v143 - VS 2022 C++ x64/x86 build tools**
  * **C++ 2022 Redistributable Update**
  * **C++ CMake tools for Windows**
  * **C++/CLI support for v143 build tools (Latest)**
  * **MSBuild support for LLVM (clang-cl) toolset**
  * **C++ Clang Compiler for Windows (19.1.1)**
  * **Windows 11 SDK (10.0.22621.0)**
  * **Windows Universal CRT SDK**
  * **C++ 2022 Redistributable MSMs**

**Easier method:** Or you can open an elevated Command Prompt or PowerShell:

* Search for "cmd" or "PowerShell", right-click it, and choose "Run as administrator."
* Paste and run this command (update the Visual Studio path if necessary):

{% step %}
**Install Python and CUDA Toolkit**

Follow the instructions to install [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit-archive).

Then install Miniconda (which has Python) here: [https://www.anaconda.com/docs/getting-started/miniconda/install](https://www.anaconda.com/docs/getting-started/miniconda/install#quickstart-install-instructions)
{% endstep %}

{% step %}
**Install PyTorch**

You will need the correct version of PyTorch that is compatible with your CUDA drivers, so make sure to select them carefully. [Install PyTorch](https://pytorch.org/get-started/locally/)
{% endstep %}

{% step %}
**Install Unsloth**

Open Conda command prompt or your terminal with Python and run the command:

{% endstep %}
{% endstepper %}

{% hint style="warning" %}
If you're using GRPO or plan to use vLLM, currently vLLM does not support Windows directly but only via WSL or Linux.
{% endhint %}

To run Unsloth directly on Windows:

* Install Triton from this Windows fork and follow the instructions [here](https://github.com/woct0rdho/triton-windows) (be aware that the Windows fork requires PyTorch >= 2.4 and CUDA 12)
* In the SFTTrainer, set `dataset_num_proc=1` to avoid a crashing issue:

### **Advanced/Troubleshooting**

For **advanced installation instructions** or if you see weird errors during installations:

1. Install `torch` and `triton`. Go to <https://pytorch.org> to install it. For example `pip install torch torchvision torchaudio triton`
2. Confirm if CUDA is installated correctly. Try `nvcc`. If that fails, you need to install `cudatoolkit` or CUDA drivers.
3. Install `xformers` manually. You can try installing `vllm` and seeing if `vllm` succeeds. Check if `xformers` succeeded with `python -m xformers.info` Go to <https://github.com/facebookresearch/xformers>. Another option is to install `flash-attn` for Ampere GPUs.
4. Double check that your versions of Python, CUDA, CUDNN, `torch`, `triton`, and `xformers` are compatible with one another. The [PyTorch Compatibility Matrix](https://github.com/pytorch/pytorch/blob/main/RELEASE.md#release-compatibility-matrix) may be useful.
5. Finally, install `bitsandbytes` and check it with `python -m bitsandbytes`

## Method #3 - Windows using PowerShell:

#### **Step 1: Install Prerequisites**

1. **Install NVIDIA CUDA Toolkit**:
   * Download and install the appropriate version of the **NVIDIA CUDA Toolkit** from [CUDA Downloads](https://developer.nvidia.com/cuda-downloads).
   * Reboot your system after installation if prompted.
   * **Note**: No additional setup is required after installation for Unsloth.
2. **Install Microsoft C++ Build Tools**:
   * Download and install **Microsoft Build Tools for Visual Studio** from the [official website](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
   * During installation, select the **C++ build tools** workload.\
     Ensure the **MSVC compiler toolset** is included.
3. **Set Environment Variables for the C++ Compiler**:
   * Open the **System Properties** window (search for "Environment Variables" in the Start menu).
   * Click **"Environment Variables…"**.
   * Add or update the following under **System variables**:
     * **CC**:\
       Path to the `cl.exe` C++ compiler.\
       Example (adjust if your version differs):

* **CXX**:\
       Same path as `CC`.
   * Click **OK** to save changes.
   * Verify: Open a new terminal and type `cl`. It should show version info.
4. **Install Conda**
   1. Download and install **Miniconda** from the [official website](https://docs.anaconda.com/miniconda/install/#quick-command-line-install)
   2. Follow installation instruction from the website
   3. To check whether `conda` is already installed, you can test it with `conda` in your PowerShell

#### **Step 2: Run the Unsloth Installation Script**

1. **Download the** [**unsloth\_windows.ps1**](https://github.com/unslothai/notebooks/blob/main/unsloth_windows.ps1) **PowerShell script by going through this link**.
2. **Open PowerShell as Administrator**:
   * Right-click Start and select **"Windows PowerShell (Admin)"**.
3. **Navigate to the script’s location** using `cd`:

4. **Run the script**:

#### **Step 3: Using Unsloth**

Activate the environment after the installation completes:

**Unsloth and its dependencies are now ready!**

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
wsl.exe --install Ubuntu-24.04
wsl.exe -d Ubuntu-24.04
```

Example 3 (bash):
```bash
wsl
```

Example 4 (bash):
```bash
sudo apt update
sudo apt install python3 python3-full python3-pip python3-venv -y
```

---
