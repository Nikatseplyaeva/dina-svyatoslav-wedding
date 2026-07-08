(() => {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dpr;
  let downV = 0;      // downward scroll energy (0..1+), only downward scroll adds energy
  let lastY = window.scrollY || 0;
  let raf = null;

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('scroll', () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const dy = y - lastY;
    lastY = y;
    if (dy > 0) downV = Math.min(1.4, downV + dy * 0.016);
  }, { passive: true });

  const colors = ['#f7c6d0', '#ef9bab', '#e0728a', '#d4506a', '#c8243b'];
  let MAXP = W < 560 ? 16 : 26;
  const petals = [];

  const make = () => ({
    x: Math.random() * W,
    y: -14 - Math.random() * 40,
    s: 6 + Math.random() * 9,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.05,
    vy: 0.9 + Math.random() * 1.1,
    sway: 0.5 + Math.random() * 1.0,
    swayPh: Math.random() * Math.PI * 2,
    swaySp: 0.010 + Math.random() * 0.016,
    color: colors[(Math.random() * colors.length) | 0],
    a: 0,
    maxA: 0.55 + Math.random() * 0.4,
  });

  const drawPetal = (p) => {
    const s = p.s;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.68, -s * 0.62, s * 0.5, s * 0.5, 0, s * 0.85);
    ctx.bezierCurveTo(-s * 0.5, s * 0.5, -s * 0.68, -s * 0.62, 0, -s);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = p.a * 0.3;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.55); ctx.lineTo(0, s * 0.5); ctx.stroke();
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    // energy eases down smoothly once scrolling stops
    downV = Math.max(0, downV * 0.955 - 0.004);
    const spawning = downV > 0.06;

    // new petals appear only while scrolling down
    if (spawning && petals.length < MAXP && Math.random() < 0.30) petals.push(make());

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      // always keep drifting gently so petals finish their fall smoothly
      // (never freeze mid-air); scroll energy just speeds them up
      const speed = 0.34 + downV * 1.15;
      p.swayPh += p.swaySp;
      p.x += Math.sin(p.swayPh) * p.sway * (0.6 + downV * 0.5);
      p.y += p.vy * speed;
      p.rot += p.vr * (0.6 + downV);
      p.a = Math.min(p.maxA, p.a + 0.04);
      drawPetal(p);
      if (p.y > H + 24) petals.splice(i, 1);
    }
    raf = requestAnimationFrame(tick);
  };
  tick();
})();
