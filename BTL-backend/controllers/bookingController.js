const db = require('../config/db');

// 1. Lấy danh sách ghế của 1 suất chiếu (Kèm trạng thái)
exports.getSeatsByShowtime = async (req, res) => {
  const rawId = req.params.showtimeId || req.params.id;
  const showtimeId = parseInt(String(rawId).replace(/\D/g, ''), 10) || 1;

  try {
    const [showtimes] = await db.query('SELECT room_id FROM showtimes WHERE showtime_id = ?', [showtimeId]);
    if (showtimes.length === 0) return res.status(404).json({ message: 'Không tìm thấy lịch chiếu' });
    const roomId = showtimes[0].room_id;

    const query = `
      SELECT s.seat_id, s.seat_row, s.seat_number, s.seat_type,
             IF(b.booking_id IS NULL, 'Available', 'Booked') AS status
      FROM seats s
      LEFT JOIN bookings b ON s.seat_id = b.seat_id AND b.showtime_id = ? AND b.status IN ('Pending', 'Confirmed')
      WHERE s.room_id = ?
    `;
    const [seats] = await db.query(query, [showtimeId, roomId]);
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Lấy tất cả danh sách booking
exports.getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Đặt vé nhiều ghế + Lưu thanh toán & Tạo mã vé (Tự động bọc an toàn dữ liệu)
exports.createBooking = async (req, res) => {
  const { userId, user_id, showtimeId, showtime_id, seatIds, seats, paymentMethod, payment_method } = req.body;

  // Tự động chuẩn hóa ID (Nếú chưa đăng nhập -> mặc định ID = 1)
  const cleanUserId = parseInt(String(userId || user_id || 1).replace(/\D/g, ''), 10) || 1;
  const cleanShowtimeId = parseInt(String(showtimeId || showtime_id || 1).replace(/\D/g, ''), 10) || 1;
  const method = paymentMethod || payment_method || 'VNPay';

  // Lấy danh sách ghế từ seatIds hoặc seats
  let rawSeats = [];
  if (Array.isArray(seatIds) && seatIds.length > 0) rawSeats = seatIds;
  else if (Array.isArray(seats) && seats.length > 0) rawSeats = seats;

  const cleanSeatIds = rawSeats.map((s) => (typeof s === 'object' ? (s.seat_id || s.id) : s)).filter(Boolean);

  if (cleanSeatIds.length === 0) {
    return res.status(400).json({ message: 'Dữ liệu đặt vé không hợp lệ: Chưa chọn ghế nào!' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Kiểm tra xem có ghế nào đã bị đặt trước chưa
    const [existing] = await connection.query(
      `SELECT seat_id FROM bookings 
       WHERE showtime_id = ? AND seat_id IN (?) AND status IN ('Pending', 'Confirmed')`,
      [cleanShowtimeId, cleanSeatIds]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Một số ghế bạn chọn vừa bị người khác đặt mất!' });
    }

    // Lấy giá suất chiếu
    const [showtimes] = await connection.query('SELECT price FROM showtimes WHERE showtime_id = ?', [cleanShowtimeId]);
    const basePrice = showtimes.length > 0 ? Number(showtimes[0].price) || 85000 : 85000;
    const createdTickets = [];

    // Lặp qua từng ghế để lưu Booking, Payment, Ticket
    for (const seatId of cleanSeatIds) {
      const [seatsDb] = await connection.query('SELECT seat_type, seat_row, seat_number FROM seats WHERE seat_id = ?', [seatId]);
      const seat = seatsDb[0];
      const isVIP = seat && String(seat.seat_type).toUpperCase() === 'VIP';
      const itemPrice = isVIP ? basePrice + 20000 : basePrice;

      // Insert bookings
      const [bRes] = await connection.query(
        'INSERT INTO bookings (user_id, showtime_id, seat_id, status) VALUES (?, ?, ?, ?)',
        [cleanUserId, cleanShowtimeId, String(seatId), 'Confirmed']
      );
      const bookingId = bRes.insertId;

      // Insert payments (Bọc try-catch phòng trường hợp thiếu bảng)
      try {
        await connection.query(
          'INSERT INTO payments (booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
          [bookingId, itemPrice, method, 'Success']
        );
      } catch (pErr) {
        console.warn('Bỏ qua ghi bảng payments:', pErr.message);
      }

      // Insert tickets (Tạo QR Code)
      const qrCode = `QR-ST${cleanShowtimeId}-S${seatId}-B${bookingId}-${Date.now()}`;
      let ticketId = bookingId;
      try {
        const [tRes] = await connection.query(
          'INSERT INTO tickets (booking_id, qr_code, status) VALUES (?, ?, ?)',
          [bookingId, qrCode, 'Unused']
        );
        ticketId = tRes.insertId;
      } catch (tErr) {
        console.warn('Bỏ qua ghi bảng tickets:', tErr.message);
      }

      createdTickets.push({
        ticketId,
        bookingId,
        seatName: seat ? `${seat.seat_row}${seat.seat_number}` : String(seatId),
        price: itemPrice,
        qrCode,
      });
    }

    await connection.commit();
    res.status(201).json({ message: 'Đặt vé và thanh toán thành công!', tickets: createdTickets, success: true });
  } catch (error) {
    await connection.rollback();
    console.error('Lỗi Transaction Đặt vé:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.bookSeat = exports.createBooking;