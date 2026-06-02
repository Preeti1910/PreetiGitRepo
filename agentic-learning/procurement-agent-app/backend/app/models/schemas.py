from typing import Any, Dict, List
from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Natural language user query")


class AgentResponse(BaseModel):
    agent: str
    answer: str
    evidence: List[Dict[str, Any]] = []
    mode: str = "mock"


class HealthResponse(BaseModel):
    status: str
    app: str
