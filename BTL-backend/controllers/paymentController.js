const db = require('../config/db');
const crypto = require('crypto'); // Thư viện có sẵn của Node.js để tạo chuỗi ngẫu nhiên

exports.processPayment = async (req, res) => {
  const { booking_id, amount, payment_method } = req.body;

  try {
    // 1. Kiểm tra trạng thái booking
    const [bookings] = await db.query('SELECT status FROM bookings WHERE booking_id = ?', [booking_id]);
    if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt vé' });
    if (bookings[0].status === 'Confirmed') return res.status(400).json({ message: 'Vé này đã được thanh toán rồi' });

    // 2. Lưu giao dịch thanh toán
    await db.query(
      'INSERT INTO payments (booking_id, amount, payment_method) VALUES (?, ?, ?)',
      [booking_id, amount, payment_method]
    );

    // 3. Cập nhật booking thành "Confirmed"
    await db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', ['Confirmed', booking_id]);

    // 4. Sinh mã vé tự động (Giả lập QR Code bằng một chuỗi random)
    const ticketCode = 'TICKET-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    await db.query(
      'INSERT INTO tickets (booking_id, qr_code) VALUES (?, ?)',
      [booking_id, ticketCode]
    );

    res.status(200).json({ 
      message: 'Thanh toán thành công!',
      ticket_code: ticketCode 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};