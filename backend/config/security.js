module.exports = {
    // ==========================================
    // Cryptographic & Token Parameters
    // ==========================================
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-super-secure-local-dev-secret-key-32-chars',
        expiresIn: '2h',          // Standard user session lifetime
        refreshExpiresIn: '7d',   // Long-lived token for persistence
        cookieOptions: {
            httpOnly: true,       // Block client-side XSS access to tokens
            secure: process.env.NODE_ENV === 'production', // Force HTTPS only
            sameSite: 'strict',   // Mitigate Cross-Site Request Forgery (CSRF)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        }
    },

    // ==========================================
    // Authentication Security Constraints
    // ==========================================
    auth: {
        bcryptSaltRounds: 12,     // Optimal balance between security and CPU utilization
        maxLoginAttempts: 5,      // Triggers lockout after 5 failed tries
        lockoutDuration: 15 * 60 * 1000, // 15-minute temporary suspension window
        passwordResetExpiry: 1 * 60 * 60 * 1000 // Reset links expire after 1 hour
    },

    // ==========================================
    // Geographic Boundary Settings
    // ==========================================
    geoBoundary: {
        allowedCountries: ['CA'], // Enforce strict Canadian access boundaries
        bypassRoutes: [
            '/api/auth/login',
            '/api/auth/register',
            '/api/health'
        ]
    },

    // ==========================================
    // Upload Restrictions
    // ==========================================
    uploads: {
        maxFileSize: 5 * 1024 * 1024, // Strict 5MB file cap
        allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ]
    }
};
