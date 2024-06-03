const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Event extends Model {}

Event.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category:{
    type: DataTypes.ENUM('Event','News')
  },
  description: {
    type: DataTypes.TEXT
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maxParticipants: {
    type: DataTypes.INTEGER
  },
  image: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Event'
});

module.exports = Event;
