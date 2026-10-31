# Modern Redesign Plan

The content and engine are solid (36 systems, 36 components, 27 concepts, a working diagram engine,
light/dark themes). The interface, though, still looks like an internal tool: everything is the same
slate card, the sidebar is a long list, and the diagram — the product's best feature — is a small
canvas halfway down a long page. This plan makes it feel like a polished learning product.

---

## 1. What feels dated today

| Area | Problem |
|---|---|
| First impression | Home opens on a filter bar and an identical grid of 36 cards; nothing shows what the product *does*. |
| Visual hierarchy | Every surface is a bordered slate box; headings, cards, tables and panels all carry the same weight. |
| System page | Nine stacked sections make a very long scroll; the diagram is section 5, below tables most visitors skip. |
| Diagram | Small 10–13 px node text at 0.45–0.6 zoom; tier bands are faint; the legend covers part of the canvas. |
| Navigation | A 36-item sidebar plus a sticky section bar plus a toolbar — three navigation layers at once. |
| Identity | Generic icons, no logo, no illustration, no accent colour that's "ours". |
| Feedback | Few transitions; switching provider or system has no sense of motion or change. |

## 2. Design direction

**"Calm canvas, sharp details."** A light-first, airy layout where the architecture diagram is the hero
and text supports it.

- **Typography:** a variable display face for headings (e.g. *Inter Display*, *Geist* at heavier
  weights, or *Satoshi*), a wider type scale (14 → 16 px body, 40–56 px page titles), mono only for
  APIs and keys.
- **Colour:** neutral zinc/stone base + one signature accent (electric indigo or teal) + the existing
  category colours, reduced to soft 8–12% tints. Provider colours used only in the provider switcher
  and service pills.
- **Surfaces:** fewer borders; separate with spacing, subtle elevation (soft shadows in light mode,
  1-px inner highlights in dark), 12–16 px radii, occasional glass blur for floating panels.
- **Density:** generous whitespace on overview pages; dense, information-rich panels only where the
  user is studying (diagram details, data model).
- **Motion:** 150–250 ms ease-out transitions; diagram nodes morph labels when the provider changes;
  walkthrough edges draw themselves; respect reduced-motion.

## 3. Information architecture

- **Top navigation bar** instead of a permanent sidebar: *Systems · Components · Concepts · Search
  (⌘K) · theme*. The system list moves into a mega-menu / command palette.
- **System page as a "workspace":** split view on desktop —
  - left (60%): sticky, full-height diagram with provider switcher and walkthrough player docked on it;
  - right (40%): scrollable tabs — *Overview · Requirements · APIs · Estimates · Data model ·
    Bottlenecks · Scaling* — synced with the diagram (hovering a data-model row highlights its store).
  - Mobile keeps the stacked layout with the tier list.
- **Home becomes a landing page:** hero with an animated mini-diagram that cycles providers, "Pick a
  system" carousel by category, "Learn a concept" row, then the full filterable catalogue.
- **Learning paths:** curated sequences ("Start here: URL shortener → Rate limiter → Twitter →
  Uber") with progress saved in the browser.

## 4. Component upgrades

| Component | Upgrade |
|---|---|
| Diagram nodes | Larger (240×96), provider logo badge in the corner, service name prominent, role on hover; category shown as a coloured left edge instead of an icon tile. |
| Tier bands | Solid soft-tinted lanes with labels pinned to the left edge, like swimlanes. |
| Edges | Thinner default, bolder on hover/selection; animated "packet" dots for the active walkthrough step. |
| Legend | Collapsible chip row under the toolbar instead of a floating box. |
| Detail panel | Slide-over sheet with tabs (*Role · Options · When to use · Concepts*) and a provider comparison table. |
| Estimates | Interactive calculator: change DAU or ratios and watch QPS/storage update. |
| Data model | Card per entity with key highlighted and a "where it lives" link that focuses the node. |
| Cards | Thumbnail of each system's diagram (generated from the layout) instead of text-only cards. |
| Search | Grouped results with icons, recent searches, and keyboard hints. |

## 5. Brand & assets

- Simple wordmark + node-graph logo; favicon and OG images restyled to match.
- Official AWS / Google Cloud / Azure architecture icon sets (check each licence) for provider mode;
  keep the generic icon set for "Generic".
- Spot illustrations for empty states and the 404.

## 6. Technical approach

- **Design tokens:** replace the slate-inversion trick with semantic tokens (`--surface`, `--surface-raised`,
  `--text`, `--text-muted`, `--border`, `--accent`) defined per theme, exposed to Tailwind via `@theme`.
- **Primitives:** shadcn/ui (Radix) for Dialog, Sheet, Tabs, Tooltip, DropdownMenu, Command — accessible
  focus handling for free.
- **Motion:** Framer Motion (or the View Transitions API) for page and panel transitions.
- **Diagram:** keep React Flow + ELK; custom edge component for animated packets; render node
  thumbnails to SVG at build time for cards and OG images.
- **Quality gates:** Playwright visual snapshots for both themes, axe accessibility checks in CI,
  Lighthouse budget (LCP < 2 s, CLS < 0.05).

## 7. Phased rollout

| Phase | Scope | Effort |
|---|---|---|
| 1. Foundations | Semantic tokens, type scale, top nav, shadcn primitives, restyled buttons/cards | ~3–4 days |
| 2. System workspace | Split-view layout, tabbed content, docked diagram toolbar, slide-over details | ~4–5 days |
| 3. Diagram polish | Bigger nodes, swimlanes, provider logos, animated walkthrough packets, collapsible legend | ~3–4 days |
| 4. Landing & discovery | Hero with live mini-diagram, category carousels, diagram thumbnails, learning paths | ~3–4 days |
| 5. Delight & QA | Motion, estimate calculator, empty states, visual-regression and a11y tests | ~2–3 days |

Each phase ships independently behind the same URLs, so the live site keeps working throughout.

## 8. How we'll know it worked

- Visitors reach a diagram within one click from home.
- Average time on system pages and walkthrough plays go up.
- Mobile bounce rate drops.
- Lighthouse accessibility stays at 100 in both themes.
