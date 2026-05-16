const mongoose = require('mongoose');

/**
 * Initializes and establishes a persistent connection to the MongoDB cluster
 * @returns {Promise<void>} Resolves when connection completes successfully
 */
const connectDatabase = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        console.error('[CRITICAL] Database Initialization Failed: MONGO_URI is completely missing from environment variables.');
        process.exit(1);
    }

    // Configure base strict queries ahead of system connection execution
    mongoose.set('strictQuery', true);

    try {
        const connectionInstance = await mongoose.connect(MONGO_URI, {
            autoIndex: true, // Auto-compile indexes in background arrays for faster lookups
            serverSelectionTimeoutMS: 5000, // Drop out connection loop after 5 seconds of failure
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });

        console.log(`[DATABASE] MongoDB successfully bound to host cluster: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`[DATABASE CONNECTION ERROR]: ${error.message}`);
        console.log('[DATABASE] Retrying connection loop in 5 seconds...');
        
        // Wait and attempt to reconnect to prevent application crashes on startup
        setTimeout(connectDatabase, 5000);
    }
};

// Bind persistent event hooks to catch running state deviations
mongoose.connection.on('disconnected', () => {
    console.warn('[DATABASE WARNING]: MongoDB connection stream dropped.');
});

mongoose.connection.on('error', (err) => {
    console.error(`[DATABASE RUNTIME ERROR]: ${err.message}`);
});

module.exports = connectDatabase;
