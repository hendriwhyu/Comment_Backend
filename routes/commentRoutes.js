const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controller/CommentController');

// Mendapatkan semua komentar
router.get('/', auth, commentController.getAllComments);
router.get('/:eventId', auth, commentController.getComments)

// Membuat komentar baru
router.post('/:eventId', auth, commentController.createComment);

// Mengupdate komentar berdasarkan ID
router.put('/:id', auth, commentController.updateComment);

// Menghapus komentar berdasarkan ID
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
