// Routes for project operations
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authorizeRole = require('../middleware/authorizeRole');

// GET /projects -> list all projects
router.get('/', projectController.listProjects);

// GET /projects/:id -> get project with tasks and milestones
router.get('/:id', projectController.getProject);

// POST /projects -> create project (admin only)
router.post('/', authorizeRole('admin'), projectController.createProject);

// PATCH /projects/:id -> update project (admin only)
router.patch('/:id', authorizeRole('admin'), projectController.updateProject);

// DELETE /projects/:id -> delete project (admin only)
router.delete('/:id', authorizeRole('admin'), projectController.deleteProject);

// GET /projects/:projectId/cost -> compute total hours and cost
router.get('/:projectId/cost', projectController.getProjectCost);

module.exports = router;
