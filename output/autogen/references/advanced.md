# Autogen - Advanced

**Pages:** 1

---

## Termination using Intervention Handler — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/termination-with-intervention.html

**Contents:**
- Termination using Intervention Handler#

This method is valid when using SingleThreadedAgentRuntime.

There are many different ways to handle termination in autogen_core. Ultimately, the goal is to detect that the runtime no longer needs to be executed and you can proceed to finalization tasks. One way to do this is to use an autogen_core.base.intervention.InterventionHandler to detect a termination message and then act on it.

First, we define a dataclass for regular message and message that will be used to signal termination.

We code our agent to publish a termination message when it decides it is time to terminate.

Next, we create an InterventionHandler that will detect the termination message and act on it. This one hooks into publishes and when it encounters Termination it alters its internal state to indicate that termination has been requested.

Finally, we add this handler to the runtime and use it to detect termination and stop the runtime when the termination message is received.

Azure OpenAI with AAD Auth

User Approval for Tool Execution using Intervention Handler

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass
from typing import Any

from autogen_core import (
    DefaultInterventionHandler,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    default_subscription,
    message_handler,
)
```

Example 2 (python):
```python
from dataclasses import dataclass
from typing import Any

from autogen_core import (
    DefaultInterventionHandler,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    default_subscription,
    message_handler,
)
```

Example 3 (python):
```python
@dataclass
class Message:
    content: Any


@dataclass
class Termination:
    reason: str
```

Example 4 (python):
```python
@dataclass
class Message:
    content: Any


@dataclass
class Termination:
    reason: str
```

---
