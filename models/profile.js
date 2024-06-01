<<<<<<< HEAD
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
=======
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

class Profile extends Model {}
Profile.init(
  {
    photo: {
      type: DataTypes.STRING, // URL atau path ke foto profil
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [3, 255],
      }
    },
    headTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100],
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [0, 20],
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'Profiles',
  },
);

// Membuat relasi antara Profile dan User
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Profile;
>>>>>>> 1a8f8631ea584a2d41e5436571ea48a3feabcadc
