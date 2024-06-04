const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controller/commentController');

// Mendapatkan semua komentar
router.get('/', auth, commentController.getAllComments);

// Membuat komentar baru
router.post('/', auth, commentController.createComment);

// Mengupdate komentar berdasarkan ID
router.put('/:id', auth, commentController.updateComment);

// Menghapus komentar berdasarkan ID
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
