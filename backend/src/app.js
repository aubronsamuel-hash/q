// Main Express application setup
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const milestoneRoutes = require('./routes/milestones');
const timeLogRoutes = require('./routes/timelogs');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Register API routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/milestones', milestoneRoutes);
app.use('/timelogs', timeLogRoutes);

// Basic error handler
// underscore prefix to indicate unused `next` parameter
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
