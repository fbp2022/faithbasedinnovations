import { PRODUCTS } from "./site-data.js";

function getCart() {
  const raw = localStorage.getItem("fbi_cart");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem("fbi_cart", JSON.stringify(items));
}

function purchasableItems(items) {
  return items.filter((entry) => PRODUCTS[entry.id]?.purchasable);
}

function renderCartRows(container, items) {
  if (!container) return;
  const live = purchasableItems(items);
  if (!live.length) {
    container.innerHTML = `<article class="card">
      <h3>Cart is staged for a future release</h3>
      <p>Faith Based Innovations, LLC is pre-release. There is nothing for sale yet. This page exists so the purchase path is ready when products ship.</p>
      <p class="muted">You can still explore products and join waitlists from the products page.</p>
    </article>`;
    return;
  }
  container.innerHTML = live
    .map((entry) => {
      const product = PRODUCTS[entry.id];
      return `<article class="card"><span class="status">${product.status}</span><h3>${product.name}</h3><p>${product.short}</p><p class="muted">${product.priceLabel}</p><div class="qty-row"><button class="btn" type="button" data-cart-dec="${entry.id}" aria-label="Decrease quantity">-</button><p>Quantity: ${entry.qty}</p><button class="btn" type="button" data-cart-inc="${entry.id}" aria-label="Increase quantity">+</button></div></article>`;
    })
    .join("");
}

function renderPurchaseSummary(container, items) {
  if (!container) return;
  const live = purchasableItems(items);
  if (!live.length) {
    container.innerHTML = `<p class="muted">No purchasable items yet. Checkout will activate when products are released and payment integration is live.</p>`;
    return;
  }
  container.innerHTML = `<ul class="bullets">${live.map((item) => `<li>${PRODUCTS[item.id]?.name || item.id} x ${item.qty}</li>`).join("")}</ul><p class="muted">Payment integration is not live yet.</p>`;
}

function wireQty(container) {
  if (!container) return;
  container.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.getAttribute("data-cart-inc") || target.getAttribute("data-cart-dec");
    if (!id) return;
    const items = purchasableItems(getCart());
    const row = items.find((entry) => entry.id === id);
    if (!row) return;
    if (target.hasAttribute("data-cart-inc")) row.qty += 1;
    if (target.hasAttribute("data-cart-dec")) row.qty -= 1;
    const next = items.filter((entry) => entry.qty > 0);
    setCart(next);
    renderCartRows(container, next);
    renderPurchaseSummary(document.querySelector("[data-purchase-summary]"), next);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(next.reduce((s, i) => s + i.qty, 0));
    });
  });
}

const cartContainer = document.querySelector("[data-cart-items]");
const summary = document.querySelector("[data-purchase-summary]");
const cleaned = purchasableItems(getCart());
setCart(cleaned);
renderCartRows(cartContainer, cleaned);
renderPurchaseSummary(summary, cleaned);
wireQty(cartContainer);
