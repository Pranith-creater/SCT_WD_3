const express = require('express');
const Score = require('../models/Score');
const memoryStore = require('../store/memoryStore');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    if (req.app.locals.memoryMode) {
      return res.json({ leaderboard: memoryStore.getLeaderboard(limit) });
    }

    const scores = await Score.find()
      .sort({ percentage: -1, score: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ leaderboard: scores });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { playerName, category, difficulty, score, totalQuestions, percentage, timeBonus } = req.body;

    if (!playerName || !category || !difficulty || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payload = {
      playerName: playerName.trim().slice(0, 24),
      category,
      difficulty,
      score,
      totalQuestions: totalQuestions || 10,
      percentage: percentage ?? 0,
      timeBonus: timeBonus || 0,
    };

    if (req.app.locals.memoryMode) {
      const entry = memoryStore.addScore(payload);
      return res.status(201).json({ entry });
    }

    const entry = await Score.create(payload);
    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

module.exports = router;
