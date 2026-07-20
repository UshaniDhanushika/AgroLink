# 01 — Design Foundations

**AgroLink UI/UX · Design System Core**  
**Covers:** Complete design system · Color · Typography · Spacing · Grid · Breakpoints  

---

## 1. Complete Design System Overview

### 1.1 System Layers

```text
┌─────────────────────────────────────────────────────────┐
│  Brand & Narrative   (logo, voice, photography rules)   │
├─────────────────────────────────────────────────────────┤
│  Foundations         (color, type, space, grid, elev.)  │
├─────────────────────────────────────────────────────────┤
│  Components          (button, input, table, nav, …)     │
├─────────────────────────────────────────────────────────┤
│  Patterns            (forms, filters, timelines, empty) │
├─────────────────────────────────────────────────────────┤
│  Templates           (landing, role dashboards, auth)   │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Design Tokens Strategy

All visual values ship as **CSS custom properties** (design tokens), grouped:

| Token group | Prefix | Example |
|-------------|--------|---------|
| Color | `--color-*` | `--color-brand-600` |
| Typography | `--font-*`, `--text-*` | `--text-lg` |
| Space | `--space-*` | `--space-4` |
| Radius | `--radius-*` | `--radius-md` |
| Shadow | `--shadow-*` | `--shadow-sm` |
| Motion | `--duration-*`, `--ease-*` | `--duration-fast` |
| Z-index | `--z-*` | `--z-modal` |

**Decision:** Token-first (not hardcoded hex in components) so light/dark and future white-label themes swap at the root without rewriting UI.

### 1.3 Elevation & Surface Model

AgroLink uses **soft elevation**, not heavy multi-layer shadows.

| Level | Use | Spec |
|-------|-----|------|
| 0 Flat | Page background | No shadow |
| 1 Raised | Interactive panels only when needed | `--shadow-sm` |
| 2 Overlay | Dropdowns, popovers | `--shadow-md` |
| 3 Modal | Dialogs | `--shadow-lg` |

**Decision:** Default lists and dashboards are **border + surface**, not card stacks. Cards exist only when they contain a discrete user interaction (e.g., selectable logistics option).

### 1.4 Motion Principles (Presence, Not Noise)

Ship **2–3 intentional motions** on primary surfaces:

1. **Hero atmosphere:** slow Ken-Burns (scale 1.0 → 1.04 over 20s) on landing photography  
2. **Route enter:** content fade/slide-up 160–220ms on dashboard page change  
3. **Primary CTA:** subtle press scale `0.98` + color shift  

Avoid: continuous bounce, confetti, glow pulses, staggered card cascades.

| Token | Value |
|-------|-------|
| `--duration-fast` | 120ms |
| `--duration-normal` | 200ms |
| `--duration-slow` | 320ms |
| `--ease-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` |

Respect `prefers-reduced-motion: reduce` → disable decorative motion; keep opacity fades ≤ 100ms or none.

### 1.5 Brand Mark

| Element | Spec |
|---------|------|
| Wordmark | “AgroLink” — Fraunces semibold, tracking tight |
| Symbol | Abstract leaf + link node (geometric, not cartoon) |
| Clear space | ≥ 0.5× cap-height around mark |
| Lockups | Symbol + wordmark horizontal (default); symbol-only for collapsed nav |

**Decision:** On branded marketing pages, the wordmark is **hero-level** (large, first read). Product headlines support the brand — they never overpower it.

### 1.6 Voice & Microcopy Tone

- Professional, plain, decisive  
- Prefer “Post demand” over “Unleash your procurement journey”  
- Status language is precise: `OPEN`, `MATCHED`, `IN_TRANSIT` mapped to human labels (“Open”, “Matched”, “In transit”)  

---

## 2. Color Palette

### 2.1 Brand Rationale

Agriculture is associated with green, but enterprise buyers distrust “lime startup” greens. We use a **deep evergreen** as authority, a **mid canopy green** for interactive states, and **harvest gold** only for emphasis (value, money, primary money-path CTAs).

Neutrals lean **cool stone with a faint green cast** so the UI feels cultivated, not hospital-white or coffee-shop cream.

### 2.2 Core Palette (Light Mode)

#### Brand (Primary)

| Token | Hex | Role |
|-------|-----|------|
| `--color-brand-950` | `#071F18` | Text on brand buttons (rare), darkest ink |
| `--color-brand-900` | `#0B2E22` | Sidebar dark variant |
| `--color-brand-800` | `#0F3D2E` | **Primary brand** |
| `--color-brand-700` | `#154F3B` | Hover on primary |
| `--color-brand-600` | `#1B5E45` | Active / links on light |
| `--color-brand-500` | `#2A7A5C` | Focus accents |
| `--color-brand-400` | `#3D9B74` | Charts / illustrations |
| `--color-brand-200` | `#B7DFCC` | Soft chips / selected rows |
| `--color-brand-100` | `#DCEFE6` | Tint backgrounds |
| `--color-brand-50` | `#EFF7F3` | Subtle section wash |

#### Accent (Harvest)

| Token | Hex | Role |
|-------|-----|------|
| `--color-accent-700` | `#8A7018` | Accent text |
| `--color-accent-500` | `#C4A035` | **CTA emphasis / price highlight** |
| `--color-accent-400` | `#D4B84A` | Hover |
| `--color-accent-100` | `#F5EDD1` | Soft accent surface |

**Decision:** Accent is not a second primary. ≥ 90% of chrome uses brand + neutrals; gold appears on “Post demand”, “Create order”, and monetary emphasis.

#### Neutrals

| Token | Hex | Role |
|-------|-----|------|
| `--color-ink-950` | `#0C1210` | Primary text |
| `--color-ink-700` | `#3A4540` | Secondary text |
| `--color-ink-500` | `#6B776F` | Tertiary / placeholders |
| `--color-ink-300` | `#B4BDB7` | Disabled text |
| `--color-line-200` | `#D7DED9` | Borders / dividers |
| `--color-line-100` | `#E7ECE8` | Subtle rules |
| `--color-surface-0` | `#F3F6F4` | App background (mist) |
| `--color-surface-1` | `#FFFFFF` | Panels / sheets |
| `--color-surface-2` | `#EAF0EC` | Nested wells / zebra |

#### Semantic

| Token | Hex | Use |
|-------|-----|-----|
| `--color-success-600` | `#1F6B45` | Success, delivered |
| `--color-success-100` | `#D8F0E4` | Success bg |
| `--color-warning-600` | `#9A6700` | Warning, pending |
| `--color-warning-100` | `#F5E6C8` | Warning bg |
| `--color-danger-600` | `#B42318` | Errors, cancel |
| `--color-danger-100` | `#F9E2E0` | Error bg |
| `--color-info-600` | `#175B6B` | Informational (teal-ink, not blue-purple) |
| `--color-info-100` | `#D7EEF2` | Info bg |

### 2.3 Status → Color Mapping

| Domain status | Label color | Surface |
|---------------|-------------|---------|
| OPEN / AVAILABLE | brand-700 | brand-100 |
| MATCHED / CONFIRMED | info-600 | info-100 |
| IN_TRANSIT | warning-600 | warning-100 |
| DELIVERED | success-600 | success-100 |
| CANCELLED | ink-500 | surface-2 |
| DISPUTED / SUSPENDED | danger-600 | danger-100 |

### 2.4 Contrast Rules

- Body text on `--color-surface-1`: ink-950 → **≥ 12:1**  
- Secondary text: ink-700 on white → **≥ 4.5:1**  
- Primary button: white text on brand-800 → verify ≥ 4.5:1  
- Accent button text: ink-950 on accent-500 (not white) for contrast  

### 2.5 CSS Variable Skeleton (Reference)

```css
:root {
  --color-brand-800: #0F3D2E;
  --color-accent-500: #C4A035;
  --color-surface-0: #F3F6F4;
  --color-surface-1: #FFFFFF;
  --color-ink-950: #0C1210;
  --color-line-200: #D7DED9;
  /* …full scale as above */
}
```

---

## 3. Typography

### 3.1 Font Stack

| Role | Family | Fallback | Why |
|------|--------|----------|-----|
| Display / Brand | **Fraunces** | Georgia, serif | Soft optical sizing; agricultural warmth without rustic slab cliché |
| UI / Body | **Plus Jakarta Sans** | Segoe UI, sans-serif | Contemporary SaaS clarity; distinctive vs Inter/Roboto |
| Data / Mono | **JetBrains Mono** | Consolas, monospace | Order IDs, SKUs, dense numeric columns |

**Decision:** Serif is reserved for brand moments and marketing headlines. App chrome (nav, forms, tables) stays sans for scanning speed.

### 3.2 Type Scale

| Token | Size | Line height | Weight | Use |
|-------|------|-------------|--------|-----|
| `--text-display` | 48px / 3rem | 1.15 | 600 Fraunces | Landing brand / hero |
| `--text-h1` | 32px / 2rem | 1.2 | 600 Fraunces | Page titles (marketing) |
| `--text-h2` | 24px / 1.5rem | 1.25 | 600 Jakarta | Section titles |
| `--text-h3` | 20px / 1.25rem | 1.3 | 600 Jakarta | Card/section headers |
| `--text-h4` | 16px / 1rem | 1.35 | 600 Jakarta | Subheads |
| `--text-body` | 15px / 0.9375rem | 1.55 | 400 Jakarta | Default body |
| `--text-body-sm` | 13px / 0.8125rem | 1.5 | 400 Jakarta | Secondary, tables |
| `--text-caption` | 12px / 0.75rem | 1.4 | 500 Jakarta | Labels, meta |
| `--text-overline` | 11px / 0.6875rem | 1.3 | 600 Jakarta | Uppercase section labels (tracking +0.06em) |

**App default:** Prefer `--text-h2`/`h3` in Jakarta for dashboards; Fraunces H1 only on landing/auth brand panels.

### 3.3 Numeric Typography

- Prices and quantities: tabular figures (`font-variant-numeric: tabular-nums`)  
- Currency prefix muted (`ink-500`); amount `ink-950` semibold  
- Seller decision view: buyer price and logistics cost same type size for fair comparison  

### 3.4 Hierarchy Rules

1. One H1 per page  
2. Do not skip levels for styling  
3. Marketing: brand name ≥ headline visual weight  
4. Dashboards: page title + one supporting sentence max under title  

---

## 4. Spacing System

### 4.1 Base Unit

**4px base** → scale is multiples of 4 for rhythm and density control.

| Token | px | Common use |
|-------|-----|------------|
| `--space-0` | 0 | — |
| `--space-1` | 4 | Icon gaps, tight chips |
| `--space-2` | 8 | Inline compact |
| `--space-3` | 12 | Input padding-y companion |
| `--space-4` | 16 | Default component padding |
| `--space-5` | 20 | — |
| `--space-6` | 24 | Card/section padding |
| `--space-8` | 32 | Section gaps |
| `--space-10` | 40 | — |
| `--space-12` | 48 | Layout block gaps |
| `--space-16` | 64 | Page section breathing |
| `--space-20` | 80 | Marketing section gaps |
| `--space-24` | 96 | Hero vertical padding |

### 4.2 Density Modes

| Mode | Where | Rule |
|------|-------|------|
| Comfortable | Dashboards default | `--space-4`–`6` component padding |
| Compact | Admin tables, dense logistics | `--space-2`–`3`; body-sm type |
| Airy | Landing sections | `--space-16`–`24` between blocks |

**Decision:** Marketplace comparison screens stay comfortable — farmers and dispatchers decide under time pressure; cramped UI increases error rates.

### 4.3 Stacking Convention

Vertical stacks use `gap` tokens, not random margins. Sibling sections: `--space-8` or `--space-12`. Form field stacks: `--space-4`.

---

## 5. Grid System

### 5.1 Page Grid

| Property | Spec |
|----------|------|
| Columns (desktop) | 12 |
| Gutter | 24px (`--space-6`) |
| Margin (desktop) | 32–48px |
| Max content width | 1280px (app shell) |
| Max marketing width | 1200px text; **full-bleed** media |

### 5.2 App Shell Columns

```text
┌────────┬────────────────────────────────────────────┐
│ 240px  │              Fluid main (minmax)           │
│ Nav    │   12-col inner grid, max 1280 centered     │
│        │                                            │
└────────┴────────────────────────────────────────────┘
```

Collapsed nav: **72px** icon rail.

### 5.3 Common Layout Spans

| Pattern | Span |
|---------|------|
| Full-width list | 12 |
| Main + side detail | 8 + 4 |
| Seller decision (offer vs logistics) | 6 + 6 |
| KPI (when used — never in landing hero) | 3+3+3+3 or 4+4+4 |
| Auth split | 6 brand / 6 form (desktop) |

### 5.4 Alignment

- Text blocks left-align in LTR  
- Numeric columns right-align in tables  
- Forms: labels above fields (not left-aligned label columns) for mobile parity  

---

## 6. Responsive Breakpoints

### 6.1 Breakpoint Tokens

| Name | Min width | Target |
|------|-----------|--------|
| `xs` | 0 | Small phones |
| `sm` | 480px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops / app shell with sidebar |
| `xl` | 1280px | Desktops |
| `2xl` | 1440px | Wide monitors |

```css
/* Mobile first */
/* default: xs */
@media (min-width: 480px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1440px) { /* 2xl */ }
```

### 6.2 Behavior by Breakpoint

| Concern | `< lg` | `≥ lg` |
|---------|--------|--------|
| Navigation | Bottom tab or top bar + drawer | Fixed left sidebar |
| Tables | Cardized rows or horizontal scroll with sticky first col | Full table |
| Filters | Bottom sheet | Inline filter bar / side panel |
| Seller 6+6 split | Stacked (offer then logistics) | Side-by-side |
| Landing hero | Full-bleed image, brand, one line, CTA | Same; larger type |

### 6.3 Touch Targets

Minimum **44×44px** interactive targets on `sm` and below; desktop minimum **36px** height for inputs/buttons.

---

## Foundation Checklist for Implementation

- [ ] Tokens in `:root` and `[data-theme="dark"]`  
- [ ] Fonts loaded with `font-display: swap`  
- [ ] No raw hex outside token files  
- [ ] Grid/container utilities match max-width rules  
- [ ] Motion respects reduced-motion  

**Next:** [02 — Components](./02-components.md)
