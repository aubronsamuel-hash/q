// Milestone model definition
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Project = require('./Project');

const Milestone = sequelize.define('Milestone', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  dueDate: { type: DataTypes.DATE }
});

// Relationships
Project.hasMany(Milestone, { foreignKey: 'projectId' });
Milestone.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = Milestone;
