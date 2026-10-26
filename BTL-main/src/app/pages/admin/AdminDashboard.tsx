import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Ticket, DollarSign, Users, Film, BarChart3, Activity } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TOOLTIP_STYLE = { backgroundColor: "#191F2B", border: "1px solid #292F3D", borderRadius: "8px", color: "#F5F5F7" };
const formatRevenue = (v: number) => `${(v / 1000000).toFixed(1)}M`;

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return <div className="p-6 text-white text-center">Đang tải bảng tổng quan...</div>;
  }

  const { kpis, revenueByDay, revenueByFormat, revenueByCinema, occupancyData, recentTransactions } = data;

  const KPI_CARDS = [
    { label: "Tổng doanh thu", value: `${(kpis.totalRevenue / 1000000).toFixed(1)}M₫`, sub: "+12.4% so với tháng trước", trend: "up", icon: DollarSign, color: "#35C98A" },
    { label: "Vé đã bán", value: kpis.totalTickets.toLocaleString(), sub: "+8.2% so với tháng trước", trend: "up", icon: Ticket, color: "#63A5FF" },
    { label: "Lượt đặt vé", value: kpis.totalOrders.toLocaleString(), sub: "+5.7% so với tháng trước", trend: "up", icon: Activity, color: "#F5B942" },
    { label: "Tỷ lệ lấp đầy", value: kpis.occupancyRate, sub: "-2.3% so với tháng trước", trend: "down", icon: BarChart3, color: "#F04452" },
    { label: "Phim đang chiếu", value: kpis.activeMovies, sub: "Đang công chiếu", trend: "neutral", icon: Film, color: "#c084fc" },
    { label: "Người dùng mới", value: kpis.newUsers, sub: "Trong 30 ngày qua", trend: "up", icon: Users, color: "#fb923c" },
  ];

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan hệ thống</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>Dữ liệu thực tế — tháng 10/2026</p>
        </div>
        <select className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}>
          <option>Tháng này</option>
          <option>Tháng trước</option>
        </select>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_CARDS.map(({ label, value, sub, trend, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              {trend !== "neutral" && (
                <div className="flex items-center gap-0.5 text-xs" style={{ color: trend === "up" ? "#35C98A" : "#F04452" }}>
                  {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                </div>
              )}
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: trend === "up" ? "#35C98A" : trend === "down" ? "#F04452" : "#A3AAB8" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base">Doanh thu 7 ngày qua</h3>
              <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>Tổng doanh thu theo ngày</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueByDay}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F04452" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F04452" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" />
              <XAxis dataKey="date" tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tickFormatter={formatRevenue} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatRevenue(v) + "₫", "Doanh thu"]} />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#F04452" fill="url(#revGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Format Pie */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-1">Doanh thu theo định dạng</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={revenueByFormat} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {revenueByFormat.map((_: any, i: number) => (
                  <Cell key={i} fill={["#F04452", "#63A5FF", "#F5B942", "#35C98A"][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Tỷ trọng"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-3">Doanh thu theo rạp</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueByCinema} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" horizontal={false} />
              <XAxis type="number" tickFormatter={formatRevenue} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cinema" tick={{ fill: "#A3AAB8", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatRevenue(v) + "₫", "Doanh thu"]} />
              <Bar dataKey="revenue" fill="#F04452" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-3">Tỷ lệ lấp đầy theo phim</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" />
              <XAxis dataKey="movie" tick={{ fill: "#737C8D", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Lấp đầy"]} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]} barSize={32}>
                {occupancyData.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.rate >= 80 ? "#35C98A" : entry.rate >= 65 ? "#F5B942" : "#F04452"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <h3 className="font-bold text-base mb-5">Giao dịch gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #292F3D" }}>
                {["Mã đặt vé", "Phim", "Khách hàng", "Rạp", "Thời gian", "Tổng tiền", "Trạng thái"].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: "#737C8D" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((row: any) => (
                <tr key={row.ref} style={{ borderBottom: "1px solid #1a2030" }}>
                  <td className="py-3 pr-4 font-mono text-xs" style={{ color: "#63A5FF" }}>{row.ref}</td>
                  <td className="py-3 pr-4 font-medium">{row.movie}</td>
                  <td className="py-3 pr-4" style={{ color: "#A3AAB8" }}>{row.customer}</td>
                  <td className="py-3 pr-4" style={{ color: "#A3AAB8" }}>{row.cinema}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: "#737C8D" }}>{row.time}</td>
                  <td className="py-3 pr-4 font-bold" style={{ color: "#F04452" }}>{row.amount}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(53,201,138,0.15)", color: "#35C98A" }}>
                      Hoàn thành
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}