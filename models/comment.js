const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Event = require('./event');
const Profile = require('./profile');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4, // Set default value to UUIDV4
      references: {
        model: Event,
        key: 'id'
      },
      onDelete: 'CASCADE' // Cascade delete ketika event dihapus
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profileId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Set default value to UUIDV4
      references: {
        model: Profile,
        key: 'id'
      },
      onDelete: 'CASCADE' // Cascade delete ketika profile dihapus
    }
  },
  {
    sequelize,
    modelName: 'comment',
    timestamps: true
  }
);

// Definisikan relasi antara model Comment dan model Event serta Profile
Comment.belongsTo(Event, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Comment.belongsTo(Profile, { foreignKey: 'profileId', onDelete: 'CASCADE' });

module.exports = Comment;
