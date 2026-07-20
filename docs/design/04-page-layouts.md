# 04 — Page Layouts

**AgroLink UI/UX · Templates**  
**Covers:** Landing · Buyer · Seller · Logistics · Admin dashboards  

---

## 16. Landing Page Layout

### 16.1 Goals

- Establish **AgroLink** as the hero-level brand signal  
- Explain the reverse marketplace in one short line  
- Drive register/login  
- Feel premium and agricultural without rustic kitsch  

### 16.2 First Viewport (Hero) — Hard Rules Applied

**Contains only:**

1. Brand (wordmark large)  
2. One headline  
3. One supporting sentence  
4. CTA group (Register · Sign in)  
5. One dominant **full-bleed** field/harvest image (edge-to-edge)  

**Must not contain:** stats strips, schedules, address blocks, feature card grids, floating badges, promo chips on the image.

```text
┌──────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓ FULL-BLEED PHOTO (field / produce / dawn) ▓▓▓▓▓▓ │
│ ▓  scrim gradient bottom→top for text legibility      ▓ │
│ ▓                                                      ▓ │
│ ▓   AgroLink                                           ▓ │
│ ▓   Trade harvests with clear prices and logistics.    ▓ │
│ ▓   Buyers post demand. Sellers choose. Trucks move.   ▓ │
│ ▓   [Create account]  [Sign in]                        ▓ │
│ ▓                                                      ▓ │
└──────────────────────────────────────────────────────────┘
```

**Decision — Full-bleed hero:** The farm image *is* the product context. Inset cards or side-panel heroes would make AgroLink look like a generic template.

**Decision — Scrim, not stickers:** A soft dark/brand scrim behind text replaces badges and chips for contrast.

### 16.3 Below-the-Fold Sections (One Job Each)

| Section | Job | Content |
|---------|-----|---------|
| How it works | Explain reverse flow | 3 horizontal steps (not cards-as-hero): Post → Match → Move |
| Roles | Help visitors self-identify | Three columns: Buyer / Seller / Logistics — text + single icon, no card chrome required |
| Trust | Enterprise credibility | Short line on secure JWT platform + auditability (no fake “10,000 farms” unless real) |
| Final CTA | Convert | Brand + “Create account” on mist surface |
| Footer | Legal / contact | Compact |

### 16.4 Landing Motion

1. Hero image slow scale  
2. CTA hover/press  
3. Step section mild fade-in on scroll (once)  

### 16.5 Landing Typography

- Brand: `--text-display` Fraunces  
- Headline: may be omitted if brand + supporting sentence suffice; if used, must not exceed brand weight  
- Supporting: `--text-body` or slightly larger, high contrast on scrim  

---

## 17. Shared Dashboard Chrome

All authenticated dashboards share:

| Region | Content |
|--------|---------|
| Top bar | Logo, global search (phase), notifications, profile |
| Sidebar / tabs | Role nav |
| Main header | Page title + one supporting sentence + primary CTA |
| Content | Role-specific |

**Anti-pattern:** Do not open with a wall of four KPI cards + three charts. Lead with **work to do**.

---

## 18. Buyer Dashboard

### 18.1 Job-to-be-Done

See demand status at a glance and **post or manage requests** quickly.

### 18.2 Layout (Desktop)

```text
Page: Dashboard
Supporting: Track open demand and matched fulfillment.
CTA: [Post demand]

┌─────────────────────────────┬──────────────────────┐
│  Work queue (8)             │  Attention (4)       │
│  Open requests list         │  Needs confirmation  │
│  status · product · price   │  Recent matches      │
│                             │  Deliveries due      │
└─────────────────────────────┴──────────────────────┘
Below: Recent orders timeline (compact table)
```

### 18.3 Design Decisions

| Decision | Why |
|----------|-----|
| CTA “Post demand” is accent/primary in header | Matches buyer’s core verb |
| Open requests as the main pane | Buyers live in demand management, not analytics |
| Side “Attention” rail | Surfaces time-sensitive confirms without KPI vanity |
| No map on home (MVP) | Reduces clutter; location lives on request detail |

### 18.4 Key Screens

1. **My requests** — filterable table  
2. **Create / edit request** — single-column form  
3. **Request detail** — status + linked order  
4. **Orders** — party-scoped table + detail timeline  

### 18.5 Buyer Visual Accent

Subtle `brand-50` wash on sidebar active states; monetary fields emphasize `accent` on price/unit.

---

## 19. Seller Dashboard

### 19.1 Job-to-be-Done

**Decide:** which buyer offer + which logistics option maximizes net realization.

### 19.2 Layout (Desktop)

```text
Page: Dashboard
Supporting: Compare buyer prices with transport cost, then commit.
CTA: [Browse marketplace]

┌──────────────────────────────────────────────────────────┐
│  Opportunities                                             │
│  Top open requests (product, region, ₹/unit, needed-by)  │
└──────────────────────────────────────────────────────────┘
┌─────────────────────────────┬────────────────────────────┐
│  Active matches             │  Orders in motion          │
│  awaiting logistics pick    │  status chips              │
└─────────────────────────────┴────────────────────────────┘
```

### 19.3 Decision Screen (Critical UX)

When accepting flow reaches logistics selection:

```text
┌──────────────────────────┬───────────────────────────┐
│  Buyer offer             │  Logistics options        │
│  Product · Qty           │  Sort: cost · capacity    │
│  ₹ price/unit            │  Selectable service cards │
│  Location · window       │                           │
│                          │                           │
│  Estimated net hint      │  Selected rate            │
└──────────────────────────┴───────────────────────────┘
Footer: [Cancel]              [Create order]
```

**Decision — 6+6 split:** Places price and cost in one composition so the seller’s comparison is perceptual, not mnemonic. This is the product’s distinctive UX.

**Decision — Net hint:** Show `buyer value − logistics estimate` when rate model allows; label as estimate to avoid false precision.

### 19.4 Seller Visual Accent

Marketplace rows highlight **price** column; selected logistics uses brand border. Avoid gold overload — gold reserved for Create order CTA.

---

## 20. Logistics Dashboard

### 20.1 Job-to-be-Done

Publish capacity and **run booked jobs** through delivery states.

### 20.2 Layout (Desktop)

```text
Page: Dashboard
Supporting: Keep services visible and jobs on schedule.
CTA: [Add service]

┌──────────────────────────────┬───────────────────────┐
│  Active jobs                 │  Service health       │
│  IN_TRANSIT / CONFIRMED      │  AVAILABLE count      │
│  next status actions         │  BOOKED count         │
└──────────────────────────────┴───────────────────────┘
Below: Services table (vehicle, corridor, rate, status)
```

### 20.3 Design Decisions

| Decision | Why |
|----------|-----|
| Jobs before services on home | Operations > catalog when under load |
| Status actions inline on job rows | Dispatchers need one-click transitions |
| Corridor shown as `Origin → Destination` | Matches mental model of routes |
| Capacity + rate always visible | Sellers compare these; providers must see what market sees |

### 20.4 Key Screens

1. **My services** — list + create/edit form  
2. **Jobs** — orders where provider is party  
3. **Job detail** — timeline + allowed transitions  

### 20.5 Logistics Visual Accent

Truck iconography; warning color for `IN_TRANSIT`; success for `DELIVERED`. Avoid consumer “delivery confetti.”

---

## 21. Admin Dashboard

### 21.1 Job-to-be-Done

Govern trust: users, catalog, disputes, audit — dense but calm.

### 21.2 Layout (Desktop)

```text
Page: Overview
Supporting: Platform health and items needing moderation.
(No giant marketing CTA)

┌──────────┬──────────┬──────────┬──────────┐
│ Users    │ Open req │ Orders   │ Disputes │  ← compact metric row
│ active   │ count    │ today    │ open     │    (admin-only exception)
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────┬──────────────────────┐
│  Needs review               │  Recent audit        │
│  suspensions · disputes     │  actor · action · at │
└─────────────────────────────┴──────────────────────┘
```

### 21.3 Design Decisions

| Decision | Why |
|----------|-----|
| Metrics allowed on admin home | Operator job is surveillance; still keep row compact, not a chart carnival |
| Audit adjacent to review queue | Accountability next to action |
| Compact table density default | Power-user efficiency |
| Danger actions behind confirm | Suspend / force status |

### 21.4 Key Screens

1. **Users** — filter by role/status; suspend/activate  
2. **Products** — catalog CRUD  
3. **Orders** — cross-tenant view + dispute tools  
4. **Audit log** — immutable event table  

### 21.5 Admin Visual Accent

Neutral chrome; danger reserved for destructive controls. Sidebar may use slightly darker `brand-900` text for authority without “dark mode forced.”

---

## 22. Cross-Dashboard Patterns

### 22.1 Order Detail (All Roles)

```text
Header: Order # · status chip · party names
Snapshot strip: product · qty · ₹ · logistics rate (read-only)
Timeline: vertical status history (primary narrative)
Actions: only legal transitions for this role
```

**Decision:** Timeline is the visual anchor — not a map (MVP), not a card grid.

### 22.2 Notification Panel

Dropdown from bell: list with unread wash `brand-50`; click → deep link; “Mark all read.”

### 22.3 Profile

Simple form; role badge read-only; org/farm/fleet fields by role.

---

## Layout QA Checklist

- [ ] Landing first viewport passes brand test (brand remains if nav removed)  
- [ ] No hero badges/chips  
- [ ] Seller decision view compares price vs logistics in one screen (lg+)  
- [ ] Each dashboard header has one primary CTA max  
- [ ] Cards only for selectable/interactive entities  
- [ ] Admin density ≠ marketing airiness  

**Previous:** [03 — Feedback](./03-feedback-and-system-screens.md)  
**Next:** [05 — Mobile, Dark Mode & Accessibility](./05-mobile-dark-mode-accessibility.md)
