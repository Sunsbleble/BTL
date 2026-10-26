import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Ticket, Calendar, Clock, MapPin, QrCode } from "lucide-react";

export default function MyTicketsPage() {
  const { user, navigate } = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/tickets/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTickets(data);
      })
      .catch((err) => console.error("Lỗi tải vé:", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Ticket size={48} className="text-gray-500 mb-4" />
        <p className="text-lg font-bold text-white mb-2">Vui lòng đăng nhập</p>
        <p className="text-sm text-gray-400 mb-4">Bạn cần đăng nhập để xem danh sách vé đã đặt.</p>
        <button onClick={() => navigate("home")} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm">
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 text-white" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Ticket className="text-red-500" /> Vé xem phim của tôi
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Đang tải danh sách vé...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-gray-800 bg-[#121620]">
          <Ticket size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">Bạn chưa có đơn đặt vé nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((t) => (
            <div key={t.ticket_id} className="rounded-2xl p-5 border border-gray-800 bg-[#121620] flex gap-4 relative overflow-hidden">
              <img src={t.poster_url || "/images/dune.jpg"} alt="" className="w-24 h-36 rounded-xl object-cover shrink-0 bg-gray-800" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-base truncate">{t.movie_title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.ticket_status === "Used" ? "bg-gray-800 text-gray-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {t.ticket_status === "Used" ? "Đã soát" : "Chưa dùng"}
                  </span>
                </div>

                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {t.room_name} · Ghế <b className="text-white">{t.seat_row}{t.seat_number}</b>
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Calendar size={12} /> {new Date(t.start_time).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Clock size={12} /> {new Date(t.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </p>

                {/* Render Mã QR dạng Ảnh từ API QR Code Server */}
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(t.qr_code)}`}
                    alt="QR Code"
                    className="w-16 h-16 rounded-lg bg-white p-1"
                  />
                  <div className="text-[10px] text-gray-400">
                    <p className="font-mono text-gray-300 font-semibold">{t.qr_code.slice(0, 18)}...</p>
                    <p className="mt-0.5">Xuất trình mã này cho nhân viên soát vé tại rạp</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}