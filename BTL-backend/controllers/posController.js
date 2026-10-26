const db = require('../config/db');

// 1. Lấy danh sách Phim đang chiếu & Bắp nước
exports.getPOSData = async (req, res) => {
  try {
    const [movies] = await db.query(
      `SELECT movie_id, title, poster_url, genre, duration, status FROM movies WHERE status = 'Showing'`
    );
    const [foodItems] = await db.query(
      `SELECT id, name, price, is_active FROM food_items WHERE is_active = 1`
    );

    res.status(200).json({ 
      movies: movies || [], 
      foodItems: foodItems || [] 
    });
  } catch (error) {
    console.error("Lỗi getPOSData:", error.message);
    res.status(500).json({ error: error.message, movies: [], foodItems: [] });
  }
};

// 2. Lấy danh sách suất chiếu theo movie_id
exports.getShowtimes = async (req, res) => {
  try {
    const { movieId } = req.params;

    const [showtimes] = await db.query(`
      SELECT 
        s.showtime_id as id,
        s.movie_id,
        s.room_id,
        s.start_time,
        s.end_time,
        s.price,
        ROUND(s.price * 1.25, -3) as vip_price,
        ROUND(s.price * 2.0, -3) as couple_price,
        '2D Digital' as format,
        'CINEVERSE Vincom' as cinema_name,
        r.room_name as auditorium_name
      FROM showtimes s
      JOIN rooms r ON s.room_id = r.room_id
      WHERE s.movie_id = ? AND s.status = 'Active'
      ORDER BY s.start_time ASC
    `, [movieId]);

    res.status(200).json(showtimes || []);
  } catch (error) {
    console.error("Lỗi lấy suất chiếu POS:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 3. Lấy sơ đồ ghế theo showtime_id
exports.getSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    // Lấy room_id từ suất chiếu
    const [[showtime]] = await db.query(`SELECT room_id FROM showtimes WHERE showtime_id = ?`, [showtimeId]);
    if (!showtime) return res.status(200).json([]);

    // Lấy tất cả ghế thuộc phòng này
    let [seats] = await db.query(`SELECT * FROM seats WHERE room_id = ?`, [showtime.room_id]);

    // BẪY PHÒNG VỆ: Nếu phòng chưa có ghế trong CSDL, tự sinh sơ đồ ghế ảo (Hàng A -> E)
    if (!seats || seats.length === 0) {
      const rows = ['A', 'B', 'C', 'D', 'E'];
      seats = [];
      rows.forEach((r) => {
        for (let i = 1; i <= 10; i++) {
          seats.push({
            seat_id: `${r}${i}`,
            room_id: showtime.room_id,
            seat_row: r,
            seat_number: i,
            seat_type: r === 'C' || r === 'D' ? 'VIP' : r === 'E' ? 'Couple' : 'Normal'
          });
        }
      });
    }

    // Lấy danh sách các ghế đã được đặt trong suất chiếu
    let bookedSeatIds = [];
    try {
      const [booked] = await db.query(
        `SELECT seat_id FROM bookings WHERE showtime_id = ? AND status != 'Cancelled'`,
        [showtimeId]
      );
      bookedSeatIds = booked.map(b => b.seat_id);
    } catch (e) {
      console.log("Chưa có đơn đặt ghế cho suất chiếu này.");
    }

    // Chuẩn hóa dữ liệu trả về cho Frontend
    const formattedSeats = seats.map(s => ({
      id: s.seat_id,
      row: s.seat_row,
      number: s.seat_number,
      type: s.seat_type ? s.seat_type.toLowerCase() : 'normal',
      status: bookedSeatIds.includes(s.seat_id) ? 'occupied' : 'available'
    }));

    res.status(200).json(formattedSeats);
  } catch (error) {
    console.error("Lỗi lấy ghế POS:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 4. Tạo đơn hàng POS (Đồng bộ vào orders, bookings và tickets)
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { showtimeId, seats, food, totalAmount, payMethod } = req.body;

    const ticketCount = seats ? seats.length : 0;
    const foodAmount = food ? food.reduce((sum, f) => sum + (f.price * f.qty), 0) : 0;

    // a. Tạo Order
    const [orderRes] = await connection.query(`
      INSERT INTO orders (cinema_name, total_amount, ticket_count, food_amount, payment_method, created_at)
      VALUES ('CINEVERSE Vincom', ?, ?, ?, ?, NOW())
    `, [totalAmount, ticketCount, foodAmount, payMethod || 'Tiền mặt']);

    const orderId = orderRes.insertId;

    // b. Lưu thông tin vé
    if (seats && seats.length > 0) {
      for (const seat of seats) {
        // Thêm vào order_tickets
        await connection.query(
          `INSERT INTO order_tickets (order_id, seat_id, price) VALUES (?, ?, ?)`,
          [orderId, seat.id, seat.price]
        );

        // Thêm vào bookings
        const [bookingRes] = await connection.query(`
          INSERT INTO bookings (user_id, showtime_id, seat_id, status)
          VALUES (1, ?, ?, 'Confirmed')
        `, [showtimeId, seat.id]);

        const bookingId = bookingRes.insertId;
        const qrCode = `BK${orderId}-${seat.id}`;

        // Sinh mã vé vào bảng tickets để phục vụ Soát vé
        await connection.query(`
          INSERT INTO tickets (booking_id, qr_code, status)
          VALUES (?, ?, 'Unused')
        `, [bookingId, qrCode]);
      }
    }

    // c. Lưu thông tin bắp nước
    if (food && food.length > 0) {
      for (const item of food) {
        await connection.query(
          `INSERT INTO order_food (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, item.id, item.qty, item.price]
        );
      }
    }

    await connection.commit();
    res.status(200).json({ success: true, transactionRef: `POS${orderId}` });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi tạo đơn hàng POS:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};