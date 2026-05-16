const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import Security & Optimization Middlewares
const rateLimiter = require('./middleware/rateLimiter');
const sanitizeInput = require('./utils/sanitizeInput');
const canadaOnly = require('./middleware/canadaOnly');

// Import Custom Route Modules
const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/worker');
const employerRoutes = require('./routes/employer');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const chatRoutes = require('./routes/chat');

const app = express();

// ==========================================
// 1. Global Security Middleware Layer
// ==========================================
// Protect HTTP headers against injection and scanning patterns
app.use(helmet({
    contentSecurityPolicy: false, // Managed custom via Nginx/Vercel edge layers
}));

// Apply global rate limiting to mitigate brute-force vectors
app.use(rateLimiter);

// Setup Cross-Origin Resource Sharing boundaries
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers for parsing payload streams
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 2. Strict Input Sanitization Middleware
// ==========================================
// Strips NoSQL characters ($ and .) and HTML entity sequences from incoming request streams
app.use((req, res, next) => {
    if (req.body) req.body = sanitizeInput(req.body);
    if (req.query) req.query = sanitizeInput(req.query);
    if (req.params) req.params = sanitizeInput(req.params);
    next();
});

// ==========================================
// 3. Geographic Boundary Control
// ==========================================
// Drop non-Canadian access streams prior to checking administrative and authentication routes
app.use(canadaOnly);

// ==========================================
// 4. Exposed File Assets Route Paths
// ==========================================
// Serve static media folders securely, bypassing script execution vectors
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 5. REST Routing Router Declarations
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);

// System Health-Check endpoint utilized by deployment orchestrators (e.g., Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// ==========================================
// 6. Global Catch-All Fallbacks
// ==========================================
// Mismatched REST API Route handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: 'Target API endpoint route path does not exist.' });
});

module.exports = app;
