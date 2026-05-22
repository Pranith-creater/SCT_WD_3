/* ===== Config ===== */
const CATEGORIES = [
  { id: 'Technology', icon: '💻', slug: 'technology' },
  { id: 'Sports', icon: '⚽', slug: 'sports' },
  { id: 'General Knowledge', icon: '🌍', slug: 'general' },
  { id: 'Movies', icon: '🎬', slug: 'movies' },
  { id: 'Science', icon: '🔬', slug: 'science' },
];

const DIFFICULTIES = [
  { id: 'Easy', class: 'easy', desc: '20s · 10 questions' },
  { id: 'Medium', class: 'medium', desc: '15s · 12 questions' },
  { id: 'Hard', class: 'hard', desc: '12s · 15 questions' },
];

const POINTS = { Easy: 100, Medium: 150, Hard: 200 };

const PERFORMANCE = [
  { min: 90, msg: 'Legendary! You are a trivia god.', icon: '👑', rank: 'Neon Legend' },
  { min: 70, msg: 'Excellent! Elite pilot status achieved.', icon: '🚀', rank: 'Quantum Ace' },
  { min: 50, msg: 'Solid run. Keep pushing your limits.', icon: '⭐', rank: 'Star Cadet' },
  { min: 30, msg: 'Not bad. Practice makes perfect.', icon: '🎯', rank: 'Rookie Pilot' },
  { min: 0, msg: 'Mission failed. Reboot and try again!', icon: '💫', rank: 'Trainee' },
];

const STREAK_MILESTONES = [
  { at: 3, icon: '🔥', title: 'Heating Up', desc: '3 answers in a row!' },
  { at: 5, icon: '⚡', title: 'Unstoppable', desc: '5-answer streak!' },
  { at: 8, icon: '💎', title: 'Diamond Mind', desc: '8-answer streak!' },
  { at: 10, icon: '👑', title: 'Trivia Royalty', desc: 'Perfect momentum!' },
];

const CATEGORY_CLASS = {
  Technology: 'category--technology',
  Sports: 'category--sports',
  'General Knowledge': 'category--general',
  Movies: 'category--movies',
  Science: 'category--science',
};

/* ===== State ===== */
const state = {
  category: null,
  difficulty: null,
  playerName: '',
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  streak: 0,
  maxStreak: 0,
  combo: 1,
  timeBonus: 0,
  timer: null,
  timeLeft: 0,
  maxTime: 15,
  answering: false,
  lifelines: { fifty: true, time: true, skip: true },
  earnedBadges: new Set(),
  milestoneShown: new Set(),
};

/* ===== DOM ===== */
const screens = {
  landing: document.getElementById('screen-landing'),
  setup: document.getElementById('screen-setup'),
  quiz: document.getElementById('screen-quiz'),
  results: document.getElementById('screen-results'),
  leaderboard: document.getElementById('screen-leaderboard'),
};

const els = {
  categoryGrid: document.getElementById('category-grid'),
  difficultyGrid: document.getElementById('difficulty-grid'),
  playerName: document.getElementById('player-name'),
  btnLaunch: document.getElementById('btn-launch'),
  questionText: document.getElementById('question-text'),
  questionNumber: document.getElementById('question-number'),
  momentumBadge: document.getElementById('momentum-badge'),
  optionsGrid: document.getElementById('options-grid'),
  questionCard: document.getElementById('question-card'),
  scoreValue: document.getElementById('score-value'),
  streakCounter: document.getElementById('streak-counter'),
  comboDisplay: document.getElementById('combo-display'),
  comboMultiplier: document.getElementById('combo-multiplier'),
  timerValue: document.getElementById('timer-value'),
  timerProgress: document.getElementById('timer-progress'),
  timerRing: document.getElementById('timer-ring'),
  progressBar: document.getElementById('progress-bar'),
  progressLabel: document.getElementById('progress-label'),
  hudCategory: document.getElementById('hud-category'),
  hudDifficulty: document.getElementById('hud-difficulty'),
  resultsPercent: document.getElementById('results-percent'),
  resultsMessage: document.getElementById('results-message'),
  resultsRank: document.getElementById('results-rank'),
  resultsScore: document.getElementById('results-score'),
  resultsCorrect: document.getElementById('results-correct'),
  resultsBonus: document.getElementById('results-bonus'),
  resultsStreak: document.getElementById('results-streak'),
  resultsBadges: document.getElementById('results-badges'),
  resultsRingFill: document.getElementById('results-ring-fill'),
  resultsIcon: document.getElementById('results-icon'),
  leaderboardList: document.getElementById('leaderboard-list'),
  leaderboardEmpty: document.getElementById('leaderboard-empty'),
  toast: document.getElementById('toast'),
  countdownOverlay: document.getElementById('countdown-overlay'),
  countdownNumber: document.getElementById('countdown-number'),
  lifeline5050: document.getElementById('lifeline-5050'),
  lifelineTime: document.getElementById('lifeline-time'),
  lifelineSkip: document.getElementById('lifeline-skip'),
};

/* ===== Navigation ===== */
const showScreen = (name) => {
  Object.values(screens).forEach((s) => s.classList.remove('screen--active'));
  screens[name]?.classList.add('screen--active');
};

const showToast = (msg, type = '') => {
  els.toast.textContent = msg;
  els.toast.className = `toast show ${type ? `toast--${type}` : ''}`;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2800);
};

/* ===== Setup UI ===== */
const renderCategories = () => {
  els.categoryGrid.innerHTML = CATEGORIES.map(
    (c) => `
    <div class="category-card" data-category="${c.id}" role="button" tabindex="0">
      <span class="category-card__icon">${c.icon}</span>
      <span class="category-card__name">${c.id}</span>
    </div>`
  ).join('');

  els.categoryGrid.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => selectCategory(card.dataset.category));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') selectCategory(card.dataset.category);
    });
  });
};

const renderDifficulties = () => {
  els.difficultyGrid.innerHTML = DIFFICULTIES.map(
    (d) => `
    <button type="button" class="difficulty-btn difficulty-btn--${d.class}" data-difficulty="${d.id}">
      ${d.id}<br><small style="font-size:0.65rem;opacity:0.7">${d.desc}</small>
    </button>`
  ).join('');

  els.difficultyGrid.querySelectorAll('.difficulty-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty));
  });
};

const selectCategory = (cat) => {
  SoundFX.click();
  state.category = cat;
  els.categoryGrid.querySelectorAll('.category-card').forEach((c) => {
    c.classList.toggle('category-card--selected', c.dataset.category === cat);
  });
  validateSetup();
};

const selectDifficulty = (diff) => {
  SoundFX.click();
  state.difficulty = diff;
  els.difficultyGrid.querySelectorAll('.difficulty-btn').forEach((b) => {
    b.classList.toggle('selected', b.dataset.difficulty === diff);
  });
  validateSetup();
};

const validateSetup = () => {
  const name = els.playerName.value.trim();
  els.btnLaunch.disabled = !(state.category && state.difficulty && name.length >= 1);
};

/* ===== Streak / Combo ===== */
const getComboMultiplier = () => {
  if (state.streak >= 7) return 2.5;
  if (state.streak >= 5) return 2;
  if (state.streak >= 3) return 1.5;
  return 1;
};

const updateStreakUI = () => {
  els.streakCounter.textContent = state.streak;
  const streakEl = els.streakCounter.closest('.streak-display');
  streakEl?.classList.toggle('streak-display--hot', state.streak >= 3);
  streakEl?.classList.toggle('streak-display--blazing', state.streak >= 5);

  const mult = getComboMultiplier();
  state.combo = mult;
  if (mult > 1) {
    els.comboDisplay.classList.remove('hidden');
    els.comboMultiplier.textContent = `x${mult}`;
    els.comboDisplay.classList.remove('combo-display--pulse');
    void els.comboDisplay.offsetWidth;
    els.comboDisplay.classList.add('combo-display--pulse');
  } else {
    els.comboDisplay.classList.add('hidden');
  }

  els.momentumBadge.classList.toggle('hidden', state.streak < 3);
  if (state.streak >= 5) els.momentumBadge.textContent = 'BLAZING!';
  else if (state.streak >= 3) els.momentumBadge.textContent = 'On Fire!';
};

const checkStreakMilestones = () => {
  STREAK_MILESTONES.forEach((m) => {
    if (state.streak === m.at && !state.milestoneShown.has(m.at)) {
      state.milestoneShown.add(m.at);
      Effects.showAchievement(m.icon, m.title, m.desc);
      SoundFX.streak(m.at);
      if (m.at >= 5) Effects.burstConfetti(25);
    }
  });
};

const resetStreak = () => {
  state.streak = 0;
  updateStreakUI();
};

/* ===== Lifelines ===== */
const resetLifelines = () => {
  state.lifelines = { fifty: true, time: true, skip: true };
  [els.lifeline5050, els.lifelineTime, els.lifelineSkip].forEach((btn) => {
    btn?.classList.remove('lifeline-btn--used');
    btn.disabled = false;
  });
};

const useLifeline = (type) => {
  if (state.answering || !state.lifelines[type]) return;

  const btnMap = { fifty: els.lifeline5050, time: els.lifelineTime, skip: els.lifelineSkip };
  state.lifelines[type] = false;
  btnMap[type]?.classList.add('lifeline-btn--used');
  btnMap[type].disabled = true;
  SoundFX.powerup();

  if (type === 'fifty') applyFiftyFifty();
  else if (type === 'time') applyExtraTime();
  else if (type === 'skip') applySkip();
};

const applyFiftyFifty = async () => {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  let correctIndex = 0;
  try {
    const res = await fetch('/api/questions/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: q._id, selectedIndex: -2 }),
    });
    const data = await res.json();
    correctIndex = data.correctIndex;
  } catch (_) {
    return;
  }

  const buttons = [...els.optionsGrid.querySelectorAll('.option-btn')];
  const wrongIndices = buttons.map((_, i) => i).filter((i) => i !== correctIndex);
  const toHide = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);

  toHide.forEach((i) => {
    buttons[i].classList.add('option-btn--hidden');
    buttons[i].disabled = true;
  });
  showToast('50/50 — two options eliminated', 'success');
};

const applyExtraTime = () => {
  state.timeLeft = Math.min(state.timeLeft + 8, state.maxTime + 8);
  updateTimerDisplay();
  showToast('+8 seconds added!', 'success');
  Effects.flashScreen('success');
};

const applySkip = () => {
  clearInterval(state.timer);
  state.answering = false;
  showToast('Question skipped — no penalty', 'success');
  els.questionCard.classList.add('exiting');
  setTimeout(() => {
    state.currentIndex += 1;
    if (state.currentIndex >= state.questions.length) finishQuiz();
    else renderQuestion();
  }, 300);
};

/* ===== Countdown ===== */
const playCountdown = () =>
  new Promise((resolve) => {
    const seq = ['3', '2', '1', 'GO!'];
    els.countdownOverlay.classList.remove('hidden');
    let i = 0;

    const tick = () => {
      if (i >= seq.length) {
        els.countdownOverlay.classList.add('hidden');
        resolve();
        return;
      }
      els.countdownNumber.textContent = seq[i];
      els.countdownNumber.classList.remove('countdown-overlay__num--pop');
      void els.countdownNumber.offsetWidth;
      els.countdownNumber.classList.add('countdown-overlay__num--pop');
      SoundFX.countdown(i === 3 ? 0 : parseInt(seq[i], 10) || 1);
      i += 1;
      setTimeout(tick, i === 4 ? 700 : 850);
    };
    tick();
  });

/* ===== Quiz Logic ===== */
const fetchQuestions = async () => {
  const params = new URLSearchParams({
    category: state.category,
    difficulty: state.difficulty,
  });
  const res = await fetch(`/api/questions?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load questions');
  }
  return res.json();
};

const applyCategoryTheme = () => {
  const cls = CATEGORY_CLASS[state.category] || '';
  Object.values(CATEGORY_CLASS).forEach((c) => els.questionCard.classList.remove(c));
  if (cls) els.questionCard.classList.add(cls);
};

const startQuiz = async () => {
  state.playerName = els.playerName.value.trim();
  els.btnLaunch.disabled = true;
  els.btnLaunch.querySelector('.btn__text').textContent = 'Loading...';

  try {
    const data = await fetchQuestions();
    state.questions = data.questions;
    state.currentIndex = 0;
    state.score = 0;
    state.correctCount = 0;
    state.timeBonus = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.milestoneShown.clear();
    state.earnedBadges.clear();
    resetLifelines();

    els.hudCategory.textContent = state.category;
    els.hudDifficulty.textContent = state.difficulty;
    els.scoreValue.textContent = '0';
    updateStreakUI();
    applyCategoryTheme();

    showScreen('quiz');
    await playCountdown();
    renderQuestion();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    els.btnLaunch.disabled = false;
    els.btnLaunch.querySelector('.btn__text').textContent = 'Launch Mission';
    validateSetup();
  }
};

const renderQuestion = () => {
  const q = state.questions[state.currentIndex];
  if (!q) return finishQuiz();

  state.answering = false;
  state.maxTime = q.timeLimit;
  state.timeLeft = q.timeLimit;

  const total = state.questions.length;
  const current = state.currentIndex + 1;
  const pct = ((current - 1) / total) * 100;

  els.progressBar.style.width = `${pct}%`;
  els.progressLabel.textContent = `Question ${current} of ${total}`;
  els.questionNumber.textContent = `Q${current}`;
  els.questionText.textContent = q.question;

  const letters = ['A', 'B', 'C', 'D'];
  els.optionsGrid.innerHTML = q.options
    .map(
      (opt, i) => `
    <button type="button" class="option-btn" data-index="${i}">
      <span class="option-btn__letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>`
    )
    .join('');

  els.optionsGrid.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index, 10)));
  });

  els.questionCard.classList.remove('exiting');
  els.questionCard.classList.add('entering');
  setTimeout(() => els.questionCard.classList.remove('entering'), 450);

  updateTimerDisplay();
  startTimer();
};

const startTimer = () => {
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerDisplay();

    if (state.timeLeft <= 3 && state.timeLeft > 0) SoundFX.tick();

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      SoundFX.timeout();
      handleAnswer(-1);
    }
  }, 1000);
};

const updateTimerDisplay = () => {
  els.timerValue.textContent = Math.max(0, state.timeLeft);
  const pct = (state.timeLeft / state.maxTime) * 100;
  els.timerProgress.style.strokeDasharray = `${pct}, 100`;

  els.timerProgress.classList.remove('warning', 'danger');
  els.timerRing.classList.remove('critical');
  if (state.timeLeft <= 5) {
    els.timerProgress.classList.add('danger');
    els.timerRing.classList.add('critical');
  } else if (state.timeLeft <= 8) {
    els.timerProgress.classList.add('warning');
  }
};

const handleAnswer = async (selectedIndex) => {
  if (state.answering) return;
  state.answering = true;
  clearInterval(state.timer);

  const q = state.questions[state.currentIndex];
  const buttons = [...els.optionsGrid.querySelectorAll('.option-btn')];
  buttons.forEach((b) => (b.disabled = true));

  let isCorrect = false;
  let correctIndex = 0;

  if (selectedIndex === -1) {
    try {
      const res = await fetch('/api/questions/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: q._id, selectedIndex: -1 }),
      });
      const data = await res.json();
      correctIndex = data.correctIndex;
    } catch (_) {
      correctIndex = 0;
    }
    showToast("Time's up!", 'error');
    SoundFX.wrong();
    Effects.screenShake('hard');
    Effects.flashScreen('error');
    resetStreak();
  } else {
    try {
      const res = await fetch('/api/questions/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: q._id, selectedIndex }),
      });
      const data = await res.json();
      isCorrect = data.isCorrect;
      correctIndex = data.correctIndex;
    } catch (_) {
      showToast('Connection error', 'error');
      state.answering = false;
      return;
    }

    if (isCorrect) {
      state.streak += 1;
      state.maxStreak = Math.max(state.maxStreak, state.streak);
      checkStreakMilestones();

      const base = POINTS[state.difficulty] || 100;
      const bonus = Math.round(state.timeLeft * 5);
      const mult = getComboMultiplier();
      const earned = Math.round((base + bonus) * mult);

      state.score += earned;
      state.timeBonus += bonus;
      state.correctCount += 1;

      SoundFX.correct();
      if (mult >= 2) SoundFX.combo();

      buttons[selectedIndex].classList.add('option-btn--correct');
      Effects.flashScreen('success');

      const rect = buttons[selectedIndex].getBoundingClientRect();
      Effects.spawnFloatingScore(earned, rect.left + rect.width / 2 - 30, rect.top);
      if (mult > 1) showToast(`+${earned} (x${mult} combo!)`, 'success');
      else showToast(`+${earned} points!`, 'success');

      updateStreakUI();
    } else {
      SoundFX.wrong();
      buttons[selectedIndex].classList.add('option-btn--incorrect');
      Effects.screenShake('medium');
      Effects.flashScreen('error');
      showToast('Incorrect!', 'error');
      resetStreak();
    }
  }

  if (!isCorrect && correctIndex >= 0) {
    buttons[correctIndex]?.classList.add('option-btn--correct');
  }

  els.scoreValue.textContent = state.score;
  animateScore();

  setTimeout(() => {
    els.questionCard.classList.add('exiting');
    setTimeout(() => {
      state.currentIndex += 1;
      if (state.currentIndex >= state.questions.length) finishQuiz();
      else renderQuestion();
    }, 350);
  }, 1300);
};

const animateScore = () => {
  els.scoreValue.classList.add('score-display__value--pop');
  setTimeout(() => els.scoreValue.classList.remove('score-display__value--pop'), 300);
};

/* ===== Badges & Results ===== */
const awardBadge = (id, icon, label) => {
  if (state.earnedBadges.has(id)) return;
  state.earnedBadges.add(id);
  return `<span class="badge-chip">${icon} ${label}</span>`;
};

const computeBadges = (percentage, total) => {
  const badges = [];
  if (percentage === 100) badges.push(awardBadge('perfect', '🎯', 'Flawless'));
  if (state.maxStreak >= 5) badges.push(awardBadge('streak5', '🔥', 'Streak Master'));
  if (state.maxStreak >= 8) badges.push(awardBadge('streak8', '💎', 'Unstoppable'));
  if (state.timeBonus >= 500) badges.push(awardBadge('speed', '⚡', 'Speed Demon'));
  if (state.score >= 2000) badges.push(awardBadge('score2k', '🏆', 'High Scorer'));
  if (percentage >= 70 && total >= 12) badges.push(awardBadge('elite', '🚀', 'Elite Pilot'));
  return badges.filter(Boolean);
};

const finishQuiz = () => {
  clearInterval(state.timer);
  const total = state.questions.length;
  const percentage = total ? Math.round((state.correctCount / total) * 100) : 0;
  const perf = PERFORMANCE.find((p) => percentage >= p.min) || PERFORMANCE[PERFORMANCE.length - 1];

  els.resultsPercent.textContent = percentage;
  els.resultsMessage.textContent = perf.msg;
  els.resultsIcon.textContent = perf.icon;
  els.resultsRank.textContent = perf.rank;
  els.resultsScore.textContent = state.score;
  els.resultsCorrect.textContent = `${state.correctCount}/${total}`;
  els.resultsBonus.textContent = state.timeBonus;
  els.resultsStreak.textContent = state.maxStreak;

  const badges = computeBadges(percentage, total);
  els.resultsBadges.innerHTML = badges.length
    ? badges.join('')
    : '<span class="badge-chip badge-chip--muted">Keep playing to earn badges</span>';

  const circumference = 2 * Math.PI * 54;
  els.resultsRingFill.style.strokeDasharray = circumference;
  els.resultsRingFill.style.strokeDashoffset = circumference;

  showScreen('results');
  SoundFX.victory();
  if (percentage >= 70) Effects.burstConfetti(60);
  else if (percentage >= 50) Effects.burstConfetti(30);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const offset = circumference - (percentage / 100) * circumference;
      els.resultsRingFill.style.strokeDashoffset = offset;
    });
  });

  saveScore(percentage, total);
};

const saveScore = async (percentage, total) => {
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerName: state.playerName,
        category: state.category,
        difficulty: state.difficulty,
        score: state.score,
        totalQuestions: total,
        percentage,
        timeBonus: state.timeBonus,
      }),
    });
  } catch (_) {}
};

/* ===== Leaderboard ===== */
const loadLeaderboard = async () => {
  showScreen('leaderboard');
  els.leaderboardList.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Loading...</p>';
  els.leaderboardEmpty.classList.add('hidden');

  try {
    const res = await fetch('/api/leaderboard?limit=15');
    const data = await res.json();
    const list = data.leaderboard || [];

    if (list.length === 0) {
      els.leaderboardList.innerHTML = '';
      els.leaderboardEmpty.classList.remove('hidden');
      return;
    }

    els.leaderboardEmpty.classList.add('hidden');
    els.leaderboardList.innerHTML = list
      .map(
        (entry, i) => `
      <div class="leaderboard-item ${i < 3 ? 'leaderboard-item--top' : ''}">
        <span class="leaderboard-item__rank">#${i + 1}</span>
        <div>
          <div class="leaderboard-item__name">${escapeHtml(entry.playerName)}</div>
          <div class="leaderboard-item__meta">${entry.category} · ${entry.difficulty} · ${entry.score} pts</div>
        </div>
        <div class="leaderboard-item__score">${entry.percentage}%</div>
      </div>`
      )
      .join('');
  } catch (_) {
    els.leaderboardList.innerHTML = '';
    showToast('Could not load leaderboard', 'error');
  }
};

const escapeHtml = (str) => {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
};

/* ===== Keyboard ===== */
const onQuizKeydown = (e) => {
  if (!screens.quiz.classList.contains('screen--active') || state.answering) return;

  if (e.key >= '1' && e.key <= '4') {
    const idx = parseInt(e.key, 10) - 1;
    const btn = els.optionsGrid.querySelector(`[data-index="${idx}"]`);
    if (btn && !btn.disabled && !btn.classList.contains('option-btn--hidden')) {
      btn.click();
      btn.classList.add('option-btn--keypress');
    }
  }
  if (e.key === 's' || e.key === 'S') {
    if (state.lifelines.skip) useLifeline('skip');
  }
};

/* ===== Init ===== */
const init = () => {
  renderCategories();
  renderDifficulties();

  document.getElementById('btn-start').addEventListener('click', () => {
    SoundFX.click();
    showScreen('setup');
  });

  document.getElementById('btn-start-cta').addEventListener('click', () => {
    SoundFX.click();
    showScreen('setup');
  });

  document.getElementById('btn-launch').addEventListener('click', () => {
    SoundFX.click();
    startQuiz();
  });

  els.playerName.addEventListener('input', validateSetup);

  document.getElementById('btn-restart').addEventListener('click', () => {
    SoundFX.click();
    showScreen('setup');
  });

  document.getElementById('btn-leaderboard-landing').addEventListener('click', () => {
    SoundFX.click();
    loadLeaderboard();
  });

  document.getElementById('btn-leaderboard-results').addEventListener('click', () => {
    SoundFX.click();
    loadLeaderboard();
  });

  document.querySelectorAll('.btn-back').forEach((btn) => {
    btn.addEventListener('click', () => {
      SoundFX.click();
      showScreen(btn.dataset.back || 'landing');
    });
  });

  els.lifeline5050?.addEventListener('click', () => useLifeline('fifty'));
  els.lifelineTime?.addEventListener('click', () => useLifeline('time'));
  els.lifelineSkip?.addEventListener('click', () => useLifeline('skip'));

  document.addEventListener('keydown', onQuizKeydown);

  const saved = localStorage.getItem('neonQuizPlayer');
  if (saved) els.playerName.value = saved;
  els.playerName.addEventListener('change', () => {
    localStorage.setItem('neonQuizPlayer', els.playerName.value.trim());
  });

  ParticleField.start();
  showScreen('landing');
};

document.addEventListener('DOMContentLoaded', init);
