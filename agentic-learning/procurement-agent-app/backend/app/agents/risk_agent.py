from typing import Dict, Any
from app.services.openai_service import complete
from app.tools.vendor_tool import get_vendors


def risk_agent(query: str, context: str = "") -> Dict[str, Any]:
    vendors = get_vendors()
    context_block = f"\nPrevious conversation:\n{context}\n" if context else ""
    prompt = f"""
You are a supplier risk assessment agent.
{context_block}
User query: {query}
Vendor records: {vendors}
Assess which vendor appears highest and lowest risk based only on risk_level and supporting fields.
""".strip()
    result = complete(prompt)
    return {
        "agent": "risk_agent",
        "answer": result["text"],
        "evidence": vendors,
        "mode": result["mode"],
    }
