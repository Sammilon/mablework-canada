const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    console.warn('[PAYMENT WARNING] STRIPE_SECRET_KEY is currently unconfigured in system environment variables. Financial processing workflows will run in mock mode.');
}

// Initialize the Stripe instance with standard configuration parameters
const stripe = new Stripe(STRIPE_SECRET_KEY || 'mock_secret_key_for_local_stubbing', {
    apiVersion: '2023-10-16', // Locked to ensure api structural parity across version changes
    timeout: 15000,           // Drop out hanging network requests after 15 seconds
    maxNetworkRetries: 2      // Automatically retry idempotent requests on transient network drops
});

/**
 * Validates Stripe webhook payload signatures to guarantee events originated directly from Stripe
 * @param {Buffer|string} rawBody - Raw unparsed HTTP request body buffer from the incoming stream
 * @param {string} signatureHeader - The Stripe-Signature header string passed from the request
 * @returns {Object|null} Parsed Stripe Event object, or throws an exception on verification failure
 */
const verifyWebhookSignature = (rawBody, signatureHeader) => {
    const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
        throw new Error('Verification failed: Missing upstream stripe webhook signature parameters.');
    }

    return stripe.webhooks.constructEvent(rawBody, signatureHeader, WEBHOOK_SECRET);
};

module.exports = {
    stripe,
    verifyWebhookSignature
};
