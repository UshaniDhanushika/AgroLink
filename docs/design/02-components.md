# 02 — Components

**AgroLink UI/UX · Component Specifications**  
**Covers:** Buttons · Cards · Forms · Tables · Navigation · Icons  

---

## 7. Buttons

### 7.1 Hierarchy

| Variant | When to use | Visual |
|---------|-------------|--------|
| **Primary** | One main action per view (Post demand, Create order) | Fill `brand-800`, text white |
| **Accent** | Money-path emphasis when primary already used nearby | Fill `accent-500`, text `ink-950` |
| **Secondary** | Alternative actions | Outline `line-200`, text `ink-950`, bg transparent |
| **Tertiary / Ghost** | Low emphasis (Cancel, View all) | Text `brand-700`, no border |
| **Danger** | Destructive (Cancel order, Suspend) | Fill `danger-600` or outline danger |
| **Link** | Inline textual actions | Underline on hover |

**Decision:** Only **one primary** (or accent) button in the primary action zone. Secondary actions demote to ghost to protect hierarchy.

### 7.2 Sizes

| Size | Height | Pad X | Type |
|------|--------|-------|------|
| `sm` | 32px | 12px | body-sm |
| `md` (default) | 40px | 16px | body |
| `lg` | 48px | 20px | body semibold |

Radius: `--radius-md` (8px) — **not** pill (`full`). Pills reserved for status chips only.

### 7.3 States

| State | Behavior |
|-------|----------|
| Default | As variant |
| Hover | Darken one step / strengthen border |
| Active/Pressed | Scale 0.98 + darker fill |
| Focus-visible | 2px brand focus ring, offset 2px |
| Disabled | 40% opacity, `cursor: not-allowed`, no hover |
| Loading | Spinner replaces icon; label stays (“Saving…”) |

### 7.4 Icon Buttons

Square 40×40 (md), aria-label required. Used for overflow menus, filter, notifications.

### 7.5 Button Groups

Segmented control for view toggles (List / Map) using secondary styling; selected segment uses `brand-100` fill + `brand-800` text.

---

## 8. Cards

### 8.1 Philosophy

**Default: no cards.** Prefer open sections on `surface-0` with hairline dividers.

Cards are allowed when they wrap a **single interactive choice** or a **portable entity** the user must compare:

| Allowed card | Example |
|--------------|---------|
| Selectable offer card | Logistics service option |
| Entity summary in mobile list | Order row as tap target |
| Auth panel | Login form container on split layout |

**Forbidden:** Card grids in landing hero; KPI card walls as the first viewport; nesting cards inside cards.

### 8.2 Spec (When Used)

| Property | Value |
|----------|-------|
| Background | `surface-1` |
| Border | 1px `line-200` |
| Radius | `--radius-lg` (12px) |
| Padding | `--space-6` |
| Shadow | None by default; `--shadow-sm` on hover if selectable |
| Selected | Border `brand-600`, wash `brand-50` |

### 8.3 Selectable Pattern (Seller Logistics Pick)

```text
┌─────────────────────────────────────────┐
│  Reefer 14T · ₹12 / km            [○]   │
│  Pune → Nagpur · Cap 14 tons            │
└─────────────────────────────────────────┘
```

Keyboard: focusable, `aria-checked` for radio semantics.

---

## 9. Forms

### 9.1 Anatomy

```text
Label (caption / semibold)
Helper text (optional, ink-500)
[ Input field                              ]
Error text (danger-600) — only when invalid
```

**Decision:** Labels **above** fields for scanability and mobile parity. Placeholder is example only, never a substitute for label.

### 9.2 Field Specs

| Property | Value |
|----------|-------|
| Height | 40px (md) |
| Padding | 10px 12px |
| Radius | `--radius-md` |
| Border | 1px `line-200` |
| Background | `surface-1` |
| Focus | Border `brand-600` + ring |
| Error | Border `danger-600` + error text |
| Disabled | `surface-2`, muted text |

### 9.3 Field Types

| Type | Notes |
|------|-------|
| Text / Email / Tel / Number | Native types; numeric with tabular nums |
| Select | Custom listbox matching field height |
| Textarea | Min 3 rows; auto-grow optional |
| Date / Date range | Delivery window; calendar popover |
| Money | Prefix currency, right-aligned input text |
| Quantity + Unit | Split control: number + unit select |
| Location | Address fields + optional map pin (phase) |
| Checkbox / Radio | 18px control; 44px hit area on mobile |
| Switch | For binary settings (notifications) |
| File | Drag-drop for POD (future); dashed well |

### 9.4 Form Layout Patterns

| Pattern | Use |
|---------|-----|
| Single column | Auth, most create forms |
| Two-column (lg+) | Address blocks, paired price/qty |
| Wizard | Create order (Request → Logistics → Confirm) with stepper |

### 9.5 Validation UX

1. Validate on blur and on submit  
2. First error receives focus  
3. Summary alert at top for submit failures (“Fix 3 fields”)  
4. Server `fieldErrors` map to the same messages  
5. Success: toast + optional redirect  

### 9.6 Key Forms by Role

| Form | Role | Critical fields |
|------|------|-----------------|
| Register | Guest | Name, email, phone, role, password |
| Create buyer request | Buyer | Product, qty, unit, price/unit, locations, needed-by |
| Create logistics service | Logistics | Vehicle, capacity, rate model, corridor, availability |
| Create order | Seller | Confirm matched request + selected service + notes |

---

## 10. Tables

### 10.1 When to Use Tables vs Lists

| Use table | Use list/cards |
|-----------|----------------|
| Desktop order lists, admin users | Mobile; highly variable-height content |
| Comparable numeric columns | Single-entity storytelling |

### 10.2 Anatomy

```text
Toolbar: title · filters · primary action
┌──────┬──────────┬────────┬─────────┬─────┐
│ ID   │ Product  │ Qty    │ Status  │ …   │
├──────┼──────────┼────────┼─────────┼─────┤
│ rows …                                       │
└──────┴──────────┴────────┴─────────┴─────┘
Footer: pagination · density toggle (admin)
```

### 10.3 Specs

| Property | Value |
|----------|-------|
| Header | `text-caption`, semibold, `ink-700`, bg `surface-2` |
| Row height | 48px comfortable / 40px compact |
| Cell pad | 12px 16px |
| Divider | `line-100` horizontal only |
| Hover row | `brand-50` |
| Selected row | `brand-100` |
| Sticky | Header sticky; first column sticky on overflow |

### 10.4 Column Patterns

- **Status:** pill chip (radius full, small)  
- **Money:** right-aligned, mono/tabular  
- **Actions:** overflow `⋯` menu to reduce column count  
- **Empty cell:** em dash `—` in `ink-300`  

### 10.5 Pagination

Prev / Next + page size (20 default). Show “1–20 of 125”. Jump-to-page optional for admin.

### 10.6 Mobile Table Strategy

Transform to **stacked definition list** per row:

```text
Order #AL-2041          [IN TRANSIT]
Wheat · 50 Qtl
Buyer: …  ·  ₹2,450/qtl
```

---

## 11. Navigation

### 11.1 App Shell (Desktop ≥ lg)

```text
┌──────────────────────────────────────────────────────┐
│ AgroLink        [Search]     🔔   Avatar ▾           │  Top bar 56px
├──────────┬───────────────────────────────────────────┤
│ Overview │  Page title                               │
│ …role    │  Supporting line                          │
│ nav…     │  ───────────────────────────────────────  │
│          │  Content                                  │
│ Settings │                                           │
└──────────┴───────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Top bar | `surface-1`, bottom border `line-200`, height 56px |
| Sidebar | Width 240px; bg `surface-1` or soft `brand-50` wash |
| Nav item | 40px height; icon + label; active = `brand-100` + left 3px brand bar |
| Collapse | Icon-only 72px; tooltips on hover |

### 11.2 Role Nav Maps

**Buyer**

- Dashboard  
- My requests  
- Orders  
- Notifications  
- Profile  

**Seller**

- Dashboard  
- Marketplace (Open requests)  
- Logistics finder  
- Orders  
- Notifications  
- Profile  

**Logistics**

- Dashboard  
- My services  
- Jobs (orders)  
- Notifications  
- Profile  

**Admin**

- Overview  
- Users  
- Products  
- Orders  
- Audit log  
- Settings  

**Decision:** “Marketplace” is seller-only language. Buyers see “My requests” — same objects, role-accurate naming reduces cognitive load.

### 11.3 Mobile Navigation

- **Top:** brand mark + notifications + avatar  
- **Bottom tab bar** (max 4–5): primary destinations only  
- Overflow → “More” sheet  

Buyer tabs: Home · Requests · Orders · More  
Seller tabs: Home · Market · Orders · More  
Logistics tabs: Home · Services · Jobs · More  

### 11.4 Auth Screens Nav

Minimal: logo + “Need help?” link. No app sidebar.

### 11.5 Breadcrumbs

Used in admin and deep order detail: `Orders / AL-2041`. Not on top-level dashboards.

---

## 12. Icons

### 12.1 Icon System

| Property | Spec |
|----------|------|
| Library | **Lucide** (primary) — consistent 24px grid stroke icons |
| Stroke | 1.75–2px |
| Sizes | 16 / 20 / 24 |
| Color | Inherit `currentColor` |

**Decision:** Lucide over custom farm emoji/icons for enterprise coherence. Custom marks only for brand symbol and empty-state illustrations.

### 12.2 Semantic Icon Map (Core)

| Concept | Icon |
|---------|------|
| Dashboard | `layout-dashboard` |
| Requests / Demand | `clipboard-list` |
| Marketplace | `store` |
| Orders | `package` |
| Logistics / Truck | `truck` |
| Products | `wheat` (or `leaf`) |
| Users | `users` |
| Notifications | `bell` |
| Settings | `settings` |
| Search | `search` |
| Filter | `list-filter` |
| Success | `check-circle-2` |
| Warning | `alert-triangle` |
| Error | `alert-circle` |
| Empty crop | Custom soft illustration (line art field) |

### 12.3 Icon + Label Rule

Navigation and primary actions: **icon + text** on desktop. Icon-only only when space-constrained and labeled via `aria-label` / tooltip.

### 12.4 Decorative vs Meaningful

Decorative icons: `aria-hidden="true"`. Status icons that convey meaning alone must have text or `aria-label`.

---

## Component Do / Don’t

| Do | Don’t |
|----|-------|
| One primary CTA per region | Compete primary + accent side by side without hierarchy |
| Use cards for selectable choices | Wrap every dashboard widget in a shadowed card |
| Label every input | Placeholder-only forms |
| Sticky table header | Tables without status affordances |
| Role-specific nav labels | Show all roles’ links and hide with CSS only |

**Previous:** [01 — Foundations](./01-foundations.md)  
**Next:** [03 — Feedback & System Screens](./03-feedback-and-system-screens.md)
