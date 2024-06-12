const express = require('express');
const { check } = require('express-validator');
const authVolunteer = require('../middleware/authVolunteer'); // Middleware untuk memeriksa volunteer
const auth = require('../middleware/auth'); // Middleware untuk memeriksa autentikasi(user)
const {
  getParticipants,
  getPostById,
} = require('../controller/PostsController');
const PostsController = require('../controller/PostsController');
const { upload } = require('../utils/File');
const router = express.Router();

// Mendapatkan partisipan
router.get('/:postId/participants', auth, getParticipants);
// Mendapatkan semua Post dengan lazy loading
router.get('/post', PostsController.getPosts);
router.get('/trends', PostsController.getPostsByTrends);
router.get('/bookmarks/:userId', PostsController.getPostsBookmarksByUser);
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
router.put('/:id', auth, PostsController.updatePost);
router.put('/:id', authVolunteer, PostsController.updatePost);

// Menghapus Post berdasarkan ID
router.delete('/:id', auth, PostsController.deletePost);
router.delete('/:id', authVolunteer, PostsController.deletePost);

router.get('/user/:userId', auth, PostsController.getPostsByUser);

module.exports = router;
