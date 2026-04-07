import { logoSvg } from "./logo.js";

const NAV_ITEMS = [
  { href: "products.html", label: "Products" },
  { href: "security.html", label: "Security" },
  { href: "privacy.html", label: "Privacy" },
  { href: "about.html", label: "About" },
  { href: "journal.html", label: "Journal" }
];

function navLinks(current) {
  return NAV_ITEMS.map((item) => {
    const active = current === item.href ? "active" : "";
    return `<a class="${active}" href="${item.href}">${item.label}</a>`;
  }).join("");
}

export function renderHeader(cartCount) {
  const el = document.querySelector("[data-site-header]");
  if (!el) return;
  const current = window.location.pathname.split("/").pop() || "index.html";
  const homeClass = current === "index.html" ? "active" : "";
  el.className = "site-header";
  el.innerHTML = `<div class="container header-inner"><a class="brand" href="index.html" aria-label="Faith Based Innovations home">${logoSvg()}<span>Faith Based Innovations<small>FBI, LLC</small></span></a><nav class="desktop-nav"><a class="${homeClass}" href="index.html">Home</a>${navLinks(current)}</nav><div class="header-utils"><a href="cart.html" class="btn btn-cart">Cart <span data-cart-count>${cartCount}</span></a><a href="products.html" class="btn btn-primary cta">Explore Products</a><button class="btn mobile-menu-button" aria-expanded="false" data-mobile-toggle>Menu</button></div></div><nav class="mobile-panel" data-mobile-panel><a class="${homeClass}" href="index.html">Home</a>${navLinks(current)}<a href="cart.html">Cart (${cartCount})</a><a href="products.html" class="btn btn-primary">Explore Products</a></nav>`;
}
