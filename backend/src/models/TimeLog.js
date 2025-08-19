// TimeLog model definition
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Task = require('./Task');
const User = require('./User');

const TimeLog = sequelize.define('TimeLog', {
  hours: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
});

// Relationships
Task.hasMany(TimeLog, { foreignKey: 'taskId' });
TimeLog.belongsTo(Task, { foreignKey: 'taskId' });
User.hasMany(TimeLog, { foreignKey: 'userId' });
TimeLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = TimeLog;
