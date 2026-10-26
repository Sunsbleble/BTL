const db = require('../config/db');

// Kiểm tra tính hợp lệ của vé
exports.validateTicket = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ status: 'invalid', message: 'Vui lòng nhập mã vé' });

    const cleanCode = code.trim().toUpperCase();

    // Tìm kiếm trong bảng tickets & bookings
    const [tickets] = await db.query(`
      SELECT 
        t.ticket_id,
        t.qr_code,
        t.status as ticket_status,
        b.booking_id,
        b.seat_id,
        m.title as movie_title,
        m.poster_url,
        r.room_name as cinema_name,
        s.start_time
      FROM tickets t
      JOIN bookings b ON t.booking_id = b.booking_id
      JOIN showtimes s ON b.showtime_id = s.showtime_id
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN rooms r ON s.room_id = r.room_id
      WHERE t.qr_code = ? 
         OR b.booking_id = ? 
         OR CONCAT('BK', b.booking_id) = ?
         OR t.qr_code LIKE CONCAT('%', ?, '%')
    `, [cleanCode, cleanCode.replace(/^BK/i, ''), cleanCode, cleanCode.replace(/^POS/i, '')]);

    if (tickets.length === 0) {
      return res.status(200).json({ status: 'invalid', message: 'Mã đặt vé không tồn tại trong hệ thống' });
    }

    const t = tickets[0];
    const seatsList = tickets.map(item => item.seat_id);

    const formattedData = {
      id: t.qr_code || `BK${t.booking_id}`,
      orderId: t.booking_id,
      movieTitle: t.movie_title,
      poster: t.poster_url || '/images/dune.jpg',
      cinemaName: t.cinema_name,
      showtimeDate: new Date(t.start_time).toLocaleDateString('vi-VN'),
      showtimeTime: new Date(t.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      format: '2D Digital',
      seats: seatsList
    };

    if (t.ticket_status === 'Used') {
      return res.status(200).json({ status: 'used', result: formattedData });
    }

    return res.status(200).json({ status: 'valid', result: formattedData });

  } catch (error) {
    console.error("Lỗi kiểm soát vé:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Xác nhận cho khách vào rạp
exports.confirmCheckIn = async (req, res) => {
  try {
    const { orderId } = req.body;
    await db.query(`UPDATE tickets SET status = 'Used' WHERE booking_id = ?`, [orderId]);
    res.status(200).json({ success: true, message: 'Xác nhận vé thành công!' });
  } catch (error) {
    console.error("Lỗi xác nhận cho vào:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Lấy thống kê cho Staff Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Thống kê Doanh thu POS hôm nay
    const [[revenueResult]] = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) as posRevenueToday
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);

    // 2. Thống kê số lượng vé
    const [[ticketsResult]] = await db.query(`
      SELECT 
        COUNT(CASE WHEN status = 'Used' THEN 1 END) as usedCount,
        COUNT(CASE WHEN status = 'Unused' THEN 1 END) as validCount,
        COUNT(*) as totalTickets
      FROM tickets
    `);

    // 3. Suất chiếu hôm nay/sắp chiếu
    const [sessions] = await db.query(`
      SELECT 
        s.showtime_id,
        m.title as movie,
        DATE_FORMAT(s.start_time, '%H:%i') as time,
        r.room_name as room,
        r.capacity as total,
        COUNT(b.booking_id) as sold,
        IF(s.start_time <= NOW() AND s.end_time >= NOW(), 'now', 'upcoming') as status
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN rooms r ON s.room_id = r.room_id
      LEFT JOIN bookings b ON s.showtime_id = b.showtime_id AND b.status != 'Cancelled'
      WHERE s.status = 'Active'
      GROUP BY s.showtime_id, m.title, s.start_time, s.end_time, r.room_name, r.capacity
      ORDER BY s.start_time ASC
      LIMIT 6
    `);

    // 4. Lịch sử soát vé gần đây
    const [scans] = await db.query(`
      SELECT 
        t.ticket_id,
        COALESCE(t.qr_code, CONCAT('BK', b.booking_id)) as \`ref\`,
        m.title as movie,
        DATE_FORMAT(t.created_at, '%H:%i') as time,
        b.seat_id as seats,
        CASE 
          WHEN t.status = 'Used' THEN 'used'
          WHEN t.status = 'Unused' THEN 'valid'
          ELSE 'invalid'
        END as status
      FROM tickets t
      JOIN bookings b ON t.booking_id = b.booking_id
      JOIN showtimes s ON b.showtime_id = s.showtime_id
      JOIN movies m ON s.movie_id = m.movie_id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      kpis: {
        totalScannedToday: ticketsResult.usedCount + ticketsResult.validCount,
        validCount: ticketsResult.validCount,
        usedCount: ticketsResult.usedCount,
        posRevenueToday: revenueResult.posRevenueToday
      },
      sessions: sessions || [],
      recentScans: scans || []
    });

  } catch (error) {
    console.error("Lỗi getDashboardStats:", error.message);
    res.status(500).json({ error: error.message });
  }
};