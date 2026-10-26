const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Chức năng Public (Ai cũng xem được)
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

// Chức năng Admin (Sau này sẽ thêm middleware kiểm tra quyền Admin bảo mật sau)
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;