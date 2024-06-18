const express = require('express');
const { check } = require('express-validator');
const authVolunteer = require('../middleware/authVolunteer'); // Middleware untuk memeriksa volunteer
const auth = require('../middleware/auth'); // Middleware untuk memeriksa autentikasi(user)
const { getPostById } = require('../controller/PostsController');
const PostsController = require('../controller/PostsController');
const commentController = require('../controller/commentController');
const { upload } = require('../utils/File');
const router = express.Router();

// Mendapatkan semua Post dengan lazy loading
router.get('/post', PostsController.getPosts);
router.get('/trends', PostsController.getPostsByTrends);
router.get('/upcoming', PostsController.getPostsUpcoming);
router.get('/bookmarks', auth, PostsController.getPostsBookmarksByUser);
router.post('/:postId/bookmarks', auth, PostsController.createBookmark);
router.delete('/:postId/bookmarks', auth, PostsController.deleteBookmark);
//  Mendapatkan Post by id
router.get('/:postId', getPostById);
// Mendapatkan Post berdasarkan title dengan pencarian (search)
router.get('/', PostsController.getPostByTitle);

// Mendapatkan Post berdasarkan title (exact match)
router.get('/:title', authVolunteer, PostsController.getPostByExactTitle);

// Membuat Post baru
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('startDate', 'Start date is required').not().isEmpty(),
      check('endDate', 'End date is required').not().isEmpty(),
    ],
    upload.single('image'),
  ],
  PostsController.createPost,
);

// Memperbarui Post berdasarkan ID
router.put(
  '/:postId',
  [auth, upload.single('image')],
  PostsController.updatePost,
);
router.put('/:postId', authVolunteer, PostsController.updatePost);

// Menghapus Post berdasarkan ID
router.delete('/:postId', auth, PostsController.deletePost);

// Mendaptan Post dirinya sendiri
router.get('/user/:userId', auth, PostsController.getPostsByUser);

// Membuat komentar baru
router.post('/:postId/comments', auth, commentController.createComment);
router.get('/:postId/comments', auth, commentController.getComments);

// Mengupdate komentar berdasarkan ID
router.put(
  '/:postId/comments/:commentId',
  auth,
  commentController.updateComment,
);

// Menghapus komentar berdasarkan ID
router.delete(
  '/:postId/comments/:commentId',
  auth,
  commentController.deleteComment,
);

module.exports = router;
