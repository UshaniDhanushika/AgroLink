# 01 — Business & Functional Requirements

**AgroLink Architecture Baseline · Sections 1–6**  
**Version:** 1.0  

---

## 1. Business Requirements

### 1.1 Business Problem

Agricultural supply chains suffer from:

- Opaque and fragmented pricing between farmers and bulk buyers  
- High search and negotiation costs for produce offtake  
- Inefficient logistics selection leading to spoilage and margin loss  
- Lack of a single digital system of record for demand, supply, transport, and orders  

### 1.2 Business Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| BO-01 | Digitize buyer demand posting | ≥ 90% of buyer requests created in-platform |
| BO-02 | Enable sellers to compare and accept best offers | Average time-to-match ≤ 24 hours |
| BO-03 | Optimize logistics selection by cost and route | Logistics cost variance vs. baseline ↓ 15% |
| BO-04 | Provide end-to-end order visibility | 100% of matched trades have trackable order status |
| BO-05 | Enforce role-based access and auditability | Zero unauthorized cross-role data mutations |
| BO-06 | Support multi-region agricultural trade | Horizontal scale to N regions without redesign |

### 1.3 Business Scope

**In scope (MVP / Phase 1)**

- User registration, authentication, and role assignment  
- Buyer demand (request) lifecycle  
- Seller offer browsing and buyer selection  
- Logistics service listing and seller selection  
- Order creation, status transitions, and history  
- Dashboards per role  
- REST APIs, JWT security, MongoDB persistence  

**Out of scope (Phase 1)**

- In-app payments / escrow settlement  
- IoT sensor / cold-chain telemetry  
- Native mobile apps  
- Multi-currency FX engines  
- Government subsidy / compliance portals  
- AI price forecasting (roadmap)  

### 1.4 Business Rules

| ID | Rule |
|----|------|
| BR-01 | Only users with role `BUYER` may create or edit buyer requests |
| BR-02 | Only users with role `SELLER` may accept a buyer request and select logistics |
| BR-03 | Only users with role `LOGISTICS` may create or edit transport services |
| BR-04 | A buyer request may be accepted by at most one seller (exclusive match) |
| BR-05 | An order requires: accepted buyer request + selected logistics service + seller |
| BR-06 | Prices are immutable after order confirmation (corrections via amendment events only) |
| BR-07 | Soft-delete preferred for audit; hard delete restricted to admin retention jobs |
| BR-08 | Product quantities must be positive and within declared unit constraints |
| BR-09 | Logistics quotes apply to a defined origin–destination corridor or service radius |
| BR-10 | Admin may suspend accounts; suspended accounts cannot mutate marketplace state |

### 1.5 Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| Farmers / Sellers | Fair prices, reliable offtake, affordable transport |
| Bulk Buyers | Reliable supply, transparent posted prices, volume fulfillment |
| Logistics Providers | Visible demand for transport, predictable bookings |
| Platform Operator / Admin | Trust, compliance, growth, operational control |
| Engineering & Ops | Maintainability, security, uptime, observability |

### 1.6 Assumptions & Constraints

- Users have internet access via modern browsers  
- Primary language for MVP UI: English (i18n-ready structure)  
- Currency for MVP: single platform currency (configurable, e.g., INR)  
- Spring Boot + React + MongoDB are mandated stack choices  
- Cloud-agnostic design preferred (container-first)  

---

## 2. Functional Requirements

### 2.1 Authentication & Identity

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | Users shall register with email, password, full name, phone, and role | Must |
| FR-AUTH-02 | System shall authenticate users and issue JWT access + refresh tokens | Must |
| FR-AUTH-03 | System shall refresh access tokens using valid refresh tokens | Must |
| FR-AUTH-04 | Users shall log out and invalidate refresh token sessions | Must |
| FR-AUTH-05 | Passwords shall be stored using adaptive hashing (BCrypt/Argon2) | Must |
| FR-AUTH-06 | Role cannot be self-escalated after registration without admin approval | Must |

### 2.2 Profile & Account Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROF-01 | Users shall view and update profile fields (name, phone, address, org) | Must |
| FR-PROF-02 | Sellers shall maintain farm/location metadata | Should |
| FR-PROF-03 | Logistics providers shall maintain fleet/capacity metadata | Should |
| FR-PROF-04 | Admin shall activate, suspend, or deactivate accounts | Must |

### 2.3 Buyer Requests (Demand)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BR-01 | Buyers shall create requests with product, quantity, unit, price, location, delivery window | Must |
| FR-BR-02 | Buyers shall list, filter, and search their own requests | Must |
| FR-BR-03 | Buyers shall update requests only while status is `OPEN` | Must |
| FR-BR-04 | Buyers shall cancel `OPEN` requests | Must |
| FR-BR-05 | Sellers shall browse `OPEN` requests with filters (product, region, price, date) | Must |
| FR-BR-06 | System shall transition request to `MATCHED` when a seller accepts | Must |
| FR-BR-07 | System shall prevent concurrent double-accept of the same request | Must |

### 2.4 Logistics Services

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LG-01 | Logistics users shall create services (vehicle type, capacity, rate, corridors, availability) | Must |
| FR-LG-02 | Logistics users shall update/deactivate their services | Must |
| FR-LG-03 | Sellers shall browse available logistics services filtered by route/capacity/cost | Must |
| FR-LG-04 | System shall mark a service as `BOOKED` for an order without overbooking capacity (MVP: soft check) | Should |

### 2.5 Matching & Order Lifecycle

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ORD-01 | Seller shall select a buyer request and a logistics service to create an order | Must |
| FR-ORD-02 | Order shall snapshot price, quantity, parties, and logistics quote at creation | Must |
| FR-ORD-03 | Order statuses shall include: `CREATED`, `CONFIRMED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`, `DISPUTED` | Must |
| FR-ORD-04 | Authorized parties shall update status per defined transition rules | Must |
| FR-ORD-05 | All roles shall view orders relevant to them only | Must |
| FR-ORD-06 | System shall record status change history with actor and timestamp | Must |

### 2.6 Dashboards & Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | Each role shall have a dashboard summarizing relevant KPIs and recent activity | Must |
| FR-DASH-02 | Buyer dashboard: open requests, matched volume, pending deliveries | Must |
| FR-DASH-03 | Seller dashboard: open opportunities, active orders, logistics selections | Must |
| FR-DASH-04 | Logistics dashboard: listed services, booked jobs, utilization | Must |
| FR-NOT-01 | In-app notification list for key events (match, order status) | Should |
| FR-NOT-02 | Email notifications for critical events | Could |

### 2.7 Search, Filter & Catalog

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CAT-01 | System shall maintain a product catalog (name, category, unit types) | Must |
| FR-CAT-02 | Marketplace listings shall support pagination, sort, and multi-field filters | Must |
| FR-CAT-03 | Full-text search on product name and location | Should |

### 2.8 Administration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ADM-01 | Admin shall manage users, roles, and account status | Must |
| FR-ADM-02 | Admin shall manage product catalog entries | Must |
| FR-ADM-03 | Admin shall view platform-wide order and request metrics | Should |
| FR-ADM-04 | Admin shall access audit logs for sensitive actions | Should |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | API p95 latency for read endpoints | ≤ 300 ms (excluding network) |
| NFR-PERF-02 | API p95 latency for write endpoints | ≤ 500 ms |
| NFR-PERF-03 | Frontend initial meaningful paint (cached) | ≤ 2.5 s on broadband |
| NFR-PERF-04 | List endpoints shall support pagination | Default page size 20; max 100 |
| NFR-PERF-05 | Concurrent authenticated users (MVP) | ≥ 1,000 |

### 3.2 Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCALE-01 | Stateless API servers; horizontal scale behind load balancer |
| NFR-SCALE-02 | MongoDB indexes on all high-cardinality query paths |
| NFR-SCALE-03 | Design for eventual introduction of read replicas / sharding by region |
| NFR-SCALE-04 | No session affinity required for API tier |

### 3.3 Availability & Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-AVAIL-01 | Production availability | 99.5% monthly (MVP) |
| NFR-REL-01 | Zero data loss for confirmed orders on single-node failure with durable MongoDB write concern | Majority acknowledged |
| NFR-REL-02 | Graceful degradation when notification channel fails | Core trade flows continue |

### 3.4 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | All traffic over TLS 1.2+ |
| NFR-SEC-02 | JWT-based auth; short-lived access tokens |
| NFR-SEC-03 | Role-based access control (RBAC) on every protected endpoint |
| NFR-SEC-04 | Input validation and output encoding to prevent injection / XSS |
| NFR-SEC-05 | Secrets never committed to source control |
| NFR-SEC-06 | Rate limiting on auth endpoints |
| NFR-SEC-07 | OWASP Top 10 mitigations applied as design constraints |

### 3.5 Usability & Accessibility

| ID | Requirement |
|----|-------------|
| NFR-UX-01 | Responsive UI for desktop and mobile browsers |
| NFR-UX-02 | Clear role-specific navigation; no cross-role action leakage |
| NFR-UX-03 | WCAG 2.1 AA target for core flows (login, create request, create order) |
| NFR-UX-04 | Consistent empty, loading, and error states |

### 3.6 Maintainability & Observability

| ID | Requirement |
|----|-------------|
| NFR-MAINT-01 | Layered backend with clear module boundaries |
| NFR-MAINT-02 | Structured JSON logging with correlation IDs |
| NFR-MAINT-03 | Centralized exception mapping to problem+json (RFC 7807) style errors |
| NFR-OBS-01 | Health, readiness, and liveness endpoints |
| NFR-OBS-02 | Metrics for request rate, error rate, latency |

### 3.7 Compliance & Data Retention

| ID | Requirement |
|----|-------------|
| NFR-COMP-01 | Audit trail for order status changes and admin actions |
| NFR-COMP-02 | Configurable retention for logs and soft-deleted entities |
| NFR-COMP-03 | PII minimization in logs (no raw passwords; mask tokens) |

---

## 4. User Roles

### 4.1 Role Catalog

| Role | Code | Description |
|------|------|-------------|
| Buyer | `BUYER` | Posts demand and offered prices; tracks fulfillment |
| Seller (Farmer) | `SELLER` | Browses demands, selects buyer + logistics, owns order initiation |
| Logistics Provider | `LOGISTICS` | Lists transport services; executes deliveries |
| Administrator | `ADMIN` | Platform governance, catalog, user lifecycle |

### 4.2 Permission Matrix (Summary)

| Capability | BUYER | SELLER | LOGISTICS | ADMIN |
|------------|:-----:|:------:|:---------:|:-----:|
| Register / login | ✓ | ✓ | ✓ | ✓* |
| Manage own profile | ✓ | ✓ | ✓ | ✓ |
| CRUD own buyer requests | ✓ | — | — | read/override |
| Browse open requests | — | ✓ | — | ✓ |
| Accept request (match) | — | ✓ | — | — |
| CRUD logistics services | — | — | ✓ | read/override |
| Browse logistics services | — | ✓ | own | ✓ |
| Create order | — | ✓ | — | — |
| Update order status (scoped) | limited | limited | limited | ✓ |
| Manage users / catalog | — | — | — | ✓ |
| View audit logs | — | — | — | ✓ |

\* Admin accounts are provisioned, not self-registered in production.

### 4.3 Role Personas (UX)

**Buyer — “Bulk Procurement Manager”**  
Needs fast posting of volume demand, clear match status, and delivery ETA visibility.

**Seller — “Farm Operator”**  
Needs simple comparison of buyer prices vs. logistics cost to decide net realization.

**Logistics — “Fleet Dispatcher”**  
Needs clear service listing, booking notifications, and delivery status updates.

**Admin — “Platform Operator”**  
Needs trust & safety controls, catalog hygiene, and operational dashboards.

---

## 5. Use Cases

### 5.1 Use Case Index

| ID | Name | Primary Actor |
|----|------|---------------|
| UC-01 | Register account | Guest |
| UC-02 | Login / logout | All roles |
| UC-03 | Manage profile | All roles |
| UC-04 | Create buyer request | Buyer |
| UC-05 | Update / cancel buyer request | Buyer |
| UC-06 | Browse buyer requests | Seller |
| UC-07 | Accept buyer request | Seller |
| UC-08 | Create logistics service | Logistics |
| UC-09 | Update / deactivate logistics service | Logistics |
| UC-10 | Browse logistics services | Seller |
| UC-11 | Create order (buyer + logistics selection) | Seller |
| UC-12 | Update order status | Buyer / Seller / Logistics / Admin |
| UC-13 | View role dashboard | All roles |
| UC-14 | Administer users & catalog | Admin |

### 5.2 Detailed Use Cases

#### UC-01 Register Account

- **Preconditions:** User is unauthenticated; email not already registered  
- **Main flow:** Open register → enter details + role → submit → account created (`ACTIVE`) → redirect to login  
- **Alternate:** Email already exists → 409 conflict  
- **Postconditions:** User document persisted; password hashed  

#### UC-02 Login / Logout

- **Preconditions:** Active account exists  
- **Main flow:** Submit credentials → validate → issue access + refresh tokens → client stores tokens → access protected routes  
- **Logout:** Client discards tokens; server revokes refresh token family  
- **Exceptions:** Invalid credentials → 401; suspended → 403  

#### UC-04 Create Buyer Request

- **Preconditions:** Authenticated as `BUYER`  
- **Main flow:** Enter product, qty, unit, price/unit, pickup/delivery location, window → validate → persist as `OPEN`  
- **Postconditions:** Request visible to sellers  

#### UC-07 Accept Buyer Request

- **Preconditions:** Authenticated as `SELLER`; request status `OPEN`  
- **Main flow:** Seller selects request → system locks/matches atomically → status `MATCHED`; seller recorded as matcher  
- **Conflicts:** Concurrent accept → only one succeeds; loser receives conflict error  

#### UC-11 Create Order

- **Preconditions:** Seller has matched request; logistics service available  
- **Main flow:** Select logistics → confirm commercial snapshot → create order `CREATED` → notify parties  
- **Postconditions:** Request linked to order; logistics service marked engaged for order  

#### UC-12 Update Order Status

- **Preconditions:** Actor is a party to the order (or Admin)  
- **Main flow:** Request allowed transition → validate → append history → update current status  
- **Business rule:** Illegal transitions rejected (e.g., `DELIVERED` → `CREATED`)  

### 5.3 Order Status Transition Table

| From | To | Allowed Actors |
|------|----|----------------|
| — | `CREATED` | Seller (on create) |
| `CREATED` | `CONFIRMED` | Buyer, Seller, Admin |
| `CREATED` | `CANCELLED` | Buyer, Seller, Admin |
| `CONFIRMED` | `IN_TRANSIT` | Logistics, Admin |
| `CONFIRMED` | `CANCELLED` | Buyer, Seller, Admin (policy-gated) |
| `IN_TRANSIT` | `DELIVERED` | Logistics, Buyer, Admin |
| `IN_TRANSIT` | `DISPUTED` | Buyer, Seller, Admin |
| `DELIVERED` | `DISPUTED` | Buyer, Seller, Admin |
| `DISPUTED` | `DELIVERED` / `CANCELLED` | Admin |

---

## 6. User Flow Diagrams

### 6.1 High-Level Marketplace Flow

```text
┌──────────┐     post demand      ┌─────────────────┐
│  Buyer   │ ───────────────────► │ Buyer Request   │
└──────────┘                      │ status: OPEN    │
                                  └────────┬────────┘
                                           │ browse / compare
                                           ▼
┌──────────┐     accept offer     ┌─────────────────┐
│  Seller  │ ───────────────────► │ Request MATCHED │
└────┬─────┘                      └────────┬────────┘
     │                                     │
     │ browse logistics                    │
     ▼                                     │
┌──────────────────┐                       │
│ Logistics Service│                       │
└────────┬─────────┘                       │
         │ select service                  │
         ▼                                 ▼
     ┌──────────────────────────────────────────┐
     │              ORDER CREATED               │
     │  Buyer + Seller + Logistics + Snapshot   │
     └───────────────────┬──────────────────────┘
                         │ status transitions
                         ▼
              CONFIRMED → IN_TRANSIT → DELIVERED
```

### 6.2 Authentication Flow (User Journey)

```text
[Landing] → [Login] ─┬─ success → [Role Dashboard]
                     └─ fail → [Login + error]
[Landing] → [Register] → [Login] → [Role Dashboard]
[Any page] → Logout → tokens cleared → [Landing]
```

### 6.3 Buyer Flow

```text
Login (BUYER)
  → Dashboard
  → Create Request → Validate → Request OPEN
  → My Requests (filter/sort)
  → Edit/Cancel (if OPEN)
  → View matched request / related orders
  → Confirm / dispute order status (as allowed)
```

### 6.4 Seller Flow

```text
Login (SELLER)
  → Dashboard (opportunities)
  → Browse Open Requests (filters)
  → View Request Detail → Accept (MATCHED)
  → Browse Logistics Services (cost/capacity/route)
  → Select Logistics → Confirm → Order CREATED
  → Track order status
```

### 6.5 Logistics Flow

```text
Login (LOGISTICS)
  → Dashboard (services & jobs)
  → Create / Edit Transport Service
  → Receive booking (order reference)
  → Update status: CONFIRMED context → IN_TRANSIT → DELIVERED
```

### 6.6 Admin Flow

```text
Admin Login
  → Ops Dashboard
  → User Management (suspend/activate)
  → Product Catalog Management
  → Order Oversight / Dispute resolution
  → Audit log review
```

### 6.7 Sequence: Seller Creates Order

```text
Seller UI          API Gateway/API         MongoDB
   |                     |                    |
   | POST /orders        |                    |
   |-------------------> | validate JWT/RBAC  |
   |                     | load request       |
   |                     |------------------->|
   |                     | load logistics     |
   |                     |------------------->|
   |                     | txn/lock match     |
   |                     | create order       |
   |                     | update request     |
   |                     | update service     |
   |                     |<-------------------|
   | 201 + OrderDTO      |                    |
   |<------------------- |                    |
   | refresh dashboards  |                    |
```

### 6.8 UX Wireflow Notes (Design Guidance)

- First viewport of each role home: brand + primary CTA only (e.g., “Post demand”, “Find offers”, “Add service”).  
- Comparison surfaces for sellers must show **buyer price** and **logistics cost** in one decision view.  
- Avoid card-heavy dashboards; prioritize actionable lists and clear status timelines for orders.  
- Mobile: sticky primary CTA; filters in a sheet; status timeline vertical.  

---

## Traceability

| Business Objective | Key FRs | Key NFRs |
|--------------------|---------|----------|
| BO-01 | FR-BR-* | NFR-PERF-*, NFR-UX-* |
| BO-02 | FR-BR-05, FR-BR-06, UC-07 | NFR-PERF-01 |
| BO-03 | FR-LG-*, FR-ORD-01 | NFR-SCALE-02 |
| BO-04 | FR-ORD-* | NFR-REL-*, NFR-COMP-01 |
| BO-05 | FR-AUTH-*, roles | NFR-SEC-* |
| BO-06 | — | NFR-SCALE-* |

**Next:** [02 — System Architecture](./02-system-architecture.md)
