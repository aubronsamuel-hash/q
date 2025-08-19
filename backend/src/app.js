// Main Express application setup
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const milestoneRoutes = require('./routes/milestones');
const timeLogRoutes = require('./routes/timelogs');
const authMiddleware = require('./middleware/auth');
const { sequelize, dialectName } = require('./config/db');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Health check endpoint with DB ping
app.get('/health', async (req, res) => {
  try {
    // race against a short timeout to keep the check fast
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000)),
    ]);
    res.json({ status: 'ok', db: 'up', dialect: dialectName });
  } catch (_err) {
    res.status(503).json({ status: 'degraded', db: 'down', dialect: dialectName });
  }
});

// Public auth routes
app.use('/auth', authRoutes);

// Apply authentication to all routes below
app.use(authMiddleware);

// Register API routes
app.use('/projects', projectRoutes);
app.use(taskRoutes);
app.use(milestoneRoutes);
app.use(timeLogRoutes);

// Basic error handler
// underscore prefix to indicate unused `next` parameter
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
