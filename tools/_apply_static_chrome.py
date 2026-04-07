"""One-shot: embed static header, footer, mobile nav in all root HTML pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (desktop_nav_active_key or "", mobile_bar: home|products|security|about|cart|None, journal_secondary_active)
CONFIG = {
    "index.html": ("", "home", False),
    "products.html": ("products", "products", False),
    "product-cfo.html": ("products", "products", False),
    "product-ledger.html": ("products", "products", False),
    "product-eden.html": ("products", "products", False),
    "security.html": ("security", "security", False),
    "privacy.html": ("privacy", None, False),
    "terms.html": ("", None, False),
    "about.html": ("about", "about", False),
    "journal.html": ("journal", None, True),
    "cart.html": ("cart", "cart", False),
    "purchase.html": ("", "cart", False),
}

DEFAULT_SCRIPTS = """  <script type="module" src="js/main.js"></script>
  <script type="module" src="js/cart.js"></script>"""


def nav_link(href: str, label: str, key: str, active_key: str) -> str:
    active = key == active_key
    cls = "nav-link active" if active else "nav-link"
    cur = ' aria-current="page"' if active else ""
    return f'<a href="{href}" class="{cls}"{cur}>{label}</a>'


def bottom_link(href: str, label: str, key: str, active_key, badge: bool = False) -> str:
    active = active_key == key
    cls = "bottom-nav-link active" if active else "bottom-nav-link"
    cur = ' aria-current="page"' if active else ""
    badge_html = (
        '<span class="bottom-nav-badge" data-cart-count>0</span>' if badge else ""
    )
    return f'<a href="{href}" class="{cls}"{cur}><span class="bottom-nav-label">{label}</span>{badge_html}</a>'


def header_html(desktop_active: str) -> str:
    links = [
        nav_link("products.html", "Products", "products", desktop_active),
        nav_link("security.html", "Security", "security", desktop_active),
        nav_link("privacy.html", "Privacy", "privacy", desktop_active),
        nav_link("about.html", "About", "about", desktop_active),
        nav_link("journal.html", "Journal", "journal", desktop_active),
    ]
    cart_active = desktop_active == "cart"
    cart_cls = "nav-link active" if cart_active else "nav-link"
    cart_cur = ' aria-current="page"' if cart_active else ""
    cart = f'<a href="cart.html" class="{cart_cls}"{cart_cur}>Cart<span class="nav-cart-count" data-cart-count>0</span></a>'
    nav_inner = "\n      ".join(links + [cart])
    return f"""<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Faith Based Innovations, LLC home">
      <span class="logo-mark logo-mark--header">
        <img src="assets/FBI.png" alt="" decoding="async" fetchpriority="high" />
      </span>
      <span class="brand-text">
        <span class="brand-text-full">Faith Based Innovations, LLC</span>
        <span class="brand-text-short">FBI, LLC</span>
      </span>
    </a>
    <nav class="desktop-nav" aria-label="Primary">
      {nav_inner}
    </nav>
    <div class="header-utils">
      <a href="products.html" class="btn btn-primary cta">Join waitlist</a>
    </div>
  </div>
</header>"""


def footer_html() -> str:
    return """<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand brand--footer" href="index.html">
        <span class="logo-mark logo-mark--footer">
          <img src="assets/FBI.png" alt="" decoding="async" />
        </span>
        <span>Faith Based Innovations, LLC</span>
      </a>
      <p>Premium desktop software. Local-first, privacy-first, built for long-term control.</p>
    </div>
    <div>
      <h3>Products</h3>
      <a href="product-cfo.html">CFO</a>
      <a href="product-ledger.html">Ledger</a>
      <a href="product-eden.html">Eden</a>
      <a href="products.html">All products</a>
    </div>
    <div>
      <h3>Company</h3>
      <a href="about.html">About</a>
      <a href="journal.html">Journal</a>
    </div>
    <div>
      <h3>Trust / Legal</h3>
      <a href="security.html">Security</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>Copyright Faith Based Innovations, LLC</span>
    <span>Pre-release site. Commerce flows are staged for a future public release.</span>
  </div>
</footer>"""


def bottom_nav_html(mobile_active, journal_active: bool) -> str:
    primary = [
        bottom_link("index.html", "Home", "home", mobile_active, False),
        bottom_link("products.html", "Products", "products", mobile_active, False),
        bottom_link("security.html", "Security", "security", mobile_active, False),
        bottom_link("about.html", "About", "about", mobile_active, False),
        bottom_link("cart.html", "Cart", "cart", mobile_active, True),
    ]
    j_cls = "bottom-nav-journal active" if journal_active else "bottom-nav-journal"
    j_cur = ' aria-current="page"' if journal_active else ""
    primary_joined = "\n    ".join(primary)
    return f"""<nav class="site-bottom-nav" aria-label="Mobile primary navigation">
  <div class="site-bottom-nav-primary">
    {primary_joined}
  </div>
  <a href="journal.html" class="{j_cls}"{j_cur}>Journal</a>
</nav>"""


def extract_scripts(after_main: str) -> str:
    found = re.findall(
        r'<script\s+type="module"\s+src="[^"]+"\s*>\s*</script>', after_main
    )
    if found:
        return "\n  ".join(found)
    return DEFAULT_SCRIPTS.strip()


def process_file(name: str) -> None:
    path = ROOT / name
    raw = path.read_text(encoding="utf-8")

    head_m = re.match(r"([\s\S]*?<body>\s*)", raw)
    if not head_m:
        raise SystemExit(f"No <body> in {name}")
    head_s = head_m.group(1)

    main_m = re.search(r"<main[^>]*>[\s\S]*?</main>", raw)
    if not main_m:
        raise SystemExit(f"No <main> in {name}")
    main_s = main_m.group(0)

    after_main = raw[main_m.end() :]
    scripts_s = extract_scripts(after_main)

    desktop, mobile, journal = CONFIG[name]

    out = (
        head_s
        + header_html(desktop)
        + "\n  "
        + main_s
        + "\n  "
        + footer_html()
        + "\n  "
        + bottom_nav_html(mobile, journal)
        + "\n  "
        + scripts_s
        + "\n</body>\n</html>\n"
    )
    path.write_text(out, encoding="utf-8")


def main() -> None:
    for name in CONFIG:
        process_file(name)
    print("Updated", len(CONFIG), "pages")


if __name__ == "__main__":
    main()
