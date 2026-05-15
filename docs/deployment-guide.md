# MableWork Canada — Production Deployment Guide

This operations guide defines the procedures for deploying, configuration locking, and securing the MableWork Canada platform within live web hosting environments.

---

## 1. Local Containerized Stack (Docker Setup)

For staging configurations or localized production testing, the entire ecosystem can be encapsulated utilizing Docker containers to prevent environment drifting.

### Build and Launch Instructions
1. Ensure Docker Desktop or the Docker Engine daemon is actively running on the server host.
2. Navigate to the root folder of the project repository and execute:
   ```bash
   docker-compose -f deployment/docker/docker-compose.yml up --build -d
