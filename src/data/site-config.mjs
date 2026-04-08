/** Single source of truth for nav + product metadata (EJS build + client bundle). */

export const SITE = {
  legalName: "Faith Based Innovations, LLC",
  brand: "Faith Based Innovations",
  abbrev: "FBI",
  tagline: "Three premium desktop products—local-first, privacy-first, built around Steward.",
  logoFile: "FBI_Transparent.png",
  logoAlt: "Faith Based Innovations",
  suiteSectionTitle: "Three products, one ecosystem",
  /** Shared intelligence layer (not vague “AI”). */
  steward: {
    name: "Steward",
    short:
      "Steward is a controlled, rules-based, logic-driven intelligence layer—not open-ended generation. It helps each product interpret context, apply policy, and surface deterministic guidance from real data.",
    homeBlurb:
      "CFO, Eden, and Ledger each use Steward differently: financial interpretation, research prioritization, and document field mapping—all without treating intelligence as magic."
  },
  hero: {
    titleLine: "Premium software, built deliberately.",
    titleAccent: "CFO, Eden, and Ledger—each its own product.",
    lead:
      "Faith Based Innovations is a multi-product company. CFO is the flagship financial operating system; Eden and Ledger are standalone titles with their own missions. All three are local-first, privacy-first, and powered by Steward."
  },
  /** Shown wherever purchase is implied; never a signup CTA. */
  availability: {
    badge: "In development",
    line: "Not available for purchase, download, or access. This is being built.",
    ctaLabel: "Currently being built"
  }
};

/** Primary chrome navigation (no pricing, no cart). */
export const NAV_PRIMARY = [
  { id: "home", href: "index.html", label: "Home" },
  { id: "products", href: "products.html", label: "Products" },
  { id: "compare", href: "compare.html", label: "Compare" }
];

export const NAV_PRODUCTS = [
  {
    id: "cfo",
    href: "product-cfo.html",
    label: "CFO",
    line: "Flagship financial operating system—budgeting, planning, forecasting, Steward-guided."
  },
  {
    id: "eden",
    href: "product-eden.html",
    label: "Eden",
    line: "Research ingestion, analysis, prioritization, and source evaluation—powered by Steward."
  },
  {
    id: "ledger",
    href: "product-ledger.html",
    label: "Ledger",
    line: "Encrypted identity vault and deterministic document execution—Steward assists mapping, never invents data."
  }
];

export const PRODUCTS = {
  cfo: {
    id: "cfo",
    name: "CFO",
    path: "product-cfo.html",
    tag: "Flagship · Finance",
    headline: "The financial operating system.",
    subhead:
      "CFO is a local-first financial operating system powered by Steward—not a budgeting toy, not a generic tracker. It interprets, analyzes, and guides financial decisions from structured data and clear rules.",
    purchasable: false
  },
  eden: {
    id: "eden",
    name: "Eden",
    path: "product-eden.html",
    tag: "Research",
    headline: "Research intelligence and prioritization.",
    subhead:
      "Eden is a standalone local-first system for aggregating, analyzing, prioritizing, and evaluating sources—screen recordings, video, articles, images, and your own material—with Steward grounding what matters to you.",
    purchasable: false
  },
  ledger: {
    id: "ledger",
    name: "Ledger",
    path: "product-ledger.html",
    tag: "Identity & documents",
    headline: "Secure vault. Deterministic documents.",
    subhead:
      "Ledger is a local-first encrypted identity vault and deterministic document prefilling system—structured for up to two people (for example, husband and wife). Steward helps parse and map fields—it never guesses or generates answers you did not provide.",
    purchasable: false
  }
};
