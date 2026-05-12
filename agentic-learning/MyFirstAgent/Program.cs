using Azure.AI.OpenAI;
using Azure.Identity;
using dotenv.net;
using Microsoft.Agents.AI;
using OpenAI.Chat;

DotEnv.Load(options: new DotEnvOptions(envFilePaths: new[] {
    Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".env")
}));

var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT")
    ?? throw new InvalidOperationException("Set AZURE_OPENAI_ENDPOINT");
var deploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_NAME") ?? "gpt-4.1";

var options = new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2024_10_21);
// Quick SDK test — bypass Agent Framework
var testClient = new AzureOpenAIClient(
    new Uri(endpoint),
    new DefaultAzureCredential(),
    options)
    .GetChatClient(deploymentName);

Console.WriteLine("Testing ChatClient directly...");
var testResponse = await testClient.CompleteChatAsync("Say hello");
Console.WriteLine($"Direct test: {testResponse.Value.Content[0].Text}");

AIAgent agent = new AzureOpenAIClient(
    new Uri(endpoint),
    new DefaultAzureCredential(),
    options)
    .GetChatClient(deploymentName)
    .AsAIAgent(
        instructions: "You are a vet and have expert knowledge about dogs. Keep your answers brief.",
        name: "VetAgent");

// Invoke the agent and output the text result.
Console.WriteLine(await agent.RunAsync("What is the average lifespan of a golden retriever?"));

// Invoke the agent with streaming support.
await foreach (var update in agent.RunStreamingAsync("What are common health issues in Labradors?"))
{
    Console.Write(update);
}
Console.WriteLine();