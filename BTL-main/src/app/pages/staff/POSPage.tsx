import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, CheckCircle, Printer, Film, Clock } from "lucide-react";

type POSStep = "movie" | "showtime" | "seats" | "food" | "payment" | "success";

const formatVND = (amount: number | undefined | null) => {
  if (!amount || isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const STEPS: { id: POSStep; label: string }[] = [
  { id: "movie", label: "Chọn phim" },
  { id: "showtime", label: "Suất chiếu" },
  { id: "seats", label: "Chọn ghế" },
  { id: "food", label: "Bắp nước" },
  { id: "payment", label: "Thanh toán" },
  { id: "success", label: "Hoàn tất" },
];

const PAY_METHODS = [
  { id: "cash", label: "Tiền mặt", icon: Banknote },
  { id: "card", label: "Thẻ máy POS", icon: CreditCard },
  { id: "qr", label: "QR tĩnh", icon: QrCode },
];

export default function POSPage() {
  const [step, setStep] = useState<POSStep>("movie");
  
  // Dữ liệu từ API
  const [movies, setMovies] = useState<any[]>([]);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  
  // State lựa chọn
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [foodCart, setFoodCart] = useState<{ item: any; qty: number }[]>([]);
  
  // Thanh toán
  const [payMethod, setPayMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  // Nạp dữ liệu khởi tạo
  useEffect(() => {
    fetch("http://localhost:5000/api/staff/pos/init")
      .then((res) => res.json())
      .then((data) => {
        setMovies(Array.isArray(data?.movies) ? data.movies : []);
        setFoodItems(Array.isArray(data?.foodItems) ? data.foodItems : []);
      })
      .catch((err) => {
        console.error("Lỗi nạp dữ liệu POS:", err);
        setMovies([]);
        setFoodItems([]);
      });
  }, []);

  // Hàm tính giá cho từng loại ghế
  const getSeatPrice = (seat: any, showtime: any) => {
    if (!showtime) return 0;
    const basePrice = Number(showtime.price) || 90000;
    const type = (seat.type || '').toLowerCase();
    if (type === 'vip') return Number(showtime.vip_price || showtime.vipPrice) || Math.round(basePrice * 1.25);
    if (type === 'couple') return Number(showtime.couple_price || showtime.couplePrice) || Math.round(basePrice * 2.0);
    return basePrice;
  };

  const handleSelectMovie = async (movie: any) => {
    setSelectedMovie(movie);
    const movieId = movie.movie_id || movie.id;
    try {
      const res = await fetch(`http://localhost:5000/api/staff/pos/showtimes/${movieId}`);
      const data = await res.json();
      setShowtimes(Array.isArray(data) ? data : []);
      setStep("showtime");
    } catch (err) {
      console.error("Lỗi lấy suất chiếu:", err);
      setShowtimes([]);
    }
  };

  const handleSelectShowtime = async (st: any) => {
    setSelectedShowtime(st);
    const showtimeId = st.id || st.showtime_id;
    try {
      const res = await fetch(`http://localhost:5000/api/staff/pos/seats/${showtimeId}`);
      const data = await res.json();
      setSeats(Array.isArray(data) ? data : []);
      setStep("seats");
    } catch (err) {
      console.error("Lỗi lấy sơ đồ ghế:", err);
      setSeats([]);
    }
  };

  // Tính toán tổng tiền
  const ticketTotal = selectedSeats.reduce((sum, s) => sum + getSeatPrice(s, selectedShowtime), 0);
  const foodTotal = foodCart.reduce((sum, c) => sum + (Number(c.item.price) || 0) * c.qty, 0);
  const total = ticketTotal + foodTotal;
  const change = payMethod === "cash" ? Math.max(0, Number(cashReceived) * 1000 - total) : 0;

  const toggleSeat = (seat: any) => {
    if (seat.status === "occupied") return;
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= 8) return prev;
      return [...prev, seat];
    });
  };

  const updateFood = (item: any, delta: number) => {
    setFoodCart((prev) => {
      const exists = prev.find((c) => c.item.id === item.id);
      if (!exists) return delta > 0 ? [...prev, { item, qty: 1 }] : prev;
      const newQty = exists.qty + delta;
      if (newQty <= 0) return prev.filter((c) => c.item.id !== item.id);
      return prev.map((c) => c.item.id === item.id ? { ...c, qty: newQty } : c);
    });
  };

  const handlePay = async () => {
    if (!selectedShowtime) return;
    setProcessing(true);
    try {
      const payload = {
        showtimeId: selectedShowtime.id || selectedShowtime.showtime_id,
        seats: selectedSeats.map((s) => ({
          id: s.id,
          price: getSeatPrice(s, selectedShowtime),
        })),
        food: foodCart.map((f) => ({
          id: f.item.id,
          qty: f.qty,
          price: f.item.price,
        })),
        totalAmount: total,
        payMethod: payMethod === "cash" ? "Tiền mặt" : payMethod === "card" ? "Thẻ POS" : "QR Tĩnh",
      };

      const res = await fetch("http://localhost:5000/api/staff/pos/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        setTransactionRef(result.transactionRef || `POS${Date.now()}`);
        setStep("success");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setStep("movie");
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSeats([]);
    setSelectedSeats([]);
    setFoodCart([]);
    setCashReceived("");
  };

  const rows = [...new Set(seats.map((s) => s.row || s.seat_row))];

  return (
    <div className="flex gap-6 p-6 h-[calc(100vh-80px)] overflow-hidden text-white bg-[#0B0D12]">
      {/* Cột chính */}
      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Progress Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const isDone = STEPS.findIndex((x) => x.id === step) > i;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <div
                  className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                  onClick={() => isDone && setStep(s.id)}
                  style={{
                    backgroundColor: isCurrent ? "#F04452" : isDone ? "rgba(53,201,138,0.15)" : "#191F2B",
                    color: isCurrent ? "#fff" : isDone ? "#35C98A" : "#737C8D",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full text-center flex items-center justify-center"
                    style={{ backgroundColor: isCurrent ? "rgba(255,255,255,0.2)" : "transparent" }}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={13} style={{ color: "#292F3D" }} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Movie */}
        {step === "movie" && (
          <div>
            <h2 className="font-bold text-base mb-4">Chọn phim</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(movies || []).map((m) => {
                const movieId = m.movie_id || m.id;
                const isSelected = selectedMovie && (selectedMovie.movie_id === movieId || selectedMovie.id === movieId);
                return (
                  <div
                    key={movieId}
                    onClick={() => handleSelectMovie(m)}
                    className="flex gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-[#F04452]"
                    style={{
                      backgroundColor: isSelected ? "rgba(240,68,82,0.08)" : "#121620",
                      borderColor: isSelected ? "#F04452" : "#292F3D",
                    }}
                  >
                    <img
                      src={m.poster_url || m.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300"}
                      alt=""
                      className="w-12 rounded-lg object-cover shrink-0"
                      style={{ backgroundColor: "#191F2B", aspectRatio: "2/3" }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold line-clamp-2">{m.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{m.genre || "2D Digital"} · {m.duration || 120} phút</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Showtime */}
        {step === "showtime" && (
          <div>
            <h2 className="font-bold text-base mb-4">Chọn suất chiếu – {selectedMovie?.title}</h2>
            {showtimes.length === 0 ? (
              <p style={{ color: "#737C8D" }}>Không có suất chiếu nào cho phim này</p>
            ) : (
              <div className="space-y-3">
                {showtimes.map((st) => {
                  const stId = st.id || st.showtime_id;
                  const isSelected = selectedShowtime && (selectedShowtime.id === stId || selectedShowtime.showtime_id === stId);
                  const timeDisplay = st.start_time ? new Date(st.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "19:00";
                  return (
                    <div
                      key={stId}
                      onClick={() => handleSelectShowtime(st)}
                      className="p-4 rounded-xl border cursor-pointer transition-colors hover:border-[#F04452]"
                      style={{
                        backgroundColor: isSelected ? "rgba(240,68,82,0.08)" : "#121620",
                        borderColor: isSelected ? "#F04452" : "#292F3D",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{timeDisplay}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>
                            {st.cinema_name || "CINEVERSE Vincom"} · {st.auditorium_name || st.room_name || "Phòng 1"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold" style={{ color: "#F04452" }}>
                            {formatVND(st.price || 90000)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Seats */}
        {step === "seats" && (
          <div>
            <h2 className="font-bold text-base mb-4">Chọn ghế</h2>
            <div className="text-center mb-4">
              <div className="h-1 rounded-full mx-16 mb-1" style={{ background: "linear-gradient(to right, transparent, #63A5FF, transparent)" }} />
              <p className="text-xs" style={{ color: "#63A5FF" }}>MÀN ẢNH</p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-max mx-auto space-y-1.5">
                {rows.map((row, rIdx) => {
                  const rowSeats = seats.filter((s) => (s.row || s.seat_row) === row);
                  return (
                    <div key={`row-${row}-${rIdx}`} className="flex items-center gap-1 justify-center">
                      <span className="w-5 text-xs text-center shrink-0" style={{ color: "#737C8D" }}>{row}</span>
                      {rowSeats.map((seat) => {
                        const sel = selectedSeats.some((s) => s.id === seat.id);
                        const isVip = (seat.type || '').toLowerCase() === 'vip';
                        const isCouple = (seat.type || '').toLowerCase() === 'couple';
                        return (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat)}
                            className={`w-7 h-6 rounded-t-lg text-xs font-semibold ${isCouple ? "w-12" : ""}`}
                            style={{
                              backgroundColor: sel ? "#F04452" : seat.status === "occupied" ? "#292F3D" : "#191F2B",
                              border: `1px solid ${sel ? "#F04452" : seat.status === "occupied" ? "#292F3D" : isVip ? "#F5B942" : isCouple ? "#63A5FF" : "#292F3D"}`,
                              color: sel ? "#fff" : seat.status === "occupied" ? "#3a4050" : "#A3AAB8",
                              cursor: seat.status === "occupied" ? "not-allowed" : "pointer",
                            }}
                          >
                            {seat.number || seat.seat_number}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStep("food")}
                disabled={selectedSeats.length === 0}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ backgroundColor: "#F04452", color: "#fff", opacity: selectedSeats.length === 0 ? 0.4 : 1 }}
              >
                Tiếp tục ({selectedSeats.length} ghế)
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Food */}
        {step === "food" && (
          <div>
            <h2 className="font-bold text-base mb-4">Thêm bắp nước (Tùy chọn)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {foodItems.map((item) => {
                const qty = foodCart.find((c) => c.item.id === item.id)?.qty ?? 0;
                return (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl border" style={{ backgroundColor: "#121620", borderColor: qty > 0 ? "#F04452" : "#292F3D" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs" style={{ color: "#F04452" }}>{formatVND(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {qty > 0 && (
                        <button onClick={() => updateFood(item, -1)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                          <Minus size={12} />
                        </button>
                      )}
                      {qty > 0 && <span className="text-sm font-bold w-4 text-center">{qty}</span>}
                      <button onClick={() => updateFood(item, 1)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer" style={{ backgroundColor: "#F04452" }}>
                        <Plus size={12} className="text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setStep("payment")} className="px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                Chuyển sang Thanh toán
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="font-bold text-base">Phương thức thanh toán</h2>
            <div className="grid grid-cols-3 gap-3">
              {PAY_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPayMethod(id)}
                  className="p-4 rounded-xl border flex flex-col items-center gap-2 text-sm font-semibold cursor-pointer"
                  style={{
                    backgroundColor: payMethod === id ? "rgba(240,68,82,0.08)" : "#191F2B",
                    borderColor: payMethod === id ? "#F04452" : "#292F3D",
                    color: payMethod === id ? "#F04452" : "#A3AAB8",
                  }}
                >
                  <Icon size={24} />
                  {label}
                </button>
              ))}
            </div>

            {payMethod === "cash" && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <label className="block text-sm font-medium mb-2">Số tiền nhận (nghìn đồng)</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="VD: 500"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}
                />
                {cashReceived && Number(cashReceived) * 1000 >= total && (
                  <p className="text-sm mt-2 font-bold" style={{ color: "#35C98A" }}>Tiền thối: {formatVND(change)}</p>
                )}
              </div>
            )}

            {payMethod === "qr" && (
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <p className="text-sm mb-3 text-gray-400">Mã QR chuyển khoản ngân hàng</p>
                <div className="w-32 h-32 mx-auto rounded-xl flex items-center justify-center bg-white p-2">
                  <QrCode size={90} className="text-black" />
                </div>
                <p className="text-xs mt-3 text-gray-400">Khách quét mã xong bấm Xác nhận bên dưới</p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={processing || (payMethod === "cash" && Number(cashReceived) * 1000 < total)}
              className="w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#F04452",
                color: "#fff",
                opacity: processing || (payMethod === "cash" && Number(cashReceived) * 1000 < total) ? 0.6 : 1,
              }}
            >
              {processing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size={16} /> Xác nhận thanh toán {formatVND(total)}
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 6: Success */}
        {step === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 space-y-3">
            <CheckCircle size={50} className="mx-auto text-emerald-400" />
            <h2 className="text-xl font-bold">Giao dịch thành công!</h2>
            <p className="text-sm text-gray-400">Mã đơn POS: <span className="text-white font-mono font-bold">{transactionRef}</span></p>
            <p className="text-sm text-gray-400">Tổng thanh toán: <span className="text-[#F04452] font-bold">{formatVND(total)}</span></p>
            <div className="flex justify-center gap-3 pt-4">
              <button onClick={handleReset} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#F04452] text-white cursor-pointer flex items-center gap-2 mx-auto">
                <Film size={16} /> Giao dịch mới
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Cột Hóa đơn Sidebar */}
      <div className="w-72 shrink-0 overflow-y-auto">
        <div className="rounded-2xl p-4 sticky top-0" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
          <h3 className="font-bold text-sm mb-3">Đơn hàng hiện tại</h3>
          {selectedMovie && (
            <div className="flex gap-2 mb-3 p-2 rounded-lg" style={{ backgroundColor: "#191F2B" }}>
              <img src={selectedMovie.poster_url || selectedMovie.poster} alt="" className="w-8 h-11 rounded object-cover shrink-0" style={{ backgroundColor: "#292F3D" }} />
              <div className="min-w-0">
                <p className="text-xs font-semibold line-clamp-2">{selectedMovie.title}</p>
                {selectedShowtime && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    <Clock size={10} className="inline mr-1" />
                    {selectedShowtime.start_time ? new Date(selectedShowtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "19:00"}
                  </p>
                )}
              </div>
            </div>
          )}
          {selectedSeats.length > 0 && (
            <div className="mb-3 border-t pt-2" style={{ borderColor: "#292F3D" }}>
              <p className="text-xs font-semibold mb-1 text-gray-400">Ghế đã chọn ({selectedSeats.length})</p>
              {selectedSeats.map((s) => (
                <div key={s.id} className="flex justify-between text-xs py-0.5 text-gray-300">
                  <span>Ghế {s.row || s.seat_row}{s.number || s.seat_number}</span>
                  <span>{formatVND(getSeatPrice(s, selectedShowtime))}</span>
                </div>
              ))}
            </div>
          )}
          {foodCart.length > 0 && (
            <div className="mb-3 border-t pt-2" style={{ borderColor: "#292F3D" }}>
              <p className="text-xs font-semibold mb-1 text-gray-400">Bắp nước</p>
              {foodCart.map((c) => (
                <div key={c.item.id} className="flex justify-between text-xs py-0.5 text-gray-300">
                  <span>{c.item.name} x{c.qty}</span>
                  <span>{formatVND((c.item.price || 0) * c.qty)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-3 space-y-1" style={{ borderColor: "#292F3D" }}>
            {ticketTotal > 0 && <div className="flex justify-between text-xs text-gray-400"><span>Tiền vé</span><span>{formatVND(ticketTotal)}</span></div>}
            {foodTotal > 0 && <div className="flex justify-between text-xs text-gray-400"><span>Bắp nước</span><span>{formatVND(foodTotal)}</span></div>}
            <div className="flex justify-between font-bold text-sm pt-2 border-t mt-2" style={{ borderColor: "#292F3D" }}>
              <span>Tổng cộng</span>
              <span style={{ color: "#F04452" }}>{formatVND(total)}</span>
            </div>
          </div>
          {total > 0 && step !== "success" && (
            <button onClick={handleReset} className="w-full mt-3 flex items-center justify-center gap-1 py-2 rounded-xl text-xs text-gray-400 border border-[#292F3D] cursor-pointer">
              <Trash2 size={12} /> Hủy đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}