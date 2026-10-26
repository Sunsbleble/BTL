const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// GET /api/bookings -> Lấy danh sách booking
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/showtime/:showtimeId/seats -> Lấy danh sách ghế
router.get('/showtime/:showtimeId/seats', bookingController.getSeatsByShowtime);

// POST /api/bookings -> Đặt vé
router.post('/', bookingController.createBooking);

module.exports = router;