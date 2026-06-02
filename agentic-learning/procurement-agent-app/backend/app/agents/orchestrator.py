from typing import Dict, Any, List, Optional
from app.agents.contract_agent import contract_agent
from app.agents.risk_agent import risk_agent
from app.agents.vendor_agent import vendor_agent
from app.services.cosmos_service import get_conversation_history
from app.tools.db_tool import log_agent_interaction


def _build_context_summary(history: List[Dict[str, Any]]) -> str:
    if not history:
        return ""
    lines = []
    for item in history:
        lines.append(f"User: {item.get('query', '')}")
        lines.append(f"Agent ({item.get('agent', 'unknown')}): {item.get('answer', '')}")
    return "\n".join(lines)


def run_agent(query: str, session_id: Optional[str] = None) -> Dict[str, Any]:
    history = get_conversation_history(session_id)
    context = _build_context_summary(history)

    q = query.lower()

    if any(word in q for word in ["vendor", "supplier", "recommend", "compare"]):
        result = vendor_agent(query, context)
    elif any(word in q for word in ["contract", "clause", "payment terms", "renewal", "termination"]):
        result = contract_agent(query, context)
    elif any(word in q for word in ["risk", "compliance", "high risk"]):
        result = risk_agent(query, context)
    else:
        result = {
            "agent": "orchestrator",
            "answer": "I can help with vendor recommendations, contract summarization, and supplier risk assessment.",
            "evidence": [],
            "mode": "mock",
        }

    storage_mode = log_agent_interaction(
        agent=result["agent"],
        query=query,
        answer=result["answer"],
        mode=result["mode"],
        session_id=session_id,
    )
    result["storage"] = storage_mode
    result["session_id"] = session_id
    return result
