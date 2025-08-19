const express = require('express');
const authorizeRole = require('../middleware/authorizeRole');

module.exports = (models) => {
  const { Task } = models;

  // Router for endpoints under /projects/:projectId/tasks
  const projectRouter = express.Router({ mergeParams: true });

  // GET /projects/:projectId/tasks - list tasks of a project
  projectRouter.get('/', async (req, res) => {
    try {
      const tasks = await Task.findAll({ where: { projectId: req.params.projectId } });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // POST /projects/:projectId/tasks - create a new task in a project (admin only)
  projectRouter.post('/', authorizeRole('admin'), async (req, res) => {
    try {
      const task = await Task.create({ ...req.body, projectId: req.params.projectId });
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create task' });
    }
  });

  // Router for endpoints under /tasks
  const taskRouter = express.Router();

  // Shared handler for updating tasks with authorization rules
  const handleUpdate = async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Admins can update any field
      if (req.user.role === 'admin') {
        await task.update(req.body);
        return res.json(task);
      }

      // Standard users can only modify their own tasks and only status
      if (task.assignedUserId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      await task.update({ status: req.body.status });
      return res.json(task);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to update task' });
    }
  };

  // PUT /tasks/:id - update a task (status only for owners)
  taskRouter.put('/:id', handleUpdate);

  // PATCH /tasks/:id - partially update a task (status only for owners)
  taskRouter.patch('/:id', handleUpdate);

  // DELETE /tasks/:id - remove a task (admin only)
  taskRouter.delete('/:id', authorizeRole('admin'), async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await task.destroy();
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  return { projectRouter, taskRouter };
};
