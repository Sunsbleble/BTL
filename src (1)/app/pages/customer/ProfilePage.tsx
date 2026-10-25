import { useState } from "react";
import { User, Ticket, Star, Tag, Bell, Settings, ChevronRight, Film, Calendar, MapPin, CheckCircle, Clock } from "lucide-react";
import { bookings, movies, cinemas, showtimes, formatVND } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

const TABS = [
  { id: "overview", label: "Tổng quan", icon: User },
  { id: "bookings", label: "Lịch sử đặt vé", icon: Ticket },
  { id: "membership", label: "Thành viên", icon: Star },
  { id: "vouchers", label: "Ưu đãi", icon: Tag },
];

const TIER_COLORS = { Silver: "#A3AAB8", Gold: "#F5B942", Platinum: "#63A5FF" };
const TIER_THRESHOLDS = { Silver: 1000, Gold: 5000, Platinum: 10000 };

export default function ProfilePage({ activeTab }: { activeTab?: string }) {
  const { user, navigate } = useApp();
  const [tab, setTab] = useState(activeTab ?? "overview");
  const [filter, setFilter] = useState("all");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <p style={{ color: "#737C8D" }}>Vui lòng đăng nhập để xem trang này.</p>
        <button onClick={() => navigate("login")} className="px-4 py-2 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff" }}>Đăng nhập</button>
      </div>
    );
  }

  const tierColor = TIER_COLORS[user.memberTier];
  const nextTier = user.memberTier === "Silver" ? "Gold" : user.memberTier === "Gold" ? "Platinum" : null;
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : TIER_THRESHOLDS.Platinum;
  const tierProgress = Math.min(100, (user.points / nextThreshold) * 100);

  const userBookings = bookings.filter((b) => b.userId === user.id);
  const filteredBookings = filter === "all" ? userBookings : userBookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8 p-6 rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: tierColor }}>
            <Star size={12} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{user.email} · {user.phone}</p>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}>
              <Star size={13} /> {user.memberTier}
            </span>
            <span className="text-sm" style={{ color: "#A3AAB8" }}>{user.points.toLocaleString()} điểm</span>
            <span className="text-sm" style={{ color: "#A3AAB8" }}>· Thành viên từ {user.joinDate}</span>
            <span className="text-sm" style={{ color: "#A3AAB8" }}>· {user.totalBookings} lần đặt vé</span>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
          <Settings size={15} className="inline mr-1.5" /> Chỉnh sửa
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: tab === id ? "#F04452" : "#191F2B", color: tab === id ? "#fff" : "#A3AAB8", border: `1px solid ${tab === id ? "#F04452" : "#292F3D"}` }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Thông tin cá nhân</h2>
            {[
              { label: "Họ và tên", value: user.name },
              { label: "Email", value: user.email },
              { label: "Số điện thoại", value: user.phone },
              { label: "Ngày tham gia", value: user.joinDate },
              { label: "Hạng thành viên", value: user.memberTier },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b text-sm" style={{ borderColor: "#292F3D" }}>
                <span style={{ color: "#737C8D" }}>{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold border mt-4" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>Chỉnh sửa thông tin</button>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>Đổi mật khẩu</button>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-lg">Thống kê</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Vé đã đặt", value: user.totalBookings, color: "#F04452" },
                { label: "Điểm thưởng", value: user.points.toLocaleString(), color: "#F5B942" },
                { label: "Hạng thành viên", value: user.memberTier, color: tierColor },
                { label: "Năm thành viên", value: "2023", color: "#63A5FF" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-4 rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                  <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{label}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Đặt vé gần đây</h3>
              {userBookings.slice(0, 2).map((b) => {
                const m = movies.find((mv) => mv.id === b.movieId);
                return (
                  <div key={b.id} onClick={() => setTab("bookings")} className="flex items-center gap-3 py-3 border-b cursor-pointer hover:opacity-80" style={{ borderColor: "#292F3D" }}>
                    <img src={m?.poster} alt="" className="w-10 h-14 rounded-lg object-cover shrink-0" style={{ backgroundColor: "#191F2B" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{m?.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{b.bookingDate}</p>
                      <p className="text-xs mt-0.5 font-semibold" style={{ color: "#F04452" }}>{formatVND(b.total)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs`} style={{ backgroundColor: b.status === "completed" ? "rgba(53,201,138,0.15)" : b.status === "upcoming" ? "rgba(99,165,255,0.15)" : "rgba(240,68,82,0.15)", color: b.status === "completed" ? "#35C98A" : b.status === "upcoming" ? "#63A5FF" : "#F04452" }}>
                      {b.status === "completed" ? "Đã xem" : b.status === "upcoming" ? "Sắp chiếu" : "Đã huỷ"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div>
          <div className="flex gap-2 mb-6">
            {[["all", "Tất cả"], ["upcoming", "Sắp chiếu"], ["completed", "Đã xem"], ["cancelled", "Đã huỷ"]].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: filter === value ? "#F04452" : "#191F2B", color: filter === value ? "#fff" : "#A3AAB8", border: `1px solid ${filter === value ? "#F04452" : "#292F3D"}` }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="py-16 text-center">
                <Ticket size={40} className="mx-auto mb-3" style={{ color: "#292F3D" }} />
                <p style={{ color: "#737C8D" }}>Không có vé nào trong danh mục này</p>
              </div>
            ) : filteredBookings.map((b) => {
              const m = movies.find((mv) => mv.id === b.movieId);
              const c = cinemas.find((ci) => ci.id === b.cinemaId);
              const st = showtimes.find((s) => s.id === b.showtimeId);
              return (
                <div key={b.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
                  <div className="flex gap-4 p-5">
                    <img src={m?.poster} alt="" className="w-16 h-22 rounded-xl object-cover shrink-0" style={{ backgroundColor: "#191F2B", aspectRatio: "2/3" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base leading-tight">{m?.title}</h3>
                        <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: b.status === "completed" ? "rgba(53,201,138,0.15)" : b.status === "upcoming" ? "rgba(99,165,255,0.15)" : "rgba(240,68,82,0.15)", color: b.status === "completed" ? "#35C98A" : b.status === "upcoming" ? "#63A5FF" : "#F04452" }}>
                          {b.status === "completed" ? "Đã xem" : b.status === "upcoming" ? "Sắp chiếu" : "Đã huỷ"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm" style={{ color: "#A3AAB8" }}>
                        <p className="flex items-center gap-1.5"><MapPin size={12} />{c?.name}</p>
                        <p className="flex items-center gap-1.5"><Calendar size={12} />{st?.date} · {st?.startTime}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {b.seats.map((s) => <span key={s} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>{s}</span>)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-bold" style={{ color: "#F04452" }}>{formatVND(b.total)}</p>
                        <p className="text-xs" style={{ color: "#737C8D" }}>#{b.id}</p>
                      </div>
                    </div>
                  </div>
                  {b.status === "upcoming" && (
                    <div className="flex border-t" style={{ borderColor: "#292F3D" }}>
                      <button className="flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2" style={{ color: "#F04452" }}>
                        <Film size={15} /> Xem mã QR
                      </button>
                      <div className="w-px" style={{ backgroundColor: "#292F3D" }} />
                      <button className="flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2" style={{ color: "#737C8D" }}>
                        <Clock size={15} /> Đặt lại
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Membership Tab */}
      {tab === "membership" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="p-6 rounded-2xl mb-4" style={{ background: `linear-gradient(135deg, ${tierColor}20 0%, #121620 100%)`, border: `1px solid ${tierColor}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${tierColor}25` }}>
                  <Star size={24} style={{ color: tierColor }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#737C8D" }}>Hạng thành viên</p>
                  <p className="text-2xl font-bold" style={{ color: tierColor }}>{user.memberTier}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#737C8D" }}>Điểm hiện tại</span>
                  <span className="font-bold" style={{ color: tierColor }}>{user.points.toLocaleString()}</span>
                </div>
                {nextTier && (
                  <>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${tierProgress}%`, backgroundColor: tierColor }} />
                    </div>
                    <p className="text-xs" style={{ color: "#737C8D" }}>Cần thêm {(nextThreshold - user.points).toLocaleString()} điểm để lên hạng {nextTier}</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-base">Quyền lợi của bạn</h3>
              {[
                "Tích điểm x1.5 mỗi lần đặt vé",
                "Ưu tiên chọn ghế trước 1 giờ",
                "Sinh nhật tặng 1 vé miễn phí",
                "Giảm 10% đồ ăn tại quầy",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm" style={{ color: "#A3AAB8" }}>
                  <CheckCircle size={15} style={{ color: "#35C98A" }} />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4">Lịch sử điểm thưởng</h3>
            {[
              { date: "22/10/2026", desc: "Đặt vé - Đặc Vụ Không Gian", pts: +500, type: "earn" },
              { date: "10/10/2026", desc: "Đặt vé - Người Khổng Lồ Xanh", pts: +350, type: "earn" },
              { date: "28/09/2026", desc: "Đổi điểm lấy ưu đãi", pts: -200, type: "redeem" },
              { date: "28/09/2026", desc: "Đặt vé - Hương Vị Quê Nhà", pts: +270, type: "earn" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b text-sm" style={{ borderColor: "#292F3D" }}>
                <div>
                  <p className="font-medium">{item.desc}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{item.date}</p>
                </div>
                <span className="font-bold" style={{ color: item.type === "earn" ? "#35C98A" : "#F04452" }}>
                  {item.pts > 0 ? "+" : ""}{item.pts} điểm
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vouchers Tab */}
      {tab === "vouchers" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Ưu đãi của tôi</h2>
            <button onClick={() => navigate("promotions")} className="text-sm font-medium" style={{ color: "#F04452" }}>Xem tất cả ưu đãi →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { code: "TUESDAY30", title: "Thứ Ba Vui Vẻ", desc: "Giảm 30% tất cả suất chiếu thứ Ba", expiry: "31/12/2026", color: "#F04452" },
              { code: "BDAY5", title: "Sinh Nhật CINEVERSE", desc: "Giảm 50.000₫ cho đơn từ 200.000₫", expiry: "31/10/2026", color: "#63A5FF" },
            ].map((v) => (
              <div key={v.code} className="p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{v.title}</p>
                    <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{v.desc}</p>
                  </div>
                  <Tag size={18} style={{ color: v.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <code className="px-2 py-1 rounded text-xs font-mono font-bold" style={{ backgroundColor: `${v.color}15`, color: v.color, border: `1px dashed ${v.color}` }}>{v.code}</code>
                  <span className="text-xs" style={{ color: "#737C8D" }}>HSD: {v.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
