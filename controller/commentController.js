const prisma = require('../utils/Prisma');

// Mendapatkan komentar dengan pagination dan informasi profil
exports.getComments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { eventId } = req.params;

  // Validasi UUID
  if (!uuidValidate(eventId)) {
    return res.status(400).json({ msg: 'Invalid eventId format' });
  }

  try {
    const offset = (page - 1) * limit;
    const comments = await prisma.comments.findMany({
      where: {
        eventId,
      },
      include: {
        User: {
          // Sesuaikan nama relasi dengan model Anda
          select: {
            profile: {
              select: {
                name: true,
                photo: true,
                headTitle: true,
              },
            },
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = await prisma.comments.count({
      where: {
        eventId,
      },
    });

    const totalPages = Math.ceil(total / limit);
    const commentData = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      owner: {
        name: comment.User.profile.name,
        photo: comment.User.profile.photo,
        headTitle: comment.User.profile.headTitle,
      },
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

exports.createComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    const userId = req.user.id;
    const newComment = await prisma.comments.create({
      data: {
        content,
        postId: postId,
        userId: userId,
      },
    });

    res.json({ status: 'success', data: newComment });
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
  const { commentId } = req.params;

  try {
    const comment = await prisma.comments.findUnique({
      where: {
        id: commentId,
      },
      include: {
        owner: true, // Including the User to check the owner of the comment
      },
    });

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Ensure only the owner can update the comment
    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ msg: 'You are not authorized to update this comment' });
    }

    const updatedComment = await prisma.comments.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
      include: {
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.json({ msg: 'Comment updated', data: updatedComment });
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
        id: req.params.commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await prisma.comments.delete({
      where: {
        id: req.params.commentId,
      },
    });

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
