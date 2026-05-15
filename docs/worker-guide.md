# MableWork Canada — Worker Operations & Onboarding Guide

Welcome to MableWork Canada. This operational guide provides clear instructions on configuring your profile, completing compliance steps, managing your availability, and setting up professional communication preferences.

---

## 1. Registration & Profile Configuration

To establish a valid file within the MableWork deployment engine, you must complete the multi-tiered profile schema found in `register.html`.

### Profile Information Breakdown
1. **Personal Identification Details:** Supply your legal full name, date of birth (DOB), residential address, province, and postal code. Ensure your postal code follows the correct Canadian alphanumeric format (`A1A 1A1`).
2. **Workforce Parameters:** Select your target work preference (e.g., Remote, On-site, or Hybrid) to guide our placement algorithms.
3. **Availability Matrix:** Check your target shift availability days. This data connects directly to your worker dashboard calendar grid.

---

## 2. Document Submission & Compliance Vetting

To protect onsite operations, your profile remains in a `Pending` state and cannot accept shifts until compliance documents are fully vetted.

### Submission Checklist
*   **Resume Upload:** Upload a clean, comprehensive resume file in PDF format via `worker-dashboard/upload-documents.html`. 
*   **Identification Upload:** Submit a valid government-issued ID card or work visa photo file (`.jpg` or `.png`).
*   **File Screening:** Uploads are processed securely by `uploadMiddleware.js`, checking file validation markers to prevent security issues. Compliance staff manually review documents within 24 to 48 hours.

---

## 3. Configuring Communication Preferences

MableWork utilizes modern, professional communication streams to ensure fast, corporate placement alerts and field coordination.

### Setting Up Communication Methods
You can define your communication channels during registration or within the **Communication Settings Console** (`worker-dashboard/communication-settings.html`):

*   **Email Channel:** Default operational communication route for system updates, shift allocations, and digital contract deliveries.
*   **Google Chat Integration:** Recommended for instant, real-time messaging with your placement coordinator.
    *   *Requirement:* Selecting Google Chat opens a conditional field requiring your dedicated **Google Chat Email Address**. Ensure this email is correct to receive real-time team channel invites.

---

## 4. On-Site Professional Conduct & Dashboard Support

### Reviewing Active Shifts
Once verified, active assignments and supervisor names appear inside your **Worker Dashboard** (`worker-dashboard/dashboard.html`). You can update your weekly work windows instantly via `worker-dashboard/availability.html`.

### Assistance and Tickets
If an on-site issue, payroll question, or safety concern happens, coordinate immediately with staff. Open an official file tracking entry through your **Dashboard Support Suite** (`worker-dashboard/support.html`) to connect with a Workforce Coordinator.
