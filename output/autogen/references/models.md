# Autogen - Models

**Pages:** 24

---

## ACA Dynamic Sessions Code Executor — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/extensions-user-guide/azure-container-code-executor.html

**Contents:**
- ACA Dynamic Sessions Code Executor#
- Create a Container Apps Session Pool#
- ACADynamicSessionsCodeExecutor#
  - Initialization#
  - New Sessions#
  - Available Packages#

This guide will explain the Azure Container Apps dynamic sessions in Azure Container Apps and show you how to use the Azure Container Code Executor class.

The Azure Container Apps dynamic sessions is a component in the Azure Container Apps service. The environment is hosted on remote Azure instances and will not execute any code locally. The interpreter is capable of executing python code in a jupyter environment with a pre-installed base of commonly used packages. Custom environments can be created by users for their applications. Files can additionally be uploaded to, or downloaded from each session.

The code interpreter can run multiple sessions of code, each of which are delineated by a session identifier string.

In your Azure portal, create a new Container App Session Pool resource with the pool type set to Python code interpreter and note the Pool management endpoint. The format for the endpoint should be something like https://{region}.dynamicsessions.io/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/sessionPools/{session_pool_name}.

Alternatively, you can use the Azure CLI to create a session pool.

The ACADynamicSessionsCodeExecutor class is a python code executor that creates and executes arbitrary python code on a default Serverless code interpreter session. Its interface is as follows

First, you will need to find or create a credentialing object that implements the TokenProvider interface. This is any object that implements the following function

An example of such an object is the azure.identity.DefaultAzureCredential class.

Lets start by installing that

Next, lets import all the necessary modules and classes for our code

Now, we create our Azure code executor and run some test code along with verification that it ran correctly. We’ll create the executor with a temporary working directory to ensure a clean environment as we show how to use each feature

Next, lets try uploading some files and verifying their integrity. All files uploaded to the Serverless code interpreter is uploaded into the /mnt/data directory. All downloadable files must also be placed in the directory. By default, the current working directory for the code executor is set to /mnt/data.

Downloading files works in a similar way.

Every instance of the ACADynamicSessionsCodeExecutor class will have a unique session ID. Every call to a particular code executor will be executed on the same session until the restart() function is called on it. Previous sessions cannot be reused.

Here we’ll run some code on the code session, restart it, then verify that a new session has been opened.

Each code execution instance is pre-installed with most of the commonly used packages. However, the list of available packages and versions are not available outside of the execution environment. The packages list on the environment can be retrieved by calling the get_available_packages() function on the code executor.

Creating your own extension

Azure AI Foundry Agent

**Examples:**

Example 1 (python):
```python
def get_token(
    self, *scopes: str, claims: Optional[str] = None, tenant_id: Optional[str] = None, **kwargs: Any
) -> azure.core.credentials.AccessToken
```

Example 2 (python):
```python
def get_token(
    self, *scopes: str, claims: Optional[str] = None, tenant_id: Optional[str] = None, **kwargs: Any
) -> azure.core.credentials.AccessToken
```

Example 3 (markdown):
```markdown
# pip install azure.identity
```

Example 4 (markdown):
```markdown
# pip install azure.identity
```

---

## autogen_core.models — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.models.html

**Contents:**
- autogen_core.models#

Bases: ComponentBase[BaseModel], ABC

Creates a single response from the model.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

CreateResult – The result of the model call.

Creates a stream of string chunks from the model ending with a CreateResult.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

AsyncGenerator[Union[str, CreateResult], None] – A generator that yields string chunks and ends with a CreateResult.

System message contains instructions for the model coming from the developer.

Open AI is moving away from using ‘system’ role in favor of ‘developer’ role. See Model Spec for more details. However, the ‘system’ role is still allowed in their API and will be automatically converted to ‘developer’ role on the server side. So, you can use SystemMessage for developer messages.

Show JSON schema{ "title": "SystemMessage", "description": "System message contains instructions for the model coming from the developer.\n\n.. note::\n\n Open AI is moving away from using 'system' role in favor of 'developer' role.\n See `Model Spec <https://cdn.openai.com/spec/model-spec-2024-05-08.html#definitions>`_ for more details.\n However, the 'system' role is still allowed in their API and will be automatically converted to 'developer' role\n on the server side.\n So, you can use `SystemMessage` for developer messages.", "type": "object", "properties": { "content": { "title": "Content", "type": "string" }, "type": { "const": "SystemMessage", "default": "SystemMessage", "title": "Type", "type": "string" } }, "required": [ "content" ] }

type (Literal['SystemMessage'])

The content of the message.

User message contains input from end users, or a catch-all for data provided to the model.

Show JSON schema{ "title": "UserMessage", "description": "User message contains input from end users, or a catch-all for data provided to the model.", "type": "object", "properties": { "content": { "anyOf": [ { "type": "string" }, { "items": { "anyOf": [ { "type": "string" }, {} ] }, "type": "array" } ], "title": "Content" }, "source": { "title": "Source", "type": "string" }, "type": { "const": "UserMessage", "default": "UserMessage", "title": "Type", "type": "string" } }, "required": [ "content", "source" ] }

content (str | List[str | autogen_core._image.Image])

type (Literal['UserMessage'])

The content of the message.

The name of the agent that sent this message.

Assistant message are sampled from the language model.

Show JSON schema{ "title": "AssistantMessage", "description": "Assistant message are sampled from the language model.", "type": "object", "properties": { "content": { "anyOf": [ { "type": "string" }, { "items": { "$ref": "#/$defs/FunctionCall" }, "type": "array" } ], "title": "Content" }, "thought": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Thought" }, "source": { "title": "Source", "type": "string" }, "type": { "const": "AssistantMessage", "default": "AssistantMessage", "title": "Type", "type": "string" } }, "$defs": { "FunctionCall": { "properties": { "id": { "title": "Id", "type": "string" }, "arguments": { "title": "Arguments", "type": "string" }, "name": { "title": "Name", "type": "string" } }, "required": [ "id", "arguments", "name" ], "title": "FunctionCall", "type": "object" } }, "required": [ "content", "source" ] }

content (str | List[autogen_core._types.FunctionCall])

type (Literal['AssistantMessage'])

The content of the message.

The reasoning text for the completion if available. Used for reasoning model and additional text content besides function calls.

The name of the agent that sent this message.

Function execution result contains the output of a function call.

Show JSON schema{ "title": "FunctionExecutionResult", "description": "Function execution result contains the output of a function call.", "type": "object", "properties": { "content": { "title": "Content", "type": "string" }, "name": { "title": "Name", "type": "string" }, "call_id": { "title": "Call Id", "type": "string" }, "is_error": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Is Error" } }, "required": [ "content", "name", "call_id" ] }

is_error (bool | None)

The output of the function call.

(New in v0.4.8) The name of the function that was called.

The ID of the function call. Note this ID may be empty for some models.

Whether the function call resulted in an error.

Function execution result message contains the output of multiple function calls.

Show JSON schema{ "title": "FunctionExecutionResultMessage", "description": "Function execution result message contains the output of multiple function calls.", "type": "object", "properties": { "content": { "items": { "$ref": "#/$defs/FunctionExecutionResult" }, "title": "Content", "type": "array" }, "type": { "const": "FunctionExecutionResultMessage", "default": "FunctionExecutionResultMessage", "title": "Type", "type": "string" } }, "$defs": { "FunctionExecutionResult": { "description": "Function execution result contains the output of a function call.", "properties": { "content": { "title": "Content", "type": "string" }, "name": { "title": "Name", "type": "string" }, "call_id": { "title": "Call Id", "type": "string" }, "is_error": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Is Error" } }, "required": [ "content", "name", "call_id" ], "title": "FunctionExecutionResult", "type": "object" } }, "required": [ "content" ] }

content (List[autogen_core.models._types.FunctionExecutionResult])

type (Literal['FunctionExecutionResultMessage'])

Create result contains the output of a model completion.

Show JSON schema{ "title": "CreateResult", "description": "Create result contains the output of a model completion.", "type": "object", "properties": { "finish_reason": { "enum": [ "stop", "length", "function_calls", "content_filter", "unknown" ], "title": "Finish Reason", "type": "string" }, "content": { "anyOf": [ { "type": "string" }, { "items": { "$ref": "#/$defs/FunctionCall" }, "type": "array" } ], "title": "Content" }, "usage": { "$ref": "#/$defs/RequestUsage" }, "cached": { "title": "Cached", "type": "boolean" }, "logprobs": { "anyOf": [ { "items": { "$ref": "#/$defs/ChatCompletionTokenLogprob" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Logprobs" }, "thought": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Thought" } }, "$defs": { "ChatCompletionTokenLogprob": { "properties": { "token": { "title": "Token", "type": "string" }, "logprob": { "title": "Logprob", "type": "number" }, "top_logprobs": { "anyOf": [ { "items": { "$ref": "#/$defs/TopLogprob" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Top Logprobs" }, "bytes": { "anyOf": [ { "items": { "type": "integer" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Bytes" } }, "required": [ "token", "logprob" ], "title": "ChatCompletionTokenLogprob", "type": "object" }, "FunctionCall": { "properties": { "id": { "title": "Id", "type": "string" }, "arguments": { "title": "Arguments", "type": "string" }, "name": { "title": "Name", "type": "string" } }, "required": [ "id", "arguments", "name" ], "title": "FunctionCall", "type": "object" }, "RequestUsage": { "properties": { "prompt_tokens": { "title": "Prompt Tokens", "type": "integer" }, "completion_tokens": { "title": "Completion Tokens", "type": "integer" } }, "required": [ "prompt_tokens", "completion_tokens" ], "title": "RequestUsage", "type": "object" }, "TopLogprob": { "properties": { "logprob": { "title": "Logprob", "type": "number" }, "bytes": { "anyOf": [ { "items": { "type": "integer" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Bytes" } }, "required": [ "logprob" ], "title": "TopLogprob", "type": "object" } }, "required": [ "finish_reason", "content", "usage", "cached" ] }

content (str | List[autogen_core._types.FunctionCall])

finish_reason (Literal['stop', 'length', 'function_calls', 'content_filter', 'unknown'])

logprobs (List[autogen_core.models._types.ChatCompletionTokenLogprob] | None)

usage (autogen_core.models._types.RequestUsage)

The reason the model finished generating the completion.

The output of the model completion.

The usage of tokens in the prompt and completion.

Whether the completion was generated from a cached response.

The logprobs of the tokens in the completion.

The reasoning text for the completion if available. Used for reasoning models and additional text content besides function calls.

Show JSON schema{ "title": "ChatCompletionTokenLogprob", "type": "object", "properties": { "token": { "title": "Token", "type": "string" }, "logprob": { "title": "Logprob", "type": "number" }, "top_logprobs": { "anyOf": [ { "items": { "$ref": "#/$defs/TopLogprob" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Top Logprobs" }, "bytes": { "anyOf": [ { "items": { "type": "integer" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Bytes" } }, "$defs": { "TopLogprob": { "properties": { "logprob": { "title": "Logprob", "type": "number" }, "bytes": { "anyOf": [ { "items": { "type": "integer" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Bytes" } }, "required": [ "logprob" ], "title": "TopLogprob", "type": "object" } }, "required": [ "token", "logprob" ] }

bytes (List[int] | None)

top_logprobs (List[autogen_core.models._types.TopLogprob] | None)

A model family is a group of models that share similar characteristics from a capabilities perspective. This is different to discrete supported features such as vision, function calling, and JSON output.

This namespace class holds constants for the model families that AutoGen understands. Other families definitely exist and can be represented by a string, however, AutoGen will treat them as unknown.

alias of Literal[‘gpt-5’, ‘gpt-41’, ‘gpt-45’, ‘gpt-4o’, ‘o1’, ‘o3’, ‘o4’, ‘gpt-4’, ‘gpt-35’, ‘r1’, ‘gemini-1.5-flash’, ‘gemini-1.5-pro’, ‘gemini-2.0-flash’, ‘gemini-2.5-pro’, ‘gemini-2.5-flash’, ‘claude-3-haiku’, ‘claude-3-sonnet’, ‘claude-3-opus’, ‘claude-3-5-haiku’, ‘claude-3-5-sonnet’, ‘claude-3-7-sonnet’, ‘claude-4-opus’, ‘claude-4-sonnet’, ‘llama-3.3-8b’, ‘llama-3.3-70b’, ‘llama-4-scout’, ‘llama-4-maverick’, ‘codestral’, ‘open-codestral-mamba’, ‘mistral’, ‘ministral’, ‘pixtral’, ‘unknown’]

ModelInfo is a dictionary that contains information about a model’s properties. It is expected to be used in the model_info property of a model client.

We are expecting this to grow over time as we add more features.

True if the model supports vision, aka image input, otherwise False.

True if the model supports function calling, otherwise False.

this is different to structured json.

True if the model supports json output, otherwise False. Note

Model family should be one of the constants from ModelFamily or a string representing an unknown model family.

True if the model supports structured output, otherwise False. This is different to json_output.

True if the model supports multiple, non-consecutive system messages, otherwise False.

Validates the model info dictionary.

ValueError – If the model info dictionary is missing required fields.

autogen_core.model_context

autogen_core.tool_agent

**Examples:**

Example 1 (json):
```json
{
   "title": "SystemMessage",
   "description": "System message contains instructions for the model coming from the developer.\n\n.. note::\n\n    Open AI is moving away from using 'system' role in favor of 'developer' role.\n    See `Model Spec <https://cdn.openai.com/spec/model-spec-2024-05-08.html#definitions>`_ for more details.\n    However, the 'system' role is still allowed in their API and will be automatically converted to 'developer' role\n    on the server side.\n    So, you can use `SystemMessage` for developer messages.",
   "type": "object",
   "properties": {
      "content": {
         "title": "Content",
         "type": "string"
      },
      "type": {
         "const": "SystemMessage",
         "default": "SystemMessage",
         "title": "Type",
         "type": "string"
      }
   },
   "required": [
      "content"
   ]
}
```

Example 2 (json):
```json
{
   "title": "SystemMessage",
   "description": "System message contains instructions for the model coming from the developer.\n\n.. note::\n\n    Open AI is moving away from using 'system' role in favor of 'developer' role.\n    See `Model Spec <https://cdn.openai.com/spec/model-spec-2024-05-08.html#definitions>`_ for more details.\n    However, the 'system' role is still allowed in their API and will be automatically converted to 'developer' role\n    on the server side.\n    So, you can use `SystemMessage` for developer messages.",
   "type": "object",
   "properties": {
      "content": {
         "title": "Content",
         "type": "string"
      },
      "type": {
         "const": "SystemMessage",
         "default": "SystemMessage",
         "title": "Type",
         "type": "string"
      }
   },
   "required": [
      "content"
   ]
}
```

Example 3 (json):
```json
{
   "title": "UserMessage",
   "description": "User message contains input from end users, or a catch-all for data provided to the model.",
   "type": "object",
   "properties": {
      "content": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "items": {
                  "anyOf": [
                     {
                        "type": "string"
                     },
                     {}
                  ]
               },
               "type": "array"
            }
         ],
         "title": "Content"
      },
      "source": {
         "title": "Source",
         "type": "string"
      },
      "type": {
         "const": "UserMessage",
         "default": "UserMessage",
         "title": "Type",
         "type": "string"
      }
   },
   "required": [
      "content",
      "source"
   ]
}
```

Example 4 (json):
```json
{
   "title": "UserMessage",
   "description": "User message contains input from end users, or a catch-all for data provided to the model.",
   "type": "object",
   "properties": {
      "content": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "items": {
                  "anyOf": [
                     {
                        "type": "string"
                     },
                     {}
                  ]
               },
               "type": "array"
            }
         ],
         "title": "Content"
      },
      "source": {
         "title": "Source",
         "type": "string"
      },
      "type": {
         "const": "UserMessage",
         "default": "UserMessage",
         "title": "Type",
         "type": "string"
      }
   },
   "required": [
      "content",
      "source"
   ]
}
```

---

## autogen_ext.auth.azure — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.auth.azure.html

**Contents:**
- autogen_ext.auth.azure#

Show JSON schema{ "title": "TokenProviderConfig", "type": "object", "properties": { "provider_kind": { "title": "Provider Kind", "type": "string" }, "scopes": { "items": { "type": "string" }, "title": "Scopes", "type": "array" } }, "required": [ "provider_kind", "scopes" ] }

Bases: ComponentBase[TokenProviderConfig], Component[TokenProviderConfig]

The logical type of the component.

alias of TokenProviderConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

autogen_ext.agents.web_surfer

autogen_ext.cache_store.diskcache

**Examples:**

Example 1 (json):
```json
{
   "title": "TokenProviderConfig",
   "type": "object",
   "properties": {
      "provider_kind": {
         "title": "Provider Kind",
         "type": "string"
      },
      "scopes": {
         "items": {
            "type": "string"
         },
         "title": "Scopes",
         "type": "array"
      }
   },
   "required": [
      "provider_kind",
      "scopes"
   ]
}
```

Example 2 (json):
```json
{
   "title": "TokenProviderConfig",
   "type": "object",
   "properties": {
      "provider_kind": {
         "title": "Provider Kind",
         "type": "string"
      },
      "scopes": {
         "items": {
            "type": "string"
         },
         "title": "Scopes",
         "type": "array"
      }
   },
   "required": [
      "provider_kind",
      "scopes"
   ]
}
```

---

## autogen_ext.code_executors.azure — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.azure.html

**Contents:**
- autogen_ext.code_executors.azure#

(Experimental) A code executor class that executes code through a an Azure Container Apps Dynamic Sessions instance.

This class requires the azure extra for the autogen-ext package:

This will execute LLM generated code on an Azure dynamic code container.

The execution environment is similar to that of a jupyter notebook which allows for incremental code execution. The parameter functions are executed in order once at the beginning of each session. Each code block is then executed serially and in the order they are received. Each environment has a statically defined set of available packages which cannot be changed. Currently, attempting to use packages beyond what is available on the environment will result in an error. To get the list of supported packages, call the get_available_packages function. Currently the only supported language is Python. For Python code, use the language “python” for the code block.

pool_management_endpoint (str) – The azure container apps dynamic sessions endpoint.

credential (TokenProvider) – An object that implements the get_token function.

timeout (int) – The timeout for the execution of any single code block. Default is 60.

work_dir (str) – The working directory for the code execution. If None, a default working directory will be used. The default working directory is a temporal directory.

functions (List[Union[FunctionWithRequirements[Any, A], Callable[..., Any]]]) – A list of functions that are available to the code executor. Default is an empty list.

bool (suppress_result_output) – By default the executor will attach any result info in the execution response to the result outpu. Set this to True to prevent this.

session_id (str) – The session id for the code execution (passed to Dynamic Sessions). If None, a new session id will be generated. Default is None. Note this value will be reset when calling restart

Using the current directory (“.”) as working directory is deprecated. Using it will raise a deprecation warning.

(Experimental) Format the functions for a prompt.

The template includes one variable: - $functions: The functions formatted as stubs with two newlines between each function.

prompt_template (str) – The prompt template. Default is the class default.

str – The formatted prompt.

(Experimental) The module name for the functions.

(Experimental) The timeout for code execution.

(Experimental) Execute the code blocks and return the result.

code_blocks (List[CodeBlock]) – The code blocks to execute.

cancellation_token (CancellationToken) – a token to cancel the operation

input_files (Optional[Union[Path, str]]) – Any files the code blocks will need to access

CodeResult – The result of the code execution.

(Experimental) Restart the code executor.

Resets the internal state of the executor by generating a new session ID and resetting the setup variables. This causes the next code execution to reinitialize the environment and re-run any setup code.

(Experimental) Start the code executor.

Marks the code executor as started.

(Experimental) Stop the code executor.

Stops the code executor after cleaning up the temporary working directory (if it was created).

autogen_ext.cache_store.redis

autogen_ext.code_executors.docker

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[azure]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[azure]"
```

---

## autogen_ext.models.anthropic.config — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.anthropic.config.html

**Contents:**
- autogen_ext.models.anthropic.config#

Configuration for thinking mode.

BedrockInfo is a dictionary that contains information about a bedrock’s properties. It is expected to be used in the bedrock_info property of a model client.

Access key for the aws account to gain bedrock model access

Access secret key for the aws account to gain bedrock model access

aws session token for the aws account to gain bedrock model access

aws region for the aws account to gain bedrock model access

Bases: CreateArguments

What functionality the model supports, determined by default from model name but is overridden if value passed.

Bases: BaseAnthropicClientConfiguration

Bases: AnthropicClientConfiguration

Configuration for thinking mode.

Show JSON schema{ "title": "ThinkingConfigModel", "description": "Configuration for thinking mode.", "type": "object", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ] }

budget_tokens (int | None)

type (Literal['enabled', 'disabled'])

Show JSON schema{ "title": "CreateArgumentsConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null } }, "$defs": { "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

max_tokens (int | None)

metadata (Dict[str, str] | None)

response_format (autogen_ext.models.anthropic.config.ResponseFormat | None)

stop_sequences (List[str] | None)

temperature (float | None)

thinking (autogen_ext.models.anthropic.config.ThinkingConfigModel | None)

Bases: CreateArgumentsConfigModel

Show JSON schema{ "title": "BaseAnthropicClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" } }, "$defs": { "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

api_key (pydantic.types.SecretStr | None)

base_url (str | None)

default_headers (Dict[str, str] | None)

max_retries (int | None)

model_capabilities (autogen_core.models._model_client.ModelCapabilities | None)

model_info (autogen_core.models._model_client.ModelInfo | None)

timeout (float | None)

Bases: BaseAnthropicClientConfigurationConfigModel

Show JSON schema{ "title": "AnthropicClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "tools": { "anyOf": [ { "items": { "type": "object" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Tools" }, "tool_choice": { "anyOf": [ { "enum": [ "auto", "any", "none" ], "type": "string" }, { "type": "object" }, { "type": "null" } ], "default": null, "title": "Tool Choice" } }, "$defs": { "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

api_key (SecretStr | None)

base_url (str | None)

default_headers (Dict[str, str] | None)

max_retries (int | None)

max_tokens (int | None)

metadata (Dict[str, str] | None)

model_capabilities (ModelCapabilities | None)

model_info (ModelInfo | None)

response_format (ResponseFormat | None)

stop_sequences (List[str] | None)

temperature (float | None)

thinking (ThinkingConfigModel | None)

timeout (float | None)

tool_choice (Literal['auto', 'any', 'none'] | Dict[str, Any] | None)

tools (List[Dict[str, Any]] | None)

Access key for the aws account to gain bedrock model access

aws session token for the aws account to gain bedrock model access

aws region for the aws account to gain bedrock model access

Bases: AnthropicClientConfigurationConfigModel

Show JSON schema{ "title": "AnthropicBedrockClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "tools": { "anyOf": [ { "items": { "type": "object" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Tools" }, "tool_choice": { "anyOf": [ { "enum": [ "auto", "any", "none" ], "type": "string" }, { "type": "object" }, { "type": "null" } ], "default": null, "title": "Tool Choice" }, "bedrock_info": { "anyOf": [ { "$ref": "#/$defs/BedrockInfoConfigModel" }, { "type": "null" } ], "default": null } }, "$defs": { "BedrockInfoConfigModel": { "properties": { "aws_access_key": { "format": "password", "title": "Aws Access Key", "type": "string", "writeOnly": true }, "aws_session_token": { "format": "password", "title": "Aws Session Token", "type": "string", "writeOnly": true }, "aws_region": { "title": "Aws Region", "type": "string" }, "aws_secret_key": { "format": "password", "title": "Aws Secret Key", "type": "string", "writeOnly": true } }, "required": [ "aws_access_key", "aws_session_token", "aws_region", "aws_secret_key" ], "title": "BedrockInfoConfigModel", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

api_key (SecretStr | None)

base_url (str | None)

bedrock_info (autogen_ext.models.anthropic.config.BedrockInfoConfigModel | None)

default_headers (Dict[str, str] | None)

max_retries (int | None)

max_tokens (int | None)

metadata (Dict[str, str] | None)

model_capabilities (ModelCapabilities | None)

model_info (ModelInfo | None)

response_format (ResponseFormat | None)

stop_sequences (List[str] | None)

temperature (float | None)

thinking (ThinkingConfigModel | None)

timeout (float | None)

tool_choice (Union[Literal['auto', 'any', 'none'], Dict[str, Any]] | None)

tools (List[Dict[str, Any]] | None)

autogen_ext.experimental.task_centric_memory.utils

autogen_ext.models.azure.config

**Examples:**

Example 1 (json):
```json
{
   "title": "ThinkingConfigModel",
   "description": "Configuration for thinking mode.",
   "type": "object",
   "properties": {
      "type": {
         "enum": [
            "enabled",
            "disabled"
         ],
         "title": "Type",
         "type": "string"
      },
      "budget_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Budget Tokens"
      }
   },
   "required": [
      "type"
   ]
}
```

Example 2 (json):
```json
{
   "title": "ThinkingConfigModel",
   "description": "Configuration for thinking mode.",
   "type": "object",
   "properties": {
      "type": {
         "enum": [
            "enabled",
            "disabled"
         ],
         "title": "Type",
         "type": "string"
      },
      "budget_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Budget Tokens"
      }
   },
   "required": [
      "type"
   ]
}
```

Example 3 (json):
```json
{
   "title": "CreateArgumentsConfigModel",
   "type": "object",
   "properties": {
      "model": {
         "title": "Model",
         "type": "string"
      },
      "max_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": 4096,
         "title": "Max Tokens"
      },
      "temperature": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": 1.0,
         "title": "Temperature"
      },
      "top_p": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top P"
      },
      "top_k": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top K"
      },
      "stop_sequences": {
         "anyOf": [
            {
               "items": {
                  "type": "string"
               },
               "type": "array"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Stop Sequences"
      },
      "response_format": {
         "anyOf": [
            {
               "$ref": "#/$defs/ResponseFormat"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "metadata": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "string"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Metadata"
      },
      "thinking": {
         "anyOf": [
            {
               "$ref": "#/$defs/ThinkingConfigModel"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      }
   },
   "$defs": {
      "ResponseFormat": {
         "properties": {
            "type": {
               "enum": [
                  "text",
                  "json_object"
               ],
               "title": "Type",
               "type": "string"
            }
         },
         "required": [
            "type"
         ],
         "title": "ResponseFormat",
         "type": "object"
      },
      "ThinkingConfigModel": {
         "description": "Configuration for thinking mode.",
         "properties": {
            "type": {
               "enum": [
                  "enabled",
                  "disabled"
               ],
               "title": "Type",
               "type": "string"
            },
            "budget_tokens": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Budget Tokens"
            }
         },
         "required": [
            "type"
         ],
         "title": "ThinkingConfigModel",
         "type": "object"
      }
   },
   "required": [
      "model"
   ]
}
```

Example 4 (json):
```json
{
   "title": "CreateArgumentsConfigModel",
   "type": "object",
   "properties": {
      "model": {
         "title": "Model",
         "type": "string"
      },
      "max_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": 4096,
         "title": "Max Tokens"
      },
      "temperature": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": 1.0,
         "title": "Temperature"
      },
      "top_p": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top P"
      },
      "top_k": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top K"
      },
      "stop_sequences": {
         "anyOf": [
            {
               "items": {
                  "type": "string"
               },
               "type": "array"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Stop Sequences"
      },
      "response_format": {
         "anyOf": [
            {
               "$ref": "#/$defs/ResponseFormat"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "metadata": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "string"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Metadata"
      },
      "thinking": {
         "anyOf": [
            {
               "$ref": "#/$defs/ThinkingConfigModel"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      }
   },
   "$defs": {
      "ResponseFormat": {
         "properties": {
            "type": {
               "enum": [
                  "text",
                  "json_object"
               ],
               "title": "Type",
               "type": "string"
            }
         },
         "required": [
            "type"
         ],
         "title": "ResponseFormat",
         "type": "object"
      },
      "ThinkingConfigModel": {
         "description": "Configuration for thinking mode.",
         "properties": {
            "type": {
               "enum": [
                  "enabled",
                  "disabled"
               ],
               "title": "Type",
               "type": "string"
            },
            "budget_tokens": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Budget Tokens"
            }
         },
         "required": [
            "type"
         ],
         "title": "ThinkingConfigModel",
         "type": "object"
      }
   },
   "required": [
      "model"
   ]
}
```

---

## autogen_ext.models.anthropic — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.anthropic.html

**Contents:**
- autogen_ext.models.anthropic#

Bases: BaseAnthropicChatCompletionClient, Component[AnthropicClientConfigurationConfigModel]

Chat completion client for Anthropic’s Claude models.

model (str) – The Claude model to use (e.g., “claude-3-sonnet-20240229”, “claude-3-opus-20240229”)

api_key (str, optional) – Anthropic API key. Required if not in environment variables.

base_url (str, optional) – Override the default API endpoint.

max_tokens (int, optional) – Maximum tokens in the response. Default is 4096.

temperature (float, optional) – Controls randomness. Lower is more deterministic. Default is 1.0.

top_p (float, optional) – Controls diversity via nucleus sampling. Default is 1.0.

top_k (int, optional) – Controls diversity via top-k sampling. Default is -1 (disabled).

model_info (ModelInfo, optional) – The capabilities of the model. Required if using a custom model.

To use this client, you must install the Anthropic extension:

To load the client from a configuration:

The logical type of the component.

alias of AnthropicClientConfigurationConfigModel

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: BaseAnthropicChatCompletionClient, Component[AnthropicBedrockClientConfigurationConfigModel]

Chat completion client for Anthropic’s Claude models on AWS Bedrock.

model (str) – The Claude model to use (e.g., “claude-3-sonnet-20240229”, “claude-3-opus-20240229”)

api_key (str, optional) – Anthropic API key. Required if not in environment variables.

base_url (str, optional) – Override the default API endpoint.

max_tokens (int, optional) – Maximum tokens in the response. Default is 4096.

temperature (float, optional) – Controls randomness. Lower is more deterministic. Default is 1.0.

top_p (float, optional) – Controls diversity via nucleus sampling. Default is 1.0.

top_k (int, optional) – Controls diversity via top-k sampling. Default is -1 (disabled).

model_info (ModelInfo, optional) – The capabilities of the model. Required if using a custom model.

bedrock_info (BedrockInfo, optional) – The capabilities of the model in bedrock. Required if using a model from AWS bedrock.

To use this client, you must install the Anthropic extension:

The logical type of the component.

alias of AnthropicBedrockClientConfigurationConfigModel

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: ChatCompletionClient

Creates a single response from the model.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

CreateResult – The result of the model call.

Creates an AsyncGenerator that yields a stream of completions based on the provided messages and tools.

Estimate the number of tokens used by messages and tools.

Note: This is an estimation based on common tokenization patterns and may not perfectly match Anthropic’s exact token counting for Claude models.

Calculate the remaining tokens based on the model’s token limit.

Bases: BaseAnthropicClientConfiguration

Bases: AnthropicClientConfiguration

Bases: BaseAnthropicClientConfigurationConfigModel

Show JSON schema{ "title": "AnthropicClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "tools": { "anyOf": [ { "items": { "type": "object" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Tools" }, "tool_choice": { "anyOf": [ { "enum": [ "auto", "any", "none" ], "type": "string" }, { "type": "object" }, { "type": "null" } ], "default": null, "title": "Tool Choice" } }, "$defs": { "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

tool_choice (Literal['auto', 'any', 'none'] | Dict[str, Any] | None)

tools (List[Dict[str, Any]] | None)

Bases: AnthropicClientConfigurationConfigModel

Show JSON schema{ "title": "AnthropicBedrockClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "tools": { "anyOf": [ { "items": { "type": "object" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Tools" }, "tool_choice": { "anyOf": [ { "enum": [ "auto", "any", "none" ], "type": "string" }, { "type": "object" }, { "type": "null" } ], "default": null, "title": "Tool Choice" }, "bedrock_info": { "anyOf": [ { "$ref": "#/$defs/BedrockInfoConfigModel" }, { "type": "null" } ], "default": null } }, "$defs": { "BedrockInfoConfigModel": { "properties": { "aws_access_key": { "format": "password", "title": "Aws Access Key", "type": "string", "writeOnly": true }, "aws_session_token": { "format": "password", "title": "Aws Session Token", "type": "string", "writeOnly": true }, "aws_region": { "title": "Aws Region", "type": "string" }, "aws_secret_key": { "format": "password", "title": "Aws Secret Key", "type": "string", "writeOnly": true } }, "required": [ "aws_access_key", "aws_session_token", "aws_region", "aws_secret_key" ], "title": "BedrockInfoConfigModel", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

bedrock_info (autogen_ext.models.anthropic.config.BedrockInfoConfigModel | None)

Show JSON schema{ "title": "CreateArgumentsConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": 4096, "title": "Max Tokens" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": 1.0, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "stop_sequences": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop Sequences" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "metadata": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" }, "thinking": { "anyOf": [ { "$ref": "#/$defs/ThinkingConfigModel" }, { "type": "null" } ], "default": null } }, "$defs": { "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object" ], "title": "Type", "type": "string" } }, "required": [ "type" ], "title": "ResponseFormat", "type": "object" }, "ThinkingConfigModel": { "description": "Configuration for thinking mode.", "properties": { "type": { "enum": [ "enabled", "disabled" ], "title": "Type", "type": "string" }, "budget_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Budget Tokens" } }, "required": [ "type" ], "title": "ThinkingConfigModel", "type": "object" } }, "required": [ "model" ] }

max_tokens (int | None)

metadata (Dict[str, str] | None)

response_format (autogen_ext.models.anthropic.config.ResponseFormat | None)

stop_sequences (List[str] | None)

temperature (float | None)

thinking (autogen_ext.models.anthropic.config.ThinkingConfigModel | None)

BedrockInfo is a dictionary that contains information about a bedrock’s properties. It is expected to be used in the bedrock_info property of a model client.

Access key for the aws account to gain bedrock model access

Access secret key for the aws account to gain bedrock model access

aws session token for the aws account to gain bedrock model access

aws region for the aws account to gain bedrock model access

autogen_ext.memory.redis

autogen_ext.models.azure

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[anthropic]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[anthropic]"
```

Example 3 (python):
```python
import asyncio
from autogen_ext.models.anthropic import AnthropicChatCompletionClient
from autogen_core.models import UserMessage


async def main():
    anthropic_client = AnthropicChatCompletionClient(
        model="claude-3-sonnet-20240229",
        api_key="your-api-key",  # Optional if ANTHROPIC_API_KEY is set in environment
    )

    result = await anthropic_client.create([UserMessage(content="What is the capital of France?", source="user")])  # type: ignore
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_ext.models.anthropic import AnthropicChatCompletionClient
from autogen_core.models import UserMessage


async def main():
    anthropic_client = AnthropicChatCompletionClient(
        model="claude-3-sonnet-20240229",
        api_key="your-api-key",  # Optional if ANTHROPIC_API_KEY is set in environment
    )

    result = await anthropic_client.create([UserMessage(content="What is the capital of France?", source="user")])  # type: ignore
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
```

---

## autogen_ext.models.azure.config — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.azure.config.html

**Contents:**
- autogen_ext.models.azure.config#

Represents the same fields as azure.ai.inference.models.JsonSchemaFormat.

autogen_ext.models.anthropic.config

autogen_ext.models.ollama.config

---

## autogen_ext.models.azure — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.azure.html

**Contents:**
- autogen_ext.models.azure#

Bases: ChatCompletionClient

Chat completion client for models hosted on Azure AI Foundry or GitHub Models. See here for more info.

endpoint (str) – The endpoint to use. Required.

credential (union, AzureKeyCredential, AsyncTokenCredential) – The credentials to use. Required

model_info (ModelInfo) – The model family and capabilities of the model. Required.

model (str) – The name of the model. Required if model is hosted on GitHub Models.

frequency_penalty – (optional,float)

presence_penalty – (optional,float)

temperature – (optional,float)

top_p – (optional,float)

max_tokens – (optional,int)

response_format – (optional, literal[“text”, “json_object”])

stop – (optional,List[str])

tools – (optional,List[ChatCompletionsToolDefinition])

tool_choice – (optional,Union[str, ChatCompletionsToolChoicePreset, ChatCompletionsNamedToolChoice]])

seed – (optional,int)

model_extras – (optional,Dict[str, Any])

To use this client, you must install the azure extra:

The following code snippet shows how to use the client with GitHub Models:

To use streaming, you can use the create_stream method:

Creates a single response from the model.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

CreateResult – The result of the model call.

Creates a stream of string chunks from the model ending with a CreateResult.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

AsyncGenerator[Union[str, CreateResult], None] – A generator that yields string chunks and ends with a CreateResult.

autogen_ext.models.anthropic

autogen_ext.models.cache

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[azure]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[azure]"
```

Example 3 (python):
```python
import asyncio
import os
from azure.core.credentials import AzureKeyCredential
from autogen_ext.models.azure import AzureAIChatCompletionClient
from autogen_core.models import UserMessage


async def main():
    client = AzureAIChatCompletionClient(
        model="Phi-4",
        endpoint="https://models.github.ai/inference",
        # To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
        # Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
        credential=AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
        model_info={
            "json_output": False,
            "function_calling": False,
            "vision": False,
            "family": "unknown",
            "structured_output": False,
        },
    )

    result = await client.create([UserMessage(content="What is the capital of France?", source="user")])
    print(result)

    # Close the client.
    await client.close()


if __name__ == "__main__":
    asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
import os
from azure.core.credentials import AzureKeyCredential
from autogen_ext.models.azure import AzureAIChatCompletionClient
from autogen_core.models import UserMessage


async def main():
    client = AzureAIChatCompletionClient(
        model="Phi-4",
        endpoint="https://models.github.ai/inference",
        # To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
        # Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
        credential=AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
        model_info={
            "json_output": False,
            "function_calling": False,
            "vision": False,
            "family": "unknown",
            "structured_output": False,
        },
    )

    result = await client.create([UserMessage(content="What is the capital of France?", source="user")])
    print(result)

    # Close the client.
    await client.close()


if __name__ == "__main__":
    asyncio.run(main())
```

---

## autogen_ext.models.cache — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.cache.html

**Contents:**
- autogen_ext.models.cache#

Bases: ChatCompletionClient, Component[ChatCompletionCacheConfig]

A wrapper around a ChatCompletionClient that caches creation results from an underlying client. Cache hits do not contribute to token usage of the original client.

Lets use caching on disk with openai client as an example. First install autogen-ext with the required packages:

For streaming with Redis caching:

You can now use the cached_client as you would the original client, but with caching enabled.

client (ChatCompletionClient) – The original ChatCompletionClient to wrap.

store (CacheStore) – A store object that implements get and set methods. The user is responsible for managing the store’s lifecycle & clearing it (if needed). Defaults to using in-memory cache.

The logical type of the component.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of ChatCompletionCacheConfig

Cached version of ChatCompletionClient.create. If the result of a call to create has been cached, it will be returned immediately without invoking the underlying client.

NOTE: cancellation_token is ignored for cached results.

Cached version of ChatCompletionClient.create_stream. If the result of a call to create_stream has been cached, it will be returned without streaming from the underlying client.

NOTE: cancellation_token is ignored for cached results.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.models.azure

autogen_ext.models.llama_cpp

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-ext[openai, diskcache]"
```

Example 2 (unknown):
```unknown
pip install -U "autogen-ext[openai, diskcache]"
```

Example 3 (python):
```python
import asyncio
import tempfile

from autogen_core.models import UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.models.cache import ChatCompletionCache, CHAT_CACHE_VALUE_TYPE
from autogen_ext.cache_store.diskcache import DiskCacheStore
from diskcache import Cache


async def main():
    with tempfile.TemporaryDirectory() as tmpdirname:
        # Initialize the original client
        openai_model_client = OpenAIChatCompletionClient(model="gpt-4o")

        # Then initialize the CacheStore, in this case with diskcache.Cache.
        # You can also use redis like:
        # from autogen_ext.cache_store.redis import RedisStore
        # import redis
        # redis_instance = redis.Redis()
        # cache_store = RedisCacheStore[CHAT_CACHE_VALUE_TYPE](redis_instance)
        cache_store = DiskCacheStore[CHAT_CACHE_VALUE_TYPE](Cache(tmpdirname))
        cache_client = ChatCompletionCache(openai_model_client, cache_store)

        response = await cache_client.create([UserMessage(content="Hello, how are you?", source="user")])
        print(response)  # Should print response from OpenAI
        response = await cache_client.create([UserMessage(content="Hello, how are you?", source="user")])
        print(response)  # Should print cached response


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
import tempfile

from autogen_core.models import UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.models.cache import ChatCompletionCache, CHAT_CACHE_VALUE_TYPE
from autogen_ext.cache_store.diskcache import DiskCacheStore
from diskcache import Cache


async def main():
    with tempfile.TemporaryDirectory() as tmpdirname:
        # Initialize the original client
        openai_model_client = OpenAIChatCompletionClient(model="gpt-4o")

        # Then initialize the CacheStore, in this case with diskcache.Cache.
        # You can also use redis like:
        # from autogen_ext.cache_store.redis import RedisStore
        # import redis
        # redis_instance = redis.Redis()
        # cache_store = RedisCacheStore[CHAT_CACHE_VALUE_TYPE](redis_instance)
        cache_store = DiskCacheStore[CHAT_CACHE_VALUE_TYPE](Cache(tmpdirname))
        cache_client = ChatCompletionCache(openai_model_client, cache_store)

        response = await cache_client.create([UserMessage(content="Hello, how are you?", source="user")])
        print(response)  # Should print response from OpenAI
        response = await cache_client.create([UserMessage(content="Hello, how are you?", source="user")])
        print(response)  # Should print cached response


asyncio.run(main())
```

---

## autogen_ext.models.llama_cpp — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.llama_cpp.html

**Contents:**
- autogen_ext.models.llama_cpp#

Bases: ChatCompletionClient

Chat completion client for LlamaCpp models. To use this client, you must install the llama-cpp extra:

This client allows you to interact with LlamaCpp models, either by specifying a local model path or by downloading a model from Hugging Face Hub.

model_info (optional, ModelInfo) – The information about the model. Defaults to DEFAULT_MODEL_INFO.

model_path (optional, str) – The path to the LlamaCpp model file. Required if repo_id and filename are not provided.

repo_id (optional, str) – The Hugging Face Hub repository ID. Required if model_path is not provided.

filename (optional, str) – The filename of the model within the Hugging Face Hub repository. Required if model_path is not provided.

n_gpu_layers (optional, int) – The number of layers to put on the GPU.

n_ctx (optional, int) – The context size.

n_batch (optional, int) – The batch size.

verbose (optional, bool) – Whether to print verbose output.

**kwargs – Additional parameters to pass to the Llama class.

The following code snippet shows how to use the client with a local model file:

The following code snippet shows how to use the client with a model from Hugging Face Hub:

Creates a single response from the model.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

CreateResult – The result of the model call.

Creates a stream of string chunks from the model ending with a CreateResult.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

AsyncGenerator[Union[str, CreateResult], None] – A generator that yields string chunks and ends with a CreateResult.

Close the LlamaCpp client.

autogen_ext.models.cache

autogen_ext.models.ollama

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[llama-cpp]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[llama-cpp]"
```

Example 3 (python):
```python
import asyncio

from autogen_core.models import UserMessage
from autogen_ext.models.llama_cpp import LlamaCppChatCompletionClient


async def main():
    llama_client = LlamaCppChatCompletionClient(model_path="/path/to/your/model.gguf")
    result = await llama_client.create([UserMessage(content="What is the capital of France?", source="user")])
    print(result)


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio

from autogen_core.models import UserMessage
from autogen_ext.models.llama_cpp import LlamaCppChatCompletionClient


async def main():
    llama_client = LlamaCppChatCompletionClient(model_path="/path/to/your/model.gguf")
    result = await llama_client.create([UserMessage(content="What is the capital of France?", source="user")])
    print(result)


asyncio.run(main())
```

---

## autogen_ext.models.ollama.config — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.ollama.config.html

**Contents:**
- autogen_ext.models.ollama.config#

Bases: CreateArguments

What functionality the model supports, determined by default from model name but is overriden if value passed.

Show JSON schema{ "title": "CreateArgumentsConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "host": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Host" }, "response_format": { "default": null, "title": "Response Format" } }, "required": [ "model" ] }

response_format (Any)

Bases: CreateArgumentsConfigModel

Show JSON schema{ "title": "BaseOllamaClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "host": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Host" }, "response_format": { "default": null, "title": "Response Format" }, "follow_redirects": { "default": true, "title": "Follow Redirects", "type": "boolean" }, "timeout": { "default": null, "title": "Timeout" }, "headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Headers" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "options": { "anyOf": [ { "type": "object" }, { "$ref": "#/$defs/Options" }, { "type": "null" } ], "default": null, "title": "Options" } }, "$defs": { "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "Options": { "properties": { "numa": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Numa" }, "num_ctx": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Ctx" }, "num_batch": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Batch" }, "num_gpu": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Gpu" }, "main_gpu": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Main Gpu" }, "low_vram": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Low Vram" }, "f16_kv": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "F16 Kv" }, "logits_all": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Logits All" }, "vocab_only": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Vocab Only" }, "use_mmap": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Use Mmap" }, "use_mlock": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Use Mlock" }, "embedding_only": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Embedding Only" }, "num_thread": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Thread" }, "num_keep": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Keep" }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "num_predict": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Predict" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "tfs_z": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Tfs Z" }, "typical_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Typical P" }, "repeat_last_n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Repeat Last N" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "repeat_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Repeat Penalty" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "mirostat": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Mirostat" }, "mirostat_tau": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Mirostat Tau" }, "mirostat_eta": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Mirostat Eta" }, "penalize_newline": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Penalize Newline" }, "stop": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" } }, "title": "Options", "type": "object" } }, "required": [ "model" ] }

follow_redirects (bool)

headers (Mapping[str, str] | None)

model_capabilities (autogen_core.models._model_client.ModelCapabilities | None)

model_info (autogen_core.models._model_client.ModelInfo | None)

options (Mapping[str, Any] | ollama._types.Options | None)

response_format (Any)

autogen_ext.models.azure.config

autogen_ext.models.openai.config

**Examples:**

Example 1 (json):
```json
{
   "title": "CreateArgumentsConfigModel",
   "type": "object",
   "properties": {
      "model": {
         "title": "Model",
         "type": "string"
      },
      "host": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Host"
      },
      "response_format": {
         "default": null,
         "title": "Response Format"
      }
   },
   "required": [
      "model"
   ]
}
```

Example 2 (json):
```json
{
   "title": "CreateArgumentsConfigModel",
   "type": "object",
   "properties": {
      "model": {
         "title": "Model",
         "type": "string"
      },
      "host": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Host"
      },
      "response_format": {
         "default": null,
         "title": "Response Format"
      }
   },
   "required": [
      "model"
   ]
}
```

Example 3 (json):
```json
{
   "title": "BaseOllamaClientConfigurationConfigModel",
   "type": "object",
   "properties": {
      "model": {
         "title": "Model",
         "type": "string"
      },
      "host": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Host"
      },
      "response_format": {
         "default": null,
         "title": "Response Format"
      },
      "follow_redirects": {
         "default": true,
         "title": "Follow Redirects",
         "type": "boolean"
      },
      "timeout": {
         "default": null,
         "title": "Timeout"
      },
      "headers": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "string"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Headers"
      },
      "model_capabilities": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelCapabilities"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "model_info": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelInfo"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "options": {
         "anyOf": [
            {
               "type": "object"
            },
            {
               "$ref": "#/$defs/Options"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Options"
      }
   },
   "$defs": {
      "ModelCapabilities": {
         "deprecated": true,
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output"
         ],
         "title": "ModelCapabilities",
         "type": "object"
      },
      "ModelInfo": {
         "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.",
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            },
            "family": {
               "anyOf": [
                  {
                     "enum": [
                        "gpt-5",
                        "gpt-41",
                        "gpt-45",
                        "gpt-4o",
                        "o1",
                        "o3",
                        "o4",
                        "gpt-4",
                        "gpt-35",
                        "r1",
                        "gemini-1.5-flash",
                        "gemini-1.5-pro",
                        "gemini-2.0-flash",
                        "gemini-2.5-pro",
                        "gemini-2.5-flash",
                        "claude-3-haiku",
                        "claude-3-sonnet",
                        "claude-3-opus",
                        "claude-3-5-haiku",
                        "claude-3-5-sonnet",
                        "claude-3-7-sonnet",
                        "claude-4-opus",
                        "claude-4-sonnet",
                        "llama-3.3-8b",
                        "llama-3.3-70b",
                        "llama-4-scout",
                        "llama-4-maverick",
                        "codestral",
                        "open-codestral-mamba",
                        "mistral",
                        "ministral",
                        "pixtral",
                        "unknown"
                     ],
                     "type": "string"
                  },
                  {
                     "type": "string"
                  }
               ],
               "title": "Family"
            },
            "structured_output": {
               "title": "Structured Output",
               "type": "boolean"
            },
            "multiple_system_messages": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Multiple System Messages"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output",
            "family",
            "structured_output"
         ],
         "title": "ModelInfo",
         "type": "object"
      },
      "Options": {
         "properties": {
            "numa": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Numa"
            },
            "num_ctx": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Ctx"
            },
            "num_batch": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Batch"
            },
            "num_gpu": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Gpu"
            },
            "main_gpu": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Main Gpu"
            },
            "low_vram": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Low Vram"
            },
            "f16_kv": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "F16 Kv"
            },
            "logits_all": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Logits All"
            },
            "vocab_only": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Vocab Only"
            },
            "use_mmap": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Use Mmap"
            },
            "use_mlock": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Use Mlock"
            },
            "embedding_only": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Embedding Only"
            },
            "num_thread": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Thread"
            },
            "num_keep": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Keep"
            },
            "seed": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Seed"
            },
            "num_predict": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Predict"
            },
            "top_k": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Top K"
            },
            "top_p": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Top P"
            },
            "tfs_z": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Tfs Z"
            },
            "typical_p": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Typical P"
            },
            "repeat_last_n": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Repeat Last N"
            },
            "temperature": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Temperature"
            },
            "repeat_penalty": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Repeat Penalty"
            },
            "presence_penalty": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Presence Penalty"
            },
            "frequency_penalty": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Frequency Penalty"
            },
            "mirostat": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Mirostat"
            },
            "mirostat_tau": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Mirostat Tau"
            },
            "mirostat_eta": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Mirostat Eta"
            },
            "penalize_newline": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Penalize Newline"
            },
            "stop": {
               "anyOf": [
                  {
                     "items": {
                        "type": "string"
                     },
                     "type": "array"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Stop"
            }
         },
         "title": "Options",
         "type": "object"
      }
   },
   "required": [
      "model"
   ]
}
```

Example 4 (json):
```json
{
   "title": "BaseOllamaClientConfigurationConfigModel",
   "type": "object",
   "properties": {
      "model": {
         "title": "Model",
         "type": "string"
      },
      "host": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Host"
      },
      "response_format": {
         "default": null,
         "title": "Response Format"
      },
      "follow_redirects": {
         "default": true,
         "title": "Follow Redirects",
         "type": "boolean"
      },
      "timeout": {
         "default": null,
         "title": "Timeout"
      },
      "headers": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "string"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Headers"
      },
      "model_capabilities": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelCapabilities"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "model_info": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelInfo"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "options": {
         "anyOf": [
            {
               "type": "object"
            },
            {
               "$ref": "#/$defs/Options"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Options"
      }
   },
   "$defs": {
      "ModelCapabilities": {
         "deprecated": true,
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output"
         ],
         "title": "ModelCapabilities",
         "type": "object"
      },
      "ModelInfo": {
         "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.",
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            },
            "family": {
               "anyOf": [
                  {
                     "enum": [
                        "gpt-5",
                        "gpt-41",
                        "gpt-45",
                        "gpt-4o",
                        "o1",
                        "o3",
                        "o4",
                        "gpt-4",
                        "gpt-35",
                        "r1",
                        "gemini-1.5-flash",
                        "gemini-1.5-pro",
                        "gemini-2.0-flash",
                        "gemini-2.5-pro",
                        "gemini-2.5-flash",
                        "claude-3-haiku",
                        "claude-3-sonnet",
                        "claude-3-opus",
                        "claude-3-5-haiku",
                        "claude-3-5-sonnet",
                        "claude-3-7-sonnet",
                        "claude-4-opus",
                        "claude-4-sonnet",
                        "llama-3.3-8b",
                        "llama-3.3-70b",
                        "llama-4-scout",
                        "llama-4-maverick",
                        "codestral",
                        "open-codestral-mamba",
                        "mistral",
                        "ministral",
                        "pixtral",
                        "unknown"
                     ],
                     "type": "string"
                  },
                  {
                     "type": "string"
                  }
               ],
               "title": "Family"
            },
            "structured_output": {
               "title": "Structured Output",
               "type": "boolean"
            },
            "multiple_system_messages": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Multiple System Messages"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output",
            "family",
            "structured_output"
         ],
         "title": "ModelInfo",
         "type": "object"
      },
      "Options": {
         "properties": {
            "numa": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Numa"
            },
            "num_ctx": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Ctx"
            },
            "num_batch": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Batch"
            },
            "num_gpu": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Gpu"
            },
            "main_gpu": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Main Gpu"
            },
            "low_vram": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Low Vram"
            },
            "f16_kv": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "F16 Kv"
            },
            "logits_all": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Logits All"
            },
            "vocab_only": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Vocab Only"
            },
            "use_mmap": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Use Mmap"
            },
            "use_mlock": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Use Mlock"
            },
            "embedding_only": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Embedding Only"
            },
            "num_thread": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Thread"
            },
            "num_keep": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Keep"
            },
            "seed": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Seed"
            },
            "num_predict": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Num Predict"
            },
            "top_k": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Top K"
            },
            "top_p": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Top P"
            },
            "tfs_z": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Tfs Z"
            },
            "typical_p": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Typical P"
            },
            "repeat_last_n": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Repeat Last N"
            },
            "temperature": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Temperature"
            },
            "repeat_penalty": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Repeat Penalty"
            },
            "presence_penalty": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Presence Penalty"
            },
            "frequency_penalty": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Frequency Penalty"
            },
            "mirostat": {
               "anyOf": [
                  {
                     "type": "integer"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Mirostat"
            },
            "mirostat_tau": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Mirostat Tau"
            },
            "mirostat_eta": {
               "anyOf": [
                  {
                     "type": "number"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Mirostat Eta"
            },
            "penalize_newline": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Penalize Newline"
            },
            "stop": {
               "anyOf": [
                  {
                     "items": {
                        "type": "string"
                     },
                     "type": "array"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Stop"
            }
         },
         "title": "Options",
         "type": "object"
      }
   },
   "required": [
      "model"
   ]
}
```

---

## autogen_ext.models.ollama — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.ollama.html

**Contents:**
- autogen_ext.models.ollama#

Bases: BaseOllamaChatCompletionClient, Component[BaseOllamaClientConfigurationConfigModel]

Chat completion client for Ollama hosted models.

Ollama must be installed and the appropriate model pulled.

model (str) – Which Ollama model to use.

host (optional, str) – Model host url.

response_format (optional, pydantic.BaseModel) – The format of the response. If provided, the response will be parsed into this format as json.

options (optional, Mapping[str, Any] | Options) – Additional options to pass to the Ollama client.

model_info (optional, ModelInfo) – The capabilities of the model. Required if the model is not listed in the ollama model info.

Only models with 200k+ downloads (as of Jan 21, 2025), + phi4, deepseek-r1 have pre-defined model infos. See this file for the full list. An entry for one model encompases all parameter variants of that model.

To use this client, you must install the ollama extension:

The following code snippet shows how to use the client with an Ollama model:

To load the client from a configuration, you can use the load_component method:

To output structured data, you can use the response_format argument:

Tool usage in ollama is stricter than in its OpenAI counterparts. While OpenAI accepts a map of [str, Any], Ollama requires a map of [str, Property] where Property is a typed object containing type and description fields. Therefore, only the keys type and description will be converted from the properties blob in the tool schema.

To view the full list of available configuration options, see the OllamaClientConfigurationConfigModel class.

The logical type of the component.

alias of BaseOllamaClientConfigurationConfigModel

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: CreateArgumentsConfigModel

Show JSON schema{ "title": "BaseOllamaClientConfigurationConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "host": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Host" }, "response_format": { "default": null, "title": "Response Format" }, "follow_redirects": { "default": true, "title": "Follow Redirects", "type": "boolean" }, "timeout": { "default": null, "title": "Timeout" }, "headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Headers" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "options": { "anyOf": [ { "type": "object" }, { "$ref": "#/$defs/Options" }, { "type": "null" } ], "default": null, "title": "Options" } }, "$defs": { "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "Options": { "properties": { "numa": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Numa" }, "num_ctx": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Ctx" }, "num_batch": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Batch" }, "num_gpu": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Gpu" }, "main_gpu": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Main Gpu" }, "low_vram": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Low Vram" }, "f16_kv": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "F16 Kv" }, "logits_all": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Logits All" }, "vocab_only": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Vocab Only" }, "use_mmap": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Use Mmap" }, "use_mlock": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Use Mlock" }, "embedding_only": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Embedding Only" }, "num_thread": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Thread" }, "num_keep": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Keep" }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "num_predict": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Num Predict" }, "top_k": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Top K" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "tfs_z": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Tfs Z" }, "typical_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Typical P" }, "repeat_last_n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Repeat Last N" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "repeat_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Repeat Penalty" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "mirostat": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Mirostat" }, "mirostat_tau": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Mirostat Tau" }, "mirostat_eta": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Mirostat Eta" }, "penalize_newline": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Penalize Newline" }, "stop": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" } }, "title": "Options", "type": "object" } }, "required": [ "model" ] }

follow_redirects (bool)

headers (Mapping[str, str] | None)

model_capabilities (autogen_core.models._model_client.ModelCapabilities | None)

model_info (autogen_core.models._model_client.ModelInfo | None)

options (Mapping[str, Any] | ollama._types.Options | None)

Show JSON schema{ "title": "CreateArgumentsConfigModel", "type": "object", "properties": { "model": { "title": "Model", "type": "string" }, "host": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Host" }, "response_format": { "default": null, "title": "Response Format" } }, "required": [ "model" ] }

response_format (Any)

autogen_ext.models.llama_cpp

autogen_ext.models.openai

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[ollama]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[ollama]"
```

Example 3 (python):
```python
from autogen_ext.models.ollama import OllamaChatCompletionClient
from autogen_core.models import UserMessage

ollama_client = OllamaChatCompletionClient(
    model="llama3",
)

result = await ollama_client.create([UserMessage(content="What is the capital of France?", source="user")])  # type: ignore
print(result)
```

Example 4 (python):
```python
from autogen_ext.models.ollama import OllamaChatCompletionClient
from autogen_core.models import UserMessage

ollama_client = OllamaChatCompletionClient(
    model="llama3",
)

result = await ollama_client.create([UserMessage(content="What is the capital of France?", source="user")])  # type: ignore
print(result)
```

---

## autogen_ext.models.openai.config — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.openai.config.html

**Contents:**
- autogen_ext.models.openai.config#

The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.

A description of what the response format is for, used by the model to determine how to respond in the format.

The schema for the response format, described as a JSON Schema object.

Whether to enable strict schema adherence when generating the output. If set to true, the model will always follow the exact schema defined in the schema field. Only a subset of JSON Schema is supported when strict is true. To learn more, read the [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).

text, json_object, or json_schema

The type of response format being defined

The type of response format being defined

Controls the amount of effort the model uses for reasoning. Only applicable to reasoning models like o1 and o3-mini. - ‘minimal’: Fastest response with minimal reasoning - ‘low’: Faster responses with less reasoning - ‘medium’: Balanced reasoning and speed - ‘high’: More thorough reasoning, may take longer

Bases: CreateArguments

What functionality the model supports, determined by default from model name but is overriden if value passed.

Whether to include the ‘name’ field in user message parameters. Defaults to True. Set to False for providers that don’t support the ‘name’ field.

Bases: BaseOpenAIClientConfiguration

Bases: BaseOpenAIClientConfiguration

Show JSON schema{ "title": "CreateArgumentsConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" } }, "$defs": { "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } } }

frequency_penalty (float | None)

logit_bias (Dict[str, int] | None)

max_tokens (int | None)

parallel_tool_calls (bool | None)

presence_penalty (float | None)

reasoning_effort (Literal['minimal', 'low', 'medium', 'high'] | None)

response_format (autogen_ext.models.openai.config.ResponseFormat | None)

stop (str | List[str] | None)

stream_options (autogen_ext.models.openai.config.StreamOptions | None)

temperature (float | None)

Bases: CreateArgumentsConfigModel

Show JSON schema{ "title": "BaseOpenAIClientConfigurationConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" }, "model": { "title": "Model", "type": "string" }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "add_name_prefixes": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Add Name Prefixes" }, "include_name_in_message": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Include Name In Message" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" } }, "$defs": { "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } }, "required": [ "model" ] }

add_name_prefixes (bool | None)

api_key (pydantic.types.SecretStr | None)

default_headers (Dict[str, str] | None)

frequency_penalty (float | None)

include_name_in_message (bool | None)

logit_bias (Dict[str, int] | None)

max_retries (int | None)

max_tokens (int | None)

model_capabilities (autogen_core.models._model_client.ModelCapabilities | None)

model_info (autogen_core.models._model_client.ModelInfo | None)

parallel_tool_calls (bool | None)

presence_penalty (float | None)

reasoning_effort (Literal['minimal', 'low', 'medium', 'high'] | None)

response_format (ResponseFormat | None)

stop (str | List[str] | None)

stream_options (StreamOptions | None)

temperature (float | None)

timeout (float | None)

Bases: BaseOpenAIClientConfigurationConfigModel

Show JSON schema{ "title": "OpenAIClientConfigurationConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" }, "model": { "title": "Model", "type": "string" }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "add_name_prefixes": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Add Name Prefixes" }, "include_name_in_message": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Include Name In Message" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "organization": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Organization" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" } }, "$defs": { "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } }, "required": [ "model" ] }

add_name_prefixes (bool | None)

api_key (SecretStr | None)

base_url (str | None)

default_headers (Dict[str, str] | None)

frequency_penalty (float | None)

include_name_in_message (bool | None)

logit_bias (Dict[str, int] | None)

max_retries (int | None)

max_tokens (int | None)

model_capabilities (ModelCapabilities | None)

model_info (ModelInfo | None)

organization (str | None)

parallel_tool_calls (bool | None)

presence_penalty (float | None)

reasoning_effort (Literal['minimal', 'low', 'medium', 'high'] | None)

response_format (ResponseFormat | None)

stop (str | List[str] | None)

stream_options (StreamOptions | None)

temperature (float | None)

timeout (float | None)

Bases: BaseOpenAIClientConfigurationConfigModel

Show JSON schema{ "title": "AzureOpenAIClientConfigurationConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" }, "model": { "title": "Model", "type": "string" }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "add_name_prefixes": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Add Name Prefixes" }, "include_name_in_message": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Include Name In Message" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "azure_endpoint": { "title": "Azure Endpoint", "type": "string" }, "azure_deployment": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Azure Deployment" }, "api_version": { "title": "Api Version", "type": "string" }, "azure_ad_token": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Azure Ad Token" }, "azure_ad_token_provider": { "anyOf": [ { "$ref": "#/$defs/ComponentModel" }, { "type": "null" } ], "default": null } }, "$defs": { "ComponentModel": { "description": "Model class for a component. Contains all information required to instantiate a component.", "properties": { "provider": { "title": "Provider", "type": "string" }, "component_type": { "anyOf": [ { "enum": [ "model", "agent", "tool", "termination", "token_provider", "workbench" ], "type": "string" }, { "type": "string" }, { "type": "null" } ], "default": null, "title": "Component Type" }, "version": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Version" }, "component_version": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Component Version" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "label": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Label" }, "config": { "title": "Config", "type": "object" } }, "required": [ "provider", "config" ], "title": "ComponentModel", "type": "object" }, "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } }, "required": [ "model", "azure_endpoint", "api_version" ] }

add_name_prefixes (bool | None)

api_key (SecretStr | None)

azure_ad_token (str | None)

azure_ad_token_provider (autogen_core._component_config.ComponentModel | None)

azure_deployment (str | None)

default_headers (Dict[str, str] | None)

frequency_penalty (float | None)

include_name_in_message (bool | None)

logit_bias (Dict[str, int] | None)

max_retries (int | None)

max_tokens (int | None)

model_capabilities (ModelCapabilities | None)

model_info (ModelInfo | None)

parallel_tool_calls (bool | None)

presence_penalty (float | None)

reasoning_effort (Literal['minimal', 'low', 'medium', 'high'] | None)

response_format (ResponseFormat | None)

stop (str | List[str] | None)

stream_options (StreamOptions | None)

temperature (float | None)

timeout (float | None)

autogen_ext.models.ollama.config

autogen_ext.runtimes.grpc.protos

**Examples:**

Example 1 (json):
```json
{
   "title": "CreateArgumentsConfigModel",
   "type": "object",
   "properties": {
      "frequency_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Frequency Penalty"
      },
      "logit_bias": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "integer"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Logit Bias"
      },
      "max_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Max Tokens"
      },
      "n": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "N"
      },
      "presence_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Presence Penalty"
      },
      "response_format": {
         "anyOf": [
            {
               "$ref": "#/$defs/ResponseFormat"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "seed": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Seed"
      },
      "stop": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "items": {
                  "type": "string"
               },
               "type": "array"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Stop"
      },
      "temperature": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Temperature"
      },
      "top_p": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top P"
      },
      "user": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "User"
      },
      "stream_options": {
         "anyOf": [
            {
               "$ref": "#/$defs/StreamOptions"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "parallel_tool_calls": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Parallel Tool Calls"
      },
      "reasoning_effort": {
         "anyOf": [
            {
               "enum": [
                  "minimal",
                  "low",
                  "medium",
                  "high"
               ],
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Reasoning Effort"
      }
   },
   "$defs": {
      "JSONSchema": {
         "properties": {
            "name": {
               "title": "Name",
               "type": "string"
            },
            "description": {
               "title": "Description",
               "type": "string"
            },
            "schema": {
               "title": "Schema",
               "type": "object"
            },
            "strict": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Strict"
            }
         },
         "required": [
            "name"
         ],
         "title": "JSONSchema",
         "type": "object"
      },
      "ResponseFormat": {
         "properties": {
            "type": {
               "enum": [
                  "text",
                  "json_object",
                  "json_schema"
               ],
               "title": "Type",
               "type": "string"
            },
            "json_schema": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/JSONSchema"
                  },
                  {
                     "type": "null"
                  }
               ]
            }
         },
         "required": [
            "type",
            "json_schema"
         ],
         "title": "ResponseFormat",
         "type": "object"
      },
      "StreamOptions": {
         "properties": {
            "include_usage": {
               "title": "Include Usage",
               "type": "boolean"
            }
         },
         "required": [
            "include_usage"
         ],
         "title": "StreamOptions",
         "type": "object"
      }
   }
}
```

Example 2 (json):
```json
{
   "title": "CreateArgumentsConfigModel",
   "type": "object",
   "properties": {
      "frequency_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Frequency Penalty"
      },
      "logit_bias": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "integer"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Logit Bias"
      },
      "max_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Max Tokens"
      },
      "n": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "N"
      },
      "presence_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Presence Penalty"
      },
      "response_format": {
         "anyOf": [
            {
               "$ref": "#/$defs/ResponseFormat"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "seed": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Seed"
      },
      "stop": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "items": {
                  "type": "string"
               },
               "type": "array"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Stop"
      },
      "temperature": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Temperature"
      },
      "top_p": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top P"
      },
      "user": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "User"
      },
      "stream_options": {
         "anyOf": [
            {
               "$ref": "#/$defs/StreamOptions"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "parallel_tool_calls": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Parallel Tool Calls"
      },
      "reasoning_effort": {
         "anyOf": [
            {
               "enum": [
                  "minimal",
                  "low",
                  "medium",
                  "high"
               ],
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Reasoning Effort"
      }
   },
   "$defs": {
      "JSONSchema": {
         "properties": {
            "name": {
               "title": "Name",
               "type": "string"
            },
            "description": {
               "title": "Description",
               "type": "string"
            },
            "schema": {
               "title": "Schema",
               "type": "object"
            },
            "strict": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Strict"
            }
         },
         "required": [
            "name"
         ],
         "title": "JSONSchema",
         "type": "object"
      },
      "ResponseFormat": {
         "properties": {
            "type": {
               "enum": [
                  "text",
                  "json_object",
                  "json_schema"
               ],
               "title": "Type",
               "type": "string"
            },
            "json_schema": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/JSONSchema"
                  },
                  {
                     "type": "null"
                  }
               ]
            }
         },
         "required": [
            "type",
            "json_schema"
         ],
         "title": "ResponseFormat",
         "type": "object"
      },
      "StreamOptions": {
         "properties": {
            "include_usage": {
               "title": "Include Usage",
               "type": "boolean"
            }
         },
         "required": [
            "include_usage"
         ],
         "title": "StreamOptions",
         "type": "object"
      }
   }
}
```

Example 3 (json):
```json
{
   "title": "BaseOpenAIClientConfigurationConfigModel",
   "type": "object",
   "properties": {
      "frequency_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Frequency Penalty"
      },
      "logit_bias": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "integer"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Logit Bias"
      },
      "max_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Max Tokens"
      },
      "n": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "N"
      },
      "presence_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Presence Penalty"
      },
      "response_format": {
         "anyOf": [
            {
               "$ref": "#/$defs/ResponseFormat"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "seed": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Seed"
      },
      "stop": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "items": {
                  "type": "string"
               },
               "type": "array"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Stop"
      },
      "temperature": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Temperature"
      },
      "top_p": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top P"
      },
      "user": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "User"
      },
      "stream_options": {
         "anyOf": [
            {
               "$ref": "#/$defs/StreamOptions"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "parallel_tool_calls": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Parallel Tool Calls"
      },
      "reasoning_effort": {
         "anyOf": [
            {
               "enum": [
                  "minimal",
                  "low",
                  "medium",
                  "high"
               ],
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Reasoning Effort"
      },
      "model": {
         "title": "Model",
         "type": "string"
      },
      "api_key": {
         "anyOf": [
            {
               "format": "password",
               "type": "string",
               "writeOnly": true
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Api Key"
      },
      "timeout": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Timeout"
      },
      "max_retries": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Max Retries"
      },
      "model_capabilities": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelCapabilities"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "model_info": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelInfo"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "add_name_prefixes": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Add Name Prefixes"
      },
      "include_name_in_message": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Include Name In Message"
      },
      "default_headers": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "string"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Default Headers"
      }
   },
   "$defs": {
      "JSONSchema": {
         "properties": {
            "name": {
               "title": "Name",
               "type": "string"
            },
            "description": {
               "title": "Description",
               "type": "string"
            },
            "schema": {
               "title": "Schema",
               "type": "object"
            },
            "strict": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Strict"
            }
         },
         "required": [
            "name"
         ],
         "title": "JSONSchema",
         "type": "object"
      },
      "ModelCapabilities": {
         "deprecated": true,
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output"
         ],
         "title": "ModelCapabilities",
         "type": "object"
      },
      "ModelInfo": {
         "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.",
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            },
            "family": {
               "anyOf": [
                  {
                     "enum": [
                        "gpt-5",
                        "gpt-41",
                        "gpt-45",
                        "gpt-4o",
                        "o1",
                        "o3",
                        "o4",
                        "gpt-4",
                        "gpt-35",
                        "r1",
                        "gemini-1.5-flash",
                        "gemini-1.5-pro",
                        "gemini-2.0-flash",
                        "gemini-2.5-pro",
                        "gemini-2.5-flash",
                        "claude-3-haiku",
                        "claude-3-sonnet",
                        "claude-3-opus",
                        "claude-3-5-haiku",
                        "claude-3-5-sonnet",
                        "claude-3-7-sonnet",
                        "claude-4-opus",
                        "claude-4-sonnet",
                        "llama-3.3-8b",
                        "llama-3.3-70b",
                        "llama-4-scout",
                        "llama-4-maverick",
                        "codestral",
                        "open-codestral-mamba",
                        "mistral",
                        "ministral",
                        "pixtral",
                        "unknown"
                     ],
                     "type": "string"
                  },
                  {
                     "type": "string"
                  }
               ],
               "title": "Family"
            },
            "structured_output": {
               "title": "Structured Output",
               "type": "boolean"
            },
            "multiple_system_messages": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Multiple System Messages"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output",
            "family",
            "structured_output"
         ],
         "title": "ModelInfo",
         "type": "object"
      },
      "ResponseFormat": {
         "properties": {
            "type": {
               "enum": [
                  "text",
                  "json_object",
                  "json_schema"
               ],
               "title": "Type",
               "type": "string"
            },
            "json_schema": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/JSONSchema"
                  },
                  {
                     "type": "null"
                  }
               ]
            }
         },
         "required": [
            "type",
            "json_schema"
         ],
         "title": "ResponseFormat",
         "type": "object"
      },
      "StreamOptions": {
         "properties": {
            "include_usage": {
               "title": "Include Usage",
               "type": "boolean"
            }
         },
         "required": [
            "include_usage"
         ],
         "title": "StreamOptions",
         "type": "object"
      }
   },
   "required": [
      "model"
   ]
}
```

Example 4 (json):
```json
{
   "title": "BaseOpenAIClientConfigurationConfigModel",
   "type": "object",
   "properties": {
      "frequency_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Frequency Penalty"
      },
      "logit_bias": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "integer"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Logit Bias"
      },
      "max_tokens": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Max Tokens"
      },
      "n": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "N"
      },
      "presence_penalty": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Presence Penalty"
      },
      "response_format": {
         "anyOf": [
            {
               "$ref": "#/$defs/ResponseFormat"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "seed": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Seed"
      },
      "stop": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "items": {
                  "type": "string"
               },
               "type": "array"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Stop"
      },
      "temperature": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Temperature"
      },
      "top_p": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Top P"
      },
      "user": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "User"
      },
      "stream_options": {
         "anyOf": [
            {
               "$ref": "#/$defs/StreamOptions"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "parallel_tool_calls": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Parallel Tool Calls"
      },
      "reasoning_effort": {
         "anyOf": [
            {
               "enum": [
                  "minimal",
                  "low",
                  "medium",
                  "high"
               ],
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Reasoning Effort"
      },
      "model": {
         "title": "Model",
         "type": "string"
      },
      "api_key": {
         "anyOf": [
            {
               "format": "password",
               "type": "string",
               "writeOnly": true
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Api Key"
      },
      "timeout": {
         "anyOf": [
            {
               "type": "number"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Timeout"
      },
      "max_retries": {
         "anyOf": [
            {
               "type": "integer"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Max Retries"
      },
      "model_capabilities": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelCapabilities"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "model_info": {
         "anyOf": [
            {
               "$ref": "#/$defs/ModelInfo"
            },
            {
               "type": "null"
            }
         ],
         "default": null
      },
      "add_name_prefixes": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Add Name Prefixes"
      },
      "include_name_in_message": {
         "anyOf": [
            {
               "type": "boolean"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Include Name In Message"
      },
      "default_headers": {
         "anyOf": [
            {
               "additionalProperties": {
                  "type": "string"
               },
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Default Headers"
      }
   },
   "$defs": {
      "JSONSchema": {
         "properties": {
            "name": {
               "title": "Name",
               "type": "string"
            },
            "description": {
               "title": "Description",
               "type": "string"
            },
            "schema": {
               "title": "Schema",
               "type": "object"
            },
            "strict": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Strict"
            }
         },
         "required": [
            "name"
         ],
         "title": "JSONSchema",
         "type": "object"
      },
      "ModelCapabilities": {
         "deprecated": true,
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output"
         ],
         "title": "ModelCapabilities",
         "type": "object"
      },
      "ModelInfo": {
         "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.",
         "properties": {
            "vision": {
               "title": "Vision",
               "type": "boolean"
            },
            "function_calling": {
               "title": "Function Calling",
               "type": "boolean"
            },
            "json_output": {
               "title": "Json Output",
               "type": "boolean"
            },
            "family": {
               "anyOf": [
                  {
                     "enum": [
                        "gpt-5",
                        "gpt-41",
                        "gpt-45",
                        "gpt-4o",
                        "o1",
                        "o3",
                        "o4",
                        "gpt-4",
                        "gpt-35",
                        "r1",
                        "gemini-1.5-flash",
                        "gemini-1.5-pro",
                        "gemini-2.0-flash",
                        "gemini-2.5-pro",
                        "gemini-2.5-flash",
                        "claude-3-haiku",
                        "claude-3-sonnet",
                        "claude-3-opus",
                        "claude-3-5-haiku",
                        "claude-3-5-sonnet",
                        "claude-3-7-sonnet",
                        "claude-4-opus",
                        "claude-4-sonnet",
                        "llama-3.3-8b",
                        "llama-3.3-70b",
                        "llama-4-scout",
                        "llama-4-maverick",
                        "codestral",
                        "open-codestral-mamba",
                        "mistral",
                        "ministral",
                        "pixtral",
                        "unknown"
                     ],
                     "type": "string"
                  },
                  {
                     "type": "string"
                  }
               ],
               "title": "Family"
            },
            "structured_output": {
               "title": "Structured Output",
               "type": "boolean"
            },
            "multiple_system_messages": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Multiple System Messages"
            }
         },
         "required": [
            "vision",
            "function_calling",
            "json_output",
            "family",
            "structured_output"
         ],
         "title": "ModelInfo",
         "type": "object"
      },
      "ResponseFormat": {
         "properties": {
            "type": {
               "enum": [
                  "text",
                  "json_object",
                  "json_schema"
               ],
               "title": "Type",
               "type": "string"
            },
            "json_schema": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/JSONSchema"
                  },
                  {
                     "type": "null"
                  }
               ]
            }
         },
         "required": [
            "type",
            "json_schema"
         ],
         "title": "ResponseFormat",
         "type": "object"
      },
      "StreamOptions": {
         "properties": {
            "include_usage": {
               "title": "Include Usage",
               "type": "boolean"
            }
         },
         "required": [
            "include_usage"
         ],
         "title": "StreamOptions",
         "type": "object"
      }
   },
   "required": [
      "model"
   ]
}
```

---

## autogen_ext.models.openai — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.openai.html

**Contents:**
- autogen_ext.models.openai#

Bases: BaseOpenAIChatCompletionClient, Component[OpenAIClientConfigurationConfigModel]

Chat completion client for OpenAI hosted models.

To use this client, you must install the openai extra:

You can also use this client for OpenAI-compatible ChatCompletion endpoints. Using this client for non-OpenAI models is not tested or guaranteed.

For non-OpenAI models, please first take a look at our community extensions for additional model clients.

model (str) – Which OpenAI model to use.

api_key (optional, str) – The API key to use. Required if ‘OPENAI_API_KEY’ is not found in the environment variables.

organization (optional, str) – The organization ID to use.

base_url (optional, str) – The base URL to use. Required if the model is not hosted on OpenAI.

timeout – (optional, float): The timeout for the request in seconds.

max_retries (optional, int) – The maximum number of retries to attempt.

model_info (optional, ModelInfo) – The capabilities of the model. Required if the model name is not a valid OpenAI model.

frequency_penalty (optional, float)

logit_bias – (optional, dict[str, int]):

max_tokens (optional, int)

presence_penalty (optional, float)

response_format (optional, Dict[str, Any]) – the format of the response. Possible options are: # Text response, this is the default. {"type": "text"} # JSON response, make sure to instruct the model to return JSON. {"type": "json_object"} # Structured output response, with a pre-defined JSON schema. { "type": "json_schema", "json_schema": { "name": "name of the schema, must be an identifier.", "description": "description for the model.", # You can convert a Pydantic (v2) model to JSON schema # using the `model_json_schema()` method. "schema": "<the JSON schema itself>", # Whether to enable strict schema adherence when # generating the output. If set to true, the model will # always follow the exact schema defined in the # `schema` field. Only a subset of JSON Schema is # supported when `strict` is `true`. # To learn more, read # https://platform.openai.com/docs/guides/structured-outputs. "strict": False, # or True }, } It is recommended to use the json_output parameter in create() or create_stream() methods instead of response_format for structured output. The json_output parameter is more flexible and allows you to specify a Pydantic model class directly.

the format of the response. Possible options are:

It is recommended to use the json_output parameter in create() or create_stream() methods instead of response_format for structured output. The json_output parameter is more flexible and allows you to specify a Pydantic model class directly.

stop (optional, str | List[str])

temperature (optional, float)

top_p (optional, float)

parallel_tool_calls (optional, bool) – Whether to allow parallel tool calls. When not set, defaults to server behavior.

default_headers (optional, dict[str, str]) – Custom headers; useful for authentication or other custom requirements.

add_name_prefixes (optional, bool) – Whether to prepend the source value to each UserMessage content. E.g., “this is content” becomes “Reviewer said: this is content.” This can be useful for models that do not support the name field in message. Defaults to False.

include_name_in_message (optional, bool) – Whether to include the name field in user message parameters sent to the OpenAI API. Defaults to True. Set to False for model providers that don’t support the name field (e.g., Groq).

stream_options (optional, dict) – Additional options for streaming. Currently only include_usage is supported.

The following code snippet shows how to use the client with an OpenAI model:

To use the client with a non-OpenAI model, you need to provide the base URL of the model and the model info. For example, to use Ollama, you can use the following code snippet:

To use streaming mode, you can use the following code snippet:

To use structured output as well as function calling, you can use the following code snippet:

To load the client from a configuration, you can use the load_component method:

To view the full list of available configuration options, see the OpenAIClientConfigurationConfigModel class.

The logical type of the component.

alias of OpenAIClientConfigurationConfigModel

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: BaseOpenAIChatCompletionClient, Component[AzureOpenAIClientConfigurationConfigModel]

Chat completion client for Azure OpenAI hosted models.

To use this client, you must install the azure and openai extensions:

model (str) – Which OpenAI model to use.

azure_endpoint (str) – The endpoint for the Azure model. Required for Azure models.

azure_deployment (str) – Deployment name for the Azure model. Required for Azure models.

api_version (str) – The API version to use. Required for Azure models.

azure_ad_token (str) – The Azure AD token to use. Provide this or azure_ad_token_provider for token-based authentication.

azure_ad_token_provider (optional, Callable[[], Awaitable[str]] | AzureTokenProvider) – The Azure AD token provider to use. Provide this or azure_ad_token for token-based authentication.

api_key (optional, str) – The API key to use, use this if you are using key based authentication. It is optional if you are using Azure AD token based authentication or AZURE_OPENAI_API_KEY environment variable.

timeout – (optional, float): The timeout for the request in seconds.

max_retries (optional, int) – The maximum number of retries to attempt.

model_info (optional, ModelInfo) – The capabilities of the model. Required if the model name is not a valid OpenAI model.

frequency_penalty (optional, float)

logit_bias – (optional, dict[str, int]):

max_tokens (optional, int)

presence_penalty (optional, float)

response_format (optional, Dict[str, Any]) – the format of the response. Possible options are: # Text response, this is the default. {"type": "text"} # JSON response, make sure to instruct the model to return JSON. {"type": "json_object"} # Structured output response, with a pre-defined JSON schema. { "type": "json_schema", "json_schema": { "name": "name of the schema, must be an identifier.", "description": "description for the model.", # You can convert a Pydantic (v2) model to JSON schema # using the `model_json_schema()` method. "schema": "<the JSON schema itself>", # Whether to enable strict schema adherence when # generating the output. If set to true, the model will # always follow the exact schema defined in the # `schema` field. Only a subset of JSON Schema is # supported when `strict` is `true`. # To learn more, read # https://platform.openai.com/docs/guides/structured-outputs. "strict": False, # or True }, } It is recommended to use the json_output parameter in create() or create_stream() methods instead of response_format for structured output. The json_output parameter is more flexible and allows you to specify a Pydantic model class directly.

the format of the response. Possible options are:

It is recommended to use the json_output parameter in create() or create_stream() methods instead of response_format for structured output. The json_output parameter is more flexible and allows you to specify a Pydantic model class directly.

stop (optional, str | List[str])

temperature (optional, float)

top_p (optional, float)

parallel_tool_calls (optional, bool) – Whether to allow parallel tool calls. When not set, defaults to server behavior.

default_headers (optional, dict[str, str]) – Custom headers; useful for authentication or other custom requirements.

add_name_prefixes (optional, bool) – Whether to prepend the source value to each UserMessage content. E.g., “this is content” becomes “Reviewer said: this is content.” This can be useful for models that do not support the name field in message. Defaults to False.

include_name_in_message (optional, bool) – Whether to include the name field in user message parameters sent to the OpenAI API. Defaults to True. Set to False for model providers that don’t support the name field (e.g., Groq).

stream_options (optional, dict) – Additional options for streaming. Currently only include_usage is supported.

To use the client, you need to provide your deployment name, Azure Cognitive Services endpoint, and api version. For authentication, you can either provide an API key or an Azure Active Directory (AAD) token credential.

The following code snippet shows how to use AAD authentication. The identity used must be assigned the Cognitive Services OpenAI User role.

See other usage examples in the OpenAIChatCompletionClient class.

To load the client that uses identity based aith from a configuration, you can use the load_component method:

To view the full list of available configuration options, see the AzureOpenAIClientConfigurationConfigModel class.

Right now only DefaultAzureCredential is supported with no additional args passed to it.

The Azure OpenAI client by default sets the User-Agent header to autogen-python/{version}. To override this, you can set the variable autogen_ext.models.openai.AZURE_OPENAI_USER_AGENT environment variable to an empty string.

See here for how to use the Azure client directly or for more info.

The logical type of the component.

alias of AzureOpenAIClientConfigurationConfigModel

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: ChatCompletionClient

Creates a single response from the model.

messages (Sequence[LLMMessage]) – The messages to send to the model.

tools (Sequence[Tool | ToolSchema], optional) – The tools to use with the model. Defaults to [].

tool_choice (Tool | Literal["auto", "required", "none"], optional) – A single Tool object to force the model to use, “auto” to let the model choose any available tool, “required” to force tool usage, or “none” to disable tool usage. Defaults to “auto”.

json_output (Optional[bool | type[BaseModel]], optional) – Whether to use JSON mode, structured output, or neither. Defaults to None. If set to a Pydantic BaseModel type, it will be used as the output type for structured output. If set to a boolean, it will be used to determine whether to use JSON mode or not. If set to True, make sure to instruct the model to produce JSON output in the instruction or prompt.

extra_create_args (Mapping[str, Any], optional) – Extra arguments to pass to the underlying client. Defaults to {}.

cancellation_token (Optional[CancellationToken], optional) – A token for cancellation. Defaults to None.

CreateResult – The result of the model call.

Create a stream of string chunks from the model ending with a CreateResult.

Extends autogen_core.models.ChatCompletionClient.create_stream() to support OpenAI API.

In streaming, the default behaviour is not return token usage counts. See: OpenAI API reference for possible args.

You can set set the include_usage flag to True or extra_create_args={“stream_options”: {“include_usage”: True}}. If both the flag and stream_options are set, but to different values, an exception will be raised. (if supported by the accessed API) to return a final chunk with usage set to a RequestUsage object with prompt and completion token counts, all preceding chunks will have usage as None. See: OpenAI API reference for stream options.

temperature (float): Controls the randomness of the output. Higher values (e.g., 0.8) make the output more random, while lower values (e.g., 0.2) make it more focused and deterministic.

max_tokens (int): The maximum number of tokens to generate in the completion.

top_p (float): An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.

frequency_penalty (float): A value between -2.0 and 2.0 that penalizes new tokens based on their existing frequency in the text so far, decreasing the likelihood of repeated phrases.

presence_penalty (float): A value between -2.0 and 2.0 that penalizes new tokens based on whether they appear in the text so far, encouraging the model to talk about new topics.

Bases: BaseOpenAIClientConfigurationConfigModel

Show JSON schema{ "title": "AzureOpenAIClientConfigurationConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" }, "model": { "title": "Model", "type": "string" }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "add_name_prefixes": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Add Name Prefixes" }, "include_name_in_message": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Include Name In Message" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "azure_endpoint": { "title": "Azure Endpoint", "type": "string" }, "azure_deployment": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Azure Deployment" }, "api_version": { "title": "Api Version", "type": "string" }, "azure_ad_token": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Azure Ad Token" }, "azure_ad_token_provider": { "anyOf": [ { "$ref": "#/$defs/ComponentModel" }, { "type": "null" } ], "default": null } }, "$defs": { "ComponentModel": { "description": "Model class for a component. Contains all information required to instantiate a component.", "properties": { "provider": { "title": "Provider", "type": "string" }, "component_type": { "anyOf": [ { "enum": [ "model", "agent", "tool", "termination", "token_provider", "workbench" ], "type": "string" }, { "type": "string" }, { "type": "null" } ], "default": null, "title": "Component Type" }, "version": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Version" }, "component_version": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Component Version" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "label": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Label" }, "config": { "title": "Config", "type": "object" } }, "required": [ "provider", "config" ], "title": "ComponentModel", "type": "object" }, "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } }, "required": [ "model", "azure_endpoint", "api_version" ] }

azure_ad_token (str | None)

azure_ad_token_provider (autogen_core._component_config.ComponentModel | None)

azure_deployment (str | None)

Bases: BaseOpenAIClientConfigurationConfigModel

Show JSON schema{ "title": "OpenAIClientConfigurationConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" }, "model": { "title": "Model", "type": "string" }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "add_name_prefixes": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Add Name Prefixes" }, "include_name_in_message": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Include Name In Message" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" }, "organization": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Organization" }, "base_url": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Base Url" } }, "$defs": { "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } }, "required": [ "model" ] }

base_url (str | None)

organization (str | None)

Bases: CreateArgumentsConfigModel

Show JSON schema{ "title": "BaseOpenAIClientConfigurationConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" }, "model": { "title": "Model", "type": "string" }, "api_key": { "anyOf": [ { "format": "password", "type": "string", "writeOnly": true }, { "type": "null" } ], "default": null, "title": "Api Key" }, "timeout": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Timeout" }, "max_retries": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Retries" }, "model_capabilities": { "anyOf": [ { "$ref": "#/$defs/ModelCapabilities" }, { "type": "null" } ], "default": null }, "model_info": { "anyOf": [ { "$ref": "#/$defs/ModelInfo" }, { "type": "null" } ], "default": null }, "add_name_prefixes": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Add Name Prefixes" }, "include_name_in_message": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Include Name In Message" }, "default_headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Default Headers" } }, "$defs": { "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ModelCapabilities": { "deprecated": true, "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" } }, "required": [ "vision", "function_calling", "json_output" ], "title": "ModelCapabilities", "type": "object" }, "ModelInfo": { "description": "ModelInfo is a dictionary that contains information about a model's properties.\nIt is expected to be used in the model_info property of a model client.\n\nWe are expecting this to grow over time as we add more features.", "properties": { "vision": { "title": "Vision", "type": "boolean" }, "function_calling": { "title": "Function Calling", "type": "boolean" }, "json_output": { "title": "Json Output", "type": "boolean" }, "family": { "anyOf": [ { "enum": [ "gpt-5", "gpt-41", "gpt-45", "gpt-4o", "o1", "o3", "o4", "gpt-4", "gpt-35", "r1", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.5-flash", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-opus", "claude-4-sonnet", "llama-3.3-8b", "llama-3.3-70b", "llama-4-scout", "llama-4-maverick", "codestral", "open-codestral-mamba", "mistral", "ministral", "pixtral", "unknown" ], "type": "string" }, { "type": "string" } ], "title": "Family" }, "structured_output": { "title": "Structured Output", "type": "boolean" }, "multiple_system_messages": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Multiple System Messages" } }, "required": [ "vision", "function_calling", "json_output", "family", "structured_output" ], "title": "ModelInfo", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } }, "required": [ "model" ] }

add_name_prefixes (bool | None)

api_key (pydantic.types.SecretStr | None)

default_headers (Dict[str, str] | None)

include_name_in_message (bool | None)

max_retries (int | None)

model_capabilities (autogen_core.models._model_client.ModelCapabilities | None)

model_info (autogen_core.models._model_client.ModelInfo | None)

timeout (float | None)

Show JSON schema{ "title": "CreateArgumentsConfigModel", "type": "object", "properties": { "frequency_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Frequency Penalty" }, "logit_bias": { "anyOf": [ { "additionalProperties": { "type": "integer" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Logit Bias" }, "max_tokens": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Max Tokens" }, "n": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "N" }, "presence_penalty": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Presence Penalty" }, "response_format": { "anyOf": [ { "$ref": "#/$defs/ResponseFormat" }, { "type": "null" } ], "default": null }, "seed": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Seed" }, "stop": { "anyOf": [ { "type": "string" }, { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "title": "Stop" }, "temperature": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Temperature" }, "top_p": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "title": "Top P" }, "user": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "User" }, "stream_options": { "anyOf": [ { "$ref": "#/$defs/StreamOptions" }, { "type": "null" } ], "default": null }, "parallel_tool_calls": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Parallel Tool Calls" }, "reasoning_effort": { "anyOf": [ { "enum": [ "minimal", "low", "medium", "high" ], "type": "string" }, { "type": "null" } ], "default": null, "title": "Reasoning Effort" } }, "$defs": { "JSONSchema": { "properties": { "name": { "title": "Name", "type": "string" }, "description": { "title": "Description", "type": "string" }, "schema": { "title": "Schema", "type": "object" }, "strict": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "title": "Strict" } }, "required": [ "name" ], "title": "JSONSchema", "type": "object" }, "ResponseFormat": { "properties": { "type": { "enum": [ "text", "json_object", "json_schema" ], "title": "Type", "type": "string" }, "json_schema": { "anyOf": [ { "$ref": "#/$defs/JSONSchema" }, { "type": "null" } ] } }, "required": [ "type", "json_schema" ], "title": "ResponseFormat", "type": "object" }, "StreamOptions": { "properties": { "include_usage": { "title": "Include Usage", "type": "boolean" } }, "required": [ "include_usage" ], "title": "StreamOptions", "type": "object" } } }

frequency_penalty (float | None)

logit_bias (Dict[str, int] | None)

max_tokens (int | None)

parallel_tool_calls (bool | None)

presence_penalty (float | None)

reasoning_effort (Literal['minimal', 'low', 'medium', 'high'] | None)

response_format (autogen_ext.models.openai.config.ResponseFormat | None)

stop (str | List[str] | None)

stream_options (autogen_ext.models.openai.config.StreamOptions | None)

temperature (float | None)

autogen_ext.models.ollama

autogen_ext.models.replay

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[openai]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[openai]"
```

Example 3 (json):
```json
# Text response, this is the default.
{"type": "text"}
```

Example 4 (json):
```json
# Text response, this is the default.
{"type": "text"}
```

---

## autogen_ext.models.replay — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.replay.html

**Contents:**
- autogen_ext.models.replay#

Bases: ChatCompletionClient, Component[ReplayChatCompletionClientConfig]

A mock chat completion client that replays predefined responses using an index-based approach.

This class simulates a chat completion client by replaying a predefined list of responses. It supports both single completion and streaming responses. The responses can be either strings or CreateResult objects. The client now uses an index-based approach to access the responses, allowing for resetting the state.

The responses can be either strings or CreateResult objects.

chat_completions (Sequence[Union[str, CreateResult]]) – A list of predefined responses to replay.

ValueError("No more mock responses available") – If the list of provided outputs are exhausted.

Simple chat completion client to return pre-defined responses.

Simple streaming chat completion client to return pre-defined responses

Using .reset to reset the chat client state

The logical type of the component.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of ReplayChatCompletionClientConfig

Return the arguments of the calls made to the create method.

Return the next completion from the list.

Return the next completion as a stream.

Return mock capabilities.

Reset the client state and usage to its initial state.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.models.openai

autogen_ext.models.semantic_kernel

**Examples:**

Example 1 (python):
```python
from autogen_core.models import UserMessage
from autogen_ext.models.replay import ReplayChatCompletionClient


async def example():
    chat_completions = [
        "Hello, how can I assist you today?",
        "I'm happy to help with any questions you have.",
        "Is there anything else I can assist you with?",
    ]
    client = ReplayChatCompletionClient(chat_completions)
    messages = [UserMessage(content="What can you do?", source="user")]
    response = await client.create(messages)
    print(response.content)  # Output: "Hello, how can I assist you today?"
```

Example 2 (python):
```python
from autogen_core.models import UserMessage
from autogen_ext.models.replay import ReplayChatCompletionClient


async def example():
    chat_completions = [
        "Hello, how can I assist you today?",
        "I'm happy to help with any questions you have.",
        "Is there anything else I can assist you with?",
    ]
    client = ReplayChatCompletionClient(chat_completions)
    messages = [UserMessage(content="What can you do?", source="user")]
    response = await client.create(messages)
    print(response.content)  # Output: "Hello, how can I assist you today?"
```

Example 3 (python):
```python
import asyncio
from autogen_core.models import UserMessage
from autogen_ext.models.replay import ReplayChatCompletionClient


async def example():
    chat_completions = [
        "Hello, how can I assist you today?",
        "I'm happy to help with any questions you have.",
        "Is there anything else I can assist you with?",
    ]
    client = ReplayChatCompletionClient(chat_completions)
    messages = [UserMessage(content="What can you do?", source="user")]

    async for token in client.create_stream(messages):
        print(token, end="")  # Output: "Hello, how can I assist you today?"

    async for token in client.create_stream(messages):
        print(token, end="")  # Output: "I'm happy to help with any questions you have."

    asyncio.run(example())
```

Example 4 (python):
```python
import asyncio
from autogen_core.models import UserMessage
from autogen_ext.models.replay import ReplayChatCompletionClient


async def example():
    chat_completions = [
        "Hello, how can I assist you today?",
        "I'm happy to help with any questions you have.",
        "Is there anything else I can assist you with?",
    ]
    client = ReplayChatCompletionClient(chat_completions)
    messages = [UserMessage(content="What can you do?", source="user")]

    async for token in client.create_stream(messages):
        print(token, end="")  # Output: "Hello, how can I assist you today?"

    async for token in client.create_stream(messages):
        print(token, end="")  # Output: "I'm happy to help with any questions you have."

    asyncio.run(example())
```

---

## autogen_ext.models — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.html

**Contents:**
- autogen_ext.models#

---

## autogen_ext.runtimes.grpc.protos — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.grpc.protos.html

**Contents:**
- autogen_ext.runtimes.grpc.protos#

The autogen_ext.runtimes.grpc.protos module provides Google Protobuf classes for agent-worker communication

autogen_ext.models.openai.config

autogen_ext.runtimes.grpc.protos.agent_worker_pb2

---

## autogen_ext.tools.azure — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.azure.html

**Contents:**
- autogen_ext.tools.azure#

Bases: EmbeddingProviderMixin, BaseAzureAISearchTool

Azure AI Search tool for querying Azure search indexes.

This tool provides a simplified interface for querying Azure AI Search indexes using various search methods. It’s recommended to use the factory methods to create instances tailored for specific search types:

Full-Text Search: For traditional keyword-based searches, Lucene queries, or semantically re-ranked results. - Use AzureAISearchTool.create_full_text_search() - Supports query_type: “simple” (keyword), “full” (Lucene), “semantic”.

Vector Search: For pure similarity searches based on vector embeddings. - Use AzureAISearchTool.create_vector_search()

Hybrid Search: For combining vector search with full-text or semantic search to get the benefits of both. - Use AzureAISearchTool.create_hybrid_search() - The text component can be “simple”, “full”, or “semantic” via the query_type parameter.

Each factory method configures the tool with appropriate defaults and validations for the chosen search strategy.

If you set query_type=”semantic”, you must also provide a valid semantic_config_name. This configuration must be set up in your Azure AI Search index beforehand.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Create a tool for traditional text-based searches.

This factory method creates an AzureAISearchTool optimized for full-text search, supporting keyword matching, Lucene syntax, and semantic search capabilities.

name – The name of this tool instance

endpoint – The full URL of your Azure AI Search service

index_name – Name of the search index to query

credential – Azure credential for authentication (API key or token)

description – Optional description explaining the tool’s purpose

api_version – Azure AI Search API version to use

query_type – Type of text search to perform: simple : Basic keyword search that matches exact terms and their variations full: Advanced search using Lucene query syntax for complex queries semantic: AI-powered search that understands meaning and context, providing enhanced relevance ranking

Type of text search to perform:

simple : Basic keyword search that matches exact terms and their variations

full: Advanced search using Lucene query syntax for complex queries

semantic: AI-powered search that understands meaning and context, providing enhanced relevance ranking

search_fields – Fields to search within documents

select_fields – Fields to return in search results

top – Maximum number of results to return (default: 5)

filter – OData filter expression to refine search results

semantic_config_name – Semantic configuration name (required for semantic query_type)

enable_caching – Whether to cache search results

cache_ttl_seconds – How long to cache results in seconds

An initialized AzureAISearchTool for full-text search

Create a tool for pure vector/similarity search.

This factory method creates an AzureAISearchTool optimized for vector search, allowing for semantic similarity-based matching using vector embeddings.

name – The name of this tool instance

endpoint – The full URL of your Azure AI Search service

index_name – Name of the search index to query

credential – Azure credential for authentication (API key or token)

vector_fields – Fields to use for vector search (required)

description – Optional description explaining the tool’s purpose

api_version – Azure AI Search API version to use

select_fields – Fields to return in search results

top – Maximum number of results to return / k in k-NN (default: 5)

filter – OData filter expression to refine search results

enable_caching – Whether to cache search results

cache_ttl_seconds – How long to cache results in seconds

embedding_provider – Provider for client-side embeddings (e.g., ‘azure_openai’, ‘openai’)

embedding_model – Model for client-side embeddings (e.g., ‘text-embedding-ada-002’)

openai_api_key – API key for OpenAI/Azure OpenAI embeddings

openai_api_version – API version for Azure OpenAI embeddings

openai_endpoint – Endpoint URL for Azure OpenAI embeddings

An initialized AzureAISearchTool for vector search

ValueError – If vector_fields is empty

ValueError – If embedding_provider is ‘azure_openai’ without openai_endpoint

ValueError – If required parameters are missing or invalid

Create a tool that combines vector and text search capabilities.

This factory method creates an AzureAISearchTool configured for hybrid search, which combines the benefits of vector similarity and traditional text search.

name – The name of this tool instance

endpoint – The full URL of your Azure AI Search service

index_name – Name of the search index to query

credential – Azure credential for authentication (API key or token)

vector_fields – Fields to use for vector search (required)

search_fields – Fields to use for text search (required)

description – Optional description explaining the tool’s purpose

api_version – Azure AI Search API version to use

query_type – Type of text search to perform: simple: Basic keyword search that matches exact terms and their variations full: Advanced search using Lucene query syntax for complex queries semantic: AI-powered search that understands meaning and context, providing enhanced relevance ranking

Type of text search to perform:

simple: Basic keyword search that matches exact terms and their variations

full: Advanced search using Lucene query syntax for complex queries

semantic: AI-powered search that understands meaning and context, providing enhanced relevance ranking

select_fields – Fields to return in search results

top – Maximum number of results to return (default: 5)

filter – OData filter expression to refine search results

semantic_config_name – Semantic configuration name (required if query_type=”semantic”)

enable_caching – Whether to cache search results

cache_ttl_seconds – How long to cache results in seconds

embedding_provider – Provider for client-side embeddings (e.g., ‘azure_openai’, ‘openai’)

embedding_model – Model for client-side embeddings (e.g., ‘text-embedding-ada-002’)

openai_api_key – API key for OpenAI/Azure OpenAI embeddings

openai_api_version – API version for Azure OpenAI embeddings

openai_endpoint – Endpoint URL for Azure OpenAI embeddings

An initialized AzureAISearchTool for hybrid search

ValueError – If vector_fields or search_fields is empty

ValueError – If query_type is “semantic” without semantic_config_name

ValueError – If embedding_provider is ‘azure_openai’ without openai_endpoint

ValueError – If required parameters are missing or invalid

Bases: BaseTool[SearchQuery, SearchResults], Component[AzureAISearchConfig], EmbeddingProvider, ABC

Abstract base class for Azure AI Search tools.

This class defines the common interface and functionality for all Azure AI Search tools. It handles configuration management, client initialization, and the abstract methods that subclasses must implement.

Configuration parameters for the search service.

This is an abstract base class and should not be instantiated directly. Use concrete implementations or the factory methods in AzureAISearchTool.

alias of AzureAISearchConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Explicitly close the Azure SearchClient if needed (for cleanup).

Execute a search against the Azure AI Search index.

args – Search query text or SearchQuery object

cancellation_token – Optional token to cancel the operation

SearchResults – Container with search results and metadata

ValueError – If the search query is empty or invalid

ValueError – If there is an authentication error or other search issue

CancelledError – If the operation is cancelled

Return the schema for the tool.

Convert the search results to a string representation.

Search query parameters.

This simplified interface only requires a search query string. All other parameters (top, filters, vector fields, etc.) are specified during tool creation rather than at query time, making it easier for language models to generate structured output.

query (str) – The search query text.

Show JSON schema{ "title": "SearchQuery", "description": "Search query parameters.\n\nThis simplified interface only requires a search query string.\nAll other parameters (top, filters, vector fields, etc.) are specified during tool creation\nrather than at query time, making it easier for language models to generate structured output.\n\nArgs:\n query (str): The search query text.", "type": "object", "properties": { "query": { "description": "Search query text", "title": "Query", "type": "string" } }, "required": [ "query" ] }

score (float) – The search score.

content (ContentDict) – The document content.

metadata (MetadataDict) – Additional metadata about the document.

Show JSON schema{ "title": "SearchResult", "description": "Search result.\n\nArgs:\n score (float): The search score.\n content (ContentDict): The document content.\n metadata (MetadataDict): Additional metadata about the document.", "type": "object", "properties": { "score": { "description": "The search score", "title": "Score", "type": "number" }, "content": { "description": "The document content", "title": "Content", "type": "object" }, "metadata": { "description": "Additional metadata about the document", "title": "Metadata", "type": "object" } }, "required": [ "score", "content", "metadata" ] }

content (Dict[str, Any])

metadata (Dict[str, Any])

Additional metadata about the document

Container for search results.

results (List[SearchResult]) – List of search results.

Show JSON schema{ "title": "SearchResults", "description": "Container for search results.\n\nArgs:\n results (List[SearchResult]): List of search results.", "type": "object", "properties": { "results": { "description": "List of search results", "items": { "$ref": "#/$defs/SearchResult" }, "title": "Results", "type": "array" } }, "$defs": { "SearchResult": { "description": "Search result.\n\nArgs:\n score (float): The search score.\n content (ContentDict): The document content.\n metadata (MetadataDict): Additional metadata about the document.", "properties": { "score": { "description": "The search score", "title": "Score", "type": "number" }, "content": { "description": "The document content", "title": "Content", "type": "object" }, "metadata": { "description": "Additional metadata about the document", "title": "Metadata", "type": "object" } }, "required": [ "score", "content", "metadata" ], "title": "SearchResult", "type": "object" } }, "required": [ "results" ] }

results (List[autogen_ext.tools.azure._ai_search.SearchResult])

List of search results

Configuration for Azure AI Search with validation.

This class defines the configuration parameters for Azure AI Search tools, including authentication, search behavior, caching, and embedding settings.

This class requires the azure extra for the autogen-ext package.

An Azure AI Search service must be created in your Azure subscription.

The search index must be properly configured for your use case:

For vector search: Index must have vector fields

For semantic search: Index must have semantic configuration

For hybrid search: Both vector fields and text fields must be configured

Base functionality: azure-search-documents>=11.4.0

For Azure OpenAI embeddings: openai azure-identity

For OpenAI embeddings: openai

Show JSON schema{ "title": "AzureAISearchConfig", "description": "Configuration for Azure AI Search with validation.\n\nThis class defines the configuration parameters for Azure AI Search tools, including\nauthentication, search behavior, caching, and embedding settings.\n\n.. note::\n This class requires the ``azure`` extra for the ``autogen-ext`` package.\n\n .. code-block:: bash\n\n pip install -U \"autogen-ext[azure]\"\n\n.. note::\n **Prerequisites:**\n\n 1. An Azure AI Search service must be created in your Azure subscription.\n 2. The search index must be properly configured for your use case:\n\n - For vector search: Index must have vector fields\n - For semantic search: Index must have semantic configuration\n - For hybrid search: Both vector fields and text fields must be configured\n 3. Required packages:\n\n - Base functionality: ``azure-search-documents>=11.4.0``\n - For Azure OpenAI embeddings: ``openai azure-identity``\n - For OpenAI embeddings: ``openai``\n\nExample Usage:\n .. code-block:: python\n\n from azure.core.credentials import AzureKeyCredential\n from autogen_ext.tools.azure import AzureAISearchConfig\n\n # Basic configuration for full-text search\n config = AzureAISearchConfig(\n name=\"doc-search\",\n endpoint=\"https://your-search.search.windows.net\", # Your Azure AI Search endpoint\n index_name=\"<your-index>\", # Name of your search index\n credential=AzureKeyCredential(\"<your-key>\"), # Your Azure AI Search admin key\n query_type=\"simple\",\n search_fields=[\"content\", \"title\"], # Update with your searchable fields\n top=5,\n )\n\n # Configuration for vector search with Azure OpenAI embeddings\n vector_config = AzureAISearchConfig(\n name=\"vector-search\",\n endpoint=\"https://your-search.search.windows.net\",\n index_name=\"<your-index>\",\n credential=AzureKeyCredential(\"<your-key>\"),\n query_type=\"vector\",\n vector_fields=[\"embedding\"], # Update with your vector field name\n embedding_provider=\"azure_openai\",\n embedding_model=\"text-embedding-ada-002\",\n openai_endpoint=\"https://your-openai.openai.azure.com\", # Your Azure OpenAI endpoint\n openai_api_key=\"<your-openai-key>\", # Your Azure OpenAI key\n top=5,\n )\n\n # Configuration for hybrid search with semantic ranking\n hybrid_config = AzureAISearchConfig(\n name=\"hybrid-search\",\n endpoint=\"https://your-search.search.windows.net\",\n index_name=\"<your-index>\",\n credential=AzureKeyCredential(\"<your-key>\"),\n query_type=\"semantic\",\n semantic_config_name=\"<your-semantic-config>\", # Name of your semantic configuration\n search_fields=[\"content\", \"title\"], # Update with your search fields\n vector_fields=[\"embedding\"], # Update with your vector field name\n embedding_provider=\"openai\",\n embedding_model=\"text-embedding-ada-002\",\n openai_api_key=\"<your-openai-key>\", # Your OpenAI API key\n top=5,\n )", "type": "object", "properties": { "name": { "description": "The name of this tool instance", "title": "Name", "type": "string" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "Description explaining the tool's purpose", "title": "Description" }, "endpoint": { "description": "The full URL of your Azure AI Search service", "title": "Endpoint", "type": "string" }, "index_name": { "description": "Name of the search index to query", "title": "Index Name", "type": "string" }, "credential": { "anyOf": [], "description": "Azure credential for authentication (API key or token)", "title": "Credential" }, "api_version": { "default": "2023-10-01-preview", "description": "Azure AI Search API version to use. Defaults to 2023-10-01-preview.", "title": "Api Version", "type": "string" }, "query_type": { "default": "simple", "description": "Type of search to perform: simple, full, semantic, or vector", "enum": [ "simple", "full", "semantic", "vector" ], "title": "Query Type", "type": "string" }, "search_fields": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "description": "Fields to search within documents", "title": "Search Fields" }, "select_fields": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "description": "Fields to return in search results", "title": "Select Fields" }, "vector_fields": { "anyOf": [ { "items": { "type": "string" }, "type": "array" }, { "type": "null" } ], "default": null, "description": "Fields to use for vector search", "title": "Vector Fields" }, "top": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "description": "Maximum number of results to return. For vector searches, acts as k in k-NN.", "title": "Top" }, "filter": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "OData filter expression to refine search results", "title": "Filter" }, "semantic_config_name": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "Semantic configuration name for enhanced results", "title": "Semantic Config Name" }, "enable_caching": { "default": false, "description": "Whether to cache search results", "title": "Enable Caching", "type": "boolean" }, "cache_ttl_seconds": { "default": 300, "description": "How long to cache results in seconds", "title": "Cache Ttl Seconds", "type": "integer" }, "embedding_provider": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "Name of embedding provider for client-side embeddings", "title": "Embedding Provider" }, "embedding_model": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "Model name for client-side embeddings", "title": "Embedding Model" }, "openai_api_key": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "API key for OpenAI/Azure OpenAI embeddings", "title": "Openai Api Key" }, "openai_api_version": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "API version for Azure OpenAI embeddings", "title": "Openai Api Version" }, "openai_endpoint": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "Endpoint URL for Azure OpenAI embeddings", "title": "Openai Endpoint" } }, "required": [ "name", "endpoint", "index_name", "credential" ] }

cache_ttl_seconds (int)

credential (azure.core.credentials.AzureKeyCredential | azure.core.credentials_async.AsyncTokenCredential)

description (str | None)

embedding_model (str | None)

embedding_provider (str | None)

enable_caching (bool)

openai_api_key (str | None)

openai_api_version (str | None)

openai_endpoint (str | None)

query_type (Literal['simple', 'full', 'semantic', 'vector'])

search_fields (List[str] | None)

select_fields (List[str] | None)

semantic_config_name (str | None)

vector_fields (List[str] | None)

normalize_query_type » query_type

validate_endpoint » endpoint

validate_interdependent_fields » all fields

The name of this tool instance

validate_interdependent_fields

Description explaining the tool’s purpose

validate_interdependent_fields

The full URL of your Azure AI Search service

validate_interdependent_fields

Name of the search index to query

validate_interdependent_fields

Azure credential for authentication (API key or token)

validate_interdependent_fields

Azure AI Search API version to use. Defaults to 2023-10-01-preview.

validate_interdependent_fields

Type of search to perform: simple, full, semantic, or vector

validate_interdependent_fields

Fields to search within documents

validate_interdependent_fields

Fields to return in search results

validate_interdependent_fields

Fields to use for vector search

validate_interdependent_fields

Maximum number of results to return. For vector searches, acts as k in k-NN.

validate_interdependent_fields

OData filter expression to refine search results

validate_interdependent_fields

Semantic configuration name for enhanced results

validate_interdependent_fields

Whether to cache search results

validate_interdependent_fields

How long to cache results in seconds

validate_interdependent_fields

Name of embedding provider for client-side embeddings

validate_interdependent_fields

Model name for client-side embeddings

validate_interdependent_fields

API key for OpenAI/Azure OpenAI embeddings

validate_interdependent_fields

API version for Azure OpenAI embeddings

validate_interdependent_fields

Endpoint URL for Azure OpenAI embeddings

validate_interdependent_fields

Validate that the endpoint is a valid URL.

Normalize query type to standard values.

Ensure top is a positive integer if provided.

Validate interdependent fields after all fields have been parsed.

The query parameters to use for vector search when a text value that needs to be vectorized is provided.

All required parameters must be populated in order to send to server.

kind (str or VectorQueryKind) – The kind of vector query being performed. Required. Known values are: “vector” and “text”.

k_nearest_neighbors (int) – Number of nearest neighbors to return as top hits.

fields (str) – Vector Fields of type Collection(Edm.Single) to be included in the vector searched.

exhaustive (bool) – When true, triggers an exhaustive k-nearest neighbor search across all vectors within the vector index. Useful for scenarios where exact matches are critical, such as determining ground truth values.

oversampling (float) – Oversampling factor. Minimum value is 1. It overrides the ‘defaultOversampling’ parameter configured in the index definition. It can be set only when ‘rerankWithOriginalVectors’ is true. This parameter is only permitted when a compression method is used on the underlying vector field.

weight (float) – Relative weight of the vector query when compared to other vector query and/or the text query within the same search request. This value is used when combining the results of multiple ranking lists produced by the different vector queries and/or the results retrieved through the text query. The higher the weight, the higher the documents that matched that query will be in the final ranking. Default is 1.0 and the value needs to be a positive number larger than zero.

text (str) – The text to be vectorized to perform a vector search query. Required.

autogen_ext.teams.magentic_one

autogen_ext.tools.code_execution

**Examples:**

Example 1 (sql):
```sql
from azure.core.credentials import AzureKeyCredential
from autogen_ext.tools.azure import AzureAISearchTool

# Basic keyword search
tool = AzureAISearchTool.create_full_text_search(
    name="doc-search",
    endpoint="https://your-search.search.windows.net",  # Your Azure AI Search endpoint
    index_name="<your-index>",  # Name of your search index
    credential=AzureKeyCredential("<your-key>"),  # Your Azure AI Search admin key
    query_type="simple",  # Enable keyword search
    search_fields=["content", "title"],  # Required: fields to search within
    select_fields=["content", "title", "url"],  # Optional: fields to return
    top=5,
)

# full text (Lucene query) search
full_text_tool = AzureAISearchTool.create_full_text_search(
    name="doc-search",
    endpoint="https://your-search.search.windows.net",  # Your Azure AI Search endpoint
    index_name="<your-index>",  # Name of your search index
    credential=AzureKeyCredential("<your-key>"),  # Your Azure AI Search admin key
    query_type="full",  # Enable Lucene query syntax
    search_fields=["content", "title"],  # Required: fields to search within
    select_fields=["content", "title", "url"],  # Optional: fields to return
    top=5,
)

# Semantic search with re-ranking
# Note: Make sure your index has semantic configuration enabled
semantic_tool = AzureAISearchTool.create_full_text_search(
    name="semantic-search",
    endpoint="https://your-search.search.windows.net",
    index_name="<your-index>",
    credential=AzureKeyCredential("<your-key>"),
    query_type="semantic",  # Enable semantic ranking
    semantic_config_name="<your-semantic-config>",  # Required for semantic search
    search_fields=["content", "title"],  # Required: fields to search within
    select_fields=["content", "title", "url"],  # Optional: fields to return
    top=5,
)

# The search tool can be used with an Agent
# assistant = Agent("assistant", tools=[semantic_tool])
```

Example 2 (sql):
```sql
from azure.core.credentials import AzureKeyCredential
from autogen_ext.tools.azure import AzureAISearchTool

# Basic keyword search
tool = AzureAISearchTool.create_full_text_search(
    name="doc-search",
    endpoint="https://your-search.search.windows.net",  # Your Azure AI Search endpoint
    index_name="<your-index>",  # Name of your search index
    credential=AzureKeyCredential("<your-key>"),  # Your Azure AI Search admin key
    query_type="simple",  # Enable keyword search
    search_fields=["content", "title"],  # Required: fields to search within
    select_fields=["content", "title", "url"],  # Optional: fields to return
    top=5,
)

# full text (Lucene query) search
full_text_tool = AzureAISearchTool.create_full_text_search(
    name="doc-search",
    endpoint="https://your-search.search.windows.net",  # Your Azure AI Search endpoint
    index_name="<your-index>",  # Name of your search index
    credential=AzureKeyCredential("<your-key>"),  # Your Azure AI Search admin key
    query_type="full",  # Enable Lucene query syntax
    search_fields=["content", "title"],  # Required: fields to search within
    select_fields=["content", "title", "url"],  # Optional: fields to return
    top=5,
)

# Semantic search with re-ranking
# Note: Make sure your index has semantic configuration enabled
semantic_tool = AzureAISearchTool.create_full_text_search(
    name="semantic-search",
    endpoint="https://your-search.search.windows.net",
    index_name="<your-index>",
    credential=AzureKeyCredential("<your-key>"),
    query_type="semantic",  # Enable semantic ranking
    semantic_config_name="<your-semantic-config>",  # Required for semantic search
    search_fields=["content", "title"],  # Required: fields to search within
    select_fields=["content", "title", "url"],  # Optional: fields to return
    top=5,
)

# The search tool can be used with an Agent
# assistant = Agent("assistant", tools=[semantic_tool])
```

Example 3 (sql):
```sql
from azure.core.credentials import AzureKeyCredential
from autogen_ext.tools.azure import AzureAISearchTool

# Vector search with service-side vectorization
tool = AzureAISearchTool.create_vector_search(
    name="vector-search",
    endpoint="https://your-search.search.windows.net",  # Your Azure AI Search endpoint
    index_name="<your-index>",  # Name of your search index
    credential=AzureKeyCredential("<your-key>"),  # Your Azure AI Search admin key
    vector_fields=["content_vector"],  # Your vector field name
    select_fields=["content", "title", "url"],  # Fields to return in results
    top=5,
)

# Vector search with Azure OpenAI embeddings
azure_openai_tool = AzureAISearchTool.create_vector_search(
    name="azure-openai-vector-search",
    endpoint="https://your-search.search.windows.net",
    index_name="<your-index>",
    credential=AzureKeyCredential("<your-key>"),
    vector_fields=["content_vector"],
    embedding_provider="azure_openai",  # Use Azure OpenAI for embeddings
    embedding_model="text-embedding-ada-002",  # Embedding model to use
    openai_endpoint="https://your-openai.openai.azure.com",  # Your Azure OpenAI endpoint
    openai_api_key="<your-openai-key>",  # Your Azure OpenAI key
    openai_api_version="2024-02-15-preview",  # Azure OpenAI API version
    select_fields=["content", "title", "url"],  # Fields to return in results
    top=5,
)

# Vector search with OpenAI embeddings
openai_tool = AzureAISearchTool.create_vector_search(
    name="openai-vector-search",
    endpoint="https://your-search.search.windows.net",
    index_name="<your-index>",
    credential=AzureKeyCredential("<your-key>"),
    vector_fields=["content_vector"],
    embedding_provider="openai",  # Use OpenAI for embeddings
    embedding_model="text-embedding-ada-002",  # Embedding model to use
    openai_api_key="<your-openai-key>",  # Your OpenAI API key
    select_fields=["content", "title", "url"],  # Fields to return in results
    top=5,
)

# Use the tool with an Agent
# assistant = Agent("assistant", tools=[azure_openai_tool])
```

Example 4 (sql):
```sql
from azure.core.credentials import AzureKeyCredential
from autogen_ext.tools.azure import AzureAISearchTool

# Vector search with service-side vectorization
tool = AzureAISearchTool.create_vector_search(
    name="vector-search",
    endpoint="https://your-search.search.windows.net",  # Your Azure AI Search endpoint
    index_name="<your-index>",  # Name of your search index
    credential=AzureKeyCredential("<your-key>"),  # Your Azure AI Search admin key
    vector_fields=["content_vector"],  # Your vector field name
    select_fields=["content", "title", "url"],  # Fields to return in results
    top=5,
)

# Vector search with Azure OpenAI embeddings
azure_openai_tool = AzureAISearchTool.create_vector_search(
    name="azure-openai-vector-search",
    endpoint="https://your-search.search.windows.net",
    index_name="<your-index>",
    credential=AzureKeyCredential("<your-key>"),
    vector_fields=["content_vector"],
    embedding_provider="azure_openai",  # Use Azure OpenAI for embeddings
    embedding_model="text-embedding-ada-002",  # Embedding model to use
    openai_endpoint="https://your-openai.openai.azure.com",  # Your Azure OpenAI endpoint
    openai_api_key="<your-openai-key>",  # Your Azure OpenAI key
    openai_api_version="2024-02-15-preview",  # Azure OpenAI API version
    select_fields=["content", "title", "url"],  # Fields to return in results
    top=5,
)

# Vector search with OpenAI embeddings
openai_tool = AzureAISearchTool.create_vector_search(
    name="openai-vector-search",
    endpoint="https://your-search.search.windows.net",
    index_name="<your-index>",
    credential=AzureKeyCredential("<your-key>"),
    vector_fields=["content_vector"],
    embedding_provider="openai",  # Use OpenAI for embeddings
    embedding_model="text-embedding-ada-002",  # Embedding model to use
    openai_api_key="<your-openai-key>",  # Your OpenAI API key
    select_fields=["content", "title", "url"],  # Fields to return in results
    top=5,
)

# Use the tool with an Agent
# assistant = Agent("assistant", tools=[azure_openai_tool])
```

---

## Azure OpenAI with AAD Auth — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/azure-openai-with-aad-auth.html

**Contents:**
- Azure OpenAI with AAD Auth#
- Install Azure Identity client#
- Using the Model Client#

This guide will show you how to use the Azure OpenAI client with Azure Active Directory (AAD) authentication.

The identity used must be assigned the Cognitive Services OpenAI User role.

The Azure identity client is used to authenticate with Azure Active Directory.

See here for how to use the Azure client directly or for more info.

Termination using Intervention Handler

**Examples:**

Example 1 (unknown):
```unknown
pip install azure-identity
```

Example 2 (unknown):
```unknown
pip install azure-identity
```

Example 3 (sql):
```sql
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Create the token provider
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAIChatCompletionClient(
    azure_deployment="{your-azure-deployment}",
    model="{model-name, such as gpt-4o}",
    api_version="2024-02-01",
    azure_endpoint="https://{your-custom-endpoint}.openai.azure.com/",
    azure_ad_token_provider=token_provider,
)
```

Example 4 (sql):
```sql
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Create the token provider
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAIChatCompletionClient(
    azure_deployment="{your-azure-deployment}",
    model="{model-name, such as gpt-4o}",
    api_version="2024-02-01",
    azure_endpoint="https://{your-custom-endpoint}.openai.azure.com/",
    azure_ad_token_provider=token_provider,
)
```

---

## Discover community projects — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/extensions-user-guide/discover.html

**Contents:**
- Discover community projects#
- List of community projects#

Find samples, services and other things that work with AutoGen

Find AutoGen extensions for 3rd party tools, components and services

Find community samples and examples of how to use AutoGen

autogen-watsonx-client

Model client for IBM watsonx.ai

autogen-openaiext-client

Model client for other LLMs like Gemini, etc. through the OpenAI API

Tool adapter for Model Context Protocol server tools

A Email agent for generating email and sending

an OpenAI-style API server built on top of AutoGen

Enhanced model_context implementations, with features such as automatic summarization and truncation of model context.

Enables agents to securely execute code in isolated remote sandboxes using YepCode’s serverless runtime.

Creating your own extension

---

## FAQ — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/autogenstudio-user-guide/faq.html

**Contents:**
- FAQ#
- Q: How do I specify the directory where files(e.g. database) are stored?#
- Q: Can I use other models with AutoGen Studio?#
- Q: The server starts but I can’t access the UI#
- Q: How do I use AutoGen Studio with a different database?#
- Q: Can I export my agent workflows for use in a python app?#
- Q: Can I run AutoGen Studio in a Docker container?#

A: You can specify the directory where files are stored by setting the --appdir argument when running the application. For example, autogenstudio ui --appdir /path/to/folder. This will store the database (default) and other files in the specified directory e.g. /path/to/folder/database.sqlite.

Yes. AutoGen standardizes on the openai model api format, and you can use any api server that offers an openai compliant endpoint.

AutoGen Studio is based on declaritive specifications which applies to models as well. Agents can include a model_client field which specifies the model endpoint details including model, api_key, base_url, model type. Note, you can define your model client in python and dump it to a json file for use in AutoGen Studio.

In the following sample, we will define an OpenAI, AzureOpenAI and a local model client in python and dump them to a json file.

Have a local model server like Ollama, vLLM or LMStudio that provide an OpenAI compliant endpoint? You can use that as well.

It is important that you add the model_info field to the model client specification for custom models. This is used by the framework instantiate and use the model correctly. Also, the AssistantAgent and many other agents in AgentChat require the model to have the function_calling capability.

A: If you are running the server on a remote machine (or a local machine that fails to resolve localhost correctly), you may need to specify the host address. By default, the host address is set to localhost. You can specify the host address using the --host <host> argument. For example, to start the server on port 8081 and local address such that it is accessible from other machines on the network, you can run the following command:

A: By default, AutoGen Studio uses SQLite as the database. However, it uses the SQLModel library, which supports multiple database backends. You can use any database supported by SQLModel, such as PostgreSQL or MySQL. To use a different database, you need to specify the connection string for the database using the --database-uri argument when running the application. Example connection strings include:

SQLite: sqlite:///database.sqlite

PostgreSQL: postgresql+psycopg://user:password@localhost/dbname

MySQL: mysql+pymysql://user:password@localhost/dbname

AzureSQL: mssql+pyodbc:///?odbc_connect=DRIVER%3D%7BODBC+Driver+17+for+SQL+Server%7D%3BSERVER%3Dtcp%3Aservername.database.windows.net%2C1433%3BDATABASE%3Ddatabasename%3BUID%3Dusername%3BPWD%3Dpassword123%3BEncrypt%3Dyes%3BTrustServerCertificate%3Dno%3BConnection+Timeout%3D30%3B

You can then run the application with the specified database URI. For example, to use PostgreSQL, you can run the following command:

Note: Make sure to install the appropriate database drivers for your chosen database:

PostgreSQL: pip install psycopg2 or pip install psycopg2-binary

MySQL: pip install pymysql

SQL Server/Azure SQL: pip install pyodbc

Oracle: pip install cx_oracle

Yes. In the Team Builder view, you select a team and download its specification. This file can be imported in a python application using the TeamManager class. For example:

You can also load the team specification as an AgentChat object using the load_component method.

A: Yes, you can run AutoGen Studio in a Docker container. You can build the Docker image using the provided Dockerfile and run the container using the following commands:

Using Gunicorn as the application server for improved performance is recommended. To run AutoGen Studio with Gunicorn, you can use the following command:

Experimental Features

**Examples:**

Example 1 (python):
```python
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient, OpenAIChatCompletionClient
from autogen_ext.models.anthropic import AnthropicChatCompletionClient
from autogen_core.models import ModelInfo

model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini",
        )
print(model_client.dump_component().model_dump_json())


az_model_client = AzureOpenAIChatCompletionClient(
    azure_deployment="{your-azure-deployment}",
    model="gpt-4o",
    api_version="2024-06-01",
    azure_endpoint="https://{your-custom-endpoint}.openai.azure.com/",
    api_key="sk-...",
)
print(az_model_client.dump_component().model_dump_json())

anthropic_client = AnthropicChatCompletionClient(
        model="claude-3-sonnet-20240229",
        api_key="your-api-key",  # Optional if ANTHROPIC_API_KEY is set in environment
    )
print(anthropic_client.dump_component().model_dump_json())

mistral_vllm_model = OpenAIChatCompletionClient(
        model="TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
        base_url="http://localhost:1234/v1",
        model_info=ModelInfo(vision=False, function_calling=True, json_output=False, family="unknown", structured_output=True),
    )
print(mistral_vllm_model.dump_component().model_dump_json())
```

Example 2 (python):
```python
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient, OpenAIChatCompletionClient
from autogen_ext.models.anthropic import AnthropicChatCompletionClient
from autogen_core.models import ModelInfo

model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini",
        )
print(model_client.dump_component().model_dump_json())


az_model_client = AzureOpenAIChatCompletionClient(
    azure_deployment="{your-azure-deployment}",
    model="gpt-4o",
    api_version="2024-06-01",
    azure_endpoint="https://{your-custom-endpoint}.openai.azure.com/",
    api_key="sk-...",
)
print(az_model_client.dump_component().model_dump_json())

anthropic_client = AnthropicChatCompletionClient(
        model="claude-3-sonnet-20240229",
        api_key="your-api-key",  # Optional if ANTHROPIC_API_KEY is set in environment
    )
print(anthropic_client.dump_component().model_dump_json())

mistral_vllm_model = OpenAIChatCompletionClient(
        model="TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
        base_url="http://localhost:1234/v1",
        model_info=ModelInfo(vision=False, function_calling=True, json_output=False, family="unknown", structured_output=True),
    )
print(mistral_vllm_model.dump_component().model_dump_json())
```

Example 3 (json):
```json
{
  "provider": "autogen_ext.models.openai.OpenAIChatCompletionClient",
  "component_type": "model",
  "version": 1,
  "component_version": 1,
  "description": "Chat completion client for OpenAI hosted models.",
  "label": "OpenAIChatCompletionClient",
  "config": { "model": "gpt-4o-mini" }
}
```

Example 4 (json):
```json
{
  "provider": "autogen_ext.models.openai.OpenAIChatCompletionClient",
  "component_type": "model",
  "version": 1,
  "component_version": 1,
  "description": "Chat completion client for OpenAI hosted models.",
  "label": "OpenAIChatCompletionClient",
  "config": { "model": "gpt-4o-mini" }
}
```

---

## Model Clients — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/components/model-clients.html

**Contents:**
- Model Clients#
- Log Model Calls#
- Call Model Client#
- Streaming Tokens#
- Structured Output#
- Caching Model Responses#
- Build an Agent with a Model Client#
- API Keys From Environment Variables#

AutoGen provides a suite of built-in model clients for using ChatCompletion API. All model clients implement the ChatCompletionClient protocol class.

Currently we support the following built-in model clients:

OpenAIChatCompletionClient: for OpenAI models and models with OpenAI API compatibility (e.g., Gemini).

AzureOpenAIChatCompletionClient: for Azure OpenAI models.

AzureAIChatCompletionClient: for GitHub models and models hosted on Azure.

OllamaChatCompletionClient (Experimental): for local models hosted on Ollama.

AnthropicChatCompletionClient (Experimental): for models hosted on Anthropic.

SKChatCompletionAdapter: adapter for Semantic Kernel AI connectors.

For more information on how to use these model clients, please refer to the documentation of each client.

AutoGen uses standard Python logging module to log events like model calls and responses. The logger name is autogen_core.EVENT_LOGGER_NAME, and the event type is LLMCall.

To call a model client, you can use the create() method. This example uses the OpenAIChatCompletionClient to call an OpenAI model.

You can use the create_stream() method to create a chat completion request with streaming token chunks.

The last response in the streaming response is always the final response of the type CreateResult.

The default usage response is to return zero values. To enable usage, see create_stream() for more details.

Structured output can be enabled by setting the response_format field in OpenAIChatCompletionClient and AzureOpenAIChatCompletionClient to as a Pydantic BaseModel class.

Structured output is only available for models that support it. It also requires the model client to support structured output as well. Currently, the OpenAIChatCompletionClient and AzureOpenAIChatCompletionClient support structured output.

You also use the extra_create_args parameter in the create() method to set the response_format field so that the structured output can be configured for each request.

autogen_ext implements ChatCompletionCache that can wrap any ChatCompletionClient. Using this wrapper avoids incurring token usage when querying the underlying client with the same prompt multiple times.

ChatCompletionCache uses a CacheStore protocol. We have implemented some useful variants of CacheStore including DiskCacheStore and RedisStore.

Here’s an example of using diskcache for local caching:

Inspecting cached_client.total_usage() (or model_client.total_usage()) before and after a cached response should yield idential counts.

Note that the caching is sensitive to the exact arguments provided to cached_client.create or cached_client.create_stream, so changing tools or json_output arguments might lead to a cache miss.

Let’s create a simple AI agent that can respond to messages using the ChatCompletion API.

The SimpleAgent class is a subclass of the autogen_core.RoutedAgent class for the convenience of automatically routing messages to the appropriate handlers. It has a single handler, handle_user_message, which handles message from the user. It uses the ChatCompletionClient to generate a response to the message. It then returns the response to the user, following the direct communication model.

The cancellation_token of the type autogen_core.CancellationToken is used to cancel asynchronous operations. It is linked to async calls inside the message handlers and can be used by the caller to cancel the handlers.

The above SimpleAgent always responds with a fresh context that contains only the system message and the latest user’s message. We can use model context classes from autogen_core.model_context to make the agent “remember” previous conversations. See the Model Context page for more details.

In the examples above, we show that you can provide the API key through the api_key argument. Importantly, the OpenAI and Azure OpenAI clients use the openai package, which will automatically read an api key from the environment variable if one is not provided.

For OpenAI, you can set the OPENAI_API_KEY environment variable.

For Azure OpenAI, you can set the AZURE_OPENAI_API_KEY environment variable.

In addition, for Gemini (Beta), you can set the GEMINI_API_KEY environment variable.

This is a good practice to explore, as it avoids including sensitive api keys in your code.

**Examples:**

Example 1 (python):
```python
import logging

from autogen_core import EVENT_LOGGER_NAME

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)
```

Example 2 (python):
```python
import logging

from autogen_core import EVENT_LOGGER_NAME

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)
```

Example 3 (python):
```python
from autogen_core.models import UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(
    model="gpt-4", temperature=0.3
)  # assuming OPENAI_API_KEY is set in the environment.

result = await model_client.create([UserMessage(content="What is the capital of France?", source="user")])
print(result)
```

Example 4 (python):
```python
from autogen_core.models import UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(
    model="gpt-4", temperature=0.3
)  # assuming OPENAI_API_KEY is set in the environment.

result = await model_client.create([UserMessage(content="What is the capital of France?", source="user")])
print(result)
```

---

## Model Context — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/components/model-context.html

**Contents:**
- Model Context#

A model context supports storage and retrieval of Chat Completion messages. It is always used together with a model client to generate LLM-based responses.

For example, BufferedChatCompletionContext is a most-recent-used (MRU) context that stores the most recent buffer_size number of messages. This is useful to avoid context overflow in many LLMs.

Let’s see an example that uses BufferedChatCompletionContext.

Now let’s try to ask follow up questions after the first one.

From the second response, you can see the agent now can recall its own previous responses.

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from autogen_core.model_context import BufferedChatCompletionContext
from autogen_core.models import AssistantMessage, ChatCompletionClient, SystemMessage, UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 2 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from autogen_core.model_context import BufferedChatCompletionContext
from autogen_core.models import AssistantMessage, ChatCompletionClient, SystemMessage, UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 3 (python):
```python
@dataclass
class Message:
    content: str
```

Example 4 (python):
```python
@dataclass
class Message:
    content: str
```

---

## Tracking LLM usage with a logger — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/llm-usage-logger.html

**Contents:**
- Tracking LLM usage with a logger#

The model clients included in AutoGen emit structured events that can be used to track the usage of the model. This notebook demonstrates how to use the logger to track the usage of the model.

These events are logged to the logger with the name: :py:attr:autogen_core.EVENT_LOGGER_NAME.

Then, this logger can be attached like any other Python logger and the values read after the model is run.

Structured output using GPT-4o models

**Examples:**

Example 1 (python):
```python
import logging

from autogen_core.logging import LLMCallEvent


class LLMUsageTracker(logging.Handler):
    def __init__(self) -> None:
        """Logging handler that tracks the number of tokens used in the prompt and completion."""
        super().__init__()
        self._prompt_tokens = 0
        self._completion_tokens = 0

    @property
    def tokens(self) -> int:
        return self._prompt_tokens + self._completion_tokens

    @property
    def prompt_tokens(self) -> int:
        return self._prompt_tokens

    @property
    def completion_tokens(self) -> int:
        return self._completion_tokens

    def reset(self) -> None:
        self._prompt_tokens = 0
        self._completion_tokens = 0

    def emit(self, record: logging.LogRecord) -> None:
        """Emit the log record. To be used by the logging module."""
        try:
            # Use the StructuredMessage if the message is an instance of it
            if isinstance(record.msg, LLMCallEvent):
                event = record.msg
                self._prompt_tokens += event.prompt_tokens
                self._completion_tokens += event.completion_tokens
        except Exception:
            self.handleError(record)
```

Example 2 (python):
```python
import logging

from autogen_core.logging import LLMCallEvent


class LLMUsageTracker(logging.Handler):
    def __init__(self) -> None:
        """Logging handler that tracks the number of tokens used in the prompt and completion."""
        super().__init__()
        self._prompt_tokens = 0
        self._completion_tokens = 0

    @property
    def tokens(self) -> int:
        return self._prompt_tokens + self._completion_tokens

    @property
    def prompt_tokens(self) -> int:
        return self._prompt_tokens

    @property
    def completion_tokens(self) -> int:
        return self._completion_tokens

    def reset(self) -> None:
        self._prompt_tokens = 0
        self._completion_tokens = 0

    def emit(self, record: logging.LogRecord) -> None:
        """Emit the log record. To be used by the logging module."""
        try:
            # Use the StructuredMessage if the message is an instance of it
            if isinstance(record.msg, LLMCallEvent):
                event = record.msg
                self._prompt_tokens += event.prompt_tokens
                self._completion_tokens += event.completion_tokens
        except Exception:
            self.handleError(record)
```

Example 3 (python):
```python
from autogen_core import EVENT_LOGGER_NAME

# Set up the logging configuration to use the custom handler
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.setLevel(logging.INFO)
llm_usage = LLMUsageTracker()
logger.handlers = [llm_usage]

# client.create(...)

print(llm_usage.prompt_tokens)
print(llm_usage.completion_tokens)
```

Example 4 (python):
```python
from autogen_core import EVENT_LOGGER_NAME

# Set up the logging configuration to use the custom handler
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.setLevel(logging.INFO)
llm_usage = LLMUsageTracker()
logger.handlers = [llm_usage]

# client.create(...)

print(llm_usage.prompt_tokens)
print(llm_usage.completion_tokens)
```

---
