// Routes for milestone operations
const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');
const authorizeRole = require('../middleware/authorizeRole');

// GET /projects/:projectId/milestones -> list milestones for a project
router.get('/projects/:projectId/milestones', milestoneController.listMilestones);

// POST /projects/:projectId/milestones -> create milestone for a project (admin only)
router.post('/projects/:projectId/milestones', authorizeRole('admin'), milestoneController.createMilestone);

// PATCH /milestones/:id -> update a milestone (admin only)
router.patch('/milestones/:id', authorizeRole('admin'), milestoneController.updateMilestone);

// DELETE /milestones/:id -> remove a milestone (admin only)
router.delete('/milestones/:id', authorizeRole('admin'), milestoneController.deleteMilestone);

module.exports = router;
