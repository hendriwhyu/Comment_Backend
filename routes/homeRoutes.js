const express = require('express');
const HomepageController = require('../controller/HomepageController');
const router = express.Router();

router.get('/', HomepageController.getTrendsPostsAndUsers);

module.exports = router;