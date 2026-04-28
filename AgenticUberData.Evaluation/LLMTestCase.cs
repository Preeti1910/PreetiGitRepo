namespace AgenticUberData.Evaluation;

/// <summary>
/// Represents a single evaluation test case (equivalent to Deepeval's LLMTestCase).
/// </summary>
public class LLMTestCase
{
    public required string Input { get; init; }
    public string? ExpectedOutput { get; init; }
    public string? ActualOutput { get; set; }
    public string? Context { get; init; }
    public List<string> ExpectedKeywords { get; init; } = [];
}
