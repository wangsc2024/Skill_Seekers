# Vllm - Deployment

**Pages:** 96

---

## Anyscale - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/anyscale/

**Contents:**
- Anyscale¶
- Production-ready vLLM on Anyscale quickstarts¶

Anyscale is a managed, multi-cloud platform developed by the creators of Ray.

Anyscale automates the entire lifecycle of Ray clusters in your AWS, GCP, or Azure account, delivering the flexibility of open-source Ray without the operational overhead of maintaining Kubernetes control planes, configuring autoscalers, managing observability stacks, or manually managing head and worker nodes with helper scripts like examples/online_serving/run_cluster.sh.

When serving large language models with vLLM, Anyscale can rapidly provision production-ready HTTPS endpoints or fault-tolerant batch inference jobs.

---

## AnythingLLM - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/anything-llm/

**Contents:**
- AnythingLLM¶
- Prerequisites¶
- Deploy¶

AnythingLLM is a full-stack application that enables you to turn any document, resource, or piece of content into context that any LLM can use as references during chatting.

It allows you to deploy a large language model (LLM) server with vLLM as the backend, which exposes OpenAI-compatible endpoints.

Set up the vLLM environment:

Start the vLLM server with a supported chat-completion model, for example:

Download and install AnythingLLM Desktop.

Configure the AI provider:

Chat using your document as context.

**Examples:**

Example 1 (unknown):
```unknown
pip install vllm
```

Example 2 (unknown):
```unknown
pip install vllm
```

Example 3 (unknown):
```unknown
vllm serve Qwen/Qwen1.5-32B-Chat-AWQ --max-model-len 4096
```

Example 4 (unknown):
```unknown
vllm serve Qwen/Qwen1.5-32B-Chat-AWQ --max-model-len 4096
```

---

## API Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/api_client/

**Contents:**
- API Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/api_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for `vllm.entrypoints.api_server`
Start the demo server:
    python -m vllm.entrypoints.api_server --model <model_name>

NOTE: The API server is used only for demonstration and simple performance
benchmarks. It is not intended for production use.
For production use, we recommend `vllm serve` and the OpenAI client API.
"""

import argparse
import json
from argparse import Namespace
from collections.abc import Iterable

import requests


def clear_line(n: int = 1) -> None:
    LINE_UP = "\033[1A"
    LINE_CLEAR = "\x1b[2K"
    for _ in range(n):
        print(LINE_UP, end=LINE_CLEAR, flush=True)


def post_http_request(
    prompt: str, api_url: str, n: int = 1, stream: bool = False
) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    pload = {
        "prompt": prompt,
        "n": n,
        "temperature": 0.0,
        "max_tokens": 16,
        "stream": stream,
    }
    response = requests.post(api_url, headers=headers, json=pload, stream=stream)
    return response


def get_streaming_response(response: requests.Response) -> Iterable[list[str]]:
    for chunk in response.iter_lines(
        chunk_size=8192, decode_unicode=False, delimiter=b"\n"
    ):
        if chunk:
            data = json.loads(chunk.decode("utf-8"))
            output = data["text"]
            yield output


def get_response(response: requests.Response) -> list[str]:
    data = json.loads(response.content)
    output = data["text"]
    return output


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--n", type=int, default=1)
    parser.add_argument("--prompt", type=str, default="San Francisco is a")
    parser.add_argument("--stream", action="store_true")
    return parser.parse_args()


def main(args: Namespace):
    prompt = args.prompt
    api_url = f"http://{args.host}:{args.port}/generate"
    n = args.n
    stream = args.stream

    print(f"Prompt: {prompt!r}\n", flush=True)
    response = post_http_request(prompt, api_url, n, stream)

    if stream:
        num_printed_lines = 0
        for h in get_streaming_response(response):
            clear_line(num_printed_lines)
            num_printed_lines = 0
            for i, line in enumerate(h):
                num_printed_lines += 1
                print(f"Beam candidate {i}: {line!r}", flush=True)
    else:
        output = get_response(response)
        for i, line in enumerate(output):
            print(f"Beam candidate {i}: {line!r}", flush=True)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for `vllm.entrypoints.api_server`
Start the demo server:
    python -m vllm.entrypoints.api_server --model <model_name>

NOTE: The API server is used only for demonstration and simple performance
benchmarks. It is not intended for production use.
For production use, we recommend `vllm serve` and the OpenAI client API.
"""

import argparse
import json
from argparse import Namespace
from collections.abc import Iterable

import requests


def clear_line(n: int = 1) -> None:
    LINE_UP = "\033[1A"
    LINE_CLEAR = "\x1b[2K"
    for _ in range(n):
        print(LINE_UP, end=LINE_CLEAR, flush=True)


def post_http_request(
    prompt: str, api_url: str, n: int = 1, stream: bool = False
) -> requests.Response:
    headers = {"User-Agent": "Test Client"}
    pload = {
        "prompt": prompt,
        "n": n,
        "temperature": 0.0,
        "max_tokens": 16,
        "stream": stream,
    }
    response = requests.post(api_url, headers=headers, json=pload, stream=stream)
    return response


def get_streaming_response(response: requests.Response) -> Iterable[list[str]]:
    for chunk in response.iter_lines(
        chunk_size=8192, decode_unicode=False, delimiter=b"\n"
    ):
        if chunk:
            data = json.loads(chunk.decode("utf-8"))
            output = data["text"]
            yield output


def get_response(response: requests.Response) -> list[str]:
    data = json.loads(response.content)
    output = data["text"]
    return output


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--n", type=int, default=1)
    parser.add_argument("--prompt", type=str, default="San Francisco is a")
    parser.add_argument("--stream", action="store_true")
    return parser.parse_args()


def main(args: Namespace):
    prompt = args.prompt
    api_url = f"http://{args.host}:{args.port}/generate"
    n = args.n
    stream = args.stream

    print(f"Prompt: {prompt!r}\n", flush=True)
    response = post_http_request(prompt, api_url, n, stream)

    if stream:
        num_printed_lines = 0
        for h in get_streaming_response(response):
            clear_line(num_printed_lines)
            num_printed_lines = 0
            for i, line in enumerate(h):
                num_printed_lines += 1
                print(f"Beam candidate {i}: {line!r}", flush=True)
    else:
        output = get_response(response)
        for i, line in enumerate(output):
            print(f"Beam candidate {i}: {line!r}", flush=True)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## AutoGen - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/autogen/

**Contents:**
- AutoGen¶
- Prerequisites¶
- Deploy¶

AutoGen is a framework for creating multi-agent AI applications that can act autonomously or work alongside humans.

Set up the vLLM and AutoGen environment:

Start the vLLM server with the supported chat completion model, e.g.

Call it with AutoGen:

For details, see the tutorial:

Using vLLM in AutoGen

OpenAI-compatible API examples

**Examples:**

Example 1 (sql):
```sql
pip install vllm

# Install AgentChat and OpenAI client from Extensions
# AutoGen requires Python 3.10 or later.
pip install -U "autogen-agentchat" "autogen-ext[openai]"
```

Example 2 (sql):
```sql
pip install vllm

# Install AgentChat and OpenAI client from Extensions
# AutoGen requires Python 3.10 or later.
pip install -U "autogen-agentchat" "autogen-ext[openai]"
```

Example 3 (unknown):
```unknown
vllm serve mistralai/Mistral-7B-Instruct-v0.2
```

Example 4 (unknown):
```unknown
vllm serve mistralai/Mistral-7B-Instruct-v0.2
```

---

## BentoML - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/bentoml/

**Contents:**
- BentoML¶

BentoML allows you to deploy a large language model (LLM) server with vLLM as the backend, which exposes OpenAI-compatible endpoints. You can serve the model locally or containerize it as an OCI-compliant image and deploy it on Kubernetes.

For details, see the tutorial vLLM inference in the BentoML documentation.

---

## Cerebrium - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/cerebrium/

**Contents:**
- Cerebrium¶

vLLM can be run on a cloud based GPU machine with Cerebrium, a serverless AI infrastructure platform that makes it easier for companies to build and deploy AI based applications.

To install the Cerebrium client, run:

Next, create your Cerebrium project, run:

Next, to install the required packages, add the following to your cerebrium.toml:

Next, let us add our code to handle inference for the LLM of your choice (mistralai/Mistral-7B-Instruct-v0.1 for this example), add the following code to your main.py:

Then, run the following code to deploy it to the cloud:

If successful, you should be returned a CURL command that you can call inference against. Just remember to end the url with the function name you are calling (in our case/run)

You should get a response like:

You now have an autoscaling endpoint where you only pay for the compute you use!

**Examples:**

Example 1 (unknown):
```unknown
pip install cerebrium
cerebrium login
```

Example 2 (unknown):
```unknown
pip install cerebrium
cerebrium login
```

Example 3 (unknown):
```unknown
cerebrium init vllm-project
```

Example 4 (unknown):
```unknown
cerebrium init vllm-project
```

---

## Chatbox - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/chatbox/

**Contents:**
- Chatbox¶
- Prerequisites¶
- Deploy¶

Chatbox is a desktop client for LLMs, available on Windows, Mac, Linux.

It allows you to deploy a large language model (LLM) server with vLLM as the backend, which exposes OpenAI-compatible endpoints.

Set up the vLLM environment:

Start the vLLM server with the supported chat completion model, e.g.

Download and install Chatbox desktop.

On the bottom left of settings, Add Custom Provider

Go to Just chat, and start to chat:

**Examples:**

Example 1 (unknown):
```unknown
pip install vllm
```

Example 2 (unknown):
```unknown
pip install vllm
```

Example 3 (unknown):
```unknown
vllm serve qwen/Qwen1.5-0.5B-Chat
```

Example 4 (unknown):
```unknown
vllm serve qwen/Qwen1.5-0.5B-Chat
```

---

## Conserving Memory - vLLM

**URL:** https://docs.vllm.ai/en/latest/configuration/conserving_memory/

**Contents:**
- Conserving Memory¶
- Tensor Parallelism (TP)¶
- Quantization¶
- Context length and batch size¶
- Reduce CUDA Graphs¶
- Adjust cache size¶
- Multi-modal input limits¶
  - Configurable options¶
- Multi-modal processor arguments¶

Large models might cause your machine to run out of memory (OOM). Here are some options that help alleviate this problem.

Tensor parallelism (tensor_parallel_size option) can be used to split the model across multiple GPUs.

The following code splits the model across 2 GPUs.

To ensure that vLLM initializes CUDA correctly, you should avoid calling related functions (e.g. torch.cuda.set_device) before initializing vLLM. Otherwise, you may run into an error like RuntimeError: Cannot re-initialize CUDA in forked subprocess.

To control which devices are used, please instead set the CUDA_VISIBLE_DEVICES environment variable.

With tensor parallelism enabled, each process will read the whole model and split it into chunks, which makes the disk reading time even longer (proportional to the size of tensor parallelism).

You can convert the model checkpoint to a sharded checkpoint using examples/offline_inference/save_sharded_state.py. The conversion process might take some time, but later you can load the sharded checkpoint much faster. The model loading time should remain constant regardless of the size of tensor parallelism.

Quantized models take less memory at the cost of lower precision.

Statically quantized models can be downloaded from HF Hub (some popular ones are available at Red Hat AI) and used directly without extra configuration.

Dynamic quantization is also supported via the quantization option -- see here for more details.

You can further reduce memory usage by limiting the context length of the model (max_model_len option) and the maximum batch size (max_num_seqs option).

By default, we optimize model inference using CUDA graphs which take up extra memory in the GPU.

You can adjust compilation_config to achieve a better balance between inference speed and memory usage:

You can disable graph capturing completely via the enforce_eager flag:

If you run out of CPU RAM, try the following options:

You can allow a smaller number of multi-modal items per prompt to reduce the memory footprint of the model:

You can go a step further and disable unused modalities completely by setting its limit to zero. For example, if your application only accepts image input, there is no need to allocate any memory for videos.

You can even run a multi-modal model for text-only inference:

limit_mm_per_prompt also accepts configurable options per modality. In the configurable form, you still specify count, and you may optionally provide size hints that control how vLLM profiles and reserves memory for your multi‑modal inputs. This helps you tune memory for the actual media you expect, instead of the model’s absolute maxima.

Configurable options by modality:

Details could be found in ImageDummyOptions, VideoDummyOptions, and AudioDummyOptions.

For backward compatibility, passing an integer works as before and is interpreted as {"count": <int>}. For example:

These size hints currently only affect activation memory profiling. Encoder cache size is determined by the actual inputs at runtime and is not limited by these hints.

For certain models, you can adjust the multi-modal processor arguments to reduce the size of the processed multi-modal inputs, which in turn saves memory.

Here are some examples:

**Examples:**

Example 1 (python):
```python
from vllm import LLM

llm = LLM(model="ibm-granite/granite-3.1-8b-instruct", tensor_parallel_size=2)
```

Example 2 (python):
```python
from vllm import LLM

llm = LLM(model="ibm-granite/granite-3.1-8b-instruct", tensor_parallel_size=2)
```

Example 3 (python):
```python
from vllm import LLM

llm = LLM(model="adept/fuyu-8b", max_model_len=2048, max_num_seqs=2)
```

Example 4 (python):
```python
from vllm import LLM

llm = LLM(model="adept/fuyu-8b", max_model_len=2048, max_num_seqs=2)
```

---

## Context Parallel Deployment - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/context_parallel_deployment/

**Contents:**
- Context Parallel Deployment¶
- Prefill Context Parallel¶
- Decode Context Parallel¶
- Technical Discussions¶

Context parallel mainly solves the problem of serving long context requests. As prefill and decode present quite different characteristics and have quite different SLO (service level objectives), we need to implement context parallel separately for them. The major considerations are:

During prefill, for a long request with T new tokens, we need to compute query/key/value tensors for these new tokens. Say we have N GPUs, we can split the request into N chunks, and each GPU computes one chunk of the query/key/value tensors.

Depending on the use case, there're two possible strategies:

Both approaches are under active development.

Due to the auto-regressive nature of decoding, every decoding step needs to compute a small amount of query tokens w.r.t. a large number of key/value tokens stored in the paged KV cache. The core of decode context parallel is how to shard the KV cache across GPUs.

For a model with H kv-heads, a request with T tokens in the context needs to store H * T key/value tensors in the KV cache.

Theoretically, it is possible to extend the dcp size beyond tp_size / H to further shard the KV cache and accelerate the decoding phase. However, since the number of query tokens is limited in decoding, it's unclear what should we do for the remaining dcp_size - tp_size / H GPUs for non-attention layers. For the sake of simplicity, dcp size is upper bounded by tp_size / H. If you want to further accelerate the decoding phase, you can consider increasing the tp_size first, and then increasing the dcp size.

Note that kv cache can grow during decoding, and the sharding strategy needs to be carefully implemented. We use an interleaving strategy to shard the KV cache along the T dimension, so that kv cache for future tokens can be naturally sharded along the T dimension. This is proposed by Chao Hong from Moonshot, and also explained in details in this paper.

For DeepSeek-R1, we have 1 kv-head when MLA is enabled. The typical single-node deployment with -tp 8 causes 8x KV cache duplication. We can consider adding -dcp 8 to reduce the KV cache duplication.

For Kimi-K2, the architecture is similar to DeepSeek-R1, but with more parameters. When we deploy it with -tp 16, the KV cache duplication is 16x. We can add -dcp 16 to completely remove the KV cache duplication, at the cost of more communication overhead. We can also add -dcp 8 to reduce the KV cache duplication to 2x. Although it still duplicates the KV cache twice, the communication overhead is smaller since the DCP communication only happens inside one node.

For Qwen3-235B-A22B, we have 4 kv-heads. When we deploy it with -tp 8, the KV cache duplication is 2x. Then we can add -dcp 2 to remove the KV cache duplication.

In short, for decode context parallel, try to increase -tp size until you get satisfactory performance, and then add -dcp to reduce the KV cache duplication.

Decode context parallel is supported in vLLM, for both MLA and GQA models. Some attention backends also support the combination of decode context parallel and MTP (multi-token prediction) to further accelerate the decoding phase.

The main discussions happen in the #sig-context-parallel channel of vLLM Slack.

---

## Data Parallel Deployment - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/data_parallel_deployment/

**Contents:**
- Data Parallel Deployment¶
- Internal Load Balancing¶
- Hybrid Load Balancing¶
- External Load Balancing¶

vLLM supports Data Parallel deployment, where model weights are replicated across separate instances/GPUs to process independent batches of requests.

This will work with both dense and MoE models.

For MoE models, particularly those like DeepSeek that employ MLA (Multi-head Latent Attention), it can be advantageous to use data parallel for the attention layers and expert or tensor parallel (EP or TP) for the expert layers.

In these cases, the data parallel ranks are not completely independent. Forward passes must be aligned, and expert layers across all ranks are required to synchronize during every forward pass, even when there are fewer requests to be processed than DP ranks.

By default, expert layers form a tensor parallel group of size DP × TP. To use expert parallelism instead, include the --enable-expert-parallel CLI arg (on all nodes in the multi-node case). See Expert Parallel Deployment for details on how attention and expert layers behave differently with EP enabled.

In vLLM, each DP rank is deployed as a separate "core engine" process that communicates with front-end process(es) via ZMQ sockets. Data Parallel attention can be combined with Tensor Parallel attention, in which case each DP engine owns a number of per-GPU worker processes equal to the configured TP size.

For MoE models, when any requests are in progress in any rank, we must ensure that empty "dummy" forward passes are performed in all ranks that don't currently have any requests scheduled. This is handled via a separate DP Coordinator process that communicates with all ranks, and a collective operation performed every N steps to determine when all ranks become idle and can be paused. When TP is used in conjunction with DP, expert layers form a group of size DP × TP (using either tensor parallelism by default, or expert parallelism if --enable-expert-parallel is set).

In all cases, it is beneficial to load-balance requests between DP ranks. For online deployments, this balancing can be optimized by taking into account the state of each DP engine - in particular its currently scheduled and waiting (queued) requests, and KV cache state. Each DP engine has an independent KV cache, and the benefit of prefix caching can be maximized by directing prompts intelligently.

This document focuses on online deployments (with the API server). DP + EP is also supported for offline usage (via the LLM class), for an example see examples/offline_inference/data_parallel.py.

There are two distinct modes supported for online deployments - self-contained with internal load balancing, or externally per-rank process deployment and load balancing.

vLLM supports "self-contained" data parallel deployments that expose a single API endpoint.

It can be configured by simply including e.g. --data-parallel-size=4 in the vllm serve command line arguments. This will require 4 GPUs. It can be combined with tensor parallel, for example --data-parallel-size=4 --tensor-parallel-size=2, which would require 8 GPUs. When sizing DP deployments, remember that --max-num-seqs applies per DP rank.

Running a single data parallel deployment across multiple nodes requires a different vllm serve to be run on each node, specifying which DP ranks should run on that node. In this case, there will still be a single HTTP entrypoint - the API server(s) will run only on one node, but it doesn't necessarily need to be co-located with the DP ranks.

This will run DP=4, TP=2 on a single 8-GPU node:

This will run DP=4 with DP ranks 0 and 1 on the head node and ranks 2 and 3 on the second node:

This will run DP=4 with only the API server on the first node and all engines on the second node:

This DP mode can also be used with Ray by specifying --data-parallel-backend=ray:

There are several notable differences when using Ray:

Currently, the internal DP load balancing is done within the API server process(es) and is based on the running and waiting queues in each of the engines. This could be made more sophisticated in future by incorporating KV cache aware logic.

When deploying large DP sizes using this method, the API server process can become a bottleneck. In this case, the orthogonal --api-server-count command line option can be used to scale this out (for example --api-server-count=4). This is transparent to users - a single HTTP endpoint / port is still exposed. Note that this API server scale-out is "internal" and still confined to the "head" node.

Hybrid load balancing sits between the internal and external approaches. Each node runs its own API server(s) that only queue requests to the data-parallel engines colocated on that node. An upstream load balancer (for example, an ingress controller or traffic router) spreads user requests across those per-node endpoints.

Enable this mode with --data-parallel-hybrid-lb while still launching every node with the global data-parallel size. The key differences from internal load balancing are:

In this configuration, each node keeps scheduling decisions local, which reduces cross-node traffic and avoids single node bottlenecks at larger DP sizes.

For larger scale deployments especially, it can make sense to handle the orchestration and load balancing of data parallel ranks externally.

In this case, it's more convenient to treat each DP rank like a separate vLLM deployment, with its own endpoint, and have an external router balance HTTP requests between them, making use of appropriate real-time telemetry from each server for routing decisions.

This can already be done trivially for non-MoE models, since each deployed server is fully independent. No data parallel CLI options need to be used for this.

We support an equivalent topology for MoE DP+EP which can be configured via the following CLI arguments.

If DP ranks are co-located (same node / ip address), a default RPC port is used, but a different HTTP server port must be specified for each rank:

For multi-node cases, the address/port of rank 0 must also be specified:

The coordinator process also runs in this scenario, co-located with the DP rank 0 engine.

In the above diagram, each of the dotted boxes corresponds to a separate launch of vllm serve - these could be separate Kubernetes pods, for example.

**Examples:**

Example 1 (bash):
```bash
vllm serve $MODEL --data-parallel-size 4 --tensor-parallel-size 2
```

Example 2 (bash):
```bash
vllm serve $MODEL --data-parallel-size 4 --tensor-parallel-size 2
```

Example 3 (markdown):
```markdown
# Node 0  (with ip address 10.99.48.128)
vllm serve $MODEL --data-parallel-size 4 --data-parallel-size-local 2 \
                  --data-parallel-address 10.99.48.128 --data-parallel-rpc-port 13345
# Node 1
vllm serve $MODEL --headless --data-parallel-size 4 --data-parallel-size-local 2 \
                  --data-parallel-start-rank 2 \
                  --data-parallel-address 10.99.48.128 --data-parallel-rpc-port 13345
```

Example 4 (markdown):
```markdown
# Node 0  (with ip address 10.99.48.128)
vllm serve $MODEL --data-parallel-size 4 --data-parallel-size-local 2 \
                  --data-parallel-address 10.99.48.128 --data-parallel-rpc-port 13345
# Node 1
vllm serve $MODEL --headless --data-parallel-size 4 --data-parallel-size-local 2 \
                  --data-parallel-start-rank 2 \
                  --data-parallel-address 10.99.48.128 --data-parallel-rpc-port 13345
```

---

## Dify - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/dify/

**Contents:**
- Dify¶
- Prerequisites¶
- Deploy¶

Dify is an open-source LLM app development platform. Its intuitive interface combines agentic AI workflow, RAG pipeline, agent capabilities, model management, observability features, and more, allowing you to quickly move from prototype to production.

It supports vLLM as a model provider to efficiently serve large language models.

This guide walks you through deploying Dify using a vLLM backend.

Set up the vLLM environment:

And install Docker and Docker Compose.

Start the vLLM server with the supported chat completion model, e.g.

Start the Dify server with docker compose (details):

Open the browser to access http://localhost/install, config the basic login information and login.

In the top-right user menu (under the profile icon), go to Settings, then click Model Provider, and locate the vLLM provider to install it.

Fill in the model provider details as follows:

To create a test chatbot, go to Studio → Chatbot → Create from Blank, then select Chatbot as the type:

Click the chatbot you just created to open the chat interface and start interacting with the model:

**Examples:**

Example 1 (unknown):
```unknown
pip install vllm
```

Example 2 (unknown):
```unknown
pip install vllm
```

Example 3 (unknown):
```unknown
vllm serve Qwen/Qwen1.5-7B-Chat
```

Example 4 (unknown):
```unknown
vllm serve Qwen/Qwen1.5-7B-Chat
```

---

## Disaggregated Encoder - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_encoder/

**Contents:**
- Disaggregated Encoder¶
- Files¶
  - Custom Configuration¶
- Encoder Instances¶
- Local media inputs¶
- EC connector and KV transfer¶
- Proxy Instance Flags (disagg_epd_proxy.py)¶
- Example materials¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/disaggregated_encoder.

These example scripts that demonstrate the disaggregated encoder (EPD) features of vLLM.

For a detailed explanation of the EPD features, please refer to the Disaggregated Encoder Feature Documentation.

disagg_epd_proxy.py - Proxy script that demonstrates the XeYpZd setup (X encode instances, Y prefill instances, Z decode instances). Currently stable for the 1e1p1d configuration.

disagg_1e1p1d_example.sh - Sets up the 1e1p1d configuration, runs the VisionArena benchmark, and processes a single request with a local image.

disagg_1e1pd_example.sh - Sets up the 1e1pd configuration, runs the VisionArena benchmark, and processes a single request with a local image.

Encoder engines should be launched with the following flags:

--enforce-eager (required) – The current EPD implementation is only compatible with encoder instances running in this mode.

--no-enable-prefix-caching (required) – Encoder instances do not consume KV cache; prefix caching is disabled to avoid conflicts with other features.

--max-num-batched-tokens=<large value> (default: 2048) – This flag controls the token scheduling budget per decoding step and is irrelevant to encoder-only instances. Set it to a very high value (effectively unlimited) to bypass scheduler limitations. The actual token budget is managed by the encoder cache manager.

--convert "mm_encoder_only" (Optional) - The language model is skipped during initialization to reduce device memory usage. Models using this option must implement the get_language_model_spec interface.

To support local image inputs (from your MEDIA_PATH directory), add the following flag to the encoder instance:

The vllm instances and disagg_encoder_proxy supports local URIs with {"url": "file://'"$MEDIA_PATH_FILENAME"'} as multimodal inputs. Each URI is passed unchanged from the disagg_encoder_proxy to the encoder instance so that the encoder can load the media locally.

The ECExampleonnector is used to store the encoder cache on local disk and facilitate transfer. To enable the encoder disaggregation feature, add the following configuration:

$EC_SHARED_STORAGE_PATH is the path where the EC connector temporarily stores the cache.

If you enable prefill instance (--prefill-servers-urls not disabled), you will need --kv-transfer-config to facilitate the PD disaggregation. Currently, we use the NixlConnector for this purpose. Refer to tests/v1/kv_connector/nixl_integration for more example codes on PD disaggregation with Nixl.

Example usage: For E + PD setup:

**Examples:**

Example 1 (markdown):
```markdown
# Use specific GPUs
GPU_E=0 GPU_PD=1 GPU_P=1 GPU_D=2 bash disagg_1e1p1d_example.sh

# Use specific ports
ENDPOINT_PORT=10001 bash disagg_1e1p1d_example.sh

# Use specific model
MODEL="Qwen/Qwen2.5-VL-3B-Instruct" bash disagg_1e1p1d_example.sh

# Use specific storage path
EC_SHARED_STORAGE_PATH="/tmp/my_ec_cache" bash disagg_1e1p1d_example.sh
```

Example 2 (markdown):
```markdown
# Use specific GPUs
GPU_E=0 GPU_PD=1 GPU_P=1 GPU_D=2 bash disagg_1e1p1d_example.sh

# Use specific ports
ENDPOINT_PORT=10001 bash disagg_1e1p1d_example.sh

# Use specific model
MODEL="Qwen/Qwen2.5-VL-3B-Instruct" bash disagg_1e1p1d_example.sh

# Use specific storage path
EC_SHARED_STORAGE_PATH="/tmp/my_ec_cache" bash disagg_1e1p1d_example.sh
```

Example 3 (bash):
```bash
--allowed-local-media-path $MEDIA_PATH
```

Example 4 (bash):
```bash
--allowed-local-media-path $MEDIA_PATH
```

---

## Disaggregated Prefill - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_prefill/

**Contents:**
- Disaggregated Prefill¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/disaggregated_prefill.sh.

**Examples:**

Example 1 (bash):
```bash
#!/bin/bash
# This file demonstrates the example usage of disaggregated prefilling
# We will launch 2 vllm instances (1 for prefill and 1 for decode),
# and then transfer the KV cache between them.

set -xe

echo "🚧🚧 Warning: The usage of disaggregated prefill is experimental and subject to change 🚧🚧"
sleep 1

# meta-llama/Meta-Llama-3.1-8B-Instruct or deepseek-ai/DeepSeek-V2-Lite
MODEL_NAME=${HF_MODEL_NAME:-meta-llama/Meta-Llama-3.1-8B-Instruct}

# Trap the SIGINT signal (triggered by Ctrl+C)
trap 'cleanup' INT

# Cleanup function
cleanup() {
    echo "Caught Ctrl+C, cleaning up..."
    # Cleanup commands
    pgrep python | xargs kill -9
    pkill -f python
    echo "Cleanup complete. Exiting."
    exit 0
}


if [[ -z "${VLLM_HOST_IP:-}" ]]; then
    export VLLM_HOST_IP=127.0.0.1
    echo "Using default VLLM_HOST_IP=127.0.0.1 (override by exporting VLLM_HOST_IP before running this script)"
else
    echo "Using provided VLLM_HOST_IP=${VLLM_HOST_IP}"
fi


# install quart first -- required for disagg prefill proxy serve
if python3 -c "import quart" &> /dev/null; then
    echo "Quart is already installed."
else
    echo "Quart is not installed. Installing..."
    python3 -m pip install quart
fi 

# a function that waits vLLM server to start
wait_for_server() {
  local port=$1
  timeout 1200 bash -c "
    until curl -i localhost:${port}/v1/models > /dev/null; do
      sleep 1
    done" && return 0 || return 1
}


# You can also adjust --kv-ip and --kv-port for distributed inference.

# prefilling instance, which is the KV producer
CUDA_VISIBLE_DEVICES=0 vllm serve $MODEL_NAME \
    --host 0.0.0.0 \
    --port 8100 \
    --max-model-len 100 \
    --gpu-memory-utilization 0.8 \
    --trust-remote-code \
    --kv-transfer-config \
    '{"kv_connector":"P2pNcclConnector","kv_role":"kv_producer","kv_rank":0,"kv_parallel_size":2,"kv_buffer_size":"1e9","kv_port":"14579","kv_connector_extra_config":{"proxy_ip":"'"$VLLM_HOST_IP"'","proxy_port":"30001","http_ip":"'"$VLLM_HOST_IP"'","http_port":"8100","send_type":"PUT_ASYNC"}}' &

# decoding instance, which is the KV consumer  
CUDA_VISIBLE_DEVICES=1 vllm serve $MODEL_NAME \
    --host 0.0.0.0 \
    --port 8200 \
    --max-model-len 100 \
    --gpu-memory-utilization 0.8 \
    --trust-remote-code \
    --kv-transfer-config \
    '{"kv_connector":"P2pNcclConnector","kv_role":"kv_consumer","kv_rank":1,"kv_parallel_size":2,"kv_buffer_size":"1e10","kv_port":"14580","kv_connector_extra_config":{"proxy_ip":"'"$VLLM_HOST_IP"'","proxy_port":"30001","http_ip":"'"$VLLM_HOST_IP"'","http_port":"8200","send_type":"PUT_ASYNC"}}' &

# wait until prefill and decode instances are ready
wait_for_server 8100
wait_for_server 8200

# launch a proxy server that opens the service at port 8000
# the workflow of this proxy:
# - send the request to prefill vLLM instance (port 8100), change max_tokens 
#   to 1
# - after the prefill vLLM finishes prefill, send the request to decode vLLM 
#   instance
# NOTE: the usage of this API is subject to change --- in the future we will 
# introduce "vllm connect" to connect between prefill and decode instances
python3 ../../benchmarks/disagg_benchmarks/disagg_prefill_proxy_server.py &
sleep 1

# serve two example requests
output1=$(curl -X POST -s http://localhost:8000/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "San Francisco is a",
"max_tokens": 10,
"temperature": 0
}')

output2=$(curl -X POST -s http://localhost:8000/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "Santa Clara is a",
"max_tokens": 10,
"temperature": 0
}')


# Cleanup commands
pgrep python | xargs kill -9
pkill -f python

echo ""

sleep 1

# Print the outputs of the curl requests
echo ""
echo "Output of first request: $output1"
echo "Output of second request: $output2"

echo "🎉🎉 Successfully finished 2 test requests! 🎉🎉"
echo ""
```

Example 2 (bash):
```bash
#!/bin/bash
# This file demonstrates the example usage of disaggregated prefilling
# We will launch 2 vllm instances (1 for prefill and 1 for decode),
# and then transfer the KV cache between them.

set -xe

echo "🚧🚧 Warning: The usage of disaggregated prefill is experimental and subject to change 🚧🚧"
sleep 1

# meta-llama/Meta-Llama-3.1-8B-Instruct or deepseek-ai/DeepSeek-V2-Lite
MODEL_NAME=${HF_MODEL_NAME:-meta-llama/Meta-Llama-3.1-8B-Instruct}

# Trap the SIGINT signal (triggered by Ctrl+C)
trap 'cleanup' INT

# Cleanup function
cleanup() {
    echo "Caught Ctrl+C, cleaning up..."
    # Cleanup commands
    pgrep python | xargs kill -9
    pkill -f python
    echo "Cleanup complete. Exiting."
    exit 0
}


if [[ -z "${VLLM_HOST_IP:-}" ]]; then
    export VLLM_HOST_IP=127.0.0.1
    echo "Using default VLLM_HOST_IP=127.0.0.1 (override by exporting VLLM_HOST_IP before running this script)"
else
    echo "Using provided VLLM_HOST_IP=${VLLM_HOST_IP}"
fi


# install quart first -- required for disagg prefill proxy serve
if python3 -c "import quart" &> /dev/null; then
    echo "Quart is already installed."
else
    echo "Quart is not installed. Installing..."
    python3 -m pip install quart
fi 

# a function that waits vLLM server to start
wait_for_server() {
  local port=$1
  timeout 1200 bash -c "
    until curl -i localhost:${port}/v1/models > /dev/null; do
      sleep 1
    done" && return 0 || return 1
}


# You can also adjust --kv-ip and --kv-port for distributed inference.

# prefilling instance, which is the KV producer
CUDA_VISIBLE_DEVICES=0 vllm serve $MODEL_NAME \
    --host 0.0.0.0 \
    --port 8100 \
    --max-model-len 100 \
    --gpu-memory-utilization 0.8 \
    --trust-remote-code \
    --kv-transfer-config \
    '{"kv_connector":"P2pNcclConnector","kv_role":"kv_producer","kv_rank":0,"kv_parallel_size":2,"kv_buffer_size":"1e9","kv_port":"14579","kv_connector_extra_config":{"proxy_ip":"'"$VLLM_HOST_IP"'","proxy_port":"30001","http_ip":"'"$VLLM_HOST_IP"'","http_port":"8100","send_type":"PUT_ASYNC"}}' &

# decoding instance, which is the KV consumer  
CUDA_VISIBLE_DEVICES=1 vllm serve $MODEL_NAME \
    --host 0.0.0.0 \
    --port 8200 \
    --max-model-len 100 \
    --gpu-memory-utilization 0.8 \
    --trust-remote-code \
    --kv-transfer-config \
    '{"kv_connector":"P2pNcclConnector","kv_role":"kv_consumer","kv_rank":1,"kv_parallel_size":2,"kv_buffer_size":"1e10","kv_port":"14580","kv_connector_extra_config":{"proxy_ip":"'"$VLLM_HOST_IP"'","proxy_port":"30001","http_ip":"'"$VLLM_HOST_IP"'","http_port":"8200","send_type":"PUT_ASYNC"}}' &

# wait until prefill and decode instances are ready
wait_for_server 8100
wait_for_server 8200

# launch a proxy server that opens the service at port 8000
# the workflow of this proxy:
# - send the request to prefill vLLM instance (port 8100), change max_tokens 
#   to 1
# - after the prefill vLLM finishes prefill, send the request to decode vLLM 
#   instance
# NOTE: the usage of this API is subject to change --- in the future we will 
# introduce "vllm connect" to connect between prefill and decode instances
python3 ../../benchmarks/disagg_benchmarks/disagg_prefill_proxy_server.py &
sleep 1

# serve two example requests
output1=$(curl -X POST -s http://localhost:8000/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "San Francisco is a",
"max_tokens": 10,
"temperature": 0
}')

output2=$(curl -X POST -s http://localhost:8000/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "Santa Clara is a",
"max_tokens": 10,
"temperature": 0
}')


# Cleanup commands
pgrep python | xargs kill -9
pkill -f python

echo ""

sleep 1

# Print the outputs of the curl requests
echo ""
echo "Output of first request: $output1"
echo "Output of second request: $output2"

echo "🎉🎉 Successfully finished 2 test requests! 🎉🎉"
echo ""
```

---

## Disaggregated Serving P2P Nccl Xpyd - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_serving_p2p_nccl_xpyd/

**Contents:**
- Disaggregated Serving P2P Nccl Xpyd¶
- Disagg Example P2P Nccl Xpyd¶
- Disagg Proxy P2P Nccl Xpyd¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/disaggregated_serving_p2p_nccl_xpyd.

**Examples:**

Example 1 (bash):
```bash
#!/bin/bash

# =============================================================================
# vLLM Disaggregated Serving Script - P2P NCCL XpYd Architecture
# =============================================================================
# This script demonstrates disaggregated prefill and decode serving using
# P2P NCCL communication. The architecture supports various XpYd configurations:
#
# - 1P3D: 1 Prefill server + 3 Decode servers (current default)
# - 3P1D: 3 Prefill servers + 1 Decode server
# - etc.
#
# Configuration can be customized via environment variables:
#   MODEL: Model to serve
#   PREFILL_GPUS: Comma-separated GPU IDs for prefill servers
#   DECODE_GPUS: Comma-separated GPU IDs for decode servers
#   PREFILL_PORTS: Comma-separated ports for prefill servers
#   DECODE_PORTS: Comma-separated ports for decode servers
#   PROXY_PORT: Proxy server port used to setup XpYd connection.
#   TIMEOUT_SECONDS: Server startup timeout
# =============================================================================

# Configuration - can be overridden via environment variables
MODEL=${MODEL:-meta-llama/Llama-3.1-8B-Instruct}
TIMEOUT_SECONDS=${TIMEOUT_SECONDS:-1200}
PROXY_PORT=${PROXY_PORT:-30001}

# Default 1P3D configuration (1 Prefill + 3 Decode)
PREFILL_GPUS=${PREFILL_GPUS:-0}
DECODE_GPUS=${DECODE_GPUS:-1,2,3}
PREFILL_PORTS=${PREFILL_PORTS:-20003}
DECODE_PORTS=${DECODE_PORTS:-20005,20007,20009}

echo "Warning: P2P NCCL disaggregated prefill XpYd support for vLLM v1 is experimental and subject to change."
echo ""
echo "Architecture Configuration:"
echo "  Model: $MODEL"
echo "  Prefill GPUs: $PREFILL_GPUS, Ports: $PREFILL_PORTS"
echo "  Decode GPUs: $DECODE_GPUS, Ports: $DECODE_PORTS"
echo "  Proxy Port: $PROXY_PORT"
echo "  Timeout: ${TIMEOUT_SECONDS}s"
echo ""

PIDS=()

# Switch to the directory of the current script
cd "$(dirname "${BASH_SOURCE[0]}")"

check_required_files() {
    local files=("disagg_proxy_p2p_nccl_xpyd.py")
    for file in "${files[@]}"; do
        if [[ ! -f "$file" ]]; then
            echo "Required file $file not found in $(pwd)"
            exit 1
        fi
    done
}

check_hf_token() {
    if [ -z "$HF_TOKEN" ]; then
        echo "HF_TOKEN is not set. Please set it to your Hugging Face token."
        echo "Example: export HF_TOKEN=your_token_here"
        exit 1
    fi
    if [[ "$HF_TOKEN" != hf_* ]]; then
        echo "HF_TOKEN is not a valid Hugging Face token. Please set it to your Hugging Face token."
        exit 1
    fi
    echo "HF_TOKEN is set and valid."
}

check_num_gpus() {
    # Check if the number of GPUs are >=2 via nvidia-smi
    num_gpus=$(nvidia-smi --query-gpu=name --format=csv,noheader | wc -l)
    if [ "$num_gpus" -lt 2 ]; then
        echo "You need at least 2 GPUs to run disaggregated prefill."
        exit 1
    else
        echo "Found $num_gpus GPUs."
    fi
}

ensure_python_library_installed() {
    echo "Checking if $1 is installed..."
    if ! python3 -c "import $1" > /dev/null 2>&1; then
        echo "$1 is not installed. Please install it via pip install $1."
        exit 1
    else
        echo "$1 is installed."
    fi
}

cleanup() {
    echo "Stopping everything…"
    trap - INT TERM        # prevent re-entrancy
    pkill -9 -f "disagg_proxy_p2p_nccl_xpyd.py"
    kill -- -$$            # negative PID  ==  "this whole process-group"
    wait                   # reap children so we don't leave zombies
    exit 0
}

wait_for_server() {
  local port=$1
  local timeout_seconds=$TIMEOUT_SECONDS
  local start_time=$(date +%s)

  echo "Waiting for server on port $port..."

  while true; do
    if curl -s "localhost:${port}/v1/completions" > /dev/null; then
      echo "Server on port $port is ready."
      return 0
    fi

    local now=$(date +%s)
    if (( now - start_time >= timeout_seconds )); then
      echo "Timeout waiting for server on port $port"
      return 1
    fi

    sleep 1
  done
}

main() {
    check_required_files
    check_hf_token
    check_num_gpus
    ensure_python_library_installed pandas
    ensure_python_library_installed datasets
    ensure_python_library_installed vllm
    ensure_python_library_installed quart

    trap cleanup INT
    trap cleanup USR1
    trap cleanup TERM

    echo "Launching disaggregated serving components..."
    echo "Please check the log files for detailed output:"
    echo "  - prefill*.log: Prefill server logs"
    echo "  - decode*.log: Decode server logs"
    echo "  - proxy.log: Proxy server log"

    # =============================================================================
    # Launch Proxy Server
    # =============================================================================
    echo ""
    echo "Starting proxy server on port $PROXY_PORT..."
    python3 disagg_proxy_p2p_nccl_xpyd.py &
    PIDS+=($!)

    # Parse GPU and port arrays
    IFS=',' read -ra PREFILL_GPU_ARRAY <<< "$PREFILL_GPUS"
    IFS=',' read -ra DECODE_GPU_ARRAY <<< "$DECODE_GPUS"
    IFS=',' read -ra PREFILL_PORT_ARRAY <<< "$PREFILL_PORTS"
    IFS=',' read -ra DECODE_PORT_ARRAY <<< "$DECODE_PORTS"

    # =============================================================================
    # Launch Prefill Servers (X Producers)
    # =============================================================================
    echo ""
    echo "Starting ${#PREFILL_GPU_ARRAY[@]} prefill server(s)..."
    for i in "${!PREFILL_GPU_ARRAY[@]}"; do
        local gpu_id=${PREFILL_GPU_ARRAY[$i]}
        local port=${PREFILL_PORT_ARRAY[$i]}
        local kv_port=$((21001 + i))

        echo "  Prefill server $((i+1)): GPU $gpu_id, Port $port, KV Port $kv_port"
        CUDA_VISIBLE_DEVICES=$gpu_id vllm serve $MODEL \
        --enforce-eager \
        --host 0.0.0.0 \
        --port $port \
        --tensor-parallel-size 1 \
        --seed 1024 \
        --dtype float16 \
        --max-model-len 10000 \
        --max-num-batched-tokens 10000 \
        --max-num-seqs 256 \
        --trust-remote-code \
        --gpu-memory-utilization 0.9 \
        --kv-transfer-config \
        "{\"kv_connector\":\"P2pNcclConnector\",\"kv_role\":\"kv_producer\",\"kv_buffer_size\":\"1e1\",\"kv_port\":\"$kv_port\",\"kv_connector_extra_config\":{\"proxy_ip\":\"0.0.0.0\",\"proxy_port\":\"$PROXY_PORT\",\"http_port\":\"$port\",\"send_type\":\"PUT_ASYNC\",\"nccl_num_channels\":\"16\"}}" > prefill$((i+1)).log 2>&1 &
        PIDS+=($!)
    done

    # =============================================================================
    # Launch Decode Servers (Y Decoders)
    # =============================================================================
    echo ""
    echo "Starting ${#DECODE_GPU_ARRAY[@]} decode server(s)..."
    for i in "${!DECODE_GPU_ARRAY[@]}"; do
        local gpu_id=${DECODE_GPU_ARRAY[$i]}
        local port=${DECODE_PORT_ARRAY[$i]}
        local kv_port=$((22001 + i))

        echo "  Decode server $((i+1)): GPU $gpu_id, Port $port, KV Port $kv_port"
        CUDA_VISIBLE_DEVICES=$gpu_id vllm serve $MODEL \
        --enforce-eager \
        --host 0.0.0.0 \
        --port $port \
        --tensor-parallel-size 1 \
        --seed 1024 \
        --dtype float16 \
        --max-model-len 10000 \
        --max-num-batched-tokens 10000 \
        --max-num-seqs 256 \
        --trust-remote-code \
        --gpu-memory-utilization 0.7 \
        --kv-transfer-config \
        "{\"kv_connector\":\"P2pNcclConnector\",\"kv_role\":\"kv_consumer\",\"kv_buffer_size\":\"8e9\",\"kv_port\":\"$kv_port\",\"kv_connector_extra_config\":{\"proxy_ip\":\"0.0.0.0\",\"proxy_port\":\"$PROXY_PORT\",\"http_port\":\"$port\",\"send_type\":\"PUT_ASYNC\",\"nccl_num_channels\":\"16\"}}" > decode$((i+1)).log 2>&1 &
        PIDS+=($!)
    done

    # =============================================================================
    # Wait for All Servers to Start
    # =============================================================================
    echo ""
    echo "Waiting for all servers to start..."
    for port in "${PREFILL_PORT_ARRAY[@]}" "${DECODE_PORT_ARRAY[@]}"; do
        if ! wait_for_server $port; then
            echo "Failed to start server on port $port"
            cleanup
            exit 1
        fi
    done

    echo ""
    echo "All servers are up. Starting benchmark..."

    # =============================================================================
    # Run Benchmark
    # =============================================================================
    cd ../../../benchmarks/
    vllm bench serve --port 10001 --seed $(date +%s) \
        --model $MODEL \
        --dataset-name random --random-input-len 7500 --random-output-len 200 \
        --num-prompts 200 --burstiness 100 --request-rate 2 | tee benchmark.log

    echo "Benchmarking done. Cleaning up..."

    cleanup
}

main
```

Example 2 (bash):
```bash
#!/bin/bash

# =============================================================================
# vLLM Disaggregated Serving Script - P2P NCCL XpYd Architecture
# =============================================================================
# This script demonstrates disaggregated prefill and decode serving using
# P2P NCCL communication. The architecture supports various XpYd configurations:
#
# - 1P3D: 1 Prefill server + 3 Decode servers (current default)
# - 3P1D: 3 Prefill servers + 1 Decode server
# - etc.
#
# Configuration can be customized via environment variables:
#   MODEL: Model to serve
#   PREFILL_GPUS: Comma-separated GPU IDs for prefill servers
#   DECODE_GPUS: Comma-separated GPU IDs for decode servers
#   PREFILL_PORTS: Comma-separated ports for prefill servers
#   DECODE_PORTS: Comma-separated ports for decode servers
#   PROXY_PORT: Proxy server port used to setup XpYd connection.
#   TIMEOUT_SECONDS: Server startup timeout
# =============================================================================

# Configuration - can be overridden via environment variables
MODEL=${MODEL:-meta-llama/Llama-3.1-8B-Instruct}
TIMEOUT_SECONDS=${TIMEOUT_SECONDS:-1200}
PROXY_PORT=${PROXY_PORT:-30001}

# Default 1P3D configuration (1 Prefill + 3 Decode)
PREFILL_GPUS=${PREFILL_GPUS:-0}
DECODE_GPUS=${DECODE_GPUS:-1,2,3}
PREFILL_PORTS=${PREFILL_PORTS:-20003}
DECODE_PORTS=${DECODE_PORTS:-20005,20007,20009}

echo "Warning: P2P NCCL disaggregated prefill XpYd support for vLLM v1 is experimental and subject to change."
echo ""
echo "Architecture Configuration:"
echo "  Model: $MODEL"
echo "  Prefill GPUs: $PREFILL_GPUS, Ports: $PREFILL_PORTS"
echo "  Decode GPUs: $DECODE_GPUS, Ports: $DECODE_PORTS"
echo "  Proxy Port: $PROXY_PORT"
echo "  Timeout: ${TIMEOUT_SECONDS}s"
echo ""

PIDS=()

# Switch to the directory of the current script
cd "$(dirname "${BASH_SOURCE[0]}")"

check_required_files() {
    local files=("disagg_proxy_p2p_nccl_xpyd.py")
    for file in "${files[@]}"; do
        if [[ ! -f "$file" ]]; then
            echo "Required file $file not found in $(pwd)"
            exit 1
        fi
    done
}

check_hf_token() {
    if [ -z "$HF_TOKEN" ]; then
        echo "HF_TOKEN is not set. Please set it to your Hugging Face token."
        echo "Example: export HF_TOKEN=your_token_here"
        exit 1
    fi
    if [[ "$HF_TOKEN" != hf_* ]]; then
        echo "HF_TOKEN is not a valid Hugging Face token. Please set it to your Hugging Face token."
        exit 1
    fi
    echo "HF_TOKEN is set and valid."
}

check_num_gpus() {
    # Check if the number of GPUs are >=2 via nvidia-smi
    num_gpus=$(nvidia-smi --query-gpu=name --format=csv,noheader | wc -l)
    if [ "$num_gpus" -lt 2 ]; then
        echo "You need at least 2 GPUs to run disaggregated prefill."
        exit 1
    else
        echo "Found $num_gpus GPUs."
    fi
}

ensure_python_library_installed() {
    echo "Checking if $1 is installed..."
    if ! python3 -c "import $1" > /dev/null 2>&1; then
        echo "$1 is not installed. Please install it via pip install $1."
        exit 1
    else
        echo "$1 is installed."
    fi
}

cleanup() {
    echo "Stopping everything…"
    trap - INT TERM        # prevent re-entrancy
    pkill -9 -f "disagg_proxy_p2p_nccl_xpyd.py"
    kill -- -$$            # negative PID  ==  "this whole process-group"
    wait                   # reap children so we don't leave zombies
    exit 0
}

wait_for_server() {
  local port=$1
  local timeout_seconds=$TIMEOUT_SECONDS
  local start_time=$(date +%s)

  echo "Waiting for server on port $port..."

  while true; do
    if curl -s "localhost:${port}/v1/completions" > /dev/null; then
      echo "Server on port $port is ready."
      return 0
    fi

    local now=$(date +%s)
    if (( now - start_time >= timeout_seconds )); then
      echo "Timeout waiting for server on port $port"
      return 1
    fi

    sleep 1
  done
}

main() {
    check_required_files
    check_hf_token
    check_num_gpus
    ensure_python_library_installed pandas
    ensure_python_library_installed datasets
    ensure_python_library_installed vllm
    ensure_python_library_installed quart

    trap cleanup INT
    trap cleanup USR1
    trap cleanup TERM

    echo "Launching disaggregated serving components..."
    echo "Please check the log files for detailed output:"
    echo "  - prefill*.log: Prefill server logs"
    echo "  - decode*.log: Decode server logs"
    echo "  - proxy.log: Proxy server log"

    # =============================================================================
    # Launch Proxy Server
    # =============================================================================
    echo ""
    echo "Starting proxy server on port $PROXY_PORT..."
    python3 disagg_proxy_p2p_nccl_xpyd.py &
    PIDS+=($!)

    # Parse GPU and port arrays
    IFS=',' read -ra PREFILL_GPU_ARRAY <<< "$PREFILL_GPUS"
    IFS=',' read -ra DECODE_GPU_ARRAY <<< "$DECODE_GPUS"
    IFS=',' read -ra PREFILL_PORT_ARRAY <<< "$PREFILL_PORTS"
    IFS=',' read -ra DECODE_PORT_ARRAY <<< "$DECODE_PORTS"

    # =============================================================================
    # Launch Prefill Servers (X Producers)
    # =============================================================================
    echo ""
    echo "Starting ${#PREFILL_GPU_ARRAY[@]} prefill server(s)..."
    for i in "${!PREFILL_GPU_ARRAY[@]}"; do
        local gpu_id=${PREFILL_GPU_ARRAY[$i]}
        local port=${PREFILL_PORT_ARRAY[$i]}
        local kv_port=$((21001 + i))

        echo "  Prefill server $((i+1)): GPU $gpu_id, Port $port, KV Port $kv_port"
        CUDA_VISIBLE_DEVICES=$gpu_id vllm serve $MODEL \
        --enforce-eager \
        --host 0.0.0.0 \
        --port $port \
        --tensor-parallel-size 1 \
        --seed 1024 \
        --dtype float16 \
        --max-model-len 10000 \
        --max-num-batched-tokens 10000 \
        --max-num-seqs 256 \
        --trust-remote-code \
        --gpu-memory-utilization 0.9 \
        --kv-transfer-config \
        "{\"kv_connector\":\"P2pNcclConnector\",\"kv_role\":\"kv_producer\",\"kv_buffer_size\":\"1e1\",\"kv_port\":\"$kv_port\",\"kv_connector_extra_config\":{\"proxy_ip\":\"0.0.0.0\",\"proxy_port\":\"$PROXY_PORT\",\"http_port\":\"$port\",\"send_type\":\"PUT_ASYNC\",\"nccl_num_channels\":\"16\"}}" > prefill$((i+1)).log 2>&1 &
        PIDS+=($!)
    done

    # =============================================================================
    # Launch Decode Servers (Y Decoders)
    # =============================================================================
    echo ""
    echo "Starting ${#DECODE_GPU_ARRAY[@]} decode server(s)..."
    for i in "${!DECODE_GPU_ARRAY[@]}"; do
        local gpu_id=${DECODE_GPU_ARRAY[$i]}
        local port=${DECODE_PORT_ARRAY[$i]}
        local kv_port=$((22001 + i))

        echo "  Decode server $((i+1)): GPU $gpu_id, Port $port, KV Port $kv_port"
        CUDA_VISIBLE_DEVICES=$gpu_id vllm serve $MODEL \
        --enforce-eager \
        --host 0.0.0.0 \
        --port $port \
        --tensor-parallel-size 1 \
        --seed 1024 \
        --dtype float16 \
        --max-model-len 10000 \
        --max-num-batched-tokens 10000 \
        --max-num-seqs 256 \
        --trust-remote-code \
        --gpu-memory-utilization 0.7 \
        --kv-transfer-config \
        "{\"kv_connector\":\"P2pNcclConnector\",\"kv_role\":\"kv_consumer\",\"kv_buffer_size\":\"8e9\",\"kv_port\":\"$kv_port\",\"kv_connector_extra_config\":{\"proxy_ip\":\"0.0.0.0\",\"proxy_port\":\"$PROXY_PORT\",\"http_port\":\"$port\",\"send_type\":\"PUT_ASYNC\",\"nccl_num_channels\":\"16\"}}" > decode$((i+1)).log 2>&1 &
        PIDS+=($!)
    done

    # =============================================================================
    # Wait for All Servers to Start
    # =============================================================================
    echo ""
    echo "Waiting for all servers to start..."
    for port in "${PREFILL_PORT_ARRAY[@]}" "${DECODE_PORT_ARRAY[@]}"; do
        if ! wait_for_server $port; then
            echo "Failed to start server on port $port"
            cleanup
            exit 1
        fi
    done

    echo ""
    echo "All servers are up. Starting benchmark..."

    # =============================================================================
    # Run Benchmark
    # =============================================================================
    cd ../../../benchmarks/
    vllm bench serve --port 10001 --seed $(date +%s) \
        --model $MODEL \
        --dataset-name random --random-input-len 7500 --random-output-len 200 \
        --num-prompts 200 --burstiness 100 --request-rate 2 | tee benchmark.log

    echo "Benchmarking done. Cleaning up..."

    cleanup
}

main
```

Example 3 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import os
import socket
import threading
import time
import uuid
from typing import Any

import aiohttp
import msgpack
import zmq
from quart import Quart, make_response, request

count = 0
prefill_instances: dict[str, Any] = {}  # http_address: (zmq_address, stamp)
decode_instances: dict[str, Any] = {}  # http_address: (zmq_address, stamp)

prefill_cv = threading.Condition()
decode_cv = threading.Condition()

DEFAULT_PING_SECONDS = 5


def _remove_oldest_instances(instances: dict[str, Any]) -> None:
    oldest_key = next(iter(instances), None)
    while oldest_key is not None:
        value = instances[oldest_key]
        if value[1] > time.time():
            break
        print(f"🔴Remove [HTTP:{oldest_key}, ZMQ:{value[0]}, stamp:{value[1]}]")
        instances.pop(oldest_key, None)
        oldest_key = next(iter(instances), None)


def _listen_for_register(poller, router_socket):
    while True:
        socks = dict(poller.poll())
        if router_socket in socks:
            remote_address, message = router_socket.recv_multipart()
            # data: {"type": "P", "http_address": "ip:port",
            #        "zmq_address": "ip:port"}
            data = msgpack.loads(message)
            if data["type"] == "P":
                global prefill_instances
                global prefill_cv
                with prefill_cv:
                    node = prefill_instances.get(data["http_address"], None)
                    prefill_instances[data["http_address"]] = (
                        data["zmq_address"],
                        time.time() + DEFAULT_PING_SECONDS,
                    )
                    _remove_oldest_instances(prefill_instances)

            elif data["type"] == "D":
                global decode_instances
                global decode_cv
                with decode_cv:
                    node = decode_instances.get(data["http_address"], None)
                    decode_instances[data["http_address"]] = (
                        data["zmq_address"],
                        time.time() + DEFAULT_PING_SECONDS,
                    )
                    _remove_oldest_instances(decode_instances)
            else:
                print(
                    "Unexpected, Received message from %s, data: %s",
                    remote_address,
                    data,
                )
                return

            if node is None:
                print(f"🔵Add [HTTP:{data['http_address']}, ZMQ:{data['zmq_address']}]")


def start_service_discovery(hostname, port):
    if not hostname:
        hostname = socket.gethostname()
    if port == 0:
        raise ValueError("Port cannot be 0")

    context = zmq.Context()
    router_socket = context.socket(zmq.ROUTER)
    router_socket.bind(f"tcp://{hostname}:{port}")

    poller = zmq.Poller()
    poller.register(router_socket, zmq.POLLIN)

    _listener_thread = threading.Thread(
        target=_listen_for_register, args=[poller, router_socket], daemon=True
    )
    _listener_thread.start()
    return _listener_thread


AIOHTTP_TIMEOUT = aiohttp.ClientTimeout(total=6 * 60 * 60)

app = Quart(__name__)


def random_uuid() -> str:
    return str(uuid.uuid4().hex)


async def forward_request(url, data, request_id):
    async with aiohttp.ClientSession(timeout=AIOHTTP_TIMEOUT) as session:
        headers = {
            "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}",
            "X-Request-Id": request_id,
        }
        async with session.post(url=url, json=data, headers=headers) as response:
            if response.status == 200:
                if True:
                    async for chunk_bytes in response.content.iter_chunked(1024):
                        yield chunk_bytes
                else:
                    content = await response.read()
                    yield content


@app.route("/v1/completions", methods=["POST"])
@app.route("/v1/chat/completions", methods=["POST"])
async def handle_request():
    try:
        original_request_data = await request.get_json()

        prefill_request = original_request_data.copy()
        # change max_tokens = 1 to let it only do prefill
        prefill_request["max_tokens"] = 1
        if "max_completion_tokens" in prefill_request:
            prefill_request["max_completion_tokens"] = 1

        global count
        global prefill_instances
        global prefill_cv
        with prefill_cv:
            prefill_list = list(prefill_instances.items())
            prefill_addr, prefill_zmq_addr = prefill_list[count % len(prefill_list)]
            prefill_zmq_addr = prefill_zmq_addr[0]

        global decode_instances
        global decode_cv
        with decode_cv:
            decode_list = list(decode_instances.items())
            decode_addr, decode_zmq_addr = decode_list[count % len(decode_list)]
            decode_zmq_addr = decode_zmq_addr[0]

        print(
            f"handle_request count: {count}, [HTTP:{prefill_addr}, "
            f"ZMQ:{prefill_zmq_addr}] 👉 [HTTP:{decode_addr}, "
            f"ZMQ:{decode_zmq_addr}]"
        )
        count += 1

        request_id = (
            f"___prefill_addr_{prefill_zmq_addr}___decode_addr_"
            f"{decode_zmq_addr}_{random_uuid()}"
        )

        # finish prefill
        async for _ in forward_request(
            f"http://{prefill_addr}{request.path}", prefill_request, request_id
        ):
            continue

        # return decode
        generator = forward_request(
            f"http://{decode_addr}{request.path}", original_request_data, request_id
        )
        response = await make_response(generator)
        response.timeout = None

        return response

    except Exception as e:
        import sys
        import traceback

        exc_info = sys.exc_info()
        print("Error occurred in disagg prefill proxy server")
        print(e)
        print("".join(traceback.format_exception(*exc_info)))


if __name__ == "__main__":
    t = start_service_discovery("0.0.0.0", 30001)
    app.run(host="0.0.0.0", port=10001)
    t.join()
```

Example 4 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import os
import socket
import threading
import time
import uuid
from typing import Any

import aiohttp
import msgpack
import zmq
from quart import Quart, make_response, request

count = 0
prefill_instances: dict[str, Any] = {}  # http_address: (zmq_address, stamp)
decode_instances: dict[str, Any] = {}  # http_address: (zmq_address, stamp)

prefill_cv = threading.Condition()
decode_cv = threading.Condition()

DEFAULT_PING_SECONDS = 5


def _remove_oldest_instances(instances: dict[str, Any]) -> None:
    oldest_key = next(iter(instances), None)
    while oldest_key is not None:
        value = instances[oldest_key]
        if value[1] > time.time():
            break
        print(f"🔴Remove [HTTP:{oldest_key}, ZMQ:{value[0]}, stamp:{value[1]}]")
        instances.pop(oldest_key, None)
        oldest_key = next(iter(instances), None)


def _listen_for_register(poller, router_socket):
    while True:
        socks = dict(poller.poll())
        if router_socket in socks:
            remote_address, message = router_socket.recv_multipart()
            # data: {"type": "P", "http_address": "ip:port",
            #        "zmq_address": "ip:port"}
            data = msgpack.loads(message)
            if data["type"] == "P":
                global prefill_instances
                global prefill_cv
                with prefill_cv:
                    node = prefill_instances.get(data["http_address"], None)
                    prefill_instances[data["http_address"]] = (
                        data["zmq_address"],
                        time.time() + DEFAULT_PING_SECONDS,
                    )
                    _remove_oldest_instances(prefill_instances)

            elif data["type"] == "D":
                global decode_instances
                global decode_cv
                with decode_cv:
                    node = decode_instances.get(data["http_address"], None)
                    decode_instances[data["http_address"]] = (
                        data["zmq_address"],
                        time.time() + DEFAULT_PING_SECONDS,
                    )
                    _remove_oldest_instances(decode_instances)
            else:
                print(
                    "Unexpected, Received message from %s, data: %s",
                    remote_address,
                    data,
                )
                return

            if node is None:
                print(f"🔵Add [HTTP:{data['http_address']}, ZMQ:{data['zmq_address']}]")


def start_service_discovery(hostname, port):
    if not hostname:
        hostname = socket.gethostname()
    if port == 0:
        raise ValueError("Port cannot be 0")

    context = zmq.Context()
    router_socket = context.socket(zmq.ROUTER)
    router_socket.bind(f"tcp://{hostname}:{port}")

    poller = zmq.Poller()
    poller.register(router_socket, zmq.POLLIN)

    _listener_thread = threading.Thread(
        target=_listen_for_register, args=[poller, router_socket], daemon=True
    )
    _listener_thread.start()
    return _listener_thread


AIOHTTP_TIMEOUT = aiohttp.ClientTimeout(total=6 * 60 * 60)

app = Quart(__name__)


def random_uuid() -> str:
    return str(uuid.uuid4().hex)


async def forward_request(url, data, request_id):
    async with aiohttp.ClientSession(timeout=AIOHTTP_TIMEOUT) as session:
        headers = {
            "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}",
            "X-Request-Id": request_id,
        }
        async with session.post(url=url, json=data, headers=headers) as response:
            if response.status == 200:
                if True:
                    async for chunk_bytes in response.content.iter_chunked(1024):
                        yield chunk_bytes
                else:
                    content = await response.read()
                    yield content


@app.route("/v1/completions", methods=["POST"])
@app.route("/v1/chat/completions", methods=["POST"])
async def handle_request():
    try:
        original_request_data = await request.get_json()

        prefill_request = original_request_data.copy()
        # change max_tokens = 1 to let it only do prefill
        prefill_request["max_tokens"] = 1
        if "max_completion_tokens" in prefill_request:
            prefill_request["max_completion_tokens"] = 1

        global count
        global prefill_instances
        global prefill_cv
        with prefill_cv:
            prefill_list = list(prefill_instances.items())
            prefill_addr, prefill_zmq_addr = prefill_list[count % len(prefill_list)]
            prefill_zmq_addr = prefill_zmq_addr[0]

        global decode_instances
        global decode_cv
        with decode_cv:
            decode_list = list(decode_instances.items())
            decode_addr, decode_zmq_addr = decode_list[count % len(decode_list)]
            decode_zmq_addr = decode_zmq_addr[0]

        print(
            f"handle_request count: {count}, [HTTP:{prefill_addr}, "
            f"ZMQ:{prefill_zmq_addr}] 👉 [HTTP:{decode_addr}, "
            f"ZMQ:{decode_zmq_addr}]"
        )
        count += 1

        request_id = (
            f"___prefill_addr_{prefill_zmq_addr}___decode_addr_"
            f"{decode_zmq_addr}_{random_uuid()}"
        )

        # finish prefill
        async for _ in forward_request(
            f"http://{prefill_addr}{request.path}", prefill_request, request_id
        ):
            continue

        # return decode
        generator = forward_request(
            f"http://{decode_addr}{request.path}", original_request_data, request_id
        )
        response = await make_response(generator)
        response.timeout = None

        return response

    except Exception as e:
        import sys
        import traceback

        exc_info = sys.exc_info()
        print("Error occurred in disagg prefill proxy server")
        print(e)
        print("".join(traceback.format_exception(*exc_info)))


if __name__ == "__main__":
    t = start_service_discovery("0.0.0.0", 30001)
    app.run(host="0.0.0.0", port=10001)
    t.join()
```

---

## Disaggregated Serving - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_serving/

**Contents:**
- Disaggregated Serving¶
- Files¶
- Example materials¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/disaggregated_serving.

This example contains scripts that demonstrate the disaggregated serving features of vLLM.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This file provides a disaggregated prefilling proxy demo to demonstrate an
example usage of XpYd disaggregated prefilling.
We can launch multiple vllm instances (2 for prefill and 2 for decode), and
launch this proxy demo through:
  python3 examples/online_serving/disaggregated_serving/disagg_proxy_demo.py  \
       --model $model_name  \
       --prefill localhost:8100 localhost:8101   \
       --decode localhost:8200 localhost:8201   \
       --port 8000

Note: This demo will be removed once the PDController implemented in PR 15343
(https://github.com/vllm-project/vllm/pull/15343) supports XpYd.
"""

import argparse
import ipaddress
import itertools
import json
import logging
import os
import sys
from abc import ABC, abstractmethod
from collections.abc import Callable

import aiohttp
import requests
import uvicorn
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse, StreamingResponse

AIOHTTP_TIMEOUT = aiohttp.ClientTimeout(total=6 * 60 * 60)
logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)


class SchedulingPolicy(ABC):
    @abstractmethod
    def schedule(self, cycler: itertools.cycle):
        raise NotImplementedError("Scheduling Proxy is not set.")


class Proxy:
    def __init__(
        self,
        prefill_instances: list[str],
        decode_instances: list[str],
        model: str,
        scheduling_policy: SchedulingPolicy,
        custom_create_completion: Callable[[Request], StreamingResponse] | None = None,
        custom_create_chat_completion: Callable[[Request], StreamingResponse]
        | None = None,
    ):
        self.prefill_instances = prefill_instances
        self.decode_instances = decode_instances
        self.prefill_cycler = itertools.cycle(prefill_instances)
        self.decode_cycler = itertools.cycle(decode_instances)
        self.model = model
        self.scheduling_policy = scheduling_policy
        self.custom_create_completion = custom_create_completion
        self.custom_create_chat_completion = custom_create_chat_completion
        self.router = APIRouter()
        self.setup_routes()

    def setup_routes(self):
        self.router.post(
            "/v1/completions", dependencies=[Depends(self.validate_json_request)]
        )(
            self.custom_create_completion
            if self.custom_create_completion
            else self.create_completion
        )
        self.router.post(
            "/v1/chat/completions", dependencies=[Depends(self.validate_json_request)]
        )(
            self.custom_create_chat_completion
            if self.custom_create_chat_completion
            else self.create_chat_completion
        )
        self.router.get("/status", response_class=JSONResponse)(self.get_status)
        self.router.post(
            "/instances/add", dependencies=[Depends(self.api_key_authenticate)]
        )(self.add_instance_endpoint)

    async def validate_json_request(self, raw_request: Request):
        content_type = raw_request.headers.get("content-type", "").lower()
        if content_type != "application/json":
            raise HTTPException(
                status_code=415,
                detail="Unsupported Media Type: Only 'application/json' is allowed",
            )

    def api_key_authenticate(self, x_api_key: str = Header(...)):
        expected_api_key = os.environ.get("ADMIN_API_KEY")
        if not expected_api_key:
            logger.error("ADMIN_API_KEY is not set in the environment.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server configuration error.",
            )
        if x_api_key != expected_api_key:
            logger.warning("Unauthorized access attempt with API Key: %s", x_api_key)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: Invalid API Key.",
            )

    async def validate_instance(self, instance: str) -> bool:
        url = f"http://{instance}/v1/models"
        try:
            async with aiohttp.ClientSession(timeout=AIOHTTP_TIMEOUT) as client:
                logger.info("Verifying %s ...", instance)
                async with client.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        if "data" in data and len(data["data"]) > 0:
                            model_cur = data["data"][0].get("id", "")
                            if model_cur == self.model:
                                logger.info("Instance: %s could be added.", instance)
                                return True
                            else:
                                logger.warning(
                                    "Mismatch model %s : %s != %s",
                                    instance,
                                    model_cur,
                                    self.model,
                                )
                                return False
                        else:
                            return False
                    else:
                        return False
        except aiohttp.ClientError as e:
            logger.error(str(e))
            return False
        except Exception as e:
            logger.error(str(e))
            return False

    async def add_instance_endpoint(self, request: Request):
        try:
            data = await request.json()
            logger.warning(str(data))
            instance_type = data.get("type")
            instance = data.get("instance")
            if instance_type not in ["prefill", "decode"]:
                raise HTTPException(status_code=400, detail="Invalid instance type.")
            if not instance or ":" not in instance:
                raise HTTPException(status_code=400, detail="Invalid instance format.")
            host, port_str = instance.split(":")
            try:
                if host != "localhost":
                    ipaddress.ip_address(host)
                port = int(port_str)
                if not (0 < port < 65536):
                    raise HTTPException(status_code=400, detail="Invalid port number.")
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail="Invalid instance address."
                ) from e

            is_valid = await self.validate_instance(instance)
            if not is_valid:
                raise HTTPException(
                    status_code=400, detail="Instance validation failed."
                )

            if instance_type == "prefill":
                if instance not in self.prefill_instances:
                    self.prefill_instances.append(instance)
                    self.prefill_cycler = itertools.cycle(self.prefill_instances)
                else:
                    raise HTTPException(
                        status_code=400, detail="Instance already exists."
                    )
            else:
                if instance not in self.decode_instances:
                    self.decode_instances.append(instance)
                    self.decode_cycler = itertools.cycle(self.decode_instances)
                else:
                    raise HTTPException(
                        status_code=400, detail="Instance already exists."
                    )

            return JSONResponse(
                content={"message": f"Added {instance} to {instance_type}_instances."}
            )
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            logger.error("Error in add_instance_endpoint: %s", str(e))
            raise HTTPException(status_code=500, detail=str(e)) from e

    async def forward_request(self, url, data, use_chunked=True):
        async with aiohttp.ClientSession(timeout=AIOHTTP_TIMEOUT) as session:
            headers = {"Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}"}
            try:
                async with session.post(
                    url=url, json=data, headers=headers
                ) as response:
                    if 200 <= response.status < 300 or 400 <= response.status < 500:
                        if use_chunked:
                            async for chunk_bytes in response.content.iter_chunked(
                                1024
                            ):
                                yield chunk_bytes
                        else:
                            content = await response.read()
                            yield content
                    else:
                        error_content = await response.text()
                        try:
                            error_content = json.loads(error_content)
                        except json.JSONDecodeError:
                            error_content = error_content
                        logger.error(
                            "Request failed with status %s: %s",
                            response.status,
                            error_content,
                        )
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Request failed with status {response.status}: "
                            f"{error_content}",
                        )
            except aiohttp.ClientError as e:
                logger.error("ClientError occurred: %s", str(e))
                raise HTTPException(
                    status_code=502,
                    detail="Bad Gateway: Error communicating with upstream server.",
                ) from e
            except Exception as e:
                logger.error("Unexpected error: %s", str(e))
                raise HTTPException(status_code=500, detail=str(e)) from e

    def schedule(self, cycler: itertools.cycle) -> str:
        return self.scheduling_policy.schedule(cycler)

    async def get_status(self):
        status = {
            "prefill_node_count": len(self.prefill_instances),
            "decode_node_count": len(self.decode_instances),
            "prefill_nodes": self.prefill_instances,
            "decode_nodes": self.decode_instances,
        }
        return status

    async def create_completion(self, raw_request: Request):
        try:
            request = await raw_request.json()

            kv_prepare_request = request.copy()
            kv_prepare_request["max_tokens"] = 1

            prefill_instance = self.schedule(self.prefill_cycler)
            try:
                async for _ in self.forward_request(
                    f"http://{prefill_instance}/v1/completions", kv_prepare_request
                ):
                    continue
            except HTTPException as http_exc:
                self.remove_instance_endpoint("prefill", prefill_instance)
                raise http_exc

            # Perform kv recv and decoding stage
            decode_instance = self.schedule(self.decode_cycler)

            try:
                generator = self.forward_request(
                    f"http://{decode_instance}/v1/completions", request
                )
            except HTTPException as http_exc:
                self.remove_instance_endpoint("decode", decode_instance)
                raise http_exc
            response = StreamingResponse(generator)
            return response
        except Exception:
            import sys

            exc_info = sys.exc_info()
            print("Error occurred in disagg proxy server")
            print(exc_info)

    async def create_chat_completion(self, raw_request: Request):
        try:
            request = await raw_request.json()

            # add params to request
            kv_prepare_request = request.copy()
            kv_prepare_request["max_tokens"] = 1
            if "max_completion_tokens" in kv_prepare_request:
                kv_prepare_request["max_completion_tokens"] = 1

            # prefill stage
            prefill_instance = self.schedule(self.prefill_cycler)
            try:
                async for _ in self.forward_request(
                    f"http://{prefill_instance}/v1/chat/completions", kv_prepare_request
                ):
                    continue
            except HTTPException as http_exc:
                self.remove_instance_endpoint("prefill", prefill_instance)
                raise http_exc
            # Perform kv recv and decoding stage
            decode_instance = self.schedule(self.decode_cycler)

            try:
                generator = self.forward_request(
                    "http://" + decode_instance + "/v1/chat/completions", request
                )
            except HTTPException as http_exc:
                self.remove_instance_endpoint("decode", decode_instance)
                raise http_exc
            response = StreamingResponse(content=generator)
            return response
        except Exception:
            exc_info = sys.exc_info()
            error_messages = [str(e) for e in exc_info if e]
            print("Error occurred in disagg proxy server")
            print(error_messages)
            return StreamingResponse(
                content=iter(error_messages), media_type="text/event-stream"
            )

    def remove_instance_endpoint(self, instance_type, instance):
        if instance_type == "decode" and instance in self.decode_instances:
            self.decode_instances.remove(instance)
            self.decode_cycler = itertools.cycle(self.decode_instances)
        if instance_type == "prefill" and instance in self.decode_instances:
            self.prefill_instances.remove(instance)
            self.prefill_cycler = itertools.cycle(self.decode_instances)


class RoundRobinSchedulingPolicy(SchedulingPolicy):
    def __init__(self):
        super().__init__()

    def schedule(self, cycler: itertools.cycle) -> str:
        return next(cycler)


class ProxyServer:
    def __init__(
        self,
        args: argparse.Namespace,
        scheduling_policy: SchedulingPolicy | None = None,
        create_completion: Callable[[Request], StreamingResponse] | None = None,
        create_chat_completion: Callable[[Request], StreamingResponse] | None = None,
    ):
        self.validate_parsed_serve_args(args)
        self.port = args.port
        self.proxy_instance = Proxy(
            prefill_instances=[] if args.prefill is None else args.prefill,
            decode_instances=[] if args.decode is None else args.decode,
            model=args.model,
            scheduling_policy=(
                scheduling_policy
                if scheduling_policy is not None
                else RoundRobinSchedulingPolicy()
            ),
            custom_create_completion=create_completion,
            custom_create_chat_completion=create_chat_completion,
        )

    def validate_parsed_serve_args(self, args: argparse.Namespace):
        if not args.prefill:
            raise ValueError("Please specify at least one prefill node.")
        if not args.decode:
            raise ValueError("Please specify at least one decode node.")
        self.validate_instances(args.prefill)
        self.validate_instances(args.decode)
        self.verify_model_config(args.prefill, args.model)
        self.verify_model_config(args.decode, args.model)

    def validate_instances(self, instances: list):
        for instance in instances:
            if len(instance.split(":")) != 2:
                raise ValueError(f"Invalid instance format: {instance}")
            host, port = instance.split(":")
            try:
                if host != "localhost":
                    ipaddress.ip_address(host)
                port = int(port)
                if not (0 < port < 65536):
                    raise ValueError(f"Invalid port number in instance: {instance}")
            except Exception as e:
                raise ValueError(f"Invalid instance {instance}: {str(e)}") from e

    def verify_model_config(self, instances: list, model: str) -> None:
        model_suffix = model.split("/")[-1]
        for instance in instances:
            try:
                response = requests.get(f"http://{instance}/v1/models")
                if response.status_code == 200:
                    model_cur = response.json()["data"][0]["id"]
                    model_cur_suffix = model_cur.split("/")[-1]
                    if model_cur_suffix != model_suffix:
                        raise ValueError(
                            f"{instance} serves a different model: "
                            f"{model_cur} != {model}"
                        )
                else:
                    raise ValueError(f"Cannot get model id from {instance}!")
            except requests.RequestException as e:
                raise ValueError(
                    f"Error communicating with {instance}: {str(e)}"
                ) from e

    def run_server(self):
        app = FastAPI()
        app.include_router(self.proxy_instance.router)
        config = uvicorn.Config(app, port=self.port, loop="uvloop")
        server = uvicorn.Server(config)
        server.run()


def parse_args():
    # Todo: allow more config
    parser = argparse.ArgumentParser("vLLM disaggregated proxy server.")
    parser.add_argument("--model", "-m", type=str, required=True, help="Model name")

    parser.add_argument(
        "--prefill",
        "-p",
        type=str,
        nargs="+",
        help="List of prefill node URLs (host:port)",
    )

    parser.add_argument(
        "--decode",
        "-d",
        type=str,
        nargs="+",
        help="List of decode node URLs (host:port)",
    )

    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Server port number",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    proxy_server = ProxyServer(args=args)
    proxy_server.run_server()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This file provides a disaggregated prefilling proxy demo to demonstrate an
example usage of XpYd disaggregated prefilling.
We can launch multiple vllm instances (2 for prefill and 2 for decode), and
launch this proxy demo through:
  python3 examples/online_serving/disaggregated_serving/disagg_proxy_demo.py  \
       --model $model_name  \
       --prefill localhost:8100 localhost:8101   \
       --decode localhost:8200 localhost:8201   \
       --port 8000

Note: This demo will be removed once the PDController implemented in PR 15343
(https://github.com/vllm-project/vllm/pull/15343) supports XpYd.
"""

import argparse
import ipaddress
import itertools
import json
import logging
import os
import sys
from abc import ABC, abstractmethod
from collections.abc import Callable

import aiohttp
import requests
import uvicorn
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse, StreamingResponse

AIOHTTP_TIMEOUT = aiohttp.ClientTimeout(total=6 * 60 * 60)
logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)


class SchedulingPolicy(ABC):
    @abstractmethod
    def schedule(self, cycler: itertools.cycle):
        raise NotImplementedError("Scheduling Proxy is not set.")


class Proxy:
    def __init__(
        self,
        prefill_instances: list[str],
        decode_instances: list[str],
        model: str,
        scheduling_policy: SchedulingPolicy,
        custom_create_completion: Callable[[Request], StreamingResponse] | None = None,
        custom_create_chat_completion: Callable[[Request], StreamingResponse]
        | None = None,
    ):
        self.prefill_instances = prefill_instances
        self.decode_instances = decode_instances
        self.prefill_cycler = itertools.cycle(prefill_instances)
        self.decode_cycler = itertools.cycle(decode_instances)
        self.model = model
        self.scheduling_policy = scheduling_policy
        self.custom_create_completion = custom_create_completion
        self.custom_create_chat_completion = custom_create_chat_completion
        self.router = APIRouter()
        self.setup_routes()

    def setup_routes(self):
        self.router.post(
            "/v1/completions", dependencies=[Depends(self.validate_json_request)]
        )(
            self.custom_create_completion
            if self.custom_create_completion
            else self.create_completion
        )
        self.router.post(
            "/v1/chat/completions", dependencies=[Depends(self.validate_json_request)]
        )(
            self.custom_create_chat_completion
            if self.custom_create_chat_completion
            else self.create_chat_completion
        )
        self.router.get("/status", response_class=JSONResponse)(self.get_status)
        self.router.post(
            "/instances/add", dependencies=[Depends(self.api_key_authenticate)]
        )(self.add_instance_endpoint)

    async def validate_json_request(self, raw_request: Request):
        content_type = raw_request.headers.get("content-type", "").lower()
        if content_type != "application/json":
            raise HTTPException(
                status_code=415,
                detail="Unsupported Media Type: Only 'application/json' is allowed",
            )

    def api_key_authenticate(self, x_api_key: str = Header(...)):
        expected_api_key = os.environ.get("ADMIN_API_KEY")
        if not expected_api_key:
            logger.error("ADMIN_API_KEY is not set in the environment.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server configuration error.",
            )
        if x_api_key != expected_api_key:
            logger.warning("Unauthorized access attempt with API Key: %s", x_api_key)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: Invalid API Key.",
            )

    async def validate_instance(self, instance: str) -> bool:
        url = f"http://{instance}/v1/models"
        try:
            async with aiohttp.ClientSession(timeout=AIOHTTP_TIMEOUT) as client:
                logger.info("Verifying %s ...", instance)
                async with client.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        if "data" in data and len(data["data"]) > 0:
                            model_cur = data["data"][0].get("id", "")
                            if model_cur == self.model:
                                logger.info("Instance: %s could be added.", instance)
                                return True
                            else:
                                logger.warning(
                                    "Mismatch model %s : %s != %s",
                                    instance,
                                    model_cur,
                                    self.model,
                                )
                                return False
                        else:
                            return False
                    else:
                        return False
        except aiohttp.ClientError as e:
            logger.error(str(e))
            return False
        except Exception as e:
            logger.error(str(e))
            return False

    async def add_instance_endpoint(self, request: Request):
        try:
            data = await request.json()
            logger.warning(str(data))
            instance_type = data.get("type")
            instance = data.get("instance")
            if instance_type not in ["prefill", "decode"]:
                raise HTTPException(status_code=400, detail="Invalid instance type.")
            if not instance or ":" not in instance:
                raise HTTPException(status_code=400, detail="Invalid instance format.")
            host, port_str = instance.split(":")
            try:
                if host != "localhost":
                    ipaddress.ip_address(host)
                port = int(port_str)
                if not (0 < port < 65536):
                    raise HTTPException(status_code=400, detail="Invalid port number.")
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail="Invalid instance address."
                ) from e

            is_valid = await self.validate_instance(instance)
            if not is_valid:
                raise HTTPException(
                    status_code=400, detail="Instance validation failed."
                )

            if instance_type == "prefill":
                if instance not in self.prefill_instances:
                    self.prefill_instances.append(instance)
                    self.prefill_cycler = itertools.cycle(self.prefill_instances)
                else:
                    raise HTTPException(
                        status_code=400, detail="Instance already exists."
                    )
            else:
                if instance not in self.decode_instances:
                    self.decode_instances.append(instance)
                    self.decode_cycler = itertools.cycle(self.decode_instances)
                else:
                    raise HTTPException(
                        status_code=400, detail="Instance already exists."
                    )

            return JSONResponse(
                content={"message": f"Added {instance} to {instance_type}_instances."}
            )
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            logger.error("Error in add_instance_endpoint: %s", str(e))
            raise HTTPException(status_code=500, detail=str(e)) from e

    async def forward_request(self, url, data, use_chunked=True):
        async with aiohttp.ClientSession(timeout=AIOHTTP_TIMEOUT) as session:
            headers = {"Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}"}
            try:
                async with session.post(
                    url=url, json=data, headers=headers
                ) as response:
                    if 200 <= response.status < 300 or 400 <= response.status < 500:
                        if use_chunked:
                            async for chunk_bytes in response.content.iter_chunked(
                                1024
                            ):
                                yield chunk_bytes
                        else:
                            content = await response.read()
                            yield content
                    else:
                        error_content = await response.text()
                        try:
                            error_content = json.loads(error_content)
                        except json.JSONDecodeError:
                            error_content = error_content
                        logger.error(
                            "Request failed with status %s: %s",
                            response.status,
                            error_content,
                        )
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Request failed with status {response.status}: "
                            f"{error_content}",
                        )
            except aiohttp.ClientError as e:
                logger.error("ClientError occurred: %s", str(e))
                raise HTTPException(
                    status_code=502,
                    detail="Bad Gateway: Error communicating with upstream server.",
                ) from e
            except Exception as e:
                logger.error("Unexpected error: %s", str(e))
                raise HTTPException(status_code=500, detail=str(e)) from e

    def schedule(self, cycler: itertools.cycle) -> str:
        return self.scheduling_policy.schedule(cycler)

    async def get_status(self):
        status = {
            "prefill_node_count": len(self.prefill_instances),
            "decode_node_count": len(self.decode_instances),
            "prefill_nodes": self.prefill_instances,
            "decode_nodes": self.decode_instances,
        }
        return status

    async def create_completion(self, raw_request: Request):
        try:
            request = await raw_request.json()

            kv_prepare_request = request.copy()
            kv_prepare_request["max_tokens"] = 1

            prefill_instance = self.schedule(self.prefill_cycler)
            try:
                async for _ in self.forward_request(
                    f"http://{prefill_instance}/v1/completions", kv_prepare_request
                ):
                    continue
            except HTTPException as http_exc:
                self.remove_instance_endpoint("prefill", prefill_instance)
                raise http_exc

            # Perform kv recv and decoding stage
            decode_instance = self.schedule(self.decode_cycler)

            try:
                generator = self.forward_request(
                    f"http://{decode_instance}/v1/completions", request
                )
            except HTTPException as http_exc:
                self.remove_instance_endpoint("decode", decode_instance)
                raise http_exc
            response = StreamingResponse(generator)
            return response
        except Exception:
            import sys

            exc_info = sys.exc_info()
            print("Error occurred in disagg proxy server")
            print(exc_info)

    async def create_chat_completion(self, raw_request: Request):
        try:
            request = await raw_request.json()

            # add params to request
            kv_prepare_request = request.copy()
            kv_prepare_request["max_tokens"] = 1
            if "max_completion_tokens" in kv_prepare_request:
                kv_prepare_request["max_completion_tokens"] = 1

            # prefill stage
            prefill_instance = self.schedule(self.prefill_cycler)
            try:
                async for _ in self.forward_request(
                    f"http://{prefill_instance}/v1/chat/completions", kv_prepare_request
                ):
                    continue
            except HTTPException as http_exc:
                self.remove_instance_endpoint("prefill", prefill_instance)
                raise http_exc
            # Perform kv recv and decoding stage
            decode_instance = self.schedule(self.decode_cycler)

            try:
                generator = self.forward_request(
                    "http://" + decode_instance + "/v1/chat/completions", request
                )
            except HTTPException as http_exc:
                self.remove_instance_endpoint("decode", decode_instance)
                raise http_exc
            response = StreamingResponse(content=generator)
            return response
        except Exception:
            exc_info = sys.exc_info()
            error_messages = [str(e) for e in exc_info if e]
            print("Error occurred in disagg proxy server")
            print(error_messages)
            return StreamingResponse(
                content=iter(error_messages), media_type="text/event-stream"
            )

    def remove_instance_endpoint(self, instance_type, instance):
        if instance_type == "decode" and instance in self.decode_instances:
            self.decode_instances.remove(instance)
            self.decode_cycler = itertools.cycle(self.decode_instances)
        if instance_type == "prefill" and instance in self.decode_instances:
            self.prefill_instances.remove(instance)
            self.prefill_cycler = itertools.cycle(self.decode_instances)


class RoundRobinSchedulingPolicy(SchedulingPolicy):
    def __init__(self):
        super().__init__()

    def schedule(self, cycler: itertools.cycle) -> str:
        return next(cycler)


class ProxyServer:
    def __init__(
        self,
        args: argparse.Namespace,
        scheduling_policy: SchedulingPolicy | None = None,
        create_completion: Callable[[Request], StreamingResponse] | None = None,
        create_chat_completion: Callable[[Request], StreamingResponse] | None = None,
    ):
        self.validate_parsed_serve_args(args)
        self.port = args.port
        self.proxy_instance = Proxy(
            prefill_instances=[] if args.prefill is None else args.prefill,
            decode_instances=[] if args.decode is None else args.decode,
            model=args.model,
            scheduling_policy=(
                scheduling_policy
                if scheduling_policy is not None
                else RoundRobinSchedulingPolicy()
            ),
            custom_create_completion=create_completion,
            custom_create_chat_completion=create_chat_completion,
        )

    def validate_parsed_serve_args(self, args: argparse.Namespace):
        if not args.prefill:
            raise ValueError("Please specify at least one prefill node.")
        if not args.decode:
            raise ValueError("Please specify at least one decode node.")
        self.validate_instances(args.prefill)
        self.validate_instances(args.decode)
        self.verify_model_config(args.prefill, args.model)
        self.verify_model_config(args.decode, args.model)

    def validate_instances(self, instances: list):
        for instance in instances:
            if len(instance.split(":")) != 2:
                raise ValueError(f"Invalid instance format: {instance}")
            host, port = instance.split(":")
            try:
                if host != "localhost":
                    ipaddress.ip_address(host)
                port = int(port)
                if not (0 < port < 65536):
                    raise ValueError(f"Invalid port number in instance: {instance}")
            except Exception as e:
                raise ValueError(f"Invalid instance {instance}: {str(e)}") from e

    def verify_model_config(self, instances: list, model: str) -> None:
        model_suffix = model.split("/")[-1]
        for instance in instances:
            try:
                response = requests.get(f"http://{instance}/v1/models")
                if response.status_code == 200:
                    model_cur = response.json()["data"][0]["id"]
                    model_cur_suffix = model_cur.split("/")[-1]
                    if model_cur_suffix != model_suffix:
                        raise ValueError(
                            f"{instance} serves a different model: "
                            f"{model_cur} != {model}"
                        )
                else:
                    raise ValueError(f"Cannot get model id from {instance}!")
            except requests.RequestException as e:
                raise ValueError(
                    f"Error communicating with {instance}: {str(e)}"
                ) from e

    def run_server(self):
        app = FastAPI()
        app.include_router(self.proxy_instance.router)
        config = uvicorn.Config(app, port=self.port, loop="uvloop")
        server = uvicorn.Server(config)
        server.run()


def parse_args():
    # Todo: allow more config
    parser = argparse.ArgumentParser("vLLM disaggregated proxy server.")
    parser.add_argument("--model", "-m", type=str, required=True, help="Model name")

    parser.add_argument(
        "--prefill",
        "-p",
        type=str,
        nargs="+",
        help="List of prefill node URLs (host:port)",
    )

    parser.add_argument(
        "--decode",
        "-d",
        type=str,
        nargs="+",
        help="List of decode node URLs (host:port)",
    )

    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Server port number",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    proxy_server = ProxyServer(args=args)
    proxy_server.run_server()
```

Example 3 (bash):
```bash
#!/bin/bash
# This file demonstrates the KV cache event publishing
# We will launch a vllm instances configured to publish KV cache
# events and launch a simple subscriber to log those events.

set -xe

echo "🚧🚧 Warning: The usage of KV cache events is experimental and subject to change 🚧🚧"
sleep 1

MODEL_NAME=${HF_MODEL_NAME:-meta-llama/Meta-Llama-3.1-8B-Instruct}

# Trap the SIGINT signal (triggered by Ctrl+C)
trap 'cleanup' INT

# Cleanup function
cleanup() {
    echo "Caught Ctrl+C, cleaning up..."
    # Cleanup commands
    pgrep python | xargs kill -9
    pkill -f python
    echo "Cleanup complete. Exiting."
    exit 0
}

export VLLM_HOST_IP=$(hostname -I | awk '{print $1}')

# a function that waits vLLM server to start
wait_for_server() {
  local port=$1
  timeout 1200 bash -c "
    until curl -s localhost:${port}/v1/completions > /dev/null; do
      sleep 1
    done" && return 0 || return 1
}

vllm serve $MODEL_NAME \
    --port 8100 \
    --max-model-len 100 \
    --enforce-eager \
    --gpu-memory-utilization 0.8 \
    --trust-remote-code \
    --kv-events-config \
    '{"enable_kv_cache_events": true, "publisher": "zmq", "topic": "kv-events"}' &

wait_for_server 8100

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

python3 "$SCRIPT_DIR/kv_events_subscriber.py" &
sleep 1

# serve two example requests
output1=$(curl -X POST -s http://localhost:8100/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "Explain quantum computing in simple terms a 5-year-old could understand.",
"max_tokens": 80,
"temperature": 0
}')

output2=$(curl -X POST -s http://localhost:8100/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "Explain quantum computing in simple terms a 50-year-old could understand.",
"max_tokens": 80,
"temperature": 0
}')

# Cleanup commands
pkill -9 -u "$USER" -f python
pkill -9 -u "$USER" -f vllm

sleep 1

echo "Cleaned up"

# Print the outputs of the curl requests
echo ""
echo "Output of first request: $output1"
echo "Output of second request: $output2"

echo "🎉🎉 Successfully finished 2 test requests! 🎉🎉"
echo ""
```

Example 4 (bash):
```bash
#!/bin/bash
# This file demonstrates the KV cache event publishing
# We will launch a vllm instances configured to publish KV cache
# events and launch a simple subscriber to log those events.

set -xe

echo "🚧🚧 Warning: The usage of KV cache events is experimental and subject to change 🚧🚧"
sleep 1

MODEL_NAME=${HF_MODEL_NAME:-meta-llama/Meta-Llama-3.1-8B-Instruct}

# Trap the SIGINT signal (triggered by Ctrl+C)
trap 'cleanup' INT

# Cleanup function
cleanup() {
    echo "Caught Ctrl+C, cleaning up..."
    # Cleanup commands
    pgrep python | xargs kill -9
    pkill -f python
    echo "Cleanup complete. Exiting."
    exit 0
}

export VLLM_HOST_IP=$(hostname -I | awk '{print $1}')

# a function that waits vLLM server to start
wait_for_server() {
  local port=$1
  timeout 1200 bash -c "
    until curl -s localhost:${port}/v1/completions > /dev/null; do
      sleep 1
    done" && return 0 || return 1
}

vllm serve $MODEL_NAME \
    --port 8100 \
    --max-model-len 100 \
    --enforce-eager \
    --gpu-memory-utilization 0.8 \
    --trust-remote-code \
    --kv-events-config \
    '{"enable_kv_cache_events": true, "publisher": "zmq", "topic": "kv-events"}' &

wait_for_server 8100

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

python3 "$SCRIPT_DIR/kv_events_subscriber.py" &
sleep 1

# serve two example requests
output1=$(curl -X POST -s http://localhost:8100/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "Explain quantum computing in simple terms a 5-year-old could understand.",
"max_tokens": 80,
"temperature": 0
}')

output2=$(curl -X POST -s http://localhost:8100/v1/completions \
-H "Content-Type: application/json" \
-d '{
"model": "'"$MODEL_NAME"'",
"prompt": "Explain quantum computing in simple terms a 50-year-old could understand.",
"max_tokens": 80,
"temperature": 0
}')

# Cleanup commands
pkill -9 -u "$USER" -f python
pkill -9 -u "$USER" -f vllm

sleep 1

echo "Cleaned up"

# Print the outputs of the curl requests
echo ""
echo "Output of first request: $output1"
echo "Output of second request: $output2"

echo "🎉🎉 Successfully finished 2 test requests! 🎉🎉"
echo ""
```

---

## Dockerfile - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/dockerfile/dockerfile/

**Contents:**
- Dockerfile¶

We provide a docker/Dockerfile to construct the image for running an OpenAI compatible server with vLLM. More information about deploying with Docker can be found here.

Below is a visual representation of the multi-stage Dockerfile. The build graph contains the following nodes:

The edges of the build graph represent:

FROM ... dependencies (with a solid line and a full arrow head)

COPY --from=... dependencies (with a dashed line and an empty arrow head)

RUN --mount=(.\*)from=... dependencies (with a dotted line and an empty diamond arrow head)

Made using: https://github.com/patrickhoefler/dockerfilegraph

Commands to regenerate the build graph (make sure to run it from the `root` directory of the vLLM repository where the dockerfile is present):

or in case you want to run it directly with the docker image:

(To run it for a different file, you can pass in a different argument to the flag --filename.)

**Examples:**

Example 1 (unknown):
```unknown
dockerfilegraph \
  -o png \
  --legend \
  --dpi 200 \
  --max-label-length 50 \
  --filename docker/Dockerfile
```

Example 2 (unknown):
```unknown
dockerfilegraph \
  -o png \
  --legend \
  --dpi 200 \
  --max-label-length 50 \
  --filename docker/Dockerfile
```

Example 3 (unknown):
```unknown
docker run \
   --rm \
   --user "$(id -u):$(id -g)" \
   --workdir /workspace \
   --volume "$(pwd)":/workspace \
   ghcr.io/patrickhoefler/dockerfilegraph:alpine \
   --output png \
   --dpi 200 \
   --max-label-length 50 \
   --filename docker/Dockerfile \
   --legend
```

Example 4 (unknown):
```unknown
docker run \
   --rm \
   --user "$(id -u):$(id -g)" \
   --workdir /workspace \
   --volume "$(pwd)":/workspace \
   ghcr.io/patrickhoefler/dockerfilegraph:alpine \
   --output png \
   --dpi 200 \
   --max-label-length 50 \
   --filename docker/Dockerfile \
   --legend
```

---

## dstack - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/dstack/

**Contents:**
- dstack¶

vLLM can be run on a cloud based GPU machine with dstack, an open-source framework for running LLMs on any cloud. This tutorial assumes that you have already configured credentials, gateway, and GPU quotas on your cloud environment.

To install dstack client, run:

Next, to configure your dstack project, run:

Next, to provision a VM instance with LLM of your choice (NousResearch/Llama-2-7b-chat-hf for this example), create the following serve.dstack.yml file for the dstack Service:

Then, run the following CLI for provisioning:

After the provisioning, you can interact with the model by using the OpenAI SDK:

dstack automatically handles authentication on the gateway using dstack's tokens. Meanwhile, if you don't want to configure a gateway, you can provision dstack Task instead of Service. The Task is for development purpose only. If you want to know more about hands-on materials how to serve vLLM using dstack, check out this repository

**Examples:**

Example 1 (unknown):
```unknown
pip install dstack[all]
dstack server
```

Example 2 (unknown):
```unknown
pip install dstack[all]
dstack server
```

Example 3 (unknown):
```unknown
mkdir -p vllm-dstack
cd vllm-dstack
dstack init
```

Example 4 (unknown):
```unknown
mkdir -p vllm-dstack
cd vllm-dstack
dstack init
```

---

## Elastic Ep - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/elastic_ep/

**Contents:**
- Elastic Ep¶
- Bench¶
- Scale¶
- Serve Deepseek V2¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/elastic_ep.

**Examples:**

Example 1 (bash):
```bash
#!/bin/bash

MODEL_NAME="deepseek-ai/DeepSeek-V2-Lite"
LOCAL_MODEL_PATH="/models/models--deepseek-ai--DeepSeek-V2-Lite/snapshots/604d5664dddd88a0433dbae533b7fe9472482de0"
HOST="localhost"
PORT=8006
NUM_PROMPTS=20
REQUEST_RATE=5

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --model)
            MODEL_NAME="$2"
            shift 2
            ;;
        --local-model)
            MODEL_NAME=$LOCAL_MODEL_PATH
            shift
            ;;
        --host)
            HOST="$2"
            shift 2
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --num-prompts)
            NUM_PROMPTS="$2"
            shift 2
            ;;
        --request-rate)
            REQUEST_RATE="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --model MODEL_NAME           Set model name or path (default: deepseek-ai/DeepSeek-V2-Lite)"
            echo "  --local-model                Use local model path (convenience option)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

vllm bench serve \
    --model $MODEL_NAME \
    --host $HOST \
    --port $PORT \
    --num-prompts $NUM_PROMPTS \
    --request-rate $REQUEST_RATE
```

Example 2 (bash):
```bash
#!/bin/bash

MODEL_NAME="deepseek-ai/DeepSeek-V2-Lite"
LOCAL_MODEL_PATH="/models/models--deepseek-ai--DeepSeek-V2-Lite/snapshots/604d5664dddd88a0433dbae533b7fe9472482de0"
HOST="localhost"
PORT=8006
NUM_PROMPTS=20
REQUEST_RATE=5

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --model)
            MODEL_NAME="$2"
            shift 2
            ;;
        --local-model)
            MODEL_NAME=$LOCAL_MODEL_PATH
            shift
            ;;
        --host)
            HOST="$2"
            shift 2
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --num-prompts)
            NUM_PROMPTS="$2"
            shift 2
            ;;
        --request-rate)
            REQUEST_RATE="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --model MODEL_NAME           Set model name or path (default: deepseek-ai/DeepSeek-V2-Lite)"
            echo "  --local-model                Use local model path (convenience option)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

vllm bench serve \
    --model $MODEL_NAME \
    --host $HOST \
    --port $PORT \
    --num-prompts $NUM_PROMPTS \
    --request-rate $REQUEST_RATE
```

Example 3 (python):
```python
#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import argparse
import json
import sys

import requests


def scale(host, port, new_dp_size):
    url = f"http://{host}:{port}/scale_elastic_ep"
    payload = {"new_data_parallel_size": new_dp_size}
    headers = {"Content-Type": "application/json"}

    print(f"Sending scale request to {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=300)

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

        if response.status_code == 200:
            print("Scale up/down request successful!")
            return True
        else:
            print("Scale up/down request failed!")
            return False

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Test scale up/down functionality")
    parser.add_argument("--host", default="localhost", help="API server host")
    parser.add_argument("--port", type=int, default=8006, help="API server port")
    parser.add_argument(
        "--new-dp-size", type=int, default=2, help="New data parallel size"
    )

    args = parser.parse_args()

    success = scale(args.host, args.port, args.new_dp_size)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
```

Example 4 (python):
```python
#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import argparse
import json
import sys

import requests


def scale(host, port, new_dp_size):
    url = f"http://{host}:{port}/scale_elastic_ep"
    payload = {"new_data_parallel_size": new_dp_size}
    headers = {"Content-Type": "application/json"}

    print(f"Sending scale request to {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=300)

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

        if response.status_code == 200:
            print("Scale up/down request successful!")
            return True
        else:
            print("Scale up/down request failed!")
            return False

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Test scale up/down functionality")
    parser.add_argument("--host", default="localhost", help="API server host")
    parser.add_argument("--port", type=int, default=8006, help="API server port")
    parser.add_argument(
        "--new-dp-size", type=int, default=2, help="New data parallel size"
    )

    args = parser.parse_args()

    success = scale(args.host, args.port, args.new_dp_size)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
```

---

## Expert Parallel Deployment - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/

**Contents:**
- Expert Parallel Deployment¶
- Prerequisites¶
  - Backend Selection Guide¶
- Single Node Deployment¶
  - Configuration¶
  - Layer Behavior with EP Enabled¶
  - Example Command¶
- Multi-Node Deployment¶
  - Deployment Steps¶
  - Example: 2-Node Deployment¶

vLLM supports Expert Parallelism (EP), which allows experts in Mixture-of-Experts (MoE) models to be deployed on separate GPUs, increasing locality, efficiency, and throughput overall.

EP is typically coupled with Data Parallelism (DP). While DP can be used independently of EP, EP is more efficient when used in conjunction with DP. You can read more about data parallelism here.

Before using EP, you need to install the necessary dependencies. We are actively working on making this easier in the future:

vLLM provides multiple communication backends for EP. Use --all2all-backend to select one:

EP is an experimental feature. Argument names and default values may change in the future.

Enable EP by setting the --enable-expert-parallel flag. The EP size is automatically calculated as:

When EP is enabled, different layers in MoE models behave differently:

Attention layer parallelism:

For example, with TP=2, DP=4 (8 GPUs total):

Key Difference from Data Parallel Deployment

Without --enable-expert-parallel, MoE layers would use tensor parallelism (forming a TP group of size TP × DP), similar to dense models. With EP enabled, expert layers switch to expert parallelism, which can provide better efficiency and locality for MoE models.

The following command serves a DeepSeek-V3-0324 model with 1-way tensor parallel, 8-way (attention) data parallel, and 8-way expert parallel. The attention weights are replicated across all GPUs, while the expert weights are split across GPUs. It will work on a H200 (or H20) node with 8 GPUs. For H100, you can try to serve a smaller model or refer to the multi-node deployment section.

For multi-node deployment, use the DeepEP communication kernel with one of two modes (see Backend Selection Guide above).

The following example deploys DeepSeek-V3-0324 across 2 nodes using deepep_low_latency mode:

On InfiniBand networked clusters, set this environment variable to prevent initialization hangs:

While MoE models are typically trained so that each expert receives a similar number of tokens, in practice the distribution of tokens across experts can be highly skewed. vLLM provides an Expert Parallel Load Balancer (EPLB) to redistribute expert mappings across EP ranks, evening the load across experts.

Enable EPLB with the --enable-eplb flag.

When enabled, vLLM collects load statistics with every forward pass and periodically rebalances expert distribution.

Configure EPLB with the --eplb-config argument, which accepts a JSON string. The available keys and their descriptions are:

EPLB uses redundant experts that need to fit in GPU memory. This means that EPLB may not be a good fit for memory constrained environments or when KV cache space is at a premium.

This overhead equals NUM_MOE_LAYERS * BYTES_PER_EXPERT * (NUM_TOTAL_EXPERTS + NUM_REDUNDANT_EXPERTS) ÷ NUM_EP_RANKS. For DeepSeekV3, this is approximately 2.4 GB for one redundant expert per EP rank.

Single node deployment with EPLB enabled:

For multi-node deployment, add these EPLB flags to each node's command. We recommend setting --eplb-config '{"num_redundant_experts":32}' to 32 in large scale use cases so the most popular experts are always available.

Use simulator flags VLLM_MOE_ROUTING_SIMULATION_STRATEGY=uniform_random and VLLM_RANDOMIZE_DP_DUMMY_INPUTS=1 so token routing is balanced across EP ranks.

Increasing VLLM_MOE_DP_CHUNK_SIZE may increase throughput by increasing the maximum batch size for inter-rank token transfers. This may cause DeepEP to throw assert self.nvshmem_qp_depth >= (num_max_dispatch_tokens_per_rank + 1) * 2, which can be fixed by increasing environment variable NVSHMEM_QP_DEPTH.

For production deployments requiring strict SLA guarantees for time-to-first-token and inter-token latency, disaggregated serving allows independent scaling of prefill and decode operations.

Install gdrcopy/ucx/nixl: For maximum performance, run the install_gdrcopy.sh script to install gdrcopy (e.g., install_gdrcopy.sh "${GDRCOPY_OS_VERSION}" "12.8" "x64"). You can find available OS versions here. If gdrcopy is not installed, things will still work with a plain pip install nixl, just with lower performance. nixl and ucx are installed as dependencies via pip. For non-cuda platform to install nixl with non-cuda UCX build, run the install_nixl_from_source_ubuntu.py script.

Configure Both Instances: Add this flag to both prefill and decode instances --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both"}. Noted, you may also specify one or multiple NIXL_Backend. Such as: --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both", "kv_connector_extra_config":{"backends":["UCX", "GDS"]}}'

Client Orchestration: Use the client-side script below to coordinate prefill/decode operations. We are actively working on routing solutions.

To simulate the decode deployment of disaggregated serving, pass --kv-transfer-config '{"kv_connector":"DecodeBenchConnector","kv_role":"kv_both"}' to the vllm serve invocation. The connector populates KV cache with random values so decode can be profiled in isolation.

CUDAGraph capture: Use --compilation_config '{"cudagraph_mode": "FULL_DECODE_ONLY"}' to enable CUDA graph capture for decode only and save KV cache.

**Examples:**

Example 1 (unknown):
```unknown
EP_SIZE = TP_SIZE × DP_SIZE
```

Example 2 (unknown):
```unknown
EP_SIZE = TP_SIZE × DP_SIZE
```

Example 3 (markdown):
```markdown
# Single node EP deployment with pplx backend
vllm serve deepseek-ai/DeepSeek-V3-0324 \
    --tensor-parallel-size 1 \       # Tensor parallelism across 1 GPU
    --data-parallel-size 8 \         # Data parallelism across 8 processes
    --enable-expert-parallel \       # Enable expert parallelism
    --all2all-backend pplx           # Use pplx communication backend
```

Example 4 (markdown):
```markdown
# Single node EP deployment with pplx backend
vllm serve deepseek-ai/DeepSeek-V3-0324 \
    --tensor-parallel-size 1 \       # Tensor parallelism across 1 GPU
    --data-parallel-size 8 \         # Data parallelism across 8 processes
    --enable-expert-parallel \       # Enable expert parallelism
    --all2all-backend pplx           # Use pplx communication backend
```

---

## Gradio OpenAI Chatbot Webserver - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/gradio_openai_chatbot_webserver/

**Contents:**
- Gradio OpenAI Chatbot Webserver¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/gradio_openai_chatbot_webserver.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example for starting a Gradio OpenAI Chatbot Webserver
Start vLLM API server:
    vllm serve meta-llama/Llama-2-7b-chat-hf

Start Gradio OpenAI Chatbot Webserver:
    python examples/online_serving/gradio_openai_chatbot_webserver.py \
                    -m meta-llama/Llama-2-7b-chat-hf

Note that `pip install --upgrade gradio` is needed to run this example.
More details: https://github.com/gradio-app/gradio

If your antivirus software blocks the download of frpc for gradio,
you can install it manually by following these steps:

1. Download this file: https://cdn-media.huggingface.co/frpc-gradio-0.3/frpc_linux_amd64
2. Rename the downloaded file to: frpc_linux_amd64_v0.3
3. Move the file to this location: /home/user/.cache/huggingface/gradio/frpc
"""

import argparse

import gradio as gr
from openai import OpenAI


def predict(message, history, client, model_name, temp, stop_token_ids):
    messages = [
        {"role": "system", "content": "You are a great AI assistant."},
        *history,
        {"role": "user", "content": message},
    ]

    # Send request to OpenAI API (vLLM server)
    stream = client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=temp,
        stream=True,
        extra_body={
            "repetition_penalty": 1,
            "stop_token_ids": [int(id.strip()) for id in stop_token_ids.split(",")]
            if stop_token_ids
            else [],
        },
    )

    # Collect all chunks and concatenate them into a full message
    full_message = ""
    for chunk in stream:
        full_message += chunk.choices[0].delta.content or ""

    # Return the full message as a single response
    return full_message


def parse_args():
    parser = argparse.ArgumentParser(
        description="Chatbot Interface with Customizable Parameters"
    )
    parser.add_argument(
        "--model-url", type=str, default="http://localhost:8000/v1", help="Model URL"
    )
    parser.add_argument(
        "-m", "--model", type=str, required=True, help="Model name for the chatbot"
    )
    parser.add_argument(
        "--temp", type=float, default=0.8, help="Temperature for text generation"
    )
    parser.add_argument(
        "--stop-token-ids", type=str, default="", help="Comma-separated stop token IDs"
    )
    parser.add_argument("--host", type=str, default=None)
    parser.add_argument("--port", type=int, default=8001)
    return parser.parse_args()


def build_gradio_interface(client, model_name, temp, stop_token_ids):
    def chat_predict(message, history):
        return predict(message, history, client, model_name, temp, stop_token_ids)

    return gr.ChatInterface(
        fn=chat_predict,
        title="Chatbot Interface",
        description="A simple chatbot powered by vLLM",
    )


def main():
    # Parse the arguments
    args = parse_args()

    # Set OpenAI's API key and API base to use vLLM's API server
    openai_api_key = "EMPTY"
    openai_api_base = args.model_url

    # Create an OpenAI client
    client = OpenAI(api_key=openai_api_key, base_url=openai_api_base)

    # Define the Gradio chatbot interface using the predict function
    gradio_interface = build_gradio_interface(
        client, args.model, args.temp, args.stop_token_ids
    )

    gradio_interface.queue().launch(
        server_name=args.host, server_port=args.port, share=True
    )


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example for starting a Gradio OpenAI Chatbot Webserver
Start vLLM API server:
    vllm serve meta-llama/Llama-2-7b-chat-hf

Start Gradio OpenAI Chatbot Webserver:
    python examples/online_serving/gradio_openai_chatbot_webserver.py \
                    -m meta-llama/Llama-2-7b-chat-hf

Note that `pip install --upgrade gradio` is needed to run this example.
More details: https://github.com/gradio-app/gradio

If your antivirus software blocks the download of frpc for gradio,
you can install it manually by following these steps:

1. Download this file: https://cdn-media.huggingface.co/frpc-gradio-0.3/frpc_linux_amd64
2. Rename the downloaded file to: frpc_linux_amd64_v0.3
3. Move the file to this location: /home/user/.cache/huggingface/gradio/frpc
"""

import argparse

import gradio as gr
from openai import OpenAI


def predict(message, history, client, model_name, temp, stop_token_ids):
    messages = [
        {"role": "system", "content": "You are a great AI assistant."},
        *history,
        {"role": "user", "content": message},
    ]

    # Send request to OpenAI API (vLLM server)
    stream = client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=temp,
        stream=True,
        extra_body={
            "repetition_penalty": 1,
            "stop_token_ids": [int(id.strip()) for id in stop_token_ids.split(",")]
            if stop_token_ids
            else [],
        },
    )

    # Collect all chunks and concatenate them into a full message
    full_message = ""
    for chunk in stream:
        full_message += chunk.choices[0].delta.content or ""

    # Return the full message as a single response
    return full_message


def parse_args():
    parser = argparse.ArgumentParser(
        description="Chatbot Interface with Customizable Parameters"
    )
    parser.add_argument(
        "--model-url", type=str, default="http://localhost:8000/v1", help="Model URL"
    )
    parser.add_argument(
        "-m", "--model", type=str, required=True, help="Model name for the chatbot"
    )
    parser.add_argument(
        "--temp", type=float, default=0.8, help="Temperature for text generation"
    )
    parser.add_argument(
        "--stop-token-ids", type=str, default="", help="Comma-separated stop token IDs"
    )
    parser.add_argument("--host", type=str, default=None)
    parser.add_argument("--port", type=int, default=8001)
    return parser.parse_args()


def build_gradio_interface(client, model_name, temp, stop_token_ids):
    def chat_predict(message, history):
        return predict(message, history, client, model_name, temp, stop_token_ids)

    return gr.ChatInterface(
        fn=chat_predict,
        title="Chatbot Interface",
        description="A simple chatbot powered by vLLM",
    )


def main():
    # Parse the arguments
    args = parse_args()

    # Set OpenAI's API key and API base to use vLLM's API server
    openai_api_key = "EMPTY"
    openai_api_base = args.model_url

    # Create an OpenAI client
    client = OpenAI(api_key=openai_api_key, base_url=openai_api_base)

    # Define the Gradio chatbot interface using the predict function
    gradio_interface = build_gradio_interface(
        client, args.model, args.temp, args.stop_token_ids
    )

    gradio_interface.queue().launch(
        server_name=args.host, server_port=args.port, share=True
    )


if __name__ == "__main__":
    main()
```

---

## Gradio Webserver - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/gradio_webserver/

**Contents:**
- Gradio Webserver¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/gradio_webserver.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example for starting a Gradio Webserver
Start vLLM API server:
    python -m vllm.entrypoints.api_server \
        --model meta-llama/Llama-2-7b-chat-hf

Start Webserver:
    python examples/online_serving/gradio_webserver.py

Note that `pip install --upgrade gradio` is needed to run this example.
More details: https://github.com/gradio-app/gradio

If your antivirus software blocks the download of frpc for gradio,
you can install it manually by following these steps:

1. Download this file: https://cdn-media.huggingface.co/frpc-gradio-0.3/frpc_linux_amd64
2. Rename the downloaded file to: frpc_linux_amd64_v0.3
3. Move the file to this location: /home/user/.cache/huggingface/gradio/frpc
"""

import argparse
import json

import gradio as gr
import requests


def http_bot(prompt):
    headers = {"User-Agent": "vLLM Client"}
    pload = {
        "prompt": prompt,
        "stream": True,
        "max_tokens": 128,
    }
    response = requests.post(args.model_url, headers=headers, json=pload, stream=True)

    for chunk in response.iter_lines(
        chunk_size=8192, decode_unicode=False, delimiter=b"\n"
    ):
        if chunk:
            data = json.loads(chunk.decode("utf-8"))
            output = data["text"][0]
            yield output


def build_demo():
    with gr.Blocks() as demo:
        gr.Markdown("# vLLM text completion demo\n")
        inputbox = gr.Textbox(label="Input", placeholder="Enter text and press ENTER")
        outputbox = gr.Textbox(
            label="Output", placeholder="Generated result from the model"
        )
        inputbox.submit(http_bot, [inputbox], [outputbox])
    return demo


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default=None)
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument(
        "--model-url", type=str, default="http://localhost:8000/generate"
    )
    return parser.parse_args()


def main(args):
    demo = build_demo()
    demo.queue().launch(server_name=args.host, server_port=args.port, share=True)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example for starting a Gradio Webserver
Start vLLM API server:
    python -m vllm.entrypoints.api_server \
        --model meta-llama/Llama-2-7b-chat-hf

Start Webserver:
    python examples/online_serving/gradio_webserver.py

Note that `pip install --upgrade gradio` is needed to run this example.
More details: https://github.com/gradio-app/gradio

If your antivirus software blocks the download of frpc for gradio,
you can install it manually by following these steps:

1. Download this file: https://cdn-media.huggingface.co/frpc-gradio-0.3/frpc_linux_amd64
2. Rename the downloaded file to: frpc_linux_amd64_v0.3
3. Move the file to this location: /home/user/.cache/huggingface/gradio/frpc
"""

import argparse
import json

import gradio as gr
import requests


def http_bot(prompt):
    headers = {"User-Agent": "vLLM Client"}
    pload = {
        "prompt": prompt,
        "stream": True,
        "max_tokens": 128,
    }
    response = requests.post(args.model_url, headers=headers, json=pload, stream=True)

    for chunk in response.iter_lines(
        chunk_size=8192, decode_unicode=False, delimiter=b"\n"
    ):
        if chunk:
            data = json.loads(chunk.decode("utf-8"))
            output = data["text"][0]
            yield output


def build_demo():
    with gr.Blocks() as demo:
        gr.Markdown("# vLLM text completion demo\n")
        inputbox = gr.Textbox(label="Input", placeholder="Enter text and press ENTER")
        outputbox = gr.Textbox(
            label="Output", placeholder="Generated result from the model"
        )
        inputbox.submit(http_bot, [inputbox], [outputbox])
    return demo


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default=None)
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument(
        "--model-url", type=str, default="http://localhost:8000/generate"
    )
    return parser.parse_args()


def main(args):
    demo = build_demo()
    demo.queue().launch(server_name=args.host, server_port=args.port, share=True)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## Haystack - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/haystack/

**Contents:**
- Haystack¶
- Prerequisites¶
- Deploy¶

Haystack is an end-to-end LLM framework that allows you to build applications powered by LLMs, Transformer models, vector search and more. Whether you want to perform retrieval-augmented generation (RAG), document search, question answering or answer generation, Haystack can orchestrate state-of-the-art embedding models and LLMs into pipelines to build end-to-end NLP applications and solve your use case.

It allows you to deploy a large language model (LLM) server with vLLM as the backend, which exposes OpenAI-compatible endpoints.

Set up the vLLM and Haystack environment:

Start the vLLM server with the supported chat completion model, e.g.

Use the OpenAIGenerator and OpenAIChatGenerator components in Haystack to query the vLLM server.

For details, see the tutorial Using vLLM in Haystack.

**Examples:**

Example 1 (unknown):
```unknown
pip install vllm haystack-ai
```

Example 2 (unknown):
```unknown
pip install vllm haystack-ai
```

Example 3 (unknown):
```unknown
vllm serve mistralai/Mistral-7B-Instruct-v0.1
```

Example 4 (unknown):
```unknown
vllm serve mistralai/Mistral-7B-Instruct-v0.1
```

---

## Helm Charts - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/chart-helm/

**Contents:**
- Helm Charts¶
- Files¶
- Running Tests¶
- Example materials¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/chart-helm.

This directory contains a Helm chart for deploying the vllm application. The chart includes configurations for deployment, autoscaling, resource management, and more.

This chart includes unit tests using helm-unittest. Install the plugin and run tests:

**Examples:**

Example 1 (markdown):
```markdown
# Install plugin
helm plugin install https://github.com/helm-unittest/helm-unittest

# Run tests
helm unittest .
```

Example 2 (markdown):
```markdown
# Install plugin
helm plugin install https://github.com/helm-unittest/helm-unittest

# Run tests
helm unittest .
```

Example 3 (unknown):
```unknown
*.png
.git/
ct.yaml
lintconf.yaml
values.schema.json
/workflows
```

Example 4 (unknown):
```unknown
*.png
.git/
ct.yaml
lintconf.yaml
values.schema.json
/workflows
```

---

## Helm - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/helm/

**Contents:**
- Helm¶
- Prerequisites¶
- Installing the chart¶
- Uninstalling the chart¶
- Architecture¶
- Values¶
- Configuration Examples¶
  - Using S3 Model Download (Default)¶
  - Using Custom Init Containers Only¶

A Helm chart to deploy vLLM for Kubernetes

Helm is a package manager for Kubernetes. It helps automate the deployment of vLLM applications on Kubernetes. With Helm, you can deploy the same framework architecture with different configurations to multiple namespaces by overriding variable values.

This guide will walk you through the process of deploying vLLM with Helm, including the necessary prerequisites, steps for Helm installation and documentation on architecture and values file.

Before you begin, ensure that you have the following:

To install the chart with the release name test-vllm:

To uninstall the test-vllm deployment:

The command removes all the Kubernetes components associated with the chart including persistent volumes and deletes the release.

The following table describes configurable parameters of the chart in values.yaml:

For use cases like llm-d where you need custom sidecars without model download:

**Examples:**

Example 1 (bash):
```bash
helm upgrade --install --create-namespace \
  --namespace=ns-vllm test-vllm . \
  -f values.yaml \
  --set secrets.s3endpoint=$ACCESS_POINT \
  --set secrets.s3bucketname=$BUCKET \
  --set secrets.s3accesskeyid=$ACCESS_KEY \
  --set secrets.s3accesskey=$SECRET_KEY
```

Example 2 (bash):
```bash
helm upgrade --install --create-namespace \
  --namespace=ns-vllm test-vllm . \
  -f values.yaml \
  --set secrets.s3endpoint=$ACCESS_POINT \
  --set secrets.s3bucketname=$BUCKET \
  --set secrets.s3accesskeyid=$ACCESS_KEY \
  --set secrets.s3accesskey=$SECRET_KEY
```

Example 3 (unknown):
```unknown
helm uninstall test-vllm --namespace=ns-vllm
```

Example 4 (unknown):
```unknown
helm uninstall test-vllm --namespace=ns-vllm
```

---

## Hugging Face Inference Endpoints - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/hf_inference_endpoints/

**Contents:**
- Hugging Face Inference Endpoints¶
- Overview¶
- Deployment Methods¶
  - Method 1: Deploy from the Catalog¶
  - Method 2: Guided Deployment (Transformers Models)¶
  - Method 3: Manual Deployment (Advanced Models)¶
- Advanced Deployment Details¶
- Next Steps¶

Models compatible with vLLM can be deployed on Hugging Face Inference Endpoints, either starting from the Hugging Face Hub or directly from the Inference Endpoints interface. This allows you to serve models in a fully managed environment with GPU acceleration, auto-scaling, and monitoring, without managing the infrastructure manually.

For advanced details on vLLM integration and deployment options, see Advanced Deployment Details.

This is the easiest way to get started with vLLM on Hugging Face Inference Endpoints. You can browse a catalog of models with verified and optimized deployment configuration at Inference Endpoints to maximize performance.

Go to Endpoints Catalog and in the Inference Server options, select vLLM.This will display the current list of models with optimized preconfigured options.

Select the desired model and click Create Endpoint.

Once the deployment is ready, you can use the endpoint. Update the DEPLOYMENT_URL with the URL provided in the console, remembering to append /v1 as required.

The catalog provides models optimized for vLLM, including GPU settings and inference engine configurations. You can monitor the endpoint and update the container or its configuration from the Inference Endpoints UI.

This method applies to models with the transformers library tag in their metadata. It allows you to deploy a model directly from the Hub UI without manual configuration.

Navigate to a model on Hugging Face Hub. For this example we will use the ibm-granite/granite-docling-258M model. You can verify that the model is compatible by checking the front matter in the README, where the library is tagged as library: transformers.

Locate the Deploy button. The button appears for models tagged with transformers at the top right of the model card.

Click to Deploy button > HF Inference Endpoints. You will be taken to the Inference Endpoints interface to configure the deployment.

Select the Hardware (we choose AWS>GPU>T4 for the example) and Container Configuration. Choose vLLM as the container type and finalize the deployment pressing Create Endpoint.

Use the deployed endpoint. Update the DEPLOYMENT_URL with the URL provided in the console (remember to add /v1 needed). You can then use your endpoint programmatically or via the SDK.

This method uses best-guess defaults. You may need to adjust the configuration to fit your specific requirements.

Some models require manual deployment because they:

These models cannot be deployed using the Deploy button on the model card.

In this guide, we demonstrate manual deployment using the rednote-hilab/dots.ocr model, an OCR model integrated with vLLM (see vLLM PR).

Start a new deployment. Go to Inference Endpoints and click New.

Search the model in the Hub. In the dialog, switch to Hub and search for the desired model.

Choosing infrastructure. On the configuration page, select the cloud provider and hardware from the available options. For this demo, we choose AWS and L4 GPU. Adjust according to your hardware needs.

Configure the container. Scroll to the Container Configuration and select vLLM as the container type.

Create the endpoint. Click Create Endpoint to deploy the model.

Once the endpoint is ready, you can use it with the OpenAI Completion API, cURL, or other SDKs. Remember to append /v1 to the deployment URL if needed.

You can adjust the container settings (Container URI, Container Arguments) from the Inference Endpoints UI and press Update Endpoint. This redeploys the endpoint with the updated container configuration. Changes to the model itself require creating a new endpoint or redeploying with a different model. For example, for this demo, you may need to update the Container URI to the nightly image (vllm/vllm-openai:nightly) and add the --trust-remote-code flag in the container arguments.

With the Transformers modeling backend integration, vLLM now offers Day 0 support for any model compatible with transformers. This means you can deploy such models immediately, leveraging vLLM’s optimized inference without additional backend modifications.

Hugging Face Inference Endpoints provides a fully managed environment for serving models via vLLM. You can deploy models without configuring servers, installing dependencies, or managing clusters. Endpoints also support deployment across multiple cloud providers (AWS, Azure, GCP) without the need for separate accounts.

The platform integrates seamlessly with the Hugging Face Hub, allowing you to deploy any vLLM- or transformers-compatible model, track usage, and update the inference engine directly. The vLLM engine comes preconfigured, enabling optimized inference and easy switching between models or engines without modifying your code. This setup simplifies production deployment: endpoints are ready in minutes, include monitoring and logging, and let you focus on serving models rather than maintaining infrastructure.

**Examples:**

Example 1 (json):
```json
# pip install openai
from openai import OpenAI
import os

client = OpenAI(
    base_url=DEPLOYMENT_URL,
    api_key=os.environ["HF_TOKEN"],  # https://huggingface.co/settings/tokens
)

chat_completion = client.chat.completions.create(
    model="HuggingFaceTB/SmolLM3-3B",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Give me a brief explanation of gravity in simple terms.",
                }
            ],
        }
    ],
    stream=True,
)

for message in chat_completion:
    print(message.choices[0].delta.content, end="")
```

Example 2 (json):
```json
# pip install openai
from openai import OpenAI
import os

client = OpenAI(
    base_url=DEPLOYMENT_URL,
    api_key=os.environ["HF_TOKEN"],  # https://huggingface.co/settings/tokens
)

chat_completion = client.chat.completions.create(
    model="HuggingFaceTB/SmolLM3-3B",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Give me a brief explanation of gravity in simple terms.",
                }
            ],
        }
    ],
    stream=True,
)

for message in chat_completion:
    print(message.choices[0].delta.content, end="")
```

Example 3 (json):
```json
# pip install openai
from openai import OpenAI
import os

client = OpenAI(
    base_url=DEPLOYMENT_URL,
    api_key=os.environ["HF_TOKEN"],  # https://huggingface.co/settings/tokens
)

chat_completion = client.chat.completions.create(
    model="ibm-granite/granite-docling-258M",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://huggingface.co/ibm-granite/granite-docling-258M/resolve/main/assets/new_arxiv.png",
                    },
                },
                {
                    "type": "text",
                    "text": "Convert this page to docling.",
                },
            ]
        }
    ],
    stream=True,
)

for message in chat_completion:
    print(message.choices[0].delta.content, end="")
```

Example 4 (json):
```json
# pip install openai
from openai import OpenAI
import os

client = OpenAI(
    base_url=DEPLOYMENT_URL,
    api_key=os.environ["HF_TOKEN"],  # https://huggingface.co/settings/tokens
)

chat_completion = client.chat.completions.create(
    model="ibm-granite/granite-docling-258M",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://huggingface.co/ibm-granite/granite-docling-258M/resolve/main/assets/new_arxiv.png",
                    },
                },
                {
                    "type": "text",
                    "text": "Convert this page to docling.",
                },
            ]
        }
    ],
    stream=True,
)

for message in chat_completion:
    print(message.choices[0].delta.content, end="")
```

---

## KAITO - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/kaito/

**Contents:**
- KAITO¶

KAITO is a Kubernetes operator that supports deploying and serving LLMs with vLLM. It offers managing large models via container images with built-in OpenAI-compatible inference, auto-provisioning GPU nodes and curated model presets.

Please refer to quick start for more details.

---

## KServe - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/kserve/

**Contents:**
- KServe¶

vLLM can be deployed with KServe on Kubernetes for highly scalable distributed model serving.

You can use vLLM with KServe's Hugging Face serving runtime or via LLMInferenceService that uses llm-d.

---

## Kthena - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/kthena/

**Contents:**
- Kthena¶
- 1. Prerequisites¶
  - 1.1 Install Volcano¶
  - 1.2 Install Kthena¶
- 2. The Multi-Node vLLM ModelServing Example¶
- 3. Deploying Multi-Node llama vLLM via Kthena¶
  - 3.1 Prepare the Manifest¶
  - 3.2 Apply the ModelServing¶
- 4. Verifying the Deployment¶
  - 4.1 Check ModelServing Status¶

Kthena is a Kubernetes-native LLM inference platform that transforms how organizations deploy and manage Large Language Models in production. Built with declarative model lifecycle management and intelligent request routing, it provides high performance and enterprise-grade scalability for LLM inference workloads.

This guide shows how to deploy a production-grade, multi-node vLLM service on Kubernetes.

This provides the gang-scheduling and network topology features used by Kthena.

Kthena provides an example manifest to deploy a multi-node vLLM cluster running Llama. Conceptually this is equivalent to the vLLM production stack Helm deployment, but expressed with ModelServing.

A simplified version of the example (llama-multinode) looks like:

Key points from the example YAML:

Recommended: use a Secret instead of a raw env var:

Use the snippet from the Kthena docs:

You should see something like:

List pods for your deployment:

Example output (from docs):

The first number indicates ServingGroup. The second (405b) is the Role. The remaining indices identify the pod within the role.

Expose the entry via a Service:

Port-forward from your local machine:

You should see an OpenAI-style response from vLLM.

To remove the deployment and its resources:

If you’re done with the entire stack:

**Examples:**

Example 1 (sql):
```sql
helm repo add volcano-sh https://volcano-sh.github.io/helm-charts
helm repo update
helm install volcano volcano-sh/volcano -n volcano-system --create-namespace
```

Example 2 (sql):
```sql
helm repo add volcano-sh https://volcano-sh.github.io/helm-charts
helm repo update
helm install volcano volcano-sh/volcano -n volcano-system --create-namespace
```

Example 3 (csharp):
```csharp
helm install kthena oci://ghcr.io/volcano-sh/charts/kthena --version v0.1.0 --namespace kthena-system --create-namespace
```

Example 4 (csharp):
```csharp
helm install kthena oci://ghcr.io/volcano-sh/charts/kthena --version v0.1.0 --namespace kthena-system --create-namespace
```

---

## KubeAI - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/kubeai/

**Contents:**
- KubeAI¶

KubeAI is a Kubernetes operator that enables you to deploy and manage AI models on Kubernetes. It provides a simple and scalable way to deploy vLLM in production. Functionality such as scale-from-zero, load based autoscaling, model caching, and much more is provided out of the box with zero external dependencies.

Please see the Installation Guides for environment specific instructions:

Once you have KubeAI installed, you can configure text generation models using vLLM.

---

## KubeRay - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/kuberay/

**Contents:**
- KubeRay¶
- Why KubeRay instead of manual scripts?¶
- Learn more¶

KubeRay provides a Kubernetes-native way to run vLLM workloads on Ray clusters. A Ray cluster can be declared in YAML, and the operator then handles pod scheduling, networking configuration, restarts, and blue-green deployments — all while preserving the familiar Kubernetes experience.

Using KubeRay reduces the operational burden and simplifies integration of Ray + vLLM with existing Kubernetes workflows (CI/CD, secrets, storage classes, etc.).

---

## Kv Events Subscriber - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/kv_events_subscriber/

**Contents:**
- Kv Events Subscriber¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/kv_events_subscriber.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
from typing import Any

import msgspec
import zmq
from msgspec.msgpack import Decoder

from vllm.v1.core.kv_cache_utils import ExternalBlockHash


#
# Types copied from vllm.distributed.kv_events
#
class EventBatch(msgspec.Struct, array_like=True, omit_defaults=True, gc=False):
    ts: float
    events: list[Any]


class KVCacheEvent(
    msgspec.Struct, array_like=True, omit_defaults=True, gc=False, tag=True
):
    """Base class for all KV cache-related events"""


class BlockStored(KVCacheEvent):
    block_hashes: list[ExternalBlockHash]
    parent_block_hash: ExternalBlockHash | None
    token_ids: list[int]
    block_size: int
    lora_id: int | None
    medium: str | None


class BlockRemoved(KVCacheEvent):
    block_hashes: list[ExternalBlockHash]
    medium: str | None


class AllBlocksCleared(KVCacheEvent):
    pass


class KVEventBatch(EventBatch):
    events: list[BlockStored | BlockRemoved | AllBlocksCleared]


def process_event(event_batch):
    print(f"Received event batch at {event_batch.ts}:")
    for event in event_batch.events:
        print(f"  - {event}")


def main():
    decoder = Decoder(type=KVEventBatch)
    last_seq = -1

    context = zmq.Context()

    # Set up the main subscription socket
    sub = context.socket(zmq.SUB)
    sub.connect("tcp://localhost:5557")
    topic = "kv-events"
    sub.setsockopt_string(zmq.SUBSCRIBE, topic)

    # Initialize replay socket
    replay = context.socket(zmq.REQ)
    replay.connect("tcp://localhost:5558")
    poller = zmq.Poller()
    poller.register(replay, zmq.POLLIN)

    print("Listening for KV cache events on topic:", topic)

    while True:
        try:
            if sub.poll(50):
                _, seq_bytes, payload = sub.recv_multipart()
                seq = int.from_bytes(seq_bytes, "big")

                if last_seq >= 0 and seq > last_seq + 1:
                    missed = seq - last_seq - 1
                    print(
                        f"Missed {missed} messages (last: {last_seq}, current: {seq})"
                    )

                    replay.send((last_seq + 1).to_bytes(8, "big"))

                    while poller.poll(timeout=200):
                        seq_bytes, replay_payload = replay.recv_multipart()
                        if not replay_payload:
                            # End of replay marker is sent as an empty frame
                            # for the payload
                            break

                        replay_seq = int.from_bytes(seq_bytes, "big")

                        if replay_seq > last_seq:
                            event_batch = decoder.decode(replay_payload)
                            process_event(event_batch)
                            last_seq = replay_seq
                            if replay_seq >= seq - 1:
                                break

                event_batch = decoder.decode(payload)
                process_event(event_batch)

            # ... do other periodic work or check for shutdown ...

        except KeyboardInterrupt:
            print("Interrupted")
            break
        except Exception as e:
            print("Error decoding message:", e)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
from typing import Any

import msgspec
import zmq
from msgspec.msgpack import Decoder

from vllm.v1.core.kv_cache_utils import ExternalBlockHash


#
# Types copied from vllm.distributed.kv_events
#
class EventBatch(msgspec.Struct, array_like=True, omit_defaults=True, gc=False):
    ts: float
    events: list[Any]


class KVCacheEvent(
    msgspec.Struct, array_like=True, omit_defaults=True, gc=False, tag=True
):
    """Base class for all KV cache-related events"""


class BlockStored(KVCacheEvent):
    block_hashes: list[ExternalBlockHash]
    parent_block_hash: ExternalBlockHash | None
    token_ids: list[int]
    block_size: int
    lora_id: int | None
    medium: str | None


class BlockRemoved(KVCacheEvent):
    block_hashes: list[ExternalBlockHash]
    medium: str | None


class AllBlocksCleared(KVCacheEvent):
    pass


class KVEventBatch(EventBatch):
    events: list[BlockStored | BlockRemoved | AllBlocksCleared]


def process_event(event_batch):
    print(f"Received event batch at {event_batch.ts}:")
    for event in event_batch.events:
        print(f"  - {event}")


def main():
    decoder = Decoder(type=KVEventBatch)
    last_seq = -1

    context = zmq.Context()

    # Set up the main subscription socket
    sub = context.socket(zmq.SUB)
    sub.connect("tcp://localhost:5557")
    topic = "kv-events"
    sub.setsockopt_string(zmq.SUBSCRIBE, topic)

    # Initialize replay socket
    replay = context.socket(zmq.REQ)
    replay.connect("tcp://localhost:5558")
    poller = zmq.Poller()
    poller.register(replay, zmq.POLLIN)

    print("Listening for KV cache events on topic:", topic)

    while True:
        try:
            if sub.poll(50):
                _, seq_bytes, payload = sub.recv_multipart()
                seq = int.from_bytes(seq_bytes, "big")

                if last_seq >= 0 and seq > last_seq + 1:
                    missed = seq - last_seq - 1
                    print(
                        f"Missed {missed} messages (last: {last_seq}, current: {seq})"
                    )

                    replay.send((last_seq + 1).to_bytes(8, "big"))

                    while poller.poll(timeout=200):
                        seq_bytes, replay_payload = replay.recv_multipart()
                        if not replay_payload:
                            # End of replay marker is sent as an empty frame
                            # for the payload
                            break

                        replay_seq = int.from_bytes(seq_bytes, "big")

                        if replay_seq > last_seq:
                            event_batch = decoder.decode(replay_payload)
                            process_event(event_batch)
                            last_seq = replay_seq
                            if replay_seq >= seq - 1:
                                break

                event_batch = decoder.decode(payload)
                process_event(event_batch)

            # ... do other periodic work or check for shutdown ...

        except KeyboardInterrupt:
            print("Interrupted")
            break
        except Exception as e:
            print("Error decoding message:", e)


if __name__ == "__main__":
    main()
```

---

## LangChain - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/integrations/langchain/

**Contents:**
- LangChain¶

vLLM is also available via LangChain .

To install LangChain, run

To run inference on a single or multiple GPUs, use VLLM class from langchain.

Please refer to this Tutorial for more details.

**Examples:**

Example 1 (unknown):
```unknown
pip install langchain langchain_community -q
```

Example 2 (unknown):
```unknown
pip install langchain langchain_community -q
```

Example 3 (python):
```python
from langchain_community.llms import VLLM

llm = VLLM(
    model="Qwen/Qwen3-4B",
    trust_remote_code=True,  # mandatory for hf models
    max_new_tokens=128,
    top_k=10,
    top_p=0.95,
    temperature=0.8,
    # for distributed inference
    # tensor_parallel_size=...,
)

print(llm("What is the capital of France ?"))
```

Example 4 (python):
```python
from langchain_community.llms import VLLM

llm = VLLM(
    model="Qwen/Qwen3-4B",
    trust_remote_code=True,  # mandatory for hf models
    max_new_tokens=128,
    top_k=10,
    top_p=0.95,
    temperature=0.8,
    # for distributed inference
    # tensor_parallel_size=...,
)

print(llm("What is the capital of France ?"))
```

---

## LiteLLM - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/litellm/

**Contents:**
- LiteLLM¶
- Prerequisites¶
- Deploy¶
  - Chat completion¶
  - Embeddings¶

LiteLLM call all LLM APIs using the OpenAI format [Bedrock, Huggingface, VertexAI, TogetherAI, Azure, OpenAI, Groq etc.]

And LiteLLM supports all models on VLLM.

Set up the vLLM and litellm environment:

Start the vLLM server with the supported chat completion model, e.g.

Call it with litellm:

Start the vLLM server with the supported embedding model, e.g.

Call it with litellm:

For details, see the tutorial Using vLLM in LiteLLM.

**Examples:**

Example 1 (unknown):
```unknown
pip install vllm litellm
```

Example 2 (unknown):
```unknown
pip install vllm litellm
```

Example 3 (unknown):
```unknown
vllm serve qwen/Qwen1.5-0.5B-Chat
```

Example 4 (unknown):
```unknown
vllm serve qwen/Qwen1.5-0.5B-Chat
```

---

## LlamaIndex - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/integrations/llamaindex/

**Contents:**
- LlamaIndex¶

vLLM is also available via LlamaIndex .

To install LlamaIndex, run

To run inference on a single or multiple GPUs, use Vllm class from llamaindex.

Please refer to this Tutorial for more details.

**Examples:**

Example 1 (unknown):
```unknown
pip install llama-index-llms-vllm -q
```

Example 2 (unknown):
```unknown
pip install llama-index-llms-vllm -q
```

Example 3 (json):
```json
from llama_index.llms.vllm import Vllm

llm = Vllm(
    model="microsoft/Orca-2-7b",
    tensor_parallel_size=4,
    max_new_tokens=100,
    vllm_kwargs={"swap_space": 1, "gpu_memory_utilization": 0.5},
)
```

Example 4 (json):
```json
from llama_index.llms.vllm import Vllm

llm = Vllm(
    model="microsoft/Orca-2-7b",
    tensor_parallel_size=4,
    max_new_tokens=100,
    vllm_kwargs={"swap_space": 1, "gpu_memory_utilization": 0.5},
)
```

---

## Llama Stack - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/llamastack/

**Contents:**
- Llama Stack¶
- Inference using OpenAI-Compatible API¶
- Inference using Embedded vLLM¶

vLLM is also available via Llama Stack.

To install Llama Stack, run

Then start the Llama Stack server and configure it to point to your vLLM server with the following settings:

Please refer to this guide for more details on this remote vLLM provider.

An inline provider is also available. This is a sample of configuration using that method:

**Examples:**

Example 1 (unknown):
```unknown
pip install llama-stack -q
```

Example 2 (unknown):
```unknown
pip install llama-stack -q
```

Example 3 (yaml):
```yaml
inference:
  - provider_id: vllm0
    provider_type: remote::vllm
    config:
      url: http://127.0.0.1:8000
```

Example 4 (yaml):
```yaml
inference:
  - provider_id: vllm0
    provider_type: remote::vllm
    config:
      url: http://127.0.0.1:8000
```

---

## llmaz - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/llmaz/

**Contents:**
- llmaz¶

llmaz is an easy-to-use and advanced inference platform for large language models on Kubernetes, aimed for production use. It uses vLLM as the default model serving backend.

Please refer to the Quick Start for more details.

---

## llm-d - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/llm-d/

**Contents:**
- llm-d¶

vLLM can be deployed with llm-d, a Kubernetes-native distributed inference serving stack providing well-lit paths for anyone to serve large generative AI models at scale. It helps achieve the fastest "time to state-of-the-art (SOTA) performance" for key OSS models across most hardware accelerators and infrastructure providers.

You can use vLLM with llm-d directly by following this guide or via KServe's LLMInferenceService.

---

## Lobe Chat - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/lobe-chat/

**Contents:**
- Lobe Chat¶

Lobe Chat is an open-source, modern-design ChatGPT/LLMs UI/Framework.

Supports speech-synthesis, multi-modal, and extensible (function call) plugin system.

One-click FREE deployment of your private OpenAI ChatGPT/Claude/Gemini/Groq/Ollama chat application.

It supports vLLM as an AI model provider to efficiently serve large language models.

For details, see the tutorial Using vLLM in LobeChat.

---

## LWS - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/lws/

**Contents:**
- LWS¶
- Prerequisites¶
- Deploy and Serve¶
- Access ClusterIP service¶
- Serve the model¶

LeaderWorkerSet (LWS) is a Kubernetes API that aims to address common deployment patterns of AI/ML inference workloads. A major use case is for multi-host/multi-node distributed inference.

vLLM can be deployed with LWS on Kubernetes for distributed model serving.

Deploy the following yaml file lws.yaml

Verify the status of the pods:

Should get an output similar to this:

Verify that the distributed tensor-parallel inference works:

Should get something similar to this:

The output should be similar to the following:

Open another terminal and send a request

The output should be similar to the following

**Examples:**

Example 1 (yaml):
```yaml
apiVersion: leaderworkerset.x-k8s.io/v1
kind: LeaderWorkerSet
metadata:
  name: vllm
spec:
  replicas: 1
  leaderWorkerTemplate:
    size: 2
    restartPolicy: RecreateGroupOnPodRestart
    leaderTemplate:
      metadata:
        labels:
          role: leader
      spec:
        containers:
          - name: vllm-leader
            image: docker.io/vllm/vllm-openai:latest
            env:
              - name: HF_TOKEN
                value: <your-hf-token>
            command:
              - sh
              - -c
              - "bash /vllm-workspace/examples/online_serving/multi-node-serving.sh leader --ray_cluster_size=$(LWS_GROUP_SIZE); 
                vllm serve meta-llama/Meta-Llama-3.1-405B-Instruct --port 8080 --tensor-parallel-size 8 --pipeline_parallel_size 2"
            resources:
              limits:
                nvidia.com/gpu: "8"
                memory: 1124Gi
                ephemeral-storage: 800Gi
              requests:
                ephemeral-storage: 800Gi
                cpu: 125
            ports:
              - containerPort: 8080
            readinessProbe:
              tcpSocket:
                port: 8080
              initialDelaySeconds: 15
              periodSeconds: 10
            volumeMounts:
              - mountPath: /dev/shm
                name: dshm
        volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 15Gi
    workerTemplate:
      spec:
        containers:
          - name: vllm-worker
            image: docker.io/vllm/vllm-openai:latest
            command:
              - sh
              - -c
              - "bash /vllm-workspace/examples/online_serving/multi-node-serving.sh worker --ray_address=$(LWS_LEADER_ADDRESS)"
            resources:
              limits:
                nvidia.com/gpu: "8"
                memory: 1124Gi
                ephemeral-storage: 800Gi
              requests:
                ephemeral-storage: 800Gi
                cpu: 125
            env:
              - name: HF_TOKEN
                value: <your-hf-token>
            volumeMounts:
              - mountPath: /dev/shm
                name: dshm   
        volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 15Gi
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-leader
spec:
  ports:
    - name: http
      port: 8080
      protocol: TCP
      targetPort: 8080
  selector:
    leaderworkerset.sigs.k8s.io/name: vllm
    role: leader
  type: ClusterIP
```

Example 2 (yaml):
```yaml
apiVersion: leaderworkerset.x-k8s.io/v1
kind: LeaderWorkerSet
metadata:
  name: vllm
spec:
  replicas: 1
  leaderWorkerTemplate:
    size: 2
    restartPolicy: RecreateGroupOnPodRestart
    leaderTemplate:
      metadata:
        labels:
          role: leader
      spec:
        containers:
          - name: vllm-leader
            image: docker.io/vllm/vllm-openai:latest
            env:
              - name: HF_TOKEN
                value: <your-hf-token>
            command:
              - sh
              - -c
              - "bash /vllm-workspace/examples/online_serving/multi-node-serving.sh leader --ray_cluster_size=$(LWS_GROUP_SIZE); 
                vllm serve meta-llama/Meta-Llama-3.1-405B-Instruct --port 8080 --tensor-parallel-size 8 --pipeline_parallel_size 2"
            resources:
              limits:
                nvidia.com/gpu: "8"
                memory: 1124Gi
                ephemeral-storage: 800Gi
              requests:
                ephemeral-storage: 800Gi
                cpu: 125
            ports:
              - containerPort: 8080
            readinessProbe:
              tcpSocket:
                port: 8080
              initialDelaySeconds: 15
              periodSeconds: 10
            volumeMounts:
              - mountPath: /dev/shm
                name: dshm
        volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 15Gi
    workerTemplate:
      spec:
        containers:
          - name: vllm-worker
            image: docker.io/vllm/vllm-openai:latest
            command:
              - sh
              - -c
              - "bash /vllm-workspace/examples/online_serving/multi-node-serving.sh worker --ray_address=$(LWS_LEADER_ADDRESS)"
            resources:
              limits:
                nvidia.com/gpu: "8"
                memory: 1124Gi
                ephemeral-storage: 800Gi
              requests:
                ephemeral-storage: 800Gi
                cpu: 125
            env:
              - name: HF_TOKEN
                value: <your-hf-token>
            volumeMounts:
              - mountPath: /dev/shm
                name: dshm   
        volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 15Gi
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-leader
spec:
  ports:
    - name: http
      port: 8080
      protocol: TCP
      targetPort: 8080
  selector:
    leaderworkerset.sigs.k8s.io/name: vllm
    role: leader
  type: ClusterIP
```

Example 3 (unknown):
```unknown
kubectl apply -f lws.yaml
```

Example 4 (unknown):
```unknown
kubectl apply -f lws.yaml
```

---

## Metrics - vLLM

**URL:** https://docs.vllm.ai/en/latest/design/metrics/

**Contents:**
- Metrics¶
- Objectives¶
- Background¶
  - Metrics Overview¶
  - v1 Metrics¶
  - Grafana Dashboard¶
  - Prometheus Client Library¶
  - Multi-process Mode¶
  - Built in Python/Process Metrics¶
- Metrics Design¶

vLLM exposes a rich set of metrics to support observability and capacity planning for the V1 engine.

Metrics in vLLM can be categorized as follows:

The mental model is that server-level metrics help explain the values of request-level metrics.

In v1, an extensive set of metrics are exposed via a Prometheus-compatible /metrics endpoint using the vllm: prefix, for example:

These are documented under Inferencing and Serving -> Production Metrics.

vLLM also provides a reference example for how to collect and store these metrics using Prometheus and visualize them using a Grafana dashboard.

The subset of metrics exposed in the Grafana dashboard gives us an indication of which metrics are especially important:

See the PR which added this Dashboard for interesting and useful background on the choices made here.

Prometheus support was initially added using the aioprometheus library, but a switch was made quickly to prometheus_client. The rationale is discussed in both linked PRs.

During those migrations we briefly lost a MetricsMiddleware to track HTTP metrics, but this was reinstated using prometheus_fastapi_instrumentator:

Historically, metrics were collected in the engine core process and multiprocess mode was used to make them available in the API server process. See Pull Request #7279.

More recently, metrics are collected in the API server process and multiprocess mode is only used when --api-server-count > 1. See Pull Request #17546 and details on API server scale-out.

The following metrics are supported by default by prometheus_client, but they are not exposed when multiprocess mode is used:

Therefore, these metrics are unavailable when --api-server-count > 1. It's questionable how relevant these are since they do not aggregate these stats for all processes that make up a vLLM instance.

The "Even Better Observability" feature where was where much of the metrics design was planned. For example, see where a detailed roadmap was laid out.

To help understand the background to the metrics design, here are some of the relevant PRs which added the original, now legacy, metrics:

For background, here are the relevant PRs relating to the metrics implementation Issue #10582:

In v1, we wish to move computation and overhead out of the engine core process to minimize the time between each forward pass.

The overall idea of V1 EngineCore design is:

We will achieve this by collecting metrics in the frontend API server, and base these metrics on information we can glean from the EngineCoreOutputs returned by the engine core process to the frontend.

Many of our metrics are the time interval between various events in the processing of a request. It is best practice to use timestamps based on "monotonic time" (time.monotonic()) rather than "wall-clock time" (time.time()) to calculate intervals as the former is unaffected by system clock changes (e.g. from NTP).

It's also important to note that monotonic clocks differ between processes - each process has its own reference point. So it is meaningless to compare monotonic timestamps from different processes.

Therefore, in order to calculate an interval, we must compare two monotonic timestamps from the same process.

The engine core process will collect some key statistics from the scheduler - e.g. the number of requests that were scheduled or waiting after the last scheduler pass - and include those statistics in EngineCoreOutputs.

The engine core will also record the timestamp of certain per-request events so that the frontend can calculate the interval between these events.

And the calculated intervals are:

We explored the possibility of having the frontend calculate these intervals using the timing of events visible by the frontend. However, the frontend does not have visibility into the timing of the QUEUED and SCHEDULED events and, since we need to calculate intervals based on monotonic timestamps from the same process ... we need the engine core to record timestamps for all of these events.

When a preemption occurs during decode, since any already generated tokens are reused, we consider the preemption as affecting the inter-token, decode, and inference intervals.

When a preemption occurs during prefill (assuming such an event is possible), we consider the preemption as affecting the time-to-first-token and prefill intervals.

As the frontend processes a single EngineCoreOutputs - i.e. the output from a single engine core iteration - it collects various statistics relating to that iteration:

For any requests that were completed in a given iteration, we also record:

We also emit a set of histograms that describe how long sampled KV cache blocks stay resident and how often they are reused. Sampling (--kv-cache-metrics-sample) keeps the overhead tiny; when a block is chosen we record:

Those map directly to the Prometheus metrics:

The engine core only ships raw eviction events via SchedulerStats; the frontend drains them, turns them into Prometheus observations, and also exposes the same data through LLM.get_metrics() when logging is on. Looking at lifetime and idle time on one chart makes it easy to spot stranded cache or workloads that pin prompts for a long decode.

The LoggingStatLogger metrics publisher outputs a log INFO message every 5 seconds with some key metrics:

The PrometheusStatLogger metrics publisher makes the metrics available via a /metrics HTTP endpoint in a Prometheus-compatible format. A Prometheus instance can then be configured to poll this endpoint (e.g. every second) and record the values in its time-series database. Prometheus is often used via Grafana, allowing these metrics to be graphed over time.

Prometheus supports the following metric types:

Prometheus metrics can also be labelled, allowing metrics to be combined according to matching labels. In vLLM, we add a model_name label to every metric which includes the name of the model served by that instance.

The choice of histogram buckets to be most useful to users across a broad set of use cases is not straightforward and will require refinement over time.

prometheus_client has support for Info metrics which are equivalent to a Gauge whose value is permanently set to 1, but exposes interesting key/value pair information via labels. This is used for information about an instance that does not change - so it only needs to be observed at startup - and allows comparing across instances in Prometheus.

We use this concept for the vllm:cache_config_info metric:

However, prometheus_client has never supported Info metrics in multiprocessing mode - for unclear reasons. We simply use a Gauge metric set to 1 and multiprocess_mode="mostrecent" instead.

The vllm:lora_requests_info Gauge is somewhat similar, except the value is the current wall-clock time, and is updated every iteration.

The label names used are:

Encoding a running/waiting counts for multiple adapters in a comma-separated string seems quite misguided - we could use labels to distinguish between per-adapter counts. This should be revisited.

Note that multiprocess_mode="livemostrecent" is used - the most recent metric is used, but only from currently running processes.

This was added in Pull Request #9477 and there is at least one known user. If we revisit this design and deprecate the old metric, we should coordinate with downstream users so they can migrate before the removal.

The discussion in Issue #10582 about adding prefix cache metrics yielded some interesting points which may be relevant to how we approach future metrics.

Every time the prefix cache is queried, we record the number of tokens queried and the number of queried tokens present in the cache (i.e. hits).

However, the metric of interest is the hit rate - i.e. the number of hits per query.

In the case of logging, we expect the user is best served by calculating the hit rate over a fixed number of the most recent queries (the interval is fixed to 1k most recent queries for now).

In the case of Prometheus though, we should take advantage of the time-series nature of Prometheus and allow the user to calculate the hit rate over an interval of their choosing. For example, a PromQL query to calculate the hit interval of the past 5 minutes:

To achieve this, we should record the queries and hits as counters in Prometheus, rather than recording the hit rate as a gauge.

Deprecating metrics shouldn't be taken lightly. Users may not notice a metric has been deprecated, and may be quite inconvenienced when it is suddenly (from their perspective) when it is removed, even if there is an equivalent metric for them to use.

As an example, see how vllm:avg_prompt_throughput_toks_per_s was deprecated (with a comment in the code), removed, and then noticed by a user.

See the deprecation policy for the project-wide deprecation policy.

Added by Pull Request #4464, but apparently never implemented. This can just be removed.

The vllm:time_in_queue_requests Histogram metric was added by Pull Request #9659 and its calculation is:

Two weeks later, Pull Request #4464 added vllm:request_queue_time_seconds leaving us with:

This seems duplicative, and one of them should be removed. The latter is used by the Grafana dashboard, so we should deprecate or remove the former.

See above - we now expose 'queries' and 'hits' counters rather than a 'hit rate' gauge.

Two legacy metrics relate to a "swapped" preemption mode that is no longer relevant in v1:

In this mode, when a request is preempted (e.g. to make room in KV cache to complete other requests), we swap kv cache blocks out to CPU memory. This is also known as "KV cache offloading" and is configured with --swap-space and --preemption-mode.

Historically, vLLM has long supported beam search. The SequenceGroup encapsulated the idea of N Sequences which all shared the same prompt kv blocks. This enabled KV cache block sharing between requests, and copy-on-write to do branching. CPU swapping was intended for these beam search like cases.

Later, the concept of prefix caching was introduced, which allowed KV cache blocks to be shared implicitly. This proved to be a better option than CPU swapping since blocks can be evicted slowly on demand and the part of the prompt that was evicted can be recomputed.

SequenceGroup was removed in V1, although a replacement will be required for "parallel sampling" (n>1). Beam search was moved out of the core. There was a lot of complex code for a very uncommon feature.

In V1, with prefix caching being better (zero over head) and therefore on by default, the preemption and recompute strategy should work better.

Some legacy metrics are only relevant in the context of "parallel sampling". This is where the n parameter in a request is used to request multiple completions from the same prompt.

As part of adding parallel sampling support in Pull Request #10980, we should also add these metrics.

Observes the value of the 'n' parameter of every finished request.

Observes the maximum output length of all sequences in every finished sequence group. In the absence of parallel sampling, this is equivalent to vllm:request_generation_tokens.

Some legacy metrics are specific to "speculative decoding". This is where we generate candidate tokens using a faster, approximate method or model and then validate those tokens with the larger model.

There is a PR under review ( Pull Request #12193) to add "prompt lookup (ngram)" speculative decoding to v1. Other techniques will follow. We should revisit these metrics in this context.

We should probably expose acceptance rate as separate accepted and draft counters, like we do for prefix caching hit rate. Efficiency likely also needs similar treatment.

A common use case for our metrics is to support automated scaling of vLLM instances.

For related discussion from the Kubernetes Serving Working Group, see:

This is a non-trivial topic. Consider this comment from Rob:

I think this metric should focus on trying to estimate what the max concurrency that will cause the average request length > queries per second ... since this is really what will "saturate" the server.

A clear goal is that we should expose the metrics required to detect this saturation point, so administrators can implement auto-scaling rules based on those. However, in order to do so, we need to have a clear view on how an administrator (and automated monitoring system) should judge an instance as approaching saturation:

To identify, what is the saturation point for model server compute (the inflection point where we cannot get more throughput with a higher request rate, but start to incur additional latency) so we can autoscale effectively?

Our approach to naming metrics probably deserves to be revisited:

Some of our metric names end with _total:

If there is a suffix of _total on the metric name, it will be removed. When exposing the time series for counter, a _total suffix will be added. This is for compatibility between OpenMetrics and the Prometheus text format, as OpenMetrics requires the _total suffix.

There is no shortage of ideas for new metrics:

We should be cautious in our approach to adding new metrics. While metrics are often relatively straightforward to add:

Metrics provide an aggregated view over time of the system's performance and health. Tracing, on the other hand, tracks individual requests as they move through different services and components. Both fall under the more general heading of "Observability".

vLLM has support for OpenTelemetry tracing:

OpenTelemetry has a Gen AI Working Group.

Since metrics is a big enough topic on its own, we consider the topic of tracing to be quite separate from metrics.

The current implementation exposes the following two metrics:

These metrics are only enabled when OpenTelemetry tracing is enabled and if --collect-detailed-traces=all/model/worker is used. The documentation for this option states:

collect detailed traces for the specified modules. This involves use of possibly costly and or blocking operations and hence might have a performance impact.

The metrics were added by Pull Request #7089 and who up in an OpenTelemetry trace as:

We already have inference_time and decode_time metrics, so the question is whether there are sufficiently common use cases for the higher-resolution timings to justify the overhead.

Since we are going to treat the question of OpenTelemetry support separately, we will include these particular metrics under that topic.

**Examples:**

Example 1 (json):
```json
$ curl http://0.0.0.0:8000/metrics 2>/dev/null  | grep -P '^http_(?!.*(_bucket|_created|_sum)).*'
http_requests_total{handler="/v1/completions",method="POST",status="2xx"} 201.0
http_request_size_bytes_count{handler="/v1/completions"} 201.0
http_response_size_bytes_count{handler="/v1/completions"} 201.0
http_request_duration_highr_seconds_count 201.0
http_request_duration_seconds_count{handler="/v1/completions",method="POST"} 201.0
```

Example 2 (json):
```json
$ curl http://0.0.0.0:8000/metrics 2>/dev/null  | grep -P '^http_(?!.*(_bucket|_created|_sum)).*'
http_requests_total{handler="/v1/completions",method="POST",status="2xx"} 201.0
http_request_size_bytes_count{handler="/v1/completions"} 201.0
http_response_size_bytes_count{handler="/v1/completions"} 201.0
http_request_duration_highr_seconds_count 201.0
http_request_duration_seconds_count{handler="/v1/completions",method="POST"} 201.0
```

Example 3 (yaml):
```yaml
$ curl http://0.0.0.0:8000/metrics
# HELP vllm:num_requests_running Number of requests in model execution batches.
# TYPE vllm:num_requests_running gauge
vllm:num_requests_running{model_name="meta-llama/Llama-3.1-8B-Instruct"} 8.0
...
# HELP vllm:generation_tokens_total Number of generation tokens processed.
# TYPE vllm:generation_tokens_total counter
vllm:generation_tokens_total{model_name="meta-llama/Llama-3.1-8B-Instruct"} 27453.0
...
# HELP vllm:request_success_total Count of successfully processed requests.
# TYPE vllm:request_success_total counter
vllm:request_success_total{finished_reason="stop",model_name="meta-llama/Llama-3.1-8B-Instruct"} 1.0
vllm:request_success_total{finished_reason="length",model_name="meta-llama/Llama-3.1-8B-Instruct"} 131.0
vllm:request_success_total{finished_reason="abort",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
...
# HELP vllm:time_to_first_token_seconds Histogram of time to first token in seconds.
# TYPE vllm:time_to_first_token_seconds histogram
vllm:time_to_first_token_seconds_bucket{le="0.001",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
vllm:time_to_first_token_seconds_bucket{le="0.005",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
vllm:time_to_first_token_seconds_bucket{le="0.01",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
vllm:time_to_first_token_seconds_bucket{le="0.02",model_name="meta-llama/Llama-3.1-8B-Instruct"} 13.0
vllm:time_to_first_token_seconds_bucket{le="0.04",model_name="meta-llama/Llama-3.1-8B-Instruct"} 97.0
vllm:time_to_first_token_seconds_bucket{le="0.06",model_name="meta-llama/Llama-3.1-8B-Instruct"} 123.0
vllm:time_to_first_token_seconds_bucket{le="0.08",model_name="meta-llama/Llama-3.1-8B-Instruct"} 138.0
vllm:time_to_first_token_seconds_bucket{le="0.1",model_name="meta-llama/Llama-3.1-8B-Instruct"} 140.0
vllm:time_to_first_token_seconds_count{model_name="meta-llama/Llama-3.1-8B-Instruct"} 140.0
```

Example 4 (yaml):
```yaml
$ curl http://0.0.0.0:8000/metrics
# HELP vllm:num_requests_running Number of requests in model execution batches.
# TYPE vllm:num_requests_running gauge
vllm:num_requests_running{model_name="meta-llama/Llama-3.1-8B-Instruct"} 8.0
...
# HELP vllm:generation_tokens_total Number of generation tokens processed.
# TYPE vllm:generation_tokens_total counter
vllm:generation_tokens_total{model_name="meta-llama/Llama-3.1-8B-Instruct"} 27453.0
...
# HELP vllm:request_success_total Count of successfully processed requests.
# TYPE vllm:request_success_total counter
vllm:request_success_total{finished_reason="stop",model_name="meta-llama/Llama-3.1-8B-Instruct"} 1.0
vllm:request_success_total{finished_reason="length",model_name="meta-llama/Llama-3.1-8B-Instruct"} 131.0
vllm:request_success_total{finished_reason="abort",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
...
# HELP vllm:time_to_first_token_seconds Histogram of time to first token in seconds.
# TYPE vllm:time_to_first_token_seconds histogram
vllm:time_to_first_token_seconds_bucket{le="0.001",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
vllm:time_to_first_token_seconds_bucket{le="0.005",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
vllm:time_to_first_token_seconds_bucket{le="0.01",model_name="meta-llama/Llama-3.1-8B-Instruct"} 0.0
vllm:time_to_first_token_seconds_bucket{le="0.02",model_name="meta-llama/Llama-3.1-8B-Instruct"} 13.0
vllm:time_to_first_token_seconds_bucket{le="0.04",model_name="meta-llama/Llama-3.1-8B-Instruct"} 97.0
vllm:time_to_first_token_seconds_bucket{le="0.06",model_name="meta-llama/Llama-3.1-8B-Instruct"} 123.0
vllm:time_to_first_token_seconds_bucket{le="0.08",model_name="meta-llama/Llama-3.1-8B-Instruct"} 138.0
vllm:time_to_first_token_seconds_bucket{le="0.1",model_name="meta-llama/Llama-3.1-8B-Instruct"} 140.0
vllm:time_to_first_token_seconds_count{model_name="meta-llama/Llama-3.1-8B-Instruct"} 140.0
```

---

## Modal - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/modal/

**Contents:**
- Modal¶

vLLM can be run on cloud GPUs with Modal, a serverless computing platform designed for fast auto-scaling.

For details on how to deploy vLLM on Modal, see this tutorial in the Modal documentation.

---

## Monitoring Dashboards - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/dashboards/

**Contents:**
- Monitoring Dashboards¶
- Dashboard Platforms¶
- Dashboard Format Approach¶
  - Grafana (JSON)¶
  - Perses (YAML)¶
- Dashboard Contents¶
- Quick Start¶
  - Grafana¶
  - Perses¶
- Requirements¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/dashboards.

This directory contains monitoring dashboard configurations for vLLM, providing comprehensive observability for your vLLM deployments.

We provide dashboards for two popular observability platforms:

All dashboards are provided in native formats that work across different deployment methods:

Both platforms provide equivalent monitoring capabilities:

First, navigate to this example's directory:

Import the JSON directly into the Grafana UI, or use the API:

Import via the Perses CLI:

For detailed deployment instructions and platform-specific options, see:

When adding new dashboards, please:

This directory contains Grafana dashboard configurations (as JSON) designed to monitor vLLM performance and metrics.

The easiest way to use these dashboards is to manually import the JSON configurations directly into your Grafana instance:

If you're using the Grafana Operator in Kubernetes, you can wrap these JSON configurations in a GrafanaDashboard custom resource:

Then apply to your cluster:

This directory contains Perses dashboard configurations designed to monitor vLLM performance and metrics.

We provide dashboards in the native Perses YAML format that works across all deployment methods:

Import the dashboard specifications via Perses API or CLI:

The native YAML format works directly with the Perses Operator:

Place the YAML files in a Perses provisioning folder for automatic loading.

**Examples:**

Example 1 (unknown):
```unknown
cd examples/online_serving/dashboards
```

Example 2 (unknown):
```unknown
cd examples/online_serving/dashboards
```

Example 3 (python):
```python
curl -X POST http://grafana/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @grafana/performance_statistics.json
```

Example 4 (python):
```python
curl -X POST http://grafana/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @grafana/performance_statistics.json
```

---

## Multi Instance Data Parallel - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/multi_instance_data_parallel/

**Contents:**
- Multi Instance Data Parallel¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/multi_instance_data_parallel.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import asyncio
import threading

from vllm.engine.arg_utils import AsyncEngineArgs
from vllm.engine.async_llm_engine import AsyncLLMEngine
from vllm.outputs import RequestOutput
from vllm.sampling_params import SamplingParams
from vllm.v1.metrics.loggers import AggregatedLoggingStatLogger

"""
To run this example, run the following commands simultaneously with
different CUDA_VISIBLE_DEVICES:
    python examples/online_serving/multi_instance_data_parallel.py

    vllm serve ibm-research/PowerMoE-3b -dp 2 -dpr 1 \
        --data-parallel-address 127.0.0.1 --data-parallel-rpc-port 62300 \
        --data-parallel-size-local 1 --enforce-eager --headless

Once both instances have completed the handshake, this example will
send a request to the instance with DP rank 1.
"""


def _do_background_logging(engine, interval, stop_event):
    try:
        while not stop_event.is_set():
            asyncio.run(engine.do_log_stats())
            stop_event.wait(interval)
    except Exception as e:
        print(f"vLLM background logging shutdown: {e}")
        pass


async def main():
    engine_args = AsyncEngineArgs(
        model="ibm-research/PowerMoE-3b",
        data_parallel_size=2,
        tensor_parallel_size=1,
        dtype="auto",
        max_model_len=2048,
        data_parallel_address="127.0.0.1",
        data_parallel_rpc_port=62300,
        data_parallel_size_local=1,
        enforce_eager=True,
        enable_log_requests=True,
        disable_custom_all_reduce=True,
    )

    engine_client = AsyncLLMEngine.from_engine_args(
        engine_args,
        # Example: Using aggregated logger
        stat_loggers=[AggregatedLoggingStatLogger],
    )
    stop_logging_event = threading.Event()
    logging_thread = threading.Thread(
        target=_do_background_logging,
        args=(engine_client, 5, stop_logging_event),
        daemon=True,
    )
    logging_thread.start()
    sampling_params = SamplingParams(
        temperature=0.7,
        top_p=0.9,
        max_tokens=100,
    )
    num_prompts = 10
    for i in range(num_prompts):
        prompt = "Who won the 2004 World Series?"
        final_output: RequestOutput | None = None
        async for output in engine_client.generate(
            prompt=prompt,
            sampling_params=sampling_params,
            request_id=f"abcdef-{i}",
            data_parallel_rank=1,
        ):
            final_output = output
        if final_output:
            print(final_output.outputs[0].text)

    stop_logging_event.set()
    logging_thread.join()


if __name__ == "__main__":
    asyncio.run(main())
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import asyncio
import threading

from vllm.engine.arg_utils import AsyncEngineArgs
from vllm.engine.async_llm_engine import AsyncLLMEngine
from vllm.outputs import RequestOutput
from vllm.sampling_params import SamplingParams
from vllm.v1.metrics.loggers import AggregatedLoggingStatLogger

"""
To run this example, run the following commands simultaneously with
different CUDA_VISIBLE_DEVICES:
    python examples/online_serving/multi_instance_data_parallel.py

    vllm serve ibm-research/PowerMoE-3b -dp 2 -dpr 1 \
        --data-parallel-address 127.0.0.1 --data-parallel-rpc-port 62300 \
        --data-parallel-size-local 1 --enforce-eager --headless

Once both instances have completed the handshake, this example will
send a request to the instance with DP rank 1.
"""


def _do_background_logging(engine, interval, stop_event):
    try:
        while not stop_event.is_set():
            asyncio.run(engine.do_log_stats())
            stop_event.wait(interval)
    except Exception as e:
        print(f"vLLM background logging shutdown: {e}")
        pass


async def main():
    engine_args = AsyncEngineArgs(
        model="ibm-research/PowerMoE-3b",
        data_parallel_size=2,
        tensor_parallel_size=1,
        dtype="auto",
        max_model_len=2048,
        data_parallel_address="127.0.0.1",
        data_parallel_rpc_port=62300,
        data_parallel_size_local=1,
        enforce_eager=True,
        enable_log_requests=True,
        disable_custom_all_reduce=True,
    )

    engine_client = AsyncLLMEngine.from_engine_args(
        engine_args,
        # Example: Using aggregated logger
        stat_loggers=[AggregatedLoggingStatLogger],
    )
    stop_logging_event = threading.Event()
    logging_thread = threading.Thread(
        target=_do_background_logging,
        args=(engine_client, 5, stop_logging_event),
        daemon=True,
    )
    logging_thread.start()
    sampling_params = SamplingParams(
        temperature=0.7,
        top_p=0.9,
        max_tokens=100,
    )
    num_prompts = 10
    for i in range(num_prompts):
        prompt = "Who won the 2004 World Series?"
        final_output: RequestOutput | None = None
        async for output in engine_client.generate(
            prompt=prompt,
            sampling_params=sampling_params,
            request_id=f"abcdef-{i}",
            data_parallel_rank=1,
        ):
            final_output = output
        if final_output:
            print(final_output.outputs[0].text)

    stop_logging_event.set()
    logging_thread.join()


if __name__ == "__main__":
    asyncio.run(main())
```

---

## Multi-Node-Serving - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/multi-node-serving/

**Contents:**
- Multi-Node-Serving¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/multi-node-serving.sh.

**Examples:**

Example 1 (bash):
```bash
#!/bin/bash
#
# Helper script to manually start or join a Ray cluster for online serving of vLLM models.
# This script is first executed on the head node, and then on each worker node with the IP address
# of the head node.
#
# Subcommands:
#   leader: Launches a Ray head node and blocks until the cluster reaches the expected size (head + workers).
#   worker: Starts a worker node that connects to an existing Ray head node.
#
# Example usage:
# On the head node machine, start the Ray head node process and run a vLLM server.
#   ./multi-node-serving.sh leader --ray_port=6379 --ray_cluster_size=<SIZE> [<extra ray args>]  && \
#   vllm serve meta-llama/Meta-Llama-3.1-405B-Instruct --port 8080 --tensor-parallel-size 8 --pipeline_parallel_size 2
# 
# On each worker node, start the Ray worker node process.
#   ./multi-node-serving.sh worker --ray_address=<HEAD_NODE_IP> --ray_port=6379 [<extra ray args>]
#
# About Ray:
# Ray is an open-source distributed execution framework that simplifies
# distributed computing. Learn more:
# https://ray.io/


subcommand=$1  # Either "leader" or "worker".
shift          # Remove the subcommand from the argument list.

ray_port=6379              # Port used by the Ray head node.
ray_init_timeout=300       # Seconds to wait before timing out.
declare -a start_params    # Parameters forwarded to the underlying 'ray start' command.

# Handle the worker subcommand.
case "$subcommand" in
  worker)
    ray_address=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --ray_address=*)
          ray_address="${1#*=}"
          ;;
        --ray_port=*)
          ray_port="${1#*=}"
          ;;
        --ray_init_timeout=*)
          ray_init_timeout="${1#*=}"
          ;;
        *)
          start_params+=("$1")
      esac
      shift
    done

    if [ -z "$ray_address" ]; then
      echo "Error: Missing argument --ray_address"
      exit 1
    fi

    # Retry until the worker node connects to the head node or the timeout expires.
    for (( i=0; i < $ray_init_timeout; i+=5 )); do
      ray start --address=$ray_address:$ray_port --block "${start_params[@]}"
      if [ $? -eq 0 ]; then
        echo "Worker: Ray runtime started with head address $ray_address:$ray_port"
        exit 0
      fi
      echo "Waiting until the ray worker is active..."
      sleep 5s;
    done
    echo "Ray worker starts timeout, head address: $ray_address:$ray_port"
    exit 1
    ;;

  # Handle the leader subcommand.
  leader)
    ray_cluster_size=""
    while [ $# -gt 0 ]; do
          case "$1" in
            --ray_port=*)
              ray_port="${1#*=}"
              ;;
            --ray_cluster_size=*)
              ray_cluster_size="${1#*=}"
              ;;
            --ray_init_timeout=*)
              ray_init_timeout="${1#*=}"
              ;;
            *)
              start_params+=("$1")
          esac
          shift
    done

    if [ -z "$ray_cluster_size" ]; then
      echo "Error: Missing argument --ray_cluster_size"
      exit 1
    fi

    # Start the Ray head node.
    ray start --head --port=$ray_port "${start_params[@]}"

    # Poll Ray until every worker node is active.
    for (( i=0; i < $ray_init_timeout; i+=5 )); do
        active_nodes=`python3 -c 'import ray; ray.init(); print(sum(node["Alive"] for node in ray.nodes()))'`
        if [ $active_nodes -eq $ray_cluster_size ]; then
          echo "All ray workers are active and the ray cluster is initialized successfully."
          exit 0
        fi
        echo "Wait for all ray workers to be active. $active_nodes/$ray_cluster_size is active"
        sleep 5s;
    done

    echo "Waiting for all ray workers to be active timed out."
    exit 1
    ;;

  *)
    echo "unknown subcommand: $subcommand"
    exit 1
    ;;
esac
```

Example 2 (bash):
```bash
#!/bin/bash
#
# Helper script to manually start or join a Ray cluster for online serving of vLLM models.
# This script is first executed on the head node, and then on each worker node with the IP address
# of the head node.
#
# Subcommands:
#   leader: Launches a Ray head node and blocks until the cluster reaches the expected size (head + workers).
#   worker: Starts a worker node that connects to an existing Ray head node.
#
# Example usage:
# On the head node machine, start the Ray head node process and run a vLLM server.
#   ./multi-node-serving.sh leader --ray_port=6379 --ray_cluster_size=<SIZE> [<extra ray args>]  && \
#   vllm serve meta-llama/Meta-Llama-3.1-405B-Instruct --port 8080 --tensor-parallel-size 8 --pipeline_parallel_size 2
# 
# On each worker node, start the Ray worker node process.
#   ./multi-node-serving.sh worker --ray_address=<HEAD_NODE_IP> --ray_port=6379 [<extra ray args>]
#
# About Ray:
# Ray is an open-source distributed execution framework that simplifies
# distributed computing. Learn more:
# https://ray.io/


subcommand=$1  # Either "leader" or "worker".
shift          # Remove the subcommand from the argument list.

ray_port=6379              # Port used by the Ray head node.
ray_init_timeout=300       # Seconds to wait before timing out.
declare -a start_params    # Parameters forwarded to the underlying 'ray start' command.

# Handle the worker subcommand.
case "$subcommand" in
  worker)
    ray_address=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --ray_address=*)
          ray_address="${1#*=}"
          ;;
        --ray_port=*)
          ray_port="${1#*=}"
          ;;
        --ray_init_timeout=*)
          ray_init_timeout="${1#*=}"
          ;;
        *)
          start_params+=("$1")
      esac
      shift
    done

    if [ -z "$ray_address" ]; then
      echo "Error: Missing argument --ray_address"
      exit 1
    fi

    # Retry until the worker node connects to the head node or the timeout expires.
    for (( i=0; i < $ray_init_timeout; i+=5 )); do
      ray start --address=$ray_address:$ray_port --block "${start_params[@]}"
      if [ $? -eq 0 ]; then
        echo "Worker: Ray runtime started with head address $ray_address:$ray_port"
        exit 0
      fi
      echo "Waiting until the ray worker is active..."
      sleep 5s;
    done
    echo "Ray worker starts timeout, head address: $ray_address:$ray_port"
    exit 1
    ;;

  # Handle the leader subcommand.
  leader)
    ray_cluster_size=""
    while [ $# -gt 0 ]; do
          case "$1" in
            --ray_port=*)
              ray_port="${1#*=}"
              ;;
            --ray_cluster_size=*)
              ray_cluster_size="${1#*=}"
              ;;
            --ray_init_timeout=*)
              ray_init_timeout="${1#*=}"
              ;;
            *)
              start_params+=("$1")
          esac
          shift
    done

    if [ -z "$ray_cluster_size" ]; then
      echo "Error: Missing argument --ray_cluster_size"
      exit 1
    fi

    # Start the Ray head node.
    ray start --head --port=$ray_port "${start_params[@]}"

    # Poll Ray until every worker node is active.
    for (( i=0; i < $ray_init_timeout; i+=5 )); do
        active_nodes=`python3 -c 'import ray; ray.init(); print(sum(node["Alive"] for node in ray.nodes()))'`
        if [ $active_nodes -eq $ray_cluster_size ]; then
          echo "All ray workers are active and the ray cluster is initialized successfully."
          exit 0
        fi
        echo "Wait for all ray workers to be active. $active_nodes/$ray_cluster_size is active"
        sleep 5s;
    done

    echo "Waiting for all ray workers to be active timed out."
    exit 1
    ;;

  *)
    echo "unknown subcommand: $subcommand"
    exit 1
    ;;
esac
```

---

## NVIDIA Triton - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/triton/

**Contents:**
- NVIDIA Triton¶

The Triton Inference Server hosts a tutorial demonstrating how to quickly deploy a simple facebook/opt-125m model using vLLM. Please see Deploying a vLLM model in Triton for more details.

---

## Offline Inference - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/offline_inference/

**Contents:**
- Offline Inference¶
- Ray Data LLM API¶

Offline inference is possible in your own code using vLLM's LLM class.

For example, the following code downloads the facebook/opt-125m model from HuggingFace and runs it in vLLM using the default configuration.

After initializing the LLM instance, use the available APIs to perform model inference. The available APIs depend on the model type:

Ray Data LLM is an alternative offline inference API that uses vLLM as the underlying engine. This API adds several batteries-included capabilities that simplify large-scale, GPU-efficient inference:

For more information about the Ray Data LLM API, see the Ray Data LLM documentation.

**Examples:**

Example 1 (python):
```python
from vllm import LLM

# Initialize the vLLM engine.
llm = LLM(model="facebook/opt-125m")
```

Example 2 (python):
```python
from vllm import LLM

# Initialize the vLLM engine.
llm = LLM(model="facebook/opt-125m")
```

Example 3 (json):
```json
import ray  # Requires ray>=2.44.1
from ray.data.llm import vLLMEngineProcessorConfig, build_llm_processor

config = vLLMEngineProcessorConfig(model_source="unsloth/Llama-3.2-1B-Instruct")
processor = build_llm_processor(
    config,
    preprocess=lambda row: {
        "messages": [
            {"role": "system", "content": "You are a bot that completes unfinished haikus."},
            {"role": "user", "content": row["item"]},
        ],
        "sampling_params": {"temperature": 0.3, "max_tokens": 250},
    },
    postprocess=lambda row: {"answer": row["generated_text"]},
)

ds = ray.data.from_items(["An old silent pond..."])
ds = processor(ds)
ds.write_parquet("local:///tmp/data/")
```

Example 4 (json):
```json
import ray  # Requires ray>=2.44.1
from ray.data.llm import vLLMEngineProcessorConfig, build_llm_processor

config = vLLMEngineProcessorConfig(model_source="unsloth/Llama-3.2-1B-Instruct")
processor = build_llm_processor(
    config,
    preprocess=lambda row: {
        "messages": [
            {"role": "system", "content": "You are a bot that completes unfinished haikus."},
            {"role": "user", "content": row["item"]},
        ],
        "sampling_params": {"temperature": 0.3, "max_tokens": 250},
    },
    postprocess=lambda row: {"answer": row["generated_text"]},
)

ds = ray.data.from_items(["An old silent pond..."])
ds = processor(ds)
ds.write_parquet("local:///tmp/data/")
```

---

## OpenAI Chat Completion Client For Multimodal - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_client_for_multimodal/

**Contents:**
- OpenAI Chat Completion Client For Multimodal¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_client_for_multimodal.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""An example showing how to use vLLM to serve multimodal models
and run online serving with OpenAI client.

Launch the vLLM server with the following command:

(single image inference with Llava)
vllm serve llava-hf/llava-1.5-7b-hf

(multi-image inference with Phi-3.5-vision-instruct)
vllm serve microsoft/Phi-3.5-vision-instruct --runner generate \
    --trust-remote-code --max-model-len 4096 --limit-mm-per-prompt '{"image":2}'

(audio inference with Ultravox)
vllm serve fixie-ai/ultravox-v0_5-llama-3_2-1b \
    --max-model-len 4096 --trust-remote-code

run the script with
python openai_chat_completion_client_for_multimodal.py --chat-type audio
"""

import base64

import requests
from openai import OpenAI
from utils import get_first_model

from vllm.utils.argparse_utils import FlexibleArgumentParser

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=openai_api_key,
    base_url=openai_api_base,
)

headers = {"User-Agent": "vLLM Example Client"}


def encode_base64_content_from_url(content_url: str) -> str:
    """Encode a content retrieved from a remote url to base64 format."""

    with requests.get(content_url, headers=headers) as response:
        response.raise_for_status()
        result = base64.b64encode(response.content).decode("utf-8")

    return result


# Text-only inference
def run_text_only(model: str, max_completion_tokens: int) -> None:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "What's the capital of France?"}],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion.choices[0].message.content
    print("Chat completion output:\n", result)


# Single-image input inference
def run_single_image(model: str, max_completion_tokens: int) -> None:
    ## Use image url in the payload
    image_url = "https://vllm-public-assets.s3.us-west-2.amazonaws.com/vision_model_images/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output from image url:\n", result)

    ## Use base64 encoded image in the payload
    image_base64 = encode_base64_content_from_url(image_url)
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from base64 encoded image:", result)


# Multi-image input inference
def run_multi_image(model: str, max_completion_tokens: int) -> None:
    image_url_duck = "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/duck.jpg"
    image_url_lion = "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/lion.jpg"
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What are the animals in these images?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url_duck},
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url_lion},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output:\n", result)


# Video input inference
def run_video(model: str, max_completion_tokens: int) -> None:
    video_url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    video_base64 = encode_base64_content_from_url(video_url)

    ## Use video url in the payload
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this video?"},
                    {
                        "type": "video_url",
                        "video_url": {"url": video_url},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output from video url:\n", result)

    ## Use base64 encoded video in the payload
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this video?"},
                    {
                        "type": "video_url",
                        "video_url": {"url": f"data:video/mp4;base64,{video_base64}"},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from base64 encoded video:\n", result)


# Audio input inference
def run_audio(model: str, max_completion_tokens: int) -> None:
    from vllm.assets.audio import AudioAsset

    audio_url = AudioAsset("winning_call").url
    audio_base64 = encode_base64_content_from_url(audio_url)

    # OpenAI-compatible schema (`input_audio`)
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this audio?"},
                    {
                        "type": "input_audio",
                        "input_audio": {
                            # Any format supported by librosa is supported
                            "data": audio_base64,
                            "format": "wav",
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from input audio:\n", result)

    # HTTP URL
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this audio?"},
                    {
                        "type": "audio_url",
                        "audio_url": {
                            # Any format supported by librosa is supported
                            "url": audio_url
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output from audio url:\n", result)

    # base64 URL
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this audio?"},
                    {
                        "type": "audio_url",
                        "audio_url": {
                            # Any format supported by librosa is supported
                            "url": f"data:audio/ogg;base64,{audio_base64}"
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from base64 encoded audio:\n", result)


def run_multi_audio(model: str, max_completion_tokens: int) -> None:
    from vllm.assets.audio import AudioAsset

    # Two different audios to showcase batched inference.
    audio_url = AudioAsset("winning_call").url
    audio_base64 = encode_base64_content_from_url(audio_url)
    audio_url2 = AudioAsset("azacinto_foscolo").url
    audio_base64_2 = encode_base64_content_from_url(audio_url2)

    # OpenAI-compatible schema (`input_audio`)
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Are these two audios the same?"},
                    {
                        "type": "input_audio",
                        "input_audio": {
                            "data": audio_base64,
                            "format": "wav",
                        },
                    },
                    {
                        "type": "input_audio",
                        "input_audio": {
                            "data": audio_base64_2,
                            "format": "wav",
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from input audio:\n", result)


example_function_map = {
    "text-only": run_text_only,
    "single-image": run_single_image,
    "multi-image": run_multi_image,
    "multi-audio": run_multi_audio,
    "video": run_video,
    "audio": run_audio,
}


def parse_args():
    parser = FlexibleArgumentParser(
        description="Demo on using OpenAI client for online serving with "
        "multimodal language models served with vLLM."
    )
    parser.add_argument(
        "--chat-type",
        "-c",
        type=str,
        default="single-image",
        choices=list(example_function_map.keys()),
        help="Conversation type with multimodal data.",
    )
    parser.add_argument(
        "--max-completion-tokens",
        "-n",
        type=int,
        default=128,
        help="Maximum number of tokens to generate for each completion.",
    )
    return parser.parse_args()


def main(args) -> None:
    chat_type = args.chat_type
    model = get_first_model(client)
    example_function_map[chat_type](model, args.max_completion_tokens)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""An example showing how to use vLLM to serve multimodal models
and run online serving with OpenAI client.

Launch the vLLM server with the following command:

(single image inference with Llava)
vllm serve llava-hf/llava-1.5-7b-hf

(multi-image inference with Phi-3.5-vision-instruct)
vllm serve microsoft/Phi-3.5-vision-instruct --runner generate \
    --trust-remote-code --max-model-len 4096 --limit-mm-per-prompt '{"image":2}'

(audio inference with Ultravox)
vllm serve fixie-ai/ultravox-v0_5-llama-3_2-1b \
    --max-model-len 4096 --trust-remote-code

run the script with
python openai_chat_completion_client_for_multimodal.py --chat-type audio
"""

import base64

import requests
from openai import OpenAI
from utils import get_first_model

from vllm.utils.argparse_utils import FlexibleArgumentParser

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=openai_api_key,
    base_url=openai_api_base,
)

headers = {"User-Agent": "vLLM Example Client"}


def encode_base64_content_from_url(content_url: str) -> str:
    """Encode a content retrieved from a remote url to base64 format."""

    with requests.get(content_url, headers=headers) as response:
        response.raise_for_status()
        result = base64.b64encode(response.content).decode("utf-8")

    return result


# Text-only inference
def run_text_only(model: str, max_completion_tokens: int) -> None:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "What's the capital of France?"}],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion.choices[0].message.content
    print("Chat completion output:\n", result)


# Single-image input inference
def run_single_image(model: str, max_completion_tokens: int) -> None:
    ## Use image url in the payload
    image_url = "https://vllm-public-assets.s3.us-west-2.amazonaws.com/vision_model_images/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output from image url:\n", result)

    ## Use base64 encoded image in the payload
    image_base64 = encode_base64_content_from_url(image_url)
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from base64 encoded image:", result)


# Multi-image input inference
def run_multi_image(model: str, max_completion_tokens: int) -> None:
    image_url_duck = "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/duck.jpg"
    image_url_lion = "https://vllm-public-assets.s3.us-west-2.amazonaws.com/multimodal_asset/lion.jpg"
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What are the animals in these images?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url_duck},
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url_lion},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output:\n", result)


# Video input inference
def run_video(model: str, max_completion_tokens: int) -> None:
    video_url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    video_base64 = encode_base64_content_from_url(video_url)

    ## Use video url in the payload
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this video?"},
                    {
                        "type": "video_url",
                        "video_url": {"url": video_url},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output from video url:\n", result)

    ## Use base64 encoded video in the payload
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this video?"},
                    {
                        "type": "video_url",
                        "video_url": {"url": f"data:video/mp4;base64,{video_base64}"},
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from base64 encoded video:\n", result)


# Audio input inference
def run_audio(model: str, max_completion_tokens: int) -> None:
    from vllm.assets.audio import AudioAsset

    audio_url = AudioAsset("winning_call").url
    audio_base64 = encode_base64_content_from_url(audio_url)

    # OpenAI-compatible schema (`input_audio`)
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this audio?"},
                    {
                        "type": "input_audio",
                        "input_audio": {
                            # Any format supported by librosa is supported
                            "data": audio_base64,
                            "format": "wav",
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from input audio:\n", result)

    # HTTP URL
    chat_completion_from_url = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this audio?"},
                    {
                        "type": "audio_url",
                        "audio_url": {
                            # Any format supported by librosa is supported
                            "url": audio_url
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_url.choices[0].message.content
    print("Chat completion output from audio url:\n", result)

    # base64 URL
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this audio?"},
                    {
                        "type": "audio_url",
                        "audio_url": {
                            # Any format supported by librosa is supported
                            "url": f"data:audio/ogg;base64,{audio_base64}"
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from base64 encoded audio:\n", result)


def run_multi_audio(model: str, max_completion_tokens: int) -> None:
    from vllm.assets.audio import AudioAsset

    # Two different audios to showcase batched inference.
    audio_url = AudioAsset("winning_call").url
    audio_base64 = encode_base64_content_from_url(audio_url)
    audio_url2 = AudioAsset("azacinto_foscolo").url
    audio_base64_2 = encode_base64_content_from_url(audio_url2)

    # OpenAI-compatible schema (`input_audio`)
    chat_completion_from_base64 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Are these two audios the same?"},
                    {
                        "type": "input_audio",
                        "input_audio": {
                            "data": audio_base64,
                            "format": "wav",
                        },
                    },
                    {
                        "type": "input_audio",
                        "input_audio": {
                            "data": audio_base64_2,
                            "format": "wav",
                        },
                    },
                ],
            }
        ],
        model=model,
        max_completion_tokens=max_completion_tokens,
    )

    result = chat_completion_from_base64.choices[0].message.content
    print("Chat completion output from input audio:\n", result)


example_function_map = {
    "text-only": run_text_only,
    "single-image": run_single_image,
    "multi-image": run_multi_image,
    "multi-audio": run_multi_audio,
    "video": run_video,
    "audio": run_audio,
}


def parse_args():
    parser = FlexibleArgumentParser(
        description="Demo on using OpenAI client for online serving with "
        "multimodal language models served with vLLM."
    )
    parser.add_argument(
        "--chat-type",
        "-c",
        type=str,
        default="single-image",
        choices=list(example_function_map.keys()),
        help="Conversation type with multimodal data.",
    )
    parser.add_argument(
        "--max-completion-tokens",
        "-n",
        type=int,
        default=128,
        help="Maximum number of tokens to generate for each completion.",
    )
    return parser.parse_args()


def main(args) -> None:
    chat_type = args.chat_type
    model = get_first_model(client)
    example_function_map[chat_type](model, args.max_completion_tokens)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## OpenAI Chat Completion Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_client/

**Contents:**
- OpenAI Chat Completion Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for OpenAI Chat Completion using vLLM API server
NOTE: start a supported chat completion model server with `vllm serve`, e.g.
    vllm serve meta-llama/Llama-2-7b-chat-hf
"""

import argparse

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
    },
    {"role": "user", "content": "Where was it played?"},
]


def parse_args():
    parser = argparse.ArgumentParser(description="Client for vLLM API server")
    parser.add_argument(
        "--stream", action="store_true", help="Enable streaming response"
    )
    return parser.parse_args()


def main(args):
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Chat Completion API
    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        stream=args.stream,
    )

    print("-" * 50)
    print("Chat completion results:")
    if args.stream:
        for c in chat_completion:
            print(c)
    else:
        print(chat_completion)
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for OpenAI Chat Completion using vLLM API server
NOTE: start a supported chat completion model server with `vllm serve`, e.g.
    vllm serve meta-llama/Llama-2-7b-chat-hf
"""

import argparse

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
    },
    {"role": "user", "content": "Where was it played?"},
]


def parse_args():
    parser = argparse.ArgumentParser(description="Client for vLLM API server")
    parser.add_argument(
        "--stream", action="store_true", help="Enable streaming response"
    )
    return parser.parse_args()


def main(args):
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Chat Completion API
    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        stream=args.stream,
    )

    print("-" * 50)
    print("Chat completion results:")
    if args.stream:
        for c in chat_completion:
            print(c)
    else:
        print(chat_completion)
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## OpenAI Chat Completion Client With Tools Required - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_client_with_tools_required/

**Contents:**
- OpenAI Chat Completion Client With Tools Required¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_client_with_tools_required.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
To run this example, you can start the vLLM server
without any specific flags:

```bash
vllm serve unsloth/Llama-3.2-1B-Instruct \
    --structured-outputs-config.backend outlines
```

This example demonstrates how to generate chat completions
using the OpenAI Python client library.
"""

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The city to find the weather for"
                        ", e.g. 'San Francisco'",
                    },
                    "state": {
                        "type": "string",
                        "description": (
                            "the two-letter abbreviation for the state that the "
                            "city is in, e.g. 'CA' which would mean 'California'"
                        ),
                    },
                    "unit": {
                        "type": "string",
                        "description": "The unit to fetch the temperature in",
                        "enum": ["celsius", "fahrenheit"],
                    },
                },
                "required": ["city", "state", "unit"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_forecast",
            "description": "Get the weather forecast for a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": (
                            "The city to get the forecast for, e.g. 'New York'"
                        ),
                    },
                    "state": {
                        "type": "string",
                        "description": (
                            "The two-letter abbreviation for the state, e.g. 'NY'"
                        ),
                    },
                    "days": {
                        "type": "integer",
                        "description": "Number of days to get the forecast for (1-7)",
                    },
                    "unit": {
                        "type": "string",
                        "description": "The unit to fetch the temperature in",
                        "enum": ["celsius", "fahrenheit"],
                    },
                },
                "required": ["city", "state", "days", "unit"],
            },
        },
    },
]

messages = [
    {"role": "user", "content": "Hi! How are you doing today?"},
    {"role": "assistant", "content": "I'm doing well! How can I help you?"},
    {
        "role": "user",
        "content": "Can you tell me what the current weather is in Dallas \
            and the forecast for the next 5 days, in fahrenheit?",
    },
]


def main():
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        tools=tools,
        tool_choice="required",
        stream=True,  # Enable streaming response
    )

    for chunk in chat_completion:
        if chunk.choices and chunk.choices[0].delta.tool_calls:
            print(chunk.choices[0].delta.tool_calls)

    chat_completion = client.chat.completions.create(
        messages=messages, model=model, tools=tools, tool_choice="required"
    )

    print(chat_completion.choices[0].message.tool_calls)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
To run this example, you can start the vLLM server
without any specific flags:

```bash
vllm serve unsloth/Llama-3.2-1B-Instruct \
    --structured-outputs-config.backend outlines
```

This example demonstrates how to generate chat completions
using the OpenAI Python client library.
"""

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The city to find the weather for"
                        ", e.g. 'San Francisco'",
                    },
                    "state": {
                        "type": "string",
                        "description": (
                            "the two-letter abbreviation for the state that the "
                            "city is in, e.g. 'CA' which would mean 'California'"
                        ),
                    },
                    "unit": {
                        "type": "string",
                        "description": "The unit to fetch the temperature in",
                        "enum": ["celsius", "fahrenheit"],
                    },
                },
                "required": ["city", "state", "unit"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_forecast",
            "description": "Get the weather forecast for a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": (
                            "The city to get the forecast for, e.g. 'New York'"
                        ),
                    },
                    "state": {
                        "type": "string",
                        "description": (
                            "The two-letter abbreviation for the state, e.g. 'NY'"
                        ),
                    },
                    "days": {
                        "type": "integer",
                        "description": "Number of days to get the forecast for (1-7)",
                    },
                    "unit": {
                        "type": "string",
                        "description": "The unit to fetch the temperature in",
                        "enum": ["celsius", "fahrenheit"],
                    },
                },
                "required": ["city", "state", "days", "unit"],
            },
        },
    },
]

messages = [
    {"role": "user", "content": "Hi! How are you doing today?"},
    {"role": "assistant", "content": "I'm doing well! How can I help you?"},
    {
        "role": "user",
        "content": "Can you tell me what the current weather is in Dallas \
            and the forecast for the next 5 days, in fahrenheit?",
    },
]


def main():
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        tools=tools,
        tool_choice="required",
        stream=True,  # Enable streaming response
    )

    for chunk in chat_completion:
        if chunk.choices and chunk.choices[0].delta.tool_calls:
            print(chunk.choices[0].delta.tool_calls)

    chat_completion = client.chat.completions.create(
        messages=messages, model=model, tools=tools, tool_choice="required"
    )

    print(chat_completion.choices[0].message.tool_calls)


if __name__ == "__main__":
    main()
```

---

## OpenAI Chat Completion Client With Tools - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_client_with_tools/

**Contents:**
- OpenAI Chat Completion Client With Tools¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_client_with_tools.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled. For example:

IMPORTANT: for mistral, you must use one of the provided mistral tool call
templates, or your own - the model default doesn't work for tool calls with vLLM
See the vLLM docs on OpenAI server & tool calling for more details.

vllm serve mistralai/Mistral-7B-Instruct-v0.3 \
            --chat-template examples/tool_chat_template_mistral.jinja \
            --enable-auto-tool-choice --tool-call-parser mistral

OR
vllm serve NousResearch/Hermes-2-Pro-Llama-3-8B \
            --chat-template examples/tool_chat_template_hermes.jinja \
            --enable-auto-tool-choice --tool-call-parser hermes
"""

import json
from typing import Any

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

properties = {
    "city": {
        "type": "string",
        "description": "The city to find the weather for, e.g. 'San Francisco'",
    },
    "state": {
        "type": "string",
        "description": "the two-letter abbreviation for the state that the city is"
        " in, e.g. 'CA' which would mean 'California'",
    },
    "unit": {
        "type": "string",
        "description": "The unit to fetch the temperature in",
        "enum": ["celsius", "fahrenheit"],
    },
}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": ["city", "state", "unit"],
            },
        },
    }
]

messages = [
    {"role": "user", "content": "Hi! How are you doing today?"},
    {"role": "assistant", "content": "I'm doing well! How can I help you?"},
    {
        "role": "user",
        "content": (
            "Can you tell me what the temperate will be in Dallas, in fahrenheit?"
        ),
    },
]


def get_current_weather(city: str, state: str, unit: "str"):
    return (
        "The weather in Dallas, Texas is 85 degrees fahrenheit. It is "
        "partly cloudly, with highs in the 90's."
    )


def handle_tool_calls_stream(
    client: OpenAI,
    messages: list[dict[str, str]],
    model: str,
    tools: list[dict[str, Any]],
) -> list[Any]:
    tool_calls_stream = client.chat.completions.create(
        messages=messages, model=model, tools=tools, stream=True
    )
    chunks = []
    print("chunks: ")
    for chunk in tool_calls_stream:
        chunks.append(chunk)
        if chunk.choices[0].delta.tool_calls:
            print(chunk.choices[0].delta.tool_calls[0])
        else:
            print(chunk.choices[0].delta)
    return chunks


def handle_tool_calls_arguments(chunks: list[Any]) -> list[str]:
    arguments = []
    tool_call_idx = -1
    print("arguments: ")
    for chunk in chunks:
        if chunk.choices[0].delta.tool_calls:
            tool_call = chunk.choices[0].delta.tool_calls[0]
            if tool_call.index != tool_call_idx:
                if tool_call_idx >= 0:
                    print(f"streamed tool call arguments: {arguments[tool_call_idx]}")
                tool_call_idx = chunk.choices[0].delta.tool_calls[0].index
                arguments.append("")
            if tool_call.id:
                print(f"streamed tool call id: {tool_call.id} ")

            if tool_call.function:
                if tool_call.function.name:
                    print(f"streamed tool call name: {tool_call.function.name}")

                if tool_call.function.arguments:
                    arguments[tool_call_idx] += tool_call.function.arguments

    return arguments


def main():
    # Initialize OpenAI client
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    # Get available models and select one
    models = client.models.list()
    model = models.data[0].id

    chat_completion = client.chat.completions.create(
        messages=messages, model=model, tools=tools
    )

    print("-" * 70)
    print("Chat completion results:")
    print(chat_completion)
    print("-" * 70)

    # Stream tool calls
    chunks = handle_tool_calls_stream(client, messages, model, tools)
    print("-" * 70)

    # Handle arguments from streamed tool calls
    arguments = handle_tool_calls_arguments(chunks)

    if len(arguments):
        print(f"streamed tool call arguments: {arguments[-1]}\n")

    print("-" * 70)

    # Add tool call results to the conversation
    messages.append(
        {
            "role": "assistant",
            "tool_calls": chat_completion.choices[0].message.tool_calls,
            "reasoning": chat_completion.choices[0].message.reasoning,
        }
    )

    # Now, simulate a tool call
    available_tools = {"get_current_weather": get_current_weather}

    completion_tool_calls = chat_completion.choices[0].message.tool_calls
    for call in completion_tool_calls:
        tool_to_call = available_tools[call.function.name]
        args = json.loads(call.function.arguments)
        result = tool_to_call(**args)
        print("tool_to_call result: ", result)
        messages.append(
            {
                "role": "tool",
                "content": result,
                "tool_call_id": call.id,
                "name": call.function.name,
            }
        )

    chat_completion_2 = client.chat.completions.create(
        messages=messages, model=model, tools=tools, stream=False
    )
    print("Chat completion2 results:")
    print(chat_completion_2)
    print("-" * 70)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled. For example:

IMPORTANT: for mistral, you must use one of the provided mistral tool call
templates, or your own - the model default doesn't work for tool calls with vLLM
See the vLLM docs on OpenAI server & tool calling for more details.

vllm serve mistralai/Mistral-7B-Instruct-v0.3 \
            --chat-template examples/tool_chat_template_mistral.jinja \
            --enable-auto-tool-choice --tool-call-parser mistral

OR
vllm serve NousResearch/Hermes-2-Pro-Llama-3-8B \
            --chat-template examples/tool_chat_template_hermes.jinja \
            --enable-auto-tool-choice --tool-call-parser hermes
"""

import json
from typing import Any

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

properties = {
    "city": {
        "type": "string",
        "description": "The city to find the weather for, e.g. 'San Francisco'",
    },
    "state": {
        "type": "string",
        "description": "the two-letter abbreviation for the state that the city is"
        " in, e.g. 'CA' which would mean 'California'",
    },
    "unit": {
        "type": "string",
        "description": "The unit to fetch the temperature in",
        "enum": ["celsius", "fahrenheit"],
    },
}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": ["city", "state", "unit"],
            },
        },
    }
]

messages = [
    {"role": "user", "content": "Hi! How are you doing today?"},
    {"role": "assistant", "content": "I'm doing well! How can I help you?"},
    {
        "role": "user",
        "content": (
            "Can you tell me what the temperate will be in Dallas, in fahrenheit?"
        ),
    },
]


def get_current_weather(city: str, state: str, unit: "str"):
    return (
        "The weather in Dallas, Texas is 85 degrees fahrenheit. It is "
        "partly cloudly, with highs in the 90's."
    )


def handle_tool_calls_stream(
    client: OpenAI,
    messages: list[dict[str, str]],
    model: str,
    tools: list[dict[str, Any]],
) -> list[Any]:
    tool_calls_stream = client.chat.completions.create(
        messages=messages, model=model, tools=tools, stream=True
    )
    chunks = []
    print("chunks: ")
    for chunk in tool_calls_stream:
        chunks.append(chunk)
        if chunk.choices[0].delta.tool_calls:
            print(chunk.choices[0].delta.tool_calls[0])
        else:
            print(chunk.choices[0].delta)
    return chunks


def handle_tool_calls_arguments(chunks: list[Any]) -> list[str]:
    arguments = []
    tool_call_idx = -1
    print("arguments: ")
    for chunk in chunks:
        if chunk.choices[0].delta.tool_calls:
            tool_call = chunk.choices[0].delta.tool_calls[0]
            if tool_call.index != tool_call_idx:
                if tool_call_idx >= 0:
                    print(f"streamed tool call arguments: {arguments[tool_call_idx]}")
                tool_call_idx = chunk.choices[0].delta.tool_calls[0].index
                arguments.append("")
            if tool_call.id:
                print(f"streamed tool call id: {tool_call.id} ")

            if tool_call.function:
                if tool_call.function.name:
                    print(f"streamed tool call name: {tool_call.function.name}")

                if tool_call.function.arguments:
                    arguments[tool_call_idx] += tool_call.function.arguments

    return arguments


def main():
    # Initialize OpenAI client
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    # Get available models and select one
    models = client.models.list()
    model = models.data[0].id

    chat_completion = client.chat.completions.create(
        messages=messages, model=model, tools=tools
    )

    print("-" * 70)
    print("Chat completion results:")
    print(chat_completion)
    print("-" * 70)

    # Stream tool calls
    chunks = handle_tool_calls_stream(client, messages, model, tools)
    print("-" * 70)

    # Handle arguments from streamed tool calls
    arguments = handle_tool_calls_arguments(chunks)

    if len(arguments):
        print(f"streamed tool call arguments: {arguments[-1]}\n")

    print("-" * 70)

    # Add tool call results to the conversation
    messages.append(
        {
            "role": "assistant",
            "tool_calls": chat_completion.choices[0].message.tool_calls,
            "reasoning": chat_completion.choices[0].message.reasoning,
        }
    )

    # Now, simulate a tool call
    available_tools = {"get_current_weather": get_current_weather}

    completion_tool_calls = chat_completion.choices[0].message.tool_calls
    for call in completion_tool_calls:
        tool_to_call = available_tools[call.function.name]
        args = json.loads(call.function.arguments)
        result = tool_to_call(**args)
        print("tool_to_call result: ", result)
        messages.append(
            {
                "role": "tool",
                "content": result,
                "tool_call_id": call.id,
                "name": call.function.name,
            }
        )

    chat_completion_2 = client.chat.completions.create(
        messages=messages, model=model, tools=tools, stream=False
    )
    print("Chat completion2 results:")
    print(chat_completion_2)
    print("-" * 70)


if __name__ == "__main__":
    main()
```

---

## OpenAI Chat Completion Client With Tools Xlam Streaming - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_client_with_tools_xlam_streaming/

**Contents:**
- OpenAI Chat Completion Client With Tools Xlam Streaming¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_client_with_tools_xlam_streaming.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# ruff: noqa: E501
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled for xLAM-2 models:

vllm serve --model Salesforce/Llama-xLAM-2-8b-fc-r --enable-auto-tool-choice --tool-call-parser xlam

OR

vllm serve --model Salesforce/xLAM-2-3b-fc-r --enable-auto-tool-choice --tool-call-parser xlam

This example demonstrates streaming tool calls with xLAM models.
"""

import json
import time

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "empty"
openai_api_base = "http://localhost:8000/v1"


# Define tool functions
def get_weather(location: str, unit: str):
    return f"Weather in {location} is 22 degrees {unit}."


def calculate_expression(expression: str):
    try:
        result = eval(expression)
        return f"The result of {expression} is {result}"
    except Exception as e:
        return f"Could not calculate {expression}: {e}"


def translate_text(text: str, target_language: str):
    return f"Translation of '{text}' to {target_language}: [translated content]"


# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g., 'San Francisco, CA'",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_expression",
            "description": "Calculate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate, needs to be a valid Python expression",
                    }
                },
                "required": ["expression"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "translate_text",
            "description": "Translate text to another language",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to translate"},
                    "target_language": {
                        "type": "string",
                        "description": "Target language for translation",
                    },
                },
                "required": ["text", "target_language"],
            },
        },
    },
]

# Map of function names to implementations
tool_functions = {
    "get_weather": get_weather,
    "calculate_expression": calculate_expression,
    "translate_text": translate_text,
}


def process_stream(response, tool_functions, original_query):
    """Process a streaming response with possible tool calls"""
    # Track multiple tool calls
    tool_calls = {}  # Dictionary to store tool calls by ID

    current_id = None

    print("\n--- Stream Output ---")
    for chunk in response:
        # Handle tool calls in the stream
        if chunk.choices[0].delta.tool_calls:
            for tool_call_chunk in chunk.choices[0].delta.tool_calls:
                # Get the tool call ID
                if hasattr(tool_call_chunk, "id") and tool_call_chunk.id:
                    current_id = tool_call_chunk.id
                    if current_id not in tool_calls:
                        tool_calls[current_id] = {
                            "function_name": None,
                            "function_args": "",
                            "function_id": current_id,
                        }

                # Extract function information as it comes in chunks
                if (
                    hasattr(tool_call_chunk, "function")
                    and current_id
                    and current_id in tool_calls
                ):
                    if (
                        hasattr(tool_call_chunk.function, "name")
                        and tool_call_chunk.function.name
                    ):
                        tool_calls[current_id]["function_name"] = (
                            tool_call_chunk.function.name
                        )
                        print(f"Function called: {tool_call_chunk.function.name}")

                    if (
                        hasattr(tool_call_chunk.function, "arguments")
                        and tool_call_chunk.function.arguments
                    ):
                        tool_calls[current_id]["function_args"] += (
                            tool_call_chunk.function.arguments
                        )
                        print(f"Arguments chunk: {tool_call_chunk.function.arguments}")

        # Handle regular content in the stream
        elif chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")

    print("\n--- End Stream ---\n")

    # Execute each function call and build messages for follow-up
    follow_up_messages = [{"role": "user", "content": original_query}]

    for tool_id, tool_data in tool_calls.items():
        function_name = tool_data["function_name"]
        function_args = tool_data["function_args"]
        function_id = tool_data["function_id"]

        if function_name and function_args:
            try:
                # Parse the JSON arguments
                args = json.loads(function_args)

                # Call the function with the arguments
                function_result = tool_functions[function_name](**args)
                print(
                    f"\n--- Function Result ({function_name}) ---\n{function_result}\n"
                )

                # Add the assistant message with tool call
                follow_up_messages.append(
                    {
                        "role": "assistant",
                        "tool_calls": [
                            {
                                "id": function_id,
                                "type": "function",
                                "function": {
                                    "name": function_name,
                                    "arguments": function_args,
                                },
                            }
                        ],
                    }
                )

                # Add the tool message with function result
                follow_up_messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": function_id,
                        "content": function_result,
                    }
                )

            except Exception as e:
                print(f"Error executing function: {e}")

    # Only send follow-up if we have results to process
    if len(follow_up_messages) > 1:
        # Create a follow-up message with all the function results
        follow_up_response = client.chat.completions.create(
            model=client.models.list().data[0].id,
            messages=follow_up_messages,
            stream=True,
        )

        print("\n--- Follow-up Response ---")
        for chunk in follow_up_response:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="")
        print("\n--- End Follow-up ---\n")


def run_test_case(query, test_name):
    """Run a single test case with the given query"""
    print(f"\n{'=' * 50}\nTEST CASE: {test_name}\n{'=' * 50}")
    print(f"Query: '{query}'")

    start_time = time.time()

    # Create streaming chat completion request
    response = client.chat.completions.create(
        model=client.models.list().data[0].id,
        messages=[{"role": "user", "content": query}],
        tools=tools,
        tool_choice="auto",
        stream=True,
    )

    # Process the streaming response
    process_stream(response, tool_functions, query)

    end_time = time.time()
    print(f"Test completed in {end_time - start_time:.2f} seconds")


def main():
    # Initialize OpenAI client
    global client
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    # Run test cases
    test_cases = [
        ("I want to know the weather in San Francisco", "Weather Information"),
        ("Calculate 25 * 17 + 31", "Math Calculation"),
        ("Translate 'Hello world' to Spanish", "Text Translation"),
        ("What is the weather in Tokyo and New York in celsius", "Multiple Tool Usage"),
    ]

    # Execute all test cases
    for query, test_name in test_cases:
        run_test_case(query, test_name)
        time.sleep(1)  # Small delay between tests

    print("\nAll tests completed.")


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# ruff: noqa: E501
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled for xLAM-2 models:

vllm serve --model Salesforce/Llama-xLAM-2-8b-fc-r --enable-auto-tool-choice --tool-call-parser xlam

OR

vllm serve --model Salesforce/xLAM-2-3b-fc-r --enable-auto-tool-choice --tool-call-parser xlam

This example demonstrates streaming tool calls with xLAM models.
"""

import json
import time

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "empty"
openai_api_base = "http://localhost:8000/v1"


# Define tool functions
def get_weather(location: str, unit: str):
    return f"Weather in {location} is 22 degrees {unit}."


def calculate_expression(expression: str):
    try:
        result = eval(expression)
        return f"The result of {expression} is {result}"
    except Exception as e:
        return f"Could not calculate {expression}: {e}"


def translate_text(text: str, target_language: str):
    return f"Translation of '{text}' to {target_language}: [translated content]"


# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g., 'San Francisco, CA'",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_expression",
            "description": "Calculate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate, needs to be a valid Python expression",
                    }
                },
                "required": ["expression"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "translate_text",
            "description": "Translate text to another language",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to translate"},
                    "target_language": {
                        "type": "string",
                        "description": "Target language for translation",
                    },
                },
                "required": ["text", "target_language"],
            },
        },
    },
]

# Map of function names to implementations
tool_functions = {
    "get_weather": get_weather,
    "calculate_expression": calculate_expression,
    "translate_text": translate_text,
}


def process_stream(response, tool_functions, original_query):
    """Process a streaming response with possible tool calls"""
    # Track multiple tool calls
    tool_calls = {}  # Dictionary to store tool calls by ID

    current_id = None

    print("\n--- Stream Output ---")
    for chunk in response:
        # Handle tool calls in the stream
        if chunk.choices[0].delta.tool_calls:
            for tool_call_chunk in chunk.choices[0].delta.tool_calls:
                # Get the tool call ID
                if hasattr(tool_call_chunk, "id") and tool_call_chunk.id:
                    current_id = tool_call_chunk.id
                    if current_id not in tool_calls:
                        tool_calls[current_id] = {
                            "function_name": None,
                            "function_args": "",
                            "function_id": current_id,
                        }

                # Extract function information as it comes in chunks
                if (
                    hasattr(tool_call_chunk, "function")
                    and current_id
                    and current_id in tool_calls
                ):
                    if (
                        hasattr(tool_call_chunk.function, "name")
                        and tool_call_chunk.function.name
                    ):
                        tool_calls[current_id]["function_name"] = (
                            tool_call_chunk.function.name
                        )
                        print(f"Function called: {tool_call_chunk.function.name}")

                    if (
                        hasattr(tool_call_chunk.function, "arguments")
                        and tool_call_chunk.function.arguments
                    ):
                        tool_calls[current_id]["function_args"] += (
                            tool_call_chunk.function.arguments
                        )
                        print(f"Arguments chunk: {tool_call_chunk.function.arguments}")

        # Handle regular content in the stream
        elif chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")

    print("\n--- End Stream ---\n")

    # Execute each function call and build messages for follow-up
    follow_up_messages = [{"role": "user", "content": original_query}]

    for tool_id, tool_data in tool_calls.items():
        function_name = tool_data["function_name"]
        function_args = tool_data["function_args"]
        function_id = tool_data["function_id"]

        if function_name and function_args:
            try:
                # Parse the JSON arguments
                args = json.loads(function_args)

                # Call the function with the arguments
                function_result = tool_functions[function_name](**args)
                print(
                    f"\n--- Function Result ({function_name}) ---\n{function_result}\n"
                )

                # Add the assistant message with tool call
                follow_up_messages.append(
                    {
                        "role": "assistant",
                        "tool_calls": [
                            {
                                "id": function_id,
                                "type": "function",
                                "function": {
                                    "name": function_name,
                                    "arguments": function_args,
                                },
                            }
                        ],
                    }
                )

                # Add the tool message with function result
                follow_up_messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": function_id,
                        "content": function_result,
                    }
                )

            except Exception as e:
                print(f"Error executing function: {e}")

    # Only send follow-up if we have results to process
    if len(follow_up_messages) > 1:
        # Create a follow-up message with all the function results
        follow_up_response = client.chat.completions.create(
            model=client.models.list().data[0].id,
            messages=follow_up_messages,
            stream=True,
        )

        print("\n--- Follow-up Response ---")
        for chunk in follow_up_response:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="")
        print("\n--- End Follow-up ---\n")


def run_test_case(query, test_name):
    """Run a single test case with the given query"""
    print(f"\n{'=' * 50}\nTEST CASE: {test_name}\n{'=' * 50}")
    print(f"Query: '{query}'")

    start_time = time.time()

    # Create streaming chat completion request
    response = client.chat.completions.create(
        model=client.models.list().data[0].id,
        messages=[{"role": "user", "content": query}],
        tools=tools,
        tool_choice="auto",
        stream=True,
    )

    # Process the streaming response
    process_stream(response, tool_functions, query)

    end_time = time.time()
    print(f"Test completed in {end_time - start_time:.2f} seconds")


def main():
    # Initialize OpenAI client
    global client
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    # Run test cases
    test_cases = [
        ("I want to know the weather in San Francisco", "Weather Information"),
        ("Calculate 25 * 17 + 31", "Math Calculation"),
        ("Translate 'Hello world' to Spanish", "Text Translation"),
        ("What is the weather in Tokyo and New York in celsius", "Multiple Tool Usage"),
    ]

    # Execute all test cases
    for query, test_name in test_cases:
        run_test_case(query, test_name)
        time.sleep(1)  # Small delay between tests

    print("\nAll tests completed.")


if __name__ == "__main__":
    main()
```

---

## OpenAI Chat Completion Client With Tools Xlam - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_client_with_tools_xlam/

**Contents:**
- OpenAI Chat Completion Client With Tools Xlam¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_client_with_tools_xlam.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# ruff: noqa: E501
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled for xLAM-2 models:

vllm serve --model Salesforce/Llama-xLAM-2-8b-fc-r --enable-auto-tool-choice --tool-call-parser xlam

OR

vllm serve --model Salesforce/xLAM-2-3b-fc-r --enable-auto-tool-choice --tool-call-parser xlam
"""

import json
import time

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "empty"
openai_api_base = "http://localhost:8000/v1"


# Define tool functions
def get_weather(location: str, unit: str):
    return f"Weather in {location} is 22 degrees {unit}."


def calculate_expression(expression: str):
    try:
        result = eval(expression)
        return f"The result of {expression} is {result}"
    except Exception as e:
        return f"Could not calculate {expression}: {e}"


def translate_text(text: str, target_language: str):
    return f"Translation of '{text}' to {target_language}: [translated content]"


# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g., 'San Francisco, CA'",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_expression",
            "description": "Calculate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate, needs to be a valid python expression",
                    }
                },
                "required": ["expression"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "translate_text",
            "description": "Translate text to another language",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to translate"},
                    "target_language": {
                        "type": "string",
                        "description": "Target language for translation",
                    },
                },
                "required": ["text", "target_language"],
            },
        },
    },
]

# Map of function names to implementations
tool_functions = {
    "get_weather": get_weather,
    "calculate_expression": calculate_expression,
    "translate_text": translate_text,
}


def process_response(response, tool_functions, original_query):
    """Process a non-streaming response with possible tool calls"""

    print("\n--- Response Output ---")

    # Check if the response has content
    if response.choices[0].message.content:
        print(f"Content: {response.choices[0].message.content}")

    # Check if the response has tool calls
    if response.choices[0].message.tool_calls:
        print("--------------------------------")
        print(f"Tool calls: {response.choices[0].message.tool_calls}")
        print("--------------------------------")

        # Collect all tool calls and results before making follow-up request
        tool_results = []
        assistant_message = {"role": "assistant"}

        if response.choices[0].message.content:
            assistant_message["content"] = response.choices[0].message.content

        assistant_tool_calls = []

        # Process each tool call
        for tool_call in response.choices[0].message.tool_calls:
            function_name = tool_call.function.name
            function_args = tool_call.function.arguments
            function_id = tool_call.id

            print(f"Function called: {function_name}")
            print(f"Arguments: {function_args}")
            print(f"Function ID: {function_id}")

            # Execute the function
            try:
                # Parse the JSON arguments
                args = json.loads(function_args)

                # Call the function with the arguments
                function_result = tool_functions[function_name](**args)
                print(f"\n--- Function Result ---\n{function_result}\n")

                # Add tool call to assistant message
                assistant_tool_calls.append(
                    {
                        "id": function_id,
                        "type": "function",
                        "function": {"name": function_name, "arguments": function_args},
                    }
                )

                # Add tool result to tool_results
                tool_results.append(
                    {
                        "role": "tool",
                        "tool_call_id": function_id,
                        "content": function_result,
                    }
                )

            except Exception as e:
                print(f"Error executing function: {e}")

        # Add tool_calls to assistant message
        assistant_message["tool_calls"] = assistant_tool_calls

        # Create a follow-up message with all function results
        follow_up_messages = [
            {"role": "user", "content": original_query},
            assistant_message,
        ]

        # Add all tool results to the messages
        follow_up_messages.extend(tool_results)

        # Get completion with all tool results in a single follow-up
        follow_up_response = client.chat.completions.create(
            model=client.models.list().data[0].id,
            messages=follow_up_messages,
            stream=False,
        )

        print("\n--- Follow-up Response ---")
        print(follow_up_response.choices[0].message.content)
        print("--- End Follow-up ---\n")

    print("--- End Response ---\n")


def run_test_case(query, test_name):
    """Run a single test case with the given query"""
    print(f"\n{'=' * 50}\nTEST CASE: {test_name}\n{'=' * 50}")
    print(f"Query: '{query}'")

    start_time = time.time()

    # Create non-streaming chat completion request
    response = client.chat.completions.create(
        model=client.models.list().data[0].id,
        messages=[{"role": "user", "content": query}],
        tools=tools,
        tool_choice="auto",
        stream=False,
    )

    # Process the non-streaming response, passing the original query
    process_response(response, tool_functions, query)

    end_time = time.time()
    print(f"Test completed in {end_time - start_time:.2f} seconds")


def main():
    # Initialize OpenAI client
    global client
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    # Run test cases
    test_cases = [
        ("I want to know the weather in San Francisco", "Weather Information"),
        ("Calculate 25 * 17 + 31", "Math Calculation"),
        ("Translate 'Hello world' to Spanish", "Text Translation"),
        ("What is the weather in Tokyo and New York in celsius", "Multiple Tool Usage"),
    ]

    # Execute all test cases
    for query, test_name in test_cases:
        run_test_case(query, test_name)
        time.sleep(1)  # Small delay between tests

    print("\nAll tests completed.")


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
# ruff: noqa: E501
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled for xLAM-2 models:

vllm serve --model Salesforce/Llama-xLAM-2-8b-fc-r --enable-auto-tool-choice --tool-call-parser xlam

OR

vllm serve --model Salesforce/xLAM-2-3b-fc-r --enable-auto-tool-choice --tool-call-parser xlam
"""

import json
import time

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "empty"
openai_api_base = "http://localhost:8000/v1"


# Define tool functions
def get_weather(location: str, unit: str):
    return f"Weather in {location} is 22 degrees {unit}."


def calculate_expression(expression: str):
    try:
        result = eval(expression)
        return f"The result of {expression} is {result}"
    except Exception as e:
        return f"Could not calculate {expression}: {e}"


def translate_text(text: str, target_language: str):
    return f"Translation of '{text}' to {target_language}: [translated content]"


# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and state, e.g., 'San Francisco, CA'",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_expression",
            "description": "Calculate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate, needs to be a valid python expression",
                    }
                },
                "required": ["expression"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "translate_text",
            "description": "Translate text to another language",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to translate"},
                    "target_language": {
                        "type": "string",
                        "description": "Target language for translation",
                    },
                },
                "required": ["text", "target_language"],
            },
        },
    },
]

# Map of function names to implementations
tool_functions = {
    "get_weather": get_weather,
    "calculate_expression": calculate_expression,
    "translate_text": translate_text,
}


def process_response(response, tool_functions, original_query):
    """Process a non-streaming response with possible tool calls"""

    print("\n--- Response Output ---")

    # Check if the response has content
    if response.choices[0].message.content:
        print(f"Content: {response.choices[0].message.content}")

    # Check if the response has tool calls
    if response.choices[0].message.tool_calls:
        print("--------------------------------")
        print(f"Tool calls: {response.choices[0].message.tool_calls}")
        print("--------------------------------")

        # Collect all tool calls and results before making follow-up request
        tool_results = []
        assistant_message = {"role": "assistant"}

        if response.choices[0].message.content:
            assistant_message["content"] = response.choices[0].message.content

        assistant_tool_calls = []

        # Process each tool call
        for tool_call in response.choices[0].message.tool_calls:
            function_name = tool_call.function.name
            function_args = tool_call.function.arguments
            function_id = tool_call.id

            print(f"Function called: {function_name}")
            print(f"Arguments: {function_args}")
            print(f"Function ID: {function_id}")

            # Execute the function
            try:
                # Parse the JSON arguments
                args = json.loads(function_args)

                # Call the function with the arguments
                function_result = tool_functions[function_name](**args)
                print(f"\n--- Function Result ---\n{function_result}\n")

                # Add tool call to assistant message
                assistant_tool_calls.append(
                    {
                        "id": function_id,
                        "type": "function",
                        "function": {"name": function_name, "arguments": function_args},
                    }
                )

                # Add tool result to tool_results
                tool_results.append(
                    {
                        "role": "tool",
                        "tool_call_id": function_id,
                        "content": function_result,
                    }
                )

            except Exception as e:
                print(f"Error executing function: {e}")

        # Add tool_calls to assistant message
        assistant_message["tool_calls"] = assistant_tool_calls

        # Create a follow-up message with all function results
        follow_up_messages = [
            {"role": "user", "content": original_query},
            assistant_message,
        ]

        # Add all tool results to the messages
        follow_up_messages.extend(tool_results)

        # Get completion with all tool results in a single follow-up
        follow_up_response = client.chat.completions.create(
            model=client.models.list().data[0].id,
            messages=follow_up_messages,
            stream=False,
        )

        print("\n--- Follow-up Response ---")
        print(follow_up_response.choices[0].message.content)
        print("--- End Follow-up ---\n")

    print("--- End Response ---\n")


def run_test_case(query, test_name):
    """Run a single test case with the given query"""
    print(f"\n{'=' * 50}\nTEST CASE: {test_name}\n{'=' * 50}")
    print(f"Query: '{query}'")

    start_time = time.time()

    # Create non-streaming chat completion request
    response = client.chat.completions.create(
        model=client.models.list().data[0].id,
        messages=[{"role": "user", "content": query}],
        tools=tools,
        tool_choice="auto",
        stream=False,
    )

    # Process the non-streaming response, passing the original query
    process_response(response, tool_functions, query)

    end_time = time.time()
    print(f"Test completed in {end_time - start_time:.2f} seconds")


def main():
    # Initialize OpenAI client
    global client
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    # Run test cases
    test_cases = [
        ("I want to know the weather in San Francisco", "Weather Information"),
        ("Calculate 25 * 17 + 31", "Math Calculation"),
        ("Translate 'Hello world' to Spanish", "Text Translation"),
        ("What is the weather in Tokyo and New York in celsius", "Multiple Tool Usage"),
    ]

    # Execute all test cases
    for query, test_name in test_cases:
        run_test_case(query, test_name)
        time.sleep(1)  # Small delay between tests

    print("\nAll tests completed.")


if __name__ == "__main__":
    main()
```

---

## OpenAI Chat Completion Tool Calls With Reasoning - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_tool_calls_with_reasoning/

**Contents:**
- OpenAI Chat Completion Tool Calls With Reasoning¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_tool_calls_with_reasoning.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
An example demonstrates how to use tool calling with reasoning models 
like QwQ-32B. The reasoning will not be parsed by the tool 
calling process; only the final output will be parsed.

To run this example, you need to start the vLLM server with both 
the reasoning parser and tool calling enabled.

```bash
vllm serve Qwen/QwQ-32B \
     --reasoning-parser deepseek_r1 \
     --enable-auto-tool-choice --tool-call-parser hermes

```

"""

from openai import OpenAI


# Now, simulate a tool call
def get_current_weather(city: str, state: str, unit: "str"):
    return (
        "The weather in Dallas, Texas is 85 degrees fahrenheit. It is "
        "partly cloudly, with highs in the 90's."
    )


available_tools = {"get_current_weather": get_current_weather}

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

properties = {
    "city": {
        "type": "string",
        "description": "The city to find the weather for, e.g. 'San Francisco'",
    },
    "state": {
        "type": "string",
        "description": "the two-letter abbreviation for the state that the city is"
        " in, e.g. 'CA' which would mean 'California'",
    },
    "unit": {
        "type": "string",
        "description": "The unit to fetch the temperature in",
        "enum": ["celsius", "fahrenheit"],
    },
}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": ["city", "state", "unit"],
            },
        },
    }
]
messages = [
    {"role": "user", "content": "Hi! How are you doing today?"},
    {"role": "assistant", "content": "I'm doing well! How can I help you?"},
    {
        "role": "user",
        "content": (
            "Can you tell me what the temperate will be in Dallas, in fahrenheit?"
        ),
    },
]


def extract_reasoning_and_calls(chunks: list):
    reasoning = ""
    tool_call_idx = -1
    arguments = []
    function_names = []
    for chunk in chunks:
        if chunk.choices[0].delta.tool_calls:
            tool_call = chunk.choices[0].delta.tool_calls[0]
            if tool_call.index != tool_call_idx:
                tool_call_idx = chunk.choices[0].delta.tool_calls[0].index
                arguments.append("")
                function_names.append("")

            if tool_call.function:
                if tool_call.function.name:
                    function_names[tool_call_idx] = tool_call.function.name

                if tool_call.function.arguments:
                    arguments[tool_call_idx] += tool_call.function.arguments
        else:
            if hasattr(chunk.choices[0].delta, "reasoning"):
                reasoning += chunk.choices[0].delta.reasoning
    return reasoning, arguments, function_names


def main():
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    print("---------Full Generate With Automatic Function Calling-------------")
    tool_calls = client.chat.completions.create(
        messages=messages, model=model, tools=tools
    )
    print(f"reasoning: {tool_calls.choices[0].message.reasoning}")
    print(f"function name: {tool_calls.choices[0].message.tool_calls[0].function.name}")
    print(
        f"function arguments: "
        f"{tool_calls.choices[0].message.tool_calls[0].function.arguments}"
    )

    print("----------Stream Generate With Automatic Function Calling-----------")
    tool_calls_stream = client.chat.completions.create(
        messages=messages, model=model, tools=tools, stream=True
    )

    chunks = list(tool_calls_stream)

    reasoning, arguments, function_names = extract_reasoning_and_calls(chunks)

    print(f"reasoning: {reasoning}")
    print(f"function name: {function_names[0]}")
    print(f"function arguments: {arguments[0]}")

    print("----------Full Generate With Named Function Calling-----------------")
    tool_calls = client.chat.completions.create(
        messages=messages,
        model=model,
        tools=tools,
        tool_choice={"type": "function", "function": {"name": "get_current_weather"}},
    )

    tool_call = tool_calls.choices[0].message.tool_calls[0].function
    print(f"reasoning: {tool_calls.choices[0].message.reasoning}")
    print(f"function name: {tool_call.name}")
    print(f"function arguments: {tool_call.arguments}")
    print("----------Stream Generate With Named Function Calling--------------")

    tool_calls_stream = client.chat.completions.create(
        messages=messages,
        model=model,
        tools=tools,
        tool_choice={"type": "function", "function": {"name": "get_current_weather"}},
        stream=True,
    )

    chunks = list(tool_calls_stream)

    reasoning, arguments, function_names = extract_reasoning_and_calls(chunks)
    print(f"reasoning: {reasoning}")
    print(f"function name: {function_names[0]}")
    print(f"function arguments: {arguments[0]}")
    print("\n\n")


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
An example demonstrates how to use tool calling with reasoning models 
like QwQ-32B. The reasoning will not be parsed by the tool 
calling process; only the final output will be parsed.

To run this example, you need to start the vLLM server with both 
the reasoning parser and tool calling enabled.

```bash
vllm serve Qwen/QwQ-32B \
     --reasoning-parser deepseek_r1 \
     --enable-auto-tool-choice --tool-call-parser hermes

```

"""

from openai import OpenAI


# Now, simulate a tool call
def get_current_weather(city: str, state: str, unit: "str"):
    return (
        "The weather in Dallas, Texas is 85 degrees fahrenheit. It is "
        "partly cloudly, with highs in the 90's."
    )


available_tools = {"get_current_weather": get_current_weather}

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

properties = {
    "city": {
        "type": "string",
        "description": "The city to find the weather for, e.g. 'San Francisco'",
    },
    "state": {
        "type": "string",
        "description": "the two-letter abbreviation for the state that the city is"
        " in, e.g. 'CA' which would mean 'California'",
    },
    "unit": {
        "type": "string",
        "description": "The unit to fetch the temperature in",
        "enum": ["celsius", "fahrenheit"],
    },
}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": ["city", "state", "unit"],
            },
        },
    }
]
messages = [
    {"role": "user", "content": "Hi! How are you doing today?"},
    {"role": "assistant", "content": "I'm doing well! How can I help you?"},
    {
        "role": "user",
        "content": (
            "Can you tell me what the temperate will be in Dallas, in fahrenheit?"
        ),
    },
]


def extract_reasoning_and_calls(chunks: list):
    reasoning = ""
    tool_call_idx = -1
    arguments = []
    function_names = []
    for chunk in chunks:
        if chunk.choices[0].delta.tool_calls:
            tool_call = chunk.choices[0].delta.tool_calls[0]
            if tool_call.index != tool_call_idx:
                tool_call_idx = chunk.choices[0].delta.tool_calls[0].index
                arguments.append("")
                function_names.append("")

            if tool_call.function:
                if tool_call.function.name:
                    function_names[tool_call_idx] = tool_call.function.name

                if tool_call.function.arguments:
                    arguments[tool_call_idx] += tool_call.function.arguments
        else:
            if hasattr(chunk.choices[0].delta, "reasoning"):
                reasoning += chunk.choices[0].delta.reasoning
    return reasoning, arguments, function_names


def main():
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    print("---------Full Generate With Automatic Function Calling-------------")
    tool_calls = client.chat.completions.create(
        messages=messages, model=model, tools=tools
    )
    print(f"reasoning: {tool_calls.choices[0].message.reasoning}")
    print(f"function name: {tool_calls.choices[0].message.tool_calls[0].function.name}")
    print(
        f"function arguments: "
        f"{tool_calls.choices[0].message.tool_calls[0].function.arguments}"
    )

    print("----------Stream Generate With Automatic Function Calling-----------")
    tool_calls_stream = client.chat.completions.create(
        messages=messages, model=model, tools=tools, stream=True
    )

    chunks = list(tool_calls_stream)

    reasoning, arguments, function_names = extract_reasoning_and_calls(chunks)

    print(f"reasoning: {reasoning}")
    print(f"function name: {function_names[0]}")
    print(f"function arguments: {arguments[0]}")

    print("----------Full Generate With Named Function Calling-----------------")
    tool_calls = client.chat.completions.create(
        messages=messages,
        model=model,
        tools=tools,
        tool_choice={"type": "function", "function": {"name": "get_current_weather"}},
    )

    tool_call = tool_calls.choices[0].message.tool_calls[0].function
    print(f"reasoning: {tool_calls.choices[0].message.reasoning}")
    print(f"function name: {tool_call.name}")
    print(f"function arguments: {tool_call.arguments}")
    print("----------Stream Generate With Named Function Calling--------------")

    tool_calls_stream = client.chat.completions.create(
        messages=messages,
        model=model,
        tools=tools,
        tool_choice={"type": "function", "function": {"name": "get_current_weather"}},
        stream=True,
    )

    chunks = list(tool_calls_stream)

    reasoning, arguments, function_names = extract_reasoning_and_calls(chunks)
    print(f"reasoning: {reasoning}")
    print(f"function name: {function_names[0]}")
    print(f"function arguments: {arguments[0]}")
    print("\n\n")


if __name__ == "__main__":
    main()
```

---

## OpenAI Chat Completion With Reasoning Streaming - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_with_reasoning_streaming/

**Contents:**
- OpenAI Chat Completion With Reasoning Streaming¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_with_reasoning_streaming.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
An example shows how to generate chat completions from reasoning models
like DeepSeekR1.

To run this example, you need to start the vLLM server with the reasoning
parser:

```bash
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
     --reasoning-parser deepseek_r1
```

Unlike openai_chat_completion_with_reasoning.py, this example demonstrates the
streaming chat completions feature.

The streaming chat completions feature allows you to receive chat completions
in real-time as they are generated by the model. This is useful for scenarios
where you want to display chat completions to the user as they are generated
by the model.

Remember to check content and reasoning exist in `ChatCompletionChunk`,
content may not exist leading to errors if you try to access it.
"""

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]


def main():
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # ruff: noqa: E501
    # For granite: add: `extra_body={"chat_template_kwargs": {"thinking": True}}`
    stream = client.chat.completions.create(model=model, messages=messages, stream=True)

    print("client: Start streaming chat completions...")
    printed_reasoning = False
    printed_content = False

    for chunk in stream:
        # Safely extract reasoning and content from delta,
        # defaulting to None if attributes don't exist or are empty strings
        reasoning = getattr(chunk.choices[0].delta, "reasoning", None) or None
        content = getattr(chunk.choices[0].delta, "content", None) or None

        if reasoning is not None:
            if not printed_reasoning:
                printed_reasoning = True
                print("reasoning:", end="", flush=True)
            print(reasoning, end="", flush=True)
        elif content is not None:
            if not printed_content:
                printed_content = True
                print("\ncontent:", end="", flush=True)
            # Extract and print the content
            print(content, end="", flush=True)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
An example shows how to generate chat completions from reasoning models
like DeepSeekR1.

To run this example, you need to start the vLLM server with the reasoning
parser:

```bash
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
     --reasoning-parser deepseek_r1
```

Unlike openai_chat_completion_with_reasoning.py, this example demonstrates the
streaming chat completions feature.

The streaming chat completions feature allows you to receive chat completions
in real-time as they are generated by the model. This is useful for scenarios
where you want to display chat completions to the user as they are generated
by the model.

Remember to check content and reasoning exist in `ChatCompletionChunk`,
content may not exist leading to errors if you try to access it.
"""

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]


def main():
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # ruff: noqa: E501
    # For granite: add: `extra_body={"chat_template_kwargs": {"thinking": True}}`
    stream = client.chat.completions.create(model=model, messages=messages, stream=True)

    print("client: Start streaming chat completions...")
    printed_reasoning = False
    printed_content = False

    for chunk in stream:
        # Safely extract reasoning and content from delta,
        # defaulting to None if attributes don't exist or are empty strings
        reasoning = getattr(chunk.choices[0].delta, "reasoning", None) or None
        content = getattr(chunk.choices[0].delta, "content", None) or None

        if reasoning is not None:
            if not printed_reasoning:
                printed_reasoning = True
                print("reasoning:", end="", flush=True)
            print(reasoning, end="", flush=True)
        elif content is not None:
            if not printed_content:
                printed_content = True
                print("\ncontent:", end="", flush=True)
            # Extract and print the content
            print(content, end="", flush=True)


if __name__ == "__main__":
    main()
```

---

## OpenAI Chat Completion With Reasoning - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_chat_completion_with_reasoning/

**Contents:**
- OpenAI Chat Completion With Reasoning¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_chat_completion_with_reasoning.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
An example shows how to generate chat completions from reasoning models
like DeepSeekR1.

To run this example, you need to start the vLLM server
with the reasoning parser:

```bash
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
    --reasoning-parser deepseek_r1
```

This example demonstrates how to generate chat completions from reasoning models
using the OpenAI Python client library.
"""

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"


def main():
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Round 1
    messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
    # ruff: noqa: E501
    # For granite, add: `extra_body={"chat_template_kwargs": {"thinking": True}}`
    response = client.chat.completions.create(model=model, messages=messages)

    reasoning = response.choices[0].message.reasoning
    content = response.choices[0].message.content

    print("reasoning for Round 1:", reasoning)
    print("content for Round 1:", content)

    # Round 2
    messages.append({"role": "assistant", "content": content})
    messages.append(
        {
            "role": "user",
            "content": "How many Rs are there in the word 'strawberry'?",
        }
    )
    response = client.chat.completions.create(model=model, messages=messages)

    reasoning = response.choices[0].message.reasoning
    content = response.choices[0].message.content

    print("reasoning for Round 2:", reasoning)
    print("content for Round 2:", content)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
An example shows how to generate chat completions from reasoning models
like DeepSeekR1.

To run this example, you need to start the vLLM server
with the reasoning parser:

```bash
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
    --reasoning-parser deepseek_r1
```

This example demonstrates how to generate chat completions from reasoning models
using the OpenAI Python client library.
"""

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"


def main():
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Round 1
    messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
    # ruff: noqa: E501
    # For granite, add: `extra_body={"chat_template_kwargs": {"thinking": True}}`
    response = client.chat.completions.create(model=model, messages=messages)

    reasoning = response.choices[0].message.reasoning
    content = response.choices[0].message.content

    print("reasoning for Round 1:", reasoning)
    print("content for Round 1:", content)

    # Round 2
    messages.append({"role": "assistant", "content": content})
    messages.append(
        {
            "role": "user",
            "content": "How many Rs are there in the word 'strawberry'?",
        }
    )
    response = client.chat.completions.create(model=model, messages=messages)

    reasoning = response.choices[0].message.reasoning
    content = response.choices[0].message.content

    print("reasoning for Round 2:", reasoning)
    print("content for Round 2:", content)


if __name__ == "__main__":
    main()
```

---

## OpenAI-Compatible Server - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/openai_compatible_server/

**Contents:**
- OpenAI-Compatible Server¶
- Supported APIs¶
- Chat Template¶
- Extra Parameters¶
- Extra HTTP Headers¶
- API Reference¶
  - Completions API¶
    - Extra parameters¶
  - Chat API¶
    - Extra parameters¶

vLLM provides an HTTP server that implements OpenAI's Completions API, Chat API, and more! This functionality lets you serve models and interact with them using an HTTP client.

In your terminal, you can install vLLM, then start the server with the vllm serve command. (You can also use our Docker image.)

To call the server, in your preferred text editor, create a script that uses an HTTP client. Include any messages that you want to send to the model. Then run that script. Below is an example script using the official OpenAI Python client.

vLLM supports some parameters that are not supported by OpenAI, top_k for example. You can pass these parameters to vLLM using the OpenAI client in the extra_body parameter of your requests, i.e. extra_body={"top_k": 50} for top_k.

By default, the server applies generation_config.json from the Hugging Face model repository if it exists. This means the default values of certain sampling parameters can be overridden by those recommended by the model creator.

To disable this behavior, please pass --generation-config vllm when launching the server.

We currently support the following OpenAI APIs:

In addition, we have the following custom APIs:

In order for the language model to support chat protocol, vLLM requires the model to include a chat template in its tokenizer configuration. The chat template is a Jinja2 template that specifies how roles, messages, and other chat-specific tokens are encoded in the input.

An example chat template for NousResearch/Meta-Llama-3-8B-Instruct can be found here

Some models do not provide a chat template even though they are instruction/chat fine-tuned. For those models, you can manually specify their chat template in the --chat-template parameter with the file path to the chat template, or the template in string form. Without a chat template, the server will not be able to process chat and all chat requests will error.

vLLM community provides a set of chat templates for popular models. You can find them under the examples directory.

With the inclusion of multi-modal chat APIs, the OpenAI spec now accepts chat messages in a new format which specifies both a type and a text field. An example is provided below:

Most chat templates for LLMs expect the content field to be a string, but there are some newer models like meta-llama/Llama-Guard-3-1B that expect the content to be formatted according to the OpenAI schema in the request. vLLM provides best-effort support to detect this automatically, which is logged as a string like "Detected the chat template content format to be...", and internally converts incoming requests to match the detected format, which can be one of:

If the result is not what you expect, you can set the --chat-template-content-format CLI argument to override which format to use.

vLLM supports a set of parameters that are not part of the OpenAI API. In order to use them, you can pass them as extra parameters in the OpenAI client. Or directly merge them into the JSON payload if you are using HTTP call directly.

Only X-Request-Id HTTP request header is supported for now. It can be enabled with --enable-request-id-headers.

Our Completions API is compatible with OpenAI's Completions API; you can use the official OpenAI Python client to interact with it.

Code example: examples/online_serving/openai_completion_client.py

The following sampling parameters are supported.

The following extra parameters are supported:

Our Chat API is compatible with OpenAI's Chat Completions API; you can use the official OpenAI Python client to interact with it.

We support both Vision- and Audio-related parameters; see our Multimodal Inputs guide for more information.

Code example: examples/online_serving/openai_chat_completion_client.py

The following sampling parameters are supported.

The following extra parameters are supported:

Our Responses API is compatible with OpenAI's Responses API; you can use the official OpenAI Python client to interact with it.

Code example: examples/online_serving/openai_responses_client_with_tools.py

The following extra parameters in the request object are supported:

The following extra parameters in the response object are supported:

Our Embeddings API is compatible with OpenAI's Embeddings API; you can use the official OpenAI Python client to interact with it.

Code example: examples/pooling/embed/openai_embedding_client.py

If the model has a chat template, you can replace inputs with a list of messages (same schema as Chat API) which will be treated as a single prompt to the model. Here is a convenience function for calling the API while retaining OpenAI's type annotations:

You can pass multi-modal inputs to embedding models by defining a custom chat template for the server and passing a list of messages in the request. Refer to the examples below for illustration.

Since VLM2Vec has the same model architecture as Phi-3.5-Vision, we have to explicitly pass --runner pooling to run this model in embedding mode instead of text generation mode.

The custom chat template is completely different from the original one for this model, and can be found here: examples/template_vlm2vec_phi3v.jinja

Since the request schema is not defined by OpenAI client, we post a request to the server using the lower-level requests library:

Like with VLM2Vec, we have to explicitly pass --runner pooling.

Additionally, MrLight/dse-qwen2-2b-mrl-v1 requires an EOS token for embeddings, which is handled by a custom chat template: examples/template_dse_qwen2_vl.jinja

MrLight/dse-qwen2-2b-mrl-v1 requires a placeholder image of the minimum image size for text query embeddings. See the full code example below for details.

Full example: examples/pooling/embed/openai_chat_embedding_client_for_multimodal.py

The following pooling parameters are supported.

The following extra parameters are supported by default:

For chat-like input (i.e. if messages is passed), these extra parameters are supported instead:

Our Transcriptions API is compatible with OpenAI's Transcriptions API; you can use the official OpenAI Python client to interact with it.

To use the Transcriptions API, please install with extra audio dependencies using pip install vllm[audio].

Code example: examples/online_serving/openai_transcription_client.py

Set the maximum audio file size (in MB) that VLLM will accept, via the VLLM_MAX_AUDIO_CLIP_FILESIZE_MB environment variable. Default is 25 MB.

The Transcriptions API supports uploading audio files in various formats including FLAC, MP3, MP4, MPEG, MPGA, M4A, OGG, WAV, and WEBM.

Using OpenAI Python Client:

Using curl with multipart/form-data:

Supported Parameters:

For the complete list of supported parameters including sampling parameters and vLLM extensions, see the protocol definitions.

For verbose_json response format:

Currently “verbose_json” response format doesn’t support avg_logprob, compression_ratio, no_speech_prob.

The following sampling parameters are supported.

The following extra parameters are supported:

Our Translation API is compatible with OpenAI's Translations API; you can use the official OpenAI Python client to interact with it. Whisper models can translate audio from one of the 55 non-English supported languages into English. Please mind that the popular openai/whisper-large-v3-turbo model does not support translating.

To use the Translation API, please install with extra audio dependencies using pip install vllm[audio].

Code example: examples/online_serving/openai_translation_client.py

The following sampling parameters are supported.

The following extra parameters are supported:

Our Tokenizer API is a simple wrapper over HuggingFace-style tokenizers. It consists of two endpoints:

Our Pooling API encodes input prompts using a pooling model and returns the corresponding hidden states.

The input format is the same as Embeddings API, but the output data can contain an arbitrary nested list, not just a 1-D list of floats.

Code example: examples/pooling/pooling/openai_pooling_client.py

Our Classification API directly supports Hugging Face sequence-classification models such as ai21labs/Jamba-tiny-reward-dev and jason9693/Qwen2.5-1.5B-apeach.

We automatically wrap any other transformer via as_seq_cls_model(), which pools on the last token, attaches a RowParallelLinear head, and applies a softmax to produce per-class probabilities.

Code example: examples/pooling/classify/openai_classification_client.py

You can classify multiple texts by passing an array of strings:

You can also pass a string directly to the input field:

The following pooling parameters are supported.

The following extra parameters are supported:

Our Score API can apply a cross-encoder model or an embedding model to predict scores for sentence or multimodal pairs. When using an embedding model the score corresponds to the cosine similarity between each embedding pair. Usually, the score for a sentence pair refers to the similarity between two sentences, on a scale of 0 to 1.

You can find the documentation for cross encoder models at sbert.net.

Code example: examples/pooling/score/openai_cross_encoder_score.py

Some scoring models require a specific prompt format to work correctly. You can specify a custom score template using the --chat-template parameter (see Chat Template).

Score templates are supported for cross-encoder models only. If you are using an embedding model for scoring, vLLM does not apply a score template.

Like chat templates, the score template receives a messages list. For scoring, each message has a role attribute—either "query" or "document". For the usual kind of point-wise cross-encoder, you can expect exactly two messages: one query and one document. To access the query and document content, use Jinja's selectattr filter:

This approach is more robust than index-based access (messages[0], messages[1]) because it selects messages by their semantic role. It also avoids assumptions about message ordering if additional message types are added to messages in the future.

Example template file: examples/pooling/score/template/nemotron-rerank.jinja

You can pass a string to both text_1 and text_2, forming a single sentence pair.

You can pass a string to text_1 and a list to text_2, forming multiple sentence pairs where each pair is built from text_1 and a string in text_2. The total number of pairs is len(text_2).

You can pass a list to both text_1 and text_2, forming multiple sentence pairs where each pair is built from a string in text_1 and the corresponding string in text_2 (similar to zip()). The total number of pairs is len(text_2).

You can pass multi-modal inputs to scoring models by passing content including a list of multi-modal input (image, etc.) in the request. Refer to the examples below for illustration.

Since the request schema is not defined by OpenAI client, we post a request to the server using the lower-level requests library:

Full example: examples/pooling/score/openai_cross_encoder_score_for_multimodal.py

The following pooling parameters are supported.

The following extra parameters are supported:

Our Re-rank API can apply an embedding model or a cross-encoder model to predict relevant scores between a single query, and each of a list of documents. Usually, the score for a sentence pair refers to the similarity between two sentences or multi-modal inputs (image, etc.), on a scale of 0 to 1.

You can find the documentation for cross encoder models at sbert.net.

The rerank endpoints support popular re-rank models such as BAAI/bge-reranker-base and other models supporting the score task. Additionally, /rerank, /v1/rerank, and /v2/rerank endpoints are compatible with both Jina AI's re-rank API interface and Cohere's re-rank API interface to ensure compatibility with popular open-source tools.

Code example: examples/pooling/score/openai_reranker.py

Note that the top_n request parameter is optional and will default to the length of the documents field. Result documents will be sorted by relevance, and the index property can be used to determine original order.

The following pooling parameters are supported.

The following extra parameters are supported:

Ray Serve LLM enables scalable, production-grade serving of the vLLM engine. It integrates tightly with vLLM and extends it with features such as auto-scaling, load balancing, and back-pressure.

The following example shows how to deploy a large model like DeepSeek R1 with Ray Serve LLM: examples/online_serving/ray_serve_deepseek.py.

Learn more about Ray Serve LLM with the official Ray Serve LLM documentation.

**Examples:**

Example 1 (unknown):
```unknown
vllm serve NousResearch/Meta-Llama-3-8B-Instruct \
  --dtype auto \
  --api-key token-abc123
```

Example 2 (unknown):
```unknown
vllm serve NousResearch/Meta-Llama-3-8B-Instruct \
  --dtype auto \
  --api-key token-abc123
```

Example 3 (json):
```json
from openai import OpenAI
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token-abc123",
)

completion = client.chat.completions.create(
    model="NousResearch/Meta-Llama-3-8B-Instruct",
    messages=[
        {"role": "user", "content": "Hello!"},
    ],
)

print(completion.choices[0].message)
```

Example 4 (json):
```json
from openai import OpenAI
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token-abc123",
)

completion = client.chat.completions.create(
    model="NousResearch/Meta-Llama-3-8B-Instruct",
    messages=[
        {"role": "user", "content": "Hello!"},
    ],
)

print(completion.choices[0].message)
```

---

## OpenAI Completion Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_completion_client/

**Contents:**
- OpenAI Completion Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_completion_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import argparse

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"


def parse_args():
    parser = argparse.ArgumentParser(description="Client for vLLM API server")
    parser.add_argument(
        "--stream", action="store_true", help="Enable streaming response"
    )
    return parser.parse_args()


def main(args):
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Completion API
    completion = client.completions.create(
        model=model,
        prompt="A robot may not injure a human being",
        echo=False,
        n=2,
        stream=args.stream,
        logprobs=3,
    )

    print("-" * 50)
    print("Completion results:")
    if args.stream:
        for c in completion:
            print(c)
    else:
        print(completion)
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import argparse

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"


def parse_args():
    parser = argparse.ArgumentParser(description="Client for vLLM API server")
    parser.add_argument(
        "--stream", action="store_true", help="Enable streaming response"
    )
    return parser.parse_args()


def main(args):
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Completion API
    completion = client.completions.create(
        model=model,
        prompt="A robot may not injure a human being",
        echo=False,
        n=2,
        stream=args.stream,
        logprobs=3,
    )

    print("-" * 50)
    print("Completion results:")
    if args.stream:
        for c in completion:
            print(c)
    else:
        print(completion)
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)
```

---

## OpenAI Responses Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_responses_client/

**Contents:**
- OpenAI Responses Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_responses_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Set up this example by starting a vLLM OpenAI-compatible server.
Reasoning models can be used through the Responses API as seen here
https://platform.openai.com/docs/api-reference/responses
For example:
vllm serve Qwen/Qwen3-8B --reasoning-parser qwen3

"""

from openai import OpenAI

input_messages = [{"role": "user", "content": "What model are you?"}]


def main():
    base_url = "http://localhost:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = "Qwen/Qwen3-8B"  # get_first_model(client)
    response = client.responses.create(
        model=model,
        input=input_messages,
    )

    for message in response.output:
        if message.type == "reasoning":
            # append reasoning message
            input_messages.append(message)

    response_2 = client.responses.create(
        model=model,
        input=input_messages,
    )
    print(response_2.output_text)
    # I am Qwen, a large language model developed by Alibaba Cloud.
    # I am designed to assist with a wide range of tasks, including
    # answering questions, creating content, coding, and engaging in
    # conversations. I can help with various topics and provide
    # information or support in multiple languages. How can I assist you today?


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Set up this example by starting a vLLM OpenAI-compatible server.
Reasoning models can be used through the Responses API as seen here
https://platform.openai.com/docs/api-reference/responses
For example:
vllm serve Qwen/Qwen3-8B --reasoning-parser qwen3

"""

from openai import OpenAI

input_messages = [{"role": "user", "content": "What model are you?"}]


def main():
    base_url = "http://localhost:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = "Qwen/Qwen3-8B"  # get_first_model(client)
    response = client.responses.create(
        model=model,
        input=input_messages,
    )

    for message in response.output:
        if message.type == "reasoning":
            # append reasoning message
            input_messages.append(message)

    response_2 = client.responses.create(
        model=model,
        input=input_messages,
    )
    print(response_2.output_text)
    # I am Qwen, a large language model developed by Alibaba Cloud.
    # I am designed to assist with a wide range of tasks, including
    # answering questions, creating content, coding, and engaging in
    # conversations. I can help with various topics and provide
    # information or support in multiple languages. How can I assist you today?


if __name__ == "__main__":
    main()
```

---

## OpenAI Responses Client With Mcp Tools - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_responses_client_with_mcp_tools/

**Contents:**
- OpenAI Responses Client With Mcp Tools¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_responses_client_with_mcp_tools.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Example demonstrating MCP (Model Context Protocol) tools with the Responses API.

This example shows how to use MCP tools with different allowed_tools configurations:
1. No filter (allows all tools from the MCP server)
2. Wildcard "*" (explicitly allows all tools)
3. Specific tool names (filters to only those tools)

Set up this example by starting a vLLM OpenAI-compatible server with MCP tools enabled.
For example:
vllm serve openai/gpt-oss-20b --enforce-eager --tool-server demo

Environment variables:
- VLLM_ENABLE_RESPONSES_API_STORE=1
- VLLM_GPT_OSS_SYSTEM_TOOL_MCP_LABELS=code_interpreter,container
- VLLM_GPT_OSS_HARMONY_SYSTEM_INSTRUCTIONS=1
"""

from openai import OpenAI
from utils import get_first_model


def example_no_filter():
    """Example with no allowed_tools filter - allows all tools."""
    print("=" * 60)
    print("Example 1: No allowed_tools filter (allows all tools)")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Execute this code: print('Hello from Python!')",
        instructions="Use the Python tool to execute code.",
        tools=[
            {
                "type": "mcp",
                "server_label": "code_interpreter",
                "server_url": "http://localhost:8888",
                # No allowed_tools specified - all tools are available
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def example_wildcard():
    """Example with allowed_tools=['*'] - explicitly allows all tools."""
    print("=" * 60)
    print("Example 2: allowed_tools=['*'] (select all tools)")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Execute this code: print('Hello from Python with wildcard!')",
        instructions="Use the Python tool to execute code.",
        tools=[
            {
                "type": "mcp",
                "server_label": "code_interpreter",
                "server_url": "http://localhost:8888",
                # Using "*" to explicitly allow all tools from this MCP server
                # This is equivalent to not specifying allowed_tools
                "allowed_tools": ["*"],
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def example_specific_tools():
    """Example with specific allowed_tools list - filters available tools.

    Note: This example uses 'web_search_preview' (browser) which has multiple
    sub-tools: 'search', 'open', 'find'. The code_interpreter (python) doesn't
    have sub-tools, so filtering doesn't apply there.
    """
    print("=" * 60)
    print("Example 3: allowed_tools=['search'] (filter browser to specific tools)")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Search for 'Python programming tutorials'",
        instructions="Use the browser tool to search.",
        tools=[
            {
                "type": "mcp",
                "server_label": "web_search_preview",
                "server_url": "http://localhost:8888",
                # Browser has tools: 'search', 'open', 'find'
                # Only allow 'search' - blocks 'open' and 'find'
                "allowed_tools": ["search"],
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def example_object_format():
    """Example using object format for allowed_tools with browser tools."""
    print("=" * 60)
    print("Example 4: allowed_tools with object format")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Search for 'machine learning' and open the first result",
        instructions="Use the browser tool.",
        tools=[
            {
                "type": "mcp",
                "server_label": "web_search_preview",
                "server_url": "http://localhost:8888",
                # Object format with tool_names field
                # Can also include read_only and other fields
                # Browser has tools: 'search', 'open', 'find'
                "allowed_tools": {
                    "tool_names": [
                        "search",
                        "open",
                    ],  # Allow search and open, block find
                    "read_only": False,
                },
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def main():
    """Run all examples."""
    print("\n" + "=" * 60)
    print("MCP Tools with allowed_tools Examples")
    print("=" * 60 + "\n")

    # Run all examples
    example_no_filter()
    example_wildcard()
    example_specific_tools()
    example_object_format()

    print("=" * 60)
    print("Summary:")
    print("  - No filter or '*' → All tools available from server")
    print("  - Specific list → Only those sub-tools available")
    print("  - Object format → More control with tool_names field")
    print("")
    print("Note: allowed_tools filters SUB-TOOLS within an MCP server:")
    print("  - code_interpreter (python): No sub-tools to filter")
    print("  - web_search_preview (browser): Has 'search', 'open', 'find'")
    print("=" * 60)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Example demonstrating MCP (Model Context Protocol) tools with the Responses API.

This example shows how to use MCP tools with different allowed_tools configurations:
1. No filter (allows all tools from the MCP server)
2. Wildcard "*" (explicitly allows all tools)
3. Specific tool names (filters to only those tools)

Set up this example by starting a vLLM OpenAI-compatible server with MCP tools enabled.
For example:
vllm serve openai/gpt-oss-20b --enforce-eager --tool-server demo

Environment variables:
- VLLM_ENABLE_RESPONSES_API_STORE=1
- VLLM_GPT_OSS_SYSTEM_TOOL_MCP_LABELS=code_interpreter,container
- VLLM_GPT_OSS_HARMONY_SYSTEM_INSTRUCTIONS=1
"""

from openai import OpenAI
from utils import get_first_model


def example_no_filter():
    """Example with no allowed_tools filter - allows all tools."""
    print("=" * 60)
    print("Example 1: No allowed_tools filter (allows all tools)")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Execute this code: print('Hello from Python!')",
        instructions="Use the Python tool to execute code.",
        tools=[
            {
                "type": "mcp",
                "server_label": "code_interpreter",
                "server_url": "http://localhost:8888",
                # No allowed_tools specified - all tools are available
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def example_wildcard():
    """Example with allowed_tools=['*'] - explicitly allows all tools."""
    print("=" * 60)
    print("Example 2: allowed_tools=['*'] (select all tools)")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Execute this code: print('Hello from Python with wildcard!')",
        instructions="Use the Python tool to execute code.",
        tools=[
            {
                "type": "mcp",
                "server_label": "code_interpreter",
                "server_url": "http://localhost:8888",
                # Using "*" to explicitly allow all tools from this MCP server
                # This is equivalent to not specifying allowed_tools
                "allowed_tools": ["*"],
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def example_specific_tools():
    """Example with specific allowed_tools list - filters available tools.

    Note: This example uses 'web_search_preview' (browser) which has multiple
    sub-tools: 'search', 'open', 'find'. The code_interpreter (python) doesn't
    have sub-tools, so filtering doesn't apply there.
    """
    print("=" * 60)
    print("Example 3: allowed_tools=['search'] (filter browser to specific tools)")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Search for 'Python programming tutorials'",
        instructions="Use the browser tool to search.",
        tools=[
            {
                "type": "mcp",
                "server_label": "web_search_preview",
                "server_url": "http://localhost:8888",
                # Browser has tools: 'search', 'open', 'find'
                # Only allow 'search' - blocks 'open' and 'find'
                "allowed_tools": ["search"],
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def example_object_format():
    """Example using object format for allowed_tools with browser tools."""
    print("=" * 60)
    print("Example 4: allowed_tools with object format")
    print("=" * 60)

    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)

    response = client.responses.create(
        model=model,
        input="Search for 'machine learning' and open the first result",
        instructions="Use the browser tool.",
        tools=[
            {
                "type": "mcp",
                "server_label": "web_search_preview",
                "server_url": "http://localhost:8888",
                # Object format with tool_names field
                # Can also include read_only and other fields
                # Browser has tools: 'search', 'open', 'find'
                "allowed_tools": {
                    "tool_names": [
                        "search",
                        "open",
                    ],  # Allow search and open, block find
                    "read_only": False,
                },
            }
        ],
    )

    print(f"Status: {response.status}")
    print(f"Output: {response.output_text}")
    print()


def main():
    """Run all examples."""
    print("\n" + "=" * 60)
    print("MCP Tools with allowed_tools Examples")
    print("=" * 60 + "\n")

    # Run all examples
    example_no_filter()
    example_wildcard()
    example_specific_tools()
    example_object_format()

    print("=" * 60)
    print("Summary:")
    print("  - No filter or '*' → All tools available from server")
    print("  - Specific list → Only those sub-tools available")
    print("  - Object format → More control with tool_names field")
    print("")
    print("Note: allowed_tools filters SUB-TOOLS within an MCP server:")
    print("  - code_interpreter (python): No sub-tools to filter")
    print("  - web_search_preview (browser): Has 'search', 'open', 'find'")
    print("=" * 60)


if __name__ == "__main__":
    main()
```

---

## OpenAI Responses Client With Tools - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_responses_client_with_tools/

**Contents:**
- OpenAI Responses Client With Tools¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_responses_client_with_tools.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled.
Reasoning models can be used through the Responses API as seen here
https://platform.openai.com/docs/api-reference/responses
For example:
vllm serve Qwen/Qwen3-1.7B --reasoning-parser qwen3 \
      --structured-outputs-config.backend xgrammar \
      --enable-auto-tool-choice --tool-call-parser hermes
"""

import json

from openai import OpenAI
from utils import get_first_model


def get_weather(latitude: float, longitude: float) -> str:
    """
    Mock function to simulate getting weather data.
    In a real application, this would call an external weather API.
    """
    return f"Current temperature at ({latitude}, {longitude}) is 20°C."


tools = [
    {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for provided coordinates in celsius.",
        "parameters": {
            "type": "object",
            "properties": {
                "latitude": {"type": "number"},
                "longitude": {"type": "number"},
            },
            "required": ["latitude", "longitude"],
            "additionalProperties": False,
        },
        "strict": True,
    }
]

input_messages = [
    {"role": "user", "content": "What's the weather like in Paris today?"}
]


def main():
    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)
    response = client.responses.create(
        model=model, input=input_messages, tools=tools, tool_choice="required"
    )

    for out in response.output:
        if out.type == "function_call":
            print("Function call:", out.name, out.arguments)
            tool_call = out
    args = json.loads(tool_call.arguments)
    result = get_weather(args["latitude"], args["longitude"])

    input_messages.append(tool_call)  # append model's function call message
    input_messages.append(
        {  # append result message
            "type": "function_call_output",
            "call_id": tool_call.call_id,
            "output": str(result),
        }
    )
    response_2 = client.responses.create(
        model=model,
        input=input_messages,
        tools=tools,
    )
    print(response_2.output_text)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Set up this example by starting a vLLM OpenAI-compatible server with tool call
options enabled.
Reasoning models can be used through the Responses API as seen here
https://platform.openai.com/docs/api-reference/responses
For example:
vllm serve Qwen/Qwen3-1.7B --reasoning-parser qwen3 \
      --structured-outputs-config.backend xgrammar \
      --enable-auto-tool-choice --tool-call-parser hermes
"""

import json

from openai import OpenAI
from utils import get_first_model


def get_weather(latitude: float, longitude: float) -> str:
    """
    Mock function to simulate getting weather data.
    In a real application, this would call an external weather API.
    """
    return f"Current temperature at ({latitude}, {longitude}) is 20°C."


tools = [
    {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for provided coordinates in celsius.",
        "parameters": {
            "type": "object",
            "properties": {
                "latitude": {"type": "number"},
                "longitude": {"type": "number"},
            },
            "required": ["latitude", "longitude"],
            "additionalProperties": False,
        },
        "strict": True,
    }
]

input_messages = [
    {"role": "user", "content": "What's the weather like in Paris today?"}
]


def main():
    base_url = "http://0.0.0.0:8000/v1"
    client = OpenAI(base_url=base_url, api_key="empty")
    model = get_first_model(client)
    response = client.responses.create(
        model=model, input=input_messages, tools=tools, tool_choice="required"
    )

    for out in response.output:
        if out.type == "function_call":
            print("Function call:", out.name, out.arguments)
            tool_call = out
    args = json.loads(tool_call.arguments)
    result = get_weather(args["latitude"], args["longitude"])

    input_messages.append(tool_call)  # append model's function call message
    input_messages.append(
        {  # append result message
            "type": "function_call_output",
            "call_id": tool_call.call_id,
            "output": str(result),
        }
    )
    response_2 = client.responses.create(
        model=model,
        input=input_messages,
        tools=tools,
    )
    print(response_2.output_text)


if __name__ == "__main__":
    main()
```

---

## OpenAI Transcription Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_transcription_client/

**Contents:**
- OpenAI Transcription Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_transcription_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This script demonstrates how to use the vLLM API server to perform audio
transcription with the `openai/whisper-large-v3` model.

Before running this script, you must start the vLLM server with the following command:

    vllm serve openai/whisper-large-v3

Requirements:
- vLLM with audio support
- openai Python SDK
- httpx for streaming support

The script performs:
1. Synchronous transcription using OpenAI-compatible API.
2. Streaming transcription using raw HTTP request to the vLLM server.
"""

import asyncio

from openai import AsyncOpenAI, OpenAI

from vllm.assets.audio import AudioAsset


def sync_openai(audio_path: str, client: OpenAI):
    """
    Perform synchronous transcription using OpenAI-compatible API.
    """
    with open(audio_path, "rb") as f:
        transcription = client.audio.transcriptions.create(
            file=f,
            model="openai/whisper-large-v3",
            language="en",
            response_format="json",
            temperature=0.0,
            # Additional sampling params not provided by OpenAI API.
            extra_body=dict(
                seed=4419,
                repetition_penalty=1.3,
            ),
        )
        print("transcription result:", transcription.text)


async def stream_openai_response(audio_path: str, client: AsyncOpenAI):
    """
    Perform asynchronous transcription using OpenAI-compatible API.
    """
    print("\ntranscription result:", end=" ")
    with open(audio_path, "rb") as f:
        transcription = await client.audio.transcriptions.create(
            file=f,
            model="openai/whisper-large-v3",
            language="en",
            response_format="json",
            temperature=0.0,
            # Additional sampling params not provided by OpenAI API.
            extra_body=dict(
                seed=420,
                top_p=0.6,
            ),
            stream=True,
        )
        async for chunk in transcription:
            if chunk.choices:
                content = chunk.choices[0].get("delta", {}).get("content")
                print(content, end="", flush=True)

    print()  # Final newline after stream ends


def main():
    mary_had_lamb = str(AudioAsset("mary_had_lamb").get_local_path())
    winning_call = str(AudioAsset("winning_call").get_local_path())

    # Modify OpenAI's API key and API base to use vLLM's API server.
    openai_api_key = "EMPTY"
    openai_api_base = "http://localhost:8000/v1"
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    sync_openai(mary_had_lamb, client)
    # Run the asynchronous function
    client = AsyncOpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )
    asyncio.run(stream_openai_response(winning_call, client))


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
This script demonstrates how to use the vLLM API server to perform audio
transcription with the `openai/whisper-large-v3` model.

Before running this script, you must start the vLLM server with the following command:

    vllm serve openai/whisper-large-v3

Requirements:
- vLLM with audio support
- openai Python SDK
- httpx for streaming support

The script performs:
1. Synchronous transcription using OpenAI-compatible API.
2. Streaming transcription using raw HTTP request to the vLLM server.
"""

import asyncio

from openai import AsyncOpenAI, OpenAI

from vllm.assets.audio import AudioAsset


def sync_openai(audio_path: str, client: OpenAI):
    """
    Perform synchronous transcription using OpenAI-compatible API.
    """
    with open(audio_path, "rb") as f:
        transcription = client.audio.transcriptions.create(
            file=f,
            model="openai/whisper-large-v3",
            language="en",
            response_format="json",
            temperature=0.0,
            # Additional sampling params not provided by OpenAI API.
            extra_body=dict(
                seed=4419,
                repetition_penalty=1.3,
            ),
        )
        print("transcription result:", transcription.text)


async def stream_openai_response(audio_path: str, client: AsyncOpenAI):
    """
    Perform asynchronous transcription using OpenAI-compatible API.
    """
    print("\ntranscription result:", end=" ")
    with open(audio_path, "rb") as f:
        transcription = await client.audio.transcriptions.create(
            file=f,
            model="openai/whisper-large-v3",
            language="en",
            response_format="json",
            temperature=0.0,
            # Additional sampling params not provided by OpenAI API.
            extra_body=dict(
                seed=420,
                top_p=0.6,
            ),
            stream=True,
        )
        async for chunk in transcription:
            if chunk.choices:
                content = chunk.choices[0].get("delta", {}).get("content")
                print(content, end="", flush=True)

    print()  # Final newline after stream ends


def main():
    mary_had_lamb = str(AudioAsset("mary_had_lamb").get_local_path())
    winning_call = str(AudioAsset("winning_call").get_local_path())

    # Modify OpenAI's API key and API base to use vLLM's API server.
    openai_api_key = "EMPTY"
    openai_api_base = "http://localhost:8000/v1"
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    sync_openai(mary_had_lamb, client)
    # Run the asynchronous function
    client = AsyncOpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )
    asyncio.run(stream_openai_response(winning_call, client))


if __name__ == "__main__":
    main()
```

---

## OpenAI Translation Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/openai_translation_client/

**Contents:**
- OpenAI Translation Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/openai_translation_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import asyncio
import json

import httpx
from openai import OpenAI

from vllm.assets.audio import AudioAsset


def sync_openai(audio_path: str, client: OpenAI):
    with open(audio_path, "rb") as f:
        translation = client.audio.translations.create(
            file=f,
            model="openai/whisper-large-v3",
            response_format="json",
            temperature=0.0,
            # Additional params not provided by OpenAI API.
            extra_body=dict(
                language="it",
                seed=4419,
                repetition_penalty=1.3,
            ),
        )
        print("translation result:", translation.text)


async def stream_openai_response(audio_path: str, base_url: str, api_key: str):
    data = {
        "language": "it",
        "stream": True,
        "model": "openai/whisper-large-v3",
    }
    url = base_url + "/audio/translations"
    headers = {"Authorization": f"Bearer {api_key}"}
    print("translation result:", end=" ")
    # OpenAI translation API client does not support streaming.
    async with httpx.AsyncClient() as client:
        with open(audio_path, "rb") as f:
            async with client.stream(
                "POST", url, files={"file": f}, data=data, headers=headers
            ) as response:
                async for line in response.aiter_lines():
                    # Each line is a JSON object prefixed with 'data: '
                    if line:
                        if line.startswith("data: "):
                            line = line[len("data: ") :]
                        # Last chunk, stream ends
                        if line.strip() == "[DONE]":
                            break
                        # Parse the JSON response
                        chunk = json.loads(line)
                        # Extract and print the content
                        content = chunk["choices"][0].get("delta", {}).get("content")
                        print(content, end="")


def main():
    foscolo = str(AudioAsset("azacinto_foscolo").get_local_path())

    # Modify OpenAI's API key and API base to use vLLM's API server.
    openai_api_key = "EMPTY"
    openai_api_base = "http://localhost:8000/v1"
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )
    sync_openai(foscolo, client)
    # Run the asynchronous function
    asyncio.run(stream_openai_response(foscolo, openai_api_base, openai_api_key))


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import asyncio
import json

import httpx
from openai import OpenAI

from vllm.assets.audio import AudioAsset


def sync_openai(audio_path: str, client: OpenAI):
    with open(audio_path, "rb") as f:
        translation = client.audio.translations.create(
            file=f,
            model="openai/whisper-large-v3",
            response_format="json",
            temperature=0.0,
            # Additional params not provided by OpenAI API.
            extra_body=dict(
                language="it",
                seed=4419,
                repetition_penalty=1.3,
            ),
        )
        print("translation result:", translation.text)


async def stream_openai_response(audio_path: str, base_url: str, api_key: str):
    data = {
        "language": "it",
        "stream": True,
        "model": "openai/whisper-large-v3",
    }
    url = base_url + "/audio/translations"
    headers = {"Authorization": f"Bearer {api_key}"}
    print("translation result:", end=" ")
    # OpenAI translation API client does not support streaming.
    async with httpx.AsyncClient() as client:
        with open(audio_path, "rb") as f:
            async with client.stream(
                "POST", url, files={"file": f}, data=data, headers=headers
            ) as response:
                async for line in response.aiter_lines():
                    # Each line is a JSON object prefixed with 'data: '
                    if line:
                        if line.startswith("data: "):
                            line = line[len("data: ") :]
                        # Last chunk, stream ends
                        if line.strip() == "[DONE]":
                            break
                        # Parse the JSON response
                        chunk = json.loads(line)
                        # Extract and print the content
                        content = chunk["choices"][0].get("delta", {}).get("content")
                        print(content, end="")


def main():
    foscolo = str(AudioAsset("azacinto_foscolo").get_local_path())

    # Modify OpenAI's API key and API base to use vLLM's API server.
    openai_api_key = "EMPTY"
    openai_api_base = "http://localhost:8000/v1"
    client = OpenAI(
        api_key=openai_api_key,
        base_url=openai_api_base,
    )
    sync_openai(foscolo, client)
    # Run the asynchronous function
    asyncio.run(stream_openai_response(foscolo, openai_api_base, openai_api_key))


if __name__ == "__main__":
    main()
```

---

## Open WebUI - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/open-webui/

**Contents:**
- Open WebUI¶

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted AI platform designed to operate entirely offline. It supports various LLM runners like Ollama and OpenAI-compatible APIs, with built-in RAG capabilities, making it a powerful AI deployment solution.

To get started with Open WebUI using vLLM, follow these steps:

Start the vLLM server with a supported chat completion model:

When starting the vLLM server, be sure to specify the host and port using the --host and --port flags. For example:

Start the Open WebUI Docker container:

Open it in the browser: http://open-webui-host:3000/

At the top of the page, you should see the model Qwen/Qwen3-0.6B-Chat.

**Examples:**

Example 1 (unknown):
```unknown
vllm serve Qwen/Qwen3-0.6B-Chat
```

Example 2 (unknown):
```unknown
vllm serve Qwen/Qwen3-0.6B-Chat
```

Example 3 (typescript):
```typescript
vllm serve <model> --host 0.0.0.0 --port 8000
```

Example 4 (typescript):
```typescript
vllm serve <model> --host 0.0.0.0 --port 8000
```

---

## Parallelism and Scaling - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/parallelism_scaling/

**Contents:**
- Parallelism and Scaling¶
- Distributed inference strategies for a single-model replica¶
  - Distributed serving of Mixture of Experts (MoE) models¶
- Single-node deployment¶
- Multi-node deployment¶
  - What is Ray?¶
  - Ray cluster setup with containers¶
  - Running vLLM on a Ray cluster¶
  - Running vLLM with MultiProcessing¶
- Optimizing network communication for tensor parallelism¶

To choose a distributed inference strategy for a single-model replica, use the following guidelines:

Increase the number of GPUs and nodes until there is enough GPU memory for the model. Set tensor_parallel_size to the number of GPUs per node and pipeline_parallel_size to the number of nodes.

After you provision sufficient resources to fit the model, run vllm. Look for log messages like:

The GPU KV cache size line reports the total number of tokens that can be stored in the GPU KV cache at once. The Maximum concurrency line provides an estimate of how many requests can be served concurrently if each request requires the specified number of tokens (40,960 in the example above). The tokens-per-request number is taken from the model configuration's maximum sequence length, ModelConfig.max_model_len. If these numbers are lower than your throughput requirements, add more GPUs or nodes to your cluster.

Edge case: uneven GPU splits

If the model fits within a single node but the GPU count doesn't evenly divide the model size, enable pipeline parallelism, which splits the model along layers and supports uneven splits. In this scenario, set tensor_parallel_size=1 and pipeline_parallel_size to the number of GPUs. Furthermore, if the GPUs on the node do not have NVLINK interconnect (e.g. L40S), leverage pipeline parallelism instead of tensor parallelism for higher throughput and lower communication overhead.

It's often advantageous to exploit the inherent parallelism of experts by using a separate parallelism strategy for the expert layers. vLLM supports large-scale deployment combining Data Parallel attention with Expert or Tensor Parallel MoE layers. For more information, see Data Parallel Deployment.

vLLM supports distributed tensor-parallel and pipeline-parallel inference and serving. The implementation includes Megatron-LM's tensor parallel algorithm.

The default distributed runtimes are Ray for multi-node inference and native Python multiprocessing for single-node inference. You can override the defaults by setting distributed_executor_backend in the LLM class or --distributed-executor-backend in the API server. Use mp for multiprocessing or ray for Ray.

For multi-GPU inference, set tensor_parallel_size in the LLM class to the desired GPU count. For example, to run inference on 4 GPUs:

For multi-GPU serving, include --tensor-parallel-size when starting the server. For example, to run the API server on 4 GPUs:

To enable pipeline parallelism, add --pipeline-parallel-size. For example, to run the API server on 8 GPUs with pipeline parallelism and tensor parallelism:

If a single node lacks sufficient GPUs to hold the model, deploy vLLM across multiple nodes. Ensure that every node provides an identical execution environment, including the model path and Python packages. Using container images is recommended because they provide a convenient way to keep environments consistent and to hide host heterogeneity.

Ray is a distributed computing framework for scaling Python programs. Multi-node vLLM deployments can use Ray as the runtime engine.

vLLM uses Ray to manage the distributed execution of tasks across multiple nodes and control where execution happens.

Ray also offers high-level APIs for large-scale offline batch inference and online serving that can leverage vLLM as the engine. These APIs add production-grade fault tolerance, scaling, and distributed observability to vLLM workloads.

For details, see the Ray documentation.

The helper script examples/online_serving/run_cluster.sh starts containers across nodes and initializes Ray. By default, the script runs Docker without administrative privileges, which prevents access to the GPU performance counters when profiling or tracing. To enable admin privileges, add the --cap-add=CAP_SYS_ADMIN flag to the Docker command.

Choose one node as the head node and run:

On each worker node, run:

Note that VLLM_HOST_IP is unique for each worker. Keep the shells running these commands open; closing any shell terminates the cluster. Ensure that all nodes can communicate with each other through their IP addresses.

For security, set VLLM_HOST_IP to an address on a private network segment. Traffic sent over this network is unencrypted, and the endpoints exchange data in a format that can be exploited to execute arbitrary code if an adversary gains network access. Ensure that untrusted parties cannot reach the network.

From any node, enter a container and run ray status and ray list nodes to verify that Ray finds the expected number of nodes and GPUs.

Alternatively, set up the Ray cluster using KubeRay. For more information, see KubeRay vLLM documentation.

If Ray is running inside containers, run the commands in the remainder of this guide inside the containers, not on the host. To open a shell inside a container, connect to a node and use docker exec -it <container_name> /bin/bash.

Once a Ray cluster is running, use vLLM as you would in a single-node setting. All resources across the Ray cluster are visible to vLLM, so a single vllm command on a single node is sufficient.

The common practice is to set the tensor parallel size to the number of GPUs in each node, and the pipeline parallel size to the number of nodes. For example, if you have 16 GPUs across 2 nodes (8 GPUs per node), set the tensor parallel size to 8 and the pipeline parallel size to 2:

Alternatively, you can set tensor_parallel_size to the total number of GPUs in the cluster:

Besides Ray, Multi-node vLLM deployments can also use multiprocessing as the runtime engine. Here's an example to deploy model across 2 nodes (8 GPUs per node) with tp_size=8 and pp_size=2.

Choose one node as the head node and run:

On the other worker node, run:

Efficient tensor parallelism requires fast internode communication, preferably through high-speed network adapters such as InfiniBand. To set up the cluster to use InfiniBand, append additional arguments like --privileged -e NCCL_IB_HCA=mlx5 to the examples/online_serving/run_cluster.sh helper script. Contact your system administrator for more information about the required flags.

GPUDirect RDMA (Remote Direct Memory Access) is an NVIDIA technology that allows network adapters to directly access GPU memory, bypassing the CPU and system memory. This direct access reduces latency and CPU overhead, which is beneficial for large data transfers between GPUs across nodes.

To enable GPUDirect RDMA with vLLM, configure the following settings:

If you use Docker, set up the container as follows:

If you use Kubernetes, set up the pod spec as follows:

Confirm GPUDirect RDMA operation

To confirm your InfiniBand card is using GPUDirect RDMA, run vLLM with detailed NCCL logs: NCCL_DEBUG=TRACE vllm serve ....

Then look for the NCCL version and the network used.

Pre-download Hugging Face models

If you use Hugging Face models, downloading the model before starting vLLM is recommended. Download the model on every node to the same path, or store the model on a distributed file system accessible by all nodes. Then pass the path to the model in place of the repository ID. Otherwise, supply a Hugging Face token by appending -e HF_TOKEN=<TOKEN> to run_cluster.sh.

For information about distributed debugging, see Troubleshooting distributed deployments.

**Examples:**

Example 1 (json):
```json
INFO 07-23 13:56:04 [kv_cache_utils.py:775] GPU KV cache size: 643,232 tokens
INFO 07-23 13:56:04 [kv_cache_utils.py:779] Maximum concurrency for 40,960 tokens per request: 15.70x
```

Example 2 (json):
```json
INFO 07-23 13:56:04 [kv_cache_utils.py:775] GPU KV cache size: 643,232 tokens
INFO 07-23 13:56:04 [kv_cache_utils.py:779] Maximum concurrency for 40,960 tokens per request: 15.70x
```

Example 3 (python):
```python
from vllm import LLM
llm = LLM("facebook/opt-13b", tensor_parallel_size=4)
output = llm.generate("San Francisco is a")
```

Example 4 (python):
```python
from vllm import LLM
llm = LLM("facebook/opt-13b", tensor_parallel_size=4)
output = llm.generate("San Francisco is a")
```

---

## Production Metrics - vLLM

**URL:** https://docs.vllm.ai/en/latest/usage/metrics/

**Contents:**
- Production Metrics¶
- General Metrics¶
- Speculative Decoding Metrics¶
- NIXL KV Connector Metrics¶
- Deprecation Policy¶

vLLM exposes a number of metrics that can be used to monitor the health of the system. These metrics are exposed via the /metrics endpoint on the vLLM OpenAI compatible API server.

You can start the server using Python, or using Docker:

Then query the endpoint to get the latest metrics from the server:

The following metrics are exposed:

Note: when metrics are deprecated in version X.Y, they are hidden in version X.Y+1 but can be re-enabled using the --show-hidden-metrics-for-version=X.Y escape hatch, and are then removed in version X.Y+2.

**Examples:**

Example 1 (unknown):
```unknown
vllm serve unsloth/Llama-3.2-1B-Instruct
```

Example 2 (unknown):
```unknown
vllm serve unsloth/Llama-3.2-1B-Instruct
```

Example 3 (yaml):
```yaml
$ curl http://0.0.0.0:8000/metrics

# HELP vllm:iteration_tokens_total Histogram of number of tokens per engine_step.
# TYPE vllm:iteration_tokens_total histogram
vllm:iteration_tokens_total_sum{model_name="unsloth/Llama-3.2-1B-Instruct"} 0.0
vllm:iteration_tokens_total_bucket{le="1.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="8.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="16.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="32.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="64.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="128.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="256.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="512.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
...
```

Example 4 (yaml):
```yaml
$ curl http://0.0.0.0:8000/metrics

# HELP vllm:iteration_tokens_total Histogram of number of tokens per engine_step.
# TYPE vllm:iteration_tokens_total histogram
vllm:iteration_tokens_total_sum{model_name="unsloth/Llama-3.2-1B-Instruct"} 0.0
vllm:iteration_tokens_total_bucket{le="1.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="8.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="16.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="32.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="64.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="128.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="256.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
vllm:iteration_tokens_total_bucket{le="512.0",model_name="unsloth/Llama-3.2-1B-Instruct"} 3.0
...
```

---

## Production stack - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/integrations/production-stack/

**Contents:**
- Production stack¶
- Pre-requisite¶
- Deployment using vLLM production stack¶
  - Validate Installation¶
  - Send a Query to the Stack¶
  - Uninstall¶
  - (Advanced) Configuring vLLM production stack¶

Deploying vLLM on Kubernetes is a scalable and efficient way to serve machine learning models. This guide walks you through deploying vLLM using the vLLM production stack. Born out of a Berkeley-UChicago collaboration, vLLM production stack is an officially released, production-optimized codebase under the vLLM project, designed for LLM deployment with:

If you are new to Kubernetes, don't worry: in the vLLM production stack repo, we provide a step-by-step guide and a short video to set up everything and get started in 4 minutes!

Ensure that you have a running Kubernetes environment with GPU (you can follow this tutorial to install a Kubernetes environment on a bare-medal GPU machine).

The standard vLLM production stack is installed using a Helm chart. You can run this bash script to install Helm on your GPU server.

To install the vLLM production stack, run the following commands on your desktop:

This will instantiate a vLLM-production-stack-based deployment named vllm that runs a small LLM (Facebook opt-125M model).

Monitor the deployment status using:

And you will see that pods for the vllm deployment will transit to Running state.

It may take some time for the containers to download the Docker images and LLM weights.

Forward the vllm-router-service port to the host machine:

And then you can send out a query to the OpenAI-compatible API to check the available models:

To send an actual chatting request, you can issue a curl request to the OpenAI /completion endpoint:

To remove the deployment, run:

The core vLLM production stack configuration is managed with YAML. Here is the example configuration used in the installation above:

In this YAML configuration:

If you intend to set up two pods, please refer to this YAML file.

vLLM production stack offers many more features (e.g. CPU offloading and a wide range of routing algorithms). Please check out these examples and tutorials and our repo for more details!

**Examples:**

Example 1 (unknown):
```unknown
sudo helm repo add vllm https://vllm-project.github.io/production-stack
sudo helm install vllm vllm/vllm-stack -f tutorials/assets/values-01-minimal-example.yaml
```

Example 2 (unknown):
```unknown
sudo helm repo add vllm https://vllm-project.github.io/production-stack
sudo helm install vllm vllm/vllm-stack -f tutorials/assets/values-01-minimal-example.yaml
```

Example 3 (unknown):
```unknown
sudo kubectl get pods
```

Example 4 (unknown):
```unknown
sudo kubectl get pods
```

---

## Prometheus and Grafana - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/prometheus_grafana/

**Contents:**
- Prometheus and Grafana¶
- Launch¶
- Grafana Dashboard¶
  - Add Prometheus Data Source¶
  - Import Dashboard¶
- Example materials¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/prometheus_grafana.

This is a simple example that shows you how to connect vLLM metric logging to the Prometheus/Grafana stack. For this example, we launch Prometheus and Grafana via Docker. You can checkout other methods through Prometheus and Grafana websites.

Prometheus metric logging is enabled by default in the OpenAI-compatible server. Launch via the entrypoint:

Launch Prometheus and Grafana servers with docker compose:

Submit some sample requests to the server:

Navigating to http://localhost:8000/metrics will show the raw Prometheus metrics being exposed by vLLM.

Navigate to http://localhost:3000. Log in with the default username (admin) and password (admin).

Navigate to http://localhost:3000/connections/datasources/new and select Prometheus.

On Prometheus configuration page, we need to add the Prometheus Server URL in Connection. For this setup, Grafana and Prometheus are running in separate containers, but Docker creates DNS name for each container. You can just use http://prometheus:9090.

Click Save & Test. You should get a green check saying "Successfully queried the Prometheus API.".

Navigate to http://localhost:3000/dashboard/import, upload grafana.json, and select the prometheus datasource. You should see a screen that looks like the following:

**Examples:**

Example 1 (unknown):
```unknown
vllm serve mistralai/Mistral-7B-v0.1 \
    --max-model-len 2048
```

Example 2 (unknown):
```unknown
vllm serve mistralai/Mistral-7B-v0.1 \
    --max-model-len 2048
```

Example 3 (unknown):
```unknown
docker compose up
```

Example 4 (unknown):
```unknown
docker compose up
```

---

## Prompt Embed Inference With OpenAI Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/prompt_embed_inference_with_openai_client/

**Contents:**
- Prompt Embed Inference With OpenAI Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/prompt_embed_inference_with_openai_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
vLLM OpenAI-Compatible Client with Prompt Embeddings

This script demonstrates how to:
1. Generate prompt embeddings using Hugging Face Transformers
2. Encode them in base64 format
3. Send them to a vLLM server via the OpenAI-compatible Completions API

Run the vLLM server first:
vllm serve meta-llama/Llama-3.2-1B-Instruct \
  --runner generate \
  --max-model-len 4096 \
  --enable-prompt-embeds

Run the client:
python examples/online_serving/prompt_embed_inference_with_openai_client.py

Model: meta-llama/Llama-3.2-1B-Instruct
Note: This model is gated on Hugging Face Hub.
      You must request access to use it:
      https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct

Dependencies:
- transformers
- torch
- openai
"""

import transformers
from openai import OpenAI

from vllm.utils.serial_utils import tensor2base64


def main():
    client = OpenAI(
        api_key="EMPTY",
        base_url="http://localhost:8000/v1",
    )

    model_name = "meta-llama/Llama-3.2-1B-Instruct"

    # Transformers
    tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
    transformers_model = transformers.AutoModelForCausalLM.from_pretrained(model_name)

    # Refer to the HuggingFace repo for the correct format to use
    chat = [{"role": "user", "content": "Please tell me about the capital of France."}]
    token_ids = tokenizer.apply_chat_template(
        chat, add_generation_prompt=True, return_tensors="pt"
    )

    embedding_layer = transformers_model.get_input_embeddings()
    prompt_embeds = embedding_layer(token_ids).squeeze(0)

    # Prompt embeddings
    encoded_embeds = tensor2base64(prompt_embeds)

    completion = client.completions.create(
        model=model_name,
        # NOTE: The OpenAI client does not allow `None` as an input to
        # `prompt`. Use an empty string if you have no text prompts.
        prompt="",
        max_tokens=5,
        temperature=0.0,
        # NOTE: The OpenAI client allows passing in extra JSON body via the
        # `extra_body` argument.
        extra_body={"prompt_embeds": encoded_embeds},
    )

    print("-" * 30)
    print(completion.choices[0].text)
    print("-" * 30)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
vLLM OpenAI-Compatible Client with Prompt Embeddings

This script demonstrates how to:
1. Generate prompt embeddings using Hugging Face Transformers
2. Encode them in base64 format
3. Send them to a vLLM server via the OpenAI-compatible Completions API

Run the vLLM server first:
vllm serve meta-llama/Llama-3.2-1B-Instruct \
  --runner generate \
  --max-model-len 4096 \
  --enable-prompt-embeds

Run the client:
python examples/online_serving/prompt_embed_inference_with_openai_client.py

Model: meta-llama/Llama-3.2-1B-Instruct
Note: This model is gated on Hugging Face Hub.
      You must request access to use it:
      https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct

Dependencies:
- transformers
- torch
- openai
"""

import transformers
from openai import OpenAI

from vllm.utils.serial_utils import tensor2base64


def main():
    client = OpenAI(
        api_key="EMPTY",
        base_url="http://localhost:8000/v1",
    )

    model_name = "meta-llama/Llama-3.2-1B-Instruct"

    # Transformers
    tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
    transformers_model = transformers.AutoModelForCausalLM.from_pretrained(model_name)

    # Refer to the HuggingFace repo for the correct format to use
    chat = [{"role": "user", "content": "Please tell me about the capital of France."}]
    token_ids = tokenizer.apply_chat_template(
        chat, add_generation_prompt=True, return_tensors="pt"
    )

    embedding_layer = transformers_model.get_input_embeddings()
    prompt_embeds = embedding_layer(token_ids).squeeze(0)

    # Prompt embeddings
    encoded_embeds = tensor2base64(prompt_embeds)

    completion = client.completions.create(
        model=model_name,
        # NOTE: The OpenAI client does not allow `None` as an input to
        # `prompt`. Use an empty string if you have no text prompts.
        prompt="",
        max_tokens=5,
        temperature=0.0,
        # NOTE: The OpenAI client allows passing in extra JSON body via the
        # `extra_body` argument.
        extra_body={"prompt_embeds": encoded_embeds},
    )

    print("-" * 30)
    print(completion.choices[0].text)
    print("-" * 30)


if __name__ == "__main__":
    main()
```

---

## Ray Serve Deepseek - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/ray_serve_deepseek/

**Contents:**
- Ray Serve Deepseek¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/ray_serve_deepseek.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Deploy DeepSeek R1 or V3 with Ray Serve LLM.

Ray Serve LLM is a scalable and production-grade model serving library built
on the Ray distributed computing framework and first-class support for the vLLM engine.

Key features:
- Automatic scaling, back-pressure, and load balancing across a Ray cluster.
- Unified multi-node multi-model deployment.
- Exposes an OpenAI-compatible HTTP API.
- Multi-LoRA support with shared base models.

Run `python3 ray_serve_deepseek.py` to launch an endpoint.

Learn more in the official Ray Serve LLM documentation:
https://docs.ray.io/en/latest/serve/llm/serving-llms.html
"""

from ray import serve
from ray.serve.llm import LLMConfig, build_openai_app

llm_config = LLMConfig(
    model_loading_config={
        "model_id": "deepseek",
        # Pre-downloading the model to local storage is recommended since
        # the model is large. Set model_source="/path/to/the/model".
        "model_source": "deepseek-ai/DeepSeek-R1",
    },
    deployment_config={
        "autoscaling_config": {
            "min_replicas": 1,
            "max_replicas": 1,
        }
    },
    # Set to the node's accelerator type.
    accelerator_type="H100",
    # Customize engine arguments as required (for example, vLLM engine kwargs).
    engine_kwargs={
        "tensor_parallel_size": 8,
        "pipeline_parallel_size": 2,
        "gpu_memory_utilization": 0.92,
        "dtype": "auto",
        "max_num_seqs": 40,
        "max_model_len": 16384,
        "enable_chunked_prefill": True,
        "enable_prefix_caching": True,
        "trust_remote_code": True,
    },
)

# Deploy the application.
llm_app = build_openai_app({"llm_configs": [llm_config]})
serve.run(llm_app)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Deploy DeepSeek R1 or V3 with Ray Serve LLM.

Ray Serve LLM is a scalable and production-grade model serving library built
on the Ray distributed computing framework and first-class support for the vLLM engine.

Key features:
- Automatic scaling, back-pressure, and load balancing across a Ray cluster.
- Unified multi-node multi-model deployment.
- Exposes an OpenAI-compatible HTTP API.
- Multi-LoRA support with shared base models.

Run `python3 ray_serve_deepseek.py` to launch an endpoint.

Learn more in the official Ray Serve LLM documentation:
https://docs.ray.io/en/latest/serve/llm/serving-llms.html
"""

from ray import serve
from ray.serve.llm import LLMConfig, build_openai_app

llm_config = LLMConfig(
    model_loading_config={
        "model_id": "deepseek",
        # Pre-downloading the model to local storage is recommended since
        # the model is large. Set model_source="/path/to/the/model".
        "model_source": "deepseek-ai/DeepSeek-R1",
    },
    deployment_config={
        "autoscaling_config": {
            "min_replicas": 1,
            "max_replicas": 1,
        }
    },
    # Set to the node's accelerator type.
    accelerator_type="H100",
    # Customize engine arguments as required (for example, vLLM engine kwargs).
    engine_kwargs={
        "tensor_parallel_size": 8,
        "pipeline_parallel_size": 2,
        "gpu_memory_utilization": 0.92,
        "dtype": "auto",
        "max_num_seqs": 40,
        "max_model_len": 16384,
        "enable_chunked_prefill": True,
        "enable_prefix_caching": True,
        "trust_remote_code": True,
    },
)

# Deploy the application.
llm_app = build_openai_app({"llm_configs": [llm_config]})
serve.run(llm_app)
```

---

## Retrieval-Augmented Generation - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/retrieval_augmented_generation/

**Contents:**
- Retrieval-Augmented Generation¶
- vLLM + langchain¶
  - Prerequisites¶
  - Deploy¶
- vLLM + llamaindex¶
  - Prerequisites¶
  - Deploy¶

Retrieval-augmented generation (RAG) is a technique that enables generative artificial intelligence (Gen AI) models to retrieve and incorporate new information. It modifies interactions with a large language model (LLM) so that the model responds to user queries with reference to a specified set of documents, using this information to supplement information from its pre-existing training data. This allows LLMs to use domain-specific and/or updated information. Use cases include providing chatbot access to internal company data or generating responses based on authoritative sources.

Here are the integrations:

Set up the vLLM and langchain environment:

Start the vLLM server with the supported embedding model, e.g.

Start the vLLM server with the supported chat completion model, e.g.

Use the script: examples/online_serving/retrieval_augmented_generation_with_langchain.py

Set up the vLLM and llamaindex environment:

Start the vLLM server with the supported embedding model, e.g.

Start the vLLM server with the supported chat completion model, e.g.

Use the script: examples/online_serving/retrieval_augmented_generation_with_llamaindex.py

**Examples:**

Example 1 (unknown):
```unknown
pip install -U vllm \
            langchain_milvus langchain_openai \
            langchain_community beautifulsoup4 \
            langchain-text-splitters
```

Example 2 (unknown):
```unknown
pip install -U vllm \
            langchain_milvus langchain_openai \
            langchain_community beautifulsoup4 \
            langchain-text-splitters
```

Example 3 (markdown):
```markdown
# Start embedding service (port 8000)
vllm serve ssmits/Qwen2-7B-Instruct-embed-base
```

Example 4 (markdown):
```markdown
# Start embedding service (port 8000)
vllm serve ssmits/Qwen2-7B-Instruct-embed-base
```

---

## Retrieval Augmented Generation With Langchain - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/retrieval_augmented_generation_with_langchain/

**Contents:**
- Retrieval Augmented Generation With Langchain¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/retrieval_augmented_generation_with_langchain.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Retrieval Augmented Generation (RAG) Implementation with Langchain
==================================================================

This script demonstrates a RAG implementation using LangChain, Milvus
and vLLM. RAG enhances LLM responses by retrieving relevant context
from a document collection.

Features:
- Web content loading and chunking
- Vector storage with Milvus
- Embedding generation with vLLM
- Question answering with context

Prerequisites:
1. Install dependencies:
    pip install -U vllm \
                 langchain_milvus langchain_openai \
                 langchain_community beautifulsoup4 \
                 langchain-text-splitters

2. Start services:
    # Start embedding service (port 8000)
    vllm serve ssmits/Qwen2-7B-Instruct-embed-base

    # Start chat service (port 8001)
    vllm serve qwen/Qwen1.5-0.5B-Chat --port 8001

Usage:
    python retrieval_augmented_generation_with_langchain.py

Notes:
    - Ensure both vLLM services are running before executing
    - Default ports: 8000 (embedding), 8001 (chat)
    - First run may take time to download models
"""

import argparse
from argparse import Namespace
from typing import Any

from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_milvus import Milvus
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_and_split_documents(config: dict[str, Any]):
    """
    Load and split documents from web URL
    """
    try:
        loader = WebBaseLoader(web_paths=(config["url"],))
        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config["chunk_size"],
            chunk_overlap=config["chunk_overlap"],
        )
        return text_splitter.split_documents(docs)
    except Exception as e:
        print(f"Error loading document from {config['url']}: {str(e)}")
        raise


def init_vectorstore(config: dict[str, Any], documents: list[Document]):
    """
    Initialize vector store with documents
    """
    return Milvus.from_documents(
        documents=documents,
        embedding=OpenAIEmbeddings(
            model=config["embedding_model"],
            openai_api_key=config["vllm_api_key"],
            openai_api_base=config["vllm_embedding_endpoint"],
        ),
        connection_args={"uri": config["uri"]},
        drop_old=True,
    )


def init_llm(config: dict[str, Any]):
    """
    Initialize llm
    """
    return ChatOpenAI(
        model=config["chat_model"],
        openai_api_key=config["vllm_api_key"],
        openai_api_base=config["vllm_chat_endpoint"],
    )


def get_qa_prompt():
    """
    Get question answering prompt template
    """
    template = """You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:
"""
    return PromptTemplate.from_template(template)


def format_docs(docs: list[Document]):
    """
    Format documents for prompt
    """
    return "\n\n".join(doc.page_content for doc in docs)


def create_qa_chain(retriever: Any, llm: ChatOpenAI, prompt: PromptTemplate):
    """
    Set up question answering chain
    """
    return (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )


def get_parser() -> argparse.ArgumentParser:
    """
    Parse command line arguments
    """
    parser = argparse.ArgumentParser(description="RAG with vLLM and langchain")

    # Add command line arguments
    parser.add_argument(
        "--vllm-api-key", default="EMPTY", help="API key for vLLM compatible services"
    )
    parser.add_argument(
        "--vllm-embedding-endpoint",
        default="http://localhost:8000/v1",
        help="Base URL for embedding service",
    )
    parser.add_argument(
        "--vllm-chat-endpoint",
        default="http://localhost:8001/v1",
        help="Base URL for chat service",
    )
    parser.add_argument("--uri", default="./milvus.db", help="URI for Milvus database")
    parser.add_argument(
        "--url",
        default=("https://docs.vllm.ai/en/latest/getting_started/quickstart.html"),
        help="URL of the document to process",
    )
    parser.add_argument(
        "--embedding-model",
        default="ssmits/Qwen2-7B-Instruct-embed-base",
        help="Model name for embeddings",
    )
    parser.add_argument(
        "--chat-model", default="qwen/Qwen1.5-0.5B-Chat", help="Model name for chat"
    )
    parser.add_argument(
        "-i", "--interactive", action="store_true", help="Enable interactive Q&A mode"
    )
    parser.add_argument(
        "-k", "--top-k", type=int, default=3, help="Number of top results to retrieve"
    )
    parser.add_argument(
        "-c",
        "--chunk-size",
        type=int,
        default=1000,
        help="Chunk size for document splitting",
    )
    parser.add_argument(
        "-o",
        "--chunk-overlap",
        type=int,
        default=200,
        help="Chunk overlap for document splitting",
    )

    return parser


def init_config(args: Namespace):
    """
    Initialize configuration settings from command line arguments
    """

    return {
        "vllm_api_key": args.vllm_api_key,
        "vllm_embedding_endpoint": args.vllm_embedding_endpoint,
        "vllm_chat_endpoint": args.vllm_chat_endpoint,
        "uri": args.uri,
        "embedding_model": args.embedding_model,
        "chat_model": args.chat_model,
        "url": args.url,
        "chunk_size": args.chunk_size,
        "chunk_overlap": args.chunk_overlap,
        "top_k": args.top_k,
    }


def main():
    # Parse command line arguments
    args = get_parser().parse_args()

    # Initialize configuration
    config = init_config(args)

    # Load and split documents
    documents = load_and_split_documents(config)

    # Initialize vector store and retriever
    vectorstore = init_vectorstore(config, documents)
    retriever = vectorstore.as_retriever(search_kwargs={"k": config["top_k"]})

    # Initialize llm and prompt
    llm = init_llm(config)
    prompt = get_qa_prompt()

    # Set up QA chain
    qa_chain = create_qa_chain(retriever, llm, prompt)

    # Interactive mode
    if args.interactive:
        print("\nWelcome to Interactive Q&A System!")
        print("Enter 'q' or 'quit' to exit.")

        while True:
            question = input("\nPlease enter your question: ")
            if question.lower() in ["q", "quit"]:
                print("\nThank you for using! Goodbye!")
                break

            output = qa_chain.invoke(question)
            print(output)
    else:
        # Default single question mode
        question = "How to install vLLM?"
        output = qa_chain.invoke(question)
        print("-" * 50)
        print(output)
        print("-" * 50)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
Retrieval Augmented Generation (RAG) Implementation with Langchain
==================================================================

This script demonstrates a RAG implementation using LangChain, Milvus
and vLLM. RAG enhances LLM responses by retrieving relevant context
from a document collection.

Features:
- Web content loading and chunking
- Vector storage with Milvus
- Embedding generation with vLLM
- Question answering with context

Prerequisites:
1. Install dependencies:
    pip install -U vllm \
                 langchain_milvus langchain_openai \
                 langchain_community beautifulsoup4 \
                 langchain-text-splitters

2. Start services:
    # Start embedding service (port 8000)
    vllm serve ssmits/Qwen2-7B-Instruct-embed-base

    # Start chat service (port 8001)
    vllm serve qwen/Qwen1.5-0.5B-Chat --port 8001

Usage:
    python retrieval_augmented_generation_with_langchain.py

Notes:
    - Ensure both vLLM services are running before executing
    - Default ports: 8000 (embedding), 8001 (chat)
    - First run may take time to download models
"""

import argparse
from argparse import Namespace
from typing import Any

from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_milvus import Milvus
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_and_split_documents(config: dict[str, Any]):
    """
    Load and split documents from web URL
    """
    try:
        loader = WebBaseLoader(web_paths=(config["url"],))
        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config["chunk_size"],
            chunk_overlap=config["chunk_overlap"],
        )
        return text_splitter.split_documents(docs)
    except Exception as e:
        print(f"Error loading document from {config['url']}: {str(e)}")
        raise


def init_vectorstore(config: dict[str, Any], documents: list[Document]):
    """
    Initialize vector store with documents
    """
    return Milvus.from_documents(
        documents=documents,
        embedding=OpenAIEmbeddings(
            model=config["embedding_model"],
            openai_api_key=config["vllm_api_key"],
            openai_api_base=config["vllm_embedding_endpoint"],
        ),
        connection_args={"uri": config["uri"]},
        drop_old=True,
    )


def init_llm(config: dict[str, Any]):
    """
    Initialize llm
    """
    return ChatOpenAI(
        model=config["chat_model"],
        openai_api_key=config["vllm_api_key"],
        openai_api_base=config["vllm_chat_endpoint"],
    )


def get_qa_prompt():
    """
    Get question answering prompt template
    """
    template = """You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:
"""
    return PromptTemplate.from_template(template)


def format_docs(docs: list[Document]):
    """
    Format documents for prompt
    """
    return "\n\n".join(doc.page_content for doc in docs)


def create_qa_chain(retriever: Any, llm: ChatOpenAI, prompt: PromptTemplate):
    """
    Set up question answering chain
    """
    return (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )


def get_parser() -> argparse.ArgumentParser:
    """
    Parse command line arguments
    """
    parser = argparse.ArgumentParser(description="RAG with vLLM and langchain")

    # Add command line arguments
    parser.add_argument(
        "--vllm-api-key", default="EMPTY", help="API key for vLLM compatible services"
    )
    parser.add_argument(
        "--vllm-embedding-endpoint",
        default="http://localhost:8000/v1",
        help="Base URL for embedding service",
    )
    parser.add_argument(
        "--vllm-chat-endpoint",
        default="http://localhost:8001/v1",
        help="Base URL for chat service",
    )
    parser.add_argument("--uri", default="./milvus.db", help="URI for Milvus database")
    parser.add_argument(
        "--url",
        default=("https://docs.vllm.ai/en/latest/getting_started/quickstart.html"),
        help="URL of the document to process",
    )
    parser.add_argument(
        "--embedding-model",
        default="ssmits/Qwen2-7B-Instruct-embed-base",
        help="Model name for embeddings",
    )
    parser.add_argument(
        "--chat-model", default="qwen/Qwen1.5-0.5B-Chat", help="Model name for chat"
    )
    parser.add_argument(
        "-i", "--interactive", action="store_true", help="Enable interactive Q&A mode"
    )
    parser.add_argument(
        "-k", "--top-k", type=int, default=3, help="Number of top results to retrieve"
    )
    parser.add_argument(
        "-c",
        "--chunk-size",
        type=int,
        default=1000,
        help="Chunk size for document splitting",
    )
    parser.add_argument(
        "-o",
        "--chunk-overlap",
        type=int,
        default=200,
        help="Chunk overlap for document splitting",
    )

    return parser


def init_config(args: Namespace):
    """
    Initialize configuration settings from command line arguments
    """

    return {
        "vllm_api_key": args.vllm_api_key,
        "vllm_embedding_endpoint": args.vllm_embedding_endpoint,
        "vllm_chat_endpoint": args.vllm_chat_endpoint,
        "uri": args.uri,
        "embedding_model": args.embedding_model,
        "chat_model": args.chat_model,
        "url": args.url,
        "chunk_size": args.chunk_size,
        "chunk_overlap": args.chunk_overlap,
        "top_k": args.top_k,
    }


def main():
    # Parse command line arguments
    args = get_parser().parse_args()

    # Initialize configuration
    config = init_config(args)

    # Load and split documents
    documents = load_and_split_documents(config)

    # Initialize vector store and retriever
    vectorstore = init_vectorstore(config, documents)
    retriever = vectorstore.as_retriever(search_kwargs={"k": config["top_k"]})

    # Initialize llm and prompt
    llm = init_llm(config)
    prompt = get_qa_prompt()

    # Set up QA chain
    qa_chain = create_qa_chain(retriever, llm, prompt)

    # Interactive mode
    if args.interactive:
        print("\nWelcome to Interactive Q&A System!")
        print("Enter 'q' or 'quit' to exit.")

        while True:
            question = input("\nPlease enter your question: ")
            if question.lower() in ["q", "quit"]:
                print("\nThank you for using! Goodbye!")
                break

            output = qa_chain.invoke(question)
            print(output)
    else:
        # Default single question mode
        question = "How to install vLLM?"
        output = qa_chain.invoke(question)
        print("-" * 50)
        print(output)
        print("-" * 50)


if __name__ == "__main__":
    main()
```

---

## Retrieval Augmented Generation With Llamaindex - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/retrieval_augmented_generation_with_llamaindex/

**Contents:**
- Retrieval Augmented Generation With Llamaindex¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/retrieval_augmented_generation_with_llamaindex.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
RAG (Retrieval Augmented Generation) Implementation with LlamaIndex
================================================================

This script demonstrates a RAG system using:
- LlamaIndex: For document indexing and retrieval
- Milvus: As vector store backend
- vLLM: For embedding and text generation

Features:
1. Document Loading & Processing
2. Embedding & Storage
3. Query Processing

Requirements:
1. Install dependencies:
pip install llama-index llama-index-readers-web \
            llama-index-llms-openai-like    \
            llama-index-embeddings-openai-like \
            llama-index-vector-stores-milvus \

2. Start services:
    # Start embedding service (port 8000)
    vllm serve ssmits/Qwen2-7B-Instruct-embed-base

    # Start chat service (port 8001)
    vllm serve qwen/Qwen1.5-0.5B-Chat --port 8001

Usage:
    python retrieval_augmented_generation_with_llamaindex.py

Notes:
    - Ensure both vLLM services are running before executing
    - Default ports: 8000 (embedding), 8001 (chat)
    - First run may take time to download models
"""

import argparse
from argparse import Namespace
from typing import Any

from llama_index.core import Settings, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai_like import OpenAILikeEmbedding
from llama_index.llms.openai_like import OpenAILike
from llama_index.readers.web import SimpleWebPageReader
from llama_index.vector_stores.milvus import MilvusVectorStore


def init_config(args: Namespace):
    """Initialize configuration with command line arguments"""
    return {
        "url": args.url,
        "embedding_model": args.embedding_model,
        "chat_model": args.chat_model,
        "vllm_api_key": args.vllm_api_key,
        "embedding_endpoint": args.embedding_endpoint,
        "chat_endpoint": args.chat_endpoint,
        "db_path": args.db_path,
        "chunk_size": args.chunk_size,
        "chunk_overlap": args.chunk_overlap,
        "top_k": args.top_k,
    }


def load_documents(url: str) -> list:
    """Load and process web documents"""
    return SimpleWebPageReader(html_to_text=True).load_data([url])


def setup_models(config: dict[str, Any]):
    """Configure embedding and chat models"""
    Settings.embed_model = OpenAILikeEmbedding(
        api_base=config["embedding_endpoint"],
        api_key=config["vllm_api_key"],
        model_name=config["embedding_model"],
    )

    Settings.llm = OpenAILike(
        model=config["chat_model"],
        api_key=config["vllm_api_key"],
        api_base=config["chat_endpoint"],
        context_window=128000,
        is_chat_model=True,
        is_function_calling_model=False,
    )

    Settings.transformations = [
        SentenceSplitter(
            chunk_size=config["chunk_size"],
            chunk_overlap=config["chunk_overlap"],
        )
    ]


def setup_vector_store(db_path: str) -> MilvusVectorStore:
    """Initialize vector store"""
    sample_emb = Settings.embed_model.get_text_embedding("test")
    print(f"Embedding dimension: {len(sample_emb)}")
    return MilvusVectorStore(uri=db_path, dim=len(sample_emb), overwrite=True)


def create_index(documents: list, vector_store: MilvusVectorStore):
    """Create document index"""
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    return VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
    )


def query_document(index: VectorStoreIndex, question: str, top_k: int):
    """Query document with given question"""
    query_engine = index.as_query_engine(similarity_top_k=top_k)
    return query_engine.query(question)


def get_parser() -> argparse.ArgumentParser:
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="RAG with vLLM and LlamaIndex")

    # Add command line arguments
    parser.add_argument(
        "--url",
        default=("https://docs.vllm.ai/en/latest/getting_started/quickstart.html"),
        help="URL of the document to process",
    )
    parser.add_argument(
        "--embedding-model",
        default="ssmits/Qwen2-7B-Instruct-embed-base",
        help="Model name for embeddings",
    )
    parser.add_argument(
        "--chat-model", default="qwen/Qwen1.5-0.5B-Chat", help="Model name for chat"
    )
    parser.add_argument(
        "--vllm-api-key", default="EMPTY", help="API key for vLLM compatible services"
    )
    parser.add_argument(
        "--embedding-endpoint",
        default="http://localhost:8000/v1",
        help="Base URL for embedding service",
    )
    parser.add_argument(
        "--chat-endpoint",
        default="http://localhost:8001/v1",
        help="Base URL for chat service",
    )
    parser.add_argument(
        "--db-path", default="./milvus_demo.db", help="Path to Milvus database"
    )
    parser.add_argument(
        "-i", "--interactive", action="store_true", help="Enable interactive Q&A mode"
    )
    parser.add_argument(
        "-c",
        "--chunk-size",
        type=int,
        default=1000,
        help="Chunk size for document splitting",
    )
    parser.add_argument(
        "-o",
        "--chunk-overlap",
        type=int,
        default=200,
        help="Chunk overlap for document splitting",
    )
    parser.add_argument(
        "-k", "--top-k", type=int, default=3, help="Number of top results to retrieve"
    )

    return parser


def main():
    # Parse command line arguments
    args = get_parser().parse_args()

    # Initialize configuration
    config = init_config(args)

    # Load documents
    documents = load_documents(config["url"])

    # Setup models
    setup_models(config)

    # Setup vector store
    vector_store = setup_vector_store(config["db_path"])

    # Create index
    index = create_index(documents, vector_store)

    if args.interactive:
        print("\nEntering interactive mode. Type 'quit' to exit.")
        while True:
            # Get user question
            question = input("\nEnter your question: ")

            # Check for exit command
            if question.lower() in ["quit", "exit", "q"]:
                print("Exiting interactive mode...")
                break

            # Get and print response
            print("\n" + "-" * 50)
            print("Response:\n")
            response = query_document(index, question, config["top_k"])
            print(response)
            print("-" * 50)
    else:
        # Single query mode
        question = "How to install vLLM?"
        response = query_document(index, question, config["top_k"])
        print("-" * 50)
        print("Response:\n")
        print(response)
        print("-" * 50)


if __name__ == "__main__":
    main()
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
RAG (Retrieval Augmented Generation) Implementation with LlamaIndex
================================================================

This script demonstrates a RAG system using:
- LlamaIndex: For document indexing and retrieval
- Milvus: As vector store backend
- vLLM: For embedding and text generation

Features:
1. Document Loading & Processing
2. Embedding & Storage
3. Query Processing

Requirements:
1. Install dependencies:
pip install llama-index llama-index-readers-web \
            llama-index-llms-openai-like    \
            llama-index-embeddings-openai-like \
            llama-index-vector-stores-milvus \

2. Start services:
    # Start embedding service (port 8000)
    vllm serve ssmits/Qwen2-7B-Instruct-embed-base

    # Start chat service (port 8001)
    vllm serve qwen/Qwen1.5-0.5B-Chat --port 8001

Usage:
    python retrieval_augmented_generation_with_llamaindex.py

Notes:
    - Ensure both vLLM services are running before executing
    - Default ports: 8000 (embedding), 8001 (chat)
    - First run may take time to download models
"""

import argparse
from argparse import Namespace
from typing import Any

from llama_index.core import Settings, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai_like import OpenAILikeEmbedding
from llama_index.llms.openai_like import OpenAILike
from llama_index.readers.web import SimpleWebPageReader
from llama_index.vector_stores.milvus import MilvusVectorStore


def init_config(args: Namespace):
    """Initialize configuration with command line arguments"""
    return {
        "url": args.url,
        "embedding_model": args.embedding_model,
        "chat_model": args.chat_model,
        "vllm_api_key": args.vllm_api_key,
        "embedding_endpoint": args.embedding_endpoint,
        "chat_endpoint": args.chat_endpoint,
        "db_path": args.db_path,
        "chunk_size": args.chunk_size,
        "chunk_overlap": args.chunk_overlap,
        "top_k": args.top_k,
    }


def load_documents(url: str) -> list:
    """Load and process web documents"""
    return SimpleWebPageReader(html_to_text=True).load_data([url])


def setup_models(config: dict[str, Any]):
    """Configure embedding and chat models"""
    Settings.embed_model = OpenAILikeEmbedding(
        api_base=config["embedding_endpoint"],
        api_key=config["vllm_api_key"],
        model_name=config["embedding_model"],
    )

    Settings.llm = OpenAILike(
        model=config["chat_model"],
        api_key=config["vllm_api_key"],
        api_base=config["chat_endpoint"],
        context_window=128000,
        is_chat_model=True,
        is_function_calling_model=False,
    )

    Settings.transformations = [
        SentenceSplitter(
            chunk_size=config["chunk_size"],
            chunk_overlap=config["chunk_overlap"],
        )
    ]


def setup_vector_store(db_path: str) -> MilvusVectorStore:
    """Initialize vector store"""
    sample_emb = Settings.embed_model.get_text_embedding("test")
    print(f"Embedding dimension: {len(sample_emb)}")
    return MilvusVectorStore(uri=db_path, dim=len(sample_emb), overwrite=True)


def create_index(documents: list, vector_store: MilvusVectorStore):
    """Create document index"""
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    return VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
    )


def query_document(index: VectorStoreIndex, question: str, top_k: int):
    """Query document with given question"""
    query_engine = index.as_query_engine(similarity_top_k=top_k)
    return query_engine.query(question)


def get_parser() -> argparse.ArgumentParser:
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="RAG with vLLM and LlamaIndex")

    # Add command line arguments
    parser.add_argument(
        "--url",
        default=("https://docs.vllm.ai/en/latest/getting_started/quickstart.html"),
        help="URL of the document to process",
    )
    parser.add_argument(
        "--embedding-model",
        default="ssmits/Qwen2-7B-Instruct-embed-base",
        help="Model name for embeddings",
    )
    parser.add_argument(
        "--chat-model", default="qwen/Qwen1.5-0.5B-Chat", help="Model name for chat"
    )
    parser.add_argument(
        "--vllm-api-key", default="EMPTY", help="API key for vLLM compatible services"
    )
    parser.add_argument(
        "--embedding-endpoint",
        default="http://localhost:8000/v1",
        help="Base URL for embedding service",
    )
    parser.add_argument(
        "--chat-endpoint",
        default="http://localhost:8001/v1",
        help="Base URL for chat service",
    )
    parser.add_argument(
        "--db-path", default="./milvus_demo.db", help="Path to Milvus database"
    )
    parser.add_argument(
        "-i", "--interactive", action="store_true", help="Enable interactive Q&A mode"
    )
    parser.add_argument(
        "-c",
        "--chunk-size",
        type=int,
        default=1000,
        help="Chunk size for document splitting",
    )
    parser.add_argument(
        "-o",
        "--chunk-overlap",
        type=int,
        default=200,
        help="Chunk overlap for document splitting",
    )
    parser.add_argument(
        "-k", "--top-k", type=int, default=3, help="Number of top results to retrieve"
    )

    return parser


def main():
    # Parse command line arguments
    args = get_parser().parse_args()

    # Initialize configuration
    config = init_config(args)

    # Load documents
    documents = load_documents(config["url"])

    # Setup models
    setup_models(config)

    # Setup vector store
    vector_store = setup_vector_store(config["db_path"])

    # Create index
    index = create_index(documents, vector_store)

    if args.interactive:
        print("\nEntering interactive mode. Type 'quit' to exit.")
        while True:
            # Get user question
            question = input("\nEnter your question: ")

            # Check for exit command
            if question.lower() in ["quit", "exit", "q"]:
                print("Exiting interactive mode...")
                break

            # Get and print response
            print("\n" + "-" * 50)
            print("Response:\n")
            response = query_document(index, question, config["top_k"])
            print(response)
            print("-" * 50)
    else:
        # Single query mode
        question = "How to install vLLM?"
        response = query_document(index, question, config["top_k"])
        print("-" * 50)
        print("Response:\n")
        print(response)
        print("-" * 50)


if __name__ == "__main__":
    main()
```

---

## Run Cluster - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/run_cluster/

**Contents:**
- Run Cluster¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/run_cluster.sh.

**Examples:**

Example 1 (bash):
```bash
#!/bin/bash
#
# Launch a Ray cluster inside Docker for vLLM inference.
#
# This script can start either a head node or a worker node, depending on the
# --head or --worker flag provided as the third positional argument.
#
# Usage:
# 1. Designate one machine as the head node and execute:
#    bash run_cluster.sh \
#         vllm/vllm-openai \
#         <head_node_ip> \
#         --head \
#         /abs/path/to/huggingface/cache \
#         -e VLLM_HOST_IP=<head_node_ip>
#
# 2. On every worker machine, execute:
#    bash run_cluster.sh \
#         vllm/vllm-openai \
#         <head_node_ip> \
#         --worker \
#         /abs/path/to/huggingface/cache \
#         -e VLLM_HOST_IP=<worker_node_ip>
#
# Each worker requires a unique VLLM_HOST_IP value.
# Keep each terminal session open. Closing a session stops the associated Ray
# node and thereby shuts down the entire cluster.
# Every machine must be reachable at the supplied IP address.
#
# The container is named "node-<random_suffix>". To open a shell inside
# a container after launch, use:
#       docker exec -it node-<random_suffix> /bin/bash
#
# Then, you can execute vLLM commands on the Ray cluster as if it were a
# single machine, e.g. vllm serve ...
#
# To stop the container, use:
#       docker stop node-<random_suffix>

# Check for minimum number of required arguments.
if [ $# -lt 4 ]; then
    echo "Usage: $0 docker_image head_node_ip --head|--worker path_to_hf_home [additional_args...]"
    exit 1
fi

# Extract the mandatory positional arguments and remove them from $@.
DOCKER_IMAGE="$1"
HEAD_NODE_ADDRESS="$2"
NODE_TYPE="$3"  # Should be --head or --worker.
PATH_TO_HF_HOME="$4"
shift 4

# Preserve any extra arguments so they can be forwarded to Docker.
ADDITIONAL_ARGS=("$@")

# Validate the NODE_TYPE argument.
if [ "${NODE_TYPE}" != "--head" ] && [ "${NODE_TYPE}" != "--worker" ]; then
    echo "Error: Node type must be --head or --worker"
    exit 1
fi

# Extract VLLM_HOST_IP from ADDITIONAL_ARGS (e.g. "-e VLLM_HOST_IP=...").
VLLM_HOST_IP=""
for ((i = 0; i < ${#ADDITIONAL_ARGS[@]}; i++)); do
    arg="${ADDITIONAL_ARGS[$i]}"
    case "${arg}" in
        -e)
            next="${ADDITIONAL_ARGS[$((i + 1))]:-}"
            if [[ "${next}" == VLLM_HOST_IP=* ]]; then
                VLLM_HOST_IP="${next#VLLM_HOST_IP=}"
                break
            fi
            ;;
        -eVLLM_HOST_IP=* | VLLM_HOST_IP=*)
            VLLM_HOST_IP="${arg#*=}"
            break
            ;;
    esac
done

# For the head node, HEAD_NODE_ADDRESS and VLLM_HOST_IP should be consistent.
if [[ "${NODE_TYPE}" == "--head" && -n "${VLLM_HOST_IP}" ]]; then
    if [[ "${VLLM_HOST_IP}" != "${HEAD_NODE_ADDRESS}" ]]; then
        echo "Warning: VLLM_HOST_IP (${VLLM_HOST_IP}) differs from head_node_ip (${HEAD_NODE_ADDRESS})."
        echo "Using VLLM_HOST_IP as the head node address."
        HEAD_NODE_ADDRESS="${VLLM_HOST_IP}"
    fi
fi

# Generate a unique container name with random suffix.
# Docker container names must be unique on each host.
# The random suffix allows multiple Ray containers to run simultaneously on the same machine,
# for example, on a multi-GPU machine.
CONTAINER_NAME="node-${RANDOM}"

# Define a cleanup routine that removes the container when the script exits.
# This prevents orphaned containers from accumulating if the script is interrupted.
cleanup() {
    docker stop "${CONTAINER_NAME}"
    docker rm "${CONTAINER_NAME}"
}
trap cleanup EXIT

# Build the Ray start command based on the node role.
# The head node manages the cluster and accepts connections on port 6379,
# while workers connect to the head's address.
RAY_START_CMD="ray start --block"
if [ "${NODE_TYPE}" == "--head" ]; then
    RAY_START_CMD+=" --head --node-ip-address=${HEAD_NODE_ADDRESS} --port=6379"
else

    RAY_START_CMD+=" --address=${HEAD_NODE_ADDRESS}:6379"
    if [ -n "${VLLM_HOST_IP}" ]; then
        RAY_START_CMD+=" --node-ip-address=${VLLM_HOST_IP}"
    fi
fi

# Launch the container with the assembled parameters.
# --network host: Allows Ray nodes to communicate directly via host networking
# --shm-size 10.24g: Increases shared memory
# --gpus all: Gives container access to all GPUs on the host
# -v HF_HOME: Mounts HuggingFace cache to avoid re-downloading models
docker run \
    --entrypoint /bin/bash \
    --network host \
    --name "${CONTAINER_NAME}" \
    --shm-size 10.24g \
    --gpus all \
    -v "${PATH_TO_HF_HOME}:/root/.cache/huggingface" \
    "${ADDITIONAL_ARGS[@]}" \
    "${DOCKER_IMAGE}" -c "${RAY_START_CMD}"
```

Example 2 (bash):
```bash
#!/bin/bash
#
# Launch a Ray cluster inside Docker for vLLM inference.
#
# This script can start either a head node or a worker node, depending on the
# --head or --worker flag provided as the third positional argument.
#
# Usage:
# 1. Designate one machine as the head node and execute:
#    bash run_cluster.sh \
#         vllm/vllm-openai \
#         <head_node_ip> \
#         --head \
#         /abs/path/to/huggingface/cache \
#         -e VLLM_HOST_IP=<head_node_ip>
#
# 2. On every worker machine, execute:
#    bash run_cluster.sh \
#         vllm/vllm-openai \
#         <head_node_ip> \
#         --worker \
#         /abs/path/to/huggingface/cache \
#         -e VLLM_HOST_IP=<worker_node_ip>
#
# Each worker requires a unique VLLM_HOST_IP value.
# Keep each terminal session open. Closing a session stops the associated Ray
# node and thereby shuts down the entire cluster.
# Every machine must be reachable at the supplied IP address.
#
# The container is named "node-<random_suffix>". To open a shell inside
# a container after launch, use:
#       docker exec -it node-<random_suffix> /bin/bash
#
# Then, you can execute vLLM commands on the Ray cluster as if it were a
# single machine, e.g. vllm serve ...
#
# To stop the container, use:
#       docker stop node-<random_suffix>

# Check for minimum number of required arguments.
if [ $# -lt 4 ]; then
    echo "Usage: $0 docker_image head_node_ip --head|--worker path_to_hf_home [additional_args...]"
    exit 1
fi

# Extract the mandatory positional arguments and remove them from $@.
DOCKER_IMAGE="$1"
HEAD_NODE_ADDRESS="$2"
NODE_TYPE="$3"  # Should be --head or --worker.
PATH_TO_HF_HOME="$4"
shift 4

# Preserve any extra arguments so they can be forwarded to Docker.
ADDITIONAL_ARGS=("$@")

# Validate the NODE_TYPE argument.
if [ "${NODE_TYPE}" != "--head" ] && [ "${NODE_TYPE}" != "--worker" ]; then
    echo "Error: Node type must be --head or --worker"
    exit 1
fi

# Extract VLLM_HOST_IP from ADDITIONAL_ARGS (e.g. "-e VLLM_HOST_IP=...").
VLLM_HOST_IP=""
for ((i = 0; i < ${#ADDITIONAL_ARGS[@]}; i++)); do
    arg="${ADDITIONAL_ARGS[$i]}"
    case "${arg}" in
        -e)
            next="${ADDITIONAL_ARGS[$((i + 1))]:-}"
            if [[ "${next}" == VLLM_HOST_IP=* ]]; then
                VLLM_HOST_IP="${next#VLLM_HOST_IP=}"
                break
            fi
            ;;
        -eVLLM_HOST_IP=* | VLLM_HOST_IP=*)
            VLLM_HOST_IP="${arg#*=}"
            break
            ;;
    esac
done

# For the head node, HEAD_NODE_ADDRESS and VLLM_HOST_IP should be consistent.
if [[ "${NODE_TYPE}" == "--head" && -n "${VLLM_HOST_IP}" ]]; then
    if [[ "${VLLM_HOST_IP}" != "${HEAD_NODE_ADDRESS}" ]]; then
        echo "Warning: VLLM_HOST_IP (${VLLM_HOST_IP}) differs from head_node_ip (${HEAD_NODE_ADDRESS})."
        echo "Using VLLM_HOST_IP as the head node address."
        HEAD_NODE_ADDRESS="${VLLM_HOST_IP}"
    fi
fi

# Generate a unique container name with random suffix.
# Docker container names must be unique on each host.
# The random suffix allows multiple Ray containers to run simultaneously on the same machine,
# for example, on a multi-GPU machine.
CONTAINER_NAME="node-${RANDOM}"

# Define a cleanup routine that removes the container when the script exits.
# This prevents orphaned containers from accumulating if the script is interrupted.
cleanup() {
    docker stop "${CONTAINER_NAME}"
    docker rm "${CONTAINER_NAME}"
}
trap cleanup EXIT

# Build the Ray start command based on the node role.
# The head node manages the cluster and accepts connections on port 6379,
# while workers connect to the head's address.
RAY_START_CMD="ray start --block"
if [ "${NODE_TYPE}" == "--head" ]; then
    RAY_START_CMD+=" --head --node-ip-address=${HEAD_NODE_ADDRESS} --port=6379"
else

    RAY_START_CMD+=" --address=${HEAD_NODE_ADDRESS}:6379"
    if [ -n "${VLLM_HOST_IP}" ]; then
        RAY_START_CMD+=" --node-ip-address=${VLLM_HOST_IP}"
    fi
fi

# Launch the container with the assembled parameters.
# --network host: Allows Ray nodes to communicate directly via host networking
# --shm-size 10.24g: Increases shared memory
# --gpus all: Gives container access to all GPUs on the host
# -v HF_HOME: Mounts HuggingFace cache to avoid re-downloading models
docker run \
    --entrypoint /bin/bash \
    --network host \
    --name "${CONTAINER_NAME}" \
    --shm-size 10.24g \
    --gpus all \
    -v "${PATH_TO_HF_HOME}:/root/.cache/huggingface" \
    "${ADDITIONAL_ARGS[@]}" \
    "${DOCKER_IMAGE}" -c "${RAY_START_CMD}"
```

---

## Sagemaker-Entrypoint - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/sagemaker-entrypoint/

**Contents:**
- Sagemaker-Entrypoint¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/sagemaker-entrypoint.sh.

**Examples:**

Example 1 (bash):
```bash
#!/bin/bash

# Define the prefix for environment variables to look for
PREFIX="SM_VLLM_"
ARG_PREFIX="--"

# Initialize an array for storing the arguments
# port 8080 required by sagemaker, https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html#your-algorithms-inference-code-container-response
ARGS=(--port 8080)

# Loop through all environment variables
while IFS='=' read -r key value; do
    # Remove the prefix from the key, convert to lowercase, and replace underscores with dashes
    arg_name=$(echo "${key#"${PREFIX}"}" | tr '[:upper:]' '[:lower:]' | tr '_' '-')

    # Add the argument name and value to the ARGS array
    ARGS+=("${ARG_PREFIX}${arg_name}")
    if [ -n "$value" ]; then
        ARGS+=("$value")
    fi
done < <(env | grep "^${PREFIX}")

# Pass the collected arguments to the main entrypoint
exec vllm serve "${ARGS[@]}"
```

Example 2 (bash):
```bash
#!/bin/bash

# Define the prefix for environment variables to look for
PREFIX="SM_VLLM_"
ARG_PREFIX="--"

# Initialize an array for storing the arguments
# port 8080 required by sagemaker, https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html#your-algorithms-inference-code-container-response
ARGS=(--port 8080)

# Loop through all environment variables
while IFS='=' read -r key value; do
    # Remove the prefix from the key, convert to lowercase, and replace underscores with dashes
    arg_name=$(echo "${key#"${PREFIX}"}" | tr '[:upper:]' '[:lower:]' | tr '_' '-')

    # Add the argument name and value to the ARGS array
    ARGS+=("${ARG_PREFIX}${arg_name}")
    if [ -n "$value" ]; then
        ARGS+=("$value")
    fi
done < <(env | grep "^${PREFIX}")

# Pass the collected arguments to the main entrypoint
exec vllm serve "${ARGS[@]}"
```

---

## serving_chat_stream_harmony - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_chat_stream_harmony/

**Contents:**
- vllm.entrypoints.openai.serving_chat_stream_harmony ¶
- extract_harmony_streaming_delta ¶

Harmony-specific streaming delta extraction for chat completions.

This module handles the extraction of DeltaMessage objects from harmony parser state during streaming chat completions.

Extract a DeltaMessage from harmony parser state during streaming.

The StreamableParser instance tracking parse state

Current channel ("final", "analysis", "commentary", etc.)

Current recipient (e.g., "functions.my_func")

Previous recipient for detecting tool call transitions

The text delta to include in the message

Whether to include reasoning content

A tuple of (DeltaMessage or None, tools_streamed_flag)

**Examples:**

Example 1 (rust):
```rust
extract_harmony_streaming_delta(
    harmony_parser: StreamableParser,
    cur_channel: str | None,
    cur_recipient: str | None,
    prev_recipient: str | None,
    delta_text: str,
    include_reasoning: bool,
) -> tuple[DeltaMessage | None, bool]
```

Example 2 (rust):
```rust
extract_harmony_streaming_delta(
    harmony_parser: StreamableParser,
    cur_channel: str | None,
    cur_recipient: str | None,
    prev_recipient: str | None,
    delta_text: str,
    include_reasoning: bool,
) -> tuple[DeltaMessage | None, bool]
```

Example 3 (unknown):
```unknown
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
```

Example 4 (json):
```json
def extract_harmony_streaming_delta(
    harmony_parser: StreamableParser,
    cur_channel: str | None,
    cur_recipient: str | None,
    prev_recipient: str | None,
    delta_text: str,
    include_reasoning: bool,
) -> tuple[DeltaMessage | None, bool]:
    """
    Extract a DeltaMessage from harmony parser state during streaming.

    Args:
        harmony_parser: The StreamableParser instance tracking parse state
        cur_channel: Current channel ("final", "analysis", "commentary", etc.)
        cur_recipient: Current recipient (e.g., "functions.my_func")
        prev_recipient: Previous recipient for detecting tool call transitions
        delta_text: The text delta to include in the message
        include_reasoning: Whether to include reasoning content

    Returns:
        A tuple of (DeltaMessage or None, tools_streamed_flag)
    """
    tools_streamed = False

    if cur_channel == "final":
        delta_message = DeltaMessage(content=delta_text)
    elif (
        (cur_channel == "commentary" or cur_channel == "analysis")
        and cur_recipient
        and cur_recipient.startswith("functions.")
    ):
        # Count completed tool calls to determine index
        base_index = 0
        for msg in harmony_parser.messages:
            if (
                (msg.channel == "commentary" or msg.channel == "analysis")
                and msg.recipient
                and msg.recipient.startswith("functions.")
            ):
                base_index += 1

        if prev_recipient != cur_recipient:
            tool_name = cur_recipient.split("functions.", 1)[1]
            delta_message = DeltaMessage(
                tool_calls=[
                    DeltaToolCall(
                        id=make_tool_call_id(),
                        type="function",
                        function=DeltaFunctionCall(
                            name=tool_name,
                            arguments="",
                        ),
                        index=base_index,
                    )
                ]
            )
        elif delta_text:
            delta_message = DeltaMessage(
                tool_calls=[
                    DeltaToolCall(
                        index=base_index,
                        function=DeltaFunctionCall(arguments=delta_text),
                    )
                ]
            )
        else:
            delta_message = None

        if delta_message is not None:
            tools_streamed = True
    elif cur_channel == "commentary":
        # Tool call preambles meant to be shown to the user
        delta_message = DeltaMessage(content=delta_text)
    elif cur_channel == "analysis":
        if include_reasoning:
            delta_message = DeltaMessage(reasoning=delta_text)
        else:
            delta_message = None
    else:
        delta_message = None

    return delta_message, tools_streamed
```

---

## serving_chat - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_chat/

**Contents:**
- vllm.entrypoints.openai.serving_chat ¶
- logger module-attribute ¶
- OpenAIServingChat ¶
  - browser_tool instance-attribute ¶
  - chat_template instance-attribute ¶
  - chat_template_content_format instance-attribute ¶
  - default_sampling_params instance-attribute ¶
  - enable_auto_tools instance-attribute ¶
  - enable_force_include_usage instance-attribute ¶
  - enable_log_outputs instance-attribute ¶

Calculate the current level of nested brackets in a given string.

Create OpenAI-style logprobs.

Check to see if we should check for unstreamed tool arguments tokens. This is only applicable when auto tool parsing is enabled, the delta is a tool call with arguments.

Utility function to check if streamed tokens should go through the tool call parser that was configured.

We only want to do this IF user-provided tools are set, a tool parser is configured, "auto" tool choice is enabled, and the request's tool choice field indicates that "auto" tool choice should be used.

Chat Completion API similar to OpenAI's API.

See https://platform.openai.com/docs/api-reference/chat/create for the API specification. This API mimics the OpenAI Chat Completion API.

Warm up the chat template processing to avoid first-request latency.

This method triggers Jinja2 template compilation and content format detection that would otherwise happen on the first real request, causing increased latency on the first request.

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
 231
 232
 233
 234
 235
 236
 237
 238
 239
 240
 241
 242
 243
 244
 245
 246
 247
 248
 249
 250
 251
 252
 253
 254
 255
 256
 257
 258
 259
 260
 261
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
 413
 414
 415
 416
 417
 418
 419
 420
 421
 422
 423
 424
 425
 426
 427
 428
 429
 430
 431
 432
 433
 434
 435
 436
 437
 438
 439
 440
 441
 442
 443
 444
 445
 446
 447
 448
 449
 450
 451
 452
 453
 454
 455
 456
 457
 458
 459
 460
 461
 462
 463
 464
 465
 466
 467
 468
 469
 470
 471
 472
 473
 474
 475
 476
 477
 478
 479
 480
 481
 482
 483
 484
 485
 486
 487
 488
 489
 490
 491
 492
 493
 494
 495
 496
 497
 498
 499
 500
 501
 502
 503
 504
 505
 506
 507
 508
 509
 510
 511
 512
 513
 514
 515
 516
 517
 518
 519
 520
 521
 522
 523
 524
 525
 526
 527
 528
 529
 530
 531
 532
 533
 534
 535
 536
 537
 538
 539
 540
 541
 542
 543
 544
 545
 546
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
 698
 699
 700
 701
 702
 703
 704
 705
 706
 707
 708
 709
 710
 711
 712
 713
 714
 715
 716
 717
 718
 719
 720
 721
 722
 723
 724
 725
 726
 727
 728
 729
 730
 731
 732
 733
 734
 735
 736
 737
 738
 739
 740
 741
 742
 743
 744
 745
 746
 747
 748
 749
 750
 751
 752
 753
 754
 755
 756
 757
 758
 759
 760
 761
 762
 763
 764
 765
 766
 767
 768
 769
 770
 771
 772
 773
 774
 775
 776
 777
 778
 779
 780
 781
 782
 783
 784
 785
 786
 787
 788
 789
 790
 791
 792
 793
 794
 795
 796
 797
 798
 799
 800
 801
 802
 803
 804
 805
 806
 807
 808
 809
 810
 811
 812
 813
 814
 815
 816
 817
 818
 819
 820
 821
 822
 823
 824
 825
 826
 827
 828
 829
 830
 831
 832
 833
 834
 835
 836
 837
 838
 839
 840
 841
 842
 843
 844
 845
 846
 847
 848
 849
 850
 851
 852
 853
 854
 855
 856
 857
 858
 859
 860
 861
 862
 863
 864
 865
 866
 867
 868
 869
 870
 871
 872
 873
 874
 875
 876
 877
 878
 879
 880
 881
 882
 883
 884
 885
 886
 887
 888
 889
 890
 891
 892
 893
 894
 895
 896
 897
 898
 899
 900
 901
 902
 903
 904
 905
 906
 907
 908
 909
 910
 911
 912
 913
 914
 915
 916
 917
 918
 919
 920
 921
 922
 923
 924
 925
 926
 927
 928
 929
 930
 931
 932
 933
 934
 935
 936
 937
 938
 939
 940
 941
 942
 943
 944
 945
 946
 947
 948
 949
 950
 951
 952
 953
 954
 955
 956
 957
 958
 959
 960
 961
 962
 963
 964
 965
 966
 967
 968
 969
 970
 971
 972
 973
 974
 975
 976
 977
 978
 979
 980
 981
 982
 983
 984
 985
 986
 987
 988
 989
 990
 991
 992
 993
 994
 995
 996
 997
 998
 999
1000
1001
1002
1003
1004
1005
1006
1007
1008
1009
1010
1011
1012
1013
1014
1015
1016
1017
1018
1019
1020
1021
1022
1023
1024
1025
1026
1027
1028
1029
1030
1031
1032
1033
1034
1035
1036
1037
1038
1039
1040
1041
1042
1043
1044
1045
1046
1047
1048
1049
1050
1051
1052
1053
1054
1055
1056
1057
1058
1059
1060
1061
1062
1063
1064
1065
1066
1067
1068
1069
1070
1071
1072
1073
1074
1075
1076
1077
1078
1079
1080
1081
1082
1083
1084
1085
1086
1087
1088
1089
1090
1091
1092
1093
1094
1095
1096
1097
1098
1099
1100
1101
1102
1103
1104
1105
1106
1107
1108
1109
1110
1111
1112
1113
1114
1115
1116
1117
1118
1119
1120
1121
1122
1123
1124
1125
1126
1127
1128
1129
1130
1131
1132
1133
1134
1135
1136
1137
1138
1139
1140
1141
1142
1143
1144
1145
1146
1147
1148
1149
1150
1151
1152
1153
1154
1155
1156
1157
1158
1159
1160
1161
1162
1163
1164
1165
1166
1167
1168
1169
1170
1171
1172
1173
1174
1175
1176
1177
1178
1179
1180
1181
1182
1183
1184
1185
1186
1187
1188
1189
1190
1191
1192
1193
1194
1195
1196
1197
1198
1199
1200
1201
1202
1203
1204
1205
1206
1207
1208
1209
1210
1211
1212
1213
1214
1215
1216
1217
1218
1219
1220
1221
1222
1223
1224
1225
1226
1227
1228
1229
1230
1231
1232
1233
1234
1235
1236
1237
1238
1239
1240
1241
1242
1243
1244
1245
1246
1247
1248
1249
1250
1251
1252
1253
1254
1255
1256
1257
1258
1259
1260
1261
1262
1263
1264
1265
1266
1267
1268
1269
1270
1271
1272
1273
1274
1275
1276
1277
1278
1279
1280
1281
1282
1283
1284
1285
1286
1287
1288
1289
1290
1291
1292
1293
1294
1295
1296
1297
1298
1299
1300
1301
1302
1303
1304
1305
1306
1307
1308
1309
1310
1311
1312
1313
1314
1315
1316
1317
1318
1319
1320
1321
1322
1323
1324
1325
1326
1327
1328
1329
1330
1331
1332
1333
1334
1335
1336
1337
1338
1339
1340
1341
1342
1343
1344
1345
1346
1347
1348
1349
1350
1351
1352
1353
1354
1355
1356
1357
1358
1359
1360
1361
1362
1363
1364
1365
1366
1367
1368
1369
1370
1371
1372
1373
1374
1375
1376
1377
1378
1379
1380
1381
1382
1383
1384
1385
1386
1387
1388
1389
1390
1391
1392
1393
1394
1395
1396
1397
1398
1399
1400
1401
1402
1403
1404
1405
1406
1407
1408
1409
1410
1411
1412
1413
1414
1415
1416
1417
1418
1419
1420
1421
1422
1423
1424
1425
1426
1427
1428
1429
1430
1431
1432
1433
1434
1435
1436
1437
1438
1439
1440
1441
1442
1443
1444
1445
1446
1447
1448
1449
1450
1451
1452
1453
1454
1455
1456
1457
1458
1459
1460
1461
1462
1463
1464
1465
1466
1467
1468
1469
1470
1471
1472
1473
1474
1475
1476
1477
1478
1479
1480
1481
1482
1483
1484
1485
1486
1487
1488
1489
1490
1491
1492
1493
1494
1495
1496
1497
1498
1499
1500
1501
1502
1503
1504
1505
1506
1507
1508
1509
1510
1511
1512
1513
1514
1515
1516
1517
1518
1519
1520
1521
1522
1523
1524
1525
1526
1527
1528
1529
1530
1531
1532
1533
1534
1535
1536
1537
1538
1539
1540
1541
1542
1543
1544
1545
1546
1547
1548
1549
1550
1551
1552
1553
1554
1555
1556
1557
1558
1559
1560
1561
1562
1563
1564
1565
1566
1567
1568
1569
1570
1571
1572
1573
1574
1575
1576
1577
1578
1579
1580
1581
1582
1583
1584
1585
1586
1587
1588
1589
1590
1591
1592
1593
1594
1595
1596
1597
1598
1599
1600
1601
1602
1603
1604
1605
1606
1607
1608
1609
1610
1611
1612
1613
1614
1615
1616
1617
1618
1619
1620
1621
1622
1623
1624
1625
1626
1627
1628
1629
1630
1631
1632
1633
1634
1635
1636
1637
1638
1639
1640
1641
1642
1643
1644
1645
1646
1647
1648
1649
1650
1651
1652
1653
1654
1655
1656
1657
1658
1659
1660
1661
1662
1663
1664
1665
1666
1667
1668
1669
1670
1671
1672
1673
1674
1675
1676
1677
1678
1679
1680
1681
1682
1683
1684
1685
1686
1687
1688
1689
1690
1691
1692
1693
1694
1695
1696
1697
1698
1699
1700
1701
1702
1703
1704
1705
1706
1707
1708
1709
1710
1711
1712
1713
1714
1715
1716
1717
1718
1719
1720
1721
1722
1723
1724
1725
1726
1727
1728
1729
1730
1731
1732
1733
1734
1735
1736
1737
1738
1739
1740
1741
1742
1743
1744
1745
1746
1747
1748
1749
1750
1751
1752
1753
1754
1755
1756
1757
1758
1759
1760
1761
1762
1763
1764
1765
1766
1767
1768
1769
1770
1771
1772
1773
1774
1775
1776
1777
1778
1779
1780
1781
1782
1783
1784
1785
1786
1787
1788
1789
1790
1791
1792
1793
1794
1795
1796
1797
1798
1799
1800
1801
1802
1803
1804
1805
1806
1807
1808
1809
1810
1811
1812
1813
1814
1815
1816
1817
1818
1819
1820
1821
1822
1823
1824
1825
1826
1827
1828
1829
1830
1831
1832
1833
1834
1835
1836
1837
1838
1839
1840
1841
1842
1843
1844
1845
1846
1847
1848
1849
```

Example 4 (python):
```python
class OpenAIServingChat(OpenAIServing):
    def __init__(
        self,
        engine_client: EngineClient,
        models: OpenAIServingModels,
        response_role: str,
        *,
        request_logger: RequestLogger | None,
        chat_template: str | None,
        chat_template_content_format: ChatTemplateContentFormatOption,
        trust_request_chat_template: bool = False,
        return_tokens_as_token_ids: bool = False,
        reasoning_parser: str = "",
        enable_auto_tools: bool = False,
        exclude_tools_when_tool_choice_none: bool = False,
        tool_parser: str | None = None,
        enable_prompt_tokens_details: bool = False,
        enable_force_include_usage: bool = False,
        enable_log_outputs: bool = False,
        log_error_stack: bool = False,
    ) -> None:
        super().__init__(
            engine_client=engine_client,
            models=models,
            request_logger=request_logger,
            return_tokens_as_token_ids=return_tokens_as_token_ids,
            log_error_stack=log_error_stack,
        )

        self.response_role = response_role
        self.chat_template = chat_template
        self.chat_template_content_format: Final = chat_template_content_format
        self.trust_request_chat_template = trust_request_chat_template
        self.enable_log_outputs = enable_log_outputs

        # set up logits processors
        self.logits_processors = self.model_config.logits_processors

        # set up reasoning parser
        self.reasoning_parser = self._get_reasoning_parser(
            reasoning_parser_name=reasoning_parser
        )
        # set up tool use
        self.enable_auto_tools: bool = enable_auto_tools
        self.tool_parser = self._get_tool_parser(
            tool_parser_name=tool_parser, enable_auto_tools=enable_auto_tools
        )
        self.exclude_tools_when_tool_choice_none = exclude_tools_when_tool_choice_none

        self.enable_prompt_tokens_details = enable_prompt_tokens_details
        self.enable_force_include_usage = enable_force_include_usage
        self.default_sampling_params = self.model_config.get_diff_sampling_param()
        if self.default_sampling_params:
            source = self.model_config.generation_config
            source = "model" if source == "auto" else source
            logger.info(
                "Using default chat sampling params from %s: %s",
                source,
                self.default_sampling_params,
            )
        if self.model_config.hf_config.model_type == "kimi_k2":
            self.tool_call_id_type = "kimi_k2"
        else:
            self.tool_call_id_type = "random"

        self.use_harmony = self.model_config.hf_config.model_type == "gpt_oss"
        if self.use_harmony:
            if "stop_token_ids" not in self.default_sampling_params:
                self.default_sampling_params["stop_token_ids"] = []
            self.default_sampling_params["stop_token_ids"].extend(
                get_stop_tokens_for_assistant_actions()
            )

        # NOTE(woosuk): While OpenAI's chat completion API supports browsing
        # for some models, currently vLLM doesn't support it. Please use the
        # Responses API instead.
        self.supports_browsing = False
        self.browser_tool = None
        # NOTE(woosuk): Chat completion API does not support code interpreter.
        # Please use the Responses API instead.
        self.supports_code_interpreter = False
        self.python_tool = None

    async def warmup(self) -> None:
        """
        Warm up the chat template processing to avoid first-request latency.

        This method triggers Jinja2 template compilation and content format
        detection that would otherwise happen on the first real request,
        causing increased latency on the first request.
        """
        logger.info("Warming up chat template processing...")
        start_time = time.perf_counter()

        try:
            # Get the tokenizer from the engine
            tokenizer = await self.engine_client.get_tokenizer()

            # Create a minimal dummy request
            dummy_request = ChatCompletionRequest(
                messages=[{"role": "user", "content": "warmup"}],
                model=None,
                max_completion_tokens=1,
            )

            # Call _preprocess_chat to trigger template compilation
            # This forces:
            # 1. Chat template content format detection
            # 2. Jinja2 template compilation
            # 3. Tokenizer initialization for chat
            await self._preprocess_chat(
                dummy_request,
                tokenizer,
                dummy_request.messages,
                chat_template=self.chat_template,
                chat_template_content_format=self.chat_template_content_format,
                add_generation_prompt=True,
                continue_final_message=False,
                tool_dicts=None,
                documents=None,
                chat_template_kwargs=None,
                tool_parser=None,
                add_special_tokens=False,
            )

            elapsed = (time.perf_counter() - start_time) * 1000
            logger.info("Chat template warmup completed in %.1fms", elapsed)

        except Exception:
            # Log but don't fail server startup if warmup fails
            logger.exception("Chat template warmup failed")

    async def create_chat_completion(
        self,
        request: ChatCompletionRequest,
        raw_request: Request | None = None,
    ) -> AsyncGenerator[str, None] | ChatCompletionResponse | ErrorResponse:
        """
        Chat Completion API similar to OpenAI's API.

        See https://platform.openai.com/docs/api-reference/chat/create
        for the API specification. This API mimics the OpenAI
        Chat Completion API.
        """
        error_check_ret = await self._check_model(request)
        if error_check_ret is not None:
            logger.error("Error with model %s", error_check_ret)
            return error_check_ret

        # If the engine is dead, raise the engine's DEAD_ERROR.
        # This is required for the streaming case, where we return a
        # success status before we actually start generating text :).
        if self.engine_client.errored:
            raise self.engine_client.dead_error

        try:
            lora_request = self._maybe_get_adapters(
                request, supports_default_mm_loras=True
            )

            model_name = self.models.model_name(lora_request)

            tokenizer = await self.engine_client.get_tokenizer()

            tool_parser = self.tool_parser

            if isinstance(tokenizer, MistralTokenizer):
                # because of issues with pydantic we need to potentially
                # re-serialize the tool_calls field of the request
                # for more info: see comment in `maybe_serialize_tool_calls`
                maybe_serialize_tool_calls(request)
                truncate_tool_call_ids(request)
                validate_request_params(request)

            # Check if tool parsing is unavailable (common condition)
            tool_parsing_unavailable = (
                tool_parser is None
                and not isinstance(tokenizer, MistralTokenizer)
                and not self.use_harmony
            )

            # Validate tool_choice when tool parsing is required but unavailable
            if tool_parsing_unavailable and request.tool_choice not in (
                None,
                "none",
            ):
                if request.tool_choice == "auto" and not self.enable_auto_tools:
                    # for hf tokenizers, "auto" tools requires
                    # --enable-auto-tool-choice and --tool-call-parser
                    return self.create_error_response(
                        '"auto" tool choice requires '
                        "--enable-auto-tool-choice and --tool-call-parser to be set"
                    )
                elif request.tool_choice != "auto":
                    # "required" or named tool requires tool parser
                    return self.create_error_response(
                        f'tool_choice="{request.tool_choice}" requires '
                        "--tool-call-parser to be set"
                    )

            if request.tools is None or (
                request.tool_choice == "none"
                and self.exclude_tools_when_tool_choice_none
            ):
                tool_dicts = None
            else:
                tool_dicts = [tool.model_dump() for tool in request.tools]

            if not self.use_harmony:
                # Common case.
                error_check_ret = self._validate_chat_template(
                    request_chat_template=request.chat_template,
                    chat_template_kwargs=request.chat_template_kwargs,
                    trust_request_chat_template=self.trust_request_chat_template,
                )
                if error_check_ret is not None:
                    return error_check_ret
                conversation, engine_prompts = await self._preprocess_chat(
                    request,
                    tokenizer,
                    request.messages,
                    chat_template=request.chat_template or self.chat_template,
                    chat_template_content_format=self.chat_template_content_format,
                    add_generation_prompt=request.add_generation_prompt,
                    continue_final_message=request.continue_final_message,
                    tool_dicts=tool_dicts,
                    documents=request.documents,
                    chat_template_kwargs=request.chat_template_kwargs,
                    tool_parser=tool_parser,
                    add_special_tokens=request.add_special_tokens,
                )
            else:
                # For GPT-OSS.
                should_include_tools = tool_dicts is not None
                conversation, engine_prompts = self._make_request_with_harmony(
                    request, should_include_tools
                )
        except (ValueError, TypeError, RuntimeError, jinja2.TemplateError) as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(f"{e} {e.__cause__}")

        request_id = (
            f"chatcmpl-{self._base_request_id(raw_request, request.request_id)}"
        )

        request_metadata = RequestResponseMetadata(request_id=request_id)
        if raw_request:
            raw_request.state.request_metadata = request_metadata

        # Extract data_parallel_rank from header (router can inject it)
        data_parallel_rank = self._get_data_parallel_rank(raw_request)

        # Schedule the request and get the result generator.
        generators: list[AsyncGenerator[RequestOutput, None]] = []
        try:
            for i, engine_prompt in enumerate(engine_prompts):
                prompt_text, _, _ = self._get_prompt_components(engine_prompt)
                # If we are creating sub requests for multiple prompts, ensure that they
                # have unique request ids.
                sub_request_id = (
                    request_id if len(engine_prompts) == 1 else f"{request_id}_{i}"
                )

                if self.default_sampling_params is None:
                    self.default_sampling_params = {}

                max_tokens = get_max_tokens(
                    max_model_len=self.max_model_len,
                    request=request,
                    input_length=len(engine_prompt["prompt_token_ids"]),
                    default_sampling_params=self.default_sampling_params,
                )

                sampling_params: SamplingParams | BeamSearchParams
                if request.use_beam_search:
                    sampling_params = request.to_beam_search_params(
                        max_tokens, self.default_sampling_params
                    )
                else:
                    sampling_params = request.to_sampling_params(
                        max_tokens,
                        self.model_config.logits_processor_pattern,
                        self.default_sampling_params,
                    )
                    validate_logits_processors_parameters(
                        self.logits_processors,
                        sampling_params,
                    )

                self._log_inputs(
                    sub_request_id,
                    engine_prompt,
                    params=sampling_params,
                    lora_request=lora_request,
                )

                trace_headers = (
                    None
                    if raw_request is None
                    else await self._get_trace_headers(raw_request.headers)
                )

                if isinstance(sampling_params, BeamSearchParams):
                    generator = self.beam_search(
                        prompt=engine_prompt,
                        request_id=sub_request_id,
                        params=sampling_params,
                        lora_request=lora_request,
                        trace_headers=trace_headers,
                    )
                else:
                    engine_request, tokenization_kwargs = await self._process_inputs(
                        sub_request_id,
                        engine_prompt,
                        sampling_params,
                        lora_request=lora_request,
                        trace_headers=trace_headers,
                        priority=request.priority,
                        data_parallel_rank=data_parallel_rank,
                    )

                    generator = self.engine_client.generate(
                        engine_request,
                        sampling_params,
                        sub_request_id,
                        lora_request=lora_request,
                        trace_headers=trace_headers,
                        priority=request.priority,
                        prompt_text=prompt_text,
                        tokenization_kwargs=tokenization_kwargs,
                        data_parallel_rank=data_parallel_rank,
                    )

                generators.append(generator)
        except ValueError as e:
            return self.create_error_response(e)

        assert len(generators) == 1
        (result_generator,) = generators

        # Streaming response
        if request.stream:
            return self.chat_completion_stream_generator(
                request,
                result_generator,
                request_id,
                model_name,
                conversation,
                tokenizer,
                request_metadata,
            )

        try:
            return await self.chat_completion_full_generator(
                request,
                result_generator,
                request_id,
                model_name,
                conversation,
                tokenizer,
                request_metadata,
            )
        except GenerationError as e:
            return self._convert_generation_error_to_response(e)
        except ValueError as e:
            return self.create_error_response(e)

    def get_chat_request_role(self, request: ChatCompletionRequest) -> str:
        if request.add_generation_prompt:
            return self.response_role
        return request.messages[-1]["role"]

    @staticmethod
    def _bracket_level(s: str, opening="{", closing="}") -> int:
        """
        Calculate the current level of nested brackets in a given string.
        """
        level = 0
        for char in s:
            if char == opening:
                level += 1
            elif char == closing:
                level -= 1
        return level

    @staticmethod
    def _filter_delta_text(delta_text: str, previous_text: str) -> tuple[str, bool]:
        # remove last '},' of the tool definition stemming from the
        # "name"/"parameters" outer object or closing ']' of the tool list
        # count occurrences of opening and closing curly braces and
        # once level 0 is reached stop outputting text
        # if 0 is reached while parsing the delta_text we know the current
        # tool will finish in this current iteration
        bracket_level = OpenAIServingChat._bracket_level(previous_text)
        updated_delta, passed_zero = "", False
        for c in delta_text:
            if c == "{":
                bracket_level += 1
                passed_zero = bracket_level == 0
            elif c == "}":
                bracket_level -= 1
                passed_zero = bracket_level == 0

            if bracket_level != 0:
                updated_delta += c
            else:
                # if a comma is reached at level 0 we can stop
                if c == ",":
                    break
        return updated_delta, passed_zero

    def extract_tool_call_required_streaming(
        self,
        previous_text: str,
        current_text: str | None,
        delta_text: str,
        function_name_returned: bool,
        tool_call_idx: int | None = None,
    ) -> tuple[DeltaMessage | None, bool]:
        if current_text is None or current_text == "":
            # if the current text is empty, we cannot parse it
            return None, function_name_returned
        try:
            obj = partial_json_parser.loads(current_text)
        except partial_json_parser.core.exceptions.MalformedJSON:
            logger.debug("not enough tokens to parse into JSON yet")
            obj = None

        # check if the current text is a valid array
        # containing a partial tool calling object
        # if not repeat
        if obj is None or not isinstance(obj, list) or not len(obj) > 0:
            function_name_returned = False
            delta_message = None
        else:
            _, finishes_previous_tool = OpenAIServingChat._filter_delta_text(
                delta_text, previous_text
            )
            # take the last tool call from the generated list
            current_tool_call = obj[-1]

            # once parameters have been generated the name is complete as well
            if not finishes_previous_tool and (
                "name" not in current_tool_call or "parameters" not in current_tool_call
            ):
                function_name_returned = False
                delta_message = None
            else:
                if not function_name_returned:
                    # get partly generated arguments from the latest tool call
                    param_match = re.search(
                        r'.*"parameters":\s*(.*)', current_text, re.DOTALL
                    )
                    arguments = param_match.group(1) if param_match else ""
                    arguments, _ = OpenAIServingChat._filter_delta_text(
                        arguments, previous_text
                    )

                    # if this iteration finishes a previous tool call but a
                    # new incomplete tool is already generated, take the
                    # previous from the list
                    if finishes_previous_tool and "parameters" not in current_tool_call:
                        current_tool_call = obj[-2]

                    function_name_returned = True
                    tool_call_id = make_tool_call_id(
                        id_type=self.tool_call_id_type,
                        func_name=current_tool_call["name"],
                        idx=tool_call_idx,
                    )
                    delta_message = DeltaMessage(
                        tool_calls=[
                            DeltaToolCall(
                                id=tool_call_id,
                                function=DeltaFunctionCall(
                                    name=current_tool_call["name"], arguments=arguments
                                ),
                                index=len(obj) - 1,
                                type="function",
                            )
                        ]
                    )

                else:
                    delta_text, _ = OpenAIServingChat._filter_delta_text(
                        delta_text, previous_text
                    )

                    if delta_text != "":
                        delta_message = DeltaMessage(
                            tool_calls=[
                                DeltaToolCall(
                                    function=DeltaFunctionCall(
                                        # OpenAI API returns None
                                        # instead of name every time
                                        name=None,
                                        arguments=delta_text,
                                    ),
                                    index=len(obj) - 1,
                                )
                            ]
                        )
                    else:
                        delta_message = None

        return delta_message, function_name_returned

    async def chat_completion_stream_generator(
        self,
        request: ChatCompletionRequest,
        result_generator: AsyncIterator[RequestOutput],
        request_id: str,
        model_name: str,
        conversation: list[ConversationMessage],
        tokenizer: TokenizerLike | None,
        request_metadata: RequestResponseMetadata,
    ) -> AsyncGenerator[str, None]:
        created_time = int(time.time())
        chunk_object_type: Final = "chat.completion.chunk"
        first_iteration = True

        # Send response for each token for each request.n (index)
        num_choices = 1 if request.n is None else request.n
        previous_num_tokens = [0] * num_choices
        finish_reason_sent = [False] * num_choices
        num_prompt_tokens = 0
        num_cached_tokens = None
        if self.use_harmony:
            harmony_parsers = [
                get_streamable_parser_for_assistant() for _ in range(num_choices)
            ]
            harmony_tools_streamed = [False] * num_choices
        tools_streamed = [False] * num_choices

        if isinstance(request.tool_choice, ChatCompletionNamedToolChoiceParam):
            tool_choice_function_name = request.tool_choice.function.name
        else:
            tool_choice_function_name = None

        # Determine whether tools are in use with "auto" tool choice
        tool_choice_auto = (
            not tool_choice_function_name
            and self._should_stream_with_auto_tool_parsing(request)
        )

        all_previous_token_ids: list[list[int]] | None
        function_name_returned = [False] * num_choices
        if self.tool_call_id_type == "kimi_k2":
            history_tool_call_cnt = get_history_tool_calls_cnt(conversation)
        else:
            history_tool_call_cnt = 0

        # Always track previous_texts for comprehensive output logging
        previous_texts = [""] * num_choices

        # Only one of these will be used, thus previous_texts and
        # all_previous_token_ids will not be used twice in the same iteration.
        if tool_choice_auto or self.reasoning_parser:
            # These are only required in "auto" tool choice case
            all_previous_token_ids = [[]] * num_choices
            # For reasoning parser and tool call all enabled
            added_content_delta_arr = [False] * num_choices
            reasoning_end_arr = [False] * num_choices
        else:
            all_previous_token_ids = None

        try:
            if self.reasoning_parser:
                if tokenizer is None:
                    raise ValueError(
                        "Tokenizer not available when `skip_tokenizer_init=True`"
                    )

                reasoning_parser = self.reasoning_parser(
                    tokenizer,
                    chat_template_kwargs=request.chat_template_kwargs,  # type: ignore
                )
        except RuntimeError as e:
            logger.exception("Error in reasoning parser creation.")
            data = self.create_streaming_error_response(str(e))
            yield f"data: {data}\n\n"
            yield "data: [DONE]\n\n"
            return
        # Prepare the tool parser if it's needed
        try:
            if tool_choice_auto and self.tool_parser:
                if tokenizer is None:
                    raise ValueError(
                        "Tokenizer not available when `skip_tokenizer_init=True`"
                    )

                tool_parsers: list[ToolParser | None] = [
                    self.tool_parser(tokenizer)
                ] * num_choices
            else:
                tool_parsers = [None] * num_choices
        except Exception as e:
            logger.exception("Error in tool parser creation.")
            data = self.create_streaming_error_response(e)
            yield f"data: {data}\n\n"
            yield "data: [DONE]\n\n"
            return

        stream_options = request.stream_options
        include_usage, include_continuous_usage = should_include_usage(
            stream_options, self.enable_force_include_usage
        )

        try:
            async for res in result_generator:
                if res.prompt_token_ids is not None:
                    num_prompt_tokens = len(res.prompt_token_ids)
                    if res.encoder_prompt_token_ids is not None:
                        num_prompt_tokens += len(res.encoder_prompt_token_ids)

                # We need to do it here, because if there are exceptions in
                # the result_generator, it needs to be sent as the FIRST
                # response (by the try...catch).
                if first_iteration:
                    num_cached_tokens = res.num_cached_tokens
                    # Send first response for each request.n (index) with
                    # the role
                    role = self.get_chat_request_role(request)

                    # NOTE num_choices defaults to 1 so this usually executes
                    # once per request
                    for i in range(num_choices):
                        choice_data = ChatCompletionResponseStreamChoice(
                            index=i,
                            delta=DeltaMessage(
                                role=role,
                                content="",
                            ),
                            logprobs=None,
                            finish_reason=None,
                        )

                        # return prompt_token_ids at the first chunk ever
                        chunk = ChatCompletionStreamResponse(
                            id=request_id,
                            object=chunk_object_type,
                            created=created_time,
                            choices=[choice_data],
                            model=model_name,
                            prompt_token_ids=(
                                res.prompt_token_ids
                                if request.return_token_ids
                                else None
                            ),
                        )

                        # if continuous usage stats are requested, add it
                        if include_continuous_usage:
                            chunk.usage = UsageInfo(
                                prompt_tokens=num_prompt_tokens,
                                completion_tokens=0,
                                total_tokens=num_prompt_tokens,
                            )

                        data = chunk.model_dump_json(exclude_unset=True)
                        yield f"data: {data}\n\n"

                    # Send response to echo the input portion of the
                    # last message
                    if request.echo:
                        last_msg_content: str | list[dict[str, str]] = ""
                        if (
                            conversation
                            and "content" in conversation[-1]
                            and conversation[-1].get("role") == role
                        ):
                            last_msg_content = conversation[-1]["content"] or ""

                        if last_msg_content:
                            for i in range(num_choices):
                                choice_data = ChatCompletionResponseStreamChoice(
                                    index=i,
                                    delta=DeltaMessage(content=last_msg_content),
                                    logprobs=None,
                                    finish_reason=None,
                                )
                                chunk = ChatCompletionStreamResponse(
                                    id=request_id,
                                    object=chunk_object_type,
                                    created=created_time,
                                    choices=[choice_data],
                                    model=model_name,
                                )
                                if include_continuous_usage:
                                    chunk.usage = UsageInfo(
                                        prompt_tokens=num_prompt_tokens,
                                        completion_tokens=0,
                                        total_tokens=num_prompt_tokens,
                                    )

                                data = chunk.model_dump_json(exclude_unset=True)
                                yield f"data: {data}\n\n"
                    first_iteration = False

                for output in res.outputs:
                    i = output.index
                    tool_parser = tool_parsers[i]

                    if finish_reason_sent[i]:
                        continue

                    if request.logprobs and request.top_logprobs is not None:
                        assert output.logprobs is not None, "Did not output logprobs"
                        logprobs = self._create_chat_logprobs(
                            token_ids=output.token_ids,
                            top_logprobs=output.logprobs,
                            tokenizer=tokenizer,
                            num_output_top_logprobs=request.top_logprobs,
                            return_as_token_id=request.return_tokens_as_token_ids,
                        )
                    else:
                        logprobs = None

                    if self.use_harmony:
                        harmony_parser = harmony_parsers[i]
                        prev_recipient = harmony_parser.current_recipient
                        delta_text = ""
                        for token_id in output.token_ids:
                            harmony_parser.process(token_id)
                            delta_text += harmony_parser.last_content_delta or ""
                        cur_channel = harmony_parser.current_channel
                        cur_recipient = harmony_parser.current_recipient
                        # handle the case where several tokens where generated at once
                        # including the final token, leading to a delta in the text
                        # but the current channel to be empty (start state)
                        if not cur_channel and delta_text:
                            cur_channel = "final"
                    else:
                        delta_text = output.text

                    if (
                        not delta_text
                        and not output.token_ids
                        and not previous_num_tokens[i]
                    ):
                        # Chunked prefill case, don't return empty chunks
                        continue

                    delta_message: DeltaMessage | None

                    # just update previous_texts and previous_token_ids
                    if tool_choice_auto or self.reasoning_parser:
                        assert previous_texts is not None
                        assert all_previous_token_ids is not None
                        previous_text = previous_texts[i]
                        previous_token_ids = all_previous_token_ids[i]
                        current_text = previous_text + delta_text
                        # avoid the None + list error.
                        if previous_token_ids:
                            current_token_ids = previous_token_ids + as_list(
                                output.token_ids
                            )
                        else:
                            current_token_ids = as_list(output.token_ids)

                    if self.use_harmony:
                        delta_message, tools_streamed_flag = (
                            extract_harmony_streaming_delta(
                                harmony_parser=harmony_parser,
                                cur_channel=cur_channel,
                                cur_recipient=cur_recipient,
                                prev_recipient=prev_recipient,
                                delta_text=delta_text,
                                include_reasoning=request.include_reasoning,
                            )
                        )
                        harmony_tools_streamed[i] |= tools_streamed_flag
                    # handle streaming deltas for tools with named tool_choice
                    elif tool_choice_function_name:
                        if (
                            self.reasoning_parser
                            and not reasoning_end_arr[i]
                            and not reasoning_parser.is_reasoning_end(
                                previous_token_ids
                            )
                        ):
                            assert reasoning_parser is not None
                            delta_message = (
                                reasoning_parser.extract_reasoning_streaming(
                                    previous_text,
                                    current_text,
                                    delta_text,
                                    previous_token_ids,
                                    current_token_ids,
                                    output.token_ids,
                                )
                            )
                            # When encountering think end id in delta_token_ids
                            # or think end id in prompt_token_ids
                            # i.e {"enable_thinking": False},
                            # set reasoning status to end.
                            # Only keep 'content', remove 'reasoning'.
                            if reasoning_parser.is_reasoning_end(
                                as_list(output.token_ids)
                            ) or (
                                res.prompt_token_ids
                                and reasoning_parser.is_reasoning_end(
                                    res.prompt_token_ids
                                )
                            ):
                                reasoning_end_arr[i] = True
                                if delta_message and delta_message.content:
                                    # This need to be added to next `delta_text`
                                    current_text = delta_message.content
                                    delta_message.content = None
                                else:
                                    current_text = ""
                        else:
                            # Just to add remaining `content`
                            if self.reasoning_parser:
                                delta_text = previous_text + delta_text
                                current_text = ""

                            if function_name_returned[i]:
                                delta_tool_call = DeltaToolCall(
                                    function=DeltaFunctionCall(arguments=delta_text),
                                    index=i,
                                )
                            else:
                                delta_tool_call = DeltaToolCall(
                                    id=make_tool_call_id(),
                                    type="function",
                                    function=DeltaFunctionCall(
                                        name=tool_choice_function_name,
                                        arguments=delta_text,
                                    ),
                                    index=i,
                                )
                                function_name_returned[i] = True

                            delta_message = DeltaMessage(
                                tool_calls=[
                                    delta_tool_call,
                                ]
                            )
                            tools_streamed[i] = True

                    elif request.tool_choice == "required":
                        assert previous_texts is not None
                        previous_text = previous_texts[i]
                        current_text = previous_text + delta_text
                        fn_name_returned = function_name_returned[i]
                        output_token_ids = as_list(output.token_ids)

                        if (
                            self.reasoning_parser is not None
                            and not reasoning_end_arr[i]
                            and res.prompt_token_ids
                            and reasoning_parser.is_reasoning_end(res.prompt_token_ids)
                        ):
                            reasoning_end_arr[i] = True

                        if self.reasoning_parser and not reasoning_end_arr[i]:
                            delta_message = (
                                reasoning_parser.extract_reasoning_streaming(
                                    previous_text,
                                    current_text,
                                    delta_text,
                                    previous_token_ids,
                                    current_token_ids,
                                    output_token_ids,
                                )
                            )
                            if reasoning_parser.is_reasoning_end(output_token_ids):
                                reasoning_end_arr[i] = True
                                if delta_message and delta_message.content:
                                    current_text = delta_message.content
                                    delta_message.content = None
                                else:
                                    # reasoning ended
                                    current_text = ""

                        else:
                            # either finished reasoning or no reasoning at all
                            content = current_text

                            delta_message, function_name_returned[i] = (
                                self.extract_tool_call_required_streaming(
                                    previous_text=previous_text,
                                    current_text=content,
                                    delta_text=delta_text,
                                    function_name_returned=fn_name_returned,
                                    tool_call_idx=history_tool_call_cnt,
                                )
                            )
                            if (
                                delta_message
                                and delta_message.tool_calls
                                and delta_message.tool_calls[0].id is not None
                            ):
                                history_tool_call_cnt += 1
                                tools_streamed[i] = True

                    # handle streaming deltas for tools with "auto" tool choice
                    # and reasoning parser
                    elif tool_choice_auto and self.reasoning_parser:
                        assert tool_parser is not None
                        assert reasoning_parser is not None
                        assert added_content_delta_arr is not None
                        assert reasoning_end_arr is not None
                        output_token_ids = as_list(output.token_ids)
                        if not reasoning_end_arr[i]:
                            # When encountering think end id in prompt_token_ids
                            # i.e {"enable_thinking": False},
                            # set reasoning status to end.
                            if (
                                res.prompt_token_ids
                                and reasoning_parser.is_reasoning_end(
                                    res.prompt_token_ids
                                )
                            ):
                                reasoning_end_arr[i] = True
                                current_token_ids = output_token_ids
                                # Don't update current_text, keep it as is from delta
                            else:
                                delta_message = (
                                    reasoning_parser.extract_reasoning_streaming(
                                        previous_text,
                                        current_text,
                                        delta_text,
                                        previous_token_ids,
                                        current_token_ids,
                                        output_token_ids,
                                    )
                                )

                                # When encountering think end id in delta_token_ids,
                                # set reasoning status to end.
                                # Remove the text and token ids related
                                # to 'reasoning'.
                                if reasoning_parser.is_reasoning_end(output_token_ids):
                                    reasoning_end_arr[i] = True
                                    current_token_ids = (
                                        reasoning_parser.extract_content_ids(
                                            output_token_ids
                                        )
                                    )
                                    if delta_message and delta_message.content:
                                        current_text = delta_message.content
                                        delta_message.content = None
                                    else:
                                        current_text = ""

                        # handle tool calls only after reasoning is done,
                        if reasoning_end_arr[i]:
                            delta_token_ids = output_token_ids
                            # First time to tool call,
                            # add the remaining text and token ids
                            # to delta from previous
                            if not added_content_delta_arr[i]:
                                added_content_delta_arr[i] = True
                                previous_text = ""
                                previous_token_ids = []
                                delta_text = current_text
                                delta_token_ids = current_token_ids

                            delta_message = tool_parser.extract_tool_calls_streaming(
                                previous_text=previous_text,
                                current_text=current_text,
                                delta_text=delta_text,
                                previous_token_ids=previous_token_ids,
                                current_token_ids=current_token_ids,
                                delta_token_ids=delta_token_ids,
                                request=request,
                            )
                            if delta_message and delta_message.tool_calls:
                                tools_streamed[i] = True
                    # when only tool calls
                    elif tool_choice_auto:
                        assert tool_parser is not None
                        delta_message = tool_parser.extract_tool_calls_streaming(
                            previous_text=previous_text,
                            current_text=current_text,
                            delta_text=delta_text,
                            previous_token_ids=previous_token_ids,
                            current_token_ids=current_token_ids,
                            delta_token_ids=output.token_ids,
                            request=request,
                        )
                        if delta_message and delta_message.tool_calls:
                            tools_streamed[i] = True

                    # when only reasoning
                    elif self.reasoning_parser:
                        delta_message = reasoning_parser.extract_reasoning_streaming(
                            previous_text,
                            current_text,
                            delta_text,
                            previous_token_ids,
                            current_token_ids,
                            output.token_ids,
                        )
                    # handle streaming just a content delta
                    else:
                        delta_message = DeltaMessage(content=delta_text)

                    # update the previous values for the next iteration
                    if (
                        tool_choice_auto or self.reasoning_parser
                    ) and not self.use_harmony:
                        assert previous_texts is not None
                        assert all_previous_token_ids is not None
                        previous_texts[i] = current_text
                        all_previous_token_ids[i] = current_token_ids
                    else:
                        # Update for comprehensive logging even in simple case
                        assert previous_texts is not None
                        previous_texts[i] += delta_text

                    # set the previous values for the next iteration
                    previous_num_tokens[i] += len(output.token_ids)

                    # if the message delta is None (e.g. because it was a
                    # "control token" for tool calls or the parser otherwise
                    # wasn't ready to send a token, then
                    #   get the next token without streaming a chunk
                    if delta_message is None:
                        # NOTE: If return_token_ids is enabled, we still need to
                        # send a chunk with token_ids even if delta_message is None
                        # to ensure all tokens are included in the response
                        if (
                            output.finish_reason is None
                            and not request.return_token_ids
                        ):
                            continue
                        delta_message = DeltaMessage()

                    # Log streaming delta if output logging is enabled
                    if self.enable_log_outputs and self.request_logger:
                        delta_content = ""
                        if delta_message.content:
                            delta_content = delta_message.content
                        elif delta_message.tool_calls:
                            delta_content = "".join(
                                tc.function.arguments
                                for tc in delta_message.tool_calls
                                if tc.function and tc.function.arguments
                            )

                        if delta_content:
                            self.request_logger.log_outputs(
                                request_id=request_id,
                                outputs=delta_content,
                                output_token_ids=as_list(output.token_ids),
                                finish_reason=output.finish_reason,
                                is_streaming=True,
                                delta=True,
                            )

                    if output.finish_reason is None:
                        # Send token-by-token response for each request.n
                        choice_data = ChatCompletionResponseStreamChoice(
                            index=i,
                            delta=delta_message,
                            logprobs=logprobs,
                            finish_reason=None,
                            token_ids=(
                                as_list(output.token_ids)
                                if request.return_token_ids
                                else None
                            ),
                        )

                    # if the model is finished generating
                    else:
                        # check for error finish reason and abort streaming
                        # finish_reason='error' indicates a retryable error
                        self._raise_if_error(output.finish_reason, request_id)

                        # check to make sure we haven't "forgotten" to stream
                        #   any tokens that were generated but previously
                        #   matched by partial json parsing
                        # only happens if we are NOT using structured outputs
                        auto_tools_called = False
                        if tool_parser:
                            auto_tools_called = len(tool_parser.prev_tool_call_arr) > 0
                            index = (
                                len(tool_parser.prev_tool_call_arr) - 1
                                if auto_tools_called
                                else 0
                            )
                        else:
                            index = 0

                        if (
                            self._should_check_for_unstreamed_tool_arg_tokens(
                                delta_message, output
                            )
                            and tool_parser
                        ):
                            latest_delta_len = 0
                            if (
                                isinstance(
                                    delta_message.tool_calls[0].function,
                                    DeltaFunctionCall,
                                )
                            ) and isinstance(
                                delta_message.tool_calls[0].function.arguments, str
                            ):
                                latest_delta_len = len(
                                    delta_message.tool_calls[0].function.arguments
                                )

                            # get the expected call based on partial JSON
                            # parsing which "autocompletes" the JSON
                            expected_call = json.dumps(
                                tool_parser.prev_tool_call_arr[index].get(
                                    "arguments", {}
                                ),
                                ensure_ascii=False,
                            )

                            # get what we've streamed so far for arguments
                            # for the current tool
                            actual_call = tool_parser.streamed_args_for_tool[index]
                            if latest_delta_len > 0:
                                actual_call = actual_call[:-latest_delta_len]

                            # check to see if there's anything left to stream
                            remaining_call = expected_call.replace(actual_call, "", 1)
                            # set that as a delta message
                            delta_message = DeltaMessage(
                                tool_calls=[
                                    DeltaToolCall(
                                        index=index,
                                        function=DeltaFunctionCall(
                                            arguments=remaining_call
                                        ).model_dump(exclude_none=True),
                                    )
                                ]
                            )

                        # Send the finish response for each request.n only once
                        # In OpenAI's API, when a tool is called, the
                        # finish_reason is:
                        # "tool_calls" for "auto" or "required" tool calls,
                        # and "stop" for named tool calls.
                        if (
                            auto_tools_called
                            or (tools_streamed[i] and not tool_choice_function_name)
                            or (self.use_harmony and harmony_tools_streamed[i])
                        ):
                            finish_reason_ = "tool_calls"
                        else:
                            finish_reason_ = (
                                output.finish_reason if output.finish_reason else "stop"
                            )
                        choice_data = ChatCompletionResponseStreamChoice(
                            index=i,
                            delta=delta_message,
                            logprobs=logprobs,
                            finish_reason=finish_reason_,
                            stop_reason=output.stop_reason,
                            token_ids=(
                                as_list(output.token_ids)
                                if request.return_token_ids
                                else None
                            ),
                        )

                        finish_reason_sent[i] = True

                    choice_data = maybe_filter_parallel_tool_calls(choice_data, request)
                    chunk = ChatCompletionStreamResponse(
                        id=request_id,
                        object=chunk_object_type,
                        created=created_time,
                        choices=[choice_data],
                        model=model_name,
                    )

                    # handle usage stats if requested & if continuous
                    if include_continuous_usage:
                        completion_tokens = previous_num_tokens[i]
                        chunk.usage = UsageInfo(
                            prompt_tokens=num_prompt_tokens,
                            completion_tokens=completion_tokens,
                            total_tokens=num_prompt_tokens + completion_tokens,
                        )

                    data = chunk.model_dump_json(exclude_unset=True)
                    yield f"data: {data}\n\n"

            # once the final token is handled, if stream_options.include_usage
            # is sent, send the usage
            if include_usage:
                completion_tokens = sum(previous_num_tokens)
                final_usage = UsageInfo(
                    prompt_tokens=num_prompt_tokens,
                    completion_tokens=completion_tokens,
                    total_tokens=num_prompt_tokens + completion_tokens,
                )
                if self.enable_prompt_tokens_details and num_cached_tokens:
                    final_usage.prompt_tokens_details = PromptTokenUsageInfo(
                        cached_tokens=num_cached_tokens
                    )

                final_usage_chunk = ChatCompletionStreamResponse(
                    id=request_id,
                    object=chunk_object_type,
                    created=created_time,
                    choices=[],
                    model=model_name,
                    usage=final_usage,
                )
                final_usage_data = final_usage_chunk.model_dump_json(
                    exclude_unset=True, exclude_none=True
                )
                yield f"data: {final_usage_data}\n\n"

            # report to FastAPI middleware aggregate usage across all choices
            num_completion_tokens = sum(previous_num_tokens)
            request_metadata.final_usage_info = UsageInfo(
                prompt_tokens=num_prompt_tokens,
                completion_tokens=num_completion_tokens,
                total_tokens=num_prompt_tokens + num_completion_tokens,
            )

            # Log complete streaming response if output logging is enabled
            if self.enable_log_outputs and self.request_logger:
                # Log the complete response for each choice
                for i in range(num_choices):
                    full_text = (
                        previous_texts[i]
                        if previous_texts and i < len(previous_texts)
                        else f"<streaming_complete: {previous_num_tokens[i]} tokens>"
                    )
                    self.request_logger.log_outputs(
                        request_id=request_id,
                        outputs=full_text,
                        output_token_ids=None,  # Consider also logging all token IDs
                        finish_reason="streaming_complete",
                        is_streaming=True,
                        delta=False,
                    )

        except GenerationError as e:
            yield f"data: {self._convert_generation_error_to_streaming_response(e)}\n\n"
        except Exception as e:
            logger.exception("Error in chat completion stream generator.")
            data = self.create_streaming_error_response(e)
            yield f"data: {data}\n\n"
        # Send the final done message after all response.n are finished
        yield "data: [DONE]\n\n"

    async def chat_completion_full_generator(
        self,
        request: ChatCompletionRequest,
        result_generator: AsyncIterator[RequestOutput],
        request_id: str,
        model_name: str,
        conversation: list[ConversationMessage],
        tokenizer: TokenizerLike | None,
        request_metadata: RequestResponseMetadata,
    ) -> ErrorResponse | ChatCompletionResponse:
        created_time = int(time.time())
        final_res: RequestOutput | None = None

        try:
            async for res in result_generator:
                final_res = res
        except asyncio.CancelledError:
            return self.create_error_response("Client disconnected")
        except ValueError as e:
            return self.create_error_response(e)

        assert final_res is not None

        choices: list[ChatCompletionResponseChoice] = []
        if self.tool_call_id_type == "kimi_k2":
            history_tool_call_cnt = get_history_tool_calls_cnt(conversation)
        else:
            history_tool_call_cnt = 0

        role = self.get_chat_request_role(request)
        for output in final_res.outputs:
            # check for error finish reason and raise GenerationError
            # finish_reason='error' indicates a retryable request-level internal error
            self._raise_if_error(output.finish_reason, request_id)
            token_ids = output.token_ids
            out_logprobs = output.logprobs
            tool_call_info = None

            if request.logprobs and request.top_logprobs is not None:
                assert out_logprobs is not None, "Did not output logprobs"
                logprobs = self._create_chat_logprobs(
                    token_ids=token_ids,
                    top_logprobs=out_logprobs,
                    num_output_top_logprobs=request.top_logprobs,
                    tokenizer=tokenizer,
                    return_as_token_id=request.return_tokens_as_token_ids,
                )
            else:
                logprobs = None

            if self.use_harmony:
                reasoning, content, _ = parse_chat_output(token_ids)
                if not request.include_reasoning:
                    reasoning = None

                if self.tool_parser is not None:
                    if tokenizer is None:
                        raise ValueError(
                            "Tokenizer not available when `skip_tokenizer_init=True`"
                        )

                    tool_parser = self.tool_parser(tokenizer)
                    # NOTE: We use token_ids for openai tool parser
                    tool_call_info = tool_parser.extract_tool_calls(
                        "",
                        request=request,
                        token_ids=token_ids,  # type: ignore
                    )
                    content = tool_call_info.content
                    message = ChatMessage(
                        role=role,
                        reasoning=reasoning,
                        content=content,
                        tool_calls=tool_call_info.tool_calls,
                    )
                else:
                    message = ChatMessage(
                        role=role,
                        reasoning=reasoning,
                        content=content,
                    )

                choice_data = ChatCompletionResponseChoice(
                    index=output.index,
                    message=message,
                    logprobs=logprobs,
                    finish_reason=(
                        "tool_calls"
                        if (tool_call_info is not None and tool_call_info.tools_called)
                        else output.finish_reason
                        if output.finish_reason
                        else "stop"
                    ),
                    stop_reason=output.stop_reason,
                    token_ids=(
                        as_list(output.token_ids) if request.return_token_ids else None
                    ),
                )
                choices.append(choice_data)
                continue

            if self.reasoning_parser:
                try:
                    if tokenizer is None:
                        raise ValueError(
                            "Tokenizer not available when `skip_tokenizer_init=True`"
                        )

                    reasoning_parser = self.reasoning_parser(
                        tokenizer,
                        chat_template_kwargs=request.chat_template_kwargs,  # type: ignore
                    )
                except RuntimeError as e:
                    logger.exception("Error in reasoning parser creation.")
                    return self.create_error_response(str(e))
                # If the reasoning parser is enabled,
                # tool calls are extracted exclusively from the content.
                reasoning, content = reasoning_parser.extract_reasoning(
                    output.text, request=request
                )
                if not request.include_reasoning:
                    reasoning = None
            else:
                reasoning = None
                content = output.text

            auto_tools_called = False
            # if auto tools are not enabled, and a named tool choice using
            #   outlines is not being used
            tool_calls, content = self._parse_tool_calls_from_content(
                request=request,
                tokenizer=tokenizer,
                content=content,
                enable_auto_tools=self.enable_auto_tools,
                tool_parser_cls=self.tool_parser,
            )
            tool_call_class = (
                MistralToolCall if isinstance(tokenizer, MistralTokenizer) else ToolCall
            )
            if (not self.enable_auto_tools or not self.tool_parser) and (
                not isinstance(request.tool_choice, ChatCompletionNamedToolChoiceParam)
                and request.tool_choice != "required"
            ):
                message = ChatMessage(role=role, reasoning=reasoning, content=content)

            # if the request uses tools and specified a tool choice
            elif (
                request.tool_choice
                and type(request.tool_choice) is ChatCompletionNamedToolChoiceParam
            ):
                assert tool_calls is not None and len(tool_calls) > 0
                message = ChatMessage(
                    role=role,
                    reasoning=reasoning,
                    content="",
                    tool_calls=[tool_call_class(function=tc) for tc in tool_calls],
                )

            elif request.tool_choice and request.tool_choice == "required":
                tool_call_class_items = []
                assert tool_calls is not None and len(tool_calls) > 0
                for tool_call in tool_calls:
                    tool_call_class_items.append(
                        tool_call_class(
                            id=make_tool_call_id(
                                id_type=self.tool_call_id_type,
                                func_name=tool_call.name,
                                idx=history_tool_call_cnt,
                            ),
                            function=tool_call,
                        )
                    )
                    history_tool_call_cnt += 1
                message = ChatMessage(
                    role=role,
                    content="",
                    tool_calls=tool_call_class_items,
                    reasoning=reasoning,
                )

            # if the request doesn't use tool choice
            # OR specifies to not use a tool
            elif not request.tool_choice or request.tool_choice == "none":
                message = ChatMessage(role=role, reasoning=reasoning, content=content)

            # handle when there are tools and tool choice is auto
            elif (
                request.tools
                and (request.tool_choice == "auto" or request.tool_choice is None)
                and self.enable_auto_tools
                and self.tool_parser
            ):
                # In the OpenAI API the finish_reason is "tools_called"
                # if the tool choice is auto and the model produced a tool
                # call. The same is not true for named function calls
                auto_tools_called = tool_calls is not None and len(tool_calls) > 0
                if tool_calls:
                    message = ChatMessage(
                        role=role,
                        reasoning=reasoning,
                        content=content,
                        tool_calls=[
                            ToolCall(
                                function=tc,
                                type="function",
                            )
                            for tc in tool_calls
                        ],
                    )

                else:
                    # FOR NOW make it a chat message; we will have to detect
                    # the type to make it later.
                    ret_content = content

                    # try to use content return from tool parser first,
                    # tool parser may do some modify for the content.
                    if content and len(content) > 0:
                        ret_content = content
                    message = ChatMessage(
                        role=role,
                        reasoning=reasoning,
                        content=ret_content,
                    )

            # undetermined case that is still important to handle
            else:
                logger.error(
                    "Error in chat_completion_full_generator - cannot determine"
                    " if tools should be extracted. Returning a standard chat "
                    "completion."
                )
                message = ChatMessage(role=role, reasoning=reasoning, content=content)
            # In OpenAI's API, when a tool is called, the finish_reason is:
            # "tool_calls" for "auto" or "required" tool calls,
            # and "stop" for named tool calls.
            is_finish_reason_tool_calls = auto_tools_called or (
                request.tool_choice
                and request.tool_choice == "required"
                and output.finish_reason == "stop"
            )

            choice_data = ChatCompletionResponseChoice(
                index=output.index,
                message=message,
                logprobs=logprobs,
                finish_reason="tool_calls"
                if is_finish_reason_tool_calls
                else output.finish_reason
                if output.finish_reason
                else "stop",
                stop_reason=output.stop_reason,
                token_ids=(
                    as_list(output.token_ids) if request.return_token_ids else None
                ),
            )
            choice_data = maybe_filter_parallel_tool_calls(choice_data, request)

            choices.append(choice_data)

        if request.echo:
            last_msg_content: str | list[dict[str, str]] = ""
            if (
                conversation
                and "content" in conversation[-1]
                and conversation[-1].get("role") == role
            ):
                last_msg_content = conversation[-1]["content"] or ""
            if isinstance(last_msg_content, list):
                last_msg_content = "\n".join(msg["text"] for msg in last_msg_content)

            for choice in choices:
                full_message = last_msg_content + (choice.message.content or "")
                choice.message.content = full_message

        assert final_res.prompt_token_ids is not None
        num_prompt_tokens = len(final_res.prompt_token_ids)
        if final_res.encoder_prompt_token_ids is not None:
            num_prompt_tokens += len(final_res.encoder_prompt_token_ids)
        num_generated_tokens = sum(
            len(output.token_ids) for output in final_res.outputs
        )
        usage = UsageInfo(
            prompt_tokens=num_prompt_tokens,
            completion_tokens=num_generated_tokens,
            total_tokens=num_prompt_tokens + num_generated_tokens,
        )
        if self.enable_prompt_tokens_details and final_res.num_cached_tokens:
            usage.prompt_tokens_details = PromptTokenUsageInfo(
                cached_tokens=final_res.num_cached_tokens
            )

        request_metadata.final_usage_info = usage

        response = ChatCompletionResponse(
            id=request_id,
            created=created_time,
            model=model_name,
            choices=choices,
            usage=usage,
            prompt_logprobs=clamp_prompt_logprobs(final_res.prompt_logprobs),
            prompt_token_ids=(
                final_res.prompt_token_ids if request.return_token_ids else None
            ),
            kv_transfer_params=final_res.kv_transfer_params,
        )

        # Log complete response if output logging is enabled
        if self.enable_log_outputs and self.request_logger:
            for choice in choices:
                output_text = ""
                if choice.message.content:
                    output_text = choice.message.content
                elif choice.message.tool_calls:
                    # For tool calls, log the function name and arguments
                    tool_call_descriptions = []
                    for tc in choice.message.tool_calls:
                        if hasattr(tc.function, "name") and hasattr(
                            tc.function, "arguments"
                        ):
                            tool_call_descriptions.append(
                                f"{tc.function.name}({tc.function.arguments})"
                            )
                    tool_calls_str = ", ".join(tool_call_descriptions)
                    output_text = f"[tool_calls: {tool_calls_str}]"

                if output_text:
                    # Get the corresponding output token IDs
                    output_token_ids = None
                    if choice.index < len(final_res.outputs):
                        output_token_ids = final_res.outputs[choice.index].token_ids

                    self.request_logger.log_outputs(
                        request_id=request_id,
                        outputs=output_text,
                        output_token_ids=output_token_ids,
                        finish_reason=choice.finish_reason,
                        is_streaming=False,
                        delta=False,
                    )

        return response

    def _get_top_logprobs(
        self,
        logprobs: dict[int, Logprob],
        top_logprobs: int | None,
        tokenizer: TokenizerLike | None,
        should_return_as_token_id: bool,
    ) -> list[ChatCompletionLogProb]:
        return [
            ChatCompletionLogProb(
                token=(
                    token := self._get_decoded_token(
                        p[1],
                        p[0],
                        tokenizer,
                        return_as_token_id=should_return_as_token_id,
                    )
                ),
                logprob=max(p[1].logprob, -9999.0),
                bytes=list(token.encode("utf-8", errors="replace")),
            )
            for i, p in enumerate(logprobs.items())
            if (top_logprobs and i < top_logprobs or top_logprobs == -1)
        ]

    def _create_chat_logprobs(
        self,
        token_ids: GenericSequence[int],
        top_logprobs: GenericSequence[dict[int, Logprob] | None],
        tokenizer: TokenizerLike | None,
        num_output_top_logprobs: int | None = None,
        return_as_token_id: bool | None = None,
    ) -> ChatCompletionLogProbs:
        """Create OpenAI-style logprobs."""
        logprobs_content: list[ChatCompletionLogProbsContent] = []

        should_return_as_token_id = (
            return_as_token_id
            if return_as_token_id is not None
            else self.return_tokens_as_token_ids
        )
        for i, token_id in enumerate(token_ids):
            step_top_logprobs = top_logprobs[i]
            if step_top_logprobs is None or step_top_logprobs.get(token_id) is None:
                if should_return_as_token_id:
                    token = f"token_id:{token_id}"
                else:
                    if tokenizer is None:
                        raise ValueError(
                            "Tokenizer not available when `skip_tokenizer_init=True`"
                        )

                    token = tokenizer.decode(token_id)

                logprobs_content.append(
                    ChatCompletionLogProbsContent(
                        token=token,
                        bytes=list(token.encode("utf-8", errors="replace")),
                    )
                )
            else:
                step_token = step_top_logprobs[token_id]
                step_decoded = step_token.decoded_token

                logprobs_content.append(
                    ChatCompletionLogProbsContent(
                        token=self._get_decoded_token(
                            step_token,
                            token_id,
                            tokenizer,
                            should_return_as_token_id,
                        ),
                        logprob=max(step_token.logprob, -9999.0),
                        bytes=(
                            None
                            if step_decoded is None
                            else list(step_decoded.encode("utf-8", errors="replace"))
                        ),
                        top_logprobs=self._get_top_logprobs(
                            step_top_logprobs,
                            num_output_top_logprobs,
                            tokenizer,
                            should_return_as_token_id,
                        ),
                    )
                )

        return ChatCompletionLogProbs(content=logprobs_content)

    def _should_stream_with_auto_tool_parsing(self, request: ChatCompletionRequest):
        """
        Utility function to check if streamed tokens should go through the tool
        call parser that was configured.

        We only want to do this IF user-provided tools are set, a tool parser
        is configured, "auto" tool choice is enabled, and the request's tool
        choice field indicates that "auto" tool choice should be used.
        """
        return (
            request.tools
            and self.tool_parser
            and self.enable_auto_tools
            and request.tool_choice in ["auto", None]
        )

    def _should_check_for_unstreamed_tool_arg_tokens(
        self,
        delta_message: DeltaMessage | None,
        output: CompletionOutput,
    ) -> bool:
        """
        Check to see if we should check for unstreamed tool arguments tokens.
        This is only applicable when auto tool parsing is enabled, the delta
        is a tool call with arguments.
        """

        return bool(
            # if there is a delta message that includes tool calls which
            # include a function that has arguments
            output.finish_reason is not None
            and self.enable_auto_tools
            and self.tool_parser
            and delta_message
            and delta_message.tool_calls
            and delta_message.tool_calls[0]
            and delta_message.tool_calls[0].function
            and delta_message.tool_calls[0].function.arguments is not None
        )

    def _make_request_with_harmony(
        self,
        request: ChatCompletionRequest,
        should_include_tools: bool = True,
    ):
        messages: list[OpenAIMessage] = []

        # because of issues with pydantic we need to potentially
        # re-serialize the tool_calls field of the request
        # for more info: see comment in `maybe_serialize_tool_calls`
        maybe_serialize_tool_calls(request)

        # Add system message.
        # NOTE: In Chat Completion API, browsing is enabled by default
        # if the model supports it. TODO: Support browsing.
        assert not self.supports_browsing
        assert not self.supports_code_interpreter
        sys_msg = get_system_message(
            reasoning_effort=request.reasoning_effort,
            browser_description=None,
            python_description=None,
            with_custom_tools=should_include_tools,
        )
        messages.append(sys_msg)

        # Add developer message.
        if request.tools:
            dev_msg = get_developer_message(
                tools=request.tools if should_include_tools else None
            )
            messages.append(dev_msg)

        # Add user message.
        messages.extend(parse_chat_inputs_to_harmony_messages(request.messages))

        # Render prompt token ids.
        prompt_token_ids = render_for_completion(messages)
        engine_prompt = TokensPrompt(prompt_token_ids=prompt_token_ids)

        # Add cache_salt if provided in the request
        if request.cache_salt is not None:
            engine_prompt["cache_salt"] = request.cache_salt

        return messages, [engine_prompt]
```

---

## serving_completion - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_completion/

**Contents:**
- vllm.entrypoints.openai.serving_completion ¶
- logger module-attribute ¶
- OpenAIServingCompletion ¶
  - default_sampling_params instance-attribute ¶
  - enable_force_include_usage instance-attribute ¶
  - enable_prompt_tokens_details instance-attribute ¶
  - logits_processors instance-attribute ¶
  - __init__ ¶
  - _build_render_config ¶
  - _create_completion_logprobs ¶

Create logprobs for OpenAI Completion API.

Completion API similar to OpenAI's API.

See https://platform.openai.com/docs/api-reference/completions/create for the API specification. This API mimics the OpenAI Completion API.

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
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
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
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
469
470
471
472
473
474
475
476
477
478
479
480
481
482
483
484
485
486
487
488
489
490
491
492
493
494
495
496
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
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
698
699
700
701
702
703
704
705
706
707
708
709
710
711
712
713
714
715
716
717
718
719
720
721
722
723
724
725
726
727
728
729
730
731
732
733
734
735
736
737
738
739
740
```

Example 4 (python):
```python
class OpenAIServingCompletion(OpenAIServing):
    def __init__(
        self,
        engine_client: EngineClient,
        models: OpenAIServingModels,
        *,
        request_logger: RequestLogger | None,
        return_tokens_as_token_ids: bool = False,
        enable_prompt_tokens_details: bool = False,
        enable_force_include_usage: bool = False,
        log_error_stack: bool = False,
    ):
        super().__init__(
            engine_client=engine_client,
            models=models,
            request_logger=request_logger,
            return_tokens_as_token_ids=return_tokens_as_token_ids,
            log_error_stack=log_error_stack,
        )

        # set up logits processors
        self.logits_processors = self.model_config.logits_processors

        self.enable_prompt_tokens_details = enable_prompt_tokens_details
        self.default_sampling_params = self.model_config.get_diff_sampling_param()
        self.enable_force_include_usage = enable_force_include_usage
        if self.default_sampling_params:
            source = self.model_config.generation_config
            source = "model" if source == "auto" else source
            logger.info(
                "Using default completion sampling params from %s: %s",
                source,
                self.default_sampling_params,
            )

    async def create_completion(
        self,
        request: CompletionRequest,
        raw_request: Request | None = None,
    ) -> AsyncGenerator[str, None] | CompletionResponse | ErrorResponse:
        """Completion API similar to OpenAI's API.

        See https://platform.openai.com/docs/api-reference/completions/create
        for the API specification. This API mimics the OpenAI Completion API.

        NOTE: Currently we do not support the following feature:
            - suffix (the language models we currently support do not support
            suffix)
        """
        error_check_ret = await self._check_model(request)
        if error_check_ret is not None:
            return error_check_ret

        # If the engine is dead, raise the engine's DEAD_ERROR.
        # This is required for the streaming case, where we return a
        # success status before we actually start generating text :).
        if self.engine_client.errored:
            raise self.engine_client.dead_error

        # Return error for unsupported features.
        if request.suffix is not None:
            return self.create_error_response("suffix is not currently supported")

        if request.echo and request.prompt_embeds is not None:
            return self.create_error_response("Echo is unsupported with prompt embeds.")

        if request.prompt_logprobs is not None and request.prompt_embeds is not None:
            return self.create_error_response(
                "prompt_logprobs is not compatible with prompt embeds."
            )

        request_id = f"cmpl-{self._base_request_id(raw_request, request.request_id)}"
        created_time = int(time.time())

        request_metadata = RequestResponseMetadata(request_id=request_id)
        if raw_request:
            raw_request.state.request_metadata = request_metadata

        try:
            lora_request = self._maybe_get_adapters(request)

            if self.model_config.skip_tokenizer_init:
                tokenizer = None
            else:
                tokenizer = await self.engine_client.get_tokenizer()
            renderer = self._get_renderer(tokenizer)

            engine_prompts = await renderer.render_prompt_and_embeds(
                prompt_or_prompts=request.prompt,
                prompt_embeds=request.prompt_embeds,
                config=self._build_render_config(request),
            )
        except ValueError as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))
        except TypeError as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))
        except RuntimeError as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))
        except jinja2.TemplateError as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))

        # Extract data_parallel_rank from header (router can inject it)
        data_parallel_rank = self._get_data_parallel_rank(raw_request)

        # Schedule the request and get the result generator.
        generators: list[AsyncGenerator[RequestOutput, None]] = []
        try:
            for i, engine_prompt in enumerate(engine_prompts):
                prompt_text, prompt_token_ids, prompt_embeds = (
                    self._get_prompt_components(engine_prompt)
                )

                input_length = None
                if prompt_token_ids is not None:
                    input_length = len(prompt_token_ids)
                elif prompt_embeds is not None:
                    input_length = len(prompt_embeds)
                else:
                    raise NotImplementedError

                if self.default_sampling_params is None:
                    self.default_sampling_params = {}

                max_tokens = get_max_tokens(
                    max_model_len=self.max_model_len,
                    request=request,
                    input_length=input_length,
                    default_sampling_params=self.default_sampling_params,
                )

                sampling_params: SamplingParams | BeamSearchParams
                if request.use_beam_search:
                    sampling_params = request.to_beam_search_params(
                        max_tokens, self.default_sampling_params
                    )
                else:
                    sampling_params = request.to_sampling_params(
                        max_tokens,
                        self.model_config.logits_processor_pattern,
                        self.default_sampling_params,
                    )
                    validate_logits_processors_parameters(
                        self.logits_processors,
                        sampling_params,
                    )

                request_id_item = f"{request_id}-{i}"

                self._log_inputs(
                    request_id_item,
                    engine_prompt,
                    params=sampling_params,
                    lora_request=lora_request,
                )

                trace_headers = (
                    None
                    if raw_request is None
                    else await self._get_trace_headers(raw_request.headers)
                )

                # Mypy inconsistently requires this second cast in different
                # environments. It shouldn't be necessary (redundant from above)
                # but pre-commit in CI fails without it.
                engine_prompt = cast(EmbedsPrompt | TokensPrompt, engine_prompt)
                if isinstance(sampling_params, BeamSearchParams):
                    generator = self.beam_search(
                        prompt=engine_prompt,
                        request_id=request_id,
                        params=sampling_params,
                        lora_request=lora_request,
                        trace_headers=trace_headers,
                    )
                else:
                    engine_request, tokenization_kwargs = await self._process_inputs(
                        request_id_item,
                        engine_prompt,
                        sampling_params,
                        lora_request=lora_request,
                        trace_headers=trace_headers,
                        priority=request.priority,
                        data_parallel_rank=data_parallel_rank,
                    )

                    generator = self.engine_client.generate(
                        engine_request,
                        sampling_params,
                        request_id_item,
                        lora_request=lora_request,
                        trace_headers=trace_headers,
                        priority=request.priority,
                        prompt_text=prompt_text,
                        tokenization_kwargs=tokenization_kwargs,
                        data_parallel_rank=data_parallel_rank,
                    )

                generators.append(generator)
        except ValueError as e:
            return self.create_error_response(e)

        result_generator = merge_async_iterators(*generators)

        model_name = self.models.model_name(lora_request)
        num_prompts = len(engine_prompts)

        # We do not stream the results when using beam search.
        stream = request.stream and not request.use_beam_search

        # Streaming response
        if stream:
            return self.completion_stream_generator(
                request,
                engine_prompts,
                result_generator,
                request_id,
                created_time,
                model_name,
                num_prompts=num_prompts,
                tokenizer=tokenizer,
                request_metadata=request_metadata,
            )

        # Non-streaming response
        final_res_batch: list[RequestOutput | None] = [None] * num_prompts
        try:
            async for i, res in result_generator:
                final_res_batch[i] = res

            for i, final_res in enumerate(final_res_batch):
                assert final_res is not None

                # The output should contain the input text
                # We did not pass it into vLLM engine to avoid being redundant
                # with the inputs token IDs
                if final_res.prompt is None:
                    engine_prompt = engine_prompts[i]
                    final_res.prompt = (
                        None
                        if is_embeds_prompt(engine_prompt)
                        else engine_prompt.get("prompt")
                    )

            final_res_batch_checked = cast(list[RequestOutput], final_res_batch)

            response = self.request_output_to_completion_response(
                final_res_batch_checked,
                request,
                request_id,
                created_time,
                model_name,
                tokenizer,
                request_metadata,
            )
        except asyncio.CancelledError:
            return self.create_error_response("Client disconnected")
        except GenerationError as e:
            return self._convert_generation_error_to_response(e)
        except ValueError as e:
            return self.create_error_response(e)

        # When user requests streaming but we don't stream, we still need to
        # return a streaming response with a single event.
        if request.stream:
            response_json = response.model_dump_json()

            async def fake_stream_generator() -> AsyncGenerator[str, None]:
                yield f"data: {response_json}\n\n"
                yield "data: [DONE]\n\n"

            return fake_stream_generator()

        return response

    async def completion_stream_generator(
        self,
        request: CompletionRequest,
        engine_prompts: list[TokensPrompt | EmbedsPrompt],
        result_generator: AsyncIterator[tuple[int, RequestOutput]],
        request_id: str,
        created_time: int,
        model_name: str,
        num_prompts: int,
        tokenizer: TokenizerLike | None,
        request_metadata: RequestResponseMetadata,
    ) -> AsyncGenerator[str, None]:
        num_choices = 1 if request.n is None else request.n
        previous_text_lens = [0] * num_choices * num_prompts
        previous_num_tokens = [0] * num_choices * num_prompts
        has_echoed = [False] * num_choices * num_prompts
        num_prompt_tokens = [0] * num_prompts
        num_cached_tokens = None
        first_iteration = True

        stream_options = request.stream_options
        include_usage, include_continuous_usage = should_include_usage(
            stream_options, self.enable_force_include_usage
        )

        try:
            async for prompt_idx, res in result_generator:
                prompt_token_ids = res.prompt_token_ids
                prompt_logprobs = res.prompt_logprobs

                if first_iteration:
                    num_cached_tokens = res.num_cached_tokens
                    first_iteration = False

                prompt_text = res.prompt
                if prompt_text is None:
                    engine_prompt = engine_prompts[prompt_idx]
                    prompt_text = (
                        None
                        if is_embeds_prompt(engine_prompt)
                        else engine_prompt.get("prompt")
                    )

                # Prompt details are excluded from later streamed outputs
                if prompt_token_ids is not None:
                    num_prompt_tokens[prompt_idx] = len(prompt_token_ids)

                delta_token_ids: GenericSequence[int]
                out_logprobs: GenericSequence[dict[int, Logprob] | None] | None

                for output in res.outputs:
                    i = output.index + prompt_idx * num_choices

                    # Useful when request.return_token_ids is True
                    # Returning prompt token IDs shares the same logic
                    # with the echo implementation.
                    prompt_token_ids_to_return: list[int] | None = None

                    assert request.max_tokens is not None
                    if request.echo and not has_echoed[i]:
                        assert prompt_token_ids is not None
                        if request.return_token_ids:
                            prompt_text = ""
                        assert prompt_text is not None
                        if request.max_tokens == 0:
                            # only return the prompt
                            delta_text = prompt_text
                            delta_token_ids = prompt_token_ids
                            out_logprobs = prompt_logprobs
                        else:
                            # echo the prompt and first token
                            delta_text = prompt_text + output.text
                            delta_token_ids = [
                                *prompt_token_ids,
                                *output.token_ids,
                            ]
                            out_logprobs = [
                                *(prompt_logprobs or []),
                                *(output.logprobs or []),
                            ]
                        prompt_token_ids_to_return = prompt_token_ids
                        has_echoed[i] = True
                    else:
                        # return just the delta
                        delta_text = output.text
                        delta_token_ids = output.token_ids
                        out_logprobs = output.logprobs

                        # has_echoed[i] is reused here to indicate whether
                        # we have already returned the prompt token IDs.
                        if not has_echoed[i] and request.return_token_ids:
                            prompt_token_ids_to_return = prompt_token_ids
                            has_echoed[i] = True

                        if (
                            not delta_text
                            and not delta_token_ids
                            and not previous_num_tokens[i]
                        ):
                            # Chunked prefill case, don't return empty chunks
                            continue

                    if request.logprobs is not None:
                        assert out_logprobs is not None, "Did not output logprobs"
                        logprobs = self._create_completion_logprobs(
                            token_ids=delta_token_ids,
                            top_logprobs=out_logprobs,
                            num_output_top_logprobs=request.logprobs,
                            tokenizer=tokenizer,
                            initial_text_offset=previous_text_lens[i],
                            return_as_token_id=request.return_tokens_as_token_ids,
                        )
                    else:
                        logprobs = None

                    previous_text_lens[i] += len(output.text)
                    previous_num_tokens[i] += len(output.token_ids)
                    finish_reason = output.finish_reason
                    stop_reason = output.stop_reason

                    self._raise_if_error(finish_reason, request_id)

                    chunk = CompletionStreamResponse(
                        id=request_id,
                        created=created_time,
                        model=model_name,
                        choices=[
                            CompletionResponseStreamChoice(
                                index=i,
                                text=delta_text,
                                logprobs=logprobs,
                                finish_reason=finish_reason,
                                stop_reason=stop_reason,
                                prompt_token_ids=prompt_token_ids_to_return,
                                token_ids=(
                                    as_list(output.token_ids)
                                    if request.return_token_ids
                                    else None
                                ),
                            )
                        ],
                    )
                    if include_continuous_usage:
                        prompt_tokens = num_prompt_tokens[prompt_idx]
                        completion_tokens = previous_num_tokens[i]
                        chunk.usage = UsageInfo(
                            prompt_tokens=prompt_tokens,
                            completion_tokens=completion_tokens,
                            total_tokens=prompt_tokens + completion_tokens,
                        )

                    response_json = chunk.model_dump_json(exclude_unset=False)
                    yield f"data: {response_json}\n\n"

            total_prompt_tokens = sum(num_prompt_tokens)
            total_completion_tokens = sum(previous_num_tokens)
            final_usage_info = UsageInfo(
                prompt_tokens=total_prompt_tokens,
                completion_tokens=total_completion_tokens,
                total_tokens=total_prompt_tokens + total_completion_tokens,
            )

            if self.enable_prompt_tokens_details and num_cached_tokens:
                final_usage_info.prompt_tokens_details = PromptTokenUsageInfo(
                    cached_tokens=num_cached_tokens
                )

            if include_usage:
                final_usage_chunk = CompletionStreamResponse(
                    id=request_id,
                    created=created_time,
                    model=model_name,
                    choices=[],
                    usage=final_usage_info,
                )
                final_usage_data = final_usage_chunk.model_dump_json(
                    exclude_unset=False, exclude_none=True
                )
                yield f"data: {final_usage_data}\n\n"

            # report to FastAPI middleware aggregate usage across all choices
            request_metadata.final_usage_info = final_usage_info

        except GenerationError as e:
            yield f"data: {self._convert_generation_error_to_streaming_response(e)}\n\n"
        except Exception as e:
            logger.exception("Error in completion stream generator.")
            data = self.create_streaming_error_response(e)
            yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"

    def request_output_to_completion_response(
        self,
        final_res_batch: list[RequestOutput],
        request: CompletionRequest,
        request_id: str,
        created_time: int,
        model_name: str,
        tokenizer: TokenizerLike | None,
        request_metadata: RequestResponseMetadata,
    ) -> CompletionResponse:
        choices: list[CompletionResponseChoice] = []
        num_prompt_tokens = 0
        num_generated_tokens = 0
        kv_transfer_params = None
        last_final_res = None
        for final_res in final_res_batch:
            last_final_res = final_res
            prompt_token_ids = final_res.prompt_token_ids
            assert prompt_token_ids is not None
            prompt_logprobs = clamp_prompt_logprobs(final_res.prompt_logprobs)
            prompt_text = final_res.prompt

            token_ids: GenericSequence[int]
            out_logprobs: GenericSequence[dict[int, Logprob] | None] | None

            for output in final_res.outputs:
                self._raise_if_error(output.finish_reason, request_id)

                assert request.max_tokens is not None
                if request.echo:
                    if request.return_token_ids:
                        prompt_text = ""
                    assert prompt_text is not None
                    if request.max_tokens == 0:
                        token_ids = prompt_token_ids
                        out_logprobs = prompt_logprobs
                        output_text = prompt_text
                    else:
                        token_ids = [*prompt_token_ids, *output.token_ids]

                        if request.logprobs is None:
                            out_logprobs = None
                        else:
                            assert prompt_logprobs is not None
                            assert output.logprobs is not None
                            out_logprobs = [
                                *prompt_logprobs,
                                *output.logprobs,
                            ]

                        output_text = prompt_text + output.text
                else:
                    token_ids = output.token_ids
                    out_logprobs = output.logprobs
                    output_text = output.text

                if request.logprobs is not None:
                    assert out_logprobs is not None, "Did not output logprobs"
                    logprobs = self._create_completion_logprobs(
                        token_ids=token_ids,
                        top_logprobs=out_logprobs,
                        tokenizer=tokenizer,
                        num_output_top_logprobs=request.logprobs,
                        return_as_token_id=request.return_tokens_as_token_ids,
                    )
                else:
                    logprobs = None

                choice_data = CompletionResponseChoice(
                    index=len(choices),
                    text=output_text,
                    logprobs=logprobs,
                    finish_reason=output.finish_reason,
                    stop_reason=output.stop_reason,
                    prompt_logprobs=final_res.prompt_logprobs,
                    prompt_token_ids=(
                        prompt_token_ids if request.return_token_ids else None
                    ),
                    token_ids=(
                        as_list(output.token_ids) if request.return_token_ids else None
                    ),
                )
                choices.append(choice_data)

                num_generated_tokens += len(output.token_ids)

            num_prompt_tokens += len(prompt_token_ids)

        usage = UsageInfo(
            prompt_tokens=num_prompt_tokens,
            completion_tokens=num_generated_tokens,
            total_tokens=num_prompt_tokens + num_generated_tokens,
        )

        if (
            self.enable_prompt_tokens_details
            and last_final_res
            and last_final_res.num_cached_tokens
        ):
            usage.prompt_tokens_details = PromptTokenUsageInfo(
                cached_tokens=last_final_res.num_cached_tokens
            )

        request_metadata.final_usage_info = usage
        if final_res_batch:
            kv_transfer_params = final_res_batch[0].kv_transfer_params
        return CompletionResponse(
            id=request_id,
            created=created_time,
            model=model_name,
            choices=choices,
            usage=usage,
            kv_transfer_params=kv_transfer_params,
        )

    def _create_completion_logprobs(
        self,
        token_ids: GenericSequence[int],
        top_logprobs: GenericSequence[dict[int, Logprob] | None],
        num_output_top_logprobs: int,
        tokenizer: TokenizerLike | None,
        initial_text_offset: int = 0,
        return_as_token_id: bool | None = None,
    ) -> CompletionLogProbs:
        """Create logprobs for OpenAI Completion API."""
        out_text_offset: list[int] = []
        out_token_logprobs: list[float | None] = []
        out_tokens: list[str] = []
        out_top_logprobs: list[dict[str, float] | None] = []

        last_token_len = 0

        should_return_as_token_id = (
            return_as_token_id
            if return_as_token_id is not None
            else self.return_tokens_as_token_ids
        )
        for i, token_id in enumerate(token_ids):
            step_top_logprobs = top_logprobs[i]
            if step_top_logprobs is None:
                if should_return_as_token_id:
                    token = f"token_id:{token_id}"
                else:
                    if tokenizer is None:
                        raise VLLMValidationError(
                            "Unable to get tokenizer because "
                            "`skip_tokenizer_init=True`",
                            parameter="skip_tokenizer_init",
                            value=True,
                        )

                    token = tokenizer.decode(token_id)

                out_tokens.append(token)
                out_token_logprobs.append(None)
                out_top_logprobs.append(None)
            else:
                step_token = step_top_logprobs[token_id]

                token = self._get_decoded_token(
                    step_token,
                    token_id,
                    tokenizer,
                    return_as_token_id=should_return_as_token_id,
                )
                token_logprob = max(step_token.logprob, -9999.0)

                out_tokens.append(token)
                out_token_logprobs.append(token_logprob)

                # makes sure to add the top num_output_top_logprobs + 1
                # logprobs, as defined in the openai API
                # (cf. https://github.com/openai/openai-openapi/blob/
                # 893ba52242dbd5387a97b96444ee1c742cfce9bd/openapi.yaml#L7153)
                out_top_logprobs.append(
                    {
                        # Convert float("-inf") to the
                        # JSON-serializable float that OpenAI uses
                        self._get_decoded_token(
                            top_lp[1],
                            top_lp[0],
                            tokenizer,
                            return_as_token_id=should_return_as_token_id,
                        ): max(top_lp[1].logprob, -9999.0)
                        for i, top_lp in enumerate(step_top_logprobs.items())
                        if num_output_top_logprobs >= i
                    }
                )

            if len(out_text_offset) == 0:
                out_text_offset.append(initial_text_offset)
            else:
                out_text_offset.append(out_text_offset[-1] + last_token_len)
            last_token_len = len(token)

        return CompletionLogProbs(
            text_offset=out_text_offset,
            token_logprobs=out_token_logprobs,
            tokens=out_tokens,
            top_logprobs=out_top_logprobs,
        )

    def _build_render_config(
        self,
        request: CompletionRequest,
        max_input_length: int | None = None,
    ) -> RenderConfig:
        # Validate max_tokens before using it
        if request.max_tokens is not None and request.max_tokens > self.max_model_len:
            raise VLLMValidationError(
                f"'max_tokens' ({request.max_tokens}) cannot be greater than "
                f"the model's maximum context length ({self.max_model_len}).",
                parameter="max_tokens",
                value=request.max_tokens,
            )

        max_input_tokens_len = self.max_model_len - (request.max_tokens or 0)
        return RenderConfig(
            max_length=max_input_tokens_len,
            truncate_prompt_tokens=request.truncate_prompt_tokens,
            add_special_tokens=request.add_special_tokens,
            cache_salt=request.cache_salt,
            needs_detokenization=bool(request.echo and not request.return_token_ids),
        )
```

---

## serving_engine - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_engine/

**Contents:**
- vllm.entrypoints.openai.serving_engine ¶
- AnyRequest module-attribute ¶
- AnyResponse module-attribute ¶
- ChatLikeRequest module-attribute ¶
- CompletionLikeRequest module-attribute ¶
- RequestT module-attribute ¶
- SpeechToTextRequest module-attribute ¶
- logger module-attribute ¶
- ClassificationServeContext dataclass ¶
  - __init__ ¶

Bases: ServeContext[ClassificationRequest]

Bases: ServeContext[EmbeddingRequest]

raised when finish_reason indicates internal server error (500)

Pulls the request id to use from a header, if provided

Build and return a RenderConfig for an endpoint.

Used by the renderer to control how prompts are prepared (e.g., tokenization and length handling). Endpoints should implement this with logic appropriate to their request type.

Default response builder. Subclass may override this method to return the appropriate response object.

Collect batch results from the result generator.

Convert GenerationError to ErrorResponse.

Convert GenerationError to streaming error response.

Determine if there are any active default multimodal loras.

Return (and cache) an AsyncMicrobatchTokenizer bound to the given tokenizer.

Pulls the data parallel rank from a header, if provided

Retrieve the set of types from message content dicts up until _; we use this to match potential multimodal data with default per modality loras.

Get the reasoning parser based on the name.

Get a Renderer instance with the provided tokenizer. Uses shared async tokenizer pool for efficiency.

Get the tool parser based on the name.

Execute the request processing pipeline yielding responses.

Schedule the request and get the result generator.

Default preprocessing hook. Subclasses may override to prepare ctx (classification, embedding, etc.).

Use the Processor to process inputs for AsyncLLM.

Raise GenerationError if finish_reason indicates an error.

A simpler implementation that tokenizes a single prompt input.

A simpler implementation that tokenizes multiple prompt inputs.

Mixin for request processing, handling prompt preparation and engine input.

Mixin for response generation, managing result generators and final batch results.

Bases: RequestProcessingMixin, ResponseGenerationMixin, Generic[RequestT]

**Examples:**

Example 1 (typescript):
```typescript
AnyRequest: TypeAlias = (
    CompletionLikeRequest
    | ChatLikeRequest
    | SpeechToTextRequest
    | ResponsesRequest
    | IOProcessorRequest
    | GenerateRequest
)
```

Example 2 (typescript):
```typescript
AnyRequest: TypeAlias = (
    CompletionLikeRequest
    | ChatLikeRequest
    | SpeechToTextRequest
    | ResponsesRequest
    | IOProcessorRequest
    | GenerateRequest
)
```

Example 3 (typescript):
```typescript
AnyResponse: TypeAlias = (
    CompletionResponse
    | ChatCompletionResponse
    | EmbeddingResponse
    | TranscriptionResponse
    | TokenizeResponse
    | PoolingResponse
    | ClassificationResponse
    | ScoreResponse
    | GenerateResponse
)
```

Example 4 (typescript):
```typescript
AnyResponse: TypeAlias = (
    CompletionResponse
    | ChatCompletionResponse
    | EmbeddingResponse
    | TranscriptionResponse
    | TokenizeResponse
    | PoolingResponse
    | ClassificationResponse
    | ScoreResponse
    | GenerateResponse
)
```

---

## serving_messages - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/anthropic/serving_messages/

**Contents:**
- vllm.entrypoints.anthropic.serving_messages ¶
- logger module-attribute ¶
- AnthropicServingMessages ¶
  - stop_reason_map instance-attribute ¶
  - __init__ ¶
  - _convert_anthropic_to_openai_request ¶
  - create_messages async ¶
  - message_stream_converter async ¶
  - messages_full_converter ¶
- wrap_data_with_event ¶

Anthropic Messages API serving handler

Bases: OpenAIServingChat

Handler for Anthropic Messages API requests

Convert Anthropic message format to OpenAI format

Messages API similar to Anthropic's API.

See https://docs.anthropic.com/en/api/messages for the API specification. This API mimics the Anthropic messages API.

**Examples:**

Example 1 (unknown):
```unknown
logger = getLogger(__name__)
```

Example 2 (unknown):
```unknown
logger = getLogger(__name__)
```

Example 3 (unknown):
```unknown
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
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
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
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
```

Example 4 (python):
```python
class AnthropicServingMessages(OpenAIServingChat):
    """Handler for Anthropic Messages API requests"""

    def __init__(
        self,
        engine_client: EngineClient,
        models: OpenAIServingModels,
        response_role: str,
        *,
        request_logger: RequestLogger | None,
        chat_template: str | None,
        chat_template_content_format: ChatTemplateContentFormatOption,
        return_tokens_as_token_ids: bool = False,
        reasoning_parser: str = "",
        enable_auto_tools: bool = False,
        tool_parser: str | None = None,
        enable_prompt_tokens_details: bool = False,
        enable_force_include_usage: bool = False,
    ):
        super().__init__(
            engine_client=engine_client,
            models=models,
            response_role=response_role,
            request_logger=request_logger,
            chat_template=chat_template,
            chat_template_content_format=chat_template_content_format,
            return_tokens_as_token_ids=return_tokens_as_token_ids,
            reasoning_parser=reasoning_parser,
            enable_auto_tools=enable_auto_tools,
            tool_parser=tool_parser,
            enable_prompt_tokens_details=enable_prompt_tokens_details,
            enable_force_include_usage=enable_force_include_usage,
        )
        self.stop_reason_map = {
            "stop": "end_turn",
            "length": "max_tokens",
            "tool_calls": "tool_use",
        }

    def _convert_anthropic_to_openai_request(
        self, anthropic_request: AnthropicMessagesRequest
    ) -> ChatCompletionRequest:
        """Convert Anthropic message format to OpenAI format"""
        openai_messages = []

        # Add system message if provided
        if anthropic_request.system:
            if isinstance(anthropic_request.system, str):
                openai_messages.append(
                    {"role": "system", "content": anthropic_request.system}
                )
            else:
                system_prompt = ""
                for block in anthropic_request.system:
                    if block.type == "text" and block.text:
                        system_prompt += block.text
                openai_messages.append({"role": "system", "content": system_prompt})

        for msg in anthropic_request.messages:
            openai_msg: dict[str, Any] = {"role": msg.role}  # type: ignore
            if isinstance(msg.content, str):
                openai_msg["content"] = msg.content
            else:
                # Handle complex content blocks
                content_parts: list[dict[str, Any]] = []
                tool_calls: list[dict[str, Any]] = []

                for block in msg.content:
                    if block.type == "text" and block.text:
                        content_parts.append({"type": "text", "text": block.text})
                    elif block.type == "image" and block.source:
                        content_parts.append(
                            {
                                "type": "image_url",
                                "image_url": {"url": block.source.get("data", "")},
                            }
                        )
                    elif block.type == "tool_use":
                        # Convert tool use to function call format
                        tool_call = {
                            "id": block.id or f"call_{int(time.time())}",
                            "type": "function",
                            "function": {
                                "name": block.name or "",
                                "arguments": json.dumps(block.input or {}),
                            },
                        }
                        tool_calls.append(tool_call)
                    elif block.type == "tool_result":
                        if msg.role == "user":
                            openai_messages.append(
                                {
                                    "role": "tool",
                                    "tool_call_id": block.id or "",
                                    "content": str(block.content)
                                    if block.content
                                    else "",
                                }
                            )
                        else:
                            # Assistant tool result becomes regular text
                            tool_result_text = (
                                str(block.content) if block.content else ""
                            )
                            content_parts.append(
                                {
                                    "type": "text",
                                    "text": f"Tool result: {tool_result_text}",
                                }
                            )

                # Add tool calls to the message if any
                if tool_calls:
                    openai_msg["tool_calls"] = tool_calls  # type: ignore

                # Add content parts if any
                if content_parts:
                    if len(content_parts) == 1 and content_parts[0]["type"] == "text":
                        openai_msg["content"] = content_parts[0]["text"]
                    else:
                        openai_msg["content"] = content_parts  # type: ignore
                elif not tool_calls:
                    continue

            openai_messages.append(openai_msg)

        req = ChatCompletionRequest(
            model=anthropic_request.model,
            messages=openai_messages,
            max_tokens=anthropic_request.max_tokens,
            max_completion_tokens=anthropic_request.max_tokens,
            stop=anthropic_request.stop_sequences,
            temperature=anthropic_request.temperature,
            top_p=anthropic_request.top_p,
            top_k=anthropic_request.top_k,
        )

        if anthropic_request.stream:
            req.stream = anthropic_request.stream
            req.stream_options = StreamOptions.validate(
                {"include_usage": True, "continuous_usage_stats": True}
            )

        if anthropic_request.tool_choice is None:
            req.tool_choice = None
        elif anthropic_request.tool_choice.type == "auto":
            req.tool_choice = "auto"
        elif anthropic_request.tool_choice.type == "any":
            req.tool_choice = "required"
        elif anthropic_request.tool_choice.type == "tool":
            req.tool_choice = ChatCompletionNamedToolChoiceParam.model_validate(
                {
                    "type": "function",
                    "function": {"name": anthropic_request.tool_choice.name},
                }
            )

        tools = []
        if anthropic_request.tools is None:
            return req
        for tool in anthropic_request.tools:
            tools.append(
                ChatCompletionToolsParam.model_validate(
                    {
                        "type": "function",
                        "function": {
                            "name": tool.name,
                            "description": tool.description,
                            "parameters": tool.input_schema,
                        },
                    }
                )
            )
        if req.tool_choice is None:
            req.tool_choice = "auto"
        req.tools = tools
        return req

    async def create_messages(
        self,
        request: AnthropicMessagesRequest,
        raw_request: Request | None = None,
    ) -> AsyncGenerator[str, None] | AnthropicMessagesResponse | ErrorResponse:
        """
        Messages API similar to Anthropic's API.

        See https://docs.anthropic.com/en/api/messages
        for the API specification. This API mimics the Anthropic messages API.
        """
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("Received messages request %s", request.model_dump_json())
        chat_req = self._convert_anthropic_to_openai_request(request)
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("Convert to OpenAI request %s", chat_req.model_dump_json())
        generator = await self.create_chat_completion(chat_req, raw_request)

        if isinstance(generator, ErrorResponse):
            return generator

        elif isinstance(generator, ChatCompletionResponse):
            return self.messages_full_converter(generator)

        return self.message_stream_converter(generator)

    def messages_full_converter(
        self,
        generator: ChatCompletionResponse,
    ) -> AnthropicMessagesResponse:
        result = AnthropicMessagesResponse(
            id=generator.id,
            content=[],
            model=generator.model,
            usage=AnthropicUsage(
                input_tokens=generator.usage.prompt_tokens,
                output_tokens=generator.usage.completion_tokens,
            ),
        )
        if generator.choices[0].finish_reason == "stop":
            result.stop_reason = "end_turn"
        elif generator.choices[0].finish_reason == "length":
            result.stop_reason = "max_tokens"
        elif generator.choices[0].finish_reason == "tool_calls":
            result.stop_reason = "tool_use"

        content: list[AnthropicContentBlock] = [
            AnthropicContentBlock(
                type="text",
                text=generator.choices[0].message.content
                if generator.choices[0].message.content
                else "",
            )
        ]

        for tool_call in generator.choices[0].message.tool_calls:
            anthropic_tool_call = AnthropicContentBlock(
                type="tool_use",
                id=tool_call.id,
                name=tool_call.function.name,
                input=json.loads(tool_call.function.arguments),
            )
            content += [anthropic_tool_call]

        result.content = content

        return result

    async def message_stream_converter(
        self,
        generator: AsyncGenerator[str, None],
    ) -> AsyncGenerator[str, None]:
        try:
            first_item = True
            finish_reason = None
            content_block_index = 0
            content_block_started = False

            async for item in generator:
                if item.startswith("data:"):
                    data_str = item[5:].strip().rstrip("\n")
                    if data_str == "[DONE]":
                        stop_message = AnthropicStreamEvent(
                            type="message_stop",
                        )
                        data = stop_message.model_dump_json(
                            exclude_unset=True, exclude_none=True
                        )
                        yield wrap_data_with_event(data, "message_stop")
                        yield "data: [DONE]\n\n"
                    else:
                        origin_chunk = ChatCompletionStreamResponse.model_validate_json(
                            data_str
                        )

                        if first_item:
                            chunk = AnthropicStreamEvent(
                                type="message_start",
                                message=AnthropicMessagesResponse(
                                    id=origin_chunk.id,
                                    content=[],
                                    model=origin_chunk.model,
                                    usage=AnthropicUsage(
                                        input_tokens=origin_chunk.usage.prompt_tokens
                                        if origin_chunk.usage
                                        else 0,
                                        output_tokens=0,
                                    ),
                                ),
                            )
                            first_item = False
                            data = chunk.model_dump_json(exclude_unset=True)
                            yield wrap_data_with_event(data, "message_start")
                            continue

                        # last chunk including usage info
                        if len(origin_chunk.choices) == 0:
                            if content_block_started:
                                stop_chunk = AnthropicStreamEvent(
                                    index=content_block_index,
                                    type="content_block_stop",
                                )
                                data = stop_chunk.model_dump_json(exclude_unset=True)
                                yield wrap_data_with_event(data, "content_block_stop")
                            stop_reason = self.stop_reason_map.get(
                                finish_reason or "stop"
                            )
                            chunk = AnthropicStreamEvent(
                                type="message_delta",
                                delta=AnthropicDelta(stop_reason=stop_reason),
                                usage=AnthropicUsage(
                                    input_tokens=origin_chunk.usage.prompt_tokens
                                    if origin_chunk.usage
                                    else 0,
                                    output_tokens=origin_chunk.usage.completion_tokens
                                    if origin_chunk.usage
                                    else 0,
                                ),
                            )
                            data = chunk.model_dump_json(exclude_unset=True)
                            yield wrap_data_with_event(data, "message_delta")
                            continue

                        if origin_chunk.choices[0].finish_reason is not None:
                            finish_reason = origin_chunk.choices[0].finish_reason
                            continue

                        # content
                        if origin_chunk.choices[0].delta.content is not None:
                            if not content_block_started:
                                chunk = AnthropicStreamEvent(
                                    index=content_block_index,
                                    type="content_block_start",
                                    content_block=AnthropicContentBlock(
                                        type="text", text=""
                                    ),
                                )
                                data = chunk.model_dump_json(exclude_unset=True)
                                yield wrap_data_with_event(data, "content_block_start")
                                content_block_started = True

                            if origin_chunk.choices[0].delta.content == "":
                                continue
                            chunk = AnthropicStreamEvent(
                                index=content_block_index,
                                type="content_block_delta",
                                delta=AnthropicDelta(
                                    type="text_delta",
                                    text=origin_chunk.choices[0].delta.content,
                                ),
                            )
                            data = chunk.model_dump_json(exclude_unset=True)
                            yield wrap_data_with_event(data, "content_block_delta")
                            continue

                        # tool calls
                        elif len(origin_chunk.choices[0].delta.tool_calls) > 0:
                            tool_call = origin_chunk.choices[0].delta.tool_calls[0]
                            if tool_call.id is not None:
                                if content_block_started:
                                    stop_chunk = AnthropicStreamEvent(
                                        index=content_block_index,
                                        type="content_block_stop",
                                    )
                                    data = stop_chunk.model_dump_json(
                                        exclude_unset=True
                                    )
                                    yield wrap_data_with_event(
                                        data, "content_block_stop"
                                    )
                                    content_block_started = False
                                    content_block_index += 1

                                chunk = AnthropicStreamEvent(
                                    index=content_block_index,
                                    type="content_block_start",
                                    content_block=AnthropicContentBlock(
                                        type="tool_use",
                                        id=tool_call.id,
                                        name=tool_call.function.name
                                        if tool_call.function
                                        else None,
                                        input={},
                                    ),
                                )
                                data = chunk.model_dump_json(exclude_unset=True)
                                yield wrap_data_with_event(data, "content_block_start")
                                content_block_started = True

                            else:
                                chunk = AnthropicStreamEvent(
                                    index=content_block_index,
                                    type="content_block_delta",
                                    delta=AnthropicDelta(
                                        type="input_json_delta",
                                        partial_json=tool_call.function.arguments
                                        if tool_call.function
                                        else None,
                                    ),
                                )
                                data = chunk.model_dump_json(exclude_unset=True)
                                yield wrap_data_with_event(data, "content_block_delta")
                            continue
                else:
                    error_response = AnthropicStreamEvent(
                        type="error",
                        error=AnthropicError(
                            type="internal_error",
                            message="Invalid data format received",
                        ),
                    )
                    data = error_response.model_dump_json(exclude_unset=True)
                    yield wrap_data_with_event(data, "error")
                    yield "data: [DONE]\n\n"

        except Exception as e:
            logger.exception("Error in message stream converter.")
            error_response = AnthropicStreamEvent(
                type="error",
                error=AnthropicError(type="internal_error", message=str(e)),
            )
            data = error_response.model_dump_json(exclude_unset=True)
            yield wrap_data_with_event(data, "error")
            yield "data: [DONE]\n\n"
```

---

## serving_models - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_models/

**Contents:**
- vllm.entrypoints.openai.serving_models ¶
- logger module-attribute ¶
- BaseModelPath dataclass ¶
  - model_path instance-attribute ¶
  - name instance-attribute ¶
  - __init__ ¶
- LoRAModulePath dataclass ¶
  - base_model_name class-attribute instance-attribute ¶
  - name instance-attribute ¶
  - path instance-attribute ¶

Shared instance to hold data about the loaded base model(s) and adapters.

Handles the routes: - /v1/models - /v1/load_lora_adapter - /v1/unload_lora_adapter

Loads all static LoRA modules. Raises if any fail to load

Returns the appropriate model name depending on the availability and support of the LoRA or base model. Parameters: - lora: LoRARequest that contain a base_model_name. Returns: - str: The name of the base model or the first available model path.

Attempt to resolve a LoRA adapter using available resolvers.

Name/identifier of the LoRA adapter

LoRARequest if found and loaded successfully.

ErrorResponse (404) if no resolver finds the adapter.

ErrorResponse (400) if adapter(s) are found but none load.

Show available models. This includes the base model and all adapters

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
27
28
29
30
```

Example 4 (python):
```python
@dataclass
class BaseModelPath:
    name: str
    model_path: str
```

---

## serving_responses - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_responses/

**Contents:**
- vllm.entrypoints.openai.serving_responses ¶
- logger module-attribute ¶
- OpenAIServingResponses ¶
  - background_tasks instance-attribute ¶
  - chat_template instance-attribute ¶
  - chat_template_content_format instance-attribute ¶
  - default_sampling_params instance-attribute ¶
  - enable_auto_tools instance-attribute ¶
  - enable_force_include_usage instance-attribute ¶
  - enable_log_outputs instance-attribute ¶

Returns the top-k logprobs from the logprobs dictionary.

Add validations to the input to the generator here.

Extract allowed_tools mapping from MCP tool requests.

Returns a dictionary mapping server_label to allowed_tools list. Handles both list format and McpAllowedToolsMcpToolFilter object format.

Special handling: - If allowed_tools is None, returns None (allows all tools) - If allowed_tools contains "*", returns None (allows all tools) - Otherwise, returns the list of specific tool names

This function can be reused for both harmony and non-harmony MCP calls.

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
 231
 232
 233
 234
 235
 236
 237
 238
 239
 240
 241
 242
 243
 244
 245
 246
 247
 248
 249
 250
 251
 252
 253
 254
 255
 256
 257
 258
 259
 260
 261
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
 413
 414
 415
 416
 417
 418
 419
 420
 421
 422
 423
 424
 425
 426
 427
 428
 429
 430
 431
 432
 433
 434
 435
 436
 437
 438
 439
 440
 441
 442
 443
 444
 445
 446
 447
 448
 449
 450
 451
 452
 453
 454
 455
 456
 457
 458
 459
 460
 461
 462
 463
 464
 465
 466
 467
 468
 469
 470
 471
 472
 473
 474
 475
 476
 477
 478
 479
 480
 481
 482
 483
 484
 485
 486
 487
 488
 489
 490
 491
 492
 493
 494
 495
 496
 497
 498
 499
 500
 501
 502
 503
 504
 505
 506
 507
 508
 509
 510
 511
 512
 513
 514
 515
 516
 517
 518
 519
 520
 521
 522
 523
 524
 525
 526
 527
 528
 529
 530
 531
 532
 533
 534
 535
 536
 537
 538
 539
 540
 541
 542
 543
 544
 545
 546
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
 698
 699
 700
 701
 702
 703
 704
 705
 706
 707
 708
 709
 710
 711
 712
 713
 714
 715
 716
 717
 718
 719
 720
 721
 722
 723
 724
 725
 726
 727
 728
 729
 730
 731
 732
 733
 734
 735
 736
 737
 738
 739
 740
 741
 742
 743
 744
 745
 746
 747
 748
 749
 750
 751
 752
 753
 754
 755
 756
 757
 758
 759
 760
 761
 762
 763
 764
 765
 766
 767
 768
 769
 770
 771
 772
 773
 774
 775
 776
 777
 778
 779
 780
 781
 782
 783
 784
 785
 786
 787
 788
 789
 790
 791
 792
 793
 794
 795
 796
 797
 798
 799
 800
 801
 802
 803
 804
 805
 806
 807
 808
 809
 810
 811
 812
 813
 814
 815
 816
 817
 818
 819
 820
 821
 822
 823
 824
 825
 826
 827
 828
 829
 830
 831
 832
 833
 834
 835
 836
 837
 838
 839
 840
 841
 842
 843
 844
 845
 846
 847
 848
 849
 850
 851
 852
 853
 854
 855
 856
 857
 858
 859
 860
 861
 862
 863
 864
 865
 866
 867
 868
 869
 870
 871
 872
 873
 874
 875
 876
 877
 878
 879
 880
 881
 882
 883
 884
 885
 886
 887
 888
 889
 890
 891
 892
 893
 894
 895
 896
 897
 898
 899
 900
 901
 902
 903
 904
 905
 906
 907
 908
 909
 910
 911
 912
 913
 914
 915
 916
 917
 918
 919
 920
 921
 922
 923
 924
 925
 926
 927
 928
 929
 930
 931
 932
 933
 934
 935
 936
 937
 938
 939
 940
 941
 942
 943
 944
 945
 946
 947
 948
 949
 950
 951
 952
 953
 954
 955
 956
 957
 958
 959
 960
 961
 962
 963
 964
 965
 966
 967
 968
 969
 970
 971
 972
 973
 974
 975
 976
 977
 978
 979
 980
 981
 982
 983
 984
 985
 986
 987
 988
 989
 990
 991
 992
 993
 994
 995
 996
 997
 998
 999
1000
1001
1002
1003
1004
1005
1006
1007
1008
1009
1010
1011
1012
1013
1014
1015
1016
1017
1018
1019
1020
1021
1022
1023
1024
1025
1026
1027
1028
1029
1030
1031
1032
1033
1034
1035
1036
1037
1038
1039
1040
1041
1042
1043
1044
1045
1046
1047
1048
1049
1050
1051
1052
1053
1054
1055
1056
1057
1058
1059
1060
1061
1062
1063
1064
1065
1066
1067
1068
1069
1070
1071
1072
1073
1074
1075
1076
1077
1078
1079
1080
1081
1082
1083
1084
1085
1086
1087
1088
1089
1090
1091
1092
1093
1094
1095
1096
1097
1098
1099
1100
1101
1102
1103
1104
1105
1106
1107
1108
1109
1110
1111
1112
1113
1114
1115
1116
1117
1118
1119
1120
1121
1122
1123
1124
1125
1126
1127
1128
1129
1130
1131
1132
1133
1134
1135
1136
1137
1138
1139
1140
1141
1142
1143
1144
1145
1146
1147
1148
1149
1150
1151
1152
1153
1154
1155
1156
1157
1158
1159
1160
1161
1162
1163
1164
1165
1166
1167
1168
1169
1170
1171
1172
1173
1174
1175
1176
1177
1178
1179
1180
1181
1182
1183
1184
1185
1186
1187
1188
1189
1190
1191
1192
1193
1194
1195
1196
1197
1198
1199
1200
1201
1202
1203
1204
1205
1206
1207
1208
1209
1210
1211
1212
1213
1214
1215
1216
1217
1218
1219
1220
1221
1222
1223
1224
1225
1226
1227
1228
1229
1230
1231
1232
1233
1234
1235
1236
1237
1238
1239
1240
1241
1242
1243
1244
1245
1246
1247
1248
1249
1250
1251
1252
1253
1254
1255
1256
1257
1258
1259
1260
1261
1262
1263
1264
1265
1266
1267
1268
1269
1270
1271
1272
1273
1274
1275
1276
1277
1278
1279
1280
1281
1282
1283
1284
1285
1286
1287
1288
1289
1290
1291
1292
1293
1294
1295
1296
1297
1298
1299
1300
1301
1302
1303
1304
1305
1306
1307
1308
1309
1310
1311
1312
1313
1314
1315
1316
1317
1318
1319
1320
1321
1322
1323
1324
1325
1326
1327
1328
1329
1330
1331
1332
1333
1334
1335
1336
1337
1338
1339
1340
1341
1342
1343
1344
1345
1346
1347
1348
1349
1350
1351
1352
1353
1354
1355
1356
1357
1358
1359
1360
1361
1362
1363
1364
1365
1366
1367
1368
1369
1370
1371
1372
1373
1374
1375
1376
1377
1378
1379
1380
1381
1382
1383
1384
1385
1386
1387
1388
1389
1390
1391
1392
1393
1394
1395
1396
1397
1398
1399
1400
1401
1402
1403
1404
1405
1406
1407
1408
1409
1410
1411
1412
1413
1414
1415
1416
1417
1418
1419
1420
1421
1422
1423
1424
1425
1426
1427
1428
1429
1430
1431
1432
1433
1434
1435
1436
1437
1438
1439
1440
1441
1442
1443
1444
1445
1446
1447
1448
1449
1450
1451
1452
1453
1454
1455
1456
1457
1458
1459
1460
1461
1462
1463
1464
1465
1466
1467
1468
1469
1470
1471
1472
1473
1474
1475
1476
1477
1478
1479
1480
1481
1482
1483
1484
1485
1486
1487
1488
1489
1490
1491
1492
1493
1494
1495
1496
1497
1498
1499
1500
1501
1502
1503
1504
1505
1506
1507
1508
1509
1510
1511
1512
1513
1514
1515
1516
1517
1518
1519
1520
1521
1522
1523
1524
1525
1526
1527
1528
1529
1530
1531
1532
1533
1534
1535
1536
1537
1538
1539
1540
1541
1542
1543
1544
1545
1546
1547
1548
1549
1550
1551
1552
1553
1554
1555
1556
1557
1558
1559
1560
1561
1562
1563
1564
1565
1566
1567
1568
1569
1570
1571
1572
1573
1574
1575
1576
1577
1578
1579
1580
1581
1582
1583
1584
1585
1586
1587
1588
1589
1590
1591
1592
1593
1594
1595
1596
1597
1598
1599
1600
1601
1602
1603
1604
1605
1606
1607
1608
1609
1610
1611
1612
1613
1614
1615
1616
1617
1618
1619
1620
1621
1622
1623
1624
1625
1626
1627
1628
1629
1630
1631
1632
1633
1634
1635
1636
1637
1638
1639
1640
1641
1642
1643
1644
1645
1646
1647
1648
1649
1650
1651
1652
1653
1654
1655
1656
1657
1658
1659
1660
1661
1662
1663
1664
1665
1666
1667
1668
1669
1670
1671
1672
1673
1674
1675
1676
1677
1678
1679
1680
1681
1682
1683
1684
1685
1686
1687
1688
1689
1690
1691
1692
1693
1694
1695
1696
1697
1698
1699
1700
1701
1702
1703
1704
1705
1706
1707
1708
1709
1710
1711
1712
1713
1714
1715
1716
1717
1718
1719
1720
1721
1722
1723
1724
1725
1726
1727
1728
1729
1730
1731
1732
1733
1734
1735
1736
1737
1738
1739
1740
1741
1742
1743
1744
1745
1746
1747
1748
1749
1750
1751
1752
1753
1754
1755
1756
1757
1758
1759
1760
1761
1762
1763
1764
1765
1766
1767
1768
1769
1770
1771
1772
1773
1774
1775
1776
1777
1778
1779
1780
1781
1782
1783
1784
1785
1786
1787
1788
1789
1790
1791
1792
1793
1794
1795
1796
1797
1798
1799
1800
1801
1802
1803
1804
1805
1806
1807
1808
1809
1810
1811
1812
1813
1814
1815
1816
1817
1818
1819
1820
1821
1822
1823
1824
1825
1826
1827
1828
1829
1830
1831
1832
1833
1834
1835
1836
1837
1838
1839
1840
1841
1842
1843
1844
1845
1846
1847
1848
1849
1850
1851
1852
1853
1854
1855
1856
1857
1858
1859
1860
1861
1862
1863
1864
1865
1866
1867
1868
1869
1870
1871
1872
1873
1874
1875
1876
1877
1878
1879
1880
1881
1882
1883
1884
1885
1886
1887
1888
1889
1890
1891
1892
1893
1894
1895
1896
1897
1898
1899
1900
1901
1902
1903
1904
1905
1906
1907
1908
1909
1910
1911
1912
1913
1914
1915
1916
1917
1918
1919
1920
1921
1922
1923
1924
1925
1926
1927
1928
1929
1930
1931
1932
1933
1934
1935
1936
1937
1938
1939
1940
1941
1942
1943
1944
1945
1946
1947
1948
1949
1950
1951
1952
1953
1954
1955
1956
1957
1958
1959
1960
1961
1962
1963
1964
1965
1966
1967
1968
1969
1970
1971
1972
1973
1974
1975
1976
1977
1978
1979
1980
1981
1982
1983
1984
1985
1986
1987
1988
1989
1990
1991
1992
1993
1994
1995
1996
1997
1998
1999
2000
2001
2002
2003
2004
2005
2006
2007
2008
2009
2010
2011
2012
2013
2014
2015
2016
2017
2018
2019
2020
2021
2022
2023
2024
2025
2026
2027
2028
2029
2030
2031
2032
2033
2034
2035
2036
2037
2038
2039
2040
2041
2042
2043
2044
2045
2046
2047
2048
2049
2050
2051
2052
2053
2054
2055
2056
2057
2058
2059
2060
2061
2062
2063
2064
2065
2066
2067
2068
2069
2070
2071
2072
2073
2074
2075
2076
2077
2078
2079
2080
2081
2082
2083
2084
```

Example 4 (python):
```python
class OpenAIServingResponses(OpenAIServing):
    def __init__(
        self,
        engine_client: EngineClient,
        models: OpenAIServingModels,
        *,
        request_logger: RequestLogger | None,
        chat_template: str | None,
        chat_template_content_format: ChatTemplateContentFormatOption,
        return_tokens_as_token_ids: bool = False,
        reasoning_parser: str = "",
        enable_auto_tools: bool = False,
        tool_parser: str | None = None,
        tool_server: ToolServer | None = None,
        enable_prompt_tokens_details: bool = False,
        enable_force_include_usage: bool = False,
        enable_log_outputs: bool = False,
        log_error_stack: bool = False,
    ) -> None:
        super().__init__(
            engine_client=engine_client,
            models=models,
            request_logger=request_logger,
            return_tokens_as_token_ids=return_tokens_as_token_ids,
            log_error_stack=log_error_stack,
        )

        self.chat_template = chat_template
        self.chat_template_content_format: Final = chat_template_content_format
        self.enable_log_outputs = enable_log_outputs

        self.reasoning_parser = self._get_reasoning_parser(
            reasoning_parser_name=reasoning_parser
        )
        self.enable_prompt_tokens_details = enable_prompt_tokens_details
        self.enable_force_include_usage = enable_force_include_usage
        self.default_sampling_params = self.model_config.get_diff_sampling_param()
        if self.default_sampling_params:
            source = self.model_config.generation_config
            source = "model" if source == "auto" else source
            logger.info(
                "Using default chat sampling params from %s: %s",
                source,
                self.default_sampling_params,
            )

        # If False (default), the "store" option is (silently) ignored and the
        # response is not stored. If True, the response is stored in memory.
        # NOTE(woosuk): This may not be intuitive for users, as the default
        # behavior in OpenAI's Responses API is to store the response, but
        # vLLM's default behavior is not.
        self.enable_store = envs.VLLM_ENABLE_RESPONSES_API_STORE
        if self.enable_store:
            logger.warning_once(
                "`VLLM_ENABLE_RESPONSES_API_STORE` is enabled. This may "
                "cause a memory leak since we never remove responses from "
                "the store."
            )

        self.use_harmony = self.model_config.hf_config.model_type == "gpt_oss"
        if self.use_harmony:
            logger.warning(
                "For gpt-oss, we ignore --enable-auto-tool-choice "
                "and always enable tool use."
            )
            # OpenAI models have two EOS-like tokens: <|return|> and <|call|>.
            # We need to add them to the stop token ids.
            if "stop_token_ids" not in self.default_sampling_params:
                self.default_sampling_params["stop_token_ids"] = []
            self.default_sampling_params["stop_token_ids"].extend(
                get_stop_tokens_for_assistant_actions()
            )
        self.enable_auto_tools = enable_auto_tools
        # set up tool use
        self.tool_parser = self._get_tool_parser(
            tool_parser_name=tool_parser, enable_auto_tools=enable_auto_tools
        )
        # HACK(woosuk): This is a hack. We should use a better store.
        # FIXME: If enable_store=True, this may cause a memory leak since we
        # never remove responses from the store.
        self.response_store: dict[str, ResponsesResponse] = {}
        self.response_store_lock = asyncio.Lock()

        # HACK(woosuk): This is a hack. We should use a better store.
        # FIXME: If enable_store=True, this may cause a memory leak since we
        # never remove messages from the store.
        self.msg_store: dict[str, list[ChatCompletionMessageParam]] = {}

        # HACK(wuhang): This is a hack. We should use a better store.
        # FIXME: If enable_store=True, this may cause a memory leak since we
        # never remove events from the store.
        self.event_store: dict[
            str, tuple[deque[StreamingResponsesResponse], asyncio.Event]
        ] = {}

        self.background_tasks: dict[str, asyncio.Task] = {}

        self.tool_server = tool_server

    def _validate_generator_input(
        self, engine_prompt: TokensPrompt
    ) -> ErrorResponse | None:
        """Add validations to the input to the generator here."""
        if self.max_model_len <= len(engine_prompt["prompt_token_ids"]):
            error_message = (
                "The engine prompt length"
                f" {len(engine_prompt['prompt_token_ids'])} "
                f"exceeds the max_model_len {self.max_model_len}. "
                "Please reduce prompt."
            )
            return self.create_error_response(
                err_type="invalid_request_error",
                message=error_message,
                status_code=HTTPStatus.BAD_REQUEST,
                param="input",
            )
        return None

    def _validate_create_responses_input(
        self, request: ResponsesRequest
    ) -> ErrorResponse | None:
        if self.use_harmony and request.is_include_output_logprobs():
            return self.create_error_response(
                err_type="invalid_request_error",
                message="logprobs are not supported with gpt-oss models",
                status_code=HTTPStatus.BAD_REQUEST,
                param="logprobs",
            )
        if request.store and not self.enable_store and request.background:
            return self.create_error_response(
                err_type="invalid_request_error",
                message=(
                    "This vLLM engine does not support `store=True` and "
                    "therefore does not support the background mode. To "
                    "enable these features, set the environment variable "
                    "`VLLM_ENABLE_RESPONSES_API_STORE=1` when launching "
                    "the vLLM server."
                ),
                status_code=HTTPStatus.BAD_REQUEST,
                param="background",
            )
        if request.previous_input_messages and request.previous_response_id:
            return self.create_error_response(
                err_type="invalid_request_error",
                message="Only one of `previous_input_messages` and "
                "`previous_response_id` can be set.",
                status_code=HTTPStatus.BAD_REQUEST,
                param="previous_response_id",
            )
        return None

    async def create_responses(
        self,
        request: ResponsesRequest,
        raw_request: Request | None = None,
    ) -> (
        AsyncGenerator[StreamingResponsesResponse, None]
        | ResponsesResponse
        | ErrorResponse
    ):
        error_check_ret = await self._check_model(request)
        if error_check_ret is not None:
            logger.error("Error with model %s", error_check_ret)
            return error_check_ret
        maybe_validation_error = self._validate_create_responses_input(request)
        if maybe_validation_error is not None:
            return maybe_validation_error

        # If the engine is dead, raise the engine's DEAD_ERROR.
        # This is required for the streaming case, where we return a
        # success status before we actually start generating text :).
        if self.engine_client.errored:
            raise self.engine_client.dead_error

        if request.store and not self.enable_store:
            # Disable the store option.
            # NOTE(woosuk): Although returning an error is possible, we opted
            # to implicitly disable store and process the request anyway, as
            # we assume most users do not intend to actually store the response
            # (i.e., their request's `store=True` just because it's the default
            # value).
            request.store = False

        # Handle the previous response ID.
        prev_response_id = request.previous_response_id
        if prev_response_id is not None:
            async with self.response_store_lock:
                prev_response = self.response_store.get(prev_response_id)
            if prev_response is None:
                return self._make_not_found_error(prev_response_id)
        else:
            prev_response = None

        try:
            lora_request = self._maybe_get_adapters(request)
            model_name = self.models.model_name(lora_request)
            tokenizer = await self.engine_client.get_tokenizer()

            if self.use_harmony:
                messages, engine_prompts = self._make_request_with_harmony(
                    request, prev_response
                )
            else:
                messages, engine_prompts = await self._make_request(
                    request, prev_response, tokenizer
                )

        except (
            ValueError,
            TypeError,
            RuntimeError,
            jinja2.TemplateError,
            NotImplementedError,
        ) as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(f"{e} {e.__cause__}")

        request_metadata = RequestResponseMetadata(request_id=request.request_id)
        if raw_request:
            raw_request.state.request_metadata = request_metadata

        # Schedule the request and get the result generator.
        generators: list[AsyncGenerator[ConversationContext, None]] = []

        builtin_tool_list: list[str] = []
        if self.tool_server is not None:
            if self.tool_server.has_tool("browser"):
                builtin_tool_list.append("browser")
            if self.tool_server.has_tool("python"):
                builtin_tool_list.append("python")
            if self.tool_server.has_tool("container"):
                builtin_tool_list.append("container")

        if self.tool_server is not None:
            available_tools = builtin_tool_list
        else:
            assert len(builtin_tool_list) == 0
            available_tools = []
        try:
            for engine_prompt in engine_prompts:
                maybe_error = self._validate_generator_input(engine_prompt)
                if maybe_error is not None:
                    return maybe_error

                default_max_tokens = self.max_model_len - len(
                    engine_prompt["prompt_token_ids"]
                )

                sampling_params = request.to_sampling_params(
                    default_max_tokens, self.default_sampling_params
                )

                trace_headers = (
                    None
                    if raw_request is None
                    else await self._get_trace_headers(raw_request.headers)
                )

                context: ConversationContext
                if self.use_harmony:
                    if request.stream:
                        context = StreamingHarmonyContext(messages, available_tools)
                    else:
                        context = HarmonyContext(messages, available_tools)
                else:
                    if envs.VLLM_USE_EXPERIMENTAL_PARSER_CONTEXT:
                        # This is a feature in development for parsing
                        # tokens during generation instead of at the end
                        context = ParsableContext(
                            response_messages=messages,
                            tokenizer=tokenizer,
                            reasoning_parser_cls=self.reasoning_parser,
                            request=request,
                            tool_parser_cls=self.tool_parser,
                            available_tools=available_tools,
                            chat_template=self.chat_template,
                            chat_template_content_format=self.chat_template_content_format,
                        )
                    else:
                        context = SimpleContext()

                if self.reasoning_parser is not None:
                    reasoning_parser = self.reasoning_parser(tokenizer)
                    if sampling_params.structured_outputs is None:
                        sampling_params.structured_outputs = StructuredOutputsParams()
                    struct_out = sampling_params.structured_outputs
                    if struct_out.all_non_structural_tag_constraints_none():
                        sampling_params.structured_outputs.structural_tag = (
                            reasoning_parser.prepare_structured_tag(
                                sampling_params.structured_outputs.structural_tag,
                                self.tool_server,
                            )
                        )
                generator = self._generate_with_builtin_tools(
                    request_id=request.request_id,
                    engine_prompt=engine_prompt,
                    sampling_params=sampling_params,
                    context=context,
                    lora_request=lora_request,
                    priority=request.priority,
                    trace_headers=trace_headers,
                )
                generators.append(generator)
        except ValueError as e:
            return self.create_error_response(e)

        assert len(generators) == 1
        (result_generator,) = generators

        # Store the input messages.
        if request.store:
            self.msg_store[request.request_id] = messages

        if request.background:
            created_time = int(time.time())
            response = ResponsesResponse.from_request(
                request,
                sampling_params,
                model_name=model_name,
                created_time=created_time,
                output=[],
                status="queued",
                usage=None,
            )
            async with self.response_store_lock:
                self.response_store[response.id] = response

            # Run the request in the background.
            if request.stream:
                task = asyncio.create_task(
                    self._run_background_request_stream(
                        request,
                        sampling_params,
                        result_generator,
                        context,
                        model_name,
                        tokenizer,
                        request_metadata,
                        created_time,
                    ),
                    name=f"create_{request.request_id}",
                )
            else:
                task = asyncio.create_task(
                    self._run_background_request(
                        request,
                        sampling_params,
                        result_generator,
                        context,
                        model_name,
                        tokenizer,
                        request_metadata,
                        created_time,
                    ),
                    name=f"create_{response.id}",
                )

            # For cleanup.
            response_id = response.id
            self.background_tasks[response_id] = task
            task.add_done_callback(
                lambda _: self.background_tasks.pop(response_id, None)
            )

            if request.stream:
                return self.responses_background_stream_generator(request.request_id)
            return response

        if request.stream:
            return self.responses_stream_generator(
                request,
                sampling_params,
                result_generator,
                context,
                model_name,
                tokenizer,
                request_metadata,
            )

        try:
            return await self.responses_full_generator(
                request,
                sampling_params,
                result_generator,
                context,
                model_name,
                tokenizer,
                request_metadata,
            )
        except GenerationError as e:
            return self._convert_generation_error_to_response(e)
        except Exception as e:
            return self.create_error_response(e)

    async def _make_request(
        self,
        request: ResponsesRequest,
        prev_response: ResponsesResponse | None,
        tokenizer: TokenizerLike,
    ):
        tool_dicts = construct_tool_dicts(request.tools, request.tool_choice)
        # Construct the input messages.
        messages = construct_input_messages(
            request_instructions=request.instructions,
            request_input=request.input,
            prev_msg=self.msg_store.get(prev_response.id) if prev_response else None,
            prev_response_output=prev_response.output if prev_response else None,
        )
        _, engine_prompts = await self._preprocess_chat(
            request,
            tokenizer,
            messages,
            tool_dicts=tool_dicts,
            tool_parser=self.tool_parser,
            chat_template=self.chat_template,
            chat_template_content_format=self.chat_template_content_format,
        )
        return messages, engine_prompts

    def _make_request_with_harmony(
        self,
        request: ResponsesRequest,
        prev_response: ResponsesResponse | None,
    ):
        if request.tool_choice != "auto":
            raise NotImplementedError(
                "Only 'auto' tool_choice is supported in response API with Harmony"
            )
        messages = self._construct_input_messages_with_harmony(request, prev_response)
        prompt_token_ids = render_for_completion(messages)
        engine_prompt = TokensPrompt(prompt_token_ids=prompt_token_ids)

        # Add cache_salt if provided in the request
        if request.cache_salt is not None:
            engine_prompt["cache_salt"] = request.cache_salt

        return messages, [engine_prompt]

    async def _initialize_tool_sessions(
        self,
        request: ResponsesRequest,
        context: ConversationContext,
        exit_stack: AsyncExitStack,
    ):
        # we should only initialize the tool session if the request needs tools
        if len(request.tools) == 0:
            return
        mcp_tools = {
            tool.server_label: tool for tool in request.tools if tool.type == "mcp"
        }
        await context.init_tool_sessions(
            self.tool_server, exit_stack, request.request_id, mcp_tools
        )

    async def responses_full_generator(
        self,
        request: ResponsesRequest,
        sampling_params: SamplingParams,
        result_generator: AsyncIterator[ConversationContext],
        context: ConversationContext,
        model_name: str,
        tokenizer: TokenizerLike,
        request_metadata: RequestResponseMetadata,
        created_time: int | None = None,
    ) -> ErrorResponse | ResponsesResponse:
        if created_time is None:
            created_time = int(time.time())

        async with AsyncExitStack() as exit_stack:
            try:
                await self._initialize_tool_sessions(request, context, exit_stack)
                async for _ in result_generator:
                    pass
            except asyncio.CancelledError:
                return self.create_error_response("Client disconnected")
            except ValueError as e:
                return self.create_error_response(e)

        # NOTE: Implementation of stauts is still WIP, but for now
        # we guarantee that if the status is not "completed", it is accurate.
        # "completed" is implemented as the "catch-all" for now.
        status: ResponseStatus = "completed"

        input_messages: ResponseInputOutputMessage | None = None
        output_messages: ResponseInputOutputMessage | None = None
        if self.use_harmony:
            assert isinstance(context, HarmonyContext)
            output = self._make_response_output_items_with_harmony(context)
            if request.enable_response_messages:
                input_messages = context.messages[: context.num_init_messages]
                output_messages = context.messages[context.num_init_messages :]
            num_tool_output_tokens = context.num_tool_output_tokens
            if len(output) > 0:
                if context.finish_reason == "length":
                    status = "incomplete"
                elif context.finish_reason == "abort":
                    status = "cancelled"
                else:
                    self._raise_if_error(context.finish_reason, request.request_id)
            else:
                status = "incomplete"
        elif isinstance(context, ParsableContext):
            output = context.parser.make_response_output_items_from_parsable_context()

            if request.enable_response_messages:
                input_messages = context.input_messages
                output_messages = context.output_messages

            # TODO: Calculate usage.
            # assert final_res.prompt_token_ids is not None
            num_tool_output_tokens = 0
        else:
            assert isinstance(context, SimpleContext)
            # Use final_output which has accumulated text/token_ids/logprobs
            final_res = context.final_output
            assert final_res is not None
            assert len(final_res.outputs) == 1
            final_output = final_res.outputs[0]

            # finish_reason='error' indicates retryable internal error
            self._raise_if_error(final_output.finish_reason, request.request_id)

            output = self._make_response_output_items(request, final_output, tokenizer)

            if request.enable_response_messages:
                input_messages = context.input_messages
                output_messages = context.output_messages

            # Calculate usage.
            assert final_res.prompt_token_ids is not None
            num_tool_output_tokens = 0

        assert isinstance(context, (SimpleContext, HarmonyContext, ParsableContext))
        num_prompt_tokens = context.num_prompt_tokens
        num_generated_tokens = context.num_output_tokens
        num_cached_tokens = context.num_cached_tokens
        num_reasoning_tokens = context.num_reasoning_tokens

        usage = ResponseUsage(
            input_tokens=num_prompt_tokens,
            output_tokens=num_generated_tokens,
            total_tokens=num_prompt_tokens + num_generated_tokens,
            input_tokens_details=InputTokensDetails(
                cached_tokens=num_cached_tokens,
                input_tokens_per_turn=[
                    turn.input_tokens for turn in context.all_turn_metrics
                ],
                cached_tokens_per_turn=[
                    turn.cached_input_tokens for turn in context.all_turn_metrics
                ],
            ),
            output_tokens_details=OutputTokensDetails(
                reasoning_tokens=num_reasoning_tokens,
                tool_output_tokens=num_tool_output_tokens,
                output_tokens_per_turn=[
                    turn.output_tokens for turn in context.all_turn_metrics
                ],
                tool_output_tokens_per_turn=[
                    turn.tool_output_tokens for turn in context.all_turn_metrics
                ],
            ),
        )
        response = ResponsesResponse.from_request(
            request,
            sampling_params,
            input_messages=input_messages,
            output_messages=output_messages,
            model_name=model_name,
            created_time=created_time,
            output=output,
            status=status,
            usage=usage,
        )

        if request.store:
            async with self.response_store_lock:
                stored_response = self.response_store.get(response.id)
                # If the response is already cancelled, don't update it.
                if stored_response is None or stored_response.status != "cancelled":
                    self.response_store[response.id] = response
        return response

    def _topk_logprobs(
        self,
        logprobs: dict[int, SampleLogprob],
        top_logprobs: int,
        tokenizer: TokenizerLike,
    ) -> list[LogprobTopLogprob]:
        """Returns the top-k logprobs from the logprobs dictionary."""
        out = []
        for i, (token_id, _logprob) in enumerate(logprobs.items()):
            if i >= top_logprobs:
                break
            text = (
                _logprob.decoded_token
                if _logprob.decoded_token is not None
                else tokenizer.decode([token_id])
            )
            out.append(
                LogprobTopLogprob(
                    token=text,
                    logprob=max(_logprob.logprob, -9999.0),
                    bytes=list(text.encode("utf-8", errors="replace")),
                )
            )
        return out

    def _create_response_logprobs(
        self,
        token_ids: Sequence[int],
        logprobs: SampleLogprobs | None,
        tokenizer: TokenizerLike,
        top_logprobs: int | None = None,
    ) -> list[Logprob]:
        assert logprobs is not None, "logprobs must be provided"
        assert len(token_ids) == len(logprobs), (
            "token_ids and logprobs.token_ids must have the same length"
        )
        out = []
        for i, token_id in enumerate(token_ids):
            logprob = logprobs[i]
            token_logprob = logprob[token_id]
            text = (
                token_logprob.decoded_token
                if token_logprob.decoded_token is not None
                else tokenizer.decode([token_id])
            )
            out.append(
                Logprob(
                    token=text,
                    logprob=max(token_logprob.logprob, -9999.0),
                    bytes=list(text.encode("utf-8", errors="replace")),
                    top_logprobs=(
                        self._topk_logprobs(
                            logprob, top_logprobs=top_logprobs, tokenizer=tokenizer
                        )
                        if top_logprobs
                        else []
                    ),
                )
            )
        return out

    def _create_stream_response_logprobs(
        self,
        token_ids: Sequence[int],
        logprobs: SampleLogprobs | None,
        tokenizer: TokenizerLike,
        top_logprobs: int | None = None,
    ) -> list[response_text_delta_event.Logprob]:
        lgs = self._create_response_logprobs(
            token_ids=token_ids,
            logprobs=logprobs,
            tokenizer=tokenizer,
            top_logprobs=top_logprobs,
        )
        return [
            response_text_delta_event.Logprob(
                token=lg.token,
                logprob=lg.logprob,
                top_logprobs=[
                    response_text_delta_event.LogprobTopLogprob(
                        token=tl.token, logprob=tl.logprob
                    )
                    for tl in lg.top_logprobs
                ],
            )
            for lg in lgs
        ]

    def _make_response_output_items(
        self,
        request: ResponsesRequest,
        final_output: CompletionOutput,
        tokenizer: TokenizerLike,
    ) -> list[ResponseOutputItem]:
        if self.reasoning_parser:
            try:
                reasoning_parser = self.reasoning_parser(tokenizer)
            except RuntimeError as e:
                logger.exception("Error in reasoning parser creation.")
                raise e

            reasoning, content = reasoning_parser.extract_reasoning(
                final_output.text, request=request
            )
        else:
            reasoning = None
            content = final_output.text

        # Log complete response if output logging is enabled
        if self.enable_log_outputs and self.request_logger:
            output_text = ""
            if content:
                output_text = content
            elif reasoning:
                output_text = f"[reasoning: {reasoning}]"

            if output_text:
                self.request_logger.log_outputs(
                    request_id=request.request_id,
                    outputs=output_text,
                    output_token_ids=final_output.token_ids,
                    finish_reason=final_output.finish_reason,
                    is_streaming=False,
                    delta=False,
                )

        reasoning_item = None
        message_item = None
        if reasoning:
            reasoning_item = ResponseReasoningItem(
                id=f"rs_{random_uuid()}",
                summary=[],
                type="reasoning",
                content=[
                    ResponseReasoningTextContent(text=reasoning, type="reasoning_text")
                ],
                status=None,  # NOTE: Only the last output item has status.
            )
        tool_calls, content = self._parse_tool_calls_from_content(
            request=request,
            tokenizer=tokenizer,
            content=content,
            enable_auto_tools=self.enable_auto_tools,
            tool_parser_cls=self.tool_parser,
        )
        if content:
            output_text = ResponseOutputText(
                text=content,
                annotations=[],  # TODO
                type="output_text",
                logprobs=(
                    self._create_response_logprobs(
                        token_ids=final_output.token_ids,
                        logprobs=final_output.logprobs,
                        tokenizer=tokenizer,
                        top_logprobs=request.top_logprobs,
                    )
                    if request.is_include_output_logprobs()
                    else None
                ),
            )
            message_item = ResponseOutputMessage(
                id=f"msg_{random_uuid()}",
                content=[output_text],
                role="assistant",
                status="completed",
                type="message",
            )
        outputs = []

        if reasoning_item:
            outputs.append(reasoning_item)
        if message_item:
            outputs.append(message_item)
        if tool_calls:
            tool_call_items = [
                ResponseFunctionToolCall(
                    id=f"fc_{random_uuid()}",
                    call_id=f"call_{random_uuid()}",
                    type="function_call",
                    status="completed",
                    name=tool_call.name,
                    arguments=tool_call.arguments,
                )
                for tool_call in tool_calls
            ]
            outputs.extend(tool_call_items)
        return outputs

    def _make_response_output_items_with_harmony(
        self,
        context: HarmonyContext,
    ) -> list[ResponseOutputItem]:
        output_items: list[ResponseOutputItem] = []
        num_init_messages = context.num_init_messages
        for msg in context.messages[num_init_messages:]:
            output_items.extend(parse_output_message(msg))
        # Handle the generation stopped in the middle (if any).
        last_items = parse_remaining_state(context.parser)
        if last_items:
            output_items.extend(last_items)
        return output_items

    def _construct_harmony_system_input_message(
        self, request: ResponsesRequest, with_custom_tools: bool, tool_types: set[str]
    ) -> OpenAIHarmonyMessage:
        reasoning_effort = request.reasoning.effort if request.reasoning else None

        # Extract allowed_tools from MCP tool requests
        allowed_tools_map = _extract_allowed_tools_from_mcp_requests(request.tools)

        # Get filtered tool descriptions first.
        # If get_tool_description returns None (due to filtering), the tool is disabled.
        browser_description = (
            self.tool_server.get_tool_description(
                "browser", allowed_tools_map.get("web_search_preview")
            )
            if "web_search_preview" in tool_types
            and self.tool_server is not None
            and self.tool_server.has_tool("browser")
            else None
        )
        python_description = (
            self.tool_server.get_tool_description(
                "python", allowed_tools_map.get("code_interpreter")
            )
            if "code_interpreter" in tool_types
            and self.tool_server is not None
            and self.tool_server.has_tool("python")
            else None
        )
        container_description = (
            self.tool_server.get_tool_description(
                "container", allowed_tools_map.get("container")
            )
            if "container" in tool_types
            and self.tool_server is not None
            and self.tool_server.has_tool("container")
            else None
        )

        sys_msg = get_system_message(
            reasoning_effort=reasoning_effort,
            browser_description=browser_description,
            python_description=python_description,
            container_description=container_description,
            instructions=request.instructions,
            with_custom_tools=with_custom_tools,
        )
        return sys_msg

    def _construct_input_messages_with_harmony(
        self,
        request: ResponsesRequest,
        prev_response: ResponsesResponse | None,
    ) -> list[OpenAIHarmonyMessage]:
        messages: list[OpenAIHarmonyMessage] = []
        if prev_response is None:
            # New conversation.
            tool_types = extract_tool_types(request.tools)
            with_custom_tools = has_custom_tools(tool_types)

            sys_msg = self._construct_harmony_system_input_message(
                request, with_custom_tools, tool_types
            )
            messages.append(sys_msg)
            if with_custom_tools:
                dev_msg = get_developer_message(
                    instructions=request.instructions, tools=request.tools
                )
                messages.append(dev_msg)
            messages += construct_harmony_previous_input_messages(request)

        else:
            # Continue the previous conversation.
            # FIXME(woosuk): Currently, request params like reasoning and
            # instructions are ignored.
            prev_msgs = self.msg_store[prev_response.id]
            # Remove the previous chain-of-thoughts if there is a new "final"
            # message. Note that this also removes these messages from the
            # msg_store.
            if len(prev_msgs) > 0:
                last_msg = prev_msgs[-1]
                assert isinstance(last_msg, OpenAIHarmonyMessage)
                if last_msg.channel == "final":
                    prev_final_msg_idx = -1
                    for i in range(len(prev_msgs) - 2, -1, -1):
                        prev_msg_i = prev_msgs[i]
                        assert isinstance(prev_msg_i, OpenAIHarmonyMessage)
                        if prev_msg_i.channel == "final":
                            prev_final_msg_idx = i
                            break
                    recent_turn_msgs = prev_msgs[prev_final_msg_idx + 1 :]
                    del prev_msgs[prev_final_msg_idx + 1 :]
                    for msg in recent_turn_msgs:
                        assert isinstance(msg, OpenAIHarmonyMessage)
                        if msg.channel != "analysis":
                            prev_msgs.append(msg)
            messages.extend(prev_msgs)
        # Append the new input.
        # Responses API supports simple text inputs without chat format.
        if isinstance(request.input, str):
            messages.append(get_user_message(request.input))
        else:
            if prev_response is not None:
                prev_outputs = copy(prev_response.output)
            else:
                prev_outputs = []
            for response_msg in request.input:
                messages.append(parse_response_input(response_msg, prev_outputs))
                # User passes in a tool call request and its output. We need
                # to add the tool call request to prev_outputs so that the
                # parse_response_input can find the tool call request when
                # parsing the tool call output.
                if isinstance(response_msg, ResponseFunctionToolCall):
                    prev_outputs.append(response_msg)
        return messages

    async def _run_background_request_stream(
        self,
        request: ResponsesRequest,
        *args,
        **kwargs,
    ):
        event_deque: deque[StreamingResponsesResponse] = deque()
        new_event_signal = asyncio.Event()
        self.event_store[request.request_id] = (event_deque, new_event_signal)
        response = None
        try:
            generator = self.responses_stream_generator(request, *args, **kwargs)
            async for event in generator:
                event_deque.append(event)
                new_event_signal.set()  # Signal new event available
        except GenerationError as e:
            response = self._convert_generation_error_to_response(e)
        except Exception as e:
            logger.exception("Background request failed for %s", request.request_id)
            response = self.create_error_response(e)
        finally:
            new_event_signal.set()

        if response is not None and isinstance(response, ErrorResponse):
            # If the request has failed, update the status to "failed".
            response_id = request.request_id
            async with self.response_store_lock:
                stored_response = self.response_store.get(response_id)
                assert stored_response is not None
                if stored_response.status not in ("completed", "cancelled"):
                    stored_response.status = "failed"

    async def _run_background_request(
        self,
        request: ResponsesRequest,
        *args,
        **kwargs,
    ):
        try:
            response = await self.responses_full_generator(request, *args, **kwargs)
        except GenerationError as e:
            response = self._convert_generation_error_to_response(e)
        except Exception as e:
            logger.exception("Background request failed for %s", request.request_id)
            response = self.create_error_response(e)

        if isinstance(response, ErrorResponse):
            # If the request has failed, update the status to "failed".
            response_id = request.request_id
            async with self.response_store_lock:
                stored_response = self.response_store.get(response_id)
                assert stored_response is not None
                if stored_response.status not in ("completed", "cancelled"):
                    stored_response.status = "failed"

    async def responses_background_stream_generator(
        self,
        response_id: str,
        starting_after: int | None = None,
    ) -> AsyncGenerator[StreamingResponsesResponse, None]:
        if response_id not in self.event_store:
            raise VLLMValidationError(
                f"Unknown response_id: {response_id}",
                parameter="response_id",
                value=response_id,
            )

        event_deque, new_event_signal = self.event_store[response_id]
        start_index = 0 if starting_after is None else starting_after + 1
        current_index = start_index

        while True:
            new_event_signal.clear()

            # Yield existing events from start_index
            while current_index < len(event_deque):
                event = event_deque[current_index]
                yield event
                if getattr(event, "type", "unknown") == "response.completed":
                    return
                current_index += 1

            await new_event_signal.wait()

    async def retrieve_responses(
        self,
        response_id: str,
        starting_after: int | None,
        stream: bool | None,
    ) -> (
        ErrorResponse
        | ResponsesResponse
        | AsyncGenerator[StreamingResponsesResponse, None]
    ):
        async with self.response_store_lock:
            response = self.response_store.get(response_id)

        if response is None:
            return self._make_not_found_error(response_id)

        if stream:
            return self.responses_background_stream_generator(
                response_id,
                starting_after,
            )
        return response

    async def cancel_responses(
        self,
        response_id: str,
    ) -> ErrorResponse | ResponsesResponse:
        async with self.response_store_lock:
            response = self.response_store.get(response_id)
            if response is None:
                return self._make_not_found_error(response_id)

            prev_status = response.status
            if prev_status not in ("queued", "in_progress"):
                return self.create_error_response(
                    err_type="invalid_request_error",
                    message="Cannot cancel a synchronous response.",
                    param="response_id",
                )

            # Update the status to "cancelled".
            response.status = "cancelled"

        # Abort the request.
        if task := self.background_tasks.get(response_id):
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                logger.exception("Background task for %s was cancelled", response_id)
        return response

    def _make_not_found_error(self, response_id: str) -> ErrorResponse:
        return self.create_error_response(
            err_type="invalid_request_error",
            message=f"Response with id '{response_id}' not found.",
            status_code=HTTPStatus.NOT_FOUND,
            param="response_id",
        )

    def _make_store_not_supported_error(self) -> ErrorResponse:
        return self.create_error_response(
            err_type="invalid_request_error",
            message=(
                "`store=True` (default) is not supported. Please set "
                "`store=False` in Responses API or set "
                "`VLLM_ENABLE_RESPONSES_API_STORE=1` in the env var when "
                "starting the vLLM server."
            ),
            status_code=HTTPStatus.BAD_REQUEST,
            param="store",
        )

    async def _process_simple_streaming_events(
        self,
        request: ResponsesRequest,
        sampling_params: SamplingParams,
        result_generator: AsyncIterator[ConversationContext | None],
        context: ConversationContext,
        model_name: str,
        tokenizer: TokenizerLike,
        request_metadata: RequestResponseMetadata,
        created_time: int,
        _increment_sequence_number_and_return: Callable[
            [StreamingResponsesResponse], StreamingResponsesResponse
        ],
    ) -> AsyncGenerator[StreamingResponsesResponse, None]:
        current_content_index = 0
        current_output_index = 0
        current_item_id = ""
        reasoning_parser = None
        if self.reasoning_parser:
            reasoning_parser = self.reasoning_parser(tokenizer)
        previous_text = ""
        previous_token_ids: list[int] = []
        first_delta_sent = False
        previous_delta_messages: list[DeltaMessage] = []
        async for ctx in result_generator:
            assert isinstance(ctx, SimpleContext)
            if ctx.last_output is None:
                continue
            if ctx.last_output.outputs:
                output = ctx.last_output.outputs[0]
                # finish_reason='error' indicates a retryable error
                self._raise_if_error(output.finish_reason, request.request_id)
                if reasoning_parser:
                    delta_message = reasoning_parser.extract_reasoning_streaming(
                        previous_text=previous_text,
                        current_text=previous_text + output.text,
                        delta_text=output.text,
                        previous_token_ids=previous_token_ids,
                        current_token_ids=previous_token_ids + output.token_ids,
                        delta_token_ids=output.token_ids,
                    )
                else:
                    delta_message = DeltaMessage(
                        content=output.text,
                    )
                previous_text += output.text
                previous_token_ids += output.token_ids
                if not delta_message:
                    continue
                if not first_delta_sent:
                    current_item_id = str(uuid.uuid4())
                    if delta_message.reasoning:
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemAddedEvent(
                                type="response.output_item.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=ResponseReasoningItem(
                                    type="reasoning",
                                    id=current_item_id,
                                    summary=[],
                                    status="in_progress",
                                ),
                            )
                        )
                    else:
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemAddedEvent(
                                type="response.output_item.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=ResponseOutputMessage(
                                    id=current_item_id,
                                    type="message",
                                    role="assistant",
                                    content=[],
                                    status="in_progress",
                                ),
                            )
                        )
                    yield _increment_sequence_number_and_return(
                        ResponseContentPartAddedEvent(
                            type="response.content_part.added",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            content_index=current_content_index,
                            part=ResponseOutputText(
                                type="output_text",
                                text="",
                                annotations=[],
                                logprobs=[],
                            ),
                        )
                    )
                    current_content_index += 1
                    first_delta_sent = True
                # todo(kebe7jun) tool call support

                # check delta message and previous delta message are
                # same as content or reasoning content
                if (
                    previous_delta_messages
                    and previous_delta_messages[-1].reasoning is not None
                    and delta_message.content is not None
                ):
                    # from reasoning to normal content, send done
                    # event for reasoning
                    reason_content = "".join(
                        pm.reasoning
                        for pm in previous_delta_messages
                        if pm.reasoning is not None
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseReasoningTextDoneEvent(
                            type="response.reasoning_text.done",
                            item_id=current_item_id,
                            sequence_number=-1,
                            output_index=current_output_index,
                            content_index=current_content_index,
                            text=reason_content,
                        )
                    )
                    current_content_index = 0
                    reasoning_item = ResponseReasoningItem(
                        type="reasoning",
                        content=[
                            ResponseReasoningTextContent(
                                text=reason_content,
                                type="reasoning_text",
                            ),
                        ],
                        status="completed",
                        id=current_item_id,
                        summary=[],
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseOutputItemDoneEvent(
                            type="response.output_item.done",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item=reasoning_item,
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseOutputItemAddedEvent(
                            type="response.output_item.added",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item=ResponseOutputMessage(
                                id=current_item_id,
                                type="message",
                                role="assistant",
                                content=[],
                                status="in_progress",
                            ),
                        )
                    )
                    current_output_index += 1
                    current_item_id = str(uuid.uuid4())
                    yield _increment_sequence_number_and_return(
                        ResponseContentPartAddedEvent(
                            type="response.content_part.added",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            content_index=current_content_index,
                            part=ResponseOutputText(
                                type="output_text",
                                text="",
                                annotations=[],
                                logprobs=[],
                            ),
                        )
                    )
                    current_content_index += 1
                    # reset previous delta messages
                    previous_delta_messages = []

                if delta_message.reasoning is not None:
                    yield _increment_sequence_number_and_return(
                        ResponseReasoningTextDeltaEvent(
                            type="response.reasoning_text.delta",
                            sequence_number=-1,
                            content_index=current_content_index,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            delta=delta_message.reasoning,
                        )
                    )
                elif delta_message.content is not None:
                    yield _increment_sequence_number_and_return(
                        ResponseTextDeltaEvent(
                            type="response.output_text.delta",
                            sequence_number=-1,
                            content_index=current_content_index,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            delta=delta_message.content,
                            logprobs=(
                                self._create_stream_response_logprobs(
                                    token_ids=output.token_ids,
                                    logprobs=output.logprobs,
                                    tokenizer=tokenizer,
                                    top_logprobs=request.top_logprobs,
                                )
                                if request.is_include_output_logprobs()
                                else []
                            ),
                        )
                    )
                current_content_index += 1

                previous_delta_messages.append(delta_message)
        if previous_delta_messages:
            if previous_delta_messages[-1].reasoning is not None:
                reason_content = "".join(
                    pm.reasoning
                    for pm in previous_delta_messages
                    if pm.reasoning is not None
                )
                yield _increment_sequence_number_and_return(
                    ResponseReasoningTextDoneEvent(
                        type="response.reasoning_text.done",
                        item_id=current_item_id,
                        sequence_number=-1,
                        output_index=current_output_index,
                        content_index=current_content_index,
                        text=reason_content,
                    )
                )
                current_content_index += 1
                reasoning_item = ResponseReasoningItem(
                    type="reasoning",
                    content=[
                        ResponseReasoningTextContent(
                            text=reason_content,
                            type="reasoning_text",
                        ),
                    ],
                    status="completed",
                    id=current_item_id,
                    summary=[],
                )
                yield _increment_sequence_number_and_return(
                    ResponseOutputItemDoneEvent(
                        type="response.output_item.done",
                        sequence_number=-1,
                        output_index=current_output_index,
                        item=reasoning_item,
                    )
                )
            elif previous_delta_messages[-1].content is not None:
                final_content = "".join(
                    pm.content
                    for pm in previous_delta_messages
                    if pm.content is not None
                )
                yield _increment_sequence_number_and_return(
                    ResponseTextDoneEvent(
                        type="response.output_text.done",
                        sequence_number=-1,
                        output_index=current_output_index,
                        content_index=current_content_index,
                        text=final_content,
                        logprobs=[],
                        item_id=current_item_id,
                    )
                )
                current_content_index += 1
                part = ResponseOutputText(
                    text=final_content,
                    type="output_text",
                    annotations=[],
                )
                yield _increment_sequence_number_and_return(
                    ResponseContentPartDoneEvent(
                        type="response.content_part.done",
                        sequence_number=-1,
                        item_id=current_item_id,
                        output_index=current_output_index,
                        content_index=current_content_index,
                        part=part,
                    )
                )
                current_content_index += 1
                item = ResponseOutputMessage(
                    type="message",
                    role="assistant",
                    content=[
                        part,
                    ],
                    status="completed",
                    id=current_item_id,
                    summary=[],
                )
                yield _increment_sequence_number_and_return(
                    ResponseOutputItemDoneEvent(
                        type="response.output_item.done",
                        sequence_number=-1,
                        output_index=current_output_index,
                        item=item,
                    )
                )

    async def _process_harmony_streaming_events(
        self,
        request: ResponsesRequest,
        sampling_params: SamplingParams,
        result_generator: AsyncIterator[ConversationContext | None],
        context: ConversationContext,
        model_name: str,
        tokenizer: TokenizerLike,
        request_metadata: RequestResponseMetadata,
        created_time: int,
        _increment_sequence_number_and_return: Callable[
            [StreamingResponsesResponse], StreamingResponsesResponse
        ],
    ) -> AsyncGenerator[StreamingResponsesResponse, None]:
        current_content_index = -1
        current_output_index = 0
        current_item_id: str = ""
        sent_output_item_added = False
        is_first_function_call_delta = False
        async for ctx in result_generator:
            assert isinstance(ctx, StreamingHarmonyContext)

            # finish_reason='error' indicates a retryable error
            self._raise_if_error(ctx.finish_reason, request.request_id)

            if ctx.is_expecting_start():
                current_output_index += 1
                sent_output_item_added = False
                is_first_function_call_delta = False
                if len(ctx.parser.messages) > 0:
                    previous_item = ctx.parser.messages[-1]
                    if previous_item.recipient is not None:
                        # Deal with tool call
                        if previous_item.recipient.startswith("functions."):
                            function_name = previous_item.recipient[len("functions.") :]
                            yield _increment_sequence_number_and_return(
                                ResponseFunctionCallArgumentsDoneEvent(
                                    type="response.function_call_arguments.done",
                                    arguments=previous_item.content[0].text,
                                    name=function_name,
                                    item_id=current_item_id,
                                    output_index=current_output_index,
                                    sequence_number=-1,
                                )
                            )
                            function_call_item = ResponseFunctionToolCall(
                                type="function_call",
                                arguments=previous_item.content[0].text,
                                name=function_name,
                                item_id=current_item_id,
                                output_index=current_output_index,
                                sequence_number=-1,
                                call_id=f"fc_{random_uuid()}",
                                status="completed",
                            )
                            yield _increment_sequence_number_and_return(
                                ResponseOutputItemDoneEvent(
                                    type="response.output_item.done",
                                    sequence_number=-1,
                                    output_index=current_output_index,
                                    item=function_call_item,
                                )
                            )
                    elif previous_item.channel == "analysis":
                        content = ResponseReasoningTextContent(
                            text=previous_item.content[0].text,
                            type="reasoning_text",
                        )
                        reasoning_item = ResponseReasoningItem(
                            type="reasoning",
                            content=[content],
                            status="completed",
                            id=current_item_id,
                            summary=[],
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseReasoningTextDoneEvent(
                                type="response.reasoning_text.done",
                                item_id=current_item_id,
                                sequence_number=-1,
                                output_index=current_output_index,
                                content_index=current_content_index,
                                text=previous_item.content[0].text,
                            )
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseReasoningPartDoneEvent(
                                type="response.reasoning_part.done",
                                sequence_number=-1,
                                item_id=current_item_id,
                                output_index=current_output_index,
                                content_index=current_content_index,
                                part=content,
                            )
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemDoneEvent(
                                type="response.output_item.done",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=reasoning_item,
                            )
                        )
                    elif previous_item.channel == "final":
                        text_content = ResponseOutputText(
                            type="output_text",
                            text=previous_item.content[0].text,
                            annotations=[],
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseTextDoneEvent(
                                type="response.output_text.done",
                                sequence_number=-1,
                                output_index=current_output_index,
                                content_index=current_content_index,
                                text=previous_item.content[0].text,
                                logprobs=[],
                                item_id=current_item_id,
                            )
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseContentPartDoneEvent(
                                type="response.content_part.done",
                                sequence_number=-1,
                                item_id=current_item_id,
                                output_index=current_output_index,
                                content_index=current_content_index,
                                part=text_content,
                            )
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemDoneEvent(
                                type="response.output_item.done",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=ResponseOutputMessage(
                                    id=current_item_id,
                                    type="message",
                                    role="assistant",
                                    content=[text_content],
                                    status="completed",
                                ),
                            )
                        )

            # stream the output of a harmony message
            if ctx.parser.last_content_delta:
                if (
                    ctx.parser.current_channel == "final"
                    and ctx.parser.current_recipient is None
                ):
                    if not sent_output_item_added:
                        sent_output_item_added = True
                        current_item_id = f"msg_{random_uuid()}"
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemAddedEvent(
                                type="response.output_item.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=ResponseOutputMessage(
                                    id=current_item_id,
                                    type="message",
                                    role="assistant",
                                    content=[],
                                    status="in_progress",
                                ),
                            )
                        )
                        current_content_index += 1
                        yield _increment_sequence_number_and_return(
                            ResponseContentPartAddedEvent(
                                type="response.content_part.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item_id=current_item_id,
                                content_index=current_content_index,
                                part=ResponseOutputText(
                                    type="output_text",
                                    text="",
                                    annotations=[],
                                    logprobs=[],
                                ),
                            )
                        )
                    yield _increment_sequence_number_and_return(
                        ResponseTextDeltaEvent(
                            type="response.output_text.delta",
                            sequence_number=-1,
                            content_index=current_content_index,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            delta=ctx.parser.last_content_delta,
                            # TODO, use logprobs from ctx.last_request_output
                            logprobs=[],
                        )
                    )
                elif (
                    ctx.parser.current_channel == "analysis"
                    and ctx.parser.current_recipient is None
                ):
                    if not sent_output_item_added:
                        sent_output_item_added = True
                        current_item_id = f"msg_{random_uuid()}"
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemAddedEvent(
                                type="response.output_item.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=ResponseReasoningItem(
                                    type="reasoning",
                                    id=current_item_id,
                                    summary=[],
                                    status="in_progress",
                                ),
                            )
                        )
                        current_content_index += 1
                        yield _increment_sequence_number_and_return(
                            ResponseReasoningPartAddedEvent(
                                type="response.reasoning_part.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item_id=current_item_id,
                                content_index=current_content_index,
                                part=ResponseReasoningTextContent(
                                    text="",
                                    type="reasoning_text",
                                ),
                            )
                        )
                    yield _increment_sequence_number_and_return(
                        ResponseReasoningTextDeltaEvent(
                            type="response.reasoning_text.delta",
                            item_id=current_item_id,
                            output_index=current_output_index,
                            content_index=current_content_index,
                            delta=ctx.parser.last_content_delta,
                            sequence_number=-1,
                        )
                    )
                # built-in tools will be triggered on the analysis channel
                # However, occasionally built-in tools will
                # still be output to commentary.
                elif (
                    ctx.parser.current_channel == "commentary"
                    or ctx.parser.current_channel == "analysis"
                ) and ctx.parser.current_recipient == "python":
                    if not sent_output_item_added:
                        sent_output_item_added = True
                        current_item_id = f"tool_{random_uuid()}"
                        yield _increment_sequence_number_and_return(
                            ResponseOutputItemAddedEvent(
                                type="response.output_item.added",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item=ResponseCodeInterpreterToolCallParam(
                                    type="code_interpreter_call",
                                    id=current_item_id,
                                    code=None,
                                    container_id="auto",
                                    outputs=None,
                                    status="in_progress",
                                ),
                            )
                        )
                        yield _increment_sequence_number_and_return(
                            ResponseCodeInterpreterCallInProgressEvent(
                                type="response.code_interpreter_call.in_progress",
                                sequence_number=-1,
                                output_index=current_output_index,
                                item_id=current_item_id,
                            )
                        )
                    yield _increment_sequence_number_and_return(
                        ResponseCodeInterpreterCallCodeDeltaEvent(
                            type="response.code_interpreter_call_code.delta",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            delta=ctx.parser.last_content_delta,
                        )
                    )

            # stream tool call outputs
            if ctx.is_assistant_action_turn() and len(ctx.parser.messages) > 0:
                previous_item = ctx.parser.messages[-1]
                if (
                    self.tool_server is not None
                    and self.tool_server.has_tool("browser")
                    and previous_item.recipient is not None
                    and previous_item.recipient.startswith("browser.")
                ):
                    function_name = previous_item.recipient[len("browser.") :]
                    action = None
                    parsed_args = json.loads(previous_item.content[0].text)
                    if function_name == "search":
                        action = response_function_web_search.ActionSearch(
                            type="search",
                            query=parsed_args["query"],
                        )
                    elif function_name == "open":
                        action = response_function_web_search.ActionOpenPage(
                            type="open_page",
                            # TODO: translate to url
                            url=f"cursor:{parsed_args.get('cursor', '')}",
                        )
                    elif function_name == "find":
                        action = response_function_web_search.ActionFind(
                            type="find",
                            pattern=parsed_args["pattern"],
                            # TODO: translate to url
                            url=f"cursor:{parsed_args.get('cursor', '')}",
                        )
                    else:
                        raise ValueError(f"Unknown function name: {function_name}")

                    current_item_id = f"tool_{random_uuid()}"
                    yield _increment_sequence_number_and_return(
                        ResponseOutputItemAddedEvent(
                            type="response.output_item.added",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item=response_function_web_search.ResponseFunctionWebSearch(
                                # TODO: generate a unique id for web search call
                                type="web_search_call",
                                id=current_item_id,
                                action=action,
                                status="in_progress",
                            ),
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseWebSearchCallInProgressEvent(
                            type="response.web_search_call.in_progress",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseWebSearchCallSearchingEvent(
                            type="response.web_search_call.searching",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                        )
                    )

                    # enqueue
                    yield _increment_sequence_number_and_return(
                        ResponseWebSearchCallCompletedEvent(
                            type="response.web_search_call.completed",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseOutputItemDoneEvent(
                            type="response.output_item.done",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item=ResponseFunctionWebSearch(
                                type="web_search_call",
                                id=current_item_id,
                                action=action,
                                status="completed",
                            ),
                        )
                    )

                if (
                    self.tool_server is not None
                    and self.tool_server.has_tool("python")
                    and previous_item.recipient is not None
                    and previous_item.recipient.startswith("python")
                ):
                    yield _increment_sequence_number_and_return(
                        ResponseCodeInterpreterCallCodeDoneEvent(
                            type="response.code_interpreter_call_code.done",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                            code=previous_item.content[0].text,
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseCodeInterpreterCallInterpretingEvent(
                            type="response.code_interpreter_call.interpreting",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseCodeInterpreterCallCompletedEvent(
                            type="response.code_interpreter_call.completed",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item_id=current_item_id,
                        )
                    )
                    yield _increment_sequence_number_and_return(
                        ResponseOutputItemDoneEvent(
                            type="response.output_item.done",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item=ResponseCodeInterpreterToolCallParam(
                                type="code_interpreter_call",
                                id=current_item_id,
                                code=previous_item.content[0].text,
                                container_id="auto",
                                # TODO: add outputs here
                                outputs=[],
                                status="completed",
                            ),
                        )
                    )
            # developer tools will be triggered on the commentary channel
            # and recipient starts with "functions.TOOL_NAME"
            if (
                ctx.parser.current_channel == "commentary"
                and ctx.parser.current_recipient
                and ctx.parser.current_recipient.startswith("functions.")
            ):
                if is_first_function_call_delta is False:
                    is_first_function_call_delta = True
                    fc_name = ctx.parser.current_recipient[len("functions.") :]
                    tool_call_item = ResponseFunctionToolCall(
                        name=fc_name,
                        type="function_call",
                        id=current_item_id,
                        call_id=f"call_{random_uuid()}",
                        arguments="",
                        status="in_progress",
                    )
                    current_item_id = f"fc_{random_uuid()}"
                    yield _increment_sequence_number_and_return(
                        ResponseOutputItemAddedEvent(
                            type="response.output_item.added",
                            sequence_number=-1,
                            output_index=current_output_index,
                            item=tool_call_item,
                        )
                    )
                else:
                    yield _increment_sequence_number_and_return(
                        ResponseFunctionCallArgumentsDeltaEvent(
                            item_id=current_item_id,
                            delta=ctx.parser.last_content_delta,
                            output_index=current_output_index,
                            sequence_number=-1,
                            type="response.function_call_arguments.delta",
                        )
                    )

    async def responses_stream_generator(
        self,
        request: ResponsesRequest,
        sampling_params: SamplingParams,
        result_generator: AsyncIterator[ConversationContext | None],
        context: ConversationContext,
        model_name: str,
        tokenizer: TokenizerLike,
        request_metadata: RequestResponseMetadata,
        created_time: int | None = None,
    ) -> AsyncGenerator[StreamingResponsesResponse, None]:
        # TODO:
        # 1. Handle disconnect

        created_time = created_time or int(time.time())

        sequence_number = 0

        def _increment_sequence_number_and_return(
            event: StreamingResponsesResponse,
        ) -> StreamingResponsesResponse:
            nonlocal sequence_number
            # Set sequence_number if the event has this attribute
            if hasattr(event, "sequence_number"):
                event.sequence_number = sequence_number
            sequence_number += 1
            return event

        async with AsyncExitStack() as exit_stack:
            processer = None
            if self.use_harmony:
                # TODO: in streaming, we noticed this bug:
                # https://github.com/vllm-project/vllm/issues/25697
                await self._initialize_tool_sessions(request, context, exit_stack)
                processer = self._process_harmony_streaming_events
            else:
                processer = self._process_simple_streaming_events
            # TODO Hanchen make sampling params to include the structural tag

            initial_response = ResponsesResponse.from_request(
                request,
                sampling_params,
                model_name=model_name,
                created_time=created_time,
                output=[],
                status="in_progress",
                usage=None,
            ).model_dump()
            yield _increment_sequence_number_and_return(
                ResponseCreatedEvent(
                    type="response.created",
                    sequence_number=-1,
                    response=initial_response,
                )
            )
            yield _increment_sequence_number_and_return(
                ResponseInProgressEvent(
                    type="response.in_progress",
                    sequence_number=-1,
                    response=initial_response,
                )
            )

            try:
                async for event_data in processer(
                    request,
                    sampling_params,
                    result_generator,
                    context,
                    model_name,
                    tokenizer,
                    request_metadata,
                    created_time,
                    _increment_sequence_number_and_return,
                ):
                    yield event_data
            except GenerationError as e:
                error_json = self._convert_generation_error_to_streaming_response(e)
                yield _increment_sequence_number_and_return(
                    TypeAdapter(StreamingResponsesResponse).validate_json(error_json)
                )
                return

            async def empty_async_generator():
                # A hack to trick Python to think this is a generator but
                # in fact it immediately returns.
                if False:
                    yield

            final_response = await self.responses_full_generator(
                request,
                sampling_params,
                empty_async_generator(),
                context,
                model_name,
                tokenizer,
                request_metadata,
                created_time=created_time,
            )
            yield _increment_sequence_number_and_return(
                ResponseCompletedEvent(
                    type="response.completed",
                    sequence_number=-1,
                    response=final_response,
                )
            )
```

---

## serving_transcription - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/openai/serving_transcription/

**Contents:**
- vllm.entrypoints.openai.serving_transcription ¶
- logger module-attribute ¶
- OpenAIServingTranscription ¶
  - __init__ ¶
  - create_transcription async ¶
  - transcription_stream_generator async ¶
- OpenAIServingTranslation ¶
  - __init__ ¶
  - create_translation async ¶
  - translation_stream_generator async ¶

Bases: OpenAISpeechToText

Handles transcription requests.

Transcription API similar to OpenAI's API.

See https://platform.openai.com/docs/api-reference/audio/createTranscription for the API specification. This API mimics the OpenAI transcription API.

Bases: OpenAISpeechToText

Handles translation requests.

Translation API similar to OpenAI's API.

See https://platform.openai.com/docs/api-reference/audio/createTranslation for the API specification. This API mimics the OpenAI translation API.

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
```

Example 4 (python):
```python
class OpenAIServingTranscription(OpenAISpeechToText):
    """Handles transcription requests."""

    def __init__(
        self,
        engine_client: EngineClient,
        models: OpenAIServingModels,
        *,
        request_logger: RequestLogger | None,
        return_tokens_as_token_ids: bool = False,
        log_error_stack: bool = False,
        enable_force_include_usage: bool = False,
    ):
        super().__init__(
            engine_client=engine_client,
            models=models,
            request_logger=request_logger,
            return_tokens_as_token_ids=return_tokens_as_token_ids,
            task_type="transcribe",
            log_error_stack=log_error_stack,
            enable_force_include_usage=enable_force_include_usage,
        )

    async def create_transcription(
        self, audio_data: bytes, request: TranscriptionRequest, raw_request: Request
    ) -> (
        TranscriptionResponse
        | TranscriptionResponseVerbose
        | AsyncGenerator[str, None]
        | ErrorResponse
    ):
        """Transcription API similar to OpenAI's API.

        See https://platform.openai.com/docs/api-reference/audio/createTranscription
        for the API specification. This API mimics the OpenAI transcription API.
        """
        return await self._create_speech_to_text(
            audio_data=audio_data,
            request=request,
            raw_request=raw_request,
            response_class=(
                TranscriptionResponseVerbose
                if request.response_format == "verbose_json"
                else TranscriptionResponse
            ),
            stream_generator_method=self.transcription_stream_generator,
        )

    async def transcription_stream_generator(
        self,
        request: TranscriptionRequest,
        result_generator: list[AsyncGenerator[RequestOutput, None]],
        request_id: str,
        request_metadata: RequestResponseMetadata,
        audio_duration_s: float,
    ) -> AsyncGenerator[str, None]:
        generator = self._speech_to_text_stream_generator(
            request=request,
            list_result_generator=result_generator,
            request_id=request_id,
            request_metadata=request_metadata,
            audio_duration_s=audio_duration_s,
            chunk_object_type="transcription.chunk",
            response_stream_choice_class=TranscriptionResponseStreamChoice,
            stream_response_class=TranscriptionStreamResponse,
        )
        async for chunk in generator:
            yield chunk
```

---

## serving - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/pooling/serving/

**Contents:**
- vllm.entrypoints.pooling.pooling.serving ¶
- logger module-attribute ¶
- OpenAIServingPooling ¶
  - chat_template instance-attribute ¶
  - chat_template_content_format instance-attribute ¶
  - supported_tasks instance-attribute ¶
  - trust_request_chat_template instance-attribute ¶
  - __init__ ¶
  - _build_render_config ¶
  - create_pooling async ¶

See https://platform.openai.com/docs/api-reference/embeddings/create for the API specification. This API mimics the OpenAI Embedding API.

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
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
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
```

Example 4 (python):
```python
class OpenAIServingPooling(OpenAIServing):
    def __init__(
        self,
        engine_client: EngineClient,
        models: OpenAIServingModels,
        *,
        supported_tasks: tuple[SupportedTask, ...],
        request_logger: RequestLogger | None,
        chat_template: str | None,
        chat_template_content_format: ChatTemplateContentFormatOption,
        trust_request_chat_template: bool = False,
        log_error_stack: bool = False,
    ) -> None:
        super().__init__(
            engine_client=engine_client,
            models=models,
            request_logger=request_logger,
            log_error_stack=log_error_stack,
        )

        self.supported_tasks = supported_tasks
        self.chat_template = chat_template
        self.chat_template_content_format: Final = chat_template_content_format
        self.trust_request_chat_template = trust_request_chat_template

    async def create_pooling(
        self,
        request: PoolingRequest,
        raw_request: Request | None = None,
    ) -> PoolingResponse | IOProcessorResponse | PoolingBytesResponse | ErrorResponse:
        """
        See https://platform.openai.com/docs/api-reference/embeddings/create
        for the API specification. This API mimics the OpenAI Embedding API.
        """
        error_check_ret = await self._check_model(request)
        if error_check_ret is not None:
            return error_check_ret

        model_name = self.models.model_name()

        request_id = f"pool-{self._base_request_id(raw_request)}"
        created_time = int(time.time())

        is_io_processor_request = isinstance(request, IOProcessorRequest)
        try:
            lora_request = self._maybe_get_adapters(request)

            if self.model_config.skip_tokenizer_init:
                tokenizer = None
            else:
                tokenizer = await self.engine_client.get_tokenizer()
            renderer = self._get_renderer(tokenizer)

            if getattr(request, "dimensions", None) is not None:
                return self.create_error_response(
                    "dimensions is currently not supported"
                )

            truncate_prompt_tokens = getattr(request, "truncate_prompt_tokens", None)
            truncate_prompt_tokens = _validate_truncation_size(
                self.max_model_len, truncate_prompt_tokens
            )

            if is_io_processor_request:
                if self.io_processor is None:
                    raise ValueError(
                        "No IOProcessor plugin installed. Please refer "
                        "to the documentation and to the "
                        "'prithvi_geospatial_mae_io_processor' "
                        "offline inference example for more details."
                    )

                validated_prompt = self.io_processor.parse_request(request)

                engine_prompts = await self.io_processor.pre_process_async(
                    prompt=validated_prompt, request_id=request_id
                )
                if not isinstance(engine_prompts, Sequence) or isinstance(
                    engine_prompts, (str, bytes, bytearray)
                ):
                    engine_prompts = [engine_prompts]

            elif isinstance(request, PoolingChatRequest):
                error_check_ret = self._validate_chat_template(
                    request_chat_template=request.chat_template,
                    chat_template_kwargs=request.chat_template_kwargs,
                    trust_request_chat_template=self.trust_request_chat_template,
                )
                if error_check_ret is not None:
                    return error_check_ret

                _, engine_prompts = await self._preprocess_chat(
                    request,
                    tokenizer,
                    request.messages,
                    chat_template=request.chat_template or self.chat_template,
                    chat_template_content_format=self.chat_template_content_format,
                    # In pooling requests, we are not generating tokens,
                    # so there is no need to append extra tokens to the input
                    add_generation_prompt=False,
                    continue_final_message=False,
                    add_special_tokens=request.add_special_tokens,
                )
            elif isinstance(request, PoolingCompletionRequest):
                engine_prompts = await renderer.render_prompt(
                    prompt_or_prompts=request.input,
                    config=self._build_render_config(request),
                )
            else:
                raise ValueError(f"Unsupported request of type {type(request)}")
        except (ValueError, TypeError, jinja2.TemplateError) as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))

        # Schedule the request and get the result generator.
        generators: list[AsyncGenerator[PoolingRequestOutput, None]] = []
        try:
            if is_io_processor_request:
                assert self.io_processor is not None and isinstance(
                    request, IOProcessorRequest
                )
                pooling_params = self.io_processor.validate_or_generate_params()
            else:
                pooling_params = request.to_pooling_params()

            pooling_task: PoolingTask
            if request.task is None:
                if "token_embed" in self.supported_tasks:
                    pooling_task = "token_embed"
                elif "token_classify" in self.supported_tasks:
                    pooling_task = "token_classify"
                elif "plugin" in self.supported_tasks:
                    pooling_task = "plugin"
                else:
                    return self.create_error_response(
                        f"pooling_task must be one of {self.supported_tasks}."
                    )
            else:
                pooling_task = request.task

            if pooling_task not in self.supported_tasks:
                return self.create_error_response(
                    f"Task {pooling_task} is not supported, it"
                    f" must be one of {self.supported_tasks}."
                )

            try:
                pooling_params.verify(pooling_task, self.model_config)
            except ValueError as e:
                return self.create_error_response(str(e))

            for i, engine_prompt in enumerate(engine_prompts):
                request_id_item = f"{request_id}-{i}"

                self._log_inputs(
                    request_id_item,
                    engine_prompt,
                    params=pooling_params,
                    lora_request=lora_request,
                )

                trace_headers = (
                    None
                    if raw_request is None
                    else await self._get_trace_headers(raw_request.headers)
                )

                generator = self.engine_client.encode(
                    engine_prompt,
                    pooling_params,
                    request_id_item,
                    lora_request=lora_request,
                    trace_headers=trace_headers,
                    priority=request.priority,
                )

                generators.append(generator)
        except ValueError as e:
            # TODO: Use a vllm-specific Validation Error
            return self.create_error_response(str(e))

        result_generator = merge_async_iterators(*generators)

        if is_io_processor_request:
            assert self.io_processor is not None
            output = await self.io_processor.post_process_async(
                model_output=result_generator,
                request_id=request_id,
            )
            return self.io_processor.output_to_response(output)

        assert isinstance(request, (PoolingCompletionRequest, PoolingChatRequest))
        num_prompts = len(engine_prompts)

        # Non-streaming response
        final_res_batch: list[PoolingRequestOutput | None]
        final_res_batch = [None] * num_prompts
        try:
            async for i, res in result_generator:
                final_res_batch[i] = res

            assert all(final_res is not None for final_res in final_res_batch)

            final_res_batch_checked = cast(list[PoolingRequestOutput], final_res_batch)

            response = self.request_output_to_pooling_response(
                final_res_batch_checked,
                request_id,
                created_time,
                model_name,
                request.encoding_format,
                request.embed_dtype,
                request.endianness,
            )
        except asyncio.CancelledError:
            return self.create_error_response("Client disconnected")
        except ValueError as e:
            # TODO: Use a vllm-specific Validation Error
            return self.create_error_response(str(e))

        return response

    def request_output_to_pooling_response(
        self,
        final_res_batch: list[PoolingRequestOutput],
        request_id: str,
        created_time: int,
        model_name: str,
        encoding_format: EncodingFormat,
        embed_dtype: EmbedDType,
        endianness: Endianness,
    ) -> PoolingResponse | PoolingBytesResponse:
        def encode_float_base64():
            items: list[PoolingResponseData] = []
            num_prompt_tokens = 0

            for idx, final_res in enumerate(final_res_batch):
                item = PoolingResponseData(
                    index=idx,
                    data=encode_pooling_output(
                        final_res,
                        encoding_format=encoding_format,
                        embed_dtype=embed_dtype,
                        endianness=endianness,
                    ),
                )
                prompt_token_ids = final_res.prompt_token_ids

                items.append(item)
                num_prompt_tokens += len(prompt_token_ids)

            usage = UsageInfo(
                prompt_tokens=num_prompt_tokens,
                total_tokens=num_prompt_tokens,
            )

            return PoolingResponse(
                id=request_id,
                created=created_time,
                model=model_name,
                data=items,
                usage=usage,
            )

        def encode_bytes(bytes_only: bool) -> PoolingBytesResponse:
            content, items, usage = encode_pooling_bytes(
                pooling_outputs=final_res_batch,
                embed_dtype=embed_dtype,
                endianness=endianness,
            )

            headers = (
                None
                if bytes_only
                else {
                    "metadata": json.dumps(
                        {
                            "id": request_id,
                            "created": created_time,
                            "model": model_name,
                            "data": items,
                            "usage": usage,
                        }
                    )
                }
            )

            return PoolingBytesResponse(
                content=content,
                headers=headers,
            )

        if encoding_format == "float" or encoding_format == "base64":
            return encode_float_base64()
        elif encoding_format == "bytes" or encoding_format == "bytes_only":
            return encode_bytes(bytes_only=encoding_format == "bytes_only")
        else:
            assert_never(encoding_format)

    def _build_render_config(self, request: PoolingCompletionRequest) -> RenderConfig:
        return RenderConfig(
            max_length=self.max_model_len,
            truncate_prompt_tokens=request.truncate_prompt_tokens,
            add_special_tokens=request.add_special_tokens,
        )
```

---

## serving - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/classify/serving/

**Contents:**
- vllm.entrypoints.pooling.classify.serving ¶
- logger module-attribute ¶
- ClassificationMixin ¶
  - chat_template instance-attribute ¶
  - chat_template_content_format instance-attribute ¶
  - trust_request_chat_template instance-attribute ¶
  - _build_render_config ¶
  - _build_response ¶
  - _preprocess async ¶
- ServingClassification ¶

Convert model outputs to a formatted classification response with probabilities and labels.

Process classification inputs: tokenize text, resolve adapters, and prepare model-specific inputs.

Bases: ClassificationMixin

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
```

Example 4 (python):
```python
class ClassificationMixin(OpenAIServing):
    chat_template: str | None
    chat_template_content_format: ChatTemplateContentFormatOption
    trust_request_chat_template: bool

    async def _preprocess(
        self,
        ctx: ServeContext,
    ) -> ErrorResponse | None:
        """
        Process classification inputs: tokenize text, resolve adapters,
        and prepare model-specific inputs.
        """
        ctx = cast(ClassificationServeContext, ctx)
        try:
            ctx.tokenizer = await self.engine_client.get_tokenizer()

            request_obj = ctx.request

            if isinstance(request_obj, ClassificationChatRequest):
                chat_request = request_obj
                messages = chat_request.messages
                trust_request_chat_template = getattr(
                    self,
                    "trust_request_chat_template",
                    False,
                )
                ret = self._validate_chat_template(
                    request_chat_template=chat_request.chat_template,
                    chat_template_kwargs=chat_request.chat_template_kwargs,
                    trust_request_chat_template=trust_request_chat_template,
                )
                if ret:
                    return ret

                _, engine_prompts = await self._preprocess_chat(
                    cast(ChatCompletionRequest, chat_request),
                    ctx.tokenizer,
                    messages,
                    chat_template=(
                        chat_request.chat_template
                        or getattr(self, "chat_template", None)
                    ),
                    chat_template_content_format=cast(
                        ChatTemplateContentFormatOption,
                        getattr(self, "chat_template_content_format", "auto"),
                    ),
                    add_generation_prompt=False,
                    continue_final_message=False,
                    add_special_tokens=chat_request.add_special_tokens,
                )
                ctx.engine_prompts = engine_prompts

            elif isinstance(request_obj, ClassificationCompletionRequest):
                completion_request = request_obj
                input_data = completion_request.input
                if input_data in (None, ""):
                    return self.create_error_response(
                        "Input or messages must be provided",
                        status_code=HTTPStatus.BAD_REQUEST,
                    )
                if isinstance(input_data, list) and not input_data:
                    ctx.engine_prompts = []
                    return None

                renderer = self._get_renderer(ctx.tokenizer)
                prompt_input = cast(str | list[str], input_data)
                ctx.engine_prompts = await renderer.render_prompt(
                    prompt_or_prompts=prompt_input,
                    config=self._build_render_config(completion_request),
                )
            else:
                return self.create_error_response(
                    "Invalid classification request type",
                    status_code=HTTPStatus.BAD_REQUEST,
                )

            return None

        except (ValueError, TypeError, jinja2.TemplateError) as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))

    def _build_response(
        self,
        ctx: ServeContext,
    ) -> ClassificationResponse | ErrorResponse:
        """
        Convert model outputs to a formatted classification response
        with probabilities and labels.
        """
        ctx = cast(ClassificationServeContext, ctx)
        items: list[ClassificationData] = []
        num_prompt_tokens = 0

        final_res_batch_checked = cast(list[PoolingRequestOutput], ctx.final_res_batch)

        for idx, final_res in enumerate(final_res_batch_checked):
            classify_res = ClassificationOutput.from_base(final_res.outputs)

            probs = classify_res.probs
            predicted_index = int(np.argmax(probs))
            label = getattr(self.model_config.hf_config, "id2label", {}).get(
                predicted_index
            )

            item = ClassificationData(
                index=idx,
                label=label,
                probs=probs,
                num_classes=len(probs),
            )

            items.append(item)
            prompt_token_ids = final_res.prompt_token_ids
            num_prompt_tokens += len(prompt_token_ids)

        usage = UsageInfo(
            prompt_tokens=num_prompt_tokens,
            total_tokens=num_prompt_tokens,
        )

        return ClassificationResponse(
            id=ctx.request_id,
            created=ctx.created_time,
            model=ctx.model_name,
            data=items,
            usage=usage,
        )

    def _build_render_config(self, request: ClassificationRequest) -> RenderConfig:
        return RenderConfig(
            max_length=self.max_model_len,
            truncate_prompt_tokens=request.truncate_prompt_tokens,
            add_special_tokens=request.add_special_tokens,
        )
```

---

## serving - vLLM

**URL:** https://docs.vllm.ai/en/latest/api/vllm/entrypoints/pooling/embed/serving/

**Contents:**
- vllm.entrypoints.pooling.embed.serving ¶
- logger module-attribute ¶
- EmbeddingMixin ¶
  - max_embed_len instance-attribute ¶
  - supports_chunked_processing instance-attribute ¶
  - __init__ ¶
  - _build_render_config ¶
  - _build_response ¶
  - _collect_batch async ¶
  - _create_single_prompt_generator async ¶

Collect and aggregate batch results with support for chunked processing.

For chunked requests, performs online aggregation to minimize memory usage. For regular requests, collects results normally.

Create a generator for a single prompt using standard processing.

Get the model's effective maximum sequence length for chunking.

Override to support chunked processing.

Process a single prompt using chunked processing.

Check if chunked processing should be used for this request.

Override to support chunked processing for embedding requests.

Bases: EmbeddingMixin

Embedding API similar to OpenAI's API.

See https://platform.openai.com/docs/api-reference/embeddings/create for the API specification. This API mimics the OpenAI Embedding API.

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
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
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
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
469
470
471
472
473
474
475
476
477
478
479
480
481
482
483
484
485
486
487
488
489
490
491
492
493
494
495
496
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
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
```

Example 4 (python):
```python
class EmbeddingMixin(OpenAIServing):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        pooler_config = self.model_config.pooler_config

        # Avoid repeated attribute lookups
        self.supports_chunked_processing = bool(
            pooler_config and pooler_config.enable_chunked_processing
        )
        self.max_embed_len = (
            pooler_config.max_embed_len
            if pooler_config and pooler_config.max_embed_len
            else None
        )

    @override
    async def _preprocess(
        self,
        ctx: ServeContext,
    ) -> ErrorResponse | None:
        ctx = cast(EmbeddingServeContext, ctx)
        try:
            ctx.lora_request = self._maybe_get_adapters(ctx.request)

            tokenizer = await self.engine_client.get_tokenizer()
            renderer = self._get_renderer(tokenizer)

            if isinstance(ctx.request, EmbeddingChatRequest):
                _, ctx.engine_prompts = await self._preprocess_chat(
                    ctx.request,
                    tokenizer,
                    ctx.request.messages,
                    chat_template=ctx.request.chat_template or ctx.chat_template,
                    chat_template_content_format=ctx.chat_template_content_format,
                    add_generation_prompt=ctx.request.add_generation_prompt,
                    continue_final_message=False,
                    add_special_tokens=ctx.request.add_special_tokens,
                )
            else:
                ctx.engine_prompts = await renderer.render_prompt(
                    prompt_or_prompts=ctx.request.input,
                    config=self._build_render_config(ctx.request),
                )
            return None
        except (ValueError, TypeError) as e:
            logger.exception("Error in preprocessing prompt inputs")
            return self.create_error_response(str(e))

    def _build_render_config(self, request: EmbeddingCompletionRequest) -> RenderConfig:
        # Set max_length based on chunked processing capability
        if self._should_use_chunked_processing(request):
            max_length = None
        else:
            max_length = self.max_embed_len or self.max_model_len

        return RenderConfig(
            max_length=max_length,
            truncate_prompt_tokens=request.truncate_prompt_tokens,
            add_special_tokens=request.add_special_tokens,
        )

    @override
    def _build_response(
        self,
        ctx: ServeContext,
    ) -> EmbeddingResponse | Response | ErrorResponse:
        final_res_batch_checked = cast(list[PoolingRequestOutput], ctx.final_res_batch)

        encoding_format: EncodingFormat = ctx.request.encoding_format
        embed_dtype: EmbedDType = ctx.request.embed_dtype
        endianness: Endianness = ctx.request.endianness

        def encode_float_base64():
            items: list[EmbeddingResponseData] = []
            num_prompt_tokens = 0

            for idx, final_res in enumerate(final_res_batch_checked):
                item = EmbeddingResponseData(
                    index=idx,
                    embedding=encode_pooling_output(
                        final_res,
                        encoding_format=encoding_format,
                        embed_dtype=embed_dtype,
                        endianness=endianness,
                    ),
                )
                prompt_token_ids = final_res.prompt_token_ids

                items.append(item)
                num_prompt_tokens += len(prompt_token_ids)

            usage = UsageInfo(
                prompt_tokens=num_prompt_tokens,
                total_tokens=num_prompt_tokens,
            )

            return EmbeddingResponse(
                id=ctx.request_id,
                created=ctx.created_time,
                model=ctx.model_name,
                data=items,
                usage=usage,
            )

        def encode_bytes(bytes_only: bool) -> EmbeddingBytesResponse:
            content, items, usage = encode_pooling_bytes(
                pooling_outputs=final_res_batch_checked,
                embed_dtype=embed_dtype,
                endianness=endianness,
            )

            headers = (
                None
                if bytes_only
                else {
                    "metadata": json.dumps(
                        {
                            "id": ctx.request_id,
                            "created": ctx.created_time,
                            "model": ctx.model_name,
                            "data": items,
                            "usage": usage,
                        }
                    )
                }
            )

            return EmbeddingBytesResponse(content=content, headers=headers)

        if encoding_format == "float" or encoding_format == "base64":
            return encode_float_base64()
        elif encoding_format == "bytes" or encoding_format == "bytes_only":
            return encode_bytes(bytes_only=encoding_format == "bytes_only")
        else:
            assert_never(encoding_format)

    def _get_max_position_embeddings(self) -> int:
        """Get the model's effective maximum sequence length for chunking."""
        return self.model_config.max_model_len

    def _should_use_chunked_processing(self, request) -> bool:
        """Check if chunked processing should be used for this request."""
        return (
            isinstance(request, (EmbeddingCompletionRequest, EmbeddingChatRequest))
            and self.supports_chunked_processing
        )

    async def _process_chunked_request(
        self,
        ctx: EmbeddingServeContext,
        token_ids: list[int],
        pooling_params,
        trace_headers,
        prompt_idx: int,
    ) -> list[AsyncGenerator[PoolingRequestOutput, None]]:
        """Process a single prompt using chunked processing."""
        generators: list[AsyncGenerator[PoolingRequestOutput, None]] = []

        # Split into chunks using max_position_embeddings
        max_pos_embeddings = self._get_max_position_embeddings()
        # Process all chunks for MEAN aggregation
        for chunk_idx, chunk_tokens in enumerate(
            chunk_list(token_ids, max_pos_embeddings)
        ):
            # Create a request ID for this chunk
            chunk_request_id = f"{ctx.request_id}-prompt-{prompt_idx}-chunk-{chunk_idx}"

            # Create engine prompt for this chunk
            chunk_engine_prompt = TokensPrompt(prompt_token_ids=chunk_tokens)

            # Log the chunk
            self._log_inputs(
                chunk_request_id,
                chunk_engine_prompt,
                params=pooling_params,
                lora_request=ctx.lora_request,
            )

            # Create generator for this chunk and wrap it to return indices
            original_generator = self.engine_client.encode(
                chunk_engine_prompt,
                pooling_params,
                chunk_request_id,
                lora_request=ctx.lora_request,
                trace_headers=trace_headers,
                priority=getattr(ctx.request, "priority", 0),
            )

            generators.append(original_generator)

        return generators

    def _validate_input(
        self,
        request,
        input_ids: list[int],
        input_text: str,
    ) -> TokensPrompt:
        """Override to support chunked processing for embedding requests."""
        token_num = len(input_ids)

        # Note: EmbeddingRequest doesn't have max_tokens
        if isinstance(request, (EmbeddingCompletionRequest, EmbeddingChatRequest)):
            # Check if chunked processing is enabled for pooling models
            enable_chunked = self._should_use_chunked_processing(request)

            # Use max_position_embeddings for chunked processing decisions
            max_pos_embeddings = self._get_max_position_embeddings()

            # Determine the effective max length for validation
            if self.max_embed_len is not None:
                # Use max_embed_len for validation instead of max_model_len
                length_type = "maximum embedding input length"
                max_length_value = self.max_embed_len
            else:
                # Fall back to max_model_len validation (original behavior)
                length_type = "maximum context length"
                max_length_value = self.max_model_len

            validation_error_msg = (
                "This model's {length_type} is {max_length_value} tokens. "
                "However, you requested {token_num} tokens in the input for "
                "embedding generation. Please reduce the length of the input."
            )

            chunked_processing_error_msg = (
                "This model's {length_type} is {max_length_value} tokens. "
                "However, you requested {token_num} tokens in the input for "
                "embedding generation. Please reduce the length of the input "
                "or enable chunked processing."
            )

            # Check if input exceeds max length
            if token_num > max_length_value:
                raise ValueError(
                    validation_error_msg.format(
                        length_type=length_type,
                        max_length_value=max_length_value,
                        token_num=token_num,
                    )
                )

            # Check for chunked processing
            # when exceeding max_position_embeddings
            if token_num > max_pos_embeddings:
                if enable_chunked:
                    # Allow long inputs when chunked processing is enabled
                    logger.info(
                        "Input length %s exceeds max_position_embeddings "
                        "%s, will use chunked processing",
                        token_num,
                        max_pos_embeddings,
                    )
                else:
                    raise ValueError(
                        chunked_processing_error_msg.format(
                            length_type="maximum position embeddings length",
                            max_length_value=max_pos_embeddings,
                            token_num=token_num,
                        )
                    )

            return TokensPrompt(prompt=input_text, prompt_token_ids=input_ids)

        # For other request types, use the parent's implementation
        return super()._validate_input(request, input_ids, input_text)

    async def _create_single_prompt_generator(
        self,
        ctx: EmbeddingServeContext,
        engine_prompt: TokensPrompt,
        pooling_params: PoolingParams,
        trace_headers: Mapping[str, str] | None,
        prompt_index: int,
    ) -> AsyncGenerator[RequestOutput | PoolingRequestOutput, None]:
        """Create a generator for a single prompt using standard processing."""
        request_id_item = f"{ctx.request_id}-{prompt_index}"

        self._log_inputs(
            request_id_item,
            engine_prompt,
            params=pooling_params,
            lora_request=ctx.lora_request,
        )

        # Return the original generator without wrapping
        return self.engine_client.encode(
            engine_prompt,
            pooling_params,
            request_id_item,
            lora_request=ctx.lora_request,
            trace_headers=trace_headers,
            priority=getattr(ctx.request, "priority", 0),
        )

    @override
    async def _prepare_generators(
        self,
        ctx: ServeContext,
    ) -> ErrorResponse | None:
        """Override to support chunked processing."""
        ctx = cast(EmbeddingServeContext, ctx)

        # Check if we should use chunked processing
        use_chunked = self._should_use_chunked_processing(ctx.request)

        # If no chunked processing needed, delegate to parent class
        if not use_chunked:
            return await super()._prepare_generators(ctx)

        # Custom logic for chunked processing
        generators: list[
            AsyncGenerator[RequestOutput | PoolingRequestOutput, None]
        ] = []

        try:
            trace_headers = (
                None
                if ctx.raw_request is None
                else await self._get_trace_headers(ctx.raw_request.headers)
            )

            pooling_params = self._create_pooling_params(ctx)
            if isinstance(pooling_params, ErrorResponse):
                return pooling_params

            # Verify and set the task for pooling params
            try:
                pooling_params.verify("embed", self.model_config)
            except ValueError as e:
                return self.create_error_response(str(e))

            if ctx.engine_prompts is None:
                return self.create_error_response("Engine prompts not available")

            max_pos_embeddings = self._get_max_position_embeddings()

            for i, engine_prompt in enumerate(ctx.engine_prompts):
                # Check if this specific prompt needs chunked processing
                if "prompt_token_ids" in engine_prompt:
                    prompt_token_ids = engine_prompt["prompt_token_ids"]
                    if len(prompt_token_ids) > max_pos_embeddings:
                        # Use chunked processing for this prompt
                        chunk_generators = await self._process_chunked_request(
                            ctx,
                            prompt_token_ids,
                            pooling_params,
                            trace_headers,
                            i,
                        )
                        generators.extend(chunk_generators)
                        continue

                # Normal processing for short prompts or non-token prompts
                generator = await self._create_single_prompt_generator(
                    ctx, engine_prompt, pooling_params, trace_headers, i
                )
                generators.append(generator)

            ctx.result_generator = merge_async_iterators(*generators)

            return None

        except Exception as e:
            # TODO: Use a vllm-specific Validation Error
            return self.create_error_response(str(e))

    @override
    async def _collect_batch(
        self,
        ctx: ServeContext,
    ) -> ErrorResponse | None:
        """Collect and aggregate batch results
        with support for chunked processing.

        For chunked requests, performs online aggregation to
        minimize memory usage.
        For regular requests, collects results normally.
        """
        ctx = cast(EmbeddingServeContext, ctx)
        try:
            if ctx.engine_prompts is None:
                return self.create_error_response("Engine prompts not available")

            # Check if we used chunked processing
            use_chunked = self._should_use_chunked_processing(ctx.request)

            if not use_chunked:
                return await super()._collect_batch(ctx=ctx)

            if ctx.result_generator is None:
                return self.create_error_response("Result generator not available")

            # Online aggregation for chunked requests to
            # minimize memory usage
            # Track aggregation state for each prompt
            prompt_aggregators: dict[int, dict[str, Any]] = {}
            short_prompts_results: dict[int, PoolingRequestOutput] = {}

            async for result_idx, result in ctx.result_generator:
                if "-chunk-" in result.request_id:
                    # Extract prompt_idx from chunked request_id
                    parts = result.request_id.split("-")
                    try:
                        prompt_idx = int(parts[parts.index("prompt") + 1])
                    except (ValueError, IndexError):
                        # Fallback: extract from result_idx if parsing fails
                        prompt_idx = result_idx

                    # Initialize aggregator for this prompt if needed
                    if prompt_idx not in prompt_aggregators:
                        prompt_aggregators[prompt_idx] = {
                            "weighted_sum": None,
                            "total_weight": 0,
                            "chunk_count": 0,
                            "request_id": result.request_id.split("-chunk-")[0],
                        }

                    aggregator = prompt_aggregators[prompt_idx]

                    # MEAN pooling with online weighted averaging
                    # Ensure result is PoolingRequestOutput
                    # for embedding processing
                    if not isinstance(result, PoolingRequestOutput):
                        return self.create_error_response(
                            f"Expected PoolingRequestOutput for "
                            f"chunked embedding, got "
                            f"{type(result).__name__}"
                        )

                    # Handle both PoolingOutput and
                    # EmbeddingOutput types
                    if hasattr(result.outputs, "data"):
                        # PoolingOutput case
                        embedding_data = result.outputs.data
                    elif hasattr(result.outputs, "embedding"):
                        # EmbeddingOutput case -
                        # convert embedding list to tensor
                        embedding_data = result.outputs.embedding
                    else:
                        return self.create_error_response(
                            f"Unsupported output type: {type(result.outputs).__name__}"
                        )

                    if not isinstance(embedding_data, torch.Tensor):
                        embedding_data = torch.tensor(
                            embedding_data, dtype=torch.float32
                        )

                    if result.prompt_token_ids is None:
                        return self.create_error_response(
                            "prompt_token_ids cannot be None for chunked processing"
                        )
                    weight = len(result.prompt_token_ids)

                    weighted_embedding = embedding_data.to(dtype=torch.float32) * weight

                    if aggregator["weighted_sum"] is None:
                        # First chunk
                        aggregator["weighted_sum"] = weighted_embedding
                    else:
                        # Accumulate
                        aggregator["weighted_sum"] += weighted_embedding

                    aggregator["total_weight"] += weight
                    aggregator["chunk_count"] += 1
                else:
                    # Non-chunked result - extract prompt_idx from request_id
                    parts = result.request_id.split("-")
                    try:
                        # Last part should be prompt index
                        prompt_idx = int(parts[-1])
                    except (ValueError, IndexError):
                        prompt_idx = result_idx  # Fallback to result_idx

                    short_prompts_results[prompt_idx] = cast(
                        PoolingRequestOutput, result
                    )

            # Finalize aggregated results
            final_res_batch: list[PoolingRequestOutput | EmbeddingRequestOutput] = []
            num_prompts = len(ctx.engine_prompts)

            for prompt_idx in range(num_prompts):
                if prompt_idx in prompt_aggregators:
                    # Finalize MEAN aggregation for this chunked prompt
                    aggregator = prompt_aggregators[prompt_idx]

                    weighted_sum = aggregator["weighted_sum"]
                    total_weight = aggregator["total_weight"]

                    if (
                        weighted_sum is not None
                        and isinstance(weighted_sum, torch.Tensor)
                        and isinstance(total_weight, (int, float))
                        and total_weight > 0
                    ):
                        # Compute final mean embedding
                        final_embedding = weighted_sum / total_weight

                        # Create a PoolingRequestOutput
                        # for the aggregated result
                        pooling_output_data = PoolingOutput(data=final_embedding)

                        # Get original prompt token IDs for this prompt
                        original_prompt = ctx.engine_prompts[prompt_idx]
                        if "prompt_token_ids" not in original_prompt:
                            return self.create_error_response(
                                f"Chunked prompt {prompt_idx} does not contain "
                                "token IDs"
                            )

                        original_token_ids = original_prompt["prompt_token_ids"]

                        pooling_request_output = PoolingRequestOutput(
                            request_id=aggregator["request_id"],
                            prompt_token_ids=original_token_ids,
                            outputs=pooling_output_data,
                            num_cached_tokens=0,
                            finished=True,
                        )

                        final_res_batch.append(pooling_request_output)
                    else:
                        return self.create_error_response(
                            f"Failed to aggregate chunks for prompt {prompt_idx}"
                        )
                elif prompt_idx in short_prompts_results:
                    final_res_batch.append(
                        cast(PoolingRequestOutput, short_prompts_results[prompt_idx])
                    )
                else:
                    return self.create_error_response(
                        f"Result not found for prompt {prompt_idx}"
                    )

            ctx.final_res_batch = cast(
                list[RequestOutput | PoolingRequestOutput], final_res_batch
            )

            return None

        except Exception as e:
            return self.create_error_response(str(e))
```

---

## Setup OpenTelemetry POC - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/opentelemetry/

**Contents:**
- Setup OpenTelemetry POC¶
- Exporter Protocol¶
- Instrumentation of FastAPI¶
- Example materials¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/opentelemetry.

Install OpenTelemetry packages:

Start Jaeger in a docker container:

In a new shell, export Jaeger IP:

Then set vLLM's service name for OpenTelemetry, enable insecure connections to Jaeger and run vLLM:

In a new shell, send requests with trace context from a dummy client

Open Jaeger webui: http://localhost:16686/

In the search pane, select vllm-server service and hit Find Traces. You should get a list of traces, one for each request.

Clicking on a trace will show its spans and their tags. In this demo, each trace has 2 spans. One from the dummy client containing the prompt text and one from vLLM containing metadata about the request.

OpenTelemetry supports either grpc or http/protobuf as the transport protocol for trace data in the exporter. By default, grpc is used. To set http/protobuf as the protocol, configure the OTEL_EXPORTER_OTLP_TRACES_PROTOCOL environment variable as follows:

OpenTelemetry allows automatic instrumentation of FastAPI.

Install the instrumentation library

Run vLLM with opentelemetry-instrument

Send a request to vLLM and find its trace in Jaeger. It should contain spans from FastAPI.

**Examples:**

Example 1 (unknown):
```unknown
pip install \
  'opentelemetry-sdk>=1.26.0,<1.27.0' \
  'opentelemetry-api>=1.26.0,<1.27.0' \
  'opentelemetry-exporter-otlp>=1.26.0,<1.27.0' \
  'opentelemetry-semantic-conventions-ai>=0.4.1,<0.5.0'
```

Example 2 (unknown):
```unknown
pip install \
  'opentelemetry-sdk>=1.26.0,<1.27.0' \
  'opentelemetry-api>=1.26.0,<1.27.0' \
  'opentelemetry-exporter-otlp>=1.26.0,<1.27.0' \
  'opentelemetry-semantic-conventions-ai>=0.4.1,<0.5.0'
```

Example 3 (markdown):
```markdown
# From: https://www.jaegertracing.io/docs/1.57/getting-started/
docker run --rm --name jaeger \
    -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
    -p 6831:6831/udp \
    -p 6832:6832/udp \
    -p 5778:5778 \
    -p 16686:16686 \
    -p 4317:4317 \
    -p 4318:4318 \
    -p 14250:14250 \
    -p 14268:14268 \
    -p 14269:14269 \
    -p 9411:9411 \
    jaegertracing/all-in-one:1.57
```

Example 4 (markdown):
```markdown
# From: https://www.jaegertracing.io/docs/1.57/getting-started/
docker run --rm --name jaeger \
    -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
    -p 6831:6831/udp \
    -p 6832:6832/udp \
    -p 5778:5778 \
    -p 16686:16686 \
    -p 4317:4317 \
    -p 4318:4318 \
    -p 14250:14250 \
    -p 14268:14268 \
    -p 14269:14269 \
    -p 9411:9411 \
    jaegertracing/all-in-one:1.57
```

---

## SkyPilot - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/skypilot/

**Contents:**
- SkyPilot¶
- Prerequisites¶
- Run on a single instance¶
- Scale up to multiple replicas¶
  - Optional: Connect a GUI to the endpoint¶

vLLM can be run and scaled to multiple service replicas on clouds and Kubernetes with SkyPilot, an open-source framework for running LLMs on any cloud. More examples for various open models, such as Llama-3, Mixtral, etc., can be found in SkyPilot AI gallery.

See the vLLM SkyPilot YAML for serving, serving.yaml.

Start the serving the Llama-3 8B model on any of the candidate GPUs listed (L4, A10g, ...):

Check the output of the command. There will be a shareable gradio link (like the last line of the following). Open it in your browser to use the LLaMA model to do the text completion.

Optional: Serve the 70B model instead of the default 8B and use more GPU:

SkyPilot can scale up the service to multiple service replicas with built-in autoscaling, load-balancing and fault-tolerance. You can do it by adding a services section to the YAML file.

Start the serving the Llama-3 8B model on multiple replicas:

Wait until the service is ready:

After the service is READY, you can find a single endpoint for the service and access the service with the endpoint:

To enable autoscaling, you could replace the replicas with the following configs in service:

This will scale the service up to when the QPS exceeds 2 for each replica.

To update the service with the new config:

It is also possible to access the Llama-3 service with a separate GUI frontend, so the user requests send to the GUI will be load-balanced across replicas.

Start the chat web UI:

Then, we can access the GUI at the returned gradio link:

**Examples:**

Example 1 (unknown):
```unknown
pip install skypilot-nightly
sky check
```

Example 2 (unknown):
```unknown
pip install skypilot-nightly
sky check
```

Example 3 (yaml):
```yaml
resources:
  accelerators: {L4, A10g, A10, L40, A40, A100, A100-80GB} # We can use cheaper accelerators for 8B model.
  use_spot: True
  disk_size: 512  # Ensure model checkpoints can fit.
  disk_tier: best
  ports: 8081  # Expose to internet traffic.

envs:
  PYTHONUNBUFFERED: 1
  MODEL_NAME: meta-llama/Meta-Llama-3-8B-Instruct
  HF_TOKEN: <your-huggingface-token>  # Change to your own huggingface token, or use --env to pass.

setup: |
  conda create -n vllm python=3.10 -y
  conda activate vllm

  pip install vllm==0.4.0.post1
  # Install Gradio for web UI.
  pip install gradio openai
  pip install flash-attn==2.5.7

run: |
  conda activate vllm
  echo 'Starting vllm api server...'
  vllm serve $MODEL_NAME \
    --port 8081 \
    --trust-remote-code \
    --tensor-parallel-size $SKYPILOT_NUM_GPUS_PER_NODE \
    2>&1 | tee api_server.log &

  echo 'Waiting for vllm api server to start...'
  while ! `cat api_server.log | grep -q 'Uvicorn running on'`; do sleep 1; done

  echo 'Starting gradio server...'
  git clone https://github.com/vllm-project/vllm.git || true
  python vllm/examples/online_serving/gradio_openai_chatbot_webserver.py \
    -m $MODEL_NAME \
    --port 8811 \
    --model-url http://localhost:8081/v1 \
    --stop-token-ids 128009,128001
```

Example 4 (yaml):
```yaml
resources:
  accelerators: {L4, A10g, A10, L40, A40, A100, A100-80GB} # We can use cheaper accelerators for 8B model.
  use_spot: True
  disk_size: 512  # Ensure model checkpoints can fit.
  disk_tier: best
  ports: 8081  # Expose to internet traffic.

envs:
  PYTHONUNBUFFERED: 1
  MODEL_NAME: meta-llama/Meta-Llama-3-8B-Instruct
  HF_TOKEN: <your-huggingface-token>  # Change to your own huggingface token, or use --env to pass.

setup: |
  conda create -n vllm python=3.10 -y
  conda activate vllm

  pip install vllm==0.4.0.post1
  # Install Gradio for web UI.
  pip install gradio openai
  pip install flash-attn==2.5.7

run: |
  conda activate vllm
  echo 'Starting vllm api server...'
  vllm serve $MODEL_NAME \
    --port 8081 \
    --trust-remote-code \
    --tensor-parallel-size $SKYPILOT_NUM_GPUS_PER_NODE \
    2>&1 | tee api_server.log &

  echo 'Waiting for vllm api server to start...'
  while ! `cat api_server.log | grep -q 'Uvicorn running on'`; do sleep 1; done

  echo 'Starting gradio server...'
  git clone https://github.com/vllm-project/vllm.git || true
  python vllm/examples/online_serving/gradio_openai_chatbot_webserver.py \
    -m $MODEL_NAME \
    --port 8811 \
    --model-url http://localhost:8081/v1 \
    --stop-token-ids 128009,128001
```

---

## Streamlit OpenAI Chatbot Webserver - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/streamlit_openai_chatbot_webserver/

**Contents:**
- Streamlit OpenAI Chatbot Webserver¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/streamlit_openai_chatbot_webserver.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
vLLM Chat Assistant - A Streamlit Web Interface

A streamlined chat interface that quickly integrates
with vLLM API server.

Features:
- Multiple chat sessions management
- Streaming response display
- Configurable API endpoint
- Real-time chat history
- Reasoning Display: Optional thinking process visualization 

Requirements:
    pip install streamlit openai

Usage:
    # Start the app with default settings
    streamlit run streamlit_openai_chatbot_webserver.py

    # Start with custom vLLM API endpoint
    VLLM_API_BASE="http://your-server:8000/v1" \
        streamlit run streamlit_openai_chatbot_webserver.py

    # Enable debug mode
    streamlit run streamlit_openai_chatbot_webserver.py \
        --logger.level=debug
"""

import os
from datetime import datetime

import streamlit as st
from openai import OpenAI

# Get command line arguments from environment variables
openai_api_key = os.getenv("VLLM_API_KEY", "EMPTY")
openai_api_base = os.getenv("VLLM_API_BASE", "http://localhost:8000/v1")

# Initialize session states for managing chat sessions
if "sessions" not in st.session_state:
    st.session_state.sessions = {}

if "current_session" not in st.session_state:
    st.session_state.current_session = None

if "messages" not in st.session_state:
    st.session_state.messages = []

if "active_session" not in st.session_state:
    st.session_state.active_session = None

# Add new session state for reasoning
if "show_reasoning" not in st.session_state:
    st.session_state.show_reasoning = {}

# Initialize session state for API base URL
if "api_base_url" not in st.session_state:
    st.session_state.api_base_url = openai_api_base


def create_new_chat_session():
    """Create a new chat session with timestamp as unique identifier.

    This function initializes a new chat session by:
    1. Generating a timestamp-based session ID
    2. Creating an empty message list for the new session
    3. Setting the new session as both current and active session
    4. Resetting the messages list for the new session

    Returns:
        None

    Session State Updates:
        - sessions: Adds new empty message list with timestamp key
        - current_session: Sets to new session ID
        - active_session: Sets to new session ID
        - messages: Resets to empty list
    """
    session_id = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    st.session_state.sessions[session_id] = []
    st.session_state.current_session = session_id
    st.session_state.active_session = session_id
    st.session_state.messages = []


def switch_to_chat_session(session_id):
    """Switch the active chat context to a different session.

    Args:
        session_id (str): The timestamp ID of the session to switch to

    This function handles chat session switching by:
    1. Setting the specified session as current
    2. Updating the active session marker
    3. Loading the messages history from the specified session

    Session State Updates:
        - current_session: Updated to specified session_id
        - active_session: Updated to specified session_id
        - messages: Loaded from sessions[session_id]
    """
    st.session_state.current_session = session_id
    st.session_state.active_session = session_id
    st.session_state.messages = st.session_state.sessions[session_id]


def get_llm_response(messages, model, reason, content_ph=None, reasoning_ph=None):
    """Generate and stream LLM response with optional reasoning process.

    Args:
        messages (list): List of conversation message dicts with 'role' and 'content'
        model (str): The model identifier to use for generation
        reason (bool): Whether to enable and display reasoning process
        content_ph (streamlit.empty): Placeholder for streaming response content
        reasoning_ph (streamlit.empty): Placeholder for streaming reasoning process

    Returns:
        tuple: (str, str)
            - First string contains the complete response text
            - Second string contains the complete reasoning text (if enabled)

    Features:
        - Streams both reasoning and response text in real-time
        - Handles model API errors gracefully
        - Supports live updating of thinking process
        - Maintains separate content and reasoning displays

    Raises:
        Exception: Wrapped in error message if API call fails

    Note:
        The function uses streamlit placeholders for live updates.
        When reason=True, the reasoning process appears above the response.
    """
    full_text = ""
    think_text = ""
    live_think = None
    # Build request parameters
    params = {"model": model, "messages": messages, "stream": True}
    if reason:
        params["extra_body"] = {"chat_template_kwargs": {"enable_thinking": True}}

    try:
        response = client.chat.completions.create(**params)
        if isinstance(response, str):
            if content_ph:
                content_ph.markdown(response)
            return response, ""

        # Prepare reasoning expander above content
        if reason and reasoning_ph:
            exp = reasoning_ph.expander("💭 Thinking Process (live)", expanded=True)
            live_think = exp.empty()

        # Stream chunks
        for chunk in response:
            delta = chunk.choices[0].delta
            # Stream reasoning first
            if reason and hasattr(delta, "reasoning") and live_think:
                rc = delta.reasoning
                if rc:
                    think_text += rc
                    live_think.markdown(think_text + "▌")
            # Then stream content
            if hasattr(delta, "content") and delta.content and content_ph:
                full_text += delta.content
                content_ph.markdown(full_text + "▌")

        # Finalize displays: reasoning remains above, content below
        if reason and live_think:
            live_think.markdown(think_text)
        if content_ph:
            content_ph.markdown(full_text)

        return full_text, think_text
    except Exception as e:
        st.error(f"Error details: {str(e)}")
        return f"Error: {str(e)}", ""


# Sidebar - API Settings first
st.sidebar.title("API Settings")
new_api_base = st.sidebar.text_input(
    "API Base URL:", value=st.session_state.api_base_url
)
if new_api_base != st.session_state.api_base_url:
    st.session_state.api_base_url = new_api_base
    st.rerun()

st.sidebar.divider()

# Sidebar - Session Management
st.sidebar.title("Chat Sessions")
if st.sidebar.button("New Session"):
    create_new_chat_session()


# Display all sessions in reverse chronological order
for session_id in sorted(st.session_state.sessions.keys(), reverse=True):
    # Mark the active session with a pinned button
    if session_id == st.session_state.active_session:
        st.sidebar.button(
            f"📍 {session_id}",
            key=session_id,
            type="primary",
            on_click=switch_to_chat_session,
            args=(session_id,),
        )
    else:
        st.sidebar.button(
            f"Session {session_id}",
            key=session_id,
            on_click=switch_to_chat_session,
            args=(session_id,),
        )

# Main interface
st.title("vLLM Chat Assistant")

# Initialize OpenAI client with API settings
client = OpenAI(api_key=openai_api_key, base_url=st.session_state.api_base_url)

# Get and display current model id
models = client.models.list()
model = models.data[0].id
st.markdown(f"**Model**: {model}")

# Initialize first session if none exists
if st.session_state.current_session is None:
    create_new_chat_session()
    st.session_state.active_session = st.session_state.current_session

# Update the chat history display section
for idx, msg in enumerate(st.session_state.messages):
    # Render user messages normally
    if msg["role"] == "user":
        with st.chat_message("user"):
            st.write(msg["content"])
    # Render assistant messages with reasoning above
    else:
        # If reasoning exists for this assistant message, show it above the content
        if idx in st.session_state.show_reasoning:
            with st.expander("💭 Thinking Process", expanded=False):
                st.markdown(st.session_state.show_reasoning[idx])
        with st.chat_message("assistant"):
            st.write(msg["content"])


# Setup & Cache reasoning support check
@st.cache_data(show_spinner=False)
def server_supports_reasoning():
    """Check if the current model supports reasoning capability.

    Returns:
        bool: True if the model supports reasoning, False otherwise
    """
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "Hi"}],
        stream=False,
    )
    return hasattr(resp.choices[0].message, "reasoning") and bool(
        resp.choices[0].message.reasoning
    )


# Check support
supports_reasoning = server_supports_reasoning()

# Add reasoning toggle in sidebar if supported
reason = False  # Default to False
if supports_reasoning:
    reason = st.sidebar.checkbox("Enable Reasoning", value=False)
else:
    st.sidebar.markdown(
        "<span style='color:gray;'>Reasoning unavailable for this model.</span>",
        unsafe_allow_html=True,
    )
    # reason remains False

# Update the input handling section
if prompt := st.chat_input("Type your message here..."):
    # Save and display user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.session_state.sessions[st.session_state.current_session] = (
        st.session_state.messages
    )
    with st.chat_message("user"):
        st.write(prompt)

    # Prepare LLM messages
    msgs = [
        {"role": m["role"], "content": m["content"]} for m in st.session_state.messages
    ]

    # Stream assistant response
    with st.chat_message("assistant"):
        # Placeholders: reasoning above, content below
        reason_ph = st.empty()
        content_ph = st.empty()
        full, think = get_llm_response(msgs, model, reason, content_ph, reason_ph)
        # Determine index for this new assistant message
        message_index = len(st.session_state.messages)
        # Save assistant reply
        st.session_state.messages.append({"role": "assistant", "content": full})
        # Persist reasoning in session state if any
        if reason and think:
            st.session_state.show_reasoning[message_index] = think
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""
vLLM Chat Assistant - A Streamlit Web Interface

A streamlined chat interface that quickly integrates
with vLLM API server.

Features:
- Multiple chat sessions management
- Streaming response display
- Configurable API endpoint
- Real-time chat history
- Reasoning Display: Optional thinking process visualization 

Requirements:
    pip install streamlit openai

Usage:
    # Start the app with default settings
    streamlit run streamlit_openai_chatbot_webserver.py

    # Start with custom vLLM API endpoint
    VLLM_API_BASE="http://your-server:8000/v1" \
        streamlit run streamlit_openai_chatbot_webserver.py

    # Enable debug mode
    streamlit run streamlit_openai_chatbot_webserver.py \
        --logger.level=debug
"""

import os
from datetime import datetime

import streamlit as st
from openai import OpenAI

# Get command line arguments from environment variables
openai_api_key = os.getenv("VLLM_API_KEY", "EMPTY")
openai_api_base = os.getenv("VLLM_API_BASE", "http://localhost:8000/v1")

# Initialize session states for managing chat sessions
if "sessions" not in st.session_state:
    st.session_state.sessions = {}

if "current_session" not in st.session_state:
    st.session_state.current_session = None

if "messages" not in st.session_state:
    st.session_state.messages = []

if "active_session" not in st.session_state:
    st.session_state.active_session = None

# Add new session state for reasoning
if "show_reasoning" not in st.session_state:
    st.session_state.show_reasoning = {}

# Initialize session state for API base URL
if "api_base_url" not in st.session_state:
    st.session_state.api_base_url = openai_api_base


def create_new_chat_session():
    """Create a new chat session with timestamp as unique identifier.

    This function initializes a new chat session by:
    1. Generating a timestamp-based session ID
    2. Creating an empty message list for the new session
    3. Setting the new session as both current and active session
    4. Resetting the messages list for the new session

    Returns:
        None

    Session State Updates:
        - sessions: Adds new empty message list with timestamp key
        - current_session: Sets to new session ID
        - active_session: Sets to new session ID
        - messages: Resets to empty list
    """
    session_id = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    st.session_state.sessions[session_id] = []
    st.session_state.current_session = session_id
    st.session_state.active_session = session_id
    st.session_state.messages = []


def switch_to_chat_session(session_id):
    """Switch the active chat context to a different session.

    Args:
        session_id (str): The timestamp ID of the session to switch to

    This function handles chat session switching by:
    1. Setting the specified session as current
    2. Updating the active session marker
    3. Loading the messages history from the specified session

    Session State Updates:
        - current_session: Updated to specified session_id
        - active_session: Updated to specified session_id
        - messages: Loaded from sessions[session_id]
    """
    st.session_state.current_session = session_id
    st.session_state.active_session = session_id
    st.session_state.messages = st.session_state.sessions[session_id]


def get_llm_response(messages, model, reason, content_ph=None, reasoning_ph=None):
    """Generate and stream LLM response with optional reasoning process.

    Args:
        messages (list): List of conversation message dicts with 'role' and 'content'
        model (str): The model identifier to use for generation
        reason (bool): Whether to enable and display reasoning process
        content_ph (streamlit.empty): Placeholder for streaming response content
        reasoning_ph (streamlit.empty): Placeholder for streaming reasoning process

    Returns:
        tuple: (str, str)
            - First string contains the complete response text
            - Second string contains the complete reasoning text (if enabled)

    Features:
        - Streams both reasoning and response text in real-time
        - Handles model API errors gracefully
        - Supports live updating of thinking process
        - Maintains separate content and reasoning displays

    Raises:
        Exception: Wrapped in error message if API call fails

    Note:
        The function uses streamlit placeholders for live updates.
        When reason=True, the reasoning process appears above the response.
    """
    full_text = ""
    think_text = ""
    live_think = None
    # Build request parameters
    params = {"model": model, "messages": messages, "stream": True}
    if reason:
        params["extra_body"] = {"chat_template_kwargs": {"enable_thinking": True}}

    try:
        response = client.chat.completions.create(**params)
        if isinstance(response, str):
            if content_ph:
                content_ph.markdown(response)
            return response, ""

        # Prepare reasoning expander above content
        if reason and reasoning_ph:
            exp = reasoning_ph.expander("💭 Thinking Process (live)", expanded=True)
            live_think = exp.empty()

        # Stream chunks
        for chunk in response:
            delta = chunk.choices[0].delta
            # Stream reasoning first
            if reason and hasattr(delta, "reasoning") and live_think:
                rc = delta.reasoning
                if rc:
                    think_text += rc
                    live_think.markdown(think_text + "▌")
            # Then stream content
            if hasattr(delta, "content") and delta.content and content_ph:
                full_text += delta.content
                content_ph.markdown(full_text + "▌")

        # Finalize displays: reasoning remains above, content below
        if reason and live_think:
            live_think.markdown(think_text)
        if content_ph:
            content_ph.markdown(full_text)

        return full_text, think_text
    except Exception as e:
        st.error(f"Error details: {str(e)}")
        return f"Error: {str(e)}", ""


# Sidebar - API Settings first
st.sidebar.title("API Settings")
new_api_base = st.sidebar.text_input(
    "API Base URL:", value=st.session_state.api_base_url
)
if new_api_base != st.session_state.api_base_url:
    st.session_state.api_base_url = new_api_base
    st.rerun()

st.sidebar.divider()

# Sidebar - Session Management
st.sidebar.title("Chat Sessions")
if st.sidebar.button("New Session"):
    create_new_chat_session()


# Display all sessions in reverse chronological order
for session_id in sorted(st.session_state.sessions.keys(), reverse=True):
    # Mark the active session with a pinned button
    if session_id == st.session_state.active_session:
        st.sidebar.button(
            f"📍 {session_id}",
            key=session_id,
            type="primary",
            on_click=switch_to_chat_session,
            args=(session_id,),
        )
    else:
        st.sidebar.button(
            f"Session {session_id}",
            key=session_id,
            on_click=switch_to_chat_session,
            args=(session_id,),
        )

# Main interface
st.title("vLLM Chat Assistant")

# Initialize OpenAI client with API settings
client = OpenAI(api_key=openai_api_key, base_url=st.session_state.api_base_url)

# Get and display current model id
models = client.models.list()
model = models.data[0].id
st.markdown(f"**Model**: {model}")

# Initialize first session if none exists
if st.session_state.current_session is None:
    create_new_chat_session()
    st.session_state.active_session = st.session_state.current_session

# Update the chat history display section
for idx, msg in enumerate(st.session_state.messages):
    # Render user messages normally
    if msg["role"] == "user":
        with st.chat_message("user"):
            st.write(msg["content"])
    # Render assistant messages with reasoning above
    else:
        # If reasoning exists for this assistant message, show it above the content
        if idx in st.session_state.show_reasoning:
            with st.expander("💭 Thinking Process", expanded=False):
                st.markdown(st.session_state.show_reasoning[idx])
        with st.chat_message("assistant"):
            st.write(msg["content"])


# Setup & Cache reasoning support check
@st.cache_data(show_spinner=False)
def server_supports_reasoning():
    """Check if the current model supports reasoning capability.

    Returns:
        bool: True if the model supports reasoning, False otherwise
    """
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "Hi"}],
        stream=False,
    )
    return hasattr(resp.choices[0].message, "reasoning") and bool(
        resp.choices[0].message.reasoning
    )


# Check support
supports_reasoning = server_supports_reasoning()

# Add reasoning toggle in sidebar if supported
reason = False  # Default to False
if supports_reasoning:
    reason = st.sidebar.checkbox("Enable Reasoning", value=False)
else:
    st.sidebar.markdown(
        "<span style='color:gray;'>Reasoning unavailable for this model.</span>",
        unsafe_allow_html=True,
    )
    # reason remains False

# Update the input handling section
if prompt := st.chat_input("Type your message here..."):
    # Save and display user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.session_state.sessions[st.session_state.current_session] = (
        st.session_state.messages
    )
    with st.chat_message("user"):
        st.write(prompt)

    # Prepare LLM messages
    msgs = [
        {"role": m["role"], "content": m["content"]} for m in st.session_state.messages
    ]

    # Stream assistant response
    with st.chat_message("assistant"):
        # Placeholders: reasoning above, content below
        reason_ph = st.empty()
        content_ph = st.empty()
        full, think = get_llm_response(msgs, model, reason, content_ph, reason_ph)
        # Determine index for this new assistant message
        message_index = len(st.session_state.messages)
        # Save assistant reply
        st.session_state.messages.append({"role": "assistant", "content": full})
        # Persist reasoning in session state if any
        if reason and think:
            st.session_state.show_reasoning[message_index] = think
```

---

## Streamlit - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/frameworks/streamlit/

**Contents:**
- Streamlit¶
- Prerequisites¶
- Deploy¶

Streamlit lets you transform Python scripts into interactive web apps in minutes, instead of weeks. Build dashboards, generate reports, or create chat apps.

It can be quickly integrated with vLLM as a backend API server, enabling powerful LLM inference via API calls.

Set up the vLLM environment by installing all required packages:

Start the vLLM server with a supported chat completion model, e.g.

Use the script: examples/online_serving/streamlit_openai_chatbot_webserver.py

Start the streamlit web UI and start to chat:

**Examples:**

Example 1 (unknown):
```unknown
pip install vllm streamlit openai
```

Example 2 (unknown):
```unknown
pip install vllm streamlit openai
```

Example 3 (unknown):
```unknown
vllm serve Qwen/Qwen1.5-0.5B-Chat
```

Example 4 (unknown):
```unknown
vllm serve Qwen/Qwen1.5-0.5B-Chat
```

---

## Structured Outputs - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/structured_outputs/

**Contents:**
- Structured Outputs¶
- Usage¶
- Example materials¶

Source https://github.com/vllm-project/vllm/tree/main/examples/online_serving/structured_outputs.

This script demonstrates various structured output capabilities of vLLM's OpenAI-compatible server. It can run individual constraint type or all of them. It supports both streaming responses and concurrent non-streaming requests.

To use this example, you must start an vLLM server with any model of your choice.

To serve a reasoning model, you can use the following command:

If you want to run this script standalone with uv, you can use the following:

See feature docs for more information.

If vLLM is running remotely, then set OPENAI_BASE_URL=<remote_url> before running the script.

Run all constraints, non-streaming:

Run all constraints, streaming:

Run certain constraints, for example structural_tag and regex, streaming:

Run all constraints, with reasoning models and streaming:

**Examples:**

Example 1 (unknown):
```unknown
vllm serve Qwen/Qwen2.5-3B-Instruct
```

Example 2 (unknown):
```unknown
vllm serve Qwen/Qwen2.5-3B-Instruct
```

Example 3 (unknown):
```unknown
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-7B \
    --reasoning-parser deepseek_r1
```

Example 4 (unknown):
```unknown
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-7B \
    --reasoning-parser deepseek_r1
```

---

## Token Generation Client - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/token_generation_client/

**Contents:**
- Token Generation Client¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/token_generation_client.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import httpx
from transformers import AutoTokenizer

GEN_ENDPOINT = "http://localhost:8000/inference/v1/generate"
DUMMY_API_KEY = "empty"
MODEL_NAME = "Qwen/Qwen3-0.6B"

transport = httpx.HTTPTransport()
headers = {"Authorization": f"Bearer {DUMMY_API_KEY}"}
client = httpx.Client(
    transport=transport,
    base_url=GEN_ENDPOINT,
    timeout=600,
    headers=headers,
)
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "How many countries are in the EU?"},
]


def main(client):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    token_ids = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        enable_thinking=False,
    )
    payload = {
        "model": MODEL_NAME,
        "token_ids": token_ids,
        "sampling_params": {"max_tokens": 24, "temperature": 0.2, "detokenize": False},
        "stream": False,
    }
    resp = client.post(GEN_ENDPOINT, json=payload)
    resp.raise_for_status()
    data = resp.json()
    print(data)
    print("-" * 50)
    print("Token generation results:")
    res = tokenizer.decode(data["choices"][0]["token_ids"])
    print(res)
    print("-" * 50)


if __name__ == "__main__":
    main(client)
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
import httpx
from transformers import AutoTokenizer

GEN_ENDPOINT = "http://localhost:8000/inference/v1/generate"
DUMMY_API_KEY = "empty"
MODEL_NAME = "Qwen/Qwen3-0.6B"

transport = httpx.HTTPTransport()
headers = {"Authorization": f"Bearer {DUMMY_API_KEY}"}
client = httpx.Client(
    transport=transport,
    base_url=GEN_ENDPOINT,
    timeout=600,
    headers=headers,
)
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "How many countries are in the EU?"},
]


def main(client):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    token_ids = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        enable_thinking=False,
    )
    payload = {
        "model": MODEL_NAME,
        "token_ids": token_ids,
        "sampling_params": {"max_tokens": 24, "temperature": 0.2, "detokenize": False},
        "stream": False,
    }
    resp = client.post(GEN_ENDPOINT, json=payload)
    resp.raise_for_status()
    data = resp.json()
    print(data)
    print("-" * 50)
    print("Token generation results:")
    res = tokenizer.decode(data["choices"][0]["token_ids"])
    print(res)
    print("-" * 50)


if __name__ == "__main__":
    main(client)
```

---

## Troubleshooting distributed deployments - vLLM

**URL:** https://docs.vllm.ai/en/latest/serving/distributed_troubleshooting/

**Contents:**
- Troubleshooting distributed deployments¶
- Verify inter-node GPU communication¶
- No available node types can fulfill resource request¶
- Ray observability¶

For general troubleshooting, see Troubleshooting.

After you start the Ray cluster, verify GPU-to-GPU communication across nodes. Proper configuration can be non-trivial. For more information, see troubleshooting script. If you need additional environment variables for communication configuration, append them to examples/online_serving/run_cluster.sh, for example -e NCCL_SOCKET_IFNAME=eth0. Setting environment variables during cluster creation is recommended because the variables propagate to all nodes. In contrast, setting environment variables in the shell affects only the local node. For more information, see <https://github.com/vllm-project/vllm/issues/6803).

The error message Error: No available node types can fulfill resource request can appear even when the cluster has enough GPUs. The issue often occurs when nodes have multiple IP addresses and vLLM can't select the correct one. Ensure that vLLM and Ray use the same IP address by setting VLLM_HOST_IP in examples/online_serving/run_cluster.sh (with a different value on each node). Use ray status and ray list nodes to verify the chosen IP address. For more information, see <https://github.com/vllm-project/vllm/issues/7815).

Debugging a distributed system can be challenging due to the large scale and complexity. Ray provides a suite of tools to help monitor, debug, and optimize Ray applications and clusters. For more information about Ray observability, visit the official Ray observability docs. For more information about debugging Ray applications, visit the Ray Debugging Guide. For information about troubleshooting Kubernetes clusters, see the official KubeRay troubleshooting guide.

---

## Using Docker - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/docker/

**Contents:**
- Using Docker¶
- Use vLLM's Official Docker Image¶
- Building vLLM's Docker Image from Source¶
- Building for Arm64/aarch64¶
- Use the custom-built vLLM Docker image¶

vLLM offers an official Docker image for deployment. The image can be used to run OpenAI compatible server and is available on Docker Hub as vllm/vllm-openai.

This image can also be used with other container engines such as Podman.

You can add any other engine-args you need after the image tag (vllm/vllm-openai:latest).

You can either use the ipc=host flag or --shm-size flag to allow the container to access the host's shared memory. vLLM uses PyTorch, which uses shared memory to share data between processes under the hood, particularly for tensor parallel inference.

Optional dependencies are not included in order to avoid licensing issues (e.g. Issue #8030).

If you need to use those dependencies (having accepted the license terms), create a custom Dockerfile on top of the base image with an extra layer that installs them:

Some new models may only be available on the main branch of HF Transformers.

To use the development version of transformers, create a custom Dockerfile on top of the base image with an extra layer that installs their code from source:

You can build and run vLLM from source via the provided docker/Dockerfile. To build vLLM:

By default vLLM will build for all GPU types for widest distribution. If you are just building for the current GPU type the machine is running on, you can add the argument --build-arg torch_cuda_arch_list="" for vLLM to find the current GPU type and build for that.

If you are using Podman instead of Docker, you might need to disable SELinux labeling by adding --security-opt label=disable when running podman build command to avoid certain existing issues.

A docker container can be built for aarch64 systems such as the Nvidia Grace-Hopper and Grace-Blackwell. Using the flag --platform "linux/arm64" will build for arm64.

Multiple modules must be compiled, so this process can take a while. Recommend using --build-arg max_jobs= & --build-arg nvcc_threads= flags to speed up build process. However, ensure your max_jobs is substantially larger than nvcc_threads to get the most benefits. Keep an eye on memory usage with parallel jobs as it can be substantial (see example below).

For (G)B300, we recommend using CUDA 13, as shown in the following command.

If you are building the linux/arm64 image on a non-ARM host (e.g., an x86_64 machine), you need to ensure your system is set up for cross-compilation using QEMU. This allows your host machine to emulate ARM64 execution.

Run the following command on your host machine to register QEMU user static handlers:

After setting up QEMU, you can use the --platform "linux/arm64" flag in your docker build command.

To run vLLM with the custom-built Docker image:

The argument vllm/vllm-openai specifies the image to run, and should be replaced with the name of the custom-built image (the -t tag from the build command).

For version 0.4.1 and 0.4.2 only - the vLLM docker images under these versions are supposed to be run under the root user since a library under the root user's home directory, i.e. /root/.config/vllm/nccl/cu12/libnccl.so.2.18.1 is required to be loaded during runtime. If you are running the container under a different user, you may need to first change the permissions of the library (and all the parent directories) to allow the user to access it, then run vLLM with environment variable VLLM_NCCL_SO_PATH=/root/.config/vllm/nccl/cu12/libnccl.so.2.18.1 .

**Examples:**

Example 1 (json):
```json
docker run --runtime nvidia --gpus all \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    --env "HF_TOKEN=$HF_TOKEN" \
    -p 8000:8000 \
    --ipc=host \
    vllm/vllm-openai:latest \
    --model Qwen/Qwen3-0.6B
```

Example 2 (json):
```json
docker run --runtime nvidia --gpus all \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    --env "HF_TOKEN=$HF_TOKEN" \
    -p 8000:8000 \
    --ipc=host \
    vllm/vllm-openai:latest \
    --model Qwen/Qwen3-0.6B
```

Example 3 (json):
```json
podman run --device nvidia.com/gpu=all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  --env "HF_TOKEN=$HF_TOKEN" \
  -p 8000:8000 \
  --ipc=host \
  docker.io/vllm/vllm-openai:latest \
  --model Qwen/Qwen3-0.6B
```

Example 4 (json):
```json
podman run --device nvidia.com/gpu=all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  --env "HF_TOKEN=$HF_TOKEN" \
  -p 8000:8000 \
  --ipc=host \
  docker.io/vllm/vllm-openai:latest \
  --model Qwen/Qwen3-0.6B
```

---

## Using Kubernetes - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/k8s/

**Contents:**
- Using Kubernetes¶
- Deployment with CPUs¶
- Deployment with GPUs¶
- Troubleshooting¶
  - Startup Probe or Readiness Probe Failure, container log contains "KeyboardInterrupt: terminated"¶
- Conclusion¶

Deploying vLLM on Kubernetes is a scalable and efficient way to serve machine learning models. This guide walks you through deploying vLLM using native Kubernetes.

Alternatively, you can deploy vLLM to Kubernetes using any of the following:

The use of CPUs here is for demonstration and testing purposes only and its performance will not be on par with GPUs.

First, create a Kubernetes PVC and Secret for downloading and storing Hugging Face model:

Here, the token field stores your Hugging Face access token. For details on how to generate a token, see the Hugging Face documentation.

Next, start the vLLM server as a Kubernetes Deployment and Service:

We can verify that the vLLM server has started successfully via the logs (this might take a couple of minutes to download the model):

Pre-requisite: Ensure that you have a running Kubernetes cluster with GPUs.

Create a PVC, Secret and Deployment for vLLM

PVC is used to store the model cache and it is optional, you can use hostPath or other storage options

Secret is optional and only required for accessing gated models, you can skip this step if you are not using gated models

Next to create the deployment file for vLLM to run the model server. The following example deploys the Mistral-7B-Instruct-v0.3 model.

Here are two examples for using NVIDIA GPU and AMD GPU.

You can refer to the deployment.yaml below if using AMD ROCm GPU like MI300X.

You can get the full example with steps and sample yaml files from https://github.com/ROCm/k8s-device-plugin/tree/master/example/vllm-serve.

Create a Kubernetes Service for vLLM

Next, create a Kubernetes Service file to expose the mistral-7b deployment:

Apply the deployment and service configurations using kubectl apply -f <filename>:

To test the deployment, run the following curl command:

If the service is correctly deployed, you should receive a response from the vLLM model.

If the startup or readiness probe failureThreshold is too low for the time needed to start up the server, Kubernetes scheduler will kill the container. A couple of indications that this has happened:

To mitigate, increase the failureThreshold to allow more time for the model server to start serving. You can identify an ideal failureThreshold by removing the probes from the manifest and measuring how much time it takes for the model server to show it's ready to serve.

Deploying vLLM with Kubernetes allows for efficient scaling and management of ML models leveraging GPU resources. By following the steps outlined above, you should be able to set up and test a vLLM deployment within your Kubernetes cluster. If you encounter any issues or have suggestions, please feel free to contribute to the documentation.

**Examples:**

Example 1 (yaml):
```yaml
cat <<EOF |kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vllm-models
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 50Gi
---
apiVersion: v1
kind: Secret
metadata:
  name: hf-token-secret
type: Opaque
stringData:
  token: "REPLACE_WITH_TOKEN"
EOF
```

Example 2 (yaml):
```yaml
cat <<EOF |kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vllm-models
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 50Gi
---
apiVersion: v1
kind: Secret
metadata:
  name: hf-token-secret
type: Opaque
stringData:
  token: "REPLACE_WITH_TOKEN"
EOF
```

Example 3 (yaml):
```yaml
cat <<EOF |kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: vllm
  template:
    metadata:
      labels:
        app.kubernetes.io/name: vllm
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        command: ["/bin/sh", "-c"]
        args: [
          "vllm serve meta-llama/Llama-3.2-1B-Instruct"
        ]
        env:
        - name: HF_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token-secret
              key: token
        ports:
          - containerPort: 8000
        volumeMounts:
          - name: llama-storage
            mountPath: /root/.cache/huggingface
      volumes:
      - name: llama-storage
        persistentVolumeClaim:
          claimName: vllm-models
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-server
spec:
  selector:
    app.kubernetes.io/name: vllm
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
EOF
```

Example 4 (yaml):
```yaml
cat <<EOF |kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: vllm
  template:
    metadata:
      labels:
        app.kubernetes.io/name: vllm
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        command: ["/bin/sh", "-c"]
        args: [
          "vllm serve meta-llama/Llama-3.2-1B-Instruct"
        ]
        env:
        - name: HF_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token-secret
              key: token
        ports:
          - containerPort: 8000
        volumeMounts:
          - name: llama-storage
            mountPath: /root/.cache/huggingface
      volumes:
      - name: llama-storage
        persistentVolumeClaim:
          claimName: vllm-models
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-server
spec:
  selector:
    app.kubernetes.io/name: vllm
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
EOF
```

---

## Using Nginx - vLLM

**URL:** https://docs.vllm.ai/en/latest/deployment/nginx/

**Contents:**
- Using Nginx¶
- Build Nginx Container¶
- Create Simple Nginx Config file¶
- Build vLLM Container¶
- Create Docker Network¶
- Launch vLLM Containers¶
- Launch Nginx¶
- Verify That vLLM Servers Are Ready¶

This document shows how to launch multiple vLLM serving containers and use Nginx to act as a load balancer between the servers.

This guide assumes that you have just cloned the vLLM project and you're currently in the vllm root directory.

Create a file named Dockerfile.nginx:

Create a file named nginx_conf/nginx.conf. Note that you can add as many servers as you'd like. In the below example we'll start with two. To add more, add another server vllmN:8000 max_fails=3 fail_timeout=10000s; entry to upstream backend.

If you are behind proxy, you can pass the proxy settings to the docker build command as shown below:

If you are behind proxy, you can pass the proxy settings to the docker run command via -e http_proxy=$http_proxy -e https_proxy=$https_proxy.

Both outputs should look like this:

**Examples:**

Example 1 (unknown):
```unknown
export vllm_root=`pwd`
```

Example 2 (unknown):
```unknown
export vllm_root=`pwd`
```

Example 3 (sql):
```sql
FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Example 4 (sql):
```sql
FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Utils - vLLM

**URL:** https://docs.vllm.ai/en/latest/examples/online_serving/utils/

**Contents:**
- Utils¶

Source https://github.com/vllm-project/vllm/blob/main/examples/online_serving/utils.py.

**Examples:**

Example 1 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
from openai import APIConnectionError, OpenAI
from openai.pagination import SyncPage
from openai.types.model import Model


def get_first_model(client: OpenAI) -> str:
    """
    Get the first model from the vLLM server.
    """
    try:
        models: SyncPage[Model] = client.models.list()
    except APIConnectionError as e:
        raise RuntimeError(
            "Failed to get the list of models from the vLLM server at "
            f"{client.base_url} with API key {client.api_key}. Check\n"
            "1. the server is running\n"
            "2. the server URL is correct\n"
            "3. the API key is correct"
        ) from e

    if len(models.data) == 0:
        raise RuntimeError(f"No models found on the vLLM server at {client.base_url}")

    return models.data[0].id
```

Example 2 (python):
```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
from openai import APIConnectionError, OpenAI
from openai.pagination import SyncPage
from openai.types.model import Model


def get_first_model(client: OpenAI) -> str:
    """
    Get the first model from the vLLM server.
    """
    try:
        models: SyncPage[Model] = client.models.list()
    except APIConnectionError as e:
        raise RuntimeError(
            "Failed to get the list of models from the vLLM server at "
            f"{client.base_url} with API key {client.api_key}. Check\n"
            "1. the server is running\n"
            "2. the server URL is correct\n"
            "3. the API key is correct"
        ) from e

    if len(models.data) == 0:
        raise RuntimeError(f"No models found on the vLLM server at {client.base_url}")

    return models.data[0].id
```

---
