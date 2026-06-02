from typing import Dict, Any
from app.agents.contract_agent import contract_agent
from app.agents.risk_agent import risk_agent
from app.agents.vendor_agent import vendor_agent
from app.tools.db_tool import log_agent_interaction


def run_agent(query: str) -> Dict[str, Any]:
    q = query.lower()

    if any(word in q for word in ["vendor", "supplier", "recommend", "compare"]):
        result = vendor_agent(query)
    elif any(word in q for word in ["contract", "clause", "payment terms", "renewal", "termination"]):
        result = contract_agent(query)
    elif any(word in q for word in ["risk", "compliance", "high risk"]):
        result = risk_agent(query)
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
    )
    result["storage"] = storage_mode
    return result
