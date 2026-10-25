import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, CheckCircle, Printer, Film, Clock } from "lucide-react";
import { movies, cinemas, showtimes, foodItems, generateSeats, formatVND, type Seat, type FoodItem } from "../../data/mockData";

type POSStep = "movie" | "showtime" | "seats" | "food" | "payment" | "success";

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
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [foodCart, setFoodCart] = useState<{ item: FoodItem; qty: number }[]>([]);
  const [payMethod, setPayMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionRef] = useState(`POS${Date.now().toString().slice(-8)}`);

  const nowShowing = movies.filter((m) => m.status === "now_showing");
  const movieShowtimes = selectedMovie ? showtimes.filter((s) => s.movieId === selectedMovie) : [];
  const selectedST = showtimes.find((s) => s.id === selectedShowtime);
  const selectedM = movies.find((m) => m.id === selectedMovie);
  const selectedCinema = selectedST ? cinemas.find((c) => c.id === selectedST.cinemaId) : null;

  const ticketTotal = selectedSeats.reduce((sum, s) => {
    if (!selectedST) return sum;
    return sum + (s.type === "vip" ? selectedST.vipPrice : s.type === "couple" ? selectedST.couplePrice : selectedST.price);
  }, 0);
  const foodTotal = foodCart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const total = ticketTotal + foodTotal;
  const change = payMethod === "cash" ? Math.max(0, Number(cashReceived) * 1000 - total) : 0;

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "occupied") return;
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= 8) return prev;
      return [...prev, seat];
    });
  };

  const updateFood = (item: FoodItem, delta: number) => {
    setFoodCart((prev) => {
      const exists = prev.find((c) => c.item.id === item.id);
      if (!exists) return delta > 0 ? [...prev, { item, qty: 1 }] : prev;
      const newQty = exists.qty + delta;
      if (newQty <= 0) return prev.filter((c) => c.item.id !== item.id);
      return prev.map((c) => c.item.id === item.id ? { ...c, qty: newQty } : c);
    });
  };

  const goToStep = (s: POSStep) => {
    if (s === "seats" && selectedShowtime) setSeats(generateSeats(selectedST?.auditoriumId ?? "a1"));
    setStep(s);
  };

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setStep("success");
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

  const rows = [...new Set(seats.map((s) => s.row))];

  return (
    <div className="flex gap-6 h-[calc(100vh-112px)] overflow-hidden" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Progress */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const isDone = STEPS.findIndex((x) => x.id === step) > i;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: isCurrent ? "#F04452" : isDone ? "rgba(53,201,138,0.15)" : "#191F2B", color: isCurrent ? "#fff" : isDone ? "#35C98A" : "#737C8D" }}>
                  <span className="w-4 h-4 rounded-full text-center text-xs flex items-center justify-center" style={{ backgroundColor: isCurrent ? "rgba(255,255,255,0.2)" : "transparent" }}>{i + 1}</span>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={13} style={{ color: "#292F3D" }} />}
              </div>
            );
          })}
        </div>

        {/* Step: Movie */}
        {step === "movie" && (
          <div>
            <h2 className="font-bold text-base mb-4">Chọn phim</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {nowShowing.map((m) => (
                <div
                  key={m.id}
                  onClick={() => { setSelectedMovie(m.id); goToStep("showtime"); }}
                  className="flex gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-[#F04452]"
                  style={{ backgroundColor: selectedMovie === m.id ? "rgba(240,68,82,0.08)" : "#121620", borderColor: selectedMovie === m.id ? "#F04452" : "#292F3D" }}
                >
                  <img src={m.poster} alt="" className="w-12 rounded-lg object-cover shrink-0" style={{ backgroundColor: "#191F2B", aspectRatio: "2/3" }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold line-clamp-2">{m.title}</p>
                    <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{m.genre[0]} · {m.ageRating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step: Showtime */}
        {step === "showtime" && (
          <div>
            <h2 className="font-bold text-base mb-4">Chọn suất chiếu – {selectedM?.title}</h2>
            {movieShowtimes.length === 0 ? (
              <p style={{ color: "#737C8D" }}>Không có suất chiếu</p>
            ) : (
              <div className="space-y-3">
                {movieShowtimes.map((st) => {
                  const c = cinemas.find((ci) => ci.id === st.cinemaId)!;
                  const aud = c.auditoriums.find((a) => a.id === st.auditoriumId)!;
                  return (
                    <div
                      key={st.id}
                      onClick={() => { setSelectedShowtime(st.id); goToStep("seats"); }}
                      className="p-4 rounded-xl border cursor-pointer transition-colors hover:border-[#F04452]"
                      style={{ backgroundColor: "#121620", borderColor: selectedShowtime === st.id ? "#F04452" : "#292F3D" }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{st.startTime}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{c.name} · {aud.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold mr-2" style={{ backgroundColor: "#191F2B", color: "#63A5FF" }}>{st.format}</span>
                          <span className="text-sm font-bold" style={{ color: "#F04452" }}>{(st.price / 1000).toFixed(0)}K₫</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.round((1 - st.availableSeats / st.totalSeats) * 100)}%`, backgroundColor: "#35C98A" }} />
                        </div>
                        <span className="text-xs" style={{ color: "#737C8D" }}>{st.availableSeats} ghế trống</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step: Seats */}
        {step === "seats" && (
          <div>
            <h2 className="font-bold text-base mb-4">Chọn ghế</h2>
            <div className="text-center mb-4">
              <div className="h-1 rounded-full mx-16 mb-1" style={{ background: "linear-gradient(to right, transparent, #63A5FF, transparent)" }} />
              <p className="text-xs" style={{ color: "#63A5FF" }}>MÀN ẢNH</p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-max mx-auto space-y-1.5">
                {rows.map((row) => {
                  const rowSeats = seats.filter((s) => s.row === row);
                  return (
                    <div key={row} className="flex items-center gap-1 justify-center">
                      <span className="w-5 text-xs text-center shrink-0" style={{ color: "#737C8D" }}>{row}</span>
                      {rowSeats.map((seat) => {
                        const sel = selectedSeats.some((s) => s.id === seat.id);
                        return (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat)}
                            className={`w-7 h-6 rounded-t-lg text-xs font-semibold ${seat.type === "couple" ? "w-12" : ""}`}
                            style={{
                              backgroundColor: sel ? "#F04452" : seat.status === "occupied" ? "#292F3D" : seat.type === "vip" ? "#191F2B" : "#191F2B",
                              border: `1px solid ${sel ? "#F04452" : seat.status === "occupied" ? "#292F3D" : seat.type === "vip" ? "#F5B942" : seat.type === "couple" ? "#63A5FF" : "#292F3D"}`,
                              color: sel ? "#fff" : seat.status === "occupied" ? "#3a4050" : "#A3AAB8",
                              cursor: seat.status === "occupied" ? "not-allowed" : "pointer",
                            }}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs" style={{ color: "#A3AAB8" }}>
              {[["#191F2B", "#292F3D", "Thường"], ["#191F2B", "#F5B942", "VIP"], ["#191F2B", "#63A5FF", "Đôi"], ["#F04452", "#F04452", "Đã chọn"], ["#292F3D", "#292F3D", "Đã bán"]].map(([bg, border, label]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-4 h-3.5 rounded-t" style={{ backgroundColor: bg as string, border: `1px solid ${border}` }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => goToStep("food")} disabled={selectedSeats.length === 0} className="px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff", opacity: selectedSeats.length === 0 ? 0.4 : 1 }}>
                Tiếp tục ({selectedSeats.length} ghế)
              </button>
            </div>
          </div>
        )}

        {/* Step: Food */}
        {step === "food" && (
          <div>
            <h2 className="font-bold text-base mb-4">Thêm bắp nước (tùy chọn)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {foodItems.slice(0, 8).map((item) => {
                const qty = foodCart.find((c) => c.item.id === item.id)?.qty ?? 0;
                return (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl border" style={{ backgroundColor: "#121620", borderColor: qty > 0 ? "#F04452" : "#292F3D" }}>
                    <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" style={{ backgroundColor: "#191F2B" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs" style={{ color: "#F04452" }}>{formatVND(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {qty > 0 && <button onClick={() => updateFood(item, -1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}><Minus size={12} /></button>}
                      {qty > 0 && <span className="text-sm font-bold w-4 text-center">{qty}</span>}
                      <button onClick={() => updateFood(item, 1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#F04452" }}><Plus size={12} className="text-white" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => goToStep("payment")} className="px-4 py-2 text-sm" style={{ color: "#737C8D" }}>Bỏ qua</button>
              <button onClick={() => goToStep("payment")} className="px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff" }}>Tiếp tục</button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="font-bold text-base">Chọn phương thức thanh toán</h2>
            <div className="grid grid-cols-3 gap-3">
              {PAY_METHODS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setPayMethod(id)} className="p-4 rounded-xl border flex flex-col items-center gap-2 text-sm font-semibold transition-colors" style={{ backgroundColor: payMethod === id ? "rgba(240,68,82,0.08)" : "#191F2B", borderColor: payMethod === id ? "#F04452" : "#292F3D", color: payMethod === id ? "#F04452" : "#A3AAB8" }}>
                  <Icon size={24} />
                  {label}
                </button>
              ))}
            </div>
            {payMethod === "cash" && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <label className="block text-sm font-medium mb-2">Số tiền nhận (nghìn đồng)</label>
                <input type="number" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} placeholder="VD: 500" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }} />
                {cashReceived && Number(cashReceived) * 1000 >= total && (
                  <p className="text-sm mt-2 font-bold" style={{ color: "#35C98A" }}>Tiền thối: {formatVND(change)}</p>
                )}
              </div>
            )}
            {payMethod === "qr" && (
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <p className="text-sm mb-3" style={{ color: "#737C8D" }}>Mã QR tĩnh thanh toán</p>
                <div className="w-32 h-32 mx-auto rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff" }}>
                  <QrCode size={80} style={{ color: "#0B0D12" }} />
                </div>
                <p className="text-xs mt-3" style={{ color: "#737C8D" }}>Sau khi khách hàng thanh toán, xác nhận bên dưới</p>
              </div>
            )}
            <button
              onClick={handlePay}
              disabled={processing || (payMethod === "cash" && Number(cashReceived) * 1000 < total)}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: "#F04452", color: "#fff", opacity: processing || (payMethod === "cash" && Number(cashReceived) * 1000 < total) ? 0.6 : 1 }}
            >
              {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CreditCard size={16} />Xác nhận thanh toán {formatVND(total)}</>}
            </button>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(53,201,138,0.15)" }}>
              <CheckCircle size={40} style={{ color: "#35C98A" }} />
            </div>
            <h2 className="text-xl font-bold mb-2">Giao dịch thành công!</h2>
            <p className="text-sm mb-1" style={{ color: "#737C8D" }}>Mã giao dịch: <span className="font-mono font-bold" style={{ color: "#F5F5F7" }}>{transactionRef}</span></p>
            <p className="text-sm mb-6" style={{ color: "#737C8D" }}>Tổng: <span className="font-bold" style={{ color: "#F04452" }}>{formatVND(total)}</span></p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
                <Printer size={15} /> In vé
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                <Film size={15} /> Giao dịch mới
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-72 shrink-0 overflow-y-auto">
        <div className="rounded-2xl p-4 sticky top-0" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
          <h3 className="font-bold text-sm mb-3">Đơn hàng hiện tại</h3>
          {selectedM && (
            <div className="flex gap-2 mb-3 p-2 rounded-lg" style={{ backgroundColor: "#191F2B" }}>
              <img src={selectedM.poster} alt="" className="w-8 h-11 rounded object-cover shrink-0" style={{ backgroundColor: "#292F3D", aspectRatio: "2/3" }} />
              <div className="min-w-0">
                <p className="text-xs font-semibold line-clamp-2">{selectedM.title}</p>
                {selectedST && <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}><Clock size={10} className="inline mr-1" />{selectedST.startTime} · {selectedST.format}</p>}
              </div>
            </div>
          )}
          {selectedSeats.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Ghế đã chọn</p>
              {selectedSeats.map((s) => (
                <div key={s.id} className="flex justify-between text-xs py-1">
                  <span style={{ color: "#A3AAB8" }}>Ghế {s.row}{s.number} ({s.type === "vip" ? "VIP" : s.type === "couple" ? "Đôi" : "Thường"})</span>
                  <span>{selectedST ? formatVND(s.type === "vip" ? selectedST.vipPrice : s.type === "couple" ? selectedST.couplePrice : selectedST.price) : "–"}</span>
                </div>
              ))}
            </div>
          )}
          {foodCart.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#737C8D" }}>Bắp nước</p>
              {foodCart.map((c) => (
                <div key={c.item.id} className="flex justify-between text-xs py-1">
                  <span style={{ color: "#A3AAB8" }}>{c.item.name} ×{c.qty}</span>
                  <span>{formatVND(c.item.price * c.qty)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-3 space-y-1.5" style={{ borderColor: "#292F3D" }}>
            {ticketTotal > 0 && <div className="flex justify-between text-xs"><span style={{ color: "#737C8D" }}>Vé</span><span>{formatVND(ticketTotal)}</span></div>}
            {foodTotal > 0 && <div className="flex justify-between text-xs"><span style={{ color: "#737C8D" }}>Bắp nước</span><span>{formatVND(foodTotal)}</span></div>}
            <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2" style={{ borderColor: "#292F3D" }}>
              <span>Tổng cộng</span>
              <span style={{ color: "#F04452" }}>{formatVND(total)}</span>
            </div>
          </div>
          {total > 0 && step !== "success" && (
            <button onClick={handleReset} className="w-full mt-3 flex items-center justify-center gap-1 py-2 rounded-xl text-xs" style={{ color: "#737C8D", border: "1px solid #292F3D" }}>
              <Trash2 size={12} /> Xóa đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
