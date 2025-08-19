// Project routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

// GET /projects
router.get('/', auth, (req, res) => {
  // TODO: list projects
  res.json({ message: 'List projects' });
});

// POST /projects
router.post('/', auth, authorizeRole('admin'), (req, res) => {
  // TODO: create project
  res.json({ message: 'Create project' });
});

module.exports = router;
