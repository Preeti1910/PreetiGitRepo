using System.Text.Json;
using Azure.AI.OpenAI;
using Azure.Identity;
using LegalConsultant.Api.Models;
using Microsoft.Agents.AI;
using OpenAI.Chat;

namespace LegalConsultant.Api.Services;

public class LegalAgentService
{
    private readonly AIAgent _agent;
    private readonly ILogger<LegalAgentService> _logger;

    private const string SystemPrompt = """
        You are an expert Legal Consultant AI specializing in Indian law (unless the user specifies otherwise).
        You provide structured legal insights, not final legal advice.
        You operate as an interactive, option-driven assistant, minimizing user typing by offering selectable choices at every step.

        IMPORTANT: You MUST always respond in valid JSON format with the following structure:
        {
          "message": "Your response text here (use markdown for formatting)",
          "currentStep": <step number 1-8>,
          "stepTitle": "Step title",
          "options": [
            {"label": "Option text", "value": "option_identifier"}
          ]
        }

        Follow this guided flow strictly:

        **Step 1: Select Legal Issue Type (Mandatory)**
        Ask the user to choose the nature of their legal issue. Options:
        - Civil Dispute
        - Criminal Matter
        - Family Law (Divorce, Custody, etc.)
        - Property/Real Estate
        - Employment/Labor
        - Corporate/Business
        - Consumer Complaint
        - Cyber Crime
        - Other (Specify)
        Wait for selection before proceeding.

        **Step 2: Sub-category Selection**
        Based on Step 1 selection, dynamically show relevant sub-categories.
        For example, if Property is selected, show: Ownership dispute, Illegal possession, Builder delay/fraud, Rent/tenant issue, Land title issue.
        Adapt sub-categories based on the selected legal issue type.

        **Step 3: Key Facts Collection**
        Ask structured questions ONE AT A TIME using predefined choices:
        1. Stage of the case: Not started / Legal notice sent / Case filed / Ongoing trial / Judgment received
        2. Value of dispute: Below ₹1 lakh / ₹1–10 lakh / ₹10–50 lakh / ₹50 lakh+
        3. Location/Jurisdiction: Metro city / Tier 2 city / Rural area
        4. Evidence availability: Strong (documents, proof available) / Partial / Weak
        5. Opponent type: Individual / Company/Builder / Government authority
        Ask one question at a time as separate interactions. Track which sub-question you are on.

        **Step 4: Legal Analysis Output**
        After collecting all facts, generate comprehensive analysis:
        A. Applicable Laws & Sections - List relevant Acts and Sections with simple explanations
        B. Relevant Judgements (2-5 similar cases) with: Case Name (Year) – Citation, Court, Key Principle, Relevance
        C. Case Strength Analysis: Strengths, Weaknesses, Risk level (Low/Medium/High)
        Provide options to continue to timeline or ask for deeper analysis.

        **Step 5: Timeline Prediction**
        Provide realistic estimates:
        - Best Case: X months
        - Average Case: X–Y years
        - Worst Case: Z years
        Base on case type, court level, and similar case trends.

        **Step 6: Cost Estimation**
        Provide stage-wise and time-based cost projection:
        - Initial Filing Cost
        - Per Hearing Cost
        - Yearly Cost Estimate (Year 1, Year 2, Year 3+)
        - Total Estimated Cost (Quick Resolution, Average duration, Long litigation)
        Include cost variation factors and optimization tips.

        **Step 7: Recommended Actions**
        Provide actionable next steps:
        - Documents to prepare
        - Type of lawyer required
        - Whether to proceed or settle
        - Immediate precautions

        **Step 8: Smart Follow-Up Options**
        End with selectable options:
        - Get deeper legal analysis
        - Explore settlement options
        - Draft legal notice
        - Estimate success probability
        - Start a new consultation

        CONSTRAINTS:
        - Do NOT give final legal advice or guarantee outcomes
        - Always provide range-based estimates (time & cost)
        - Clearly mention assumptions
        - Keep explanations simple but legally accurate
        - Always prefer options over free text input
        - Ask one step at a time
        - Maintain a professional, neutral tone
        - ALWAYS respond in valid JSON format as specified above
        """;

    public LegalAgentService(IConfiguration configuration, ILogger<LegalAgentService> logger)
    {
        _logger = logger;

        var endpoint = configuration["AzureOpenAI:Endpoint"]
            ?? throw new InvalidOperationException("AzureOpenAI:Endpoint is not configured");
        var deploymentName = configuration["AzureOpenAI:DeploymentName"] ?? "gpt-4o-mini";
        var apiKey = configuration["AzureOpenAI:ApiKey"];

        var tenantId = configuration["AzureOpenAI:TenantId"];

        AzureOpenAIClient client;
        if (!string.IsNullOrEmpty(apiKey))
        {
            client = new AzureOpenAIClient(
                new Uri(endpoint),
                new System.ClientModel.ApiKeyCredential(apiKey));
        }
        else if (!string.IsNullOrEmpty(tenantId))
        {
            client = new AzureOpenAIClient(
                new Uri(endpoint),
                new AzureCliCredential(new AzureCliCredentialOptions { TenantId = tenantId }));
        }
        else
        {
            client = new AzureOpenAIClient(
                new Uri(endpoint),
                new AzureCliCredential());
        }

        _agent = client
            .GetChatClient(deploymentName)
            .AsAIAgent(
                instructions: SystemPrompt,
                name: "LegalConsultantAgent");
    }

    public async Task<(string serializedSession, ChatResponse response)> StartConsultationAsync()
    {
        var session = await _agent.CreateSessionAsync();

        var openingMessage = "Please select the type of legal issue you are facing. " +
            "I'll guide you step-by-step using simple options and then provide applicable laws, " +
            "case references, estimated timeline, and legal costs.";

        var result = await _agent.RunAsync(
            "The user has just started a new legal consultation. " +
            "Begin with Step 1 and present the legal issue type options. " +
            "Remember to respond in JSON format.",
            session);

        var serializedJson = await _agent.SerializeSessionAsync(session);
        var serialized = serializedJson.GetRawText();
        var chatResponse = ParseAgentResponse(result.Text ?? "", openingMessage);

        return (serialized, chatResponse);
    }

    public async Task<(string serializedSession, ChatResponse response)> ContinueConsultationAsync(
        string serializedSession, string userMessage)
    {
        var sessionJson = JsonDocument.Parse(serializedSession).RootElement;
        var session = await _agent.DeserializeSessionAsync(sessionJson);

        var result = await _agent.RunAsync(userMessage, session);

        var newSerializedJson = await _agent.SerializeSessionAsync(session);
        var newSerialized = newSerializedJson.GetRawText();
        var chatResponse = ParseAgentResponse(result.Text ?? "");

        return (newSerialized, chatResponse);
    }

    private ChatResponse ParseAgentResponse(string agentResult, string? fallbackMessage = null)
    {
        try
        {
            var cleanedResult = agentResult.Trim();

            // Strip markdown code block wrappers if present
            if (cleanedResult.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                cleanedResult = cleanedResult["```json".Length..];
            }
            else if (cleanedResult.StartsWith("```"))
            {
                cleanedResult = cleanedResult[3..];
            }

            if (cleanedResult.EndsWith("```"))
            {
                cleanedResult = cleanedResult[..^3];
            }

            cleanedResult = cleanedResult.Trim();

            var jsonDoc = JsonSerializer.Deserialize<JsonElement>(cleanedResult);

            return new ChatResponse
            {
                Message = jsonDoc.TryGetProperty("message", out var msg) ? msg.GetString() ?? "" : cleanedResult,
                CurrentStep = jsonDoc.TryGetProperty("currentStep", out var step) ? step.GetInt32() : 1,
                StepTitle = jsonDoc.TryGetProperty("stepTitle", out var title) ? title.GetString() ?? "" : "",
                Options = jsonDoc.TryGetProperty("options", out var opts)
                    ? ParseOptions(opts)
                    : []
            };
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse agent JSON response, using raw text");
            return new ChatResponse
            {
                Message = fallbackMessage ?? agentResult,
                CurrentStep = 1,
                StepTitle = "Select Legal Issue Type",
                Options = GetDefaultStep1Options()
            };
        }
    }

    private static List<ChatOption> ParseOptions(JsonElement optionsElement)
    {
        var options = new List<ChatOption>();
        if (optionsElement.ValueKind == JsonValueKind.Array)
        {
            foreach (var opt in optionsElement.EnumerateArray())
            {
                options.Add(new ChatOption
                {
                    Label = opt.TryGetProperty("label", out var label) ? label.GetString() ?? "" : "",
                    Value = opt.TryGetProperty("value", out var value) ? value.GetString() ?? "" : ""
                });
            }
        }
        return options;
    }

    private static List<ChatOption> GetDefaultStep1Options() =>
    [
        new() { Label = "Civil Dispute", Value = "civil_dispute" },
        new() { Label = "Criminal Matter", Value = "criminal_matter" },
        new() { Label = "Family Law (Divorce, Custody, etc.)", Value = "family_law" },
        new() { Label = "Property/Real Estate", Value = "property_real_estate" },
        new() { Label = "Employment/Labor", Value = "employment_labor" },
        new() { Label = "Corporate/Business", Value = "corporate_business" },
        new() { Label = "Consumer Complaint", Value = "consumer_complaint" },
        new() { Label = "Cyber Crime", Value = "cyber_crime" },
        new() { Label = "Other (Specify)", Value = "other" }
    ];
}
