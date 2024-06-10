const express = require('express');
const auth = require('../middleware/auth');
const UserJoinEvent = require('../models/userjoinevent');
const Profile = require('../models/profile');
const {joinEvent, leaveEvent } = require('../controller/UserJointEventController');
const router = express.Router();

router.post('/join', auth, joinEvent);

router.post('/leave', auth, leaveEvent);


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
