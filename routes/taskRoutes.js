const express = require('express');

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

  // POST /projects/:projectId/tasks - create a new task in a project
  projectRouter.post('/', async (req, res) => {
    try {
      const task = await Task.create({ ...req.body, projectId: req.params.projectId });
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create task' });
    }
  });

  // Router for endpoints under /tasks
  const taskRouter = express.Router();

  // PUT /tasks/:id - update a task
  taskRouter.put('/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await task.update(req.body);
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update task' });
    }
  });

  // PATCH /tasks/:id - partially update a task
  taskRouter.patch('/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await task.update(req.body);
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update task' });
    }
  });

  // DELETE /tasks/:id - remove a task
  taskRouter.delete('/:id', async (req, res) => {
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
