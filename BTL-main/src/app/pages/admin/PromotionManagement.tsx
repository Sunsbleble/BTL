import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Eye, X } from "lucide-react";
import { formatVND, type Promotion } from "../../data/mockData";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Đang chạy", color: "#35C98A" },
  scheduled: { label: "Lên lịch", color: "#63A5FF" },
  expired: { label: "Hết hạn", color: "#737C8D" },
  paused: { label: "Tạm dừng", color: "#F5B942" },
};

export default function PromotionManagement() {
  const [promotionsList, setPromotionsList] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [viewingPromo, setViewingPromo] = useState<Promotion | null>(null);

  // Form thêm voucher
  const [form, setForm] = useState({
    title: "",
    code: "",
    description: "",
    discountType: "percent",
    discountValue: 10,
    minSpend: 0,
    maxDiscount: 50000,
    startDate: "2026-10-26",
    endDate: "2026-12-31",
    usageLimit: 100,
    banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=200&fit=crop",
    status: "active"
  });

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/promotions");
      const data = await res.json();
      setPromotionsList(data);
    } catch (error) {
      console.error("Lỗi tải chương trình khuyến mãi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Tạo voucher thất bại!");
        return;
      }

      setAddModal(false);
      setForm({
        title: "",
        code: "",
        description: "",
        discountType: "percent",
        discountValue: 10,
        minSpend: 0,
        maxDiscount: 50000,
        startDate: "2026-10-26",
        endDate: "2026-12-31",
        usageLimit: 100,
        banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=200&fit=crop",
        status: "active"
      });
      fetchPromotions();
    } catch (error) {
      console.error("Lỗi lưu khuyến mãi:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/promotions/${id}`, { method: "DELETE" });
      if (res.ok) fetchPromotions();
    } catch (error) {
      console.error("Lỗi xóa khuyến mãi:", error);
    }
  };

  const filtered = promotionsList.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{promotionsList.length} chương trình khuyến mãi</p>
        </div>
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90" style={{ backgroundColor: "#F04452", color: "#fff" }}>
          <Plus size={16} /> Tạo khuyến mãi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <div key={status} className="p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <p className="text-2xl font-bold" style={{ color: cfg.color }}>{promotionsList.filter((p) => p.status === status).length}</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737C8D" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc mã..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
        </div>
        <div className="flex gap-2">
          {[["all", "Tất cả"], ...Object.entries(STATUS_CONFIG).map(([v, { label }]) => [v, label])].map(([value, label]) => (
            <button key={value} onClick={() => setStatusFilter(value)} className="px-3 py-2 rounded-xl text-sm font-medium cursor-pointer" style={{ backgroundColor: statusFilter === value ? "#F04452" : "#191F2B", color: statusFilter === value ? "#fff" : "#A3AAB8", border: `1px solid ${statusFilter === value ? "#F04452" : "#292F3D"}` }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải danh sách khuyến mãi...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Chưa có khuyến mãi nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((promo) => {
            const cfg = STATUS_CONFIG[promo.status] || STATUS_CONFIG.active;
            const usagePct = promo.usageLimit > 0 ? Math.round((promo.usedCount / promo.usageLimit) * 100) : 0;
            return (
              <div key={promo.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
                {/* Banner */}
                <div className="relative h-32 overflow-hidden">
                  <img src={promo.banner} alt="" className="w-full h-full object-cover" style={{ backgroundColor: "#191F2B" }} />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>{cfg.label}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                      {promo.discountType === "percent" ? `-${promo.discountValue}%` : `-${(promo.discountValue / 1000).toFixed(0)}K₫`}
                    </span>
                  </div>
                  <code className="absolute bottom-3 left-3 px-2.5 py-1 rounded font-mono text-sm font-bold" style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#F04452", border: "1px dashed rgba(240,68,82,0.5)" }}>{promo.code}</code>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-base">{promo.title}</h3>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setViewingPromo(promo)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#63A5FF" }}><Eye size={13} /></button>
                      <button onClick={() => handleDelete(promo.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#F04452" }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "#737C8D" }}>{promo.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#191F2B" }}>
                      <p style={{ color: "#737C8D" }}>Chi tiêu tối thiểu</p>
                      <p className="font-semibold mt-0.5">{formatVND(promo.minSpend)}</p>
                    </div>
                    {promo.maxDiscount && (
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#191F2B" }}>
                        <p style={{ color: "#737C8D" }}>Giảm tối đa</p>
                        <p className="font-semibold mt-0.5">{formatVND(promo.maxDiscount)}</p>
                      </div>
                    )}
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#191F2B" }}>
                      <p style={{ color: "#737C8D" }}>Từ ngày</p>
                      <p className="font-semibold mt-0.5">{promo.startDate}</p>
                    </div>
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#191F2B" }}>
                      <p style={{ color: "#737C8D" }}>Đến ngày</p>
                      <p className="font-semibold mt-0.5">{promo.endDate}</p>
                    </div>
                  </div>

                  {/* Usage */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "#737C8D" }}>Lượt sử dụng</span>
                      <span><span className="font-bold">{promo.usedCount.toLocaleString()}</span> / {promo.usageLimit.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: usagePct > 80 ? "#F04452" : usagePct > 50 ? "#F5B942" : "#35C98A" }} />
                    </div>
                    <p className="text-xs mt-1 text-right" style={{ color: "#737C8D" }}>{usagePct}% đã dùng</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tạo khuyến mãi */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl border p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Tạo chương trình khuyến mãi</h3>
              <button onClick={() => setAddModal(false)} className="cursor-pointer"><X size={18} style={{ color: "#737C8D" }} /></button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Tên chương trình</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Mã Voucher</label>
                  <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="MEMBER2026" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none uppercase font-mono font-bold" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F04452" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Trạng thái</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                    <option value="active">Đang chạy</option>
                    <option value="scheduled">Lên lịch</option>
                    <option value="paused">Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Mô tả ngắn</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Loại giảm giá</label>
                  <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Giá trị giảm</label>
                  <input type="number" required value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Tối thiểu (VNĐ)</label>
                  <input type="number" value={form.minSpend} onChange={(e) => setForm((f) => ({ ...f, minSpend: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Giảm tối đa (VNĐ)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Bắt đầu</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Kết thúc</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer" style={{ borderColor: "#292F3D" }}>Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "#F04452" }}>Lưu khuyến mãi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {viewingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{viewingPromo.title}</h3>
              <button onClick={() => setViewingPromo(null)} className="cursor-pointer"><X size={18} style={{ color: "#737C8D" }} /></button>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Mã: <code className="text-[#F04452] font-mono font-bold">{viewingPromo.code}</code></p>
              <p>Chi tiêu tối thiểu: {formatVND(viewingPromo.minSpend)}</p>
              <p>Đã dùng: {viewingPromo.usedCount} / {viewingPromo.usageLimit}</p>
              <p>Thời hạn: {viewingPromo.startDate} đến {viewingPromo.endDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}