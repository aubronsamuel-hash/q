// Sequelize model loader and associations
// Initializes all models and their relationships
const { sequelize } = require('../config/db');
const UserModel = require('./User');
const ProjectModel = require('./Project');
const MilestoneModel = require('./Milestone');
const TaskModel = require('./Task');
const TimeLogModel = require('./TimeLog');

// Instantiate models
const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const Milestone = MilestoneModel(sequelize);
const Task = TaskModel(sequelize);
const TimeLog = TimeLogModel(sequelize);

/**
 * Set up model associations.
 */
function initModels() {
  // Project → Task
  Project.hasMany(Task, {
    foreignKey: { name: 'projectId', allowNull: false },
    onDelete: 'CASCADE',
  });
  Task.belongsTo(Project, {
    foreignKey: { name: 'projectId', allowNull: false },
    onDelete: 'CASCADE',
  });

  // Project → Milestone
  Project.hasMany(Milestone, {
    foreignKey: { name: 'projectId', allowNull: false },
    onDelete: 'CASCADE',
  });
  Milestone.belongsTo(Project, {
    foreignKey: { name: 'projectId', allowNull: false },
    onDelete: 'CASCADE',
  });

  // Milestone → Task (optional relationship)
  Milestone.hasMany(Task, {
    foreignKey: { name: 'milestoneId', allowNull: true },
    onDelete: 'SET NULL',
  });
  Task.belongsTo(Milestone, {
    foreignKey: { name: 'milestoneId', allowNull: true },
    onDelete: 'SET NULL',
  });

  // User ↔ Task (assigned user)
  User.hasMany(Task, {
    foreignKey: { name: 'assignedUserId', allowNull: true },
    onDelete: 'SET NULL',
  });
  Task.belongsTo(User, {
    as: 'assignedUser',
    foreignKey: { name: 'assignedUserId', allowNull: true },
    onDelete: 'SET NULL',
  });

  // Task → TimeLog
  Task.hasMany(TimeLog, {
    foreignKey: { name: 'taskId', allowNull: false },
    onDelete: 'CASCADE',
  });
  TimeLog.belongsTo(Task, {
    foreignKey: { name: 'taskId', allowNull: false },
    onDelete: 'CASCADE',
  });

  // User → TimeLog
  User.hasMany(TimeLog, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE',
  });
  TimeLog.belongsTo(User, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE',
  });
}

/**
 * Synchronize all models with the database.
 * @returns {Promise<void>} resolves when sync is complete
 */
async function syncDb() {
  await sequelize.sync();
}

module.exports = {
  sequelize,
  User,
  Project,
  Milestone,
  Task,
  TimeLog,
  initModels,
  syncDb,
};
