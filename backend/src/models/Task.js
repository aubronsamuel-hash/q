// Task model definition
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Project = require('./Project');
const Milestone = require('./Milestone');
const User = require('./User');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  dueDate: { type: DataTypes.DATE }
});

// Relationships
Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });
Milestone.hasMany(Task, { foreignKey: 'milestoneId' });
Task.belongsTo(Milestone, { foreignKey: 'milestoneId' });
User.hasMany(Task, { foreignKey: 'assignedUserId' });
Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedUserId' });

module.exports = Task;
