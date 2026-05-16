const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('./security');

let ioInstance = null;

/**
 * Initializes the Socket.io WebSocket server interface
 * @param {Object} httpServer - The running native Node.js HTTP server instance
 * @returns {Object} The configured io engine wrapper instance
 */
const initializeSocket = (httpServer) => {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000, // Drop client pipelines if inactive for 60 seconds
        pingInterval: 25000
    });

    // ==========================================
    // Token Interception & Validation Handshake
    // ==========================================
    ioInstance.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];

        if (!token) {
            return next(new Error('Authentication failed: Missing transport credentials.'));
        }

        try {
            // Strip Bearer prefix if appended by frontend streams
            const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
            const decodedPayload = jwt.verify(cleanToken, jwtConfig.secret);
            
            // Bind validated user profile attributes directly onto the communication socket
            socket.user = decodedPayload;
            next();
        } catch (error) {
            return next(new Error('Authentication failed: Expired or malformed token string.'));
        }
    });

    // ==========================================
    // Real-Time Event Multiplexing Hub
    // ==========================================
    ioInstance.on('connection', (socket) => {
        console.log(`[WEBSOCKET] Channel established for user ID: ${socket.user.id} (${socket.id})`);

        // Handle user joining an isolated chat room partition
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`[WEBSOCKET] User ${socket.user.id} entered channel room: ${roomId}`);
        });

        // Handle user leaving an isolated chat room partition
        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
            console.log(`[WEBSOCKET] User ${socket.user.id} exited channel room: ${roomId}`);
        });

        // Clean termination cleanup loop
        socket.on('disconnect', () => {
            console.log(`[WEBSOCKET] Connection closed for socket ID: ${socket.id}`);
        });
    });

    return ioInstance;
};

/**
 * Provides access to the globally initialized Socket.io pipeline instance
 * @returns {Object} The active io instance
 */
const getIO = () => {
    if (!ioInstance) {
        throw new Error('[CRITICAL SOCKET FAULT] Engine accessed prior to setup loop initialization.');
    }
    return ioInstance;
};

module.exports = {
    initializeSocket,
    getIO
};
