import { useState } from "react";
import { User, Ticket, Star, Tag, Settings, Film, Calendar, MapPin, CheckCircle, Clock } from "lucide-react";
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

  // Khởi tạo an toàn các biến dữ liệu
  const memberTier = (user.memberTier as keyof typeof TIER_COLORS) || "Silver";
  const points = user.points ?? 0;
  const totalBookingsCount = user.totalBookings ?? 0;
  const joinDate = user.joinDate || "2026";
  const avatarUrl = user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
  const userName = user.name || "Khách hàng";
  const userEmail = user.email || "";
  const userPhone = user.phone || "Chưa cập nhật";

  const tierColor = TIER_COLORS[memberTier] || "#A3AAB8";
  const nextTier = memberTier === "Silver" ? "Gold" : memberTier === "Gold" ? "Platinum" : null;
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : TIER_THRESHOLDS.Platinum;
  const tierProgress = Math.min(100, (points / nextThreshold) * 100);

  const userBookings = bookings.filter((b) => b.userId === user.id);
  const filteredBookings = filter === "all" ? userBookings : userBookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8 p-6 rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
        <div className="relative">
          <img src={avatarUrl} alt={userName} className="w-20 h-20 rounded-2xl object-cover" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: tierColor }}>
            <Star size={12} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{userName}</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{userEmail} {userPhone ? `· ${userPhone}` : ""}</p>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}>
              <Star size={13} /> {memberTier}
            </span>
            <span className="text-sm" style={{ color: "#A3AAB8" }}>{points.toLocaleString('vi-VN')} điểm</span>
            <span className="text-sm" style={{ color: "#A3AAB8" }}>· Thành viên từ {joinDate}</span>
            <span className="text-sm" style={{ color: "#A3AAB8" }}>· {totalBookingsCount} lần đặt vé</span>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
          <Settings size={15} className="inline mr-1.5" /> Chỉnh sửa
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
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
              { label: "Họ và tên", value: userName },
              { label: "Email", value: userEmail },
              { label: "Số điện thoại", value: userPhone },
              { label: "Ngày tham gia", value: joinDate },
              { label: "Hạng thành viên", value: memberTier },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b text-sm" style={{ borderColor: "#292F3D" }}>
                <span style={{ color: "#737C8D" }}>{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold border mt-4 cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>Chỉnh sửa thông tin</button>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold border cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>Đổi mật khẩu</button>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-lg">Thống kê</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Vé đã đặt", value: totalBookingsCount, color: "#F04452" },
                { label: "Điểm thưởng", value: points.toLocaleString('vi-VN'), color: "#F5B942" },
                { label: "Hạng thành viên", value: memberTier, color: tierColor },
                { label: "Năm thành viên", value: "2026", color: "#63A5FF" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-4 rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                  <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{label}</p>
                </div>
              ))}
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
                className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
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
                  <p className="text-2xl font-bold" style={{ color: tierColor }}>{memberTier}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#737C8D" }}>Điểm hiện tại</span>
                  <span className="font-bold" style={{ color: tierColor }}>{points.toLocaleString('vi-VN')}</span>
                </div>
                {nextTier && (
                  <>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${tierProgress}%`, backgroundColor: tierColor }} />
                    </div>
                    <p className="text-xs" style={{ color: "#737C8D" }}>Cần thêm {(nextThreshold - points).toLocaleString('vi-VN')} điểm để lên hạng {nextTier}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}