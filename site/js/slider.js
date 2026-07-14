(() => {
  const slider = document.getElementById('dresscode-slider');
  const dotsEl = document.getElementById('dresscode-slider-dots');
  if (!slider || !dotsEl) return;

  const track = slider.querySelector('.slider__track');
  const slides = [...track.querySelectorAll('.slider__slide')];
  if (!slides.length) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsEl.appendChild(dot);
  });
  const dots = [...dotsEl.children];

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      slides.forEach((slide, i) => {
        const dist = Math.abs((slide.offsetLeft + slide.clientWidth / 2) - trackCenter);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === closest));
      ticking = false;
    });
  }, { passive: true });
})();
