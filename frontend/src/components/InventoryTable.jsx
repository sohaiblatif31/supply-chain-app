import { useState } from "react";

export default function InventoryTable({ inventory, onReorder, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  // --- THE FILTER LOGIC ---
  const filteredData = inventory.filter((item) => {
    // 1. Force everything to numbers for safe math
    const stock = Number(item.current_stock);
    const point = Number(item.reorder_point);
    const isLow = stock <= point;

    // 2. Check Search Match
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Check Filter Toggle
    // If box is UNCHECKED, we show everything.
    // If box is CHECKED, we ONLY show items where isLow is true.
    const matchesToggle = filterLowStock ? isLow : true;

    return matchesSearch && matchesToggle;
  });

  // This log helps you debug in the browser console
  console.log(
    "Current Inventory:",
    inventory.length,
    "Visible Items:",
    filteredData.length
  );

  return (
    <div className="mx-[5%] animate-in slide-in-from-bottom-4 duration-500">
      {/* --- CONTROL BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-3 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search SKUs or Products..."
            className="p-2 pl-10 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
            />
            {/* Custom Toggle Switch UI */}
            <div
              className={`w-10 h-6 rounded-full transition ${
                filterLowStock ? "bg-red-500" : "bg-slate-300"
              }`}
            ></div>
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                filterLowStock ? "translate-x-4" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition">
            Show Low Stock Only
          </span>
        </label>
      </div>

      {/* --- THE TABLE --- */}
      <div className="overflow-hidden shadow-2xl rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-xs font-bold text-slate-500 uppercase">
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Stock Level</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
              <th className="px-6 py-4 text-center">Reorder Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs font-mono text-blue-500">
                      {item.sku}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`text-lg font-bold ${
                        Number(item.current_stock) <= Number(item.reorder_point)
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.current_stock}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Limit: {item.reorder_point}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {Number(item.current_stock) <=
                    Number(item.reorder_point) ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        Critically Low
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        Stable
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3 justify-center items-center">
                    <button
                      onClick={() => onReorder(item.id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-bold shadow-md hover:bg-blue-700"
                    >
                      Reorder
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-slate-300 hover:text-red-600 text-2xl transition"
                    >
                      ✕
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-400">Est. Reorder Cost:</p>
                    <p className="font-bold text-slate-700">
                      ${(Number(item.unit_cost) * 50).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">(for 50 units)</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-20 text-slate-400 italic"
                >
                  No items found matching those criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
