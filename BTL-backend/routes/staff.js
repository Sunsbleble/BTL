const express = require('express');
const router = express.Router();

const posController = require('../controllers/posController');
const staffController = require('../controllers/staffController');

// Thống kê Dashboard
router.get('/dashboard-stats', staffController.getDashboardStats);

// POS Bán vé
router.get('/pos/init', posController.getPOSData);
router.get('/pos/showtimes/:movieId', posController.getShowtimes);
router.get('/pos/seats/:showtimeId', posController.getSeats);
router.post('/pos/order', posController.createOrder);

// Soát vé
router.post('/validate-ticket', staffController.validateTicket);
router.post('/confirm-checkin', staffController.confirmCheckIn);

module.exports = router;