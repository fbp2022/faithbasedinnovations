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
  "simulator.html",
  "reflections.html",
  "about.html",
  "security.html",
  "privacy.html",
  "terms.html"
];

const buildInputDir = path.join(__dirname, ".vite-input");
const input = Object.fromEntries(
  pages.map((p) => [p.replace(".html", ""), path.join(buildInputDir, p)])
);

/** Resolve /assets/<file> to ./assets/<file> (no public/ folder required). */
function resolveLocalAssetDiskPath(urlPath) {
  const rel = urlPath.replace(/^\/?assets\//, "").split("?")[0];
  if (!rel || rel.includes("..")) return null;
  const full = path.join(__dirname, "assets", rel);
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
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

export default defineConfig({
  /** Temporary EJS output lives here; build emits flat HTML into project root. */
  root: buildInputDir,
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
  ],
  build: {
    /** Flat site: HTML + bundles live next to package.json (no dist/). */
    outDir: __dirname,
    emptyOutDir: false,
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
    }
  }
});
