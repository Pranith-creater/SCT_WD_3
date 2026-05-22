const seedQuestions = require('../seed/seedQuestions');

let questions = [];
let leaderboard = [];

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const init = () => {
  questions = seedQuestions.map((q, i) => ({
    ...q,
    _id: `mem-${i}`,
    createdAt: new Date(),
  }));
  leaderboard = [];
};

const sampleQuestions = (category, difficulty, limit) => {
  const pool = questions.filter((q) => q.category === category && q.difficulty === difficulty);
  return shuffle(pool).slice(0, limit);
};

const findQuestion = (id) => questions.find((q) => q._id === id);

const addScore = (entry) => {
  const record = {
    ...entry,
    _id: `score-${Date.now()}`,
    createdAt: new Date(),
  };
  leaderboard.push(record);
  leaderboard.sort((a, b) => b.percentage - a.percentage || b.score - a.score);
  return record;
};

const getLeaderboard = (limit) => leaderboard.slice(0, limit);

module.exports = { init, sampleQuestions, findQuestion, addScore, getLeaderboard };
