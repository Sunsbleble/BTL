import { useState, useEffect } from "react";
import { Clock, MapPin, Monitor } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ShowtimesPage() {
  const { navigate, setBookingMovie } = useApp();
  const [showtimesList, setShowtimesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API lấy lịch chiếu thật từ MySQL Backend
  useEffect(() => {
    fetch("http://localhost:5000/api/showtimes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShowtimesList(data);
        }
      })
      .catch((err) => console.error("Lỗi lấy danh sách lịch chiếu:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Xử lý khi nhấn nút "Đặt vé"
  const handleBook = (st: any) => {
    const startTimeFormatted = st.start_time
      ? new Date(st.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : "00:00";
    const endTimeFormatted = st.end_time
      ? new Date(st.end_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : "00:00";
    const showDateFormatted = st.start_time
      ? new Date(st.start_time).toISOString().slice(0, 10)
      : "";

    setBookingMovie({
      movieId: st.movie_id ? st.movie_id.toString() : "1",
      movieTitle: st.movie_title || "Phim",
      moviePoster: st.poster_url || "/images/dune.jpg",
      cinemaId: "c1",
      cinemaName: "CineVerse Cinema",
      showtime: {
        id: st.showtime_id.toString(),
        movieId: st.movie_id ? st.movie_id.toString() : "1",
        cinemaId: "c1",
        auditoriumId: st.room_name || "Phòng chiếu",
        date: showDateFormatted,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        format: st.room_name?.includes("IMAX") ? "IMAX" : "2D",
        price: Number(st.price) || 100000,
        availableSeats: 50,
        totalSeats: 50,
      },
      auditoriumName: st.room_name || "Phòng chiếu",
    });

    navigate("seats");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 text-white" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <h1 className="text-2xl font-bold mb-2">Lịch chiếu</h1>
      <p className="text-sm mb-8 text-gray-400">Tất cả suất chiếu sắp tới tại hệ thống CINEVERSE</p>

      {isLoading ? (
        <div className="py-20 text-center text-gray-400">Đang tải lịch chiếu từ Database...</div>
      ) : showtimesList.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#121620] rounded-2xl border border-[#292F3D]">
          <p>Chưa có suất chiếu nào được tạo trong hệ thống</p>
        </div>
      ) : (
        <div className="space-y-4">
          {showtimesList.map((st) => {
            const startTimeFormatted = st.start_time
              ? new Date(st.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
              : "--:--";
            const endTimeFormatted = st.end_time
              ? new Date(st.end_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
              : "--:--";
            const showDateFormatted = st.start_time
              ? new Date(st.start_time).toLocaleDateString("vi-VN")
              : "2026";
            const priceK = (Number(st.price) / 1000).toFixed(0);
            const format = st.room_name?.includes("IMAX") ? "IMAX" : "2D";

            return (
              <div key={st.showtime_id} className="flex gap-4 p-4 rounded-2xl border bg-[#121620] border-[#292F3D]">
                <img
                  src={st.poster_url || "/images/dune.jpg"}
                  alt={st.movie_title}
                  className="w-14 h-20 rounded-xl object-cover shrink-0 bg-[#191F2B]"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base">{st.movie_title}</p>
                  <p className="text-sm mt-1 flex items-center gap-1.5 text-gray-300">
                    <MapPin size={12} /> CineVerse Vincom Center
                  </p>
                  <p className="text-sm mt-0.5 flex items-center gap-1.5 text-gray-400">
                    <Monitor size={12} /> {st.room_name} · {format}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {startTimeFormatted} – {endTimeFormatted}
                    </span>
                    <span>{showDateFormatted}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <span className="text-sm font-bold text-[#F04452]">{priceK}K₫</span>
                  <button
                    onClick={() => handleBook(st)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#F04452] text-white cursor-pointer hover:bg-[#d03442] transition-colors"
                  >
                    Đặt vé
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}