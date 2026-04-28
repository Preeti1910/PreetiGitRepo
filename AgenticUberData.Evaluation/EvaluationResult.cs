namespace AgenticUberData.Evaluation;

/// <summary>
/// Result of a single evaluation metric.
/// </summary>
public class EvaluationResult
{
    public required string MetricName { get; init; }
    public double Score { get; init; }
    public bool Passed => Score >= Threshold;
    public double Threshold { get; init; }
    public string? Reason { get; init; }
}
