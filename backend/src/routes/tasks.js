// Task routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /tasks
router.get('/', auth, (req, res) => {
  // TODO: list tasks
  res.json({ message: 'List tasks' });
});

module.exports = router;
