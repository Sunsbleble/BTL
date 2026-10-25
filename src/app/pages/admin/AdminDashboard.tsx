import { TrendingUp, TrendingDown, Ticket, DollarSign, Users, Film, BarChart3, Activity } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { revenueByDay, revenueByCinema, revenueByFormat, occupancyData } from "../../data/mockData";

const KPI_CARDS = [
  { label: "Tổng doanh thu", value: "468.0M₫", sub: "+12.4% so với tháng trước", trend: "up", icon: DollarSign, color: "#35C98A" },
  { label: "Vé đã bán", value: "4,916", sub: "+8.2% so với tháng trước", trend: "up", icon: Ticket, color: "#63A5FF" },
  { label: "Lượt đặt vé", value: "2,341", sub: "+5.7% so với tháng trước", trend: "up", icon: Activity, color: "#F5B942" },
  { label: "Tỷ lệ lấp đầy", value: "74.1%", sub: "-2.3% so với tháng trước", trend: "down", icon: BarChart3, color: "#F04452" },
  { label: "Phim đang chiếu", value: "5", sub: "3 phim sắp chiếu", trend: "neutral", icon: Film, color: "#c084fc" },
  { label: "Người dùng mới", value: "284", sub: "+18.9% so với tháng trước", trend: "up", icon: Users, color: "#fb923c" },
];

const TOOLTIP_STYLE = { backgroundColor: "#191F2B", border: "1px solid #292F3D", borderRadius: "8px", color: "#F5F5F7" };

const formatRevenue = (v: number) => `${(v / 1000000).toFixed(1)}M`;

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan hệ thống</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>Dữ liệu minh họa — tháng 10/2026</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}>
            <option>Tháng này</option>
            <option>Tháng trước</option>
            <option>Quý này</option>
          </select>
        </div>
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
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base">Doanh thu 7 ngày qua</h3>
              <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>Tổng doanh thu theo ngày</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F04452" }} />Doanh thu</span>
              <span className="flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#63A5FF" }} />Vé bán</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueByDay}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F04452" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F04452" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#63A5FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#63A5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" />
              <XAxis dataKey="date" tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tickFormatter={formatRevenue} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
              <YAxis yAxisId="tick" orientation="right" tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => name === "revenue" ? [formatRevenue(v) + "₫", "Doanh thu"] : [v, "Vé bán"]} />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#F04452" fill="url(#revGrad)" strokeWidth={2} dot={false} />
              <Area yAxisId="tick" type="monotone" dataKey="tickets" stroke="#63A5FF" fill="url(#tickGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Format Pie */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-1">Doanh thu theo định dạng</h3>
          <p className="text-xs mb-5" style={{ color: "#737C8D" }}>Tỷ trọng doanh thu</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={revenueByFormat} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {revenueByFormat.map((entry, i) => (
                  <Cell key={entry.format} fill={["#F04452", "#63A5FF", "#F5B942", "#35C98A"][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Tỷ trọng"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {revenueByFormat.map((item, i) => (
              <div key={item.format} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#F04452", "#63A5FF", "#F5B942", "#35C98A"][i] }} />
                  <span style={{ color: "#A3AAB8" }}>{item.format}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#737C8D" }}>{item.value}%</span>
                  <span className="font-semibold">{(item.revenue / 1000000).toFixed(0)}M₫</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Cinema */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-1">Doanh thu theo rạp</h3>
          <p className="text-xs mb-5" style={{ color: "#737C8D" }}>Tháng 10/2026</p>
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

        {/* Occupancy by Movie */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <h3 className="font-bold text-base mb-1">Tỷ lệ lấp đầy theo phim</h3>
          <p className="text-xs mb-5" style={{ color: "#737C8D" }}>Suất chiếu trong tuần</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292F3D" />
              <XAxis dataKey="movie" tick={{ fill: "#737C8D", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "#737C8D", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Lấp đầy"]} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]} barSize={32}>
                {occupancyData.map((entry, i) => (
                  <Cell key={i} fill={entry.rate >= 80 ? "#35C98A" : entry.rate >= 65 ? "#F5B942" : "#F04452"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs" style={{ color: "#737C8D" }}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#35C98A" }} />≥80% Tốt</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F5B942" }} />65–79% Trung bình</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F04452" }} />&lt;65% Thấp</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-5 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Giao dịch gần đây</h3>
          <button className="text-xs" style={{ color: "#F04452" }}>Xem tất cả →</button>
        </div>
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
              {[
                { ref: "BK240001", movie: "Đặc Vụ Không Gian", customer: "Nguyễn Thị Hoa", cinema: "Vincom HN", time: "22/10 19:00", amount: "395.000₫", status: "upcoming" },
                { ref: "BK230089", movie: "Người Khổng Lồ Xanh", customer: "Nguyễn Thị Hoa", cinema: "Landmark 81", time: "10/10 16:00", amount: "335.000₫", status: "completed" },
                { ref: "BK230078", movie: "Hương Vị Quê Nhà", customer: "Nguyễn Thị Hoa", cinema: "Sun World ĐN", time: "28/09 13:00", amount: "270.000₫", status: "completed" },
                { ref: "BK228901", movie: "Cô Dâu Bóng Tối", customer: "Lê Thị Thanh", cinema: "Vincom HN", time: "21/10 20:30", amount: "180.000₫", status: "completed" },
                { ref: "BK228799", movie: "Đặc Vụ Không Gian", customer: "Trần Văn Minh", cinema: "Landmark 81", time: "20/10 14:45", amount: "220.000₫", status: "completed" },
              ].map((row) => (
                <tr key={row.ref} style={{ borderBottom: "1px solid #1a2030" }}>
                  <td className="py-3 pr-4 font-mono text-xs" style={{ color: "#63A5FF" }}>{row.ref}</td>
                  <td className="py-3 pr-4 font-medium" style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.movie}</td>
                  <td className="py-3 pr-4" style={{ color: "#A3AAB8" }}>{row.customer}</td>
                  <td className="py-3 pr-4" style={{ color: "#A3AAB8" }}>{row.cinema}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: "#737C8D" }}>{row.time}</td>
                  <td className="py-3 pr-4 font-bold" style={{ color: "#F04452" }}>{row.amount}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: row.status === "completed" ? "rgba(53,201,138,0.15)" : "rgba(99,165,255,0.15)", color: row.status === "completed" ? "#35C98A" : "#63A5FF" }}>
                      {row.status === "completed" ? "Hoàn thành" : "Sắp chiếu"}
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
