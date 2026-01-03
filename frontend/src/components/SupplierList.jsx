import { useState, useEffect } from "react";
import axios from "axios";

export default function SupplierList() {
  // --- STATE ---
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSup, setNewSup] = useState({
    name: "",
    contact_email: "",
    lead_time_days: 7,
  });

  // --- ACTIONS ---
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/suppliers");
      setSuppliers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault(); // This connects the button to the logic
    try {
      await axios.post("http://127.0.0.1:8000/suppliers", newSup);

      // Reset form and refresh list
      setNewSup({ name: "", contact_email: "", lead_time_days: 7 });
      fetchSuppliers();
      alert("Supplier added successfully!");
    } catch (err) {
      console.error("Add failed:", err);
      alert("Error: Supplier name might already exist or server is down.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this supplier?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Suppliers...</div>;

  return (
    <div className="mx-[5%] animate-in fade-in duration-500">
      {/* --- ADD SUPPLIER FORM --- */}

      <form
        onSubmit={handleAdd}
        className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-10"
      >
        <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          <span className="bg-blue-100 p-2 rounded-lg">🏢</span> Register New
          Supplier
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* 1. Name Input */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Company Name
            </label>
            <input
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Global Textiles"
              value={newSup.name}
              onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
              required
            />
          </div>

          {/* 2. Email Input */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Contact Email
            </label>
            <input
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              type="email"
              placeholder="sales@company.com"
              value={newSup.contact_email}
              onChange={(e) =>
                setNewSup({ ...newSup, contact_email: e.target.value })
              }
              required
            />
          </div>

          {/* 3. NEW: Lead Time Input */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Avg Lead Time (Days)
            </label>
            <input
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              type="number"
              placeholder="7"
              value={newSup.lead_time_days}
              onChange={(e) =>
                setNewSup({ ...newSup, lead_time_days: e.target.value })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-800 transition shadow-md active:scale-95"
          >
            Add Supplier
          </button>
        </div>
      </form>

      {/* --- SUPPLIERS DISPLAY GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.length > 0 ? (
          suppliers.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-900"></div>

              <button
                onClick={() => handleDelete(s.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-600 transition-colors"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {s.name}
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-4">
                {s.contact_email}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Avg. Delivery
                </span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                  {s.lead_time_days} Days
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-medium italic">
              No suppliers registered yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
