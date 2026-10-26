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
import MoviesPage from "./pages/customer/MoviesPage";
import ShowtimesPage from "./pages/customer/ShowtimesPage";

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
import { Clock, MapPin, Film, Monitor } from "lucide-react";
import { formatVND, cinemas, showtimes } from "./data/mockData";
import { useApp as useAppInner } from "./context/AppContext";

// ─── Simple pages ─────────────────────────────────────────────────────────────

function CinemasPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-2">Hệ thống rạp CINEVERSE</h1>
      <p className="text-sm mb-8 text-gray-400">4 rạp chiếu phim hiện đại tại Việt Nam</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cinemas.map((c, index) => (
          <div key={c.id} className="rounded-2xl border overflow-hidden bg-[#121620] border-[#292F3D]">
            <div className="relative h-40 overflow-hidden">
              <img src={`https://images.unsplash.com/photo-${["1517604931442-7e0c8ed2963c", "1524985069026-dd778a71c7b4", "1573509615592-c14ef3e53041", "1592771938428-e96b1dbaf5c5"][index]}?w=600&h=200&fit=crop&auto=format`} alt={c.name} className="w-full h-full object-cover bg-[#191F2B]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="font-bold text-lg">{c.name}</p>
                <p className="text-xs text-gray-300">{c.city}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm mb-3 flex items-start gap-2 text-gray-400"><MapPin size={14} className="mt-0.5 shrink-0" />{c.address}</p>
              <p className="text-sm text-gray-300">📞 {c.phone}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.auditoriums.map((a) => (
                  <span key={a.id} className="px-3 py-1.5 rounded-xl text-xs bg-[#191F2B] border border-[#292F3D] text-gray-300">
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
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-2">Ưu đãi & Khuyến mãi</h1>
      <p className="text-sm mb-8 text-gray-400">Ưu đãi độc quyền dành cho thành viên CINEVERSE</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.filter((p) => p.status !== "expired").map((promo) => (
          <div key={promo.id} className="rounded-2xl border overflow-hidden bg-[#121620] border-[#292F3D]">
            <div className="relative h-44 overflow-hidden">
              <img src={promo.banner} alt={promo.title} className="w-full h-full object-cover bg-[#191F2B]" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold bg-[#F04452] text-white">
                {promo.discountType === "percent" ? `-${promo.discountValue}%` : `-${(promo.discountValue / 1000).toFixed(0)}K₫`}
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: promo.status === "active" ? "rgba(53,201,138,0.9)" : "rgba(99,165,255,0.9)", color: "#fff" }}>
                {promo.status === "active" ? "Đang chạy" : "Sắp ra mắt"}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-base mb-2">{promo.title}</h3>
              <p className="text-sm leading-relaxed mb-4 text-gray-400">{promo.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400">Mã voucher</p>
                  <code className="text-sm font-mono font-bold mt-0.5 block px-2.5 py-1 rounded bg-[#F04452]/10 text-[#F04452] border border-dashed border-[#F04452]/40">{promo.code}</code>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Hết hạn</p>
                  <p className="text-sm font-semibold">{promo.endDate}</p>
                </div>
              </div>
              <div className="text-xs p-2.5 rounded-xl bg-[#191F2B] text-gray-400">
                Chi tiêu tối thiểu: {formatVND(promo.minSpend)} · Còn lại: {(promo.usageLimit - promo.usedCount).toLocaleString('vi-VN')} lượt
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
    // Tạm thời mở quyền truy cập để phát triển & test giao diện Staff
    const isStaff = isLoggedIn && (
      String(user?.role).toLowerCase() === "staff" || 
      String(user?.role).toLowerCase() === "admin" ||
      String(user?.role).toLowerCase() === "manager"
    );


    return (
      <StaffLayout activeView={currentView}>
        {currentView === "staff-dashboard" && <StaffDashboard />}
        {currentView === "staff-validate" && <TicketValidation />}
        {currentView === "staff-pos" && <POSPage />}
        {currentView === "staff-transactions" && (
          <div className="p-8 text-center text-gray-400">Lịch sử giao dịch Staff đang phát triển...</div>
        )}
      </StaffLayout>
    );
  }
// Admin portal routes
const ADMIN_VIEWS = ["admin-dashboard", "admin-movies", "admin-showtimes", "admin-cinemas", "admin-users", "admin-promotions", "admin-reports", "admin-notifications", "admin-settings"];

if (ADMIN_VIEWS.includes(currentView)) {
  // Bọc kiểm tra linh hoạt chữ hoa/thường hoặc bỏ qua khi dev
  const isAdmin = isLoggedIn && (
    String(user?.role).toLowerCase() === "admin" || 
    String(user?.role).toLowerCase() === "manager"
  );

  return (
    <AdminLayout activeView={currentView}>
      {currentView === "admin-dashboard" && <AdminDashboard />}
      {currentView === "admin-movies" && <MovieManagement />}
      {currentView === "admin-users" && <UserManagement />}
      {currentView === "admin-promotions" && <PromotionManagement />}
      {currentView === "admin-reports" && <Reports />}
      {["admin-showtimes", "admin-cinemas", "admin-notifications", "admin-settings"].includes(currentView) && (
        <div className="p-8 text-center text-gray-400">Tính năng đang phát triển...</div>
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
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-white">
          <Film size={48} className="text-gray-600" />
          <p className="text-xl font-bold">404 – Trang không tồn tại</p>
          <p className="text-gray-400">Đường dẫn "{currentView}" không được tìm thấy.</p>
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