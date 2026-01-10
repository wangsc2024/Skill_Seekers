# Autogen - Other

**Pages:** 10

---

## autogen_ext.cache_store.diskcache — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.cache_store.diskcache.html

**Contents:**
- autogen_ext.cache_store.diskcache#

Configuration for DiskCacheStore

Show JSON schema{ "title": "DiskCacheStoreConfig", "description": "Configuration for DiskCacheStore", "type": "object", "properties": { "directory": { "title": "Directory", "type": "string" } }, "required": [ "directory" ] }

Bases: CacheStore[T], Component[DiskCacheStoreConfig]

A typed CacheStore implementation that uses diskcache as the underlying storage. See ChatCompletionCache for an example of usage.

cache_instance – An instance of diskcache.Cache. The user is responsible for managing the DiskCache instance’s lifetime.

alias of DiskCacheStoreConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Retrieve an item from the store.

key – The key identifying the item in the store.

default (optional) – The default value to return if the key is not found. Defaults to None.

The value associated with the key if found, else the default value.

Set an item in the store.

key – The key under which the item is to be stored.

value – The value to be stored in the store.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.auth.azure

autogen_ext.cache_store.redis

**Examples:**

Example 1 (json):
```json
{
   "title": "DiskCacheStoreConfig",
   "description": "Configuration for DiskCacheStore",
   "type": "object",
   "properties": {
      "directory": {
         "title": "Directory",
         "type": "string"
      }
   },
   "required": [
      "directory"
   ]
}
```

Example 2 (json):
```json
{
   "title": "DiskCacheStoreConfig",
   "description": "Configuration for DiskCacheStore",
   "type": "object",
   "properties": {
      "directory": {
         "title": "Directory",
         "type": "string"
      }
   },
   "required": [
      "directory"
   ]
}
```

---

## autogen_ext.cache_store.redis — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.cache_store.redis.html

**Contents:**
- autogen_ext.cache_store.redis#

Configuration for RedisStore

Show JSON schema{ "title": "RedisStoreConfig", "description": "Configuration for RedisStore", "type": "object", "properties": { "host": { "default": "localhost", "title": "Host", "type": "string" }, "port": { "default": 6379, "title": "Port", "type": "integer" }, "db": { "default": 0, "title": "Db", "type": "integer" }, "username": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Username" }, "password": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Password" }, "ssl": { "default": false, "title": "Ssl", "type": "boolean" }, "socket_timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Socket Timeout" } } }

password (str | None)

socket_timeout (float | None)

username (str | None)

Bases: CacheStore[T], Component[RedisStoreConfig]

A typed CacheStore implementation that uses redis as the underlying storage. See ChatCompletionCache for an example of usage.

This implementation provides automatic serialization and deserialization for: - Pydantic models (uses model_dump_json/model_validate_json) - Primitive types (strings, numbers, etc.)

cache_instance – An instance of redis.Redis. The user is responsible for managing the Redis instance’s lifetime.

alias of RedisStoreConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Retrieve a value from the Redis cache.

This method handles both primitive values and complex objects: - Pydantic models are automatically deserialized from JSON - Primitive values (strings, numbers, etc.) are returned as-is - If deserialization fails, returns the raw value or default

key – The key to retrieve

default – Value to return if key doesn’t exist

The value if found and properly deserialized, otherwise the default

Store a value in the Redis cache.

This method handles both primitive values and complex objects: - Pydantic models are automatically serialized to JSON - Lists containing Pydantic models are serialized to JSON - Primitive values (strings, numbers, etc.) are stored as-is

key – The key to store the value under

value – The value to store

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.cache_store.diskcache

autogen_ext.code_executors.azure

**Examples:**

Example 1 (json):
```json
{
   "title": "RedisStoreConfig",
   "description": "Configuration for RedisStore",
   "type": "object",
   "properties": {
      "host": {
         "default": "localhost",
         "title": "Host",
         "type": "string"
      },
      "port": {
         "default": 6379,
         "title": "Port",
         "type": "integer"
      },
      "db": {
         "default": 0,
         "title": "Db",
         "type": "integer"
      },
      "username": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Username"
      },
      "password": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Password"
      },
      "ssl": {
         "default": false,
         "title": "Ssl",
         "type": "boolean"
      },
      "socket_timeout": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Socket Timeout"
      }
   }
}
```

Example 2 (json):
```json
{
   "title": "RedisStoreConfig",
   "description": "Configuration for RedisStore",
   "type": "object",
   "properties": {
      "host": {
         "default": "localhost",
         "title": "Host",
         "type": "string"
      },
      "port": {
         "default": 6379,
         "title": "Port",
         "type": "integer"
      },
      "db": {
         "default": 0,
         "title": "Db",
         "type": "integer"
      },
      "username": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Username"
      },
      "password": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Password"
      },
      "ssl": {
         "default": false,
         "title": "Ssl",
         "type": "boolean"
      },
      "socket_timeout": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Socket Timeout"
      }
   }
}
```

---

## autogen_ext.cache_store — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.cache_store.html

**Contents:**
- autogen_ext.cache_store#

autogen_ext.code_executors

---

## autogen_ext.code_executors.docker — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.docker.html

**Contents:**
- autogen_ext.code_executors.docker#

Bases: CodeExecutor, Component[DockerCommandLineCodeExecutorConfig]

Executes code through a command line environment in a Docker container.

This class requires the docker extra for the autogen-ext package:

The executor first saves each code block in a file in the working directory, and then executes the code file in the container. The executor executes the code blocks in the order they are received. Currently, the executor only supports Python and shell scripts. For Python code, use the language “python” for the code block. For shell scripts, use the language “bash”, “shell”, “sh”, “pwsh”, “powershell”, or “ps1” for the code block.

image (_type_, optional) – Docker image to use for code execution. Defaults to “python:3-slim”.

container_name (Optional[str], optional) – Name of the Docker container which is created. If None, will autogenerate a name. Defaults to None.

timeout (int, optional) – The timeout for code execution. Defaults to 60.

work_dir (Union[Path, str], optional) – The working directory for the code execution. Defaults to temporary directory.

bind_dir (Union[Path, str], optional) – The directory that will be bound

spawn (to the code executor container. Useful for cases where you want to)

work_dir. (the container from within a container. Defaults to)

auto_remove (bool, optional) – If true, will automatically remove the Docker container when it is stopped. Defaults to True.

stop_container (bool, optional) – If true, will automatically stop the container when stop is called, when the context manager exits or when the Python process exits with atext. Defaults to True.

device_requests (Optional[List[DeviceRequest]], optional) – A list of device request instances to add to the container for exposing GPUs (e.g., [docker.types.DeviceRequest(count=-1, capabilities=[[‘gpu’]])]). Defaults to None.

functions (List[Union[FunctionWithRequirements[Any, A], Callable[..., Any]]]) – A list of functions that are available to the code executor. Default is an empty list.

functions_module (str, optional) – The name of the module that will be created to store the functions. Defaults to “functions”.

extra_volumes (Optional[Dict[str, Dict[str, str]]], optional) – A dictionary of extra volumes (beyond the work_dir) to mount to the container; key is host source path and value ‘bind’ is the container path. See Defaults to None. Example: extra_volumes = {‘/home/user1/’: {‘bind’: ‘/mnt/vol2’, ‘mode’: ‘rw’}, ‘/var/www’: {‘bind’: ‘/mnt/vol1’, ‘mode’: ‘ro’}}

extra_hosts (Optional[Dict[str, str]], optional) – A dictionary of host mappings to add to the container. (See Docker docs on extra_hosts) Defaults to None. Example: extra_hosts = {“kubernetes.docker.internal”: “host-gateway”}

init_command (Optional[str], optional) – A shell command to run before each shell operation execution. Defaults to None. Example: init_command=”kubectl config use-context docker-hub”

delete_tmp_files (bool, optional) – If true, will delete temporary files after execution. Defaults to False.

Using the current directory (“.”) as working directory is deprecated. Using it will raise a deprecation warning.

alias of DockerCommandLineCodeExecutorConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

(Experimental) The timeout for code execution.

(Experimental) Execute the code blocks and return the result.

code_blocks (List[CodeBlock]) – The code blocks to execute.

CommandlineCodeResult – The result of the code execution.

(Experimental) Restart the Docker container code executor.

(Experimental) Stop the code executor.

Stops the Docker container and cleans up any temporary files (if they were created), along with the temporary directory. The method first waits for all cancellation tasks to finish before stopping the container. Finally it marks the executor as not running. If the container is not running, the method does nothing.

(Experimental) Start the code executor.

This method sets the working environment variables, connects to Docker and starts the code executor. If no working directory was provided to the code executor, it creates a temporary directory and sets it as the code executor working directory.

autogen_ext.code_executors.azure

autogen_ext.code_executors.docker_jupyter

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[docker]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[docker]"
```

---

## autogen_ext.code_executors.docker_jupyter — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.docker_jupyter.html

**Contents:**
- autogen_ext.code_executors.docker_jupyter#

Bases: CodeExecutor, Component[DockerJupyterCodeExecutorConfig]

(Experimental) A code executor class that executes code statefully using a Jupyter server supplied to this class.

Each execution is stateful and can access variables created from previous executions in the same session.

To use this, you need to install the following dependencies:

jupyter_server (Union[JupyterConnectable, JupyterConnectionInfo]) – The Jupyter server to use.

kernel_name (str) – The kernel name to use. Make sure it is installed. By default, it is “python3”.

timeout (int) – The timeout for code execution, by default 60.

output_dir (str) – The directory to save output files, by default None.

Example of using it directly:

Example of using it with your own jupyter image:

Example of using it with PythonCodeExecutionTool:

Example of using it inside a CodeExecutorAgent:

alias of DockerJupyterCodeExecutorConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

(Experimental) Execute a list of code blocks and return the result.

This method executes a list of code blocks as cells in the Jupyter kernel. See: https://jupyter-client.readthedocs.io/en/stable/messaging.html for the message protocol.

code_blocks (List[CodeBlock]) – A list of code blocks to execute.

DockerJupyterCodeResult – The result of the code execution.

(Experimental) Restart a new session.

(Experimental) Start a new session.

Bases: JupyterConnectable

Return the connection information for this connectable.

Start a new kernel asynchronously.

kernel_spec_name (str) – Name of the kernel spec to start

str – ID of the started kernel

Close the async session

An asynchronous client for communicating with a Jupyter kernel.

(Experimental) A code result class for IPython code executor.

autogen_ext.code_executors.docker

autogen_ext.code_executors.jupyter

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[docker-jupyter-executor]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[docker-jupyter-executor]"
```

Example 3 (python):
```python
import asyncio
from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.docker_jupyter import DockerJupyterCodeExecutor, DockerJupyterServer


async def main() -> None:
    async with DockerJupyterServer() as jupyter_server:
        async with DockerJupyterCodeExecutor(jupyter_server=jupyter_server) as executor:
            code_blocks = [CodeBlock(code="print('hello world!')", language="python")]
            code_result = await executor.execute_code_blocks(code_blocks, cancellation_token=CancellationToken())
            print(code_result)


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.docker_jupyter import DockerJupyterCodeExecutor, DockerJupyterServer


async def main() -> None:
    async with DockerJupyterServer() as jupyter_server:
        async with DockerJupyterCodeExecutor(jupyter_server=jupyter_server) as executor:
            code_blocks = [CodeBlock(code="print('hello world!')", language="python")]
            code_result = await executor.execute_code_blocks(code_blocks, cancellation_token=CancellationToken())
            print(code_result)


asyncio.run(main())
```

---

## autogen_ext.code_executors.jupyter — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.jupyter.html

**Contents:**
- autogen_ext.code_executors.jupyter#

Bases: CodeExecutor, Component[JupyterCodeExecutorConfig]

A code executor class that executes code statefully using [nbclient](jupyter/nbclient).

This will execute code on the local machine. If being used with LLM generated code, caution should be used.

Example of using it directly:

Example of using it with PythonCodeExecutionTool:

Example of using it inside a CodeExecutorAgent:

kernel_name (str) – The kernel name to use. By default, “python3”.

timeout (int) – The timeout for code execution, by default 60.

output_dir (Path) – The directory to save output files, by default a temporary directory.

Using the current directory (“.”) as output directory is deprecated. Using it will raise a deprecation warning.

alias of JupyterCodeExecutorConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Execute code blocks and return the result.

code_blocks (list[CodeBlock]) – The code blocks to execute.

JupyterCodeResult – The result of the code execution.

Restart the code executor.

(Experimental) Start the code executor.

Initializes the Jupyter Notebook execution environment by creating a new notebook and setting it up with the specified Jupyter Kernel. Marks the executor as started, allowing for code execution. This method should be called before executing any code blocks.

(Experimental) Stop the code executor.

Terminates the Jupyter Notebook execution by exiting the kernel context and cleaning up the associated resources.

A code result class for Jupyter code executor.

autogen_ext.code_executors.docker_jupyter

autogen_ext.code_executors.local

**Examples:**

Example 1 (python):
```python
import asyncio
from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.jupyter import JupyterCodeExecutor


async def main() -> None:
    async with JupyterCodeExecutor() as executor:
        cancel_token = CancellationToken()
        code_blocks = [CodeBlock(code="print('hello world!')", language="python")]
        code_result = await executor.execute_code_blocks(code_blocks, cancel_token)
        print(code_result)


asyncio.run(main())
```

Example 2 (python):
```python
import asyncio
from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.jupyter import JupyterCodeExecutor


async def main() -> None:
    async with JupyterCodeExecutor() as executor:
        cancel_token = CancellationToken()
        code_blocks = [CodeBlock(code="print('hello world!')", language="python")]
        code_result = await executor.execute_code_blocks(code_blocks, cancel_token)
        print(code_result)


asyncio.run(main())
```

Example 3 (python):
```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.code_executors.jupyter import JupyterCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.code_execution import PythonCodeExecutionTool


async def main() -> None:
    async with JupyterCodeExecutor() as executor:
        tool = PythonCodeExecutionTool(executor)
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        agent = AssistantAgent("assistant", model_client=model_client, tools=[tool])
        result = await agent.run(task="What is the 10th Fibonacci number? Use Python to calculate it.")
        print(result)


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.code_executors.jupyter import JupyterCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.code_execution import PythonCodeExecutionTool


async def main() -> None:
    async with JupyterCodeExecutor() as executor:
        tool = PythonCodeExecutionTool(executor)
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        agent = AssistantAgent("assistant", model_client=model_client, tools=[tool])
        result = await agent.run(task="What is the 10th Fibonacci number? Use Python to calculate it.")
        print(result)


asyncio.run(main())
```

---

## autogen_ext.code_executors.local — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.local.html

**Contents:**
- autogen_ext.code_executors.local#

Bases: CodeExecutor, Component[LocalCommandLineCodeExecutorConfig]

A code executor class that executes code through a local command line environment.

This will execute code on the local machine. If being used with LLM generated code, caution should be used.

Each code block is saved as a file and executed in a separate process in the working directory, and a unique file is generated and saved in the working directory for each code block. The code blocks are executed in the order they are received. Command line code is sanitized using regular expression match against a list of dangerous commands in order to prevent self-destructive commands from being executed which may potentially affect the users environment. Currently the only supported languages is Python and shell scripts. For Python code, use the language “python” for the code block. For shell scripts, use the language “bash”, “shell”, “sh”, “pwsh”, “powershell”, or “ps1” for the code block.

On Windows, the event loop policy must be set to WindowsProactorEventLoopPolicy to avoid issues with subprocesses.

timeout (int) – The timeout for the execution of any single code block. Default is 60.

work_dir (str) – The working directory for the code execution. If None, a default working directory will be used. The default working directory is a temporary directory.

functions (List[Union[FunctionWithRequirements[Any, A], Callable[..., Any]]]) – A list of functions that are available to the code executor. Default is an empty list.

functions_module (str, optional) – The name of the module that will be created to store the functions. Defaults to “functions”.

cleanup_temp_files (bool, optional) – Whether to automatically clean up temporary files after execution. Defaults to True.

virtual_env_context (Optional[SimpleNamespace], optional) – The virtual environment context. Defaults to None.

Using the current directory (“.”) as working directory is deprecated. Using it will raise a deprecation warning.

How to use LocalCommandLineCodeExecutor with a virtual environment different from the one used to run the autogen application: Set up a virtual environment using the venv module, and pass its context to the initializer of LocalCommandLineCodeExecutor. This way, the executor will run code within the new environment.

alias of LocalCommandLineCodeExecutorConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

(Experimental) Format the functions for a prompt.

The template includes two variables: - $module_name: The module name. - $functions: The functions formatted as stubs with two newlines between each function.

prompt_template (str) – The prompt template. Default is the class default.

str – The formatted prompt.

(Experimental) The timeout for code execution.

(Experimental) The working directory for the code execution.

(Experimental) The module name for the functions.

(Experimental) Whether to automatically clean up temporary files after execution.

(Experimental) Execute the code blocks and return the result.

code_blocks (List[CodeBlock]) – The code blocks to execute.

cancellation_token (CancellationToken) – a token to cancel the operation

CommandLineCodeResult – The result of the code execution.

(Experimental) Restart the code executor.

(Experimental) Start the code executor.

Initializes the local code executor and should be called before executing any code blocks. It marks the executor internal state as started. If no working directory is provided, the method creates a temporary directory for the executor to use.

(Experimental) Stop the code executor.

Stops the local code executor and performs the cleanup of the temporary working directory (if it was created). The executor’s internal state is markes as no longer started.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.code_executors.jupyter

autogen_ext.experimental.task_centric_memory

**Examples:**

Example 1 (python):
```python
import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
```

Example 2 (python):
```python
import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
```

Example 3 (python):
```python
import venv
from pathlib import Path
import asyncio

from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor


async def example():
    work_dir = Path("coding")
    work_dir.mkdir(exist_ok=True)

    venv_dir = work_dir / ".venv"
    venv_builder = venv.EnvBuilder(with_pip=True)
    venv_builder.create(venv_dir)
    venv_context = venv_builder.ensure_directories(venv_dir)

    local_executor = LocalCommandLineCodeExecutor(work_dir=work_dir, virtual_env_context=venv_context)
    await local_executor.execute_code_blocks(
        code_blocks=[
            CodeBlock(language="bash", code="pip install matplotlib"),
        ],
        cancellation_token=CancellationToken(),
    )


asyncio.run(example())
```

Example 4 (python):
```python
import venv
from pathlib import Path
import asyncio

from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor


async def example():
    work_dir = Path("coding")
    work_dir.mkdir(exist_ok=True)

    venv_dir = work_dir / ".venv"
    venv_builder = venv.EnvBuilder(with_pip=True)
    venv_builder.create(venv_dir)
    venv_context = venv_builder.ensure_directories(venv_dir)

    local_executor = LocalCommandLineCodeExecutor(work_dir=work_dir, virtual_env_context=venv_context)
    await local_executor.execute_code_blocks(
        code_blocks=[
            CodeBlock(language="bash", code="pip install matplotlib"),
        ],
        cancellation_token=CancellationToken(),
    )


asyncio.run(example())
```

---

## autogen_ext.code_executors — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.html

**Contents:**
- autogen_ext.code_executors#

Code executor utilities for AutoGen-Ext.

Create a default code executor, preferring Docker if available.

This function creates a code executor using the following priority: 1. DockerCommandLineCodeExecutor if Docker is available 2. LocalCommandLineCodeExecutor with a warning if Docker is not available

work_dir – Optional working directory for the code executor

CodeExecutor – A code executor instance

For security, it is recommended to use DockerCommandLineCodeExecutor when available to isolate code execution.

autogen_ext.cache_store

autogen_ext.experimental

---

## autogen_ext.experimental — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.experimental.html

**Contents:**
- autogen_ext.experimental#

autogen_ext.code_executors

---

## autogen_ext — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.html

**Contents:**
- autogen_ext#

autogen_ext.cache_store

---
