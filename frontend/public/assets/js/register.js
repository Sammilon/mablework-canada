/**
 * MableWork Identity Registration & Account Onboarding Manager
 * Coordinates account-type interface toggles, real-time field validation metrics,
 * and standard submission protocols to the API profile endpoints.
 */

const RegistrationPipelineController = {
    selectedAccountRoleType: "STUDENT", // Default profile context track

    /**
     * Binds structural listeners to role selectors, security inputs, and registration forms
     */
    initializeRegistrationWorkspace: function() {
        console.log("Onboarding verification system connected to interface.");
        this.bindRoleSelectionToggleHooks();
        this.bindRealtimeSecurityComplexityMetrics();
        this.bindFormSubmissionIntercept();
    },

    /**
     * Coordinates the layout transformations when switching between Student and Employer registration modes
     */
    bindRoleSelectionToggleHooks: function() {
        const studentSelectorBtn = document.getElementById("roleSelectBtnStudent");
        const employerSelectorBtn = document.getElementById("roleSelectBtnEmployer");
        const corporateInputsSection = document.getElementById("employerCorporateFieldsBlock");
        const registrationRoleHiddenInput = document.getElementById("userRegistrationRoleHiddenField");

        if (!studentSelectorBtn || !employerSelectorBtn) return;

        studentSelectorBtn.addEventListener("click", () => {
            this.selectedAccountRoleType = "STUDENT";
            studentSelectorBtn.classList.add("active-role-tab");
            employerSelectorBtn.classList.remove("active-role-tab");
            if (registrationRoleHiddenInput) registrationRoleHiddenInput.value = "STUDENT";
            
            if (corporateInputsSection) {
                corporateInputsSection.style.display = "none";
                this.toggleFieldRequiredAttributes(corporateInputsSection, false);
            }
        });

        employerSelectorBtn.addEventListener("click", () => {
            this.selectedAccountRoleType = "EMPLOYER";
            employerSelectorBtn.classList.add("active-role-tab");
            studentSelectorBtn.classList.remove("active-role-tab");
            if (registrationRoleHiddenInput) registrationRoleHiddenInput.value = "EMPLOYER";
            
            if (corporateInputsSection) {
                corporateInputsSection.style.display = "block";
                this.toggleFieldRequiredAttributes(corporateInputsSection, true);
            }
        });
    },

    /**
     * Dynamically toggles standard HTML validation attributes based on the selected registration route
     */
    toggleFieldRequiredAttributes: function(parentContainerNode, setAsRequired = false) {
        const structuralInputs = parentContainerNode.querySelectorAll("input, select");
        structuralInputs.forEach(inputNode => {
            if (setAsRequired) {
                inputNode.setAttribute("required", "required");
            } else {
                inputNode.removeAttribute("required");
            }
        });
    },

    /**
     * Evaluates password complexity criteria in real time to enforce security compliance
     */
    bindRealtimeSecurityComplexityMetrics: function() {
        const targetPasswordField = document.getElementById("registrationPasswordField");
        const indicatorMeterNode = document.getElementById("passwordStrengthComplexityMeter");

        if (!targetPasswordField || !indicatorMeterNode) return;

        targetPasswordField.addEventListener("input", (e) => {
            const proposedPasswordValue = e.target.value;
            let trackingStrengthScore = 0;

            if (proposedPasswordValue.length >= 8) trackingStrengthScore++;
            if (/[A-Z]/.test(proposedPasswordValue)) trackingStrengthScore++;
            if (/[0-9]/.test(proposedPasswordValue)) trackingStrengthScore++;
            if (/[^A-Za-z0-9]/.test(proposedPasswordValue)) trackingStrengthScore++;

            // Update safety meter colors and labels dynamically
            if (proposedPasswordValue.length === 0) {
                indicatorMeterNode.className = "strength-meter-label";
                indicatorMeterNode.innerText = "";
            } else if (trackingStrengthScore <= 2) {
                indicatorMeterNode.className = "strength-meter-label strength-weak";
                indicatorMeterNode.innerText = "Weak Security Threshold (Add symbols/numbers)";
            } else if (trackingStrengthScore === 3) {
                indicatorMeterNode.className = "strength-meter-label strength-medium";
                indicatorMeterNode.innerText = "Medium Complexity Verified";
            } else {
                indicatorMeterNode.className = "strength-meter-label strength-strong";
                indicatorMeterNode.innerText = "Strong Cryptographic Password Match";
            }
        });
    },

    /**
     * Intercepts standard form submissions to handle credential grouping and asynchronous delivery
     */
    bindFormSubmissionIntercept: function() {
        const mainRegistrationForm = document.getElementById("mableCoreRegistrationFormAnchor");
        if (!mainRegistrationForm) return;

        mainRegistrationForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const enteredPassword = document.getElementById("registrationPasswordField").value;
            const confirmedPassword = document.getElementById("registrationConfirmPasswordField").value;

            if (enteredPassword !== confirmedPassword) {
                this.dispatchRegistrationAlertBox("Password mismatch error. Verify entry metrics match perfectly.", true);
                return;
            }

            this.dispatchRegistrationAlertBox("Assembling platform security profiles... Initializing onboarding sequence.");

            // Gather elements into a standard object payload structure
            const formSubmissionPayload = new FormData(mainRegistrationForm);
            console.log(`Dispatched account pipeline registration payload context as: ${this.selectedAccountRoleType}`);

            // Simulate server network roundtrip delay
            setTimeout(() => {
                this.dispatchRegistrationAlertBox("Account profile established successfully! Redirecting to verification portal context...");
                setTimeout(() => {
                    window.location.href = "login.html?registration_status=complete";
                }, 1000);
            }, 1800);
        });
    },

    /**
     * Displays real-time operational status updates directly within the registration view context
     */
    dispatchRegistrationAlertBox: function(alertMessageText, isFaultState = false) {
        const feedbackContainer = document.getElementById("registrationActionAlertFeedback");
        if (feedbackContainer) {
            feedbackContainer.className = "alert-box-container animate-toast-arrival " + 
                (isFaultState ? "alert-danger-state" : "alert-success-state");
            feedbackContainer.innerHTML = `<i class="fa-solid ${isFaultState ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> <span>${alertMessageText}</span>`;
            
            if (isFaultState) {
                setTimeout(() => {
                    feedbackContainer.className = "alert-box-container hidden-alert";
                }, 5000);
            }
        } else {
            alert(alertMessageText);
        }
    }
};

// Initialize entry processing hooks on window load
document.addEventListener("DOMContentLoaded", function() {
    RegistrationPipelineController.initializeRegistrationWorkspace();
});
