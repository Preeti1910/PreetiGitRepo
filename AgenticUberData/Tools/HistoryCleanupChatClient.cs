using Microsoft.Extensions.AI;

/// <summary>
/// Strips orphaned tool-call/tool-response messages from conversation history.
/// Keeps matched pairs (assistant with tool_calls + following tool responses) intact.
/// Only removes orphaned tool_calls that have no matching tool responses.
/// </summary>
public class HistoryCleanupChatClient : DelegatingChatClient
{
    public HistoryCleanupChatClient(IChatClient innerClient) : base(innerClient) { }

    private static List<ChatMessage> CleanHistory(IEnumerable<ChatMessage> messages)
    {
        var messageList = messages.ToList();
        var cleaned = new List<ChatMessage>();

        for (int i = 0; i < messageList.Count; i++)
        {
            var msg = messageList[i];

            // If assistant message has FunctionCallContent, check if tool responses follow
            if (msg.Role == ChatRole.Assistant &&
                msg.Contents.Any(c => c is FunctionCallContent))
            {
                // Count consecutive Tool messages that follow
                int toolResponseCount = 0;
                while (i + 1 + toolResponseCount < messageList.Count &&
                       messageList[i + 1 + toolResponseCount].Role == ChatRole.Tool)
                {
                    toolResponseCount++;
                }

                if (toolResponseCount > 0)
                {
                    // Matched pair — keep assistant + all following tool responses
                    cleaned.Add(msg);
                    for (int j = 0; j < toolResponseCount; j++)
                    {
                        cleaned.Add(messageList[i + 1 + j]);
                    }
                    i += toolResponseCount; // skip past the tool responses we just added
                }
                else
                {
                    // Orphaned tool_calls — strip the function call parts, keep text only
                    var textParts = msg.Contents
                        .Where(c => c is not FunctionCallContent)
                        .ToList();
                    if (textParts.Count > 0)
                        cleaned.Add(new ChatMessage(msg.Role, textParts));
                    // else skip entirely
                }
                continue;
            }

            // Skip any stray Tool messages not preceded by an assistant tool_call
            if (msg.Role == ChatRole.Tool)
                continue;

            cleaned.Add(msg);
        }

        return cleaned;
    }

    public override Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? options = null, CancellationToken cancellationToken = default)
    {
        return base.GetResponseAsync(CleanHistory(messages), options, cancellationToken);
    }

    public override IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? options = null, CancellationToken cancellationToken = default)
    {
        return base.GetStreamingResponseAsync(CleanHistory(messages), options, cancellationToken);
    }
}
