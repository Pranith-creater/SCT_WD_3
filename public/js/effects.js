const Effects = (() => {
  const spawnFloatingScore = (points, x, y) => {
    const el = document.createElement('div');
    el.className = 'score-popup';
    el.textContent = `+${points}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (points >= 300) {
      el.style.color = 'var(--gold)';
      el.style.fontSize = '1.75rem';
    }
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  };

  const burstConfetti = (count = 40) => {
    const colors = ['#00f5ff', '#a855f7', '#fbbf24', '#ec4899', '#22c55e'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      p.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
      p.style.top = `${40 + (Math.random() - 0.5) * 10}%`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = `${Math.random() * 0.2}s`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  };

  const showAchievement = (icon, title, desc) => {
    const existing = document.querySelector('.achievement-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    badge.innerHTML = `
      <div class="achievement-badge__icon">${icon}</div>
      <div class="achievement-badge__title">${title}</div>
      <div class="achievement-badge__desc">${desc}</div>`;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 3200);
  };

  const screenShake = (intensity = 'medium') => {
    document.body.classList.remove('shake-light', 'shake-hard');
    void document.body.offsetWidth;
    document.body.classList.add(intensity === 'hard' ? 'shake-hard' : 'shake-light');
    setTimeout(() => document.body.classList.remove('shake-light', 'shake-hard'), 500);
  };

  const flashScreen = (type) => {
    const flash = document.createElement('div');
    flash.className = `screen-flash screen-flash--${type}`;
    document.body.appendChild(flash);
    requestAnimationFrame(() => flash.classList.add('screen-flash--active'));
    setTimeout(() => flash.remove(), 600);
  };

  return {
    spawnFloatingScore,
    burstConfetti,
    showAchievement,
    screenShake,
    flashScreen,
  };
})();
