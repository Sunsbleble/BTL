const db = require('../config/db');

// [UC4] Khách hàng xem danh sách phim (Public)
exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM movies ORDER BY release_date DESC');
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC4] Xem chi tiết 1 bộ phim
exports.getMovieById = async (req, res) => {
  try {
    const [movie] = await db.query('SELECT * FROM movies WHERE movie_id = ?', [req.params.id]);
    if (movie.length === 0) return res.status(404).json({ message: 'Không tìm thấy phim' });
    res.status(200).json(movie[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC11] Admin thêm phim mới
exports.createMovie = async (req, res) => {
  const { title, description, director, cast, release_date, duration, genre, poster_url, trailer_url, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO movies (title, description, director, cast, release_date, duration, genre, poster_url, trailer_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, director, cast, release_date, duration, genre, poster_url, trailer_url, status || 'Showing']
    );
    res.status(201).json({ message: 'Thêm phim thành công!', movie_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC11] Admin cập nhật phim
exports.updateMovie = async (req, res) => {
  const { title, description, duration, status } = req.body; 
  try {
    await db.query(
      'UPDATE movies SET title = ?, description = ?, duration = ?, status = ? WHERE movie_id = ?',
      [title, description, duration, status, req.params.id]
    );
    res.status(200).json({ message: 'Cập nhật phim thành công!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [UC11] Admin xóa phim
exports.deleteMovie = async (req, res) => {
  try {
    await db.query('DELETE FROM movies WHERE movie_id = ?', [req.params.id]);
    res.status(200).json({ message: 'Xóa phim thành công!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};