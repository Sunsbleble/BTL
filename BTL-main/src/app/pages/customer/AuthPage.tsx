import { useState } from "react";
import { Eye, EyeOff, Film, ArrowRight, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { users } from "../../data/mockData";

type Tab = "login" | "register";

export default function AuthPage({ defaultTab = "login" }: { defaultTab?: Tab }) {
  const { login, navigate } = useApp();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", phone: "", name: "", password: "", confirm: "", remember: false, terms: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // SỬA Ở ĐÂY: Dùng form.email và form.password
        body: JSON.stringify({ email: form.email, password: form.password }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      // Đăng nhập thành công -> Lưu user & token, tự động chuyển giao diện theo Role
      login(data.user, data.token);

    } catch (err: any) {
      // Bắt lỗi thật ra console để dễ debug nếu có lỗi khác
      console.error("Lỗi khi đăng nhập:", err); 
      setError("Không thể kết nối đến máy chủ Backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (form.password !== form.confirm) { 
      setError("Mật khẩu xác nhận không khớp."); 
      return; 
    }
    if (!form.terms) { 
      setError("Vui lòng đồng ý với điều khoản sử dụng."); 
      return; 
    }
    
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        setTab("login"); 
        setForm({ ...form, password: "", confirm: "" }); 
      } else {
        setError(data.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: "customer" | "staff" | "admin") => {
    const u = users.find((u) => u.role === role) ?? users[0];
    login(u);
    if (role === "staff") navigate("staff-dashboard");
    else if (role === "admin") navigate("admin-dashboard");
    else navigate("home");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,68,82,0.08) 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F04452 0%, #cc2233 100%)" }}>
            <Film size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-wider">CINEVERSE</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ backgroundColor: "#191F2B" }}>
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: tab === t ? "#F04452" : "transparent", color: tab === t ? "#fff" : "#737C8D" }}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "rgba(240,68,82,0.1)", color: "#F04452", border: "1px solid rgba(240,68,82,0.3)" }}>
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email hoặc số điện thoại</label>
                <input
                  type="text"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                  style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#737C8D" }}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm" style={{ color: "#A3AAB8" }}>Ghi nhớ đăng nhập</span>
                </label>
                <button type="button" className="text-sm" style={{ color: "#F04452" }}>Quên mật khẩu?</button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity"
                style={{ backgroundColor: "#F04452", color: "#fff", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Đăng nhập</span><ArrowRight size={16} /></>}
              </button>
              <div className="text-center text-sm" style={{ color: "#737C8D" }}>
                Chưa có tài khoản?{" "}
                <button type="button" onClick={() => setTab("register")} style={{ color: "#F04452" }}>Đăng ký ngay</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Họ và tên</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Số điện thoại</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="0901234567" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Ít nhất 8 ký tự" className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#737C8D" }}>{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
                {form.password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[6, 8, 10].map((n) => (
                      <div key={n} className="h-1 flex-1 rounded-full" style={{ backgroundColor: form.password.length >= n ? "#35C98A" : "#292F3D" }} />
                    ))}
                    <span className="text-xs ml-1" style={{ color: form.password.length >= 8 ? "#35C98A" : "#737C8D" }}>{form.password.length < 6 ? "Yếu" : form.password.length < 8 ? "Trung bình" : "Mạnh"}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input type="password" required value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="Nhập lại mật khẩu" className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                  {form.confirm && form.confirm === form.password && (
                    <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#35C98A" }} />
                  )}
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded shrink-0" />
                <span className="text-sm" style={{ color: "#A3AAB8" }}>
                  Tôi đồng ý với{" "}
                  <span style={{ color: "#F04452" }}>Điều khoản dịch vụ</span> và{" "}
                  <span style={{ color: "#F04452" }}>Chính sách bảo mật</span> của CINEVERSE
                </span>
              </label>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style={{ backgroundColor: "#F04452", color: "#fff", opacity: loading ? 0.7 : 1 }}>
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Tạo tài khoản</span><ArrowRight size={16} /></>}
              </button>
              <div className="text-center text-sm" style={{ color: "#737C8D" }}>
                Đã có tài khoản?{" "}
                <button type="button" onClick={() => setTab("login")} style={{ color: "#F04452" }}>Đăng nhập</button>
              </div>
            </form>
          )}
        </div>

        {/* Demo login */}
        <div className="mt-4 p-4 rounded-2xl border" style={{ backgroundColor: "rgba(99,165,255,0.06)", borderColor: "rgba(99,165,255,0.2)" }}>
          <p className="text-xs text-center mb-3" style={{ color: "#63A5FF" }}>Demo nhanh — chọn vai trò:</p>
          <div className="flex gap-2">
            {[
              { role: "customer" as const, label: "Khách hàng" },
              { role: "staff" as const, label: "Nhân viên" },
              { role: "admin" as const, label: "Quản trị" },
            ].map(({ role, label }) => (
              <button
                key={role}
                onClick={() => demoLogin(role)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(99,165,255,0.3)", color: "#63A5FF" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
