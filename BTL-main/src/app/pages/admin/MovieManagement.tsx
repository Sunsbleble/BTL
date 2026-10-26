import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, X } from "lucide-react";
import { RATING_COLORS, type Movie } from "../../data/mockData";

const STATUS_LABEL: Record<string, string> = { now_showing: "Đang chiếu", coming_soon: "Sắp chiếu", ended: "Hết chiếu" };
const STATUS_COLOR: Record<string, string> = { now_showing: "#35C98A", coming_soon: "#63A5FF", ended: "#737C8D" };

type ModalMode = "view" | "edit" | "add" | null;

function MovieModal({ movie, mode, onClose, onSave }: { movie?: Movie; mode: ModalMode; onClose: () => void; onSave: (data: Partial<Movie>) => void }) {
  const [form, setForm] = useState<Partial<Movie>>(
    movie ?? { title: "", originalTitle: "", synopsis: "", genre: ["Hành động"], duration: 120, director: "", cast: [], releaseDate: "", ageRating: "P", formats: ["2D"], status: "coming_soon", poster: "", trailerUrl: "" }
  );

  if (!mode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#292F3D" }}>
          <h2 className="font-bold text-lg text-white">{mode === "add" ? "Thêm phim mới" : mode === "edit" ? "Chỉnh sửa phim" : "Chi tiết phim"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#737C8D" }}><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {mode === "view" && movie ? (
            <div className="flex gap-5 text-white">
              <img src={movie.poster} alt="" className="w-32 rounded-xl object-cover shrink-0" style={{ backgroundColor: "#191F2B", aspectRatio: "2/3" }} />
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">{movie.title}</h3>
                <p style={{ color: "#737C8D" }}>{movie.originalTitle}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#A3AAB8" }}>{movie.synopsis}</p>
                {[["Đạo diễn", movie.director], ["Thể loại", Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre], ["Khởi chiếu", movie.releaseDate]].map(([l, v]) => (
                  <div key={l} className="flex gap-4 text-sm">
                    <span className="w-24 shrink-0" style={{ color: "#737C8D" }}>{l}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Tên phim</label>
                  <input required value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Đạo diễn</label>
                  <input value={form.director ?? ""} onChange={(e) => setForm((f) => ({ ...f, director: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Nội dung phim</label>
                  <textarea value={form.synopsis ?? ""} onChange={(e) => setForm((f) => ({ ...f, synopsis: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Thời lượng (phút)</label>
                  <input type="number" value={form.duration ?? 120} onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Ngày khởi chiếu</label>
                  <input type="date" value={form.releaseDate ?? ""} onChange={(e) => setForm((f) => ({ ...f, releaseDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Trạng thái</label>
                  <select value={form.status ?? "coming_soon"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}>
                    <option value="coming_soon">Sắp chiếu</option>
                    <option value="now_showing">Đang chiếu</option>
                    <option value="ended">Hết chiếu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>URL Poster</label>
                  <input value={form.poster ?? ""} onChange={(e) => setForm((f) => ({ ...f, poster: e.target.value }))} placeholder="/images/movie.jpg" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                  {mode === "add" ? "Thêm phim" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MovieManagement() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch danh sách phim từ MySQL Backend
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/movies");
      const data = await res.json();
      setMovieList(data);
    } catch (error) {
      console.error("Lỗi tải phim:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const openModal = (mode: ModalMode, movie?: Movie) => { setSelectedMovie(movie); setModalMode(mode); };

  // Xử lý Thêm / Sửa Phim
  const handleSaveMovie = async (formData: Partial<Movie>) => {
    try {
      const isEdit = modalMode === "edit" && selectedMovie;
      const url = isEdit 
        ? `http://localhost:5000/api/admin/movies/${selectedMovie.id}`
        : "http://localhost:5000/api/admin/movies";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalMode(null);
        setSelectedMovie(undefined);
        fetchMovies(); // Reload danh sách phim
      }
    } catch (error) {
      console.error("Lỗi lưu phim:", error);
    }
  };

  // Xử lý Xóa Phim
  const handleDeleteMovie = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/movies/${deleteConfirm}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteConfirm(null);
        fetchMovies();
      }
    } catch (error) {
      console.error("Lỗi xóa phim:", error);
    }
  };

  const filtered = movieList.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phim</h1>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>{movieList.length} phim trong hệ thống MySQL</p>
        </div>
        <button onClick={() => openModal("add")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer" style={{ backgroundColor: "#F04452", color: "#fff" }}>
          <Plus size={16} /> Thêm phim mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737C8D" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm phim..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
        </div>
        <div className="flex gap-2">
          {[["all", "Tất cả"], ["now_showing", "Đang chiếu"], ["coming_soon", "Sắp chiếu"], ["ended", "Hết chiếu"]].map(([value, label]) => (
            <button key={value} onClick={() => setStatusFilter(value)} className="px-3 py-2 rounded-xl text-sm font-medium cursor-pointer" style={{ backgroundColor: statusFilter === value ? "#F04452" : "#191F2B", color: statusFilter === value ? "#fff" : "#A3AAB8", border: `1px solid ${statusFilter === value ? "#F04452" : "#292F3D"}` }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#191F2B", borderBottom: "1px solid #292F3D" }}>
                {["Phim", "Thể loại", "Thời lượng", "Khởi chiếu", "Trạng thái", "Thao tác"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#737C8D" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#1a2030" }}>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Đang tải danh sách phim từ CSDL...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy phim nào</td></tr>
              ) : filtered.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={movie.poster} alt="" className="w-9 h-12 rounded-lg object-cover shrink-0" style={{ backgroundColor: "#191F2B" }} />
                      <div>
                        <p className="font-semibold text-sm leading-tight">{movie.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{movie.director}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#A3AAB8" }}>{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#A3AAB8" }}>{movie.duration} phút</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#A3AAB8" }}>{movie.releaseDate}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${STATUS_COLOR[movie.status]}15`, color: STATUS_COLOR[movie.status] }}>{STATUS_LABEL[movie.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openModal("view", movie)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#63A5FF" }}><Eye size={14} /></button>
                      <button onClick={() => openModal("edit", movie)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#F5B942" }}><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteConfirm(movie.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" style={{ color: "#F04452" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movie Modal */}
      {modalMode && <MovieModal movie={selectedMovie} mode={modalMode} onClose={() => { setModalMode(null); setSelectedMovie(undefined); }} onSave={handleSaveMovie} />}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm p-6 rounded-2xl border" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
            <h3 className="font-bold text-lg mb-2">Xóa phim?</h3>
            <p className="text-sm mb-6" style={{ color: "#737C8D" }}>Hành động này sẽ xóa vĩnh viễn phim khỏi cơ sở dữ liệu MySQL.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>Hủy</button>
              <button onClick={handleDeleteMovie} className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "#F04452", color: "#fff" }}>Xóa phim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}