import { useState } from "react";
import axios from "axios";

export default function AddProductForm({ onProductAdded }) {
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    current_stock: "",
    reorder_point: "",
    unit_cost: "",
    lead_time_days: "",
    supplier_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/products", newProduct);
      // Reset form
      setNewProduct({
        sku: "",
        name: "",
        current_stock: 0,
        reorder_point: 0,
        unit_cost: 0,
        lead_time_days: 0,
        supplier_id: 0,
      });
      // Tell parent to refresh data
      onProductAdded();
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Register New Inventory Item
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="SKU"
            value={newProduct.sku}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sku: e.target.value })
            }
            required
          />
          <input
            className="border p-3 rounded-lg"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input
            className="border p-3 rounded-lg"
            type="number"
            placeholder="Initial Stock"
            value={newProduct.current_stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, current_stock: e.target.value })
            }
          />
          <input
            className="border p-3 rounded-lg"
            type="number"
            placeholder="Reorder Point"
            value={newProduct.reorder_point}
            onChange={(e) =>
              setNewProduct({ ...newProduct, reorder_point: e.target.value })
            }
          />
          <input
            className="border p-3 rounded-lg"
            type="number"
            placeholder="Unit Cost"
            value={newProduct.unit_cost}
            onChange={(e) =>
              setNewProduct({ ...newProduct, unit_cost: e.target.value })
            }
          />
        </div>
        <input
          className="border p-3 rounded-lg"
          type="number"
          placeholder="Lead Time (Days)"
          value={newProduct.lead_time_days}
          onChange={(e) =>
            setNewProduct({ ...newProduct, lead_time_days: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
        >
          Create SKU Entry
        </button>
      </form>
    </div>
  );
}
