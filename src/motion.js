const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initMotion() {
  if (reduce) return;

  const hero = document.querySelector(".hero-cine[data-parallax]");
  const glow = hero?.querySelector(".hero-cine__glow");
  if (!glow) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      glow.style.transform = `translateY(${window.scrollY * 0.08}px)`;
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}
