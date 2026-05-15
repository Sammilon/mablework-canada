# MableWork Canada — Database Schema Blueprint

This document sets the architectural standard for the underlying database collections, utilizing MongoDB's flexible, document-based BSON structures while enforcing logical data models via Mongoose schemas.

---

## 1. Core Platform Users

### `Workers` Collection
Stores applicant personal metadata, professional vetting inputs, and tracking details.

| Field Name | Type | Validation Rules / Details |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique system identifier |
| `personalDetails.fullName` | String | Required, trimmed |
| `personalDetails.dob` | Date | Required |
| `personalDetails.address` | String | Required |
| `personalDetails.province` | String | Required (e.g., "Ontario", "Alberta") |
| `personalDetails.postalCode` | String | Required, forced to uppercase alphanumeric format |
| `personalDetails.phone` | String | Required |
| `personalDetails.email` | String | Required, unique index, forced lowercase |
| `workforceDetails.workPreference`| String | Required (e.g., "Remote", "On-site", "Hybrid") |
| `workforceDetails.availability` | Array | Required strings (e.g., `["Monday", "Tuesday"]`) |
| `workforceDetails.resumeUrl` | String | Required, points to `/uploads/resumes/` storage filepath |
| `workforceDetails.idUrl` | String | Required, points to `/uploads/ids/` storage filepath |
| `communication.preferredContactMethod` | String | Required, Enum: `["Email", "Google Chat"]` |
| `communication.googleChatEmail` | String | Required ONLY if preferredContactMethod is "Google Chat" |
| `isVerified` | Boolean | Defaults to `false` until approved by an Admin |
| `createdAt` | Date | Automatically injected timestamp |
| `updatedAt` | Date | Automatically injected timestamp |

### `Employers` Collection
Manages corporate client account authentication structures and tracking details.

| Field Name | Type | Validation Rules / Details |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique system identifier |
| `companyName` | String | Required, unique index, trimmed |
| `contactPerson` | String | Required, primary administrator name |
| `businessEmail` | String | Required, unique index, forced lowercase |
| `phone` | String | Required |
| `website` | String | Optional, string URL pattern |
| `industrySector` | String | Required, aligns with categories in `industries.html` |
| `isVerified` | Boolean | Defaults to `false` until business documents are cleared |

---

## 2. Operational & Transactional Collections

### `WorkforceRequests` Collection
Tracks job orders and personnel placements dispatched by corporate accounts.

| Field Name | Type | Validation Rules / Details |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique system identifier |
| `employerId` | ObjectId | References `_id` in `Employers` collection |
| `industry` | String | Target work vector requested |
| `requiredStaffCount`| Number | Required, minimum limit: 1 |
| `durationDays` | Number | Required placement window length |
| `description` | String | Detailed task summary and specific structural skills required |
| `status` | String | Enum: `["Submitted", "Reviewing", "Assigned", "Completed"]` |

### `Payments` Collection
Logs invoices, corporate billing items, and ledger events generated via payment endpoints.

| Field Name | Type | Validation Rules / Details |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique system identifier |
| `employerId` | ObjectId | References `_id` in `Employers` collection |
| `requestId` | ObjectId | References `_id` in `WorkforceRequests` collection |
| `stripeChargeId` | String | Unique transactional tracking token from Stripe Gateway |
| `amount` | Number | Charged value represented in cents (CAD) |
| `status` | String | Enum: `["Pending", "Succeeded", "Failed", "Refunded"]` |

---

## 3. System Integrity & Security Auditing

### `SecurityLogs` Collection
Maintains automated, tamper-proof tracking of high-risk security access loops.

| Field Name | Type | Validation Rules / Details |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique system identifier |
| `ipAddress` | String | Client remote access address string |
| `eventType` | String | Enum: `["Login_Failure", "Rate_Limit_Exceeded", "Geo_Block"]` |
| `geoRegion` | String | Decoded origin context (e.g., country code mapped via GeoIP) |
| `timestamp` | Date | Defaults to `Date.now()` with automated TTL index expiration |
