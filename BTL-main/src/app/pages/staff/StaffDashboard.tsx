import { useState, useEffect } from "react";
import { ScanLine, CheckCircle, XCircle, DollarSign, Clock, ShoppingCart, Ticket } from "lucide-react";
import { useApp } from "../../context/AppContext";

const formatVND = (amount: number) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M₫`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K₫`;
  return `${amount}₫`;
};

export default function StaffDashboard() {
  const { navigate } = useApp();

  const [stats, setStats] = useState<{
    kpis: {
      totalScannedToday: number;
      validCount: number;
      usedCount: number;
      posRevenueToday: number;
    };
    sessions: any[];
    recentScans: any[];
  }>({
    kpis: { totalScannedToday: 0, validCount: 0, usedCount: 0, posRevenueToday: 0 },
    sessions: [],
    recentScans: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/staff/dashboard-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.kpis) {
          setStats(data);
        }
      })
      .catch((err) => console.error("Lỗi nạp thống kê Staff Dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const { kpis, sessions, recentScans } = stats;

  return (
    <div className="space-y-6 text-white">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: ScanLine,
            label: "Tổng số vé hệ thống",
            value: loading ? "..." : String(kpis.totalScannedToday),
            change: "Cập nhật realtime",
            color: "#63A5FF",
          },
          {
            icon: CheckCircle,
            label: "Vé hợp lệ (Chưa dùng)",
            value: loading ? "..." : String(kpis.validCount),
            change: "Sẵn sàng soát vé",
            color: "#35C98A",
          },
          {
            icon: Ticket,
            label: "Vé đã sử dụng",
            value: loading ? "..." : String(kpis.usedCount),
            change: "Đã qua cửa soát",
            color: "#F5B942",
          },
          {
            icon: DollarSign,
            label: "Doanh thu POS hôm nay",
            value: loading ? "..." : formatVND(kpis.posRevenueToday),
            change: "Thanh toán quầy",
            color: "#F04452",
          },
        ].map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className="p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-bold mb-1" style={{ color }}>{value}</p>
            <p className="text-xs" style={{ color: "#737C8D" }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#A3AAB8" }}>{change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("staff-validate")}
          className="p-6 rounded-2xl flex flex-col items-center gap-3 text-center transition-all hover:scale-[1.02] cursor-pointer"
          style={{ background: "linear-gradient(135deg, rgba(99,165,255,0.15) 0%, rgba(99,165,255,0.05) 100%)", border: "1px solid rgba(99,165,255,0.3)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(99,165,255,0.15)" }}>
            <ScanLine size={28} style={{ color: "#63A5FF" }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: "#63A5FF" }}>Soát vé</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>Quét mã QR hoặc nhập mã vé thủ công</p>
          </div>
        </button>

        <button
          onClick={() => navigate("staff-pos")}
          className="p-6 rounded-2xl flex flex-col items-center gap-3 text-center transition-all hover:scale-[1.02] cursor-pointer"
          style={{ background: "linear-gradient(135deg, rgba(240,68,82,0.15) 0%, rgba(240,68,82,0.05) 100%)", border: "1px solid rgba(240,68,82,0.3)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(240,68,82,0.15)" }}>
            <ShoppingCart size={28} style={{ color: "#F04452" }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: "#F04452" }}>Bán vé POS</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>Bán vé và bắp nước trực tiếp tại quầy</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Sessions */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: "#292F3D" }}>
            <Clock size={16} style={{ color: "#F04452" }} />
            <h3 className="font-bold text-sm">Suất chiếu trong CSDL</h3>
          </div>
          <div className="p-4 space-y-3">
            {sessions.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Chưa có suất chiếu nào</p>
            ) : (
              sessions.map((session, i) => {
                const soldCount = Number(session.sold) || 0;
                const totalCap = Number(session.total) || 1;
                const pct = Math.min(100, Math.round((soldCount / totalCap) * 100));

                return (
                  <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: "#191F2B" }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold">{session.movie}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{session.time} · {session.room}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0" style={{ backgroundColor: session.status === "now" ? "rgba(53,201,138,0.15)" : "rgba(99,165,255,0.15)", color: session.status === "now" ? "#35C98A" : "#63A5FF" }}>
                        {session.status === "now" ? "Đang chiếu" : "Sắp chiếu"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? "#F04452" : "#35C98A" }} />
                      </div>
                      <span className="text-xs" style={{ color: "#737C8D" }}>{soldCount}/{totalCap}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: "#292F3D" }}>
            <ScanLine size={16} style={{ color: "#F04452" }} />
            <h3 className="font-bold text-sm">Lịch sử vé gần đây</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#292F3D" }}>
            {recentScans.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">Chưa có vé nào được sinh ra</p>
            ) : (
              recentScans.map((scan) => (
                <div key={scan.ticket_id || scan.ref} className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: scan.status === "valid" ? "rgba(53,201,138,0.15)" : scan.status === "used" ? "rgba(245,185,66,0.15)" : "rgba(240,68,82,0.15)" }}>
                    {scan.status === "valid" ? <CheckCircle size={16} style={{ color: "#35C98A" }} /> : scan.status === "used" ? <Clock size={16} style={{ color: "#F5B942" }} /> : <XCircle size={16} style={{ color: "#F04452" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold font-mono">{scan.ref}</p>
                    <p className="text-xs truncate" style={{ color: "#737C8D" }}>{scan.movie} · Ghế {scan.seats}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "#A3AAB8" }}>{scan.time}</p>
                    <p className="text-xs font-semibold" style={{ color: scan.status === "valid" ? "#35C98A" : scan.status === "used" ? "#F5B942" : "#F04452" }}>
                      {scan.status === "valid" ? "Chưa dùng" : scan.status === "used" ? "Đã dùng" : "Không hợp lệ"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}