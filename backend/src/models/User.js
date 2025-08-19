// User model definition
// Defines application users and roles
const { DataTypes } = require('sequelize');
const { dialectName } = require('../config/db');
const defineEnum = require('../utils/defineEnum');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Hashed user password',
    },
    role: {
      ...defineEnum(dialectName, ['admin', 'user']),
      allowNull: false,
      defaultValue: 'user',
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  }, {
    indexes: [
      { unique: true, fields: ['email'] },
    ],
  });

  return User;
};
