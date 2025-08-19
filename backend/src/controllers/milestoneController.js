// Controller for milestone related operations
const { Project, Milestone } = require('../models');

/**
 * List milestones for a project.
 */
exports.listMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const milestones = await Milestone.findAll({ where: { projectId } });
    return res.json(milestones);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch milestones' });
  }
};

/**
 * Create a milestone for a project.
 */
exports.createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { title, description, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Milestone title is required' });
    }
    const milestone = await Milestone.create({ projectId, title, description, dueDate });
    return res.status(201).json(milestone);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create milestone' });
  }
};

/**
 * Update a milestone by id.
 */
exports.updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    const { title, description, dueDate } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    await milestone.update(updates);
    return res.json(milestone);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update milestone' });
  }
};

/**
 * Delete a milestone by id.
 */
exports.deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    await milestone.destroy();
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete milestone' });
  }
};

