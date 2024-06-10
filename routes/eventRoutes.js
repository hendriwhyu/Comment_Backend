const express = require('express');
const { check } = require('express-validator');
const authVolunteer = require('../middleware/authVolunteer'); // Middleware untuk memeriksa volunteer
const auth = require('../middleware/auth'); // Middleware untuk memeriksa autentikasi(user)
const { getParticipants } = require('../controller/EventController');
const eventController = require('../controller/EventController');
const router = express.Router();

// Mendapatkan partisipan
router.get('/:eventId/participants', auth, getParticipants);
// Mendapatkan semua event dengan lazy loading
router.get('/event', eventController.getEvents);

// Mendapatkan event berdasarkan title dengan pencarian (search)
router.get('/', eventController.getEventByTitle);

// Mendapatkan event berdasarkan title (exact match)
router.get('/:title', authVolunteer, eventController.getEventByExactTitle);

// Membuat event baru
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty()
  ]
], eventController.createEvent);

// Memperbarui event berdasarkan ID
router.put('/:id', authVolunteer, eventController.updateEvent);
router.put('/:id', auth, eventController.updateEvent);

// Menghapus event berdasarkan ID
router.delete('/:id', authVolunteer, eventController.deleteEvent);
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;
