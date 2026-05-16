const nodemailer = require('nodemailer');

// Build connection options using strict transport security protocols
const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        // Enforce secure handshakes while preventing self-signed cert dropouts if hosting on custom boxes
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

/**
 * Dispatches a structured email payload via the configured SMTP transport gateway
 * @param {Object} options - Message parameters object
 * @param {string} options.to - Target recipient email address
 * @param {string} options.subject - Email subject header string
 * @param {string} options.text - Raw text fallback body content
 * @param {string} options.html - Main rich HTML body content
 * @returns {Promise<Object>} Delivery metrics detailing message tracking IDs
 */
const sendEmail = async ({ to, subject, text, html }) => {
    const FROM_ADDRESS = process.env.SMTP_FROM_EMAIL || '"MableWork Canada" <noreply@mablework.ca>';

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('[MAIL WARNING] SMTP credentials missing. Diverting message content to stdout.');
        console.log(`--- [EMULATED EMAIL] ---\nTo: ${to}\nSubject: ${subject}\nBody: ${text}\n------------------------`);
        return { messageId: 'emulated-transport-id-00000' };
    }

    const mailOptions = {
        from: FROM_ADDRESS,
        to,
        subject,
        text,
        html
    };

    try {
        const deliveryInfo = await transporter.sendMail(mailOptions);
        return deliveryInfo;
    } catch (error) {
        console.error(`[SMTP TRANSIT FAILURE] Failed dispatching message to ${to}:`, error.message);
        throw new Error('Upstream mail delivery gateway exception.');
    }
};

// Execute self-diagnostic parameter check on initial module execution
if (process.env.NODE_ENV === 'production') {
    transporter.verify((error) => {
        if (error) {
            console.error('[CRITICAL MAIL FAULT] SMTP handshakes failing against relay:', error.message);
        } else {
            console.log('[MAIL] SMTP transport connections successfully verified.');
        }
    });
}

module.exports = {
    sendEmail
};
