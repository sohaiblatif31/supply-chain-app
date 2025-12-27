from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base  # <--- Import Base from database directly
import models  # This stays so the tables are registered

from fastapi import Depends
from sqlalchemy.orm import Session
from database import SessionLocal

app = FastAPI()

# Dependency to get database access for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    # This fetches all products from your Postgres table
    items = db.query(models.Product).all()
    return items


# CHANGE THIS LINE: Use Base directly, not models.Base
Base.metadata.create_all(bind=engine) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Supply Chain API is Online"}


from pydantic import BaseModel

# A simple "Contract" for what the frontend must send us
class OrderRequest(BaseModel):
    product_id: int
    quantity: int

@app.post("/reorder")
def process_reorder(request: OrderRequest, db: Session = Depends(get_db)):
    # 1. Find the product in the database
    product = db.query(models.Product).filter(models.Product.id == request.product_id).first()
    
    if not product:
        return {"error": "Product not found"}

    # 2. Update the stock level
    product.current_stock += request.quantity
    
    # 3. Save the changes
    db.commit()
    
    return {
        "message": f"Successfully ordered {request.quantity} units.",
        "new_stock": product.current_stock
    }


# A new schema for adding products
class ProductCreate(BaseModel):
    sku: str
    name: str
    current_stock: int
    reorder_point: int
    unit_cost: float
    supplier_id: int

# 1. Add New Product
@app.post("/products")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_item = models.Product(**product.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# 2. Delete Product
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Product).filter(models.Product.id == product_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Deleted"}