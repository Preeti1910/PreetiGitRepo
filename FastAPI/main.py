from fastapi import FastAPI, HTTPException

from models.product import Product, ProductUpdate
from database.cosmos import create_item, read_item, read_all_items, update_item, delete_item

app = FastAPI()


@app.get("/")
def greet():
    return "Hello User!"


@app.get("/products")
def get_products():
    items = read_all_items()
    return items


@app.get("/products/{product_id}")
def get_product(product_id: str, category: str = "general"):
    item = read_item(product_id, category)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item


@app.post("/product")
def create_product(product: Product):
    item = product.to_cosmos_item()
    created = create_item(item)
    return {"message": "Product created successfully", "product": created}


@app.put("/product/{product_id}")
def update_product(product_id: str, updated_product: ProductUpdate, category: str = "general"):
    existing = read_item(product_id, category)
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    updates = updated_product.model_dump(exclude_none=True)
    existing.update(updates)
    result = update_item(existing)
    return {"message": "Product updated successfully", "product": result}


@app.delete("/product/{product_id}")
def delete_product(product_id: str, category: str = "general"):
    success = delete_item(product_id, category)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}