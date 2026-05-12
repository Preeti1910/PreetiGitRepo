namespace LegalConsultant.Api.Models;

public class ConsultationSession
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string SerializedAgentSession { get; set; } = string.Empty;
    public int CurrentStep { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
