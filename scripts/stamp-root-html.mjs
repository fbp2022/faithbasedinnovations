import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const buildInputDir = path.join(root, ".vite-input");

const ROOT_PAGES = [
  "index.html",
  "products.html",
  "product-cfo.html",
  "product-eden.html",
  "product-ledger.html",
  "compare.html",
  "support.html",
  "about.html",
  "security.html",
  "privacy.html",
  "terms.html"
];

/** Root HTML (file://) uses dist/ bundles; rewrite logo src when file exists in dist/assets. */
function stampImgRefsToDist(html) {
  const distAssetsDir = path.join(root, "dist", "assets");
  if (!fs.existsSync(distAssetsDir)) return html;
  const names = new Set(fs.readdirSync(distAssetsDir));
  return html.replace(/src="(?:\.\/)?assets\/([^"]+)"/g, (full, rel) => {
    const clean = rel.split("?")[0].split("#")[0];
    if (names.has(clean)) {
      return `src="dist/assets/${rel}"`;
    }
    return full;
  });
}

const distIndex = path.join(root, "dist", "index.html");
if (!fs.existsSync(distIndex)) {
  console.warn("stamp-root-html: dist/index.html missing; skip (run vite build first).");
  process.exit(0);
}

const sample = fs.readFileSync(distIndex, "utf8");
const cssM = sample.match(/href="\.\/assets\/([^"]+\.css)"/);
const jsM = sample.match(/src="\.\/assets\/(?:chunks\/)?([^"]+\.js)"/);

/* Tailwind CDN pages have no Vite CSS/JS in dist/index.html — nothing to stamp. */
if (!cssM || !jsM) {
  console.warn("stamp-root-html: no Vite CSS/JS in dist/index.html — skip bundle stamping (Tailwind CDN layout).");
  process.exit(0);
}

const cssHref = `dist/assets/${cssM[1]}`;
const jsSrc = sample.includes("./assets/chunks/")
  ? `dist/assets/chunks/${jsM[1]}`
  : `dist/assets/${jsM[1]}`;

for (const name of ROOT_PAGES) {
  const filePath = path.join(buildInputDir, name);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, "utf8");
  const hasDevEntry = html.includes('src="/src/main.js"');
  const hasStampedBundle =
    /src="dist\/assets\/chunks\/[^"]+\.js"/.test(html) || html.includes("dist/assets/main.css");

  if (!hasDevEntry && !hasStampedBundle) continue;

  if (hasDevEntry) {
    if (!html.includes(cssHref)) {
      html = html.replace("</head>", `  <link rel="stylesheet" href="${cssHref}" />\n</head>`);
    }
    html = html.replace(
      /\s*<script type="module" src="\/src\/main\.js"><\/script>\s*/,
      `\n  <script type="module" src="${jsSrc}"></script>\n`
    );
  } else {
    html = html.replace(
      /<link rel="stylesheet" href="dist\/assets\/[^"]+\.css" \/>/,
      `<link rel="stylesheet" href="${cssHref}" />`
    );
    html = html.replace(
      /<script type="module" src="dist\/assets\/chunks\/[^"]+\.js"><\/script>/,
      `<script type="module" src="${jsSrc}"></script>`
    );
  }

  html = stampImgRefsToDist(html);

  fs.writeFileSync(filePath, html, "utf8");
}

console.log("stamp-root-html: .vite-input/*.html now references built assets in dist/ (file:// friendly).");
