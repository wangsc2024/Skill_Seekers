# Autogen - Core

**Pages:** 9

---

## autogen_core.code_executor — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.code_executor.html

**Contents:**
- autogen_core.code_executor#

A code block extracted fromm an agent message.

Bases: ABC, ComponentBase[BaseModel]

Executes code blocks and returns the result.

This is an abstract base class for code executors. It defines the interface for executing code blocks and returning the result. A concrete implementation of this class should be provided to execute code blocks in a specific environment. For example, DockerCommandLineCodeExecutor executes code blocks in a command line environment in a Docker container.

It is recommended for subclass to be used as a context manager to ensure that resources are cleaned up properly. To do this, implement the start() and stop() methods that will be called when entering and exiting the context manager.

The logical type of the component.

Execute code blocks and return the result.

This method should be implemented by the code executor.

code_blocks (List[CodeBlock]) – The code blocks to execute.

CodeResult – The result of the code execution.

ValueError – Errors in user inputs

TimeoutError – Code execution timeouts

CancelledError – CancellationToken evoked during execution

Start the code executor.

Stop the code executor and release any resources.

Restart the code executor.

This method should be implemented by the code executor.

This method is called when the agent is reset.

Result of a code execution.

Decorate a function with package and import requirements for code execution environments.

This decorator makes a function available for reference in dynamically executed code blocks by wrapping it in a FunctionWithRequirements object that tracks its dependencies. When the decorated function is passed to a code executor, it can be imported by name in the executed code, with all dependencies automatically handled.

python_packages (Sequence[str], optional) – Python packages required by the function. Can include version specifications (e.g., [“pandas>=1.0.0”]). Defaults to [].

global_imports (Sequence[Import], optional) – Import statements required by the function. Can be strings (“numpy”), ImportFromModule objects, or Alias objects. Defaults to [].

Callable[[Callable[P, T]], FunctionWithRequirements[T, P]] – A decorator that wraps the target function, preserving its functionality while registering its dependencies.

autogen_core.exceptions

**Examples:**

Example 1 (python):
```python
import tempfile
import asyncio
from autogen_core import CancellationToken
from autogen_core.code_executor import with_requirements, CodeBlock
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
import pandas

@with_requirements(python_packages=["pandas"], global_imports=["pandas"])
def load_data() -> pandas.DataFrame:
    """Load some sample data.

    Returns:
        pandas.DataFrame: A DataFrame with sample data
    """
    data = {
        "name": ["John", "Anna", "Peter", "Linda"],
        "location": ["New York", "Paris", "Berlin", "London"],
        "age": [24, 13, 53, 33],
    }
    return pandas.DataFrame(data)

async def run_example():
    # The decorated function can be used in executed code
    with tempfile.TemporaryDirectory() as temp_dir:
        executor = LocalCommandLineCodeExecutor(work_dir=temp_dir, functions=[load_data])
        code = f"""from {executor.functions_module} import load_data

        # Use the imported function
        data = load_data()
        print(data['name'][0])"""

        result = await executor.execute_code_blocks(
            code_blocks=[CodeBlock(language="python", code=code)],
            cancellation_token=CancellationToken(),
        )
        print(result.output)  # Output: John

# Run the async example
asyncio.run(run_example())
```

Example 2 (python):
```python
import tempfile
import asyncio
from autogen_core import CancellationToken
from autogen_core.code_executor import with_requirements, CodeBlock
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
import pandas

@with_requirements(python_packages=["pandas"], global_imports=["pandas"])
def load_data() -> pandas.DataFrame:
    """Load some sample data.

    Returns:
        pandas.DataFrame: A DataFrame with sample data
    """
    data = {
        "name": ["John", "Anna", "Peter", "Linda"],
        "location": ["New York", "Paris", "Berlin", "London"],
        "age": [24, 13, 53, 33],
    }
    return pandas.DataFrame(data)

async def run_example():
    # The decorated function can be used in executed code
    with tempfile.TemporaryDirectory() as temp_dir:
        executor = LocalCommandLineCodeExecutor(work_dir=temp_dir, functions=[load_data])
        code = f"""from {executor.functions_module} import load_data

        # Use the imported function
        data = load_data()
        print(data['name'][0])"""

        result = await executor.execute_code_blocks(
            code_blocks=[CodeBlock(language="python", code=code)],
            cancellation_token=CancellationToken(),
        )
        print(result.output)  # Output: John

# Run the async example
asyncio.run(run_example())
```

---

## autogen_core.exceptions — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.exceptions.html

**Contents:**
- autogen_core.exceptions#

Raised when a handler can’t handle the exception.

Raised when a message can’t be delivered.

Raised when a message is dropped.

Tried to access a value that is not accessible. For example if it is remote cannot be accessed locally.

autogen_core.code_executor

---

## autogen_core.utils — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.utils.html

**Contents:**
- autogen_core.utils#

Convert a JSON Schema dictionary to a fully-typed Pydantic model.

This function handles schema translation and validation logic to produce a Pydantic model.

Supported JSON Schema Features

Primitive types: string, integer, number, boolean, object, array, null

email, uri, uuid, uuid1, uuid3, uuid4, uuid5

hostname, ipv4, ipv6, ipv4-network, ipv6-network

date, time, date-time, duration

byte, binary, password, path

minLength, maxLength, pattern

minimum, maximum, exclusiveMinimum, exclusiveMaximum

minItems, maxItems, items

properties, required, title, description, default

Converted to Python Literal type

anyOf, oneOf supported with optional discriminator

allOf merges multiple schemas into one model

Supports references to sibling definitions and self-referencing schemas

schema (Dict[str, Any]) – A valid JSON Schema dictionary.

model_name (str, optional) – The name of the root model. Defaults to “GeneratedModel”.

Type[BaseModel] – A dynamically generated Pydantic model class.

ReferenceNotFoundError – If a $ref key references a missing entry.

FormatNotSupportedError – If a format keyword is unknown or unsupported.

UnsupportedKeywordError – If the schema contains an unsupported type.

pydantic.create_model()

https://json-schema.org/

Extract JSON objects from a string. Supports backtick enclosed JSON objects

**Examples:**

Example 1 (json):
```json
from autogen_core.utils import schema_to_pydantic_model

# Example 1: Simple user model
schema = {
    "title": "User",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "age": {"type": "integer", "minimum": 0},
    },
    "required": ["name", "email"],
}

UserModel = schema_to_pydantic_model(schema)
user = UserModel(name="Alice", email="alice@example.com", age=30)
```

Example 2 (json):
```json
from autogen_core.utils import schema_to_pydantic_model

# Example 1: Simple user model
schema = {
    "title": "User",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "age": {"type": "integer", "minimum": 0},
    },
    "required": ["name", "email"],
}

UserModel = schema_to_pydantic_model(schema)
user = UserModel(name="Alice", email="alice@example.com", age=30)
```

Example 3 (json):
```json
from autogen_core.utils import schema_to_pydantic_model

# Example 2: Nested model
schema = {
    "title": "BlogPost",
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "author": {
            "type": "object",
            "properties": {"name": {"type": "string"}, "email": {"type": "string", "format": "email"}},
            "required": ["name"],
        },
    },
    "required": ["title", "author"],
}

BlogPost = schema_to_pydantic_model(schema)
```

Example 4 (json):
```json
from autogen_core.utils import schema_to_pydantic_model

# Example 2: Nested model
schema = {
    "title": "BlogPost",
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "author": {
            "type": "object",
            "properties": {"name": {"type": "string"}, "email": {"type": "string", "format": "email"}},
            "required": ["name"],
        },
    },
    "required": ["title", "author"],
}

BlogPost = schema_to_pydantic_model(schema)
```

---

## autogen_ext.runtimes.grpc.protos.cloudevent_pb2 — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.grpc.protos.cloudevent_pb2.html

**Contents:**
- autogen_ext.runtimes.grpc.protos.cloudevent_pb2#

Generated protocol buffer code.

autogen_ext.runtimes.grpc.protos.agent_worker_pb2_grpc

autogen_ext.runtimes.grpc.protos.cloudevent_pb2_grpc

---

## autogen_ext.runtimes.grpc.protos.cloudevent_pb2_grpc — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.grpc.protos.cloudevent_pb2_grpc.html

**Contents:**
- autogen_ext.runtimes.grpc.protos.cloudevent_pb2_grpc#

Client and server classes corresponding to protobuf-defined services.

autogen_ext.runtimes.grpc.protos.cloudevent_pb2

---

## autogen_ext.runtimes — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.html

**Contents:**
- autogen_ext.runtimes#

---

## Command Line Code Executors — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/components/command-line-code-executors.html

**Contents:**
- Command Line Code Executors#
- Docker#
  - Inspecting the container#
  - Example#
  - Combining an Application in Docker with a Docker based executor#
- Local#
  - Example#
- Local within a Virtual Environment#

Command line code execution is the simplest form of code execution. Generally speaking, it will save each code block to a file and then execute that file. This means that each code block is executed in a new process. There are two forms of this executor:

Docker (DockerCommandLineCodeExecutor) - this is where all commands are executed in a Docker container

Local (LocalCommandLineCodeExecutor) - this is where all commands are executed on the host machine

To use DockerCommandLineCodeExecutor, ensure the autogen-ext[docker] package is installed. For more details, see the Packages Documentation.

The DockerCommandLineCodeExecutor will create a Docker container and run all commands within that container. The default image that is used is python:3-slim, this can be customized by passing the image parameter to the constructor. If the image is not found locally then the class will try to pull it. Therefore, having built the image locally is enough. The only thing required for this image to be compatible with the executor is to have sh and python installed. Therefore, creating a custom image is a simple and effective way to ensure required system dependencies are available.

You can use the executor as a context manager to ensure the container is cleaned up after use. Otherwise, the atexit module will be used to stop the container when the program exits.

If you wish to keep the container around after AutoGen is finished using it for whatever reason (e.g. to inspect the container), then you can set the auto_remove parameter to False when creating the executor. stop_container can also be set to False to prevent the container from being stopped at the end of the execution.

It is desirable to bundle your application into a Docker image. But then, how do you allow your containerised application to execute code in a different container?

The recommended approach to this is called “Docker out of Docker”, where the Docker socket is mounted to the main AutoGen container, so that it can spawn and control “sibling” containers on the host. This is better than what is called “Docker in Docker”, where the main container runs a Docker daemon and spawns containers within itself. You can read more about this here.

To do this you would need to mount the Docker socket into the container running your application. This can be done by adding the following to the docker run command:

This will allow your application’s container to spawn and control sibling containers on the host.

If you need to bind a working directory to the application’s container but the directory belongs to your host machine, use the bind_dir parameter. This will allow the application’s container to bind the host directory to the new spawned containers and allow it to access the files within the said directory. If the bind_dir is not specified, it will fallback to work_dir.

The local version will run code on your local system. Use it with caution.

To execute code on the host machine, as in the machine running your application, LocalCommandLineCodeExecutor can be used.

If you want the code to run within a virtual environment created as part of the application’s setup, you can specify a directory for the newly created environment and pass its context to LocalCommandLineCodeExecutor. This setup allows the executor to use the specified virtual environment consistently throughout the application’s lifetime, ensuring isolated dependencies and a controlled runtime environment.

As we can see, the code has executed successfully, and the installation has been isolated to the newly created virtual environment, without affecting our global environment.

**Examples:**

Example 1 (python):
```python
from pathlib import Path

from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor

work_dir = Path("coding")
work_dir.mkdir(exist_ok=True)

async with DockerCommandLineCodeExecutor(work_dir=work_dir) as executor:  # type: ignore
    print(
        await executor.execute_code_blocks(
            code_blocks=[
                CodeBlock(language="python", code="print('Hello, World!')"),
            ],
            cancellation_token=CancellationToken(),
        )
    )
```

Example 2 (python):
```python
from pathlib import Path

from autogen_core import CancellationToken
from autogen_core.code_executor import CodeBlock
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor

work_dir = Path("coding")
work_dir.mkdir(exist_ok=True)

async with DockerCommandLineCodeExecutor(work_dir=work_dir) as executor:  # type: ignore
    print(
        await executor.execute_code_blocks(
            code_blocks=[
                CodeBlock(language="python", code="print('Hello, World!')"),
            ],
            cancellation_token=CancellationToken(),
        )
    )
```

Example 3 (unknown):
```unknown
CommandLineCodeResult(exit_code=0, output='Hello, World!\n', code_file='coding/tmp_code_07da107bb575cc4e02b0e1d6d99cc204.python')
```

Example 4 (unknown):
```unknown
CommandLineCodeResult(exit_code=0, output='Hello, World!\n', code_file='coding/tmp_code_07da107bb575cc4e02b0e1d6d99cc204.python')
```

---

## Component config — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/component-config.html

**Contents:**
- Component config#
- How does this differ from state?#
- Usage#
  - Loading a component from a config#
- Creating a component class#
- Secrets#

AutoGen components are able to be declaratively configured in a generic fashion. This is to support configuration based experiences, such as AutoGen studio, but it is also useful for many other scenarios.

The system that provides this is called “component configuration”. In AutoGen, a component is simply something that can be created from a config object and itself can be dumped to a config object. In this way, you can define a component in code and then get the config object from it.

This system is generic and allows for components defined outside of AutoGen itself (such as extensions) to be configured in the same way.

This is a very important point to clarify. When we talk about serializing an object, we must include all data that makes that object itself. Including things like message history etc. When deserializing from serialized state, you must get back the exact same object. This is not the case with component configuration.

Component configuration should be thought of as the blueprint for an object, and can be stamped out many times to create many instances of the same configured object.

If you have a component in Python and want to get the config for it, simply call dump_component() on it. The resulting object can be passed back into load_component() to get the component back.

To load a component from a config object, you can use the load_component() method. This method will take a config object and return a component object. It is best to call this method on the interface you want. For example to load a model client:

To add component functionality to a given class:

Add a call to Component() in the class inheritance list.

Implment the _to_config() and _from_config() methods

If a field of a config object is a secret value, it should be marked using SecretStr, this will ensure that the value will not be dumped to the config object.

Distributed Agent Runtime

**Examples:**

Example 1 (json):
```json
from autogen_core.models import ChatCompletionClient

config = {
    "provider": "openai_chat_completion_client",
    "config": {"model": "gpt-4o"},
}

client = ChatCompletionClient.load_component(config)
```

Example 2 (json):
```json
from autogen_core.models import ChatCompletionClient

config = {
    "provider": "openai_chat_completion_client",
    "config": {"model": "gpt-4o"},
}

client = ChatCompletionClient.load_component(config)
```

Example 3 (python):
```python
from autogen_core import Component, ComponentBase
from pydantic import BaseModel


class Config(BaseModel):
    value: str


class MyComponent(ComponentBase[Config], Component[Config]):
    component_type = "custom"
    component_config_schema = Config

    def __init__(self, value: str):
        self.value = value

    def _to_config(self) -> Config:
        return Config(value=self.value)

    @classmethod
    def _from_config(cls, config: Config) -> "MyComponent":
        return cls(value=config.value)
```

Example 4 (python):
```python
from autogen_core import Component, ComponentBase
from pydantic import BaseModel


class Config(BaseModel):
    value: str


class MyComponent(ComponentBase[Config], Component[Config]):
    component_type = "custom"
    component_config_schema = Config

    def __init__(self, value: str):
        self.value = value

    def _to_config(self) -> Config:
        return Config(value=self.value)

    @classmethod
    def _from_config(cls, config: Config) -> "MyComponent":
        return cls(value=config.value)
```

---

## Instrumentating your code locally — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/instrumenting.html

**Contents:**
- Instrumentating your code locally#
- Setting up Aspire#
- Instrumenting your code#
- Observing LLM calls using Open AI#

AutoGen supports instrumenting your code using OpenTelemetry. This allows you to collect traces and logs from your code and send them to a backend of your choice.

While debugging, you can use a local backend such as Aspire or Jaeger. In this guide we will use Aspire as an example.

Follow the instructions here to set up Aspire in standalone mode. This will require Docker to be installed on your machine.

Once you have a dashboard set up, now it’s a matter of sending traces and logs to it. You can follow the steps in the Telemetry Guide to set up the opentelemetry sdk and exporter.

After instrumenting your code with the Aspire Dashboard running, you should see traces and logs appear in the dashboard as your code runs.

If you are using the Open AI package, you can observe the LLM calls by setting up the opentelemetry for that library. We use opentelemetry-instrumentation-openai in this example.

Enable the instrumentation:

Now running your code will send traces including the LLM calls to your telemetry backend (Aspire in our case).

Local LLMs with LiteLLM & Ollama

Topic and Subscription Example Scenarios

**Examples:**

Example 1 (unknown):
```unknown
pip install opentelemetry-instrumentation-openai
```

Example 2 (unknown):
```unknown
pip install opentelemetry-instrumentation-openai
```

Example 3 (sql):
```sql
from opentelemetry.instrumentation.openai import OpenAIInstrumentor

OpenAIInstrumentor().instrument()
```

Example 4 (sql):
```sql
from opentelemetry.instrumentation.openai import OpenAIInstrumentor

OpenAIInstrumentor().instrument()
```

---
