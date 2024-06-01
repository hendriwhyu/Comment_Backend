<<<<<<< HEAD
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends Model {}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  tableName: 'Users'
});

module.exports = User;
=======
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        min: 4,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isLowercase: true,
        isUppercase: true,
        isDecimal: true,
        min: 6,
      }
    },
    role: {
      type: DataTypes.ENUM('company', 'user'),
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    tableName: 'Users'
  }
);

module.exports = User;
>>>>>>> 1a8f8631ea584a2d41e5436571ea48a3feabcadc
