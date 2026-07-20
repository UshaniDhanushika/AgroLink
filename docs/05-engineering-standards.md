# 05 — Engineering Standards

**AgroLink Architecture Baseline · Sections 16–21**  
**Version:** 1.0  

---

## 16. Folder Structure

### 16.1 Monorepo Layout (Recommended)

```text
AgroLink/
├── docs/                          # Architecture & design (this set)
├── backend/                       # Spring Boot API
│   ├── src/main/java/com/agrolink/
│   │   ├── AgroLinkApplication.java
│   │   ├── config/
│   │   ├── security/
│   │   ├── common/
│   │   │   ├── api/               # ProblemDetails, PageResponse
│   │   │   ├── exception/
│   │   │   └── persistence/
│   │   ├── identity/
│   │   │   ├── api/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   └── infrastructure/
│   │   ├── catalog/
│   │   ├── demand/
│   │   ├── logistics/
│   │   ├── trading/
│   │   ├── notification/
│   │   └── admin/
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   ├── application-prod.yml
│   │   └── db/                    # index bootstrap scripts if any
│   └── src/test/java/
├── frontend/                      # React SPA
│   ├── public/
│   ├── src/
│   │   ├── app/                   # router, providers, layouts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── buyer/
│   │   │   ├── seller/
│   │   │   ├── logistics/
│   │   │   ├── orders/
│   │   │   └── admin/
│   │   ├── shared/
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   ├── styles/
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── deploy/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   └── k8s/                       # optional manifests
├── .github/workflows/             # CI/CD
├── .gitignore
├── LICENSE
└── README.md
```

### 16.2 Feature Folder Convention (Frontend)

Each feature contains:

```text
features/seller/
  pages/
  components/
  api.ts
  hooks.ts
  types.ts
  index.ts
```

### 16.3 Backend Feature Convention

```text
demand/
  api/BuyerRequestController.java
  api/dto/
  application/BuyerRequestService.java
  domain/BuyerRequest.java
  domain/BuyerRequestStatus.java
  infrastructure/BuyerRequestRepository.java
```

---

## 17. Technology Stack Justification

### 17.1 Stack Summary

| Layer | Technology | Justification |
|-------|------------|---------------|
| UI | React + TypeScript | Mature ecosystem, strong component model for role-based SPAs, hiring availability |
| Build | Vite | Fast DX, modern ESM tooling |
| API | Spring Boot 3 + Java 21 | Enterprise security/data ecosystem, observability, long-term support |
| Security | Spring Security + JWT | Battle-tested filter chain; aligns with stateless horizontal scale |
| DB | MongoDB | Flexible documents for commodities/logistics attributes; rapid schema evolution; geo indexes |
| API Spec | OpenAPI 3 | Contract-first collaboration between FE/BE |
| Containers | Docker | Reproducible envs; cloud portability |
| Reverse proxy | Nginx / Ingress | TLS, static SPA hosting, routing |

### 17.2 Why Modular Monolith (Not Microservices Yet)

- Marketplace MVP has tightly coupled transactional flows (match → order)  
- Single deployable reduces distributed failure modes  
- Package boundaries preserve a future extraction path (`identity`, `trading`, etc.)  

### 17.3 Why MongoDB Over Relational (For This Product)

- Heterogeneous product and logistics attributes without constant migrations  
- Natural aggregate documents for requests/orders with embedded snapshots/history  
- Strong horizontal scale story (sharding by region later)  
- Geo queries for agricultural logistics corridors  

**Trade-off accepted:** Application-enforced referential integrity; mitigated via service transactions + indexes + tests.

### 17.4 Why JWT Over Server Sessions

- Stateless API nodes; simpler autoscaling  
- Natural fit for SPA + future mobile clients  
- Refresh rotation provides revocation path without sticky sessions  

### 17.5 Deliberate Non-Choices (Phase 1)

| Deferred | Reason |
|----------|--------|
| Kafka/event bus | Premature until async fan-out volume justifies ops cost |
| Elasticsearch | Mongo indexes suffice for MVP search |
| GraphQL | REST clearer for role CRUD + OpenAPI governance |
| Micro-frontends | Unnecessary for single product SPA |

---

## 18. Design Patterns

### 18.1 Backend Patterns

| Pattern | Application |
|---------|-------------|
| Layered / Hexagonal-lite | Controllers → application services → domain; infra adapters |
| DTO / Assembler | API models separated from persistence documents |
| Repository | Spring Data abstractions per aggregate |
| Domain Policy / State Machine | Order & request status transitions |
| Strategy | Notification channels; future payment providers |
| Factory | Order number generation; snapshot creation |
| Optimistic Locking | `version` on `buyer_requests` / services |
| Outbox (future) | Reliable domain events to message bus |
| API Gateway (edge) | Ingress as coarse gateway; app handles authz |

### 18.2 Frontend Patterns

| Pattern | Application |
|---------|-------------|
| Container / Presentational | Pages orchestrate; components render |
| Feature-based modules | Role areas isolated |
| Adapter (API client) | Central HTTP + error mapping |
| Guard / HOCs or route loaders | RBAC route protection |
| Cache-as-state (React Query) | Server state synchronization |
| Controlled forms + schema | Zod schemas mirror API validation |

### 18.3 Cross-Cutting Patterns

| Pattern | Application |
|---------|-------------|
| Correlation ID | Trace request across logs |
| Interceptor / Filter | JWT, logging, CORS |
| Circuit breaker (future) | Downstream email/SMS |
| Idempotency key | Order creation |

---

## 19. SOLID Principles

### 19.1 Mapping to AgroLink

| Principle | Practice in AgroLink |
|-----------|----------------------|
| **S**ingle Responsibility | `OrderStatusService` handles transitions only; `OrderQueryService` reads |
| **O**pen/Closed | New notification channel via `NotificationPort` implementation without changing publishers |
| **L**iskov Substitution | Port implementations interchangeable in tests and prod |
| **I**nterface Segregation | Narrow ports (`OrderRepository`, `RequestMatchPort`) over god interfaces |
| **D**ependency Inversion | Application depends on abstractions; Mongo adapters implement them |

### 19.2 Concrete Examples (Design-Level)

- **SRP:** Controllers do not contain match locking logic.  
- **OCP:** Adding `DISPUTED → RESOLVED` extends policy table without rewriting controllers.  
- **DIP:** `BuyerRequestService` depends on `BuyerRequestRepository` interface, not Mongo template details.  
- **ISP:** Sellers’ marketplace read API separate from buyers’ management API.  

### 19.3 Anti-Patterns to Avoid

- Fat controllers with business rules  
- Shared mutable static state for security context outside Spring  
- Copy-paste authorization checks without a reusable ownership policy  
- Frontend trusting `role` from localStorage without server enforcement  

---

## 20. Error Handling Strategy

### 20.1 Principles

1. Fail fast on validation  
2. Map domain failures to stable error codes  
3. Never leak stack traces or internal IDs to clients in production  
4. Always include `correlationId` in error responses and logs  
5. Prefer RFC 7807 Problem Details shape  

### 20.2 Exception Taxonomy

| Type | Examples | HTTP |
|------|----------|------|
| ValidationException | Missing field, invalid unit | 400 |
| AuthenticationException | Bad token/credentials | 401 |
| AccessDeniedException | Wrong role / not owner | 403 |
| ResourceNotFoundException | Unknown order id (or hidden) | 404 |
| ConflictException | Already matched, stale version | 409 |
| DomainException | Illegal status transition | 422 (or 409) |
| RateLimitException | Too many logins | 429 |
| Unexpected | Unchecked failures | 500 |

### 20.3 Global Handling (Backend)

- `@ControllerAdvice` / `@RestControllerAdvice` central mapper  
- Translate Spring Security exceptions consistently  
- Log `5xx` at ERROR with stack; `4xx` at WARN/INFO without stack  
- Persist security-relevant failures to audit where appropriate  

### 20.4 Frontend Error UX

| Class | UX |
|-------|----|
| Validation | Inline field errors from API `fieldErrors` if provided |
| 401 | Refresh then relogin |
| 403 | Dedicated forbidden page |
| 404 | Not found with navigation back |
| 409 | Actionable message (“Offer already taken”) + refresh list |
| 5xx | Generic retry prompt; show correlationId for support |

### 20.5 Idempotency & Retries

- Clients may retry safe GETs  
- POSTs that create orders require `Idempotency-Key` to avoid duplicates on network retry  
- Refresh token endpoint is single-flight on the client  

---

## 21. Logging Strategy

### 21.1 Goals

- Debuggability with correlation across FE → API → DB wait spans  
- Security monitoring (auth failures, reuse detection)  
- Operational metrics (latency, error rate) without PII leakage  

### 21.2 Log Levels

| Level | Usage |
|-------|-------|
| ERROR | Unexpected failures, transaction aborts needing action |
| WARN | Handled business conflicts, auth failures, degraded dependencies |
| INFO | Application lifecycle, significant business events (order created) |
| DEBUG | Dev-only detailed flow (disabled in prod by default) |

### 21.3 Structured Log Fields (JSON)

| Field | Description |
|-------|-------------|
| `timestamp` | ISO-8601 |
| `level` | log level |
| `logger` | class/logger name |
| `message` | human message |
| `correlationId` | per request |
| `userId` | if authenticated |
| `role` | if authenticated |
| `httpMethod` / `path` / `status` | request summary |
| `durationMs` | request timing |
| `errorCode` | stable API code when applicable |

### 21.4 Correlation Propagation

1. Client sends `X-Correlation-Id` or API generates UUID  
2. Filter stores in MDC  
3. All logs + error responses include it  
4. Frontend displays it on fatal errors for support  

### 21.5 What Never to Log

- Raw passwords  
- Access/refresh tokens  
- Full Authorization headers  
- Card/payment data (future)  
- Unnecessary PII dumps (full address payloads at DEBUG only in non-prod)  

### 21.6 Business Event Logging (INFO)

Examples:

- `USER_REGISTERED`  
- `REQUEST_CREATED`  
- `REQUEST_MATCHED`  
- `ORDER_CREATED`  
- `ORDER_STATUS_CHANGED`  
- `USER_SUSPENDED`  

Prefer structured `event=...` fields for later analytics pipelines.

### 21.7 Metrics & Traces (Companion to Logs)

| Signal | Tooling (suggested) |
|--------|---------------------|
| Metrics | Micrometer → Prometheus |
| Dashboards | Grafana |
| Traces | OpenTelemetry (phase 2) |
| Log ship | ELK / OpenSearch / cloud equivalent |

### 21.8 Retention

| Signal | Retention (MVP guidance) |
|--------|--------------------------|
| App logs | 30 days hot |
| Audit logs | 1+ year |
| Metrics | 90 days |

---

**Previous:** [04 — Security](./04-security-architecture.md)  
**Next:** [06 — Deployment, Scalability & Roadmap](./06-deployment-scalability-roadmap.md)
