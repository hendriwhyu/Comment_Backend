const prisma = require('../utils/Prisma');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const UserController = {
  // @route    GET api/profile
  // @desc     Get all profiles
  // @access   Private
  getProfileUsers: async (req, res) => {
    try {
      const profiles = await prisma.profiles.findMany({
        select: {
          photo: true,
          name: true,
          headTitle: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      });
      res.json(profiles);
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
  getProfileById: async (req, res) => {
    try {
      const profile = await prisma.profiles.findUnique({
        where: { id: req.params.id },
        select: {
          photo: true,
          name: true,
          headTitle: true,
          Users: {
            select: {
              email: true,
            },
          },
        },
      });
      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      res.json(profile);
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
      let profile = await prisma.profile.findUnique({
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
  deleteProfile: async (req, res) => {
    try {
      const profile = await prisma.profiles.findUnique({
        where: {
          id: req.params.id,
          userId: req.user.id,
        },
      });

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      await prisma.profile.delete({
        where: { id: req.params.id },
      });
      res.json({ msg: 'Profile deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
};

module.exports = UserController;
