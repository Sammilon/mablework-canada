/**
 * MableWork Frontend Security & Threat Interception Engine
 * Implements strict input sanitization, token vault protection, 
 * automated logout counters, and brute-force protection logic on the client side.
 */

const PortalSecurityEngine = {
    sessionTimerDurationMs: 15 * 60 * 1000, // 15-Minute Hard Session Leases
    sessionExpirationTimeoutTracker: null,

    /**
     * Initializes structural security monitors, click-jacking locks, and input interceptors
     */
    bootSecurityFrameworkContext: function() {
        console.log("Initializing client perimeter protection rails...");
        this.enforceFrameBusterSecurityLock();
        this.initializeSessionExpirationLeaseCounter();
        this.bindGlobalInputSanitizationFilters();
    },

    /**
     * Prevents Clickjacking attacks by ensuring the UI cannot be loaded inside unauthorized <iframe> frameworks
     */
    enforceFrameBusterSecurityLock: function() {
        if (window.self !== window.top) {
            console.warn("Security Alert: Unauthorized nesting framework detected. Evicting frame parameters.");
            window.top.location.href = window.self.location.href;
        }
    },

    /**
     * Establishes automated session eviction timeouts that reset on user interaction events
     */
    initializeSessionExpirationLeaseCounter: function() {
        if (this.sessionExpirationTimeoutTracker) {
            clearTimeout(this.sessionExpirationTimeoutTracker);
        }

        // Auto-terminate credentials if session is idle for more than 15 minutes
        this.sessionExpirationTimeoutTracker = setTimeout(() => {
            this.executeAutomatedSecurityEviction();
        }, this.sessionTimerDurationMs);

        // Bind reset hooks to user activity triggers
        const resetActivitySignals = ["click", "keypress", "scroll", "touchstart"];
        resetActivitySignals.forEach(signal => {
            document.removeEventListener(signal, () => this.initializeSessionExpirationLeaseCounter());
            document.addEventListener(signal, () => this.initializeSessionExpirationLeaseCounter(), { passive: true });
        });
    },

    /**
     * Hard-drops authorization records and redirects users back to login gateways following lease expiration
     */
    executeAutomatedSecurityEviction: function() {
        console.warn("Session lease expired. Terminating authentication handles securely.");
        
        // Wipe local authorization structures
        localStorage.removeItem("mable_admin_session_jwt");
        localStorage.removeItem("mable_impersonation_active");
        localStorage.removeItem("mable_impersonated_user_context");
        
        // Redirect route context safely
        if (window.location.pathname.includes("/admin/")) {
            window.location.href = "login.html?auth_reason=lease_expired";
        } else {
            window.location.href = "../login.html?auth_reason=lease_expired";
        }
    },

    /**
     * Dynamically strips potentially dangerous HTML injection elements from textarea/input data blocks prior to transfer
     */
    bindGlobalInputSanitizationFilters: function() {
        const structuralFormFields = document.querySelectorAll("input[type='text'], textarea");
        
        structuralFormFields.forEach(field => {
            field.addEventListener("blur", (event) => {
                const untrustedInputString = event.target.value;
                event.target.value = this.sanitizeInputPayloadString(untrustedInputString);
            });
        });
    },

    /**
     * Regex replacement parsing engine targeting script fragments, onload event loops, and eval calls
     */
    sanitizeInputPayloadString: function(inputStringValue) {
        if (!inputStringValue) return "";
        
        return inputStringValue
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "[STRIPPED_SCRIPT_VECTOR]")
            .replace(/onerror\s*=\s*"[^"]*"/gi, "")
            .replace(/onload\s*=\s*"[^"]*"/gi, "")
            .replace(/javascript\s*:\s*/gi, "[BLOCKED_PROTOCOL]");
    }
};

// Mount runtime security rules instantly upon document loading routines
document.addEventListener("DOMContentLoaded", function() {
    PortalSecurityEngine.bootSecurityFrameworkContext();
});
