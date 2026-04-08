# Faith Based Innovations — Site

Premium multi-page marketing site for **Faith Based Innovations, LLC** (CFO, Eden, Ledger).

## Develop

```bash
npm install
npm run dev
```

Edit **templates** and **`src/`**, then refresh. `npm run dev` regenerates HTML from EJS then starts Vite.

**Do not open root `index.html` with `file://` before a production build.** Those files load styles through Vite (`/src/main.js`), which only works with `npm run dev` or after `npm run build` rewrites them to `dist/assets/…`.

## Production build

```bash
npm run build
```

Output: **`dist/`** (deploy this folder to static hosting, e.g. GitHub Pages).

After `npm run build`, root `*.html` is **stamped** so you can open them via `file://` (they link to `dist/assets/…`). You can also open **`dist/index.html`** directly. On Windows: `npm run open` builds and opens the built home page in your browser.

- Source HTML is generated from `templates/pages/*.ejs` via `scripts/render-pages.mjs`.
- Product and navigation copy live in `src/data/site-config.mjs` (shared with the client bundle).

## Structure

| Path | Role |
|------|------|
| `templates/` | EJS partials + pages → root `*.html` |
| `src/` | CSS, JS, shared `site-config.mjs` |
| **`assests/`** or **`assets/`** | Static files (logos, images). Served at `/assets/…` in dev and copied into **`dist/assets/`** on build. No `public/` folder required. |
| `dist/` | Build output (gitignored) |

Optional hero image: put `hero-sphere.png` or `hero-sphere.webp` in `assests/` (same as the logo) to replace the CSS-only orb on the home page.
