// Routes for task operations
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authorizeRole = require('../middleware/authorizeRole');

// GET /projects/:projectId/tasks -> list tasks for a project
router.get('/projects/:projectId/tasks', taskController.listTasks);

// POST /projects/:projectId/tasks -> create task for a project (admin only)
router.post('/projects/:projectId/tasks', authorizeRole('admin'), taskController.createTask);

// PATCH /tasks/:id -> update a task
router.patch('/tasks/:id', taskController.updateTask);

// DELETE /tasks/:id -> remove a task (admin only)
router.delete('/tasks/:id', authorizeRole('admin'), taskController.deleteTask);

module.exports = router;
