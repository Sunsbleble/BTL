const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// [UC1] Khách hàng đăng ký tài khoản
exports.register = async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  try {
    // 1. Kiểm tra email hoặc sđt đã tồn tại chưa (Luồng thay thế 5a)
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email hoặc Số điện thoại đã được đăng ký!' });
    }

    // 2. Băm mật khẩu (Yêu cầu NFR3)
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 3. Lưu thông tin tài khoản mới (Luồng thông thường 6)
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, phone, password_hash, 'Customer']
    );

    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC2] Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Kiểm tra tài khoản có tồn tại không
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Tài khoản chưa tồn tại!' });
    }

    const user = users[0];

    // Kiểm tra tài khoản có bị khóa không (Luồng thay thế)
    if (user.status === 'Locked') {
      return res.status(403).json({ message: 'Tài khoản của bạn đang bị khóa.' });
    }

    // 2. So sánh mật khẩu (Luồng thay thế 5a)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng!' });
    }

    // 3. Tạo Token phiên làm việc
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'BiMatCuaHeThongDatVe',
      { expiresIn: '1d' } // Token sống 1 ngày
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};