from datetime import datetime, timezone
from typing import Any, Dict
from app.services.cosmos_service import save_item


def log_agent_interaction(agent: str, query: str, answer: str, mode: str) -> str:
    item: Dict[str, Any] = {
        "id": f"{agent}-{datetime.now(timezone.utc).timestamp()}",
        "agent": agent,
        "query": query,
        "answer": answer,
        "mode": mode,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }
    return save_item(item)
