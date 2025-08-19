const express = require('express');

module.exports = (models) => {
  const { TimeLog, Task } = models;
  const router = express.Router({ mergeParams: true });

  // GET /tasks/:taskId/timelogs - list timelogs for a task with access control
  router.get('/', async (req, res) => {
    try {
      // Admins can view all logs
      if (req.user.role === 'admin') {
        const logs = await TimeLog.findAll({ where: { taskId: req.params.taskId } });
        return res.json(logs);
      }

      const task = await Task.findByPk(req.params.taskId);
      if (task && task.assignedUserId === req.user.id) {
        const logs = await TimeLog.findAll({ where: { taskId: req.params.taskId } });
        return res.json(logs);
      }

      // Otherwise, return only logs created by the requesting user
      const logs = await TimeLog.findAll({
        where: { taskId: req.params.taskId, userId: req.user.id },
      });
      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch time logs' });
    }
  });

  // POST /tasks/:taskId/timelogs - create a timelog for a task
  router.post('/', async (req, res) => {
    try {
      const payload = { ...req.body, taskId: req.params.taskId };
      // Standard users can only log time for themselves
      if (req.user.role === 'user') {
        payload.userId = req.user.id;
      }
      const log = await TimeLog.create(payload);
      res.status(201).json(log);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create time log' });
    }
  });

  return router;
};
