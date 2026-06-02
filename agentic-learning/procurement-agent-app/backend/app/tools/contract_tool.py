import json
from pathlib import Path
from typing import List, Dict, Any

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "sample_contracts.json"


def get_contracts() -> List[Dict[str, Any]]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))
