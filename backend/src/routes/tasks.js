// Routes for task operations
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /projects/:projectId/tasks -> list tasks for a project
router.get('/projects/:projectId/tasks', taskController.listTasks);

// POST /projects/:projectId/tasks -> create task for a project
router.post('/projects/:projectId/tasks', taskController.createTask);

// PATCH /tasks/:id -> update a task
router.patch('/tasks/:id', taskController.updateTask);

// DELETE /tasks/:id -> remove a task
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;

