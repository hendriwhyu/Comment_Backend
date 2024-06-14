const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../utils/Prisma');
const router = express.Router();

router.post('/join', auth, async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    const userJoinEvent = await prisma.userJoinEvents.findFirst({
      where: {
        profileId: userId,
        eventId: eventId
      }
    });

    if (userJoinEvent) {
      return res.status(400).json({ msg: 'Already joined this event' });
    }

    await prisma.userJoinEvents.create({
      data: {
        eventId,
        profileId: userId,
        joinDate: new Date(),
        isActive: true,
      }
    });

    res.json({ msg: 'Joined event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/leave', auth, async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    const userJoinEvent = await prisma.userJoinEvents.findFirst({
      where: {
        profileId: userId,
        eventId: eventId
      }
    });

    if (!userJoinEvent) {
      return res.status(400).json({ msg: 'Not joined this event' });
    }

    await prisma.userJoinEvent.delete({ where: { id: userJoinEvent.id } });

    res.json({ msg: 'Left event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userJoinEvents = await prisma.userJoinEvents.findMany();
    res.json(userJoinEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const userJoinEvent = await prisma.userJoinEvents.findUnique({
      where: { id: parseInt(req.params.id) }
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
