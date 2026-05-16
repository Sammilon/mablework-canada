const axios = require('axios');

/**
 * Validates reCAPTCHA v3 tokens against Google API servers
 * @param {string} token - The client-side token passed from the frontend form
 * @param {string} remoteIp - The client's IP address for geo-context auditing
 * @returns {Promise<Object>} Verification metrics containing success state and automation score
 */
const verifyCaptchaToken = async (token, remoteIp) => {
    // Fail closed if keys or tokens are missing
    if (!token) {
        return { success: false, score: 0, error: 'Missing token verification parameter.' };
    }

    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    if (!SECRET_KEY) {
        console.error('[CRITICAL] reCAPTCHA secret key is unconfigured in system environment variables.');
        return { success: false, score: 0, error: 'Server authentication configuration fault.' };
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: SECRET_KEY,
                    response: token,
                    remoteip: remoteIp
                }
            }
        );

        const { success, score, 'error-codes': errorCodes } = response.data;

        // Structure a uniform response payload for the verification middleware
        return {
            success: !!success,
            score: score !== undefined ? score : 0,
            error: errorCodes ? errorCodes.join(', ') : null
        };
    } catch (error) {
        console.error('reCAPTCHA Gateway Error:', error.message);
        return { success: false, score: 0, error: 'Upstream verification service timeout.' };
    }
};

module.exports = { verifyCaptchaToken };
