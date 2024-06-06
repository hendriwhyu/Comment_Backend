'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');  // Pastikan ini diimpor setelah User didefinisikan

class Profile extends Model {}

Profile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    photo: {
      type: DataTypes.STRING,
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
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Profiles',
    tableName: 'Profiles',
  }
);

// Export Profile model, without the association
Profile.associate = () => {
  Profile.belongsTo(User, {
      foreignKey: "userId"
  });
}
module.exports = Profile;
