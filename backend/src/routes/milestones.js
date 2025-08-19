// Routes for milestone operations
const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');

// GET /projects/:projectId/milestones -> list milestones for a project
router.get('/projects/:projectId/milestones', milestoneController.listMilestones);

// POST /projects/:projectId/milestones -> create milestone for a project
router.post('/projects/:projectId/milestones', milestoneController.createMilestone);

// PATCH /milestones/:id -> update a milestone
router.patch('/milestones/:id', milestoneController.updateMilestone);

// DELETE /milestones/:id -> remove a milestone
router.delete('/milestones/:id', milestoneController.deleteMilestone);

module.exports = router;

