namespace LegalConsultant.Api.Models;

public class ConversationMessage
{
    public int Id { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
    public int Step { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
