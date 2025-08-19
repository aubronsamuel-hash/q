// Routes for project operations
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET /projects -> list all projects
router.get('/', projectController.listProjects);

// GET /projects/:id -> get project with tasks and milestones
router.get('/:id', projectController.getProject);

// POST /projects -> create project
router.post('/', projectController.createProject);

// PATCH /projects/:id -> update project
router.patch('/:id', projectController.updateProject);

// DELETE /projects/:id -> delete project
router.delete('/:id', projectController.deleteProject);

// GET /projects/:projectId/cost -> compute total hours and cost
router.get('/:projectId/cost', projectController.getProjectCost);

module.exports = router;

