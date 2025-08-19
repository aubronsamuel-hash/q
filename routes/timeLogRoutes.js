const express = require('express');

module.exports = (models) => {
  const { TimeLog } = models;
  const router = express.Router({ mergeParams: true });

  // GET /tasks/:taskId/timelogs - list timelogs for a task
  router.get('/', async (req, res) => {
    try {
      const logs = await TimeLog.findAll({ where: { taskId: req.params.taskId } });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch time logs' });
    }
  });

  // POST /tasks/:taskId/timelogs - create a timelog for a task
  router.post('/', async (req, res) => {
    try {
      const log = await TimeLog.create({ ...req.body, taskId: req.params.taskId });
      res.status(201).json(log);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create time log' });
    }
  });

  return router;
};
