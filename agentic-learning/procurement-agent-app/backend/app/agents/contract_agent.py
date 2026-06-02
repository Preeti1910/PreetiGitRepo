from typing import Dict, Any
from app.services.openai_service import complete
from app.tools.contract_tool import get_contracts


def contract_agent(query: str) -> Dict[str, Any]:
    contracts = get_contracts()
    prompt = f"""
You are a procurement contract analysis agent.
User query: {query}
Available contracts: {contracts}
Summarize the contract and answer only from the provided contract data.
""".strip()
    result = complete(prompt)
    return {
        "agent": "contract_agent",
        "answer": result["text"],
        "evidence": contracts,
        "mode": result["mode"],
    }
