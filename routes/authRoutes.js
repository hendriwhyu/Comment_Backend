const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const dotenv = require('dotenv');
const auth = require('../middleware/auth')
const AuthController = require('../controller/AuthController');
const PostsController = require('../controller/PostsController')

dotenv.config();

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post(
  '/register',
  AuthController.register
);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  AuthController.login
);

module.exports = router;
