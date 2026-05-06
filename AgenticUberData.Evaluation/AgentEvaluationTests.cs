using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Extensions.AI;
using Xunit;
using Xunit.Abstractions;

namespace AgenticUberData.Evaluation;

/// <summary>
/// Evaluation test cases for the Uber Data agent using Deepeval-style metrics.
/// Each test sends a natural-language query to the agent, captures the response,
/// then evaluates it with LLM-as-judge (Correctness, Relevance, Faithfulness)
/// and non-LLM metrics (KeywordPresence, ToolUsage).
/// </summary>
public class AgentEvaluationTests : IDisposable
{
    private readonly AgentTestHarness _harness;
    private readonly DeepEvalMetrics _metrics;
    private readonly ITestOutputHelper _output;

    private static readonly string DbPath = Path.GetFullPath(
        Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "DB", "NCR_Uber_Data.db"));

    public AgentEvaluationTests(ITestOutputHelper output)
    {
        _output = output;

        var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
        {
            TenantId = "16b3c013-d300-468d-ac64-7eda0820b6d3"
        });

        var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT")
            ?? "https://foundry-capstone-for-preeti.openai.azure.com/";
        var deployment = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT")
            ?? "gpt-4o-mini";

        IChatClient chatClient = new AzureOpenAIClient(
            new Uri(endpoint),
            credential)
            .GetChatClient(deployment)
            .AsIChatClient();

        _harness = new AgentTestHarness(chatClient, DbPath);
        _metrics = new DeepEvalMetrics(chatClient);
    }

    public void Dispose() => _harness.Dispose();

    private void LogResult(EvaluationResult result)
    {
        _output.WriteLine($"  [{result.MetricName}] Score: {result.Score:F2} | Threshold: {result.Threshold:F2} | Passed: {result.Passed}");
        _output.WriteLine($"    Reason: {result.Reason}");
    }

    // -----------------------------------------------------------------------
    // 1. Booking Status Analysis
    //    Question: How many bookings fall under each Booking Status?
    //    Column: Booking Status
    //    Expected Output: Bar chart + summary.
    // -----------------------------------------------------------------------
    [Fact]
    public async Task BookingStatusAnalysis_ShouldReturnCountsPerStatus()
    {
        var testCase = new LLMTestCase
        {
            Input = "How many bookings fall under each Booking Status?",
            ExpectedOutput = "Completed: 93000, Cancelled by Driver: 27000, Cancelled by Customer: 10500, No Driver Found: 10500, Incomplete: 9000",
            Context = "The tbl_ride_bookings table has 150,000 rows with Booking Status values: Completed, Cancelled by Driver, Cancelled by Customer, No Driver Found, Incomplete.",
            ExpectedKeywords = ["Completed", "Cancelled by Customer", "Cancelled by Driver", "No Driver Found", "Incomplete", "bar chart"]
        };

        _output.WriteLine($"Query: {testCase.Input}");
        testCase.ActualOutput = await _harness.RunQueryAsync(testCase.Input);
        _output.WriteLine($"Response: {testCase.ActualOutput}\n");

        var correctness = await _metrics.MeasureCorrectnessAsync(testCase);
        var relevance = await _metrics.MeasureRelevanceAsync(testCase);
        var faithfulness = await _metrics.MeasureFaithfulnessAsync(testCase);
        var keywords = _metrics.MeasureKeywordPresence(testCase);
        var toolUsage = _metrics.MeasureToolUsage(testCase, _harness.ToolWasInvoked);

        LogResult(correctness);
        LogResult(relevance);
        LogResult(faithfulness);
        LogResult(keywords);
        LogResult(toolUsage);

        Assert.True(correctness.Passed, $"Correctness failed: {correctness.Reason}");
        Assert.True(relevance.Passed, $"Relevance failed: {relevance.Reason}");
        Assert.True(toolUsage.Passed, $"ToolUsage failed: {toolUsage.Reason}");
    }

    // -----------------------------------------------------------------------
    // 2. Vehicle Type Distribution
    //    Question: What are the counts of bookings by Vehicle Type?
    //    Column: Vehicle Type
    //    Expected Output: Pie chart + table.
    // -----------------------------------------------------------------------
    [Fact]
    public async Task VehicleTypeDistribution_ShouldReturnCountsByType()
    {
        var testCase = new LLMTestCase
        {
            Input = "What are the counts of bookings by Vehicle Type?",
            ExpectedOutput = "A breakdown of booking counts grouped by each vehicle type, presented as a table and pie chart.",
            Context = "The tbl_ride_bookings table contains a Vehicle Type column with various vehicle categories.",
            ExpectedKeywords = ["Vehicle Type", "pie chart"]
        };

        _output.WriteLine($"Query: {testCase.Input}");
        testCase.ActualOutput = await _harness.RunQueryAsync(testCase.Input);
        _output.WriteLine($"Response: {testCase.ActualOutput}\n");

        var correctness = await _metrics.MeasureCorrectnessAsync(testCase);
        var relevance = await _metrics.MeasureRelevanceAsync(testCase);
        var faithfulness = await _metrics.MeasureFaithfulnessAsync(testCase);
        var keywords = _metrics.MeasureKeywordPresence(testCase);
        var toolUsage = _metrics.MeasureToolUsage(testCase, _harness.ToolWasInvoked);

        LogResult(correctness);
        LogResult(relevance);
        LogResult(faithfulness);
        LogResult(keywords);
        LogResult(toolUsage);

        Assert.True(correctness.Passed, $"Correctness failed: {correctness.Reason}");
        Assert.True(relevance.Passed, $"Relevance failed: {relevance.Reason}");
        Assert.True(toolUsage.Passed, $"ToolUsage failed: {toolUsage.Reason}");
    }

    // -----------------------------------------------------------------------
    // 3. Cancellation Reasons
    //    Question: What are the most common Driver Cancellation Reason
    //              and Incomplete Rides Reason?
    //    Columns: Driver Cancellation Reason, Incomplete Rides Reason
    //    Expected Output: Ranked list + percentages.
    // -----------------------------------------------------------------------
    [Fact]
    public async Task CancellationReasons_ShouldReturnRankedReasons()
    {
        var testCase = new LLMTestCase
        {
            Input = "What are the most common Driver Cancellation Reason and Incomplete Rides Reason?",
            ExpectedOutput = "A ranked list of the most common driver cancellation reasons and incomplete ride reasons with their counts or percentages.",
            Context = "The tbl_ride_bookings table has Driver Cancellation Reason and Incomplete Rides Reason columns with various reason values.",
            ExpectedKeywords = ["Driver Cancellation Reason", "Incomplete"]
        };

        _output.WriteLine($"Query: {testCase.Input}");
        testCase.ActualOutput = await _harness.RunQueryAsync(testCase.Input);
        _output.WriteLine($"Response: {testCase.ActualOutput}\n");

        var correctness = await _metrics.MeasureCorrectnessAsync(testCase);
        var relevance = await _metrics.MeasureRelevanceAsync(testCase);
        var faithfulness = await _metrics.MeasureFaithfulnessAsync(testCase);
        var keywords = _metrics.MeasureKeywordPresence(testCase);
        var toolUsage = _metrics.MeasureToolUsage(testCase, _harness.ToolWasInvoked);

        LogResult(correctness);
        LogResult(relevance);
        LogResult(faithfulness);
        LogResult(keywords);
        LogResult(toolUsage);

        Assert.True(correctness.Passed, $"Correctness failed: {correctness.Reason}");
        Assert.True(relevance.Passed, $"Relevance failed: {relevance.Reason}");
        Assert.True(toolUsage.Passed, $"ToolUsage failed: {toolUsage.Reason}");
    }

    // -----------------------------------------------------------------------
    // 4. Cancellation Proportions
    //    Question: What proportion of bookings were cancelled by the customer
    //              vs. the driver vs. 'No Driver Found'?
    //    Columns: Booking Status, Cancelled Rides by Customer, Cancelled Rides by Driver
    //    Expected Output: Percentage breakdown + visualization.
    // -----------------------------------------------------------------------
    [Fact]
    public async Task CancellationProportions_ShouldReturnPercentageBreakdown()
    {
        var testCase = new LLMTestCase
        {
            Input = "What proportion of bookings were cancelled by the customer vs. the driver vs. 'No Driver Found'?",
            ExpectedOutput = "Cancelled by Customer: ~7% (10500/150000), Cancelled by Driver: ~18% (27000/150000), No Driver Found: ~7% (10500/150000). Percentage breakdown with visualization recommendation.",
            Context = "Total bookings: 150,000. Cancelled by Customer: 10,500. Cancelled by Driver: 27,000. No Driver Found: 10,500.",
            ExpectedKeywords = ["Cancelled by Customer", "Cancelled by Driver", "No Driver Found", "%"]
        };

        _output.WriteLine($"Query: {testCase.Input}");
        testCase.ActualOutput = await _harness.RunQueryAsync(testCase.Input);
        _output.WriteLine($"Response: {testCase.ActualOutput}\n");

        var correctness = await _metrics.MeasureCorrectnessAsync(testCase);
        var relevance = await _metrics.MeasureRelevanceAsync(testCase);
        var faithfulness = await _metrics.MeasureFaithfulnessAsync(testCase);
        var keywords = _metrics.MeasureKeywordPresence(testCase);
        var toolUsage = _metrics.MeasureToolUsage(testCase, _harness.ToolWasInvoked);

        LogResult(correctness);
        LogResult(relevance);
        LogResult(faithfulness);
        LogResult(keywords);
        LogResult(toolUsage);

        Assert.True(correctness.Passed, $"Correctness failed: {correctness.Reason}");
        Assert.True(relevance.Passed, $"Relevance failed: {relevance.Reason}");
        Assert.True(toolUsage.Passed, $"ToolUsage failed: {toolUsage.Reason}");
    }
}
