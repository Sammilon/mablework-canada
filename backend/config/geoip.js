const geoip = require('geoip-lite');

/**
 * Evaluates an inbound IP address to find its geographic country of origin
 * @param {string} ipAddress - The raw client IPv4 or IPv6 string extracted from the request
 * @returns {string|null} The ISO 3166-1 alpha-2 country code (e.g., 'CA') or null if untraceable
 */
const lookupCountryCode = (ipAddress) => {
    // Return early if the IP string is missing or malformed
    if (!ipAddress) return null;

    // Normalize local loopback addresses for development and internal testing
    let cleanIP = ipAddress.trim();
    if (cleanIP === '::1' || cleanIP === '127.0.0.1' || cleanIP.startsWith('::ffff:127.0.0.1')) {
        // Default to Canada ('CA') in local environments to prevent developer lockout
        return process.env.NODE_ENV === 'production' ? null : 'CA';
    }

    // Strip IPv6 transition mapping prefixes if present (e.g., "::ffff:192.0.2.1" -> "192.0.2.1")
    if (cleanIP.startsWith('::ffff:')) {
        cleanIP = cleanIP.replace('::ffff:', '');
    }

    try {
        const geoRecord = geoip.lookup(cleanIP);
        
        // Return the uppercase 2-character country code if a match is found
        return geoRecord && geoRecord.country ? geoRecord.country.toUpperCase() : null;
    } catch (error) {
        console.error(`[GEOIP LOOKUP EXCEPTION] Failed parsing address ${cleanIP}:`, error.message);
        return null;
    }
};

module.exports = {
    lookupCountryCode
};
