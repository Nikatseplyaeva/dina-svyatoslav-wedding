# RSVP → Google Sheet setup

The site's RSVP form POSTs to a Google Apps Script "Web App" URL, which appends
each response as a row in a Google Sheet you own. Nothing is stored anywhere
else.

## 1. The Sheet

Using this sheet:
https://docs.google.com/spreadsheets/d/1hNr1WIPV_hQUHvHyE9KdOqgoA4PM11HISFj38RdndQw/edit

The script below creates its own "RSVP" tab in it automatically on the first
submission — no manual columns needed.

## 2. Add the script

1. Open the Sheet above, then **Extensions → Apps Script**.
2. Delete the placeholder `myFunction` code and paste in the contents of
   [`Code.gs`](./Code.gs) from this folder.
3. Save the project (any name is fine, e.g. "RSVP endpoint").

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then authorize the script when prompted (it needs
   permission to edit the Sheet it's bound to).
5. Copy the **Web app URL** you're given — it looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.

## 4. Wire it into the site

Paste that URL into [`../js/config.js`](../js/config.js):

```js
window.RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
```

That's it — submissions will show up as new rows in the "RSVP" tab of your
Sheet, with a timestamp, name, attendance, guest count, drink choices, and
dish pick.

## Notes

- If you ever edit `Code.gs`, you need to **Deploy → Manage deployments →
  edit (pencil) → New version** for the change to go live — saving alone
  isn't enough.
- The request is sent with `mode: 'no-cors'`, so the browser can't read the
  response back (Apps Script doesn't send browser-readable CORS headers).
  The site treats "no network error" as success — it can't detect
  Apps Script-side failures (e.g. a broken script). Check the Sheet directly
  if you suspect something isn't arriving.
