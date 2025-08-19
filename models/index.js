/**
 * Initializes all models and sets up their associations.
 * Call this function with a Sequelize instance.
 */
const User = require('./User');
const Project = require('./Project');
const Milestone = require('./Milestone');
const Task = require('./Task');
const TimeLog = require('./TimeLog');

module.exports = (sequelize) => {
  const models = {
    User: User(sequelize),
    Project: Project(sequelize),
    Milestone: Milestone(sequelize),
    Task: Task(sequelize),
    TimeLog: TimeLog(sequelize),
  };

  // Project relationships
  models.Project.hasMany(models.Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
  models.Task.belongsTo(models.Project, { foreignKey: 'projectId' });

  models.Project.hasMany(models.Milestone, { foreignKey: 'projectId', onDelete: 'CASCADE' });
  models.Milestone.belongsTo(models.Project, { foreignKey: 'projectId' });

  // Milestone to Task (optional)
  models.Milestone.hasMany(models.Task, { foreignKey: 'milestoneId', onDelete: 'SET NULL' });
  models.Task.belongsTo(models.Milestone, { foreignKey: 'milestoneId' });

  // User to Task (assignment)
  models.User.hasMany(models.Task, { foreignKey: 'assignedUserId', as: 'assignedTasks' });
  models.Task.belongsTo(models.User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

  // Time logs relationships
  models.Task.hasMany(models.TimeLog, { foreignKey: 'taskId', onDelete: 'CASCADE' });
  models.TimeLog.belongsTo(models.Task, { foreignKey: 'taskId' });

  models.User.hasMany(models.TimeLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
  models.TimeLog.belongsTo(models.User, { foreignKey: 'userId' });

  return models;
};
