// Controller for task related operations
const { Project, Task } = require('../models');

/**
 * List tasks belonging to a specific project.
 */
exports.listTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const tasks = await Task.findAll({ where: { projectId } });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

/**
 * Create a new task under a project.
 */
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { title, description, status, milestoneId, assignedUserId, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    const task = await Task.create({
      projectId,
      title,
      description,
      status,
      milestoneId,
      assignedUserId,
      dueDate,
    });
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create task' });
  }
};

/**
 * Update a task by id.
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const { title, description, status, milestoneId, assignedUserId, dueDate } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (milestoneId !== undefined) updates.milestoneId = milestoneId;
    if (assignedUserId !== undefined) updates.assignedUserId = assignedUserId;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    await task.update(updates);
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update task' });
  }
};

/**
 * Delete a task by id.
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
};

