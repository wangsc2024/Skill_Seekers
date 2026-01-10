# Autogen - Messages

**Pages:** 4

---

## autogen_core.logging — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.logging.html

**Contents:**
- autogen_core.logging#

To be used by model clients to log the start of a stream.

messages (List[Dict[str, Any]]) – The messages used in the call. Must be json serializable.

autogen_core.exceptions

**Examples:**

Example 1 (json):
```json
import logging
from autogen_core import EVENT_LOGGER_NAME
from autogen_core.logging import LLMStreamStartEvent

messages = [{"role": "user", "content": "Hello, world!"}]
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.info(LLMStreamStartEvent(messages=messages))
```

Example 2 (json):
```json
import logging
from autogen_core import EVENT_LOGGER_NAME
from autogen_core.logging import LLMStreamStartEvent

messages = [{"role": "user", "content": "Hello, world!"}]
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.info(LLMStreamStartEvent(messages=messages))
```

---

## autogen_ext.ui — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.ui.html

**Contents:**
- autogen_ext.ui#

This module implements utility classes for formatting/printing agent messages.

Consumes the message stream from run_stream() or on_messages_stream() and renders the messages to the console. Returns the last processed TaskResult or Response.

output_stats is experimental and the stats may not be accurate. It will be improved in future releases.

stream (AsyncGenerator[BaseAgentEvent | BaseChatMessage | TaskResult, None] | AsyncGenerator[BaseAgentEvent | BaseChatMessage | Response, None]) – Message stream to render. This can be from run_stream() or on_messages_stream().

no_inline_images (bool, optional) – If terminal is iTerm2 will render images inline. Use this to disable this behavior. Defaults to False.

output_stats (bool, optional) – (Experimental) If True, will output a summary of the messages and inline token usage info. Defaults to False.

last_processed – A TaskResult if the stream is from run_stream() or a Response if the stream is from on_messages_stream().

autogen_ext.agents.azure

---

## Logging — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/logging.html

**Contents:**
- Logging#
- Enabling logging output#
  - Structured logging#
- Emitting logs#
  - Emitting structured logs#

AutoGen uses Python’s built-in logging module.

There are two kinds of logging:

Trace logging: This is used for debugging and is human readable messages to indicate what is going on. This is intended for a developer to understand what is happening in the code. The content and format of these logs should not be depended on by other systems.

Name: TRACE_LOGGER_NAME.

Structured logging: This logger emits structured events that can be consumed by other systems. The content and format of these logs can be depended on by other systems.

Name: EVENT_LOGGER_NAME.

See the module autogen_core.logging to see the available events.

ROOT_LOGGER_NAME can be used to enable or disable all logs.

To enable trace logging, you can use the following code:

To enable structured logging, you can use the following code:

Structured logging allows you to write handling logic that deals with the actual events including all fields rather than just a formatted string.

For example, if you had defined this custom event and were emitting it. Then you could write the following handler to receive it.

And this is how you could use it:

These two names are the root loggers for these types. Code that emits logs should use a child logger of these loggers. For example, if you are writing a module my_module and you want to emit trace logs, you should use the logger named:

If your event is a dataclass, then it could be emitted in code like this:

Message and Communication

**Examples:**

Example 1 (python):
```python
import logging

from autogen_core import TRACE_LOGGER_NAME

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(TRACE_LOGGER_NAME)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)
```

Example 2 (python):
```python
import logging

from autogen_core import TRACE_LOGGER_NAME

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(TRACE_LOGGER_NAME)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)
```

Example 3 (python):
```python
import logging

from autogen_core import EVENT_LOGGER_NAME

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)
```

Example 4 (python):
```python
import logging

from autogen_core import EVENT_LOGGER_NAME

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(EVENT_LOGGER_NAME)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)
```

---

## User Approval for Tool Execution using Intervention Handler — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/tool-use-with-intervention.html

**Contents:**
- User Approval for Tool Execution using Intervention Handler#

This cookbook shows how to intercept the tool execution using an intervention hanlder, and prompt the user for permission to execute the tool.

Let’s define a simple message type that carries a string content.

Let’s create a simple tool use agent that is capable of using tools through a ToolAgent.

The tool use agent sends tool call requests to the tool agent to execute tools, so we can intercept the messages sent by the tool use agent to the tool agent to prompt the user for permission to execute the tool.

Let’s create an intervention handler that intercepts the messages and prompts user for before allowing the tool execution.

Now, we can create a runtime with the intervention handler registered.

In this example, we will use a tool for Python code execution. First, we create a Docker-based command-line code executor using DockerCommandLineCodeExecutor, and then use it to instantiate a built-in Python code execution tool PythonCodeExecutionTool that runs code in a Docker container.

Register the agents with tools and tool schema.

Run the agents by starting the runtime and sending a message to the tool use agent. The intervention handler will prompt you for permission to execute the tool.

Termination using Intervention Handler

Extracting Results with an Agent

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass
from typing import Any, List

from autogen_core import (
    AgentId,
    AgentType,
    DefaultInterventionHandler,
    DropMessage,
    FunctionCall,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    message_handler,
)
from autogen_core.models import (
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tool_agent import ToolAgent, ToolException, tool_agent_caller_loop
from autogen_core.tools import ToolSchema
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.code_execution import PythonCodeExecutionTool
```

Example 2 (python):
```python
from dataclasses import dataclass
from typing import Any, List

from autogen_core import (
    AgentId,
    AgentType,
    DefaultInterventionHandler,
    DropMessage,
    FunctionCall,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    message_handler,
)
from autogen_core.models import (
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tool_agent import ToolAgent, ToolException, tool_agent_caller_loop
from autogen_core.tools import ToolSchema
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.code_execution import PythonCodeExecutionTool
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
