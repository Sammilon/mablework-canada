# MableWork Canada - Workforce Management Platform

A professional, multi-tenant corporate staffing and recruitment ecosystem tailored for workforce management across Canada. The platform facilitates seamless onboarding, verification, and real-time communication between Workers, Employers, Staff, and Administrators.

## 🏗️ Architecture Overview

The system is split into two distinct layers to ensure optimal performance, scaling, and deployment isolation:
*   `/frontend`: Pure static presentation layer (HTML5, CSS3, JavaScript) driven by modular components and reactive API consumers.
*   `/backend`: Monolithic RESTful API engine powered by Node.js, Express, and MongoDB.

## 👥 Multi-Tenant Portal Access
*   **Workers Portal:** Profile configuration, shift availability scheduling, document uploads (Resumes/IDs), and structured corporate communication setup.
*   **Employers Portal:** On-demand workforce requests, profile settings, real-time messaging, and Stripe-integrated billing management.
*   **Admin Console:** Verification engine for new registrations, security log monitors, global restrictions management, and analytics tracking.

## 🚀 Quick Start (Local Setup)

### Prerequisites
*   Node.js (v18.x or higher)
*   MongoDB Instance (Local or Atlas)

### Installation Steps

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd mablework-canada
