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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.attend) {
      errorBox.hidden = false;
      errorBox.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      attend: state.attend,
      guests: form.elements.guests.value,
      drinks: [...state.drinks],
      dish: state.dish,
      submittedAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-btn__label').textContent = 'Отправляем…';

    try {
      await sendRsvp(payload);
      form.hidden = true;
      thanks.hidden = false;
      thanks.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } catch (err) {
      errorBox.textContent = 'Не получилось отправить ответ. Попробуйте ещё раз или напишите Диночке в Telegram.';
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.submit-btn__label').textContent = 'Отправить ответ';
    }
  });

  resetBtn.addEventListener('click', () => {
    thanks.hidden = true;
    form.hidden = false;
  });

  async function sendRsvp(payload) {
    const endpoint = window.RSVP_ENDPOINT;
    if (!endpoint || endpoint.startsWith('PASTE_')) {
      throw new Error('RSVP endpoint is not configured (see js/config.js)');
    }
    // Google Apps Script Web Apps don't return browser-readable CORS headers,
    // so we fire the request in no-cors mode and treat a network-level
    // success (no thrown error) as delivered. text/plain avoids a CORS
    // preflight, which Apps Script does not handle.
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  }
})();
