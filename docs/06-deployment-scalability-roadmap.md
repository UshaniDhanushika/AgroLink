# 06 — Deployment, Scalability & Roadmap

**AgroLink Architecture Baseline · Sections 22–24**  
**Version:** 1.0  

---

## 22. Deployment Architecture

### 22.1 Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| `local` | Developer machines via Docker Compose | Seed/fixtures |
| `dev` | Shared integration | Non-prod synthetic |
| `staging` | Pre-prod validation / UAT | Anonymized-like |
| `prod` | Live marketplace | Production |

### 22.2 Runtime Topology (Production)

```text
Internet Users
      │
      ▼
 DNS + CDN (SPA assets, cache immutable hashed files)
      │
      ▼
 WAF / Load Balancer / Ingress (TLS)
      │
      ├──────────────► Web (Nginx) serving React build  [optional separate]
      │
      └──────────────► API Deployment (Spring Boot × N pods/VMs)
                           │
                           ├──── MongoDB Replica Set (3 nodes typical)
                           │
                           └──── Secrets Manager / Config
```

### 22.3 Containerization

| Image | Contents |
|-------|----------|
| `agrolink-api` | Spring Boot layered JAR on JRE 21 |
| `agrolink-web` | Nginx + static SPA (or object storage + CDN) |
| `mongo` | Official MongoDB (managed service preferred in prod) |

**Compose (local):** API + Web + MongoDB (+ optional Mailhog).

### 22.4 Configuration Management

- Twelve-Factor: config via environment variables  
- Spring profiles: `dev`, `staging`, `prod`  
- Secrets never baked into images  
- Feature flags optional for gradual rollout  

### 22.5 CI/CD Pipeline (Logical Stages)

```text
PR → lint/typecheck/tests → build images → push registry
main → deploy staging → smoke tests → manual/auto promote prod
```

**Gates:** unit + slice tests, OpenAPI diff check, dependency scan, container scan.

### 22.6 Release Strategy

| Strategy | MVP Recommendation |
|----------|--------------------|
| API | Rolling update; health/readiness gated |
| SPA | Immutable asset deploy; cache-bust via hashes |
| DB | Expand-contract index/schema changes; backward-compatible field adds |
| Rollback | Previous container image + keep compatible schema |

### 22.7 Health & Readiness

| Probe | Checks |
|-------|--------|
| Liveness | Process up / actuator liveness |
| Readiness | MongoDB connectivity; app initialized |
| Startup | Optional slower allow for JVM warm-up |

### 22.8 Backup & DR (MVP)

- Automated MongoDB snapshots / continuous backup (managed)  
- Point-in-time restore tested quarterly  
- RPO target: ≤ 1 hour; RTO target: ≤ 4 hours (MVP)  
- Documented runbooks for: DB restore, secret rotation, incident response  

### 22.9 Network & Access

- MongoDB not publicly reachable  
- SSH/Bastion or cloud IAM for ops  
- Separate credentials per environment  
- Least-privilege DB user for application  

---

## 23. Scalability Considerations

### 23.1 Scale Dimensions

| Dimension | Approach |
|-----------|----------|
| Users / sessions | Stateless API replicas; JWT |
| Read-heavy marketplace browse | Indexes; pagination; cache hot product catalog |
| Write-heavy matching | Conditional updates; transactions; avoid hot single document |
| Region growth | Shard key candidate: `region` / geo hashed; delay until metrics justify |
| Spiky traffic | HPA on CPU/RPS; rate limits; CDN for SPA |

### 23.2 Horizontal Scaling Rules

1. API must remain **stateless** (no local session store)  
2. Refresh token state lives in MongoDB (or Redis later)  
3. File uploads (future) go to object storage, not app disk  
4. Background jobs (expiry of requests) run as scheduled singleton or queued workers  

### 23.3 Caching Strategy

| Data | Cache | TTL / Invalidation |
|------|-------|--------------------|
| Product catalog | In-memory / Redis | On admin update |
| OpenAPI static | CDN | Hash-based |
| User profile | Short client cache | On update |
| Marketplace lists | Generally **not** aggressively cached (freshness critical) | Optional short CDN only if acceptable |

### 23.4 Database Scalability

- Covered queries via compound indexes (see Document 03)  
- Avoid unbounded `statusHistory` growth — archive after N entries if needed  
- Use projections for list endpoints (exclude heavy fields)  
- Introduce read preference secondary for reporting only  
- Monitor slow query log; add indexes before shard  

### 23.5 Concurrency Hotspots

| Hotspot | Mitigation |
|---------|------------|
| Popular buyer request accept | Conditional status update; 409 on conflict |
| Logistics double-book | Status conditional update; later capacity calendar |
| Order number generation | Prefer DB unique index + retry or dedicated counter collection |

### 23.6 Performance Budgets

- List pages: server p95 ≤ 300 ms with page size 20  
- Accept + create order path: p95 ≤ 500 ms under nominal load  
- Load test before launch: k6/JMeter scenarios for browse, accept, order create  

### 23.7 Scaling Roadmap (Technical)

| Stage | When signals appear | Action |
|-------|---------------------|--------|
| A | CPU high on API | Add replicas |
| B | Mongo primary CPU / lock % | Optimize indexes; larger instance |
| C | Notification lag | Async queue workers |
| D | Cross-region latency | Regional read replicas / edge SPA |
| E | Team & domain split pain | Extract `identity` or `trading` service |

### 23.8 Multi-Tenancy (Future Option)

MVP is single-tenant platform. If white-label cooperatives appear, introduce `tenantId` on all aggregates and mandatory index prefix — design documents fields to allow additive `tenantId` without rewrite.

---

## 24. Future Enhancements

### 24.1 Product Roadmap Themes

| Theme | Capabilities |
|-------|--------------|
| Trust & Payments | Escrow, invoices, payouts, GST-ready billing |
| Quality & Compliance | Grades, certificates, KYC/KYB for buyers & logistics |
| Intelligence | Price suggestion, demand forecasting, route optimization |
| Engagement | Real-time chat, negotiation counter-offers, ratings/reviews |
| Mobile | React Native / Flutter apps reusing APIs |
| Logistics Advanced | Multi-stop routing, cold-chain tracking, POD photos |
| Sustainability | Carbon estimates per shipment, waste reduction metrics |

### 24.2 Technical Enhancements

| Item | Description |
|------|-------------|
| MFA / Passkeys | Stronger account protection |
| Redis | Refresh sessions, rate limiting, catalog cache |
| Event-driven architecture | Domain events via Kafka/RabbitMQ for notifications & analytics |
| CQRS read models | Optimized seller marketplace projections |
| Atlas Search / ES | Rich full-text & faceted search |
| OpenTelemetry | Distributed tracing across services |
| Multi-currency / FX | Cross-border trade |
| Graph subscriptions / WebSocket | Live order tracking |
| Data warehouse | ETL to warehouse for BI |
| Feature flags | Progressive delivery |

### 24.3 UX Enhancements

- Seller “net realization calculator” (buyer price − logistics − fees)  
- Guided onboarding for first request / first service  
- Multilingual UI (i18n) for regional languages  
- Offline-tolerant mobile forms for low-connectivity farms  

### 24.4 Compliance & Enterprise

- SOC2-oriented control mapping  
- Data residency options  
- Fine-grained admin RBAC (support vs super-admin)  
- Contractual SLAs for enterprise buyers  

### 24.5 Evolution Principles

1. Ship Phase 1 modular monolith with clean boundaries  
2. Measure real bottlenecks before splitting services  
3. Keep API contracts backward compatible  
4. Prefer additive MongoDB fields and expand-contract migrations  
5. Security and auditability increase with payment introduction — treat payments as a new trust boundary  

---

## Document Set Closure

This completes the AgroLink architecture baseline sections **1–24**:

| Sections | Document |
|----------|----------|
| 1–6 | [01 — Business & Functional Requirements](./01-business-and-functional-requirements.md) |
| 7–10 | [02 — System Architecture](./02-system-architecture.md) |
| 11–13 | [03 — Data Model & API](./03-data-model-and-api.md) |
| 14–15 | [04 — Security Architecture](./04-security-architecture.md) |
| 16–21 | [05 — Engineering Standards](./05-engineering-standards.md) |
| 22–24 | This document |

**Implementation status:** Documentation only — no application code generated per architecture gate.

**Suggested next engineering step:** Architecture review sign-off → spike JWT + MongoDB module skeleton → OpenAPI stub for marketplace flows.

**Previous:** [05 — Engineering Standards](./05-engineering-standards.md)  
**Index:** [docs/README.md](./README.md)
