const db = require('../config/db');

// [UC5] Khách hàng xem danh sách suất chiếu
exports.getAllShowtimes = async (req, res) => {
  try {
    const query = `
      SELECT s.showtime_id, s.start_time, s.end_time, s.price, 
             m.movie_id, m.title AS movie_title, m.poster_url, 
             r.room_name 
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN rooms r ON s.room_id = r.room_id
      WHERE s.status = 'Active'
      ORDER BY s.start_time ASC
    `;
    const [showtimes] = await db.query(query);
    res.status(200).json(showtimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC12] Admin tạo lịch chiếu mới
exports.createShowtime = async (req, res) => {
  const { movie_id, room_id, start_time, end_time, price } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO showtimes (movie_id, room_id, start_time, end_time, price, status) VALUES (?, ?, ?, ?, ?, "Active")',
      [movie_id, room_id, start_time, end_time, price]
    );
    res.status(201).json({ message: 'Tạo lịch chiếu thành công!', showtime_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sơ đồ ghế chuẩn rạp CGV (3 loại ghế: Thường, VIP, Đôi)
exports.getSeatsByShowtime = async (req, res) => {
  const rawId = req.params.id;
  const showtimeId = parseInt(rawId.toString().replace(/\D/g, ''), 10) || 1;

  try {
    // 1. Tìm room_id của suất chiếu
    const [showtimes] = await db.query(
      'SELECT room_id FROM showtimes WHERE showtime_id = ?',
      [showtimeId]
    );
    const roomId = showtimes.length > 0 ? showtimes[0].room_id : 1;

    // 2. Lấy dữ liệu ghế thực tế từ MySQL (nếu có)
    const [dbSeats] = await db.query(
      `SELECT s.*, 
              CASE WHEN b.booking_id IS NOT NULL THEN 'booked' ELSE 'available' END AS booking_status
       FROM seats s
       LEFT JOIN bookings b ON b.seat_id = s.seat_id 
           AND b.showtime_id = ? 
           AND b.status IN ('Pending', 'Confirmed')
       WHERE s.room_id = ?
       ORDER BY s.seat_row, s.seat_number`,
      [showtimeId, roomId]
    );

    const formattedSeats = [];

    if (dbSeats && dbSeats.length > 0) {
      // Chuẩn hóa dữ liệu nếu trong Database đã có ghế
      dbSeats.forEach((s) => {
        const rowStr = String(s.seat_row || s.row || 'A').toUpperCase();
        const numVal = parseInt(s.seat_number || s.number || 1, 10);

        let seatType = s.seat_type || 'Standard';
        if (!s.seat_type) {
          if (['A', 'B', 'C'].includes(rowStr)) seatType = 'Standard';
          else if (['D', 'E', 'F', 'G', 'H'].includes(rowStr)) seatType = 'VIP';
          else if (rowStr === 'J') seatType = 'Couple';
        }

        formattedSeats.push({
          id: s.seat_id || `${rowStr}${numVal}`,
          seat_id: s.seat_id || `${rowStr}${numVal}`,
          row: rowStr,
          seat_row: rowStr,
          number: numVal,
          seat_number: numVal,
          type: seatType,
          status: s.booking_status || 'available',
          is_booked: s.booking_status === 'booked'
        });
      });
    } else {
      // Tự động tạo sơ đồ ghế chuẩn CGV theo ảnh:
      // A (10 ghế), B & C (15 ghế Thường)
      // D -> H (15 ghế VIP)
      // J (12 ghế Đôi Sweetbox)
      const layoutConfig = [
        { row: 'A', count: 10, type: 'Standard' },
        { row: 'B', count: 15, type: 'Standard' },
        { row: 'C', count: 15, type: 'Standard' },
        { row: 'D', count: 15, type: 'VIP' },
        { row: 'E', count: 15, type: 'VIP' },
        { row: 'F', count: 15, type: 'VIP' },
        { row: 'G', count: 15, type: 'VIP' },
        { row: 'H', count: 15, type: 'VIP' },
        { row: 'J', count: 12, type: 'Couple' }, // Ghế đôi (Sweetbox)
      ];

      layoutConfig.forEach(({ row, count, type }) => {
        for (let num = 1; num <= count; num++) {
          formattedSeats.push({
            id: `${row}${num}`,
            seat_id: `${row}${num}`,
            row: row,
            seat_row: row,
            number: num,
            seat_number: num,
            type: type,
            status: 'available',
            is_booked: false
          });
        }
      });
    }

    res.status(200).json(formattedSeats);
  } catch (error) {
    console.error('Lỗi lấy sơ đồ ghế CGV:', error);
    res.status(500).json({ error: error.message });
  }
};