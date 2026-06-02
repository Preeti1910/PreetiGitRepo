import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)
LOCAL_STORE_PATH = Path(__file__).resolve().parents[2] / "data" / "local_store.json"


def _append_local(item: Dict[str, Any]) -> None:
    LOCAL_STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not LOCAL_STORE_PATH.exists():
        LOCAL_STORE_PATH.write_text("[]", encoding="utf-8")
    existing = json.loads(LOCAL_STORE_PATH.read_text(encoding="utf-8") or "[]")
    existing.append(item)
    LOCAL_STORE_PATH.write_text(json.dumps(existing, indent=2), encoding="utf-8")


def _read_local(session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    if not LOCAL_STORE_PATH.exists():
        return []
    existing = json.loads(LOCAL_STORE_PATH.read_text(encoding="utf-8") or "[]")
    matches = [item for item in existing if item.get("session_id") == session_id]
    matches.sort(key=lambda x: x.get("timestamp_utc", ""))
    return matches[-limit:]


def save_item(item: Dict[str, Any]) -> str:
    if not settings.cosmos_enabled:
        _append_local(item)
        return "local"

    try:
        from azure.cosmos import CosmosClient, PartitionKey

        client = CosmosClient(settings.cosmos_uri, credential=settings.cosmos_key)
        database = client.create_database_if_not_exists(id=settings.cosmos_database)
        container = database.create_container_if_not_exists(
            id=settings.cosmos_container,
            partition_key=PartitionKey(path="/session_id"),
        )
        container.create_item(body=item)
        return "cosmos"
    except Exception:
        logger.exception("Cosmos save failed. Falling back to local store.")
        _append_local(item)
        return "local"


def get_conversation_history(
    session_id: Optional[str], limit: int = 10
) -> List[Dict[str, Any]]:
    if not session_id:
        return []

    if not settings.cosmos_enabled:
        return _read_local(session_id, limit)

    try:
        from azure.cosmos import CosmosClient

        client = CosmosClient(settings.cosmos_uri, credential=settings.cosmos_key)
        database = client.get_database_client(settings.cosmos_database)
        container = database.get_container_client(settings.cosmos_container)
        query = (
            "SELECT * FROM c WHERE c.session_id = @sid "
            "ORDER BY c.timestamp_utc DESC OFFSET 0 LIMIT @limit"
        )
        params: List[Dict[str, Any]] = [
            {"name": "@sid", "value": session_id},
            {"name": "@limit", "value": limit},
        ]
        items = list(
            container.query_items(query=query, parameters=params, enable_cross_partition_query=False)
        )
        items.reverse()
        return items
    except Exception:
        logger.exception("Cosmos read failed. Falling back to local store.")
        return _read_local(session_id, limit)
