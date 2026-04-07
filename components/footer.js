import { logoSvg } from "./logo.js";

export function renderFooter() {
  const el = document.querySelector("[data-site-footer]");
  if (!el) return;
  const year = new Date().getFullYear();
  el.className = "site-footer";
  el.innerHTML = `<div class="container footer-grid"><div><a class="brand" href="index.html">${logoSvg()}<span>Faith Based Innovations<small>Premium desktop software</small></span></a><p>Local-first software for people who prefer control, privacy, and long-term reliability.</p></div><div><h3>Products</h3><a href="product-cfo.html">CFO</a><a href="product-ledger.html">Ledger</a><a href="product-eden.html">Eden</a><a href="products.html">All products</a></div><div><h3>Company</h3><a href="about.html">About</a><a href="journal.html">Stewardship Journal</a><a href="security.html">Security</a></div><div><h3>Trust / Legal</h3><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="purchase.html">Purchase</a></div></div><div class="container footer-bottom"><span>Copyright ${year} Faith Based Innovations, LLC</span><span>Software that does its job and then minds its business.</span></div>`;
}
