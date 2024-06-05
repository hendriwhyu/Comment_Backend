const Comment = require('../models/comment');

// Mendapatkan semua komentar
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json({ status: 'success', message: 'Comments retrieved successfully', data: comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Membuat komentar baru
exports.createComment = async (req, res) => {
  const { eventId, content, profileId } = req.body;

  try {
    const comment = await Comment.create({ eventId, content, profileId });
    res.json({ status: 'success', message: 'Comment created successfully', data: comment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Mengupdate komentar berdasarkan ID
exports.updateComment = async (req, res) => {
  const { eventId, content, profileId } = req.body;

  try {
    let comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ status: 'error', message: 'Comment not found' });
    }

    await Comment.update({ eventId, content, profileId }, {
      where: {
        id: req.params.id
      }
    });

    res.json({ status: 'success', message: 'Comment updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Menghapus komentar berdasarkan ID
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ status: 'error', message: 'Comment not found' });
    }

    await Comment.destroy({ where: { id: req.params.id } });

    res.json({ status: 'success', message: 'Comment removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
