from typing import Dict, Any
from app.services.openai_service import complete
from app.tools.vendor_tool import get_vendors


def vendor_agent(query: str) -> Dict[str, Any]:
    vendors = get_vendors()
    prompt = f"""
You are a procurement vendor recommendation agent.
User query: {query}
Available vendors: {vendors}
Explain which vendor is best using price, rating, delivery_days, and risk_level.
If budget is mentioned, factor that in.
""".strip()
    result = complete(prompt)
    return {
        "agent": "vendor_agent",
        "answer": result["text"],
        "evidence": vendors,
        "mode": result["mode"],
    }
