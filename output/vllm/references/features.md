# Vllm - Features

**Pages:** 44

---

## AMD Quark - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/quark/

**Contents:**
- AMD Quark¶
- Quark Installation¶
- Quantization Process¶
  - 1. Load the Model¶
  - 2. Prepare the Calibration Dataloader¶
  - 3. Set the Quantization Configuration¶
  - 4. Quantize the Model and Export¶
  - 5. Evaluation in vLLM¶
- Quark Quantization Script¶
- Using OCP MX (MXFP4, MXFP6) models¶

Quantization can effectively reduce memory and bandwidth usage, accelerate computation and improve throughput while with minimal accuracy loss. vLLM can leverage Quark, the flexible and powerful quantization toolkit, to produce performant quantized models to run on AMD GPUs. Quark has specialized support for quantizing large language models with weight, activation and kv-cache quantization and cutting-edge quantization algorithms like AWQ, GPTQ, Rotation and SmoothQuant.

Before quantizing models, you need to install Quark. The latest release of Quark can be installed with pip:

You can refer to Quark installation guide for more installation details.

Additionally, install vllm and lm-evaluation-harness for evaluation:

After installing Quark, we will use an example to illustrate how to use Quark. The Quark quantization process can be listed for 5 steps as below:

Quark uses Transformers to fetch model and tokenizer.

Quark uses the PyTorch Dataloader to load calibration data. For more details about how to use calibration datasets efficiently, please refer to Adding Calibration Datasets.

We need to set the quantization configuration, you can check quark config guide for further details. Here we use FP8 per-tensor quantization on weight, activation, kv-cache and the quantization algorithm is AutoSmoothQuant.

Note the quantization algorithm needs a JSON config file and the config file is located in Quark Pytorch examples, under the directory examples/torch/language_modeling/llm_ptq/models. For example, AutoSmoothQuant config file for Llama is examples/torch/language_modeling/llm_ptq/models/llama/autosmoothquant_config.json.

Then we can apply the quantization. After quantizing, we need to freeze the quantized model first before exporting. Note that we need to export model with format of HuggingFace safetensors, you can refer to HuggingFace format exporting for more exporting format details.

Now, you can load and run the Quark quantized model directly through the LLM entrypoint:

Or, you can use lm_eval to evaluate accuracy:

In addition to the example of Python API above, Quark also offers a quantization script to quantize large language models more conveniently. It supports quantizing models with variety of different quantization schemes and optimization algorithms. It can export the quantized model and run evaluation tasks on the fly. With the script, the example above can be:

vLLM supports loading MXFP4 and MXFP6 models quantized offline through AMD Quark, compliant with Open Compute Project (OCP) specification.

The scheme currently only supports dynamic quantization for activations.

Example usage, after installing the latest AMD Quark release:

A simulation of the matrix multiplication execution in MXFP4/MXFP6 can be run on devices that do not support OCP MX operations natively (e.g. AMD Instinct MI325, MI300 and MI250), dequantizing weights from FP4/FP6 to half precision on the fly, using a fused kernel. This is useful e.g. to evaluate FP4/FP6 models using vLLM, or alternatively to benefit from the ~2.5-4x memory savings (compared to float16 and bfloat16).

To generate offline models quantized using MXFP4 data type, the easiest approach is to use AMD Quark's quantization script, as an example:

The current integration supports all combination of FP4, FP6_E3M2, FP6_E2M3 used for either weights or activations.

vLLM also supports loading layerwise mixed precision model quantized using AMD Quark. Currently, mixed scheme of {MXFP4, FP8} is supported, where FP8 here denotes for FP8 per-tensor scheme. More mixed precision schemes are planned to be supported in a near future, including

Although one can maximize serving throughput using the lowest precision supported on a given device (e.g. MXFP4 for AMD Instinct MI355, FP8 for AMD Instinct MI300), these aggressive schemes can be detrimental to accuracy recovering from quantization on target tasks. Mixed precision allows to strike a balance between maximizing accuracy and throughput.

There are two steps to generate and deploy a mixed precision model quantized with AMD Quark, as shown below.

Firstly, the layerwise mixed-precision configuration for a given LLM model is searched and then quantized using AMD Quark. We will provide a detailed tutorial with Quark APIs later.

As examples, we provide some ready-to-use quantized mixed precision model to show the usage in vLLM and the accuracy benefits. They are:

Models quantized with AMD Quark using mixed precision can natively be reload in vLLM, and e.g. evaluated using lm-evaluation-harness as follows:

**Examples:**

Example 1 (unknown):
```unknown
pip install amd-quark
```

Example 2 (unknown):
```unknown
pip install amd-quark
```

Example 3 (unknown):
```unknown
pip install vllm "lm-eval[api]>=0.4.9.2"
```

Example 4 (unknown):
```unknown
pip install vllm "lm-eval[api]>=0.4.9.2"
```

---

## AutoAWQ - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/auto_awq/

**Contents:**
- AutoAWQ¶

⚠️ Warning: The AutoAWQ library is deprecated. This functionality has been adopted by the vLLM project in llm-compressor. For the recommended quantization workflow, please see the AWQ examples in llm-compressor. For more details on the deprecation, refer to the original AutoAWQ repository.

To create a new 4-bit quantized model, you can leverage AutoAWQ. Quantization reduces the model's precision from BF16/FP16 to INT4 which effectively reduces the total model memory footprint. The main benefits are lower latency and memory usage.

You can quantize your own models by installing AutoAWQ or picking one of the 6500+ models on Huggingface.

After installing AutoAWQ, you are ready to quantize a model. Please refer to the AutoAWQ documentation for further details. Here is an example of how to quantize mistralai/Mistral-7B-Instruct-v0.2:

To run an AWQ model with vLLM, you can use TheBloke/Llama-2-7b-Chat-AWQ with the following command:

AWQ models are also supported directly through the LLM entrypoint:

**Examples:**

Example 1 (unknown):
```unknown
pip install autoawq
```

Example 2 (unknown):
```unknown
pip install autoawq
```

Example 3 (python):
```python
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model_path = "mistralai/Mistral-7B-Instruct-v0.2"
quant_path = "mistral-instruct-v0.2-awq"
quant_config = {"zero_point": True, "q_group_size": 128, "w_bit": 4, "version": "GEMM"}

# Load model
model = AutoAWQForCausalLM.from_pretrained(
    model_path,
    low_cpu_mem_usage=True,
    use_cache=False,
)
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

# Quantize
model.quantize(tokenizer, quant_config=quant_config)

# Save quantized model
model.save_quantized(quant_path)
tokenizer.save_pretrained(quant_path)

print(f'Model is quantized and saved at "{quant_path}"')
```

Example 4 (python):
```python
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model_path = "mistralai/Mistral-7B-Instruct-v0.2"
quant_path = "mistral-instruct-v0.2-awq"
quant_config = {"zero_point": True, "q_group_size": 128, "w_bit": 4, "version": "GEMM"}

# Load model
model = AutoAWQForCausalLM.from_pretrained(
    model_path,
    low_cpu_mem_usage=True,
    use_cache=False,
)
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

# Quantize
model.quantize(tokenizer, quant_config=quant_config)

# Save quantized model
model.save_quantized(quant_path)
tokenizer.save_pretrained(quant_path)

print(f'Model is quantized and saved at "{quant_path}"')
```

---

## Automatic Prefix Caching - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/

**Contents:**
- Automatic Prefix Caching¶
- Introduction¶
- Enabling APC in vLLM¶
- Example workloads¶
- Limits¶

Automatic Prefix Caching (APC in short) caches the KV cache of existing queries, so that a new query can directly reuse the KV cache if it shares the same prefix with one of the existing queries, allowing the new query to skip the computation of the shared part.

Technical details on how vLLM implements APC can be found here.

Set enable_prefix_caching=True in vLLM engine to enable APC. Here is an example:

examples/offline_inference/automatic_prefix_caching.py

We describe two example workloads, where APC can provide huge performance benefit:

APC in general does not reduce the performance of vLLM. With that being said, APC only reduces the time of processing the queries (the prefilling phase) and does not reduce the time of generating new tokens (the decoding phase). So APC does not bring performance gain when vLLM spends most of the time generating answers to the queries (e.g. when the length of the answer is long), or new queries do not share the same prefix with any of existing queries (so that the computation cannot be reused).

---

## AutoRound - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/auto_round/

**Contents:**
- AutoRound¶
- Installation¶
- Quantizing a model¶
  - CLI usage¶
  - API usage¶
- Running a quantized model with vLLM¶
- Acknowledgement¶

AutoRound is Intel’s advanced quantization algorithm designed to produce highly efficient INT2, INT3, INT4, and INT8 quantized large language models—striking an optimal balance between accuracy and deployment performance.

AutoRound applies weight-only quantization to transformer-based models, enabling significant memory savings and faster inference while maintaining near-original accuracy. It supports a wide range of hardware platforms, including CPUs, Intel GPUs, HPUs, and CUDA-enabled devices.

Please refer to the AutoRound guide for more details.

✅ AutoRound, AutoAWQ, AutoGPTQ, and GGUF are supported

✅ 10+ vision-language models (VLMs) are supported

✅ Per-layer mixed-bit quantization for fine-grained control

✅ RTN (Round-To-Nearest) mode for quick quantization with slight accuracy loss

✅ Multiple quantization recipes: best, base, and light

✅ Advanced utilities such as immediate packing and support for 10+ backends

For VLMs, please change to auto-round-mllm in CLI usage and AutoRoundMLLM in API usage.

Here is some example code to run auto-round format in vLLM:

Special thanks to open-source low precision libraries such as AutoGPTQ, AutoAWQ, GPTQModel, Triton, Marlin, and ExLLaMAV2 for providing low-precision CUDA kernels, which are leveraged in AutoRound.

**Examples:**

Example 1 (unknown):
```unknown
uv pip install auto-round
```

Example 2 (unknown):
```unknown
uv pip install auto-round
```

Example 3 (unknown):
```unknown
auto-round \
    --model Qwen/Qwen3-0.6B \
    --bits 4 \
    --group_size 128 \
    --format "auto_round" \
    --output_dir ./tmp_autoround
```

Example 4 (unknown):
```unknown
auto-round \
    --model Qwen/Qwen3-0.6B \
    --bits 4 \
    --group_size 128 \
    --format "auto_round" \
    --output_dir ./tmp_autoround
```

---

## Batch Invariance - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/batch_invariance/

**Contents:**
- Batch Invariance¶
- Motivation¶
- Hardware Requirements¶
- Enabling Batch Invariance¶
  - Online Inference (Server Mode)¶
  - Offline Inference¶
- Tested Models¶
- Implementation Details¶
- Future Improvements¶

Batch invariance is currently in beta. Some features are still under active development. Track progress and planned improvements at Issue #27433

This document shows how to enable batch invariance in vLLM. Batch invariance ensures that the output of a model is deterministic and independent of the batch size or the order of requests in a batch.

Batch invariance is crucial for several use cases:

Batch invariance currently requires NVIDIA GPUs with compute capability 9.0 or higher:

Batch invariance can be enabled by setting the VLLM_BATCH_INVARIANT environment variable to 1:

To start a vLLM server with batch invariance enabled:

Then use the OpenAI-compatible client:

For offline batch inference with batch invariance:

Batch invariance has been tested and verified on the following models:

Other models may also work, but these have been explicitly validated. If you encounter issues with a specific model, please report them on the GitHub issue tracker.

When batch invariance is enabled, vLLM:

Enabling batch invariance may impact performance compared to the default non-deterministic mode. This trade-off is intentional to guarantee reproducibility.

The batch invariance feature is under active development. Planned improvements include:

For the latest status and to contribute ideas, see the tracking issue.

**Examples:**

Example 1 (unknown):
```unknown
export VLLM_BATCH_INVARIANT=1
```

Example 2 (unknown):
```unknown
export VLLM_BATCH_INVARIANT=1
```

Example 3 (unknown):
```unknown
VLLM_BATCH_INVARIANT=1 vllm serve meta-llama/Llama-3.1-8B-Instruct
```

Example 4 (unknown):
```unknown
VLLM_BATCH_INVARIANT=1 vllm serve meta-llama/Llama-3.1-8B-Instruct
```

---

## BitBLAS - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/bitblas/

**Contents:**
- BitBLAS¶
- Read bitblas format checkpoint¶
- Read gptq format checkpoint¶

vLLM now supports BitBLAS for more efficient and flexible model inference. Compared to other quantization frameworks, BitBLAS provides more precision combinations.

Ensure your hardware supports the selected dtype (torch.bfloat16 or torch.float16). Most recent NVIDIA GPUs support float16, while bfloat16 is more common on newer architectures like Ampere or Hopper. For details see supported hardware.

Below are the steps to utilize BitBLAS with vLLM.

vLLM reads the model's config file and supports pre-quantized checkpoints.

You can find pre-quantized models on:

Usually, these repositories have a quantize_config.json file that includes a quantization_config section.

**Examples:**

Example 1 (unknown):
```unknown
pip install bitblas>=0.1.0
```

Example 2 (unknown):
```unknown
pip install bitblas>=0.1.0
```

Example 3 (python):
```python
from vllm import LLM
import torch

# "hxbgsyxh/llama-13b-4bit-g-1-bitblas" is a pre-quantized checkpoint.
model_id = "hxbgsyxh/llama-13b-4bit-g-1-bitblas"
llm = LLM(
    model=model_id,
    dtype=torch.bfloat16,
    trust_remote_code=True,
    quantization="bitblas",
)
```

Example 4 (python):
```python
from vllm import LLM
import torch

# "hxbgsyxh/llama-13b-4bit-g-1-bitblas" is a pre-quantized checkpoint.
model_id = "hxbgsyxh/llama-13b-4bit-g-1-bitblas"
llm = LLM(
    model=model_id,
    dtype=torch.bfloat16,
    trust_remote_code=True,
    quantization="bitblas",
)
```

---

## BitsAndBytes - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/bnb/

**Contents:**
- BitsAndBytes¶
- Read quantized checkpoint¶
- Inflight quantization: load as 4bit quantization¶
- OpenAI Compatible Server¶

vLLM now supports BitsAndBytes for more efficient model inference. BitsAndBytes quantizes models to reduce memory usage and enhance performance without significantly sacrificing accuracy. Compared to other quantization methods, BitsAndBytes eliminates the need for calibrating the quantized model with input data.

Below are the steps to utilize BitsAndBytes with vLLM.

vLLM reads the model's config file and supports both in-flight quantization and pre-quantized checkpoint.

You can find bitsandbytes quantized models on Hugging Face. And usually, these repositories have a config.json file that includes a quantization_config section.

For pre-quantized checkpoints, vLLM will try to infer the quantization method from the config file, so you don't need to explicitly specify the quantization argument.

For inflight 4bit quantization with BitsAndBytes, you need to explicitly specify the quantization argument.

Append the following to your model arguments for 4bit inflight quantization:

**Examples:**

Example 1 (unknown):
```unknown
pip install bitsandbytes>=0.46.1
```

Example 2 (unknown):
```unknown
pip install bitsandbytes>=0.46.1
```

Example 3 (python):
```python
from vllm import LLM
import torch
# unsloth/tinyllama-bnb-4bit is a pre-quantized checkpoint.
model_id = "unsloth/tinyllama-bnb-4bit"
llm = LLM(
    model=model_id,
    dtype=torch.bfloat16,
    trust_remote_code=True,
)
```

Example 4 (python):
```python
from vllm import LLM
import torch
# unsloth/tinyllama-bnb-4bit is a pre-quantized checkpoint.
model_id = "unsloth/tinyllama-bnb-4bit"
llm = LLM(
    model=model_id,
    dtype=torch.bfloat16,
    trust_remote_code=True,
)
```

---

## Custom Arguments - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/custom_arguments/

**Contents:**
- Custom Arguments¶
- Offline Custom Arguments¶
- Online Custom Arguments¶

You can use vLLM custom arguments to pass in arguments which are not part of the vLLM SamplingParams and REST API specifications. Adding or removing a vLLM custom argument does not require recompiling vLLM, since the custom arguments are passed in as a dictionary.

Custom arguments can be useful if, for example, you want to use a custom logits processor without modifying the vLLM source code.

Make sure your custom logits processor have implemented validate_params for custom arguments. Otherwise, invalid custom arguments can cause unexpected behaviour.

Custom arguments passed to SamplingParams.extra_args as a dict will be visible to any code which has access to SamplingParams:

This allows arguments which are not already part of SamplingParams to be passed into LLM as part of a request.

The vLLM REST API allows custom arguments to be passed to the vLLM server via vllm_xargs. The example below integrates custom arguments into a vLLM REST API request:

Furthermore, OpenAI SDK users can access vllm_xargs via the extra_body argument:

vllm_xargs is assigned to SamplingParams.extra_args under the hood, so code which uses SamplingParams.extra_args is compatible with both offline and online scenarios.

**Examples:**

Example 1 (json):
```json
SamplingParams(extra_args={"your_custom_arg_name": 67})
```

Example 2 (json):
```json
SamplingParams(extra_args={"your_custom_arg_name": 67})
```

Example 3 (json):
```json
curl http://localhost:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen2.5-1.5B-Instruct",
        ...
        "vllm_xargs": {"your_custom_arg": 67}
    }'
```

Example 4 (json):
```json
curl http://localhost:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen2.5-1.5B-Instruct",
        ...
        "vllm_xargs": {"your_custom_arg": 67}
    }'
```

---

## Custom Logits Processors - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/custom_logitsprocs/

**Contents:**
- Custom Logits Processors¶
- Logits Processors Background¶
- Creating a Custom Logits Processor¶
  - How the vLLM engine builds the BatchUpdate data structure¶
  - Passing Custom Argument to a Custom Logits Processor¶
  - Example Custom Logits Processor Implementation¶
  - Wrapping an Existing Request-Level Logits Processor¶
- Ways to Load Your Custom Logits Processor in vLLM¶
  - Method 1: Pass the Custom Logits Processor Fully-Qualified Class Name (FQCN) to vLLM at Initialization Time¶
  - Method 2: Automatically Detect Custom Logits Processors Installed in Your Python Environment As Entry Points¶

Some logits processors design changes are still in progress and the API may change in the near future. We hope to stabilize this part of the API soon

A "custom" logits processor is written by a user of vLLM and is loaded into vLLM at initialization without needing to modify or recompile the vLLM source code. It is the opposite of a built-in logits processor.

This document shows how to write, load and use a custom logits processor.

A logits processor adjusts the next-token probability distribution, usually with the intention of steering the model towards a desired type of behavior.

In vLLM, logits processors operate at batch granularity. During a given engine step, the logits processor consumes a (num_requests) x (vocab_size) tensor of raw logits output by the model. For all requests which enable the logits processor, the logits processor applies a transformation to the corresponding row of the logits tensor, while leaving other rows unmodified. The transformed logits tensor is then passed to softmax.

Custom logits processors must subclass vllm.v1.sample.logits_processor.LogitsProcessor and define (at minimum) the following methods:

validate_params(cls, sampling_params: SamplingParams):

__init__(self, vllm_config: VllmConfig, device: torch.device, is_pin_memory: bool)

apply(self, logits: torch.Tensor) -> torch.Tensor:

is_argmax_invariant(self) -> bool:

update_state(self, batch_update: Optional["BatchUpdate"]) -> None:

Some logits processors design changes are still in progress. We expect that in the future you will not need to account for batch state changes when implementing a logits processor, and the information in this section will become irrelevant.

Logits processor update_state() implementations should assume the following model for how the model runner updates persistent batch state (expressed here in terms of the BatchUpdate abstraction):

Identify indices of requests which finished in the current engine step

Identify new requests introduced in the current step

Use Add operations to replace as many finished requests with new requests, in order of increasing index of the replaced request starting with the lowest index

Based on the relative number of new and finished requests:

If the numbers of new and finished requests are the same, proceed to next step

If there are more new requests than finished requests: apply Add operations to extend the batch with the remaining new requests which did not replace finished requests. Assign consecutive indices to these new requests, starting with current_max_batch_index + 1

If there are fewer new requests than finished requests:

Apply Remove operations to finished requests which were not replaced with new requests. These removed request indices will necessarily be greater than the greatest index of the finished requests which were replaced in the previous step. The Removes may leave the batch in a non-contiguous state

"Condense" the batch to be contiguous: starting with the lowest-index empty slot (which was caused by a Remove), apply a Unidirectional Move from the current highest non-empty slot in the batch to fill the empty slot. Proceed with additional Unidirectional Move operations in order of increasing empty slot destination index and decreasing non-empty slot source index until the batch is contiguous

Shrink the batch: a side effect of condensing the batch is that empty slots resulting from Remove operations are grouped in a contiguous block at the end of the batch array. Thus, after condensing, update BatchUpdate.batch_size to reflect the number of non-empty slots

Reorder the batch for improved efficiency. Depending on the attention backend implementation and the current characteristics of the batch, zero or more Swap Move operations may be applied to reorder the batch

A logits processor update_state() method must process batch update operations in the following order: removes, adds, moves

The index argument for Add operations refers to the index at the time the Add occurred, i.e. before any Move operations

Move operations can be assumed to be applied in the order in which they appear in BatchUpdate.moved

If there are no new/finished requests and there is no batch reordering, then the batch update for the logits processors will be None

Unlike built-in logits processors, custom logits processors may require configuration arguments that are not hard-coded into SamplingParams or the vLLM server REST API. To solve this problem, custom logits processors may leverage vLLM custom arguments support to receive configuration settings from the user (although you are also free to design a custom logits processor which utilizes the pre-existing fields in SamplingParams.)

The contrived example below implements a custom logits processor which consumes a (num\_requests) \times (vocab\_size) logits tensor and masks out all tokens except for one (target_token) with float(-inf). The logits processor is disabled for any request that does not specify target_token. To determine whether the logits processor is enabled and which token to leave unmasked, the logits processor checks SamplingParams.extra_args for a target_token custom argument associated with each request:

In the rest of this document, we will use DummyLogitsProcessor as an example of a custom logits processor.

The DummyLogitsProcessor.update_state() implementation maintains a "sparse" representation of the batched requests in the self.req_info dictionary: only those requests which specify a target_token value have a key in the dictionary. update_state() adjusts the stored request indices and target_token values (keys and values respectively in self.req_info) in response to Add, Remove and Move operations against the persistent batch.

Although the vLLM engine applies logits processors at batch granularity, some users may want to use vLLM with a "request-level" logits processor implementation - an implementation which operates on individual requests. This will be especially true if your logits processor was developed for vLLM version 0, which required it to be a Callable (as described here) conforming to the following type annotation:

While request-level logits processors are explicitly not supported in the vLLM engine, vLLM does provide a convenient process to wrap an existing Callable request-level logits processor and create a batch-level logits processor that is compatible with vLLM. The Callable must conform to the type annotation above; if your request-level logits processor has a different interface, then in order to wrap it, you may need to modify it or implement an additional wrapper layer to comply with the interface specification above.

You can wrap the request-level logits processor by subclassing AdapterLogitsProcessor as shown in the example below (in this example, DummyPerReqLogitsProcessor is a stand-in for your request-level logits processor which needs to be wrapped.):

Override AdapterLogitsProcessor.validate_params(cls,params) to validate request's sampling parameters.

Override AdapterLogitsProcessor.is_argmax_invariant(self) to accurately reflect whether your request-level logits processor may impact which token has the highest-value logit.

Override AdapterLogitsProcessor.new_req_logits_processor(self,params) to create a new request-level logits processor instance from a SamplingParams instance:

Your new_req_logits_processor() override can return None to signal that the wrapped logits processor should not be applied to the request in question.

Once you have created a custom subclass (like WrappedPerReqLogitsProcessor) which wraps your request level logits processor, you can pass the custom subclass to vLLM via any of the methods described in the following section.

Logits processors are loaded at initialization. Critically, the set of loaded logits processors cannot be modified after the vLLM engine finishes loading, and new logits processors cannot be loaded on-demand for individual requests.

This section details different ways of making your logits processor visible to vLLM and triggering vLLM to load your logits processor.

This method is supported in both offline and online vLLM usage scenarios. The custom logits processor's FQCN (in the form of dotted.path.to.module:ClassName) can be passed as an argument to the LLM and AsyncLLM Python constructors, or as a CLI argument to vllm serve with the following syntax

The only requirements on the FQCN are

Python's importlib.import_module() must be able to resolve the dotted path portion of the FQCN and load it as a module

The class-name portion of the FQCN must be possible to import from the loaded module

The object pointed to by the FQCN must be a subclass of LogitsProcessor

setuptools can enable installed packages to make themselves available as plugins to other Python programs, via pieces of metadata known as "entry points".

During initialization, vLLM automatically scans the vllm.logits_processors entry point group and loads any installed logits processors which it finds.

Suppose that you have developed a Python package that holds your custom logits processors. You can expose each logits processor to vLLM by adding a unique entrypoint for each logits processor to your logits processor Python package. The example below shows how to add an entrypoint to your project's pyproject.toml file:

Once your package is installed, your custom logits processor will be loaded automatically whenever vLLM is initialized. You do not need to pass the custom logits processor to the LLM or AsyncLLM constructors or to the vLLM server explicitly at initialization time if your logits processor is exposed as an entry point.

vLLM will always load all logits processors which are exposed via entrypoints under the vllm.logits_processors grouping.

You can pass one or more custom logits processor class objects to the LLM and AsyncLLM constructors. This option is very flexible, as the logits processor classes may either be (1) defined locally within the same Python source file where LLM or AsyncLLM is instantiated, or (2) imported from a Python package.

The design of the custom logits processor determines whether the logits processor must be enabled/disabled for a given request, and what arguments must be provided to configure the logits processor.

The examples below show how a user would pass a custom argument (target_token) to DummyLogitsProcessor in order to (1) enable the logits processor for that particular request and (2) control the logits processor's behavior.

Once vLLM loads a logits processor during initialization, then vLLM will invoke update_state() and apply() against that logits processor in every engine step. Both methods operate on all requests which currently reside in the vLLM persistent batch. Thus, it is important to implement these methods efficiently.

Write efficient apply() and update_state() implementations in light of the fact that logits processors operate at batch granularity

It is up to the logits processor author to determine:

The per-request attributes which configure the logits processor's behavior against that request. Your custom logits processor's update_state() override determines how SamplingParams fields are mapped into logits processor state

The conditions under which the logits processor is or is not enabled on a per-request basis. Unless your intention is for the custom logits processor to act on all requests all the time, you should write your logits processor in such a way that it is possible to disable the logits processor for a given request, i.e. by defaulting an argument to None or by passing in a specific do-nothing argument value i.e. 0.0. Try to save compute and memory for requests which disable the logits processor

The conditions under which the logits processor is short-circuited at the batch level. Even if you have defined a way to disable the custom logits processor at the request level, it may be difficult to translate this into compute savings i.e. if your update_state() and apply() implementations use efficient vectorized implementations that operate on the whole persistent batch in a single command. For example, you cannot skip an entire vectorized operation in apply() just because one request disabled the logits processor. To save compute in the edge-case where no running requests utilize the custom logits processor, we recommend designing apply() to return the unmodified input tensor if all requests have the logits processor disabled. Similarly, consider whether steps can be skipped in update_state() if no requests enable the logits processor

Additionally, an easy way to save compute in update_state() is to exit early when the batch_update is None

Note: for wrapped per-request logits processors, the AdapterLogitsProcessor base-class implements the above optimizations by default

Ensure that the logits processor update_state method discards information about finished requests (i.e. requests which are replaced by an Add or which are subject to a Remove)

is_argmax_invariant() can be hard-coded to True or False if the logits processor has consistent behavior. However, the argmax invariance may also be determined programmatically (i.e. if your logits processor is user-customizable in some way that impacts whether the logits processor is argmax invariant). For this reason, is_argmax_invariant() is not a class method

**Examples:**

Example 1 (python):
```python
import torch
from vllm.config import VllmConfig
from vllm.sampling_params import SamplingParams
from vllm.v1.sample.logits_processor import (BatchUpdate,
                                            LogitsProcessor,
                                            MoveDirectionality)

class DummyLogitsProcessor(LogitsProcessor):
    """Fake logit processor to support unit testing and examples"""

    @classmethod
    def validate_params(cls, params: SamplingParams):
        target_token: int | None = params.extra_args and params.extra_args.get(
            "target_token"
        )
        if target_token is not None and not isinstance(target_token, int):
            raise ValueError(f"target_token value {target_token} is not int")

    def __init__(self, vllm_config: "VllmConfig", device: torch.device,
                is_pin_memory: bool):
        self.req_info: dict[int, int] = {}

    def is_argmax_invariant(self) -> bool:
        """Never impacts greedy sampling"""
        return False

    def update_state(self, batch_update: BatchUpdate | None):
        if not batch_update:
            return

        # Process added requests.
        for index, params, _, _ in batch_update.added:
            assert params is not None
            self.validate_params(params)
            if params.extra_args and (target_token :=
                                    params.extra_args.get("target_token")):
                self.req_info[index] = target_token
            else: 
                self.req_info.pop(index, None)

        if self.req_info:
            # Process removed requests.
            for index in batch_update.removed:
                self.req_info.pop(index, None)

            # Process moved requests, unidirectional move (a->b) and swap
            # (a<->b)
            for adx, bdx, direct in batch_update.moved:
                a_val = self.req_info.pop(adx, None)
                b_val = self.req_info.pop(bdx, None)
                if a_val is not None:
                    self.req_info[bdx] = a_val
                if direct == MoveDirectionality.SWAP and b_val is not None:
                    self.req_info[adx] = b_val

    def apply(self, logits: torch.Tensor) -> torch.Tensor:
        if not self.req_info:
            return logits

        # Save target values before modification
        cols = torch.tensor(
            list(self.req_info.values()), dtype=torch.long, device=logits.device
        )
        rows = torch.tensor(
            list(self.req_info.keys()), dtype=torch.long, device=logits.device
        )
        values_to_keep = logits[rows, cols].clone()

        # Mask all but target tokens
        logits[rows] = float('-inf')
        logits[rows, cols] = values_to_keep

        return logits
```

Example 2 (python):
```python
import torch
from vllm.config import VllmConfig
from vllm.sampling_params import SamplingParams
from vllm.v1.sample.logits_processor import (BatchUpdate,
                                            LogitsProcessor,
                                            MoveDirectionality)

class DummyLogitsProcessor(LogitsProcessor):
    """Fake logit processor to support unit testing and examples"""

    @classmethod
    def validate_params(cls, params: SamplingParams):
        target_token: int | None = params.extra_args and params.extra_args.get(
            "target_token"
        )
        if target_token is not None and not isinstance(target_token, int):
            raise ValueError(f"target_token value {target_token} is not int")

    def __init__(self, vllm_config: "VllmConfig", device: torch.device,
                is_pin_memory: bool):
        self.req_info: dict[int, int] = {}

    def is_argmax_invariant(self) -> bool:
        """Never impacts greedy sampling"""
        return False

    def update_state(self, batch_update: BatchUpdate | None):
        if not batch_update:
            return

        # Process added requests.
        for index, params, _, _ in batch_update.added:
            assert params is not None
            self.validate_params(params)
            if params.extra_args and (target_token :=
                                    params.extra_args.get("target_token")):
                self.req_info[index] = target_token
            else: 
                self.req_info.pop(index, None)

        if self.req_info:
            # Process removed requests.
            for index in batch_update.removed:
                self.req_info.pop(index, None)

            # Process moved requests, unidirectional move (a->b) and swap
            # (a<->b)
            for adx, bdx, direct in batch_update.moved:
                a_val = self.req_info.pop(adx, None)
                b_val = self.req_info.pop(bdx, None)
                if a_val is not None:
                    self.req_info[bdx] = a_val
                if direct == MoveDirectionality.SWAP and b_val is not None:
                    self.req_info[adx] = b_val

    def apply(self, logits: torch.Tensor) -> torch.Tensor:
        if not self.req_info:
            return logits

        # Save target values before modification
        cols = torch.tensor(
            list(self.req_info.values()), dtype=torch.long, device=logits.device
        )
        rows = torch.tensor(
            list(self.req_info.keys()), dtype=torch.long, device=logits.device
        )
        values_to_keep = logits[rows, cols].clone()

        # Mask all but target tokens
        logits[rows] = float('-inf')
        logits[rows, cols] = values_to_keep

        return logits
```

Example 3 (php):
```php
RequestLogitsProcessor = Union[

    # (output token ids, logits tensor) -> logits tensor
    Callable[[list[int], Tensor], Tensor],

    # (prompt token ids, output token ids, logits tensor) -> logits tensor
    Callable[[list[int], list[int], Tensor], Tensor],
]
```

Example 4 (php):
```php
RequestLogitsProcessor = Union[

    # (output token ids, logits tensor) -> logits tensor
    Callable[[list[int], Tensor], Tensor],

    # (prompt token ids, output token ids, logits tensor) -> logits tensor
    Callable[[list[int], list[int], Tensor], Tensor],
]
```

---

## Disaggregated Encoder - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/disagg_encoder/

**Contents:**
- Disaggregated Encoder¶
- 1 Motivation¶
  - 1. Independent, fine-grained scaling¶
  - 2. Lower time-to-first-token (TTFT)¶
  - 3. Cross-process reuse and caching¶
- 2 Usage Example¶
- 3 Test Script¶
- 4 Development¶
  - Key abstractions¶

A disaggregated encoder runs the vision-encoder stage of a multimodal LLM in a process that is separate from the pre-fill / decoder stage. Deploying these two stages in independent vLLM instances brings three practical benefits:

Design doc: https://docs.google.com/document/d/1aed8KtC6XkXtdoV87pWT0a8OJlZ-CpnuLLzmR8l9BAE

The current reference pathway is ExampleConnector. Below ready-to-run scripts shows the workflow:

1 Encoder instance + 1 PD instance: examples/online_serving/disaggregated_encoder/disagg_1e1pd_example.sh

1 Encoder instance + 1 Prefill instance + 1 Decode instance: examples/online_serving/disaggregated_encoder/disagg_1e1p1d_example.sh

Please refer to the directories tests/v1/ec_connector

Disaggregated encoding is implemented by running two parts:

A connector transfers encoder-cache (EC) embeddings from the encoder instance to the PD instance. All related code is under vllm/distributed/ec_transfer.

Here is a figure illustrating disaggregate encoder flow:

For the PD disaggregation part, the Prefill instance receive cache exactly the same as the disaggregate encoder flow above. Prefill instance executes 1 step (prefill -> 1 token output) and then transfer KV cache to the Decode instance for the remaining execution. The KV transfer part purely happens after the execute of the PDinstance.

docs/features/disagg_prefill.md shows the brief idea about the disaggregated prefill (v0)

We create the example setup with the NixlConnector from vllm/distributed/kv_transfer/kv_connector/v1/nixl_connector.py and referred to the tests/v1/kv_connector/nixl_integration/toy_proxy_server.py to facilitate the kv transfer between P and D;

---

## Disaggregated Prefilling (experimental) - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/disagg_prefill/

**Contents:**
- Disaggregated Prefilling (experimental)¶
- Why disaggregated prefilling?¶
- Usage example¶
- Benchmarks¶
- Development¶
- Third-party contributions¶

This page introduces you the disaggregated prefilling feature in vLLM.

This feature is experimental and subject to change.

Disaggregated prefill DOES NOT improve throughput.

Please refer to examples/online_serving/disaggregated_prefill.sh for the example usage of disaggregated prefilling.

Now supports 5 types of connectors:

For NixlConnector, you may also specify one or multiple NIXL_Backend. Such as:

Please refer to benchmarks/disagg_benchmarks for disaggregated prefilling benchmarks.

We implement disaggregated prefilling by running 2 vLLM instances. One for prefill (we call it prefill instance) and one for decode (we call it decode instance), and then use a connector to transfer the prefill KV caches and results from prefill instance to decode instance.

All disaggregated prefilling implementation is under vllm/distributed/kv_transfer.

Key abstractions for disaggregated prefilling:

insert is non-blocking operation but drop_select is blocking operation.

Here is a figure illustrating how the above 3 abstractions are organized:

The workflow of disaggregated prefilling is as follows:

The buffer corresponds to insert API in LookupBuffer, and the drop_select corresponds to drop_select API in LookupBuffer.

Now every process in vLLM will have a corresponding connector. Specifically, we have:

Here is a figure illustrating how the above 2 connectors are organized:

The figure below shows how the worker connector works with the attention module to achieve layer-by-layer KV cache store and load:

Disaggregated prefilling is highly related to infrastructure, so vLLM relies on third-party connectors for production-level disaggregated prefilling (and vLLM team will actively review and merge new PRs for third-party connectors).

We recommend three ways of implementations:

**Examples:**

Example 1 (json):
```json
--kv-transfer-config '{"kv_connector":"MultiConnector","kv_role":"kv_both","kv_connector_extra_config":{"connectors":[{"kv_connector":"NixlConnector","kv_role":"kv_both"},{"kv_connector":"ExampleConnector","kv_role":"kv_both","kv_connector_extra_config":{"shared_storage_path":"local_storage"}}]}}'
```

Example 2 (json):
```json
--kv-transfer-config '{"kv_connector":"MultiConnector","kv_role":"kv_both","kv_connector_extra_config":{"connectors":[{"kv_connector":"NixlConnector","kv_role":"kv_both"},{"kv_connector":"ExampleConnector","kv_role":"kv_both","kv_connector_extra_config":{"shared_storage_path":"local_storage"}}]}}'
```

Example 3 (json):
```json
--kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both", "kv_buffer_device":"cuda", "kv_connector_extra_config":{"backends":["UCX", "GDS"]}}'
```

Example 4 (json):
```json
--kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both", "kv_buffer_device":"cuda", "kv_connector_extra_config":{"backends":["UCX", "GDS"]}}'
```

---

## Encoder Decoder Multimodal - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/offline_inference/encoder_decoder_multimodal/

**Contents:**
- Encoder Decoder Multimodal¶

Source https://github.com/vllm-project/vllm/blob/main/examples/offline_inference/encoder_decoder_multimodal.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use vLLM for running offline inference with
the explicit/implicit prompt format on enc-dec LMMs for text generation.
"""

import os
import time
from collections.abc import Sequence
from dataclasses import asdict
from typing import NamedTuple

from vllm import LLM, EngineArgs, PromptType, SamplingParams
from vllm.assets.audio import AudioAsset
from vllm.utils.argparse_utils import FlexibleArgumentParser


class ModelRequestData(NamedTuple):
    engine_args: EngineArgs
    prompts: Sequence[PromptType]


def run_whisper():
    os.environ["VLLM_WORKER_MULTIPROC_METHOD"] = "spawn"

    engine_args = EngineArgs(
        model="openai/whisper-large-v3-turbo",
        max_model_len=448,
        max_num_seqs=16,
        limit_mm_per_prompt={"audio": 1},
        dtype="half",
    )

    prompts = [
        {  # Test implicit prompt
            "prompt": "<|startoftranscript|>",
            "multi_modal_data": {
                "audio": AudioAsset("mary_had_lamb").audio_and_sample_rate,
            },
        },
        {  # Test explicit encoder/decoder prompt
            "encoder_prompt": {
                "prompt": "",
                "multi_modal_data": {
                    "audio": AudioAsset("winning_call").audio_and_sample_rate,
                },
            },
            "decoder_prompt": "<|startoftranscript|>",
        },
    ]

    return ModelRequestData(
        engine_args=engine_args,
        prompts=prompts,
    )


model_example_map = {
    "whisper": run_whisper,
}


def parse_args():
    parser = FlexibleArgumentParser(
        description="Demo on using vLLM for offline inference with "
        "vision language models for text generation"
    )
    parser.add_argument(
        "--model-type",
        "-m",
        type=str,
        default="whisper",
        choices=model_example_map.keys(),
        help='Huggingface "model_type".',
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=0,
        help="Set the seed when initializing `vllm.LLM`.",
    )
    return parser.parse_args()


def main(args):
    model = args.model_type
    if model not in model_example_map:
        raise ValueError(f"Model type {model} is not supported.")

    req_data = model_example_map[model]()

    # Disable other modalities to save memory
    default_limits = {"image": 0, "video": 0, "audio": 0}
    req_data.engine_args.limit_mm_per_prompt = default_limits | dict(
        req_data.engine_args.limit_mm_per_prompt or {}
    )

    engine_args = asdict(req_data.engine_args) | {"seed": args.seed}
    llm = LLM(**engine_args)

    prompts = req_data.prompts

    # Create a sampling params object.
    sampling_params = SamplingParams(
        temperature=0,
        top_p=1.0,
        max_tokens=64,
        skip_special_tokens=False,
    )

    start = time.time()

    # Generate output tokens from the prompts. The output is a list of
    # RequestOutput objects that contain the prompt, generated
    # text, and other information.
    outputs = llm.generate(prompts, sampling_params)

    # Print the outputs.
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Decoder prompt: {prompt!r}, Generated text: {generated_text!r}")

    duration = time.time() - start

    print("Duration:", duration)
    print("RPS:", len(prompts) / duration)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use vLLM for running offline inference with
the explicit/implicit prompt format on enc-dec LMMs for text generation.
"""

import os
import time
from collections.abc import Sequence
from dataclasses import asdict
from typing import NamedTuple

from vllm import LLM, EngineArgs, PromptType, SamplingParams
from vllm.assets.audio import AudioAsset
from vllm.utils.argparse_utils import FlexibleArgumentParser


class ModelRequestData(NamedTuple):
    engine_args: EngineArgs
    prompts: Sequence[PromptType]


def run_whisper():
    os.environ["VLLM_WORKER_MULTIPROC_METHOD"] = "spawn"

    engine_args = EngineArgs(
        model="openai/whisper-large-v3-turbo",
        max_model_len=448,
        max_num_seqs=16,
        limit_mm_per_prompt={"audio": 1},
        dtype="half",
    )

    prompts = [
        {  # Test implicit prompt
            "prompt": "<|startoftranscript|>",
            "multi_modal_data": {
                "audio": AudioAsset("mary_had_lamb").audio_and_sample_rate,
            },
        },
        {  # Test explicit encoder/decoder prompt
            "encoder_prompt": {
                "prompt": "",
                "multi_modal_data": {
                    "audio": AudioAsset("winning_call").audio_and_sample_rate,
                },
            },
            "decoder_prompt": "<|startoftranscript|>",
        },
    ]

    return ModelRequestData(
        engine_args=engine_args,
        prompts=prompts,
    )


model_example_map = {
    "whisper": run_whisper,
}


def parse_args():
    parser = FlexibleArgumentParser(
        description="Demo on using vLLM for offline inference with "
        "vision language models for text generation"
    )
    parser.add_argument(
        "--model-type",
        "-m",
        type=str,
        default="whisper",
        choices=model_example_map.keys(),
        help='Huggingface "model_type".',
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=0,
        help="Set the seed when initializing `vllm.LLM`.",
    )
    return parser.parse_args()


def main(args):
    model = args.model_type
    if model not in model_example_map:
        raise ValueError(f"Model type {model} is not supported.")

    req_data = model_example_map[model]()

    # Disable other modalities to save memory
    default_limits = {"image": 0, "video": 0, "audio": 0}
    req_data.engine_args.limit_mm_per_prompt = default_limits | dict(
        req_data.engine_args.limit_mm_per_prompt or {}
    )

    engine_args = asdict(req_data.engine_args) | {"seed": args.seed}
    llm = LLM(**engine_args)

    prompts = req_data.prompts

    # Create a sampling params object.
    sampling_params = SamplingParams(
        temperature=0,
        top_p=1.0,
        max_tokens=64,
        skip_special_tokens=False,
    )

    start = time.time()

    # Generate output tokens from the prompts. The output is a list of
    # RequestOutput objects that contain the prompt, generated
    # text, and other information.
    outputs = llm.generate(prompts, sampling_params)

    # Print the outputs.
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Decoder prompt: {prompt!r}, Generated text: {generated_text!r}")

    duration = time.time() - start

    print("Duration:", duration)
    print("RPS:", len(prompts) / duration)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## Fused MoE Kernel Features - vLLM

**URL:** https://docs.vllm.ai/en/latest/design/moe_kernel_features/

**Contents:**
- Fused MoE Kernel Features¶
- Fused MoE Modular All2All backends¶
- Fused Experts Kernels¶
- Modular Kernel "families"¶

The purpose of this document is to provide an overview of the various MoE kernels (both modular and non-modular) so it will be easier to select an appropriate set of kernels for any particular situation. This includes information about the all2all backends used by modular kernels.

There are a number of all2all communication backends that are used to implement expert parallelism (EP) for the FusedMoE layer. The different FusedMoEPrepareAndFinalize subclasses provide an interface for each all2all backend.

The following table describes the relevant features of each backend, i.e. activation format, supported quantization schemes and async support.

The output activation format (standard or batched) corresponds to the output of the prepare step of the FusedMoEPrepareAndFinalize subclass, and the finalize step requires the same format. All the backend prepare methods expect activations in the standard format and all the finalize methods return activations in standard format. More details on the formats can be found in the Fused MoE Modular Kernel document.

The quantization types and formats enumerate which quantization schemes are supported by each FusedMoEPrepareAndFinalize class. The quantization can happen before or after the dispatch based on the format the all2all backend supports, e.g. deepep_high_throughput supports only block-quantized fp8 format. Any other format will result in dispatching in higher precision and quantizing afterwards. The output of the prepare step for each backend is the quantized type. The finalize step generally requires the same input type as the original activations, e.g. if the original input is bfloat16 and the quantization scheme is fp8 with per-tensor scales, prepare will return fp8/per-tensor scale activations and finalize will take bfloat16 activations. See the diagrams in Fused MoE Modular Kernel for more details on the types and formats of activations at each step of the MoE process. If no quantization type is specified, the kernel operates on float16 and/or bfloat16.

Async backends support the use of DBO (Dual Batch Overlap) and shared expert overlap (where shared experts are computed during the combine step).

Certain models require the topk weights to be applied to the input activations rather than the output activations when topk==1, e.g. Llama. For modular kernels, this feature is supported by the FusedMoEPrepareAndFinalize subclass. For non-modular kernels, it is up to the experts function to deal with this flag.

Unless otherwise specified, backends are controlled via the --all2all-backend command-line argument (or the all2all_backend parameter in ParallelConfig). All backends except flashinfer only work with EP+DP or EP+TP. Flashinfer can work with EP or DP without EP.

Modular kernels are supported by the following FusedMoEMethodBase classes.

There are a number of MoE experts kernel implementations for different quantization types and architectures. Most follow the general API of the base Triton fused_experts function. Many have modular kernel adapters, so they can be used with compatible all2all backends. This table lists each experts kernel and its particular properties.

Each kernel must be provided with one of the supported input activation formats. Some flavors of kernels support both standard and batched formats through different entry points, e.g. TritonExperts and BatchedTritonExperts. Batched format kernels are currently only needed for matching with certain all2all backends, e.g. pplx and DeepEPLLPrepareAndFinalize.

Similar to the backend kernels, each experts kernel only supports certain quantization formats. For non-modular experts, the activations will be in the original type and quantized internally by the kernel. Modular experts will expect the activations to already be in the quantized format. Both types of experts will yield outputs in the original activation type.

Each experts kernel supports one or more activation functions, e.g. silu or gelu, which are applied to the intermediate results.

As with the backends, some experts support applying topk weights on the input activations. The entries in the column in this table only apply to the non-modular experts.

Most experts flavors include an equivalent modular interface which will be a subclass of FusedMoEPermuteExpertsUnpermute.

To be used with a particular FusedMoEPrepareAndFinalize subclass, MoE kernels must have compatible activation formats, quantization types and quantization formats.

The following table shows "families" of modular kernels that are intended to work together. There are some combinations which may work but have not yet been tested, e.g. flashinfer with other fp8 experts. Note that the "naive" backend will work with any non-modular experts.

---

## GGUF - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/gguf/

**Contents:**
- GGUF¶

Please note that GGUF support in vLLM is highly experimental and under-optimized at the moment, it might be incompatible with other features. Currently, you can use GGUF as a way to reduce memory footprint. If you encounter any issues, please report them to the vLLM team.

Currently, vllm only supports loading single-file GGUF models. If you have a multi-files GGUF model, you can use gguf-split tool to merge them to a single-file model.

To run a GGUF model with vLLM, you can download and use the local GGUF model from TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF with the following command:

You can also add --tensor-parallel-size 2 to enable tensor parallelism inference with 2 GPUs:

We recommend using the tokenizer from base model instead of GGUF model. Because the tokenizer conversion from GGUF is time-consuming and unstable, especially for some models with large vocab size.

GGUF assumes that huggingface can convert the metadata to a config file. In case huggingface doesn't support your model you can manually create a config and pass it as hf-config-path

You can also use the GGUF model directly through the LLM entrypoint:

**Examples:**

Example 1 (julia):
```julia
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf
# We recommend using the tokenizer from base model to avoid long-time and buggy tokenizer conversion.
vllm serve ./tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf \
   --tokenizer TinyLlama/TinyLlama-1.1B-Chat-v1.0
```

Example 2 (julia):
```julia
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf
# We recommend using the tokenizer from base model to avoid long-time and buggy tokenizer conversion.
vllm serve ./tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf \
   --tokenizer TinyLlama/TinyLlama-1.1B-Chat-v1.0
```

Example 3 (julia):
```julia
# We recommend using the tokenizer from base model to avoid long-time and buggy tokenizer conversion.
vllm serve ./tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf \
   --tokenizer TinyLlama/TinyLlama-1.1B-Chat-v1.0 \
   --tensor-parallel-size 2
```

Example 4 (julia):
```julia
# We recommend using the tokenizer from base model to avoid long-time and buggy tokenizer conversion.
vllm serve ./tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf \
   --tokenizer TinyLlama/TinyLlama-1.1B-Chat-v1.0 \
   --tensor-parallel-size 2
```

---

## GPTQModel - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/gptqmodel/

**Contents:**
- GPTQModel¶
- Installation¶
- Quantizing a model¶
- Running a quantized model with vLLM¶
- Using GPTQModel with vLLM's Python API¶

To create a new 4-bit or 8-bit GPTQ quantized model, you can leverage GPTQModel from ModelCloud.AI.

Quantization reduces the model's precision from BF16/FP16 (16-bits) to INT4 (4-bits) or INT8 (8-bits) which significantly reduces the total model memory footprint while at-the-same-time increasing inference performance.

Compatible GPTQModel quantized models can leverage the Marlin and Machete vLLM custom kernels to maximize batching transactions-per-second tps and token-latency performance for both Ampere (A100+) and Hopper (H100+) Nvidia GPUs. These two kernels are highly optimized by vLLM and NeuralMagic (now part of Redhat) to allow world-class inference performance of quantized GPTQ models.

GPTQModel is one of the few quantization toolkits in the world that allows Dynamic per-module quantization where different layers and/or modules within a llm model can be further optimized with custom quantization parameters. Dynamic quantization is fully integrated into vLLM and backed up by support from the ModelCloud.AI team. Please refer to GPTQModel readme for more details on this and other advanced features.

You can quantize your own models by installing GPTQModel or picking one of the 5000+ models on Huggingface.

After installing GPTQModel, you are ready to quantize a model. Please refer to the GPTQModel readme for further details.

Here is an example of how to quantize meta-llama/Llama-3.2-1B-Instruct:

To run an GPTQModel quantized model with vLLM, you can use DeepSeek-R1-Distill-Qwen-7B-gptqmodel-4bit-vortex-v2 with the following command:

GPTQModel quantized models are also supported directly through the LLM entrypoint:

**Examples:**

Example 1 (unknown):
```unknown
pip install -U gptqmodel --no-build-isolation -v
```

Example 2 (unknown):
```unknown
pip install -U gptqmodel --no-build-isolation -v
```

Example 3 (python):
```python
from datasets import load_dataset
from gptqmodel import GPTQModel, QuantizeConfig

model_id = "meta-llama/Llama-3.2-1B-Instruct"
quant_path = "Llama-3.2-1B-Instruct-gptqmodel-4bit"

calibration_dataset = load_dataset(
    "allenai/c4",
    data_files="en/c4-train.00001-of-01024.json.gz",
    split="train",
).select(range(1024))["text"]

quant_config = QuantizeConfig(bits=4, group_size=128)

model = GPTQModel.load(model_id, quant_config)

# increase `batch_size` to match gpu/vram specs to speed up quantization
model.quantize(calibration_dataset, batch_size=2)

model.save(quant_path)
```

Example 4 (python):
```python
from datasets import load_dataset
from gptqmodel import GPTQModel, QuantizeConfig

model_id = "meta-llama/Llama-3.2-1B-Instruct"
quant_path = "Llama-3.2-1B-Instruct-gptqmodel-4bit"

calibration_dataset = load_dataset(
    "allenai/c4",
    data_files="en/c4-train.00001-of-01024.json.gz",
    split="train",
).select(range(1024))["text"]

quant_config = QuantizeConfig(bits=4, group_size=128)

model = GPTQModel.load(model_id, quant_config)

# increase `batch_size` to match gpu/vram specs to speed up quantization
model.quantize(calibration_dataset, batch_size=2)

model.save(quant_path)
```

---

## INT4 W4A16 - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/int4/

**Contents:**
- INT4 W4A16¶
- Prerequisites¶
- Quantization Process¶
  - 1. Loading the Model¶
  - 2. Preparing Calibration Data¶
  - 3. Applying Quantization¶
  - 4. Evaluating Accuracy¶
- Best Practices¶
- Troubleshooting and Support¶

vLLM supports quantizing weights to INT4 for memory savings and inference acceleration. This quantization method is particularly useful for reducing model size and maintaining low latency in workloads with low queries per second (QPS).

Please visit the HF collection of quantized INT4 checkpoints of popular LLMs ready to use with vLLM.

INT4 computation is supported on NVIDIA GPUs with compute capability > 8.0 (Ampere, Ada Lovelace, Hopper, Blackwell).

To use INT4 quantization with vLLM, you'll need to install the llm-compressor library:

Additionally, install vllm and lm-evaluation-harness for evaluation:

The quantization process involves four main steps:

Load your model and tokenizer using the standard transformers AutoModel classes:

When quantizing weights to INT4, you need sample data to estimate the weight updates and calibrated scales. It's best to use calibration data that closely matches your deployment data. For a general-purpose instruction-tuned model, you can use a dataset like ultrachat:

Now, apply the quantization algorithms:

This process creates a W4A16 model with weights quantized to 4-bit integers.

After quantization, you can load and run the model in vLLM:

To evaluate accuracy, you can use lm_eval:

Quantized models can be sensitive to the presence of the bos token. Make sure to include the add_bos_token=True argument when running evaluations.

The following is an example of an expanded quantization recipe you can tune to your own use case:

If you encounter any issues or have feature requests, please open an issue on the vllm-project/llm-compressor GitHub repository. The full INT4 quantization example in llm-compressor is available here.

**Examples:**

Example 1 (unknown):
```unknown
pip install llmcompressor
```

Example 2 (unknown):
```unknown
pip install llmcompressor
```

Example 3 (unknown):
```unknown
pip install vllm "lm-eval[api]>=0.4.9.2"
```

Example 4 (unknown):
```unknown
pip install vllm "lm-eval[api]>=0.4.9.2"
```

---

## INT8 W8A8 - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/int8/

**Contents:**
- INT8 W8A8¶
- Prerequisites¶
- Quantization Process¶
  - 1. Loading the Model¶
  - 2. Preparing Calibration Data¶
  - 3. Applying Quantization¶
  - 4. Evaluating Accuracy¶
- Best Practices¶
- Troubleshooting and Support¶

vLLM supports quantizing weights and activations to INT8 for memory savings and inference acceleration. This quantization method is particularly useful for reducing model size while maintaining good performance.

Please visit the HF collection of quantized INT8 checkpoints of popular LLMs ready to use with vLLM.

INT8 computation is supported on NVIDIA GPUs with compute capability > 7.5 (Turing, Ampere, Ada Lovelace, Hopper).

Blackwell GPU Limitation: INT8 is not supported on compute capability >= 100 (e.g., RTX 6000 Blackwell). Use FP8 quantization instead, or run on Hopper/Ada/Ampere architectures.

To use INT8 quantization with vLLM, you'll need to install the llm-compressor library:

Additionally, install vllm and lm-evaluation-harness for evaluation:

The quantization process involves four main steps:

Load your model and tokenizer using the standard transformers AutoModel classes:

When quantizing activations to INT8, you need sample data to estimate the activation scales. It's best to use calibration data that closely matches your deployment data. For a general-purpose instruction-tuned model, you can use a dataset like ultrachat:

Now, apply the quantization algorithms:

This process creates a W8A8 model with weights and activations quantized to 8-bit integers.

After quantization, you can load and run the model in vLLM:

To evaluate accuracy, you can use lm_eval:

Quantized models can be sensitive to the presence of the bos token. Make sure to include the add_bos_token=True argument when running evaluations.

If you encounter any issues or have feature requests, please open an issue on the vllm-project/llm-compressor GitHub repository.

**Examples:**

Example 1 (unknown):
```unknown
pip install llmcompressor
```

Example 2 (unknown):
```unknown
pip install llmcompressor
```

Example 3 (unknown):
```unknown
pip install vllm "lm-eval[api]>=0.4.9.2"
```

Example 4 (unknown):
```unknown
pip install vllm "lm-eval[api]>=0.4.9.2"
```

---

## Interleaved Thinking - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/interleaved_thinking/

**Contents:**
- Interleaved Thinking¶
- Introduction¶
- How Interleaved Thinking Works¶
- Supported Models¶
- Example Usage¶

Interleaved thinking allows models to reason between tool calls, enabling more sophisticated decision-making after receiving tool results. This feature helps models chain multiple tool calls with reasoning steps in between and make nuanced decisions based on intermediate results.

Important: Interleaved thinking increases token usage and response latency. Consider your budget and performance requirements when enabling this feature.

With interleaved thinking, the model can:

vLLM currently supports the following interleaved thinking models:

To use interleaved thinking with tool calls, specify a model that supports this feature and enable tool calls in your chat completion request. Here's an example:

This example demonstrates how to set up interleaved thinking with tool calls using a weather retrieval function. The model reasons about the tool results before generating the final response.

**Examples:**

Example 1 (python):
```python
"""
vllm serve MiniMaxAI/MiniMax-M2 \
  --tensor-parallel-size 4 \
  --tool-call-parser minimax_m2 \
  --reasoning-parser minimax_m2 \
  --enable-auto-tool-choice
"""
import json

from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1",     api_key="dummy")


def get_current_weather(location: str, unit: "str"):
    """Get the current weather in a given location"""
    if unit == "celsius":
        return f"The current temperature in {location} is 22°C."
    else:
        return f"The current temperature in {location} is 72°F."


tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given     location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g.,     'San Francisco, CA'",
                    },
                    "unit": {"type": "string", "enum":     ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    }
]
messages = [{"role": "user", "content": "What's the weather in Fahrenheit like in San Francisco?"}]
response = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

tool_call = response.choices[0].message.tool_calls[0].function

messages.append(
    {
        "role": "assistant",
        "tool_calls": response.choices[0].message.tool_calls,
        "reasoning": response.choices[0].message.reasoning, # append reasoning
    }
)

# Simulate tool execution
available_tools = {"get_weather": get_current_weather}

completion_tool_calls = response.choices[0].message.tool_calls
for call in completion_tool_calls:
    tool_to_call = available_tools[call.function.name]
    args = json.loads(call.function.arguments)
    result = tool_to_call(**args)
    messages.append(
        {
            "role": "tool",
            "content": result,
            "tool_call_id": call.id,
            "name": call.function.name,
        }
    )
response_2 = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=messages,
    tools=tools,
    tool_choice="auto",
)
print(response_2.choices[0].message.content)
```

Example 2 (python):
```python
"""
vllm serve MiniMaxAI/MiniMax-M2 \
  --tensor-parallel-size 4 \
  --tool-call-parser minimax_m2 \
  --reasoning-parser minimax_m2 \
  --enable-auto-tool-choice
"""
import json

from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1",     api_key="dummy")


def get_current_weather(location: str, unit: "str"):
    """Get the current weather in a given location"""
    if unit == "celsius":
        return f"The current temperature in {location} is 22°C."
    else:
        return f"The current temperature in {location} is 72°F."


tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given     location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g.,     'San Francisco, CA'",
                    },
                    "unit": {"type": "string", "enum":     ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    }
]
messages = [{"role": "user", "content": "What's the weather in Fahrenheit like in San Francisco?"}]
response = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

tool_call = response.choices[0].message.tool_calls[0].function

messages.append(
    {
        "role": "assistant",
        "tool_calls": response.choices[0].message.tool_calls,
        "reasoning": response.choices[0].message.reasoning, # append reasoning
    }
)

# Simulate tool execution
available_tools = {"get_weather": get_current_weather}

completion_tool_calls = response.choices[0].message.tool_calls
for call in completion_tool_calls:
    tool_to_call = available_tools[call.function.name]
    args = json.loads(call.function.arguments)
    result = tool_to_call(**args)
    messages.append(
        {
            "role": "tool",
            "content": result,
            "tool_call_id": call.id,
            "name": call.function.name,
        }
    )
response_2 = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=messages,
    tools=tools,
    tool_choice="auto",
)
print(response_2.choices[0].message.content)
```

---

## LoRA Adapters - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/lora/

**Contents:**
- LoRA Adapters¶
- Serving LoRA Adapters¶
- Dynamically serving LoRA Adapters¶
  - Using API Endpoints¶
  - Using Plugins¶
- New format for --lora-modules¶
- LoRA model lineage in model card¶
- Default LoRA Models For Multimodal Models¶
- Using Tips¶
  - Configuring max_lora_rank¶

This document shows you how to use LoRA adapters with vLLM on top of a base model.

LoRA adapters can be used with any vLLM model that implements SupportsLoRA.

Adapters can be efficiently served on a per-request basis with minimal overhead. First we download the adapter(s) and save them locally with

Then we instantiate the base model and pass in the enable_lora=True flag:

We can now submit the prompts and call llm.generate with the lora_request parameter. The first parameter of LoRARequest is a human identifiable name, the second parameter is a globally unique ID for the adapter and the third parameter is the path to the LoRA adapter.

Check out examples/offline_inference/multilora_inference.py for an example of how to use LoRA adapters with the async engine and how to use more advanced configuration options.

LoRA adapted models can also be served with the Open-AI compatible vLLM server. To do so, we use --lora-modules {name}={path} {name}={path} to specify each LoRA module when we kick off the server:

The commit ID 0dfa347e8877a4d4ed19ee56c140fa518470028c may change over time. Please check the latest commit ID in your environment to ensure you are using the correct one.

The server entrypoint accepts all other LoRA configuration parameters (max_loras, max_lora_rank, max_cpu_loras, etc.), which will apply to all forthcoming requests. Upon querying the /models endpoint, we should see our LoRA along with its base model (if jq is not installed, you can follow this guide to install it.):

Requests can specify the LoRA adapter as if it were any other model via the model request parameter. The requests will be processed according to the server-wide LoRA configuration (i.e. in parallel with base model requests, and potentially other LoRA adapter requests if they were provided and max_loras is set high enough).

The following is an example request

In addition to serving LoRA adapters at server startup, the vLLM server supports dynamically configuring LoRA adapters at runtime through dedicated API endpoints and plugins. This feature can be particularly useful when the flexibility to change models on-the-fly is needed.

Note: Enabling this feature in production environments is risky as users may participate in model adapter management.

To enable dynamic LoRA configuration, ensure that the environment variable VLLM_ALLOW_RUNTIME_LORA_UPDATING is set to True.

Loading a LoRA Adapter:

To dynamically load a LoRA adapter, send a POST request to the /v1/load_lora_adapter endpoint with the necessary details of the adapter to be loaded. The request payload should include the name and path to the LoRA adapter.

Example request to load a LoRA adapter:

Upon a successful request, the API will respond with a 200 OK status code from vllm serve, and curl returns the response body: Success: LoRA adapter 'sql_adapter' added successfully. If an error occurs, such as if the adapter cannot be found or loaded, an appropriate error message will be returned.

Unloading a LoRA Adapter:

To unload a LoRA adapter that has been previously loaded, send a POST request to the /v1/unload_lora_adapter endpoint with the name or ID of the adapter to be unloaded.

Upon a successful request, the API responds with a 200 OK status code from vllm serve, and curl returns the response body: Success: LoRA adapter 'sql_adapter' removed successfully.

Example request to unload a LoRA adapter:

Alternatively, you can use the LoRAResolver plugin to dynamically load LoRA adapters. LoRAResolver plugins enable you to load LoRA adapters from both local and remote sources such as local file system and S3. On every request, when there's a new model name that hasn't been loaded yet, the LoRAResolver will try to resolve and load the corresponding LoRA adapter.

You can set up multiple LoRAResolver plugins if you want to load LoRA adapters from different sources. For example, you might have one resolver for local files and another for S3 storage. vLLM will load the first LoRA adapter that it finds.

You can either install existing plugins or implement your own. By default, vLLM comes with a resolver plugin to load LoRA adapters from a local directory. To enable this resolver, set VLLM_ALLOW_RUNTIME_LORA_UPDATING to True, set VLLM_PLUGINS to include lora_filesystem_resolver, and then set VLLM_LORA_RESOLVER_CACHE_DIR to a local directory. When vLLM receives a request using a LoRA adapter foobar, it will first look in the local directory for a directory foobar, and attempt to load the contents of that directory as a LoRA adapter. If successful, the request will complete as normal and that adapter will then be available for normal use on the server.

Alternatively, follow these example steps to implement your own plugin:

Implement the LoRAResolver interface.

Register LoRAResolver plugin.

For more details, refer to the vLLM's Plugins System.

In the previous version, users would provide LoRA modules via the following format, either as a key-value pair or in JSON format. For example:

This would only include the name and path for each LoRA module, but did not provide a way to specify a base_model_name. Now, you can specify a base_model_name alongside the name and path using JSON format. For example:

To provide the backward compatibility support, you can still use the old key-value format (name=path), but the base_model_name will remain unspecified in that case.

The new format of --lora-modules is mainly to support the display of parent model information in the model card. Here's an explanation of how your current response supports this:

Some models, e.g., Granite Speech and Phi-4-multimodal-instruct multimodal, contain LoRA adapter(s) that are expected to always be applied when a given modality is present. This can be a bit tedious to manage with the above approaches, as it requires the user to send the LoRARequest (offline) or to filter requests between the base model and LoRA model (server) depending on the content of the request's multimodal data.

To this end, we allow registration of default multimodal LoRAs to handle this automatically, where users can map each modality to a LoRA adapter to automatically apply it when the corresponding inputs are present. Note that currently, we only allow one LoRA per prompt; if several modalities are provided, each of which are registered to a given modality, none of them will be applied.

You can also pass a json dictionary of --default-mm-loras mapping modalities to LoRA model IDs. For example, when starting the server:

Note: Default multimodal LoRAs are currently only available for .generate and chat completions.

The --max-lora-rank parameter controls the maximum rank allowed for LoRA adapters. This setting affects memory allocation and performance:

For example, if your LoRA adapters have ranks [16, 32, 64], use --max-lora-rank 64 rather than 256

**Examples:**

Example 1 (python):
```python
from huggingface_hub import snapshot_download

sql_lora_path = snapshot_download(repo_id="yard1/llama-2-7b-sql-lora-test")
```

Example 2 (python):
```python
from huggingface_hub import snapshot_download

sql_lora_path = snapshot_download(repo_id="yard1/llama-2-7b-sql-lora-test")
```

Example 3 (python):
```python
from vllm import LLM, SamplingParams
from vllm.lora.request import LoRARequest

llm = LLM(model="meta-llama/Llama-2-7b-hf", enable_lora=True)
```

Example 4 (python):
```python
from vllm import LLM, SamplingParams
from vllm.lora.request import LoRARequest

llm = LLM(model="meta-llama/Llama-2-7b-hf", enable_lora=True)
```

---

## LoRA Resolver Plugins - vLLM

**URL:** https://docs.vllm.ai/en/latest/design/lora_resolver_plugins/

**Contents:**
- LoRA Resolver Plugins¶
- Overview¶
- Prerequisites¶
  - Required Environment Variables¶
  - Optional Environment Variables¶
- Available Resolvers¶
  - lora_filesystem_resolver¶
    - Setup Steps¶
    - Directory Structure Requirements¶
    - Usage Example¶

This directory contains vLLM's LoRA resolver plugins built on the LoRAResolver framework. They automatically discover and load LoRA adapters from a specified local storage path, eliminating the need for manual configuration or server restarts.

LoRA Resolver Plugins provide a flexible way to dynamically load LoRA adapters at runtime. When vLLM receives a request for a LoRA adapter that hasn't been loaded yet, the resolver plugins will attempt to locate and load the adapter from their configured storage locations. This enables:

Before using LoRA Resolver Plugins, ensure the following environment variables are configured:

VLLM_ALLOW_RUNTIME_LORA_UPDATING: Must be set to true or 1 to enable dynamic LoRA loading

VLLM_PLUGINS: Must include the desired resolver plugins (comma-separated list)

VLLM_LORA_RESOLVER_CACHE_DIR: Must be set to a valid directory path for filesystem resolver

The filesystem resolver is installed with vLLM by default and enables loading LoRA adapters from a local directory structure.

Create the LoRA adapter storage directory:

Set environment variables:

Start vLLM server: Your base model can be meta-llama/Llama-2-7b-hf. Please make sure you set up the Hugging Face token in your env var export HF_TOKEN=xxx235.

The filesystem resolver expects LoRA adapters to be organized in the following structure:

Each adapter directory must contain:

adapter_config.json: Required configuration file with the following structure:

adapter_model.bin: The LoRA adapter weights file

Prepare your LoRA adapter:

Verify the directory structure:

Make a request using the adapter:

You can configure multiple resolver plugins to load adapters from different sources:

'lora_s3_resolver' is an example of a custom resolver you would need to implement

All listed resolvers are enabled; at request time, vLLM tries them in order until one succeeds.

To implement your own resolver plugin:

Create a new resolver class:

Register the resolver:

Check file permissions on the directory

"LoRA adapter not found"

Ensure adapter_model.bin exists in the directory

"Invalid adapter configuration"

Ensure target_modules is properly configured

"LoRA rank exceeds maximum"

Enable debug logging:

Verify environment variables:

Test adapter configuration:

**Examples:**

Example 1 (unknown):
```unknown
export VLLM_ALLOW_RUNTIME_LORA_UPDATING=true
```

Example 2 (unknown):
```unknown
export VLLM_ALLOW_RUNTIME_LORA_UPDATING=true
```

Example 3 (unknown):
```unknown
export VLLM_PLUGINS=lora_filesystem_resolver
```

Example 4 (unknown):
```unknown
export VLLM_PLUGINS=lora_filesystem_resolver
```

---

## lora - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/config/lora/

**Contents:**
- vllm.config.lora ¶
- LoRADType module-attribute ¶
- LoRAExtraVocabSize module-attribute ¶
- MaxLoRARanks module-attribute ¶
- logger module-attribute ¶
- LoRAConfig ¶
  - default_mm_loras class-attribute instance-attribute ¶
  - fully_sharded_loras class-attribute instance-attribute ¶
  - lora_dtype class-attribute instance-attribute ¶
  - max_cpu_loras class-attribute instance-attribute ¶

Configuration for LoRA.

Dictionary mapping specific modalities to LoRA model paths; this field is only applicable to multimodal models and should be leveraged when a model always expects a LoRA to be active when a given modality is present. Note that currently, if a request provides multiple additional modalities, each of which have their own LoRA, we do NOT apply default_mm_loras because we currently only support one lora adapter per prompt. When run in offline mode, the lora IDs for n modalities will be automatically assigned to 1-n with the names of the modalities in alphabetic order.

By default, only half of the LoRA computation is sharded with tensor parallelism. Enabling this will use the fully sharded layers. At high sequence length, max rank or tensor parallel size, this is likely faster.

Data type for LoRA. If auto, will default to base model dtype.

Maximum number of LoRAs to store in CPU memory. Must be >= than max_loras.

Max number of LoRAs in a single batch.

WARNING: Whenever a new field is added to this config, ensure that it is included in the factors list if it affects the computation graph.

Provide a hash that uniquely identifies all the configs that affect the structure of the computation graph from input ids/embeddings to the final hidden states, excluding anything before input ids/embeddings and after the final hidden states.

**Examples:**

Example 1 (unknown):
```unknown
LoRADType = Literal['auto', 'float16', 'bfloat16']
```

Example 2 (unknown):
```unknown
LoRADType = Literal['auto', 'float16', 'bfloat16']
```

Example 3 (unknown):
```unknown
LoRAExtraVocabSize = Literal[256, 512]
```

Example 4 (unknown):
```unknown
LoRAExtraVocabSize = Literal[256, 512]
```

---

## LoRA With Quantization Inference - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/offline_inference/lora_with_quantization_inference/

**Contents:**
- LoRA With Quantization Inference¶

Source https://github.com/vllm-project/vllm/blob/main/examples/offline_inference/lora_with_quantization_inference.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use LoRA with different quantization techniques
for offline inference.

Requires HuggingFace credentials for access.
"""

import gc

import torch
from huggingface_hub import snapshot_download

from vllm import EngineArgs, LLMEngine, RequestOutput, SamplingParams
from vllm.lora.request import LoRARequest


def create_test_prompts(
    lora_path: str,
) -> list[tuple[str, SamplingParams, LoRARequest | None]]:
    return [
        # this is an example of using quantization without LoRA
        (
            "My name is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            None,
        ),
        # the next three examples use quantization with LoRA
        (
            "my name is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("lora-test-1", 1, lora_path),
        ),
        (
            "The capital of USA is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("lora-test-2", 1, lora_path),
        ),
        (
            "The capital of France is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("lora-test-3", 1, lora_path),
        ),
    ]


def process_requests(
    engine: LLMEngine,
    test_prompts: list[tuple[str, SamplingParams, LoRARequest | None]],
):
    """Continuously process a list of prompts and handle the outputs."""
    request_id = 0

    while test_prompts or engine.has_unfinished_requests():
        if test_prompts:
            prompt, sampling_params, lora_request = test_prompts.pop(0)
            engine.add_request(
                str(request_id), prompt, sampling_params, lora_request=lora_request
            )
            request_id += 1

        request_outputs: list[RequestOutput] = engine.step()
        for request_output in request_outputs:
            if request_output.finished:
                print("----------------------------------------------------")
                print(f"Prompt: {request_output.prompt}")
                print(f"Output: {request_output.outputs[0].text}")


def initialize_engine(
    model: str, quantization: str, lora_repo: str | None
) -> LLMEngine:
    """Initialize the LLMEngine."""

    engine_args = EngineArgs(
        model=model,
        quantization=quantization,
        enable_lora=True,
        max_lora_rank=64,
        max_loras=4,
    )
    return LLMEngine.from_engine_args(engine_args)


def main():
    """Main function that sets up and runs the prompt processing."""

    test_configs = [
        # QLoRA (https://arxiv.org/abs/2305.14314)
        {
            "name": "qlora_inference_example",
            "model": "huggyllama/llama-7b",
            "quantization": "bitsandbytes",
            "lora_repo": "timdettmers/qlora-flan-7b",
        },
        {
            "name": "AWQ_inference_with_lora_example",
            "model": "TheBloke/TinyLlama-1.1B-Chat-v0.3-AWQ",
            "quantization": "awq",
            "lora_repo": "jashing/tinyllama-colorist-lora",
        },
        {
            "name": "GPTQ_inference_with_lora_example",
            "model": "TheBloke/TinyLlama-1.1B-Chat-v0.3-GPTQ",
            "quantization": "gptq",
            "lora_repo": "jashing/tinyllama-colorist-lora",
        },
    ]

    for test_config in test_configs:
        print(f"~~~~~~~~~~~~~~~~ Running: {test_config['name']} ~~~~~~~~~~~~~~~~")
        engine = initialize_engine(
            test_config["model"], test_config["quantization"], test_config["lora_repo"]
        )
        lora_path = snapshot_download(repo_id=test_config["lora_repo"])
        test_prompts = create_test_prompts(lora_path)
        process_requests(engine, test_prompts)

        # Clean up the GPU memory for the next test
        del engine
        gc.collect()
        torch.cuda.empty_cache()


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use LoRA with different quantization techniques
for offline inference.

Requires HuggingFace credentials for access.
"""

import gc

import torch
from huggingface_hub import snapshot_download

from vllm import EngineArgs, LLMEngine, RequestOutput, SamplingParams
from vllm.lora.request import LoRARequest


def create_test_prompts(
    lora_path: str,
) -> list[tuple[str, SamplingParams, LoRARequest | None]]:
    return [
        # this is an example of using quantization without LoRA
        (
            "My name is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            None,
        ),
        # the next three examples use quantization with LoRA
        (
            "my name is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("lora-test-1", 1, lora_path),
        ),
        (
            "The capital of USA is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("lora-test-2", 1, lora_path),
        ),
        (
            "The capital of France is",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("lora-test-3", 1, lora_path),
        ),
    ]


def process_requests(
    engine: LLMEngine,
    test_prompts: list[tuple[str, SamplingParams, LoRARequest | None]],
):
    """Continuously process a list of prompts and handle the outputs."""
    request_id = 0

    while test_prompts or engine.has_unfinished_requests():
        if test_prompts:
            prompt, sampling_params, lora_request = test_prompts.pop(0)
            engine.add_request(
                str(request_id), prompt, sampling_params, lora_request=lora_request
            )
            request_id += 1

        request_outputs: list[RequestOutput] = engine.step()
        for request_output in request_outputs:
            if request_output.finished:
                print("----------------------------------------------------")
                print(f"Prompt: {request_output.prompt}")
                print(f"Output: {request_output.outputs[0].text}")


def initialize_engine(
    model: str, quantization: str, lora_repo: str | None
) -> LLMEngine:
    """Initialize the LLMEngine."""

    engine_args = EngineArgs(
        model=model,
        quantization=quantization,
        enable_lora=True,
        max_lora_rank=64,
        max_loras=4,
    )
    return LLMEngine.from_engine_args(engine_args)


def main():
    """Main function that sets up and runs the prompt processing."""

    test_configs = [
        # QLoRA (https://arxiv.org/abs/2305.14314)
        {
            "name": "qlora_inference_example",
            "model": "huggyllama/llama-7b",
            "quantization": "bitsandbytes",
            "lora_repo": "timdettmers/qlora-flan-7b",
        },
        {
            "name": "AWQ_inference_with_lora_example",
            "model": "TheBloke/TinyLlama-1.1B-Chat-v0.3-AWQ",
            "quantization": "awq",
            "lora_repo": "jashing/tinyllama-colorist-lora",
        },
        {
            "name": "GPTQ_inference_with_lora_example",
            "model": "TheBloke/TinyLlama-1.1B-Chat-v0.3-GPTQ",
            "quantization": "gptq",
            "lora_repo": "jashing/tinyllama-colorist-lora",
        },
    ]

    for test_config in test_configs:
        print(f"~~~~~~~~~~~~~~~~ Running: {test_config['name']} ~~~~~~~~~~~~~~~~")
        engine = initialize_engine(
            test_config["model"], test_config["quantization"], test_config["lora_repo"]
        )
        lora_path = snapshot_download(repo_id=test_config["lora_repo"])
        test_prompts = create_test_prompts(lora_path)
        process_requests(engine, test_prompts)

        # Clean up the GPU memory for the next test
        del engine
        gc.collect()
        torch.cuda.empty_cache()


if __name__ == "__main__":
    main()
```

---

## MooncakeConnector Usage Guide - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/mooncake_connector_usage/

**Contents:**
- MooncakeConnector Usage Guide¶
- About Mooncake¶
- Prerequisites¶
  - Installation¶
- Usage¶
  - Prefiller Node (192.168.0.2)¶
  - Decoder Node (192.168.0.3)¶
  - Proxy¶
- Environment Variables¶
- KV Role Options¶

Mooncake aims to enhance the inference efficiency of large language models (LLMs), especially in slow object storage environments, by constructing a multi-level caching pool on high-speed interconnected DRAM/SSD resources. Compared to traditional caching systems, Mooncake utilizes (GPUDirect) RDMA technology to transfer data directly in a zero-copy manner, while maximizing the use of multi-NIC resources on a single machine.

For more details about Mooncake, please refer to Mooncake project and Mooncake documents.

Install mooncake through pip: uv pip install mooncake-transfer-engine.

Refer to Mooncake official repository for more installation instructions

NOTE: The Mooncake Connector currently uses the proxy from nixl_integration. This will be replaced with a self-developed proxy in the future.

Now you can send requests to the proxy server through port 8000.

VLLM_MOONCAKE_BOOTSTRAP_PORT: Port for Mooncake bootstrap server

VLLM_MOONCAKE_ABORT_REQUEST_TIMEOUT: Timeout (in seconds) for automatically releasing the prefiller’s KV cache for a particular request. (Optional)

**Examples:**

Example 1 (json):
```json
vllm serve Qwen/Qwen2.5-7B-Instruct --port 8010 --kv-transfer-config '{"kv_connector":"MooncakeConnector","kv_role":"kv_producer"}'
```

Example 2 (json):
```json
vllm serve Qwen/Qwen2.5-7B-Instruct --port 8010 --kv-transfer-config '{"kv_connector":"MooncakeConnector","kv_role":"kv_producer"}'
```

Example 3 (json):
```json
vllm serve Qwen/Qwen2.5-7B-Instruct --port 8020 --kv-transfer-config '{"kv_connector":"MooncakeConnector","kv_role":"kv_consumer"}'
```

Example 4 (json):
```json
vllm serve Qwen/Qwen2.5-7B-Instruct --port 8020 --kv-transfer-config '{"kv_connector":"MooncakeConnector","kv_role":"kv_consumer"}'
```

---

## MultiLoRA Inference - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/offline_inference/multilora_inference/

**Contents:**
- MultiLoRA Inference¶

Source https://github.com/vllm-project/vllm/blob/main/examples/offline_inference/multilora_inference.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use the multi-LoRA functionality
for offline inference.

Requires HuggingFace credentials for access to Llama2.
"""

from huggingface_hub import snapshot_download

from vllm import EngineArgs, LLMEngine, RequestOutput, SamplingParams
from vllm.lora.request import LoRARequest


def create_test_prompts(
    lora_path: str,
) -> list[tuple[str, SamplingParams, LoRARequest | None]]:
    """Create a list of test prompts with their sampling parameters.

    2 requests for base model, 4 requests for the LoRA. We define 2
    different LoRA adapters (using the same model for demo purposes).
    Since we also set `max_loras=1`, the expectation is that the requests
    with the second LoRA adapter will be run after all requests with the
    first adapter have finished.
    """
    return [
        (
            "A robot may not injure a human being",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            None,
        ),
        (
            "To be or not to be,",
            SamplingParams(
                temperature=0.8, top_k=5, presence_penalty=0.2, max_tokens=128
            ),
            None,
        ),
        (
            "[user] Write a SQL query to answer the question based on the table schema.\n\n context: CREATE TABLE table_name_74 (icao VARCHAR, airport VARCHAR)\n\n question: Name the ICAO for lilongwe international airport [/user] [assistant]",  # noqa: E501
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("sql-lora", 1, lora_path),
        ),
        (
            "[user] Write a SQL query to answer the question based on the table schema.\n\n context: CREATE TABLE table_name_74 (icao VARCHAR, airport VARCHAR)\n\n question: Name the ICAO for lilongwe international airport [/user] [assistant]",  # noqa: E501
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("sql-lora2", 2, lora_path),
        ),
    ]


def process_requests(
    engine: LLMEngine,
    test_prompts: list[tuple[str, SamplingParams, LoRARequest | None]],
):
    """Continuously process a list of prompts and handle the outputs."""
    request_id = 0

    print("-" * 50)
    while test_prompts or engine.has_unfinished_requests():
        if test_prompts:
            prompt, sampling_params, lora_request = test_prompts.pop(0)
            engine.add_request(
                str(request_id), prompt, sampling_params, lora_request=lora_request
            )
            request_id += 1

        request_outputs: list[RequestOutput] = engine.step()

        for request_output in request_outputs:
            if request_output.finished:
                print(request_output)
                print("-" * 50)


def initialize_engine() -> LLMEngine:
    """Initialize the LLMEngine."""
    # max_loras: controls the number of LoRAs that can be used in the same
    #   batch. Larger numbers will cause higher memory usage, as each LoRA
    #   slot requires its own preallocated tensor.
    # max_lora_rank: controls the maximum supported rank of all LoRAs. Larger
    #   numbers will cause higher memory usage. If you know that all LoRAs will
    #   use the same rank, it is recommended to set this as low as possible.
    # max_cpu_loras: controls the size of the CPU LoRA cache.
    engine_args = EngineArgs(
        model="meta-llama/Llama-3.2-3B-Instruct",
        enable_lora=True,
        max_loras=1,
        max_lora_rank=8,
        max_cpu_loras=2,
        max_num_seqs=256,
    )
    return LLMEngine.from_engine_args(engine_args)


def main():
    """Main function that sets up and runs the prompt processing."""
    engine = initialize_engine()
    lora_path = snapshot_download(repo_id="jeeejeee/llama32-3b-text2sql-spider")
    test_prompts = create_test_prompts(lora_path)
    process_requests(engine, test_prompts)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This example shows how to use the multi-LoRA functionality
for offline inference.

Requires HuggingFace credentials for access to Llama2.
"""

from huggingface_hub import snapshot_download

from vllm import EngineArgs, LLMEngine, RequestOutput, SamplingParams
from vllm.lora.request import LoRARequest


def create_test_prompts(
    lora_path: str,
) -> list[tuple[str, SamplingParams, LoRARequest | None]]:
    """Create a list of test prompts with their sampling parameters.

    2 requests for base model, 4 requests for the LoRA. We define 2
    different LoRA adapters (using the same model for demo purposes).
    Since we also set `max_loras=1`, the expectation is that the requests
    with the second LoRA adapter will be run after all requests with the
    first adapter have finished.
    """
    return [
        (
            "A robot may not injure a human being",
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            None,
        ),
        (
            "To be or not to be,",
            SamplingParams(
                temperature=0.8, top_k=5, presence_penalty=0.2, max_tokens=128
            ),
            None,
        ),
        (
            "[user] Write a SQL query to answer the question based on the table schema.\n\n context: CREATE TABLE table_name_74 (icao VARCHAR, airport VARCHAR)\n\n question: Name the ICAO for lilongwe international airport [/user] [assistant]",  # noqa: E501
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("sql-lora", 1, lora_path),
        ),
        (
            "[user] Write a SQL query to answer the question based on the table schema.\n\n context: CREATE TABLE table_name_74 (icao VARCHAR, airport VARCHAR)\n\n question: Name the ICAO for lilongwe international airport [/user] [assistant]",  # noqa: E501
            SamplingParams(temperature=0.0, logprobs=1, max_tokens=128),
            LoRARequest("sql-lora2", 2, lora_path),
        ),
    ]


def process_requests(
    engine: LLMEngine,
    test_prompts: list[tuple[str, SamplingParams, LoRARequest | None]],
):
    """Continuously process a list of prompts and handle the outputs."""
    request_id = 0

    print("-" * 50)
    while test_prompts or engine.has_unfinished_requests():
        if test_prompts:
            prompt, sampling_params, lora_request = test_prompts.pop(0)
            engine.add_request(
                str(request_id), prompt, sampling_params, lora_request=lora_request
            )
            request_id += 1

        request_outputs: list[RequestOutput] = engine.step()

        for request_output in request_outputs:
            if request_output.finished:
                print(request_output)
                print("-" * 50)


def initialize_engine() -> LLMEngine:
    """Initialize the LLMEngine."""
    # max_loras: controls the number of LoRAs that can be used in the same
    #   batch. Larger numbers will cause higher memory usage, as each LoRA
    #   slot requires its own preallocated tensor.
    # max_lora_rank: controls the maximum supported rank of all LoRAs. Larger
    #   numbers will cause higher memory usage. If you know that all LoRAs will
    #   use the same rank, it is recommended to set this as low as possible.
    # max_cpu_loras: controls the size of the CPU LoRA cache.
    engine_args = EngineArgs(
        model="meta-llama/Llama-3.2-3B-Instruct",
        enable_lora=True,
        max_loras=1,
        max_lora_rank=8,
        max_cpu_loras=2,
        max_num_seqs=256,
    )
    return LLMEngine.from_engine_args(engine_args)


def main():
    """Main function that sets up and runs the prompt processing."""
    engine = initialize_engine()
    lora_path = snapshot_download(repo_id="jeeejeee/llama32-3b-text2sql-spider")
    test_prompts = create_test_prompts(lora_path)
    process_requests(engine, test_prompts)


if __name__ == "__main__":
    main()
```

---

## Multimodal Inputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/multimodal_inputs/

**Contents:**
- Multimodal Inputs¶
- Offline Inference¶
  - Stable UUIDs for Caching (multi_modal_uuids)¶
  - Image Inputs¶
    - Custom RGBA Background Color¶
  - Video Inputs¶
  - Audio Inputs¶
  - Embedding Inputs¶
    - Image Embeddings¶
    - Audio Embedding Inputs¶

This page teaches you how to pass multi-modal inputs to multi-modal models in vLLM.

We are actively iterating on multi-modal support. See this RFC for upcoming changes, and open an issue on GitHub if you have any feedback or feature requests.

When serving multi-modal models, consider setting --allowed-media-domains to restrict domain that vLLM can access to prevent it from accessing arbitrary endpoints that can potentially be vulnerable to Server-Side Request Forgery (SSRF) attacks. You can provide a list of domains for this arg. For example: --allowed-media-domains upload.wikimedia.org github.com www.bogotobogo.com

Also, consider setting VLLM_MEDIA_URL_ALLOW_REDIRECTS=0 to prevent HTTP redirects from being followed to bypass domain restrictions.

This restriction is especially important if you run vLLM in a containerized environment where the vLLM pods may have unrestricted access to internal networks.

To input multi-modal data, follow this schema in vllm.inputs.PromptType:

When using multi-modal inputs, vLLM normally hashes each media item by content to enable caching across requests. You can optionally pass multi_modal_uuids to provide your own stable IDs for each item so caching can reuse work across requests without rehashing the raw content.

Using UUIDs, you can also skip sending media data entirely if you expect cache hits for respective items. Note that the request will fail if the skipped media doesn't have a corresponding UUID, or if the UUID fails to hit the cache.

If both multimodal processor caching and prefix caching are disabled, user-provided multi_modal_uuids are ignored.

You can pass a single image to the 'image' field of the multi-modal dictionary, as shown in the following examples:

Full example: examples/offline_inference/vision_language.py

To substitute multiple images inside the same text prompt, you can pass in a list of images instead:

Full example: examples/offline_inference/vision_language_multi_image.py

If using the LLM.chat method, you can pass images directly in the message content using various formats: image URLs, PIL Image objects, or pre-computed embeddings:

Multi-image input can be extended to perform video captioning. We show this with Qwen2-VL as it supports videos:

When loading RGBA images (images with transparency), vLLM converts them to RGB format. By default, transparent pixels are replaced with white background. You can customize this background color using the rgba_background_color parameter in media_io_kwargs.

You can pass a list of NumPy arrays directly to the 'video' field of the multi-modal dictionary instead of using multi-image input.

Instead of NumPy arrays, you can also pass 'torch.Tensor' instances, as shown in this example using Qwen2.5-VL:

'process_vision_info' is only applicable to Qwen2.5-VL and similar models.

Full example: examples/offline_inference/vision_language.py

You can pass a tuple (array, sampling_rate) to the 'audio' field of the multi-modal dictionary.

Full example: examples/offline_inference/audio_language.py

To input pre-computed embeddings belonging to a data type (i.e. image, video, or audio) directly to the language model, pass a tensor of shape (num_items, feature_size, hidden_size of LM) to the corresponding field of the multi-modal dictionary.

You must enable this feature via enable_mm_embeds=True.

The vLLM engine may crash if incorrect shape of embeddings is passed. Only enable this flag for trusted users!

For Qwen2-VL and MiniCPM-V, we accept additional parameters alongside the embeddings:

For Qwen3-VL, the image_embeds should contain both the base image embedding and deepstack features.

You can pass pre-computed audio embeddings similar to image embeddings:

Our OpenAI-compatible server accepts multi-modal data via the Chat Completions API. Media inputs also support optional UUIDs users can provide to uniquely identify each media, which is used to cache the media results across requests.

A chat template is required to use Chat Completions API. For HF format models, the default chat template is defined inside chat_template.json or tokenizer_config.json.

If no default chat template is available, we will first look for a built-in fallback in vllm/transformers_utils/chat_templates/registry.py. If no fallback is available, an error is raised and you have to provide the chat template manually via the --chat-template argument.

For certain models, we provide alternative chat templates inside examples. For example, VLM2Vec uses examples/template_vlm2vec_phi3v.jinja which is different from the default one for Phi-3-Vision.

Image input is supported according to OpenAI Vision API. Here is a simple example using Phi-3.5-Vision.

First, launch the OpenAI-compatible server:

Then, you can use the OpenAI client as follows:

Full example: examples/online_serving/openai_chat_completion_client_for_multimodal.py

Loading from local file paths is also supported on vLLM: You can specify the allowed local media path via --allowed-local-media-path when launching the API server/engine, and pass the file path as url in the API request.

There is no need to place image placeholders in the text content of the API request - they are already represented by the image content. In fact, you can place image placeholders in the middle of the text by interleaving text and image content.

By default, the timeout for fetching images through HTTP URL is 5 seconds. You can override this by setting the environment variable:

Instead of image_url, you can pass a video file via video_url. Here is a simple example using LLaVA-OneVision.

First, launch the OpenAI-compatible server:

Then, you can use the OpenAI client as follows:

Full example: examples/online_serving/openai_chat_completion_client_for_multimodal.py

By default, the timeout for fetching videos through HTTP URL is 30 seconds. You can override this by setting the environment variable:

To use a custom background color for RGBA images, pass the rgba_background_color parameter via --media-io-kwargs:

Audio input is supported according to OpenAI Audio API. Here is a simple example using Ultravox-v0.5-1B.

First, launch the OpenAI-compatible server:

Then, you can use the OpenAI client as follows:

Alternatively, you can pass audio_url, which is the audio counterpart of image_url for image input:

Full example: examples/online_serving/openai_chat_completion_client_for_multimodal.py

By default, the timeout for fetching audios through HTTP URL is 10 seconds. You can override this by setting the environment variable:

To input pre-computed embeddings belonging to a data type (i.e. image, video, or audio) directly to the language model, pass a tensor of shape (num_items, feature_size, hidden_size of LM) to the corresponding field of the multi-modal dictionary.

You must enable this feature via the --enable-mm-embeds flag in vllm serve.

The vLLM engine may crash if incorrect shape of embeddings is passed. Only enable this flag for trusted users!

For image embeddings, you can pass the base64-encoded tensor to the image_embeds field. The following example demonstrates how to pass image embeddings to the OpenAI server:

For Online Serving, you can also skip sending media if you expect cache hits with provided UUIDs. You can do so by sending media like this:

Multiple messages can now contain {"type": "image_embeds"}, enabling you to pass multiple image embeddings in a single request (similar to regular images). The number of embeddings is limited by --limit-mm-per-prompt.

Important: The embedding shape format differs based on the number of embeddings:

If used with a model that requires additional parameters, you must also provide a tensor for each of them, e.g. image_grid_thw, image_sizes, etc.

**Examples:**

Example 1 (python):
```python
from vllm import LLM
from PIL import Image

# Qwen2.5-VL example with two images
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct")

prompt = "USER: <image><image>\nDescribe the differences.\nASSISTANT:"
img_a = Image.open("/path/to/a.jpg")
img_b = Image.open("/path/to/b.jpg")

outputs = llm.generate({
    "prompt": prompt,
    "multi_modal_data": {"image": [img_a, img_b]},
    # Provide stable IDs for caching.
    # Requirements (matched by this example):
    #  - Include every modality present in multi_modal_data.
    #  - For lists, provide the same number of entries.
    #  - Use None to fall back to content hashing for that item.
    "multi_modal_uuids": {"image": ["sku-1234-a", None]},
})

for o in outputs:
    print(o.outputs[0].text)
```

Example 2 (python):
```python
from vllm import LLM
from PIL import Image

# Qwen2.5-VL example with two images
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct")

prompt = "USER: <image><image>\nDescribe the differences.\nASSISTANT:"
img_a = Image.open("/path/to/a.jpg")
img_b = Image.open("/path/to/b.jpg")

outputs = llm.generate({
    "prompt": prompt,
    "multi_modal_data": {"image": [img_a, img_b]},
    # Provide stable IDs for caching.
    # Requirements (matched by this example):
    #  - Include every modality present in multi_modal_data.
    #  - For lists, provide the same number of entries.
    #  - Use None to fall back to content hashing for that item.
    "multi_modal_uuids": {"image": ["sku-1234-a", None]},
})

for o in outputs:
    print(o.outputs[0].text)
```

Example 3 (python):
```python
from vllm import LLM
from PIL import Image

# Qwen2.5-VL example with two images
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct")

prompt = "USER: <image><image>\nDescribe the differences.\nASSISTANT:"
img_b = Image.open("/path/to/b.jpg")

outputs = llm.generate({
    "prompt": prompt,
    "multi_modal_data": {"image": [None, img_b]},
    # Since img_a is expected to be cached, we can skip sending the actual
    # image entirely.
    "multi_modal_uuids": {"image": ["sku-1234-a", None]},
})

for o in outputs:
    print(o.outputs[0].text)
```

Example 4 (python):
```python
from vllm import LLM
from PIL import Image

# Qwen2.5-VL example with two images
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct")

prompt = "USER: <image><image>\nDescribe the differences.\nASSISTANT:"
img_b = Image.open("/path/to/b.jpg")

outputs = llm.generate({
    "prompt": prompt,
    "multi_modal_data": {"image": [None, img_b]},
    # Since img_a is expected to be cached, we can skip sending the actual
    # image entirely.
    "multi_modal_uuids": {"image": ["sku-1234-a", None]},
})

for o in outputs:
    print(o.outputs[0].text)
```

---

## multimodal - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/config/multimodal/

**Contents:**
- vllm.config.multimodal ¶
- DummyOptions module-attribute ¶
- MMCacheType module-attribute ¶
- MMEncoderTPMode module-attribute ¶
- AudioDummyOptions ¶
  - length class-attribute instance-attribute ¶
- BaseDummyOptions ¶
  - count class-attribute instance-attribute ¶
- ImageDummyOptions ¶
  - height class-attribute instance-attribute ¶

Bases: BaseDummyOptions

Options for generating dummy audio data during profiling.

Base options for generating dummy data during profiling.

Bases: BaseDummyOptions

Options for generating dummy image data during profiling.

Controls the behavior of multimodal models.

If True, enables passing multimodal embeddings: for LLM class, this refers to tensor inputs under multi_modal_data; for the OpenAI-compatible server, this refers to chat messages with content "type": "*_embeds".

WARNING: The vLLM engine may crash if incorrect shape of embeddings is passed. Only enable this flag for trusted users!

Enable fully interleaved support for multimodal prompts, while using --chat-template-content-format=string.

The maximum number of input items and options allowed per prompt for each modality. Defaults to 999 for each modality.

Legacy format (count only):

Configurable format (with options): {"video": {"count": 1, "num_frames": 32, "width": 512, "height": 512}, "image": {"count": 5, "width": 512, "height": 512}}

Mixed format (combining both): {"image": 16, "video": {"count": 1, "num_frames": 32, "width": 512, "height": 512}}

Additional args passed to process media inputs, keyed by modalities. For example, to set num_frames for video, set --media-io-kwargs '{"video": {"num_frames": 40} }'

Optional override for the multi-modal encoder attention backend when using vision transformers. Accepts any value from vllm.attention.backends.registry.AttentionBackendEnum (e.g. FLASH_ATTN).

Indicates how to optimize multi-modal encoder inference using tensor parallelism (TP).

"weights": Within the same vLLM engine, split the weights of each layer across TP ranks. (default TP behavior)

"data": Within the same vLLM engine, split the batched input data across TP ranks to process the data in parallel, while hosting the full weights on each TP rank. This batch-level DP is not to be confused with API request-level DP (which is controlled by --data-parallel-size). This is only supported on a per-model basis and falls back to "weights" if the encoder does not support DP.

The size (in GiB) of the multi-modal processor cache, which is used to avoid re-processing past multi-modal inputs.

This cache is duplicated for each API process and engine core process, resulting in a total memory usage of mm_processor_cache_gb * (api_server_count + data_parallel_size).

Set to 0 to disable this cache completely (not recommended).

Type of cache to use for the multi-modal preprocessor/mapper. If shm, use shared memory FIFO cache. If lru, use mirrored LRU cache.

Arguments to be forwarded to the model's processor for multi-modal data, e.g., image processor. Overrides for the multi-modal processor obtained from transformers.AutoProcessor.from_pretrained.

The available overrides depend on the model that is being run.

For example, for Phi-3-Vision: {"num_crops": 4}.

Size limit (in MiB) for each object stored in the multi-modal processor shared memory cache. Only effective when mm_processor_cache_type is "shm".

When enabled, skips multimodal memory profiling and only profiles with language backbone model during engine initialization.

This reduces engine startup time but shifts the responsibility to users for estimating the peak memory usage of the activation of multimodal encoder and embedding cache.

Sets pruning rate for video pruning via Efficient Video Sampling. Value sits in range [0;1) and determines fraction of media tokens from each video to be pruned.

WARNING: Whenever a new field is added to this config, ensure that it is included in the factors list if it affects the computation graph.

Provide a hash that uniquely identifies all the configs that affect the structure of the computation graph from input ids/embeddings to the final hidden states, excluding anything before input ids/embeddings and after the final hidden states.

Get the configurable dummy data options for a modality. Returns None if no options are configured for this modality.

Get the maximum number of input items allowed per prompt for the given modality (backward compatible).

Get the keyword arguments to pass to the multi-modal processor according to the extra arguments passed during inference.

Bases: BaseDummyOptions

Options for generating dummy video data during profiling.

**Examples:**

Example 1 (typescript):
```typescript
DummyOptions: TypeAlias = (
    BaseDummyOptions
    | VideoDummyOptions
    | ImageDummyOptions
    | AudioDummyOptions
)
```

Example 2 (typescript):
```typescript
DummyOptions: TypeAlias = (
    BaseDummyOptions
    | VideoDummyOptions
    | ImageDummyOptions
    | AudioDummyOptions
)
```

Example 3 (unknown):
```unknown
MMCacheType = Literal['shm', 'lru']
```

Example 4 (unknown):
```unknown
MMCacheType = Literal['shm', 'lru']
```

---

## Multi-Modal Data Processing - vLLM

**URL:** https://docs.vllm.ai/en/latest/design/mm_processing/

**Contents:**
- Multi-Modal Data Processing¶
- Prompt Update Detection¶
- Tokenized Prompt Inputs¶
  - The problem¶
  - Dummy text¶
  - Automatic prompt updating¶
  - Summary¶
- Processor Output Caching¶

To enable various optimizations in vLLM such as chunked prefill and prefix caching, we use BaseMultiModalProcessor to provide the correspondence between placeholder feature tokens (e.g. <image>) and multi-modal inputs (e.g. the raw input image) based on the outputs of HF processor.

Here are the main features of BaseMultiModalProcessor:

One of the main responsibilities of HF processor is to update the prompt with placeholder tokens. For example:

The information about which tokens have been updated is key to finding the correspondence between placeholder feature tokens and multi-modal inputs.

In vLLM, this information is specified using PromptUpdate in _get_prompt_updates. We can automatically detect whether HF has updated the prompt by checking the existence of the updated tokens.

To enable tokenization in a separate process, we support passing input token IDs alongside multi-modal data.

Consider that HF processors follow these main steps:

How can we achieve this without rewriting HF processors? We can try to call the HF processor several times on different inputs:

While HF processors support text + multi-modal inputs natively, this is not so for tokenized + multi-modal inputs: an error is thrown if the number of input placeholder tokens do not correspond to the number of multi-modal inputs.

Moreover, since the tokenized text has not passed through the HF processor, we have to apply Step 3 by ourselves to keep the output tokens and multi-modal data consistent with each other.

We work around the first issue by requiring each model to define how to generate dummy text based on the number of multi-modal inputs, via get_dummy_text. This lets us generate dummy text corresponding to the multi-modal inputs and input them together to obtain the processed multi-modal data.

We address the second issue by implementing model-agnostic code in _apply_prompt_updates to automatically update the prompt with feature placeholder tokens based on the specification outputted by _get_prompt_updates.

With the help of dummy text and automatic prompt updating, our multi-modal processor can finally accept both text and token prompts with multi-modal data. The detailed logic is shown in _apply_hf_processor_main.

Some HF processors, such as the one for Qwen2-VL, are very slow. To alleviate this problem, we cache the multi-modal outputs of HF processor to avoid processing the same multi-modal input (e.g. image) again.

When new data is passed in, we first check which items are in the cache, and which ones are missing. The missing items are passed into the HF processor in a single batch and cached, before being merged with the existing items in the cache.

Since we only process the missing multi-modal data items, the number of input placeholder tokens no longer corresponds to the number of the multi-modal inputs, so they can't be passed alongside the text prompt to HF processor. Therefore, we process the text and multi-modal inputs separately, using dummy text to avoid HF errors. Since this skips HF's prompt updating code, we apply automatic prompt updating afterwards to keep the output tokens and multi-modal data consistent with each other.

---

## Multi-Modal Support - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/model/multimodal/

**Contents:**
- Multi-Modal Support¶
- 1. Update the base vLLM model¶
- 2. Specify processing information¶
  - Maximum number of input items¶
- 3. Specify dummy inputs¶
  - For memory profiling¶
- 4. Specify processing details¶
  - Multi-modal fields¶
  - Prompt updates¶
- 5. Register processor-related classes¶

This document walks you through the steps to extend a basic model so that it accepts multi-modal inputs.

It is assumed that you have already implemented the model in vLLM according to these steps. Further update the model as follows:

Implement get_placeholder_str to define the placeholder string which is used to represent the multi-modal item in the text prompt. This should be consistent with the chat template of the model.

Reserve a keyword parameter in forward for each input tensor that corresponds to a multi-modal input, as shown in the following example:

More conveniently, you can simply pass **kwargs to the forward method and retrieve the keyword parameters for multimodal inputs from it.

Implement embed_multimodal that returns the embeddings from running the multimodal inputs through the multimodal tokenizer of the model. Below we provide a boilerplate of a typical implementation pattern, but feel free to adjust it to your own needs.

The returned multimodal_embeddings must be either a 3D torch.Tensor of shape (num_items, feature_size, hidden_size), or a list / tuple of 2D torch.Tensor's of shape (feature_size, hidden_size), so that multimodal_embeddings[i] retrieves the embeddings generated from the i-th multimodal data item (e.g, image) of the request.

By default, vLLM merges the multimodal embeddings into text embeddings depending on the information of their locations defined in PlaceholderRange from input processing. This logic can be found at embed_input_ids.

You may override this method if additional logic is required for your model when merging embeddings.

Implement get_language_model getter to provide stable access to the underlying language model.

Once the above steps are done, update the model class with the SupportsMultiModal interface.

The model class does not have to be named *ForCausalLM. Check out the HuggingFace Transformers documentation for some examples.

Next, create a subclass of BaseProcessingInfo to provide basic information related to HF processing.

You need to override the abstract method get_supported_mm_limits to return the maximum number of input items for each modality supported by the model.

For example, if the model supports any number of images but only one video per prompt:

Then, inherit BaseDummyInputsBuilder to construct dummy inputs for HF processing as well as memory profiling.

Override the abstract methods get_dummy_text and get_dummy_mm_data to construct dummy inputs for memory profiling. These dummy inputs should result in the worst-case memory usage of the model so that vLLM can reserve the correct amount of memory for it.

Assuming that the memory usage increases with the number of tokens, the dummy inputs can be constructed to maximize the number of output embeddings, which is the same number as placeholder feature tokens.

Looking at the code of HF's LlavaForConditionalGeneration:

The number of placeholder feature tokens per image is image_features.shape[1]. image_features is calculated inside the get_image_features method:

We can infer that image_features.shape[1] is based on image_outputs.hidden_states.shape[1] from the vision tower (CLIPVisionModel for the llava-hf/llava-1.5-7b-hf model). Moreover, we only need the sequence length (the second dimension of the tensor) to get image_features.shape[1]. The sequence length is determined by the initial hidden states in CLIPVisionTransformer since the attention mechanism doesn't change the sequence length of the output hidden states.

To find the sequence length, we turn to the code of CLIPVisionEmbeddings:

We can infer that embeddings.shape[1] == self.num_positions, where

Overall, the number of placeholder feature tokens for an image can be calculated as:

Notice that the number of image tokens doesn't depend on the image width and height. We can simply use a dummy image_size to calculate the multimodal profiling data:

For the text, we simply expand the multimodal image token from the model config to match the desired number of images.

Looking at the code of HF's FuyuForCausalLM:

The number of placeholder feature tokens for the ith item in the batch is patch_embeddings[i].shape[0], which is the same as image_patches[i].shape[0], i.e. num_total_patches.

Unlike LLaVA, Fuyu does not define the number of patches inside the modeling file. Where can we get more information? Considering that the model input comes from the output of FuyuProcessor, let's look at the preprocessing files.

The image outputs are obtained by calling FuyuImageProcessor.preprocess and then FuyuImageProcessor.preprocess_with_tokenizer_info inside FuyuProcessor.

In FuyuImageProcessor.preprocess, the images are resized and padded to the target FuyuImageProcessor.size, returning the dimensions after resizing (but before padding) as metadata.

In FuyuImageProcessor.preprocess_with_tokenizer_info, the images are split into patches based on this metadata:

The number of patches is in turn defined by FuyuImageProcessor.get_num_patches:

These image patches correspond to placeholder tokens (|SPEAKER|). So, we just need to maximize the number of image patches. Since input images are first resized to fit within image_processor.size, we can maximize the number of image patches by inputting an image with size equal to image_processor.size.

Fuyu does not expect image placeholders in the inputs to HF processor, so the dummy prompt text is empty regardless of the number of images.

For the multimodal image profiling data, the logic is very similar to LLaVA:

Afterwards, create a subclass of BaseMultiModalProcessor to fill in the missing details about HF processing.

Multi-Modal Data Processing

Override _get_mm_fields_config to return a schema of the tensors outputted by the HF processor that are related to the input multi-modal items.

The output of CLIPImageProcessor is a simple tensor with shape (num_images, num_channels, image_height, image_width):

So, we override _get_mm_fields_config as follows:

Our actual code additionally supports pre-computed image embeddings, which can be passed to be model via the image_embeds argument.

The image_patches output of FuyuImageProcessor.preprocess_with_tokenizer_info concatenates the patches from each image belonging to an item in the batch:

The shape of image_patches outputted by FuyuImageProcessor is therefore (1, num_images, num_patches, patch_width * patch_height * num_channels).

In order to support the use of MultiModalFieldConfig.batched like in LLaVA, we remove the extra batch dimension by overriding BaseMultiModalProcessor._call_hf_processor:

Our actual code has special handling for text-only inputs to prevent unnecessary warnings from HF processor.

The _call_hf_processor method specifies both mm_kwargs and tok_kwargs for processing. mm_kwargs is used to both initialize and call the huggingface processor, whereas tok_kwargs is only used to call the huggingface processor.

This lets us override _get_mm_fields_config as follows:

Override _get_prompt_updates to return a list of PromptUpdate instances.

Each PromptUpdate instance specifies an update operation (e.g.: insertion, replacement) performed by the HF processor.

Looking at HF's LlavaProcessor:

It simply repeats each input image_token a number of times equal to the number of placeholder feature tokens (num_image_tokens). Based on this, we override _get_prompt_updates as follows:

Recall the layout of feature tokens from Step 2:

We define a helper function to return ncols and nrows directly:

Based on this, we can initially define our replacement tokens as:

However, this is not entirely correct. After FuyuImageProcessor.preprocess_with_tokenizer_info is called, a BOS token (<s>) is also added to the promopt:

To assign the vision embeddings to only the image tokens, instead of a string you can return an instance of PromptUpdateDetails:

Finally, noticing that the HF processor removes the |ENDOFTEXT| token from the tokenized prompt, we can search for it to conduct the replacement at the start of the string:

After you have defined BaseProcessingInfo (Step 2), BaseDummyInputsBuilder (Step 3), and BaseMultiModalProcessor (Step 4), decorate the model class with MULTIMODAL_REGISTRY.register_processor to register them to the multi-modal registry:

Some HF processors directly insert feature tokens without replacing anything in the original prompt. In that case, you can use PromptInsertion instead of PromptReplacement inside _get_prompt_updates.

_get_prompt_updates assumes that each application of prompt update corresponds to one multi-modal item. If the HF processor performs additional processing regardless of how many multi-modal items there are, you should override _apply_hf_processor_tokens_only so that the processed token inputs are consistent with the result of applying the HF processor on text inputs. This is because token inputs bypass the HF processor according to our design.

Some models don't define an HF processor class on HF Hub. In that case, you can define a custom HF processor that has the same call signature as HF processors and pass it to _call_hf_processor.

**Examples:**

Example 1 (python):
```python
class YourModelForImage2Seq(nn.Module):
    ...

    @classmethod
    def get_placeholder_str(cls, modality: str, i: int) -> str | None:
        if modality.startswith("image"):
            return "<image>"

        raise ValueError("Only image modality is supported")
```

Example 2 (python):
```python
class YourModelForImage2Seq(nn.Module):
    ...

    @classmethod
    def get_placeholder_str(cls, modality: str, i: int) -> str | None:
        if modality.startswith("image"):
            return "<image>"

        raise ValueError("Only image modality is supported")
```

Example 3 (python):
```python
def forward(
      self,
      input_ids: torch.Tensor,
      positions: torch.Tensor,
+     pixel_values: torch.Tensor,
  ) -> SamplerOutput:
```

Example 4 (python):
```python
def forward(
      self,
      input_ids: torch.Tensor,
      positions: torch.Tensor,
+     pixel_values: torch.Tensor,
  ) -> SamplerOutput:
```

---

## NixlConnector Usage Guide - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/nixl_connector_usage/

**Contents:**
- NixlConnector Usage Guide¶
- Prerequisites¶
  - Installation¶
  - Transport Configuration¶
- Basic Usage (on the same host)¶
  - Producer (Prefiller) Configuration¶
  - Consumer (Decoder) Configuration¶
  - Proxy Server¶
- Environment Variables¶
- Multi-Instance Setup¶

NixlConnector is a high-performance KV cache transfer connector for vLLM's disaggregated prefilling feature. It provides fully asynchronous send/receive operations using the NIXL library for efficient cross-process KV cache transfer.

Install the NIXL library: uv pip install nixl, as a quick start.

For non-cuda platform, please install nixl with ucx build from source, instructed as below.

NixlConnector uses NIXL library for underlying communication, which supports multiple transport backends. UCX (Unified Communication X) is the primary default transport library used by NIXL. Configure transport environment variables:

When using UCX as the transport backend, NCCL environment variables (like NCCL_IB_HCA, NCCL_SOCKET_IFNAME) are not applicable to NixlConnector, so configure UCX-specific environment variables instead of NCCL variables.

Start a prefiller instance that produces KV caches

Start a decoder instance that consumes KV caches:

Use a proxy server to route requests between prefiller and decoder:

VLLM_NIXL_SIDE_CHANNEL_PORT: Port for NIXL handshake communication

VLLM_NIXL_SIDE_CHANNEL_HOST: Host for side channel communication

VLLM_NIXL_ABORT_REQUEST_TIMEOUT: Timeout (in seconds) for automatically releasing the prefiller’s KV cache for a particular request. (Optional)

For multi-host DP deployment, only need to provide the host/port of the head instances.

NixlConnector currently does not distinguish kv_role; the actual prefiller/decoder roles are determined by the upper-level proxy (e.g., toy_proxy_server.py using --prefiller-hosts and --decoder-hosts). Therefore, kv_role in --kv-transfer-config is effectively a placeholder and does not affect NixlConnector's behavior.

Support use case: Prefill with 'HND' and decode with 'NHD' with experimental configuration

Refer to these example scripts in the vLLM repository:

**Examples:**

Example 1 (unknown):
```unknown
python tools/install_nixl_from_source_ubuntu.py
```

Example 2 (unknown):
```unknown
python tools/install_nixl_from_source_ubuntu.py
```

Example 3 (markdown):
```markdown
# Example UCX configuration, adjust according to your environment
export UCX_TLS=all  # or specify specific transports like "rc,ud,sm,^cuda_ipc" ..etc
export UCX_NET_DEVICES=all  # or specify network devices like "mlx5_0:1,mlx5_1:1"
```

Example 4 (markdown):
```markdown
# Example UCX configuration, adjust according to your environment
export UCX_TLS=all  # or specify specific transports like "rc,ud,sm,^cuda_ipc" ..etc
export UCX_NET_DEVICES=all  # or specify network devices like "mlx5_0:1,mlx5_1:1"
```

---

## NVIDIA Model Optimizer - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/modelopt/

**Contents:**
- NVIDIA Model Optimizer¶
- Supported ModelOpt checkpoint formats¶
- Quantizing HuggingFace Models with PTQ¶
- Running the OpenAI-compatible server¶
- Testing (local checkpoints)¶

The NVIDIA Model Optimizer is a library designed to optimize models for inference with NVIDIA GPUs. It includes tools for Post-Training Quantization (PTQ) and Quantization Aware Training (QAT) of Large Language Models (LLMs), Vision Language Models (VLMs), and diffusion models.

We recommend installing the library with:

vLLM detects ModelOpt checkpoints via hf_quant_config.json and supports the following quantization.quant_algo values:

You can quantize HuggingFace models using the example scripts provided in the Model Optimizer repository. The primary script for LLM PTQ is typically found within the examples/llm_ptq directory.

Below is an example showing how to quantize a model using modelopt's PTQ API:

After the model is quantized, you can export it to a quantized checkpoint using the export API:

The quantized checkpoint can then be deployed with vLLM. As an example, the following code shows how to deploy nvidia/Llama-3.1-8B-Instruct-FP8, which is the FP8 quantized checkpoint derived from meta-llama/Llama-3.1-8B-Instruct, using vLLM:

To serve a local ModelOpt checkpoint via the OpenAI-compatible API:

vLLM's ModelOpt unit tests are gated by local checkpoint paths and are skipped by default in CI. To run the tests locally:

**Examples:**

Example 1 (unknown):
```unknown
pip install nvidia-modelopt
```

Example 2 (unknown):
```unknown
pip install nvidia-modelopt
```

Example 3 (python):
```python
import modelopt.torch.quantization as mtq
from transformers import AutoModelForCausalLM

# Load the model from HuggingFace
model = AutoModelForCausalLM.from_pretrained("<path_or_model_id>")

# Select the quantization config, for example, FP8
config = mtq.FP8_DEFAULT_CFG

# Define a forward loop function for calibration
def forward_loop(model):
    for data in calib_set:
        model(data)

# PTQ with in-place replacement of quantized modules
model = mtq.quantize(model, config, forward_loop)
```

Example 4 (python):
```python
import modelopt.torch.quantization as mtq
from transformers import AutoModelForCausalLM

# Load the model from HuggingFace
model = AutoModelForCausalLM.from_pretrained("<path_or_model_id>")

# Select the quantization config, for example, FP8
config = mtq.FP8_DEFAULT_CFG

# Define a forward loop function for calibration
def forward_loop(model):
    for data in calib_set:
        model(data)

# PTQ with in-place replacement of quantized modules
model = mtq.quantize(model, config, forward_loop)
```

---

## Prompt Embedding Inputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/prompt_embeds/

**Contents:**
- Prompt Embedding Inputs¶
- What are prompt embeddings?¶
- Offline Inference¶
  - Hugging Face Transformers Inputs¶
- Online Serving¶
  - Transformers Inputs via OpenAI Client¶

This page teaches you how to pass prompt embedding inputs to vLLM.

The traditional flow of text data for a Large Language Model goes from text to token ids (via a tokenizer) then from token ids to prompt embeddings. For a traditional decoder-only model (such as meta-llama/Llama-3.1-8B-Instruct), this step of converting token ids to prompt embeddings happens via a look-up from a learned embedding matrix, but the model is not limited to processing only the embeddings corresponding to its token vocabulary.

To input multi-modal data, follow this schema in vllm.inputs.EmbedsPrompt:

You can pass prompt embeddings from Hugging Face Transformers models to the 'prompt_embeds' field of the prompt embedding dictionary, as shown in the following examples:

examples/offline_inference/prompt_embed_inference.py

Our OpenAI-compatible server accepts prompt embeddings inputs via the Completions API. Prompt embeddings inputs are added via a new 'prompt_embeds' key in the JSON package and are enabled by the --enable-prompt-embeds flag in vllm serve.

When a mixture of 'prompt_embeds' and 'prompt' inputs are provided in a single request, the prompt embeds are always returned first.

Prompt embeddings are passed in as base64 encoded torch tensors.

The vLLM engine may crash if incorrect shape of embeddings is passed. Only enable this flag for trusted users!

First, launch the OpenAI-compatible server:

Then, you can use the OpenAI client as follows:

examples/online_serving/prompt_embed_inference_with_openai_client.py

**Examples:**

Example 1 (unknown):
```unknown
vllm serve meta-llama/Llama-3.2-1B-Instruct --runner generate \
  --max-model-len 4096 --enable-prompt-embeds
```

Example 2 (unknown):
```unknown
vllm serve meta-llama/Llama-3.2-1B-Instruct --runner generate \
  --max-model-len 4096 --enable-prompt-embeds
```

---

## Quantization - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/

**Contents:**
- Quantization¶
- Supported Hardware¶

Quantization trades off model precision for smaller memory footprint, allowing large models to be run on a wider range of devices.

The table below shows the compatibility of various quantization implementations with different hardware platforms in vLLM:

For information on quantization support on Google TPU, please refer to the TPU-Inference Recommended Models and Features documentation.

This compatibility chart is subject to change as vLLM continues to evolve and expand its support for different hardware platforms and quantization methods.

For the most up-to-date information on hardware support and quantization methods, please refer to vllm/model_executor/layers/quantization or consult with the vLLM development team.

---

## Quantized KV Cache - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache/

**Contents:**
- Quantized KV Cache¶
- FP8 KV Cache¶
  - FP8 Formats¶
  - Current Limitations¶
  - How FP8 KV Cache Works¶
  - Performance Impact¶
- Usage Example¶
- Calibrated Scales for Better Accuracy¶
  - Installation¶
  - Example Usage¶

Quantizing the KV cache to FP8 reduces its memory footprint. This increases the number of tokens that can be stored in the cache, improving throughput.

OCP (Open Compute Project) specifies two common 8-bit floating point data formats:

The E4M3 format offers higher precision compared to E5M2. However, due to its small dynamic range (±240.0), E4M3 typically requires a higher-precision (FP32) scaling factor alongside each quantized tensor.

For now, only per-tensor (scalar) scaling factors are supported. Development is ongoing to support scaling factors of a finer granularity (e.g. per-channel).

The FP8 KV cache implementation follows this workflow:

This means the final attention computation operates on dequantized values, not FP8 tensors. The quantization reduces memory usage during storage but maintains computation accuracy by using higher precision during the actual attention operations.

The current FP8 KV cache implementation primarily benefits throughput by allowing approximately double the amount of space for KV cache allocation. This enables either:

However, there are currently no latency improvements as the implementation does not yet include fused dequantization and attention operations. Future releases will support quantized attention with hardware acceleration, which should provide additional performance benefits. While the most recent silicon offerings (e.g. AMD MI300, NVIDIA Hopper or later) support native hardware conversion between FP8 and other formats (fp32, fp16, bf16), this benefit is not yet fully realized.

Studies have shown that FP8 E4M3 quantization typically only minimally degrades inference accuracy, making it a practical choice for throughput optimization.

Here is an example of how to enable FP8 quantization:

The kv_cache_dtype argument specifies the data type for KV cache storage:

For optimal model quality when using FP8 KV Cache, we recommend using calibrated scales tuned to representative inference data. LLM Compressor is the recommended tool for this process.

First, install the required dependencies:

Here's a complete example using meta-llama/Llama-3.1-8B-Instruct (most models can use this same pattern):

The above script will create a folder in your current directory containing your quantized model (e.g., Llama-3.1-8B-Instruct-FP8-KV) with calibrated scales.

When running the model you must specify kv_cache_dtype="fp8" in order to enable the kv cache quantization and use the scales.

**Examples:**

Example 1 (python):
```python
# To calculate kv cache scales on the fly enable the calculate_kv_scales
# parameter

from vllm import LLM, SamplingParams

sampling_params = SamplingParams(temperature=0.7, top_p=0.8)
llm = LLM(
    model="meta-llama/Llama-2-7b-chat-hf",
    kv_cache_dtype="fp8",
    calculate_kv_scales=True,
)
prompt = "London is the capital of"
out = llm.generate(prompt, sampling_params)[0].outputs[0].text
print(out)
```

Example 2 (python):
```python
# To calculate kv cache scales on the fly enable the calculate_kv_scales
# parameter

from vllm import LLM, SamplingParams

sampling_params = SamplingParams(temperature=0.7, top_p=0.8)
llm = LLM(
    model="meta-llama/Llama-2-7b-chat-hf",
    kv_cache_dtype="fp8",
    calculate_kv_scales=True,
)
prompt = "London is the capital of"
out = llm.generate(prompt, sampling_params)[0].outputs[0].text
print(out)
```

Example 3 (unknown):
```unknown
pip install llmcompressor
```

Example 4 (unknown):
```unknown
pip install llmcompressor
```

---

## Reasoning Outputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/reasoning_outputs/

**Contents:**
- Reasoning Outputs¶
- Supported Models¶
- Quickstart¶
- Streaming chat completions¶
- Tool Calling¶
- Limitations¶
- How to support a new reasoning model¶

vLLM offers support for reasoning models like DeepSeek R1, which are designed to generate outputs containing both reasoning steps and final conclusions.

Reasoning models return an additional reasoning field in their outputs, which contains the reasoning steps that led to the final conclusion. This field is not present in the outputs of other models.

reasoning used to be called reasoning_content. For now, reasoning_content will continue to work. However, we encourage you to migrate to reasoning in case reasoning_content is removed in future.

vLLM currently supports the following reasoning models:

IBM Granite 3.2 and DeepSeek-V3.1 reasoning is disabled by default; to enable it, you must also pass thinking=True in your chat_template_kwargs. The reasoning feature for the Qwen3 series is enabled by default. To disable it, you must pass enable_thinking=False in your chat_template_kwargs. DeepSeek-V3.1 tool calling is supported in non-thinking mode. Holo2 reasoning is enabled by default. To disable it, you must also pass thinking=False in your chat_template_kwargs.

To use reasoning models, you need to specify the --reasoning-parser flags when making a request to the chat completion endpoint. The --reasoning-parser flag specifies the reasoning parser to use for extracting reasoning content from the model output.

Next, make a request to the model that should return the reasoning content in the response.

The reasoning field contains the reasoning steps that led to the final conclusion, while the content field contains the final conclusion.

Streaming chat completions are also supported for reasoning models. The reasoning field is available in the delta field in chat completion response chunks.

OpenAI Python client library does not officially support reasoning attribute for streaming output. But the client supports extra attributes in the response. You can use hasattr to check if the reasoning attribute is present in the response. For example:

Remember to check whether the reasoning exists in the response before accessing it. You could check out the example.

The reasoning content is also available when both tool calling and the reasoning parser are enabled. Additionally, tool calling only parses functions from the content field, not from the reasoning.

For more examples, please refer to examples/online_serving/openai_chat_completion_tool_calls_with_reasoning.py.

You can add a new ReasoningParser similar to vllm/reasoning/deepseek_r1_reasoning_parser.py.

Additionally, to enable structured output, you'll need to create a new Reasoner similar to the one in vllm/reasoning/deepseek_r1_reasoning_parser.py.

The structured output engine like xgrammar will use end_token_id to check if the reasoning content is present in the model output and skip the structured output if it is the case.

Finally, you can enable reasoning for the model by using the --reasoning-parser flags.

**Examples:**

Example 1 (unknown):
```unknown
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
    --reasoning-parser deepseek_r1
```

Example 2 (unknown):
```unknown
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
    --reasoning-parser deepseek_r1
```

Example 3 (python):
```python
from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

models = client.models.list()
model = models.data[0].id

# Round 1
messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
# For granite, add: `extra_body={"chat_template_kwargs": {"thinking": True}}`
# For Qwen3 series, if you want to disable thinking in reasoning mode, add:
# extra_body={"chat_template_kwargs": {"enable_thinking": False}}
response = client.chat.completions.create(model=model, messages=messages)

reasoning = response.choices[0].message.reasoning
content = response.choices[0].message.content

print("reasoning:", reasoning)
print("content:", content)
```

Example 4 (python):
```python
from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

models = client.models.list()
model = models.data[0].id

# Round 1
messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
# For granite, add: `extra_body={"chat_template_kwargs": {"thinking": True}}`
# For Qwen3 series, if you want to disable thinking in reasoning mode, add:
# extra_body={"chat_template_kwargs": {"enable_thinking": False}}
response = client.chat.completions.create(model=model, messages=messages)

reasoning = response.choices[0].message.reasoning
content = response.choices[0].message.content

print("reasoning:", reasoning)
print("content:", content)
```

---

## renderer - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/renderer/

**Contents:**
- vllm.entrypoints.renderer ¶
- BaseRenderer ¶
  - model_config instance-attribute ¶
  - tokenizer instance-attribute ¶
  - __init__ ¶
  - load_prompt_embeds ¶
  - render_prompt abstractmethod async ¶
  - render_prompt_and_embeds abstractmethod async ¶
- CompletionRenderer ¶
  - async_tokenizer instance-attribute ¶

Base class for unified input processing and rendering.

The Renderer serves as a unified input processor that consolidates tokenization, chat template formatting, and multimodal input handling into a single component. It converts high-level API requests (OpenAI-style JSON) into token IDs and multimodal features ready for engine consumption.

Key responsibilities: - Convert text prompts to token sequences with proper special tokens - Apply chat templates and format conversations - Handle multimodal inputs (images, audio, etc.) when applicable - Manage prompt truncation and length validation - Provide clean separation between API layer and engine core

Load and validate base64-encoded embeddings into prompt objects.

Convert text or token inputs into engine-ready TokensPrompt objects.

This method accepts text or token inputs and produces a list of TokensPrompt objects for the engine.

One of: - str: Single text prompt. - list[str]: Batch of text prompts. - list[int]: Single pre-tokenized sequence. - list[list[int]]: Batch of pre-tokenized sequences.

Render configuration controlling how prompts are prepared (e.g., tokenization and length handling).

list[TokensPrompt]: Engine-ready token prompts.

If input formats are invalid or length limits exceeded.

Convert text/token and/or base64-encoded embeddings inputs into engine-ready prompt objects using a unified RenderConfig.

At least one of prompt_or_prompts or prompt_embeds must be provided and non-empty. If both are omitted or empty (e.g., empty string and empty list), a ValueError is raised.

Text or token inputs to include.

Base64-encoded bytes (or list thereof) containing a torch-saved tensor to be used as prompt embeddings.

Render configuration controlling how prompts are prepared (e.g., tokenization and length handling).

list[Union[TokensPrompt, EmbedsPrompt]]: Engine-ready prompt objects.

If both prompt_or_prompts and prompt_embeds are omitted or empty (decoder prompt cannot be empty), or if length limits are exceeded.

Tokenize text input asynchronously.

Optionally detokenize token IDs and build a tokens prompt.

Create validated TokensPrompt.

Get or create async tokenizer using shared pool.

Apply truncation to token sequence.

Implementation of prompt rendering for completion-style requests.

Uses async tokenizer pooling for improved performance. See base class for detailed parameter documentation.

Render text/token prompts and/or precomputed embedding prompts. At least one of prompt_or_prompts or prompt_embeds must be provided.

Configuration to control how prompts are prepared.

Whether to add model-specific special tokens during tokenization.

String to disambiguate prefix cache entries.

Maximum allowable total input token length. If provided, token inputs longer than this raise ValueError.

If True, detokenize IDs back to text for inclusion in outputs.

Number of tokens to keep. None means no truncation. 0 yields an empty list (and skips embeds). -1 maps to model_config.max_model_len.

Validate and normalize truncate_prompt_tokens parameter.

**Examples:**

Example 1 (unknown):
```unknown
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
```

Example 2 (python):
```python
class BaseRenderer(ABC):
    """
    Base class for unified input processing and rendering.

    The Renderer serves as a unified input processor that consolidates
    tokenization, chat template formatting, and multimodal input handling
    into a single component.
    It converts high-level API requests (OpenAI-style JSON) into token IDs and
    multimodal features ready for engine consumption.

    Key responsibilities:
    - Convert text prompts to token sequences with proper special tokens
    - Apply chat templates and format conversations
    - Handle multimodal inputs (images, audio, etc.) when applicable
    - Manage prompt truncation and length validation
    - Provide clean separation between API layer and engine core
    """

    def __init__(
        self,
        model_config: ModelConfig,
        tokenizer: TokenizerLike | None = None,
    ):
        super().__init__()
        self.model_config = model_config
        self.tokenizer = tokenizer

    @abstractmethod
    async def render_prompt(
        self,
        *,
        prompt_or_prompts: str | list[str] | list[int] | list[list[int]],
        config: RenderConfig,
    ) -> list[TokensPrompt]:
        """
        Convert text or token inputs into engine-ready TokensPrompt objects.

        This method accepts text or token inputs and produces a
        list of [`TokensPrompt`][vllm.inputs.data.TokensPrompt] objects
        for the engine.

        Args:
            prompt_or_prompts: One of:
                - `str`: Single text prompt.
                - `list[str]`: Batch of text prompts.
                - `list[int]`: Single pre-tokenized sequence.
                - `list[list[int]]`: Batch of pre-tokenized sequences.
            config: Render configuration controlling how prompts are prepared
                (e.g., tokenization and length handling).

        Returns:
            list[TokensPrompt]: Engine-ready token prompts.

        Raises:
            ValueError: If input formats are invalid or length limits exceeded.
        """
        raise NotImplementedError

    @abstractmethod
    async def render_prompt_and_embeds(
        self,
        *,
        prompt_or_prompts: str | list[str] | list[int] | list[list[int]] | None = None,
        prompt_embeds: bytes | list[bytes] | None = None,
        config: RenderConfig,
    ) -> list[TokensPrompt | EmbedsPrompt]:
        """
        Convert text/token and/or base64-encoded embeddings inputs into
        engine-ready prompt objects using a unified RenderConfig.

        At least one of `prompt_or_prompts` or `prompt_embeds` must be
        provided and non-empty. If both are omitted or empty (e.g., empty
        string and empty list), a `ValueError` is raised.

        Args:
            prompt_or_prompts: Text or token inputs to include.
            prompt_embeds: Base64-encoded bytes (or list thereof) containing a
                torch-saved tensor to be used as prompt embeddings.
            config: Render configuration controlling how prompts are prepared
                (e.g., tokenization and length handling).

        Returns:
            list[Union[TokensPrompt, EmbedsPrompt]]:
                Engine-ready prompt objects.

        Raises:
            ValueError: If both `prompt_or_prompts` and `prompt_embeds`
                are omitted or empty (decoder prompt cannot be empty), or if
                length limits are exceeded.
        """
        raise NotImplementedError

    def load_prompt_embeds(
        self,
        prompt_embeds: bytes | list[bytes],
        truncate_prompt_tokens: Annotated[int, Field(ge=0)] | None = None,
        cache_salt: str | None = None,
    ) -> list[EmbedsPrompt]:
        """Load and validate base64-encoded embeddings into prompt objects."""
        if not self.model_config.enable_prompt_embeds:
            raise VLLMValidationError(
                "You must set `--enable-prompt-embeds` to input `prompt_embeds`.",
                parameter="prompt_embeds",
            )

        def _load_and_validate_embed(embed: bytes) -> EmbedsPrompt:
            # Enable sparse tensor integrity checks to prevent out-of-bounds
            # writes from maliciously crafted tensors
            with torch.sparse.check_sparse_tensor_invariants():
                tensor = torch.load(
                    io.BytesIO(pybase64.b64decode(embed, validate=True)),
                    weights_only=True,
                    map_location=torch.device("cpu"),
                )
                assert isinstance(tensor, torch.Tensor) and tensor.dtype in (
                    torch.float32,
                    torch.bfloat16,
                    torch.float16,
                )
                tensor = tensor.to_dense()
            if tensor.dim() > 2:
                tensor = tensor.squeeze(0)
                assert tensor.dim() == 2
            if truncate_prompt_tokens is not None:
                tensor = tensor[-truncate_prompt_tokens:]
            embeds_prompt = EmbedsPrompt(prompt_embeds=tensor)
            if cache_salt is not None:
                embeds_prompt["cache_salt"] = cache_salt
            return embeds_prompt

        if isinstance(prompt_embeds, list):
            return [_load_and_validate_embed(embed) for embed in prompt_embeds]

        return [_load_and_validate_embed(prompt_embeds)]
```

Example 3 (python):
```python
class BaseRenderer(ABC):
    """
    Base class for unified input processing and rendering.

    The Renderer serves as a unified input processor that consolidates
    tokenization, chat template formatting, and multimodal input handling
    into a single component.
    It converts high-level API requests (OpenAI-style JSON) into token IDs and
    multimodal features ready for engine consumption.

    Key responsibilities:
    - Convert text prompts to token sequences with proper special tokens
    - Apply chat templates and format conversations
    - Handle multimodal inputs (images, audio, etc.) when applicable
    - Manage prompt truncation and length validation
    - Provide clean separation between API layer and engine core
    """

    def __init__(
        self,
        model_config: ModelConfig,
        tokenizer: TokenizerLike | None = None,
    ):
        super().__init__()
        self.model_config = model_config
        self.tokenizer = tokenizer

    @abstractmethod
    async def render_prompt(
        self,
        *,
        prompt_or_prompts: str | list[str] | list[int] | list[list[int]],
        config: RenderConfig,
    ) -> list[TokensPrompt]:
        """
        Convert text or token inputs into engine-ready TokensPrompt objects.

        This method accepts text or token inputs and produces a
        list of [`TokensPrompt`][vllm.inputs.data.TokensPrompt] objects
        for the engine.

        Args:
            prompt_or_prompts: One of:
                - `str`: Single text prompt.
                - `list[str]`: Batch of text prompts.
                - `list[int]`: Single pre-tokenized sequence.
                - `list[list[int]]`: Batch of pre-tokenized sequences.
            config: Render configuration controlling how prompts are prepared
                (e.g., tokenization and length handling).

        Returns:
            list[TokensPrompt]: Engine-ready token prompts.

        Raises:
            ValueError: If input formats are invalid or length limits exceeded.
        """
        raise NotImplementedError

    @abstractmethod
    async def render_prompt_and_embeds(
        self,
        *,
        prompt_or_prompts: str | list[str] | list[int] | list[list[int]] | None = None,
        prompt_embeds: bytes | list[bytes] | None = None,
        config: RenderConfig,
    ) -> list[TokensPrompt | EmbedsPrompt]:
        """
        Convert text/token and/or base64-encoded embeddings inputs into
        engine-ready prompt objects using a unified RenderConfig.

        At least one of `prompt_or_prompts` or `prompt_embeds` must be
        provided and non-empty. If both are omitted or empty (e.g., empty
        string and empty list), a `ValueError` is raised.

        Args:
            prompt_or_prompts: Text or token inputs to include.
            prompt_embeds: Base64-encoded bytes (or list thereof) containing a
                torch-saved tensor to be used as prompt embeddings.
            config: Render configuration controlling how prompts are prepared
                (e.g., tokenization and length handling).

        Returns:
            list[Union[TokensPrompt, EmbedsPrompt]]:
                Engine-ready prompt objects.

        Raises:
            ValueError: If both `prompt_or_prompts` and `prompt_embeds`
                are omitted or empty (decoder prompt cannot be empty), or if
                length limits are exceeded.
        """
        raise NotImplementedError

    def load_prompt_embeds(
        self,
        prompt_embeds: bytes | list[bytes],
        truncate_prompt_tokens: Annotated[int, Field(ge=0)] | None = None,
        cache_salt: str | None = None,
    ) -> list[EmbedsPrompt]:
        """Load and validate base64-encoded embeddings into prompt objects."""
        if not self.model_config.enable_prompt_embeds:
            raise VLLMValidationError(
                "You must set `--enable-prompt-embeds` to input `prompt_embeds`.",
                parameter="prompt_embeds",
            )

        def _load_and_validate_embed(embed: bytes) -> EmbedsPrompt:
            # Enable sparse tensor integrity checks to prevent out-of-bounds
            # writes from maliciously crafted tensors
            with torch.sparse.check_sparse_tensor_invariants():
                tensor = torch.load(
                    io.BytesIO(pybase64.b64decode(embed, validate=True)),
                    weights_only=True,
                    map_location=torch.device("cpu"),
                )
                assert isinstance(tensor, torch.Tensor) and tensor.dtype in (
                    torch.float32,
                    torch.bfloat16,
                    torch.float16,
                )
                tensor = tensor.to_dense()
            if tensor.dim() > 2:
                tensor = tensor.squeeze(0)
                assert tensor.dim() == 2
            if truncate_prompt_tokens is not None:
                tensor = tensor[-truncate_prompt_tokens:]
            embeds_prompt = EmbedsPrompt(prompt_embeds=tensor)
            if cache_salt is not None:
                embeds_prompt["cache_salt"] = cache_salt
            return embeds_prompt

        if isinstance(prompt_embeds, list):
            return [_load_and_validate_embed(embed) for embed in prompt_embeds]

        return [_load_and_validate_embed(prompt_embeds)]
```

Example 4 (unknown):
```unknown
model_config = model_config
```

---

## scheduler - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/config/scheduler/

**Contents:**
- vllm.config.scheduler ¶
- RunnerType module-attribute ¶
- SchedulerPolicy module-attribute ¶
- logger module-attribute ¶
- SchedulerConfig ¶
  - DEFAULT_MAX_NUM_BATCHED_TOKENS class-attribute ¶
  - DEFAULT_MAX_NUM_SEQS class-attribute ¶
  - async_scheduling class-attribute instance-attribute ¶
  - disable_chunked_mm_input class-attribute instance-attribute ¶
  - disable_hybrid_kv_cache_manager class-attribute instance-attribute ¶

Scheduler configuration.

If set to True, perform async scheduling. This helps to avoid gaps in GPU utilization, leading to better latency and throughput. Async scheduling is currently not supported with some features such as speculative decoding and pipeline parallelism.

If set to true and chunked prefill is enabled, we do not want to partially schedule a multimodal item. Only used in V1 This ensures that if a request has a mixed prompt (like text tokens TTTT followed by image tokens IIIIIIIIII) where only some image tokens can be scheduled (like TTTTIIIII, leaving IIIII), it will be scheduled as TTTT in one step and IIIIIIIIII in the next.

If set to True, KV cache manager will allocate the same size of KV cache for all attention layers even if there are multiple type of attention layers like full attention and sliding window attention. If set to None, the default value will be determined based on the environment and starting configuration.

If True, prefill requests can be chunked based on the remaining max_num_batched_tokens.

The default value here is mainly for convenience when testing. In real usage, this should be set in EngineArgs.create_engine_config.

Multimodal encoder cache size, only used in V1.

NOTE: This is not currently configurable. It will be overridden by max_num_batched_tokens in case max multimodal embedding size is larger.

True if the model is multimodal.

For chunked prefill, a request is considered long if the prompt is longer than this number of tokens.

For chunked prefill, the maximum number of prompts longer than long_prefill_token_threshold that will be prefilled concurrently. Setting this less than max_num_partial_prefills will allow shorter prompts to jump the queue in front of longer prompts in some cases, improving latency.

Maximum number of tokens to be processed in a single iteration.

The default value here is mainly for convenience when testing. In real usage, this should be set in EngineArgs.create_engine_config.

Multimodal encoder compute budget, only used in V1.

NOTE: This is not currently configurable. It will be overridden by max_num_batched_tokens in case max multimodal embedding size is larger.

For chunked prefill, the maximum number of sequences that can be partially prefilled concurrently.

Maximum number of sequences to be processed in a single iteration.

The default value here is mainly for convenience when testing. In real usage, this should be set in EngineArgs.create_engine_config.

The scheduling policy to use:

"fcfs" means first come first served, i.e. requests are handled in order of arrival.

"priority" means requests are handled based on given priority (lower value means earlier handling) and time of arrival deciding any ties).

The runner type to launch for the model.

The scheduler class to use. "vllm.v1.core.sched.scheduler.Scheduler" is the default scheduler. Can be a class directly or the path to a class of form "mod.custom_class".

The interval (or buffer size) for streaming in terms of token length. A smaller value (1) makes streaming smoother by sending each token immediately, while a larger value (e.g., 10) reduces host overhead and may increase throughput by batching multiple tokens before sending.

Skip validation if the value is None when initialisation is delayed.

WARNING: Whenever a new field is added to this config, ensure that it is included in the factors list if it affects the computation graph.

Provide a hash that uniquely identifies all the configs that affect the structure of the computation graph from input ids/embeddings to the final hidden states, excluding anything before input ids/embeddings and after the final hidden states.

Factory method to create SchedulerConfig with default values for InitVars.

**Examples:**

Example 1 (unknown):
```unknown
RunnerType = Literal['generate', 'pooling', 'draft']
```

Example 2 (unknown):
```unknown
RunnerType = Literal['generate', 'pooling', 'draft']
```

Example 3 (unknown):
```unknown
SchedulerPolicy = Literal['fcfs', 'priority']
```

Example 4 (unknown):
```unknown
SchedulerPolicy = Literal['fcfs', 'priority']
```

---

## Sleep Mode - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/sleep_mode/

**Contents:**
- Sleep Mode¶
- Sleep levels¶
- Usage¶
  - Offline inference¶
    - Python API¶
    - RLHF weight updates¶
  - Online Serving¶
    - Server in development mode¶
    - HTTP endpoints¶
- Limitation¶

vLLM's Sleep Mode allows you to temporarily release most GPU memory used by a model, including model weights and KV cache, without stopping the server or unloading the Docker container. This is especially useful for RLHF, training, or cost-saving scenarios where GPU resources need to be freed between inference workloads.

This feature is now supported on CUDA and ROCm platform.

For more information, see this Blog Post.

Level 1 sleep will offload the model weights and discard the KV cache. The content of KV cache is forgotten. Level 1 sleep is good for sleeping and waking up the engine to run the same model again. The model weights are backed up in CPU memory. Please make sure there's enough CPU memory to store the model weights. Level 2 sleep will discard both the model weights and the KV cache (while the model's buffers are kept in CPU, like rope scaling tensors). The content of both the model weights and KV cache is forgotten. Level 2 sleep is good for sleeping and waking up the engine to run a different model or update the model, where previous model weights are not needed, e.g. RLHF weight update.

Enable sleep mode by passing enable_sleep_mode=True to the LLM class.

During RLHF training, vLLM allows you to selectively wake up only the model weights or the KV cache using the tags argument in wake_up(). This fine-grained control is especially useful when updating model weights: by waking up just the weights (e.g., llm.wake_up(tags=["weights"])), you avoid allocating memory for the KV cache until after the weight update is complete. This approach helps prevent GPU out-of-memory (OOM) errors, particularly with large models, by minimizing peak memory usage during weight synchronization and update operations.

Use tags=["weights"] or tags=["kv_cache"] to control which resources are restored, useful for RLHF and weight updates. Note that is_sleeping will report true until all components are awake.

To enable sleep mode in a vLLM server you need to initialize it with the flag VLLM_SERVER_DEV_MODE=1 and pass --enable-sleep-mode to the vLLM server.

When using the flag VLLM_SERVER_DEV_MODE=1 you enable development endpoints, and these endpoints should not be exposed to users.

Below is an example of how to sleep and wake up a model in level 1.

And this is an example of how to sleep and wake up a model in level 2.

These endpoints are only available when passing VLLM_SERVER_DEV_MODE=1.

On ROCm, the virtual memory allocation on ROCm is done through chunked memory allocation. You can control the chunk size through VLLM_ROCM_SLEEP_MEM_CHUNK_SIZE (in MB). The default value is set at 256MB. The larger the chunk size the faster the performance. However, setting it too large will cause OOM. So if you encounter OOM when using sleep mode. Try reducing the chunk size. It is recommended to define the chunk size as a power of 2.

**Examples:**

Example 1 (python):
```python
from vllm import LLM
llm = LLM("Qwen/Qwen3-0.6B", enable_sleep_mode=True)
```

Example 2 (python):
```python
from vllm import LLM
llm = LLM("Qwen/Qwen3-0.6B", enable_sleep_mode=True)
```

Example 3 (markdown):
```markdown
# Sleep level 1
# Put the engine to sleep (level=1: offload weights to CPU RAM, discard KV cache)
llm.sleep(level=1)

# Wake up the engine (restore weights)
llm.wake_up()
```

Example 4 (markdown):
```markdown
# Sleep level 1
# Put the engine to sleep (level=1: offload weights to CPU RAM, discard KV cache)
llm.sleep(level=1)

# Wake up the engine (restore weights)
llm.wake_up()
```

---

## Speculative Decoding - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/spec_decode/

**Contents:**
- Speculative Decoding¶
- Speculating with a draft model¶
- Speculating by matching n-grams in the prompt¶
- Speculating using Suffix Decoding¶
- Speculating using MLP speculators¶
- Speculating using EAGLE based draft models¶
- Lossless guarantees of Speculative Decoding¶
- Resources for vLLM contributors¶

Please note that speculative decoding in vLLM is not yet optimized and does not usually yield inter-token latency reductions for all prompt datasets or sampling parameters. The work to optimize it is ongoing and can be followed here: Issue #4630

Currently, speculative decoding in vLLM is not compatible with pipeline parallelism.

This document shows how to use Speculative Decoding with vLLM. Speculative decoding is a technique which improves inter-token latency in memory-bound LLM inference.

The following code configures vLLM in an offline mode to use speculative decoding with a draft model, speculating 5 tokens at a time.

In vllm v0.10.0, speculative decoding with a draft model is not supported. If you use the following code, you will get a NotImplementedError.

To perform the same with an online mode launch the server:

Note: Please use --speculative_config to set all configurations related to speculative decoding. The previous method of specifying the model through --speculative_model and adding related parameters (e.g., --num_speculative_tokens) separately has been deprecated now.

The following code configures vLLM to use speculative decoding where proposals are generated by matching n-grams in the prompt. For more information read this thread.

The following code configures vLLM to use speculative decoding where proposals are generated using Suffix Decoding (technical report).

Like n-gram, Suffix Decoding can generate draft tokens by pattern-matching using the last n generated tokens. Unlike n-gram, Suffix Decoding (1) can pattern-match against both the prompt and previous generations, (2) uses frequency counts to propose the most likely continuations, and (3) speculates an adaptive number of tokens for each request at each iteration to get better acceptance rates.

Suffix Decoding can achieve better performance for tasks with high repetition, such as code-editing, agentic loops (e.g. self-reflection, self-consistency), and RL rollouts.

Install Arctic Inference

Suffix Decoding requires Arctic Inference. You can install it with pip install arctic-inference.

Suffix Decoding Speculative Tokens

Suffix Decoding will speculate a dynamic number of tokens for each request at each decoding step, so the num_speculative_tokens configuration specifies the maximum number of speculative tokens. It is suggested to use a high number such as 16 or 32 (default).

The following code configures vLLM to use speculative decoding where proposals are generated by draft models that conditioning draft predictions on both context vectors and sampled tokens. For more information see this blog or this technical report.

Note that these speculative models currently need to be run without tensor parallelism, although it is possible to run the main model using tensor parallelism (see example above). Since the speculative models are relatively small, we still see significant speedups. However, this limitation will be fixed in a future release.

A variety of speculative models of this type are available on HF hub:

The following code configures vLLM to use speculative decoding where proposals are generated by an EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) based draft model. A more detailed example for offline mode, including how to extract request level acceptance rate, can be found here.

A few important things to consider when using the EAGLE based draft models:

The EAGLE draft models available in the HF repository for EAGLE models should be able to be loaded and used directly by vLLM after Pull Request #12304. If you are using vllm version before Pull Request #12304, please use the script to convert the speculative model, and specify "model": "path/to/modified/eagle/model" in speculative_config. If weight-loading problems still occur when using the latest version of vLLM, please leave a comment or raise an issue.

The EAGLE based draft models need to be run without tensor parallelism (i.e. draft_tensor_parallel_size is set to 1 in speculative_config), although it is possible to run the main model using tensor parallelism (see example above).

When using EAGLE-based speculators with vLLM, the observed speedup is lower than what is reported in the reference implementation here. This issue is under investigation and tracked here: Issue #9565.

When using EAGLE-3 based draft model, option "method" must be set to "eagle3". That is, to specify "method": "eagle3" in speculative_config.

A variety of EAGLE draft models are available on the Hugging Face hub:

In vLLM, speculative decoding aims to enhance inference efficiency while maintaining accuracy. This section addresses the lossless guarantees of speculative decoding, breaking down the guarantees into three key areas:

Theoretical Losslessness - Speculative decoding sampling is theoretically lossless up to the precision limits of hardware numerics. Floating-point errors might cause slight variations in output distributions, as discussed in Accelerating Large Language Model Decoding with Speculative Sampling

Algorithmic Losslessness - vLLM’s implementation of speculative decoding is algorithmically validated to be lossless. Key validation tests include:

vLLM Logprob Stability - vLLM does not currently guarantee stable token log probabilities (logprobs). This can result in different outputs for the same request across runs. For more details, see the FAQ section titled Can the output of a prompt vary across runs in vLLM? in the FAQs.

While vLLM strives to ensure losslessness in speculative decoding, variations in generated outputs with and without speculative decoding can occur due to following factors:

For mitigation strategies, please refer to the FAQ entry Can the output of a prompt vary across runs in vLLM? in the FAQs.

**Examples:**

Example 1 (python):
```python
from vllm import LLM, SamplingParams

prompts = [
    "The future of AI is",
]
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

llm = LLM(
    model="facebook/opt-6.7b",
    tensor_parallel_size=1,
    speculative_config={
        "model": "facebook/opt-125m",
        "num_speculative_tokens": 5,
    },
)
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

Example 2 (python):
```python
from vllm import LLM, SamplingParams

prompts = [
    "The future of AI is",
]
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

llm = LLM(
    model="facebook/opt-6.7b",
    tensor_parallel_size=1,
    speculative_config={
        "model": "facebook/opt-125m",
        "num_speculative_tokens": 5,
    },
)
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

Example 3 (json):
```json
vllm serve facebook/opt-6.7b \
    --host 0.0.0.0 \
    --port 8000 \
    --seed 42 \
    -tp 1 \
    --gpu_memory_utilization 0.8 \
    --speculative_config '{"model": "facebook/opt-125m", "num_speculative_tokens": 5}'
```

Example 4 (json):
```json
vllm serve facebook/opt-6.7b \
    --host 0.0.0.0 \
    --port 8000 \
    --seed 42 \
    -tp 1 \
    --gpu_memory_utilization 0.8 \
    --speculative_config '{"model": "facebook/opt-125m", "num_speculative_tokens": 5}'
```

---

## Spec Decode - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/offline_inference/spec_decode/

**Contents:**
- Spec Decode¶

Source https://github.com/vllm-project/vllm/blob/main/examples/offline_inference/spec_decode.py.

**Examples:**

Example 1 (json):
```json
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from transformers import AutoTokenizer

from vllm import LLM, SamplingParams
from vllm.benchmarks.datasets import add_dataset_parser, get_samples
from vllm.inputs import TokensPrompt
from vllm.v1.metrics.reader import Counter, Vector

try:
    from vllm.utils.argparse_utils import FlexibleArgumentParser
except ImportError:
    from argparse import ArgumentParser as FlexibleArgumentParser


QUESTION = "What is the content of each image?"
IMAGE_URLS = [
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/duck.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/lion.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/flycatcher.jpeg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/somefish.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/starfish.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/snail.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/thistle.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/husky.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/orangetabbycat.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/guineapig.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/rabbit.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/horsepony.jpg",
]


def get_custom_mm_prompts(num_prompts):
    prompts = []
    for url in IMAGE_URLS:
        prompts.append(
            [
                {"type": "image_url", "image_url": {"url": url}},
                {"type": "text", "text": QUESTION},
            ]
        )
    if num_prompts > len(IMAGE_URLS):
        prompts = prompts * (num_prompts // len(IMAGE_URLS) + 1)

    return [[{"role": "user", "content": prompt}] for prompt in prompts[:num_prompts]]


def parse_args():
    parser = FlexibleArgumentParser()
    add_dataset_parser(parser)
    parser.add_argument("--test", action="store_true")
    parser.add_argument(
        "--method",
        type=str,
        default="eagle",
        choices=["ngram", "eagle", "eagle3", "mtp"],
    )
    parser.add_argument("--num-spec-tokens", type=int, default=2)
    parser.add_argument("--prompt-lookup-max", type=int, default=5)
    parser.add_argument("--prompt-lookup-min", type=int, default=2)
    parser.add_argument("--tp", type=int, default=1)
    parser.add_argument("--enforce-eager", action="store_true")
    parser.add_argument("--enable-chunked-prefill", action="store_true")
    parser.add_argument("--max-model-len", type=int, default=16384)
    parser.add_argument("--temp", type=float, default=0)
    parser.add_argument("--top-p", type=float, default=1.0)
    parser.add_argument("--top-k", type=int, default=-1)
    parser.add_argument("--print-output", action="store_true")
    parser.add_argument("--output-len", type=int, default=256)
    parser.add_argument("--model-dir", type=str, default=None)
    parser.add_argument("--eagle-dir", type=str, default=None)
    parser.add_argument("--custom-mm-prompts", action="store_true")
    return parser.parse_args()


def main(args):
    args.endpoint_type = "openai-chat"

    model_dir = args.model_dir
    if args.model_dir is None:
        if args.custom_mm_prompts:
            raise ValueError(
                "custom_mm_prompts requires mm based models"
                "default llama3.1-8b-instruct is not mm based"
                "please specify model_dir to give a mm based model"
            )
        model_dir = "meta-llama/Llama-3.1-8B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    args.custom_skip_chat_template = True

    if not args.custom_mm_prompts:
        prompts = get_samples(args, tokenizer)
        # add_special_tokens is False to avoid adding bos twice
        # when using chat templates
        prompt_ids = [
            tokenizer.encode(prompt.prompt, add_special_tokens=False)
            for prompt in prompts
        ]
    else:
        prompts = get_custom_mm_prompts(args.num_prompts)

    if args.method == "eagle" or args.method == "eagle3":
        eagle_dir = args.eagle_dir
        if args.method == "eagle" and eagle_dir is None:
            eagle_dir = "yuhuili/EAGLE-LLaMA3.1-Instruct-8B"

        elif args.method == "eagle3" and eagle_dir is None:
            eagle_dir = "yuhuili/EAGLE3-LLaMA3.1-Instruct-8B"
        speculative_config = {
            "method": args.method,
            "model": eagle_dir,
            "num_speculative_tokens": args.num_spec_tokens,
        }
    elif args.method == "ngram":
        speculative_config = {
            "method": "ngram",
            "num_speculative_tokens": args.num_spec_tokens,
            "prompt_lookup_max": args.prompt_lookup_max,
            "prompt_lookup_min": args.prompt_lookup_min,
        }
    elif args.method == "mtp":
        speculative_config = {
            "method": "mtp",
            "num_speculative_tokens": args.num_spec_tokens,
        }
    else:
        raise ValueError(f"unknown method: {args.method}")

    llm = LLM(
        model=model_dir,
        trust_remote_code=True,
        tensor_parallel_size=args.tp,
        enable_chunked_prefill=args.enable_chunked_prefill,
        enforce_eager=args.enforce_eager,
        gpu_memory_utilization=0.9,
        speculative_config=speculative_config,
        disable_log_stats=False,
        max_model_len=args.max_model_len,
        limit_mm_per_prompt={"image": 5},
        disable_chunked_mm_input=True,
    )

    sampling_params = SamplingParams(temperature=args.temp, max_tokens=args.output_len)
    if not args.custom_mm_prompts:
        outputs = llm.generate(
            [TokensPrompt(prompt_token_ids=x) for x in prompt_ids],
            sampling_params=sampling_params,
        )
    else:
        outputs = llm.chat(prompts, sampling_params=sampling_params)

    # print the generated text
    if args.print_output:
        for output in outputs:
            print("-" * 50)
            print(f"prompt: {output.prompt}")
            print(f"generated text: {output.outputs[0].text}")
            print("-" * 50)

    metrics = llm.get_metrics()

    total_num_output_tokens = sum(
        len(output.outputs[0].token_ids) for output in outputs
    )
    num_drafts = 0
    num_draft_tokens = 0
    num_accepted_tokens = 0
    acceptance_counts = [0] * args.num_spec_tokens
    for metric in metrics:
        if metric.name == "vllm:spec_decode_num_drafts":
            assert isinstance(metric, Counter)
            num_drafts += metric.value
        elif metric.name == "vllm:spec_decode_num_draft_tokens":
            assert isinstance(metric, Counter)
            num_draft_tokens += metric.value
        elif metric.name == "vllm:spec_decode_num_accepted_tokens":
            assert isinstance(metric, Counter)
            num_accepted_tokens += metric.value
        elif metric.name == "vllm:spec_decode_num_accepted_tokens_per_pos":
            assert isinstance(metric, Vector)
            for pos in range(len(metric.values)):
                acceptance_counts[pos] += metric.values[pos]

    print("-" * 50)
    print(f"total_num_output_tokens: {total_num_output_tokens}")
    print(f"num_drafts: {num_drafts}")
    print(f"num_draft_tokens: {num_draft_tokens}")
    print(f"num_accepted_tokens: {num_accepted_tokens}")
    acceptance_length = 1 + (num_accepted_tokens / num_drafts) if num_drafts > 0 else 1
    print(f"mean acceptance length: {acceptance_length:.2f}")
    print("-" * 50)

    # print acceptance at each token position
    for i in range(len(acceptance_counts)):
        acceptance_rate = acceptance_counts[i] / num_drafts if num_drafts > 0 else 0
        print(f"acceptance at token {i}: {acceptance_rate:.2f}")

    return acceptance_length


if __name__ == "__main__":
    args = parse_args()
    acceptance_length = main(args)

    if args.test:
        # takes ~30s to run on 1xH100
        assert args.method in ["eagle", "eagle3"]
        assert args.tp == 1
        assert args.num_spec_tokens == 3
        assert args.dataset_name == "hf"
        assert args.dataset_path == "philschmid/mt-bench"
        assert args.num_prompts == 80
        assert args.temp == 0
        assert args.top_p == 1.0
        assert args.top_k == -1
        assert args.enable_chunked_prefill

        # check acceptance length is within 2% of expected value
        rtol = 0.02
        expected_acceptance_length = 2.296 if args.method == "eagle" else 2.811

        assert (
            acceptance_length <= (1 + rtol) * expected_acceptance_length
            and acceptance_length >= (1 - rtol) * expected_acceptance_length
        ), (
            f"acceptance_length {acceptance_length} is not "
            f"within {rtol * 100}% of {expected_acceptance_length}"
        )

        print(
            f"Test passed! Expected AL: "
            f"{expected_acceptance_length}, got {acceptance_length}"
        )
```

Example 2 (json):
```json
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from transformers import AutoTokenizer

from vllm import LLM, SamplingParams
from vllm.benchmarks.datasets import add_dataset_parser, get_samples
from vllm.inputs import TokensPrompt
from vllm.v1.metrics.reader import Counter, Vector

try:
    from vllm.utils.argparse_utils import FlexibleArgumentParser
except ImportError:
    from argparse import ArgumentParser as FlexibleArgumentParser


QUESTION = "What is the content of each image?"
IMAGE_URLS = [
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/duck.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/lion.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/flycatcher.jpeg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/somefish.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/starfish.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/snail.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/thistle.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/husky.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/orangetabbycat.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/guineapig.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/rabbit.jpg",
    "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/horsepony.jpg",
]


def get_custom_mm_prompts(num_prompts):
    prompts = []
    for url in IMAGE_URLS:
        prompts.append(
            [
                {"type": "image_url", "image_url": {"url": url}},
                {"type": "text", "text": QUESTION},
            ]
        )
    if num_prompts > len(IMAGE_URLS):
        prompts = prompts * (num_prompts // len(IMAGE_URLS) + 1)

    return [[{"role": "user", "content": prompt}] for prompt in prompts[:num_prompts]]


def parse_args():
    parser = FlexibleArgumentParser()
    add_dataset_parser(parser)
    parser.add_argument("--test", action="store_true")
    parser.add_argument(
        "--method",
        type=str,
        default="eagle",
        choices=["ngram", "eagle", "eagle3", "mtp"],
    )
    parser.add_argument("--num-spec-tokens", type=int, default=2)
    parser.add_argument("--prompt-lookup-max", type=int, default=5)
    parser.add_argument("--prompt-lookup-min", type=int, default=2)
    parser.add_argument("--tp", type=int, default=1)
    parser.add_argument("--enforce-eager", action="store_true")
    parser.add_argument("--enable-chunked-prefill", action="store_true")
    parser.add_argument("--max-model-len", type=int, default=16384)
    parser.add_argument("--temp", type=float, default=0)
    parser.add_argument("--top-p", type=float, default=1.0)
    parser.add_argument("--top-k", type=int, default=-1)
    parser.add_argument("--print-output", action="store_true")
    parser.add_argument("--output-len", type=int, default=256)
    parser.add_argument("--model-dir", type=str, default=None)
    parser.add_argument("--eagle-dir", type=str, default=None)
    parser.add_argument("--custom-mm-prompts", action="store_true")
    return parser.parse_args()


def main(args):
    args.endpoint_type = "openai-chat"

    model_dir = args.model_dir
    if args.model_dir is None:
        if args.custom_mm_prompts:
            raise ValueError(
                "custom_mm_prompts requires mm based models"
                "default llama3.1-8b-instruct is not mm based"
                "please specify model_dir to give a mm based model"
            )
        model_dir = "meta-llama/Llama-3.1-8B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    args.custom_skip_chat_template = True

    if not args.custom_mm_prompts:
        prompts = get_samples(args, tokenizer)
        # add_special_tokens is False to avoid adding bos twice
        # when using chat templates
        prompt_ids = [
            tokenizer.encode(prompt.prompt, add_special_tokens=False)
            for prompt in prompts
        ]
    else:
        prompts = get_custom_mm_prompts(args.num_prompts)

    if args.method == "eagle" or args.method == "eagle3":
        eagle_dir = args.eagle_dir
        if args.method == "eagle" and eagle_dir is None:
            eagle_dir = "yuhuili/EAGLE-LLaMA3.1-Instruct-8B"

        elif args.method == "eagle3" and eagle_dir is None:
            eagle_dir = "yuhuili/EAGLE3-LLaMA3.1-Instruct-8B"
        speculative_config = {
            "method": args.method,
            "model": eagle_dir,
            "num_speculative_tokens": args.num_spec_tokens,
        }
    elif args.method == "ngram":
        speculative_config = {
            "method": "ngram",
            "num_speculative_tokens": args.num_spec_tokens,
            "prompt_lookup_max": args.prompt_lookup_max,
            "prompt_lookup_min": args.prompt_lookup_min,
        }
    elif args.method == "mtp":
        speculative_config = {
            "method": "mtp",
            "num_speculative_tokens": args.num_spec_tokens,
        }
    else:
        raise ValueError(f"unknown method: {args.method}")

    llm = LLM(
        model=model_dir,
        trust_remote_code=True,
        tensor_parallel_size=args.tp,
        enable_chunked_prefill=args.enable_chunked_prefill,
        enforce_eager=args.enforce_eager,
        gpu_memory_utilization=0.9,
        speculative_config=speculative_config,
        disable_log_stats=False,
        max_model_len=args.max_model_len,
        limit_mm_per_prompt={"image": 5},
        disable_chunked_mm_input=True,
    )

    sampling_params = SamplingParams(temperature=args.temp, max_tokens=args.output_len)
    if not args.custom_mm_prompts:
        outputs = llm.generate(
            [TokensPrompt(prompt_token_ids=x) for x in prompt_ids],
            sampling_params=sampling_params,
        )
    else:
        outputs = llm.chat(prompts, sampling_params=sampling_params)

    # print the generated text
    if args.print_output:
        for output in outputs:
            print("-" * 50)
            print(f"prompt: {output.prompt}")
            print(f"generated text: {output.outputs[0].text}")
            print("-" * 50)

    metrics = llm.get_metrics()

    total_num_output_tokens = sum(
        len(output.outputs[0].token_ids) for output in outputs
    )
    num_drafts = 0
    num_draft_tokens = 0
    num_accepted_tokens = 0
    acceptance_counts = [0] * args.num_spec_tokens
    for metric in metrics:
        if metric.name == "vllm:spec_decode_num_drafts":
            assert isinstance(metric, Counter)
            num_drafts += metric.value
        elif metric.name == "vllm:spec_decode_num_draft_tokens":
            assert isinstance(metric, Counter)
            num_draft_tokens += metric.value
        elif metric.name == "vllm:spec_decode_num_accepted_tokens":
            assert isinstance(metric, Counter)
            num_accepted_tokens += metric.value
        elif metric.name == "vllm:spec_decode_num_accepted_tokens_per_pos":
            assert isinstance(metric, Vector)
            for pos in range(len(metric.values)):
                acceptance_counts[pos] += metric.values[pos]

    print("-" * 50)
    print(f"total_num_output_tokens: {total_num_output_tokens}")
    print(f"num_drafts: {num_drafts}")
    print(f"num_draft_tokens: {num_draft_tokens}")
    print(f"num_accepted_tokens: {num_accepted_tokens}")
    acceptance_length = 1 + (num_accepted_tokens / num_drafts) if num_drafts > 0 else 1
    print(f"mean acceptance length: {acceptance_length:.2f}")
    print("-" * 50)

    # print acceptance at each token position
    for i in range(len(acceptance_counts)):
        acceptance_rate = acceptance_counts[i] / num_drafts if num_drafts > 0 else 0
        print(f"acceptance at token {i}: {acceptance_rate:.2f}")

    return acceptance_length


if __name__ == "__main__":
    args = parse_args()
    acceptance_length = main(args)

    if args.test:
        # takes ~30s to run on 1xH100
        assert args.method in ["eagle", "eagle3"]
        assert args.tp == 1
        assert args.num_spec_tokens == 3
        assert args.dataset_name == "hf"
        assert args.dataset_path == "philschmid/mt-bench"
        assert args.num_prompts == 80
        assert args.temp == 0
        assert args.top_p == 1.0
        assert args.top_k == -1
        assert args.enable_chunked_prefill

        # check acceptance length is within 2% of expected value
        rtol = 0.02
        expected_acceptance_length = 2.296 if args.method == "eagle" else 2.811

        assert (
            acceptance_length <= (1 + rtol) * expected_acceptance_length
            and acceptance_length >= (1 - rtol) * expected_acceptance_length
        ), (
            f"acceptance_length {acceptance_length} is not "
            f"within {rtol * 100}% of {expected_acceptance_length}"
        )

        print(
            f"Test passed! Expected AL: "
            f"{expected_acceptance_length}, got {acceptance_length}"
        )
```

---

## Structured Outputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/offline_inference/structured_outputs/

**Contents:**
- Structured Outputs¶

Source https://github.com/vllm-project/vllm/blob/main/examples/offline_inference/structured_outputs.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This file demonstrates the example usage of structured outputs
in vLLM. It shows how to apply different constraints such as choice,
regex, json schema, and grammar to produce structured and formatted
results based on specific prompts.
"""

from enum import Enum

from pydantic import BaseModel

from vllm import LLM, SamplingParams
from vllm.sampling_params import StructuredOutputsParams

MAX_TOKENS = 50

# Structured outputs by Choice (list of possible options)
structured_outputs_params_choice = StructuredOutputsParams(
    choice=["Positive", "Negative"]
)
sampling_params_choice = SamplingParams(
    structured_outputs=structured_outputs_params_choice
)
prompt_choice = "Classify this sentiment: vLLM is wonderful!"

# Structured outputs by Regex
structured_outputs_params_regex = StructuredOutputsParams(regex=r"\w+@\w+\.com\n")
sampling_params_regex = SamplingParams(
    structured_outputs=structured_outputs_params_regex,
    stop=["\n"],
    max_tokens=MAX_TOKENS,
)
prompt_regex = (
    "Generate an email address for Alan Turing, who works in Enigma."
    "End in .com and new line. Example result:"
    "[email protected]\n"
)


# Structured outputs by JSON using Pydantic schema
class CarType(str, Enum):
    sedan = "sedan"
    suv = "SUV"
    truck = "Truck"
    coupe = "Coupe"


class CarDescription(BaseModel):
    brand: str
    model: str
    car_type: CarType


json_schema = CarDescription.model_json_schema()
structured_outputs_params_json = StructuredOutputsParams(json=json_schema)
sampling_params_json = SamplingParams(
    structured_outputs=structured_outputs_params_json, max_tokens=MAX_TOKENS
)
prompt_json = (
    "Generate a JSON with the brand, model and car_type of "
    "the most iconic car from the 90's"
)

# Structured outputs by Grammar
simplified_sql_grammar = """
root ::= select_statement
select_statement ::= "SELECT " column " from " table " where " condition
column ::= "col_1 " | "col_2 "
table ::= "table_1 " | "table_2 "
condition ::= column "= " number
number ::= "1 " | "2 "
"""
structured_outputs_params_grammar = StructuredOutputsParams(
    grammar=simplified_sql_grammar
)
sampling_params_grammar = SamplingParams(
    structured_outputs=structured_outputs_params_grammar,
    max_tokens=MAX_TOKENS,
)
prompt_grammar = (
    "Generate an SQL query to show the 'username' and 'email' from the 'users' table."
)


def format_output(title: str, output: str):
    print(f"{'-' * 50}\n{title}: {output}\n{'-' * 50}")


def generate_output(prompt: str, sampling_params: SamplingParams, llm: LLM):
    outputs = llm.generate(prompt, sampling_params=sampling_params)
    return outputs[0].outputs[0].text


def main():
    llm = LLM(model="Qwen/Qwen2.5-3B-Instruct", max_model_len=100)

    choice_output = generate_output(prompt_choice, sampling_params_choice, llm)
    format_output("Structured outputs by Choice", choice_output)

    regex_output = generate_output(prompt_regex, sampling_params_regex, llm)
    format_output("Structured outputs by Regex", regex_output)

    json_output = generate_output(prompt_json, sampling_params_json, llm)
    format_output("Structured outputs by JSON", json_output)

    grammar_output = generate_output(prompt_grammar, sampling_params_grammar, llm)
    format_output("Structured outputs by Grammar", grammar_output)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This file demonstrates the example usage of structured outputs
in vLLM. It shows how to apply different constraints such as choice,
regex, json schema, and grammar to produce structured and formatted
results based on specific prompts.
"""

from enum import Enum

from pydantic import BaseModel

from vllm import LLM, SamplingParams
from vllm.sampling_params import StructuredOutputsParams

MAX_TOKENS = 50

# Structured outputs by Choice (list of possible options)
structured_outputs_params_choice = StructuredOutputsParams(
    choice=["Positive", "Negative"]
)
sampling_params_choice = SamplingParams(
    structured_outputs=structured_outputs_params_choice
)
prompt_choice = "Classify this sentiment: vLLM is wonderful!"

# Structured outputs by Regex
structured_outputs_params_regex = StructuredOutputsParams(regex=r"\w+@\w+\.com\n")
sampling_params_regex = SamplingParams(
    structured_outputs=structured_outputs_params_regex,
    stop=["\n"],
    max_tokens=MAX_TOKENS,
)
prompt_regex = (
    "Generate an email address for Alan Turing, who works in Enigma."
    "End in .com and new line. Example result:"
    "[email protected]\n"
)


# Structured outputs by JSON using Pydantic schema
class CarType(str, Enum):
    sedan = "sedan"
    suv = "SUV"
    truck = "Truck"
    coupe = "Coupe"


class CarDescription(BaseModel):
    brand: str
    model: str
    car_type: CarType


json_schema = CarDescription.model_json_schema()
structured_outputs_params_json = StructuredOutputsParams(json=json_schema)
sampling_params_json = SamplingParams(
    structured_outputs=structured_outputs_params_json, max_tokens=MAX_TOKENS
)
prompt_json = (
    "Generate a JSON with the brand, model and car_type of "
    "the most iconic car from the 90's"
)

# Structured outputs by Grammar
simplified_sql_grammar = """
root ::= select_statement
select_statement ::= "SELECT " column " from " table " where " condition
column ::= "col_1 " | "col_2 "
table ::= "table_1 " | "table_2 "
condition ::= column "= " number
number ::= "1 " | "2 "
"""
structured_outputs_params_grammar = StructuredOutputsParams(
    grammar=simplified_sql_grammar
)
sampling_params_grammar = SamplingParams(
    structured_outputs=structured_outputs_params_grammar,
    max_tokens=MAX_TOKENS,
)
prompt_grammar = (
    "Generate an SQL query to show the 'username' and 'email' from the 'users' table."
)


def format_output(title: str, output: str):
    print(f"{'-' * 50}\n{title}: {output}\n{'-' * 50}")


def generate_output(prompt: str, sampling_params: SamplingParams, llm: LLM):
    outputs = llm.generate(prompt, sampling_params=sampling_params)
    return outputs[0].outputs[0].text


def main():
    llm = LLM(model="Qwen/Qwen2.5-3B-Instruct", max_model_len=100)

    choice_output = generate_output(prompt_choice, sampling_params_choice, llm)
    format_output("Structured outputs by Choice", choice_output)

    regex_output = generate_output(prompt_regex, sampling_params_regex, llm)
    format_output("Structured outputs by Regex", regex_output)

    json_output = generate_output(prompt_json, sampling_params_json, llm)
    format_output("Structured outputs by JSON", json_output)

    grammar_output = generate_output(prompt_grammar, sampling_params_grammar, llm)
    format_output("Structured outputs by Grammar", grammar_output)


if __name__ == "__main__":
    main()
```

---

## structured_outputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/config/structured_outputs/

**Contents:**
- vllm.config.structured_outputs ¶
- StructuredOutputsBackend module-attribute ¶
- StructuredOutputsConfig ¶
  - backend class-attribute instance-attribute ¶
  - disable_additional_properties class-attribute instance-attribute ¶
  - disable_any_whitespace class-attribute instance-attribute ¶
  - disable_fallback class-attribute instance-attribute ¶
  - enable_in_reasoning class-attribute instance-attribute ¶
  - reasoning_parser class-attribute instance-attribute ¶
  - reasoning_parser_plugin class-attribute instance-attribute ¶

Dataclass which contains structured outputs config for the engine.

Which engine will be used for structured outputs (e.g. JSON schema, regex, etc) by default. With "auto", we will make opinionated choices based on request contents and what the backend libraries currently support, so the behavior is subject to change in each release.

If True, the guidance backend will not use additionalProperties in the JSON schema. This is only supported for the guidance backend and is used to better align its behaviour with outlines and xgrammar.

If True, json output will always be compact without any whitespace. If False, the model may generate whitespace between JSON fields, which is still valid JSON. This is only supported for xgrammar and guidance backends.

If True, vLLM will not fallback to a different backend on error.

Whether to use structured input for reasoning.

Select the reasoning parser depending on the model that you're using. This is used to parse the reasoning content into OpenAI API format.

Path to a dynamically reasoning parser plugin that can be dynamically loaded and registered.

WARNING: Whenever a new field is added to this config, ensure that it is included in the factors list if it affects the computation graph.

Provide a hash that uniquely identifies all the configs that affect the structure of the computation graph from input ids/embeddings to the final hidden states, excluding anything before input ids/embeddings and after the final hidden states.

**Examples:**

Example 1 (unknown):
```unknown
StructuredOutputsBackend = Literal[
    "auto",
    "xgrammar",
    "guidance",
    "outlines",
    "lm-format-enforcer",
]
```

Example 2 (unknown):
```unknown
StructuredOutputsBackend = Literal[
    "auto",
    "xgrammar",
    "guidance",
    "outlines",
    "lm-format-enforcer",
]
```

Example 3 (unknown):
```unknown
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
```

Example 4 (python):
```python
@config
@dataclass
class StructuredOutputsConfig:
    """Dataclass which contains structured outputs config for the engine."""

    backend: StructuredOutputsBackend = "auto"
    """Which engine will be used for structured outputs (e.g. JSON schema,
    regex, etc) by default. With "auto", we will make opinionated choices
    based on request contents and what the backend libraries currently support,
    so the behavior is subject to change in each release."""
    disable_fallback: bool = False
    """If `True`, vLLM will not fallback to a different backend on error."""
    disable_any_whitespace: bool = False
    """If `True`, json output will always be compact without any whitespace.
    If `False`, the model may generate whitespace between JSON fields,
    which is still valid JSON. This is only supported for xgrammar
    and guidance backends."""
    disable_additional_properties: bool = False
    """If `True`, the `guidance` backend will not use `additionalProperties`
    in the JSON schema. This is only supported for the `guidance` backend and
    is used to better align its behaviour with `outlines` and `xgrammar`."""
    reasoning_parser: str = ""
    """Select the reasoning parser depending on the model that you're using.
    This is used to parse the reasoning content into OpenAI API format."""
    reasoning_parser_plugin: str = ""
    """Path to a dynamically reasoning parser plugin that can be dynamically
    loaded and registered."""
    enable_in_reasoning: bool = False
    """Whether to use structured input for reasoning."""

    def compute_hash(self) -> str:
        """
        WARNING: Whenever a new field is added to this config,
        ensure that it is included in the factors list if
        it affects the computation graph.

        Provide a hash that uniquely identifies all the configs
        that affect the structure of the computation
        graph from input ids/embeddings to the final hidden states,
        excluding anything before input ids/embeddings and after
        the final hidden states.
        """
        # no factors to consider.
        # this config will not affect the computation graph.
        factors: list[Any] = []
        hash_str = safe_hash(str(factors).encode(), usedforsecurity=False).hexdigest()
        return hash_str

    @model_validator(mode="after")
    def _validate_structured_output_config(self) -> Self:
        if self.disable_any_whitespace and self.backend not in ("xgrammar", "guidance"):
            raise ValueError(
                "disable_any_whitespace is only supported for "
                "xgrammar and guidance backends."
            )
        if self.disable_additional_properties and self.backend != "guidance":
            raise ValueError(
                "disable_additional_properties is only supported "
                "for the guidance backend."
            )
        return self
```

---

## Structured Outputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/structured_outputs/

**Contents:**
- Structured Outputs¶
- Online Serving (OpenAI API)¶
- Reasoning Outputs¶
- Experimental Automatic Parsing (OpenAI API)¶
- Offline Inference¶

vLLM supports the generation of structured outputs using xgrammar or guidance as backends. This document shows you some examples of the different options that are available to generate structured outputs.

If you are still using the following deprecated API fields which were removed in v0.12.0, please update your code to use structured_outputs as demonstrated in the rest of this document:

You can generate structured outputs using the OpenAI's Completions and Chat API.

The following parameters are supported, which must be added as extra parameters:

You can see the complete list of supported parameters on the OpenAI-Compatible Server page.

Structured outputs are supported by default in the OpenAI-Compatible Server. You may choose to specify the backend to use by setting the --structured-outputs-config.backend flag to vllm serve. The default backend is auto, which will try to choose an appropriate backend based on the details of the request. You may also choose a specific backend, along with some options. A full set of options is available in the vllm serve --help text.

Now let´s see an example for each of the cases, starting with the choice, as it´s the easiest one:

The next example shows how to use the regex. The supported regex syntax depends on the structured output backend. For example, xgrammar, guidance, and outlines use Rust-style regex, while lm-format-enforcer uses Python's re module. The idea is to generate an email address, given a simple regex template:

One of the most relevant features in structured text generation is the option to generate a valid JSON with pre-defined fields and formats. For this we can use the json parameter in two different ways:

The next example shows how to use the response_format parameter with a Pydantic model:

While not strictly necessary, normally it´s better to indicate in the prompt the JSON schema and how the fields should be populated. This can improve the results notably in most cases.

Finally we have the grammar option, which is probably the most difficult to use, but it´s really powerful. It allows us to define complete languages like SQL queries. It works by using a context free EBNF grammar. As an example, we can use to define a specific format of simplified SQL queries:

See also: full example

You can also use structured outputs with for reasoning models.

Note that you can use reasoning with any provided structured outputs feature. The following uses one with JSON schema:

See also: full example

This section covers the OpenAI beta wrapper over the client.chat.completions.create() method that provides richer integrations with Python specific types.

At the time of writing (openai==1.54.4), this is a "beta" feature in the OpenAI client library. Code reference can be found here.

For the following examples, vLLM was set up using vllm serve meta-llama/Llama-3.1-8B-Instruct

Here is a simple example demonstrating how to get structured output using Pydantic models:

Here is a more complex example using nested Pydantic models to handle a step-by-step math solution:

An example of using structural_tag can be found here: examples/online_serving/structured_outputs

Offline inference allows for the same types of structured outputs. To use it, we´ll need to configure the structured outputs using the class StructuredOutputsParams inside SamplingParams. The main available options inside StructuredOutputsParams are:

These parameters can be used in the same way as the parameters from the Online Serving examples above. One example for the usage of the choice parameter is shown below:

See also: full example

**Examples:**

Example 1 (json):
```json
from openai import OpenAI
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="-",
)
model = client.models.list().data[0].id

completion = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "user", "content": "Classify this sentiment: vLLM is wonderful!"}
    ],
    extra_body={"structured_outputs": {"choice": ["positive", "negative"]}},
)
print(completion.choices[0].message.content)
```

Example 2 (json):
```json
from openai import OpenAI
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="-",
)
model = client.models.list().data[0].id

completion = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "user", "content": "Classify this sentiment: vLLM is wonderful!"}
    ],
    extra_body={"structured_outputs": {"choice": ["positive", "negative"]}},
)
print(completion.choices[0].message.content)
```

Example 3 (json):
```json
completion = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": "Generate an example email address for Alan Turing, who works in Enigma. End in .com and new line. Example result: [email protected]\n",
        }
    ],
    extra_body={"structured_outputs": {"regex": r"\w+@\w+\.com\n"}, "stop": ["\n"]},
)
print(completion.choices[0].message.content)
```

Example 4 (json):
```json
completion = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": "Generate an example email address for Alan Turing, who works in Enigma. End in .com and new line. Example result: [email protected]\n",
        }
    ],
    extra_body={"structured_outputs": {"regex": r"\w+@\w+\.com\n"}, "stop": ["\n"]},
)
print(completion.choices[0].message.content)
```

---

## Tool Calling - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/tool_calling/

**Contents:**
- Tool Calling¶
- Quickstart¶
- Named Function Calling¶
- Required Function Calling¶
- None Function Calling¶
- Automatic Function Calling¶
  - Hermes Models (hermes)¶
  - Mistral Models (mistral)¶
  - Llama Models (llama3_json)¶
  - IBM Granite¶

vLLM currently supports named function calling, as well as the auto, required (as of vllm>=0.8.3), and none options for the tool_choice field in the chat completion API.

Start the server with tool calling enabled. This example uses Meta's Llama 3.1 8B model, so we need to use the llama3_json tool calling chat template from the vLLM examples directory:

Next, make a request that triggers the model to use the available tools:

This example demonstrates:

You can also specify a particular function using named function calling by setting tool_choice={"type": "function", "function": {"name": "get_weather"}}. Note that this will use the structured outputs backend - so the first time this is used, there will be several seconds of latency (or more) as the FSM is compiled for the first time before it is cached for subsequent requests.

Remember that it's the caller's responsibility to:

For more advanced usage, including parallel tool calls and different model-specific parsers, see the sections below.

vLLM supports named function calling in the chat completion API by default. This should work with most structured outputs backends supported by vLLM. You are guaranteed a validly-parsable function call - not a high-quality one.

vLLM will use structured outputs to ensure the response matches the tool parameter object defined by the JSON schema in the tools parameter. For best results, we recommend ensuring that the expected output format / schema is specified in the prompt to ensure that the model's intended generation is aligned with the schema that it's being forced to generate by the structured outputs backend.

To use a named function, you need to define the functions in the tools parameter of the chat completion request, and specify the name of one of the tools in the tool_choice parameter of the chat completion request.

vLLM supports the tool_choice='required' option in the chat completion API. Similar to the named function calling, it also uses structured outputs, so this is enabled by default and will work with any supported model. However, support for alternative decoding backends are on the roadmap for the V1 engine.

When tool_choice='required' is set, the model is guaranteed to generate one or more tool calls based on the specified tool list in the tools parameter. The number of tool calls depends on the user's query. The output format strictly follows the schema defined in the tools parameter.

vLLM supports the tool_choice='none' option in the chat completion API. When this option is set, the model will not generate any tool calls and will respond with regular text content only, even if tools are defined in the request.

When tools are specified in the request, vLLM includes tool definitions in the prompt by default, regardless of the tool_choice setting. To exclude tool definitions when tool_choice='none', use the --exclude-tools-when-tool-choice-none option.

To enable this feature, you should set the following flags:

If your favorite tool-calling model is not supported, please feel free to contribute a parser & tool use chat template!

All Nous Research Hermes-series models newer than Hermes 2 Pro should be supported.

Note that the Hermes 2 Theta models are known to have degraded tool call quality and capabilities due to the merge step in their creation.

Flags: --tool-call-parser hermes

For Transformers tokenization backend only: Mistral's tokenizer_config.json chat template requires tool call IDs that are exactly 9 digits, which is much shorter than what vLLM generates. Since an exception is thrown when this condition is not met, the following additional chat templates are provided:

To use the official Mistral AI's format:

--tool-call-parser mistral

To use the Transformers format when available:

--tokenizer_mode hf --config_format hf --load_format hf --tool-call-parser mistral --chat-template examples/tool_chat_template_mistral_parallel.jinja

Models officially released by Mistral AI have two possible formats:

The official format that is used by default with auto or mistral arguments:

--tokenizer_mode mistral --config_format mistral --load_format mistral This format uses mistral-common, the Mistral AI's tokenizer backend.

The Transformers format, when available, that is used with hf arguments:

--tokenizer_mode hf --config_format hf --load_format hf --chat-template examples/tool_chat_template_mistral_parallel.jinja

All Llama 3.1, 3.2 and 4 models should be supported.

The tool calling that is supported is the JSON-based tool calling. For pythonic tool calling introduced by the Llama-3.2 models, see the pythonic tool parser below. As for Llama 4 models, it is recommended to use the llama4_pythonic tool parser.

Other tool calling formats like the built-in python tool calling or custom tool calling are not supported.

VLLM provides two JSON-based chat templates for Llama 3.1 and 3.2:

Recommended flags: --tool-call-parser llama3_json --chat-template {see_above}

VLLM also provides a pythonic and JSON-based chat template for Llama 4, but pythonic tool calling is recommended:

For Llama 4 model, use --tool-call-parser llama4_pythonic --chat-template examples/tool_chat_template_llama4_pythonic.jinja.

ibm-granite/granite-4.0-h-small and other Granite 4.0 models

Recommended flags: --tool-call-parser hermes

ibm-granite/granite-3.0-8b-instruct

Recommended flags: --tool-call-parser granite --chat-template examples/tool_chat_template_granite.jinja

examples/tool_chat_template_granite.jinja: this is a modified chat template from the original on Hugging Face. Parallel function calls are supported.

ibm-granite/granite-3.1-8b-instruct

Recommended flags: --tool-call-parser granite

The chat template from Huggingface can be used directly. Parallel function calls are supported.

ibm-granite/granite-20b-functioncalling

Recommended flags: --tool-call-parser granite-20b-fc --chat-template examples/tool_chat_template_granite_20b_fc.jinja

examples/tool_chat_template_granite_20b_fc.jinja: this is a modified chat template from the original on Hugging Face, which is not vLLM-compatible. It blends function description elements from the Hermes template and follows the same system prompt as "Response Generation" mode from the paper. Parallel function calls are supported.

Recommended flags: --tool-call-parser internlm --chat-template examples/tool_chat_template_internlm2_tool.jinja

AI21's Jamba-1.5 models are supported.

Flags: --tool-call-parser jamba

The xLAM tool parser is designed to support models that generate tool calls in various JSON formats. It detects function calls in several different output styles:

Parallel function calls are supported, and the parser can effectively separate text content from tool calls.

For Qwen2.5, the chat template in tokenizer_config.json has already included support for the Hermes-style tool use. Therefore, you can use the hermes parser to enable tool calls for Qwen models. For more detailed information, please refer to the official Qwen documentation

Flags: --tool-call-parser hermes

Flags: --tool-call-parser minimax --chat-template examples/tool_chat_template_minimax_m1.jinja

Flags: --tool-call-parser deepseek_v3 --chat-template {see_above}

Flags: --tool-call-parser deepseek_v31 --chat-template {see_above}

Flags: --tool-call-parser openai

Flags: --tool-call-parser kimi_k2

Flags: --tool-call-parser longcat

Flags: --tool-call-parser glm45

Flags: --tool-call-parser glm47

Google's FunctionGemma is a lightweight (270M parameter) model specifically designed for function calling. It's built on Gemma 3 and optimized for edge deployment on devices like laptops and phones.

FunctionGemma uses a unique output format with <start_function_call> and <end_function_call> tags:

The model is designed to be fine-tuned for specific function-calling tasks for best results.

Flags: --tool-call-parser functiongemma --chat-template examples/tool_chat_template_functiongemma.jinja

FunctionGemma is intended to be fine-tuned for your specific function-calling task. The base model provides general function calling capabilities, but best results are achieved with task-specific fine-tuning. See Google's FunctionGemma documentation for fine-tuning guides.

Flags: --tool-call-parser qwen3_xml

Olmo 3 models output tool calls in a format that is very similar to the one expected by the pythonic parser (see below), with a few differences. Each tool call is a pythonic string, but the parallel tool calls are newline-delimited, and the calls are wrapped within XML tags as <function_calls>..</function_calls>. In addition, the parser also allows JSON boolean and null literals (true, false, and null) in addition to the pythonic ones (True, False, and None).

Flags: --tool-call-parser olmo3

Use chat template from the Hugging Face model files.

Flags: --tool-call-parser gigachat3

A growing number of models output a python list to represent tool calls instead of using JSON. This has the advantage of inherently supporting parallel tool calls and removing ambiguity around the JSON schema required for tool calls. The pythonic tool parser can support such models.

As a concrete example, these models may look up the weather in San Francisco and Seattle by generating:

Example supported models:

Flags: --tool-call-parser pythonic --chat-template {see_above}

Llama's smaller models frequently fail to emit tool calls in the correct format. Results may vary depending on the model.

A tool parser plugin is a Python file containing one or more ToolParser implementations. You can write a ToolParser similar to the Hermes2ProToolParser in vllm/tool_parsers/hermes_tool_parser.py.

Here is a summary of a plugin file:

Then you can use this plugin in the command line like this.

**Examples:**

Example 1 (unknown):
```unknown
vllm serve meta-llama/Llama-3.1-8B-Instruct \
    --enable-auto-tool-choice \
    --tool-call-parser llama3_json \
    --chat-template examples/tool_chat_template_llama3.1_json.jinja
```

Example 2 (unknown):
```unknown
vllm serve meta-llama/Llama-3.1-8B-Instruct \
    --enable-auto-tool-choice \
    --tool-call-parser llama3_json \
    --chat-template examples/tool_chat_template_llama3.1_json.jinja
```

Example 3 (python):
```python
from openai import OpenAI
import json

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")

def get_weather(location: str, unit: str):
    return f"Getting the weather for {location} in {unit}..."
tool_functions = {"get_weather": get_weather}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City and state, e.g., 'San Francisco, CA'"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["location", "unit"],
            },
        },
    },
]

response = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
    tools=tools,
    tool_choice="auto",
)

tool_call = response.choices[0].message.tool_calls[0].function
print(f"Function called: {tool_call.name}")
print(f"Arguments: {tool_call.arguments}")
print(f"Result: {tool_functions[tool_call.name](**json.loads(tool_call.arguments))}")
```

Example 4 (python):
```python
from openai import OpenAI
import json

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")

def get_weather(location: str, unit: str):
    return f"Getting the weather for {location} in {unit}..."
tool_functions = {"get_weather": get_weather}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City and state, e.g., 'San Francisco, CA'"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["location", "unit"],
            },
        },
    },
]

response = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
    tools=tools,
    tool_choice="auto",
)

tool_call = response.choices[0].message.tool_calls[0].function
print(f"Function called: {tool_call.name}")
print(f"Arguments: {tool_call.arguments}")
print(f"Result: {tool_functions[tool_call.name](**json.loads(tool_call.arguments))}")
```

---

## TorchAO - vLLM

**URL:** https://docs.vllm.ai/en/latest/features/quantization/torchao/

**Contents:**
- TorchAO¶
- Quantizing HuggingFace Models¶

TorchAO is an architecture optimization library for PyTorch, it provides high performance dtypes, optimization techniques and kernels for inference and training, featuring composability with native PyTorch features like torch.compile, FSDP etc.. Some benchmark numbers can be found here.

We recommend installing the latest torchao nightly with

You can quantize your own huggingface model with torchao, e.g. transformers and diffusers, and save the checkpoint to huggingface hub like this with the following example code:

Alternatively, you can use the TorchAO Quantization space for quantizing models with a simple UI.

**Examples:**

Example 1 (markdown):
```markdown
# Install the latest TorchAO nightly build
# Choose the CUDA version that matches your system (cu126, cu128, etc.)
pip install \
    --pre torchao>=10.0.0 \
    --index-url https://download.pytorch.org/whl/nightly/cu126
```

Example 2 (markdown):
```markdown
# Install the latest TorchAO nightly build
# Choose the CUDA version that matches your system (cu126, cu128, etc.)
pip install \
    --pre torchao>=10.0.0 \
    --index-url https://download.pytorch.org/whl/nightly/cu126
```

Example 3 (python):
```python
import torch
from transformers import TorchAoConfig, AutoModelForCausalLM, AutoTokenizer
from torchao.quantization import Int8WeightOnlyConfig

model_name = "meta-llama/Meta-Llama-3-8B"
quantization_config = TorchAoConfig(Int8WeightOnlyConfig())
quantized_model = AutoModelForCausalLM.from_pretrained(
    model_name,
    dtype="auto",
    device_map="auto",
    quantization_config=quantization_config
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
input_text = "What are we having for dinner?"
input_ids = tokenizer(input_text, return_tensors="pt").to("cuda")

hub_repo = # YOUR HUB REPO ID
tokenizer.push_to_hub(hub_repo)
quantized_model.push_to_hub(hub_repo, safe_serialization=False)
```

Example 4 (python):
```python
import torch
from transformers import TorchAoConfig, AutoModelForCausalLM, AutoTokenizer
from torchao.quantization import Int8WeightOnlyConfig

model_name = "meta-llama/Meta-Llama-3-8B"
quantization_config = TorchAoConfig(Int8WeightOnlyConfig())
quantized_model = AutoModelForCausalLM.from_pretrained(
    model_name,
    dtype="auto",
    device_map="auto",
    quantization_config=quantization_config
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
input_text = "What are we having for dinner?"
input_ids = tokenizer(input_text, return_tensors="pt").to("cuda")

hub_repo = # YOUR HUB REPO ID
tokenizer.push_to_hub(hub_repo)
quantized_model.push_to_hub(hub_repo, safe_serialization=False)
```

---
