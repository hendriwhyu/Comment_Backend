const prisma = require('../utils/Prisma');

exports.joinEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {

    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const userJoinEvent = await prisma.userJoinEvent.findFirst({
      where: {
        profileId: profile.id,
        eventId: eventId
      }
    });
    if (userJoinEvent) {
      return res.status(400).json({ msg: 'Already joined this event' });
    }

    await prisma.userJoinEvent.create({
      data: {
        eventId,
        profileId: profile.id,
        joinDate: new Date(),
        isActive: true,
      }
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { totalParticipants: event.totalParticipants + 1 }
    });

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
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const userJoinEvent = await prisma.userJoinEvent.findFirst({
      where: {
        profileId: profile.id,
        eventId: eventId
      }
    });
    if (!userJoinEvent) {
      return res.status(400).json({ msg: 'Not joined this event' });
    }

    await prisma.userJoinEvent.delete({ where: { id: userJoinEvent.id } });

    await prisma.event.update({
      where: { id: eventId },
      data: { totalParticipants: event.totalParticipants - 1 }
    });

    res.json({ msg: 'Left event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
