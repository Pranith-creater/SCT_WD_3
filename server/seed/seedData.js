require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Question = require('../models/Question');
const questions = require('./seedQuestions');

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neon-quiz-arena';
  await mongoose.connect(uri);
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log(`Seeded ${questions.length} questions successfully.`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
