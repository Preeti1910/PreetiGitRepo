# Procurement Agent App

A ready-to-run starter repo for a **procurement-focused agent app** using:

- **FastAPI** (Python API layer)
- **Azure OpenAI / Azure AI Foundry compatible service layer**
- **Cosmos DB** (optional, with local-file fallback for immediate runs)
- **React + Vite** (simple chat-style frontend)
- **Tool-based multi-agent orchestration**

> This starter is designed so you can run it **immediately in mock mode** and later switch to **Azure OpenAI + Cosmos DB** by adding environment variables.

---

## Repo Structure

```text
procurement-agent-app/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py
│   │   ├── agents/
│   │   │   ├── contract_agent.py
│   │   │   ├── orchestrator.py
│   │   │   ├── risk_agent.py
│   │   │   └── vendor_agent.py
│   │   ├── config/
│   │   │   └── settings.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── cosmos_service.py
│   │   │   └── openai_service.py
│   │   ├── tools/
│   │   │   ├── contract_tool.py
│   │   │   ├── db_tool.py
│   │   │   └── vendor_tool.py
│   │   ├── utils/
│   │   │   └── logger.py
│   │   └── main.py
│   ├── data/
│   │   ├── sample_contracts.json
│   │   ├── sample_vendors.json
│   │   └── local_store.json
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── services/
│   │       └── api.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── docs/
    └── demo-queries.md
```

---

## Quick Start

### 1) Backend setup

```bash
cd backend
python -m venv .venv
```

#### Windows PowerShell
```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

#### macOS / Linux / Git Bash
```bash
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend will run at: [http://localhost:8000](http://localhost:8000)

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## Immediate Demo (Mock Mode)

The app works **without Azure keys**.
If Azure OpenAI is not configured, the backend automatically returns a **mock LLM response** based on the tool outputs.

Try these queries:

- `Recommend a vendor for laptops under 100000`
- `Summarize the vendor contract`
- `Assess supplier risk for Vendor C`
- `What can you do?`

---

## Switch to Azure OpenAI / Foundry-Compatible Mode

Update `backend/.env`:

```env
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

> If these values are present, the service will call Azure OpenAI instead of mock mode.

---

## Switch to Cosmos DB

Update `backend/.env`:

```env
COSMOS_ENABLED=true
COSMOS_URI=https://<your-cosmos-account>.documents.azure.com:443/
COSMOS_KEY=<your-key>
COSMOS_DATABASE=procurementdb
COSMOS_CONTAINER=agentlogs
```

If Cosmos DB is **not** configured, the app stores interactions in `backend/data/local_store.json`.

---

## Example API Requests

### Health
```bash
curl http://localhost:8000/api/health
```

### Vendor list
```bash
curl http://localhost:8000/api/vendors
```

### Agent query
```bash
curl -X POST http://localhost:8000/api/agents/query   -H "Content-Type: application/json"   -d '{"query": "Recommend a vendor for laptops under 100000"}'
```

---

## What to Extend Next

- Add **real ERP / SAP / Ariba connectors** in `tools/`
- Replace sample data with **Cosmos or enterprise APIs**
- Add **memory/context window** for conversation threads
- Add **multi-agent routing** in `orchestrator.py`
- Add **evaluation logging** for prompts and outcomes
- Deploy backend to **Azure App Service / Container Apps**

---

## Recommended Learning Steps for You

1. Run this repo in mock mode
2. Add one new tool (for example, `supplier_score_tool.py`)
3. Add one new agent (for example, `intake_agent.py`)
4. Connect Azure OpenAI
5. Connect Cosmos DB
6. Add authentication and real procurement data sources

---

## Troubleshooting

### `ModuleNotFoundError`
Make sure you activated the virtual environment and ran:
```bash
pip install -r requirements.txt
```

### Frontend cannot reach backend
Make sure backend is running on port `8000` and frontend on `5173`.

### Azure OpenAI errors
Double-check:
- endpoint
- key
- deployment name
- API version

---

## License

Starter template for internal learning / prototyping.
