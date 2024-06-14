const prisma = require('../utils/Prisma');

// Mendapatkan semua komentar
exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comments.findMany();
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mendapatkan komentar dengan pagination dan informasi profil
exports.getComments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { eventId } = req.params;

  try {
    const offset = (page - 1) * limit;
    const comments = await prisma.comments.findMany({
      where: {
        eventId,
      },
      include: {
        profile: {
          select: {
            name: true,
            photo: true,
            headTitle: true,
          }
        }
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: 'asc',
      }
    });

    const total = await prisma.comments.count({
      where: {
        eventId,
      },
    });

    const totalPages = Math.ceil(total / limit);
    const commentData = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      owner: {
        name: comment.profile.name,
        photo: comment.profile.photo,
        headTitle: comment.profile.headTitle,
      }
    }));

    res.json({
      total,
      pages: totalPages,
      data: commentData,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Membuat komentar baru
exports.createComment = async (req, res) => {
  const { content } = req.body;
  const { eventId } = req.params;

  try {
    const profile = await prisma.profiles.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    const newComment = await prisma.comments.create({
      data: {
        content,
        eventId,
        profileId: profile.id,
      },
    });

    res.json(newComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Menghapus komentar berdasarkan eventId jika event sudah berakhir
exports.deleteCommentsForEndedEvents = async () => {
  try {
    await prisma.comments.deleteMany({
      where: {
        eventId: {
          lt: new Date(),
        },
      },
    });
  } catch (err) {
    console.error(err.message);
  }
};

// Mengupdate komentar berdasarkan ID
exports.updateComment = async (req, res) => {
  const { content } = req.body;

  try {
    const comment = await prisma.comments.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await prisma.comment.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        content,
      },
    });

    res.json({ msg: 'Comment updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Menghapus komentar berdasarkan ID
exports.deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comments.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await prisma.comments.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
