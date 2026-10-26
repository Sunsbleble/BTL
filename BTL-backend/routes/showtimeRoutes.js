const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

// Lấy tất cả suất chiếu
router.get('/', showtimeController.getAllShowtimes);

// Tạo suất chiếu mới
router.post('/', showtimeController.createShowtime);

// API Lấy danh sách ghế theo showtime_id (Khắc phục lỗi 404)
router.get('/:id/seats', showtimeController.getSeatsByShowtime);

module.exports = router;