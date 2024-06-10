const { Op } = require('sequelize');
const Event = require('../models/event');
const UserJoinEvent = require('../models/userjoinevent');
const Profile = require('../models/profile');

// Mendapatkan event dengan lazy loading
// Mendapatkan event dengan lazy loading
exports.getEvents = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const offset = (page - 1) * limit;
      const now = new Date();
  
      // Hapus event yang sudah berakhir
      await Event.destroy({
        where: {
          endDate: {
            [Op.lt]: now,
          },
        },
      });
  
      // Ambil event yang masih berlaku dengan pagination
      const events = await Event.findAndCountAll({
        where: {
          endDate: {
            [Op.gt]: now,
          },
        },
        include: {
          model: Profile,
          as: 'owner',
          attributes: ['photo','name','headTitle'],
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['startDate', 'ASC']],
      });
  
      const result = events.rows.map(event => ({
        id: event.id,
        title: event.title,
        category: event.category,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        maxParticipants: event.maxParticipants,
        image: event.image,
        createdAt: event.createdAt,
        ownerName: {
          photo: event.owner.photo,
          name: event.owner.name,
          headTitle: event.owner.headTitle,
        },
        bookmarks: event.bookmarks,
        totalParticipants: event.totalParticipants,
      }));
  
      res.json({
        total: events.count,
        pages: Math.ceil(events.count / limit),
        data: result,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// Menghapus event yang sudah melewati endDate
exports.cleanUpEvents = async () => {
  try {
    await Event.destroy({
      where: {
        endDate: {
          [Op.lt]: new Date()
        }
      }
    });
  } catch (err) {
    console.error('Error cleaning up events:', err.message);
  }
};

// Mendapatkan event berdasarkan title
exports.getEventByTitle = async (req, res) => {
  const { title } = req.query;

  try {
    let events;

    if (title) {
      // Cari event berdasarkan kata kunci pada title
      events = await Event.findAll({
        where: {
          title: {
            [Op.like]: `%${title}%`
          }
        }
      });
    } else {
      // Ambil semua event jika tidak ada query parameter title
      events = await Event.findAll();
    }

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mendapatkan event berdasarkan title (exact match)
exports.getEventByExactTitle = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { title: req.params.title } });

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Membuat event baru
exports.createEvent = async (req, res) => {
    const { title, category, description, startDate, endDate, maxParticipants, image } = req.body;
  
    try {
      const profile = await Profile.findOne({ where: { userId: req.user.id } });
  
      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }
  
      const newEvent = await Event.create({
        title,
        category,
        description,
        startDate,
        endDate,
        maxParticipants,
        image,
        ownerId: profile.id
      });
  
      res.json(newEvent);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// Memperbarui event berdasarkan ID
exports.updateEvent = async (req, res) => {
  const { title, category, description, startDate, endDate, maxParticipant, image } = req.body;

  const eventFields = {};
  if (title) eventFields.title = title;
  if (category) eventFields.category = category;
  if (description) eventFields.description = description;
  if (startDate) eventFields.startDate = startDate;
  if (endDate) eventFields.endDate = endDate;
  if (maxParticipant) eventFields.maxParticipant = maxParticipant;
  if (image) eventFields.image = image;

  try {
    let event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    event = await Event.update(eventFields, {
      where: {
        id: req.params.id
      }
    });

    res.json({ msg: 'Event updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Menghapus event berdasarkan ID
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.destroy({ where: { id: req.params.id } });

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getParticipants = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const participants = await UserJoinEvent.findAll({
      where: { eventId },
      include: [
        {
          model: Profile,
          attributes: ['photo', 'headTitle'],
        },
      ],
    });

    const result = participants.map(participant => ({
      photo: participant.Profile.photo,
      headTitle: participant.Profile.headTitle,
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}