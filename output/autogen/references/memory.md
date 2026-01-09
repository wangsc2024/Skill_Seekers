# Autogen - Memory

**Pages:** 7

---

## autogen_core.memory — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.memory.html

**Contents:**
- autogen_core.memory#

Bases: ABC, ComponentBase[BaseModel]

Protocol defining the interface for memory implementations.

A memory is the storage for data that can be used to enrich or modify the model context.

A memory implementation can use any storage mechanism, such as a list, a database, or a file system. It can also use any retrieval mechanism, such as vector search or text search. It is up to the implementation to decide how to store and retrieve data.

It is also a memory implementation’s responsibility to update the model context with relevant memory content based on the current model context and querying the memory store.

See ListMemory for an example implementation.

The logical type of the component.

Update the provided model context using relevant memory content.

model_context – The context to update.

UpdateContextResult containing relevant memories

Query the memory store and return relevant entries.

query – Query content item

cancellation_token – Optional token to cancel operation

**kwargs – Additional implementation-specific parameters

MemoryQueryResult containing memory entries with relevance scores

Add a new content to memory.

content – The memory content to add

cancellation_token – Optional token to cancel operation

Clear all entries from memory.

Clean up any resources used by the memory implementation.

A memory content item.

Show JSON schema{ "title": "MemoryContent", "description": "A memory content item.", "type": "object", "properties": { "content": { "anyOf": [ { "type": "string" }, { "format": "binary", "type": "string" }, { "type": "object" }, {} ], "title": "Content" }, "mime_type": { "anyOf": [ { "$ref": "#/$defs/MemoryMimeType" }, { "type": "string" } ], "title": "Mime Type" }, "metadata": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" } }, "$defs": { "MemoryMimeType": { "description": "Supported MIME types for memory content.", "enum": [ "text/plain", "application/json", "text/markdown", "image/*", "application/octet-stream" ], "title": "MemoryMimeType", "type": "string" } }, "required": [ "content", "mime_type" ] }

content (str | bytes | Dict[str, Any] | autogen_core._image.Image)

metadata (Dict[str, Any] | None)

mime_type (autogen_core.memory._base_memory.MemoryMimeType | str)

The content of the memory item. It can be a string, bytes, dict, or Image.

The MIME type of the memory content.

Metadata associated with the memory item.

Serialize the MIME type to a string.

Result of a memory query() operation.

Show JSON schema{ "title": "MemoryQueryResult", "description": "Result of a memory :meth:`~autogen_core.memory.Memory.query` operation.", "type": "object", "properties": { "results": { "items": { "$ref": "#/$defs/MemoryContent" }, "title": "Results", "type": "array" } }, "$defs": { "MemoryContent": { "description": "A memory content item.", "properties": { "content": { "anyOf": [ { "type": "string" }, { "format": "binary", "type": "string" }, { "type": "object" }, {} ], "title": "Content" }, "mime_type": { "anyOf": [ { "$ref": "#/$defs/MemoryMimeType" }, { "type": "string" } ], "title": "Mime Type" }, "metadata": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" } }, "required": [ "content", "mime_type" ], "title": "MemoryContent", "type": "object" }, "MemoryMimeType": { "description": "Supported MIME types for memory content.", "enum": [ "text/plain", "application/json", "text/markdown", "image/*", "application/octet-stream" ], "title": "MemoryMimeType", "type": "string" } }, "required": [ "results" ] }

results (List[autogen_core.memory._base_memory.MemoryContent])

Result of a memory update_context() operation.

Show JSON schema{ "title": "UpdateContextResult", "description": "Result of a memory :meth:`~autogen_core.memory.Memory.update_context` operation.", "type": "object", "properties": { "memories": { "$ref": "#/$defs/MemoryQueryResult" } }, "$defs": { "MemoryContent": { "description": "A memory content item.", "properties": { "content": { "anyOf": [ { "type": "string" }, { "format": "binary", "type": "string" }, { "type": "object" }, {} ], "title": "Content" }, "mime_type": { "anyOf": [ { "$ref": "#/$defs/MemoryMimeType" }, { "type": "string" } ], "title": "Mime Type" }, "metadata": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "title": "Metadata" } }, "required": [ "content", "mime_type" ], "title": "MemoryContent", "type": "object" }, "MemoryMimeType": { "description": "Supported MIME types for memory content.", "enum": [ "text/plain", "application/json", "text/markdown", "image/*", "application/octet-stream" ], "title": "MemoryMimeType", "type": "string" }, "MemoryQueryResult": { "description": "Result of a memory :meth:`~autogen_core.memory.Memory.query` operation.", "properties": { "results": { "items": { "$ref": "#/$defs/MemoryContent" }, "title": "Results", "type": "array" } }, "required": [ "results" ], "title": "MemoryQueryResult", "type": "object" } }, "required": [ "memories" ] }

memories (autogen_core.memory._base_memory.MemoryQueryResult)

Supported MIME types for memory content.

Bases: Memory, Component[ListMemoryConfig]

Simple chronological list-based memory implementation.

This memory implementation stores contents in a list and retrieves them in chronological order. It has an update_context method that updates model contexts by appending all stored memories.

The memory content can be directly accessed and modified through the content property, allowing external applications to manage memory contents directly.

name – Optional identifier for this memory instance

The logical type of the component.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of ListMemoryConfig

Get the memory instance identifier.

str – Memory instance name

Get the current memory contents.

List[MemoryContent] – List of stored memory contents

Update the model context by appending memory content.

This method mutates the provided model_context by adding all memories as a SystemMessage.

model_context – The context to update. Will be mutated if memories exist.

UpdateContextResult containing the memories that were added to the context

Return all memories without any filtering.

query – Ignored in this implementation

cancellation_token – Optional token to cancel operation

**kwargs – Additional parameters (ignored)

MemoryQueryResult containing all stored memories

Add new content to memory.

content – Memory content to store

cancellation_token – Optional token to cancel operation

Clear all memory content.

Cleanup resources if needed.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

autogen_core.model_context

**Examples:**

Example 1 (json):
```json
{
   "title": "MemoryContent",
   "description": "A memory content item.",
   "type": "object",
   "properties": {
      "content": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "format": "binary",
               "type": "string"
            },
            {
               "type": "object"
            },
            {}
         ],
         "title": "Content"
      },
      "mime_type": {
         "anyOf": [
            {
               "$ref": "#/$defs/MemoryMimeType"
            },
            {
               "type": "string"
            }
         ],
         "title": "Mime Type"
      },
      "metadata": {
         "anyOf": [
            {
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Metadata"
      }
   },
   "$defs": {
      "MemoryMimeType": {
         "description": "Supported MIME types for memory content.",
         "enum": [
            "text/plain",
            "application/json",
            "text/markdown",
            "image/*",
            "application/octet-stream"
         ],
         "title": "MemoryMimeType",
         "type": "string"
      }
   },
   "required": [
      "content",
      "mime_type"
   ]
}
```

Example 2 (json):
```json
{
   "title": "MemoryContent",
   "description": "A memory content item.",
   "type": "object",
   "properties": {
      "content": {
         "anyOf": [
            {
               "type": "string"
            },
            {
               "format": "binary",
               "type": "string"
            },
            {
               "type": "object"
            },
            {}
         ],
         "title": "Content"
      },
      "mime_type": {
         "anyOf": [
            {
               "$ref": "#/$defs/MemoryMimeType"
            },
            {
               "type": "string"
            }
         ],
         "title": "Mime Type"
      },
      "metadata": {
         "anyOf": [
            {
               "type": "object"
            },
            {
               "type": "null"
            }
         ],
         "default": null,
         "title": "Metadata"
      }
   },
   "$defs": {
      "MemoryMimeType": {
         "description": "Supported MIME types for memory content.",
         "enum": [
            "text/plain",
            "application/json",
            "text/markdown",
            "image/*",
            "application/octet-stream"
         ],
         "title": "MemoryMimeType",
         "type": "string"
      }
   },
   "required": [
      "content",
      "mime_type"
   ]
}
```

Example 3 (json):
```json
{
   "title": "MemoryQueryResult",
   "description": "Result of a memory :meth:`~autogen_core.memory.Memory.query` operation.",
   "type": "object",
   "properties": {
      "results": {
         "items": {
            "$ref": "#/$defs/MemoryContent"
         },
         "title": "Results",
         "type": "array"
      }
   },
   "$defs": {
      "MemoryContent": {
         "description": "A memory content item.",
         "properties": {
            "content": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "format": "binary",
                     "type": "string"
                  },
                  {
                     "type": "object"
                  },
                  {}
               ],
               "title": "Content"
            },
            "mime_type": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/MemoryMimeType"
                  },
                  {
                     "type": "string"
                  }
               ],
               "title": "Mime Type"
            },
            "metadata": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Metadata"
            }
         },
         "required": [
            "content",
            "mime_type"
         ],
         "title": "MemoryContent",
         "type": "object"
      },
      "MemoryMimeType": {
         "description": "Supported MIME types for memory content.",
         "enum": [
            "text/plain",
            "application/json",
            "text/markdown",
            "image/*",
            "application/octet-stream"
         ],
         "title": "MemoryMimeType",
         "type": "string"
      }
   },
   "required": [
      "results"
   ]
}
```

Example 4 (json):
```json
{
   "title": "MemoryQueryResult",
   "description": "Result of a memory :meth:`~autogen_core.memory.Memory.query` operation.",
   "type": "object",
   "properties": {
      "results": {
         "items": {
            "$ref": "#/$defs/MemoryContent"
         },
         "title": "Results",
         "type": "array"
      }
   },
   "$defs": {
      "MemoryContent": {
         "description": "A memory content item.",
         "properties": {
            "content": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "format": "binary",
                     "type": "string"
                  },
                  {
                     "type": "object"
                  },
                  {}
               ],
               "title": "Content"
            },
            "mime_type": {
               "anyOf": [
                  {
                     "$ref": "#/$defs/MemoryMimeType"
                  },
                  {
                     "type": "string"
                  }
               ],
               "title": "Mime Type"
            },
            "metadata": {
               "anyOf": [
                  {
                     "type": "object"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Metadata"
            }
         },
         "required": [
            "content",
            "mime_type"
         ],
         "title": "MemoryContent",
         "type": "object"
      },
      "MemoryMimeType": {
         "description": "Supported MIME types for memory content.",
         "enum": [
            "text/plain",
            "application/json",
            "text/markdown",
            "image/*",
            "application/octet-stream"
         ],
         "title": "MemoryMimeType",
         "type": "string"
      }
   },
   "required": [
      "results"
   ]
}
```

---

## autogen_ext.experimental.task_centric_memory.utils — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.experimental.task_centric_memory.utils.html

**Contents:**
- autogen_ext.experimental.task_centric_memory.utils#

A minimal wrapper combining task-centric memory with an agent or team. Applications may use the Apprentice class, or they may directly instantiate and call the Memory Controller using this class as an example.

client – The client to call the model.

config – An optional dict that can be used to override the following values: name_of_agent_or_team: The name of the target agent or team for assigning tasks to. disable_prefix_caching: True to disable prefix caching by prepending random ints to the first message. MemoryController: A config dict passed to MemoryController.

An optional dict that can be used to override the following values:

name_of_agent_or_team: The name of the target agent or team for assigning tasks to.

disable_prefix_caching: True to disable prefix caching by prepending random ints to the first message.

MemoryController: A config dict passed to MemoryController.

logger – An optional logger. If None, a default logger will be created.

Resets the memory bank.

Handles a user message, extracting any advice and assigning a task to the agent.

Adds a task-solution pair to the memory bank, to be retrieved together later as a combined insight. This is useful when the insight is a demonstration of how to solve a given type of task.

Assigns a task to the agent, along with any relevant insights/memories.

Repeatedly assigns a task to the completion agent, and tries to learn from failures by creating useful insights as memories.

Passes the given task to the target agent or team.

Bases: ChatCompletionClient

A chat completion client that supports fast, large-scale tests of code calling LLM clients.

Two modes are supported:

“record”: delegates to the underlying client while also recording the input messages and responses, which are saved to disk when finalize() is called.

“replay”: loads previously recorded message and responses from disk, then on each call checks that its message matches the recorded message, and returns the recorded response.

The recorded data is stored as a JSON list of records. Each record is a dictionary with a “mode” field (either “create” or “create_stream”), a serialized list of messages, and either a “response” (for create calls) or a “stream” (a list of streamed outputs for create_stream calls).

ReplayChatCompletionClient and ChatCompletionCache do similar things, but with significant differences:

ReplayChatCompletionClient replays pre-defined responses in a specified order without recording anything or checking the messages sent to the client.

ChatCompletionCache caches responses and replays them for messages that have been seen before, regardless of order, and calls the base client for any uncached messages.

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

In record mode, saves the accumulated records to disk. In replay mode, makes sure all the records were checked.

Runs basic tests, and determines task success without limitation to string matches.

client – The client to call the model.

logger – An optional logger. If None, no logging will be performed.

Calls the model client with the given input and returns the response.

Determines whether the response is equivalent to the task’s correct answer.

Logs text and images to a set of HTML pages, one per function/method, linked to each other in a call tree.

config – An optional dict that can be used to override the following values: level: The logging level, one of DEBUG, INFO, WARNING, ERROR, CRITICAL, or NONE. path: The path to the directory where the log files will be written.

An optional dict that can be used to override the following values:

level: The logging level, one of DEBUG, INFO, WARNING, ERROR, CRITICAL, or NONE.

path: The path to the directory where the log files will be written.

Adds DEBUG text to the current page if debugging level <= DEBUG.

Adds INFO text to the current page if debugging level <= INFO.

Adds WARNING text to the current page if debugging level <= WARNING.

Adds ERROR text to the current page if debugging level <= ERROR.

Adds CRITICAL text to the current page if debugging level <= CRITICAL.

Adds a page containing the message’s content, including any images.

Adds a page containing a list of dicts.

Logs messages sent to a model and the TaskResult response to a new page.

Logs messages sent to a model and the TaskResult response to a new page.

Returns a link to a local file in the log.

Inserts a thumbnail link to an image to the page.

Writes the current state of the log to disk.

Adds a new page corresponding to the current function call.

Finishes the page corresponding to the current function call.

Gives an AssistantAgent the ability to learn quickly from user teachings, hints, and advice.

Instantiate MemoryController.

Instantiate Teachability, passing the memory controller as a parameter.

Instantiate an AssistantAgent, passing the teachability instance (wrapped in a list) as the memory parameter.

Use the AssistantAgent as usual, such as for chatting with the user.

Get the memory instance identifier.

Extracts any advice from the last user turn to be stored in memory, and adds any relevant memories to the model context.

Tries to extract any advice from the passed content and add it to memory.

Returns any memories that seem relevant to the query.

Clear all entries from memory.

Clean up memory resources.

autogen_ext.agents.web_surfer.playwright_controller

autogen_ext.models.anthropic.config

---

## autogen_ext.experimental.task_centric_memory — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.experimental.task_centric_memory.html

**Contents:**
- autogen_ext.experimental.task_centric_memory#

(EXPERIMENTAL, RESEARCH IN PROGRESS)

Implements fast, memory-based learning, and manages the flow of information to and from a memory bank.

reset – True to empty the memory bank before starting.

client – The model client to use internally.

task_assignment_callback – An optional callback used to assign a task to any agent managed by the caller.

config – An optional dict that can be used to override the following values: generalize_task: Whether to rewrite tasks in more general terms. revise_generalized_task: Whether to critique then rewrite the generalized task. generate_topics: Whether to base retrieval directly on tasks, or on topics extracted from tasks. validate_memos: Whether to apply a final validation stage to retrieved memos. max_memos_to_retrieve: The maximum number of memos to return from retrieve_relevant_memos(). max_train_trials: The maximum number of learning iterations to attempt when training on a task. max_test_trials: The total number of attempts made when testing for failure on a task. MemoryBank: A config dict passed to MemoryBank.

An optional dict that can be used to override the following values:

generalize_task: Whether to rewrite tasks in more general terms.

revise_generalized_task: Whether to critique then rewrite the generalized task.

generate_topics: Whether to base retrieval directly on tasks, or on topics extracted from tasks.

validate_memos: Whether to apply a final validation stage to retrieved memos.

max_memos_to_retrieve: The maximum number of memos to return from retrieve_relevant_memos().

max_train_trials: The maximum number of learning iterations to attempt when training on a task.

max_test_trials: The total number of attempts made when testing for failure on a task.

MemoryBank: A config dict passed to MemoryBank.

logger – An optional logger. If None, a default logger will be created.

The task-centric-memory extra first needs to be installed:

The following code snippet shows how to use this class for the most basic storage and retrieval of memories.:

Empties the memory bank in RAM and on disk.

Repeatedly assigns a task to the agent, and tries to learn from failures by creating useful insights as memories.

Assigns a task to the agent, along with any relevant memos retrieved from memory.

Adds one insight to the memory bank, using the task (if provided) as context.

Adds a task-solution pair to the memory bank, to be retrieved together later as a combined insight. This is useful when the task-solution pair is an exemplar of solving a task related to some other task.

Retrieves any memos from memory that seem relevant to the task.

Assigns a task to some agent through the task_assignment_callback, along with any relevant memories.

Tries to extract any advice from the given text and add it to memory.

Handles a user message by extracting any advice as an insight to be stored in memory, and then calling assign_task().

autogen_ext.code_executors.local

autogen_ext.memory.canvas

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[task-centric-memory]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[task-centric-memory]"
```

Example 3 (python):
```python
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.experimental.task_centric_memory import MemoryController
from autogen_ext.experimental.task_centric_memory.utils import PageLogger


async def main() -> None:
    client = OpenAIChatCompletionClient(model="gpt-4o")
    logger = PageLogger(config={"level": "DEBUG", "path": "./pagelogs/quickstart"})  # Optional, but very useful.
    memory_controller = MemoryController(reset=True, client=client, logger=logger)

    # Add a few task-insight pairs as memories, where an insight can be any string that may help solve the task.
    await memory_controller.add_memo(task="What color do I like?", insight="Deep blue is my favorite color")
    await memory_controller.add_memo(task="What's another color I like?", insight="I really like cyan")
    await memory_controller.add_memo(task="What's my favorite food?", insight="Halibut is my favorite")

    # Retrieve memories for a new task that's related to only two of the stored memories.
    memos = await memory_controller.retrieve_relevant_memos(task="What colors do I like most?")
    print("{} memories retrieved".format(len(memos)))
    for memo in memos:
        print("- " + memo.insight)


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.experimental.task_centric_memory import MemoryController
from autogen_ext.experimental.task_centric_memory.utils import PageLogger


async def main() -> None:
    client = OpenAIChatCompletionClient(model="gpt-4o")
    logger = PageLogger(config={"level": "DEBUG", "path": "./pagelogs/quickstart"})  # Optional, but very useful.
    memory_controller = MemoryController(reset=True, client=client, logger=logger)

    # Add a few task-insight pairs as memories, where an insight can be any string that may help solve the task.
    await memory_controller.add_memo(task="What color do I like?", insight="Deep blue is my favorite color")
    await memory_controller.add_memo(task="What's another color I like?", insight="I really like cyan")
    await memory_controller.add_memo(task="What's my favorite food?", insight="Halibut is my favorite")

    # Retrieve memories for a new task that's related to only two of the stored memories.
    memos = await memory_controller.retrieve_relevant_memos(task="What colors do I like most?")
    print("{} memories retrieved".format(len(memos)))
    for memo in memos:
        print("- " + memo.insight)


asyncio.run(main())
```

---

## autogen_ext.memory.canvas — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.memory.canvas.html

**Contents:**
- autogen_ext.memory.canvas#

An in‑memory canvas that stores text files with full revision history.

This is an experimental API and may change in the future.

Besides the original CRUD‑like operations, this enhanced implementation adds:

apply_patch – applies patches using the unidiff library for accurate hunk application and context line validation.

get_revision_content – random access to any historical revision.

get_revision_diffs – obtain the list of diffs applied between every consecutive pair of revisions so that a caller can replay or audit the full change history.

Return the exact content stored in revision.

If the revision does not exist an empty string is returned so that downstream code can handle the “not found” case without exceptions.

Return a chronological list of unified‑diffs for filename.

Each element in the returned list represents the diff that transformed revision n into revision n+1 (starting at revision 1 → 2).

Return a mapping of filename → latest revision number.

Return the most recent content or an empty string if the file is new.

Create filename or append a new revision containing new_content.

Return a unified diff between from_revision and to_revision.

Apply patch_text (unified diff) to the latest revision and save a new revision.

Uses the unidiff library to accurately apply hunks and validate context lines.

Return a summarised view of every file and its latest revision.

A memory implementation that uses a Canvas for storing file-like content. Inserts the current state of the canvas into the ChatCompletionContext on each turn.

This is an experimental API and may change in the future.

The TextCanvasMemory provides a persistent, file-like storage mechanism that can be used by agents to read and write content. It automatically injects the current state of all files in the canvas into the model context before each inference.

This is particularly useful for: - Allowing agents to create and modify documents over multiple turns - Enabling collaborative document editing between multiple agents - Maintaining persistent state across conversation turns - Working with content too large to fit in a single message

The canvas provides tools for: - Creating or updating files with new content - Applying patches (unified diff format) to existing files

Example: Using TextCanvasMemory with an AssistantAgent

The following example demonstrates how to create a TextCanvasMemory and use it with an AssistantAgent to write and update a story file.

Example: Using TextCanvasMemory with multiple agents

The following example shows how to use TextCanvasMemory with multiple agents collaborating on the same document.

Inject the entire canvas summary (or a selected subset) as reference data. Here, we just put it into a system message, but you could customize.

Potentially search for matching filenames or file content. This example returns empty.

Example usage: Possibly interpret content as a patch or direct file update. Could also be done by a specialized “CanvasTool” instead.

Clear the entire canvas by replacing it with a new empty instance.

Clean up any resources used by the memory implementation.

Returns an UpdateFileTool instance that works with this memory’s canvas.

Returns an ApplyPatchTool instance that works with this memory’s canvas.

autogen_ext.experimental.task_centric_memory

autogen_ext.memory.chromadb

**Examples:**

Example 1 (python):
```python
import asyncio
from autogen_core import CancellationToken
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_ext.memory.canvas import TextCanvasMemory


async def main():
    # Create a model client
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        # api_key = "your_openai_api_key"
    )

    # Create the canvas memory
    text_canvas_memory = TextCanvasMemory()

    # Get tools for working with the canvas
    update_file_tool = text_canvas_memory.get_update_file_tool()
    apply_patch_tool = text_canvas_memory.get_apply_patch_tool()

    # Create an agent with the canvas memory and tools
    writer_agent = AssistantAgent(
        name="Writer",
        model_client=model_client,
        description="A writer agent that creates and updates stories.",
        system_message='''
        You are a Writer Agent. Your focus is to generate a story based on the user's request.

        Instructions for using the canvas:

        - The story should be stored on the canvas in a file named "story.md".
        - If "story.md" does not exist, create it by calling the 'update_file' tool.
        - If "story.md" already exists, generate a unified diff (patch) from the current
          content to the new version, and call the 'apply_patch' tool to apply the changes.

        IMPORTANT: Do not include the full story text in your chat messages.
        Only write the story content to the canvas using the tools.
        ''',
        tools=[update_file_tool, apply_patch_tool],
        memory=[text_canvas_memory],
    )

    # Send a message to the agent
    await writer_agent.on_messages(
        [TextMessage(content="Write a short story about a bunny and a sunflower.", source="user")],
        CancellationToken(),
    )

    # Retrieve the content from the canvas
    story_content = text_canvas_memory.canvas.get_latest_content("story.md")
    print("Story content from canvas:")
    print(story_content)


if __name__ == "__main__":
    asyncio.run(main())
```

Example 2 (python):
```python
import asyncio
from autogen_core import CancellationToken
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_ext.memory.canvas import TextCanvasMemory


async def main():
    # Create a model client
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        # api_key = "your_openai_api_key"
    )

    # Create the canvas memory
    text_canvas_memory = TextCanvasMemory()

    # Get tools for working with the canvas
    update_file_tool = text_canvas_memory.get_update_file_tool()
    apply_patch_tool = text_canvas_memory.get_apply_patch_tool()

    # Create an agent with the canvas memory and tools
    writer_agent = AssistantAgent(
        name="Writer",
        model_client=model_client,
        description="A writer agent that creates and updates stories.",
        system_message='''
        You are a Writer Agent. Your focus is to generate a story based on the user's request.

        Instructions for using the canvas:

        - The story should be stored on the canvas in a file named "story.md".
        - If "story.md" does not exist, create it by calling the 'update_file' tool.
        - If "story.md" already exists, generate a unified diff (patch) from the current
          content to the new version, and call the 'apply_patch' tool to apply the changes.

        IMPORTANT: Do not include the full story text in your chat messages.
        Only write the story content to the canvas using the tools.
        ''',
        tools=[update_file_tool, apply_patch_tool],
        memory=[text_canvas_memory],
    )

    # Send a message to the agent
    await writer_agent.on_messages(
        [TextMessage(content="Write a short story about a bunny and a sunflower.", source="user")],
        CancellationToken(),
    )

    # Retrieve the content from the canvas
    story_content = text_canvas_memory.canvas.get_latest_content("story.md")
    print("Story content from canvas:")
    print(story_content)


if __name__ == "__main__":
    asyncio.run(main())
```

Example 3 (python):
```python
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.memory.canvas import TextCanvasMemory


async def main():
    # Create a model client
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        # api_key = "your_openai_api_key"
    )

    # Create the shared canvas memory
    text_canvas_memory = TextCanvasMemory()
    update_file_tool = text_canvas_memory.get_update_file_tool()
    apply_patch_tool = text_canvas_memory.get_apply_patch_tool()

    # Create a writer agent
    writer_agent = AssistantAgent(
        name="Writer",
        model_client=model_client,
        description="A writer agent that creates stories.",
        system_message="You write children's stories on the canvas in story.md.",
        tools=[update_file_tool, apply_patch_tool],
        memory=[text_canvas_memory],
    )

    # Create a critique agent
    critique_agent = AssistantAgent(
        name="Critique",
        model_client=model_client,
        description="A critique agent that provides feedback on stories.",
        system_message="You review the story.md file and provide constructive feedback.",
        memory=[text_canvas_memory],
    )

    # Create a team with both agents
    team = RoundRobinGroupChat(
        participants=[writer_agent, critique_agent],
        termination_condition=TextMentionTermination("TERMINATE"),
        max_turns=10,
    )

    # Run the team on a task
    await team.run(task="Create a children's book about a bunny and a sunflower")

    # Get the final story
    story = text_canvas_memory.canvas.get_latest_content("story.md")
    print(story)


if __name__ == "__main__":
    asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.memory.canvas import TextCanvasMemory


async def main():
    # Create a model client
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        # api_key = "your_openai_api_key"
    )

    # Create the shared canvas memory
    text_canvas_memory = TextCanvasMemory()
    update_file_tool = text_canvas_memory.get_update_file_tool()
    apply_patch_tool = text_canvas_memory.get_apply_patch_tool()

    # Create a writer agent
    writer_agent = AssistantAgent(
        name="Writer",
        model_client=model_client,
        description="A writer agent that creates stories.",
        system_message="You write children's stories on the canvas in story.md.",
        tools=[update_file_tool, apply_patch_tool],
        memory=[text_canvas_memory],
    )

    # Create a critique agent
    critique_agent = AssistantAgent(
        name="Critique",
        model_client=model_client,
        description="A critique agent that provides feedback on stories.",
        system_message="You review the story.md file and provide constructive feedback.",
        memory=[text_canvas_memory],
    )

    # Create a team with both agents
    team = RoundRobinGroupChat(
        participants=[writer_agent, critique_agent],
        termination_condition=TextMentionTermination("TERMINATE"),
        max_turns=10,
    )

    # Run the team on a task
    await team.run(task="Create a children's book about a bunny and a sunflower")

    # Get the final story
    story = text_canvas_memory.canvas.get_latest_content("story.md")
    print(story)


if __name__ == "__main__":
    asyncio.run(main())
```

---

## autogen_ext.memory.mem0 — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.memory.mem0.html

**Contents:**
- autogen_ext.memory.mem0#

Bases: Memory, Component[Mem0MemoryConfig], ComponentBase[Mem0MemoryConfig]

Mem0 memory implementation for AutoGen.

This component integrates with Mem0.ai’s memory system, providing an implementation of AutoGen’s Memory interface. It supports both cloud and local backends through the mem0ai Python package.

To use this component, you need to have the mem0 (for cloud-only) or mem0-local (for local) extra installed for the autogen-ext package:

The memory component can store and retrieve information that agents need to remember across conversations. It also provides context updating for language models with relevant memories.

Using it with an AssistantAgent:

user_id – Optional user ID for memory operations. If not provided, a UUID will be generated.

limit – Maximum number of results to return in memory queries.

is_cloud – Whether to use cloud Mem0 client (True) or local client (False).

api_key – API key for cloud Mem0 client. It will read from the environment MEM0_API_KEY if not provided.

config – Configuration dictionary for local Mem0 client. Required if is_cloud=False.

The logical type of the component.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of Mem0MemoryConfig

Get the user ID for memory operations.

Get the maximum number of results to return in memory queries.

Check if the Mem0 client is cloud-based.

Get the configuration for the Mem0 client.

Add content to memory.

content – The memory content to add.

cancellation_token – Optional token to cancel operation.

Exception – If there’s an error adding content to mem0 memory.

Query memory for relevant content.

query – The query to search for, either as string or MemoryContent.

cancellation_token – Optional token to cancel operation.

**kwargs – Additional query parameters to pass to mem0.

MemoryQueryResult containing search results.

Update the model context with relevant memories.

This method retrieves the conversation history from the model context, uses the last message as a query to find relevant memories, and then adds those memories to the context as a system message.

model_context – The model context to update.

UpdateContextResult containing memories added to the context.

Clear all content from memory for the current user.

Exception – If there’s an error clearing mem0 memory.

Clean up resources if needed.

This is a no-op for Mem0 clients as they don’t require explicit cleanup.

Configuration for Mem0Memory component.

Show JSON schema{ "title": "Mem0MemoryConfig", "description": "Configuration for Mem0Memory component.", "type": "object", "properties": { "user_id": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "User ID for memory operations. If not provided, a UUID will be generated.", "title": "User Id" }, "limit": { "default": 10, "description": "Maximum number of results to return in memory queries.", "title": "Limit", "type": "integer" }, "is_cloud": { "default": true, "description": "Whether to use cloud Mem0 client (True) or local client (False).", "title": "Is Cloud", "type": "boolean" }, "api_key": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "description": "API key for cloud Mem0 client. Required if is_cloud=True.", "title": "Api Key" }, "config": { "anyOf": [ { "type": "object" }, { "type": "null" } ], "default": null, "description": "Configuration dictionary for local Mem0 client. Required if is_cloud=False.", "title": "Config" } } }

config (Dict[str, Any] | None)

User ID for memory operations. If not provided, a UUID will be generated.

Maximum number of results to return in memory queries.

Whether to use cloud Mem0 client (True) or local client (False).

API key for cloud Mem0 client. Required if is_cloud=True.

Configuration dictionary for local Mem0 client. Required if is_cloud=False.

autogen_ext.memory.chromadb

autogen_ext.memory.redis

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-ext[mem0]" # For cloud-based Mem0
pip install -U "autogen-ext[mem0-local]" # For local Mem0
```

Example 2 (unknown):
```unknown
pip install -U "autogen-ext[mem0]" # For cloud-based Mem0
pip install -U "autogen-ext[mem0-local]" # For local Mem0
```

Example 3 (python):
```python
import asyncio
from autogen_ext.memory.mem0 import Mem0Memory
from autogen_core.memory import MemoryContent


async def main() -> None:
    # Create a local Mem0Memory (no API key required)
    memory = Mem0Memory(
        is_cloud=False,
        config={"path": ":memory:"},  # Use in-memory storage for testing
    )
    print("Memory initialized successfully!")

    # Add something to memory
    test_content = "User likes the color blue."
    await memory.add(MemoryContent(content=test_content, mime_type="text/plain"))
    print(f"Added content: {test_content}")

    # Retrieve memories with a search query
    results = await memory.query("What color does the user like?")
    print(f"Query results: {len(results.results)} found")

    for i, result in enumerate(results.results):
        print(f"Result {i+1}: {result}")


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_ext.memory.mem0 import Mem0Memory
from autogen_core.memory import MemoryContent


async def main() -> None:
    # Create a local Mem0Memory (no API key required)
    memory = Mem0Memory(
        is_cloud=False,
        config={"path": ":memory:"},  # Use in-memory storage for testing
    )
    print("Memory initialized successfully!")

    # Add something to memory
    test_content = "User likes the color blue."
    await memory.add(MemoryContent(content=test_content, mime_type="text/plain"))
    print(f"Added content: {test_content}")

    # Retrieve memories with a search query
    results = await memory.query("What color does the user like?")
    print(f"Query results: {len(results.results)} found")

    for i, result in enumerate(results.results):
        print(f"Result {i+1}: {result}")


asyncio.run(main())
```

---

## autogen_ext.memory.redis — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.memory.redis.html

**Contents:**
- autogen_ext.memory.redis#

Configuration for Redis-based vector memory.

This class defines the configuration options for using Redis as a vector memory store, supporting semantic memory. It allows customization of the Redis connection, index settings, similarity search parameters, and embedding model.

Show JSON schema{ "title": "RedisMemoryConfig", "description": "Configuration for Redis-based vector memory.\n\nThis class defines the configuration options for using Redis as a vector memory store,\nsupporting semantic memory. It allows customization of the Redis connection, index settings,\nsimilarity search parameters, and embedding model.", "type": "object", "properties": { "redis_url": { "default": "redis://localhost:6379", "description": "url of the Redis instance", "title": "Redis Url", "type": "string" }, "index_name": { "default": "chat_history", "description": "Name of the Redis collection", "title": "Index Name", "type": "string" }, "prefix": { "default": "memory", "description": "prefix of the Redis collection", "title": "Prefix", "type": "string" }, "sequential": { "default": false, "description": "ignore semantic similarity and simply return memories in sequential order", "title": "Sequential", "type": "boolean" }, "distance_metric": { "default": "cosine", "enum": [ "cosine", "ip", "l2" ], "title": "Distance Metric", "type": "string" }, "algorithm": { "default": "flat", "enum": [ "flat", "hnsw" ], "title": "Algorithm", "type": "string" }, "top_k": { "default": 10, "description": "Number of results to return in queries", "title": "Top K", "type": "integer" }, "datatype": { "default": "float32", "enum": [ "uint8", "int8", "float16", "float32", "float64", "bfloat16" ], "title": "Datatype", "type": "string" }, "distance_threshold": { "default": 0.7, "description": "Minimum similarity score threshold", "title": "Distance Threshold", "type": "number" }, "model_name": { "default": "sentence-transformers/all-mpnet-base-v2", "description": "Embedding model name", "title": "Model Name", "type": "string" } } }

algorithm (Literal['flat', 'hnsw'])

datatype (Literal['uint8', 'int8', 'float16', 'float32', 'float64', 'bfloat16'])

distance_metric (Literal['cosine', 'ip', 'l2'])

distance_threshold (float)

url of the Redis instance

Name of the Redis collection

prefix of the Redis collection

ignore semantic similarity and simply return memories in sequential order

Number of results to return in queries

Minimum similarity score threshold

Bases: Memory, Component[RedisMemoryConfig]

Store and retrieve memory using vector similarity search powered by RedisVL.

RedisMemory provides a vector-based memory implementation that uses RedisVL for storing and retrieving content based on semantic similarity or sequential order. It enhances agents with the ability to recall relevant information during conversations by leveraging vector embeddings to find similar content.

This implementation requires the RedisVL extra to be installed. Install with:

Additionally, you will need access to a Redis instance. To run a local instance of redis in docker:

To download and run Redis locally:

config (RedisMemoryConfig | None) – Configuration for the Redis memory. If None, defaults to a RedisMemoryConfig with recommended settings.

alias of RedisMemoryConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Update the model context with relevant memory content.

This method retrieves memory content relevant to the last message in the context and adds it as a system message. This implementation uses the last message in the context as a query to find semantically similar memories and adds them all to the context as a single system message.

model_context (ChatCompletionContext) – The model context to update with relevant memories.

UpdateContextResult – Object containing the memories that were used to update the context.

Add a memory content object to Redis.

If RedisMemoryConfig is not set to ‘sequential’, to perform semantic search over stored memories RedisMemory creates a vector embedding from the content field of a MemoryContent object. This content is assumed to be text, JSON, or Markdown, and is passed to the vector embedding model specified in RedisMemoryConfig.

content (MemoryContent) – The memory content to store within Redis.

cancellation_token (CancellationToken) – Token passed to cease operation. Not used.

Query memory content based on semantic vector similarity.

RedisMemory.query() supports additional keyword arguments to improve query performance. top_k (int): The maximum number of relevant memories to include. Defaults to 10. distance_threshold (float): The maximum distance in vector space to consider a memory semantically similar when performining cosine similarity search. Defaults to 0.7. sequential (bool): Ignore semantic similarity and return the top_k most recent memories.

query (str | MemoryContent) – query to perform vector similarity search with. If a string is passed, a vector embedding is created from it with the model specified in the RedisMemoryConfig. If a MemoryContent object is passed, the content field of this object is extracted and a vector embedding is created from it with the model specified in the RedisMemoryConfig.

cancellation_token (CancellationToken) – Token passed to cease operation. Not used.

memoryQueryResult – Object containing memories relevant to the provided query.

Clear all entries from memory, preserving the RedisMemory resources.

Clears all entries from memory, and cleans up Redis client, index and resources.

autogen_ext.memory.mem0

autogen_ext.models.anthropic

**Examples:**

Example 1 (json):
```json
{
   "title": "RedisMemoryConfig",
   "description": "Configuration for Redis-based vector memory.\n\nThis class defines the configuration options for using Redis as a vector memory store,\nsupporting semantic memory. It allows customization of the Redis connection, index settings,\nsimilarity search parameters, and embedding model.",
   "type": "object",
   "properties": {
      "redis_url": {
         "default": "redis://localhost:6379",
         "description": "url of the Redis instance",
         "title": "Redis Url",
         "type": "string"
      },
      "index_name": {
         "default": "chat_history",
         "description": "Name of the Redis collection",
         "title": "Index Name",
         "type": "string"
      },
      "prefix": {
         "default": "memory",
         "description": "prefix of the Redis collection",
         "title": "Prefix",
         "type": "string"
      },
      "sequential": {
         "default": false,
         "description": "ignore semantic similarity and simply return memories in sequential order",
         "title": "Sequential",
         "type": "boolean"
      },
      "distance_metric": {
         "default": "cosine",
         "enum": [
            "cosine",
            "ip",
            "l2"
         ],
         "title": "Distance Metric",
         "type": "string"
      },
      "algorithm": {
         "default": "flat",
         "enum": [
            "flat",
            "hnsw"
         ],
         "title": "Algorithm",
         "type": "string"
      },
      "top_k": {
         "default": 10,
         "description": "Number of results to return in queries",
         "title": "Top K",
         "type": "integer"
      },
      "datatype": {
         "default": "float32",
         "enum": [
            "uint8",
            "int8",
            "float16",
            "float32",
            "float64",
            "bfloat16"
         ],
         "title": "Datatype",
         "type": "string"
      },
      "distance_threshold": {
         "default": 0.7,
         "description": "Minimum similarity score threshold",
         "title": "Distance Threshold",
         "type": "number"
      },
      "model_name": {
         "default": "sentence-transformers/all-mpnet-base-v2",
         "description": "Embedding model name",
         "title": "Model Name",
         "type": "string"
      }
   }
}
```

Example 2 (json):
```json
{
   "title": "RedisMemoryConfig",
   "description": "Configuration for Redis-based vector memory.\n\nThis class defines the configuration options for using Redis as a vector memory store,\nsupporting semantic memory. It allows customization of the Redis connection, index settings,\nsimilarity search parameters, and embedding model.",
   "type": "object",
   "properties": {
      "redis_url": {
         "default": "redis://localhost:6379",
         "description": "url of the Redis instance",
         "title": "Redis Url",
         "type": "string"
      },
      "index_name": {
         "default": "chat_history",
         "description": "Name of the Redis collection",
         "title": "Index Name",
         "type": "string"
      },
      "prefix": {
         "default": "memory",
         "description": "prefix of the Redis collection",
         "title": "Prefix",
         "type": "string"
      },
      "sequential": {
         "default": false,
         "description": "ignore semantic similarity and simply return memories in sequential order",
         "title": "Sequential",
         "type": "boolean"
      },
      "distance_metric": {
         "default": "cosine",
         "enum": [
            "cosine",
            "ip",
            "l2"
         ],
         "title": "Distance Metric",
         "type": "string"
      },
      "algorithm": {
         "default": "flat",
         "enum": [
            "flat",
            "hnsw"
         ],
         "title": "Algorithm",
         "type": "string"
      },
      "top_k": {
         "default": 10,
         "description": "Number of results to return in queries",
         "title": "Top K",
         "type": "integer"
      },
      "datatype": {
         "default": "float32",
         "enum": [
            "uint8",
            "int8",
            "float16",
            "float32",
            "float64",
            "bfloat16"
         ],
         "title": "Datatype",
         "type": "string"
      },
      "distance_threshold": {
         "default": 0.7,
         "description": "Minimum similarity score threshold",
         "title": "Distance Threshold",
         "type": "number"
      },
      "model_name": {
         "default": "sentence-transformers/all-mpnet-base-v2",
         "description": "Embedding model name",
         "title": "Model Name",
         "type": "string"
      }
   }
}
```

Example 3 (unknown):
```unknown
pip install "autogen-ext[redisvl]"
```

Example 4 (unknown):
```unknown
pip install "autogen-ext[redisvl]"
```

---

## autogen_ext.memory — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.memory.html

**Contents:**
- autogen_ext.memory#

autogen_ext.experimental

---
