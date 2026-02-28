const Assignment = require('../models/Assignment');

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true })
      .select('title description difficulty tags createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch assignments.' });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment || !assignment.isActive) {
      return res.status(404).json({ success: false, error: 'Assignment not found.' });
    }

    res.json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch assignment.' });
  }
};

module.exports = { getAllAssignments, getAssignmentById };
