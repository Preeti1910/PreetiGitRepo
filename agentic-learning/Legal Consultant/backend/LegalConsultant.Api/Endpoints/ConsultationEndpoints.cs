using LegalConsultant.Api.Models;
using LegalConsultant.Api.Services;

namespace LegalConsultant.Api.Endpoints;

public static class ConsultationEndpoints
{
    public static void MapConsultationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/consultation");

        group.MapPost("/start", StartConsultation);
        group.MapPost("/{sessionId}/message", SendMessage);
        group.MapGet("/{sessionId}/history", GetHistory);
    }

    private static async Task<IResult> StartConsultation(
        LegalAgentService agentService,
        SessionService sessionService)
    {
        var (serializedSession, response) = await agentService.StartConsultationAsync();

        var session = await sessionService.CreateSessionAsync(serializedSession);
        response.SessionId = session.Id;

        await sessionService.SaveMessageAsync(session.Id, "assistant", response.Message, response.CurrentStep);

        return Results.Ok(response);
    }

    private static async Task<IResult> SendMessage(
        string sessionId,
        ChatRequest request,
        LegalAgentService agentService,
        SessionService sessionService)
    {
        var session = await sessionService.GetSessionAsync(sessionId);
        if (session is null)
            return Results.NotFound(new { error = "Session not found" });

        await sessionService.SaveMessageAsync(sessionId, "user", request.Message, session.CurrentStep);

        var (serializedSession, response) = await agentService.ContinueConsultationAsync(
            session.SerializedAgentSession, request.Message);

        response.SessionId = sessionId;

        await sessionService.UpdateSessionAsync(sessionId, serializedSession, response.CurrentStep);
        await sessionService.SaveMessageAsync(sessionId, "assistant", response.Message, response.CurrentStep);

        return Results.Ok(response);
    }

    private static async Task<IResult> GetHistory(
        string sessionId,
        SessionService sessionService)
    {
        var session = await sessionService.GetSessionAsync(sessionId);
        if (session is null)
            return Results.NotFound(new { error = "Session not found" });

        var messages = await sessionService.GetHistoryAsync(sessionId);
        return Results.Ok(new
        {
            sessionId,
            currentStep = session.CurrentStep,
            messages = messages.Select(m => new
            {
                m.Role,
                m.Content,
                m.Step,
                m.Timestamp
            })
        });
    }
}
