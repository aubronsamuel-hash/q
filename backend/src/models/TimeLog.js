// TimeLog model definition
// Stores time tracking entries for tasks and users
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TimeLog = sequelize.define('TimeLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Task being worked on',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User who logged the time',
    },
    hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    indexes: [
      { fields: ['taskId'] },
      { fields: ['userId'] },
    ],
  });

  return TimeLog;
};
