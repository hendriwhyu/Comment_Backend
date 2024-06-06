const Comment = require('../models/comment');

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

// Membuat komentar baru
exports.createComment = async (req, res) => {
  const { eventId, content, profileId } = req.body;

  try {
    const comment = new Comment
    ({ eventId, content, profileId });
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mengupdate komentar berdasarkan ID
exports.updateComment = async (req, res) => {
  const { eventId, content, profileId } = req.body;

  try {
    let comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await Comment.update({ eventId, content, profileId }, {
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
