from database import SessionLocal
import models

def seed_data():
    db = SessionLocal()
    try:
        # 1. Create a sample Supplier
        supplier = models.Supplier(
            name="Global Fabrics Inc", 
            lead_time_days=14
        )
        db.add(supplier)
        db.commit()
        db.refresh(supplier)

        # 2. Create sample Products
        p1 = models.Product(
            sku="COT-BLU-001", 
            name="Blue Cotton Roll", 
            current_stock=100, 
            reorder_point=40, 
            unit_cost=12.50,
            supplier_id=supplier.id
        )
        p2 = models.Product(
            sku="SILK-RED-002", 
            name="Red Silk Sheet", 
            current_stock=15, 
            reorder_point=20, # This one will be flagged for reorder!
            unit_cost=25.00,
            supplier_id=supplier.id
        )
        
        db.add_all([p1, p2])
        db.commit()
        print("✅ Database seeded with supply chain data!")
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()