import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Shield, User, MoreVertical, Filter } from "lucide-react";
import { users, type User as UserType } from "../../data/mockData";

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  customer: { label: "Khách hàng", color: "#63A5FF" },
  staff: { label: "Nhân viên", color: "#F5B942" },
  manager: { label: "Quản lý rạp", color: "#c084fc" },
  admin: { label: "Quản trị viên", color: "#F04452" },
};

const TIER_COLORS: Record<string, string> = { Silver: "#A3AAB8", Gold: "#F5B942", Platinum: "#63A5FF" };

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{users.length} tài khoản trong hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff" }}>
          <Plus size={16} /> Thêm tài khoản
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { role: "customer", count: users.filter((u) => u.role === "customer").length },
          { role: "staff", count: users.filter((u) => u.role === "staff").length },
          { role: "manager", count: users.filter((u) => u.role === "manager").length },
          { role: "admin", count: users.filter((u) => u.role === "admin").length },
        ].map(({ role, count }) => {
          const cfg = ROLE_CONFIG[role];
          return (
            <div key={role} className="p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
              <p className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</p>
              <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737C8D" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên, email..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}>
          <option value="all">Tất cả vai trò</option>
          {Object.entries(ROLE_CONFIG).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Vô hiệu hóa</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#191F2B", borderBottom: "1px solid #292F3D" }}>
                {["Người dùng", "Vai trò", "Điểm / Hạng", "Ngày tham gia", "Lần cuối hoạt động", "Trạng thái", "Thao tác"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#737C8D" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const roleCfg = ROLE_CONFIG[user.role];
                return (
                  <tr key={user.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "#1a2030" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs" style={{ color: "#737C8D" }}>{user.email}</p>
                          <p className="text-xs" style={{ color: "#737C8D" }}>{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Shield size={13} style={{ color: roleCfg.color }} />
                        <span className="text-xs font-semibold" style={{ color: roleCfg.color }}>{roleCfg.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.role === "customer" ? (
                        <div>
                          <p className="text-sm font-bold" style={{ color: TIER_COLORS[user.memberTier] }}>{user.memberTier}</p>
                          <p className="text-xs" style={{ color: "#737C8D" }}>{user.points.toLocaleString()} điểm</p>
                        </div>
                      ) : <span style={{ color: "#737C8D" }}>–</span>}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#A3AAB8" }}>{user.joinDate}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#737C8D" }}>2 ngày trước</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: user.status === "active" ? "rgba(53,201,138,0.15)" : "rgba(240,68,82,0.15)", color: user.status === "active" ? "#35C98A" : "#F04452" }}>
                        {user.status === "active" ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "#F5B942" }}><Edit2 size={13} /></button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "#F04452" }} disabled={user.role === "admin"}><Trash2 size={13} /></button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "#737C8D" }}><MoreVertical size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between border-t text-xs" style={{ borderColor: "#292F3D", color: "#737C8D" }}>
          <span>Hiển thị {filtered.length}/{users.length} tài khoản</span>
          <div className="flex gap-1">
            {[1].map((p) => <button key={p} className="w-7 h-7 rounded-lg" style={{ backgroundColor: "#F04452", color: "#fff" }}>{p}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
