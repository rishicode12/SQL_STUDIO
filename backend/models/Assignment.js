const mongoose = require('mongoose');

const tableSchemaSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  columns: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      constraints: { type: String, default: '' },
    },
  ],
  sampleData: { type: [[mongoose.Schema.Types.Mixed]], default: [] },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    question: { type: String, required: true },
    tableSchemas: [tableSchemaSchema],
    // The pg schema name / prefix for this assignment's tables
    pgSchema: { type: String, required: true },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
