namespace LegalConsultant.Api.Models;

public class ChatResponse
{
    public string SessionId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int CurrentStep { get; set; }
    public string StepTitle { get; set; } = string.Empty;
    public List<ChatOption> Options { get; set; } = [];
}
