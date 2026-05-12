using Microsoft.Extensions.AI;

namespace AgenticUberData.Evaluation;

/// <summary>
/// Deepeval-style evaluation metrics implemented in .NET using an LLM as judge.
/// Supports: Correctness, Relevance, Faithfulness, ToolUsage, and keyword checks.
/// </summary>
public class DeepEvalMetrics
{
    private readonly IChatClient _judge;

    public DeepEvalMetrics(IChatClient judge)
    {
        _judge = judge;
    }

    /// <summary>
    /// Measures answer correctness by asking the LLM judge to compare
    /// actual vs expected output (equivalent to Deepeval's AnswerRelevancyMetric + CorrectnessMetric).
    /// </summary>
    public async Task<EvaluationResult> MeasureCorrectnessAsync(LLMTestCase testCase, double threshold = 0.7)
    {
        var prompt = $"""
            You are an evaluation judge. Score the ACTUAL OUTPUT against the EXPECTED OUTPUT
            for the given INPUT on a scale of 0.0 to 1.0.

            INPUT: {testCase.Input}
            EXPECTED OUTPUT: {testCase.ExpectedOutput}
            ACTUAL OUTPUT: {testCase.ActualOutput}

            Scoring criteria:
            - 1.0: The actual output fully answers the question and matches or exceeds the expected output.
            - 0.7-0.9: The actual output is mostly correct with minor omissions.
            - 0.4-0.6: The actual output is partially correct but missing key information.
            - 0.0-0.3: The actual output is incorrect or irrelevant.

            Respond ONLY in this exact format (no other text):
            SCORE: <number>
            REASON: <one sentence explanation>
            """;

        return await EvaluateWithJudge(prompt, "Correctness", threshold);
    }

    /// <summary>
    /// Measures whether the answer is relevant to the user's question
    /// (equivalent to Deepeval's AnswerRelevancyMetric).
    /// </summary>
    public async Task<EvaluationResult> MeasureRelevanceAsync(LLMTestCase testCase, double threshold = 0.7)
    {
        var prompt = $"""
            You are an evaluation judge. Score how relevant the ACTUAL OUTPUT is to the INPUT
            on a scale of 0.0 to 1.0.

            INPUT: {testCase.Input}
            ACTUAL OUTPUT: {testCase.ActualOutput}

            Scoring criteria:
            - 1.0: Directly and completely answers the question.
            - 0.7-0.9: Mostly relevant with minor tangents.
            - 0.4-0.6: Somewhat relevant but includes irrelevant content.
            - 0.0-0.3: Mostly irrelevant to the question.

            Respond ONLY in this exact format (no other text):
            SCORE: <number>
            REASON: <one sentence explanation>
            """;

        return await EvaluateWithJudge(prompt, "Relevance", threshold);
    }

    /// <summary>
    /// Measures whether the answer is grounded in the provided context/data
    /// (equivalent to Deepeval's FaithfulnessMetric).
    /// </summary>
    public async Task<EvaluationResult> MeasureFaithfulnessAsync(LLMTestCase testCase, double threshold = 0.7)
    {
        var prompt = $"""
            You are an evaluation judge. Score how faithful/grounded the ACTUAL OUTPUT is
            based on the provided CONTEXT on a scale of 0.0 to 1.0.

            INPUT: {testCase.Input}
            CONTEXT: {testCase.Context}
            ACTUAL OUTPUT: {testCase.ActualOutput}

            Scoring criteria:
            - 1.0: Every claim in the output is supported by the context.
            - 0.7-0.9: Most claims are supported, minor unsupported details.
            - 0.4-0.6: Some claims lack support from the context.
            - 0.0-0.3: The output contains fabricated or contradictory information.

            Respond ONLY in this exact format (no other text):
            SCORE: <number>
            REASON: <one sentence explanation>
            """;

        return await EvaluateWithJudge(prompt, "Faithfulness", threshold);
    }

    /// <summary>
    /// Checks whether the actual output contains expected keywords
    /// (simple non-LLM metric for fast validation).
    /// </summary>
    public EvaluationResult MeasureKeywordPresence(LLMTestCase testCase, double threshold = 0.8)
    {
        if (testCase.ExpectedKeywords.Count == 0)
        {
            return new EvaluationResult
            {
                MetricName = "KeywordPresence",
                Score = 1.0,
                Threshold = threshold,
                Reason = "No keywords to check."
            };
        }

        var actual = testCase.ActualOutput?.ToLowerInvariant() ?? "";
        int found = testCase.ExpectedKeywords.Count(k => actual.Contains(k.ToLowerInvariant()));
        double score = (double)found / testCase.ExpectedKeywords.Count;

        var missing = testCase.ExpectedKeywords.Where(k => !actual.Contains(k.ToLowerInvariant())).ToList();

        return new EvaluationResult
        {
            MetricName = "KeywordPresence",
            Score = score,
            Threshold = threshold,
            Reason = missing.Count > 0
                ? $"Missing keywords: {string.Join(", ", missing)}"
                : "All expected keywords found."
        };
    }

    /// <summary>
    /// Checks that the agent actually used the SQL tool (not hallucinated).
    /// </summary>
    public EvaluationResult MeasureToolUsage(LLMTestCase testCase, bool toolWasCalled, double threshold = 1.0)
    {
        return new EvaluationResult
        {
            MetricName = "ToolUsage",
            Score = toolWasCalled ? 1.0 : 0.0,
            Threshold = threshold,
            Reason = toolWasCalled
                ? "The SQL tool was invoked as expected."
                : "The SQL tool was NOT invoked — the agent may have hallucinated."
        };
    }

    private async Task<EvaluationResult> EvaluateWithJudge(string prompt, string metricName, double threshold)
    {
        var response = await _judge.GetResponseAsync(prompt);
        var text = response.Text ?? "";

        double score = 0.0;
        string reason = text;

        // Parse SCORE: and REASON: from response
        foreach (var line in text.Split('\n', StringSplitOptions.RemoveEmptyEntries))
        {
            var trimmed = line.Trim();
            if (trimmed.StartsWith("SCORE:", StringComparison.OrdinalIgnoreCase))
            {
                var scorePart = trimmed["SCORE:".Length..].Trim();
                double.TryParse(scorePart, System.Globalization.NumberStyles.Float,
                    System.Globalization.CultureInfo.InvariantCulture, out score);
            }
            else if (trimmed.StartsWith("REASON:", StringComparison.OrdinalIgnoreCase))
            {
                reason = trimmed["REASON:".Length..].Trim();
            }
        }

        return new EvaluationResult
        {
            MetricName = metricName,
            Score = score,
            Threshold = threshold,
            Reason = reason
        };
    }
}
