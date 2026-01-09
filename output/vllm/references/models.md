# Vllm - Models

**Pages:** 43

---

## api_router - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/classify/api_router/

**Contents:**
- vllm.entrypoints.pooling.classify.api_router ¶
- router module-attribute ¶
- classify ¶
- create_classify async ¶

**Examples:**

Example 1 (unknown):
```unknown
router = APIRouter()
```

Example 2 (unknown):
```unknown
router = APIRouter()
```

Example 3 (rust):
```rust
classify(request: Request) -> ServingClassification | None
```

Example 4 (rust):
```rust
classify(request: Request) -> ServingClassification | None
```

---

## api_router - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/pooling/api_router/

**Contents:**
- vllm.entrypoints.pooling.pooling.api_router ¶
- router module-attribute ¶
- create_pooling async ¶
- pooling ¶

**Examples:**

Example 1 (unknown):
```unknown
router = APIRouter()
```

Example 2 (unknown):
```unknown
router = APIRouter()
```

Example 3 (yaml):
```yaml
create_pooling(
    request: PoolingRequest, raw_request: Request
)
```

Example 4 (yaml):
```yaml
create_pooling(
    request: PoolingRequest, raw_request: Request
)
```

---

## api_router - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/score/api_router/

**Contents:**
- vllm.entrypoints.pooling.score.api_router ¶
- logger module-attribute ¶
- router module-attribute ¶
- create_score async ¶
- create_score_v1 async ¶
- do_rerank async ¶
- do_rerank_v1 async ¶
- do_rerank_v2 async ¶
- rerank ¶
- score ¶

**Examples:**

Example 1 (unknown):
```unknown
logger = init_logger(__name__)
```

Example 2 (unknown):
```unknown
logger = init_logger(__name__)
```

Example 3 (unknown):
```unknown
router = APIRouter()
```

Example 4 (unknown):
```unknown
router = APIRouter()
```

---

## api_router - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/embed/api_router/

**Contents:**
- vllm.entrypoints.pooling.embed.api_router ¶
- router module-attribute ¶
- create_embedding async ¶
- embedding ¶

**Examples:**

Example 1 (unknown):
```unknown
router = APIRouter()
```

Example 2 (unknown):
```unknown
router = APIRouter()
```

Example 3 (yaml):
```yaml
create_embedding(
    request: EmbeddingRequest, raw_request: Request
)
```

Example 4 (yaml):
```yaml
create_embedding(
    request: EmbeddingRequest, raw_request: Request
)
```

---

## Classify - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/classify/

**Contents:**
- Classify¶
- OpenAI Classification Client¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/classify.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for classification API using vLLM API server
NOTE:
    start a supported classification model server with `vllm serve`, e.g.
    vllm serve jason9693/Qwen2.5-1.5B-apeach
"""

import argparse
import pprint

import requests


def post_http_request(payload: dict, api_url: str) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    response = requests.post(api_url, headers=headers, json=payload)
    return response


def parse_args():
    parse = argparse.ArgumentParser()
    parse.add_argument("--host", type=str, default="localhost")
    parse.add_argument("--port", type=int, default=8000)
    parse.add_argument("--model", type=str, default="jason9693/Qwen2.5-1.5B-apeach")
    return parse.parse_args()


def main(args):
    host = args.host
    port = args.port
    model_name = args.model

    api_url = f"http://{host}:{port}/classify"
    prompts = [
        "Hello, my name is",
        "The president of the United States is",
        "The capital of France is",
        "The future of AI is",
    ]

    payload = {
        "model": model_name,
        "input": prompts,
    }

    classify_response = post_http_request(payload=payload, api_url=api_url)
    pprint.pprint(classify_response.json())


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for classification API using vLLM API server
NOTE:
    start a supported classification model server with `vllm serve`, e.g.
    vllm serve jason9693/Qwen2.5-1.5B-apeach
"""

import argparse
import pprint

import requests


def post_http_request(payload: dict, api_url: str) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    response = requests.post(api_url, headers=headers, json=payload)
    return response


def parse_args():
    parse = argparse.ArgumentParser()
    parse.add_argument("--host", type=str, default="localhost")
    parse.add_argument("--port", type=int, default=8000)
    parse.add_argument("--model", type=str, default="jason9693/Qwen2.5-1.5B-apeach")
    return parse.parse_args()


def main(args):
    host = args.host
    port = args.port
    model_name = args.model

    api_url = f"http://{host}:{port}/classify"
    prompts = [
        "Hello, my name is",
        "The president of the United States is",
        "The capital of France is",
        "The future of AI is",
    ]

    payload = {
        "model": model_name,
        "input": prompts,
    }

    classify_response = post_http_request(payload=payload, api_url=api_url)
    pprint.pprint(classify_response.json())


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## classify - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/classify/

**Contents:**
- vllm.entrypoints.pooling.classify ¶

---

## conftest - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/embed/conftest/

**Contents:**
- vllm.entrypoints.pooling.embed.conftest ¶
- pytest_collection_modifyitems ¶

Pytest configuration for vLLM pooling embed tests.

Configure ROCm-specific settings based on collected tests.

**Examples:**

Example 1 (unknown):
```unknown
pytest_collection_modifyitems(config, items)
```

Example 2 (unknown):
```unknown
pytest_collection_modifyitems(config, items)
```

Example 3 (unknown):
```unknown
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
```

Example 4 (python):
```python
def pytest_collection_modifyitems(config, items):
    """Configure ROCm-specific settings based on collected tests."""
    if not current_platform.is_rocm():
        return

    # Disable Flash/MemEfficient SDP on ROCm to avoid HF Transformers
    # accuracy issues: https://github.com/vllm-project/vllm/issues/30167
    # TODO: Remove once ROCm SDP accuracy issues are resolved on HuggingFace
    torch.backends.cuda.enable_flash_sdp(False)
    torch.backends.cuda.enable_mem_efficient_sdp(False)
    torch.backends.cuda.enable_math_sdp(True)
    warnings.warn(
        "ROCm: Disabled flash_sdp and mem_efficient_sdp, enabled math_sdp "
        "to avoid HuggingFace Transformers accuracy issues",
        UserWarning,
        stacklevel=1,
    )
```

---

## CPU - Intel® Xeon® - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/hardware_supported_models/cpu/

**Contents:**
- CPU - Intel® Xeon®¶
- Validated Hardware¶
- Supported Models¶
  - Text-only Language Models¶
  - Multimodal Language Models¶

✅ Runs and optimized. 🟨 Runs and correct but not optimized to green yet. ❌ Does not pass accuracy test or does not run.

---

## Embed - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/embed/

**Contents:**
- Embed¶
- Embed Jina Embeddings V3¶
- Embed Matryoshka Fy¶
- Embedding Requests Base64 Client¶
- Embedding Requests Bytes Client¶
- OpenAI Chat Embedding Client For Multimodal¶
- OpenAI Embedding Client¶
- OpenAI Embedding Long Text - Readme¶
- OpenAI Embedding Long Text - Client¶
- OpenAI Embedding Long Text - Service¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/embed.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="jinaai/jina-embeddings-v3",
        runner="pooling",
        trust_remote_code=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Follow the white rabbit.",  # English
        "Sigue al conejo blanco.",  # Spanish
        "Suis le lapin blanc.",  # French
        "跟着白兔走。",  # Chinese
        "اتبع الأرنب الأبيض.",  # Arabic
        "Folge dem weißen Kaninchen.",  # German
    ]

    # Create an LLM.
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    # Only text matching task is supported for now. See #16120
    outputs = llm.embed(prompts)

    # Print the outputs.
    print("\nGenerated Outputs:")
    print("Only text matching task is supported for now. See #16120")
    print("-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        embeds_trimmed = (
            (str(embeds[:16])[:-1] + ", ...]") if len(embeds) > 16 else embeds
        )
        print(
            f"Prompt: {prompt!r} \n"
            f"Embeddings for text matching: {embeds_trimmed} "
            f"(size={len(embeds)})"
        )
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="jinaai/jina-embeddings-v3",
        runner="pooling",
        trust_remote_code=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Follow the white rabbit.",  # English
        "Sigue al conejo blanco.",  # Spanish
        "Suis le lapin blanc.",  # French
        "跟着白兔走。",  # Chinese
        "اتبع الأرنب الأبيض.",  # Arabic
        "Folge dem weißen Kaninchen.",  # German
    ]

    # Create an LLM.
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    # Only text matching task is supported for now. See #16120
    outputs = llm.embed(prompts)

    # Print the outputs.
    print("\nGenerated Outputs:")
    print("Only text matching task is supported for now. See #16120")
    print("-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        embeds_trimmed = (
            (str(embeds[:16])[:-1] + ", ...]") if len(embeds) > 16 else embeds
        )
        print(
            f"Prompt: {prompt!r} \n"
            f"Embeddings for text matching: {embeds_trimmed} "
            f"(size={len(embeds)})"
        )
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs, PoolingParams
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="jinaai/jina-embeddings-v3",
        runner="pooling",
        trust_remote_code=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Follow the white rabbit.",  # English
        "Sigue al conejo blanco.",  # Spanish
        "Suis le lapin blanc.",  # French
        "跟着白兔走。",  # Chinese
        "اتبع الأرنب الأبيض.",  # Arabic
        "Folge dem weißen Kaninchen.",  # German
    ]

    # Create an LLM.
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    outputs = llm.embed(prompts, pooling_params=PoolingParams(dimensions=32))

    # Print the outputs.
    print("\nGenerated Outputs:")
    print("-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        embeds_trimmed = (
            (str(embeds[:16])[:-1] + ", ...]") if len(embeds) > 16 else embeds
        )
        print(f"Prompt: {prompt!r} \nEmbeddings: {embeds_trimmed} (size={len(embeds)})")
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs, PoolingParams
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="jinaai/jina-embeddings-v3",
        runner="pooling",
        trust_remote_code=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Follow the white rabbit.",  # English
        "Sigue al conejo blanco.",  # Spanish
        "Suis le lapin blanc.",  # French
        "跟着白兔走。",  # Chinese
        "اتبع الأرنب الأبيض.",  # Arabic
        "Folge dem weißen Kaninchen.",  # German
    ]

    # Create an LLM.
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    outputs = llm.embed(prompts, pooling_params=PoolingParams(dimensions=32))

    # Print the outputs.
    print("\nGenerated Outputs:")
    print("-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        embeds_trimmed = (
            (str(embeds[:16])[:-1] + ", ...]") if len(embeds) > 16 else embeds
        )
        print(f"Prompt: {prompt!r} \nEmbeddings: {embeds_trimmed} (size={len(embeds)})")
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## embed - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/embed/

**Contents:**
- vllm.entrypoints.pooling.embed ¶

Pytest configuration for vLLM pooling embed tests.

---

## Features - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/

**Contents:**
- Features¶
- Compatibility Matrix¶
  - Feature x Feature¶
  - Feature x Hardware¶

The tables below show mutually exclusive features and the support on some hardware.

The symbols used have the following meanings:

Check the ❌ or 🟠 with links to see tracking issue for unsupported feature/hardware combination.

* Chunked prefill and prefix caching are only applicable to last-token or all pooling with causal attention. ^ LoRA is only applicable to the language backbone of multimodal models.

For information on feature support on Google TPU, please refer to the TPU-Inference Recommended Models and Features documentation.

---

## FP8 INC - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/inc/

**Contents:**
- FP8 INC¶
- Run Online Inference Using FP8¶
- Run Offline Inference Using FP8¶
- Device for the Model's Weights Uploading¶

vLLM supports FP8 (8-bit floating point) weight and activation quantization using Intel® Neural Compressor (INC) on Intel® Gaudi® 2 and Intel® Gaudi® 3 AI accelerators. Currently, quantization is validated only in Llama models.

Intel Gaudi supports quantization of various modules and functions, including, but not limited to Linear, KVCache, Matmul and Softmax. For more information, please refer to: Supported Modules\Supported Functions\Custom Patched Modules.

Measurement files are required to run quantized models with vLLM on Gaudi accelerators. The FP8 model calibration procedure is described in the vLLM HPU extension package.

QUANT_CONFIG is an environment variable that points to the measurement or quantization JSON config file. The measurement configuration file is used during the calibration procedure to collect measurements for a given model. The quantization configuration is used during inference.

Once you've completed the model calibration process and collected the measurements, you can run FP8 inference with vLLM using the following command:

When using FP8 models, you may experience timeouts caused by the long compilation time of FP8 operations. To mitigate this problem, you can use the below environment variables: VLLM_ENGINE_ITERATION_TIMEOUT_S - to adjust the vLLM server timeout. You can set the value in seconds, e.g., 600 equals 10 minutes. VLLM_RPC_TIMEOUT - to adjust the RPC protocol timeout used by the OpenAI-compatible API. This value is in microseconds, e.g., 600000 equals 10 minutes.

To run offline inference (after completing the model calibration process):

The unquantized weights are first loaded onto the CPU, then quantized and transferred to the target device (HPU) for model execution. This reduces the device memory footprint of model weights, as only quantized weights are stored in the device memory.

**Examples:**

Example 1 (unknown):
```unknown
export QUANT_CONFIG=/path/to/quant/config/inc/meta-llama-3.1-405b-instruct/maxabs_measure_g3.json
vllm serve meta-llama/Llama-3.1-405B-Instruct --quantization inc --kv-cache-dtype fp8_inc --tensor_paralel_size 8
```

Example 2 (unknown):
```unknown
export QUANT_CONFIG=/path/to/quant/config/inc/meta-llama-3.1-405b-instruct/maxabs_measure_g3.json
vllm serve meta-llama/Llama-3.1-405B-Instruct --quantization inc --kv-cache-dtype fp8_inc --tensor_paralel_size 8
```

Example 3 (python):
```python
from vllm import LLM
llm = LLM("llama3.1/Meta-Llama-3.1-8B-Instruct", quantization="inc", kv_cache_dtype="fp8_inc")
...
# Call llm.generate on the required prompts and sampling params.
...
llm.llm_engine.model_executor.shutdown()
```

Example 4 (python):
```python
from vllm import LLM
llm = LLM("llama3.1/Meta-Llama-3.1-8B-Instruct", quantization="inc", kv_cache_dtype="fp8_inc")
...
# Call llm.generate on the required prompts and sampling params.
...
llm.llm_engine.model_executor.shutdown()
```

---

## FP8 W8A8 - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/fp8/

**Contents:**
- FP8 W8A8¶
- Installation¶
- Quantization Process¶
  - 1. Loading the Model¶
  - 2. Applying Quantization¶
  - 3. Evaluating Accuracy¶
- Troubleshooting and Support¶
- Online Dynamic Quantization¶

vLLM supports FP8 (8-bit floating point) weight and activation quantization using hardware acceleration on GPUs such as Nvidia H100 and AMD MI300x. Currently, only Hopper and Ada Lovelace GPUs are officially supported for W8A8. Ampere GPUs are supported for W8A16 (weight-only FP8) utilizing Marlin kernels. Quantization of models with FP8 allows for a 2x reduction in model memory requirements and up to a 1.6x improvement in throughput with minimal impact on accuracy.

Please visit the HF collection of quantized FP8 checkpoints of popular LLMs ready to use with vLLM.

The FP8 types typically supported in hardware have two distinct representations, each useful in different scenarios:

FP8 computation is supported on NVIDIA GPUs with compute capability > 8.9 (Ada Lovelace, Hopper). FP8 models will run on compute capability > 8.0 (Ampere) as weight-only W8A16, utilizing FP8 Marlin.

To produce performant FP8 quantized models with vLLM, you'll need to install the llm-compressor library:

The quantization process involves three main steps:

Load your model and tokenizer using the standard transformers AutoModel classes:

For FP8 quantization, we can recover accuracy with simple RTN quantization. We recommend targeting all Linear layers using the FP8_DYNAMIC scheme, which uses:

Since simple RTN does not require data for weight quantization and the activations are quantized dynamically, we do not need any calibration data for this quantization flow.

Install vllm and lm-evaluation-harness for evaluation:

Load and run the model in vllm:

Evaluate accuracy with lm_eval (for example on 250 samples of gsm8k):

Quantized models can be sensitive to the presence of the bos token. lm_eval does not add a bos token by default, so make sure to include the add_bos_token=True argument when running your evaluations.

Here's an example of the resulting scores:

If you encounter any issues or have feature requests, please open an issue on the vllm-project/llm-compressor GitHub repository.

Dynamic quantization of an original precision BF16/FP16 model to FP8 can be achieved with vLLM without any calibration data required. You can enable the feature by specifying --quantization="fp8" in the command line or setting quantization="fp8" in the LLM constructor.

In this mode, all Linear modules (except for the final lm_head) have their weights quantized down to FP8_E4M3 precision with a per-tensor scale. Activations have their minimum and maximum values calculated during each forward pass to provide a dynamic per-tensor scale for high accuracy. As a result, latency improvements are limited in this mode.

Currently, we load the model at original precision before quantizing down to 8-bits, so you need enough memory to load the whole model.

**Examples:**

Example 1 (unknown):
```unknown
pip install llmcompressor
```

Example 2 (unknown):
```unknown
pip install llmcompressor
```

Example 3 (python):
```python
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    device_map="auto",
    dtype="auto",
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
```

Example 4 (python):
```python
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    device_map="auto",
    dtype="auto",
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
```

---

## Frequently Asked Questions - vLLM

**URL:** https://docs.vllm.ai/en/latest/usage/faq/

**Contents:**
- Frequently Asked Questions¶
- Mitigation Strategies¶

Q: How can I serve multiple models on a single port using the OpenAI API?

A: Assuming that you're referring to using OpenAI compatible server to serve multiple models at once, that is not currently supported, you can run multiple instances of the server (each serving a different model) at the same time, and have another layer to route the incoming request to the correct server accordingly.

Q: Which model to use for offline inference embedding?

A: You can try e5-mistral-7b-instruct and BAAI/bge-base-en-v1.5; more are listed here.

By extracting hidden states, vLLM can automatically convert text generation models like Llama-3-8B, Mistral-7B-Instruct-v0.3 into embedding models, but they are expected to be inferior to models that are specifically trained on embedding tasks.

Q: Can the output of a prompt vary across runs in vLLM?

A: Yes, it can. vLLM does not guarantee stable log probabilities (logprobs) for the output tokens. Variations in logprobs may occur due to numerical instability in Torch operations or non-deterministic behavior in batched Torch operations when batching changes. For more details, see the Numerical Accuracy section.

In vLLM, the same requests might be batched differently due to factors such as other concurrent requests, changes in batch size, or batch expansion in speculative decoding. These batching variations, combined with numerical instability of Torch operations, can lead to slightly different logit/logprob values at each step. Such differences can accumulate, potentially resulting in different tokens being sampled. Once a different token is sampled, further divergence is likely.

---

## Generative Models - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/generative_models/

**Contents:**
- Generative Models¶
- Configuration¶
  - Model Runner (--runner)¶
- Offline Inference¶
  - LLM.generate¶
  - LLM.beam_search¶
  - LLM.chat¶
- Online Serving¶

vLLM provides first-class support for generative models, which covers most of LLMs.

In vLLM, generative models implement theVllmModelForTextGeneration interface. Based on the final hidden states of the input, these models output log probabilities of the tokens to generate, which are then passed through Sampler to obtain the final text.

Run a model in generation mode via the option --runner generate.

There is no need to set this option in the vast majority of cases as vLLM can automatically detect the model runner to use via --runner auto.

The LLM class provides various methods for offline inference. See configuration for a list of options when initializing the model.

The generate method is available to all generative models in vLLM. It is similar to its counterpart in HF Transformers, except that tokenization and detokenization are also performed automatically.

You can optionally control the language generation by passing SamplingParams. For example, you can use greedy sampling by setting temperature=0:

By default, vLLM will use sampling parameters recommended by model creator by applying the generation_config.json from the huggingface model repository if it exists. In most cases, this will provide you with the best results by default if SamplingParams is not specified.

However, if vLLM's default sampling parameters are preferred, please pass generation_config="vllm" when creating the LLM instance.

A code example can be found here: examples/offline_inference/basic/basic.py

The beam_search method implements beam search on top of generate. For example, to search using 5 beams and output at most 50 tokens:

The chat method implements chat functionality on top of generate. In particular, it accepts input similar to OpenAI Chat Completions API and automatically applies the model's chat template to format the prompt.

In general, only instruction-tuned models have a chat template. Base models may perform poorly as they are not trained to respond to the chat conversation.

A code example can be found here: examples/offline_inference/basic/chat.py

If the model doesn't have a chat template or you want to specify another one, you can explicitly pass a chat template:

Our OpenAI-Compatible Server provides endpoints that correspond to the offline APIs:

**Examples:**

Example 1 (python):
```python
from vllm import LLM

llm = LLM(model="facebook/opt-125m")
outputs = llm.generate("Hello, my name is")

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

Example 2 (python):
```python
from vllm import LLM

llm = LLM(model="facebook/opt-125m")
outputs = llm.generate("Hello, my name is")

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

Example 3 (python):
```python
from vllm import LLM, SamplingParams

llm = LLM(model="facebook/opt-125m")
params = SamplingParams(temperature=0)
outputs = llm.generate("Hello, my name is", params)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

Example 4 (python):
```python
from vllm import LLM, SamplingParams

llm = LLM(model="facebook/opt-125m")
params = SamplingParams(temperature=0)
outputs = llm.generate("Hello, my name is", params)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

---

## IO Processor Plugins - vLLM

**URL:** https://docs.vllm.ai/en/latest/design/io_processor_plugins/

**Contents:**
- IO Processor Plugins¶
- Writing an IO Processor Plugin¶
- Using an IO Processor plugin¶

IO Processor plugins are a feature that allows pre- and post-processing of the model input and output for pooling models. The idea is that users are allowed to pass a custom input to vLLM that is converted into one or more model prompts and fed to the model encode method. One potential use-case of such plugins is that of using vLLM for generating multi-modal data. Say users feed an image to vLLM and get an image in output.

When performing an inference with IO Processor plugins, the prompt type is defined by the plugin and the same is valid for the final request output. vLLM does not perform any validation of input/output data, and it is up to the plugin to ensure the correct data is being fed to the model and returned to the user. As of now these plugins support only pooling models and can be triggered via the encode method in LLM and AsyncLLM, or in online serving mode via the /pooling endpoint.

IO Processor plugins implement the IOProcessor interface:

The parse_request method is used for validating the user prompt and converting it into the input expected by the pre_process/pre_process_async methods. The pre_process* methods take the validated plugin input to generate vLLM's model prompts for regular inference. The post_process* methods take PoolingRequestOutput objects as input and generate a custom plugin output. The validate_or_generate_params method is used for validating with the plugin any SamplingParameters/PoolingParameters received with the user request, or to generate new ones if none are specified. The function always returns the validated/generated parameters. The output_to_response method is used only for online serving and converts the plugin output to the IOProcessorResponse type that is then returned by the API Server. The implementation of the /pooling serving endpoint is available here vllm/entrypoints/openai/serving_pooling.py.

An example implementation of a plugin that enables generating geotiff images with the PrithviGeospatialMAE model is available here. Please, also refer to our online ( examples/pooling/plugin/prithvi_geospatial_mae_client.py) and offline ( examples/pooling/plugin/prithvi_geospatial_mae_io_processor.py) inference examples.

IO Processor plugins are loaded at engine startup and there are two methods for specifying the name of the plugin to be loaded:

The order also determines method priority. i.e., setting the plugin name via EngineArgs will override any plugin name specified in the model HF config (config.json).

**Examples:**

Example 1 (python):
```python
IOProcessorInput = TypeVar("IOProcessorInput")
IOProcessorOutput = TypeVar("IOProcessorOutput")

class IOProcessor(ABC, Generic[IOProcessorInput, IOProcessorOutput]):
    def __init__(self, vllm_config: VllmConfig):
        self.vllm_config = vllm_config

    @abstractmethod
    def pre_process(
        self,
        prompt: IOProcessorInput,
        request_id: str | None = None,
        **kwargs,
    ) -> PromptType | Sequence[PromptType]:
        raise NotImplementedError

    async def pre_process_async(
        self,
        prompt: IOProcessorInput,
        request_id: str | None = None,
        **kwargs,
    ) -> PromptType | Sequence[PromptType]:
        return self.pre_process(prompt, request_id, **kwargs)

    @abstractmethod
    def post_process(
        self,
        model_output: Sequence[PoolingRequestOutput],
        request_id: str | None = None,
        **kwargs,
    ) -> IOProcessorOutput:
        raise NotImplementedError

    async def post_process_async(
        self,
        model_output: AsyncGenerator[tuple[int, PoolingRequestOutput]],
        request_id: str | None = None,
        **kwargs,
    ) -> IOProcessorOutput:
        # We cannot guarantee outputs are returned in the same order they were
        # fed to vLLM.
        # Let's sort them by id before post_processing
        sorted_output = sorted(
            [(i, item) async for i, item in model_output], key=lambda output: output[0]
        )
        collected_output = [output[1] for output in sorted_output]
        return self.post_process(collected_output, request_id, **kwargs)

    @abstractmethod
    def parse_request(self, request: Any) -> IOProcessorInput:
        raise NotImplementedError

    def validate_or_generate_params(
        self, params: SamplingParams | PoolingParams | None = None
    ) -> SamplingParams | PoolingParams:
        return params or PoolingParams()

    @abstractmethod
    def output_to_response(
        self, plugin_output: IOProcessorOutput
    ) -> IOProcessorResponse:
        raise NotImplementedError
```

Example 2 (python):
```python
IOProcessorInput = TypeVar("IOProcessorInput")
IOProcessorOutput = TypeVar("IOProcessorOutput")

class IOProcessor(ABC, Generic[IOProcessorInput, IOProcessorOutput]):
    def __init__(self, vllm_config: VllmConfig):
        self.vllm_config = vllm_config

    @abstractmethod
    def pre_process(
        self,
        prompt: IOProcessorInput,
        request_id: str | None = None,
        **kwargs,
    ) -> PromptType | Sequence[PromptType]:
        raise NotImplementedError

    async def pre_process_async(
        self,
        prompt: IOProcessorInput,
        request_id: str | None = None,
        **kwargs,
    ) -> PromptType | Sequence[PromptType]:
        return self.pre_process(prompt, request_id, **kwargs)

    @abstractmethod
    def post_process(
        self,
        model_output: Sequence[PoolingRequestOutput],
        request_id: str | None = None,
        **kwargs,
    ) -> IOProcessorOutput:
        raise NotImplementedError

    async def post_process_async(
        self,
        model_output: AsyncGenerator[tuple[int, PoolingRequestOutput]],
        request_id: str | None = None,
        **kwargs,
    ) -> IOProcessorOutput:
        # We cannot guarantee outputs are returned in the same order they were
        # fed to vLLM.
        # Let's sort them by id before post_processing
        sorted_output = sorted(
            [(i, item) async for i, item in model_output], key=lambda output: output[0]
        )
        collected_output = [output[1] for output in sorted_output]
        return self.post_process(collected_output, request_id, **kwargs)

    @abstractmethod
    def parse_request(self, request: Any) -> IOProcessorInput:
        raise NotImplementedError

    def validate_or_generate_params(
        self, params: SamplingParams | PoolingParams | None = None
    ) -> SamplingParams | PoolingParams:
        return params or PoolingParams()

    @abstractmethod
    def output_to_response(
        self, plugin_output: IOProcessorOutput
    ) -> IOProcessorResponse:
        raise NotImplementedError
```

---

## Loading models with CoreWeave's Tensorizer - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/extensions/tensorizer/

**Contents:**
- Loading models with CoreWeave's Tensorizer¶
- Installing Tensorizer¶
- The basics¶
- Serializing a vLLM model with Tensorizer¶
- Serving the model using Tensorizer¶
- Options for configuring Tensorizer¶

vLLM supports loading models with CoreWeave's Tensorizer. vLLM model tensors that have been serialized to disk, an HTTP/HTTPS endpoint, or S3 endpoint can be deserialized at runtime extremely quickly directly to the GPU, resulting in significantly shorter Pod startup times and CPU memory usage. Tensor encryption is also supported.

vLLM fully integrates Tensorizer in to its model loading machinery. The following will give a brief overview on how to get started with using Tensorizer on vLLM.

To install tensorizer, run pip install vllm[tensorizer].

To load a model using Tensorizer, the model first needs to be serialized by Tensorizer. The example script takes care of this process.

Let's walk through a basic example by serializing facebook/opt-125m using the script, and then loading it for inference.

To serialize a model with Tensorizer, call the example script with the necessary CLI arguments. The docstring for the script itself explains the CLI args and how to use it properly in great detail, and we'll use one of the examples from the docstring directly, assuming we want to serialize and save our model at our S3 bucket example s3://my-bucket:

This saves the model tensors at s3://my-bucket/vllm/facebook/opt-125m/v1. If you intend on applying a LoRA adapter to your tensorized model, you can pass the HF id of the LoRA adapter in the above command, and the artifacts will be saved there too:

Once the model is serialized where you want it, you can load the model using vllm serve or the LLM entrypoint. You can pass the directory where you saved the model to the model argument for LLM() and vllm serve. For example, to serve the tensorized model saved previously with the LoRA adapter, you'd do:

tensorizer's core objects that serialize and deserialize models are TensorSerializer and TensorDeserializer respectively. In order to pass arbitrary kwargs to these, which will configure the serialization and deserialization processes, you can provide them as keys to model_loader_extra_config with serialization_kwargs and deserialization_kwargs respectively. Full docstrings detailing all parameters for the aforementioned objects can be found in tensorizer's serialization.py file.

As an example, CPU concurrency can be limited when serializing with tensorizer via the limit_cpu_concurrency parameter in the initializer for TensorSerializer. To set limit_cpu_concurrency to some arbitrary value, you would do so like this when serializing:

As an example when customizing the loading process via TensorDeserializer, you could limit the number of concurrency readers during deserialization with the num_readers parameter in the initializer via model_loader_extra_config like so:

**Examples:**

Example 1 (unknown):
```unknown
python examples/others/tensorize_vllm_model.py \
   --model facebook/opt-125m \
   serialize \
   --serialized-directory s3://my-bucket \
   --suffix v1
```

Example 2 (unknown):
```unknown
python examples/others/tensorize_vllm_model.py \
   --model facebook/opt-125m \
   serialize \
   --serialized-directory s3://my-bucket \
   --suffix v1
```

Example 3 (typescript):
```typescript
python examples/others/tensorize_vllm_model.py \
   --model facebook/opt-125m \
   --lora-path <lora_id> \
   serialize \
   --serialized-directory s3://my-bucket \
   --suffix v1
```

Example 4 (typescript):
```typescript
python examples/others/tensorize_vllm_model.py \
   --model facebook/opt-125m \
   --lora-path <lora_id> \
   serialize \
   --serialized-directory s3://my-bucket \
   --suffix v1
```

---

## Loading models with Run:ai Model Streamer - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/extensions/runai_model_streamer/

**Contents:**
- Loading models with Run:ai Model Streamer¶
- Tunable parameters¶
- Sharded Model Loading¶

Run:ai Model Streamer is a library to read tensors in concurrency, while streaming it to GPU memory. Further reading can be found in Run:ai Model Streamer Documentation.

vLLM supports loading weights in Safetensors format using the Run:ai Model Streamer. You first need to install vLLM RunAI optional dependency:

To run it as an OpenAI-compatible server, add the --load-format runai_streamer flag:

To run model from AWS S3 object store run:

To run model from Google Cloud Storage run:

To run model from a S3 compatible object store run:

You can tune parameters using --model-loader-extra-config:

You can tune distributed that controls whether distributed streaming should be used. This is currently only possible on CUDA and ROCM devices. This can significantly improve loading times from object storage or high-throughput network fileshares. You can read further about Distributed streaming here

You can tune concurrency that controls the level of concurrency and number of OS threads reading tensors from the file to the CPU buffer. For reading from S3, it will be the number of client instances the host is opening to the S3 server.

You can control the size of the CPU Memory buffer to which tensors are read from the file, and limit this size. You can read further about CPU buffer memory limiting here.

For further instructions about tunable parameters and additional parameters configurable through environment variables, read the Environment Variables Documentation.

vLLM also supports loading sharded models using Run:ai Model Streamer. This is particularly useful for large models that are split across multiple files. To use this feature, use the --load-format runai_streamer_sharded flag:

The sharded loader expects model files to follow the same naming pattern as the regular sharded state loader: model-rank-{rank}-part-{part}.safetensors. You can customize this pattern using the pattern parameter in --model-loader-extra-config:

To create sharded model files, you can use the script provided in examples/offline_inference/save_sharded_state.py. This script demonstrates how to save a model in the sharded format that is compatible with the Run:ai Model Streamer sharded loader.

The sharded loader supports all the same tunable parameters as the regular Run:ai Model Streamer, including concurrency and memory_limit. These can be configured in the same way:

The sharded loader is particularly efficient for tensor or pipeline parallel models where each worker only needs to read its own shard rather than the entire checkpoint.

**Examples:**

Example 1 (unknown):
```unknown
pip3 install vllm[runai]
```

Example 2 (unknown):
```unknown
pip3 install vllm[runai]
```

Example 3 (unknown):
```unknown
vllm serve /home/meta-llama/Llama-3.2-3B-Instruct \
    --load-format runai_streamer
```

Example 4 (unknown):
```unknown
vllm serve /home/meta-llama/Llama-3.2-3B-Instruct \
    --load-format runai_streamer
```

---

## Loading Model weights with fastsafetensors - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/extensions/fastsafetensor/

**Contents:**
- Loading Model weights with fastsafetensors¶

Using fastsafetensors library enables loading model weights to GPU memory by leveraging GPU direct storage. See their GitHub repository for more details.

To enable this feature, use the --load-format fastsafetensors command-line argument

---

## Model Resolution - vLLM

**URL:** https://docs.vllm.ai/en/latest/configuration/model_resolution/

**Contents:**
- Model Resolution¶

vLLM loads HuggingFace-compatible models by inspecting the architectures field in config.json of the model repository and finding the corresponding implementation that is registered to vLLM. Nevertheless, our model resolution may fail for the following reasons:

To fix this, explicitly specify the model architecture by passing config.json overrides to the hf_overrides option. For example:

Our list of supported models shows the model architectures that are recognized by vLLM.

**Examples:**

Example 1 (json):
```json
from vllm import LLM

llm = LLM(
    model="cerebras/Cerebras-GPT-1.3B",
    hf_overrides={"architectures": ["GPT2LMHeadModel"]},  # GPT-2
)
```

Example 2 (json):
```json
from vllm import LLM

llm = LLM(
    model="cerebras/Cerebras-GPT-1.3B",
    hf_overrides={"architectures": ["GPT2LMHeadModel"]},  # GPT-2
)
```

---

## Plugin - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/plugin/

**Contents:**
- Plugin¶
- Prithvi Geospatial MAE Client¶
- Prithvi Geospatial MAE IO Processor¶
- Prithvi Geospatial MAE Offline¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/plugin.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import base64
import os

import requests

# This example shows how to perform an online inference that generates
# multimodal data. In this specific case this example will take a geotiff
# image as input, process it using the multimodal data processor, and
# perform inference.
# Requirements :
# - install TerraTorch v1.1 (or later):
#   pip install terratorch>=v1.1
# - start vllm in serving mode with the below args
#   --model='christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM'
#   --model-impl terratorch
#   --trust-remote-code
#   --skip-tokenizer-init --enforce-eager
#   --io-processor-plugin terratorch_segmentation
#   --enable-mm-embeds


def main():
    image_url = "https://huggingface.co/christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM/resolve/main/valencia_example_2024-10-26.tiff"  # noqa: E501
    server_endpoint = "http://localhost:8000/pooling"

    request_payload_url = {
        "data": {
            "data": image_url,
            "data_format": "url",
            "image_format": "tiff",
            "out_data_format": "b64_json",
        },
        "priority": 0,
        "model": "christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM",
    }

    ret = requests.post(server_endpoint, json=request_payload_url)

    print(f"response.status_code: {ret.status_code}")
    print(f"response.reason:{ret.reason}")

    response = ret.json()

    decoded_image = base64.b64decode(response["data"]["data"])

    out_path = os.path.join(os.getcwd(), "online_prediction.tiff")

    with open(out_path, "wb") as f:
        f.write(decoded_image)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import base64
import os

import requests

# This example shows how to perform an online inference that generates
# multimodal data. In this specific case this example will take a geotiff
# image as input, process it using the multimodal data processor, and
# perform inference.
# Requirements :
# - install TerraTorch v1.1 (or later):
#   pip install terratorch>=v1.1
# - start vllm in serving mode with the below args
#   --model='christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM'
#   --model-impl terratorch
#   --trust-remote-code
#   --skip-tokenizer-init --enforce-eager
#   --io-processor-plugin terratorch_segmentation
#   --enable-mm-embeds


def main():
    image_url = "https://huggingface.co/christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM/resolve/main/valencia_example_2024-10-26.tiff"  # noqa: E501
    server_endpoint = "http://localhost:8000/pooling"

    request_payload_url = {
        "data": {
            "data": image_url,
            "data_format": "url",
            "image_format": "tiff",
            "out_data_format": "b64_json",
        },
        "priority": 0,
        "model": "christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM",
    }

    ret = requests.post(server_endpoint, json=request_payload_url)

    print(f"response.status_code: {ret.status_code}")
    print(f"response.reason:{ret.reason}")

    response = ret.json()

    decoded_image = base64.b64decode(response["data"]["data"])

    out_path = os.path.join(os.getcwd(), "online_prediction.tiff")

    with open(out_path, "wb") as f:
        f.write(decoded_image)


if __name__ == "__main__":
    main()
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import base64
import os

import torch

from vllm import LLM

# This example shows how to perform an offline inference that generates
# multimodal data. In this specific case this example will take a geotiff
# image as input, process it using the multimodal data processor, and
# perform inference.
# Requirements:
# - install TerraTorch v1.1 (or later):
#   pip install terratorch>=v1.1


def main():
    torch.set_default_dtype(torch.float16)
    image_url = "https://huggingface.co/christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM/resolve/main/valencia_example_2024-10-26.tiff"  # noqa: E501

    img_prompt = dict(
        data=image_url,
        data_format="url",
        image_format="tiff",
        out_data_format="b64_json",
    )

    llm = LLM(
        model="christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM",
        skip_tokenizer_init=True,
        trust_remote_code=True,
        enforce_eager=True,
        # Limit the maximum number of parallel requests
        # to avoid the model going OOM.
        # The maximum number depends on the available GPU memory
        max_num_seqs=32,
        io_processor_plugin="terratorch_segmentation",
        model_impl="terratorch",
        enable_mm_embeds=True,
    )

    pooler_output = llm.encode(img_prompt, pooling_task="plugin")
    output = pooler_output[0].outputs

    print(output)
    decoded_data = base64.b64decode(output.data)

    file_path = os.path.join(os.getcwd(), "offline_prediction.tiff")
    with open(file_path, "wb") as f:
        f.write(decoded_data)

    print(f"Output file path: {file_path}")


if __name__ == "__main__":
    main()
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import base64
import os

import torch

from vllm import LLM

# This example shows how to perform an offline inference that generates
# multimodal data. In this specific case this example will take a geotiff
# image as input, process it using the multimodal data processor, and
# perform inference.
# Requirements:
# - install TerraTorch v1.1 (or later):
#   pip install terratorch>=v1.1


def main():
    torch.set_default_dtype(torch.float16)
    image_url = "https://huggingface.co/christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM/resolve/main/valencia_example_2024-10-26.tiff"  # noqa: E501

    img_prompt = dict(
        data=image_url,
        data_format="url",
        image_format="tiff",
        out_data_format="b64_json",
    )

    llm = LLM(
        model="christian-pinto/Prithvi-EO-2.0-300M-TL-VLLM",
        skip_tokenizer_init=True,
        trust_remote_code=True,
        enforce_eager=True,
        # Limit the maximum number of parallel requests
        # to avoid the model going OOM.
        # The maximum number depends on the available GPU memory
        max_num_seqs=32,
        io_processor_plugin="terratorch_segmentation",
        model_impl="terratorch",
        enable_mm_embeds=True,
    )

    pooler_output = llm.encode(img_prompt, pooling_task="plugin")
    output = pooler_output[0].outputs

    print(output)
    decoded_data = base64.b64decode(output.data)

    file_path = os.path.join(os.getcwd(), "offline_prediction.tiff")
    with open(file_path, "wb") as f:
        f.write(decoded_data)

    print(f"Output file path: {file_path}")


if __name__ == "__main__":
    main()
```

---

## pooler - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/config/pooler/

**Contents:**
- vllm.config.pooler ¶
- PoolingTypeStr module-attribute ¶
- logger module-attribute ¶
- PoolerConfig ¶
  - activation class-attribute instance-attribute ¶
  - dimensions class-attribute instance-attribute ¶
  - enable_chunked_processing class-attribute instance-attribute ¶
  - logit_bias class-attribute instance-attribute ¶
  - max_embed_len class-attribute instance-attribute ¶
  - normalize class-attribute instance-attribute ¶

Controls the behavior of output pooling in pooling models.

activation will be deprecated, please use use_activation instead.

Reduce the dimensions of embeddings if model support matryoshka representation. Defaults to None.

Whether to enable chunked processing for long inputs that exceed the model's maximum position embeddings. When enabled, long inputs will be split into chunks, processed separately, and then aggregated using weighted averaging. This allows embedding models to handle arbitrarily long text without CUDA errors. Defaults to False.

If provided, apply classification logit biases. Defaults to None.

Maximum input length allowed for embedding generation. When set, allows inputs longer than max_embed_len to be accepted for embedding models. When an input exceeds max_embed_len, it will be handled according to the original max_model_len validation logic. Defaults to None (i.e. set to max_model_len).

Whether to normalize the embeddings outputs. Defaults to True.

The pooling method of the pooling model. This should be a key in vllm.model_executor.layers.pooler.PoolingType.

A list of indices for the vocabulary dimensions to be extracted, such as the token IDs of good_token and bad_token in the math-shepherd-mistral-7b-prm model.

softmax will be deprecated, please use use_activation instead.

If set, only the score corresponding to the step_tag_id in the generated sentence should be returned. Otherwise, the scores for all tokens are returned.

Whether to apply activation function to the classification outputs. Defaults to True.

WARNING: Whenever a new field is added to this config, ensure that it is included in the factors list if it affects the computation graph.

Provide a hash that uniquely identifies all the configs that affect the structure of the computation graph from input ids/embeddings to the final hidden states, excluding anything before input ids/embeddings and after the final hidden states.

**Examples:**

Example 1 (unknown):
```unknown
PoolingTypeStr = Literal[
    "LAST", "ALL", "CLS", "STEP", "MEAN"
]
```

Example 2 (unknown):
```unknown
PoolingTypeStr = Literal[
    "LAST", "ALL", "CLS", "STEP", "MEAN"
]
```

Example 3 (unknown):
```unknown
logger = init_logger(__name__)
```

Example 4 (unknown):
```unknown
logger = init_logger(__name__)
```

---

## Pooling Models - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/pooling_models/

**Contents:**
- Pooling Models¶
- Configuration¶
  - Model Runner¶
  - Model Conversion¶
  - Pooling Tasks¶
  - Pooler Configuration¶
    - Predefined models¶
    - Converted models¶
- Offline Inference¶
  - LLM.embed¶

vLLM also supports pooling models, such as embedding, classification, and reward models.

In vLLM, pooling models implement the VllmModelForPooling interface. These models use a Pooler to extract the final hidden states of the input before returning them.

We currently support pooling models primarily for convenience. This is not guaranteed to provide any performance improvements over using Hugging Face Transformers or Sentence Transformers directly.

We plan to optimize pooling models in vLLM. Please comment on Issue #21796 if you have any suggestions!

Run a model in pooling mode via the option --runner pooling.

There is no need to set this option in the vast majority of cases as vLLM can automatically detect the appropriate model runner via --runner auto.

vLLM can adapt models for various pooling tasks via the option --convert <type>.

If --runner pooling has been set (manually or automatically) but the model does not implement the VllmModelForPooling interface, vLLM will attempt to automatically convert the model according to the architecture names shown in the table below.

You can explicitly set --convert <type> to specify how to convert the model.

Each pooling model in vLLM supports one or more of these tasks according to Pooler.get_supported_tasks, enabling the corresponding APIs:

* The LLM.score(...) API falls back to embed task if the model does not support score task.

If the Pooler defined by the model accepts pooler_config, you can override some of its attributes via the --pooler-config option.

If the model has been converted via --convert (see above), the pooler assigned to each task has the following attributes by default:

When loading Sentence Transformers models, its Sentence Transformers configuration file (modules.json) takes priority over the model's defaults.

You can further customize this via the --pooler-config option, which takes priority over both the model's and Sentence Transformers' defaults.

The LLM class provides various methods for offline inference. See configuration for a list of options when initializing the model.

The embed method outputs an embedding vector for each prompt. It is primarily designed for embedding models.

A code example can be found here: examples/offline_inference/basic/embed.py

The classify method outputs a probability vector for each prompt. It is primarily designed for classification models.

A code example can be found here: examples/offline_inference/basic/classify.py

The score method outputs similarity scores between sentence pairs. It is designed for embedding models and cross-encoder models. Embedding models use cosine similarity, and cross-encoder models serve as rerankers between candidate query-document pairs in RAG systems.

vLLM can only perform the model inference component (e.g. embedding, reranking) of RAG. To handle RAG at a higher level, you should use integration frameworks such as LangChain.

A code example can be found here: examples/offline_inference/basic/score.py

The reward method is available to all reward models in vLLM.

A code example can be found here: examples/offline_inference/basic/reward.py

The encode method is available to all pooling models in vLLM.

Please use one of the more specific methods or set the task directly when using LLM.encode:

Our OpenAI-Compatible Server provides endpoints that correspond to the offline APIs:

Please use one of the more specific endpoints or set the task directly when using the Pooling API:

Matryoshka Embeddings or Matryoshka Representation Learning (MRL) is a technique used in training embedding models. It allows users to trade off between performance and cost.

Not all embedding models are trained using Matryoshka Representation Learning. To avoid misuse of the dimensions parameter, vLLM returns an error for requests that attempt to change the output dimension of models that do not support Matryoshka Embeddings.

For example, setting dimensions parameter while using the BAAI/bge-m3 model will result in the following error.

There is currently no official interface for specifying support for Matryoshka Embeddings. In vLLM, if is_matryoshka is True in config.json, you can change the output dimension to arbitrary values. Use matryoshka_dimensions to control the allowed output dimensions.

For models that support Matryoshka Embeddings but are not recognized by vLLM, manually override the config using hf_overrides={"is_matryoshka": True} or hf_overrides={"matryoshka_dimensions": [<allowed output dimensions>]} (offline), or --hf-overrides '{"is_matryoshka": true}' or --hf-overrides '{"matryoshka_dimensions": [<allowed output dimensions>]}' (online).

Here is an example to serve a model with Matryoshka Embeddings enabled.

You can change the output dimensions of embedding models that support Matryoshka Embeddings by using the dimensions parameter in PoolingParams.

A code example can be found here: examples/pooling/embed/embed_matryoshka_fy.py

Use the following command to start the vLLM server.

You can change the output dimensions of embedding models that support Matryoshka Embeddings by using the dimensions parameter.

An OpenAI client example can be found here: examples/pooling/embed/openai_embedding_matryoshka_fy.py

We have split the encode task into two more specific token-wise tasks: token_embed and token_classify:

We are going to remove softmax and activation from PoolingParams in v0.15. Instead, use use_activation, since we allow classify and token_classify to use any activation function.

We are going to remove --convert reward in v0.15, use --convert embed instead.

Pooling models now default support all pooling, you can use it without any settings.

**Examples:**

Example 1 (python):
```python
from vllm import LLM

llm = LLM(model="intfloat/e5-small", runner="pooling")
(output,) = llm.embed("Hello, my name is")

embeds = output.outputs.embedding
print(f"Embeddings: {embeds!r} (size={len(embeds)})")
```

Example 2 (python):
```python
from vllm import LLM

llm = LLM(model="intfloat/e5-small", runner="pooling")
(output,) = llm.embed("Hello, my name is")

embeds = output.outputs.embedding
print(f"Embeddings: {embeds!r} (size={len(embeds)})")
```

Example 3 (python):
```python
from vllm import LLM

llm = LLM(model="jason9693/Qwen2.5-1.5B-apeach", runner="pooling")
(output,) = llm.classify("Hello, my name is")

probs = output.outputs.probs
print(f"Class Probabilities: {probs!r} (size={len(probs)})")
```

Example 4 (python):
```python
from vllm import LLM

llm = LLM(model="jason9693/Qwen2.5-1.5B-apeach", runner="pooling")
(output,) = llm.classify("Hello, my name is")

probs = output.outputs.probs
print(f"Class Probabilities: {probs!r} (size={len(probs)})")
```

---

## pooling_params - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/pooling_params/

**Contents:**
- vllm.pooling_params ¶
- PoolingParams ¶
  - activation class-attribute instance-attribute ¶
  - all_parameters property ¶
  - dimensions class-attribute instance-attribute ¶
  - extra_kwargs class-attribute instance-attribute ¶
  - normalize class-attribute instance-attribute ¶
  - output_kind class-attribute instance-attribute ¶
  - requires_token_ids class-attribute instance-attribute ¶
  - returned_token_ids class-attribute instance-attribute ¶

API parameters for pooling models.

Controls prompt truncation. Set to -1 to use the model's default truncation size. Set to k to keep only the last k tokens (left truncation). Set to None to disable truncation.

Reduce the dimensions of embeddings if model support matryoshka representation.

Whether to normalize the embeddings outputs.

softmax will be deprecated, please use use_activation instead.

activation will be deprecated, please use use_activation instead.

Whether to apply activation function to the classification outputs.

Returns a deep copy of the PoolingParams instance.

**Examples:**

Example 1 (unknown):
```unknown
15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
```

Example 2 (python):
```python
class PoolingParams(
    msgspec.Struct,
    omit_defaults=True,  # type: ignore[call-arg]
    array_like=True,
):  # type: ignore[call-arg]
    """API parameters for pooling models.

    Attributes:
        truncate_prompt_tokens: Controls prompt truncation.
            Set to -1 to use the model's default truncation size.
            Set to k to keep only the last k tokens (left truncation).
            Set to None to disable truncation.
        dimensions: Reduce the dimensions of embeddings
            if model support matryoshka representation.
        normalize: Whether to normalize the embeddings outputs.
        softmax: softmax will be deprecated, please use use_activation instead.
        activation: activation will be deprecated, please use use_activation instead.
        use_activation: Whether to apply activation function to
            the classification outputs.
    """

    # --8<-- [start:common-pooling-params]
    truncate_prompt_tokens: Annotated[int, msgspec.Meta(ge=-1)] | None = None
    # --8<-- [end:common-pooling-params]

    ## for embeddings models
    # --8<-- [start:embedding-pooling-params]
    dimensions: int | None = None
    normalize: bool | None = None
    # --8<-- [end:embedding-pooling-params]

    ## for classification, scoring and rerank
    # --8<-- [start:classification-pooling-params]
    softmax: bool | None = None
    activation: bool | None = None
    use_activation: bool | None = None
    # --8<-- [end:classification-pooling-params]

    ## for step pooling models
    step_tag_id: int | None = None
    returned_token_ids: list[int] | None = None

    ## Internal use only
    task: PoolingTask | None = None
    requires_token_ids: bool = False
    skip_reading_prefix_cache: bool | None = None
    extra_kwargs: dict[str, Any] | None = None
    output_kind: RequestOutputKind = RequestOutputKind.FINAL_ONLY

    @property
    def all_parameters(self) -> list[str]:
        return ["dimensions", "normalize", "use_activation"]

    @property
    def valid_parameters(self):
        return {
            "embed": ["dimensions", "normalize"],
            "classify": ["use_activation"],
            "score": ["use_activation"],
            "token_embed": ["dimensions", "normalize"],
            "token_classify": ["use_activation"],
        }

    def clone(self) -> "PoolingParams":
        """Returns a deep copy of the PoolingParams instance."""
        return deepcopy(self)

    def verify(
        self, task: PoolingTask, model_config: Optional["ModelConfig"] = None
    ) -> None:
        if self.task is None:
            self.task = task
        elif self.task != task:
            msg = f"You cannot overwrite {self.task=!r} with {task=!r}!"
            raise ValueError(msg)

        # raise deprecated warning for softmax and activation
        self.use_activation = get_use_activation(self)

        # plugin task uses io_processor.parse_request to verify inputs,
        # skipping PoolingParams verify
        if self.task == "plugin":
            if self.skip_reading_prefix_cache is None:
                self.skip_reading_prefix_cache = True
            return

        # NOTE: Task validation needs to done against the model instance,
        # which is not available in model config. So, it's not included
        # in this method
        self._merge_default_parameters(model_config)
        self._set_default_parameters(model_config)
        self._verify_valid_parameters()

    def _merge_default_parameters(
        self, model_config: Optional["ModelConfig"] = None
    ) -> None:
        if model_config is None:
            return

        pooler_config = model_config.pooler_config
        if pooler_config is None:
            return

        assert self.task is not None, "task must be set"
        valid_parameters = self.valid_parameters[self.task]

        for k in valid_parameters:
            if getattr(pooler_config, k, None) is None:
                continue

            if getattr(self, k, None) is None:
                setattr(self, k, getattr(pooler_config, k))

        if self.skip_reading_prefix_cache is None:
            # If prefix caching is enabled,
            # the output of all pooling may less than n_prompt_tokens,
            # we need to skip reading cache at this request.
            if self.task in ["token_embed", "token_classify"]:
                self.skip_reading_prefix_cache = True
            else:
                self.skip_reading_prefix_cache = False

        self._verify_step_pooling(pooler_config, valid_parameters)

    def _verify_step_pooling(
        self, pooler_config: "PoolerConfig", valid_parameters: list[str]
    ):
        step_pooling_parameters = ["step_tag_id", "returned_token_ids"]
        if pooler_config.pooling_type != "STEP":
            invalid_parameters = []
            for k in step_pooling_parameters:
                if getattr(self, k, None) is not None:
                    invalid_parameters.append(k)

            if invalid_parameters:
                raise ValueError(
                    f"Task {self.task} only supports {valid_parameters} "
                    f"parameters, does not support "
                    f"{invalid_parameters} parameters"
                )
        else:
            for k in step_pooling_parameters:
                if getattr(pooler_config, k, None) is None:
                    continue

                if getattr(self, k, None) is None:
                    setattr(self, k, getattr(pooler_config, k))

    def _set_default_parameters(self, model_config: Optional["ModelConfig"]):
        if self.task in ["embed", "token_embed"]:
            if self.normalize is None:
                self.normalize = True

            if self.dimensions is not None and model_config is not None:
                if not model_config.is_matryoshka:
                    raise ValueError(
                        f'Model "{model_config.served_model_name}" does not '
                        f"support matryoshka representation, "
                        f"changing output dimensions will lead to poor results."
                    )

                mds = model_config.matryoshka_dimensions
                if mds is not None:
                    if self.dimensions not in mds:
                        raise ValueError(
                            f'Model "{model_config.served_model_name}" '
                            f"only supports {str(mds)} matryoshka dimensions, "
                            f"use other output dimensions will "
                            f"lead to poor results."
                        )
                elif self.dimensions < 1:
                    raise ValueError("Dimensions must be greater than 0")

        elif self.task in ["classify", "score", "token_classify"]:
            if self.use_activation is None:
                self.use_activation = True
        else:
            raise ValueError(f"Unknown pooling task: {self.task}")

    def _verify_valid_parameters(self):
        assert self.task is not None, "task must be set"
        valid_parameters = self.valid_parameters[self.task]
        invalid_parameters = []
        for k in self.all_parameters:
            if k in valid_parameters:
                continue

            if getattr(self, k, None) is not None:
                invalid_parameters.append(k)

        if invalid_parameters:
            raise ValueError(
                f"Task {self.task} only supports {valid_parameters} "
                f"parameters, does not support "
                f"{invalid_parameters} parameters"
            )

    def __repr__(self) -> str:
        return (
            f"PoolingParams("
            f"task={self.task}, "
            f"normalize={self.normalize}, "
            f"dimensions={self.dimensions}, "
            f"use_activation={self.use_activation}, "
            f"step_tag_id={self.step_tag_id}, "
            f"returned_token_ids={self.returned_token_ids}, "
            f"requires_token_ids={self.requires_token_ids}, "
            f"skip_reading_prefix_cache={self.skip_reading_prefix_cache}, "
            f"truncate_prompt_tokens={self.truncate_prompt_tokens}, "
            f"extra_kwargs={self.extra_kwargs})"
        )

    def __post_init__(self) -> None:
        assert self.output_kind == RequestOutputKind.FINAL_ONLY, (
            "For pooling output_kind has to be FINAL_ONLY"
        )
```

Example 3 (python):
```python
class PoolingParams(
    msgspec.Struct,
    omit_defaults=True,  # type: ignore[call-arg]
    array_like=True,
):  # type: ignore[call-arg]
    """API parameters for pooling models.

    Attributes:
        truncate_prompt_tokens: Controls prompt truncation.
            Set to -1 to use the model's default truncation size.
            Set to k to keep only the last k tokens (left truncation).
            Set to None to disable truncation.
        dimensions: Reduce the dimensions of embeddings
            if model support matryoshka representation.
        normalize: Whether to normalize the embeddings outputs.
        softmax: softmax will be deprecated, please use use_activation instead.
        activation: activation will be deprecated, please use use_activation instead.
        use_activation: Whether to apply activation function to
            the classification outputs.
    """

    # --8<-- [start:common-pooling-params]
    truncate_prompt_tokens: Annotated[int, msgspec.Meta(ge=-1)] | None = None
    # --8<-- [end:common-pooling-params]

    ## for embeddings models
    # --8<-- [start:embedding-pooling-params]
    dimensions: int | None = None
    normalize: bool | None = None
    # --8<-- [end:embedding-pooling-params]

    ## for classification, scoring and rerank
    # --8<-- [start:classification-pooling-params]
    softmax: bool | None = None
    activation: bool | None = None
    use_activation: bool | None = None
    # --8<-- [end:classification-pooling-params]

    ## for step pooling models
    step_tag_id: int | None = None
    returned_token_ids: list[int] | None = None

    ## Internal use only
    task: PoolingTask | None = None
    requires_token_ids: bool = False
    skip_reading_prefix_cache: bool | None = None
    extra_kwargs: dict[str, Any] | None = None
    output_kind: RequestOutputKind = RequestOutputKind.FINAL_ONLY

    @property
    def all_parameters(self) -> list[str]:
        return ["dimensions", "normalize", "use_activation"]

    @property
    def valid_parameters(self):
        return {
            "embed": ["dimensions", "normalize"],
            "classify": ["use_activation"],
            "score": ["use_activation"],
            "token_embed": ["dimensions", "normalize"],
            "token_classify": ["use_activation"],
        }

    def clone(self) -> "PoolingParams":
        """Returns a deep copy of the PoolingParams instance."""
        return deepcopy(self)

    def verify(
        self, task: PoolingTask, model_config: Optional["ModelConfig"] = None
    ) -> None:
        if self.task is None:
            self.task = task
        elif self.task != task:
            msg = f"You cannot overwrite {self.task=!r} with {task=!r}!"
            raise ValueError(msg)

        # raise deprecated warning for softmax and activation
        self.use_activation = get_use_activation(self)

        # plugin task uses io_processor.parse_request to verify inputs,
        # skipping PoolingParams verify
        if self.task == "plugin":
            if self.skip_reading_prefix_cache is None:
                self.skip_reading_prefix_cache = True
            return

        # NOTE: Task validation needs to done against the model instance,
        # which is not available in model config. So, it's not included
        # in this method
        self._merge_default_parameters(model_config)
        self._set_default_parameters(model_config)
        self._verify_valid_parameters()

    def _merge_default_parameters(
        self, model_config: Optional["ModelConfig"] = None
    ) -> None:
        if model_config is None:
            return

        pooler_config = model_config.pooler_config
        if pooler_config is None:
            return

        assert self.task is not None, "task must be set"
        valid_parameters = self.valid_parameters[self.task]

        for k in valid_parameters:
            if getattr(pooler_config, k, None) is None:
                continue

            if getattr(self, k, None) is None:
                setattr(self, k, getattr(pooler_config, k))

        if self.skip_reading_prefix_cache is None:
            # If prefix caching is enabled,
            # the output of all pooling may less than n_prompt_tokens,
            # we need to skip reading cache at this request.
            if self.task in ["token_embed", "token_classify"]:
                self.skip_reading_prefix_cache = True
            else:
                self.skip_reading_prefix_cache = False

        self._verify_step_pooling(pooler_config, valid_parameters)

    def _verify_step_pooling(
        self, pooler_config: "PoolerConfig", valid_parameters: list[str]
    ):
        step_pooling_parameters = ["step_tag_id", "returned_token_ids"]
        if pooler_config.pooling_type != "STEP":
            invalid_parameters = []
            for k in step_pooling_parameters:
                if getattr(self, k, None) is not None:
                    invalid_parameters.append(k)

            if invalid_parameters:
                raise ValueError(
                    f"Task {self.task} only supports {valid_parameters} "
                    f"parameters, does not support "
                    f"{invalid_parameters} parameters"
                )
        else:
            for k in step_pooling_parameters:
                if getattr(pooler_config, k, None) is None:
                    continue

                if getattr(self, k, None) is None:
                    setattr(self, k, getattr(pooler_config, k))

    def _set_default_parameters(self, model_config: Optional["ModelConfig"]):
        if self.task in ["embed", "token_embed"]:
            if self.normalize is None:
                self.normalize = True

            if self.dimensions is not None and model_config is not None:
                if not model_config.is_matryoshka:
                    raise ValueError(
                        f'Model "{model_config.served_model_name}" does not '
                        f"support matryoshka representation, "
                        f"changing output dimensions will lead to poor results."
                    )

                mds = model_config.matryoshka_dimensions
                if mds is not None:
                    if self.dimensions not in mds:
                        raise ValueError(
                            f'Model "{model_config.served_model_name}" '
                            f"only supports {str(mds)} matryoshka dimensions, "
                            f"use other output dimensions will "
                            f"lead to poor results."
                        )
                elif self.dimensions < 1:
                    raise ValueError("Dimensions must be greater than 0")

        elif self.task in ["classify", "score", "token_classify"]:
            if self.use_activation is None:
                self.use_activation = True
        else:
            raise ValueError(f"Unknown pooling task: {self.task}")

    def _verify_valid_parameters(self):
        assert self.task is not None, "task must be set"
        valid_parameters = self.valid_parameters[self.task]
        invalid_parameters = []
        for k in self.all_parameters:
            if k in valid_parameters:
                continue

            if getattr(self, k, None) is not None:
                invalid_parameters.append(k)

        if invalid_parameters:
            raise ValueError(
                f"Task {self.task} only supports {valid_parameters} "
                f"parameters, does not support "
                f"{invalid_parameters} parameters"
            )

    def __repr__(self) -> str:
        return (
            f"PoolingParams("
            f"task={self.task}, "
            f"normalize={self.normalize}, "
            f"dimensions={self.dimensions}, "
            f"use_activation={self.use_activation}, "
            f"step_tag_id={self.step_tag_id}, "
            f"returned_token_ids={self.returned_token_ids}, "
            f"requires_token_ids={self.requires_token_ids}, "
            f"skip_reading_prefix_cache={self.skip_reading_prefix_cache}, "
            f"truncate_prompt_tokens={self.truncate_prompt_tokens}, "
            f"extra_kwargs={self.extra_kwargs})"
        )

    def __post_init__(self) -> None:
        assert self.output_kind == RequestOutputKind.FINAL_ONLY, (
            "For pooling output_kind has to be FINAL_ONLY"
        )
```

Example 4 (yaml):
```yaml
activation: bool | None = None
```

---

## Pooling - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/pooling/

**Contents:**
- Pooling¶
- OpenAI Pooling Client¶
- Vision Language Pooling¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/pooling.

**Examples:**

Example 1 (json):
```json
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Example online usage of Pooling API.

Run `vllm serve <model> --runner pooling`
to start up the server in vLLM. e.g.

vllm serve internlm/internlm2-1_8b-reward --trust-remote-code
"""

import argparse
import pprint

import requests


def post_http_request(prompt: dict, api_url: str) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    response = requests.post(api_url, headers=headers, json=prompt)
    return response


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--model", type=str, default="internlm/internlm2-1_8b-reward")

    return parser.parse_args()


def main(args):
    api_url = f"http://{args.host}:{args.port}/pooling"
    model_name = args.model

    # Input like Completions API
    prompt = {"model": model_name, "input": "vLLM is great!"}
    pooling_response = post_http_request(prompt=prompt, api_url=api_url)
    print("-" * 50)
    print("Pooling Response:")
    pprint.pprint(pooling_response.json())
    print("-" * 50)

    # Input like Chat API
    prompt = {
        "model": model_name,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": "vLLM is great!"}],
            }
        ],
    }
    pooling_response = post_http_request(prompt=prompt, api_url=api_url)
    print("Pooling Response:")
    pprint.pprint(pooling_response.json())
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (json):
```json
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Example online usage of Pooling API.

Run `vllm serve <model> --runner pooling`
to start up the server in vLLM. e.g.

vllm serve internlm/internlm2-1_8b-reward --trust-remote-code
"""

import argparse
import pprint

import requests


def post_http_request(prompt: dict, api_url: str) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    response = requests.post(api_url, headers=headers, json=prompt)
    return response


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--model", type=str, default="internlm/internlm2-1_8b-reward")

    return parser.parse_args()


def main(args):
    api_url = f"http://{args.host}:{args.port}/pooling"
    model_name = args.model

    # Input like Completions API
    prompt = {"model": model_name, "input": "vLLM is great!"}
    pooling_response = post_http_request(prompt=prompt, api_url=api_url)
    print("-" * 50)
    print("Pooling Response:")
    pprint.pprint(pooling_response.json())
    print("-" * 50)

    # Input like Chat API
    prompt = {
        "model": model_name,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": "vLLM is great!"}],
            }
        ],
    }
    pooling_response = post_http_request(prompt=prompt, api_url=api_url)
    print("Pooling Response:")
    pprint.pprint(pooling_response.json())
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use vLLM for running offline inference with
the correct prompt format on vision language models for multimodal pooling.

For most models, the prompt format should follow corresponding examples
on HuggingFace model repository.
"""

from argparse import Namespace
from dataclasses import asdict
from pathlib import Path
from typing import Literal, NamedTuple, TypeAlias, TypedDict, get_args

from PIL.Image import Image

from vllm import LLM, EngineArgs
from vllm.entrypoints.score_utils import ScoreMultiModalParam
from vllm.multimodal.utils import fetch_image
from vllm.utils.argparse_utils import FlexibleArgumentParser

ROOT_DIR = Path(__file__).parent.parent.parent
EXAMPLES_DIR = ROOT_DIR / "examples"


class TextQuery(TypedDict):
    modality: Literal["text"]
    text: str


class ImageQuery(TypedDict):
    modality: Literal["image"]
    image: Image


class TextImageQuery(TypedDict):
    modality: Literal["text+image"]
    text: str
    image: Image


class TextImagesQuery(TypedDict):
    modality: Literal["text+images"]
    text: str
    image: ScoreMultiModalParam


QueryModality = Literal["text", "image", "text+image", "text+images"]
Query: TypeAlias = TextQuery | ImageQuery | TextImageQuery | TextImagesQuery


class ModelRequestData(NamedTuple):
    engine_args: EngineArgs
    prompt: str | None = None
    image: Image | None = None
    query: str | None = None
    documents: ScoreMultiModalParam | None = None


def run_clip(query: Query) -> ModelRequestData:
    if query["modality"] == "text":
        prompt = query["text"]
        image = None
    elif query["modality"] == "image":
        prompt = ""  # For image input, make sure that the prompt text is empty
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: '{modality}'")

    engine_args = EngineArgs(
        model="openai/clip-vit-base-patch32",
        runner="pooling",
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def run_e5_v(query: Query) -> ModelRequestData:
    llama3_template = "<|start_header_id|>user<|end_header_id|>\n\n{}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n \n"  # noqa: E501

    if query["modality"] == "text":
        text = query["text"]
        prompt = llama3_template.format(f"{text}\nSummary above sentence in one word: ")
        image = None
    elif query["modality"] == "image":
        prompt = llama3_template.format("<image>\nSummary above image in one word: ")
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: '{modality}'")

    engine_args = EngineArgs(
        model="royokong/e5-v",
        runner="pooling",
        max_model_len=4096,
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def run_jinavl_reranker(query: Query) -> ModelRequestData:
    if query["modality"] != "text+images":
        raise ValueError(f"Unsupported query modality: '{query['modality']}'")

    engine_args = EngineArgs(
        model="jinaai/jina-reranker-m0",
        runner="pooling",
        max_model_len=32768,
        trust_remote_code=True,
        mm_processor_kwargs={
            "min_pixels": 3136,
            "max_pixels": 602112,
        },
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        query=query["text"],
        documents=query["image"],
    )


def run_siglip(query: Query) -> ModelRequestData:
    if query["modality"] == "text":
        prompt = query["text"]
        image = None
    elif query["modality"] == "image":
        prompt = ""  # For image input, make sure that the prompt text is empty
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: '{modality}'")

    engine_args = EngineArgs(
        model="google/siglip-base-patch16-224",
        runner="pooling",
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def _get_vlm2vec_prompt_image(query: Query, image_token: str):
    if query["modality"] == "text":
        text = query["text"]
        prompt = f"Find me an everyday image that matches the given caption: {text}"
        image = None
    elif query["modality"] == "image":
        prompt = f"{image_token} Find a day-to-day image that looks similar to the provided image."  # noqa: E501
        image = query["image"]
    elif query["modality"] == "text+image":
        text = query["text"]
        prompt = f"{image_token} Represent the given image with the following question: {text}"  # noqa: E501
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: {modality!r}")

    return prompt, image


def run_vlm2vec_phi3v(query: Query) -> ModelRequestData:
    prompt, image = _get_vlm2vec_prompt_image(query, "<|image_1|>")

    engine_args = EngineArgs(
        model="TIGER-Lab/VLM2Vec-Full",
        runner="pooling",
        max_model_len=4096,
        trust_remote_code=True,
        mm_processor_kwargs={"num_crops": 4},
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def run_vlm2vec_qwen2vl(query: Query) -> ModelRequestData:
    # vLLM does not support LoRA adapters on multi-modal encoder,
    # so we merge the weights first
    from huggingface_hub.constants import HF_HUB_CACHE
    from peft import PeftConfig, PeftModel
    from transformers import AutoModelForImageTextToText, AutoProcessor

    from vllm.entrypoints.chat_utils import load_chat_template

    model_id = "TIGER-Lab/VLM2Vec-Qwen2VL-2B"

    base_model = AutoModelForImageTextToText.from_pretrained(model_id)
    lora_model = PeftModel.from_pretrained(
        base_model,
        model_id,
        config=PeftConfig.from_pretrained(model_id),
    )
    model = lora_model.merge_and_unload().to(dtype=base_model.dtype)
    model._hf_peft_config_loaded = False  # Needed to save the merged model

    processor = AutoProcessor.from_pretrained(
        model_id,
        # `min_pixels` and `max_pixels` are deprecated for
        # transformers `preprocessor_config.json`
        size={"shortest_edge": 3136, "longest_edge": 12845056},
    )
    processor.chat_template = load_chat_template(
        # The original chat template is not correct
        EXAMPLES_DIR / "template_vlm2vec_qwen2vl.jinja",
    )

    merged_path = str(
        Path(HF_HUB_CACHE) / ("models--" + model_id.replace("/", "--") + "-vllm")
    )
    print(f"Saving merged model to {merged_path}...")
    print(
        "NOTE: This directory is not tracked by `huggingface_hub` "
        "so you have to delete this manually if you don't want it anymore."
    )
    model.save_pretrained(merged_path)
    processor.save_pretrained(merged_path)
    print("Done!")

    prompt, image = _get_vlm2vec_prompt_image(query, "<|image_pad|>")

    engine_args = EngineArgs(
        model=merged_path,
        runner="pooling",
        max_model_len=4096,
        mm_processor_kwargs={
            "min_pixels": 3136,
            "max_pixels": 12845056,
        },
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def get_query(modality: QueryModality):
    if modality == "text":
        return TextQuery(modality="text", text="A dog sitting in the grass")

    if modality == "image":
        return ImageQuery(
            modality="image",
            image=fetch_image(
                "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/eskimo.jpg"  # noqa: E501
            ),
        )

    if modality == "text+image":
        return TextImageQuery(
            modality="text+image",
            text="A cat standing in the snow.",
            image=fetch_image(
                "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/cat_snow.jpg"  # noqa: E501
            ),
        )

    if modality == "text+images":
        return TextImagesQuery(
            modality="text+images",
            text="slm markdown",
            image={
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/handelsblatt-preview.png"
                        },
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/paper-11.png"
                        },
                    },
                ]
            },
        )

    msg = f"Modality {modality} is not supported."
    raise ValueError(msg)


def run_encode(model: str, modality: QueryModality, seed: int):
    query = get_query(modality)
    req_data = model_example_map[model](query)

    # Disable other modalities to save memory
    default_limits = {"image": 0, "video": 0, "audio": 0}
    req_data.engine_args.limit_mm_per_prompt = default_limits | dict(
        req_data.engine_args.limit_mm_per_prompt or {}
    )

    engine_args = asdict(req_data.engine_args) | {"seed": seed}
    llm = LLM(**engine_args)

    mm_data = {}
    if req_data.image is not None:
        mm_data["image"] = req_data.image

    outputs = llm.embed(
        {
            "prompt": req_data.prompt,
            "multi_modal_data": mm_data,
        }
    )

    print("-" * 50)
    for output in outputs:
        print(output.outputs.embedding)
        print("-" * 50)


def run_score(model: str, modality: QueryModality, seed: int):
    query = get_query(modality)
    req_data = model_example_map[model](query)

    engine_args = asdict(req_data.engine_args) | {"seed": seed}
    llm = LLM(**engine_args)

    outputs = llm.score(req_data.query, req_data.documents)

    print("-" * 30)
    print([output.outputs.score for output in outputs])
    print("-" * 30)


model_example_map = {
    "clip": run_clip,
    "e5_v": run_e5_v,
    "jinavl_reranker": run_jinavl_reranker,
    "siglip": run_siglip,
    "vlm2vec_phi3v": run_vlm2vec_phi3v,
    "vlm2vec_qwen2vl": run_vlm2vec_qwen2vl,
}


def parse_args():
    parser = FlexibleArgumentParser(
        description="Demo on using vLLM for offline inference with "
        "vision language models for multimodal pooling tasks."
    )
    parser.add_argument(
        "--model-name",
        "-m",
        type=str,
        default="vlm2vec_phi3v",
        choices=model_example_map.keys(),
        help="The name of the embedding model.",
    )
    parser.add_argument(
        "--task",
        "-t",
        type=str,
        default="embedding",
        choices=["embedding", "scoring"],
        help="The task type.",
    )
    parser.add_argument(
        "--modality",
        type=str,
        default="image",
        choices=get_args(QueryModality),
        help="Modality of the input.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=0,
        help="Set the seed when initializing `vllm.LLM`.",
    )
    return parser.parse_args()


def main(args: Namespace):
    if args.task == "embedding":
        run_encode(args.model_name, args.modality, args.seed)
    elif args.task == "scoring":
        run_score(args.model_name, args.modality, args.seed)
    else:
        raise ValueError(f"Unsupported task: {args.task}")


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use vLLM for running offline inference with
the correct prompt format on vision language models for multimodal pooling.

For most models, the prompt format should follow corresponding examples
on HuggingFace model repository.
"""

from argparse import Namespace
from dataclasses import asdict
from pathlib import Path
from typing import Literal, NamedTuple, TypeAlias, TypedDict, get_args

from PIL.Image import Image

from vllm import LLM, EngineArgs
from vllm.entrypoints.score_utils import ScoreMultiModalParam
from vllm.multimodal.utils import fetch_image
from vllm.utils.argparse_utils import FlexibleArgumentParser

ROOT_DIR = Path(__file__).parent.parent.parent
EXAMPLES_DIR = ROOT_DIR / "examples"


class TextQuery(TypedDict):
    modality: Literal["text"]
    text: str


class ImageQuery(TypedDict):
    modality: Literal["image"]
    image: Image


class TextImageQuery(TypedDict):
    modality: Literal["text+image"]
    text: str
    image: Image


class TextImagesQuery(TypedDict):
    modality: Literal["text+images"]
    text: str
    image: ScoreMultiModalParam


QueryModality = Literal["text", "image", "text+image", "text+images"]
Query: TypeAlias = TextQuery | ImageQuery | TextImageQuery | TextImagesQuery


class ModelRequestData(NamedTuple):
    engine_args: EngineArgs
    prompt: str | None = None
    image: Image | None = None
    query: str | None = None
    documents: ScoreMultiModalParam | None = None


def run_clip(query: Query) -> ModelRequestData:
    if query["modality"] == "text":
        prompt = query["text"]
        image = None
    elif query["modality"] == "image":
        prompt = ""  # For image input, make sure that the prompt text is empty
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: '{modality}'")

    engine_args = EngineArgs(
        model="openai/clip-vit-base-patch32",
        runner="pooling",
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def run_e5_v(query: Query) -> ModelRequestData:
    llama3_template = "<|start_header_id|>user<|end_header_id|>\n\n{}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n \n"  # noqa: E501

    if query["modality"] == "text":
        text = query["text"]
        prompt = llama3_template.format(f"{text}\nSummary above sentence in one word: ")
        image = None
    elif query["modality"] == "image":
        prompt = llama3_template.format("<image>\nSummary above image in one word: ")
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: '{modality}'")

    engine_args = EngineArgs(
        model="royokong/e5-v",
        runner="pooling",
        max_model_len=4096,
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def run_jinavl_reranker(query: Query) -> ModelRequestData:
    if query["modality"] != "text+images":
        raise ValueError(f"Unsupported query modality: '{query['modality']}'")

    engine_args = EngineArgs(
        model="jinaai/jina-reranker-m0",
        runner="pooling",
        max_model_len=32768,
        trust_remote_code=True,
        mm_processor_kwargs={
            "min_pixels": 3136,
            "max_pixels": 602112,
        },
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        query=query["text"],
        documents=query["image"],
    )


def run_siglip(query: Query) -> ModelRequestData:
    if query["modality"] == "text":
        prompt = query["text"]
        image = None
    elif query["modality"] == "image":
        prompt = ""  # For image input, make sure that the prompt text is empty
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: '{modality}'")

    engine_args = EngineArgs(
        model="google/siglip-base-patch16-224",
        runner="pooling",
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def _get_vlm2vec_prompt_image(query: Query, image_token: str):
    if query["modality"] == "text":
        text = query["text"]
        prompt = f"Find me an everyday image that matches the given caption: {text}"
        image = None
    elif query["modality"] == "image":
        prompt = f"{image_token} Find a day-to-day image that looks similar to the provided image."  # noqa: E501
        image = query["image"]
    elif query["modality"] == "text+image":
        text = query["text"]
        prompt = f"{image_token} Represent the given image with the following question: {text}"  # noqa: E501
        image = query["image"]
    else:
        modality = query["modality"]
        raise ValueError(f"Unsupported query modality: {modality!r}")

    return prompt, image


def run_vlm2vec_phi3v(query: Query) -> ModelRequestData:
    prompt, image = _get_vlm2vec_prompt_image(query, "<|image_1|>")

    engine_args = EngineArgs(
        model="TIGER-Lab/VLM2Vec-Full",
        runner="pooling",
        max_model_len=4096,
        trust_remote_code=True,
        mm_processor_kwargs={"num_crops": 4},
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def run_vlm2vec_qwen2vl(query: Query) -> ModelRequestData:
    # vLLM does not support LoRA adapters on multi-modal encoder,
    # so we merge the weights first
    from huggingface_hub.constants import HF_HUB_CACHE
    from peft import PeftConfig, PeftModel
    from transformers import AutoModelForImageTextToText, AutoProcessor

    from vllm.entrypoints.chat_utils import load_chat_template

    model_id = "TIGER-Lab/VLM2Vec-Qwen2VL-2B"

    base_model = AutoModelForImageTextToText.from_pretrained(model_id)
    lora_model = PeftModel.from_pretrained(
        base_model,
        model_id,
        config=PeftConfig.from_pretrained(model_id),
    )
    model = lora_model.merge_and_unload().to(dtype=base_model.dtype)
    model._hf_peft_config_loaded = False  # Needed to save the merged model

    processor = AutoProcessor.from_pretrained(
        model_id,
        # `min_pixels` and `max_pixels` are deprecated for
        # transformers `preprocessor_config.json`
        size={"shortest_edge": 3136, "longest_edge": 12845056},
    )
    processor.chat_template = load_chat_template(
        # The original chat template is not correct
        EXAMPLES_DIR / "template_vlm2vec_qwen2vl.jinja",
    )

    merged_path = str(
        Path(HF_HUB_CACHE) / ("models--" + model_id.replace("/", "--") + "-vllm")
    )
    print(f"Saving merged model to {merged_path}...")
    print(
        "NOTE: This directory is not tracked by `huggingface_hub` "
        "so you have to delete this manually if you don't want it anymore."
    )
    model.save_pretrained(merged_path)
    processor.save_pretrained(merged_path)
    print("Done!")

    prompt, image = _get_vlm2vec_prompt_image(query, "<|image_pad|>")

    engine_args = EngineArgs(
        model=merged_path,
        runner="pooling",
        max_model_len=4096,
        mm_processor_kwargs={
            "min_pixels": 3136,
            "max_pixels": 12845056,
        },
        limit_mm_per_prompt={"image": 1},
    )

    return ModelRequestData(
        engine_args=engine_args,
        prompt=prompt,
        image=image,
    )


def get_query(modality: QueryModality):
    if modality == "text":
        return TextQuery(modality="text", text="A dog sitting in the grass")

    if modality == "image":
        return ImageQuery(
            modality="image",
            image=fetch_image(
                "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/eskimo.jpg"  # noqa: E501
            ),
        )

    if modality == "text+image":
        return TextImageQuery(
            modality="text+image",
            text="A cat standing in the snow.",
            image=fetch_image(
                "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/cat_snow.jpg"  # noqa: E501
            ),
        )

    if modality == "text+images":
        return TextImagesQuery(
            modality="text+images",
            text="slm markdown",
            image={
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/handelsblatt-preview.png"
                        },
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/paper-11.png"
                        },
                    },
                ]
            },
        )

    msg = f"Modality {modality} is not supported."
    raise ValueError(msg)


def run_encode(model: str, modality: QueryModality, seed: int):
    query = get_query(modality)
    req_data = model_example_map[model](query)

    # Disable other modalities to save memory
    default_limits = {"image": 0, "video": 0, "audio": 0}
    req_data.engine_args.limit_mm_per_prompt = default_limits | dict(
        req_data.engine_args.limit_mm_per_prompt or {}
    )

    engine_args = asdict(req_data.engine_args) | {"seed": seed}
    llm = LLM(**engine_args)

    mm_data = {}
    if req_data.image is not None:
        mm_data["image"] = req_data.image

    outputs = llm.embed(
        {
            "prompt": req_data.prompt,
            "multi_modal_data": mm_data,
        }
    )

    print("-" * 50)
    for output in outputs:
        print(output.outputs.embedding)
        print("-" * 50)


def run_score(model: str, modality: QueryModality, seed: int):
    query = get_query(modality)
    req_data = model_example_map[model](query)

    engine_args = asdict(req_data.engine_args) | {"seed": seed}
    llm = LLM(**engine_args)

    outputs = llm.score(req_data.query, req_data.documents)

    print("-" * 30)
    print([output.outputs.score for output in outputs])
    print("-" * 30)


model_example_map = {
    "clip": run_clip,
    "e5_v": run_e5_v,
    "jinavl_reranker": run_jinavl_reranker,
    "siglip": run_siglip,
    "vlm2vec_phi3v": run_vlm2vec_phi3v,
    "vlm2vec_qwen2vl": run_vlm2vec_qwen2vl,
}


def parse_args():
    parser = FlexibleArgumentParser(
        description="Demo on using vLLM for offline inference with "
        "vision language models for multimodal pooling tasks."
    )
    parser.add_argument(
        "--model-name",
        "-m",
        type=str,
        default="vlm2vec_phi3v",
        choices=model_example_map.keys(),
        help="The name of the embedding model.",
    )
    parser.add_argument(
        "--task",
        "-t",
        type=str,
        default="embedding",
        choices=["embedding", "scoring"],
        help="The task type.",
    )
    parser.add_argument(
        "--modality",
        type=str,
        default="image",
        choices=get_args(QueryModality),
        help="Modality of the input.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=0,
        help="Set the seed when initializing `vllm.LLM`.",
    )
    return parser.parse_args()


def main(args: Namespace):
    if args.task == "embedding":
        run_encode(args.model_name, args.modality, args.seed)
    elif args.task == "scoring":
        run_score(args.model_name, args.modality, args.seed)
    else:
        raise ValueError(f"Unsupported task: {args.task}")


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## pooling - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/pooling/

**Contents:**
- vllm.entrypoints.pooling.pooling ¶

---

## pooling - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/

**Contents:**
- vllm.entrypoints.pooling ¶
- register_pooling_api_routers ¶

**Examples:**

Example 1 (unknown):
```unknown
register_pooling_api_routers(app: FastAPI)
```

Example 2 (unknown):
```unknown
register_pooling_api_routers(app: FastAPI)
```

Example 3 (unknown):
```unknown
7
 8
 9
10
11
12
13
14
15
16
```

Example 4 (python):
```python
def register_pooling_api_routers(app: FastAPI):
    from vllm.entrypoints.pooling.classify.api_router import router as classify_router
    from vllm.entrypoints.pooling.embed.api_router import router as embed_router
    from vllm.entrypoints.pooling.pooling.api_router import router as pooling_router
    from vllm.entrypoints.pooling.score.api_router import router as score_router

    app.include_router(classify_router)
    app.include_router(embed_router)
    app.include_router(score_router)
    app.include_router(pooling_router)
```

---

## protocol - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/pooling/protocol/

**Contents:**
- vllm.entrypoints.pooling.pooling.protocol ¶
- PoolingRequest module-attribute ¶
- T module-attribute ¶
- IOProcessorRequest ¶
  - data instance-attribute ¶
  - embed_dtype class-attribute instance-attribute ¶
  - encoding_format class-attribute instance-attribute ¶
  - endianness class-attribute instance-attribute ¶
  - model class-attribute instance-attribute ¶
  - priority class-attribute instance-attribute ¶

Bases: OpenAIBaseModel, Generic[T]

The priority of the request (lower means earlier handling; default: 0). Any priority other than 0 will raise an error if the served model does not use priority scheduling.

Bases: OpenAIBaseModel, Generic[T]

When using plugins IOProcessor plugins, the actual output is generated by the plugin itself. Hence, we use a generic type for the response data

The request_id associated with this response

Bases: OpenAIBaseModel

Bases: EmbeddingChatRequest

Bases: EmbeddingCompletionRequest

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

**Examples:**

Example 1 (typescript):
```typescript
PoolingRequest: TypeAlias = (
    PoolingCompletionRequest
    | PoolingChatRequest
    | IOProcessorRequest
)
```

Example 2 (typescript):
```typescript
PoolingRequest: TypeAlias = (
    PoolingCompletionRequest
    | PoolingChatRequest
    | IOProcessorRequest
)
```

Example 3 (unknown):
```unknown
T = TypeVar('T')
```

Example 4 (unknown):
```unknown
T = TypeVar('T')
```

---

## protocol - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/embed/protocol/

**Contents:**
- vllm.entrypoints.pooling.embed.protocol ¶
- EmbeddingRequest module-attribute ¶
- EmbeddingBytesResponse ¶
  - content instance-attribute ¶
  - headers class-attribute instance-attribute ¶
  - media_type class-attribute instance-attribute ¶
- EmbeddingChatRequest ¶
  - add_generation_prompt class-attribute instance-attribute ¶
  - add_special_tokens class-attribute instance-attribute ¶
  - chat_template class-attribute instance-attribute ¶

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

**Examples:**

Example 1 (typescript):
```typescript
EmbeddingRequest: TypeAlias = (
    EmbeddingCompletionRequest | EmbeddingChatRequest
)
```

Example 2 (typescript):
```typescript
EmbeddingRequest: TypeAlias = (
    EmbeddingCompletionRequest | EmbeddingChatRequest
)
```

Example 3 (unknown):
```unknown
205
206
207
208
```

Example 4 (typescript):
```typescript
class EmbeddingBytesResponse(OpenAIBaseModel):
    content: list[bytes]
    headers: dict[str, str] | None = None
    media_type: str = "application/octet-stream"
```

---

## protocol - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/score/protocol/

**Contents:**
- vllm.entrypoints.pooling.score.protocol ¶
- RerankDocument ¶
  - multi_modal class-attribute instance-attribute ¶
  - text class-attribute instance-attribute ¶
- RerankRequest ¶
  - activation class-attribute instance-attribute ¶
  - documents instance-attribute ¶
  - mm_processor_kwargs class-attribute instance-attribute ¶
  - model class-attribute instance-attribute ¶
  - priority class-attribute instance-attribute ¶

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

**Examples:**

Example 1 (unknown):
```unknown
111
112
113
```

Example 2 (php):
```php
class RerankDocument(BaseModel):
    text: str | None = None
    multi_modal: ScoreContentPartParam | None = None
```

Example 3 (php):
```php
class RerankDocument(BaseModel):
    text: str | None = None
    multi_modal: ScoreContentPartParam | None = None
```

Example 4 (yaml):
```yaml
multi_modal: ScoreContentPartParam | None = None
```

---

## protocol - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/classify/protocol/

**Contents:**
- vllm.entrypoints.pooling.classify.protocol ¶
- ClassificationRequest module-attribute ¶
- ClassificationChatRequest ¶
  - activation class-attribute instance-attribute ¶
  - add_generation_prompt class-attribute instance-attribute ¶
  - add_special_tokens class-attribute instance-attribute ¶
  - chat_template class-attribute instance-attribute ¶
  - chat_template_kwargs class-attribute instance-attribute ¶
  - messages instance-attribute ¶
  - mm_processor_kwargs class-attribute instance-attribute ¶

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

Bases: OpenAIBaseModel

**Examples:**

Example 1 (typescript):
```typescript
ClassificationRequest: TypeAlias = (
    ClassificationCompletionRequest
    | ClassificationChatRequest
)
```

Example 2 (typescript):
```typescript
ClassificationRequest: TypeAlias = (
    ClassificationCompletionRequest
    | ClassificationChatRequest
)
```

Example 3 (unknown):
```unknown
72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
```

Example 4 (python):
```python
class ClassificationChatRequest(OpenAIBaseModel):
    model: str | None = None
    messages: list[ChatCompletionMessageParam]
    truncate_prompt_tokens: Annotated[int, Field(ge=-1)] | None = None
    user: str | None = None

    # --8<-- [start:chat-classification-extra-params]
    add_generation_prompt: bool = Field(
        default=False,
        description=(
            "If true, the generation prompt will be added to the chat template. "
            "This is a parameter used by chat template in tokenizer config of the "
            "model."
        ),
    )

    add_special_tokens: bool = Field(
        default=False,
        description=(
            "If true, special tokens (e.g. BOS) will be added to the prompt "
            "on top of what is added by the chat template. "
            "For most models, the chat template takes care of adding the "
            "special tokens so this should be set to false (as is the "
            "default)."
        ),
    )

    chat_template: str | None = Field(
        default=None,
        description=(
            "A Jinja template to use for this conversion. "
            "As of transformers v4.44, default chat template is no longer "
            "allowed, so you must provide a chat template if the tokenizer "
            "does not define one."
        ),
    )

    chat_template_kwargs: dict[str, Any] | None = Field(
        default=None,
        description=(
            "Additional keyword args to pass to the template renderer. "
            "Will be accessible by the chat template."
        ),
    )

    mm_processor_kwargs: dict[str, Any] | None = Field(
        default=None,
        description=("Additional kwargs to pass to the HF processor."),
    )

    priority: int = Field(
        default=0,
        description=(
            "The priority of the request (lower means earlier handling; "
            "default: 0). Any priority other than 0 will raise an error "
            "if the served model does not use priority scheduling."
        ),
    )

    request_id: str = Field(
        default_factory=random_uuid,
        description=(
            "The request_id related to this request. If the caller does "
            "not set it, a random_uuid will be generated. This id is used "
            "through out the inference process and return in response."
        ),
    )
    softmax: bool | None = Field(
        default=None,
        description="softmax will be deprecated, please use use_activation instead.",
    )

    activation: bool | None = Field(
        default=None,
        description="activation will be deprecated, please use use_activation instead.",
    )

    use_activation: bool | None = Field(
        default=None,
        description="Whether to use activation for classification outputs. "
        "Default is True.",
    )
    # --8<-- [end:chat-classification-extra-params]

    def to_pooling_params(self):
        return PoolingParams(
            truncate_prompt_tokens=self.truncate_prompt_tokens,
            use_activation=get_use_activation(self),
        )
```

---

## registry - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/attention/backends/registry/

**Contents:**
- vllm.attention.backends.registry ¶
- MAMBA_TYPE_TO_BACKEND_MAP module-attribute ¶
- _ATTN_OVERRIDES module-attribute ¶
- _MAMBA_ATTN_OVERRIDES module-attribute ¶
- logger module-attribute ¶
- AttentionBackendEnum ¶
  - CPU_ATTN class-attribute instance-attribute ¶
  - CUSTOM class-attribute instance-attribute ¶
  - CUTLASS_MLA class-attribute instance-attribute ¶
  - FLASHINFER class-attribute instance-attribute ¶

Attention backend registry

Enumeration of all supported attention backends.

The enum value is the default class path, but this can be overridden at runtime using register_backend().

To get the actual backend class (respecting overrides), use: backend.get_class()

Clear any override for this backend, reverting to the default.

Get the backend class (respects overrides).

If the backend class cannot be imported

If Backend.CUSTOM is used without being registered

Get the class path for this backend (respects overrides).

The fully qualified class path string

If Backend.CUSTOM is used without being registered

Check if this backend has been overridden.

True if the backend has a registered override

Enumeration of all supported mamba attention backends.

The enum value is the default class path, but this can be overridden at runtime using register_backend().

To get the actual backend class (respecting overrides), use: backend.get_class()

Clear any override for this backend, reverting to the default.

Get the backend class (respects overrides).

If the backend class cannot be imported

If Backend.CUSTOM is used without being registered

Get the class path for this backend (respects overrides).

The fully qualified class path string

If Backend.CUSTOM is used without being registered

Check if this backend has been overridden.

True if the backend has a registered override

Metaclass for AttentionBackendEnum to provide better error messages.

Get backend by name with helpful error messages.

Register or override a backend implementation.

The AttentionBackendEnum member to register

Optional class path. If not provided and used as decorator, will be auto-generated from the class.

Decorator function if class_path is None, otherwise a no-op

@register_backend(AttentionBackendEnum.FLASH_ATTN) class MyCustomFlashAttn: ...

@register_backend(MambaAttentionBackendEnum.LINEAR, is_mamba=True) class MyCustomMambaAttn: ...

@register_backend(AttentionBackendEnum.CUSTOM) class MyCustomBackend: ...

register_backend( AttentionBackendEnum.CUSTOM, "my.module.MyCustomBackend" )

**Examples:**

Example 1 (json):
```json
MAMBA_TYPE_TO_BACKEND_MAP = {
    "mamba1": name,
    "mamba2": name,
    "short_conv": name,
    "linear_attention": name,
    "gdn_attention": name,
    "custom": name,
}
```

Example 2 (json):
```json
MAMBA_TYPE_TO_BACKEND_MAP = {
    "mamba1": name,
    "mamba2": name,
    "short_conv": name,
    "linear_attention": name,
    "gdn_attention": name,
    "custom": name,
}
```

Example 3 (yaml):
```yaml
_ATTN_OVERRIDES: dict[AttentionBackendEnum, str] = {}
```

Example 4 (yaml):
```yaml
_ATTN_OVERRIDES: dict[AttentionBackendEnum, str] = {}
```

---

## score - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/score/

**Contents:**
- vllm.entrypoints.pooling.score ¶

---

## Score - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/score/

**Contents:**
- Score¶
- Cohere Rerank Client¶
- Convert Model To Seq Cls¶
- Offline Reranker¶
- Offline Using Template¶
- Online Using Template¶
- OpenAI Cross Encoder Score¶
- OpenAI Cross Encoder Score For Multimodal¶
- OpenAI Reranker¶
- Template - Nemotron-Rerank¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/score.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Example of using the OpenAI entrypoint's rerank API which is compatible with
the Cohere SDK: https://github.com/cohere-ai/cohere-python
Note that `pip install cohere` is needed to run this example.

run: vllm serve BAAI/bge-reranker-base
"""

import cohere
from cohere import Client, ClientV2

model = "BAAI/bge-reranker-base"

query = "What is the capital of France?"

documents = [
    "The capital of France is Paris",
    "Reranking is fun!",
    "vLLM is an open-source framework for fast AI serving",
]


def cohere_rerank(
    client: Client | ClientV2, model: str, query: str, documents: list[str]
) -> dict:
    return client.rerank(model=model, query=query, documents=documents)


def main():
    # cohere v1 client
    cohere_v1 = cohere.Client(base_url="http://localhost:8000", api_key="sk-fake-key")
    rerank_v1_result = cohere_rerank(cohere_v1, model, query, documents)
    print("-" * 50)
    print("rerank_v1_result:\n", rerank_v1_result)
    print("-" * 50)

    # or the v2
    cohere_v2 = cohere.ClientV2("sk-fake-key", base_url="http://localhost:8000")
    rerank_v2_result = cohere_rerank(cohere_v2, model, query, documents)
    print("rerank_v2_result:\n", rerank_v2_result)
    print("-" * 50)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Example of using the OpenAI entrypoint's rerank API which is compatible with
the Cohere SDK: https://github.com/cohere-ai/cohere-python
Note that `pip install cohere` is needed to run this example.

run: vllm serve BAAI/bge-reranker-base
"""

import cohere
from cohere import Client, ClientV2

model = "BAAI/bge-reranker-base"

query = "What is the capital of France?"

documents = [
    "The capital of France is Paris",
    "Reranking is fun!",
    "vLLM is an open-source framework for fast AI serving",
]


def cohere_rerank(
    client: Client | ClientV2, model: str, query: str, documents: list[str]
) -> dict:
    return client.rerank(model=model, query=query, documents=documents)


def main():
    # cohere v1 client
    cohere_v1 = cohere.Client(base_url="http://localhost:8000", api_key="sk-fake-key")
    rerank_v1_result = cohere_rerank(cohere_v1, model, query, documents)
    print("-" * 50)
    print("rerank_v1_result:\n", rerank_v1_result)
    print("-" * 50)

    # or the v2
    cohere_v2 = cohere.ClientV2("sk-fake-key", base_url="http://localhost:8000")
    rerank_v2_result = cohere_rerank(cohere_v2, model, query, documents)
    print("rerank_v2_result:\n", rerank_v2_result)
    print("-" * 50)


if __name__ == "__main__":
    main()
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# ruff: noqa: E501

import argparse
import json

import torch
import transformers

# Usage:
# for BAAI/bge-reranker-v2-gemma
# Caution: "Yes" and "yes" are two different tokens
# python convert_model_to_seq_cls.py --model_name BAAI/bge-reranker-v2-gemma --classifier_from_tokens '["Yes"]' --method no_post_processing --path ./bge-reranker-v2-gemma-seq-cls
# for mxbai-rerank-v2
# python convert_model_to_seq_cls.py --model_name mixedbread-ai/mxbai-rerank-base-v2 --classifier_from_tokens '["0", "1"]' --method from_2_way_softmax --path ./mxbai-rerank-base-v2-seq-cls
# for Qwen3-Reranker
# python convert_model_to_seq_cls.py --model_name Qwen/Qwen3-Reranker-0.6B --classifier_from_tokens '["no", "yes"]' --method from_2_way_softmax --path ./Qwen3-Reranker-0.6B-seq-cls


def from_2_way_softmax(causal_lm, seq_cls_model, tokenizer, tokens, device):
    # refer to https://huggingface.co/Qwen/Qwen3-Reranker-0.6B/discussions/3
    assert len(tokens) == 2

    lm_head_weights = causal_lm.lm_head.weight

    false_id = tokenizer.convert_tokens_to_ids(tokens[0])
    true_id = tokenizer.convert_tokens_to_ids(tokens[1])

    score_weight = lm_head_weights[true_id].to(device).to(
        torch.float32
    ) - lm_head_weights[false_id].to(device).to(torch.float32)

    with torch.no_grad():
        seq_cls_model.score.weight.copy_(score_weight.unsqueeze(0))
        if seq_cls_model.score.bias is not None:
            seq_cls_model.score.bias.zero_()


def no_post_processing(causal_lm, seq_cls_model, tokenizer, tokens, device):
    lm_head_weights = causal_lm.lm_head.weight

    token_ids = [tokenizer.convert_tokens_to_ids(t) for t in tokens]

    score_weight = lm_head_weights[token_ids].to(device)

    with torch.no_grad():
        seq_cls_model.score.weight.copy_(score_weight)
        if seq_cls_model.score.bias is not None:
            seq_cls_model.score.bias.zero_()


method_map = {
    function.__name__: function for function in [from_2_way_softmax, no_post_processing]
}


def converting(
    model_name, classifier_from_tokens, path, method, use_pad_token=False, device="cpu"
):
    assert method in method_map

    if method == "from_2_way_softmax":
        assert len(classifier_from_tokens) == 2
        num_labels = 1
    else:
        num_labels = len(classifier_from_tokens)

    tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
    causal_lm = transformers.AutoModelForCausalLM.from_pretrained(
        model_name, device_map=device
    )

    seq_cls_model = transformers.AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=num_labels,
        ignore_mismatched_sizes=True,
        device_map=device,
    )

    method_map[method](
        causal_lm, seq_cls_model, tokenizer, classifier_from_tokens, device
    )

    # `llm as reranker` defaults to not using pad_token
    seq_cls_model.config.use_pad_token = use_pad_token
    seq_cls_model.config.pad_token_id = tokenizer.pad_token_id

    seq_cls_model.save_pretrained(path)
    tokenizer.save_pretrained(path)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Converting *ForCausalLM models to "
        "*ForSequenceClassification models."
    )
    parser.add_argument(
        "--model_name",
        type=str,
        default="BAAI/bge-reranker-v2-gemma",
        help="Model name",
    )
    parser.add_argument(
        "--classifier_from_tokens",
        type=str,
        default='["Yes"]',
        help="classifier from tokens",
    )
    parser.add_argument(
        "--method", type=str, default="no_post_processing", help="Converting converting"
    )
    parser.add_argument(
        "--use-pad-token", action="store_true", help="Whether to use pad_token"
    )
    parser.add_argument(
        "--path",
        type=str,
        default="./bge-reranker-v2-gemma-seq-cls",
        help="Path to save converted model",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    converting(
        model_name=args.model_name,
        classifier_from_tokens=json.loads(args.classifier_from_tokens),
        method=args.method,
        use_pad_token=args.use_pad_token,
        path=args.path,
    )
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# ruff: noqa: E501

import argparse
import json

import torch
import transformers

# Usage:
# for BAAI/bge-reranker-v2-gemma
# Caution: "Yes" and "yes" are two different tokens
# python convert_model_to_seq_cls.py --model_name BAAI/bge-reranker-v2-gemma --classifier_from_tokens '["Yes"]' --method no_post_processing --path ./bge-reranker-v2-gemma-seq-cls
# for mxbai-rerank-v2
# python convert_model_to_seq_cls.py --model_name mixedbread-ai/mxbai-rerank-base-v2 --classifier_from_tokens '["0", "1"]' --method from_2_way_softmax --path ./mxbai-rerank-base-v2-seq-cls
# for Qwen3-Reranker
# python convert_model_to_seq_cls.py --model_name Qwen/Qwen3-Reranker-0.6B --classifier_from_tokens '["no", "yes"]' --method from_2_way_softmax --path ./Qwen3-Reranker-0.6B-seq-cls


def from_2_way_softmax(causal_lm, seq_cls_model, tokenizer, tokens, device):
    # refer to https://huggingface.co/Qwen/Qwen3-Reranker-0.6B/discussions/3
    assert len(tokens) == 2

    lm_head_weights = causal_lm.lm_head.weight

    false_id = tokenizer.convert_tokens_to_ids(tokens[0])
    true_id = tokenizer.convert_tokens_to_ids(tokens[1])

    score_weight = lm_head_weights[true_id].to(device).to(
        torch.float32
    ) - lm_head_weights[false_id].to(device).to(torch.float32)

    with torch.no_grad():
        seq_cls_model.score.weight.copy_(score_weight.unsqueeze(0))
        if seq_cls_model.score.bias is not None:
            seq_cls_model.score.bias.zero_()


def no_post_processing(causal_lm, seq_cls_model, tokenizer, tokens, device):
    lm_head_weights = causal_lm.lm_head.weight

    token_ids = [tokenizer.convert_tokens_to_ids(t) for t in tokens]

    score_weight = lm_head_weights[token_ids].to(device)

    with torch.no_grad():
        seq_cls_model.score.weight.copy_(score_weight)
        if seq_cls_model.score.bias is not None:
            seq_cls_model.score.bias.zero_()


method_map = {
    function.__name__: function for function in [from_2_way_softmax, no_post_processing]
}


def converting(
    model_name, classifier_from_tokens, path, method, use_pad_token=False, device="cpu"
):
    assert method in method_map

    if method == "from_2_way_softmax":
        assert len(classifier_from_tokens) == 2
        num_labels = 1
    else:
        num_labels = len(classifier_from_tokens)

    tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
    causal_lm = transformers.AutoModelForCausalLM.from_pretrained(
        model_name, device_map=device
    )

    seq_cls_model = transformers.AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=num_labels,
        ignore_mismatched_sizes=True,
        device_map=device,
    )

    method_map[method](
        causal_lm, seq_cls_model, tokenizer, classifier_from_tokens, device
    )

    # `llm as reranker` defaults to not using pad_token
    seq_cls_model.config.use_pad_token = use_pad_token
    seq_cls_model.config.pad_token_id = tokenizer.pad_token_id

    seq_cls_model.save_pretrained(path)
    tokenizer.save_pretrained(path)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Converting *ForCausalLM models to "
        "*ForSequenceClassification models."
    )
    parser.add_argument(
        "--model_name",
        type=str,
        default="BAAI/bge-reranker-v2-gemma",
        help="Model name",
    )
    parser.add_argument(
        "--classifier_from_tokens",
        type=str,
        default='["Yes"]',
        help="classifier from tokens",
    )
    parser.add_argument(
        "--method", type=str, default="no_post_processing", help="Converting converting"
    )
    parser.add_argument(
        "--use-pad-token", action="store_true", help="Whether to use pad_token"
    )
    parser.add_argument(
        "--path",
        type=str,
        default="./bge-reranker-v2-gemma-seq-cls",
        help="Path to save converted model",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    converting(
        model_name=args.model_name,
        classifier_from_tokens=json.loads(args.classifier_from_tokens),
        method=args.method,
        use_pad_token=args.use_pad_token,
        path=args.path,
    )
```

---

## Speech-to-Text (Transcription/Translation) Support - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/model/transcription/

**Contents:**
- Speech-to-Text (Transcription/Translation) Support¶
- Update the base vLLM model¶
  - supported_languages and supports_transcription_only¶
    - Multimodal LLM with audio embeddings (e.g., Voxtral, Gemma3n)¶
    - Encoder–decoder audio-only (e.g., Whisper)¶
  - validate_language (optional)¶
  - get_num_audio_tokens (optional)¶
- Audio preprocessing and chunking¶
- Exposing tasks automatically¶
- Examples in-tree¶

This document walks you through the steps to add support for speech-to-text (ASR) models to vLLM’s transcription and translation APIs by implementing SupportsTranscription. Please refer to the supported models for further guidance.

It is assumed you have already implemented your model in vLLM according to the basic model guide. Extend your model with the SupportsTranscription interface and implement the following class attributes and methods.

Declare supported languages and capabilities:

Provide an ASR configuration via get_speech_to_text_config.

This is for controlling general behavior of the API when serving your model:

See Audio preprocessing and chunking for what each field controls.

Implement the prompt construction via get_generation_prompt. The server passes you the resampled waveform and task parameters; you return a valid PromptType. There are two common patterns:

Return a dict containing multi_modal_data with the audio, and either a prompt string or prompt_token_ids:

For further clarification on multi modal inputs, please refer to Multi-Modal Inputs.

Return a dict with separate encoder_prompt and decoder_prompt entries:

Language validation via validate_language

If your model requires a language and you want a default, override this method (see Whisper):

Token accounting for streaming via get_num_audio_tokens

Provide a fast duration→token estimate to improve streaming usage statistics:

The API server takes care of basic audio I/O and optional chunking before building prompts:

Relevant server logic:

vLLM automatically advertises transcription support if your model implements the interface:

When enabled, the server initializes the transcription and translation handlers:

No extra registration is required beyond having your model class available via the model registry and implementing SupportsTranscription.

Once your model implements SupportsTranscription, you can test the endpoints (API mimics OpenAI):

Translation (source → English unless otherwise supported):

Or check out more examples in examples/online_serving.

**Examples:**

Example 1 (python):
```python
from typing import ClassVar, Mapping, Literal
import numpy as np
import torch
from torch import nn

from vllm.config import ModelConfig, SpeechToTextConfig
from vllm.inputs.data import PromptType
from vllm.model_executor.models.interfaces import SupportsTranscription

class YourASRModel(nn.Module, SupportsTranscription):
    # Map of ISO 639-1 language codes to language names
    supported_languages: ClassVar[Mapping[str, str]] = {
        "en": "English",
        "it": "Italian",
        # ... add more as needed
    }

    # If your model only supports audio-conditioned generation
    # (no text-only generation), enable this flag.
    supports_transcription_only: ClassVar[bool] = True
```

Example 2 (python):
```python
from typing import ClassVar, Mapping, Literal
import numpy as np
import torch
from torch import nn

from vllm.config import ModelConfig, SpeechToTextConfig
from vllm.inputs.data import PromptType
from vllm.model_executor.models.interfaces import SupportsTranscription

class YourASRModel(nn.Module, SupportsTranscription):
    # Map of ISO 639-1 language codes to language names
    supported_languages: ClassVar[Mapping[str, str]] = {
        "en": "English",
        "it": "Italian",
        # ... add more as needed
    }

    # If your model only supports audio-conditioned generation
    # (no text-only generation), enable this flag.
    supports_transcription_only: ClassVar[bool] = True
```

Example 3 (python):
```python
class YourASRModel(nn.Module, SupportsTranscription):
    ...

    @classmethod
    def get_speech_to_text_config(
        cls,
        model_config: ModelConfig,
        task_type: Literal["transcribe", "translate"],
    ) -> SpeechToTextConfig:
        return SpeechToTextConfig(
            sample_rate=16_000,
            max_audio_clip_s=30,
            # Set to None to disable server-side chunking if your
            # model/processor handles it already
            min_energy_split_window_size=None,
        )
```

Example 4 (python):
```python
class YourASRModel(nn.Module, SupportsTranscription):
    ...

    @classmethod
    def get_speech_to_text_config(
        cls,
        model_config: ModelConfig,
        task_type: Literal["transcribe", "translate"],
    ) -> SpeechToTextConfig:
        return SpeechToTextConfig(
            sample_rate=16_000,
            max_audio_clip_s=30,
            # Set to None to disable server-side chunking if your
            # model/processor handles it already
            min_energy_split_window_size=None,
        )
```

---

## Summary - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/

**Contents:**
- Summary¶
- Configuration¶
- Offline Inference¶
- vLLM Engines¶
- Inference Parameters¶
- Multi-Modality¶
  - Inputs¶
  - Data Parsing¶
  - Data Processing¶
  - Memory Profiling¶

API documentation for vLLM's configuration classes.

Engine classes for offline and online inference.

Inference parameters for vLLM APIs.

vLLM provides experimental support for multi-modal models through the vllm.multimodal package.

Multi-modal inputs can be passed alongside text and token prompts to supported models via the multi_modal_data field in vllm.inputs.PromptType.

Looking to add your own multi-modal model? Please follow the instructions listed here.

Internal data structures.

---

## Supported Models - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/supported_models/

**Contents:**
- Supported Models¶
- Model Implementation¶
  - vLLM¶
  - Transformers¶
    - Custom models¶
    - Writing custom models¶
- Loading a Model¶
  - Hugging Face Hub¶
    - Download a model¶
    - List the downloaded models¶

vLLM supports generative and pooling models across various tasks.

For each task, we list the model architectures that have been implemented in vLLM. Alongside each architecture, we include some popular models that use it.

If vLLM natively supports a model, its implementation can be found in vllm/model_executor/models.

These models are what we list in supported text models and supported multimodal models.

vLLM also supports model implementations that are available in Transformers. You should expect the performance of a Transformers model implementation used in vLLM to be within <5% of the performance of a dedicated vLLM model implementation. We call this feature the "Transformers modeling backend".

Currently, the Transformers modeling backend works for the following:

*Vision-language models currently accept only image inputs. Support for video inputs will be added in a future release.

If the Transformers model implementation follows all the steps in writing a custom model then, when used with the Transformers modeling backend, it will be compatible with the following features of vLLM:

Checking if the modeling backend is Transformers is as simple as:

If the printed type starts with Transformers... then it's using the Transformers model implementation!

If a model has a vLLM implementation but you would prefer to use the Transformers implementation via the Transformers modeling backend, set model_impl="transformers" for offline inference or --model-impl transformers for the online serving.

For vision-language models, if you are loading with dtype="auto", vLLM loads the whole model with config's dtype if it exists. In contrast the native Transformers will respect the dtype attribute of each backbone in the model. That might cause a slight difference in performance.

If a model is neither supported natively by vLLM nor Transformers, it can still be used in vLLM!

For a model to be compatible with the Transformers modeling backend for vLLM it must:

If the compatible model is:

This means that, with the Transformers modeling backend for vLLM, new models can be used before they are officially supported in Transformers or vLLM!

This section details the necessary modifications to make to a Transformers compatible custom model that make it compatible with the Transformers modeling backend for vLLM. (We assume that a Transformers compatible custom model has already been created, see Transformers - Customizing models).

To make your model compatible with the Transformers modeling backend, it needs:

Here is what happens in the background when this model is loaded:

For your model to be compatible with vLLM's tensor parallel and/or pipeline parallel features, you must add base_model_tp_plan and/or base_model_pp_plan to your model's config class:

By default, vLLM loads models from Hugging Face (HF) Hub. To change the download path for models, you can set the HF_HOME environment variable; for more details, refer to their official documentation.

To determine whether a given model is natively supported, you can check the config.json file inside the HF repository. If the "architectures" field contains a model architecture listed below, then it should be natively supported.

Models do not need to be natively supported to be used in vLLM. The Transformers modeling backend enables you to run models directly using their Transformers implementation (or even remote code on the Hugging Face Model Hub!).

The easiest way to check if your model is really supported at runtime is to run the program below:

If vLLM successfully returns text (for generative models) or hidden states (for pooling models), it indicates that your model is supported.

Otherwise, please refer to Adding a New Model for instructions on how to implement your model in vLLM. Alternatively, you can open an issue on GitHub to request vLLM support.

If you prefer, you can use the Hugging Face CLI to download a model or specific files from a model repository:

Use the Hugging Face CLI to manage models stored in local cache:

Use the Hugging Face CLI to interactively delete downloaded model from the cache:

Here are some tips for loading/downloading models from Hugging Face using a proxy:

To use models from ModelScope instead of Hugging Face Hub, set an environment variable:

And use with trust_remote_code=True.

✅︎ indicates that the feature is supported for the model.

🚧 indicates that the feature is planned but not yet supported for the model.

⚠️ indicates that the feature is available but may have known issues or limitations.

See this page for more information on how to use generative models.

These models primarily accept the LLM.generate API. Chat/Instruct models additionally support the LLM.chat API.

Some models are supported only via the Transformers modeling backend. The purpose of the table below is to acknowledge models which we officially support in this way. The logs will say that the Transformers modeling backend is being used, and you will see no warning that this is fallback behaviour. This means that, if you have issues with any of the models listed below, please make an issue and we'll do our best to fix it!

Currently, the ROCm version of vLLM supports Mistral and Mixtral only for context lengths up to 4096.

See this page for more information on how to use pooling models.

Since some model architectures support both generative and pooling tasks, you should explicitly specify --runner pooling to ensure that the model is used in pooling mode instead of generative mode.

These models primarily support the LLM.embed API.

C Automatically converted into an embedding model via --convert embed. (details) * Feature support is the same as that of the original model.

ssmits/Qwen2-7B-Instruct-embed-base has an improperly defined Sentence Transformers config. You need to manually set mean pooling by passing --pooler-config '{"pooling_type": "MEAN"}'.

For Alibaba-NLP/gte-Qwen2-*, you need to enable --trust-remote-code for the correct tokenizer to be loaded. See relevant issue on HF Transformers.

jinaai/jina-embeddings-v3 supports multiple tasks through LoRA, while vllm temporarily only supports text-matching tasks by merging LoRA weights.

The second-generation GTE model (mGTE-TRM) is named NewModel. The name NewModel is too generic, you should set --hf-overrides '{"architectures": ["GteNewModel"]}' to specify the use of the GteNewModel architecture.

If your model is not in the above list, we will try to automatically convert the model using as_embedding_model. By default, the embeddings of the whole prompt are extracted from the normalized hidden state corresponding to the last token.

These models primarily support the LLM.classify API.

C Automatically converted into a classification model via --convert classify. (details) * Feature support is the same as that of the original model.

If your model is not in the above list, we will try to automatically convert the model using as_seq_cls_model. By default, the class probabilities are extracted from the softmaxed hidden state corresponding to the last token.

Cross-encoder and reranker models are a subset of classification models that accept two prompts as input. These models primarily support the LLM.score API.

C Automatically converted into a classification model via --convert classify. (details) * Feature support is the same as that of the original model.

Load the official original BAAI/bge-reranker-v2-gemma by using the following command.

The second-generation GTE model (mGTE-TRM) is named NewForSequenceClassification. The name NewForSequenceClassification is too generic, you should set --hf-overrides '{"architectures": ["GteNewForSequenceClassification"]}' to specify the use of the GteNewForSequenceClassification architecture.

nvidia/llama-nemotron-rerank-1b-v2 require a specific prompt format to work correctly.

Examples : offline_using_template.py online_using_template.py

Load the official original mxbai-rerank-v2 by using the following command.

Load the official original Qwen3 Reranker by using the following command. More information can be found at: examples/pooling/score/offline_reranker.py.

These models primarily support the LLM.reward API.

For process-supervised reward models such as peiyi9979/math-shepherd-mistral-7b-prm, the pooling config should be set explicitly, e.g.: --pooler-config '{"pooling_type": "STEP", "step_tag_id": 123, "returned_token_ids": [456, 789]}'.

These models primarily support the LLM.encode API.

Named Entity Recognition (NER) usage, please refer to examples/pooling/token_classify/ner.py, examples/pooling/token_classify/ner_client.py.

The following modalities are supported depending on the model:

Any combination of modalities joined by + are supported.

On the other hand, modalities separated by / are mutually exclusive.

See this page on how to pass multi-modal inputs to the model.

For hybrid-only models such as Llama-4, Step3 and Mistral-3, a text-only mode can be enabled by setting all supported multimodal modalities to 0 (e.g, --limit-mm-per-prompt '{"image":0}) so that their multimodal modules will not be loaded to free up more GPU memory for KV cache.

vLLM currently only supports dynamic LoRA adapters on the language backbone of multimodal models. If you wish to use a model with LoRA in the multi-modal encoder, please merge the weights into the base model first before running it in vLLM like a regular model.

See this page for more information on how to use generative models.

These models primarily accept the LLM.generate API. Chat/Instruct models additionally support the LLM.chat API.

Some models are supported only via the Transformers modeling backend. The purpose of the table below is to acknowledge models which we officially support in this way. The logs will say that the Transformers modeling backend is being used, and you will see no warning that this is fallback behaviour. This means that, if you have issues with any of the models listed below, please make an issue and we'll do our best to fix it!

^ You need to set the architecture name via --hf-overrides to match the one in vLLM. • For example, to use DeepSeek-VL2 series models: --hf-overrides '{"architectures": ["DeepseekVLV2ForCausalLM"]}' E Pre-computed embeddings can be inputted for this modality. + Multiple items can be inputted per text prompt for this modality.

Gemma3nForConditionalGeneration is only supported on V1 due to shared KV caching and it depends on timm>=1.0.17 to make use of its MobileNet-v5 vision backbone.

Performance is not yet fully optimized mainly due to:

For InternVLChatModel, only InternVL2.5 with Qwen2.5 text backbone (OpenGVLab/InternVL2.5-1B etc.), InternVL3 and InternVL3.5 have video inputs support currently.

To use TIGER-Lab/Mantis-8B-siglip-llama3, you have to pass --hf_overrides '{"architectures": ["MantisForConditionalGeneration"]}' when running vLLM.

The official openbmb/MiniCPM-V-2 doesn't work yet, so we need to use a fork (HwwwH/MiniCPM-V-2) for now. For more details, please see: Pull Request #4087

For Qwen2.5-Omni and Qwen3-Omni, reading audio from video pre-processing (--mm-processor-kwargs '{"use_audio_in_video": true}') is currently work in progress and not yet supported.

Speech2Text models trained specifically for Automatic Speech Recognition.

VoxtralForConditionalGeneration requires mistral-common[audio] to be installed.

See this page for more information on how to use pooling models.

These models primarily support the LLM.embed API.

To get the best results, you should use pooling models that are specifically trained as such.

The following table lists those that are tested in vLLM.

C Automatically converted into an embedding model via --convert embed. (details) * Feature support is the same as that of the original model.

Cross-encoder and reranker models are a subset of classification models that accept two prompts as input. These models primarily support the LLM.score API.

C Automatically converted into a classification model via --convert classify. (details) * Feature support is the same as that of the original model.

At vLLM, we are committed to facilitating the integration and support of third-party models within our ecosystem. Our approach is designed to balance the need for robustness and the practical limitations of supporting a wide range of models. Here’s how we manage third-party model support:

Community-Driven Support: We encourage community contributions for adding new models. When a user requests support for a new model, we welcome pull requests (PRs) from the community. These contributions are evaluated primarily on the sensibility of the output they generate, rather than strict consistency with existing implementations such as those in transformers. Call for contribution: PRs coming directly from model vendors are greatly appreciated!

Best-Effort Consistency: While we aim to maintain a level of consistency between the models implemented in vLLM and other frameworks like transformers, complete alignment is not always feasible. Factors like acceleration techniques and the use of low-precision computations can introduce discrepancies. Our commitment is to ensure that the implemented models are functional and produce sensible results.

When comparing the output of model.generate from Hugging Face Transformers with the output of llm.generate from vLLM, note that the former reads the model's generation config file (i.e., generation_config.json) and applies the default parameters for generation, while the latter only uses the parameters passed to the function. Ensure all sampling parameters are identical when comparing outputs.

Issue Resolution and Model Updates: Users are encouraged to report any bugs or issues they encounter with third-party models. Proposed fixes should be submitted via PRs, with a clear explanation of the problem and the rationale behind the proposed solution. If a fix for one model impacts another, we rely on the community to highlight and address these cross-model dependencies. Note: for bugfix PRs, it is good etiquette to inform the original author to seek their feedback.

Monitoring and Updates: Users interested in specific models should monitor the commit history for those models (e.g., by tracking changes in the main/vllm/model_executor/models directory). This proactive approach helps users stay informed about updates and changes that may affect the models they use.

Selective Focus: Our resources are primarily directed towards models with significant user interest and impact. Models that are less frequently used may receive less attention, and we rely on the community to play a more active role in their upkeep and improvement.

Through this approach, vLLM fosters a collaborative environment where both the core development team and the broader community contribute to the robustness and diversity of the third-party models supported in our ecosystem.

Note that, as an inference engine, vLLM does not introduce new models. Therefore, all models supported by vLLM are third-party models in this regard.

We have the following levels of testing for models:

**Examples:**

Example 1 (python):
```python
from vllm import LLM
llm = LLM(model=...)  # Name or path of your model
llm.apply_model(lambda model: print(type(model)))
```

Example 2 (python):
```python
from vllm import LLM
llm = LLM(model=...)  # Name or path of your model
llm.apply_model(lambda model: print(type(model)))
```

Example 3 (python):
```python
from transformers import PreTrainedModel
from torch import nn

class MyAttention(nn.Module):
    is_causal = False  # Only do this for encoder-only models

    def forward(self, hidden_states, **kwargs):
        ...
        attention_interface = ALL_ATTENTION_FUNCTIONS[self.config._attn_implementation]
        attn_output, attn_weights = attention_interface(
            self,
            query_states,
            key_states,
            value_states,
            **kwargs,
        )
        ...

# Only do this for mixture-of-experts models
class MyExperts(nn.ModuleList):
    def forward(self, hidden_states, top_k_index, top_k_weights):
        ...

# Only do this for mixture-of-experts models
class MySparseMoEBlock(nn.Module):
    def __init__(self, config):
        ...
        self.experts = MyExperts(config)
        ...

    def forward(self, hidden_states: torch.Tensor):
        ...
        hidden_states = self.experts(hidden_states, top_k_index, top_k_weights)
        ...

class MyModel(PreTrainedModel):
    _supports_attention_backend = True
```

Example 4 (python):
```python
from transformers import PreTrainedModel
from torch import nn

class MyAttention(nn.Module):
    is_causal = False  # Only do this for encoder-only models

    def forward(self, hidden_states, **kwargs):
        ...
        attention_interface = ALL_ATTENTION_FUNCTIONS[self.config._attn_implementation]
        attn_output, attn_weights = attention_interface(
            self,
            query_states,
            key_states,
            value_states,
            **kwargs,
        )
        ...

# Only do this for mixture-of-experts models
class MyExperts(nn.ModuleList):
    def forward(self, hidden_states, top_k_index, top_k_weights):
        ...

# Only do this for mixture-of-experts models
class MySparseMoEBlock(nn.Module):
    def __init__(self, config):
        ...
        self.experts = MyExperts(config)
        ...

    def forward(self, hidden_states: torch.Tensor):
        ...
        hidden_states = self.experts(hidden_states, top_k_index, top_k_weights)
        ...

class MyModel(PreTrainedModel):
    _supports_attention_backend = True
```

---

## Token Classify - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/token_classify/

**Contents:**
- Token Classify¶
- NER¶
- NER Client¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/token_classify.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# Adapted from https://huggingface.co/boltuix/NeuroBERT-NER

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="boltuix/NeuroBERT-NER",
        runner="pooling",
        enforce_eager=True,
        trust_remote_code=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Barack Obama visited Microsoft headquarters in Seattle on January 2025."
    ]

    # Create an LLM.
    llm = LLM(**vars(args))
    tokenizer = llm.get_tokenizer()
    label_map = llm.llm_engine.vllm_config.model_config.hf_config.id2label

    # Run inference
    outputs = llm.encode(prompts, pooling_task="token_classify")

    for prompt, output in zip(prompts, outputs):
        logits = output.outputs.data
        predictions = logits.argmax(dim=-1)

        # Map predictions to labels
        tokens = tokenizer.convert_ids_to_tokens(output.prompt_token_ids)
        labels = [label_map[p.item()] for p in predictions]

        # Print results
        for token, label in zip(tokens, labels):
            if token not in tokenizer.all_special_tokens:
                print(f"{token:15} → {label}")


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# Adapted from https://huggingface.co/boltuix/NeuroBERT-NER

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="boltuix/NeuroBERT-NER",
        runner="pooling",
        enforce_eager=True,
        trust_remote_code=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Barack Obama visited Microsoft headquarters in Seattle on January 2025."
    ]

    # Create an LLM.
    llm = LLM(**vars(args))
    tokenizer = llm.get_tokenizer()
    label_map = llm.llm_engine.vllm_config.model_config.hf_config.id2label

    # Run inference
    outputs = llm.encode(prompts, pooling_task="token_classify")

    for prompt, output in zip(prompts, outputs):
        logits = output.outputs.data
        predictions = logits.argmax(dim=-1)

        # Map predictions to labels
        tokens = tokenizer.convert_ids_to_tokens(output.prompt_token_ids)
        labels = [label_map[p.item()] for p in predictions]

        # Print results
        for token, label in zip(tokens, labels):
            if token not in tokenizer.all_special_tokens:
                print(f"{token:15} → {label}")


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# Adapted from https://huggingface.co/boltuix/NeuroBERT-NER

"""
Example online usage of Pooling API for Named Entity Recognition (NER).

Run `vllm serve <model> --runner pooling`
to start up the server in vLLM. e.g.

vllm serve boltuix/NeuroBERT-NER
"""

import argparse

import requests
import torch


def post_http_request(prompt: dict, api_url: str) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    response = requests.post(api_url, headers=headers, json=prompt)
    return response


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--model", type=str, default="boltuix/NeuroBERT-NER")

    return parser.parse_args()


def main(args):
    from transformers import AutoConfig, AutoTokenizer

    api_url = f"http://{args.host}:{args.port}/pooling"
    model_name = args.model

    # Load tokenizer and config
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    config = AutoConfig.from_pretrained(model_name)
    label_map = config.id2label

    # Input text
    text = "Barack Obama visited Microsoft headquarters in Seattle on January 2025."
    prompt = {"model": model_name, "input": text}

    pooling_response = post_http_request(prompt=prompt, api_url=api_url)

    # Run inference
    output = pooling_response.json()["data"][0]
    logits = torch.tensor(output["data"])
    predictions = logits.argmax(dim=-1)
    inputs = tokenizer(text, return_tensors="pt")

    # Map predictions to labels
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    labels = [label_map[p.item()] for p in predictions]
    assert len(tokens) == len(predictions)

    # Print results
    for token, label in zip(tokens, labels):
        if token not in tokenizer.all_special_tokens:
            print(f"{token:15} → {label}")


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# Adapted from https://huggingface.co/boltuix/NeuroBERT-NER

"""
Example online usage of Pooling API for Named Entity Recognition (NER).

Run `vllm serve <model> --runner pooling`
to start up the server in vLLM. e.g.

vllm serve boltuix/NeuroBERT-NER
"""

import argparse

import requests
import torch


def post_http_request(prompt: dict, api_url: str) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    response = requests.post(api_url, headers=headers, json=prompt)
    return response


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--model", type=str, default="boltuix/NeuroBERT-NER")

    return parser.parse_args()


def main(args):
    from transformers import AutoConfig, AutoTokenizer

    api_url = f"http://{args.host}:{args.port}/pooling"
    model_name = args.model

    # Load tokenizer and config
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    config = AutoConfig.from_pretrained(model_name)
    label_map = config.id2label

    # Input text
    text = "Barack Obama visited Microsoft headquarters in Seattle on January 2025."
    prompt = {"model": model_name, "input": text}

    pooling_response = post_http_request(prompt=prompt, api_url=api_url)

    # Run inference
    output = pooling_response.json()["data"][0]
    logits = torch.tensor(output["data"])
    predictions = logits.argmax(dim=-1)
    inputs = tokenizer(text, return_tensors="pt")

    # Map predictions to labels
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    labels = [label_map[p.item()] for p in predictions]
    assert len(tokens) == len(predictions)

    # Print results
    for token, label in zip(tokens, labels):
        if token not in tokenizer.all_special_tokens:
            print(f"{token:15} → {label}")


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## Token Embed - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/pooling/token_embed/

**Contents:**
- Token Embed¶
- Jina Embeddings V4¶
- Multi Vector Retrieval¶
- Multi Vector Retrieval Client¶

Source https://github.com/vllm-project/vllm/tree/main/examples/pooling/token_embed.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import torch

from vllm import LLM
from vllm.inputs.data import TextPrompt
from vllm.multimodal.utils import fetch_image

# Initialize model
model = LLM(
    model="jinaai/jina-embeddings-v4-vllm-text-matching",
    runner="pooling",
    max_model_len=1024,
    gpu_memory_utilization=0.8,
)

# Create text prompts
text1 = "Ein wunderschöner Sonnenuntergang am Strand"
text1_prompt = TextPrompt(prompt=f"Query: {text1}")

text2 = "浜辺に沈む美しい夕日"
text2_prompt = TextPrompt(prompt=f"Query: {text2}")

# Create image prompt
image = fetch_image(
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/eskimo.jpg"  # noqa: E501
)
image_prompt = TextPrompt(
    prompt="<|im_start|>user\n<|vision_start|><|image_pad|><|vision_end|>Describe the image.<|im_end|>\n",  # noqa: E501
    multi_modal_data={"image": image},
)

# Encode all prompts
prompts = [text1_prompt, text2_prompt, image_prompt]
outputs = model.encode(prompts, pooling_task="token_embed")


def get_embeddings(outputs):
    VISION_START_TOKEN_ID, VISION_END_TOKEN_ID = 151652, 151653

    embeddings = []
    for output in outputs:
        if VISION_START_TOKEN_ID in output.prompt_token_ids:
            # Gather only vision tokens
            img_start_pos = torch.where(
                torch.tensor(output.prompt_token_ids) == VISION_START_TOKEN_ID
            )[0][0]
            img_end_pos = torch.where(
                torch.tensor(output.prompt_token_ids) == VISION_END_TOKEN_ID
            )[0][0]
            embeddings_tensor = output.outputs.data.detach().clone()[
                img_start_pos : img_end_pos + 1
            ]
        else:
            # Use all tokens for text-only prompts
            embeddings_tensor = output.outputs.data.detach().clone()

        # Pool and normalize embeddings
        pooled_output = (
            embeddings_tensor.sum(dim=0, dtype=torch.float32)
            / embeddings_tensor.shape[0]
        )
        embeddings.append(torch.nn.functional.normalize(pooled_output, dim=-1))
    return embeddings


embeddings = get_embeddings(outputs)

for embedding in embeddings:
    print(embedding.shape)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import torch

from vllm import LLM
from vllm.inputs.data import TextPrompt
from vllm.multimodal.utils import fetch_image

# Initialize model
model = LLM(
    model="jinaai/jina-embeddings-v4-vllm-text-matching",
    runner="pooling",
    max_model_len=1024,
    gpu_memory_utilization=0.8,
)

# Create text prompts
text1 = "Ein wunderschöner Sonnenuntergang am Strand"
text1_prompt = TextPrompt(prompt=f"Query: {text1}")

text2 = "浜辺に沈む美しい夕日"
text2_prompt = TextPrompt(prompt=f"Query: {text2}")

# Create image prompt
image = fetch_image(
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/eskimo.jpg"  # noqa: E501
)
image_prompt = TextPrompt(
    prompt="<|im_start|>user\n<|vision_start|><|image_pad|><|vision_end|>Describe the image.<|im_end|>\n",  # noqa: E501
    multi_modal_data={"image": image},
)

# Encode all prompts
prompts = [text1_prompt, text2_prompt, image_prompt]
outputs = model.encode(prompts, pooling_task="token_embed")


def get_embeddings(outputs):
    VISION_START_TOKEN_ID, VISION_END_TOKEN_ID = 151652, 151653

    embeddings = []
    for output in outputs:
        if VISION_START_TOKEN_ID in output.prompt_token_ids:
            # Gather only vision tokens
            img_start_pos = torch.where(
                torch.tensor(output.prompt_token_ids) == VISION_START_TOKEN_ID
            )[0][0]
            img_end_pos = torch.where(
                torch.tensor(output.prompt_token_ids) == VISION_END_TOKEN_ID
            )[0][0]
            embeddings_tensor = output.outputs.data.detach().clone()[
                img_start_pos : img_end_pos + 1
            ]
        else:
            # Use all tokens for text-only prompts
            embeddings_tensor = output.outputs.data.detach().clone()

        # Pool and normalize embeddings
        pooled_output = (
            embeddings_tensor.sum(dim=0, dtype=torch.float32)
            / embeddings_tensor.shape[0]
        )
        embeddings.append(torch.nn.functional.normalize(pooled_output, dim=-1))
    return embeddings


embeddings = get_embeddings(outputs)

for embedding in embeddings:
    print(embedding.shape)
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="BAAI/bge-m3",
        runner="pooling",
        enforce_eager=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Hello, my name is",
        "The president of the United States is",
        "The capital of France is",
        "The future of AI is",
    ]

    # Create an LLM.
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    outputs = llm.embed(prompts)

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        print(len(embeds))

    # Generate embedding for each token. The output is a list of PoolingRequestOutput.
    outputs = llm.encode(prompts, pooling_task="token_embed")

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for prompt, output in zip(prompts, outputs):
        multi_vector = output.outputs.data
        print(multi_vector.shape)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="BAAI/bge-m3",
        runner="pooling",
        enforce_eager=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Hello, my name is",
        "The president of the United States is",
        "The capital of France is",
        "The future of AI is",
    ]

    # Create an LLM.
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    outputs = llm.embed(prompts)

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        print(len(embeds))

    # Generate embedding for each token. The output is a list of PoolingRequestOutput.
    outputs = llm.encode(prompts, pooling_task="token_embed")

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for prompt, output in zip(prompts, outputs):
        multi_vector = output.outputs.data
        print(multi_vector.shape)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## Unit Testing - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/model/tests/

**Contents:**
- Unit Testing¶
- Required Tests¶
  - Model loading¶
- Optional Tests¶
  - Model correctness¶
    - Generative models¶
    - Pooling models¶
  - Multi-modal processing¶
    - Common tests¶
    - Model-specific tests¶

This page explains how to write unit tests to verify the implementation of your model.

These tests are necessary to get your PR merged into vLLM library. Without them, the CI for your PR will fail.

Include an example HuggingFace repository for your model in tests/models/registry.py. This enables a unit test that loads dummy weights to ensure that the model can be initialized in vLLM.

The list of models in each section should be maintained in alphabetical order.

If your model requires a development version of HF Transformers, you can set min_transformers_version to skip the test in CI until the model is released.

These tests are optional to get your PR merged into vLLM library. Passing these tests provides more confidence that your implementation is correct, and helps avoid future regressions.

These tests compare the model outputs of vLLM against HF Transformers. You can add new tests under the subdirectories of tests/models.

For generative models, there are two levels of correctness tests, as defined in tests/models/utils.py:

For pooling models, we simply check the cosine similarity, as defined in tests/models/utils.py.

Adding your model to tests/models/multimodal/processing/test_common.py verifies that the following input combinations result in the same outputs:

You can add a new file under tests/models/multimodal/processing to run tests that only apply to your model.

For example, if the HF processor for your model accepts user-specified keyword arguments, you can verify that the keyword arguments are being applied correctly, such as in tests/models/multimodal/processing/test_phi3v.py.

---

## vit_attn_wrappers - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/attention/ops/vit_attn_wrappers/

**Contents:**
- vllm.attention.ops.vit_attn_wrappers ¶
- apply_sdpa ¶
- flash_attn_maxseqlen_wrapper ¶
- flash_attn_maxseqlen_wrapper_fake ¶
- torch_sdpa_wrapper ¶
- torch_sdpa_wrapper_fake ¶
- vit_flash_attn_wrapper ¶
- vit_torch_sdpa_wrapper ¶

This file contains ops for ViT attention to be compatible with torch.compile as there are operations here not supported by torch.compile (for instance, .item() in flash attention)

Using these ops and wrapping vision blocks with torch.compile can speed up throughput in vision models by ~5% relative on H100, and improve token latencies by ~7% (see qwen2_5_vl for example usage)

To use these ops, you must have a recent version of PyTorch installed (>= 2.4.0)

Input shape: (batch_size x seq_len x num_heads x head_size)

**Examples:**

Example 1 (php):
```php
apply_sdpa(q: Tensor, k: Tensor, v: Tensor) -> Tensor
```

Example 2 (php):
```php
apply_sdpa(q: Tensor, k: Tensor, v: Tensor) -> Tensor
```

Example 3 (unknown):
```unknown
108
109
110
111
112
113
114
115
116
```

Example 4 (python):
```python
def apply_sdpa(q: torch.Tensor, k: torch.Tensor, v: torch.Tensor) -> torch.Tensor:
    """
    Input shape:
    (batch_size x seq_len x num_heads x head_size)
    """
    q, k, v = (einops.rearrange(x, "b s h d -> b h s d") for x in [q, k, v])
    output = F.scaled_dot_product_attention(q, k, v, dropout_p=0.0)
    output = einops.rearrange(output, "b h s d -> b s h d ")
    return output
```

---

## vLLM V1 - vLLM

**URL:** https://docs.vllm.ai/en/latest/usage/v1_guide/

**Contents:**
- vLLM V1¶
- Differences from V0¶
  - Chunked Prefill¶
  - CUDA Graphs¶
  - Semantic Changes to Logprobs¶
    - Logprobs Calculation¶
    - Prompt Logprobs with Prefix Caching¶
- Feature Support¶
  - Hardware¶
  - Models¶

We have fully deprecated V0. Please read RFC #18571 for more details.

If you have a use case that works on V0 Engine but not V1, please share it on GitHub or in the vLLM Slack.

vLLM V0 successfully supported a wide range of models and hardware, but as new features were developed independently, the system grew increasingly complex. This complexity made it harder to integrate new capabilities and introduced technical debt, revealing the need for a more streamlined and unified design.

Building on V0’s success, vLLM V1 retains the stable and proven components from V0 (such as the models, GPU kernels, and utilities). At the same time, it significantly re-architects the core systems, covering the scheduler, KV cache manager, worker, sampler, and API server, to provide a cohesive, maintainable framework that better accommodates continued growth and innovation.

Specifically, V1 aims to:

We see significant performance improvements from upgrading to V1 core engine, in particular for long context scenarios. Please see performance benchmark (To be added).

For more details, check out the vLLM V1 blog post vLLM V1: A Major Upgrade to vLLM’s Core Architecture (published Jan 27, 2025).

This living user guide outlines a few known important changes and limitations introduced by vLLM V1. The team has been working actively to bring V1 as the default engine, therefore this guide will be updated constantly as more features get supported on vLLM V1.

This section lists some differences in behavior between V0 and V1.

Chunked prefill is enabled by default whenever possible, unlike in V0 where it was conditionally enabled based on model characteristics.

CUDA graph capture takes up more memory in V1 than in V0.

By default, logprobs in V1 are now returned immediately once computed from the model’s raw output (i.e. before applying any logits post-processing such as temperature scaling or penalty adjustments). As a result, the returned logprobs do not reflect the final adjusted probabilities used during sampling.

You can adjust this behavior by setting the --logprobs-mode flag. Four modes are supported: raw_logprobs (default), processed_logprobs, raw_logits, processed_logits. Raw means the values before applying any logit processors, like bad words. Processed means the values after applying all processors, including temperature and top_k/top_p.

While V1 supports passing prompt logprobs with prefix caching enabled, it no longer caches the logprobs. For a request requiring prompt logprobs, the engine will ignore the prefix cache and recompute the prefill of full prompt to generate the logprobs.

For each item, its support in vLLM V1 falls into one of the following states:

vLLM V1’s unified scheduler treats both prompt and output tokens the same way by using a simple dictionary (e.g., {request_id: num_tokens}) to dynamically allocate a fixed token budget per request, enabling features like chunked prefills, prefix caching, and speculative decoding without a strict separation between prefill and decode phases.

The V1 scheduler supports multiple scheduling policies, including First-Come, First-Served (FCFS) and priority-based scheduling (where requests are processed based on assigned priority, with FCFS as a tie-breaker), configurable via the --scheduling-policy argument.

More hardware platforms may be supported via plugins, e.g.:

Please check their corresponding repositories for more details.

See below for the status of models that are not yet supported or have more features planned in V1.

Now fully supported, with prefix caching and chunked prefill newly available for last-pooling models.

We are working on enabling prefix caching and chunked prefill for more categories of pooling models.

Models using selective state-space mechanisms instead of standard transformer attention are supported. Models that use Mamba-2 and Mamba-1 layers (e.g., Mamba2ForCausalLM, MambaForCausalLM,FalconMambaForCausalLM) are supported.

Hybrid models that combine Mamba-2 and Mamba-1 layers with standard attention layers are also supported (e.g., BambaForCausalLM, Zamba2ForCausalLM, NemotronHForCausalLM, FalconH1ForCausalLM and GraniteMoeHybridForCausalLM, JambaForCausalLM, Plamo2ForCausalLM).

Hybrid models with mechanisms different to Mamba are also supported (e.g, MiniMaxText01ForCausalLM, MiniMaxM1ForCausalLM, Lfm2ForCausalLM).

Please note that prefix caching is not yet supported for any of the above models.

Whisper is supported. Other models requiring cross-attention between separate encoder and decoder (e.g., BartForConditionalGeneration, MllamaForConditionalGeneration) are no longer supported.

vLLM V1’s unified scheduler treats both prompt and output tokens the same way by using a simple dictionary (e.g., {request_id: num_tokens}) to dynamically allocate a fixed token budget per request, enabling features like chunked prefills, prefix caching, and speculative decoding without a strict separation between prefill and decode phases.

As part of the major architectural rework in vLLM V1, several legacy features have been removed.

---

## XPU - Intel® GPUs - vLLM

**URL:** https://docs.vllm.ai/en/latest/models/hardware_supported_models/xpu/

**Contents:**
- XPU - Intel® GPUs¶
- Validated Hardware¶
- Supported Models¶
  - Text-only Language Models¶
  - Multimodal Language Models¶
  - Embedding and Reranker Language Models¶

✅ Runs and optimized. 🟨 Runs and correct but not optimized to green yet. ❌ Does not pass accuracy test or does not run.

---
