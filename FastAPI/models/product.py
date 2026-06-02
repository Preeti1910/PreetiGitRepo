from pydantic import BaseModel
from typing import Optional
import uuid


class Product(BaseModel):
    id: Optional[str] = None
    name: str
    price: float
    description: Optional[str] = None
    category: str = "general"

    def to_cosmos_item(self) -> dict:
        item = self.model_dump()
        if not item["id"]:
            item["id"] = str(uuid.uuid4())
        return item


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
