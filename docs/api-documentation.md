
MableWork Canada — Core API Documentation
This document defines the standard REST API endpoints, required payloads, authentication rules, and HTTP status codes for frontend-to-backend communication.
Global Configurations
Base URL: /api
Content-Type: application/json
Authentication Header:
Authorization: Bearer <JWT_TOKEN>
1. Authentication Endpoints (/api/auth)
Register Worker
Endpoint: POST /api/auth/register-worker
Access: Public
Payload Structure
JSON
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
Success Response (201 Created)
JSON
{
  "success": true,
  "message": "Worker registration initiated successfully. Profile status: Pending Vetting.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
User Login
Endpoint: POST /api/auth/login
Access: Public
Payload Structure
JSON
{
  "email": "user@example.com",
  "password": "securePassword123"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "Worker"
}
2. Workforce & Operations (/api/employer)
Create Workforce Request
Endpoint: POST /api/employer/request-workforce
Access: Private (Employer Only)
Payload Structure
JSON
{
  "industry": "Logistics",
  "requiredStaffCount": 5,
  "durationDays": 14,
  "description": "Need warehouse operators for seasonal fulfillment shift spikes."
}
Success Response (201 Created)
JSON
{
  "success": true,
  "requestId": "REQ-88392-2026",
  "status": "Submitted"
}
3. Administrative Verification Engine (/api/admin)
Update Verification Status
Endpoint: PATCH /api/admin/verify-user/:id
Access: Private (Admin Only)
Payload Structure
JSON
{
  "role": "Worker",
  "status": "Verified",
  "notes": "Identification credentials and work preferences cleared against standards."
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Target account status successfully shifted to Verified."
}
Standard Server Response Codes
Status Code
Context
Meaning
200 OK
Fetch/Update
The request succeeded, and data is returned.
201 Created
Submissions
Resource successfully created (e.g., registration).
400 Bad Request
Validation
Missing or invalid request payload.
401 Unauthorized
Missing Token
Valid JWT must be provided in headers.
403 Forbidden
Role/Access
Access denied due to permissions or restrictions.
404 Not Found
Route Mismatch
Endpoint does not exist.
500 Server Error
System Error
Server failed while processing the request.
