const ParticleField = (() => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return { start: () => {}, stop: () => {} };

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let w = 0;
  let h = 0;

  const COLORS = ['#00f5ff', '#a855f7', '#fbbf24', '#ec4899'];

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  const createParticle = () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.2,
  });

  const init = (count = 80) => {
    particles = Array.from({ length: count }, createParticle);
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    animId = requestAnimationFrame(draw);
  };

  const start = () => {
    resize();
    init(window.innerWidth < 600 ? 45 : 80);
    window.addEventListener('resize', resize);
    if (!animId) draw();
  };

  const stop = () => {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
  };

  return { start, stop };
})();
