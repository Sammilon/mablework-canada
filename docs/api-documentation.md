# MableWork Canada — Core API Documentation

This document defines the standard REST API endpoints, required payloads, authentication rules, and HTTP status codes for frontend-to-backend communication.

---

## Global Configurations

* **Base URL:** `/api`
* **Content-Type:** `application/json`
* **Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/api/auth`)

### Register Worker

* **Endpoint:** `POST /api/auth/register-worker`
* **Access:** Public

#### Payload Structure

```json
{
  "personalDetails": {
    "fullName": "Jane Doe",
    "dob": "1995-08-15",
    "address": "123 Main St",
    "province": "Ontario",
    "postalCode": "M5V 2M2",
    "phone": "+14165550199",
    "email": "jane.doe@example.com"
  },
  "workforceDetails": {
    "workPreference": "Remote",
    "availability": ["Monday", "Wednesday", "Friday"],
    "resumeUrl": "/uploads/resumes/uuid-resume.pdf",
    "idUrl": "/uploads/ids/uuid-id.jpg"
  },
  "communication": {
    "preferredContactMethod": "Google Chat",
    "googleChatEmail": "jane.doe.chat@example.com"
  }
}
...
#
