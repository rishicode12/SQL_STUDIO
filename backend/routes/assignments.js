const express = require('express');
const router = express.Router();
const { getAllAssignments, getAssignmentById } = require('../controllers/assignmentController');

// GET /api/assignments - list all active assignments
router.get('/', getAllAssignments);

// GET /api/assignments/:id - get single assignment with schema
router.get('/:id', getAssignmentById);

module.exports = router;
