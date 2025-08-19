// Milestone routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /milestones
router.get('/', auth, (req, res) => {
  // TODO: list milestones
  res.json({ message: 'List milestones' });
});

module.exports = router;
