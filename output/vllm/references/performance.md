# Vllm - Performance

**Pages:** 40

---

## api_server - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/api_server/

**Contents:**
- vllm.entrypoints.api_server ¶
- app module-attribute ¶
- args module-attribute ¶
- engine module-attribute ¶
- logger module-attribute ¶
- parser module-attribute ¶
- _generate async ¶
- build_app ¶
- generate async ¶
- health async ¶

NOTE: This API server is used only for demonstrating usage of AsyncEngine and simple performance benchmarks. It is not intended for production use. For production use, we recommend using our OpenAI compatible server. We are also not going to accept PRs modifying this file, please change vllm/entrypoints/openai/api_server.py instead.

Generate completion for the request.

The request should be a JSON object with the following fields: - prompt: the prompt to use for the generation. - stream: whether to stream the results or not. - other fields: the sampling parameters (See SamplingParams for details).

**Examples:**

Example 1 (unknown):
```unknown
app = FastAPI()
```

Example 2 (unknown):
```unknown
app = FastAPI()
```

Example 3 (unknown):
```unknown
args = parse_args()
```

Example 4 (unknown):
```unknown
args = parse_args()
```

---

## base - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/base/

**Contents:**
- vllm.entrypoints.cli.benchmark.base ¶
- BenchmarkSubcommandBase ¶
  - help instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶

The base class of subcommands for vllm bench.

Add the CLI arguments to the parser.

The arguments to the command.

**Examples:**

Example 1 (unknown):
```unknown
8
 9
10
11
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
```

Example 2 (python):
```python
class BenchmarkSubcommandBase(CLISubcommand):
    """The base class of subcommands for `vllm bench`."""

    help: str

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        """Add the CLI arguments to the parser."""
        raise NotImplementedError

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        """Run the benchmark.

        Args:
            args: The arguments to the command.
        """
        raise NotImplementedError
```

Example 3 (python):
```python
class BenchmarkSubcommandBase(CLISubcommand):
    """The base class of subcommands for `vllm bench`."""

    help: str

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        """Add the CLI arguments to the parser."""
        raise NotImplementedError

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        """Run the benchmark.

        Args:
            args: The arguments to the command.
        """
        raise NotImplementedError
```

Example 4 (rust):
```rust
add_cli_args(parser: ArgumentParser) -> None
```

---

## benchmarks - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/

**Contents:**
- vllm.benchmarks ¶

This module defines a framework for sampling benchmark requests from various

Benchmark the latency of processing a single batch of requests.

Benchmark library utilities.

Benchmark online serving throughput.

Benchmark the cold and warm startup time of vLLM models.

Benchmark offline inference throughput.

---

## Benchmark CLI - vLLM

**URL:** https://docs.vllm.ai/en/latest/benchmarking/cli/

**Contents:**
- Benchmark CLI¶
- Dataset Overview¶
- Examples¶
  - 🚀 Online Benchmark¶
    - Custom Dataset¶
    - VisionArena Benchmark for Vision Language Models¶
    - InstructCoder Benchmark with Speculative Decoding¶
    - Spec Bench Benchmark with Speculative Decoding¶
    - Other HuggingFaceDataset Examples¶
    - Running With Sampling Parameters¶

This section guides you through running benchmark tests with the extensive datasets supported on vLLM.

It's a living document, updated as new features and datasets become available.

HuggingFace dataset's dataset-name should be set to hf. For local dataset-path, please set hf-name to its Hugging Face ID like

First start serving your model:

Then run the benchmarking script:

If successful, you will see the following output:

If the dataset you want to benchmark is not supported yet in vLLM, even then you can benchmark on it using CustomDataset. Your data needs to be in .jsonl format and needs to have "prompt" field per entry, e.g., data.jsonl

You can skip applying chat template if your data already has it by using --custom-skip-chat-template.

Available categories include [writing, roleplay, reasoning, math, coding, extraction, stem, humanities, translation, summarization, qa, math_reasoning, rag].

Run only a specific category like "summarization":

lmms-lab/LLaVA-OneVision-Data:

Aeala/ShareGPT_Vicuna_unfiltered:

AI-MO/aimo-validation-aime:

vdaita/edit_5k_char or vdaita/edit_10k_char:

When using OpenAI-compatible backends such as vllm, optional sampling parameters can be specified. Example client command:

The benchmark tool also supports ramping up the request rate over the duration of the benchmark run. This can be useful for stress testing the server or finding the maximum throughput that it can handle, given some latency budget.

Two ramp-up strategies are supported:

The following arguments can be used to control the ramp-up:

vLLM's benchmark serving script provides sophisticated load pattern simulation capabilities through three key parameters that control request generation and concurrency behavior:

These parameters work together to create realistic load patterns with carefully chosen defaults. The --request-rate parameter defaults to inf (infinite), which sends all requests immediately for maximum throughput testing. When set to finite values, it uses either a Poisson process (default --burstiness=1.0) or Gamma distribution for realistic request timing. The --burstiness parameter only takes effect when --request-rate is not infinite - a value of 1.0 creates natural Poisson traffic, while lower values (0.1-0.5) create bursty patterns and higher values (2.0-5.0) create uniform spacing. The --max-concurrency parameter defaults to None (unlimited) but can be set to simulate real-world constraints where a load balancer or API gateway limits concurrent connections. When combined, these parameters allow you to simulate everything from unrestricted stress testing (--request-rate=inf) to production-like scenarios with realistic arrival patterns and resource constraints.

The --burstiness parameter mathematically controls request arrival patterns using a Gamma distribution where:

Figure: Load pattern examples for each use case. Top row: Request arrival timelines showing cumulative requests over time. Bottom row: Inter-arrival time distributions showing traffic variability patterns. Each column represents a different use case with its specific parameter settings and resulting traffic characteristics.

Load Pattern Recommendations by Use Case:

These load patterns help evaluate different aspects of your vLLM deployment, from basic performance characteristics to resilience under challenging traffic conditions.

The Maximum Throughput pattern (--request-rate=inf --max-concurrency=<limit>) is the most commonly used configuration for production benchmarking. This simulates real-world deployment architectures where:

This pattern helps determine optimal concurrency settings for your production load balancer configuration.

To effectively configure load patterns, especially for Capacity Planning and SLA Validation use cases, you need to understand your system's resource limits. During startup, vLLM reports KV cache configuration that directly impacts your load testing parameters:

Using KV cache metrics for load pattern configuration:

If successful, you will see the following output

The num prompt tokens now includes image token counts

lmms-lab/LLaVA-OneVision-Data:

Aeala/ShareGPT_Vicuna_unfiltered:

AI-MO/aimo-validation-aime:

Benchmark with LoRA adapters:

Benchmark the performance of structured output generation (JSON, grammar, regex).

Benchmark the performance of long document question-answering with prefix caching.

Benchmark the efficiency of automatic prefix caching.

Two helper scripts live in benchmarks/ to compare hashing options used by prefix caching and related utilities. They are standalone (no server required) and help choose a hash algorithm before enabling prefix caching in production.

Supported algorithms: sha256, sha256_cbor, xxhash, xxhash_cbor. Install optional deps to exercise all variants:

If an algorithm’s dependency is missing, the script will skip it and continue.

Benchmark the performance of request prioritization in vLLM.

Benchmark the performance of multi-modal requests in vLLM.

Send requests with images:

Send requests with videos:

Generate synthetic image inputs alongside random text prompts to stress-test vision models without external datasets.

Start the server (example):

Benchmark. It is recommended to use the flag --ignore-eos to simulate real responses. You can set the size of the output via the arg random-output-len.

Ex.1: Fixed number of items and a single image resolution, enforcing generation of approx 40 tokens:

The number of items per request can be controlled by passing multiple image buckets:

Flags specific to random-mm:

Benchmark the performance of embedding requests in vLLM.

Unlike generative models which use Completions API or Chat Completions API, you should set --backend openai-embeddings and --endpoint /v1/embeddings to use the Embeddings API.

You can use any text dataset to benchmark the model, such as ShareGPT.

Unlike generative models which use Completions API or Chat Completions API, you should set --endpoint /v1/embeddings to use the Embeddings API. The backend to use depends on the model:

For other models, please add your own implementation inside vllm/benchmarks/lib/endpoint_request_func.py to match the expected instruction format.

You can use any text or multi-modal dataset to benchmark the model, as long as the model supports it. For example, you can use ShareGPT and VisionArena to benchmark vision-language embeddings.

Serve and benchmark CLIP:

Serve and benchmark VLM2Vec:

Benchmark the performance of rerank requests in vLLM.

Unlike generative models which use Completions API or Chat Completions API, you should set --backend vllm-rerank and --endpoint /v1/rerank to use the Reranker API.

For reranking, the only supported dataset is --dataset-name random-rerank

For reranker models, this will create num_prompts / random_batch_size requests with random_batch_size "documents" where each one has close to random_input_len tokens. In the example above, this results in 2 rerank requests with 5 "documents" each where each document has close to 512 tokens.

Please note that the /v1/rerank is also supported by embedding models. So if you're running with an embedding model, also set --no_reranker. Because in this case the query is treated as an individual prompt by the server, here we send random_batch_size - 1 documents to account for the extra prompt which is the query. The token accounting to report the throughput numbers correctly is also adjusted.

**Examples:**

Example 1 (powershell):
```powershell
--dataset-path /datasets/VisionArena-Chat/ --hf-name lmarena-ai/VisionArena-Chat
```

Example 2 (powershell):
```powershell
--dataset-path /datasets/VisionArena-Chat/ --hf-name lmarena-ai/VisionArena-Chat
```

Example 3 (unknown):
```unknown
vllm serve NousResearch/Hermes-3-Llama-3.1-8B
```

Example 4 (unknown):
```unknown
vllm serve NousResearch/Hermes-3-Llama-3.1-8B
```

---

## Benchmark Suites - vLLM

**URL:** https://docs.vllm.ai/en/latest/benchmarking/

**Contents:**
- Benchmark Suites¶

vLLM provides comprehensive benchmarking tools for performance testing and evaluation:

---

## benchmark - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/

**Contents:**
- vllm.entrypoints.cli.benchmark ¶

---

## cli - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/

**Contents:**
- vllm.entrypoints.cli ¶
- __all__ module-attribute ¶
- BenchmarkLatencySubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶
- BenchmarkServingSubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶

The CLI entrypoints of vLLM

Bases: BenchmarkSubcommandBase

The latency subcommand for vllm bench.

Bases: BenchmarkSubcommandBase

The serve subcommand for vllm bench.

Bases: BenchmarkSubcommandBase

The startup subcommand for vllm bench.

Bases: BenchmarkSubcommandBase

The sweep subcommand for vllm bench.

Bases: BenchmarkSubcommandBase

The throughput subcommand for vllm bench.

**Examples:**

Example 1 (yaml):
```yaml
__all__: list[str] = [
    "BenchmarkLatencySubcommand",
    "BenchmarkServingSubcommand",
    "BenchmarkStartupSubcommand",
    "BenchmarkSweepSubcommand",
    "BenchmarkThroughputSubcommand",
]
```

Example 2 (yaml):
```yaml
__all__: list[str] = [
    "BenchmarkLatencySubcommand",
    "BenchmarkServingSubcommand",
    "BenchmarkStartupSubcommand",
    "BenchmarkSweepSubcommand",
    "BenchmarkThroughputSubcommand",
]
```

Example 3 (unknown):
```unknown
9
10
11
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
```

Example 4 (python):
```python
class BenchmarkLatencySubcommand(BenchmarkSubcommandBase):
    """The `latency` subcommand for `vllm bench`."""

    name = "latency"
    help = "Benchmark the latency of a single batch of requests."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

---

## cli - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/cli/

**Contents:**
- vllm.benchmarks.sweep.cli ¶
- SUBCOMMANDS module-attribute ¶
- add_cli_args ¶
- main ¶

**Examples:**

Example 1 (unknown):
```unknown
SUBCOMMANDS = (
    (SweepServeArgs, main),
    (SweepServeSLAArgs, main),
    (SweepPlotArgs, main),
    (SweepPlotParetoArgs, main),
)
```

Example 2 (unknown):
```unknown
SUBCOMMANDS = (
    (SweepServeArgs, main),
    (SweepServeSLAArgs, main),
    (SweepPlotArgs, main),
    (SweepPlotParetoArgs, main),
)
```

Example 3 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 4 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

---

## datasets - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/datasets/

**Contents:**
- vllm.benchmarks.datasets ¶
- datasets module-attribute ¶
- logger module-attribute ¶
- lora_tokenizer_cache module-attribute ¶
- zeta_prompt module-attribute ¶
- AIMODataset ¶
  - SUPPORTED_DATASET_PATHS class-attribute instance-attribute ¶
  - sample ¶
- ASRDataset ¶
  - DEFAULT_OUTPUT_LEN class-attribute instance-attribute ¶

This module defines a framework for sampling benchmark requests from various datasets. Each dataset subclass of BenchmarkDataset must implement sample generation. Supported dataset types include: - ShareGPT - Random (synthetic) - Sonnet - BurstGPT - HuggingFace - VisionArena

Bases: HuggingFaceDataset

Dataset class for processing a AIMO dataset with reasoning questions.

Bases: HuggingFaceDataset

Dataset class for processing a ASR dataset for transcription. Tested on the following set:

+----------------+----------------------------------------+--------------------------+-----------------------------+ | Dataset | Domain | Speaking Style | hf-subset | +----------------+----------------------------------------+--------------------------+-----------------------------+ | TED-LIUM | TED talks | Oratory | release1, release2, release3| | | | | release3-speaker-adaptation | | VoxPopuli | European Parliament | Oratory | en, de, it, fr, ... | | LibriSpeech | Audiobook | Narrated | "LIUM/tedlium" | | GigaSpeech | Audiobook, podcast, YouTube | Narrated, spontaneous | xs, s, m, l, xl, dev, test | | SPGISpeech | Financial meetings | Oratory, spontaneous | S, M, L, dev, test | | AMI | Meetings | Spontaneous | ihm, sdm | +----------------+----------------------------------------+--------------------------+-----------------------------+

Initialize the BenchmarkDataset with an optional dataset path and random seed.

Path to the dataset. If None, it indicates that a default or random dataset might be used.

Seed value for reproducible shuffling or sampling. Defaults to DEFAULT_SEED.

Transform a prompt and optional multimodal content into a chat format. This method is used for chat models that expect a specific conversation format.

Optionally select a random LoRA request.

This method is used when LoRA parameters are provided. It randomly selects a LoRA based on max_loras.

The maximum number of LoRAs available. If None, LoRA is not used.

Path to the LoRA parameters on disk. If None, LoRA is not used.

(or None if not applicable).

Load data from the dataset path into self.data.

This method must be overridden by subclasses since the method to load data will vary depending on the dataset format and source.

If a subclass does not implement this method.

Oversamples the list of requests if its size is less than the desired number.

The current list of sampled requests.

The target number of requests.

The prefix applied to generated request identifiers.

Abstract method to generate sample requests from the dataset.

Subclasses must override this method to implement dataset-specific logic for generating a list of SampleRequest objects.

The tokenizer to be used for processing the dataset's text.

The number of sample requests to generate.

The prefix of request_id.

list[SampleRequest]: A list of sample requests generated from the

Bases: HuggingFaceDataset

Blazedit Dataset. https://github.com/ise-uiuc/blazedit

5k char version: vdaita/edit_5k_char 10k char version: vdaita/edit_10k_char

Bases: BenchmarkDataset

Implements the BurstGPT dataset. Loads data from a CSV file and generates sample requests based on synthetic prompt generation. Only rows with Model "GPT-4" and positive response tokens are used.

Bases: HuggingFaceDataset

Dataset for text-only conversation data.

Bases: BenchmarkDataset

Implements the Custom dataset. Loads data from a JSONL file and generates sample requests based on conversation turns. E.g.,

Bases: BenchmarkDataset

Base class for datasets hosted on HuggingFace.

Load data from HuggingFace datasets.

Bases: HuggingFaceDataset

InstructCoder Dataset. https://huggingface.co/datasets/likaixin/InstructCoder

InstructCoder is the dataset designed for general code editing. It consists of 114,239 instruction-input-output triplets, and covers multiple distinct code editing scenario.

Bases: HuggingFaceDataset

MLPerf Inference Dataset.

Dataset on HF: https://huggingface.co/datasets/mgoin/mlperf-inference-llama2-data https://huggingface.co/datasets/mgoin/mlperf-inference-llama3.1-data

We combine the system prompt and question into a chat-formatted prompt (using the tokenizer's chat template) and set the expected output length to the tokenized length of the provided reference answer.

Bases: HuggingFaceDataset

Lin-Chen/MMStar: https://huggingface.co/datasets/Lin-Chen/MMStar refer to: https://github.com/sgl-project/SpecForge/pull/106

Bases: HuggingFaceDataset

MMVU Dataset. https://huggingface.co/datasets/yale-nlp/MMVU

Bases: HuggingFaceDataset

MT-Bench Dataset. https://huggingface.co/datasets/philschmid/mt-bench

We create a single turn dataset for MT-Bench. This is similar to Spec decoding benchmark setup in vLLM https://github.com/vllm-project/vllm/blob/9d98ab5ec/examples/offline_inference/eagle.py#L14-L18

Bases: HuggingFaceDataset

Dataset for multimodal conversation data.

Bases: HuggingFaceDataset

Dataset class for processing a Next Edit Prediction dataset.

Bases: BenchmarkDataset

Bases: BenchmarkDataset

Synthetic text-only dataset for serving/throughput benchmarks.

Strategy: - Sample input/output token lengths per request from integer-uniform ranges around configured means (controlled by range_ratio). - Prepend a fixed random prefix of length prefix_len. - Generate the remaining tokens as a reproducible sequence: (offset + index + arange(input_len)) % vocab_size. - Decode then re-encode/truncate to ensure prompt token counts match. - Uses numpy.default_rng seeded with random_seed for reproducible sampling.

Returns (prompt, total_input_len).

NOTE: After decoding the prompt we have to encode and decode it again. This is done because in some cases N consecutive tokens give a string tokenized into != N number of tokens. For example for GPT2Tokenizer: [6880, 6881] -> ['Ġcalls', 'here'] -> [1650, 939, 486] -> ['Ġcall', 'sh', 'ere'] To avoid uncontrolled change of the prompt length, the encoded sequence is truncated before being decoded again.

Get the prefix for the dataset.

Get the sampling parameters for the dataset.

Random dataset specialized for the needs of scoring: - Batches of inputs - Inputs composed of pairs

Synthetic multimodal dataset (text + images) that extends RandomDataset.

Status: - Images: supported via synthetic RGB data. - Video: supported via synthetic RGB data. - Audio: not yet supported.

Sampling overview: 1) Number of items per request is sampled uniformly from the integer range [floor(n·(1−r)), ceil(n·(1+r))], where n is the base count and r is num_mm_items_range_ratio in [0, 1]. r=0 keeps it fixed; r=1 allows 0. The maximum is further clamped to the sum of per-modality limits. 2) Each item’s modality and shape is sampled from bucket_config, a dict mapping (height, width, num_frames) → probability. We treat num_frames=1 as image and num_frames > 1 as video. Entries with zero probability are removed and the rest are renormalized to sum to 1. 3) Per-modality hard caps are enforced via limit_mm_per_prompt. When a modality reaches its cap, all of its buckets are excluded and the remaining probabilities are renormalized.

Example bucket configuration: {(256, 256, 1): 0.5, (720, 1280, 1): 0.4, (720, 1280, 16): 0.1} - Two image buckets (num_frames=1) and one video bucket (num_frames=16). OBS.: Only image sampling is supported for now.

Create synthetic images and videos and apply process_image/process_video respectively. This follows the OpenAI API chat completions https://github.com/openai/openai-python

Generate synthetic PIL image with random RGB values.

NOTE: iid pixel sampling results in worst-case compression (good for stressing I/O), but very unlike real photos. We could consider a “low-freq” mode (e.g., noise blur) to emulate network realism instead of max stress.

Generate synthetic video with random values.

Creates a video with random pixel values, encodes it to MP4 format, and returns the content as bytes.

Iterator over the multimodal items for each request whose size is between min_num_mm_items and max_num_mm_items.

Loop over the bucket config and sample a multimodal item. Loop until the number of multimodal items sampled is equal to request_num_mm_items or limit of multimodal items per prompt for all modalities is reached.

Note: - This function operates on a per-request shallow copy of bucket_config (tuple->float). The original dict passed to sample is not mutated. If this ever changes, a test is implemented and will fail.

Get the sampling parameters for the multimodal items.

Map the configuration to the modality.

Remove zero probability entries and normalize the bucket config to sum to 1.

Represents a single inference request for benchmarking.

Bases: BenchmarkDataset

Implements the ShareGPT dataset. Loads data from a JSON file and generates sample requests based on conversation turns.

Bases: BenchmarkDataset

Simplified implementation of the Sonnet dataset. Loads poem lines from a text file and generates sample requests. Default values here copied from benchmark_serving.py for the sonnet dataset.

Implements the SpecBench dataset: https://github.com/hemingkx/Spec-Bench Download the dataset using: wget https://raw.githubusercontent.com/hemingkx/Spec-Bench/refs/heads/main/data/spec_bench/question.jsonl

Bases: HuggingFaceDataset

Vision Arena Dataset.

Argparse action to validate dataset name and path compatibility.

Format the zeta prompt for the Next Edit Prediction (NEP) dataset.

This function formats examples from the NEP dataset into prompts and expected outputs. It could be further extended to support more NEP datasets.

The dataset sample containing events, inputs, and outputs.

The marker indicating the start of the editable region. Defaults to "<|editable_region_start|>".

A dictionary with the formatted prompts and expected outputs.

Ensure decoded-then-encoded prompt length matches the target token length.

This function decodes an initial token sequence to text and re-encodes it , iteratively adjusting the token sequence length to match a target. This is necessary because some tokenizers do not guarantee a 1:1 mapping between consecutive tokens and the decoded-then-encoded sequence length. For example, for GPT2Tokenizer: [6880, 6881] -> ['Ġcalls', 'here'] -> [1650, 939, 486] -> ['Ġcall', 'sh', 'ere']

Returns a tuple of the final prompt string and the adjusted token sequence.

Validate a sequence based on prompt and output lengths.

Default pruning criteria are copied from the original sample_hf_requests and sample_sharegpt_requests functions in benchmark_serving.py, as well as from sample_requests in benchmark_throughput.py.

Process a single image input and return a multimedia content dictionary.

Supports the following input types:

Dictionary with raw image bytes: - Expects a dict with a 'bytes' key containing raw image data. - Loads the bytes as a PIL.Image.Image.

PIL.Image.Image input: - Converts the image to RGB. - Saves the image as a JPEG in memory. - Encodes the JPEG data as a base64 string. - Returns a dictionary with the image as a base64 data URL.

String input: - Treats the string as a URL or local file path. - Prepends "file://" if the string doesn't start with "http://" or "file://". - Returns a dictionary with the image URL.

If the input is not a supported type.

Process a single video input and return a multimedia content dictionary.

Supports the following input types:

Dictionary with raw video bytes: - Expects a dict with a 'bytes' key containing raw video data.

String input: - Treats the string as a URL or local file path. - Prepends "file://" if the string doesn't start with "http://" or "file://". - Returns a dictionary with the image URL.

If the input is not a supported type.

**Examples:**

Example 1 (unknown):
```unknown
datasets = PlaceholderModule('datasets')
```

Example 2 (unknown):
```unknown
datasets = PlaceholderModule('datasets')
```

Example 3 (unknown):
```unknown
logger = getLogger(__name__)
```

Example 4 (unknown):
```unknown
logger = getLogger(__name__)
```

---

## decode_bench_connector - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/distributed/kv_transfer/kv_connector/v1/decode_bench_connector/

**Contents:**
- vllm.distributed.kv_transfer.kv_connector.v1.decode_bench_connector ¶
- logger module-attribute ¶
- DecodeBenchConnector ¶
  - connector_scheduler instance-attribute ¶
  - connector_worker instance-attribute ¶
  - __init__ ¶
  - build_connector_meta ¶
  - get_num_new_matched_tokens ¶
  - register_kv_caches ¶
  - request_finished ¶

DecodeBenchConnector: A KV Connector for decode instance performance testing.

This connector emulates a prefill-decode disaggregated setting by filling the KV cache with dummy values, allowing measurement of decoder performance under larger input sequence lengths (ISL) in resource-limited environments.

To use this connector for benchmarking, configure it in the kv_transfer_config:

Example: vllm serve --kv-transfer-config '{ "kv_connector": "DecodeBenchConnector", "kv_role": "kv_both", "kv_connector_extra_config": { "fill_mean": 0.015, "fill_std": 0.0 } }'

Then run your benchmark with desired input/output lengths: vllm bench serve --base-url http://127.0.0.1:8000 --model \ --dataset-name random --random-input-len 40000 \ --random-output-len 100 --max-concurrency 10

Configuration options (via kv_connector_extra_config): - fill_mean (float): Mean value for random normal fill (default: 0.015) - fill_std (float): Standard deviation for random fill (default: 0.0) Set to 0 for constant values, >0 for random sampling

Bases: KVConnectorBase_V1

A KV Connector for decode instance performance testing.

This connector fills the KV cache with dummy (non-zero) values to emulate a prefill-decode disaggregated setting, enabling performance testing of the decoder with larger input sequence lengths.

Bases: KVConnectorMetadata

Metadata for DecodeBenchConnector.

Contains information about which requests need their KV cache filled with dummy values for benchmarking purposes.

Scheduler-side implementation for DecodeBenchConnector.

Build metadata containing information about which blocks to fill with dummy KV values.

For new requests, return the number of tokens that should be filled with dummy KV cache values.

(num_tokens_to_fill, is_async)

Called when a request has finished. Clean up any state.

Called after blocks are allocated. Store the block IDs so we can fill them with dummy values.

Supports both standard attention (single KV cache group) and MLA (multiple KV cache groups).

Worker-side implementation for DecodeBenchConnector.

Fill specified blocks with dummy non-zero values for a specific KV cache group.

The KV cache group index to fill

List of block IDs to fill in this group

Total number of tokens to fill across these blocks

Store references to the KV cache tensors and build group mapping.

Fill the allocated KV cache blocks with dummy (non-zero) values.

This simulates having a populated KV cache from a prefill phase, allowing decode performance testing with larger context sizes.

Supports both standard attention (single group) and MLA (multiple groups).

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
```

Example 4 (python):
```python
class DecodeBenchConnector(KVConnectorBase_V1):
    """
    A KV Connector for decode instance performance testing.

    This connector fills the KV cache with dummy (non-zero) values to
    emulate a prefill-decode disaggregated setting, enabling performance
    testing of the decoder with larger input sequence lengths.
    """

    def __init__(
        self,
        vllm_config: "VllmConfig",
        role: KVConnectorRole,
        kv_cache_config: Optional["KVCacheConfig"] = None,
    ):
        super().__init__(vllm_config, role, kv_cache_config)

        self.connector_scheduler: DecodeBenchConnectorScheduler | None = None
        self.connector_worker: DecodeBenchConnectorWorker | None = None

        if role == KVConnectorRole.SCHEDULER:
            self.connector_scheduler = DecodeBenchConnectorScheduler(vllm_config)
        elif role == KVConnectorRole.WORKER:
            self.connector_worker = DecodeBenchConnectorWorker(vllm_config)

    # ==============================
    # Worker-side methods
    # ==============================

    def register_kv_caches(self, kv_caches: dict[str, torch.Tensor]):
        assert self.connector_worker is not None
        self.connector_worker.register_kv_caches(kv_caches)

    def start_load_kv(self, forward_context: "ForwardContext", **kwargs: Any) -> None:
        assert self.connector_worker is not None
        assert isinstance(self._connector_metadata, DecodeBenchConnectorMetadata)
        self.connector_worker.start_fill_kv(self._connector_metadata)

    def wait_for_layer_load(self, layer_name: str) -> None:
        # All operations are synchronous, so nothing to wait for
        pass

    def save_kv_layer(
        self,
        layer_name: str,
        kv_layer: torch.Tensor,
        attn_metadata: AttentionMetadata,
        **kwargs: Any,
    ) -> None:
        # This connector doesn't save KV cache (benchmarking only)
        pass

    def wait_for_save(self):
        # This connector doesn't save KV cache (benchmarking only)
        pass

    # ==============================
    # Scheduler-side methods
    # ==============================

    def get_num_new_matched_tokens(
        self,
        request: "Request",
        num_computed_tokens: int,
    ) -> tuple[int | None, bool]:
        assert self.connector_scheduler is not None
        return self.connector_scheduler.get_num_new_matched_tokens(
            request, num_computed_tokens
        )

    def update_state_after_alloc(
        self, request: "Request", blocks: "KVCacheBlocks", num_external_tokens: int
    ):
        assert self.connector_scheduler is not None
        return self.connector_scheduler.update_state_after_alloc(
            request, blocks, num_external_tokens
        )

    def build_connector_meta(
        self, scheduler_output: "SchedulerOutput"
    ) -> KVConnectorMetadata:
        assert self.connector_scheduler is not None
        return self.connector_scheduler.build_connector_meta(scheduler_output)

    def request_finished(
        self,
        request: "Request",
        block_ids: list[int],
    ) -> tuple[bool, dict[str, Any] | None]:
        assert self.connector_scheduler is not None
        self.connector_scheduler.request_finished(request)
        return False, None
```

---

## endpoint_request_func - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/lib/endpoint_request_func/

**Contents:**
- vllm.benchmarks.lib.endpoint_request_func ¶
- AIOHTTP_TIMEOUT module-attribute ¶
- ASYNC_REQUEST_FUNCS module-attribute ¶
- OPENAI_COMPATIBLE_BACKENDS module-attribute ¶
- RequestFunc ¶
  - __call__ ¶
- RequestFuncInput dataclass ¶
  - api_url instance-attribute ¶
  - extra_body class-attribute instance-attribute ¶
  - extra_headers class-attribute instance-attribute ¶

The request function for API endpoints.

The input for the request function.

The output of the request function including metrics.

Handles streaming HTTP responses by accumulating chunks until complete messages are available.

Add a chunk of bytes to the buffer and return any complete messages.

The async request function for the OpenAI Completions API.

The input for the request function.

The progress bar to display the progress.

The output of the request function.

**Examples:**

Example 1 (unknown):
```unknown
AIOHTTP_TIMEOUT = ClientTimeout(total=6 * 60 * 60)
```

Example 2 (unknown):
```unknown
AIOHTTP_TIMEOUT = ClientTimeout(total=6 * 60 * 60)
```

Example 3 (json):
```json
ASYNC_REQUEST_FUNCS: dict[str, RequestFunc] = {
    "vllm": async_request_openai_completions,
    "openai": async_request_openai_completions,
    "openai-chat": async_request_openai_chat_completions,
    "openai-audio": async_request_openai_audio,
    "openai-embeddings": async_request_openai_embeddings,
    "openai-embeddings-chat": async_request_openai_embeddings_chat,
    "openai-embeddings-clip": async_request_openai_embeddings_clip,
    "openai-embeddings-vlm2vec": async_request_openai_embeddings_vlm2vec,
    "infinity-embeddings": async_request_infinity_embeddings,
    "infinity-embeddings-clip": async_request_infinity_embeddings_clip,
    "vllm-rerank": async_request_vllm_rerank,
}
```

Example 4 (json):
```json
ASYNC_REQUEST_FUNCS: dict[str, RequestFunc] = {
    "vllm": async_request_openai_completions,
    "openai": async_request_openai_completions,
    "openai-chat": async_request_openai_chat_completions,
    "openai-audio": async_request_openai_audio,
    "openai-embeddings": async_request_openai_embeddings,
    "openai-embeddings-chat": async_request_openai_embeddings_chat,
    "openai-embeddings-clip": async_request_openai_embeddings_clip,
    "openai-embeddings-vlm2vec": async_request_openai_embeddings_vlm2vec,
    "infinity-embeddings": async_request_infinity_embeddings,
    "infinity-embeddings-clip": async_request_infinity_embeddings_clip,
    "vllm-rerank": async_request_vllm_rerank,
}
```

---

## latency - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/latency/

**Contents:**
- vllm.benchmarks.latency ¶
- add_cli_args ¶
- main ¶
- save_to_pytorch_benchmark_format ¶

Benchmark the latency of processing a single batch of requests.

**Examples:**

Example 1 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 2 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 3 (unknown):
```unknown
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
```

Example 4 (python):
```python
def add_cli_args(parser: argparse.ArgumentParser):
    parser.add_argument("--input-len", type=int, default=32)
    parser.add_argument("--output-len", type=int, default=128)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument(
        "--n",
        type=int,
        default=1,
        help="Number of generated sequences per prompt.",
    )
    parser.add_argument("--use-beam-search", action="store_true")
    parser.add_argument(
        "--num-iters-warmup",
        type=int,
        default=10,
        help="Number of iterations to run for warmup.",
    )
    parser.add_argument(
        "--num-iters", type=int, default=30, help="Number of iterations to run."
    )
    parser.add_argument(
        "--profile",
        action="store_true",
        help="profile the generation process of a single batch",
    )
    parser.add_argument(
        "--output-json",
        type=str,
        default=None,
        help="Path to save the latency results in JSON format.",
    )
    parser.add_argument(
        "--disable-detokenize",
        action="store_true",
        help=(
            "Do not detokenize responses (i.e. do not include "
            "detokenization time in the latency measurement)"
        ),
    )

    parser = EngineArgs.add_cli_args(parser)
    # V1 enables prefix caching by default which skews the latency
    # numbers. We need to disable prefix caching by default.
    parser.set_defaults(enable_prefix_caching=False)
```

---

## latency - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/latency/

**Contents:**
- vllm.entrypoints.cli.benchmark.latency ¶
- BenchmarkLatencySubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶

Bases: BenchmarkSubcommandBase

The latency subcommand for vllm bench.

**Examples:**

Example 1 (unknown):
```unknown
9
10
11
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
```

Example 2 (python):
```python
class BenchmarkLatencySubcommand(BenchmarkSubcommandBase):
    """The `latency` subcommand for `vllm bench`."""

    name = "latency"
    help = "Benchmark the latency of a single batch of requests."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 3 (python):
```python
class BenchmarkLatencySubcommand(BenchmarkSubcommandBase):
    """The `latency` subcommand for `vllm bench`."""

    name = "latency"
    help = "Benchmark the latency of a single batch of requests."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 4 (unknown):
```unknown
help = (
    "Benchmark the latency of a single batch of requests."
)
```

---

## lib - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/lib/

**Contents:**
- vllm.benchmarks.lib ¶

Benchmark library utilities.

The request function for API endpoints.

Utilities for checking endpoint readiness.

---

## LMCache Examples - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/others/lmcache/

**Contents:**
- LMCache Examples¶
- 1. Disaggregated Prefill in vLLM v1¶
  - Prerequisites¶
  - Usage¶
  - Components¶
    - Server Scripts¶
    - Configuration¶
    - Log Files¶
- 2. CPU Offload Examples¶
- 3. KV Cache Sharing¶

Source https://github.com/vllm-project/vllm/tree/main/examples/others/lmcache.

This folder demonstrates how to use LMCache for disaggregated prefilling, CPU offloading and KV cache sharing.

This example demonstrates how to run LMCache with disaggregated prefill using NIXL on a single node.

Run cd disagg_prefill_lmcache_v1 to get into disagg_prefill_lmcache_v1 folder, and then run

to run disaggregated prefill and benchmark the performance.

The main script generates several log files:

The kv_cache_sharing_lmcache_v1.py example demonstrates how to share KV caches between vLLM v1 instances.

The disaggregated_prefill_lmcache_v0.py provides an example of how to run disaggregated prefill in vLLM v0.

**Examples:**

Example 1 (unknown):
```unknown
bash disagg_example_nixl.sh
```

Example 2 (unknown):
```unknown
bash disagg_example_nixl.sh
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This file demonstrates the example usage of cpu offloading
with LMCache in vLLM v1 or v0.

Usage:

    Specify vLLM version

    -v v0 : Use LMCacheConnector
            model = mistralai/Mistral-7B-Instruct-v0.2
            (Includes enable_chunked_prefill = True)

    -v v1 : Use LMCacheConnectorV1 (default)
            model = meta-llama/Meta-Llama-3.1-8B-Instruct
            (Without enable_chunked_prefill)

Note that `lmcache` is needed to run this example.
Requirements:
https://docs.lmcache.ai/getting_started/installation.html#prerequisites
Learn more about LMCache environment setup, please refer to:
https://docs.lmcache.ai/getting_started/installation.html
"""

import argparse
import contextlib
import os
import time
from dataclasses import asdict

from lmcache.integration.vllm.utils import ENGINE_NAME
from lmcache.v1.cache_engine import LMCacheEngineBuilder

from vllm import LLM, SamplingParams
from vllm.config import KVTransferConfig
from vllm.engine.arg_utils import EngineArgs


def setup_environment_variables():
    # LMCache-related environment variables
    # Use experimental features in LMCache
    os.environ["LMCACHE_USE_EXPERIMENTAL"] = "True"
    # LMCache is set to use 256 tokens per chunk
    os.environ["LMCACHE_CHUNK_SIZE"] = "256"
    # Enable local CPU backend in LMCache
    os.environ["LMCACHE_LOCAL_CPU"] = "True"
    # Set local CPU memory limit to 5.0 GB
    os.environ["LMCACHE_MAX_LOCAL_CPU_SIZE"] = "5.0"


@contextlib.contextmanager
def build_llm_with_lmcache(lmcache_connector: str, model: str):
    ktc = KVTransferConfig(
        kv_connector=lmcache_connector,
        kv_role="kv_both",
    )
    # Set GPU memory utilization to 0.8 for an A40 GPU with 40GB
    # memory. Reduce the value if your GPU has less memory.
    # Note: LMCache supports chunked prefill (see vLLM#14505, LMCache#392).
    llm_args = EngineArgs(
        model=model,
        kv_transfer_config=ktc,
        max_model_len=8000,
        gpu_memory_utilization=0.8,
    )

    llm = LLM(**asdict(llm_args))
    try:
        yield llm
    finally:
        # Clean up lmcache backend
        LMCacheEngineBuilder.destroy(ENGINE_NAME)


def print_output(
    llm: LLM,
    prompt: list[str],
    sampling_params: SamplingParams,
    req_str: str,
):
    # Should be able to see logs like the following:
    # `LMCache INFO: Storing KV cache for 6006 out of 6006 tokens for request 0`
    # This indicates that the KV cache has been stored in LMCache.
    start = time.time()
    outputs = llm.generate(prompt, sampling_params)
    print("-" * 50)
    for output in outputs:
        generated_text = output.outputs[0].text
        print(f"Generated text: {generated_text!r}")
    print(f"Generation took {time.time() - start:.2f} seconds, {req_str} request done.")
    print("-" * 50)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-v",
        "--version",
        choices=["v0", "v1"],
        default="v1",
        help="Specify vLLM version (default: v1)",
    )
    return parser.parse_args()


def main():
    lmcache_connector = "LMCacheConnectorV1"
    model = "meta-llama/Meta-Llama-3.1-8B-Instruct"
    setup_environment_variables()
    with build_llm_with_lmcache(lmcache_connector, model) as llm:
        # This example script runs two requests with a shared prefix.
        # Define the shared prompt and specific prompts
        shared_prompt = "Hello, how are you?" * 1000
        first_prompt = [
            shared_prompt + "Hello, my name is",
        ]
        second_prompt = [
            shared_prompt + "Tell me a very long story",
        ]

        sampling_params = SamplingParams(temperature=0, top_p=0.95, max_tokens=10)

        # Print the first output
        print_output(llm, first_prompt, sampling_params, "first")

        time.sleep(1)

        # print the second output
        print_output(llm, second_prompt, sampling_params, "second")


if __name__ == "__main__":
    main()
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This file demonstrates the example usage of cpu offloading
with LMCache in vLLM v1 or v0.

Usage:

    Specify vLLM version

    -v v0 : Use LMCacheConnector
            model = mistralai/Mistral-7B-Instruct-v0.2
            (Includes enable_chunked_prefill = True)

    -v v1 : Use LMCacheConnectorV1 (default)
            model = meta-llama/Meta-Llama-3.1-8B-Instruct
            (Without enable_chunked_prefill)

Note that `lmcache` is needed to run this example.
Requirements:
https://docs.lmcache.ai/getting_started/installation.html#prerequisites
Learn more about LMCache environment setup, please refer to:
https://docs.lmcache.ai/getting_started/installation.html
"""

import argparse
import contextlib
import os
import time
from dataclasses import asdict

from lmcache.integration.vllm.utils import ENGINE_NAME
from lmcache.v1.cache_engine import LMCacheEngineBuilder

from vllm import LLM, SamplingParams
from vllm.config import KVTransferConfig
from vllm.engine.arg_utils import EngineArgs


def setup_environment_variables():
    # LMCache-related environment variables
    # Use experimental features in LMCache
    os.environ["LMCACHE_USE_EXPERIMENTAL"] = "True"
    # LMCache is set to use 256 tokens per chunk
    os.environ["LMCACHE_CHUNK_SIZE"] = "256"
    # Enable local CPU backend in LMCache
    os.environ["LMCACHE_LOCAL_CPU"] = "True"
    # Set local CPU memory limit to 5.0 GB
    os.environ["LMCACHE_MAX_LOCAL_CPU_SIZE"] = "5.0"


@contextlib.contextmanager
def build_llm_with_lmcache(lmcache_connector: str, model: str):
    ktc = KVTransferConfig(
        kv_connector=lmcache_connector,
        kv_role="kv_both",
    )
    # Set GPU memory utilization to 0.8 for an A40 GPU with 40GB
    # memory. Reduce the value if your GPU has less memory.
    # Note: LMCache supports chunked prefill (see vLLM#14505, LMCache#392).
    llm_args = EngineArgs(
        model=model,
        kv_transfer_config=ktc,
        max_model_len=8000,
        gpu_memory_utilization=0.8,
    )

    llm = LLM(**asdict(llm_args))
    try:
        yield llm
    finally:
        # Clean up lmcache backend
        LMCacheEngineBuilder.destroy(ENGINE_NAME)


def print_output(
    llm: LLM,
    prompt: list[str],
    sampling_params: SamplingParams,
    req_str: str,
):
    # Should be able to see logs like the following:
    # `LMCache INFO: Storing KV cache for 6006 out of 6006 tokens for request 0`
    # This indicates that the KV cache has been stored in LMCache.
    start = time.time()
    outputs = llm.generate(prompt, sampling_params)
    print("-" * 50)
    for output in outputs:
        generated_text = output.outputs[0].text
        print(f"Generated text: {generated_text!r}")
    print(f"Generation took {time.time() - start:.2f} seconds, {req_str} request done.")
    print("-" * 50)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-v",
        "--version",
        choices=["v0", "v1"],
        default="v1",
        help="Specify vLLM version (default: v1)",
    )
    return parser.parse_args()


def main():
    lmcache_connector = "LMCacheConnectorV1"
    model = "meta-llama/Meta-Llama-3.1-8B-Instruct"
    setup_environment_variables()
    with build_llm_with_lmcache(lmcache_connector, model) as llm:
        # This example script runs two requests with a shared prefix.
        # Define the shared prompt and specific prompts
        shared_prompt = "Hello, how are you?" * 1000
        first_prompt = [
            shared_prompt + "Hello, my name is",
        ]
        second_prompt = [
            shared_prompt + "Tell me a very long story",
        ]

        sampling_params = SamplingParams(temperature=0, top_p=0.95, max_tokens=10)

        # Print the first output
        print_output(llm, first_prompt, sampling_params, "first")

        time.sleep(1)

        # print the second output
        print_output(llm, second_prompt, sampling_params, "second")


if __name__ == "__main__":
    main()
```

---

## main - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/main/

**Contents:**
- vllm.entrypoints.cli.benchmark.main ¶
- BenchmarkSubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - cmd staticmethod ¶
  - subparser_init ¶
  - validate ¶
- cmd_init ¶

The bench subcommand for the vLLM CLI.

**Examples:**

Example 1 (unknown):
```unknown
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
```

Example 2 (python):
```python
class BenchmarkSubcommand(CLISubcommand):
    """The `bench` subcommand for the vLLM CLI."""

    name = "bench"
    help = "vLLM bench subcommand."

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        args.dispatch_function(args)

    def validate(self, args: argparse.Namespace) -> None:
        pass

    def subparser_init(
        self, subparsers: argparse._SubParsersAction
    ) -> FlexibleArgumentParser:
        bench_parser = subparsers.add_parser(
            self.name,
            help=self.help,
            description=self.help,
            usage=f"vllm {self.name} <bench_type> [options]",
        )
        bench_subparsers = bench_parser.add_subparsers(required=True, dest="bench_type")

        for cmd_cls in BenchmarkSubcommandBase.__subclasses__():
            cmd_subparser = bench_subparsers.add_parser(
                cmd_cls.name,
                help=cmd_cls.help,
                description=cmd_cls.help,
                usage=f"vllm {self.name} {cmd_cls.name} [options]",
            )
            cmd_subparser.set_defaults(dispatch_function=cmd_cls.cmd)
            cmd_cls.add_cli_args(cmd_subparser)
            cmd_subparser.epilog = VLLM_SUBCMD_PARSER_EPILOG.format(
                subcmd=f"{self.name} {cmd_cls.name}"
            )
        return bench_parser
```

Example 3 (python):
```python
class BenchmarkSubcommand(CLISubcommand):
    """The `bench` subcommand for the vLLM CLI."""

    name = "bench"
    help = "vLLM bench subcommand."

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        args.dispatch_function(args)

    def validate(self, args: argparse.Namespace) -> None:
        pass

    def subparser_init(
        self, subparsers: argparse._SubParsersAction
    ) -> FlexibleArgumentParser:
        bench_parser = subparsers.add_parser(
            self.name,
            help=self.help,
            description=self.help,
            usage=f"vllm {self.name} <bench_type> [options]",
        )
        bench_subparsers = bench_parser.add_subparsers(required=True, dest="bench_type")

        for cmd_cls in BenchmarkSubcommandBase.__subclasses__():
            cmd_subparser = bench_subparsers.add_parser(
                cmd_cls.name,
                help=cmd_cls.help,
                description=cmd_cls.help,
                usage=f"vllm {self.name} {cmd_cls.name} [options]",
            )
            cmd_subparser.set_defaults(dispatch_function=cmd_cls.cmd)
            cmd_cls.add_cli_args(cmd_subparser)
            cmd_subparser.epilog = VLLM_SUBCMD_PARSER_EPILOG.format(
                subcmd=f"{self.name} {cmd_cls.name}"
            )
        return bench_parser
```

Example 4 (unknown):
```unknown
help = 'vLLM bench subcommand.'
```

---

## Optimization and Tuning - vLLM

**URL:** https://docs.vllm.ai/en/latest/configuration/optimization/

**Contents:**
- Optimization and Tuning¶
- Preemption¶
- Chunked Prefill¶
  - Performance Tuning with Chunked Prefill¶
- Parallelism Strategies¶
  - Tensor Parallelism (TP)¶
  - Pipeline Parallelism (PP)¶
  - Expert Parallelism (EP)¶
  - Data Parallelism (DP)¶
  - Batch-level DP for Multi-Modal Encoders¶

This guide covers optimization strategies and performance tuning for vLLM V1.

Running out of memory? Consult this guide on how to conserve memory.

Due to the autoregressive nature of transformer architecture, there are times when KV cache space is insufficient to handle all batched requests. In such cases, vLLM can preempt requests to free up KV cache space for other requests. Preempted requests are recomputed when sufficient KV cache space becomes available again. When this occurs, you may see the following warning:

While this mechanism ensures system robustness, preemption and recomputation can adversely affect end-to-end latency. If you frequently encounter preemptions, consider the following actions:

You can monitor the number of preemption requests through Prometheus metrics exposed by vLLM. Additionally, you can log the cumulative number of preemption requests by setting disable_log_stats=False.

In vLLM V1, the default preemption mode is RECOMPUTE rather than SWAP, as recomputation has lower overhead in the V1 architecture.

Chunked prefill allows vLLM to process large prefills in smaller chunks and batch them together with decode requests. This feature helps improve both throughput and latency by better balancing compute-bound (prefill) and memory-bound (decode) operations.

In V1, chunked prefill is enabled by default whenever possible. With chunked prefill enabled, the scheduling policy prioritizes decode requests. It batches all pending decode requests before scheduling any prefill operations. When there are available tokens in the max_num_batched_tokens budget, it schedules pending prefills. If a pending prefill request cannot fit into max_num_batched_tokens, it automatically chunks it.

This policy has two benefits:

You can tune the performance by adjusting max_num_batched_tokens:

See related papers for more details (https://arxiv.org/pdf/2401.08671 or https://arxiv.org/pdf/2308.16369).

vLLM supports multiple parallelism strategies that can be combined to optimize performance across different hardware configurations.

Tensor parallelism shards model parameters across multiple GPUs within each model layer. This is the most common strategy for large model inference within a single node.

For models that are too large to fit on a single GPU (like 70B parameter models), tensor parallelism is essential.

Pipeline parallelism distributes model layers across multiple GPUs. Each GPU processes different parts of the model in sequence.

Pipeline parallelism can be combined with tensor parallelism for very large models:

Expert parallelism is a specialized form of parallelism for Mixture of Experts (MoE) models, where different expert networks are distributed across GPUs.

Expert parallelism is enabled by setting enable_expert_parallel=True, which will use expert parallelism instead of tensor parallelism for MoE layers. It will use the same degree of parallelism as what you have set for tensor parallelism.

Data parallelism replicates the entire model across multiple GPU sets and processes different batches of requests in parallel.

Data parallelism can be combined with the other parallelism strategies and is set by data_parallel_size=N. Note that MoE layers will be sharded according to the product of the tensor parallel size and data parallel size.

By default, TP is used to shard the weights of multi-modal encoders just like for language decoders, in order to reduce the memory and compute load on each GPU.

However, since the size of multi-modal encoders is very small compared to language decoders, there is relatively little gain from TP. On the other hand, TP incurs significant communication overhead because of all-reduce being performed after every layer.

Given this, it may be advantageous to instead shard the batched input data using TP, essentially performing batch-level DP. This has been shown to improve the throughput and TTFT by around 10% for tensor_parallel_size=8. For vision encoders that use hardware-unoptimized Conv3D operations, batch-level DP can provide another 40% improvement compared to regular TP.

Nevertheless, since the weights of the multi-modal encoder are replicated across each TP rank, there will be a minor increase in memory consumption and may cause OOM if you can barely fit the model already.

You can enable batch-level DP by setting mm_encoder_tp_mode="data", for example:

Batch-level DP is not to be confused with API request-level DP (which is instead controlled by data_parallel_size).

Batch-level DP needs to be implemented on a per-model basis, and enabled by setting supports_encoder_tp_data = True in the model class. Regardless, you need to set mm_encoder_tp_mode="data" in engine arguments to use this feature.

Known supported models (with corresponding benchmarks):

You can run input processing in parallel via API server scale-out. This is useful when input processing (which is run inside the API server) becomes a bottleneck compared to model execution (which is run inside engine core) and you have excess CPU capacity.

API server scale-out is only available for online inference.

By default, 8 CPU threads are used in each API server to load media items (e.g. images) from request data.

If you apply API server scale-out, consider adjusting VLLM_MEDIA_LOADING_THREAD_COUNT to avoid CPU resource exhaustion.

API server scale-out disables multi-modal IPC caching because it requires a one-to-one correspondence between API and engine core processes.

This does not impact multi-modal processor caching.

Multi-modal caching avoids repeated transfer or processing of the same multi-modal data, which commonly occurs in multi-turn conversations.

Multi-modal processor caching is automatically enabled to avoid repeatedly processing the same multi-modal inputs in BaseMultiModalProcessor.

Multi-modal IPC caching is automatically enabled when there is a one-to-one correspondence between API (P0) and engine core (P1) processes, to avoid repeatedly transferring the same multi-modal inputs between them.

By default, IPC caching uses a key-replicated cache, where cache keys exist in both the API (P0) and engine core (P1) processes, but the actual cache data resides only in P1.

When multiple worker processes are involved (e.g., when TP > 1), a shared-memory cache is more efficient. This can be enabled by setting mm_processor_cache_type="shm". In this mode, cache keys are stored on P0, while the cache data itself lives in shared memory accessible by all processes.

You can adjust the size of the cache by setting the value of mm_processor_cache_gb (default 4 GiB).

If you do not benefit much from the cache, you can disable both IPC and processor caching completely via mm_processor_cache_gb=0.

Based on the configuration, the content of the multi-modal caches on P0 and P1 are as follows:

K: Stores the hashes of multi-modal items V: Stores the processed tensor data of multi-modal items

**Examples:**

Example 1 (julia):
```julia
WARNING 05-09 00:49:33 scheduler.py:1057 Sequence group 0 is preempted by PreemptionMode.RECOMPUTE mode because there is not enough KV cache space. This can affect the end-to-end performance. Increase gpu_memory_utilization or tensor_parallel_size to provide more KV cache memory. total_cumulative_preemption_cnt=1
```

Example 2 (julia):
```julia
WARNING 05-09 00:49:33 scheduler.py:1057 Sequence group 0 is preempted by PreemptionMode.RECOMPUTE mode because there is not enough KV cache space. This can affect the end-to-end performance. Increase gpu_memory_utilization or tensor_parallel_size to provide more KV cache memory. total_cumulative_preemption_cnt=1
```

Example 3 (python):
```python
from vllm import LLM

# Set max_num_batched_tokens to tune performance
llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct", max_num_batched_tokens=16384)
```

Example 4 (python):
```python
from vllm import LLM

# Set max_num_batched_tokens to tune performance
llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct", max_num_batched_tokens=16384)
```

---

## Optimization levels - vLLM

**URL:** https://docs.vllm.ai/en/latest/design/optimization_levels/

**Contents:**
- Optimization Levels¶
- Overview¶
- Level Summaries and Usage Examples¶
    - -O1: Quick Optimizations¶
    - -O2: Full Optimizations (Default)¶
    - -O3: Full Optimization¶
- Troubleshooting¶
  - Common Issues¶

vLLM now supports optimization levels (-O0, -O1, -O2, -O3). Optimization levels provide an intuitive mechanism for users to trade startup time for performance. Higher levels have better performance but worse startup time. These optimization levels have associated defaults to help users get desired out-of-the-box performance. Importantly, defaults set by optimization levels are purely defaults; explicit user settings will not be overwritten.

Still in development. Added infrastructure to prevent changing API in future release. Currently behaves the same O2.

**Examples:**

Example 1 (sql):
```sql
# CLI usage
python -m vllm.entrypoints.api_server --model RedHatAI/Llama-3.2-1B-FP8 -O0

# Python API usage
from vllm.entrypoints.llm import LLM

llm = LLM(
    model="RedHatAI/Llama-3.2-1B-FP8",
    optimization_level=0
)
```

Example 2 (sql):
```sql
# CLI usage
python -m vllm.entrypoints.api_server --model RedHatAI/Llama-3.2-1B-FP8 -O0

# Python API usage
from vllm.entrypoints.llm import LLM

llm = LLM(
    model="RedHatAI/Llama-3.2-1B-FP8",
    optimization_level=0
)
```

Example 3 (sql):
```sql
# CLI usage
python -m vllm.entrypoints.api_server --model RedHatAI/Llama-3.2-1B-FP8 -O1

# Python API usage
from vllm.entrypoints.llm import LLM

llm = LLM(
    model="RedHatAI/Llama-3.2-1B-FP8",
    optimization_level=1
)
```

Example 4 (sql):
```sql
# CLI usage
python -m vllm.entrypoints.api_server --model RedHatAI/Llama-3.2-1B-FP8 -O1

# Python API usage
from vllm.entrypoints.llm import LLM

llm = LLM(
    model="RedHatAI/Llama-3.2-1B-FP8",
    optimization_level=1
)
```

---

## Parameter Sweeps - vLLM

**URL:** https://docs.vllm.ai/en/latest/benchmarking/sweeps/

**Contents:**
- Parameter Sweeps¶
- Online Benchmark¶
  - Basic¶
  - SLA auto-tuner¶
- Visualization¶
  - Basic¶
  - Pareto chart¶

vllm bench sweep serve automatically starts vllm serve and runs vllm bench serve to evaluate vLLM over multiple configurations.

Follow these steps to run the script:

(Optional) If you would like to vary the settings of vllm serve, create a new JSON file and populate it with the parameter combinations you want to test. Pass the file path to --serve-params.

(Optional) If you would like to vary the settings of vllm bench serve, create a new JSON file and populate it with the parameter combinations you want to test. Pass the file path to --bench-params.

Determine where you want to save the results, and pass that to --output-dir.

If both --serve-params and --bench-params are passed, the script will iterate over the Cartesian product between them. You can use --dry-run to preview the commands to be run.

We only start the server once for each --serve-params, and keep it running for multiple --bench-params. Between each benchmark run, we call the /reset_prefix_cache and /reset_mm_cache endpoints to get a clean slate for the next run. In case you are using a custom --serve-cmd, you can override the commands used for resetting the state by setting --after-bench-cmd.

By default, each parameter combination is run 3 times to make the results more reliable. You can adjust the number of runs by setting --num-runs.

You can use the --resume option to continue the parameter sweep if one of the runs failed.

vllm bench sweep serve_sla is a wrapper over vllm bench sweep serve that tunes either the request rate or concurrency (choose using --sla-variable) in order to satisfy the SLA constraints given by --sla-params.

For example, to ensure E2E latency within different target values for 99% of requests:

The algorithm for adjusting the SLA variable is as follows:

SLA tuning is applied over each combination of --serve-params, --bench-params, and --sla-params.

For a given combination of --serve-params and --bench-params, we share the benchmark results across --sla-params to avoid rerunning benchmarks with the same SLA variable value.

vllm bench sweep plot can be used to plot performance curves from parameter sweep results.

You can use --dry-run to preview the figures to be plotted.

vllm bench sweep plot_pareto helps pick configurations that balance per-user and per-GPU throughput.

Higher concurrency or batch size can raise GPU efficiency (per-GPU), but can add per user latency; lower concurrency improves per-user rate but underutilizes GPUs; The Pareto frontier shows the best achievable pairs across your runs.

**Examples:**

Example 1 (json):
```json
[
    {
        "max_num_seqs": 32,
        "max_num_batched_tokens": 1024
    },
    {
        "max_num_seqs": 64,
        "max_num_batched_tokens": 1024
    },
    {
        "max_num_seqs": 64,
        "max_num_batched_tokens": 2048
    },
    {
        "max_num_seqs": 128,
        "max_num_batched_tokens": 2048
    },
    {
        "max_num_seqs": 128,
        "max_num_batched_tokens": 4096
    },
    {
        "max_num_seqs": 256,
        "max_num_batched_tokens": 4096
    }
]
```

Example 2 (json):
```json
[
    {
        "max_num_seqs": 32,
        "max_num_batched_tokens": 1024
    },
    {
        "max_num_seqs": 64,
        "max_num_batched_tokens": 1024
    },
    {
        "max_num_seqs": 64,
        "max_num_batched_tokens": 2048
    },
    {
        "max_num_seqs": 128,
        "max_num_batched_tokens": 2048
    },
    {
        "max_num_seqs": 128,
        "max_num_batched_tokens": 4096
    },
    {
        "max_num_seqs": 256,
        "max_num_batched_tokens": 4096
    }
]
```

Example 3 (json):
```json
[
    {
        "random_input_len": 128,
        "random_output_len": 32
    },
    {
        "random_input_len": 256,
        "random_output_len": 64
    },
    {
        "random_input_len": 512,
        "random_output_len": 128
    }
]
```

Example 4 (json):
```json
[
    {
        "random_input_len": 128,
        "random_output_len": 32
    },
    {
        "random_input_len": 256,
        "random_output_len": 64
    },
    {
        "random_input_len": 512,
        "random_output_len": 128
    }
]
```

---

## param_sweep - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/param_sweep/

**Contents:**
- vllm.benchmarks.sweep.param_sweep ¶
- ParameterSweep ¶
  - from_records classmethod ¶
  - read_from_dict classmethod ¶
  - read_json classmethod ¶
- ParameterSweepItem ¶
  - name property ¶
  - __or__ ¶
  - _iter_cmd_key_candidates ¶
  - _iter_param_key_candidates ¶

Bases: list['ParameterSweepItem']

Read parameter sweep from a dict format where keys are names.

{ "experiment1": {"max_tokens": 100, "temperature": 0.7}, "experiment2": {"max_tokens": 200, "temperature": 0.9} }

Bases: dict[str, object]

Get the name for this parameter sweep item.

Returns the '_benchmark_name' field if present, otherwise returns a text representation of all parameters.

Normalize a key-value pair into command-line arguments.

Returns a list containing either: - A single element for boolean flags (e.g., ['--flag'] or ['--flag=true']) - Two elements for key-value pairs (e.g., ['--key', 'value'])

**Examples:**

Example 1 (unknown):
```unknown
8
 9
10
11
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
```

Example 2 (json):
```json
class ParameterSweep(list["ParameterSweepItem"]):
    @classmethod
    def read_json(cls, filepath: os.PathLike):
        with open(filepath, "rb") as f:
            data = json.load(f)

        # Support both list and dict formats
        if isinstance(data, dict):
            return cls.read_from_dict(data)

        return cls.from_records(data)

    @classmethod
    def read_from_dict(cls, data: dict[str, dict[str, object]]):
        """
        Read parameter sweep from a dict format where keys are names.

        Example:
            {
                "experiment1": {"max_tokens": 100, "temperature": 0.7},
                "experiment2": {"max_tokens": 200, "temperature": 0.9}
            }
        """
        records = [{"_benchmark_name": name, **params} for name, params in data.items()]
        return cls.from_records(records)

    @classmethod
    def from_records(cls, records: list[dict[str, object]]):
        if not isinstance(records, list):
            raise TypeError(
                f"The parameter sweep should be a list of dictionaries, "
                f"but found type: {type(records)}"
            )

        # Validate that all _benchmark_name values are unique if provided
        names = [r["_benchmark_name"] for r in records if "_benchmark_name" in r]
        if names and len(names) != len(set(names)):
            duplicates = [name for name in names if names.count(name) > 1]
            raise ValueError(
                f"Duplicate _benchmark_name values found: {set(duplicates)}. "
                f"All _benchmark_name values must be unique."
            )

        return cls(ParameterSweepItem.from_record(record) for record in records)
```

Example 3 (json):
```json
class ParameterSweep(list["ParameterSweepItem"]):
    @classmethod
    def read_json(cls, filepath: os.PathLike):
        with open(filepath, "rb") as f:
            data = json.load(f)

        # Support both list and dict formats
        if isinstance(data, dict):
            return cls.read_from_dict(data)

        return cls.from_records(data)

    @classmethod
    def read_from_dict(cls, data: dict[str, dict[str, object]]):
        """
        Read parameter sweep from a dict format where keys are names.

        Example:
            {
                "experiment1": {"max_tokens": 100, "temperature": 0.7},
                "experiment2": {"max_tokens": 200, "temperature": 0.9}
            }
        """
        records = [{"_benchmark_name": name, **params} for name, params in data.items()]
        return cls.from_records(records)

    @classmethod
    def from_records(cls, records: list[dict[str, object]]):
        if not isinstance(records, list):
            raise TypeError(
                f"The parameter sweep should be a list of dictionaries, "
                f"but found type: {type(records)}"
            )

        # Validate that all _benchmark_name values are unique if provided
        names = [r["_benchmark_name"] for r in records if "_benchmark_name" in r]
        if names and len(names) != len(set(names)):
            duplicates = [name for name in names if names.count(name) > 1]
            raise ValueError(
                f"Duplicate _benchmark_name values found: {set(duplicates)}. "
                f"All _benchmark_name values must be unique."
            )

        return cls(ParameterSweepItem.from_record(record) for record in records)
```

Example 4 (unknown):
```unknown
from_records(records: list[dict[str, object]])
```

---

## Performance Dashboard - vLLM

**URL:** https://docs.vllm.ai/en/latest/benchmarking/dashboard/

**Contents:**
- Performance Dashboard¶
- Manually Trigger the benchmark¶
  - Runtime environment variables¶
  - Visualization¶
    - Performance Results Comparison¶
- Continuous Benchmarking¶
  - How It Works¶
  - Benchmark Configuration¶

The performance dashboard is used to confirm whether new changes improve/degrade performance under various workloads. It is updated by triggering benchmark runs on every commit with both the perf-benchmarks and ready labels, and when a PR is merged into vLLM.

The results are automatically published to the public vLLM Performance Dashboard.

Use vllm-ci-test-repo images with vLLM benchmark suite. For x86 CPU environment, please use the image with "-cpu" postfix. For AArch64 CPU environment, please use the image with "-arm64-cpu" postfix.

Here is an example for docker run command for CPU. For GPUs skip setting the ON_CPU env var.

Then, run below command inside the docker instance.

When run, benchmark script generates results under benchmark/results folder, along with the benchmark_results.md and benchmark_results.json.

The convert-results-json-to-markdown.py helps you put the benchmarking results inside a markdown table with real benchmarking results. You can find the result presented as a table inside the buildkite/performance-benchmark job page. If you do not see the table, please wait till the benchmark finish running. The json version of the table (together with the json version of the benchmark) will be also attached to the markdown file. The raw benchmarking results (in the format of json files) are in the Artifacts tab of the benchmarking.

The compare-json-results.py helps to compare benchmark results JSON files converted using convert-results-json-to-markdown.py. When run, benchmark script generates results under benchmark/results folder, along with the benchmark_results.md and benchmark_results.json. compare-json-results.py compares two benchmark_results.json files and provides performance ratio e.g. for Output Tput, Median TTFT and Median TPOT. If only one benchmark_results.json is passed, compare-json-results.py compares different TP and PP configurations in the benchmark_results.json instead.

Here is an example using the script to compare result_a and result_b with max concurrency and qps for same Model, Dataset name, input/output length. python3 compare-json-results.py -f results_a/benchmark_results.json -f results_b/benchmark_results.json

Output Tput (tok/s) — Model : [ meta-llama/Llama-3.1-8B-Instruct ] , Dataset Name : [ random ] , Input Len : [ 2048.0 ] , Output Len : [ 2048.0 ]

compare-json-results.py – Command-Line Parameters

compare-json-results.py provides configurable parameters to compare one or more benchmark_results.json files and generate summary tables and plots. In most cases, users only need to specify --file to parse the desired benchmark results.

Valid Max Concurrency Summary

Based on the configured TTFT and TPOT SLA thresholds, compare-json-results.py computes the maximum valid concurrency for each benchmark result. The “Max # of max concurrency. (Both)” column represents the highest concurrency level that satisfies both TTFT and TPOT constraints simultaneously. This value is typically used in capacity planning and sizing guides.

More information on the performance benchmarks and their parameters can be found in Benchmark README and performance benchmark description.

The continuous benchmarking provides automated performance monitoring for vLLM across different models and GPU devices. This helps track vLLM's performance characteristics over time and identify any performance regressions or improvements.

The continuous benchmarking is triggered via a GitHub workflow CI in the PyTorch infrastructure repository, which runs automatically every 4 hours. The workflow executes three types of performance tests:

The benchmarking currently runs on a predefined set of models configured in the vllm-benchmarks directory. To add new models for benchmarking:

**Examples:**

Example 1 (jsx):
```jsx
export VLLM_COMMIT=1da94e673c257373280026f75ceb4effac80e892 # use full commit hash from the main branch
export HF_TOKEN=<valid Hugging Face token>
if [[ "$(uname -m)" == aarch64 || "$(uname -m)" == arm64 ]]; then
  IMG_SUFFIX="arm64-cpu"
else
  IMG_SUFFIX="cpu"
fi
docker run -it --entrypoint /bin/bash -v /data/huggingface:/root/.cache/huggingface -e HF_TOKEN=$HF_TOKEN -e ON_ARM64_CPU=1 --shm-size=16g --name vllm-cpu-ci public.ecr.aws/q9t5s3a7/vllm-ci-test-repo:${VLLM_COMMIT}-${IMG_SUFFIX}
```

Example 2 (jsx):
```jsx
export VLLM_COMMIT=1da94e673c257373280026f75ceb4effac80e892 # use full commit hash from the main branch
export HF_TOKEN=<valid Hugging Face token>
if [[ "$(uname -m)" == aarch64 || "$(uname -m)" == arm64 ]]; then
  IMG_SUFFIX="arm64-cpu"
else
  IMG_SUFFIX="cpu"
fi
docker run -it --entrypoint /bin/bash -v /data/huggingface:/root/.cache/huggingface -e HF_TOKEN=$HF_TOKEN -e ON_ARM64_CPU=1 --shm-size=16g --name vllm-cpu-ci public.ecr.aws/q9t5s3a7/vllm-ci-test-repo:${VLLM_COMMIT}-${IMG_SUFFIX}
```

Example 3 (unknown):
```unknown
bash .buildkite/performance-benchmarks/scripts/run-performance-benchmarks.sh
```

Example 4 (unknown):
```unknown
bash .buildkite/performance-benchmarks/scripts/run-performance-benchmarks.sh
```

---

## plot_pareto - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/plot_pareto/

**Contents:**
- vllm.benchmarks.sweep.plot_pareto ¶
- parser module-attribute ¶
- SweepPlotParetoArgs dataclass ¶
  - dry_run instance-attribute ¶
  - gpu_count_var instance-attribute ¶
  - label_by instance-attribute ¶
  - output_dir instance-attribute ¶
  - parser_help class-attribute ¶
  - parser_name class-attribute ¶
  - user_count_var instance-attribute ¶

**Examples:**

Example 1 (unknown):
```unknown
parser = ArgumentParser(description=parser_help)
```

Example 2 (unknown):
```unknown
parser = ArgumentParser(description=parser_help)
```

Example 3 (unknown):
```unknown
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
```

Example 4 (python):
```python
@dataclass
class SweepPlotParetoArgs:
    output_dir: Path
    user_count_var: str | None
    gpu_count_var: str | None
    label_by: list[str]
    dry_run: bool

    parser_name: ClassVar[str] = "plot_pareto"
    parser_help: ClassVar[str] = (
        "Plot Pareto frontier between tokens/s/user and tokens/s/GPU "
        "from parameter sweep results."
    )

    @classmethod
    def from_cli_args(cls, args: argparse.Namespace):
        output_dir = Path(args.OUTPUT_DIR)
        if not output_dir.exists():
            raise ValueError(f"No parameter sweep results under {output_dir}")

        label_by = [] if not args.label_by else args.label_by.split(",")

        return cls(
            output_dir=output_dir,
            user_count_var=args.user_count_var,
            gpu_count_var=args.gpu_count_var,
            label_by=label_by,
            dry_run=args.dry_run,
        )

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser):
        parser.add_argument(
            "OUTPUT_DIR",
            type=str,
            default="results",
            help="The directory containing the sweep results to plot.",
        )
        parser.add_argument(
            "--user-count-var",
            type=str,
            default="max_concurrency",
            help="Result key that stores concurrent user count. "
            "Falls back to max_concurrent_requests if missing.",
        )
        parser.add_argument(
            "--gpu-count-var",
            type=str,
            default=None,
            help="Result key that stores GPU count. "
            "If not provided, falls back to num_gpus/gpu_count "
            "or tensor_parallel_size * pipeline_parallel_size.",
        )
        parser.add_argument(
            "--label-by",
            type=str,
            default="max_concurrency,gpu_count",
            help="Comma-separated list of fields to annotate on Pareto frontier "
            "points.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="If set, prints the figures to plot without drawing them.",
        )

        return parser
```

---

## plot - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/plot/

**Contents:**
- vllm.benchmarks.sweep.plot ¶
- PLOT_BINNERS module-attribute ¶
- PLOT_FILTERS module-attribute ¶
- parser module-attribute ¶
- seaborn module-attribute ¶
- DummyExecutor ¶
  - map class-attribute instance-attribute ¶
  - __enter__ ¶
  - __exit__ ¶
- PlotBinner dataclass ¶

Applies this binner to a DataFrame.

Bases: list[PlotBinner]

Bases: PlotFilterBase

Applies this filter to a DataFrame.

Bases: list[PlotFilterBase]

Bases: PlotFilterBase

Bases: PlotFilterBase

Bases: PlotFilterBase

Bases: PlotFilterBase

Bases: PlotFilterBase

Convert string values "inf", "-inf", and "nan" to their float equivalents.

This handles the case where JSON serialization represents inf/nan as strings.

**Examples:**

Example 1 (yaml):
```yaml
PLOT_BINNERS: dict[str, type[PlotBinner]] = {
    "%": PlotBinner
}
```

Example 2 (yaml):
```yaml
PLOT_BINNERS: dict[str, type[PlotBinner]] = {
    "%": PlotBinner
}
```

Example 3 (yaml):
```yaml
PLOT_FILTERS: dict[str, type[PlotFilterBase]] = {
    "==": PlotEqualTo,
    "!=": PlotNotEqualTo,
    "<=": PlotLessThanOrEqualTo,
    ">=": PlotGreaterThanOrEqualTo,
    "<": PlotLessThan,
    ">": PlotGreaterThan,
}
```

Example 4 (yaml):
```yaml
PLOT_FILTERS: dict[str, type[PlotFilterBase]] = {
    "==": PlotEqualTo,
    "!=": PlotNotEqualTo,
    "<=": PlotLessThanOrEqualTo,
    ">=": PlotGreaterThanOrEqualTo,
    "<": PlotLessThan,
    ">": PlotGreaterThan,
}
```

---

## Profiling vLLM - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/profiling/

**Contents:**
- Profiling vLLM¶
- Profile with PyTorch Profiler¶
  - Example commands and usage¶
    - Offline Inference¶
    - OpenAI Server¶
- Profile with NVIDIA Nsight Systems¶
  - Example commands and usage¶
    - Offline Inference¶
    - OpenAI Server¶
    - Analysis¶

Profiling is only intended for vLLM developers and maintainers to understand the proportion of time spent in different parts of the codebase. vLLM end-users should never turn on profiling as it will significantly slow down the inference.

We support tracing vLLM workers using the torch.profiler module. You can enable the torch profiler by setting --profiler-config when launching the server, and setting the entries profiler to 'torch' and torch_profiler_dir to the directory where you want to save the traces. Additionally, you can control the profiling content by specifying the following additional arguments in the config:

When using vllm bench serve, you can enable profiling by passing the --profile flag.

Traces can be visualized using https://ui.perfetto.dev/.

You can directly call bench module without installing vLLM using python -m vllm.entrypoints.cli.main bench.

Only send a few requests through vLLM when profiling, as the traces can get quite large. Also, no need to untar the traces, they can be viewed directly.

To stop the profiler - it flushes out all the profile trace files to the directory. This takes time, for example for about 100 requests worth of data for a llama 70b, it takes about 10 minutes to flush out on a H100. Set the env variable VLLM_RPC_TIMEOUT to a big number before you start the server. Say something like 30 minutes. export VLLM_RPC_TIMEOUT=1800000

Refer to examples/offline_inference/simple_profiling.py for an example.

Nsight systems is an advanced tool that exposes more profiling details, such as register and shared memory usage, annotated code regions and low-level CUDA APIs and events.

Install nsight-systems using your package manager. The following block is an example for Ubuntu.

When profiling with nsys, it is advisable to set the environment variable VLLM_WORKER_MULTIPROC_METHOD=spawn. The default is to use the fork method instead of spawn. More information on the topic can be found in the Nsight Systems release notes.

The Nsight Systems profiler can be launched with nsys profile ..., with a few recommended flags for vLLM: --trace-fork-before-exec=true --cuda-graph-trace=node.

For basic usage, you can just append the profiling command before any existing script you would run for offline inference.

The following is an example using the vllm bench latency script:

To profile the server, you will want to prepend your vllm serve command with nsys profile just like for offline inference, but you will need to specify a few other arguments to enable dynamic capture similarly to the Torch Profiler:

With --profile, vLLM will capture a profile for each run of vllm bench serve. Once the server is killed, the profiles will all be saved.

You can view these profiles either as summaries in the CLI, using nsys stats [profile-file], or in the GUI by installing Nsight locally following the directions here.

There is a GitHub CI workflow in the PyTorch infrastructure repository that provides continuous profiling for different models on vLLM. This automated profiling helps track performance characteristics over time and across different model configurations.

The workflow currently runs weekly profiling sessions for selected models, generating detailed performance traces that can be analyzed using different tools to identify performance regressions or optimization opportunities. But, it can be triggered manually as well, using the Github Action tool.

To extend the continuous profiling to additional models, you can modify the profiling-tests.json configuration file in the PyTorch integration testing repository. Simply add your model specifications to this file to include them in the automated profiling runs.

The profiling traces generated by the continuous profiling workflow are publicly available on the vLLM Performance Dashboard. Look for the Profiling traces table to access and download the traces for different models and runs.

The Python standard library includes cProfile for profiling Python code. vLLM includes a couple of helpers that make it easy to apply it to a section of vLLM. Both the vllm.utils.profiling.cprofile and vllm.utils.profiling.cprofile_context functions can be used to profile a section of code.

The legacy import paths vllm.utils.cprofile and vllm.utils.cprofile_context are deprecated. Please use vllm.utils.profiling.cprofile and vllm.utils.profiling.cprofile_context instead.

The first helper is a Python decorator that can be used to profile a function. If a filename is specified, the profile will be saved to that file. If no filename is specified, profile data will be printed to stdout.

The second helper is a context manager that can be used to profile a block of code. Similar to the decorator, the filename is optional.

There are multiple tools available that can help analyze the profile results. One example is snakeviz.

Leverage VLLM_GC_DEBUG environment variable to debug GC costs.

**Examples:**

Example 1 (json):
```json
vllm serve meta-llama/Llama-3.1-8B-Instruct --profiler-config '{"profiler": "torch", "torch_profiler_dir": "./vllm_profile"}'
```

Example 2 (json):
```json
vllm serve meta-llama/Llama-3.1-8B-Instruct --profiler-config '{"profiler": "torch", "torch_profiler_dir": "./vllm_profile"}'
```

Example 3 (powershell):
```powershell
vllm bench serve \
    --backend vllm \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --dataset-name sharegpt \
    --dataset-path sharegpt.json \
    --profile \
    --num-prompts 2
```

Example 4 (powershell):
```powershell
vllm bench serve \
    --backend vllm \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --dataset-name sharegpt \
    --dataset-path sharegpt.json \
    --profile \
    --num-prompts 2
```

---

## ready_checker - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/lib/ready_checker/

**Contents:**
- vllm.benchmarks.lib.ready_checker ¶
- wait_for_endpoint async ¶

Utilities for checking endpoint readiness.

Wait for an endpoint to become available before starting benchmarks.

The async request function to call

The RequestFuncInput to test with

Maximum time to wait in seconds (default: 10 minutes)

Time between retries in seconds (default: 5 seconds)

The successful response

If the endpoint doesn't become available within the timeout

**Examples:**

Example 1 (typescript):
```typescript
wait_for_endpoint(
    request_func: RequestFunc,
    test_input: RequestFuncInput,
    session: ClientSession,
    timeout_seconds: int = 600,
    retry_interval: int = 5,
) -> RequestFuncOutput
```

Example 2 (typescript):
```typescript
wait_for_endpoint(
    request_func: RequestFunc,
    test_input: RequestFuncInput,
    session: ClientSession,
    timeout_seconds: int = 600,
    retry_interval: int = 5,
) -> RequestFuncOutput
```

Example 3 (unknown):
```unknown
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
```

Example 4 (python):
```python
async def wait_for_endpoint(
    request_func: RequestFunc,
    test_input: RequestFuncInput,
    session: aiohttp.ClientSession,
    timeout_seconds: int = 600,
    retry_interval: int = 5,
) -> RequestFuncOutput:
    """
    Wait for an endpoint to become available before starting benchmarks.

    Args:
        request_func: The async request function to call
        test_input: The RequestFuncInput to test with
        timeout_seconds: Maximum time to wait in seconds (default: 10 minutes)
        retry_interval: Time between retries in seconds (default: 5 seconds)

    Returns:
        RequestFuncOutput: The successful response

    Raises:
        ValueError: If the endpoint doesn't become available within the timeout
    """
    deadline = time.perf_counter() + timeout_seconds
    output = RequestFuncOutput(success=False)
    print(f"Waiting for endpoint to become up in {timeout_seconds} seconds")

    with tqdm(
        total=timeout_seconds,
        bar_format="{desc} |{bar}| {elapsed} elapsed, {remaining} remaining",
        unit="s",
    ) as pbar:
        while True:
            # update progress bar
            remaining = deadline - time.perf_counter()
            elapsed = timeout_seconds - remaining
            update_amount = min(elapsed - pbar.n, timeout_seconds - pbar.n)
            pbar.update(update_amount)
            pbar.refresh()
            if remaining <= 0:
                pbar.close()
                break

            # ping the endpoint using request_func
            try:
                output = await request_func(
                    request_func_input=test_input, session=session
                )
                if output.success:
                    pbar.close()
                    return output
            except aiohttp.ClientConnectorError:
                pass

            # retry after a delay
            sleep_duration = min(retry_interval, remaining)
            if sleep_duration > 0:
                await asyncio.sleep(sleep_duration)

    return output
```

---

## server - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/server/

**Contents:**
- vllm.benchmarks.sweep.server ¶
- ServerProcess ¶
  - after_bench_cmd instance-attribute ¶
  - server_cmd instance-attribute ¶
  - show_stdout instance-attribute ¶
  - __enter__ ¶
  - __exit__ ¶
  - __init__ ¶
  - _get_vllm_server_address ¶
  - after_bench ¶

**Examples:**

Example 1 (unknown):
```unknown
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
```

Example 2 (python):
```python
class ServerProcess:
    def __init__(
        self,
        server_cmd: list[str],
        after_bench_cmd: list[str],
        *,
        show_stdout: bool,
    ) -> None:
        super().__init__()

        self.server_cmd = server_cmd
        self.after_bench_cmd = after_bench_cmd
        self.show_stdout = show_stdout

    def __enter__(self) -> Self:
        self.start()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        exc_traceback: TracebackType | None,
    ) -> None:
        self.stop()

    def start(self):
        # Create new process for clean termination
        self._server_process = subprocess.Popen(
            self.server_cmd,
            start_new_session=True,
            stdout=None if self.show_stdout else subprocess.DEVNULL,
            # Need `VLLM_SERVER_DEV_MODE=1` for `_reset_caches`
            env=os.environ | {"VLLM_SERVER_DEV_MODE": "1"},
        )

    def stop(self):
        server_process = self._server_process

        if server_process.poll() is None:
            # In case only some processes have been terminated
            with contextlib.suppress(ProcessLookupError):
                # We need to kill both API Server and Engine processes
                os.killpg(os.getpgid(server_process.pid), signal.SIGKILL)

    def run_subcommand(self, cmd: list[str]):
        return subprocess.run(
            cmd,
            stdout=None if self.show_stdout else subprocess.DEVNULL,
            check=True,
        )

    def after_bench(self) -> None:
        if not self.after_bench_cmd:
            self.reset_caches()
            return

        self.run_subcommand(self.after_bench_cmd)

    def _get_vllm_server_address(self) -> str:
        server_cmd = self.server_cmd

        for host_key in ("--host",):
            if host_key in server_cmd:
                host = server_cmd[server_cmd.index(host_key) + 1]
                break
        else:
            host = "localhost"

        for port_key in ("-p", "--port"):
            if port_key in server_cmd:
                port = int(server_cmd[server_cmd.index(port_key) + 1])
                break
        else:
            port = 8000  # The default value in vllm serve

        return f"http://{host}:{port}"

    def reset_caches(self) -> None:
        server_cmd = self.server_cmd

        # Use `.endswith()` to match `/bin/...`
        if server_cmd[0].endswith("vllm"):
            server_address = self._get_vllm_server_address()
            print(f"Resetting caches at {server_address}")

            res = requests.post(f"{server_address}/reset_prefix_cache")
            res.raise_for_status()

            res = requests.post(f"{server_address}/reset_mm_cache")
            res.raise_for_status()
        elif server_cmd[0].endswith("infinity_emb"):
            if "--vector-disk-cache" in server_cmd:
                raise NotImplementedError(
                    "Infinity server uses caching but does not expose a method "
                    "to reset the cache"
                )
        else:
            raise NotImplementedError(
                f"No implementation of `reset_caches` for `{server_cmd[0]}` server. "
                "Please specify a custom command via `--after-bench-cmd`."
            )
```

Example 3 (python):
```python
class ServerProcess:
    def __init__(
        self,
        server_cmd: list[str],
        after_bench_cmd: list[str],
        *,
        show_stdout: bool,
    ) -> None:
        super().__init__()

        self.server_cmd = server_cmd
        self.after_bench_cmd = after_bench_cmd
        self.show_stdout = show_stdout

    def __enter__(self) -> Self:
        self.start()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        exc_traceback: TracebackType | None,
    ) -> None:
        self.stop()

    def start(self):
        # Create new process for clean termination
        self._server_process = subprocess.Popen(
            self.server_cmd,
            start_new_session=True,
            stdout=None if self.show_stdout else subprocess.DEVNULL,
            # Need `VLLM_SERVER_DEV_MODE=1` for `_reset_caches`
            env=os.environ | {"VLLM_SERVER_DEV_MODE": "1"},
        )

    def stop(self):
        server_process = self._server_process

        if server_process.poll() is None:
            # In case only some processes have been terminated
            with contextlib.suppress(ProcessLookupError):
                # We need to kill both API Server and Engine processes
                os.killpg(os.getpgid(server_process.pid), signal.SIGKILL)

    def run_subcommand(self, cmd: list[str]):
        return subprocess.run(
            cmd,
            stdout=None if self.show_stdout else subprocess.DEVNULL,
            check=True,
        )

    def after_bench(self) -> None:
        if not self.after_bench_cmd:
            self.reset_caches()
            return

        self.run_subcommand(self.after_bench_cmd)

    def _get_vllm_server_address(self) -> str:
        server_cmd = self.server_cmd

        for host_key in ("--host",):
            if host_key in server_cmd:
                host = server_cmd[server_cmd.index(host_key) + 1]
                break
        else:
            host = "localhost"

        for port_key in ("-p", "--port"):
            if port_key in server_cmd:
                port = int(server_cmd[server_cmd.index(port_key) + 1])
                break
        else:
            port = 8000  # The default value in vllm serve

        return f"http://{host}:{port}"

    def reset_caches(self) -> None:
        server_cmd = self.server_cmd

        # Use `.endswith()` to match `/bin/...`
        if server_cmd[0].endswith("vllm"):
            server_address = self._get_vllm_server_address()
            print(f"Resetting caches at {server_address}")

            res = requests.post(f"{server_address}/reset_prefix_cache")
            res.raise_for_status()

            res = requests.post(f"{server_address}/reset_mm_cache")
            res.raise_for_status()
        elif server_cmd[0].endswith("infinity_emb"):
            if "--vector-disk-cache" in server_cmd:
                raise NotImplementedError(
                    "Infinity server uses caching but does not expose a method "
                    "to reset the cache"
                )
        else:
            raise NotImplementedError(
                f"No implementation of `reset_caches` for `{server_cmd[0]}` server. "
                "Please specify a custom command via `--after-bench-cmd`."
            )
```

Example 4 (unknown):
```unknown
after_bench_cmd = after_bench_cmd
```

---

## serve_sla - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/serve_sla/

**Contents:**
- vllm.benchmarks.sweep.serve_sla ¶
- SLAVariable module-attribute ¶
- parser module-attribute ¶
- SweepServeSLAArgs dataclass ¶
  - parser_help class-attribute ¶
  - parser_name class-attribute ¶
  - sla_params instance-attribute ¶
  - sla_variable instance-attribute ¶
  - __init__ ¶
  - add_cli_args classmethod ¶

Bases: SweepServeArgs

**Examples:**

Example 1 (unknown):
```unknown
SLAVariable = Literal['request_rate', 'max_concurrency']
```

Example 2 (unknown):
```unknown
SLAVariable = Literal['request_rate', 'max_concurrency']
```

Example 3 (unknown):
```unknown
parser = ArgumentParser(description=parser_help)
```

Example 4 (unknown):
```unknown
parser = ArgumentParser(description=parser_help)
```

---

## serve - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/serve/

**Contents:**
- vllm.benchmarks.sweep.serve ¶
- parser module-attribute ¶
- SweepServeArgs dataclass ¶
  - after_bench_cmd instance-attribute ¶
  - bench_cmd instance-attribute ¶
  - bench_params instance-attribute ¶
  - dry_run instance-attribute ¶
  - link_vars instance-attribute ¶
  - num_runs instance-attribute ¶
  - output_dir instance-attribute ¶

**Examples:**

Example 1 (unknown):
```unknown
parser = ArgumentParser(description=parser_help)
```

Example 2 (unknown):
```unknown
parser = ArgumentParser(description=parser_help)
```

Example 3 (unknown):
```unknown
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
373
374
375
376
377
378
379
380
381
382
383
384
385
386
387
388
389
390
391
392
393
394
395
396
397
398
399
400
401
402
403
404
405
406
407
408
409
410
411
412
```

Example 4 (python):
```python
@dataclass
class SweepServeArgs:
    serve_cmd: list[str]
    bench_cmd: list[str]
    after_bench_cmd: list[str]
    show_stdout: bool
    serve_params: ParameterSweep
    bench_params: ParameterSweep
    output_dir: Path
    num_runs: int
    dry_run: bool
    resume: str | None
    link_vars: list[tuple[str, str]] | None

    parser_name: ClassVar[str] = "serve"
    parser_help: ClassVar[str] = "Run vLLM server benchmark under multiple settings."

    @classmethod
    def from_cli_args(cls, args: argparse.Namespace):
        serve_cmd = shlex.split(args.serve_cmd)
        bench_cmd = shlex.split(args.bench_cmd)
        after_bench_cmd = (
            [] if args.after_bench_cmd is None else shlex.split(args.after_bench_cmd)
        )

        if args.serve_params:
            serve_params = ParameterSweep.read_json(args.serve_params)
        else:
            # i.e.: run serve_cmd without any modification
            serve_params = ParameterSweep.from_records([{}])

        if args.bench_params:
            bench_params = ParameterSweep.read_json(args.bench_params)
        else:
            # i.e.: run bench_cmd without any modification
            bench_params = ParameterSweep.from_records([{}])
        link_vars = cls.parse_link_vars(args.link_vars)
        num_runs = args.num_runs
        if num_runs < 1:
            raise ValueError("`num_runs` should be at least 1.")

        return cls(
            serve_cmd=serve_cmd,
            bench_cmd=bench_cmd,
            after_bench_cmd=after_bench_cmd,
            show_stdout=args.show_stdout,
            serve_params=serve_params,
            bench_params=bench_params,
            output_dir=Path(args.output_dir),
            num_runs=num_runs,
            dry_run=args.dry_run,
            resume=args.resume,
            link_vars=link_vars,
        )

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> argparse.ArgumentParser:
        parser.add_argument(
            "--serve-cmd",
            type=str,
            required=True,
            help="The command used to run the server: `vllm serve ...`",
        )
        parser.add_argument(
            "--bench-cmd",
            type=str,
            required=True,
            help="The command used to run the benchmark: `vllm bench serve ...`",
        )
        parser.add_argument(
            "--after-bench-cmd",
            type=str,
            default=None,
            help="After a benchmark run is complete, invoke this command instead of "
            "the default `ServerWrapper.clear_cache()`.",
        )
        parser.add_argument(
            "--show-stdout",
            action="store_true",
            help="If set, logs the standard output of subcommands. "
            "Useful for debugging but can be quite spammy.",
        )
        parser.add_argument(
            "--serve-params",
            type=str,
            default=None,
            help="Path to JSON file containing parameter combinations "
            "for the `vllm serve` command. Can be either a list of dicts or a dict "
            "where keys are benchmark names. "
            "If both `serve_params` and `bench_params` are given, "
            "this script will iterate over their Cartesian product.",
        )
        parser.add_argument(
            "--bench-params",
            type=str,
            default=None,
            help="Path to JSON file containing parameter combinations "
            "for the `vllm bench serve` command. Can be either a list of dicts or "
            "a dict where keys are benchmark names. "
            "If both `serve_params` and `bench_params` are given, "
            "this script will iterate over their Cartesian product.",
        )
        parser.add_argument(
            "-o",
            "--output-dir",
            type=str,
            default="results",
            help="The directory to which results are written.",
        )
        parser.add_argument(
            "--num-runs",
            type=int,
            default=3,
            help="Number of runs per parameter combination.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="If set, prints the commands to run, "
            "then exits without executing them.",
        )
        parser.add_argument(
            "--resume",
            type=str,
            default=None,
            help="Set this to the name of a directory under `output_dir` (which is a "
            "timestamp) to resume a previous execution of this script, i.e., only run "
            "parameter combinations for which there are still no output files.",
        )

        parser.add_argument(
            "--link-vars",
            type=str,
            default="",
            help=(
                "Comma-separated list of linked variables between serve and bench, "
                "e.g. max_num_seqs=max_concurrency,max_model_len=random_input_len"
            ),
        )

        return parser

    @staticmethod
    def parse_link_vars(s: str) -> list[tuple[str, str]]:
        if not s:
            return []
        pairs = []
        for item in s.split(","):
            a, b = item.split("=")
            pairs.append((a.strip(), b.strip()))
        return pairs
```

---

## serve - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/serve/

**Contents:**
- vllm.benchmarks.serve ¶
- MILLISECONDS_TO_SECONDS_CONVERSION module-attribute ¶
- TERM_PLOTLIB_AVAILABLE module-attribute ¶
- BenchmarkMetrics dataclass ¶
  - completed instance-attribute ¶
  - failed instance-attribute ¶
  - max_concurrent_requests instance-attribute ¶
  - max_output_tokens_per_s instance-attribute ¶
  - mean_e2el_ms instance-attribute ¶
  - mean_itl_ms instance-attribute ¶

Benchmark online serving throughput.

On the server side, run one of the following commands to launch the vLLM OpenAI API server: vllm serve

On the client side, run: vllm bench serve \ --backend \ --label \ --model \ --dataset-name \ --input-len \ --output-len \ --request-rate \ --num-prompts

Calculate the metrics for the benchmark.

The outputs of the requests.

The duration of the benchmark.

The tokenizer to use.

The percentiles to select.

The goodput configuration.

A tuple of the benchmark metrics and the actual output lengths.

Calculate the metrics for the embedding requests.

The outputs of the requests.

The duration of the benchmark.

The percentiles to select.

The calculated benchmark metrics.

Fetch the first model from the server's /v1/models endpoint.

Asynchronously generates requests at a specified rate with OPTIONAL burstiness and OPTIONAL ramp-up strategy.

A list of input requests, each represented as a SampleRequest.

The rate at which requests are generated (requests/s).

The burstiness factor of the request generation. Only takes effect when request_rate is not inf. Default value is 1, which follows a Poisson process. Otherwise, the request intervals follow a gamma distribution. A lower burstiness value (0 < burstiness < 1) results in more bursty requests, while a higher burstiness value (burstiness > 1) results in a more uniform arrival of requests.

The ramp-up strategy. Can be "linear" or "exponential". If None, uses constant request rate (specified by request_rate).

The starting request rate for ramp-up.

The ending request rate for ramp-up.

**Examples:**

Example 1 (unknown):
```unknown
MILLISECONDS_TO_SECONDS_CONVERSION = 1000
```

Example 2 (unknown):
```unknown
MILLISECONDS_TO_SECONDS_CONVERSION = 1000
```

Example 3 (rust):
```rust
TERM_PLOTLIB_AVAILABLE = (
    find_spec("termplotlib") is not None
    and which("gnuplot") is not None
)
```

Example 4 (rust):
```rust
TERM_PLOTLIB_AVAILABLE = (
    find_spec("termplotlib") is not None
    and which("gnuplot") is not None
)
```

---

## serve - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/serve/

**Contents:**
- vllm.entrypoints.cli.benchmark.serve ¶
- BenchmarkServingSubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶

Bases: BenchmarkSubcommandBase

The serve subcommand for vllm bench.

**Examples:**

Example 1 (unknown):
```unknown
9
10
11
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
```

Example 2 (python):
```python
class BenchmarkServingSubcommand(BenchmarkSubcommandBase):
    """The `serve` subcommand for `vllm bench`."""

    name = "serve"
    help = "Benchmark the online serving throughput."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 3 (python):
```python
class BenchmarkServingSubcommand(BenchmarkSubcommandBase):
    """The `serve` subcommand for `vllm bench`."""

    name = "serve"
    help = "Benchmark the online serving throughput."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 4 (unknown):
```unknown
help = 'Benchmark the online serving throughput.'
```

---

## Simple Profiling - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/offline_inference/simple_profiling/

**Contents:**
- Simple Profiling¶

Source https://github.com/vllm-project/vllm/blob/main/examples/offline_inference/simple_profiling.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import time

from vllm import LLM, SamplingParams

# Sample prompts.
prompts = [
    "Hello, my name is",
    "The president of the United States is",
    "The capital of France is",
    "The future of AI is",
]
# Create a sampling params object.
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)


def main():
    # Create an LLM.
    llm = LLM(
        model="facebook/opt-125m",
        tensor_parallel_size=1,
        profiler_config={
            "profiler": "torch",
            "torch_profiler_dir": "./vllm_profile",
        },
    )

    llm.start_profile()

    # Generate texts from the prompts. The output is a list of RequestOutput
    # objects that contain the prompt, generated text, and other information.
    outputs = llm.generate(prompts, sampling_params)

    llm.stop_profile()

    # Print the outputs.
    print("-" * 50)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt: {prompt!r}\nGenerated text: {generated_text!r}")
        print("-" * 50)

    # Add a buffer to wait for profiler in the background process
    # (in case MP is on) to finish writing profiling output.
    time.sleep(10)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import time

from vllm import LLM, SamplingParams

# Sample prompts.
prompts = [
    "Hello, my name is",
    "The president of the United States is",
    "The capital of France is",
    "The future of AI is",
]
# Create a sampling params object.
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)


def main():
    # Create an LLM.
    llm = LLM(
        model="facebook/opt-125m",
        tensor_parallel_size=1,
        profiler_config={
            "profiler": "torch",
            "torch_profiler_dir": "./vllm_profile",
        },
    )

    llm.start_profile()

    # Generate texts from the prompts. The output is a list of RequestOutput
    # objects that contain the prompt, generated text, and other information.
    outputs = llm.generate(prompts, sampling_params)

    llm.stop_profile()

    # Print the outputs.
    print("-" * 50)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt: {prompt!r}\nGenerated text: {generated_text!r}")
        print("-" * 50)

    # Add a buffer to wait for profiler in the background process
    # (in case MP is on) to finish writing profiling output.
    time.sleep(10)


if __name__ == "__main__":
    main()
```

---

## sla_sweep - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/sla_sweep/

**Contents:**
- vllm.benchmarks.sweep.sla_sweep ¶
- SLA_CRITERIA module-attribute ¶
- SLACriterionBase dataclass ¶
  - target instance-attribute ¶
  - __init__ ¶
  - format_cond abstractmethod ¶
  - print_and_validate ¶
  - validate abstractmethod ¶
- SLAGreaterThan dataclass ¶
  - __init__ ¶

Return True if this criterion is met; otherwise False.

Bases: SLACriterionBase

Bases: SLACriterionBase

Bases: SLACriterionBase

Bases: SLACriterionBase

Bases: list['SLASweepItem']

Bases: dict[str, SLACriterionBase]

**Examples:**

Example 1 (yaml):
```yaml
SLA_CRITERIA: dict[str, type[SLACriterionBase]] = {
    "<=": SLALessThanOrEqualTo,
    ">=": SLAGreaterThanOrEqualTo,
    "<": SLALessThan,
    ">": SLAGreaterThan,
}
```

Example 2 (yaml):
```yaml
SLA_CRITERIA: dict[str, type[SLACriterionBase]] = {
    "<=": SLALessThanOrEqualTo,
    ">=": SLAGreaterThanOrEqualTo,
    "<": SLALessThan,
    ">": SLAGreaterThan,
}
```

Example 3 (unknown):
```unknown
11
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
29
30
31
32
33
34
35
```

Example 4 (python):
```python
@dataclass
class SLACriterionBase(ABC):
    target: float

    @abstractmethod
    def validate(self, actual: float) -> bool:
        """Return `True` if this criterion is met; otherwise `False`."""
        raise NotImplementedError

    @abstractmethod
    def format_cond(self, lhs: str) -> str:
        raise NotImplementedError

    def print_and_validate(
        self,
        metrics: dict[str, float],
        metrics_key: str,
    ) -> bool:
        metric = metrics[metrics_key]
        result = self.validate(metric)

        cond = self.format_cond(f"{metrics_key} = {metric:.2f}")
        print(f"Validating SLA: {cond} | " + ("PASSED" if result else "FAILED"))

        return result
```

---

## startup - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/startup/

**Contents:**
- vllm.benchmarks.startup ¶
- add_cli_args ¶
- cold_startup ¶
- main ¶
- run_startup_in_subprocess ¶
- save_to_pytorch_benchmark_format ¶

Benchmark the cold and warm startup time of vLLM models.

This script measures total startup time (including model loading, compilation, and cache operations) for both cold and warm scenarios: - Cold startup: Fresh start with no caches (temporary cache directories) - Warm startup: Using cached compilation and model info

Context manager to measure cold startup time: 1. Uses a temporary directory for vLLM cache to avoid any pollution between cold startup iterations. 2. Uses inductor's fresh_cache to clear torch.compile caches.

Run LLM startup in a subprocess and return timing metrics via a queue. This ensures complete isolation between iterations.

**Examples:**

Example 1 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 2 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 3 (unknown):
```unknown
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
```

Example 4 (python):
```python
def add_cli_args(parser: argparse.ArgumentParser):
    parser.add_argument(
        "--num-iters-cold",
        type=int,
        default=5,
        help="Number of cold startup iterations.",
    )
    parser.add_argument(
        "--num-iters-warmup",
        type=int,
        default=3,
        help="Number of warmup iterations before benchmarking warm startups.",
    )
    parser.add_argument(
        "--num-iters-warm",
        type=int,
        default=5,
        help="Number of warm startup iterations.",
    )
    parser.add_argument(
        "--output-json",
        type=str,
        default=None,
        help="Path to save the startup time results in JSON format.",
    )

    parser = EngineArgs.add_cli_args(parser)
    return parser
```

---

## startup - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/startup/

**Contents:**
- vllm.entrypoints.cli.benchmark.startup ¶
- BenchmarkStartupSubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶

Bases: BenchmarkSubcommandBase

The startup subcommand for vllm bench.

**Examples:**

Example 1 (unknown):
```unknown
9
10
11
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
```

Example 2 (python):
```python
class BenchmarkStartupSubcommand(BenchmarkSubcommandBase):
    """The `startup` subcommand for `vllm bench`."""

    name = "startup"
    help = "Benchmark the startup time of vLLM models."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 3 (python):
```python
class BenchmarkStartupSubcommand(BenchmarkSubcommandBase):
    """The `startup` subcommand for `vllm bench`."""

    name = "startup"
    help = "Benchmark the startup time of vLLM models."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 4 (unknown):
```unknown
help = 'Benchmark the startup time of vLLM models.'
```

---

## sweep - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/sweep/

**Contents:**
- vllm.entrypoints.cli.benchmark.sweep ¶
- BenchmarkSweepSubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶

Bases: BenchmarkSubcommandBase

The sweep subcommand for vllm bench.

**Examples:**

Example 1 (unknown):
```unknown
9
10
11
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
```

Example 2 (python):
```python
class BenchmarkSweepSubcommand(BenchmarkSubcommandBase):
    """The `sweep` subcommand for `vllm bench`."""

    name = "sweep"
    help = "Benchmark for a parameter sweep."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 3 (python):
```python
class BenchmarkSweepSubcommand(BenchmarkSubcommandBase):
    """The `sweep` subcommand for `vllm bench`."""

    name = "sweep"
    help = "Benchmark for a parameter sweep."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 4 (unknown):
```unknown
help = 'Benchmark for a parameter sweep.'
```

---

## sweep - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/

**Contents:**
- vllm.benchmarks.sweep ¶

---

## throughput - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/throughput/

**Contents:**
- vllm.benchmarks.throughput ¶
- add_cli_args ¶
- filter_requests_for_dp ¶
- get_requests ¶
- main ¶
- run_hf ¶
- run_vllm ¶
- run_vllm_async async ¶
- run_vllm_chat ¶
- save_to_pytorch_benchmark_format ¶

Benchmark offline inference throughput.

Run vLLM chat benchmark. This function is recommended ONLY for benchmarking multimodal models as it properly handles multimodal inputs and chat formatting. For non-multimodal models, use run_vllm() instead.

Validate command-line arguments.

**Examples:**

Example 1 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 2 (unknown):
```unknown
add_cli_args(parser: ArgumentParser)
```

Example 3 (unknown):
```unknown
547
548
549
550
551
552
553
554
555
556
557
558
559
560
561
562
563
564
565
566
567
568
569
570
571
572
573
574
575
576
577
578
579
580
581
582
583
584
585
586
587
588
589
590
591
592
593
594
595
596
597
598
599
600
601
602
603
604
605
606
607
608
609
610
611
612
613
614
615
616
617
618
619
620
621
622
623
624
625
626
627
628
629
630
631
632
633
634
635
636
637
638
639
640
641
642
643
644
645
646
647
648
649
650
651
652
653
654
655
656
657
658
659
660
661
662
663
664
665
666
667
668
669
670
671
672
673
674
675
676
677
678
679
680
681
682
683
684
685
686
687
688
689
690
691
692
693
694
695
696
697
```

Example 4 (python):
```python
def add_cli_args(parser: argparse.ArgumentParser):
    parser.add_argument(
        "--backend",
        type=str,
        choices=["vllm", "hf", "mii", "vllm-chat"],
        default="vllm",
    )
    parser.add_argument(
        "--dataset-name",
        type=str,
        choices=["sharegpt", "random", "sonnet", "burstgpt", "hf", "prefix_repetition"],
        help="Name of the dataset to benchmark on.",
        default="sharegpt",
    )
    parser.add_argument(
        "--dataset",
        type=str,
        default=None,
        help="Path to the ShareGPT dataset, will be deprecated in\
            the next release. The dataset is expected to "
        "be a json in form of list[dict[..., conversations: "
        "list[dict[..., value: <prompt_or_response>]]]]",
    )
    parser.add_argument(
        "--dataset-path", type=str, default=None, help="Path to the dataset"
    )
    parser.add_argument(
        "--input-len",
        type=int,
        default=None,
        help="Input prompt length for each request",
    )
    parser.add_argument(
        "--output-len",
        type=int,
        default=None,
        help="Output length for each request. Overrides the "
        "output length from the dataset.",
    )
    parser.add_argument(
        "--n", type=int, default=1, help="Number of generated sequences per prompt."
    )
    parser.add_argument(
        "--num-prompts", type=int, default=1000, help="Number of prompts to process."
    )
    parser.add_argument(
        "--hf-max-batch-size",
        type=int,
        default=None,
        help="Maximum batch size for HF backend.",
    )
    parser.add_argument(
        "--output-json",
        type=str,
        default=None,
        help="Path to save the throughput results in JSON format.",
    )
    parser.add_argument(
        "--async-engine",
        action="store_true",
        default=False,
        help="Use vLLM async engine rather than LLM class.",
    )
    parser.add_argument(
        "--disable-frontend-multiprocessing",
        action="store_true",
        default=False,
        help="Disable decoupled async engine frontend.",
    )
    parser.add_argument(
        "--disable-detokenize",
        action="store_true",
        help=(
            "Do not detokenize the response (i.e. do not include "
            "detokenization time in the measurement)"
        ),
    )
    # LoRA
    parser.add_argument(
        "--lora-path",
        type=str,
        default=None,
        help="Path to the lora adapters to use. This can be an absolute path, "
        "a relative path, or a Hugging Face model identifier.",
    )
    parser.add_argument(
        "--prefix-len",
        type=int,
        default=0,
        help="Number of fixed prefix tokens before the random "
        "context in a request (default: 0).",
    )
    # random dataset
    parser.add_argument(
        "--random-range-ratio",
        type=float,
        default=0.0,
        help="Range ratio for sampling input/output length, "
        "used only for RandomDataset. Must be in the range [0, 1) to define "
        "a symmetric sampling range "
        "[length * (1 - range_ratio), length * (1 + range_ratio)].",
    )

    # hf dtaset
    parser.add_argument(
        "--hf-subset", type=str, default=None, help="Subset of the HF dataset."
    )
    parser.add_argument(
        "--hf-split", type=str, default=None, help="Split of the HF dataset."
    )
    parser.add_argument(
        "--profile",
        action="store_true",
        default=False,
        help="Use vLLM Profiling. --profiler-config must be provided on the server.",
    )

    # prefix repetition dataset
    prefix_repetition_group = parser.add_argument_group(
        "prefix repetition dataset options"
    )
    prefix_repetition_group.add_argument(
        "--prefix-repetition-prefix-len",
        type=int,
        default=None,
        help="Number of prefix tokens per request, used only for prefix "
        "repetition dataset.",
    )
    prefix_repetition_group.add_argument(
        "--prefix-repetition-suffix-len",
        type=int,
        default=None,
        help="Number of suffix tokens per request, used only for prefix "
        "repetition dataset. Total input length is prefix_len + suffix_len.",
    )
    prefix_repetition_group.add_argument(
        "--prefix-repetition-num-prefixes",
        type=int,
        default=None,
        help="Number of prefixes to generate, used only for prefix repetition "
        "dataset. Prompts per prefix is num_requests // num_prefixes.",
    )
    prefix_repetition_group.add_argument(
        "--prefix-repetition-output-len",
        type=int,
        default=None,
        help="Number of output tokens per request, used only for prefix "
        "repetition dataset.",
    )

    parser = AsyncEngineArgs.add_cli_args(parser)
```

---

## throughput - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/cli/benchmark/throughput/

**Contents:**
- vllm.entrypoints.cli.benchmark.throughput ¶
- BenchmarkThroughputSubcommand ¶
  - help class-attribute instance-attribute ¶
  - name class-attribute instance-attribute ¶
  - add_cli_args classmethod ¶
  - cmd staticmethod ¶

Bases: BenchmarkSubcommandBase

The throughput subcommand for vllm bench.

**Examples:**

Example 1 (unknown):
```unknown
9
10
11
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
```

Example 2 (python):
```python
class BenchmarkThroughputSubcommand(BenchmarkSubcommandBase):
    """The `throughput` subcommand for `vllm bench`."""

    name = "throughput"
    help = "Benchmark offline inference throughput."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 3 (python):
```python
class BenchmarkThroughputSubcommand(BenchmarkSubcommandBase):
    """The `throughput` subcommand for `vllm bench`."""

    name = "throughput"
    help = "Benchmark offline inference throughput."

    @classmethod
    def add_cli_args(cls, parser: argparse.ArgumentParser) -> None:
        add_cli_args(parser)

    @staticmethod
    def cmd(args: argparse.Namespace) -> None:
        main(args)
```

Example 4 (unknown):
```unknown
help = 'Benchmark offline inference throughput.'
```

---

## utils - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/lib/utils/

**Contents:**
- vllm.benchmarks.lib.utils ¶
- InfEncoder ¶
  - clear_inf ¶
  - iterencode ¶
- convert_to_pytorch_benchmark_format ¶
- write_to_json ¶

Save the benchmark results in the format used by PyTorch OSS benchmark with on metric per record https://github.com/pytorch/pytorch/wiki/How-to-integrate-with-PyTorch-OSS-benchmark-database

**Examples:**

Example 1 (unknown):
```unknown
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
```

Example 2 (python):
```python
class InfEncoder(json.JSONEncoder):
    def clear_inf(self, o: Any):
        if isinstance(o, dict):
            return {
                str(k)
                if not isinstance(k, (str, int, float, bool, type(None)))
                else k: self.clear_inf(v)
                for k, v in o.items()
            }
        elif isinstance(o, list):
            return [self.clear_inf(v) for v in o]
        elif isinstance(o, float) and math.isinf(o):
            return "inf"
        return o

    def iterencode(self, o: Any, *args, **kwargs) -> Any:
        return super().iterencode(self.clear_inf(o), *args, **kwargs)
```

Example 3 (python):
```python
class InfEncoder(json.JSONEncoder):
    def clear_inf(self, o: Any):
        if isinstance(o, dict):
            return {
                str(k)
                if not isinstance(k, (str, int, float, bool, type(None)))
                else k: self.clear_inf(v)
                for k, v in o.items()
            }
        elif isinstance(o, list):
            return [self.clear_inf(v) for v in o]
        elif isinstance(o, float) and math.isinf(o):
            return "inf"
        return o

    def iterencode(self, o: Any, *args, **kwargs) -> Any:
        return super().iterencode(self.clear_inf(o), *args, **kwargs)
```

Example 4 (unknown):
```unknown
clear_inf(o: Any)
```

---

## utils - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/benchmarks/sweep/utils/

**Contents:**
- vllm.benchmarks.sweep.utils ¶
- sanitize_filename ¶

**Examples:**

Example 1 (php):
```php
sanitize_filename(filename: str) -> str
```

Example 2 (php):
```php
sanitize_filename(filename: str) -> str
```

Example 3 (python):
```python
def sanitize_filename(filename: str) -> str:
    return filename.replace("/", "_").replace("..", "__").strip("'").strip('"')
```

Example 4 (python):
```python
def sanitize_filename(filename: str) -> str:
    return filename.replace("/", "_").replace("..", "__").strip("'").strip('"')
```

---
