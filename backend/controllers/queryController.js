const pool = require('../config/postgres');
const Assignment = require('../models/Assignment');
const { validateQuery } = require('../services/queryValidator');

const executeQuery = async (req, res) => {
  const { query, assignmentId } = req.body;

  if (!query || !assignmentId) {
    return res.status(400).json({
      success: false,
      error: 'Both query and assignmentId are required.',
    });
  }

  // Step 1: Validate & sanitize
  const validation = validateQuery(query);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    });
  }

  // Step 2: Get assignment to find the correct pg schema
  let assignment;
  try {
    assignment = await Assignment.findById(assignmentId).select('pgSchema');
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Could not load assignment.' });
  }

  // Step 3: Execute in sandbox using PostgreSQL search_path scoped to this assignment
  const client = await pool.connect();
  try {
    // Set search_path to the assignment's schema so users can't touch other tables
    await client.query(`SET search_path TO ${assignment.pgSchema}, public`);

    // Set statement timeout: 5 seconds max
    await client.query('SET statement_timeout = 5000');

    const result = await client.query(validation.sanitized);

    return res.json({
      success: true,
      data: {
        rows: result.rows,
        fields: result.fields.map((f) => ({ name: f.name, dataTypeID: f.dataTypeID })),
        rowCount: result.rowCount,
      },
    });
  } catch (err) {
    // Return PostgreSQL error in a friendly way
    return res.status(400).json({
      success: false,
      error: err.message,
      hint: err.hint || null,
      position: err.position || null,
    });
  } finally {
    client.release();
  }
};

module.exports = { executeQuery };
