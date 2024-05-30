const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user'); // Import model User untuk relasi

class Profile extends Model {}

Profile.init({
  photo: {
    type: DataTypes.STRING, // URL atau path ke foto profil
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  headTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Profile',
  tableName: 'Profiles'
});

// Membuat relasi antara Profile dan User
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Profile;
