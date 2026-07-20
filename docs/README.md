# AgroLink — Software Architecture & Technical Design

**Document Set Version:** 1.0  
**Status:** Architecture Baseline (Pre-Implementation)  
**Product:** AgroLink — Enterprise Agricultural Marketplace Platform  
**Classification:** Internal Engineering / Architecture  

---

## Purpose

This documentation set defines the complete software architecture and technical design for AgroLink prior to implementation. It is the authoritative baseline for engineering, security, QA, and DevOps.

## Core Business Model

AgroLink operates as a **reverse marketplace**:

1. **Buyers** post product demand with offered prices  
2. **Sellers (farmers)** compare offers and select the best buyer  
3. **Logistics providers** publish transport services  
4. **Sellers** select cost-effective logistics  
5. An **order** is created and tracked through fulfillment  

## Document Map

| # | Document | Sections Covered |
|---|----------|------------------|
| 1 | [Business & Functional Requirements](./01-business-and-functional-requirements.md) | 1–6 |
| 2 | [System Architecture](./02-system-architecture.md) | 7–10 |
| 3 | [Data Model & REST API](./03-data-model-and-api.md) | 11–13 |
| 4 | [Security Architecture](./04-security-architecture.md) | 14–15 |
| 5 | [Engineering Standards](./05-engineering-standards.md) | 16–21 |
| 6 | [Deployment, Scale & Roadmap](./06-deployment-scalability-roadmap.md) | 22–24 |
| 7 | [UI/UX Design System](./design/README.md) | Complete product design language |
| 8 | [MongoDB Database Design](./database/AgroLink-MongoDB-Design.md) | Complete collections, indexes, aggregations |

## Technology Baseline

| Layer | Technology |
|-------|------------|
| Frontend | React (SPA) + Vite |
| Backend | Spring Boot 3.x (Java 21) |
| API Style | REST over HTTPS |
| Auth | JWT (Access + Refresh) |
| Database | MongoDB |
| Messaging (phase 2) | Redis / message broker for async events |

## Governance

- Changes to this baseline require architecture review.  
- Implementation must not begin until NFRs and security controls in these docs are acknowledged by the delivery team.  
- API contracts in Document 3 are the source of truth for frontend–backend integration.  

## Related Artifacts

- Product overview: repository root `README.md`  
- Interactive architecture summary: [AgroLink Architecture Overview](C:/Users/User/.cursor/projects/c-Users-User-OneDrive-Desktop-AgroLink/canvases/agrolink-architecture-overview.canvas.tsx)  
- Interactive design summary: [AgroLink Design System](C:/Users/User/.cursor/projects/c-Users-User-OneDrive-Desktop-AgroLink/canvases/agrolink-design-system.canvas.tsx)
- Interactive database summary: [AgroLink MongoDB Design](C:/Users/User/.cursor/projects/c-Users-User-OneDrive-Desktop-AgroLink/canvases/agrolink-mongodb-design.canvas.tsx)  
