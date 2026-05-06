# DevUI: Interactive Testing Interface for Microsoft Agent Framework

## What is DevUI?

DevUI is a built-in, browser-based chat interface provided by the **Microsoft Agent Framework** (via the `Microsoft.Agents.AI.DevUI` NuGet package). It gives developers an instant, zero-configuration web UI to interact with and test their AI agents during local development — without needing to build a frontend, connect a client, or deploy to any service.

When you navigate to `/devui` on your running application, you get a full-featured chat panel that communicates with your registered agent through the OpenAI-compatible endpoints. It supports multi-turn conversations, displays tool/function call invocations, and shows real-time agent responses.

## Benefits of DevUI

| Benefit | Description |
|---------|-------------|
| **Zero frontend code** | No need to build a React/Angular/Blazor UI just to test your agent. DevUI ships a ready-made chat interface. |
| **Instant feedback loop** | Run `dotnet run`, open `/devui`, and start chatting with your agent immediately. |
| **Multi-turn conversation support** | Maintains conversation history across messages, allowing you to test follow-up questions and context retention. |
| **Tool call visibility** | See when your agent invokes tools (function calls), what parameters it sends, and what results come back. |
| **Development-only by default** | Designed to run only in the Development environment, so it never accidentally ships to production. |
| **No external dependencies** | Everything is self-contained in the NuGet package — no npm installs, no separate processes, no Docker containers. |
| **OpenAI-compatible protocol** | DevUI communicates via the same OpenAI Responses/Conversations API endpoints your production clients will use, so you're testing the real path. |

## Prerequisites

- .NET 8.0 or later
- A Microsoft Agent Framework project with at least one registered AI agent
- The `Microsoft.Agents.AI.DevUI` NuGet package

## Integration Steps

### Step 1: Install the NuGet Package

```bash
dotnet add package Microsoft.Agents.AI.DevUI --prerelease
```

### Step 2: Register DevUI in Your Application

In your `Program.cs`, add the DevUI services and map its endpoints. Wrap both calls in a development-environment check so DevUI is never exposed in production:

```csharp
using Microsoft.Agents.AI.DevUI;

var builder = WebApplication.CreateBuilder(args);

// ... register your AI agent, chat client, tools, etc. ...

// Register DevUI (development only)
if (builder.Environment.IsDevelopment())
{
    builder.AddDevUI();
}

// Register OpenAI-compatible hosting endpoints (required for DevUI communication)
builder.AddOpenAIResponses();
builder.AddOpenAIConversations();

var app = builder.Build();

// Map the API endpoints
app.MapOpenAIResponses();
app.MapOpenAIConversations();

// Map DevUI endpoint (development only)
if (app.Environment.IsDevelopment())
{
    app.MapDevUI(); // Available at /devui
}

app.Run();
```

### Step 3: Run and Access DevUI

```bash
dotnet run
```

Open your browser and navigate to:

```
http://localhost:<port>/devui
```

You will see a chat interface where you can type messages and interact with your registered agent.

### Step 4: Test Your Agent

1. **Type a question** in the chat input and press Enter.
2. **Observe tool calls** — if your agent uses tools (like SQL execution), DevUI shows the function invocations and their results.
3. **Ask follow-up questions** to test multi-turn conversation support and context retention.
4. **Click "New Conversation"** to reset the chat history and start fresh.

## Complete Minimal Example

Below is a minimal `Program.cs` showing DevUI integrated with a simple agent:

```csharp
using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.DevUI;
using Microsoft.Agents.AI.Hosting;
using Microsoft.Agents.AI.Hosting.OpenAI;
using Microsoft.Extensions.AI;

var builder = WebApplication.CreateBuilder(args);

// Register chat client (Azure OpenAI)
var endpoint = builder.Configuration["AZURE_OPENAI_ENDPOINT"]!;
var deployment = builder.Configuration["AZURE_OPENAI_DEPLOYMENT"]!;

builder.Services.AddChatClient(new AzureOpenAIClient(
    new Uri(endpoint),
    new DefaultAzureCredential())
    .GetChatClient(deployment)
    .AsIChatClient());

// Register AI agent
builder.AddAIAgent("myAgent", (sp, name) =>
{
    var chatClient = sp.GetRequiredService<IChatClient>();
    return new ChatClientAgent(chatClient,
        name: name,
        instructions: "You are a helpful assistant.");
});

// DevUI (development only)
if (builder.Environment.IsDevelopment())
{
    builder.AddDevUI();
}

builder.AddOpenAIResponses();
builder.AddOpenAIConversations();

var app = builder.Build();

app.MapOpenAIResponses();
app.MapOpenAIConversations();

if (app.Environment.IsDevelopment())
{
    app.MapDevUI();
}

app.Run();
```

## Key Points to Remember

- **Development only**: Always gate DevUI behind `IsDevelopment()` checks. It is not intended for production use.
- **OpenAI endpoints required**: DevUI relies on `AddOpenAIResponses()` / `MapOpenAIResponses()` and `AddOpenAIConversations()` / `MapOpenAIConversations()` to communicate with your agent.
- **Agent registration required**: At least one agent must be registered via `builder.AddAIAgent(...)` for DevUI to have something to talk to.
- **Default URL**: The DevUI interface is served at `/devui` by default.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `/devui` returns 404 | Ensure `builder.AddDevUI()` and `app.MapDevUI()` are both called, and the environment is set to Development (`ASPNETCORE_ENVIRONMENT=Development`). |
| Chat sends but no response | Verify your agent is registered with `builder.AddAIAgent(...)` and the OpenAI endpoints are mapped. |
| Multi-turn errors (400) | Conversation history may contain orphaned tool call messages. Consider implementing a `DelegatingChatClient` to sanitize history before sending to the LLM. |
| Tool calls not executing | Ensure tools are passed to the agent constructor (e.g., `tools: [myTool]`) and the tool function is created via `AIFunctionFactory.Create(...)`. |

## References

- [Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview)
- [Your First Agent — Getting Started Tutorial](https://learn.microsoft.com/en-us/agent-framework/get-started/your-first-agent)
- [Microsoft.Agents.AI.DevUI on NuGet](https://www.nuget.org/packages/Microsoft.Agents.AI.DevUI)
- [Agents for .NET — GitHub Repository](https://github.com/microsoft/Agents-for-net)
- [Agent Framework Tools Documentation](https://learn.microsoft.com/en-us/agent-framework/agents/tools/)
- [Multi-turn Conversations and Sessions](https://learn.microsoft.com/en-us/agent-framework/agents/conversations/session)
- [Middleware in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/agents/middleware/)
- [Microsoft.Extensions.AI Documentation](https://learn.microsoft.com/en-us/dotnet/ai/ai-extensions)
- [Azure OpenAI Service Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [OpenTelemetry for .NET](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel)
