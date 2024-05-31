const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../models/profile');
const User = require('../models/user');
const auth = require('../middleware/auth');

// @route    GET api/profile
// @desc     Get all profiles
// @access   Private
// @route    GET api/profile
// @desc     Get all profiles
// @access   Private

// GET profile
router.get('/', auth, async (req, res) => {
    try {
      const profiles = await Profile.findAll({
        attributes: ['photo', 'name', 'headTitle'],
        include: {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      });
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // @route    GET api/profile/:id
  // @desc     Get profile by ID
  // @access   Private
  router.get('/:id', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({
        where: { id: req.params.id },
        attributes: ['photo', 'name', 'headTitle'],
        include: {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      });
      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
// @route    POST api/profile
// @desc     Create or update profile
// @access   Private


//Update profile (belum dicoba pake method PUT)
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photo, name, headTitle, phone } = req.body;

    try {
      let profile = await Profile.findOne({ where: { userId: req.user.id } });

      if (profile) {
        // Update existing profile
        profile = await Profile.update(
          { photo, name, headTitle, phone },
          { where: { userId: req.user.id } }
        );
        return res.json(profile);
      }

      // Create new profile
      profile = new Profile({
        photo,
        name,
        headTitle,
        phone,
        userId: req.user.id
      });

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    DELETE api/profile/:id
// @desc     Delete profile
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    await Profile.destroy({ where: { id: req.params.id } });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
