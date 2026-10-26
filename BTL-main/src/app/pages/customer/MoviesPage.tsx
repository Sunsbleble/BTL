import { useState, useEffect } from "react";
import { Film, Star, Clock, Search } from "lucide-react";
import { formatDuration, RATING_COLORS } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function MoviesPage() {
  const { navigate } = useApp();
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "showing" | "coming">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Lấy dữ liệu thật từ MySQL Backend
  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((m: any) => ({
            id: m.movie_id.toString(),
            title: m.title,
            poster: m.poster_url || "/images/dune.jpg",
            duration: m.duration || 120,
            genre: m.genre ? m.genre.split(",").map((g: string) => g.trim()) : ["Hành động"],
            status: m.status === "Showing" ? "now_showing" : "coming_soon",
            ageRating: "T18",
            rating: 8.5,
          }));
          setMoviesList(formatted);
        }
      })
      .catch((err) => console.error("Lỗi lấy danh sách phim:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredMovies = moviesList.filter((m) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "showing"
        ? m.status === "now_showing"
        : m.status === "coming_soon";
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-white">Tất cả phim</h1>
        <p className="text-sm text-gray-400">Khám phá các bộ phim đang chiếu và sắp chiếu tại CINEVERSE</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex gap-2 w-full md:w-auto">
          {[
            { key: "all", label: "Tất cả phim" },
            { key: "showing", label: "Phim đang chiếu" },
            { key: "coming", label: "Phim sắp chiếu" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
              style={{
                backgroundColor: filter === tab.key ? "#F04452" : "#191F2B",
                color: filter === tab.key ? "#fff" : "#A3AAB8",
                border: `1px solid ${filter === tab.key ? "#F04452" : "#292F3D"}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none bg-[#191F2B] border border-[#292F3D] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-400">Đang tải danh sách phim từ Database...</div>
      ) : filteredMovies.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#121620] rounded-2xl border border-[#292F3D]">
          <Film size={40} className="mx-auto mb-3 text-gray-600" />
          <p>Không tìm thấy bộ phim nào trong hệ thống</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredMovies.map((movie) => {
            const ratingColor = RATING_COLORS[movie.ageRating as keyof typeof RATING_COLORS] || "#F04452";
            return (
              <div
                key={movie.id}
                onClick={() => navigate("movie-detail", { movieId: movie.id })}
                className="group rounded-2xl overflow-hidden border border-[#292F3D] bg-[#121620] cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[2/3] bg-[#191F2B] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${ratingColor}E6`, color: "#fff" }}
                  >
                    {movie.ageRating}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-yellow-400 flex items-center gap-1">
                    <Star size={10} fill="#F5B942" /> {movie.rating}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-[#F04452] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {formatDuration(movie.duration)} · {movie.genre[0] || "Hành động"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}