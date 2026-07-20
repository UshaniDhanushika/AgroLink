# 03 — Feedback & System Screens

**AgroLink UI/UX**  
**Covers:** Loading screens · Empty states · Error pages  

---

## 13. Loading Screens & Asynchronous Feedback

### 13.1 Loading Philosophy

Prefer **local skeletons** over full-page spinners so layout stability remains and users understand *what* is loading.

| Situation | Pattern |
|-----------|---------|
| First app boot / auth hydrate | Branded splash (short) |
| Route change with data | Page skeleton matching final layout |
| Table refresh | Keep header; shimmer rows |
| Button action | Button loading state; disable double-submit |
| Background revalidation | Silent (React Query); no blocker |

### 13.2 Branded Splash (Cold Start)

```text
Full viewport · surface-0
Centered: AgroLink wordmark (Fraunces)
Thin indeterminate progress bar in brand-600
Optional caption: “Connecting the harvest to market”
Max display: until auth resolve or 1.5s skeleton fallback
```

**Decision:** Splash is brand reinforcement, not a marketing animation. No bouncing logos.

### 13.3 Skeleton Specs

- Shimmer: `surface-2` → `line-100` gradient sweep, 1.2s loop  
- Corner radius matches target component  
- Respect reduced motion → static pulse opacity  

### 13.4 Progress Patterns

| Pattern | Use |
|---------|-----|
| Linear bar | Page-level or wizard step |
| Circular spinner 20–24px | Buttons, inline |
| Stepper | Create-order wizard (3 steps) |

### 13.5 Optimistic UI

Allowed for mark-notification-read. **Not** for accept-request or create-order (conflict-sensitive).

---

## 14. Empty States

### 14.1 Anatomy

```text
[Soft line illustration — field / crate / truck]
Title (h3) — what’s missing
One sentence — why it matters / what to do
Primary CTA
Optional secondary link (docs / learn)
```

### 14.2 Tone

Helpful and concrete. Avoid shame (“You haven’t done anything yet!”).

### 14.3 Role-Specific Empty Copy

| Context | Title | Body | CTA |
|---------|-------|------|-----|
| Buyer · no requests | No demands yet | Post a priced request so sellers can find you. | Post demand |
| Seller · no open market | No open requests | Check back soon or widen filters. | Clear filters |
| Seller · no orders | No orders yet | Accept a buyer request to start. | Browse marketplace |
| Logistics · no services | No services listed | Publish a route and rate to get booked. | Add service |
| Logistics · no jobs | No active jobs | When sellers select you, jobs appear here. | View services |
| Notifications | You’re all caught up | New matches and status changes show up here. | — |
| Admin · audit | No events | Audit entries appear as admins take action. | — |

### 14.4 Illustration Style

- Monoline / duotone using `brand-600` + `line-200`  
- No clipart vegetables with faces  
- Consistent 160–200px width  

### 14.5 Filtered-Empty vs True-Empty

If filters active: “No matches for these filters” + **Clear filters** (not “Create”).

---

## 15. Error Pages & Error UX

### 15.1 Full-Page Errors

| Code | Title | Message | Actions |
|------|-------|---------|---------|
| 404 | Page not found | That link may be outdated or you may not have access. | Go to dashboard · Home |
| 403 | Access denied | Your role can’t open this area. | Go to my dashboard |
| 500 | Something went wrong | We hit an unexpected problem. | Try again · Support |
| Offline | You’re offline | Check your connection. Some actions are paused. | Retry |

Layout: centered content on `surface-0`, brand mark small at top, Fraunces title optional for 404 only; app errors use Jakarta for seriousness.

Show **correlation ID** on 500 in caption mono for support.

### 15.2 Inline & Form Errors

- Field-level messages under controls  
- Banner (`danger-100` bg) for page-level failure  
- Toast for non-blocking failures (notification mark read failed)  

### 15.3 Conflict Errors (Marketplace-Specific)

| Code | UX |
|------|-----|
| Request already matched | Dialog: “This offer was just taken.” → Refresh list |
| Stale logistics | “Service no longer available.” → Back to logistics list |
| Illegal status transition | Inline: explain allowed next steps |

**Decision:** Conflicts are **expected** in reverse marketplaces. Tone = calm and actionable, not alarming red full-page.

### 15.4 Session Errors

401 after failed refresh → redirect login with toast “Session expired. Please sign in again.” Preserve deep-link `?next=` when safe.

### 15.5 Empty vs Error vs Forbidden

| Signal | Meaning |
|--------|---------|
| Empty | Success response, zero items |
| Error | Request failed |
| 403/404 | Hide existence of unauthorized resources (prefer 404 page pattern for IDOR safety alignment with API) |

---

**Previous:** [02 — Components](./02-components.md)  
**Next:** [04 — Page Layouts](./04-page-layouts.md)
