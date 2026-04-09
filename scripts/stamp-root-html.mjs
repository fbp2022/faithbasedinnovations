import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

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

const rootIndex = path.join(root, "index.html");
if (!fs.existsSync(rootIndex)) {
  console.warn("stamp-root-html: index.html missing at project root; skip.");
  process.exit(0);
}

const sample = fs.readFileSync(rootIndex, "utf8");
const cssM = sample.match(/href="\.\/assets\/([^"]+\.css)"/);
const jsM = sample.match(/src="\.\/assets\/(?:chunks\/)?([^"]+\.js)"/);

/* Tailwind CDN pages have no Vite CSS/JS in index.html — nothing to stamp. */
if (!cssM || !jsM) {
  console.warn("stamp-root-html: no Vite CSS/JS in index.html — skip bundle stamping (Tailwind CDN layout).");
  process.exit(0);
}

const cssHref = `./assets/${cssM[1]}`;
const jsSrc = sample.includes("./assets/chunks/")
  ? `./assets/chunks/${jsM[1]}`
  : `./assets/${jsM[1]}`;

for (const name of ROOT_PAGES) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, "utf8");
  /* Legacy flat migration: old builds used dist/assets/… */
  html = html.replace(/href="dist\/assets\//g, 'href="./assets/');
  html = html.replace(/src="dist\/assets\//g, 'src="./assets/');
  const hasDevEntry = html.includes('src="/src/main.js"');
  const hasStampedBundle =
    /src="\.\/assets\/chunks\/[^"]+\.js"/.test(html) || html.includes("./assets/main.css");

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
      /<link rel="stylesheet" href="\.\/assets\/[^"]+\.css" \/>/,
      `<link rel="stylesheet" href="${cssHref}" />`
    );
    html = html.replace(
      /<script type="module" src="\.\/assets\/chunks\/[^"]+\.js"><\/script>/,
      `<script type="module" src="${jsSrc}"></script>`
    );
  }

  fs.writeFileSync(filePath, html, "utf8");
}

console.log("stamp-root-html: root *.html references built bundles under ./assets/.");
