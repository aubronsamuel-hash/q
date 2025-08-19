// Routes for time log operations
const express = require('express');
const router = express.Router();
const timeLogController = require('../controllers/timeLogController');

// GET /tasks/:taskId/timelogs -> list time logs for a task
router.get('/tasks/:taskId/timelogs', timeLogController.listTimeLogs);

// POST /tasks/:taskId/timelogs -> create time log for a task
router.post('/tasks/:taskId/timelogs', timeLogController.createTimeLog);

module.exports = router;

