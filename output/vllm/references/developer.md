# Vllm - Developer

**Pages:** 10

---

## Basic Model - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/model/basic/

**Contents:**
- Basic Model¶
- 1. Bring your model code¶
- 2. Make your code compatible with vLLM¶
  - Initialization Code¶
  - Computation Code¶
- 3. (Optional) Implement tensor parallelism and quantization support¶
- 4. Implement the weight loading logic¶
- 5. Register your model¶
- Frequently Asked Questions¶
  - How to support models with interleaving sliding windows?¶

This guide walks you through the steps to implement a basic vLLM model.

First, clone the PyTorch model code from the source repository. For instance, vLLM's OPT model was adapted from HuggingFace's modeling_opt.py file.

Make sure to review and adhere to the original code's copyright and licensing terms!

To ensure compatibility with vLLM, your model must meet the following requirements:

All vLLM modules within the model must include a prefix argument in their constructor. This prefix is typically the full name of the module in the model's state dictionary and is crucial for:

The initialization code should look like this:

Currently, vLLM supports the basic multi-head attention mechanism and its variant with rotary positional embeddings. If your model employs a different attention mechanism, you will need to implement a new attention layer in vLLM.

For reference, check out our Llama implementation. vLLM already supports a large number of models. It is recommended to find a model similar to yours and adapt it to your model's architecture. Check out vllm/model_executor/models for more examples.

If your model is too large to fit into a single GPU, you can use tensor parallelism to manage it. To do this, substitute your model's linear and embedding layers with their tensor-parallel versions. For the embedding layer, you can simply replace torch.nn.Embedding with VocabParallelEmbedding. For the output LM head, you can use ParallelLMHead. When it comes to the linear layers, we provide the following options to parallelize them:

Note that all the linear layers above take linear_method as an input. vLLM will set this parameter according to different quantization schemes to support weight quantization.

You now need to implement the load_weights method in your *ForCausalLM class. This method should load the weights from the HuggingFace's checkpoint file and assign them to the corresponding layers in your model. Specifically, for MergedColumnParallelLinear and QKVParallelLinear layers, if the original model has separated weight matrices, you need to load the different parts separately.

See this page for instructions on how to register your new model to be used by vLLM.

To support a model with interleaving sliding windows, we need to take care of the following details:

With these two steps, interleave sliding windows should work with the model.

We consider 3 different scenarios:

For case (1), we recommend looking at the implementation of MambaForCausalLM (for Mamba-1) or Mamba2ForCausalLM (for Mamba-2) as a reference. The model should inherit protocol IsAttentionFree and also implement class methods get_mamba_state_dtype_from_config and get_mamba_state_shape_from_config to calculate the state shapes and data types from the config. For the mamba layers themselves, please use the MambaMixer (for Mamba-1) or MambaMixer2 (for Mamba-2) classes. The model should also be added to the MODELS_CONFIG_MAP dictionary in vllm/model_executor/models/config.py to ensure that the runtime defaults are optimized.

For case (2), we recommend using as a reference the implementation of JambaForCausalLM (for an example of a model that uses Mamba-1 and attention together) or BambaForCausalLM (for an example of a model that uses Mamba-2 and attention together). These models should follow the same instructions as case (1), but they should inherit protocol IsHybrid (instead of IsAttentionFree) and it is not necessary to add them to the MODELS_CONFIG_MAP (their runtime defaults will be inferred from the protocol).

For case (3), we recommend looking at the implementation of MiniMaxText01ForCausalLM or Lfm2ForCausalLM as a reference, which use custom "mamba-like" layers MiniMaxText01LinearAttention and ShortConv respectively. Please follow the same guidelines as case (2) for implementing these models. We use "mamba-like" to refer to layers that posses a state that is updated in-place, rather than being appended-to (like KV cache for attention). For implementing new custom mamba-like layers, one should inherit from MambaBase and implement the methods get_state_dtype, get_state_shape to calculate the data types and state shapes at runtime, as well as mamba_type and get_attn_backend. It is also necessary to implement the "attention meta-data" class which handles the meta-data that is common across all layers. Please see LinearAttentionMetadata or ShortConvAttentionMetadata for examples of this. It is also worth noting that we should update MAMBA_TYPE_TO_BACKEND_MAP and MambaAttentionBackendEnum in registry.py when adding a new mamba backend. Finally, if one wants to support torch compile and CUDA graphs, it necessary to wrap the call to the mamba-like layer inside a custom op and register it. Please see the calls to direct_register_custom_op in vllm/model_executor/models/minimax_text_01.py or vllm/model_executor/layers/mamba/short_conv.py for examples of this. The new custom op should then be added to the list _attention_ops in vllm/config/compilation.py to ensure that piecewise CUDA graphs works as intended.

**Examples:**

Example 1 (python):
```python
from torch import nn
from vllm.config import VllmConfig
from vllm.attention.layer import Attention

class MyAttention(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str):
        super().__init__()
        self.attn = Attention(prefix=f"{prefix}.attn")

class MyDecoderLayer(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str):
        super().__init__()
        self.self_attn = MyAttention(prefix=f"{prefix}.self_attn")

class MyModel(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str):
        super().__init__()
        self.layers = nn.ModuleList(
            [MyDecoderLayer(vllm_config, prefix=f"{prefix}.layers.{i}") for i in range(vllm_config.model_config.hf_config.num_hidden_layers)]
        )

class MyModelForCausalLM(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str = ""):
        super().__init__()
        self.model = MyModel(vllm_config, prefix=f"{prefix}.model")
```

Example 2 (python):
```python
from torch import nn
from vllm.config import VllmConfig
from vllm.attention.layer import Attention

class MyAttention(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str):
        super().__init__()
        self.attn = Attention(prefix=f"{prefix}.attn")

class MyDecoderLayer(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str):
        super().__init__()
        self.self_attn = MyAttention(prefix=f"{prefix}.self_attn")

class MyModel(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str):
        super().__init__()
        self.layers = nn.ModuleList(
            [MyDecoderLayer(vllm_config, prefix=f"{prefix}.layers.{i}") for i in range(vllm_config.model_config.hf_config.num_hidden_layers)]
        )

class MyModelForCausalLM(nn.Module):
    def __init__(self, vllm_config: VllmConfig, prefix: str = ""):
        super().__init__()
        self.model = MyModel(vllm_config, prefix=f"{prefix}.model")
```

Example 3 (php):
```php
class MyModel(nn.Module):
        ...

    def embed_input_ids(self, input_ids: torch.Tensor) -> torch.Tensor:
        ...
```

Example 4 (php):
```php
class MyModel(nn.Module):
        ...

    def embed_input_ids(self, input_ids: torch.Tensor) -> torch.Tensor:
        ...
```

---

## CI Failures - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/ci/failures/

**Contents:**
- CI Failures¶
- Filing a CI Test Failure Issue¶
- Logs Wrangling¶
- Investigating a CI Test Failure¶
- Reproducing a Failure¶
- Submitting a PR¶
- Other Resources¶
- Daily Triage¶

What should I do when a CI job fails on my PR, but I don't think my PR caused the failure?

Check the dashboard of current CI test failures: 👉 CI Failures Dashboard

If your failure is already listed, it's likely unrelated to your PR. Help fixing it is always welcome!

If your failure is not listed, you should file an issue.

File a bug report: 👉 New CI Failure Report

Use this title format:

For the environment field:

In the description, include failing tests:

Attach logs (collapsible section example):

Download the full log file from Buildkite locally.

Strip timestamps and colorization:

.buildkite/scripts/ci-clean-log.sh

Use a tool wl-clipboard for quick copy-pasting:

CI test failures may be flaky. Use a bash loop to run repeatedly:

.buildkite/scripts/rerun-test.sh

If you submit a PR to fix a CI failure:

Use Buildkite analytics (2-day view) to:

Compare to the CI Failures Dashboard.

**Examples:**

Example 1 (json):
```json
[CI Failure]: failing-test-job - regex/matching/failing:test
```

Example 2 (json):
```json
[CI Failure]: failing-test-job - regex/matching/failing:test
```

Example 3 (typescript):
```typescript
Still failing on main as of commit abcdef123
```

Example 4 (typescript):
```typescript
Still failing on main as of commit abcdef123
```

---

## Contributing to vLLM - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/

**Contents:**
- Contributing to vLLM¶
- Job Board¶
- License¶
- Developing¶
  - Linting¶
  - Documentation¶
  - Testing¶
- Issues¶
- Pull Requests & Code Reviews¶
  - DCO and Signed-off-by¶

Thank you for your interest in contributing to vLLM! Our community is open to everyone and welcomes all kinds of contributions, no matter how small or large. There are several ways you can contribute to the project:

We also believe in the power of community support; thus, answering queries, offering PR reviews, and assisting others are also highly regarded and beneficial contributions.

Finally, one of the most impactful ways to support us is by raising awareness about vLLM. Talk about it in your blog posts and highlight how it's driving your incredible projects. Express your support on social media if you're using vLLM, or simply offer your appreciation by starring our repository!

Unsure on where to start? Check out the following links for tasks to work on:

The first step of contributing to vLLM is to clone the GitHub repository:

Then, configure your Python virtual environment.

It's recommended to use uv, a very fast Python environment manager, to create and manage Python environments. Please follow the documentation to install uv. After installing uv, you can create a new Python environment using the following commands:

If you are only developing vLLM's Python code, install vLLM using:

If you are developing vLLM's Python and CUDA/C++ code, install vLLM using:

For more details about installing from source and installing for other hardware, check out the installation instructions for your hardware and head to the "Build wheel from source" section.

For an optimized workflow when iterating on C++/CUDA kernels, see the Incremental Compilation Workflow for recommendations.

vLLM is compatible with Python versions 3.10 to 3.13. However, vLLM's default Dockerfile ships with Python 3.12 and tests in CI (except mypy) are run with Python 3.12.

Therefore, we recommend developing with Python 3.12 to minimise the chance of your local environment clashing with our CI environment.

vLLM uses pre-commit to lint and format the codebase. See https://pre-commit.com/#usage if pre-commit is new to you. Setting up pre-commit is as easy as:

vLLM's pre-commit hooks will now run automatically every time you commit.

You can manually run the pre-commit hooks using:

Some pre-commit hooks only run in CI. If you need to, you can run them locally with:

MkDocs is a fast, simple and downright gorgeous static site generator that's geared towards building project documentation. Documentation source files are written in Markdown, and configured with a single YAML configuration file, mkdocs.yaml.

Ensure that your Python version is compatible with the plugins (e.g., mkdocs-awesome-nav requires Python 3.10+)

MkDocs comes with a built-in dev-server that lets you preview your documentation as you work on it. From the root of the repository, run:

Once you see Serving on http://127.0.0.1:8000/ in the logs, the live preview is ready! Open http://127.0.0.1:8000/ in your browser to see it.

For additional features and advanced configurations, refer to the:

vLLM uses pytest to test the codebase.

Install python3-dev if Python.h is missing

If any of the above commands fails with Python.h: No such file or directory, install python3-dev with sudo apt install python3-dev.

Currently, the repository is not fully checked by mypy.

Currently, not all unit tests pass when run on CPU platforms. If you don't have access to a GPU platform to run unit tests locally, rely on the continuous integration system to run the tests for now.

If you encounter a bug or have a feature request, please search existing issues first to see if it has already been reported. If not, please file a new issue, providing as much relevant information as possible.

If you discover a security vulnerability, please follow the instructions here.

Thank you for your contribution to vLLM! Before submitting the pull request, please ensure the PR meets the following criteria. This helps vLLM maintain the code quality and improve the efficiency of the review process.

When contributing changes to this project, you must agree to the DCO. Commits must include a Signed-off-by: header which certifies agreement with the terms of the DCO.

Using -s with git commit will automatically add this header.

You can enable automatic sign-off via your IDE:

Only specific types of PRs will be reviewed. The PR title is prefixed appropriately to indicate the type of change. Please use one of the following:

If the PR spans more than one category, please include all relevant prefixes.

The PR needs to meet the following code quality standards:

When actively developing or modifying kernels, using the Incremental Compilation Workflow is highly recommended for faster build times. Each custom kernel needs a schema and one or more implementations to be registered with PyTorch.

Please keep the changes as concise as possible. For major architectural changes (>500 LOC excluding kernel/data/config/test), we would expect a GitHub issue (RFC) discussing the technical design and justification. Otherwise, we will tag it with rfc-required and might not go through the PR.

The goal of the vLLM team is to be a transparent reviewing machine. We would like to make the review process transparent and efficient and make sure no contributor feels confused or frustrated. However, the vLLM team is small, so we need to prioritize some PRs over others. Here is what you can expect from the review process:

Finally, thank you for taking the time to read these guidelines and for your interest in contributing to vLLM. All of your contributions help make vLLM a great tool and community for everyone!

**Examples:**

Example 1 (unknown):
```unknown
git clone https://github.com/vllm-project/vllm.git
cd vllm
```

Example 2 (unknown):
```unknown
git clone https://github.com/vllm-project/vllm.git
cd vllm
```

Example 3 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
```

Example 4 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
```

---

## Deprecation Policy - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/deprecation_policy/

**Contents:**
- Deprecation Policy¶
- Overview¶
- Deprecation Pipeline¶
  - 1. Deprecated (Still On By Default)¶
  - 2.Deprecated (Off By Default)¶
  - 3. Removed¶
- Example Timeline¶
- Important Guidelines¶
- Final Notes¶

This document outlines the official policy and process for deprecating features in the vLLM project.

vLLM uses a structured "deprecation pipeline" to guide the lifecycle of deprecated features. This policy ensures that users are given clear and sufficient notice when a feature is deprecated and that deprecations proceed in a consistent and predictable manner.

We aim to strike a balance between continued innovation and respecting users’ reliance on existing functionality. Deprecations are tied to our minor (Y) releases following semantic versioning (X.Y.Z), where:

Features that fall under this policy include (at a minimum) the following:

The deprecation process consists of several clearly defined stages that span multiple Y releases:

Assume a feature is deprecated in v0.9.0.

This policy is a living document and may evolve as the needs of the project and its users change. Community feedback is welcome and encouraged as we refine the process.

---

## Incremental Compilation Workflow - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/incremental_build/

**Contents:**
- Incremental Compilation Workflow¶
- Prerequisites¶
- Setting up the CMake Build Environment¶
  - Generate CMakeUserPresets.json using the helper script¶
  - Example CMakeUserPresets.json¶
- Building and Installing with CMake¶
- Verifying the Build¶
- Additional Tips¶

When working on vLLM's C++/CUDA kernels located in the csrc/ directory, recompiling the entire project with uv pip install -e . for every change can be time-consuming. An incremental compilation workflow using CMake allows for faster iteration by only recompiling the necessary components after an initial setup. This guide details how to set up and use such a workflow, which complements your editable Python installation.

Before setting up the incremental build:

vLLM Editable Install: Ensure you have vLLM installed from source in an editable mode. Using pre-compiled wheels for the initial editable setup can be faster, as the CMake workflow will handle subsequent kernel recompilations.

CUDA Toolkit: Verify that the NVIDIA CUDA Toolkit is correctly installed and nvcc is accessible in your PATH. CMake relies on nvcc to compile CUDA code. You can typically find nvcc in $CUDA_HOME/bin/nvcc or by running which nvcc. If you encounter issues, refer to the official CUDA Toolkit installation guides and vLLM's main GPU installation documentation for troubleshooting. The CMAKE_CUDA_COMPILER variable in your CMakeUserPresets.json should also point to your nvcc binary.

Build Tools: It is highly recommended to install ccache for fast rebuilds by caching compilation results (e.g., sudo apt install ccache or conda install ccache). Also, ensure the core build dependencies like cmake and ninja are installed. These are installable through requirements/build.txt or your system's package manager.

The incremental build process is managed through CMake. You can configure your build settings using a CMakeUserPresets.json file at the root of the vLLM repository.

To simplify the setup, vLLM provides a helper script that attempts to auto-detect your system's configuration (like CUDA path, Python environment, and CPU cores) and generates the CMakeUserPresets.json file for you.

Navigate to the root of your vLLM clone and execute the following command:

The script will prompt you if it cannot automatically determine certain paths (e.g., nvcc or a specific Python executable for your vLLM development environment). Follow the on-screen prompts. If an existing CMakeUserPresets.json is found, the script will ask for confirmation before overwriting it.

Force overwrite existing file:

To automatically overwrite an existing CMakeUserPresets.json without prompting, use the --force-overwrite flag:

This is particularly useful in automated scripts or CI/CD environments where interactive prompts are not desired.

After running the script, a CMakeUserPresets.json file will be created in the root of your vLLM repository.

Below is an example of what the generated CMakeUserPresets.json might look like. The script will tailor these values based on your system and any input you provide.

What do the various configurations mean?

Once your CMakeUserPresets.json is configured:

Initialize the CMake build environment: This step configures the build system according to your chosen preset (e.g., release) and creates the build directory at binaryDir

Build and install the vLLM components: This command compiles the code and installs the resulting binaries into your vLLM source directory, making them available to your editable Python installation.

Make changes and repeat! Now you start using your editable install of vLLM, testing and making changes as needed. If you need to build again to update based on changes, simply run the CMake command again to build only the affected files.

After a successful build, you will find a populated build directory (e.g., cmake-build-release/ if you used the release preset and the example configuration).

The cmake --build ... --target install command copies the compiled shared libraries (like _C.abi3.so, _moe_C.abi3.so, etc.) into the appropriate vllm package directory within your source tree. This updates your editable installation with the newly compiled kernels.

**Examples:**

Example 1 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
VLLM_USE_PRECOMPILED=1 uv pip install -U -e . --torch-backend=auto
```

Example 2 (unknown):
```unknown
uv venv --python 3.12 --seed
source .venv/bin/activate
VLLM_USE_PRECOMPILED=1 uv pip install -U -e . --torch-backend=auto
```

Example 3 (unknown):
```unknown
uv pip install -r requirements/build.txt --torch-backend=auto
```

Example 4 (unknown):
```unknown
uv pip install -r requirements/build.txt --torch-backend=auto
```

---

## Nightly Builds of vLLM Wheels - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/ci/nightly_builds/

**Contents:**
- Nightly Builds of vLLM Wheels¶
- Build and Upload Process on CI¶
  - Wheel Building¶
  - Index Generation¶
- Directory Structure¶
  - Variant Organization¶
- Index Generation Details¶
  - Special Handling for AWS Services¶
- Usage of precompiled wheels in setup.py¶
- Implementation Files¶

vLLM maintains a per-commit wheel repository (commonly referred to as "nightly") at https://wheels.vllm.ai that provides pre-built wheels for every commit on the main branch since v0.5.3. This document explains how the nightly wheel index mechanism works.

Wheels are built in the Release pipeline (.buildkite/release-pipeline.yaml) after a PR is merged into the main branch, with multiple variants:

After uploading each wheel, the .buildkite/scripts/upload-wheels.sh script:

Handling Concurrent Builds

The index generation script can handle multiple variants being built concurrently by always listing all wheels in the commit directory before generating indices, avoiding race conditions.

The S3 bucket structure follows this pattern:

All built wheels are stored in /{commit_hash}/, while different indices are generated and reference them. This avoids duplication of wheel files.

For example, you can specify the following URLs to use different indices:

Please note that not all variants are present on every commit. The available variants are subject to change over time, e.g., changing cu130 to cu131.

Indices are organized by variant:

The variant is extracted from the wheel filename (as described in the file name convention):

The generate-nightly-index.py script performs the following:

The wheels and indices are directly stored on AWS S3, and we use AWS CloudFront as a CDN in front of the S3 bucket.

Since S3 does not provide proper directory listing, to support PyPI-compatible simple repository API behavior, we deploy a CloudFront Function that:

For example, the following requests would be handled as:

AWS S3 Filename Escaping

S3 will automatically escape filenames upon upload according to its naming rule. The direct impact on vllm is that + in filenames will be converted to %2B. We take special care in the index generation script to escape filenames properly when generating the HTML indices and JSON metadata, to ensure the URLs are correct and can be directly used.

When installing vLLM with VLLM_USE_PRECOMPILED=1, the setup.py script:

What is the base commit?

The base commit is determined by finding the merge-base between the current branch and upstream main, ensuring compatibility between source code and precompiled binaries.

Note: it's users' responsibility to ensure there is no native code (e.g., C++ or CUDA) changes before using precompiled wheels.

Key files involved in the nightly wheel mechanism:

**Examples:**

Example 1 (go):
```go
s3://vllm-wheels/
├── {commit_hash}/              # Commit-specific wheels and indices
│   ├── vllm-*.whl              # All wheel files
│   ├── index.html              # Project list (default variant)
│   ├── vllm/
│   │   ├── index.html          # Package index (default variant)
│   │   └── metadata.json       # Metadata (default variant)
│   ├── cu129/                  # Variant subdirectory
│   │   ├── index.html          # Project list (cu129 variant)
│   │   └── vllm/
│   │       ├── index.html      # Package index (cu129 variant)
│   │       └── metadata.json   # Metadata (cu129 variant)
│   ├── cu130/                  # Variant subdirectory
│   ├── cpu/                    # Variant subdirectory
│   └── .../                    # More variant subdirectories
├── nightly/                    # Latest main branch wheels (mirror of latest commit)
└── {version}/                  # Release version indices (e.g., 0.11.2)
```

Example 2 (go):
```go
s3://vllm-wheels/
├── {commit_hash}/              # Commit-specific wheels and indices
│   ├── vllm-*.whl              # All wheel files
│   ├── index.html              # Project list (default variant)
│   ├── vllm/
│   │   ├── index.html          # Package index (default variant)
│   │   └── metadata.json       # Metadata (default variant)
│   ├── cu129/                  # Variant subdirectory
│   │   ├── index.html          # Project list (cu129 variant)
│   │   └── vllm/
│   │       ├── index.html      # Package index (cu129 variant)
│   │       └── metadata.json   # Metadata (cu129 variant)
│   ├── cu130/                  # Variant subdirectory
│   ├── cpu/                    # Variant subdirectory
│   └── .../                    # More variant subdirectories
├── nightly/                    # Latest main branch wheels (mirror of latest commit)
└── {version}/                  # Release version indices (e.g., 0.11.2)
```

---

## Registering a Model - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/model/registration/

**Contents:**
- Registering a Model¶
- Built-in models¶
- Out-of-tree models¶

vLLM relies on a model registry to determine how to run each model. A list of pre-registered architectures can be found here.

If your model is not on this list, you must register it to vLLM. This page provides detailed instructions on how to do so.

To add a model directly to the vLLM library, start by forking our GitHub repository and then build it from source. This gives you the ability to modify the codebase and test your model.

After you have implemented your model (see tutorial), put it into the vllm/model_executor/models directory. Then, add your model class to _VLLM_MODELS in vllm/model_executor/models/registry.py so that it is automatically registered upon importing vLLM. Finally, update our list of supported models to promote your model!

The list of models in each section should be maintained in alphabetical order.

You can load an external model using a plugin without modifying the vLLM codebase.

To register the model, use the following code:

If your model imports modules that initialize CUDA, consider lazy-importing it to avoid errors like RuntimeError: Cannot re-initialize CUDA in forked subprocess:

If your model is a multimodal model, ensure the model class implements the SupportsMultiModal interface. Read more about that here.

**Examples:**

Example 1 (python):
```python
# The entrypoint of your plugin
def register():
    from vllm import ModelRegistry
    from your_code import YourModelForCausalLM

    ModelRegistry.register_model("YourModelForCausalLM", YourModelForCausalLM)
```

Example 2 (python):
```python
# The entrypoint of your plugin
def register():
    from vllm import ModelRegistry
    from your_code import YourModelForCausalLM

    ModelRegistry.register_model("YourModelForCausalLM", YourModelForCausalLM)
```

Example 3 (python):
```python
# The entrypoint of your plugin
def register():
    from vllm import ModelRegistry

    ModelRegistry.register_model(
        "YourModelForCausalLM",
        "your_code:YourModelForCausalLM",
    )
```

Example 4 (python):
```python
# The entrypoint of your plugin
def register():
    from vllm import ModelRegistry

    ModelRegistry.register_model(
        "YourModelForCausalLM",
        "your_code:YourModelForCausalLM",
    )
```

---

## Summary - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/model/

**Contents:**
- Summary¶

Many decoder language models can now be automatically loaded using the Transformers modeling backend without having to implement them in vLLM. See if vllm serve <model> works first!

vLLM models are specialized PyTorch models that take advantage of various features to optimize their performance.

The complexity of integrating a model into vLLM depends heavily on the model's architecture. The process is considerably straightforward if the model shares a similar architecture with an existing model in vLLM. However, this can be more complex for models that include new operators (e.g., a new attention mechanism).

Read through these pages for a step-by-step guide:

If you are encountering issues while integrating your model into vLLM, feel free to open a GitHub issue or ask on our developer slack. We will be happy to help you out!

---

## Update PyTorch version on vLLM OSS CI/CD - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/ci/update_pytorch_version/

**Contents:**
- Update PyTorch version on vLLM OSS CI/CD¶
- Test PyTorch release candidates (RCs)¶
- Update CUDA version¶
- Manually running vLLM builds on BuildKiteCI¶
- Update all the different vLLM platforms¶

vLLM's current policy is to always use the latest PyTorch stable release in CI/CD. It is standard practice to submit a PR to update the PyTorch version as early as possible when a new PyTorch stable release becomes available. This process is non-trivial due to the gap between PyTorch releases. Using Pull Request #16859 as an example, this document outlines common steps to achieve this update along with a list of potential issues and how to address them.

Updating PyTorch in vLLM after the official release is not ideal because any issues discovered at that point can only be resolved by waiting for the next release or by implementing hacky workarounds in vLLM. The better solution is to test vLLM with PyTorch release candidates (RC) to ensure compatibility before each release.

PyTorch release candidates can be downloaded from PyTorch test index. For example, torch2.7.0+cu12.8 RC can be installed using the following command:

When the final RC is ready for testing, it will be announced to the community on the PyTorch dev-discuss forum. After this announcement, we can begin testing vLLM integration by drafting a pull request following this 3-step process:

Update requirements files to point to the new releases for torch, torchvision, and torchaudio.

Use the following option to get the final release candidates' wheels. Some common platforms are cpu, cu128, and rocm6.2.4.

Since vLLM uses uv, ensure the following index strategy is applied:

If failures are found in the pull request, raise them as issues on vLLM and cc the PyTorch release team to initiate discussion on how to address them.

The PyTorch release matrix includes both stable and experimental CUDA versions. Due to limitations, only the latest stable CUDA version (for example, torch 2.7.1+cu126) is uploaded to PyPI. However, vLLM may require a different CUDA version, such as 12.8 for Blackwell support. This complicates the process as we cannot use the out-of-the-box pip install torch torchvision torchaudio command. The solution is to use --extra-index-url in vLLM's Dockerfiles.

When building vLLM with a new PyTorch/CUDA version, the vLLM sccache S3 bucket will not have any cached artifacts, which can cause CI build jobs to exceed 5 hours. Furthermore, vLLM's fastcheck pipeline operates in read-only mode and does not populate the cache, making it ineffective for cache warm-up purposes.

To address this, manually trigger a build on Buildkite to accomplish two objectives:

Rather than attempting to update all vLLM platforms in a single pull request, it's more manageable to handle some platforms separately. The separation of requirements and Dockerfiles for different platforms in vLLM CI/CD allows us to selectively choose which platforms to update. For instance, updating XPU requires the corresponding release from Intel Extension for PyTorch by Intel. While Pull Request #16859 updated vLLM to PyTorch 2.7.0 on CPU, CUDA, and ROCm, Pull Request #17444 completed the update for XPU.

**Examples:**

Example 1 (unknown):
```unknown
uv pip install torch torchvision torchaudio \
    --index-url https://download.pytorch.org/whl/test/cu128
```

Example 2 (unknown):
```unknown
uv pip install torch torchvision torchaudio \
    --index-url https://download.pytorch.org/whl/test/cu128
```

Example 3 (typescript):
```typescript
--extra-index-url https://download.pytorch.org/whl/test/<PLATFORM>
```

Example 4 (typescript):
```typescript
--extra-index-url https://download.pytorch.org/whl/test/<PLATFORM>
```

---

## Vulnerability Management - vLLM

**URL:** https://docs.vllm.ai/en/latest/contributing/vulnerability_management/

**Contents:**
- Vulnerability Management¶
- Reporting Vulnerabilities¶
- Vulnerability Management Team¶
  - Security Advisories¶
  - Team Members¶
- Slack Discussion¶
- Vulnerability Disclosure¶

As mentioned in the security policy, security vulnerabilities may be reported privately to the project via GitHub.

Once a vulnerability has been reported to the project, the Vulnerability Management Team (VMT) is responsible for managing the vulnerability. The VMT is responsible for:

Advisories are published via GitHub through the same system used to report vulnerabilities. More information on the process can be found in the GitHub documentation.

We prefer to keep all vulnerability-related communication on the security report on GitHub. However, if you need to contact the VMT directly for an urgent issue, you may contact the following individuals:

You may use the #security channel in the vLLM Slack to discuss security-related topics. However, please do not disclose any vulnerabilities in this channel. If you need to report a vulnerability, please use the GitHub security advisory system or contact a VMT member privately.

The process for disclosing vulnerabilities is the following:

The VMT and project maintainers will work to minimize the amount of time in between disclosing any public information about the vulnerability and making a release and advisory available.

---
