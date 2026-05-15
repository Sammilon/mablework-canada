# MableWork Canada — Administrator Operations Guide

This internal document defines operational procedures, compliance standards, and administrative controls for managing the MableWork Canada workforce ecosystem.

## 1. Access Control & Security Enforcement

### Multi-Factor Verification
All administrative accounts must maintain active multi-factor authentication. Session tokens are strictly restricted via `adminMiddleware.js` and expire automatically after 8 hours of inactivity.

### Regional Compliance Management
The platform utilizes `canadaOnly.js` middleware to filter inbound dashboard traffic. If an administrative alert indicates an access breach attempt from outside permitted geographic boundaries, review the entry via the **Security Center Dashboard** (`security-center.html`).

---

## 2. Onboarding & Verification Workflows

To maintain corporate credibility, no user account may access system matchmaking features until verification compliance checks are fully satisfied.

### Worker Verification Flow
When a worker registers, their profile status defaults to `Pending`. 
1. Navigate to `admin/worker-verification.html`.
2. Inspect the submitted identification file in `uploads/ids/`.
3. Verify the applicant’s Canadian Work Preference eligibility criteria against their uploaded resume.
4. Verify that their **Preferred Contact Method** matches their provided details (especially checking for valid Google Chat formats if selected).
5. Toggle status to `Verified` or issue a structured rejection note explaining missing credentials.

### Employer Verification Flow
Corporate clients must pass organizational vetting before issuing workforce requests.
1. Navigate to `admin/employer-verification.html`.
2. Review the business files located in `uploads/company-docs/`.
3. Confirm operational business alignment with target sectors listed in `industries.html`.

---

## 3. Real-Time Monitoring & Crisis Control

### Chat Monitoring
Administrators can access `admin/chat-monitor.html` to audit active chat sockets for professional conduct. This interface allows for immediate resolution of conflict escalations between workers and coordinators.

### Restricting and Blocking Accounts
If an account violates platform terms, administrators can impose restrictions via `admin/restrictions.html`. 
*   **Temporal Suspensions:** Automatically locks authentication access loops for 24, 48, or 72 hours.
*   **Global Ban:** Hard-locks user database documents and invalidates active JSON Web Tokens (JWT) immediately.

---

## 4. System Maintenance & Database Security

### Log Analysis
System stability issues or payment errors must be tracked via the appropriate logs located in `admin/logs.html`:
*   `access.log`: Investigates user access anomalies.
*   `errors.log`: Debugs backend routing or API connection drops.
*   `security.log`: Tracks blocked malicious requests or rate-limiting triggers.

### Database Backups
Automated database backup routines execute via system cron scripts every 24 hours. Manual hot-backups can be initiated through the server management interface when executing high-risk system updates.
