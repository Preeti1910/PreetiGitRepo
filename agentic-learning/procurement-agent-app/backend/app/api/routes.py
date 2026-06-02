from fastapi import APIRouter
from app.agents.orchestrator import run_agent
from app.config.settings import settings
from app.models.schemas import QueryRequest, AgentResponse, HealthResponse
from app.services.cosmos_service import get_conversation_history
from app.tools.vendor_tool import get_vendors

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", app=settings.app_name)


@router.get("/vendors")
def vendors():
    return {"items": get_vendors()}


@router.get("/sessions/{session_id}/history")
def session_history(session_id: str, limit: int = 20):
    items = get_conversation_history(session_id, limit=limit)
    return {"session_id": session_id, "messages": items}


@router.post("/agents/query", response_model=AgentResponse)
def agent_query(payload: QueryRequest) -> AgentResponse:
    result = run_agent(payload.query, session_id=payload.session_id)
    return AgentResponse(
        agent=result["agent"],
        answer=result["answer"],
        evidence=result.get("evidence", []),
        mode=result.get("mode", "mock"),
        session_id=result.get("session_id"),
    )
