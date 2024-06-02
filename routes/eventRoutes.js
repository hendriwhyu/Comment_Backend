const express = require('express');
const { check, validationResult } = require('express-validator');
const authVolunteer = require('../middleware/authVolunteer'); // Middleware untuk memeriksa volunteer
const auth = require('../middleware/auth'); // Middleware untuk memeriksa autentikasi(user)
const Event = require('../models/event');
const router = express.Router();
const { Op } = require('sequelize');

// @route    GET api/events
// @desc     Get all events
// @access   Private (only volunteer)
router.get('/', authVolunteer, async (req, res) => {
  const { title } = req.query;

  try {
    let events;

    if (title) {
      // Cari event berdasarkan kata kunci pada title
      events = await Event.findAll({
        where: {
          title: {
            [Op.like]: `%${title}%`
          }
        }
      });
    } else {
      // Ambil semua event jika tidak ada query parameter title
      events = await Event.findAll();
    }

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/events/title/:title
// @desc     Get event by title
// @access   Private (only volunteer)
router.get('/:title', authVolunteer, async (req, res) => {
  try {
    const event = await Event.findOne({ where: { title: req.params.title } });

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/events
// @desc     Create an event
// @access   Private (only volunteer)
router.post('/', [
  auth, // Middleware untuk memeriksa autentikasi
  [
    check('title', 'Title is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, category, description, startDate, endDate, maxParticipants, image } = req.body;

  // Cek verifikasi  'user'
  if (req.user.role === 'user' && category !== 'News') {
    return res.status(403).json({ msg: 'Users can only create events with category News' });
  }

  try {
    const event = new Event({
      title,
      category,
      description,
      startDate,
      endDate,
      maxParticipants,
      image
    });

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/events/:id
// @desc     Update an event
// @access   Private (only volunteer)
router.put('/:id', authVolunteer, async (req, res) => {
  const { title, category, description, startDate, endDate, maxParticipants, image } = req.body;

  const eventFields = {};
  if (title) eventFields.title = title;
  if (category) eventFields.category = category;
  if (description) eventFields.description = description;
  if (startDate) eventFields.startDate = startDate;
  if (endDate) eventFields.endDate = endDate;
  if (maxParticipants) eventFields.maxParticipants = maxParticipants;
  if (image) eventFields.image = image;

  try {
    let event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    event = await Event.update(eventFields, {
      where: {
        id: req.params.id
      }
    });

    res.json({ msg: 'Event updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    DELETE api/events/:id
// @desc     Delete an event
// @access   Private (only volunteer)
router.delete('/:id', authVolunteer, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.destroy({ where: { id: req.params.id } });

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
