import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Tag, Eye } from "lucide-react";
import { promotions, formatVND, type Promotion } from "../../data/mockData";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Đang chạy", color: "#35C98A" },
  scheduled: { label: "Lên lịch", color: "#63A5FF" },
  expired: { label: "Hết hạn", color: "#737C8D" },
  paused: { label: "Tạm dừng", color: "#F5B942" },
};

export default function PromotionManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addModal, setAddModal] = useState(false);

  const filtered = promotions.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{promotions.length} chương trình khuyến mãi</p>
        </div>
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff" }}>
          <Plus size={16} /> Tạo khuyến mãi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <div key={status} className="p-4 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <p className="text-2xl font-bold" style={{ color: cfg.color }}>{promotions.filter((p) => p.status === status).length}</p>
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
            <button key={value} onClick={() => setStatusFilter(value)} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: statusFilter === value ? "#F04452" : "#191F2B", color: statusFilter === value ? "#fff" : "#A3AAB8", border: `1px solid ${statusFilter === value ? "#F04452" : "#292F3D"}` }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((promo) => {
          const cfg = STATUS_CONFIG[promo.status];
          const usagePct = Math.round((promo.usedCount / promo.usageLimit) * 100);
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
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "#63A5FF" }}><Eye size={13} /></button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "#F5B942" }}><Edit2 size={13} /></button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "#F04452" }}><Trash2 size={13} /></button>
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
                    <div className="h-full rounded-full" style={{ width: `${usagePct}%`, backgroundColor: usagePct > 80 ? "#F04452" : usagePct > 50 ? "#F5B942" : "#35C98A" }} />
                  </div>
                  <p className="text-xs mt-1 text-right" style={{ color: "#737C8D" }}>{usagePct}% đã dùng</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
