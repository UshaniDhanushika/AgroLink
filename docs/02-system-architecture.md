# 02 — System Architecture

**AgroLink Architecture Baseline · Sections 7–10**  
**Version:** 1.0  

---

## 7. System Architecture

### 7.1 Architectural Style

AgroLink adopts a **modular monolith backend** (Spring Boot) exposing **REST APIs**, consumed by a **React SPA**, with **MongoDB** as the system of record. This optimizes for:

- Fast delivery of MVP marketplace flows  
- Clear module boundaries that can later extract into services  
- Operational simplicity (single deployable API + SPA + database)  

### 7.2 Logical Building Blocks

| Block | Responsibility |
|-------|----------------|
| Web Client (React) | Presentation, client routing, auth token handling, UX state |
| API Layer (Spring MVC) | HTTP adapters, validation, DTO mapping, security filters |
| Application Services | Use-case orchestration, transactions, domain rules |
| Domain Model | Entities, value objects, domain invariants |
| Persistence (Spring Data MongoDB) | Repositories, indexes, mapping |
| Security Module | JWT issue/validate, RBAC, password hashing |
| Cross-Cutting | Logging, exception handling, correlation IDs, metrics |
| MongoDB | Durable storage for users, requests, services, orders, audits |

### 7.3 Context Diagram (C4 Level 1)

```text
                         ┌─────────────────────┐
                         │   Email Provider    │
                         │   (future / optional)│
                         └──────────▲──────────┘
                                    │
┌──────────┐  HTTPS/JSON   ┌────────┴────────┐  MongoDB Wire  ┌──────────┐
│  Browser │ ◄──────────► │  AgroLink API   │ ◄────────────► │ MongoDB  │
│  (React) │              │  (Spring Boot)  │                │ Cluster  │
└──────────┘              └────────┬────────┘                └──────────┘
                                   │
                                   │ metrics/logs (phase)
                          ┌────────▼────────┐
                          │ Observability   │
                          │ Stack           │
                          └─────────────────┘
```

### 7.4 Key Architectural Decisions (ADRs — Summary)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Modular monolith over microservices (Phase 1) | Lower ops cost; bounded modules enable later split |
| ADR-002 | Reverse marketplace domain model | Matches business: buyers post prices, sellers choose |
| ADR-003 | JWT access + refresh tokens | Stateless API scale; SPA-friendly |
| ADR-004 | MongoDB document model | Flexible product/logistics attributes; rapid iteration |
| ADR-005 | Optimistic concurrency on request accept | Prevent double-match without distributed locks initially |
| ADR-006 | Snapshot commercial terms on order | Historical integrity if listings change later |
| ADR-007 | RFC 7807-style API errors | Consistent client error handling |

### 7.5 Trust Boundaries

1. **Public Internet ↔ TLS terminator / API**  
2. **Unauthenticated endpoints** (register, login, health) vs **authenticated**  
3. **RBAC enforcement** inside API (never trust client role claims alone without signature validation)  
4. **API ↔ MongoDB** on private network  

### 7.6 Cross-Cutting Concerns

- Authentication & authorization  
- Validation (Bean Validation + domain checks)  
- Idempotency keys for critical POSTs (order create) — recommended  
- Correlation ID propagation (`X-Correlation-Id`)  
- Structured logging & metrics  
- Rate limiting (auth + write-heavy endpoints)  

---

## 8. High-Level Architecture Diagram

### 8.1 Deployment View (Target MVP)

```text
                        ┌──────────────────────────────────────────┐
                        │              CDN / Static Host           │
                        │         AgroLink React SPA (build)       │
                        └───────────────────┬──────────────────────┘
                                            │ HTTPS
                                            ▼
                        ┌──────────────────────────────────────────┐
                        │           Load Balancer / Ingress        │
                        │         TLS termination, routing         │
                        └───────────────────┬──────────────────────┘
                                            │
                        ┌───────────────────▼──────────────────────┐
                        │         AgroLink API Replicas (n)        │
                        │  ┌─────────┐ ┌─────────┐ ┌────────────┐  │
                        │  │ Auth    │ │ Market  │ │ Orders     │  │
                        │  │ Module  │ │ Module  │ │ Module     │  │
                        │  └─────────┘ └─────────┘ └────────────┘  │
                        │  Security Filter Chain · Actuator        │
                        └───────────────────┬──────────────────────┘
                                            │
                        ┌───────────────────▼──────────────────────┐
                        │     MongoDB Replica Set (Primary+Secondaries)
                        │     Databases: agrolink                   │
                        └──────────────────────────────────────────┘
```

### 8.2 Runtime Request Path

```text
Client → Ingress → Spring Security Filter (JWT) → Controller
      → Service (use case) → Repository → MongoDB
      → DTO response → Client
```

### 8.3 Module Map (Backend)

```text
agrolink-api
├── identity      (users, auth, roles)
├── catalog       (products, units, categories)
├── demand        (buyer requests)
├── logistics     (transport services)
├── trading       (matching + orders)
├── notification  (in-app; email adapter later)
└── admin         (ops APIs)
```

### 8.4 Frontend Feature Map

```text
agrolink-web
├── auth
├── buyer (requests, matches)
├── seller (browse, match, logistics pick, orders)
├── logistics (services, jobs)
├── orders (shared timeline views)
├── admin
└── shared (layout, forms, API client, guards)
```

---

## 9. Frontend Architecture

### 9.1 Goals

- Role-aware SPA with protected routes  
- Predictable data fetching and mutation patterns  
- Accessible, responsive UX aligned with marketplace decision flows  
- Minimal coupling to backend beyond versioned REST contracts  

### 9.2 Recommended Stack (Frontend)

| Concern | Choice |
|---------|--------|
| Library | React 18+ |
| Build | Vite |
| Language | TypeScript |
| Routing | React Router |
| Server state | TanStack Query (React Query) |
| Client form state | React Hook Form + Zod |
| HTTP | Axios or Fetch wrapper with interceptors |
| Styling | CSS Modules or Tailwind (team choice); design tokens via CSS variables |
| Testing | Vitest + React Testing Library |

### 9.3 Layering

```text
┌─────────────────────────────────────────────┐
| Pages / Routes (role dashboards, features)  |
├─────────────────────────────────────────────┤
| Feature components (tables, forms, timelines)|
├─────────────────────────────────────────────┤
| Shared UI primitives (Button, Input, Dialog)|
├─────────────────────────────────────────────┤
| Hooks / Query keys / API modules            |
├─────────────────────────────────────────────┤
| Auth session + HTTP client + error mapping  |
└─────────────────────────────────────────────┘
```

### 9.4 Routing & Guards

| Route group | Guard |
|-------------|-------|
| `/login`, `/register` | Guest only |
| `/buyer/**` | `BUYER` |
| `/seller/**` | `SELLER` |
| `/logistics/**` | `LOGISTICS` |
| `/admin/**` | `ADMIN` |
| `/orders/:id` | Party to order or Admin |

Unauthorized access → redirect to login or `403` page.

### 9.5 Auth State on Client

- Access token: memory (preferred) or short-lived storage policy per security review  
- Refresh token: `HttpOnly` Secure cookie **preferred**; if localStorage used in MVP, document XSS risk and migrate  
- Axios interceptor: attach `Authorization: Bearer <access>`  
- On `401`: attempt refresh once; if fail, logout  

### 9.6 State Management Principles

- **Server state** (requests, orders, services) lives in TanStack Query cache  
- **UI state** (modals, wizard step) stays local to feature  
- Avoid global Redux unless cross-cutting client complexity grows  

### 9.7 UX Architecture Principles

- One primary job per screen  
- Seller decision screen: buyer offer vs logistics cost in a single composition  
- Order detail: vertical status timeline as the narrative anchor  
- Consistent feedback: toast/inline for mutations; full-page for fatal auth errors  

### 9.8 Frontend Quality Gates

- TypeScript strict mode  
- Route-level code splitting per role area  
- No secrets in frontend env beyond public API base URL  
- Accessibility checks on auth and order-critical forms  

---

## 10. Backend Architecture

### 10.1 Goals

- Clear separation of HTTP, application, and domain concerns  
- Enforce business invariants in services/domain, not only in UI  
- Testable services without servlet container where practical  
- Production-ready security, validation, and observability hooks  

### 10.2 Recommended Stack (Backend)

| Concern | Choice |
|---------|--------|
| Runtime | Java 21 LTS |
| Framework | Spring Boot 3.x |
| Security | Spring Security + JWT (jjwt or Nimbus) |
| Persistence | Spring Data MongoDB |
| Validation | Jakarta Bean Validation |
| Mapping | MapStruct (optional) or manual assemblers |
| Docs | springdoc-openapi (OpenAPI 3) |
| Build | Maven or Gradle |
| Testing | JUnit 5, MockMvc, Testcontainers (MongoDB) |

### 10.3 Layered Module Design

```text
adapter/web          Controllers, DTOs, OpenAPI annotations
application          Use-case services, transaction boundaries
domain               Entities, enums, domain exceptions, policies
infrastructure       Mongo repositories, security, config, clients
```

**Dependency rule:** `adapter → application → domain ← infrastructure`  
Infrastructure implements ports defined by application/domain (hexagonal-lite).

### 10.4 Package Structure (Logical)

```text
com.agrolink
  .AgroLinkApplication
  .config
  .security
  .common          (api error, pagination, correlation)
  .identity
  .catalog
  .demand
  .logistics
  .trading
  .admin
  .notification
```

Each feature package contains: `api`, `service`, `domain`, `persistence` (or shared persistence package).

### 10.5 Transaction & Consistency Strategy

| Operation | Strategy |
|-----------|----------|
| Create request / service | Single-document write |
| Accept buyer request | Conditional update on `status=OPEN` + version/ETag; fail if modified |
| Create order | Multi-document orchestration: verify match → insert order → update request/service; compensate on failure |
| Status update | Update order + push history subdocument/event |

MongoDB multi-document transactions **should** be used for order creation when replica set is available.

### 10.6 Concurrency: Accept Request

Pseudo-policy (not implementation code):

1. Load request by id  
2. Attempt update where `status == OPEN` and `version == expected`  
3. Set `status=MATCHED`, `matchedSellerId`, increment version  
4. If matched count = 0 → conflict (`409`)  

### 10.7 API Versioning

- URL prefix: `/api/v1/...`  
- Breaking changes require `/api/v2`  
- OpenAPI published per version  

### 10.8 Validation Strategy

1. **Syntactic:** Bean Validation on request DTOs  
2. **Authorization:** method security / filter RBAC  
3. **Semantic:** service-level checks (status transitions, ownership)  
4. **Persistence constraints:** unique indexes (email), TTL where applicable  

### 10.9 Integration Points (Extensibility)

| Port | Phase 1 | Future |
|------|---------|--------|
| NotificationPort | In-app persistence | Email/SMS/WhatsApp |
| PaymentPort | Stub / out of scope | Escrow provider |
| FileStoragePort | Optional local/S3 for docs | KYC documents |
| SearchPort | Mongo filters | Atlas Search / Elasticsearch |

### 10.10 Backend Quality Gates

- Unit tests for domain policies (status transitions, match exclusivity)  
- Slice tests for repositories with Testcontainers  
- Contract tests / OpenAPI lint in CI  
- Security tests for role isolation  

---

## Architecture Quality Attributes Mapping

| Attribute | Frontend | Backend | Data |
|-----------|----------|---------|------|
| Security | Route guards, token handling | JWT + RBAC | Least-privilege DB user |
| Performance | Code split, query caching | Indexes, pagination | Covered queries |
| Reliability | Retry refresh once | Idempotent writes, transactions | Replica set |
| Maintainability | Feature folders | Modular packages | Clear collection ownership |

**Previous:** [01 — Requirements](./01-business-and-functional-requirements.md)  
**Next:** [03 — Data Model & API](./03-data-model-and-api.md)
