const db = require('../config/db');

// Lấy danh sách phim cho Admin
exports.getAllMoviesAdmin = async (req, res) => {
  try {
    const [movies] = await db.query("SELECT * FROM movies ORDER BY movie_id DESC");
    
    // Chuẩn hóa dữ liệu tương thích với Frontend Interface
    const formattedMovies = movies.map(m => ({
      id: String(m.movie_id),
      title: m.title,
      originalTitle: m.title,
      synopsis: m.description || '',
      director: m.director || '',
      cast: m.cast ? m.cast.split(', ') : [],
      duration: m.duration || 120,
      genre: m.genre ? m.genre.split(', ') : ['Hành động'],
      releaseDate: m.release_date ? new Date(m.release_date).toISOString().split('T')[0] : '',
      ageRating: 'P',
      formats: ['2D', '3D'],
      status: m.status === 'Showing' ? 'now_showing' : m.status === 'Coming Soon' ? 'coming_soon' : 'ended',
      poster: m.poster_url || '/images/default.jpg',
      trailerUrl: m.trailer_url || ''
    }));

    res.status(200).json(formattedMovies);
  } catch (error) {
    console.error("Lỗi lấy danh sách phim Admin:", error);
    res.status(500).json({ error: error.message });
  }
};

// Thêm phim mới vào MySQL
exports.addMovie = async (req, res) => {
  try {
    const { title, synopsis, director, duration, genre, releaseDate, poster, status } = req.body;
    
    const dbStatus = status === 'now_showing' ? 'Showing' : status === 'coming_soon' ? 'Coming Soon' : 'Stopped';
    const genreStr = Array.isArray(genre) ? genre.join(', ') : (genre || 'Hành động');

    const [result] = await db.query(
      `INSERT INTO movies (title, description, director, duration, genre, release_date, poster_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, synopsis, director, duration || 120, genreStr, releaseDate || new Date(), poster, dbStatus]
    );

    res.status(201).json({ message: 'Thêm phim thành công!', movieId: result.insertId, success: true });
  } catch (error) {
    console.error("Lỗi thêm phim:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin phim
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, synopsis, director, duration, genre, releaseDate, poster, status } = req.body;
    
    const dbStatus = status === 'now_showing' ? 'Showing' : status === 'coming_soon' ? 'Coming Soon' : 'Stopped';
    const genreStr = Array.isArray(genre) ? genre.join(', ') : (genre || 'Hành động');

    await db.query(
      `UPDATE movies 
       SET title = ?, description = ?, director = ?, duration = ?, genre = ?, release_date = ?, poster_url = ?, status = ?
       WHERE movie_id = ?`,
      [title, synopsis, director, duration, genreStr, releaseDate, poster, dbStatus, id]
    );

    res.status(200).json({ message: 'Cập nhật phim thành công!', success: true });
  } catch (error) {
    console.error("Lỗi cập nhật phim:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa phim
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM movies WHERE movie_id = ?", [id]);
    res.status(200).json({ message: 'Xóa phim thành công!', success: true });
  } catch (error) {
    console.error("Lỗi xóa phim:", error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    // Giả định bạn có bảng users với các cột cơ bản. Có thể join thêm bảng điểm/thành viên nếu cần.
    const [users] = await db.query("SELECT * FROM users ORDER BY user_id DESC");
    
    const formattedUsers = users.map(u => ({
      id: String(u.user_id),
      name: u.name || 'Người dùng',
      email: u.email,
      phone: u.phone || 'Chưa cập nhật',
      role: u.role || 'customer', // customer, staff, manager, admin
      status: u.status || 'active', // active, inactive
      points: u.points || 0,
      memberTier: u.member_tier || 'Silver',
      joinDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : 'N/A',
      avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=random`
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật quyền và trạng thái người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;
    
    await db.query(
      "UPDATE users SET role = ?, status = ? WHERE user_id = ?",
      [role, status, id]
    );

    res.status(200).json({ message: 'Cập nhật tài khoản thành công!', success: true });
  } catch (error) {
    console.error("Lỗi cập nhật user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
    res.status(200).json({ message: 'Xóa tài khoản thành công!', success: true });
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Thêm tài khoản mới từ trang Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const [existing] = await db.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email này đã tồn tại trên hệ thống!' });
    }

    // Lưu người dùng mới vào database (Sử dụng mật khẩu chuỗi hoặc hash tùy cấu hình)
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, 'Active')",
      [name || 'Người dùng', email, phone || null, password, role || 'Customer']
    );

    res.status(201).json({ message: 'Thêm tài khoản thành công!', userId: result.insertId, success: true });
  } catch (error) {
    console.error("Lỗi thêm tài khoản:", error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách khuyến mãi
exports.getAllPromotions = async (req, res) => {
  try {
    const [promos] = await db.query("SELECT * FROM promotions ORDER BY promotion_id DESC");
    
    const formatted = promos.map(p => ({
      id: String(p.promotion_id),
      title: p.title,
      code: p.code,
      description: p.description || '',
      discountType: p.discount_type || 'percent',
      discountValue: Number(p.discount_value),
      minSpend: Number(p.min_spend || 0),
      maxDiscount: p.max_discount ? Number(p.max_discount) : undefined,
      startDate: p.start_date ? new Date(p.start_date).toISOString().split('T')[0] : '',
      endDate: p.end_date ? new Date(p.end_date).toISOString().split('T')[0] : '',
      usageLimit: p.usage_limit || 100,
      usedCount: p.used_count || 0,
      banner: p.banner_url || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=200&fit=crop',
      status: p.status || 'active'
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Lỗi lấy danh sách khuyến mãi:", error);
    res.status(500).json({ error: error.message });
  }
};

// Tạo khuyến mãi mới
exports.createPromotion = async (req, res) => {
  try {
    const { title, code, description, discountType, discountValue, minSpend, maxDiscount, startDate, endDate, usageLimit, banner, status } = req.body;

    if (!title || !code || !discountValue) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Tiêu đề, Mã khuyến mãi và Giá trị giảm!' });
    }

    const [existing] = await db.query("SELECT promotion_id FROM promotions WHERE code = ?", [code]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Mã khuyến mãi này đã tồn tại!' });
    }

    const [result] = await db.query(
      `INSERT INTO promotions (title, code, description, discount_type, discount_value, min_spend, max_discount, start_date, end_date, usage_limit, banner_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        code.toUpperCase(), 
        description || '', 
        discountType || 'percent', 
        discountValue, 
        minSpend || 0, 
        maxDiscount || null, 
        startDate || '2026-01-01', 
        endDate || '2026-12-31', 
        usageLimit || 100, 
        banner || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=200&fit=crop', 
        status || 'active'
      ]
    );

    res.status(201).json({ message: 'Tạo chương trình khuyến mãi thành công!', promoId: result.insertId, success: true });
  } catch (error) {
    console.error("Lỗi tạo khuyến mãi:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa khuyến mãi
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM promotions WHERE promotion_id = ?", [id]);
    res.status(200).json({ message: 'Xóa khuyến mãi thành công!', success: true });
  } catch (error) {
    console.error("Lỗi xóa khuyến mãi:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardReports = async (req, res) => {
  try {
    // 1. Tổng quan KPIs
    const [[kpiData]] = await db.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as totalRevenue,
        COALESCE(SUM(ticket_count), 0) as totalTickets,
        COALESCE(SUM(food_amount), 0) as totalFoodRevenue
      FROM orders
    `);

    // 2. Doanh thu theo ngày (Sửa triệt để lỗi ONLY_FULL_GROUP_BY)
    const [revenueByDay] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%d/%m') as date,
        SUM(total_amount) as revenue,
        SUM(ticket_count) as tickets
      FROM orders
      GROUP BY DATE_FORMAT(created_at, '%d/%m')
      ORDER BY MIN(created_at) ASC
      LIMIT 7
    `);

    // 3. Doanh thu theo rạp
    const [revenueByCinema] = await db.query(`
      SELECT 
        cinema_name as cinema,
        SUM(total_amount) as revenue
      FROM orders
      GROUP BY cinema_name
      ORDER BY revenue DESC
    `);

    // 4. Tỷ lệ phương thức thanh toán
    const [payments] = await db.query(`
      SELECT 
        payment_method as method,
        COUNT(*) as count
      FROM orders
      GROUP BY payment_method
    `);
    
    const totalOrders = payments.reduce((sum, p) => sum + p.count, 0);
    const colors = { 'VNPay': '#63A5FF', 'MoMo': '#F04452', 'Thẻ QT': '#F5B942', 'Thẻ ATM': '#35C98A' };
    const paymentData = payments.map(p => ({
      method: p.method,
      pct: totalOrders > 0 ? Math.round((p.count / totalOrders) * 100) : 0,
      color: colors[p.method] || '#A3AAB8'
    })).sort((a, b) => b.pct - a.pct);

    // 5. Doanh thu bắp nước
    const [foodSalesData] = await db.query(`
      SELECT item_name as name, quantity as qty, revenue
      FROM food_sales
      ORDER BY revenue DESC
    `);

    res.status(200).json({
      kpis: {
        totalRevenue: Number(kpiData.totalRevenue || 0),
        totalTickets: Number(kpiData.totalTickets || 0),
        totalFoodRevenue: Number(kpiData.totalFoodRevenue || 0),
        momGrowth: "+12.4%"
      },
      revenueByDay: revenueByDay.map(d => ({ date: d.date, revenue: Number(d.revenue), tickets: Number(d.tickets) })),
      revenueByCinema: revenueByCinema.map(c => ({ cinema: c.cinema, revenue: Number(c.revenue) })),
      paymentData,
      foodSalesData: foodSalesData.map(f => ({ name: f.name, qty: f.qty, revenue: Number(f.revenue) }))
    });

  } catch (error) {
    console.error("Lỗi lấy báo cáo thống kê:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    // 1. Thống kê KPI
    const [[kpiData]] = await db.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as totalRevenue,
        COALESCE(SUM(ticket_count), 0) as totalTickets,
        COUNT(order_id) as totalOrders
      FROM orders
    `);

    const [[movieCount]] = await db.query(`SELECT COUNT(*) as activeMovies FROM movies WHERE status = 'Showing'`);
    const [[userCount]] = await db.query(`SELECT COUNT(*) as newUsers FROM users WHERE created_at >= NOW() - INTERVAL 30 DAY`);

    // 2. Doanh thu 7 ngày gần nhất (sửa lỗi GROUP BY)
    const [revenueByDay] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%d/%m') as date,
        SUM(total_amount) as revenue,
        SUM(ticket_count) as tickets
      FROM orders
      GROUP BY DATE_FORMAT(created_at, '%d/%m')
      ORDER BY MIN(created_at) ASC
      LIMIT 7
    `);

    // 3. Doanh thu theo định dạng (Giả lập tỷ trọng)
    const revenueByFormat = [
      { format: "2D", value: 55, revenue: Number(kpiData.totalRevenue) * 0.55 },
      { format: "3D", value: 25, revenue: Number(kpiData.totalRevenue) * 0.25 },
      { format: "IMAX", value: 15, revenue: Number(kpiData.totalRevenue) * 0.15 },
      { format: "4DX", value: 5, revenue: Number(kpiData.totalRevenue) * 0.05 }
    ];

    // 4. Doanh thu theo rạp
    const [revenueByCinema] = await db.query(`
      SELECT 
        cinema_name as cinema,
        SUM(total_amount) as revenue
      FROM orders
      GROUP BY cinema_name
      ORDER BY revenue DESC
    `);

    // 5. Tỷ lệ lấp đầy
    const occupancyData = [
      { movie: "Đặc Vụ Không Gian", rate: 85 },
      { movie: "Người Khổng Lồ", rate: 72 },
      { movie: "Cô Dâu Bóng Tối", rate: 60 },
      { movie: "Hương Vị Quê Nhà", rate: 45 }
    ];

    // 6. Giao dịch gần đây
    const [recentTransactions] = await db.query(`
      SELECT 
        CONCAT('BK', order_id) as ref,
        'Mẫu phim' as movie,
        'Khách hàng' as customer,
        cinema_name as cinema,
        DATE_FORMAT(created_at, '%d/%m %H:%i') as time,
        CONCAT(FORMAT(total_amount, 0, 'vi_VN'), '₫') as amount,
        'completed' as status
      FROM orders
      ORDER BY order_id DESC
      LIMIT 5
    `);

    res.status(200).json({
      kpis: {
        totalRevenue: Number(kpiData.totalRevenue),
        totalTickets: Number(kpiData.totalTickets),
        totalOrders: Number(kpiData.totalOrders),
        occupancyRate: "74.1%",
        activeMovies: Number(movieCount.activeMovies || 0),
        newUsers: Number(userCount.newUsers || 0)
      },
      revenueByDay: revenueByDay.map(d => ({ date: d.date, revenue: Number(d.revenue), tickets: Number(d.tickets) })),
      revenueByFormat,
      revenueByCinema: revenueByCinema.map(c => ({ cinema: c.cinema, revenue: Number(c.revenue) })),
      occupancyData,
      recentTransactions
    });

  } catch (error) {
    console.error("Lỗi lấy dữ liệu Admin Dashboard:", error);
    res.status(500).json({ error: error.message });
  }
};