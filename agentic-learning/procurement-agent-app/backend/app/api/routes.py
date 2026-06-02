from fastapi import APIRouter
from app.agents.orchestrator import run_agent
from app.config.settings import settings
from app.models.schemas import QueryRequest, AgentResponse, HealthResponse
from app.tools.vendor_tool import get_vendors

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", app=settings.app_name)


@router.get("/vendors")
def vendors():
    return {"items": get_vendors()}


@router.post("/agents/query", response_model=AgentResponse)
def agent_query(payload: QueryRequest) -> AgentResponse:
    result = run_agent(payload.query)
    return AgentResponse(
        agent=result["agent"],
        answer=result["answer"],
        evidence=result.get("evidence", []),
        mode=result.get("mode", "mock"),
    )
