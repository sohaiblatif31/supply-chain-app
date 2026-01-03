import { Bar } from "react-chartjs-2";

export default function Dashboard({ inventory, chartData, suppliers = [] }) {
  // --- EXISTING LOGIC ---
  const criticalItem = [...inventory]
    .filter((i) => Number(i.current_stock) <= Number(i.reorder_point))
    .sort(
      (a, b) =>
        Number(a.reorder_point) -
        Number(a.current_stock) -
        (Number(b.reorder_point) - Number(b.current_stock))
    )
    .reverse()[0];

  const riskyItems = inventory
    .map((item) => ({
      ...item,
      ratio:
        item.reorder_point > 0
          ? Number(item.current_stock) / Number(item.reorder_point)
          : 1,
    }))
    .sort((a, b) => a.ratio - b.ratio);

  const topRisk = riskyItems[0];

  const highValueItems = [...inventory]
    .map((item) => ({
      ...item,
      totalValue: Number(item.current_stock) * Number(item.unit_cost),
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // --- NEW LOGIC: SUPPLIER LEAD TIME CHART ---
  const supplierChartData = {
    labels: suppliers.map((s) => s.name),
    datasets: [
      {
        label: "Lead Time (Days)",
        data: suppliers.map((s) => s.lead_time_days),
        backgroundColor: "rgba(99, 102, 241, 0.8)", // Indigo
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out pb-20">
      {/* 1. TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 mx-[5%]">
        {/* ... (Keep your existing cards for Priority, Risk, SKUs, Low Stock, Value) ... */}
        {/* (Assuming cards are same as previous response) */}
      </div>

      {/* 2. MAIN STOCK CHART */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mx-[5%] mb-8 h-96 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-700 uppercase mb-6">
          Visual Stock Analysis
        </h2>
        <div className="h-64">
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* 3. TWO COLUMN GRID FOR LIST AND NEW CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-[5%]">
        {/* TOP 5 HIGH-VALUE ASSETS */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 uppercase mb-6 flex items-center gap-2">
            <span className="text-xl">💰</span> Capital Allocation
          </h2>
          <div className="space-y-3">
            {highValueItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] font-mono text-blue-500">
                    {item.sku}
                  </p>
                </div>
                <p className="text-lg font-black text-slate-900">
                  ${item.totalValue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: SUPPLIER LEAD TIME COMPARISON */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 uppercase mb-6 flex items-center gap-2">
            <span className="text-xl">🕒</span> Supplier Lead Times
          </h2>
          <div className="h-64">
            {suppliers.length > 0 ? (
              <Bar
                data={supplierChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Days" },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">
                No supplier data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
