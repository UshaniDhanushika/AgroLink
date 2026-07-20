# AgroLink — Complete MongoDB Database Design

**Document Version:** 2.0  
**Status:** Database Architecture Baseline  
**Database name:** `agrolink`  
**Deployment:** Replica set (required for multi-document transactions)  
**Write concern (prod):** `{ w: "majority", j: true }`  

This document **supersedes** the collection inventory in [03-data-model-and-api.md](../03-data-model-and-api.md) for schema detail. REST resource names may still use earlier aliases; physical collections below are canonical.

---

## 1. Design Principles (Decisions)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **Document-per-aggregate** for write boundaries | Matches MongoDB strengths; keeps transactions small |
| D2 | **Separate `users` and `profiles`** | Auth credentials stay isolated from public/business profile fields; profiles can grow without touching login hot path |
| D3 | **`categories` referenced by `products`** | Admin-managed taxonomy; avoids string drift and enables tree/hierarchy later |
| D4 | **Rename demand aggregate to `buyer_demands`** | Aligns with product language (“demand”); replaces earlier `buyer_requests` |
| D5 | **`vehicles` separate from `logistics_services`** | A provider’s fleet is reusable; a service is a priced offering that *references* a vehicle (or vehicle type snapshot) |
| D6 | **Commercial snapshot on `orders`** | Prices/qty/parties frozen at commit time so later catalog edits never rewrite history |
| D7 | **High-churn data in own collections** | `messages`, `notifications`, `reviews` — avoid unbounded arrays on users/orders |
| D8 | **Payments as separate aggregate** | PCI-adjacent lifecycle, retries, and refunds must not bloat order documents |
| D9 | **Wishlist as join collection** | Many-to-many (user ↔ demand/product) with metadata (notes, alerts) |
| D10 | **Universal audit + soft delete fields** | Enterprise accountability and recoverable deletes across all business collections |
| D11 | **`Decimal128` for money** | Avoid binary floating-point drift on ₹ amounts |
| D12 | **ObjectId internally; optional `publicId` UUID** | Efficient storage + stable external API ids when needed |
| D13 | **Application-enforced FKs + unique indexes** | MongoDB has no native FK constraints; uniqueness and conditional updates protect integrity |
| D14 | **Status enums per collection** | Domain-specific state machines; never overload one global status vocabulary |

---

## 2. Universal Document Contract

**Every business collection document includes:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | yes | Primary key |
| `status` | string (enum) | yes | Collection-specific lifecycle (see §14) |
| `createdAt` | date | yes | Insert timestamp (UTC) |
| `updatedAt` | date | yes | Last mutation timestamp (UTC) |
| `createdBy` | ObjectId | yes | `users._id` who created (system user id for jobs) |
| `updatedBy` | ObjectId | yes | `users._id` who last updated |
| `isDeleted` | bool | yes | Soft-delete flag (default `false`) |
| `deletedAt` | date \| null | no | Set when soft-deleted |
| `deletedBy` | ObjectId \| null | no | Who soft-deleted |

### Decision — Why both `status` and `isDeleted`?

- **`status`** = business lifecycle (`OPEN`, `MATCHED`, `ACTIVE`, …).  
- **`isDeleted`** = technical visibility. A demand can be `CANCELLED` (business) without being soft-deleted; soft-delete hides it from all queries while retaining the row for audit/restore.

**Query rule:** All list APIs default to `{ isDeleted: false }` (and usually exclude terminal deleted status where relevant).

### Decision — `createdBy` / `updatedBy` on auth-created users

For self-registration, set `createdBy` = `_id` of the new user (or a well-known `SYSTEM` ObjectId). Prefer a seeded `SYSTEM` user for clarity in admin audits.

---

## 3. Collection Inventory

| Collection | Purpose |
|------------|---------|
| `users` | Authentication identity, role, account status, credentials |
| `profiles` | Public/business profile, addresses, KYC metadata |
| `categories` | Product taxonomy |
| `products` | Tradable commodities |
| `buyer_demands` | Buyer-posted priced demand (reverse marketplace core) |
| `logistics_services` | Transport offerings (route, rate, capacity window) |
| `vehicles` | Fleet assets owned by logistics providers |
| `orders` | Matched trade + logistics engagement + status history |
| `payments` | Payment intents/captures/refunds against orders |
| `reviews` | Ratings after completed orders |
| `messages` | User-to-user (or thread) messages |
| `notifications` | In-app notification inbox |
| `wishlists` | Saved demands/products for later |
| `refresh_tokens` | *(infra)* Refresh session hashes — same audit contract |
| `audit_logs` | *(infra)* Immutable security/admin events |

---

## 4. Embedded vs Referenced

### 4.1 Decision Matrix

| Data | Strategy | Why |
|------|----------|-----|
| User credentials | **Own collection** (`users`) | Security boundary; rarely joined into marketplace lists |
| Profile bio, farm, fleet summary | **Referenced** `profiles.userId → users` | Independent update rate; optional public projection |
| Product → category | **Reference** `categoryId` + denormalize `categoryName` | Stable lists without $lookup on every browse |
| Demand → product / buyer | **Reference** + denormalize product name/unit | Seller browse performance |
| Order line commercial terms | **Embed snapshot** | Historical integrity |
| Order status history | **Embed bounded array** (≤ N) or archive | Read locality on order detail; cap growth |
| Logistics service → vehicle | **Reference** `vehicleId` + snapshot vehicleType/capacity | Fleet reuse; snapshot if vehicle edited later |
| Payment ↔ order | **Reference** both ways (`orderId`, `orders.paymentId`) | Separate lifecycle |
| Review → order / parties | **Reference** | One review per order per direction (unique index) |
| Message thread participants | **Reference** ids; embed small preview on thread doc *or* flat messages with `threadId` | Prefer flat `messages` + `threadId` for scale |
| Notification payload | **Embed** small resource pointer | Avoid joins for inbox |
| Wishlist entries | **Reference** target | Simple many-to-many |
| Address on profile | **Embed** | Always read with profile; low cardinality |
| Geo point | **Embed GeoJSON** | `2dsphere` queries |

### 4.2 Anti-patterns avoided

- Embedding all orders under a user (unbounded).  
- Embedding full chat history under an order (unbounded).  
- Storing plaintext payment card data (never).  

---

## 5. Relationships

```text
users 1 ──────────── 1 profiles
users 1 ──────────── * buyer_demands          (role BUYER)
users 1 ──────────── * logistics_services     (role LOGISTICS)
users 1 ──────────── * vehicles               (role LOGISTICS)
users 1 ──────────── * orders                 (as buyerId / sellerId / logisticsProviderId)
users 1 ──────────── * messages               (sender/recipient)
users 1 ──────────── * notifications
users 1 ──────────── * wishlists
users 1 ──────────── * reviews                (reviewer / reviewee)

categories 1 ─────── * products
products 1 ───────── * buyer_demands
products 1 ───────── * wishlists              (optional target)

buyer_demands 1 ──── 0..1 orders
vehicles 1 ───────── * logistics_services
logistics_services 1 ─ 0..1 orders

orders 1 ─────────── 0..1 payments            (or 1:* if partial captures later)
orders 1 ─────────── * reviews
orders 1 ─────────── * messages               (optional order-scoped thread)
```

### Cardinality notes

- One `buyer_demands` document matches **at most one** seller and produces **at most one** order (MVP exclusive match).  
- One logistics service may be linked to one active order at a time in MVP (`BOOKED`); historical orders retain `logisticsServiceId` even after service returns to `AVAILABLE`.  

---

## 6. Document Structures & Sample JSON

> Field `status` enums are defined in §14. Samples use illustrative ObjectIds.

---

### 6.1 `users`

**Decision:** Keep only identity + security fields here. No long bio, no farm narrative.

| Field | Type | Notes |
|-------|------|-------|
| email | string | unique, lowercase |
| passwordHash | string | BCrypt/Argon2 |
| role | enum | `BUYER` \| `SELLER` \| `LOGISTICS` \| `ADMIN` |
| status | enum | `ACTIVE` \| `SUSPENDED` \| `PENDING_VERIFICATION` \| `INACTIVE` |
| phone | string | E.164 preferred |
| emailVerified | bool | |
| lastLoginAt | date | |
| + universal audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a100000000000000000001" },
  "email": "buyer@grainco.example",
  "passwordHash": "$2a$12$examplehash",
  "role": "BUYER",
  "status": "ACTIVE",
  "phone": "+919876543210",
  "emailVerified": true,
  "lastLoginAt": { "$date": "2026-07-16T10:00:00.000Z" },
  "createdAt": { "$date": "2026-01-10T08:00:00.000Z" },
  "updatedAt": { "$date": "2026-07-16T10:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000099" },
  "updatedBy": { "$oid": "66a100000000000000000001" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.2 `profiles`

**Decision:** 1:1 with user via unique `userId`. Role-specific subdocuments keep one collection instead of three profile collections (simpler ops, single read by `userId`).

| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | unique ref `users` |
| displayName | string | |
| organizationName | string | |
| avatarUrl | string | optional |
| bio | string | max ~500 |
| address | object | line1, line2, city, state, postalCode, country |
| location | GeoJSON Point | optional |
| buyerProfile | object | preferredProducts[], avgOrderVolume |
| sellerProfile | object | farmName, farmSizeAcres, primaryCrops[] |
| logisticsProfile | object | companyName, licenseNumber, operatingStates[] |
| kyc | object | status, verifiedAt (no raw docs in Mongo — store object-storage keys) |
| status | enum | `ACTIVE` \| `INCOMPLETE` \| `HIDDEN` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a200000000000000000001" },
  "userId": { "$oid": "66a100000000000000000001" },
  "displayName": "GrainCo Procurement",
  "organizationName": "GrainCo Pvt Ltd",
  "avatarUrl": null,
  "bio": "Bulk grains buyer — Maharashtra & MP",
  "address": {
    "line1": "12 Market Road",
    "line2": "",
    "city": "Pune",
    "state": "MH",
    "postalCode": "411001",
    "country": "IN"
  },
  "location": {
    "type": "Point",
    "coordinates": [73.8567, 18.5204]
  },
  "buyerProfile": {
    "preferredProducts": ["Wheat", "Soybean"],
    "avgOrderVolume": 500
  },
  "sellerProfile": null,
  "logisticsProfile": null,
  "kyc": { "status": "VERIFIED", "verifiedAt": { "$date": "2026-02-01T00:00:00.000Z" } },
  "status": "ACTIVE",
  "createdAt": { "$date": "2026-01-10T08:00:00.000Z" },
  "updatedAt": { "$date": "2026-06-01T12:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000001" },
  "updatedBy": { "$oid": "66a100000000000000000001" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.3 `categories`

| Field | Type | Notes |
|-------|------|-------|
| name | string | unique |
| slug | string | unique |
| parentId | ObjectId \| null | tree support |
| path | string | materialized path e.g. `/grains/cereals` |
| sortOrder | int | |
| status | enum | `ACTIVE` \| `INACTIVE` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a300000000000000000001" },
  "name": "Grains",
  "slug": "grains",
  "parentId": null,
  "path": "/grains",
  "sortOrder": 1,
  "status": "ACTIVE",
  "createdAt": { "$date": "2026-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000099" },
  "updatedBy": { "$oid": "66a100000000000000000099" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.4 `products`

| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| slug | string | unique |
| categoryId | ObjectId | |
| categoryName | string | denormalized |
| description | string | |
| defaultUnit | enum | `KG` \| `QUINTAL` \| `TON` \| `CRATE` \| `BAG` |
| allowedUnits | string[] | |
| attributes | object | moistureMaxPct, grade, etc. (flexible) |
| searchText | string | normalized name+category for regex/Atlas |
| status | enum | `ACTIVE` \| `INACTIVE` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a400000000000000000001" },
  "name": "Wheat",
  "slug": "wheat",
  "categoryId": { "$oid": "66a300000000000000000001" },
  "categoryName": "Grains",
  "description": "Common wheat for milling",
  "defaultUnit": "QUINTAL",
  "allowedUnits": ["KG", "QUINTAL", "TON"],
  "attributes": { "typicalMoistureMaxPct": 12 },
  "searchText": "wheat grains milling",
  "status": "ACTIVE",
  "createdAt": { "$date": "2026-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000099" },
  "updatedBy": { "$oid": "66a100000000000000000099" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.5 `buyer_demands`

**Decision:** Core reverse-marketplace aggregate. Optimistic concurrency via `version`.

| Field | Type | Notes |
|-------|------|-------|
| buyerId | ObjectId | |
| productId | ObjectId | |
| productName | string | denormalized |
| categoryId | ObjectId | denormalized ref aid |
| quantity | Decimal128 | |
| unit | string | |
| pricePerUnit | Decimal128 | offered price |
| currency | string | `INR` |
| pickupLocation | object | address + location GeoJSON |
| deliveryLocation | object | optional |
| neededBy | date | |
| notes | string | |
| matchedSellerId | ObjectId \| null | |
| matchedAt | date \| null | |
| orderId | ObjectId \| null | |
| version | long | optimistic lock |
| status | enum | see §14 |
| + audit/soft-delete | | `createdBy` normally = buyerId |

```json
{
  "_id": { "$oid": "66a500000000000000000001" },
  "buyerId": { "$oid": "66a100000000000000000001" },
  "productId": { "$oid": "66a400000000000000000001" },
  "productName": "Wheat",
  "categoryId": { "$oid": "66a300000000000000000001" },
  "quantity": { "$numberDecimal": "500" },
  "unit": "QUINTAL",
  "pricePerUnit": { "$numberDecimal": "2450.00" },
  "currency": "INR",
  "pickupLocation": {
    "city": "Nashik",
    "state": "MH",
    "location": { "type": "Point", "coordinates": [73.7898, 19.9975] }
  },
  "deliveryLocation": {
    "city": "Pune",
    "state": "MH",
    "location": { "type": "Point", "coordinates": [73.8567, 18.5204] }
  },
  "neededBy": { "$date": "2026-08-01T00:00:00.000Z" },
  "notes": "Grade A preferred",
  "matchedSellerId": null,
  "matchedAt": null,
  "orderId": null,
  "version": 1,
  "status": "OPEN",
  "createdAt": { "$date": "2026-07-10T09:00:00.000Z" },
  "updatedAt": { "$date": "2026-07-10T09:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000001" },
  "updatedBy": { "$oid": "66a100000000000000000001" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.6 `vehicles`

| Field | Type | Notes |
|-------|------|-------|
| providerId | ObjectId | logistics user |
| registrationNumber | string | unique per provider |
| vehicleType | enum | `TRUCK` \| `MINI_TRUCK` \| `REEFER` \| `TRACTOR_TRAILER` \| `OTHER` |
| capacityValue | Decimal128 | |
| capacityUnit | string | `TON` etc. |
| hasRefrigeration | bool | |
| insuranceExpiry | date | optional |
| status | enum | `ACTIVE` \| `MAINTENANCE` \| `RETIRED` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a600000000000000000001" },
  "providerId": { "$oid": "66a100000000000000000003" },
  "registrationNumber": "MH12AB1234",
  "vehicleType": "REEFER",
  "capacityValue": { "$numberDecimal": "14" },
  "capacityUnit": "TON",
  "hasRefrigeration": true,
  "insuranceExpiry": { "$date": "2026-12-31T00:00:00.000Z" },
  "status": "ACTIVE",
  "createdAt": { "$date": "2026-03-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-03-01T00:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000003" },
  "updatedBy": { "$oid": "66a100000000000000000003" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.7 `logistics_services`

| Field | Type | Notes |
|-------|------|-------|
| providerId | ObjectId | |
| vehicleId | ObjectId | ref vehicles |
| title | string | |
| vehicleSnapshot | object | type, capacity at publish time |
| rateAmount | Decimal128 | |
| rateUnit | enum | `PER_TRIP` \| `PER_KM` \| `PER_UNIT` |
| currency | string | |
| origin | object | city/state + location |
| destination | object | city/state + location |
| serviceRadiusKm | double \| null | alternative to fixed corridor |
| availabilityFrom / To | date | |
| activeOrderId | ObjectId \| null | |
| version | long | |
| status | enum | `AVAILABLE` \| `BOOKED` \| `INACTIVE` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a700000000000000000001" },
  "providerId": { "$oid": "66a100000000000000000003" },
  "vehicleId": { "$oid": "66a600000000000000000001" },
  "title": "Pune–Nashik Reefer 14T",
  "vehicleSnapshot": {
    "vehicleType": "REEFER",
    "capacityValue": { "$numberDecimal": "14" },
    "capacityUnit": "TON",
    "registrationNumber": "MH12AB1234"
  },
  "rateAmount": { "$numberDecimal": "18.00" },
  "rateUnit": "PER_KM",
  "currency": "INR",
  "origin": {
    "city": "Nashik",
    "state": "MH",
    "location": { "type": "Point", "coordinates": [73.7898, 19.9975] }
  },
  "destination": {
    "city": "Pune",
    "state": "MH",
    "location": { "type": "Point", "coordinates": [73.8567, 18.5204] }
  },
  "serviceRadiusKm": null,
  "availabilityFrom": { "$date": "2026-07-01T00:00:00.000Z" },
  "availabilityTo": { "$date": "2026-09-30T00:00:00.000Z" },
  "activeOrderId": null,
  "version": 1,
  "status": "AVAILABLE",
  "createdAt": { "$date": "2026-07-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-07-01T00:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000003" },
  "updatedBy": { "$oid": "66a100000000000000000003" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.8 `orders`

| Field | Type | Notes |
|-------|------|-------|
| orderNumber | string | unique human id `AL-2026-0002041` |
| buyerId / sellerId / logisticsProviderId | ObjectId | |
| buyerDemandId | ObjectId | |
| logisticsServiceId | ObjectId | |
| vehicleId | ObjectId | optional convenience |
| snapshot | object | frozen commercial terms |
| paymentId | ObjectId \| null | |
| statusHistory | array | `{ status, at, byUserId, note }` bounded |
| status | enum | see §14 |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a800000000000000000001" },
  "orderNumber": "AL-2026-0002041",
  "buyerId": { "$oid": "66a100000000000000000001" },
  "sellerId": { "$oid": "66a100000000000000000002" },
  "logisticsProviderId": { "$oid": "66a100000000000000000003" },
  "buyerDemandId": { "$oid": "66a500000000000000000001" },
  "logisticsServiceId": { "$oid": "66a700000000000000000001" },
  "vehicleId": { "$oid": "66a600000000000000000001" },
  "snapshot": {
    "productId": { "$oid": "66a400000000000000000001" },
    "productName": "Wheat",
    "quantity": { "$numberDecimal": "500" },
    "unit": "QUINTAL",
    "pricePerUnit": { "$numberDecimal": "2450.00" },
    "currency": "INR",
    "logisticsRateAmount": { "$numberDecimal": "18.00" },
    "logisticsRateUnit": "PER_KM",
    "pickupCity": "Nashik",
    "deliveryCity": "Pune"
  },
  "paymentId": { "$oid": "66a900000000000000000001" },
  "statusHistory": [
    {
      "status": "CREATED",
      "at": { "$date": "2026-07-12T11:00:00.000Z" },
      "byUserId": { "$oid": "66a100000000000000000002" },
      "note": "Order created"
    },
    {
      "status": "CONFIRMED",
      "at": { "$date": "2026-07-12T15:00:00.000Z" },
      "byUserId": { "$oid": "66a100000000000000000001" },
      "note": "Buyer confirmed"
    }
  ],
  "status": "CONFIRMED",
  "createdAt": { "$date": "2026-07-12T11:00:00.000Z" },
  "updatedAt": { "$date": "2026-07-12T15:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000002" },
  "updatedBy": { "$oid": "66a100000000000000000001" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

**Decision — Bound `statusHistory`:** Cap at ~50 entries; archive older into `order_status_archives` if needed. Prevents document bloat (16MB limit is far away, but working set matters).

---

### 6.9 `payments`

**Decision:** Never store PAN/CVV. Store provider payment intent ids only.

| Field | Type | Notes |
|-------|------|-------|
| orderId | ObjectId | |
| payerId | ObjectId | usually buyer |
| payeeId | ObjectId | platform or seller — policy-dependent |
| amount | Decimal128 | |
| currency | string | |
| method | enum | `UPI` \| `NEFT` \| `CARD` \| `WALLET` \| `COD` \| `ESCROW` |
| provider | string | `RAZORPAY`, `STRIPE`, `MANUAL`, … |
| providerRef | string | external id |
| status | enum | see §14 |
| failureReason | string | |
| paidAt | date \| null | |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66a900000000000000000001" },
  "orderId": { "$oid": "66a800000000000000000001" },
  "payerId": { "$oid": "66a100000000000000000001" },
  "payeeId": { "$oid": "66a100000000000000000099" },
  "amount": { "$numberDecimal": "1225000.00" },
  "currency": "INR",
  "method": "UPI",
  "provider": "RAZORPAY",
  "providerRef": "pay_MaBcDeF123",
  "status": "CAPTURED",
  "failureReason": null,
  "paidAt": { "$date": "2026-07-12T15:05:00.000Z" },
  "createdAt": { "$date": "2026-07-12T15:04:00.000Z" },
  "updatedAt": { "$date": "2026-07-12T15:05:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000001" },
  "updatedBy": { "$oid": "66a100000000000000000001" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.10 `reviews`

| Field | Type | Notes |
|-------|------|-------|
| orderId | ObjectId | |
| reviewerId | ObjectId | |
| revieweeId | ObjectId | |
| revieweeRole | enum | `BUYER` \| `SELLER` \| `LOGISTICS` |
| rating | int | 1–5 |
| title | string | |
| comment | string | |
| status | enum | `PUBLISHED` \| `HIDDEN` \| `PENDING_MODERATION` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66aa00000000000000000001" },
  "orderId": { "$oid": "66a800000000000000000001" },
  "reviewerId": { "$oid": "66a100000000000000000001" },
  "revieweeId": { "$oid": "66a100000000000000000002" },
  "revieweeRole": "SELLER",
  "rating": 5,
  "title": "On-time quality wheat",
  "comment": "Moisture within range. Smooth coordination.",
  "status": "PUBLISHED",
  "createdAt": { "$date": "2026-07-20T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-07-20T10:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000001" },
  "updatedBy": { "$oid": "66a100000000000000000001" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.11 `messages`

**Decision:** Flat messages with `threadId` (not deep nesting). Thread id can be deterministic hash of sorted participant ids + optional `orderId`.

| Field | Type | Notes |
|-------|------|-------|
| threadId | string | indexed |
| orderId | ObjectId \| null | order-scoped chats |
| senderId | ObjectId | |
| recipientId | ObjectId | |
| body | string | |
| readAt | date \| null | |
| status | enum | `SENT` \| `DELIVERED` \| `READ` \| `DELETED` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66ab00000000000000000001" },
  "threadId": "thr_66a1_66a2_66a8",
  "orderId": { "$oid": "66a800000000000000000001" },
  "senderId": { "$oid": "66a100000000000000000002" },
  "recipientId": { "$oid": "66a100000000000000000001" },
  "body": "Pickup ready tomorrow 9 AM at Nashik yard.",
  "readAt": null,
  "status": "SENT",
  "createdAt": { "$date": "2026-07-13T07:30:00.000Z" },
  "updatedAt": { "$date": "2026-07-13T07:30:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000002" },
  "updatedBy": { "$oid": "66a100000000000000000002" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.12 `notifications`

| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | |
| type | string | `DEMAND_MATCHED`, `ORDER_STATUS`, `PAYMENT`, `MESSAGE`, … |
| title | string | |
| body | string | |
| resourceType | string | |
| resourceId | ObjectId | |
| read | bool | |
| status | enum | `ACTIVE` \| `ARCHIVED` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66ac00000000000000000001" },
  "userId": { "$oid": "66a100000000000000000001" },
  "type": "ORDER_STATUS",
  "title": "Order confirmed",
  "body": "Order AL-2026-0002041 is now CONFIRMED.",
  "resourceType": "ORDER",
  "resourceId": { "$oid": "66a800000000000000000001" },
  "read": false,
  "status": "ACTIVE",
  "createdAt": { "$date": "2026-07-12T15:00:01.000Z" },
  "updatedAt": { "$date": "2026-07-12T15:00:01.000Z" },
  "createdBy": { "$oid": "66a100000000000000000099" },
  "updatedBy": { "$oid": "66a100000000000000000099" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

### 6.13 `wishlists`

**Decision:** One document per saved target (not an array on user) so we can index, notify, and soft-delete per item.

| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | usually seller |
| targetType | enum | `BUYER_DEMAND` \| `PRODUCT` \| `LOGISTICS_SERVICE` |
| targetId | ObjectId | |
| notes | string | |
| notifyOnChange | bool | price/status alerts later |
| status | enum | `ACTIVE` \| `ARCHIVED` |
| + audit/soft-delete | | |

```json
{
  "_id": { "$oid": "66ad00000000000000000001" },
  "userId": { "$oid": "66a100000000000000000002" },
  "targetType": "BUYER_DEMAND",
  "targetId": { "$oid": "66a500000000000000000001" },
  "notes": "Good rate if logistics < ₹20/km",
  "notifyOnChange": true,
  "status": "ACTIVE",
  "createdAt": { "$date": "2026-07-11T08:00:00.000Z" },
  "updatedAt": { "$date": "2026-07-11T08:00:00.000Z" },
  "createdBy": { "$oid": "66a100000000000000000002" },
  "updatedBy": { "$oid": "66a100000000000000000002" },
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

---

## 7. Indexes

### 7.1 Index design rules

1. Every default list filter includes `isDeleted: 1` as leading or compound field when selectivity helps.  
2. Equality fields before range/sort fields.  
3. Avoid over-indexing write-heavy collections (`messages`, `notifications`) — index only proven query paths.  
4. Unique indexes enforce business invariants.

### 7.2 Index catalog

#### `users`
```javascript
{ email: 1 }                                    // unique
{ role: 1, status: 1, isDeleted: 1 }
{ phone: 1 }                                    // unique sparse
```

#### `profiles`
```javascript
{ userId: 1 }                                   // unique
{ status: 1, isDeleted: 1 }
{ "location": "2dsphere" }
{ displayName: "text", organizationName: "text", bio: "text" }
```

#### `categories`
```javascript
{ slug: 1 }                                     // unique
{ parentId: 1, sortOrder: 1 }
{ status: 1, isDeleted: 1 }
```

#### `products`
```javascript
{ slug: 1 }                                     // unique
{ categoryId: 1, status: 1, isDeleted: 1 }
{ name: 1 }
{ searchText: "text" }                          // or Atlas Search (§10)
```

#### `buyer_demands`
```javascript
{ status: 1, isDeleted: 1, productId: 1, pricePerUnit: -1 }  // marketplace
{ buyerId: 1, status: 1, createdAt: -1 }
{ matchedSellerId: 1, status: 1 }
{ neededBy: 1, status: 1 }                      // expiry jobs
{ "pickupLocation.location": "2dsphere" }
{ productName: "text", notes: "text" }
```

#### `vehicles`
```javascript
{ providerId: 1, status: 1, isDeleted: 1 }
{ providerId: 1, registrationNumber: 1 }        // unique compound
```

#### `logistics_services`
```javascript
{ status: 1, isDeleted: 1, rateAmount: 1 }
{ providerId: 1, status: 1, createdAt: -1 }
{ vehicleId: 1 }
{ "origin.location": "2dsphere" }
{ "destination.location": "2dsphere" }
```

#### `orders`
```javascript
{ orderNumber: 1 }                              // unique
{ buyerId: 1, createdAt: -1, isDeleted: 1 }
{ sellerId: 1, createdAt: -1, isDeleted: 1 }
{ logisticsProviderId: 1, status: 1, updatedAt: -1 }
{ buyerDemandId: 1 }                            // unique sparse
{ status: 1, updatedAt: -1 }
```

#### `payments`
```javascript
{ orderId: 1 }
{ providerRef: 1 }                              // unique sparse
{ payerId: 1, createdAt: -1 }
{ status: 1, createdAt: -1 }
```

#### `reviews`
```javascript
{ orderId: 1, reviewerId: 1, revieweeId: 1 }    // unique
{ revieweeId: 1, status: 1, createdAt: -1 }
{ rating: 1 }
```

#### `messages`
```javascript
{ threadId: 1, createdAt: -1 }
{ recipientId: 1, status: 1, createdAt: -1 }
{ orderId: 1, createdAt: -1 }
```

#### `notifications`
```javascript
{ userId: 1, read: 1, createdAt: -1 }
{ userId: 1, status: 1, isDeleted: 1, createdAt: -1 }
// TTL optional on createdAt for read+old notifications
```

#### `wishlists`
```javascript
{ userId: 1, status: 1, isDeleted: 1, createdAt: -1 }
{ userId: 1, targetType: 1, targetId: 1 }        // unique
```

---

## 8. Validation Rules (JSON Schema)

Enable with `validator` + `validationLevel: "moderate"` in prod after backfill.

### 8.1 Shared audit fragment (conceptual)

Every collection schema requires:

- `status` string  
- `createdAt`, `updatedAt` date  
- `createdBy`, `updatedBy` objectId  
- `isDeleted` bool  

### 8.2 Example: `buyer_demands` validator

```javascript
db.createCollection("buyer_demands", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "buyerId", "productId", "quantity", "unit", "pricePerUnit",
        "currency", "status", "version",
        "createdAt", "updatedAt", "createdBy", "updatedBy", "isDeleted"
      ],
      properties: {
        buyerId: { bsonType: "objectId" },
        productId: { bsonType: "objectId" },
        quantity: { bsonType: ["decimal", "double", "int", "long"] },
        pricePerUnit: { bsonType: ["decimal", "double", "int", "long"] },
        currency: { enum: ["INR"] },
        unit: { enum: ["KG", "QUINTAL", "TON", "CRATE", "BAG"] },
        status: {
          enum: ["OPEN", "MATCHED", "CANCELLED", "EXPIRED", "INACTIVE"]
        },
        version: { bsonType: ["int", "long"], minimum: 0 },
        isDeleted: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        createdBy: { bsonType: "objectId" },
        updatedBy: { bsonType: "objectId" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
})
```

### 8.3 Example: `orders` validator (status + snapshot)

```javascript
status: {
  enum: [
    "CREATED", "CONFIRMED", "IN_TRANSIT",
    "DELIVERED", "CANCELLED", "DISPUTED", "INACTIVE"
  ]
},
orderNumber: { bsonType: "string", minLength: 5 },
snapshot: {
  bsonType: "object",
  required: ["productName", "quantity", "pricePerUnit", "currency"]
}
```

### 8.4 Example: `reviews` rating bounds

```javascript
rating: { bsonType: ["int", "long"], minimum: 1, maximum: 5 }
```

### 8.5 Example: `payments` amount

```javascript
amount: { bsonType: "decimal" },  // prefer Decimal128 only in strict mode
status: {
  enum: [
    "PENDING", "AUTHORIZED", "CAPTURED",
    "FAILED", "REFUNDED", "CANCELLED", "INACTIVE"
  ]
}
```

### 8.6 Application-level validations (beyond JSON Schema)

| Rule | Enforcement |
|------|-------------|
| Exclusive demand match | Conditional update `status=OPEN` + `version` |
| Order parties must match demand/service | Service layer checks before insert |
| Review only if order `DELIVERED` | Service layer |
| Wishlist unique per user/target | Unique compound index |
| Soft-deleted rows immutable except restore | Service layer |

**Decision:** JSON Schema catches type/enum mistakes; **business invariants stay in the application** (and unique/partial indexes).

---

## 9. Aggregation Pipelines

### 9.1 Marketplace: open demands for sellers (filter + sort + pagination)

```javascript
db.buyer_demands.aggregate([
  {
    $match: {
      status: "OPEN",
      isDeleted: false,
      productId: ObjectId("66a400000000000000000001"),
      pricePerUnit: { $gte: NumberDecimal("2000") }
    }
  },
  { $sort: { pricePerUnit: -1, createdAt: -1 } },
  { $skip: 0 },
  { $limit: 20 },
  {
    $lookup: {
      from: "profiles",
      localField: "buyerId",
      foreignField: "userId",
      as: "buyerProfile"
    }
  },
  { $unwind: { path: "$buyerProfile", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      productName: 1,
      quantity: 1,
      unit: 1,
      pricePerUnit: 1,
      currency: 1,
      neededBy: 1,
      pickupLocation: 1,
      "buyer.displayName": "$buyerProfile.displayName",
      "buyer.organizationName": "$buyerProfile.organizationName"
    }
  }
])
```

**Decision:** `$lookup` only on detail/paginated pages — not on huge unfiltered scans. Prefer denormalized buyer org name on demand if this pipeline becomes hot.

### 9.2 Seller net realization estimate (demand + selected logistics)

```javascript
db.buyer_demands.aggregate([
  { $match: { _id: ObjectId("66a500000000000000000001"), isDeleted: false } },
  {
    $lookup: {
      from: "logistics_services",
      pipeline: [
        {
          $match: {
            _id: ObjectId("66a700000000000000000001"),
            status: "AVAILABLE",
            isDeleted: false
          }
        }
      ],
      as: "logistics"
    }
  },
  { $unwind: "$logistics" },
  {
    $project: {
      productName: 1,
      grossValue: {
        $multiply: ["$quantity", "$pricePerUnit"]
      },
      logisticsRateAmount: "$logistics.rateAmount",
      logisticsRateUnit: "$logistics.rateUnit"
      // distance-based net computed in app if PER_KM
    }
  }
])
```

### 9.3 Order timeline + payment status

```javascript
db.orders.aggregate([
  { $match: { _id: ObjectId("66a800000000000000000001"), isDeleted: false } },
  {
    $lookup: {
      from: "payments",
      localField: "paymentId",
      foreignField: "_id",
      as: "payment"
    }
  },
  { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      orderNumber: 1,
      status: 1,
      statusHistory: 1,
      snapshot: 1,
      paymentStatus: "$payment.status",
      amountPaid: "$payment.amount"
    }
  }
])
```

### 9.4 Logistics provider utilization

```javascript
db.orders.aggregate([
  {
    $match: {
      logisticsProviderId: ObjectId("66a100000000000000000003"),
      isDeleted: false,
      createdAt: { $gte: ISODate("2026-07-01T00:00:00Z") }
    }
  },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])
```

### 9.5 Average rating per reviewee

```javascript
db.reviews.aggregate([
  {
    $match: {
      revieweeId: ObjectId("66a100000000000000000002"),
      status: "PUBLISHED",
      isDeleted: false
    }
  },
  {
    $group: {
      _id: "$revieweeId",
      avgRating: { $avg: "$rating" },
      reviewCount: { $sum: 1 }
    }
  }
])
```

### 9.6 Unread notifications count

```javascript
db.notifications.aggregate([
  {
    $match: {
      userId: ObjectId("66a100000000000000000001"),
      read: false,
      status: "ACTIVE",
      isDeleted: false
    }
  },
  { $count: "unread" }
])
```

### 9.7 Admin: demands matched but order missing (data quality)

```javascript
db.buyer_demands.aggregate([
  {
    $match: {
      status: "MATCHED",
      orderId: null,
      isDeleted: false
    }
  },
  { $project: { buyerId: 1, matchedSellerId: 1, matchedAt: 1, productName: 1 } }
])
```

---

## 10. Search Optimization

| Need | Approach | Decision |
|------|----------|----------|
| Product name search MVP | Text index on `products.searchText` / `name` | Fast to ship |
| Marketplace demand search | Compound filters (product, status, price, geo) before text | Filters reduce candidates |
| Profile/org search | Text index on profiles | Admin + directory |
| Production-grade relevance | **Atlas Search** indexes on `buyer_demands`, `products`, `logistics_services` | Ranked search, autocomplete, analyzers |
| Geo “near pickup” | `2dsphere` + `$near` / `$geoWithin` | Native Mongo geo |
| Case/diacritic | Store `searchText` normalized lowercase ASCII fold in app | Stable matching |

### Atlas Search index (conceptual)

- Collections: `buyer_demands`, `products`  
- Fields: `productName`, `notes`, `pickupLocation.city`, `name`, `categoryName`  
- Facets: `status`, `unit`, `state`  

**Decision:** Do not run unanchored `%like%` regex on large collections in production.

---

## 11. Performance Optimization

| Technique | Application |
|-----------|-------------|
| Covered queries | Project only needed fields in marketplace lists |
| Denormalization | `productName`, `categoryName`, `vehicleSnapshot`, order `snapshot` |
| Pagination | `skip/limit` OK early; move to keyset (`createdAt/_id`) when deep pages hurt |
| Transactions | Use for accept-demand + create-order multi-doc updates |
| Conditional updates | `findAndModify` style match on `status`+`version` prevents double booking |
| Read preference | `primary` for match/pay; secondary for admin analytics later |
| Working set | Indexes fit RAM; avoid huge unbounded arrays |
| TTL | Expire read notifications / revoked refresh tokens |
| Separate hot/cold | Archive old `DELIVERED` orders to `orders_archive` yearly if needed |
| Avoid N+1 | Batch `$in` profile lookups or denormalize display names onto lists |
| Write concern | Majority for money/order paths |

### Hot-path SLA alignment

- Seller browse open demands → served by compound index `{ status, isDeleted, productId, pricePerUnit }`  
- Accept demand → single-document conditional update (fast) then order insert in transaction  

---

## 12. Soft Delete Strategy

### 12.1 Fields

```text
isDeleted: false | true
deletedAt: Date | null
deletedBy: ObjectId | null
```

Optionally set `status: INACTIVE` on soft delete for collections that include that enum value — **but always filter `isDeleted`**.

### 12.2 Behavior

| Action | Behavior |
|--------|----------|
| User “deletes” demand | Soft delete if `OPEN`; if `MATCHED`/`ordered`, prefer `CANCELLED` business status instead |
| Admin purge | Soft delete first; hard delete only via retention job after N days |
| Restore | `isDeleted=false`, clear `deletedAt/By`, set `updatedBy` |
| Unique indexes | Use **partial** unique indexes `{ isDeleted: false }` where re-registering email matters |

Example partial unique email:

```javascript
db.users.createIndex(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
)
```

### 12.3 Cascading (logical)

Soft-deleting a user does **not** mass-delete orders (legal/history). Hide profile from search; block auth via `users.status=SUSPENDED/INACTIVE`.

---

## 13. Audit Fields

| Field | Set on insert | Set on update | Set on soft delete |
|-------|---------------|---------------|--------------------|
| `createdAt` | now | never | — |
| `createdBy` | actor | never | — |
| `updatedAt` | now | now | now |
| `updatedBy` | actor | actor | actor |
| `deletedAt` | null | — | now |
| `deletedBy` | null | — | actor |

**Decision:** Application middleware/AOP sets these centrally so controllers cannot forget.

**Immutable audit trail:** For security-sensitive actions, also write `audit_logs` (append-only). Order `statusHistory` is domain audit; `audit_logs` is security/compliance audit.

---

## 14. Status Management

### 14.1 Per-collection status enums

| Collection | Status values |
|------------|---------------|
| `users` | `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `INACTIVE` |
| `profiles` | `INCOMPLETE`, `ACTIVE`, `HIDDEN`, `INACTIVE` |
| `categories` | `ACTIVE`, `INACTIVE` |
| `products` | `ACTIVE`, `INACTIVE` |
| `buyer_demands` | `OPEN`, `MATCHED`, `CANCELLED`, `EXPIRED`, `INACTIVE` |
| `vehicles` | `ACTIVE`, `MAINTENANCE`, `RETIRED`, `INACTIVE` |
| `logistics_services` | `AVAILABLE`, `BOOKED`, `INACTIVE` |
| `orders` | `CREATED`, `CONFIRMED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`, `DISPUTED`, `INACTIVE` |
| `payments` | `PENDING`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `REFUNDED`, `CANCELLED`, `INACTIVE` |
| `reviews` | `PENDING_MODERATION`, `PUBLISHED`, `HIDDEN`, `INACTIVE` |
| `messages` | `SENT`, `DELIVERED`, `READ`, `DELETED`, `INACTIVE` |
| `notifications` | `ACTIVE`, `ARCHIVED`, `INACTIVE` |
| `wishlists` | `ACTIVE`, `ARCHIVED`, `INACTIVE` |

**Decision:** Include `INACTIVE` on all collections to satisfy a uniform soft-retired business state alongside `isDeleted` when product owners want status-only filters in admin UI.

### 14.2 Order state machine

```text
CREATED → CONFIRMED → IN_TRANSIT → DELIVERED
    │          │            │
    └──── CANCELLED ◄───────┘
                   ╲
                    → DISPUTED ← (from IN_TRANSIT / DELIVERED)
```

Transitions append to `statusHistory` and bump `updatedAt`/`updatedBy`.

### 14.3 Demand match state machine

```text
OPEN → MATCHED → (order created; orderId set)
OPEN → CANCELLED | EXPIRED
```

Match update must be atomic:

```javascript
db.buyer_demands.updateOne(
  {
    _id: demandId,
    status: "OPEN",
    isDeleted: false,
    version: expectedVersion
  },
  {
    $set: {
      status: "MATCHED",
      matchedSellerId: sellerId,
      matchedAt: new Date(),
      updatedAt: new Date(),
      updatedBy: sellerId
    },
    $inc: { version: 1 }
  }
)
```

---

## 15. Multi-Document Transaction Sketch (Create Order)

1. Start session transaction  
2. Verify demand `MATCHED` by this seller and `orderId` null  
3. Conditional-book logistics service `AVAILABLE` → `BOOKED`  
4. Insert `orders` with snapshot  
5. Set `buyer_demands.orderId`  
6. Insert `notifications` for parties  
7. Commit  

On failure, abort — no partial bookings.

---

## 16. Retention & TTL (Guidance)

| Data | Policy |
|------|--------|
| Notifications (read) | TTL 90–180 days |
| Messages | Soft delete; hard purge after policy (e.g., 2 years) |
| Audit logs | ≥ 1 year (often 7) |
| Payments | Retain per financial regulation |
| Soft-deleted users | Hard purge only after legal hold clearance |

---

## 17. Alignment Notes

| Earlier doc (`buyer_requests`) | This design |
|--------------------------------|-------------|
| Profile embedded on user | Split `profiles` |
| Category as string | `categories` collection |
| Logistics only | + `vehicles` |
| No payments/reviews/messages/wishlist | Added as first-class collections |

API layer should map resources carefully during implementation (e.g., `/buyer-requests` → `buyer_demands`).

---

## 18. Implementation Checklist

- [ ] Create replica set locally/prod  
- [ ] Create collections + JSON Schema validators  
- [ ] Create all indexes (including partial uniques)  
- [ ] Seed `SYSTEM` user + admin + base categories/products  
- [ ] Enforce audit field middleware  
- [ ] Enforce soft-delete filters in repositories  
- [ ] Load-test marketplace query with explain plans  
- [ ] Plan Atlas Search promotion criteria  

---

**Related:** [Architecture data model (API)](../03-data-model-and-api.md) · [Design system](../design/README.md)
