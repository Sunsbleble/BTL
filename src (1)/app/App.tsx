import { AppProvider, useApp } from "./context/AppContext";
import CustomerLayout from "./components/layout/CustomerLayout";
import StaffLayout from "./components/layout/StaffLayout";
import AdminLayout from "./components/layout/AdminLayout";

import HomePage from "./pages/customer/HomePage";
import MovieDetailPage from "./pages/customer/MovieDetailPage";
import SeatSelectionPage from "./pages/customer/SeatSelectionPage";
import FoodPage from "./pages/customer/FoodPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import BookingSuccessPage from "./pages/customer/BookingSuccessPage";
import AuthPage from "./pages/customer/AuthPage";
import ProfilePage from "./pages/customer/ProfilePage";

import StaffDashboard from "./pages/staff/StaffDashboard";
import TicketValidation from "./pages/staff/TicketValidation";
import POSPage from "./pages/staff/POSPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import MovieManagement from "./pages/admin/MovieManagement";
import UserManagement from "./pages/admin/UserManagement";
import PromotionManagement from "./pages/admin/PromotionManagement";
import Reports from "./pages/admin/Reports";

import { movies, promotions } from "./data/mockData";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, ChevronRight, Star, Tag, Film, Monitor } from "lucide-react";
import { formatDuration, formatVND, RATING_COLORS, cinemas, showtimes } from "./data/mockData";
import { useApp as useAppInner } from "./context/AppContext";

// ─── Simple pages ─────────────────────────────────────────────────────────────

function MoviesPage() {
  const { navigate, setBookingMovie } = useAppInner();
  const now = movies.filter((m) => m.status === "now_showing");
  const soon = movies.filter((m) => m.status === "coming_soon");

  const handleBook = (movieId: string) => {
    const m = movies.find((mv) => mv.id === movieId)!;
    setBookingMovie({ movieId, movieTitle: m.title, moviePoster: m.poster });
    navigate(`movie-${movieId}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Tất cả phim</h1>
      <p className="text-sm mb-8" style={{ color: "#737C8D" }}>Khám phá các bộ phim đang chiếu và sắp chiếu tại CINEVERSE</p>

      <section className="mb-10">
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ backgroundColor: "#F04452" }} /> Phim đang chiếu
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {now.map((m) => (
            <motion.div key={m.id} whileHover={{ y: -4 }} className="group rounded-2xl overflow-hidden cursor-pointer border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }} onClick={() => navigate(`movie-${m.id}`)}>
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={m.poster} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: "#191F2B" }} />
                <div className="absolute top-2 left-2"><span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${RATING_COLORS[m.ageRating]}20`, color: RATING_COLORS[m.ageRating] }}>{m.ageRating}</span></div>
                {m.rating > 0 && <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}><Star size={10} style={{ color: "#F5B942" }} fill="#F5B942" />{m.rating}</div>}
                <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleBook(m.id); }} className="w-full py-2 rounded-xl text-xs font-bold" style={{ backgroundColor: "#F04452", color: "#fff" }}>Đặt vé ngay</button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-2 leading-tight">{m.title}</p>
                <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{formatDuration(m.duration)} · {m.genre[0]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ backgroundColor: "#63A5FF" }} /> Phim sắp chiếu
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {soon.map((m) => (
            <div key={m.id} className="group rounded-2xl overflow-hidden cursor-pointer border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }} onClick={() => navigate(`movie-${m.id}`)}>
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={m.poster} alt={m.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-500" style={{ backgroundColor: "#191F2B" }} />
                <div className="absolute inset-0 flex items-center justify-center"><span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>Sắp chiếu</span></div>
                <div className="absolute top-2 left-2"><span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${RATING_COLORS[m.ageRating]}20`, color: RATING_COLORS[m.ageRating] }}>{m.ageRating}</span></div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-2 leading-tight">{m.title}</p>
                <p className="text-xs mt-1" style={{ color: "#63A5FF" }}>{m.releaseDate}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ShowtimesPage() {
  const { navigate, setBookingMovie } = useAppInner();
  const today = new Date().toISOString().slice(0, 10);
  const todayShowtimes = showtimes.filter((s) => s.date >= today).slice(0, 12);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Lịch chiếu</h1>
      <p className="text-sm mb-8" style={{ color: "#737C8D" }}>Tất cả suất chiếu sắp tới tại hệ thống CINEVERSE</p>
      <div className="space-y-4">
        {todayShowtimes.map((st) => {
          const m = movies.find((mv) => mv.id === st.movieId)!;
          const c = cinemas.find((ci) => ci.id === st.cinemaId)!;
          const aud = c.auditoriums.find((a) => a.id === st.auditoriumId)!;
          const pct = Math.round((1 - st.availableSeats / st.totalSeats) * 100);
          return (
            <div key={st.id} className="flex gap-4 p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
              <img src={m.poster} alt="" className="w-14 h-20 rounded-xl object-cover shrink-0" style={{ backgroundColor: "#191F2B" }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold">{m.title}</p>
                <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: "#A3AAB8" }}><MapPin size={12} />{c.name}</p>
                <p className="text-sm mt-0.5 flex items-center gap-1.5" style={{ color: "#737C8D" }}><Monitor size={12} />{aud.name} · {st.format}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "#737C8D" }}>
                  <span className="flex items-center gap-1"><Clock size={10} />{st.startTime} – {st.endTime}</span>
                  <span>{st.date}</span>
                  <span className="flex items-center gap-1" style={{ color: st.availableSeats < 30 ? "#F04452" : "#35C98A" }}>
                    {st.availableSeats} ghế trống
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <span className="text-sm font-bold" style={{ color: "#F04452" }}>{(st.price / 1000).toFixed(0)}K₫</span>
                <button
                  onClick={() => {
                    setBookingMovie({ movieId: m.id, movieTitle: m.title, moviePoster: m.poster, cinemaId: c.id, cinemaName: c.name, showtime: st, auditoriumName: aud.name });
                    navigate("seats");
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#F04452", color: "#fff" }}
                >
                  Đặt vé
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CinemasPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Hệ thống rạp CINEVERSE</h1>
      <p className="text-sm mb-8" style={{ color: "#737C8D" }}>4 rạp chiếu phim hiện đại tại Việt Nam</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cinemas.map((c) => (
          <div key={c.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="relative h-40 overflow-hidden">
              <img src={`https://images.unsplash.com/photo-${["1517604931442-7e0c8ed2963c", "1524985069026-dd778a71c7b4", "1573509615592-c14ef3e53041", "1592771938428-e96b1dbaf5c5"][cinemas.indexOf(c)]}?w=600&h=200&fit=crop&auto=format`} alt={c.name} className="w-full h-full object-cover" style={{ backgroundColor: "#191F2B" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="font-bold text-lg">{c.name}</p>
                <p className="text-xs" style={{ color: "#A3AAB8" }}>{c.city}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm mb-3 flex items-start gap-2" style={{ color: "#737C8D" }}><MapPin size={14} className="mt-0.5 shrink-0" />{c.address}</p>
              <p className="text-sm" style={{ color: "#A3AAB8" }}>📞 {c.phone}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.auditoriums.map((a) => (
                  <span key={a.id} className="px-3 py-1.5 rounded-xl text-xs" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#A3AAB8" }}>
                    {a.name} ({a.capacity} ghế)
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromotionsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Ưu đãi & Khuyến mãi</h1>
      <p className="text-sm mb-8" style={{ color: "#737C8D" }}>Ưu đãi độc quyền dành cho thành viên CINEVERSE</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.filter((p) => p.status !== "expired").map((promo) => (
          <div key={promo.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="relative h-44 overflow-hidden">
              <img src={promo.banner} alt={promo.title} className="w-full h-full object-cover" style={{ backgroundColor: "#191F2B" }} />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                {promo.discountType === "percent" ? `-${promo.discountValue}%` : `-${(promo.discountValue / 1000).toFixed(0)}K₫`}
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: promo.status === "active" ? "rgba(53,201,138,0.9)" : "rgba(99,165,255,0.9)", color: "#fff" }}>
                {promo.status === "active" ? "Đang chạy" : "Sắp ra mắt"}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-base mb-2">{promo.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#737C8D" }}>{promo.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs" style={{ color: "#737C8D" }}>Mã voucher</p>
                  <code className="text-sm font-mono font-bold mt-0.5 block px-2.5 py-1 rounded" style={{ backgroundColor: "rgba(240,68,82,0.1)", color: "#F04452", border: "1px dashed rgba(240,68,82,0.4)" }}>{promo.code}</code>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#737C8D" }}>Hết hạn</p>
                  <p className="text-sm font-semibold">{promo.endDate}</p>
                </div>
              </div>
              <div className="text-xs p-2.5 rounded-xl" style={{ backgroundColor: "#191F2B", color: "#737C8D" }}>
                Chi tiêu tối thiểu: {formatVND(promo.minSpend)} · Còn lại: {(promo.usageLimit - promo.usedCount).toLocaleString()} lượt
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Router ───────────────────────────────────────────────────────────────

function Router() {
  const { currentView, isLoggedIn, user } = useApp();

  // Staff portal routes
  const STAFF_VIEWS = ["staff-dashboard", "staff-validate", "staff-pos", "staff-transactions"];
  if (STAFF_VIEWS.includes(currentView)) {
    if (!isLoggedIn) return (
      <CustomerLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p style={{ color: "#737C8D" }}>Vui lòng đăng nhập với tài khoản nhân viên.</p>
        </div>
      </CustomerLayout>
    );
    return (
      <StaffLayout activeView={currentView}>
        {currentView === "staff-dashboard" && <StaffDashboard />}
        {currentView === "staff-validate" && <TicketValidation />}
        {currentView === "staff-pos" && <POSPage />}
      </StaffLayout>
    );
  }

  // Admin portal routes
  const ADMIN_VIEWS = ["admin-dashboard", "admin-movies", "admin-showtimes", "admin-cinemas", "admin-users", "admin-promotions", "admin-reports", "admin-notifications", "admin-settings"];
  if (ADMIN_VIEWS.includes(currentView)) {
    if (!isLoggedIn || (user?.role !== "admin" && user?.role !== "manager")) {
      return (
        <CustomerLayout>
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <p style={{ color: "#737C8D" }}>Bạn không có quyền truy cập vào trang này.</p>
          </div>
        </CustomerLayout>
      );
    }
    return (
      <AdminLayout activeView={currentView}>
        {currentView === "admin-dashboard" && <AdminDashboard />}
        {currentView === "admin-movies" && <MovieManagement />}
        {currentView === "admin-users" && <UserManagement />}
        {currentView === "admin-promotions" && <PromotionManagement />}
        {currentView === "admin-reports" && <Reports />}
        {["admin-showtimes", "admin-cinemas", "admin-notifications", "admin-settings"].includes(currentView) && (
          <div className="p-8 text-center" style={{ color: "#737C8D" }}>Tính năng đang phát triển...</div>
        )}
      </AdminLayout>
    );
  }

  // Customer routes — all wrapped in CustomerLayout
  const getContent = () => {
    if (currentView.startsWith("movie-")) {
      const movieId = currentView.replace("movie-", "");
      return <MovieDetailPage movieId={movieId} />;
    }

    switch (currentView) {
      case "home": return <HomePage />;
      case "movies": return <MoviesPage />;
      case "showtimes": return <ShowtimesPage />;
      case "cinemas": return <CinemasPage />;
      case "promotions": return <PromotionsPage />;
      case "seats": return <SeatSelectionPage />;
      case "food": return <FoodPage />;
      case "checkout": return <CheckoutPage />;
      case "booking-success": return <BookingSuccessPage />;
      case "login": return <AuthPage defaultTab="login" />;
      case "register": return <AuthPage defaultTab="register" />;
      case "profile": return <ProfilePage activeTab="overview" />;
      case "bookings": return <ProfilePage activeTab="bookings" />;
      case "my-promotions": return <ProfilePage activeTab="vouchers" />;
      default: return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Film size={48} style={{ color: "#292F3D" }} />
          <p className="text-xl font-bold">404 – Trang không tồn tại</p>
          <p style={{ color: "#737C8D" }}>Đường dẫn "{currentView}" không được tìm thấy.</p>
        </div>
      );
    }
  };

  return (
    <CustomerLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {getContent()}
        </motion.div>
      </AnimatePresence>
    </CustomerLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
