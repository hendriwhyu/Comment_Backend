'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

class Profile extends Model {}
Profile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
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
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Refers to the table name
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Profile',
    tableName: 'Profiles',
  },
);

// Membuat relasi antara Profile dan User
// Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Profile;
