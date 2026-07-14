# RSVP → Telegram bot setup

The site's RSVP form sends each response directly to a Telegram chat via a
bot, using Telegram's Bot API from the browser — no server needed. This
replaces the earlier Google Apps Script approach, which turned out to be
unreliable for some guests (Apps Script's execution endpoint appears to get
silently blocked on some Russian networks, while `docs.google.com`/the
Apps Script editor itself worked fine — the site would show "Спасибо!" even
though the request never arrived). Telegram's API is far more consistently
reachable.

## 1. Create the bot

1. In Telegram, open a chat with **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot` and follow the prompts (pick a name and a username ending
   in `bot`).
3. BotFather replies with a **token** that looks like
   `123456789:AAExampleTokenExampleTokenExample`. Copy it.

## 2. Get your chat ID

Decide where you want RSVPs to land — your own DMs with the bot, or a group
chat you share with your partner.

**For your own DMs:**
1. Search for your new bot by its username and press **Start** (or send it
   any message, e.g. "привет").
2. In a browser, open:
   `https://api.telegram.org/bot<TOKEN>/getUpdates` (replace `<TOKEN>`).
3. Look for `"chat":{"id":123456789,...}` in the response — that number is
   your chat ID.

**For a group chat:**
1. Add the bot to the group.
2. Send any message in the group.
3. Open the same `getUpdates` URL — the group's chat ID will be a
   **negative** number (e.g. `-1001234567890`).

## 3. Wire it into the site

Paste both values into [`../js/config.js`](../js/config.js):

```js
window.TELEGRAM_BOT_TOKEN = '123456789:AAExampleTokenExampleTokenExample';
window.TELEGRAM_CHAT_ID = '123456789';
```

That's it — every RSVP submission arrives as a formatted message in that
chat, in real time.

## Security note

The bot token lives in a public JS file, so anyone who views the page
source can read it. With that token, someone could send messages *as your
bot* — but only to chats the bot is already a member of (your DMs with it,
or the group you added it to). They can't read your other Telegram
messages, access your account, or do anything beyond what this bot can do
(send text messages). Worst case is someone spamming your RSVP chat with
fake-looking messages, which is easy to spot and ignore. If that's not an
acceptable risk for you, the alternative is routing this through a small
server-side proxy that keeps the token secret — say the word and I can set
that up instead, though it adds a dependency on wherever that proxy is
hosted being reachable too.
