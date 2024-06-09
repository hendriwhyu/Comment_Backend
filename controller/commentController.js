const { Op } = require('sequelize');
const Comment = require('../models/comment');
const Profile = require('../models/profile')


// Mendapatkan semua komentar
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.getComments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { eventId } = req.params;

  try {
    const offset = (page - 1) * limit;
    const comments = await Comment.findAndCountAll({
      where: {
        eventId,
      },
      include: {
        model: Profile,
        attributes: ['name', 'photo', 'headTitle']
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'ASC']]
    });

    const total = comments.count;
    const totalPages = Math.ceil(total / limit);
    const commentData = comments.rows.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      owner: {
        name: comment.Profile.name,
        photo: comment.Profile.photo,
        headTitle: comment.Profile.headTitle,
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
    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    const newComment = await Comment.create({
      content,
      eventId,
      profileId: profile.id,
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
    await Comment.destroy({
      where: {
        eventId: {
          [Op.in]: sequelize.literal(`
            SELECT id FROM "Events" WHERE "endDate" < NOW()
          `)
        }
      }
    });
  } catch (err) {
    console.error(err.message);
  }
};

// Mengupdate komentar berdasarkan ID
exports.updateComment = async (req, res) => {
  const {content} = req.body;

  try {
    let comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await Comment.update({content}, {
      where: {
        id: req.params.id
      }
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
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await Comment.destroy({ where: { id: req.params.id } });

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
