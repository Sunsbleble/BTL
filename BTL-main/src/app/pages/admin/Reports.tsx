import { useState, useEffect } from "react";
import { Download, FileText, BarChart3, TrendingUp, DollarSign, Ticket } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TOOLTIP_STYLE = { backgroundColor: "#191F2B", border: "1px solid #292F3D", borderRadius: "8px", color: "#F5F5F7" };

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const formatShortVND = (amount: number) => {
  return `${(amount / 1000000).toFixed(1)}M₫`;
};

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/reports");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading || !data) {
    return <div className="p-6 text-white text-center">Đang tải dữ liệu báo cáo...</div>;
  }

  const { kpis, revenueByDay, revenueByCinema, paymentData, foodSalesData } = data;

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo & Phân tích</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>Tháng 10/2026 · Dữ liệu thực tế</p>
        </div>
        <div className="flex gap-3">
          <select className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}>
            <option>Tháng 10/2026</option>
            <option>Tháng 09/2026</option>
            <option>Quý 3/2026</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-white/5 cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
            <Download size={15} /> Xuất CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-white/5 cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
            <FileText size={15} /> Xuất PDF
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng doanh thu", value: formatShortVND(kpis.totalRevenue), icon: DollarSign, color: "#35C98A" },
          { label: "Vé đã bán", value: kpis.totalTickets.toLocaleString(), icon: Ticket, color: "#63A5FF" },
          { label: "Doanh thu bắp nước", value: formatShortVND(kpis.totalFoodRevenue), icon: BarChart3, color: "#F5B942" },
          { label: "Tăng trưởng MoM", value: kpis.momGrowth, icon: TrendingUp, color: "#F04452" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Xu hướng doanh thu theo ngày</h3>
          <div className="flex gap-3 text-xs" style={{ color: "#737C8D" }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ backgroundColor: "#F04452" }} />Doanh thu</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ backgroundColor: "#63A5FF" }} />Số vé</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueByDay}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F04452" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F04452" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" />
            <XAxis dataKey="date" tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <YAxis yAxisId="tick" orientation="right" tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => name === "revenue" ? [`${(v / 1000000).toFixed(1)}M₫`, "Doanh thu"] : [v, "Số vé"]} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#F04452" fill="url(#rg)" strokeWidth={2.5} dot={false} />
            <Line yAxisId="tick" type="monotone" dataKey="tickets" stroke="#63A5FF" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Cinema */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-5">Doanh thu theo rạp chiếu</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByCinema} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cinema" tick={{ fill: "#A3AAB8", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${(v / 1000000).toFixed(1)}M₫`, "Doanh thu"]} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={22}>
                {revenueByCinema.map((_: any, i: number) => <Cell key={i} fill={["#F04452", "#63A5FF", "#F5B942", "#35C98A"][i % 4]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-5">Phương thức thanh toán</h3>
          <div className="space-y-3">
            {paymentData.map((p: any) => (
              <div key={p.method}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: "#A3AAB8" }}>{p.method}</span>
                  <span className="font-bold">{p.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Sales Table */}
      <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Doanh thu bắp nước & đồ ăn</h3>
          <button className="text-xs hover:underline cursor-pointer" style={{ color: "#F04452" }}>Xuất báo cáo →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #292F3D" }}>
                {["Sản phẩm", "Số lượng", "Doanh thu", "Tỷ trọng"].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: "#737C8D" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {foodSalesData.map((item: any, i: number) => {
                const totalRev = foodSalesData.reduce((s: number, d: any) => s + d.revenue, 0);
                const pct = Math.round((item.revenue / totalRev) * 100);
                return (
                  <tr key={item.name} style={{ borderBottom: "1px solid #1a2030" }}>
                    <td className="py-3 pr-4 font-medium">{item.name}</td>
                    <td className="py-3 pr-4" style={{ color: "#A3AAB8" }}>{item.qty.toLocaleString()}</td>
                    <td className="py-3 pr-4 font-bold" style={{ color: "#F04452" }}>{formatVND(item.revenue)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ["#F04452", "#63A5FF", "#F5B942", "#35C98A", "#c084fc"][i % 5] }} />
                        </div>
                        <span className="text-xs" style={{ color: "#737C8D" }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}