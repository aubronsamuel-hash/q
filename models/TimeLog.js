const { Model, DataTypes } = require('sequelize');

/**
 * TimeLog model records the time spent by a user on a specific task.
 */
module.exports = (sequelize) => {
  class TimeLog extends Model {}

  TimeLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tasks', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      hours: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TimeLog',
      tableName: 'time_logs',
    }
  );

  return TimeLog;
};
