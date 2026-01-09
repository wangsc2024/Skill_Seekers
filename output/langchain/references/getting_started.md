# Langchain - Getting Started

**Pages:** 33

---

## Assumes you've installed pydantic

**URL:** llms-txt#assumes-you've-installed-pydantic

from pydantic import BaseModel

---

## Context overview

**URL:** llms-txt#context-overview

**Contents:**
- Static runtime context
- Dynamic runtime context
- Dynamic cross-conversation context
- See also

Source: https://docs.langchain.com/oss/python/concepts/context

**Context engineering** is the practice of building dynamic systems that provide the right information and tools, in the right format, so that an AI application can accomplish a task. Context can be characterized along two key dimensions:

1. By **mutability**:

* **Static context**: Immutable data that doesn't change during execution (e.g., user metadata, database connections, tools)
* **Dynamic context**: Mutable data that evolves as the application runs (e.g., conversation history, intermediate results, tool call observations)

* **Runtime context**: Data scoped to a single run or invocation
* **Cross-conversation context**: Data that persists across multiple conversations or sessions

<Tip>
  Runtime context refers to local context: data and dependencies your code needs to run. It does **not** refer to:

* The LLM context, which is the data passed into the LLM's prompt.
  * The "context window", which is the maximum number of tokens that can be passed to the LLM.

Runtime context is a form of dependency injection and can be used to optimize the LLM context. It lets to provide dependencies (like database connections, user IDs, or API clients) to your tools and nodes at runtime rather than hardcoding them. For example, you can use user metadata in the runtime context to fetch user preferences and feed them into the context window.
</Tip>

LangGraph provides three ways to manage context, which combines the mutability and lifetime dimensions:

| Context type                                                                                | Description                                            | Mutability | Lifetime           | Access method                           |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------- | ------------------ | --------------------------------------- |
| [**Static runtime context**](#static-runtime-context)                                       | User metadata, tools, db connections passed at startup | Static     | Single run         | `context` argument to `invoke`/`stream` |
| [**Dynamic runtime context (state)**](#dynamic-runtime-context-state)                       | Mutable data that evolves during a single run          | Dynamic    | Single run         | LangGraph state object                  |
| [**Dynamic cross-conversation context (store)**](#dynamic-cross-conversation-context-store) | Persistent data shared across conversations            | Dynamic    | Cross-conversation | LangGraph store                         |

## Static runtime context

**Static runtime context** represents immutable data like user metadata, tools, and database connections that are passed to an application at the start of a run via the `context` argument to `invoke`/`stream`. This data does not change during execution.

<Tabs>
  <Tab title="Agent prompt">

See [Agents](/oss/python/langchain/agents) for details.
  </Tab>

<Tab title="Workflow node">

* See [the Graph API](/oss/python/langgraph/graph-api#add-runtime-configuration) for details.
  </Tab>

<Tab title="In a tool">

See the [tool calling guide](/oss/python/langchain/tools#configuration) for details.
  </Tab>
</Tabs>

<Tip>
  The `Runtime` object can be used to access static context and other utilities like the active store and stream writer.
  See the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) documentation for details.
</Tip>

## Dynamic runtime context

**Dynamic runtime context** represents mutable data that can evolve during a single run and is managed through the LangGraph state object. This includes conversation history, intermediate results, and values derived from tools or LLM outputs. In LangGraph, the state object acts as [short-term memory](/oss/python/concepts/memory) during a run.

<Tabs>
  <Tab title="In an agent">
    Example shows how to incorporate state into an agent **prompt**.

State can also be accessed by the agent's **tools**, which can read or update the state as needed. See [tool calling guide](/oss/python/langchain/tools#short-term-memory) for details.

<Tab title="In a workflow">
    
  </Tab>
</Tabs>

<Tip>
  **Turning on memory**
  Please see the [memory guide](/oss/python/langgraph/add-memory) for more details on how to enable memory. This is a powerful feature that allows you to persist the agent's state across multiple invocations. Otherwise, the state is scoped only to a single run.
</Tip>

## Dynamic cross-conversation context

**Dynamic cross-conversation context** represents persistent, mutable data that spans across multiple conversations or sessions and is managed through the LangGraph store. This includes user profiles, preferences, and historical interactions. The LangGraph store acts as [long-term memory](/oss/python/concepts/memory#long-term-memory) across multiple runs. This can be used to read or update persistent facts (e.g., user profiles, preferences, prior interactions).

* [Memory conceptual overview](/oss/python/concepts/memory)
* [Short-term memory in LangChain](/oss/python/langchain/short-term-memory)
* [Long-term memory in LangChain](/oss/python/langchain/long-term-memory)
* [Memory in LangGraph](/oss/python/langgraph/add-memory)

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/concepts/context.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
<Tabs>
  <Tab title="Agent prompt">
```

Example 2 (unknown):
```unknown
See [Agents](/oss/python/langchain/agents) for details.
  </Tab>

  <Tab title="Workflow node">
```

Example 3 (unknown):
```unknown
* See [the Graph API](/oss/python/langgraph/graph-api#add-runtime-configuration) for details.
  </Tab>

  <Tab title="In a tool">
```

Example 4 (unknown):
```unknown
See the [tool calling guide](/oss/python/langchain/tools#configuration) for details.
  </Tab>
</Tabs>

<Tip>
  The `Runtime` object can be used to access static context and other utilities like the active store and stream writer.
  See the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) documentation for details.
</Tip>

<a id="state" />

## Dynamic runtime context

**Dynamic runtime context** represents mutable data that can evolve during a single run and is managed through the LangGraph state object. This includes conversation history, intermediate results, and values derived from tools or LLM outputs. In LangGraph, the state object acts as [short-term memory](/oss/python/concepts/memory) during a run.

<Tabs>
  <Tab title="In an agent">
    Example shows how to incorporate state into an agent **prompt**.

    State can also be accessed by the agent's **tools**, which can read or update the state as needed. See [tool calling guide](/oss/python/langchain/tools#short-term-memory) for details.
```

---

## Create an Ingress for installations (Kubernetes)

**URL:** llms-txt#create-an-ingress-for-installations-(kubernetes)

**Contents:**
- Requirements
- Parameters
- Configuration
  - Option 1: Standard Ingress
  - Option 2: Gateway API
  - Option 3: Istio Gateway

Source: https://docs.langchain.com/langsmith/self-host-ingress

By default, LangSmith will provision a LoadBalancer service for the `langsmith-frontend`. Depending on your cloud provider, this may result in a public IP address being assigned to the service. If you would like to use a custom domain or have more control over the routing of traffic to your LangSmith installation, you can configure an Ingress, Gateway API, or Istio Gateway.

* An existing Kubernetes cluster
* One of the following installed in your Kubernetes cluster:
  * An Ingress Controller (for standard Ingress)
  * Gateway API CRDs and a Gateway resource (for Gateway API)
  * Istio (for Istio Gateway)

You may need to provide certain parameters to your LangSmith installation to configure the Ingress. Additionally, we will want to convert the `langsmith-frontend` service to a ClusterIP service.

* *Hostname (optional)*: The hostname that you would like to use for your LangSmith installation. E.g `"langsmith.example.com"`. If you leave this empty, the ingress will serve all traffic to the LangSmith installation.

* *BasePath (optional)*: If you would like to serve LangSmith under a URL basePath, you can specify it here. For example, adding `"langsmith"` will serve the application at `"example.hostname.com/langsmith"`. This will apply to UI paths as well as API endpoints.

* *IngressClassName (optional)*: The name of the Ingress class that you would like to use. If not set, the default Ingress class will be used.

* *Annotations (optional)*: Additional annotations to add to the Ingress. Certain providers like AWS may use annotations to control things like TLS termination.

For example, you can add the following annotations using the AWS ALB Ingress Controller to attach an ACM certificate to the Ingress:

* *Labels (optional)*: Additional labels to add to the Ingress.

* *TLS (optional)*: If you would like to serve LangSmith over HTTPS, you can add TLS configuration here (many Ingress controllers may have other ways of controlling TLS so this is often not needed). This should be an array of TLS configurations. Each TLS configuration should have the following fields:

* hosts: An array of hosts that the certificate should be valid for. E.g \["langsmith.example.com"]

* secretName: The name of the Kubernetes secret that contains the certificate and private key. This secret should have the following keys:

* tls.crt: The certificate
    * tls.key: The private key

* You can read more about creating a TLS secret [here](https://kubernetes.io/do/langsmith/observability-concepts/services-networking/ingress/#tls).

You can configure your LangSmith instance to use one of three routing options: standard Ingress, Gateway API, or Istio Gateway. Choose the option that best fits your infrastructure.

### Option 1: Standard Ingress

With these parameters in hand, you can configure your LangSmith instance to use an Ingress. You can do this by modifying the `config.yaml` file for your LangSmith Helm Chart installation.

Once configured, you will need to update your LangSmith installation. If everything is configured correctly, your LangSmith instance should now be accessible via the Ingress. You can run the following to check the status of your Ingress:

You should see something like this in the output:

<Warning>
  If you do not have automated DNS setup, you will need to add the IP address to your DNS provider manually.
</Warning>

### Option 2: Gateway API

<Note>
  Gateway API support is available as of LangSmith v0.12.0
</Note>

If your cluster uses the [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/), you can configure LangSmith to provision HTTPRoute resources. This will create an HTTPRoute for LangSmith and an HTTPRoute for each [agent deployment](/langsmith/deployments).

* *name (required)*: The name of the Gateway resource to reference
* *namespace (required)*: The namespace where the Gateway resource is located
* *hostname (optional)*: The hostname that you would like to use for your LangSmith installation. E.g `"langsmith.example.com"`
* *basePath (optional)*: If you would like to serve LangSmith under a base path, you can specify it here. E.g "example.com/langsmith"
* *sectionName (optional)*: The name of a specific listener section in the Gateway to use
* *annotations (optional)*: Additional annotations to add to the HTTPRoute resources
* *labels (optional)*: Additional labels to add to the HTTPRoute resources

Once configured, you can check the status of your HTTPRoutes:

### Option 3: Istio Gateway

<Note>
  Istio Gateway support is available as of LangSmith v0.12.0
</Note>

If your cluster uses [Istio](https://istio.io/), you can configure LangSmith to provision VirtualService resources. This will create a VirtualService for LangSmith and a VirtualService for each [agent deployment](/langsmith/deployments).

* *name (optional)*: The name of the Istio Gateway resource to reference. Defaults to `"istio-gateway"`
* *namespace (optional)*: The namespace where the Istio Gateway resource is located. Defaults to `"istio-system"`
* *hostname (optional)*: The hostname that you would like to use for your LangSmith installation. E.g `"langsmith.example.com"`
* *basePath (optional)*: If you would like to serve LangSmith under a base path, you can specify it here. E.g "example.com/langsmith"
* *annotations (optional)*: Additional annotations to add to the VirtualService resources
* *labels (optional)*: Additional labels to add to the VirtualService resources

Once configured, you can check the status of your VirtualServices:

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/self-host-ingress.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
* *Labels (optional)*: Additional labels to add to the Ingress.

* *TLS (optional)*: If you would like to serve LangSmith over HTTPS, you can add TLS configuration here (many Ingress controllers may have other ways of controlling TLS so this is often not needed). This should be an array of TLS configurations. Each TLS configuration should have the following fields:

  * hosts: An array of hosts that the certificate should be valid for. E.g \["langsmith.example.com"]

  * secretName: The name of the Kubernetes secret that contains the certificate and private key. This secret should have the following keys:

    * tls.crt: The certificate
    * tls.key: The private key

  * You can read more about creating a TLS secret [here](https://kubernetes.io/do/langsmith/observability-concepts/services-networking/ingress/#tls).

## Configuration

You can configure your LangSmith instance to use one of three routing options: standard Ingress, Gateway API, or Istio Gateway. Choose the option that best fits your infrastructure.

### Option 1: Standard Ingress

With these parameters in hand, you can configure your LangSmith instance to use an Ingress. You can do this by modifying the `config.yaml` file for your LangSmith Helm Chart installation.
```

Example 2 (unknown):
```unknown
Once configured, you will need to update your LangSmith installation. If everything is configured correctly, your LangSmith instance should now be accessible via the Ingress. You can run the following to check the status of your Ingress:
```

Example 3 (unknown):
```unknown
You should see something like this in the output:
```

Example 4 (unknown):
```unknown
<Warning>
  If you do not have automated DNS setup, you will need to add the IP address to your DNS provider manually.
</Warning>

### Option 2: Gateway API

<Note>
  Gateway API support is available as of LangSmith v0.12.0
</Note>

If your cluster uses the [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/), you can configure LangSmith to provision HTTPRoute resources. This will create an HTTPRoute for LangSmith and an HTTPRoute for each [agent deployment](/langsmith/deployments).

#### Parameters

* *name (required)*: The name of the Gateway resource to reference
* *namespace (required)*: The namespace where the Gateway resource is located
* *hostname (optional)*: The hostname that you would like to use for your LangSmith installation. E.g `"langsmith.example.com"`
* *basePath (optional)*: If you would like to serve LangSmith under a base path, you can specify it here. E.g "example.com/langsmith"
* *sectionName (optional)*: The name of a specific listener section in the Gateway to use
* *annotations (optional)*: Additional annotations to add to the HTTPRoute resources
* *labels (optional)*: Additional labels to add to the HTTPRoute resources

#### Configuration
```

---

## Deep Agents overview

**URL:** llms-txt#deep-agents-overview

**Contents:**
- When to use deep agents
- Core capabilities
- Relationship to the LangChain ecosystem
- Get started

Source: https://docs.langchain.com/oss/python/deepagents/overview

Build agents that can plan, use subagents, and leverage file systems for complex tasks

[`deepagents`](https://pypi.org/project/deepagents/) is a standalone library for building agents that can tackle complex, multi-step tasks. Built on LangGraph and inspired by applications like Claude Code, Deep Research, and Manus, deep agents come with planning capabilities, file systems for context management, and the ability to spawn subagents.

## When to use deep agents

Use deep agents when you need agents that can:

* **Handle complex, multi-step tasks** that require planning and decomposition
* **Manage large amounts of context** through file system tools
* **Delegate work** to specialized subagents for context isolation
* **Persist memory** across conversations and threads

For simpler use cases, consider using LangChain's [`create_agent`](/oss/python/langchain/agents) or building a custom [LangGraph](/oss/python/langgraph/overview) workflow.

<Card title="Planning and task decomposition" icon="timeline">
  Deep agents include a built-in `write_todos` tool that enables agents to break down complex tasks into discrete steps, track progress, and adapt plans as new information emerges.
</Card>

<Card title="Context management" icon="scissors">
  File system tools (`ls`, `read_file`, `write_file`, `edit_file`) allow agents to offload large context to memory, preventing context window overflow and enabling work with variable-length tool results.
</Card>

<Card title="Subagent spawning" icon="people-group">
  A built-in `task` tool enables agents to spawn specialized subagents for context isolation. This keeps the main agent's context clean while still going deep on specific subtasks.
</Card>

<Card title="Long-term memory" icon="database">
  Extend agents with persistent memory across threads using LangGraph's Store. Agents can save and retrieve information from previous conversations.
</Card>

## Relationship to the LangChain ecosystem

Deep agents is built on top of:

* [LangGraph](/oss/python/langgraph/overview) - Provides the underlying graph execution and state management
* [LangChain](/oss/python/langchain/overview) - Tools and model integrations work seamlessly with deep agents
* [LangSmith](/langsmith/home) - Observability, evaluation, and deployment

Deep agents applications can be deployed via [LangSmith Deployment](/langsmith/deployments) and monitored with [LangSmith Observability](/langsmith/observability).

<CardGroup cols={2}>
  <Card title="Quickstart" icon="rocket" href="/oss/python/deepagents/quickstart">
    Build your first deep agent
  </Card>

<Card title="Customization" icon="sliders" href="/oss/python/deepagents/customization">
    Learn about customization options
  </Card>

<Card title="Middleware" icon="layer-group" href="/oss/python/deepagents/middleware">
    Understand the middleware architecture
  </Card>

<Card title="Reference" icon="arrow-up-right-from-square" href="https://reference.langchain.com/python/deepagents/">
    See the `deepagents` API reference
  </Card>
</CardGroup>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Deploy on Cloud

**URL:** llms-txt#deploy-on-cloud

**Contents:**
- Prerequisites
- Create new deployment
- Create new revision
- View build and server logs
- View deployment metrics
- Interrupt revision
- Delete deployment
- Deployment settings
- Add or remove GitHub repositories
- Allowlist IP addresses

Source: https://docs.langchain.com/langsmith/deploy-to-cloud

This is the comprehensive setup and management guide for deploying applications to LangSmith Cloud.

<Callout icon="zap" color="#4F46E5" iconType="regular">
  **If you're looking for a quick setup**, try the [quickstart guide](/langsmith/deployment-quickstart) first.
</Callout>

Before setting up, review the [Cloud overview page](/langsmith/cloud) to understand the Cloud hosting model.

* Applications are deployed from GitHub repositories. Configure and upload an application to a GitHub repository.
* [Verify that the LangGraph API runs locally](/langsmith/local-server). If the API does not run successfully (i.e., `langgraph dev`), deploying to LangSmith will fail as well.

<Note>
  **One-Time Setup Required**: A GitHub organization owner or admin must complete the OAuth flow in the LangSmith UI to authorize the `hosted-langserve` GitHub app. This only needs to be done once per workspace. After the initial OAuth authorization, all developers with deployment permissions can create and manage deployments without requiring GitHub admin access.
</Note>

## Create new deployment

Starting from the [LangSmith UI](https://smith.langchain.com), select **Deployments** in the left-hand navigation panel, **Deployments**. In the top-right corner, select **+ New Deployment** to create a new deployment:

1. In the **Create New Deployment** panel, fill out the required fields. For **Deployment details**:
   1. Select **Import from GitHub** and follow the GitHub OAuth workflow to install and authorize LangChain's `hosted-langserve` GitHub app to access the selected repositories. After installation is complete, return to the **Create New Deployment** panel and select the GitHub repository to deploy from the dropdown menu.
      <Note> The GitHub user installing LangChain's `hosted-langserve` GitHub app must be an [owner](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization#organization-owners) of the organization or account. This authorization only needs to be completed once per LangSmith workspace—subsequent deployments can be created by any user with deployment permissions.</Note>
   2. Specify a name for the deployment.
   3. Specify the desired **Git Branch**. A deployment is linked to a branch. When a new revision is created, code for the linked branch will be deployed. The branch can be updated later in the [Deployment Settings](#deployment-settings).
   4. Specify the full path to the [LangGraph API config file](/langsmith/cli#configuration-file) including the file name. For example, if the file `langgraph.json` is in the root of the repository, specify `langgraph.json`.
   5. Use the checkbox to **Automatically update deployment on push to branch**. If checked, the deployment will automatically be updated when changes are pushed to the specified **Git Branch**. You can enable or disable this setting on the [Deployment Settings](#deployment-settings) in [the UI](https://smith.langchain.com).
      For **Deployment Type**:
      * Development deployments are meant for non-production use cases and are provisioned with minimal resources.
      * Production deployments can serve up to 500 requests/second and are provisioned with highly available storage with automatic backups.
   6. Determine if the deployment should be **Shareable through Studio**.
      1. If unchecked, the deployment will only be accessible with a valid LangSmith API key for the [workspace](/langsmith/administration-overview#workspaces).
      2. If checked, the deployment will be accessible through [Studio](/langsmith/studio) to any LangSmith user. A direct URL to Studio for the deployment will be provided to share with other LangSmith users.
   7. Specify **Environment Variables** and secrets. To configure additional variables for the deployment, refer to the [Environment Variables reference](/langsmith/env-var).
      1. Sensitive values such as API keys (e.g., `OPENAI_API_KEY`) should be specified as secrets.
      2. Additional non-secret environment variables can be specified as well.
   8. A new LangSmith [tracing project](/langsmith/observability) is automatically created with the same name as the deployment.
2. In the top-right corner, select **Submit**. After a few seconds, the **Deployment** view appears and the new deployment will be queued for provisioning.

## Create new revision

When [creating a new deployment](#create-new-deployment), a new revision is created by default. You can create subsequent revisions to deploy new code changes.

Starting from the [LangSmith UI](https://smith.langchain.com), select **Deployments** in the left-hand navigation panel. Select an existing deployment to create a new revision for.

1. In the **Deployment** view, in the top-right corner, select **+ New Revision**.
2. In the **New Revision** modal, fill out the required fields.
   1. Specify the full path to the [API config file](/langsmith/cli#configuration-file) including the file name. For example, if the file `langgraph.json` is in the root of the repository, specify `langgraph.json`.
   2. Determine if the deployment should be **Shareable through Studio**.
      * If unchecked, the deployment will only be accessible with a valid LangSmith API key for the [workspace](/langsmith/administration-overview#workspaces).
      * If checked, the deployment will be accessible through [Studio](/langsmith/studio) to any LangSmith user. A direct URL to Studio for the deployment will be provided to share with other LangSmith users.
   3. Specify **Environment Variables** and secrets. Existing secrets and environment variables are prepopulated. To configure additional variables for the revision, refer to the [Environment Variables reference](/langsmith/env-var).
      1. Add new secrets or environment variables.
      2. Remove existing secrets or environment variables.
      3. Update the value of existing secrets or environment variables.
3. Select **Submit\`**. After a few seconds, the **New Revision** modal will close and the new revision will be queued for deployment.

## View build and server logs

Build and server logs are available for each revision.

Starting from the **Deployments** view:

1. Select the desired revision from the **Revisions** table. A panel slides open from the right-hand side and the **Build** tab is selected by default, which displays build logs for the revision.
2. In the panel, select the **Server** tab to view server logs for the revision. Server logs are only available after a revision has been deployed.
3. Within the **Server** tab, adjust the date/time range picker as needed. By default, the date/time range picker is set to the **Last 7 days**.

## View deployment metrics

Starting from the [LangSmith UI](https://smith.langchain.com):

1. In the left-hand navigation panel, select **Deployments**.
2. Select an existing deployment to monitor.
3. Select the **Monitoring** tab to view the deployment metrics. Refer to a list of [all available metrics](/langsmith/control-plane#monitoring).
4. Within the **Monitoring** tab, use the date/time range picker as needed. By default, the date/time range picker is set to the **Last 15 minutes**.

## Interrupt revision

Interrupting a revision will stop deployment of the revision.

<Warning>
  **Undefined Behavior**
  Interrupted revisions have undefined behavior. This is only useful if you need to deploy a new revision and you already have a revision "stuck" in progress. In the future, this feature may be removed.
</Warning>

Starting from the **Deployments** view:

1. Select the menu icon (three dots) on the right-hand side of the row for the desired revision from the **Revisions** table.
2. Select **Interrupt** from the menu.
3. A modal will appear. Review the confirmation message. Select **Interrupt revision**.

Starting from the [LangSmith UI](https://smith.langchain.com):

1. In the left-hand navigation panel, select **Deployments**, which contains a list of existing deployments.
2. Select the menu icon (three dots) on the right-hand side of the row for the desired deployment and select **Delete**.
3. A **Confirmation** modal will appear. Select **Delete**.

## Deployment settings

Starting from the **Deployments** view:

1. In the top-right corner, select the gear icon (**Deployment Settings**).
2. Update the `Git Branch` to the desired branch.
3. Check/uncheck checkbox to **Automatically update deployment on push to branch**.
   1. Branch creation/deletion and tag creation/deletion events will not trigger an update. Only pushes to an existing branch will trigger an update.
   2. Pushes in quick succession to a branch will queue subsequent updates. Once a build completes, the most recent commit will begin building and the other queued builds will be skipped.

## Add or remove GitHub repositories

After installing and authorizing LangChain's `hosted-langserve` GitHub app, repository access for the app can be modified to add new repositories or remove existing repositories. If a new repository is created, it may need to be added explicitly.

1. From the GitHub profile, navigate to **Settings** > **Applications** > `hosted-langserve` > click **Configure**.
2. Under **Repository access**, select **All repositories** or **Only select repositories**. If **Only select repositories** is selected, new repositories must be explicitly added.
3. Click **Save**.
4. When creating a new deployment, the list of GitHub repositories in the dropdown menu will be updated to reflect the repository access changes.

## Allowlist IP addresses

All traffic from LangSmith deployments created after January 6th 2025 will come through a NAT gateway.
This NAT gateway will have several static ip addresses depending on the region you are deploying in. Refer to the table below for the list of IP addresses to allowlist:

| US             | EU             |
| -------------- | -------------- |
| 35.197.29.146  | 34.90.213.236  |
| 34.145.102.123 | 34.13.244.114  |
| 34.169.45.153  | 34.32.180.189  |
| 34.82.222.17   | 34.34.69.108   |
| 35.227.171.135 | 34.32.145.240  |
| 34.169.88.30   | 34.90.157.44   |
| 34.19.93.202   | 34.141.242.180 |
| 34.19.34.50    | 34.32.141.108  |
| 34.59.244.194  |                |
| 34.9.99.224    |                |
| 34.68.27.146   |                |
| 34.41.178.137  |                |
| 34.123.151.210 |                |
| 34.135.61.140  |                |
| 34.121.166.52  |                |
| 34.31.121.70   |                |

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/deploy-to-cloud.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Evaluation quickstart

**URL:** llms-txt#evaluation-quickstart

**Contents:**
- Prerequisites
- Video guide

Source: https://docs.langchain.com/langsmith/evaluation-quickstart

[*Evaluations*](/langsmith/evaluation-concepts) are a quantitative way to measure the performance of LLM applications. LLMs can behave unpredictably, even small changes to prompts, models, or inputs can significantly affect results. Evaluations provide a structured way to identify failures, compare versions, and build more reliable AI applications.

Running an evaluation in LangSmith requires three key components:

* [*Dataset*](/langsmith/evaluation-concepts#datasets): A set of test inputs (and optionally, expected outputs).
* [*Target function*](/langsmith/define-target-function): The part of your application you want to test—this might be a single LLM call with a new prompt, one module, or your entire workflow.
* [*Evaluators*](/langsmith/evaluation-concepts#evaluators): Functions that score your target function’s outputs.

This quickstart guides you through running a starter evaluation that checks the correctness of LLM responses, using either the LangSmith SDK or UI.

<Tip>
  If you prefer to watch a video on getting started with tracing, refer to the datasets and evaluations [Video guide](#video-guide).
</Tip>

Before you begin, make sure you have:

* **A LangSmith account**: Sign up or log in at [smith.langchain.com](https://smith.langchain.com).
* **A LangSmith API key**: Follow the [Create an API key](/langsmith/create-account-api-key#create-an-api-key) guide.
* **An OpenAI API key**: Generate this from the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

**Select the UI or SDK filter for instructions:**

<Tabs>
  <Tab title="UI" icon="window">
    ## 1. Set workspace secrets

In the [LangSmith UI](https://smith.langchain.com), ensure that your OpenAI API key is set as a [workspace secret](/langsmith/administration-overview#workspace-secrets).

1. Navigate to <Icon icon="gear" /> **Settings** and then move to the **Secrets** tab.
    2. Select **Add secret** and enter the `OPENAI_API_KEY` and your API key as the **Value**.
    3. Select **Save secret**.

<Note> When adding workspace secrets in the LangSmith UI, make sure the secret keys match the environment variable names expected by your model provider.</Note>

## 2. Create a prompt

LangSmith's [Prompt Playground](/langsmith/observability-concepts#prompt-playground) makes it possible to run evaluations over different prompts, new models, or test different model configurations.

1. In the [LangSmith UI](https://smith.langchain.com), navigate to the **Playground** under **Prompt Engineering**.
    2. Under the **Prompts** panel, modify the **system** prompt to:

Leave the **Human** message as is: `{question}`.

## 3. Create a dataset

1. Click **Set up Evaluation**, which will open a **New Experiment** table at the bottom of the page.

2. In the **Select or create a new dataset** dropdown, click the **+ New** button to create a new dataset.

<div style={{ textAlign: 'center' }}>
         <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=b068f4407a83e31403da9a5473960fee" alt="Playground with the edited system prompt and new experiment with the dropdown for creating a new dataset." data-og-width="1422" width="1422" data-og-height="743" height="743" data-path="langsmith/images/playground-system-prompt-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?w=280&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=d43b9466988d5077d0d2efe44b80b578 280w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?w=560&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=1bf60ab2d71b1b9e734c28694f7974bc 560w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?w=840&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=131d3d7bdc6c16e7738d3ea50fbc3abf 840w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?w=1100&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=5396dc8c14902762a7499cf9dced6907 1100w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?w=1650&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=b5eb2c32e461f50e7c85672cb5646f80 1650w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-light.png?w=2500&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=db0ceb217623931ff1084e86b5d50981 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=a114b1a83bf8d0a074b4ce2759207e4d" alt="Playground with the edited system prompt and new experiment with the dropdown for creating a new dataset." data-og-width="1421" width="1421" data-og-height="736" height="736" data-path="langsmith/images/playground-system-prompt-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?w=280&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=b88848b64b77bf1e2e997b956bbdd171 280w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?w=560&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=c036a354ec2e314d50426814028106d4 560w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?w=840&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=69fd6ef5aebac86623c203592a6038ae 840w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?w=1100&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=89ddb65e1ee37a1901e1f653ecd917ed 1100w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?w=1650&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=d8ec3af511ae661b55c9bcb79a18726f 1650w, https://mintcdn.com/langchain-5e9cc07a/hVPHwyb3hetqtQnG/langsmith/images/playground-system-prompt-dark.png?w=2500&fit=max&auto=format&n=hVPHwyb3hetqtQnG&q=85&s=824698630c1325a8082df4b8923492a9 2500w" />
       </div>

3. Add the following examples to the dataset:

| Inputs                                                   | Reference Outputs                                 |
       | -------------------------------------------------------- | ------------------------------------------------- |
       | question: Which country is Mount Kilimanjaro located in? | output: Mount Kilimanjaro is located in Tanzania. |
       | question: What is Earth's lowest point?                  | output: Earth's lowest point is The Dead Sea.     |

4. Click **Save** and enter a name to save your newly created dataset.

## 4. Add an evaluator

1. Click **+ Evaluator** and select **Correctness** from the **Pre-built Evaluator** options.
    2. In the **Correctness** panel, click **Save**.

## 5. Run your evaluation

1. Select <Icon icon="circle-play" /> **Start** on the top right to run your evaluation. This will create an [*experiment*](/langsmith/evaluation-concepts#experiment) with a preview in the **New Experiment** table. You can view in full by clicking the experiment name.

<div style={{ textAlign: 'center' }}>
         <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=efa004b4032d0e439a58d08567b75478" alt="Full experiment view of the results that used the example dataset." data-og-width="1241" width="1241" data-og-height="671" height="671" data-path="langsmith/images/full-experiment-view-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?w=280&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=6d76d0e8d11cfdab4ac142f2d5c4bde1 280w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?w=560&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=b712e5a37af115a401d8d0d34812ef93 560w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?w=840&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=30c491438801b77eb4377401f26fd65d 840w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?w=1100&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=dc75651029fb4a83549714b41f06f541 1100w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?w=1650&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=7f3ade3f66b44d7080284112502a5812 1650w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-light.png?w=2500&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=e084175b15d368419c77835fbad3b53e 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=34c2921eeadd1b7782ac64b579bcef6a" alt="Full experiment view of the results that used the example dataset." data-og-width="1241" width="1241" data-og-height="665" height="665" data-path="langsmith/images/full-experiment-view-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?w=280&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=e02feba8a82d493bf55c6801368b5c9b 280w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?w=560&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=5f184bcab87fa6a55a948a54aa393a14 560w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?w=840&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=c0bc9d71281293065f696cf85632179b 840w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?w=1100&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=f8715bb40e847ad482fa1b5ff573ae2e 1100w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?w=1650&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=5da023adf8b5bc693335baae7159169b 1650w, https://mintcdn.com/langchain-5e9cc07a/3SZlGm2zGXjJWzA5/langsmith/images/full-experiment-view-dark.png?w=2500&fit=max&auto=format&n=3SZlGm2zGXjJWzA5&q=85&s=64a53655134ae7554edaf47b1a957d26 2500w" />
       </div>

<Tip>
      To learn more about running experiments in LangSmith, read the [evaluation conceptual guide](/langsmith/evaluation-concepts).
    </Tip>

* For more details on evaluations, refer to the [Evaluation documentation](/langsmith/evaluation).
    * Learn how to [create and manage datasets in the UI](/langsmith/manage-datasets-in-application#set-up-your-dataset).
    * Learn how to [run an evaluation from the prompt playground](/langsmith/run-evaluation-from-prompt-playground).
  </Tab>

<Tab title="SDK" icon="code">
    <Tip>
      This guide uses prebuilt LLM-as-judge evaluators from the open-source [`openevals`](https://github.com/langchain-ai/openevals) package. OpenEvals includes a set of commonly used evaluators and is a great starting point if you're new to evaluations. If you want greater flexibility in how you evaluate your apps, you can also [define completely custom evaluators](/langsmith/code-evaluator).
    </Tip>

## 1. Install dependencies

In your terminal, create a directory for your project and install the dependencies in your environment:

<Info>
      If you are using `yarn` as your package manager, you will also need to manually install `@langchain/core` as a peer dependency of `openevals`. This is not required for LangSmith evals in general, you may define evaluators [using arbitrary custom code](/langsmith/code-evaluator).
    </Info>

## 2. Set up environment variables

Set the following environment variables:

* `LANGSMITH_TRACING`
    * `LANGSMITH_API_KEY`
    * `OPENAI_API_KEY` (or your LLM provider's API key)
    * (optional) `LANGSMITH_WORKSPACE_ID`: If your LangSmith API key is linked to multiple [workspaces](/langsmith/administration-overview#workspaces), set this variable to specify which workspace to use.

<Note>
      If you're using Anthropic, use the [Anthropic wrapper](/langsmith/annotate-code#wrap-the-anthropic-client-python-only) to trace your calls. For other providers, use [the traceable wrapper](/langsmith/annotate-code#use-%40traceable-%2F-traceable).
    </Note>

## 3. Create a dataset

1. Create a file and add the following code, which will:

* Import the `Client` to connect to LangSmith.
       * Create a dataset.
       * Define example [*inputs* and *outputs*](/langsmith/evaluation-concepts#examples).
       * Associate the input and output pairs with that dataset in LangSmith so they can be used in evaluations.

2. In your terminal, run the `dataset` file to create the datasets you'll use to evaluate your app:

You'll see the following output:

## 4. Create your target function

Define a [target function](/langsmith/define-target-function) that contains what you're evaluating. In this guide, you'll define a target function that contains a single LLM call to answer a question.

Add the following to an `eval` file:

## 5. Define an evaluator

In this step, you’re telling LangSmith how to grade the answers your app produces.

Import a prebuilt evaluation prompt (`CORRECTNESS_PROMPT`) from [`openevals`](https://github.com/langchain-ai/openevals) and a helper that wraps it into an [*LLM-as-judge evaluator*](/langsmith/evaluation-concepts#llm-as-judge), which will score the application's output.

<Info>
      `CORRECTNESS_PROMPT` is just an f-string with variables for `"inputs"`, `"outputs"`, and `"reference_outputs"`. See [here](https://github.com/langchain-ai/openevals#customizing-prompts) for more information on customizing OpenEvals prompts.
    </Info>

The evaluator compares:

* `inputs`: what was passed into your target function (e.g., the question text).
    * `outputs`: what your target function returned (e.g., the model’s answer).
    * `reference_outputs`: the ground truth answers you attached to each dataset example in [Step 3](#3-create-a-dataset).

Add the following highlighted code to your `eval` file:

## 6. Run and view results

To run the evaluation experiment, you'll call `evaluate(...)`, which:

* Pulls example from the dataset you created in [Step 3](#3-create-a-dataset).
    * Sends each example's inputs to your target function from [Step 4](#4-add-an-evaluator).
    * Collects the outputs (the model's answers).
    * Passes the outputs along with the `reference_outputs` to your evaluator from [Step 5](#5-define-an-evaluator).
    * Records all results in LangSmith as an experiment, so you can view them in the UI.

1. Add the highlighted code to your `eval` file:

2. Run your evaluator:

3. You'll receive a link to view the evaluation results and metadata for the experiment results:

4. Follow the link in the output of your evaluation run to access the **Datasets & Experiments** page in the [LangSmith UI](https://smith.langchain.com), and explore the results of the experiment. This will direct you to the created experiment with a table showing the **Inputs**, **Reference Output**, and **Outputs**. You can select a dataset to open an expanded view of the results.

<div style={{ textAlign: 'center' }}>
         <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=94341c15219e46866589140d87efb8f6" alt="Experiment results in the UI after following the link." data-og-width="1816" width="1816" data-og-height="464" height="464" data-path="langsmith/images/experiment-results-link-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?w=280&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=a21a3329260ad62c96f334cda7956fe9 280w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?w=560&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=a35065f0c34ec47116cf07320d15feee 560w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?w=840&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=4f505f7b711829c9948e07aea7199869 840w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?w=1100&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=cc258bf607ab9c601e6770e35b03d6ca 1100w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?w=1650&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=dde47e9fa8c00e81776c32df132e1191 1650w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-light.png?w=2500&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=2f690dfd90d40401f5fa0cfabe08d070 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=d741b33219f7d130e80e1dfb7e743ac6" alt="Experiment results in the UI after following the link." data-og-width="1567" width="1567" data-og-height="455" height="455" data-path="langsmith/images/experiment-results-link-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?w=280&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=49cc262a4941e5af43659dc1351e9ade 280w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?w=560&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=177c8f916e53cb2d7396e7f10352eb50 560w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?w=840&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=801e51a8002dac8add3ed14796b989bc 840w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?w=1100&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=feab9e0fb21a720a8aefa80e4b6aedca 1100w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?w=1650&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=0bf74f76e36d30e9520504281dd6b2ff 1650w, https://mintcdn.com/langchain-5e9cc07a/DDMvkseOvrCjx9sx/langsmith/images/experiment-results-link-dark.png?w=2500&fit=max&auto=format&n=DDMvkseOvrCjx9sx&q=85&s=84dd1248a09df55b3bd872276ef7c3ad 2500w" />
       </div>

Here are some topics you might want to explore next:

* [Evaluation concepts](/langsmith/evaluation-concepts) provides descriptions of the key terminology for evaluations in LangSmith.
    * [OpenEvals README](https://github.com/langchain-ai/openevals) to see all available prebuilt evaluators and how to customize them.
    * [Define custom evaluators](/langsmith/code-evaluator).
    * [Python](https://docs.smith.langchain.com/reference/python/reference) or [TypeScript](https://docs.smith.langchain.com/reference/js) SDK references for comprehensive descriptions of every class and function.
  </Tab>
</Tabs>

<iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/iEgjJyk3aTw?si=C7BPKXPmdE1yAflv" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/evaluation-quickstart.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Answer the following question accurately:
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
</CodeGroup>

    <Info>
      If you are using `yarn` as your package manager, you will also need to manually install `@langchain/core` as a peer dependency of `openevals`. This is not required for LangSmith evals in general, you may define evaluators [using arbitrary custom code](/langsmith/code-evaluator).
    </Info>

    ## 2. Set up environment variables

    Set the following environment variables:

    * `LANGSMITH_TRACING`
    * `LANGSMITH_API_KEY`
    * `OPENAI_API_KEY` (or your LLM provider's API key)
    * (optional) `LANGSMITH_WORKSPACE_ID`: If your LangSmith API key is linked to multiple [workspaces](/langsmith/administration-overview#workspaces), set this variable to specify which workspace to use.
```

Example 4 (unknown):
```unknown
<Note>
      If you're using Anthropic, use the [Anthropic wrapper](/langsmith/annotate-code#wrap-the-anthropic-client-python-only) to trace your calls. For other providers, use [the traceable wrapper](/langsmith/annotate-code#use-%40traceable-%2F-traceable).
    </Note>

    ## 3. Create a dataset

    1. Create a file and add the following code, which will:

       * Import the `Client` to connect to LangSmith.
       * Create a dataset.
       * Define example [*inputs* and *outputs*](/langsmith/evaluation-concepts#examples).
       * Associate the input and output pairs with that dataset in LangSmith so they can be used in evaluations.

       <CodeGroup>
```

---

## Functional API overview

**URL:** llms-txt#functional-api-overview

**Contents:**
- Functional API vs. Graph API
- Example
- Entrypoint
  - Definition
  - Injectable parameters
  - Executing
  - Resuming
  - Short-term memory
- Task
  - Definition

Source: https://docs.langchain.com/oss/python/langgraph/functional-api

The **Functional API** allows you to add LangGraph's key features — [persistence](/oss/python/langgraph/persistence), [memory](/oss/python/langgraph/add-memory), [human-in-the-loop](/oss/python/langgraph/interrupts), and [streaming](/oss/python/langgraph/streaming) — to your applications with minimal changes to your existing code.

It is designed to integrate these features into existing code that may use standard language primitives for branching and control flow, such as `if` statements, `for` loops, and function calls. Unlike many data orchestration frameworks that require restructuring code into an explicit pipeline or DAG, the Functional API allows you to incorporate these capabilities without enforcing a rigid execution model.

The Functional API uses two key building blocks:

* **`@entrypoint`** – Marks a function as the starting point of a workflow, encapsulating logic and managing execution flow, including handling long-running tasks and interrupts.
* **[`@task`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.task)** – Represents a discrete unit of work, such as an API call or data processing step, that can be executed asynchronously within an entrypoint. Tasks return a future-like object that can be awaited or resolved synchronously.

This provides a minimal abstraction for building workflows with state management and streaming.

<Tip>
  For information on how to use the functional API, see [Use Functional API](/oss/python/langgraph/use-functional-api).
</Tip>

## Functional API vs. Graph API

For users who prefer a more declarative approach, LangGraph's [Graph API](/oss/python/langgraph/graph-api) allows you to define workflows using a Graph paradigm. Both APIs share the same underlying runtime, so you can use them together in the same application.

Here are some key differences:

* **Control flow**: The Functional API does not require thinking about graph structure. You can use standard Python constructs to define workflows. This will usually trim the amount of code you need to write.
* **Short-term memory**: The **GraphAPI** requires declaring a [**State**](/oss/python/langgraph/graph-api#state) and may require defining [**reducers**](/oss/python/langgraph/graph-api#reducers) to manage updates to the graph state. `@entrypoint` and `@tasks` do not require explicit state management as their state is scoped to the function and is not shared across functions.
* **Checkpointing**: Both APIs generate and use checkpoints. In the **Graph API** a new checkpoint is generated after every [superstep](/oss/python/langgraph/graph-api). In the **Functional API**, when tasks are executed, their results are saved to an existing checkpoint associated with the given entrypoint instead of creating a new checkpoint.
* **Visualization**: The Graph API makes it easy to visualize the workflow as a graph which can be useful for debugging, understanding the workflow, and sharing with others. The Functional API does not support visualization as the graph is dynamically generated during runtime.

Below we demonstrate a simple application that writes an essay and [interrupts](/oss/python/langgraph/interrupts) to request human review.

<Accordion title="Detailed Explanation">
  This workflow will write an essay about the topic "cat" and then pause to get a review from a human. The workflow can be interrupted for an indefinite amount of time until a review is provided.

When the workflow is resumed, it executes from the very start, but because the result of the `writeEssay` task was already saved, the task result will be loaded from the checkpoint instead of being recomputed.

An essay has been written and is ready for review. Once the review is provided, we can resume the workflow:

The workflow has been completed and the review has been added to the essay.
</Accordion>

The [`@entrypoint`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint) decorator can be used to create a workflow from a function. It encapsulates workflow logic and manages execution flow, including handling *long-running tasks* and [interrupts](/oss/python/langgraph/interrupts).

An **entrypoint** is defined by decorating a function with the `@entrypoint` decorator.

The function **must accept a single positional argument**, which serves as the workflow input. If you need to pass multiple pieces of data, use a dictionary as the input type for the first argument.

Decorating a function with an `entrypoint` produces a [`Pregel`](https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.stream) instance which helps to manage the execution of the workflow (e.g., handles streaming, resumption, and checkpointing).

You will usually want to pass a **checkpointer** to the `@entrypoint` decorator to enable persistence and use features like **human-in-the-loop**.

<Tabs>
  <Tab title="Sync">
    
  </Tab>

<Tab title="Async">
    
  </Tab>
</Tabs>

<Warning>
  **Serialization**
  The **inputs** and **outputs** of entrypoints must be JSON-serializable to support checkpointing. Please see the [serialization](#serialization) section for more details.
</Warning>

### Injectable parameters

When declaring an `entrypoint`, you can request access to additional parameters that will be injected automatically at run time. These parameters include:

| Parameter    | Description                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **previous** | Access the state associated with the previous `checkpoint` for the given thread. See [short-term-memory](#short-term-memory).                                               |
| **store**    | An instance of \[BaseStore]\[langgraph.store.base.BaseStore]. Useful for [long-term memory](/oss/python/langgraph/use-functional-api#long-term-memory).                     |
| **writer**   | Use to access the StreamWriter when working with Async Python \< 3.11. See [streaming with functional API for details](/oss/python/langgraph/use-functional-api#streaming). |
| **config**   | For accessing run time configuration. See [RunnableConfig](https://python.langchain.com/docs/concepts/runnables/#runnableconfig) for information.                           |

<Warning>
  Declare the parameters with the appropriate name and type annotation.
</Warning>

<Accordion title="Requesting Injectable Parameters">
  
</Accordion>

Using the [`@entrypoint`](#entrypoint) yields a [`Pregel`](https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.stream) object that can be executed using the `invoke`, `ainvoke`, `stream`, and `astream` methods.

<Tabs>
  <Tab title="Invoke">
    
  </Tab>

<Tab title="Async Invoke">
    
  </Tab>

<Tab title="Stream">
    
  </Tab>

<Tab title="Async Stream">
    
  </Tab>
</Tabs>

Resuming an execution after an [interrupt](https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt) can be done by passing a **resume** value to the [`Command`](https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command) primitive.

<Tabs>
  <Tab title="Invoke">
    
  </Tab>

<Tab title="Async Invoke">
    
  </Tab>

<Tab title="Stream">
    
  </Tab>

<Tab title="Async Stream">
    
  </Tab>
</Tabs>

**Resuming after an error**

To resume after an error, run the `entrypoint` with a `None` and the same **thread id** (config).

This assumes that the underlying **error** has been resolved and execution can proceed successfully.

<Tabs>
  <Tab title="Invoke">
    
  </Tab>

<Tab title="Async Invoke">
    
  </Tab>

<Tab title="Stream">
    
  </Tab>

<Tab title="Async Stream">
    
  </Tab>
</Tabs>

### Short-term memory

When an `entrypoint` is defined with a `checkpointer`, it stores information between successive invocations on the same **thread id** in [checkpoints](/oss/python/langgraph/persistence#checkpoints).

This allows accessing the state from the previous invocation using the `previous` parameter.

By default, the `previous` parameter is the return value of the previous invocation.

#### `entrypoint.final`

[`entrypoint.final`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint.final) is a special primitive that can be returned from an entrypoint and allows **decoupling** the value that is **saved in the checkpoint** from the **return value of the entrypoint**.

The first value is the return value of the entrypoint, and the second value is the value that will be saved in the checkpoint. The type annotation is `entrypoint.final[return_type, save_type]`.

A **task** represents a discrete unit of work, such as an API call or data processing step. It has two key characteristics:

* **Asynchronous Execution**: Tasks are designed to be executed asynchronously, allowing multiple operations to run concurrently without blocking.
* **Checkpointing**: Task results are saved to a checkpoint, enabling resumption of the workflow from the last saved state. (See [persistence](/oss/python/langgraph/persistence) for more details).

Tasks are defined using the `@task` decorator, which wraps a regular Python function.

<Warning>
  **Serialization**
  The **outputs** of tasks must be JSON-serializable to support checkpointing.
</Warning>

**Tasks** can only be called from within an **entrypoint**, another **task**, or a [state graph node](/oss/python/langgraph/graph-api#nodes).

Tasks *cannot* be called directly from the main application code.

When you call a **task**, it returns *immediately* with a future object. A future is a placeholder for a result that will be available later.

To obtain the result of a **task**, you can either wait for it synchronously (using `result()`) or await it asynchronously (using `await`).

<Tabs>
  <Tab title="Synchronous Invocation">
    
  </Tab>

<Tab title="Asynchronous Invocation">
    
  </Tab>
</Tabs>

## When to use a task

**Tasks** are useful in the following scenarios:

* **Checkpointing**: When you need to save the result of a long-running operation to a checkpoint, so you don't need to recompute it when resuming the workflow.
* **Human-in-the-loop**: If you're building a workflow that requires human intervention, you MUST use **tasks** to encapsulate any randomness (e.g., API calls) to ensure that the workflow can be resumed correctly. See the [determinism](#determinism) section for more details.
* **Parallel Execution**: For I/O-bound tasks, **tasks** enable parallel execution, allowing multiple operations to run concurrently without blocking (e.g., calling multiple APIs).
* **Observability**: Wrapping operations in **tasks** provides a way to track the progress of the workflow and monitor the execution of individual operations using [LangSmith](https://docs.langchain.com/langsmith/home).
* **Retryable Work**: When work needs to be retried to handle failures or inconsistencies, **tasks** provide a way to encapsulate and manage the retry logic.

There are two key aspects to serialization in LangGraph:

1. `entrypoint` inputs and outputs must be JSON-serializable.
2. `task` outputs must be JSON-serializable.

These requirements are necessary for enabling checkpointing and workflow resumption. Use python primitives like dictionaries, lists, strings, numbers, and booleans to ensure that your inputs and outputs are serializable.

Serialization ensures that workflow state, such as task results and intermediate values, can be reliably saved and restored. This is critical for enabling human-in-the-loop interactions, fault tolerance, and parallel execution.

Providing non-serializable inputs or outputs will result in a runtime error when a workflow is configured with a checkpointer.

To utilize features like **human-in-the-loop**, any randomness should be encapsulated inside of **tasks**. This guarantees that when execution is halted (e.g., for human in the loop) and then resumed, it will follow the same *sequence of steps*, even if **task** results are non-deterministic.

LangGraph achieves this behavior by persisting **task** and [**subgraph**](/oss/python/langgraph/use-subgraphs) results as they execute. A well-designed workflow ensures that resuming execution follows the *same sequence of steps*, allowing previously computed results to be retrieved correctly without having to re-execute them. This is particularly useful for long-running **tasks** or **tasks** with non-deterministic results, as it avoids repeating previously done work and allows resuming from essentially the same.

While different runs of a workflow can produce different results, resuming a **specific** run should always follow the same sequence of recorded steps. This allows LangGraph to efficiently look up **task** and **subgraph** results that were executed prior to the graph being interrupted and avoid recomputing them.

Idempotency ensures that running the same operation multiple times produces the same result. This helps prevent duplicate API calls and redundant processing if a step is rerun due to a failure. Always place API calls inside **tasks** functions for checkpointing, and design them to be idempotent in case of re-execution. Re-execution can occur if a **task** starts, but does not complete successfully. Then, if the workflow is resumed, the **task** will run again. Use idempotency keys or verify existing results to avoid duplication.

### Handling side effects

Encapsulate side effects (e.g., writing to a file, sending an email) in tasks to ensure they are not executed multiple times when resuming a workflow.

<Tabs>
  <Tab title="Incorrect">
    In this example, a side effect (writing to a file) is directly included in the workflow, so it will be executed a second time when resuming the workflow.

<Tab title="Correct">
    In this example, the side effect is encapsulated in a task, ensuring consistent execution upon resumption.

### Non-deterministic control flow

Operations that might give different results each time (like getting current time or random numbers) should be encapsulated in tasks to ensure that on resume, the same result is returned.

* In a task: Get random number (5) → interrupt → resume → (returns 5 again) → ...
* Not in a task: Get random number (5) → interrupt → resume → get new random number (7) → ...

This is especially important when using **human-in-the-loop** workflows with multiple interrupts calls. LangGraph keeps a list of resume values for each task/entrypoint. When an interrupt is encountered, it's matched with the corresponding resume value. This matching is strictly **index-based**, so the order of the resume values should match the order of the interrupts.

If order of execution is not maintained when resuming, one [`interrupt`](https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt) call may be matched with the wrong `resume` value, leading to incorrect results.

Please read the section on [determinism](#determinism) for more details.

<Tabs>
  <Tab title="Incorrect">
    In this example, the workflow uses the current time to determine which task to execute. This is non-deterministic because the result of the workflow depends on the time at which it is executed.

<Tab title="Correct">
    In this example, the workflow uses the input `t0` to determine which task to execute. This is deterministic because the result of the workflow depends only on the input.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/functional-api.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
<Accordion title="Detailed Explanation">
  This workflow will write an essay about the topic "cat" and then pause to get a review from a human. The workflow can be interrupted for an indefinite amount of time until a review is provided.

  When the workflow is resumed, it executes from the very start, but because the result of the `writeEssay` task was already saved, the task result will be loaded from the checkpoint instead of being recomputed.
```

Example 2 (unknown):
```unknown
An essay has been written and is ready for review. Once the review is provided, we can resume the workflow:
```

Example 3 (unknown):
```unknown

```

Example 4 (unknown):
```unknown
The workflow has been completed and the review has been added to the essay.
</Accordion>

## Entrypoint

The [`@entrypoint`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint) decorator can be used to create a workflow from a function. It encapsulates workflow logic and manages execution flow, including handling *long-running tasks* and [interrupts](/oss/python/langgraph/interrupts).

### Definition

An **entrypoint** is defined by decorating a function with the `@entrypoint` decorator.

The function **must accept a single positional argument**, which serves as the workflow input. If you need to pass multiple pieces of data, use a dictionary as the input type for the first argument.

Decorating a function with an `entrypoint` produces a [`Pregel`](https://reference.langchain.com/python/langgraph/pregel/#langgraph.pregel.Pregel.stream) instance which helps to manage the execution of the workflow (e.g., handles streaming, resumption, and checkpointing).

You will usually want to pass a **checkpointer** to the `@entrypoint` decorator to enable persistence and use features like **human-in-the-loop**.

<Tabs>
  <Tab title="Sync">
```

---

## Get started with Studio

**URL:** llms-txt#get-started-with-studio

**Contents:**
- Deployed graphs
- Local development server
  - Prerequisites
  - Setup
  - (Optional) Attach a debugger
- Next steps

Source: https://docs.langchain.com/langsmith/quick-start-studio

[Studio](/langsmith/studio) in the [LangSmith Deployment UI](https://smith.langchain.com) supports connecting to two types of graphs:

* Graphs deployed on [cloud or self-hosted](#deployed-graphs).
* Graphs running locally with [Agent Server](#local-development-server).

Studio is accessed in the [LangSmith UI](https://smith.langchain.com) from the **Deployments** navigation.

For applications that are [deployed](/langsmith/deployment-quickstart), you can access Studio as part of that deployment. To do so, navigate to the deployment in the UI and select **Studio**.

This will load Studio connected to your live deployment, allowing you to create, read, and update the [threads](/oss/python/langgraph/persistence#threads), [assistants](/langsmith/assistants), and [memory](/oss/python/concepts/memory) in that deployment.

## Local development server

To test your application locally using Studio:

* Follow the [local application quickstart](/langsmith/local-server) first.
* If you don't want data [traced](/langsmith/observability-concepts#traces) to LangSmith, set `LANGSMITH_TRACING=false` in your application's `.env` file. With tracing disabled, no data leaves your local server.

1. Install the [LangGraph CLI](/langsmith/cli):

<Warning>
     **Browser Compatibility**
     Safari blocks `localhost` connections to Studio. To work around this, run the command with `--tunnel` to access Studio via a secure tunnel.
   </Warning>

This will start the Agent Server locally, running in-memory. The server will run in watch mode, listening for and automatically restarting on code changes. Read this [reference](/langsmith/cli#dev) to learn about all the options for starting the API server.

You will see the following logs:

Once running, you will automatically be directed to Studio.

2. For a running server, access the Dbugger with one of the following:

1. Directly navigate to the following URL: `https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024`.
   2. Navigate to **Deployments** in the UI, click the **Studio** button on a deployment, enter `http://127.0.0.1:2024` and click **Connect**.

If running your server at a different host or port, update the `baseUrl` to match.

### (Optional) Attach a debugger

For step-by-step debugging with breakpoints and variable inspection, run the following:

Then attach your preferred debugger:

<Tabs>
  <Tab title="VS Code">
    Add this configuration to `launch.json`:

<Tab title="PyCharm">
    1. Go to Run → Edit Configurations
    2. Click + and select "Python Debug Server"
    3. Set IDE host name: `localhost`
    4. Set port: `5678` (or the port number you chose in the previous step)
    5. Click "OK" and start debugging
  </Tab>
</Tabs>

<Tip>
  For issues getting started, refer to the [troubleshooting guide](/langsmith/troubleshooting-studio).
</Tip>

For more information on how to run Studio, refer to the following guides:

* [Run application](/langsmith/use-studio#run-application)
* [Manage assistants](/langsmith/use-studio#manage-assistants)
* [Manage threads](/langsmith/use-studio#manage-threads)
* [Iterate on prompts](/langsmith/observability-studio)
* [Debug LangSmith traces](/langsmith/observability-studio#debug-langsmith-traces)
* [Add node to dataset](/langsmith/observability-studio#add-node-to-dataset)

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/quick-start-studio.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
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

```

Example 3 (unknown):
```unknown
</CodeGroup>

   <Warning>
     **Browser Compatibility**
     Safari blocks `localhost` connections to Studio. To work around this, run the command with `--tunnel` to access Studio via a secure tunnel.
   </Warning>

   This will start the Agent Server locally, running in-memory. The server will run in watch mode, listening for and automatically restarting on code changes. Read this [reference](/langsmith/cli#dev) to learn about all the options for starting the API server.

   You will see the following logs:
```

Example 4 (unknown):
```unknown
Once running, you will automatically be directed to Studio.

2. For a running server, access the Dbugger with one of the following:

   1. Directly navigate to the following URL: `https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024`.
   2. Navigate to **Deployments** in the UI, click the **Studio** button on a deployment, enter `http://127.0.0.1:2024` and click **Connect**.

   If running your server at a different host or port, update the `baseUrl` to match.

### (Optional) Attach a debugger

For step-by-step debugging with breakpoints and variable inspection, run the following:

<CodeGroup>
```

---

## Graph API overview

**URL:** llms-txt#graph-api-overview

**Contents:**
- Graphs
  - StateGraph
  - Compiling your graph
- State
  - Schema

Source: https://docs.langchain.com/oss/python/langgraph/graph-api

At its core, LangGraph models agent workflows as graphs. You define the behavior of your agents using three key components:

1. [`State`](#state): A shared data structure that represents the current snapshot of your application. It can be any data type, but is typically defined using a shared state schema.

2. [`Nodes`](#nodes): Functions that encode the logic of your agents. They receive the current state as input, perform some computation or side-effect, and return an updated state.

3. [`Edges`](#edges): Functions that determine which `Node` to execute next based on the current state. They can be conditional branches or fixed transitions.

By composing `Nodes` and `Edges`, you can create complex, looping workflows that evolve the state over time. The real power, though, comes from how LangGraph manages that state.

To emphasize: `Nodes` and `Edges` are nothing more than functions – they can contain an LLM or just good ol' code.

In short: *nodes do the work, edges tell what to do next*.

LangGraph's underlying graph algorithm uses [message passing](https://en.wikipedia.org/wiki/Message_passing) to define a general program. When a Node completes its operation, it sends messages along one or more edges to other node(s). These recipient nodes then execute their functions, pass the resulting messages to the next set of nodes, and the process continues. Inspired by Google's [Pregel](https://research.google/pubs/pregel-a-system-for-large-scale-graph-processing/) system, the program proceeds in discrete "super-steps."

A super-step can be considered a single iteration over the graph nodes. Nodes that run in parallel are part of the same super-step, while nodes that run sequentially belong to separate super-steps. At the start of graph execution, all nodes begin in an `inactive` state. A node becomes `active` when it receives a new message (state) on any of its incoming edges (or "channels"). The active node then runs its function and responds with updates. At the end of each super-step, nodes with no incoming messages vote to `halt` by marking themselves as `inactive`. The graph execution terminates when all nodes are `inactive` and no messages are in transit.

The [`StateGraph`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph) class is the main graph class to use. This is parameterized by a user defined `State` object.

### Compiling your graph

To build your graph, you first define the [state](#state), you then add [nodes](#nodes) and [edges](#edges), and then you compile it. What exactly is compiling your graph and why is it needed?

Compiling is a pretty simple step. It provides a few basic checks on the structure of your graph (no orphaned nodes, etc). It is also where you can specify runtime args like [checkpointers](/oss/python/langgraph/persistence) and breakpoints. You compile your graph by just calling the `.compile` method:

<Warning>
  You **MUST** compile your graph before you can use it.
</Warning>

The first thing you do when you define a graph is define the `State` of the graph. The `State` consists of the [schema of the graph](#schema) as well as [`reducer` functions](#reducers) which specify how to apply updates to the state. The schema of the `State` will be the input schema to all `Nodes` and `Edges` in the graph, and can be either a `TypedDict` or a `Pydantic` model. All `Nodes` will emit updates to the `State` which are then applied using the specified `reducer` function.

The main documented way to specify the schema of a graph is by using a [`TypedDict`](https://docs.python.org/3/library/typing.html#typing.TypedDict). If you want to provide default values in your state, use a [`dataclass`](https://docs.python.org/3/library/dataclasses.html). We also support using a Pydantic [`BaseModel`](/oss/python/langgraph/use-graph-api#use-pydantic-models-for-graph-state) as your graph state if you want recursive data validation (though note that Pydantic is less performant than a `TypedDict` or `dataclass`).

By default, the graph will have the same input and output schemas. If you want to change this, you can also specify explicit input and output schemas directly. This is useful when you have a lot of keys, and some are explicitly for input and others for output. See the [guide](/oss/python/langgraph/use-graph-api#define-input-and-output-schemas) for more information.

#### Multiple schemas

Typically, all graph nodes communicate with a single schema. This means that they will read and write to the same state channels. But, there are cases where we want more control over this:

* Internal nodes can pass information that is not required in the graph's input / output.
* We may also want to use different input / output schemas for the graph. The output might, for example, only contain a single relevant output key.

It is possible to have nodes write to private state channels inside the graph for internal node communication. We can simply define a private schema, `PrivateState`.

It is also possible to define explicit input and output schemas for a graph. In these cases, we define an "internal" schema that contains *all* keys relevant to graph operations. But, we also define `input` and `output` schemas that are sub-sets of the "internal" schema to constrain the input and output of the graph. See [this guide](/oss/python/langgraph/graph-api#define-input-and-output-schemas) for more detail.

Let's look at an example:

```python  theme={null}
class InputState(TypedDict):
    user_input: str

class OutputState(TypedDict):
    graph_output: str

class OverallState(TypedDict):
    foo: str
    user_input: str
    graph_output: str

class PrivateState(TypedDict):
    bar: str

def node_1(state: InputState) -> OverallState:
    # Write to OverallState
    return {"foo": state["user_input"] + " name"}

def node_2(state: OverallState) -> PrivateState:
    # Read from OverallState, write to PrivateState
    return {"bar": state["foo"] + " is"}

def node_3(state: PrivateState) -> OutputState:
    # Read from PrivateState, write to OutputState
    return {"graph_output": state["bar"] + " Lance"}

builder = StateGraph(OverallState,input_schema=InputState,output_schema=OutputState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", node_2)
builder.add_node("node_3", node_3)
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
builder.add_edge("node_2", "node_3")
builder.add_edge("node_3", END)

graph = builder.compile()
graph.invoke({"user_input":"My"})

**Examples:**

Example 1 (unknown):
```unknown
<Warning>
  You **MUST** compile your graph before you can use it.
</Warning>

## State

The first thing you do when you define a graph is define the `State` of the graph. The `State` consists of the [schema of the graph](#schema) as well as [`reducer` functions](#reducers) which specify how to apply updates to the state. The schema of the `State` will be the input schema to all `Nodes` and `Edges` in the graph, and can be either a `TypedDict` or a `Pydantic` model. All `Nodes` will emit updates to the `State` which are then applied using the specified `reducer` function.

### Schema

The main documented way to specify the schema of a graph is by using a [`TypedDict`](https://docs.python.org/3/library/typing.html#typing.TypedDict). If you want to provide default values in your state, use a [`dataclass`](https://docs.python.org/3/library/dataclasses.html). We also support using a Pydantic [`BaseModel`](/oss/python/langgraph/use-graph-api#use-pydantic-models-for-graph-state) as your graph state if you want recursive data validation (though note that Pydantic is less performant than a `TypedDict` or `dataclass`).

By default, the graph will have the same input and output schemas. If you want to change this, you can also specify explicit input and output schemas directly. This is useful when you have a lot of keys, and some are explicitly for input and others for output. See the [guide](/oss/python/langgraph/use-graph-api#define-input-and-output-schemas) for more information.

#### Multiple schemas

Typically, all graph nodes communicate with a single schema. This means that they will read and write to the same state channels. But, there are cases where we want more control over this:

* Internal nodes can pass information that is not required in the graph's input / output.
* We may also want to use different input / output schemas for the graph. The output might, for example, only contain a single relevant output key.

It is possible to have nodes write to private state channels inside the graph for internal node communication. We can simply define a private schema, `PrivateState`.

It is also possible to define explicit input and output schemas for a graph. In these cases, we define an "internal" schema that contains *all* keys relevant to graph operations. But, we also define `input` and `output` schemas that are sub-sets of the "internal" schema to constrain the input and output of the graph. See [this guide](/oss/python/langgraph/graph-api#define-input-and-output-schemas) for more detail.

Let's look at an example:
```

---

## If you have pandas installed can easily explore results as df:

**URL:** llms-txt#if-you-have-pandas-installed-can-easily-explore-results-as-df:

---

## Install LangChain

**URL:** llms-txt#install-langchain

Source: https://docs.langchain.com/oss/python/langchain/install

To install the LangChain package:

LangChain provides integrations to hundreds of LLMs and thousands of other integrations. These live in independent provider packages.

<Tip>
  See the [Integrations tab](/oss/python/integrations/providers/overview) for a full list of available integrations.
</Tip>

Now that you have LangChain installed, you can get started by following the [Quickstart guide](/oss/python/langchain/quickstart).

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/install.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
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

LangChain provides integrations to hundreds of LLMs and thousands of other integrations. These live in independent provider packages.

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

---

## Install LangGraph

**URL:** llms-txt#install-langgraph

Source: https://docs.langchain.com/oss/python/langgraph/install

To install the base LangGraph package:

To use LangGraph you will usually want to access LLMs and define tools.
You can do this however you see fit.

One way to do this (which we will use in the docs) is to use [LangChain](/oss/python/langchain/overview).

Install LangChain with:

To work with specific LLM provider packages, you will need install them separately.

Refer to the [integrations](/oss/python/integrations/providers/overview) page for provider-specific installation instructions.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/install.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
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

To use LangGraph you will usually want to access LLMs and define tools.
You can do this however you see fit.

One way to do this (which we will use in the docs) is to use [LangChain](/oss/python/langchain/overview).

Install LangChain with:

<CodeGroup>
```

Example 3 (unknown):
```unknown

```

---

## LangChain overview

**URL:** llms-txt#langchain-overview

**Contents:**
- <Icon icon="wand-magic-sparkles" /> Create an agent

Source: https://docs.langchain.com/oss/python/langchain/overview

LangChain is an open source framework with a pre-built agent architecture and integrations for any model or tool — so you can build agents that adapt as fast as the ecosystem evolves

LangChain is the easiest way to start building agents and applications powered by LLMs. With under 10 lines of code, you can connect to OpenAI, Anthropic, Google, and [more](/oss/python/integrations/providers/overview). LangChain provides a pre-built agent architecture and model integrations to help you get started quickly and seamlessly incorporate LLMs into your agents and applications.

We recommend you use LangChain if you want to quickly build agents and autonomous applications. Use [LangGraph](/oss/python/langgraph/overview), our low-level agent orchestration framework and runtime, when you have more advanced needs that require a combination of deterministic and agentic workflows, heavy customization, and carefully controlled latency.

LangChain [agents](/oss/python/langchain/agents) are built on top of LangGraph in order to provide durable execution, streaming, human-in-the-loop, persistence, and more. You do not need to know LangGraph for basic LangChain agent usage.

## <Icon icon="wand-magic-sparkles" /> Create an agent

```python  theme={null}

---

## LangGraph overview

**URL:** llms-txt#langgraph-overview

**Contents:**
- <Icon icon="download" size={20} /> Install
- Core benefits
- LangGraph ecosystem
- Acknowledgements

Source: https://docs.langchain.com/oss/python/langgraph/overview

Gain control with LangGraph to design agents that reliably handle complex tasks

Trusted by companies shaping the future of agents-- including Klarna, Replit, Elastic, and more-- LangGraph is a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents.

LangGraph is very low-level, and focused entirely on agent **orchestration**. Before using LangGraph, we recommend you familiarize yourself with some of the components used to build agents, starting with [models](/oss/python/langchain/models) and [tools](/oss/python/langchain/tools).

We will commonly use [LangChain](/oss/python/langchain/overview) components throughout the documentation to integrate models and tools, but you don't need to use LangChain to use LangGraph. If you are just getting started with agents or want a higher-level abstraction, we recommend you use LangChain's [agents](/oss/python/langchain/agents) that provide pre-built architectures for common LLM and tool-calling loops.

LangGraph is focused on the underlying capabilities important for agent orchestration: durable execution, streaming, human-in-the-loop, and more.

## <Icon icon="download" size={20} /> Install

Then, create a simple hello world example:

LangGraph provides low-level supporting infrastructure for *any* long-running, stateful workflow or agent. LangGraph does not abstract prompts or architecture, and provides the following central benefits:

* [Durable execution](/oss/python/langgraph/durable-execution): Build agents that persist through failures and can run for extended periods, resuming from where they left off.
* [Human-in-the-loop](/oss/python/langgraph/interrupts): Incorporate human oversight by inspecting and modifying agent state at any point.
* [Comprehensive memory](/oss/python/concepts/memory): Create stateful agents with both short-term working memory for ongoing reasoning and long-term memory across sessions.
* [Debugging with LangSmith](/langsmith/home): Gain deep visibility into complex agent behavior with visualization tools that trace execution paths, capture state transitions, and provide detailed runtime metrics.
* [Production-ready deployment](/langsmith/deployments): Deploy sophisticated agent systems confidently with scalable infrastructure designed to handle the unique challenges of stateful, long-running workflows.

## LangGraph ecosystem

While LangGraph can be used standalone, it also integrates seamlessly with any LangChain product, giving developers a full suite of tools for building agents. To improve your LLM application development, pair LangGraph with:

<Columns cols={1}>
  <Card title="LangSmith" icon="chart-line" href="http://www.langchain.com/langsmith" arrow cta="Learn more">
    Trace requests, evaluate outputs, and monitor deployments in one place. Prototype locally with LangGraph, then move to production with integrated observability and evaluation to build more reliable agent systems.
  </Card>

<Card title="LangGraph" icon="server" href="/langsmith/agent-server" arrow cta="Learn more">
    Deploy and scale agents effortlessly with a purpose-built deployment platform for long running, stateful workflows. Discover, reuse, configure, and share agents across teams — and iterate quickly with visual prototyping in Studio.
  </Card>

<Card title="LangChain" icon="link" href="/oss/python/langchain/overview" arrow cta="Learn more">
    Provides integrations and composable components to streamline LLM application development. Contains agent abstractions built on top of LangGraph.
  </Card>
</Columns>

LangGraph is inspired by [Pregel](https://research.google/pubs/pub37252/) and [Apache Beam](https://beam.apache.org/). The public interface draws inspiration from [NetworkX](https://networkx.org/documentation/latest/). LangGraph is built by LangChain Inc, the creators of LangChain, but can be used without LangChain.

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
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

Then, create a simple hello world example:
```

---

## Memory overview

**URL:** llms-txt#memory-overview

**Contents:**
- Short-term memory
  - Manage short-term memory
- Long-term memory
  - Semantic memory
  - Episodic memory
  - Procedural memory

Source: https://docs.langchain.com/oss/python/concepts/memory

[Memory](/oss/python/langgraph/add-memory) is a system that remembers information about previous interactions. For AI agents, memory is crucial because it lets them remember previous interactions, learn from feedback, and adapt to user preferences. As agents tackle more complex tasks with numerous user interactions, this capability becomes essential for both efficiency and user satisfaction.

This conceptual guide covers two types of memory, based on their recall scope:

* [Short-term memory](#short-term-memory), or [thread](/oss/python/langgraph/persistence#threads)-scoped memory, tracks the ongoing conversation by maintaining message history within a session. LangGraph manages short-term memory as a part of your agent's [state](/oss/python/langgraph/graph-api#state). State is persisted to a database using a [checkpointer](/oss/python/langgraph/persistence#checkpoints) so the thread can be resumed at any time. Short-term memory updates when the graph is invoked or a step is completed, and the State is read at the start of each step.
* [Long-term memory](#long-term-memory) stores user-specific or application-level data across sessions and is shared *across* conversational threads. It can be recalled *at any time* and *in any thread*. Memories are scoped to any custom namespace, not just within a single thread ID. LangGraph provides [stores](/oss/python/langgraph/persistence#memory-store) ([reference doc](https://langchain-ai.github.io/langgraph/reference/store/#langgraph.store.base.BaseStore)) to let you save and recall long-term memories.

<img src="https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=62665893848db800383dffda7367438a" alt="Short vs long" data-og-width="571" width="571" data-og-height="372" height="372" data-path="oss/images/short-vs-long.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?w=280&fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=b4f9851d9d5e9537fd9b4beeed7eefd5 280w, https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?w=560&fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=52fb6135668273aa8dfc615536c489b3 560w, https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?w=840&fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=0b6a2c6fe724a7db64dd4ad2677f5721 840w, https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?w=1100&fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=0e7ed889aef106cc3190b8b58a159b9c 1100w, https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?w=1650&fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=1997d5223d23ada411cce7d1170d6795 1650w, https://mintcdn.com/langchain-5e9cc07a/dL5Sn6Cmy9pwtY0V/oss/images/short-vs-long.png?w=2500&fit=max&auto=format&n=dL5Sn6Cmy9pwtY0V&q=85&s=731fe49d8d020f517e88cc90302618a5 2500w" />

[Short-term memory](/oss/python/langgraph/add-memory#add-short-term-memory) lets your application remember previous interactions within a single [thread](/oss/python/langgraph/persistence#threads) or conversation. A [thread](/oss/python/langgraph/persistence#threads) organizes multiple interactions in a session, similar to the way email groups messages in a single conversation.

LangGraph manages short-term memory as part of the agent's state, persisted via thread-scoped checkpoints. This state can normally include the conversation history along with other stateful data, such as uploaded files, retrieved documents, or generated artifacts. By storing these in the graph's state, the bot can access the full context for a given conversation while maintaining separation between different threads.

### Manage short-term memory

Conversation history is the most common form of short-term memory, and long conversations pose a challenge to today's LLMs. A full history may not fit inside an LLM's context window, resulting in an irrecoverable error. Even if your LLM supports the full context length, most LLMs still perform poorly over long contexts. They get "distracted" by stale or off-topic content, all while suffering from slower response times and higher costs.

Chat models accept context using messages, which include developer provided instructions (a system message) and user inputs (human messages). In chat applications, messages alternate between human inputs and model responses, resulting in a list of messages that grows longer over time. Because context windows are limited and token-rich message lists can be costly, many applications can benefit from using techniques to manually remove or forget stale information.

<img src="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=89c50725dda7add80732bd2096e07ef2" alt="Filter" data-og-width="594" width="594" data-og-height="200" height="200" data-path="oss/images/filter.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?w=280&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=c5ffb27755202e7b13498e8c5e1c2765 280w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?w=560&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=5abdad922fc7ea2770fa48825eb210ed 560w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?w=840&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=d4dd4837a3a08a42b14f267c45f9e73e 840w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?w=1100&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=ea09b560d904b68a4d7f370c88b908ef 1100w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?w=1650&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=a83c084c37d9a34547f5435d9c6a6cc6 1650w, https://mintcdn.com/langchain-5e9cc07a/-_xGPoyjhyiDWTPJ/oss/images/filter.png?w=2500&fit=max&auto=format&n=-_xGPoyjhyiDWTPJ&q=85&s=164042153f379621c9d1558ea129caac 2500w" />

For more information on common techniques for managing messages, see the [Add and manage memory](/oss/python/langgraph/add-memory#manage-short-term-memory) guide.

[Long-term memory](/oss/python/langgraph/add-memory#add-long-term-memory) in LangGraph allows systems to retain information across different conversations or sessions. Unlike short-term memory, which is **thread-scoped**, long-term memory is saved within custom "namespaces."

Long-term memory is a complex challenge without a one-size-fits-all solution. However, the following questions provide a framework to help you navigate the different techniques:

* What is the type of memory? Humans use memories to remember facts ([semantic memory](#semantic-memory)), experiences ([episodic memory](#episodic-memory)), and rules ([procedural memory](#procedural-memory)). AI agents can use memory in the same ways. For example, AI agents can use memory to remember specific facts about a user to accomplish a task.
* [When do you want to update memories?](#writing-memories) Memory can be updated as part of an agent's application logic (e.g., "on the hot path"). In this case, the agent typically decides to remember facts before responding to a user. Alternatively, memory can be updated as a background task (logic that runs in the background / asynchronously and generates memories). We explain the tradeoffs between these approaches in the [section below](#writing-memories).

Different applications require various types of memory. Although the analogy isn't perfect, examining [human memory types](https://www.psychologytoday.com/us/basics/memory/types-of-memory?ref=blog.langchain.dev) can be insightful. Some research (e.g., the [CoALA paper](https://arxiv.org/pdf/2309.02427)) have even mapped these human memory types to those used in AI agents.

| Memory Type                      | What is Stored | Human Example              | Agent Example       |
| -------------------------------- | -------------- | -------------------------- | ------------------- |
| [Semantic](#semantic-memory)     | Facts          | Things I learned in school | Facts about a user  |
| [Episodic](#episodic-memory)     | Experiences    | Things I did               | Past agent actions  |
| [Procedural](#procedural-memory) | Instructions   | Instincts or motor skills  | Agent system prompt |

[Semantic memory](https://en.wikipedia.org/wiki/Semantic_memory), both in humans and AI agents, involves the retention of specific facts and concepts. In humans, it can include information learned in school and the understanding of concepts and their relationships. For AI agents, semantic memory is often used to personalize applications by remembering facts or concepts from past interactions.

<Note>
  Semantic memory is different from "semantic search," which is a technique for finding similar content using "meaning" (usually as embeddings). Semantic memory is a term from psychology, referring to storing facts and knowledge, while semantic search is a method for retrieving information based on meaning rather than exact matches.
</Note>

Semantic memories can be managed in different ways:

Memories can be a single, continuously updated "profile" of well-scoped and specific information about a user, organization, or other entity (including the agent itself). A profile is generally just a JSON document with various key-value pairs you've selected to represent your domain.

When remembering a profile, you will want to make sure that you are **updating** the profile each time. As a result, you will want to pass in the previous profile and [ask the model to generate a new profile](https://github.com/langchain-ai/memory-template) (or some [JSON patch](https://github.com/hinthornw/trustcall) to apply to the old profile). This can be become error-prone as the profile gets larger, and may benefit from splitting a profile into multiple documents or **strict** decoding when generating documents to ensure the memory schemas remains valid.

<img src="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=8843788f6afd855450986c4cc4cd6abf" alt="Update profile" data-og-width="507" width="507" data-og-height="516" height="516" data-path="oss/images/update-profile.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?w=280&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=0e40fc4d0951eccd4786df184513d73c 280w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?w=560&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=3724f1b77f1f2fee60fa9fe5e8479fc7 560w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?w=840&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=ba05c4768f99f62034c863fc7d824a1a 840w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?w=1100&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=055289accf7ad32f8e884697c1dcdab3 1100w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?w=1650&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=0ae25038922234d8fd5bc6b5eb5585ac 1650w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-profile.png?w=2500&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=bb4c602c662cdc2104825deec43f113f 2500w" />

Alternatively, memories can be a collection of documents that are continuously updated and extended over time. Each individual memory can be more narrowly scoped and easier to generate, which means that you're less likely to **lose** information over time. It's easier for an LLM to generate *new* objects for new information than reconcile new information with an existing profile. As a result, a document collection tends to lead to [higher recall downstream](https://en.wikipedia.org/wiki/Precision_and_recall).

However, this shifts some complexity memory updating. The model must now *delete* or *update* existing items in the list, which can be tricky. In addition, some models may default to over-inserting and others may default to over-updating. See the [Trustcall](https://github.com/hinthornw/trustcall) package for one way to manage this and consider evaluation (e.g., with a tool like [LangSmith](https://docs.langchain.com/langsmith/evaluation)) to help you tune the behavior.

Working with document collections also shifts complexity to memory **search** over the list. The `Store` currently supports both [semantic search](https://langchain-ai.github.io/langgraph/reference/store/#langgraph.store.base.SearchOp.query) and [filtering by content](https://langchain-ai.github.io/langgraph/reference/store/#langgraph.store.base.SearchOp.filter).

Finally, using a collection of memories can make it challenging to provide comprehensive context to the model. While individual memories may follow a specific schema, this structure might not capture the full context or relationships between memories. As a result, when using these memories to generate responses, the model may lack important contextual information that would be more readily available in a unified profile approach.

<img src="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=38851b242981cc87128620091781f7c9" alt="Update list" data-og-width="483" width="483" data-og-height="491" height="491" data-path="oss/images/update-list.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?w=280&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=1086a0d1728b213a85180db2c327b038 280w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?w=560&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=1e1b85bbc04bfef17f131e5b65cababc 560w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?w=840&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=77eb8e9b9d8afd4a2e7a05626b98afa4 840w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?w=1100&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=2745997869c9e572b3b2fe2826aa3b7f 1100w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?w=1650&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=3f69fc65b91598673364628ffe989b89 1650w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/update-list.png?w=2500&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=f8d229bd8bc606b6471b1619aed75be3 2500w" />

Regardless of memory management approach, the central point is that the agent will use the semantic memories to [ground its responses](/oss/python/langchain/retrieval), which often leads to more personalized and relevant interactions.

[Episodic memory](https://en.wikipedia.org/wiki/Episodic_memory), in both humans and AI agents, involves recalling past events or actions. The [CoALA paper](https://arxiv.org/pdf/2309.02427) frames this well: facts can be written to semantic memory, whereas *experiences* can be written to episodic memory. For AI agents, episodic memory is often used to help an agent remember how to accomplish a task.

In practice, episodic memories are often implemented through few-shot example prompting, where agents learn from past sequences to perform tasks correctly. Sometimes it's easier to "show" than "tell" and LLMs learn well from examples. Few-shot learning lets you ["program"](https://x.com/karpathy/status/1627366413840322562) your LLM by updating the prompt with input-output examples to illustrate the intended behavior. While various best-practices can be used to generate few-shot examples, often the challenge lies in selecting the most relevant examples based on user input.

Note that the memory [store](/oss/python/langgraph/persistence#memory-store) is just one way to store data as few-shot examples. If you want to have more developer involvement, or tie few-shots more closely to your evaluation harness, you can also use a [LangSmith Dataset](/langsmith/index-datasets-for-dynamic-few-shot-example-selection) to store your data. Then dynamic few-shot example selectors can be used out-of-the box to achieve this same goal. LangSmith will index the dataset for you and enable retrieval of few shot examples that are most relevant to the user input based upon keyword similarity ([using a BM25-like algorithm](/langsmith/index-datasets-for-dynamic-few-shot-example-selection) for keyword based similarity).

See this how-to [video](https://www.youtube.com/watch?v=37VaU7e7t5o) for example usage of dynamic few-shot example selection in LangSmith. Also, see this [blog post](https://blog.langchain.dev/few-shot-prompting-to-improve-tool-calling-performance/) showcasing few-shot prompting to improve tool calling performance and this [blog post](https://blog.langchain.dev/aligning-llm-as-a-judge-with-human-preferences/) using few-shot example to align an LLMs to human preferences.

### Procedural memory

[Procedural memory](https://en.wikipedia.org/wiki/Procedural_memory), in both humans and AI agents, involves remembering the rules used to perform tasks. In humans, procedural memory is like the internalized knowledge of how to perform tasks, such as riding a bike via basic motor skills and balance. Episodic memory, on the other hand, involves recalling specific experiences, such as the first time you successfully rode a bike without training wheels or a memorable bike ride through a scenic route. For AI agents, procedural memory is a combination of model weights, agent code, and agent's prompt that collectively determine the agent's functionality.

In practice, it is fairly uncommon for agents to modify their model weights or rewrite their code. However, it is more common for agents to modify their own prompts.

One effective approach to refining an agent's instructions is through ["Reflection"](https://blog.langchain.dev/reflection-agents/) or meta-prompting. This involves prompting the agent with its current instructions (e.g., the system prompt) along with recent conversations or explicit user feedback. The agent then refines its own instructions based on this input. This method is particularly useful for tasks where instructions are challenging to specify upfront, as it allows the agent to learn and adapt from its interactions.

For example, we built a [Tweet generator](https://www.youtube.com/watch?v=Vn8A3BxfplE) using external feedback and prompt re-writing to produce high-quality paper summaries for Twitter. In this case, the specific summarization prompt was difficult to specify *a priori*, but it was fairly easy for a user to critique the generated Tweets and provide feedback on how to improve the summarization process.

The below pseudo-code shows how you might implement this with the LangGraph memory [store](/oss/python/langgraph/persistence#memory-store), using the store to save a prompt, the `update_instructions` node to get the current prompt (as well as feedback from the conversation with the user captured in `state["messages"]`), update the prompt, and save the new prompt back to the store. Then, the `call_model` get the updated prompt from the store and uses it to generate a response.

```python  theme={null}

---

## Mirror images for your LangSmith installation

**URL:** llms-txt#mirror-images-for-your-langsmith-installation

**Contents:**
- Requirements
- Mirroring the Images

Source: https://docs.langchain.com/langsmith/self-host-mirroring-images

By default, LangSmith will pull images from our public Docker registry. However, if you are running LangSmith in an environment that does not have internet access, or if you would like to use a private Docker registry, you can mirror the images to your own registry and then configure your LangSmith installation to use those images.

* Authenticated access to a Docker registry that your Kubernetes cluster/machine has access to.
* Docker installed on your local machine or a machine that has access to the Docker registry.
* A Kubernetes cluster or a machine where you can run LangSmith.

## Mirroring the Images

For your convenience, we have provided a script that will mirror the images for you. You can find the script in the [LangSmith Helm Chart repository](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/scripts/mirror_langsmith_images.sh)

To use the script, you will need to run the script with the following command specifying your registry and platform:

Where `<your-registry>` is the URL of your Docker registry (e.g. `myregistry.com`) and `<platform>` is the platform you are using (e.g. `linux/amd64`, `linux/arm64`, etc.). If you do not specify a platform, it will default to `linux/amd64`.

For example, if your registry is `myregistry.com`, your platform is `linux/arm64`, and you want to use the latest version of the images, you would run:

Note that this script will assume that you have Docker installed and that you are authenticated to your registry. It will also push the images to the specified registry with the same repository/tag as the original images.

Alternatively, you can pull, mirror, and push the images manually. The images that you will need to mirror are found in the `values.yaml` file of the LangSmith Helm Chart. These can be found here: [LangSmith Helm Chart values.yaml](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L14)

Here is an example of how to mirror the images using Docker:

```bash  theme={null}

**Examples:**

Example 1 (unknown):
```unknown
Where `<your-registry>` is the URL of your Docker registry (e.g. `myregistry.com`) and `<platform>` is the platform you are using (e.g. `linux/amd64`, `linux/arm64`, etc.). If you do not specify a platform, it will default to `linux/amd64`.

For example, if your registry is `myregistry.com`, your platform is `linux/arm64`, and you want to use the latest version of the images, you would run:
```

Example 2 (unknown):
```unknown
Note that this script will assume that you have Docker installed and that you are authenticated to your registry. It will also push the images to the specified registry with the same repository/tag as the original images.

Alternatively, you can pull, mirror, and push the images manually. The images that you will need to mirror are found in the `values.yaml` file of the LangSmith Helm Chart. These can be found here: [LangSmith Helm Chart values.yaml](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L14)

Here is an example of how to mirror the images using Docker:
```

---

## Model Context Protocol (MCP)

**URL:** llms-txt#model-context-protocol-(mcp)

**Contents:**
- Quickstart
- Custom servers
- Transports
  - HTTP
  - stdio
- Stateful sessions

Source: https://docs.langchain.com/oss/python/langchain/mcp

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is an open protocol that standardizes how applications provide tools and context to LLMs. LangChain agents can use tools defined on MCP servers using the [`langchain-mcp-adapters`](https://github.com/langchain-ai/langchain-mcp-adapters) library.

Install the `langchain-mcp-adapters` library:

`langchain-mcp-adapters` enables agents to use tools defined across one or more MCP servers.

<Note>
  `MultiServerMCPClient` is **stateless by default**. Each tool invocation creates a fresh MCP `ClientSession`, executes the tool, and then cleans up. See the [stateful sessions](#stateful-sessions) section for more details.
</Note>

To create a custom MCP server, use the [FastMCP](https://gofastmcp.com/getting-started/welcome) library:

To test your agent with MCP tool servers, use the following examples:

MCP supports different transport mechanisms for client-server communication.

The `http` transport (also referred to as `streamable-http`) uses HTTP requests for client-server communication. See the [MCP HTTP transport specification](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) for more details.

When connecting to MCP servers over HTTP, you can include custom headers (e.g., for authentication or tracing) using the `headers` field in the connection configuration. This is supported for `sse` (deprecated by MCP spec) and `streamable_http` transports.

The `langchain-mcp-adapters` library uses the official [MCP SDK](https://github.com/modelcontextprotocol/python-sdk) under the hood, which allows you to provide a custom authentication mechanism by implementing the `httpx.Auth` interface.

* [Example custom auth implementation](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/clients/simple-auth-client/mcp_simple_auth_client/main.py)
* [Built-in OAuth flow](https://github.com/modelcontextprotocol/python-sdk/blob/main/src/mcp/client/auth.py#L179)

Client launches server as a subprocess and communicates via standard input/output. Best for local tools and simple setups.

<Note>
  Unlike HTTP transports, `stdio` connections are inherently **stateful**—the subprocess persists for the lifetime of the client connection. However, when using `MultiServerMCPClient` without explicit session management, each tool call still creates a new session. See [stateful sessions](#stateful-sessions) for managing persistent connections.
</Note>

By default, `MultiServerMCPClient` is **stateless**—each tool invocation creates a fresh MCP session, executes the tool, and then cleans up.

If you need to control the [lifecycle](https://modelcontextprotocol.io/specification/2025-03-26/basic/lifecycle) of an MCP session (for example, when working with a stateful server that maintains context across tool calls), you can create a persistent `ClientSession` using `client.session()`.

```python Using MCP ClientSession for stateful tool usage theme={null}
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain.agents import create_agent

client = MultiServerMCPClient({...})

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

`langchain-mcp-adapters` enables agents to use tools defined across one or more MCP servers.

<Note>
  `MultiServerMCPClient` is **stateless by default**. Each tool invocation creates a fresh MCP `ClientSession`, executes the tool, and then cleans up. See the [stateful sessions](#stateful-sessions) section for more details.
</Note>
```

Example 3 (unknown):
```unknown
## Custom servers

To create a custom MCP server, use the [FastMCP](https://gofastmcp.com/getting-started/welcome) library:

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Must have 'pandas' installed.

**URL:** llms-txt#must-have-'pandas'-installed.

df = experiment.to_pandas()
df[["inputs.question", "outputs.answer", "reference.answer", "feedback.is_concise"]]
python  theme={null}
{'question': 'What is the largest mammal?'}
{'answer': "What is the largest mammal? is a good question. I don't know the answer."}
{'question': 'What do mammals and birds have in common?'}
{'answer': "What do mammals and birds have in common? is a good question. I don't know the answer."}
```

|   | inputs.question                           | outputs.answer                                                                         | reference.answer           | feedback.is\_concise |
| - | ----------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------- | -------------------- |
| 0 | What is the largest mammal?               | What is the largest mammal? is a good question. I don't know the answer.               | The blue whale             | False                |
| 1 | What do mammals and birds have in common? | What do mammals and birds have in common? is a good question. I don't know the answer. | They are both warm-blooded | False                |

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/local.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown

```

---

## Overview

**URL:** llms-txt#overview

**Contents:**
- The agent loop
- Additional resources

Source: https://docs.langchain.com/oss/python/langchain/middleware/overview

Control and customize agent execution at every step

Middleware provides a way to more tightly control what happens inside the agent. Middleware is useful for the following:

* Tracking agent behavior with logging, analytics, and debugging.
* Transforming prompts, [tool selection](/oss/python/langchain/middleware/built-in#llm-tool-selector), and output formatting.
* Adding [retries](/oss/python/langchain/middleware/built-in#tool-retry), [fallbacks](/oss/python/langchain/middleware/built-in#model-fallback), and early termination logic.
* Applying [rate limits](/oss/python/langchain/middleware/built-in#model-call-limit), guardrails, and [PII detection](/oss/python/langchain/middleware/built-in#pii-detection).

Add middleware by passing them to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):

The core agent loop involves calling a model, letting it choose tools to execute, and then finishing when it calls no more tools:

<img src="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=ac72e48317a9ced68fd1be64e89ec063" alt="Core agent loop diagram" style={{height: "200px", width: "auto", justifyContent: "center"}} className="rounded-lg block mx-auto" data-og-width="300" width="300" data-og-height="268" height="268" data-path="oss/images/core_agent_loop.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=280&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=a4c4b766b6678ef52a6ed556b1a0b032 280w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=560&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=111869e6e99a52c0eff60a1ef7ddc49c 560w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=840&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=6c1e21de7b53bd0a29683aca09c6f86e 840w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1100&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=88bef556edba9869b759551c610c60f4 1100w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1650&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=9b0bdd138e9548eeb5056dc0ed2d4a4b 1650w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=2500&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=41eb4f053ed5e6b0ba5bad2badf6d755 2500w" />

Middleware exposes hooks before and after each of those steps:

<img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware flow diagram" style={{height: "300px", width: "auto", justifyContent: "center"}} className="rounded-lg mx-auto" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />

## Additional resources

<CardGroup cols={2}>
  <Card title="Built-in middleware" icon="box" href="/oss/python/langchain/middleware/built-in">
    Explore built-in middleware for common use cases.
  </Card>

<Card title="Custom middleware" icon="code" href="/oss/python/langchain/middleware/custom">
    Build your own middleware with hooks and decorators.
  </Card>

<Card title="Middleware API reference" icon="book" href="https://reference.langchain.com/python/langchain/middleware/">
    Complete API reference for middleware.
  </Card>

<Card title="Testing agents" icon="scale-unbalanced" href="/oss/python/langchain/test">
    Test your agents with LangSmith.
  </Card>
</CardGroup>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/middleware/overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Philosophy

**URL:** llms-txt#philosophy

**Contents:**
- History

Source: https://docs.langchain.com/oss/python/langchain/philosophy

LangChain exists to be the easiest place to start building with LLMs, while also being flexible and production-ready.

LangChain is driven by a few core beliefs:

* Large Language Models (LLMs) are great, powerful new technology.
* LLMs are even better when you combine them with external sources of data.
* LLMs will transform what the applications of the future look like. Specifically, the applications of the future will look more and more agentic.
* It is still very early on in that transformation.
* While it's easy to build a prototype of those agentic applications, it's still really hard to build agents that are reliable enough to put into production.

With LangChain, we have two core focuses:

<Steps>
  <Step title="We want to enable developers to build with the best models.">
    Different providers expose different APIs, with different model parameters and different message formats.
    Standardizing these model inputs and outputs is a core focus, making it easy for developer to easily change to the most recent state-of-the-art model, avoiding lock-in.
  </Step>

<Step title="We want to make it easy to use models to orchestrate more complex flows that interact with other data and computation.">
    Models should be used for more than just *text generation* - they should also be used to orchestrate more complex flows that interact with other data. LangChain makes it easy to define [tools](/oss/python/langchain/tools) that LLMs can use dynamically, as well as help with parsing of and access to unstructured data.
  </Step>
</Steps>

Given the constant rate of change in the field, LangChain has also evolved over time. Below is a brief timeline of how LangChain has changed over the years, evolving alongside what it means to build with LLMs:

<Update label="2022-10-24" description="v0.0.1">
  A month before ChatGPT, **LangChain was launched as a Python package**. It consisted of two main components:

* LLM abstractions
  * "Chains", or predetermined steps of computation to run, for common use cases. For example - RAG: run a retrieval step, then run a generation step.

The name LangChain comes from "Language" (like Language models) and "Chains".
</Update>

<Update label="2022-12">
  The first general purpose agents were added to LangChain.

These general purpose agents were based on the [ReAct paper](https://arxiv.org/abs/2210.03629) (ReAct standing for Reasoning and Acting). They used LLMs to generate JSON that represented tool calls, and then parsed that JSON to determine what tools to call.
</Update>

<Update label="2023-01">
  OpenAI releases a 'Chat Completion' API.

Previously, models took in strings and returned a string. In the ChatCompletions API, they evolved to take in a list of messages and return a message. Other model providers followed suit, and LangChain updated to work with lists of messages.
</Update>

<Update label="2023-01">
  LangChain releases a JavaScript version.

LLMs and agents will change how applications are built and JavaScript is the language of application developers.
</Update>

<Update label="2023-02">
  **LangChain Inc. was formed as a company** around the open source LangChain project.

The main goal was to "make intelligent agents ubiquitous". The team recognized that while LangChain was a key part (LangChain made it simple to get started with LLMs), there was also a need for other components.
</Update>

<Update label="2023-03">
  OpenAI releases 'function calling' in their API.

This allowed the API to explicitly generate payloads that represented tool calls. Other model providers followed suit, and LangChain was updated to use this as the preferred method for tool calling (rather than parsing JSON).
</Update>

<Update label="2023-06">
  **LangSmith is released** as closed source platform by LangChain Inc., providing observability and evals

The main issue with building agents is getting them to be reliable, and LangSmith, which provides observability and evals, was built to solve that need. LangChain was updated to integrate seamlessly with LangSmith.
</Update>

<Update label="2024-01" description="v0.1.0">
  **LangChain releases 0.1.0**, its first non-0.0.x.

The industry matured from prototypes to production, and as such, LangChain increased its focus on stability.
</Update>

<Update label="2024-02">
  **LangGraph is released** as an open-source library.

The original LangChain had two focuses: LLM abstractions, and high-level interfaces for getting started with common applications; however, it was missing a low-level orchestration layer that allowed developers to control the exact flow of their agent. Enter: LangGraph.

When building LangGraph, we learned from lessons when building LangChain and added functionality we discovered was needed: streaming, durable execution, short-term memory, human-in-the-loop, and more.
</Update>

<Update label="2024-06">
  **LangChain has over 700 integrations.**

Integrations were split out of the core LangChain package, and either moved into their own standalone packages (for the core integrations) or `langchain-community`.
</Update>

<Update label="2024-10">
  LangGraph becomes the preferred way to build any AI application that is more than a single LLM call.

As developers tried to improve the reliability of their applications, they needed more control than the high-level interfaces provided. LangGraph provided that low-level flexibility. Most chains and agents were marked as deprecated in LangChain with guides on how to migrate them to LangGraph. There is still one high-level abstraction created in LangGraph: an agent abstraction. It is built on top of low-level LangGraph and has the same interface as the ReAct agents from LangChain.
</Update>

<Update label="2025-04">
  Model APIs become more multimodal.

Models started to accept files, images, videos, and more. We updated the `langchain-core` message format accordingly to allow developers to specify these multimodal inputs in a standard way.
</Update>

<Update label="2025-10-20" description="v1.0.0">
  **LangChain releases 1.0** with two major changes:

1. Complete revamp of all chains and agents in `langchain`. All chains and agents are now replaced with only one high level abstraction: an agent abstraction built on top of LangGraph. This was the high-level abstraction that was originally created in LangGraph, but just moved to LangChain.

For users still using old LangChain chains/agents who do NOT want to upgrade (note: we recommend you do), you can continue using old LangChain by installing the `langchain-classic` package.

2. A standard message content format: Model APIs evolved from returning messages with a simple content string to more complex output types - reasoning blocks, citations, server-side tool calls, etc. LangChain evolved its message formats to standardize these across providers.
</Update>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/philosophy.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## pip install -qU langchain "langchain[anthropic]"

**URL:** llms-txt#pip-install--qu-langchain-"langchain[anthropic]"

from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

---

## pip install requests requests_toolbelt

**URL:** llms-txt#pip-install-requests-requests_toolbelt

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/trace-with-api.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

---

## Prompt engineering quickstart

**URL:** llms-txt#prompt-engineering-quickstart

**Contents:**
- Prerequisites
- Next steps
- Video guide

Source: https://docs.langchain.com/langsmith/prompt-engineering-quickstart

Prompts guide the behavior of Large Language Models (LLM). [*Prompt engineering*](/langsmith/prompt-engineering-concepts) is the process of crafting, testing, and refining the instructions you give to an LLM so it produces reliable and useful responses.

LangSmith provides tools to create, version, test, and collaborate on prompts. You’ll also encounter common concepts like [*prompt templates*](/langsmith/prompt-engineering-concepts#prompts-vs-prompt-templates), which let you reuse structured prompts, and [*variables*](/langsmith/prompt-engineering-concepts#f-string-vs-mustache), which allow you to dynamically insert values (such as a user’s question) into a prompt.

In this quickstart, you’ll create, test, and improve prompts using either the UI or the SDK. This quickstart will use OpenAI as the example LLM provider, but the same workflow applies across other providers.

<Tip>
  If you prefer to watch a video on getting started with prompt engineering, refer to the quickstart [Video guide](#video-guide).
</Tip>

Before you begin, make sure you have:

* **A LangSmith account**: Sign up or log in at [smith.langchain.com](https://smith.langchain.com).
* **A LangSmith API key**: Follow the [Create an API key](/langsmith/create-account-api-key#create-an-api-key) guide.
* **An OpenAI API key**: Generate this from the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

Select the tab for UI or SDK workflows:

<Tabs>
  <Tab title="UI" icon="window">
    ## 1. Set workspace secret

In the [LangSmith UI](https://smith.langchain.com), ensure that your OpenAI API key is set as a [workspace secret](/langsmith/administration-overview#workspace-secrets).

1. Navigate to <Icon icon="gear" /> **Settings** and then move to the **Secrets** tab.
    2. Select **Add secret** and enter the `OPENAI_API_KEY` and your API key as the **Value**.
    3. Select **Save secret**.

<Note> When adding workspace secrets in the LangSmith UI, make sure the secret keys match the environment variable names expected by your model provider.</Note>

## 2. Create a prompt

1. In the [LangSmith UI](https://smith.langchain.com), navigate to the **Prompts** section in the left-hand menu.
    2. Click on **+ Prompt** to create a prompt.
    3. Modify the prompt by editing or adding prompts and input variables as needed.

<div style={{ textAlign: 'center' }}>
      <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=0cafd7b1330fd88caa7403772068a50d" alt="Prompt playground with the system prompt ready for editing." data-og-width="951" width="951" data-og-height="412" height="412" data-path="langsmith/images/create-a-prompt-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?w=280&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=86270ac274480c09b4b772c79835c96a 280w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?w=560&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=0bba28323e21330632a3368603cfd436 560w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?w=840&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=7c6ec959c52230f4a9c1153e05c2a257 840w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?w=1100&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=3c76f683eb2ef9c71dc1a3d7e337fffb 1100w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?w=1650&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=b900411f7aa605f20f6c5182834bf4c3 1650w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-light.png?w=2500&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=b3b11c7507cc57b2fc178b251c0173dc 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=16f217eb0e1c0b02ad0d7658f1a53f4d" alt="Prompt playground with the system prompt ready for editing." data-og-width="937" width="937" data-og-height="402" height="402" data-path="langsmith/images/create-a-prompt-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?w=280&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=401ae88da122905ab2e820fc22ce1b37 280w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?w=560&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=61c573f773dec1485545395c1fd37525 560w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?w=840&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=0fd582cf184a36f1f2ce7dc21d7be9b9 840w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?w=1100&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=32408b98f4df25413ba0e78b85c7b483 1100w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?w=1650&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=102ecf375a8d66ac339b12bc163588e7 1650w, https://mintcdn.com/langchain-5e9cc07a/t6ucb6rQa27Wd6Te/langsmith/images/create-a-prompt-dark.png?w=2500&fit=max&auto=format&n=t6ucb6rQa27Wd6Te&q=85&s=3543f050b1e4e0e581c4386304284039 2500w" />
    </div>

1. Under the **Prompts** heading select the gear <Icon icon="gear" iconType="solid" /> icon next to the model name, which will launch the **Prompt Settings** window on the **Model Configuration** tab.

2. Set the [model configuration](/langsmith/managing-model-configurations) you want to use. The **Provider** and **Model** you select will determine the parameters that are configurable on this configuration page. Once set, click **Save as**.

<div style={{ textAlign: 'center' }}>
         <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=6c0f7d7012b1e5295fe545149f955e6b" alt="Model Configuration window in the LangSmith UI, settings for Provider, Model, Temperature, Max Output Tokens, Top P, Presence Penalty, Frequency Penalty, Reasoning Effort, etc." data-og-width="886" width="886" data-og-height="689" height="689" data-path="langsmith/images/model-config-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?w=280&fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=4e3b9ad92f6f14f4e0523bef50199318 280w, https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?w=560&fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=e538eb740495a8afa8bfc552b13ae294 560w, https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?w=840&fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=ebe73264e977153c869fd04d1552d09b 840w, https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?w=1100&fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=2eeb01882056046bc73cc019d674af7e 1100w, https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?w=1650&fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=8f28fe2fe8054cf0623fb9d17f91966f 1650w, https://mintcdn.com/langchain-5e9cc07a/6r3GRtwWCl4ozaHW/langsmith/images/model-config-light.png?w=2500&fit=max&auto=format&n=6r3GRtwWCl4ozaHW&q=85&s=cf9ad39be3623e73322d123699e73f19 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=2e9da272c3fc8f7ac958c6e6d1da85e3" alt="Model Configuration window in the LangSmith UI, settings for Provider, Model, Temperature, Max Output Tokens, Top P, Presence Penalty, Frequency Penalty, Reasoning Effort, etc." data-og-width="881" width="881" data-og-height="732" height="732" data-path="langsmith/images/model-config-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?w=280&fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=652fb75a4682cfc813743a1260764e59 280w, https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?w=560&fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=02c980a8387f3d69a5870660b1668080 560w, https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?w=840&fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=ee633c06056fa7ad46ea58a179afa169 840w, https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?w=1100&fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=f62a35ed726b5f89c156a40c9ea76f2c 1100w, https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?w=1650&fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=18114575db8e6c7ce928763ddcb88c12 1650w, https://mintcdn.com/langchain-5e9cc07a/ppc8uxWc01j4q7Ia/langsmith/images/model-config-dark.png?w=2500&fit=max&auto=format&n=ppc8uxWc01j4q7Ia&q=85&s=ab24dc4975def52db55c4896ead5b77c 2500w" />
       </div>

3. Specify the input variables you would like to test in the **Inputs** box and then click <Icon icon="circle-play" iconType="solid" /> **Start**.

<div style={{ textAlign: 'center' }}>
         <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=bd86e76180c022a110ca0f0d9d19a198" alt="The input box with a question entered. The output box contains the response to the prompt." data-og-width="702" width="702" data-og-height="763" height="763" data-path="langsmith/images/set-input-start-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?w=280&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=dc5f16c448685e182a0001b9dbcb1afd 280w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?w=560&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=372a5f62109cd09b57ba2ca11d73c65b 560w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?w=840&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=1fcd9d131af34af4b5e10ab5fea2a9f8 840w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?w=1100&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=f30ae237c4d2cf55918918eca39bb5e9 1100w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?w=1650&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=26326dd6839418f161f6393118f8c441 1650w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-light.png?w=2500&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=2654906d801046f11e6f96bfa7c7a59e 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=bfd369e7426a57fc0cad75df8dd6942d" alt="The input box with a question entered. The output box contains the response to the prompt." data-og-width="698" width="698" data-og-height="769" height="769" data-path="langsmith/images/set-input-start-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?w=280&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=9538e3e173a2f19994f08865a389f247 280w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?w=560&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=fc8dc91b4564531bb5a27b971ca27c3e 560w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?w=840&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=ae9db3c1ec55c4653ad86b95addeec12 840w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?w=1100&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=0f169783a075952a0066de46aeb3bdc7 1100w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?w=1650&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=686196a3493642cf70ff89aa235a6715 1650w, https://mintcdn.com/langchain-5e9cc07a/8DPu7MR3QecByOI5/langsmith/images/set-input-start-dark.png?w=2500&fit=max&auto=format&n=8DPu7MR3QecByOI5&q=85&s=0532f0c8cf0ff37ed7c9da7a67bf6700 2500w" />
       </div>

To learn about more options for configuring your prompt in the Playground, refer to [Configure prompt settings](/langsmith/managing-model-configurations).

4. After testing and refining your prompt, click **Save** to store it for future use.

## 4. Iterate on a prompt

LangSmith allows for team-based prompt iteration. [Workspace](/langsmith/administration-overview#workspaces) members can experiment with prompts in the playground and save their changes as a new [*commit*](/langsmith/prompt-engineering-concepts#commits) when ready.

To improve your prompts:

* Reference the documentation provided by your model provider for best practices in prompt creation, such as:
      * [Best practices for prompt engineering with the OpenAI API](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
      * [Gemini's Introduction to prompt design](https://ai.google.dev/gemini-api/docs/prompting-intro)
    * Build and refine your prompts with the Prompt Canvas—an interactive tool in LangSmith. Learn more in the [Prompt Canvas guide](/langsmith/write-prompt-with-ai).
    * Tag specific commits to mark important moments in your commit history.

1. To create a commit, navigate to the **Playground** and select **Commit**. Choose the prompt to commit changes to and then **Commit**.
      2. Navigate to **Prompts** in the left-hand menu. Select the prompt. Once on the prompt's detail page, move to the **Commits** tab. Find the tag icon <Icon icon="tag" iconType="solid" /> to **Add a Commit Tag**.

<div style={{ textAlign: 'center' }}>
        <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=80e7b49cb4036e15369c9e417d1d63ad" alt="The tag, the commit tag box with the commit label, and the commit tag name box to create the tag." data-og-width="702" width="702" data-og-height="226" height="226" data-path="langsmith/images/add-commit-tag-light.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?w=280&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=bbed6d72fa9986d211195f7cb6e3bbc3 280w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?w=560&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=93623e1b7ae7b4c9826c7a76694dd43d 560w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?w=840&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=c9ccfe378c982af55b6781691b0c6a1b 840w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?w=1100&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=d9464f4655a0ba67b81916eb9e69cdbc 1100w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?w=1650&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=43b3ad05600b7c9e0883541acccb1cc5 1650w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-light.png?w=2500&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=69019a8aad0d4733333f0f69ad468171 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=80883a09fbaea8c892d0a7de88f7a6ca" alt="The tag, the commit tag box with the commit label, and the commit tag name box to create the tag." data-og-width="698" width="698" data-og-height="221" height="221" data-path="langsmith/images/add-commit-tag-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?w=280&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=0c7eb9c966673a410811a5a08a39cbf7 280w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?w=560&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=9976856ffeca88d9f8d856e0d7766613 560w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?w=840&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=9a79984ca88bd3fa74b512ce8b26430b 840w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?w=1100&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=82c269188447b9ecf9f7ff17fa9805ec 1100w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?w=1650&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=83e03a2d056fc81440e6f11acfa1479c 1650w, https://mintcdn.com/langchain-5e9cc07a/7n0eM_8e3pn_DFNx/langsmith/images/add-commit-tag-dark.png?w=2500&fit=max&auto=format&n=7n0eM_8e3pn_DFNx&q=85&s=cc7d694fc1cc6c4a76c7dca4a9ed9dc4 2500w" />
      </div>
  </Tab>

<Tab title="SDK" icon="code">
    ## 1. Set up your environment

1. In your terminal, prepare your environment:

2. Set your API keys:

## 2. Create a prompt

To create a prompt, you'll define a list of messages that you want in your prompt and then push to LangSmith.

Use the language-specific constructor and push method:

* Python: [`ChatPromptTemplate`](https://reference.langchain.com/python/langchain_core/prompts/#langchain_core.prompts.chat.ChatPromptTemplate) → [`client.push_prompt(...)`](https://docs.smith.langchain.com/reference/python/client/langsmith.client.Client#langsmith.client.Client.push_prompt)
    * TypeScript: [`ChatPromptTemplate.fromMessages(...)`](https://v03.api.js.langchain.com/classes/_langchain_core.prompts.ChatPromptTemplate.html#fromMessages) → [`client.pushPrompt(...)`](https://langsmith-docs-7jgx2bq8f-langchain.vercel.app/reference/js/classes/client.Client#pushprompt)

1. Add the following code to a `create_prompt` file:

This creates an ordered list of messages, wraps them in `ChatPromptTemplate`, and then pushes the prompt by name to your [workspace](/langsmith/administration-overview#workspaces) for versioning and reuse.

2. Run `create_prompt`:

Follow the resulting link to view the newly created Prompt Hub prompt in the LangSmith UI.

In this step, you'll pull the prompt you created in [step 2](#2-create-a-prompt) by name (`"prompt-quickstart"`), format it with a test input, convert it to OpenAI’s chat format, and call the OpenAI Chat Completions API.

Then, you'll iterate on the prompt by creating a new version. Members of your workspace can open an existing prompt, experiment with changes in the [UI](https://smith.langchain.com), and save those changes as a new commit on the same prompt, which preserves history for the whole team.

1. Add the following to a `test_prompt` file:

This loads the prompt by name using `pull` for the latest committed version of the prompt that you're testing. You can also specify a specific commit by passing the commit hash `"<prompt-name>:<commit-hash>"`

2. Run `test_prompt` :

3. To create a new version of a prompt, call the same push method you used initially with the same prompt name and your updated template. LangSmith will record it as a new commit and preserve prior versions.

Copy the following code to an `iterate_prompt` file:

4. Run `iterate_prompt` :

Now your prompt will contain two commits.

To improve your prompts:

* Reference the documentation provided by your model provider for best practices in prompt creation, such as:
      * [Best practices for prompt engineering with the OpenAI API](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
      * [Gemini's Introduction to prompt design](https://ai.google.dev/gemini-api/docs/prompting-intro)
    * Build and refine your prompts with the Prompt Canvas—an interactive tool in LangSmith. Learn more in the [Prompt Canvas guide](/langsmith/write-prompt-with-ai).
  </Tab>
</Tabs>

* Learn more about how to store and manage prompts using the Prompt Hub in the [Create a prompt guide](/langsmith/create-a-prompt).
* Learn how to set up the Playground to [Test multi-turn conversations](/langsmith/multiple-messages) in this tutorial.
* Learn how to test your prompt's performance over a dataset instead of individual examples, refer to [Run an evaluation from the Prompt Playground](/langsmith/run-evaluation-from-prompt-playground).

<Callout type="info" icon="bird">
  Use **[Polly](/langsmith/polly)** in the Playground to help optimize your prompts, generate tools, and create output schemas.
</Callout>

<iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/h4f6bIWGkog?si=IVJFfhldC7M3HL4G" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/prompt-engineering-quickstart.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
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

    2. Set your API keys:
```

Example 3 (unknown):
```unknown
## 2. Create a prompt

    To create a prompt, you'll define a list of messages that you want in your prompt and then push to LangSmith.

    Use the language-specific constructor and push method:

    * Python: [`ChatPromptTemplate`](https://reference.langchain.com/python/langchain_core/prompts/#langchain_core.prompts.chat.ChatPromptTemplate) → [`client.push_prompt(...)`](https://docs.smith.langchain.com/reference/python/client/langsmith.client.Client#langsmith.client.Client.push_prompt)
    * TypeScript: [`ChatPromptTemplate.fromMessages(...)`](https://v03.api.js.langchain.com/classes/_langchain_core.prompts.ChatPromptTemplate.html#fromMessages) → [`client.pushPrompt(...)`](https://langsmith-docs-7jgx2bq8f-langchain.vercel.app/reference/js/classes/client.Client#pushprompt)

    1. Add the following code to a `create_prompt` file:

       <CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Quickstart

**URL:** llms-txt#quickstart

Source: https://docs.langchain.com/oss/python/langgraph/quickstart

This quickstart demonstrates how to build a calculator agent using the LangGraph Graph API or the Functional API.

* [Use the Graph API](#use-the-graph-api) if you prefer to define your agent as a graph of nodes and edges.
* [Use the Functional API](#use-the-functional-api) if you prefer to define your agent as a single function.

For conceptual information, see [Graph API overview](/oss/python/langgraph/graph-api) and [Functional API overview](/oss/python/langgraph/functional-api).

<Info>
  For this example, you will need to set up a [Claude (Anthropic)](https://www.anthropic.com/) account and get an API key. Then, set the `ANTHROPIC_API_KEY` environment variable in your terminal.
</Info>

<Tabs>
  <Tab title="Use the Graph API">
    ## 1. Define tools and model

In this example, we'll use the Claude Sonnet 4.5 model and define tools for addition, multiplication, and division.

The graph's state is used to store the messages and the number of LLM calls.

<Tip>
      State in LangGraph persists throughout the agent's execution.

The `Annotated` type with `operator.add` ensures that new messages are appended to the existing list rather than replacing it.
    </Tip>

## 3. Define model node

The model node is used to call the LLM and decide whether to call a tool or not.

## 4. Define tool node

The tool node is used to call the tools and return the results.

## 5. Define end logic

The conditional edge function is used to route to the tool node or end based upon whether the LLM made a tool call.

## 6. Build and compile the agent

The agent is built using the [`StateGraph`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph) class and compiled using the [`compile`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.StateGraph.compile) method.

<Tip>
      To learn how to trace your agent with LangSmith, see the [LangSmith documentation](/langsmith/trace-with-langgraph).
    </Tip>

Congratulations! You've built your first agent using the LangGraph Graph API.

<Accordion title="Full code example">
      
    </Accordion>
  </Tab>

<Tab title="Use the Functional API">
    ## 1. Define tools and model

In this example, we'll use the Claude Sonnet 4.5 model and define tools for addition, multiplication, and division.

## 2. Define model node

The model node is used to call the LLM and decide whether to call a tool or not.

<Tip>
      The [`@task`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.task) decorator marks a function as a task that can be executed as part of the agent. Tasks can be called synchronously or asynchronously within your entrypoint function.
    </Tip>

## 3. Define tool node

The tool node is used to call the tools and return the results.

The agent is built using the [`@entrypoint`](https://reference.langchain.com/python/langgraph/func/#langgraph.func.entrypoint) function.

<Note>
      In the Functional API, instead of defining nodes and edges explicitly, you write standard control flow logic (loops, conditionals) within a single function.
    </Note>

<Tip>
      To learn how to trace your agent with LangSmith, see the [LangSmith documentation](/langsmith/trace-with-langgraph).
    </Tip>

Congratulations! You've built your first agent using the LangGraph Functional API.

<Accordion title="Full code example" icon="code">
      
    </Accordion>
  </Tab>
</Tabs>

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langgraph/quickstart.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## 2. Define state

    The graph's state is used to store the messages and the number of LLM calls.

    <Tip>
      State in LangGraph persists throughout the agent's execution.

      The `Annotated` type with `operator.add` ensures that new messages are appended to the existing list rather than replacing it.
    </Tip>
```

Example 2 (unknown):
```unknown
## 3. Define model node

    The model node is used to call the LLM and decide whether to call a tool or not.
```

Example 3 (unknown):
```unknown
## 4. Define tool node

    The tool node is used to call the tools and return the results.
```

Example 4 (unknown):
```unknown
## 5. Define end logic

    The conditional edge function is used to route to the tool node or end based upon whether the LLM made a tool call.
```

---

## Run a LangGraph app locally

**URL:** llms-txt#run-a-langgraph-app-locally

**Contents:**
- Prerequisites
- 1. Install the LangGraph CLI
- 2. Create a LangGraph app
- 3. Install dependencies
- 4. Create a `.env` file
- 5. Launch Agent Server
- 6. Test the API
- Next steps

Source: https://docs.langchain.com/langsmith/local-server

This quickstart shows you how to set up a LangGraph application locally for testing and development.

Before you begin, ensure you have an API key for [LangSmith](https://smith.langchain.com/settings) (free to sign up).

## 1. Install the LangGraph CLI

<Tabs>
  <Tab title="Python server">
    
  </Tab>

<Tab title="Node server">
    
  </Tab>
</Tabs>

## 2. Create a LangGraph app

Create a new app from the [`new-langgraph-project-python` template](https://github.com/langchain-ai/new-langgraph-project) or [`new-langgraph-project-js` template](https://github.com/langchain-ai/new-langgraphjs-project). This template demonstrates a single-node application you can extend with your own logic.

<Tabs>
  <Tab title="Python server">
    
  </Tab>

<Tab title="Node server">
    
  </Tab>
</Tabs>

<Tip>
  **Additional templates**<br />
  If you use [`langgraph new`](/langsmith/cli) without specifying a template, you will be presented with an interactive menu that will allow you to choose from a list of available templates.
</Tip>

## 3. Install dependencies

In the root of your new LangGraph app, install the dependencies in `edit` mode so your local changes are used by the server:

<Tabs>
  <Tab title="Python server">
    
  </Tab>

<Tab title="Node server">
    
  </Tab>
</Tabs>

## 4. Create a `.env` file

You will find a [`.env.example`](/langsmith/application-structure#configuration-file) in the root of your new LangGraph app. Create a `.env` file in the root of your new LangGraph app and copy the contents of the `.env.example` file into it, filling in the necessary API keys:

## 5. Launch Agent Server

Start the Agent Server locally:

<Tabs>
  <Tab title="Python server">
    
  </Tab>

<Tab title="Node server">
    
  </Tab>
</Tabs>

The [`langgraph dev`](/langsmith/cli) command starts [Agent Server](/langsmith/agent-server) in an in-memory mode. This mode is suitable for development and testing purposes.

<Tip>
  For production use, deploy Agent Server with a persistent storage backend. For more information, refer to the LangSmith [platform options](/langsmith/platform-setup).
</Tip>

<Tabs>
  <Tab title="Python SDK (async)">
    1. Install the LangGraph Python SDK:

2. Send a message to the assistant (threadless run):

<Tab title="Python SDK (sync)">
    1. Install the LangGraph Python SDK:

2. Send a message to the assistant (threadless run):

<Tab title="Javascript SDK">
    1. Install the LangGraph JS SDK:

2. Send a message to the assistant (threadless run):

<Tab title="Rest API">
    
  </Tab>
</Tabs>

Now that you have a LangGraph app running locally, you're ready to deploy it:

**Choose a hosting option for LangSmith:**

* [**Cloud**](/langsmith/cloud): Fastest setup, fully managed (recommended).
* [**Hybrid**](/langsmith/hybrid): <Tooltip tip="The runtime environment where your Agent Servers and agents execute.">Data plane</Tooltip> in your cloud, <Tooltip tip="The LangSmith UI and APIs for managing deployments.">control plane</Tooltip> managed by LangChain.
* [**Self-hosted**](/langsmith/self-hosted): Full control in your infrastructure.

For more details, refer to the [Platform setup comparison](/langsmith/platform-setup).

**Then deploy your app:**

* [Deploy to Cloud quickstart](/langsmith/deployment-quickstart): Quick setup guide.
* [Full Cloud setup guide](/langsmith/deploy-to-cloud): Comprehensive deployment documentation.

**Explore features:**

* **[Studio](/langsmith/studio)**: Visualize, interact with, and debug your application with the Studio UI. Try the [Studio quickstart](/langsmith/quick-start-studio).
* **API References**: [LangSmith Deployment API](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref/), [Python SDK](/langsmith/langgraph-python-sdk), [JS/TS SDK](/langsmith/langgraph-js-ts-sdk)

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/local-server.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
</Tab>

  <Tab title="Node server">
```

Example 2 (unknown):
```unknown
</Tab>
</Tabs>

## 2. Create a LangGraph app

Create a new app from the [`new-langgraph-project-python` template](https://github.com/langchain-ai/new-langgraph-project) or [`new-langgraph-project-js` template](https://github.com/langchain-ai/new-langgraphjs-project). This template demonstrates a single-node application you can extend with your own logic.

<Tabs>
  <Tab title="Python server">
```

Example 3 (unknown):
```unknown
</Tab>

  <Tab title="Node server">
```

Example 4 (unknown):
```unknown
</Tab>
</Tabs>

<Tip>
  **Additional templates**<br />
  If you use [`langgraph new`](/langsmith/cli) without specifying a template, you will be presented with an interactive menu that will allow you to choose from a list of available templates.
</Tip>

## 3. Install dependencies

In the root of your new LangGraph app, install the dependencies in `edit` mode so your local changes are used by the server:

<Tabs>
  <Tab title="Python server">
```

---

## Trace Claude Agent SDK

**URL:** llms-txt#trace-claude-agent-sdk

**Contents:**
- Installation
- Quickstart

Source: https://docs.langchain.com/langsmith/trace-claude-agent-sdk

The [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) is an SDK for building agentic applications with Claude. LangSmith provides native integration with the Claude Agent SDK to automatically trace your agent executions, tool calls, and interactions with Claude models.

Install the LangSmith integration for Claude Agent SDK

To enable LangSmith tracing for your Claude Agent SDK application, call `configure_claude_agent_sdk()` at the start of your application:

```python  theme={null}
import asyncio
from claude_agent_sdk import (
    ClaudeAgentOptions,
    ClaudeSDKClient,
    tool,
    create_sdk_mcp_server,
)
from typing import Any

from langsmith.integrations.claude_agent_sdk import configure_claude_agent_sdk

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

## Quickstart

To enable LangSmith tracing for your Claude Agent SDK application, call `configure_claude_agent_sdk()` at the start of your application:
```

---

## Trace with LangChain (Python and JS/TS)

**URL:** llms-txt#trace-with-langchain-(python-and-js/ts)

**Contents:**
- Installation
- Quick start
  - 1. Configure your environment

Source: https://docs.langchain.com/langsmith/trace-with-langchain

LangSmith integrates seamlessly with LangChain (Python and JavaScript), the popular open-source framework for building LLM applications.

Install the core library and the OpenAI integration for Python and JS (we use the OpenAI integration for the code snippets below).

For a full list of packages available, see the [LangChain docs](/oss/python/integrations/providers/overview).

### 1. Configure your environment

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

## Quick start

### 1. Configure your environment
```

---

## Trace with LiveKit

**URL:** llms-txt#trace-with-livekit

**Contents:**
- Installation
- Quickstart tutorial
  - Step 1: Set up your environment
  - Step 2: Download the span processor
  - Step 3: Create your voice agent file

Source: https://docs.langchain.com/langsmith/trace-with-livekit

LangSmith can capture traces generated by [LiveKit Agents](https://docs.livekit.io/agents/) using OpenTelemetry instrumentation. This guide shows you how to automatically capture traces from your LiveKit voice AI agents and send them to LangSmith for monitoring and analysis.

For a complete implementation, see the [demo repository](https://github.com/langchain-ai/voice-agents-tracing).

Install the required packages:

## Quickstart tutorial

Follow this step-by-step tutorial to create a voice AI agent with LiveKit and LangSmith tracing. You'll build a complete working example by copying and pasting code snippets.

### Step 1: Set up your environment

Create a `.env` file in your project directory:

### Step 2: Download the span processor

Add the [custom span processor file](https://github.com/langchain-ai/voice-agents-tracing/blob/main/livekit/langsmith_processor.py) that enables LangSmith tracing. Save it as `langsmith_processor.py` in your project directory.

<Accordion title="What does the span processor do?">
  The span processor enriches LiveKit Agents' OpenTelemetry spans with LangSmith-compatible attributes so your traces display properly in LangSmith.

* Converts LiveKit span types (stt, llm, tts, agent, session, job) to LangSmith format.
  * Adds `gen_ai.prompt.*` and `gen_ai.completion.*` attributes for message visualization.
  * Tracks and aggregates conversation messages across turns
  * Uses multiple extraction strategies to handle various LiveKit attribute formats.

The processor automatically activates when you import it in your code.
</Accordion>

### Step 3: Create your voice agent file

Create a new file called `agent.py` and add the following code. We'll build it section by section so you can copy and paste each part.

#### Part 1: Import dependencies and set up tracing

```python  theme={null}
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
</CodeGroup>

## Quickstart tutorial

Follow this step-by-step tutorial to create a voice AI agent with LiveKit and LangSmith tracing. You'll build a complete working example by copying and pasting code snippets.

### Step 1: Set up your environment

Create a `.env` file in your project directory:
```

Example 3 (unknown):
```unknown
### Step 2: Download the span processor

Add the [custom span processor file](https://github.com/langchain-ai/voice-agents-tracing/blob/main/livekit/langsmith_processor.py) that enables LangSmith tracing. Save it as `langsmith_processor.py` in your project directory.

<Accordion title="What does the span processor do?">
  The span processor enriches LiveKit Agents' OpenTelemetry spans with LangSmith-compatible attributes so your traces display properly in LangSmith.

  **Key functions:**

  * Converts LiveKit span types (stt, llm, tts, agent, session, job) to LangSmith format.
  * Adds `gen_ai.prompt.*` and `gen_ai.completion.*` attributes for message visualization.
  * Tracks and aggregates conversation messages across turns
  * Uses multiple extraction strategies to handle various LiveKit attribute formats.

  The processor automatically activates when you import it in your code.
</Accordion>

### Step 3: Create your voice agent file

Create a new file called `agent.py` and add the following code. We'll build it section by section so you can copy and paste each part.

#### Part 1: Import dependencies and set up tracing
```

---

## Trace with Semantic Kernel

**URL:** llms-txt#trace-with-semantic-kernel

**Contents:**
- Installation
- Setup
  - 1. Configure environment variables
  - 2. Configure OpenTelemetry integration

Source: https://docs.langchain.com/langsmith/trace-with-semantic-kernel

LangSmith can capture traces generated by [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) using OpenInference's OpenAI instrumentation. This guide shows you how to automatically capture traces from your Semantic Kernel applications and send them to LangSmith for monitoring and analysis.

Install the required packages using your preferred package manager:

<Info>
  Requires LangSmith Python SDK version `langsmith>=0.4.26` for optimal OpenTelemetry support.
</Info>

### 1. Configure environment variables

Set your API keys and project name:

<CodeGroup>
  
</CodeGroup>

### 2. Configure OpenTelemetry integration

In your Semantic Kernel application, import and configure the LangSmith OpenTelemetry integration along with the OpenAI instrumentor:

```python  theme={null}
from langsmith.integrations.otel import configure
from openinference.instrumentation.openai import OpenAIInstrumentor

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

Set your API keys and project name:

<CodeGroup>
```

Example 3 (unknown):
```unknown
</CodeGroup>

### 2. Configure OpenTelemetry integration

In your Semantic Kernel application, import and configure the LangSmith OpenTelemetry integration along with the OpenAI instrumentor:
```

---

## Tracing quickstart

**URL:** llms-txt#tracing-quickstart

**Contents:**
- Prerequisites
- 1. Create a directory and install dependencies
- 2. Set up environment variables
- 3. Define your application
- 4. Trace LLM calls
- 5. Trace an entire application
- Next steps
- Video guide

Source: https://docs.langchain.com/langsmith/observability-quickstart

[*Observability*](/langsmith/observability-concepts) is a critical requirement for applications built with Large Language Models (LLMs). LLMs are non-deterministic, which means that the same prompt can produce different responses. This behavior makes debugging and monitoring more challenging than with traditional software.

LangSmith addresses this by providing end-to-end visibility into how your application handles a request. Each request generates a [*trace*](/langsmith/observability-concepts#traces), which captures the full record of what happened. Within a trace are individual [*runs*](/langsmith/observability-concepts#runs), the specific operations your application performed, such as an LLM call or a retrieval step. Tracing runs allows you to inspect, debug, and validate your application’s behavior.

In this quickstart, you will set up a minimal [*Retrieval Augmented Generation (RAG)*](https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-retrieval-augmented-generation-rag) application and add tracing with LangSmith. You will:

1. Configure your environment.
2. Create an application that retrieves context and calls an LLM.
3. Enable tracing to capture both the retrieval step and the LLM call.
4. View the resulting traces in the LangSmith UI.

<Tip>
  If you prefer to watch a video on getting started with tracing, refer to the quickstart [Video guide](#video-guide).
</Tip>

Before you begin, make sure you have:

* **A LangSmith account**: Sign up or log in at [smith.langchain.com](https://smith.langchain.com).
* **A LangSmith API key**: Follow the [Create an API key](/langsmith/create-account-api-key#create-an-api-key) guide.
* **An OpenAI API key**: Generate this from the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

The example app in this quickstart will use OpenAI as the LLM provider. You can adapt the example for your app's LLM provider.

<Tip>
  If you're building an application with [LangChain](https://python.langchain.com/docs/introduction/) or [LangGraph](https://langchain-ai.github.io/langgraph/), you can enable LangSmith tracing with a single environment variable. Get started by reading the guides for tracing with [LangChain](/langsmith/trace-with-langchain) or tracing with [LangGraph](/langsmith/trace-with-langgraph).
</Tip>

## 1. Create a directory and install dependencies

In your terminal, create a directory for your project and install the dependencies in your environment:

## 2. Set up environment variables

Set the following environment variables:

* `LANGSMITH_TRACING`
* `LANGSMITH_API_KEY`
* `OPENAI_API_KEY` (or your LLM provider's API key)
* (optional) `LANGSMITH_WORKSPACE_ID`: If your LangSmith API key is linked to multiple workspaces, set this variable to specify which workspace to use.

If you're using Anthropic, use the [Anthropic wrapper](/langsmith/annotate-code#wrap-the-anthropic-client-python-only) to trace your calls. For other providers, use [the traceable wrapper](/langsmith/annotate-code#use-%40traceable-%2F-traceable).

## 3. Define your application

You can use the example app code outlined in this step to instrument a RAG application. Or, you can use your own application code that includes an LLM call.

This is a minimal RAG app that uses the OpenAI SDK directly without any LangSmith tracing added yet. It has three main parts:

* **Retriever function**: Simulates document retrieval that always returns the same string.
* **OpenAI client**: Instantiates a plain OpenAI client to send a chat completion request.
* **RAG function**: Combines the retrieved documents with the user’s question to form a system prompt, calls the `chat.completions.create()` endpoint with `gpt-4o-mini`, and returns the assistant’s response.

Add the following code into your app file (e.g., `app.py` or `app.ts`):

## 4. Trace LLM calls

To start, you’ll trace all your OpenAI calls. LangSmith provides wrappers:

* Python: [`wrap_openai`](https://docs.smith.langchain.com/reference/python/wrappers/langsmith.wrappers._openai.wrap_openai)
* TypeScript: [`wrapOpenAI`](https://docs.smith.langchain.com/reference/js/functions/wrappers_openai.wrapOpenAI)

This snippet wraps the OpenAI client so that every subsequent model call is logged automatically as a traced child run in LangSmith.

1. Include the highlighted lines in your app file:

2. Call your application:

You'll receive the following output:

3. In the [LangSmith UI](https://smith.langchain.com), navigate to the **default** Tracing Project for your workspace (or the workspace you specified in [Step 2](#2-set-up-environment-variables)). You'll see the OpenAI call you just instrumented.

<div style={{ textAlign: 'center' }}>
  <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=ba8074e55cc17ec7bbf0f6987ce15b8d" alt="LangSmith UI showing an LLM call trace called ChatOpenAI with a system and human input followed by an AI Output." data-og-width="750" width="750" data-og-height="573" height="573" data-path="langsmith/images/trace-quickstart-llm-call.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?w=280&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=b94da918edfd11078bc637fdfc7fcc44 280w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?w=560&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=7f5f480bee06c54f0e5ad7ce122f722c 560w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?w=840&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=5e4e621619664b26cbe2d54719667ded 840w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?w=1100&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=c63599fdd8f12bc1abc80982af376053 1100w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?w=1650&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=69730a230b5d2cff4d737fab7d965c9f 1650w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call.png?w=2500&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=d5e73432bdd2f3788f7600364f84c96f 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=a00c55450b4a9937b8e557ef483a4bd6" alt="LangSmith UI showing an LLM call trace called ChatOpenAI with a system and human input followed by an AI Output." data-og-width="728" width="728" data-og-height="549" height="549" data-path="langsmith/images/trace-quickstart-llm-call-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?w=280&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=9b67fab1c4d3d0e2e45d4a38caa1aa82 280w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?w=560&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=3090d984d38ebac8d83272d235a11662 560w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?w=840&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=e515ea96b0e90b2c8dc639bccb7d81b2 840w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?w=1100&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=85584b64773a98555f22cad5c85ba46e 1100w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?w=1650&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=bc6e44054bb139c9ed00eeb375eb0f4f 1650w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-llm-call-dark.png?w=2500&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=e2cb7aa22421bc4a7d355658a6371d14 2500w" />
</div>

## 5. Trace an entire application

You can also use the `traceable` decorator for [Python](https://docs.smith.langchain.com/reference/python/run_helpers/langsmith.run_helpers.traceable) or [TypeScript](https://langsmith-docs-bdk0fivr6-langchain.vercel.app/reference/js/functions/traceable.traceable) to trace your entire application instead of just the LLM calls.

1. Include the highlighted code in your app file:

2. Call the application again to create a run:

3. Return to the [LangSmith UI](https://smith.langchain.com), navigate to the **default** Tracing Project for your workspace (or the workspace you specified in [Step 2](#2-set-up-environment-variables)). You'll find a trace of the entire app pipeline with the **rag** step and the **ChatOpenAI** LLM call.

<div style={{ textAlign: 'center' }}>
  <img className="block dark:hidden" src="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=204edddb78b671c11a48de751c2e8e19" alt="LangSmith UI showing a trace of the entire application called rag with an input followed by an output." data-og-width="750" width="750" data-og-height="425" height="425" data-path="langsmith/images/trace-quickstart-app.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?w=280&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=d5ad99d3c107fe3ccb63487f43bf912e 280w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?w=560&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=9f3cdb47af6471d1e508f1fa76883900 560w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?w=840&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=d1a496530ed1f98ccabbda138ef10b68 840w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?w=1100&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=d165f3f228f5ffaeb68b0bacc00a0f6e 1100w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?w=1650&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=ccc05e2cdbaf9bd71a6bcb8536997f2e 1650w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app.png?w=2500&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=2ebc113e6930abffa89644ccfd871404 2500w" />

<img className="hidden dark:block" src="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=2392204346d412554fbda817e082bdcd" alt="LangSmith UI showing a trace of the entire application called rag with an input followed by an output." data-og-width="738" width="738" data-og-height="394" height="394" data-path="langsmith/images/trace-quickstart-app-dark.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?w=280&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=7987f9046d36d015624c91f06d38efb2 280w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?w=560&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=4cf9bef39d55a3aa9a31e3911fe7bdba 560w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?w=840&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=0f0dc65c6705b4239afc33777e214cb7 840w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?w=1100&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=d2ccb5a3e2e91e45757f57f43b261861 1100w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?w=1650&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=2aec3b239854f4fd4f38807b991e5812 1650w, https://mintcdn.com/langchain-5e9cc07a/C5sS0isXOt0-nMfw/langsmith/images/trace-quickstart-app-dark.png?w=2500&fit=max&auto=format&n=C5sS0isXOt0-nMfw&q=85&s=b6ee98094ed25e6f2d61fed7241d648e 2500w" />
</div>

Here are some topics you might want to explore next:

* [Tracing integrations](/langsmith/trace-with-langchain) provide support for various LLM providers and agent frameworks.
* [Filtering traces](/langsmith/filter-traces-in-application) can help you effectively navigate and analyze data in tracing projects that contain a significant amount of data.
* [Trace a RAG application](/langsmith/observability-llm-tutorial) is a full tutorial, which adds observability to an application from development through to production.
* [Sending traces to a specific project](/langsmith/log-traces-to-project) changes the destination project of your traces.

<Callout type="info" icon="bird">
  After logging traces, use **[Polly](/langsmith/polly)** to analyze them and get AI-powered insights into your application's performance.
</Callout>

<iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/fA9b4D8IsPQ?si=0eBb1vzw5AxUtplS" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/observability-quickstart.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
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

## 2. Set up environment variables

Set the following environment variables:

* `LANGSMITH_TRACING`
* `LANGSMITH_API_KEY`
* `OPENAI_API_KEY` (or your LLM provider's API key)
* (optional) `LANGSMITH_WORKSPACE_ID`: If your LangSmith API key is linked to multiple workspaces, set this variable to specify which workspace to use.
```

Example 3 (unknown):
```unknown
If you're using Anthropic, use the [Anthropic wrapper](/langsmith/annotate-code#wrap-the-anthropic-client-python-only) to trace your calls. For other providers, use [the traceable wrapper](/langsmith/annotate-code#use-%40traceable-%2F-traceable).

## 3. Define your application

You can use the example app code outlined in this step to instrument a RAG application. Or, you can use your own application code that includes an LLM call.

This is a minimal RAG app that uses the OpenAI SDK directly without any LangSmith tracing added yet. It has three main parts:

* **Retriever function**: Simulates document retrieval that always returns the same string.
* **OpenAI client**: Instantiates a plain OpenAI client to send a chat completion request.
* **RAG function**: Combines the retrieved documents with the user’s question to form a system prompt, calls the `chat.completions.create()` endpoint with `gpt-4o-mini`, and returns the assistant’s response.

Add the following code into your app file (e.g., `app.py` or `app.ts`):

<CodeGroup>
```

Example 4 (unknown):
```unknown

```

---

## Upgrade an installation

**URL:** llms-txt#upgrade-an-installation

**Contents:**
- Kubernetes(Helm)
  - Validate your deployment:
- Docker
  - Validate your deployment:

Source: https://docs.langchain.com/langsmith/self-host-upgrades

For general upgrade instructions, please follow the instructions below. Certain versions may have specific upgrade instructions, which will be detailed in more specific upgrade guides.

If you don't have the repo added, run the following command to add it:

Update your local helm repo

Update your helm chart config file with any updates that are needed in the new version. These will be detailed in the release notes for the new version.

Run the following command to upgrade the chart(replace version with the version you want to upgrade to):

<Note>
  If you are using a namespace other than the default namespace, you will need to specify the namespace in the `helm` and `kubectl` commands by using the `-n <namespace` flag.
</Note>

Find the latest version of the chart. You can find this in the [LangSmith Helm Chart GitHub repository](https://github.com/langchain-ai/helm/releases) or by running the following command:

You should see an output similar to this:

Choose the version you want to upgrade to (generally the latest version is recommended) and note the version number.

Verify that the upgrade was successful:

All pods should be in the `Running` state. Verify that clickhouse is running and that both `migrations` jobs have completed.

### Validate your deployment:

1. Run `kubectl get services`

Output should look something like:

2. Curl the external ip of the `langsmith-frontend` service:

Check that the version matches the version you upgraded to.

3. Visit the external ip for the `langsmith-frontend` service on your browser

The LangSmith UI should be visible/operational

<img src="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=5310f686e7b9eebaaee4fe2a152a8675" alt="LangSmith UI" data-og-width="2886" width="2886" data-og-height="1698" height="1698" data-path="langsmith/images/langsmith-ui.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=280&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=5f155ce778ca848f89fefff237b69bcb 280w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=560&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=1d55d4068a9f53387c129b4688b0971e 560w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=840&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=feb20198d67249ece559e5fd0e6d8e98 840w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=1100&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=3e5eba764d911e567d5aaa9e5702327b 1100w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=1650&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=d45af56632578a8d1b05e546dfc8d01d 1650w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=2500&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=16a49517a6c224930fdb81c9ccde5527 2500w" />

Upgrading the Docker version of LangSmith is a bit more involved than the Helm version and may require a small amount of downtime. Please follow the instructions below to upgrade your Docker version of LangSmith.

1. Update your `docker-compose.yml` file to the file used in the latest release. You can find this in the [LangSmith SDK GitHub repository](https://github.com/langchain-ai/langsmith-sdk/blob/main/python/langsmith/cli/docker-compose.yaml)
2. Update your `.env` file with any new environment variables that are required in the new version. These will be detailed in the release notes for the new version.
3. Run the following command to stop your current LangSmith instance:

4. Run the following command to start your new LangSmith instance in the background:

If everything ran successfully, you should see all the LangSmith containers running and healthy.

### Validate your deployment:

1. Curl the exposed port of the `cli-langchain-frontend-1` container:

2. Visit the exposed port of the `cli-langchain-frontend-1` container on your browser

The LangSmith UI should be visible/operational

<img src="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=5310f686e7b9eebaaee4fe2a152a8675" alt="LangSmith UI" data-og-width="2886" width="2886" data-og-height="1698" height="1698" data-path="langsmith/images/langsmith-ui.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=280&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=5f155ce778ca848f89fefff237b69bcb 280w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=560&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=1d55d4068a9f53387c129b4688b0971e 560w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=840&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=feb20198d67249ece559e5fd0e6d8e98 840w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=1100&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=3e5eba764d911e567d5aaa9e5702327b 1100w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=1650&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=d45af56632578a8d1b05e546dfc8d01d 1650w, https://mintcdn.com/langchain-5e9cc07a/4kN8yiLrZX_amfFn/langsmith/images/langsmith-ui.png?w=2500&fit=max&auto=format&n=4kN8yiLrZX_amfFn&q=85&s=16a49517a6c224930fdb81c9ccde5527 2500w" />

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/self-host-upgrades.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
Update your local helm repo
```

Example 2 (unknown):
```unknown
Update your helm chart config file with any updates that are needed in the new version. These will be detailed in the release notes for the new version.

Run the following command to upgrade the chart(replace version with the version you want to upgrade to):

<Note>
  If you are using a namespace other than the default namespace, you will need to specify the namespace in the `helm` and `kubectl` commands by using the `-n <namespace` flag.
</Note>

Find the latest version of the chart. You can find this in the [LangSmith Helm Chart GitHub repository](https://github.com/langchain-ai/helm/releases) or by running the following command:
```

Example 3 (unknown):
```unknown
You should see an output similar to this:
```

Example 4 (unknown):
```unknown
Choose the version you want to upgrade to (generally the latest version is recommended) and note the version number.
```

---

## Use an existing secret for your installation (Kubernetes)

**URL:** llms-txt#use-an-existing-secret-for-your-installation-(kubernetes)

**Contents:**
- Requirements
- Parameters
- Configuration

Source: https://docs.langchain.com/langsmith/self-host-using-an-existing-secret

By default, LangSmith will provision several Kubernetes secrets to store sensitive information such as license keys, salts, and other configuration parameters. However, you may want to use an existing secret that you have already created in your Kubernetes cluster (or provisioned via some sort of secrets operator). This can be useful if you want to manage sensitive information in a centralized way or if you have specific security requirements.

By default we will provision the following secrets corresponding to different components of LangSmith:

* `langsmith-secrets`: This secret contains the license key and some other basic configuration parameters. You can see the template for this secret [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/secrets.yaml)
* `langsmith-redis`: This secret contains the Redis connection string (or node URIs if using Redis cluster) and password. You can see the template for this secret [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/redis/secrets.yaml)
* `langsmith-postgres`: This secret contains the Postgres connection string and password. You can see the template for this secret [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/postgres/secrets.yaml)
* `langsmith-clickhouse`: This secret contains the ClickHouse connection string and password. You can see the template for this secret [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/clickhouse/secrets.yaml)

* An existing Kubernetes cluster
* A way to create Kubernetes secrets in your cluster. This can be done using `kubectl`, a Helm chart, or a secrets operator like [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)

You will need to create your own Kubernetes secrets that adhere to the structure of the secrets provisioned by the LangSmith Helm Chart.

<Warning>
  The secrets must have the same structure as the ones provisioned by the LangSmith Helm Chart (refer to the links above to see the specific secrets). If you miss any of the required keys, your LangSmith instance may not work correctly.
</Warning>

An example secret may look like this:

With these secrets provisioned, you can configure your LangSmith instance to use the secrets directly to avoid passing in secret values through plaintext. You can do this by modifying the `langsmith_config.yaml` file for your LangSmith Helm Chart installation.

Once configured, you will need to update your LangSmith installation. You can follow our upgrade guide [here](/langsmith/self-host-upgrades). If everything is configured correctly, your LangSmith instance should now be accessible via the Ingress. You can run the following to check that your secrets are being used correctly:

You should see something like this in the output:

<Callout icon="pen-to-square" iconType="regular">
  [Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/self-host-using-an-existing-secret.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>

**Examples:**

Example 1 (unknown):
```unknown
## Configuration

With these secrets provisioned, you can configure your LangSmith instance to use the secrets directly to avoid passing in secret values through plaintext. You can do this by modifying the `langsmith_config.yaml` file for your LangSmith Helm Chart installation.
```

Example 2 (unknown):
```unknown
Once configured, you will need to update your LangSmith installation. You can follow our upgrade guide [here](/langsmith/self-host-upgrades). If everything is configured correctly, your LangSmith instance should now be accessible via the Ingress. You can run the following to check that your secrets are being used correctly:
```

Example 3 (unknown):
```unknown
You should see something like this in the output:
```

---

## You can install them using pip:

**URL:** llms-txt#you-can-install-them-using-pip:

---
