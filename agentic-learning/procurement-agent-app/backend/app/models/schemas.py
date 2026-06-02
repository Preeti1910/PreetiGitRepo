from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Natural language user query")
    session_id: Optional[str] = Field(None, description="Session ID for conversation memory")


class AgentResponse(BaseModel):
    agent: str
    answer: str
    evidence: List[Dict[str, Any]] = []
    mode: str = "mock"
    session_id: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    app: str
