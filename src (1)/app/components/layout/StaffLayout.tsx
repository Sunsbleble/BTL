import { Film, ScanLine, ShoppingCart, Receipt, LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Props {
  children: React.ReactNode;
  activeView: string;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Tổng quan", view: "staff-dashboard" },
  { icon: ScanLine, label: "Kiểm soát vé", view: "staff-validate" },
  { icon: ShoppingCart, label: "Bán vé (POS)", view: "staff-pos" },
  { icon: Receipt, label: "Lịch sử giao dịch", view: "staff-transactions" },
];

export default function StaffLayout({ children, activeView }: Props) {
  const { navigate, user, logout } = useApp();

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", backgroundColor: "#0B0D12", color: "#F5F5F7" }}>
      {/* Sidebar */}
      <aside className="w-60 flex flex-col border-r shrink-0" style={{ borderColor: "#292F3D", backgroundColor: "#121620" }}>
        <div className="h-16 flex items-center border-b px-4 gap-3" style={{ borderColor: "#292F3D" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F04452" }}>
            <Film size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm tracking-widest">CINEVERSE</p>
            <p className="text-xs" style={{ color: "#737C8D" }}>Nhân viên</p>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2">
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
              >
                <Icon size={17} />
                <span>{label}</span>
                {active && <ChevronRight size={13} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t p-3" style={{ borderColor: "#292F3D" }}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <img src={user?.avatar ?? "https://i.pravatar.cc/150?img=15"} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user?.name ?? "Nhân viên"}</p>
              <p className="text-xs" style={{ color: "#737C8D" }}>CINEVERSE Vincom</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5"
            style={{ color: "#737C8D" }}
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b shrink-0" style={{ borderColor: "#292F3D", backgroundColor: "#121620" }}>
          <h1 className="font-semibold">{NAV_ITEMS.find((n) => n.view === activeView)?.label ?? "Nhân viên"}</h1>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(53,201,138,0.12)", color: "#35C98A" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            Ca làm việc: 08:00 – 20:00
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#0B0D12" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
