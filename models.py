from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base # Ensure this matches

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    lead_time_days = Column(Integer)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    current_stock = Column(Integer)
    reorder_point = Column(Integer)
    unit_cost = Column(Float)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))