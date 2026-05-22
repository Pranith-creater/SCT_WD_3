const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Sports', 'General Knowledge', 'Movies', 'Science'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: [(v) => v.length === 4, 'Exactly 4 options required'],
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    timeLimit: { type: Number, default: 15 },
  },
  { timestamps: true }
);

questionSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
