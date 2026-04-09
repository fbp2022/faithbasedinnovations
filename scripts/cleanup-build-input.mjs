import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const buildInputDir = path.join(root, ".vite-input");

fs.rmSync(buildInputDir, { recursive: true, force: true });
console.log("cleanup-build-input: removed .vite-input/");
