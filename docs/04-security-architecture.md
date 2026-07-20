# 04 — Security Architecture

**AgroLink Architecture Baseline · Sections 14–15**  
**Version:** 1.0  

---

## 14. Security Architecture

### 14.1 Security Objectives

1. Protect authenticity and integrity of marketplace transactions  
2. Enforce least-privilege RBAC across all APIs  
3. Protect credentials, tokens, and PII  
4. Prevent common web/API attacks (OWASP API Top 10 / OWASP Top 10)  
5. Provide auditability for admin and order-critical actions  

### 14.2 Security Domains

| Domain | Controls |
|--------|----------|
| Network | TLS 1.2+, private DB network, restricted admin actuators |
| Application | Input validation, output encoding, CSRF strategy for cookie auth |
| Identity | Strong password policy, hashed secrets, JWT crypto |
| Authorization | Role + ownership checks on every resource |
| Data | Encryption in transit; encryption at rest via cloud/volume; field minimization |
| Operations | Secrets management, patching, least-privilege CI/CD identities |
| Monitoring | Auth failure metrics, anomaly alerts, audit logs |

### 14.3 Threat Model (STRIDE — Summary)

| Threat | Example | Mitigation |
|--------|---------|------------|
| Spoofing | Stolen credentials | Password hashing, rate limits, lockout policy, MFA (future) |
| Tampering | Modified order price | Server-side snapshots; no client-trusted price on settle |
| Repudiation | Denied status change | Audit + statusHistory with actorId |
| Information disclosure | IDOR on orders | Ownership checks; 404 for unauthorized |
| Denial of service | Login flooding | Rate limit, CAPTCHA (future), WAF |
| Elevation of privilege | Role claim forgery | Server signs JWT; role from DB at issue time; never trust unsigned claims |

### 14.4 Authentication Controls

| Control | Specification |
|---------|----------------|
| Password policy | Min length 10; complexity rules configurable; breach check optional later |
| Hashing | BCrypt (cost ≥ 12) or Argon2id |
| Access token | JWT, HS256 or RS256 (RS256 preferred for multi-service future), TTL 15 minutes |
| Refresh token | Opaque random (≥ 256-bit), hashed at rest, TTL 7–30 days |
| Rotation | Refresh token rotation on each use; reuse detection revokes family |
| Logout | Revoke refresh token(s) for session or all sessions |

### 14.5 Authorization Model

**Layered checks:**

1. **Authentication required?** (security filter)  
2. **Role allowed for endpoint?** (`@PreAuthorize` / security matcher)  
3. **Resource ownership / party membership?** (service-level)  
4. **State machine allows action?** (domain policy)  

**Never** authorize solely based on UI hiding buttons.

### 14.6 API Security Controls

| Control | Detail |
|---------|--------|
| HTTPS only | HSTS at edge |
| CORS | Explicit allowlist of SPA origins |
| Rate limiting | Stricter on `/auth/**`; baseline on write APIs |
| Payload limits | Max body size configured |
| Headers | Security headers on SPA host (CSP, X-Content-Type-Options, Referrer-Policy) |
| Mass assignment | DTOs only; never bind persistence entities directly |
| Injection | Parameterized queries via Spring Data; validate enums/IDs |
| SSRF | No user-controlled internal URLs in Phase 1 |

### 14.7 Data Protection

- Log redaction: passwords, tokens, authorization headers  
- PII access limited to owning user and admin  
- Soft-deleted users excluded from marketplace queries  
- Backup encryption and restricted restore access  

### 14.8 Secrets Management

| Secret | Storage |
|--------|---------|
| JWT signing key / private key | Secret manager / env from sealed store |
| MongoDB URI | Secret manager |
| SMTP / third-party keys | Secret manager |
| Local `.env` | Gitignored; sample `.env.example` only |

### 14.9 Admin & Actuator Hardening

- Actuator endpoints not public; bind to internal network or protect with auth  
- Expose only `health`, `info`, `prometheus` (as needed)  
- Admin registration disabled in production; break-glass provisioning process  

### 14.10 Secure SDLC

- Dependency vulnerability scanning in CI  
- SAST on PRs  
- Secret scanning  
- Mandatory code review for security-sensitive modules (`security`, `identity`, `trading`)  
- Penetration test before public launch  

---

## 15. JWT Authentication Flow

### 15.1 Token Types

| Token | Format | Stored Client | Stored Server | Lifetime |
|-------|--------|---------------|---------------|----------|
| Access Token | JWT | Memory / carefully scoped storage | Not stored (stateless) | ~15 min |
| Refresh Token | Opaque | HttpOnly Secure SameSite cookie (preferred) | Hash in `refresh_tokens` | ~7–30 days |

### 15.2 JWT Access Token Claims

| Claim | Purpose |
|-------|---------|
| `sub` | User id |
| `role` | `BUYER` / `SELLER` / `LOGISTICS` / `ADMIN` |
| `email` | Optional convenience (avoid if privacy-sensitive) |
| `iat` | Issued at |
| `exp` | Expiry |
| `jti` | Token id (optional blacklist later) |
| `iss` / `aud` | Issuer / audience validation |

Signature verified on every request; expired tokens rejected.

### 15.3 Login Sequence

```text
Client                     API                         MongoDB
  |                         |                            |
  | POST /auth/login        |                            |
  | {email,password}        |                            |
  |------------------------>| find user by email         |
  |                         |--------------------------->|
  |                         | verify hash                 |
  |                         | generate access JWT        |
  |                         | create refresh token       |
  |                         | store refresh hash         |
  |                         |--------------------------->|
  | 200 {accessToken,user}  | Set-Cookie refresh (pref.) |
  |<------------------------|                            |
```

### 15.4 Authenticated Request Sequence

```text
Client                     API
  |                         |
  | API call                |
  | Authorization: Bearer   |
  |------------------------>|
  |                         | validate signature/exp
  |                         | load authorities from claims
  |                         | authorize role + ownership
  |                         | execute use case
  | 200/4xx                 |
  |<------------------------|
```

### 15.5 Refresh Sequence (Rotation)

```text
Client                     API                         MongoDB
  |                         |                            |
  | POST /auth/refresh      |                            |
  | (cookie/body refresh)   |                            |
  |------------------------>| hash & lookup refresh      |
  |                         |--------------------------->|
  |                         | if revoked/expired/reuse → deny
  |                         | revoke old; issue new pair |
  |                         |--------------------------->|
  | 200 new access (+cookie)|                            |
  |<------------------------|                            |
```

**Reuse detection:** If a previously revoked refresh token is presented, revoke the entire token family for that user session chain and force re-login.

### 15.6 Logout Sequence

```text
Client → POST /auth/logout (Bearer + refresh) → API revokes refresh → Client clears access token → redirect public
```

### 15.7 Spring Security Filter Chain (Logical Order)

1. CORS filter  
2. Correlation ID filter  
3. JWT authentication filter (parse Bearer, set `SecurityContext`)  
4. Authorization checks  
5. DispatcherServlet → Controllers  

Public matchers: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, selected actuator health.

### 15.8 Frontend Auth Flow

```text
App boot
  → if refresh cookie/session exists → refresh access
  → hydrate user (/auth/me)
  → route by role

401 on API
  → single-flight refresh
  → retry original request
  → if refresh fails → logout
```

### 15.9 Failure Modes & Responses

| Condition | HTTP | Code |
|-----------|------|------|
| Bad credentials | 401 | `INVALID_CREDENTIALS` |
| Suspended user | 403 | `ACCOUNT_SUSPENDED` |
| Expired access token | 401 | `TOKEN_EXPIRED` |
| Invalid signature | 401 | `TOKEN_INVALID` |
| Refresh reuse | 401 | `REFRESH_REUSE_DETECTED` |
| Insufficient role | 403 | `FORBIDDEN` |

### 15.10 Security Testing Checklist

- [ ] Role isolation: buyer cannot create logistics service  
- [ ] IDOR: seller A cannot read seller B private orders  
- [ ] Double-accept race yields single match  
- [ ] Refresh rotation and reuse detection  
- [ ] Brute-force rate limit on login  
- [ ] JWT `alg=none` / key confusion rejected  
- [ ] CORS does not reflect arbitrary origins  

---

**Previous:** [03 — Data Model & API](./03-data-model-and-api.md)  
**Next:** [05 — Engineering Standards](./05-engineering-standards.md)
