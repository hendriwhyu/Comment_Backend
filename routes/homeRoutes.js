const express = require('express');
const HomepageController = require('../controller/HomepageController');
const router = express.Router();

router.get('/user/:userId', HomepageController.getUserById);
router.get('/post/:postId', HomepageController.getPostById);
router.get('/', HomepageController.getTrendsPostsAndUsers);

module.exports = router;