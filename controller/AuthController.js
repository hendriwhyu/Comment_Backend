const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const AuthController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(400).json({ status: 'error', message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ status: 'success', message: 'User registered successfully', data: { token } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ status: 'error', message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ status: 'success', message: 'Logged in successfully', data: { token } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }
};

module.exports = AuthController;
