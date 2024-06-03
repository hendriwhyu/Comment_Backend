const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const UserJoinEvent = require('../models/userjoinevent');
const router = express.Router();

// @route    POST api/user-join-event
// @desc     User join an event
// @access   Private
router.post('/', [
  auth,
  [
    check('eventId', 'Event ID is required').not().isEmpty(),
    check('profileId', 'Profile ID is required').not().isEmpty(),
    check('joinDate', 'Join Date is required').not().isEmpty(),
    check('isActive', 'isActive is required').isBoolean()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventId, profileId, joinDate, isActive } = req.body;

  try {
    const userJoinEvent = new UserJoinEvent({
      eventId,
      profileId,
      joinDate,
      isActive
    });

    await userJoinEvent.save();
    res.json(userJoinEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/user-join-event
// @desc     Get all user join events
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const userJoinEvents = await UserJoinEvent.findAll();
    res.json(userJoinEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/user-join-event/:id
// @desc     Get user join event by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const userJoinEvent = await UserJoinEvent.findOne({
      where: { id: req.params.id }
    });

    if (!userJoinEvent) {
      return res.status(404).json({ msg: 'User Join Event not found' });
    }

    res.json(userJoinEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
