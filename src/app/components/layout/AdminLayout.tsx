import { useState } from "react";
import {
  LayoutDashboard, Film, Calendar, Building2, Users, Tag, BarChart3, Bell, Settings,
  ChevronRight, Menu, X, LogOut, ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Props {
  children: React.ReactNode;
  activeView: string;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Tổng quan", view: "admin-dashboard" },
  { icon: Film, label: "Quản lý phim", view: "admin-movies" },
  { icon: Calendar, label: "Lịch chiếu", view: "admin-showtimes" },
  { icon: Building2, label: "Rạp & Phòng chiếu", view: "admin-cinemas" },
  { icon: Users, label: "Người dùng", view: "admin-users" },
  { icon: Tag, label: "Khuyến mãi", view: "admin-promotions" },
  { icon: BarChart3, label: "Báo cáo", view: "admin-reports" },
  { icon: Bell, label: "Thông báo", view: "admin-notifications" },
  { icon: Settings, label: "Cài đặt", view: "admin-settings" },
];

export default function AdminLayout({ children, activeView }: Props) {
  const { navigate, user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", backgroundColor: "#0B0D12", color: "#F5F5F7" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col border-r shrink-0 transition-all duration-200"
        style={{ width: sidebarOpen ? "240px" : "64px", borderColor: "#292F3D", backgroundColor: "#121620" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b px-4 gap-3 shrink-0" style={{ borderColor: "#292F3D" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#F04452" }}>
            <Film size={16} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-bold text-sm tracking-widest truncate">CINEVERSE</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, view }) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                onClick={() => navigate(view)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors text-left"
                style={{
                  backgroundColor: active ? "rgba(240,68,82,0.12)" : "transparent",
                  color: active ? "#F04452" : "#A3AAB8",
                }}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={17} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t p-3 shrink-0" style={{ borderColor: "#292F3D" }}>
          <div
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img src={user?.avatar ?? "https://i.pravatar.cc/150?img=16"} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{user?.name ?? "Admin"}</p>
                  <p className="text-xs truncate" style={{ color: "#737C8D" }}>Quản trị viên</p>
                </div>
                <ChevronDown size={14} style={{ color: "#737C8D" }} />
              </>
            )}
          </div>
          {sidebarOpen && profileOpen && (
            <div className="mt-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5"
                style={{ color: "#F04452" }}
              >
                <LogOut size={14} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b shrink-0" style={{ borderColor: "#292F3D", backgroundColor: "#121620" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ color: "#A3AAB8" }}
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "#737C8D" }}>
              <span>Admin</span>
              <ChevronRight size={13} />
              <span style={{ color: "#F5F5F7" }}>{NAV_ITEMS.find((n) => n.view === activeView)?.label ?? "Tổng quan"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/5" style={{ color: "#A3AAB8" }}>
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#F04452" }} />
            </button>
            <button onClick={() => navigate("home")} className="text-xs px-3 py-1.5 rounded-lg border hover:bg-white/5" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
              Xem website
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#0B0D12" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
