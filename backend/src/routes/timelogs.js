// TimeLog routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /timelogs
router.get('/', auth, (req, res) => {
  // TODO: list time logs
  res.json({ message: 'List time logs' });
});

module.exports = router;
