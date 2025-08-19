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
    const { userId, hours, date } = req.body;
    if (!userId || !hours || !date) {
      return res.status(400).json({ message: 'userId, hours and date are required' });
    }
    // Optional: verify user exists
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

