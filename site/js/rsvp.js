(() => {
  const form = document.getElementById('rsvp-form');
  const thanks = document.getElementById('rsvp-thanks');
  const errorBox = document.getElementById('rsvp-error');
  const submitBtn = document.getElementById('rsvp-submit');
  const resetBtn = document.getElementById('rsvp-reset');

  const attendGroup = document.getElementById('attend-group');
  const drinksGroup = document.getElementById('drinks-group');
  const dishGroup = document.getElementById('dish-group');

  const state = { attend: '', drinks: new Set(), dish: '' };

  attendGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.attend = btn.dataset.attend;
    [...attendGroup.querySelectorAll('.chip')].forEach(c =>
      c.classList.toggle('is-active', c === btn));
    errorBox.hidden = true;
  });

  drinksGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const d = btn.dataset.drink;
    if (state.drinks.has(d)) { state.drinks.delete(d); btn.classList.remove('is-active'); }
    else { state.drinks.add(d); btn.classList.add('is-active'); }
  });

  const pickDish = (el) => {
    state.dish = el.dataset.dish;
    [...dishGroup.querySelectorAll('.dish')].forEach(d => {
      const active = d === el;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-checked', String(active));
    });
  };
  dishGroup.addEventListener('click', (e) => {
    const el = e.target.closest('.dish');
    if (el) pickDish(el);
  });
  dishGroup.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest('.dish');
    if (el) { e.preventDefault(); pickDish(el); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.attend) {
      errorBox.hidden = false;
      errorBox.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    // Отправка ответов отключена — форма только показывает благодарность.
    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', () => {
    thanks.hidden = true;
    form.hidden = false;
  });
})();
