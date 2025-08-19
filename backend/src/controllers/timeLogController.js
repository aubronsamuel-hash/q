// Controller for time log related operations
const { Task, TimeLog, User } = require('../models');

/**
 * List time logs for a specific task.
 */
exports.listTimeLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.user.role !== 'admin') {
      // Non-admins may view logs only for tasks they own or are assigned to
      const isAssigned = task.assignedUserId === req.user.id;
      const isOwner = await TimeLog.count({ where: { taskId, userId: req.user.id } });
      if (!isAssigned && isOwner === 0) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const where = { taskId };
      if (!isAssigned) {
        // Not assigned, so restrict to own logs
        where.userId = req.user.id;
      }
      const logs = await TimeLog.findAll({ where });
      return res.json(logs);
    }
    const logs = await TimeLog.findAll({ where: { taskId } });
    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch time logs' });
  }
};

/**
 * Create a time log for a task.
 */
exports.createTimeLog = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const { hours, date } = req.body;
    if (!hours || !date) {
      return res.status(400).json({ message: 'hours and date are required' });
    }
    let userId = req.body.userId;
    if (req.user.role !== 'admin') {
      // Non-admins can only log time for tasks assigned to them
      if (task.assignedUserId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      userId = req.user.id; // enforce ownership of timelog
    }
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const log = await TimeLog.create({ taskId, userId, hours, date });
    return res.status(201).json(log);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create time log' });
  }
};

