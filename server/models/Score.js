const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true, trim: true, maxlength: 24 },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    timeBonus: { type: Number, default: 0 },
  },
  { timestamps: true }
);

scoreSchema.index({ percentage: -1, score: -1, createdAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);
