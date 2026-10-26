import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Shield, Lock, Unlock, X } from "lucide-react";

export type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  points: number;
  memberTier: string;
  joinDate: string;
  avatar: string;
};

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  customer: { label: "Khách hàng", color: "#63A5FF" },
  staff: { label: "Nhân viên", color: "#F5B942" },
  manager: { label: "Quản lý rạp", color: "#c084fc" },
  admin: { label: "Quản trị viên", color: "#F04452" },
};

const TIER_COLORS: Record<string, string> = { Silver: "#A3AAB8", Gold: "#F5B942", Platinum: "#63A5FF" };

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Form State cho thêm mới
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer"
  });

  const [editForm, setEditForm] = useState({ role: "customer", status: "active" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý Thêm tài khoản mới
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Thêm tài khoản thất bại!");
        return;
      }

      setIsAddModalOpen(false);
      setAddForm({ name: "", email: "", phone: "", password: "", role: "customer" });
      fetchUsers();
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
    }
  };

  // Xử lý Xóa người dùng
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Lỗi xóa tài khoản:", error);
    }
  };

  // Xử lý Khóa / Mở khóa nhanh
  const toggleStatus = async (user: UserType) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: user.role, status: newStatus }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  // Lưu chỉnh sửa phân quyền
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Lỗi lưu thông tin:", error);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || String(u.role).toLowerCase() === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{users.length} tài khoản trong hệ thống</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90" 
          style={{ backgroundColor: "#F04452", color: "#fff" }}
        >
          <Plus size={16} /> Thêm tài khoản
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["customer", "staff", "manager", "admin"].map((role) => {
          const cfg = ROLE_CONFIG[role];
          const count = users.filter((u) => String(u.role).toLowerCase() === role).length;
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
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
          <option value="all">Tất cả vai trò</option>
          {Object.entries(ROLE_CONFIG).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
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
                {["Người dùng", "Vai trò", "Điểm / Hạng", "Ngày tham gia", "Trạng thái", "Thao tác"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#737C8D" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy người dùng</td></tr>
              ) : filtered.map((user) => {
                const roleKey = String(user.role).toLowerCase();
                const roleCfg = ROLE_CONFIG[roleKey] || ROLE_CONFIG.customer;
                return (
                  <tr key={user.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "#1a2030" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs" style={{ color: "#737C8D" }}>{user.email}</p>
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
                      {roleKey === "customer" ? (
                        <div>
                          <p className="text-sm font-bold" style={{ color: TIER_COLORS[user.memberTier] || "#A3AAB8" }}>{user.memberTier || "Standard"}</p>
                          <p className="text-xs" style={{ color: "#737C8D" }}>{Number(user.points || 0).toLocaleString()} điểm</p>
                        </div>
                      ) : <span style={{ color: "#737C8D" }}>–</span>}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#A3AAB8" }}>{user.joinDate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: user.status === "active" ? "rgba(53,201,138,0.15)" : "rgba(240,68,82,0.15)", color: user.status === "active" ? "#35C98A" : "#F04452" }}>
                        {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingUser(user); setEditForm({ role: roleKey, status: user.status }); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#F5B942" }}><Edit2 size={13} /></button>
                        <button onClick={() => toggleStatus(user)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: user.status === "active" ? "#737C8D" : "#35C98A" }} title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa"}>
                          {user.status === "active" ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#F04452" }} disabled={roleKey === "admin"}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm tài khoản mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl border p-6" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Thêm tài khoản mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="cursor-pointer"><X size={18} style={{ color: "#737C8D" }} /></button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Họ và tên</label>
                <input required value={addForm.name} onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Email</label>
                <input type="email" required value={addForm.email} onChange={(e) => setAddForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Số điện thoại</label>
                <input value={addForm.phone} onChange={(e) => setAddForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Mật khẩu</label>
                <input type="password" required value={addForm.password} onChange={(e) => setAddForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Phân quyền Role</label>
                <select value={addForm.role} onChange={(e) => setAddForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                  <option value="customer">Khách hàng</option>
                  <option value="staff">Nhân viên</option>
                  <option value="manager">Quản lý rạp</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer" style={{ borderColor: "#292F3D" }}>Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "#F04452" }}>Tạo tài khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa / Phân quyền */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Phân quyền tài khoản</h3>
              <button onClick={() => setEditingUser(null)} className="cursor-pointer"><X size={18} style={{ color: "#737C8D" }} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">{editingUser.name}</p>
                <p className="text-xs" style={{ color: "#737C8D" }}>{editingUser.email}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Vai trò</label>
                <select value={editForm.role} onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                  {Object.entries(ROLE_CONFIG).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Trạng thái</label>
                <select value={editForm.status} onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer" style={{ borderColor: "#292F3D" }}>Hủy</button>
                <button onClick={handleSaveEdit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "#F04452" }}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}