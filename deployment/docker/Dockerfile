# ==========================================
# STAGE 1: Build & Dependency Isolation
# ==========================================
FROM node:18-alpine AS builder

# Set internal working environment
WORKDIR /usr/src/app

# Copy root configurations for dependency compilation
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install crisp, production-only dependencies
RUN npm ci --only=production
cd backend && npm ci --only=production

# ==========================================
# STAGE 2: Optimized Production Runtime
# ==========================================
FROM node:18-alpine

# Enforce secure node execution flags
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Bring over production modules from build container
COPY --from=builder /usr/src/app ./

# Copy complete platform application source trees
COPY server.js ./
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Create isolated storage volumes for uploads and runtime logs
RUN mkdir -p backend/uploads/ids \
             backend/uploads/resumes \
             backend/uploads/company-docs \
             backend/uploads/chat-files \
             backend/uploads/temporary \
             backend/logs

# Expose corporate networking port
EXPOSE 5000

# Execute server process as low-privilege runtime user
USER node

# Start up orchestrator framework
CMD ["node", "server.js"]
