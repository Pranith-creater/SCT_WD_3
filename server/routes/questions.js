const express = require('express');
const Question = require('../models/Question');
const memoryStore = require('../store/memoryStore');

const router = express.Router();

const DIFFICULTY_LIMITS = { Easy: 10, Medium: 12, Hard: 15 };
const DIFFICULTY_TIME = { Easy: 20, Medium: 15, Hard: 12 };

router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    if (!category || !difficulty) {
      return res.status(400).json({ error: 'category and difficulty are required' });
    }

    const limit = DIFFICULTY_LIMITS[difficulty] || 10;

    let questions;
    if (req.app.locals.memoryMode) {
      questions = memoryStore.sampleQuestions(category, difficulty, limit);
    } else {
      questions = await Question.aggregate([
        { $match: { category, difficulty } },
        { $sample: { size: limit } },
      ]);
    }

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this category and difficulty' });
    }

    const sanitized = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      timeLimit: DIFFICULTY_TIME[difficulty] || q.timeLimit || 15,
    }));

    res.json({ questions: sanitized, total: sanitized.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.post('/check', async (req, res) => {
  try {
    const { questionId, selectedIndex } = req.body;

    let question;
    if (req.app.locals.memoryMode) {
      question = memoryStore.findQuestion(questionId);
    } else {
      question = await Question.findById(questionId).select('correctIndex options');
    }

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = selectedIndex >= 0 && question.correctIndex === selectedIndex;
    res.json({ isCorrect, correctIndex: question.correctIndex });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

module.exports = router;
