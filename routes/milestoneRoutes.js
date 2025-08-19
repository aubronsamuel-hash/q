const express = require('express');
const authorizeRole = require('../middleware/authorizeRole');

module.exports = (models) => {
  const { Milestone } = models;

  // Router for endpoints under /projects/:projectId/milestones
  const projectRouter = express.Router({ mergeParams: true });

  // GET /projects/:projectId/milestones - list milestones for a project
  projectRouter.get('/', async (req, res) => {
    try {
      const milestones = await Milestone.findAll({ where: { projectId: req.params.projectId } });
      res.json(milestones);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch milestones' });
    }
  });

  // POST /projects/:projectId/milestones - create a milestone for a project (admin only)
  projectRouter.post('/', authorizeRole('admin'), async (req, res) => {
    try {
      const milestone = await Milestone.create({ ...req.body, projectId: req.params.projectId });
      res.status(201).json(milestone);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create milestone' });
    }
  });

  // Router for endpoints under /milestones
  const milestoneRouter = express.Router();

  // PUT /milestones/:id - update a milestone (admin only)
  milestoneRouter.put('/:id', authorizeRole('admin'), async (req, res) => {
    try {
      const milestone = await Milestone.findByPk(req.params.id);
      if (!milestone) {
        return res.status(404).json({ error: 'Milestone not found' });
      }
      await milestone.update(req.body);
      res.json(milestone);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update milestone' });
    }
  });

  // PATCH /milestones/:id - partially update a milestone (admin only)
  milestoneRouter.patch('/:id', authorizeRole('admin'), async (req, res) => {
    try {
      const milestone = await Milestone.findByPk(req.params.id);
      if (!milestone) {
        return res.status(404).json({ error: 'Milestone not found' });
      }
      await milestone.update(req.body);
      res.json(milestone);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update milestone' });
    }
  });

  // DELETE /milestones/:id - remove a milestone (admin only)
  milestoneRouter.delete('/:id', authorizeRole('admin'), async (req, res) => {
    try {
      const milestone = await Milestone.findByPk(req.params.id);
      if (!milestone) {
        return res.status(404).json({ error: 'Milestone not found' });
      }
      await milestone.destroy();
      res.json({ message: 'Milestone deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete milestone' });
    }
  });

  return { projectRouter, milestoneRouter };
};
