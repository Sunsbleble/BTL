const db = require('../config/db');

// [UC3] Khách hàng xem lịch sử vé đã đặt
exports.getUserTickets = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT t.qr_code, t.status AS ticket_status, 
             m.title, s.start_time, r.room_name, st.seat_row, st.seat_number,
             p.amount, p.payment_date
      FROM tickets t
      JOIN bookings b ON t.booking_id = b.booking_id
      JOIN showtimes s ON b.showtime_id = s.showtime_id
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN rooms r ON s.room_id = r.room_id
      JOIN seats st ON b.seat_id = st.seat_id
      JOIN payments p ON b.booking_id = p.booking_id
      WHERE b.user_id = ?
      ORDER BY p.payment_date DESC
    `;
    const [tickets] = await db.query(query, [userId]);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC9] Nhân viên quét mã QR để soát vé
exports.scanTicket = async (req, res) => {
  const { qr_code } = req.body;
  try {
    const [tickets] = await db.query('SELECT * FROM tickets WHERE qr_code = ?', [qr_code]);
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Mã vé không tồn tại!' });
    }

    const ticket = tickets[0];
    if (ticket.status === 'Used') {
      return res.status(400).json({ message: 'Vé này ĐÃ ĐƯỢC SỬ DỤNG!' });
    }

    // Cập nhật trạng thái vé thành đã sử dụng
    await db.query('UPDATE tickets SET status = ? WHERE ticket_id = ?', ['Used', ticket.ticket_id]);
    
    res.status(200).json({ message: 'Soát vé thành công! Hợp lệ cho khách vào rạp.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};