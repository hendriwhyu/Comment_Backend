const prisma = require('../utils/Prisma');
exports.getPostsByRecentJoin = async (req, res) => {
  const userId = req.user.id;
  try {
    const posts = await prisma.posts.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        createdAt: true,
        owner: {
          select: {
            email: true,
            username: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        bookmarks: true,
        participants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({
      status: 'success',
      msg: 'Posts fetched',
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.jointEvent = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  try {
    const userJoinEvent = await prisma.userJoinEvents.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    if (userJoinEvent) {
      return res.status(400).json({ msg: 'Already joined this event' });
    }

    const joinEvent = await prisma.userJoinEvents.create({
      data: {
        eventId: eventId,
        userId: userId,
        joinDate: new Date(),
        isActive: true,
      },
    });

    res.json({ msg: 'Joined event successfully', data: joinEvent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.userLeave = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  try {
    const userJoinEvent = await prisma.userJoinEvents.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    if (!userJoinEvent) {
      return res.status(400).json({ msg: 'Not joined this event' });
    }

    await prisma.userJoinEvents.delete({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });

    res.json({ msg: 'Left event successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserJointEvent = async (req, res) => {
  try {
    const userJoinEvents = await prisma.userJoinEvents.findMany();
    res.json(userJoinEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserJointEventById = async (req, res) => {
  try {
    const userJoinEvent = await prisma.userJoinEvents.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!userJoinEvent) {
      return res.status(404).json({ msg: 'User Join Event not found' });
    }

    res.json(userJoinEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
