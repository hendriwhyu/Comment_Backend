const { validationResult } = require('express-validator');
const Profile = require('../models/profile');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const UserController = {
  // @route    GET api/profile
  // @desc     Get all profiles
  // @access   Private
  getProfileUsers: async (req, res) => {
    try {
      const profiles = await Profile.findAll({
        attributes: ['photo', 'name', 'headTitle'],
        include: {
          model: User,
          as: 'user',
          attributes: ['email'],
        },
      });
      res.json({
        status: 'success',
        message: 'Profiles retrieved successfully',
        data: profiles,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  },

  // @route    GET api/profile/me
  // @desc     Get user by Token
  // @access   Private
  getUserByToken: async (req, res) => {
    try {
      const { token } = req.headers; // Ambil token dari header
      const responseJWT = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        where: { id: responseJWT.user.id },
        include: { model: Profile, as: 'profile', attributes: ['photo', 'name', 'headTitle'] },
      }); // Cari user berdasarkan id
      if (!user) {
        return res
          .status(404)
          .json({ status: 'error', message: 'User not found' });
      }
      res.json({
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  },

  // @route    GET api/profile/:id
  // @desc     Get profile by ID
  // @access   Private
  getProfileById: async (req, res) => {
    try {
      const profile = await Profile.findOne({
        where: { id: req.params.id },
        attributes: ['photo', 'name', 'headTitle'],
        include: {
          model: User,
          as: 'user',
          attributes: ['email'],
        },
      });
      if (!profile) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Profile not found' });
      }
      res.json({
        status: 'success',
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  },

  // @route    POST api/profile
  // @desc     Create or update profile
  // @access   Private
  updateProfileByAuth: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { photo, name, headTitle, phone } = req.body;

    try {
      let profile = await Profile.findOne({ where: { userId: req.user.id } });

      if (profile) {
        // Update existing profile
        await Profile.update(
          { photo, name, headTitle, phone },
          { where: { userId: req.user.id } },
        );
        return res.json({
          status: 'success',
          message: 'Profile updated successfully',
          data: profile,
        });
      }

      // Create new profile
      profile = await Profile.create({
        photo,
        name,
        headTitle,
        phone,
        userId: req.user.id,
      });

      res.json({
        status: 'success',
        message: 'Profile created successfully',
        data: profile,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  },

  // @route    DELETE api/profile/:id
  // @desc     Delete profile
  // @access   Private
  deleteProfile: async (req, res) => {
    try {
      const profile = await Profile.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!profile) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Profile not found' });
      }

      await Profile.destroy({ where: { id: req.params.id } });
      res.json({ status: 'success', message: 'Profile deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  },
};

module.exports = UserController;
