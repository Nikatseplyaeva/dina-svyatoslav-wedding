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

  function formatMessage(p) {
    const lines = [
      '🎎 <b>Новый RSVP</b>',
      '',
      `<b>Имя:</b> ${escapeHtml(p.name || '—')}`,
      `<b>Придёт:</b> ${p.attend === 'yes' ? 'Да, буду' : 'Не смогу'}`,
      `<b>Напитки:</b> ${p.drinks.length ? escapeHtml(p.drinks.join(', ')) : '—'}`,
      `<b>Блюдо:</b> ${p.dish ? escapeHtml(p.dish) : '—'}`,
    ];
    return lines.join('\n');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  async function sendToChat(token, chatId, text) {
    // A JSON POST body needs Content-Type: application/json to be parsed by
    // Telegram, but that header triggers a CORS preflight the API doesn't
    // handle. A GET with query params avoids preflight entirely (no custom
    // headers) and is the form we already confirmed works from a browser.
    const url = new URL(`https://api.telegram.org/bot${token}/sendMessage`);
    url.searchParams.set('chat_id', chatId);
    url.searchParams.set('text', text);
    url.searchParams.set('parse_mode', 'HTML');

    const res = await fetch(url);
    const data = await res.json();
    if (!data.ok) throw new Error(data.description || 'Telegram API error');
  }

  async function sendRsvp(payload) {
    const token = window.TELEGRAM_BOT_TOKEN;
    const chatIds = window.TELEGRAM_CHAT_IDS;
    if (!token || token.startsWith('PASTE_') || !Array.isArray(chatIds) || !chatIds.length) {
      throw new Error('Telegram bot is not configured (see js/config.js)');
    }

    const text = formatMessage(payload);
    const results = await Promise.allSettled(chatIds.map((id) => sendToChat(token, id, text)));
    const allFailed = results.every((r) => r.status === 'rejected');
    if (allFailed) throw results[0].reason;
    results.forEach((r) => { if (r.status === 'rejected') console.warn('RSVP delivery failed for one recipient:', r.reason); });
  }
})();
