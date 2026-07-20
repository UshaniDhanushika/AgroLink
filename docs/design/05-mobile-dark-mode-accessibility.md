# 05 — Mobile, Dark Mode & Accessibility

**AgroLink UI/UX**  
**Covers:** Mobile design · Dark mode · Accessibility guidelines  

---

## 23. Mobile Design

### 23.1 Mobile Principles

1. **One primary action** reachable with thumb (header CTA or sticky footer)  
2. **Progressive disclosure** — filters in sheets, not persistent sidebars  
3. **Stacks over grids** — seller 6+6 becomes vertical: offer summary → logistics list  
4. **Tables demote** to stacked rows  
5. **Bottom navigation** for role roots (see Components · Navigation)  

### 23.2 Mobile Shell

```text
┌─────────────────────────┐
│ Logo            🔔  ☺   │  56px top
├─────────────────────────┤
│ Title                   │
│ Supporting line         │
│ [Primary CTA]           │
├─────────────────────────┤
│                         │
│  Content (scroll)       │
│                         │
├─────────────────────────┤
│  Home  Market  Orders … │  56px tab bar + safe area
└─────────────────────────┘
```

### 23.3 Patterns by Flow

| Flow | Mobile adaptation |
|------|-------------------|
| Create request | Full-screen form; sticky “Publish” |
| Marketplace browse | List + filter chip row; filter opens sheet |
| Accept + logistics | Step 1 accept confirm → Step 2 logistics list → Step 3 review |
| Order detail | Timeline full width; actions in bottom sticky bar |
| Admin | Horizontal scroll tables with sticky first column; prefer filters |

### 23.4 Touch & Gesture

- Minimum target 44×44px  
- Swipe limited to known patterns (e.g., notification dismiss) — no hidden swipe-only actions  
- Pull-to-refresh on primary lists  

### 23.5 Landing Mobile

Full-bleed hero retained; brand + sentence + CTAs stacked; reduce display size to ~36–40px; CTAs full-width stacked (Primary then Secondary).

### 23.6 Performance UX on Mobile

- Compress hero images (responsive `srcset`)  
- Prefer system font stack fallback if webfonts delayed — never invisible text  
- Skeleton lists for marketplace  

**Decision:** Mobile is a first-class ops surface for sellers and logistics in the field — not a shrunk desktop. Sticky status actions matter more than decorative charts.

---

## 24. Dark Mode

### 24.1 Intent

Dark mode supports night dispatch and low-light warehouse/office use. It is **optional**, not the brand default. Marketing landing may stay light-first with a toggle; app respects `data-theme` + system preference.

### 24.2 Dark Token Mapping

| Light | Dark |
|-------|------|
| `surface-0` `#F3F6F4` | `#0C1411` |
| `surface-1` `#FFFFFF` | `#14201B` |
| `surface-2` `#EAF0EC` | `#1B2A24` |
| `ink-950` | `#E8EFEA` |
| `ink-700` | `#B5C2BB` |
| `ink-500` | `#84948C` |
| `line-200` | `#2A3B34` |
| `brand-800` (buttons) | `#3D9B74` fill with `ink-950` text **or** keep deep fill `#1B5E45` + white text (verify contrast) |
| `brand-100` washes | `#1A3329` |
| `accent-500` | `#D4B84A` (slightly lifted) |
| Success / Warning / Danger | Lifted mid-tones on dark surfaces; retain meaning |

### 24.3 Dark Mode Rules

1. **Do not** pure `#000` backgrounds — use green-black mist `#0C1411`  
2. **Do not** use heavy glow/neon shadows  
3. Borders replace shadows for separation  
4. Hero photography: darker scrim; avoid over-bright gold text  
5. Charts (future): desaturate gridlines; keep brand series readable  
6. Status chips: increase border contrast; keep text ≥ 4.5:1  

### 24.4 Implementation Hook

```html
<html data-theme="light"> <!-- or dark -->
```

```css
:root { /* light tokens */ }
[data-theme="dark"] { /* dark tokens */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* optional system sync */ }
}
```

### 24.5 Toggle Placement

Profile menu: “Appearance → Light / Dark / System”. Persist in user prefs (local → profile API later).

---

## 25. Accessibility Guidelines

### 25.1 Target Standard

**WCAG 2.1 Level AA** for core flows: auth, create request, accept/match, select logistics, create order, status update.

### 25.2 Perceivable

| Rule | Application |
|------|-------------|
| 1.1.1 Text alternatives | Icons with meaning have labels; illustrations decorative = empty alt |
| 1.3.1 Info and relationships | Labels tied via `htmlFor`; tables have `<th>` |
| 1.4.3 Contrast | Body/UI text ≥ 4.5:1; large text ≥ 3:1 |
| 1.4.11 Non-text contrast | Input borders / focus ≥ 3:1 |
| 1.4.13 Content on hover/focus | Tooltips dismissable / hoverable |

### 25.3 Operable

| Rule | Application |
|------|-------------|
| 2.1.1 Keyboard | All actions reachable; no mouse-only selects |
| 2.1.2 No keyboard trap | Modals trap intentionally with Escape + return focus |
| 2.4.3 Focus order | DOM order matches visual; wizard steps logical |
| 2.4.7 Focus visible | Always show `:focus-visible` ring (brand) |
| 2.5.5 Target size | ≥ 44×44 CSS px on touch breakpoints |

### 25.4 Understandable

| Rule | Application |
|------|-------------|
| 3.2.2 On input | Changing a select doesn’t auto-submit without warning |
| 3.3.1 Error identification | Text + programmatic association |
| 3.3.2 Labels | Visible labels always |
| 3.3.3 Error suggestion | Conflict messages tell next action |

### 25.5 Robust

- Semantic HTML: `nav`, `main`, `header`, `table`, `button`  
- ARIA only when native semantics insufficient (`role="dialog"`, `aria-selected` on custom listboxes)  
- Live regions: `aria-live="polite"` for toasts; `assertive` for critical conflict dialogs  

### 25.6 Role & Status Accessibility

- Status chips include text, not color alone  
- Order timeline uses text timestamps + status names  
- Charts (future) require table alternative  

### 25.7 Motion & Sensory

- Honor `prefers-reduced-motion`  
- No information by color only (pair with icon/text)  
- Flash: none  

### 25.8 Auth & Security UX A11y

- Password fields with show/hide button labeled  
- Error summaries announced on submit  
- Session timeout warning focusable dialog  

### 25.9 Testing Checklist

- [ ] Keyboard-only walkthrough per role happy path  
- [ ] Screen reader: NVDA/VoiceOver on create request + create order  
- [ ] axe DevTools / Lighthouse a11y on landing + dashboards  
- [ ] Zoom 200% — no loss of essential content  
- [ ] Dark mode contrast re-check on chips and buttons  
- [ ] Reduced motion: no essential info lost  

### 25.10 Inclusive Content

- Avoid idioms that don’t translate  
- Use plain status verbs  
- Don’t rely on red/green alone for color-blind users — include labels  

---

## Design Decision Summary (All Docs)

| Topic | Decision |
|-------|----------|
| Theme | Verdant Precision — deep evergreen + sparse harvest gold |
| Type | Fraunces (brand) + Plus Jakarta Sans (UI) + JetBrains Mono (data) |
| Layout | Tokenized 4px space; 12-col; max 1280 app |
| Components | One primary CTA; cards only for interaction; Lucide icons |
| Landing | Full-bleed hero; brand-first; no overlay badges |
| Seller UX | Split decision view price vs logistics |
| Mobile | Bottom tabs; stacked flows; sticky actions |
| Dark | Optional green-black surfaces; no neon |
| A11y | WCAG 2.1 AA on core trade flows |

---

**Previous:** [04 — Page Layouts](./04-page-layouts.md)  
**Index:** [Design System README](./README.md)
