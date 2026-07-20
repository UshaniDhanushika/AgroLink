# 03 — Data Model & REST API

**AgroLink Architecture Baseline · Sections 11–13**  
**Version:** 1.1  

> **Schema source of truth:** For full MongoDB collection designs (including Profiles, Categories, Vehicles, Reviews, Messages, Payments, Wishlists, validators, aggregations, and universal audit fields), see **[database/AgroLink-MongoDB-Design.md](./database/AgroLink-MongoDB-Design.md)**. This chapter retains the REST API contract; physical collection names there supersede the abbreviated inventory below (`buyer_demands` replaces `buyer_requests`).

---

## 11. MongoDB Database Design

### 11.1 Database

- **Database name:** `agrolink`  
- **Deployment:** Replica set (minimum for transactions & HA)  
- **Write concern (prod):** `w: majority`, `j: true`  
- **Read preference:** `primary` for strong consistency paths (match/order); secondary OK for analytics later  

### 11.2 Design Principles

1. **Document-per-aggregate** for primary write boundaries (`users`, `buyer_requests`, `logistics_services`, `orders`)  
2. **Snapshot** commercial fields into `orders` at creation time  
3. **Avoid unbounded arrays** for high-growth data; prefer separate collections (e.g., `notifications`, `audit_logs`)  
4. **Store references as ObjectId / UUID strings** consistently (recommend UUID string for public IDs if exposing outside DB)  
5. **Soft delete** via `deletedAt` / `active` flags where audit matters  
6. **Indexes first:** every list/filter path must have a supporting index plan  

### 11.3 Collections Overview

| Collection | Aggregate Root | Description |
|------------|----------------|-------------|
| `users` | User | Identity, role, profile, credentials metadata |
| `products` | Product | Catalog of tradable commodities |
| `buyer_requests` | BuyerRequest | Demand posts with offered price |
| `logistics_services` | LogisticsService | Transport offerings |
| `orders` | Order | Matched trade + logistics + status history |
| `notifications` | Notification | In-app user notifications |
| `refresh_tokens` | RefreshToken | Refresh token sessions / rotation |
| `audit_logs` | AuditLog | Sensitive admin/security events |

### 11.4 Collection Schemas (Logical)

#### `users`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `email` | string | unique, lowercase |
| `passwordHash` | string | BCrypt/Argon2 |
| `fullName` | string | |
| `phone` | string | |
| `role` | enum | `BUYER` \| `SELLER` \| `LOGISTICS` \| `ADMIN` |
| `status` | enum | `ACTIVE` \| `SUSPENDED` \| `DELETED` |
| `organizationName` | string | optional |
| `address` | object | line, city, state, postalCode, country |
| `geo` | GeoJSON Point | optional for proximity |
| `sellerProfile` | object | farmSize, crops[] (if SELLER) |
| `logisticsProfile` | object | fleetSize, vehicleTypes[] (if LOGISTICS) |
| `createdAt` | date | |
| `updatedAt` | date | |

**Indexes:** unique `email`; `role` + `status`; geo `2dsphere` on `geo` (optional).

#### `products`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `name` | string | e.g., Wheat |
| `category` | string | Grains, Vegetables, … |
| `defaultUnit` | enum | `KG`, `QUINTAL`, `TON`, `CRATE`, … |
| `allowedUnits` | string[] | |
| `active` | bool | |
| `createdAt` / `updatedAt` | date | |

**Indexes:** unique `name`; `category` + `active`.

#### `buyer_requests`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `buyerId` | ObjectId | ref `users` |
| `productId` | ObjectId | ref `products` |
| `productName` | string | denormalized for list UX |
| `quantity` | decimal/double | |
| `unit` | string | |
| `pricePerUnit` | decimal | buyer offered price |
| `currency` | string | e.g., INR |
| `pickupLocation` | object | address + geo |
| `deliveryLocation` | object | optional |
| `neededBy` | date | delivery/fulfillment window end |
| `notes` | string | |
| `status` | enum | `OPEN`, `MATCHED`, `CANCELLED`, `EXPIRED` |
| `matchedSellerId` | ObjectId | set on match |
| `matchedAt` | date | |
| `orderId` | ObjectId | set when order created |
| `version` | long | optimistic concurrency |
| `createdAt` / `updatedAt` | date | |

**Indexes:**  
- `{ status: 1, productId: 1, pricePerUnit: -1 }`  
- `{ buyerId: 1, status: 1, createdAt: -1 }`  
- `{ "pickupLocation.geo": "2dsphere" }` (optional)  
- `{ neededBy: 1 }` for expiry jobs  

#### `logistics_services`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `providerId` | ObjectId | ref `users` |
| `title` | string | |
| `vehicleType` | string | Truck, Mini-truck, Reefer, … |
| `capacityValue` | double | |
| `capacityUnit` | string | |
| `rateAmount` | decimal | |
| `rateUnit` | enum | `PER_TRIP`, `PER_KM`, `PER_UNIT` |
| `currency` | string | |
| `origin` | object | region/city + geo |
| `destination` | object | region/city + geo OR service radius |
| `serviceRadiusKm` | double | optional model |
| `availabilityFrom` / `availabilityTo` | date | |
| `status` | enum | `AVAILABLE`, `BOOKED`, `INACTIVE` |
| `activeOrderId` | ObjectId | optional |
| `version` | long | |
| `createdAt` / `updatedAt` | date | |

**Indexes:** `{ status: 1, vehicleType: 1, rateAmount: 1 }`; `{ providerId: 1, status: 1 }`; geo indexes as needed.

#### `orders`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `orderNumber` | string | human-readable unique |
| `buyerId` | ObjectId | |
| `sellerId` | ObjectId | |
| `logisticsProviderId` | ObjectId | |
| `buyerRequestId` | ObjectId | |
| `logisticsServiceId` | ObjectId | |
| `snapshot` | object | product, qty, unit, pricePerUnit, logisticsRate, currency, locations |
| `status` | enum | see status model |
| `statusHistory` | array | `{ status, at, byUserId, note }` — keep bounded; archive if needed |
| `createdAt` / `updatedAt` | date | |

**Indexes:** unique `orderNumber`; `{ buyerId: 1, createdAt: -1 }`; `{ sellerId: 1, createdAt: -1 }`; `{ logisticsProviderId: 1, status: 1 }`; `{ status: 1, updatedAt: -1 }`.

#### `notifications`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `userId` | ObjectId | |
| `type` | string | `REQUEST_MATCHED`, `ORDER_STATUS`, … |
| `title` | string | |
| `body` | string | |
| `resourceType` / `resourceId` | string/ObjectId | deep link |
| `read` | bool | |
| `createdAt` | date | |

**Indexes:** `{ userId: 1, read: 1, createdAt: -1 }`; TTL optional for old read notifications.

#### `refresh_tokens`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `userId` | ObjectId | |
| `tokenHash` | string | store hash only |
| `expiresAt` | date | |
| `revokedAt` | date | nullable |
| `replacedByTokenId` | ObjectId | rotation chain |
| `userAgent` / `ip` | string | optional device binding |
| `createdAt` | date | |

**Indexes:** `{ tokenHash: 1 }` unique; `{ userId: 1 }`; TTL on `expiresAt`.

#### `audit_logs`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `actorUserId` | ObjectId | |
| `action` | string | |
| `resourceType` / `resourceId` | string | |
| `metadata` | object | sanitized |
| `ip` | string | |
| `createdAt` | date | |

**Indexes:** `{ createdAt: -1 }`; `{ actorUserId: 1, createdAt: -1 }`.

### 11.5 Enumerations

**BuyerRequest.status:** `OPEN` | `MATCHED` | `CANCELLED` | `EXPIRED`  
**LogisticsService.status:** `AVAILABLE` | `BOOKED` | `INACTIVE`  
**Order.status:** `CREATED` | `CONFIRMED` | `IN_TRANSIT` | `DELIVERED` | `CANCELLED` | `DISPUTED`  
**User.status:** `ACTIVE` | `SUSPENDED` | `DELETED`  
**User.role:** `BUYER` | `SELLER` | `LOGISTICS` | `ADMIN`

### 11.6 Data Integrity Rules

- Referential integrity enforced in **application services** (MongoDB has no FK constraints)  
- Unique email / orderNumber via unique indexes  
- Monetary values: store as `Decimal128` (preferred) to avoid binary floating errors  
- Never delete matched request history; cancel with reason  

---

## 12. Collection Relationships

### 12.1 Relationship Diagram

```text
users (BUYER) 1 ───────< buyer_requests
users (SELLER) 1 ───────< buyer_requests.matchedSellerId
users (LOGISTICS) 1 ────< logistics_services

products 1 ─────────────< buyer_requests

buyer_requests 1 ─────── 0..1 orders
logistics_services 1 ─── 0..1 orders

users (BUYER) 1 ────────< orders
users (SELLER) 1 ───────< orders
users (LOGISTICS) 1 ────< orders

users 1 ────────────────< notifications
users 1 ────────────────< refresh_tokens
users 1 ────────────────< audit_logs (as actor)
```

### 12.2 Cardinality Summary

| From | To | Cardinality | Relationship type |
|------|----|-------------|-------------------|
| User (Buyer) | BuyerRequest | 1:N | Ownership |
| Product | BuyerRequest | 1:N | Catalog reference |
| User (Seller) | BuyerRequest | 1:N | Match (optional until matched) |
| User (Logistics) | LogisticsService | 1:N | Ownership |
| BuyerRequest | Order | 1:0..1 | Fulfillment |
| LogisticsService | Order | 1:0..1 | Engagement (MVP) |
| User | Order | 1:N (per role side) | Party |
| User | Notification | 1:N | Inbox |
| User | RefreshToken | 1:N | Sessions |

### 12.3 Embedding vs Referencing

| Data | Strategy | Why |
|------|----------|-----|
| Order commercial terms | **Embed snapshot** | Historical accuracy |
| Order status history | **Embed** (bounded) or separate if high volume | Read locality on order detail |
| User profile on order lists | **Reference + denormalize names** | Avoid heavy joins; refresh names carefully |
| Product on request | **Reference + denormalize name** | Fast seller browse |
| Notifications | **Separate collection** | High write volume; independent lifecycle |

### 12.4 Query Patterns → Index Alignment

| User question | Query pattern | Supporting index |
|---------------|---------------|------------------|
| Open wheat demands near me sorted by price | `status=OPEN`, product, sort price | compound + geo |
| My requests as buyer | `buyerId` + `createdAt` | compound |
| Available trucks on corridor | `status=AVAILABLE` + rate | compound |
| Seller’s orders | `sellerId` + `createdAt` | compound |
| Unread notifications | `userId` + `read` | compound |

---

## 13. REST API Design

### 13.1 Conventions

| Item | Convention |
|------|------------|
| Base path | `/api/v1` |
| Format | JSON (`application/json`) |
| Auth header | `Authorization: Bearer <accessToken>` |
| Timestamps | ISO-8601 UTC |
| IDs | Stringified ObjectId or UUID |
| Pagination | `page` (0-based), `size`, `sort` |
| Error body | Problem details (`type`, `title`, `status`, `detail`, `instance`, `code`) |
| Idempotency | Header `Idempotency-Key` on `POST /orders` |

### 13.2 Standard Response Envelopes

**Single resource:** resource object  
**Collections:**

```json
{
  "content": [ /* items */ ],
  "page": 0,
  "size": 20,
  "totalElements": 125,
  "totalPages": 7
}
```

### 13.3 Auth APIs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Register user |
| POST | `/api/v1/auth/login` | Public | Issue tokens |
| POST | `/api/v1/auth/refresh` | Refresh token | Rotate tokens |
| POST | `/api/v1/auth/logout` | Authenticated | Revoke refresh |
| GET | `/api/v1/auth/me` | Authenticated | Current user profile |

**Login response (shape):** `{ accessToken, expiresIn, tokenType, refreshToken?, user }`  
(Prefer refresh via HttpOnly cookie; body refresh only if cookie approach not yet adopted.)

### 13.4 Users & Profile

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/api/v1/users/me` | Any | Get profile |
| PUT | `/api/v1/users/me` | Any | Update profile |
| GET | `/api/v1/admin/users` | ADMIN | List users |
| PATCH | `/api/v1/admin/users/{id}/status` | ADMIN | Suspend/activate |

### 13.5 Products (Catalog)

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/api/v1/products` | Authenticated | List active products |
| POST | `/api/v1/admin/products` | ADMIN | Create product |
| PUT | `/api/v1/admin/products/{id}` | ADMIN | Update product |
| PATCH | `/api/v1/admin/products/{id}/active` | ADMIN | Activate/deactivate |

### 13.6 Buyer Requests

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/api/v1/buyer-requests` | BUYER | Create request |
| GET | `/api/v1/buyer-requests/mine` | BUYER | List own requests |
| GET | `/api/v1/buyer-requests/{id}` | Buyer owner, Seller (if OPEN/MATCHED involving), Admin | Detail |
| PUT | `/api/v1/buyer-requests/{id}` | BUYER (owner, OPEN) | Update |
| POST | `/api/v1/buyer-requests/{id}/cancel` | BUYER (owner, OPEN) | Cancel |
| GET | `/api/v1/marketplace/requests` | SELLER | Browse OPEN requests |
| POST | `/api/v1/marketplace/requests/{id}/accept` | SELLER | Accept/match |

**Marketplace query params:** `productId`, `minPrice`, `maxPrice`, `state`, `city`, `page`, `size`, `sort`

### 13.7 Logistics Services

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/api/v1/logistics-services` | LOGISTICS | Create service |
| GET | `/api/v1/logistics-services/mine` | LOGISTICS | List own |
| PUT | `/api/v1/logistics-services/{id}` | LOGISTICS owner | Update |
| POST | `/api/v1/logistics-services/{id}/deactivate` | LOGISTICS owner | Deactivate |
| GET | `/api/v1/marketplace/logistics` | SELLER | Browse AVAILABLE |

**Marketplace query params:** `vehicleType`, `maxRate`, `origin`, `destination`, `minCapacity`, `page`, `size`, `sort`

### 13.8 Orders

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/api/v1/orders` | SELLER | Create order from matched request + logistics |
| GET | `/api/v1/orders/mine` | BUYER/SELLER/LOGISTICS | Role-scoped list |
| GET | `/api/v1/orders/{id}` | Parties / ADMIN | Detail + history |
| POST | `/api/v1/orders/{id}/status` | Parties / ADMIN | Transition status |
| GET | `/api/v1/admin/orders` | ADMIN | Platform list |

**Create order body (logical):** `{ buyerRequestId, logisticsServiceId, note? }`  
**Status body:** `{ status, note? }`

### 13.9 Notifications & Health

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/api/v1/notifications` | Any | List inbox |
| POST | `/api/v1/notifications/{id}/read` | Owner | Mark read |
| GET | `/actuator/health` | Ops | Health |
| GET | `/actuator/info` | Ops | Build info |

### 13.10 HTTP Status Usage

| Status | When |
|--------|------|
| 200 | Successful GET/PUT/PATCH |
| 201 | Resource created |
| 204 | Successful delete/no body |
| 400 | Validation failure |
| 401 | Missing/invalid auth |
| 403 | Authenticated but forbidden |
| 404 | Resource not found / not visible |
| 409 | Conflict (double accept, stale version) |
| 429 | Rate limited |
| 500 | Unexpected server error |

### 13.11 Example Error Payload

```json
{
  "type": "https://agrolink.example/problems/conflict",
  "title": "Request already matched",
  "status": 409,
  "detail": "Buyer request is no longer OPEN.",
  "instance": "/api/v1/marketplace/requests/64f.../accept",
  "code": "REQUEST_ALREADY_MATCHED",
  "correlationId": "c0ffee-..."
}
```

### 13.12 OpenAPI Governance

- springdoc generates OpenAPI 3 from controllers  
- Breaking changes require version bump and migration notes  
- Frontend types generated or hand-synced from OpenAPI in CI  

---

**Previous:** [02 — System Architecture](./02-system-architecture.md)  
**Next:** [04 — Security Architecture](./04-security-architecture.md)
