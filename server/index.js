require('dotenv').config({ override: true });
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const memoryStore = require('./store/memoryStore');
const questionsRouter = require('./routes/questions');
const leaderboardRouter = require('./routes/leaderboard');
const profileRouter = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/questions', questionsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/profile', profileRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Neon Quiz Arena',
    mode: req.app.locals.memoryMode ? 'memory' : 'mongodb',
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const start = async () => {
  const forceMemory = process.env.USE_MEMORY === 'true';
  const dbConnected = forceMemory ? false : await connectDB();

  app.locals.memoryMode = !dbConnected;
  if (!dbConnected) {
    memoryStore.init();
    console.log('Running in memory mode (75 questions loaded, leaderboard in-session)');
  }

  app.listen(PORT, () => {
    console.log(`Neon Quiz Arena running at http://localhost:${PORT}`);
  });
};

start();
