import { Ticket, ScanLine, TrendingUp, Users, DollarSign, CheckCircle, XCircle, Clock, ShoppingCart } from "lucide-react";
import { useApp } from "../../context/AppContext";

const RECENT_SCANS = [
  { ref: "BK240001", movie: "Đặc Vụ Không Gian", time: "19:15", seats: "F5, F6", status: "valid" },
  { ref: "BK230089", movie: "Người Khổng Lồ Xanh", time: "19:12", seats: "C8, C9", status: "valid" },
  { ref: "BK229041", movie: "Đặc Vụ Không Gian", time: "18:58", seats: "A3", status: "invalid" },
  { ref: "BK228773", movie: "Cô Dâu Bóng Tối", time: "18:45", seats: "H2, H3", status: "valid" },
  { ref: "BK227001", movie: "Đặc Vụ Không Gian", time: "18:30", seats: "I3, I4", status: "used" },
];

const CURRENT_SESSIONS = [
  { movie: "Đặc Vụ Không Gian", time: "19:00", room: "Phòng 1 - IMAX", sold: 145, total: 200, status: "now" },
  { movie: "Cô Dâu Bóng Tối", time: "19:15", room: "Phòng 3", sold: 89, total: 160, status: "now" },
  { movie: "Người Khổng Lồ Xanh", time: "21:30", room: "Phòng 1 - IMAX", sold: 60, total: 200, status: "upcoming" },
  { movie: "Bóng Tối Vĩnh Cửu", time: "21:00", room: "Phòng 3", sold: 42, total: 160, status: "upcoming" },
];

export default function StaffDashboard() {
  const { navigate } = useApp();

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: ScanLine, label: "Vé đã quét hôm nay", value: "348", change: "+12 so với hôm qua", color: "#63A5FF" },
          { icon: CheckCircle, label: "Vé hợp lệ", value: "341", change: "98.0% tỷ lệ hợp lệ", color: "#35C98A" },
          { icon: XCircle, label: "Vé không hợp lệ", value: "7", change: "2.0% tỷ lệ lỗi", color: "#F04452" },
          { icon: DollarSign, label: "Doanh thu POS", value: "8.4M₫", change: "Hôm nay", color: "#F5B942" },
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate("staff-validate")}
          className="p-6 rounded-2xl flex flex-col items-center gap-3 text-center transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, rgba(99,165,255,0.15) 0%, rgba(99,165,255,0.05) 100%)", border: "1px solid rgba(99,165,255,0.3)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(99,165,255,0.15)" }}>
            <ScanLine size={28} style={{ color: "#63A5FF" }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: "#63A5FF" }}>Soát vé</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>Quét QR hoặc nhập mã thủ công</p>
          </div>
        </button>
        <button
          onClick={() => navigate("staff-pos")}
          className="p-6 rounded-2xl flex flex-col items-center gap-3 text-center transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, rgba(240,68,82,0.15) 0%, rgba(240,68,82,0.05) 100%)", border: "1px solid rgba(240,68,82,0.3)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(240,68,82,0.15)" }}>
            <ShoppingCart size={28} style={{ color: "#F04452" }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: "#F04452" }}>Bán vé POS</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>Bán vé trực tiếp tại quầy</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Sessions */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: "#292F3D" }}>
            <Clock size={16} style={{ color: "#F04452" }} />
            <h3 className="font-bold text-sm">Suất chiếu hôm nay</h3>
          </div>
          <div className="p-4 space-y-3">
            {CURRENT_SESSIONS.map((session, i) => {
              const pct = Math.round((session.sold / session.total) * 100);
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
                    <span className="text-xs" style={{ color: "#737C8D" }}>{session.sold}/{session.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: "#292F3D" }}>
            <ScanLine size={16} style={{ color: "#F04452" }} />
            <h3 className="font-bold text-sm">Lịch sử soát vé gần đây</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#292F3D" }}>
            {RECENT_SCANS.map((scan) => (
              <div key={scan.ref} className="p-4 flex items-center gap-3">
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
                    {scan.status === "valid" ? "Hợp lệ" : scan.status === "used" ? "Đã dùng" : "Không hợp lệ"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
