using Microsoft.Extensions.AI;
using Microsoft.Data.Sqlite;
using System.ComponentModel;
using System.Text;

namespace AgenticUberData.Evaluation;

/// <summary>
/// Harness that creates a chat client with the SQL tool and runs queries,
/// capturing both the final response and whether the tool was invoked.
/// Uses FunctionInvokingChatClient for automatic tool invocation.
/// </summary>
public class AgentTestHarness : IDisposable
{
    private readonly IChatClient _chatClient;
    private readonly SqliteConnection _connection;
    private bool _toolWasInvoked;

    private const string SystemInstructions = """
        You are an AI data analyst for an Uber rides dataset (NCR region).
        You have access to a SQLite database via the ExecuteSqlQueryTraced tool. The database contains
        a 'tbl_ride_bookings' table with booking details including statuses, vehicle types, cancellation reasons,
        ratings, distances, and more.

        RULES:
        - Always use the ExecuteSqlQueryTraced tool to answer questions involving counts, statistics, or data lookups.
        - Never fabricate numbers — only report what the database returns.
        - Provide a clear textual summary of the results.
        - When the result would benefit from visualization, describe the recommended chart type
          (bar chart, pie chart, table, etc.) and the data series.
        """;

    public bool ToolWasInvoked => _toolWasInvoked;

    public AgentTestHarness(IChatClient innerChatClient, string dbPath)
    {
        _connection = new SqliteConnection($"Data Source={dbPath};Mode=ReadOnly");
        _connection.Open();

        var sqlTool = AIFunctionFactory.Create(ExecuteSqlQueryTraced);

        _chatClient = new ChatClientBuilder(innerChatClient)
            .UseFunctionInvocation()
            .Build();

        Tools = [sqlTool];
    }

    private IList<AITool> Tools { get; }

    public async Task<string> RunQueryAsync(string userQuery)
    {
        _toolWasInvoked = false;

        var messages = new List<ChatMessage>
        {
            new(ChatRole.System, SystemInstructions),
            new(ChatRole.User, userQuery)
        };

        var options = new ChatOptions { Tools = Tools };

        var response = await _chatClient.GetResponseAsync(messages, options);
        return response.Text ?? "";
    }

    [Description("Execute a SQL SELECT query on the NCR_Uber_Data database and return results as CSV text. The database has a single table named 'tbl_ride_bookings' with columns: 'Booking ID', 'Date', 'Time', 'Booking Status', 'Customer ID', 'Vehicle Type', 'Pickup Location', 'Drop Location', 'Avg VTAT', 'Avg CTAT', 'Cancelled Rides ByCustomer', 'Reason for cancelling by Customer', 'Cancelled Rides by Driver', 'Driver Cancellation Reason', 'Incomplete Rides', 'Incomplete Rides Reason', 'Booking Value', 'Ride Distance', 'Driver Ratings', 'Customer Rating', 'Payment Method'.")]
    private string ExecuteSqlQueryTraced(
        [Description("A SQL SELECT query to run against the tbl_ride_bookings table. Must be a read-only SELECT statement.")] string sql)
    {
        _toolWasInvoked = true;

        using var cmd = _connection.CreateCommand();
        cmd.CommandText = sql;
        using var reader = cmd.ExecuteReader();

        var output = new StringBuilder();
        for (int i = 0; i < reader.FieldCount; i++)
            output.Append(reader.GetName(i) + (i < reader.FieldCount - 1 ? "," : "\n"));
        while (reader.Read())
        {
            for (int i = 0; i < reader.FieldCount; i++)
                output.Append(reader[i]?.ToString() + (i < reader.FieldCount - 1 ? "," : "\n"));
        }
        return output.ToString();
    }

    public void Dispose()
    {
        _connection.Dispose();
    }
}
