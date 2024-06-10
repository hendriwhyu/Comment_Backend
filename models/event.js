const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Profile = require('./profile');

class Event extends Model {}

Event.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  bookmarks: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  totalParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'Event',
});

Event.belongsTo(Profile, { foreignKey: 'ownerId', as: 'owner' });

module.exports = Event;
