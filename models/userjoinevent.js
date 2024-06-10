const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Profile = require('./profile');
const Event = require('./event');

class UserJoinEvent extends Model {}

UserJoinEvent.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'UserJoinEvent',
  tableName: 'UserJoinEvents',
  timestamps: true,
});

UserJoinEvent.belongsTo(Profile, { foreignKey: 'profileId' });
UserJoinEvent.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = UserJoinEvent;
