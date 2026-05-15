# MableWork Canada — Platform Security Architecture Guide

This blueprint defines the defensive standards, cryptographic implementations, and middleware guardrails engineered to protect user data, financial logs, and systemic integrity across the MableWork Canada network.

---

## 1. Perimeter Defense & Geographic Filtering

To safeguard operations and enforce compliance with Canadian staffing frameworks, the system employs a multi-tiered regional filtering strategy.

### Canada-Only Edge Routing
*   **Implementation:** `backend/middleware/canadaOnly.js` & `backend/utils/geoIP.js`
*   **Mechanism:** Inbound HTTP requests run through an internal GeoIP mapping database lookup at the middleware layer. Requests originating from IP addresses mapped outside Canadian territorial boundaries are dropped with an explicit `403 Forbidden` response.
*   **Edge Optimization:** Cloudflare rules synchronize with edge nodes (`geo-blocking.json`) to deflect non-domestic traffic profiles before hitting our application hardware.

---

## 2. Authentication & Session Security

### JSON Web Tokens (JWT) Management
*   **Issuance Strategy:** Token structures map via `tokenGenerator.js` during authentication loops (`/login`, `/register`).
*   **Storage Framework:** Tokens persist inside HTTP-only, secure, same-site client cookies, preventing access from malicious frontend scripts (mitigating Cross-Site Scripting token theft).
*   **Expiration Guardrails:** Tokens are hard-capped to 7 days for standard user dashboards, while administrative consoles auto-expire in 8 hours via `adminMiddleware.js`.

### Brute-Force & Denial-of-Service Defense
*   **Rate Limiting:** Managed via `rateLimiter.js` using a memory-store strategy. Public route paths are capped at a maximum of 15 requests per minute per IP address.
*   **Automation Mitigation:** Public registrations hook directly into reCAPTCHA v3 validations via `captchaMiddleware.js` to eliminate automated bot signups.

---

## 3. Data Integrity & Code Injection Mitigation

### Input Sanitization Layer
*   **Implementation:** `backend/utils/sanitizeInput.js`
*   **Defensive Scope:** Every incoming request body string runs through a mutation block designed to strip out dangerous characters and structural markers:
    *   **NoSQL Injection:** Trims and translates structural operators (e.g., stripping `$` and `.` syntax signs) to neutralize malicious MongoDB query tampering.
    *   **XSS Protection:** Converts HTML entity wrappers (e.g., translating `<` to `&lt;`) to stop injected code from executing inside standard user browser contexts.

### Secure File Upload Controls
*   **Validation Layer:** Managed by `uploadMiddleware.js` and `fileValidation.js`.
*   **MIME Type Enforcement:** Incoming uploads are strictly limited via explicit whitelists (e.g., `.pdf` for resumes, `.jpg`/`.png` for identification files). Extension string spoofing is blocked by analyzing underlying file magic bytes.
*   **Storage Isolation:** Files are stored in an un-executable folder directory (`backend/uploads/`) with custom naming configurations to prevent path-traversal directory exploits.

---

## 4. Cryptographic Encryption Standards

| Data Vector | Mechanism | Standard |
| :--- | :--- | :--- |
| **Passwords at Rest** | One-way salted hashing via `bcryptjs` | Minimum 12 Cost Factor Rounds |
| **Sensitive Profile Assets** | Reversible field-level encryption via `crypto` | AES-256-GCM cipher standards |
| **Data in Transit** | Global transport encryption | TLS 1.3 Enforcement |

---

## 5. Security Log Auditing

All detected security anomalies or middleware blocks automatically write entries to `backend/logs/security.log`. Administrators trace these events dynamically within `admin/security-center.html` to monitor pattern shifts, identify malicious IP blocks, and fine-tune global firewall rules.
