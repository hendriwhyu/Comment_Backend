const { Op } = require('sequelize');
const Event = require('../models/event');
const UserJoinEvent = require('../models/userjoinevent');
const Profile = require('../models/profile');

exports.joinEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const userJoinEvent = await UserJoinEvent.findOne({ where: { profileId: profile.id, eventId } });
    if (userJoinEvent) {
      return res.status(400).json({ msg: 'Already joined this event' });
    }

    await UserJoinEvent.create({
      eventId,
      profileId: profile.id,
      joinDate: new Date(),
      isActive: true,
    });

    await Event.update(
      { totalParticipants: event.totalParticipants + 1 },
      { where: { id: eventId } }
    );

    res.json({ msg: 'Joined event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.leaveEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const userJoinEvent = await UserJoinEvent.findOne({ where: { profileId: profile.id, eventId } });
    if (!userJoinEvent) {
      return res.status(400).json({ msg: 'Not joined this event' });
    }

    await UserJoinEvent.destroy({ where: { id: userJoinEvent.id } });

    await Event.update(
      { totalParticipants: event.totalParticipants - 1 },
      { where: { id: eventId } }
    );

    res.json({ msg: 'Left event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
