using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.DevUI;
using Microsoft.Agents.AI.Hosting;
using Microsoft.Agents.AI.Hosting.OpenAI;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.AI;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// --- 0. Tracing setup (OpenTelemetry) ---
var activitySource = new ActivitySource("AgenticUberData");

// Enable OpenTelemetry listener so Activity objects are actually created
ActivitySource.AddActivityListener(new ActivityListener
{
    ShouldListenTo = _ => true,
    Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded
});

builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("AgenticUberData"))
    .WithTracing(tracing => tracing
        .AddSource("AgenticUberData")
        .AddSource("Microsoft.Extensions.AI")
        .AddSource("Microsoft.Agents.AI")
        .AddConsoleExporter());

builder.Logging.AddConsole();

// --- 1. Database setup ---
var conn = new SqliteConnection("Data Source=../DB/NCR_Uber_Data.db;Mode=ReadOnly");
conn.Open();
AgentTools.DbConnection = conn;

// --- 1b. Register the Azure OpenAI chat client ---
var endpoint = builder.Configuration["AZURE_OPENAI_ENDPOINT"]!;
var deployment = builder.Configuration["AZURE_OPENAI_DEPLOYMENT"]!;

var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
{
    TenantId = "16b3c013-d300-468d-ac64-7eda0820b6d3"
});

builder.Services.AddChatClient(new AzureOpenAIClient(
    new Uri(endpoint),
    credential)
    .GetChatClient(deployment)
    .AsIChatClient())
    .UseOpenTelemetry(configure: o => o.EnableSensitiveData = true);

// --- 2. Register the AI agent ---
var sqlTool = AIFunctionFactory.Create(AgentTools.ExecuteSqlQuery);

builder.AddAIAgent("uberDataAgent", (sp, name) =>
{
    // Wrap the chat client with HistoryCleanupChatClient directly so the agent
    // always goes through our cleanup (the DI pipeline gets bypassed by the agent framework)
    var rawClient = sp.GetRequiredService<IChatClient>();
    var chatClient = new HistoryCleanupChatClient(rawClient);
    return new ChatClientAgent(chatClient,
        name: name,
        instructions: @"You are an AI data analyst for an Uber rides dataset (NCR region).
You have access to a SQLite database via the ExecuteSqlQuery tool. The database contains
a 'tbl_ride_bookings' table with booking details including statuses, vehicle types, cancellation reasons,
ratings, distances, and more.

IMPORTANT DATA SCHEMA NOTES:
- The [Booking Status] column contains these exact values: 'Cancelled by Customer', 'Cancelled by Driver',
  'No Driver Found', 'Completed', 'Incomplete'. There is NO generic 'Cancelled' status.
- To count customer cancellations, use: [Booking Status] = 'Cancelled by Customer'
- To count driver cancellations, use: [Booking Status] = 'Cancelled by Driver'
- 'No Driver Found' is its own [Booking Status] value, not a cancellation reason.
- The [Cancelled Rides by Customer] and [Cancelled Rides by Driver] columns are flags/markers,
  not the primary way to identify cancellations. Use [Booking Status] instead.

RULES:
- Always use the ExecuteSqlQuery tool to answer questions involving counts, statistics, or data lookups.
- Never fabricate numbers — only report what the database returns.
- Provide a clear textual summary of the results.
- When the result would benefit from visualization, describe the recommended chart type
  (bar chart, pie chart, table, etc.) and the data series.
- IMPORTANT: When writing SQL, always use square brackets for column names that contain spaces,
  e.g. [Booking Status], [Vehicle Type], [Driver Cancellation Reason]. Never use double quotes for identifiers.
- IMPORTANT: In this database, missing/empty values may be stored as the literal string 'null' OR as SQL NULL.
  To filter out missing values, always use BOTH checks: [ColumnName] IS NOT NULL AND [ColumnName] != 'null'.
- IMPORTANT: Always use plain ASCII single quotes (') in SQL string literals. Never use unicode escapes like \u0027.",
        tools: [sqlTool]);
});

// --- 3. Register DevUI (development only) ---
if (builder.Environment.IsDevelopment())
{
    builder.AddDevUI();
}

// --- 4. Register OpenAI hosting endpoints ---
builder.AddOpenAIResponses();
builder.AddOpenAIConversations();

var app = builder.Build();

// --- 5. Map endpoints ---
app.MapOpenAIResponses();
app.MapOpenAIConversations();

if (app.Environment.IsDevelopment())
{
    app.MapDevUI(); // Available at /devui
}

app.Run();