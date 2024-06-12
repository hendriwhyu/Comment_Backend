const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const dotenv = require('dotenv');
const AuthController = require('../controller/AuthController');
const authVolunteer = require('../middleware/authVolunteer');

dotenv.config();

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
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
