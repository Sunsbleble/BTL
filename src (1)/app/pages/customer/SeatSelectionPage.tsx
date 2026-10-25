import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Info, AlertCircle } from "lucide-react";
import { generateSeats, formatVND, type Seat } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function SeatSelectionPage() {
  const { booking, setBookingSeats, navigate, goBack } = useApp();
  const { showtime, movieTitle, cinemaName, auditoriumName, moviePoster } = booking;
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Seat[]>([]);
  const MAX_SEATS = 10;

  useEffect(() => {
    if (showtime?.auditoriumId) {
      setSeats(generateSeats(showtime.auditoriumId));
    }
  }, [showtime?.auditoriumId]);

  if (!showtime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} style={{ color: "#737C8D" }} />
        <p style={{ color: "#737C8D" }}>Vui lòng chọn suất chiếu trước.</p>
        <button onClick={() => navigate("home")} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#F04452", color: "#fff" }}>Về trang chủ</button>
      </div>
    );
  }

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "unavailable") return;
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, { ...seat, status: "selected" }];
    });
  };

  const isSelected = (seat: Seat) => selected.some((s) => s.id === seat.id);

  const seatPrice = (type: Seat["type"]) => {
    if (!showtime) return 0;
    if (type === "vip") return showtime.vipPrice;
    if (type === "couple") return showtime.couplePrice;
    return showtime.price;
  };

  const total = selected.reduce((sum, s) => sum + seatPrice(s.type), 0);
  const rows = [...new Set(seats.map((s) => s.row))];

  const handleContinue = () => {
    setBookingSeats(selected);
    navigate("food");
  };

  const SEAT_COLORS = {
    available: { bg: "#191F2B", border: "#292F3D", text: "#A3AAB8" },
    selected: { bg: "#F04452", border: "#F04452", text: "#fff" },
    occupied: { bg: "#292F3D", border: "#292F3D", text: "#737C8D" },
    unavailable: { bg: "#191F2B", border: "#292F3D", text: "#3a4050" },
    vip: { bg: "#191F2B", border: "#F5B942", text: "#F5B942" },
    couple: { bg: "#191F2B", border: "#63A5FF", text: "#63A5FF" },
  };

  const getSeatStyle = (seat: Seat): React.CSSProperties => {
    if (isSelected(seat)) return { backgroundColor: SEAT_COLORS.selected.bg, border: `1px solid ${SEAT_COLORS.selected.border}`, color: SEAT_COLORS.selected.text };
    if (seat.status === "occupied") return { backgroundColor: SEAT_COLORS.occupied.bg, border: `1px solid ${SEAT_COLORS.occupied.border}`, color: SEAT_COLORS.occupied.text, cursor: "not-allowed" };
    if (seat.type === "vip") return { backgroundColor: SEAT_COLORS.vip.bg, border: `1px solid ${SEAT_COLORS.vip.border}`, color: SEAT_COLORS.vip.text };
    if (seat.type === "couple") return { backgroundColor: SEAT_COLORS.couple.bg, border: `1px solid ${SEAT_COLORS.couple.border}`, color: SEAT_COLORS.couple.text };
    return { backgroundColor: SEAT_COLORS.available.bg, border: `1px solid ${SEAT_COLORS.available.border}`, color: SEAT_COLORS.available.text };
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", minHeight: "100vh" }}>
      {/* Progress */}
      <div className="border-b px-4 py-3" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#737C8D" }}>
            {["Phim", "Suất chiếu", "Chọn ghế", "Bắp nước", "Thanh toán"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className={i === 2 ? "font-semibold" : ""} style={{ color: i < 2 ? "#35C98A" : i === 2 ? "#F5F5F7" : "#737C8D" }}>{step}</span>
                {i < 4 && <span>›</span>}
              </span>
            ))}
          </div>
          <button onClick={goBack} className="flex items-center gap-1 text-sm" style={{ color: "#A3AAB8" }}>
            <ChevronLeft size={15} /> Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        {/* Booking Summary */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
          <img src={moviePoster} alt="" className="w-12 h-16 rounded-lg object-cover shrink-0" style={{ backgroundColor: "#191F2B" }} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{movieTitle}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "#737C8D" }}>{cinemaName}</p>
            <p className="text-xs mt-0.5" style={{ color: "#A3AAB8" }}>{auditoriumName} · {showtime.date} · {showtime.startTime} – {showtime.endTime} · {showtime.format}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Seat Map */}
          <div>
            {/* Screen */}
            <div className="text-center mb-8">
              <div className="relative mx-auto" style={{ maxWidth: "600px" }}>
                <div className="h-1 rounded-full mx-8 mb-1" style={{ background: "linear-gradient(to right, transparent, #63A5FF, transparent)", boxShadow: "0 0 20px rgba(99,165,255,0.4)" }} />
                <p className="text-xs" style={{ color: "#63A5FF", letterSpacing: "0.2em" }}>MÀN ẢNH</p>
              </div>
            </div>

            {/* Seats */}
            <div className="overflow-x-auto">
              <div className="min-w-max mx-auto" style={{ maxWidth: "700px" }}>
                {rows.map((row) => {
                  const rowSeats = seats.filter((s) => s.row === row);
                  return (
                    <div key={row} className="flex items-center gap-1 mb-1.5 justify-center">
                      <span className="w-6 text-xs font-semibold text-center shrink-0" style={{ color: "#737C8D" }}>{row}</span>
                      <div className="flex gap-1 flex-wrap justify-center">
                        {rowSeats.map((seat) => {
                          const w = seat.type === "couple" ? "w-12 md:w-14" : "w-8 md:w-9";
                          return (
                            <motion.button
                              key={seat.id}
                              whileHover={seat.status !== "occupied" ? { scale: 1.1 } : undefined}
                              whileTap={seat.status !== "occupied" ? { scale: 0.95 } : undefined}
                              onClick={() => toggleSeat(seat)}
                              className={`${w} h-7 md:h-8 rounded-t-lg text-xs font-semibold relative group`}
                              style={getSeatStyle(seat)}
                              title={`${seat.row}${seat.number} · ${seat.type === "vip" ? "VIP" : seat.type === "couple" ? "Đôi" : "Thường"} · ${formatVND(seatPrice(seat.type))}`}
                            >
                              {seat.number}
                              {isSelected(seat) && (
                                <motion.div
                                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                                  style={{ backgroundColor: "#35C98A" }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      <span className="w-6 text-xs font-semibold text-center shrink-0" style={{ color: "#737C8D" }}>{row}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs" style={{ color: "#A3AAB8" }}>
              {[
                { label: "Ghế thường", bg: "#191F2B", border: "#292F3D" },
                { label: "VIP", bg: "#191F2B", border: "#F5B942" },
                { label: "Ghế đôi", bg: "#191F2B", border: "#63A5FF" },
                { label: "Đã chọn", bg: "#F04452", border: "#F04452" },
                { label: "Đã đặt", bg: "#292F3D", border: "#292F3D" },
              ].map(({ label, bg, border }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-5 h-4 rounded-t-md" style={{ backgroundColor: bg, border: `1px solid ${border}` }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Panel */}
          <div>
            <div className="rounded-2xl p-5 sticky top-24" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4">Ghế đã chọn</h3>

              {selected.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: "#191F2B" }}>
                    <Info size={20} style={{ color: "#737C8D" }} />
                  </div>
                  <p className="text-sm" style={{ color: "#737C8D" }}>Chọn ghế trên sơ đồ để đặt vé</p>
                  <p className="text-xs mt-1" style={{ color: "#737C8D" }}>Tối đa {MAX_SEATS} ghế / giao dịch</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {selected.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: "#292F3D" }}>
                      <div>
                        <span className="font-semibold">{s.row}{s.number}</span>
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{
                          backgroundColor: s.type === "vip" ? "rgba(245,185,66,0.15)" : s.type === "couple" ? "rgba(99,165,255,0.15)" : "#191F2B",
                          color: s.type === "vip" ? "#F5B942" : s.type === "couple" ? "#63A5FF" : "#A3AAB8",
                        }}>
                          {s.type === "vip" ? "VIP" : s.type === "couple" ? "Đôi" : "Thường"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#F04452" }}>{(seatPrice(s.type) / 1000).toFixed(0)}K</span>
                        <button onClick={() => toggleSeat(s)} className="text-xs px-1.5 py-0.5 rounded hover:bg-white/10" style={{ color: "#737C8D" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#737C8D" }}>Số ghế</span>
                  <span>{selected.length} ghế</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#737C8D" }}>Định dạng</span>
                  <span>{showtime.format}</span>
                </div>
                <div className="h-px" style={{ backgroundColor: "#292F3D" }} />
                <div className="flex justify-between font-bold">
                  <span>Tạm tính</span>
                  <span style={{ color: "#F04452" }}>{formatVND(total)}</span>
                </div>
              </div>

              {/* Price per type */}
              <div className="p-3 rounded-xl mb-4 text-xs space-y-1" style={{ backgroundColor: "#191F2B" }}>
                <div className="flex justify-between"><span style={{ color: "#737C8D" }}>Ghế thường</span><span>{formatVND(showtime.price)}/ghế</span></div>
                <div className="flex justify-between"><span style={{ color: "#F5B942" }}>Ghế VIP</span><span>{formatVND(showtime.vipPrice)}/ghế</span></div>
                <div className="flex justify-between"><span style={{ color: "#63A5FF" }}>Ghế đôi</span><span>{formatVND(showtime.couplePrice)}/cặp</span></div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selected.length === 0}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity"
                style={{ backgroundColor: "#F04452", color: "#fff", opacity: selected.length === 0 ? 0.4 : 1 }}
              >
                Tiếp tục chọn bắp nước
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
