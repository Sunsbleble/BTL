import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScanLine, Search, CheckCircle, XCircle, AlertCircle, Camera, Film, MapPin, Calendar, Ticket } from "lucide-react";
import { bookings, movies, cinemas, showtimes } from "../../data/mockData";

type ValidationState = "idle" | "scanning" | "valid" | "invalid" | "used";

const VALIDATION_DATA: Record<string, { status: ValidationState; used?: boolean }> = {
  "BK240001": { status: "valid" },
  "BK230089": { status: "used" },
  "BK229041": { status: "invalid" },
};

export default function TicketValidation() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<ValidationState>("idle");
  const [result, setResult] = useState<typeof bookings[0] | null>(null);
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual");
  const [confirming, setConfirming] = useState(false);

  const validate = async (code: string) => {
    if (!code.trim()) return;
    setState("scanning");
    await new Promise((r) => setTimeout(r, 900));

    const booking = bookings.find((b) => b.id === code.trim().toUpperCase());
    const knownState = VALIDATION_DATA[code.trim().toUpperCase()];

    if (!booking && !knownState) {
      setState("invalid");
      setResult(null);
    } else if (knownState?.status === "used") {
      setState("used");
      setResult(booking ?? null);
    } else if (booking || knownState?.status === "valid") {
      setState("valid");
      setResult(booking ?? null);
    } else {
      setState("invalid");
      setResult(null);
    }
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setState("idle");
      setInput("");
      setResult(null);
    }, 1200);
  };

  const handleReset = () => { setState("idle"); setInput(""); setResult(null); };

  const movie = result ? movies.find((m) => m.id === result.movieId) : null;
  const cinema = result ? cinemas.find((c) => c.id === result.cinemaId) : null;
  const showtime = result ? showtimes.find((s) => s.id === result.showtimeId) : null;

  const STATUS_CONFIG = {
    valid: { color: "#35C98A", bg: "rgba(53,201,138,0.1)", border: "rgba(53,201,138,0.3)", icon: CheckCircle, label: "Vé hợp lệ" },
    used: { color: "#F5B942", bg: "rgba(245,185,66,0.1)", border: "rgba(245,185,66,0.3)", icon: AlertCircle, label: "Vé đã sử dụng" },
    invalid: { color: "#F04452", bg: "rgba(240,68,82,0.1)", border: "rgba(240,68,82,0.3)", icon: XCircle, label: "Vé không hợp lệ" },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode Selector */}
      <div className="flex rounded-xl p-1" style={{ backgroundColor: "#191F2B" }}>
        {([["manual", "Nhập mã thủ công"], ["camera", "Quét QR Camera"]] as const).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setScanMode(mode)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: scanMode === mode ? "#F04452" : "transparent", color: scanMode === mode ? "#fff" : "#737C8D" }}
          >
            {mode === "camera" ? <Camera size={15} /> : <Search size={15} />}
            {label}
          </button>
        ))}
      </div>

      {/* Camera Mode */}
      {scanMode === "camera" && (
        <div className="rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center gap-4 relative" style={{ backgroundColor: "#121620", border: "2px dashed #292F3D" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-2xl border-2 relative" style={{ borderColor: "#63A5FF" }}>
              <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: "#63A5FF" }} />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: "#63A5FF" }} />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: "#63A5FF" }} />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: "#63A5FF" }} />
              <motion.div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: "#63A5FF", top: "50%" }} animate={{ top: ["20%", "80%", "20%"] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </div>
          <div className="absolute bottom-4 text-center">
            <p className="text-sm" style={{ color: "#737C8D" }}>Hướng camera vào mã QR trên vé</p>
            <p className="text-xs mt-1" style={{ color: "#737C8D" }}>(Demo: Camera không khả dụng – dùng nhập tay)</p>
          </div>
        </div>
      )}

      {/* Manual Input */}
      {scanMode === "manual" && (
        <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
          <div>
            <label className="block text-sm font-semibold mb-2">Nhập mã đặt vé</label>
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && validate(input)}
                placeholder="VD: BK240001"
                className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none uppercase"
                style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D", color: "#F5F5F7", letterSpacing: "0.1em" }}
              />
              <button
                onClick={() => validate(input)}
                disabled={!input.trim() || state === "scanning"}
                className="px-5 py-3 rounded-xl font-semibold text-sm transition-opacity"
                style={{ backgroundColor: "#F04452", color: "#fff", opacity: !input.trim() || state === "scanning" ? 0.6 : 1 }}
              >
                {state === "scanning" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: "#737C8D" }}>Thử: BK240001 (hợp lệ), BK230089 (đã dùng), BK229041 (không hợp lệ)</p>
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence mode="wait">
        {state !== "idle" && state !== "scanning" && (
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl overflow-hidden border"
            style={{
              backgroundColor: STATUS_CONFIG[state as keyof typeof STATUS_CONFIG]?.bg ?? "#121620",
              borderColor: STATUS_CONFIG[state as keyof typeof STATUS_CONFIG]?.border ?? "#292F3D",
            }}
          >
            {/* Status Header */}
            <div className="p-5 flex items-center gap-4">
              {(() => {
                const cfg = STATUS_CONFIG[state as keyof typeof STATUS_CONFIG];
                const Icon = cfg.icon;
                return (
                  <>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cfg.color}20` }}>
                      <Icon size={24} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-lg" style={{ color: cfg.color }}>{cfg.label}</p>
                      <p className="text-sm mt-0.5" style={{ color: "#A3AAB8" }}>
                        {state === "valid" && "Vé hợp lệ, cho phép vào rạp"}
                        {state === "used" && "Vé này đã được sử dụng trước đó"}
                        {state === "invalid" && "Mã đặt vé không tồn tại hoặc không hợp lệ"}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Ticket Details */}
            {result && movie && (
              <div className="px-5 pb-5">
                <div className="rounded-xl p-4 flex gap-4" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <img src={movie.poster} alt="" className="w-14 rounded-lg object-cover shrink-0" style={{ backgroundColor: "#191F2B", aspectRatio: "2/3" }} />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="font-bold">{movie.title}</p>
                    <p className="flex items-center gap-1.5 text-sm" style={{ color: "#A3AAB8" }}><MapPin size={12} />{cinema?.name}</p>
                    <p className="flex items-center gap-1.5 text-sm" style={{ color: "#A3AAB8" }}><Calendar size={12} />{showtime?.date} · {showtime?.startTime}</p>
                    <p className="flex items-center gap-1.5 text-sm" style={{ color: "#A3AAB8" }}><Film size={12} />{showtime?.format}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.seats.map((s) => <span key={s} className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "rgba(240,68,82,0.15)", color: "#F04452", border: "1px solid rgba(240,68,82,0.3)" }}>Ghế {s}</span>)}
                    </div>
                    <p className="text-xs pt-1 font-mono" style={{ color: "#737C8D" }}>Ref: {result.id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-3">
              {state === "valid" && (
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#35C98A", color: "#fff" }}
                >
                  {confirming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Ticket size={16} /> Xác nhận cho vào</>}
                </button>
              )}
              <button onClick={handleReset} className="flex-1 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: "#292F3D", color: "#A3AAB8" }}>
                Soát vé khác
              </button>
            </div>

            {state === "invalid" && (
              <div className="px-5 pb-5">
                <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <p className="font-semibold mb-1" style={{ color: "#F5B942" }}>Hướng dẫn xử lý:</p>
                  <ul className="space-y-1 text-xs" style={{ color: "#A3AAB8" }}>
                    <li>• Kiểm tra lại mã đặt vé với khách hàng</li>
                    <li>• Yêu cầu khách hàng kiểm tra email xác nhận</li>
                    <li>• Liên hệ quản lý nếu cần hỗ trợ thêm</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {state === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
            <div className="w-12 h-12 rounded-full border-2 border-t-[#63A5FF] animate-spin mx-auto mb-3" style={{ borderColor: "#292F3D", borderTopColor: "#63A5FF" }} />
            <p style={{ color: "#A3AAB8" }}>Đang kiểm tra vé...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
