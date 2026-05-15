const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware to process incoming API data JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets and public frontend views directly
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Placeholder validation endpoint to ensure connection stability before backend app logic is wired
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "healthy", message: "Root proxy connection verified." });
});

// Fallback routing: Direct untracked traffic directly to the corporate 404 page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', '404.html'));
});

// Start listening for inbound application traffic
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  MableWork Canada Platform Initialized Successfully`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`  Access Address: http://localhost:${PORT}`);
    console.log(`==================================================`);
});

module.exports = app;
