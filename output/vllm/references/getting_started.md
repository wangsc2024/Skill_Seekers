# Vllm - Getting Started

**Pages:** 4

---

## CPU - vLLM

**URL:** https://docs.vllm.ai/en/latest/getting_started/installation/cpu/

**Contents:**
- CPU¶
- Technical Discussions¶
- Requirements¶
- Set up using Python¶
  - Create a new Python environment¶
  - Pre-built wheels¶
  - Build wheel from source¶
    - Set up using Python-only build (without compilation)¶
    - Full build (with compilation)¶
- Set up using Docker¶

vLLM is a Python library that supports the following CPU variants. Select your CPU type to see vendor specific instructions:

vLLM supports basic model inferencing and serving on x86 CPU platform, with data types FP32, FP16 and BF16.

vLLM offers basic model inferencing and serving on Arm CPU platform, with support NEON, data types FP32, FP16 and BF16.

vLLM has experimental support for macOS with Apple Silicon. For now, users must build from source to natively run on macOS.

Currently the CPU implementation for macOS supports FP32 and FP16 datatypes.

GPU-Accelerated Inference with vLLM-Metal

For GPU-accelerated inference on Apple Silicon using Metal, check out vllm-metal, a community-maintained hardware plugin that uses MLX as the compute backend.

vLLM has experimental support for s390x architecture on IBM Z platform. For now, users must build from source to natively run on IBM Z platform.

Currently, the CPU implementation for s390x architecture supports FP32 datatype only.

The main discussions happen in the #sig-cpu channel of vLLM Slack.

When open a Github issue about the CPU backend, please add [CPU Backend] in the title and it will be labeled with cpu for better awareness.

Use lscpu to check the CPU flags.

It's recommended to use uv, a very fast Python environment manager, to create and manage Python environments. Please follow the documentation to install uv. After installing uv, you can create a new Python environment using the following commands:

When specifying the index URL, please make sure to use the cpu variant subdirectory. For example, the nightly build index is: https://wheels.vllm.ai/nightly/cpu/.

Pre-built vLLM wheels for x86 with AVX512 are available since version 0.13.0. To install release wheels:

Before use vLLM CPU installed via wheels, make sure TCMalloc and Intel OpenMP are installed and added to LD_PRELOAD:

Install the latest code

To install the wheel built from the latest main branch:

Install specific revisions

If you want to access the wheels for previous commits (e.g. to bisect the behavior change, performance regression), you can specify the commit hash in the URL:

Pre-built vLLM wheels for Arm are available since version 0.11.2. These wheels contain pre-compiled C++ binaries.

Before use vLLM CPU installed via wheels, make sure TCMalloc is installed and added to LD_PRELOAD:

The uv approach works for vLLM v0.6.6 and later. A unique feature of uv is that packages in --extra-index-url have higher priority than the default index. If the latest public release is v0.6.6.post1, uv's behavior allows installing a commit before v0.6.6.post1 by specifying the --extra-index-url. In contrast, pip combines packages from --extra-index-url and the default index, choosing only the latest version, which makes it difficult to install a development version prior to the released version.

Install the latest code

LLM inference is a fast-evolving field, and the latest code may contain bug fixes, performance improvements, and new features that are not released yet. To allow users to try the latest code without waiting for the next release, vLLM provides working pre-built Arm CPU wheels for every commit since v0.11.2 on https://wheels.vllm.ai/nightly. For native CPU wheels, this index should be used:

To install from nightly index, run:

Using pip to install from nightly indices is not supported, because pip combines packages from --extra-index-url and the default index, choosing only the latest version, which makes it difficult to install a development version prior to the released version. In contrast, uv gives the extra index higher priority than the default index.

If you insist on using pip, you have to specify the full URL (link address) of the wheel file (which can be obtained from https://wheels.vllm.ai/nightly/cpu/vllm).

Install specific revisions

If you want to access the wheels for previous commits (e.g. to bisect the behavior change, performance regression), you can specify the commit hash in the URL:

Currently, there are no pre-built Apple silicon CPU wheels.

Currently, there are no pre-built IBM Z CPU wheels.

Please refer to the instructions for Python-only build on GPU, and replace the build commands with:

Install recommended compiler. We recommend to use gcc/g++ >= 12.3.0 as the default compiler to avoid potential problems. For example, on Ubuntu 22.4, you can run:

It's recommended to use uv, a very fast Python environment manager, to create and manage Python environments. Please follow the documentation to install uv. After installing uv, you can create a new Python environment using the following commands:

Clone the vLLM project:

Install the required dependencies:

Build and install vLLM:

If you want to develop vLLM, install it in editable mode instead.

Optionally, build a portable wheel which you can then install elsewhere:

Before use vLLM CPU installed via wheels, make sure TCMalloc and Intel OpenMP are installed and added to LD_PRELOAD:

First, install the recommended compiler. We recommend using gcc/g++ >= 12.3.0 as the default compiler to avoid potential problems. For example, on Ubuntu 22.4, you can run:

Second, clone the vLLM project:

Third, install required dependencies:

Finally, build and install vLLM:

If you want to develop vLLM, install it in editable mode instead.

Testing has been conducted on AWS Graviton3 instances for compatibility.

Before use vLLM CPU installed via wheels, make sure TCMalloc is installed and added to LD_PRELOAD:

After installation of XCode and the Command Line Tools, which include Apple Clang, execute the following commands to build and install vLLM from source.

The --index-strategy unsafe-best-match flag is needed to resolve dependencies across multiple package indexes (PyTorch CPU index and PyPI). Without this flag, you may encounter typing-extensions version conflicts.

The term "unsafe" refers to the package resolution strategy, not security. By default, uv only searches the first index where a package is found to prevent dependency confusion attacks. This flag allows uv to search all configured indexes to find the best compatible versions. Since both PyTorch and PyPI are trusted package sources, using this strategy is safe and appropriate for vLLM installation.

On macOS the VLLM_TARGET_DEVICE is automatically set to cpu, which is currently the only supported device.

If the build fails with errors like the following where standard C++ headers cannot be found, try to remove and reinstall your Command Line Tools for Xcode.

If the build fails with C++11/C++17 compatibility errors like the following, the issue is that the build system is defaulting to an older C++ standard:

Solution: Your compiler might be using an older C++ standard. Edit cmake/cpu_extension.cmake and add set(CMAKE_CXX_STANDARD 17) before set(CMAKE_CXX_STANDARD_REQUIRED ON).

To check your compiler's C++ standard support:

Install the following packages from the package manager before building the vLLM. For example on RHEL 9.4:

Install rust>=1.80 which is needed for outlines-core and uvloop python packages installation.

Execute the following commands to build and install vLLM from source.

Please build the following dependencies, torchvision, pyarrow from source before building vLLM.

https://gallery.ecr.aws/q9t5s3a7/vllm-cpu-release-repo

If deploying the pre-built images on machines without avx512f, avx512_bf16, or avx512_vnni support, an Illegal instruction error may be raised. It is recommended to build images for these machines with the appropriate build arguments (e.g., --build-arg VLLM_CPU_DISABLE_AVX512=true, --build-arg VLLM_CPU_AVX512BF16=false, or --build-arg VLLM_CPU_AVX512VNNI=false) to disable unsupported features. Please note that without avx512f, AVX2 will be used and this version is not recommended because it only has basic feature support.

See Using Docker for instructions on using the official Docker image.

Stable vLLM Docker images are being pre-built for Arm from version 0.12.0. Available image tags are here: https://gallery.ecr.aws/q9t5s3a7/vllm-arm64-cpu-release-repo.

You can also access the latest code with Docker images. These are not intended for production use and are meant for CI and testing only. They will expire after several days.

The latest code can contain bugs and may not be stable. Please use it with caution.

Currently, there are no pre-built Arm silicon CPU images.

Currently, there are no pre-built IBM Z CPU images.

An alternative of --privileged=true is --cap-add SYS_NICE --security-opt seccomp=unconfined.

An alternative of --privileged=true is --cap-add SYS_NICE --security-opt seccomp=unconfined.

An alternative of --privileged true is --cap-add SYS_NICE --security-opt seccomp=unconfined.

or using default auto thread binding:

Note, it is recommended to manually reserve 1 CPU for vLLM front-end process when world_size == 1.

For the full and up-to-date list of models validated on CPU platforms, please see the official documentation: Supported Models on CPU

For any model listed under Supported Models on CPU, optimized runtime configurations are provided in the vLLM Benchmark Suite’s CPU test cases, defined in cpu test cases For details on how these optimized configurations are determined, see: performance-benchmark-details. To benchmark the supported models using these optimized settings, follow the steps in running vLLM Benchmark Suite manually and run the Benchmark Suite on a CPU environment.

Below is an example command to benchmark all CPU-supported models using optimized configurations.

The benchmark results will be saved in ./benchmark/results/. In the directory, the generated .commands files contain all example commands for the benchmark.

We recommend configuring tensor-parallel-size to match the number of NUMA nodes on your system. Note that the current release does not support tensor-parallel-size=6. To determine the number of NUMA nodes available, use the following command:

For performance reference, users may also consult the vLLM Performance Dashboard , which publishes default-model CPU results produced using the same Benchmark Suite.

Default auto thread-binding is recommended for most cases. Ideally, each OpenMP thread will be bound to a dedicated physical core respectively, threads of each rank will be bound to the same NUMA node respectively, and 1 CPU per rank will be reserved for other vLLM components when world_size > 1. If you have any performance problems or unexpected binding behaviours, please try to bind threads as following.

On a hyper-threading enabled platform with 16 logical CPU cores / 8 physical CPU cores:

This value is 4GB by default. Larger space can support more concurrent requests, longer context length. However, users should take care of memory capacity of each NUMA node. The memory usage of each TP rank is the sum of weight shard size and VLLM_CPU_KVCACHE_SPACE, if it exceeds the capacity of a single NUMA node, the TP worker will be killed with exitcode 9 due to out-of-memory.

First of all, please make sure the thread-binding and KV cache space are properly set and take effect. You can check the thread-binding by running a vLLM benchmark and observing CPU cores usage via htop.

Use multiples of 32 as --block-size, which is 128 by default.

Inference batch size is an important parameter for the performance. A larger batch usually provides higher throughput, a smaller batch provides lower latency. Tuning the max batch size starting from the default value to balance throughput and latency is an effective way to improve vLLM CPU performance on specific platforms. There are two important related parameters in vLLM:

vLLM CPU supports data parallel (DP), tensor parallel (TP) and pipeline parallel (PP) to leverage multiple CPU sockets and memory nodes. For more details of tuning DP, TP and PP, please refer to Optimization and Tuning. For vLLM CPU, it is recommended to use DP, TP and PP together if there are enough CPU sockets and memory nodes.

In some container environments (like Docker), NUMA-related syscalls used by vLLM (e.g., get_mempolicy, migrate_pages) are blocked/denied in the runtime's default seccomp/capabilities settings. This may lead to warnings like get_mempolicy: Operation not permitted. Functionality is not affected, but NUMA memory binding/migration optimizations may not take effect and performance can be suboptimal.

To enable these optimizations inside Docker with the least privilege, you can follow below tips:

Alternatively, running with --privileged=true also works but is broader and not generally recommended.

In K8S, the following configuration can be added to workload yaml to achieve the same effect as above:

**Examples:**

Example 1 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
```

Example 2 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
```

Example 3 (markdown):
```markdown
export VLLM_VERSION=$(curl -s https://api.github.com/repos/vllm-project/vllm/releases/latest | jq -r .tag_name | sed 's/^v//')

# use uv
uv pip install https://github.com/vllm-project/vllm/releases/download/v${VLLM_VERSION}/vllm-${VLLM_VERSION}+cpu-cp38-abi3-manylinux_2_35_x86_64.whl --torch-backend cpu
```

Example 4 (markdown):
```markdown
export VLLM_VERSION=$(curl -s https://api.github.com/repos/vllm-project/vllm/releases/latest | jq -r .tag_name | sed 's/^v//')

# use uv
uv pip install https://github.com/vllm-project/vllm/releases/download/v${VLLM_VERSION}/vllm-${VLLM_VERSION}+cpu-cp38-abi3-manylinux_2_35_x86_64.whl --torch-backend cpu
```

---

## GPU - vLLM

**URL:** https://docs.vllm.ai/en/latest/getting_started/installation/gpu/

**Contents:**
- GPU¶
- Requirements¶
- Set up using Python¶
  - Create a new Python environment¶
  - Pre-built wheels¶
    - Install the latest code¶
      - Install specific revisions¶
  - Build wheel from source¶
    - Set up using Python-only build (without compilation)¶
    - Full build (with compilation)¶

vLLM is a Python library that supports the following GPU variants. Select your GPU type to see vendor specific instructions:

vLLM contains pre-compiled C++ and CUDA (12.8) binaries.

vLLM supports AMD GPUs with ROCm 6.3 or above, and torch 2.8.0 and above.

Docker is the recommended way to use vLLM on ROCm.

vLLM initially supports basic model inference and serving on Intel GPU platform.

vLLM does not support Windows natively. To run vLLM on Windows, you can use the Windows Subsystem for Linux (WSL) with a compatible Linux distribution, or use some community-maintained forks, e.g. https://github.com/SystemPanic/vllm-windows.

The provided IPEX whl is Python3.12 specific so this version is a MUST.

It's recommended to use uv, a very fast Python environment manager, to create and manage Python environments. Please follow the documentation to install uv. After installing uv, you can create a new Python environment using the following commands:

PyTorch installed via conda will statically link NCCL library, which can cause issues when vLLM tries to use NCCL. See https://github.com/vllm-project/vllm/issues/8420 for more details.

In order to be performant, vLLM has to compile many cuda kernels. The compilation unfortunately introduces binary incompatibility with other CUDA versions and PyTorch versions, even for the same PyTorch version with different building configurations.

Therefore, it is recommended to install vLLM with a fresh new environment. If either you have a different CUDA version or you want to use an existing PyTorch installation, you need to build vLLM from source. See below for more details.

There is no extra information on creating a new Python environment for this device.

There is no extra information on creating a new Python environment for this device.

We recommend leveraging uv to automatically select the appropriate PyTorch index at runtime by inspecting the installed CUDA driver version via --torch-backend=auto (or UV_TORCH_BACKEND=auto). To select a specific backend (e.g., cu128), set --torch-backend=cu128 (or UV_TORCH_BACKEND=cu128). If this doesn't work, try running uv self update to update uv first.

NVIDIA Blackwell GPUs (B200, GB200) require a minimum of CUDA 12.8, so make sure you are installing PyTorch wheels with at least that version. PyTorch itself offers a dedicated interface to determine the appropriate pip command to run for a given target configuration.

As of now, vLLM's binaries are compiled with CUDA 12.9 and public PyTorch release versions by default. We also provide vLLM binaries compiled with CUDA 12.8, 13.0, and public PyTorch release versions:

LLM inference is a fast-evolving field, and the latest code may contain bug fixes, performance improvements, and new features that are not released yet. To allow users to try the latest code without waiting for the next release, vLLM provides wheels for every commit since v0.5.3 on https://wheels.vllm.ai/nightly. There are multiple indices that could be used:

To install from nightly index, run:

Using pip to install from nightly indices is not supported, because pip combines packages from --extra-index-url and the default index, choosing only the latest version, which makes it difficult to install a development version prior to the released version. In contrast, uv gives the extra index higher priority than the default index.

If you insist on using pip, you have to specify the full URL of the wheel file (which can be obtained from the web page).

If you want to access the wheels for previous commits (e.g. to bisect the behavior change, performance regression), you can specify the commit hash in the URL:

Currently, there are no pre-built ROCm wheels.

Currently, there are no pre-built XPU wheels.

If you only need to change Python code, you can build and install vLLM without compilation. Using uv pip's --editable flag, changes you make to the code will be reflected when you run vLLM:

This command will do the following:

In case you see an error about wheel not found when running the above command, it might be because the commit you based on in the main branch was just merged and the wheel is being built. In this case, you can wait for around an hour to try again, or manually assign the previous commit in the installation using the VLLM_PRECOMPILED_WHEEL_LOCATION environment variable.

There are more environment variables to control the behavior of Python-only build:

You can find more information about vLLM's wheels in Install the latest code.

There is a possibility that your source code may have a different commit ID compared to the latest vLLM wheel, which could potentially lead to unknown errors. It is recommended to use the same commit ID for the source code as the vLLM wheel you have installed. Please refer to Install the latest code for instructions on how to install a specified wheel.

If you want to modify C++ or CUDA code, you'll need to build vLLM from source. This can take several minutes:

Building from source requires a lot of compilation. If you are building from source repeatedly, it's more efficient to cache the compilation results.

For example, you can install ccache using conda install ccache or apt install ccache . As long as which ccache command can find the ccache binary, it will be used automatically by the build system. After the first build, subsequent builds will be much faster.

When using ccache with pip install -e ., you should run CCACHE_NOHASHDIR="true" pip install --no-build-isolation -e .. This is because pip creates a new folder with a random name for each build, preventing ccache from recognizing that the same files are being built.

sccache works similarly to ccache, but has the capability to utilize caching in remote storage environments. The following environment variables can be set to configure the vLLM sccache remote: SCCACHE_BUCKET=vllm-build-sccache SCCACHE_REGION=us-west-2 SCCACHE_S3_NO_CREDENTIALS=1. We also recommend setting SCCACHE_IDLE_TIMEOUT=0.

Faster Kernel Development

For frequent C++/CUDA kernel changes, after the initial uv pip install -e . setup, consider using the Incremental Compilation Workflow for significantly faster rebuilds of only the modified kernel code.

There are scenarios where the PyTorch dependency cannot be easily installed with uv, for example, when building vLLM with non-default PyTorch builds (like nightly or a custom build).

To build vLLM using an existing PyTorch installation:

Alternatively: if you are exclusively using uv to create and manage virtual environments, it has a unique mechanism for disabling build isolation for specific packages. vLLM can leverage this mechanism to specify torch as the package to disable build isolation for:

Currently, before starting the build process, vLLM fetches cutlass code from GitHub. However, there may be scenarios where you want to use a local version of cutlass instead. To achieve this, you can set the environment variable VLLM_CUTLASS_SRC_DIR to point to your local cutlass directory.

To avoid your system being overloaded, you can limit the number of compilation jobs to be run simultaneously, via the environment variable MAX_JOBS. For example:

This is especially useful when you are building on less powerful machines. For example, when you use WSL it only assigns 50% of the total memory by default, so using export MAX_JOBS=1 can avoid compiling multiple files simultaneously and running out of memory. A side effect is a much slower build process.

Additionally, if you have trouble building vLLM, we recommend using the NVIDIA PyTorch Docker image.

If you don't want to use docker, it is recommended to have a full installation of CUDA Toolkit. You can download and install it from the official website. After installation, set the environment variable CUDA_HOME to the installation path of CUDA Toolkit, and make sure that the nvcc compiler is in your PATH, e.g.:

Here is a sanity check to verify that the CUDA Toolkit is correctly installed:

vLLM can fully run only on Linux but for development purposes, you can still build it on other systems (for example, macOS), allowing for imports and a more convenient development environment. The binaries will not be compiled and won't work on non-Linux systems.

Simply disable the VLLM_TARGET_DEVICE environment variable before installing:

Install prerequisites (skip if you are already in an environment/docker with the following installed):

For installing PyTorch, you can start from a fresh docker image, e.g, rocm/pytorch:rocm7.0_ubuntu22.04_py3.10_pytorch_release_2.8.0, rocm/pytorch-nightly. If you are using docker image, you can skip to Step 3.

Alternatively, you can install PyTorch using PyTorch wheels. You can check PyTorch installation guide in PyTorch Getting Started. Example:

Install Triton for ROCm

Install ROCm's Triton following the instructions from ROCm/triton

Optionally, if you choose to use CK flash attention, you can install flash attention for ROCm

Install ROCm's flash attention (v2.8.0) following the instructions from ROCm/flash-attention

For example, for ROCm 7.0, suppose your gfx arch is gfx942. To get your gfx architecture, run rocminfo |grep gfx.

If you choose to build AITER yourself to use a certain branch or commit, you can build AITER using the following steps:

Build vLLM. For example, vLLM on ROCM 7.0 can be built with the following steps:

This may take 5-10 minutes. Currently, pip install . does not work for ROCm installation.

See Using Docker for instructions on using the official Docker image.

Another way to access the latest code is to use the docker images:

These docker images are used for CI and testing only, and they are not intended for production use. They will be expired after several days.

The latest code can contain bugs and may not be stable. Please use it with caution.

The AMD Infinity hub for vLLM offers a prebuilt, optimized docker image designed for validating inference performance on the AMD Instinct™ MI300X accelerator. AMD also offers nightly prebuilt docker image from Docker Hub, which has vLLM and all its dependencies installed.

Please check LLM inference performance validation on AMD Instinct MI300X for instructions on how to use this prebuilt docker image.

Currently, we release prebuilt XPU images at docker hub based on vLLM released version. For more information, please refer release note.

See Building vLLM's Docker Image from Source for instructions on building the Docker image.

Building the Docker image from source is the recommended way to use vLLM with ROCm.

Build a docker image from docker/Dockerfile.rocm_base which setup ROCm software stack needed by the vLLM. This step is optional as this rocm_base image is usually prebuilt and store at Docker Hub under tag rocm/vllm-dev:base to speed up user experience. If you choose to build this rocm_base image yourself, the steps are as follows.

It is important that the user kicks off the docker build using buildkit. Either the user put DOCKER_BUILDKIT=1 as environment variable when calling docker build command, or the user needs to set up buildkit in the docker daemon configuration /etc/docker/daemon.json as follows and restart the daemon:

To build vllm on ROCm 7.0 for MI200 and MI300 series, you can use the default:

First, build a docker image from docker/Dockerfile.rocm and launch a docker container from the image. It is important that the user kicks off the docker build using buildkit. Either the user put DOCKER_BUILDKIT=1 as environment variable when calling docker build command, or the user needs to set up buildkit in the docker daemon configuration /etc/docker/daemon.json as follows and restart the daemon:

docker/Dockerfile.rocm uses ROCm 7.0 by default, but also supports ROCm 5.7, 6.0, 6.1, 6.2, 6.3, and 6.4, in older vLLM branches. It provides flexibility to customize the build of docker image using the following arguments:

Their values can be passed in when running docker build with --build-arg options.

To build vllm on ROCm 7.0 for MI200 and MI300 series, you can use the default:

To run the above docker image vllm-rocm, use the below command:

Where the <path/to/model> is the location where the model is stored, for example, the weights for llama2 or llama3 models.

See Feature x Hardware compatibility matrix for feature support information.

See Feature x Hardware compatibility matrix for feature support information.

XPU platform supports tensor parallel inference/serving and also supports pipeline parallel as a beta feature for online serving. For pipeline parallel, we support it on single node with mp as the backend. For example, a reference execution like following:

By default, a ray instance will be launched automatically if no existing one is detected in the system, with num-gpus equals to parallel_config.world_size. We recommend properly starting a ray cluster before execution, referring to the examples/online_serving/run_cluster.sh helper script.

**Examples:**

Example 1 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
```

Example 2 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
```

Example 3 (unknown):
```unknown
uv pip install vllm --torch-backend=auto
```

Example 4 (unknown):
```unknown
uv pip install vllm --torch-backend=auto
```

---

## Installation - vLLM

**URL:** https://docs.vllm.ai/en/latest/getting_started/installation/

**Contents:**
- Installation¶
- Hardware Plugins¶

vLLM supports the following hardware platforms:

The backends below live outside the main vllm repository and follow the Hardware-Pluggable RFC.

---

## Quickstart - vLLM

**URL:** https://docs.vllm.ai/en/latest/getting_started/quickstart/

**Contents:**
- Quickstart¶
- Prerequisites¶
- Installation¶
- Offline Batched Inference¶
- OpenAI-Compatible Server¶
  - OpenAI Completions API with vLLM¶
  - OpenAI Chat Completions API with vLLM¶
- On Attention Backends¶

This guide will help you quickly get started with vLLM to perform:

If you are using NVIDIA GPUs, you can install vLLM using pip directly.

It's recommended to use uv, a very fast Python environment manager, to create and manage Python environments. Please follow the documentation to install uv. After installing uv, you can create a new Python environment and install vLLM using the following commands:

uv can automatically select the appropriate PyTorch index at runtime by inspecting the installed CUDA driver version via --torch-backend=auto (or UV_TORCH_BACKEND=auto). To select a specific backend (e.g., cu126), set --torch-backend=cu126 (or UV_TORCH_BACKEND=cu126).

Another delightful way is to use uv run with --with [dependency] option, which allows you to run commands such as vllm serve without creating any permanent environment:

You can also use conda to create and manage Python environments. You can install uv to the conda environment through pip if you want to manage it within the environment.

Use a pre-built docker image from Docker Hub. The public stable image is rocm/vllm:latest. There is also a development image at rocm/vllm-dev.

The -v flag in the docker run command below mounts a local directory into the container. Replace <path/to/your/models> with the path on your host machine to the directory containing your models. The models will then be accessible inside the container at /app/models.

To run vLLM on Google TPUs, you need to install the vllm-tpu package.

For more detailed instructions, including Docker, installing from source, and troubleshooting, please refer to the vLLM on TPU documentation.

For more detail and non-CUDA platforms, please refer here for specific instructions on how to install vLLM.

With vLLM installed, you can start generating texts for list of input prompts (i.e. offline batch inferencing). See the example script: examples/offline_inference/basic/basic.py

The first line of this example imports the classes LLM and SamplingParams:

The next section defines a list of input prompts and sampling parameters for text generation. The sampling temperature is set to 0.8 and the nucleus sampling probability is set to 0.95. You can find more information about the sampling parameters here.

By default, vLLM will use sampling parameters recommended by model creator by applying the generation_config.json from the Hugging Face model repository if it exists. In most cases, this will provide you with the best results by default if SamplingParams is not specified.

However, if vLLM's default sampling parameters are preferred, please set generation_config="vllm" when creating the LLM instance.

The LLM class initializes vLLM's engine and the OPT-125M model for offline inference. The list of supported models can be found here.

By default, vLLM downloads models from Hugging Face. If you would like to use models from ModelScope, set the environment variable VLLM_USE_MODELSCOPE before initializing the engine.

Now, the fun part! The outputs are generated using llm.generate. It adds the input prompts to the vLLM engine's waiting queue and executes the vLLM engine to generate the outputs with high throughput. The outputs are returned as a list of RequestOutput objects, which include all of the output tokens.

The llm.generate method does not automatically apply the model's chat template to the input prompt. Therefore, if you are using an Instruct model or Chat model, you should manually apply the corresponding chat template to ensure the expected behavior. Alternatively, you can use the llm.chat method and pass a list of messages which have the same format as those passed to OpenAI's client.chat.completions:

vLLM can be deployed as a server that implements the OpenAI API protocol. This allows vLLM to be used as a drop-in replacement for applications using OpenAI API. By default, it starts the server at http://localhost:8000. You can specify the address with --host and --port arguments. The server currently hosts one model at a time and implements endpoints such as list models, create chat completion, and create completion endpoints.

Run the following command to start the vLLM server with the Qwen2.5-1.5B-Instruct model:

By default, the server uses a predefined chat template stored in the tokenizer. You can learn about overriding it here.

By default, the server applies generation_config.json from the huggingface model repository if it exists. This means the default values of certain sampling parameters can be overridden by those recommended by the model creator.

To disable this behavior, please pass --generation-config vllm when launching the server.

This server can be queried in the same format as OpenAI API. For example, to list the models:

You can pass in the argument --api-key or environment variable VLLM_API_KEY to enable the server to check for API key in the header. You can pass multiple keys after --api-key, and the server will accept any of the keys passed, this can be useful for key rotation.

Once your server is started, you can query the model with input prompts:

Since this server is compatible with OpenAI API, you can use it as a drop-in replacement for any applications using OpenAI API. For example, another way to query the server is via the openai Python package:

A more detailed client example can be found here: examples/offline_inference/basic/basic.py

vLLM is designed to also support the OpenAI Chat Completions API. The chat interface is a more dynamic, interactive way to communicate with the model, allowing back-and-forth exchanges that can be stored in the chat history. This is useful for tasks that require context or more detailed explanations.

You can use the create chat completion endpoint to interact with the model:

Alternatively, you can use the openai Python package:

Currently, vLLM supports multiple backends for efficient Attention computation across different platforms and accelerator architectures. It automatically selects the most performant backend compatible with your system and model specifications.

If desired, you can also manually set the backend of your choice using the --attention-backend CLI argument:

Some of the available backend options include:

For AMD ROCm, you can further control the specific Attention implementation using the following options:

There are no pre-built vllm wheels containing Flash Infer, so you must install it in your environment first. Refer to the Flash Infer official docs or see docker/Dockerfile for instructions on how to install it.

**Examples:**

Example 1 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
uv pip install vllm --torch-backend=auto
```

Example 2 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
uv pip install vllm --torch-backend=auto
```

Example 3 (unknown):
```unknown
uv run --with vllm vllm --help
```

Example 4 (unknown):
```unknown
uv run --with vllm vllm --help
```

---
