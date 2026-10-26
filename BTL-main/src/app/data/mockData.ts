export type AgeRating = "P" | "T13" | "T16" | "T18" | "K";
export type MovieStatus = "now_showing" | "coming_soon" | "ended";
export type ScreeningFormat = "2D" | "3D" | "IMAX" | "4DX";
export type SeatType = "standard" | "vip" | "couple";
export type SeatStatus = "available" | "occupied" | "selected" | "unavailable";

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  synopsis: string;
  genre: string[];
  duration: number;
  director: string;
  cast: string[];
  releaseDate: string;
  ageRating: AgeRating;
  formats: ScreeningFormat[];
  status: MovieStatus;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  rating: number;
  featured?: boolean;
}

export interface Cinema {
  id: string;
  name: string;
  city: string;
  address: string;
  auditoriums: Auditorium[];
  phone: string;
}

export interface Auditorium {
  id: string;
  name: string;
  capacity: number;
  formats: ScreeningFormat[];
  rows: number;
  seatsPerRow: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  auditoriumId: string;
  date: string;
  startTime: string;
  endTime: string;
  format: ScreeningFormat;
  price: number;
  vipPrice: number;
  couplePrice: number;
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "popcorn" | "drinks" | "combo" | "snacks";
  image: string;
  popular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "staff" | "manager" | "admin";
  cinemaId?: string;
  points: number;
  memberTier: "Silver" | "Gold" | "Platinum";
  joinDate: string;
  totalBookings: number;
  status: "active" | "inactive";
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  cinemaId: string;
  showtimeId: string;
  seats: string[];
  foodItems: { itemId: string; qty: number }[];
  ticketTotal: number;
  foodTotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: "upcoming" | "completed" | "cancelled";
  bookingDate: string;
  qrCode: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired" | "paused";
  eligibleMovies?: string[];
  eligibleCinemas?: string[];
  banner: string;
}

// ─── MOVIES ───────────────────────────────────────────────────────────────────

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Đặc Vụ Không Gian",
    originalTitle: "Space Agent",
    synopsis:
      "Năm 2087, trái đất đứng trước nguy cơ diệt vong bởi một thiên thạch khổng lồ. Đội đặc vụ tinh nhuệ nhất của ASEAN được triệu tập để thực hiện nhiệm vụ bất khả thi – phá hủy mối đe dọa từ ngoài không gian. Hành trình đầy hiểm nguy, mất mát và những hy sinh thầm lặng của những con người phi thường.",
    genre: ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
    duration: 128,
    director: "Trần Thanh Huy",
    cast: ["Trương Minh Quốc Thái", "Ninh Dương Lan Ngọc", "Thu Trang", "Kiều Minh Tuấn"],
    releaseDate: "2026-10-15",
    ageRating: "T13",
    formats: ["2D", "3D", "IMAX"],
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 8.4,
    featured: true,
  },
  {
    id: "m2",
    title: "Cô Dâu Bóng Tối",
    originalTitle: "Dark Bride",
    synopsis:
      "Hoa cưới, chiếc váy trắng và những bí mật chôn vùi suốt 30 năm tại ngôi làng cổ Ninh Thuận. Khi cô dâu mới về làm dâu, những điều kỳ lạ liên tiếp xảy ra. Ranh giới giữa thực và ảo dần mờ nhạt khi cô nhận ra mình đang bị theo dõi bởi một thực thể không phải con người.",
    genre: ["Kinh dị", "Bí ẩn", "Tâm lý"],
    duration: 110,
    director: "Lê Văn Kiệt",
    cast: ["Kaity Nguyễn", "Thái Hòa", "Oanh Kiều", "Will"],
    releaseDate: "2026-10-22",
    ageRating: "T16",
    formats: ["2D"],
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 7.9,
    featured: true,
  },
  {
    id: "m3",
    title: "Người Khổng Lồ Xanh: Hồi Sinh",
    originalTitle: "Hulk: Reborn",
    synopsis:
      "Bruce Banner trở lại với sức mạnh mới, nhưng lần này kẻ thù không phải là quái vật hay siêu ác nhân – mà chính là bản thân ông. Cuộc chiến nội tâm giữa con người và Hulk đẩy anh đến bờ vực của sự hủy diệt. Marvel Studios mang đến một hành trình tâm lý sâu sắc chưa từng có.",
    genre: ["Hành động", "Siêu anh hùng", "Phiêu lưu"],
    duration: 145,
    director: "James Mangold",
    cast: ["Mark Ruffalo", "Tatiana Maslany", "Tim Roth", "Florence Pugh"],
    releaseDate: "2026-09-20",
    ageRating: "T13",
    formats: ["2D", "3D", "IMAX", "4DX"],
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 8.7,
    featured: true,
  },
  {
    id: "m4",
    title: "Hương Vị Quê Nhà",
    originalTitle: "Taste of Home",
    synopsis:
      "Minh – một đầu bếp người Việt thành công tại Paris – nhận tin mẹ ốm nặng và buộc phải trở về ngôi làng nhỏ ở Hội An. Sau 15 năm xa cách, anh đối mặt với ký ức, tình yêu cũ và những món ăn mà anh cố tình quên đi. Bộ phim là bản tình ca về ẩm thực, gia đình và cội nguồn.",
    genre: ["Tình cảm", "Gia đình", "Tâm lý"],
    duration: 118,
    director: "Phan Gia Nhật Linh",
    cast: ["Cris Phan", "Jun Vũ", "Diễm My 9X", "NSND Hồng Vân"],
    releaseDate: "2026-10-01",
    ageRating: "P",
    formats: ["2D"],
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 8.2,
  },
  {
    id: "m5",
    title: "Thiên Hà Mất Tích",
    originalTitle: "Lost Galaxy",
    synopsis:
      "Một đội thám hiểm không gian phát hiện ra rằng thiên hà mà họ đang nghiên cứu đang dần biến mất khỏi bản đồ vũ trụ. Hành trình tìm kiếm sự thật đưa họ đến những vùng không gian chưa ai đặt chân đến, nơi quy luật vật lý không còn tồn tại.",
    genre: ["Khoa học viễn tưởng", "Phiêu lưu", "Huyền bí"],
    duration: 152,
    director: "Denis Villeneuve",
    cast: ["Zendaya", "Timothée Chalamet", "Rebecca Ferguson", "Javier Bardem"],
    releaseDate: "2026-11-15",
    ageRating: "T13",
    formats: ["2D", "3D", "IMAX"],
    status: "coming_soon",
    poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 0,
  },
  {
    id: "m6",
    title: "Robot Chiến Binh 2",
    originalTitle: "Battle Bot 2",
    synopsis:
      "Cuộc chiến giữa con người và máy móc bước vào giai đoạn quyết định. Lần này, robot không chỉ học cách chiến đấu – chúng đang học cách cảm xúc. Bom tấn hành động hè 2026 với màn hình IMAX đẳng cấp thế giới.",
    genre: ["Hành động", "Khoa học viễn tưởng"],
    duration: 138,
    director: "Michael Bay",
    cast: ["Anthony Mackie", "Simu Liu", "Gemma Chan"],
    releaseDate: "2026-12-05",
    ageRating: "T13",
    formats: ["2D", "3D", "IMAX", "4DX"],
    status: "coming_soon",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 0,
  },
  {
    id: "m7",
    title: "Minions: Đội Quân Chuối",
    originalTitle: "Minions: Banana Squad",
    synopsis:
      "Gru và đội quân Minion quay trở lại với cuộc phiêu lưu mới tại vùng đất nhiệt đới Đông Nam Á. Những cú trượt chuối, những màn hóa trang và tình bạn bền chặt sẽ khiến cả gia đình bạn cười không ngừng.",
    genre: ["Hoạt hình", "Hài hước", "Gia đình"],
    duration: 92,
    director: "Kyle Balda",
    cast: ["Steve Carell", "Pierre Coffin", "Taraji P. Henson"],
    releaseDate: "2026-11-28",
    ageRating: "K",
    formats: ["2D", "3D"],
    status: "coming_soon",
    poster: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 0,
  },
  {
    id: "m8",
    title: "Bóng Tối Vĩnh Cửu",
    originalTitle: "Eternal Shadow",
    synopsis:
      "Thám tử Phong nhận án lệnh điều tra một vụ mất tích bí ẩn tại khu rừng già Tây Nguyên. Càng đào sâu, anh càng nhận ra rằng kẻ thực sự nguy hiểm không phải là người – mà là thứ đang ẩn nấp trong bóng tối ngàn năm của khu rừng.",
    genre: ["Kinh dị", "Bí ẩn", "Tội phạm"],
    duration: 105,
    director: "Victor Vũ",
    cast: ["Trấn Thành", "Ngô Kiến Huy", "Miu Lê", "Charlie Nguyễn"],
    releaseDate: "2026-09-05",
    ageRating: "T18",
    formats: ["2D"],
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1518343265568-51eec52d9a01?w=400&h=600&fit=crop&auto=format",
    backdrop: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&h=700&fit=crop&auto=format",
    trailerUrl: "#",
    rating: 7.6,
  },
];

// ─── CINEMAS ──────────────────────────────────────────────────────────────────

export const cinemas: Cinema[] = [
  {
    id: "c1",
    name: "CINEVERSE Vincom Center",
    city: "Hà Nội",
    address: "Tầng 5, Vincom Center Bà Triệu, 191 Bà Triệu, Hai Bà Trưng, Hà Nội",
    phone: "1900 6017",
    auditoriums: [
      { id: "a1", name: "Phòng 1 - IMAX", capacity: 200, formats: ["IMAX"], rows: 10, seatsPerRow: 20 },
      { id: "a2", name: "Phòng 2 - 4DX", capacity: 120, formats: ["4DX", "3D"], rows: 8, seatsPerRow: 15 },
      { id: "a3", name: "Phòng 3 - Standard", capacity: 160, formats: ["2D", "3D"], rows: 10, seatsPerRow: 16 },
    ],
  },
  {
    id: "c2",
    name: "CINEVERSE Landmark 81",
    city: "TP. Hồ Chí Minh",
    address: "Tầng 3, Vincom Mega Mall, 208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM",
    phone: "1900 6017",
    auditoriums: [
      { id: "a4", name: "Phòng 1 - IMAX", capacity: 250, formats: ["IMAX"], rows: 12, seatsPerRow: 20 },
      { id: "a5", name: "Phòng 2 - 4DX", capacity: 100, formats: ["4DX", "3D"], rows: 8, seatsPerRow: 12 },
      { id: "a6", name: "Phòng 3 - Standard", capacity: 180, formats: ["2D", "3D"], rows: 10, seatsPerRow: 18 },
      { id: "a7", name: "Phòng 4 - VIP", capacity: 60, formats: ["2D"], rows: 6, seatsPerRow: 10 },
    ],
  },
  {
    id: "c3",
    name: "CINEVERSE Sun World",
    city: "Đà Nẵng",
    address: "Tầng 4, AEON Mall Đà Nẵng, 381 Tôn Đức Thắng, Liên Chiểu, Đà Nẵng",
    phone: "1900 6017",
    auditoriums: [
      { id: "a8", name: "Phòng 1 - 3D", capacity: 150, formats: ["3D"], rows: 10, seatsPerRow: 15 },
      { id: "a9", name: "Phòng 2 - Standard", capacity: 140, formats: ["2D"], rows: 10, seatsPerRow: 14 },
    ],
  },
  {
    id: "c4",
    name: "CINEVERSE Hải Phòng Plaza",
    city: "Hải Phòng",
    address: "Tầng 5, Hải Phòng Plaza, 1 Trần Phú, Hồng Bàng, Hải Phòng",
    phone: "1900 6017",
    auditoriums: [
      { id: "a10", name: "Phòng 1 - Standard", capacity: 160, formats: ["2D", "3D"], rows: 10, seatsPerRow: 16 },
      { id: "a11", name: "Phòng 2 - 3D", capacity: 120, formats: ["3D"], rows: 8, seatsPerRow: 15 },
    ],
  },
];

// ─── SHOWTIMES ────────────────────────────────────────────────────────────────

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const d0 = fmt(today);
const d1 = fmt(new Date(today.getTime() + 86400000));
const d2 = fmt(new Date(today.getTime() + 86400000 * 2));
const d3 = fmt(new Date(today.getTime() + 86400000 * 3));

export const showtimes: Showtime[] = [
  // m1 - Đặc Vụ Không Gian
  { id: "s1", movieId: "m1", cinemaId: "c1", auditoriumId: "a1", date: d0, startTime: "09:15", endTime: "11:23", format: "IMAX", price: 150000, vipPrice: 200000, couplePrice: 350000, availableSeats: 85, totalSeats: 200 },
  { id: "s2", movieId: "m1", cinemaId: "c1", auditoriumId: "a3", date: d0, startTime: "13:30", endTime: "15:38", format: "2D", price: 95000, vipPrice: 130000, couplePrice: 230000, availableSeats: 120, totalSeats: 160 },
  { id: "s3", movieId: "m1", cinemaId: "c1", auditoriumId: "a1", date: d0, startTime: "19:00", endTime: "21:08", format: "IMAX", price: 150000, vipPrice: 200000, couplePrice: 350000, availableSeats: 60, totalSeats: 200 },
  { id: "s4", movieId: "m1", cinemaId: "c2", auditoriumId: "a4", date: d0, startTime: "10:00", endTime: "12:08", format: "IMAX", price: 160000, vipPrice: 210000, couplePrice: 380000, availableSeats: 100, totalSeats: 250 },
  { id: "s5", movieId: "m1", cinemaId: "c2", auditoriumId: "a6", date: d0, startTime: "14:45", endTime: "16:53", format: "3D", price: 110000, vipPrice: 150000, couplePrice: 270000, availableSeats: 75, totalSeats: 180 },
  { id: "s6", movieId: "m1", cinemaId: "c1", auditoriumId: "a2", date: d1, startTime: "11:00", endTime: "13:08", format: "4DX", price: 180000, vipPrice: 240000, couplePrice: 420000, availableSeats: 80, totalSeats: 120 },
  { id: "s7", movieId: "m1", cinemaId: "c1", auditoriumId: "a1", date: d1, startTime: "20:30", endTime: "22:38", format: "IMAX", price: 150000, vipPrice: 200000, couplePrice: 350000, availableSeats: 40, totalSeats: 200 },
  // m2 - Cô Dâu Bóng Tối
  { id: "s8", movieId: "m2", cinemaId: "c1", auditoriumId: "a3", date: d0, startTime: "10:00", endTime: "11:50", format: "2D", price: 90000, vipPrice: 120000, couplePrice: 210000, availableSeats: 90, totalSeats: 160 },
  { id: "s9", movieId: "m2", cinemaId: "c1", auditoriumId: "a3", date: d0, startTime: "15:00", endTime: "16:50", format: "2D", price: 90000, vipPrice: 120000, couplePrice: 210000, availableSeats: 45, totalSeats: 160 },
  { id: "s10", movieId: "m2", cinemaId: "c2", auditoriumId: "a6", date: d0, startTime: "18:30", endTime: "20:20", format: "2D", price: 95000, vipPrice: 130000, couplePrice: 230000, availableSeats: 110, totalSeats: 180 },
  // m3 - Người Khổng Lồ Xanh
  { id: "s11", movieId: "m3", cinemaId: "c1", auditoriumId: "a1", date: d0, startTime: "11:30", endTime: "13:55", format: "IMAX", price: 150000, vipPrice: 200000, couplePrice: 350000, availableSeats: 120, totalSeats: 200 },
  { id: "s12", movieId: "m3", cinemaId: "c2", auditoriumId: "a5", date: d0, startTime: "16:00", endTime: "18:25", format: "4DX", price: 185000, vipPrice: 245000, couplePrice: 440000, availableSeats: 35, totalSeats: 100 },
  { id: "s13", movieId: "m3", cinemaId: "c2", auditoriumId: "a4", date: d1, startTime: "09:30", endTime: "11:55", format: "IMAX", price: 160000, vipPrice: 210000, couplePrice: 380000, availableSeats: 180, totalSeats: 250 },
  // m4 - Hương Vị Quê Nhà
  { id: "s14", movieId: "m4", cinemaId: "c3", auditoriumId: "a8", date: d0, startTime: "13:00", endTime: "14:58", format: "3D", price: 100000, vipPrice: 135000, couplePrice: 240000, availableSeats: 95, totalSeats: 150 },
  { id: "s15", movieId: "m4", cinemaId: "c4", auditoriumId: "a10", date: d1, startTime: "17:30", endTime: "19:28", format: "2D", price: 85000, vipPrice: 115000, couplePrice: 200000, availableSeats: 130, totalSeats: 160 },
  // m8 - Bóng Tối Vĩnh Cửu
  { id: "s16", movieId: "m8", cinemaId: "c1", auditoriumId: "a3", date: d2, startTime: "21:00", endTime: "22:45", format: "2D", price: 90000, vipPrice: 120000, couplePrice: 210000, availableSeats: 55, totalSeats: 160 },
  { id: "s17", movieId: "m8", cinemaId: "c2", auditoriumId: "a6", date: d2, startTime: "22:15", endTime: "00:00", format: "2D", price: 95000, vipPrice: 130000, couplePrice: 230000, availableSeats: 70, totalSeats: 180 },
];

// ─── SEATS GENERATOR ──────────────────────────────────────────────────────────

export function generateSeats(auditoriumId: string): Seat[] {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const rowConfigs: Record<string, { count: number; type: SeatType }> = {
    A: { count: 12, type: "standard" },
    B: { count: 14, type: "standard" },
    C: { count: 14, type: "standard" },
    D: { count: 14, type: "standard" },
    E: { count: 14, type: "standard" },
    F: { count: 12, type: "vip" },
    G: { count: 12, type: "vip" },
    H: { count: 10, type: "vip" },
    I: { count: 8, type: "couple" },
    J: { count: 8, type: "couple" },
  };

  const occupiedPattern = new Set([
    "B3", "B4", "C7", "C8", "D2", "E5", "E6", "E7",
    "F3", "G4", "G5", "H2", "H3", "I2", "I3", "I4",
  ]);

  const seats: Seat[] = [];
  rows.forEach((row) => {
    const { count, type } = rowConfigs[row];
    for (let n = 1; n <= count; n++) {
      const key = `${row}${n}`;
      seats.push({
        id: `${auditoriumId}-${key}`,
        row,
        number: n,
        type,
        status: occupiedPattern.has(key) ? "occupied" : "available",
      });
    }
  });
  return seats;
}

// ─── FOOD & BEVERAGES ─────────────────────────────────────────────────────────

export const foodItems: FoodItem[] = [
  { id: "f1", name: "Bắp rang bơ lớn", description: "Bắp rang bơ cỡ lớn thơm béo, vừa đủ cho 2 người", price: 65000, category: "popcorn", image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&h=300&fit=crop&auto=format", popular: true },
  { id: "f2", name: "Bắp rang bơ vừa", description: "Bắp rang bơ cỡ vừa, nhẹ nhàng và thơm ngon", price: 45000, category: "popcorn", image: "https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=300&h=300&fit=crop&auto=format" },
  { id: "f3", name: "Bắp rang phô mai", description: "Bắp rang phủ lớp phô mai béo ngậy đặc biệt", price: 55000, category: "popcorn", image: "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=300&h=300&fit=crop&auto=format" },
  { id: "f4", name: "Coca-Cola lớn", description: "Nước ngọt có ga Coca-Cola size lớn 44oz với đá viên", price: 45000, category: "drinks", image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop&auto=format", popular: true },
  { id: "f5", name: "Pepsi lớn", description: "Pepsi size lớn mát lạnh, sảng khoái", price: 45000, category: "drinks", image: "https://images.unsplash.com/photo-1613792875200-8fc5aa4e4e33?w=300&h=300&fit=crop&auto=format" },
  { id: "f6", name: "Nước suối", description: "Nước khoáng Vĩnh Hảo 500ml", price: 20000, category: "drinks", image: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=300&h=300&fit=crop&auto=format" },
  { id: "f7", name: "Combo Đôi Cổ Điển", description: "1 Bắp lớn + 2 Nước 44oz – tiết kiệm 30.000₫", price: 135000, category: "combo", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=300&fit=crop&auto=format", popular: true },
  { id: "f8", name: "Combo Bạn Bè", description: "2 Bắp vừa + 2 Nước 44oz – tiết kiệm 40.000₫", price: 165000, category: "combo", image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop&auto=format", popular: true },
  { id: "f9", name: "Combo Gia Đình", description: "1 Bắp lớn + 2 Bắp vừa + 4 Nước 44oz – tiết kiệm 60.000₫", price: 280000, category: "combo", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=300&fit=crop&auto=format" },
  { id: "f10", name: "Hotdog phô mai", description: "Xúc xích nướng phủ phô mai kéo sợi", price: 55000, category: "snacks", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=300&fit=crop&auto=format" },
  { id: "f11", name: "Nachos & Salsa", description: "Bánh snack nachos giòn kèm sốt salsa cà chua tươi", price: 60000, category: "snacks", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=300&fit=crop&auto=format" },
  { id: "f12", name: "Kẹo gấu dẻo", description: "Gói kẹo gấu dẻo đủ màu sắc 200g", price: 35000, category: "snacks", image: "https://images.unsplash.com/photo-1582968568542-89befd52d3bb?w=300&h=300&fit=crop&auto=format" },
];

// ─── USERS ────────────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: "u1", name: "Nguyễn Thị Hoa", email: "hoa.nguyen@gmail.com", phone: "0901234567", avatar: "https://i.pravatar.cc/150?img=5", role: "customer", points: 2850, memberTier: "Gold", joinDate: "2023-03-15", totalBookings: 24, status: "active" },
  { id: "u2", name: "Trần Văn Minh", email: "minh.tran@gmail.com", phone: "0912345678", avatar: "https://i.pravatar.cc/150?img=12", role: "customer", points: 580, memberTier: "Silver", joinDate: "2024-01-20", totalBookings: 6, status: "active" },
  { id: "u3", name: "Lê Thị Thanh", email: "thanh.le@gmail.com", phone: "0923456789", avatar: "https://i.pravatar.cc/150?img=9", role: "customer", points: 8900, memberTier: "Platinum", joinDate: "2022-06-08", totalBookings: 87, status: "active" },
  { id: "u4", name: "Phạm Quốc Bảo", email: "bao.pham@cineverse.vn", phone: "0934567890", avatar: "https://i.pravatar.cc/150?img=15", role: "staff", cinemaId: "c1", points: 0, memberTier: "Silver", joinDate: "2023-09-01", totalBookings: 0, status: "active" },
  { id: "u5", name: "Vũ Thị Lan", email: "lan.vu@cineverse.vn", phone: "0945678901", avatar: "https://i.pravatar.cc/150?img=8", role: "manager", cinemaId: "c1", points: 0, memberTier: "Silver", joinDate: "2022-04-15", totalBookings: 0, status: "active" },
  { id: "u6", name: "Đặng Hữu Nghĩa", email: "nghia.dang@cineverse.vn", phone: "0956789012", avatar: "https://i.pravatar.cc/150?img=16", role: "admin", points: 0, memberTier: "Silver", joinDate: "2021-01-05", totalBookings: 0, status: "active" },
  { id: "u7", name: "Hoàng Thị Mai", email: "mai.hoang@gmail.com", phone: "0967890123", avatar: "https://i.pravatar.cc/150?img=10", role: "customer", points: 1200, memberTier: "Silver", joinDate: "2023-11-22", totalBookings: 12, status: "active" },
  { id: "u8", name: "Ngô Tuấn Kiệt", email: "kiet.ngo@gmail.com", phone: "0978901234", avatar: "https://i.pravatar.cc/150?img=14", role: "customer", points: 340, memberTier: "Silver", joinDate: "2025-02-14", totalBookings: 3, status: "inactive" },
];

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export const bookings: Booking[] = [
  { id: "BK240001", userId: "u1", movieId: "m1", cinemaId: "c1", showtimeId: "s3", seats: ["F5", "F6"], foodItems: [{ itemId: "f7", qty: 1 }], ticketTotal: 260000, foodTotal: 135000, discount: 0, total: 395000, paymentMethod: "Thẻ quốc tế", status: "upcoming", bookingDate: "2026-10-22", qrCode: "BK240001-QR" },
  { id: "BK230089", userId: "u1", movieId: "m3", cinemaId: "c2", showtimeId: "s12", seats: ["C8", "C9"], foodItems: [{ itemId: "f8", qty: 1 }], ticketTotal: 200000, foodTotal: 165000, discount: 30000, total: 335000, paymentMethod: "VNPay", status: "completed", bookingDate: "2026-10-10", qrCode: "BK230089-QR" },
  { id: "BK230078", userId: "u1", movieId: "m4", cinemaId: "c1", showtimeId: "s14", seats: ["I3", "I4"], foodItems: [], ticketTotal: 270000, foodTotal: 0, discount: 0, total: 270000, paymentMethod: "MoMo", status: "completed", bookingDate: "2026-09-28", qrCode: "BK230078-QR" },
];

// ─── PROMOTIONS ───────────────────────────────────────────────────────────────

export const promotions: Promotion[] = [
  { id: "p1", title: "Thứ Ba Vui Vẻ", description: "Giảm 30% tất cả các suất chiếu thứ Ba hàng tuần. Áp dụng cho tối đa 2 vé mỗi giao dịch.", code: "TUESDAY30", discountType: "percent", discountValue: 30, minSpend: 150000, maxDiscount: 60000, usageLimit: 500, usedCount: 234, startDate: "2026-10-01", endDate: "2026-12-31", status: "active", banner: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=300&fit=crop&auto=format" },
  { id: "p2", title: "Sinh Nhật CINEVERSE", description: "Mừng sinh nhật CINEVERSE 5 tuổi! Nhận ngay 50.000₫ khi đặt vé từ 200.000₫.", code: "BDAY5", discountType: "fixed", discountValue: 50000, minSpend: 200000, usageLimit: 1000, usedCount: 789, startDate: "2026-10-15", endDate: "2026-10-31", status: "active", banner: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=300&fit=crop&auto=format" },
  { id: "p3", title: "Học Sinh Sinh Viên", description: "Ưu đãi đặc biệt cho học sinh, sinh viên. Giảm 20% khi xuất trình thẻ học sinh/sinh viên hợp lệ.", code: "STUDENT20", discountType: "percent", discountValue: 20, minSpend: 100000, maxDiscount: 40000, usageLimit: 2000, usedCount: 1456, startDate: "2026-09-01", endDate: "2026-12-31", status: "active", banner: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=300&fit=crop&auto=format" },
  { id: "p4", title: "Lễ Quốc Khánh", description: "Chào mừng Quốc khánh 2/9! Combo gia đình đặc biệt giảm 25%.", code: "NATIONAL25", discountType: "percent", discountValue: 25, minSpend: 300000, usageLimit: 300, usedCount: 300, startDate: "2026-09-01", endDate: "2026-09-05", status: "expired", banner: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&h=300&fit=crop&auto=format" },
  { id: "p5", title: "Black Friday Cinema", description: "Giảm giá lên đến 40% cho tất cả vé phim ngày thứ Sáu đen. Số lượng có hạn!", code: "BLACKFRI", discountType: "percent", discountValue: 40, minSpend: 200000, maxDiscount: 100000, usageLimit: 200, usedCount: 0, startDate: "2026-11-29", endDate: "2026-11-29", status: "scheduled", banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop&auto=format" },
];

// ─── REVENUE DATA (for charts) ────────────────────────────────────────────────

export const revenueByDay = [
  { date: "17/10", revenue: 48500000, tickets: 512 },
  { date: "18/10", revenue: 52300000, tickets: 548 },
  { date: "19/10", revenue: 61200000, tickets: 634 },
  { date: "20/10", revenue: 89400000, tickets: 921 },
  { date: "21/10", revenue: 95600000, tickets: 1024 },
  { date: "22/10", revenue: 78900000, tickets: 832 },
  { date: "23/10", revenue: 42100000, tickets: 445 },
];

export const revenueByCinema = [
  { cinema: "Vincom HN", revenue: 285000000 },
  { cinema: "Landmark 81", revenue: 412000000 },
  { cinema: "Sun World ĐN", revenue: 156000000 },
  { cinema: "HP Plaza", revenue: 98000000 },
];

export const revenueByFormat = [
  { format: "IMAX", value: 35, revenue: 245000000 },
  { format: "4DX", value: 18, revenue: 126000000 },
  { format: "3D", value: 28, revenue: 196000000 },
  { format: "2D", value: 19, revenue: 133000000 },
];

export const occupancyData = [
  { movie: "Đặc Vụ KG", rate: 84 },
  { movie: "Cô Dâu BT", rate: 72 },
  { movie: "Người KLX", rate: 91 },
  { movie: "Hương Vị QN", rate: 65 },
  { movie: "Bóng Tối VC", rate: 58 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export const formatVND = (amount?: number) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0 ₫";
  }
  return amount.toLocaleString("vi-VN") + " ₫";
};

export const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} giờ ${m} phút`;
};

export const getMovieById = (id: string) => movies.find((m) => m.id === id);
export const getCinemaById = (id: string) => cinemas.find((c) => c.id === id);
export const getShowtimeById = (id: string) => showtimes.find((s) => s.id === id);
export const getShowtimesForMovie = (movieId: string, date?: string) =>
  showtimes.filter((s) => s.movieId === movieId && (!date || s.date === date));

export const RATING_COLORS: Record<AgeRating, string> = {
  K: "#35C98A",
  P: "#63A5FF",
  T13: "#F5B942",
  T16: "#F04452",
  T18: "#9B1C1C",
};
