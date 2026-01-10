# Unsloth - Vision

**Pages:** 2

---

## Prepare batched input with your image file

**URL:** llms-txt#prepare-batched-input-with-your-image-file

image_1 = Image.open("path/to/your/image_1.png").convert("RGB")
image_2 = Image.open("path/to/your/image_2.png").convert("RGB")
prompt = "<image>\nFree OCR."

model_input = [
    {
        "prompt": prompt,
        "multi_modal_data": {"image": image_1}
    },
    {
        "prompt": prompt,
        "multi_modal_data": {"image": image_2}
    }
]

sampling_param = SamplingParams(
    temperature=0.0,
    max_tokens=8192,
    # ngram logit processor args
    extra_args=dict(
        ngram_size=30,
        window_size=90,
        whitelist_token_ids={128821, 128822},  # whitelist: <td>, </td>
    ),
    skip_special_tokens=False,
)

---

## Unsloth Notebooks

**URL:** llms-txt#unsloth-notebooks

**Contents:**
  - Colab notebooks
  - Kaggle notebooks

Explore our catalog of Unsloth notebooks:

Also see our GitHub repo for our notebooks: [github.com/unslothai/notebooks](https://github.com/unslothai/notebooks/)

<a href="#grpo-reasoning-rl-notebooks" class="button secondary">GRPO (RL)</a><a href="#text-to-speech-tts-notebooks" class="button secondary">Text-to-speech</a><a href="#vision-multimodal-notebooks" class="button secondary">Vision</a><a href="#other-important-notebooks" class="button secondary">Use-case</a><a href="#kaggle-notebooks" class="button secondary">Kaggle</a>

#### Standard notebooks:

* [**gpt-oss (20b)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-Fine-tuning.ipynb) • [Inference](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/GPT_OSS_MXFP4_\(20B\)-Inference.ipynb) • [Fine-tuning](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-Fine-tuning.ipynb)
* [**Mistral Ministral 3**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Ministral_3_VL_\(3B\)_Vision.ipynb) - **new**
* [**DeepSeek-OCR**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Deepseek_OCR_\(3B\).ipynb) **- new**
* [Qwen3 (14B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(14B\)-Reasoning-Conversational.ipynb) • [**Qwen3-VL (8B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision.ipynb) **- new**
* [**Qwen3-2507-4B**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-Instruct.ipynb) • [Thinking](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-Thinking.ipynb) • [Instruct](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-Instruct.ipynb)
* [Gemma 3n (E4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Conversational.ipynb) • [Text](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Conversational.ipynb) • [Vision](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Vision.ipynb) • [Audio](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Audio.ipynb)
* [IBM Granite-4.0-H](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Granite4.0.ipynb)
* [Gemma 3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\).ipynb) • [Text](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\).ipynb) • [Vision](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision.ipynb) • [270M](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(270M\).ipynb) • [**FunctionGemma**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\).ipynb) - new
* [Phi-4 (14B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_4-Conversational.ipynb)
* [Llama 3.1 (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_\(8B\)-Alpaca.ipynb) • [Llama 3.2 (1B + 3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(1B_and_3B\)-Conversational.ipynb)

#### GRPO (Reasoning RL) notebooks:

* [gpt-oss-20b](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) (automatic kernels creation)
* [Mistral Ministral 3](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Ministral_3_\(3B\)_Reinforcement_Learning_Sudoku_Game.ipynb) (solving sodoku) - new
* [Qwen3-8B - **FP8**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_8B_FP8_GRPO.ipynb) (L4) - new
* [Llama-3.2-1B - **FP8**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama_FP8_GRPO.ipynb) (L4) - new
* [gpt-oss-20b](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_Reinforcement_Learning_2048_Game.ipynb) (auto win 2048 game)&#x20;
* [Qwen3-VL (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision-GRPO.ipynb) - Vision GSPO
* [Qwen3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)-GRPO.ipynb) - Advanced GRPO LoRA
* [Gemma 3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision-GRPO.ipynb) - Vision GSPO
* [gpt-oss-20b](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/OpenEnv_gpt_oss_\(20B\)_Reinforcement_Learning_2048_Game.ipynb) (2048 OpenEnv example)
* [DeepSeek-R1-0528-Qwen3 (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/DeepSeek_R1_0528_Qwen3_\(8B\)_GRPO.ipynb) (for multilingual usecase)
* [Gemma 3 (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(1B\)-GRPO.ipynb)
* [Llama 3.2 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Advanced_Llama3_2_\(3B\)_GRPO_LoRA.ipynb) - Advanced GRPO LoRA
* [Llama 3.1 (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_\(8B\)-GRPO.ipynb)
* [Phi-4 (14B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_4_\(14B\)-GRPO.ipynb)
* [Mistral v0.3 (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-GRPO.ipynb)

#### Text-to-Speech (TTS) notebooks:

* [Sesame-CSM (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Sesame_CSM_\(1B\)-TTS.ipynb)
* [Orpheus-TTS (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Orpheus_\(3B\)-TTS.ipynb)
* [Whisper Large V3](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Whisper.ipynb) - Speech-to-Text (STT)
* [Llasa-TTS (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llasa_TTS_\(1B\).ipynb)
* [Spark-TTS (0.5B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Spark_TTS_\(0_5B\).ipynb)
* [Oute-TTS (1B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Oute_TTS_\(1B\).ipynb)

**Speech-to-Text (SST) notebooks:**

* [Whisper-Large-V3](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Whisper.ipynb)
* [Gemma 3n (E4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Audio.ipynb) - Audio

#### Vision (Multimodal) notebooks:

* [**Mistral Ministral 3**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Ministral_3_VL_\(3B\)_Vision.ipynb) - **new**
* [**Qwen3-VL (8B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision.ipynb) **- new**
* [**DeepSeek-OCR**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Deepseek_OCR_\(3B\).ipynb) **- new**
* [**Paddle-OCR (1B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Paddle_OCR_\(1B\)_Vision.ipynb) **- new**
* [Gemma 3n (E4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3N_\(4B\)-Vision.ipynb)
* [Gemma 3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision.ipynb)
* [Llama 3.2 Vision (11B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(11B\)-Vision.ipynb)
* [Qwen2.5-VL (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_VL_\(7B\)-Vision.ipynb)
* [Pixtral (12B) 2409](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Pixtral_\(12B\)-Vision.ipynb)
* [Qwen3-VL](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_VL_\(8B\)-Vision-GRPO.ipynb) - Vision GSPO - new
* [Qwen2.5-VL](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2_5_7B_VL_GRPO.ipynb) - Vision GSPO
* [Gemma 3 (4B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(4B\)-Vision-GRPO.ipynb) - Vision GSPO

#### Large LLM notebooks:

**Notebooks for large models:** These exceed Colab’s free 15 GB VRAM tier. With Colab’s new 80 GB GPUs, you can fine-tune 120B parameter models.

{% hint style="info" %}
Colab subscription or credits are required. We **don't** earn anything from these notebooks.
{% endhint %}

* [gpt-oss-20b (500K context)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_500K_Context_Fine_tuning.ipynb) - new
* [Nemotron-3-Nano-30B-A3B LoRA notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Nemotron-3-Nano-30B-A3B_A100.ipynb) - new
* [NeMo Gym Sudoku GRPO notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/nemo_gym_sudoku.ipynb) - new
* [gpt-oss-120b](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(120B\)_A100-Fine-tuning.ipynb)
* [Qwen3 (32B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(32B\)_A100-Reasoning-Conversational.ipynb)
* [Llama 3.3 (70B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.3_\(70B\)_A100-Conversational.ipynb)
* [Gemma 3 (27B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_\(27B\)_A100-Conversational.ipynb)&#x20;
* [Baidu ERNIE 4.5 VL (28B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/ERNIE_4_5_VL_28B_A3B_PT_Vision.ipynb) - new

#### Other important notebooks:

* [**Customer support agent**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Granite4.0.ipynb)
* [Mistral Ministral 3](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Ministral_3_\(3B\)_Reinforcement_Learning_Sudoku_Game.ipynb) - new (solving sodoku)
* [Quantization-Aware Training](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)_Instruct-QAT.ipynb) (QAT) - new
* [Phone Deployment ](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(0_6B\)-Phone_Deployment.ipynb)- new
* [Reason before **Tool Calling** notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\).ipynb) - new
* [Mobile Actions notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\)-Mobile-Actions.ipynb) - new
* [**Automatic Kernel Creation**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) with RL
* [**ModernBERT-large**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/bert_classification.ipynb) **- new** Aug 19
* [**Synthetic Data Generation Llama 3.2 (3B)**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Meta_Synthetic_Data_Llama3_2_\(3B\).ipynb)
* [gpt-oss-20b (500K context)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_500K_Context_Fine_tuning.ipynb) - new (A100)
* [**Tool Calling**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_Coder_\(1.5B\)-Tool_Calling.ipynb)
* [Mistral v0.3 Instruct (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-Conversational.ipynb)
* [Ollama](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb)
* [ORPO](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-ORPO.ipynb)
* [Continued Pretraining](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-CPT.ipynb)
* [DPO Zephyr](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Zephyr_\(7B\)-DPO.ipynb)
* [***Inference only***](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_\(8B\)-Inference.ipynb)
* [Llama 3 (8B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Alpaca.ipynb)

#### Specific use-case notebooks:

* [**Customer support agent**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Granite4.0.ipynb)
* [Phone Deployment ](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(0_6B\)-Phone_Deployment.ipynb)- new
* [Reason before **Tool Calling** notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\).ipynb) - new
* [Mobile Actions notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_\(270M\)-Mobile-Actions.ipynb) - new
* [Quantization-Aware Training](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)_Instruct-QAT.ipynb) (QAT) - new
* [**Automatic Kernel Creation**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) with RL **- new**
* [DPO Zephyr](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Zephyr_\(7B\)-DPO.ipynb)
* [BERT - Text Classification](https://colab.research.google.com/github/timothelaborie/text_classification_scripts/blob/main/unsloth_classification.ipynb) - (AutoModelForSequenceClassification)
* [Ollama](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-Ollama.ipynb)
* [**Tool Calling**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_Coder_\(1.5B\)-Tool_Calling.ipynb)
* [Continued Pretraining (CPT)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-CPT.ipynb)
* [Multiple Datasets](https://colab.research.google.com/drive/1njCCbE1YVal9xC83hjdo2hiGItpY_D6t?usp=sharing) by Flail
* [KTO](https://colab.research.google.com/drive/1MRgGtLWuZX4ypSfGguFgC-IblTvO2ivM?usp=sharing) by Jeffrey
* [Inference chat UI](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Unsloth_Studio.ipynb)
* [Conversational](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_\(1B_and_3B\)-Conversational.ipynb)
* [ChatML](https://colab.research.google.com/drive/15F1xyn8497_dUbxZP4zWmPZ3PJx1Oymv?usp=sharing)
* [Text Completion](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_\(7B\)-Text_Completion.ipynb)

#### Rest of notebooks:

* [Qwen2.5 (3B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_\(3B\)-GRPO.ipynb)
* [Gemma 2 (9B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma2_\(9B\)-Alpaca.ipynb)
* [Mistral NeMo (12B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_Nemo_\(12B\)-Alpaca.ipynb)
* [Phi-3.5 (mini)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_3.5_Mini-Conversational.ipynb)
* [Phi-3 (medium)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Phi_3_Medium-Conversational.ipynb)
* [Gemma 2 (2B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma2_\(2B\)-Alpaca.ipynb)
* [Qwen 2.5 Coder (14B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2.5_Coder_\(14B\)-Conversational.ipynb)
* [Mistral Small (22B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_Small_\(22B\)-Alpaca.ipynb)
* [TinyLlama](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/TinyLlama_\(1.1B\)-Alpaca.ipynb)
* [CodeGemma (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/CodeGemma_\(7B\)-Conversational.ipynb)
* [Mistral v0.3 (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-Alpaca.ipynb)
* [Qwen2 (7B)](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2_\(7B\)-Alpaca.ipynb)

#### Standard notebooks:

* [**gpt-oss (20B)**](https://www.kaggle.com/notebooks/welcome?src=https://github.com/unslothai/notebooks/blob/main/nb/Kaggle-gpt-oss-\(20B\)-Fine-tuning.ipynb\&accelerator=nvidiaTeslaT4) **- new**
* [Gemma 3n (E4B)](https://www.kaggle.com/code/danielhanchen/gemma-3n-4b-multimodal-finetuning-inference)
* [Qwen3 (14B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Qwen3_\(14B\).ipynb)
* [Magistral-2509 (24B)](https://www.kaggle.com/notebooks/welcome?src=https://github.com/unslothai/notebooks/blob/main/nb/Kaggle-Magistral_\(24B\)-Reasoning-Conversational.ipynb\&accelerator=nvidiaTeslaT4) - new
* [Gemma 3 (4B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Gemma3_\(4B\).ipynb)
* [Phi-4 (14B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Phi_4-Conversational.ipynb)
* [Llama 3.1 (8B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3.1_\(8B\)-Alpaca.ipynb)
* [Llama 3.2 (1B + 3B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3.2_\(1B_and_3B\)-Conversational.ipynb)
* [Qwen 2.5 (7B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Qwen2.5_\(7B\)-Alpaca.ipynb)

#### GRPO (Reasoning) notebooks:

* [**Qwen2.5-VL**](https://www.kaggle.com/notebooks/welcome?src=https://github.com/unslothai/notebooks/blob/main/nb/Kaggle-Qwen2_5_7B_VL_GRPO.ipynb\&accelerator=nvidiaTeslaT4) - Vision GRPO - new
* [Qwen3 (4B)](https://www.kaggle.com/notebooks/welcome?src=https://github.com/unslothai/notebooks/blob/main/nb/Kaggle-Qwen3_\(4B\)-GRPO.ipynb\&accelerator=nvidiaTeslaT4)
* [Gemma 3 (1B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Gemma3_\(1B\)-GRPO.ipynb)
* [Llama 3.1 (8B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3.1_\(8B\)-GRPO.ipynb)
* [Phi-4 (14B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Phi_4_\(14B\)-GRPO.ipynb)
* [Qwen 2.5 (3B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Qwen2.5_\(3B\)-GRPO.ipynb)

#### Text-to-Speech (TTS) notebooks:

* [Sesame-CSM (1B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Sesame_CSM_\(1B\)-TTS.ipynb)
* [Orpheus-TTS (3B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Orpheus_\(3B\)-TTS.ipynb)
* [Whisper Large V3](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Whisper.ipynb) – Speech-to-Text
* [Llasa-TTS (1B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llasa_TTS_\(1B\).ipynb)
* [Spark-TTS (0.5B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Spark_TTS_\(0_5B\).ipynb)
* [Oute-TTS (1B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Oute_TTS_\(1B\).ipynb)

#### Vision (Multimodal) notebooks:

* [Llama 3.2 Vision (11B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3.2_\(11B\)-Vision.ipynb)
* [Qwen 2.5-VL (7B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Qwen2.5_VL_\(7B\)-Vision.ipynb)
* [Pixtral (12B) 2409](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Pixtral_\(12B\)-Vision.ipynb)

#### Specific use-case notebooks:

* [Tool Calling](https://www.kaggle.com/notebooks/welcome?src=https://github.com/unslothai/notebooks/blob/main/nb/Kaggle-Qwen2.5_Coder_\(1.5B\)-Tool_Calling.ipynb\&accelerator=nvidiaTeslaT4)
* [ORPO](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3_\(8B\)-ORPO.ipynb)
* [Continued Pretraining](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Mistral_v0.3_\(7B\)-CPT.ipynb)
* [DPO Zephyr](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Zephyr_\(7B\)-DPO.ipynb)
* [Inference only](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3.1_\(8B\)-Inference.ipynb)
* [Ollama](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Llama3_\(8B\)-Ollama.ipynb)
* [Text Completion](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Mistral_\(7B\)-Text_Completion.ipynb)
* [CodeForces-cot (Reasoning)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-CodeForces-cot-Finetune_for_Reasoning_on_CodeForces.ipynb)
* [Unsloth Studio (chat UI)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Unsloth_Studio.ipynb)

#### Rest of notebooks:

* [Gemma 2 (9B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Gemma2_\(9B\)-Alpaca.ipynb)
* [Gemma 2 (2B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Gemma2_\(2B\)-Alpaca.ipynb)
* [CodeGemma (7B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-CodeGemma_\(7B\)-Conversational.ipynb)
* [Mistral NeMo (12B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Mistral_Nemo_\(12B\)-Alpaca.ipynb)
* [Mistral Small (22B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-Mistral_Small_\(22B\)-Alpaca.ipynb)
* [TinyLlama (1.1B)](https://www.kaggle.com/notebooks/welcome?src=https%3A%2F%2Fgithub.com%2Funslothai/notebooks/blob/main/nb/Kaggle-TinyLlama_\(1.1B\)-Alpaca.ipynb)

To view a complete list of all our Kaggle notebooks, [click here](https://github.com/unslothai/notebooks#-kaggle-notebooks).

{% hint style="info" %}
Feel free to contribute to the notebooks by visiting our [repo](https://github.com/unslothai/notebooks)!
{% endhint %}

---
