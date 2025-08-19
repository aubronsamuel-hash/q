const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  const { Project, Task, Milestone, TimeLog, User } = models;

  // GET /projects - return all projects
  router.get('/', async (req, res) => {
    try {
      const projects = await Project.findAll();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // GET /projects/:id - return project details with tasks and milestones
  router.get('/:id', async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [Task, Milestone],
      });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // POST /projects - create a new project
  router.post('/', async (req, res) => {
    try {
      const project = await Project.create(req.body);
      res.status(201).json(project);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create project' });
    }
  });

  // PUT /projects/:id - update an existing project
  router.put('/:id', async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      await project.update(req.body);
      res.json(project);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update project' });
    }
  });

  // PATCH /projects/:id - partially update a project
  router.patch('/:id', async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      await project.update(req.body);
      res.json(project);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update project' });
    }
  });

  // DELETE /projects/:id - remove a project
  router.delete('/:id', async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      await project.destroy();
      res.json({ message: 'Project deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // GET /projects/:projectId/cost - compute total hours and cost of a project
  router.get('/:projectId/cost', async (req, res) => {
    try {
      const tasks = await Task.findAll({
        where: { projectId: req.params.projectId },
        include: [{ model: TimeLog, include: [User] }],
      });

      let totalHours = 0;
      let totalCost = 0;
      tasks.forEach((task) => {
        task.TimeLogs.forEach((log) => {
          const hours = parseFloat(log.hours);
          const rate = log.User ? parseFloat(log.User.hourlyRate) || 0 : 0;
          totalHours += hours;
          totalCost += hours * rate;
        });
      });

      res.json({ totalHours, totalCost });
    } catch (err) {
      res.status(500).json({ error: 'Failed to calculate project cost' });
    }
  });

  return router;
};
