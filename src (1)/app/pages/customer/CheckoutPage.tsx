import { useState } from "react";
import { ChevronLeft, Tag, Coins, CreditCard, Building2, Wallet, QrCode, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { formatVND, promotions } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

const PAYMENT_METHODS = [
  { id: "vnpay", label: "VNPay", icon: QrCode, desc: "Thanh toán qua QR VNPay" },
  { id: "momo", label: "MoMo", icon: Wallet, desc: "Ví điện tử MoMo" },
  { id: "card", label: "Thẻ quốc tế", icon: CreditCard, desc: "Visa / Mastercard / JCB" },
  { id: "atm", label: "Thẻ ATM", icon: Building2, desc: "Thẻ ngân hàng nội địa" },
];

type PaymentState = "idle" | "processing" | "success" | "failed";

export default function CheckoutPage() {
  const { booking, setVoucher, setPointsRedeemed, navigate, goBack, user } = useApp();
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(booking.voucherDiscount > 0);
  const [pointsInput, setPointsInput] = useState(0);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const { selectedSeats, foodItems, showtime, movieTitle, cinemaName, auditoriumName, voucher, voucherDiscount, pointsRedeemed } = booking;

  const ticketTotal = selectedSeats.reduce((sum, s) => {
    if (!showtime) return sum;
    return sum + (s.type === "vip" ? showtime.vipPrice : s.type === "couple" ? showtime.couplePrice : showtime.price);
  }, 0);
  const foodTotal = foodItems.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const subtotal = ticketTotal + foodTotal;
  const pointsDiscount = Math.min(pointsInput * 100, subtotal * 0.2);
  const total = Math.max(0, subtotal - voucherDiscount - pointsDiscount);

  const applyVoucher = () => {
    setVoucherError("");
    const promo = promotions.find((p) => p.code === voucherInput.toUpperCase() && p.status === "active");
    if (!promo) { setVoucherError("Mã voucher không hợp lệ hoặc đã hết hạn."); return; }
    if (subtotal < promo.minSpend) { setVoucherError(`Đơn hàng tối thiểu ${formatVND(promo.minSpend)} để áp dụng voucher này.`); return; }
    let discount = promo.discountType === "percent" ? Math.round(subtotal * promo.discountValue / 100) : promo.discountValue;
    if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
    setVoucher(promo.code, discount);
    setVoucherApplied(true);
  };

  const handlePay = async () => {
    setPaymentState("processing");
    await new Promise((r) => setTimeout(r, 2200));
    setPaymentState("success");
    await new Promise((r) => setTimeout(r, 800));
    navigate("booking-success");
  };

  if (paymentState === "processing") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(240,68,82,0.12)", border: "2px solid rgba(240,68,82,0.3)" }}>
          <Loader size={36} className="animate-spin" style={{ color: "#F04452" }} />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">Đang xử lý thanh toán...</p>
          <p className="text-sm mt-1" style={{ color: "#737C8D" }}>Vui lòng không đóng trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Progress */}
      <div className="border-b px-4 py-3" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#737C8D" }}>
            {["Phim", "Suất chiếu", "Chọn ghế", "Bắp nước", "Thanh toán"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span style={{ color: i < 4 ? "#35C98A" : "#F5F5F7", fontWeight: i === 4 ? 600 : 400 }}>{step}</span>
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
        <h1 className="text-xl font-bold mb-6">Xác nhận & Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left */}
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4">Thông tin đặt vé</h3>
              <div className="flex gap-4">
                <img src={booking.moviePoster} alt="" className="w-16 h-22 rounded-xl object-cover shrink-0" style={{ backgroundColor: "#191F2B", aspectRatio: "2/3" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{movieTitle}</p>
                  <p className="text-sm mt-1" style={{ color: "#A3AAB8" }}>{cinemaName}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#737C8D" }}>{auditoriumName}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#737C8D" }}>{showtime?.date} · {showtime?.startTime} · {showtime?.format}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSeats.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>{s.row}{s.number}</span>
                    ))}
                  </div>
                </div>
              </div>
              {foodItems.length > 0 && (
                <>
                  <div className="h-px my-4" style={{ backgroundColor: "#292F3D" }} />
                  <p className="text-sm font-semibold mb-2">Bắp nước</p>
                  {foodItems.map((c) => (
                    <div key={c.item.id} className="flex justify-between text-sm py-1">
                      <span style={{ color: "#A3AAB8" }}>{c.item.name} ×{c.qty}</span>
                      <span>{formatVND(c.item.price * c.qty)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Voucher */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Tag size={17} />Mã giảm giá</h3>
              {voucherApplied ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(53,201,138,0.1)", border: "1px solid rgba(53,201,138,0.3)" }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: "#35C98A" }} />
                    <span className="text-sm font-semibold" style={{ color: "#35C98A" }}>Áp dụng: <code>{voucher}</code></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: "#35C98A" }}>-{formatVND(voucherDiscount)}</span>
                    <button onClick={() => { setVoucher("", 0); setVoucherApplied(false); setVoucherInput(""); }} className="text-xs" style={{ color: "#737C8D" }}>Xóa</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      placeholder="Nhập mã voucher"
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
                      style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7" }}
                    />
                    <button onClick={applyVoucher} className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#F04452", color: "#fff" }}>Áp dụng</button>
                  </div>
                  {voucherError && (
                    <p className="flex items-center gap-1.5 text-xs mt-2" style={{ color: "#F04452" }}>
                      <AlertCircle size={13} />{voucherError}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: "#737C8D" }}>Thử: TUESDAY30, BDAY5, STUDENT20</p>
                </>
              )}
            </div>

            {/* Points */}
            {user && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Coins size={17} />Điểm thưởng</h3>
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span style={{ color: "#A3AAB8" }}>Điểm khả dụng:</span>
                  <span className="font-bold" style={{ color: "#F5B942" }}>{user.points.toLocaleString()} điểm</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={0}
                    max={Math.min(user.points, Math.floor(subtotal * 0.2 / 100))}
                    value={pointsInput}
                    onChange={(e) => { setPointsInput(Number(e.target.value)); setPointsRedeemed(Number(e.target.value)); }}
                    className="flex-1 accent-yellow-400"
                  />
                  <span className="text-sm font-bold w-16 text-right" style={{ color: "#F5B942" }}>{pointsInput} pts</span>
                </div>
                <p className="text-xs mt-2" style={{ color: "#737C8D" }}>1 điểm = 100₫ · Tối đa 20% giá trị đơn hàng</p>
                {pointsInput > 0 && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: "#35C98A" }}>Tiết kiệm: {formatVND(pointsDiscount)}</p>
                )}
              </div>
            )}

            {/* Payment Method */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4 flex items-center gap-2"><CreditCard size={17} />Phương thức thanh toán</h3>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  const active = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className="p-4 rounded-xl border text-left transition-colors"
                      style={{ backgroundColor: active ? "rgba(240,68,82,0.08)" : "#191F2B", borderColor: active ? "#F04452" : "#292F3D" }}
                    >
                      <Icon size={22} style={{ color: active ? "#F04452" : "#A3AAB8" }} className="mb-2" />
                      <p className="text-sm font-semibold">{pm.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{pm.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="rounded-2xl p-5 sticky top-24" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between"><span style={{ color: "#737C8D" }}>Vé ({selectedSeats.length} ghế)</span><span>{formatVND(ticketTotal)}</span></div>
                {foodTotal > 0 && <div className="flex justify-between"><span style={{ color: "#737C8D" }}>Bắp nước</span><span>{formatVND(foodTotal)}</span></div>}
                {voucherDiscount > 0 && <div className="flex justify-between" style={{ color: "#35C98A" }}><span>Giảm voucher</span><span>-{formatVND(voucherDiscount)}</span></div>}
                {pointsDiscount > 0 && <div className="flex justify-between" style={{ color: "#F5B942" }}><span>Giảm điểm</span><span>-{formatVND(pointsDiscount)}</span></div>}
                <div className="h-px" style={{ backgroundColor: "#292F3D" }} />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng thanh toán</span>
                  <span style={{ color: "#F04452" }}>{formatVND(total)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl mb-4 text-xs" style={{ backgroundColor: "#191F2B", border: "1px dashed #292F3D" }}>
                <p className="font-semibold mb-1">Phương thức: {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}</p>
                <p style={{ color: "#737C8D" }}>Sau khi thanh toán thành công, bạn sẽ nhận QR code qua email và có thể xem trong mục "Vé của tôi".</p>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-95"
                style={{ background: "linear-gradient(135deg, #F04452 0%, #cc2233 100%)", color: "#fff" }}
              >
                <CreditCard size={18} />
                Thanh toán {formatVND(total)}
              </button>

              <p className="text-xs text-center mt-3" style={{ color: "#737C8D" }}>
                Giao dịch được bảo mật bởi SSL 256-bit. Đây là môi trường demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
