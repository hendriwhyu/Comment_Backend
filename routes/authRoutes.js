
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const dotenv = require('dotenv');

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = await User.create({
        username,
        email,
        password,
        role: role || 'user' // Set role default 'user' jika user tidak di isi
      });

      const payload = {
        user: {
          id: user.id,
          role: user.role // Include role in the payload
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (!user) {
        console.log('User not found');
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role // Include role in the payload
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

