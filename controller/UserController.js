const prisma = require('../utils/Prisma');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profile: {
            select: {
              name: true,
              headTitle: true,
              phone: true,
              photo: true,
            },
          },
        },
      });
      res.json({ status: 'success', msg: 'Users fetched', data: users });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
  // @route    GET api/profile/me
  // @desc     Get user by Token
  // @access   Private
  getUserByToken: async (req, res) => {
    try {
      const { token } = req.headers; // Ambil token dari header
      const responseJWT = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.users.findUnique({
        where: { id: responseJWT.user.id },
        select: {
          username: true,
          email: true,
          id: true,
          role: true,
          profile: {
            select: {
              photo: true,
              name: true,
              headTitle: true,
            },
          },
        },
      }); // Cari user berdasarkan id
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json({ status: 'success', data: user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // @route    GET api/profile/:id
  // @desc     Get profile by ID
  // @access   Private
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          profile: {
            select: {
              photo: true,
              name: true,
              headTitle: true,
              phone: true,
            },
          },
          recentEvents: true,
          posts: true,
        },
      });
      res.json({ status: 'success', msg: 'User fetched', data: user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // @route    POST api/profile
  // @desc     Create or update profile
  // @access   Private
  updateProfileByAuth: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photo, name, headTitle, phone } = req.body;

    try {
      // Check if profile exists
      let profile = await prisma.profiles.findUnique({
        where: { userId: req.user.id },
      });

      if (profile) {
        // Update existing profile
        profile = await prisma.profiles.update({
          where: { userId: req.user.id },
          data: { photo, name, headTitle, phone },
        });
        return res.json(profile);
      }

      // Create new profile
      profile = await prisma.profiles.create({
        data: {
          photo,
          name,
          headTitle,
          phone,
          userId: req.user.id,
        },
      });

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },


  // @route    DELETE api/profile/:id
  // @desc     Delete profile
  // @access   Private
  deleteUserProfile: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: req.params.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      await prisma.users.delete({
        where: { id: req.params.id },
      });
      res.json({ status: 'success', msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
};

module.exports = UserController;
