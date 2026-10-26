DROP DATABASE IF EXISTS btl_cinema;
CREATE DATABASE btl_cinema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE btl_cinema;

-- 1. BẢNG NGƯỜI DÙNG
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'Customer', -- Các role: Customer, Staff, Admin
  status VARCHAR(20) DEFAULT 'Active',   -- Active, Locked
  loyalty_points INT DEFAULT 0,
  member_level VARCHAR(30) DEFAULT 'Standard',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. BẢNG PHIM
CREATE TABLE movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  director VARCHAR(100),
  cast TEXT,
  release_date DATE,
  duration INT NOT NULL, -- Thời lượng tính bằng phút
  genre VARCHAR(100),
  poster_url VARCHAR(255),
  trailer_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'Showing', -- Showing, Coming Soon, Stopped
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. BẢNG PHÒNG CHIẾU
CREATE TABLE rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL
);

-- 4. BẢNG LỊCH CHIẾU
CREATE TABLE showtimes (
  showtime_id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  room_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- 5. BẢNG GHẾ NGỒI (Khóa chính kết hợp room_id + seat_id)
CREATE TABLE seats (
  room_id INT NOT NULL,
  seat_id VARCHAR(10) NOT NULL,
  seat_row VARCHAR(5) NOT NULL,
  seat_number INT NOT NULL,
  seat_type VARCHAR(20) DEFAULT 'Normal', -- Normal, VIP, Couple
  PRIMARY KEY (room_id, seat_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- 6. BẢNG ĐẶT VÉ CÁ NHÂN
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  showtime_id INT NOT NULL,
  seat_id VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending', -- Pending, Confirmed, Cancelled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id) ON DELETE CASCADE
);

-- 7. BẢNG THANH TOÁN
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Credit Card',
  status VARCHAR(20) DEFAULT 'Success',
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- 8. BẢNG VÉ QR
CREATE TABLE tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'Unused', -- Unused, Used
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- 9. BẢNG KHUYẾN MÃI
CREATE TABLE promotions (
  promotion_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) DEFAULT 'percent',
  discount_value DECIMAL(10,2) NOT NULL,
  min_spend DECIMAL(10,2) DEFAULT 0.00,
  max_discount DECIMAL(10,2) DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  usage_limit INT DEFAULT 1000,
  used_count INT DEFAULT 0,
  banner_url VARCHAR(255) DEFAULT '/images/promo-default.jpg',
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG ĐƠN HÀNG POS / TỔNG
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  cinema_name VARCHAR(100) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  ticket_count INT DEFAULT 0,
  food_amount DECIMAL(15,2) DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. BẢNG BẮP NƯỚC
CREATE TABLE food_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1
);

-- 12. BẢNG CHI TIẾT VÉ TRONG ĐƠN HÀNG POS
CREATE TABLE order_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  seat_id VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 13. BẢNG CHI TIẾT BẮP NƯỚC TRONG ĐƠN HÀNG POS
CREATE TABLE order_food (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
);

-- 14. BẢNG THỐNG KÊ BẮP NƯỚC (DÙNG CHO BÁO CÁO ADMIN)
CREATE TABLE food_sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  revenue DECIMAL(15,2) NOT NULL
);

-- =========================================================
-- CHÈN DỮ LIỆU MẪU
-- =========================================================

-- 1. Thêm Phòng chiếu
INSERT INTO rooms (room_name, capacity) VALUES 
('Phòng 1 (Standard)', 50), 
('Phòng 2 (IMAX)', 80);

-- 2. Thêm Phim
INSERT INTO movies (title, description, director, cast, release_date, duration, genre, poster_url, trailer_url, status) VALUES 
('Dune: Part Two', 'Cuộc hành trình thần thoại của Paul Atreides khi anh liên kết với Chani và người Fremen để trả thù những kẻ đã hủy hoại gia đình mình.', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya', '2024-03-01', 166, 'Hành động, Viễn tưởng', '/images/dune.jpg', '', 'Showing'),
('Kung Fu Panda 4', 'Po phải đối mặt với một kẻ thù mới có khả năng biến hình thành bất kỳ đối thủ nào trong quá khứ của cậu.', 'Mike Mitchell', 'Jack Black, Awkwafina', '2024-03-08', 94, 'Hoạt hình, Hài hước', '/images/kungfupanda4.jpg', '', 'Showing'),
('Godzilla x Kong: The New Empire', 'Godzilla và Kong phải hợp sức để đối mặt với một mối đe dọa khổng lồ ẩn sâu trong Trái Đất.', 'Adam Wingard', 'Rebecca Hall, Brian Tyree Henry', '2024-03-29', 115, 'Hành động, Quái vật', '/images/gorila.jpg', '', 'Coming Soon'),
('Deadpool & Wolverine', 'Deadpool thay đổi lịch sử Vũ trụ Điện ảnh Marvel cùng với Wolverine.', 'Shawn Levy', 'Ryan Reynolds, Hugh Jackman', '2024-07-26', 120, 'Hành động, Hài hước', '/images/Deadpool.jpg', '', 'Coming Soon'),
('Avengers: Endgame', 'Sau những sự kiện tàn khốc do Thanos gây ra, các siêu anh hùng còn sống sót phải tập hợp lại một lần cuối để đảo ngược thảm họa.', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Scarlett Johansson', '2019-04-26', 181, 'Hành động, Viễn tưởng', '/images/avengers.jpg', '', 'Showing');

-- 3. Thêm Suất chiếu
INSERT INTO showtimes (movie_id, room_id, start_time, end_time, price, status) VALUES 
(2, 1, '2026-10-26 09:00:00', '2026-10-26 10:34:00', 85000.00, 'Active'),
(2, 2, '2026-10-26 14:00:00', '2026-10-26 15:34:00', 120000.00, 'Active'),
(2, 1, '2026-10-26 19:30:00', '2026-10-26 21:04:00', 95000.00, 'Active'),
(1, 1, '2026-10-26 20:00:00', '2026-10-26 22:46:00', 100000.00, 'Active'),
(5, 2, '2026-10-26 21:00:00', '2026-10-26 23:01:00', 130000.00, 'Active'),
(4, 2, '2026-10-27 20:00:00', '2026-10-27 22:00:00', 150000.00, 'Active');

-- 4. Thêm Tài khoản Phân quyền (Mật khẩu băm Bcrypt: 123456)
INSERT INTO users (full_name, email, phone, password_hash, role, status) VALUES
('Quản trị viên', 'admin@test.com', '0900000001', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin', 'Active'),
('Nhân viên POS', 'staff@test.com', '0900000002', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Staff', 'Active'),
('Khách hàng Test', 'customer@test.com', '0900000003', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Customer', 'Active');

-- 5. Thêm Ghế cho PHÒNG 1 (room_id = 1)
INSERT INTO seats (room_id, seat_id, seat_row, seat_number, seat_type) VALUES
('1', 'A1', 'A', 1, 'Normal'), ('1', 'A2', 'A', 2, 'Normal'), ('1', 'A3', 'A', 3, 'Normal'), ('1', 'A4', 'A', 4, 'Normal'), ('1', 'A5', 'A', 5, 'Normal'),
('1', 'A6', 'A', 6, 'Normal'), ('1', 'A7', 'A', 7, 'Normal'), ('1', 'A8', 'A', 8, 'Normal'), ('1', 'A9', 'A', 9, 'Normal'), ('1', 'A10', 'A', 10, 'Normal'),
('1', 'B1', 'B', 1, 'Normal'), ('1', 'B2', 'B', 2, 'Normal'), ('1', 'B3', 'B', 3, 'Normal'), ('1', 'B4', 'B', 4, 'Normal'), ('1', 'B5', 'B', 5, 'Normal'),
('1', 'B6', 'B', 6, 'Normal'), ('1', 'B7', 'B', 7, 'Normal'), ('1', 'B8', 'B', 8, 'Normal'), ('1', 'B9', 'B', 9, 'Normal'), ('1', 'B10', 'B', 10, 'Normal'),
('1', 'C1', 'C', 1, 'Normal'), ('1', 'C2', 'C', 2, 'Normal'), ('1', 'C3', 'C', 3, 'Normal'), ('1', 'C4', 'C', 4, 'Normal'), ('1', 'C5', 'C', 5, 'Normal'),
('1', 'C6', 'C', 6, 'Normal'), ('1', 'C7', 'C', 7, 'Normal'), ('1', 'C8', 'C', 8, 'Normal'), ('1', 'C9', 'C', 9, 'Normal'), ('1', 'C10', 'C', 10, 'Normal'),
('1', 'D1', 'D', 1, 'VIP'), ('1', 'D2', 'D', 2, 'VIP'), ('1', 'D3', 'D', 3, 'VIP'), ('1', 'D4', 'D', 4, 'VIP'), ('1', 'D5', 'D', 5, 'VIP'),
('1', 'D6', 'D', 6, 'VIP'), ('1', 'D7', 'D', 7, 'VIP'), ('1', 'D8', 'D', 8, 'VIP'), ('1', 'D9', 'D', 9, 'VIP'), ('1', 'D10', 'D', 10, 'VIP'),
('1', 'E1', 'E', 1, 'VIP'), ('1', 'E2', 'E', 2, 'VIP'), ('1', 'E3', 'E', 3, 'VIP'), ('1', 'E4', 'E', 4, 'VIP'), ('1', 'E5', 'E', 5, 'VIP'),
('1', 'E6', 'E', 6, 'VIP'), ('1', 'E7', 'E', 7, 'VIP'), ('1', 'E8', 'E', 8, 'VIP'), ('1', 'E9', 'E', 9, 'VIP'), ('1', 'E10', 'E', 10, 'VIP'),
('1', 'J1', 'J', 1, 'Couple'), ('1', 'J2', 'J', 2, 'Couple'), ('1', 'J3', 'J', 3, 'Couple'), ('1', 'J4', 'J', 4, 'Couple'), ('1', 'J5', 'J', 5, 'Couple');

-- 6. Thêm Ghế cho PHÒNG 2 (room_id = 2)
INSERT INTO seats (room_id, seat_id, seat_row, seat_number, seat_type) VALUES
('2', 'A1', 'A', 1, 'Normal'), ('2', 'A2', 'A', 2, 'Normal'), ('2', 'A3', 'A', 3, 'Normal'), ('2', 'A4', 'A', 4, 'Normal'), ('2', 'A5', 'A', 5, 'Normal'),
('2', 'A6', 'A', 6, 'Normal'), ('2', 'A7', 'A', 7, 'Normal'), ('2', 'A8', 'A', 8, 'Normal'), ('2', 'A9', 'A', 9, 'Normal'), ('2', 'A10', 'A', 10, 'Normal'),
('2', 'B1', 'B', 1, 'Normal'), ('2', 'B2', 'B', 2, 'Normal'), ('2', 'B3', 'B', 3, 'Normal'), ('2', 'B4', 'B', 4, 'Normal'), ('2', 'B5', 'B', 5, 'Normal'),
('2', 'B6', 'B', 6, 'Normal'), ('2', 'B7', 'B', 7, 'Normal'), ('2', 'B8', 'B', 8, 'Normal'), ('2', 'B9', 'B', 9, 'Normal'), ('2', 'B10', 'B', 10, 'Normal'),
('2', 'C1', 'C', 1, 'VIP'), ('2', 'C2', 'C', 2, 'VIP'), ('2', 'C3', 'C', 3, 'VIP'), ('2', 'C4', 'C', 4, 'VIP'), ('2', 'C5', 'C', 5, 'VIP'),
('2', 'C6', 'C', 6, 'VIP'), ('2', 'C7', 'C', 7, 'VIP'), ('2', 'C8', 'C', 8, 'VIP'), ('2', 'C9', 'C', 9, 'VIP'), ('2', 'C10', 'C', 10, 'VIP'),
('2', 'D1', 'D', 1, 'VIP'), ('2', 'D2', 'D', 2, 'VIP'), ('2', 'D3', 'D', 3, 'VIP'), ('2', 'D4', 'D', 4, 'VIP'), ('2', 'D5', 'D', 5, 'VIP'),
('2', 'D6', 'D', 6, 'VIP'), ('2', 'D7', 'D', 7, 'VIP'), ('2', 'D8', 'D', 8, 'VIP'), ('2', 'D9', 'D', 9, 'VIP'), ('2', 'D10', 'D', 10, 'VIP'),
('2', 'E1', 'E', 1, 'Couple'), ('2', 'E2', 'E', 2, 'Couple'), ('2', 'E3', 'E', 3, 'Couple'), ('2', 'E4', 'E', 4, 'Couple'), ('2', 'E5', 'E', 5, 'Couple');

-- 7. Thêm Bắp nước mẫu
INSERT INTO food_items (id, name, price, is_active) VALUES
(1, 'Bắp rang bơ (Lớn)', 60000, 1),
(2, 'Coca Cola (Lớn)', 35000, 1),
(3, 'Combo Đôi Cổ Điển', 120000, 1);

-- 8. Thêm Khuyến mãi mẫu
INSERT INTO promotions (title, code, description, discount_type, discount_value, min_spend, max_discount, start_date, end_date, usage_limit, used_count, status)
VALUES ('Ưu đãi bạn mới', 'XINCHAO2026', 'Giảm 20% cho đơn hàng đầu tiên', 'percent', 20.00, 100000.00, 50000.00, '2026-01-01', '2026-12-31', 500, 12, 'active');

-- 9. Thêm Đơn hàng mẫu
INSERT INTO orders (cinema_name, total_amount, ticket_count, food_amount, payment_method, created_at) VALUES 
('Vincom Center', 15000000, 150, 5000000, 'VNPay', '2026-10-20 14:00:00'),
('Aeon Mall', 22000000, 200, 8000000, 'MoMo', '2026-10-21 15:30:00'),
('Landmark 81', 18500000, 180, 6500000, 'Thẻ QT', '2026-10-22 18:00:00'),
('Vincom Center', 31000000, 310, 9000000, 'VNPay', '2026-10-23 19:00:00'),
('Aeon Mall', 28000000, 270, 7500000, 'Thẻ ATM', '2026-10-24 20:00:00'),
('Lotte Cinema', 12000000, 110, 3000000, 'MoMo', '2026-10-25 14:00:00'),
('Landmark 81', 35000000, 350, 12000000, 'VNPay', '2026-10-26 21:00:00');

-- 10. Thêm Doanh thu Bắp nước mẫu
INSERT INTO food_sales (item_name, quantity, revenue) VALUES 
('Bắp rang bơ lớn', 1234, 80210000),
('Combo Đôi Cổ Điển', 892, 120420000),
('Combo Bạn Bè', 634, 104610000),
('Coca-Cola lớn', 1876, 84420000),
('Hotdog phô mai', 445, 24475000);