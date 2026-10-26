import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Bell, User, ChevronDown, Menu, X, MapPin, Film, Clock, Tag, LogOut, Ticket, Star,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { users } from "../../data/mockData";

interface Props {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: "Trang chủ", view: "home" },
  { label: "Phim", view: "movies" },
  { label: "Lịch chiếu", view: "showtimes" },
  { label: "Rạp chiếu", view: "cinemas" },
  { label: "Khuyến mãi", view: "promotions" },
];

export default function CustomerLayout({ children }: Props) {
  const { isLoggedIn, user, login, logout, navigate, currentView } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleDemoLogin = () => {
    login(users[0]);
    setUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", backgroundColor: "#0B0D12", color: "#F5F5F7" }}>
      {/* ─── Header ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backgroundColor: "rgba(11,13,18,0.95)", backdropFilter: "blur(12px)", borderColor: "#292F3D" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F04452 0%, #cc2233 100%)" }}>
              <Film size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider" style={{ letterSpacing: "0.08em" }}>
              CINEVERSE
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.view}
                onClick={() => navigate(link.view)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
                style={{
                  color: currentView === link.view ? "#F5F5F7" : "#A3AAB8",
                  backgroundColor: currentView === link.view ? "#191F2B" : "transparent",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: "#A3AAB8", backgroundColor: searchOpen ? "#191F2B" : "transparent" }}
            >
              <Search size={18} />
            </button>

            {/* Location */}
            <button
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{ color: "#A3AAB8", border: "1px solid #292F3D" }}
            >
              <MapPin size={13} />
              <span>Hà Nội</span>
              <ChevronDown size={12} />
            </button>

            {/* Notifications */}
            {isLoggedIn && (
              <button className="relative w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "#A3AAB8" }}>
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#F04452" }} />
              </button>
            )}

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ backgroundColor: userMenuOpen ? "#191F2B" : "transparent" }}
                >
                  <img src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="hidden md:block text-sm font-medium">{(user?.name || "Khách").split(" ").pop()}</span>
                  <ChevronDown size={14} style={{ color: "#A3AAB8" }} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border py-2 z-50"
                      style={{ backgroundColor: "#191F2B", borderColor: "#292F3D", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
                    >
                      <div className="px-4 py-2 mb-1">
                        <p className="text-sm font-semibold">{user?.name || "Tài khoản"}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{user?.email || ""}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Star size={12} style={{ color: "#F5B942" }} />
                          <span className="text-xs font-medium" style={{ color: "#F5B942" }}>{user?.memberTier || "Standard"}</span>
                          <span className="text-xs" style={{ color: "#737C8D" }}>
                            {(user?.points ?? 0).toLocaleString('vi-VN')} điểm
                          </span>
                        </div>
                      </div>
                      <div className="h-px mx-4 mb-1" style={{ backgroundColor: "#292F3D" }} />
                      {[
                        { icon: User, label: "Tài khoản của tôi", view: "profile" },
                        { icon: Ticket, label: "Vé đã đặt", view: "bookings" },
                        { icon: Tag, label: "Ưu đãi của tôi", view: "my-promotions" },
                      ].map(({ icon: Icon, label, view }) => (
                        <button
                          key={view}
                          onClick={() => { navigate(view); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-white/5 cursor-pointer"
                          style={{ color: "#A3AAB8" }}
                        >
                          <Icon size={15} />
                          {label}
                        </button>
                      ))}
                      <div className="h-px mx-4 my-1" style={{ backgroundColor: "#292F3D" }} />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-white/5 cursor-pointer"
                        style={{ color: "#F04452" }}
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate("login")}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{ color: "#F5F5F7", border: "1px solid #292F3D" }}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={handleDemoLogin}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  style={{ backgroundColor: "#F04452", color: "#fff" }}
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ color: "#A3AAB8" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t"
              style={{ borderColor: "#292F3D" }}
            >
              <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737C8D" }} />
                  <input
                    autoFocus
                    placeholder="Tìm kiếm phim, rạp chiếu..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: "#292F3D" }}
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => { navigate(link.view); setMenuOpen(false); }}
                    className="text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                    style={{ color: currentView === link.view ? "#F5F5F7" : "#A3AAB8", backgroundColor: currentView === link.view ? "#191F2B" : "transparent" }}
                  >
                    {link.label}
                  </button>
                ))}
                {!isLoggedIn && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { navigate("login"); setMenuOpen(false); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                      style={{ border: "1px solid #292F3D", color: "#F5F5F7" }}
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => { handleDemoLogin(); setMenuOpen(false); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                      style={{ backgroundColor: "#F04452", color: "#fff" }}
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Content */}
      <main style={{ paddingTop: "64px" }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20" style={{ borderColor: "#292F3D", backgroundColor: "#121620" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F04452" }}>
                  <Film size={14} className="text-white" />
                </div>
                <span className="text-base font-bold tracking-wider">CINEVERSE</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#737C8D" }}>
                Trải nghiệm điện ảnh đẳng cấp với công nghệ hình ảnh và âm thanh hiện đại nhất Việt Nam.
              </p>
            </div>
            {[
              { title: "Về chúng tôi", links: ["Giới thiệu", "Lịch sử", "Đội ngũ", "Nhà tuyển dụng"] },
              { title: "Hỗ trợ", links: ["Câu hỏi thường gặp", "Liên hệ", "Chính sách đổi trả", "Điều khoản sử dụng"] },
              { title: "Theo dõi", links: ["Facebook", "Instagram", "YouTube", "TikTok"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <button className="text-sm transition-colors hover:text-white cursor-pointer" style={{ color: "#737C8D" }}>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "#292F3D" }}>
            <p className="text-xs" style={{ color: "#737C8D" }}>© 2026 CINEVERSE Vietnam. Bảo lưu mọi quyền.</p>
            <div className="flex items-center gap-4">
              {["Chính sách bảo mật", "Điều khoản dịch vụ", "Cookie"].map((t) => (
                <button key={t} className="text-xs transition-colors hover:text-white cursor-pointer" style={{ color: "#737C8D" }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}