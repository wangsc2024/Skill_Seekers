# Autogen - Getting Started

**Pages:** 16

---

## AgentChat — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/index.html

**Contents:**
- AgentChat#

AgentChat is a high-level API for building multi-agent applications. It is built on top of the autogen-core package. For beginner users, AgentChat is the recommended starting point. For advanced users, autogen-core’s event-driven programming model provides more flexibility and control over the underlying components.

AgentChat provides intuitive defaults, such as Agents with preset behaviors and Teams with predefined multi-agent design patterns.

How to install AgentChat

Build your first agent

Step-by-step guide to using AgentChat, learn about agents, teams, and more

Create your own agents with custom behaviors

Multi-agent coordination through a shared context and centralized, customizable selector

Multi-agent coordination through a shared context and localized, tool-based selector

Get started with Magentic-One

Multi-agent workflows through a directed graph of agents.

Add memory capabilities to your agents

Log traces and internal messages

Serialize and deserialize components

Sample code and use cases

How to migrate from AutoGen 0.2.x to 0.4.x.

---

## API Reference — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/reference/index.html

**Contents:**
- API Reference#

---

## AutoGen — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/index.html

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

## AutoGen Studio — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/autogenstudio-user-guide/index.html

**Contents:**
- AutoGen Studio#
- Capabilities - What Can You Do with AutoGen Studio?#
  - Roadmap#
- Contribution Guide#
- A Note on Security#
- Acknowledgements and Citation#
- Next Steps#

AutoGen Studio is a low-code interface built to help you rapidly prototype AI agents, enhance them with tools, compose them into teams and interact with them to accomplish tasks. It is built on AutoGen AgentChat - a high-level API for building multi-agent applications.

See a video tutorial on AutoGen Studio v0.4 (02/25) - https://youtu.be/oum6EI7wohM

Code for AutoGen Studio is on GitHub at microsoft/autogen

AutoGen Studio is meant to help you rapidly prototype multi-agent workflows and demonstrate an example of end user interfaces built with AutoGen. It is not meant to be a production-ready app. Developers are encouraged to use the AutoGen framework to build their own applications, implementing authentication, security and other features required for deployed applications.

AutoGen Studio offers four main interfaces to help you build and manage multi-agent systems:

A visual interface for creating agent teams through declarative specification (JSON) or drag-and-drop

Supports configuration of all core components: teams, agents, tools, models, and termination conditions

Fully compatible with AgentChat’s component definitions

Interactive environment for testing and running agent teams

Live message streaming between agents

Visual representation of message flow through a control transition graph

Interactive sessions with teams using UserProxyAgent

Full run control with the ability to pause or stop execution

Central hub for discovering and importing community-created components

Enables easy integration of third-party components

Export and run teams in python code

Setup and test endpoints based on a team configuration

Run teams in a docker container

Review project roadmap and issues here .

We welcome contributions to AutoGen Studio. We recommend the following general steps to contribute to the project:

Review the overall AutoGen project contribution guide

Please review the AutoGen Studio roadmap to get a sense of the current priorities for the project. Help is appreciated especially with Studio issues tagged with help-wanted

Please use the tag proj-studio tag for any issues, questions, and PRs related to Studio

Please initiate a discussion on the roadmap issue or a new issue to discuss your proposed contribution.

Submit a pull request with your contribution!

If you are modifying AutoGen Studio, it has its own devcontainer. See instructions in .devcontainer/README.md to use it

AutoGen Studio is a research prototype and is not meant to be used in a production environment. Some baseline practices are encouraged e.g., using Docker code execution environment for your agents.

However, other considerations such as rigorous tests related to jailbreaking, ensuring LLMs only have access to the right keys of data given the end user’s permissions, and other security features are not implemented in AutoGen Studio.

If you are building a production application, please use the AutoGen framework and implement the necessary security features.

AutoGen Studio is based on the AutoGen project. It was adapted from a research prototype built in October 2023 (original credits: Victor Dibia, Gagan Bansal, Adam Fourney, Piali Choudhury, Saleema Amershi, Ahmed Awadallah, Chi Wang).

If you use AutoGen Studio in your research, please cite the following paper:

To begin, follow the installation instructions to install AutoGen Studio.

Azure AI Foundry Agent

**Examples:**

Example 1 (python):
```python
@inproceedings{autogenstudio,
  title={AUTOGEN STUDIO: A No-Code Developer Tool for Building and Debugging Multi-Agent Systems},
  author={Dibia, Victor and Chen, Jingya and Bansal, Gagan and Syed, Suff and Fourney, Adam and Zhu, Erkang and Wang, Chi and Amershi, Saleema},
  booktitle={Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing: System Demonstrations},
  pages={72--79},
  year={2024}
}
```

Example 2 (python):
```python
@inproceedings{autogenstudio,
  title={AUTOGEN STUDIO: A No-Code Developer Tool for Building and Debugging Multi-Agent Systems},
  author={Dibia, Victor and Chen, Jingya and Bansal, Gagan and Syed, Suff and Fourney, Adam and Zhu, Erkang and Wang, Chi and Amershi, Saleema},
  booktitle={Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing: System Demonstrations},
  pages={72--79},
  year={2024}
}
```

---

## Cookbook — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/index.html

**Contents:**
- Cookbook#
- List of recipes#

This section contains a collection of recipes that demonstrate how to use the Core API features.

Azure OpenAI with AAD Auth

---

## Core — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/index.html

**Contents:**
- Core#

AutoGen core offers an easy way to quickly build event-driven, distributed, scalable, resilient AI agent systems. Agents are developed by using the Actor model. You can build and run your agent system locally and easily move to a distributed system in the cloud when you are ready.

Key features of AutoGen core include:

Asynchronous Messaging

Agents communicate through asynchronous messages, enabling event-driven and request/response communication models.

Scalable & Distributed

Enable complex scenarios with networks of agents across organizational boundaries.

Multi-Language Support

Python & Dotnet interoperating agents today, with more languages coming soon.

Highly customizable with features like custom agents, memory as a service, tools registry, and model library.

Observable & Debuggable

Easily trace and debug your agent systems.

Event-Driven Architecture

Build event-driven, distributed, scalable, and resilient AI agent systems.

---

## Examples — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/examples/index.html

**Contents:**
- Examples#

A list of examples to help you get started with AgentChat.

Generating a travel plan using multiple agents.

Generating a company research report using multiple agents with tools.

Generating a literature review using agents with tools.

Tracing and Observability

---

## Extensions — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/extensions-user-guide/index.html

**Contents:**
- Extensions#

AutoGen is designed to be extensible. The autogen-ext package contains the built-in component implementations maintained by the AutoGen project.

Examples of components include:

autogen_ext.agents.* for agent implementations like MultimodalWebSurfer

autogen_ext.models.* for model clients like OpenAIChatCompletionClient and SKChatCompletionAdapter for connecting to hosted and local models.

autogen_ext.tools.* for tools like GraphRAG LocalSearchTool and mcp_server_tools().

autogen_ext.executors.* for executors like DockerCommandLineCodeExecutor and ACADynamicSessionsCodeExecutor

autogen_ext.runtimes.* for agent runtimes like GrpcWorkerAgentRuntime

See API Reference for the full list of components and their APIs.

We strongly encourage developers to build their own components and publish them as part of the ecosytem.

Discover community extensions and samples

Create your own extension

---

## Installation — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/autogenstudio-user-guide/installation.html

**Contents:**
- Installation#
- Create a Virtual Environment (Recommended)#
- Install from PyPi (Recommended)#
- Install from source#
  - A) Install from source manually#
  - B) Install from source using a dev container#
- Running the Application#

There are two ways to install AutoGen Studio - from PyPi or from source. We recommend installing from PyPi unless you plan to modify the source code.

We recommend using a virtual environment as this will ensure that the dependencies for AutoGen Studio are isolated from the rest of your system.

Windows command-line:

To deactivate later, run:

Install Conda if you have not already.

To deactivate later, run:

You can install AutoGen Studio using pip, the Python package manager.

Note: This approach requires some familiarity with building interfaces in React.

You have two options for installing from source: manually or using a dev container.

Ensure you have Python 3.10+ and Node.js (version above 14.15.0) installed.

Clone the AutoGen Studio repository.

Navigate to the python/packages/autogen-studio and install its Python dependencies using pip install -e .

Navigate to the python/packages/autogen-studio/frontend directory, install the dependencies, and build the UI:

Follow the Dev Containers tutorial to install VS Code, Docker and relevant extensions.

Clone the AutoGen Studio repository.

Open python/packages/autogen-studio/in VS Code. Click the blue button in bottom the corner or press F1 and select “Dev Containers: Reopen in Container”.

Once installed, run the web UI by entering the following in your terminal:

This command will start the application on the specified port. Open your web browser and go to http://localhost:8081/ to use AutoGen Studio.

AutoGen Studio also takes several parameters to customize the application:

--host <host> argument to specify the host address. By default, it is set to localhost.

--appdir <appdir> argument to specify the directory where the app files (e.g., database and generated user files) are stored. By default, it is set to the .autogenstudio directory in the user’s home directory.

--port <port> argument to specify the port number. By default, it is set to 8080.

--reload argument to enable auto-reloading of the server when changes are made to the code. By default, it is set to False.

--database-uri argument to specify the database URI. Example values include sqlite:///database.sqlite for SQLite and postgresql+psycopg://user:password@localhost/dbname for PostgreSQL. If this is not specified, the database URL defaults to a database.sqlite file in the --appdir directory.

--upgrade-database argument to upgrade the database schema to the latest version. By default, it is set to False.

Now that you have AutoGen Studio installed and running, you are ready to explore its capabilities, including defining and modifying agent workflows, interacting with agents and sessions, and expanding agent skills.

**Examples:**

Example 1 (unknown):
```unknown
python3 -m venv .venv
source .venv/bin/activate
```

Example 2 (unknown):
```unknown
python3 -m venv .venv
source .venv/bin/activate
```

Example 3 (unknown):
```unknown
python3 -m venv .venv
.venv\Scripts\activate.bat
```

Example 4 (unknown):
```unknown
python3 -m venv .venv
.venv\Scripts\activate.bat
```

---

## Installation — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/installation.html

**Contents:**
- Installation#
- Create a Virtual Environment (optional)#
- Install using pip#
- Install OpenAI for Model Client#
- Install Docker for Code Execution (Optional)#

When installing AgentChat locally, we recommend using a virtual environment for the installation. This will ensure that the dependencies for AgentChat are isolated from the rest of your system.

Windows command-line:

To deactivate later, run:

Install Conda if you have not already.

To deactivate later, run:

Install the autogen-core package using pip:

Python 3.10 or later is required.

To use the OpenAI and Azure OpenAI models, you need to install the following extensions:

If you are using Azure OpenAI with AAD authentication, you need to install the following:

We recommend using Docker to use DockerCommandLineCodeExecutor for execution of model-generated code. To install Docker, follow the instructions for your operating system on the Docker website.

To learn more code execution, see Command Line Code Executors and Code Execution.

**Examples:**

Example 1 (unknown):
```unknown
python3 -m venv .venv
source .venv/bin/activate
```

Example 2 (unknown):
```unknown
python3 -m venv .venv
source .venv/bin/activate
```

Example 3 (unknown):
```unknown
python3 -m venv .venv
.venv\Scripts\activate.bat
```

Example 4 (unknown):
```unknown
python3 -m venv .venv
.venv\Scripts\activate.bat
```

---

## Installation — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/installation.html

**Contents:**
- Installation#
- Create a Virtual Environment (optional)#
- Install Using pip#
- Install OpenAI for Model Client#

When installing AgentChat locally, we recommend using a virtual environment for the installation. This will ensure that the dependencies for AgentChat are isolated from the rest of your system.

Windows command-line:

To deactivate later, run:

Install Conda if you have not already.

To deactivate later, run:

Install the autogen-agentchat package using pip:

Python 3.10 or later is required.

To use the OpenAI and Azure OpenAI models, you need to install the following extensions:

If you are using Azure OpenAI with AAD authentication, you need to install the following:

**Examples:**

Example 1 (unknown):
```unknown
python3 -m venv .venv
source .venv/bin/activate
```

Example 2 (unknown):
```unknown
python3 -m venv .venv
source .venv/bin/activate
```

Example 3 (markdown):
```markdown
# The command may be `python3` instead of `python` depending on your setup
python -m venv .venv
.venv\Scripts\activate.bat
```

Example 4 (markdown):
```markdown
# The command may be `python3` instead of `python` depending on your setup
python -m venv .venv
.venv\Scripts\activate.bat
```

---

## Installation — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/extensions-user-guide/installation.html

**Contents:**
- Installation#

First-part maintained extensions are available in the autogen-ext package.

langchain needed for LangChainToolAdapter

azure needed for ACADynamicSessionsCodeExecutor

docker needed for DockerCommandLineCodeExecutor

openai needed for OpenAIChatCompletionClient

Discover community projects

**Examples:**

Example 1 (unknown):
```unknown
pip install "autogen-ext"
```

Example 2 (unknown):
```unknown
pip install "autogen-ext"
```

---

## Introduction — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/index.html

**Contents:**
- Introduction#

This tutorial provides a step-by-step guide to using AgentChat. Make sure you have first followed the installation instructions to prepare your environment.

At any point you are stuck, feel free to ask for help on GitHub Discussions or Discord.

If you are coming from AutoGen v0.2, please read the migration guide.

How to use LLM model clients

Understand the message types

Work with AgentChat agents and get started with AssistantAgent

Work with teams of agents and get started with RoundRobinGroupChat.

Best practices for providing feedback to a team

Control a team using termination conditions

Create your own agents

Save and load agents and teams for persistent sessions

Migration Guide for v0.2 to v0.4

---

## Quickstart — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/quickstart.html

**Contents:**
- Quickstart#
- What’s Next?#

Via AgentChat, you can build applications quickly using preset agents. To illustrate this, we will begin with creating a single agent that can use tools.

First, we need to install the AgentChat and Extension packages.

This example uses an OpenAI model, however, you can use other models as well. Simply update the model_client with the desired model or model client class.

To use Azure OpenAI models and AAD authentication, you can follow the instructions here. To use other models, see Models.

Now that you have a basic understanding of how to use a single agent, consider following the tutorial for a walkthrough on other features of AgentChat.

Migration Guide for v0.2 to v0.4

**Examples:**

Example 1 (unknown):
```unknown
pip install -U "autogen-agentchat" "autogen-ext[openai,azure]"
```

Example 2 (unknown):
```unknown
pip install -U "autogen-agentchat" "autogen-ext[openai,azure]"
```

Example 3 (python):
```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Define a model client. You can use other model client that implements
# the `ChatCompletionClient` interface.
model_client = OpenAIChatCompletionClient(
    model="gpt-4o",
    # api_key="YOUR_API_KEY",
)


# Define a simple function tool that the agent can use.
# For this example, we use a fake weather tool for demonstration purposes.
async def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is 73 degrees and Sunny."


# Define an AssistantAgent with the model, tool, system message, and reflection enabled.
# The system message instructs the agent via natural language.
agent = AssistantAgent(
    name="weather_agent",
    model_client=model_client,
    tools=[get_weather],
    system_message="You are a helpful assistant.",
    reflect_on_tool_use=True,
    model_client_stream=True,  # Enable streaming tokens from the model client.
)


# Run the agent and stream the messages to the console.
async def main() -> None:
    await Console(agent.run_stream(task="What is the weather in New York?"))
    # Close the connection to the model client.
    await model_client.close()


# NOTE: if running this inside a Python script you'll need to use asyncio.run(main()).
await main()
```

Example 4 (python):
```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Define a model client. You can use other model client that implements
# the `ChatCompletionClient` interface.
model_client = OpenAIChatCompletionClient(
    model="gpt-4o",
    # api_key="YOUR_API_KEY",
)


# Define a simple function tool that the agent can use.
# For this example, we use a fake weather tool for demonstration purposes.
async def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is 73 degrees and Sunny."


# Define an AssistantAgent with the model, tool, system message, and reflection enabled.
# The system message instructs the agent via natural language.
agent = AssistantAgent(
    name="weather_agent",
    model_client=model_client,
    tools=[get_weather],
    system_message="You are a helpful assistant.",
    reflect_on_tool_use=True,
    model_client_stream=True,  # Enable streaming tokens from the model client.
)


# Run the agent and stream the messages to the console.
async def main() -> None:
    await Console(agent.run_stream(task="What is the weather in New York?"))
    # Close the connection to the model client.
    await model_client.close()


# NOTE: if running this inside a Python script you'll need to use asyncio.run(main()).
await main()
```

---

## Quick Start — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/quickstart.html

**Contents:**
- Quick Start#

See here for installation instructions.

Before diving into the core APIs, let’s start with a simple example of two agents that count down from 10 to 1.

We first define the agent classes and their respective procedures for handling messages. We create two agent classes: Modifier and Checker. The Modifier agent modifies a number that is given and the Check agent checks the value against a condition. We also create a Message data class, which defines the messages that are passed between the agents.

You might have already noticed, the agents’ logic, whether it is using model or code executor, is completely decoupled from how messages are delivered. This is the core idea: the framework provides a communication infrastructure, and the agents are responsible for their own logic. We call the communication infrastructure an Agent Runtime.

Agent runtime is a key concept of this framework. Besides delivering messages, it also manages agents’ lifecycle. So the creation of agents are handled by the runtime.

The following code shows how to register and run the agents using SingleThreadedAgentRuntime, a local embedded agent runtime implementation.

If you are using VSCode or other Editor remember to import asyncio and wrap the code with async def main() -> None: and run the code with asyncio.run(main()) function.

From the agent’s output, we can see the value was successfully decremented from 10 to 1 as the modifier and checker conditions dictate.

AutoGen also supports a distributed agent runtime, which can host agents running on different processes or machines, with different identities, languages and dependencies.

To learn how to use agent runtime, communication, message handling, and subscription, please continue reading the sections following this quick start.

Agent and Multi-Agent Applications

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass
from typing import Callable

from autogen_core import DefaultTopicId, MessageContext, RoutedAgent, default_subscription, message_handler


@dataclass
class Message:
    content: int


@default_subscription
class Modifier(RoutedAgent):
    def __init__(self, modify_val: Callable[[int], int]) -> None:
        super().__init__("A modifier agent.")
        self._modify_val = modify_val

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        val = self._modify_val(message.content)
        print(f"{'-'*80}\nModifier:\nModified {message.content} to {val}")
        await self.publish_message(Message(content=val), DefaultTopicId())  # type: ignore


@default_subscription
class Checker(RoutedAgent):
    def __init__(self, run_until: Callable[[int], bool]) -> None:
        super().__init__("A checker agent.")
        self._run_until = run_until

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        if not self._run_until(message.content):
            print(f"{'-'*80}\nChecker:\n{message.content} passed the check, continue.")
            await self.publish_message(Message(content=message.content), DefaultTopicId())
        else:
            print(f"{'-'*80}\nChecker:\n{message.content} failed the check, stopping.")
```

Example 2 (python):
```python
from dataclasses import dataclass
from typing import Callable

from autogen_core import DefaultTopicId, MessageContext, RoutedAgent, default_subscription, message_handler


@dataclass
class Message:
    content: int


@default_subscription
class Modifier(RoutedAgent):
    def __init__(self, modify_val: Callable[[int], int]) -> None:
        super().__init__("A modifier agent.")
        self._modify_val = modify_val

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        val = self._modify_val(message.content)
        print(f"{'-'*80}\nModifier:\nModified {message.content} to {val}")
        await self.publish_message(Message(content=val), DefaultTopicId())  # type: ignore


@default_subscription
class Checker(RoutedAgent):
    def __init__(self, run_until: Callable[[int], bool]) -> None:
        super().__init__("A checker agent.")
        self._run_until = run_until

    @message_handler
    async def handle_message(self, message: Message, ctx: MessageContext) -> None:
        if not self._run_until(message.content):
            print(f"{'-'*80}\nChecker:\n{message.content} passed the check, continue.")
            await self.publish_message(Message(content=message.content), DefaultTopicId())
        else:
            print(f"{'-'*80}\nChecker:\n{message.content} failed the check, stopping.")
```

Example 3 (python):
```python
from autogen_core import AgentId, SingleThreadedAgentRuntime

# Create a local embedded runtime.
runtime = SingleThreadedAgentRuntime()

# Register the modifier and checker agents by providing
# their agent types, the factory functions for creating instance and subscriptions.
await Modifier.register(
    runtime,
    "modifier",
    # Modify the value by subtracting 1
    lambda: Modifier(modify_val=lambda x: x - 1),
)

await Checker.register(
    runtime,
    "checker",
    # Run until the value is less than or equal to 1
    lambda: Checker(run_until=lambda x: x <= 1),
)

# Start the runtime and send a direct message to the checker.
runtime.start()
await runtime.send_message(Message(10), AgentId("checker", "default"))
await runtime.stop_when_idle()
```

Example 4 (python):
```python
from autogen_core import AgentId, SingleThreadedAgentRuntime

# Create a local embedded runtime.
runtime = SingleThreadedAgentRuntime()

# Register the modifier and checker agents by providing
# their agent types, the factory functions for creating instance and subscriptions.
await Modifier.register(
    runtime,
    "modifier",
    # Modify the value by subtracting 1
    lambda: Modifier(modify_val=lambda x: x - 1),
)

await Checker.register(
    runtime,
    "checker",
    # Run until the value is less than or equal to 1
    lambda: Checker(run_until=lambda x: x <= 1),
)

# Start the runtime and send a direct message to the checker.
runtime.start()
await runtime.send_message(Message(10), AgentId("checker", "default"))
await runtime.stop_when_idle()
```

---

## Using LlamaIndex-Backed Agent — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/llamaindex-agent.html

**Contents:**
- Using LlamaIndex-Backed Agent#

This example demonstrates how to create an AI agent using LlamaIndex.

First install the dependencies:

Let’s import the modules.

Define our message type that will be used to communicate with the agent.

Define the agent using LLamaIndex’s API.

Setting up LlamaIndex.

Now let’s test the agent. First we need to create an agent runtime and register the agent, by providing the agent’s name and a factory function that will create the agent.

Start the agent runtime.

Send a direct message to the agent, and print the response.

Stop the agent runtime.

Using LangGraph-Backed Agent

Local LLMs with LiteLLM & Ollama

**Examples:**

Example 1 (markdown):
```markdown
# pip install "llama-index-readers-web" "llama-index-readers-wikipedia" "llama-index-tools-wikipedia" "llama-index-embeddings-azure-openai" "llama-index-llms-azure-openai" "llama-index" "azure-identity"
```

Example 2 (markdown):
```markdown
# pip install "llama-index-readers-web" "llama-index-readers-wikipedia" "llama-index-tools-wikipedia" "llama-index-embeddings-azure-openai" "llama-index-llms-azure-openai" "llama-index" "azure-identity"
```

Example 3 (python):
```python
import os
from typing import List, Optional

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from llama_index.core import Settings
from llama_index.core.agent import ReActAgent
from llama_index.core.agent.runner.base import AgentRunner
from llama_index.core.base.llms.types import (
    ChatMessage,
    MessageRole,
)
from llama_index.core.chat_engine.types import AgentChatResponse
from llama_index.core.memory import ChatSummaryMemoryBuffer
from llama_index.core.memory.types import BaseMemory
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.openai import OpenAI
from llama_index.tools.wikipedia import WikipediaToolSpec
from pydantic import BaseModel
```

Example 4 (python):
```python
import os
from typing import List, Optional

from autogen_core import AgentId, MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from llama_index.core import Settings
from llama_index.core.agent import ReActAgent
from llama_index.core.agent.runner.base import AgentRunner
from llama_index.core.base.llms.types import (
    ChatMessage,
    MessageRole,
)
from llama_index.core.chat_engine.types import AgentChatResponse
from llama_index.core.memory import ChatSummaryMemoryBuffer
from llama_index.core.memory.types import BaseMemory
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.openai import OpenAI
from llama_index.tools.wikipedia import WikipediaToolSpec
from pydantic import BaseModel
```

---
