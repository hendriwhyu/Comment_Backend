const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../utils/Prisma');
const { Prisma } = require('@prisma/client');

const AuthController = {
  register: async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          errors: [{ msg: existingUser.username === username ? 'Username already exists' : 'Email already exists' }],
        });
      }

      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: await bcrypt.hash(password, 10),
          role,
        },
      });

      await prisma.profiles.create({
        data: {
          name: username,
          userId: newUser.id,
          photo: `https://api.dicebear.com/8.x/identicon/svg?seed=${username}`,
        },
      });

      res.json({ status: 'success', message: 'User created successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
        console.log('User not found');
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password does not match');
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role, // Include role in the payload
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '6h' },
        (err, token) => {
          if (err) throw err;
          res.json({ status: 'success', token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
};

module.exports = AuthController;
