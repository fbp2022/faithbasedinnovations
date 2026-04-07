import { PRODUCTS } from "./site-data.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { renderBottomNav } from "../components/bottom-nav.js";

function cartCount() {
  const raw = localStorage.getItem("fbi_cart");
  if (!raw) return 0;
  try {
    const items = JSON.parse(raw);
    return items.reduce((sum, item) => sum + item.qty, 0);
  } catch {
    return 0;
  }
}

function refreshCartBadges() {
  const n = String(cartCount());
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = n;
  });
}

function wireProductActions() {
  document.querySelectorAll("[data-product-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-product-action");
      const product = PRODUCTS[id];
      if (!product) return;

      if (product.purchasable) {
        const raw = localStorage.getItem("fbi_cart");
        const list = raw ? JSON.parse(raw) : [];
        const existing = list.find((item) => item.id === id);
        if (existing) existing.qty += 1;
        else list.push({ id, qty: 1 });
        localStorage.setItem("fbi_cart", JSON.stringify(list));
        refreshCartBadges();
        btn.textContent = "Added";
        setTimeout(() => (btn.textContent = product.actionLabel), 900);
        return;
      }

      const ack = product.status === "Join waitlist" ? "On the list" : "Noted";
      btn.textContent = ack;
      setTimeout(() => (btn.textContent = product.actionLabel), 1100);
    });
  });
}

const count = cartCount();
renderHeader(count);
renderFooter();
renderBottomNav(count);
wireProductActions();
refreshCartBadges();
