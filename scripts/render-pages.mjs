import ejs from "ejs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as site from "../src/data/site-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pagesDir = path.join(root, "templates", "pages");
/** Temporary Vite MPA inputs — cleaned after build. */
const buildInputDir = path.join(root, ".vite-input");

function mergeCopyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) mergeCopyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const logoFile = site.SITE.logoFile || "FBI_Transparent.png";
const logoAbs = path.join(root, "assets", logoFile);
const shared = {
  SITE: site.SITE,
  NAV_PRIMARY: site.NAV_PRIMARY,
  NAV_PRODUCTS: site.NAV_PRODUCTS,
  PRODUCTS: site.PRODUCTS,
  /** Relative to each HTML file at project root; null → tw-header uses inline placeholder. */
  LOGO_HREF: fs.existsSync(logoAbs) ? `./assets/${logoFile}` : null
};

// Synchronous render so <% include %> never resolves to a Promise.
const pages = [
  {
    name: "index",
    out: "index.html",
    data: {
      title: `${site.SITE.brand} | Premium Desktop Software`,
      description: site.SITE.tagline,
      activeNav: "home",
      pageClass: "home"
    }
  },
  { name: "products", out: "products.html", data: { title: `Products | ${site.SITE.legalName}`, description: "CFO, Eden, and Ledger.", activeNav: "products", pageClass: "products" } },
  { name: "product-cfo", out: "product-cfo.html", data: { title: `CFO | ${site.SITE.legalName}`, description: site.PRODUCTS.cfo.subhead, activeNav: "products", activeProduct: "cfo", pageClass: "product product-cfo" } },
  { name: "product-eden", out: "product-eden.html", data: { title: `Eden | ${site.SITE.legalName}`, description: site.PRODUCTS.eden.subhead, activeNav: "products", activeProduct: "eden", pageClass: "product product-eden" } },
  { name: "product-ledger", out: "product-ledger.html", data: { title: `Ledger | ${site.SITE.legalName}`, description: site.PRODUCTS.ledger.subhead, activeNav: "products", activeProduct: "ledger", pageClass: "product product-ledger" } },
  { name: "compare", out: "compare.html", data: { title: `Compare | ${site.SITE.legalName}`, description: "CFO, Eden, and Ledger—distinct scope and Steward roles.", activeNav: "compare", pageClass: "compare" } },
  { name: "support", out: "support.html", data: { title: `Support | ${site.SITE.legalName}`, description: "Documentation, policies, and help.", activeNav: "support", pageClass: "support" } },
  { name: "about", out: "about.html", data: { title: `About | ${site.SITE.legalName}`, description: "Who we are and how we build.", activeNav: "about", pageClass: "about" } },
  { name: "security", out: "security.html", data: { title: `Security | ${site.SITE.legalName}`, description: "Security posture.", activeNav: "security", pageClass: "legal security" } },
  { name: "privacy", out: "privacy.html", data: { title: `Privacy | ${site.SITE.legalName}`, description: "Privacy policy.", activeNav: "privacy", pageClass: "legal privacy" } },
  { name: "terms", out: "terms.html", data: { title: `Terms | ${site.SITE.legalName}`, description: "Terms of use.", activeNav: "terms", pageClass: "legal terms" } }
];

const tmplRoot = path.join(root, "templates");

fs.rmSync(buildInputDir, { recursive: true, force: true });
fs.mkdirSync(buildInputDir, { recursive: true });
mergeCopyDir(path.join(root, "assets"), path.join(buildInputDir, "assets"));

for (const p of pages) {
  const filePath = path.join(pagesDir, `${p.name}.ejs`);
  const src = fs.readFileSync(filePath, "utf8");
  const html = ejs.render(src, { ...shared, activeProduct: null, ...p.data }, {
    filename: filePath,
    root: tmplRoot
  });
  fs.writeFileSync(path.join(buildInputDir, p.out), html, "utf8");
}

console.log(`Rendered ${pages.length} pages to .vite-input/ for Vite build.`);
