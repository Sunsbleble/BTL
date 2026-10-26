import { useState, useEffect } from "react";
import { Play, Clock, Star, ChevronLeft, Calendar, Monitor, Users } from "lucide-react";
import { formatDuration, RATING_COLORS } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

const today = new Date();
const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today.getTime() + i * 86400000);
  return { 
    label: d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }), 
    value: d.toISOString().slice(0, 10) 
  };
});

const FORMAT_COLORS: Record<string, string> = {
  IMAX: "#63A5FF",
  "4DX": "#F04452",
  "3D": "#F5B942",
  "2D": "#35C98A",
};

export default function MovieDetailPage({ movieId }: { movieId: string }) {
  const { navigate, goBack, setBookingMovie } = useApp();
  
  const [movie, setMovie] = useState<any>(null);
  const [showtimesByRoom, setShowtimesByRoom] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(DATES[0].value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Chuẩn hóa ID: Loại bỏ ký tự chữ 'm' nếu movieId = "m3" -> cleanId = "3"
        const cleanId = String(movieId).replace(/\D/g, "") || "1";

        // Gọi đồng thời cả 2 API lấy thông tin phim & suất chiếu
        const [movieRes, showtimesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/movies/${cleanId}`),
          fetch(`http://localhost:5000/api/showtimes?movieId=${cleanId}`)
        ]);

        if (!movieRes.ok) throw new Error("Lỗi khi tải dữ liệu phim");
        
        // 1. Xử lý thông tin Phim
        const rawMovieData = await movieRes.json();
        const movieData = Array.isArray(rawMovieData) ? rawMovieData[0] : rawMovieData;

        if (!movieData || !movieData.movie_id) {
          throw new Error("Không tìm thấy dữ liệu phim");
        }
        
        const formattedMovie = {
          id: movieData.movie_id.toString(),
          title: movieData.title,
          originalTitle: movieData.title, 
          backdrop: movieData.poster_url || "/images/dune.jpg", 
          poster: movieData.poster_url || "/images/dune.jpg",
          ageRating: "T18", 
          status: movieData.status === "Showing" ? "now_showing" : "coming_soon",
          duration: movieData.duration || 120,
          rating: 8.5, 
          releaseDate: movieData.release_date ? new Date(movieData.release_date).toLocaleDateString("vi-VN") : "2026",
          director: movieData.director || "Đang cập nhật",
          genre: movieData.genre ? movieData.genre.split(',').map((g: string) => g.trim()) : ["Hành động"],
          formats: ["2D", "IMAX"], 
          synopsis: movieData.description || "Nội dung phim đang cập nhật...",
          cast: movieData.cast ? movieData.cast.split(',').map((c: string) => c.trim()) : ["Diễn viên A", "Diễn viên B"],
        };
        setMovie(formattedMovie);

        // 2. Xử lý Lịch chiếu thật từ Database (Gom nhóm theo room_name)
        if (showtimesRes.ok) {
          const showtimesData = await showtimesRes.json();
          
          if (Array.isArray(showtimesData)) {
            const grouped = showtimesData.reduce((acc: any, curr: any) => {
              const room = curr.room_name || "Phòng chiếu";
              if (!acc[room]) {
                acc[room] = [];
              }
              acc[room].push(curr);
              return acc;
            }, {});

            setShowtimesByRoom(grouped);
          }
        }

      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  // Xử lý sự kiện bấm chọn 1 Suất chiếu để chuyển qua chọn Ghế
  const handleSelectRealShowtime = (st: any) => {
    const startTimeFormatted = new Date(st.start_time).toLocaleTimeString("vi-VN", {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTimeFormatted = new Date(st.end_time).toLocaleTimeString("vi-VN", {
      hour: '2-digit',
      minute: '2-digit'
    });

    const showDate = st.start_time ? st.start_time.toString().split("T")[0].split(" ")[0] : selectedDate;

    setBookingMovie({
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      cinemaId: "c1",
      cinemaName: "CineVerse Cinema",
      showtime: {
        id: st.showtime_id.toString(),
        movieId: movie.id,
        cinemaId: "c1",
        auditoriumId: st.room_name,
        date: showDate,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        format: st.room_name?.includes("IMAX") ? "IMAX" : "2D",
        price: Number(st.price),
        availableSeats: 50,
        totalSeats: 50,
      },
      auditoriumName: st.room_name,
    });

    navigate("seats");
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Đang tải thông tin phim & lịch chiếu...</div>;
  }

  if (!movie) return <div className="p-8 text-center text-gray-400">Không tìm thấy thông tin phim.</div>;

  const ratingColor = RATING_COLORS[movie.ageRating as keyof typeof RATING_COLORS] || "#F04452";

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Backdrop Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={movie.backdrop} alt="" className="w-full h-full object-cover" style={{ backgroundColor: "#191F2B" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,13,18,0.3) 0%, rgba(11,13,18,1) 100%)" }} />
        <button
          onClick={goBack}
          className="absolute top-4 left-4 md:left-6 flex items-center gap-2 text-sm px-3 py-2 rounded-xl border transition-colors hover:bg-white/10 cursor-pointer"
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
          <div className="flex-1 pt-2 md:pt-24 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${ratingColor}20`, color: ratingColor, border: `1px solid ${ratingColor}40` }}>{movie.ageRating}</span>
              {movie.status === "now_showing" && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "rgba(53,201,138,0.15)", color: "#35C98A" }}>Đang chiếu</span>
              )}
              {movie.status === "coming_soon" && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "rgba(99,165,255,0.15)", color: "#63A5FF" }}>Sắp chiếu</span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-1 text-white">{movie.title}</h1>
            <p className="text-sm mb-4" style={{ color: "#737C8D" }}>{movie.originalTitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4" style={{ color: "#A3AAB8" }}>
              <span className="flex items-center gap-1.5"><Clock size={14} />{formatDuration(movie.duration)}</span>
              {movie.rating > 0 && <span className="flex items-center gap-1.5"><Star size={14} style={{ color: "#F5B942" }} fill="#F5B942" />{movie.rating}/10</span>}
              <span className="flex items-center gap-1.5"><Calendar size={14} />{movie.releaseDate}</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{movie.director}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g: string) => <span key={g} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "#191F2B", color: "#A3AAB8", border: "1px solid #292F3D" }}>{g}</span>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.formats.map((f: string) => <span key={f} className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: `${FORMAT_COLORS[f]}15`, color: FORMAT_COLORS[f], border: `1px solid ${FORMAT_COLORS[f]}30` }}>{f}</span>)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 text-white">
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
                {movie.cast.map((actor: string, i: number) => (
                  <div key={`${actor}-${i}`} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#191F2B", border: "1px solid #292F3D" }}>
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
                <button className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" style={{ backgroundColor: "#F04452" }}>
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

        {/* ─── LỊCH CHIẾU THẬT TỪ DATABASE ─── */}
        {movie.status === "now_showing" && (
          <section className="mb-12 text-white">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full" style={{ backgroundColor: "#F04452" }} />
              Chọn suất chiếu
            </h2>

            {/* Selector Chọn Ngày */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {DATES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
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

            {/* Hiển thị danh sách Lịch chiếu từ Database */}
            {Object.keys(showtimesByRoom).length === 0 ? (
              <div className="py-12 text-center rounded-2xl" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                <Monitor size={40} className="mx-auto mb-3" style={{ color: "#292F3D" }} />
                <p style={{ color: "#737C8D" }}>Chưa có lịch chiếu nào cho bộ phim này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(showtimesByRoom).map(([roomName, sts]) => (
                  <div key={roomName} className="rounded-2xl p-5" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(240,68,82,0.12)" }}>
                        <Monitor size={15} style={{ color: "#F04452" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{roomName}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#737C8D" }}>Rạp CineVerse - Hà Nội</p>
                      </div>
                    </div>

                    {/* Danh sách các giờ chiếu trong phòng này */}
                    <div className="flex flex-wrap gap-3">
                      {sts.map((st: any) => {
                        const startTimeFormatted = new Date(st.start_time).toLocaleTimeString("vi-VN", {
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                        const endTimeFormatted = new Date(st.end_time).toLocaleTimeString("vi-VN", {
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        const format = roomName.includes("IMAX") ? "IMAX" : "2D";
                        const priceK = (Number(st.price) / 1000).toFixed(0);

                        return (
                          <button
                            key={st.showtime_id}
                            onClick={() => handleSelectRealShowtime(st)}
                            className="relative text-left p-3 rounded-xl border transition-all hover:border-[#F04452] group cursor-pointer"
                            style={{ backgroundColor: "#191F2B", borderColor: "#292F3D", minWidth: "120px" }}
                          >
                            <p className="font-bold text-lg leading-none mb-1 group-hover:text-[#F04452] transition-colors">
                              {startTimeFormatted}
                            </p>
                            <p className="text-xs mb-2" style={{ color: "#737C8D" }}>– {endTimeFormatted}</p>
                            
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${FORMAT_COLORS[format]}15`, color: FORMAT_COLORS[format] }}>
                                {format}
                              </span>
                            </div>

                            <p className="text-xs font-semibold mt-2" style={{ color: "#F04452" }}>
                              {priceK}K₫
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {movie.status === "coming_soon" && (
          <div className="mb-12 p-8 rounded-2xl text-center text-white" style={{ backgroundColor: "#121620", border: "1px solid #292F3D" }}>
            <p className="font-semibold text-lg mb-2">Phim sẽ khởi chiếu vào {movie.releaseDate}</p>
            <p className="text-sm mb-4" style={{ color: "#737C8D" }}>Đăng ký nhận thông báo khi phim mở bán vé</p>
            <button className="px-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer" style={{ backgroundColor: "#F04452", color: "#fff" }}>
              Nhắc tôi khi mở vé
            </button>
          </div>
        )}
      </div>
    </div>
  );
}