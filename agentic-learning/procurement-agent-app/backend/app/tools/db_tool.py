from datetime import datetime, timezone
from typing import Any, Dict, Optional
from app.services.cosmos_service import save_item


def log_agent_interaction(
    agent: str, query: str, answer: str, mode: str, session_id: Optional[str] = None
) -> str:
    item: Dict[str, Any] = {
        "id": f"{agent}-{datetime.now(timezone.utc).timestamp()}",
        "agent": agent,
        "session_id": session_id,
        "query": query,
        "answer": answer,
        "mode": mode,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }
    return save_item(item)
