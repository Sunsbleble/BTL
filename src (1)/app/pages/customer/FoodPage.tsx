import { useState } from "react";
import { ChevronLeft, Plus, Minus, ShoppingCart, Flame } from "lucide-react";
import { foodItems, formatVND, type FoodItem } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

type CartItem = { item: FoodItem; qty: number };

const CATEGORIES = [
  { id: "combo", label: "Combo" },
  { id: "popcorn", label: "Bắp rang" },
  { id: "drinks", label: "Nước uống" },
  { id: "snacks", label: "Snacks" },
];

export default function FoodPage() {
  const { booking, setBookingFood, navigate, goBack } = useApp();
  const [activeCategory, setActiveCategory] = useState("combo");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredItems = foodItems.filter((f) => f.category === activeCategory);

  const getQty = (id: string) => cart.find((c) => c.item.id === id)?.qty ?? 0;

  const updateQty = (item: FoodItem, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (!existing) {
        if (delta > 0) return [...prev, { item, qty: 1 }];
        return prev;
      }
      const newQty = existing.qty + delta;
      if (newQty <= 0) return prev.filter((c) => c.item.id !== item.id);
      return prev.map((c) => c.item.id === item.id ? { ...c, qty: newQty } : c);
    });
  };

  const foodTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const ticketTotal = booking.selectedSeats.reduce((sum, s) => {
    if (!booking.showtime) return sum;
    if (s.type === "vip") return sum + booking.showtime.vipPrice;
    if (s.type === "couple") return sum + booking.showtime.couplePrice;
    return sum + booking.showtime.price;
  }, 0);

  const handleContinue = () => {
    setBookingFood(cart);
    navigate("checkout");
  };

  const handleSkip = () => {
    setBookingFood([]);
    navigate("checkout");
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Progress */}
      <div className="border-b px-4 py-3" style={{ backgroundColor: "#121620", borderColor: "#292F3D" }}>
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#737C8D" }}>
            {["Phim", "Suất chiếu", "Chọn ghế", "Bắp nước", "Thanh toán"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span style={{ color: i < 3 ? "#35C98A" : i === 3 ? "#F5F5F7" : "#737C8D", fontWeight: i === 3 ? 600 : 400 }}>{step}</span>
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
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1">Chọn bắp nước</h1>
          <p className="text-sm" style={{ color: "#737C8D" }}>Thêm đồ ăn vào đơn hàng của bạn (không bắt buộc)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Products */}
          <div>
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  style={{ backgroundColor: activeCategory === cat.id ? "#F04452" : "#191F2B", color: activeCategory === cat.id ? "#fff" : "#A3AAB8", border: `1px solid ${activeCategory === cat.id ? "#F04452" : "#292F3D"}` }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const qty = getQty(item.id);
                return (
                  <div key={item.id} className="rounded-2xl border overflow-hidden flex gap-0" style={{ backgroundColor: "#121620", borderColor: qty > 0 ? "#F04452" : "#292F3D" }}>
                    <div className="relative w-28 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" style={{ backgroundColor: "#191F2B", aspectRatio: "1" }} />
                      {item.popular && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                          <Flame size={10} />
                          Phổ biến
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <p className="font-semibold text-sm mb-1">{item.name}</p>
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#737C8D" }}>{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-bold text-sm" style={{ color: "#F04452" }}>{formatVND(item.price)}</p>
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(item, 1)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                            style={{ backgroundColor: "#F04452", color: "#fff" }}
                          >
                            <Plus size={13} /> Thêm
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item, -1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                              <Minus size={13} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{qty}</span>
                            <button onClick={() => updateQty(item, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F04452" }}>
                              <Plus size={13} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div>
            <div className="rounded-2xl p-5 sticky top-24" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <ShoppingCart size={18} />
                Đơn hàng của bạn
              </h3>

              {/* Tickets */}
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#737C8D" }}>Vé xem phim</p>
                {booking.selectedSeats.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm py-1.5">
                    <span style={{ color: "#A3AAB8" }}>Ghế {s.row}{s.number} ({s.type === "vip" ? "VIP" : s.type === "couple" ? "Đôi" : "Thường"})</span>
                    <span>{booking.showtime ? formatVND(s.type === "vip" ? booking.showtime.vipPrice : s.type === "couple" ? booking.showtime.couplePrice : booking.showtime.price) : "–"}</span>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="h-px mb-4" style={{ backgroundColor: "#292F3D" }} />
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#737C8D" }}>Bắp nước</p>
                    {cart.map((c) => (
                      <div key={c.item.id} className="flex justify-between text-sm py-1.5">
                        <span style={{ color: "#A3AAB8" }}>{c.item.name} ×{c.qty}</span>
                        <span>{formatVND(c.item.price * c.qty)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="h-px mb-4" style={{ backgroundColor: "#292F3D" }} />
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span style={{ color: "#737C8D" }}>Vé</span><span>{formatVND(ticketTotal)}</span></div>
                {foodTotal > 0 && <div className="flex justify-between"><span style={{ color: "#737C8D" }}>Bắp nước</span><span>{formatVND(foodTotal)}</span></div>}
                <div className="h-px" style={{ backgroundColor: "#292F3D" }} />
                <div className="flex justify-between font-bold text-base">
                  <span>Tổng cộng</span>
                  <span style={{ color: "#F04452" }}>{formatVND(ticketTotal + foodTotal)}</span>
                </div>
              </div>

              <button onClick={handleContinue} className="w-full py-3 rounded-xl font-semibold text-sm mb-2" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                Tiếp tục thanh toán
              </button>
              <button onClick={handleSkip} className="w-full py-2 rounded-xl text-sm" style={{ color: "#737C8D" }}>
                Bỏ qua, không mua bắp nước
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
