# Autogen - Agents

**Pages:** 46

---

## Agent and Agent Runtime — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/agent-and-agent-runtime.html

**Contents:**
- Agent and Agent Runtime#
- Implementing an Agent#
- Using an AgentChat Agent#
- Registering Agent Type#
- Running the Single-Threaded Agent Runtime#

In this and the following section, we focus on the core concepts of AutoGen: agents, agent runtime, messages, and communication – the foundational building blocks for an multi-agent applications.

The Core API is designed to be unopinionated and flexible. So at times, you may find it challenging. Continue if you are building an interactive, scalable and distributed multi-agent system and want full control of all workflows. If you just want to get something running quickly, you may take a look at the AgentChat API.

An agent in AutoGen is an entity defined by the base interface Agent. It has a unique identifier of the type AgentId, a metadata dictionary of the type AgentMetadata.

In most cases, you can subclass your agents from higher level class RoutedAgent which enables you to route messages to corresponding message handler specified with message_handler() decorator and proper type hint for the message variable. An agent runtime is the execution environment for agents in AutoGen.

Similar to the runtime environment of a programming language, an agent runtime provides the necessary infrastructure to facilitate communication between agents, manage agent lifecycles, enforce security boundaries, and support monitoring and debugging.

For local development, developers can use SingleThreadedAgentRuntime, which can be embedded in a Python application.

Agents are not directly instantiated and managed by application code. Instead, they are created by the runtime when needed and managed by the runtime.

If you are already familiar with AgentChat, it is important to note that AgentChat’s agents such as AssistantAgent are created by application and thus not directly managed by the runtime. To use an AgentChat agent in Core, you need to create a wrapper Core agent that delegates messages to the AgentChat agent and let the runtime manage the wrapper agent.

To implement an agent, the developer must subclass the RoutedAgent class and implement a message handler method for each message type the agent is expected to handle using the message_handler() decorator. For example, the following agent handles a simple message type MyMessageType and prints the message it receives:

This agent only handles MyMessageType and messages will be delivered to handle_my_message_type method. Developers can have multiple message handlers for different message types by using message_handler() decorator and setting the type hint for the message variable in the handler function. You can also leverage python typing union for the message variable in one message handler function if it better suits agent’s logic. See the next section on message and communication.

If you have an AgentChat agent and want to use it in the Core API, you can create a wrapper RoutedAgent that delegates messages to the AgentChat agent. The following example shows how to create a wrapper agent for the AssistantAgent in AgentChat.

For how to use model client, see the Model Client section.

Since the Core API is unopinionated, you are not required to use the AgentChat API to use the Core API. You can implement your own agents or use another agent framework.

To make agents available to the runtime, developers can use the register() class method of the BaseAgent class. The process of registration associates an agent type, which is uniquely identified by a string, and a factory function that creates an instance of the agent type of the given class. The factory function is used to allow automatic creation of agent instances when they are needed.

Agent type (AgentType) is not the same as the agent class. In this example, the agent type is AgentType("my_agent") or AgentType("my_assistant") and the agent class is the Python class MyAgent or MyAssistantAgent. The factory function is expected to return an instance of the agent class on which the register() class method is invoked. Read Agent Identity and Lifecycles to learn more about agent type and identity.

Different agent types can be registered with factory functions that return the same agent class. For example, in the factory functions, variations of the constructor parameters can be used to create different instances of the same agent class.

To register our agent types with the SingleThreadedAgentRuntime, the following code can be used:

Once an agent type is registered, we can send a direct message to an agent instance using an AgentId. The runtime will create the instance the first time it delivers a message to this instance.

Because the runtime manages the lifecycle of agents, an AgentId is only used to communicate with the agent or retrieve its metadata (e.g., description).

The above code snippet uses start() to start a background task to process and deliver messages to recepients’ message handlers. This is a feature of the local embedded runtime SingleThreadedAgentRuntime.

To stop the background task immediately, use the stop() method:

You can resume the background task by calling start() again.

For batch scenarios such as running benchmarks for evaluating agents, you may want to wait for the background task to stop automatically when there are no unprocessed messages and no agent is handling messages – the batch may considered complete. You can achieve this by using the stop_when_idle() method:

To close the runtime and release resources, use the close() method:

Other runtime implementations will have their own ways of running the runtime.

Topic and Subscription

Message and Communication

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, MessageContext, RoutedAgent, message_handler


@dataclass
class MyMessageType:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("MyAgent")

    @message_handler
    async def handle_my_message_type(self, message: MyMessageType, ctx: MessageContext) -> None:
        print(f"{self.id.type} received message: {message.content}")
```

Example 2 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, MessageContext, RoutedAgent, message_handler


@dataclass
class MyMessageType:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("MyAgent")

    @message_handler
    async def handle_my_message_type(self, message: MyMessageType, ctx: MessageContext) -> None:
        print(f"{self.id.type} received message: {message.content}")
```

Example 3 (python):
```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient


class MyAssistant(RoutedAgent):
    def __init__(self, name: str) -> None:
        super().__init__(name)
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        self._delegate = AssistantAgent(name, model_client=model_client)

    @message_handler
    async def handle_my_message_type(self, message: MyMessageType, ctx: MessageContext) -> None:
        print(f"{self.id.type} received message: {message.content}")
        response = await self._delegate.on_messages(
            [TextMessage(content=message.content, source="user")], ctx.cancellation_token
        )
        print(f"{self.id.type} responded: {response.chat_message}")
```

Example 4 (python):
```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient


class MyAssistant(RoutedAgent):
    def __init__(self, name: str) -> None:
        super().__init__(name)
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        self._delegate = AssistantAgent(name, model_client=model_client)

    @message_handler
    async def handle_my_message_type(self, message: MyMessageType, ctx: MessageContext) -> None:
        print(f"{self.id.type} received message: {message.content}")
        response = await self._delegate.on_messages(
            [TextMessage(content=message.content, source="user")], ctx.cancellation_token
        )
        print(f"{self.id.type} responded: {response.chat_message}")
```

---

## Agent and Multi-Agent Applications — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/agent-and-multi-agent-application.html

**Contents:**
- Agent and Multi-Agent Applications#
- Characteristics of Multi-Agent Applications#

An agent is a software entity that communicates via messages, maintains its own state, and performs actions in response to received messages or changes in its state. These actions may modify the agent’s state and produce external effects, such as updating message logs, sending new messages, executing code, or making API calls.

Many software systems can be modeled as a collection of independent agents that interact with one another. Examples include:

Sensors on a factory floor

Distributed services powering web applications

Business workflows involving multiple stakeholders

AI agents, such as those powered by language models (e.g., GPT-4), which can write code, interface with external systems, and communicate with other agents.

These systems, composed of multiple interacting agents, are referred to as multi-agent applications.

Note: AI agents typically use language models as part of their software stack to interpret messages, perform reasoning, and execute actions.

In multi-agent applications, agents may:

Run within the same process or on the same machine

Operate across different machines or organizational boundaries

Be implemented in diverse programming languages and make use of different AI models or instructions

Work together towards a shared goal, coordinating their actions through messaging

Each agent is a self-contained unit that can be developed, tested, and deployed independently. This modular design allows agents to be reused across different scenarios and composed into more complex systems.

Agents are inherently composable: simple agents can be combined to form complex, adaptable applications, where each agent contributes a specific function or service to the overall system.

Agent Runtime Environments

---

## Agent Identity and Lifecycle — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/agent-identity-and-lifecycle.html

**Contents:**
- Agent Identity and Lifecycle#
- Agent ID#
- Agent Lifecycle#

The agent runtime manages agents’ identities and lifecycles. Application does not create agents directly, rather, it registers an agent type with a factory function for agent instances. In this section, we explain how agents are identified and created by the runtime.

Agent ID uniquely identifies an agent instance within an agent runtime – including distributed runtime. It is the “address” of the agent instance for receiving messages. It has two components: agent type and agent key.

Agent ID = (Agent Type, Agent Key)

The agent type is not an agent class. It associates an agent with a specific factory function, which produces instances of agents of the same agent type. For example, different factory functions can produce the same agent class but with different constructor parameters. The agent key is an instance identifier for the given agent type. Agent IDs can be converted to and from strings. the format of this string is:

Types and Keys are considered valid if they only contain alphanumeric letters (a-z) and (0-9), or underscores (_). A valid identifier cannot start with a number, or contain any spaces.

In a multi-agent application, agent types are typically defined directly by the application, i.e., they are defined in the application code. On the other hand, agent keys are typically generated given messages delivered to the agents, i.e., they are defined by the application data.

For example, a runtime has registered the agent type "code_reviewer" with a factory function producing agent instances that perform code reviews. Each code review request has a unique ID review_request_id to mark a dedicated session. In this case, each request can be handled by a new instance with an agent ID, ("code_reviewer", review_request_id).

When a runtime delivers a message to an agent instance given its ID, it either fetches the instance, or creates it if it does not exist.

The runtime is also responsible for “paging in” or “out” agent instances to conserve resources and balance load across multiple machines. This is not implemented yet.

Topic and Subscription

---

## Agent Runtime Environments — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/architecture.html

**Contents:**
- Agent Runtime Environments#
- Standalone Agent Runtime#
- Distributed Agent Runtime#

At the foundation level, the framework provides a runtime environment, which facilitates communication between agents, manages their identities and lifecycles, and enforce security and privacy boundaries.

It supports two types of runtime environment: standalone and distributed. Both types provide a common set of APIs for building multi-agent applications, so you can switch between them without changing your agent implementation. Each type can also have multiple implementations.

Standalone runtime is suitable for single-process applications where all agents are implemented in the same programming language and running in the same process. In the Python API, an example of standalone runtime is the SingleThreadedAgentRuntime.

The following diagram shows the standalone runtime in the framework.

Here, agents communicate via messages through the runtime, and the runtime manages the lifecycle of agents.

Developers can build agents quickly by using the provided components including routed agent, AI model clients, tools for AI models, code execution sandboxes, model context stores, and more. They can also implement their own agents from scratch, or use other libraries.

Distributed runtime is suitable for multi-process applications where agents may be implemented in different programming languages and running on different machines.

A distributed runtime, as shown in the diagram above, consists of a host servicer and multiple workers. The host servicer facilitates communication between agents across workers and maintains the states of connections. The workers run agents and communicate with the host servicer via gateways. They advertise to the host servicer the agents they run and manage the agents’ lifecycles.

Agents work the same way as in the standalone runtime so that developers can switch between the two runtime types with no change to their agent implementation.

Agent and Multi-Agent Applications

---

## Application Stack — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/application-stack.html

**Contents:**
- Application Stack#
- An Example Application#

AutoGen core is designed to be an unopinionated framework that can be used to build a wide variety of multi-agent applications. It is not tied to any specific agent abstraction or multi-agent pattern.

The following diagram shows the application stack.

At the bottom of the stack is the base messaging and routing facilities that enable agents to communicate with each other. These are managed by the agent runtime, and for most applications, developers only need to interact with the high-level APIs provided by the runtime (see Agent and Agent Runtime).

At the top of the stack, developers need to define the types of the messages that agents exchange. This set of message types forms a behavior contract that agents must adhere to, and the implementation of the contracts determines how agents handle messages. The behavior contract is also sometimes referred to as the message protocol. It is the developer’s responsibility to implement the behavior contract. Multi-agent patterns emerge from these behavior contracts (see Multi-Agent Design Patterns).

Consider a concrete example of a multi-agent application for code generation. The application consists of three agents: Coder Agent, Executor Agent, and Reviewer Agent. The following diagram shows the data flow between the agents, and the message types exchanged between them.

In this example, the behavior contract consists of the following:

CodingTaskMsg message from application to the Coder Agent

CodeGenMsg from Coder Agent to Executor Agent

ExecutionResultMsg from Executor Agent to Reviewer Agent

ReviewMsg from Reviewer Agent to Coder Agent

CodingResultMsg from the Reviewer Agent to the application

The behavior contract is implemented by the agents’ handling of these messages. For example, the Reviewer Agent listens for ExecutionResultMsg and evaluates the code execution result to decide whether to approve or reject, if approved, it sends a CodingResultMsg to the application, otherwise, it sends a ReviewMsg to the Coder Agent for another round of code generation.

This behavior contract is a case of a multi-agent pattern called reflection, where a generation result is reviewed by another round of generation, to improve the overall quality.

Agent Runtime Environments

Agent Identity and Lifecycle

---

## AutoGen — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/

**Contents:**
- AutoGen#
- AutoGen
  - A framework for building AI agents and applications

An web-based UI for prototyping with agents without writing code. Built on AgentChat.

Start here if you are new to AutoGen and want to prototype with agents without writing code.

Start here if you are prototyping with agents using Python. Migrating from AutoGen 0.2?.

An event-driven programming framework for building scalable multi-agent AI systems. Example scenarios:

Deterministic and dynamic agentic workflows for business processes.

Research on multi-agent collaboration.

Distributed agents for multi-language applications.

Start here if you are getting serious about building multi-agent systems.

Implementations of Core and AgentChat components that interface with external services or other libraries. You can find and use community extensions or create your own. Examples of built-in extensions:

McpWorkbench for using Model-Context Protocol (MCP) servers.

OpenAIAssistantAgent for using Assistant API.

DockerCommandLineCodeExecutor for running model-generated code in a Docker container.

GrpcWorkerAgentRuntime for distributed agents.

Discover Community Extensions Create New Extension

**Examples:**

Example 1 (unknown):
```unknown
pip install -U autogenstudio
autogenstudio ui --port 8080 --appdir ./myapp
```

Example 2 (unknown):
```unknown
pip install -U autogenstudio
autogenstudio ui --port 8080 --appdir ./myapp
```

Example 3 (python):
```python
# pip install -U "autogen-agentchat" "autogen-ext[openai]"
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main() -> None:
    agent = AssistantAgent("assistant", OpenAIChatCompletionClient(model="gpt-4o"))
    print(await agent.run(task="Say 'Hello World!'"))

asyncio.run(main())
```

Example 4 (python):
```python
# pip install -U "autogen-agentchat" "autogen-ext[openai]"
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main() -> None:
    agent = AssistantAgent("assistant", OpenAIChatCompletionClient(model="gpt-4o"))
    print(await agent.run(task="Say 'Hello World!'"))

asyncio.run(main())
```

---

## autogen_core.model_context — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.model_context.html

**Contents:**
- autogen_core.model_context#

Bases: ABC, ComponentBase[BaseModel]

An abstract base class for defining the interface of a chat completion context. A chat completion context lets agents store and retrieve LLM messages. It can be implemented with different recall strategies.

initial_messages (List[LLMMessage] | None) – The initial messages.

To create a custom model context that filters out the thought field from AssistantMessage. This is useful for reasoning models like DeepSeek R1, which produces very long thought that is not needed for subsequent completions.

The logical type of the component.

Add a message to the context.

Show JSON schema{ "title": "ChatCompletionContextState", "type": "object", "properties": { "messages": { "items": { "discriminator": { "mapping": { "AssistantMessage": "#/$defs/AssistantMessage", "FunctionExecutionResultMessage": "#/$defs/FunctionExecutionResultMessage", "SystemMessage": "#/$defs/SystemMessage", "UserMessage": "#/$defs/UserMessage" }, "propertyName": "type" }, "oneOf": [ { "$ref": "#/$defs/SystemMessage" }, { "$ref": "#/$defs/UserMessage" }, { "$ref": "#/$defs/AssistantMessage" }, { "$ref": "#/$defs/FunctionExecutionResultMessage" } ] }, "title": "Messages", "type": "array" } }, "$defs": { "AssistantMessage": { "description": "Assistant message are sampled from the language model.", "properties": { "content": { "anyOf": [ { "type": "string" }, { "items": { "$ref": "#/$defs/FunctionCall" }, "type": "array" } ], "title": "Content" }, "thought": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Thought" }, "source": { "title": "Source", "type": "string" }, "type": { "const": "AssistantMessage", "default": "AssistantMessage", "title": "Type", "type": "string" } }, "required": [ "content", "source" ], "title": "AssistantMessage", "type": "object" }, "FunctionCall": { "properties": { "id": { "title": "Id", "type": "string" }, "arguments": { "title": "Arguments", "type": "string" }, "name": { "title": "Name", "type": "string" } }, "required": [ "id", "arguments", "name" ], "title": "FunctionCall", "type": "object" }, "FunctionExecutionResult": { "description": "Function execution result contains the output of a function call.", "properties": { "content": { "title": "Content", "type": "string" }, "name": { "title": "Name", "type": "string" }, "call_id": { "title": "Call Id", "type": "string" }, "is_error": { "anyOf": [ { "type": "boolean" }, { "type": "null" } ], "default": null, "title": "Is Error" } }, "required": [ "content", "name", "call_id" ], "title": "FunctionExecutionResult", "type": "object" }, "FunctionExecutionResultMessage": { "description": "Function execution result message contains the output of multiple function calls.", "properties": { "content": { "items": { "$ref": "#/$defs/FunctionExecutionResult" }, "title": "Content", "type": "array" }, "type": { "const": "FunctionExecutionResultMessage", "default": "FunctionExecutionResultMessage", "title": "Type", "type": "string" } }, "required": [ "content" ], "title": "FunctionExecutionResultMessage", "type": "object" }, "SystemMessage": { "description": "System message contains instructions for the model coming from the developer.\n\n.. note::\n\n Open AI is moving away from using 'system' role in favor of 'developer' role.\n See `Model Spec <https://cdn.openai.com/spec/model-spec-2024-05-08.html#definitions>`_ for more details.\n However, the 'system' role is still allowed in their API and will be automatically converted to 'developer' role\n on the server side.\n So, you can use `SystemMessage` for developer messages.", "properties": { "content": { "title": "Content", "type": "string" }, "type": { "const": "SystemMessage", "default": "SystemMessage", "title": "Type", "type": "string" } }, "required": [ "content" ], "title": "SystemMessage", "type": "object" }, "UserMessage": { "description": "User message contains input from end users, or a catch-all for data provided to the model.", "properties": { "content": { "anyOf": [ { "type": "string" }, { "items": { "anyOf": [ { "type": "string" }, {} ] }, "type": "array" } ], "title": "Content" }, "source": { "title": "Source", "type": "string" }, "type": { "const": "UserMessage", "default": "UserMessage", "title": "Type", "type": "string" } }, "required": [ "content", "source" ], "title": "UserMessage", "type": "object" } } }

messages (List[autogen_core.models._types.SystemMessage | autogen_core.models._types.UserMessage | autogen_core.models._types.AssistantMessage | autogen_core.models._types.FunctionExecutionResultMessage])

Bases: ChatCompletionContext, Component[UnboundedChatCompletionContextConfig]

An unbounded chat completion context that keeps a view of the all the messages.

alias of UnboundedChatCompletionContextConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Get at most buffer_size recent messages.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: ChatCompletionContext, Component[BufferedChatCompletionContextConfig]

A buffered chat completion context that keeps a view of the last n messages, where n is the buffer size. The buffer size is set at initialization.

buffer_size (int) – The size of the buffer.

initial_messages (List[LLMMessage] | None) – The initial messages.

alias of BufferedChatCompletionContextConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Get at most buffer_size recent messages.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: ChatCompletionContext, Component[TokenLimitedChatCompletionContextConfig]

(Experimental) A token based chat completion context maintains a view of the context up to a token limit.

Added in v0.4.10. This is an experimental component and may change in the future.

model_client (ChatCompletionClient) – The model client to use for token counting. The model client must implement the count_tokens() and remaining_tokens() methods.

token_limit (int | None) – The maximum number of tokens to keep in the context using the count_tokens() method. If None, the context will be limited by the model client using the remaining_tokens() method.

tools (List[ToolSchema] | None) – A list of tool schema to use in the context.

initial_messages (List[LLMMessage] | None) – A list of initial messages to include in the context.

alias of TokenLimitedChatCompletionContextConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Get at most token_limit tokens in recent messages. If the token limit is not provided, then return as many messages as the remaining token allowed by the model client.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Bases: ChatCompletionContext, Component[HeadAndTailChatCompletionContextConfig]

A chat completion context that keeps a view of the first n and last m messages, where n is the head size and m is the tail size. The head and tail sizes are set at initialization.

head_size (int) – The size of the head.

tail_size (int) – The size of the tail.

initial_messages (List[LLMMessage] | None) – The initial messages.

alias of HeadAndTailChatCompletionContextConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Get at most head_size recent messages and tail_size oldest messages.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

**Examples:**

Example 1 (python):
```python
from typing import List

from autogen_core.model_context import UnboundedChatCompletionContext
from autogen_core.models import AssistantMessage, LLMMessage


class ReasoningModelContext(UnboundedChatCompletionContext):
    """A model context for reasoning models."""

    async def get_messages(self) -> List[LLMMessage]:
        messages = await super().get_messages()
        # Filter out thought field from AssistantMessage.
        messages_out: List[LLMMessage] = []
        for message in messages:
            if isinstance(message, AssistantMessage):
                message.thought = None
            messages_out.append(message)
        return messages_out
```

Example 2 (python):
```python
from typing import List

from autogen_core.model_context import UnboundedChatCompletionContext
from autogen_core.models import AssistantMessage, LLMMessage


class ReasoningModelContext(UnboundedChatCompletionContext):
    """A model context for reasoning models."""

    async def get_messages(self) -> List[LLMMessage]:
        messages = await super().get_messages()
        # Filter out thought field from AssistantMessage.
        messages_out: List[LLMMessage] = []
        for message in messages:
            if isinstance(message, AssistantMessage):
                message.thought = None
            messages_out.append(message)
        return messages_out
```

Example 3 (json):
```json
{
   "title": "ChatCompletionContextState",
   "type": "object",
   "properties": {
      "messages": {
         "items": {
            "discriminator": {
               "mapping": {
                  "AssistantMessage": "#/$defs/AssistantMessage",
                  "FunctionExecutionResultMessage": "#/$defs/FunctionExecutionResultMessage",
                  "SystemMessage": "#/$defs/SystemMessage",
                  "UserMessage": "#/$defs/UserMessage"
               },
               "propertyName": "type"
            },
            "oneOf": [
               {
                  "$ref": "#/$defs/SystemMessage"
               },
               {
                  "$ref": "#/$defs/UserMessage"
               },
               {
                  "$ref": "#/$defs/AssistantMessage"
               },
               {
                  "$ref": "#/$defs/FunctionExecutionResultMessage"
               }
            ]
         },
         "title": "Messages",
         "type": "array"
      }
   },
   "$defs": {
      "AssistantMessage": {
         "description": "Assistant message are sampled from the language model.",
         "properties": {
            "content": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "items": {
                        "$ref": "#/$defs/FunctionCall"
                     },
                     "type": "array"
                  }
               ],
               "title": "Content"
            },
            "thought": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Thought"
            },
            "source": {
               "title": "Source",
               "type": "string"
            },
            "type": {
               "const": "AssistantMessage",
               "default": "AssistantMessage",
               "title": "Type",
               "type": "string"
            }
         },
         "required": [
            "content",
            "source"
         ],
         "title": "AssistantMessage",
         "type": "object"
      },
      "FunctionCall": {
         "properties": {
            "id": {
               "title": "Id",
               "type": "string"
            },
            "arguments": {
               "title": "Arguments",
               "type": "string"
            },
            "name": {
               "title": "Name",
               "type": "string"
            }
         },
         "required": [
            "id",
            "arguments",
            "name"
         ],
         "title": "FunctionCall",
         "type": "object"
      },
      "FunctionExecutionResult": {
         "description": "Function execution result contains the output of a function call.",
         "properties": {
            "content": {
               "title": "Content",
               "type": "string"
            },
            "name": {
               "title": "Name",
               "type": "string"
            },
            "call_id": {
               "title": "Call Id",
               "type": "string"
            },
            "is_error": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Is Error"
            }
         },
         "required": [
            "content",
            "name",
            "call_id"
         ],
         "title": "FunctionExecutionResult",
         "type": "object"
      },
      "FunctionExecutionResultMessage": {
         "description": "Function execution result message contains the output of multiple function calls.",
         "properties": {
            "content": {
               "items": {
                  "$ref": "#/$defs/FunctionExecutionResult"
               },
               "title": "Content",
               "type": "array"
            },
            "type": {
               "const": "FunctionExecutionResultMessage",
               "default": "FunctionExecutionResultMessage",
               "title": "Type",
               "type": "string"
            }
         },
         "required": [
            "content"
         ],
         "title": "FunctionExecutionResultMessage",
         "type": "object"
      },
      "SystemMessage": {
         "description": "System message contains instructions for the model coming from the developer.\n\n.. note::\n\n    Open AI is moving away from using 'system' role in favor of 'developer' role.\n    See `Model Spec <https://cdn.openai.com/spec/model-spec-2024-05-08.html#definitions>`_ for more details.\n    However, the 'system' role is still allowed in their API and will be automatically converted to 'developer' role\n    on the server side.\n    So, you can use `SystemMessage` for developer messages.",
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
         ],
         "title": "SystemMessage",
         "type": "object"
      },
      "UserMessage": {
         "description": "User message contains input from end users, or a catch-all for data provided to the model.",
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
         ],
         "title": "UserMessage",
         "type": "object"
      }
   }
}
```

Example 4 (json):
```json
{
   "title": "ChatCompletionContextState",
   "type": "object",
   "properties": {
      "messages": {
         "items": {
            "discriminator": {
               "mapping": {
                  "AssistantMessage": "#/$defs/AssistantMessage",
                  "FunctionExecutionResultMessage": "#/$defs/FunctionExecutionResultMessage",
                  "SystemMessage": "#/$defs/SystemMessage",
                  "UserMessage": "#/$defs/UserMessage"
               },
               "propertyName": "type"
            },
            "oneOf": [
               {
                  "$ref": "#/$defs/SystemMessage"
               },
               {
                  "$ref": "#/$defs/UserMessage"
               },
               {
                  "$ref": "#/$defs/AssistantMessage"
               },
               {
                  "$ref": "#/$defs/FunctionExecutionResultMessage"
               }
            ]
         },
         "title": "Messages",
         "type": "array"
      }
   },
   "$defs": {
      "AssistantMessage": {
         "description": "Assistant message are sampled from the language model.",
         "properties": {
            "content": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "items": {
                        "$ref": "#/$defs/FunctionCall"
                     },
                     "type": "array"
                  }
               ],
               "title": "Content"
            },
            "thought": {
               "anyOf": [
                  {
                     "type": "string"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Thought"
            },
            "source": {
               "title": "Source",
               "type": "string"
            },
            "type": {
               "const": "AssistantMessage",
               "default": "AssistantMessage",
               "title": "Type",
               "type": "string"
            }
         },
         "required": [
            "content",
            "source"
         ],
         "title": "AssistantMessage",
         "type": "object"
      },
      "FunctionCall": {
         "properties": {
            "id": {
               "title": "Id",
               "type": "string"
            },
            "arguments": {
               "title": "Arguments",
               "type": "string"
            },
            "name": {
               "title": "Name",
               "type": "string"
            }
         },
         "required": [
            "id",
            "arguments",
            "name"
         ],
         "title": "FunctionCall",
         "type": "object"
      },
      "FunctionExecutionResult": {
         "description": "Function execution result contains the output of a function call.",
         "properties": {
            "content": {
               "title": "Content",
               "type": "string"
            },
            "name": {
               "title": "Name",
               "type": "string"
            },
            "call_id": {
               "title": "Call Id",
               "type": "string"
            },
            "is_error": {
               "anyOf": [
                  {
                     "type": "boolean"
                  },
                  {
                     "type": "null"
                  }
               ],
               "default": null,
               "title": "Is Error"
            }
         },
         "required": [
            "content",
            "name",
            "call_id"
         ],
         "title": "FunctionExecutionResult",
         "type": "object"
      },
      "FunctionExecutionResultMessage": {
         "description": "Function execution result message contains the output of multiple function calls.",
         "properties": {
            "content": {
               "items": {
                  "$ref": "#/$defs/FunctionExecutionResult"
               },
               "title": "Content",
               "type": "array"
            },
            "type": {
               "const": "FunctionExecutionResultMessage",
               "default": "FunctionExecutionResultMessage",
               "title": "Type",
               "type": "string"
            }
         },
         "required": [
            "content"
         ],
         "title": "FunctionExecutionResultMessage",
         "type": "object"
      },
      "SystemMessage": {
         "description": "System message contains instructions for the model coming from the developer.\n\n.. note::\n\n    Open AI is moving away from using 'system' role in favor of 'developer' role.\n    See `Model Spec <https://cdn.openai.com/spec/model-spec-2024-05-08.html#definitions>`_ for more details.\n    However, the 'system' role is still allowed in their API and will be automatically converted to 'developer' role\n    on the server side.\n    So, you can use `SystemMessage` for developer messages.",
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
         ],
         "title": "SystemMessage",
         "type": "object"
      },
      "UserMessage": {
         "description": "User message contains input from end users, or a catch-all for data provided to the model.",
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
         ],
         "title": "UserMessage",
         "type": "object"
      }
   }
}
```

---

## autogen_core.tool_agent — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.tool_agent.html

**Contents:**
- autogen_core.tool_agent#

A tool agent accepts direct messages of the type FunctionCall, executes the requested tool with the provided arguments, and returns the result as FunctionExecutionResult messages.

description (str) – The description of the agent.

tools (List[Tool]) – The list of tools that the agent can execute.

Handles a FunctionCall message by executing the requested tool with the provided arguments.

message (FunctionCall) – The function call message.

cancellation_token (CancellationToken) – The cancellation token.

FunctionExecutionResult – The result of the function execution.

ToolNotFoundException – If the tool is not found.

InvalidToolArgumentsException – If the tool arguments are invalid.

ToolExecutionException – If the tool execution fails.

Start a caller loop for a tool agent. This function sends messages to the tool agent and the model client in an alternating fashion until the model client stops generating tool calls.

tool_agent_id (AgentId) – The Agent ID of the tool agent.

input_messages (List[LLMMessage]) – The list of input messages.

model_client (ChatCompletionClient) – The model client to use for the model API.

tool_schema (List[Tool | ToolSchema]) – The list of tools that the model can use.

List[LLMMessage] – The list of output messages created in the caller loop.

---

## autogen_core — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_core.html

**Contents:**
- autogen_core#

Metadata of the agent.

Function used to bind an Agent instance to an AgentRuntime.

agent_id (AgentId) – ID of the agent.

runtime (AgentRuntime) – AgentRuntime instance to bind the agent to.

Message handler for the agent. This should only be called by the runtime, not by other agents.

message (Any) – Received message. Type is one of the types in subscriptions.

ctx (MessageContext) – Context of the message.

Any – Response to the message. Can be None.

CancelledError – If the message was cancelled.

CantHandleException – If the agent cannot handle the message.

Save the state of the agent. The result must be JSON serializable.

Load in the state of the agent obtained from save_state.

state (Mapping[str, Any]) – State of the agent. Must be JSON serializable.

Called when the runtime is closed

Agent ID uniquely identifies an agent instance within an agent runtime - including distributed runtime. It is the ‘address’ of the agent instance for receiving messages.

See here for more information: Agent Identity and Lifecycle

Convert a string of the format type/key into an AgentId

An identifier that associates an agent with a specific factory function.

Strings may only be composed of alphanumeric letters (a-z) and (0-9), or underscores (_).

Agent instance identifier.

Strings may only be composed of alphanumeric letters (a-z) and (0-9), or underscores (_).

A helper class that allows you to use an AgentId in place of its associated Agent

Target agent for this proxy

Metadata of the agent.

Save the state of the agent. The result must be JSON serializable.

Load in the state of the agent obtained from save_state.

state (Mapping[str, Any]) – State of the agent. Must be JSON serializable.

Send a message to an agent and get a response.

message (Any) – The message to send.

recipient (AgentId) – The agent to send the message to.

sender (AgentId | None, optional) – Agent which sent the message. Should only be None if this was sent from no agent, such as directly to the runtime externally. Defaults to None.

cancellation_token (CancellationToken | None, optional) – Token used to cancel an in progress . Defaults to None.

CantHandleException – If the recipient cannot handle the message.

UndeliverableException – If the message cannot be delivered.

Other – Any other exception raised by the recipient.

Any – The response from the agent.

Publish a message to all agents in the given namespace, or if no namespace is provided, the namespace of the sender.

No responses are expected from publishing.

message (Any) – The message to publish.

topic_id (TopicId) – The topic to publish the message to.

sender (AgentId | None, optional) – The agent which sent the message. Defaults to None.

cancellation_token (CancellationToken | None, optional) – Token used to cancel an in progress. Defaults to None.

message_id (str | None, optional) – The message id. If None, a new message id will be generated. Defaults to None. This message id must be unique. and is recommended to be a UUID.

UndeliverableException – If the message cannot be delivered.

Register an agent factory with the runtime associated with a specific type. The type must be unique. This API does not add any subscriptions.

This is a low level API and usually the agent class’s register method should be used instead, as this also handles subscriptions automatically.

type (str) – The type of agent this factory creates. It is not the same as agent class name. The type parameter is used to differentiate between different factory functions rather than agent classes.

agent_factory (Callable[[], T]) – The factory that creates the agent, where T is a concrete Agent type. Inside the factory, use autogen_core.AgentInstantiationContext to access variables like the current runtime and agent ID.

expected_class (type[T] | None, optional) – The expected class of the agent, used for runtime validation of the factory. Defaults to None. If None, no validation is performed.

Register an agent instance with the runtime. The type may be reused, but each agent_id must be unique. All agent instances within a type must be of the same object type. This API does not add any subscriptions.

This is a low level API and usually the agent class’s register_instance method should be used instead, as this also handles subscriptions automatically.

agent_instance (Agent) – A concrete instance of the agent.

agent_id (AgentId) – The agent’s identifier. The agent’s type is agent_id.type.

Try to get the underlying agent instance by name and namespace. This is generally discouraged (hence the long name), but can be useful in some cases.

If the underlying agent is not accessible, this will raise an exception.

id (AgentId) – The agent id.

type (Type[T], optional) – The expected type of the agent. Defaults to Agent.

T – The concrete agent instance.

LookupError – If the agent is not found.

NotAccessibleError – If the agent is not accessible, for example if it is located remotely.

TypeError – If the agent is not of the expected type.

Save the state of the entire runtime, including all hosted agents. The only way to restore the state is to pass it to load_state().

The structure of the state is implementation defined and can be any JSON serializable object.

Mapping[str, Any] – The saved state.

Load the state of the entire runtime, including all hosted agents. The state should be the same as the one returned by save_state().

state (Mapping[str, Any]) – The saved state.

Get the metadata for an agent.

agent (AgentId) – The agent id.

AgentMetadata – The agent metadata.

Save the state of a single agent.

The structure of the state is implementation defined and can be any JSON serializable object.

agent (AgentId) – The agent id.

Mapping[str, Any] – The saved state.

Load the state of a single agent.

agent (AgentId) – The agent id.

state (Mapping[str, Any]) – The saved state.

Add a new subscription that the runtime should fulfill when processing published messages

subscription (Subscription) – The subscription to add

Remove a subscription from the runtime

id (str) – id of the subscription to remove

LookupError – If the subscription does not exist

Add a new message serialization serializer to the runtime

Note: This will deduplicate serializers based on the type_name and data_content_type properties

serializer (MessageSerializer[Any] | Sequence[MessageSerializer[Any]]) – The serializer/s to add

Metadata of the agent.

Function used to bind an Agent instance to an AgentRuntime.

agent_id (AgentId) – ID of the agent.

runtime (AgentRuntime) – AgentRuntime instance to bind the agent to.

Message handler for the agent. This should only be called by the runtime, not by other agents.

message (Any) – Received message. Type is one of the types in subscriptions.

ctx (MessageContext) – Context of the message.

Any – Response to the message. Can be None.

CancelledError – If the message was cancelled.

CantHandleException – If the agent cannot handle the message.

See autogen_core.AgentRuntime.send_message() for more information.

Save the state of the agent. The result must be JSON serializable.

Load in the state of the agent obtained from save_state.

state (Mapping[str, Any]) – State of the agent. Must be JSON serializable.

Called when the runtime is closed

This function is similar to register but is used for registering an instance of an agent. A subscription based on the agent ID is created and added to the runtime.

Register a virtual subclass of an ABC.

Returns the subclass, to allow usage as a class decorator.

Bases: ABC, Generic[T], ComponentBase[BaseModel]

This protocol defines the basic interface for store/cache operations.

Sub-classes should handle the lifecycle of underlying storage.

The logical type of the component.

Retrieve an item from the store.

key – The key identifying the item in the store.

default (optional) – The default value to return if the key is not found. Defaults to None.

The value associated with the key if found, else the default value.

Set an item in the store.

key – The key under which the item is to be stored.

value – The value to be stored in the store.

Bases: CacheStore[T], Component[InMemoryStoreConfig]

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

alias of InMemoryStoreConfig

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

A token used to cancel pending async calls

Cancel pending async calls linked to this cancellation token.

Check if the CancellationToken has been used

Attach a callback that will be called when cancel is invoked

Link a pending async call to a token to allow its cancellation

A static class that provides context for agent instantiation.

This static class can be used to access the current runtime and agent ID during agent instantiation – inside the factory function or the agent’s class constructor.

Get the current runtime and agent ID inside the factory function and the agent’s constructor:

TopicId defines the scope of a broadcast message. In essence, agent runtime implements a publish-subscribe model through its broadcast API: when publishing a message, the topic must be specified.

See here for more information: Topic

Type of the event that this topic_id contains. Adhere’s to the cloud event spec.

Must match the pattern: ^[w-.:=]+Z

Learn more here: cloudevents/spec

Identifies the context in which an event happened. Adhere’s to the cloud event spec.

Learn more here: cloudevents/spec

Convert a string of the format type/source into a TopicId

Subscriptions define the topics that an agent is interested in.

Get the ID of the subscription.

Implementations should return a unique ID for the subscription. Usually this is a UUID.

str – ID of the subscription.

Check if a given topic_id matches the subscription.

topic_id (TopicId) – TopicId to check.

bool – True if the topic_id matches the subscription, False otherwise.

Map a topic_id to an agent. Should only be called if is_match returns True for the given topic_id.

topic_id (TopicId) – TopicId to map.

AgentId – ID of the agent that should handle the topic_id.

CantHandleException – If the subscription cannot handle the topic_id.

String representation of this agent type.

Loading an image from a URL:

A base class for agents that route messages to handlers based on the type of the message and optional matching functions.

To create a routed agent, subclass this class and add message handlers as methods decorated with either event() or rpc() decorator.

Handle a message by routing it to the appropriate message handler. Do not override this method in subclasses. Instead, add message handlers as methods decorated with either the event() or rpc() decorator.

Called when a message is received that does not have a matching message handler. The default implementation logs an info message.

Bases: BaseAgent, ClosureContext

Metadata of the agent.

Closure agents do not have state. So this method always returns an empty dictionary.

Closure agents do not have state. So this method does nothing.

The closure agent allows you to define an agent using a closure, or function without needing to define a class. It allows values to be extracted out of the runtime.

The closure can define the type of message which is expected, or Any can be used to accept any type of message.

runtime (AgentRuntime) – Runtime to register the agent to

type (str) – Agent type of registered agent

closure (Callable[[ClosureContext, T, MessageContext], Awaitable[Any]]) – Closure to handle messages

unknown_type_policy (Literal["error", "warn", "ignore"], optional) – What to do if a type is encountered that does not match the closure type. Defaults to “warn”.

skip_direct_message_subscription (bool, optional) – Do not add direct message subscription for this agent. Defaults to False.

description (str, optional) – Description of what agent does. Defaults to “”.

subscriptions (Callable[[], list[Subscription] | Awaitable[list[Subscription]]] | None, optional) – List of subscriptions for this closure agent. Defaults to None.

AgentType – Type of the agent that was registered

Decorator for generic message handlers.

Add this decorator to methods in a RoutedAgent class that are intended to handle both event and RPC messages. These methods must have a specific signature that needs to be followed for it to be valid:

The method must be an async method.

The method must be decorated with the @message_handler decorator.

message: The message to be handled, this must be type-hinted with the message type that it is intended to handle.

ctx: A autogen_core.MessageContext object.

The method must be type hinted with what message types it can return as a response, or it can return None if it does not return anything.

Handlers can handle more than one message type by accepting a Union of the message types. It can also return more than one message type by returning a Union of the message types.

func – The function to be decorated.

strict – If True, the handler will raise an exception if the message type or return type is not in the target types. If False, it will log a warning instead.

match – A function that takes the message and the context as arguments and returns a boolean. This is used for secondary routing after the message type. For handlers addressing the same message type, the match function is applied in alphabetical order of the handlers and the first matching handler will be called while the rest are skipped. If None, the first handler in alphabetical order matching the same message type will be called.

Decorator for event message handlers.

Add this decorator to methods in a RoutedAgent class that are intended to handle event messages. These methods must have a specific signature that needs to be followed for it to be valid:

The method must be an async method.

The method must be decorated with the @message_handler decorator.

message: The event message to be handled, this must be type-hinted with the message type that it is intended to handle.

ctx: A autogen_core.MessageContext object.

The method must return None.

Handlers can handle more than one message type by accepting a Union of the message types.

func – The function to be decorated.

strict – If True, the handler will raise an exception if the message type is not in the target types. If False, it will log a warning instead.

match – A function that takes the message and the context as arguments and returns a boolean. This is used for secondary routing after the message type. For handlers addressing the same message type, the match function is applied in alphabetical order of the handlers and the first matching handler will be called while the rest are skipped. If None, the first handler in alphabetical order matching the same message type will be called.

Decorator for RPC message handlers.

Add this decorator to methods in a RoutedAgent class that are intended to handle RPC messages. These methods must have a specific signature that needs to be followed for it to be valid:

The method must be an async method.

The method must be decorated with the @message_handler decorator.

message: The message to be handled, this must be type-hinted with the message type that it is intended to handle.

ctx: A autogen_core.MessageContext object.

The method must be type hinted with what message types it can return as a response, or it can return None if it does not return anything.

Handlers can handle more than one message type by accepting a Union of the message types. It can also return more than one message type by returning a Union of the message types.

func – The function to be decorated.

strict – If True, the handler will raise an exception if the message type or return type is not in the target types. If False, it will log a warning instead.

match – A function that takes the message and the context as arguments and returns a boolean. This is used for secondary routing after the message type. For handlers addressing the same message type, the match function is applied in alphabetical order of the handlers and the first matching handler will be called while the rest are skipped. If None, the first handler in alphabetical order matching the same message type will be called.

This subscription matches on topics based on the type and maps to agents using the source of the topic as the agent key.

This subscription causes each source to have its own agent instance.

A topic_id with type t1 and source s1 will be handled by an agent of type a1 with key s1

A topic_id with type t1 and source s2 will be handled by an agent of type a1 with key s2.

topic_type (str) – Topic type to match against

agent_type (str) – Agent type to handle this subscription

Get the ID of the subscription.

Implementations should return a unique ID for the subscription. Usually this is a UUID.

str – ID of the subscription.

Check if a given topic_id matches the subscription.

topic_id (TopicId) – TopicId to check.

bool – True if the topic_id matches the subscription, False otherwise.

Map a topic_id to an agent. Should only be called if is_match returns True for the given topic_id.

topic_id (TopicId) – TopicId to map.

AgentId – ID of the agent that should handle the topic_id.

CantHandleException – If the subscription cannot handle the topic_id.

Bases: TypeSubscription

The default subscription is designed to be a sensible default for applications that only need global scope for agents.

This topic by default uses the “default” topic type and attempts to detect the agent type to use based on the instantiation context.

topic_type (str, optional) – The topic type to subscribe to. Defaults to “default”.

agent_type (str, optional) – The agent type to use for the subscription. Defaults to None, in which case it will attempt to detect the agent type based on the instantiation context.

DefaultTopicId provides a sensible default for the topic_id and source fields of a TopicId.

If created in the context of a message handler, the source will be set to the agent_id of the message handler, otherwise it will be set to “default”.

type (str, optional) – Topic type to publish message to. Defaults to “default”.

source (str | None, optional) – Topic source to publish message to. If None, the source will be set to the agent_id of the message handler if in the context of a message handler, otherwise it will be set to “default”. Defaults to None.

This subscription matches on topics based on a prefix of the type and maps to agents using the source of the topic as the agent key.

This subscription causes each source to have its own agent instance.

A topic_id with type t1 and source s1 will be handled by an agent of type a1 with key s1

A topic_id with type t1 and source s2 will be handled by an agent of type a1 with key s2.

A topic_id with type t1SUFFIX and source s2 will be handled by an agent of type a1 with key s2.

topic_type_prefix (str) – Topic type prefix to match against

agent_type (str) – Agent type to handle this subscription

Get the ID of the subscription.

Implementations should return a unique ID for the subscription. Usually this is a UUID.

str – ID of the subscription.

Check if a given topic_id matches the subscription.

topic_id (TopicId) – TopicId to check.

bool – True if the topic_id matches the subscription, False otherwise.

Map a topic_id to an agent. Should only be called if is_match returns True for the given topic_id.

topic_id (TopicId) – TopicId to map.

AgentId – ID of the agent that should handle the topic_id.

CantHandleException – If the subscription cannot handle the topic_id.

The content type for JSON data.

The content type for Protobuf data.

A single-threaded agent runtime that processes all messages using a single asyncio queue. Messages are delivered in the order they are received, and the runtime processes each message in a separate asyncio task concurrently.

This runtime is suitable for development and standalone applications. It is not suitable for high-throughput or high-concurrency scenarios.

intervention_handlers (List[InterventionHandler], optional) – A list of intervention handlers that can intercept messages before they are sent or published. Defaults to None.

tracer_provider (TracerProvider, optional) – The tracer provider to use for tracing. Defaults to None. Additionally, you can set environment variable AUTOGEN_DISABLE_RUNTIME_TRACING to true to disable the agent runtime telemetry if you don’t have access to the runtime constructor. For example, if you are using ComponentConfig.

ignore_unhandled_exceptions (bool, optional) – Whether to ignore unhandled exceptions in that occur in agent event handlers. Any background exceptions will be raised on the next call to process_next or from an awaited stop, stop_when_idle or stop_when. Note, this does not apply to RPC handlers. Defaults to True.

A simple example of creating a runtime, registering an agent, sending a message and stopping the runtime:

An example of creating a runtime, registering an agent, publishing a message and stopping the runtime:

Send a message to an agent and get a response.

message (Any) – The message to send.

recipient (AgentId) – The agent to send the message to.

sender (AgentId | None, optional) – Agent which sent the message. Should only be None if this was sent from no agent, such as directly to the runtime externally. Defaults to None.

cancellation_token (CancellationToken | None, optional) – Token used to cancel an in progress . Defaults to None.

CantHandleException – If the recipient cannot handle the message.

UndeliverableException – If the message cannot be delivered.

Other – Any other exception raised by the recipient.

Any – The response from the agent.

Publish a message to all agents in the given namespace, or if no namespace is provided, the namespace of the sender.

No responses are expected from publishing.

message (Any) – The message to publish.

topic_id (TopicId) – The topic to publish the message to.

sender (AgentId | None, optional) – The agent which sent the message. Defaults to None.

cancellation_token (CancellationToken | None, optional) – Token used to cancel an in progress. Defaults to None.

message_id (str | None, optional) – The message id. If None, a new message id will be generated. Defaults to None. This message id must be unique. and is recommended to be a UUID.

UndeliverableException – If the message cannot be delivered.

Save the state of all instantiated agents.

This method calls the save_state() method on each agent and returns a dictionary mapping agent IDs to their state.

This method does not currently save the subscription state. We will add this in the future.

A dictionary mapping agent IDs to their state.

Load the state of all instantiated agents.

This method calls the load_state() method on each agent with the state provided in the dictionary. The keys of the dictionary are the agent IDs, and the values are the state dictionaries returned by the save_state() method.

This method does not currently load the subscription state. We will add this in the future.

Process the next message in the queue.

If there is an unhandled exception in the background task, it will be raised here. process_next cannot be called again after an unhandled exception is raised.

Start the runtime message processing loop. This runs in a background task.

Calls stop() if applicable and the Agent.close() method on all instantiated agents

Immediately stop the runtime message processing loop. The currently processing message will be completed, but all others following it will be discarded.

Stop the runtime message processing loop when there is no outstanding message being processed or queued. This is the most common way to stop the runtime.

Stop the runtime message processing loop when the condition is met.

This method is not recommended to be used, and is here for legacy reasons. It will spawn a busy loop to continually check the condition. It is much more efficient to call stop_when_idle or stop instead. If you need to stop the runtime based on a condition, consider using a background task and asyncio.Event to signal when the condition is met and the background task should call stop.

Get the metadata for an agent.

agent (AgentId) – The agent id.

AgentMetadata – The agent metadata.

Save the state of a single agent.

The structure of the state is implementation defined and can be any JSON serializable object.

agent (AgentId) – The agent id.

Mapping[str, Any] – The saved state.

Load the state of a single agent.

agent (AgentId) – The agent id.

state (Mapping[str, Any]) – The saved state.

Register an agent factory with the runtime associated with a specific type. The type must be unique. This API does not add any subscriptions.

This is a low level API and usually the agent class’s register method should be used instead, as this also handles subscriptions automatically.

type (str) – The type of agent this factory creates. It is not the same as agent class name. The type parameter is used to differentiate between different factory functions rather than agent classes.

agent_factory (Callable[[], T]) – The factory that creates the agent, where T is a concrete Agent type. Inside the factory, use autogen_core.AgentInstantiationContext to access variables like the current runtime and agent ID.

expected_class (type[T] | None, optional) – The expected class of the agent, used for runtime validation of the factory. Defaults to None. If None, no validation is performed.

Register an agent instance with the runtime. The type may be reused, but each agent_id must be unique. All agent instances within a type must be of the same object type. This API does not add any subscriptions.

This is a low level API and usually the agent class’s register_instance method should be used instead, as this also handles subscriptions automatically.

agent_instance (Agent) – A concrete instance of the agent.

agent_id (AgentId) – The agent’s identifier. The agent’s type is agent_id.type.

Try to get the underlying agent instance by name and namespace. This is generally discouraged (hence the long name), but can be useful in some cases.

If the underlying agent is not accessible, this will raise an exception.

id (AgentId) – The agent id.

type (Type[T], optional) – The expected type of the agent. Defaults to Agent.

T – The concrete agent instance.

LookupError – If the agent is not found.

NotAccessibleError – If the agent is not accessible, for example if it is located remotely.

TypeError – If the agent is not of the expected type.

Add a new subscription that the runtime should fulfill when processing published messages

subscription (Subscription) – The subscription to add

Remove a subscription from the runtime

id (str) – id of the subscription to remove

LookupError – If the subscription does not exist

Add a new message serialization serializer to the runtime

Note: This will deduplicate serializers based on the type_name and data_content_type properties

serializer (MessageSerializer[Any] | Sequence[MessageSerializer[Any]]) – The serializer/s to add

The name of the root logger.

The name of the logger used for structured events.

Logger name used for developer intended trace logging. The content and format of this log should not be depended upon.

Bases: ComponentFromConfig[ConfigT], ComponentSchemaType[ConfigT], Generic[ConfigT]

To create a component class, inherit from this class for the concrete class and ComponentBase on the interface. Then implement two class variables:

component_config_schema - A Pydantic model class which represents the configuration of the component. This is also the type parameter of Component.

component_type - What is the logical type of the component.

Bases: ComponentToConfig[ConfigT], ComponentLoader, Generic[ConfigT]

Bases: Generic[FromConfigT]

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

Create a new instance of the component from a previous version of the configuration object.

This is only called when the version of the configuration object is less than the current version, since in this case the schema is not known.

config (Dict[str, Any]) – The configuration object.

version (int) – The version of the configuration object.

Self – The new instance of the component.

Load a component from a model. Intended to be used with the return type of autogen_core.ComponentConfig.dump_component().

model (ComponentModel) – The model to load the component from.

model – _description_

expected (Type[ExpectedType] | None, optional) – Explicit type only if used directly on ComponentLoader. Defaults to None.

Self – The loaded component.

ValueError – If the provider string is invalid.

TypeError – Provider is not a subclass of ComponentConfigImpl, or the expected type does not match.

Self | ExpectedType – The loaded component.

Model class for a component. Contains all information required to instantiate a component.

Show JSON schema{ "title": "ComponentModel", "description": "Model class for a component. Contains all information required to instantiate a component.", "type": "object", "properties": { "provider": { "title": "Provider", "type": "string" }, "component_type": { "anyOf": [ { "enum": [ "model", "agent", "tool", "termination", "token_provider", "workbench" ], "type": "string" }, { "type": "string" }, { "type": "null" } ], "default": null, "title": "Component Type" }, "version": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Version" }, "component_version": { "anyOf": [ { "type": "integer" }, { "type": "null" } ], "default": null, "title": "Component Version" }, "description": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Description" }, "label": { "anyOf": [ { "type": "string" }, { "type": "null" } ], "default": null, "title": "Label" }, "config": { "title": "Config", "type": "object" } }, "required": [ "provider", "config" ] }

component_type (Literal['model', 'agent', 'tool', 'termination', 'token_provider', 'workbench'] | str | None)

component_version (int | None)

config (dict[str, Any])

description (str | None)

Describes how the component can be instantiated.

Logical type of the component. If missing, the component assumes the default type of the provider.

Version of the component specification. If missing, the component assumes whatever is the current version of the library used to load it. This is obviously dangerous and should be used for user authored ephmeral config. For all other configs version should be specified.

Version of the component. If missing, the component assumes the default version of the provider.

Description of the component.

Human readable label for the component. If missing the component assumes the class name of the provider.

The schema validated config field is passed to a given class’s implmentation of autogen_core.ComponentConfigImpl._from_config() to create a new instance of the component class.

Bases: Generic[ConfigT]

The Pydantic model class which represents the configuration of the component.

Bases: Generic[ToConfigT]

The two methods a class must implement to be a component.

Protocol (ConfigT) – Type which derives from pydantic.BaseModel.

The logical type of the component.

The version of the component, if schema incompatibilities are introduced this should be updated.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

A description of the component. If not provided, the docstring of the class will be used.

A human readable label for the component. If not provided, the component class name will be used.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Dump the component to a model that can be loaded back in.

TypeError – If the component is a local class.

ComponentModel – The model representing the component.

Marker type for signalling that a message should be dropped by an intervention handler. The type itself should be returned from the handler.

An intervention handler is a class that can be used to modify, log or drop messages that are being processed by the autogen_core.base.AgentRuntime.

The handler is called when the message is submitted to the runtime.

Currently the only runtime which supports this is the autogen_core.base.SingleThreadedAgentRuntime.

Note: Returning None from any of the intervention handler methods will result in a warning being issued and treated as “no change”. If you intend to drop a message, you should return DropMessage explicitly.

Called when a message is submitted to the AgentRuntime using autogen_core.base.AgentRuntime.send_message().

Called when a message is published to the AgentRuntime using autogen_core.base.AgentRuntime.publish_message().

Called when a response is received by the AgentRuntime from an Agent’s message handler returning a value.

Bases: InterventionHandler

Simple class that provides a default implementation for all intervention handler methods, that simply returns the message unchanged. Allows for easy subclassing to override only the desired methods.

Called when a message is submitted to the AgentRuntime using autogen_core.base.AgentRuntime.send_message().

Called when a message is published to the AgentRuntime using autogen_core.base.AgentRuntime.publish_message().

Called when a response is received by the AgentRuntime from an Agent’s message handler returning a value.

Context manager to create a span for agent creation following the OpenTelemetry Semantic conventions for generative AI systems.

See the GenAI semantic conventions documentation: OpenTelemetry GenAI Semantic Conventions

The GenAI Semantic Conventions are still in incubation and subject to changes in future releases.

agent_name (str) – The name of the agent being created.

tracer (Optional[trace.Tracer]) – The tracer to use for creating the span.

parent (Optional[Span]) – The parent span to link this span to.

agent_id (Optional[str]) – The unique identifier for the agent.

agent_description (Optional[str]) – A description of the agent.

Context manager to create a span for invoking an agent following the OpenTelemetry Semantic conventions for generative AI systems.

See the GenAI semantic conventions documentation: OpenTelemetry GenAI Semantic Conventions

The GenAI Semantic Conventions are still in incubation and subject to changes in future releases.

agent_name (str) – The name of the agent being invoked.

tracer (Optional[trace.Tracer]) – The tracer to use for creating the span.

parent (Optional[Span]) – The parent span to link this span to.

agent_id (Optional[str]) – The unique identifier for the agent.

agent_description (Optional[str]) – A description of the agent.

Context manager to create a span for tool execution following the OpenTelemetry Semantic conventions for generative AI systems.

See the GenAI semantic conventions documentation: OpenTelemetry GenAI Semantic Conventions

The GenAI Semantic Conventions are still in incubation and subject to changes in future releases.

tool_name (str) – The name of the tool being executed.

tracer (Optional[trace.Tracer]) – The tracer to use for creating the span.

parent (Optional[Span]) – The parent span to link this span to.

tool_description (Optional[str]) – A description of the tool.

tool_call_id (Optional[str]) – A unique identifier for the tool call.

autogen_agentchat.utils

autogen_core.code_executor

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def my_agent_factory():
    return MyAgent()


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    await runtime.register_factory("my_agent", lambda: MyAgent())


import asyncio

asyncio.run(main())
```

Example 2 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def my_agent_factory():
    return MyAgent()


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    await runtime.register_factory("my_agent", lambda: MyAgent())


import asyncio

asyncio.run(main())
```

Example 3 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    agent = MyAgent()
    await runtime.register_agent_instance(
        agent_instance=agent, agent_id=AgentId(type="my_agent", key="default")
    )


import asyncio

asyncio.run(main())
```

Example 4 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    agent = MyAgent()
    await runtime.register_agent_instance(
        agent_instance=agent, agent_id=AgentId(type="my_agent", key="default")
    )


import asyncio

asyncio.run(main())
```

---

## autogen_ext.agents.azure — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.azure.html

**Contents:**
- autogen_ext.agents.azure#

Azure AI Assistant agent for AutoGen.

This agent leverages the Azure AI Assistant API to create AI assistants with capabilities like:

Code interpretation and execution

Grounding with Bing search

File handling and search

Custom function calling

Multi-turn conversations

The agent integrates with AutoGen’s messaging system, providing a seamless way to use Azure AI capabilities within the AutoGen framework. It supports tools like code interpreter, file search, and various grounding mechanisms.

It must start with a letter (A-Z, a-z) or an underscore (_).

It can only contain letters, digits (0-9), or underscores.

It cannot be a Python keyword.

It cannot contain spaces or special characters.

It cannot start with a digit.

Check here on how to create a new secured agent with user-managed identity: https://learn.microsoft.com/en-us/azure/ai-services/agents/how-to/virtual-networks

Use the AzureAIAgent to create an agent grounded with Bing:

Use the AzureAIAgent to create an agent with file search capability:

Use the AzureAIAgent to create an agent with code interpreter capability:

The types of messages that the assistant agent produces.

The description of the agent. This is used by team to make decisions about which agents to use. The description should describe the agent’s capabilities and how to interact with it.

Get the list of tools available to the agent.

List[ToolDefinition] – The list of tool definitions.

Process incoming messages and return a response from the Azure AI agent.

This method is the primary entry point for interaction with the agent. It delegates to on_messages_stream and returns the final response.

messages (Sequence[BaseChatMessage]) – The messages to process

cancellation_token (CancellationToken) – Token for cancellation handling

message_limit (int, optional) – Maximum number of messages to retrieve from the thread

Response – The agent’s response, including the chat message and any inner events

AssertionError – If the stream doesn’t return a final result

Process incoming messages and yield streaming responses from the Azure AI agent.

This method handles the complete interaction flow with the Azure AI agent: 1. Processing input messages 2. Creating and monitoring a run 3. Handling tool calls and their results 4. Retrieving and returning the agent’s final response

The method yields events during processing (like tool calls) and finally yields the complete Response with the agent’s message.

messages (Sequence[BaseChatMessage]) – The messages to process

cancellation_token (CancellationToken) – Token for cancellation handling

message_limit (int, optional) – Maximum number of messages to retrieve from the thread

polling_interval (float, optional) – Time to sleep between polling for run status

AgentEvent | ChatMessage | Response – Events during processing and the final response

ValueError – If the run fails or no message is received from the assistant

Handle a text message by adding it to the conversation thread.

content (str) – The text content of the message

cancellation_token (CancellationToken) – Token for cancellation handling

Reset the agent’s conversation by creating a new thread.

This method allows for resetting a conversation without losing the agent definition or capabilities. It creates a new thread for fresh conversations.

Note: Currently the Azure AI Agent API has no support for deleting messages, so a new thread is created instead.

cancellation_token (CancellationToken) – Token for cancellation handling

Save the current state of the agent for future restoration.

This method serializes the agent’s state including IDs for the agent, thread, messages, and associated resources like vector stores and uploaded files.

Mapping[str, Any] – A dictionary containing the serialized state data

Load a previously saved state into this agent.

This method deserializes and restores a previously saved agent state, setting up the agent to continue a previous conversation or session.

state (Mapping[str, Any]) – The previously saved state dictionary

Upload files to be used with the code interpreter tool.

This method uploads files for the agent’s code interpreter tool and updates the thread’s tool resources to include these files.

file_paths (str | Iterable[str]) – Path(s) to file(s) to upload

cancellation_token (Optional[CancellationToken]) – Token for cancellation handling

polling_interval (float) – Time to sleep between polling for file status

ValueError – If file upload fails or the agent doesn’t have code interpreter capability

Upload files to be used with the file search tool.

This method handles uploading files for the file search capability, creating a vector store if necessary, and updating the agent’s configuration to use the vector store.

file_paths (str | Iterable[str]) – Path(s) to file(s) to upload

cancellation_token (CancellationToken) – Token for cancellation handling

vector_store_name (Optional[str]) – Name to assign to the vector store if creating a new one

data_sources (Optional[List[VectorStoreDataSource]]) – Additional data sources for the vector store

expires_after (Optional[VectorStoreExpirationPolicy]) – Expiration policy for vector store content

chunking_strategy (Optional[VectorStoreChunkingStrategyRequest]) – Strategy for chunking file content

vector_store_metadata (Optional[Dict[str, str]]) – Additional metadata for the vector store

vector_store_polling_interval (float) – Time to sleep between polling for vector store status

ValueError – If file search is not enabled for this agent or file upload fails

Close the Azure AI agent and release any resources.

autogen_ext.agents.file_surfer

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[azure]"  # For Azure AI Foundry Agent Service
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[azure]"  # For Azure AI Foundry Agent Service
```

Example 3 (python):
```python
import asyncio
import os

from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_ext.agents.azure._azure_ai_agent import AzureAIAgent
from azure.ai.projects.aio import AIProjectClient
from azure.identity.aio import DefaultAzureCredential
from azure.ai.agents.models import BingGroundingTool
import dotenv


async def bing_example():
    async with DefaultAzureCredential() as credential:
        async with AIProjectClient(  # type: ignore
            credential=credential, endpoint=os.getenv("AZURE_PROJECT_ENDPOINT", "")
        ) as project_client:
            conn = await project_client.connections.get(name=os.getenv("BING_CONNECTION_NAME", ""))

            bing_tool = BingGroundingTool(conn.id)
            agent_with_bing_grounding = AzureAIAgent(
                name="bing_agent",
                description="An AI assistant with Bing grounding",
                project_client=project_client,
                deployment_name="gpt-4o",
                instructions="You are a helpful assistant.",
                tools=bing_tool.definitions,
                metadata={"source": "AzureAIAgent"},
            )

            # For the bing grounding tool to return the citations, the message must contain an instruction for the model to do return them.
            # For example: "Please provide citations for the answers"

            result = await agent_with_bing_grounding.on_messages(
                messages=[
                    TextMessage(
                        content="What is Microsoft\'s annual leave policy? Provide citations for your answers.",
                        source="user",
                    )
                ],
                cancellation_token=CancellationToken(),
                message_limit=5,
            )
            print(result)


if __name__ == "__main__":
    dotenv.load_dotenv()
    asyncio.run(bing_example())
```

Example 4 (python):
```python
import asyncio
import os

from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_ext.agents.azure._azure_ai_agent import AzureAIAgent
from azure.ai.projects.aio import AIProjectClient
from azure.identity.aio import DefaultAzureCredential
from azure.ai.agents.models import BingGroundingTool
import dotenv


async def bing_example():
    async with DefaultAzureCredential() as credential:
        async with AIProjectClient(  # type: ignore
            credential=credential, endpoint=os.getenv("AZURE_PROJECT_ENDPOINT", "")
        ) as project_client:
            conn = await project_client.connections.get(name=os.getenv("BING_CONNECTION_NAME", ""))

            bing_tool = BingGroundingTool(conn.id)
            agent_with_bing_grounding = AzureAIAgent(
                name="bing_agent",
                description="An AI assistant with Bing grounding",
                project_client=project_client,
                deployment_name="gpt-4o",
                instructions="You are a helpful assistant.",
                tools=bing_tool.definitions,
                metadata={"source": "AzureAIAgent"},
            )

            # For the bing grounding tool to return the citations, the message must contain an instruction for the model to do return them.
            # For example: "Please provide citations for the answers"

            result = await agent_with_bing_grounding.on_messages(
                messages=[
                    TextMessage(
                        content="What is Microsoft\'s annual leave policy? Provide citations for your answers.",
                        source="user",
                    )
                ],
                cancellation_token=CancellationToken(),
                message_limit=5,
            )
            print(result)


if __name__ == "__main__":
    dotenv.load_dotenv()
    asyncio.run(bing_example())
```

---

## autogen_ext.agents.file_surfer — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.file_surfer.html

**Contents:**
- autogen_ext.agents.file_surfer#

Bases: BaseChatAgent, Component[FileSurferConfig]

An agent, used by MagenticOne, that acts as a local file previewer. FileSurfer can open and read a variety of common file types, and can navigate the local file hierarchy.

name (str) – The agent’s name

model_client (ChatCompletionClient) – The model to use (must be tool-use enabled)

description (str) – The agent’s description used by the team. Defaults to DEFAULT_DESCRIPTION

base_path (str) – The base path to use for the file browser. Defaults to the current working directory.

alias of FileSurferConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

The types of messages that the agent produces in the Response.chat_message field. They must be BaseChatMessage types.

Handles incoming messages and returns a response.

Agents are stateful and the messages passed to this method should be the new messages since the last call to this method. The agent should maintain its state between calls to this method. For example, if the agent needs to remember the previous messages to respond to the current message, it should store the previous messages in the agent state.

Resets the agent to its initialization state.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

autogen_ext.agents.azure

autogen_ext.agents.magentic_one

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[file-surfer]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[file-surfer]"
```

---

## autogen_ext.agents.magentic_one — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.magentic_one.html

**Contents:**
- autogen_ext.agents.magentic_one#

Bases: AssistantAgent

An agent, used by MagenticOne that provides coding assistance using an LLM model client.

The prompts and description are sealed, to replicate the original MagenticOne configuration. See AssistantAgent if you wish to modify these values.

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

autogen_ext.agents.file_surfer

autogen_ext.agents.openai

---

## autogen_ext.agents.openai — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.openai.html

**Contents:**
- autogen_ext.agents.openai#

Bases: BaseChatAgent, Component[OpenAIAgentConfig]

An agent implementation that uses the OpenAI Responses API to generate responses.

This agent leverages the Responses API to generate responses with capabilities like:

Multi-turn conversations

Built-in tool support (file_search, code_interpreter, web_search_preview, etc.)

Currently, custom tools are not supported.

Changed in version v0.7.0: Added support for built-in tool types like file_search, web_search_preview, code_interpreter, computer_use_preview, image_generation, and mcp. Added support for tool configurations with required and optional parameters.

Built-in tools are split into two categories:

Tools that can use string format (no required parameters):

web_search_preview: Can be used as “web_search_preview” or with optional config (user_location, search_context_size)

image_generation: Can be used as “image_generation” or with optional config (background, input_image_mask)

local_shell: Can be used as “local_shell” (WARNING: Only works with codex-mini-latest model)

Tools that REQUIRE dict configuration (have required parameters):

file_search: MUST use dict with vector_store_ids (List[str])

computer_use_preview: MUST use dict with display_height (int), display_width (int), environment (str)

code_interpreter: MUST use dict with container (str)

mcp: MUST use dict with server_label (str), server_url (str)

Using required-parameter tools in string format will raise a ValueError with helpful error messages. The tools parameter type annotation only accepts string values for tools that don’t require parameters.

Custom tools (autogen FunctionTool or other user-defined tools) are not supported by this agent. Only OpenAI built-in tools provided via the Responses API are supported.

name (str) – Name of the agent

description (str) – Description of the agent’s purpose

client (Union[AsyncOpenAI, AsyncAzureOpenAI]) – OpenAI client instance

model (str) – Model to use (e.g. “gpt-4.1”)

instructions (str) – System instructions for the agent

tools (Optional[Iterable[Union[str, BuiltinToolConfig]]]) – Tools the agent can use. Supported string values (no required parameters): “web_search_preview”, “image_generation”, “local_shell”. Dict values can provide configuration for built-in tools with parameters. Required parameters for built-in tools: - file_search: vector_store_ids (List[str]) - computer_use_preview: display_height (int), display_width (int), environment (str) - code_interpreter: container (str) - mcp: server_label (str), server_url (str) Optional parameters for built-in tools: - file_search: max_num_results (int), ranking_options (dict), filters (dict) - web_search_preview: user_location (str or dict), search_context_size (int) - image_generation: background (str), input_image_mask (str) - mcp: allowed_tools (List[str]), headers (dict), require_approval (bool) Special tools with model restrictions: - local_shell: Only works with “codex-mini-latest” model (WARNING: Very limited support) Custom tools are not supported.

temperature (Optional[float]) – Temperature for response generation (default: 1)

max_output_tokens (Optional[int]) – Maximum output tokens

json_mode (bool) – Whether to use JSON mode (default: False)

store (bool) – Whether to store conversations (default: True)

truncation (str) – Truncation strategy (default: “disabled”)

Basic usage with built-in tools:

Usage with configured built-in tools:

Custom tools are not supported by OpenAIAgent. Use only built-in tools from the Responses API.

alias of OpenAIAgentConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Return the types of messages that this agent can produce.

Handles incoming messages and returns a response.

Agents are stateful and the messages passed to this method should be the new messages since the last call to this method. The agent should maintain its state between calls to this method. For example, if the agent needs to remember the previous messages to respond to the current message, it should store the previous messages in the agent state.

Handles incoming messages and returns a stream of messages and and the final item is the response. The base implementation in BaseChatAgent simply calls on_messages() and yields the messages in the response.

Agents are stateful and the messages passed to this method should be the new messages since the last call to this method. The agent should maintain its state between calls to this method. For example, if the agent needs to remember the previous messages to respond to the current message, it should store the previous messages in the agent state.

Resets the agent to its initialization state.

Export state. Default implementation for stateless agents.

Restore agent from saved state. Default implementation for stateless agents.

Public wrapper for the private _to_config method.

Public wrapper for the private _from_config classmethod.

Public access to the agent’s tools.

Public access to the agent’s model.

An agent implementation that uses the Assistant API to generate responses.

This agent leverages the Assistant API to create AI assistants with capabilities like:

Code interpretation and execution

File handling and search

Custom function calling

Multi-turn conversations

The agent maintains a thread of conversation and can use various tools including

Code interpreter: For executing code and working with files

File search: For searching through uploaded documents

Custom functions: For extending capabilities with user-defined tools

Supports multiple file formats including code, documents, images

Can handle up to 128 tools per assistant

Maintains conversation context in threads

Supports file uploads for code interpreter and search

Vector store integration for efficient file search

Automatic file parsing and embedding

You can use an existing thread or assistant by providing the thread_id or assistant_id parameters.

Use the assistant to analyze data in a CSV file:

Use Azure OpenAI Assistant with AAD authentication:

name (str) – Name of the assistant

description (str) – Description of the assistant’s purpose

client (AsyncOpenAI | AsyncAzureOpenAI) – OpenAI client or Azure OpenAI client instance

model (str) – Model to use (e.g. “gpt-4”)

instructions (str) – System instructions for the assistant

tools (Optional[Iterable[Union[Literal["code_interpreter", "file_search"], Tool | Callable[..., Any] | Callable[..., Awaitable[Any]]]]]) – Tools the assistant can use

assistant_id (Optional[str]) – ID of existing assistant to use

thread_id (Optional[str]) – ID of existing thread to use

metadata (Optional[Dict[str, str]]) – Additional metadata for the assistant.

response_format (Optional[AssistantResponseFormatOptionParam]) – Response format settings

temperature (Optional[float]) – Temperature for response generation

tool_resources (Optional[ToolResources]) – Additional tool configuration

top_p (Optional[float]) – Top p sampling parameter

The types of messages that the assistant agent produces.

Handle incoming messages and return a response.

Handle incoming messages and return a response.

Handle regular text messages by adding them to the thread.

Handle reset command by deleting new messages and runs since initialization.

Handle file uploads for the code interpreter.

Handle file uploads for file search.

Delete all files that were uploaded by this agent instance.

Delete the assistant if it was created by this instance.

Delete the vector store if it was created by this instance.

Export state. Default implementation for stateless agents.

Restore agent from saved state. Default implementation for stateless agents.

autogen_ext.agents.magentic_one

autogen_ext.agents.video_surfer

**Examples:**

Example 1 (markdown):
```markdown
pip install "autogen-ext[openai]"
# pip install "autogen-ext[openai,azure]"  # For Azure OpenAI Assistant
```

Example 2 (markdown):
```markdown
pip install "autogen-ext[openai]"
# pip install "autogen-ext[openai,azure]"  # For Azure OpenAI Assistant
```

Example 3 (python):
```python
import asyncio

from autogen_agentchat.ui import Console
from autogen_ext.agents.openai import OpenAIAgent
from openai import AsyncOpenAI


async def example():
    client = AsyncOpenAI()
    agent = OpenAIAgent(
        name="SimpleAgent",
        description="A simple OpenAI agent using the Responses API",
        client=client,
        model="gpt-4.1",
        instructions="You are a helpful assistant.",
        tools=["web_search_preview"],  # Only tools without required params
    )
    await Console(agent.run_stream(task="Search for recent AI developments"))


asyncio.run(example())
```

Example 4 (python):
```python
import asyncio

from autogen_agentchat.ui import Console
from autogen_ext.agents.openai import OpenAIAgent
from openai import AsyncOpenAI


async def example():
    client = AsyncOpenAI()
    agent = OpenAIAgent(
        name="SimpleAgent",
        description="A simple OpenAI agent using the Responses API",
        client=client,
        model="gpt-4.1",
        instructions="You are a helpful assistant.",
        tools=["web_search_preview"],  # Only tools without required params
    )
    await Console(agent.run_stream(task="Search for recent AI developments"))


asyncio.run(example())
```

---

## autogen_ext.agents.video_surfer.tools — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.video_surfer.tools.html

**Contents:**
- autogen_ext.agents.video_surfer.tools#

Extracts audio from a video file and saves it as an MP3 file.

video_path – Path to the video file.

audio_output_path – Path to save the extracted audio file.

Confirmation message with the path to the saved audio file.

Transcribes the audio file with timestamps using the Whisper model.

audio_path – Path to the audio file.

Transcription with timestamps.

Returns the length of the video in seconds.

video_path – Path to the video file.

Duration of the video in seconds.

Captures a screenshot at the specified timestamp and saves it to the output path.

video_path – Path to the video file.

timestamp – Timestamp in seconds.

output_path – Path to save the screenshot. The file format is determined by the extension in the path.

Transcribes the content of a video screenshot captured at the specified timestamp using OpenAI API.

video_path – Path to the video file.

timestamp – Timestamp in seconds.

model_client – ChatCompletionClient instance.

Description of the screenshot content.

Captures screenshots at the specified timestamps and returns them as Python objects.

video_path – Path to the video file.

timestamps – List of timestamps in seconds.

List of tuples containing timestamp and the corresponding frame (image). Each frame is a NumPy array (height x width x channels).

autogen_ext.tools.semantic_kernel

autogen_ext.agents.web_surfer.playwright_controller

---

## autogen_ext.agents.video_surfer — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.video_surfer.html

**Contents:**
- autogen_ext.agents.video_surfer#

Bases: AssistantAgent

VideoSurfer is a specialized agent designed to answer questions about a local video file.

This agent utilizes various tools to extract information from the video, such as its length, screenshots at specific timestamps, and audio transcriptions. It processes these elements to provide detailed answers to user queries.

transcribe_audio_with_timestamps()

transcribe_video_screenshot()

name (str) – The name of the agent.

model_client (ChatCompletionClient) – The model client used for generating responses.

tools (List[BaseTool[BaseModel, BaseModel] | Callable[..., Any] | Callable[..., Awaitable[Any]]] | None, optional) – A list of tools or functions the agent can use. If not provided, defaults to all video tools from the action space.

description (str, optional) – A brief description of the agent. Defaults to “An agent that can answer questions about a local video.”.

system_message (str | None, optional) – The system message guiding the agent’s behavior. Defaults to a predefined message.

The following example demonstrates how to create an video surfing agent with a model client and generate a response to a simple query about a local video called video.mp4.

The following example demonstrates how to create and use a VideoSurfer and UserProxyAgent with MagenticOneGroupChat.

Transcribes the video screenshot at a specific timestamp.

video_path (str) – Path to the video file.

timestamp (float) – Timestamp to take the screenshot.

str – Transcription of the video screenshot.

autogen_ext.agents.openai

autogen_ext.agents.web_surfer

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[video-surfer]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[video-surfer]"
```

Example 3 (python):
```python
import asyncio
from autogen_agentchat.ui import Console
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.agents.video_surfer import VideoSurfer

async def main() -> None:
    """
    Main function to run the video agent.
    """
    # Define an agent
    video_agent = VideoSurfer(
        name="VideoSurfer",
        model_client=OpenAIChatCompletionClient(model="gpt-4o-2024-08-06")
        )

    # Define termination condition
    termination = TextMentionTermination("TERMINATE")

    # Define a team
    agent_team = RoundRobinGroupChat([video_agent], termination_condition=termination)

    # Run the team and stream messages to the console
    stream = agent_team.run_stream(task="How does Adam define complex tasks in video.mp4? What concrete example of complex does his use? Can you save this example to disk as well?")
    await Console(stream)

asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
from autogen_agentchat.ui import Console
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.agents.video_surfer import VideoSurfer

async def main() -> None:
    """
    Main function to run the video agent.
    """
    # Define an agent
    video_agent = VideoSurfer(
        name="VideoSurfer",
        model_client=OpenAIChatCompletionClient(model="gpt-4o-2024-08-06")
        )

    # Define termination condition
    termination = TextMentionTermination("TERMINATE")

    # Define a team
    agent_team = RoundRobinGroupChat([video_agent], termination_condition=termination)

    # Run the team and stream messages to the console
    stream = agent_team.run_stream(task="How does Adam define complex tasks in video.mp4? What concrete example of complex does his use? Can you save this example to disk as well?")
    await Console(stream)

asyncio.run(main())
```

---

## autogen_ext.agents.web_surfer.playwright_controller — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.web_surfer.playwright_controller.html

**Contents:**
- autogen_ext.agents.web_surfer.playwright_controller#

A helper class to allow Playwright to interact with web pages to perform actions such as clicking, filling, and scrolling.

downloads_folder (str | None) – The folder to save downloads to. If None, downloads are not saved.

animate_actions (bool) – Whether to animate the actions (create fake cursor to click).

viewport_width (int) – The width of the viewport.

viewport_height (int) – The height of the viewport.

_download_handler (Optional[Callable[[Download], None]]) – A function to handle downloads.

to_resize_viewport (bool) – Whether to resize the viewport

Pause the execution for a specified duration.

page (Page) – The Playwright page object.

duration (Union[int, float]) – The duration to sleep in milliseconds.

Retrieve interactive regions from the web page.

page (Page) – The Playwright page object.

Dict[str, InteractiveRegion] – A dictionary of interactive regions.

Retrieve the visual viewport of the web page.

page (Page) – The Playwright page object.

VisualViewport – The visual viewport of the page.

Retrieve the ID of the currently focused element.

page (Page) – The Playwright page object.

str – The ID of the focused element or None if no control has focus.

Retrieve metadata from the web page.

page (Page) – The Playwright page object.

Dict[str, Any] – A dictionary of page metadata.

Handle actions to perform on a new page.

page (Page) – The Playwright page object.

Navigate back to the previous page.

page (Page) – The Playwright page object.

Visit a specified URL.

page (Page) – The Playwright page object.

url (str) – The URL to visit.

Tuple[bool, bool] – A tuple indicating whether to reset prior metadata hash and last download.

Scroll the page down by one viewport height minus 50 pixels.

page (Page) – The Playwright page object.

Scroll the page up by one viewport height minus 50 pixels.

page (Page) – The Playwright page object.

Animate the cursor movement gradually from start to end coordinates.

page (Page) – The Playwright page object.

start_x (float) – The starting x-coordinate.

start_y (float) – The starting y-coordinate.

end_x (float) – The ending x-coordinate.

end_y (float) – The ending y-coordinate.

Add a red cursor box around the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Remove the red cursor box around the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Click the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Page | None – The new page if a new page is opened, otherwise None.

Hover the mouse over the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Fill the element with the given identifier with the specified value.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

value (str) – The value to fill.

Scroll the element with the given identifier in the specified direction.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

direction (str) – The direction to scroll (“up” or “down”).

Retrieve the text content of the web page.

page (Page) – The Playwright page object.

n_lines (int) – The number of lines to return from the page inner text.

str – The text content of the page.

Retrieve the text content of the browser viewport (approximately).

page (Page) – The Playwright page object.

str – The text content of the page.

Retrieve the markdown content of the web page. Currently not implemented.

page (Page) – The Playwright page object.

str – The markdown content of the page.

autogen_ext.agents.video_surfer.tools

autogen_ext.experimental.task_centric_memory.utils

---

## autogen_ext.agents.web_surfer — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.agents.web_surfer.html

**Contents:**
- autogen_ext.agents.web_surfer#

Bases: BaseChatAgent, Component[MultimodalWebSurferConfig]

MultimodalWebSurfer is a multimodal agent that acts as a web surfer that can search the web and visit web pages.

It launches a chromium browser and allows the playwright to interact with the web browser and can perform a variety of actions. The browser is launched on the first call to the agent and is reused for subsequent calls.

It must be used with a multimodal model client that supports function/tool calling, ideally GPT-4o currently.

If this is the first call, the browser is initialized and the page is loaded. This is done in _lazy_init(). The browser is only closed when close() is called.

The method _generate_reply() is called, which then creates the final response as below.

The agent takes a screenshot of the page, extracts the interactive elements, and prepares a set-of-mark screenshot with bounding boxes around the interactive elements.

If the model returns a string, the agent returns the string as the final response.

If the model returns a list of tool calls, the agent executes the tool calls with _execute_tool() using _playwright_controller.

The agent returns a final response which includes a screenshot of the page, page metadata, description of the action taken and the inner text of the webpage.

If at any point the agent encounters an error, it returns the error message as the final response.

Please note that using the MultimodalWebSurfer involves interacting with a digital world designed for humans, which carries inherent risks. Be aware that agents may occasionally attempt risky actions, such as recruiting humans for help or accepting cookie agreements without human involvement. Always ensure agents are monitored and operate within a controlled environment to prevent unintended consequences. Moreover, be cautious that MultimodalWebSurfer may be susceptible to prompt injection attacks from webpages.

On Windows, the event loop policy must be set to WindowsProactorEventLoopPolicy to avoid issues with subprocesses.

name (str) – The name of the agent.

model_client (ChatCompletionClient) – The model client used by the agent. Must be multimodal and support function calling.

downloads_folder (str, optional) – The folder where downloads are saved. Defaults to None, no downloads are saved.

description (str, optional) – The description of the agent. Defaults to MultimodalWebSurfer.DEFAULT_DESCRIPTION.

debug_dir (str, optional) – The directory where debug information is saved. Defaults to None.

headless (bool, optional) – Whether the browser should be headless. Defaults to True.

start_page (str, optional) – The start page for the browser. Defaults to MultimodalWebSurfer.DEFAULT_START_PAGE.

animate_actions (bool, optional) – Whether to animate actions. Defaults to False.

to_save_screenshots (bool, optional) – Whether to save screenshots. Defaults to False.

use_ocr (bool, optional) – Whether to use OCR. Defaults to False.

browser_channel (str, optional) – The browser channel. Defaults to None.

browser_data_dir (str, optional) – The browser data directory. Defaults to None.

to_resize_viewport (bool, optional) – Whether to resize the viewport. Defaults to True.

playwright (Playwright, optional) – The playwright instance. Defaults to None.

context (BrowserContext, optional) – The browser context. Defaults to None.

The following example demonstrates how to create a web surfing agent with a model client and run it for multiple turns.

The logical type of the component.

alias of MultimodalWebSurferConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Close the browser and the page. Should be called when the agent is no longer needed.

The types of messages that the agent produces in the Response.chat_message field. They must be BaseChatMessage types.

Resets the agent to its initialization state.

Handles incoming messages and returns a response.

Agents are stateful and the messages passed to this method should be the new messages since the last call to this method. The agent should maintain its state between calls to this method. For example, if the agent needs to remember the previous messages to respond to the current message, it should store the previous messages in the agent state.

Handles incoming messages and returns a stream of messages and and the final item is the response. The base implementation in BaseChatAgent simply calls on_messages() and yields the messages in the response.

Agents are stateful and the messages passed to this method should be the new messages since the last call to this method. The agent should maintain its state between calls to this method. For example, if the agent needs to remember the previous messages to respond to the current message, it should store the previous messages in the agent state.

Dump the configuration that would be requite to create a new instance of a component matching the configuration of this instance.

T – The configuration of the component.

Create a new instance of the component from a configuration object.

config (T) – The configuration object.

Self – The new instance of the component.

A helper class to allow Playwright to interact with web pages to perform actions such as clicking, filling, and scrolling.

downloads_folder (str | None) – The folder to save downloads to. If None, downloads are not saved.

animate_actions (bool) – Whether to animate the actions (create fake cursor to click).

viewport_width (int) – The width of the viewport.

viewport_height (int) – The height of the viewport.

_download_handler (Optional[Callable[[Download], None]]) – A function to handle downloads.

to_resize_viewport (bool) – Whether to resize the viewport

Pause the execution for a specified duration.

page (Page) – The Playwright page object.

duration (Union[int, float]) – The duration to sleep in milliseconds.

Retrieve interactive regions from the web page.

page (Page) – The Playwright page object.

Dict[str, InteractiveRegion] – A dictionary of interactive regions.

Retrieve the visual viewport of the web page.

page (Page) – The Playwright page object.

VisualViewport – The visual viewport of the page.

Retrieve the ID of the currently focused element.

page (Page) – The Playwright page object.

str – The ID of the focused element or None if no control has focus.

Retrieve metadata from the web page.

page (Page) – The Playwright page object.

Dict[str, Any] – A dictionary of page metadata.

Handle actions to perform on a new page.

page (Page) – The Playwright page object.

Navigate back to the previous page.

page (Page) – The Playwright page object.

Visit a specified URL.

page (Page) – The Playwright page object.

url (str) – The URL to visit.

Tuple[bool, bool] – A tuple indicating whether to reset prior metadata hash and last download.

Scroll the page down by one viewport height minus 50 pixels.

page (Page) – The Playwright page object.

Scroll the page up by one viewport height minus 50 pixels.

page (Page) – The Playwright page object.

Animate the cursor movement gradually from start to end coordinates.

page (Page) – The Playwright page object.

start_x (float) – The starting x-coordinate.

start_y (float) – The starting y-coordinate.

end_x (float) – The ending x-coordinate.

end_y (float) – The ending y-coordinate.

Add a red cursor box around the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Remove the red cursor box around the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Click the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Page | None – The new page if a new page is opened, otherwise None.

Hover the mouse over the element with the given identifier.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

Fill the element with the given identifier with the specified value.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

value (str) – The value to fill.

Scroll the element with the given identifier in the specified direction.

page (Page) – The Playwright page object.

identifier (str) – The element identifier.

direction (str) – The direction to scroll (“up” or “down”).

Retrieve the text content of the web page.

page (Page) – The Playwright page object.

n_lines (int) – The number of lines to return from the page inner text.

str – The text content of the page.

Retrieve the text content of the browser viewport (approximately).

page (Page) – The Playwright page object.

str – The text content of the page.

Retrieve the markdown content of the web page. Currently not implemented.

page (Page) – The Playwright page object.

str – The markdown content of the page.

autogen_ext.agents.video_surfer

autogen_ext.auth.azure

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[web-surfer]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[web-surfer]"
```

Example 3 (python):
```python
import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
```

Example 4 (python):
```python
import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
```

---

## autogen_ext.memory.chromadb — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.memory.chromadb.html

**Contents:**
- autogen_ext.memory.chromadb#

Bases: Memory, Component[ChromaDBVectorMemoryConfig]

Store and retrieve memory using vector similarity search powered by ChromaDB.

ChromaDBVectorMemory provides a vector-based memory implementation that uses ChromaDB for storing and retrieving content based on semantic similarity. It enhances agents with the ability to recall contextually relevant information during conversations by leveraging vector embeddings to find similar content.

This implementation serves as a reference for more complex memory systems using vector embeddings. For advanced use cases requiring specialized formatting of retrieved content, users should extend this class and override the update_context() method.

This implementation requires the ChromaDB extra to be installed. Install with:

config (ChromaDBVectorMemoryConfig | None) – Configuration for the ChromaDB memory. If None, defaults to a PersistentChromaDBVectorMemoryConfig with default values. Two config types are supported: * PersistentChromaDBVectorMemoryConfig: For local storage * HttpChromaDBVectorMemoryConfig: For connecting to a remote ChromaDB server

alias of ChromaDBVectorMemoryConfig

Override the provider string for the component. This should be used to prevent internal module names being a part of the module name.

Get the name of the ChromaDB collection.

Update the provided model context using relevant memory content.

model_context – The context to update.

UpdateContextResult containing relevant memories

Add a new content to memory.

content – The memory content to add

cancellation_token – Optional token to cancel operation

Query the memory store and return relevant entries.

query – Query content item

cancellation_token – Optional token to cancel operation

**kwargs – Additional implementation-specific parameters

MemoryQueryResult containing memory entries with relevance scores

Clear all entries from memory.

Clean up ChromaDB client and resources.

Base configuration for ChromaDB-based memory implementation.

Changed in version v0.4.1: Added support for custom embedding functions via embedding_function_config.

Show JSON schema{ "title": "ChromaDBVectorMemoryConfig", "description": "Base configuration for ChromaDB-based memory implementation.\n\n.. versionchanged:: v0.4.1\n Added support for custom embedding functions via embedding_function_config.", "type": "object", "properties": { "client_type": { "enum": [ "persistent", "http" ], "title": "Client Type", "type": "string" }, "collection_name": { "default": "memory_store", "description": "Name of the ChromaDB collection", "title": "Collection Name", "type": "string" }, "distance_metric": { "default": "cosine", "description": "Distance metric for similarity search", "title": "Distance Metric", "type": "string" }, "k": { "default": 3, "description": "Number of results to return in queries", "title": "K", "type": "integer" }, "score_threshold": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "description": "Minimum similarity score threshold", "title": "Score Threshold" }, "allow_reset": { "default": false, "description": "Whether to allow resetting the ChromaDB client", "title": "Allow Reset", "type": "boolean" }, "tenant": { "default": "default_tenant", "description": "Tenant to use", "title": "Tenant", "type": "string" }, "database": { "default": "default_database", "description": "Database to use", "title": "Database", "type": "string" }, "embedding_function_config": { "description": "Configuration for the embedding function", "discriminator": { "mapping": { "default": "#/$defs/DefaultEmbeddingFunctionConfig", "openai": "#/$defs/OpenAIEmbeddingFunctionConfig", "sentence_transformer": "#/$defs/SentenceTransformerEmbeddingFunctionConfig" }, "propertyName": "function_type" }, "oneOf": [ { "$ref": "#/$defs/DefaultEmbeddingFunctionConfig" }, { "$ref": "#/$defs/SentenceTransformerEmbeddingFunctionConfig" }, { "$ref": "#/$defs/OpenAIEmbeddingFunctionConfig" } ], "title": "Embedding Function Config" } }, "$defs": { "DefaultEmbeddingFunctionConfig": { "description": "Configuration for the default ChromaDB embedding function.\n\nUses ChromaDB's default embedding function (Sentence Transformers all-MiniLM-L6-v2).\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.", "properties": { "function_type": { "const": "default", "default": "default", "title": "Function Type", "type": "string" } }, "title": "DefaultEmbeddingFunctionConfig", "type": "object" }, "OpenAIEmbeddingFunctionConfig": { "description": "Configuration for OpenAI embedding functions.\n\nUses OpenAI's embedding API for generating embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n api_key (str): OpenAI API key. If empty, will attempt to use environment variable.\n model_name (str): OpenAI embedding model name. Defaults to \"text-embedding-ada-002\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import OpenAIEmbeddingFunctionConfig\n\n _ = OpenAIEmbeddingFunctionConfig(api_key=\"sk-...\", model_name=\"text-embedding-3-small\")", "properties": { "function_type": { "const": "openai", "default": "openai", "title": "Function Type", "type": "string" }, "api_key": { "default": "", "description": "OpenAI API key", "title": "Api Key", "type": "string" }, "model_name": { "default": "text-embedding-ada-002", "description": "OpenAI embedding model name", "title": "Model Name", "type": "string" } }, "title": "OpenAIEmbeddingFunctionConfig", "type": "object" }, "SentenceTransformerEmbeddingFunctionConfig": { "description": "Configuration for SentenceTransformer embedding functions.\n\nAllows specifying a custom SentenceTransformer model for embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n model_name (str): Name of the SentenceTransformer model to use.\n Defaults to \"all-MiniLM-L6-v2\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import SentenceTransformerEmbeddingFunctionConfig\n\n _ = SentenceTransformerEmbeddingFunctionConfig(model_name=\"paraphrase-multilingual-mpnet-base-v2\")", "properties": { "function_type": { "const": "sentence_transformer", "default": "sentence_transformer", "title": "Function Type", "type": "string" }, "model_name": { "default": "all-MiniLM-L6-v2", "description": "SentenceTransformer model name to use", "title": "Model Name", "type": "string" } }, "title": "SentenceTransformerEmbeddingFunctionConfig", "type": "object" } }, "required": [ "client_type" ] }

client_type (Literal['persistent', 'http'])

collection_name (str)

distance_metric (str)

embedding_function_config (autogen_ext.memory.chromadb._chroma_configs.DefaultEmbeddingFunctionConfig | autogen_ext.memory.chromadb._chroma_configs.SentenceTransformerEmbeddingFunctionConfig | autogen_ext.memory.chromadb._chroma_configs.OpenAIEmbeddingFunctionConfig | autogen_ext.memory.chromadb._chroma_configs.CustomEmbeddingFunctionConfig)

score_threshold (float | None)

Name of the ChromaDB collection

Distance metric for similarity search

Number of results to return in queries

Minimum similarity score threshold

Whether to allow resetting the ChromaDB client

Configuration for the embedding function

Bases: ChromaDBVectorMemoryConfig

Configuration for persistent ChromaDB memory.

Show JSON schema{ "title": "PersistentChromaDBVectorMemoryConfig", "description": "Configuration for persistent ChromaDB memory.", "type": "object", "properties": { "client_type": { "default": "persistent", "enum": [ "persistent", "http" ], "title": "Client Type", "type": "string" }, "collection_name": { "default": "memory_store", "description": "Name of the ChromaDB collection", "title": "Collection Name", "type": "string" }, "distance_metric": { "default": "cosine", "description": "Distance metric for similarity search", "title": "Distance Metric", "type": "string" }, "k": { "default": 3, "description": "Number of results to return in queries", "title": "K", "type": "integer" }, "score_threshold": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "description": "Minimum similarity score threshold", "title": "Score Threshold" }, "allow_reset": { "default": false, "description": "Whether to allow resetting the ChromaDB client", "title": "Allow Reset", "type": "boolean" }, "tenant": { "default": "default_tenant", "description": "Tenant to use", "title": "Tenant", "type": "string" }, "database": { "default": "default_database", "description": "Database to use", "title": "Database", "type": "string" }, "embedding_function_config": { "description": "Configuration for the embedding function", "discriminator": { "mapping": { "default": "#/$defs/DefaultEmbeddingFunctionConfig", "openai": "#/$defs/OpenAIEmbeddingFunctionConfig", "sentence_transformer": "#/$defs/SentenceTransformerEmbeddingFunctionConfig" }, "propertyName": "function_type" }, "oneOf": [ { "$ref": "#/$defs/DefaultEmbeddingFunctionConfig" }, { "$ref": "#/$defs/SentenceTransformerEmbeddingFunctionConfig" }, { "$ref": "#/$defs/OpenAIEmbeddingFunctionConfig" } ], "title": "Embedding Function Config" }, "persistence_path": { "default": "./chroma_db", "description": "Path for persistent storage", "title": "Persistence Path", "type": "string" } }, "$defs": { "DefaultEmbeddingFunctionConfig": { "description": "Configuration for the default ChromaDB embedding function.\n\nUses ChromaDB's default embedding function (Sentence Transformers all-MiniLM-L6-v2).\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.", "properties": { "function_type": { "const": "default", "default": "default", "title": "Function Type", "type": "string" } }, "title": "DefaultEmbeddingFunctionConfig", "type": "object" }, "OpenAIEmbeddingFunctionConfig": { "description": "Configuration for OpenAI embedding functions.\n\nUses OpenAI's embedding API for generating embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n api_key (str): OpenAI API key. If empty, will attempt to use environment variable.\n model_name (str): OpenAI embedding model name. Defaults to \"text-embedding-ada-002\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import OpenAIEmbeddingFunctionConfig\n\n _ = OpenAIEmbeddingFunctionConfig(api_key=\"sk-...\", model_name=\"text-embedding-3-small\")", "properties": { "function_type": { "const": "openai", "default": "openai", "title": "Function Type", "type": "string" }, "api_key": { "default": "", "description": "OpenAI API key", "title": "Api Key", "type": "string" }, "model_name": { "default": "text-embedding-ada-002", "description": "OpenAI embedding model name", "title": "Model Name", "type": "string" } }, "title": "OpenAIEmbeddingFunctionConfig", "type": "object" }, "SentenceTransformerEmbeddingFunctionConfig": { "description": "Configuration for SentenceTransformer embedding functions.\n\nAllows specifying a custom SentenceTransformer model for embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n model_name (str): Name of the SentenceTransformer model to use.\n Defaults to \"all-MiniLM-L6-v2\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import SentenceTransformerEmbeddingFunctionConfig\n\n _ = SentenceTransformerEmbeddingFunctionConfig(model_name=\"paraphrase-multilingual-mpnet-base-v2\")", "properties": { "function_type": { "const": "sentence_transformer", "default": "sentence_transformer", "title": "Function Type", "type": "string" }, "model_name": { "default": "all-MiniLM-L6-v2", "description": "SentenceTransformer model name to use", "title": "Model Name", "type": "string" } }, "title": "SentenceTransformerEmbeddingFunctionConfig", "type": "object" } } }

client_type (Literal['persistent', 'http'])

persistence_path (str)

Path for persistent storage

Bases: ChromaDBVectorMemoryConfig

Configuration for HTTP ChromaDB memory.

Show JSON schema{ "title": "HttpChromaDBVectorMemoryConfig", "description": "Configuration for HTTP ChromaDB memory.", "type": "object", "properties": { "client_type": { "default": "http", "enum": [ "persistent", "http" ], "title": "Client Type", "type": "string" }, "collection_name": { "default": "memory_store", "description": "Name of the ChromaDB collection", "title": "Collection Name", "type": "string" }, "distance_metric": { "default": "cosine", "description": "Distance metric for similarity search", "title": "Distance Metric", "type": "string" }, "k": { "default": 3, "description": "Number of results to return in queries", "title": "K", "type": "integer" }, "score_threshold": { "anyOf": [ { "type": "number" }, { "type": "null" } ], "default": null, "description": "Minimum similarity score threshold", "title": "Score Threshold" }, "allow_reset": { "default": false, "description": "Whether to allow resetting the ChromaDB client", "title": "Allow Reset", "type": "boolean" }, "tenant": { "default": "default_tenant", "description": "Tenant to use", "title": "Tenant", "type": "string" }, "database": { "default": "default_database", "description": "Database to use", "title": "Database", "type": "string" }, "embedding_function_config": { "description": "Configuration for the embedding function", "discriminator": { "mapping": { "default": "#/$defs/DefaultEmbeddingFunctionConfig", "openai": "#/$defs/OpenAIEmbeddingFunctionConfig", "sentence_transformer": "#/$defs/SentenceTransformerEmbeddingFunctionConfig" }, "propertyName": "function_type" }, "oneOf": [ { "$ref": "#/$defs/DefaultEmbeddingFunctionConfig" }, { "$ref": "#/$defs/SentenceTransformerEmbeddingFunctionConfig" }, { "$ref": "#/$defs/OpenAIEmbeddingFunctionConfig" } ], "title": "Embedding Function Config" }, "host": { "default": "localhost", "description": "Host of the remote server", "title": "Host", "type": "string" }, "port": { "default": 8000, "description": "Port of the remote server", "title": "Port", "type": "integer" }, "ssl": { "default": false, "description": "Whether to use HTTPS", "title": "Ssl", "type": "boolean" }, "headers": { "anyOf": [ { "additionalProperties": { "type": "string" }, "type": "object" }, { "type": "null" } ], "default": null, "description": "Headers to send to the server", "title": "Headers" } }, "$defs": { "DefaultEmbeddingFunctionConfig": { "description": "Configuration for the default ChromaDB embedding function.\n\nUses ChromaDB's default embedding function (Sentence Transformers all-MiniLM-L6-v2).\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.", "properties": { "function_type": { "const": "default", "default": "default", "title": "Function Type", "type": "string" } }, "title": "DefaultEmbeddingFunctionConfig", "type": "object" }, "OpenAIEmbeddingFunctionConfig": { "description": "Configuration for OpenAI embedding functions.\n\nUses OpenAI's embedding API for generating embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n api_key (str): OpenAI API key. If empty, will attempt to use environment variable.\n model_name (str): OpenAI embedding model name. Defaults to \"text-embedding-ada-002\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import OpenAIEmbeddingFunctionConfig\n\n _ = OpenAIEmbeddingFunctionConfig(api_key=\"sk-...\", model_name=\"text-embedding-3-small\")", "properties": { "function_type": { "const": "openai", "default": "openai", "title": "Function Type", "type": "string" }, "api_key": { "default": "", "description": "OpenAI API key", "title": "Api Key", "type": "string" }, "model_name": { "default": "text-embedding-ada-002", "description": "OpenAI embedding model name", "title": "Model Name", "type": "string" } }, "title": "OpenAIEmbeddingFunctionConfig", "type": "object" }, "SentenceTransformerEmbeddingFunctionConfig": { "description": "Configuration for SentenceTransformer embedding functions.\n\nAllows specifying a custom SentenceTransformer model for embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n model_name (str): Name of the SentenceTransformer model to use.\n Defaults to \"all-MiniLM-L6-v2\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import SentenceTransformerEmbeddingFunctionConfig\n\n _ = SentenceTransformerEmbeddingFunctionConfig(model_name=\"paraphrase-multilingual-mpnet-base-v2\")", "properties": { "function_type": { "const": "sentence_transformer", "default": "sentence_transformer", "title": "Function Type", "type": "string" }, "model_name": { "default": "all-MiniLM-L6-v2", "description": "SentenceTransformer model name to use", "title": "Model Name", "type": "string" } }, "title": "SentenceTransformerEmbeddingFunctionConfig", "type": "object" } } }

client_type (Literal['persistent', 'http'])

headers (Dict[str, str] | None)

Host of the remote server

Port of the remote server

Headers to send to the server

Configuration for the default ChromaDB embedding function.

Uses ChromaDB’s default embedding function (Sentence Transformers all-MiniLM-L6-v2).

Added in version v0.4.1: Support for custom embedding functions in ChromaDB memory.

Show JSON schema{ "title": "DefaultEmbeddingFunctionConfig", "description": "Configuration for the default ChromaDB embedding function.\n\nUses ChromaDB's default embedding function (Sentence Transformers all-MiniLM-L6-v2).\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.", "type": "object", "properties": { "function_type": { "const": "default", "default": "default", "title": "Function Type", "type": "string" } } }

function_type (Literal['default'])

Configuration for SentenceTransformer embedding functions.

Allows specifying a custom SentenceTransformer model for embeddings.

Added in version v0.4.1: Support for custom embedding functions in ChromaDB memory.

model_name (str) – Name of the SentenceTransformer model to use. Defaults to “all-MiniLM-L6-v2”.

Show JSON schema{ "title": "SentenceTransformerEmbeddingFunctionConfig", "description": "Configuration for SentenceTransformer embedding functions.\n\nAllows specifying a custom SentenceTransformer model for embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n model_name (str): Name of the SentenceTransformer model to use.\n Defaults to \"all-MiniLM-L6-v2\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import SentenceTransformerEmbeddingFunctionConfig\n\n _ = SentenceTransformerEmbeddingFunctionConfig(model_name=\"paraphrase-multilingual-mpnet-base-v2\")", "type": "object", "properties": { "function_type": { "const": "sentence_transformer", "default": "sentence_transformer", "title": "Function Type", "type": "string" }, "model_name": { "default": "all-MiniLM-L6-v2", "description": "SentenceTransformer model name to use", "title": "Model Name", "type": "string" } } }

function_type (Literal['sentence_transformer'])

SentenceTransformer model name to use

Configuration for OpenAI embedding functions.

Uses OpenAI’s embedding API for generating embeddings.

Added in version v0.4.1: Support for custom embedding functions in ChromaDB memory.

api_key (str) – OpenAI API key. If empty, will attempt to use environment variable.

model_name (str) – OpenAI embedding model name. Defaults to “text-embedding-ada-002”.

Show JSON schema{ "title": "OpenAIEmbeddingFunctionConfig", "description": "Configuration for OpenAI embedding functions.\n\nUses OpenAI's embedding API for generating embeddings.\n\n.. versionadded:: v0.4.1\n Support for custom embedding functions in ChromaDB memory.\n\nArgs:\n api_key (str): OpenAI API key. If empty, will attempt to use environment variable.\n model_name (str): OpenAI embedding model name. Defaults to \"text-embedding-ada-002\".\n\nExample:\n .. code-block:: python\n\n from autogen_ext.memory.chromadb import OpenAIEmbeddingFunctionConfig\n\n _ = OpenAIEmbeddingFunctionConfig(api_key=\"sk-...\", model_name=\"text-embedding-3-small\")", "type": "object", "properties": { "function_type": { "const": "openai", "default": "openai", "title": "Function Type", "type": "string" }, "api_key": { "default": "", "description": "OpenAI API key", "title": "Api Key", "type": "string" }, "model_name": { "default": "text-embedding-ada-002", "description": "OpenAI embedding model name", "title": "Model Name", "type": "string" } } }

function_type (Literal['openai'])

OpenAI embedding model name

Configuration for custom embedding functions.

Allows using a custom function that returns a ChromaDB-compatible embedding function.

Added in version v0.4.1: Support for custom embedding functions in ChromaDB memory.

Configurations containing custom functions are not serializable.

function (Callable) – Function that returns a ChromaDB-compatible embedding function.

params (Dict[str, Any]) – Parameters to pass to the function.

Show JSON schema{ "title": "CustomEmbeddingFunctionConfig", "type": "object", "properties": { "function_type": { "const": "custom", "default": "custom", "title": "Function Type", "type": "string" }, "function": { "default": null, "title": "Function" }, "params": { "description": "Parameters to pass to the function", "title": "Params", "type": "object" } } }

function (Callable[[...], Any])

function_type (Literal['custom'])

params (Dict[str, Any])

Function that returns an embedding function

Parameters to pass to the function

autogen_ext.memory.canvas

autogen_ext.memory.mem0

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[chromadb]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[chromadb]"
```

Example 3 (python):
```python
import os
import asyncio
from pathlib import Path
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_core.memory import MemoryContent, MemoryMimeType
from autogen_ext.memory.chromadb import (
    ChromaDBVectorMemory,
    PersistentChromaDBVectorMemoryConfig,
    SentenceTransformerEmbeddingFunctionConfig,
    OpenAIEmbeddingFunctionConfig,
)
from autogen_ext.models.openai import OpenAIChatCompletionClient


def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny with a high of 90°F and a low of 70°F."


def fahrenheit_to_celsius(fahrenheit: float) -> float:
    return (fahrenheit - 32) * 5.0 / 9.0


async def main() -> None:
    # Use default embedding function
    default_memory = ChromaDBVectorMemory(
        config=PersistentChromaDBVectorMemoryConfig(
            collection_name="user_preferences",
            persistence_path=os.path.join(str(Path.home()), ".chromadb_autogen"),
            k=3,  # Return top 3 results
            score_threshold=0.5,  # Minimum similarity score
        )
    )

    # Using a custom SentenceTransformer model
    custom_memory = ChromaDBVectorMemory(
        config=PersistentChromaDBVectorMemoryConfig(
            collection_name="multilingual_memory",
            persistence_path=os.path.join(str(Path.home()), ".chromadb_autogen"),
            embedding_function_config=SentenceTransformerEmbeddingFunctionConfig(
                model_name="paraphrase-multilingual-mpnet-base-v2"
            ),
        )
    )

    # Using OpenAI embeddings
    openai_memory = ChromaDBVectorMemory(
        config=PersistentChromaDBVectorMemoryConfig(
            collection_name="openai_memory",
            persistence_path=os.path.join(str(Path.home()), ".chromadb_autogen"),
            embedding_function_config=OpenAIEmbeddingFunctionConfig(
                api_key=os.environ["OPENAI_API_KEY"], model_name="text-embedding-3-small"
            ),
        )
    )

    # Add user preferences to memory
    await openai_memory.add(
        MemoryContent(
            content="The user prefers weather temperatures in Celsius",
            mime_type=MemoryMimeType.TEXT,
            metadata={"category": "preferences", "type": "units"},
        )
    )

    # Create assistant agent with ChromaDB memory
    assistant = AssistantAgent(
        name="assistant",
        model_client=OpenAIChatCompletionClient(
            model="gpt-4.1",
        ),
        tools=[
            get_weather,
            fahrenheit_to_celsius,
        ],
        max_tool_iterations=10,
        memory=[openai_memory],
    )

    # The memory will automatically retrieve relevant content during conversations
    await Console(assistant.run_stream(task="What's the temperature in New York?"))

    # Remember to close the memory when finished
    await default_memory.close()
    await custom_memory.close()
    await openai_memory.close()


asyncio.run(main())
```

Example 4 (python):
```python
import os
import asyncio
from pathlib import Path
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_core.memory import MemoryContent, MemoryMimeType
from autogen_ext.memory.chromadb import (
    ChromaDBVectorMemory,
    PersistentChromaDBVectorMemoryConfig,
    SentenceTransformerEmbeddingFunctionConfig,
    OpenAIEmbeddingFunctionConfig,
)
from autogen_ext.models.openai import OpenAIChatCompletionClient


def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny with a high of 90°F and a low of 70°F."


def fahrenheit_to_celsius(fahrenheit: float) -> float:
    return (fahrenheit - 32) * 5.0 / 9.0


async def main() -> None:
    # Use default embedding function
    default_memory = ChromaDBVectorMemory(
        config=PersistentChromaDBVectorMemoryConfig(
            collection_name="user_preferences",
            persistence_path=os.path.join(str(Path.home()), ".chromadb_autogen"),
            k=3,  # Return top 3 results
            score_threshold=0.5,  # Minimum similarity score
        )
    )

    # Using a custom SentenceTransformer model
    custom_memory = ChromaDBVectorMemory(
        config=PersistentChromaDBVectorMemoryConfig(
            collection_name="multilingual_memory",
            persistence_path=os.path.join(str(Path.home()), ".chromadb_autogen"),
            embedding_function_config=SentenceTransformerEmbeddingFunctionConfig(
                model_name="paraphrase-multilingual-mpnet-base-v2"
            ),
        )
    )

    # Using OpenAI embeddings
    openai_memory = ChromaDBVectorMemory(
        config=PersistentChromaDBVectorMemoryConfig(
            collection_name="openai_memory",
            persistence_path=os.path.join(str(Path.home()), ".chromadb_autogen"),
            embedding_function_config=OpenAIEmbeddingFunctionConfig(
                api_key=os.environ["OPENAI_API_KEY"], model_name="text-embedding-3-small"
            ),
        )
    )

    # Add user preferences to memory
    await openai_memory.add(
        MemoryContent(
            content="The user prefers weather temperatures in Celsius",
            mime_type=MemoryMimeType.TEXT,
            metadata={"category": "preferences", "type": "units"},
        )
    )

    # Create assistant agent with ChromaDB memory
    assistant = AssistantAgent(
        name="assistant",
        model_client=OpenAIChatCompletionClient(
            model="gpt-4.1",
        ),
        tools=[
            get_weather,
            fahrenheit_to_celsius,
        ],
        max_tool_iterations=10,
        memory=[openai_memory],
    )

    # The memory will automatically retrieve relevant content during conversations
    await Console(assistant.run_stream(task="What's the temperature in New York?"))

    # Remember to close the memory when finished
    await default_memory.close()
    await custom_memory.close()
    await openai_memory.close()


asyncio.run(main())
```

---

## autogen_ext.models.semantic_kernel — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.models.semantic_kernel.html

**Contents:**
- autogen_ext.models.semantic_kernel#

Bases: ChatCompletionClient

SKChatCompletionAdapter is an adapter that allows using Semantic Kernel model clients as Autogen ChatCompletion clients. This makes it possible to seamlessly integrate Semantic Kernel connectors (e.g., Azure OpenAI, Google Gemini, Ollama, etc.) into Autogen agents that rely on a ChatCompletionClient interface.

By leveraging this adapter, you can:

Pass in a Kernel and any supported Semantic Kernel ChatCompletionClientBase connector.

Provide tools (via Autogen Tool or ToolSchema) for function calls during chat completion.

Stream responses or retrieve them in a single request.

or on a per-request basis through the extra_create_args dictionary.

The list of extras that can be installed:

semantic-kernel-anthropic: Install this extra to use Anthropic models.

semantic-kernel-google: Install this extra to use Google Gemini models.

semantic-kernel-ollama: Install this extra to use Ollama models.

semantic-kernel-mistralai: Install this extra to use MistralAI models.

semantic-kernel-aws: Install this extra to use AWS models.

semantic-kernel-hugging-face: Install this extra to use Hugging Face models.

sk_client (ChatCompletionClientBase) – The Semantic Kernel client to wrap (e.g., AzureChatCompletion, GoogleAIChatCompletion, OllamaChatCompletion).

kernel (Optional[Kernel]) – The Semantic Kernel instance to use for executing requests. If not provided, one must be passed in the extra_create_args for each request.

prompt_settings (Optional[PromptExecutionSettings]) – Default prompt execution settings to use. Can be overridden per request.

model_info (Optional[ModelInfo]) – Information about the model’s capabilities.

service_id (Optional[str]) – Optional service identifier.

Anthropic models with function calling:

Google Gemini models with function calling:

Create a chat completion using the Semantic Kernel client.

The extra_create_args dictionary can include two special keys:

An instance of semantic_kernel.Kernel used to execute the request. If not provided either in constructor or extra_create_args, a ValueError is raised.

An instance of a PromptExecutionSettings subclass corresponding to the underlying Semantic Kernel client (e.g., AzureChatPromptExecutionSettings, GoogleAIChatPromptExecutionSettings). If not provided, the adapter’s default prompt settings will be used.

messages – The list of LLM messages to send.

tools – The tools that may be invoked during the chat.

json_output – Whether the model is expected to return JSON.

extra_create_args – Additional arguments to control the chat completion behavior.

cancellation_token – Token allowing cancellation of the request.

CreateResult – The result of the chat completion.

Create a streaming chat completion using the Semantic Kernel client.

The extra_create_args dictionary can include two special keys:

An instance of semantic_kernel.Kernel used to execute the request. If not provided either in constructor or extra_create_args, a ValueError is raised.

An instance of a PromptExecutionSettings subclass corresponding to the underlying Semantic Kernel client (e.g., AzureChatPromptExecutionSettings, GoogleAIChatPromptExecutionSettings). If not provided, the adapter’s default prompt settings will be used.

messages – The list of LLM messages to send.

tools – The tools that may be invoked during the chat.

json_output – Whether the model is expected to return JSON.

extra_create_args – Additional arguments to control the chat completion behavior.

cancellation_token – Token allowing cancellation of the request.

Union[str, CreateResult] – Either a string chunk of the response or a CreateResult containing function calls.

autogen_ext.models.replay

autogen_ext.runtimes.grpc

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[semantic-kernel-anthropic]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[semantic-kernel-anthropic]"
```

Example 3 (python):
```python
import asyncio
import os

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_core.models import ModelFamily, UserMessage
from autogen_ext.models.semantic_kernel import SKChatCompletionAdapter
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.anthropic import AnthropicChatCompletion, AnthropicChatPromptExecutionSettings
from semantic_kernel.memory.null_memory import NullMemory


async def get_weather(city: str) -> str:
    """Get the weather for a city."""
    return f"The weather in {city} is 75 degrees."


async def main() -> None:
    sk_client = AnthropicChatCompletion(
        ai_model_id="claude-3-5-sonnet-20241022",
        api_key=os.environ["ANTHROPIC_API_KEY"],
        service_id="my-service-id",  # Optional; for targeting specific services within Semantic Kernel
    )
    settings = AnthropicChatPromptExecutionSettings(
        temperature=0.2,
    )

    model_client = SKChatCompletionAdapter(
        sk_client,
        kernel=Kernel(memory=NullMemory()),
        prompt_settings=settings,
        model_info={
            "function_calling": True,
            "json_output": True,
            "vision": True,
            "family": ModelFamily.CLAUDE_3_5_SONNET,
            "structured_output": True,
        },
    )

    # Call the model directly.
    response = await model_client.create([UserMessage(content="What is the capital of France?", source="test")])
    print(response)

    # Create an assistant agent with the model client.
    assistant = AssistantAgent(
        "assistant", model_client=model_client, system_message="You are a helpful assistant.", tools=[get_weather]
    )
    # Call the assistant with a task.
    await Console(assistant.run_stream(task="What is the weather in Paris and London?"))


asyncio.run(main())
```

Example 4 (python):
```python
import asyncio
import os

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_core.models import ModelFamily, UserMessage
from autogen_ext.models.semantic_kernel import SKChatCompletionAdapter
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.anthropic import AnthropicChatCompletion, AnthropicChatPromptExecutionSettings
from semantic_kernel.memory.null_memory import NullMemory


async def get_weather(city: str) -> str:
    """Get the weather for a city."""
    return f"The weather in {city} is 75 degrees."


async def main() -> None:
    sk_client = AnthropicChatCompletion(
        ai_model_id="claude-3-5-sonnet-20241022",
        api_key=os.environ["ANTHROPIC_API_KEY"],
        service_id="my-service-id",  # Optional; for targeting specific services within Semantic Kernel
    )
    settings = AnthropicChatPromptExecutionSettings(
        temperature=0.2,
    )

    model_client = SKChatCompletionAdapter(
        sk_client,
        kernel=Kernel(memory=NullMemory()),
        prompt_settings=settings,
        model_info={
            "function_calling": True,
            "json_output": True,
            "vision": True,
            "family": ModelFamily.CLAUDE_3_5_SONNET,
            "structured_output": True,
        },
    )

    # Call the model directly.
    response = await model_client.create([UserMessage(content="What is the capital of France?", source="test")])
    print(response)

    # Create an assistant agent with the model client.
    assistant = AssistantAgent(
        "assistant", model_client=model_client, system_message="You are a helpful assistant.", tools=[get_weather]
    )
    # Call the assistant with a task.
    await Console(assistant.run_stream(task="What is the weather in Paris and London?"))


asyncio.run(main())
```

---

## autogen_ext.runtimes.grpc.protos.agent_worker_pb2 — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.grpc.protos.agent_worker_pb2.html

**Contents:**
- autogen_ext.runtimes.grpc.protos.agent_worker_pb2#

Generated protocol buffer code.

autogen_ext.runtimes.grpc.protos

autogen_ext.runtimes.grpc.protos.agent_worker_pb2_grpc

---

## autogen_ext.runtimes.grpc.protos.agent_worker_pb2_grpc — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.grpc.protos.agent_worker_pb2_grpc.html

**Contents:**
- autogen_ext.runtimes.grpc.protos.agent_worker_pb2_grpc#

Client and server classes corresponding to protobuf-defined services.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

autogen_ext.runtimes.grpc.protos.agent_worker_pb2

autogen_ext.runtimes.grpc.protos.cloudevent_pb2

---

## autogen_ext.runtimes.grpc — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.runtimes.grpc.html

**Contents:**
- autogen_ext.runtimes.grpc#

An agent runtime for running remote or cross-language agents.

Agent messaging uses protobufs from agent_worker.proto and CloudEvent from cloudevent.proto.

Cross-language agents will additionally require all agents use shared protobuf schemas for any message types that are sent between agents.

Start the runtime in a background task.

Stop the runtime immediately.

Stop the runtime when a signal is received.

Send a message to an agent and get a response.

message (Any) – The message to send.

recipient (AgentId) – The agent to send the message to.

sender (AgentId | None, optional) – Agent which sent the message. Should only be None if this was sent from no agent, such as directly to the runtime externally. Defaults to None.

cancellation_token (CancellationToken | None, optional) – Token used to cancel an in progress . Defaults to None.

CantHandleException – If the recipient cannot handle the message.

UndeliverableException – If the message cannot be delivered.

Other – Any other exception raised by the recipient.

Any – The response from the agent.

Publish a message to all agents in the given namespace, or if no namespace is provided, the namespace of the sender.

No responses are expected from publishing.

message (Any) – The message to publish.

topic_id (TopicId) – The topic to publish the message to.

sender (AgentId | None, optional) – The agent which sent the message. Defaults to None.

cancellation_token (CancellationToken | None, optional) – Token used to cancel an in progress. Defaults to None.

message_id (str | None, optional) – The message id. If None, a new message id will be generated. Defaults to None. This message id must be unique. and is recommended to be a UUID.

UndeliverableException – If the message cannot be delivered.

Save the state of the entire runtime, including all hosted agents. The only way to restore the state is to pass it to load_state().

The structure of the state is implementation defined and can be any JSON serializable object.

Mapping[str, Any] – The saved state.

Load the state of the entire runtime, including all hosted agents. The state should be the same as the one returned by save_state().

state (Mapping[str, Any]) – The saved state.

Get the metadata for an agent.

agent (AgentId) – The agent id.

AgentMetadata – The agent metadata.

Save the state of a single agent.

The structure of the state is implementation defined and can be any JSON serializable object.

agent (AgentId) – The agent id.

Mapping[str, Any] – The saved state.

Load the state of a single agent.

agent (AgentId) – The agent id.

state (Mapping[str, Any]) – The saved state.

Register an agent factory with the runtime associated with a specific type. The type must be unique. This API does not add any subscriptions.

This is a low level API and usually the agent class’s register method should be used instead, as this also handles subscriptions automatically.

type (str) – The type of agent this factory creates. It is not the same as agent class name. The type parameter is used to differentiate between different factory functions rather than agent classes.

agent_factory (Callable[[], T]) – The factory that creates the agent, where T is a concrete Agent type. Inside the factory, use autogen_core.AgentInstantiationContext to access variables like the current runtime and agent ID.

expected_class (type[T] | None, optional) – The expected class of the agent, used for runtime validation of the factory. Defaults to None. If None, no validation is performed.

Register an agent instance with the runtime. The type may be reused, but each agent_id must be unique. All agent instances within a type must be of the same object type. This API does not add any subscriptions.

This is a low level API and usually the agent class’s register_instance method should be used instead, as this also handles subscriptions automatically.

agent_instance (Agent) – A concrete instance of the agent.

agent_id (AgentId) – The agent’s identifier. The agent’s type is agent_id.type.

Try to get the underlying agent instance by name and namespace. This is generally discouraged (hence the long name), but can be useful in some cases.

If the underlying agent is not accessible, this will raise an exception.

id (AgentId) – The agent id.

type (Type[T], optional) – The expected type of the agent. Defaults to Agent.

T – The concrete agent instance.

LookupError – If the agent is not found.

NotAccessibleError – If the agent is not accessible, for example if it is located remotely.

TypeError – If the agent is not of the expected type.

Add a new subscription that the runtime should fulfill when processing published messages

subscription (Subscription) – The subscription to add

Remove a subscription from the runtime

id (str) – id of the subscription to remove

LookupError – If the subscription does not exist

Add a new message serialization serializer to the runtime

Note: This will deduplicate serializers based on the type_name and data_content_type properties

serializer (MessageSerializer[Any] | Sequence[MessageSerializer[Any]]) – The serializer/s to add

Start the server in a background task.

Stop the server when a signal is received.

Bases: AgentRpcServicer

A gRPC servicer that hosts message delivery service for agents.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

Missing associated documentation comment in .proto file.

autogen_ext.models.semantic_kernel

autogen_ext.teams.magentic_one

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def my_agent_factory():
    return MyAgent()


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    await runtime.register_factory("my_agent", lambda: MyAgent())


import asyncio

asyncio.run(main())
```

Example 2 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def my_agent_factory():
    return MyAgent()


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    await runtime.register_factory("my_agent", lambda: MyAgent())


import asyncio

asyncio.run(main())
```

Example 3 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    agent = MyAgent()
    await runtime.register_agent_instance(
        agent_instance=agent, agent_id=AgentId(type="my_agent", key="default")
    )


import asyncio

asyncio.run(main())
```

Example 4 (python):
```python
from dataclasses import dataclass

from autogen_core import AgentId, AgentRuntime, MessageContext, RoutedAgent, event
from autogen_core.models import UserMessage


@dataclass
class MyMessage:
    content: str


class MyAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("My core agent")

    @event
    async def handler(self, message: UserMessage, context: MessageContext) -> None:
        print("Event received: ", message.content)


async def main() -> None:
    runtime: AgentRuntime = ...  # type: ignore
    agent = MyAgent()
    await runtime.register_agent_instance(
        agent_instance=agent, agent_id=AgentId(type="my_agent", key="default")
    )


import asyncio

asyncio.run(main())
```

---

## autogen_ext.teams.magentic_one — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.teams.magentic_one.html

**Contents:**
- autogen_ext.teams.magentic_one#

Bases: MagenticOneGroupChat

MagenticOne is a specialized group chat class that integrates various agents such as FileSurfer, WebSurfer, Coder, and Executor to solve complex tasks. To read more about the science behind Magentic-One, see the full blog post: Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks and the references below.

client (ChatCompletionClient) – The client used for model interactions.

hil_mode (bool) – Optional; If set to True, adds the UserProxyAgent to the list of agents.

input_func (InputFuncType | None) – Optional; Function to use for user input in human-in-the-loop mode.

code_executor (CodeExecutor | None) – Optional; Code executor to use. If None, will use Docker if available, otherwise local executor.

approval_func (ApprovalFuncType | None) – Optional; Function to approve code execution before running. If None, code will execute without approval.

Using Magentic-One involves interacting with a digital world designed for humans, which carries inherent risks. To minimize these risks, consider the following precautions:

Use Containers: Run all tasks in docker containers to isolate the agents and prevent direct system attacks.

Virtual Environment: Use a virtual environment to run the agents and prevent them from accessing sensitive data.

Monitor Logs: Closely monitor logs during and after execution to detect and mitigate risky behavior.

Human Oversight: Run the examples with a human in the loop to supervise the agents and prevent unintended consequences.

Limit Access: Restrict the agents’ access to the internet and other resources to prevent unauthorized actions.

Safeguard Data: Ensure that the agents do not have access to sensitive data or resources that could be compromised. Do not share sensitive information with the agents.

Be aware that agents may occasionally attempt risky actions, such as recruiting humans for help or accepting cookie agreements without human involvement. Always ensure agents are monitored and operate within a controlled environment to prevent unintended consequences. Moreover, be cautious that Magentic-One may be susceptible to prompt injection attacks from webpages.

Magentic-One is a generalist multi-agent system for solving open-ended web and file-based tasks across a variety of domains. It represents a significant step towards developing agents that can complete tasks that people encounter in their work and personal lives.

Magentic-One work is based on a multi-agent architecture where a lead Orchestrator agent is responsible for high-level planning, directing other agents, and tracking task progress. The Orchestrator begins by creating a plan to tackle the task, gathering needed facts and educated guesses in a Task Ledger that is maintained. At each step of its plan, the Orchestrator creates a Progress Ledger where it self-reflects on task progress and checks whether the task is completed. If the task is not yet completed, it assigns one of Magentic-One’s other agents a subtask to complete. After the assigned agent completes its subtask, the Orchestrator updates the Progress Ledger and continues in this way until the task is complete. If the Orchestrator finds that progress is not being made for enough steps, it can update the Task Ledger and create a new plan.

Overall, Magentic-One consists of the following agents:

Orchestrator: The lead agent responsible for task decomposition and planning, directing other agents in executing subtasks, tracking overall progress, and taking corrective actions as needed.

WebSurfer: An LLM-based agent proficient in commanding and managing the state of a Chromium-based web browser. It performs actions on the browser and reports on the new state of the web page.

FileSurfer: An LLM-based agent that commands a markdown-based file preview application to read local files of most types. It can also perform common navigation tasks such as listing the contents of directories and navigating a folder structure.

Coder: An LLM-based agent specialized in writing code, analyzing information collected from other agents, or creating new artifacts.

ComputerTerminal: Provides the team with access to a console shell where the Coder’s programs can be executed, and where new programming libraries can be installed.

Together, Magentic-One’s agents provide the Orchestrator with the tools and capabilities needed to solve a broad variety of open-ended problems, as well as the ability to autonomously adapt to, and act in, dynamic and ever-changing web and file-system environments.

autogen_ext.runtimes.grpc

autogen_ext.tools.azure

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[magentic-one]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[magentic-one]"
```

Example 3 (python):
```python
# Autonomously complete a coding task:
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.teams.magentic_one import MagenticOne
from autogen_agentchat.ui import Console


async def example_usage():
    client = OpenAIChatCompletionClient(model="gpt-4o")
    m1 = MagenticOne(client=client)  # Uses DockerCommandLineCodeExecutor by default
    task = "Write a Python script to fetch data from an API."
    result = await Console(m1.run_stream(task=task))
    print(result)


if __name__ == "__main__":
    asyncio.run(example_usage())
```

Example 4 (python):
```python
# Autonomously complete a coding task:
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.teams.magentic_one import MagenticOne
from autogen_agentchat.ui import Console


async def example_usage():
    client = OpenAIChatCompletionClient(model="gpt-4o")
    m1 = MagenticOne(client=client)  # Uses DockerCommandLineCodeExecutor by default
    task = "Write a Python script to fetch data from an API."
    result = await Console(m1.run_stream(task=task))
    print(result)


if __name__ == "__main__":
    asyncio.run(example_usage())
```

---

## Azure AI Foundry Agent — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/extensions-user-guide/azure-foundry-agent.html

**Contents:**
- Azure AI Foundry Agent#
- Bing Search Grounding#
- Prerequisites#

In AutoGen, you can build and deploy agents that are backed by the Azure AI Foundry Agent Service using the AzureAIAgent class. Here, important aspects of the agent including the provisioned model, tools (e.g, code interpreter, bing search grounding, file search etc.), observability, and security are managed by Azure. This allows you to focus on building your agent without worrying about the underlying infrastructure.

In this guide, we will explore an example of creating an Azure AI Foundry Agent using the AzureAIAgent that can address tasks using the Azure Grounding with Bing Search tool.

An AzureAIAgent can be assigned a set of tools including Grounding with Bing Search.

Grounding with Bing Search allows your Azure AI Agents to incorporate real-time public web data when generating responses. You need to create a Grounding with Bing Search resource, and then connect this resource to your Azure AI Agents. When a user sends a query, Azure AI Agents decide if Grounding with Bing Search should be leveraged or not. If so, it will leverage Bing to search over public web data and return relevant chunks. Lastly, Azure AI Agents will use returned chunks to generate a response.

You need to have an Azure subscription.

You need to have the Azure CLI installed and configured. (also login using the command az login to enable default credentials)

You need to have the autogen-ext[azure] package installed.

You can create a Grounding with Bing Search resource in the Azure portal. Note that you will need to have owner or contributor role in your subscription or resource group to create it. Once you have created your resource, you can then pass it to the Azure Foundry Agent using the resource name.

In the following example, we will create a new Azure Foundry Agent that uses the Grounding with Bing Search resource.

Note that you can also provide other Azure Backed tools and local client side functions to the agent.

See the AzureAIAgent class api documentation for more details on how to create an Azure Foundry Agent.

ACA Dynamic Sessions Code Executor

**Examples:**

Example 1 (markdown):
```markdown
# pip install "autogen-ext[azure]"  # For Azure AI Foundry Agent Service
```

Example 2 (markdown):
```markdown
# pip install "autogen-ext[azure]"  # For Azure AI Foundry Agent Service
```

Example 3 (python):
```python
import os

import dotenv
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_ext.agents.azure import AzureAIAgent
from azure.ai.agents.models import BingGroundingTool
from azure.ai.projects.aio import AIProjectClient
from azure.identity.aio import DefaultAzureCredential

dotenv.load_dotenv()


async def bing_example() -> None:
    async with DefaultAzureCredential() as credential:  # type: ignore
        async with AIProjectClient(  # type: ignore
            credential=credential, endpoint=os.getenv("AZURE_PROJECT_ENDPOINT", "")
        ) as project_client:
            conn = await project_client.connections.get(name=os.getenv("BING_CONNECTION_NAME", ""))

            bing_tool = BingGroundingTool(conn.id)
            agent_with_bing_grounding = AzureAIAgent(
                name="bing_agent",
                description="An AI assistant with Bing grounding",
                project_client=project_client,
                deployment_name="gpt-4o",
                instructions="You are a helpful assistant.",
                tools=bing_tool.definitions,
                metadata={"source": "AzureAIAgent"},
            )

            # For the bing grounding tool to return the citations, the message must contain an instruction for the model to do return them.
            # For example: "Please provide citations for the answers"

            result = await agent_with_bing_grounding.on_messages(
                messages=[
                    TextMessage(
                        content="What is Microsoft's annual leave policy? Provide citations for your answers.",
                        source="user",
                    )
                ],
                cancellation_token=CancellationToken(),
                message_limit=5,
            )
            print(result)


await bing_example()
```

Example 4 (python):
```python
import os

import dotenv
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_ext.agents.azure import AzureAIAgent
from azure.ai.agents.models import BingGroundingTool
from azure.ai.projects.aio import AIProjectClient
from azure.identity.aio import DefaultAzureCredential

dotenv.load_dotenv()


async def bing_example() -> None:
    async with DefaultAzureCredential() as credential:  # type: ignore
        async with AIProjectClient(  # type: ignore
            credential=credential, endpoint=os.getenv("AZURE_PROJECT_ENDPOINT", "")
        ) as project_client:
            conn = await project_client.connections.get(name=os.getenv("BING_CONNECTION_NAME", ""))

            bing_tool = BingGroundingTool(conn.id)
            agent_with_bing_grounding = AzureAIAgent(
                name="bing_agent",
                description="An AI assistant with Bing grounding",
                project_client=project_client,
                deployment_name="gpt-4o",
                instructions="You are a helpful assistant.",
                tools=bing_tool.definitions,
                metadata={"source": "AzureAIAgent"},
            )

            # For the bing grounding tool to return the citations, the message must contain an instruction for the model to do return them.
            # For example: "Please provide citations for the answers"

            result = await agent_with_bing_grounding.on_messages(
                messages=[
                    TextMessage(
                        content="What is Microsoft's annual leave policy? Provide citations for your answers.",
                        source="user",
                    )
                ],
                cancellation_token=CancellationToken(),
                message_limit=5,
            )
            print(result)


await bing_example()
```

---

## Code Execution — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/code-execution-groupchat.html

**Contents:**
- Code Execution#

In this section we explore creating custom agents to handle code generation and execution. These tasks can be handled using the provided Agent implementations found here AssistantAgent(), CodeExecutorAgent(); but this guide will show you how to implement custom, lightweight agents that can replace their functionality. This simple example implements two agents that create a plot of Tesla’s and Nvidia’s stock returns.

We first define the agent classes and their respective procedures for handling messages. We create two agent classes: Assistant and Executor. The Assistant agent writes code and the Executor agent executes the code. We also create a Message data class, which defines the messages that are passed between the agents.

Code generated in this example is run within a Docker container. Please ensure Docker is installed and running prior to running the example. Local code execution is available (LocalCommandLineCodeExecutor) but is not recommended due to the risk of running LLM generated code in your local environment.

You might have already noticed, the agents’ logic, whether it is using model or code executor, is completely decoupled from how messages are delivered. This is the core idea: the framework provides a communication infrastructure, and the agents are responsible for their own logic. We call the communication infrastructure an Agent Runtime.

Agent runtime is a key concept of this framework. Besides delivering messages, it also manages agents’ lifecycle. So the creation of agents are handled by the runtime.

The following code shows how to register and run the agents using SingleThreadedAgentRuntime, a local embedded agent runtime implementation.

From the agent’s output, we can see the plot of Tesla’s and Nvidia’s stock returns has been created.

AutoGen also supports a distributed agent runtime, which can host agents running on different processes or machines, with different identities, languages and dependencies.

To learn how to use agent runtime, communication, message handling, and subscription, please continue reading the sections following this quick start.

**Examples:**

Example 1 (python):
```python
import re
from dataclasses import dataclass
from typing import List

from autogen_core import DefaultTopicId, MessageContext, RoutedAgent, default_subscription, message_handler
from autogen_core.code_executor import CodeBlock, CodeExecutor
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)


@dataclass
class Message:
    content: str


@default_subscription
class Assistant(RoutedAgent):
    def __init__(self, model_client: ChatCompletionClient) -> None:
        super().__init__("An assistant agent.")
        self._model_client = model_client
        self._chat_history: List[LLMMessage] = [
            SystemMessage(
                content="""Write Python script in markdown block, and it will be executed.
Always save figures to file in the current directory. Do not use plt.show(). All code required to complete this task must be contained within a single response.""",
            )
        ]

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        self._chat_history.append(UserMessage(content=message.content, source="user"))
        result = await self._model_client.create(self._chat_history)
        print(f"\n{'-'*80}\nAssistant:\n{result.content}")
        self._chat_history.append(AssistantMessage(content=result.content, source="assistant"))  # type: ignore
        await self.publish_message(Message(content=result.content), DefaultTopicId())  # type: ignore


def extract_markdown_code_blocks(markdown_text: str) -> List[CodeBlock]:
    pattern = re.compile(r"```(?:\s*([\w\+\-]+))?\n([\s\S]*?)```")
    matches = pattern.findall(markdown_text)
    code_blocks: List[CodeBlock] = []
    for match in matches:
        language = match[0].strip() if match[0] else ""
        code_content = match[1]
        code_blocks.append(CodeBlock(code=code_content, language=language))
    return code_blocks


@default_subscription
class Executor(RoutedAgent):
    def __init__(self, code_executor: CodeExecutor) -> None:
        super().__init__("An executor agent.")
        self._code_executor = code_executor

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        code_blocks = extract_markdown_code_blocks(message.content)
        if code_blocks:
            result = await self._code_executor.execute_code_blocks(
                code_blocks, cancellation_token=ctx.cancellation_token
            )
            print(f"\n{'-'*80}\nExecutor:\n{result.output}")
            await self.publish_message(Message(content=result.output), DefaultTopicId())
```

Example 2 (python):
```python
import re
from dataclasses import dataclass
from typing import List

from autogen_core import DefaultTopicId, MessageContext, RoutedAgent, default_subscription, message_handler
from autogen_core.code_executor import CodeBlock, CodeExecutor
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)


@dataclass
class Message:
    content: str


@default_subscription
class Assistant(RoutedAgent):
    def __init__(self, model_client: ChatCompletionClient) -> None:
        super().__init__("An assistant agent.")
        self._model_client = model_client
        self._chat_history: List[LLMMessage] = [
            SystemMessage(
                content="""Write Python script in markdown block, and it will be executed.
Always save figures to file in the current directory. Do not use plt.show(). All code required to complete this task must be contained within a single response.""",
            )
        ]

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        self._chat_history.append(UserMessage(content=message.content, source="user"))
        result = await self._model_client.create(self._chat_history)
        print(f"\n{'-'*80}\nAssistant:\n{result.content}")
        self._chat_history.append(AssistantMessage(content=result.content, source="assistant"))  # type: ignore
        await self.publish_message(Message(content=result.content), DefaultTopicId())  # type: ignore


def extract_markdown_code_blocks(markdown_text: str) -> List[CodeBlock]:
    pattern = re.compile(r"```(?:\s*([\w\+\-]+))?\n([\s\S]*?)```")
    matches = pattern.findall(markdown_text)
    code_blocks: List[CodeBlock] = []
    for match in matches:
        language = match[0].strip() if match[0] else ""
        code_content = match[1]
        code_blocks.append(CodeBlock(code=code_content, language=language))
    return code_blocks


@default_subscription
class Executor(RoutedAgent):
    def __init__(self, code_executor: CodeExecutor) -> None:
        super().__init__("An executor agent.")
        self._code_executor = code_executor

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        code_blocks = extract_markdown_code_blocks(message.content)
        if code_blocks:
            result = await self._code_executor.execute_code_blocks(
                code_blocks, cancellation_token=ctx.cancellation_token
            )
            print(f"\n{'-'*80}\nExecutor:\n{result.output}")
            await self.publish_message(Message(content=result.output), DefaultTopicId())
```

Example 3 (python):
```python
import tempfile

from autogen_core import SingleThreadedAgentRuntime
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient

work_dir = tempfile.mkdtemp()

# Create an local embedded runtime.
runtime = SingleThreadedAgentRuntime()

async with DockerCommandLineCodeExecutor(work_dir=work_dir) as executor:  # type: ignore[syntax]
    # Register the assistant and executor agents by providing
    # their agent types, the factory functions for creating instance and subscriptions.
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        # api_key="YOUR_API_KEY"
    )
    await Assistant.register(
        runtime,
        "assistant",
        lambda: Assistant(model_client=model_client),
    )
    await Executor.register(runtime, "executor", lambda: Executor(executor))

    # Start the runtime and publish a message to the assistant.
    runtime.start()
    await runtime.publish_message(
        Message("Create a plot of NVIDA vs TSLA stock returns YTD from 2024-01-01."), DefaultTopicId()
    )

    # Wait for the runtime to stop when idle.
    await runtime.stop_when_idle()
    # Close the connection to the model client.
    await model_client.close()
```

Example 4 (python):
```python
import tempfile

from autogen_core import SingleThreadedAgentRuntime
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient

work_dir = tempfile.mkdtemp()

# Create an local embedded runtime.
runtime = SingleThreadedAgentRuntime()

async with DockerCommandLineCodeExecutor(work_dir=work_dir) as executor:  # type: ignore[syntax]
    # Register the assistant and executor agents by providing
    # their agent types, the factory functions for creating instance and subscriptions.
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        # api_key="YOUR_API_KEY"
    )
    await Assistant.register(
        runtime,
        "assistant",
        lambda: Assistant(model_client=model_client),
    )
    await Executor.register(runtime, "executor", lambda: Executor(executor))

    # Start the runtime and publish a message to the assistant.
    runtime.start()
    await runtime.publish_message(
        Message("Create a plot of NVIDA vs TSLA stock returns YTD from 2024-01-01."), DefaultTopicId()
    )

    # Wait for the runtime to stop when idle.
    await runtime.stop_when_idle()
    # Close the connection to the model client.
    await model_client.close()
```

---

## Concurrent Agents — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/concurrent-agents.html

**Contents:**
- Concurrent Agents#
- Single Message & Multiple Processors#
- Multiple messages & Multiple Processors#
  - Collecting Results#
- Direct Messages#
- Additional Resources#

In this section, we explore the use of multiple agents working concurrently. We cover three main patterns:

Single Message & Multiple Processors Demonstrates how a single message can be processed by multiple agents subscribed to the same topic simultaneously.

Multiple Messages & Multiple Processors Illustrates how specific message types can be routed to dedicated agents based on topics.

Direct Messaging Focuses on sending messages between agents and from the runtime to agents.

The first pattern shows how a single message can be processed by multiple agents simultaneously:

Each Processor agent subscribes to the default topic using the default_subscription() decorator.

When publishing a message to the default topic, all registered agents will process the message independently.

Below, we are subscribing Processor using the default_subscription() decorator, there’s an alternative way to subscribe an agent without using decorators altogether as shown in Subscribe and Publish to Topics, this way the same agent class can be subscribed to different topics.

Second, this pattern demonstrates routing different types of messages to specific processors:

UrgentProcessor subscribes to the “urgent” topic

NormalProcessor subscribes to the “normal” topic

We make an agent subscribe to a specific topic type using the type_subscription() decorator.

After registering the agents, we can publish messages to the “urgent” and “normal” topics:

In the previous example, we relied on console printing to verify task completion. However, in real applications, we typically want to collect and process the results programmatically.

To collect these messages, we’ll use a ClosureAgent. We’ve defined a dedicated topic TASK_RESULTS_TOPIC_TYPE where both UrgentProcessor and NormalProcessor publish their results. The ClosureAgent will then process messages from this topic.

In contrast to the previous patterns, this pattern focuses on direct messages. Here we demonstrate two ways to send them:

Direct messaging between agents

Sending messages from the runtime to specific agents

Things to consider in the example below:

Messages are addressed using the AgentId.

The sender can expect to receive a response from the target agent.

We register the WorkerAgent class only once; however, we send tasks to two different workers.

How? As stated in Agent lifecycle, when delivering a message using an AgentId, the runtime will either fetch the instance or create one if it doesn’t exist. In this case, the runtime creates two instances of workers when sending those two messages.

If you’re interested in more about concurrent processing, check out the Mixture of Agents pattern, which relies heavily on concurrent agents.

**Examples:**

Example 1 (python):
```python
import asyncio
from dataclasses import dataclass

from autogen_core import (
    AgentId,
    ClosureAgent,
    ClosureContext,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    default_subscription,
    message_handler,
    type_subscription,
)
```

Example 2 (python):
```python
import asyncio
from dataclasses import dataclass

from autogen_core import (
    AgentId,
    ClosureAgent,
    ClosureContext,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    default_subscription,
    message_handler,
    type_subscription,
)
```

Example 3 (python):
```python
@dataclass
class Task:
    task_id: str


@dataclass
class TaskResponse:
    task_id: str
    result: str
```

Example 4 (python):
```python
@dataclass
class Task:
    task_id: str


@dataclass
class TaskResponse:
    task_id: str
    result: str
```

---

## Distributed Agent Runtime — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/distributed-agent-runtime.html

**Contents:**
- Distributed Agent Runtime#
- Cross-Language Runtimes#
- Next Steps#

The distributed agent runtime is an experimental feature. Expect breaking changes to the API.

A distributed agent runtime facilitates communication and agent lifecycle management across process boundaries. It consists of a host service and at least one worker runtime.

The host service maintains connections to all active worker runtimes, facilitates message delivery, and keeps sessions for all direct messages (i.e., RPCs). A worker runtime processes application code (agents) and connects to the host service. It also advertises the agents which they support to the host service, so the host service can deliver messages to the correct worker.

The distributed agent runtime requires extra dependencies, install them using:

We can start a host service using GrpcWorkerAgentRuntimeHost.

The above code starts the host service in the background and accepts worker connections on port 50051.

Before running worker runtimes, let’s define our agent. The agent will publish a new message on every message it receives. It also keeps track of how many messages it has published, and stops publishing new messages once it has published 5 messages.

Now we can set up the worker agent runtimes. We use GrpcWorkerAgentRuntime. We set up two worker runtimes. Each runtime hosts one agent. All agents publish and subscribe to the default topic, so they can see all messages being published.

To run the agents, we publish a message from a worker.

We can see each agent published exactly 5 messages.

To stop the worker runtimes, we can call stop().

We can call stop() to stop the host service.

The process described above is largely the same, however all message types MUST use shared protobuf schemas for all cross-agent message types.

To see complete examples of using distributed runtime, please take a look at the following samples:

Distributed Semantic Router

Distributed Group Chat

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext[grpc]"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext[grpc]"
```

Example 3 (sql):
```sql
from autogen_ext.runtimes.grpc import GrpcWorkerAgentRuntimeHost

host = GrpcWorkerAgentRuntimeHost(address="localhost:50051")
host.start()  # Start a host service in the background.
```

Example 4 (sql):
```sql
from autogen_ext.runtimes.grpc import GrpcWorkerAgentRuntimeHost

host = GrpcWorkerAgentRuntimeHost(address="localhost:50051")
host.start()  # Start a host service in the background.
```

---

## Extracting Results with an Agent — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/extracting-results-with-an-agent.html

**Contents:**
- Extracting Results with an Agent#

When running a multi-agent system to solve some task, you may want to extract the result of the system once it has reached termination. This guide showcases one way to achieve this. Given that agent instances are not directly accessible from the outside, we will use an agent to publish the final result to an accessible location.

If you model your system to publish some FinalResult type then you can create an agent whose sole job is to subscribe to this and make it available externally. For simple agents like this the ClosureAgent is an option to reduce the amount of boilerplate code. This allows you to define a function that will be associated as the agent’s message handler. In this example, we’re going to use a queue shared between the agent and the external code to pass the result.

When considering how to extract results from a multi-agent system, you must always consider the subscriptions of the agent and the topics they publish to. This is because the agent will only receive messages from topics it is subscribed to.

Define a dataclass for the final result.

Create a queue to pass the result from the agent to the external code.

Create a function closure for outputting the final result to the queue. The function must follow the signature Callable[[AgentRuntime, AgentId, T, MessageContext], Awaitable[Any]] where T is the type of the message the agent will receive. You can use union types to handle multiple message types.

Let’s create a runtime and register a ClosureAgent that will publish the final result to the queue.

We can simulate the collection of final results by publishing them directly to the runtime.

We can take a look at the queue to see the final result.

User Approval for Tool Execution using Intervention Handler

OpenAI Assistant Agent

**Examples:**

Example 1 (python):
```python
import asyncio
from dataclasses import dataclass

from autogen_core import (
    ClosureAgent,
    ClosureContext,
    DefaultSubscription,
    DefaultTopicId,
    MessageContext,
    SingleThreadedAgentRuntime,
)
```

Example 2 (python):
```python
import asyncio
from dataclasses import dataclass

from autogen_core import (
    ClosureAgent,
    ClosureContext,
    DefaultSubscription,
    DefaultTopicId,
    MessageContext,
    SingleThreadedAgentRuntime,
)
```

Example 3 (python):
```python
@dataclass
class FinalResult:
    value: str
```

Example 4 (python):
```python
@dataclass
class FinalResult:
    value: str
```

---

## FAQs — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/faqs.html

**Contents:**
- FAQs#
- How do I get the underlying agent instance?#
- How do I call call a function on an agent?#
- Why do I need to use a factory to register an agent?#
- How do I increase the GRPC message size?#
- What are model capabilities and how do I specify them?#

Agents might be distributed across multiple machines, so the underlying agent instance is intentionally discouraged from being accessed. If the agent is definitely running on the same machine, you can access the agent instance by calling autogen_core.AgentRuntime.try_get_underlying_agent_instance() on the AgentRuntime. If the agent is not available this will throw an exception.

Since the instance itself is not accessible, you can’t call a function on an agent directly. Instead, you should create a type to represent the function call and its arguments, and then send that message to the agent. Then in the agent, create a handler for that message type and implement the required logic. This also supports returning a response to the caller.

This allows your agent to work in a distributed environment a well as a local one.

An autogen_core.AgentId is composed of a type and a key. The type corresponds to the factory that created the agent, and the key is a runtime, data dependent key for this instance.

The key can correspond to a user id, a session id, or could just be “default” if you don’t need to differentiate between instances. Each unique key will create a new instance of the agent, based on the factory provided. This allows the system to automatically scale to different instances of the same agent, and to manage the lifecycle of each instance independently based on how you choose to handle keys in your application.

If you need to provide custom gRPC options, such as overriding the max_send_message_length and max_receive_message_length, you can define an extra_grpc_config variable and pass it to both the GrpcWorkerAgentRuntimeHost and GrpcWorkerAgentRuntime instances.

Note: When GrpcWorkerAgentRuntime creates a host connection for the clients, it uses DEFAULT_GRPC_CONFIG from HostConnection class as default set of values which will can be overriden if you pass parameters with the same name using extra_grpc_config.

Model capabilites are additional capabilities an LLM may have beyond the standard natural language features. There are currently 3 additional capabilities that can be specified within Autogen

vision: The model is capable of processing and interpreting image data.

function_calling: The model has the capacity to accept function descriptions; such as the function name, purpose, input parameters, etc; and can respond with an appropriate function to call including any necessary parameters.

json_output: The model is capable of outputting responses to conform with a specified json format.

Model capabilities can be passed into a model, which will override the default definitions. These capabilities will not affect what the underlying model is actually capable of, but will allow or disallow behaviors associated with them. This is particularly useful when using local LLMs.

Tracking LLM usage with a logger

**Examples:**

Example 1 (markdown):
```markdown
# Define custom gRPC options
extra_grpc_config = [
    ("grpc.max_send_message_length", new_max_size),
    ("grpc.max_receive_message_length", new_max_size),
]

# Create instances of GrpcWorkerAgentRuntimeHost and GrpcWorkerAgentRuntime with the custom gRPC options

host = GrpcWorkerAgentRuntimeHost(address=host_address, extra_grpc_config=extra_grpc_config)
worker1 = GrpcWorkerAgentRuntime(host_address=host_address, extra_grpc_config=extra_grpc_config)
```

Example 2 (markdown):
```markdown
# Define custom gRPC options
extra_grpc_config = [
    ("grpc.max_send_message_length", new_max_size),
    ("grpc.max_receive_message_length", new_max_size),
]

# Create instances of GrpcWorkerAgentRuntimeHost and GrpcWorkerAgentRuntime with the custom gRPC options

host = GrpcWorkerAgentRuntimeHost(address=host_address, extra_grpc_config=extra_grpc_config)
worker1 = GrpcWorkerAgentRuntime(host_address=host_address, extra_grpc_config=extra_grpc_config)
```

Example 3 (sql):
```sql
from autogen_ext.models.openai import OpenAIChatCompletionClient

client = OpenAIChatCompletionClient(
    model="gpt-4o",
    api_key="YourApiKey",
    model_capabilities={
        "vision": True,
        "function_calling": False,
        "json_output": False,
    }
)
```

Example 4 (sql):
```sql
from autogen_ext.models.openai import OpenAIChatCompletionClient

client = OpenAIChatCompletionClient(
    model="gpt-4o",
    api_key="YourApiKey",
    model_capabilities={
        "vision": True,
        "function_calling": False,
        "json_output": False,
    }
)
```

---

## Group Chat — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/group-chat.html

**Contents:**
- Group Chat#
- Message Protocol#
- Base Group Chat Agent#
- Writer and Editor Agents#
- Illustrator Agent with Image Generation#
- User Agent#
- Group Chat Manager#
- Creating the Group Chat#
- Running the Group Chat#
- Next Steps#

Group chat is a design pattern where a group of agents share a common thread of messages: they all subscribe and publish to the same topic. Each participant agent is specialized for a particular task, such as writer, illustrator, and editor in a collaborative writing task. You can also include an agent to represent a human user to help guide the agents when needed.

In a group chat, participants take turn to publish a message, and the process is sequential – only one agent is working at a time. Under the hood, the order of turns is maintained by a Group Chat Manager agent, which selects the next agent to speak upon receiving a message. The exact algorithm for selecting the next agent can vary based on your application requirements. Typically, a round-robin algorithm or a selector with an LLM model is used.

Group chat is useful for dynamically decomposing a complex task into smaller ones that can be handled by specialized agents with well-defined roles. It is also possible to nest group chats into a hierarchy with each participant a recursive group chat.

In this example, we use AutoGen’s Core API to implement the group chat pattern using event-driven agents. Please first read about Topics and Subscriptions to understand the concepts and then Messages and Communication to learn the API usage for pub-sub. We will demonstrate a simple example of a group chat with a LLM-based selector for the group chat manager, to create content for a children’s story book.

While this example illustrates the group chat mechanism, it is complex and represents a starting point from which you can build your own group chat system with custom agents and speaker selection algorithms. The AgentChat API has a built-in implementation of selector group chat. You can use that if you do not want to use the Core API.

We will be using the rich library to display the messages in a nice format.

The message protocol for the group chat pattern is simple.

To start, user or an external agent publishes a GroupChatMessage message to the common topic of all participants.

The group chat manager selects the next speaker, sends out a RequestToSpeak message to that agent.

The agent publishes a GroupChatMessage message to the common topic upon receiving the RequestToSpeak message.

This process continues until a termination condition is reached at the group chat manager, which then stops issuing RequestToSpeak message, and the group chat ends.

The following diagram illustrates steps 2 to 4 above.

Let’s first define the agent class that only uses LLM models to generate text. This is will be used as the base class for all AI agents in the group chat.

Using the base class, we can define the writer and editor agents with different system messages.

Now let’s define the IllustratorAgent which uses a DALL-E model to generate an illustration based on the description provided. We set up the image generator as a tool using FunctionTool wrapper, and use a model client to make the tool call.

With all the AI agents defined, we can now define the user agent that will take the role of the human user in the group chat.

The UserAgent implementation uses console input to get the user’s input. In a real-world scenario, you can replace this by communicating with a frontend, and subscribe to responses from the frontend.

Lastly, we define the GroupChatManager agent which manages the group chat and selects the next agent to speak using an LLM. The group chat manager checks if the editor has approved the draft by looking for the "APPORVED" keyword in the message. If the editor has approved the draft, the group chat manager stops selecting the next speaker, and the group chat ends.

The group chat manager’s constructor takes a list of participants’ topic types as an argument. To prompt the next speaker to work, the GroupChatManager agent publishes a RequestToSpeak message to the next participant’s topic.

In this example, we also make sure the group chat manager always picks a different participant to speak next, by keeping track of the previous speaker. This helps to ensure the group chat is not dominated by a single participant.

To set up the group chat, we create a SingleThreadedAgentRuntime and register the agents’ factories and subscriptions.

Each participant agent subscribes to both the group chat topic as well as its own topic in order to receive RequestToSpeak messages, while the group chat manager agent only subcribes to the group chat topic.

We start the runtime and publish a GroupChatMessage for the task to start the group chat.

From the output, you can see the writer, illustrator, and editor agents taking turns to speak and collaborate to generate a picture book, before asking for final approval from the user.

This example showcases a simple implementation of the group chat pattern – it is not meant to be used in real applications. You can improve the speaker selection algorithm. For example, you can avoid using LLM when simple rules are sufficient and more reliable: you can use a rule that the editor always speaks after the writer.

The AgentChat API provides a high-level API for selector group chat. It has more features but mostly shares the same design as this implementation.

**Examples:**

Example 1 (markdown):
```markdown
# ! pip install rich
```

Example 2 (markdown):
```markdown
# ! pip install rich
```

Example 3 (python):
```python
import json
import string
import uuid
from typing import List

import openai
from autogen_core import (
    DefaultTopicId,
    FunctionCall,
    Image,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import FunctionTool
from autogen_ext.models.openai import OpenAIChatCompletionClient
from IPython.display import display  # type: ignore
from pydantic import BaseModel
from rich.console import Console
from rich.markdown import Markdown
```

Example 4 (python):
```python
import json
import string
import uuid
from typing import List

import openai
from autogen_core import (
    DefaultTopicId,
    FunctionCall,
    Image,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import FunctionTool
from autogen_ext.models.openai import OpenAIChatCompletionClient
from IPython.display import display  # type: ignore
from pydantic import BaseModel
from rich.console import Console
from rich.markdown import Markdown
```

---

## Handoffs — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/handoffs.html

**Contents:**
- Handoffs#
- Scenario#
- Message Protocol#
- AI Agent#
- Human Agent#
- User Agent#
- Tools for the AI agents#
- Topic types for the agents#
- Delegate tools for the AI agents#
- Creating the team#

Handoff is a multi-agent design pattern introduced by OpenAI in an experimental project called Swarm. The key idea is to let agent delegate tasks to other agents using a special tool call.

We can use the AutoGen Core API to implement the handoff pattern using event-driven agents. Using AutoGen (v0.4+) provides the following advantages over the OpenAI implementation and the previous version (v0.2):

It can scale to distributed environment by using distributed agent runtime.

It affords the flexibility of bringing your own agent implementation.

The natively async API makes it easy to integrate with UI and other systems.

This notebook demonstrates a simple implementation of the handoff pattern. It is recommended to read Topics and Subscriptions to understand the basic concepts of pub-sub and event-driven agents.

We are currently working on a high-level API for the handoff pattern in AgentChat so you can get started much more quickly.

This scenario is modified based on the OpenAI example.

Consider a customer service scenario where a customer is trying to get a refund for a product, or purchase a new product from a chatbot. The chatbot is a multi-agent team consisting of three AI agents and one human agent:

Triage Agent, responsible for understanding the customer’s request and deciding which other agents to hand off to.

Refund Agent, responsible for processing refund requests.

Sales Agent, responsible for processing sales requests.

Human Agent, responsible for handling complex requests that the AI agents can’t handle.

In this scenario, the customer interacts with the chatbot through a User Agent.

The diagram below shows the interaction topology of the agents in this scenario.

Let’s implement this scenario using AutoGen Core. First, we need to import the necessary modules.

Before everything, we need to define the message protocol for the agents to communicate. We are using event-driven pub-sub communication, so these message types will be used as events.

UserLogin is a message published by the runtime when a user logs in and starts a new session.

UserTask is a message containing the chat history of the user session. When an AI agent hands off a task to other agents, it also publishes a UserTask message.

AgentResponse is a message published by the AI agents and the Human Agent, it also contains the chat history as well as a topic type for the customer to reply to.

We start with the AIAgent class, which is the class for all AI agents (i.e., Triage, Sales, and Issue and Repair Agents) in the multi-agent chatbot. An AIAgent uses a ChatCompletionClient to generate responses. It can use regular tools directly or delegate tasks to other agents using delegate_tools. It subscribes to topic type agent_topic_type to receive messages from the customer, and sends message to the customer by publishing to the topic type user_topic_type.

In the handle_task method, the agent first generates a response using the model. If the response contains a handoff tool call, the agent delegates the task to another agent by publishing a UserTask message to the topic specified in the tool call result. If the response is a regular tool call, the agent executes the tool and makes another call to the model to generate the next response, until the response is not a tool call.

When the model response is not a tool call, the agent sends an AgentResponse message to the customer by publishing to the user_topic_type.

The HumanAgent class is a proxy for the human in the chatbot. It is used to handle requests that the AI agents can’t handle. The HumanAgent subscribes to the topic type agent_topic_type to receive messages and publishes to the topic type user_topic_type to send messages to the customer.

In this implementation, the HumanAgent simply uses console to get your input. In a real-world application, you can improve this design as follows:

In the handle_user_task method, send a notification via a chat application like Teams or Slack.

The chat application publishes the human’s response via the runtime to the topic specified by agent_topic_type

Create another message handler to process the human’s response and send it back to the customer.

The UserAgent class is a proxy for the customer that talks to the chatbot. It handles two message types: UserLogin and AgentResponse. When the UserAgent receives a UserLogin message, it starts a new session with the chatbot and publishes a UserTask message to the AI agent that subscribes to the topic type agent_topic_type. When the UserAgent receives an AgentResponse message, it prompts the user with the response from the chatbot.

In this implementation, the UserAgent uses console to get your input. In a real-world application, you can improve the human interaction using the same idea described in the HumanAgent section above.

The AI agents can use regular tools to complete tasks if they don’t need to hand off the task to other agents. We define the tools using simple functions and create the tools using the FunctionTool wrapper.

We define the topic types each of the agents will subscribe to. Read more about topic types in the Topics and Subscriptions.

Besides regular tools, the AI agents can delegate tasks to other agents using special tools called delegate tools. The concept of delegate tool is only used in this design pattern, and the delegate tools are also defined as simple functions. We differentiate the delegate tools from regular tools in this design pattern because when an AI agent calls a delegate tool, we transfer the task to another agent instead of continue generating responses using the model in the same agent.

We have defined the AI agents, the Human Agent, the User Agent, the tools, and the topic types. Now we can create the team of agents.

For the AI agents, we use the OpenAIChatCompletionClient and gpt-4o-mini model.

After creating the agent runtime, we register each of the agent by providing an agent type and a factory method to create agent instance. The runtime is responsible for managing the agent lifecycle so we don’t need to instantiate the agents ourselves. Read more about agent runtime in Agent Runtime Environments and agent lifecycle in Agent Identity and Lifecycle.

In the code below, you can see we are using AIAgent class to define the Triage, Sales, and Issue and Repair Agents. We added regular tools and delegate tools to each of them. We also added subscriptions to the topic types for each of the agents.

Finally, we can start the runtime and simulate a user session by publishing a UserLogin message to the runtime. The message is published to the topic ID with type set to user_topic_type and source set to a unique session_id. This session_id will be used to create all topic IDs in this user session and will also be used to create the agent ID for all the agents in this user session. To read more about how topic ID and agent ID are created, read Agent Identity and Lifecycle. and Topics and Subscriptions.

This notebook demonstrates how to implement the handoff pattern using AutoGen Core. You can continue to improve this design by adding more agents and tools, or create a better user interface for the User Agent and Human Agent.

You are welcome to share your work on our community forum.

**Examples:**

Example 1 (python):
```python
import json
import uuid
from typing import List, Tuple

from autogen_core import (
    FunctionCall,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    FunctionExecutionResult,
    FunctionExecutionResultMessage,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import FunctionTool, Tool
from autogen_ext.models.openai import OpenAIChatCompletionClient
from pydantic import BaseModel
```

Example 2 (python):
```python
import json
import uuid
from typing import List, Tuple

from autogen_core import (
    FunctionCall,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    FunctionExecutionResult,
    FunctionExecutionResultMessage,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import FunctionTool, Tool
from autogen_ext.models.openai import OpenAIChatCompletionClient
from pydantic import BaseModel
```

Example 3 (php):
```php
class UserLogin(BaseModel):
    pass


class UserTask(BaseModel):
    context: List[LLMMessage]


class AgentResponse(BaseModel):
    reply_to_topic_type: str
    context: List[LLMMessage]
```

Example 4 (php):
```php
class UserLogin(BaseModel):
    pass


class UserTask(BaseModel):
    context: List[LLMMessage]


class AgentResponse(BaseModel):
    reply_to_topic_type: str
    context: List[LLMMessage]
```

---

## Intro — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/intro.html

**Contents:**
- Intro#

Agents can work together in a variety of ways to solve problems. Research works like AutoGen, MetaGPT and ChatDev have shown multi-agent systems out-performing single agent systems at complex tasks like software development.

A multi-agent design pattern is a structure that emerges from message protocols: it describes how agents interact with each other to solve problems. For example, the tool-equipped agent in the previous section employs a design pattern called ReAct, which involves an agent interacting with tools.

You can implement any multi-agent design pattern using AutoGen agents. In the next two sections, we will discuss two common design patterns: group chat for task decomposition, and reflection for robustness.

Command Line Code Executors

---

## Local LLMs with LiteLLM & Ollama — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/local-llms-ollama-litellm.html

**Contents:**
- Local LLMs with LiteLLM & Ollama#

In this notebook we’ll create two agents, Joe and Cathy who like to tell jokes to each other. The agents will use locally running LLMs.

Follow the guide at https://microsoft.github.io/autogen/docs/topics/non-openai-models/local-litellm-ollama/ to understand how to install LiteLLM and Ollama.

We encourage going through the link, but if you’re in a hurry and using Linux, run these:

This will run the proxy server and it will be available at ‘http://0.0.0.0:4000/’.

To get started, let’s import some classes.

Set up out local LLM model client.

Define a simple message class

We define the role of the Agent using the SystemMessage and set up a condition for termination.

Let’s run everything!

Using LlamaIndex-Backed Agent

Instrumentating your code locally

**Examples:**

Example 1 (json):
```json
curl -fsSL https://ollama.com/install.sh | sh

ollama pull llama3.2:1b

pip install 'litellm[proxy]'
litellm --model ollama/llama3.2:1b
```

Example 2 (json):
```json
curl -fsSL https://ollama.com/install.sh | sh

ollama pull llama3.2:1b

pip install 'litellm[proxy]'
litellm --model ollama/llama3.2:1b
```

Example 3 (python):
```python
from dataclasses import dataclass

from autogen_core import (
    AgentId,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    default_subscription,
    message_handler,
)
from autogen_core.model_context import BufferedChatCompletionContext
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    SystemMessage,
    UserMessage,
)
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 4 (python):
```python
from dataclasses import dataclass

from autogen_core import (
    AgentId,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    default_subscription,
    message_handler,
)
from autogen_core.model_context import BufferedChatCompletionContext
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    SystemMessage,
    UserMessage,
)
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

---

## Message and Communication — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/message-and-communication.html

**Contents:**
- Message and Communication#
- Messages#
- Message Handlers#
  - Routing Messages by Type#
  - Routing Messages of the Same Type#
- Direct Messaging#
  - Request/Response#
- Broadcast#
  - Subscribe and Publish to Topics#
  - Default Topic and Subscriptions#

An agent in AutoGen core can react to, send, and publish messages, and messages are the only means through which agents can communicate with each other.

Messages are serializable objects, they can be defined using:

A subclass of Pydantic’s pydantic.BaseModel, or

Messages are purely data, and should not contain any logic.

When an agent receives a message the runtime will invoke the agent’s message handler (on_message()) which should implement the agents message handling logic. If this message cannot be handled by the agent, the agent should raise a CantHandleException.

The base class BaseAgent provides no message handling logic and implementing the on_message() method directly is not recommended unless for the advanced use cases.

Developers should start with implementing the RoutedAgent base class which provides built-in message routing capability.

The RoutedAgent base class provides a mechanism for associating message types with message handlers with the message_handler() decorator, so developers do not need to implement the on_message() method.

For example, the following type-routed agent responds to TextMessage and ImageMessage using different message handlers:

Create the agent runtime and register the agent type (see Agent and Agent Runtime):

Test this agent with TextMessage and ImageMessage.

The runtime automatically creates an instance of MyAgent with the agent ID AgentId("my_agent", "default") when delivering the first message.

In some scenarios, it is useful to route messages of the same type to different handlers. For examples, messages from different sender agents should be handled differently. You can use the match parameter of the message_handler() decorator.

The match parameter associates handlers for the same message type to a specific message – it is secondary to the message type routing. It accepts a callable that takes the message and MessageContext as arguments, and returns a boolean indicating whether the message should be handled by the decorated handler. The callable is checked in the alphabetical order of the handlers.

Here is an example of an agent that routes messages based on the sender agent using the match parameter:

The above agent uses the source field of the message to determine the sender agent. You can also use the sender field of MessageContext to determine the sender agent using the agent ID if available.

Let’s test this agent with messages with different source values:

In the above example, the first ImageMessage is not handled because the source field of the message does not match the handler’s match condition.

There are two types of communication in AutoGen core:

Direct Messaging: sends a direct message to another agent.

Broadcast: publishes a message to a topic.

Let’s first look at direct messaging. To send a direct message to another agent, within a message handler use the autogen_core.BaseAgent.send_message() method, from the runtime use the autogen_core.AgentRuntime.send_message() method. Awaiting calls to these methods will return the return value of the receiving agent’s message handler. When the receiving agent’s handler returns None, None will be returned.

If the invoked agent raises an exception while the sender is awaiting, the exception will be propagated back to the sender.

Direct messaging can be used for request/response scenarios, where the sender expects a response from the receiver. The receiver can respond to the message by returning a value from its message handler. You can think of this as a function call between agents.

For example, consider the following agents:

Upone receving a message, the OuterAgent sends a direct message to the InnerAgent and receives a message in response.

We can test these agents by sending a Message to the OuterAgent.

Both outputs are produced by the OuterAgent’s message handler, however the second output is based on the response from the InnerAgent.

Generally speaking, direct messaging is appropriate for scenarios when the sender and recipient are tightly coupled – they are created together and the sender is linked to a specific instance of the recipient. For example, an agent executes tool calls by sending direct messages to an instance of ToolAgent, and uses the responses to form an action-observation loop.

Broadcast is effectively the publish/subscribe model with topic and subscription. Read Topic and Subscription to learn the core concepts.

The key difference between direct messaging and broadcast is that broadcast cannot be used for request/response scenarios. When an agent publishes a message it is one way only, it cannot receive a response from any other agent, even if a receiving agent’s handler returns a value.

If a response is given to a published message, it will be thrown away.

If an agent publishes a message type for which it is subscribed it will not receive the message it published. This is to prevent infinite loops.

Type-based subscription maps messages published to topics of a given topic type to agents of a given agent type. To make an agent that subsclasses RoutedAgent subscribe to a topic of a given topic type, you can use the type_subscription() class decorator.

The following example shows a ReceiverAgent class that subscribes to topics of "default" topic type using the type_subscription() decorator. and prints the received messages.

To publish a message from an agent’s handler, use the publish_message() method and specify a TopicId. This call must still be awaited to allow the runtime to schedule delivery of the message to all subscribers, but it will always return None. If an agent raises an exception while handling a published message, this will be logged but will not be propagated back to the publishing agent.

The following example shows a BroadcastingAgent that publishes a message to a topic upon receiving a message.

BroadcastingAgent publishes message to a topic with type "default" and source assigned to the agent instance’s agent key.

Subscriptions are registered with the agent runtime, either as part of agent type’s registration or through a separate API method. Here is how we register TypeSubscription for the receiving agent with the type_subscription() decorator, and for the broadcasting agent without the decorator.

As shown in the above example, you can also publish directly to a topic through the runtime’s publish_message() method without the need to create an agent instance.

From the output, you can see two messages were received by the receiving agent: one was published through the runtime, and the other was published by the broadcasting agent.

In the above example, we used TopicId and TypeSubscription to specify the topic and subscriptions respectively. This is the appropriate way for many scenarios. However, when there is a single scope of publishing, that is, all agents publish and subscribe to all broadcasted messages, we can use the convenience classes DefaultTopicId and default_subscription() to simplify our code.

DefaultTopicId is for creating a topic that uses "default" as the default value for the topic type and the publishing agent’s key as the default value for the topic source. default_subscription() is for creating a type subscription that subscribes to the default topic. We can simplify BroadcastingAgent by using DefaultTopicId and default_subscription().

When the runtime calls register() to register the agent type, it creates a TypeSubscription whose topic type uses "default" as the default value and agent type uses the same agent type that is being registered in the same context.

If your scenario allows all agents to publish and subscribe to all broadcasted messages, use DefaultTopicId and default_subscription() to decorate your agent classes.

Agent and Agent Runtime

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass


@dataclass
class TextMessage:
    content: str
    source: str


@dataclass
class ImageMessage:
    url: str
    source: str
```

Example 2 (python):
```python
from dataclasses import dataclass


@dataclass
class TextMessage:
    content: str
    source: str


@dataclass
class ImageMessage:
    url: str
    source: str
```

Example 3 (python):
```python
from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler


class MyAgent(RoutedAgent):
    @message_handler
    async def on_text_message(self, message: TextMessage, ctx: MessageContext) -> None:
        print(f"Hello, {message.source}, you said {message.content}!")

    @message_handler
    async def on_image_message(self, message: ImageMessage, ctx: MessageContext) -> None:
        print(f"Hello, {message.source}, you sent me {message.url}!")
```

Example 4 (python):
```python
from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler


class MyAgent(RoutedAgent):
    @message_handler
    async def on_text_message(self, message: TextMessage, ctx: MessageContext) -> None:
        print(f"Hello, {message.source}, you said {message.content}!")

    @message_handler
    async def on_image_message(self, message: ImageMessage, ctx: MessageContext) -> None:
        print(f"Hello, {message.source}, you sent me {message.url}!")
```

---

## Mixture of Agents — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/mixture-of-agents.html

**Contents:**
- Mixture of Agents#
- Message Protocol#
- Worker Agent#
- Orchestrator Agent#
- Running Mixture of Agents#

Mixture of Agents is a multi-agent design pattern that models after the feed-forward neural network architecture.

The pattern consists of two types of agents: worker agents and a single orchestrator agent. Worker agents are organized into multiple layers, with each layer consisting of a fixed number of worker agents. Messages from the worker agents in a previous layer are concatenated and sent to all the worker agents in the next layer.

This example implements the Mixture of Agents pattern using the core library following the original implementation of multi-layer mixture of agents.

Here is a high-level procedure overview of the pattern:

The orchestrator agent takes input a user task and first dispatches it to the worker agents in the first layer.

The worker agents in the first layer process the task and return the results to the orchestrator agent.

The orchestrator agent then synthesizes the results from the first layer and dispatches an updated task with the previous results to the worker agents in the second layer.

The process continues until the final layer is reached.

In the final layer, the orchestrator agent aggregates the results from previous layer and returns a single final result to the user.

We use the direct messaging API send_message() to implement this pattern. This makes it easier to add more features like worker task cancellation and error handling in the future.

The agents communicate using the following messages:

Each worker agent receives a task from the orchestrator agent and processes them indepedently. Once the task is completed, the worker agent returns the result.

The orchestrator agent receives tasks from the user and distributes them to the worker agents, iterating over multiple layers of worker agents. Once all worker agents have processed the task, the orchestrator agent aggregates the results and publishes the final result.

Let’s run the mixture of agents on a math task. You can change the task to make it more challenging, for example, by trying tasks from the International Mathematical Olympiad.

Let’s set up the runtime with 3 layers of worker agents, each layer consisting of 3 worker agents. We only need to register a single worker agent types, “worker”, because we are using the same model client configuration (i.e., gpt-4o-mini) for all worker agents. If you want to use different models, you will need to register multiple worker agent types, one for each model, and update the worker_agent_types list in the orchestrator agent’s factory function.

The instances of worker agents are automatically created when the orchestrator agent dispatches tasks to them. See Agent Identity and Lifecycle for more information on agent lifecycle.

**Examples:**

Example 1 (python):
```python
import asyncio
from dataclasses import dataclass
from typing import List

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from autogen_core.models import ChatCompletionClient, SystemMessage, UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 2 (python):
```python
import asyncio
from dataclasses import dataclass
from typing import List

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from autogen_core.models import ChatCompletionClient, SystemMessage, UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 3 (python):
```python
@dataclass
class WorkerTask:
    task: str
    previous_results: List[str]


@dataclass
class WorkerTaskResult:
    result: str


@dataclass
class UserTask:
    task: str


@dataclass
class FinalResult:
    result: str
```

Example 4 (python):
```python
@dataclass
class WorkerTask:
    task: str
    previous_results: List[str]


@dataclass
class WorkerTaskResult:
    result: str


@dataclass
class UserTask:
    task: str


@dataclass
class FinalResult:
    result: str
```

---

## Multi-Agent Debate — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/multi-agent-debate.html

**Contents:**
- Multi-Agent Debate#
- Message Protocol#
- Solver Agent#
- Aggregator Agent#
- Setting Up a Debate#
- Solving Math Problems#

Multi-Agent Debate is a multi-agent design pattern that simulates a multi-turn interaction where in each turn, agents exchange their responses with each other, and refine their responses based on the responses from other agents.

This example shows an implementation of the multi-agent debate pattern for solving math problems from the GSM8K benchmark.

There are of two types of agents in this pattern: solver agents and an aggregator agent. The solver agents are connected in a sparse manner following the technique described in Improving Multi-Agent Debate with Sparse Communication Topology. The solver agents are responsible for solving math problems and exchanging responses with each other. The aggregator agent is responsible for distributing math problems to the solver agents, waiting for their final responses, and aggregating the responses to get the final answer.

The pattern works as follows:

User sends a math problem to the aggregator agent.

The aggregator agent distributes the problem to the solver agents.

Each solver agent processes the problem, and publishes a response to its neighbors.

Each solver agent uses the responses from its neighbors to refine its response, and publishes a new response.

Repeat step 4 for a fixed number of rounds. In the final round, each solver agent publishes a final response.

The aggregator agent uses majority voting to aggregate the final responses from all solver agents to get a final answer, and publishes the answer.

We will be using the broadcast API, i.e., publish_message(), and we will be using topic and subscription to implement the communication topology. Read about Topics and Subscriptions to understand how they work.

First, we define the messages used by the agents. IntermediateSolverResponse is the message exchanged among the solver agents in each round, and FinalSolverResponse is the message published by the solver agents in the final round.

The solver agent is responsible for solving math problems and exchanging responses with other solver agents. Upon receiving a SolverRequest, the solver agent uses an LLM to generate an answer. Then, it publishes a IntermediateSolverResponse or a FinalSolverResponse based on the round number.

The solver agent is given a topic type, which is used to indicate the topic to which the agent should publish intermediate responses. This topic is subscribed to by its neighbors to receive responses from this agent – we will show how this is done later.

We use default_subscription() to let solver agents subscribe to the default topic, which is used by the aggregator agent to collect the final responses from the solver agents.

The aggregator agent is responsible for handling user question and distributing math problems to the solver agents.

The aggregator subscribes to the default topic using default_subscription(). The default topic is used to recieve user question, receive the final responses from the solver agents, and publish the final answer back to the user.

In a more complex application when you want to isolate the multi-agent debate into a sub-component, you should use type_subscription() to set a specific topic type for the aggregator-solver communication, and have the both the solver and aggregator publish and subscribe to that topic type.

We will now set up a multi-agent debate with 4 solver agents and 1 aggregator agent. The solver agents will be connected in a sparse manner as illustrated in the figure below:

Each solver agent is connected to two other solver agents. For example, agent A is connected to agents B and C.

Let’s first create a runtime and register the agent types.

Now we will create the solver agent topology using TypeSubscription, which maps each solver agent’s publishing topic type to its neighbors’ agent types.

Now let’s run the debate to solve a math problem. We publish a SolverRequest to the default topic, and the aggregator agent will start the debate.

**Examples:**

Example 1 (python):
```python
import re
from dataclasses import dataclass
from typing import Dict, List

from autogen_core import (
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TypeSubscription,
    default_subscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 2 (python):
```python
import re
from dataclasses import dataclass
from typing import Dict, List

from autogen_core import (
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TypeSubscription,
    default_subscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 3 (python):
```python
@dataclass
class Question:
    content: str


@dataclass
class Answer:
    content: str


@dataclass
class SolverRequest:
    content: str
    question: str


@dataclass
class IntermediateSolverResponse:
    content: str
    question: str
    answer: str
    round: int


@dataclass
class FinalSolverResponse:
    answer: str
```

Example 4 (python):
```python
@dataclass
class Question:
    content: str


@dataclass
class Answer:
    content: str


@dataclass
class SolverRequest:
    content: str
    question: str


@dataclass
class IntermediateSolverResponse:
    content: str
    question: str
    answer: str
    round: int


@dataclass
class FinalSolverResponse:
    answer: str
```

---

## OpenAI Assistant Agent — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/openai-assistant-agent.html

**Contents:**
- OpenAI Assistant Agent#
- Message Protocol#
- Defining the Agent#
- Assistant Event Handler#
- Using the Agent#
- Assistant with Code Interpreter#
- Assistant with File Search#

Open AI Assistant and Azure OpenAI Assistant are server-side APIs for building agents. They can be used to build agents in AutoGen. This cookbook demonstrates how to to use OpenAI Assistant to create an agent that can run code and Q&A over document.

First, we need to specify the message protocol for the agent backed by OpenAI Assistant. The message protocol defines the structure of messages handled and published by the agent. For illustration, we define a simple message protocol of 4 message types: Message, Reset, UploadForCodeInterpreter and UploadForFileSearch.

The TextMessage message type is used to communicate with the agent. It has a content field that contains the message content, and a source field for the sender. The Reset message type is a control message that resets the memory of the agent. It has no fields. This is useful when we need to start a new conversation with the agent.

The UploadForCodeInterpreter message type is used to upload data files for the code interpreter and UploadForFileSearch message type is used to upload documents for file search. Both message types have a file_path field that contains the local path to the file to be uploaded.

Next, we define the agent class. The agent class constructor has the following arguments: description, client, assistant_id, thread_id, and assistant_event_handler_factory. The client argument is the OpenAI async client object, and the assistant_event_handler_factory is for creating an assistant event handler to handle OpenAI Assistant events. This can be used to create streaming output from the assistant.

The agent class has the following message handlers:

handle_message: Handles the TextMessage message type, and sends back the response from the assistant.

handle_reset: Handles the Reset message type, and resets the memory of the assistant agent.

handle_upload_for_code_interpreter: Handles the UploadForCodeInterpreter message type, and uploads the file to the code interpreter.

handle_upload_for_file_search: Handles the UploadForFileSearch message type, and uploads the document to the file search.

The memory of the assistant is stored inside a thread, which is kept in the server side. The thread is referenced by the thread_id argument.

The agent class is a thin wrapper around the OpenAI Assistant API to implement the message protocol. More features, such as multi-modal message handling, can be added by extending the message protocol.

The assistant event handler provides call-backs for handling Assistant API specific events. This is useful for handling streaming output from the assistant and further user interface integration.

First we need to use the openai client to create the actual assistant, thread, and vector store. Our AutoGen agent will be using these.

Then, we create a runtime, and register an agent factory function for this agent with the runtime.

Let’s turn on logging to see what’s happening under the hood.

Let’s send a greeting message to the agent, and see the response streamed back.

Let’s ask some math question to the agent, and see it uses the code interpreter to answer the question.

Let’s get some data from Seattle Open Data portal. We will be using the City of Seattle Wage Data. Let’s download it first.

Let’s send the file to the agent using an UploadForCodeInterpreter message.

We can now ask some questions about the data to the agent.

Let’s try the Q&A over document feature. We first download Wikipedia page on the Third Anglo-Afghan War.

Send the file to the agent using an UploadForFileSearch message.

Let’s ask some questions about the document to the agent. Before asking, we reset the agent memory to start a new conversation.

That’s it! We have successfully built an agent backed by OpenAI Assistant.

Extracting Results with an Agent

Using LangGraph-Backed Agent

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass


@dataclass
class TextMessage:
    content: str
    source: str


@dataclass
class Reset:
    pass


@dataclass
class UploadForCodeInterpreter:
    file_path: str


@dataclass
class UploadForFileSearch:
    file_path: str
    vector_store_id: str
```

Example 2 (python):
```python
from dataclasses import dataclass


@dataclass
class TextMessage:
    content: str
    source: str


@dataclass
class Reset:
    pass


@dataclass
class UploadForCodeInterpreter:
    file_path: str


@dataclass
class UploadForFileSearch:
    file_path: str
    vector_store_id: str
```

Example 3 (python):
```python
import asyncio
import os
from typing import Any, Callable, List

import aiofiles
from autogen_core import AgentId, MessageContext, RoutedAgent, message_handler
from openai import AsyncAssistantEventHandler, AsyncClient
from openai.types.beta.thread import ToolResources, ToolResourcesFileSearch


class OpenAIAssistantAgent(RoutedAgent):
    """An agent implementation that uses the OpenAI Assistant API to generate
    responses.

    Args:
        description (str): The description of the agent.
        client (openai.AsyncClient): The client to use for the OpenAI API.
        assistant_id (str): The assistant ID to use for the OpenAI API.
        thread_id (str): The thread ID to use for the OpenAI API.
        assistant_event_handler_factory (Callable[[], AsyncAssistantEventHandler], optional):
            A factory function to create an async assistant event handler. Defaults to None.
            If provided, the agent will use the streaming mode with the event handler.
            If not provided, the agent will use the blocking mode to generate responses.
    """

    def __init__(
        self,
        description: str,
        client: AsyncClient,
        assistant_id: str,
        thread_id: str,
        assistant_event_handler_factory: Callable[[], AsyncAssistantEventHandler],
    ) -> None:
        super().__init__(description)
        self._client = client
        self._assistant_id = assistant_id
        self._thread_id = thread_id
        self._assistant_event_handler_factory = assistant_event_handler_factory

    @message_handler
    async def handle_message(self, message: TextMessage, ctx: MessageContext) -> TextMessage:
        """Handle a message. This method adds the message to the thread and publishes a response."""
        # Save the message to the thread.
        await ctx.cancellation_token.link_future(
            asyncio.ensure_future(
                self._client.beta.threads.messages.create(
                    thread_id=self._thread_id,
                    content=message.content,
                    role="user",
                    metadata={"sender": message.source},
                )
            )
        )
        # Generate a response.
        async with self._client.beta.threads.runs.stream(
            thread_id=self._thread_id,
            assistant_id=self._assistant_id,
            event_handler=self._assistant_event_handler_factory(),
        ) as stream:
            await ctx.cancellation_token.link_future(asyncio.ensure_future(stream.until_done()))

        # Get the last message.
        messages = await ctx.cancellation_token.link_future(
            asyncio.ensure_future(self._client.beta.threads.messages.list(self._thread_id, order="desc", limit=1))
        )
        last_message_content = messages.data[0].content

        # Get the text content from the last message.
        text_content = [content for content in last_message_content if content.type == "text"]
        if not text_content:
            raise ValueError(f"Expected text content in the last message: {last_message_content}")

        return TextMessage(content=text_content[0].text.value, source=self.metadata["type"])

    @message_handler()
    async def on_reset(self, message: Reset, ctx: MessageContext) -> None:
        """Handle a reset message. This method deletes all messages in the thread."""
        # Get all messages in this thread.
        all_msgs: List[str] = []
        while True:
            if not all_msgs:
                msgs = await ctx.cancellation_token.link_future(
                    asyncio.ensure_future(self._client.beta.threads.messages.list(self._thread_id))
                )
            else:
                msgs = await ctx.cancellation_token.link_future(
                    asyncio.ensure_future(self._client.beta.threads.messages.list(self._thread_id, after=all_msgs[-1]))
                )
            for msg in msgs.data:
                all_msgs.append(msg.id)
            if not msgs.has_next_page():
                break
        # Delete all the messages.
        for msg_id in all_msgs:
            status = await ctx.cancellation_token.link_future(
                asyncio.ensure_future(
                    self._client.beta.threads.messages.delete(message_id=msg_id, thread_id=self._thread_id)
                )
            )
            assert status.deleted is True

    @message_handler()
    async def on_upload_for_code_interpreter(self, message: UploadForCodeInterpreter, ctx: MessageContext) -> None:
        """Handle an upload for code interpreter. This method uploads a file and updates the thread with the file."""
        # Get the file content.
        async with aiofiles.open(message.file_path, mode="rb") as f:
            file_content = await ctx.cancellation_token.link_future(asyncio.ensure_future(f.read()))
        file_name = os.path.basename(message.file_path)
        # Upload the file.
        file = await ctx.cancellation_token.link_future(
            asyncio.ensure_future(self._client.files.create(file=(file_name, file_content), purpose="assistants"))
        )
        # Get existing file ids from tool resources.
        thread = await ctx.cancellation_token.link_future(
            asyncio.ensure_future(self._client.beta.threads.retrieve(thread_id=self._thread_id))
        )
        tool_resources: ToolResources = thread.tool_resources if thread.tool_resources else ToolResources()
        assert tool_resources.code_interpreter is not None
        if tool_resources.code_interpreter.file_ids:
            file_ids = tool_resources.code_interpreter.file_ids
        else:
            file_ids = [file.id]
        # Update thread with new file.
        await ctx.cancellation_token.link_future(
            asyncio.ensure_future(
                self._client.beta.threads.update(
                    thread_id=self._thread_id,
                    tool_resources={
                        "code_interpreter": {"file_ids": file_ids},
                    },
                )
            )
        )

    @message_handler()
    async def on_upload_for_file_search(self, message: UploadForFileSearch, ctx: MessageContext) -> None:
        """Handle an upload for file search. This method uploads a file and updates the vector store."""
        # Get the file content.
        async with aiofiles.open(message.file_path, mode="rb") as file:
            file_content = await ctx.cancellation_token.link_future(asyncio.ensure_future(file.read()))
        file_name = os.path.basename(message.file_path)
        # Upload the file.
        await ctx.cancellation_token.link_future(
            asyncio.ensure_future(
                self._client.vector_stores.file_batches.upload_and_poll(
                    vector_store_id=message.vector_store_id,
                    files=[(file_name, file_content)],
                )
            )
        )
```

Example 4 (python):
```python
import asyncio
import os
from typing import Any, Callable, List

import aiofiles
from autogen_core import AgentId, MessageContext, RoutedAgent, message_handler
from openai import AsyncAssistantEventHandler, AsyncClient
from openai.types.beta.thread import ToolResources, ToolResourcesFileSearch


class OpenAIAssistantAgent(RoutedAgent):
    """An agent implementation that uses the OpenAI Assistant API to generate
    responses.

    Args:
        description (str): The description of the agent.
        client (openai.AsyncClient): The client to use for the OpenAI API.
        assistant_id (str): The assistant ID to use for the OpenAI API.
        thread_id (str): The thread ID to use for the OpenAI API.
        assistant_event_handler_factory (Callable[[], AsyncAssistantEventHandler], optional):
            A factory function to create an async assistant event handler. Defaults to None.
            If provided, the agent will use the streaming mode with the event handler.
            If not provided, the agent will use the blocking mode to generate responses.
    """

    def __init__(
        self,
        description: str,
        client: AsyncClient,
        assistant_id: str,
        thread_id: str,
        assistant_event_handler_factory: Callable[[], AsyncAssistantEventHandler],
    ) -> None:
        super().__init__(description)
        self._client = client
        self._assistant_id = assistant_id
        self._thread_id = thread_id
        self._assistant_event_handler_factory = assistant_event_handler_factory

    @message_handler
    async def handle_message(self, message: TextMessage, ctx: MessageContext) -> TextMessage:
        """Handle a message. This method adds the message to the thread and publishes a response."""
        # Save the message to the thread.
        await ctx.cancellation_token.link_future(
            asyncio.ensure_future(
                self._client.beta.threads.messages.create(
                    thread_id=self._thread_id,
                    content=message.content,
                    role="user",
                    metadata={"sender": message.source},
                )
            )
        )
        # Generate a response.
        async with self._client.beta.threads.runs.stream(
            thread_id=self._thread_id,
            assistant_id=self._assistant_id,
            event_handler=self._assistant_event_handler_factory(),
        ) as stream:
            await ctx.cancellation_token.link_future(asyncio.ensure_future(stream.until_done()))

        # Get the last message.
        messages = await ctx.cancellation_token.link_future(
            asyncio.ensure_future(self._client.beta.threads.messages.list(self._thread_id, order="desc", limit=1))
        )
        last_message_content = messages.data[0].content

        # Get the text content from the last message.
        text_content = [content for content in last_message_content if content.type == "text"]
        if not text_content:
            raise ValueError(f"Expected text content in the last message: {last_message_content}")

        return TextMessage(content=text_content[0].text.value, source=self.metadata["type"])

    @message_handler()
    async def on_reset(self, message: Reset, ctx: MessageContext) -> None:
        """Handle a reset message. This method deletes all messages in the thread."""
        # Get all messages in this thread.
        all_msgs: List[str] = []
        while True:
            if not all_msgs:
                msgs = await ctx.cancellation_token.link_future(
                    asyncio.ensure_future(self._client.beta.threads.messages.list(self._thread_id))
                )
            else:
                msgs = await ctx.cancellation_token.link_future(
                    asyncio.ensure_future(self._client.beta.threads.messages.list(self._thread_id, after=all_msgs[-1]))
                )
            for msg in msgs.data:
                all_msgs.append(msg.id)
            if not msgs.has_next_page():
                break
        # Delete all the messages.
        for msg_id in all_msgs:
            status = await ctx.cancellation_token.link_future(
                asyncio.ensure_future(
                    self._client.beta.threads.messages.delete(message_id=msg_id, thread_id=self._thread_id)
                )
            )
            assert status.deleted is True

    @message_handler()
    async def on_upload_for_code_interpreter(self, message: UploadForCodeInterpreter, ctx: MessageContext) -> None:
        """Handle an upload for code interpreter. This method uploads a file and updates the thread with the file."""
        # Get the file content.
        async with aiofiles.open(message.file_path, mode="rb") as f:
            file_content = await ctx.cancellation_token.link_future(asyncio.ensure_future(f.read()))
        file_name = os.path.basename(message.file_path)
        # Upload the file.
        file = await ctx.cancellation_token.link_future(
            asyncio.ensure_future(self._client.files.create(file=(file_name, file_content), purpose="assistants"))
        )
        # Get existing file ids from tool resources.
        thread = await ctx.cancellation_token.link_future(
            asyncio.ensure_future(self._client.beta.threads.retrieve(thread_id=self._thread_id))
        )
        tool_resources: ToolResources = thread.tool_resources if thread.tool_resources else ToolResources()
        assert tool_resources.code_interpreter is not None
        if tool_resources.code_interpreter.file_ids:
            file_ids = tool_resources.code_interpreter.file_ids
        else:
            file_ids = [file.id]
        # Update thread with new file.
        await ctx.cancellation_token.link_future(
            asyncio.ensure_future(
                self._client.beta.threads.update(
                    thread_id=self._thread_id,
                    tool_resources={
                        "code_interpreter": {"file_ids": file_ids},
                    },
                )
            )
        )

    @message_handler()
    async def on_upload_for_file_search(self, message: UploadForFileSearch, ctx: MessageContext) -> None:
        """Handle an upload for file search. This method uploads a file and updates the vector store."""
        # Get the file content.
        async with aiofiles.open(message.file_path, mode="rb") as file:
            file_content = await ctx.cancellation_token.link_future(asyncio.ensure_future(file.read()))
        file_name = os.path.basename(message.file_path)
        # Upload the file.
        await ctx.cancellation_token.link_future(
            asyncio.ensure_future(
                self._client.vector_stores.file_batches.upload_and_poll(
                    vector_store_id=message.vector_store_id,
                    files=[(file_name, file_content)],
                )
            )
        )
```

---

## Open Telemetry — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/telemetry.html

**Contents:**
- Open Telemetry#
- Instrumenting your application#
- Clean instrumentation#
  - Existing instrumentation#
  - Examples#

AutoGen has native support for open telemetry. This allows you to collect telemetry data from your application and send it to a telemetry backend of your choosing.

These are the components that are currently instrumented:

Runtime (SingleThreadedAgentRuntime and GrpcWorkerAgentRuntime).

Tool (BaseTool) with the execute_tool span in GenAI semantic convention for tools.

AgentChat Agents (BaseChatAgent) with the create_agent and invoke_agent spans in GenAI semantic convention for agents.

To disable the agent runtime telemetry, you can set the trace_provider to opentelemetry.trace.NoOpTracerProvider in the runtime constructor.

Additionally, you can set the environment variable AUTOGEN_DISABLE_RUNTIME_TRACING to true to disable the agent runtime telemetry if you don’t have access to the runtime constructor. For example, if you are using ComponentConfig.

To instrument your application, you will need an sdk and an exporter. You may already have these if your application is already instrumented with open telemetry.

If you do not have open telemetry set up in your application, you can follow these steps to instrument your application.

Depending on your open telemetry collector, you can use grpc or http to export your telemetry.

Next, we need to get a tracer provider:

Now you can send the trace_provider when creating your runtime:

And that’s it! Your application is now instrumented with open telemetry. You can now view your telemetry data in your telemetry backend.

If you have open telemetry already set up in your application, you can pass the tracer provider to the runtime when creating it:

See Tracing and Observability for a complete example of how to set up open telemetry with AutoGen.

Distributed Agent Runtime

**Examples:**

Example 1 (unknown):
```unknown
pip install opentelemetry-sdk
```

Example 2 (unknown):
```unknown
pip install opentelemetry-sdk
```

Example 3 (markdown):
```markdown
# Pick one of the following

pip install opentelemetry-exporter-otlp-proto-http
pip install opentelemetry-exporter-otlp-proto-grpc
```

Example 4 (markdown):
```markdown
# Pick one of the following

pip install opentelemetry-exporter-otlp-proto-http
pip install opentelemetry-exporter-otlp-proto-grpc
```

---

## Reflection — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/reflection.html

**Contents:**
- Reflection#
- Message Protocol#
- Agents#
- Logging#
- Running the Design Pattern#

Reflection is a design pattern where an LLM generation is followed by a reflection, which in itself is another LLM generation conditioned on the output of the first one. For example, given a task to write code, the first LLM can generate a code snippet, and the second LLM can generate a critique of the code snippet.

In the context of AutoGen and agents, reflection can be implemented as a pair of agents, where the first agent generates a message and the second agent generates a response to the message. The two agents continue to interact until they reach a stopping condition, such as a maximum number of iterations or an approval from the second agent.

Let’s implement a simple reflection design pattern using AutoGen agents. There will be two agents: a coder agent and a reviewer agent, the coder agent will generate a code snippet, and the reviewer agent will generate a critique of the code snippet.

Before we define the agents, we need to first define the message protocol for the agents.

The above set of messages defines the protocol for our example reflection design pattern:

The application sends a CodeWritingTask message to the coder agent

The coder agent generates a CodeReviewTask message, which is sent to the reviewer agent

The reviewer agent generates a CodeReviewResult message, which is sent back to the coder agent

Depending on the CodeReviewResult message, if the code is approved, the coder agent sends a CodeWritingResult message back to the application, otherwise, the coder agent sends another CodeReviewTask message to the reviewer agent, and the process continues.

We can visualize the message protocol using a data flow diagram:

Now, let’s define the agents for the reflection design pattern.

We use the Broadcast API to implement the design pattern. The agents implements the pub/sub model. The coder agent subscribes to the CodeWritingTask and CodeReviewResult messages, and publishes the CodeReviewTask and CodeWritingResult messages.

A few things to note about CoderAgent:

It uses chain-of-thought prompting in its system message.

It stores message histories for different CodeWritingTask in a dictionary, so each task has its own history.

When making an LLM inference request using its model client, it transforms the message history into a list of autogen_core.models.LLMMessage objects to pass to the model client.

The reviewer agent subscribes to the CodeReviewTask message and publishes the CodeReviewResult message.

The ReviewerAgent uses JSON-mode when making an LLM inference request, and also uses chain-of-thought prompting in its system message.

Turn on logging to see the messages exchanged between the agents.

Let’s test the design pattern with a coding task. Since all the agents are decorated with the default_subscription() class decorator, the agents when created will automatically subscribe to the default topic. We publish a CodeWritingTask message to the default topic to start the reflection process.

The log messages show the interaction between the coder and reviewer agents. The final output shows the code snippet generated by the coder agent and the critique generated by the reviewer agent.

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass


@dataclass
class CodeWritingTask:
    task: str


@dataclass
class CodeWritingResult:
    task: str
    code: str
    review: str


@dataclass
class CodeReviewTask:
    session_id: str
    code_writing_task: str
    code_writing_scratchpad: str
    code: str


@dataclass
class CodeReviewResult:
    review: str
    session_id: str
    approved: bool
```

Example 2 (python):
```python
from dataclasses import dataclass


@dataclass
class CodeWritingTask:
    task: str


@dataclass
class CodeWritingResult:
    task: str
    code: str
    review: str


@dataclass
class CodeReviewTask:
    session_id: str
    code_writing_task: str
    code_writing_scratchpad: str
    code: str


@dataclass
class CodeReviewResult:
    review: str
    session_id: str
    approved: bool
```

Example 3 (python):
```python
import json
import re
import uuid
from typing import Dict, List, Union

from autogen_core import MessageContext, RoutedAgent, TopicId, default_subscription, message_handler
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
```

Example 4 (python):
```python
import json
import re
import uuid
from typing import Dict, List, Union

from autogen_core import MessageContext, RoutedAgent, TopicId, default_subscription, message_handler
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
```

---

## Sequential Workflow — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/sequential-workflow.html

**Contents:**
- Sequential Workflow#
- Message Protocol#
- Topics#
- Agents#
- Workflow#
- Run the Workflow#

Sequential Workflow is a multi-agent design pattern where agents respond in a deterministic sequence. Each agent in the workflow performs a specific task by processing a message, generating a response, and then passing it to the next agent. This pattern is useful for creating deterministic workflows where each agent contributes to a pre-specified sub-task.

In this example, we demonstrate a sequential workflow where multiple agents collaborate to transform a basic product description into a polished marketing copy.

The pipeline consists of four specialized agents:

Concept Extractor Agent: Analyzes the initial product description to extract key features, target audience, and unique selling points (USPs). The output is a structured analysis in a single text block.

Writer Agent: Crafts compelling marketing copy based on the extracted concepts. This agent transforms the analytical insights into engaging promotional content, delivering a cohesive narrative in a single text block.

Format & Proof Agent: Polishes the draft copy by refining grammar, enhancing clarity, and maintaining consistent tone. This agent ensures professional quality and delivers a well-formatted final version.

User Agent: Presents the final, refined marketing copy to the user, completing the workflow.

The following diagram illustrates the sequential workflow in this example:

We will implement this workflow using publish-subscribe messaging. Please read about Topic and Subscription for the core concepts and Broadcast Messaging for the the API usage.

In this pipeline, agents communicate with each other by publishing their completed work as messages to the topic of the next agent in the sequence. For example, when the ConceptExtractor finishes analyzing the product description, it publishes its findings to the "WriterAgent" topic, which the WriterAgent is subscribed to. This pattern continues through each step of the pipeline, with each agent publishing to the topic that the next agent in line subscribed to.

The message protocol for this example workflow is a simple text message that agents will use to relay their work.

Each agent in the workflow will be subscribed to a specific topic type. The topic types are named after the agents in the sequence, This allows each agent to publish its work to the next agent in the sequence.

Each agent class is defined with a type_subscription decorator to specify the topic type it is subscribed to. Alternative to the decorator, you can also use the add_subscription() method to subscribe to a topic through runtime directly.

The concept extractor agent comes up with the initial bullet points for the product description.

The writer agent performs writing.

The format proof agent performs the formatting.

In this example, the user agent simply prints the final marketing copy to the console. In a real-world application, this could be replaced by storing the result to a database, sending an email, or any other desired action.

Now we can register the agents to the runtime. Because we used the type_subscription decorator, the runtime will automatically subscribe the agents to the correct topics.

Finally, we can run the workflow by publishing a message to the first agent in the sequence.

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass

from autogen_core import (
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
    type_subscription,
)
from autogen_core.models import ChatCompletionClient, SystemMessage, UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient
```

Example 2 (python):
```python
from dataclasses import dataclass

from autogen_core import (
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
    type_subscription,
)
from autogen_core.models import ChatCompletionClient, SystemMessage, UserMessage
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

## Structured output using GPT-4o models — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/structured-output-agent.html

**Contents:**
- Structured output using GPT-4o models#

This cookbook demonstrates how to obtain structured output using GPT-4o models. The OpenAI beta client SDK provides a parse helper that allows you to use your own Pydantic model, eliminating the need to define a JSON schema. This approach is recommended for supported models.

Currently, this feature is supported for:

gpt-4o-mini on OpenAI

gpt-4o-2024-08-06 on OpenAI

gpt-4o-2024-08-06 on Azure

Let’s define a simple message type that carries explanation and output for a Math problem

Topic and Subscription Example Scenarios

Tracking LLM usage with a logger

**Examples:**

Example 1 (python):
```python
from pydantic import BaseModel


class MathReasoning(BaseModel):
    class Step(BaseModel):
        explanation: str
        output: str

    steps: list[Step]
    final_answer: str
```

Example 2 (python):
```python
from pydantic import BaseModel


class MathReasoning(BaseModel):
    class Step(BaseModel):
        explanation: str
        output: str

    steps: list[Step]
    final_answer: str
```

Example 3 (markdown):
```markdown
import os

# Set the environment variable
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://YOUR_ENDPOINT_DETAILS.openai.azure.com/"
os.environ["AZURE_OPENAI_API_KEY"] = "YOUR_API_KEY"
os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"] = "gpt-4o-2024-08-06"
os.environ["AZURE_OPENAI_API_VERSION"] = "2024-08-01-preview"
```

Example 4 (markdown):
```markdown
import os

# Set the environment variable
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://YOUR_ENDPOINT_DETAILS.openai.azure.com/"
os.environ["AZURE_OPENAI_API_KEY"] = "YOUR_API_KEY"
os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"] = "gpt-4o-2024-08-06"
os.environ["AZURE_OPENAI_API_VERSION"] = "2024-08-01-preview"
```

---

## Tools — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/components/tools.html

**Contents:**
- Tools#
- Built-in Tools#
- Custom Function Tools#
- Calling Tools with Model Clients#
- Tool-Equipped Agent#

Tools are code that can be executed by an agent to perform actions. A tool can be a simple function such as a calculator, or an API call to a third-party service such as stock price lookup or weather forecast. In the context of AI agents, tools are designed to be executed by agents in response to model-generated function calls.

AutoGen provides the autogen_core.tools module with a suite of built-in tools and utilities for creating and running custom tools.

One of the built-in tools is the PythonCodeExecutionTool, which allows agents to execute Python code snippets.

Here is how you create the tool and use it.

The DockerCommandLineCodeExecutor class is a built-in code executor that runs Python code snippets in a subprocess in the command line environment of a docker container. The PythonCodeExecutionTool class wraps the code executor and provides a simple interface to execute Python code snippets.

Examples of other built-in tools

LocalSearchTool and GlobalSearchTool for using GraphRAG.

mcp_server_tools for using Model Context Protocol (MCP) servers as tools.

HttpTool for making HTTP requests to REST APIs.

LangChainToolAdapter for using LangChain tools.

A tool can also be a simple Python function that performs a specific action. To create a custom function tool, you just need to create a Python function and use the FunctionTool class to wrap it.

The FunctionTool class uses descriptions and type annotations to inform the LLM when and how to use a given function. The description provides context about the function’s purpose and intended use cases, while type annotations inform the LLM about the expected parameters and return type.

For example, a simple tool to obtain the stock price of a company might look like this:

In AutoGen, every tool is a subclass of BaseTool, which automatically generates the JSON schema for the tool. For example, to get the JSON schema for the stock_price_tool, we can use the schema property.

Model clients use the JSON schema of the tools to generate tool calls.

Here is an example of how to use the FunctionTool class with a OpenAIChatCompletionClient. Other model client classes can be used in a similar way. See Model Clients for more details.

What is actually going on under the hood of the call to the create method? The model client takes the list of tools and generates a JSON schema for the parameters of each tool. Then, it generates a request to the model API with the tool’s JSON schema and the other messages to obtain a result.

Many models, such as OpenAI’s GPT-4o and Llama-3.2, are trained to produce tool calls in the form of structured JSON strings that conform to the JSON schema of the tool. AutoGen’s model clients then parse the model’s response and extract the tool call from the JSON string.

The result is a list of FunctionCall objects, which can be used to run the corresponding tools.

We use json.loads to parse the JSON string in the arguments field into a Python dictionary. The run_json() method takes the dictionary and runs the tool with the provided arguments.

Now you can make another model client call to have the model generate a reflection on the result of the tool execution.

The result of the tool call is wrapped in a FunctionExecutionResult object, which contains the result of the tool execution and the ID of the tool that was called. The model client can use this information to generate a reflection on the result of the tool execution.

Putting the model client and the tools together, you can create a tool-equipped agent that can use tools to perform actions, and reflect on the results of those actions.

The Core API is designed to be minimal and you need to build your own agent logic around model clients and tools. For “pre-built” agents that can use tools, please refer to the AgentChat API.

When handling a user message, the ToolUseAgent class first use the model client to generate a list of function calls to the tools, and then run the tools and generate a reflection on the results of the tool execution. The reflection is then returned to the user as the agent’s response.

To run the agent, let’s create a runtime and register the agent with the runtime.

This example uses the OpenAIChatCompletionClient, for Azure OpenAI and other clients, see Model Clients. Let’s test the agent with a question about stock price.

**Examples:**

Example 1 (python):
```python
from autogen_core import CancellationToken
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.tools.code_execution import PythonCodeExecutionTool

# Create the tool.
code_executor = DockerCommandLineCodeExecutor()
await code_executor.start()
code_execution_tool = PythonCodeExecutionTool(code_executor)
cancellation_token = CancellationToken()

# Use the tool directly without an agent.
code = "print('Hello, world!')"
result = await code_execution_tool.run_json({"code": code}, cancellation_token)
print(code_execution_tool.return_value_as_string(result))
```

Example 2 (python):
```python
from autogen_core import CancellationToken
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.tools.code_execution import PythonCodeExecutionTool

# Create the tool.
code_executor = DockerCommandLineCodeExecutor()
await code_executor.start()
code_execution_tool = PythonCodeExecutionTool(code_executor)
cancellation_token = CancellationToken()

# Use the tool directly without an agent.
code = "print('Hello, world!')"
result = await code_execution_tool.run_json({"code": code}, cancellation_token)
print(code_execution_tool.return_value_as_string(result))
```

Example 3 (unknown):
```unknown
Hello, world!
```

Example 4 (unknown):
```unknown
Hello, world!
```

---

## Topic and Subscription — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/topic-and-subscription.html

**Contents:**
- Topic and Subscription#
- Topic#
- Subscription#
- Type-based Subscription#
  - Scenarios of Type-Based Subscription#
    - Single-Tenant, Single Topic#
    - Single-Tenant, Multiple Topics#
    - Multi-Tenant Scenarios#

There are two ways for runtime to deliver messages, direct messaging or broadcast. Direct messaging is one to one: the sender must provide the recipient’s agent ID. On the other hand, broadcast is one to many and the sender does not provide recipients’ agent IDs.

Many scenarios are suitable for broadcast. For example, in event-driven workflows, agents do not always know who will handle their messages, and a workflow can be composed of agents with no inter-dependencies. This section focuses on the core concepts in broadcast: topic and subscription.

A topic defines the scope of a broadcast message. In essence, agent runtime implements a publish-subscribe model through its broadcast API: when publishing a message, the topic must be specified. It is an indirection over agent IDs.

A topic consists of two components: topic type and topic source.

Topic = (Topic Type, Topic Source)

Similar to agent ID, which also has two components, topic type is usually defined by application code to mark the type of messages the topic is for. For example, a GitHub agent may use "GitHub_Issues" as the topic type when publishing messages about new issues.

Topic source is the unique identifier for a topic within a topic type. It is typically defined by application data. For example, the GitHub agent may use "github.com/{repo_name}/issues/{issue_number}" as the topic source to uniquely identifies the topic. Topic source allows the publisher to limit the scope of messages and create silos.

Topic IDs can be converted to and from strings. the format of this string is:

Topic_Type/Topic_Source

Types are considered valid if they are in UTF8 and only contain alphanumeric letters (a-z) and (0-9), or underscores (_). A valid identifier cannot start with a number, or contain any spaces. Sources are considered valid if they are in UTF8 and only contain characters between (inclusive) ascii 32 (space) and 126 (~).

A subscription maps topic to agent IDs.

The diagram above shows the relationship between topic and subscription. An agent runtime keeps track of the subscriptions and uses them to deliver messages to agents.

If a topic has no subscription, messages published to this topic will not be delivered to any agent. If a topic has many subscriptions, messages will be delivered following all the subscriptions to every recipient agent only once. Applications can add or remove subscriptions using agent runtime’s API.

A type-based subscription maps a topic type to an agent type (see agent ID). It declares an unbounded mapping from topics to agent IDs without knowing the exact topic sources and agent keys. The mechanism is simple: any topic matching the type-based subscription’s topic type will be mapped to an agent ID with the subscription’s agent type and the agent key assigned to the value of the topic source. For Python API, use TypeSubscription.

Type-Based Subscription = Topic Type –> Agent Type

Generally speaking, type-based subscription is the preferred way to declare subscriptions. It is portable and data-independent: developers do not need to write application code that depends on specific agent IDs.

Type-based subscriptions can be applied to many scenarios when the exact topic or agent IDs are data-dependent. The scenarios can be broken down by two considerations: (1) whether it is single-tenant or multi-tenant, and (2) whether it is a single topic or multiple topics per tenant. A tenant typically refers to a set of agents that handle a specific user session or a specific request.

In this scenario, there is only one tenant and one topic for the entire application. It is the simplest scenario and can be used in many cases like a command line tool or a single-user application.

To apply type-based subscription for this scenario, create one type-based subscription for each agent type, and use the same topic type for all the type-based subscriptions. When you publish, always use the same topic, i.e., the same topic type and topic source.

For example, assuming there are three agent types: "triage_agent", "coder_agent" and "reviewer_agent", and the topic type is "default", create the following type-based subscriptions:

With the above type-based subscriptions, use the same topic source "default" for all messages. So the topic is always ("default", "default"). A message published to this topic will be delivered to all the agents of all above types. Specifically, the message will be sent to the following agent IDs:

The following figure shows how type-based subscription works in this example.

If the agent with the ID does not exist, the runtime will create it.

In this scenario, there is only one tenant but you want to control which agent handles which topic. This is useful when you want to create silos and have different agents specialized in handling different topics.

To apply type-based subscription for this scenario, create one type-based subscription for each agent type but with different topic types. You can map the same topic type to multiple agent types if you want these agent types to share a same topic. For topic source, still use the same value for all messages when you publish.

Continuing the example above with same agent types, create the following type-based subscriptions:

With the above type-based subscriptions, any message published to the topic ("triage", "default") will be delivered to the agent with type "triage_agent", and any message published to the topic ("coding", "default") will be delivered to the agents with types "coder_agent" and "reviewer_agent".

The following figure shows how type-based subscription works in this example.

In single-tenant scenarios, the topic source is always the same (e.g., "default") – it is hard-coded in the application code. When moving to multi-tenant scenarios, the topic source becomes data-dependent.

A good indication that you are in a multi-tenant scenario is that you need multiple instances of the same agent type. For example, you may want to have different agent instances to handle different user sessions to keep private data isolated, or, you may want to distribute a heavy workload across multiple instances of the same agent type and have them work on it concurrently.

Continuing the example above, if you want to have dedicated instances of agents to handle a specific GitHub issue, you need to set the topic source to be a unique identifier for the issue.

For example, let’s say there is one type-based subscription for the agent type "triage_agent":

When a message is published to the topic ("github_issues", "github.com/microsoft/autogen/issues/1"), the runtime will deliver the message to the agent with ID ("triage_agent", "github.com/microsoft/autogen/issues/1"). When a message is published to the topic ("github_issues", "github.com/microsoft/autogen/issues/9"), the runtime will deliver the message to the agent with ID ("triage_agent", "github.com/microsoft/autogen/issues/9").

The following figure shows how type-based subscription works in this example.

Note the agent ID is data-dependent, and the runtime will create a new instance of the agent if it does not exist.

To support multiple topics per tenant, you can use different topic types, just like the single-tenant, multiple topics scenario.

Agent Identity and Lifecycle

Agent and Agent Runtime

**Examples:**

Example 1 (markdown):
```markdown
# Type-based Subscriptions for single-tenant, single topic scenario
TypeSubscription(topic_type="default", agent_type="triage_agent")
TypeSubscription(topic_type="default", agent_type="coder_agent")
TypeSubscription(topic_type="default", agent_type="reviewer_agent")
```

Example 2 (markdown):
```markdown
# Type-based Subscriptions for single-tenant, single topic scenario
TypeSubscription(topic_type="default", agent_type="triage_agent")
TypeSubscription(topic_type="default", agent_type="coder_agent")
TypeSubscription(topic_type="default", agent_type="reviewer_agent")
```

Example 3 (markdown):
```markdown
# The agent IDs created based on the topic source
AgentID("triage_agent", "default")
AgentID("coder_agent", "default")
AgentID("reviewer_agent", "default")
```

Example 4 (markdown):
```markdown
# The agent IDs created based on the topic source
AgentID("triage_agent", "default")
AgentID("coder_agent", "default")
AgentID("reviewer_agent", "default")
```

---

## Topic and Subscription Example Scenarios — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/topic-subscription-scenarios.html

**Contents:**
- Topic and Subscription Example Scenarios#
- Introduction#
- Scenario Overview#
- Broadcasting Scenarios Overview#
- 1. Single-Tenant, Single Scope of Publishing#
  - Scenarios Explanation#
  - Application in the Tax Specialist Company#
  - How the Scenario Works#
  - Benefits#
  - Considerations#

In this cookbook, we explore how broadcasting works for agent communication in AutoGen using four different broadcasting scenarios. These scenarios illustrate various ways to handle and distribute messages among agents. We’ll use a consistent example of a tax management company processing client requests to demonstrate each scenario.

Imagine a tax management company that offers various services to clients, such as tax planning, dispute resolution, compliance, and preparation. The company employs a team of tax specialists, each with expertise in one of these areas, and a tax system manager who oversees the operations.

Clients submit requests that need to be processed by the appropriate specialists. The communication between the clients, the tax system manager, and the tax specialists is handled through broadcasting in this system.

We’ll explore how different broadcasting scenarios affect the way messages are distributed among agents and how they can be used to tailor the communication flow to specific needs.

We will cover the following broadcasting scenarios:

Single-Tenant, Single Scope of Publishing

Multi-Tenant, Single Scope of Publishing

Single-Tenant, Multiple Scopes of Publishing

Multi-Tenant, Multiple Scopes of Publishing

Each scenario represents a different approach to message distribution and agent interaction within the system. By understanding these scenarios, you can design agent communication strategies that best fit your application’s requirements.

In the single-tenant, single scope of publishing scenario:

All agents operate within a single tenant (e.g., one client or user session).

Messages are published to a single topic, and all agents subscribe to this topic.

Every agent receives every message that gets published to the topic.

This scenario is suitable for situations where all agents need to be aware of all messages, and there’s no need to isolate communication between different groups of agents or sessions.

In our tax specialist company, this scenario implies:

All tax specialists receive every client request and internal message.

All agents collaborate closely, with full visibility of all communications.

Useful for tasks or teams where all agents need to be aware of all messages.

Subscriptions: All agents use the default subscription(e.g., “default”).

Publishing: Messages are published to the default topic.

Message Handling: Each agent decides whether to act on a message based on its content and available handlers.

Simplicity: Easy to set up and understand.

Collaboration: Promotes transparency and collaboration among agents.

Flexibility: Agents can dynamically decide which messages to process.

Scalability: May not scale well with a large number of agents or messages.

Efficiency: Agents may receive many irrelevant messages, leading to unnecessary processing.

In the multi-tenant, single scope of publishing scenario:

There are multiple tenants (e.g., multiple clients or user sessions).

Each tenant has its own isolated topic through the topic source.

All agents within a tenant subscribe to the tenant’s topic. If needed, new agent instances are created for each tenant.

Messages are only visible to agents within the same tenant.

This scenario is useful when you need to isolate communication between different tenants but want all agents within a tenant to be aware of all messages.

The company serves multiple clients (tenants) simultaneously.

For each client, a dedicated set of agent instances is created.

Each client’s communication is isolated from others.

All agents for a client receive messages published to that client’s topic.

Subscriptions: Agents subscribe to topics based on the tenant’s identity.

Publishing: Messages are published to the tenant-specific topic.

Message Handling: Agents only receive messages relevant to their tenant.

Tenant Isolation: Ensures data privacy and separation between clients.

Collaboration Within Tenant: Agents can collaborate freely within their tenant.

Complexity: Requires managing multiple sets of agents and topics.

Resource Usage: More agent instances may consume additional resources.

In the single-tenant, multiple scopes of publishing scenario:

All agents operate within a single tenant.

Messages are published to different topics.

Agents subscribe to specific topics relevant to their role or specialty.

Messages are directed to subsets of agents based on the topic.

This scenario allows for targeted communication within a tenant, enabling more granular control over message distribution.

The tax system manager communicates with specific specialists based on their specialties.

Different topics represent different specialties (e.g., “planning”, “compliance”).

Specialists subscribe only to the topic that matches their specialty.

The manager publishes messages to specific topics to reach the intended specialists.

Subscriptions: Agents subscribe to topics corresponding to their specialties.

Publishing: Messages are published to topics based on the intended recipients.

Message Handling: Only agents subscribed to a topic receive its messages.

Targeted Communication: Messages reach only the relevant agents.

Efficiency: Reduces unnecessary message processing by agents.

Setup Complexity: Requires careful management of topics and subscriptions.

Flexibility: Changes in communication scenarios may require updating subscriptions.

In the multi-tenant, multiple scopes of publishing scenario:

There are multiple tenants, each with their own set of agents.

Messages are published to multiple topics within each tenant.

Agents subscribe to tenant-specific topics relevant to their role.

Combines tenant isolation with targeted communication.

This scenario provides the highest level of control over message distribution, suitable for complex systems with multiple clients and specialized communication needs.

The company serves multiple clients, each with dedicated agent instances.

Within each client, agents communicate using multiple topics based on specialties.

For example, Client A’s planning specialist subscribes to the “planning” topic with source “ClientA”.

The tax system manager for each client communicates with their specialists using tenant-specific topics.

Subscriptions: Agents subscribe to topics based on both tenant identity and specialty.

Publishing: Messages are published to tenant-specific and specialty-specific topics.

Message Handling: Only agents matching the tenant and topic receive messages.

Complete Isolation: Ensures both tenant and communication isolation.

Granular Control: Enables precise routing of messages to intended agents.

Complexity: Requires careful management of topics, tenants, and subscriptions.

Resource Usage: Increased number of agent instances and topics may impact resources.

Instrumentating your code locally

Structured output using GPT-4o models

**Examples:**

Example 1 (python):
```python
import asyncio
from dataclasses import dataclass
from enum import Enum
from typing import List

from autogen_core import (
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core._default_subscription import DefaultSubscription
from autogen_core._default_topic import DefaultTopicId
from autogen_core.models import (
    SystemMessage,
)
```

Example 2 (python):
```python
import asyncio
from dataclasses import dataclass
from enum import Enum
from typing import List

from autogen_core import (
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core._default_subscription import DefaultSubscription
from autogen_core._default_topic import DefaultTopicId
from autogen_core.models import (
    SystemMessage,
)
```

Example 3 (python):
```python
class TaxSpecialty(str, Enum):
    PLANNING = "planning"
    DISPUTE_RESOLUTION = "dispute_resolution"
    COMPLIANCE = "compliance"
    PREPARATION = "preparation"


@dataclass
class ClientRequest:
    content: str


@dataclass
class RequestAssessment:
    content: str


class TaxSpecialist(RoutedAgent):
    def __init__(
        self,
        description: str,
        specialty: TaxSpecialty,
        system_messages: List[SystemMessage],
    ) -> None:
        super().__init__(description)
        self.specialty = specialty
        self._system_messages = system_messages
        self._memory: List[ClientRequest] = []

    @message_handler
    async def handle_message(self, message: ClientRequest, ctx: MessageContext) -> None:
        # Process the client request.
        print(f"\n{'='*50}\nTax specialist {self.id} with specialty {self.specialty}:\n{message.content}")
        # Send a response back to the manager
        if ctx.topic_id is None:
            raise ValueError("Topic ID is required for broadcasting")
        await self.publish_message(
            message=RequestAssessment(content=f"I can handle this request in {self.specialty}."),
            topic_id=ctx.topic_id,
        )
```

Example 4 (python):
```python
class TaxSpecialty(str, Enum):
    PLANNING = "planning"
    DISPUTE_RESOLUTION = "dispute_resolution"
    COMPLIANCE = "compliance"
    PREPARATION = "preparation"


@dataclass
class ClientRequest:
    content: str


@dataclass
class RequestAssessment:
    content: str


class TaxSpecialist(RoutedAgent):
    def __init__(
        self,
        description: str,
        specialty: TaxSpecialty,
        system_messages: List[SystemMessage],
    ) -> None:
        super().__init__(description)
        self.specialty = specialty
        self._system_messages = system_messages
        self._memory: List[ClientRequest] = []

    @message_handler
    async def handle_message(self, message: ClientRequest, ctx: MessageContext) -> None:
        # Process the client request.
        print(f"\n{'='*50}\nTax specialist {self.id} with specialty {self.specialty}:\n{message.content}")
        # Send a response back to the manager
        if ctx.topic_id is None:
            raise ValueError("Topic ID is required for broadcasting")
        await self.publish_message(
            message=RequestAssessment(content=f"I can handle this request in {self.specialty}."),
            topic_id=ctx.topic_id,
        )
```

---

## Usage — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/autogenstudio-user-guide/usage.html

**Contents:**
- Usage#
- Setting Up an API Key#
- Building an Agent Team#
  - Using the Visual Builder#
  - Using the JSON Editor#
- Declarative Specification of Components#
- Gallery - Sharing and Reusing Components#
- Interactively Running Teams#
- Importing and Reusing Team Configurations#
  - Python Integration#

AutoGen Studio (AGS) provides a Team Builder interface where developers can define multiple components and behaviors. Users can create teams, add agents to teams, attach tools and models to agents, and define team termination conditions. After defining a team, users can test directly in the team builder view or attach it to a session for use in the Playground view.

See a video tutorial on AutoGen Studio v0.4 (02/25) - https://youtu.be/oum6EI7wohM

Most of your agents will require an API key. You can set up an environment variable OPENAI_API_KEY (assuming you are using OpenAI models) and AutoGen will automatically use this for any OpenAI model clients you specify for your agents or teams. Alternatively you can specify the api key as part of the team or agent configuration.

See the section below on how to build an agent team either using the visual builder or by directly editing the JSON configuration.

AutoGen Studio integrates closely with all component abstractions provided by AutoGen AgentChat, including teams, agents, models, tools, and termination conditions.

The Team Builder view in AGS provides a visual team builder that allows users to define components through either drag-and-drop functionality or by editing a JSON configuration of the team directly.

The visual builder is enabled by default and allows users to drag-and-drop components from the provided Component library to the Team Builder canvas. The team builder canvas represents a team and consists of a main team node and a set of a connected agent nodes. It includes a Component Library that has a selection of components that can be added to the team or agent nodes in the canvas.

The core supported behaviours include:

Create a new team. This can be done by clicking on the “New Team” button in the Team Builder view or by selecting any of the existing default teams that ship with the default AGS Gallery. Once you do this, a new team node and agent node(s) will be created in the canvas.

Drag and drop components from the library to the team or agent nodes in the canvas.

Teams: drag in agents and termination conditions to the team node (there are specific drop zones for these components)

Agents: drag in models and tools to the agent node (there are specific drop zones for these components)

Editing Team/Agent Nodes: Click on the edit icon (top right) of the node to view and edit its properties. This pops up a panel that allows you to edit the fields of the node. In some cases you will need to scroll down and click into specific sections e.g., for an agent with a model client, you will need to click into the model client section to edit the model client properties. Once done with editing, click on the save button to save the changes.

AGS also lets you directly modify the JSON configuration of the team. This can be done by toggling the visual builder mode off. Once you do this, you will see the JSON configuration of the team. You can then edit the JSON configuration directly.

Did you know that you define your agents in Python, export them to JSON and then paste them in the JSON editor? The section below shows how to accomplish this.

AutoGen Studio is built on the declarative specification behaviors of AutoGen AgentChat. This allows users to define teams, agents, models, tools, and termination conditions in Python and then dump them into a JSON file for use in AutoGen Studio.

Here’s an example of an agent team and how it is converted to a JSON file:

This example shows a team with a single agent, using the RoundRobinGroupChat type and a TextMentionTermination condition. You will also notice that the model client is an OpenAIChatCompletionClient model client where only the model name is specified. In this case, the API key is assumed to be set as an environment variable OPENAI_API_KEY. You can also specify the API key as part of the model client configuration.

To understand the full configuration of an model clients, you can refer to the AutoGen Model Clients documentation.

Note that you can similarly define your model client in Python and call dump_component() on it to get the JSON configuration and use it to update the model client section of your team or agent configuration.

Finally, you can use the load_component() method to load a team configuration from a JSON file:

AGS provides a Gallery view, where a gallery is a collection of components - teams, agents, models, tools, and terminations - that can be shared and reused across projects.

Users can create a local gallery or import a gallery (from a URL, a JSON file import or simply by copying and pasting the JSON). At any given time, users can select any of the current Gallery items as a default gallery. This default gallery will be used to populate the Team Builder sidebar with components.

Create new galleries via Gallery -> New Gallery

Edit gallery JSON as needed

Set a default gallery (click pin icon in sidebar) to make components available in Team Builder.

The AutoGen Studio Playground enables users to:

Test teams on specific tasks

Review generated artifacts (images, code, text)

Monitor team “inner monologue” during task execution

View performance metrics (turn count, token usage)

Track agent actions (tool usage, code execution results)

AutoGen Studio’s Gallery view offers a default component collection and supports importing external configurations:

Create/Import galleries through Gallery -> New Gallery -> Import

Set default galleries via sidebar pin icon

Access components in Team Builder through Sidebar -> From Gallery

Team configurations can be integrated into Python applications using the TeamManager class:

To export team configurations, use the export button in Team Builder to generate a JSON file for Python application use.

Experimental Features

**Examples:**

Example 1 (python):
```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.conditions import  TextMentionTermination

agent = AssistantAgent(
        name="weather_agent",
        model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini",
        ),
    )

agent_team = RoundRobinGroupChat([agent], termination_condition=TextMentionTermination("TERMINATE"))
config = agent_team.dump_component()
print(config.model_dump_json())
```

Example 2 (python):
```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.conditions import  TextMentionTermination

agent = AssistantAgent(
        name="weather_agent",
        model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini",
        ),
    )

agent_team = RoundRobinGroupChat([agent], termination_condition=TextMentionTermination("TERMINATE"))
config = agent_team.dump_component()
print(config.model_dump_json())
```

Example 3 (json):
```json
{
  "provider": "autogen_agentchat.teams.RoundRobinGroupChat",
  "component_type": "team",
  "version": 1,
  "component_version": 1,
  "description": "A team that runs a group chat with participants taking turns in a round-robin fashion\n    to publish a message to all.",
  "label": "RoundRobinGroupChat",
  "config": {
    "participants": [
      {
        "provider": "autogen_agentchat.agents.AssistantAgent",
        "component_type": "agent",
        "version": 1,
        "component_version": 1,
        "description": "An agent that provides assistance with tool use.",
        "label": "AssistantAgent",
        "config": {
          "name": "weather_agent",
          "model_client": {
            "provider": "autogen_ext.models.openai.OpenAIChatCompletionClient",
            "component_type": "model",
            "version": 1,
            "component_version": 1,
            "description": "Chat completion client for OpenAI hosted models.",
            "label": "OpenAIChatCompletionClient",
            "config": { "model": "gpt-4o-mini" }
          },
          "tools": [],
          "handoffs": [],
          "model_context": {
            "provider": "autogen_core.model_context.UnboundedChatCompletionContext",
            "component_type": "chat_completion_context",
            "version": 1,
            "component_version": 1,
            "description": "An unbounded chat completion context that keeps a view of the all the messages.",
            "label": "UnboundedChatCompletionContext",
            "config": {}
          },
          "description": "An agent that provides assistance with ability to use tools.",
          "system_message": "You are a helpful AI assistant. Solve tasks using your tools. Reply with TERMINATE when the task has been completed.",
          "model_client_stream": false,
          "reflect_on_tool_use": false,
          "tool_call_summary_format": "{result}"
        }
      }
    ],
    "termination_condition": {
      "provider": "autogen_agentchat.conditions.TextMentionTermination",
      "component_type": "termination",
      "version": 1,
      "component_version": 1,
      "description": "Terminate the conversation if a specific text is mentioned.",
      "label": "TextMentionTermination",
      "config": { "text": "TERMINATE" }
    }
  }
}
```

Example 4 (json):
```json
{
  "provider": "autogen_agentchat.teams.RoundRobinGroupChat",
  "component_type": "team",
  "version": 1,
  "component_version": 1,
  "description": "A team that runs a group chat with participants taking turns in a round-robin fashion\n    to publish a message to all.",
  "label": "RoundRobinGroupChat",
  "config": {
    "participants": [
      {
        "provider": "autogen_agentchat.agents.AssistantAgent",
        "component_type": "agent",
        "version": 1,
        "component_version": 1,
        "description": "An agent that provides assistance with tool use.",
        "label": "AssistantAgent",
        "config": {
          "name": "weather_agent",
          "model_client": {
            "provider": "autogen_ext.models.openai.OpenAIChatCompletionClient",
            "component_type": "model",
            "version": 1,
            "component_version": 1,
            "description": "Chat completion client for OpenAI hosted models.",
            "label": "OpenAIChatCompletionClient",
            "config": { "model": "gpt-4o-mini" }
          },
          "tools": [],
          "handoffs": [],
          "model_context": {
            "provider": "autogen_core.model_context.UnboundedChatCompletionContext",
            "component_type": "chat_completion_context",
            "version": 1,
            "component_version": 1,
            "description": "An unbounded chat completion context that keeps a view of the all the messages.",
            "label": "UnboundedChatCompletionContext",
            "config": {}
          },
          "description": "An agent that provides assistance with ability to use tools.",
          "system_message": "You are a helpful AI assistant. Solve tasks using your tools. Reply with TERMINATE when the task has been completed.",
          "model_client_stream": false,
          "reflect_on_tool_use": false,
          "tool_call_summary_format": "{result}"
        }
      }
    ],
    "termination_condition": {
      "provider": "autogen_agentchat.conditions.TextMentionTermination",
      "component_type": "termination",
      "version": 1,
      "component_version": 1,
      "description": "Terminate the conversation if a specific text is mentioned.",
      "label": "TextMentionTermination",
      "config": { "text": "TERMINATE" }
    }
  }
}
```

---

## Using LangGraph-Backed Agent — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/langgraph-agent.html

**Contents:**
- Using LangGraph-Backed Agent#

This example demonstrates how to create an AI agent using LangGraph. Based on the example in the LangGraph documentation: https://langchain-ai.github.io/langgraph/.

First install the dependencies:

Let’s import the modules.

Define our message type that will be used to communicate with the agent.

Define the tools the agent will use.

Define the agent using LangGraph’s API.

Now let’s test the agent. First we need to create an agent runtime and register the agent, by providing the agent’s name and a factory function that will create the agent.

Start the agent runtime.

Send a direct message to the agent, and print the response.

Stop the agent runtime.

OpenAI Assistant Agent

Using LlamaIndex-Backed Agent

**Examples:**

Example 1 (markdown):
```markdown
# pip install langgraph langchain-openai azure-identity
```

Example 2 (markdown):
```markdown
# pip install langgraph langchain-openai azure-identity
```

Example 3 (python):
```python
from dataclasses import dataclass
from typing import Any, Callable, List, Literal

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool  # pyright: ignore
from langchain_openai import AzureChatOpenAI, ChatOpenAI
from langgraph.graph import END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
```

Example 4 (python):
```python
from dataclasses import dataclass
from typing import Any, Callable, List, Literal

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool  # pyright: ignore
from langchain_openai import AzureChatOpenAI, ChatOpenAI
from langgraph.graph import END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
```

---
