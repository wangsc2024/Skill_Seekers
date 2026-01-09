# Autogen - Tools

**Pages:** 8

---

## autogen_core.tools — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.tools.html

**Contents:**
- autogen_core.tools#

Bases: Tool, Protocol

Bases: ABC, Tool, Generic[ArgsT, ReturnT], ComponentBase[BaseModel]

The logical type of the component.

Run the tool with the provided arguments in a dictionary.

args (Mapping[str, Any]) – The arguments to pass to the tool.

cancellation_token (CancellationToken) – A token to cancel the operation if needed.

call_id (str | None) – An optional identifier for the tool call, used for tracing.

Any – The return value of the tool’s run method.

Bases: BaseTool[ArgsT, ReturnT], ABC, Generic[ArgsT, ReturnT, StateT], ComponentBase[BaseModel]

The logical type of the component.

Bases: BaseTool[ArgsT, ReturnT], StreamTool, ABC, Generic[ArgsT, StreamT, ReturnT], ComponentBase[BaseModel]

The logical type of the component.

Run the tool with the provided arguments and return a stream of data and end with the final return value.

Run the tool with the provided arguments in a dictionary and return a stream of data from the tool’s run_stream() method and end with the final return value.

args (Mapping[str, Any]) – The arguments to pass to the tool.

cancellation_token (CancellationToken) – A token to cancel the operation if needed.

call_id (str | None) – An optional identifier for the tool call, used for tracing.

AsyncGenerator[StreamT | ReturnT, None] – A generator yielding results from the tool’s run_stream() method.

Bases: BaseTool[BaseModel, BaseModel], Component[FunctionToolConfig]

Create custom tools by wrapping standard Python functions.

FunctionTool offers an interface for executing Python functions either asynchronously or synchronously. Each function must include type annotations for all parameters and its return type. These annotations enable FunctionTool to generate a schema necessary for input validation, serialization, and for informing the LLM about expected parameters. When the LLM prepares a function call, it leverages this schema to generate arguments that align with the function’s specifications.

It is the user’s responsibility to verify that the tool’s output type matches the expected type.

func (Callable[..., ReturnT | Awaitable[ReturnT]]) – The function to wrap and expose as a tool.

description (str) – A description to inform the model of the function’s purpose, specifying what it does and the context in which it should be called.

name (str, optional) – An optional custom name for the tool. Defaults to the function’s original name if not provided.

strict (bool, optional) – If set to True, the tool schema will only contain arguments that are explicitly defined in the function signature, and no default values will be allowed. Defaults to False. This is required to be set to True when used with models in structured output mode.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of FunctionToolConfig

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: ABC, ComponentBase[BaseModel]

A workbench is a component that provides a set of tools that may share resources and state.

A workbench is responsible for managing the lifecycle of the tools and providing a single interface to call them. The tools provided by the workbench may be dynamic and their availabilities may change after each tool execution.

A workbench can be started by calling the start() method and stopped by calling the stop() method. It can also be used as an asynchronous context manager, which will automatically start and stop the workbench when entering and exiting the context.

The logical type of the component.

List the currently available tools in the workbench as ToolSchema objects.

The list of tools may be dynamic, and their content may change after tool execution.

Call a tool in the workbench.

name (str) – The name of the tool to call.

arguments (Mapping[str, Any] | None) – The arguments to pass to the tool. If None, the tool will be called with no arguments.

cancellation_token (CancellationToken | None) – An optional cancellation token to cancel the tool execution.

call_id (str | None) – An optional identifier for the tool call, used for tracing.

ToolResult – The result of the tool execution.

Start the workbench and initialize any resources.

This method should be called before using the workbench.

Stop the workbench and release any resources.

This method should be called when the workbench is no longer needed.

Reset the workbench to its initialized, started state.

Save the state of the workbench.

This method should be called to persist the state of the workbench.

Load the state of the workbench.

state (Mapping[str, Any]) – The state to load into the workbench.

A result of a tool execution by a workbench.

Show JSON schema{ "title": "ToolResult", "description": "A result of a tool execution by a workbench.", "type": "object", "properties": { "type": { "const": "ToolResult", "default": "ToolResult", "title": "Type", "type": "string" }, "name": { "title": "Name", "type": "string" }, "result": { "items": { "discriminator": { "mapping": { "ImageResultContent": "#/$defs/ImageResultContent", "TextResultContent": "#/$defs/TextResultContent" }, "propertyName": "type" }, "oneOf": [ { "$ref": "#/$defs/TextResultContent" }, { "$ref": "#/$defs/ImageResultContent" } ] }, "title": "Result", "type": "array" }, "is_error": { "default": false, "title": "Is Error", "type": "boolean" } }, "$defs": { "ImageResultContent": { "description": "Image result content of a tool execution.", "properties": { "type": { "const": "ImageResultContent", "default": "ImageResultContent", "title": "Type", "type": "string" }, "content": { "title": "Content" } }, "required": [ "content" ], "title": "ImageResultContent", "type": "object" }, "TextResultContent": { "description": "Text result content of a tool execution.", "properties": { "type": { "const": "TextResultContent", "default": "TextResultContent", "title": "Type", "type": "string" }, "content": { "title": "Content", "type": "string" } }, "required": [ "content" ], "title": "TextResultContent", "type": "object" } }, "required": [ "name", "result" ] }

result (List[autogen_core.tools._workbench.TextResultContent | autogen_core.tools._workbench.ImageResultContent])

type (Literal['ToolResult'])

The name of the tool that was executed.

The result of the tool execution.

Whether the tool execution resulted in an error.

Convert the result to a text string.

replace_image (str | None) – The string to replace the image content with. If None, the image content will be included in the text as base64 string.

str – The text representation of the result.

Text result content of a tool execution.

Show JSON schema{ "title": "TextResultContent", "description": "Text result content of a tool execution.", "type": "object", "properties": { "type": { "const": "TextResultContent", "default": "TextResultContent", "title": "Type", "type": "string" }, "content": { "title": "Content", "type": "string" } }, "required": [ "content" ] }

type (Literal['TextResultContent'])

The text content of the result.

Image result content of a tool execution.

Show JSON schema{ "title": "ImageResultContent", "description": "Image result content of a tool execution.", "type": "object", "properties": { "type": { "const": "ImageResultContent", "default": "ImageResultContent", "title": "Type", "type": "string" }, "content": { "title": "Content" } }, "required": [ "content" ] }

content (autogen_core._image.Image)

type (Literal['ImageResultContent'])

The image content of the result.

Bases: Workbench, Component[StaticWorkbenchConfig]

A workbench that provides a static set of tools that do not change after each tool execution.

tools (List[BaseTool[Any, Any]]) – A list of tools to be included in the workbench. The tools should be subclasses of BaseTool.

tool_overrides (Optional[Dict[str, ToolOverride]]) – Optional mapping of original tool names to override configurations for name and/or description. This allows customizing how tools appear to consumers while maintaining the underlying tool functionality.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of StaticWorkbenchConfig

List the currently available tools in the workbench as ToolSchema objects.

The list of tools may be dynamic, and their content may change after tool execution.

Call a tool in the workbench.

name (str) – The name of the tool to call.

arguments (Mapping[str, Any] | None) – The arguments to pass to the tool. If None, the tool will be called with no arguments.

cancellation_token (CancellationToken | None) – An optional cancellation token to cancel the tool execution.

call_id (str | None) – An optional identifier for the tool call, used for tracing.

ToolResult – The result of the tool execution.

Start the workbench and initialize any resources.

This method should be called before using the workbench.

Stop the workbench and release any resources.

This method should be called when the workbench is no longer needed.

Reset the workbench to its initialized, started state.

Save the state of the workbench.

This method should be called to persist the state of the workbench.

Load the state of the workbench.

state (Mapping[str, Any]) – The state to load into the workbench.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: StaticWorkbench, StreamWorkbench

A workbench that provides a static set of tools that do not change after each tool execution, and supports streaming results.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Call a tool in the workbench and return a stream of results.

name (str) – The name of the tool to call.

arguments (Mapping[str, Any] | None) – The arguments to pass to the tool If None, the tool will be called with no arguments.

cancellation_token (CancellationToken | None) – An optional cancellation token to cancel the tool execution.

call_id (str | None) – An optional identifier for the tool call, used for tracing.

Override configuration for a tool’s name and/or description.

Show JSON schema{ "title": "ToolOverride", "description": "Override configuration for a tool's name and/or description.", "type": "object", "properties": { "name": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Name" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" } } }

description (str | None)

autogen_core.tool_agent

**Examples:**

Example 1 (python):
```python
import random
from autogen_core import CancellationToken
from autogen_core.tools import FunctionTool
from typing_extensions import Annotated
import asyncio


async def get_stock_price(ticker: str, date: Annotated[str, "Date in YYYY/MM/DD"]) -> float:
    # Simulates a stock price retrieval by returning a random float within a specified range.
    return random.uniform(10, 200)


async def example():
    # Initialize a FunctionTool instance for retrieving stock prices.
    stock_price_tool = FunctionTool(get_stock_price, description="Fetch the stock price for a given ticker.")

    # Execute the tool with cancellation support.
    cancellation_token = CancellationToken()
    result = await stock_price_tool.run_json({"ticker": "AAPL", "date": "2021/01/01"}, cancellation_token)

    # Output the result as a formatted string.
    print(stock_price_tool.return_value_as_string(result))


asyncio.run(example())
```

Example 2 (python):
```python
import random
from autogen_core import CancellationToken
from autogen_core.tools import FunctionTool
from typing_extensions import Annotated
import asyncio


async def get_stock_price(ticker: str, date: Annotated[str, "Date in YYYY/MM/DD"]) -> float:
    # Simulates a stock price retrieval by returning a random float within a specified range.
    return random.uniform(10, 200)


async def example():
    # Initialize a FunctionTool instance for retrieving stock prices.
    stock_price_tool = FunctionTool(get_stock_price, description="Fetch the stock price for a given ticker.")

    # Execute the tool with cancellation support.
    cancellation_token = CancellationToken()
    result = await stock_price_tool.run_json({"ticker": "AAPL", "date": "2021/01/01"}, cancellation_token)

    # Output the result as a formatted string.
    print(stock_price_tool.return_value_as_string(result))


asyncio.run(example())
```

Example 3 (json):
```json
{
   "title": "ToolResult",
   "description": "A result of a tool execution by a workbench.",
   "type": "object",
   "properties": {
      "type": {
         "const": "ToolResult",
         "default": "ToolResult",
         "title": "Type",
         "type": "string"
      },
      "name": {
         "title": "Name",
         "type": "string"
      },
      "result": {
         "items": {
            "discriminator": {
               "mapping": {
                  "ImageResultContent": "#/$defs/ImageResultContent",
                  "TextResultContent": "#/$defs/TextResultContent"
               },
               "propertyName": "type"
            },
            "oneOf": [
               {
                  "$ref": "#/$defs/TextResultContent"
               },
               {
                  "$ref": "#/$defs/ImageResultContent"
               }
            ]
         },
         "title": "Result",
         "type": "array"
      },
      "is_error": {
         "default": false,
         "title": "Is Error",
         "type": "boolean"
      }
   },
   "$defs": {
      "ImageResultContent": {
         "description": "Image result content of a tool execution.",
         "properties": {
            "type": {
               "const": "ImageResultContent",
               "default": "ImageResultContent",
               "title": "Type",
               "type": "string"
            },
            "content": {
               "title": "Content"
            }
         },
         "required": [
            "content"
         ],
         "title": "ImageResultContent",
         "type": "object"
      },
      "TextResultContent": {
         "description": "Text result content of a tool execution.",
         "properties": {
            "type": {
               "const": "TextResultContent",
               "default": "TextResultContent",
               "title": "Type",
               "type": "string"
            },
            "content": {
               "title": "Content",
               "type": "string"
            }
         },
         "required": [
            "content"
         ],
         "title": "TextResultContent",
         "type": "object"
      }
   },
   "required": [
      "name",
      "result"
   ]
}
```

Example 4 (json):
```json
{
   "title": "ToolResult",
   "description": "A result of a tool execution by a workbench.",
   "type": "object",
   "properties": {
      "type": {
         "const": "ToolResult",
         "default": "ToolResult",
         "title": "Type",
         "type": "string"
      },
      "name": {
         "title": "Name",
         "type": "string"
      },
      "result": {
         "items": {
            "discriminator": {
               "mapping": {
                  "ImageResultContent": "#/$defs/ImageResultContent",
                  "TextResultContent": "#/$defs/TextResultContent"
               },
               "propertyName": "type"
            },
            "oneOf": [
               {
                  "$ref": "#/$defs/TextResultContent"
               },
               {
                  "$ref": "#/$defs/ImageResultContent"
               }
            ]
         },
         "title": "Result",
         "type": "array"
      },
      "is_error": {
         "default": false,
         "title": "Is Error",
         "type": "boolean"
      }
   },
   "$defs": {
      "ImageResultContent": {
         "description": "Image result content of a tool execution.",
         "properties": {
            "type": {
               "const": "ImageResultContent",
               "default": "ImageResultContent",
               "title": "Type",
               "type": "string"
            },
            "content": {
               "title": "Content"
            }
         },
         "required": [
            "content"
         ],
         "title": "ImageResultContent",
         "type": "object"
      },
      "TextResultContent": {
         "description": "Text result content of a tool execution.",
         "properties": {
            "type": {
               "const": "TextResultContent",
               "default": "TextResultContent",
               "title": "Type",
               "type": "string"
            },
            "content": {
               "title": "Content",
               "type": "string"
            }
         },
         "required": [
            "content"
         ],
         "title": "TextResultContent",
         "type": "object"
      }
   },
   "required": [
      "name",
      "result"
   ]
}
```

---

## autogen_ext.tools.code_execution — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.code_execution.html

**Contents:**
- autogen_ext.tools.code_execution#

Show JSON schema{ "title": "CodeExecutionInput", "type": "object", "properties": { "code": { "description": "The contents of the Python code block that should be executed", "title": "Code", "type": "string" } }, "required": [ "code" ] }

The contents of the Python code block that should be executed

Show JSON schema{ "title": "CodeExecutionResult", "type": "object", "properties": { "success": { "title": "Success", "type": "boolean" }, "output": { "title": "Output", "type": "string" } }, "required": [ "success", "output" ] }

Bases: BaseTool[CodeExecutionInput, CodeExecutionResult], Component[PythonCodeExecutionToolConfig]

A tool that executes Python code in a code executor and returns output.

autogen_ext.code_executors.local.LocalCommandLineCodeExecutor

autogen_ext.code_executors.docker.DockerCommandLineCodeExecutor

autogen_ext.code_executors.azure.ACADynamicSessionsCodeExecutor

executor (CodeExecutor) – The code executor that will be used to execute the code blocks.

alias of PythonCodeExecutionToolConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

autogen_ext.tools.azure

autogen_ext.tools.graphrag

**Examples:**

Example 1 (json):
```json
{
   "title": "CodeExecutionInput",
   "type": "object",
   "properties": {
      "code": {
         "description": "The contents of the Python code block that should be executed",
         "title": "Code",
         "type": "string"
      }
   },
   "required": [
      "code"
   ]
}
```

Example 2 (json):
```json
{
   "title": "CodeExecutionInput",
   "type": "object",
   "properties": {
      "code": {
         "description": "The contents of the Python code block that should be executed",
         "title": "Code",
         "type": "string"
      }
   },
   "required": [
      "code"
   ]
}
```

Example 3 (json):
```json
{
   "title": "CodeExecutionResult",
   "type": "object",
   "properties": {
      "success": {
         "title": "Success",
         "type": "boolean"
      },
      "output": {
         "title": "Output",
         "type": "string"
      }
   },
   "required": [
      "success",
      "output"
   ]
}
```

Example 4 (json):
```json
{
   "title": "CodeExecutionResult",
   "type": "object",
   "properties": {
      "success": {
         "title": "Success",
         "type": "boolean"
      },
      "output": {
         "title": "Output",
         "type": "string"
      }
   },
   "required": [
      "success",
      "output"
   ]
}
```

---

## autogen_ext.tools.graphrag — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.graphrag.html

**Contents:**
- autogen_ext.tools.graphrag#

Bases: BaseTool[GlobalSearchToolArgs, GlobalSearchToolReturn]

Enables running GraphRAG global search queries as an AutoGen tool.

This tool allows you to perform semantic search over a corpus of documents using the GraphRAG framework. The search combines graph-based document relationships with semantic embeddings to find relevant information.

This tool requires the graphrag extra for the autogen-ext package.

Before using this tool, you must complete the GraphRAG setup and indexing process:

Follow the GraphRAG documentation to initialize your project and settings

Configure and tune your prompts for the specific use case

Run the indexing process to generate the required data files

Ensure you have the settings.yaml file from the setup process

Please refer to the [GraphRAG documentation](https://microsoft.github.io/graphrag/) for detailed instructions on completing these prerequisite steps.

Example usage with AssistantAgent:

Create a GlobalSearchTool instance from GraphRAG settings file.

root_dir – Path to the GraphRAG root directory

config_filepath – Path to the GraphRAG settings file (optional)

An initialized GlobalSearchTool instance

Bases: BaseTool[LocalSearchToolArgs, LocalSearchToolReturn]

Enables running GraphRAG local search queries as an AutoGen tool.

This tool allows you to perform semantic search over a corpus of documents using the GraphRAG framework. The search combines local document context with semantic embeddings to find relevant information.

This tool requires the graphrag extra for the autogen-ext package. To install:

Before using this tool, you must complete the GraphRAG setup and indexing process:

Follow the GraphRAG documentation to initialize your project and settings

Configure and tune your prompts for the specific use case

Run the indexing process to generate the required data files

Ensure you have the settings.yaml file from the setup process

Please refer to the [GraphRAG documentation](https://microsoft.github.io/graphrag/) for detailed instructions on completing these prerequisite steps.

Example usage with AssistantAgent:

token_encoder (tiktoken.Encoding) – The tokenizer used for text encoding

model – The chat model to use for search (GraphRAG ChatModel)

embedder – The text embedding model to use (GraphRAG EmbeddingModel)

data_config (DataConfig) – Configuration for data source locations and settings

context_config (LocalContextConfig, optional) – Configuration for context building. Defaults to default config.

search_config (SearchConfig, optional) – Configuration for search operations. Defaults to default config.

Create a LocalSearchTool instance from GraphRAG settings file.

root_dir – Path to the GraphRAG root directory

config_filepath – Path to the GraphRAG settings file (optional)

An initialized LocalSearchTool instance

Show JSON schema{ "title": "GlobalDataConfig", "type": "object", "properties": { "input_dir": { "title": "Input Dir", "type": "string" }, "entity_table": { "default": "entities", "title": "Entity Table", "type": "string" }, "entity_embedding_table": { "default": "entities", "title": "Entity Embedding Table", "type": "string" }, "community_table": { "default": "communities", "title": "Community Table", "type": "string" }, "community_level": { "default": 2, "title": "Community Level", "type": "integer" }, "community_report_table": { "default": "community_reports", "title": "Community Report Table", "type": "string" } }, "required": [ "input_dir" ] }

community_report_table (str)

Show JSON schema{ "title": "LocalDataConfig", "type": "object", "properties": { "input_dir": { "title": "Input Dir", "type": "string" }, "entity_table": { "default": "entities", "title": "Entity Table", "type": "string" }, "entity_embedding_table": { "default": "entities", "title": "Entity Embedding Table", "type": "string" }, "community_table": { "default": "communities", "title": "Community Table", "type": "string" }, "community_level": { "default": 2, "title": "Community Level", "type": "integer" }, "relationship_table": { "default": "relationships", "title": "Relationship Table", "type": "string" }, "text_unit_table": { "default": "text_units", "title": "Text Unit Table", "type": "string" } }, "required": [ "input_dir" ] }

relationship_table (str)

text_unit_table (str)

Show JSON schema{ "title": "GlobalContextConfig", "type": "object", "properties": { "max_data_tokens": { "default": 12000, "title": "Max Data Tokens", "type": "integer" }, "use_community_summary": { "default": false, "title": "Use Community Summary", "type": "boolean" }, "shuffle_data": { "default": true, "title": "Shuffle Data", "type": "boolean" }, "include_community_rank": { "default": true, "title": "Include Community Rank", "type": "boolean" }, "min_community_rank": { "default": 0, "title": "Min Community Rank", "type": "integer" }, "community_rank_name": { "default": "rank", "title": "Community Rank Name", "type": "string" }, "include_community_weight": { "default": true, "title": "Include Community Weight", "type": "boolean" }, "community_weight_name": { "default": "occurrence weight", "title": "Community Weight Name", "type": "string" }, "normalize_community_weight": { "default": true, "title": "Normalize Community Weight", "type": "boolean" } } }

community_rank_name (str)

community_weight_name (str)

include_community_rank (bool)

include_community_weight (bool)

max_data_tokens (int)

min_community_rank (int)

normalize_community_weight (bool)

use_community_summary (bool)

Show JSON schema{ "title": "GlobalSearchToolArgs", "type": "object", "properties": { "query": { "description": "The user query to perform global search on.", "title": "Query", "type": "string" } }, "required": [ "query" ] }

The user query to perform global search on.

Show JSON schema{ "title": "GlobalSearchToolReturn", "type": "object", "properties": { "answer": { "title": "Answer", "type": "string" } }, "required": [ "answer" ] }

Show JSON schema{ "title": "LocalContextConfig", "type": "object", "properties": { "max_data_tokens": { "default": 8000, "title": "Max Data Tokens", "type": "integer" }, "text_unit_prop": { "default": 0.5, "title": "Text Unit Prop", "type": "number" }, "community_prop": { "default": 0.25, "title": "Community Prop", "type": "number" }, "include_entity_rank": { "default": true, "title": "Include Entity Rank", "type": "boolean" }, "rank_description": { "default": "number of relationships", "title": "Rank Description", "type": "string" }, "include_relationship_weight": { "default": true, "title": "Include Relationship Weight", "type": "boolean" }, "relationship_ranking_attribute": { "default": "rank", "title": "Relationship Ranking Attribute", "type": "string" } } }

community_prop (float)

include_entity_rank (bool)

include_relationship_weight (bool)

rank_description (str)

relationship_ranking_attribute (str)

text_unit_prop (float)

Show JSON schema{ "title": "LocalSearchToolArgs", "type": "object", "properties": { "query": { "description": "The user query to perform local search on.", "title": "Query", "type": "string" } }, "required": [ "query" ] }

The user query to perform local search on.

Show JSON schema{ "title": "LocalSearchToolReturn", "type": "object", "properties": { "answer": { "description": "The answer to the user query.", "title": "Answer", "type": "string" } }, "required": [ "answer" ] }

The answer to the user query.

Show JSON schema{ "title": "MapReduceConfig", "type": "object", "properties": { "map_max_tokens": { "default": 1000, "title": "Map Max Tokens", "type": "integer" }, "map_temperature": { "default": 0.0, "title": "Map Temperature", "type": "number" }, "reduce_max_tokens": { "default": 2000, "title": "Reduce Max Tokens", "type": "integer" }, "reduce_temperature": { "default": 0.0, "title": "Reduce Temperature", "type": "number" }, "allow_general_knowledge": { "default": false, "title": "Allow General Knowledge", "type": "boolean" }, "json_mode": { "default": false, "title": "Json Mode", "type": "boolean" }, "response_type": { "default": "multiple paragraphs", "title": "Response Type", "type": "string" } } }

allow_general_knowledge (bool)

map_temperature (float)

reduce_max_tokens (int)

reduce_temperature (float)

Show JSON schema{ "title": "SearchConfig", "type": "object", "properties": { "max_tokens": { "default": 1500, "title": "Max Tokens", "type": "integer" }, "temperature": { "default": 0.0, "title": "Temperature", "type": "number" }, "response_type": { "default": "multiple paragraphs", "title": "Response Type", "type": "string" } } }

autogen_ext.tools.code_execution

autogen_ext.tools.http

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-agentchat" "autogen-ext[graphrag]"
```

Example 2 (unknown):
```unknown
pip install -U "autogen-agentchat" "autogen-ext[graphrag]"
```

Example 3 (python):
```python
import asyncio
from pathlib import Path
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.ui import Console
from autogen_ext.tools.graphrag import GlobalSearchTool
from autogen_agentchat.agents import AssistantAgent


async def main():
    # Initialize the OpenAI client
    openai_client = OpenAIChatCompletionClient(
        model="gpt-4o-mini",
        api_key="<api-key>",
    )

    # Set up global search tool
    global_tool = GlobalSearchTool.from_settings(root_dir=Path("./"), config_filepath=Path("./settings.yaml"))

    # Create assistant agent with the global search tool
    assistant_agent = AssistantAgent(
        name="search_assistant",
        tools=[global_tool],
        model_client=openai_client,
        system_message=(
            "You are a tool selector AI assistant using the GraphRAG framework. "
            "Your primary task is to determine the appropriate search tool to call based on the user's query. "
            "For broader, abstract questions requiring a comprehensive understanding of the dataset, call the 'global_search' function."
        ),
    )

    # Run a sample query
    query = "What is the overall sentiment of the community reports?"
    await Console(assistant_agent.run_stream(task=query))


if __name__ == "__main__":
    asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from pathlib import Path
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.ui import Console
from autogen_ext.tools.graphrag import GlobalSearchTool
from autogen_agentchat.agents import AssistantAgent


async def main():
    # Initialize the OpenAI client
    openai_client = OpenAIChatCompletionClient(
        model="gpt-4o-mini",
        api_key="<api-key>",
    )

    # Set up global search tool
    global_tool = GlobalSearchTool.from_settings(root_dir=Path("./"), config_filepath=Path("./settings.yaml"))

    # Create assistant agent with the global search tool
    assistant_agent = AssistantAgent(
        name="search_assistant",
        tools=[global_tool],
        model_client=openai_client,
        system_message=(
            "You are a tool selector AI assistant using the GraphRAG framework. "
            "Your primary task is to determine the appropriate search tool to call based on the user's query. "
            "For broader, abstract questions requiring a comprehensive understanding of the dataset, call the 'global_search' function."
        ),
    )

    # Run a sample query
    query = "What is the overall sentiment of the community reports?"
    await Console(assistant_agent.run_stream(task=query))


if __name__ == "__main__":
    asyncio.run(main())
```

---

## autogen_ext.tools.http — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.http.html

**Contents:**
- autogen_ext.tools.http#

Bases: BaseTool[BaseModel, Any], Component[HttpToolConfig]

A wrapper for using an HTTP server as a tool.

name (str) – The name of the tool.

description (str, optional) – A description of the tool.

scheme (str) – The scheme to use for the request. Must be either “http” or “https”.

host (str) – The host to send the request to.

port (int) – The port to send the request to.

path (str, optional) – The path to send the request to. Defaults to “/”. Can include path parameters like “/{param1}/{param2}” which will be templated from input args.

method (str, optional) – The HTTP method to use, will default to POST if not provided. Must be one of “GET”, “POST”, “PUT”, “DELETE”, “PATCH”.

headers (dict[str, Any], optional) – A dictionary of headers to send with the request.

json_schema (dict[str, Any]) – A JSON Schema object defining the expected parameters for the tool. Path parameters must also be included in the schema and must be strings.

return_type (Literal["text", "json"], optional) – The type of response to return from the tool. Defaults to “text”.

timeout (float, optional) – The timeout for HTTP requests in seconds. Defaults to 5.0.

This tool requires the http-tool extra for the autogen-ext package.

The logical type of the component.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of HttpToolConfig

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Execute the HTTP tool with the given arguments.

args – The validated input arguments

cancellation_token – Token for cancelling the operation

The response body from the HTTP call in JSON format

Exception – If tool execution fails

autogen_ext.tools.graphrag

autogen_ext.tools.langchain

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-agentchat" "autogen-ext[http-tool]"
```

Example 2 (unknown):
```unknown
pip install -U "autogen-agentchat" "autogen-ext[http-tool]"
```

Example 3 (python):
```python
import asyncio

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.http import HttpTool

# Define a JSON schema for a base64 decode tool
base64_schema = {
    "type": "object",
    "properties": {
        "value": {"type": "string", "description": "The base64 value to decode"},
    },
    "required": ["value"],
}

# Create an HTTP tool for the httpbin API
base64_tool = HttpTool(
    name="base64_decode",
    description="base64 decode a value",
    scheme="https",
    host="httpbin.org",
    port=443,
    path="/base64/{value}",
    method="GET",
    json_schema=base64_schema,
)


async def main():
    # Create an assistant with the base64 tool
    model = OpenAIChatCompletionClient(model="gpt-4")
    assistant = AssistantAgent("base64_assistant", model_client=model, tools=[base64_tool])

    # The assistant can now use the base64 tool to decode the string
    response = await assistant.on_messages(
        [TextMessage(content="Can you base64 decode the value 'YWJjZGU=', please?", source="user")],
        CancellationToken(),
    )
    print(response.chat_message)


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.http import HttpTool

# Define a JSON schema for a base64 decode tool
base64_schema = {
    "type": "object",
    "properties": {
        "value": {"type": "string", "description": "The base64 value to decode"},
    },
    "required": ["value"],
}

# Create an HTTP tool for the httpbin API
base64_tool = HttpTool(
    name="base64_decode",
    description="base64 decode a value",
    scheme="https",
    host="httpbin.org",
    port=443,
    path="/base64/{value}",
    method="GET",
    json_schema=base64_schema,
)


async def main():
    # Create an assistant with the base64 tool
    model = OpenAIChatCompletionClient(model="gpt-4")
    assistant = AssistantAgent("base64_assistant", model_client=model, tools=[base64_tool])

    # The assistant can now use the base64 tool to decode the string
    response = await assistant.on_messages(
        [TextMessage(content="Can you base64 decode the value 'YWJjZGU=', please?", source="user")],
        CancellationToken(),
    )
    print(response.chat_message)


asyncio.run(main())
```

---

## autogen_ext.tools.langchain — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.langchain.html

**Contents:**
- autogen_ext.tools.langchain#

Bases: BaseTool[BaseModel, Any]

Allows you to wrap a LangChain tool and make it available to AutoGen.

This class requires the langchain extra for the autogen-ext package.

langchain_tool (LangChainTool) – A LangChain tool to wrap

Use the PythonAstREPLTool from the langchain_experimental package to create a tool that allows you to interact with a Pandas DataFrame.

This example demonstrates how to use the SQLDatabaseToolkit from the langchain_community package to interact with an SQLite database. It uses the RoundRobinGroupChat to iterate the single agent over multiple steps. If you want to one step at a time, you can just call run_stream method of the AssistantAgent class directly.

autogen_ext.tools.http

autogen_ext.tools.mcp

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-ext[langchain]"
```

Example 2 (unknown):
```unknown
pip install -U "autogen-ext[langchain]"
```

Example 3 (python):
```python
import asyncio
import pandas as pd
from langchain_experimental.tools.python.tool import PythonAstREPLTool
from autogen_ext.tools.langchain import LangChainToolAdapter
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_core import CancellationToken


async def main() -> None:
    df = pd.read_csv("https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv")  # type: ignore
    tool = LangChainToolAdapter(PythonAstREPLTool(locals={"df": df}))
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    agent = AssistantAgent(
        "assistant",
        tools=[tool],
        model_client=model_client,
        system_message="Use the `df` variable to access the dataset.",
    )
    await Console(
        agent.on_messages_stream(
            [TextMessage(content="What's the average age of the passengers?", source="user")], CancellationToken()
        )
    )


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
import pandas as pd
from langchain_experimental.tools.python.tool import PythonAstREPLTool
from autogen_ext.tools.langchain import LangChainToolAdapter
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_core import CancellationToken


async def main() -> None:
    df = pd.read_csv("https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv")  # type: ignore
    tool = LangChainToolAdapter(PythonAstREPLTool(locals={"df": df}))
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    agent = AssistantAgent(
        "assistant",
        tools=[tool],
        model_client=model_client,
        system_message="Use the `df` variable to access the dataset.",
    )
    await Console(
        agent.on_messages_stream(
            [TextMessage(content="What's the average age of the passengers?", source="user")], CancellationToken()
        )
    )


asyncio.run(main())
```

---

## autogen_ext.tools.mcp — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.mcp.html

**Contents:**
- autogen_ext.tools.mcp#

Create an MCP client session for the given server parameters.

Bases: ComponentBase[BaseModel], Component[McpSessionActorConfig]

The logical type of the component.

alias of McpSessionActorConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Bases: McpToolAdapter[StdioServerParams], Component[StdioMcpToolAdapterConfig]

Allows you to wrap an MCP tool running over STDIO and make it available to AutoGen.

This adapter enables using MCP-compatible tools that communicate over standard input/output with AutoGen agents. Common use cases include wrapping command-line tools and local services that implement the Model Context Protocol (MCP).

To use this class, you need to install mcp extra for the autogen-ext package.

server_params (StdioServerParams) – Parameters for the MCP server connection, including command to run and its arguments

tool (Tool) – The MCP tool to wrap

session (ClientSession, optional) – The MCP client session to use. If not provided, a new session will be created. This is useful for testing or when you want to manage the session lifecycle yourself.

See mcp_server_tools() for examples.

alias of StdioMcpToolAdapterConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Bases: StdioServerParameters

Parameters for connecting to an MCP server over STDIO.

Show JSON schema{ "title": "StdioServerParams", "description": "Parameters for connecting to an MCP server over STDIO.", "type": "object", "properties": { "command": { "title": "Command", "type": "string" }, "args": { "items": { "type": "string" }, "title": "Args", "type": "array" }, "env": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Env" }, "cwd": { "anyOf": [ { "type": "string" }, { "format": "path", "type": "string" }, { "type": "null" } ], "default": null, "title": "Cwd" }, "encoding": { "default": "utf-8", "title": "Encoding", "type": "string" }, "encoding_error_handler": { "default": "strict", "enum": [ "strict", "ignore", "replace" ], "title": "Encoding Error Handler", "type": "string" }, "type": { "const": "StdioServerParams", "default": "StdioServerParams", "title": "Type", "type": "string" }, "read_timeout_seconds": { "default": 5, "title": "Read Timeout Seconds", "type": "number" } }, "required": [ "command" ] }

read_timeout_seconds (float)

type (Literal['StdioServerParams'])

Bases: McpToolAdapter[SseServerParams], Component[SseMcpToolAdapterConfig]

Allows you to wrap an MCP tool running over Server-Sent Events (SSE) and make it available to AutoGen.

This adapter enables using MCP-compatible tools that communicate over HTTP with SSE with AutoGen agents. Common use cases include integrating with remote MCP services, cloud-based tools, and web APIs that implement the Model Context Protocol (MCP).

To use this class, you need to install mcp extra for the autogen-ext package.

server_params (SseServerParameters) – Parameters for the MCP server connection, including URL, headers, and timeouts.

tool (Tool) – The MCP tool to wrap.

session (ClientSession, optional) – The MCP client session to use. If not provided, it will create a new session. This is useful for testing or when you want to manage the session lifecycle yourself.

Use a remote translation service that implements MCP over SSE to create tools that allow AutoGen agents to perform translations:

alias of SseMcpToolAdapterConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Parameters for connecting to an MCP server over SSE.

Show JSON schema{ "title": "SseServerParams", "description": "Parameters for connecting to an MCP server over SSE.", "type": "object", "properties": { "type": { "const": "SseServerParams", "default": "SseServerParams", "title": "Type", "type": "string" }, "url": { "title": "Url", "type": "string" }, "headers": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Headers" }, "timeout": { "default": 5, "title": "Timeout", "type": "number" }, "sse_read_timeout": { "default": 300, "title": "Sse Read Timeout", "type": "number" } }, "required": [ "url" ] }

headers (dict[str, Any] | None)

sse_read_timeout (float)

type (Literal['SseServerParams'])

Bases: McpToolAdapter[StreamableHttpServerParams], Component[StreamableHttpMcpToolAdapterConfig]

Allows you to wrap an MCP tool running over Streamable HTTP and make it available to AutoGen.

This adapter enables using MCP-compatible tools that communicate over Streamable HTTP with AutoGen agents. Common use cases include integrating with remote MCP services, cloud-based tools, and web APIs that implement the Model Context Protocol (MCP).

To use this class, you need to install mcp extra for the autogen-ext package.

server_params (StreamableHttpServerParams) – Parameters for the MCP server connection, including URL, headers, and timeouts.

tool (Tool) – The MCP tool to wrap.

session (ClientSession, optional) – The MCP client session to use. If not provided, it will create a new session. This is useful for testing or when you want to manage the session lifecycle yourself.

Use a remote translation service that implements MCP over Streamable HTTP to create tools that allow AutoGen agents to perform translations:

alias of StreamableHttpMcpToolAdapterConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Parameters for connecting to an MCP server over Streamable HTTP.

Show JSON schema{ "title": "StreamableHttpServerParams", "description": "Parameters for connecting to an MCP server over Streamable HTTP.", "type": "object", "properties": { "type": { "const": "StreamableHttpServerParams", "default": "StreamableHttpServerParams", "title": "Type", "type": "string" }, "url": { "title": "Url", "type": "string" }, "headers": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Headers" }, "timeout": { "default": 30.0, "title": "Timeout", "type": "number" }, "sse_read_timeout": { "default": 300.0, "title": "Sse Read Timeout", "type": "number" }, "terminate_on_close": { "default": true, "title": "Terminate On Close", "type": "boolean" } }, "required": [ "url" ] }

headers (dict[str, Any] | None)

sse_read_timeout (float)

terminate_on_close (bool)

type (Literal['StreamableHttpServerParams'])

Creates a list of MCP tool adapters that can be used with AutoGen agents.

Only connect to trusted MCP servers, especially when using StdioServerParams as it executes commands in the local environment.

This factory function connects to an MCP server and returns adapters for all available tools. The adapters can be directly assigned to an AutoGen agent’s tools list.

To use this function, you need to install mcp extra for the autogen-ext package.

server_params (McpServerParams) – Connection parameters for the MCP server. Can be either StdioServerParams for command-line tools or SseServerParams and StreamableHttpServerParams for HTTP/SSE services.

session (ClientSession | None) – Optional existing session to use. This is used when you want to reuse an existing connection to the MCP server. The session will be reused when creating the MCP tool adapters.

list[StdioMcpToolAdapter | SseMcpToolAdapter | StreamableHttpMcpToolAdapter] – A list of tool adapters ready to use with AutoGen agents.

Local file system MCP service over standard I/O example:

Install the filesystem server package from npm (requires Node.js 16+ and npm).

Create an agent that can use all tools from the local filesystem MCP server.

Local fetch MCP service over standard I/O example:

Install the mcp-server-fetch package.

Create an agent that can use the fetch tool from the local MCP server.

Sharing an MCP client session across multiple tools:

You can create a single MCP client session and share it across multiple tools. This is sometimes required when the server maintains a session state (e.g., a browser state) that should be reused for multiple requests.

The following example show how to create a single MCP client session to a local Playwright server and share it across multiple tools.

Remote MCP service over SSE example:

For more examples and detailed usage, see the samples directory in the package repository.

Bases: Workbench, Component[McpWorkbenchConfig]

A workbench that wraps an MCP server and provides an interface to list and call tools provided by the server.

Only connect to trusted MCP servers, especially when using StdioServerParams as it executes commands in the local environment.

This workbench should be used as a context manager to ensure proper initialization and cleanup of the underlying MCP session.

list_tools, call_tool

list_resources, read_resource

list_resource_templates, read_resource_template

list_prompts, get_prompt

Optional support via model_client

server_params (McpServerParams) – The parameters to connect to the MCP server. This can be either a StdioServerParams or SseServerParams.

tool_overrides (Optional[Dict[str, ToolOverride]]) – Optional mapping of original tool names to override configurations for name and/or description. This allows customizing how server tools appear to consumers while maintaining the underlying tool functionality.

model_client – Optional chat completion client to handle sampling requests from MCP servers that support the sampling capability. This allows MCP servers to request text generation from a language model during tool execution. If not provided, sampling requests will return an error.

ValueError – If there are conflicts in tool override names.

Here is a simple example of how to use the workbench with a mcp-server-fetch server:

Example of using tool overrides:

Example of using the workbench with the GitHub MCP Server:

Example of using the workbench with the Playwright MCP Server:

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of McpWorkbenchConfig

List the currently available tools in the workbench as ToolSchema objects.

The list of tools may be dynamic, and their content may change after tool execution.

Call a tool in the workbench.

name (str) – The name of the tool to call.

arguments (Mapping[str, Any] | None) – The arguments to pass to the tool. If None, the tool will be called with no arguments.

cancellation_token (CancellationToken | None) – An optional cancellation token to cancel the tool execution.

call_id (str | None) – An optional identifier for the tool call, used for tracing.

ToolResult – The result of the tool execution.

List available prompts from the MCP server.

List available resources from the MCP server.

List available resource templates from the MCP server.

Read a resource from the MCP server.

Get a prompt from the MCP server.

Start the workbench and initialize any resources.

This method should be called before using the workbench.

Stop the workbench and release any resources.

This method should be called when the workbench is no longer needed.

Reset the workbench to its initialized, started state.

Save the state of the workbench.

This method should be called to persist the state of the workbench.

Load the state of the workbench.

state (Mapping[str, Any]) – The state to load into the workbench.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.tools.langchain

autogen_ext.tools.semantic_kernel

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-ext[mcp]"
```

Example 2 (unknown):
```unknown
pip install -U "autogen-ext[mcp]"
```

Example 3 (json):
```json
{
   "title": "StdioServerParams",
   "description": "Parameters for connecting to an MCP server over STDIO.",
   "type": "object",
   "properties": {
      "command": {
         "title": "Command",
         "type": "string"
      },
      "args": {
         "items": {
            "type": "string"
         },
         "title": "Args",
         "type": "array"
      },
      "env": {
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
         "title": "Env"
      },
      "cwd": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "format": "path",
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Cwd"
      },
      "encoding": {
         "default": "utf-8",
         "title": "Encoding",
         "type": "string"
      },
      "encoding_error_handler": {
         "default": "strict",
         "enum": [
            "strict",
            "ignore",
            "replace"
         ],
         "title": "Encoding Error Handler",
         "type": "string"
      },
      "type": {
         "const": "StdioServerParams",
         "default": "StdioServerParams",
         "title": "Type",
         "type": "string"
      },
      "read_timeout_seconds": {
         "default": 5,
         "title": "Read Timeout Seconds",
         "type": "number"
      }
   },
   "required": [
      "command"
   ]
}
```

Example 4 (json):
```json
{
   "title": "StdioServerParams",
   "description": "Parameters for connecting to an MCP server over STDIO.",
   "type": "object",
   "properties": {
      "command": {
         "title": "Command",
         "type": "string"
      },
      "args": {
         "items": {
            "type": "string"
         },
         "title": "Args",
         "type": "array"
      },
      "env": {
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
         "title": "Env"
      },
      "cwd": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "format": "path",
               "type": "string"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Cwd"
      },
      "encoding": {
         "default": "utf-8",
         "title": "Encoding",
         "type": "string"
      },
      "encoding_error_handler": {
         "default": "strict",
         "enum": [
            "strict",
            "ignore",
            "replace"
         ],
         "title": "Encoding Error Handler",
         "type": "string"
      },
      "type": {
         "const": "StdioServerParams",
         "default": "StdioServerParams",
         "title": "Type",
         "type": "string"
      },
      "read_timeout_seconds": {
         "default": 5,
         "title": "Read Timeout Seconds",
         "type": "number"
      }
   },
   "required": [
      "command"
   ]
}
```

---

## autogen_ext.tools.semantic_kernel — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.tools.semantic_kernel.html

**Contents:**
- autogen_ext.tools.semantic_kernel#

Bases: KernelFunctionFromMethod

Show JSON schema{ "title": "KernelFunctionFromTool", "type": "object", "properties": { "metadata": { "$ref": "#/$defs/KernelFunctionMetadata" }, "invocation_duration_histogram": { "default": null, "title": "Invocation Duration Histogram" }, "streaming_duration_histogram": { "default": null, "title": "Streaming Duration Histogram" }, "method": { "default": null, "title": "Method" }, "stream_method": { "default": null, "title": "Stream Method" } }, "$defs": { "KernelFunctionMetadata": { "description": "The kernel function metadata.", "properties": { "name": { "pattern": "^[0-9A-Za-z_]+$", "title": "Name", "type": "string" }, "plugin_name": { "anyOf": [ { "pattern": "^[0-9A-Za-z_]+$", "type": "string" }, { "type": "null" } ], "default": null, "title": "Plugin Name" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "parameters": { "items": { "$ref": "#/$defs/KernelParameterMetadata" }, "title": "Parameters", "type": "array" }, "is_prompt": { "title": "Is Prompt", "type": "boolean" }, "is_asynchronous": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": true, "title": "Is Asynchronous" }, "return_parameter": { "anyOf": [ { "$ref": "#/$defs/KernelParameterMetadata" }, { "type": "null" } ], "default": null }, "additional_properties": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Additional Properties" } }, "required": [ "name", "is_prompt" ], "title": "KernelFunctionMetadata", "type": "object" }, "KernelParameterMetadata": { "description": "The kernel parameter metadata.", "properties": { "name": { "anyOf": [ { "pattern": "^[0-9A-Za-z_]+$", "type": "string" }, { "type": "null" } ], "title": "Name" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "default_value": { "anyOf": [ {}, { "type": "null" } ], "default": null, "title": "Default Value" }, "type": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": "str", "title": "Type" }, "is_required": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": false, "title": "Is Required" }, "type_object": { "anyOf": [ {}, { "type": "null" } ], "default": null, "title": "Type Object" }, "schema_data": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Schema Data" }, "include_in_function_choices": { "default": true, "title": "Include In Function Choices", "type": "boolean" } }, "required": [ "name" ], "title": "KernelParameterMetadata", "type": "object" } }, "required": [ "metadata" ] }

Bases: KernelFunctionFromPrompt

Show JSON schema{ "title": "KernelFunctionFromToolSchema", "type": "object", "properties": { "metadata": { "$ref": "#/$defs/KernelFunctionMetadata" }, "invocation_duration_histogram": { "default": null, "title": "Invocation Duration Histogram" }, "streaming_duration_histogram": { "default": null, "title": "Streaming Duration Histogram" }, "prompt_template": { "$ref": "#/$defs/PromptTemplateBase" }, "prompt_execution_settings": { "additionalProperties": { "$ref": "#/$defs/PromptExecutionSettings" }, "title": "Prompt Execution Settings", "type": "object" } }, "$defs": { "FunctionChoiceBehavior": { "description": "Class that controls function choice behavior.\n\n Attributes:\n enable_kernel_functions: Enable kernel functions.\n max_auto_invoke_attempts: The maximum number of auto invoke attempts.\n filters: Filters for the function choice behavior. Available options are: excluded_plugins,\n included_plugins, excluded_functions, or included_functions.\n type_: The type of function choice behavior.\n\n Properties:\n auto_invoke_kernel_functions: Check if the kernel functions should be auto-invoked.\n Determined as max_auto_invoke_attempts > 0.\n\n Methods:\n configure: Configures the settings for the function call behavior,\n the default version in this class, does nothing, use subclasses for different behaviors.\n\n Class methods:\n Auto: Returns FunctionChoiceBehavior class with auto_invoke enabled, and the desired functions\n based on either the specified filters or the full qualified names. The model will decide which function\n to use, if any.\n NoneInvoke: Returns FunctionChoiceBehavior class with auto_invoke disabled, and the desired functions\n based on either the specified filters or the full qualified names. The model does not invoke any functions,\n but can rather describe how it would invoke a function to complete a given task/query.\n Required: Returns FunctionChoiceBehavior class with auto_invoke enabled, and the desired functions\n based on either the specified filters or the full qualified names. The model is required to use one of the\n provided functions to complete a given task/query.\n \n\nNote: This class is experimental and may change in the future.", "properties": { "enable_kernel_functions": { "default": true, "title": "Enable Kernel Functions", "type": "boolean" }, "maximum_auto_invoke_attempts": { "default": 5, "title": "Maximum Auto Invoke Attempts", "type": "integer" }, "filters": { "anyOf": [ { "additionalProperties": { "items": { "type": "string" }, "type": "array" }, "propertyNames": { "enum": [ "excluded_plugins", "included_plugins", "excluded_functions", "included_functions" ] }, "type": "object" }, { "type": "null" } ], "default": null, "title": "Filters" }, "type_": { "anyOf": [ { "$ref": "#/$defs/FunctionChoiceType" }, { "type": "null" } ], "default": null } }, "title": "FunctionChoiceBehavior", "type": "object" }, "FunctionChoiceType": { "description": "The type of function choice behavior.\n\nNote: This class is experimental and may change in the future.", "enum": [ "auto", "none", "required" ], "title": "FunctionChoiceType", "type": "string" }, "InputVariable": { "description": "Input variable for a prompt template.\n\nArgs:\n name: The name of the input variable.\n description: The description of the input variable.\n default: The default value of the input variable.\n is_required: Whether the input variable is required.\n json_schema: The JSON schema for the input variable.\n allow_dangerously_set_content: Allow content without encoding, this controls\n if this variable is encoded before use, default is False.", "properties": { "name": { "title": "Name", "type": "string" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": "", "title": "Description" }, "default": { "anyOf": [ {}, { "type": "null" } ], "default": "", "title": "Default" }, "is_required": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": true, "title": "Is Required" }, "json_schema": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": "", "title": "Json Schema" }, "allow_dangerously_set_content": { "default": false, "title": "Allow Dangerously Set Content", "type": "boolean" } }, "required": [ "name" ], "title": "InputVariable", "type": "object" }, "KernelFunctionMetadata": { "description": "The kernel function metadata.", "properties": { "name": { "pattern": "^[0-9A-Za-z_]+$", "title": "Name", "type": "string" }, "plugin_name": { "anyOf": [ { "pattern": "^[0-9A-Za-z_]+$", "type": "string" }, { "type": "null" } ], "default": null, "title": "Plugin Name" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "parameters": { "items": { "$ref": "#/$defs/KernelParameterMetadata" }, "title": "Parameters", "type": "array" }, "is_prompt": { "title": "Is Prompt", "type": "boolean" }, "is_asynchronous": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": true, "title": "Is Asynchronous" }, "return_parameter": { "anyOf": [ { "$ref": "#/$defs/KernelParameterMetadata" }, { "type": "null" } ], "default": null }, "additional_properties": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Additional Properties" } }, "required": [ "name", "is_prompt" ], "title": "KernelFunctionMetadata", "type": "object" }, "KernelParameterMetadata": { "description": "The kernel parameter metadata.", "properties": { "name": { "anyOf": [ { "pattern": "^[0-9A-Za-z_]+$", "type": "string" }, { "type": "null" } ], "title": "Name" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "default_value": { "anyOf": [ {}, { "type": "null" } ], "default": null, "title": "Default Value" }, "type": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": "str", "title": "Type" }, "is_required": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": false, "title": "Is Required" }, "type_object": { "anyOf": [ {}, { "type": "null" } ], "default": null, "title": "Type Object" }, "schema_data": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Schema Data" }, "include_in_function_choices": { "default": true, "title": "Include In Function Choices", "type": "boolean" } }, "required": [ "name" ], "title": "KernelParameterMetadata", "type": "object" }, "PromptExecutionSettings": { "description": "Base class for prompt execution settings.\n\nCan be used by itself or as a base class for other prompt execution settings. The methods are used to create\nspecific prompt execution settings objects based on the keys in the extension_data field, this way you can\ncreate a generic PromptExecutionSettings object in your application, which gets mapped into the keys of the\nprompt execution settings that each services returns by using the service.get_prompt_execution_settings() method.\n\nAttributes:\n service_id (str | None): The service ID to use for the request.\n extension_data (Dict[str, Any]): Any additional data to send with the request.\n function_choice_behavior (FunctionChoiceBehavior | None): The function choice behavior settings.\n\nMethods:\n prepare_settings_dict: Prepares the settings as a dictionary for sending to the AI service.\n update_from_prompt_execution_settings: Update the keys from another prompt execution settings object.\n from_prompt_execution_settings: Create a prompt execution settings from another prompt execution settings.", "properties": { "service_id": { "anyOf": [ { "minLength": 1, "type": "string" }, { "type": "null" } ], "default": null, "title": "Service Id" }, "extension_data": { "title": "Extension Data", "type": "object" }, "function_choice_behavior": { "anyOf": [ { "$ref": "#/$defs/FunctionChoiceBehavior" }, { "type": "null" } ], "default": null } }, "title": "PromptExecutionSettings", "type": "object" }, "PromptTemplateBase": { "description": "Base class for prompt templates.", "properties": { "prompt_template_config": { "$ref": "#/$defs/PromptTemplateConfig" }, "allow_dangerously_set_content": { "default": false, "title": "Allow Dangerously Set Content", "type": "boolean" } }, "required": [ "prompt_template_config" ], "title": "PromptTemplateBase", "type": "object" }, "PromptTemplateConfig": { "description": "Configuration for a prompt template.\n\nArgs:\n name: The name of the prompt template.\n description: The description of the prompt template.\n template: The template for the prompt.\n template_format: The format of the template, should be 'semantic-kernel', 'jinja2' or 'handlebars'.\n input_variables: The input variables for the prompt.\n allow_dangerously_set_content (bool = False): Allow content without encoding throughout, this overrides\n the same settings in the prompt template config and input variables.\n This reverts the behavior to unencoded input.\n execution_settings: The execution settings for the prompt.", "properties": { "name": { "default": "", "title": "Name", "type": "string" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": "", "title": "Description" }, "template": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Template" }, "template_format": { "default": "semantic-kernel", "enum": [ "semantic-kernel", "handlebars", "jinja2" ], "title": "Template Format", "type": "string" }, "input_variables": { "items": { "$ref": "#/$defs/InputVariable" }, "title": "Input Variables", "type": "array" }, "allow_dangerously_set_content": { "default": false, "title": "Allow Dangerously Set Content", "type": "boolean" }, "execution_settings": { "additionalProperties": { "$ref": "#/$defs/PromptExecutionSettings" }, "title": "Execution Settings", "type": "object" } }, "title": "PromptTemplateConfig", "type": "object" } }, "required": [ "metadata", "prompt_template" ] }

autogen_ext.tools.mcp

autogen_ext.agents.video_surfer.tools

**Examples:**

Example 1 (json):
```json
{
   "title": "KernelFunctionFromTool",
   "type": "object",
   "properties": {
      "metadata": {
         "$ref": "#/$defs/KernelFunctionMetadata"
      },
      "invocation_duration_histogram": {
         "default": null,
         "title": "Invocation Duration Histogram"
      },
      "streaming_duration_histogram": {
         "default": null,
         "title": "Streaming Duration Histogram"
      },
      "method": {
         "default": null,
         "title": "Method"
      },
      "stream_method": {
         "default": null,
         "title": "Stream Method"
      }
   },
   "$defs": {
      "KernelFunctionMetadata": {
         "description": "The kernel function metadata.",
         "properties": {
            "name": {
               "pattern": "^[0-9A-Za-z_]+$",
               "title": "Name",
               "type": "string"
            },
            "plugin_name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Plugin Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "parameters": {
               "items": {
                  "$ref": "#/$defs/KernelParameterMetadata"
               },
               "title": "Parameters",
               "type": "array"
            },
            "is_prompt": {
               "title": "Is Prompt",
               "type": "boolean"
            },
            "is_asynchronous": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": true,
               "title": "Is Asynchronous"
            },
            "return_parameter": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/KernelParameterMetadata"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            },
            "additional_properties": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Additional Properties"
            }
         },
         "required": [
            "name",
            "is_prompt"
         ],
         "title": "KernelFunctionMetadata",
         "type": "object"
      },
      "KernelParameterMetadata": {
         "description": "The kernel parameter metadata.",
         "properties": {
            "name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "default_value": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Default Value"
            },
            "type": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "str",
               "title": "Type"
            },
            "is_required": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": false,
               "title": "Is Required"
            },
            "type_object": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Type Object"
            },
            "schema_data": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Schema Data"
            },
            "include_in_function_choices": {
               "default": true,
               "title": "Include In Function Choices",
               "type": "boolean"
            }
         },
         "required": [
            "name"
         ],
         "title": "KernelParameterMetadata",
         "type": "object"
      }
   },
   "required": [
      "metadata"
   ]
}
```

Example 2 (json):
```json
{
   "title": "KernelFunctionFromTool",
   "type": "object",
   "properties": {
      "metadata": {
         "$ref": "#/$defs/KernelFunctionMetadata"
      },
      "invocation_duration_histogram": {
         "default": null,
         "title": "Invocation Duration Histogram"
      },
      "streaming_duration_histogram": {
         "default": null,
         "title": "Streaming Duration Histogram"
      },
      "method": {
         "default": null,
         "title": "Method"
      },
      "stream_method": {
         "default": null,
         "title": "Stream Method"
      }
   },
   "$defs": {
      "KernelFunctionMetadata": {
         "description": "The kernel function metadata.",
         "properties": {
            "name": {
               "pattern": "^[0-9A-Za-z_]+$",
               "title": "Name",
               "type": "string"
            },
            "plugin_name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Plugin Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "parameters": {
               "items": {
                  "$ref": "#/$defs/KernelParameterMetadata"
               },
               "title": "Parameters",
               "type": "array"
            },
            "is_prompt": {
               "title": "Is Prompt",
               "type": "boolean"
            },
            "is_asynchronous": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": true,
               "title": "Is Asynchronous"
            },
            "return_parameter": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/KernelParameterMetadata"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            },
            "additional_properties": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Additional Properties"
            }
         },
         "required": [
            "name",
            "is_prompt"
         ],
         "title": "KernelFunctionMetadata",
         "type": "object"
      },
      "KernelParameterMetadata": {
         "description": "The kernel parameter metadata.",
         "properties": {
            "name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "default_value": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Default Value"
            },
            "type": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "str",
               "title": "Type"
            },
            "is_required": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": false,
               "title": "Is Required"
            },
            "type_object": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Type Object"
            },
            "schema_data": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Schema Data"
            },
            "include_in_function_choices": {
               "default": true,
               "title": "Include In Function Choices",
               "type": "boolean"
            }
         },
         "required": [
            "name"
         ],
         "title": "KernelParameterMetadata",
         "type": "object"
      }
   },
   "required": [
      "metadata"
   ]
}
```

Example 3 (json):
```json
{
   "title": "KernelFunctionFromToolSchema",
   "type": "object",
   "properties": {
      "metadata": {
         "$ref": "#/$defs/KernelFunctionMetadata"
      },
      "invocation_duration_histogram": {
         "default": null,
         "title": "Invocation Duration Histogram"
      },
      "streaming_duration_histogram": {
         "default": null,
         "title": "Streaming Duration Histogram"
      },
      "prompt_template": {
         "$ref": "#/$defs/PromptTemplateBase"
      },
      "prompt_execution_settings": {
         "additionalProperties": {
            "$ref": "#/$defs/PromptExecutionSettings"
         },
         "title": "Prompt Execution Settings",
         "type": "object"
      }
   },
   "$defs": {
      "FunctionChoiceBehavior": {
         "description": "Class that controls function choice behavior.\n\n    Attributes:\n        enable_kernel_functions: Enable kernel functions.\n        max_auto_invoke_attempts: The maximum number of auto invoke attempts.\n        filters: Filters for the function choice behavior. Available options are: excluded_plugins,\n            included_plugins, excluded_functions, or included_functions.\n        type_: The type of function choice behavior.\n\n    Properties:\n        auto_invoke_kernel_functions: Check if the kernel functions should be auto-invoked.\n            Determined as max_auto_invoke_attempts > 0.\n\n    Methods:\n        configure: Configures the settings for the function call behavior,\n            the default version in this class, does nothing, use subclasses for different behaviors.\n\n    Class methods:\n        Auto: Returns FunctionChoiceBehavior class with auto_invoke enabled, and the desired functions\n            based on either the specified filters or the full qualified names. The model will decide which function\n            to use, if any.\n        NoneInvoke: Returns FunctionChoiceBehavior class with auto_invoke disabled, and the desired functions\n            based on either the specified filters or the full qualified names. The model does not invoke any functions,\n            but can rather describe how it would invoke a function to complete a given task/query.\n        Required: Returns FunctionChoiceBehavior class with auto_invoke enabled, and the desired functions\n            based on either the specified filters or the full qualified names. The model is required to use one of the\n            provided functions to complete a given task/query.\n    \n\nNote: This class is experimental and may change in the future.",
         "properties": {
            "enable_kernel_functions": {
               "default": true,
               "title": "Enable Kernel Functions",
               "type": "boolean"
            },
            "maximum_auto_invoke_attempts": {
               "default": 5,
               "title": "Maximum Auto Invoke Attempts",
               "type": "integer"
            },
            "filters": {
               "anyOf": [
                  {
                     "additionalProperties": {
                        "items": {
                           "type": "string"
                        },
                        "type": "array"
                     },
                     "propertyNames": {
                        "enum": [
                           "excluded_plugins",
                           "included_plugins",
                           "excluded_functions",
                           "included_functions"
                        ]
                     },
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Filters"
            },
            "type_": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/FunctionChoiceType"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            }
         },
         "title": "FunctionChoiceBehavior",
         "type": "object"
      },
      "FunctionChoiceType": {
         "description": "The type of function choice behavior.\n\nNote: This class is experimental and may change in the future.",
         "enum": [
            "auto",
            "none",
            "required"
         ],
         "title": "FunctionChoiceType",
         "type": "string"
      },
      "InputVariable": {
         "description": "Input variable for a prompt template.\n\nArgs:\n    name: The name of the input variable.\n    description: The description of the input variable.\n    default: The default value of the input variable.\n    is_required: Whether the input variable is required.\n    json_schema: The JSON schema for the input variable.\n    allow_dangerously_set_content: Allow content without encoding, this controls\n        if this variable is encoded before use, default is False.",
         "properties": {
            "name": {
               "title": "Name",
               "type": "string"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Description"
            },
            "default": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Default"
            },
            "is_required": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": true,
               "title": "Is Required"
            },
            "json_schema": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Json Schema"
            },
            "allow_dangerously_set_content": {
               "default": false,
               "title": "Allow Dangerously Set Content",
               "type": "boolean"
            }
         },
         "required": [
            "name"
         ],
         "title": "InputVariable",
         "type": "object"
      },
      "KernelFunctionMetadata": {
         "description": "The kernel function metadata.",
         "properties": {
            "name": {
               "pattern": "^[0-9A-Za-z_]+$",
               "title": "Name",
               "type": "string"
            },
            "plugin_name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Plugin Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "parameters": {
               "items": {
                  "$ref": "#/$defs/KernelParameterMetadata"
               },
               "title": "Parameters",
               "type": "array"
            },
            "is_prompt": {
               "title": "Is Prompt",
               "type": "boolean"
            },
            "is_asynchronous": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": true,
               "title": "Is Asynchronous"
            },
            "return_parameter": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/KernelParameterMetadata"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            },
            "additional_properties": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Additional Properties"
            }
         },
         "required": [
            "name",
            "is_prompt"
         ],
         "title": "KernelFunctionMetadata",
         "type": "object"
      },
      "KernelParameterMetadata": {
         "description": "The kernel parameter metadata.",
         "properties": {
            "name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "default_value": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Default Value"
            },
            "type": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "str",
               "title": "Type"
            },
            "is_required": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": false,
               "title": "Is Required"
            },
            "type_object": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Type Object"
            },
            "schema_data": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Schema Data"
            },
            "include_in_function_choices": {
               "default": true,
               "title": "Include In Function Choices",
               "type": "boolean"
            }
         },
         "required": [
            "name"
         ],
         "title": "KernelParameterMetadata",
         "type": "object"
      },
      "PromptExecutionSettings": {
         "description": "Base class for prompt execution settings.\n\nCan be used by itself or as a base class for other prompt execution settings. The methods are used to create\nspecific prompt execution settings objects based on the keys in the extension_data field, this way you can\ncreate a generic PromptExecutionSettings object in your application, which gets mapped into the keys of the\nprompt execution settings that each services returns by using the service.get_prompt_execution_settings() method.\n\nAttributes:\n    service_id (str | None): The service ID to use for the request.\n    extension_data (Dict[str, Any]): Any additional data to send with the request.\n    function_choice_behavior (FunctionChoiceBehavior | None): The function choice behavior settings.\n\nMethods:\n    prepare_settings_dict: Prepares the settings as a dictionary for sending to the AI service.\n    update_from_prompt_execution_settings: Update the keys from another prompt execution settings object.\n    from_prompt_execution_settings: Create a prompt execution settings from another prompt execution settings.",
         "properties": {
            "service_id": {
               "anyOf": [
                  {
                     "minLength": 1,
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Service Id"
            },
            "extension_data": {
               "title": "Extension Data",
               "type": "object"
            },
            "function_choice_behavior": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/FunctionChoiceBehavior"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            }
         },
         "title": "PromptExecutionSettings",
         "type": "object"
      },
      "PromptTemplateBase": {
         "description": "Base class for prompt templates.",
         "properties": {
            "prompt_template_config": {
               "$ref": "#/$defs/PromptTemplateConfig"
            },
            "allow_dangerously_set_content": {
               "default": false,
               "title": "Allow Dangerously Set Content",
               "type": "boolean"
            }
         },
         "required": [
            "prompt_template_config"
         ],
         "title": "PromptTemplateBase",
         "type": "object"
      },
      "PromptTemplateConfig": {
         "description": "Configuration for a prompt template.\n\nArgs:\n    name: The name of the prompt template.\n    description: The description of the prompt template.\n    template: The template for the prompt.\n    template_format: The format of the template, should be 'semantic-kernel', 'jinja2' or 'handlebars'.\n    input_variables: The input variables for the prompt.\n    allow_dangerously_set_content (bool = False): Allow content without encoding throughout, this overrides\n        the same settings in the prompt template config and input variables.\n        This reverts the behavior to unencoded input.\n    execution_settings: The execution settings for the prompt.",
         "properties": {
            "name": {
               "default": "",
               "title": "Name",
               "type": "string"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Description"
            },
            "template": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Template"
            },
            "template_format": {
               "default": "semantic-kernel",
               "enum": [
                  "semantic-kernel",
                  "handlebars",
                  "jinja2"
               ],
               "title": "Template Format",
               "type": "string"
            },
            "input_variables": {
               "items": {
                  "$ref": "#/$defs/InputVariable"
               },
               "title": "Input Variables",
               "type": "array"
            },
            "allow_dangerously_set_content": {
               "default": false,
               "title": "Allow Dangerously Set Content",
               "type": "boolean"
            },
            "execution_settings": {
               "additionalProperties": {
                  "$ref": "#/$defs/PromptExecutionSettings"
               },
               "title": "Execution Settings",
               "type": "object"
            }
         },
         "title": "PromptTemplateConfig",
         "type": "object"
      }
   },
   "required": [
      "metadata",
      "prompt_template"
   ]
}
```

Example 4 (json):
```json
{
   "title": "KernelFunctionFromToolSchema",
   "type": "object",
   "properties": {
      "metadata": {
         "$ref": "#/$defs/KernelFunctionMetadata"
      },
      "invocation_duration_histogram": {
         "default": null,
         "title": "Invocation Duration Histogram"
      },
      "streaming_duration_histogram": {
         "default": null,
         "title": "Streaming Duration Histogram"
      },
      "prompt_template": {
         "$ref": "#/$defs/PromptTemplateBase"
      },
      "prompt_execution_settings": {
         "additionalProperties": {
            "$ref": "#/$defs/PromptExecutionSettings"
         },
         "title": "Prompt Execution Settings",
         "type": "object"
      }
   },
   "$defs": {
      "FunctionChoiceBehavior": {
         "description": "Class that controls function choice behavior.\n\n    Attributes:\n        enable_kernel_functions: Enable kernel functions.\n        max_auto_invoke_attempts: The maximum number of auto invoke attempts.\n        filters: Filters for the function choice behavior. Available options are: excluded_plugins,\n            included_plugins, excluded_functions, or included_functions.\n        type_: The type of function choice behavior.\n\n    Properties:\n        auto_invoke_kernel_functions: Check if the kernel functions should be auto-invoked.\n            Determined as max_auto_invoke_attempts > 0.\n\n    Methods:\n        configure: Configures the settings for the function call behavior,\n            the default version in this class, does nothing, use subclasses for different behaviors.\n\n    Class methods:\n        Auto: Returns FunctionChoiceBehavior class with auto_invoke enabled, and the desired functions\n            based on either the specified filters or the full qualified names. The model will decide which function\n            to use, if any.\n        NoneInvoke: Returns FunctionChoiceBehavior class with auto_invoke disabled, and the desired functions\n            based on either the specified filters or the full qualified names. The model does not invoke any functions,\n            but can rather describe how it would invoke a function to complete a given task/query.\n        Required: Returns FunctionChoiceBehavior class with auto_invoke enabled, and the desired functions\n            based on either the specified filters or the full qualified names. The model is required to use one of the\n            provided functions to complete a given task/query.\n    \n\nNote: This class is experimental and may change in the future.",
         "properties": {
            "enable_kernel_functions": {
               "default": true,
               "title": "Enable Kernel Functions",
               "type": "boolean"
            },
            "maximum_auto_invoke_attempts": {
               "default": 5,
               "title": "Maximum Auto Invoke Attempts",
               "type": "integer"
            },
            "filters": {
               "anyOf": [
                  {
                     "additionalProperties": {
                        "items": {
                           "type": "string"
                        },
                        "type": "array"
                     },
                     "propertyNames": {
                        "enum": [
                           "excluded_plugins",
                           "included_plugins",
                           "excluded_functions",
                           "included_functions"
                        ]
                     },
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Filters"
            },
            "type_": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/FunctionChoiceType"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            }
         },
         "title": "FunctionChoiceBehavior",
         "type": "object"
      },
      "FunctionChoiceType": {
         "description": "The type of function choice behavior.\n\nNote: This class is experimental and may change in the future.",
         "enum": [
            "auto",
            "none",
            "required"
         ],
         "title": "FunctionChoiceType",
         "type": "string"
      },
      "InputVariable": {
         "description": "Input variable for a prompt template.\n\nArgs:\n    name: The name of the input variable.\n    description: The description of the input variable.\n    default: The default value of the input variable.\n    is_required: Whether the input variable is required.\n    json_schema: The JSON schema for the input variable.\n    allow_dangerously_set_content: Allow content without encoding, this controls\n        if this variable is encoded before use, default is False.",
         "properties": {
            "name": {
               "title": "Name",
               "type": "string"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Description"
            },
            "default": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Default"
            },
            "is_required": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": true,
               "title": "Is Required"
            },
            "json_schema": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Json Schema"
            },
            "allow_dangerously_set_content": {
               "default": false,
               "title": "Allow Dangerously Set Content",
               "type": "boolean"
            }
         },
         "required": [
            "name"
         ],
         "title": "InputVariable",
         "type": "object"
      },
      "KernelFunctionMetadata": {
         "description": "The kernel function metadata.",
         "properties": {
            "name": {
               "pattern": "^[0-9A-Za-z_]+$",
               "title": "Name",
               "type": "string"
            },
            "plugin_name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Plugin Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "parameters": {
               "items": {
                  "$ref": "#/$defs/KernelParameterMetadata"
               },
               "title": "Parameters",
               "type": "array"
            },
            "is_prompt": {
               "title": "Is Prompt",
               "type": "boolean"
            },
            "is_asynchronous": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": true,
               "title": "Is Asynchronous"
            },
            "return_parameter": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/KernelParameterMetadata"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            },
            "additional_properties": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Additional Properties"
            }
         },
         "required": [
            "name",
            "is_prompt"
         ],
         "title": "KernelFunctionMetadata",
         "type": "object"
      },
      "KernelParameterMetadata": {
         "description": "The kernel parameter metadata.",
         "properties": {
            "name": {
               "anyOf": [
                  {
                     "pattern": "^[0-9A-Za-z_]+$",
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "title": "Name"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Description"
            },
            "default_value": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Default Value"
            },
            "type": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "str",
               "title": "Type"
            },
            "is_required": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": false,
               "title": "Is Required"
            },
            "type_object": {
               "anyOf": [
                  {},
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Type Object"
            },
            "schema_data": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Schema Data"
            },
            "include_in_function_choices": {
               "default": true,
               "title": "Include In Function Choices",
               "type": "boolean"
            }
         },
         "required": [
            "name"
         ],
         "title": "KernelParameterMetadata",
         "type": "object"
      },
      "PromptExecutionSettings": {
         "description": "Base class for prompt execution settings.\n\nCan be used by itself or as a base class for other prompt execution settings. The methods are used to create\nspecific prompt execution settings objects based on the keys in the extension_data field, this way you can\ncreate a generic PromptExecutionSettings object in your application, which gets mapped into the keys of the\nprompt execution settings that each services returns by using the service.get_prompt_execution_settings() method.\n\nAttributes:\n    service_id (str | None): The service ID to use for the request.\n    extension_data (Dict[str, Any]): Any additional data to send with the request.\n    function_choice_behavior (FunctionChoiceBehavior | None): The function choice behavior settings.\n\nMethods:\n    prepare_settings_dict: Prepares the settings as a dictionary for sending to the AI service.\n    update_from_prompt_execution_settings: Update the keys from another prompt execution settings object.\n    from_prompt_execution_settings: Create a prompt execution settings from another prompt execution settings.",
         "properties": {
            "service_id": {
               "anyOf": [
                  {
                     "minLength": 1,
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Service Id"
            },
            "extension_data": {
               "title": "Extension Data",
               "type": "object"
            },
            "function_choice_behavior": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/FunctionChoiceBehavior"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null
            }
         },
         "title": "PromptExecutionSettings",
         "type": "object"
      },
      "PromptTemplateBase": {
         "description": "Base class for prompt templates.",
         "properties": {
            "prompt_template_config": {
               "$ref": "#/$defs/PromptTemplateConfig"
            },
            "allow_dangerously_set_content": {
               "default": false,
               "title": "Allow Dangerously Set Content",
               "type": "boolean"
            }
         },
         "required": [
            "prompt_template_config"
         ],
         "title": "PromptTemplateBase",
         "type": "object"
      },
      "PromptTemplateConfig": {
         "description": "Configuration for a prompt template.\n\nArgs:\n    name: The name of the prompt template.\n    description: The description of the prompt template.\n    template: The template for the prompt.\n    template_format: The format of the template, should be 'semantic-kernel', 'jinja2' or 'handlebars'.\n    input_variables: The input variables for the prompt.\n    allow_dangerously_set_content (bool = False): Allow content without encoding throughout, this overrides\n        the same settings in the prompt template config and input variables.\n        This reverts the behavior to unencoded input.\n    execution_settings: The execution settings for the prompt.",
         "properties": {
            "name": {
               "default": "",
               "title": "Name",
               "type": "string"
            },
            "description": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": "",
               "title": "Description"
            },
            "template": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Template"
            },
            "template_format": {
               "default": "semantic-kernel",
               "enum": [
                  "semantic-kernel",
                  "handlebars",
                  "jinja2"
               ],
               "title": "Template Format",
               "type": "string"
            },
            "input_variables": {
               "items": {
                  "$ref": "#/$defs/InputVariable"
               },
               "title": "Input Variables",
               "type": "array"
            },
            "allow_dangerously_set_content": {
               "default": false,
               "title": "Allow Dangerously Set Content",
               "type": "boolean"
            },
            "execution_settings": {
               "additionalProperties": {
                  "$ref": "#/$defs/PromptExecutionSettings"
               },
               "title": "Execution Settings",
               "type": "object"
            }
         },
         "title": "PromptTemplateConfig",
         "type": "object"
      }
   },
   "required": [
      "metadata",
      "prompt_template"
   ]
}
```

---

## Workbench (and MCP) — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/components/workbench.html

**Contents:**
- Workbench (and MCP)#
- Using Workbench#
- MCP Workbench#
- Web Browsing Agent using Playwright MCP#

A Workbench provides a collection of tools that share state and resources. Different from Tool, which provides an interface to a single tool, a workbench provides an interface to call different tools and receive results as the same types.

Here is an example of how to create an agent using Workbench.

In this example, the agent calls the tools provided by the workbench in a loop until the model returns a final answer.

Model Context Protocol (MCP) is a protocol for providing tools and resources to language models. An MCP server hosts a set of tools and manages their state, while an MCP client operates from the side of the language model and communicates with the server to access the tools, and to provide the language model with the context it needs to use the tools effectively.

In AutoGen, we provide McpWorkbench that implements an MCP client. You can use it to create an agent that uses tools provided by MCP servers.

Here is an example of how we can use the Playwright MCP server and the WorkbenchAgent class to create a web browsing agent.

You may need to install the browser dependencies for Playwright.

Start the Playwright MCP server in a terminal.

Then, create the agent using the WorkbenchAgent class and McpWorkbench with the Playwright MCP server URL.

Command Line Code Executors

**Examples:**

Example 1 (python):
```python
import json
from dataclasses import dataclass
from typing import List

from autogen_core import (
    FunctionCall,
    MessageContext,
    RoutedAgent,
    message_handler,
)
from autogen_core.model_context import ChatCompletionContext
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    FunctionExecutionResult,
    FunctionExecutionResultMessage,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import ToolResult, Workbench
```

Example 2 (python):
```python
import json
from dataclasses import dataclass
from typing import List

from autogen_core import (
    FunctionCall,
    MessageContext,
    RoutedAgent,
    message_handler,
)
from autogen_core.model_context import ChatCompletionContext
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    FunctionExecutionResult,
    FunctionExecutionResultMessage,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import ToolResult, Workbench
```

Example 3 (python):
```python
@dataclass
class Message:
    content: str


class WorkbenchAgent(RoutedAgent):
    def __init__(
        self, model_client: ChatCompletionClient, model_context: ChatCompletionContext, workbench: Workbench
    ) -> None:
        super().__init__("An agent with a workbench")
        self._system_messages: List[LLMMessage] = [SystemMessage(content="You are a helpful AI assistant.")]
        self._model_client = model_client
        self._model_context = model_context
        self._workbench = workbench

    @message_handler
    async def handle_user_message(self, message: Message, ctx: MessageContext) -> Message:
        # Add the user message to the model context.
        await self._model_context.add_message(UserMessage(content=message.content, source="user"))
        print("---------User Message-----------")
        print(message.content)

        # Run the chat completion with the tools.
        create_result = await self._model_client.create(
            messages=self._system_messages + (await self._model_context.get_messages()),
            tools=(await self._workbench.list_tools()),
            cancellation_token=ctx.cancellation_token,
        )

        # Run tool call loop.
        while isinstance(create_result.content, list) and all(
            isinstance(call, FunctionCall) for call in create_result.content
        ):
            print("---------Function Calls-----------")
            for call in create_result.content:
                print(call)

            # Add the function calls to the model context.
            await self._model_context.add_message(AssistantMessage(content=create_result.content, source="assistant"))

            # Call the tools using the workbench.
            print("---------Function Call Results-----------")
            results: List[ToolResult] = []
            for call in create_result.content:
                result = await self._workbench.call_tool(
                    call.name, arguments=json.loads(call.arguments), cancellation_token=ctx.cancellation_token
                )
                results.append(result)
                print(result)

            # Add the function execution results to the model context.
            await self._model_context.add_message(
                FunctionExecutionResultMessage(
                    content=[
                        FunctionExecutionResult(
                            call_id=call.id,
                            content=result.to_text(),
                            is_error=result.is_error,
                            name=result.name,
                        )
                        for call, result in zip(create_result.content, results, strict=False)
                    ]
                )
            )

            # Run the chat completion again to reflect on the history and function execution results.
            create_result = await self._model_client.create(
                messages=self._system_messages + (await self._model_context.get_messages()),
                tools=(await self._workbench.list_tools()),
                cancellation_token=ctx.cancellation_token,
            )

        # Now we have a single message as the result.
        assert isinstance(create_result.content, str)

        print("---------Final Response-----------")
        print(create_result.content)

        # Add the assistant message to the model context.
        await self._model_context.add_message(AssistantMessage(content=create_result.content, source="assistant"))

        # Return the result as a message.
        return Message(content=create_result.content)
```

Example 4 (python):
```python
@dataclass
class Message:
    content: str


class WorkbenchAgent(RoutedAgent):
    def __init__(
        self, model_client: ChatCompletionClient, model_context: ChatCompletionContext, workbench: Workbench
    ) -> None:
        super().__init__("An agent with a workbench")
        self._system_messages: List[LLMMessage] = [SystemMessage(content="You are a helpful AI assistant.")]
        self._model_client = model_client
        self._model_context = model_context
        self._workbench = workbench

    @message_handler
    async def handle_user_message(self, message: Message, ctx: MessageContext) -> Message:
        # Add the user message to the model context.
        await self._model_context.add_message(UserMessage(content=message.content, source="user"))
        print("---------User Message-----------")
        print(message.content)

        # Run the chat completion with the tools.
        create_result = await self._model_client.create(
            messages=self._system_messages + (await self._model_context.get_messages()),
            tools=(await self._workbench.list_tools()),
            cancellation_token=ctx.cancellation_token,
        )

        # Run tool call loop.
        while isinstance(create_result.content, list) and all(
            isinstance(call, FunctionCall) for call in create_result.content
        ):
            print("---------Function Calls-----------")
            for call in create_result.content:
                print(call)

            # Add the function calls to the model context.
            await self._model_context.add_message(AssistantMessage(content=create_result.content, source="assistant"))

            # Call the tools using the workbench.
            print("---------Function Call Results-----------")
            results: List[ToolResult] = []
            for call in create_result.content:
                result = await self._workbench.call_tool(
                    call.name, arguments=json.loads(call.arguments), cancellation_token=ctx.cancellation_token
                )
                results.append(result)
                print(result)

            # Add the function execution results to the model context.
            await self._model_context.add_message(
                FunctionExecutionResultMessage(
                    content=[
                        FunctionExecutionResult(
                            call_id=call.id,
                            content=result.to_text(),
                            is_error=result.is_error,
                            name=result.name,
                        )
                        for call, result in zip(create_result.content, results, strict=False)
                    ]
                )
            )

            # Run the chat completion again to reflect on the history and function execution results.
            create_result = await self._model_client.create(
                messages=self._system_messages + (await self._model_context.get_messages()),
                tools=(await self._workbench.list_tools()),
                cancellation_token=ctx.cancellation_token,
            )

        # Now we have a single message as the result.
        assert isinstance(create_result.content, str)

        print("---------Final Response-----------")
        print(create_result.content)

        # Add the assistant message to the model context.
        await self._model_context.add_message(AssistantMessage(content=create_result.content, source="assistant"))

        # Return the result as a message.
        return Message(content=create_result.content)
```

---
