import { useState } from "react";
import { motion } from "motion/react";
import { Play, ChevronLeft, ChevronRight, Clock, Star, MapPin, Ticket, ArrowRight, Zap } from "lucide-react";
import { movies, cinemas, promotions, formatDuration, RATING_COLORS, type Movie } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

const FEATURED = movies.filter((m) => m.featured);
const NOW_SHOWING = movies.filter((m) => m.status === "now_showing");
const COMING_SOON = movies.filter((m) => m.status === "coming_soon");

function RatingBadge({ rating, className = "" }: { rating: string; className?: string }) {
  const color = RATING_COLORS[rating as keyof typeof RATING_COLORS] ?? "#F5B942";
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-xs font-bold ${className}`}
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {rating}
    </span>
  );
}

function MovieCard({ movie, onBook }: { movie: Movie; onBook: (id: string) => void }) {
  const { navigate } = useApp();
  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`movie-${movie.id}`)}
      style={{ border: "1px solid #292F3D", backgroundColor: "#121620" }}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundColor: "#191F2B" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onBook(movie.id); }}
            className="w-full py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#F04452", color: "#fff" }}
          >
            Đặt vé ngay
          </button>
          <button className="w-full py-2 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
            Chi tiết
          </button>
        </div>
        <div className="absolute top-2 left-2">
          <RatingBadge rating={movie.ageRating} />
        </div>
        {movie.rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <Star size={10} style={{ color: "#F5B942" }} fill="#F5B942" />
            <span>{movie.rating}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: "#737C8D" }}>
          <span className="flex items-center gap-1"><Clock size={10} />{formatDuration(movie.duration)}</span>
          <span>{movie.genre[0]}</span>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {movie.formats.slice(0, 3).map((f) => (
            <span key={f} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "#191F2B", color: "#A3AAB8", border: "1px solid #292F3D" }}>{f}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { navigate, setBookingMovie } = useApp();
  const [heroIdx, setHeroIdx] = useState(0);
  const featured = FEATURED[heroIdx] ?? FEATURED[0];

  const handleBook = (movieId: string) => {
    const m = movies.find((mv) => mv.id === movieId)!;
    setBookingMovie({ movieId, movieTitle: m.title, moviePoster: m.poster });
    navigate(`movie-${movieId}`);
  };

  const prevHero = () => setHeroIdx((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const nextHero = () => setHeroIdx((i) => (i + 1) % FEATURED.length);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.img
          key={heroIdx}
          src={featured.backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          style={{ backgroundColor: "#191F2B" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,13,18,0.95) 30%, rgba(11,13,18,0.4) 70%, rgba(11,13,18,0.1) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,13,18,1) 0%, transparent 40%)" }} />

        <div className="relative h-full max-w-[1280px] mx-auto px-4 md:px-6 flex flex-col justify-center">
          <motion.div
            key={`hero-content-${heroIdx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <RatingBadge rating={featured.ageRating} />
              <span className="text-sm" style={{ color: "#A3AAB8" }}>{featured.genre.join(" · ")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {featured.title}
            </h1>
            <p className="text-sm md:text-base leading-relaxed mb-6 line-clamp-3" style={{ color: "#A3AAB8" }}>
              {featured.synopsis}
            </p>
            <div className="flex items-center gap-3 mb-8 text-sm" style={{ color: "#A3AAB8" }}>
              <span className="flex items-center gap-1"><Clock size={14} />{formatDuration(featured.duration)}</span>
              {featured.rating > 0 && (
                <span className="flex items-center gap-1"><Star size={14} style={{ color: "#F5B942" }} fill="#F5B942" />{featured.rating}/10</span>
              )}
              <span>Đạo diễn: {featured.director}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleBook(featured.id)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: "#F04452", color: "#fff" }}
              >
                <Ticket size={18} />
                Đặt vé ngay
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-colors hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
                <Play size={18} />
                Xem trailer
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Controls */}
        <div className="absolute bottom-6 left-4 md:left-6 flex items-center gap-3">
          <button onClick={prevHero} className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-white/20" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {FEATURED.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} className="h-1 rounded-full transition-all" style={{ width: i === heroIdx ? "24px" : "8px", backgroundColor: i === heroIdx ? "#F04452" : "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <button onClick={nextHero} className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-white/20" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Format badges */}
        <div className="absolute bottom-6 right-4 md:right-6 flex gap-2">
          {featured.formats.map((f) => (
            <span key={f} className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", backdropFilter: "blur(8px)", backgroundColor: "rgba(255,255,255,0.1)" }}>{f}</span>
          ))}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* ─── Premium Banner ─── */}
        <section className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, color: "#F04452", bg: "rgba(240,68,82,0.08)", title: "IMAX & 4DX", desc: "Trải nghiệm màn ảnh rộng nhất và âm thanh đỉnh cao" },
            { icon: Star, color: "#F5B942", bg: "rgba(245,185,66,0.08)", title: "Thành viên Gold", desc: "Tích điểm, đổi vé miễn phí với chương trình thành viên" },
            { icon: Ticket, color: "#35C98A", bg: "rgba(53,201,138,0.08)", title: "Đặt vé 24/7", desc: "Đặt vé nhanh chóng, nhận QR code tức thì" },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ border: "1px solid #292F3D", backgroundColor: bg }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Now Showing ─── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Phim đang chiếu</h2>
              <p className="text-sm mt-1" style={{ color: "#737C8D" }}>Xem ngay tại các rạp CINEVERSE</p>
            </div>
            <button
              onClick={() => navigate("movies")}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-white"
              style={{ color: "#F04452" }}
            >
              Xem tất cả <ArrowRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {NOW_SHOWING.map((m) => (
              <MovieCard key={m.id} movie={m} onBook={handleBook} />
            ))}
          </div>
        </section>

        {/* ─── Coming Soon ─── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Phim sắp chiếu</h2>
              <p className="text-sm mt-1" style={{ color: "#737C8D" }}>Đừng bỏ lỡ những bom tấn sắp ra mắt</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COMING_SOON.map((m) => (
              <div
                key={m.id}
                className="relative group rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`movie-${m.id}`)}
                style={{ border: "1px solid #292F3D", backgroundColor: "#121620" }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={m.poster} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: "#191F2B" }} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>Sắp chiếu</div>
                  </div>
                  <div className="absolute top-2 left-2"><RatingBadge rating={m.ageRating} /></div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">{m.title}</h3>
                  <p className="text-xs mt-1" style={{ color: "#737C8D" }}>{m.releaseDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Promotions ─── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Ưu đãi & Khuyến mãi</h2>
            <button onClick={() => navigate("promotions")} className="flex items-center gap-1 text-sm font-medium" style={{ color: "#F04452" }}>
              Xem tất cả <ArrowRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.filter((p) => p.status === "active").slice(0, 3).map((promo) => (
              <div
                key={promo.id}
                className="rounded-2xl overflow-hidden border cursor-pointer group"
                style={{ borderColor: "#292F3D" }}
                onClick={() => navigate("promotions")}
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={promo.banner} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: "#191F2B" }} />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#F04452", color: "#fff" }}>
                    {promo.discountType === "percent" ? `-${promo.discountValue}%` : `-${(promo.discountValue / 1000).toFixed(0)}K`}
                  </div>
                </div>
                <div className="p-4" style={{ backgroundColor: "#121620" }}>
                  <p className="font-semibold text-sm mb-1">{promo.title}</p>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#737C8D" }}>{promo.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <code className="text-xs px-2 py-1 rounded font-mono font-bold" style={{ backgroundColor: "#191F2B", color: "#F04452", border: "1px dashed #F04452" }}>{promo.code}</code>
                    <span className="text-xs" style={{ color: "#737C8D" }}>HSD: {promo.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Cinemas ─── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Hệ thống rạp chiếu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cinemas.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border" style={{ borderColor: "#292F3D", backgroundColor: "#121620" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(240,68,82,0.12)" }}>
                  <MapPin size={18} style={{ color: "#F04452" }} />
                </div>
                <p className="font-semibold text-sm mb-1">{c.name}</p>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#737C8D" }}>{c.address}</p>
                <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "#A3AAB8" }}>
                  <span>{c.auditoriums.length} phòng chiếu</span>
                  <span>·</span>
                  <span>{c.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
