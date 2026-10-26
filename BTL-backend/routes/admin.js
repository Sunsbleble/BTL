const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/movies', adminController.getAllMoviesAdmin);
router.post('/movies', adminController.addMovie);
router.put('/movies/:id', adminController.updateMovie);
router.delete('/movies/:id', adminController.deleteMovie);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users', adminController.createUser);
router.get('/promotions', adminController.getAllPromotions);
router.post('/promotions', adminController.createPromotion);
router.delete('/promotions/:id', adminController.deletePromotion);
router.get('/reports', adminController.getDashboardReports);
router.get('/dashboard', adminController.getAdminDashboard);

module.exports = router;