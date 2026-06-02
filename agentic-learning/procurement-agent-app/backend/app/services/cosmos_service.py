import json
from pathlib import Path
from typing import Any, Dict
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
            partition_key=PartitionKey(path="/agent"),
        )
        container.create_item(body=item)
        return "cosmos"
    except Exception:
        logger.exception("Cosmos save failed. Falling back to local store.")
        _append_local(item)
        return "local"
