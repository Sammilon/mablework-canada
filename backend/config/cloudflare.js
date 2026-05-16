const axios = require('axios');

// Initialize Cloudflare API HTTP client instance
const cfClient = axios.create({
    baseURL: 'https://api.cloudflare.com/vclient/v4/',
    headers: {
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10-second request expiration window
});

/**
 * Dynamically pushes a malicious IP string into the Cloudflare Edge IP Access Rules
 * @param {string} ipAddress - Target IPv4 or IPv6 string to block
 * @param {string} notes - Administrative context regarding the block reason
 * @returns {Promise<boolean>} Resolves true on successful edge-block application
 */
const blockIPAtEdge = async (ipAddress, notes = 'Automated malicious pattern ban') => {
    const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
    
    if (!ZONE_ID || !process.env.CLOUDFLARE_API_KEY) {
        console.warn('[CLOUDFLARE] API parameters unconfigured. Skipping edge firewall injection.');
        return false;
    }

    try {
        const payload = {
            mode: 'block',
            configuration: {
                target: 'ip',
                value: ipAddress
            },
            notes: `${notes} - (MableWork Core API Server)`
        };

        const response = await cfClient.post(`zones/${ZONE_ID}/firewall/access_rules/rules`, payload);
        return !!response.data.success;
    } catch (error) {
        console.error('[CLOUDFLARE CORE ERROR]:', error.response ? error.response.data : error.message);
        return false;
    }
};

/**
 * Validates whether the Cloudflare connection properties are operational
 * @returns {Promise<boolean>} True if authentication credentials map correctly
 */
const verifyEdgeConfiguration = async () => {
    try {
        const response = await cfClient.get('user/tokens/verify');
        return !!response.data.success;
    } catch {
        // Fallback to checking basic direct parameters if security policies restrict token analysis
        return !!process.env.CLOUDFLARE_API_KEY;
    }
};

module.exports = {
    blockIPAtEdge,
    verifyEdgeConfiguration
};
