const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/user/:userId', ticketController.getUserTickets);
router.post('/scan', ticketController.scanTicket);

module.exports = router;