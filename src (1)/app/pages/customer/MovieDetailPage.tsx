import { useState } from "react";
import { Play, Clock, Star, ChevronLeft, Calendar, Monitor, Users } from "lucide-react";
import { movies, cinemas, showtimes, formatDuration, RATING_COLORS, type Showtime } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

const today = new Date();
const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today.getTime() + i * 86400000);
  return { label: d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }), value: d.toISOString().slice(0, 10) };
});

const FORMAT_COLORS: Record<string, string> = {
  IMAX: "#63A5FF",
  "4DX": "#F04452",
  "3D": "#F5B942",
  "2D": "#35C98A",
};

export default function MovieDetailPage({ movieId }: { movieId: string }) {
  const { navigate, goBack, setBookingMovie } = useApp();
  const movie = movies.find((m) => m.id === movieId);
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);

  if (!movie) return <div className="p-8 text-center" style={{ color: "#737C8D" }}>Không tìm thấy phim.</div>;

  const movieShowtimes = showtimes.filter(
    (s) => s.movieId === movieId && s.date === selectedDate && (!selectedFormat || s.format === selectedFormat) && (!selectedCinema || s.cinemaId === selectedCinema)
  );

  const groupedByCinema: Record<string, Showtime[]> = {};
  movieShowtimes.forEach((s) => {
    if (!groupedByCinema[s.cinemaId]) groupedByCinema[s.cinemaId] = [];
    groupedByCinema[s.cinemaId].push(s);
  });

  const allFormats = [...new Set(showtimes.filter((s) => s.movieId === movieId).map((s) => s.format))];
  const allCinemas = [...new Set(showtimes.filter((s) => s.movieId === movieId).map((s) => s.cinemaId))];

  const handleSelectShowtime = (st: Showtime) => {
    const cinema = cinemas.find((c) => c.id === st.cinemaId)!;
    const aud = cinema.auditoriums.find((a) => a.id === st.auditoriumId)!;
    setBookingMovie({
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      cinemaId: st.cinemaId,
      cinemaName: cinema.name,
      showtime: st,
      auditoriumName: aud.name,
    });
    navigate("seats");
  };

  const ratingColor = RATING_COLORS[movie.ageRating];

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Backdrop Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={movie.backdrop} alt="" className="w-full h-full object-cover" style={{ backgroundColor: "#191F2B" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,13,18,0.3) 0%, rgba(11,13,18,1) 100%)" }} />
        <button
          onClick={goBack}
          className="absolute top-4 left-4 md:left-6 flex items-center gap-2 text-sm px-3 py-2 rounded-xl border transition-colors hover:bg-white/10"
          style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
        >
          <ChevronLeft size={16} /> Quay lại
        </button>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Movie Info */}
        <div className="flex flex-col md:flex-row gap-6 -mt-24 md:-mt-32 relative z-10 mb-10">
          <div className="w-32 md:w-48 shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-2xl object-cover shadow-2xl"
              style={{ backgroundColor: "#191F2B", aspectRatio: "2/3", border: "2px solid #292F3D" }}
            />
          </div>
          <div className="flex-1 pt-2 md:pt-24">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${ratingColor}20`, color: ratingColor, border: `1px solid ${ratingColor}40` }}>{movie.ageRating}</span>
              {movie.status === "now_showing" && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "rgba(53,201,138,0.15)", color: "#35C98A" }}>Đang chiếu</span>
              )}
              {movie.status === "coming_soon" && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "rgba(99,165,255,0.15)", color: "#63A5FF" }}>Sắp chiếu</span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-1">{movie.title}</h1>
            <p className="text-sm mb-4" style={{ color: "#737C8D" }}>{movie.originalTitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4" style={{ color: "#A3AAB8" }}>
              <span className="flex items-center gap-1.5"><Clock size={14} />{formatDuration(movie.duration)}</span>
              {movie.rating > 0 && <span className="flex items-center gap-1.5"><Star size={14} style={{ color: "#F5B942" }} fill="#F5B942" />{movie.rating}/10</span>}
              <span className="flex items-center gap-1.5"><Calendar size={14} />{movie.releaseDate}</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{movie.director}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g) => <span key={g} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "#191F2B", color: "#A3AAB8", border: "1px solid #292F3D" }}>{g}</span>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.formats.map((f) => <span key={f} className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: `${FORMAT_COLORS[f]}15`, color: FORMAT_COLORS[f], border: `1px solid ${FORMAT_COLORS[f]}30` }}>{f}</span>)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Synopsis + Cast */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <section>
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: "#F04452" }} />
                Nội dung phim
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#A3AAB8" }}>{movie.synopsis}</p>
            </section>

            {/* Cast */}
            <section>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: "#F04452" }} />
                Diễn viên
              </h2>
              <div className="flex flex-wrap gap-3">
                {movie.cast.map((actor, i) => (
                  <div key={actor} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                    <img src={`https://i.pravatar.cc/40?img=${i + 1}`} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-sm">{actor}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Trailer */}
            <section>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: "#F04452" }} />
                Trailer
              </h2>
              <div className="relative rounded-2xl overflow-hidden aspect-video flex items-center justify-center" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
                <img src={movie.backdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <button className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: "#F04452" }}>
                  <Play size={24} fill="#fff" className="text-white ml-1" />
                </button>
              </div>
            </section>
          </div>

          {/* Right: Details */}
          <aside>
            <div className="rounded-2xl p-5 sticky top-24" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
              <h3 className="font-bold text-base mb-4">Thông tin phim</h3>
              {[
                { label: "Đạo diễn", value: movie.director },
                { label: "Thể loại", value: movie.genre.join(", ") },
                { label: "Thời lượng", value: formatDuration(movie.duration) },
                { label: "Khởi chiếu", value: movie.releaseDate },
                { label: "Giới hạn tuổi", value: movie.ageRating },
                { label: "Định dạng", value: movie.formats.join(", ") },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 py-2.5 border-b text-sm" style={{ borderColor: "#292F3D" }}>
                  <span style={{ color: "#737C8D" }}>{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* ─── Showtime Selector ─── */}
        {movie.status === "now_showing" && (
          <section className="mb-12">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full" style={{ backgroundColor: "#F04452" }} />
              Chọn suất chiếu
            </h2>

            {/* Date Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {DATES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedDate === d.value ? "#F04452" : "#191F2B",
                    color: selectedDate === d.value ? "#fff" : "#A3AAB8",
                    border: `1px solid ${selectedDate === d.value ? "#F04452" : "#292F3D"}`,
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Format Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedFormat(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: !selectedFormat ? "#191F2B" : "transparent", color: !selectedFormat ? "#F5F5F7" : "#737C8D", border: `1px solid ${!selectedFormat ? "#292F3D" : "transparent"}` }}
              >
                Tất cả
              </button>
              {allFormats.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(selectedFormat === f ? null : f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: selectedFormat === f ? `${FORMAT_COLORS[f]}15` : "transparent",
                    color: selectedFormat === f ? FORMAT_COLORS[f] : "#737C8D",
                    border: `1px solid ${selectedFormat === f ? FORMAT_COLORS[f] : "#292F3D"}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Cinema Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setSelectedCinema(null)} className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: !selectedCinema ? "#F04452" : "#191F2B", color: "#fff", border: "1px solid transparent" }}>
                Tất cả rạp
              </button>
              {allCinemas.map((cid) => {
                const c = cinemas.find((ci) => ci.id === cid)!;
                return (
                  <button
                    key={cid}
                    onClick={() => setSelectedCinema(selectedCinema === cid ? null : cid)}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: selectedCinema === cid ? "#F04452" : "#191F2B", color: "#fff", border: "1px solid #292F3D" }}
                  >
                    {c.city}
                  </button>
                );
              })}
            </div>

            {/* Showtime Groups */}
            {Object.keys(groupedByCinema).length === 0 ? (
              <div className="py-12 text-center rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <Monitor size={40} className="mx-auto mb-3" style={{ color: "#292F3D" }} />
                <p style={{ color: "#737C8D" }}>Không có suất chiếu cho ngày này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedByCinema).map(([cinemaId, sts]) => {
                  const cinema = cinemas.find((c) => c.id === cinemaId)!;
                  return (
                    <div key={cinemaId} className="rounded-2xl p-5" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(240,68,82,0.12)" }}>
                          <Monitor size={15} style={{ color: "#F04452" }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{cinema.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>{cinema.address}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {sts.map((st) => {
                          const aud = cinema.auditoriums.find((a) => a.id === st.auditoriumId);
                          const pct = Math.round((1 - st.availableSeats / st.totalSeats) * 100);
                          return (
                            <button
                              key={st.id}
                              onClick={() => handleSelectShowtime(st)}
                              className="relative text-left p-3 rounded-xl border transition-all hover:border-[#F04452] group"
                              style={{ backgroundColor: "#191F2B", borderColor: "#292F3D", minWidth: "120px" }}
                            >
                              <p className="font-bold text-lg leading-none mb-1 group-hover:text-[#F04452] transition-colors">{st.startTime}</p>
                              <p className="text-xs mb-2" style={{ color: "#737C8D" }}>– {st.endTime}</p>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${FORMAT_COLORS[st.format]}15`, color: FORMAT_COLORS[st.format] }}>{st.format}</span>
                              </div>
                              <p className="text-xs" style={{ color: "#737C8D" }}>{aud?.name.split(" - ")[0]}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: "#292F3D" }}>
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? "#F04452" : pct > 60 ? "#F5B942" : "#35C98A" }} />
                                </div>
                                <span className="text-xs" style={{ color: "#737C8D" }}>{st.availableSeats} ghế</span>
                              </div>
                              <p className="text-xs font-semibold mt-1" style={{ color: "#F04452" }}>{(st.price / 1000).toFixed(0)}K₫</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {movie.status === "coming_soon" && (
          <div className="mb-12 p-8 rounded-2xl text-center" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
            <p className="font-semibold text-lg mb-2">Phim sẽ khởi chiếu vào {movie.releaseDate}</p>
            <p className="text-sm mb-4" style={{ color: "#737C8D" }}>Đăng ký nhận thông báo khi phim mở bán vé</p>
            <button className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#F04452", color: "#fff" }}>
              Nhắc tôi khi mở vé
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
