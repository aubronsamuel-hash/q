// Controller for project related operations
const { Project, Task, Milestone, TimeLog, User } = require('../models');

/**
 * List all projects.
 * Responds with an array of projects.
 */
exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

/**
 * Get a single project by id including its tasks and milestones.
 */
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [Task, Milestone],
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch project' });
  }
};

/**
 * Create a new project.
 */
exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, dueDate } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const project = await Project.create({ name, description, startDate, dueDate });
    return res.status(201).json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create project' });
  }
};

/**
 * Update an existing project.
 */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { name, description, startDate, dueDate } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (startDate !== undefined) updates.startDate = startDate;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    await project.update(updates);
    return res.json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update project' });
  }
};

/**
 * Delete a project by id.
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete project' });
  }
};

/**
 * Calculate total hours and cost for a project.
 * Aggregates all time logs for tasks within the project.
 */
exports.getProjectCost = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const logs = await TimeLog.findAll({
      include: [
        {
          model: Task,
          where: { projectId },
          attributes: [],
        },
        {
          model: User,
          attributes: ['hourlyRate'],
        },
      ],
      raw: true,
    });
    let totalHours = 0;
    let totalCost = 0;
    for (const log of logs) {
      const hours = Number(log.hours);
      const rate = Number(log['User.hourlyRate']) || 0;
      totalHours += hours;
      totalCost += hours * rate;
    }
    return res.json({ totalHours, totalCost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to compute project cost' });
  }
};

