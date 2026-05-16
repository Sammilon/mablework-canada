const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const LOG_DIRECTORY = path.join(__dirname, '../logs');

// Custom log print formatting for readable console output
const consoleLogFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `[${timestamp}] ${level}: ${message} ${metaString}`;
    })
);

// Structured JSON log format for machine analysis and security information tracking
const productionLogFormat = format.combine(
    format.timestamp(),
    format.json()
);

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: productionLogFormat,
    defaultMeta: { service: 'mablework-core-backend' },
    transports: [
        // 1. Write all system exceptions and error traces to an isolated error log file
        new transports.DailyRotateFile({
            filename: path.join(LOG_DIRECTORY, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error'
        }),
        // 2. Track all systemic flow markers and operational updates in a combined log file
        new transports.DailyRotateFile({
            filename: path.join(LOG_DIRECTORY, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '14d'
        })
    ]
});

// Stream console outputs during development or if explicitly forced via configurations
if (process.env.NODE_ENV !== 'production' || process.env.FORCE_CONSOLE_LOGS === 'true') {
    logger.add(new transports.Console({
        format: consoleLogFormat
    }));
}

module.exports = logger;
