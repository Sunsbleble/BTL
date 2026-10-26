import { motion } from "motion/react";
import { CheckCircle, Download, Calendar, Share2, QrCode, Film, MapPin, Clock, Ticket } from "lucide-react";
import { formatVND } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

function QRPlaceholder({ code }: { code: string }) {
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff" }}>
      <div className="grid grid-cols-7 gap-0.5 p-3 w-full h-full">
        {Array.from({ length: 49 }).map((_, i) => {
          const corner = [0, 1, 2, 7, 8, 9, 14, 15, 16, 32, 33, 34, 39, 40, 41, 46, 47, 48].includes(i);
          const rand = ((i * 7 + 13) % 3 === 0) || corner;
          return <div key={i} className="rounded-sm" style={{ backgroundColor: rand ? "#0B0D12" : "transparent", aspectRatio: "1" }} />;
        })}
      </div>
      <div className="absolute text-xs font-mono font-bold" style={{ color: "#0B0D12", fontSize: "8px", bottom: "6px" }}>{code}</div>
    </div>
  );
}

export default function BookingSuccessPage() {
  const { booking, clearBooking, navigate } = useApp();
  const bookingRef = `CV${Date.now().toString().slice(-8)}`;

  const { movieTitle, moviePoster, cinemaName, auditoriumName, showtime, selectedSeats, foodItems } = booking;

  const ticketTotal = selectedSeats.reduce((sum, s) => {
    if (!showtime) return sum;
    return sum + (s.type === "vip" ? showtime.vipPrice : s.type === "couple" ? showtime.couplePrice : showtime.price);
  }, 0);
  const foodTotal = foodItems.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const total = ticketTotal + foodTotal - booking.voucherDiscount - booking.pointsRedeemed * 100;

  const handleGoHome = () => { clearBooking(); navigate("home"); };
  const handleMyTickets = () => { clearBooking(); navigate("bookings"); };

  return (
    <div className="min-h-[80vh] py-12 px-4" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="max-w-xl mx-auto">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(53,201,138,0.15)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle size={40} style={{ color: "#35C98A" }} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Đặt vé thành công!</h1>
          <p style={{ color: "#737C8D" }}>Mã đặt vé: <span className="font-mono font-bold" style={{ color: "#F5F5F7" }}>{bookingRef}</span></p>
        </motion.div>

        {/* E-Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl overflow-hidden mb-6"
          style={{ border: "1px solid #292F3D", backgroundColor: "#121620" }}
        >
          {/* Ticket Top */}
          <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #191F2B 0%, #0f1520 100%)" }}>
            <div className="absolute inset-0 opacity-20">
              <img src={moviePoster} alt="" className="w-full h-full object-cover" style={{ filter: "blur(20px)", transform: "scale(1.2)" }} />
            </div>
            <div className="relative p-6 flex gap-5">
              <img src={moviePoster} alt={movieTitle} className="w-20 rounded-xl object-cover shadow-2xl shrink-0" style={{ aspectRatio: "2/3", backgroundColor: "#191F2B" }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mb-2 tracking-wider" style={{ color: "#F04452" }}>CINEVERSE E-TICKET</p>
                <h2 className="font-bold text-lg leading-tight mb-3">{movieTitle}</h2>
                <div className="space-y-1.5">
                  {[
                    { icon: MapPin, text: cinemaName },
                    { icon: Film, text: auditoriumName },
                    { icon: Calendar, text: showtime?.date ?? "" },
                    { icon: Clock, text: `${showtime?.startTime} – ${showtime?.endTime}` },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs" style={{ color: "#A3AAB8" }}>
                      <Icon size={12} style={{ color: "#F04452" }} />
                      <span className="truncate">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seat Tags */}
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {selectedSeats.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1.5 rounded-xl text-sm font-bold"
                  style={{
                    backgroundColor: s.type === "vip" ? "rgba(245,185,66,0.15)" : s.type === "couple" ? "rgba(99,165,255,0.15)" : "rgba(240,68,82,0.12)",
                    color: s.type === "vip" ? "#F5B942" : s.type === "couple" ? "#63A5FF" : "#F04452",
                    border: `1px solid ${s.type === "vip" ? "rgba(245,185,66,0.3)" : s.type === "couple" ? "rgba(99,165,255,0.3)" : "rgba(240,68,82,0.3)"}`,
                  }}
                >
                  {s.row}{s.number} · {s.type === "vip" ? "VIP" : s.type === "couple" ? "Đôi" : "Thường"}
                </span>
              ))}
            </div>
          </div>

          {/* Ticket Divider (perforated) */}
          <div className="relative flex items-center">
            <div className="w-6 h-6 rounded-full shrink-0 -ml-3" style={{ backgroundColor: "#0B0D12" }} />
            <div className="flex-1 border-t border-dashed" style={{ borderColor: "#292F3D" }} />
            <div className="w-6 h-6 rounded-full shrink-0 -mr-3" style={{ backgroundColor: "#0B0D12" }} />
          </div>

          {/* Ticket Bottom */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: "#737C8D" }}>Quét mã để vào rạp</p>
              <QRPlaceholder code={bookingRef} />
              <p className="text-center text-xs mt-2 font-mono font-bold" style={{ color: "#F04452" }}>{bookingRef}</p>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              {foodItems.length > 0 && (
                <div className="p-3 rounded-xl" style={{ backgroundColor: "#191F2B" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#737C8D" }}>Bắp nước</p>
                  {foodItems.map((c) => (
                    <p key={c.item.id} className="text-xs">• {c.item.name} ×{c.qty}</p>
                  ))}
                </div>
              )}
              <div className="p-3 rounded-xl" style={{ backgroundColor: "#191F2B" }}>
                <div className="flex justify-between text-xs mb-1"><span style={{ color: "#737C8D" }}>Số ghế</span><span>{selectedSeats.length}</span></div>
                {booking.voucherDiscount > 0 && <div className="flex justify-between text-xs mb-1" style={{ color: "#35C98A" }}><span>Giảm giá</span><span>-{formatVND(booking.voucherDiscount)}</span></div>}
                <div className="flex justify-between text-sm font-bold border-t pt-1.5 mt-1.5" style={{ borderColor: "#292F3D" }}>
                  <span>Đã thanh toán</span>
                  <span style={{ color: "#F04452" }}>{formatVND(total)}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(53,201,138,0.08)", border: "1px solid rgba(53,201,138,0.2)" }}>
                <div className="flex items-center gap-2">
                  <Ticket size={14} style={{ color: "#35C98A" }} />
                  <span className="text-xs font-semibold" style={{ color: "#35C98A" }}>Thanh toán thành công</span>
                </div>
                <p className="text-xs mt-1" style={{ color: "#737C8D" }}>VNPay · {new Date().toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
            <Download size={16} /> Tải vé
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
            <Calendar size={16} /> Thêm lịch
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
            <Share2 size={16} /> Chia sẻ
          </button>
          <button onClick={handleMyTickets} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: "#F04452", color: "#F04452" }}>
            <QrCode size={16} /> Vé của tôi
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleGoHome}
          className="w-full py-3.5 rounded-xl font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #F04452 0%, #cc2233 100%)", color: "#fff" }}
        >
          Về trang chủ
        </motion.button>

        <p className="text-xs text-center mt-4" style={{ color: "#737C8D" }}>
          QR code đã được gửi đến email của bạn. Xuất trình tại quầy soát vé để vào rạp.
        </p>
      </div>
    </div>
  );
}
