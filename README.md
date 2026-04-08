# Sean Portfolio v3

This version adds:

- Pinterest-like editorial/minimal layout
- Apple-style motion touches
- Carla's Gallery section
- Owner Mode image uploader

## Important limitation

The gallery uploader uses browser localStorage.

That means:

- You can upload drawings from the page itself
- They stay saved on the browser/device where you uploaded them
- On plain GitHub Pages, uploads do **not** sync across devices automatically

## If you want true live updates from any device

Use one of these later:

- Supabase storage + auth
- Firebase storage + auth
- Decap CMS / Netlify CMS
- A small backend

## Files

- index.html
- style.css
- script.js
