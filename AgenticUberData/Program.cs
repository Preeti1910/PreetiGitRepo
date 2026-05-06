using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.DevUI;
using Microsoft.Agents.AI.Hosting;
using Microsoft.Agents.AI.Hosting.OpenAI;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.AI;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

// --- 0. Tracing setup (OpenTelemetry) ---
builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("AgenticUberData"))
    .WithTracing(tracing => tracing
        .AddSource("*")
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
- IMPORTANT: When writing SQL, always use square brackets for column names that contain spaces,
  e.g. [Booking Status], [Vehicle Type], [Driver Cancellation Reason]. Never use double quotes for identifiers.
- IMPORTANT: In this database, missing/empty values may be stored as the literal string 'null' OR as SQL NULL.
  To filter out missing values, always use BOTH checks: [ColumnName] IS NOT NULL AND [ColumnName] != 'null'.
- IMPORTANT: Always use plain ASCII single quotes (') in SQL string literals. Never use unicode escapes like \u0027.

OUTPUT FORMAT — Always structure your response with ALL of these sections:

1. **Summary**: A brief 1-2 sentence overview of the finding.

2. **Data Table**: Present the data in a markdown table with columns for the category, count, and percentage.
   Example:
   | Booking Status | Count | Percentage |
   |---|---|---|
   | Completed | 93,000 | 62.0% |

3. **Visualization**: Since this is a text-based UI, render visualizations using unicode block characters.
   Choose the appropriate style based on the data:

   - For **distribution/proportion** data (e.g., vehicle types, cancellation proportions):
     Show a proportional breakdown that sums to 100%. Use different colored emoji squares as legend markers:
     🟦 🟩 🟨 🟥 🟪 🟫 ⬜
     Format each line as: [emoji] [label] [bar of ■ chars proportional to %] [percentage]
     Example:
     🟦 Auto           ■■■■■■■■■■■■■■ 27.9%
     🟩 Go Mini        ■■■■■■■■■■■ 22.1%
     🟨 Go Sedan       ■■■■■■■■■■ 20.1%
     Scale the largest segment to ~15 characters.

   - For **count comparison** data (e.g., booking status counts):
     Use horizontal bars with █ characters:
     Completed           ████████████████████ 93,000
     Cancelled by Driver █████████ 27,000
     Scale the longest bar to ~20 characters.

   - For **ranked lists** (e.g., top cancellation reasons):
     Use numbered entries with proportional bars:
     1. Reason A  ████████████████ 45.2%
     2. Reason B  ██████████ 30.1%
     3. Reason C  █████ 15.5%

4. **Insights**: 2-3 bullet points highlighting key takeaways (e.g., dominant category,
   notable ratios, anomalies).

Always include all four sections in your response. Use percentages alongside raw counts.",
        tools: [sqlTool])
    .AsBuilder()
    .UseOpenTelemetry(configure: cfg => cfg.EnableSensitiveData = true)
    .Build();
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