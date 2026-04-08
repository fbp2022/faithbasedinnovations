import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pages = [
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

const input = Object.fromEntries(
  pages.map((p) => [p.replace(".html", ""), path.resolve(__dirname, p)])
);

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

/** Resolve /assets/<file> to ./assests/<file> or ./assets/<file> (no public/ folder required). */
function resolveLocalAssetDiskPath(urlPath) {
  const rel = urlPath.replace(/^\/?assets\//, "").split("?")[0];
  if (!rel || rel.includes("..")) return null;
  for (const base of ["assests", "assets"]) {
    const full = path.join(__dirname, base, rel);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

const MIME = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff"
};

function localAssetsDevMiddleware() {
  return (req, res, next) => {
    const u = req.url || "";
    if (!u.startsWith("/assets/")) return next();
    const filePath = resolveLocalAssetDiskPath(u);
    if (!filePath) return next();
    try {
      const body = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
      res.end(body);
    } catch {
      next();
    }
  };
}

function copyAssestsToDistAssets() {
  return {
    name: "copy-assests-to-dist-assets",
    /** After Rollup writes JS/CSS into dist/assets, merge logos and other static files from ./assests or ./assets. */
    writeBundle() {
      const dest = path.join(__dirname, "dist", "assets");
      for (const folder of ["assests", "assets"]) {
        const src = path.join(__dirname, folder);
        if (fs.existsSync(src)) mergeCopyDir(src, dest);
      }
    }
  };
}

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [
    {
      name: "local-assets-dev",
      enforce: "pre",
      configureServer(server) {
        server.middlewares.use(localAssetsDevMiddleware());
      }
    },
    copyAssestsToDistAssets()
  ],
  build: {
    rollupOptions: {
      input,
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/chunks/[name]-[hash].js",
        assetFileNames: (info) => {
          const n = info.names?.[0] ?? info.name ?? "";
          if (typeof n === "string" && n.endsWith(".css")) return "assets/main.css";
          return "assets/[name][extname]";
        }
      }
    },
    emptyOutDir: true
  }
});
