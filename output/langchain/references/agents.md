# Langchain - Agents

**Pages:** 165

---

## A2A endpoint in Agent Server

**URL:** llms-txt#a2a-endpoint-in-agent-server

**Contents:**
- Supported methods
- Agent Card Discovery
- Requirements
- Usage overview
- Creating an A2A-compatible agent

Source: https://docs.langchain.com/langsmith/server-a2a

[Agent2Agent (A2A)](https://a2a-protocol.org/latest/) is Google's protocol for enabling communication between conversational AI agents. [LangSmith implements A2A support](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html#tag/a2a/post/a2a/\{assistant_id}), allowing your agents to communicate with other A2A-compatible agents through a standardized protocol.

The A2A endpoint is available in [Agent Server](/langsmith/agent-server) at `/a2a/{assistant_id}`.

Agent Server supports the following A2A RPC methods:

* **message/send**: Send a message to an assistant and receive a complete response
* **message/stream**: Send a message and stream responses in real-time using Server-Sent Events (SSE)
* **tasks/get**: Retrieve the status and results of a previously created task

## Agent Card Discovery

Each assistant automatically exposes an A2A Agent Card that describes its capabilities and provides the information needed for other agents to connect. You can retrieve the agent card for any assistant using:

The agent card includes the assistant's name, description, available skills, supported input/output modes, and the A2A endpoint URL for communication.

To use A2A, ensure you have the following dependencies installed:

* `langgraph-api >= 0.4.21`

* Upgrade to use langgraph-api>=0.4.21.
* Deploy your agent with message-based state structure.
* Connect with other A2A-compatible agents using the endpoint.

## Creating an A2A-compatible agent

This example creates an A2A-compatible agent that processes incoming messages using OpenAI's API and maintains conversational state. The agent defines a message-based state structure and handles the A2A protocol's message format.

To be compatible with the [A2A "text" parts](https://a2a-protocol.org/dev/specification/#651-textpart-object), the agent must have a `messages` key in state. Here's an example:

```python  theme={null}
"""LangGraph A2A conversational agent.

Supports the A2A protocol with messages input for conversational interactions.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Dict, List, TypedDict

from langgraph.graph import StateGraph
from langgraph.runtime import Runtime
from openai import AsyncOpenAI

class Context(TypedDict):
    """Context parameters for the agent."""
    my_configurable_param: str

@dataclass
class State:
    """Input state for the agent.

Defines the initial structure for A2A conversational messages.
    """
    messages: List[Dict[str, Any]]

async def call_model(state: State, runtime: Runtime[Context]) -> Dict[str, Any]:
    """Process conversational messages and returns output using OpenAI."""
    # Initialize OpenAI client
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Process the incoming messages
    latest_message = state.messages[-1] if state.messages else {}
    user_content = latest_message.get("content", "No message content")

# Create messages for OpenAI API
    openai_messages = [
        {
            "role": "system",
            "content": "You are a helpful conversational agent. Keep responses brief and engaging."
        },
        {
            "role": "user",
            "content": user_content
        }
    ]

try:
        # Make OpenAI API call
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=openai_messages,
            max_tokens=100,
            temperature=0.7
        )

ai_response = response.choices[0].message.content

except Exception as e:
        ai_response = f"I received your message but had trouble processing it. Error: {str(e)[:50]}..."

# Create a response message
    response_message = {
        "role": "assistant",
        "content": ai_response
    }

return {
        "messages": state.messages + [response_message]
    }

**Examples:**

Example 1 (unknown):
```unknown
GET /.well-known/agent-card.json?assistant_id={assistant_id}
```

Example 2 (unknown):
```unknown
## Usage overview

To enable A2A:

* Upgrade to use langgraph-api>=0.4.21.
* Deploy your agent with message-based state structure.
* Connect with other A2A-compatible agents using the endpoint.

## Creating an A2A-compatible agent

This example creates an A2A-compatible agent that processes incoming messages using OpenAI's API and maintains conversational state. The agent defines a message-based state structure and handles the A2A protocol's message format.

To be compatible with the [A2A "text" parts](https://a2a-protocol.org/dev/specification/#651-textpart-object), the agent must have a `messages` key in state. Here's an example:
```

---

## After model hook

**URL:** llms-txt#after-model-hook

@after_model
def log_after_model(state: AgentState, runtime: Runtime[Context]) -> dict | None:  # [!code highlight]
    print(f"Completed request for user: {runtime.context.user_name}")  # [!code highlight]
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[...],
    middleware=[dynamic_system_prompt, log_before_model, log_after_model],  # [!code highlight]
    context_schema=Context
)

agent.invoke(
    {"messages": [{"role": "user", "content": "What's my name?"}]},
    context=Context(user_name="John Smith")
)
```

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/runtime.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Agents

**URL:** llms-txt#agents

**Contents:**
- Core components
  - Model
  - Tools
  - System prompt

Source: https://docs.langchain.com/oss/python/langchain/agents

Agents combine language models with [tools](/oss/python/langchain/tools) to create systems that can reason about tasks, decide which tools to use, and iteratively work towards solutions.

[`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) provides a production-ready agent implementation.

[An LLM Agent runs tools in a loop to achieve a goal](https://simonwillison.net/2025/Sep/18/agents/).
An agent runs until a stop condition is met - i.e., when the model emits a final output or an iteration limit is reached.

<Info>
  [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) builds a **graph**-based agent runtime using [LangGraph](/oss/python/langgraph/overview). A graph consists of nodes (steps) and edges (connections) that define how your agent processes information. The agent moves through this graph, executing nodes like the model node (which calls the model), the tools node (which executes tools), or middleware.

Learn more about the [Graph API](/oss/python/langgraph/graph-api).
</Info>

The [model](/oss/python/langchain/models) is the reasoning engine of your agent. It can be specified in multiple ways, supporting both static and dynamic model selection.

Static models are configured once when creating the agent and remain unchanged throughout execution. This is the most common and straightforward approach.

To initialize a static model from a <Tooltip tip="A string that follows the format `provider:model` (e.g. openai:gpt-5)" cta="See mappings" href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)">model identifier string</Tooltip>:

<Tip>
  Model identifier strings support automatic inference (e.g., `"gpt-5"` will be inferred as `"openai:gpt-5"`). Refer to the [reference](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) to see a full list of model identifier string mappings.
</Tip>

For more control over the model configuration, initialize a model instance directly using the provider package. In this example, we use [`ChatOpenAI`](https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI). See [Chat models](/oss/python/integrations/chat) for other available chat model classes.

Model instances give you complete control over configuration. Use them when you need to set specific [parameters](/oss/python/langchain/models#parameters) like `temperature`, `max_tokens`, `timeouts`, `base_url`, and other provider-specific settings. Refer to the [reference](/oss/python/integrations/providers/all_providers) to see available params and methods on your model.

Dynamic models are selected at <Tooltip tip="The execution environment of your agent, containing immutable configuration and contextual data that persists throughout the agent's execution (e.g., user IDs, session details, or application-specific configuration).">runtime</Tooltip> based on the current <Tooltip tip="The data that flows through your agent's execution, including messages, custom fields, and any information that needs to be tracked and potentially modified during processing (e.g., user preferences or tool usage stats).">state</Tooltip> and context. This enables sophisticated routing logic and cost optimization.

To use a dynamic model, create middleware using the [`@wrap_model_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_model_call) decorator that modifies the model in the request:

<Warning>
  Pre-bound models (models with [`bind_tools`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.bind_tools) already called) are not supported when using structured output. If you need dynamic model selection with structured output, ensure the models passed to the middleware are not pre-bound.
</Warning>

<Tip>
  For model configuration details, see [Models](/oss/python/langchain/models). For dynamic model selection patterns, see [Dynamic model in middleware](/oss/python/langchain/middleware#dynamic-model).
</Tip>

Tools give agents the ability to take actions. Agents go beyond simple model-only tool binding by facilitating:

* Multiple tool calls in sequence (triggered by a single prompt)
* Parallel tool calls when appropriate
* Dynamic tool selection based on previous results
* Tool retry logic and error handling
* State persistence across tool calls

For more information, see [Tools](/oss/python/langchain/tools).

Pass a list of tools to the agent.

<Tip>
  Tools can be specified as plain Python functions or <Tooltip tip="A method that can suspend execution and resume at a later time">coroutines</Tooltip>.

The [tool decorator](/oss/python/langchain/tools#create-tools) can be used to customize tool names, descriptions, argument schemas, and other properties.
</Tip>

If an empty tool list is provided, the agent will consist of a single LLM node without tool-calling capabilities.

#### Tool error handling

To customize how tool errors are handled, use the [`@wrap_tool_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_tool_call) decorator to create middleware:

The agent will return a [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) with the custom error message when a tool fails:

#### Tool use in the ReAct loop

Agents follow the ReAct ("Reasoning + Acting") pattern, alternating between brief reasoning steps with targeted tool calls and feeding the resulting observations into subsequent decisions until they can deliver a final answer.

<Accordion title="Example of ReAct loop">
  **Prompt:** Identify the current most popular wireless headphones and verify availability.

* **Reasoning**: "Popularity is time-sensitive, I need to use the provided search tool."
  * **Acting**: Call `search_products("wireless headphones")`

* **Reasoning**: "I need to confirm availability for the top-ranked item before answering."
  * **Acting**: Call `check_inventory("WH-1000XM5")`

* **Reasoning**: "I have the most popular model and its stock status. I can now answer the user's question."
  * **Acting**: Produce final answer

<Tip>
  To learn more about tools, see [Tools](/oss/python/langchain/tools).
</Tip>

You can shape how your agent approaches tasks by providing a prompt. The [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)) parameter can be provided as a string:

When no [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)) is provided, the agent will infer its task from the messages directly.

The [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)) parameter accepts either a `str` or a [`SystemMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.SystemMessage). Using a `SystemMessage` gives you more control over the prompt structure, which is useful for provider-specific features like [Anthropic's prompt caching](/oss/python/integrations/chat/anthropic#prompt-caching):

The `cache_control` field with `{"type": "ephemeral"}` tells Anthropic to cache that content block, reducing latency and costs for repeated requests that use the same system prompt.

#### Dynamic system prompt

For more advanced use cases where you need to modify the system prompt based on runtime context or agent state, you can use [middleware](/oss/python/langchain/middleware).

The [`@dynamic_prompt`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.dynamic_prompt) decorator creates middleware that generates system prompts based on the model request:

```python wrap theme={null}
from typing import TypedDict

from langchain.agents import create_agent
from langchain.agents.middleware import dynamic_prompt, ModelRequest

class Context(TypedDict):
    user_role: str

@dynamic_prompt
def user_role_prompt(request: ModelRequest) -> str:
    """Generate system prompt based on user role."""
    user_role = request.runtime.context.get("user_role", "user")
    base_prompt = "You are a helpful assistant."

if user_role == "expert":
        return f"{base_prompt} Provide detailed technical responses."
    elif user_role == "beginner":
        return f"{base_prompt} Explain concepts simply and avoid jargon."

agent = create_agent(
    model="gpt-4o",
    tools=[web_search],
    middleware=[user_role_prompt],
    context_schema=Context
)

**Examples:**

Example 1 (unknown):
```unknown
<Info>
  [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) builds a **graph**-based agent runtime using [LangGraph](/oss/python/langgraph/overview). A graph consists of nodes (steps) and edges (connections) that define how your agent processes information. The agent moves through this graph, executing nodes like the model node (which calls the model), the tools node (which executes tools), or middleware.

  Learn more about the [Graph API](/oss/python/langgraph/graph-api).
</Info>

## Core components

### Model

The [model](/oss/python/langchain/models) is the reasoning engine of your agent. It can be specified in multiple ways, supporting both static and dynamic model selection.

#### Static model

Static models are configured once when creating the agent and remain unchanged throughout execution. This is the most common and straightforward approach.

To initialize a static model from a <Tooltip tip="A string that follows the format `provider:model` (e.g. openai:gpt-5)" cta="See mappings" href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)">model identifier string</Tooltip>:
```

Example 2 (unknown):
```unknown
<Tip>
  Model identifier strings support automatic inference (e.g., `"gpt-5"` will be inferred as `"openai:gpt-5"`). Refer to the [reference](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) to see a full list of model identifier string mappings.
</Tip>

For more control over the model configuration, initialize a model instance directly using the provider package. In this example, we use [`ChatOpenAI`](https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI). See [Chat models](/oss/python/integrations/chat) for other available chat model classes.
```

Example 3 (unknown):
```unknown
Model instances give you complete control over configuration. Use them when you need to set specific [parameters](/oss/python/langchain/models#parameters) like `temperature`, `max_tokens`, `timeouts`, `base_url`, and other provider-specific settings. Refer to the [reference](/oss/python/integrations/providers/all_providers) to see available params and methods on your model.

#### Dynamic model

Dynamic models are selected at <Tooltip tip="The execution environment of your agent, containing immutable configuration and contextual data that persists throughout the agent's execution (e.g., user IDs, session details, or application-specific configuration).">runtime</Tooltip> based on the current <Tooltip tip="The data that flows through your agent's execution, including messages, custom fields, and any information that needs to be tracked and potentially modified during processing (e.g., user preferences or tool usage stats).">state</Tooltip> and context. This enables sophisticated routing logic and cost optimization.

To use a dynamic model, create middleware using the [`@wrap_model_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_model_call) decorator that modifies the model in the request:
```

Example 4 (unknown):
```unknown
<Warning>
  Pre-bound models (models with [`bind_tools`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.bind_tools) already called) are not supported when using structured output. If you need dynamic model selection with structured output, ensure the models passed to the middleware are not pre-bound.
</Warning>

<Tip>
  For model configuration details, see [Models](/oss/python/langchain/models). For dynamic model selection patterns, see [Dynamic model in middleware](/oss/python/langchain/middleware#dynamic-model).
</Tip>

### Tools

Tools give agents the ability to take actions. Agents go beyond simple model-only tool binding by facilitating:

* Multiple tool calls in sequence (triggered by a single prompt)
* Parallel tool calls when appropriate
* Dynamic tool selection based on previous results
* Tool retry logic and error handling
* State persistence across tool calls

For more information, see [Tools](/oss/python/langchain/tools).

#### Defining tools

Pass a list of tools to the agent.

<Tip>
  Tools can be specified as plain Python functions or <Tooltip tip="A method that can suspend execution and resume at a later time">coroutines</Tooltip>.

  The [tool decorator](/oss/python/langchain/tools#create-tools) can be used to customize tool names, descriptions, argument schemas, and other properties.
</Tip>
```

---

## Agent Builder

**URL:** llms-txt#agent-builder

**Contents:**
- What you can do
- Start building
- Get started
- Learn more

Source: https://docs.langchain.com/langsmith/agent-builder

Create helpful AI agents without code. Start from a template, connect your accounts, and let the agent handle routine work while you stay in control.

<Callout icon="wand-magic-sparkles" color="#2563EB" iconType="regular">
  Agent Builder is in Beta.
</Callout>

* Automate everyday tasks like drafting emails, summarizing updates, and organizing information.
* Connect your favorite apps to bring context into your agent’s work.
* Use in chat or where you work (e.g., Slack) to get help in the flow.
* Stay in control with simple approvals for important actions.

<CardGroup cols={2}>
  <Card title="Create with a template" icon="shapes" color="#E9D5FF" iconType="regular" href="/langsmith/agent-builder-templates" cta="Browse templates">
    Pick a ready-made starter (e.g., email assistant or team updates) and customize.
  </Card>

<Card title="Create with AI" icon="wand-magic-sparkles" color="#4F46E5" iconType="regular">
    Describe your goal in plain English and let AI draft your agent's configuration. Review and edit before running.
  </Card>
</CardGroup>

<Steps>
  <Step title="Create an agent" icon="circle-plus">
    Start from a ready-to-use template, or describe your goal and let AI draft your agent's instructions. You can edit details before running. [Browse templates](/langsmith/agent-builder-templates).
  </Step>

<Step title="Connect your accounts" icon="link">
    Securely sign in to the services you want the agent to use.
  </Step>

<Step title="Try it out" icon="rocket">
    Run the agent and iterate on its instructions in a few clicks.
  </Step>
</Steps>

* [Essentials: connections, automation, memory, approvals](/langsmith/agent-builder-essentials)
* [Create from a template](/langsmith/agent-builder-templates)
* [Set up your workspace](/langsmith/agent-builder-setup)
* [Connect apps and services](/langsmith/agent-builder-tools) and [use remote connections](/langsmith/agent-builder-mcp-framework)
* [Choose between workspace and private agents](/langsmith/agent-builder-workspace-vs-private)
* [Authorize accounts when prompted](/langsmith/agent-builder-auth-format)
* [Call agents from your app](/langsmith/agent-builder-code)

<Note>
  Agent Builder is free for Plus and Enterprise users during the beta period. It will become a paid product when it reaches general availability.
</Note>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Agent Builder setup

**URL:** llms-txt#agent-builder-setup

**Contents:**
- How to add workspace secrets
- Required model key
- Agent Builder specific secrets
- Optional tool keys
- MCP server configuration

Source: https://docs.langchain.com/langsmith/agent-builder-setup

Add required workspace secrets for models and tools used by Agent Builder.

This page lists the workspace secrets you need to add before using Agent Builder. Add these in your LangSmith workspace settings under Secrets. Keep values scoped to your workspace and avoid placing credentials in prompts or code.

## How to add workspace secrets

In the [LangSmith UI](https://smith.langchain.com), ensure that you have an LLM API key set as a [workspace secret](/langsmith/administration-overview#workspace-secrets) (either Anthropic or OpenAI API key).

1. Navigate to <Icon icon="gear" /> **Settings** and then move to the **Secrets** tab.
2. Select **Add secret** and enter either `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` as the **name**, and your API key as the **value**.
3. Select **Save secret**.

<Note> When adding workspace secrets in the LangSmith UI, make sure the secret keys match the environment variable names expected by your model provider.</Note>

## Required model key

For Agent Builder to make API calls to LLMs, you need to set an OpenAI or Anthropic API key as a workspace secret. The agent graphs load this key from workspace secrets for inference.

<Note icon="wand-magic-sparkles" iconType="regular">
  Agent Builder supports custom models per agent. See [Custom models](/langsmith/agent-builder-essentials#custom-models) for more information.
</Note>

## Agent Builder specific secrets

Secrets prefixed with `AGENT_BUILDER_` are prioritized over workspace secrets within Agent Builder. This way, you can better track the usage of Agent Builder vs other parts of LangSmith which use the same secrets.

If you have both `OPENAI_API_KEY` and `AGENT_BUILDER_OPENAI_API_KEY`, the `AGENT_BUILDER_OPENAI_API_KEY` secret will be used.

## Optional tool keys

Add keys for any tools you enable. These are read from workspace secrets at runtime.

* `EXA_API_KEY`: Required for Exa search tools (general web and LinkedIn profile search).
* `TAVILY_API_KEY`: Required for Tavily web search.
* `TWITTER_API_KEY` and `TWITTER_API_KEY_SECRET`: Required for Twitter/X read operations (app‑only bearer). Posting/media upload is not enabled.

## MCP server configuration

Agent Builder can pull tools from one or more remote [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers. Configure MCP servers and headers in your [workspace](/langsmith/administration-overview#workspaces) settings. Agent Builder automatically discovers tools and applies the configured headers when calling them.

For more details on using the remote MCP servers, refer to the the [MCP Framework](/langsmith/agent-builder-mcp-framework#using-remote-mcp-servers) page.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-setup.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Agent building

**URL:** llms-txt#agent-building

from langchain.agents import create_agent

---

## Agent can read /memories/preferences.txt from the first thread

**URL:** llms-txt#agent-can-read-/memories/preferences.txt-from-the-first-thread

**Contents:**
- Use cases
  - User preferences
  - Self-improving instructions
  - Knowledge base

python  theme={null}
agent = create_deep_agent(
    store=InMemoryStore(),
    backend=lambda rt: CompositeBackend(
        default=StateBackend(rt),
        routes={"/memories/": StoreBackend(rt)}
    ),
    system_prompt="""When users tell you their preferences, save them to
    /memories/user_preferences.txt so you remember them in future conversations."""
)
python  theme={null}
agent = create_deep_agent(
    store=InMemoryStore(),
    backend=lambda rt: CompositeBackend(
        default=StateBackend(rt),
        routes={"/memories/": StoreBackend(rt)}
    ),
    system_prompt="""You have a file at /memories/instructions.txt with additional
    instructions and preferences.

Read this file at the start of conversations to understand user preferences.

When users provide feedback like "please always do X" or "I prefer Y",
    update /memories/instructions.txt using the edit_file tool."""
)
python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
## Use cases

### User preferences

Store user preferences that persist across sessions:
```

Example 2 (unknown):
```unknown
### Self-improving instructions

An agent can update its own instructions based on feedback:
```

Example 3 (unknown):
```unknown
Over time, the instructions file accumulates user preferences, helping the agent improve.

### Knowledge base

Build up knowledge over multiple conversations:
```

---

## Agent Chat UI

**URL:** llms-txt#agent-chat-ui

**Contents:**
  - Quick start
  - Local development
  - Connect to your agent

Source: https://docs.langchain.com/oss/python/langgraph/ui

[Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui) is a Next.js application that provides a conversational interface for interacting with any LangChain agent. It supports real-time chat, tool visualization, and advanced features like time-travel debugging and state forking. Agent Chat UI works seamlessly with agents created using [`create_agent`](../langchain/agents) and provides interactive experiences for your agents with minimal setup, whether you're running locally or in a deployed context (such as [LangSmith](/langsmith/home)).

Agent Chat UI is open source and can be adapted to your application needs.

<Frame>
  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/lInrwVnZ83o?si=Uw66mPtCERJm0EjU" title="Agent Chat UI" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
</Frame>

<Tip>
  You can use generative UI in the Agent Chat UI. For more information, see [Implement generative user interfaces with LangGraph](/langsmith/generative-ui-react).
</Tip>

The fastest way to get started is using the hosted version:

1. **Visit [Agent Chat UI](https://agentchat.vercel.app)**
2. **Connect your agent** by entering your deployment URL or local server address
3. **Start chatting** - the UI will automatically detect and render tool calls and interrupts

### Local development

For customization or local development, you can run Agent Chat UI locally:

### Connect to your agent

Agent Chat UI can connect to both [local](/oss/python/langgraph/studio#setup-local-agent-server) and [deployed agents](/oss/python/langgraph/deploy).

After starting Agent Chat UI, you'll need to configure it to connect to your agent:

1. **Graph ID**: Enter your graph name (find this under `graphs` in your `langgraph.json` file)
2. **Deployment URL**: Your Agent server's endpoint (e.g., `http://localhost:2024` for local development, or your deployed agent's URL)
3. **LangSmith API key (optional)**: Add your LangSmith API key (not required if you're using a local Agent server)

Once configured, Agent Chat UI will automatically fetch and display any interrupted threads from your agent.

<Tip>
  Agent Chat UI has out-of-the-box support for rendering tool calls and tool result messages. To customize what messages are shown, see [Hiding Messages in the Chat](https://github.com/langchain-ai/agent-chat-ui?tab=readme-ov-file#hiding-messages-in-the-chat).
</Tip>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/ui.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

---

## Agent definition

**URL:** llms-txt#agent-definition

graph_builder = StateGraph(State)
graph_builder.add_node(intent_classifier)

---

## Agent harness capabilities

**URL:** llms-txt#agent-harness-capabilities

**Contents:**
- File system access
- Large tool result eviction
- Pluggable storage backends
- Task delegation (subagents)
- Conversation history summarization
- Dangling tool call repair
- To-do list tracking
- Human-in-the-Loop
- Prompt caching (Anthropic)

Source: https://docs.langchain.com/oss/python/deepagents/harness

We think of `deepagents` as an ["agent harness"](https://blog.langchain.com/agent-frameworks-runtimes-and-harnesses-oh-my/). It is the same core tool calling loop as other agent frameworks, but with built-in tools and capabilities.

This page lists out the components that make up the agent harness.

## File system access

The harness provides six tools for file system operations, making files first-class citizens in the agent's environment:

| Tool         | Description                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------- |
| `ls`         | List files in a directory with metadata (size, modified time)                                 |
| `read_file`  | Read file contents with line numbers, supports offset/limit for large files                   |
| `write_file` | Create new files                                                                              |
| `edit_file`  | Perform exact string replacements in files (with global replace mode)                         |
| `glob`       | Find files matching patterns (e.g., `**/*.py`)                                                |
| `grep`       | Search file contents with multiple output modes (files only, content with context, or counts) |

## Large tool result eviction

The harness automatically dumps large tool results to the file system when they exceed a token threshold, preventing context window saturation.

* Monitors tool call results for size (default threshold: 20,000 tokens)
* When exceeded, writes the result to a file instead
* Replaces the tool result with a concise reference to the file
* Agent can later read the file if needed

## Pluggable storage backends

The harness abstracts file system operations behind a protocol, allowing different storage strategies for different use cases.

**Available backends:**

1. **StateBackend** - Ephemeral in-memory storage
   * Files live in the agent's state (checkpointed with conversation)
   * Persists within a thread but not across threads
   * Useful for temporary working files

2. **FilesystemBackend** - Real filesystem access
   * Read/write from actual disk
   * Supports virtual mode (sandboxed to a root directory)
   * Integrates with system tools (ripgrep for grep)
   * Security features: path validation, size limits, symlink prevention

3. **StoreBackend** - Persistent cross-conversation storage
   * Uses LangGraph's BaseStore for durability
   * Namespaced per assistant\_id
   * Files persist across conversations
   * Useful for long-term memory or knowledge bases

4. **CompositeBackend** - Route different paths to different backends
   * Example: `/` → StateBackend, `/memories/` → StoreBackend
   * Longest-prefix matching for routing
   * Enables hybrid storage strategies

## Task delegation (subagents)

The harness allows the main agent to create ephemeral "subagents" for isolated multi-step tasks.

* **Context isolation** - Subagent's work doesn't clutter main agent's context
* **Parallel execution** - Multiple subagents can run concurrently
* **Specialization** - Subagents can have different tools/configurations
* **Token efficiency** - Large subtask context is compressed into a single result

* Main agent has a `task` tool
* When invoked, creates a fresh agent instance with its own context
* Subagent executes autonomously until completion
* Returns a single final report to the main agent
* Subagents are stateless (can't send multiple messages back)

**Default subagent:**

* "general-purpose" subagent automatically available
* Has filesystem tools by default
* Can be customized with additional tools/middleware

**Custom subagents:**

* Define specialized subagents with specific tools
* Example: code-reviewer, web-researcher, test-runner
* Configure via `subagents` parameter

## Conversation history summarization

The harness automatically compresses old conversation history when token usage becomes excessive.

* Triggers at 170,000 tokens
* Keeps the most recent 6 messages intact
* Older messages are summarized by the model

* Enables very long conversations without hitting context limits
* Preserves recent context while compressing ancient history
* Transparent to the agent (appears as a special system message)

## Dangling tool call repair

The harness fixes message history when tool calls are interrupted or cancelled before receiving results.

* Agent requests tool call: "Please run X"
* Tool call is interrupted (user cancels, error, etc.)
* Agent sees tool\_call in AIMessage but no corresponding ToolMessage
* This creates an invalid message sequence

* Detects AIMessages with tool\_calls that have no results
* Creates synthetic ToolMessage responses indicating the call was cancelled
* Repairs the message history before agent execution

* Prevents agent confusion from incomplete message chains
* Gracefully handles interruptions and errors
* Maintains conversation coherence

## To-do list tracking

The harness provides a `write_todos` tool that agents can use to maintain a structured task list.

* Track multiple tasks with statuses (pending, in\_progress, completed)
* Persisted in agent state
* Helps agent organize complex multi-step work
* Useful for long-running tasks and planning

The harness pauses agent execution at specified tool calls to allow human approval/modification.

* Map tool names to interrupt configurations
* Example: `{"edit_file": True}` - pause before every edit
* Can provide approval messages or modify tool inputs

* Safety gates for destructive operations
* User verification before expensive API calls
* Interactive debugging and guidance

## Prompt caching (Anthropic)

The harness enables Anthropic's prompt caching feature to reduce redundant token processing.

* Caches portions of the prompt that repeat across turns
* Significantly reduces latency and cost for long system prompts
* Automatically skips for non-Anthropic models

* System prompts (especially with filesystem docs) can be 5k+ tokens
* These repeat every turn without caching
* Caching provides \~10x speedup and cost reduction

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/harness.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Agent model

**URL:** llms-txt#agent-model

qa_llm = init_chat_model("claude-sonnet-4-5-20250929")

---

## Agent reads /memories/project_notes.txt from previous conversation

**URL:** llms-txt#agent-reads-/memories/project_notes.txt-from-previous-conversation

**Contents:**
  - Research projects
- Store implementations
  - InMemoryStore (development)
  - PostgresStore (production)
- Best practices
  - Use descriptive paths
  - Document the memory structure
  - Prune old data
  - Choose the right storage

python  theme={null}
research_agent = create_deep_agent(
    store=InMemoryStore(),
    backend=lambda rt: CompositeBackend(
        default=StateBackend(rt),
        routes={"/memories/": StoreBackend(rt)}
    ),
    system_prompt="""You are a research assistant.

Save your research progress to /memories/research/:
    - /memories/research/sources.txt - List of sources found
    - /memories/research/notes.txt - Key findings and notes
    - /memories/research/report.md - Final report draft

This allows research to continue across multiple sessions."""
)
python  theme={null}
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
agent = create_deep_agent(
    store=store,
    backend=lambda rt: CompositeBackend(
        default=StateBackend(rt),
        routes={"/memories/": StoreBackend(rt)}
    )
)
python  theme={null}
from langgraph.store.postgres import PostgresStore
import os

store = PostgresStore(connection_string=os.environ["DATABASE_URL"])
agent = create_deep_agent(
    store=store,
    backend=lambda rt: CompositeBackend(
        default=StateBackend(rt),
        routes={"/memories/": StoreBackend(rt)}
    )
)

/memories/user_preferences.txt
/memories/research/topic_a/sources.txt
/memories/research/topic_a/notes.txt
/memories/project/requirements.md

Your persistent memory structure:
- /memories/preferences.txt: User preferences and settings
- /memories/context/: Long-term context about the user
- /memories/knowledge/: Facts and information learned over time
```

Implement periodic cleanup of outdated persistent files to keep storage manageable.

### Choose the right storage

* **Development**: Use `InMemoryStore` for quick iteration
* **Production**: Use `PostgresStore` or other persistent stores
* **Multi-tenant**: Consider using assistant\_id-based namespacing in your store

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/long-term-memory.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
### Research projects

Maintain research state across sessions:
```

Example 2 (unknown):
```unknown
## Store implementations

Any LangGraph `BaseStore` implementation works:

### InMemoryStore (development)

Good for testing and development, but data is lost on restart:
```

Example 3 (unknown):
```unknown
### PostgresStore (production)

For production, use a persistent store:
```

Example 4 (unknown):
```unknown
## Best practices

### Use descriptive paths

Organize persistent files with clear paths:
```

---

## Agent Server API reference for LangSmith Deployment

**URL:** llms-txt#agent-server-api-reference-for-langsmith-deployment

**Contents:**
- Authentication

Source: https://docs.langchain.com/langsmith/server-api-ref

The Agent Server API reference is available within each [deployment](/langsmith/deployments) at the `/docs` endpoint (e.g. `http://localhost:8124/docs`).

Browse the full API reference in the **Agent Server API** section in the sidebar, or see the endpoint groups below:

* [Assistants](/langsmith/agent-server-api/assistants) - Configured instances of a graph
* [Threads](/langsmith/agent-server-api/threads) - Accumulated outputs of a group of runs
* [Thread Runs](/langsmith/agent-server-api/thread-runs) - Invocations of a graph/assistant on a thread
* [Stateless Runs](/langsmith/agent-server-api/stateless-runs) - Invocations with no state persistence
* [Crons](/langsmith/agent-server-api/crons-plus-tier) - Periodic runs on a schedule
* [Store](/langsmith/agent-server-api/store) - Persistent key-value store for long-term memory
* [A2A](/langsmith/agent-server-api/a2a) - Agent-to-Agent Protocol endpoints
* [MCP](/langsmith/agent-server-api/mcp) - Model Context Protocol endpoints
* [System](/langsmith/agent-server-api/system) - Health checks and server info

For deployments to LangSmith, authentication is required. Pass the `X-Api-Key` header with each request to the Agent Server. The value of the header should be set to a valid LangSmith API key for the organization where the Agent Server is deployed.

Example `curl` command:

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/server-api-ref.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Agent Server

**URL:** llms-txt#agent-server

**Contents:**
- Application structure
- Parts of a deployment
  - Graphs
  - Persistence and task queue
- Learn more

Source: https://docs.langchain.com/langsmith/agent-server

LangSmith Deployment's **Agent Server** offers an API for creating and managing agent-based applications. It is built on the concept of [assistants](/langsmith/assistants), which are agents configured for specific tasks, and includes built-in [persistence](/oss/python/langgraph/persistence#memory-store) and a **task queue**. This versatile API supports a wide range of agentic application use cases, from background processing to real-time interactions.

Use Agent Server to create and manage [assistants](/langsmith/assistants), [threads](/oss/python/langgraph/persistence#threads), [runs](/langsmith/assistants#execution), [cron jobs](/langsmith/cron-jobs), [webhooks](/langsmith/use-webhooks), and more.

<Tip>
  **API reference**<br />
  For detailed information on the API endpoints and data models, refer to the [API reference docs](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html).
</Tip>

To use the Enterprise version of the Agent Server, you must acquire a license key that you will need to specify when running the Docker image. To acquire a license key, [contact our sales team](https://www.langchain.com/contact-sales).

You can run the Enterprise version of the Agent Server on the following LangSmith [platform](/langsmith/platform-setup) options:

* [Cloud](/langsmith/cloud)
* [Hybrid](/langsmith/hybrid)
* [Self-hosted](/langsmith/self-hosted)

## Application structure

To deploy an Agent Server application, you need to specify the graph(s) you want to deploy, as well as any relevant configuration settings, such as dependencies and environment variables.

Read the [application structure](/langsmith/application-structure) guide to learn how to structure your LangGraph application for deployment.

## Parts of a deployment

When you deploy Agent Server, you are deploying one or more [graphs](#graphs), a database for [persistence](/oss/python/langgraph/persistence), and a task queue.

When you deploy a graph with Agent Server, you are deploying a "blueprint" for an [Assistant](/langsmith/assistants).

An [Assistant](/langsmith/assistants) is a graph paired with specific configuration settings. You can create multiple assistants per graph, each with unique settings to accommodate different use cases
that can be served by the same graph.

Upon deployment, Agent Server will automatically create a default assistant for each graph using the graph's default configuration settings.

<Note>
  We often think of a graph as implementing an [agent](/oss/python/langgraph/workflows-agents), but a graph does not necessarily need to implement an agent. For example, a graph could implement a simple
  chatbot that only supports back-and-forth conversation, without the ability to influence any application control flow. In reality, as applications get more complex, a graph will often implement a more complex flow that may use [multiple agents](/oss/python/langchain/multi-agent) working in tandem.
</Note>

### Persistence and task queue

Agent Server leverages a database for [persistence](/oss/python/langgraph/persistence) and a task queue.

[PostgreSQL](https://www.postgresql.org/) is supported as a database for Agent Server and [Redis](https://redis.io/) as the task queue.

If you're deploying using [LangSmith cloud](/langsmith/cloud), these components are managed for you. If you're deploying Agent Server on your [own infrastructure](/langsmith/self-hosted), you'll need to set up and manage these components yourself.

For more information on how these components are set up and managed, review the [hosting options](/langsmith/platform-setup) guide.

* [Application Structure](/langsmith/application-structure) guide explains how to structure your application for deployment.
* The [API Reference](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html) provides detailed information on the API endpoints and data models.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-server.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Agent Server changelog

**URL:** llms-txt#agent-server-changelog

Source: https://docs.langchain.com/langsmith/agent-server-changelog

<Callout icon="rss" color="#DFC5FE" iconType="regular">
  **Subscribe**: Our changelog includes an [RSS feed](https://docs.langchain.com/langsmith/agent-server-changelog/rss.xml) that can integrate with [Slack](https://slack.com/help/articles/218688467-Add-RSS-feeds-to-Slack), [email](https://zapier.com/apps/email/integrations/rss/1441/send-new-rss-feed-entries-via-email), Discord bots like [Readybot](https://readybot.io/) or [RSS Feeds to Discord Bot](https://rss.app/en/bots/rssfeeds-discord-bot), and other subscription tools.
</Callout>

[Agent Server](/langsmith/agent-server) is an API platform for creating and managing agent-based applications. It provides built-in persistence, a task queue, and supports deploying, configuring, and running assistants (agentic workflows) at scale. This changelog documents all notable updates, features, and fixes to Agent Server releases.

<Update label="2025-12-18" tags={["agent-server"]}>
  ## v0.6.9

* Enforced stable JSON keys for custom encryption, removed model-type-specific custom JSON functions, and improved error handling for double-encryption scenarios.
</Update>

<Update label="2025-12-18" tags={["agent-server"]}>
  ## v0.6.8

* Added profiling feature to enhance performance analysis and monitoring.
</Update>

<Update label="2025-12-18" tags={["agent-server"]}>
  ## v0.6.7

* Logged server startup time for improved monitoring and diagnostics.
</Update>

<Update label="2025-12-17" tags={["agent-server"]}>
  ## v0.6.5

* Added a warning log that triggers during import time for improved visibility.
</Update>

<Update label="2025-12-16" tags={["agent-server"]}>
  ## v0.6.4

* Enhanced custom encryption by parallelizing metadata and config processes, added encryption for thread.config and some checkpoints, improved tests and schema consistency.
  * Ensured the Go server starts as `core-api` in the queue entrypoint for consistent runtime behavior.
</Update>

<Update label="2025-12-15" tags={["agent-server"]}>
  ## v0.6.2

* Resolved an issue that caused duplicate calls to middleware when `mount_prefix` was specified.
</Update>

<Update label="2025-12-15" tags={["agent-server"]}>
  ## v0.6.0

This minor version updates the streaming APIs `/join-stream` and `/stream` behavior with respect to the `last-event-id` parameter to align with the SSE spec. Previously, passing a last-event-id would return that message in addition to any following messages. Going forward, these APIs will only return new messages following the provided last-event-id. For example, with the following stream, previously passing a last-event-id of `2` would return the messages with ids `2` and `3`, but will now only return the message with id `3`:

This bump also includes some fixes, including a bug exposing unintended internal events in run streams.
</Update>

<Update label="2025-12-12" tags={["agent-server"]}>
  ## v0.5.42

* Modified the Go server to rely solely on the CLI `-service` flag for determining service mode, ignoring the globally set `FF_USE_CORE_API` for better deployment specificity.
</Update>

<Update label="2025-12-11" tags={["agent-server"]}>
  ## v0.5.41

Fixed an issue with cron jobs in hybrid mode by ensuring proper initialization of the ENTERPRISE\_SAAS global flag.
</Update>

<Update label="2025-12-10" tags={["agent-server"]}>
  ## v0.5.39

* Completed the implementation of custom encryptions for runs and crons, along with simplifying encryption processes.
  * Introduced support for streaming subgraph events in both `values` and `updates` stream modes.
</Update>

<Update label="2025-12-10" tags={["agent-server"]}>
  ## v0.5.38

* Implemented complete custom encryption for threads, ensuring all thread data is properly secured and encrypted.
  * Ensured Redis attempt flags are consistently expired to prevent stale data.
  * Added core authentication and support for OR/AND filters, enhancing security and flexibility.
</Update>

<Update label="2025-12-09" tags={["agent-server"]}>
  ## v0.5.37

Added a `name` parameter to the assistants count API for improved search flexibility.
</Update>

<Update label="2025-12-09" tags={["agent-server"]}>
  ## v0.5.36

* Introduced configurable webhook support, allowing users to customize submitted webhooks and headers.
  * Added an `/ok` endpoint at the root for easier health checks and simplified configuration.
</Update>

<Update label="2025-12-08" tags={["agent-server"]}>
  ## v0.5.34

Introduced custom encryption middleware, allowing users to define their own encryption methods for enhanced data protection.
</Update>

<Update label="2025-12-08" tags={["agent-server"]}>
  ## v0.5.33

Set Uvicorn's keep-alive timeout to 75 seconds to prevent occasional 502 errors and improve connection handling.
</Update>

<Update label="2025-12-06" tags={["agent-server"]}>
  ## v0.5.32

Introduced OpenTelemetry telemetry agent with support for New Relic integration.
</Update>

<Update label="2025-12-05" tags={["agent-server"]}>
  ## v0.5.31

Added Py-Spy profiling for improved analysis of deployment performance, with some limitations on coverage.
</Update>

<Update label="2025-12-05" tags={["agent-server"]}>
  ## v0.5.30

* Always configure loopback transport clients to enhance reliability.
  * Ensured authentication headers are passed for remote non-stream methods in JS.
</Update>

<Update label="2025-12-04" tags={["agent-server"]}>
  ## v0.5.28

* Introduced a faster, Rust-based implementation of uuid7 to improve performance, now used in langsmith and langchain-core.
  * Added support for `$or` and `$and` in PostgreSQL auth filters to enable complex logic in authentication checks.
  * Capped psycopg and psycopg-pool versions to prevent infinite waiting on startup.
</Update>

<Update label="2025-11-26" tags={["agent-server"]}>
  ## v0.5.27

* Ensured `runs.list` with filters returns only run fields, preventing incorrect status data from being included.
  * (JS) Updated `uuid` from version 10.0.0 to 13.0.0. and `exit-hook` from version 4.0.0 to 5.0.1.
</Update>

<Update label="2025-11-24" tags={["agent-server"]}>
  ## v0.5.26

Resolved issues with `store.put` when used without AsyncBatchedStore in the JavaScript environment.
</Update>

<Update label="2025-11-22" tags={["agent-server"]}>
  ## v0.5.25

* Introduced the ability to search assistants by their `name` using a new endpoint.
  * Casted store\_get return types to tuple in JavaScript to ensure type consistency.
</Update>

<Update label="2025-11-21" tags={["agent-server"]}>
  ## v0.5.24

* Added executor metrics for Datadog and enhanced core stream API metrics for better performance tracking.
  * Disabled Redis Go maintenance notifications to prevent startup errors with unsupported commands in Redis versions below 8.
</Update>

<Update label="2025-11-20" tags={["agent-server"]}>
  ## v0.5.20

Resolved an error in the executor service that occurred when handling large messages.
</Update>

<Update label="2025-11-19" tags={["agent-server"]}>
  ## v0.5.19

Upgraded built-in langchain-core to version 1.0.7 to address a prompt formatting vulnerability.
</Update>

<Update label="2025-11-19" tags={["agent-server"]}>
  ## v0.5.18

Introduced persistent cron threads with `on_run_completed: {keep,delete}` for enhanced cron management and retrieval options.
</Update>

<Update label="2025-11-19" tags={["agent-server"]}>
  ## v0.5.17

Enhanced task handling to support multiple interrupts, aligning with open-source functionality.
</Update>

<Update label="2025-11-18" tags={["agent-server"]}>
  ## v0.5.15

Added custom JSON unmarshalling for `Resume` and `Goto` commands to fix map-style null resume interpretation issues.
</Update>

<Update label="2025-11-14" tags={["agent-server"]}>
  ## v0.5.14

Ensured `pg make start` command functions correctly with core-api enabled.
</Update>

<Update label="2025-11-13" tags={["agent-server"]}>
  ## v0.5.13

Support `include` and `exclude` (plural form key for `includes` and `excludes`) since a doc incorrectly claimed support for that. Now the server accepts either.
</Update>

<Update label="2025-11-10" tags={["agent-server"]}>
  ## v0.5.11

* Ensured auth handlers are applied consistently when streaming threads, aligning with recent security practices.
  * Bumped `undici` dependency from version 6.21.3 to 7.16.0, introducing various performance improvements and bug fixes.
  * Updated `p-queue` from version 8.0.1 to 9.0.0, introducing new features and breaking changes, including the removal of the `throwOnTimeout` option.
</Update>

<Update label="2025-11-10" tags={["agent-server"]}>
  ## v0.5.10

Implemented healthcheck calls in the queue /ok handler to improve Kubernetes liveness and readiness probe compatibility.
</Update>

<Update label="2025-11-09" tags={["agent-server"]}>
  ## v0.5.9

* Resolved an issue causing an "unbound local error" for the `elapsed` variable during a SIGINT interruption.
  * Mapped the "interrupted" status to A2A's "input-required" status for better task status alignment.
</Update>

<Update label="2025-11-07" tags={["agent-server"]}>
  ## v0.5.8

* Ensured environment variables are passed as a dictionary when starting langgraph-ui for compatibility with `uvloop`.
  * Implemented CRUD operations for runs in Go, simplifying JSON merges and improving transaction readability, with PostgreSQL as a reference.
</Update>

<Update label="2025-11-07" tags={["agent-server"]}>
  ## v0.5.7

Replaced no-retry Redis client with a retry client to handle connection errors more effectively and reduced corresponding logging severity.
</Update>

<Update label="2025-11-06" tags={["agent-server"]}>
  ## v0.5.6

* Added pending time metrics to provide better insights into task waiting times.
  * Replaced `pb.Value` with `ChannelValue` to streamline code structure.
</Update>

<Update label="2025-11-05" tags={["agent-server"]}>
  ## v0.5.5

Made the Redis `health_check_interval` more frequent and configurable for better handling of idle connections.
</Update>

<Update label="2025-11-05" tags={["agent-server"]}>
  ## v0.5.4

Implemented `ormsgpack` with `OPT_REPLACE_SURROGATES` and updated for compatibility with the latest FastAPI release affecting custom authentication dependencies.
</Update>

<Update label="2025-11-03" tags={["agent-server"]}>
  ## v0.5.2

Added retry logic for PostgreSQL connections during startup to enhance deployment reliability and improved error logging for easier debugging.
</Update>

<Update label="2025-11-03" tags={["agent-server"]}>
  ## v0.5.1

* Resolved an issue where persistence was not functioning correctly with LangChain.js's createAgent feature.
  * Optimized assistants CRUD performance by improving database connection pooling and gRPC client reuse, reducing latency for large payloads.
</Update>

<Update label="2025-10-31" tags={["agent-server"]}>
  ## v0.5.0

This minor version now requires langgraph-checkpoint versions later than 3.0 to prevent a deserialization vulnerability in earlier versions of the langgraph-checkpoint library.
  The `langgraph-checkpoint` library is compatible with `langgraph` minor versions 0.4, 0.5, 0.6, and 1.0.

This version removes default support for deserialization of payloads saved using the "json" type, which has never been the default.
  By default, objects are serialized using msgpack. Under certain uncommon situations, payloads were serialized using an older "json" mode. If those payloads contained custom python objects, those will no longer be deserializable unless you provide a `serde` config:

<Update label="2025-10-29" tags={["agent-server"]}>
  ## v0.4.47

* Validated and auto-corrected environment configuration types using TypeAdapter.
  * Added support for LangChain.js and LangGraph.js version 1.x, ensuring compatibility.
  * Updated hono library from version 4.9.7 to 4.10.3, addressing a CORS middleware security issue and enhancing JWT audience validation.
  * Introduced a modular benchmark framework, adding support for assistants and streams, with improvements to the existing ramp benchmark methodology.
  * Introduced a gRPC API for core threads CRUD operations, with updated Python and TypeScript clients.
  * Updated `hono` package from version 4.9.7 to 4.10.2, including security improvements for JWT audience validation.
  * Updated `hono` dependency from version 4.9.7 to 4.10.3 to fix a security issue and improve CORS middleware handling.
  * Introduced basic CRUD operations for threads, including create, get, patch, delete, search, count, and copy, with support for Go, gRPC server, and Python and TypeScript clients.
</Update>

<Update label="2025-10-21" tags={["agent-server"]}>
  ## v0.4.46

Added an option to enable message streaming from subgraph events, giving users more control over event notifications.
</Update>

<Update label="2025-10-21" tags={["agent-server"]}>
  ## v0.4.45

* Implemented support for authorization on custom routes, controlled by the `enable_custom_route_auth` flag.
  * Set default tracing to off for improved performance and simplified debugging.
</Update>

<Update label="2025-10-18" tags={["agent-server"]}>
  ## v0.4.44

Used Redis key prefix for license-related keys to prevent conflicts with existing setups.
</Update>

<Update label="2025-10-16" tags={["agent-server"]}>
  ## v0.4.43

Implemented a health check for Redis connections to prevent them from idling out.
</Update>

<Update label="2025-10-15" tags={["agent-server"]}>
  ## v0.4.40

* Prevented duplicate messages in resumable run and thread streams by addressing a race condition and adding tests to ensure consistent behavior.
  * Ensured that runs don't start until the pubsub subscription is confirmed to prevent message drops on startup.
  * Renamed platform from langgraph to improve clarity and branding.
  * Reset PostgreSQL connections after use to prevent lock holding and improved error reporting for transaction issues.
</Update>

<Update label="2025-10-10" tags={["agent-server"]}>
  ## v0.4.39

* Upgraded `hono` from version 4.7.6 to 4.9.7, addressing a security issue related to the `bodyLimit` middleware.
  * Allowed customization of the base authentication URL to enhance flexibility.
  * Pinned the 'ty' dependency to a stable version using 'uv' to prevent unexpected linting failures.
</Update>

<Update label="2025-10-08" tags={["agent-server"]}>
  ## v0.4.38

* Replaced `LANGSMITH_API_KEY` with `LANGSMITH_CONTROL_PLANE_API_KEY` to support hybrid deployments requiring license verification.
  * Introduced self-hosted log ingestion support, configurable via `SELF_HOSTED_LOGS_ENABLED` and `SELF_HOSTED_LOGS_ENDPOINT` environment variables.
</Update>

<Update label="2025-10-06" tags={["agent-server"]}>
  ## v0.4.37

Required create permissions for copying threads to ensure proper authorization.
</Update>

<Update label="2025-10-03" tags={["agent-server"]}>
  ## v0.4.36

* Improved error handling and added a delay to the sweep loop for smoother operation during Redis downtime or cancellation errors.
  * Updated the queue entrypoint to start the core-api gRPC server when `FF_USE_CORE_API` is enabled.
  * Introduced checks for invalid configurations in assistant endpoints to ensure consistency with other endpoints.
</Update>

<Update label="2025-10-02" tags={["agent-server"]}>
  ## v0.4.35

* Resolved a timezone issue in the core API, ensuring accurate time data retrieval.
  * Introduced a new `middleware_order` setting to apply authentication middleware before custom middleware, allowing finer control over protected route configurations.
  * Logged the Redis URL when errors occur during Redis client creation.
  * Improved Go engine/runtime context propagation to ensure consistent execution flow.
  * Removed the unnecessary `assistants.put` call from the executor entrypoint to streamline the process.
</Update>

<Update label="2025-10-01" tags={["agent-server"]}>
  ## v0.4.34

Blocked unauthorized users from updating thread TTL settings to enhance security.
</Update>

<Update label="2025-10-01" tags={["agent-server"]}>
  ## v0.4.33

* Improved error handling for Redis locks by logging `LockNotOwnedError` and extending initial pool migration lock timeout to 60 seconds.
  * Updated the BaseMessage schema to align with the latest langchain-core version and synchronized build dependencies for consistent local development.
</Update>

<Update label="2025-09-30" tags={["agent-server"]}>
  ## v0.4.32

* Added a GO persistence layer to the API image, enabling GRPC server operation with PostgreSQL support and enhancing configurability.
  * Set the status to error when a timeout occurs to improve error handling.
</Update>

<Update label="2025-09-30" tags={["agent-server"]}>
  ## v0.4.30

* Added support for context when using `stream_mode="events"` and included new tests for this functionality.
  * Added support for overriding the server port using `$LANGGRAPH_SERVER_PORT` and removed an unnecessary Dockerfile `ARG` for cleaner configuration.
  * Applied authorization filters to all table references in thread delete CTE to enhance security.
  * Introduced self-hosted metrics ingestion capability, allowing metrics to be sent to an OTLP collector every minute when the corresponding environment variables are set.
  * Ensured that the `set_latest` function properly updates the name and description of the version.
</Update>

<Update label="2025-09-26" tags={["agent-server"]}>
  ## v0.4.29

Ensured proper cleanup of redis pubsub connections in all scenarios.
</Update>

<Update label="2025-09-25" tags={["agent-server"]}>
  ## v0.4.28

* Added a format parameter to the queue metrics server for enhanced customization.
  * Corrected `MOUNT_PREFIX` environment variable usage in CLI for consistency with documentation and to prevent confusion.
  * Added a feature to log warnings when messages are dropped due to no subscribers, controllable via a feature flag.
  * Added support for Bookworm and Bullseye distributions in Node images.
  * Consolidated executor definitions by moving them from the `langgraph-go` repository, improving manageability and updating the checkpointer setup method for server migrations.
  * Ensured correct response headers are sent for a2a, improving compatibility and communication.
  * Consolidated PostgreSQL checkpoint implementation, added CI testing for the `/core` directory, fixed RemoteStore test errors, and enhanced the Store implementation with transactions.
  * Added PostgreSQL migrations to the queue server to prevent errors from graphs being added before migrations are performed.
</Update>

<Update label="2025-09-23" tags={["agent-server"]}>
  ## v0.4.27

Replaced `coredis` with `redis-py` to improve connection handling and reliability under high traffic loads.
</Update>

<Update label="2025-09-22" tags={["agent-server"]}>
  ## v0.4.24

* Added functionality to return full message history for A2A calls in accordance with the A2A spec.
  * Added a `LANGGRAPH_SERVER_HOST` environment variable to Dockerfiles to support custom host settings for dual stack mode.
</Update>

<Update label="2025-09-22" tags={["agent-server"]}>
  ## v0.4.23

Use a faster message codec for redis streaming.
</Update>

<Update label="2025-09-19" tags={["agent-server"]}>
  ## v0.4.22

Ported long-stream handling to the run stream, join, and cancel endpoints for improved stream management.
</Update>

<Update label="2025-09-18" tags={["agent-server"]}>
  ## v0.4.21

* Added A2A streaming functionality and enhanced testing with the A2A SDK.
  * Added Prometheus metrics to track language usage in graphs, middleware, and authentication for improved insights.
  * Fixed bugs in Open Source Software related to message conversion for chunks.
  * Removed await from pubsub subscribes to reduce flakiness in cluster tests and added retries in the shutdown suite to enhance API stability.
</Update>

<Update label="2025-09-11" tags={["agent-server"]}>
  ## v0.4.20

Optimized Pubsub initialization to prevent overhead and address subscription timing issues, ensuring smoother run execution.
</Update>

<Update label="2025-09-11" tags={["agent-server"]}>
  ## v0.4.19

Removed warnings from psycopg by addressing function checks introduced in version 3.2.10.
</Update>

<Update label="2025-09-11" tags={["agent-server"]}>
  ## v0.4.17

Filtered out logs with mount prefix to reduce noise in logging output.
</Update>

<Update label="2025-09-10" tags={["agent-server"]}>
  ## v0.4.16

* Added support for implicit thread creation in a2a to streamline operations.
  * Improved error serialization and emission in distributed runtime streams, enabling more comprehensive testing.
</Update>

<Update label="2025-09-09" tags={["agent-server"]}>
  ## v0.4.13

* Monitored queue status in the health endpoint to ensure correct behavior when PostgreSQL fails to initialize.
  * Addressed an issue with unequal swept ID lengths to improve log clarity.
  * Enhanced streaming outputs by avoiding re-serialization of DR payloads, using msgpack byte inspection for json-like parsing.
</Update>

<Update label="2025-09-04" tags={["agent-server"]}>
  ## v0.4.12

* Ensured metrics are returned even when experiencing database connection issues.
  * Optimized update streams to prevent unnecessary data transmission.
  * Upgraded `hono` from version 4.9.2 to 4.9.6 in the `storage_postgres/langgraph-api-server` for improved URL path parsing security.
  * Added retries and an in-memory cache for LangSmith access calls to improve resilience against single failures.
</Update>

<Update label="2025-09-04" tags={["agent-server"]}>
  ## v0.4.11

Added support for TTL (time-to-live) in thread updates.
</Update>

<Update label="2025-09-04" tags={["agent-server"]}>
  ## v0.4.10

In distributed runtime, update serde logic for final checkpoint -> thread setting.
</Update>

<Update label="2025-09-02" tags={["agent-server"]}>
  ## v0.4.9

* Added support for filtering search results by IDs in the search endpoint for more precise queries.
  * Included configurable headers for assistant endpoints to enhance request customization.
  * Implemented a simple A2A endpoint with support for agent card retrieval, task creation, and task management.
</Update>

<Update label="2025-08-30" tags={["agent-server"]}>
  ## v0.4.7

Stopped the inclusion of x-api-key to enhance security.
</Update>

<Update label="2025-08-29" tags={["agent-server"]}>
  ## v0.4.6

Fixed a race condition when joining streams, preventing duplicate start events.
</Update>

<Update label="2025-08-29" tags={["agent-server"]}>
  ## v0.4.5

* Ensured the checkpointer starts and stops correctly before and after the queue to improve shutdown and startup efficiency.
  * Resolved an issue where workers were being prematurely cancelled when the queue was cancelled.
  * Prevented queue termination by adding a fallback for cases when Redis fails to wake a worker.
</Update>

<Update label="2025-08-28" tags={["agent-server"]}>
  ## v0.4.4

* Set the custom auth thread\_id to None for stateless runs to prevent conflicts.
  * Improved Redis signaling in the Go runtime by adding a wakeup worker and Redis lock implementation, and updated sweep logic.
</Update>

<Update label="2025-08-27" tags={["agent-server"]}>
  ## v0.4.3

* Added stream mode to thread stream for improved data processing.
  * Added a durability parameter to runs for improved data persistence.
</Update>

<Update label="2025-08-27" tags={["agent-server"]}>
  ## v0.4.2

Ensured pubsub is initialized before creating a run to prevent errors from missing messages.
</Update>

<Update label="2025-08-25" tags={["agent-server"]}>
  ## v0.4.0

Minor version 0.4 comes with a number of improvements as well as some breaking changes.

* Emitted attempt messages correctly within the thread stream.
  * Reduced cluster conflicts by using only the thread ID for hashing in cluster mapping, prioritizing efficiency with stream\_thread\_cache.
  * Introduced a stream endpoint for threads to track all outputs across sequentially executed runs.
  * Made the filter query builder in PostgreSQL more robust against malformed expressions and improved validation to prevent potential security risks.

This minor version also includes a couple of breaking changes to improve the usability and security of the service:

* In this minor version, we stop the practice of automatically including headers as configurable values in your runs. You can opt-in to specific patterns by setting **configurable\_headers** in your agent server config.
  * Run stream event IDs (for resumable streams) are now in the format of `ms-seq` instead of the previous format. We retain backwards compatibility for the old format, but we recommend using the new format for new code.
</Update>

<Update label="2025-08-25" tags={["agent-server"]}>
  ## v0.3.4

* Added custom Prometheus metrics for Redis/PG connection pools and switched the queue server to Uvicorn/Starlette for improved monitoring.
  * Restored Wolfi image build by correcting shell command formatting and added a Makefile target for testing with nginx.
</Update>

<Update label="2025-08-22" tags={["agent-server"]}>
  ## v0.3.3

* Added timeouts to specific Redis calls to prevent workers from being left active.
  * Updated the Golang runtime and added pytest skips for unsupported functionalities, including initial support for passing store to node and message streaming.
  * Introduced a reverse proxy setup for serving combined Python and Node.js graphs, with nginx handling server routing, to facilitate a Postgres/Redis backend for the Node.js API server.
</Update>

<Update label="2025-08-21" tags={["agent-server"]}>
  ## v0.3.1

Added a statement timeout to the pool to prevent long-running queries.
</Update>

<Update label="2025-08-21" tags={["agent-server"]}>
  ## v0.3.0

* Set a default 15-minute statement timeout and implemented monitoring for long-running queries to ensure system efficiency.
  * Stop propagating run configurable values to the thread configuration, because this can cause issues on subsequent runs if you are specifying a checkpoint\_id. This is a **slight breaking change** in behavior, since the thread value will no longer automatically reflect the unioned configuration of the most recent run. We believe this behavior is more intuitive, however.
  * Enhanced compatibility with older worker versions by handling event data in channel names within ops.py.
</Update>

<Update label="2025-08-20" tags={["agent-server"]}>
  ## v0.2.137

Fixed an unbound local error and improved logging for thread interruptions or errors, along with type updates.
</Update>

<Update label="2025-08-20" tags={["agent-server"]}>
  ## v0.2.136

* Added enhanced logging to aid in debugging metaview issues.
  * Upgraded executor and runtime to the latest version for improved performance and stability.
</Update>

<Update label="2025-08-19" tags={["agent-server"]}>
  ## v0.2.135

Ensured async coroutines are properly awaited to prevent potential runtime errors.
</Update>

<Update label="2025-08-18" tags={["agent-server"]}>
  ## v0.2.134

Enhanced search functionality to improve performance by allowing users to select specific columns for query results.
</Update>

<Update label="2025-08-18" tags={["agent-server"]}>
  ## v0.2.133

* Added count endpoints for crons, threads, and assistants to enhance data tracking (#1132).
  * Improved SSH functionality for better reliability and stability.
  * Updated @langchain/langgraph-api to version 0.0.59 to fix an invalid state schema issue.
</Update>

<Update label="2025-08-15" tags={["agent-server"]}>
  ## v0.2.132

* Added Go language images to enhance project compatibility and functionality.
  * Printed internal PIDs for JS workers to facilitate process inspection via SIGUSR1 signal.
  * Resolved a `run_pkey` error that occurred when attempting to insert duplicate runs.
  * Added `ty run` command and switched to using uuid7 for generating run IDs.
  * Implemented the initial Golang runtime to expand language support.
</Update>

<Update label="2025-08-14" tags={["agent-server"]}>
  ## v0.2.131

Added support for `object agent spec` with descriptions in JS.
</Update>

<Update label="2025-08-13" tags={["agent-server"]}>
  ## v0.2.130

* Added a feature flag (FF\_RICH\_THREADS=false) to disable thread updates on run creation, reducing lock contention and simplifying thread status handling.
  * Utilized existing connections for `aput` and `apwrite` operations to improve performance.
  * Improved error handling for decoding issues to enhance data processing reliability.
  * Excluded headers from logs to improve security while maintaining runtime functionality.
  * Fixed an error that prevented mapping slots to a single node.
  * Added debug logs to track node execution in JS deployments for improved issue diagnosis.
  * Changed the default multitask strategy to enqueue, improving throughput by eliminating the need to fetch inflight runs during new run insertions.
  * Optimized database operations for `Runs.next` and `Runs.sweep` to reduce redundant queries and improve efficiency.
  * Improved run creation speed by skipping unnecessary inflight runs queries.
</Update>

<Update label="2025-08-11" tags={["agent-server"]}>
  ## v0.2.129

* Stopped passing internal LGP fields to context to prevent breaking type checks.
  * Exposed content-location headers to ensure correct resumability behavior in the API.
</Update>

<Update label="2025-08-08" tags={["agent-server"]}>
  ## v0.2.128

Ensured synchronized updates between `configurable` and `context` in assistants, preventing setup errors and supporting smoother version transitions.
</Update>

<Update label="2025-08-08" tags={["agent-server"]}>
  ## v0.2.127

Excluded unrequested stream modes from the resumable stream to optimize functionality.
</Update>

<Update label="2025-08-08" tags={["agent-server"]}>
  ## v0.2.126

* Made access logger headers configurable to enhance logging flexibility.
  * Debounced the Runs.stats function to reduce the frequency of expensive calls and improve performance.
  * Introduced debouncing for sweepers to enhance performance and efficiency (#1147).
  * Acquired a lock for TTL sweeping to prevent database spamming during scale-out operations.
</Update>

<Update label="2025-08-06" tags={["agent-server"]}>
  ## v0.2.125

Updated tracing context replicas to use the new format, ensuring compatibility.
</Update>

<Update label="2025-08-06" tags={["agent-server"]}>
  ## v0.2.123

Added an entrypoint to the queue replica for improved deployment management.
</Update>

<Update label="2025-08-06" tags={["agent-server"]}>
  ## v0.2.122

Utilized persisted interrupt status in `join` to ensure correct handling of user's interrupt state after completion.
</Update>

<Update label="2025-08-06" tags={["agent-server"]}>
  ## v0.2.121

* Consolidated events to a single channel to prevent race conditions and optimize startup performance.
  * Ensured custom lifespans are invoked on queue workers for proper setup, and added tests.
</Update>

<Update label="2025-08-04" tags={["agent-server"]}>
  ## v0.2.120

* Restored the original streaming behavior of runs, ensuring consistent inclusion of interrupt events based on `stream_mode` settings.
  * Optimized `Runs.next` query to reduce average execution time from \~14.43ms to \~2.42ms, improving performance.
  * Added support for stream mode "tasks" and "checkpoints", normalized the UI namespace, and upgraded `@langchain/langgraph-api` for enhanced functionality.
</Update>

<Update label="2025-07-31" tags={["agent-server"]}>
  ## v0.2.117

Added a composite index on threads for faster searches with owner-based authentication and updated the default sort order to `updated_at` for improved query performance.
</Update>

<Update label="2025-07-31" tags={["agent-server"]}>
  ## v0.2.116

Reduced the default number of history checkpoints from 10 to 1 to optimize performance.
</Update>

<Update label="2025-07-31" tags={["agent-server"]}>
  ## v0.2.115

Optimized cache re-use to enhance application performance and efficiency.
</Update>

<Update label="2025-07-30" tags={["agent-server"]}>
  ## v0.2.113

Improved thread search pagination by updating response headers with `X-Pagination-Total` and `X-Pagination-Next` for better navigation.
</Update>

<Update label="2025-07-30" tags={["agent-server"]}>
  ## v0.2.112

* Ensured sync logging methods are awaited and added a linter to prevent future occurrences.
  * Fixed an issue where JavaScript tasks were not being populated correctly for JS graphs.
</Update>

<Update label="2025-07-29" tags={["agent-server"]}>
  ## v0.2.111

Fixed JS graph streaming failure by starting the heartbeat as soon as the connection opens.
</Update>

<Update label="2025-07-29" tags={["agent-server"]}>
  ## v0.2.110

Added interrupts as default values for join operations while preserving stream behavior.
</Update>

<Update label="2025-07-28" tags={["agent-server"]}>
  ## v0.2.109

Fixed an issue where config schema was missing when `config_type` was not set, ensuring more reliable configurations.
</Update>

<Update label="2025-07-28" tags={["agent-server"]}>
  ## v0.2.108

Prepared for LangGraph v0.6 compatibility with new context API support and bug fixes.
</Update>

<Update label="2025-07-27" tags={["agent-server"]}>
  ## v0.2.107

* Implemented caching for authentication processes to enhance performance and efficiency.
  * Optimized database performance by merging count and select queries.
</Update>

<Update label="2025-07-27" tags={["agent-server"]}>
  ## v0.2.106

Made log streams resumable, enhancing reliability and improving user experience when reconnecting.
</Update>

<Update label="2025-07-27" tags={["agent-server"]}>
  ## v0.2.105

Added a heapdump endpoint to save memory heap information to a file.
</Update>

<Update label="2025-07-25" tags={["agent-server"]}>
  ## v0.2.103

Used the correct metadata endpoint to resolve issues with data retrieval.
</Update>

<Update label="2025-07-24" tags={["agent-server"]}>
  ## v0.2.102

* Captured interrupt events in the wait method to preserve previous behavior from langgraph 0.5.0.
  * Added support for SDK structlog in the JavaScript environment for enhanced logging capabilities.
</Update>

<Update label="2025-07-24" tags={["agent-server"]}>
  ## v0.2.101

Corrected the metadata endpoint for self-hosted deployments.
</Update>

<Update label="2025-07-22" tags={["agent-server"]}>
  ## v0.2.99

* Improved license check by adding an in-memory cache and handling Redis connection errors more effectively.
  * Reloaded assistants to preserve manually created ones while discarding those removed from the configuration file.
  * Reverted changes to ensure the UI namespace for gen UI is a valid JavaScript property name.
  * Ensured that the UI namespace for generated UI is a valid JavaScript property name, improving API compliance.
  * Enhanced error handling to return a 422 status code for unprocessable entity requests.
</Update>

<Update label="2025-07-19" tags={["agent-server"]}>
  ## v0.2.98

Added context to langgraph nodes to improve log filtering and trace visibility.
</Update>

<Update label="2025-07-19" tags={["agent-server"]}>
  ## v0.2.97

* Improved interoperability with the ckpt ingestion worker on the main loop to prevent task scheduling issues.
  * Delayed queue worker startup until after migrations are completed to prevent premature execution.
  * Enhanced thread state error handling by adding specific metadata and improved response codes for better clarity when state updates fail during creation.
  * Exposed the interrupt ID when retrieving the thread state to improve API transparency.
</Update>

<Update label="2025-07-17" tags={["agent-server"]}>
  ## v0.2.96

Added a fallback mechanism for configurable header patterns to handle exclude/include settings more effectively.
</Update>

<Update label="2025-07-17" tags={["agent-server"]}>
  ## v0.2.95

* Avoided setting the future if it is already done to prevent redundant operations.
  * Resolved compatibility errors in CI by switching from `typing.TypedDict` to `typing_extensions.TypedDict` for Python versions below 3.12.
</Update>

<Update label="2025-07-16" tags={["agent-server"]}>
  ## v0.2.94

* Improved performance by omitting pending sends for langgraph versions 0.5 and above.
  * Improved server startup logs to provide clearer warnings when the DD\_API\_KEY environment variable is set.
</Update>

<Update label="2025-07-16" tags={["agent-server"]}>
  ## v0.2.93

Removed the GIN index for run metadata to improve performance.
</Update>

<Update label="2025-07-16" tags={["agent-server"]}>
  ## v0.2.92

Enabled copying functionality for blobs and checkpoints, improving data management flexibility.
</Update>

<Update label="2025-07-16" tags={["agent-server"]}>
  ## v0.2.91

Reduced writes to the `checkpoint_blobs` table by inlining small values (null, numeric, str, etc.). This means we don't need to store extra values for channels that haven't been updated.
</Update>

<Update label="2025-07-16" tags={["agent-server"]}>
  ## v0.2.90

Improve checkpoint writes via node-local background queueing.
</Update>

<Update label="2025-07-15" tags={["agent-server"]}>
  ## v0.2.89

Decoupled checkpoint writing from thread/run state by removing foreign keys and updated logger to prevent timeout-related failures.
</Update>

<Update label="2025-07-14" tags={["agent-server"]}>
  ## v0.2.88

Removed the foreign key constraint for `thread` in the `run` table to simplify database schema.
</Update>

<Update label="2025-07-14" tags={["agent-server"]}>
  ## v0.2.87

Added more detailed logs for Redis worker signaling to improve debugging.
</Update>

<Update label="2025-07-11" tags={["agent-server"]}>
  ## v0.2.86

Honored tool descriptions in the `/mcp` endpoint to align with expected functionality.
</Update>

<Update label="2025-07-10" tags={["agent-server"]}>
  ## v0.2.85

Added support for the `on_disconnect` field to `runs/wait` and included disconnect logs for better debugging.
</Update>

<Update label="2025-07-09" tags={["agent-server"]}>
  ## v0.2.84

Removed unnecessary status updates to streamline thread handling and updated version to 0.2.84.
</Update>

<Update label="2025-07-09" tags={["agent-server"]}>
  ## v0.2.83

* Reduced the default time-to-live for resumable streams to 2 minutes.
  * Enhanced data submission logic to send data to both Beacon and LangSmith instance based on license configuration.
  * Enabled submission of self-hosted data to a LangSmith instance when the endpoint is configured.
</Update>

<Update label="2025-07-03" tags={["agent-server"]}>
  ## v0.2.82

Addressed a race condition in background runs by implementing a lock using join, ensuring reliable execution across CTEs.
</Update>

<Update label="2025-07-03" tags={["agent-server"]}>
  ## v0.2.81

Optimized run streams by reducing initial wait time to improve responsiveness for older or non-existent runs.
</Update>

<Update label="2025-07-03" tags={["agent-server"]}>
  ## v0.2.80

Corrected parameter passing in the `logger.ainfo()` API call to resolve a TypeError.
</Update>

<Update label="2025-07-02" tags={["agent-server"]}>
  ## v0.2.79

* Fixed a JsonDecodeError in checkpointing with remote graph by correcting JSON serialization to handle trailing slashes properly.
  * Introduced a configuration flag to disable webhooks globally across all routes.
</Update>

<Update label="2025-07-02" tags={["agent-server"]}>
  ## v0.2.78

* Added timeout retries to webhook calls to improve reliability.
  * Added HTTP request metrics, including a request count and latency histogram, for enhanced monitoring capabilities.
</Update>

<Update label="2025-07-02" tags={["agent-server"]}>
  ## v0.2.77

* Added HTTP metrics to improve performance monitoring.
  * Changed the Redis cache delimiter to reduce conflicts with subgraph message names and updated caching behavior.
</Update>

<Update label="2025-07-01" tags={["agent-server"]}>
  ## v0.2.76

Updated Redis cache delimiter to prevent conflicts with subgraph messages.
</Update>

<Update label="2025-06-30" tags={["agent-server"]}>
  ## v0.2.74

Scheduled webhooks in an isolated loop to ensure thread-safe operations and prevent errors with PYTHONASYNCIODEBUG=1.
</Update>

<Update label="2025-06-27" tags={["agent-server"]}>
  ## v0.2.73

* Fixed an infinite frame loop issue and removed the dict\_parser due to structlog's unexpected behavior.
  * Throw a 409 error on deadlock occurrence during run cancellations to handle lock conflicts gracefully.
</Update>

<Update label="2025-06-27" tags={["agent-server"]}>
  ## v0.2.72

* Ensured compatibility with future langgraph versions.
  * Implemented a 409 response status to handle deadlock issues during cancellation.
</Update>

<Update label="2025-06-26" tags={["agent-server"]}>
  ## v0.2.71

Improved logging for better clarity and detail regarding log types.
</Update>

<Update label="2025-06-26" tags={["agent-server"]}>
  ## v0.2.70

Improved error handling to better distinguish and log TimeoutErrors caused by users from internal run timeouts.
</Update>

<Update label="2025-06-26" tags={["agent-server"]}>
  ## v0.2.69

Added sorting and pagination to the crons API and updated schema definitions for improved accuracy.
</Update>

<Update label="2025-06-26" tags={["agent-server"]}>
  ## v0.2.66

Fixed a 404 error when creating multiple runs with the same thread\_id using `on_not_exist="create"`.
</Update>

<Update label="2025-06-25" tags={["agent-server"]}>
  ## v0.2.65

* Ensured that only fields from `assistant_versions` are returned when necessary.
  * Ensured consistent data types for in-memory and PostgreSQL users, improving internal authentication handling.
</Update>

<Update label="2025-06-24" tags={["agent-server"]}>
  ## v0.2.64

Added descriptions to version entries for better clarity.
</Update>

<Update label="2025-06-23" tags={["agent-server"]}>
  ## v0.2.62

* Improved user handling for custom authentication in the JS Studio.
  * Added Prometheus-format run statistics to the metrics endpoint for better monitoring.
  * Added run statistics in Prometheus format to the metrics endpoint.
</Update>

<Update label="2025-06-20" tags={["agent-server"]}>
  ## v0.2.61

Set a maximum idle time for Redis connections to prevent unnecessary open connections.
</Update>

<Update label="2025-06-20" tags={["agent-server"]}>
  ## v0.2.60

* Enhanced error logging to include traceback details for dictionary operations.
  * Added a `/metrics` endpoint to expose queue worker metrics for monitoring.
</Update>

<Update label="2025-06-18" tags={["agent-server"]}>
  ## v0.2.57

* Removed CancelledError from retriable exceptions to allow local interrupts while maintaining retriability for workers.
  * Introduced middleware to gracefully shut down the server after completing in-flight requests upon receiving a SIGINT.
  * Reduced metadata stored in checkpoint to only include necessary information.
  * Improved error handling in join runs to return error details when present.
</Update>

<Update label="2025-06-17" tags={["agent-server"]}>
  ## v0.2.56

Improved application stability by adding a handler for SIGTERM signals.
</Update>

<Update label="2025-06-17" tags={["agent-server"]}>
  ## v0.2.55

* Improved the handling of cancellations in the queue entrypoint.
  * Improved cancellation handling in the queue entry point.
</Update>

<Update label="2025-06-16" tags={["agent-server"]}>
  ## v0.2.54

* Enhanced error message for LuaLock timeout during license validation.
  * Fixed the \$contains filter in custom auth by requiring an explicit ::text cast and updated tests accordingly.
  * Ensured project and tenant IDs are formatted as UUIDs for consistency.
</Update>

<Update label="2025-06-13" tags={["agent-server"]}>
  ## v0.2.53

* Resolved a timing issue to ensure the queue starts only after the graph is registered.
  * Improved performance by setting thread and run status in a single query and enhanced error handling during checkpoint writes.
  * Reduced the default background grace period to 3 minutes.
</Update>

<Update label="2025-06-12" tags={["agent-server"]}>
  ## v0.2.52

* Now logging expected graphs when one is omitted to improve traceability.
  * Implemented a time-to-live (TTL) feature for resumable streams.
  * Improved query efficiency and consistency by adding a unique index and optimizing row locking.
</Update>

<Update label="2025-06-12" tags={["agent-server"]}>
  ## v0.2.51

* Handled `CancelledError` by marking tasks as ready to retry, improving error management in worker processes.
  * Added LG API version and request ID to metadata and logs for better tracking.
  * Added LG API version and request ID to metadata and logs to improve traceability.
  * Improved database performance by creating indexes concurrently.
  * Ensured postgres write is committed only after the Redis running marker is set to prevent race conditions.
  * Enhanced query efficiency and reliability by adding a unique index on thread\_id/running, optimizing row locks, and ensuring deterministic run selection.
  * Resolved a race condition by ensuring Postgres updates only occur after the Redis running marker is set.
</Update>

<Update label="2025-06-07" tags={["agent-server"]}>
  ## v0.2.46

Introduced a new connection for each operation while preserving transaction characteristics in Threads state `update()` and `bulk()` commands.
</Update>

<Update label="2025-06-05" tags={["agent-server"]}>
  ## v0.2.45

* Enhanced streaming feature by incorporating tracing contexts.
  * Removed an unnecessary query from the Crons.search function.
  * Resolved connection reuse issue when scheduling next run for multiple cron jobs.
  * Removed an unnecessary query in the Crons.search function to improve efficiency.
  * Resolved an issue with scheduling the next cron run by improving connection reuse.
</Update>

<Update label="2025-06-04" tags={["agent-server"]}>
  ## v0.2.44

* Enhanced the worker logic to exit the pipeline before continuing when the Redis message limit is reached.
  * Introduced a ceiling for Redis message size with an option to skip messages larger than 128 MB for improved performance.
  * Ensured the pipeline always closes properly to prevent resource leaks.
</Update>

<Update label="2025-06-04" tags={["agent-server"]}>
  ## v0.2.43

* Improved performance by omitting logs in metadata calls and ensuring output schema compliance in value streaming.
  * Ensured the connection is properly closed after use.
  * Aligned output format to strictly adhere to the specified schema.
  * Stopped sending internal logs in metadata requests to improve privacy.
</Update>

<Update label="2025-06-04" tags={["agent-server"]}>
  ## v0.2.42

* Added timestamps to track the start and end of a request's run.
  * Added tracer information to the configuration settings.
  * Added support for streaming with tracing contexts.
</Update>

<Update label="2025-06-03" tags={["agent-server"]}>
  ## v0.2.41

Added locking mechanism to prevent errors in pipelined executions.
</Update>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-server-changelog.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
This bump also includes some fixes, including a bug exposing unintended internal events in run streams.
</Update>

<Update label="2025-12-12" tags={["agent-server"]}>
  ## v0.5.42

  * Modified the Go server to rely solely on the CLI `-service` flag for determining service mode, ignoring the globally set `FF_USE_CORE_API` for better deployment specificity.
</Update>

<Update label="2025-12-11" tags={["agent-server"]}>
  ## v0.5.41

  Fixed an issue with cron jobs in hybrid mode by ensuring proper initialization of the ENTERPRISE\_SAAS global flag.
</Update>

<Update label="2025-12-10" tags={["agent-server"]}>
  ## v0.5.39

  * Completed the implementation of custom encryptions for runs and crons, along with simplifying encryption processes.
  * Introduced support for streaming subgraph events in both `values` and `updates` stream modes.
</Update>

<Update label="2025-12-10" tags={["agent-server"]}>
  ## v0.5.38

  * Implemented complete custom encryption for threads, ensuring all thread data is properly secured and encrypted.
  * Ensured Redis attempt flags are consistently expired to prevent stale data.
  * Added core authentication and support for OR/AND filters, enhancing security and flexibility.
</Update>

<Update label="2025-12-09" tags={["agent-server"]}>
  ## v0.5.37

  Added a `name` parameter to the assistants count API for improved search flexibility.
</Update>

<Update label="2025-12-09" tags={["agent-server"]}>
  ## v0.5.36

  * Introduced configurable webhook support, allowing users to customize submitted webhooks and headers.
  * Added an `/ok` endpoint at the root for easier health checks and simplified configuration.
</Update>

<Update label="2025-12-08" tags={["agent-server"]}>
  ## v0.5.34

  Introduced custom encryption middleware, allowing users to define their own encryption methods for enhanced data protection.
</Update>

<Update label="2025-12-08" tags={["agent-server"]}>
  ## v0.5.33

  Set Uvicorn's keep-alive timeout to 75 seconds to prevent occasional 502 errors and improve connection handling.
</Update>

<Update label="2025-12-06" tags={["agent-server"]}>
  ## v0.5.32

  Introduced OpenTelemetry telemetry agent with support for New Relic integration.
</Update>

<Update label="2025-12-05" tags={["agent-server"]}>
  ## v0.5.31

  Added Py-Spy profiling for improved analysis of deployment performance, with some limitations on coverage.
</Update>

<Update label="2025-12-05" tags={["agent-server"]}>
  ## v0.5.30

  * Always configure loopback transport clients to enhance reliability.
  * Ensured authentication headers are passed for remote non-stream methods in JS.
</Update>

<Update label="2025-12-04" tags={["agent-server"]}>
  ## v0.5.28

  * Introduced a faster, Rust-based implementation of uuid7 to improve performance, now used in langsmith and langchain-core.
  * Added support for `$or` and `$and` in PostgreSQL auth filters to enable complex logic in authentication checks.
  * Capped psycopg and psycopg-pool versions to prevent infinite waiting on startup.
</Update>

<Update label="2025-11-26" tags={["agent-server"]}>
  ## v0.5.27

  * Ensured `runs.list` with filters returns only run fields, preventing incorrect status data from being included.
  * (JS) Updated `uuid` from version 10.0.0 to 13.0.0. and `exit-hook` from version 4.0.0 to 5.0.1.
</Update>

<Update label="2025-11-24" tags={["agent-server"]}>
  ## v0.5.26

  Resolved issues with `store.put` when used without AsyncBatchedStore in the JavaScript environment.
</Update>

<Update label="2025-11-22" tags={["agent-server"]}>
  ## v0.5.25

  * Introduced the ability to search assistants by their `name` using a new endpoint.
  * Casted store\_get return types to tuple in JavaScript to ensure type consistency.
</Update>

<Update label="2025-11-21" tags={["agent-server"]}>
  ## v0.5.24

  * Added executor metrics for Datadog and enhanced core stream API metrics for better performance tracking.
  * Disabled Redis Go maintenance notifications to prevent startup errors with unsupported commands in Redis versions below 8.
</Update>

<Update label="2025-11-20" tags={["agent-server"]}>
  ## v0.5.20

  Resolved an error in the executor service that occurred when handling large messages.
</Update>

<Update label="2025-11-19" tags={["agent-server"]}>
  ## v0.5.19

  Upgraded built-in langchain-core to version 1.0.7 to address a prompt formatting vulnerability.
</Update>

<Update label="2025-11-19" tags={["agent-server"]}>
  ## v0.5.18

  Introduced persistent cron threads with `on_run_completed: {keep,delete}` for enhanced cron management and retrieval options.
</Update>

<Update label="2025-11-19" tags={["agent-server"]}>
  ## v0.5.17

  Enhanced task handling to support multiple interrupts, aligning with open-source functionality.
</Update>

<Update label="2025-11-18" tags={["agent-server"]}>
  ## v0.5.15

  Added custom JSON unmarshalling for `Resume` and `Goto` commands to fix map-style null resume interpretation issues.
</Update>

<Update label="2025-11-14" tags={["agent-server"]}>
  ## v0.5.14

  Ensured `pg make start` command functions correctly with core-api enabled.
</Update>

<Update label="2025-11-13" tags={["agent-server"]}>
  ## v0.5.13

  Support `include` and `exclude` (plural form key for `includes` and `excludes`) since a doc incorrectly claimed support for that. Now the server accepts either.
</Update>

<Update label="2025-11-10" tags={["agent-server"]}>
  ## v0.5.11

  * Ensured auth handlers are applied consistently when streaming threads, aligning with recent security practices.
  * Bumped `undici` dependency from version 6.21.3 to 7.16.0, introducing various performance improvements and bug fixes.
  * Updated `p-queue` from version 8.0.1 to 9.0.0, introducing new features and breaking changes, including the removal of the `throwOnTimeout` option.
</Update>

<Update label="2025-11-10" tags={["agent-server"]}>
  ## v0.5.10

  Implemented healthcheck calls in the queue /ok handler to improve Kubernetes liveness and readiness probe compatibility.
</Update>

<Update label="2025-11-09" tags={["agent-server"]}>
  ## v0.5.9

  * Resolved an issue causing an "unbound local error" for the `elapsed` variable during a SIGINT interruption.
  * Mapped the "interrupted" status to A2A's "input-required" status for better task status alignment.
</Update>

<Update label="2025-11-07" tags={["agent-server"]}>
  ## v0.5.8

  * Ensured environment variables are passed as a dictionary when starting langgraph-ui for compatibility with `uvloop`.
  * Implemented CRUD operations for runs in Go, simplifying JSON merges and improving transaction readability, with PostgreSQL as a reference.
</Update>

<Update label="2025-11-07" tags={["agent-server"]}>
  ## v0.5.7

  Replaced no-retry Redis client with a retry client to handle connection errors more effectively and reduced corresponding logging severity.
</Update>

<Update label="2025-11-06" tags={["agent-server"]}>
  ## v0.5.6

  * Added pending time metrics to provide better insights into task waiting times.
  * Replaced `pb.Value` with `ChannelValue` to streamline code structure.
</Update>

<Update label="2025-11-05" tags={["agent-server"]}>
  ## v0.5.5

  Made the Redis `health_check_interval` more frequent and configurable for better handling of idle connections.
</Update>

<Update label="2025-11-05" tags={["agent-server"]}>
  ## v0.5.4

  Implemented `ormsgpack` with `OPT_REPLACE_SURROGATES` and updated for compatibility with the latest FastAPI release affecting custom authentication dependencies.
</Update>

<Update label="2025-11-03" tags={["agent-server"]}>
  ## v0.5.2

  Added retry logic for PostgreSQL connections during startup to enhance deployment reliability and improved error logging for easier debugging.
</Update>

<Update label="2025-11-03" tags={["agent-server"]}>
  ## v0.5.1

  * Resolved an issue where persistence was not functioning correctly with LangChain.js's createAgent feature.
  * Optimized assistants CRUD performance by improving database connection pooling and gRPC client reuse, reducing latency for large payloads.
</Update>

<Update label="2025-10-31" tags={["agent-server"]}>
  ## v0.5.0

  This minor version now requires langgraph-checkpoint versions later than 3.0 to prevent a deserialization vulnerability in earlier versions of the langgraph-checkpoint library.
  The `langgraph-checkpoint` library is compatible with `langgraph` minor versions 0.4, 0.5, 0.6, and 1.0.

  This version removes default support for deserialization of payloads saved using the "json" type, which has never been the default.
  By default, objects are serialized using msgpack. Under certain uncommon situations, payloads were serialized using an older "json" mode. If those payloads contained custom python objects, those will no longer be deserializable unless you provide a `serde` config:
```

---

## Agent tools

**URL:** llms-txt#agent-tools

@tool
def lookup_track( ...

@tool
def lookup_album( ...

@tool
def lookup_artist( ...

---

## Agent will call go_back_to_warranty and restart the warranty verification step

**URL:** llms-txt#agent-will-call-go_back_to_warranty-and-restart-the-warranty-verification-step

**Contents:**
- Complete example
- Next steps

python  theme={null}
  """
  Customer Support State Machine Example

This example demonstrates the state machine pattern.
  A single agent dynamically changes its behavior based on the current_step state,
  creating a state machine for sequential information collection.
  """

from langgraph.checkpoint.memory import InMemorySaver
  from langgraph.types import Command
  from typing import Callable, Literal
  from typing_extensions import NotRequired

from langchain.agents import AgentState, create_agent
  from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse, SummarizationMiddleware
  from langchain.chat_models import init_chat_model
  from langchain.messages import HumanMessage, ToolMessage
  from langchain.tools import tool, ToolRuntime

model = init_chat_model("anthropic:claude-3-5-sonnet-latest")

# Define the possible workflow steps
  SupportStep = Literal["warranty_collector", "issue_classifier", "resolution_specialist"]

class SupportState(AgentState):
      """State for customer support workflow."""

current_step: NotRequired[SupportStep]
      warranty_status: NotRequired[Literal["in_warranty", "out_of_warranty"]]
      issue_type: NotRequired[Literal["hardware", "software"]]

@tool
  def record_warranty_status(
      status: Literal["in_warranty", "out_of_warranty"],
      runtime: ToolRuntime[None, SupportState],
  ) -> Command:
      """Record the customer's warranty status and transition to issue classification."""
      return Command(
          update={
              "messages": [
                  ToolMessage(
                      content=f"Warranty status recorded as: {status}",
                      tool_call_id=runtime.tool_call_id,
                  )
              ],
              "warranty_status": status,
              "current_step": "issue_classifier",
          }
      )

@tool
  def record_issue_type(
      issue_type: Literal["hardware", "software"],
      runtime: ToolRuntime[None, SupportState],
  ) -> Command:
      """Record the type of issue and transition to resolution specialist."""
      return Command(
          update={
              "messages": [
                  ToolMessage(
                      content=f"Issue type recorded as: {issue_type}",
                      tool_call_id=runtime.tool_call_id,
                  )
              ],
              "issue_type": issue_type,
              "current_step": "resolution_specialist",
          }
      )

@tool
  def escalate_to_human(reason: str) -> str:
      """Escalate the case to a human support specialist."""
      # In a real system, this would create a ticket, notify staff, etc.
      return f"Escalating to human support. Reason: {reason}"

@tool
  def provide_solution(solution: str) -> str:
      """Provide a solution to the customer's issue."""
      return f"Solution provided: {solution}"

# Define prompts as constants
  WARRANTY_COLLECTOR_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STEP: Warranty verification

At this step, you need to:
  1. Greet the customer warmly
  2. Ask if their device is under warranty
  3. Use record_warranty_status to record their response and move to the next step

Be conversational and friendly. Don't ask multiple questions at once."""

ISSUE_CLASSIFIER_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STEP: Issue classification
  CUSTOMER INFO: Warranty status is {warranty_status}

At this step, you need to:
  1. Ask the customer to describe their issue
  2. Determine if it's a hardware issue (physical damage, broken parts) or software issue (app crashes, performance)
  3. Use record_issue_type to record the classification and move to the next step

If unclear, ask clarifying questions before classifying."""

RESOLUTION_SPECIALIST_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STEP: Resolution
  CUSTOMER INFO: Warranty status is {warranty_status}, issue type is {issue_type}

At this step, you need to:
  1. For SOFTWARE issues: provide troubleshooting steps using provide_solution
  2. For HARDWARE issues:
     - If IN WARRANTY: explain warranty repair process using provide_solution
     - If OUT OF WARRANTY: escalate_to_human for paid repair options

Be specific and helpful in your solutions."""

# Step configuration: maps step name to (prompt, tools, required_state)
  STEP_CONFIG = {
      "warranty_collector": {
          "prompt": WARRANTY_COLLECTOR_PROMPT,
          "tools": [record_warranty_status],
          "requires": [],
      },
      "issue_classifier": {
          "prompt": ISSUE_CLASSIFIER_PROMPT,
          "tools": [record_issue_type],
          "requires": ["warranty_status"],
      },
      "resolution_specialist": {
          "prompt": RESOLUTION_SPECIALIST_PROMPT,
          "tools": [provide_solution, escalate_to_human],
          "requires": ["warranty_status", "issue_type"],
      },
  }

@wrap_model_call
  def apply_step_config(
      request: ModelRequest,
      handler: Callable[[ModelRequest], ModelResponse],
  ) -> ModelResponse:
      """Configure agent behavior based on the current step."""
      # Get current step (defaults to warranty_collector for first interaction)
      current_step = request.state.get("current_step", "warranty_collector")

# Look up step configuration
      step_config = STEP_CONFIG[current_step]

# Validate required state exists
      for key in step_config["requires"]:
          if request.state.get(key) is None:
              raise ValueError(f"{key} must be set before reaching {current_step}")

# Format prompt with state values
      system_prompt = step_config["prompt"].format(**request.state)

# Inject system prompt and step-specific tools
      request = request.override(
          system_prompt=system_prompt,
          tools=step_config["tools"],
      )

return handler(request)

# Collect all tools from all step configurations
  all_tools = [
      record_warranty_status,
      record_issue_type,
      provide_solution,
      escalate_to_human,
  ]

# Create the agent with step-based configuration and summarization
  agent = create_agent(
      model,
      tools=all_tools,
      state_schema=SupportState,
      middleware=[
          apply_step_config,
          SummarizationMiddleware(
              model="gpt-4o-mini",
              trigger=("tokens", 4000),
              keep=("messages", 10)
          )
      ],
      checkpointer=InMemorySaver(),
  )

# ============================================================================
  # Test the workflow
  # ============================================================================

if __name__ == "__main__":
      thread_id = str(uuid.uuid4())
      config = {"configurable": {"thread_id": thread_id}}

result = agent.invoke(
          {"messages": [HumanMessage("Hi, my phone screen is cracked")]},
          config
      )

result = agent.invoke(
          {"messages": [HumanMessage("Yes, it's still under warranty")]},
          config
      )

result = agent.invoke(
          {"messages": [HumanMessage("The screen is physically cracked from dropping it")]},
          config
      )

result = agent.invoke(
          {"messages": [HumanMessage("What should I do?")]},
          config
      )
      for msg in result['messages']:
          msg.pretty_print()
  ```
</Expandable>

* Learn about the [subagents pattern](/oss/python/langchain/multi-agent/subagents-personal-assistant) for centralized orchestration
* Explore [middleware](/oss/python/langchain/middleware) for more dynamic behaviors
* Read the [multi-agent overview](/oss/python/langchain/multi-agent) to compare patterns
* Use [LangSmith](https://smith.langchain.com) to debug and monitor your multi-agent system

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/handoffs-customer-support.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Complete example

Here's everything together in a runnable script:

<Expandable title="Complete code" defaultOpen={false}>
```

---

## Agent will pause and wait for approval before executing sensitive tools

**URL:** llms-txt#agent-will-pause-and-wait-for-approval-before-executing-sensitive-tools

**Contents:**
- Custom guardrails
  - Before agent guardrails
  - After agent guardrails
  - Combine multiple guardrails
- Additional resources

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Send an email to the team"}]},
    config=config
)

result = agent.invoke(
    Command(resume={"decisions": [{"type": "approve"}]}),
    config=config  # Same thread ID to resume the paused conversation
)
python title="Class syntax" theme={null}
  from typing import Any

from langchain.agents.middleware import AgentMiddleware, AgentState, hook_config
  from langgraph.runtime import Runtime

class ContentFilterMiddleware(AgentMiddleware):
      """Deterministic guardrail: Block requests containing banned keywords."""

def __init__(self, banned_keywords: list[str]):
          super().__init__()
          self.banned_keywords = [kw.lower() for kw in banned_keywords]

@hook_config(can_jump_to=["end"])
      def before_agent(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
          # Get the first user message
          if not state["messages"]:
              return None

first_message = state["messages"][0]
          if first_message.type != "human":
              return None

content = first_message.content.lower()

# Check for banned keywords
          for keyword in self.banned_keywords:
              if keyword in content:
                  # Block execution before any processing
                  return {
                      "messages": [{
                          "role": "assistant",
                          "content": "I cannot process requests containing inappropriate content. Please rephrase your request."
                      }],
                      "jump_to": "end"
                  }

# Use the custom guardrail
  from langchain.agents import create_agent

agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[
          ContentFilterMiddleware(
              banned_keywords=["hack", "exploit", "malware"]
          ),
      ],
  )

# This request will be blocked before any processing
  result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I hack into a database?"}]
  })
  python title="Decorator syntax" theme={null}
  from typing import Any

from langchain.agents.middleware import before_agent, AgentState, hook_config
  from langgraph.runtime import Runtime

banned_keywords = ["hack", "exploit", "malware"]

@before_agent(can_jump_to=["end"])
  def content_filter(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
      """Deterministic guardrail: Block requests containing banned keywords."""
      # Get the first user message
      if not state["messages"]:
          return None

first_message = state["messages"][0]
      if first_message.type != "human":
          return None

content = first_message.content.lower()

# Check for banned keywords
      for keyword in banned_keywords:
          if keyword in content:
              # Block execution before any processing
              return {
                  "messages": [{
                      "role": "assistant",
                      "content": "I cannot process requests containing inappropriate content. Please rephrase your request."
                  }],
                  "jump_to": "end"
              }

# Use the custom guardrail
  from langchain.agents import create_agent

agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[content_filter],
  )

# This request will be blocked before any processing
  result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I hack into a database?"}]
  })
  python title="Class syntax" theme={null}
  from langchain.agents.middleware import AgentMiddleware, AgentState, hook_config
  from langgraph.runtime import Runtime
  from langchain.messages import AIMessage
  from langchain.chat_models import init_chat_model
  from typing import Any

class SafetyGuardrailMiddleware(AgentMiddleware):
      """Model-based guardrail: Use an LLM to evaluate response safety."""

def __init__(self):
          super().__init__()
          self.safety_model = init_chat_model("gpt-4o-mini")

@hook_config(can_jump_to=["end"])
      def after_agent(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
          # Get the final AI response
          if not state["messages"]:
              return None

last_message = state["messages"][-1]
          if not isinstance(last_message, AIMessage):
              return None

# Use a model to evaluate safety
          safety_prompt = f"""Evaluate if this response is safe and appropriate.
          Respond with only 'SAFE' or 'UNSAFE'.

Response: {last_message.content}"""

result = self.safety_model.invoke([{"role": "user", "content": safety_prompt}])

if "UNSAFE" in result.content:
              last_message.content = "I cannot provide that response. Please rephrase your request."

# Use the safety guardrail
  from langchain.agents import create_agent

agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[SafetyGuardrailMiddleware()],
  )

result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I make explosives?"}]
  })
  python title="Decorator syntax" theme={null}
  from langchain.agents.middleware import after_agent, AgentState, hook_config
  from langgraph.runtime import Runtime
  from langchain.messages import AIMessage
  from langchain.chat_models import init_chat_model
  from typing import Any

safety_model = init_chat_model("gpt-4o-mini")

@after_agent(can_jump_to=["end"])
  def safety_guardrail(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
      """Model-based guardrail: Use an LLM to evaluate response safety."""
      # Get the final AI response
      if not state["messages"]:
          return None

last_message = state["messages"][-1]
      if not isinstance(last_message, AIMessage):
          return None

# Use a model to evaluate safety
      safety_prompt = f"""Evaluate if this response is safe and appropriate.
      Respond with only 'SAFE' or 'UNSAFE'.

Response: {last_message.content}"""

result = safety_model.invoke([{"role": "user", "content": safety_prompt}])

if "UNSAFE" in result.content:
          last_message.content = "I cannot provide that response. Please rephrase your request."

# Use the safety guardrail
  from langchain.agents import create_agent

agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[safety_guardrail],
  )

result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I make explosives?"}]
  })
  python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware, HumanInTheLoopMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, send_email_tool],
    middleware=[
        # Layer 1: Deterministic input filter (before agent)
        ContentFilterMiddleware(banned_keywords=["hack", "exploit"]),

# Layer 2: PII protection (before and after model)
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware("email", strategy="redact", apply_to_output=True),

# Layer 3: Human approval for sensitive tools
        HumanInTheLoopMiddleware(interrupt_on={"send_email": True}),

# Layer 4: Model-based safety check (after agent)
        SafetyGuardrailMiddleware(),
    ],
)
```

## Additional resources

* [Middleware documentation](/oss/python/langchain/middleware) - Complete guide to custom middleware
* [Middleware API reference](https://reference.langchain.com/python/langchain/middleware/) - Complete guide to custom middleware
* [Human-in-the-loop](/oss/python/langchain/human-in-the-loop) - Add human review for sensitive operations
* [Testing agents](/oss/python/langchain/test) - Strategies for testing safety mechanisms

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/guardrails.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
<Tip>
  See the [human-in-the-loop documentation](/oss/python/langchain/human-in-the-loop) for complete details on implementing approval workflows.
</Tip>

## Custom guardrails

For more sophisticated guardrails, you can create custom middleware that runs before or after the agent executes. This gives you full control over validation logic, content filtering, and safety checks.

### Before agent guardrails

Use "before agent" hooks to validate requests once at the start of each invocation. This is useful for session-level checks like authentication, rate limiting, or blocking inappropriate requests before any processing begins.

<CodeGroup>
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
</CodeGroup>

### After agent guardrails

Use "after agent" hooks to validate final outputs once before returning to the user. This is useful for model-based safety checks, quality validation, or final compliance scans on the complete agent response.

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Application-specific evaluation approaches

**URL:** llms-txt#application-specific-evaluation-approaches

**Contents:**
- Agents
  - Evaluating an agent's final response
  - Evaluating a single step of an agent
  - Evaluating an agent's trajectory
- Retrieval augmented generation (RAG)
  - Dataset
  - Evaluator
  - Applying RAG Evaluation
  - RAG evaluation summary
- Summarization

Source: https://docs.langchain.com/langsmith/evaluation-approaches

Below, we will discuss evaluation of a few popular types of LLM applications.

[LLM-powered autonomous agents](https://lilianweng.github.io/posts/2023-06-23-agent/) combine three components (1) Tool calling, (2) Memory, and (3) Planning. Agents [use tool calling](https://python.langchain.com/v0.1/docs/modules/agents/agent_types/tool_calling/) with planning (e.g., often via prompting) and memory (e.g., often short-term message history) to generate responses. [Tool calling](https://python.langchain.com/v0.1/docs/modules/model_io/chat/function_calling/) allows a model to respond to a given prompt by generating two things: (1) a tool to invoke and (2) the input arguments required.

<img src="https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=a1c10f940f40ad89c90de8fae3607c1f" alt="Tool use" data-og-width="1021" width="1021" data-og-height="424" height="424" data-path="langsmith/images/tool-use.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?w=280&fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=e80012647614cd82cb468430e62fa9aa 280w, https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?w=560&fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=67a5febcec316bfe2935ba65506558a2 560w, https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?w=840&fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=e0b52fb90bdbc41332b09404823fbfca 840w, https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?w=1100&fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=8a4e6b4bda0f788f540ca240012c9e89 1100w, https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?w=1650&fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=d403f18524e0904c716d0cba9e928cac 1650w, https://mintcdn.com/langchain-5e9cc07a/ImHGLQW1HnQYwnJV/langsmith/images/tool-use.png?w=2500&fit=max&auto=format&n=ImHGLQW1HnQYwnJV&q=85&s=69133b8862e6738000f733ff7e34daae 2500w" />

Below is a tool-calling agent in [LangGraph](https://langchain-ai.github.io/langgraph/tutorials/introduction/). The `assistant node` is an LLM that determines whether to invoke a tool based upon the input. The `tool condition` sees if a tool was selected by the `assistant node` and, if so, routes to the `tool node`. The `tool node` executes the tool and returns the output as a tool message to the `assistant node`. This loop continues until as long as the `assistant node` selects a tool. If no tool is selected, then the agent directly returns the LLM response.

<img src="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=37f3c09958c1e2543f633c59cc89df36" alt="Agent" data-og-width="1259" width="1259" data-og-height="492" height="492" data-path="langsmith/images/langgraph-agent.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?w=280&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=59cecf5d27098da369bbf60d6a315437 280w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?w=560&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=81426ee5f37211859c572fe51d837c44 560w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?w=840&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=558ca3297a7697a12989f0bdcfd4a4d7 840w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?w=1100&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=39a3a80c152f99f133302fe79f4bf63d 1100w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?w=1650&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=46164054792e7f730cef4897fd9cbf57 1650w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langgraph-agent.png?w=2500&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=553d05e97a4d052882b6381e1e8b0362 2500w" />

This sets up three general types of agent evaluations that users are often interested in:

* `Final Response`: Evaluate the agent's final response.
* `Single step`: Evaluate any agent step in isolation (e.g., whether it selects the appropriate tool).
* `Trajectory`: Evaluate whether the agent took the expected path (e.g., of tool calls) to arrive at the final answer.

<img src="https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=5fe3c96402623ed8a61118f22a6426b6" alt="Agent-eval" data-og-width="1825" width="1825" data-og-height="915" height="915" data-path="langsmith/images/agent-eval.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?w=280&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=780c3ea6fecdbd41fa62017d3ac6042e 280w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?w=560&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=f43c0cd9d9b49ae1f2a7ead5f5e58bcd 560w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?w=840&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=360b12b491fb97fd46d444e440345737 840w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?w=1100&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=88fd055136cd48a538d908e3899daa6e 1100w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?w=1650&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=c3e40f0ba26f26f2688553596487ab57 1650w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-eval.png?w=2500&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=7b238d8ce02b6d1ab3d6ff3fb2c62d4e 2500w" />

Below we will cover what these are, the components (inputs, outputs, evaluators) needed for each one, and when you should consider this. Note that you likely will want to do multiple (if not all!) of these types of evaluations - they are not mutually exclusive!

### Evaluating an agent's final response

One way to evaluate an agent is to assess its overall performance on a task. This basically involves treating the agent as a black box and simply evaluating whether or not it gets the job done.

The inputs should be the user input and (optionally) a list of tools. In some cases, tool are hardcoded as part of the agent and they don't need to be passed in. In other cases, the agent is more generic, meaning it does not have a fixed set of tools and tools need to be passed in at run time.

The output should be the agent's final response.

The evaluator varies depending on the task you are asking the agent to do. Many agents perform a relatively complex set of steps and the output a final text response. Similar to RAG, LLM-as-judge evaluators are often effective for evaluation in these cases because they can assess whether the agent got a job done directly from the text response.

However, there are several downsides to this type of evaluation. First, it usually takes a while to run. Second, you are not evaluating anything that happens inside the agent, so it can be hard to debug when failures occur. Third, it can sometimes be hard to define appropriate evaluation metrics.

### Evaluating a single step of an agent

Agents generally perform multiple actions. While it is useful to evaluate them end-to-end, it can also be useful to evaluate these individual actions. This generally involves evaluating a single step of the agent - the LLM call where it decides what to do.

The inputs should be the input to a single step. Depending on what you are testing, this could just be the raw user input (e.g., a prompt and / or a set of tools) or it can also include previously completed steps.

The outputs are just the output of that step, which is usually the LLM response. The LLM response often contains tool calls, indicating what action the agent should take next.

The evaluator for this is usually some binary score for whether the correct tool call was selected, as well as some heuristic for whether the input to the tool was correct. The reference tool can be simply specified as a string.

There are several benefits to this type of evaluation. It allows you to evaluate individual actions, which lets you hone in where your application may be failing. They are also relatively fast to run (because they only involve a single LLM call) and evaluation often uses simple heuristic evaluation of the selected tool relative to the reference tool. One downside is that they don't capture the full agent - only one particular step. Another downside is that dataset creation can be challenging, particular if you want to include past history in the agent input. It is pretty easy to generate a dataset for steps early on in an agent's trajectory (e.g., this may only include the input prompt), but it can be difficult to generate a dataset for steps later on in the trajectory (e.g., including numerous prior agent actions and responses).

### Evaluating an agent's trajectory

Evaluating an agent's trajectory involves evaluating all the steps an agent took.

The inputs are again the inputs to the overall agent (the user input, and optionally a list of tools).

The outputs are a list of tool calls, which can be formulated as an "exact" trajectory (e.g., an expected sequence of tool calls) or simply a set of tool calls that are expected (in any order).

The evaluator here is some function over the steps taken. Assessing the "exact" trajectory can use a single binary score that confirms an exact match for each tool name in the sequence. This is simple, but has some flaws. Sometimes there can be multiple correct paths. This evaluation also does not capture the difference between a trajectory being off by a single step versus being completely wrong.

To address these flaws, evaluation metrics can focused on the number of "incorrect" steps taken, which better accounts for trajectories that are close versus ones that deviate significantly. Evaluation metrics can also focus on whether all of the expected tools are called in any order.

However, none of these approaches evaluate the input to the tools; they only focus on the tools selected. In order to account for this, another evaluation technique is to pass the full agent's trajectory (along with a reference trajectory) as a set of messages (e.g., all LLM responses and tool calls) an LLM-as-judge. This can evaluate the complete behavior of the agent, but it is the most challenging reference to compile (luckily, using a framework like LangGraph can help with this!). Another downside is that evaluation metrics can be somewhat tricky to come up with.

## Retrieval augmented generation (RAG)

Retrieval Augmented Generation (RAG) is a powerful technique that involves retrieving relevant documents based on a user's input and passing them to a language model for processing. RAG enables AI applications to generate more informed and context-aware responses by leveraging external knowledge.

<Info>
  For a comprehensive review of RAG concepts, see our [`RAG From Scratch` series](https://github.com/langchain-ai/rag-from-scratch).
</Info>

When evaluating RAG applications, a key consideration is whether you have (or can easily obtain) reference answers for each input question. Reference answers serve as ground truth for assessing the correctness of the generated responses. However, even in the absence of reference answers, various evaluations can still be performed using reference-free RAG evaluation prompts (examples provided below).

`LLM-as-judge` is a commonly used evaluator for RAG because it's an effective way to evaluate factual accuracy or consistency between texts.

<img src="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=1252b1369be04ddb4c480af277443ac2" alt="rag-types.png" data-og-width="1696" width="1696" data-og-height="731" height="731" data-path="langsmith/images/rag-types.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?w=280&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=dda9fa7e589b9d37bd31a5ba63d1f0fb 280w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?w=560&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=e16fca6e49aeb889cc9d6e04baca684a 560w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?w=840&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=de442b611295218493a5783820794727 840w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?w=1100&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=ad286f13e4a15ec892f5995a539daf5d 1100w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?w=1650&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=64c7b545e34ac5d4bf975ee2f44af8df 1650w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/rag-types.png?w=2500&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=447cb995acde1f42ffeee2883c61a033 2500w" />

When evaluating RAG applications, you can have evaluators that require reference outputs and those that don't:

1. **Require reference output**: Compare the RAG chain's generated answer or retrievals against a reference answer (or retrievals) to assess its correctness.
2. **Don't require reference output**: Perform self-consistency checks using prompts that don't require a reference answer (represented by orange, green, and red in the above figure).

### Applying RAG Evaluation

When applying RAG evaluation, consider the following approaches:

1. `Offline evaluation`: Use offline evaluation for any prompts that rely on a reference answer. This is most commonly used for RAG answer correctness evaluation, where the reference is a ground truth (correct) answer.

2. `Online evaluation`: Employ online evaluation for any reference-free prompts. This allows you to assess the RAG application's performance in real-time scenarios.

3. `Pairwise evaluation`: Utilize pairwise evaluation to compare answers produced by different RAG chains. This evaluation focuses on user-specified criteria (e.g., answer format or style) rather than correctness, which can be evaluated using self-consistency or a ground truth reference.

### RAG evaluation summary

| Evaluator           | Detail                                            | Needs reference output | LLM-as-judge?                                                                         | Pairwise relevant |
| ------------------- | ------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------- | ----------------- |
| Document relevance  | Are documents relevant to the question?           | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/rag-document-relevance)   | No                |
| Answer faithfulness | Is the answer grounded in the documents?          | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/rag-answer-hallucination) | No                |
| Answer helpfulness  | Does the answer help address the question?        | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/rag-answer-helpfulness)   | No                |
| Answer correctness  | Is the answer consistent with a reference answer? | Yes                    | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/rag-answer-vs-reference)  | No                |
| Pairwise comparison | How do multiple answer versions compare?          | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-rag)  | Yes               |

Summarization is one specific type of free-form writing. The evaluation aim is typically to examine the writing (summary) relative to a set of criteria.

`Developer curated examples` of texts to summarize are commonly used for evaluation (see a dataset example [here](https://smith.langchain.com/public/659b07af-1cab-4e18-b21a-91a69a4c3990/d)). However, `user logs` from a production (summarization) app can be used for online evaluation with any of the `Reference-free` evaluation prompts below.

`LLM-as-judge` is typically used for evaluation of summarization (as well as other types of writing) using `Reference-free` prompts that follow provided criteria to grade a summary. It is less common to provide a particular `Reference` summary, because summarization is a creative task and there are many possible correct answers.

`Online` or `Offline` evaluation are feasible because of the `Reference-free` prompt used. `Pairwise` evaluation is also a powerful way to perform comparisons between different summarization chains (e.g., different summarization prompts or LLMs):

| Use Case         | Detail                                                                     | Needs reference output | LLM-as-judge?                                                                                | Pairwise relevant |
| ---------------- | -------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------- | ----------------- |
| Factual accuracy | Is the summary accurate relative to the source documents?                  | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/summary-accurancy-evaluator)     | Yes               |
| Faithfulness     | Is the summary grounded in the source documents (e.g., no hallucinations)? | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/summary-hallucination-evaluator) | Yes               |
| Helpfulness      | Is summary helpful relative to user need?                                  | No                     | Yes - [prompt](https://smith.langchain.com/hub/langchain-ai/summary-helpfulness-evaluator)   | Yes               |

## Classification and tagging

Classification and tagging apply a label to a given input (e.g., for toxicity detection, sentiment analysis, etc). Classification/tagging evaluation typically employs the following components, which we will review in detail below:

A central consideration for classification/tagging evaluation is whether you have a dataset with `reference` labels or not. If not, users frequently want to define an evaluator that uses criteria to apply label (e.g., toxicity, etc) to an input (e.g., text, user-question, etc). However, if ground truth class labels are provided, then the evaluation objective is focused on scoring a classification/tagging chain relative to the ground truth class label (e.g., using metrics such as precision, recall, etc).

If ground truth reference labels are provided, then it's common to simply define a [custom heuristic evaluator](/langsmith/code-evaluator) to compare ground truth labels to the chain output. However, it is increasingly common given the emergence of LLMs simply use `LLM-as-judge` to perform the classification/tagging of an input based upon specified criteria (without a ground truth reference).

`Online` or `Offline` evaluation is feasible when using `LLM-as-judge` with the `Reference-free` prompt used. In particular, this is well suited to `Online` evaluation when a user wants to tag / classify application input (e.g., for toxicity, etc).

| Use Case  | Detail              | Needs reference output | LLM-as-judge? | Pairwise relevant |
| --------- | ------------------- | ---------------------- | ------------- | ----------------- |
| Accuracy  | Standard definition | Yes                    | No            | No                |
| Precision | Standard definition | Yes                    | No            | No                |
| Recall    | Standard definition | Yes                    | No            | No                |

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/evaluation-approaches.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Applies conventions without prompting

**URL:** llms-txt#applies-conventions-without-prompting

**Contents:**
- Use remote sandboxes

bash  theme={null}
   # Runloop
   export RUNLOOP_API_KEY="your-key"

# Daytona
   export DAYTONA_API_KEY="your-key"

# Modal
   modal setup
   bash  theme={null}
   uvx deepagents-cli --sandbox runloop --sandbox-setup ./setup.sh
   bash  theme={null}
   #!/bin/bash
   set -e

# Clone repository using GitHub token
   git clone https://x-access-token:${GITHUB_TOKEN}@github.com/username/repo.git $HOME/workspace
   cd $HOME/workspace

# Make environment variables persistent
   cat >> ~/.bashrc <<'EOF'
   export GITHUB_TOKEN="${GITHUB_TOKEN}"
   export OPENAI_API_KEY="${OPENAI_API_KEY}"
   cd $HOME/workspace
   EOF

source ~/.bashrc
   ```

Store secrets in a local `.env` file for the setup script to access.

<Warning>
  Sandboxes isolate code execution, but agents remain vulnerable to prompt injection with untrusted inputs. Use human-in-the-loop approval, short-lived secrets, and trusted setup scripts only. Note that sandbox APIs are evolving rapidly, and we expect more providers to support proxies that help mitigate prompt injection and secrets management concerns.
</Warning>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/cli.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Use remote sandboxes

Execute code in isolated remote environments for safety and flexibility. Remote sandboxes provide the following benefits:

* **Safety**: Protect your local machine from potentially harmful code execution
* **Clean environments**: Use specific dependencies or OS configurations without local setup
* **Parallel execution**: Run multiple agents simultaneously in isolated environments
* **Long-running tasks**: Execute time-intensive operations without blocking your machine
* **Reproducibility**: Ensure consistent execution environments across teams

To use a remote sandbox, follow these steps:

1. Configure your sandbox provider ([Runloop](https://www.runloop.ai/), [Daytona](https://www.daytona.io/), or [Modal](https://modal.com/)):
```

Example 2 (unknown):
```unknown
2. Run the CLI with a sandbox:
```

Example 3 (unknown):
```unknown
The agent runs locally but executes all code operations in the remote sandbox. Optional setup scripts can configure environment variables, clone repositories, and prepare dependencies.

3. (Optional) Create a `setup.sh` file to configure your sandbox environment:
```

---

## Assumes you're in an interactive Python environmentfrom IPython.display import Image, display ...

**URL:** llms-txt#assumes-you're-in-an-interactive-python-environmentfrom-ipython.display-import-image,-display-...

python  theme={null}
from langchain.embeddings import init_embeddings
from langchain.tools import tool
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.agents import create_agent

**Examples:**

Example 1 (unknown):
```unknown
<img src="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=a65951850208fd3b03848629bdda8ae0" alt="Refund graph" data-og-width="256" width="256" data-og-height="333" height="333" data-path="langsmith/images/refund-graph.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?w=280&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=8817f44b37322ab9a51fd01ee7902181 280w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?w=560&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=753a20158640cbeeeb81498d5c5ae95d 560w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?w=840&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=8d38bcff07b53e1f5648b3dd45cffa66 840w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?w=1100&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=50a7f863cf45d9df7b59cc3614fdb4e9 1100w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?w=1650&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=cfbda86ec83a651bfe8e38235579302d 1650w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/refund-graph.png?w=2500&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=56745d2e7603dca7fa233e1fd5818008 2500w" />

#### Lookup agent

For the lookup (i.e. question-answering) agent, we'll use a simple ReACT architecture and give the agent tools for looking up track names, artist names, and album names based on various filters. For example, you can look up albums by a particular artist, artists who released songs with a specific name, etc.
```

---

## Backends

**URL:** llms-txt#backends

**Contents:**
- Quickstart
- Built-in backends
  - StateBackend (ephemeral)

Source: https://docs.langchain.com/oss/python/deepagents/backends

Choose and configure filesystem backends for deep agents. You can specify routes to different backends, implement virtual filesystems, and enforce policies.

Deep agents expose a filesystem surface to the agent via tools like `ls`, `read_file`, `write_file`, `edit_file`, `glob`, and `grep`. These tools operate through a pluggable backend.

This page explains how to [choose a backend](#specify-a-backend), [route different paths to different backends](#route-to-different-backends), [implement your own virtual filesystem](#use-a-virtual-filesystem) (e.g., S3 or Postgres), [add policy hooks](#add-policy-hooks), and [comply with the backend protocol](#protocol-reference).

Here are a few pre-built filesystem backends that you can quickly use with your deep agent:

| Built-in backend                                                 | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Default](#statebackend-ephemeral)                               | `agent = create_deep_agent()` <br /> Ephemeral in state. The default filesystem backend for an agent is stored in `langgraph` state. Note that this filesystem only persists *for a single thread*.                                                                                           |
| [Local filesystem persistence](#filesystembackend-local-disk)    | `agent = create_deep_agent(backend=FilesystemBackend(root_dir="/Users/nh/Desktop/"))` <br />This gives the deep agent access to your local machine's filesystem. You can specify the root directory that the agent has access to. Note that any provided `root_dir` must be an absolute path. |
| [Durable store (LangGraph store)](#storebackend-langgraph-store) | `agent = create_deep_agent(backend=lambda rt: StoreBackend(rt))` <br />This gives the agent access to long-term storage that is *persisted across threads*. This is great for storing longer term memories or instructions that are applicable to the agent over multiple executions.         |
| [Composite](#compositebackend-router)                            | Ephemeral by default, `/memories/` persisted. The Composite backend is maximally flexible. You can specify different routes in the filesystem to point towards different backends. See Composite routing below for a ready-to-paste example.                                                  |

### StateBackend (ephemeral)

```python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
This page explains how to [choose a backend](#specify-a-backend), [route different paths to different backends](#route-to-different-backends), [implement your own virtual filesystem](#use-a-virtual-filesystem) (e.g., S3 or Postgres), [add policy hooks](#add-policy-hooks), and [comply with the backend protocol](#protocol-reference).

## Quickstart

Here are a few pre-built filesystem backends that you can quickly use with your deep agent:

| Built-in backend                                                 | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Default](#statebackend-ephemeral)                               | `agent = create_deep_agent()` <br /> Ephemeral in state. The default filesystem backend for an agent is stored in `langgraph` state. Note that this filesystem only persists *for a single thread*.                                                                                           |
| [Local filesystem persistence](#filesystembackend-local-disk)    | `agent = create_deep_agent(backend=FilesystemBackend(root_dir="/Users/nh/Desktop/"))` <br />This gives the deep agent access to your local machine's filesystem. You can specify the root directory that the agent has access to. Note that any provided `root_dir` must be an absolute path. |
| [Durable store (LangGraph store)](#storebackend-langgraph-store) | `agent = create_deep_agent(backend=lambda rt: StoreBackend(rt))` <br />This gives the agent access to long-term storage that is *persisted across threads*. This is great for storing longer term memories or instructions that are applicable to the agent over multiple executions.         |
| [Composite](#compositebackend-router)                            | Ephemeral by default, `/memories/` persisted. The Composite backend is maximally flexible. You can specify different routes in the filesystem to point towards different backends. See Composite routing below for a ready-to-paste example.                                                  |

## Built-in backends

### StateBackend (ephemeral)
```

---

## Before model hook

**URL:** llms-txt#before-model-hook

@before_model
def log_before_model(state: AgentState, runtime: Runtime[Context]) -> dict | None:  # [!code highlight]
    print(f"Processing request for user: {runtime.context.user_name}")  # [!code highlight]
    return None

---

## Both agents execute simultaneously, each receiving only the query it needs

**URL:** llms-txt#both-agents-execute-simultaneously,-each-receiving-only-the-query-it-needs

**Contents:**
  - Result collection with reducers
  - Synthesis phase
- 8. Complete working example
- 9. Advanced: Stateful routers
  - Tool wrapper approach
  - Full persistence approach
- 10. Key takeaways
- Next steps

python  theme={null}
{"results": [{"source": "github", "result": "..."}]}
python  theme={null}
  """
  Multi-Source Knowledge Router Example

This example demonstrates the router pattern for multi-agent systems.
  A router classifies queries, routes them to specialized agents in parallel,
  and synthesizes results into a combined response.
  """

import operator
  from typing import Annotated, Literal, TypedDict

from langchain.agents import create_agent
  from langchain.chat_models import init_chat_model
  from langchain.tools import tool
  from langgraph.graph import StateGraph, START, END
  from langgraph.types import Send
  from pydantic import BaseModel, Field

# State definitions
  class AgentInput(TypedDict):
      """Simple input state for each subagent."""
      query: str

class AgentOutput(TypedDict):
      """Output from each subagent."""
      source: str
      result: str

class Classification(TypedDict):
      """A single routing decision: which agent to call with what query."""
      source: Literal["github", "notion", "slack"]
      query: str

class RouterState(TypedDict):
      query: str
      classifications: list[Classification]
      results: Annotated[list[AgentOutput], operator.add]
      final_answer: str

# Structured output schema for classifier
  class ClassificationResult(BaseModel):
      """Result of classifying a user query into agent-specific sub-questions."""
      classifications: list[Classification] = Field(
          description="List of agents to invoke with their targeted sub-questions"
      )

# Tools
  @tool
  def search_code(query: str, repo: str = "main") -> str:
      """Search code in GitHub repositories."""
      return f"Found code matching '{query}' in {repo}: authentication middleware in src/auth.py"

@tool
  def search_issues(query: str) -> str:
      """Search GitHub issues and pull requests."""
      return f"Found 3 issues matching '{query}': #142 (API auth docs), #89 (OAuth flow), #203 (token refresh)"

@tool
  def search_prs(query: str) -> str:
      """Search pull requests for implementation details."""
      return f"PR #156 added JWT authentication, PR #178 updated OAuth scopes"

@tool
  def search_notion(query: str) -> str:
      """Search Notion workspace for documentation."""
      return f"Found documentation: 'API Authentication Guide' - covers OAuth2 flow, API keys, and JWT tokens"

@tool
  def get_page(page_id: str) -> str:
      """Get a specific Notion page by ID."""
      return f"Page content: Step-by-step authentication setup instructions"

@tool
  def search_slack(query: str) -> str:
      """Search Slack messages and threads."""
      return f"Found discussion in #engineering: 'Use Bearer tokens for API auth, see docs for refresh flow'"

@tool
  def get_thread(thread_id: str) -> str:
      """Get a specific Slack thread."""
      return f"Thread discusses best practices for API key rotation"

# Models and agents
  model = init_chat_model("openai:gpt-4o")
  router_llm = init_chat_model("openai:gpt-4o-mini")

github_agent = create_agent(
      model,
      tools=[search_code, search_issues, search_prs],
      system_prompt=(
          "You are a GitHub expert. Answer questions about code, "
          "API references, and implementation details by searching "
          "repositories, issues, and pull requests."
      ),
  )

notion_agent = create_agent(
      model,
      tools=[search_notion, get_page],
      system_prompt=(
          "You are a Notion expert. Answer questions about internal "
          "processes, policies, and team documentation by searching "
          "the organization's Notion workspace."
      ),
  )

slack_agent = create_agent(
      model,
      tools=[search_slack, get_thread],
      system_prompt=(
          "You are a Slack expert. Answer questions by searching "
          "relevant threads and discussions where team members have "
          "shared knowledge and solutions."
      ),
  )

# Workflow nodes
  def classify_query(state: RouterState) -> dict:
      """Classify query and determine which agents to invoke."""
      structured_llm = router_llm.with_structured_output(ClassificationResult)

result = structured_llm.invoke([
          {
              "role": "system",
              "content": """Analyze this query and determine which knowledge bases to consult.
  For each relevant source, generate a targeted sub-question optimized for that source.

Available sources:
  - github: Code, API references, implementation details, issues, pull requests
  - notion: Internal documentation, processes, policies, team wikis
  - slack: Team discussions, informal knowledge sharing, recent conversations

Return ONLY the sources that are relevant to the query."""
          },
          {"role": "user", "content": state["query"]}
      ])

return {"classifications": result.classifications}

def route_to_agents(state: RouterState) -> list[Send]:
      """Fan out to agents based on classifications."""
      return [
          Send(c["source"], {"query": c["query"]})
          for c in state["classifications"]
      ]

def query_github(state: AgentInput) -> dict:
      """Query the GitHub agent."""
      result = github_agent.invoke({
          "messages": [{"role": "user", "content": state["query"]}]
      })
      return {"results": [{"source": "github", "result": result["messages"][-1].content}]}

def query_notion(state: AgentInput) -> dict:
      """Query the Notion agent."""
      result = notion_agent.invoke({
          "messages": [{"role": "user", "content": state["query"]}]
      })
      return {"results": [{"source": "notion", "result": result["messages"][-1].content}]}

def query_slack(state: AgentInput) -> dict:
      """Query the Slack agent."""
      result = slack_agent.invoke({
          "messages": [{"role": "user", "content": state["query"]}]
      })
      return {"results": [{"source": "slack", "result": result["messages"][-1].content}]}

def synthesize_results(state: RouterState) -> dict:
      """Combine results from all agents into a coherent answer."""
      if not state["results"]:
          return {"final_answer": "No results found from any knowledge source."}

formatted = [
          f"**From {r['source'].title()}:**\n{r['result']}"
          for r in state["results"]
      ]

synthesis_response = router_llm.invoke([
          {
              "role": "system",
              "content": f"""Synthesize these search results to answer the original question: "{state['query']}"

- Combine information from multiple sources without redundancy
  - Highlight the most relevant and actionable information
  - Note any discrepancies between sources
  - Keep the response concise and well-organized"""
          },
          {"role": "user", "content": "\n\n".join(formatted)}
      ])

return {"final_answer": synthesis_response.content}

# Build workflow
  workflow = (
      StateGraph(RouterState)
      .add_node("classify", classify_query)
      .add_node("github", query_github)
      .add_node("notion", query_notion)
      .add_node("slack", query_slack)
      .add_node("synthesize", synthesize_results)
      .add_edge(START, "classify")
      .add_conditional_edges("classify", route_to_agents, ["github", "notion", "slack"])
      .add_edge("github", "synthesize")
      .add_edge("notion", "synthesize")
      .add_edge("slack", "synthesize")
      .add_edge("synthesize", END)
      .compile()
  )

if __name__ == "__main__":
      result = workflow.invoke({
          "query": "How do I authenticate API requests?"
      })

print("Original query:", result["query"])
      print("\nClassifications:")
      for c in result["classifications"]:
          print(f"  {c['source']}: {c['query']}")
      print("\n" + "=" * 60 + "\n")
      print("Final Answer:")
      print(result["final_answer"])
  python  theme={null}
from langgraph.checkpoint.memory import InMemorySaver

@tool
def search_knowledge_base(query: str) -> str:
    """Search across multiple knowledge sources (GitHub, Notion, Slack).

Use this to find information about code, documentation, or team discussions.
    """
    result = workflow.invoke({"query": query})
    return result["final_answer"]

conversational_agent = create_agent(
    model,
    tools=[search_knowledge_base],
    system_prompt=(
        "You are a helpful assistant that answers questions about our organization. "
        "Use the search_knowledge_base tool to find information across our code, "
        "documentation, and team discussions."
    ),
    checkpointer=InMemorySaver(),
)
python  theme={null}
config = {"configurable": {"thread_id": "user-123"}}

result = conversational_agent.invoke(
    {"messages": [{"role": "user", "content": "How do I authenticate API requests?"}]},
    config
)
print(result["messages"][-1].content)

result = conversational_agent.invoke(
    {"messages": [{"role": "user", "content": "What about rate limiting for those endpoints?"}]},
    config
)
print(result["messages"][-1].content)
```

<Tip>
  The tool wrapper approach is recommended for most use cases. It provides clean separation: the router handles multi-source querying, while the conversational agent handles context and memory.
</Tip>

### Full persistence approach

If you need the router itself to maintain state—for example, to use previous search results in routing decisions—use [persistence](/oss/python/langchain/short-term-memory) to store message history at the router level.

<Warning>
  **Stateful routers add complexity.** When routing to different agents across turns, conversations may feel inconsistent if agents have different tones or prompts. Consider the [handoffs pattern](/oss/python/langchain/multi-agent/handoffs) or [subagents pattern](/oss/python/langchain/multi-agent/subagents) instead—both provide clearer semantics for multi-turn conversations with different agents.
</Warning>

The router pattern excels when you have:

* **Distinct verticals**: Separate knowledge domains that each require specialized tools and prompts
* **Parallel query needs**: Questions that benefit from querying multiple sources simultaneously
* **Synthesis requirements**: Results from multiple sources need to be combined into a coherent response

The pattern has three phases: **decompose** (analyze the query and generate targeted sub-questions), **route** (execute queries in parallel), and **synthesize** (combine results).

<Tip>
  **When to use the router pattern**

Use the router pattern when you have multiple independent knowledge sources, need low-latency parallel queries, and want explicit control over routing logic.

For simpler cases with dynamic tool selection, consider the [subagents pattern](/oss/python/langchain/multi-agent/subagents). For workflows where agents need to converse with users sequentially, consider [handoffs](/oss/python/langchain/multi-agent/handoffs).
</Tip>

* Learn about [handoffs](/oss/python/langchain/multi-agent/handoffs) for agent-to-agent conversations
* Explore the [subagents pattern](/oss/python/langchain/multi-agent/subagents-personal-assistant) for centralized orchestration
* Read the [multi-agent overview](/oss/python/langchain/multi-agent) to compare different patterns
* Use [LangSmith](https://smith.langchain.com) to debug and monitor your router

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/router-knowledge-base.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Each agent node receives a simple `AgentInput` with just a `query` field—not the full router state. This keeps the interface clean and explicit.

### Result collection with reducers

Agent results flow back to the main state via a **reducer**. Each agent returns:
```

Example 2 (unknown):
```unknown
The reducer (`operator.add` in Python) concatenates these lists, collecting all parallel results into `state["results"]`.

### Synthesis phase

After all agents complete, the `synthesize_results` function iterates over the collected results:

* Waits for all parallel branches to complete (LangGraph handles this automatically)
* References the original query to ensure the answer addresses what the user asked
* Combines information from all sources without redundancy

<Note>
  **Partial results**: In this tutorial, all selected agents must complete before synthesis. For more advanced patterns where you want to handle partial results or timeouts, see the [map-reduce guide](/oss/python/langchain/map-reduce).
</Note>

## 8. Complete working example

Here's everything together in a runnable script:

<Expandable title="View complete code" defaultOpen={false}>
```

Example 3 (unknown):
```unknown
</Expandable>

## 9. Advanced: Stateful routers

The router we've built so far is **stateless**—each request is handled independently with no memory between calls. For multi-turn conversations, you need a **stateful** approach.

### Tool wrapper approach

The simplest way to add conversation memory is to wrap the stateless router as a tool that a conversational agent can call:
```

Example 4 (unknown):
```unknown
This approach keeps the router stateless while the conversational agent handles memory and context. The user can have a multi-turn conversation, and the agent will call the router tool as needed.
```

---

## Build a custom RAG agent with LangGraph

**URL:** llms-txt#build-a-custom-rag-agent-with-langgraph

**Contents:**
- Overview
  - Concepts
- Setup
- 1. Preprocess documents
- 2. Create a retriever tool
- 3. Generate query
- 4. Grade documents
- 5. Rewrite question
- 6. Generate an answer
- 7. Assemble the graph

Source: https://docs.langchain.com/oss/python/langgraph/agentic-rag

In this tutorial we will build a [retrieval](/oss/python/langchain/retrieval) agent using LangGraph.

LangChain offers built-in [agent](/oss/python/langchain/agents) implementations, implemented using [LangGraph](/oss/python/langgraph/overview) primitives. If deeper customization is required, agents can be implemented directly in LangGraph. This guide demonstrates an example implementation of a retrieval agent. [Retrieval](/oss/python/langchain/retrieval) agents are useful when you want an LLM to make a decision about whether to retrieve context from a vectorstore or respond to the user directly.

By the end of the tutorial we will have done the following:

1. Fetch and preprocess documents that will be used for retrieval.
2. Index those documents for semantic search and create a retriever tool for the agent.
3. Build an agentic RAG system that can decide when to use the retriever tool.

<img src="https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=855348219691485642b22a1419939ea7" alt="Hybrid RAG" data-og-width="1615" width="1615" data-og-height="589" height="589" data-path="images/langgraph-hybrid-rag-tutorial.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?w=280&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=09097cb9a1dc57b16d33f084641ea93f 280w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?w=560&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=d0bf85cfa36ac7e1a905593a4688f2d2 560w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?w=840&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=b7626e6ae3cb94fb90a61e6fad69c8ba 840w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?w=1100&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=2425baddda7209901bdde4425c23292c 1100w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?w=1650&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=4e5f030034237589f651b704d0377a76 1650w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/langgraph-hybrid-rag-tutorial.png?w=2500&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=3ec3c7c91fd2be4d749b1c267027ac1e 2500w" />

We will cover the following concepts:

* [Retrieval](/oss/python/langchain/retrieval) using [document loaders](/oss/python/integrations/document_loaders), [text splitters](/oss/python/integrations/splitters), [embeddings](/oss/python/integrations/text_embedding), and [vector stores](/oss/python/integrations/vectorstores)
* The LangGraph [Graph API](/oss/python/langgraph/graph-api), including state, nodes, edges, and conditional edges.

Let's download the required packages and set our API keys:

<Tip>
  Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. [LangSmith](https://docs.smith.langchain.com) lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph.
</Tip>

## 1. Preprocess documents

1. Fetch documents to use in our RAG system. We will use three of the most recent pages from [Lilian Weng's excellent blog](https://lilianweng.github.io/). We'll start by fetching the content of the pages using `WebBaseLoader` utility:

2. Split the fetched documents into smaller chunks for indexing into our vectorstore:

## 2. Create a retriever tool

Now that we have our split documents, we can index them into a vector store that we'll use for semantic search.

1. Use an in-memory vector store and OpenAI embeddings:

2. Create a retriever tool using the `@tool` decorator:

Now we will start building components ([nodes](/oss/python/langgraph/graph-api#nodes) and [edges](/oss/python/langgraph/graph-api#edges)) for our agentic RAG graph.

Note that the components will operate on the [`MessagesState`](/oss/python/langgraph/graph-api#messagesstate) — graph state that contains a `messages` key with a list of [chat messages](https://python.langchain.com/docs/concepts/messages/).

1. Build a `generate_query_or_respond` node. It will call an LLM to generate a response based on the current graph state (list of messages). Given the input messages, it will decide to retrieve using the retriever tool, or respond directly to the user. Note that we're giving the chat model access to the `retriever_tool` we created earlier via `.bind_tools`:

2. Try it on a random input:

3. Ask a question that requires semantic search:

## 4. Grade documents

1. Add a [conditional edge](/oss/python/langgraph/graph-api#conditional-edges) — `grade_documents` — to determine whether the retrieved documents are relevant to the question. We will use a model with a structured output schema `GradeDocuments` for document grading. The `grade_documents` function will return the name of the node to go to based on the grading decision (`generate_answer` or `rewrite_question`):

2. Run this with irrelevant documents in the tool response:

3. Confirm that the relevant documents are classified as such:

## 5. Rewrite question

1. Build the `rewrite_question` node. The retriever tool can return potentially irrelevant documents, which indicates a need to improve the original user question. To do so, we will call the `rewrite_question` node:

## 6. Generate an answer

1. Build `generate_answer` node: if we pass the grader checks, we can generate the final answer based on the original question and the retrieved context:

## 7. Assemble the graph

Now we'll assemble all the nodes and edges into a complete graph:

* Start with a `generate_query_or_respond` and determine if we need to call `retriever_tool`
* Route to next step using `tools_condition`:
  * If `generate_query_or_respond` returned `tool_calls`, call `retriever_tool` to retrieve context
  * Otherwise, respond directly to the user
* Grade retrieved document content for relevance to the question (`grade_documents`) and route to next step:
  * If not relevant, rewrite the question using `rewrite_question` and then call `generate_query_or_respond` again
  * If relevant, proceed to `generate_answer` and generate final response using the [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) with the retrieved document context

```python  theme={null}
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition

workflow = StateGraph(MessagesState)

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
<Tip>
  Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. [LangSmith](https://docs.smith.langchain.com) lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph.
</Tip>

## 1. Preprocess documents

1. Fetch documents to use in our RAG system. We will use three of the most recent pages from [Lilian Weng's excellent blog](https://lilianweng.github.io/). We'll start by fetching the content of the pages using `WebBaseLoader` utility:
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
2. Split the fetched documents into smaller chunks for indexing into our vectorstore:
```

---

## Build a custom SQL agent

**URL:** llms-txt#build-a-custom-sql-agent

**Contents:**
  - Concepts
- Setup
  - Installation
  - LangSmith
- 1. Select an LLM
- 2. Configure the database
- 3. Add tools for database interactions
- 4. Define application steps

Source: https://docs.langchain.com/oss/python/langgraph/sql-agent

In this tutorial we will build a custom agent that can answer questions about a SQL database using LangGraph.

LangChain offers built-in [agent](/oss/python/langchain/agents) implementations, implemented using [LangGraph](/oss/python/langgraph/overview) primitives. If deeper customization is required, agents can be implemented directly in LangGraph. This guide demonstrates an example implementation of a SQL agent. You can find a tutorial building a SQL agent using higher-level LangChain abstractions [here](/oss/python/langchain/sql-agent).

<Warning>
  Building Q\&A systems of SQL databases requires executing model-generated SQL queries. There are inherent risks in doing this. Make sure that your database connection permissions are always scoped as narrowly as possible for your agent's needs. This will mitigate, though not eliminate, the risks of building a model-driven system.
</Warning>

The [prebuilt agent](/oss/python/langchain/sql-agent) lets us get started quickly, but we relied on the system prompt to constrain its behavior— for example, we instructed the agent to always start with the "list tables" tool, and to always run a query-checker tool before executing the query.

We can enforce a higher degree of control in LangGraph by customizing the agent. Here, we implement a simple ReAct-agent setup, with dedicated nodes for specific tool-calls. We will use the same \[state] as the pre-built agent.

We will cover the following concepts:

* [Tools](/oss/python/langchain/tools) for reading from SQL databases
* The LangGraph [Graph API](/oss/python/langgraph/graph-api), including state, nodes, edges, and conditional edges.
* [Human-in-the-loop](/oss/python/langgraph/interrupts) processes

<CodeGroup>
  
</CodeGroup>

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your chain or agent. Then set the following environment variables:

Select a model that supports [tool-calling](/oss/python/integrations/providers/overview):

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)

</CodeGroup>
  </Tab>

<Tab title="Anthropic">
    👉 Read the [Anthropic chat model integration docs](/oss/python/integrations/chat/anthropic/)

</CodeGroup>
  </Tab>

<Tab title="Azure">
    👉 Read the [Azure chat model integration docs](/oss/python/integrations/chat/azure_chat_openai/)

</CodeGroup>
  </Tab>

<Tab title="Google Gemini">
    👉 Read the [Google GenAI chat model integration docs](/oss/python/integrations/chat/google_generative_ai/)

</CodeGroup>
  </Tab>

<Tab title="AWS Bedrock">
    👉 Read the [AWS Bedrock chat model integration docs](/oss/python/integrations/chat/bedrock/)

</CodeGroup>
  </Tab>

<Tab title="HuggingFace">
    👉 Read the [HuggingFace chat model integration docs](/oss/python/integrations/chat/huggingface/)

</CodeGroup>
  </Tab>
</Tabs>

The output shown in the examples below used OpenAI.

## 2. Configure the database

You will be creating a [SQLite database](https://www.sqlitetutorial.net/sqlite-sample-database/) for this tutorial. SQLite is a lightweight database that is easy to set up and use. We will be loading the `chinook` database, which is a sample database that represents a digital media store.

For convenience, we have hosted the database (`Chinook.db`) on a public GCS bucket.

We will use a handy SQL database wrapper available in the `langchain_community` package to interact with the database. The wrapper provides a simple interface to execute SQL queries and fetch results:

## 3. Add tools for database interactions

Use the `SQLDatabase` wrapper available in the `langchain_community` package to interact with the database. The wrapper provides a simple interface to execute SQL queries and fetch results:

## 4. Define application steps

We construct dedicated nodes for the following steps:

* Listing DB tables
* Calling the "get schema" tool
* Generating a query
* Checking the query

Putting these steps in dedicated nodes lets us (1) force tool-calls when needed, and (2) customize the prompts associated with each step.

```python  theme={null}
from typing import Literal

from langchain.messages import AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

get_schema_tool = next(tool for tool in tools if tool.name == "sql_db_schema")
get_schema_node = ToolNode([get_schema_tool], name="get_schema")

run_query_tool = next(tool for tool in tools if tool.name == "sql_db_query")
run_query_node = ToolNode([run_query_tool], name="run_query")

**Examples:**

Example 1 (unknown):
```unknown
</CodeGroup>

### LangSmith

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your chain or agent. Then set the following environment variables:
```

Example 2 (unknown):
```unknown
## 1. Select an LLM

Select a model that supports [tool-calling](/oss/python/integrations/providers/overview):

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)
```

Example 3 (unknown):
```unknown
<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Build a multi-source knowledge base with routing

**URL:** llms-txt#build-a-multi-source-knowledge-base-with-routing

**Contents:**
- Overview
  - Why use a router?
  - Concepts
- Setup
  - Installation
  - LangSmith
  - Select an LLM
- 1. Define state
- 2. Define tools for each vertical
- 3. Create specialized agents

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/router-knowledge-base

The **router pattern** is a [multi-agent](/oss/python/langchain/multi-agent) architecture where a routing step classifies input and directs it to specialized agents, with results synthesized into a combined response. This pattern excels when your organization's knowledge lives across distinct **verticals**—separate knowledge domains that each require their own agent with specialized tools and prompts.

In this tutorial, you'll build a multi-source knowledge base router that demonstrates these benefits through a realistic enterprise scenario. The system will coordinate three specialists:

* A **GitHub agent** that searches code, issues, and pull requests.
* A **Notion agent** that searches internal documentation and wikis.
* A **Slack agent** that searches relevant threads and discussions.

When a user asks "How do I authenticate API requests?", the router decomposes the query into source-specific sub-questions, routes them to the relevant agents in parallel, and synthesizes results into a coherent answer.

### Why use a router?

The router pattern provides several advantages:

* **Parallel execution**: Query multiple sources simultaneously, reducing latency compared to sequential approaches.
* **Specialized agents**: Each vertical has focused tools and prompts optimized for its domain.
* **Selective routing**: Not every query needs every source—the router intelligently selects relevant verticals.
* **Targeted sub-questions**: Each agent receives a question tailored to its domain, improving result quality.
* **Clean synthesis**: Results from multiple sources are combined into a single, coherent response.

We will cover the following concepts:

* [Multi-agent systems](/oss/python/langchain/multi-agent)
* [StateGraph](/oss/python/langchain/graphs) for workflow orchestration
* [Send API](/oss/python/langchain/send) for parallel execution

<Tip>
  **Router vs. Subagents**: The [subagents pattern](/oss/python/langchain/multi-agent/subagents) can also route to multiple agents. Use the router pattern when you need specialized preprocessing, custom routing logic, or want explicit control over parallel execution. Use the subagents pattern when you want the LLM to decide which agents to call dynamically.
</Tip>

This tutorial requires the `langchain` and `langgraph` packages:

For more details, see our [Installation guide](/oss/python/langchain/install).

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your agent. Then set the following environment variables:

Select a chat model from LangChain's suite of integrations:

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)

</CodeGroup>
  </Tab>

<Tab title="Anthropic">
    👉 Read the [Anthropic chat model integration docs](/oss/python/integrations/chat/anthropic/)

</CodeGroup>
  </Tab>

<Tab title="Azure">
    👉 Read the [Azure chat model integration docs](/oss/python/integrations/chat/azure_chat_openai/)

</CodeGroup>
  </Tab>

<Tab title="Google Gemini">
    👉 Read the [Google GenAI chat model integration docs](/oss/python/integrations/chat/google_generative_ai/)

</CodeGroup>
  </Tab>

<Tab title="AWS Bedrock">
    👉 Read the [AWS Bedrock chat model integration docs](/oss/python/integrations/chat/bedrock/)

</CodeGroup>
  </Tab>

<Tab title="HuggingFace">
    👉 Read the [HuggingFace chat model integration docs](/oss/python/integrations/chat/huggingface/)

</CodeGroup>
  </Tab>
</Tabs>

First, define the state schemas. We use three types:

* **`AgentInput`**: Simple state passed to each subagent (just a query)
* **`AgentOutput`**: Result returned by each subagent (source name + result)
* **`RouterState`**: Main workflow state tracking the query, classifications, results, and final answer

The `results` field uses a **reducer** (`operator.add` in Python, a concat function in JS) to collect outputs from parallel agent executions into a single list.

## 2. Define tools for each vertical

Create tools for each knowledge domain. In a production system, these would call actual APIs. For this tutorial, we use stub implementations that return mock data. We define 7 tools across 3 verticals: GitHub (search code, issues, PRs), Notion (search docs, get page), and Slack (search messages, get thread).

## 3. Create specialized agents

Create an agent for each vertical. Each agent has domain-specific tools and a prompt optimized for its knowledge source. All three follow the same pattern—only the tools and system prompt differ.

## 4. Build the router workflow

Now build the router workflow using a StateGraph. The workflow has four main steps:

1. **Classify**: Analyze the query and determine which agents to invoke with what sub-questions
2. **Route**: Fan out to selected agents in parallel using `Send`
3. **Query agents**: Each agent receives a simple `AgentInput` and returns an `AgentOutput`
4. **Synthesize**: Combine collected results into a coherent response

```python  theme={null}
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

router_llm = init_chat_model("openai:gpt-4o-mini")

**Examples:**

Example 1 (unknown):
```unknown
### Why use a router?

The router pattern provides several advantages:

* **Parallel execution**: Query multiple sources simultaneously, reducing latency compared to sequential approaches.
* **Specialized agents**: Each vertical has focused tools and prompts optimized for its domain.
* **Selective routing**: Not every query needs every source—the router intelligently selects relevant verticals.
* **Targeted sub-questions**: Each agent receives a question tailored to its domain, improving result quality.
* **Clean synthesis**: Results from multiple sources are combined into a single, coherent response.

### Concepts

We will cover the following concepts:

* [Multi-agent systems](/oss/python/langchain/multi-agent)
* [StateGraph](/oss/python/langchain/graphs) for workflow orchestration
* [Send API](/oss/python/langchain/send) for parallel execution

<Tip>
  **Router vs. Subagents**: The [subagents pattern](/oss/python/langchain/multi-agent/subagents) can also route to multiple agents. Use the router pattern when you need specialized preprocessing, custom routing logic, or want explicit control over parallel execution. Use the subagents pattern when you want the LLM to decide which agents to call dynamically.
</Tip>

## Setup

### Installation

This tutorial requires the `langchain` and `langgraph` packages:

<CodeGroup>
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>

For more details, see our [Installation guide](/oss/python/langchain/install).

### LangSmith

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your agent. Then set the following environment variables:

<CodeGroup>
```

---

## Build a personal assistant with subagents

**URL:** llms-txt#build-a-personal-assistant-with-subagents

**Contents:**
- Overview
  - Why use a supervisor?
  - Concepts
- Setup
  - Installation
  - LangSmith
  - Components
- 1. Define tools
- 2. Create specialized sub-agents
  - Create a calendar agent

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/subagents-personal-assistant

The **supervisor pattern** is a [multi-agent](/oss/python/langchain/multi-agent) architecture where a central supervisor agent coordinates specialized worker agents. This approach excels when tasks require different types of expertise. Rather than building one agent that manages tool selection across domains, you create focused specialists coordinated by a supervisor who understands the overall workflow.

In this tutorial, you'll build a personal assistant system that demonstrates these benefits through a realistic workflow. The system will coordinate two specialists with fundamentally different responsibilities:

* A **calendar agent** that handles scheduling, availability checking, and event management.
* An **email agent** that manages communication, drafts messages, and sends notifications.

We will also incorporate [human-in-the-loop review](/oss/python/langchain/human-in-the-loop) to allow users to approve, edit, and reject actions (such as outbound emails) as desired.

### Why use a supervisor?

Multi-agent architectures allow you to partition [tools](/oss/python/langchain/tools) across workers, each with their own individual prompts or instructions. Consider an agent with direct access to all calendar and email APIs: it must choose from many similar tools, understand exact formats for each API, and handle multiple domains simultaneously. If performance degrades, it may be helpful to separate related tools and associated prompts into logical groups (in part to manage iterative improvements).

We will cover the following concepts:

* [Multi-agent systems](/oss/python/langchain/multi-agent)
* [Human-in-the-loop review](/oss/python/langchain/human-in-the-loop)

This tutorial requires the `langchain` package:

For more details, see our [Installation guide](/oss/python/langchain/install).

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your agent. Then set the following environment variables:

We will need to select a chat model from LangChain's suite of integrations:

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)

</CodeGroup>
  </Tab>

<Tab title="Anthropic">
    👉 Read the [Anthropic chat model integration docs](/oss/python/integrations/chat/anthropic/)

</CodeGroup>
  </Tab>

<Tab title="Azure">
    👉 Read the [Azure chat model integration docs](/oss/python/integrations/chat/azure_chat_openai/)

</CodeGroup>
  </Tab>

<Tab title="Google Gemini">
    👉 Read the [Google GenAI chat model integration docs](/oss/python/integrations/chat/google_generative_ai/)

</CodeGroup>
  </Tab>

<Tab title="AWS Bedrock">
    👉 Read the [AWS Bedrock chat model integration docs](/oss/python/integrations/chat/bedrock/)

</CodeGroup>
  </Tab>

<Tab title="HuggingFace">
    👉 Read the [HuggingFace chat model integration docs](/oss/python/integrations/chat/huggingface/)

</CodeGroup>
  </Tab>
</Tabs>

Start by defining the tools that require structured inputs. In real applications, these would call actual APIs (Google Calendar, SendGrid, etc.). For this tutorial, you'll use stubs to demonstrate the pattern.

## 2. Create specialized sub-agents

Next, we'll create specialized sub-agents that handle each domain.

### Create a calendar agent

The calendar agent understands natural language scheduling requests and translates them into precise API calls. It handles date parsing, availability checking, and event creation.

Test the calendar agent to see how it handles natural language scheduling:

The agent parses "next Tuesday at 2pm" into ISO format ("2024-01-16T14:00:00"), calculates the end time, calls `create_calendar_event`, and returns a natural language confirmation.

### Create an email agent

The email agent handles message composition and sending. It focuses on extracting recipient information, crafting appropriate subject lines and body text, and managing email communication.

Test the email agent with a natural language request:

The agent infers the recipient from the informal request, crafts a professional subject line and body, calls `send_email`, and returns a confirmation. Each sub-agent has a narrow focus with domain-specific tools and prompts, allowing it to excel at its specific task.

## 3. Wrap sub-agents as tools

Now wrap each sub-agent as a tool that the supervisor can invoke. This is the key architectural step that creates the layered system. The supervisor will see high-level tools like "schedule\_event", not low-level tools like "create\_calendar\_event".

The tool descriptions help the supervisor decide when to use each tool, so make them clear and specific. We return only the sub-agent's final response, as the supervisor doesn't need to see intermediate reasoning or tool calls.

## 4. Create the supervisor agent

Now create the supervisor that orchestrates the sub-agents. The supervisor only sees high-level tools and makes routing decisions at the domain level, not the individual API level.

## 5. Use the supervisor

Now test your complete system with complex requests that require coordination across multiple domains:

### Example 1: Simple single-domain request

The supervisor identifies this as a calendar task, calls `schedule_event`, and the calendar agent handles date parsing and event creation.

<Tip>
  For full transparency into the information flow, including prompts and responses for each chat model call, check out the [LangSmith trace](https://smith.langchain.com/public/91a9a95f-fba9-4e84-aff0-371861ad2f4a/r) for the above run.
</Tip>

### Example 2: Complex multi-domain request

The supervisor recognizes this requires both calendar and email actions, calls `schedule_event` for the meeting, then calls `manage_email` for the reminder. Each sub-agent completes its task, and the supervisor synthesizes both results into a coherent response.

<Tip>
  Refer to the [LangSmith trace](https://smith.langchain.com/public/95cd00a3-d1f9-4dba-9731-7bf733fb6a3c/r) to see the detailed information flow for the above run, including individual chat model prompts and responses.
</Tip>

### Complete working example

Here's everything together in a runnable script:

<Expandable title="View complete code" defaultOpen={false}>
  
</Expandable>

### Understanding the architecture

Your system has three layers. The bottom layer contains rigid API tools that require exact formats. The middle layer contains sub-agents that accept natural language, translate it to structured API calls, and return natural language confirmations. The top layer contains the supervisor that routes to high-level capabilities and synthesizes results.

This separation of concerns provides several benefits: each layer has a focused responsibility, you can add new domains without affecting existing ones, and you can test and iterate on each layer independently.

## 6. Add human-in-the-loop review

It can be prudent to incorporate [human-in-the-loop review](/oss/python/langchain/human-in-the-loop) of sensitive actions. LangChain includes [built-in middleware](/oss/python/langchain/human-in-the-loop#configuring-interrupts) to review tool calls, in this case the tools invoked by sub-agents.

Let's add human-in-the-loop review to both sub-agents:

* We configure the `create_calendar_event` and `send_email` tools to interrupt, permitting all [response types](/oss/python/langchain/human-in-the-loop) (`approve`, `edit`, `reject`)
* We add a [checkpointer](/oss/python/langchain/short-term-memory) **only to the top-level agent**. This is required to pause and resume execution.

Let's repeat the query. Note that we gather interrupt events into a list to access downstream:

This time we've interrupted execution. Let's inspect the interrupt events:

We can specify decisions for each interrupt by referring to its ID using a [`Command`](https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command). Refer to the [human-in-the-loop guide](/oss/python/langchain/human-in-the-loop) for additional details. For demonstration purposes, here we will accept the calendar event, but edit the subject of the outbound email:

The run proceeds with our input.

## 7. Advanced: Control information flow

By default, sub-agents receive only the request string from the supervisor. You might want to pass additional context, such as conversation history or user preferences.

### Pass additional conversational context to sub-agents

This allows sub-agents to see the full conversation context, which can be useful for resolving ambiguities like "schedule it for the same time tomorrow" (referencing a previous conversation).

<Tip>
  You can see the full context received by the sub agent in the [chat model call](https://smith.langchain.com/public/c7d54882-afb8-4039-9c5a-4112d0f458b0/r/6803571e-af78-4c68-904a-ecf55771084d) of the LangSmith trace.
</Tip>

### Control what supervisor receives

You can also customize what information flows back to the supervisor:

**Important:** Make sure sub-agent prompts emphasize that their final message should contain all relevant information. A common failure mode is sub-agents that perform tool calls but don't include the results in their final response.

The supervisor pattern creates layers of abstraction where each layer has a clear responsibility. When designing a supervisor system, start with clear domain boundaries and give each sub-agent focused tools and prompts. Write clear tool descriptions for the supervisor, test each layer independently before integration, and control information flow based on your specific needs.

<Tip>
  **When to use the supervisor pattern**

Use the supervisor pattern when you have multiple distinct domains (calendar, email, CRM, database), each domain has multiple tools or complex logic, you want centralized workflow control, and sub-agents don't need to converse directly with users.

For simpler cases with just a few tools, use a single agent. When agents need to have conversations with users, use [handoffs](/oss/python/langchain/multi-agent/handoffs) instead. For peer-to-peer collaboration between agents, consider other multi-agent patterns.
</Tip>

Learn about [handoffs](/oss/python/langchain/multi-agent/handoffs) for agent-to-agent conversations, explore [context engineering](/oss/python/langchain/context-engineering) to fine-tune information flow, read the [multi-agent overview](/oss/python/langchain/multi-agent) to compare different patterns, and use [LangSmith](https://smith.langchain.com) to debug and monitor your multi-agent system.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/subagents-personal-assistant.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

For more details, see our [Installation guide](/oss/python/langchain/install).

### LangSmith

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your agent. Then set the following environment variables:

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>

### Components

We will need to select a chat model from LangChain's suite of integrations:

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)
```

---

## Build a RAG agent with LangChain

**URL:** llms-txt#build-a-rag-agent-with-langchain

**Contents:**
- Overview
  - Concepts
  - Preview
- Setup
  - Installation
  - LangSmith
  - Components
- 1. Indexing
  - Loading documents

Source: https://docs.langchain.com/oss/python/langchain/rag

One of the most powerful applications enabled by LLMs is sophisticated question-answering (Q\&A) chatbots. These are applications that can answer questions about specific source information. These applications use a technique known as Retrieval Augmented Generation, or [RAG](/oss/python/langchain/retrieval/).

This tutorial will show how to build a simple Q\&A application over an unstructured text data source. We will demonstrate:

1. A RAG [agent](#rag-agents) that executes searches with a simple tool. This is a good general-purpose implementation.
2. A two-step RAG [chain](#rag-chains) that uses just a single LLM call per query. This is a fast and effective method for simple queries.

We will cover the following concepts:

* **Indexing**: a pipeline for ingesting data from a source and indexing it. *This usually happens in a separate process.*

* **Retrieval and generation**: the actual RAG process, which takes the user query at run time and retrieves the relevant data from the index, then passes that to the model.

Once we've indexed our data, we will use an [agent](/oss/python/langchain/agents) as our orchestration framework to implement the retrieval and generation steps.

<Note>
  The indexing portion of this tutorial will largely follow the [semantic search tutorial](/oss/python/langchain/knowledge-base).

If your data is already available for search (i.e., you have a function to execute a search), or you're comfortable with the content from that tutorial, feel free to skip to the section on [retrieval and generation](#2-retrieval-and-generation)
</Note>

In this guide we'll build an app that answers questions about the website's content. The specific website we will use is the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng, which allows us to ask questions about the contents of the post.

We can create a simple indexing pipeline and RAG chain to do this in \~40 lines of code. See below for the full code snippet:

<Accordion title="Expand for full code snippet">

Check out the [LangSmith trace](https://smith.langchain.com/public/a117a1f8-c96c-4c16-a285-00b85646118e/r).
</Accordion>

This tutorial requires these langchain dependencies:

For more details, see our [Installation guide](/oss/python/langchain/install).

Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com).

After you sign up at the link above, make sure to set your environment variables to start logging traces:

Or, set them in Python:

We will need to select three components from LangChain's suite of integrations.

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)

</CodeGroup>
  </Tab>

<Tab title="Anthropic">
    👉 Read the [Anthropic chat model integration docs](/oss/python/integrations/chat/anthropic/)

</CodeGroup>
  </Tab>

<Tab title="Azure">
    👉 Read the [Azure chat model integration docs](/oss/python/integrations/chat/azure_chat_openai/)

</CodeGroup>
  </Tab>

<Tab title="Google Gemini">
    👉 Read the [Google GenAI chat model integration docs](/oss/python/integrations/chat/google_generative_ai/)

</CodeGroup>
  </Tab>

<Tab title="AWS Bedrock">
    👉 Read the [AWS Bedrock chat model integration docs](/oss/python/integrations/chat/bedrock/)

</CodeGroup>
  </Tab>

<Tab title="HuggingFace">
    👉 Read the [HuggingFace chat model integration docs](/oss/python/integrations/chat/huggingface/)

</CodeGroup>
  </Tab>
</Tabs>

Select an embeddings model:

<Tabs>
  <Tab title="OpenAI">

<Tab title="Google Gemini">

<Tab title="Google Vertex">

<Tab title="HuggingFace">

<Tab title="MistralAI">

<Tab title="Voyage AI">

<Tab title="IBM watsonx">

<Tab title="Isaacus">

Select a vector store:

<Tabs>
  <Tab title="In-memory">

<Tab title="Amazon OpenSearch">

<Tab title="AstraDB">

<Tab title="MongoDB">

<Tab title="PGVector">

<Tab title="PGVectorStore">

<Tab title="Pinecone">

<Note>
  **This section is an abbreviated version of the content in the [semantic search tutorial](/oss/python/langchain/knowledge-base).**

If your data is already indexed and available for search (i.e., you have a function to execute a search), or if you're comfortable with [document loaders](/oss/python/langchain/retrieval#document_loaders), [embeddings](/oss/python/langchain/retrieval#embedding_models), and [vector stores](/oss/python/langchain/retrieval#vectorstores), feel free to skip to the next section on [retrieval and generation](/oss/python/langchain/rag#2-retrieval-and-generation).
</Note>

Indexing commonly works as follows:

1. **Load**: First we need to load our data. This is done with [Document Loaders](/oss/python/langchain/retrieval#document_loaders).
2. **Split**: [Text splitters](/oss/python/langchain/retrieval#text_splitters) break large `Documents` into smaller chunks. This is useful both for indexing data and passing it into a model, as large chunks are harder to search over and won't fit in a model's finite context window.
3. **Store**: We need somewhere to store and index our splits, so that they can be searched over later. This is often done using a [VectorStore](/oss/python/langchain/retrieval#vectorstores) and [Embeddings](/oss/python/langchain/retrieval#embedding_models) model.

<img src="https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=21403ce0d0c772da84dcc5b75cff4451" alt="index_diagram" data-og-width="2583" width="2583" data-og-height="1299" height="1299" data-path="images/rag_indexing.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?w=280&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=bf4eb8255b82a809dbbd2bc2a96d2ed7 280w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?w=560&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=4ebc538b2c4765b609f416025e4dbbda 560w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?w=840&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=1838328a870c7353c42bf1cc2290a779 840w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?w=1100&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=675f55e100bab5e2904d27db01775ccc 1100w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?w=1650&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=4b9e544a7a3ec168651558bce854eb60 1650w, https://mintcdn.com/langchain-5e9cc07a/I6RpA28iE233vhYX/images/rag_indexing.png?w=2500&fit=max&auto=format&n=I6RpA28iE233vhYX&q=85&s=f5aeaaaea103128f374c03b05a317263 2500w" />

### Loading documents

We need to first load the blog post contents. We can use [DocumentLoaders](/oss/python/langchain/retrieval#document_loaders) for this, which are objects that load in data from a source and return a list of [Document](https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document) objects.

In this case we'll use the [`WebBaseLoader`](/oss/python/integrations/document_loaders/web_base), which uses `urllib` to load HTML from web URLs and `BeautifulSoup` to parse it to text. We can customize the HTML -> text parsing by passing in parameters into the `BeautifulSoup` parser via `bs_kwargs` (see [BeautifulSoup docs](https://beautiful-soup-4.readthedocs.io/en/latest/#beautifulsoup)). In this case only HTML tags with class “post-content”, “post-title”, or “post-header” are relevant, so we'll remove all others.

```python  theme={null}
import bs4
from langchain_community.document_loaders import WebBaseLoader

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
Check out the [LangSmith trace](https://smith.langchain.com/public/a117a1f8-c96c-4c16-a285-00b85646118e/r).
</Accordion>

## Setup

### Installation

This tutorial requires these langchain dependencies:

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Build a simple workflow

**URL:** llms-txt#build-a-simple-workflow

**Contents:**
- Example: RAG pipeline

workflow = (
    StateGraph(State)
    .add_node("agent", agent_node)
    .add_edge(START, "agent")
    .add_edge("agent", END)
    .compile()
)
mermaid  theme={null}
  graph LR
      A([Query]) --> B{{Rewrite}}
      B --> C[(Retrieve)]
      C --> D((Agent))
      D --> E([Response])
  python  theme={null}
  from typing import TypedDict
  from pydantic import BaseModel
  from langgraph.graph import StateGraph, START, END
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain_openai import ChatOpenAI, OpenAIEmbeddings
  from langchain_core.vectorstores import InMemoryVectorStore

class State(TypedDict):
      question: str
      rewritten_query: str
      documents: list[str]
      answer: str

# WNBA knowledge base with rosters, game results, and player stats
  embeddings = OpenAIEmbeddings()
  vector_store = InMemoryVectorStore(embeddings)
  vector_store.add_texts([
      # Rosters
      "New York Liberty 2024 roster: Breanna Stewart, Sabrina Ionescu, Jonquel Jones, Courtney Vandersloot.",
      "Las Vegas Aces 2024 roster: A'ja Wilson, Kelsey Plum, Jackie Young, Chelsea Gray.",
      "Indiana Fever 2024 roster: Caitlin Clark, Aliyah Boston, Kelsey Mitchell, NaLyssa Smith.",
      # Game results
      "2024 WNBA Finals: New York Liberty defeated Minnesota Lynx 3-2 to win the championship.",
      "June 15, 2024: Indiana Fever 85, Chicago Sky 79. Caitlin Clark had 23 points and 8 assists.",
      "August 20, 2024: Las Vegas Aces 92, Phoenix Mercury 84. A'ja Wilson scored 35 points.",
      # Player stats
      "A'ja Wilson 2024 season stats: 26.9 PPG, 11.9 RPG, 2.6 BPG. Won MVP award.",
      "Caitlin Clark 2024 rookie stats: 19.2 PPG, 8.4 APG, 5.7 RPG. Won Rookie of the Year.",
      "Breanna Stewart 2024 stats: 20.4 PPG, 8.5 RPG, 3.5 APG.",
  ])
  retriever = vector_store.as_retriever(search_kwargs={"k": 5})

@tool
  def get_latest_news(query: str) -> str:
      """Get the latest WNBA news and updates."""
      # Your news API here
      return "Latest: The WNBA announced expanded playoff format for 2025..."

agent = create_agent(
      model="openai:gpt-4o",
      tools=[get_latest_news],
  )

model = ChatOpenAI(model="gpt-4o")

class RewrittenQuery(BaseModel):
      query: str

def rewrite_query(state: State) -> dict:
      """Rewrite the user query for better retrieval."""
      system_prompt = """Rewrite this query to retrieve relevant WNBA information.
  The knowledge base contains: team rosters, game results with scores, and player statistics (PPG, RPG, APG).
  Focus on specific player names, team names, or stat categories mentioned."""
      response = model.with_structured_output(RewrittenQuery).invoke([
          {"role": "system", "content": system_prompt},
          {"role": "user", "content": state["question"]}
      ])
      return {"rewritten_query": response.query}

def retrieve(state: State) -> dict:
      """Retrieve documents based on the rewritten query."""
      docs = retriever.invoke(state["rewritten_query"])
      return {"documents": [doc.page_content for doc in docs]}

def call_agent(state: State) -> dict:
      """Generate answer using retrieved context."""
      context = "\n\n".join(state["documents"])
      prompt = f"Context:\n{context}\n\nQuestion: {state['question']}"
      response = agent.invoke({"messages": [{"role": "user", "content": prompt}]})
      return {"answer": response["messages"][-1].content_blocks}

workflow = (
      StateGraph(State)
      .add_node("rewrite", rewrite_query)
      .add_node("retrieve", retrieve)
      .add_node("agent", call_agent)
      .add_edge(START, "rewrite")
      .add_edge("rewrite", "retrieve")
      .add_edge("retrieve", "agent")
      .add_edge("agent", END)
      .compile()
  )

result = workflow.invoke({"question": "Who won the 2024 WNBA Championship?"})
  print(result["answer"])
  ```
</Accordion>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/custom-workflow.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Example: RAG pipeline

A common use case is combining [retrieval](/oss/python/langchain/retrieval) with an agent. This example builds a WNBA stats assistant that retrieves from a knowledge base and can fetch live news.

<Accordion title="Custom RAG workflow">
  The workflow demonstrates three types of nodes:

  * **Model node** (Rewrite): Rewrites the user query for better retrieval using [structured output](/oss/python/langchain/structured-output).
  * **Deterministic node** (Retrieve): Performs vector similarity search — no LLM involved.
  * **Agent node** (Agent): Reasons over retrieved context and can fetch additional information via tools.
```

Example 2 (unknown):
```unknown
<Tip>
    You can use LangGraph state to pass information between workflow steps. This allows each part of your workflow to read and update structured fields, making it easy to share data and context across nodes.
  </Tip>
```

---

## Build a SQL agent

**URL:** llms-txt#build-a-sql-agent

**Contents:**
- Overview
  - Concepts
- Setup
  - Installation
  - LangSmith
- 1. Select an LLM
- 2. Configure the database
- 3. Add tools for database interactions
- 4. Use `create_agent`
- 5. Run the agent

Source: https://docs.langchain.com/oss/python/langchain/sql-agent

In this tutorial, you will learn how to build an agent that can answer questions about a SQL database using LangChain [agents](/oss/python/langchain/agents).

At a high level, the agent will:

<Steps>
  <Step title="Fetch the available tables and schemas from the database" />

<Step title="Decide which tables are relevant to the question" />

<Step title="Fetch the schemas for the relevant tables" />

<Step title="Generate a query based on the question and information from the schemas" />

<Step title="Double-check the query for common mistakes using an LLM" />

<Step title="Execute the query and return the results" />

<Step title="Correct mistakes surfaced by the database engine until the query is successful" />

<Step title="Formulate a response based on the results" />
</Steps>

<Warning>
  Building Q\&A systems of SQL databases requires executing model-generated SQL queries. There are inherent risks in doing this. Make sure that your database connection permissions are always scoped as narrowly as possible for your agent's needs. This will mitigate, though not eliminate, the risks of building a model-driven system.
</Warning>

We will cover the following concepts:

* [Tools](/oss/python/langchain/tools) for reading from SQL databases
* LangChain [agents](/oss/python/langchain/agents)
* [Human-in-the-loop](/oss/python/langchain/human-in-the-loop) processes

<CodeGroup>
  
</CodeGroup>

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your chain or agent. Then set the following environment variables:

Select a model that supports [tool-calling](/oss/python/integrations/providers/overview):

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)

</CodeGroup>
  </Tab>

<Tab title="Anthropic">
    👉 Read the [Anthropic chat model integration docs](/oss/python/integrations/chat/anthropic/)

</CodeGroup>
  </Tab>

<Tab title="Azure">
    👉 Read the [Azure chat model integration docs](/oss/python/integrations/chat/azure_chat_openai/)

</CodeGroup>
  </Tab>

<Tab title="Google Gemini">
    👉 Read the [Google GenAI chat model integration docs](/oss/python/integrations/chat/google_generative_ai/)

</CodeGroup>
  </Tab>

<Tab title="AWS Bedrock">
    👉 Read the [AWS Bedrock chat model integration docs](/oss/python/integrations/chat/bedrock/)

</CodeGroup>
  </Tab>

<Tab title="HuggingFace">
    👉 Read the [HuggingFace chat model integration docs](/oss/python/integrations/chat/huggingface/)

</CodeGroup>
  </Tab>
</Tabs>

The output shown in the examples below used OpenAI.

## 2. Configure the database

You will be creating a [SQLite database](https://www.sqlitetutorial.net/sqlite-sample-database/) for this tutorial. SQLite is a lightweight database that is easy to set up and use. We will be loading the `chinook` database, which is a sample database that represents a digital media store.

For convenience, we have hosted the database (`Chinook.db`) on a public GCS bucket.

We will use a handy SQL database wrapper available in the `langchain_community` package to interact with the database. The wrapper provides a simple interface to execute SQL queries and fetch results:

## 3. Add tools for database interactions

Use the `SQLDatabase` wrapper available in the `langchain_community` package to interact with the database. The wrapper provides a simple interface to execute SQL queries and fetch results:

## 4. Use `create_agent`

Use [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) to build a [ReAct agent](https://arxiv.org/pdf/2210.03629) with minimal code. The agent will interpret the request and generate a SQL command, which the tools will execute. If the command has an error, the error message is returned to the model. The model can then examine the original request and the new error message and generate a new command. This can continue until the LLM generates the command successfully or reaches an end count. This pattern of providing a model with feedback - error messages in this case - is very powerful.

Initialize the agent with a descriptive system prompt to customize its behavior:

Now, create an agent with the model, tools, and prompt:

Run the agent on a sample query and observe its behavior:

The agent correctly wrote a query, checked the query, and ran it to inform its final response.

<Note>
  You can inspect all aspects of the above run, including steps taken, tools invoked, what prompts were seen by the LLM, and more in the [LangSmith trace](https://smith.langchain.com/public/cd2ce887-388a-4bb1-a29d-48208ce50d15/r).
</Note>

### (Optional) Use Studio

[Studio](/langsmith/studio) provides a "client side" loop as well as memory so you can run this as a chat interface and query the database. You can ask questions like "Tell me the scheme of the database" or "Show me the invoices for the 5 top customers". You will see the SQL command that is generated and the resulting output. The details of how to get that started are below.

<Accordion title="Run your agent in Studio">
  In addition to the previously mentioned packages, you will need to:

In directory you will run in, you will need a `langgraph.json` file with the following contents:

Create a file `sql_agent.py` and insert this:

## 6. Implement human-in-the-loop review

It can be prudent to check the agent's SQL queries before they are executed for any unintended actions or inefficiencies.

LangChain agents feature support for built-in [human-in-the-loop middleware](/oss/python/langchain/human-in-the-loop) to add oversight to agent tool calls. Let's configure the agent to pause for human review on calling the `sql_db_query` tool:

<Note>
  We've added a [checkpointer](/oss/python/langchain/short-term-memory) to our agent to allow execution to be paused and resumed. See the [human-in-the-loop guide](/oss/python/langchain/human-in-the-loop) for detalis on this as well as available middleware configurations.
</Note>

On running the agent, it will now pause for review before executing the `sql_db_query` tool:

We can resume execution, in this case accepting the query, using [Command](/oss/python/langgraph/use-graph-api#combine-control-flow-and-state-updates-with-command):

Refer to the [human-in-the-loop guide](/oss/python/langchain/human-in-the-loop) for details.

For deeper customization, check out [this tutorial](/oss/python/langgraph/sql-agent) for implementing a SQL agent directly using LangGraph primitives.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/sql-agent.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
</CodeGroup>

### LangSmith

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your chain or agent. Then set the following environment variables:
```

Example 2 (unknown):
```unknown
## 1. Select an LLM

Select a model that supports [tool-calling](/oss/python/integrations/providers/overview):

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)
```

Example 3 (unknown):
```unknown
<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Build a voice agent with LangChain

**URL:** llms-txt#build-a-voice-agent-with-langchain

**Contents:**
- Overview
  - What are voice agents?
  - How do voice agents work?
  - Demo Application Overview
  - Architecture
- Setup
- 1. Speech-to-text
  - Key Concepts
  - Implementation
- 2. LangChain agent

Source: https://docs.langchain.com/oss/python/langchain/voice-agent

Chat interfaces have dominated how we interact with AI, but recent breakthroughs in multimodal AI are opening up exciting new possibilities. High-quality generative models and expressive text-to-speech (TTS) systems now make it possible to build agents that feel less like tools and more like conversational partners.

Voice agents are one example of this. Instead of relying on a keyboard and mouse to type inputs into an agent, you can use spoken words to interact with it. This can be a more natural and engaging way to interact with AI, and can be especially useful for certain contexts.

### What are voice agents?

Voice agents are [agents](/oss/python/langchain/agents) that can engage in natural spoken conversations with users. These agents combine speech recognition, natural language processing, generative AI, and text-to-speech technologies to create seamless, natural conversations.

They're suited for a variety of use cases, including:

* Customer support
* Personal assistants
* Hands-free interfaces
* Coaching and training

### How do voice agents work?

At a high level, every voice agent needs to handle three tasks:

1. **Listen** - capture audio and transcribe it
2. **Think** - interpret intent, reason, plan
3. **Speak** - generate audio and stream it back to the user

The difference lies in how these steps are sequenced and coupled. In practice, production agents follow one of two main architectures:

#### 1. STT > Agent > TTS Architecture (The "Sandwich")

The Sandwich architecture composes three distinct components: speech-to-text (STT), a text-based LangChain agent, and text-to-speech (TTS).

* Full control over each component (swap STT/TTS providers as needed)
* Access to latest capabilities from modern text-modality models
* Transparent behavior with clear boundaries between components

* Requires orchestrating multiple services
* Additional complexity in managing the pipeline
* Conversion from speech to text loses information (e.g., tone, emotion)

#### 2. Speech-to-Speech Architecture (S2S)

Speech-to-speech uses a multimodal model that processes audio input and generates audio output natively.

* Simpler architecture with fewer moving parts
* Typically lower latency for simple interactions
* Direct audio processing captures tone and other nuances of speech

* Limited model options, greater risk of provider lock-in
* Features may lag behind text-modality models
* Less transparency in how audio is processed
* Reduced controllability and customization options

This guide demonstrates the **sandwich architecture** to balance performance, controllability, and access to modern model capabilities. The sandwich can achieve sub-700ms latency with some STT and TTS providers while maintaining control over modular components.

### Demo Application Overview

We'll walk through building a voice-based agent using the sandwich architecture. The agent will manage orders for a sandwich shop. The application will demonstrate all three components of the sandwich architecture, using [AssemblyAI](https://www.assemblyai.com/) for STT and [Cartesia](https://cartesia.ai/) for TTS (although adapters can be built for most providers).

An end-to-end reference application is available in the [voice-sandwich-demo](https://github.com/langchain-ai/voice-sandwich-demo) repository. We will walk through that application here.

The demo uses WebSockets for real-time bidirectional communication between the browser and server. The same architecture can be adapted for other transports like telephony systems (Twilio, Vonage) or WebRTC connections.

The demo implements a streaming pipeline where each stage processes data asynchronously:

* Captures microphone audio and encodes it as PCM
* Establishes WebSocket connection to the backend server
* Streams audio chunks to the server in real-time
* Receives and plays back synthesized speech audio

* Accepts WebSocket connections from clients

* Orchestrates the three-step pipeline:
  * [Speech-to-text (STT)](#1-speech-to-text): Forwards audio to the STT provider (e.g., AssemblyAI), receives transcript events
  * [Agent](#2-langchain-agent): Processes transcripts with LangChain agent, streams response tokens
  * [Text-to-speech (TTS)](#3-text-to-speech): Sends agent responses to the TTS provider (e.g., Cartesia), receives audio chunks

* Returns synthesized audio to the client for playback

The pipeline uses async generators to enable streaming at each stage. This allows downstream components to begin processing before upstream stages complete, minimizing end-to-end latency.

For detailed installation instructions and setup, see the [repository README](https://github.com/langchain-ai/voice-sandwich-demo#readme).

The STT stage transforms an incoming audio stream into text transcripts. The implementation uses a producer-consumer pattern to handle audio streaming and transcript reception concurrently.

**Producer-Consumer Pattern**: Audio chunks are sent to the STT service concurrently with receiving transcript events. This allows transcription to begin before all audio has arrived.

* `stt_chunk`: Partial transcripts provided as the STT service processes audio
* `stt_output`: Final, formatted transcripts that trigger agent processing

**WebSocket Connection**: Maintains a persistent connection to AssemblyAI's real-time STT API, configured for 16kHz PCM audio with automatic turn formatting.

The application implements an AssemblyAI client to manage the WebSocket connection and message parsing. See below for implementations; similar adapters can be constructed for other STT providers.

<Accordion title="AssemblyAI Client">
  
</Accordion>

## 2. LangChain agent

The agent stage processes text transcripts through a LangChain [agent](/oss/python/langchain/agents) and streams the response tokens. In this case, we stream all [text content blocks](/oss/python/langchain/messages#textcontentblock) generated by the agent.

**Streaming Responses**: The agent uses [`stream_mode="messages"`](/oss/python/langchain/streaming#llm-tokens) to emit response tokens as they're generated, rather than waiting for the complete response. This enables the TTS stage to begin synthesis immediately.

**Conversation Memory**: A [checkpointer](/oss/python/langchain/short-term-memory) maintains conversation state across turns using a unique thread ID. This allows the agent to reference previous exchanges in the conversation.

```python  theme={null}
from uuid import uuid4
from langchain.agents import create_agent
from langchain.messages import HumanMessage
from langgraph.checkpoint.memory import InMemorySaver

**Examples:**

Example 1 (unknown):
```unknown
**Pros:**

* Full control over each component (swap STT/TTS providers as needed)
* Access to latest capabilities from modern text-modality models
* Transparent behavior with clear boundaries between components

**Cons:**

* Requires orchestrating multiple services
* Additional complexity in managing the pipeline
* Conversion from speech to text loses information (e.g., tone, emotion)

#### 2. Speech-to-Speech Architecture (S2S)

Speech-to-speech uses a multimodal model that processes audio input and generates audio output natively.
```

Example 2 (unknown):
```unknown
**Pros:**

* Simpler architecture with fewer moving parts
* Typically lower latency for simple interactions
* Direct audio processing captures tone and other nuances of speech

**Cons:**

* Limited model options, greater risk of provider lock-in
* Features may lag behind text-modality models
* Less transparency in how audio is processed
* Reduced controllability and customization options

This guide demonstrates the **sandwich architecture** to balance performance, controllability, and access to modern model capabilities. The sandwich can achieve sub-700ms latency with some STT and TTS providers while maintaining control over modular components.

### Demo Application Overview

We'll walk through building a voice-based agent using the sandwich architecture. The agent will manage orders for a sandwich shop. The application will demonstrate all three components of the sandwich architecture, using [AssemblyAI](https://www.assemblyai.com/) for STT and [Cartesia](https://cartesia.ai/) for TTS (although adapters can be built for most providers).

An end-to-end reference application is available in the [voice-sandwich-demo](https://github.com/langchain-ai/voice-sandwich-demo) repository. We will walk through that application here.

The demo uses WebSockets for real-time bidirectional communication between the browser and server. The same architecture can be adapted for other transports like telephony systems (Twilio, Vonage) or WebRTC connections.

### Architecture

The demo implements a streaming pipeline where each stage processes data asynchronously:

**Client (Browser)**

* Captures microphone audio and encodes it as PCM
* Establishes WebSocket connection to the backend server
* Streams audio chunks to the server in real-time
* Receives and plays back synthesized speech audio

**Server (Python)**

* Accepts WebSocket connections from clients

* Orchestrates the three-step pipeline:
  * [Speech-to-text (STT)](#1-speech-to-text): Forwards audio to the STT provider (e.g., AssemblyAI), receives transcript events
  * [Agent](#2-langchain-agent): Processes transcripts with LangChain agent, streams response tokens
  * [Text-to-speech (TTS)](#3-text-to-speech): Sends agent responses to the TTS provider (e.g., Cartesia), receives audio chunks

* Returns synthesized audio to the client for playback

The pipeline uses async generators to enable streaming at each stage. This allows downstream components to begin processing before upstream stages complete, minimizing end-to-end latency.

## Setup

For detailed installation instructions and setup, see the [repository README](https://github.com/langchain-ai/voice-sandwich-demo#readme).

## 1. Speech-to-text

The STT stage transforms an incoming audio stream into text transcripts. The implementation uses a producer-consumer pattern to handle audio streaming and transcript reception concurrently.

### Key Concepts

**Producer-Consumer Pattern**: Audio chunks are sent to the STT service concurrently with receiving transcript events. This allows transcription to begin before all audio has arrived.

**Event Types**:

* `stt_chunk`: Partial transcripts provided as the STT service processes audio
* `stt_output`: Final, formatted transcripts that trigger agent processing

**WebSocket Connection**: Maintains a persistent connection to AssemblyAI's real-time STT API, configured for 16kHz PCM audio with automatic turn formatting.

### Implementation
```

Example 3 (unknown):
```unknown
The application implements an AssemblyAI client to manage the WebSocket connection and message parsing. See below for implementations; similar adapters can be constructed for other STT providers.

<Accordion title="AssemblyAI Client">
```

Example 4 (unknown):
```unknown
</Accordion>

## 2. LangChain agent

The agent stage processes text transcripts through a LangChain [agent](/oss/python/langchain/agents) and streams the response tokens. In this case, we stream all [text content blocks](/oss/python/langchain/messages#textcontentblock) generated by the agent.

### Key Concepts

**Streaming Responses**: The agent uses [`stream_mode="messages"`](/oss/python/langchain/streaming#llm-tokens) to emit response tokens as they're generated, rather than waiting for the complete response. This enables the TTS stage to begin synthesis immediately.

**Conversation Memory**: A [checkpointer](/oss/python/langchain/short-term-memory) maintains conversation state across turns using a unique thread ID. This allows the agent to reference previous exchanges in the conversation.

### Implementation
```

---

## Built-in middleware

**URL:** llms-txt#built-in-middleware

**Contents:**
- Provider-agnostic middleware
  - Summarization
  - Human-in-the-loop
  - Model call limit
  - Tool call limit
  - Model fallback
  - PII detection

Source: https://docs.langchain.com/oss/python/langchain/middleware/built-in

Prebuilt middleware for common agent use cases

LangChain provides prebuilt middleware for common use cases. Each middleware is production-ready and configurable for your specific needs.

## Provider-agnostic middleware

The following middleware work with any LLM provider:

| Middleware                              | Description                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
| [Summarization](#summarization)         | Automatically summarize conversation history when approaching token limits. |
| [Human-in-the-loop](#human-in-the-loop) | Pause execution for human approval of tool calls.                           |
| [Model call limit](#model-call-limit)   | Limit the number of model calls to prevent excessive costs.                 |
| [Tool call limit](#tool-call-limit)     | Control tool execution by limiting call counts.                             |
| [Model fallback](#model-fallback)       | Automatically fallback to alternative models when primary fails.            |
| [PII detection](#pii-detection)         | Detect and handle Personally Identifiable Information (PII).                |
| [To-do list](#to-do-list)               | Equip agents with task planning and tracking capabilities.                  |
| [LLM tool selector](#llm-tool-selector) | Use an LLM to select relevant tools before calling main model.              |
| [Tool retry](#tool-retry)               | Automatically retry failed tool calls with exponential backoff.             |
| [Model retry](#model-retry)             | Automatically retry failed model calls with exponential backoff.            |
| [LLM tool emulator](#llm-tool-emulator) | Emulate tool execution using an LLM for testing purposes.                   |
| [Context editing](#context-editing)     | Manage conversation context by trimming or clearing tool uses.              |
| [Shell tool](#shell-tool)               | Expose a persistent shell session to agents for command execution.          |
| [File search](#file-search)             | Provide Glob and Grep search tools over filesystem files.                   |

Automatically summarize conversation history when approaching token limits, preserving recent messages while compressing older context. Summarization is useful for the following:

* Long-running conversations that exceed context windows.
* Multi-turn dialogues with extensive history.
* Applications where preserving full conversation context matters.

**API reference:** [`SummarizationMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.SummarizationMiddleware)

<Accordion title="Configuration options">
  <Tip>
    The `fraction` conditions for `trigger` and `keep` (shown below) rely on a chat model's [profile data](/oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:

<ParamField body="model" type="string | BaseChatModel" required>
    Model for generating summaries. Can be a model identifier string (e.g., `'openai:gpt-4o-mini'`) or a `BaseChatModel` instance. See [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) for more information.
  </ParamField>

<ParamField body="trigger" type="ContextSize | list[ContextSize] | None">
    Conditions for triggering summarization. Can be:

* A single [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) dict (all properties must be met - AND logic)
    * A list of [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) dicts (any condition must be met - OR logic)

Each condition can include:

* `fraction` (float): Fraction of model's context size (0-1)
    * `tokens` (int): Absolute token count
    * `messages` (int): Message count

At least one property must be specified per condition. If not provided, summarization will not trigger automatically.

See the API reference for [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) for more information.
  </ParamField>

<ParamField body="keep" type="ContextSize" default="{messages: 20}">
    How much context to preserve after summarization. Specify exactly one of:

* `fraction` (float): Fraction of model's context size to keep (0-1)
    * `tokens` (int): Absolute token count to keep
    * `messages` (int): Number of recent messages to keep

See the API reference for [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) for more information.
  </ParamField>

<ParamField body="token_counter" type="function">
    Custom token counting function. Defaults to character-based counting.
  </ParamField>

<ParamField body="summary_prompt" type="string">
    Custom prompt template for summarization. Uses built-in template if not specified. The template should include `{messages}` placeholder where conversation history will be inserted.
  </ParamField>

<ParamField body="trim_tokens_to_summarize" type="number" default="4000">
    Maximum number of tokens to include when generating the summary. Messages will be trimmed to fit this limit before summarization.
  </ParamField>

<ParamField body="summary_prefix" type="string">
    Prefix to add to the summary message. If not provided, a default prefix is used.
  </ParamField>

<ParamField body="max_tokens_before_summary" type="number" deprecated>
    **Deprecated:** Use `trigger: {"tokens": value}` instead. Token threshold for triggering summarization.
  </ParamField>

<ParamField body="messages_to_keep" type="number" deprecated>
    **Deprecated:** Use `keep: {"messages": value}` instead. Recent messages to preserve.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The summarization middleware monitors message token counts and automatically summarizes older messages when thresholds are reached.

**Trigger conditions** control when summarization runs:

* Single condition object (all properties must be met - AND logic)
  * Array of conditions (any condition must be met - OR logic)
  * Each condition can use `fraction` (of model's context size), `tokens` (absolute count), or `messages` (message count)

**Keep conditions** control how much context to preserve (specify exactly one):

* `fraction` - Fraction of model's context size to keep
  * `tokens` - Absolute token count to keep
  * `messages` - Number of recent messages to keep

### Human-in-the-loop

Pause agent execution for human approval, editing, or rejection of tool calls before they execute. [Human-in-the-loop](/oss/python/langchain/human-in-the-loop) is useful for the following:

* High-stakes operations requiring human approval (e.g. database writes, financial transactions).
* Compliance workflows where human oversight is mandatory.
* Long-running conversations where human feedback guides the agent.

**API reference:** [`HumanInTheLoopMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware)

<Warning>
  Human-in-the-loop middleware requires a [checkpointer](/oss/python/langgraph/persistence#checkpoints) to maintain state across interruptions.
</Warning>

<Tip>
  For complete examples, configuration options, and integration patterns, see the [Human-in-the-loop documentation](/oss/python/langchain/human-in-the-loop).
</Tip>

<Callout icon="circle-play" iconType="solid">
  Watch this [video guide](https://www.youtube.com/watch?v=SpfT6-YAVPk) demonstrating Human-in-the-loop middleware behavior.
</Callout>

Limit the number of model calls to prevent infinite loops or excessive costs. Model call limit is useful for the following:

* Preventing runaway agents from making too many API calls.
* Enforcing cost controls on production deployments.
* Testing agent behavior within specific call budgets.

**API reference:** [`ModelCallLimitMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelCallLimitMiddleware)

<Callout icon="circle-play" iconType="solid">
  Watch this [video guide](https://www.youtube.com/watch?v=nJEER0uaNkE) demonstrating Model Call Limit middleware behavior.
</Callout>

<Accordion title="Configuration options">
  <ParamField body="thread_limit" type="number">
    Maximum model calls across all runs in a thread. Defaults to no limit.
  </ParamField>

<ParamField body="run_limit" type="number">
    Maximum model calls per single invocation. Defaults to no limit.
  </ParamField>

<ParamField body="exit_behavior" type="string" default="end">
    Behavior when limit is reached. Options: `'end'` (graceful termination) or `'error'` (raise exception)
  </ParamField>
</Accordion>

Control agent execution by limiting the number of tool calls, either globally across all tools or for specific tools. Tool call limits are useful for the following:

* Preventing excessive calls to expensive external APIs.
* Limiting web searches or database queries.
* Enforcing rate limits on specific tool usage.
* Protecting against runaway agent loops.

**API reference:** [`ToolCallLimitMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ToolCallLimitMiddleware)

<Callout icon="circle-play" iconType="solid">
  Watch this [video guide](https://www.youtube.com/watch?v=6gYlaJJ8t0w) demonstrating Tool Call Limit middleware behavior.
</Callout>

<Accordion title="Configuration options">
  <ParamField body="tool_name" type="string">
    Name of specific tool to limit. If not provided, limits apply to **all tools globally**.
  </ParamField>

<ParamField body="thread_limit" type="number">
    Maximum tool calls across all runs in a thread (conversation). Persists across multiple invocations with the same thread ID. Requires a checkpointer to maintain state. `None` means no thread limit.
  </ParamField>

<ParamField body="run_limit" type="number">
    Maximum tool calls per single invocation (one user message → response cycle). Resets with each new user message. `None` means no run limit.

**Note:** At least one of `thread_limit` or `run_limit` must be specified.
  </ParamField>

<ParamField body="exit_behavior" type="string" default="continue">
    Behavior when limit is reached:

* `'continue'` (default) - Block exceeded tool calls with error messages, let other tools and the model continue. The model decides when to end based on the error messages.
    * `'error'` - Raise a `ToolCallLimitExceededError` exception, stopping execution immediately
    * `'end'` - Stop execution immediately with a `ToolMessage` and AI message for the exceeded tool call. Only works when limiting a single tool; raises `NotImplementedError` if other tools have pending calls.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  Specify limits with:

* **Thread limit** - Max calls across all runs in a conversation (requires checkpointer)
  * **Run limit** - Max calls per single invocation (resets each turn)

* `'continue'` (default) - Block exceeded calls with error messages, agent continues
  * `'error'` - Raise exception immediately
  * `'end'` - Stop with ToolMessage + AI message (single-tool scenarios only)

Automatically fallback to alternative models when the primary model fails. Model fallback is useful for the following:

* Building resilient agents that handle model outages.
* Cost optimization by falling back to cheaper models.
* Provider redundancy across OpenAI, Anthropic, etc.

**API reference:** [`ModelFallbackMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelFallbackMiddleware)

<Callout icon="circle-play" iconType="solid">
  Watch this [video guide](https://www.youtube.com/watch?v=8rCRO0DUeIM) demonstrating Model Fallback middleware behavior.
</Callout>

<Accordion title="Configuration options">
  <ParamField body="first_model" type="string | BaseChatModel" required>
    First fallback model to try when the primary model fails. Can be a model identifier string (e.g., `'openai:gpt-4o-mini'`) or a `BaseChatModel` instance.
  </ParamField>

<ParamField body="*additional_models" type="string | BaseChatModel">
    Additional fallback models to try in order if previous models fail
  </ParamField>
</Accordion>

Detect and handle Personally Identifiable Information (PII) in conversations using configurable strategies. PII detection is useful for the following:

* Healthcare and financial applications with compliance requirements.
* Customer service agents that need to sanitize logs.
* Any application handling sensitive user data.

**API reference:** [`PIIMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.PIIMiddleware)

#### Custom PII types

You can create custom PII types by providing a `detector` parameter. This allows you to detect patterns specific to your use case beyond the built-in types.

**Three ways to create custom detectors:**

1. **Regex pattern string** - Simple pattern matching

2. **Custom function** - Complex detection logic with validation

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware
import re

**Examples:**

Example 1 (unknown):
```unknown
<Accordion title="Configuration options">
  <Tip>
    The `fraction` conditions for `trigger` and `keep` (shown below) rely on a chat model's [profile data](/oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:
```

Example 2 (unknown):
```unknown
</Tip>

  <ParamField body="model" type="string | BaseChatModel" required>
    Model for generating summaries. Can be a model identifier string (e.g., `'openai:gpt-4o-mini'`) or a `BaseChatModel` instance. See [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) for more information.
  </ParamField>

  <ParamField body="trigger" type="ContextSize | list[ContextSize] | None">
    Conditions for triggering summarization. Can be:

    * A single [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) dict (all properties must be met - AND logic)
    * A list of [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) dicts (any condition must be met - OR logic)

    Each condition can include:

    * `fraction` (float): Fraction of model's context size (0-1)
    * `tokens` (int): Absolute token count
    * `messages` (int): Message count

    At least one property must be specified per condition. If not provided, summarization will not trigger automatically.

    See the API reference for [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) for more information.
  </ParamField>

  <ParamField body="keep" type="ContextSize" default="{messages: 20}">
    How much context to preserve after summarization. Specify exactly one of:

    * `fraction` (float): Fraction of model's context size to keep (0-1)
    * `tokens` (int): Absolute token count to keep
    * `messages` (int): Number of recent messages to keep

    See the API reference for [`ContextSize`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.summarization.ContextSize) for more information.
  </ParamField>

  <ParamField body="token_counter" type="function">
    Custom token counting function. Defaults to character-based counting.
  </ParamField>

  <ParamField body="summary_prompt" type="string">
    Custom prompt template for summarization. Uses built-in template if not specified. The template should include `{messages}` placeholder where conversation history will be inserted.
  </ParamField>

  <ParamField body="trim_tokens_to_summarize" type="number" default="4000">
    Maximum number of tokens to include when generating the summary. Messages will be trimmed to fit this limit before summarization.
  </ParamField>

  <ParamField body="summary_prefix" type="string">
    Prefix to add to the summary message. If not provided, a default prefix is used.
  </ParamField>

  <ParamField body="max_tokens_before_summary" type="number" deprecated>
    **Deprecated:** Use `trigger: {"tokens": value}` instead. Token threshold for triggering summarization.
  </ParamField>

  <ParamField body="messages_to_keep" type="number" deprecated>
    **Deprecated:** Use `keep: {"messages": value}` instead. Recent messages to preserve.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The summarization middleware monitors message token counts and automatically summarizes older messages when thresholds are reached.

  **Trigger conditions** control when summarization runs:

  * Single condition object (all properties must be met - AND logic)
  * Array of conditions (any condition must be met - OR logic)
  * Each condition can use `fraction` (of model's context size), `tokens` (absolute count), or `messages` (message count)

  **Keep conditions** control how much context to preserve (specify exactly one):

  * `fraction` - Fraction of model's context size to keep
  * `tokens` - Absolute token count to keep
  * `messages` - Number of recent messages to keep
```

Example 3 (unknown):
```unknown
</Accordion>

### Human-in-the-loop

Pause agent execution for human approval, editing, or rejection of tool calls before they execute. [Human-in-the-loop](/oss/python/langchain/human-in-the-loop) is useful for the following:

* High-stakes operations requiring human approval (e.g. database writes, financial transactions).
* Compliance workflows where human oversight is mandatory.
* Long-running conversations where human feedback guides the agent.

**API reference:** [`HumanInTheLoopMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware)

<Warning>
  Human-in-the-loop middleware requires a [checkpointer](/oss/python/langgraph/persistence#checkpoints) to maintain state across interruptions.
</Warning>
```

Example 4 (unknown):
```unknown
<Tip>
  For complete examples, configuration options, and integration patterns, see the [Human-in-the-loop documentation](/oss/python/langchain/human-in-the-loop).
</Tip>

<Callout icon="circle-play" iconType="solid">
  Watch this [video guide](https://www.youtube.com/watch?v=SpfT6-YAVPk) demonstrating Human-in-the-loop middleware behavior.
</Callout>

### Model call limit

Limit the number of model calls to prevent infinite loops or excessive costs. Model call limit is useful for the following:

* Preventing runaway agents from making too many API calls.
* Enforcing cost controls on production deployments.
* Testing agent behavior within specific call budgets.

**API reference:** [`ModelCallLimitMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelCallLimitMiddleware)
```

---

## Call agents from code

**URL:** llms-txt#call-agents-from-code

**Contents:**
- Authentication
- Example

Source: https://docs.langchain.com/langsmith/agent-builder-code

Invoke Agent Builder agents from Python or JavaScript using the LangGraph SDK.

You can invoke Agent Builder agents from your applications using the LangGraph SDK. You can use all the same API methods as you would with any other LangGraph deployment.

To authenticate with the deployment your Agent Builder agents are running on, you must provide a personal access token (PAT) API key tied to your user to the `api_key` arg when instantiating the LangGraph SDK client, or via the `X-API-Key` header. Then, set the `X-Auth-Scheme` header to `langsmith-api-key`.

If the PAT you pass is not tied to the owner of the agent, your request will be rejected with a 404 not found error.

If the agent you're trying to invoke is a workspace agent, and you're not the owner, you'll be able to preform all the same operations as you would in the UI (read-only).

To invoke the agent, you can copy the code below, and replace the `agent_id` and `api_url` with the correct values.

Alternatively, you can copy the same code shown below, but pre-populated with the proper agent ID and API URL, via the Agent Builder UI. To do this, navigate to the agent you want to invoke, visit the editor page, then click on the <Icon icon="gear" /> settings icon in the top right corner, and click `View code snippets`. You'll still need to manually set your `LANGGRAPH_API_KEY` environment variable.

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="TypeScript">
    
  </Tab>
</Tabs>

<Callout icon="key" color="#FEF3C7" iconType="regular">
  Use a PAT (Personal Access Token) API key tied to your user account. Set the `X-Auth-Scheme` header to `langsmith-api-key` for authentication. If you implemented custom authentication, pass your user's token in headers so the agent can use user‑scoped tools. See "Add custom authentication".
</Callout>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-code.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
</Tab>

  <Tab title="TypeScript">
```

---

## Complex multi-agent coordination using Graph API

**URL:** llms-txt#complex-multi-agent-coordination-using-graph-api

coordination_graph = StateGraph(CoordinationState)
coordination_graph.add_node("orchestrator", orchestrator_node)
coordination_graph.add_node("agent_a", agent_a_node)
coordination_graph.add_node("agent_b", agent_b_node)

---

## Configure LangSmith Agent Server for scale

**URL:** llms-txt#configure-langsmith-agent-server-for-scale

**Contents:**
- Scaling for write load
  - Best practices for scaling the write path
- Scaling for read load
  - Best practices for scaling the read path
- Example self-hosted Agent Server configurations
  - Low reads, low writes <a name="low-reads-low-writes" />
  - Low reads, high writes <a name="low-reads-high-writes" />

Source: https://docs.langchain.com/langsmith/agent-server-scale

The default configuration for LangSmith Agent Server is designed to handle substantial read and write load across a variety of different workloads. By following the best practices outlined below, you can tune your Agent Server to perform optimally for your specific workload. This page describes scaling considerations for the Agent Server and provides examples to help configure your deployment.

For some example self-hosted configurations, refer to the [Example Agent Server configurations for scale](#example-agent-server-configurations-for-scale) section.

## Scaling for write load

Write load is primarily driven by the following factors:

* Creation of new [runs](/langsmith/background-run)
* Creation of new checkpoints during run execution
* Writing to long term memory
* Creation of new [threads](/langsmith/use-threads)
* Creation of new [assistants](/langsmith/assistants)
* Deletion of runs, checkpoints, threads, assistants and cron jobs

The following components are primarily responsible for handling write load:

* API server: Handles initial request and persistence of data to the database.
* Queue worker: Handles the execution of runs.
* Redis: Handles the storage of ephemeral data about on-going runs.
* Postgres: Handles the storage of all data, including run, thread, assistant, cron job, checkpointing and long term memory.

### Best practices for scaling the write path

#### Change `N_JOBS_PER_WORKER` based on assistant characteristics

The default value of [`N_JOBS_PER_WORKER`](/langsmith/env-var#n-jobs-per-worker) is 10. You can change this value to scale the maximum number of runs that can be executed at a time by a single queue worker based on the characteristics of your assistant.

Some general guidelines for changing `N_JOBS_PER_WORKER`:

* If your assistant is CPU bounded, the default value of 10 is likely sufficient. You might lower `N_JOBS_PER_WORKER` if you notice excessive CPU usage on queue workers or delays in run execution.
* If your assistant is IO bounded, increase `N_JOBS_PER_WORKER` to handle more concurrent runs per worker.

There is no upper limit to `N_JOBS_PER_WORKER`. However, queue workers are greedy when fetching new runs, which means they will try to pick up as many runs as they have available jobs and begin executing them immediately. Setting `N_JOBS_PER_WORKER` too high in environments with bursty traffic can lead to uneven worker utilization and increased run execution times.

#### Avoid synchronous blocking operations

Avoid synchronous blocking operations in your code and prefer asynchronous operations. Long synchronous operations can block the main event loop, causing longer request and run execution times and potential timeouts.

For example, consider an application that needs to sleep for 1 second. Instead of using synchronous code like this:

Prefer asynchronous code like this:

If an assistant requires synchronous blocking operations, set [`BG_JOB_ISOLATED_LOOPS`](/langsmith/env-var#bg-job-isolated-loops) to `True` to execute each run in a separate event loop.

#### Minimize redundant checkpointing

Minimize redundant checkpointing by setting [`durability`](/oss/python/langgraph/durable-execution#durability-modes) to the minimum value necessary to ensure your data is durable.

The default durability mode is `"async", meaning checkpoints are written after each step asynchronously. If an assistant needs to persist only the final state of the run, `durability`can be set to`"exit"\`, storing only the final state of the run. This can be set when creating the run:

<Note>
  These settings are only required for [self-hosted](/langsmith/self-hosted) deployments. By default, [cloud](/langsmith/cloud) deployments already have these best practices enabled.
</Note>

##### Enable the use of queue workers

By default, the API server manages the queue and does not use queue workers. You can enable the use of queue workers by setting the `queue.enabled` configuration to `true`.

This will allow the API server to offload the queue management to the queue workers, significantly reducing the load on the API server and allowing it to focus on handling requests.

##### Support a number of jobs equal to expected throughput

The more runs you execute in parallel, the more jobs you will need to handle the load. There are two main parameters to scale the available jobs:

* `number_of_queue_workers`: The number of queue workers provisioned.
* `N_JOBS_PER_WORKER`: The number of runs that a single queue work can execute at a time. Defaults to 10.

You can calculate the available jobs with the following equation:

Throughput is then the number of runs that can be executed per second by the available jobs:

Therefore, the minimum number of queue workers you should provision to support your expected steady state throughput is:

##### Configure autoscaling for bursty workloads

Autoscaling is disabled by default, but should be configured for bursty workloads. Using the same calculations as the [previous section](#support-a-number-of-jobs-equal-to-expected-throughput), you can determine the maximum number of queue workers you should allow the autoscaler to scale to based on maximum expected throughput.

## Scaling for read load

Read load is primarily driven by the following factors:

* Getting the results of a [run](/langsmith/background-run)
* Getting the state of a [thread](/langsmith/use-threads)
* Searching for [runs](/langsmith/background-run), [threads](/langsmith/use-threads), [cron jobs](/langsmith/cron-jobs) and [assistants](/langsmith/assistants)
* Retrieving checkpoints and long term memory

The following components are primarily responsible for handling read load:

* API server: Handles the request and direct retrieval of data from the database.
* Postgres: Handles the storage of all data, including run, thread, assistant, cron job, checkpointing and long term memory.
* Redis: Handles the storage of ephemeral data about on-going runs, including streaming messages from queue workers to api servers.

### Best practices for scaling the read path

#### Use filtering to reduce the number of resources returned per request

[Agent Server](/langsmith/agent-server) provides a search API for each resource type. These APIs implement pagination by default and offer many filtering options. Use filtering to reduce the number of resources returned per request and improve performance.

#### Set a TTLs to automatically delete old data

Set a [TTL on threads](/langsmith/configure-ttl) to automatically clean up old data. Runs and checkpoints are automatically deleted when the associated thread is deleted.

#### Avoid polling and use /join to monitor the state of a run

Avoid polling the state of a run by using the `/join` API endpoint. This method returns the final state of the run once the run is complete.

If you need to monitor the output of a run in real-time, use the `/stream` API endpoint. This method streams the run output including the final state of the run.

<Note>
  These settings are only required for [self-hosted](/langsmith/self-hosted) deployments. By default, [cloud](/langsmith/cloud) deployments already have these best practices enabled.
</Note>

##### Configure autoscaling for bursty workloads

Autoscaling is disabled by default, but should be configured for bursty workloads. You can determine the maximum number of api servers you should allow the autoscaler to scale to based on maximum expected throughput. The default for [cloud](/langsmith/cloud) deployments is a maximum of 10 API servers.

## Example self-hosted Agent Server configurations

<Note>
  The exact optimal configuration depends on your application complexity, request patterns, and data requirements. Use the following examples in combination with the information in the previous sections and your specific usage to update your deployment configuration as needed. If you have any questions, contact support via [support.langchain.com](https://support.langchain.com).
</Note>

The following table provides an overview comparing different LangSmith Agent Server configurations for various load patterns (read requests per second / write requests per second) and standard assistant characteristics (average run execution time of 1 second, moderate CPU and memory usage):

|                                                                                                                          | **[Low / low](#low-reads-low-writes)** | **[Low / high](#low-reads-high-writes)** | **[High / low](#high-reads-low-writes)** | [Medium / medium](#medium-reads-medium-writes) | [High / high](#high-reads-high-writes) |
| :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------- | :--------------------------------------- | :--------------------------------------- | :--------------------------------------------- | :------------------------------------- |
| <Tooltip tip="Number of write requests being processed by the deployment per second">Write requests per second</Tooltip> | 5                                      | 5                                        | 500                                      | 50                                             | 500                                    |
| <Tooltip tip="Number of read requests being processed by the deployment per second">Read requests per second</Tooltip>   | 5                                      | 500                                      | 5                                        | 50                                             | 500                                    |
| **API servers**<br />(1 CPU, 2Gi per server)                                                                             | 1 (default)                            | 6                                        | 10                                       | 3                                              | 15                                     |
| **Queue workers**<br />(1 CPU, 2Gi per worker)                                                                           | 1 (default)                            | 10                                       | 1 (default)                              | 5                                              | 10                                     |
| **`N_JOBS_PER_WORKER`**                                                                                                  | 10 (default)                           | 50                                       | 10                                       | 10                                             | 50                                     |
| **Redis resources**                                                                                                      | 2 Gi (default)                         | 2 Gi (default)                           | 2 Gi (default)                           | 2 Gi (default)                                 | 2 Gi (default)                         |
| **Postgres resources**                                                                                                   | 2 CPU<br />8 Gi (default)              | 4 CPU<br />16 Gi memory                  | 4 CPU<br />16 Gi                         | 4 CPU<br />16 Gi memory                        | 8 CPU<br />32 Gi memory                |

The following sample configurations enable each of these setups. Load levels are defined as:

* Low means approximately 5 requests per second
* Medium means approximately 50 requests per second
* High means approximately 500 requests per second

### Low reads, low writes <a name="low-reads-low-writes" />

The default [LangSmith Deployment](/langsmith/deployments) configuration will handle this load. No custom resource configuration is needed here.

### Low reads, high writes <a name="low-reads-high-writes" />

You have a high volume of write requests (500 per second) being processed by your deployment, but relatively few read requests (5 per second).

For this, we recommend a configuration like this:

```yaml  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
Prefer asynchronous code like this:
```

Example 2 (unknown):
```unknown
If an assistant requires synchronous blocking operations, set [`BG_JOB_ISOLATED_LOOPS`](/langsmith/env-var#bg-job-isolated-loops) to `True` to execute each run in a separate event loop.

#### Minimize redundant checkpointing

Minimize redundant checkpointing by setting [`durability`](/oss/python/langgraph/durable-execution#durability-modes) to the minimum value necessary to ensure your data is durable.

The default durability mode is `"async", meaning checkpoints are written after each step asynchronously. If an assistant needs to persist only the final state of the run, `durability`can be set to`"exit"\`, storing only the final state of the run. This can be set when creating the run:
```

Example 3 (unknown):
```unknown
#### Self-hosted

<Note>
  These settings are only required for [self-hosted](/langsmith/self-hosted) deployments. By default, [cloud](/langsmith/cloud) deployments already have these best practices enabled.
</Note>

##### Enable the use of queue workers

By default, the API server manages the queue and does not use queue workers. You can enable the use of queue workers by setting the `queue.enabled` configuration to `true`.
```

Example 4 (unknown):
```unknown
This will allow the API server to offload the queue management to the queue workers, significantly reducing the load on the API server and allowing it to focus on handling requests.

##### Support a number of jobs equal to expected throughput

The more runs you execute in parallel, the more jobs you will need to handle the load. There are two main parameters to scale the available jobs:

* `number_of_queue_workers`: The number of queue workers provisioned.
* `N_JOBS_PER_WORKER`: The number of runs that a single queue work can execute at a time. Defaults to 10.

You can calculate the available jobs with the following equation:
```

---

## Configure your agents

**URL:** llms-txt#configure-your-agents

config_list = [
    {
        "model": "gpt-4",
        "api_key": os.getenv("OPENAI_API_KEY"),
    }
]

---

## ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')

**URL:** llms-txt#contactinfo(name='john-doe',-email='john@example.com',-phone='(555)-123-4567')

**Contents:**
  - Memory

python wrap theme={null}
from langchain.agents.structured_output import ProviderStrategy

agent = create_agent(
    model="gpt-4o",
    response_format=ProviderStrategy(ContactInfo)
)
python  theme={null}
from langchain.agents import AgentState
from langchain.agents.middleware import AgentMiddleware
from typing import Any

class CustomState(AgentState):
    user_preferences: dict

class CustomMiddleware(AgentMiddleware):
    state_schema = CustomState
    tools = [tool1, tool2]

def before_model(self, state: CustomState, runtime) -> dict[str, Any] | None:
        ...

agent = create_agent(
    model,
    tools=tools,
    middleware=[CustomMiddleware()]
)

**Examples:**

Example 1 (unknown):
```unknown
#### ProviderStrategy

`ProviderStrategy` uses the model provider's native structured output generation. This is more reliable but only works with providers that support native structured output (e.g., OpenAI):
```

Example 2 (unknown):
```unknown
<Note>
  As of `langchain 1.0`, simply passing a schema (e.g., `response_format=ContactInfo`) is no longer supported. You must explicitly use `ToolStrategy` or `ProviderStrategy`.
</Note>

<Tip>
  To learn about structured output, see [Structured output](/oss/python/langchain/structured-output).
</Tip>

### Memory

Agents maintain conversation history automatically through the message state. You can also configure the agent to use a custom state schema to remember additional information during the conversation.

Information stored in the state can be thought of as the [short-term memory](/oss/python/langchain/short-term-memory) of the agent:

Custom state schemas must extend [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) as a `TypedDict`.

There are two ways to define custom state:

1. Via [middleware](/oss/python/langchain/middleware) (preferred)
2. Via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)

#### Defining state via middleware

Use middleware to define custom state when your custom state needs to be accessed by specific middleware hooks and tools attached to said middleware.
```

---

## Context engineering in agents

**URL:** llms-txt#context-engineering-in-agents

**Contents:**
- Overview
  - Why do agents fail?
  - The agent loop
  - What you can control
  - Data sources
  - How it works
- Model Context
  - System Prompt
  - Messages
  - Tools

Source: https://docs.langchain.com/oss/python/langchain/context-engineering

The hard part of building agents (or any LLM application) is making them reliable enough. While they may work for a prototype, they often fail in real-world use cases.

### Why do agents fail?

When agents fail, it's usually because the LLM call inside the agent took the wrong action / didn't do what we expected. LLMs fail for one of two reasons:

1. The underlying LLM is not capable enough
2. The "right" context was not passed to the LLM

More often than not - it's actually the second reason that causes agents to not be reliable.

**Context engineering** is providing the right information and tools in the right format so the LLM can accomplish a task. This is the number one job of AI Engineers. This lack of "right" context is the number one blocker for more reliable agents, and LangChain's agent abstractions are uniquely designed to facilitate context engineering.

<Tip>
  New to context engineering? Start with the [conceptual overview](/oss/python/concepts/context) to understand the different types of context and when to use them.
</Tip>

A typical agent loop consists of two main steps:

1. **Model call** - calls the LLM with a prompt and available tools, returns either a response or a request to execute tools
2. **Tool execution** - executes the tools that the LLM requested, returns tool results

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=ac72e48317a9ced68fd1be64e89ec063" alt="Core agent loop diagram" className="rounded-lg" data-og-width="300" width="300" data-og-height="268" height="268" data-path="oss/images/core_agent_loop.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=280&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=a4c4b766b6678ef52a6ed556b1a0b032 280w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=560&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=111869e6e99a52c0eff60a1ef7ddc49c 560w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=840&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=6c1e21de7b53bd0a29683aca09c6f86e 840w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1100&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=88bef556edba9869b759551c610c60f4 1100w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1650&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=9b0bdd138e9548eeb5056dc0ed2d4a4b 1650w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=2500&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=41eb4f053ed5e6b0ba5bad2badf6d755 2500w" />
</div>

This loop continues until the LLM decides to finish.

### What you can control

To build reliable agents, you need to control what happens at each step of the agent loop, as well as what happens between steps.

| Context Type                                  | What You Control                                                                     | Transient or Persistent |
| --------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------- |
| **[Model Context](#model-context)**           | What goes into model calls (instructions, message history, tools, response format)   | Transient               |
| **[Tool Context](#tool-context)**             | What tools can access and produce (reads/writes to state, store, runtime context)    | Persistent              |
| **[Life-cycle Context](#life-cycle-context)** | What happens between model and tool calls (summarization, guardrails, logging, etc.) | Persistent              |

<CardGroup>
  <Card title="Transient context" icon="bolt" iconType="duotone">
    What the LLM sees for a single call. You can modify messages, tools, or prompts without changing what's saved in state.
  </Card>

<Card title="Persistent context" icon="database" iconType="duotone">
    What gets saved in state across turns. Life-cycle hooks and tool writes modify this permanently.
  </Card>
</CardGroup>

Throughout this process, your agent accesses (reads / writes) different sources of data:

| Data Source         | Also Known As        | Scope               | Examples                                                                   |
| ------------------- | -------------------- | ------------------- | -------------------------------------------------------------------------- |
| **Runtime Context** | Static configuration | Conversation-scoped | User ID, API keys, database connections, permissions, environment settings |
| **State**           | Short-term memory    | Conversation-scoped | Current messages, uploaded files, authentication status, tool results      |
| **Store**           | Long-term memory     | Cross-conversation  | User preferences, extracted insights, memories, historical data            |

LangChain [middleware](/oss/python/langchain/middleware) is the mechanism under the hood that makes context engineering practical for developers using LangChain.

Middleware allows you to hook into any step in the agent lifecycle and:

* Update context
* Jump to a different step in the agent lifecycle

Throughout this guide, you'll see frequent use of the middleware API as a means to the context engineering end.

Control what goes into each model call - instructions, available tools, which model to use, and output format. These decisions directly impact reliability and cost.

<CardGroup cols={2}>
  <Card title="System Prompt" icon="message-lines" href="#system-prompt">
    Base instructions from the developer to the LLM.
  </Card>

<Card title="Messages" icon="comments" href="#messages">
    The full list of messages (conversation history) sent to the LLM.
  </Card>

<Card title="Tools" icon="wrench" href="#tools">
    Utilities the agent has access to to take actions.
  </Card>

<Card title="Model" icon="brain-circuit" href="#model">
    The actual model (including configuration) to be called.
  </Card>

<Card title="Response Format" icon="brackets-curly" href="#response-format">
    Schema specification for the model's final response.
  </Card>
</CardGroup>

All of these types of model context can draw from **state** (short-term memory), **store** (long-term memory), or **runtime context** (static configuration).

The system prompt sets the LLM's behavior and capabilities. Different users, contexts, or conversation stages need different instructions. Successful agents draw on memories, preferences, and configuration to provide the right instructions for the current state of the conversation.

<Tabs>
  <Tab title="State">
    Access message count or conversation context from state:

<Tab title="Store">
    Access user preferences from long-term memory:

<Tab title="Runtime Context">
    Access user ID or configuration from Runtime Context:

Messages make up the prompt that is sent to the LLM.
It's critical to manage the content of messages to ensure that the LLM has the right information to respond well.

<Tabs>
  <Tab title="State">
    Inject uploaded file context from State when relevant to current query:

<Tab title="Store">
    Inject user's email writing style from Store to guide drafting:

<Tab title="Runtime Context">
    Inject compliance rules from Runtime Context based on user's jurisdiction:

<Note>
  **Transient vs Persistent Message Updates:**

The examples above use `wrap_model_call` to make **transient** updates - modifying what messages are sent to the model for a single call without changing what's saved in state.

For **persistent** updates that modify state (like the summarization example in [Life-cycle Context](#summarization)), use life-cycle hooks like `before_model` or `after_model` to permanently update the conversation history. See the [middleware documentation](/oss/python/langchain/middleware) for more details.
</Note>

Tools let the model interact with databases, APIs, and external systems. How you define and select tools directly impacts whether the model can complete tasks effectively.

Each tool needs a clear name, description, argument names, and argument descriptions. These aren't just metadata—they guide the model's reasoning about when and how to use the tool.

Not every tool is appropriate for every situation. Too many tools may overwhelm the model (overload context) and increase errors; too few limit capabilities. Dynamic tool selection adapts the available toolset based on authentication state, user permissions, feature flags, or conversation stage.

<Tabs>
  <Tab title="State">
    Enable advanced tools only after certain conversation milestones:

<Tab title="Store">
    Filter tools based on user preferences or feature flags in Store:

<Tab title="Runtime Context">
    Filter tools based on user permissions from Runtime Context:

See [Dynamically selecting tools](/oss/python/langchain/middleware#dynamically-selecting-tools) for more examples.

Different models have different strengths, costs, and context windows. Select the right model for the task at hand, which
might change during an agent run.

<Tabs>
  <Tab title="State">
    Use different models based on conversation length from State:

<Tab title="Store">
    Use user's preferred model from Store:

<Tab title="Runtime Context">
    Select model based on cost limits or environment from Runtime Context:

See [Dynamic model](/oss/python/langchain/agents#dynamic-model) for more examples.

Structured output transforms unstructured text into validated, structured data. When extracting specific fields or returning data for downstream systems, free-form text isn't sufficient.

**How it works:** When you provide a schema as the response format, the model's final response is guaranteed to conform to that schema. The agent runs the model / tool calling loop until the model is done calling tools, then the final response is coerced into the provided format.

#### Defining formats

Schema definitions guide the model. Field names, types, and descriptions specify exactly what format the output should adhere to.

#### Selecting formats

Dynamic response format selection adapts schemas based on user preferences, conversation stage, or role—returning simple formats early and detailed formats as complexity increases.

<Tabs>
  <Tab title="State">
    Configure structured output based on conversation state:

<Tab title="Store">
    Configure output format based on user preferences in Store:

<Tab title="Runtime Context">
    Configure output format based on Runtime Context like user role or environment:

Tools are special in that they both read and write context.

In the most basic case, when a tool executes, it receives the LLM's request parameters and returns a tool message back. The tool does its work and produces a result.

Tools can also fetch important information for the model that allows it to perform and complete tasks.

Most real-world tools need more than just the LLM's parameters. They need user IDs for database queries, API keys for external services, or current session state to make decisions. Tools read from state, store, and runtime context to access this information.

<Tabs>
  <Tab title="State">
    Read from State to check current session information:

<Tab title="Store">
    Read from Store to access persisted user preferences:

<Tab title="Runtime Context">
    Read from Runtime Context for configuration like API keys and user IDs:

Tool results can be used to help an agent complete a given task. Tools can both return results directly to the model
and update the memory of the agent to make important context available to future steps.

<Tabs>
  <Tab title="State">
    Write to State to track session-specific information using Command:

<Tab title="Store">
    Write to Store to persist data across sessions:

See [Tools](/oss/python/langchain/tools) for comprehensive examples of accessing state, store, and runtime context in tools.

## Life-cycle Context

Control what happens **between** the core agent steps - intercepting data flow to implement cross-cutting concerns like summarization, guardrails, and logging.

As you've seen in [Model Context](#model-context) and [Tool Context](#tool-context), [middleware](/oss/python/langchain/middleware) is the mechanism that makes context engineering practical. Middleware allows you to hook into any step in the agent lifecycle and either:

1. **Update context** - Modify state and store to persist changes, update conversation history, or save insights
2. **Jump in the lifecycle** - Move to different steps in the agent cycle based on context (e.g., skip tool execution if a condition is met, repeat model call with modified context)

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware hooks in the agent loop" className="rounded-lg" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />
</div>

### Example: Summarization

One of the most common life-cycle patterns is automatically condensing conversation history when it gets too long. Unlike the transient message trimming shown in [Model Context](#messages), summarization **persistently updates state** - permanently replacing old messages with a summary that's saved for all future turns.

LangChain offers built-in middleware for this:

When the conversation exceeds the token limit, `SummarizationMiddleware` automatically:

1. Summarizes older messages using a separate LLM call
2. Replaces them with a summary message in State (permanently)
3. Keeps recent messages intact for context

The summarized conversation history is permanently updated - future turns will see the summary instead of the original messages.

<Note>
  For a complete list of built-in middleware, available hooks, and how to create custom middleware, see the [Middleware documentation](/oss/python/langchain/middleware).
</Note>

1. **Start simple** - Begin with static prompts and tools, add dynamics only when needed
2. **Test incrementally** - Add one context engineering feature at a time
3. **Monitor performance** - Track model calls, token usage, and latency
4. **Use built-in middleware** - Leverage [`SummarizationMiddleware`](/oss/python/langchain/middleware#summarization), [`LLMToolSelectorMiddleware`](/oss/python/langchain/middleware#llm-tool-selector), etc.
5. **Document your context strategy** - Make it clear what context is being passed and why
6. **Understand transient vs persistent**: Model context changes are transient (per-call), while life-cycle context changes persist to state

* [Context conceptual overview](/oss/python/concepts/context) - Understand context types and when to use them
* [Middleware](/oss/python/langchain/middleware) - Complete middleware guide
* [Tools](/oss/python/langchain/tools) - Tool creation and context access
* [Memory](/oss/python/concepts/memory) - Short-term and long-term memory patterns
* [Agents](/oss/python/langchain/agents) - Core agent concepts

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/context-engineering.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
</Tab>

  <Tab title="Store">
    Access user preferences from long-term memory:
```

Example 2 (unknown):
```unknown
</Tab>

  <Tab title="Runtime Context">
    Access user ID or configuration from Runtime Context:
```

Example 3 (unknown):
```unknown
</Tab>
</Tabs>

### Messages

Messages make up the prompt that is sent to the LLM.
It's critical to manage the content of messages to ensure that the LLM has the right information to respond well.

<Tabs>
  <Tab title="State">
    Inject uploaded file context from State when relevant to current query:
```

Example 4 (unknown):
```unknown
</Tab>

  <Tab title="Store">
    Inject user's email writing style from Store to guide drafting:
```

---

## Conversational agent uses the router as a tool

**URL:** llms-txt#conversational-agent-uses-the-router-as-a-tool

**Contents:**
  - Full persistence

conversational_agent = create_agent(
    model,
    tools=[search_docs],
    prompt="You are a helpful assistant. Use search_docs to answer questions."
)
```

If you need the router itself to maintain state, use [persistence](/oss/python/langchain/short-term-memory) to store message history. When routing to an agent, fetch previous messages from state and selectively include them in the agent's context—this is a lever for [context engineering](/oss/python/langchain/context-engineering).

<Warning>
  **Stateful routers require custom history management.** If the router switches between agents across turns, conversations may not feel fluid to end users when agents have different tones or prompts. With parallel invocation, you'll need to maintain history at the router level (inputs and synthesized outputs) and leverage this history in routing logic. Consider the [handoffs pattern](/oss/python/langchain/multi-agent/handoffs) or [subagents pattern](/oss/python/langchain/multi-agent/subagents) instead—both provide clearer semantics for multi-turn conversations.
</Warning>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/router.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Cost tracking

**URL:** llms-txt#cost-tracking

**Contents:**
- Viewing costs in the LangSmith UI
  - Token and cost breakdowns
  - Where to view token and cost breakdowns
- Cost tracking
  - LLM calls: Automatically track costs based on token counts
  - LLM calls: Sending costs directly
  - Other runs: Sending costs

Source: https://docs.langchain.com/langsmith/cost-tracking

Building agents at scale introduces non-trivial, usage-based costs that can be difficult to track. LangSmith automatically records LLM token usage and costs for major providers, and also allows you to submit custom cost data for any additional components.

This gives you a single, unified view of costs across your entire application, which makes it easy to monitor, understand, and debug your spend.

* [Viewing costs in the LangSmith UI](#viewing-costs-in-the-langsmith-ui)
* [How cost tracking works](#cost-tracking)
* [How to send custom cost data](#send-custom-cost-data)

## Viewing costs in the LangSmith UI

In the [LangSmith UI](https://smith.langchain.com), you can explore usage and spend in three main ways: first by understanding how tokens and costs are broken down, then by viewing those details within individual traces, and finally by inspecting aggregated metrics in project stats and dashboards.

### Token and cost breakdowns

Token usage and costs are broken down into three categories:

* **Input**: Tokens in the prompt sent to the model. Subtypes include: cache reads, text tokens, image tokens, etc
* **Output**: Tokens generated in the response from the model. Subtypes include: reasoning tokens, text tokens, image tokens, etc
* **Other**: Costs from tool calls, retrieval steps or any custom runs.

You can view detailed breakdowns by hovering over cost sections in the UI. When available, each section is further categorized by subtype.

<img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=49971715854df465e81e53ad6b7b297c" alt="Cost tooltip" data-og-width="894" width="894" data-og-height="400" height="400" data-path="langsmith/images/cost-tooltip-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?w=280&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=0eefe6caadcf4d9a7a93c6c378122476 280w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?w=560&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=24a18c4afc2274abd598238598dfdf7d 560w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?w=840&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=fb04f0d82dbdb3e26a3fd58b4bcdc895 840w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?w=1100&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=6740a97c3545dc0df28415d2d7c67f6e 1100w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?w=1650&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=e7a8c02294dc5dbf08461118e820af11 1650w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-light.png?w=2500&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=d83617c271e7b701794589caa5964ba4 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=a51c9bc7bbd1836231b80d7d5a8db735" alt="Cost tooltip" data-og-width="900" width="900" data-og-height="394" height="394" data-path="langsmith/images/cost-tooltip-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?w=280&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=55e6e557896671cf177be070b53853ca 280w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?w=560&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=5aacd2afe8bb68d48f1b8718b04b337e 560w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?w=840&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=b18555fd40e07821742940bcf23776f4 840w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?w=1100&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=f5ba1370e3dd595cfc0af949ffe454f4 1100w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?w=1650&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=f25ef24cc27cc01c3da8e76f402aeb12 1650w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tooltip-dark.png?w=2500&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=0a1d6251fbab47105ca63b4dfe6ef809 2500w" />

You can inspect these breakdowns throughout the LangSmith UI, described in the following section.

### Where to view token and cost breakdowns

<AccordionGroup>
  <Accordion title="In the trace tree">
    The trace tree shows the most detailed view of token usage and cost (for a single trace).  It displays the total usage for the entire trace, aggregated values for each parent run and token and cost breakdowns for each child run.

Open any run inside a tracing project to view its trace tree.

<img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=a25bf30084d96292ba00ca84c07653d6" alt="Cost tooltip" data-og-width="2062" width="2062" data-og-height="1530" height="1530" data-path="langsmith/images/trace-tree-costs-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?w=280&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=e8a79cea1a5bb04adcbf1ee0e62533e7 280w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?w=560&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=3af7a8b874fcd58778412d260f1ab586 560w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?w=840&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=4697febea4d4ece0924f34dc87ddba8f 840w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?w=1100&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=5b306c9a32e9ce77bc2f92eaac315c2e 1100w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?w=1650&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=d5145faa36dd98b6f0442cb0bfaa4fa7 1650w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-light.png?w=2500&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=238b220a634d50adcf0a2754c167cee6 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=e2037cd8309e754f8753278d334c8344" alt="Cost tooltip" data-og-width="2052" width="2052" data-og-height="1490" height="1490" data-path="langsmith/images/trace-tree-costs-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?w=280&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=9f273466040d5f3178a1f32903b23578 280w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?w=560&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=4848270e7454f48070aa7a3585d9cafa 560w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?w=840&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=da0f8036b96015eb75b8721dc0c10425 840w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?w=1100&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=4ee69aee2b0dfae76923f09528a10977 1100w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?w=1650&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=0fc6303cc3c060aa35db962d6cfcb211 1650w, https://mintcdn.com/langchain-5e9cc07a/GpRpLUps9-PFSAXx/langsmith/images/trace-tree-costs-dark.png?w=2500&fit=max&auto=format&n=GpRpLUps9-PFSAXx&q=85&s=3e9abf61bc4da61f930fd923bec0bcfb 2500w" />
  </Accordion>

<Accordion title="In project stats">
    The project stats panel shows the total token usage and cost for all traces in a project.

<img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=c9168cc335b0d9ccdde0ebe6ab1abd91" alt="Cost tracking chart" data-og-width="1257" width="1257" data-og-height="544" height="544" data-path="langsmith/images/stats-pane-cost-tracking-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?w=280&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=72360ffba7901bae6a32dccffbc8098a 280w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?w=560&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=9876ac6aa567436835c169cd416320ce 560w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?w=840&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=fb2ac554cae4b7634d73872df0be735d 840w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?w=1100&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=44027849f87a5644bc0c791be2c21ffe 1100w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?w=1650&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=e9a7ea651c412dd20cea34c7b91e15e4 1650w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-light.png?w=2500&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=b35b55da99133863bb1bf80c57b15fc7 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=e0be66ec244c134421af0475f83c3b1d" alt="Cost tracking chart" data-og-width="1253" width="1253" data-og-height="546" height="546" data-path="langsmith/images/stats-pane-cost-tracking-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?w=280&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=a87ee7f1da026cd212eadda5616c9e76 280w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?w=560&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=506dae4c2035c37fd846b4b96575130e 560w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?w=840&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=0883314216050e125bb733953b506a4e 840w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?w=1100&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=1781f3039d06b932a126d403b5060f99 1100w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?w=1650&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=6a2ebfeeb609516d33eec4affe08af2d 1650w, https://mintcdn.com/langchain-5e9cc07a/yIWcej3jR6iH0nDR/langsmith/images/stats-pane-cost-tracking-dark.png?w=2500&fit=max&auto=format&n=yIWcej3jR6iH0nDR&q=85&s=f9490ee9b5dc79060f6ef8cb072a2c73 2500w" />
  </Accordion>

<Accordion title="In dashboards">
    Dashboards help you explore cost and token usage trends over time. The [prebuilt dashboard](/langsmith/dashboards/#prebuilt-dashboards) for a tracing project shows total costs and a cost breakdown by input and output tokens.

You may also configure custom cost tracking charts in [custom dashboards](https://docs.langchain.com/langsmith/dashboards#custom-dashboards).

<img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=18b74d9ee26db0fe17877b3dc3c2c120" alt="Cost tracking chart" data-og-width="1206" width="1206" data-og-height="866" height="866" data-path="langsmith/images/cost-tracking-chart-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?w=280&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=1f8119ffc4dbe3647884e83b9e600b2a 280w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?w=560&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=35fc237732844199920fe48c16c06c68 560w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?w=840&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=2697b4965b63dfaebdff1604fb509abd 840w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?w=1100&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=19a096bc55c074465060e6d7f1c0a5b3 1100w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?w=1650&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=0d524ec464b630a04312873f3847887a 1650w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-light.png?w=2500&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=d27dcf301e56083dfefb5d1f1b06baa6 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=134115cab7e741a5b7f6d784f9d51b76" alt="Cost tracking chart" data-og-width="1202" width="1202" data-og-height="920" height="920" data-path="langsmith/images/cost-tracking-chart-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?w=280&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=ad9e895cdf72d959bce04ec03321a78f 280w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?w=560&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=e8c0d349174089891b2cd20d13be7d41 560w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?w=840&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=a0cc08bf1d4aaff36f11f906c6b19729 840w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?w=1100&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=268a4acd73f13045ff8de90733a50cde 1100w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?w=1650&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=21c6c9d062c67e9f6900ac3deb7825d2 1650w, https://mintcdn.com/langchain-5e9cc07a/S029Harmw-iSrSVw/langsmith/images/cost-tracking-chart-dark.png?w=2500&fit=max&auto=format&n=S029Harmw-iSrSVw&q=85&s=ac2d88cf00ccf7daf7d367433bbf6d62 2500w" />
  </Accordion>
</AccordionGroup>

You can track costs in two ways:

1. Costs for LLM calls can be **automatically derived from token counts and model prices**
2. Cost for LLM calls or any other run type can be **manually specified as part of the run data**

The approach you use will depend on on what you're tracking and how your model pricing is structured:

| Method            | Run type: LLM                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Run type: Other                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Automatically** | <ul><li>Calling LLMs with [LangChain](/oss/python/langchain/overview)</li><li>Tracing LLM calls to OpenAI, Anthropic or models that follow an OpenAI-compliant format with `@traceable`</li><li> Using LangSmith wrappers for [OpenAI](/langsmith/trace-openai) or [Anthropic](/langsmith/trace-anthropic)</li><li>For other model providers, read the [token and cost information guide](/langsmith/log-llm-trace#provide-token-and-cost-information)</li></ul> | Not applicable.                                                |
| **Manually**      | If LLM call costs are non-linear (eg. follow a custom cost function)                                                                                                                                                                                                                                                                                                                                                                                             | Send costs for any run types, e.g. tool calls, retrieval steps |

### LLM calls: Automatically track costs based on token counts

To compute cost automatically from token usage, you need to provide **token counts**, the **model and provider** and the **model price**.

<Note>
  Follow the instructions below if you’re using model providers whose responses don’t follow the same patterns as one of OpenAI or Anthropic.

These steps are **only required** if you are *not*:

* Calling LLMs with [LangChain](/oss/python/langchain/overview)
  * Using `@traceable` to trace LLM calls to OpenAI, Anthropic or models that follow an OpenAI-compliant format
  * Using LangSmith wrappers for [OpenAI](/langsmith/trace-openai) or [Anthropic](/langsmith/trace-anthropic).
</Note>

**1. Send token counts**

Many models include token counts as part of the response. You must extract this information and include it in your run using one of the following methods:

<Accordion title="A. Set a `usage_metadata` field on the run’s metadata">
  Set a `usage_metadata` field on the run's metadata. The advantage of this approach is that you do not need to change your traced function’s runtime outputs

</CodeGroup>
</Accordion>

<Accordion title="B. Return a `usage_metadata` field in your traced function's outputs.">
  Include the `usage_metadata` key directly within the object returned by your traced function. LangSmith will extract it from the output.

</CodeGroup>
</Accordion>

In either case, the usage metadata should contain a subset of the following LangSmith-recognized fields:

<Accordion title="Usage Metadata Schema and Cost Calculation">
  The following fields in the `usage_metadata` dict are recognized by LangSmith. You can view the full [Python types](https://github.com/langchain-ai/langsmith-sdk/blob/e705fbd362be69dd70229f94bc09651ef8056a61/python/langsmith/schemas.py#L1196-L1227) or [TypeScript interfaces](https://github.com/langchain-ai/langsmith-sdk/blob/e705fbd362be69dd70229f94bc09651ef8056a61/js/src/schemas.ts#L637-L689) directly.

<ParamField path="input_tokens" type="number">
    Number of tokens used in the model input. Sum of all input token types.
  </ParamField>

<ParamField path="output_tokens" type="number">
    Number of tokens used in the model response. Sum of all output token types.
  </ParamField>

<ParamField path="total_tokens" type="number">
    Number of tokens used in the input and output. Optional, can be inferred. Sum of input\_tokens + output\_tokens.
  </ParamField>

<ParamField path="input_token_details" type="object">
    Breakdown of input token types. Keys are token-type strings, values are counts. Example `{"cache_read": 5}`.

Known fields include: `audio`, `text`, `image`, `cache_read`, `cache_creation`. Additional fields are possible depending on the model or provider.
  </ParamField>

<ParamField path="output_token_details" type="object">
    Breakdown of output token types. Keys are token-type strings, values are counts. Example `{"reasoning": 5}`.

Known fields include: `audio`, `text`, `image`, `reasoning`. Additional fields are possible depending on the model or provider.
  </ParamField>

<ParamField path="input_cost" type="number">
    Cost of the input tokens.
  </ParamField>

<ParamField path="output_cost" type="number">
    Cost of the output tokens.
  </ParamField>

<ParamField path="total_cost" type="number">
    Cost of the tokens. Optional, can be inferred.  Sum of input\_cost + output\_cost.
  </ParamField>

<ParamField path="input_cost_details" type="object">
    Details of the input cost. Keys are token-type strings, values are cost amounts.
  </ParamField>

<ParamField path="output_cost_details" type="object">
    Details of the output cost. Keys are token-type strings, values are cost amounts.
  </ParamField>

**Cost Calculations**

The cost for a run is computed greedily from most-to-least specific token type. Suppose you set a price of \$2 per 1M input tokens with a detailed price of \$1 per 1M `cache_read` input tokens, and \$3 per 1M output tokens. If you uploaded the following usage metadata:

Then, the token costs would be computed as follows:

**2. Specify model name**

When using a custom model, the following fields need to be specified in a [run's metadata](/langsmith/add-metadata-tags) in order to associate token counts with costs. It's also helpful to provide these metadata fields to identify the model when viewing traces and when filtering.

* `ls_provider`: The provider of the model, e.g., “openai”, “anthropic”
* `ls_model_name`: The name of the model, e.g., “gpt-4o-mini”, “claude-3-opus-20240229”

**3. Set model prices**

A model pricing map is used to map model names to their per-token prices to compute costs from token counts. LangSmith's [model pricing table](https://smith.langchain.com/settings/workspaces/models) is used for this.

<Note>
  The table comes with pricing information for most OpenAI, Anthropic, and Gemini models. You can [add prices for other models](/langsmith/cost-tracking#create-a-new-model-price-entry), or [overwrite pricing for default models](/langsmith/cost-tracking#update-an-existing-model-price-entry) if you have custom pricing.
</Note>

For models that have different pricing for different token types (e.g., multimodal or cached tokens), you can specify a breakdown of prices for each token type. Hovering over the `...` next to the input/output prices shows you the price breakdown by token type.

<img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=ae82f1ff59cfc57923d63869cb0608c0" alt="Model price map" data-og-width="1256" width="1256" data-og-height="494" height="494" data-path="langsmith/images/model-price-map-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?w=280&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=ed5d4889252f7a890b8b86705a07aa31 280w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?w=560&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=5a801e45f2f628bbb5565b240a1060a3 560w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?w=840&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=5c43622f4b5259a41b911c1a1a686d1e 840w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?w=1100&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=73bfe48bbbc86df27b3c2705eb3ec850 1100w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?w=1650&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=a37f360aa7b50e29e984daf69a969be5 1650w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-light.png?w=2500&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=81a6f4ce7a883d757bd35d80ed950de4 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=739bb0123e9a238944452048578a4c49" alt="Model price map" data-og-width="1265" width="1265" data-og-height="486" height="486" data-path="langsmith/images/model-price-map-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?w=280&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=3ef5d46c55b6d2a5a697bec31a908db4 280w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?w=560&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=92cdeb0a4009cd7fb8f942ba28242571 560w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?w=840&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=96100a58c8821063940522dd24758305 840w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?w=1100&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=6e1e6a811ff7a28cf316b712deb62cd9 1100w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?w=1650&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=61748722943b6fb76b5a45af10caabbc 1650w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/model-price-map-dark.png?w=2500&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=badfe7dda009e8c5ec675228331b3ed9 2500w" />

<Note>
  Updates to the model pricing map are not reflected in the costs for traces already logged. We do not currently support backfilling model pricing changes.
</Note>

<Accordion title="Create a new or modify an existing model price entry">
  To modify the default model prices, create a new entry with the same model, provider and match pattern as the default entry.

To create a *new entry* in the model pricing map, click on the `+ Model` button in the top right corner.

<img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=63dbd6e59b279a1f4ae692c892223af9" alt="New price map entry interface" data-og-width="467" width="467" data-og-height="854" height="854" data-path="langsmith/images/new-price-map-entry-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?w=280&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=0553163c010622eeb61af856cc6c41c4 280w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?w=560&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=95cb41aa3695ea32e701f6a620cb778e 560w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?w=840&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=37c244bfcfbf969a717dac9b7a01c58f 840w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?w=1100&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=ca82285f5323216bb59b1be9b6cf1a2e 1100w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?w=1650&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=a92a5257db7e1323b3301e5ed1aef7b0 1650w, https://mintcdn.com/langchain-5e9cc07a/PYCacG42leg3Zt_8/langsmith/images/new-price-map-entry-light.png?w=2500&fit=max&auto=format&n=PYCacG42leg3Zt_8&q=85&s=537332d988ad5b674bf5e5bd1f5584cc 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=2df87e349db00b8560f3d44824f2df13" alt="New price map entry interface" data-og-width="958" width="958" data-og-height="1762" height="1762" data-path="langsmith/images/new-price-map-entry.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?w=280&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=4c49d72012424c80dc831b7f19125206 280w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?w=560&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=ce3f75b14759e43c35723726933177a8 560w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?w=840&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=2fb82f3bc83ee9dcecfad5243edb0844 840w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?w=1100&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=57aebbd5b56a0ccbf91a664f7e930bef 1100w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?w=1650&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=fbd6624fff7cf22139e022491e3188c3 1650w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/new-price-map-entry.png?w=2500&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=9ced4164e44f666c9e3dba0a9be9a188 2500w" />

Here, you can specify the following fields:

* **Model Name**: The human-readable name of the model.
  * **Input Price**: The cost per 1M input tokens for the model. This number is multiplied by the number of tokens in the prompt to calculate the prompt cost.
  * **Input Price Breakdown** (Optional): The breakdown of price for each different type of input token, e.g. `cache_read`, `video`, `audio`
  * **Output Price**: The cost per 1M output tokens for the model. This number is multiplied by the number of tokens in the completion to calculate the completion cost.
  * **Output Price Breakdown** (Optional): The breakdown of price for each different type of output token, e.g. `reasoning`, `image`, etc.
  * **Model Activation Date** (Optional): The date from which the pricing is applicable. Only runs after this date will apply this model price.
  * **Match Pattern**: A regex pattern to match the model name. This is used to match the value for `ls_model_name` in the run metadata.
  * **Provider** (Optional): The provider of the model. If specified, this is matched against `ls_provider` in the run metadata.

Once you have set up the model pricing map, LangSmith will automatically calculate and aggregate the token-based costs for traces based on the token counts provided in the LLM invocations.
</Accordion>

### LLM calls: Sending costs directly

If your model follows a non-linear pricing scheme, we recommend calculating costs client-side and sending them to LangSmith as `usage_metadata`.

<Note>
  Gemini 3 Pro Preview and Gemini 2.5 Pro follow a pricing scheme with a stepwise cost function. We support this pricing scheme for Gemini by default. For any other models with non-linear pricing, you will need to follow these instructions to calculate costs.
</Note>

### Other runs: Sending costs

You can also send cost information for any non-LLM runs, such as tool calls.The cost must be specified in the `total_cost` field under the runs `usage_metadata`.

<Accordion title="A. Set a `total_cost` field on the run’s usage_metadata">
  Set a `total_cost` field on the run’s `usage_metadata`. The advantage of this approach is that you do not need to change your traced function’s runtime outputs

</CodeGroup>
</Accordion>

<Accordion title="B. Return a `total_cost` field in your traced function's outputs.">
  Include the `usage_metadata` key directly within the object returned by your traced function. LangSmith will extract it from the output.

</CodeGroup>
</Accordion>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/cost-tracking.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>
</Accordion>

<Accordion title="B. Return a `usage_metadata` field in your traced function's outputs.">
  Include the `usage_metadata` key directly within the object returned by your traced function. LangSmith will extract it from the output.

  <CodeGroup>
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>
</Accordion>

In either case, the usage metadata should contain a subset of the following LangSmith-recognized fields:

<Accordion title="Usage Metadata Schema and Cost Calculation">
  The following fields in the `usage_metadata` dict are recognized by LangSmith. You can view the full [Python types](https://github.com/langchain-ai/langsmith-sdk/blob/e705fbd362be69dd70229f94bc09651ef8056a61/python/langsmith/schemas.py#L1196-L1227) or [TypeScript interfaces](https://github.com/langchain-ai/langsmith-sdk/blob/e705fbd362be69dd70229f94bc09651ef8056a61/js/src/schemas.ts#L637-L689) directly.

  <ParamField path="input_tokens" type="number">
    Number of tokens used in the model input. Sum of all input token types.
  </ParamField>

  <ParamField path="output_tokens" type="number">
    Number of tokens used in the model response. Sum of all output token types.
  </ParamField>

  <ParamField path="total_tokens" type="number">
    Number of tokens used in the input and output. Optional, can be inferred. Sum of input\_tokens + output\_tokens.
  </ParamField>

  <ParamField path="input_token_details" type="object">
    Breakdown of input token types. Keys are token-type strings, values are counts. Example `{"cache_read": 5}`.

    Known fields include: `audio`, `text`, `image`, `cache_read`, `cache_creation`. Additional fields are possible depending on the model or provider.
  </ParamField>

  <ParamField path="output_token_details" type="object">
    Breakdown of output token types. Keys are token-type strings, values are counts. Example `{"reasoning": 5}`.

    Known fields include: `audio`, `text`, `image`, `reasoning`. Additional fields are possible depending on the model or provider.
  </ParamField>

  <ParamField path="input_cost" type="number">
    Cost of the input tokens.
  </ParamField>

  <ParamField path="output_cost" type="number">
    Cost of the output tokens.
  </ParamField>

  <ParamField path="total_cost" type="number">
    Cost of the tokens. Optional, can be inferred.  Sum of input\_cost + output\_cost.
  </ParamField>

  <ParamField path="input_cost_details" type="object">
    Details of the input cost. Keys are token-type strings, values are cost amounts.
  </ParamField>

  <ParamField path="output_cost_details" type="object">
    Details of the output cost. Keys are token-type strings, values are cost amounts.
  </ParamField>

  **Cost Calculations**

  The cost for a run is computed greedily from most-to-least specific token type. Suppose you set a price of \$2 per 1M input tokens with a detailed price of \$1 per 1M `cache_read` input tokens, and \$3 per 1M output tokens. If you uploaded the following usage metadata:
```

---

## Create agent with tools and memory

**URL:** llms-txt#create-agent-with-tools-and-memory

**Contents:**
- 3. Text-to-speech
  - Key Concepts
  - Implementation
- Putting It All Together

agent = create_agent(
    model="anthropic:claude-haiku-4-5",  # Select your model
    tools=[add_to_order, confirm_order],
    system_prompt="""You are a helpful sandwich shop assistant.
    Your goal is to take the user's order. Be concise and friendly.
    Do NOT use emojis, special characters, or markdown.
    Your responses will be read by a text-to-speech engine.""",
    checkpointer=InMemorySaver(),
)

async def agent_stream(
    event_stream: AsyncIterator[VoiceAgentEvent],
) -> AsyncIterator[VoiceAgentEvent]:
    """
    Transform stream: Voice Events → Voice Events (with Agent Responses)

Passes through all upstream events and adds agent_chunk events
    when processing STT transcripts.
    """
    # Generate unique thread ID for conversation memory
    thread_id = str(uuid4())

async for event in event_stream:
        # Pass through all upstream events
        yield event

# Process final transcripts through the agent
        if event.type == "stt_output":
            # Stream agent response with conversation context
            stream = agent.astream(
                {"messages": [HumanMessage(content=event.transcript)]},
                {"configurable": {"thread_id": thread_id}},
                stream_mode="messages",
            )

# Yield agent response chunks as they arrive
            async for message, _ in stream:
                if message.text:
                    yield AgentChunkEvent.create(message.text)
python  theme={null}
from cartesia_tts import CartesiaTTS
from utils import merge_async_iters

async def tts_stream(
    event_stream: AsyncIterator[VoiceAgentEvent],
) -> AsyncIterator[VoiceAgentEvent]:
    """
    Transform stream: Voice Events → Voice Events (with Audio)

Merges two concurrent streams:
    1. process_upstream(): passes through events and sends text to Cartesia
    2. tts.receive_events(): yields audio chunks from Cartesia
    """
    tts = CartesiaTTS()

async def process_upstream() -> AsyncIterator[VoiceAgentEvent]:
        """Process upstream events and send agent text to Cartesia."""
        async for event in event_stream:
            # Pass through all events
            yield event
            # Send agent text to Cartesia for synthesis
            if event.type == "agent_chunk":
                await tts.send_text(event.text)

try:
        # Merge upstream events with TTS audio events
        # Both streams run concurrently
        async for event in merge_async_iters(
            process_upstream(),
            tts.receive_events()
        ):
            yield event
    finally:
        await tts.close()
python  theme={null}
  import base64
  import json
  import websockets

class CartesiaTTS:
      def __init__(
          self,
          api_key: Optional[str] = None,
          voice_id: str = "f6ff7c0c-e396-40a9-a70b-f7607edb6937",
          model_id: str = "sonic-3",
          sample_rate: int = 24000,
          encoding: str = "pcm_s16le",
      ):
          self.api_key = api_key or os.getenv("CARTESIA_API_KEY")
          self.voice_id = voice_id
          self.model_id = model_id
          self.sample_rate = sample_rate
          self.encoding = encoding
          self._ws: WebSocketClientProtocol | None = None

def _generate_context_id(self) -> str:
          """Generate a valid context_id for Cartesia."""
          timestamp = int(time.time() * 1000)
          counter = self._context_counter
          self._context_counter += 1
          return f"ctx_{timestamp}_{counter}"

async def send_text(self, text: str | None) -> None:
          """Send text to Cartesia for synthesis."""
          if not text or not text.strip():
              return

ws = await self._ensure_connection()
          payload = {
              "model_id": self.model_id,
              "transcript": text,
              "voice": {
                  "mode": "id",
                  "id": self.voice_id,
              },
              "output_format": {
                  "container": "raw",
                  "encoding": self.encoding,
                  "sample_rate": self.sample_rate,
              },
              "language": self.language,
              "context_id": self._generate_context_id(),
          }
          await ws.send(json.dumps(payload))

async def receive_events(self) -> AsyncIterator[TTSChunkEvent]:
          """Yield audio chunks as they arrive from Cartesia."""
          async for raw_message in self._ws:
              message = json.loads(raw_message)

# Decode and yield audio chunks
              if "data" in message and message["data"]:
                  audio_chunk = base64.b64decode(message["data"])
                  if audio_chunk:
                      yield TTSChunkEvent.create(audio_chunk)

async def _ensure_connection(self) -> WebSocketClientProtocol:
          """Establish WebSocket connection if not already connected."""
          if self._ws is None:
              url = (
                  f"wss://api.cartesia.ai/tts/websocket"
                  f"?api_key={self.api_key}&cartesia_version={self.cartesia_version}"
              )
              self._ws = await websockets.connect(url)

return self._ws
  python  theme={null}
from langchain_core.runnables import RunnableGenerator

pipeline = (
    RunnableGenerator(stt_stream)      # Audio → STT events
    | RunnableGenerator(agent_stream)  # STT events → Agent events
    | RunnableGenerator(tts_stream)    # Agent events → TTS audio
)

**Examples:**

Example 1 (unknown):
```unknown
## 3. Text-to-speech

The TTS stage synthesizes agent response text into audio and streams it back to the client. Like the STT stage, it uses a producer-consumer pattern to handle concurrent text sending and audio reception.

### Key Concepts

**Concurrent Processing**: The implementation merges two async streams:

* **Upstream processing**: Passes through all events and sends agent text chunks to the TTS provider
* **Audio reception**: Receives synthesized audio chunks from the TTS provider

**Streaming TTS**: Some providers (such as [Cartesia](https://cartesia.ai/)) begin synthesizing audio as soon as it receives text, enabling audio playback to start before the agent finishes generating its complete response.

**Event Passthrough**: All upstream events flow through unchanged, allowing the client or other observers to track the full pipeline state.

### Implementation
```

Example 2 (unknown):
```unknown
The application implements an Cartesia client to manage the WebSocket connection and audio streaming. See below for implementations; similar adapters can be constructed for other TTS providers.

<Accordion title="Cartesia Client">
```

Example 3 (unknown):
```unknown
</Accordion>

## Putting It All Together

The complete pipeline chains the three stages together:
```

---

## Create and run an agent

**URL:** llms-txt#create-and-run-an-agent

**Contents:**
- Advanced usage
  - Custom metadata and tags
  - Combine with other instrumentors

agent = Agent('openai:gpt-4o')
result = agent.run_sync('What is the capital of France?')
print(result.output)
#> Paris
python  theme={null}
from opentelemetry import trace
from pydantic_ai import Agent
from langsmith.integrations.otel import configure

configure(project_name="pydantic-ai-metadata")
Agent.instrument_all()

tracer = trace.get_tracer(__name__)

agent = Agent('openai:gpt-4o')

with tracer.start_as_current_span("pydantic_ai_workflow") as span:
    span.set_attribute("langsmith.metadata.user_id", "user_123")
    span.set_attribute("langsmith.metadata.workflow_type", "question_answering")
    span.set_attribute("langsmith.span.tags", "pydantic-ai,production")

result = agent.run_sync('Explain quantum computing in simple terms')
    print(result.output)
python  theme={null}
from langsmith.integrations.otel import configure
from pydantic_ai import Agent
from openinference.instrumentation.openai import OpenAIInstrumentor

**Examples:**

Example 1 (unknown):
```unknown
## Advanced usage

### Custom metadata and tags

You can add custom metadata to your traces using OpenTelemetry span attributes:
```

Example 2 (unknown):
```unknown
### Combine with other instrumentors

You can combine PydanticAI instrumentation with other OpenTelemetry instrumentors:
```

---

## Create and run a LangChain application

**URL:** llms-txt#create-and-run-a-langchain-application

**Contents:**
- Supported OpenTelemetry attribute and event mapping
  - Core LangSmith attributes
  - GenAI standard attributes
  - GenAI request parameters
  - GenAI usage metrics
  - TraceLoop attributes
  - OpenInference attributes
  - LLM attributes
  - Prompt template attributes
  - Retriever attributes

prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
model = ChatOpenAI()
chain = prompt | model
result = chain.invoke({"topic": "programming"})
print(result.content)
python  theme={null}
import asyncio
from langsmith.integrations.otel import configure
from google.adk import Runner
from google.adk.agents import LlmAgent
from google.adk.sessions import InMemorySessionService
from google.genai import types

**Examples:**

Example 1 (unknown):
```unknown
<Info>
  Hybrid tracing is available in version **≥ 0.4.1**. To send traces **only** to your OTEL endpoint, set:

  `LANGSMITH_OTEL_ONLY="true"`
  (Recommendation: use **langsmith ≥ 0.4.25**.)
</Info>

## Supported OpenTelemetry attribute and event mapping

When sending traces to LangSmith via OpenTelemetry, the following attributes are mapped to LangSmith fields:

### Core LangSmith attributes

| OpenTelemetry attribute        | LangSmith field  | Notes                                                                        |
| ------------------------------ | ---------------- | ---------------------------------------------------------------------------- |
| `langsmith.trace.name`         | Run name         | Overrides the span name for the run                                          |
| `langsmith.span.kind`          | Run type         | Values: `llm`, `chain`, `tool`, `retriever`, `embedding`, `prompt`, `parser` |
| `langsmith.trace.session_id`   | Session ID       | Session identifier for related traces                                        |
| `langsmith.trace.session_name` | Session name     | Name of the session                                                          |
| `langsmith.span.tags`          | Tags             | Custom tags attached to the span (comma-separated)                           |
| `langsmith.metadata.{key}`     | `metadata.{key}` | Custom metadata with langsmith prefix                                        |

### GenAI standard attributes

| OpenTelemetry attribute                 | LangSmith field               | Notes                                                         |
| --------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| `gen_ai.system`                         | `metadata.ls_provider`        | The GenAI system (e.g., "openai", "anthropic")                |
| `gen_ai.operation.name`                 | Run type                      | Maps "chat"/"completion" to "llm", "embedding" to "embedding" |
| `gen_ai.prompt`                         | `inputs`                      | The input prompt sent to the model                            |
| `gen_ai.completion`                     | `outputs`                     | The output generated by the model                             |
| `gen_ai.prompt.{n}.role`                | `inputs.messages[n].role`     | Role for the nth input message                                |
| `gen_ai.prompt.{n}.content`             | `inputs.messages[n].content`  | Content for the nth input message                             |
| `gen_ai.prompt.{n}.message.role`        | `inputs.messages[n].role`     | Alternative format for role                                   |
| `gen_ai.prompt.{n}.message.content`     | `inputs.messages[n].content`  | Alternative format for content                                |
| `gen_ai.completion.{n}.role`            | `outputs.messages[n].role`    | Role for the nth output message                               |
| `gen_ai.completion.{n}.content`         | `outputs.messages[n].content` | Content for the nth output message                            |
| `gen_ai.completion.{n}.message.role`    | `outputs.messages[n].role`    | Alternative format for role                                   |
| `gen_ai.completion.{n}.message.content` | `outputs.messages[n].content` | Alternative format for content                                |
| `gen_ai.input.messages`                 | `inputs.messages`             | Array of input messages                                       |
| `gen_ai.output.messages`                | `outputs.messages`            | Array of output messages                                      |
| `gen_ai.tool.name`                      | `invocation_params.tool_name` | Tool name, also sets run type to "tool"                       |

### GenAI request parameters

| OpenTelemetry attribute            | LangSmith field                       | Notes                                   |
| ---------------------------------- | ------------------------------------- | --------------------------------------- |
| `gen_ai.request.model`             | `invocation_params.model`             | The model name used for the request     |
| `gen_ai.response.model`            | `invocation_params.model`             | The model name returned in the response |
| `gen_ai.request.temperature`       | `invocation_params.temperature`       | Temperature setting                     |
| `gen_ai.request.top_p`             | `invocation_params.top_p`             | Top-p sampling setting                  |
| `gen_ai.request.max_tokens`        | `invocation_params.max_tokens`        | Maximum tokens setting                  |
| `gen_ai.request.frequency_penalty` | `invocation_params.frequency_penalty` | Frequency penalty setting               |
| `gen_ai.request.presence_penalty`  | `invocation_params.presence_penalty`  | Presence penalty setting                |
| `gen_ai.request.seed`              | `invocation_params.seed`              | Random seed used for generation         |
| `gen_ai.request.stop_sequences`    | `invocation_params.stop`              | Sequences that stop generation          |
| `gen_ai.request.top_k`             | `invocation_params.top_k`             | Top-k sampling parameter                |
| `gen_ai.request.encoding_formats`  | `invocation_params.encoding_formats`  | Output encoding formats                 |

### GenAI usage metrics

| OpenTelemetry attribute                 | LangSmith field                   | Notes                                     |
| --------------------------------------- | --------------------------------- | ----------------------------------------- |
| `gen_ai.usage.input_tokens`             | `usage_metadata.input_tokens`     | Number of input tokens used               |
| `gen_ai.usage.output_tokens`            | `usage_metadata.output_tokens`    | Number of output tokens used              |
| `gen_ai.usage.total_tokens`             | `usage_metadata.total_tokens`     | Total number of tokens used               |
| `gen_ai.usage.prompt_tokens`            | `usage_metadata.input_tokens`     | Number of input tokens used (deprecated)  |
| `gen_ai.usage.completion_tokens`        | `usage_metadata.output_tokens`    | Number of output tokens used (deprecated) |
| `gen_ai.usage.details.reasoning_tokens` | `usage_metadata.reasoning_tokens` | Number of reasoning tokens used           |

### TraceLoop attributes

| OpenTelemetry attribute                  | LangSmith field  | Notes                                            |
| ---------------------------------------- | ---------------- | ------------------------------------------------ |
| `traceloop.entity.input`                 | `inputs`         | Full input value from TraceLoop                  |
| `traceloop.entity.output`                | `outputs`        | Full output value from TraceLoop                 |
| `traceloop.entity.name`                  | Run name         | Entity name from TraceLoop                       |
| `traceloop.span.kind`                    | Run type         | Maps to LangSmith run types                      |
| `traceloop.llm.request.type`             | Run type         | "embedding" maps to "embedding", others to "llm" |
| `traceloop.association.properties.{key}` | `metadata.{key}` | Custom metadata with traceloop prefix            |

### OpenInference attributes

| OpenTelemetry attribute   | LangSmith field          | Notes                                     |
| ------------------------- | ------------------------ | ----------------------------------------- |
| `input.value`             | `inputs`                 | Full input value, can be string or JSON   |
| `output.value`            | `outputs`                | Full output value, can be string or JSON  |
| `openinference.span.kind` | Run type                 | Maps various kinds to LangSmith run types |
| `llm.system`              | `metadata.ls_provider`   | LLM system provider                       |
| `llm.model_name`          | `metadata.ls_model_name` | Model name from OpenInference             |
| `tool.name`               | Run name                 | Tool name when span kind is "TOOL"        |
| `metadata`                | `metadata.*`             | JSON string of metadata to be merged      |

### LLM attributes

| OpenTelemetry attribute      | LangSmith field                       | Notes                                |
| ---------------------------- | ------------------------------------- | ------------------------------------ |
| `llm.input_messages`         | `inputs.messages`                     | Input messages                       |
| `llm.output_messages`        | `outputs.messages`                    | Output messages                      |
| `llm.token_count.prompt`     | `usage_metadata.input_tokens`         | Prompt token count                   |
| `llm.token_count.completion` | `usage_metadata.output_tokens`        | Completion token count               |
| `llm.token_count.total`      | `usage_metadata.total_tokens`         | Total token count                    |
| `llm.usage.total_tokens`     | `usage_metadata.total_tokens`         | Alternative total token count        |
| `llm.invocation_parameters`  | `invocation_params.*`                 | JSON string of invocation parameters |
| `llm.presence_penalty`       | `invocation_params.presence_penalty`  | Presence penalty                     |
| `llm.frequency_penalty`      | `invocation_params.frequency_penalty` | Frequency penalty                    |
| `llm.request.functions`      | `invocation_params.functions`         | Function definitions                 |

### Prompt template attributes

| OpenTelemetry attribute         | LangSmith field | Notes                                            |
| ------------------------------- | --------------- | ------------------------------------------------ |
| `llm.prompt_template.variables` | Run type        | Sets run type to "prompt", used with input.value |

### Retriever attributes

| OpenTelemetry attribute                     | LangSmith field                     | Notes                                         |
| ------------------------------------------- | ----------------------------------- | --------------------------------------------- |
| `retrieval.documents.{n}.document.content`  | `outputs.documents[n].page_content` | Content of the nth retrieved document         |
| `retrieval.documents.{n}.document.metadata` | `outputs.documents[n].metadata`     | Metadata of the nth retrieved document (JSON) |

### Tool attributes

| OpenTelemetry attribute | LangSmith field                    | Notes                                     |
| ----------------------- | ---------------------------------- | ----------------------------------------- |
| `tools`                 | `invocation_params.tools`          | Array of tool definitions                 |
| `tool_arguments`        | `invocation_params.tool_arguments` | Tool arguments as JSON or key-value pairs |

### Logfire attributes

| OpenTelemetry attribute | LangSmith field    | Notes                                            |
| ----------------------- | ------------------ | ------------------------------------------------ |
| `prompt`                | `inputs`           | Logfire prompt input                             |
| `all_messages_events`   | `outputs`          | Logfire message events output                    |
| `events`                | `inputs`/`outputs` | Logfire events array, splits input/choice events |

### OpenTelemetry event mapping

| Event name                  | LangSmith field      | Notes                                                            |
| --------------------------- | -------------------- | ---------------------------------------------------------------- |
| `gen_ai.content.prompt`     | `inputs`             | Extracts prompt content from event attributes                    |
| `gen_ai.content.completion` | `outputs`            | Extracts completion content from event attributes                |
| `gen_ai.system.message`     | `inputs.messages[]`  | System message in conversation                                   |
| `gen_ai.user.message`       | `inputs.messages[]`  | User message in conversation                                     |
| `gen_ai.assistant.message`  | `outputs.messages[]` | Assistant message in conversation                                |
| `gen_ai.tool.message`       | `outputs.messages[]` | Tool response message                                            |
| `gen_ai.choice`             | `outputs`            | Model choice/response with finish reason                         |
| `exception`                 | `status`, `error`    | Sets status to "error" and extracts exception message/stacktrace |

#### Event attribute extraction

For message events, the following attributes are extracted:

* `content` → message content
* `role` → message role
* `id` → tool\_call\_id (for tool messages)
* `gen_ai.event.content` → full message JSON

For choice events:

* `finish_reason` → choice finish reason
* `message.content` → choice message content
* `message.role` → choice message role
* `tool_calls.{n}.id` → tool call ID
* `tool_calls.{n}.function.name` → tool function name
* `tool_calls.{n}.function.arguments` → tool function arguments
* `tool_calls.{n}.type` → tool call type

For exception events:

* `exception.message` → error message
* `exception.stacktrace` → error stacktrace (appended to message)

## Implementation examples

### Trace using the LangSmith SDK

Use the LangSmith SDK's OpenTelemetry helper to configure export. The following example [traces a Google ADK agent](/langsmith/trace-with-google-adk):
```

---

## Create and run the crew

**URL:** llms-txt#create-and-run-the-crew

**Contents:**
- Advanced usage
  - Custom metadata and tags

crew = Crew(
    agents=[market_researcher, data_analyst, content_strategist],
    tasks=[research_task, analysis_task, content_task],
    verbose=True,
    process="sequential"  # Tasks will be executed in order
)

def run_market_research_crew():
    """Run the market research crew and return results."""
    result = crew.kickoff()
    return result

if __name__ == "__main__":
    print("Running CrewAI market research process...")
    output = run_market_research_crew()
    print("\n" + "="*50)
    print("CrewAI Process Output:")
    print("="*50)
    print(output)
python  theme={null}
from opentelemetry import trace

**Examples:**

Example 1 (unknown):
```unknown
## Advanced usage

### Custom metadata and tags

You can add custom metadata to your traces by setting span attributes in your CrewAI application:
```

---

## Create a code reviewer agent

**URL:** llms-txt#create-a-code-reviewer-agent

code_reviewer = autogen.AssistantAgent(
    name="code_reviewer",
    llm_config={"config_list": config_list},
    system_message="""You are an expert code reviewer. Your role is to:
    1. Review code for bugs, security issues, and best practices
    2. Suggest improvements and optimizations
    3. Provide constructive feedback
    Always be thorough but constructive in your reviews.""",
)

---

## Create a custom agent graph

**URL:** llms-txt#create-a-custom-agent-graph

custom_graph = create_agent(
    model=your_model,
    tools=specialized_tools,
    prompt="You are a specialized agent for data analysis..."
)

---

## Create a developer agent

**URL:** llms-txt#create-a-developer-agent

developer = autogen.AssistantAgent(
    name="developer",
    llm_config={"config_list": config_list},
    system_message="""You are a senior software developer. Your role is to:
    1. Write clean, efficient code
    2. Address feedback from code reviews
    3. Explain your implementation decisions
    4. Implement requested features and fixes""",
)

---

## Create a session explicitly

**URL:** llms-txt#create-a-session-explicitly

**Contents:**
- Core features
  - Tools

async with client.session("server_name") as session:  # [!code highlight]
    # Pass the session to load tools, resources, or prompts
    tools = await load_mcp_tools(session)  # [!code highlight]
    agent = create_agent(
        "anthropic:claude-3-7-sonnet-latest",
        tools
    )
python  theme={null}
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

client = MultiServerMCPClient({...})
tools = await client.get_tools()  # [!code highlight]
agent = create_agent("claude-sonnet-4-5-20250929", tools)
python  theme={null}
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent
from langchain.messages import ToolMessage

client = MultiServerMCPClient({...})
tools = await client.get_tools()
agent = create_agent("claude-sonnet-4-5-20250929", tools)

result = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "Get data from the server"}]}
)

**Examples:**

Example 1 (unknown):
```unknown
## Core features

### Tools

[Tools](https://modelcontextprotocol.io/docs/concepts/tools) allow MCP servers to expose executable functions that LLMs can invoke to perform actions—such as querying databases, calling APIs, or interacting with external systems. LangChain converts MCP tools into LangChain [tools](/oss/python/langchain/tools), making them directly usable in any LangChain agent or workflow.

#### Loading tools

Use `client.get_tools()` to retrieve tools from MCP servers and pass them to your agent:
```

Example 2 (unknown):
```unknown
#### Structured content

MCP tools can return [structured content](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#structured-content) alongside the human-readable text response. This is useful when a tool needs to return machine-parseable data (like JSON) in addition to text that gets shown to the model.

When an MCP tool returns `structuredContent`, the adapter wraps it in an [`MCPToolArtifact`](/docs/reference/langchain-mcp-adapters#MCPToolArtifact) and returns it as the tool's artifact. You can access this using the `artifact` field on the `ToolMessage`. You can also use [interceptors](#tool-interceptors) to process or transform structured content automatically.

**Extracting structured content from artifact**

After invoking your agent, you can access the structured content from tool messages in the response:
```

---

## Create a subagent

**URL:** llms-txt#create-a-subagent

subagent = create_agent(model="anthropic:claude-sonnet-4-20250514", tools=[...])

---

## Create a sub-agent

**URL:** llms-txt#create-a-sub-agent

subagent = create_agent(model="...", tools=[...])  # [!code highlight]

---

## Create a user proxy agent

**URL:** llms-txt#create-a-user-proxy-agent

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=8,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "workspace"},
    llm_config={"config_list": config_list},
)

def run_code_review_session(task_description: str):
    """Run a multi-agent code review session."""

# Create a group chat with the agents
    groupchat = autogen.GroupChat(
        agents=[user_proxy, developer, code_reviewer],
        messages=[],
        max_round=10
    )

# Create a group chat manager
    manager = autogen.GroupChatManager(
        groupchat=groupchat,
        llm_config={"config_list": config_list}
    )

# Start the conversation
    user_proxy.initiate_chat(
        manager,
        message=f"""
        Task: {task_description}

Developer: Please implement the requested feature.
        Code Reviewer: Please review the implementation and provide feedback.

Work together to create a high-quality solution.
        """
    )

return "Code review session completed"

---

## Create the agent with skill support

**URL:** llms-txt#create-the-agent-with-skill-support

**Contents:**
- 5. Test progressive disclosure

agent = create_agent(
    model,
    system_prompt=(
        "You are a SQL query assistant that helps users "
        "write queries against business databases."
    ),
    middleware=[SkillMiddleware()],  # [!code highlight]
    checkpointer=InMemorySaver(),
)
python  theme={null}
import uuid

**Examples:**

Example 1 (unknown):
```unknown
The agent now has access to skill descriptions in its system prompt and can call `load_skill` to retrieve full skill content when needed. The checkpointer maintains conversation history across turns.

## 5. Test progressive disclosure

Test the agent with a question that requires skill-specific knowledge:
```

---

## Create the agent with step-based configuration

**URL:** llms-txt#create-the-agent-with-step-based-configuration

**Contents:**
- 6. Test the workflow

agent = create_agent(
    model,
    tools=all_tools,
    state_schema=SupportState,  # [!code highlight]
    middleware=[apply_step_config],  # [!code highlight]
    checkpointer=InMemorySaver(),  # [!code highlight]
)
python  theme={null}
from langchain.messages import HumanMessage
import uuid

**Examples:**

Example 1 (unknown):
```unknown
<Note>
  **Why a checkpointer?** The checkpointer maintains state across conversation turns. Without it, the `current_step` state would be lost between user messages, breaking the workflow.
</Note>

## 6. Test the workflow

Test the complete workflow:
```

---

## Customize Deep Agents

**URL:** llms-txt#customize-deep-agents

**Contents:**
- Model
- System prompt
- Tools

Source: https://docs.langchain.com/oss/python/deepagents/customization

Learn how to customize deep agents with system prompts, tools, subagents, and more

By default, `deepagents` uses [`claude-sonnet-4-5-20250929`](https://platform.claude.com/docs/en/about-claude/models/overview). You can customize the model used by passing any supported <Tooltip tip="A string that follows the format `provider:model` (e.g. openai:gpt-5)" cta="See mappings" href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)">model identifier string</Tooltip> or [LangChain model object](/oss/python/integrations/chat).

Deep agents come with a built-in system prompt inspired by Claude Code's system prompt. The default system prompt contains detailed instructions for using the built-in planning tool, file system tools, and subagents.

Each deep agent tailored to a use case should include a custom system prompt specific to that use case.

Just like tool-calling agents, a deep agent gets a set of top level tools that it has access to.

In addition to any tools that you provide, deep agents also get access to a number of default tools:

* `write_todos` – Update the agent's to-do list
* `ls` – List all files in the agent's filesystem
* `read_file` – Read a file from the agent's filesystem
* `write_file` – Write a new file in the agent's filesystem
* `edit_file` – Edit an existing file in the agent's filesystem
* `task` – Spawn a subagent to handle a specific task

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/customization.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Model

By default, `deepagents` uses [`claude-sonnet-4-5-20250929`](https://platform.claude.com/docs/en/about-claude/models/overview). You can customize the model used by passing any supported <Tooltip tip="A string that follows the format `provider:model` (e.g. openai:gpt-5)" cta="See mappings" href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)">model identifier string</Tooltip> or [LangChain model object](/oss/python/integrations/chat).

<CodeGroup>
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
</CodeGroup>

## System prompt

Deep agents come with a built-in system prompt inspired by Claude Code's system prompt. The default system prompt contains detailed instructions for using the built-in planning tool, file system tools, and subagents.

Each deep agent tailored to a use case should include a custom system prompt specific to that use case.
```

Example 4 (unknown):
```unknown
## Tools

Just like tool-calling agents, a deep agent gets a set of top level tools that it has access to.
```

---

## Custom state can be passed in invoke

**URL:** llms-txt#custom-state-can-be-passed-in-invoke

**Contents:**
- Common patterns
  - Trim messages
  - Delete messages
  - Summarize messages
- Access memory
  - Tools

result = agent.invoke(
    {
        "messages": [{"role": "user", "content": "Hello"}],
        "user_id": "user_123",  # [!code highlight]
        "preferences": {"theme": "dark"}  # [!code highlight]
    },
    {"configurable": {"thread_id": "1"}})
python  theme={null}
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langgraph.runtime import Runtime
from langchain_core.runnables import RunnableConfig
from typing import Any

@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """Keep only the last few messages to fit context window."""
    messages = state["messages"]

if len(messages) <= 3:
        return None  # No changes needed

first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }

agent = create_agent(
    your_model_here,
    tools=your_tools_here,
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

agent.invoke({"messages": "hi, my name is bob"}, config)
agent.invoke({"messages": "write a short poem about cats"}, config)
agent.invoke({"messages": "now do the same but for dogs"}, config)
final_response = agent.invoke({"messages": "what's my name?"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

Your name is Bob. You told me that earlier.
If you'd like me to call you a nickname or use a different name, just say the word.
"""
python  theme={null}
from langchain.messages import RemoveMessage  # [!code highlight]

def delete_messages(state):
    messages = state["messages"]
    if len(messages) > 2:
        # remove the earliest two messages
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}  # [!code highlight]
python  theme={null}
from langgraph.graph.message import REMOVE_ALL_MESSAGES  # [!code highlight]

def delete_messages(state):
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)]}  # [!code highlight]
python  theme={null}
from langchain.messages import RemoveMessage
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import after_model
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime
from langchain_core.runnables import RunnableConfig

@after_model
def delete_old_messages(state: AgentState, runtime: Runtime) -> dict | None:
    """Remove old messages to keep conversation manageable."""
    messages = state["messages"]
    if len(messages) > 2:
        # remove the earliest two messages
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}
    return None

agent = create_agent(
    "gpt-5-nano",
    tools=[],
    system_prompt="Please be concise and to the point.",
    middleware=[delete_old_messages],
    checkpointer=InMemorySaver(),
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

for event in agent.stream(
    {"messages": [{"role": "user", "content": "hi! I'm bob"}]},
    config,
    stream_mode="values",
):
    print([(message.type, message.content) for message in event["messages"]])

for event in agent.stream(
    {"messages": [{"role": "user", "content": "what's my name?"}]},
    config,
    stream_mode="values",
):
    print([(message.type, message.content) for message in event["messages"]])

[('human', "hi! I'm bob")]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.')]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.'), ('human', "what's my name?")]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.'), ('human', "what's my name?"), ('ai', 'Your name is Bob. How can I help you today, Bob?')]
[('human', "what's my name?"), ('ai', 'Your name is Bob. How can I help you today, Bob?')]
python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.runnables import RunnableConfig

checkpointer = InMemorySaver()

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger=("tokens", 4000),
            keep=("messages", 20)
        )
    ],
    checkpointer=checkpointer,
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}
agent.invoke({"messages": "hi, my name is bob"}, config)
agent.invoke({"messages": "write a short poem about cats"}, config)
agent.invoke({"messages": "now do the same but for dogs"}, config)
final_response = agent.invoke({"messages": "what's my name?"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

Your name is Bob!
"""
python  theme={null}
from langchain.agents import create_agent, AgentState
from langchain.tools import tool, ToolRuntime

class CustomState(AgentState):
    user_id: str

@tool
def get_user_info(
    runtime: ToolRuntime
) -> str:
    """Look up user info."""
    user_id = runtime.state["user_id"]
    return "User is John Smith" if user_id == "user_123" else "Unknown user"

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_user_info],
    state_schema=CustomState,
)

result = agent.invoke({
    "messages": "look up user information",
    "user_id": "user_123"
})
print(result["messages"][-1].content)

**Examples:**

Example 1 (unknown):
```unknown
## Common patterns

With [short-term memory](#add-short-term-memory) enabled, long conversations can exceed the LLM's context window. Common solutions are:

<CardGroup cols={2}>
  <Card title="Trim messages" icon="scissors" href="#trim-messages" arrow>
    Remove first or last N messages (before calling LLM)
  </Card>

  <Card title="Delete messages" icon="trash" href="#delete-messages" arrow>
    Delete messages from LangGraph state permanently
  </Card>

  <Card title="Summarize messages" icon="layer-group" href="#summarize-messages" arrow>
    Summarize earlier messages in the history and replace them with a summary
  </Card>

  <Card title="Custom strategies" icon="gears">
    Custom strategies (e.g., message filtering, etc.)
  </Card>
</CardGroup>

This allows the agent to keep track of the conversation without exceeding the LLM's context window.

### Trim messages

Most LLMs have a maximum supported context window (denominated in tokens).

One way to decide when to truncate messages is to count the tokens in the message history and truncate whenever it approaches that limit. If you're using LangChain, you can use the trim messages utility and specify the number of tokens to keep from the list, as well as the `strategy` (e.g., keep the last `max_tokens`) to use for handling the boundary.

To trim message history in an agent, use the [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model) middleware decorator:
```

Example 2 (unknown):
```unknown
### Delete messages

You can delete messages from the graph state to manage the message history.

This is useful when you want to remove specific messages or clear the entire message history.

To delete messages from the graph state, you can use the `RemoveMessage`.

For `RemoveMessage` to work, you need to use a state key with [`add_messages`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.message.add_messages) [reducer](/oss/python/langgraph/graph-api#reducers).

The default [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) provides this.

To remove specific messages:
```

Example 3 (unknown):
```unknown
To remove **all** messages:
```

Example 4 (unknown):
```unknown
<Warning>
  When deleting messages, **make sure** that the resulting message history is valid. Check the limitations of the LLM provider you're using. For example:

  * Some providers expect message history to start with a `user` message
  * Most providers require `assistant` messages with tool calls to be followed by corresponding `tool` result messages.
</Warning>
```

---

## Dataset prebuilt JSON schema types

**URL:** llms-txt#dataset-prebuilt-json-schema-types

Source: https://docs.langchain.com/langsmith/dataset-json-types

LangSmith recommends that you set a schema on the inputs and outputs of your dataset schemas to ensure data consistency and that your examples are in the right format for downstream processing, like running evals.

In order to better support LLM workflows, LangSmith has support for a few different predefined prebuilt types. These schemas are hosted publicly by the LangSmith API, and can be defined in your dataset schemas using [JSON Schema references](https://json-schema.org/understanding-json-schema/structuring#dollarref). The table of available schemas can be seen below

| Type    | JSON Schema Reference Link                                                                                                       | Usage                                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Message | [https://api.smith.langchain.com/public/schemas/v1/message.json](https://api.smith.langchain.com/public/schemas/v1/message.json) | Represents messages sent to a chat model, following the OpenAI standard format.                                           |
| Tool    | [https://api.smith.langchain.com/public/schemas/v1/tooldef.json](https://api.smith.langchain.com/public/schemas/v1/tooldef.json) | Tool definitions available to chat models for function calling, defined in OpenAI's JSON Schema inspired function format. |

LangSmith lets you define a series of transformations that collect the above prebuilt types from your traces and add them to your dataset. For more info on available transformations, see our [reference](/langsmith/dataset-transformations)

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/dataset-json-types.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Deep Agents

**URL:** llms-txt#deep-agents

Source: https://docs.langchain.com/oss/python/reference/deepagents-python

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/reference/deepagents-python.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Deep Agents CLI

**URL:** llms-txt#deep-agents-cli

**Contents:**
- Quick start
- Configuration
- Interactive mode
- Set project conventions with memories

Source: https://docs.langchain.com/oss/python/deepagents/cli

Interactive command-line interface for building with Deep Agents

A terminal interface for building agents with persistent memory. Agents maintain context across sessions, learn project conventions, and execute code with approval controls.

The Deep Agents CLI has the following built-in capabilities:

* <Icon icon="file" size={16} /> **File operations** - read, write, and edit files in your project with tools that enable agents to manage and modify code and documentation.
* <Icon icon="terminal" size={16} /> **Shell command execution** - execute shell commands to run tests, build projects, manage dependencies, and interact with version control systems.
* <Icon icon="magnifying-glass" size={16} /> **Web search** - search the web for up-to-date information and documentation (requires Tavily API key).
* <Icon icon="globe" size={16} /> **HTTP requests** - make HTTP requests to APIs and external services for data fetching and integration tasks.
* <Icon icon="list-check" size={16} /> **Task planning and tracking** - break down complex tasks into discrete steps and track progress through the built-in todo system.
* <Icon icon="brain" size={16} /> **Memory storage and retrieval** - store and retrieve information across sessions, enabling agents to remember project conventions and learned patterns.
* <Icon icon="head-side" size={16} /> **Human-in-the-loop** - require human approval for sensitive tool operations.

<Tip>
  [Watch the demo video](https://youtu.be/IrnacLa9PJc?si=3yUnPbxnm2yaqVQb) to see how the Deep Agents CLI works.
</Tip>

<Steps>
  <Step title="Set your API key" icon="key">
    Export as an environment variable:

Or create a `.env` file in your project root:

<Step title="Run the CLI" icon="terminal">
    
  </Step>

<Step title="Give the agent a task" icon="message">

The agent proposes changes with diffs for your approval before modifying files.
  </Step>
</Steps>

<Accordion title="Additional installation and configuration options">
  Install locally if needed:

The CLI uses Anthropic Claude Sonnet 4 by default. To use OpenAI:

Enable web search (optional):

API keys can be set as environment variables or in a `.env` file.
</Accordion>

<AccordionGroup>
  <Accordion title="Command-line options" icon="flag">
    | Option                 | Description                                                 |
    | ---------------------- | ----------------------------------------------------------- |
    | `--agent NAME`         | Use named agent with separate memory                        |
    | `--auto-approve`       | Skip tool confirmation prompts (toggle with `Ctrl+T`)       |
    | `--sandbox TYPE`       | Execute in remote sandbox: `modal`, `daytona`, or `runloop` |
    | `--sandbox-id ID`      | Reuse existing sandbox                                      |
    | `--sandbox-setup PATH` | Run setup script in sandbox                                 |
  </Accordion>

<Accordion title="CLI commands" icon="terminal">
    | Command                                         | Description                             |
    | ----------------------------------------------- | --------------------------------------- |
    | `deepagents list`                               | List all agents                         |
    | `deepagents help`                               | Show help                               |
    | `deepagents reset --agent NAME`                 | Clear agent memory and reset to default |
    | `deepagents reset --agent NAME --target SOURCE` | Copy memory from another agent          |
  </Accordion>
</AccordionGroup>

<AccordionGroup>
  <Accordion title="Slash commands" icon="slash">
    Use these commands within the CLI session:

* `/tokens` - Display token usage
    * `/clear` - Clear conversation history
    * `/exit` - Exit the CLI
  </Accordion>

<Accordion title="Bash commands" icon="terminal">
    Execute shell commands directly by prefixing with `!`:

<Accordion title="Keyboard shortcuts" icon="keyboard">
    | Shortcut    | Action              |
    | ----------- | ------------------- |
    | `Enter`     | Submit              |
    | `Alt+Enter` | Newline             |
    | `Ctrl+E`    | External editor     |
    | `Ctrl+T`    | Toggle auto-approve |
    | `Ctrl+C`    | Interrupt           |
    | `Ctrl+D`    | Exit                |
  </Accordion>
</AccordionGroup>

## Set project conventions with memories

Agents store information in `~/.deepagents/AGENT_NAME/memories/` as markdown files using a memory-first protocol:

1. **Research**: Searches memory for relevant context before starting tasks
2. **Response**: Checks memory when uncertain during execution
3. **Learning**: Automatically saves new information for future sessions

Organize memories by topic with descriptive filenames:

Teach the agent conventions once:

It remembers for future sessions:

```bash  theme={null}
> Create a /users endpoint

**Examples:**

Example 1 (unknown):
```unknown
Or create a `.env` file in your project root:
```

Example 2 (unknown):
```unknown
</Step>

  <Step title="Run the CLI" icon="terminal">
```

Example 3 (unknown):
```unknown
</Step>

  <Step title="Give the agent a task" icon="message">
```

Example 4 (unknown):
```unknown
The agent proposes changes with diffs for your approval before modifying files.
  </Step>
</Steps>

<Accordion title="Additional installation and configuration options">
  Install locally if needed:

  <CodeGroup>
```

---

## Deep Agents Middleware

**URL:** llms-txt#deep-agents-middleware

**Contents:**
- To-do list middleware

Source: https://docs.langchain.com/oss/python/deepagents/middleware

Understand the middleware that powers deep agents

Deep agents are built with a modular middleware architecture. Deep agents have access to:

1. A planning tool
2. A filesystem for storing context and long-term memories
3. The ability to spawn subagents

Each feature is implemented as separate middleware. When you create a deep agent with `create_deep_agent`, we automatically attach `TodoListMiddleware`, `FilesystemMiddleware`, and `SubAgentMiddleware` to your agent.

Middleware is composable—you can add as many or as few middleware to an agent as needed. You can use any middleware independently.

The following sections explain what each middleware provides.

## To-do list middleware

Planning is integral to solving complex problems. If you've used Claude Code recently, you'll notice how it writes out a to-do list before tackling complex, multi-part tasks. You'll also notice how it can adapt and update this to-do list on the fly as more information comes in.

`TodoListMiddleware` provides your agent with a tool specifically for updating this to-do list. Before and while it executes a multi-part task, the agent is prompted to use the `write_todos` tool to keep track of what it's doing and what still needs to be done.

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import TodoListMiddleware

**Examples:**

Example 1 (unknown):
```unknown
Middleware is composable—you can add as many or as few middleware to an agent as needed. You can use any middleware independently.

The following sections explain what each middleware provides.

## To-do list middleware

Planning is integral to solving complex problems. If you've used Claude Code recently, you'll notice how it writes out a to-do list before tackling complex, multi-part tasks. You'll also notice how it can adapt and update this to-do list on the fly as more information comes in.

`TodoListMiddleware` provides your agent with a tool specifically for updating this to-do list. Before and while it executes a multi-part task, the agent is prompted to use the `write_todos` tool to keep track of what it's doing and what still needs to be done.
```

---

## Default: user-scoped token (works for any agent under this user)

**URL:** llms-txt#default:-user-scoped-token-(works-for-any-agent-under-this-user)

auth_result = await client.authenticate(
    provider="{provider_id}",
    scopes=["scopeA"],
    user_id="your_user_id"
)

if auth_result.needs_auth:
    print(f"Complete OAuth at: {auth_result.auth_url}")
    # Wait for completion
    completed_auth = await client.wait_for_completion(auth_result.auth_id)
    token = completed_auth.token
else:
    token = auth_result.token
```

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-auth.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Define agent tools

**URL:** llms-txt#define-agent-tools

def add_to_order(item: str, quantity: int) -> str:
    """Add an item to the customer's sandwich order."""
    return f"Added {quantity} x {item} to the order."

def confirm_order(order_summary: str) -> str:
    """Confirm the final order with the customer."""
    return f"Order confirmed: {order_summary}. Sending to kitchen."

---

## Define structured output schema for the classifier

**URL:** llms-txt#define-structured-output-schema-for-the-classifier

**Contents:**
- 5. Compile the workflow
- 6. Use the router
- 7. Understanding the architecture
  - Classification phase
  - Parallel execution with Send

class ClassificationResult(BaseModel):  # [!code highlight]
    """Result of classifying a user query into agent-specific sub-questions."""
    classifications: list[Classification] = Field(
        description="List of agents to invoke with their targeted sub-questions"
    )

def classify_query(state: RouterState) -> dict:
    """Classify query and determine which agents to invoke."""
    structured_llm = router_llm.with_structured_output(ClassificationResult)  # [!code highlight]

result = structured_llm.invoke([
        {
            "role": "system",
            "content": """Analyze this query and determine which knowledge bases to consult.
For each relevant source, generate a targeted sub-question optimized for that source.

Available sources:
- github: Code, API references, implementation details, issues, pull requests
- notion: Internal documentation, processes, policies, team wikis
- slack: Team discussions, informal knowledge sharing, recent conversations

Return ONLY the sources that are relevant to the query. Each source should have
a targeted sub-question optimized for that specific knowledge domain.

Example for "How do I authenticate API requests?":
- github: "What authentication code exists? Search for auth middleware, JWT handling"
- notion: "What authentication documentation exists? Look for API auth guides"
(slack omitted because it's not relevant for this technical question)"""
        },
        {"role": "user", "content": state["query"]}
    ])

return {"classifications": result.classifications}

def route_to_agents(state: RouterState) -> list[Send]:
    """Fan out to agents based on classifications."""
    return [
        Send(c["source"], {"query": c["query"]})  # [!code highlight]
        for c in state["classifications"]
    ]

def query_github(state: AgentInput) -> dict:
    """Query the GitHub agent."""
    result = github_agent.invoke({
        "messages": [{"role": "user", "content": state["query"]}]  # [!code highlight]
    })
    return {"results": [{"source": "github", "result": result["messages"][-1].content}]}

def query_notion(state: AgentInput) -> dict:
    """Query the Notion agent."""
    result = notion_agent.invoke({
        "messages": [{"role": "user", "content": state["query"]}]  # [!code highlight]
    })
    return {"results": [{"source": "notion", "result": result["messages"][-1].content}]}

def query_slack(state: AgentInput) -> dict:
    """Query the Slack agent."""
    result = slack_agent.invoke({
        "messages": [{"role": "user", "content": state["query"]}]  # [!code highlight]
    })
    return {"results": [{"source": "slack", "result": result["messages"][-1].content}]}

def synthesize_results(state: RouterState) -> dict:
    """Combine results from all agents into a coherent answer."""
    if not state["results"]:
        return {"final_answer": "No results found from any knowledge source."}

# Format results for synthesis
    formatted = [
        f"**From {r['source'].title()}:**\n{r['result']}"
        for r in state["results"]
    ]

synthesis_response = router_llm.invoke([
        {
            "role": "system",
            "content": f"""Synthesize these search results to answer the original question: "{state['query']}"

- Combine information from multiple sources without redundancy
- Highlight the most relevant and actionable information
- Note any discrepancies between sources
- Keep the response concise and well-organized"""
        },
        {"role": "user", "content": "\n\n".join(formatted)}
    ])

return {"final_answer": synthesis_response.content}
python  theme={null}
workflow = (
    StateGraph(RouterState)
    .add_node("classify", classify_query)
    .add_node("github", query_github)
    .add_node("notion", query_notion)
    .add_node("slack", query_slack)
    .add_node("synthesize", synthesize_results)
    .add_edge(START, "classify")
    .add_conditional_edges("classify", route_to_agents, ["github", "notion", "slack"])
    .add_edge("github", "synthesize")
    .add_edge("notion", "synthesize")
    .add_edge("slack", "synthesize")
    .add_edge("synthesize", END)
    .compile()
)
python  theme={null}
result = workflow.invoke({
    "query": "How do I authenticate API requests?"
})

print("Original query:", result["query"])
print("\nClassifications:")
for c in result["classifications"]:
    print(f"  {c['source']}: {c['query']}")
print("\n" + "=" * 60 + "\n")
print("Final Answer:")
print(result["final_answer"])

Original query: How do I authenticate API requests?

Classifications:
  github: What authentication code exists? Search for auth middleware, JWT handling
  notion: What authentication documentation exists? Look for API auth guides

============================================================

Final Answer:
To authenticate API requests, you have several options:

1. **JWT Tokens**: The recommended approach for most use cases.
   Implementation details are in `src/auth.py` (PR #156).

2. **OAuth2 Flow**: For third-party integrations, follow the OAuth2
   flow documented in Notion's 'API Authentication Guide'.

3. **API Keys**: For server-to-server communication, use Bearer tokens
   in the Authorization header.

For token refresh handling, see issue #203 and PR #178 for the latest
OAuth scope updates.
python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
## 5. Compile the workflow

Now assemble the workflow by connecting nodes with edges. The key is using `add_conditional_edges` with the routing function to enable parallel execution:
```

Example 2 (unknown):
```unknown
The `add_conditional_edges` call connects the classify node to the agent nodes through the `route_to_agents` function. When `route_to_agents` returns multiple `Send` objects, those nodes execute in parallel.

## 6. Use the router

Test your router with queries that span multiple knowledge domains:
```

Example 3 (unknown):
```unknown
Expected output:
```

Example 4 (unknown):
```unknown
The router analyzed the query, classified it to determine which agents to invoke (GitHub and Notion, but not Slack for this technical question), queried both agents in parallel, and synthesized the results into a coherent answer.

## 7. Understanding the architecture

The router workflow follows a clear pattern:

### Classification phase

The `classify_query` function uses **structured output** to analyze the user's query and determine which agents to invoke. This is where the routing intelligence lives:

* Uses a Pydantic model (Python) or Zod schema (JS) to ensure valid output
* Returns a list of `Classification` objects, each with a `source` and targeted `query`
* Only includes relevant sources—irrelevant ones are simply omitted

This structured approach is more reliable than free-form JSON parsing and makes the routing logic explicit.

### Parallel execution with Send

The `route_to_agents` function maps classifications to `Send` objects. Each `Send` specifies the target node and the state to pass:
```

---

## Define the possible workflow steps

**URL:** llms-txt#define-the-possible-workflow-steps

**Contents:**
- 2. Create tools that manage workflow state
- 3. Define step configurations

SupportStep = Literal["warranty_collector", "issue_classifier", "resolution_specialist"]  # [!code highlight]

class SupportState(AgentState):  # [!code highlight]
    """State for customer support workflow."""
    current_step: NotRequired[SupportStep]  # [!code highlight]
    warranty_status: NotRequired[Literal["in_warranty", "out_of_warranty"]]
    issue_type: NotRequired[Literal["hardware", "software"]]
python  theme={null}
from langchain.tools import tool, ToolRuntime
from langchain.messages import ToolMessage
from langgraph.types import Command

@tool
def record_warranty_status(
    status: Literal["in_warranty", "out_of_warranty"],
    runtime: ToolRuntime[None, SupportState],
) -> Command:  # [!code highlight]
    """Record the customer's warranty status and transition to issue classification."""
    return Command(  # [!code highlight]
        update={  # [!code highlight]
            "messages": [
                ToolMessage(
                    content=f"Warranty status recorded as: {status}",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
            "warranty_status": status,
            "current_step": "issue_classifier",  # [!code highlight]
        }
    )

@tool
def record_issue_type(
    issue_type: Literal["hardware", "software"],
    runtime: ToolRuntime[None, SupportState],
) -> Command:  # [!code highlight]
    """Record the type of issue and transition to resolution specialist."""
    return Command(  # [!code highlight]
        update={  # [!code highlight]
            "messages": [
                ToolMessage(
                    content=f"Issue type recorded as: {issue_type}",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
            "issue_type": issue_type,
            "current_step": "resolution_specialist",  # [!code highlight]
        }
    )

@tool
def escalate_to_human(reason: str) -> str:
    """Escalate the case to a human support specialist."""
    # In a real system, this would create a ticket, notify staff, etc.
    return f"Escalating to human support. Reason: {reason}"

@tool
def provide_solution(solution: str) -> str:
    """Provide a solution to the customer's issue."""
    return f"Solution provided: {solution}"
python  theme={null}
  # Define prompts as constants for easy reference
  WARRANTY_COLLECTOR_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Warranty verification

At this step, you need to:
  1. Greet the customer warmly
  2. Ask if their device is under warranty
  3. Use record_warranty_status to record their response and move to the next step

Be conversational and friendly. Don't ask multiple questions at once."""

ISSUE_CLASSIFIER_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Issue classification
  CUSTOMER INFO: Warranty status is {warranty_status}

At this step, you need to:
  1. Ask the customer to describe their issue
  2. Determine if it's a hardware issue (physical damage, broken parts) or software issue (app crashes, performance)
  3. Use record_issue_type to record the classification and move to the next step

If unclear, ask clarifying questions before classifying."""

RESOLUTION_SPECIALIST_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Resolution
  CUSTOMER INFO: Warranty status is {warranty_status}, issue type is {issue_type}

At this step, you need to:
  1. For SOFTWARE issues: provide troubleshooting steps using provide_solution
  2. For HARDWARE issues:
     - If IN WARRANTY: explain warranty repair process using provide_solution
     - If OUT OF WARRANTY: escalate_to_human for paid repair options

Be specific and helpful in your solutions."""
  python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
The `current_step` field is the core of the state machine pattern - it determines which configuration (prompt + tools) is loaded on each turn.

## 2. Create tools that manage workflow state

Create tools that update the workflow state. These tools allow the agent to record information and transition to the next step.

The key is using `Command` to update state, including the `current_step` field:
```

Example 2 (unknown):
```unknown
Notice how `record_warranty_status` and `record_issue_type` return `Command` objects that update both the data (`warranty_status`, `issue_type`) AND the `current_step`. This is how the state machine works - tools control workflow progression.

## 3. Define step configurations

Define prompts and tools for each step. First, define the prompts for each step:

<Accordion title="View complete prompt definitions">
```

Example 3 (unknown):
```unknown
</Accordion>

Then map step names to their configurations using a dictionary:
```

---

## Define the runtime context

**URL:** llms-txt#define-the-runtime-context

**Contents:**
- Create the configuration file
- Next

class GraphContext(TypedDict):
    model_name: Literal["anthropic", "openai"]

workflow = StateGraph(AgentState, context_schema=GraphContext)
workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "action",
        "end": END,
    },
)
workflow.add_edge("action", "agent")

graph = workflow.compile()
bash  theme={null}
my-app/
├── my_agent # all project code lies within here
│   ├── utils # utilities for your graph
│   │   ├── __init__.py
│   │   ├── tools.py # tools for your graph
│   │   ├── nodes.py # node functions for your graph
│   │   └── state.py # state definition of your graph
│   ├── __init__.py
│   └── agent.py # code for constructing your graph
├── .env
└── pyproject.toml
json  theme={null}
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./my_agent/agent.py:graph"
  },
  "env": ".env"
}
bash  theme={null}
my-app/
├── my_agent # all project code lies within here
│   ├── utils # utilities for your graph
│   │   ├── __init__.py
│   │   ├── tools.py # tools for your graph
│   │   ├── nodes.py # node functions for your graph
│   │   └── state.py # state definition of your graph
│   ├── __init__.py
│   └── agent.py # code for constructing your graph
├── .env # environment variables
├── langgraph.json  # configuration file for LangGraph
└── pyproject.toml # dependencies for your project
```

After you setup your project and place it in a GitHub repository, it's time to [deploy your app](/langsmith/deployment-quickstart).

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/setup-pyproject.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Example file directory:
```

Example 2 (unknown):
```unknown
## Create the configuration file

Create a [configuration file](/langsmith/cli#configuration-file) called `langgraph.json`. See the [configuration file reference](/langsmith/cli#configuration-file) for detailed explanations of each key in the JSON object of the configuration file.

Example `langgraph.json` file:
```

Example 3 (unknown):
```unknown
Note that the variable name of the `CompiledGraph` appears at the end of the value of each subkey in the top-level `graphs` key (i.e. `:<variable_name>`).

<Warning>
  **Configuration file location**
  The configuration file must be placed in a directory that is at the same level or higher than the Python files that contain compiled graphs and associated dependencies.
</Warning>

Example file directory:
```

---

## Define the structure for email classification

**URL:** llms-txt#define-the-structure-for-email-classification

**Contents:**
- Step 4: Build your nodes
  - Handle errors appropriately
  - Implementing our email agent nodes
- Step 5: Wire it together
  - Try out your agent
- Summary and next steps
  - Key Insights
  - Advanced considerations
  - Where to go from here

class EmailClassification(TypedDict):
    intent: Literal["question", "bug", "billing", "feature", "complex"]
    urgency: Literal["low", "medium", "high", "critical"]
    topic: str
    summary: str

class EmailAgentState(TypedDict):
    # Raw email data
    email_content: str
    sender_email: str
    email_id: str

# Classification result
    classification: EmailClassification | None

# Raw search/API results
    search_results: list[str] | None  # List of raw document chunks
    customer_history: dict | None  # Raw customer data from CRM

# Generated content
    draft_response: str | None
    messages: list[str] | None
python  theme={null}
    from langgraph.types import RetryPolicy

workflow.add_node(
        "search_documentation",
        search_documentation,
        retry_policy=RetryPolicy(max_attempts=3, initial_interval=1.0)
    )
    python  theme={null}
    from langgraph.types import Command

def execute_tool(state: State) -> Command[Literal["agent", "execute_tool"]]:
        try:
            result = run_tool(state['tool_call'])
            return Command(update={"tool_result": result}, goto="agent")
        except ToolError as e:
            # Let the LLM see what went wrong and try again
            return Command(
                update={"tool_result": f"Tool error: {str(e)}"},
                goto="agent"
            )
    python  theme={null}
    from langgraph.types import Command

def lookup_customer_history(state: State) -> Command[Literal["draft_response"]]:
        if not state.get('customer_id'):
            user_input = interrupt({
                "message": "Customer ID needed",
                "request": "Please provide the customer's account ID to look up their subscription history"
            })
            return Command(
                update={"customer_id": user_input['customer_id']},
                goto="lookup_customer_history"
            )
        # Now proceed with the lookup
        customer_data = fetch_customer_history(state['customer_id'])
        return Command(update={"customer_history": customer_data}, goto="draft_response")
    python  theme={null}
    def send_reply(state: EmailAgentState):
        try:
            email_service.send(state["draft_response"])
        except Exception:
            raise  # Surface unexpected errors
    python  theme={null}
    from typing import Literal
    from langgraph.graph import StateGraph, START, END
    from langgraph.types import interrupt, Command, RetryPolicy
    from langchain_openai import ChatOpenAI
    from langchain.messages import HumanMessage

llm = ChatOpenAI(model="gpt-5-nano")

def read_email(state: EmailAgentState) -> dict:
        """Extract and parse email content"""
        # In production, this would connect to your email service
        return {
            "messages": [HumanMessage(content=f"Processing email: {state['email_content']}")]
        }

def classify_intent(state: EmailAgentState) -> Command[Literal["search_documentation", "human_review", "draft_response", "bug_tracking"]]:
        """Use LLM to classify email intent and urgency, then route accordingly"""

# Create structured LLM that returns EmailClassification dict
        structured_llm = llm.with_structured_output(EmailClassification)

# Format the prompt on-demand, not stored in state
        classification_prompt = f"""
        Analyze this customer email and classify it:

Email: {state['email_content']}
        From: {state['sender_email']}

Provide classification including intent, urgency, topic, and summary.
        """

# Get structured response directly as dict
        classification = structured_llm.invoke(classification_prompt)

# Determine next node based on classification
        if classification['intent'] == 'billing' or classification['urgency'] == 'critical':
            goto = "human_review"
        elif classification['intent'] in ['question', 'feature']:
            goto = "search_documentation"
        elif classification['intent'] == 'bug':
            goto = "bug_tracking"
        else:
            goto = "draft_response"

# Store classification as a single dict in state
        return Command(
            update={"classification": classification},
            goto=goto
        )
    python  theme={null}
    def search_documentation(state: EmailAgentState) -> Command[Literal["draft_response"]]:
        """Search knowledge base for relevant information"""

# Build search query from classification
        classification = state.get('classification', {})
        query = f"{classification.get('intent', '')} {classification.get('topic', '')}"

try:
            # Implement your search logic here
            # Store raw search results, not formatted text
            search_results = [
                "Reset password via Settings > Security > Change Password",
                "Password must be at least 12 characters",
                "Include uppercase, lowercase, numbers, and symbols"
            ]
        except SearchAPIError as e:
            # For recoverable search errors, store error and continue
            search_results = [f"Search temporarily unavailable: {str(e)}"]

return Command(
            update={"search_results": search_results},  # Store raw results or error
            goto="draft_response"
        )

def bug_tracking(state: EmailAgentState) -> Command[Literal["draft_response"]]:
        """Create or update bug tracking ticket"""

# Create ticket in your bug tracking system
        ticket_id = "BUG-12345"  # Would be created via API

return Command(
            update={
                "search_results": [f"Bug ticket {ticket_id} created"],
                "current_step": "bug_tracked"
            },
            goto="draft_response"
        )
    python  theme={null}
    def draft_response(state: EmailAgentState) -> Command[Literal["human_review", "send_reply"]]:
        """Generate response using context and route based on quality"""

classification = state.get('classification', {})

# Format context from raw state data on-demand
        context_sections = []

if state.get('search_results'):
            # Format search results for the prompt
            formatted_docs = "\n".join([f"- {doc}" for doc in state['search_results']])
            context_sections.append(f"Relevant documentation:\n{formatted_docs}")

if state.get('customer_history'):
            # Format customer data for the prompt
            context_sections.append(f"Customer tier: {state['customer_history'].get('tier', 'standard')}")

# Build the prompt with formatted context
        draft_prompt = f"""
        Draft a response to this customer email:
        {state['email_content']}

Email intent: {classification.get('intent', 'unknown')}
        Urgency level: {classification.get('urgency', 'medium')}

{chr(10).join(context_sections)}

Guidelines:
        - Be professional and helpful
        - Address their specific concern
        - Use the provided documentation when relevant
        """

response = llm.invoke(draft_prompt)

# Determine if human review needed based on urgency and intent
        needs_review = (
            classification.get('urgency') in ['high', 'critical'] or
            classification.get('intent') == 'complex'
        )

# Route to appropriate next node
        goto = "human_review" if needs_review else "send_reply"

return Command(
            update={"draft_response": response.content},  # Store only the raw response
            goto=goto
        )

def human_review(state: EmailAgentState) -> Command[Literal["send_reply", END]]:
        """Pause for human review using interrupt and route based on decision"""

classification = state.get('classification', {})

# interrupt() must come first - any code before it will re-run on resume
        human_decision = interrupt({
            "email_id": state.get('email_id',''),
            "original_email": state.get('email_content',''),
            "draft_response": state.get('draft_response',''),
            "urgency": classification.get('urgency'),
            "intent": classification.get('intent'),
            "action": "Please review and approve/edit this response"
        })

# Now process the human's decision
        if human_decision.get("approved"):
            return Command(
                update={"draft_response": human_decision.get("edited_response", state.get('draft_response',''))},
                goto="send_reply"
            )
        else:
            # Rejection means human will handle directly
            return Command(update={}, goto=END)

def send_reply(state: EmailAgentState) -> dict:
        """Send the email response"""
        # Integrate with email service
        print(f"Sending reply: {state['draft_response'][:100]}...")
        return {}
    python  theme={null}
  from langgraph.checkpoint.memory import MemorySaver
  from langgraph.types import RetryPolicy

# Create the graph
  workflow = StateGraph(EmailAgentState)

# Add nodes with appropriate error handling
  workflow.add_node("read_email", read_email)
  workflow.add_node("classify_intent", classify_intent)

# Add retry policy for nodes that might have transient failures
  workflow.add_node(
      "search_documentation",
      search_documentation,
      retry_policy=RetryPolicy(max_attempts=3)
  )
  workflow.add_node("bug_tracking", bug_tracking)
  workflow.add_node("draft_response", draft_response)
  workflow.add_node("human_review", human_review)
  workflow.add_node("send_reply", send_reply)

# Add only the essential edges
  workflow.add_edge(START, "read_email")
  workflow.add_edge("read_email", "classify_intent")
  workflow.add_edge("send_reply", END)

# Compile with checkpointer for persistence, in case run graph with Local_Server --> Please compile without checkpointer
  memory = MemorySaver()
  app = workflow.compile(checkpointer=memory)
  python  theme={null}
  # Test with an urgent billing issue
  initial_state = {
      "email_content": "I was charged twice for my subscription! This is urgent!",
      "sender_email": "customer@example.com",
      "email_id": "email_123",
      "messages": []
  }

# Run with a thread_id for persistence
  config = {"configurable": {"thread_id": "customer_123"}}
  result = app.invoke(initial_state, config)
  # The graph will pause at human_review
  print(f"human review interrupt:{result['__interrupt__']}")

# When ready, provide human input to resume
  from langgraph.types import Command

human_response = Command(
      resume={
          "approved": True,
          "edited_response": "We sincerely apologize for the double charge. I've initiated an immediate refund..."
      }
  )

# Resume execution
  final_result = app.invoke(human_response, config)
  print(f"Email sent successfully!")
  ```
</Accordion>

The graph pauses when it hits `interrupt()`, saves everything to the checkpointer, and waits. It can resume days later, picking up exactly where it left off. The `thread_id` ensures all state for this conversation is preserved together.

## Summary and next steps

Building this email agent has shown us the LangGraph way of thinking:

<CardGroup cols={2}>
  <Card title="Break into discrete steps" icon="sitemap" href="#step-1-map-out-your-workflow-as-discrete-steps">
    Each node does one thing well. This decomposition enables streaming progress updates, durable execution that can pause and resume, and clear debugging since you can inspect state between steps.
  </Card>

<Card title="State is shared memory" icon="database" href="#step-3-design-your-state">
    Store raw data, not formatted text. This lets different nodes use the same information in different ways.
  </Card>

<Card title="Nodes are functions" icon="code" href="#step-4-build-your-nodes">
    They take state, do work, and return updates. When they need to make routing decisions, they specify both the state updates and the next destination.
  </Card>

<Card title="Errors are part of the flow" icon="triangle-exclamation" href="#handle-errors-appropriately">
    Transient failures get retries, LLM-recoverable errors loop back with context, user-fixable problems pause for input, and unexpected errors bubble up for debugging.
  </Card>

<Card title="Human input is first-class" icon="user" href="/oss/python/langgraph/interrupts">
    The `interrupt()` function pauses execution indefinitely, saves all state, and resumes exactly where it left off when you provide input. When combined with other operations in a node, it must come first.
  </Card>

<Card title="Graph structure emerges naturally" icon="diagram-project" href="#step-5-wire-it-together">
    You define the essential connections, and your nodes handle their own routing logic. This keeps control flow explicit and traceable - you can always understand what your agent will do next by looking at the current node.
  </Card>
</CardGroup>

### Advanced considerations

<Accordion title="Node granularity trade-offs" icon="sliders">
  <Info>
    This section explores the trade-offs in node granularity design. Most applications can skip this and use the patterns shown above.
  </Info>

You might wonder: why not combine `Read Email` and `Classify Intent` into one node?

Or why separate Doc Search from Draft Reply?

The answer involves trade-offs between resilience and observability.

**The resilience consideration:** LangGraph's [durable execution](/oss/python/langgraph/durable-execution) creates checkpoints at node boundaries. When a workflow resumes after an interruption or failure, it starts from the beginning of the node where execution stopped. Smaller nodes mean more frequent checkpoints, which means less work to repeat if something goes wrong. If you combine multiple operations into one large node, a failure near the end means re-executing everything from the start of that node.

Why we chose this breakdown for the email agent:

* **Isolation of external services:** Doc Search and Bug Track are separate nodes because they call external APIs. If the search service is slow or fails, we want to isolate that from the LLM calls. We can add retry policies to these specific nodes without affecting others.

* **Intermediate visibility:** Having `Classify Intent` as its own node lets us inspect what the LLM decided before taking action. This is valuable for debugging and monitoring—you can see exactly when and why the agent routes to human review.

* **Different failure modes:** LLM calls, database lookups, and email sending have different retry strategies. Separate nodes let you configure these independently.

* **Reusability and testing:** Smaller nodes are easier to test in isolation and reuse in other workflows.

A different valid approach: You could combine `Read Email` and `Classify Intent` into a single node. You'd lose the ability to inspect the raw email before classification and would repeat both operations on any failure in that node. For most applications, the observability and debugging benefits of separate nodes are worth the trade-off.

Application-level concerns: The caching discussion in Step 2 (whether to cache search results) is an application-level decision, not a LangGraph framework feature. You implement caching within your node functions based on your specific requirements—LangGraph doesn't prescribe this.

Performance considerations: More nodes doesn't mean slower execution. LangGraph writes checkpoints in the background by default ([async durability mode](/oss/python/langgraph/durable-execution#durability-modes)), so your graph continues running without waiting for checkpoints to complete. This means you get frequent checkpoints with minimal performance impact. You can adjust this behavior if needed—use `"exit"` mode to checkpoint only at completion, or `"sync"` mode to block execution until each checkpoint is written.
</Accordion>

### Where to go from here

This was an introduction to thinking about building agents with LangGraph. You can extend this foundation with:

<CardGroup cols={2}>
  <Card title="Human-in-the-loop patterns" icon="user-check" href="/oss/python/langgraph/interrupts">
    Learn how to add tool approval before execution, batch approval, and other patterns
  </Card>

<Card title="Subgraphs" icon="diagram-nested" href="/oss/python/langgraph/use-subgraphs">
    Create subgraphs for complex multi-step operations
  </Card>

<Card title="Streaming" icon="tower-broadcast" href="/oss/python/langgraph/streaming">
    Add streaming to show real-time progress to users
  </Card>

<Card title="Observability" icon="chart-line" href="/oss/python/langgraph/observability">
    Add observability with LangSmith for debugging and monitoring
  </Card>

<Card title="Tool Integration" icon="wrench" href="/oss/python/langchain/tools">
    Integrate more tools for web search, database queries, and API calls
  </Card>

<Card title="Retry Logic" icon="rotate" href="/oss/python/langgraph/use-graph-api#add-retry-policies">
    Implement retry logic with exponential backoff for failed operations
  </Card>
</CardGroup>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/thinking-in-langgraph.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Notice that the state contains only raw data – no prompt templates, no formatted strings, no instructions. The classification output is stored as a single dictionary, straight from the LLM.

## Step 4: Build your nodes

Now we implement each step as a function. A node in LangGraph is just a Python function that takes the current state and returns updates to it.

### Handle errors appropriately

Different errors need different handling strategies:

| Error Type                                                      | Who Fixes It       | Strategy                           | When to Use                                      |
| --------------------------------------------------------------- | ------------------ | ---------------------------------- | ------------------------------------------------ |
| Transient errors (network issues, rate limits)                  | System (automatic) | Retry policy                       | Temporary failures that usually resolve on retry |
| LLM-recoverable errors (tool failures, parsing issues)          | LLM                | Store error in state and loop back | LLM can see the error and adjust its approach    |
| User-fixable errors (missing information, unclear instructions) | Human              | Pause with `interrupt()`           | Need user input to proceed                       |
| Unexpected errors                                               | Developer          | Let them bubble up                 | Unknown issues that need debugging               |

<Tabs>
  <Tab title="Transient errors" icon="rotate">
    Add a retry policy to automatically retry network issues and rate limits:
```

Example 2 (unknown):
```unknown
</Tab>

  <Tab title="LLM-recoverable" icon="brain">
    Store the error in state and loop back so the LLM can see what went wrong and try again:
```

Example 3 (unknown):
```unknown
</Tab>

  <Tab title="User-fixable" icon="user">
    Pause and collect information from the user when needed (like account IDs, order numbers, or clarifications):
```

Example 4 (unknown):
```unknown
</Tab>

  <Tab title="Unexpected" icon="triangle-exclamation">
    Let them bubble up for debugging. Don't catch what you can't handle:
```

---

## Define the tools for the agent to use

**URL:** llms-txt#define-the-tools-for-the-agent-to-use

@tool
def search(query: str) -> str:
    """Call to surf the web."""
    # This is a placeholder, but don't tell the LLM that...
    if "sf" in query.lower() or "san francisco" in query.lower():
        return "It's 60 degrees and foggy."
    return "It's 90 degrees and sunny."

tools = [search]
tool_node = ToolNode(tools)
model = init_chat_model("claude-sonnet-4-5-20250929").bind_tools(tools)

---

## Define the tools our agent can use

**URL:** llms-txt#define-the-tools-our-agent-can-use

---

## Define your agents

**URL:** llms-txt#define-your-agents

market_researcher = Agent(
    role="Senior Market Researcher",
    goal="Analyze market trends and consumer behavior in the tech industry",
    backstory="""You are an experienced market researcher with 10+ years of experience
    analyzing technology markets. You excel at identifying emerging trends and
    understanding consumer needs.""",
    verbose=True,
    allow_delegation=False,
)

content_strategist = Agent(
    role="Content Marketing Strategist",
    goal="Create compelling marketing content based on research insights",
    backstory="""You are a creative content strategist who transforms complex market
    research into engaging marketing materials. You understand how to communicate
    technical concepts to different audiences.""",
    verbose=True,
    allow_delegation=False,
)

data_analyst = Agent(
    role="Data Analyst",
    goal="Provide statistical analysis and data-driven insights",
    backstory="""You are a skilled data analyst who can interpret complex datasets
    and provide actionable insights. You excel at finding patterns and trends
    in data that others might miss.""",
    verbose=True,
    allow_delegation=False,
)

---

## Deploy other frameworks

**URL:** llms-txt#deploy-other-frameworks

**Contents:**
- Prerequisites
- 1. Define Strands agent
- 2. Use Functional API to deploy on LangSmith Deployment
- 3. Set up tracing with OpenTelemetry

Source: https://docs.langchain.com/langsmith/deploy-other-frameworks

This guide shows you how to use [Functional API](/oss/python/langgraph/functional-api) to deploy a [Strands Agent](https://strandsagents.com/latest/documentation/docs/) on [LangSmith Deployment](/langsmith/deployments) and set up tracing for [LangSmith Observability](/langsmith/observability). You can follow the same approach with other frameworks like CrewAI, AutoGen, Google ADK.

Using Functional API and deploying to LangSmith Deployment provides several benefits:

* Production deployment: Deploy your integrated solution to [LangSmith Deployment](/langsmith/deployments) for scalable production use.
* Enhanced features: With Functional API, you can integrate your existing agents with [persistence](/oss/python/langgraph/persistence), [streaming](/langsmith/streaming), [short and long-term memory](/oss/python/concepts/memory) and more, with minimal changes to your existing code.
* Multi-agent systems: Build [multi-agent systems](/oss/python/langchain/multi-agent) where individual agents are built with different frameworks.

* Python 3.9+
* Dependencies: `pip install strands-agents strands-agents-tools langgraph`
* AWS Credentials in your environment

## 1. Define Strands agent

Create a Strands Agent with pre-built tools.

## 2. Use Functional API to deploy on LangSmith Deployment

[Functional API](/oss/python/langgraph/functional-api) allows you to intergate and deploy with frameworks other than LangChain. Functional API also provides the additional benefit to leverage other key features — persistence, memory, human-in-the-loop, and streaming — coupled with your existing agent, with minimal changes to your existing code.

It uses two key building blocks:

* **[`@entrypoint`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint)**: Marks a function as the starting point of a workflow, encapsulating logic and managing execution flow, including handling long-running tasks and interrupts.
* **[`@task`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.task)**: Represents a discrete unit of work, such as an API call or data processing step, that can be executed asynchronously within an entrypoint. Tasks return a future-like object that can be awaited or resolved synchronously.

## 3. Set up tracing with OpenTelemetry

In your environment variables, set up the following:

```python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
## 2. Use Functional API to deploy on LangSmith Deployment

[Functional API](/oss/python/langgraph/functional-api) allows you to intergate and deploy with frameworks other than LangChain. Functional API also provides the additional benefit to leverage other key features — persistence, memory, human-in-the-loop, and streaming — coupled with your existing agent, with minimal changes to your existing code.

It uses two key building blocks:

* **[`@entrypoint`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint)**: Marks a function as the starting point of a workflow, encapsulating logic and managing execution flow, including handling long-running tasks and interrupts.
* **[`@task`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.task)**: Represents a discrete unit of work, such as an API call or data processing step, that can be executed asynchronously within an entrypoint. Tasks return a future-like object that can be awaited or resolved synchronously.
```

Example 2 (unknown):
```unknown
## 3. Set up tracing with OpenTelemetry

In your environment variables, set up the following:
```

---

## Discover errors and usage patterns with the Insights Agent

**URL:** llms-txt#discover-errors-and-usage-patterns-with-the-insights-agent

**Contents:**
- Prerequisites
- Generate your first Insights Report
- Understand the results
  - Executive summary
  - Top-level categories
  - Subcategories
  - Individual traces
- Configure a job
  - Autogenerating a config
  - Choose a model provider

Source: https://docs.langchain.com/langsmith/insights

The Insights Agent automatically analyzes your traces to detect usage patterns, common agent behaviors and failure modes — without requiring you to manually review thousands of traces.
Insights uses hierarchical categorization to make sense of your data and highlight actionable trends.

<Note>
  Insights is available for LangSmith Plus and Enterprise [plans](https://www.langchain.com/pricing) and is only available for LangSmith SaaS deployments.
</Note>

* An OpenAI API key (generate one [here](https://platform.openai.com/account/api-keys)) or an Anthropic API key (generate one [here](https://console.anthropic.com/settings/keys))
* Permissions to create rules in LangSmith (required to generate new Insights Reports)
* Permissions to view tracing projects LangSmith (required to view existing Insights Reports)

## Generate your first Insights Report

<Frame caption="Auto configuration flow for Insights Agent">
  <img src="https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=1055fe5ac43cdce00c43297e818db6b6" data-og-width="1498" width="1498" data-og-height="1408" height="1408" data-path="langsmith/images/insights-autogenerate-config.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?w=280&fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=0c83b31a5a183ba5935b39b7b9de711d 280w, https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?w=560&fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=72217621fca8f07947a9461d75f42913 560w, https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?w=840&fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=b23c7627f8e62d8bebb7e94a0ec068da 840w, https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?w=1100&fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=5399d7c632e4bde4b5aefd4d19c8a175 1100w, https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?w=1650&fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=6be2b9f0c90979149f86e416c7cd4d8c 1650w, https://mintcdn.com/langchain-5e9cc07a/rp5c1TvRWS7-YcPd/langsmith/images/insights-autogenerate-config.png?w=2500&fit=max&auto=format&n=rp5c1TvRWS7-YcPd&q=85&s=adf51929b885117ba87e00be8f54d306 2500w" />
</Frame>

#### From the [LangSmith UI](https://smith.langchain.com):

1. Navigate to **Tracing Projects** in the left-hand menu and select a tracing project.
2. Click **+New** in the top right corner then **New Insights Report** to generate new insights over the project.
3. Enter a name for your job.
4. Click the <Icon icon="key" /> icon in the top right of the job creation pane to set your OpenAI (or Anthropic) API key as a [workspace secret](/langsmith/administration-overview#workspaces). If your workspace already has an OpenAI API key set, you can skip this step.
5. Answer the guided questions to focus your Insights Report on what you want to learn about your agent, then click **Run job**.

<Tip>Toggle to Manual mode to try [prebuilt configs](#using-a-prebuilt-config) for common use cases or [build your own](#building-a-config-from-scratch).</Tip>

This will kick off a background Insights Report. Reports can take up to 30 minutes to complete.

#### From the [LangSmith SDK](https://reference.langchain.com/python/langsmith/observability/sdk/client/#langsmith.client.Client):

You can generate Insights Reports over data stored outside LangSmith using the Python SDK. This allows you to analyze chat histories from your production systems, logs, or other sources.

When you call `generate_insights()`, the SDK will:

1. Upload your chat histories as traces to a new LangSmith project
2. Generate an Insights Report over those uploaded traces
3. Return a link to your results in the LangSmith UI

<CodeGroup>
  
</CodeGroup>

<Note>Generating insights over 1,000 threads typically costs \$1.00-\$2.00 with OpenAI models and \$3.00-\$4.00 with current Anthropic models. The cost scales with the number of threads sampled and the size of each thread.</Note>

## Understand the results

Once your job has completed, you can navigate to the **Insights** tab where you'll see a table of Insights Report. Each Report contains insights generated over a specific sample of traces from the tracing project.

<Frame caption="Insights Reports for a single tracing project">
  <img src="https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=6068ead08d93b27a31e85dd35bdbca01" data-og-width="2540" width="2540" data-og-height="836" height="836" data-path="langsmith/images/insights-job-results.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?w=280&fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=d89d356e627fe9b79a889f1b08f5b55e 280w, https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?w=560&fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=1e36efd2e207f240c943918bec0fb692 560w, https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?w=840&fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=81d1b513785c44c83e19e037ee2bac9c 840w, https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?w=1100&fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=bd6af403106f833511a03a2f2f58d866 1100w, https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?w=1650&fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=9de6145f9638aaa949b33cdae33de291 1650w, https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-job-results.png?w=2500&fit=max&auto=format&n=4-kFQm9_42J5OnwH&q=85&s=f062f61dcc789fbc72a6fdf11fb76603 2500w" />
</Frame>

Click into your job to see traces organized into a set of auto-generated categories.
You can drill down through categories and subcategories to view the underlying traces, feedback, and run statistics.

<Frame caption="Common topics of conversations with the https://chat.langchain.com chatbot">
  <img src="https://mintcdn.com/langchain-5e9cc07a/4-kFQm9_42J5OnwH/langsmith/images/insights-nav.gif?s=6a22bfd0d94262b7aa78468a8379ea0f" data-og-width="800" width="800" data-og-height="516" height="516" data-path="langsmith/images/insights-nav.gif" data-optimize="true" data-opv="3" />
</Frame>

### Executive summary

At the top of each report, you'll find an executive summary that surfaces the most important patterns discovered in your traces. This includes:

* Key findings with percentages showing how often each pattern appears.
* Clickable references (e.g., #1, #2, #3) to traces the agent identified as exceptionally relevant to your question.

<Frame caption="Executive summary showing key patterns with trace references">
  <img src="https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=d565a549c83bad50398fa7a276eae0af" data-og-width="2202" width="2202" data-og-height="706" height="706" data-path="langsmith/images/insights-summary.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?w=280&fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=c3fca1bea9412fb8363361d2702ce08b 280w, https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?w=560&fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=09f3dc0885400b40203f1d3783fba0c8 560w, https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?w=840&fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=78eb3bde377ec55798d0117797e1f255 840w, https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?w=1100&fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=75d04925165d1d6643c5e52ee5fb985b 1100w, https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?w=1650&fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=c8872251a924aad5385fb0fae3433811 1650w, https://mintcdn.com/langchain-5e9cc07a/Of41ZZ4fTt77Vjj5/langsmith/images/insights-summary.png?w=2500&fit=max&auto=format&n=Of41ZZ4fTt77Vjj5&q=85&s=36cf847b04549cdae06e274d7108d430 2500w" />
</Frame>

### Top-level categories

Your traces are automatically grouped into top-level categories that represent the broadest patterns in your data.

The distribution bars show how frequently each pattern occurs, making it easy to spot behaviors that happen more or less than expected.

Each category has a brief description and displays aggregated metrics over the traces it contains, including:

* Typical trace stats (like error rates, latency, cost)
* Feedback scores from your evaluators
* [Attributes](#attributes) extracted as part of the job

Clicking on any category shows a breakdown into subcategories, which gives you a more granular understanding of interaction patterns in that category of traces.

In the [Chat Langchain](https://chat.langchain.com) example pictured above, under "Data & Retrieval" there are subcategories like "Vector Stores" and "Data Ingestion".

### Individual traces

You can view the traces assigned to each category or subcategory by clicking through to see the traces table. From there, you can click into any trace to see the full conversation details.

You can create an Insights Report three ways. Start with the auto-generated flow to spin up a baseline, then iterate with saved or manual configs as you refine.

### Autogenerating a config

1. Open **New Insights** and make sure the **Auto** toggle is active.
2. Answer the natural-language questions about your agent’s purpose, what you want to learn, and how traces are structured. Insights will translate your answers into
   a draft config (job name, summary prompt, attributes, and sampling defaults).
3. Choose a provider, then click **Generate config** to preview or **Run job** to launch immediately.

**Providing useful context**

For best results, write a sentence or two for each prompt that gives the agent the context it needs—what you’re trying to learn, which signals or fields matter most, and anything you
already know isn’t useful. The clearer you are about what your agent does and how its traces are structured, the more the Insights Agent can group examples in a way
that’s specific, actionable, and aligned with how you reason about your data.

**Describing your traces**

Explain how your data is organized—are these single runs or multi-turn conversations? Which inputs and outputs contain the key information? This helps the Insights Agent generate summary prompts and attributes that focus on what matters. You can also directly specify variables from the [summary prompt](#summary-prompt) section if needed.

### Choose a model provider

You can select either OpenAI or Anthropic models to power the agent. You must have the corresponding [workspace secret](/langsmith/administration-overview#workspaces) set for whichever provider you choose (OPENAI\_API\_KEY or ANTHROPIC\_API\_KEY).

Note that using current Anthropic models costs \~3x as much as using OpenAI models.

### Using a prebuilt config

<Frame caption="Prebuilt configs in Manual mode">
  <img src="https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=fa979566d61807f4f40c91cf9c6928f4" data-og-width="2220" width="2220" data-og-height="1440" height="1440" data-path="langsmith/images/insights-manual-config.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?w=280&fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=9497dc72f079e1dcec91d6fa5dfa963f 280w, https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?w=560&fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=cad05d034c0631cebc422b04bc271f9a 560w, https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?w=840&fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=8bc66817b550b2b01b52bda398b02405 840w, https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?w=1100&fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=0852ae47cb4fd9f36d5dd7a9b143db63 1100w, https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?w=1650&fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=d9abc923c29876e8c4abd3217214be82 1650w, https://mintcdn.com/langchain-5e9cc07a/fy0PJHxgSvYe7jF3/langsmith/images/insights-manual-config.png?w=2500&fit=max&auto=format&n=fy0PJHxgSvYe7jF3&q=85&s=51763ece975ee35a4ff9ac02ae90d251 2500w" />
</Frame>

Use the **Saved configurations** dropdown to load presets for common jobs like **Usage Patterns** or **Error Analysis**. Run them directly for a fast start, or adjust filters, prompts, and providers before saving your customized version. To learn more about what you can customize, read the section below.

### Building a config from scratch

Building your own config helps when you need more control—for example, predefining categories you want your data to be grouped into or targeting traces that match specific feedback scores and filters.

* **Sample size**: The maximum number of traces to analyze. Currently capped at 1,000
* **Time range**: Traces are sampled from this time range
* **Filters**: Additional trace filters. As you adjust filters, you'll see how many traces match your criteria

By default, top-level categories are automatically generated bottom-up from the underlying traces.
In some instances, you know specific categories you're interested in upfront and want the job to bucket traces into those predefined categories.

The **Categories** section of the config lets you do this by enumerating the names and descriptions of the top-level categories you want to be used.
Subcategories are still auto-generated by the algorithm within the predefined top-level categories.

The first step of the job is to create a brief summary of every trace — it is these summaries that are then categorized.
Extracting the right information in the summary is essential for getting useful categories.
The prompt used to generate these summaries can be edited.

The two things to think about when editing the prompt are:

* Summarization instructions: Any information that isn't in the trace summary won't affect the categories that get generated, so make sure to provide clear instructions on what information is important to extract from each trace.
* Trace content: Use mustache formatting to specify which parts of each trace are passed to the summarizer. Large traces with lots of inputs and outputs can be expensive and noisy. Reducing the prompt to only include the most relevant parts of the trace can improve your results.

The Insights Agent analyzes [threads](https://docs.langchain.com/langsmith/threads) - groups of related traces that represent multi-turn conversations. You must specify what parts of the thread to send to the summarizer using at least one of these template variables:

| Variable | Best for                                                                | Example                                            |
| -------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| run.\*   | Access data from the most recent root run (i.e. final turn) in a thread | `{{run.inputs}}` `{{run.outputs}}` `{{run.error}}` |

You can also access nested fields using dot notation. For example, the prompt `"Summarize this: {{run.inputs.foo.bar}}"` will include only the "bar" value within the "foo" value of the last run's inputs.

Along with a summary, you can define additional categorical, numerical, and boolean attributes to be extracted from each trace.
These attributes will influence the categorization step — traces with similar attribute values will tend to be categorized together.
You can also see aggregations of these attributes per category.

As an example, you might want to extract the attribute `user_satisfied: boolean` from each trace to steer the algorithm towards categories that split up positive and negative user experiences, and to see the average user satisfaction per category.

#### Filter attributes

You can use the `filter_by` parameter on boolean attributes to pre-filter traces before generating insights. When enabled, only traces where the attribute evaluates to `true` are included in the analysis.

This is useful when you want to focus your Insights Report on a specific subset of traces—for example, only analyzing errors, only examining English-language conversations, or only including traces that meet certain quality criteria.

<Frame caption="Using filter attributes to generate Insights only on traces with agent errors">
  <img src="https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=8cb30778befb18af445c3f6db758e631" data-og-width="1244" width="1244" data-og-height="490" height="490" data-path="langsmith/images/insights-filter-by-attribute.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?w=280&fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=b2a047279e60e995ce9de7fb44be3fc3 280w, https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?w=560&fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=7fd3e854f73803434bc6490a33c77a1f 560w, https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?w=840&fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=84b9cc1cc25ad8cc98962b584bca3ad1 840w, https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?w=1100&fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=5d091df89be4d677139a21be120448f8 1100w, https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?w=1650&fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=a6d991b404f2da6551c2cc696428e030 1650w, https://mintcdn.com/langchain-5e9cc07a/L4LVgASBXoDKblmJ/langsmith/images/insights-filter-by-attribute.png?w=2500&fit=max&auto=format&n=L4LVgASBXoDKblmJ&q=85&s=8c3cf044ac694ceb4818407c74c96b2e 2500w" />
</Frame>

* Add `"filter_by": true` to any boolean attribute when creating a config for the Insights Agent
* The LLM evaluates each trace against the attribute description during summarization
* Traces where the attribute is `false` or missing are excluded before insights are generated

You can optionally save configs for future reuse using the 'save as' button.
This is especially useful if you want to compare Insights Reports over time to identify changes in user and agent behavior.

Select from previously saved configs in the dropdown in the top-left corner of the pane when creating a new Insights Report.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/insights.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Distributed tracing with Agent Server

**URL:** llms-txt#distributed-tracing-with-agent-server

**Contents:**
- How it works
- Configure the server

Source: https://docs.langchain.com/langsmith/agent-server-distributed-tracing

Unify traces when calling your deployed Agent Server from another service using RemoteGraph or the SDK.

When you call a deployed [Agent Server](/langsmith/agent-server) from another service, you can propagate trace context so that the entire request appears as a single unified trace in LangSmith. This uses LangSmith's [distributed tracing](/langsmith/distributed-tracing) capabilities, which propagate context via HTTP headers.

Distributed tracing links runs across services using context propagation headers:

1. The **client** infers the trace context from the current run and sends it as HTTP headers.
2. The **server** reads the headers and adds them to the run's config and metadata as `langsmith-trace` and `langsmith-project` configurable values. You can choose to use these to set the tracing context for a given run when your agent is used.

The headers used are:

* `langsmith-trace`: Contains the trace's dotted order.
* `baggage`: Specifies the LangSmith project and other optional tags and metadata.

To opt-in to distributed tracing, both client and server need to opt in.

## Configure the server

To accept distributed trace context, your graph must read the trace headers from the config and set the tracing context. The headers are passed through the `configurable` field as `langsmith-trace` and `langsmith-project`.

```python  theme={null}
import contextlib
import langsmith as ls
from langgraph.graph import StateGraph, MessagesState

---

## Enable LangSmith Deployment

**URL:** llms-txt#enable-langsmith-deployment

**Contents:**
- Overview
- Prerequisites
- Setup
- (Optional) Configure additional data planes
  - Prerequisites
  - Deploying to a different cluster
  - Deploying to a different namespace in the same cluster
- (Optional) Configure authentication for private registries
- Next steps

Source: https://docs.langchain.com/langsmith/deploy-self-hosted-full-platform

This guide shows you how to enable **LangSmith Deployment** on your [self-hosted LangSmith instance](/langsmith/kubernetes). This adds a [control plane](/langsmith/control-plane) and [data plane](/langsmith/data-plane) that let you deploy, scale, and manage agents and applications directly through the LangSmith UI.

After completing this guide, you'll have access to LangSmith [Observability](/langsmith/observability), [Evaluation](/langsmith/evaluation), and [Deployment](/langsmith/deployments).

<Info>**Important**<br /> Enabling LangSmith Deployment requires an [Enterprise](https://langchain.com/pricing) plan. </Info>

<Note>
  **This setup page is for enabling [LangSmith Deployment](/langsmith/deployments) on an existing LangSmith instance.**

Review the [self-hosted options](/langsmith/self-hosted) to understand:

* [LangSmith (observability)](/langsmith/self-hosted#langsmith): What you should install first.
  * [LangSmith Deployment](/langsmith/self-hosted#langsmith-deployment): What this guide enables.
  * [Standalone Server](/langsmith/self-hosted#standalone-server): Lightweight alternative without the UI.
</Note>

This guide builds on top of the [Kubernetes installation guide](/langsmith/kubernetes). **You must complete that guide first** before continuing. This page covers the additional setup steps required to enable LangSmith Deployment:

* Installing the LangGraph operator
* Configuring your ingress
* Connecting to the control plane

1. You are using Kubernetes.
2. You have an instance of [self-hosted LangSmith](/langsmith/kubernetes) running.
3. `KEDA` is installed on your cluster.

6. Ingress Configuration
   1. You must set up an ingress, gateway, or use Istio for your LangSmith instance. All agents will be deployed as Kubernetes services behind this ingress. Use this guide to [set up an ingress](/langsmith/self-host-ingress) for your instance.
7. You must have slack space in your cluster for multiple deployments. `Cluster-Autoscaler` is recommended to automatically provision new nodes.
8. A valid Dynamic PV provisioner or PVs available on your cluster. You can verify this by running:

9. Egress to `https://beacon.langchain.com` from your network. This is required for license verification and usage reporting if not running in air-gapped mode. See the [Egress documentation](/langsmith/self-host-egress) for more details.

1. As part of configuring your self-hosted LangSmith instance, you enable the `deployment` option. This will provision a few key resources.
   1. `listener`: This is a service that listens to the [control plane](/langsmith/control-plane) for changes to your deployments and creates/updates downstream CRDs.
   2. `LangGraphPlatform CRD`: A CRD for LangSmith Deployment. This contains the spec for managing an instance of a LangSmith deployment.
   3. `operator`: This operator handles changes to your LangSmith CRDs.
   4. `host-backend`: This is the [control plane](/langsmith/control-plane).

<Note>
  As of v0.12.0, the `langgraphPlatform` option is deprecated. Use `config.deployment` for any version after v0.12.0.
</Note>

2. Two additional images will be used by the chart. Use the images that are specified in the latest release.

3. In your config file for langsmith (usually `langsmith_config.yaml`), enable the `deployment` option. Note that you must also have a valid ingress setup:

4. In your `values.yaml` file, configure the `hostBackendImage` and `operatorImage` options (if you need to mirror images). If you are using a private container registry that requires authentication, you must also configure `imagePullSecrets`, refer to [Configure authentication for private registries](#optional-configure-authentication-for-private-registries).

5. You can also configure base templates for your agents by overriding the base templates [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L898).

Your self-hosted infrastructure is now ready to create deployments.

## (Optional) Configure additional data planes

In addition to the existing data plane already created in the above steps, you can create more data planes that reside in different Kubernetes clusters or the same cluster in a different namespace.

1. Read through the cluster organization guide in the [hybrid deployment documentation](/langsmith/hybrid#listeners) to understand how to best organize this for your use case.
2. Verify the prerequisites mentioned in the [hybrid](/langsmith/deploy-hybrid#prerequisites) section are met for the new cluster. Note that in step 5 of [this section](/langsmith/deploy-hybrid#prerequisites), you need to enable egress to your [self-hosted LangSmith instance](/langsmith/self-host-usage#configuring-the-application-you-want-to-use-with-langsmith) instead of [https://api.host.langchain.com](https://api.host.langchain.com) and [https://api.smith.langchain.com](https://api.smith.langchain.com).
3. Run the following commands against your LangSmith Postgres instance to enable this feature. This is the [Postgres instance](/langsmith/kubernetes#validate-your-deployment%3A) that comes with your self-hosted LangSmith setup.

Note down the workspace ID you choose as you will need this for future steps.

### Deploying to a different cluster

1. Follow steps 2-6 in the [hybrid setup guide](/langsmith/deploy-hybrid#setup). The `config.langsmithWorkspaceId` value should be set to the workspace ID you noted in the prerequisites.
2. To deploy more than one data plane to the cluster, follow the rules listed [here](/langsmith/deploy-hybrid#configuring-additional-data-planes-in-the-same-cluster).

### Deploying to a different namespace in the same cluster

1. You will need to make some modifications to the `langsmith_config.yaml` file you created in step 3 of the [above setup instructions](/langsmith/deploy-self-hosted-full-platform#setup):
   * Set the `operator.watchNamespaces` field to the current namespace your self-hosted LangSmith instance is running in. This is to prevent clashes with the operator that will be added as part of the new data plane.
   * It is required to use the [Gateway API](/langsmith/self-host-ingress#option-2%3A-gateway-api) or an [Istio Gateway](/langsmith/self-host-ingress#option-3%3A-istio-gateway). Please adjust your `langsmith_config.yaml` file accordingly.
2. Run a `helm upgrade` to update your self hosted LangSmith instance with the new config.
3. Follow steps 2-6 in the [hybrid setup guide](/langsmith/deploy-hybrid#setup). The `config.langsmithWorkspaceId` value should be set to the workspace ID you noted in the prerequisites. Remember that `config.watchNamespaces` should be set to different namespaces than the one used by the existing data plane!

## (Optional) Configure authentication for private registries

If your [Agent Server deployments](/langsmith/agent-server) will use images from private container registries (e.g., AWS ECR, Azure ACR, GCP Artifact Registry, private Docker registry), configure image pull secrets. This is a one-time infrastructure configuration that allows all deployments to automatically authenticate with your private registry.

**Step 1: Create a Kubernetes image pull secret**

Replace the values with your registry credentials:

* `myregistry.com`: Your registry URL
* `your-username`: Your registry username
* `your-password`: Your registry password or access token
* `langsmith`: The Kubernetes namespace where LangSmith is installed

**Step 2: Configure the deployment template in your `values.yaml`**

To enable agent server deployments to use the private registry secret, you must add `imagePullSecrets` to the operator's deployment template:

**Step 3: Apply during Helm installation/upgrade**

When you deploy or upgrade your LangSmith instance using Helm, this configuration will be applied. All user deployments created through the LangSmith UI will automatically inherit these registry credentials.

For registry-specific authentication methods (AWS ECR, Azure ACR, GCP Artifact Registry, etc.), refer to the [Kubernetes documentation on pulling images from private registries](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).

Once your infrastructure is set up, you're ready to deploy applications. See the deployment guides in the [Deployment tab](/langsmith/deployments) for instructions on building and deploying your applications.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/deploy-self-hosted-full-platform.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
6. Ingress Configuration
   1. You must set up an ingress, gateway, or use Istio for your LangSmith instance. All agents will be deployed as Kubernetes services behind this ingress. Use this guide to [set up an ingress](/langsmith/self-host-ingress) for your instance.
7. You must have slack space in your cluster for multiple deployments. `Cluster-Autoscaler` is recommended to automatically provision new nodes.
8. A valid Dynamic PV provisioner or PVs available on your cluster. You can verify this by running:
```

Example 2 (unknown):
```unknown
9. Egress to `https://beacon.langchain.com` from your network. This is required for license verification and usage reporting if not running in air-gapped mode. See the [Egress documentation](/langsmith/self-host-egress) for more details.

## Setup

1. As part of configuring your self-hosted LangSmith instance, you enable the `deployment` option. This will provision a few key resources.
   1. `listener`: This is a service that listens to the [control plane](/langsmith/control-plane) for changes to your deployments and creates/updates downstream CRDs.
   2. `LangGraphPlatform CRD`: A CRD for LangSmith Deployment. This contains the spec for managing an instance of a LangSmith deployment.
   3. `operator`: This operator handles changes to your LangSmith CRDs.
   4. `host-backend`: This is the [control plane](/langsmith/control-plane).

<Note>
  As of v0.12.0, the `langgraphPlatform` option is deprecated. Use `config.deployment` for any version after v0.12.0.
</Note>

2. Two additional images will be used by the chart. Use the images that are specified in the latest release.
```

Example 3 (unknown):
```unknown
3. In your config file for langsmith (usually `langsmith_config.yaml`), enable the `deployment` option. Note that you must also have a valid ingress setup:
```

Example 4 (unknown):
```unknown
4. In your `values.yaml` file, configure the `hostBackendImage` and `operatorImage` options (if you need to mirror images). If you are using a private container registry that requires authentication, you must also configure `imagePullSecrets`, refer to [Configure authentication for private registries](#optional-configure-authentication-for-private-registries).

5. You can also configure base templates for your agents by overriding the base templates [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L898).

   Your self-hosted infrastructure is now ready to create deployments.

## (Optional) Configure additional data planes

In addition to the existing data plane already created in the above steps, you can create more data planes that reside in different Kubernetes clusters or the same cluster in a different namespace.

### Prerequisites

1. Read through the cluster organization guide in the [hybrid deployment documentation](/langsmith/hybrid#listeners) to understand how to best organize this for your use case.
2. Verify the prerequisites mentioned in the [hybrid](/langsmith/deploy-hybrid#prerequisites) section are met for the new cluster. Note that in step 5 of [this section](/langsmith/deploy-hybrid#prerequisites), you need to enable egress to your [self-hosted LangSmith instance](/langsmith/self-host-usage#configuring-the-application-you-want-to-use-with-langsmith) instead of [https://api.host.langchain.com](https://api.host.langchain.com) and [https://api.smith.langchain.com](https://api.smith.langchain.com).
3. Run the following commands against your LangSmith Postgres instance to enable this feature. This is the [Postgres instance](/langsmith/kubernetes#validate-your-deployment%3A) that comes with your self-hosted LangSmith setup.
```

---

## Enable tracing before creating agents

**URL:** llms-txt#enable-tracing-before-creating-agents

**Contents:**
  - Step 4: Run your agent
- Advanced usage
  - Custom metadata and tags
- Troubleshooting
  - Spans not appearing in LangSmith
  - Messages not showing correctly
  - Connection issues
  - Import errors
  - Agent not responding

setup_langsmith()
python  theme={null}
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful voice AI assistant.
            You eagerly assist users with their questions.
            Keep responses concise and conversational.""",
        )
python  theme={null}
server = AgentServer()

@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
    # Create agent session with STT, LLM, TTS, and VAD
    session = AgentSession(
        stt="deepgram/nova-2:en",
        llm="openai/gpt-4o-mini",
        tts=openai.TTS(model="tts-1", voice="alloy"),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

# Start the session
    await session.start(
        room=ctx.room,
        agent=Assistant(),
    )

if __name__ == "__main__":
    # Run in console mode for local testing
    sys.argv = [sys.argv[0], "console"]
    agents.cli.run_app(server)
bash  theme={null}
python agent.py console
python  theme={null}
from opentelemetry import trace

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="You are a helpful assistant.",
        )

# Get current span and add custom attributes
        tracer = trace.get_tracer(__name__)
        span = trace.get_current_span()
        if span:
            span.set_attribute("langsmith.metadata.agent_type", "voice_assistant")
            span.set_attribute("langsmith.metadata.version", "1.0")
            span.set_attribute("langsmith.span.tags", "livekit,voice-ai,production")
```

### Spans not appearing in LangSmith

If traces aren't showing up in LangSmith:

1. **Verify environment variables**: Ensure `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS` are set correctly in your `.env` file.
2. **Check setup order**: Make sure `setup_langsmith()` is called **before** creating `AgentServer`.
3. **Check API key**: Confirm your LangSmith API key has write permissions.
4. **Look for confirmation**: You should see "✅ LangSmith tracing enabled" in the console when starting.

### Messages not showing correctly

If conversation messages aren't displaying properly:

1. **Check span processor**: Verify `langsmith_processor.py` is in your project directory and imported correctly.
2. **Verify imports**: Ensure `LangSmithSpanProcessor` is imported in your agent.py.
3. **Enable debug logging**: Set `LANGSMITH_PROCESSOR_DEBUG=true` in your environment to see detailed logs.

### Connection issues

If your agent can't connect to LiveKit:

1. **Verify LiveKit URL**: Check `LIVEKIT_URL` is set correctly in your `.env` file.
2. **Check credentials**: Ensure `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are correct.
3. **Test connection**: Try connecting to your LiveKit server with the LiveKit CLI first.
4. **Console mode**: For local testing, always use: `python agent.py console`.

If you're getting import errors:

1. **Install dependencies**: Run the complete pip install command from Step 1.
2. **Check Python version**: Ensure you're using Python 3.9 or higher.
3. **Verify langsmith\_processor**: Make sure `langsmith_processor.py` is downloaded and in the same directory as `agent.py`.
4. **Check LiveKit plugins**: Ensure you have the correct LiveKit plugins installed for your STT/LLM/TTS providers.

### Agent not responding

If your agent connects but doesn't respond:

1. **Check API keys**: Verify your OpenAI API key (or other provider keys) are correct.
2. **Test services**: Ensure your STT, LLM, and TTS services are accessible.
3. **Check instructions**: Make sure your Agent has proper instructions.
4. **Review logs**: Look for errors in the console output.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/trace-with-livekit.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
#### Part 2: Define your agent
```

Example 2 (unknown):
```unknown
#### Part 3: Set up the agent server
```

Example 3 (unknown):
```unknown
### Step 4: Run your agent

Run your voice agent in console mode for local testing:
```

Example 4 (unknown):
```unknown
Your agent will start and connect to LiveKit. Speak through your microphone, and all traces will automatically appear in LangSmith. Here is an example of a trace in LangSmith: [LangSmith trace with LiveKit](https://smith.langchain.com/public/0f583c03-6d2a-4a2c-a043-9588e387cb55/r)

View the complete [agent.py code](https://github.com/langchain-ai/voice-agents-tracing/blob/main/livekit/agent.py).

## Advanced usage

### Custom metadata and tags

You can add custom metadata to your traces using span attributes:
```

---

## Essentials

**URL:** llms-txt#essentials

**Contents:**
- Tools
- Triggers
- Memory and updates
- Custom models
- Sub-agents
- Human in the loop
  - Setting up approval steps
  - What you can do when your agent pauses
- Next steps

Source: https://docs.langchain.com/langsmith/agent-builder-essentials

Tools, triggers, memory, sub-agents, and approvals—everything you need in one place.

Tools let your agents interact with your apps and services. Your agents can send emails, create calendar events, post messages, search the web, and more. Choose from built-in tools for Gmail, Slack, Google Calendar, GitHub, and many others.

See [Supported tools](/langsmith/agent-builder-tools) for a complete list.

Triggers define when your agent should start running. You can connect your agent to external tools or time-based schedules, letting it respond automatically to messages, emails, or recurring events.

Here are some popular ways to trigger your agent:

<CardGroup cols={3}>
  <Card title="Slack" icon="slack">
    Activate your agent when messages are received in specific Slack channels.
  </Card>

<Card title="Gmail" icon="envelope">
    Trigger your agent when emails are received.
  </Card>

<Card title="Cron schedules" icon="clock">
    Run your agent on a time-based schedule for recurring tasks.
  </Card>
</CardGroup>

## Memory and updates

Your agents get smarter over time. They remember important information from previous conversations and can update themselves to work better.

* Memory: Agents remember relevant details from past interactions, so they can make better decisions in future conversations.
* Self-updates: Agents can add new tools, remove ones they don't need, or adjust their instructions to improve how they work.
* What stays the same: Agents can't change their name, description, or the triggers that start them.

Agent Builder supports custom models. You can override the default Anthropic or OpenAI model for a specific agent by editing the agent's settings:

1. In the [LangSmith UI](https://smith.langchain.com), navigate to the agent you want to edit.
2. Click on the <Icon icon="gear" /> settings icon in the top right corner.
3. In the **Model** section, select **+ Add custom model**.
4. Enter the model ID, display name, base URL, and API key name and value.
5. Click **Save**.

<Note>
  Custom models may not perform as well as built-in models. Test your custom model before using it in production.
</Note>

Build complex agents by breaking big tasks into smaller, specialized helpers. Think of sub-agents as a team of specialists—each one handles a specific part of the job while working together with your main agent.

This approach makes it easier to build sophisticated systems. Instead of one agent trying to do everything, you can have specialized helpers that each excel at their part of the task.

Here are some ways you might use sub-agents:

* Split into sub-tasks: Have one agent fetch data, another summarize it, and a third format the results.
* Specialized tools: Give different agents access to different tools based on what they need to do.
* Independent work: Let sub-agents work on their own, then bring their results back to the main agent.

Stay in control of important decisions. You can set up your agent to pause and ask for your approval before taking certain actions. This ensures your agent handles most tasks automatically, while you retain oversight.

### Setting up approval steps

<Steps>
  <Step title="Select a tool">
    When setting up your agent, choose the tool or action you want to review before it runs.
  </Step>

<Step title="Turn on approval">
    Find the approval option for that tool and switch it on.
  </Step>

<Step title="Agent waits for you">
    When your agent reaches that step, it will pause and wait for your approval before continuing.
  </Step>
</Steps>

### What you can do when your agent pauses

When your agent stops to ask for approval, you have three options:

<CardGroup cols={3}>
  <Card title="Accept" icon="check">
    Give the green light and let your agent proceed with its plan.
  </Card>

<Card title="Edit" icon="pen-to-square">
    Modify the agent's message or parameters before allowing it to continue.
  </Card>

<Card title="Send feedback" icon="comment">
    Share feedback to help your agent learn and improve.
  </Card>
</CardGroup>

* [Set up your workspace](/langsmith/agent-builder-setup)
* [Connect apps and services](/langsmith/agent-builder-tools)
* [Use remote connections](/langsmith/agent-builder-mcp-framework)
* [Choose between workspace and private agents](/langsmith/agent-builder-workspace-vs-private)
* [Call agents from your app](/langsmith/agent-builder-code)

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-essentials.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Evaluate a complex agent

**URL:** llms-txt#evaluate-a-complex-agent

**Contents:**
- Setup
  - Configure the environment
  - Download the database

Source: https://docs.langchain.com/langsmith/evaluate-complex-agent

<Info>
  [Agent evaluation](/langsmith/evaluation-concepts#agents) | [Evaluators](/langsmith/evaluation-concepts#evaluators) | [LLM-as-judge evaluators](/langsmith/evaluation-concepts#llm-as-judge)
</Info>

In this tutorial, we'll build a customer support bot that helps users navigate a digital music store. Then, we'll go through the three most effective types of evaluations to run on chat bots:

* [Final response](/langsmith/evaluation-concepts#evaluating-an-agents-final-response): Evaluate the agent's final response.
* [Trajectory](/langsmith/evaluation-concepts#evaluating-an-agents-trajectory): Evaluate whether the agent took the expected path (e.g., of tool calls) to arrive at the final answer.
* [Single step](/langsmith/evaluation-concepts#evaluating-a-single-step-of-an-agent): Evaluate any agent step in isolation (e.g., whether it selects the appropriate first tool for a given step).

We'll build our agent using [LangGraph](https://github.com/langchain-ai/langgraph), but the techniques and LangSmith functionality shown here are framework-agnostic.

### Configure the environment

Let's install the required dependencies:

Let's set up environment variables for OpenAI and [LangSmith](https://smith.langchain.com):

### Download the database

We will create a SQLite database for this tutorial. SQLite is a lightweight database that is easy to set up and use. We will load the `chinook` database, which is a sample database that represents a digital media store. Find more information about the database [here](https://www.sqlitetutorial.net/sqlite-sample-database/).

For convenience, we have hosted the database in a public GCS bucket:

Here's a sample of the data in the db:

```python  theme={null}
import sqlite3

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

Let's set up environment variables for OpenAI and [LangSmith](https://smith.langchain.com):
```

Example 3 (unknown):
```unknown
### Download the database

We will create a SQLite database for this tutorial. SQLite is a lightweight database that is easy to set up and use. We will load the `chinook` database, which is a sample database that represents a digital media store. Find more information about the database [here](https://www.sqlitetutorial.net/sqlite-sample-database/).

For convenience, we have hosted the database in a public GCS bucket:
```

Example 4 (unknown):
```unknown
Here's a sample of the data in the db:
```

---

## FilesystemMiddleware is included by default in create_deep_agent

**URL:** llms-txt#filesystemmiddleware-is-included-by-default-in-create_deep_agent

---

## Get Tavily API key: https://tavily.com

**URL:** llms-txt#get-tavily-api-key:-https://tavily.com

**Contents:**
  - Define the application

os.environ["TAVILY_API_KEY"] = "YOUR TAVILY API KEY"
python  theme={null}
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_community.tools import DuckDuckGoSearchRun, TavilySearchResults
from langchain_core.rate_limiters import InMemoryRateLimiter

**Examples:**

Example 1 (unknown):
```unknown
### Define the application

For this example lets create a simple Tweet-writing application that has access to some internet search tools:
```

---

## Graph API: Clear visualization of decision paths

**URL:** llms-txt#graph-api:-clear-visualization-of-decision-paths

from langgraph.graph import StateGraph
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    current_tool: str
    retry_count: int

def should_continue(state):
    if state["retry_count"] > 3:
        return "end"
    elif state["current_tool"] == "search":
        return "process_search"
    else:
        return "call_llm"

workflow = StateGraph(AgentState)
workflow.add_node("call_llm", call_llm_node)
workflow.add_node("process_search", search_node)
workflow.add_conditional_edges("call_llm", should_continue)
python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
**2. State management across multiple components**

When you need to share and coordinate state between different parts of your workflow, the Graph API's explicit state management is beneficial.
```

---

## Guardrails

**URL:** llms-txt#guardrails

**Contents:**
- Built-in guardrails
  - PII detection

Source: https://docs.langchain.com/oss/python/langchain/guardrails

Implement safety checks and content filtering for your agents

Guardrails help you build safe, compliant AI applications by validating and filtering content at key points in your agent's execution. They can detect sensitive information, enforce content policies, validate outputs, and prevent unsafe behaviors before they cause problems.

Common use cases include:

* Preventing PII leakage
* Detecting and blocking prompt injection attacks
* Blocking inappropriate or harmful content
* Enforcing business rules and compliance requirements
* Validating output quality and accuracy

You can implement guardrails using [middleware](/oss/python/langchain/middleware) to intercept execution at strategic points - before the agent starts, after it completes, or around model and tool calls.

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware flow diagram" className="rounded-lg" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />
</div>

Guardrails can be implemented using two complementary approaches:

<CardGroup cols={2}>
  <Card title="Deterministic guardrails" icon="list-check">
    Use rule-based logic like regex patterns, keyword matching, or explicit checks. Fast, predictable, and cost-effective, but may miss nuanced violations.
  </Card>

<Card title="Model-based guardrails" icon="brain">
    Use LLMs or classifiers to evaluate content with semantic understanding. Catch subtle issues that rules miss, but are slower and more expensive.
  </Card>
</CardGroup>

LangChain provides both built-in guardrails (e.g., [PII detection](#pii-detection), [human-in-the-loop](#human-in-the-loop)) and a flexible middleware system for building custom guardrails using either approach.

## Built-in guardrails

LangChain provides built-in middleware for detecting and handling Personally Identifiable Information (PII) in conversations. This middleware can detect common PII types like emails, credit cards, IP addresses, and more.

PII detection middleware is helpful for cases such as health care and financial applications with compliance requirements, customer service agents that need to sanitize logs, and generally any application handling sensitive user data.

The PII middleware supports multiple strategies for handling detected PII:

| Strategy | Description                             | Example               |
| -------- | --------------------------------------- | --------------------- |
| `redact` | Replace with `[REDACTED_{PII_TYPE}]`    | `[REDACTED_EMAIL]`    |
| `mask`   | Partially obscure (e.g., last 4 digits) | `****-****-****-1234` |
| `hash`   | Replace with deterministic hash         | `a8f5f167...`         |
| `block`  | Raise exception when detected           | Error thrown          |

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[customer_service_tool, email_tool],
    middleware=[
        # Redact emails in user input before sending to model
        PIIMiddleware(
            "email",
            strategy="redact",
            apply_to_input=True,
        ),
        # Mask credit cards in user input
        PIIMiddleware(
            "credit_card",
            strategy="mask",
            apply_to_input=True,
        ),
        # Block API keys - raise error if detected
        PIIMiddleware(
            "api_key",
            detector=r"sk-[a-zA-Z0-9]{32}",
            strategy="block",
            apply_to_input=True,
        ),
    ],
)

---

## Handoffs

**URL:** llms-txt#handoffs

**Contents:**
- Key characteristics
- When to use
- Basic implementation
- Implementation approaches
  - Single agent with middleware
  - Multiple agent subgraphs
- Implementation Considerations

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs

In the **handoffs** architecture, behavior changes dynamically based on state. The core mechanism: [tools](/oss/python/langchain/tools) update a state variable (e.g., `current_step` or `active_agent`) that persists across turns, and the system reads this variable to adjust behavior—either applying different configuration (system prompt, tools) or routing to a different [agent](/oss/python/langchain/agents). This pattern supports both handoffs between distinct agents and dynamic configuration changes within a single agent.

<Tip>
  The term **handoffs** was coined by [OpenAI](https://openai.github.io/openai-agents-python/handoffs/) for using tool calls (e.g., `transfer_to_sales_agent`) to transfer control between agents or states.
</Tip>

## Key characteristics

* State-driven behavior: Behavior changes based on a state variable (e.g., `current_step` or `active_agent`)
* Tool-based transitions: Tools update the state variable to move between states
* Direct user interaction: Each state's configuration handles user messages directly
* Persistent state: State survives across conversation turns

Use the handoffs pattern when you need to enforce sequential constraints (unlock capabilities only after preconditions are met), the agent needs to converse directly with the user across different states, or you're building multi-stage conversational flows. This pattern is particularly valuable for customer support scenarios where you need to collect information in a specific sequence — for example, collecting a warranty ID before processing a refund.

## Basic implementation

The core mechanism is a [tool](/oss/python/langchain/tools) that returns a [`Command`](/oss/python/langgraph/graph-api#command) to update state, triggering a transition to a new step or agent:

<Note>
  **Why include a `ToolMessage`?** When an LLM calls a tool, it expects a response. The `ToolMessage` with matching `tool_call_id` completes this request-response cycle—without it, the conversation history becomes malformed. This is required whenever your handoff tool updates messages.
</Note>

For a complete implementation, see the tutorial below.

<Card title="Tutorial: Build customer support with handoffs" icon="people-arrows" href="/oss/python/langchain/multi-agent/handoffs-customer-support" arrow cta="Learn more">
  Learn how to build a customer support agent using the handoffs pattern, where a single agent transitions between different configurations.
</Card>

## Implementation approaches

There are two ways to implement handoffs: **[single agent with middleware](#single-agent-with-middleware)** (one agent with dynamic configuration) or **[multiple agent subgraphs](#multiple-agent-subgraphs)** (distinct agents as graph nodes).

### Single agent with middleware

A single agent changes its behavior based on state. Middleware intercepts each model call and dynamically adjusts the system prompt and available tools. Tools update the state variable to trigger transitions:

<Accordion title="Complete example: Customer support with middleware">
  
</Accordion>

### Multiple agent subgraphs

Multiple distinct agents exist as separate nodes in a graph. Handoff tools navigate between agent nodes using `Command.PARENT` to specify which node to execute next.

<Warning>
  Subgraph handoffs require careful **[context engineering](/oss/python/langchain/context-engineering)**. Unlike single-agent middleware (where message history flows naturally), you must explicitly decide what messages pass between agents. Get this wrong and agents receive malformed conversation history or bloated context. See [Context engineering](#context-engineering) below.
</Warning>

<Accordion title="Complete example: Sales and support with handoffs">
  This example shows a multi-agent system with separate sales and support agents. Each agent is a separate graph node, and handoff tools allow agents to transfer conversations to each other.

<Tip>
  Use **single agent with middleware** for most handoffs use cases—it's simpler. Only use **multiple agent subgraphs** when you need bespoke agent implementations (e.g., a node that's itself a complex graph with reflection or retrieval steps).
</Tip>

#### Context engineering

With subgraph handoffs, you control exactly what messages flow between agents. This precision is essential for maintaining valid conversation history and avoiding context bloat that could confuse downstream agents. For more on this topic, see [context engineering](/oss/python/langchain/context-engineering).

**Handling context during handoffs**

When handing off between agents, you need to ensure the conversation history remains valid. LLMs expect tool calls to be paired with their responses, so when using `Command.PARENT` to hand off to another agent, you must include both:

1. **The `AIMessage` containing the tool call** (the message that triggered the handoff)
2. **A `ToolMessage` acknowledging the handoff** (the artificial response to that tool call)

Without this pairing, the receiving agent will see an incomplete conversation and may produce errors or unexpected behavior.

The example below assumes only the handoff tool was called (no parallel tool calls):

<Note>
  **Why not pass all subagent messages?** While you could include the full subagent conversation in the handoff, this often creates problems. The receiving agent may become confused by irrelevant internal reasoning, and token costs increase unnecessarily. By passing only the handoff pair, you keep the parent graph's context focused on high-level coordination. If the receiving agent needs additional context, consider summarizing the subagent's work in the ToolMessage content instead of passing raw message history.
</Note>

**Returning control to the user**

When returning control to the user (ending the agent's turn), ensure the final message is an `AIMessage`. This maintains valid conversation history and signals to the user interface that the agent has finished its work.

## Implementation Considerations

As you design your multi-agent system, consider:

* **Context filtering strategy**: Will each agent receive full conversation history, filtered portions, or summaries? Different agents may need different context depending on their role.
* **Tool semantics**: Clarify whether handoff tools only update routing state or also perform side effects. For example, should `transfer_to_sales()` also create a support ticket, or should that be a separate action?
* **Token efficiency**: Balance context completeness against token costs. Summarization and selective context passing become more important as conversations grow longer.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/handoffs.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Key characteristics

* State-driven behavior: Behavior changes based on a state variable (e.g., `current_step` or `active_agent`)
* Tool-based transitions: Tools update the state variable to move between states
* Direct user interaction: Each state's configuration handles user messages directly
* Persistent state: State survives across conversation turns

## When to use

Use the handoffs pattern when you need to enforce sequential constraints (unlock capabilities only after preconditions are met), the agent needs to converse directly with the user across different states, or you're building multi-stage conversational flows. This pattern is particularly valuable for customer support scenarios where you need to collect information in a specific sequence — for example, collecting a warranty ID before processing a refund.

## Basic implementation

The core mechanism is a [tool](/oss/python/langchain/tools) that returns a [`Command`](/oss/python/langgraph/graph-api#command) to update state, triggering a transition to a new step or agent:
```

Example 2 (unknown):
```unknown
<Note>
  **Why include a `ToolMessage`?** When an LLM calls a tool, it expects a response. The `ToolMessage` with matching `tool_call_id` completes this request-response cycle—without it, the conversation history becomes malformed. This is required whenever your handoff tool updates messages.
</Note>

For a complete implementation, see the tutorial below.

<Card title="Tutorial: Build customer support with handoffs" icon="people-arrows" href="/oss/python/langchain/multi-agent/handoffs-customer-support" arrow cta="Learn more">
  Learn how to build a customer support agent using the handoffs pattern, where a single agent transitions between different configurations.
</Card>

## Implementation approaches

There are two ways to implement handoffs: **[single agent with middleware](#single-agent-with-middleware)** (one agent with dynamic configuration) or **[multiple agent subgraphs](#multiple-agent-subgraphs)** (distinct agents as graph nodes).

### Single agent with middleware

A single agent changes its behavior based on state. Middleware intercepts each model call and dynamically adjusts the system prompt and available tools. Tools update the state variable to trigger transitions:
```

Example 3 (unknown):
```unknown
<Accordion title="Complete example: Customer support with middleware">
```

Example 4 (unknown):
```unknown
</Accordion>

### Multiple agent subgraphs

Multiple distinct agents exist as separate nodes in a graph. Handoff tools navigate between agent nodes using `Command.PARENT` to specify which node to execute next.

<Warning>
  Subgraph handoffs require careful **[context engineering](/oss/python/langchain/context-engineering)**. Unlike single-agent middleware (where message history flows naturally), you must explicitly decide what messages pass between agents. Get this wrong and agents receive malformed conversation history or bloated context. See [Context engineering](#context-engineering) below.
</Warning>
```

---

## How to add custom lifespan events

**URL:** llms-txt#how-to-add-custom-lifespan-events

**Contents:**
- Create app

Source: https://docs.langchain.com/langsmith/custom-lifespan

When deploying agents to LangSmith, you often need to initialize resources like database connections when your server starts up, and ensure they're properly closed when it shuts down. Lifespan events let you hook into your server's startup and shutdown sequence to handle these critical setup and teardown tasks.

This works the same way as [adding custom routes](/langsmith/custom-routes). You just need to provide your own [`Starlette`](https://www.starlette.io/applications/) app (including [`FastAPI`](https://fastapi.tiangolo.com/), [`FastHTML`](https://fastht.ml/) and other compatible apps).

Below is an example using FastAPI.

<Note>
  "Python only"
  We currently only support custom lifespan events in Python deployments with `langgraph-api>=0.0.26`.
</Note>

Starting from an **existing** LangSmith application, add the following lifespan code to your `webapp.py` file. If you are starting from scratch, you can create a new app from a template using the CLI.

Once you have a LangGraph project, add the following app code:

```python {highlight={19}} theme={null}

**Examples:**

Example 1 (unknown):
```unknown
Once you have a LangGraph project, add the following app code:
```

---

## How to add custom middleware

**URL:** llms-txt#how-to-add-custom-middleware

**Contents:**
- Create app

Source: https://docs.langchain.com/langsmith/custom-middleware

When deploying agents to LangSmith, you can add custom middleware to your server to handle concerns like logging request metrics, injecting or checking headers, and enforcing security policies without modifying core server logic. This works the same way as [adding custom routes](/langsmith/custom-routes). You just need to provide your own [`Starlette`](https://www.starlette.io/applications/) app (including [`FastAPI`](https://fastapi.tiangolo.com/), [`FastHTML`](https://fastht.ml/) and other compatible apps).

Adding middleware lets you intercept and modify requests and responses globally across your deployment, whether they're hitting your custom endpoints or the built-in LangSmith APIs.

Below is an example using FastAPI.

<Note>
  "Python only"
  We currently only support custom middleware in Python deployments with `langgraph-api>=0.0.26`.
</Note>

Starting from an **existing** LangSmith application, add the following middleware code to your `webapp.py` file. If you are starting from scratch, you can create a new app from a template using the CLI.

Once you have a LangGraph project, add the following app code:

```python {highlight={5}} theme={null}

**Examples:**

Example 1 (unknown):
```unknown
Once you have a LangGraph project, add the following app code:
```

---

## How to add custom routes

**URL:** llms-txt#how-to-add-custom-routes

**Contents:**
- Create app

Source: https://docs.langchain.com/langsmith/custom-routes

When deploying agents to LangSmith Deployment, your server automatically exposes routes for creating runs and threads, interacting with the long-term memory store, managing configurable assistants, and other core functionality ([see all default API endpoints](/langsmith/server-api-ref)).

You can add custom routes by providing your own [`Starlette`](https://www.starlette.io/applications/) app (including [`FastAPI`](https://fastapi.tiangolo.com/), [`FastHTML`](https://fastht.ml/) and other compatible apps). You make LangSmith aware of this by providing a path to the app in your `langgraph.json` configuration file.

Defining a custom app object lets you add any routes you'd like, so you can do anything from adding a `/login` endpoint to writing an entire full-stack web-app, all deployed in a single Agent Server.

Below is an example using FastAPI.

Starting from an **existing** LangSmith application, add the following custom route code to your `webapp.py` file. If you are starting from scratch, you can create a new app from a template using the CLI.

Once you have a LangGraph project, add the following app code:

```python {highlight={4}} theme={null}

**Examples:**

Example 1 (unknown):
```unknown
Once you have a LangGraph project, add the following app code:
```

---

## How to add semantic search to your agent deployment

**URL:** llms-txt#how-to-add-semantic-search-to-your-agent-deployment

**Contents:**
- Prerequisites
- Steps

Source: https://docs.langchain.com/langsmith/semantic-search

This guide explains how to add semantic search to your deployment's cross-thread [store](/oss/python/langgraph/persistence#memory-store), so that your agent can search for memories and other documents by semantic similarity.

* A deployment (refer to [how to set up an application for deployment](/langsmith/setup-app-requirements-txt)) and details on [hosting options](/langsmith/platform-setup).
* API keys for your embedding provider (in this case, OpenAI).
* `langchain >= 0.3.8` (if you specify using the string format below).

1. Update your `langgraph.json` configuration file to include the store configuration:

* Uses OpenAI's text-embedding-3-small model for generating embeddings
* Sets the embedding dimension to 1536 (matching the model's output)
* Indexes all fields in your stored data (`["$"]` means index everything, or specify specific fields like `["text", "metadata.title"]`)

1. To use the string embedding format above, make sure your dependencies include `langchain >= 0.3.8`:

```toml  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
This configuration:

* Uses OpenAI's text-embedding-3-small model for generating embeddings
* Sets the embedding dimension to 1536 (matching the model's output)
* Indexes all fields in your stored data (`["$"]` means index everything, or specify specific fields like `["text", "metadata.title"]`)

1. To use the string embedding format above, make sure your dependencies include `langchain >= 0.3.8`:
```

---

## How to evaluate with repetitions

**URL:** llms-txt#how-to-evaluate-with-repetitions

**Contents:**
- Configuring repetitions on an experiment
- Viewing results of experiments run with repetitions

Source: https://docs.langchain.com/langsmith/repetition

Running multiple repetitions can give a more accurate estimate of the performance of your system since LLM outputs are not deterministic. Outputs can differ from one repetition to the next. Repetitions are a way to reduce noise in systems prone to high variability, such as agents.

## Configuring repetitions on an experiment

Add the optional `num_repetitions` param to the `evaluate` / `aevaluate` function ([Python](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate), [TypeScript](https://docs.smith.langchain.com/reference/js/interfaces/evaluation.EvaluateOptions#numrepetitions)) to specify how many times to evaluate over each example in your dataset. For instance, if you have 5 examples in the dataset and set `num_repetitions=5`, each example will be run 5 times, for a total of 25 runs.

## Viewing results of experiments run with repetitions

If you've run your experiment with [repetitions](/langsmith/evaluation-concepts#repetitions), there will be arrows in the output results column so you can view outputs in the table. To view each run from the repetition, hover over the output cell and click the expanded view. When you run an experiment with repetitions, LangSmith displays the average for each feedback score in the table. Click on the feedback score to view the feedback scores from individual runs, or to view the standard deviation across repetitions.

<img src="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=60962de04e5533d7718ca60fa9c7dcce" alt="Repetitions" data-og-width="1636" width="1636" data-og-height="959" height="959" data-path="langsmith/images/repetitions.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?w=280&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=8be83801a53f2544883faf173bc16ef1 280w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?w=560&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=7a924559be193efcc2c77dba3fea1231 560w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?w=840&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=25cbd580d06bda48419b83401c268c2d 840w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?w=1100&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=9da3908c81d1c8fd44dde6d3ec7dfe1d 1100w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?w=1650&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=775af0be371e662bea7ba7e29c2f21fd 1650w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/repetitions.png?w=2500&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=4d593460688be852a64638f092cba9f3 2500w" />

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/repetition.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

---

## How to evaluate your agent with trajectory evaluations

**URL:** llms-txt#how-to-evaluate-your-agent-with-trajectory-evaluations

**Contents:**
- Installing AgentEvals
- Trajectory match evaluator
  - Strict match
  - Unordered match
  - Subset and superset match
- LLM-as-judge evaluator
  - Without reference trajectory
  - With reference trajectory
- Async support (Python)

Source: https://docs.langchain.com/langsmith/trajectory-evals

Many agent behaviors only emerge when using a real LLM, such as which tool the agent decides to call, how it formats responses, or whether a prompt modification affects the entire execution trajectory. LangChain's [`agentevals`](https://github.com/langchain-ai/agentevals) package provides evaluators specifically designed for testing agent trajectories with live models.

<Note>
  This guide covers the open source [LangChain](/oss/python/langchain/overview) `agentevals` package, which integrates with LangSmith for trajectory evaluation.
</Note>

AgentEvals allows you to evaluate the trajectory of your agent (the exact sequence of messages, including tool calls) by performing a *trajectory match* or by using an *LLM judge*:

<Card title="Trajectory match" icon="equals" arrow="true" href="#trajectory-match-evaluator">
  Hard-code a reference trajectory for a given input and validate the run via a step-by-step comparison.

Ideal for testing well-defined workflows where you know the expected behavior. Use when you have specific expectations about which tools should be called and in what order. This approach is deterministic, fast, and cost-effective since it doesn't require additional LLM calls.
</Card>

<Card title="LLM-as-judge" icon="gavel" arrow="true" href="#llm-as-judge-evaluator">
  Use a LLM to qualitatively validate your agent's execution trajectory. The "judge" LLM reviews the agent's decisions against a prompt rubric (which can include a reference trajectory).

More flexible and can assess nuanced aspects like efficiency and appropriateness, but requires an LLM call and is less deterministic. Use when you want to evaluate the overall quality and reasonableness of the agent's trajectory without strict tool call or ordering requirements.
</Card>

## Installing AgentEvals

Or, clone the [AgentEvals repository](https://github.com/langchain-ai/agentevals) directly.

## Trajectory match evaluator

AgentEvals offers the `create_trajectory_match_evaluator` function in Python and `createTrajectoryMatchEvaluator` in TypeScript to match your agent's trajectory against a reference trajectory.

You can use the following modes:

| Mode                                     | Description                                               | Use Case                                                              |
| ---------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| [`strict`](#strict-match)                | Exact match of messages and tool calls in the same order  | Testing specific sequences (e.g., policy lookup before authorization) |
| [`unordered`](#unordered-match)          | Same tool calls allowed in any order                      | Verifying information retrieval when order doesn't matter             |
| [`subset`](#subset-and-superset-match)   | Agent calls only tools from reference (no extras)         | Ensuring agent doesn't exceed expected scope                          |
| [`superset`](#subset-and-superset-match) | Agent calls at least the reference tools (extras allowed) | Verifying minimum required actions are taken                          |

The `strict` mode ensures trajectories contain identical messages in the same order with the same tool calls, though it allows for differences in message content. This is useful when you need to enforce a specific sequence of operations, such as requiring a policy lookup before authorizing an action.

The `unordered` mode allows the same tool calls in any order, which is helpful when you want to verify that the correct set of tools are being invoked but don't care about the sequence. For example, an agent might need to check both weather and events for a city, but the order doesn't matter.

### Subset and superset match

The `superset` and `subset` modes focus on which tools are called rather than the order of tool calls, allowing you to control how strictly the agent's tool calls must align with the reference.

* Use `superset` mode when you want to verify that a few key tools are called in the execution, but you're okay with the agent calling additional tools. The agent's trajectory must include at least all the tool calls in the reference trajectory, and may include additional tool calls beyond the reference.
* Use `subset` mode to ensure agent efficiency by verifying that the agent did not call any irrelevant or unnecessary tools beyond those in the reference. The agent's trajectory must include only tool calls that appear in the reference trajectory.

The following example demonstrates `superset` mode, where the reference trajectory only requires the `get_weather` tool, but the agent can call additional tools:

<Info>
  You can also customize how the evaluator considers equality between tool calls in the actual trajectory vs. the reference by setting the `tool_args_match_mode` (Python) or `toolArgsMatchMode` (TypeScript) property, as well as the `tool_args_match_overrides` (Python) or `toolArgsMatchOverrides` (TypeScript) property. By default, only tool calls with the same arguments to the same tool are considered equal. Visit the [repository](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#tool-args-match-modes) for more details.
</Info>

## LLM-as-judge evaluator

<Note>
  This section covers the trajectory-specific LLM-as-a-judge evaluator from the `agentevals` package. For general-purpose LLM-as-a-judge evaluators in LangSmith, refer to the [LLM-as-a-judge evaluator](/langsmith/llm-as-judge).
</Note>

You can also use an LLM to evaluate the agent's execution path. Unlike the trajectory match evaluators, it doesn't require a reference trajectory, but one can be provided if available.

### Without reference trajectory

### With reference trajectory

If you have a reference trajectory, you can add an extra variable to your prompt and pass in the reference trajectory. Below, we use the prebuilt `TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE` prompt and configure the `reference_outputs` variable:

<Info>
  For more configurability over how the LLM evaluates the trajectory, visit the [repository](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#trajectory-llm-as-judge).
</Info>

## Async support (Python)

All `agentevals` evaluators support Python asyncio. For evaluators that use factory functions, async versions are available by adding `async` after `create_` in the function name.

Here's an example using the async judge and evaluator:

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/trajectory-evals.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

Or, clone the [AgentEvals repository](https://github.com/langchain-ai/agentevals) directly.

## Trajectory match evaluator

AgentEvals offers the `create_trajectory_match_evaluator` function in Python and `createTrajectoryMatchEvaluator` in TypeScript to match your agent's trajectory against a reference trajectory.

You can use the following modes:

| Mode                                     | Description                                               | Use Case                                                              |
| ---------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| [`strict`](#strict-match)                | Exact match of messages and tool calls in the same order  | Testing specific sequences (e.g., policy lookup before authorization) |
| [`unordered`](#unordered-match)          | Same tool calls allowed in any order                      | Verifying information retrieval when order doesn't matter             |
| [`subset`](#subset-and-superset-match)   | Agent calls only tools from reference (no extras)         | Ensuring agent doesn't exceed expected scope                          |
| [`superset`](#subset-and-superset-match) | Agent calls at least the reference tools (extras allowed) | Verifying minimum required actions are taken                          |

### Strict match

The `strict` mode ensures trajectories contain identical messages in the same order with the same tool calls, though it allows for differences in message content. This is useful when you need to enforce a specific sequence of operations, such as requiring a policy lookup before authorizing an action.

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>

### Unordered match

The `unordered` mode allows the same tool calls in any order, which is helpful when you want to verify that the correct set of tools are being invoked but don't care about the sequence. For example, an agent might need to check both weather and events for a city, but the order doesn't matter.

<CodeGroup>
```

---

## How to implement generative user interfaces with LangGraph

**URL:** llms-txt#how-to-implement-generative-user-interfaces-with-langgraph

**Contents:**
- Tutorial
  - 1. Define and configure UI components
  - 2. Send the UI components in your graph
  - 3. Handle UI elements in your React application
- How-to guides
  - Provide custom components on the client side
  - Show loading UI when components are loading
  - Customise the namespace of UI components.
  - Access and interact with the thread state from the UI component
  - Pass additional context to the client components

Source: https://docs.langchain.com/langsmith/generative-ui-react

<Info>
  **Prerequisites**

* [LangSmith](/langsmith/home)
  * [Agent Server](/langsmith/agent-server)
  * [`useStream()` React Hook](/langsmith/use-stream-react)
</Info>

Generative user interfaces (Generative UI) allows agents to go beyond text and generate rich user interfaces. This enables creating more interactive and context-aware applications where the UI adapts based on the conversation flow and AI responses.

<img src="https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=105943c6c28853fad0a9bc3b4af3a999" alt="Agent Chat showing a prompt about booking/lodging and a generated set of hotel listing cards (images, titles, prices, locations) rendered inline as UI components." data-og-width="1814" width="1814" data-og-height="898" height="898" data-path="langsmith/images/generative-ui-sample.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=280&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=0fd526a7132d33ab6f72002d68a66dec 280w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=560&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=0c9ffe86700a7b8404f1fdf51b906aa1 560w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=840&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=50652e58566db8171ead4aef57d78fa6 840w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=1100&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=a764d790719e8233313fabe4cee93958 1100w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=1650&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=a02d8d6ecace7eee6df55e3a391c09e2 1650w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=2500&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=b0709ca94bd9533f5ef5a80da1d60bf6 2500w" />

LangSmith supports colocating your React components with your graph code. This allows you to focus on building specific UI components for your graph while easily plugging into existing chat interfaces such as [Agent Chat](https://agentchat.vercel.app) and loading the code only when actually needed.

### 1. Define and configure UI components

First, create your first UI component. For each component you need to provide an unique identifier that will be used to reference the component in your graph code.

Next, define your UI components in your `langgraph.json` configuration:

The `ui` section points to the UI components that will be used by graphs. By default, we recommend using the same key as the graph name, but you can split out the components however you like, see [Customise the namespace of UI components](#customise-the-namespace-of-ui-components) for more details.

LangSmith will automatically bundle your UI components code and styles and serve them as external assets that can be loaded by the `LoadExternalComponent` component. Some dependencies such as `react` and `react-dom` will be automatically excluded from the bundle.

CSS and Tailwind 4.x is also supported out of the box, so you can freely use Tailwind classes as well as `shadcn/ui` in your UI components.

<Tabs>
  <Tab title="src/agent/ui.tsx">
    
  </Tab>

<Tab title="src/agent/styles.css">
    
  </Tab>
</Tabs>

### 2. Send the UI components in your graph

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="JS">
    Use the `typedUi` utility to emit UI elements from your agent nodes:

### 3. Handle UI elements in your React application

On the client side, you can use `useStream()` and `LoadExternalComponent` to display the UI elements.

Behind the scenes, `LoadExternalComponent` will fetch the JS and CSS for the UI components from LangSmith and render them in a shadow DOM, thus ensuring style isolation from the rest of your application.

### Provide custom components on the client side

If you already have the components loaded in your client application, you can provide a map of such components to be rendered directly without fetching the UI code from LangSmith.

### Show loading UI when components are loading

You can provide a fallback UI to be rendered when the components are loading.

### Customise the namespace of UI components.

By default `LoadExternalComponent` will use the `assistantId` from `useStream()` hook to fetch the code for UI components. You can customise this by providing a `namespace` prop to the `LoadExternalComponent` component.

<Tabs>
  <Tab title="src/app/page.tsx">
    
  </Tab>

<Tab title="langgraph.json">
    
  </Tab>
</Tabs>

### Access and interact with the thread state from the UI component

You can access the thread state inside the UI component by using the `useStreamContext` hook.

### Pass additional context to the client components

You can pass additional context to the client components by providing a `meta` prop to the `LoadExternalComponent` component.

Then, you can access the `meta` prop in the UI component by using the `useStreamContext` hook.

### Streaming UI messages from the server

You can stream UI messages before the node execution is finished by using the `onCustomEvent` callback of the `useStream()` hook. This is especially useful when updating the UI component as the LLM is generating the response.

Then you can push updates to the UI component by calling `ui.push()` / `push_ui_message()` with the same ID as the UI message you wish to update.

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="JS">
    
  </Tab>

<Tab title="ui.tsx">
    
  </Tab>
</Tabs>

### Remove UI messages from state

Similar to how messages can be removed from the state by appending a RemoveMessage you can remove an UI message from the state by calling `remove_ui_message` / `ui.delete` with the ID of the UI message.

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="JS">
    
  </Tab>
</Tabs>

* [JS/TS SDK Reference](https://langchain-ai.github.io/langgraphjs/reference/modules/sdk.html)

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/generative-ui-react.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Next, define your UI components in your `langgraph.json` configuration:
```

Example 2 (unknown):
```unknown
The `ui` section points to the UI components that will be used by graphs. By default, we recommend using the same key as the graph name, but you can split out the components however you like, see [Customise the namespace of UI components](#customise-the-namespace-of-ui-components) for more details.

LangSmith will automatically bundle your UI components code and styles and serve them as external assets that can be loaded by the `LoadExternalComponent` component. Some dependencies such as `react` and `react-dom` will be automatically excluded from the bundle.

CSS and Tailwind 4.x is also supported out of the box, so you can freely use Tailwind classes as well as `shadcn/ui` in your UI components.

<Tabs>
  <Tab title="src/agent/ui.tsx">
```

Example 3 (unknown):
```unknown
</Tab>

  <Tab title="src/agent/styles.css">
```

Example 4 (unknown):
```unknown
</Tab>
</Tabs>

### 2. Send the UI components in your graph

<Tabs>
  <Tab title="Python">
```

---

## How to run multiple agents on the same thread

**URL:** llms-txt#how-to-run-multiple-agents-on-the-same-thread

**Contents:**
- Setup
- Run assistants on thread
  - Run OpenAI assistant
  - Run default assistant

Source: https://docs.langchain.com/langsmith/same-thread

In LangSmith Deployment, a thread is not explicitly associated with a particular agent.
This means that you can run multiple agents on the same thread, which allows a different agent to continue from an initial agent's progress.

In this example, we will create two agents and then call them both on the same thread.
You'll see that the second agent will respond using information from the [checkpoint](/oss/python/langgraph/graph-api#checkpointer-state) generated in the thread by the first agent as context.

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="Javascript">
    
  </Tab>

<Tab title="CURL">
    
  </Tab>
</Tabs>

We can see that these agents are different:

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="Javascript">
    
  </Tab>

<Tab title="CURL">
    
  </Tab>
</Tabs>

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="Javascript">
    
  </Tab>

<Tab title="CURL">
    
  </Tab>
</Tabs>

## Run assistants on thread

### Run OpenAI assistant

We can now run the OpenAI assistant on the thread first.

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="Javascript">
    
  </Tab>

<Tab title="CURL">
    
  </Tab>
</Tabs>

### Run default assistant

Now, we can run it on the default assistant and see that this second assistant is aware of the initial question, and can answer the question, "and you?":

<Tabs>
  <Tab title="Python">
    
  </Tab>

<Tab title="Javascript">
    
  </Tab>

<Tab title="CURL">
    
  </Tab>
</Tabs>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/same-thread.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
</Tab>

  <Tab title="Javascript">
```

Example 2 (unknown):
```unknown
</Tab>

  <Tab title="CURL">
```

Example 3 (unknown):
```unknown
</Tab>
</Tabs>

We can see that these agents are different:

<Tabs>
  <Tab title="Python">
```

Example 4 (unknown):
```unknown
</Tab>

  <Tab title="Javascript">
```

---

## How to use prebuilt evaluators

**URL:** llms-txt#how-to-use-prebuilt-evaluators

**Contents:**
- Setup
- Running an evaluator

Source: https://docs.langchain.com/langsmith/prebuilt-evaluators

LangSmith integrates with the open-source openevals package to provide a suite of prebuilt evaluators that you can use as starting points for evaluation.

<Note>
  This how-to guide will demonstrate how to set up and run one type of evaluator (LLM-as-a-judge). For a complete list of prebuilt evaluators with usage examples, refer to the [openevals](https://github.com/langchain-ai/openevals) and [agentevals](https://github.com/langchain-ai/agentevals) repos.
</Note>

You'll need to install the `openevals` package to use the pre-built LLM-as-a-judge evaluator.

You'll also need to set your OpenAI API key as an environment variable, though you can choose different providers too:

We'll also use LangSmith's [pytest](/langsmith/pytest) integration for Python and [Vitest/Jest](/langsmith/vitest-jest) for TypeScript to run our evals. `openevals` also integrates seamlessly with the [`evaluate`](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate) method as well. See the [appropriate guides](/langsmith/pytest) for setup instructions.

## Running an evaluator

The general flow is simple: import the evaluator or factory function from `openevals`, then run it within your test file with inputs, outputs, and reference outputs. LangSmith will automatically log the evaluator's results as feedback.

Note that not all evaluators will require each parameter (the exact match evaluator only requires outputs and reference outputs, for example). Additionally, if your LLM-as-a-judge prompt requires additional variables, passing them in as kwargs will format them into the prompt.

Set up your test file like this:

The `feedback_key`/`feedbackKey` parameter will be used as the name of the feedback in your experiment.

Running the eval in your terminal will result in something like the following:

<img src="https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=c2351acb065520c3cef3c374bd762982" alt="Prebuilt evaluator terminal result" data-og-width="2114" width="2114" data-og-height="614" height="614" data-path="langsmith/images/prebuilt-eval-result.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?w=280&fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=5a091195ae1351d5b16b2ebe53632e1e 280w, https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?w=560&fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=1e7488bb77662f71e60f01b9fa9609d6 560w, https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?w=840&fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=7e491cd83accabc3a56153a6c12d84fe 840w, https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?w=1100&fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=2fbc03b560b082ae5f6de8d17d4ae626 1100w, https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?w=1650&fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=20f6023215721383019659a0b99f3de5 1650w, https://mintcdn.com/langchain-5e9cc07a/H9jA2WRyA-MV4-H0/langsmith/images/prebuilt-eval-result.png?w=2500&fit=max&auto=format&n=H9jA2WRyA-MV4-H0&q=85&s=af97fb8ec7343f536704719294560dd0 2500w" />

You can also pass prebuilt evaluators directly into the `evaluate` method if you have already created a dataset in LangSmith. If using Python, this requires `langsmith>=0.3.11`:

For a complete list of available evaluators, see the [openevals](https://github.com/langchain-ai/openevals) and [agentevals](https://github.com/langchain-ai/agentevals) repos.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/prebuilt-evaluators.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

You'll also need to set your OpenAI API key as an environment variable, though you can choose different providers too:
```

Example 3 (unknown):
```unknown
We'll also use LangSmith's [pytest](/langsmith/pytest) integration for Python and [Vitest/Jest](/langsmith/vitest-jest) for TypeScript to run our evals. `openevals` also integrates seamlessly with the [`evaluate`](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate) method as well. See the [appropriate guides](/langsmith/pytest) for setup instructions.

## Running an evaluator

The general flow is simple: import the evaluator or factory function from `openevals`, then run it within your test file with inputs, outputs, and reference outputs. LangSmith will automatically log the evaluator's results as feedback.

Note that not all evaluators will require each parameter (the exact match evaluator only requires outputs and reference outputs, for example). Additionally, if your LLM-as-a-judge prompt requires additional variables, passing them in as kwargs will format them into the prompt.

Set up your test file like this:

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Import LiveKit components

**URL:** llms-txt#import-livekit-components

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent
from livekit.agents.telemetry import set_tracer_provider
from livekit.plugins import silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from opentelemetry.sdk.trace import TracerProvider

---

## Instrument all PydanticAI agents

**URL:** llms-txt#instrument-all-pydanticai-agents

Agent.instrument_all()

---

## Instrument Google ADK directly

**URL:** llms-txt#instrument-google-adk-directly

**Contents:**
  - 3. Create and run your ADK agent

GoogleADKInstrumentor().instrument()
python  theme={null}
import asyncio
from langsmith.integrations.otel import configure
from google.adk import Runner
from google.adk.agents import LlmAgent
from google.adk.sessions import InMemorySessionService
from google.genai import types

**Examples:**

Example 1 (unknown):
```unknown
<Note>
  You do not need to set any OpenTelemetry environment variables or configure exporters manually—`configure()` handles everything automatically.
</Note>

### 3. Create and run your ADK agent

Once configured, your Google ADK application will automatically send traces to LangSmith:

This example includes a minimal app that sets up an agent, session, and runner, then sends a message and streams events.
```

---

## Invoke the agent

**URL:** llms-txt#invoke-the-agent

result = agent.invoke({
    "messages": [{"role": "user", "content": "Delete the file temp.txt"}]
}, config=config)

---

## LangChain v1 migration guide

**URL:** llms-txt#langchain-v1-migration-guide

**Contents:**
- Simplified package
  - Namespace
  - `langchain-classic`
- Migrate to `create_agent`
  - Import path
  - Prompts
  - Pre-model hook
  - Post-model hook
  - Custom state
  - Model

Source: https://docs.langchain.com/oss/python/migrate/langchain-v1

This guide outlines the major changes between [LangChain v1](/oss/python/releases/langchain-v1) and previous versions.

## Simplified package

The `langchain` package namespace has been significantly reduced in v1 to focus on essential building blocks for agents. The streamlined package makes it easier to discover and use the core functionality.

| Module                                                                                | What's available                                                                                                                                                                                                                                                          | Notes                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [`langchain.agents`](https://reference.langchain.com/python/langchain/agents)         | [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent), [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState)                                                            | Core agent creation functionality |
| [`langchain.messages`](https://reference.langchain.com/python/langchain/messages)     | Message types, [content blocks](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ContentBlock), [`trim_messages`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.trim_messages)                               | Re-exported from `langchain-core` |
| [`langchain.tools`](https://reference.langchain.com/python/langchain/tools)           | [`@tool`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.tool), [`BaseTool`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.BaseTool), injection helpers                                                                | Re-exported from `langchain-core` |
| [`langchain.chat_models`](https://reference.langchain.com/python/langchain/models)    | [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model), [`BaseChatModel`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel)   | Unified model initialization      |
| [`langchain.embeddings`](https://reference.langchain.com/python/langchain/embeddings) | [`init_embeddings`](https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings), [`Embeddings`](https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings) | Embedding models                  |

### `langchain-classic`

If you were using any of the following from the `langchain` package, you'll need to install [`langchain-classic`](https://pypi.org/project/langchain-classic/) and update your imports:

* Legacy chains (`LLMChain`, `ConversationChain`, etc.)
* Retrievers (e.g. `MultiQueryRetriever` or anything from the previous `langchain.retrievers` module)
* The indexing API
* The hub module (for managing prompts programmatically)
* Embeddings modules (e.g. `CacheBackedEmbeddings` and community embeddings)
* [`langchain-community`](https://pypi.org/project/langchain-community) re-exports
* Other deprecated functionality

## Migrate to `create_agent`

Prior to v1.0, we recommended using [`langgraph.prebuilt.create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) to build agents. Now, we recommend you use [`langchain.agents.create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) to build agents.

The table below outlines what functionality has changed from [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):

| Section                                            | TL;DR - What's changed                                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Import path](#import-path)                        | Package moved from `langgraph.prebuilt` to `langchain.agents`                                                                                                                              |
| [Prompts](#prompts)                                | Parameter renamed to [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)), dynamic prompts use middleware            |
| [Pre-model hook](#pre-model-hook)                  | Replaced by middleware with `before_model` method                                                                                                                                          |
| [Post-model hook](#post-model-hook)                | Replaced by middleware with `after_model` method                                                                                                                                           |
| [Custom state](#custom-state)                      | `TypedDict` only, can be defined via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) or middleware |
| [Model](#model)                                    | Dynamic selection via middleware, pre-bound models not supported                                                                                                                           |
| [Tools](#tools)                                    | Tool error handling moved to middleware with `wrap_tool_call`                                                                                                                              |
| [Structured output](#structured-output)            | prompted output removed, use `ToolStrategy`/`ProviderStrategy`                                                                                                                             |
| [Streaming node name](#streaming-node-name-rename) | Node name changed from `"agent"` to `"model"`                                                                                                                                              |
| [Runtime context](#runtime-context)                | Dependency injection via `context` argument instead of `config["configurable"]`                                                                                                            |
| [Namespace](#simplified-package)                   | Streamlined to focus on agent building blocks, legacy code moved to `langchain-classic`                                                                                                    |

The import path for the agent prebuilt has changed from `langgraph.prebuilt` to `langchain.agents`.
The name of the function has changed from [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):

For more information, see [Agents](/oss/python/langchain/agents).

#### Static prompt rename

The `prompt` parameter has been renamed to [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)):

#### `SystemMessage` to string

If using [`SystemMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.SystemMessage) objects in the system prompt, extract the string content:

Dynamic prompts are a core context engineering pattern— they adapt what you tell the model based on the current conversation state. To do this, use the [`@dynamic_prompt`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.dynamic_prompt) decorator:

Pre-model hooks are now implemented as middleware with the `before_model` method.
This new pattern is more extensible--you can define multiple middlewares to run before the model is called,
reusing common patterns across different agents.

Common use cases include:

* Summarizing conversation history
* Trimming messages
* Input guardrails, like PII redaction

v1 now has summarization middleware as a built in option:

Post-model hooks are now implemented as middleware with the `after_model` method.
This new pattern is more extensible--you can define multiple middlewares to run after the model is called,
reusing common patterns across different agents.

Common use cases include:

* [Human in the loop](/oss/python/langchain/human-in-the-loop)
* Output guardrails

v1 has a built in middleware for human in the loop approval for tool calls:

Custom state extends the default agent state with additional fields. You can define custom state in two ways:

1. **Via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)** - Best for state used in tools
2. **Via middleware** - Best for state managed by specific middleware hooks and tools attached to said middleware

<Note>
  Defining custom state via middleware is preferred over defining it via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) because it allows you to keep state extensions conceptually scoped to the relevant middleware and tools.

`state_schema` is still supported for backwards compatibility on `create_agent`.
</Note>

#### Defining state via `state_schema`

Use the [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) parameter when your custom state needs to be accessed by tools:

#### Defining state via middleware

Middleware can also define custom state by setting the [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) attribute.
This helps to keep state extensions conceptually scoped to the relevant middleware and tools.

See the [middleware documentation](/oss/python/langchain/middleware#custom-state-schema) for more details on defining custom state via middleware.

#### State type restrictions

[`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) only supports `TypedDict` for state schemas. Pydantic models and dataclasses are no longer supported.

Simply inherit from `langchain.agents.AgentState` instead of `BaseModel` or decorating with `dataclass`.
If you need to perform validation, handle it in middleware hooks instead.

Dynamic model selection allows you to choose different models based on runtime context (e.g., task complexity, cost constraints, or user preferences). [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) released in v0.6 of [`langgraph-prebuilt`](https://pypi.org/project/langgraph-prebuilt) supported dynamic model and tool selection via a callable passed to the `model` parameter.

This functionality has been ported to the middleware interface in v1.

#### Dynamic model selection

#### Pre-bound models

To better support structured output, [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) no longer accepts pre-bound models with tools or configuration:

```python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

Install with:

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>

***

## Migrate to `create_agent`

Prior to v1.0, we recommended using [`langgraph.prebuilt.create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) to build agents. Now, we recommend you use [`langchain.agents.create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) to build agents.

The table below outlines what functionality has changed from [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):

| Section                                            | TL;DR - What's changed                                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Import path](#import-path)                        | Package moved from `langgraph.prebuilt` to `langchain.agents`                                                                                                                              |
| [Prompts](#prompts)                                | Parameter renamed to [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)), dynamic prompts use middleware            |
| [Pre-model hook](#pre-model-hook)                  | Replaced by middleware with `before_model` method                                                                                                                                          |
| [Post-model hook](#post-model-hook)                | Replaced by middleware with `after_model` method                                                                                                                                           |
| [Custom state](#custom-state)                      | `TypedDict` only, can be defined via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) or middleware |
| [Model](#model)                                    | Dynamic selection via middleware, pre-bound models not supported                                                                                                                           |
| [Tools](#tools)                                    | Tool error handling moved to middleware with `wrap_tool_call`                                                                                                                              |
| [Structured output](#structured-output)            | prompted output removed, use `ToolStrategy`/`ProviderStrategy`                                                                                                                             |
| [Streaming node name](#streaming-node-name-rename) | Node name changed from `"agent"` to `"model"`                                                                                                                                              |
| [Runtime context](#runtime-context)                | Dependency injection via `context` argument instead of `config["configurable"]`                                                                                                            |
| [Namespace](#simplified-package)                   | Streamlined to focus on agent building blocks, legacy code moved to `langchain-classic`                                                                                                    |

### Import path

The import path for the agent prebuilt has changed from `langgraph.prebuilt` to `langchain.agents`.
The name of the function has changed from [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):
```

---

## LangGraph v1 migration guide

**URL:** llms-txt#langgraph-v1-migration-guide

**Contents:**
- Summary of changes
- Deprecations
- `create_react_agent` → `create_agent`
- Breaking changes
  - Dropped Python 3.9 support

Source: https://docs.langchain.com/oss/python/migrate/langgraph-v1

This guide outlines changes in LangGraph v1 and how to migrate from previous versions. For a high-level overview of changes, see the [what's new](/oss/python/releases/langgraph-v1) page.

## Summary of changes

LangGraph v1 is largely backwards compatible with previous versions. The main change is the deprecation of [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) in favor of LangChain's new [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) function.

The following table lists all items deprecated in LangGraph v1:

| Deprecated item                            | Alternative                                                                                                                                                                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create_react_agent`                       | [`langchain.agents.create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)                                                                                                                               |
| `AgentState`                               | [`langchain.agents.AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState)                                                                                                                                   |
| `AgentStatePydantic`                       | `langchain.agents.AgentState` (no more pydantic state)                                                                                                                                                                                                  |
| `AgentStateWithStructuredResponse`         | `langchain.agents.AgentState`                                                                                                                                                                                                                           |
| `AgentStateWithStructuredResponsePydantic` | `langchain.agents.AgentState` (no more pydantic state)                                                                                                                                                                                                  |
| `HumanInterruptConfig`                     | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig`                                                                                                                                                                                       |
| `ActionRequest`                            | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig`                                                                                                                                                                                       |
| `HumanInterrupt`                           | `langchain.agents.middleware.human_in_the_loop.HITLRequest`                                                                                                                                                                                             |
| `ValidationNode`                           | Tools automatically validate input with [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)                                                                                                        |
| `MessageGraph`                             | [`StateGraph`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph) with a `messages` key, like [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) provides |

## `create_react_agent` → `create_agent`

LangGraph v1 deprecates the [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) prebuilt. Use LangChain's [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent), which runs on LangGraph and adds a flexible middleware system.

See the LangChain v1 docs for details:

* [Release notes](/oss/python/releases/langchain-v1#createagent)
* [Migration guide](/oss/python/migrate/langchain-v1#migrate-to-create_agent)

### Dropped Python 3.9 support

All LangChain packages now require **Python 3.10 or higher**. Python 3.9 reached [end of life](https://devguide.python.org/versions/) in October 2025.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/migrate/langgraph-v1.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

## Summary of changes

LangGraph v1 is largely backwards compatible with previous versions. The main change is the deprecation of [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) in favor of LangChain's new [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) function.

## Deprecations

The following table lists all items deprecated in LangGraph v1:

| Deprecated item                            | Alternative                                                                                                                                                                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create_react_agent`                       | [`langchain.agents.create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)                                                                                                                               |
| `AgentState`                               | [`langchain.agents.AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState)                                                                                                                                   |
| `AgentStatePydantic`                       | `langchain.agents.AgentState` (no more pydantic state)                                                                                                                                                                                                  |
| `AgentStateWithStructuredResponse`         | `langchain.agents.AgentState`                                                                                                                                                                                                                           |
| `AgentStateWithStructuredResponsePydantic` | `langchain.agents.AgentState` (no more pydantic state)                                                                                                                                                                                                  |
| `HumanInterruptConfig`                     | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig`                                                                                                                                                                                       |
| `ActionRequest`                            | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig`                                                                                                                                                                                       |
| `HumanInterrupt`                           | `langchain.agents.middleware.human_in_the_loop.HITLRequest`                                                                                                                                                                                             |
| `ValidationNode`                           | Tools automatically validate input with [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)                                                                                                        |
| `MessageGraph`                             | [`StateGraph`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph) with a `messages` key, like [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) provides |

## `create_react_agent` → `create_agent`

LangGraph v1 deprecates the [`create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) prebuilt. Use LangChain's [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent), which runs on LangGraph and adds a flexible middleware system.

See the LangChain v1 docs for details:

* [Release notes](/oss/python/releases/langchain-v1#createagent)
* [Migration guide](/oss/python/migrate/langchain-v1#migrate-to-create_agent)

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

---

## LangSmith Agent Builder App for Slack

**URL:** llms-txt#langsmith-agent-builder-app-for-slack

**Contents:**
- How to install
- Permissions
- Privacy policy
- AI components and disclaimers
  - What you should know
  - Technical details
- Pricing

Source: https://docs.langchain.com/langsmith/agent-builder-slack-app

Connect the LangSmith Agent Builder to your Slack workspace to power AI agents.

The LangSmith Agent Builder App for Slack integrates your agents with Slack for secure, context-aware communication inside your Slack workspace.

After installation, your agents will be able to:

* Send direct messages.
* Post to channels.
* Read thread messages.
* Reply in threads.
* Read conversation history.

To install the LangSmith Agent Builder for Slack:

1. Navigate to Agent Builder in your [LangSmith workspace](https://smith.langchain.com).
2. Create or edit an agent.
3. Add Slack as a trigger or enable Slack tools.
4. When prompted, authorize the Slack connection.
5. Follow the OAuth flow to grant permissions to your Slack workspace.

The app will be installed automatically when you complete the authorization, *but* you will still need to invite the app into the specific channels you want to use it in.

To invite the Slack bot, you can send the following message:

The LangSmith Agent Builder requires the following permissions to your Slack workspace:

* **Send messages** - Send direct messages and post to channels
* **Read messages** - Read channel history and thread messages
* **View channels** - Access basic channel information
* **View users** - Look up user information for messaging

These permissions enable agents to communicate effectively within your Slack workspace.

The LangSmith Agent Builder App for Slack collects, manages, and stores third-party data in accordance with our privacy policy. For full details on how your data is handled, please see [our privacy policy](https://www.langchain.com/privacy-policy).

## AI components and disclaimers

The LangSmith Agent Builder uses Large Language Models (LLMs) to power AI agents that interact with users in Slack. While these models are powerful, they have the potential to generate inaccurate responses, summaries, or other outputs.

### What you should know

* **AI-generated content**: All responses from agents are generated by AI and may contain errors or inaccuracies. Always verify important information.
* **Data usage**: Slack data is not used to train LLMs. Your workspace data remains private and is only used to provide agent functionality.
* **Transparency**: The Agent Builder is transparent about the actions it will take once added to your workspace, as outlined in the permissions section above.

### Technical details

The Agent Builder uses the following approach to AI:

* **Model**: Uses LLMs provided through the LangSmith platform
* **Data retention**: User data is retained according to LangSmith's data retention policies
* **Data tenancy**: Data is handled according to your LangSmith organization settings
* **Data residency**: Data residency follows your LangSmith configuration

For more information about AI safety and best practices, see the [Agent Builder documentation](/langsmith/agent-builder).

The LangSmith Agent Builder App for Slack itself does not have any direct pricing. However, agent runs and traces are billed through the [LangSmith platform](https://smith.langchain.com) according to your organization's plan.

For current pricing information, see the [LangSmith pricing page](https://www.langchain.com/pricing).

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-slack-app.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## LangSmith Deployment components

**URL:** llms-txt#langsmith-deployment-components

Source: https://docs.langchain.com/langsmith/components

When running self-hosted [LangSmith Deployment](/langsmith/deploy-self-hosted-full-platform), your installation includes several key components. Together these tools and services provide a complete solution for building, deploying, and managing graphs (including agentic applications) in your own infrastructure:

* [Agent Server](/langsmith/agent-server): Defines an opinionated API and runtime for deploying graphs and agents. Handles execution, state management, and persistence so you can focus on building logic rather than server infrastructure.
* [LangGraph CLI](/langsmith/cli): A command-line interface to build, package, and interact with graphs locally and prepare them for deployment.
* [Studio](/langsmith/studio): A specialized IDE for visualization, interaction, and debugging. Connects to a local Agent Server for developing and testing your graph.
* [Python/JS SDK](/langsmith/sdk): The Python/JS SDK provides a programmatic way to interact with deployed graphs and agents from your applications.
* [RemoteGraph](/langsmith/use-remote-graph): Allows you to interact with a deployed graph as though it were running locally.
* [Control Plane](/langsmith/control-plane): The UI and APIs for creating, updating, and managing Agent Server deployments.
* [Data plane](/langsmith/data-plane): The runtime layer that executes your graphs, including Agent Servers, their backing services (PostgreSQL, Redis, etc.), and the listener that reconciles state from the control plane.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/components.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## LangSmith Studio

**URL:** llms-txt#langsmith-studio

**Contents:**
- Prerequisites
- Set up local Agent server
  - 1. Install the LangGraph CLI

Source: https://docs.langchain.com/oss/python/langgraph/studio

When building agents with LangChain locally, it's helpful to visualize what's happening inside your agent, interact with it in real-time, and debug issues as they occur. **LangSmith Studio** is a free visual interface for developing and testing your LangChain agents from your local machine.

Studio connects to your locally running agent to show you each step your agent takes: the prompts sent to the model, tool calls and their results, and the final output. You can test different inputs, inspect intermediate states, and iterate on your agent's behavior without additional code or deployment.

This pages describes how to set up Studio with your local LangChain agent.

Before you begin, ensure you have the following:

* **A LangSmith account**: Sign up (for free) or log in at [smith.langchain.com](https://smith.langchain.com).
* **A LangSmith API key**: Follow the [Create an API key](/langsmith/create-account-api-key#create-an-api-key) guide.
* If you don't want data [traced](/langsmith/observability-concepts#traces) to LangSmith, set `LANGSMITH_TRACING=false` in your application's `.env` file. With tracing disabled, no data leaves your local server.

## Set up local Agent server

### 1. Install the LangGraph CLI

The [LangGraph CLI](/langsmith/cli) provides a local development server (also called [Agent Server](/langsmith/agent-server)) that connects your agent to Studio.

```shell  theme={null}

---

## LangSmith Tool Server

**URL:** llms-txt#langsmith-tool-server

**Contents:**
- Create a custom toolkit
- Call tools via MCP protocol
- Use as an MCP gateway
- Authenticate
  - OAuth for third-party APIs
  - Custom request authentication

Source: https://docs.langchain.com/langsmith/agent-builder-mcp-framework

The LangSmith Tool Server is a standalone MCP framework for building and deploying tools with built-in authentication and authorization. Use the Tool Server when you want to:

* [Create custom tools](#create-a-custom-toolkit) that integrate with LangSmith's [Agent Auth](/langsmith/agent-auth) for OAuth authentication
* [Build an MCP gateway](#use-as-an-mcp-gateway) for agents you're building yourself (outside of Agent Builder)

<Note>
  If you're using [Agent Builder](/langsmith/agent-builder), you don't need to interact with the Tool Server directly. Agent Builder provides [built-in tools](/langsmith/agent-builder-tools) and supports [remote MCP servers](/langsmith/agent-builder-tools#using-remote-mcp-servers) without requiring Tool Server setup.

However, you can configure the associated tool server instance as an MCP server, which will allow you to use your custom MCP servers in your agent.
</Note>

Download the [PyPi package](https://pypi.org/project/langsmith-tool-server/) to get started.

## Create a custom toolkit

Install the LangSmith Tool Server and LangChain CLI:

Create a new toolkit:

This creates a toolkit with the following structure:

Define your tools using the `@tool` decorator:

Your tool server will start on `http://localhost:8000`.

## Call tools via MCP protocol

Below is an example that lists available tools and calls the `add` tool:

## Use as an MCP gateway

The LangSmith Tool Server can act as an MCP gateway, aggregating tools from multiple MCP servers into a single endpoint. Configure MCP servers in your `toolkit.toml`:

All tools from connected MCP servers are exposed through your server's `/mcp` endpoint. MCP tools are prefixed with their server name to avoid conflicts (e.g., `weather_get_forecast`, `math_add`).

### OAuth for third-party APIs

For tools that need to access third-party APIs (like Google, GitHub, Slack, etc.), you can use OAuth authentication with [Agent Auth](/langsmith/agent-auth).

Before using OAuth in your tools, you'll need to configure an OAuth provider in your LangSmith workspace settings. See the [Agent Auth documentation](/langsmith/agent-auth) for setup instructions.

Once configured, specify the `auth_provider` in your tool decorator:

Tools with `auth_provider` must:

* Have `context: Context` as the first parameter
* Specify at least one scope
* Use `context.token` to make authenticated API calls

### Custom request authentication

Custom authentication allows you to validate requests and integrate with your identity provider. Define an authentication handler in your `auth.py` file:

The handler runs on every request and must return a dict with `identity` (and optionally `permissions`).

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-mcp-framework.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Create a new toolkit:
```

Example 2 (unknown):
```unknown
This creates a toolkit with the following structure:
```

Example 3 (unknown):
```unknown
Define your tools using the `@tool` decorator:
```

Example 4 (unknown):
```unknown
Run the server:
```

---

## Learn

**URL:** llms-txt#learn

**Contents:**
- Use Cases
  - LangChain
  - LangGraph
  - Multi-agent
- Conceptual Overviews
- Additional Resources

Source: https://docs.langchain.com/oss/python/learn

Tutorials, conceptual guides, and resources to help you get started.

In the **Learn** section of the documentation, you'll find a collection of tutorials, conceptual overviews, and additional resources to help you build powerful applications with LangChain and LangGraph.

Below are tutorials for common use cases, organized by framework.

[LangChain](/oss/python/langchain/overview) [agent](/oss/python/langchain/agents) implementations make it easy to get started for most use cases.

<Card title="Semantic Search" icon="magnifying-glass" href="/oss/python/langchain/knowledge-base" horizontal>
  Build a semantic search engine over a PDF with LangChain components.
</Card>

<Card title="RAG Agent" icon="user-magnifying-glass" href="/oss/python/langchain/rag" horizontal>
  Create a Retrieval Augmented Generation (RAG) agent.
</Card>

<Card title="SQL Agent" icon="database" href="/oss/python/langchain/sql-agent" horizontal>
  Build a SQL agent to interact with databases with human-in-the-loop review.
</Card>

<Card title="Voice Agent" icon="microphone" href="/oss/python/langchain/voice-agent" horizontal>
  Build an agent you can speak and listen to.
</Card>

LangChain's [agent](/oss/python/langchain/agents) implementations use [LangGraph](/oss/python/langgraph/overview) primitives.
If deeper customization is required, agents can be implemented directly in LangGraph.

<Card title="Custom RAG Agent" icon="user-magnifying-glass" href="/oss/python/langgraph/agentic-rag" horizontal>
  Build a RAG agent using LangGraph primitives for fine-grained control.
</Card>

<Card title="Custom SQL Agent" icon="database" href="/oss/python/langgraph/sql-agent" horizontal>
  Implement a SQL agent directly in LangGraph for maximum flexibility.
</Card>

These tutorials demonstrate [multi-agent patterns](/oss/python/langchain/multi-agent), blending LangChain agents with LangGraph workflows.

<Card title="Subagents: Personal assistant" icon="sitemap" href="/oss/python/langchain/multi-agent/subagents-personal-assistant" horizontal>
  Build a personal assistant that delegates to sub-agents.
</Card>

<Card title="Handoffs: Customer support" icon="people-arrows" href="/oss/python/langchain/multi-agent/handoffs-customer-support" horizontal>
  Build a customer support workflow where a single agent transitions between different states.
</Card>

<Card title="Router: Knowledge base" icon="share-nodes" href="/oss/python/langchain/multi-agent/router-knowledge-base" horizontal>
  Build a multi-source knowledge base that routes queries to specialized agents.
</Card>

<Card title="Skills: SQL assistant" icon="wand-magic-sparkles" href="/oss/python/langchain/multi-agent/skills-sql-assistant" horizontal>
  Build an agent that loads specialized skills progressively using on-demand context loading.
</Card>

## Conceptual Overviews

These guides explain the core concepts and APIs underlying LangChain and LangGraph.

<Card title="Memory" icon="brain" href="/oss/python/concepts/memory" horizontal>
  Understand persistence of interactions within and across threads.
</Card>

<Card title="Context engineering" icon="book-open" href="/oss/python/concepts/context" horizontal>
  Learn methods for providing AI applications the right information and tools to accomplish a task.
</Card>

<Card title="Graph API" icon="chart-network" href="/oss/python/langgraph/graph-api" horizontal>
  Explore LangGraph’s declarative graph-building API.
</Card>

<Card title="Functional API" icon="code" href="/oss/python/langgraph/functional-api" horizontal>
  Build agents as a single function.
</Card>

## Additional Resources

<Card title="LangChain Academy" icon="graduation-cap" href="https://academy.langchain.com/" horizontal>
  Courses and exercises to level up your LangChain skills.
</Card>

<Card title="Case Studies" icon="screen-users" href="/oss/python/langgraph/case-studies" horizontal>
  See how teams are using LangChain and LangGraph in production.
</Card>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/learn.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Long-term memory

**URL:** llms-txt#long-term-memory

**Contents:**
- Overview
- Memory storage

Source: https://docs.langchain.com/oss/python/langchain/long-term-memory

LangChain agents use [LangGraph persistence](/oss/python/langgraph/persistence#memory-store) to enable long-term memory. This is a more advanced topic and requires knowledge of LangGraph to use.

LangGraph stores long-term memories as JSON documents in a [store](/oss/python/langgraph/persistence#memory-store).

Each memory is organized under a custom `namespace` (similar to a folder) and a distinct `key` (like a file name). Namespaces often include user or org IDs or other labels that makes it easier to organize information.

This structure enables hierarchical organization of memories. Cross-namespace searching is then supported through content filters.

```python  theme={null}
from langgraph.store.memory import InMemoryStore

def embed(texts: list[str]) -> list[list[float]]:
    # Replace with an actual embedding function or LangChain embeddings object
    return [[1.0, 2.0] * len(texts)]

---

## Main agent with subagent as a tool  # [!code highlight]

**URL:** llms-txt#main-agent-with-subagent-as-a-tool--#-[!code-highlight]

**Contents:**
  - Single dispatch tool
- Context engineering
  - Subagent specs
  - Subagent inputs
  - Subagent outputs

main_agent = create_agent(model="...", tools=[call_subagent])  # [!code highlight]
mermaid  theme={null}
graph LR
    A[User] --> B[Main Agent]
    B --> C{task<br/>agent_name, description}
    C -->|research| D[Research Agent]
    C -->|writer| E[Writer Agent]
    C -->|reviewer| F[Reviewer Agent]
    D --> C
    E --> C
    F --> C
    C --> B
    B --> G[User response]
python  theme={null}
  from langchain.tools import tool
  from langchain.agents import create_agent

# Sub-agents developed by different teams
  research_agent = create_agent(
      model="gpt-4o",
      prompt="You are a research specialist..."
  )

writer_agent = create_agent(
      model="gpt-4o",
      prompt="You are a writing specialist..."
  )

# Registry of available sub-agents
  SUBAGENTS = {
      "research": research_agent,
      "writer": writer_agent,
  }

@tool
  def task(
      agent_name: str,
      description: str
  ) -> str:
      """Launch an ephemeral subagent for a task.

Available agents:
      - research: Research and fact-finding
      - writer: Content creation and editing
      """
      agent = SUBAGENTS[agent_name]
      result = agent.invoke({
          "messages": [
              {"role": "user", "content": description}
          ]
      })
      return result["messages"][-1].content

# Main coordinator agent
  main_agent = create_agent(
      model="gpt-4o",
      tools=[task],
      system_prompt=(
          "You coordinate specialized sub-agents. "
          "Available: research (fact-finding), "
          "writer (content creation). "
          "Use the task tool to delegate work."
      ),
  )
  python Subagent inputs example expandable theme={null}
from langchain.agents import AgentState
from langchain.tools import tool, ToolRuntime

class CustomState(AgentState):
    example_state_key: str

@tool(
    "subagent1_name",
    description="subagent1_description"
)
def call_subagent1(query: str, runtime: ToolRuntime[None, CustomState]):
    # Apply any logic needed to transform the messages into a suitable input
    subagent_input = some_logic(query, runtime.state["messages"])
    result = subagent1.invoke({
        "messages": subagent_input,
        # You could also pass other state keys here as needed.
        # Make sure to define these in both the main and subagent's
        # state schemas.
        "example_state_key": runtime.state["example_state_key"]
    })
    return result["messages"][-1].content
python Subagent outputs example expandable theme={null}
from typing import Annotated
from langchain.agents import AgentState
from langchain.tools import InjectedToolCallId
from langgraph.types import Command

@tool(
    "subagent1_name",
    description="subagent1_description"
)
def call_subagent1(
    query: str,
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command:
    result = subagent1.invoke({
        "messages": [{"role": "user", "content": query}]
    })
    return Command(update={
        # Pass back additional state from the subagent
        "example_state_key": result["example_state_key"],
        "messages": [
            ToolMessage(
                content=result["messages"][-1].content,
                tool_call_id=tool_call_id
            )
        ]
    })
```

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/subagents.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
The main agent invokes the subagent tool when it decides the task matches the subagent's description, receives the result, and continues orchestration. See [Context engineering](#context-engineering) for fine-grained control.

### Single dispatch tool

An alternative approach uses a single parameterized tool to invoke ephemeral sub-agents for independent tasks. Unlike the [tool per agent](#tool-per-agent) approach where each sub-agent is wrapped as a separate tool, this uses a convention-based approach with a single `task` tool: the task description is passed as a human message to the sub-agent, and the sub-agent's final message is returned as the tool result.

Use this approach when you want to distribute agent development across multiple teams, need to isolate complex tasks into separate context windows, need a scalable way to add new agents without modifying the coordinator, or prefer convention over customization. This approach trades flexibility in context engineering for simplicity in agent composition and strong context isolation.
```

Example 2 (unknown):
```unknown
**Key characteristics:**

* Single task tool: One parameterized tool that can invoke any registered sub-agent by name
* Convention-based invocation: Agent selected by name, task passed as human message, final message returned as tool result
* Team distribution: Different teams can develop and deploy agents independently
* Agent discovery: Sub-agents can be discovered via system prompt (listing available agents) or through [progressive disclosure](/oss/python/langchain/multi-agent/skills-sql-assistant) (loading agent information on-demand via tools)

<Tip>
  An interesting aspect of this approach is that sub-agents may have the exact same capabilities as the main agent. In such cases, invoking a sub-agent is **really about context isolation** as the primary reason—allowing complex, multi-step tasks to run in isolated context windows without bloating the main agent's conversation history. The sub-agent completes its work autonomously and returns only a concise summary, keeping the main thread focused and efficient.
</Tip>

<Accordion title="Agent registry with task dispatcher">
```

Example 3 (unknown):
```unknown
</Accordion>

## Context engineering

Control how context flows between the main agent and its subagents:

| Category                                  | Purpose                                                  | Impacts                      |
| ----------------------------------------- | -------------------------------------------------------- | ---------------------------- |
| [**Subagent specs**](#subagent-specs)     | Ensure subagents are invoked when they should be         | Main agent routing decisions |
| [**Subagent inputs**](#subagent-inputs)   | Ensure subagents can execute well with optimized context | Subagent performance         |
| [**Subagent outputs**](#subagent-outputs) | Ensure the supervisor can act on subagent results        | Main agent performance       |

See also our comprehensive guide on [context engineering](/oss/python/langchain/context-engineering) for agents.

### Subagent specs

The **names** and **descriptions** associated with subagents are the primary way the main agent knows which subagents to invoke.
These are prompting levers—choose them carefully.

* **Name**: How the main agent refers to the sub-agent. Keep it clear and action-oriented (e.g., `research_agent`, `code_reviewer`).
* **Description**: What the main agent knows about the sub-agent's capabilities. Be specific about what tasks it handles and when to use it.

For the [single dispatch tool](#single-dispatch-tool) design, the main agent needs to call the `task` tool with the name of the subagent to invoke. The available tools can be provided to the main agent via one of the following methods:

* **System prompt enumeration**: List available agents in the system prompt.
* **Enum constraint on dispatch tool**: For small agent lists, add an enum to the `agent_name` field.
* **Tool-based discovery**: For large or dynamic agent registries, provide a separate tool (e.g., `list_agents` or `search_agents`) that returns available agents.

### Subagent inputs

Customize what context the subagent receives to execute its task. Add input that isn't practical to capture in a static prompt—full message history, prior results, or task metadata—by pulling from the agent's state.
```

Example 4 (unknown):
```unknown
### Subagent outputs

Customize what the main agent receives back so it can make good decisions. Two strategies:

1. **Prompt the sub-agent**: Specify exactly what should be returned. A common failure mode is that the sub-agent performs tool calls or reasoning but doesn't include results in its final message—remind it that the supervisor only sees the final output.
2. **Format in code**: Adjust or enrich the response before returning it. For example, pass specific state keys back in addition to the final text using a [`Command`](/oss/python/langgraph/graph-api#command).
```

---

## Main agent with subagent as a tool

**URL:** llms-txt#main-agent-with-subagent-as-a-tool

**Contents:**
- Design decisions
- Sync vs. async
  - Synchronous (default)
  - Asynchronous
- Tool patterns
  - Tool per agent

main_agent = create_agent(model="anthropic:claude-sonnet-4-20250514", tools=[call_research_agent])
mermaid  theme={null}
sequenceDiagram
    participant User
    participant Main Agent
    participant Research Subagent

User->>Main Agent: "What's the weather in Tokyo?"
    Main Agent->>Research Subagent: research("Tokyo weather")
    Note over Main Agent: Waiting for result...
    Research Subagent-->>Main Agent: "Currently 72°F, sunny"
    Main Agent-->>User: "It's 72°F and sunny in Tokyo"
mermaid  theme={null}
sequenceDiagram
    participant User
    participant Main Agent
    participant Job System
    participant Contract Reviewer

User->>Main Agent: "Review this M&A contract"
    Main Agent->>Job System: run_agent("legal_reviewer", task)
    Job System->>Contract Reviewer: Start agent
    Job System-->>Main Agent: job_id: "job_123"
    Main Agent-->>User: "Started review (job_123)"

Note over Contract Reviewer: Reviewing 150+ pages...

User->>Main Agent: "What's the status?"
    Main Agent->>Job System: check_status(job_id)
    Job System-->>Main Agent: "running"
    Main Agent-->>User: "Still reviewing contract..."

Note over Contract Reviewer: Review completes

User->>Main Agent: "Is it done yet?"
    Main Agent->>Job System: check_status(job_id)
    Job System-->>Main Agent: "completed"
    Main Agent->>Job System: get_result(job_id)
    Job System-->>Main Agent: Contract analysis
    Main Agent-->>User: "Review complete: [findings]"
mermaid  theme={null}
graph LR
    A[User] --> B[Main Agent]
    B --> C[Subagent A]
    B --> D[Subagent B]
    B --> E[Subagent C]
    C --> B
    D --> B
    E --> B
    B --> F[User response]
python  theme={null}
from langchain.tools import tool
from langchain.agents import create_agent

**Examples:**

Example 1 (unknown):
```unknown
<Card title="Tutorial: Build a personal assistant with subagents" icon="sitemap" href="/oss/python/langchain/multi-agent/subagents-personal-assistant" arrow cta="Learn more">
  Learn how to build a personal assistant using the subagents pattern, where a central main agent (supervisor) coordinates specialized worker agents.
</Card>

## Design decisions

When implementing the subagents pattern, you'll make several key design choices. This table summarizes the options—each is covered in detail in the sections below.

| Decision                                  | Options                                      |
| ----------------------------------------- | -------------------------------------------- |
| [**Sync vs. async**](#sync-vs-async)      | Sync (blocking) vs. async (background)       |
| [**Tool patterns**](#tool-patterns)       | Tool per agent vs. single dispatch tool      |
| [**Subagent inputs**](#subagent-inputs)   | Query only vs. full context                  |
| [**Subagent outputs**](#subagent-outputs) | Subagent result vs full conversation history |

## Sync vs. async

Subagent execution can be **synchronous** (blocking) or **asynchronous** (background). Your choice depends on whether the main agent needs the result to continue.

| Mode      | Main agent behavior                         | Best for                               | Tradeoff                            |
| --------- | ------------------------------------------- | -------------------------------------- | ----------------------------------- |
| **Sync**  | Waits for subagent to complete              | Main agent needs result to continue    | Simple, but blocks the conversation |
| **Async** | Continues while subagent runs in background | Independent tasks, user shouldn't wait | Responsive, but more complex        |

<Tip>
  Not to be confused with Python's `async`/`await`. Here, "async" means the main agent kicks off a background job (typically in a separate process or service) and continues without blocking.
</Tip>

### Synchronous (default)

By default, subagent calls are **synchronous**—the main agent waits for each subagent to complete before continuing. Use sync when the main agent's next action depends on the subagent's result.
```

Example 2 (unknown):
```unknown
**When to use sync:**

* Main agent needs the subagent's result to formulate its response
* Tasks have order dependencies (e.g., fetch data → analyze → respond)
* Subagent failures should block the main agent's response

**Tradeoffs:**

* Simple implementation—just call and wait
* User sees no response until all subagents complete
* Long-running tasks freeze the conversation

### Asynchronous

Use **asynchronous execution** when the subagent's work is independent—the main agent doesn't need the result to continue conversing with the user. The main agent kicks off a background job and remains responsive.
```

Example 3 (unknown):
```unknown
**When to use async:**

* Subagent work is independent of the main conversation flow
* Users should be able to continue chatting while work happens
* You want to run multiple independent tasks in parallel

**Three-tool pattern:**

1. **Start job**: Kicks off the background task, returns a job ID
2. **Check status**: Returns current state (pending, running, completed, failed)
3. **Get result**: Retrieves the completed result

**Handling job completion:** When a job finishes, your application needs to notify the user. One approach: surface a notification that, when clicked, sends a `HumanMessage` like "Check job\_123 and summarize the results."

## Tool patterns

There are two main ways to expose subagents as tools:

| Pattern                                           | Best for                                                      | Trade-off                                         |
| ------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| [**Tool per agent**](#tool-per-agent)             | Fine-grained control over each subagent's input/output        | More setup, but more customization                |
| [**Single dispatch tool**](#single-dispatch-tool) | Many agents, distributed teams, convention over configuration | Simpler composition, less per-agent customization |

### Tool per agent
```

Example 4 (unknown):
```unknown
The key idea is wrapping subagents as tools that the main agent can call:
```

---

## MCP endpoint in Agent Server

**URL:** llms-txt#mcp-endpoint-in-agent-server

**Contents:**
- Requirements
- Usage overview
  - Client
- Expose an agent as MCP tool
  - Setting name and description
  - Schema

Source: https://docs.langchain.com/langsmith/server-mcp

The Model Context Protocol (MCP) is an open protocol for describing tools and data sources in a model-agnostic format, enabling LLMs to discover and use them via a structured API.

[Agent Server](/langsmith/agent-server) implements MCP using the [Streamable HTTP transport](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/transports/#streamable-http). This allows LangGraph **agents** to be exposed as **MCP tools**, making them usable with any MCP-compliant client supporting Streamable HTTP.

The MCP endpoint is available at `/mcp` on [Agent Server](/langsmith/agent-server).

You can set up [custom authentication middleware](/langsmith/custom-auth) to authenticate a user with an MCP server to get access to user-scoped tools within your LangSmith deployment.

An example architecture for this flow:

To use MCP, ensure you have the following dependencies installed:

* `langgraph-api >= 0.2.3`
* `langgraph-sdk >= 0.1.61`

* Upgrade to use langgraph-api>=0.2.3. If you are deploying LangSmith, this will be done for you automatically if you create a new revision.
* MCP tools (agents) will be automatically exposed.
* Connect with any MCP-compliant client that supports Streamable HTTP.

Use an MCP-compliant client to connect to the Agent Server. The following examples show how to connect using different programming languages.

<Tabs>
  <Tab title="JavaScript/TypeScript">

> **Note**
    > Replace `serverUrl` with your Agent Server URL and configure authentication headers as needed.

<Tab title="Python">
    Install the adapter with:

Here is an example of how to connect to a remote MCP endpoint and use an agent as a tool:

## Expose an agent as MCP tool

When deployed, your agent will appear as a tool in the MCP endpoint
with this configuration:

* **Tool name**: The agent's name.
* **Tool description**: The agent's description.
* **Tool input schema**: The agent's input schema.

### Setting name and description

You can set the name and description of your agent in `langgraph.json`:

After deployment, you can update the name and description using the LangGraph SDK.

Define clear, minimal input and output schemas to avoid exposing unnecessary internal complexity to the LLM.

The default [MessagesState](/oss/python/langgraph/graph-api#messagesstate) uses `AnyMessage`, which supports many message types but is too general for direct LLM exposure.

Instead, define **custom agents or workflows** that use explicitly typed input and output structures.

For example, a workflow answering documentation questions might look like this:

```python  theme={null}
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict

**Examples:**

Example 1 (unknown):
```unknown
## Requirements

To use MCP, ensure you have the following dependencies installed:

* `langgraph-api >= 0.2.3`
* `langgraph-sdk >= 0.1.61`

Install them with:

<CodeGroup>
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
</CodeGroup>

## Usage overview

To enable MCP:

* Upgrade to use langgraph-api>=0.2.3. If you are deploying LangSmith, this will be done for you automatically if you create a new revision.
* MCP tools (agents) will be automatically exposed.
* Connect with any MCP-compliant client that supports Streamable HTTP.

### Client

Use an MCP-compliant client to connect to the Agent Server. The following examples show how to connect using different programming languages.

<Tabs>
  <Tab title="JavaScript/TypeScript">
```

Example 4 (unknown):
```unknown
> **Note**
    > Replace `serverUrl` with your Agent Server URL and configure authentication headers as needed.
```

---

## Monorepo support

**URL:** llms-txt#monorepo-support

**Contents:**
- Repository Structure
- LangGraph.json configuration
- Building the application
- Tips and best practices

Source: https://docs.langchain.com/langsmith/monorepo-support

LangSmith supports deploying agents from monorepo setups where your agent code may depend on shared packages located elsewhere in the repository. This guide shows how to structure your monorepo and configure your `langgraph.json` file to work with shared dependencies.

## Repository Structure

For complete working examples, see:

* [Python monorepo example](https://github.com/langchain-ai/python-langraph-monorepo-example)
* [JS monorepo example](https://github.com/langchain-ai/js-langgraph-monorepo-example)

## LangGraph.json configuration

Place the langgraph.json file in your agent’s directory (not in the monorepo root). Ensure the file follows the required structure:

The Python implementation automatically handles packages in parent directories by:

* Detecting relative paths that start with `"."`.
* Adding parent directories to the Docker build context as needed.
* Supporting both real packages (with `pyproject.toml`/`setup.py`) and simple Python modules.

For JavaScript monorepos:

* Shared workspace dependencies are resolved automatically by your package manager.
* Your `package.json` should reference shared packages using workspace syntax.

Example `package.json` in the agent directory:

## Building the application

Run `langgraph build`:

The Python build process:

1. Automatically detects relative dependency paths.
2. Copies shared packages into the Docker build context.
3. Installs all dependencies in the correct order.
4. No special flags or commands required.

The JavaScript build process:

1. Uses the directory you called `langgraph build` from (the monorepo root in this case) as the build context.
2. Automatically detects your package manager (yarn, npm, pnpm, bun)
3. Runs the appropriate install command.
   * If you have one or both of a custom build/install command it will run from the directory you called `langgraph build` from.
   * Otherwise, it will run from the directory where the `langgraph.json` file is located.
4. Optionally runs a custom build command from the directory where the `langgraph.json` file is located (only if you pass the `--build-command` flag).

## Tips and best practices

1. **Keep agent configs in agent directories**: Place `langgraph.json` files in the specific agent directories, not at the monorepo root. This allows you to support multiple agents in the same monorepo, without having to deploy them all in the same LangSmith deployment.

2. **Use relative paths for Python**: For Python monorepos, use relative paths like `"../../shared-package"` in the `dependencies` array.

3. **Leverage workspace features for JS**: For JavaScript/TypeScript, use your package manager's workspace features to manage dependencies between packages.

4. **Test locally first**: Always test your build locally before deploying to ensure all dependencies are correctly resolved.

5. **Environment variables**: Keep environment files (`.env`) in your agent directories for environment-specific configuration.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/monorepo-support.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

## LangGraph.json configuration

Place the langgraph.json file in your agent’s directory (not in the monorepo root). Ensure the file follows the required structure:

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>

The Python implementation automatically handles packages in parent directories by:

* Detecting relative paths that start with `"."`.
* Adding parent directories to the Docker build context as needed.
* Supporting both real packages (with `pyproject.toml`/`setup.py`) and simple Python modules.

For JavaScript monorepos:

* Shared workspace dependencies are resolved automatically by your package manager.
* Your `package.json` should reference shared packages using workspace syntax.

Example `package.json` in the agent directory:
```

---

## Multi-agent

**URL:** llms-txt#multi-agent

**Contents:**
- Why multi-agent?
- Patterns
  - Choosing a pattern
  - Visual overview
- Performance comparison
  - One-shot request
  - Repeat request
  - Multi-domain
  - Summary

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/index

Multi-agent systems coordinate specialized components to tackle complex workflows. However, not every complex task requires this approach — a single agent with the right (sometimes dynamic) tools and prompt can often achieve similar results.

When developers say they need "multi-agent," they're usually looking for one or more of these capabilities:

* <Icon icon="brain" /> **Context management**: Provide specialized knowledge without overwhelming the model's context window. If context were infinite and latency zero, you could dump all knowledge into a single prompt — but since it's not, you need patterns to selectively surface relevant information.
* <Icon icon="users" /> **Distributed development**: Allow different teams to develop and maintain capabilities independently, composing them into a larger system with clear boundaries.
* <Icon icon="code-branch" /> **Parallelization**: Spawn specialized workers for subtasks and execute them concurrently for faster results.

Multi-agent patterns are particularly valuable when a single agent has too many [tools](/oss/python/langchain/tools) and makes poor decisions about which to use, when tasks require specialized knowledge with extensive context (long prompts and domain-specific tools), or when you need to enforce sequential constraints that unlock capabilities only after certain conditions are met.

<Tip>
  At the center of multi-agent design is **[context engineering](/oss/python/langchain/context-engineering)**—deciding what information each agent sees. The quality of your system depends on ensuring each agent has access to the right data for its task.
</Tip>

Here are the main patterns for building multi-agent systems, each suited to different use cases:

| Pattern                                                                  | How it works                                                                                                                                                                                        |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Subagents**](/oss/python/langchain/multi-agent/subagents)             | A main agent coordinates subagents as tools. All routing passes through the main agent, which decides when and how to invoke each subagent.                                                         |
| [**Handoffs**](/oss/python/langchain/multi-agent/handoffs)               | Behavior changes dynamically based on state. Tool calls update a state variable that triggers routing or configuration changes, switching agents or adjusting the current agent's tools and prompt. |
| [**Skills**](/oss/python/langchain/multi-agent/skills)                   | Specialized prompts and knowledge loaded on-demand. A single agent stays in control while loading context from skills as needed.                                                                    |
| [**Router**](/oss/python/langchain/multi-agent/router)                   | A routing step classifies input and directs it to one or more specialized agents. Results are synthesized into a combined response.                                                                 |
| [**Custom workflow**](/oss/python/langchain/multi-agent/custom-workflow) | Build bespoke execution flows with [LangGraph](/oss/python/langgraph/overview), mixing deterministic logic and agentic behavior. Embed other patterns as nodes in your workflow.                    |

### Choosing a pattern

Use this table to match your requirements to the right pattern:

<div className="compact-first-col">
  | Pattern                                                      | Distributed development | Parallelization | Multi-hop | Direct user interaction |
  | ------------------------------------------------------------ | :---------------------: | :-------------: | :-------: | :---------------------: |
  | [**Subagents**](/oss/python/langchain/multi-agent/subagents) |          ⭐⭐⭐⭐⭐          |      ⭐⭐⭐⭐⭐      |   ⭐⭐⭐⭐⭐   |            ⭐            |
  | [**Handoffs**](/oss/python/langchain/multi-agent/handoffs)   |            —            |        —        |   ⭐⭐⭐⭐⭐   |          ⭐⭐⭐⭐⭐          |
  | [**Skills**](/oss/python/langchain/multi-agent/skills)       |          ⭐⭐⭐⭐⭐          |       ⭐⭐⭐       |   ⭐⭐⭐⭐⭐   |          ⭐⭐⭐⭐⭐          |
  | [**Router**](/oss/python/langchain/multi-agent/router)       |           ⭐⭐⭐           |      ⭐⭐⭐⭐⭐      |     —     |           ⭐⭐⭐           |
</div>

* **Distributed development**: Can different teams maintain components independently?
* **Parallelization**: Can multiple agents execute concurrently?
* **Multi-hop**: Does the pattern support calling multiple subagents in series?
* **Direct user interaction**: Can subagents converse directly with the user?

<Tip>
  You can mix patterns! For example, a **subagents** architecture can invoke tools that invoke custom workflows or router agents. Subagents can even use the **skills** pattern to load context on-demand. The possibilities are endless!
</Tip>

<Tabs>
  <Tab title="Subagents">
    A main agent coordinates subagents as tools. All routing passes through the main agent.

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=f924dde09057820b08f0c577e08fcfe7" alt="Subagents pattern: main agent coordinates subagents as tools" data-og-width="1020" width="1020" data-og-height="734" height="734" data-path="oss/langchain/multi-agent/images/pattern-subagents.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=4e4b085ef1308d78eaff8bf4b3473985 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=fede88320efe5b670c511fc9e1f05b5c 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=e7c449b2e80796f22530336c3af2a4f5 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=dfb45ccef7213cf137cca21aec90e124 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=5caaa5cf326cacb4673867768a6cc199 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-subagents.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=aed1142e36c9d14ad3112fb79b3bd5e7 2500w" />
    </Frame>
  </Tab>

<Tab title="Handoffs">
    Agents transfer control to each other via tool calls. Each agent can hand off to others or respond directly to the user.

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=57d935e6a8efab4afb3faa385113f4dd" alt="Handoffs pattern: agents transfer control via tool calls" data-og-width="1568" width="1568" data-og-height="464" height="464" data-path="oss/langchain/multi-agent/images/pattern-handoffs.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=cfc3b5e2b23a6d1b8915dfb170cd5159 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=71294e02aa7f60075a01ac2faffa77b7 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=c80cb9704fdea99dfec1d02bb94ad471 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=dcc57244df656014e4ccb49d807a0c05 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=dbe088f5b86489170d1bf85ce28c7995 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-handoffs.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=e10a8a34caedade736d649706421f45e 2500w" />
    </Frame>
  </Tab>

<Tab title="Skills">
    A single agent loads specialized prompts and knowledge on-demand while staying in control.

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=119131d1f19be1f0c6fb1e30f080b427" alt="Skills pattern: single agent loads specialized context on-demand" data-og-width="874" width="874" data-og-height="734" height="734" data-path="oss/langchain/multi-agent/images/pattern-skills.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=80b62b337804e3c8b20056bfdad6b74f 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=7c7645d87fb5c213871d652e111dfa44 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=6f5f754c599781ba55be20c283d98fcd 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=19fe978ad163ef295c837896ceaa1caf 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=9f41caacf89ff268990dc6d1724bd8cb 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-skills.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=39c6340df7aec5e939cee67d9ad98a40 2500w" />
    </Frame>
  </Tab>

<Tab title="Router">
    A routing step classifies input and directs it to specialized agents. Results are synthesized.

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=ceab32819240ba87f3a132357cc78b09" alt="Router pattern: routing step classifies input to specialized agents" data-og-width="1560" width="1560" data-og-height="556" height="556" data-path="oss/langchain/multi-agent/images/pattern-router.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=857ddacf141ce0b362c08ca8b75bf719 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=4991e9d3838ecd4ff21d800d19b51bff 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=3416f6aae1a525ca9b1d90ab1e91ee0c 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=1a8ab6586a362986a00571d5f3a2d3a5 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=0fe06944e3e7fa6e49342753c4852b1a 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/pattern-router.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=f82cee5c5666099a5a66b363d76362d8 2500w" />
    </Frame>
  </Tab>
</Tabs>

## Performance comparison

Different patterns have different performance characteristics. Understanding these tradeoffs helps you choose the right pattern for your latency and cost requirements.

* **Model calls**: Number of LLM invocations. More calls = higher latency (especially if sequential) and higher per-request API costs.
* **Tokens processed**: Total [context window](/oss/python/langchain/context-engineering) usage across all calls. More tokens = higher processing costs and potential context limits.

> **User:** "Buy coffee"

A specialized coffee agent/skill can call a `buy_coffee` tool.

| Pattern                                                      | Model calls | Best fit |
| ------------------------------------------------------------ | :---------: | :------: |
| [**Subagents**](/oss/python/langchain/multi-agent/subagents) |      4      |          |
| [**Handoffs**](/oss/python/langchain/multi-agent/handoffs)   |      3      |     ✅    |
| [**Skills**](/oss/python/langchain/multi-agent/skills)       |      3      |     ✅    |
| [**Router**](/oss/python/langchain/multi-agent/router)       |      3      |     ✅    |

<Tabs>
  <Tab title="Subagents">
    **4 model calls:**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=bd4eeef41d8870bfa887dd0aa97d0b79" alt="Subagents one-shot: 4 model calls for buy coffee request" data-og-width="1568" width="1568" data-og-height="1124" height="1124" data-path="oss/langchain/multi-agent/images/oneshot-subagents.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=61db98521f4ddbff3470418212a40062 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=75249046f64486df8a6c91e1edbc5d62 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=216b75c4c0ead34cba19997fd5be0af9 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=3a19d53746a5b198be654ba18de483c1 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=23ff9b888cad16345faa881cf9aa808e 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-subagents.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=8976a6ec78331547b646dd15eb90f0a9 2500w" />
    </Frame>
  </Tab>

<Tab title="Handoffs">
    **3 model calls:**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=42ec50519ff04f034050dc77cf869907" alt="Handoffs one-shot: 3 model calls for buy coffee request" data-og-width="1568" width="1568" data-og-height="948" height="948" data-path="oss/langchain/multi-agent/images/oneshot-handoffs.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=09d4a564874688723b0c3989ca5ba375 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=390c244f99c977b7b6e103baa71e733a 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=c6de66fbc171439126a9fec2078c2026 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=f4db2c899f5f78607c678eeed60e8d3a 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=b43e0e123b612068f814561e7927c20c 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-handoffs.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=2a680c44fb25d22e6875ec3deab4e6e6 2500w" />
    </Frame>
  </Tab>

<Tab title="Skills">
    **3 model calls:**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=c8dbf69ed4509e30e5280e7e8a391dab" alt="Skills one-shot: 3 model calls for buy coffee request" data-og-width="1568" width="1568" data-og-height="1036" height="1036" data-path="oss/langchain/multi-agent/images/oneshot-skills.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=d20670af1435da771a4c5a01f99b075c 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=7796c447ae2e3f1688c2f8ecbf3a3770 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=e440c69718e244529033b329afb56349 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=addcee916efbca5df45784b7622fa458 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=bf6608052d6e239b67645dab3676ceed 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-skills.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=6347e03b16c67944960d58ae54238db0 2500w" />
    </Frame>
  </Tab>

<Tab title="Router">
    **3 model calls:**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=be5707931d3e520e3ae66af544f2cf2f" alt="Router one-shot: 3 model calls for buy coffee request" data-og-width="1568" width="1568" data-og-height="994" height="994" data-path="oss/langchain/multi-agent/images/oneshot-router.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=070b6ca92336de4dcf999436b8f9501f 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=6e80de6b0ca070638c3cc2db208144e7 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=14f1dd29ae24651f8f229f6b30b49504 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=39f3c2af6344753e6efa0cfdfabd8d55 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=bcb39a16af3f1e479cfccc41bfc9d92a 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/oneshot-router.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=ae9bc9a3ba4b2c83d1633008212109ef 2500w" />
    </Frame>
  </Tab>
</Tabs>

**Key insight:** Handoffs, Skills, and Router are most efficient for single tasks (3 calls each). Subagents adds one extra call because results flow back through the main agent—this overhead provides centralized control.

> **Turn 1:** "Buy coffee"
> **Turn 2:** "Buy coffee again"

The user repeats the same request in the same conversation.

<div className="compact-first-col">
  | Pattern                                                      | Turn 2 calls | Total (both turns) | Best fit |
  | ------------------------------------------------------------ | :----------: | :----------------: | :------: |
  | [**Subagents**](/oss/python/langchain/multi-agent/subagents) |       4      |          8         |          |
  | [**Handoffs**](/oss/python/langchain/multi-agent/handoffs)   |       2      |          5         |     ✅    |
  | [**Skills**](/oss/python/langchain/multi-agent/skills)       |       2      |          5         |     ✅    |
  | [**Router**](/oss/python/langchain/multi-agent/router)       |       3      |          6         |          |
</div>

<Tabs>
  <Tab title="Subagents">
    **4 calls again → 8 total**

* Subagents are **stateless by design**—each invocation follows the same flow
    * The main agent maintains conversation context, but subagents start fresh each time
    * This provides strong context isolation but repeats the full flow
  </Tab>

<Tab title="Handoffs">
    **2 calls → 5 total**

* The coffee agent is **still active** from turn 1 (state persists)
    * No handoff needed—agent directly calls `buy_coffee` tool (call 1)
    * Agent responds to user (call 2)
    * **Saves 1 call by skipping the handoff**
  </Tab>

<Tab title="Skills">
    **2 calls → 5 total**

* The skill context is **already loaded** in conversation history
    * No need to reload—agent directly calls `buy_coffee` tool (call 1)
    * Agent responds to user (call 2)
    * **Saves 1 call by reusing loaded skill**
  </Tab>

<Tab title="Router">
    **3 calls again → 6 total**

* Routers are **stateless**—each request requires an LLM routing call
    * Turn 2: Router LLM call (1) → Milk agent calls buy\_coffee (2) → Milk agent responds (3)
    * Can be optimized by wrapping as a tool in a stateful agent
  </Tab>
</Tabs>

**Key insight:** Stateful patterns (Handoffs, Skills) save 40-50% of calls on repeat requests. Subagents maintain consistent cost per request—this stateless design provides strong context isolation but at the cost of repeated model calls.

> **User:** "Compare Python, JavaScript, and Rust for web development"

Each language agent/skill contains \~2000 tokens of documentation. All patterns can make parallel tool calls.

| Pattern                                                      | Model calls | Total tokens | Best fit |
| ------------------------------------------------------------ | :---------: | :----------: | :------: |
| [**Subagents**](/oss/python/langchain/multi-agent/subagents) |      5      |     \~9K     |     ✅    |
| [**Handoffs**](/oss/python/langchain/multi-agent/handoffs)   |      7+     |    \~14K+    |          |
| [**Skills**](/oss/python/langchain/multi-agent/skills)       |      3      |     \~15K    |          |
| [**Router**](/oss/python/langchain/multi-agent/router)       |      5      |     \~9K     |     ✅    |

<Tabs>
  <Tab title="Subagents">
    **5 calls, \~9K tokens**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=9cc5d2d46bfa98b7ceeacdc473512c94" alt="Subagents multi-domain: 5 calls with parallel execution" data-og-width="1568" width="1568" data-og-height="1232" height="1232" data-path="oss/langchain/multi-agent/images/multidomain-subagents.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=5fe561bdba901844e7ff2f33c5b755b9 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=616e2db7119923be7df575f0f440cf94 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=87e0bf0604e4f575c405bfcc6a25b7a9 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=a78066e1fed60cc1120b3c241c08421b 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=935dd968e204ca6f51d7be2712211bf7 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-subagents.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=dd73db2d3a95b61932d245d8599d59ab 2500w" />
    </Frame>

Each subagent works in **isolation** with only its relevant context. Total: **9K tokens**.
  </Tab>

<Tab title="Handoffs">
    **7+ calls, \~14K+ tokens**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=7ede44260515e49ff1d0217f0030d66d" alt="Handoffs multi-domain: 7+ sequential calls" data-og-width="1568" width="1568" data-og-height="834" height="834" data-path="oss/langchain/multi-agent/images/multidomain-handoffs.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=e486eb835bf7487d767ecaa1ca22df59 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=6e2bece8beadc12596c98c26107f32d2 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=66c600cc7a50f250f48ae5e987d7b42f 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=9e1e2baa021f2b85c159c48cf21a22e8 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=9b659576b5308ee2145dd46f1136e7ed 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-handoffs.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=07dfd7985275da31defbc8be51193f50 2500w" />
    </Frame>

Handoffs executes **sequentially**—can't research all three languages in parallel. Growing conversation history adds overhead. Total: **\~14K+ tokens**.
  </Tab>

<Tab title="Skills">
    **3 calls, \~15K tokens**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=2162584b6076aee83396760bc6de4cf4" alt="Skills multi-domain: 3 calls with accumulated context" data-og-width="1560" width="1560" data-og-height="988" height="988" data-path="oss/langchain/multi-agent/images/multidomain-skills.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=14bca819ac7fb2d20c4852c2ee0c938f 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=4ff1878944fb9794a96d31413b0ce21a 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=cf16e178a983c0e78b79bacd9b214e23 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=24df8f7395f2dd07b8ee824f74a41219 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=7c4e2b20202d7c90da0c035e7b875768 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-skills.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=a100546e4fac49bef2f44e09dc56cf01 2500w" />
    </Frame>

After loading, **every subsequent call processes all 6K tokens of skill documentation**. Subagents processes 67% fewer tokens overall due to context isolation. Total: **15K tokens**.
  </Tab>

<Tab title="Router">
    **5 calls, \~9K tokens**

<Frame>
      <img src="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=ef11573bc65e5a2996d671bb3030ca6b" alt="Router multi-domain: 5 calls with parallel execution" data-og-width="1568" width="1568" data-og-height="1052" height="1052" data-path="oss/langchain/multi-agent/images/multidomain-router.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?w=280&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=d29d6a10afd985bddd9ee1ca53f16375 280w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?w=560&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=bd198b0a507d183c55142eae8689e8b4 560w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?w=840&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=85fa4448d00b20cf476ce782031498d4 840w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?w=1100&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=fd03ff3623e5e0aba9adff7103f85969 1100w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?w=1650&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=5b72257f679e5e837af544548084b6bc 1650w, https://mintcdn.com/langchain-5e9cc07a/CRpSg52QqwDx49Bw/oss/langchain/multi-agent/images/multidomain-router.png?w=2500&fit=max&auto=format&n=CRpSg52QqwDx49Bw&q=85&s=d00dccb3ad36508a4a50d52f093b3e10 2500w" />
    </Frame>

Router uses an **LLM for routing**, then invokes agents in parallel. Similar to Subagents but with explicit routing step. Total: **9K tokens**.
  </Tab>
</Tabs>

**Key insight:** For multi-domain tasks, patterns with parallel execution (Subagents, Router) are most efficient. Skills has fewer calls but high token usage due to context accumulation. Handoffs is inefficient here—it must execute sequentially and can't leverage parallel tool calling for consulting multiple domains simultaneously.

Here's how patterns compare across all three scenarios:

<div className="compact-first-col">
  | Pattern                                                      | One-shot | Repeat request |      Multi-domain     |
  | ------------------------------------------------------------ | :------: | :------------: | :-------------------: |
  | [**Subagents**](/oss/python/langchain/multi-agent/subagents) |  4 calls |  8 calls (4+4) |   5 calls, 9K tokens  |
  | [**Handoffs**](/oss/python/langchain/multi-agent/handoffs)   |  3 calls |  5 calls (3+2) | 7+ calls, 14K+ tokens |
  | [**Skills**](/oss/python/langchain/multi-agent/skills)       |  3 calls |  5 calls (3+2) |  3 calls, 15K tokens  |
  | [**Router**](/oss/python/langchain/multi-agent/router)       |  3 calls |  6 calls (3+3) |   5 calls, 9K tokens  |
</div>

**Choosing a pattern:**

<div className="compact-first-col">
  | Optimize for          | [Subagents](/oss/python/langchain/multi-agent/subagents) | [Handoffs](/oss/python/langchain/multi-agent/handoffs) | [Skills](/oss/python/langchain/multi-agent/skills) | [Router](/oss/python/langchain/multi-agent/router) |
  | --------------------- | :------------------------------------------------------: | :----------------------------------------------------: | :------------------------------------------------: | :------------------------------------------------: |
  | Single requests       |                                                          |                            ✅                           |                          ✅                         |                          ✅                         |
  | Repeat requests       |                                                          |                            ✅                           |                          ✅                         |                                                    |
  | Parallel execution    |                             ✅                            |                                                        |                                                    |                          ✅                         |
  | Large-context domains |                             ✅                            |                                                        |                                                    |                          ✅                         |
  | Simple, focused tasks |                                                          |                                                        |                          ✅                         |                                                    |
</div>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/index.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## my_agent/agent.py

**URL:** llms-txt#my_agent/agent.py

from typing import Literal
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, END, START
from my_agent.utils.nodes import call_model, should_continue, tool_node # import nodes
from my_agent.utils.state import AgentState # import state

---

## Node for making sure the 'followup' key is set before our agent run completes.

**URL:** llms-txt#node-for-making-sure-the-'followup'-key-is-set-before-our-agent-run-completes.

def compile_followup(state: State) -> dict:
    """Set the followup to be the last message if it hasn't explicitly been set."""
    if not state.get("followup"):
        return {"followup": state["messages"][-1].content}
    return {}

---

## Only keep post title, headers, and content from the full HTML.

**URL:** llms-txt#only-keep-post-title,-headers,-and-content-from-the-full-html.

**Contents:**
  - Splitting documents
  - Storing documents
- 2. Retrieval and Generation
  - RAG agents

bs4_strainer = bs4.SoupStrainer(class_=("post-title", "post-header", "post-content"))
loader = WebBaseLoader(
    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs={"parse_only": bs4_strainer},
)
docs = loader.load()

assert len(docs) == 1
print(f"Total characters: {len(docs[0].page_content)}")
text  theme={null}
Total characters: 43131
python  theme={null}
print(docs[0].page_content[:500])
text  theme={null}
      LLM Powered Autonomous Agents

Date: June 23, 2023  |  Estimated Reading Time: 31 min  |  Author: Lilian Weng

Building agents with LLM (large language model) as its core controller is a cool concept. Several proof-of-concepts demos, such as AutoGPT, GPT-Engineer and BabyAGI, serve as inspiring examples. The potentiality of LLM extends beyond generating well-written copies, stories, essays and programs; it can be framed as a powerful general problem solver.
Agent System Overview#
In
python  theme={null}
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # chunk size (characters)
    chunk_overlap=200,  # chunk overlap (characters)
    add_start_index=True,  # track index in original document
)
all_splits = text_splitter.split_documents(docs)

print(f"Split blog post into {len(all_splits)} sub-documents.")
text  theme={null}
Split blog post into 66 sub-documents.
python  theme={null}
document_ids = vector_store.add_documents(documents=all_splits)

print(document_ids[:3])
python  theme={null}
['07c18af6-ad58-479a-bfb1-d508033f9c64', '9000bf8e-1993-446f-8d4d-f4e507ba4b8f', 'ba3b5d14-bed9-4f5f-88be-44c88aedc2e6']
python  theme={null}
from langchain.tools import tool

@tool(response_format="content_and_artifact")
def retrieve_context(query: str):
    """Retrieve information to help answer a query."""
    retrieved_docs = vector_store.similarity_search(query, k=2)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\nContent: {doc.page_content}")
        for doc in retrieved_docs
    )
    return serialized, retrieved_docs
python  theme={null}
  from typing import Literal

def retrieve_context(query: str, section: Literal["beginning", "middle", "end"]):
  python  theme={null}
from langchain.agents import create_agent

tools = [retrieve_context]

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
**Go deeper**

`DocumentLoader`: Object that loads data from a source as list of `Documents`.

* [Integrations](/oss/python/integrations/document_loaders/): 160+ integrations to choose from.
* [`BaseLoader`](https://reference.langchain.com/python/langchain_core/document_loaders/#langchain_core.document_loaders.BaseLoader): API reference for the base interface.

### Splitting documents

Our loaded document is over 42k characters which is too long to fit into the context window of many models. Even for those models that could fit the full post in their context window, models can struggle to find information in very long inputs.

To handle this we'll split the [`Document`](https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document) into chunks for embedding and vector storage. This should help us retrieve only the most relevant parts of the blog post at run time.

As in the [semantic search tutorial](/oss/python/langchain/knowledge-base), we use a `RecursiveCharacterTextSplitter`, which will recursively split the document using common separators like new lines until each chunk is the appropriate size. This is the recommended text splitter for generic text use cases.
```

---

## Or if you'd like a token that can be used by any agent, set agent_scoped=False

**URL:** llms-txt#or-if-you'd-like-a-token-that-can-be-used-by-any-agent,-set-agent_scoped=false

auth_result = await client.authenticate(
    provider="{provider_id}",
    scopes=["scopeA"],
    user_id="your_user_id",
    agent_scoped=False
)
python  theme={null}
token = auth_result.token
python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
During execution, if authentication is required, the SDK will throw an [interrupt](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/add-human-in-the-loop/#pause-using-interrupt). The agent execution pauses and presents the OAuth URL to the user:

<img src="https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=94f84dd7ec822ca69f9a27b4458dca9f" alt="Studio interrupt showing OAuth URL" data-og-width="1197" width="1197" data-og-height="530" height="530" data-path="images/langgraph-auth-interrupt.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?w=280&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=8e2f6ddeb7ae2b7e3f349a23ed69270a 280w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?w=560&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=ed5f6697e44784a6a937f6bfd3248780 560w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?w=840&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=bb34295ee4128adb77cdf6dd1a76d88a 840w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?w=1100&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=09df9030e048467ca35ab70bf73b2272 1100w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?w=1650&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=ebfe20351ac52045b30713007da5ba61 1650w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/langgraph-auth-interrupt.png?w=2500&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=ff3b2fcebfdb6fc76e7269d8aef34077 2500w" />

After the user completes OAuth authentication and we receive the callback from the provider, they will see the auth success page.

<img src="https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=72e6492f074507bc8888804066205fcb" alt="GitHub OAuth success page" data-og-width="447" width="447" data-og-height="279" height="279" data-path="images/github-auth-success.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?w=280&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=031b2f9d30e4da4240059cb25fba6d15 280w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?w=560&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=eb4d01516b4691158a47a8b2632d22e3 560w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?w=840&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=e49b04f99e4c2f485769443da039bca1 840w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?w=1100&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=930aee5e270d2fcb4d6bdfb001150d81 1100w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?w=1650&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=3b5dc841251462c3ed140800564c0ad8 1650w, https://mintcdn.com/langchain-5e9cc07a/Xbr8HuVd9jPi6qTU/images/github-auth-success.png?w=2500&fit=max&auto=format&n=Xbr8HuVd9jPi6qTU&q=85&s=0e53fbc4c56b16bf1db88c98ab2e631d 2500w" />

The agent then resumes execution from the point it left off at, and the token can be used for any API calls. We store and refresh OAuth tokens so that future uses of the service by either the user or agent do not require an OAuth flow.
```

Example 2 (unknown):
```unknown
#### Outside LangGraph context

Provide the `auth_url` to the user for out-of-band OAuth flows.
```

---

## Print the agent's response

**URL:** llms-txt#print-the-agent's-response

**Contents:**
- What happened?
- Next steps

print(result["messages"][-1].content)
```

Your deep agent automatically:

1. **Planned its approach**: Used the built-in `write_todos` tool to break down the research task
2. **Conducted research**: Called the `internet_search` tool to gather information
3. **Managed context**: Used file system tools (`write_file`, `read_file`) to offload large search results
4. **Spawned subagents** (if needed): Delegated complex subtasks to specialized subagents
5. **Synthesized a report**: Compiled findings into a coherent response

Now that you've built your first deep agent:

* **Customize your agent**: Learn about [customization options](/oss/python/deepagents/customization), including custom system prompts, tools, and subagents.
* **Understand middleware**: Dive into the [middleware architecture](/oss/python/deepagents/middleware) that powers deep agents.
* **Add long-term memory**: Enable [persistent memory](/oss/python/deepagents/long-term-memory) across conversations.
* **Deploy to production**: Learn about [deployment options](/oss/python/langgraph/deploy) for LangGraph applications.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/quickstart.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Python >= 3.11 is required.

**URL:** llms-txt#python->=-3.11-is-required.

**Contents:**
  - 2. Prepare your agent
  - 3. Environment variables
  - 4. Create a LangGraph config file
  - 5. Install dependencies
  - 6. View your agent in Studio
- Video guide

pip install --upgrade "langgraph-cli[inmem]"
python title="agent.py" theme={null}
from langchain.agents import create_agent

def send_email(to: str, subject: str, body: str):
    """Send an email"""
    email = {
        "to": to,
        "subject": subject,
        "body": body
    }
    # ... email sending logic

return f"Email sent to {to}"

agent = create_agent(
    "gpt-4o",
    tools=[send_email],
    system_prompt="You are an email assistant. Always use the send_email tool.",
)
bash .env theme={null}
LANGSMITH_API_KEY=lsv2...
json title="langgraph.json" theme={null}
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent.py:agent"
  },
  "env": ".env"
}
bash  theme={null}
my-app/
├── src
│   └── agent.py
├── .env
└── langgraph.json
shell pip theme={null}
  pip install langchain langchain-openai
  shell uv theme={null}
  uv add langchain langchain-openai
  shell  theme={null}
langgraph dev
```

<Warning>
  Safari blocks `localhost` connections to Studio. To work around this, run the above command with `--tunnel` to access Studio via a secure tunnel.
</Warning>

Once the server is running, your agent is accessible both via API at `http://127.0.0.1:2024` and through the Studio UI at `https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024`:

<Frame>
    <img src="https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=ebd259e9fa24af7d011dfcc568f74be2" alt="Agent view in the Studio UI" data-og-width="2836" width="2836" data-og-height="1752" height="1752" data-path="oss/images/studio_create-agent.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=280&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=cf9c05bdd08661d4d546c540c7a28cbe 280w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=560&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=484b2fd56957d048bd89280ce97065a0 560w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=840&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=92991302ac24604022ab82ac22729f68 840w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=1100&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=ed366abe8dabc42a9d7c300a591e1614 1100w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=1650&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=d5865d3c4b0d26e9d72e50d474547a63 1650w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=2500&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=6b254add2df9cc3c10ac0c2bcb3a589c 2500w" />
</Frame>

With Studio connected to your local agent, you can iterate quickly on your agent's behavior. Run a test input, inspect the full execution trace including prompts, tool arguments, return values, and token/latency metrics. When something goes wrong, Studio captures exceptions with the surrounding state to help you understand what happened.

The development server supports hot-reloading—make changes to prompts or tool signatures in your code, and Studio reflects them immediately. Re-run conversation threads from any step to test your changes without starting over. This workflow scales from simple single-tool agents to complex multi-node graphs.

For more information on how to run Studio, refer to the following guides in the [LangSmith docs](/langsmith/home):

* [Run application](/langsmith/use-studio#run-application)
* [Manage assistants](/langsmith/use-studio#manage-assistants)
* [Manage threads](/langsmith/use-studio#manage-threads)
* [Iterate on prompts](/langsmith/observability-studio)
* [Debug LangSmith traces](/langsmith/observability-studio#debug-langsmith-traces)
* [Add node to dataset](/langsmith/observability-studio#add-node-to-dataset)

<Frame>
  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/Mi1gSlHwZLM?si=zA47TNuTC5aH0ahd" title="Studio" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
</Frame>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/studio.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
### 2. Prepare your agent

If you already have a LangChain agent, you can use it directly. This example uses a simple email agent:
```

Example 2 (unknown):
```unknown
### 3. Environment variables

Studio requires a LangSmith API key to connect your local agent. Create a `.env` file in the root of your project and add your API key from [LangSmith](https://smith.langchain.com/settings).

<Warning>
  Ensure your `.env` file is not committed to version control, such as Git.
</Warning>
```

Example 3 (unknown):
```unknown
### 4. Create a LangGraph config file

The LangGraph CLI uses a configuration file to locate your agent and manage dependencies. Create a `langgraph.json` file in your app's directory:
```

Example 4 (unknown):
```unknown
The [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) function automatically returns a compiled LangGraph graph, which is what the `graphs` key expects in the configuration file.

<Info>
  For detailed explanations of each key in the JSON object of the configuration file, refer to the [LangGraph configuration file reference](/langsmith/cli#configuration-file).
</Info>

At this point, the project structure will look like this:
```

---

## Reference

**URL:** llms-txt#reference

**Contents:**
- Reference sites

Source: https://docs.langchain.com/oss/python/reference/overview

Comprehensive API reference documentation for the LangChain and LangGraph Python and TypeScript libraries.

<CardGroup cols={2}>
  <Card title="LangChain" icon="link" href="https://reference.langchain.com/python/langchain/">
    Complete API reference for LangChain Python, including chat models, tools, agents, and more.
  </Card>

<Card title="LangGraph" icon="diagram-project" href="https://reference.langchain.com/python/langgraph/">
    Complete API reference for LangGraph Python, including graph APIs, state management, checkpointing, and more.
  </Card>

<Card title="LangChain Integrations" icon="plug" href="https://reference.langchain.com/python/integrations/">
    LangChain packages to connect with popular LLM providers, vector stores, tools, and other services.
  </Card>

<Card title="MCP Adapter" icon="plug" href="https://reference.langchain.com/python/langchain_mcp_adapters/">
    Use Model Context Protocol (MCP) tools within LangChain and LangGraph applications.
  </Card>

<Card title="Deep Agents" icon="robot" href="https://reference.langchain.com/python/deepagents/">
    Build agents that can plan, use subagents, and leverage file systems for complex tasks
  </Card>
</CardGroup>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/reference/overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Router

**URL:** llms-txt#router

**Contents:**
- Key characteristics
- When to use
- Basic implementation
- Stateless vs. stateful
- Stateless
- Stateful
  - Tool wrapper

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/router

In the **router** architecture, a routing step classifies input and directs it to specialized [agents](/oss/python/langchain/agents). This is useful when you have distinct **verticals**—separate knowledge domains that each require their own agent.

## Key characteristics

* Router decomposes the query
* Zero or more specialized agents are invoked in parallel
* Results are synthesized into a coherent response

Use the router pattern when you have distinct verticals (separate knowledge domains that each require their own agent), need to query multiple sources in parallel, and want to synthesize results into a combined response.

## Basic implementation

The router classifies the query and directs it to the appropriate agent(s). Use [`Command`](/oss/python/langgraph/graph-api#command) for single-agent routing or [`Send`](/oss/python/langgraph/graph-api#send) for parallel fan-out to multiple agents.

<Tabs>
  <Tab title="Single agent">
    Use `Command` to route to a single specialized agent:

<Tab title="Multiple agents (parallel)">
    Use `Send` to fan out to multiple specialized agents in parallel:

For a complete implementation, see the tutorial below.

<Card title="Tutorial: Build a multi-source knowledge base with routing" icon="book" href="/oss/python/langchain/multi-agent/router-knowledge-base">
  Build a router that queries GitHub, Notion, and Slack in parallel, then synthesizes results into a coherent answer. Covers state definition, specialized agents, parallel execution with `Send`, and result synthesis.
</Card>

## Stateless vs. stateful

* [**Stateless routers**](#stateless) address each request independently
* [**Stateful routers**](#stateful) maintain conversation history across requests

Each request is routed independently—no memory between calls. For multi-turn conversations, see [Stateful routers](#stateful).

<Tip>
  **Router vs. Subagents**: Both patterns can dispatch work to multiple agents, but they differ in how routing decisions are made:

* **Router**: A dedicated routing step (often a single LLM call or rule-based logic) that classifies the input and dispatches to agents. The router itself typically doesn't maintain conversation history or perform multi-turn orchestration—it's a preprocessing step.
  * **Subagents**: An main supervisor agent dynamically decides which [subagents](/oss/python/langchain/multi-agent/subagents) to call as part of an ongoing conversation. The main agent maintains context, can call multiple subagents across turns, and orchestrates complex multi-step workflows.

Use a **router** when you have clear input categories and want deterministic or lightweight classification. Use a **supervisor** when you need flexible, conversation-aware orchestration where the LLM decides what to do next based on evolving context.
</Tip>

For multi-turn conversations, you need to maintain context across invocations.

The simplest approach: wrap the stateless router as a tool that a conversational agent can call. The conversational agent handles memory and context; the router stays stateless. This avoids the complexity of managing conversation history across multiple parallel agents.

```python  theme={null}
@tool
def search_docs(query: str) -> str:
    """Search across multiple documentation sources."""
    result = workflow.invoke({"query": query})  # [!code highlight]
    return result["final_answer"]

**Examples:**

Example 1 (unknown):
```unknown
## Key characteristics

* Router decomposes the query
* Zero or more specialized agents are invoked in parallel
* Results are synthesized into a coherent response

## When to use

Use the router pattern when you have distinct verticals (separate knowledge domains that each require their own agent), need to query multiple sources in parallel, and want to synthesize results into a combined response.

## Basic implementation

The router classifies the query and directs it to the appropriate agent(s). Use [`Command`](/oss/python/langgraph/graph-api#command) for single-agent routing or [`Send`](/oss/python/langgraph/graph-api#send) for parallel fan-out to multiple agents.

<Tabs>
  <Tab title="Single agent">
    Use `Command` to route to a single specialized agent:
```

Example 2 (unknown):
```unknown
</Tab>

  <Tab title="Multiple agents (parallel)">
    Use `Send` to fan out to multiple specialized agents in parallel:
```

Example 3 (unknown):
```unknown
</Tab>
</Tabs>

For a complete implementation, see the tutorial below.

<Card title="Tutorial: Build a multi-source knowledge base with routing" icon="book" href="/oss/python/langchain/multi-agent/router-knowledge-base">
  Build a router that queries GitHub, Notion, and Slack in parallel, then synthesizes results into a coherent answer. Covers state definition, specialized agents, parallel execution with `Send`, and result synthesis.
</Card>

## Stateless vs. stateful

Two approaches:

* [**Stateless routers**](#stateless) address each request independently
* [**Stateful routers**](#stateful) maintain conversation history across requests

## Stateless

Each request is routed independently—no memory between calls. For multi-turn conversations, see [Stateful routers](#stateful).

<Tip>
  **Router vs. Subagents**: Both patterns can dispatch work to multiple agents, but they differ in how routing decisions are made:

  * **Router**: A dedicated routing step (often a single LLM call or rule-based logic) that classifies the input and dispatches to agents. The router itself typically doesn't maintain conversation history or perform multi-turn orchestration—it's a preprocessing step.
  * **Subagents**: An main supervisor agent dynamically decides which [subagents](/oss/python/langchain/multi-agent/subagents) to call as part of an ongoing conversation. The main agent maintains context, can call multiple subagents across turns, and orchestrates complex multi-step workflows.

  Use a **router** when you have clear input categories and want deterministic or lightweight classification. Use a **supervisor** when you need flexible, conversation-aware orchestration where the LLM decides what to do next based on evolving context.
</Tip>

## Stateful

For multi-turn conversations, you need to maintain context across invocations.

### Tool wrapper

The simplest approach: wrap the stateless router as a tool that a conversational agent can call. The conversational agent handles memory and context; the router stays stateless. This avoids the complexity of managing conversation history across multiple parallel agents.
```

---

## Runtime

**URL:** llms-txt#runtime

**Contents:**
- Overview
- Access
  - Inside tools
  - Inside middleware

Source: https://docs.langchain.com/oss/python/langchain/runtime

LangChain's [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) runs on LangGraph's runtime under the hood.

LangGraph exposes a [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object with the following information:

1. **Context**: static information like user id, db connections, or other dependencies for an agent invocation
2. **Store**: a [BaseStore](https://reference.langchain.com/python/langgraph/store/#langgraph.store.base.BaseStore) instance used for [long-term memory](/oss/python/langchain/long-term-memory)
3. **Stream writer**: an object used for streaming information via the `"custom"` stream mode

<Tip>
  Runtime context provides **dependency injection** for your tools and middleware. Instead of hardcoding values or using global state, you can inject runtime dependencies (like database connections, user IDs, or configuration) when invoking your agent. This makes your tools more testable, reusable, and flexible.
</Tip>

You can access the runtime information within [tools](#inside-tools) and [middleware](#inside-middleware).

When creating an agent with [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent), you can specify a `context_schema` to define the structure of the `context` stored in the agent [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime).

When invoking the agent, pass the `context` argument with the relevant configuration for the run:

You can access the runtime information inside tools to:

* Access the context
* Read or write long-term memory
* Write to the [custom stream](/oss/python/langchain/streaming#custom-updates) (ex, tool progress / updates)

Use the `ToolRuntime` parameter to access the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object inside a tool.

### Inside middleware

You can access runtime information in middleware to create dynamic prompts, modify messages, or control agent behavior based on user context.

Use `request.runtime` to access the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object inside middleware decorators. The runtime object is available in the [`ModelRequest`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelRequest) parameter passed to middleware functions.

```python  theme={null}
from dataclasses import dataclass

from langchain.messages import AnyMessage
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import dynamic_prompt, ModelRequest, before_model, after_model
from langgraph.runtime import Runtime

@dataclass
class Context:
    user_name: str

**Examples:**

Example 1 (unknown):
```unknown
### Inside tools

You can access the runtime information inside tools to:

* Access the context
* Read or write long-term memory
* Write to the [custom stream](/oss/python/langchain/streaming#custom-updates) (ex, tool progress / updates)

Use the `ToolRuntime` parameter to access the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object inside a tool.
```

Example 2 (unknown):
```unknown
### Inside middleware

You can access runtime information in middleware to create dynamic prompts, modify messages, or control agent behavior based on user context.

Use `request.runtime` to access the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object inside middleware decorators. The runtime object is available in the [`ModelRequest`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelRequest) parameter passed to middleware functions.
```

---

## Run backtests on a new version of an agent

**URL:** llms-txt#run-backtests-on-a-new-version-of-an-agent

**Contents:**
- Setup
  - Configure the environment

Source: https://docs.langchain.com/langsmith/run-backtests-new-agent

Deploying your application is just the beginning of a continuous improvement process. After you deploy to production, you'll want to refine your system by enhancing prompts, language models, tools, and architectures. Backtesting involves assessing new versions of your application using historical data and comparing the new outputs to the original ones. Compared to evaluations using pre-production datasets, backtesting offers a clearer indication of whether the new version of your application is an improvement over the current deployment.

Here are the basic steps for backtesting:

1. Select sample runs from your production tracing project to test against.
2. Transform the run inputs into a dataset and record the run outputs as an initial experiment against that dataset.
3. Execute your new system on the new dataset and compare the results of the experiments.

This process will provide you with a new dataset of representative inputs, which you can version and use for backtesting your models.

<Info>
  Often, you won't have definitive "ground truth" answers available. In such cases, you can manually label the outputs or use evaluators that don't rely on reference data. If your application allows for capturing ground-truth labels, for example by allowing users to leave feedback, we strongly recommend doing so.
</Info>

### Configure the environment

Install and set environment variables. This guide requires `langsmith>=0.2.4`.

<Info>
  For convenience we'll use the LangChain OSS framework in this tutorial, but the LangSmith functionality shown is framework-agnostic.
</Info>

```python  theme={null}
import getpass
import os

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>
```

---

## Run the agent

**URL:** llms-txt#run-the-agent

**Contents:**
- Build a real-world agent

agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
python wrap theme={null}
    SYSTEM_PROMPT = """You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
    - get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location."""
    python  theme={null}
    from dataclasses import dataclass
    from langchain.tools import tool, ToolRuntime

@tool
    def get_weather_for_location(city: str) -> str:
        """Get weather for a given city."""
        return f"It's always sunny in {city}!"

@dataclass
    class Context:
        """Custom runtime context schema."""
        user_id: str

@tool
    def get_user_location(runtime: ToolRuntime[Context]) -> str:
        """Retrieve user information based on user ID."""
        user_id = runtime.context.user_id
        return "Florida" if user_id == "1" else "SF"
    python  theme={null}
    from langchain.chat_models import init_chat_model

model = init_chat_model(
        "claude-sonnet-4-5-20250929",
        temperature=0.5,
        timeout=10,
        max_tokens=1000
    )
    python  theme={null}
    from dataclasses import dataclass

# We use a dataclass here, but Pydantic models are also supported.
    @dataclass
    class ResponseFormat:
        """Response schema for the agent."""
        # A punny response (always required)
        punny_response: str
        # Any interesting information about the weather if available
        weather_conditions: str | None = None
    python  theme={null}
    from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
    python  theme={null}
    from langchain.agents.structured_output import ToolStrategy

agent = create_agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        tools=[get_user_location, get_weather_for_location],
        context_schema=Context,
        response_format=ToolStrategy(ResponseFormat),
        checkpointer=checkpointer
    )

# `thread_id` is a unique identifier for a given conversation.
    config = {"configurable": {"thread_id": "1"}}

response = agent.invoke(
        {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
        config=config,
        context=Context(user_id="1")
    )

print(response['structured_response'])
    # ResponseFormat(
    #     punny_response="Florida is still having a 'sun-derful' day! The sunshine is playing 'ray-dio' hits all day long! I'd say it's the perfect weather for some 'solar-bration'! If you were hoping for rain, I'm afraid that idea is all 'washed up' - the forecast remains 'clear-ly' brilliant!",
    #     weather_conditions="It's always sunny in Florida!"
    # )

# Note that we can continue the conversation using the same `thread_id`.
    response = agent.invoke(
        {"messages": [{"role": "user", "content": "thank you!"}]},
        config=config,
        context=Context(user_id="1")
    )

print(response['structured_response'])
    # ResponseFormat(
    #     punny_response="You're 'thund-erfully' welcome! It's always a 'breeze' to help you stay 'current' with the weather. I'm just 'cloud'-ing around waiting to 'shower' you with more forecasts whenever you need them. Have a 'sun-sational' day in the Florida sunshine!",
    #     weather_conditions=None
    # )
    python  theme={null}
  from dataclasses import dataclass

from langchain.agents import create_agent
  from langchain.chat_models import init_chat_model
  from langchain.tools import tool, ToolRuntime
  from langgraph.checkpoint.memory import InMemorySaver
  from langchain.agents.structured_output import ToolStrategy

# Define system prompt
  SYSTEM_PROMPT = """You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
  - get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location."""

# Define context schema
  @dataclass
  class Context:
      """Custom runtime context schema."""
      user_id: str

# Define tools
  @tool
  def get_weather_for_location(city: str) -> str:
      """Get weather for a given city."""
      return f"It's always sunny in {city}!"

@tool
  def get_user_location(runtime: ToolRuntime[Context]) -> str:
      """Retrieve user information based on user ID."""
      user_id = runtime.context.user_id
      return "Florida" if user_id == "1" else "SF"

# Configure model
  model = init_chat_model(
      "claude-sonnet-4-5-20250929",
      temperature=0
  )

# Define response format
  @dataclass
  class ResponseFormat:
      """Response schema for the agent."""
      # A punny response (always required)
      punny_response: str
      # Any interesting information about the weather if available
      weather_conditions: str | None = None

# Set up memory
  checkpointer = InMemorySaver()

# Create agent
  agent = create_agent(
      model=model,
      system_prompt=SYSTEM_PROMPT,
      tools=[get_user_location, get_weather_for_location],
      context_schema=Context,
      response_format=ToolStrategy(ResponseFormat),
      checkpointer=checkpointer
  )

# Run agent
  # `thread_id` is a unique identifier for a given conversation.
  config = {"configurable": {"thread_id": "1"}}

response = agent.invoke(
      {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
      config=config,
      context=Context(user_id="1")
  )

print(response['structured_response'])
  # ResponseFormat(
  #     punny_response="Florida is still having a 'sun-derful' day! The sunshine is playing 'ray-dio' hits all day long! I'd say it's the perfect weather for some 'solar-bration'! If you were hoping for rain, I'm afraid that idea is all 'washed up' - the forecast remains 'clear-ly' brilliant!",
  #     weather_conditions="It's always sunny in Florida!"
  # )

# Note that we can continue the conversation using the same `thread_id`.
  response = agent.invoke(
      {"messages": [{"role": "user", "content": "thank you!"}]},
      config=config,
      context=Context(user_id="1")
  )

print(response['structured_response'])
  # ResponseFormat(
  #     punny_response="You're 'thund-erfully' welcome! It's always a 'breeze' to help you stay 'current' with the weather. I'm just 'cloud'-ing around waiting to 'shower' you with more forecasts whenever you need them. Have a 'sun-sational' day in the Florida sunshine!",
  #     weather_conditions=None
  # )
  ```
</Expandable>

<Tip>
  To learn how to trace your agent with LangSmith, see the [LangSmith documentation](/langsmith/trace-with-langchain).
</Tip>

Congratulations! You now have an AI agent that can:

* **Understand context** and remember conversations
* **Use multiple tools** intelligently
* **Provide structured responses** in a consistent format
* **Handle user-specific information** through context
* **Maintain conversation state** across interactions

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/quickstart.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
<Tip>
  To learn how to trace your agent with LangSmith, see the [LangSmith documentation](/langsmith/trace-with-langchain).
</Tip>

## Build a real-world agent

Next, build a practical weather forecasting agent that demonstrates key production concepts:

1. **Detailed system prompts** for better agent behavior
2. **Create tools** that integrate with external data
3. **Model configuration** for consistent responses
4. **Structured output** for predictable results
5. **Conversational memory** for chat-like interactions
6. **Create and run the agent** create a fully functional agent

Let's walk through each step:

<Steps>
  <Step title="Define the system prompt">
    The system prompt defines your agent’s role and behavior. Keep it specific and actionable:
```

Example 2 (unknown):
```unknown
</Step>

  <Step title="Create tools">
    [Tools](/oss/python/langchain/tools) let a model interact with external systems by calling functions you define.
    Tools can depend on [runtime context](/oss/python/langchain/runtime) and also interact with [agent memory](/oss/python/langchain/short-term-memory).

    Notice below how the `get_user_location` tool uses runtime context:
```

Example 3 (unknown):
```unknown
<Tip>
      Tools should be well-documented: their name, description, and argument names become part of the model's prompt.
      LangChain's [`@tool` decorator](https://reference.langchain.com/python/langchain/tools/#langchain.tools.tool) adds metadata and enables runtime injection via the `ToolRuntime` parameter.
    </Tip>
  </Step>

  <Step title="Configure your model">
    Set up your [language model](/oss/python/langchain/models) with the right parameters for your use case:
```

Example 4 (unknown):
```unknown
Depending on the model and provider chosen, initialization parameters may vary; refer to their reference pages for details.
  </Step>

  <Step title="Define response format">
    Optionally, define a structured response format if you need the agent responses to match
    a specific schema.
```

---

## Run the agent - all steps will be traced automatically

**URL:** llms-txt#run-the-agent---all-steps-will-be-traced-automatically

**Contents:**
- Trace selectively

response = agent.invoke({
    "messages": [{"role": "user", "content": "Search for the latest AI news and email a summary to john@example.com"}]
})
python  theme={null}
import langsmith as ls

**Examples:**

Example 1 (unknown):
```unknown
By default, the trace will be logged to the project with the name `default`. To configure a custom project name, see [Log to a project](#log-to-a-project).

## Trace selectively

You may opt to trace specific invocations or parts of your application using LangSmith's `tracing_context` context manager:
```

---

## search for "memories" within this namespace, filtering on content equivalence, sorted by vector similarity

**URL:** llms-txt#search-for-"memories"-within-this-namespace,-filtering-on-content-equivalence,-sorted-by-vector-similarity

**Contents:**
- Read long-term memory in tools

items = store.search( # [!code highlight]
    namespace, filter={"my-key": "my-value"}, query="language preferences"
)
python A tool the agent can use to look up user information theme={null}
from dataclasses import dataclass

from langchain_core.runnables import RunnableConfig
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langgraph.store.memory import InMemoryStore

@dataclass
class Context:
    user_id: str

**Examples:**

Example 1 (unknown):
```unknown
For more information about the memory store, see the [Persistence](/oss/python/langgraph/persistence#memory-store) guide.

## Read long-term memory in tools
```

---

## Second invocation: the first message is persisted (Sydney location), so the model returns GMT+10 time

**URL:** llms-txt#second-invocation:-the-first-message-is-persisted-(sydney-location),-so-the-model-returns-gmt+10-time

**Contents:**
- Integration Testing
  - Installing AgentEvals
  - Trajectory Match Evaluator
  - LLM-as-Judge Evaluator
  - Async Support
- LangSmith Integration
- Recording & Replaying HTTP Calls

agent.invoke(HumanMessage(content="What's my local time?"))
bash  theme={null}
pip install agentevals
python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.match import create_trajectory_match_evaluator

@tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

agent = create_agent("gpt-4o", tools=[get_weather])

evaluator = create_trajectory_match_evaluator(  # [!code highlight]
      trajectory_match_mode="strict",  # [!code highlight]
  )  # [!code highlight]

def test_weather_tool_called_strict():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in San Francisco?")]
      })

reference_trajectory = [
          HumanMessage(content="What's the weather in San Francisco?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_weather", "args": {"city": "San Francisco"}}
          ]),
          ToolMessage(content="It's 75 degrees and sunny in San Francisco.", tool_call_id="call_1"),
          AIMessage(content="The weather in San Francisco is 75 degrees and sunny."),
      ]

evaluation = evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory
      )
      # {
      #     'key': 'trajectory_strict_match',
      #     'score': True,
      #     'comment': None,
      # }
      assert evaluation["score"] is True
  python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.match import create_trajectory_match_evaluator

@tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

@tool
  def get_events(city: str):
      """Get events happening in a city."""
      return f"Concert at the park in {city} tonight."

agent = create_agent("gpt-4o", tools=[get_weather, get_events])

evaluator = create_trajectory_match_evaluator(  # [!code highlight]
      trajectory_match_mode="unordered",  # [!code highlight]
  )  # [!code highlight]

def test_multiple_tools_any_order():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's happening in SF today?")]
      })

# Reference shows tools called in different order than actual execution
      reference_trajectory = [
          HumanMessage(content="What's happening in SF today?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_events", "args": {"city": "SF"}},
              {"id": "call_2", "name": "get_weather", "args": {"city": "SF"}},
          ]),
          ToolMessage(content="Concert at the park in SF tonight.", tool_call_id="call_1"),
          ToolMessage(content="It's 75 degrees and sunny in SF.", tool_call_id="call_2"),
          AIMessage(content="Today in SF: 75 degrees and sunny with a concert at the park tonight."),
      ]

evaluation = evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory,
      )
      # {
      #     'key': 'trajectory_unordered_match',
      #     'score': True,
      # }
      assert evaluation["score"] is True
  python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.match import create_trajectory_match_evaluator

@tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

@tool
  def get_detailed_forecast(city: str):
      """Get detailed weather forecast for a city."""
      return f"Detailed forecast for {city}: sunny all week."

agent = create_agent("gpt-4o", tools=[get_weather, get_detailed_forecast])

evaluator = create_trajectory_match_evaluator(  # [!code highlight]
      trajectory_match_mode="superset",  # [!code highlight]
  )  # [!code highlight]

def test_agent_calls_required_tools_plus_extra():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in Boston?")]
      })

# Reference only requires get_weather, but agent may call additional tools
      reference_trajectory = [
          HumanMessage(content="What's the weather in Boston?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_weather", "args": {"city": "Boston"}},
          ]),
          ToolMessage(content="It's 75 degrees and sunny in Boston.", tool_call_id="call_1"),
          AIMessage(content="The weather in Boston is 75 degrees and sunny."),
      ]

evaluation = evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory,
      )
      # {
      #     'key': 'trajectory_superset_match',
      #     'score': True,
      #     'comment': None,
      # }
      assert evaluation["score"] is True
  python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.llm import create_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT

@tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

agent = create_agent("gpt-4o", tools=[get_weather])

evaluator = create_trajectory_llm_as_judge(  # [!code highlight]
      model="openai:o3-mini",  # [!code highlight]
      prompt=TRAJECTORY_ACCURACY_PROMPT,  # [!code highlight]
  )  # [!code highlight]

def test_trajectory_quality():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in Seattle?")]
      })

evaluation = evaluator(
          outputs=result["messages"],
      )
      # {
      #     'key': 'trajectory_accuracy',
      #     'score': True,
      #     'comment': 'The provided agent trajectory is reasonable...'
      # }
      assert evaluation["score"] is True
  python  theme={null}
  evaluator = create_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE,
  )
  evaluation = judge_with_reference(
      outputs=result["messages"],
      reference_outputs=reference_trajectory,
  )
  python  theme={null}
  from agentevals.trajectory.llm import create_async_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT
  from agentevals.trajectory.match import create_async_trajectory_match_evaluator

async_judge = create_async_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT,
  )

async_evaluator = create_async_trajectory_match_evaluator(
      trajectory_match_mode="strict",
  )

async def test_async_evaluation():
      result = await agent.ainvoke({
          "messages": [HumanMessage(content="What's the weather?")]
      })

evaluation = await async_judge(outputs=result["messages"])
      assert evaluation["score"] is True
  bash  theme={null}
export LANGSMITH_API_KEY="your_langsmith_api_key"
export LANGSMITH_TRACING="true"
python  theme={null}
  import pytest
  from langsmith import testing as t
  from agentevals.trajectory.llm import create_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT

trajectory_evaluator = create_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT,
  )

@pytest.mark.langsmith
  def test_trajectory_accuracy():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in SF?")]
      })

reference_trajectory = [
          HumanMessage(content="What's the weather in SF?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_weather", "args": {"city": "SF"}},
          ]),
          ToolMessage(content="It's 75 degrees and sunny in SF.", tool_call_id="call_1"),
          AIMessage(content="The weather in SF is 75 degrees and sunny."),
      ]

# Log inputs, outputs, and reference outputs to LangSmith
      t.log_inputs({})
      t.log_outputs({"messages": result["messages"]})
      t.log_reference_outputs({"messages": reference_trajectory})

trajectory_evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory
      )
  bash  theme={null}
  pytest test_trajectory.py --langsmith-output
  python  theme={null}
  from langsmith import Client
  from agentevals.trajectory.llm import create_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT

trajectory_evaluator = create_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT,
  )

def run_agent(inputs):
      """Your agent function that returns trajectory messages."""
      return agent.invoke(inputs)["messages"]

experiment_results = client.evaluate(
      run_agent,
      data="your_dataset_name",
      evaluators=[trajectory_evaluator]
  )
  py conftest.py theme={null}
import pytest

@pytest.fixture(scope="session")
def vcr_config():
    return {
        "filter_headers": [
            ("authorization", "XXXX"),
            ("x-api-key", "XXXX"),
            # ... other headers you want to mask
        ],
        "filter_query_parameters": [
            ("api_key", "XXXX"),
            ("key", "XXXX"),
        ],
    }
ini pytest.ini theme={null}
  [pytest]
  markers =
      vcr: record/replay HTTP via VCR
  addopts = --record-mode=once
  toml pyproject.toml theme={null}
  [tool.pytest.ini_options]
  markers = [
    "vcr: record/replay HTTP via VCR"
  ]
  addopts = "--record-mode=once"
  python  theme={null}
@pytest.mark.vcr()
def test_agent_trajectory():
    # ...
```

The first time you run this test, your agent will make real network calls and pytest will generate a cassette file `test_agent_trajectory.yaml` in the `tests/cassettes` directory. Subsequent runs will use that cassette to mock the real network calls, granted the agent's requests don't change from the previous run. If they do, the test will fail and you'll need to delete the cassette and rerun the test to record fresh interactions.

<Warning>
  When you modify prompts, add new tools, or change expected trajectories, your saved cassettes will become outdated and your existing tests **will fail**. You should delete the corresponding cassette files and rerun the tests to record fresh interactions.
</Warning>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/test.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Integration Testing

Many agent behaviors only emerge when using a real LLM, such as which tool the agent decides to call, how it formats responses, or whether a prompt modification affects the entire execution trajectory. LangChain's [`agentevals`](https://github.com/langchain-ai/agentevals) package provides evaluators specifically designed for testing agent trajectories with live models.

AgentEvals lets you easily evaluate the trajectory of your agent (the exact sequence of messages, including tool calls) by performing a **trajectory match** or by using an **LLM judge**:

<Card title="Trajectory match" icon="equals" arrow="true" href="#trajectory-match-evaluator">
  Hard-code a reference trajectory for a given input and validate the run via a step-by-step comparison.

  Ideal for testing well-defined workflows where you know the expected behavior. Use when you have specific expectations about which tools should be called and in what order. This approach is deterministic, fast, and cost-effective since it doesn't require additional LLM calls.
</Card>

<Card title="LLM-as-judge" icon="gavel" arrow="true" href="#llm-as-judge-evaluator">
  Use a LLM to qualitatively validate your agent's execution trajectory. The "judge" LLM reviews the agent's decisions against a prompt rubric (which can include a reference trajectory).

  More flexible and can assess nuanced aspects like efficiency and appropriateness, but requires an LLM call and is less deterministic. Use when you want to evaluate the overall quality and reasonableness of the agent's trajectory without strict tool call or ordering requirements.
</Card>

### Installing AgentEvals
```

Example 2 (unknown):
```unknown
Or, clone the [AgentEvals repository](https://github.com/langchain-ai/agentevals) directly.

### Trajectory Match Evaluator

AgentEvals offers the `create_trajectory_match_evaluator` function to match your agent's trajectory against a reference trajectory. There are four modes to choose from:

| Mode        | Description                                               | Use Case                                                              |
| ----------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| `strict`    | Exact match of messages and tool calls in the same order  | Testing specific sequences (e.g., policy lookup before authorization) |
| `unordered` | Same tool calls allowed in any order                      | Verifying information retrieval when order doesn't matter             |
| `subset`    | Agent calls only tools from reference (no extras)         | Ensuring agent doesn't exceed expected scope                          |
| `superset`  | Agent calls at least the reference tools (extras allowed) | Verifying minimum required actions are taken                          |

<Accordion title="Strict match">
  The `strict` mode ensures trajectories contain identical messages in the same order with the same tool calls, though it allows for differences in message content. This is useful when you need to enforce a specific sequence of operations, such as requiring a policy lookup before authorizing an action.
```

Example 3 (unknown):
```unknown
</Accordion>

<Accordion title="Unordered match">
  The `unordered` mode allows the same tool calls in any order, which is helpful when you want to verify that specific information was retrieved but don't care about the sequence. For example, an agent might need to check both weather and events for a city, but the order doesn't matter.
```

Example 4 (unknown):
```unknown
</Accordion>

<Accordion title="Subset and superset match">
  The `superset` and `subset` modes match partial trajectories. The `superset` mode verifies that the agent called at least the tools in the reference trajectory, allowing additional tool calls. The `subset` mode ensures the agent did not call any tools beyond those in the reference.
```

---

## Self-hosted on AWS

**URL:** llms-txt#self-hosted-on-aws

**Contents:**
- Reference architecture
- Compute options
- AWS Well-Architected best practices
  - Operational excellence
  - Security
  - Reliability
  - Performance efficiency
  - Cost optimization
  - Sustainability
- Security and compliance

Source: https://docs.langchain.com/langsmith/aws-self-hosted

When running LangSmith on [Amazon Web Services (AWS)](https://aws.amazon.com/), you can set up in either [full self-hosted](/langsmith/self-hosted) or [hybrid](/langsmith/hybrid) mode. Full self-hosted mode deploys a complete LangSmith platform with observability functionality as well as the option to create agent deployments. Hybrid mode entails just the infrastructure to run agents in a data plane within your cloud, while our SaaS provides the control plane and observability functionality.

This page provides AWS-specific architecture patterns, service recommendations, and best practices for deploying and operating LangSmith on AWS.

<Note>
  LangChain provides Terraform modules specifically for AWS to help provision infrastructure for LangSmith. These modules can quickly set up EKS clusters, RDS, ElastiCache, S3, and networking resources.

View the [AWS Terraform modules](https://github.com/langchain-ai/terraform/tree/main/modules/aws) for documentation and examples.
</Note>

## Reference architecture

We recommend leveraging AWS's managed services to provide a scalable, secure, and resilient platform. The following architecture applies to both self-hosted and hybrid and aligns with the [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/):

<img src="https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=c2ae668eb790588e05a86aaca8e8fc76" alt="Architecture diagram showing AWS relations to LangSmith services" data-og-width="2198" width="2198" data-og-height="1498" height="1498" data-path="langsmith/images/aws-architecture-self-hosted.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?w=280&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=fcb5e9084862934ae10195f77dd38c95 280w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?w=560&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=c98a9d506a44ad748443c54fe9d5f6cc 560w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?w=840&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=374d8ded99973e8ba18d6968d404a702 840w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?w=1100&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=033a9b1620a8978848ad571475466910 1100w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?w=1650&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=fb293874556deb5b157678c76a24d245 1650w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/aws-architecture-self-hosted.png?w=2500&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=cb4f0323f3a0077df4f4506127e6004e 2500w" />

* <Icon icon="globe" /> **Ingress & networking**: Requests enter via [Amazon Application Load Balancer (ALB)](https://aws.amazon.com/elasticloadbalancing/application-load-balancer/) within your [VPC](https://aws.amazon.com/vpc/), secured using [AWS WAF](https://aws.amazon.com/waf/) and [IAM](https://aws.amazon.com/iam/)-based authentication.

* <Icon icon="cube" /> **Frontend & backend services:** Containers run on [Amazon EKS](https://aws.amazon.com/eks/), orchestrated behind the ALB. routes requests to other services within the cluster as necessary.

* <Icon icon="database" /> **Storage & databases:**
  * [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/) or [Aurora](https://aws.amazon.com/rds/aurora/): metadata, projects, users, and short-term and long-term memory for deployed agents. LangSmith supports PostgreSQL version 14 or higher.
  * [Amazon ElastiCache (Redis)](https://aws.amazon.com/elasticache/redis/): caching and job queues. ElastiCache can be in single-instance or cluster mode, running Redis OSS version 5 or higher.
  * ClickHouse + [Amazon EBS](https://aws.amazon.com/ebs/): analytics and trace storage.
    * We recommend using an [externally managed ClickHouse solution](/langsmith/self-host-external-clickhouse) unless security or compliance reasons
      prevent you from doing so.
    * ClickHouse is not required for hybrid deployments.
  * [Amazon S3](https://aws.amazon.com/s3/): object storage for trace artifacts and telemetry.

* <Icon icon="sparkles" /> **LLM integration:** Optionally proxy requests to [Amazon Bedrock](https://aws.amazon.com/bedrock/) or [Amazon SageMaker](https://aws.amazon.com/sagemaker/) for LLM inference.

* <Icon icon="chart-line" /> **Monitoring & observability:** Integrate with [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/)

LangSmith supports multiple compute options depending on your requirements:

| Compute option                             | Description                               | Suitable for                         |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------ |
| **Elastic Kubernetes Service (preferred)** | Advanced scaling and multi-tenant support | Large enterprises                    |
| **EC2-based**                              | Full control, BYO-infra                   | Regulated or air-gapped environments |

## AWS Well-Architected best practices

This reference is designed to align with the six pillars of the AWS Well-Architected Framework:

### Operational excellence

* Automate deployments with IaC ([CloudFormation](https://aws.amazon.com/cloudformation/) / [Terraform](https://www.terraform.io/)).
* Use [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) for configuration.
* Configure your LangSmith instance to [export telemetry data](/langsmith/export-backend) and continuously monitor via [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html).
* The preferred method to manage [LangSmith deployments](/langsmith/deployments) is to create a CI process that builds [Agent Server](/langsmith/agent-server) images and pushes them to [ECR](https://aws.amazon.com/ecr/). Create a test deployment for pull requests before deploying a new revision to staging or production upon PR merge.

* Use [IAM](https://aws.amazon.com/iam/) roles with least-privilege policies.
* Enable encryption at rest ([RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html), [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html), ClickHouse volumes) and in transit (TLS 1.2+).
* Integrate with [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) for credentials.
* Use [Amazon Cognito](https://aws.amazon.com/cognito/) as an IDP in conjunction with LangSmith's built-in authentication and authorization features to secure access to agents and their tools.

* Replicate the LangSmith [data plane](/langsmith/data-plane) across regions: Deploy identical data planes to Kubernetes clusters in different regions for LangSmith Deployment. Deploy [RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) and [ECS](https://aws.amazon.com/ecs/) services across [Multi-AZ](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/).
* Implement [auto-scaling](https://aws.amazon.com/autoscaling/) for backend workers.
* Use [Amazon Route 53](https://aws.amazon.com/route53/) health checks and failover policies.

### Performance efficiency

* Leverage [EC2](https://aws.amazon.com/ec2/) instances for optimized compute.
* Use [S3 Intelligent-Tiering](https://aws.amazon.com/s3/storage-classes/intelligent-tiering/) for infrequently accessed trace data.

### Cost optimization

* Right-size [EKS](https://aws.amazon.com/eks/) clusters using [Compute Savings Plans](https://aws.amazon.com/savingsplans/compute-pricing/).
* Monitor cost KPIs using [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) dashboards.

* Minimize idle workloads with on-demand compute.
* Store telemetry in low-latency, low-cost tiers.
* Enable auto-shutdown for non-prod environments.

## Security and compliance

LangSmith can be configured for:

* [PrivateLink](https://aws.amazon.com/privatelink/)-only access (no public internet exposure, besides egress necessary for billing).
* [KMS](https://aws.amazon.com/kms/)-based encryption keys for S3, RDS, and EBS.
* Audit logging to [CloudWatch](https://aws.amazon.com/cloudwatch/) and [AWS CloudTrail](https://aws.amazon.com/cloudtrail/).

Customers can deploy in [GovCloud](https://aws.amazon.com/govcloud-us/), ISO, or HIPAA regions as needed.

## Monitoring and evals

* Capture traces from LLM apps running on [Bedrock](https://aws.amazon.com/bedrock/) or [SageMaker](https://aws.amazon.com/sagemaker/).
* Evaluate model outputs via [LangSmith datasets](/langsmith/manage-datasets).
* Track latency, token usage, and success rates.

* [AWS CloudWatch](https://aws.amazon.com/cloudwatch/) dashboards.
* [OpenTelemetry](https://opentelemetry.io/) and [Prometheus](https://prometheus.io/) exporters.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/aws-self-hosted.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Self-hosted on Azure

**URL:** llms-txt#self-hosted-on-azure

**Contents:**
- Reference architecture
- Compute and networking on Azure
  - Azure Kubernetes Service (AKS)
  - Networking and identity
- Storage and data services
  - Azure Database for PostgreSQL
  - Azure Managed Redis
  - ClickHouse on Azure
  - Azure Blob Storage
- Security and access control

Source: https://docs.langchain.com/langsmith/azure-self-hosted

When running LangSmith on [Microsoft Azure](https://azure.microsoft.com/), you can set up in either [full self-hosted](/langsmith/self-hosted) or [hybrid](/langsmith/hybrid) mode. Full self-hosted mode deploys a complete LangSmith platform with observability functionality as well as the option to create agent deployments. Hybrid mode entails just the infrastructure to run agents in a data plane within your cloud, while our SaaS provides the control plane and observability functionality.

This page provides Azure-specific architecture patterns, service recommendations, and best practices for deploying and operating LangSmith on Azure.

<Note>
  LangChain provides Terraform modules specifically for Azure to help provision infrastructure for LangSmith. These modules can quickly set up AKS clusters, Azure Database for PostgreSQL, Azure Managed Redis, Blob Storage, and networking resources.

View the [Azure Terraform modules](https://github.com/langchain-ai/terraform/tree/main/modules/azure) for documentation and examples.
</Note>

## Reference architecture

We recommend using Azure's managed services to provide a scalable, secure, and resilient platform. The following architecture applies to both self-hosted and hybrid deployments:

<img src="https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=6caf1a8e0a0ee6ec54aed913d20cc928" alt="Architecture diagram showing Azure relations to LangSmith services" data-og-width="2196" width="2196" data-og-height="1498" height="1498" data-path="langsmith/images/azure-architecture-self-hosted.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?w=280&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=65df55f16fe13a701f7bcb4de13fc1b7 280w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?w=560&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=b2d6836e4814357b35403be14d35096b 560w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?w=840&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=ad452cb9098444b8b98568d61673f515 840w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?w=1100&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=eabab56a343feebacda46b99b105ff64 1100w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?w=1650&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=4af913faebd21403b188016973274f13 1650w, https://mintcdn.com/langchain-5e9cc07a/MMsbRrh5gYIlD_3t/langsmith/images/azure-architecture-self-hosted.png?w=2500&fit=max&auto=format&n=MMsbRrh5gYIlD_3t&q=85&s=ef70771bf22c73244f9ab88dd6256eea 2500w" />

* **Client interfaces**: Users interact with LangSmith via a web browser or the LangChain SDK. All traffic terminates at an [Azure Load Balancer](https://azure.microsoft.com/en-us/products/load-balancer/) and is routed to the frontend (NGINX) within the [AKS](https://azure.microsoft.com/en-us/products/kubernetes-service/) cluster before being routed to another service within the cluster if necessary.
* **Storage services**: The platform requires persistent storage for traces, metadata and caching. On Azure the recommended services are:
  * <Icon icon="database" /> **[Azure Database for PostgreSQL (Flexible Server)](https://azure.microsoft.com/en-us/products/postgresql/)** for transactional data (e.g., runs, projects). Azure's high-availability options provision a standby replica in another zone; data is synchronously committed to both primary and standby servers. LangSmith requires PostgreSQL version 14 or higher.
  * <Icon icon="database" /> **[Azure Managed Redis](https://azure.microsoft.com/en-us/products/managed-redis/)** for queues and caching. Best practices include storing small values and breaking large objects into multiple keys, using pipelining to maximize throughput and ensuring the client and server reside in the same region. You can also use [Azure Cache for Redis](https://azure.microsoft.com/en-us/products/cache), running either in single-instance or cluster mode. LangSmith requires Redis OSS version 5 or higher.
  * <Icon icon="chart-line" /> **ClickHouse** for high-volume analytics of traces. We recommend using an [externally managed ClickHouse solution](/langsmith/self-host-external-clickhouse). If, for security or compliance reasons, that is not an option, deploy a ClickHouse cluster on AKS using the open-source operator. Ensure replication across [availability zones](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview) for durability. Clickhouse is not required for a hybrid deployment.
  * <Icon icon="cube" /> **[Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/)** for large artifacts. Use redundant storage configurations such as read-access geo-redundant (RA-GRS) or geo-zone-redundant (RA-GZRS) storage and design applications to read from the secondary region during an outage.

## Compute and networking on Azure

### Azure Kubernetes Service (AKS)

[AKS](https://azure.microsoft.com/en-us/products/kubernetes-service/) is the recommended compute platform for production deployments. This section outlines the key considerations for planning your setup.

Use [Azure CNI](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni) networking for production clusters. This model integrates the cluster into an existing virtual network, assigns IP addresses to each pod and node, and allows direct connectivity to on-premises or other Azure services. Ensure the subnet has enough IPs for nodes and pods, avoid overlapping address ranges and allocate additional IP space for scale-out events.

#### Ingress and load balancing

Use Kubernetes Ingress resources and controllers to distribute HTTP/HTTPS traffic. Ingress controllers operate at layer 7 and can route traffic based on URL paths and handle TLS termination. They reduce the number of public IP addresses compared to layer-4 load balancers. Use the [application routing add-on](https://learn.microsoft.com/en-us/azure/aks/app-routing) for managed NGINX ingress controllers integrated with [Azure DNS](https://azure.microsoft.com/en-us/products/dns/) and [Key Vault](https://azure.microsoft.com/en-us/products/key-vault/) for SSL certificates.

#### Web Application Firewall (WAF)

For additional protection against attacks, deploy a [WAF](https://learn.microsoft.com/en-us/azure/web-application-firewall/overview) such as [Azure Application Gateway](https://azure.microsoft.com/en-us/products/application-gateway/). A WAF filters traffic using OWASP rules and can terminate TLS before the traffic reaches your AKS cluster.

#### Network policies

Apply [Kubernetes network policies](https://learn.microsoft.com/en-us/azure/aks/use-network-policies) to restrict pod-to-pod traffic and reduce the impact of compromised workloads. Enable network policy support when creating the cluster and design rules based on application connectivity.

#### High availability

Configure node pools across [availability zones](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview) and use Pod Disruption Budgets (PDB) and multiple replicas for all deployments. Set pod resource requests and limits; the [AKS resource management best practices](https://learn.microsoft.com/en-us/azure/aks/developer-best-practices-resource-management) recommend setting CPU and memory limits to prevent pods from consuming all resources. Use [Cluster Autoscaler](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler) and [Vertical Pod Autoscaler](https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler) to scale node pools and adjust pod resources automatically.

### Networking and identity

#### Virtual network integration

Deploy AKS into its own [virtual network](https://azure.microsoft.com/en-us/products/virtual-network/) and create separate subnets for the cluster, database, Redis, and storage endpoints. Use [Private Link](https://azure.microsoft.com/en-us/products/private-link/) and [service endpoints](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview) to keep traffic within your virtual network and avoid exposure to the public internet.

Integrate LangSmith with [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id) (Azure AD) for single sign-on. Use Azure AD OAuth2 for bearer tokens and assign roles to control access to the UI and API.

## Storage and data services

### Azure Database for PostgreSQL

#### High availability

Use [Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview) with high-availability mode. Azure provisions a standby replica either within the same availability zone (zonal) or across zones (zone-redundant). Data is synchronously committed to both the primary and standby servers, ensuring that committed data is not lost. Zone-redundant configurations place the standby in a different zone to protect against zone outages but may add write latency.

#### Backups and disaster recovery

Enable [automatic backups](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-backup-restore) and configure geo-redundant backup storage to protect against region-wide outages. For critical applications, create read replicas in a secondary region.

Choose an appropriate SKU that matches your workload; Flexible Server allows scaling compute and storage independently. Monitor metrics and configure alerts through [Azure Monitor](https://azure.microsoft.com/en-us/products/monitor/).

### Azure Managed Redis

#### Persistence and redundancy

Choose a tier that provides replication and persistence. Configure Redis persistence or data backup for durability. For high-availability, use [active geo-replication](https://learn.microsoft.com/en-us/azure/redis/how-to-active-geo-replication) or zone-redundant caches depending on the tier.

### ClickHouse on Azure

ClickHouse is used for analytical workloads (traces and feedback). If you cannot use an externally managed solution, deploy a ClickHouse cluster on AKS using Helm or the official operator. For resilience, replicate data across nodes and availability zones. Consider using [Azure Disks](https://azure.microsoft.com/en-us/products/storage/disks/) for local storage and mount them as StatefulSets.

### Azure Blob Storage

Choose a redundancy configuration based on your recovery objectives. Use [read-access geo-redundant (RA-GRS) or geo-zone-redundant (RA-GZRS) storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy) and design applications to switch reads to the secondary region during a primary region outage.

#### Naming and partitioning

Use naming conventions that improve load balancing across partitions and plan for the maximum number of concurrent clients. Stay within Azure's scalability and capacity targets and partition data across multiple storage accounts if necessary.

Access blob storage through [private endpoints](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints) or by using SAS tokens and CORS rules to enable direct client access.

## Security and access control

#### Separate vaults per application and environment

Store secrets such as database connection strings and API keys in [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault/). Use a dedicated vault for each application and environment (dev, test, prod) to limit the impact of a security breach.

Use the [RBAC permission model](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide) to assign roles at the vault scope and restrict access to required principals. Restrict network access using Private Link and firewalls.

#### Data protection and logging

Enable [soft delete and purge protection](https://learn.microsoft.com/en-us/azure/key-vault/general/soft-delete-overview) to prevent accidental deletion. Turn on logging and configure alerts for Key Vault access events.

#### Ingress isolation

Expose only the frontend service through the ingress controller or WAF. Other services should be internal and communicate through cluster networking.

#### RBAC and pod security

Use [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) to control who can deploy, modify, or read resources. Enable [pod security admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/) to enforce baseline, restricted, or privileged profiles.

#### Secrets management

Mount secrets from Key Vault into pods using [CSI Secret Store](https://learn.microsoft.com/en-us/azure/aks/csi-secrets-store-driver). Avoid storing secrets in environment variables or configuration files.

## Observability and monitoring

Configure your LangSmith instance to [export telemetry data](/langsmith/export-backend) so you can use Azure's services to monitor it.

Use [Azure Monitor](https://azure.microsoft.com/en-us/products/monitor/) for metrics, logs, and alerting. Proactive monitoring involves configuring alerts on key signals like node CPU/memory utilization, pod status, and service latency. Azure Monitor alerts notify you when predefined thresholds are exceeded.

### Managed Prometheus and Grafana

Enable [Azure Monitor managed Prometheus](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/prometheus-metrics-overview) to collect Kubernetes metrics. Combine it with [Grafana dashboards](https://azure.microsoft.com/en-us/products/managed-grafana/) for visualization. Define service-level objectives (SLOs) and configure alerts accordingly.

### Container Insights

Install [Container Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-overview) to capture logs and metrics from AKS nodes and pods. Use [Azure Log Analytics workspaces](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview) to query and analyze logs.

### Application logging

Ensure LangSmith services emit logs to stdout/stderr and forward them via [Fluent Bit](https://fluentbit.io/) or the Azure Monitor agent.

## Continuous integration

* The preferred method to manage [LangSmith deployments](/langsmith/deployments) is to create a CI process that builds [Agent Server](/langsmith/agent-server) images and pushes them to [Azure Container Registry](https://azure.microsoft.com/en-us/products/container-registry). Create a test deployment for pull requests before deploying a new revision to staging or production upon PR merge.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/azure-self-hosted.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Self-host standalone servers

**URL:** llms-txt#self-host-standalone-servers

**Contents:**
- Prerequisites
- Kubernetes
- Docker
- Docker Compose

Source: https://docs.langchain.com/langsmith/deploy-standalone-server

This guide shows you how to deploy **standalone <Tooltip tip="The server that runs your LangGraph applications.">Agent Servers</Tooltip>** without the LangSmith UI or control plane. This is the most lightweight self-hosting option for running one or a few agents as independent services.

<Warning>
  This deployment option provides flexibility but requires you to manage your own infrastructure and configuration.

For production workloads, consider [self-hosting the full LangSmith platform](/langsmith/self-hosted) or [deploying with the control plane](/langsmith/deploy-with-control-plane), which offer standardized deployment patterns and UI-based management.
</Warning>

<Note>
  **This is the setup page for deploying Agent Servers directly without the LangSmith platform.**

Review the [self-hosted options](/langsmith/self-hosted) to understand:

* [Standalone Server](/langsmith/self-hosted#standalone-server): What this guide covers (no UI, just servers).
  * [LangSmith](/langsmith/self-hosted#langsmith): For the full LangSmith platform with UI.
  * [LangSmith Deployment](/langsmith/self-hosted#langsmith-deployment): For UI-based deployment management.

Before continuing, review the [standalone server overview](/langsmith/self-hosted#standalone-server).
</Note>

1. Use the [LangGraph CLI](/langsmith/cli) to [test your application locally](/langsmith/local-server).
2. Use the [LangGraph CLI](/langsmith/cli) to build a Docker image (i.e. `langgraph build`).
3. The following environment variables are needed for a data plane deployment.
4. `REDIS_URI`: Connection details to a Redis instance. Redis will be used as a pub-sub broker to enable streaming real time output from background runs. The value of `REDIS_URI` must be a valid [Redis connection URI](https://redis-py.readthedocs.io/en/stable/connections.html#redis.Redis.from_url).

<Note>
     **Shared Redis Instance**
     Multiple self-hosted deployments can share the same Redis instance. For example, for `Deployment A`, `REDIS_URI` can be set to `redis://<hostname_1>:<port>/1` and for `Deployment B`, `REDIS_URI` can be set to `redis://<hostname_1>:<port>/2`.

`1` and `2` are different database numbers within the same instance, but `<hostname_1>` is shared. **The same database number cannot be used for separate deployments**.
   </Note>
5. `DATABASE_URI`: Postgres connection details. Postgres will be used to store assistants, threads, runs, persist thread state and long term memory, and to manage the state of the background task queue with 'exactly once' semantics. The value of `DATABASE_URI` must be a valid [Postgres connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS).

<Note>
     **Shared Postgres Instance**
     Multiple self-hosted deployments can share the same Postgres instance. For example, for `Deployment A`, `DATABASE_URI` can be set to `postgres://<user>:<password>@/<database_name_1>?host=<hostname_1>` and for `Deployment B`, `DATABASE_URI` can be set to `postgres://<user>:<password>@/<database_name_2>?host=<hostname_1>`.

`<database_name_1>` and `database_name_2` are different databases within the same instance, but `<hostname_1>` is shared. **The same database cannot be used for separate deployments**.
   </Note>
6. `LANGSMITH_API_KEY`: LangSmith API key.
7. `LANGGRAPH_CLOUD_LICENSE_KEY`: LangSmith license key. This will be used to authenticate ONCE at server start up.
8. `LANGSMITH_ENDPOINT`: To send traces to a [self-hosted LangSmith](/langsmith/self-hosted) instance, set `LANGSMITH_ENDPOINT` to the hostname of the self-hosted LangSmith instance.
9. Egress to `https://beacon.langchain.com` from your network. This is required for license verification and usage reporting if not running in air-gapped mode. See the [Egress documentation](/langsmith/self-host-egress) for more details.

Use this [Helm chart](https://github.com/langchain-ai/helm/blob/main/charts/langgraph-cloud/README.md) to deploy an Agent Server to a Kubernetes cluster.

Run the following `docker` command:

<Note>
  * You need to replace `my-image` with the name of the image you built in the prerequisite steps (from `langgraph build`)

and you should provide appropriate values for `REDIS_URI`, `DATABASE_URI`, and `LANGSMITH_API_KEY`.

* If your application requires additional environment variables, you can pass them in a similar way.
</Note>

Docker Compose YAML file:

You can run the command `docker compose up` with this Docker Compose file in the same folder.

This will launch an Agent Server on port `8123` (if you want to change this, you can change this by changing the ports in the `langgraph-api` volume). You can test if the application is healthy by running:

Assuming everything is running correctly, you should see a response like:

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/deploy-standalone-server.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
<Note>
  * You need to replace `my-image` with the name of the image you built in the prerequisite steps (from `langgraph build`)

  and you should provide appropriate values for `REDIS_URI`, `DATABASE_URI`, and `LANGSMITH_API_KEY`.

  * If your application requires additional environment variables, you can pass them in a similar way.
</Note>

## Docker Compose

Docker Compose YAML file:
```

Example 2 (unknown):
```unknown
You can run the command `docker compose up` with this Docker Compose file in the same folder.

This will launch an Agent Server on port `8123` (if you want to change this, you can change this by changing the ports in the `langgraph-api` volume). You can test if the application is healthy by running:
```

Example 3 (unknown):
```unknown
Assuming everything is running correctly, you should see a response like:
```

---

## Setup claude_agent_sdk with langsmith tracing

**URL:** llms-txt#setup-claude_agent_sdk-with-langsmith-tracing

configure_claude_agent_sdk()

@tool(
    "get_weather",
    "Gets the current weather for a given city",
    {
        "city": str,
    },
)
async def get_weather(args: dict[str, Any]) -> dict[str, Any]:
    """Simulated weather lookup tool"""
    city = args["city"]

# Simulated weather data
    weather_data = {
        "San Francisco": "Foggy, 62°F",
        "New York": "Sunny, 75°F",
        "London": "Rainy, 55°F",
        "Tokyo": "Clear, 68°F",
    }

weather = weather_data.get(city, "Weather data not available")
    return {"content": [{"type": "text", "text": f"Weather in {city}: {weather}"}]}

async def main():
    # Create SDK MCP server with the weather tool
    weather_server = create_sdk_mcp_server(
        name="weather",
        version="1.0.0",
        tools=[get_weather],
    )

options = ClaudeAgentOptions(
        model="claude-sonnet-4-5-20250929",
        system_prompt="You are a friendly travel assistant who helps with weather information.",
        mcp_servers={"weather": weather_server},
        allowed_tools=["mcp__weather__get_weather"],
    )

async with ClaudeSDKClient(options=options) as client:
        await client.query("What's the weather like in San Francisco and Tokyo?")

async for message in client.receive_response():
            print(message)

if __name__ == "__main__":
    asyncio.run(main())
```

Once configured, all Claude Agent SDK operations will be automatically traced to LangSmith, including:

* Agent queries and responses
* Tool invocations and results
* Claude model interactions
* MCP server operations

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/trace-claude-agent-sdk.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Set the entrypoint as 'agent'

**URL:** llms-txt#set-the-entrypoint-as-'agent'

---

## Set up Agent Auth (Beta)

**URL:** llms-txt#set-up-agent-auth-(beta)

**Contents:**
- Installation
- Quickstart
  - 1. Initialize the client
  - 2. Set up OAuth providers
  - 3. Authenticate from an agent

Source: https://docs.langchain.com/langsmith/agent-auth

Enable secure access from agents to any system using OAuth 2.0 credentials with Agent Auth.

<Note>Agent Auth is in **Beta** and under active development. To provide feedback or use this feature, reach out to the [LangChain team](https://forum.langchain.com/c/help/langsmith/).</Note>

Install the Agent Auth client library from PyPI:

### 1. Initialize the client

### 2. Set up OAuth providers

Before agents can authenticate, you need to configure an OAuth provider using the following process:

1. Select a unique identifier for your OAuth provider to use in LangChain's platform (e.g., "github-local-dev", "google-workspace-prod").

2. Go to your OAuth provider's developer console and create a new OAuth application.

3. Set the callback URL in your OAuth provider using this structure:
   
   For example, if your provider\_id is "github-local-dev", use:

4. Use `client.create_oauth_provider()` with the credentials from your OAuth app:

### 3. Authenticate from an agent

The client `authenticate()` API is used to get OAuth tokens from pre-configured providers. On the first call, it takes the caller through an OAuth 2.0 auth flow.

#### In LangGraph context

By default, tokens are scoped to the calling agent using the Assistant ID parameter.

```python  theme={null}
auth_result = await client.authenticate(
    provider="{provider_id}",
    scopes=["scopeA"],
    user_id="your_user_id" # Any unique identifier to scope this token to the human caller
)

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

## Quickstart

### 1. Initialize the client
```

Example 3 (unknown):
```unknown
### 2. Set up OAuth providers

Before agents can authenticate, you need to configure an OAuth provider using the following process:

1. Select a unique identifier for your OAuth provider to use in LangChain's platform (e.g., "github-local-dev", "google-workspace-prod").

2. Go to your OAuth provider's developer console and create a new OAuth application.

3. Set the callback URL in your OAuth provider using this structure:
```

Example 4 (unknown):
```unknown
For example, if your provider\_id is "github-local-dev", use:
```

---

## Short-term memory

**URL:** llms-txt#short-term-memory

**Contents:**
- Overview
- Usage
  - In production
- Customizing agent memory

Source: https://docs.langchain.com/oss/python/langchain/short-term-memory

Memory is a system that remembers information about previous interactions. For AI agents, memory is crucial because it lets them remember previous interactions, learn from feedback, and adapt to user preferences. As agents tackle more complex tasks with numerous user interactions, this capability becomes essential for both efficiency and user satisfaction.

Short term memory lets your application remember previous interactions within a single thread or conversation.

<Note>
  A thread organizes multiple interactions in a session, similar to the way email groups messages in a single conversation.
</Note>

Conversation history is the most common form of short-term memory. Long conversations pose a challenge to today's LLMs; a full history may not fit inside an LLM's context window, resulting in an context loss or errors.

Even if your model supports the full context length, most LLMs still perform poorly over long contexts. They get "distracted" by stale or off-topic content, all while suffering from slower response times and higher costs.

Chat models accept context using [messages](/oss/python/langchain/messages), which include instructions (a system message) and inputs (human messages). In chat applications, messages alternate between human inputs and model responses, resulting in a list of messages that grows longer over time. Because context windows are limited, many applications can benefit from using techniques to remove or "forget" stale information.

To add short-term memory (thread-level persistence) to an agent, you need to specify a `checkpointer` when creating an agent.

<Info>
  LangChain's agent manages short-term memory as a part of your agent's state.

By storing these in the graph's state, the agent can access the full context for a given conversation while maintaining separation between different threads.

State is persisted to a database (or memory) using a checkpointer so the thread can be resumed at any time.

Short-term memory updates when the agent is invoked or a step (like a tool call) is completed, and the state is read at the start of each step.
</Info>

In production, use a checkpointer backed by a database:

## Customizing agent memory

By default, agents use [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) to manage short term memory, specifically the conversation history via a `messages` key.

You can extend [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) to add additional fields. Custom state schemas are passed to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) using the [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) parameter.

```python  theme={null}
from langchain.agents import create_agent, AgentState
from langgraph.checkpoint.memory import InMemorySaver

class CustomAgentState(AgentState):  # [!code highlight]
    user_id: str  # [!code highlight]
    preferences: dict  # [!code highlight]

agent = create_agent(
    "gpt-5",
    tools=[get_user_info],
    state_schema=CustomAgentState,  # [!code highlight]
    checkpointer=InMemorySaver(),
)

**Examples:**

Example 1 (unknown):
```unknown
### In production

In production, use a checkpointer backed by a database:
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
## Customizing agent memory

By default, agents use [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) to manage short term memory, specifically the conversation history via a `messages` key.

You can extend [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) to add additional fields. Custom state schemas are passed to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) using the [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) parameter.
```

---

## Since all of our subagents have compatible state,

**URL:** llms-txt#since-all-of-our-subagents-have-compatible-state,

---

## Skills

**URL:** llms-txt#skills

**Contents:**
- Key characteristics
- When to use
- Basic implementation
- Extending the pattern

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/skills

In the **skills** architecture, specialized capabilities are packaged as invokable "skills" that augment an [agent's](/oss/python/langchain/agents) behavior. Skills are primarily prompt-driven specializations that an agent can invoke on-demand.

<Tip>
  This pattern is conceptually identical to [llms.txt](https://llmstxt.org/) (introduced by Jeremy Howard), which uses tool calling for progressive disclosure of documentation. The skills pattern applies the same approach to specialized prompts and domain knowledge rather than just documentation pages.
</Tip>

## Key characteristics

* Prompt-driven specialization: Skills are primarily defined by specialized prompts
* Progressive disclosure: Skills become available based on context or user needs
* Team distribution: Different teams can develop and maintain skills independently
* Lightweight composition: Skills are simpler than full sub-agents

Use the skills pattern when you want a single [agent](/oss/python/langchain/agents) with many possible specializations, you don't need to enforce specific constraints between skills, or different teams need to develop capabilities independently. Common examples include coding assistants (skills for different languages or tasks), knowledge bases (skills for different domains), and creative assistants (skills for different formats).

## Basic implementation

For a complete implementation, see the tutorial below.

<Card title="Tutorial: Build a SQL assistant with on-demand skills" icon="wand-magic-sparkles" href="/oss/python/langchain/multi-agent/skills-sql-assistant" arrow cta="Learn more">
  Learn how to implement skills with progressive disclosure, where the agent loads specialized prompts and schemas on-demand rather than upfront.
</Card>

## Extending the pattern

When writing custom implementations, you can extend the basic skills pattern in several ways:

* **Dynamic tool registration**: Combine progressive disclosure with state management to register new [tools](/oss/python/langchain/tools) as skills load. For example, loading a "database\_admin" skill could both add specialized context and register database-specific tools (backup, restore, migrate). This uses the same tool-and-state mechanisms used across multi-agent patterns—tools updating state to dynamically change agent capabilities.

* **Hierarchical skills**: Skills can define other skills in a tree structure, creating nested specializations. For instance, loading a "data\_science" skill might make available sub-skills like "pandas\_expert", "visualization", and "statistical\_analysis". Each sub-skill can be loaded independently as needed, allowing for fine-grained progressive disclosure of domain knowledge. This hierarchical approach helps manage large knowledge bases by organizing capabilities into logical groupings that can be discovered and loaded on-demand.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent/skills.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Key characteristics

* Prompt-driven specialization: Skills are primarily defined by specialized prompts
* Progressive disclosure: Skills become available based on context or user needs
* Team distribution: Different teams can develop and maintain skills independently
* Lightweight composition: Skills are simpler than full sub-agents

## When to use

Use the skills pattern when you want a single [agent](/oss/python/langchain/agents) with many possible specializations, you don't need to enforce specific constraints between skills, or different teams need to develop capabilities independently. Common examples include coding assistants (skills for different languages or tasks), knowledge bases (skills for different domains), and creative assistants (skills for different formats).

## Basic implementation
```

---

## ./src/agent/webapp.py

**URL:** llms-txt#./src/agent/webapp.py

**Contents:**
- Configure `langgraph.json`
- Start server
- Deploying
- Next steps

from fastapi import FastAPI

@app.get("/hello")
def read_root():
    return {"Hello": "World"}

json  theme={null}
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent/graph.py:graph"
  },
  "env": ".env",
  "http": {
    "app": "./src/agent/webapp.py:app"
  }
  // Other configuration options like auth, store, etc.
}
bash  theme={null}
langgraph dev --no-browser
```

If you navigate to `localhost:2024/hello` in your browser (`2024` is the default development port), you should see the `/hello` endpoint returning `{"Hello": "World"}`.

<Note>
  **Shadowing default endpoints**
  The routes you create in the app are given priority over the system defaults, meaning you can shadow and redefine the behavior of any default endpoint.
</Note>

You can deploy this app as-is to LangSmith or to your self-hosted platform.

Now that you've added a custom route to your deployment, you can use this same technique to further customize how your server behaves, such as defining custom [custom middleware](/langsmith/custom-middleware) and [custom lifespan events](/langsmith/custom-lifespan).

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/custom-routes.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Configure `langgraph.json`

Add the following to your `langgraph.json` configuration file. Make sure the path points to the FastAPI application instance `app` in the `webapp.py` file you created above.
```

Example 2 (unknown):
```unknown
## Start server

Test the server out locally:
```

---

## state we defined for the refund agent can also be passed to our lookup agent.

**URL:** llms-txt#state-we-defined-for-the-refund-agent-can-also-be-passed-to-our-lookup-agent.

qa_graph = create_agent(qa_llm, tools=[lookup_track, lookup_artist, lookup_album])

display(Image(qa_graph.get_graph(xray=True).draw_mermaid_png()))
python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
<img src="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=fa838edc78b2b29e8c29807d8c3dd7fd" alt="QA Graph" data-og-width="214" width="214" data-og-height="249" height="249" data-path="langsmith/images/qa-graph.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?w=280&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=920e82f376d6bbbcfe02c07ac7a45b80 280w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?w=560&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=938d3bd8c19abfe27ea5efd1c996494c 560w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?w=840&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=e46ece85318d4c376cd6bb632bf41ab4 840w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?w=1100&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=3e3c715ef37db24fd0cbf8eb4ca19190 1100w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?w=1650&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=e3270477acbc50eb9e4e9736a5ec6afc 1650w, https://mintcdn.com/langchain-5e9cc07a/Fr2lazPB4XVeEA7l/langsmith/images/qa-graph.png?w=2500&fit=max&auto=format&n=Fr2lazPB4XVeEA7l&q=85&s=667b26bb91f33aaacbeb0a2ea749825a 2500w" />

#### Parent agent

Now let's define a parent agent that combines our two task-specific agents. The only job of the parent agent is to route to one of the sub-agents by classifying the user's current intent, and to compile the output into a followup message.
```

---

## Stream agent progress and LLM tokens until interrupt

**URL:** llms-txt#stream-agent-progress-and-llm-tokens-until-interrupt

for mode, chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Delete old records from the database"}]},
    config=config,
    stream_mode=["updates", "messages"],  # [!code highlight]
):
    if mode == "messages":
        # LLM token
        token, metadata = chunk
        if token.content:
            print(token.content, end="", flush=True)
    elif mode == "updates":
        # Check for interrupt
        if "__interrupt__" in chunk:
            print(f"\n\nInterrupt: {chunk['__interrupt__']}")

---

## Structured output

**URL:** llms-txt#structured-output

**Contents:**
- Response Format
- Provider strategy
- Tool calling strategy
  - Custom tool message content
  - Error handling

Source: https://docs.langchain.com/oss/python/langchain/structured-output

Structured output allows agents to return data in a specific, predictable format. Instead of parsing natural language responses, you get structured data in the form of JSON objects, Pydantic models, or dataclasses that your application can directly use.

LangChain's [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) handles structured output automatically. The user sets their desired structured output schema, and when the model generates the structured data, it's captured, validated, and returned in the `'structured_response'` key of the agent's state.

Controls how the agent returns structured data:

* **`ToolStrategy[StructuredResponseT]`**: Uses tool calling for structured output
* **`ProviderStrategy[StructuredResponseT]`**: Uses provider-native structured output
* **`type[StructuredResponseT]`**: Schema type - automatically selects best strategy based on model capabilities
* **`None`**: No structured output

When a schema type is provided directly, LangChain automatically chooses:

* `ProviderStrategy` for models supporting native structured output (e.g. [OpenAI](/oss/python/integrations/providers/openai), [Anthropic](/oss/python/integrations/providers/anthropic), or [Grok](/oss/python/integrations/providers/xai)).
* `ToolStrategy` for all other models.

<Tip>
  Support for native structured output features is read dynamically from the model's [profile data](/oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:

If tools are specified, the model must support simultaneous use of tools and structured output.
</Tip>

The structured response is returned in the `structured_response` key of the agent's final state.

Some model providers support structured output natively through their APIs (e.g. OpenAI, Grok, Gemini). This is the most reliable method when available.

To use this strategy, configure a `ProviderStrategy`:

<Info>
  The `strict` param requires `langchain>=1.2`.
</Info>

<ParamField path="schema" required>
  The schema defining the structured output format. Supports:

* **Pydantic models**: `BaseModel` subclasses with field validation
  * **Dataclasses**: Python dataclasses with type annotations
  * **TypedDict**: Typed dictionary classes
  * **JSON Schema**: Dictionary with JSON schema specification
</ParamField>

<ParamField path="strict">
  Optional boolean parameter to enable strict schema adherence. Supported by some providers (e.g., [OpenAI](/oss/python/integrations/chat/openai) and [xAI](/oss/python/integrations/chat/xai)). Defaults to `None` (disabled).
</ParamField>

LangChain automatically uses `ProviderStrategy` when you pass a schema type directly to [`create_agent.response_format`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(response_format\)) and the model supports native structured output:

Provider-native structured output provides high reliability and strict validation because the model provider enforces the schema. Use it when available.

<Note>
  If the provider natively supports structured output for your model choice, it is functionally equivalent to write `response_format=ProductReview` instead of `response_format=ProviderStrategy(ProductReview)`. In either case, if structured output is not supported, the agent will fall back to a tool calling strategy.
</Note>

## Tool calling strategy

For models that don't support native structured output, LangChain uses tool calling to achieve the same result. This works with all models that support tool calling, which is most modern models.

To use this strategy, configure a `ToolStrategy`:

<ParamField path="schema" required>
  The schema defining the structured output format. Supports:

* **Pydantic models**: `BaseModel` subclasses with field validation
  * **Dataclasses**: Python dataclasses with type annotations
  * **TypedDict**: Typed dictionary classes
  * **JSON Schema**: Dictionary with JSON schema specification
  * **Union types**: Multiple schema options. The model will choose the most appropriate schema based on the context.
</ParamField>

<ParamField path="tool_message_content">
  Custom content for the tool message returned when structured output is generated.
  If not provided, defaults to a message showing the structured response data.
</ParamField>

<ParamField path="handle_errors">
  Error handling strategy for structured output validation failures. Defaults to `True`.

* **`True`**: Catch all errors with default error template
  * **`str`**: Catch all errors with this custom message
  * **`type[Exception]`**: Only catch this exception type with default message
  * **`tuple[type[Exception], ...]`**: Only catch these exception types with default message
  * **`Callable[[Exception], str]`**: Custom function that returns error message
  * **`False`**: No retry, let exceptions propagate
</ParamField>

### Custom tool message content

The `tool_message_content` parameter allows you to customize the message that appears in the conversation history when structured output is generated:

Without `tool_message_content`, our final [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) would be:

Models can make mistakes when generating structured output via tool calling. LangChain provides intelligent retry mechanisms to handle these errors automatically.

#### Multiple structured outputs error

When a model incorrectly calls multiple structured output tools, the agent provides error feedback in a [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) and prompts the model to retry:

#### Schema validation error

When structured output doesn't match the expected schema, the agent provides specific error feedback:

#### Error handling strategies

You can customize how errors are handled using the `handle_errors` parameter:

**Custom error message:**

If `handle_errors` is a string, the agent will *always* prompt the model to re-try with a fixed tool message:

**Handle specific exceptions only:**

If `handle_errors` is an exception type, the agent will only retry (using the default error message) if the exception raised is the specified type. In all other cases, the exception will be raised.

**Handle multiple exception types:**

If `handle_errors` is a tuple of exceptions, the agent will only retry (using the default error message) if the exception raised is one of the specified types. In all other cases, the exception will be raised.

**Custom error handler function:**

On `StructuredOutputValidationError`:

On `MultipleStructuredOutputsError`:

**No error handling:**

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/structured-output.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Response Format

Controls how the agent returns structured data:

* **`ToolStrategy[StructuredResponseT]`**: Uses tool calling for structured output
* **`ProviderStrategy[StructuredResponseT]`**: Uses provider-native structured output
* **`type[StructuredResponseT]`**: Schema type - automatically selects best strategy based on model capabilities
* **`None`**: No structured output

When a schema type is provided directly, LangChain automatically chooses:

* `ProviderStrategy` for models supporting native structured output (e.g. [OpenAI](/oss/python/integrations/providers/openai), [Anthropic](/oss/python/integrations/providers/anthropic), or [Grok](/oss/python/integrations/providers/xai)).
* `ToolStrategy` for all other models.

<Tip>
  Support for native structured output features is read dynamically from the model's [profile data](/oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:
```

Example 2 (unknown):
```unknown
If tools are specified, the model must support simultaneous use of tools and structured output.
</Tip>

The structured response is returned in the `structured_response` key of the agent's final state.

## Provider strategy

Some model providers support structured output natively through their APIs (e.g. OpenAI, Grok, Gemini). This is the most reliable method when available.

To use this strategy, configure a `ProviderStrategy`:
```

Example 3 (unknown):
```unknown
<Info>
  The `strict` param requires `langchain>=1.2`.
</Info>

<ParamField path="schema" required>
  The schema defining the structured output format. Supports:

  * **Pydantic models**: `BaseModel` subclasses with field validation
  * **Dataclasses**: Python dataclasses with type annotations
  * **TypedDict**: Typed dictionary classes
  * **JSON Schema**: Dictionary with JSON schema specification
</ParamField>

<ParamField path="strict">
  Optional boolean parameter to enable strict schema adherence. Supported by some providers (e.g., [OpenAI](/oss/python/integrations/chat/openai) and [xAI](/oss/python/integrations/chat/xai)). Defaults to `None` (disabled).
</ParamField>

LangChain automatically uses `ProviderStrategy` when you pass a schema type directly to [`create_agent.response_format`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(response_format\)) and the model supports native structured output:

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Subagents

**URL:** llms-txt#subagents

**Contents:**
- Key characteristics
- When to use
- Basic implementation

Source: https://docs.langchain.com/oss/python/langchain/multi-agent/subagents

In the **subagents** architecture, a central main [agent](/oss/python/langchain/agents) (often referred to as a **supervisor**) coordinates subagents by calling them as [tools](/oss/python/langchain/tools). The main agent decides which subagent to invoke, what input to provide, and how to combine results. Subagents are stateless—they don't remember past interactions, with all conversation memory maintained by the main agent. This provides [context](/oss/python/langchain/context-engineering) isolation: each subagent invocation works in a clean context window, preventing context bloat in the main conversation.

## Key characteristics

* Centralized control: All routing passes through the main agent
* No direct user interaction: Subagents return results to the main agent, not the user (though you can use [interrupts](/oss/python/langgraph/human-in-the-loop#interrupt) within a subagent to allow user interaction)
* Subagents via tools: Subagents are invoked via tools
* Parallel execution: The main agent can invoke multiple subagents in a single turn

<Note>
  **Supervisor vs. Router**: A supervisor agent (this pattern) is different from a [router](/oss/python/langchain/multi-agent/router). The supervisor is a full agent that maintains conversation context and dynamically decides which subagents to call across multiple turns. A router is typically a single classification step that dispatches to agents without maintaining ongoing conversation state.
</Note>

Use the subagents pattern when you have multiple distinct domains (e.g., calendar, email, CRM, database), subagents don't need to converse directly with users, or you want centralized workflow control. For simpler cases with just a few [tools](/oss/python/langchain/tools), use a [single agent](/oss/python/langchain/agents).

<Tip>
  **Need user interaction within a subagent?** While subagents typically return results to the main agent rather than conversing directly with users, you can use [interrupts](/oss/python/langgraph/human-in-the-loop#interrupt) within a subagent to pause execution and gather user input. This is useful when a subagent needs clarification or approval before proceeding. The main agent remains the orchestrator, but the subagent can collect information from the user mid-task.
</Tip>

## Basic implementation

The core mechanism wraps a subagent as a tool that the main agent can call:

```python  theme={null}
from langchain.tools import tool
from langchain.agents import create_agent

**Examples:**

Example 1 (unknown):
```unknown
## Key characteristics

* Centralized control: All routing passes through the main agent
* No direct user interaction: Subagents return results to the main agent, not the user (though you can use [interrupts](/oss/python/langgraph/human-in-the-loop#interrupt) within a subagent to allow user interaction)
* Subagents via tools: Subagents are invoked via tools
* Parallel execution: The main agent can invoke multiple subagents in a single turn

<Note>
  **Supervisor vs. Router**: A supervisor agent (this pattern) is different from a [router](/oss/python/langchain/multi-agent/router). The supervisor is a full agent that maintains conversation context and dynamically decides which subagents to call across multiple turns. A router is typically a single classification step that dispatches to agents without maintaining ongoing conversation state.
</Note>

## When to use

Use the subagents pattern when you have multiple distinct domains (e.g., calendar, email, CRM, database), subagents don't need to converse directly with users, or you want centralized workflow control. For simpler cases with just a few [tools](/oss/python/langchain/tools), use a [single agent](/oss/python/langchain/agents).

<Tip>
  **Need user interaction within a subagent?** While subagents typically return results to the main agent rather than conversing directly with users, you can use [interrupts](/oss/python/langgraph/human-in-the-loop#interrupt) within a subagent to pause execution and gather user input. This is useful when a subagent needs clarification or approval before proceeding. The main agent remains the orchestrator, but the subagent can collect information from the user mid-task.
</Tip>

## Basic implementation

The core mechanism wraps a subagent as a tool that the main agent can call:
```

---

## System prompt to steer the agent to be an expert researcher

**URL:** llms-txt#system-prompt-to-steer-the-agent-to-be-an-expert-researcher

**Contents:**
- `internet_search`
  - Step 5: Run the agent

research_instructions = """You are an expert researcher. Your job is to conduct thorough research and then write a polished report.

You have access to an internet search tool as your primary means of gathering information.

Use this to run an internet search for a given query. You can specify the max number of results to return, the topic, and whether raw content should be included.
"""

agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=research_instructions
)
python  theme={null}
result = agent.invoke({"messages": [{"role": "user", "content": "What is langgraph?"}]})

**Examples:**

Example 1 (unknown):
```unknown
### Step 5: Run the agent
```

---

## Templates

**URL:** llms-txt#templates

**Contents:**
- How to use templates

Source: https://docs.langchain.com/langsmith/agent-builder-templates

Start faster with curated Agent Builder templates and customize tools, prompts, and triggers.

Agent Builder includes starter templates to help you create agents quickly. Templates include predefined system prompts, tools, and triggers (if applicable) for common use cases. You can use templates as-is, or as a baseline to customize.

## How to use templates

<Steps>
  <Step title="Pick a template" icon="squares-plus">
    In Agent Builder, choose a template that matches your use case (e.g., Gmail assistant, Linear Slack bot, etc.).
  </Step>

<Step title="Review tools and prompts" icon="sliders">
    Each template comes with an initial system prompt and a set of tools. Review the tools and prompt to ensure they align with your needs (you can always edit them later, or have the agent edit it for you).
  </Step>

<Step title="Clone and authenticate" icon="key">
    Click `Clone Template` in the top right to start the cloning process. If you haven't already authenticated with OAuth for the tools in the template, you'll be prompted to do so.
  </Step>

<Step title="Add triggers (optional)" icon="clock">
    If a template includes a trigger, you'll be prompted to:

* Authenticate and setup the trigger if you haven't done this before
      or
    * Select an existing trigger from the dropdown list
  </Step>

<Step title="Test and iterate" icon="rocket">
    Run the agent, review outputs, and refine prompts or tools. To edit your cloned agent, either make the changes manually, or ask the agent to make the changes for you!
  </Step>
</Steps>

<Note icon="sliders" color="#E9D5FF" iconType="regular">
  Templates are starting points. You can customize prompts, add or remove tools, attach triggers, and switch models at any time.
</Note>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-templates.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Test a ReAct agent with Pytest/Vitest and LangSmith

**URL:** llms-txt#test-a-react-agent-with-pytest/vitest-and-langsmith

**Contents:**
- Setup
  - Installation
  - Environment variables
- Create your app
  - Define tools
  - Define agent
- Write tests
  - Test 1: Handle off-topic questions
  - Test 2: Simple tool calling
  - Test 3: Complex tool calling

Source: https://docs.langchain.com/langsmith/test-react-agent-pytest

This tutorial will show you how to use LangSmith's integrations with popular testing tools (Pytest, Vitest, and Jest) to evaluate your LLM application. We will create a ReAct agent that answers questions about publicly traded stocks and write a comprehensive test suite for it.

This tutorial uses [LangGraph](https://langchain-ai.github.io/langgraph/tutorials/introduction/) for agent orchestration, [OpenAI's GPT-4o](https://platform.openai.com/docs/models#gpt-4o), [Tavily](https://tavily.com/) for search, [E2B's](https://e2b.dev/) code interpreter, and [Polygon](https://polygon.io/stocks) to retrieve stock data but it can be adapted for other frameworks, models and tools with minor modifications. Tavily, E2B and Polygon are free to sign up for.

First, install the packages required for making the agent:

Next, install the testing framework:

### Environment variables

Set the following environment variables:

To define our React agent, we will use LangGraph/LangGraph.js for the orchestation and LangChain for the LLM and tools.

First we are going to define the tools we are going to use in our agent. There are going to be 3 tools:

* A search tool using Tavily
* A code interpreter tool using E2B
* A stock information tool using Polygon

Now that we have defined all of our tools, we can use [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) to create our agent.

Now that we have defined our agent, let's write a few tests to ensure basic functionality. In this tutorial we are going to test whether the agent's tool calling abilities are working, whether the agent knows to ignore irrelevant questions, and whether it is able to answer complex questions that involve using all of the tools.

We need to first set up a test file and add the imports needed at the top of the file.

### Test 1: Handle off-topic questions

The first test will be a simple check that the agent does not use tools on irrelevant queries.

### Test 2: Simple tool calling

For tool calling, we are going to verify that the agent calls the correct tool with the correct parameters.

### Test 3: Complex tool calling

Some tool calls are easier to test than others. With the ticker lookup, we can assert that the correct ticker is searched. With the coding tool, the inputs and outputs of the tool are much less constrained, and there are lots of ways to get to the right answer. In this case, it's simpler to test that the tool is used correctly by running the full agent and asserting that it both calls the coding tool and that it ends up with the right answer.

### Test 4: LLM-as-a-judge

We are going to ensure that the agent's answer is grounded in the search results by running an LLM-as-a-judge evaluation. In order to trace the LLM as a judge call separately from our agent, we will use the LangSmith provided `trace_feedback` context manager in Python and `wrapEvaluator` function in JS/TS.

Once you have setup your config files (if you are using Vitest or Jest), you can run your tests using the following commands:

<Accordion title="Config files for Vitest/Jest">
  <CodeGroup>

</CodeGroup>
</Accordion>

Remember to also add the config files for [Vitest](#config-files-for-vitestjest) and [Jest](#config-files-for-vitestjest) to your project.

<Accordion title="Agent code">
  <CodeGroup>

</CodeGroup>
</Accordion>

<Accordion title="Test code">
  <CodeGroup>

</CodeGroup>
</Accordion>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/test-react-agent-pytest.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

Next, install the testing framework:

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown

```

---

## The agent can now track additional state beyond messages

**URL:** llms-txt#the-agent-can-now-track-additional-state-beyond-messages

**Contents:**
  - Streaming
  - Middleware

result = agent.invoke({
    "messages": [{"role": "user", "content": "I prefer technical explanations"}],
    "user_preferences": {"style": "technical", "verbosity": "detailed"},
})
python  theme={null}
for chunk in agent.stream({
    "messages": [{"role": "user", "content": "Search for AI news and summarize the findings"}]
}, stream_mode="values"):
    # Each chunk contains the full state at that point
    latest_message = chunk["messages"][-1]
    if latest_message.content:
        print(f"Agent: {latest_message.content}")
    elif latest_message.tool_calls:
        print(f"Calling tools: {[tc['name'] for tc in latest_message.tool_calls]}")
```

<Tip>
  For more details on streaming, see [Streaming](/oss/python/langchain/streaming).
</Tip>

[Middleware](/oss/python/langchain/middleware) provides powerful extensibility for customizing agent behavior at different stages of execution. You can use middleware to:

* Process state before the model is called (e.g., message trimming, context injection)
* Modify or validate the model's response (e.g., guardrails, content filtering)
* Handle tool execution errors with custom logic
* Implement dynamic model selection based on state or context
* Add custom logging, monitoring, or analytics

Middleware integrates seamlessly into the agent's execution, allowing you to intercept and modify data flow at key points without changing the core agent logic.

<Tip>
  For comprehensive middleware documentation including decorators like [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model), [`@after_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.after_model), and [`@wrap_tool_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_tool_call), see [Middleware](/oss/python/langchain/middleware).
</Tip>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/agents.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
<Note>
  As of `langchain 1.0`, custom state schemas **must** be `TypedDict` types. Pydantic models and dataclasses are no longer supported. See the [v1 migration guide](/oss/python/migrate/langchain-v1#state-type-restrictions) for more details.
</Note>

<Note>
  Defining custom state via middleware is preferred over defining it via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) because it allows you to keep state extensions conceptually scoped to the relevant middleware and tools.

  [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) is still supported for backwards compatibility on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent).
</Note>

<Tip>
  To learn more about memory, see [Memory](/oss/python/concepts/memory). For information on implementing long-term memory that persists across sessions, see [Long-term memory](/oss/python/langchain/long-term-memory).
</Tip>

### Streaming

We've seen how the agent can be called with `invoke` to get a final response. If the agent executes multiple steps, this may take a while. To show intermediate progress, we can stream back messages as they occur.
```

---

## The instrucitons are passed as a system message to the agent

**URL:** llms-txt#the-instrucitons-are-passed-as-a-system-message-to-the-agent

instructions = """You are a tweet writing assistant. Given a topic, do some research and write a relevant and engaging tweet about it.
- Use at least 3 emojis in each tweet
- The tweet should be no longer than 280 characters
- Always use the search tool to gather recent information on the tweet topic
- Write the tweet only based on the search content. Do not rely on your internal knowledge
- When relevant, link to your sources
- Make your tweet as engaging as possible"""

---

## The prebuilt ReACT agent only expects State to have a 'messages' key, so the

**URL:** llms-txt#the-prebuilt-react-agent-only-expects-state-to-have-a-'messages'-key,-so-the

---

## The system prompt will be set dynamically based on context

**URL:** llms-txt#the-system-prompt-will-be-set-dynamically-based-on-context

**Contents:**
- Invocation
- Advanced concepts
  - Structured output

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Explain machine learning"}]},
    context={"user_role": "expert"}
)
python  theme={null}
result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)
python wrap theme={null}
from pydantic import BaseModel
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str

agent = create_agent(
    model="gpt-4o-mini",
    tools=[search_tool],
    response_format=ToolStrategy(ContactInfo)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"}]
})

result["structured_response"]

**Examples:**

Example 1 (unknown):
```unknown
<Tip>
  For more details on message types and formatting, see [Messages](/oss/python/langchain/messages). For comprehensive middleware documentation, see [Middleware](/oss/python/langchain/middleware).
</Tip>

## Invocation

You can invoke an agent by passing an update to its [`State`](/oss/python/langgraph/graph-api#state). All agents include a [sequence of messages](/oss/python/langgraph/use-graph-api#messagesstate) in their state; to invoke the agent, pass a new message:
```

Example 2 (unknown):
```unknown
For streaming steps and / or tokens from the agent, refer to the [streaming](/oss/python/langchain/streaming) guide.

Otherwise, the agent follows the LangGraph [Graph API](/oss/python/langgraph/use-graph-api) and supports all associated methods, such as `stream` and `invoke`.

## Advanced concepts

### Structured output

In some situations, you may want the agent to return an output in a specific format. LangChain provides strategies for structured output via the `response_format` parameter.

#### ToolStrategy

`ToolStrategy` uses artificial tool calling to generate structured output. This works with any model that supports tool calling:
```

---

## Thinking in LangGraph

**URL:** llms-txt#thinking-in-langgraph

**Contents:**
- Start with the process you want to automate
- Step 1: Map out your workflow as discrete steps
- Step 2: Identify what each step needs to do
  - LLM steps
  - Data steps
  - Action steps
  - User input steps
- Step 3: Design your state
  - What belongs in state?
  - Keep state raw, format prompts on-demand

Source: https://docs.langchain.com/oss/python/langgraph/thinking-in-langgraph

Learn how to think about building agents with LangGraph

When you build an agent with LangGraph, you will first break it apart into discrete steps called **nodes**. Then, you will describe the different decisions and transitions from each of your nodes. Finally, you connect nodes together through a shared **state** that each node can read from and write to.

In this walkthrough, we'll guide you through the thought process of building a customer support email agent with LangGraph.

## Start with the process you want to automate

Imagine that you need to build an AI agent that handles customer support emails. Your product team has given you these requirements:

To implement an agent in LangGraph, you will usually follow the same five steps.

## Step 1: Map out your workflow as discrete steps

Start by identifying the distinct steps in your process. Each step will become a **node** (a function that does one specific thing). Then, sketch how these steps connect to each other.

The arrows in this diagram show possible paths, but the actual decision of which path to take happens inside each node.

Now that we've identified the components in our workflow, let's understand what each node needs to do:

* `Read Email`: Extract and parse the email content
* `Classify Intent`: Use an LLM to categorize urgency and topic, then route to appropriate action
* `Doc Search`: Query your knowledge base for relevant information
* `Bug Track`: Create or update issue in tracking system
* `Draft Reply`: Generate an appropriate response
* `Human Review`: Escalate to human agent for approval or handling
* `Send Reply`: Dispatch the email response

<Tip>
  Notice that some nodes make decisions about where to go next (`Classify Intent`, `Draft Reply`, `Human Review`), while others always proceed to the same next step (`Read Email` always goes to `Classify Intent`, `Doc Search` always goes to `Draft Reply`).
</Tip>

## Step 2: Identify what each step needs to do

For each node in your graph, determine what type of operation it represents and what context it needs to work properly.

<CardGroup cols={2}>
  <Card title="LLM steps" icon="brain" href="#llm-steps">
    Use when you need to understand, analyze, generate text, or make reasoning decisions
  </Card>

<Card title="Data steps" icon="database" href="#data-steps">
    Use when you need to retrieve information from external sources
  </Card>

<Card title="Action steps" icon="bolt" href="#action-steps">
    Use when you need to perform external actions
  </Card>

<Card title="User input steps" icon="user" href="#user-input-steps">
    Use when you need human intervention
  </Card>
</CardGroup>

When a step needs to understand, analyze, generate text, or make reasoning decisions:

<AccordionGroup>
  <Accordion title="Classify intent">
    * Static context (prompt): Classification categories, urgency definitions, response format
    * Dynamic context (from state): Email content, sender information
    * Desired outcome: Structured classification that determines routing
  </Accordion>

<Accordion title="Draft reply">
    * Static context (prompt): Tone guidelines, company policies, response templates
    * Dynamic context (from state): Classification results, search results, customer history
    * Desired outcome: Professional email response ready for review
  </Accordion>
</AccordionGroup>

When a step needs to retrieve information from external sources:

<AccordionGroup>
  <Accordion title="Document search">
    * Parameters: Query built from intent and topic
    * Retry strategy: Yes, with exponential backoff for transient failures
    * Caching: Could cache common queries to reduce API calls
  </Accordion>

<Accordion title="Customer history lookup">
    * Parameters: Customer email or ID from state
    * Retry strategy: Yes, but with fallback to basic info if unavailable
    * Caching: Yes, with time-to-live to balance freshness and performance
  </Accordion>
</AccordionGroup>

When a step needs to perform an external action:

<AccordionGroup>
  <Accordion title="Send reply">
    * When to execute node: After approval (human or automated)
    * Retry strategy: Yes, with exponential backoff for network issues
    * Should not cache: Each send is a unique action
  </Accordion>

<Accordion title="Bug track">
    * When to execute node: Always when intent is "bug"
    * Retry strategy: Yes, critical to not lose bug reports
    * Returns: Ticket ID to include in response
  </Accordion>
</AccordionGroup>

When a step needs human intervention:

<AccordionGroup>
  <Accordion title="Human review node">
    * Context for decision: Original email, draft response, urgency, classification
    * Expected input format: Approval boolean plus optional edited response
    * When triggered: High urgency, complex issues, or quality concerns
  </Accordion>
</AccordionGroup>

## Step 3: Design your state

State is the shared [memory](/oss/python/concepts/memory) accessible to all nodes in your agent. Think of it as the notebook your agent uses to keep track of everything it learns and decides as it works through the process.

### What belongs in state?

Ask yourself these questions about each piece of data:

<CardGroup cols={2}>
  <Card title="Include in state" icon="check">
    Does it need to persist across steps? If yes, it goes in state.
  </Card>

<Card title="Don't store" icon="code">
    Can you derive it from other data? If yes, compute it when needed instead of storing it in state.
  </Card>
</CardGroup>

For our email agent, we need to track:

* The original email and sender info (can't reconstruct these later)
* Classification results (needed by multiple later/downstream nodes)
* Search results and customer data (expensive to re-fetch)
* The draft response (needs to persist through review)
* Execution metadata (for debugging and recovery)

### Keep state raw, format prompts on-demand

<Tip>
  A key principle: your state should store raw data, not formatted text. Format prompts inside nodes when you need them.
</Tip>

This separation means:

* Different nodes can format the same data differently for their needs
* You can change prompt templates without modifying your state schema
* Debugging is clearer – you see exactly what data each node received
* Your agent can evolve without breaking existing state

Let's define our state:

```python  theme={null}
from typing import TypedDict, Literal

**Examples:**

Example 1 (unknown):
```unknown
To implement an agent in LangGraph, you will usually follow the same five steps.

## Step 1: Map out your workflow as discrete steps

Start by identifying the distinct steps in your process. Each step will become a **node** (a function that does one specific thing). Then, sketch how these steps connect to each other.
```

Example 2 (unknown):
```unknown
The arrows in this diagram show possible paths, but the actual decision of which path to take happens inside each node.

Now that we've identified the components in our workflow, let's understand what each node needs to do:

* `Read Email`: Extract and parse the email content
* `Classify Intent`: Use an LLM to categorize urgency and topic, then route to appropriate action
* `Doc Search`: Query your knowledge base for relevant information
* `Bug Track`: Create or update issue in tracking system
* `Draft Reply`: Generate an appropriate response
* `Human Review`: Escalate to human agent for approval or handling
* `Send Reply`: Dispatch the email response

<Tip>
  Notice that some nodes make decisions about where to go next (`Classify Intent`, `Draft Reply`, `Human Review`), while others always proceed to the same next step (`Read Email` always goes to `Classify Intent`, `Doc Search` always goes to `Draft Reply`).
</Tip>

## Step 2: Identify what each step needs to do

For each node in your graph, determine what type of operation it represents and what context it needs to work properly.

<CardGroup cols={2}>
  <Card title="LLM steps" icon="brain" href="#llm-steps">
    Use when you need to understand, analyze, generate text, or make reasoning decisions
  </Card>

  <Card title="Data steps" icon="database" href="#data-steps">
    Use when you need to retrieve information from external sources
  </Card>

  <Card title="Action steps" icon="bolt" href="#action-steps">
    Use when you need to perform external actions
  </Card>

  <Card title="User input steps" icon="user" href="#user-input-steps">
    Use when you need human intervention
  </Card>
</CardGroup>

### LLM steps

When a step needs to understand, analyze, generate text, or make reasoning decisions:

<AccordionGroup>
  <Accordion title="Classify intent">
    * Static context (prompt): Classification categories, urgency definitions, response format
    * Dynamic context (from state): Email content, sender information
    * Desired outcome: Structured classification that determines routing
  </Accordion>

  <Accordion title="Draft reply">
    * Static context (prompt): Tone guidelines, company policies, response templates
    * Dynamic context (from state): Classification results, search results, customer history
    * Desired outcome: Professional email response ready for review
  </Accordion>
</AccordionGroup>

### Data steps

When a step needs to retrieve information from external sources:

<AccordionGroup>
  <Accordion title="Document search">
    * Parameters: Query built from intent and topic
    * Retry strategy: Yes, with exponential backoff for transient failures
    * Caching: Could cache common queries to reduce API calls
  </Accordion>

  <Accordion title="Customer history lookup">
    * Parameters: Customer email or ID from state
    * Retry strategy: Yes, but with fallback to basic info if unavailable
    * Caching: Yes, with time-to-live to balance freshness and performance
  </Accordion>
</AccordionGroup>

### Action steps

When a step needs to perform an external action:

<AccordionGroup>
  <Accordion title="Send reply">
    * When to execute node: After approval (human or automated)
    * Retry strategy: Yes, with exponential backoff for network issues
    * Should not cache: Each send is a unique action
  </Accordion>

  <Accordion title="Bug track">
    * When to execute node: Always when intent is "bug"
    * Retry strategy: Yes, critical to not lose bug reports
    * Returns: Ticket ID to include in response
  </Accordion>
</AccordionGroup>

### User input steps

When a step needs human intervention:

<AccordionGroup>
  <Accordion title="Human review node">
    * Context for decision: Original email, draft response, urgency, classification
    * Expected input format: Approval boolean plus optional edited response
    * When triggered: High urgency, complex issues, or quality concerns
  </Accordion>
</AccordionGroup>

## Step 3: Design your state

State is the shared [memory](/oss/python/concepts/memory) accessible to all nodes in your agent. Think of it as the notebook your agent uses to keep track of everything it learns and decides as it works through the process.

### What belongs in state?

Ask yourself these questions about each piece of data:

<CardGroup cols={2}>
  <Card title="Include in state" icon="check">
    Does it need to persist across steps? If yes, it goes in state.
  </Card>

  <Card title="Don't store" icon="code">
    Can you derive it from other data? If yes, compute it when needed instead of storing it in state.
  </Card>
</CardGroup>

For our email agent, we need to track:

* The original email and sender info (can't reconstruct these later)
* Classification results (needed by multiple later/downstream nodes)
* Search results and customer data (expensive to re-fetch)
* The draft response (needs to persist through review)
* Execution metadata (for debugging and recovery)

### Keep state raw, format prompts on-demand

<Tip>
  A key principle: your state should store raw data, not formatted text. Format prompts inside nodes when you need them.
</Tip>

This separation means:

* Different nodes can format the same data differently for their needs
* You can change prompt templates without modifying your state schema
* Debugging is clearer – you see exactly what data each node received
* Your agent can evolve without breaking existing state

Let's define our state:
```

---

## This means that after 'tools' is called, 'agent' node is called next.

**URL:** llms-txt#this-means-that-after-'tools'-is-called,-'agent'-node-is-called-next.

workflow.add_edge("tools", 'agent')

---

## TodoListMiddleware is included by default in create_deep_agent

**URL:** llms-txt#todolistmiddleware-is-included-by-default-in-create_deep_agent

---

## Tool that allows agent to update user information (useful for chat applications)

**URL:** llms-txt#tool-that-allows-agent-to-update-user-information-(useful-for-chat-applications)

@tool
def save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:
    """Save user info."""
    # Access the store - same as that provided to `create_agent`
    store = runtime.store # [!code highlight]
    user_id = runtime.context.user_id # [!code highlight]
    # Store data in the store (namespace, key, data)
    store.put(("users",), user_id, user_info) # [!code highlight]
    return "Successfully saved user info."

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[save_user_info],
    store=store, # [!code highlight]
    context_schema=Context
)

---

## Trace with Google ADK

**URL:** llms-txt#trace-with-google-adk

**Contents:**
- Installation
- Setup
  - 1. Configure environment variables
  - 2. Configure OpenTelemetry integration

Source: https://docs.langchain.com/langsmith/trace-with-google-adk

LangSmith supports tracing Google Agent Development Kit (ADK) applications through the OpenTelemetry integration. This guide shows you how to automatically capture traces from your [Google ADK](https://github.com/google/adk-python) agents and send them to LangSmith for monitoring and analysis.

Install the required packages using your preferred package manager:

<Info>
  Requires LangSmith Python SDK version `langsmith>=0.4.26` for optimal OpenTelemetry support.
</Info>

### 1. Configure environment variables

Set your LangSmith API key and project name:

<CodeGroup>
  
</CodeGroup>

### 2. Configure OpenTelemetry integration

In your Google ADK application, import and configure the LangSmith OpenTelemetry integration. This will automatically instrument Google ADK spans for OpenTelemetry.

```python  theme={null}
from langsmith.integrations.otel import configure

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

<Info>
  Requires LangSmith Python SDK version `langsmith>=0.4.26` for optimal OpenTelemetry support.
</Info>

## Setup

### 1. Configure environment variables

Set your LangSmith API key and project name:

<CodeGroup>
```

Example 3 (unknown):
```unknown
</CodeGroup>

### 2. Configure OpenTelemetry integration

In your Google ADK application, import and configure the LangSmith OpenTelemetry integration. This will automatically instrument Google ADK spans for OpenTelemetry.
```

---

## Trace with LangGraph

**URL:** llms-txt#trace-with-langgraph

**Contents:**
- With LangChain
  - 1. Installation
  - 2. Configure your environment

Source: https://docs.langchain.com/langsmith/trace-with-langgraph

LangSmith smoothly integrates with LangGraph (Python and JS) to help you trace agents, whether you're using LangChain modules or other SDKs.

If you are using LangChain modules within LangGraph, you only need to set a few environment variables to enable tracing.

This guide will walk through a basic example. For more detailed information on configuration, see the [Trace With LangChain](/langsmith/trace-with-langchain) guide.

Install the LangGraph library and the OpenAI integration for Python and JS (we use the OpenAI integration for the code snippets below).

For a full list of packages available, see the [LangChain Python docs](https://python.langchain.com/docs/integrations/platforms/) and [LangChain JS docs](https://js.langchain.com/docs/integrations/platforms/).

### 2. Configure your environment

```bash wrap theme={null}
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<your-api-key>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
</CodeGroup>

### 2. Configure your environment
```

---

## Trace with OpenAI Agents SDK

**URL:** llms-txt#trace-with-openai-agents-sdk

**Contents:**
- Installation
- Quick Start

Source: https://docs.langchain.com/langsmith/trace-with-openai-agents-sdk

The OpenAI Agents SDK allows you to build agentic applications powered by OpenAI's models.

Learn how to trace your LLM applications using the OpenAI Agents SDK with LangSmith.

<Info>
  Requires Python SDK version `langsmith>=0.3.15`.
</Info>

Install LangSmith with OpenAI Agents support:

This will install both the LangSmith library and the OpenAI Agents SDK.

You can integrate LangSmith tracing with the OpenAI Agents SDK by using the `OpenAIAgentsTracingProcessor` class.

The agent's execution flow, including all spans and their details, will be logged to LangSmith.

<img src="https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=7544fc0deb9c6279a9848da17d70bf8b" alt="OpenAI Agents SDK Trace in LangSmith" data-og-width="2984" width="2984" data-og-height="1782" height="1782" data-path="langsmith/images/agent-trace.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?w=280&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=18b3ec39553d20f562c61e68120b5ed7 280w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?w=560&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=e278d9a842f33c876cf1bb6937edaa9d 560w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?w=840&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=cf1fd1047a4f61bfe3cb0917d64cb403 840w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?w=1100&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=6d98b5286390e19b818c82fa3dcdd3e8 1100w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?w=1650&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=a20187910934b3921b5cac30df0922cb 1650w, https://mintcdn.com/langchain-5e9cc07a/E8FdemkcQxROovD9/langsmith/images/agent-trace.png?w=2500&fit=max&auto=format&n=E8FdemkcQxROovD9&q=85&s=3434b20ed1dfef6fc3751a50bb49b062 2500w" />

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/trace-with-openai-agents-sdk.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

This will install both the LangSmith library and the OpenAI Agents SDK.

## Quick Start

You can integrate LangSmith tracing with the OpenAI Agents SDK by using the `OpenAIAgentsTracingProcessor` class.
```

---

## Trace with Pipecat

**URL:** llms-txt#trace-with-pipecat

**Contents:**
- Installation
- Quickstart tutorial
  - Step 1: Set up your environment
  - Step 2: Download the span processor
  - Step 3: Create your voice agent file

Source: https://docs.langchain.com/langsmith/trace-with-pipecat

LangSmith can capture traces generated by [Pipecat](https://pipecat.ai/) using OpenTelemetry instrumentation. This guide shows you how to automatically capture traces from your Pipecat voice AI pipelines and send them to LangSmith for monitoring and analysis.

For a complete implementation, see the [demo repository](https://github.com/langchain-ai/voice-agents-tracing).

Install the required packages:

<Info>
  If you plan to use the advanced audio recording features, also install: `pip install scipy numpy`
</Info>

## Quickstart tutorial

Follow this step-by-step tutorial to create a voice AI agent with Pipecat and LangSmith tracing. You'll build a complete working example by copying and pasting code snippets.

### Step 1: Set up your environment

Create a `.env` file in your project directory:

### Step 2: Download the span processor

Add the [custom span processor file](https://github.com/langchain-ai/voice-agents-tracing/blob/main/pipecat/langsmith_processor.py) that enables LangSmith tracing. Save it as `langsmith_processor.py` in your project directory.

<Accordion title="What does the span processor do?">
  The span processor enriches Pipecat's OpenTelemetry spans with LangSmith-compatible attributes so your traces display properly in LangSmith.

* Converts Pipecat span types (stt, llm, tts, turn, conversation) to LangSmith format.
  * Adds `gen_ai.prompt.*` and `gen_ai.completion.*` attributes for message visualization.
  * Tracks and aggregates conversation messages across turns.
  * Handles audio file attachments (for advanced usage).

The processor automatically activates when you import it in your code.
</Accordion>

### Step 3: Create your voice agent file

Create a new file called `agent.py` and add the following code. We'll build it section by section so you can copy and paste each part.

#### Part 1: Import dependencies

```python  theme={null}
import asyncio
import uuid
from dotenv import load_dotenv

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

<Info>
  If you plan to use the advanced audio recording features, also install: `pip install scipy numpy`
</Info>

## Quickstart tutorial

Follow this step-by-step tutorial to create a voice AI agent with Pipecat and LangSmith tracing. You'll build a complete working example by copying and pasting code snippets.

### Step 1: Set up your environment

Create a `.env` file in your project directory:
```

Example 3 (unknown):
```unknown
### Step 2: Download the span processor

Add the [custom span processor file](https://github.com/langchain-ai/voice-agents-tracing/blob/main/pipecat/langsmith_processor.py) that enables LangSmith tracing. Save it as `langsmith_processor.py` in your project directory.

<Accordion title="What does the span processor do?">
  The span processor enriches Pipecat's OpenTelemetry spans with LangSmith-compatible attributes so your traces display properly in LangSmith.

  **Key functions:**

  * Converts Pipecat span types (stt, llm, tts, turn, conversation) to LangSmith format.
  * Adds `gen_ai.prompt.*` and `gen_ai.completion.*` attributes for message visualization.
  * Tracks and aggregates conversation messages across turns.
  * Handles audio file attachments (for advanced usage).

  The processor automatically activates when you import it in your code.
</Accordion>

### Step 3: Create your voice agent file

Create a new file called `agent.py` and add the following code. We'll build it section by section so you can copy and paste each part.

#### Part 1: Import dependencies
```

---

## Trace with PydanticAI

**URL:** llms-txt#trace-with-pydanticai

**Contents:**
- Installation
- Setup
  - 1. Configure environment variables
  - 2. Configure OpenTelemetry integration

Source: https://docs.langchain.com/langsmith/trace-with-pydantic-ai

LangSmith can capture traces generated by PydanticAI using its built-in OpenTelemetry instrumentation. This guide shows you how to automatically capture traces from your PydanticAI agents and send them to LangSmith for monitoring and analysis.

Install the required packages:

<Info>
  Requires LangSmith Python SDK version `langsmith>=0.4.26` for optimal OpenTelemetry support.
</Info>

### 1. Configure environment variables

Set your [API keys](/langsmith/create-account-api-key) and project name:

### 2. Configure OpenTelemetry integration

In your PydanticAI application, configure the LangSmith OpenTelemetry integration:

```python  theme={null}
from langsmith.integrations.otel import configure
from pydantic_ai import Agent

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

<Info>
  Requires LangSmith Python SDK version `langsmith>=0.4.26` for optimal OpenTelemetry support.
</Info>

## Setup

### 1. Configure environment variables

Set your [API keys](/langsmith/create-account-api-key) and project name:
```

Example 3 (unknown):
```unknown
### 2. Configure OpenTelemetry integration

In your PydanticAI application, configure the LangSmith OpenTelemetry integration:
```

---

## Under the hood, it looks like

**URL:** llms-txt#under-the-hood,-it-looks-like

**Contents:**
  - FilesystemBackend (local disk)
  - StoreBackend (LangGraph Store)
  - CompositeBackend (router)
- Specify a backend
- Route to different backends
- Use a virtual filesystem
- Add policy hooks
- Protocol reference

from deepagents.backends import StateBackend

agent = create_deep_agent(
    backend=(lambda rt: StateBackend(rt))   # Note that the tools access State through the runtime.state
)
python  theme={null}
from deepagents.backends import FilesystemBackend

agent = create_deep_agent(
    backend=FilesystemBackend(root_dir=".", virtual_mode=True)
)
python  theme={null}
from langgraph.store.memory import InMemoryStore
from deepagents.backends import StoreBackend

agent = create_deep_agent(
    backend=(lambda rt: StoreBackend(rt)),   # Note that the tools access Store through the runtime.store
    store=InMemoryStore()
)
python  theme={null}
from deepagents import create_deep_agent
from deepagents.backends import CompositeBackend, StateBackend, StoreBackend
from langgraph.store.memory import InMemoryStore

composite_backend = lambda rt: CompositeBackend(
    default=StateBackend(rt),
    routes={
        "/memories/": StoreBackend(rt),
    }
)

agent = create_deep_agent(
    backend=composite_backend,
    store=InMemoryStore()  # Store passed to create_deep_agent, not backend
)
python  theme={null}
from deepagents import create_deep_agent
from deepagents.backends import CompositeBackend, StateBackend, FilesystemBackend

composite_backend = lambda rt: CompositeBackend(
    default=StateBackend(rt),
    routes={
        "/memories/": FilesystemBackend(root_dir="/deepagents/myagent", virtual_mode=True),
    },
)

agent = create_deep_agent(backend=composite_backend)
python  theme={null}
from deepagents.backends.protocol import BackendProtocol, WriteResult, EditResult
from deepagents.backends.utils import FileInfo, GrepMatch

class S3Backend(BackendProtocol):
    def __init__(self, bucket: str, prefix: str = ""):
        self.bucket = bucket
        self.prefix = prefix.rstrip("/")

def _key(self, path: str) -> str:
        return f"{self.prefix}{path}"

def ls_info(self, path: str) -> list[FileInfo]:
        # List objects under _key(path); build FileInfo entries (path, size, modified_at)
        ...

def read(self, file_path: str, offset: int = 0, limit: int = 2000) -> str:
        # Fetch object; return numbered content or an error string
        ...

def grep_raw(self, pattern: str, path: str | None = None, glob: str | None = None) -> list[GrepMatch] | str:
        # Optionally filter server‑side; else list and scan content
        ...

def glob_info(self, pattern: str, path: str = "/") -> list[FileInfo]:
        # Apply glob relative to path across keys
        ...

def write(self, file_path: str, content: str) -> WriteResult:
        # Enforce create‑only semantics; return WriteResult(path=file_path, files_update=None)
        ...

def edit(self, file_path: str, old_string: str, new_string: str, replace_all: bool = False) -> EditResult:
        # Read → replace (respect uniqueness vs replace_all) → write → return occurrences
        ...
python  theme={null}
from deepagents.backends.filesystem import FilesystemBackend
from deepagents.backends.protocol import WriteResult, EditResult

class GuardedBackend(FilesystemBackend):
    def __init__(self, *, deny_prefixes: list[str], **kwargs):
        super().__init__(**kwargs)
        self.deny_prefixes = [p if p.endswith("/") else p + "/" for p in deny_prefixes]

def write(self, file_path: str, content: str) -> WriteResult:
        if any(file_path.startswith(p) for p in self.deny_prefixes):
            return WriteResult(error=f"Writes are not allowed under {file_path}")
        return super().write(file_path, content)

def edit(self, file_path: str, old_string: str, new_string: str, replace_all: bool = False) -> EditResult:
        if any(file_path.startswith(p) for p in self.deny_prefixes):
            return EditResult(error=f"Edits are not allowed under {file_path}")
        return super().edit(file_path, old_string, new_string, replace_all)
python  theme={null}
from deepagents.backends.protocol import BackendProtocol, WriteResult, EditResult
from deepagents.backends.utils import FileInfo, GrepMatch

class PolicyWrapper(BackendProtocol):
    def __init__(self, inner: BackendProtocol, deny_prefixes: list[str] | None = None):
        self.inner = inner
        self.deny_prefixes = [p if p.endswith("/") else p + "/" for p in (deny_prefixes or [])]

def _deny(self, path: str) -> bool:
        return any(path.startswith(p) for p in self.deny_prefixes)

def ls_info(self, path: str) -> list[FileInfo]:
        return self.inner.ls_info(path)
    def read(self, file_path: str, offset: int = 0, limit: int = 2000) -> str:
        return self.inner.read(file_path, offset=offset, limit=limit)
    def grep_raw(self, pattern: str, path: str | None = None, glob: str | None = None) -> list[GrepMatch] | str:
        return self.inner.grep_raw(pattern, path, glob)
    def glob_info(self, pattern: str, path: str = "/") -> list[FileInfo]:
        return self.inner.glob_info(pattern, path)
    def write(self, file_path: str, content: str) -> WriteResult:
        if self._deny(file_path):
            return WriteResult(error=f"Writes are not allowed under {file_path}")
        return self.inner.write(file_path, content)
    def edit(self, file_path: str, old_string: str, new_string: str, replace_all: bool = False) -> EditResult:
        if self._deny(file_path):
            return EditResult(error=f"Edits are not allowed under {file_path}")
        return self.inner.edit(file_path, old_string, new_string, replace_all)
```

## Protocol reference

Backends must implement the `BackendProtocol`.

* `ls_info(path: str) -> list[FileInfo]`
  * Return entries with at least `path`. Include `is_dir`, `size`, `modified_at` when available. Sort by `path` for deterministic output.
* `read(file_path: str, offset: int = 0, limit: int = 2000) -> str`
  * Return numbered content. On missing file, return `"Error: File '/x' not found"`.
* `grep_raw(pattern: str, path: Optional[str] = None, glob: Optional[str] = None) -> list[GrepMatch] | str`
  * Return structured matches. For an invalid regex, return a string like `"Invalid regex pattern: ..."` (do not raise).
* `glob_info(pattern: str, path: str = "/") -> list[FileInfo]`
  * Return matched files as `FileInfo` entries (empty list if none).
* `write(file_path: str, content: str) -> WriteResult`
  * Create-only. On conflict, return `WriteResult(error=...)`. On success, set `path` and for state backends set `files_update={...}`; external backends should use `files_update=None`.
* `edit(file_path: str, old_string: str, new_string: str, replace_all: bool = False) -> EditResult`
  * Enforce uniqueness of `old_string` unless `replace_all=True`. If not found, return error. Include `occurrences` on success.

* `WriteResult(error, path, files_update)`
* `EditResult(error, path, files_update, occurrences)`
* `FileInfo` with fields: `path` (required), optionally `is_dir`, `size`, `modified_at`.
* `GrepMatch` with fields: `path`, `line`, `text`.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/backends.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
**How it works:**

* Stores files in LangGraph agent state for the current thread.
* Persists across multiple agent turns on the same thread via checkpoints.

**Best for:**

* A scratch pad for the agent to write intermediate results.
* Automatic eviction of large tool outputs which the agent can then read back in piece by piece.

### FilesystemBackend (local disk)
```

Example 2 (unknown):
```unknown
**How it works:**

* Reads/writes real files under a configurable `root_dir`.
* You can optionally set `virtual_mode=True` to sandbox and normalize paths under `root_dir`.
* Uses secure path resolution, prevents unsafe symlink traversal when possible, can use ripgrep for fast `grep`.

**Best for:**

* Local projects on your machine
* CI sandboxes
* Mounted persistent volumes

### StoreBackend (LangGraph Store)
```

Example 3 (unknown):
```unknown
**How it works:**

* Stores files in a LangGraph `BaseStore` provided by the runtime, enabling cross‑thread durable storage.

**Best for:**

* When you already run with a configured LangGraph store (for example, Redis, Postgres, or cloud implementations behind `BaseStore`).
* When you're deploying your agent through LangSmith Deployment (a store is automatically provisioned for your agent).

### CompositeBackend (router)
```

Example 4 (unknown):
```unknown
**How it works:**

* Routes file operations to different backends based on path prefix.
* Preserves the original path prefixes in listings and search results.

**Best for:**

* When you want to give your agent both ephemeral and cross-thread storage, a CompositeBackend allows you provide both a StateBackend and StoreBackend
* When you have multiple sources of information that you want to provide to your agent as part of a single filesystem.
  * e.g. You have long-term memories stored under /memories/ in one Store and you also have a custom backend that has documentation accessible at /docs/.

## Specify a backend

* Pass a backend to `create_deep_agent(backend=...)`. The filesystem middleware uses it for all tooling.
* You can pass either:
  * An instance implementing `BackendProtocol` (for example, `FilesystemBackend(root_dir=".")`), or
  * A factory `BackendFactory = Callable[[ToolRuntime], BackendProtocol]` (for backends that need runtime like `StateBackend` or `StoreBackend`).
* If omitted, the default is `lambda rt: StateBackend(rt)`.

## Route to different backends

Route parts of the namespace to different backends. Commonly used to persist `/memories/*` and keep everything else ephemeral.
```

---

## Update the user_name in the agent state

**URL:** llms-txt#update-the-user_name-in-the-agent-state

@tool
def update_user_name(
    new_name: str,
    runtime: ToolRuntime
) -> Command:
    """Update the user's name."""
    return Command(update={"user_name": new_name})
python  theme={null}
from dataclasses import dataclass
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime

USER_DATABASE = {
    "user123": {
        "name": "Alice Johnson",
        "account_type": "Premium",
        "balance": 5000,
        "email": "alice@example.com"
    },
    "user456": {
        "name": "Bob Smith",
        "account_type": "Standard",
        "balance": 1200,
        "email": "bob@example.com"
    }
}

@dataclass
class UserContext:
    user_id: str

@tool
def get_account_info(runtime: ToolRuntime[UserContext]) -> str:
    """Get the current user's account information."""
    user_id = runtime.context.user_id

if user_id in USER_DATABASE:
        user = USER_DATABASE[user_id]
        return f"Account holder: {user['name']}\nType: {user['account_type']}\nBalance: ${user['balance']}"
    return "User not found"

model = ChatOpenAI(model="gpt-4o")
agent = create_agent(
    model,
    tools=[get_account_info],
    context_schema=UserContext,
    system_prompt="You are a financial assistant."
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's my current balance?"}]},
    context=UserContext(user_id="user123")
)
python expandable theme={null}
from typing import Any
from langgraph.store.memory import InMemoryStore
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime

**Examples:**

Example 1 (unknown):
```unknown
#### Context

Access immutable configuration and contextual data like user IDs, session details, or application-specific configuration through `runtime.context`.

Tools can access runtime context through `ToolRuntime`:
```

Example 2 (unknown):
```unknown
#### Memory (Store)

Access persistent data across conversations using the store. The store is accessed via `runtime.store` and allows you to save and retrieve user-specific or application-specific data.

Tools can access and update the store through `ToolRuntime`:
```

---

## Use instead

**URL:** llms-txt#use-instead

**Contents:**
  - Tools
  - Structured output
  - Streaming node name rename
  - Runtime context
- Standard content
  - What changed
  - Read standardized content
  - Create multimodal messages
  - Example block shapes

agent = create_agent("gpt-4o-mini", tools=[some_tool])
python v1 (new) theme={null}
  from langchain.agents import create_agent

agent = create_agent(
      model="claude-sonnet-4-5-20250929",
      tools=[check_weather, search_web]
  )
  python v0 (old) theme={null}
  from langgraph.prebuilt import create_react_agent, ToolNode

agent = create_react_agent(
      model="claude-sonnet-4-5-20250929",
      tools=ToolNode([check_weather, search_web]) # [!code highlight]
  )
  python v1 (new) theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import wrap_tool_call
  from langchain.messages import ToolMessage

@wrap_tool_call
  def handle_tool_errors(request, handler):
      """Handle tool execution errors with custom messages."""
      try:
          return handler(request)
      except Exception as e:
          # Only handle errors that occur during tool execution due to invalid inputs
          # that pass schema validation but fail at runtime (e.g., invalid SQL syntax).
          # Do NOT handle:
          # - Network failures (use tool retry middleware instead)
          # - Incorrect tool implementation errors (should bubble up)
          # - Schema mismatch errors (already auto-handled by the framework)
          #
          # Return a custom error message to the model
          return ToolMessage(
              content=f"Tool error: Please check your input and try again. ({str(e)})",
              tool_call_id=request.tool_call["id"]
          )

agent = create_agent(
      model="claude-sonnet-4-5-20250929",
      tools=[check_weather, search_web],
      middleware=[handle_tool_errors]
  )
  python v0 (old) theme={null}
  from langgraph.prebuilt import create_react_agent, ToolNode
  from langchain.messages import ToolMessage

def handle_tool_error(error: Exception) -> str:
      """Custom error handler function."""
      return f"Tool error: Please check your input and try again. ({str(error)})"

agent = create_react_agent(
      model="claude-sonnet-4-5-20250929",
      tools=ToolNode(
          [check_weather, search_web],
          handle_tool_errors=handle_tool_error  # [!code highlight]
      )
  )
  python v1 (new) theme={null}
  from langchain.agents import create_agent
  from langchain.agents.structured_output import ToolStrategy, ProviderStrategy
  from pydantic import BaseModel

class OutputSchema(BaseModel):
      summary: str
      sentiment: str

# Using ToolStrategy
  agent = create_agent(
      model="gpt-4o-mini",
      tools=tools,
      # explicitly using tool strategy
      response_format=ToolStrategy(OutputSchema)  # [!code highlight]
  )
  python v0 (old) theme={null}
  from langgraph.prebuilt import create_react_agent
  from pydantic import BaseModel

class OutputSchema(BaseModel):
      summary: str
      sentiment: str

agent = create_react_agent(
      model="gpt-4o-mini",
      tools=tools,
      # using tool strategy by default with no option for provider strategy
      response_format=OutputSchema  # [!code highlight]
  )

agent = create_react_agent(
      model="gpt-4o-mini",
      tools=tools,
      # using a custom prompt to instruct the model to generate the output schema
      response_format=("please generate ...", OutputSchema)  # [!code highlight]
  )
  python v1 (new) theme={null}
  from dataclasses import dataclass

from langchain.agents import create_agent

@dataclass
  class Context:
      user_id: str
      session_id: str

agent = create_agent(
      model=model,
      tools=tools,
      context_schema=Context  # [!code highlight]
  )

result = agent.invoke(
      {"messages": [{"role": "user", "content": "Hello"}]},
      context=Context(user_id="123", session_id="abc")  # [!code highlight]
  )
  python v0 (old) theme={null}
  from langgraph.prebuilt import create_react_agent

agent = create_react_agent(model, tools)

# Pass context via configurable
  result = agent.invoke(
      {"messages": [{"role": "user", "content": "Hello"}]},
      config={  # [!code highlight]
          "configurable": {  # [!code highlight]
              "user_id": "123",  # [!code highlight]
              "session_id": "abc"  # [!code highlight]
          }  # [!code highlight]
      }  # [!code highlight]
  )
  python v1 (new) theme={null}
  from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-5-nano")
  response = model.invoke("Explain AI")

for block in response.content_blocks:
      if block["type"] == "reasoning":
          print(block.get("reasoning"))
      elif block["type"] == "text":
          print(block.get("text"))
  python v0 (old) theme={null}
  # Provider-native formats vary; you needed per-provider handling
  response = model.invoke("Explain AI")
  for item in response.content:
      if item.get("type") == "reasoning":
          ...  # OpenAI-style reasoning
      elif item.get("type") == "thinking":
          ...  # Anthropic-style thinking
      elif item.get("type") == "text":
          ...  # Text
  python v1 (new) theme={null}
  from langchain.messages import HumanMessage

message = HumanMessage(content_blocks=[
      {"type": "text", "text": "Describe this image."},
      {"type": "image", "url": "https://example.com/image.jpg"},
  ])
  res = model.invoke([message])
  python v0 (old) theme={null}
  from langchain.messages import HumanMessage

message = HumanMessage(content=[
      # Provider-native structure
      {"type": "text", "text": "Describe this image."},
      {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}},
  ])
  res = model.invoke([message])
  python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
<Note>
  Dynamic model functions can return pre-bound models if structured output is *not* used.
</Note>

### Tools

The [`tools`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(tools\)) argument to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) accepts a list of:

* LangChain [`BaseTool`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.BaseTool) instances (functions decorated with [`@tool`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.tool))
* Callable objects (functions) with proper type hints and a docstring
* `dict` that represents a built-in provider tools

The argument will no longer accept [`ToolNode`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.tool_node.ToolNode) instances.

<CodeGroup>
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
</CodeGroup>

#### Handling tool errors

You can now configure the handling of tool errors with middleware implementing the `wrap_tool_call` method.

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Use it as a custom subagent

**URL:** llms-txt#use-it-as-a-custom-subagent

**Contents:**
- The general-purpose subagent
  - When to use it
- Best practices
  - Write clear descriptions
  - Keep system prompts detailed
  - Minimize tool sets

custom_subagent = CompiledSubAgent(
    name="data-analyzer",
    description="Specialized agent for complex data analysis tasks",
    runnable=custom_graph
)

subagents = [custom_subagent]

agent = create_deep_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[internet_search],
    system_prompt=research_instructions,
    subagents=subagents
)
python  theme={null}
research_subagent = {
    "name": "research-agent",
    "description": "Conducts in-depth research using web search and synthesizes findings",
    "system_prompt": """You are a thorough researcher. Your job is to:

1. Break down the research question into searchable queries
    2. Use internet_search to find relevant information
    3. Synthesize findings into a comprehensive but concise summary
    4. Cite sources when making claims

Output format:
    - Summary (2-3 paragraphs)
    - Key findings (bullet points)
    - Sources (with URLs)

Keep your response under 500 words to maintain clean context.""",
    "tools": [internet_search],
}
python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
## The general-purpose subagent

In addition to any user-defined subagents, deep agents have access to a `general-purpose` subagent at all times. This subagent:

* Has the same system prompt as the main agent
* Has access to all the same tools
* Uses the same model (unless overridden)

### When to use it

The general-purpose subagent is ideal for context isolation without specialized behavior. The main agent can delegate a complex multi-step task to this subagent and get a concise result back without bloat from intermediate tool calls.

<Card title="Example">
  Instead of the main agent making 10 web searches and filling its context with results, it delegates to the general-purpose subagent: `task(name="general-purpose", task="Research quantum computing trends")`. The subagent performs all the searches internally and returns only a summary.
</Card>

## Best practices

### Write clear descriptions

The main agent uses descriptions to decide which subagent to call. Be specific:

✅ **Good:** `"Analyzes financial data and generates investment insights with confidence scores"`

❌ **Bad:** `"Does finance stuff"`

### Keep system prompts detailed

Include specific guidance on how to use tools and format outputs:
```

Example 2 (unknown):
```unknown
### Minimize tool sets

Only give subagents the tools they need. This improves focus and security:
```

---

## Use time-travel

**URL:** llms-txt#use-time-travel

**Contents:**
- In a workflow
  - Setup

Source: https://docs.langchain.com/oss/python/langgraph/use-time-travel

When working with non-deterministic systems that make model-based decisions (e.g., agents powered by LLMs), it can be useful to examine their decision-making process in detail:

1. <Icon icon="lightbulb" size={16} /> **Understand reasoning**: Analyze the steps that led to a successful result.
2. <Icon icon="bug" size={16} /> **Debug mistakes**: Identify where and why errors occurred.
3. <Icon icon="magnifying-glass" size={16} /> **Explore alternatives**: Test different paths to uncover better solutions.

LangGraph provides [time travel](/oss/python/langgraph/use-time-travel) functionality to support these use cases. Specifically, you can resume execution from a prior checkpoint — either replaying the same state or modifying it to explore alternatives. In all cases, resuming past execution produces a new fork in the history.

To use [time-travel](/oss/python/langgraph/use-time-travel) in LangGraph:

1. [Run the graph](#1-run-the-graph) with initial inputs using [`invoke`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.invoke) or [`stream`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.stream) methods.
2. [Identify a checkpoint in an existing thread](#2-identify-a-checkpoint): Use the [`get_state_history`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.get_state_history) method to retrieve the execution history for a specific `thread_id` and locate the desired `checkpoint_id`.
   Alternatively, set an [interrupt](/oss/python/langgraph/interrupts) before the node(s) where you want execution to pause. You can then find the most recent checkpoint recorded up to that interrupt.
3. [Update the graph state (optional)](#3-update-the-state-optional): Use the [`update_state`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.update_state) method to modify the graph's state at the checkpoint and resume execution from alternative state.
4. [Resume execution from the checkpoint](#4-resume-execution-from-the-checkpoint): Use the `invoke` or `stream` methods with an input of `None` and a configuration containing the appropriate `thread_id` and `checkpoint_id`.

<Tip>
  For a conceptual overview of time-travel, see [Time travel](/oss/python/langgraph/use-time-travel).
</Tip>

This example builds a simple LangGraph workflow that generates a joke topic and writes a joke using an LLM. It demonstrates how to run the graph, retrieve past execution checkpoints, optionally modify the state, and resume execution from a chosen checkpoint to explore alternate outcomes.

First we need to install the packages required

Next, we need to set API keys for Anthropic (the LLM we will use)

<Tip>
  Sign up for [LangSmith](https://smith.langchain.com) to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph.
</Tip>

```python  theme={null}
import uuid

from typing_extensions import TypedDict, NotRequired
from langgraph.graph import StateGraph, START, END
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):
    topic: NotRequired[str]
    joke: NotRequired[str]

model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    temperature=0,
)

def generate_topic(state: State):
    """LLM call to generate a topic for the joke"""
    msg = model.invoke("Give me a funny topic for a joke")
    return {"topic": msg.content}

def write_joke(state: State):
    """LLM call to write a joke based on the topic"""
    msg = model.invoke(f"Write a short joke about {state['topic']}")
    return {"joke": msg.content}

**Examples:**

Example 1 (unknown):
```unknown
Next, we need to set API keys for Anthropic (the LLM we will use)
```

Example 2 (unknown):
```unknown
<Tip>
  Sign up for [LangSmith](https://smith.langchain.com) to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph.
</Tip>
```

---

## We now add a normal edge from 'tools' to 'agent'.

**URL:** llms-txt#we-now-add-a-normal-edge-from-'tools'-to-'agent'.

---

## What's new in LangChain v1

**URL:** llms-txt#what's-new-in-langchain-v1

**Contents:**
- `create_agent`
  - Middleware
  - Built on LangGraph
  - Structured output

Source: https://docs.langchain.com/oss/python/releases/langchain-v1

**LangChain v1 is a focused, production-ready foundation for building agents.** We've streamlined the framework around three core improvements:

<CardGroup cols={1}>
  <Card title="create_agent" icon="robot" href="#create-agent" arrow>
    The new standard for building agents in LangChain, replacing `langgraph.prebuilt.create_react_agent`.
  </Card>

<Card title="Standard content blocks" icon="cube" href="#standard-content-blocks" arrow>
    A new `content_blocks` property that provides unified access to modern LLM features across providers.
  </Card>

<Card title="Simplified namespace" icon="sitemap" href="#simplified-package" arrow>
    The `langchain` namespace has been streamlined to focus on essential building blocks for agents, with legacy functionality moved to `langchain-classic`.
  </Card>
</CardGroup>

For a complete list of changes, see the [migration guide](/oss/python/migrate/langchain-v1).

[`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) is the standard way to build agents in LangChain 1.0. It provides a simpler interface than [`langgraph.prebuilt.create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) while offering greater customization potential by using [middleware](#middleware).

Under the hood, [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) is built on the basic agent loop -- calling a model, letting it choose tools to execute, and then finishing when it calls no more tools:

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=ac72e48317a9ced68fd1be64e89ec063" alt="Core agent loop diagram" className="rounded-lg" data-og-width="300" width="300" data-og-height="268" height="268" data-path="oss/images/core_agent_loop.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=280&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=a4c4b766b6678ef52a6ed556b1a0b032 280w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=560&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=111869e6e99a52c0eff60a1ef7ddc49c 560w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=840&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=6c1e21de7b53bd0a29683aca09c6f86e 840w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1100&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=88bef556edba9869b759551c610c60f4 1100w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1650&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=9b0bdd138e9548eeb5056dc0ed2d4a4b 1650w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=2500&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=41eb4f053ed5e6b0ba5bad2badf6d755 2500w" />
</div>

For more information, see [Agents](/oss/python/langchain/agents).

Middleware is the defining feature of [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent). It offers a highly customizable entry-point, raising the ceiling for what you can build.

Great agents require [context engineering](/oss/python/langchain/context-engineering): getting the right information to the model at the right time. Middleware helps you control dynamic prompts, conversation summarization, selective tool access, state management, and guardrails through a composable abstraction.

#### Prebuilt middleware

LangChain provides a few [prebuilt middlewares](/oss/python/langchain/middleware#built-in-middleware) for common patterns, including:

* [`PIIMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.PIIMiddleware): Redact sensitive information before sending to the model
* [`SummarizationMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.SummarizationMiddleware): Condense conversation history when it gets too long
* [`HumanInTheLoopMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware): Require approval for sensitive tool calls

#### Custom middleware

You can also build custom middleware to fit your needs. Middleware exposes hooks at each step in an agent's execution:

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware flow diagram" className="rounded-lg" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />
</div>

Build custom middleware by implementing any of these hooks on a subclass of the [`AgentMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware) class:

| Hook              | When it runs             | Use cases                               |
| ----------------- | ------------------------ | --------------------------------------- |
| `before_agent`    | Before calling the agent | Load memory, validate input             |
| `before_model`    | Before each LLM call     | Update prompts, trim messages           |
| `wrap_model_call` | Around each LLM call     | Intercept and modify requests/responses |
| `wrap_tool_call`  | Around each tool call    | Intercept and modify tool execution     |
| `after_model`     | After each LLM response  | Validate output, apply guardrails       |
| `after_agent`     | After agent completes    | Save results, cleanup                   |

Example custom middleware:

For more information, see [the complete middleware guide](/oss/python/langchain/middleware).

### Built on LangGraph

Because [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) is built on [LangGraph](/oss/python/langgraph), you automatically get built in support for long running and reliable agents via:

<CardGroup cols={2}>
  <Card title="Persistence" icon="database">
    Conversations automatically persist across sessions with built-in checkpointing
  </Card>

<Card title="Streaming" icon="water">
    Stream tokens, tool calls, and reasoning traces in real-time
  </Card>

<Card title="Human-in-the-loop" icon="hand">
    Pause agent execution for human approval before sensitive actions
  </Card>

<Card title="Time travel" icon="clock-rotate-left">
    Rewind conversations to any point and explore alternate paths and prompts
  </Card>
</CardGroup>

You don't need to learn LangGraph to use these features—they work out of the box.

### Structured output

[`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) has improved structured output generation:

* **Main loop integration**: Structured output is now generated in the main loop instead of requiring an additional LLM call
* **Structured output strategy**: Models can choose between calling tools or using provider-side structured output generation
* **Cost reduction**: Eliminates extra expense from additional LLM calls

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from pydantic import BaseModel

class Weather(BaseModel):
    temperature: float
    condition: str

def weather_tool(city: str) -> str:
    """Get the weather for a city."""
    return f"it's sunny and 70 degrees in {city}"

agent = create_agent(
    "gpt-4o-mini",
    tools=[weather_tool],
    response_format=ToolStrategy(Weather)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "What's the weather in SF?"}]
})

print(repr(result["structured_response"]))

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

For a complete list of changes, see the [migration guide](/oss/python/migrate/langchain-v1).

## `create_agent`

[`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) is the standard way to build agents in LangChain 1.0. It provides a simpler interface than [`langgraph.prebuilt.create_react_agent`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.chat_agent_executor.create_react_agent) while offering greater customization potential by using [middleware](#middleware).
```

Example 3 (unknown):
```unknown
Under the hood, [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) is built on the basic agent loop -- calling a model, letting it choose tools to execute, and then finishing when it calls no more tools:

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=ac72e48317a9ced68fd1be64e89ec063" alt="Core agent loop diagram" className="rounded-lg" data-og-width="300" width="300" data-og-height="268" height="268" data-path="oss/images/core_agent_loop.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=280&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=a4c4b766b6678ef52a6ed556b1a0b032 280w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=560&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=111869e6e99a52c0eff60a1ef7ddc49c 560w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=840&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=6c1e21de7b53bd0a29683aca09c6f86e 840w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1100&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=88bef556edba9869b759551c610c60f4 1100w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1650&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=9b0bdd138e9548eeb5056dc0ed2d4a4b 1650w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=2500&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=41eb4f053ed5e6b0ba5bad2badf6d755 2500w" />
</div>

For more information, see [Agents](/oss/python/langchain/agents).

### Middleware

Middleware is the defining feature of [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent). It offers a highly customizable entry-point, raising the ceiling for what you can build.

Great agents require [context engineering](/oss/python/langchain/context-engineering): getting the right information to the model at the right time. Middleware helps you control dynamic prompts, conversation summarization, selective tool access, state management, and guardrails through a composable abstraction.

#### Prebuilt middleware

LangChain provides a few [prebuilt middlewares](/oss/python/langchain/middleware#built-in-middleware) for common patterns, including:

* [`PIIMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.PIIMiddleware): Redact sensitive information before sending to the model
* [`SummarizationMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.SummarizationMiddleware): Condense conversation history when it gets too long
* [`HumanInTheLoopMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware): Require approval for sensitive tool calls
```

Example 4 (unknown):
```unknown
#### Custom middleware

You can also build custom middleware to fit your needs. Middleware exposes hooks at each step in an agent's execution:

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware flow diagram" className="rounded-lg" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />
</div>

Build custom middleware by implementing any of these hooks on a subclass of the [`AgentMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware) class:

| Hook              | When it runs             | Use cases                               |
| ----------------- | ------------------------ | --------------------------------------- |
| `before_agent`    | Before calling the agent | Load memory, validate input             |
| `before_model`    | Before each LLM call     | Update prompts, trim messages           |
| `wrap_model_call` | Around each LLM call     | Intercept and modify requests/responses |
| `wrap_tool_call`  | Around each tool call    | Intercept and modify tool execution     |
| `after_model`     | After each LLM response  | Validate output, apply guardrails       |
| `after_agent`     | After agent completes    | Save results, cleanup                   |

Example custom middleware:
```

---

## When user provides PII, it will be handled according to the strategy

**URL:** llms-txt#when-user-provides-pii,-it-will-be-handled-according-to-the-strategy

**Contents:**
  - Human-in-the-loop

result = agent.invoke({
    "messages": [{"role": "user", "content": "My email is john.doe@example.com and card is 5105-1051-0510-5100"}]
})
python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, send_email_tool, delete_database_tool],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                # Require approval for sensitive operations
                "send_email": True,
                "delete_database": True,
                # Auto-approve safe operations
                "search": False,
            }
        ),
    ],
    # Persist the state across interrupts
    checkpointer=InMemorySaver(),
)

**Examples:**

Example 1 (unknown):
```unknown
<Accordion title="Built-in PII types and configuration">
  **Built-in PII types:**

  * `email` - Email addresses
  * `credit_card` - Credit card numbers (Luhn validated)
  * `ip` - IP addresses
  * `mac_address` - MAC addresses
  * `url` - URLs

  **Configuration options:**

  | Parameter               | Description                                                            | Default                |
  | ----------------------- | ---------------------------------------------------------------------- | ---------------------- |
  | `pii_type`              | Type of PII to detect (built-in or custom)                             | Required               |
  | `strategy`              | How to handle detected PII (`"block"`, `"redact"`, `"mask"`, `"hash"`) | `"redact"`             |
  | `detector`              | Custom detector function or regex pattern                              | `None` (uses built-in) |
  | `apply_to_input`        | Check user messages before model call                                  | `True`                 |
  | `apply_to_output`       | Check AI messages after model call                                     | `False`                |
  | `apply_to_tool_results` | Check tool result messages after execution                             | `False`                |
</Accordion>

See the [middleware documentation](/oss/python/langchain/middleware#pii-detection) for complete details on PII detection capabilities.

### Human-in-the-loop

LangChain provides built-in middleware for requiring human approval before executing sensitive operations. This is one of the most effective guardrails for high-stakes decisions.

Human-in-the-loop middleware is helpful for cases such as financial transactions and transfers, deleting or modifying production data, sending communications to external parties, and any operation with significant business impact.
```

---

## Workflows and agents

**URL:** llms-txt#workflows-and-agents

**Contents:**
- Setup
- LLMs and augmentations

Source: https://docs.langchain.com/oss/python/langgraph/workflows-agents

This guide reviews common workflow and agent patterns.

* Workflows have predetermined code paths and are designed to operate in a certain order.
* Agents are dynamic and define their own processes and tool usage.

<img src="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=c217c9ef517ee556cae3fc928a21dc55" alt="Agent Workflow" data-og-width="4572" width="4572" data-og-height="2047" height="2047" data-path="oss/images/agent_workflow.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?w=280&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=290e50cff2f72d524a107421ec8e3ff0 280w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?w=560&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=a2bfc87080aee7dd4844f7f24035825e 560w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?w=840&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=ae1fa9087b33b9ff8bc3446ccaa23e3d 840w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?w=1100&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=06003ee1fe07d7a1ea8cf9200e7d0a10 1100w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?w=1650&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=bc98b459a9b1fb226c2887de1696bde0 1650w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/agent_workflow.png?w=2500&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=1933bcdfd5c5b69b98ce96aafa456848 2500w" />

LangGraph offers several benefits when building agents and workflows, including [persistence](/oss/python/langgraph/persistence), [streaming](/oss/python/langgraph/streaming), and support for debugging as well as [deployment](/oss/python/langgraph/deploy).

To build a workflow or agent, you can use [any chat model](/oss/python/integrations/chat) that supports structured outputs and tool calling. The following example uses Anthropic:

1. Install dependencies:

2. Initialize the LLM:

## LLMs and augmentations

Workflows and agentic systems are based on LLMs and the various augmentations you add to them. [Tool calling](/oss/python/langchain/tools), [structured outputs](/oss/python/langchain/structured-output), and [short term memory](/oss/python/langchain/short-term-memory) are a few options for tailoring LLMs to your needs.

<img src="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=7ea9656f46649b3ebac19e8309ae9006" alt="LLM augmentations" data-og-width="1152" width="1152" data-og-height="778" height="778" data-path="oss/images/augmented_llm.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=280&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=53613048c1b8bd3241bd27900a872ead 280w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=560&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=7ba1f4427fd847bd410541ae38d66d40 560w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=840&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=503822cf29a28500deb56f463b4244e4 840w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=1100&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=279e0440278d3a26b73c72695636272e 1100w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=1650&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=d936838b98bc9dce25168e2b2cfd23d0 1650w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=2500&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=fa2115f972bc1152b5e03ae590600fa3 2500w" />

```python  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
2. Initialize the LLM:
```

Example 2 (unknown):
```unknown
## LLMs and augmentations

Workflows and agentic systems are based on LLMs and the various augmentations you add to them. [Tool calling](/oss/python/langchain/tools), [structured outputs](/oss/python/langchain/structured-output), and [short term memory](/oss/python/langchain/short-term-memory) are a few options for tailoring LLMs to your needs.

<img src="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=7ea9656f46649b3ebac19e8309ae9006" alt="LLM augmentations" data-og-width="1152" width="1152" data-og-height="778" height="778" data-path="oss/images/augmented_llm.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=280&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=53613048c1b8bd3241bd27900a872ead 280w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=560&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=7ba1f4427fd847bd410541ae38d66d40 560w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=840&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=503822cf29a28500deb56f463b4244e4 840w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=1100&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=279e0440278d3a26b73c72695636272e 1100w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=1650&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=d936838b98bc9dce25168e2b2cfd23d0 1650w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/augmented_llm.png?w=2500&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=fa2115f972bc1152b5e03ae590600fa3 2500w" />
```

---

## Workspace vs. private agents

**URL:** llms-txt#workspace-vs.-private-agents

**Contents:**
- Differences
- What's public vs. private
  - Threads/chat history
  - System prompt, tools, sub-agents
  - Triggers

Source: https://docs.langchain.com/langsmith/agent-builder-workspace-vs-private

Understand visibility, auth, and secrets for personal and workspace agents in Agent Builder.

Agent Builder supports two visibility modes:

* Private agents: private to the creator. Useful for personal workflows and experiments.
* Workspace agents: shared within the workspace. Good for team workflows, or agents you want to share with others.

* Ownership and access: private agents are only visible to you; workspace agents are visible to anyone else within the same LangSmith workspace.
* Tool Authentication:
  * **OAuth**: Both modes support OAuth and secret-based tools. OAuth credentials are always scoped to a user, so workspace agents can not share OAuth tokens, and new users cloning workspace agents must re-authenticate with the selected tools.
  * **Secrets**: Since secrets are scoped to a workspace, workspace agents & private agents will both use the same LangSmith secret.

## What's public vs. private

### Threads/chat history

Threads are always user scoped, so even if an agent is workspace scoped, the chat history created within that agent will always be private, and only accessible to the specific user who created them.

### System prompt, tools, sub-agents

The system prompt, selected tools, and sub-agents will be public on workspace scoped agents. Users will not be able to modify these fields on the original workspace scoped agent, but can make changes once they've cloned the agent.

The trigger type on workspace scoped agents is public (e.g., Slack message received), but the specific connection with the trigger (e.g. the Slack channel, or Gmail address) is not shared. This way, users know what trigger to use when cloning an agent, but can't gain unauthorized access to any connections the original user has set up.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/agent-builder-workspace-vs-private.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Wrap it in a CompiledSubAgent

**URL:** llms-txt#wrap-it-in-a-compiledsubagent

weather_subagent = CompiledSubAgent(
    name="weather",
    description="This subagent can get weather in cities.",
    runnable=weather_graph
)

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    middleware=[
        SubAgentMiddleware(
            default_model="claude-sonnet-4-5-20250929",
            default_tools=[],
            subagents=[weather_subagent],
        )
    ],
)
```

In addition to any user-defined subagents, the main agent has access to a `general-purpose` subagent at all times. This subagent has the same instructions as the main agent and all the tools it has access to. The primary purpose of the `general-purpose` subagent is context isolation—the main agent can delegate a complex task to this subagent and get a concise answer back without bloat from intermediate tool calls.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/middleware.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## You can customize it if building a custom agent

**URL:** llms-txt#you-can-customize-it-if-building-a-custom-agent

**Contents:**
  - Short-term vs. long-term filesystem
- Subagent middleware

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    middleware=[
        FilesystemMiddleware(
            backend=None,  # Optional: custom backend (defaults to StateBackend)
            system_prompt="Write to the filesystem when...",  # Optional custom addition to the system prompt
            custom_tool_descriptions={
                "ls": "Use the ls tool when...",
                "read_file": "Use the read_file tool to..."
            }  # Optional: Custom descriptions for filesystem tools
        ),
    ],
)
python  theme={null}
from langchain.agents import create_agent
from deepagents.middleware import FilesystemMiddleware
from deepagents.backends import CompositeBackend, StateBackend, StoreBackend
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    store=store,
    middleware=[
        FilesystemMiddleware(
            backend=lambda rt: CompositeBackend(
                default=StateBackend(rt),
                routes={"/memories/": StoreBackend(rt)}
            ),
            custom_tool_descriptions={
                "ls": "Use the ls tool when...",
                "read_file": "Use the read_file tool to..."
            }  # Optional: Custom descriptions for filesystem tools
        ),
    ],
)
python  theme={null}
from langchain.tools import tool
from langchain.agents import create_agent
from deepagents.middleware.subagents import SubAgentMiddleware

@tool
def get_weather(city: str) -> str:
    """Get the weather in a city."""
    return f"The weather in {city} is sunny."

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    middleware=[
        SubAgentMiddleware(
            default_model="claude-sonnet-4-5-20250929",
            default_tools=[],
            subagents=[
                {
                    "name": "weather",
                    "description": "This subagent can get weather in cities.",
                    "system_prompt": "Use the get_weather tool to get the weather in a city.",
                    "tools": [get_weather],
                    "model": "gpt-4o",
                    "middleware": [],
                }
            ],
        )
    ],
)
python  theme={null}
from langchain.agents import create_agent
from deepagents.middleware.subagents import SubAgentMiddleware
from deepagents import CompiledSubAgent
from langgraph.graph import StateGraph

**Examples:**

Example 1 (unknown):
```unknown
### Short-term vs. long-term filesystem

By default, these tools write to a local "filesystem" in your graph state. To enable persistent storage across threads, configure a `CompositeBackend` that routes specific paths (like `/memories/`) to a `StoreBackend`.
```

Example 2 (unknown):
```unknown
When you configure a `CompositeBackend` with a `StoreBackend` for `/memories/`, any files prefixed with **/memories/** are saved to persistent storage and survive across different threads. Files without this prefix remain in ephemeral state storage.

## Subagent middleware

Handing off tasks to subagents isolates context, keeping the main (supervisor) agent's context window clean while still going deep on a task.

The subagents middleware allows you to supply subagents through a `task` tool.
```

Example 3 (unknown):
```unknown
A subagent is defined with a **name**, **description**, **system prompt**, and **tools**. You can also provide a subagent with a custom **model**, or with additional **middleware**. This can be particularly useful when you want to give the subagent an additional state key to share with the main agent.

For more complex use cases, you can also provide your own pre-built LangGraph graph as a subagent.
```

---

## ❌ Bad: Too many tools

**URL:** llms-txt#❌-bad:-too-many-tools

**Contents:**
  - Choose models by task
  - Return concise results
- Common patterns
  - Multiple specialized subagents
- Troubleshooting
  - Subagent not being called
  - Context still getting bloated
  - Wrong subagent being selected

email_agent = {
    "name": "email-sender",
    "tools": [send_email, web_search, database_query, file_upload],  # Unfocused
}
python  theme={null}
subagents = [
    {
        "name": "contract-reviewer",
        "description": "Reviews legal documents and contracts",
        "system_prompt": "You are an expert legal reviewer...",
        "tools": [read_document, analyze_contract],
        "model": "claude-sonnet-4-5-20250929",  # Large context for long documents
    },
    {
        "name": "financial-analyst",
        "description": "Analyzes financial data and market trends",
        "system_prompt": "You are an expert financial analyst...",
        "tools": [get_stock_price, analyze_fundamentals],
        "model": "openai:gpt-5",  # Better for numerical analysis
    },
]
python  theme={null}
data_analyst = {
    "system_prompt": """Analyze the data and return:
    1. Key insights (3-5 bullet points)
    2. Overall confidence score
    3. Recommended next actions

Do NOT include:
    - Raw data
    - Intermediate calculations
    - Detailed tool outputs

Keep response under 300 words."""
}
python  theme={null}
from deepagents import create_deep_agent

subagents = [
    {
        "name": "data-collector",
        "description": "Gathers raw data from various sources",
        "system_prompt": "Collect comprehensive data on the topic",
        "tools": [web_search, api_call, database_query],
    },
    {
        "name": "data-analyzer",
        "description": "Analyzes collected data for insights",
        "system_prompt": "Analyze data and extract key insights",
        "tools": [statistical_analysis],
    },
    {
        "name": "report-writer",
        "description": "Writes polished reports from analysis",
        "system_prompt": "Create professional reports from insights",
        "tools": [format_document],
    },
]

agent = create_deep_agent(
    model="claude-sonnet-4-5-20250929",
    system_prompt="You coordinate data analysis and reporting. Use subagents for specialized tasks.",
    subagents=subagents
)
python  theme={null}
   # ✅ Good
   {"name": "research-specialist", "description": "Conducts in-depth research on specific topics using web search. Use when you need detailed information that requires multiple searches."}

# ❌ Bad
   {"name": "helper", "description": "helps with stuff"}
   python  theme={null}
   agent = create_deep_agent(
       system_prompt="""...your instructions...

IMPORTANT: For complex tasks, delegate to your subagents using the task() tool.
       This keeps your context clean and improves results.""",
       subagents=[...]
   )
   python  theme={null}
   system_prompt="""...

IMPORTANT: Return only the essential summary.
   Do NOT include raw data, intermediate search results, or detailed tool outputs.
   Your response should be under 500 words."""
   python  theme={null}
   system_prompt="""When you gather large amounts of data:
   1. Save raw data to /data/raw_results.txt
   2. Process and analyze the data
   3. Return only the analysis summary

This keeps context clean."""
   python  theme={null}
subagents = [
    {
        "name": "quick-researcher",
        "description": "For simple, quick research questions that need 1-2 searches. Use when you need basic facts or definitions.",
    },
    {
        "name": "deep-researcher",
        "description": "For complex, in-depth research requiring multiple searches, synthesis, and analysis. Use for comprehensive reports.",
    }
]
```

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/subagents.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
### Choose models by task

Different models excel at different tasks:
```

Example 2 (unknown):
```unknown
### Return concise results

Instruct subagents to return summaries, not raw data:
```

Example 3 (unknown):
```unknown
## Common patterns

### Multiple specialized subagents

Create specialized subagents for different domains:
```

Example 4 (unknown):
```unknown
**Workflow:**

1. Main agent creates high-level plan
2. Delegates data collection to data-collector
3. Passes results to data-analyzer
4. Sends insights to report-writer
5. Compiles final output

Each subagent works with clean context focused only on its task.

## Troubleshooting

### Subagent not being called

**Problem**: Main agent tries to do work itself instead of delegating.

**Solutions**:

1. **Make descriptions more specific:**
```

---

## > User is John Smith.

**URL:** llms-txt#>-user-is-john-smith.

**Contents:**
  - Prompt
  - Before model
  - After model

python  theme={null}
from langchain.tools import tool, ToolRuntime
from langchain_core.runnables import RunnableConfig
from langchain.messages import ToolMessage
from langchain.agents import create_agent, AgentState
from langgraph.types import Command
from pydantic import BaseModel

class CustomState(AgentState):  # [!code highlight]
    user_name: str

class CustomContext(BaseModel):
    user_id: str

@tool
def update_user_info(
    runtime: ToolRuntime[CustomContext, CustomState],
) -> Command:
    """Look up and update user info."""
    user_id = runtime.context.user_id
    name = "John Smith" if user_id == "user_123" else "Unknown user"
    return Command(update={  # [!code highlight]
        "user_name": name,
        # update the message history
        "messages": [
            ToolMessage(
                "Successfully looked up user information",
                tool_call_id=runtime.tool_call_id
            )
        ]
    })

@tool
def greet(
    runtime: ToolRuntime[CustomContext, CustomState]
) -> str | Command:
    """Use this to greet the user once you found their info."""
    user_name = runtime.state.get("user_name", None)
    if user_name is None:
       return Command(update={
            "messages": [
                ToolMessage(
                    "Please call the 'update_user_info' tool it will get and update the user's name.",
                    tool_call_id=runtime.tool_call_id
                )
            ]
        })
    return f"Hello {user_name}!"

agent = create_agent(
    model="gpt-5-nano",
    tools=[update_user_info, greet],
    state_schema=CustomState, # [!code highlight]
    context_schema=CustomContext,
)

agent.invoke(
    {"messages": [{"role": "user", "content": "greet the user"}]},
    context=CustomContext(user_id="user_123"),
)
python  theme={null}
from langchain.agents import create_agent
from typing import TypedDict
from langchain.agents.middleware import dynamic_prompt, ModelRequest

class CustomContext(TypedDict):
    user_name: str

def get_weather(city: str) -> str:
    """Get the weather in a city."""
    return f"The weather in {city} is always sunny!"

@dynamic_prompt
def dynamic_system_prompt(request: ModelRequest) -> str:
    user_name = request.runtime.context["user_name"]
    system_prompt = f"You are a helpful assistant. Address the user as {user_name}."
    return system_prompt

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
    middleware=[dynamic_system_prompt],
    context_schema=CustomContext,
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What is the weather in SF?"}]},
    context=CustomContext(user_name="John Smith"),
)
for msg in result["messages"]:
    msg.pretty_print()

shell title="Output" theme={null}
================================ Human Message =================================

What is the weather in SF?
================================== Ai Message ==================================
Tool Calls:
  get_weather (call_WFQlOGn4b2yoJrv7cih342FG)
 Call ID: call_WFQlOGn4b2yoJrv7cih342FG
  Args:
    city: San Francisco
================================= Tool Message =================================
Name: get_weather

The weather in San Francisco is always sunny!
================================== Ai Message ==================================

Hi John Smith, the weather in San Francisco is always sunny!
mermaid  theme={null}
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["\_\_start\_\_"])
    PRE(before_model)
    MODEL(model)
    TOOLS(tools)
    END(["\_\_end\_\_"])
    S --> PRE
    PRE --> MODEL
    MODEL -.-> TOOLS
    MODEL -.-> END
    TOOLS --> PRE
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
python  theme={null}
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langchain_core.runnables import RunnableConfig
from langgraph.runtime import Runtime
from typing import Any

@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """Keep only the last few messages to fit context window."""
    messages = state["messages"]

if len(messages) <= 3:
        return None  # No changes needed

first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }

agent = create_agent(
    "gpt-5-nano",
    tools=[],
    middleware=[trim_messages],
    checkpointer=InMemorySaver()
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

agent.invoke({"messages": "hi, my name is bob"}, config)
agent.invoke({"messages": "write a short poem about cats"}, config)
agent.invoke({"messages": "now do the same but for dogs"}, config)
final_response = agent.invoke({"messages": "what's my name?"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

Your name is Bob. You told me that earlier.
If you'd like me to call you a nickname or use a different name, just say the word.
"""
mermaid  theme={null}
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["\_\_start\_\_"])
    MODEL(model)
    POST(after_model)
    TOOLS(tools)
    END(["\_\_end\_\_"])
    S --> MODEL
    MODEL --> POST
    POST -.-> END
    POST -.-> TOOLS
    TOOLS --> MODEL
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
    class POST greenHighlight;
python  theme={null}
from langchain.messages import RemoveMessage
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import after_model
from langgraph.runtime import Runtime

@after_model
def validate_response(state: AgentState, runtime: Runtime) -> dict | None:
    """Remove messages containing sensitive words."""
    STOP_WORDS = ["password", "secret"]
    last_message = state["messages"][-1]
    if any(word in last_message.content for word in STOP_WORDS):
        return {"messages": [RemoveMessage(id=last_message.id)]}
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[],
    middleware=[validate_response],
    checkpointer=InMemorySaver(),
)
```

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/short-term-memory.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
#### Write short-term memory from tools

To modify the agent's short-term memory (state) during execution, you can return state updates directly from the tools.

This is useful for persisting intermediate results or making information accessible to subsequent tools or prompts.
```

Example 2 (unknown):
```unknown
### Prompt

Access short term memory (state) in middleware to create dynamic prompts based on conversation history or custom state fields.
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
### Before model

Access short term memory (state) in [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model) middleware to process messages before model calls.
```

---
