# Legal Consultant API

AI-powered legal consultation backend built with .NET 10 and Microsoft Agent Framework. Provides an 8-step guided consultation flow specializing in Indian law.

## Tech Stack

- **.NET 10** Minimal API
- **Microsoft Agent Framework** (v1.5.0) for AI orchestration
- **Azure OpenAI** (gpt-4o-mini) for language model
- **Entity Framework Core** with SQLite for session persistence
- **Azure Identity** for Azure AD authentication

## Project Structure

```text
LegalConsultant.Api/
├── Data/                  # EF Core DbContext
├── Endpoints/             # Minimal API endpoint definitions
├── Models/                # Request/response and entity models
├── Services/              # Agent and session business logic
├── Program.cs             # Application entry point and DI setup
└── appsettings.*.json     # Configuration
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Azure OpenAI resource with a `gpt-4o-mini` deployment
- Azure CLI logged into the tenant that owns the OpenAI resource

## Configuration

Edit `appsettings.Development.json`:

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://<your-resource>.openai.azure.com",
    "DeploymentName": "gpt-4o-mini",
    "TenantId": "<your-tenant-id>"
  }
}
```

Authentication uses `AzureCliCredential` by default. Ensure you're logged in:

```bash
az login --tenant "<your-tenant-id>"
```

Your identity needs the **Cognitive Services OpenAI User** role on the resource.

## Running

```bash
dotnet run
```

The API starts at `http://localhost:5010`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/consultation/start` | Start a new consultation session |
| POST | `/api/consultation/{sessionId}/message` | Send a message in an existing session |
| GET | `/api/consultation/{sessionId}/history` | Retrieve conversation history |

### Start Consultation

```bash
curl -X POST http://localhost:5010/api/consultation/start
```

### Send Message

```bash
curl -X POST http://localhost:5010/api/consultation/{sessionId}/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Civil Dispute"}'
```

## Consultation Flow

1. Select Legal Issue Type
2. Sub-category Selection
3. Key Facts Collection
4. Jurisdiction and Timeline
5. Legal Analysis
6. Remedies and Options
7. Cost and Time Estimates
8. Smart Follow-Up Options
