using LegalConsultant.Api.Data;
using LegalConsultant.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LegalConsultant.Api.Services;

public class SessionService
{
    private readonly AppDbContext _db;

    public SessionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ConsultationSession> CreateSessionAsync(string serializedAgentSession)
    {
        var session = new ConsultationSession
        {
            SerializedAgentSession = serializedAgentSession,
            CurrentStep = 1
        };

        _db.Sessions.Add(session);
        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<ConsultationSession?> GetSessionAsync(string sessionId)
    {
        return await _db.Sessions.FindAsync(sessionId);
    }

    public async Task UpdateSessionAsync(string sessionId, string serializedAgentSession, int currentStep)
    {
        var session = await _db.Sessions.FindAsync(sessionId);
        if (session is not null)
        {
            session.SerializedAgentSession = serializedAgentSession;
            session.CurrentStep = currentStep;
            session.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public async Task SaveMessageAsync(string sessionId, string role, string content, int step)
    {
        _db.Messages.Add(new ConversationMessage
        {
            SessionId = sessionId,
            Role = role,
            Content = content,
            Step = step
        });
        await _db.SaveChangesAsync();
    }

    public async Task<List<ConversationMessage>> GetHistoryAsync(string sessionId)
    {
        return await _db.Messages
            .Where(m => m.SessionId == sessionId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();
    }
}
