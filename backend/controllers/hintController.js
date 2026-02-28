const Assignment = require('../models/Assignment');
const { generateHint } = require('../services/llmService');

const getHint = async (req, res) => {
  const { assignmentId, userQuery, errorMessage } = req.body;

  if (!assignmentId) {
    return res.status(400).json({ success: false, error: 'assignmentId is required.' });
  }

  try {
    const assignment = await Assignment.findById(assignmentId).select(
      'question tableSchemas'
    );

    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found.' });
    }

    const hint = await generateHint({
      question: assignment.question,
      userQuery: userQuery || '',
      errorMessage: errorMessage || '',
      tableSchemas: assignment.tableSchemas,
    });

    res.json({ success: true, hint });
  } catch (err) {
    console.error('LLM Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Could not generate hint. Please try again.',
    });
  }
};

module.exports = { getHint };
