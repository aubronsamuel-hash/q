const express = require('express');
const { Sequelize } = require('sequelize');
const initModels = require('./models');
const authMiddleware = require('./middleware/authMiddleware');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Set up JSON parsing middleware
app.use(express.json());

// Initialize Sequelize connection to PostgreSQL
// Environment variables can override the default connection values
const sequelize = new Sequelize(
  process.env.DB_NAME || 'database',
  process.env.DB_USER || 'user',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

// Initialize all models and their associations
const models = initModels(sequelize);

// Synchronize models with the database
sequelize
  .sync()
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Database synchronization failed:', err));

// Import routers
const authRoutes = require('./routes/authRoutes')(models);
const projectRoutes = require('./routes/projectRoutes')(models);
const taskRoutes = require('./routes/taskRoutes')(models);
const milestoneRoutes = require('./routes/milestoneRoutes')(models);
const timeLogRoutes = require('./routes/timeLogRoutes')(models);

// Public authentication routes
app.use('/auth', authRoutes);

// Apply authentication middleware to all routes below
app.use(authMiddleware);

// Protected resource routes
app.use('/projects', projectRoutes);
app.use('/projects/:projectId/tasks', taskRoutes.projectRouter);
app.use('/tasks', taskRoutes.taskRouter);
app.use('/projects/:projectId/milestones', milestoneRoutes.projectRouter);
app.use('/milestones', milestoneRoutes.milestoneRouter);
app.use('/tasks/:taskId/timelogs', timeLogRoutes);

// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
