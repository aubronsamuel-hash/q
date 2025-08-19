// Task model definition
// Represents an actionable item within a project or milestone
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'References the owning project',
    },
    milestoneId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Optional link to a milestone',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'done'),
      allowNull: false,
      defaultValue: 'todo',
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User assigned to this task',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['milestoneId'] },
      { fields: ['assignedUserId'] },
    ],
  });

  return Task;
};
