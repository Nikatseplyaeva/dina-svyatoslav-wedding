// RSVP relay endpoint — see ../cloudflare-worker/README.md for setup steps.
// The Telegram bot token and chat IDs now live in the Worker's secrets,
// not here, so guests' browsers never see them and never need to reach
// api.telegram.org directly (which some networks block).
window.RSVP_RELAY_URL = 'https://divine-glitter-132c.nika-tseplyaeva.workers.dev';
