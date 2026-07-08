# Дина & Святослав — свадебный сайт

Статический мобильный сайт-одностраничник (HTML/CSS/JS, без сборки).
Реализован по дизайну из `project/Wedding Site.dc.html`.

## Запуск локально

Любой статический сервер подойдёт, например:

```sh
cd site
python3 -m http.server 8000
```

Открыть `http://localhost:8000`.

## Структура

```
site/
  index.html          — разметка всех секций
  css/styles.css       — все стили
  js/petals.js          — анимация падающих лепестков (canvas)
  js/rsvp.js             — логика формы RSVP + отправка ответа
  js/config.js            — URL эндпоинта для RSVP (см. apps-script/README.md)
  assets/art/            — иллюстрации пары
  assets/tex/              — текстуры васи (фон секций)
  apps-script/            — Google Apps Script для сбора RSVP в Google Sheet
```

## RSVP-форма

Форма отправляет ответы в Google Sheet через Google Apps Script.
Перед публикацией сайта нужно один раз настроить эндпоинт — инструкция в
[`apps-script/README.md`](./apps-script/README.md), затем вставить
полученный URL в `js/config.js`.

## Деплой

Это чисто статические файлы — можно захостить на Netlify, Vercel (как
static), GitHub Pages, Cloudflare Pages и т.д. Просто указать `site/` как
корень публикации.
