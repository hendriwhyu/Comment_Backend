const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Profile = require('./profile');
const Event = require('./event');

class UserJoinEvent extends Model {}

UserJoinEvent.init({
  eventId: {
    type: DataTypes.UUID,
    references: {
      model: Event,
      key: 'id'
    }
  },
  profileId: {
    type: DataTypes.UUID,
    references: {
      model: Profile,
      key: 'id'
    }
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'UserJoinEvent'
});

UserJoinEvent.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
UserJoinEvent.belongsTo(Profile, { foreignKey: 'profileId', as: 'profile' });

module.exports = UserJoinEvent;
