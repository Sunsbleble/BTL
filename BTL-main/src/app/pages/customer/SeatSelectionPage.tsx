import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Info, AlertCircle } from "lucide-react";
import { formatVND, type Seat } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function SeatSelectionPage() {
  const { booking, setBookingSeats, navigate, goBack } = useApp();
  const { showtime, movieTitle, cinemaName, auditoriumName, moviePoster } = booking;
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const MAX_SEATS = 10;

  // 1. Gọi API Backend lấy danh sách ghế thật theo showtime.id
  useEffect(() => {
    if (!showtime?.id) return;

    const fetchSeatsFromAPI = async () => {
      try {
        setIsLoading(true);
        // Loại bỏ ký tự chữ 's' nếu có để lấy đúng ID nguyên
        const cleanShowtimeId = String(showtime.id).replace(/\D/g, "") || "1";
        const res = await fetch(`http://localhost:5000/api/showtimes/${cleanShowtimeId}/seats`);
        if (!res.ok) throw new Error("Lỗi khi tải sơ đồ ghế");

        const rawSeats = await res.json();

        // Chuẩn hóa linh hoạt các thuộc tính trả về từ MySQL / Server
        const formattedSeats: Seat[] = rawSeats.map((s: any) => {
          let type: Seat["type"] = "standard";
          const typeStr = String(s.seat_type || s.type || "").toLowerCase();
          
          if (typeStr.includes("vip")) {
            type = "vip";
          } else if (typeStr.includes("couple") || typeStr.includes("đôi") || typeStr.includes("sweetbox")) {
            type = "couple";
          }

          const seatRow = String(s.seat_row || s.row || "A").toUpperCase();
          const seatNum = Number(s.seat_number || s.number) || 1;
          const seatId = String(s.seat_id || s.id || `${seatRow}${seatNum}`);
          const isBooked = Boolean(s.is_booked) || s.booking_status === "booked" || s.status === "booked" || s.status === "occupied";

          return {
            id: seatId,
            row: seatRow,
            number: seatNum,
            type: type,
            status: isBooked ? "occupied" : "available",
            price: 0,
          };
        });

        setSeats(formattedSeats);
      } catch (error) {
        console.error("Lỗi tải danh sách ghế:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatsFromAPI();
  }, [showtime?.id]);

  if (!showtime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white">
        <AlertCircle size={48} className="text-gray-500" />
        <p className="text-gray-400">Vui lòng chọn suất chiếu trước.</p>
        <button onClick={() => navigate("home")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#F04452] text-white cursor-pointer">
          Về trang chủ
        </button>
      </div>
    );
  }

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "unavailable") return;

    // Tính đúng giá tiền cho loại ghế được chọn
    const computedPrice = seatPrice(seat.type);

    setSelected((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= MAX_SEATS) return prev;

      // Gán thuộc tính price thực tế vào object ghế
      return [...prev, { ...seat, price: computedPrice, status: "selected" }];
    });
  };

  const isSelected = (seat: Seat) => selected.some((s) => s.id === seat.id);

  // Tính giá ghế dựa theo loại ghế
  const seatPrice = (type: Seat["type"]) => {
    if (!showtime) return 0;
    const basePrice = Number(showtime.price) || 85000;
    if (type === "vip") return showtime.vipPrice || basePrice + 20000;
    if (type === "couple") return showtime.couplePrice || basePrice * 2;
    return basePrice;
  };

  const total = selected.reduce((sum, s) => sum + seatPrice(s.type), 0);
  const rows = [...new Set(seats.map((s) => s.row))];

  const handleContinue = () => {
    setBookingSeats(selected);
    navigate("food");
  };

  // Bảng màu chuẩn rạp CGV (Nền rực rỡ phân biệt rõ)
  const SEAT_COLORS = {
    standard: { bg: "#3D414D", border: "#525766", text: "#E2E8F0" },    // Xám Taupe
    vip: { bg: "#8C1D2A", border: "#B82536", text: "#FFFFFF" },         // Đỏ Burgundy CGV
    couple: { bg: "#B81969", border: "#E02B82", text: "#FFFFFF" },      // Hồng Sweetbox CGV
    selected: { bg: "#F04452", border: "#FF6B7A", text: "#FFFFFF" },    // Đỏ tươi khi chọn
    occupied: { bg: "#1A1D24", border: "#2A2E39", text: "#4A5060" },    // Đã đặt
  };

  const getSeatStyle = (seat: Seat): React.CSSProperties => {
    if (isSelected(seat)) {
      return {
        backgroundColor: SEAT_COLORS.selected.bg,
        border: `1px solid ${SEAT_COLORS.selected.border}`,
        color: SEAT_COLORS.selected.text,
        boxShadow: "0 0 10px rgba(240, 68, 82, 0.6)",
      };
    }

    if (seat.status === "occupied") {
      return {
        backgroundColor: SEAT_COLORS.occupied.bg,
        border: `1px solid ${SEAT_COLORS.occupied.border}`,
        color: SEAT_COLORS.occupied.text,
        cursor: "not-allowed",
      };
    }

    if (seat.type === "vip") {
      return {
        backgroundColor: SEAT_COLORS.vip.bg,
        border: `1px solid ${SEAT_COLORS.vip.border}`,
        color: SEAT_COLORS.vip.text,
      };
    }

    if (seat.type === "couple") {
      return {
        backgroundColor: SEAT_COLORS.couple.bg,
        border: `1px solid ${SEAT_COLORS.couple.border}`,
        color: SEAT_COLORS.couple.text,
      };
    }

    return {
      backgroundColor: SEAT_COLORS.standard.bg,
      border: `1px solid ${SEAT_COLORS.standard.border}`,
      color: SEAT_COLORS.standard.text,
    };
  };

  return (
    <div className="text-white" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", minHeight: "100vh" }}>
      {/* Progress */}
      <div className="border-b px-4 py-3 bg-[#121620] border-[#292F3D]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {["Phim", "Suất chiếu", "Chọn ghế", "Bắp nước", "Thanh toán"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className={i === 2 ? "font-semibold text-white" : i < 2 ? "text-[#35C98A]" : "text-gray-500"}>
                  {step}
                </span>
                {i < 4 && <span>›</span>}
              </span>
            ))}
          </div>
          <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white cursor-pointer">
            <ChevronLeft size={15} /> Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        {/* Booking Summary */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-[#121620] border border-[#292F3D]">
          <img src={moviePoster} alt="" className="w-12 h-16 rounded-lg object-cover shrink-0 bg-[#191F2B]" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{movieTitle}</p>
            <p className="text-xs mt-0.5 truncate text-gray-400">{cinemaName}</p>
            <p className="text-xs mt-0.5 text-gray-300">
              {auditoriumName} · {showtime.date} · {showtime.startTime} – {showtime.endTime} · {showtime.format}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Seat Map */}
          <div>
            {/* Screen */}
            <div className="text-center mb-8">
              <div className="relative mx-auto max-w-[600px]">
                <div className="h-1 rounded-full mx-8 mb-1 bg-gradient-to-r from-transparent via-[#63A5FF] to-transparent shadow-[0_0_20px_rgba(99,165,255,0.4)]" />
                <p className="text-xs text-[#63A5FF] tracking-[0.2em] font-semibold">MÀN ẢNH</p>
              </div>
            </div>

            {/* Loading Indicator or Seats Grid */}
            {isLoading ? (
              <div className="py-16 text-center text-sm text-gray-400">
                Đang tải sơ đồ ghế từ cơ sở dữ liệu...
              </div>
            ) : (
              <div className="overflow-x-auto pb-4">
                <div className="min-w-max mx-auto max-w-[750px]">
                  {rows.map((row) => {
                    const rowSeats = seats.filter((s) => s.row === row);
                    return (
                      <div key={row} className="flex items-center gap-1.5 mb-1.5 justify-center">
                        <span className="w-6 text-xs font-semibold text-center shrink-0 text-gray-400">{row}</span>
                        <div className="flex gap-1 flex-wrap justify-center">
                          {rowSeats.map((seat) => {
                            const w = seat.type === "couple" ? "w-12 md:w-14" : "w-8 md:w-9";
                            return (
                              <motion.button
                                key={seat.id}
                                whileHover={seat.status !== "occupied" ? { scale: 1.1 } : undefined}
                                whileTap={seat.status !== "occupied" ? { scale: 0.95 } : undefined}
                                onClick={() => toggleSeat(seat)}
                                className={`${w} h-7 md:h-8 rounded-lg text-xs font-semibold relative cursor-pointer transition-all`}
                                style={getSeatStyle(seat)}
                                title={`${seat.row}${seat.number} · ${seat.type === "vip" ? "VIP" : seat.type === "couple" ? "Đôi" : "Thường"} · ${formatVND(seatPrice(seat.type))}`}
                              >
                                {seat.number}
                                {isSelected(seat) && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#35C98A] border border-black"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                        <span className="w-6 text-xs font-semibold text-center shrink-0 text-gray-400">{row}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chú thích loại ghế */}
            <div className="flex flex-wrap items-center justify-center gap-5 mt-6 text-xs text-gray-300">
              {[
                { label: "Ghế thường", bg: SEAT_COLORS.standard.bg, border: SEAT_COLORS.standard.border },
                { label: "VIP", bg: SEAT_COLORS.vip.bg, border: SEAT_COLORS.vip.border },
                { label: "Ghế đôi", bg: SEAT_COLORS.couple.bg, border: SEAT_COLORS.couple.border },
                { label: "Đã chọn", bg: SEAT_COLORS.selected.bg, border: SEAT_COLORS.selected.border },
                { label: "Đã đặt", bg: SEAT_COLORS.occupied.bg, border: SEAT_COLORS.occupied.border },
              ].map(({ label, bg, border }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-5 h-4 rounded-md" style={{ backgroundColor: bg, border: `1px solid ${border}` }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Panel */}
          <div>
            <div className="rounded-2xl p-5 sticky top-24 bg-[#121620] border border-[#292F3D]">
              <h3 className="font-bold text-base mb-4">Ghế đã chọn</h3>

              {selected.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[#191F2B]">
                    <Info size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">Chọn ghế trên sơ đồ để đặt vé</p>
                  <p className="text-xs mt-1 text-gray-500">Tối đa {MAX_SEATS} ghế / giao dịch</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {selected.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#292F3D] text-sm">
                      <div>
                        <span className="font-semibold">{s.row}{s.number}</span>
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{
                          backgroundColor: s.type === "vip" ? "rgba(184,37,54,0.3)" : s.type === "couple" ? "rgba(184,25,105,0.3)" : "#191F2B",
                          color: s.type === "vip" ? "#FF8591" : s.type === "couple" ? "#FF85C0" : "#A3AAB8",
                        }}>
                          {s.type === "vip" ? "VIP" : s.type === "couple" ? "Đôi" : "Thường"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#F04452] font-semibold">{(seatPrice(s.type) / 1000).toFixed(0)}K</span>
                        <button onClick={() => toggleSeat(s)} className="text-xs px-1.5 py-0.5 rounded text-gray-400 hover:bg-white/10 cursor-pointer">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Số ghế</span>
                  <span>{selected.length} ghế</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Định dạng</span>
                  <span>{showtime.format}</span>
                </div>
                <div className="h-px bg-[#292F3D]" />
                <div className="flex justify-between font-bold">
                  <span>Tạm tính</span>
                  <span className="text-[#F04452]">{formatVND(total)}</span>
                </div>
              </div>

              {/* Bảng giá theo loại ghế */}
              <div className="p-3 rounded-xl mb-4 text-xs space-y-1.5 bg-[#191F2B]">
                <div className="flex justify-between"><span className="text-gray-400">Ghế thường</span><span>{formatVND(seatPrice("standard"))}/ghế</span></div>
                <div className="flex justify-between"><span className="text-[#FF8591]">Ghế VIP</span><span>{formatVND(seatPrice("vip"))}/ghế</span></div>
                <div className="flex justify-between"><span className="text-[#FF85C0]">Ghế đôi</span><span>{formatVND(seatPrice("couple"))}/cặp</span></div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selected.length === 0}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity cursor-pointer bg-[#F04452] text-white"
                style={{ opacity: selected.length === 0 ? 0.4 : 1 }}
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