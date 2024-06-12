const prisma = require('../utils/Prisma');

exports.joinEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const userJoinEvent = await prisma.userJoinEvents.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
    if (userJoinEvent) {
      return res.status(400).json({ msg: 'Already joined this event' });
    }

    await prisma.userJoinEvents.create({
      data: {
        eventId,
        userId,
        joinDate: new Date(),
        isActive: true,
      },
    });

    res.json({ status: 'success', msg: 'Joined event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.leaveEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const userJoinEvent = await prisma.userJoinEvents.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
    if (!userJoinEvent) {
      return res.status(400).json({ msg: 'Not joined this event' });
    }

    await prisma.userJoinEvents.delete({ where: { userId: userId } });

    res.json({ status: 'success', msg: 'Left event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
