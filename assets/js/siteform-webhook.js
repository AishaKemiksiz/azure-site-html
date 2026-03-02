/**
 * Contact Form Webhook Handler
 * Sends form data to n8n webhook endpoint
 */

(function() {
    'use strict';

    // Only run if contact form exists on the page
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        return;
    }

    // Webhook endpoint
    const WEBHOOK_URL = 'https://n8n.aishakemiksiz.com/webhook/siteform';
    const REQUEST_TIMEOUT = 12000; // 12 seconds

    // Get form elements
    const nameInput = document.getElementById('name');
    const contactInput = document.getElementById('contact');
    const messageInput = document.getElementById('message');
    const consentCheckbox = document.getElementById('privacyConsent');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const contactError = document.getElementById('contactError');
    
    // Create status container if it doesn't exist
    let statusContainer = document.getElementById('formStatus');
    if (!statusContainer) {
        statusContainer = document.createElement('div');
        statusContainer.id = 'formStatus';
        statusContainer.style.marginTop = '15px';
        statusContainer.style.textAlign = 'center';
        submitButton.parentElement.appendChild(statusContainer);
    }

    /**
     * Show status message
     */
    function showStatus(message, isError) {
        statusContainer.textContent = message;
        statusContainer.style.color = isError ? '#dc3545' : '#28a745';
        statusContainer.style.fontWeight = '500';
        statusContainer.style.display = 'block';
    }

    /**
     * Clear status message
     */
    function clearStatus() {
        statusContainer.textContent = '';
        statusContainer.style.display = 'none';
    }

    /**
     * Set form loading state
     */
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        if (isLoading) {
            submitButton.textContent = 'Sending…';
            submitButton.style.opacity = '0.7';
            submitButton.style.cursor = 'not-allowed';
        } else {
            submitButton.textContent = 'Send a message';
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        }
    }

    /**
     * Validate email format
     */
    function isValidEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    /**
     * Validate phone number format
     * Allow leading "+", digits, spaces, hyphens, parentheses
     * After stripping non-digits, require >= 7 digits
     */
    function isValidPhone(value) {
        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, '');
        // Check if we have at least 7 digits
        return digitsOnly.length >= 7;
    }

    /**
     * Validate contact field (email OR phone)
     */
    function validateContact(value) {
        const trimmed = value.trim();
        if (!trimmed) {
            return { valid: false, message: 'Contact information is required.' };
        }
        if (isValidEmail(trimmed)) {
            return { valid: true, message: '', type: 'email' };
        }
        if (isValidPhone(trimmed)) {
            return { valid: true, message: '', type: 'phone' };
        }
        return { valid: false, message: 'Please enter a valid email address or phone number.' };
    }

    /**
     * Show field error
     */
    function showFieldError(input, errorElement, message) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear field error
     */
    function clearFieldError(input, errorElement) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    /**
     * Clear form fields
     */
    function clearForm() {
        nameInput.value = '';
        contactInput.value = '';
        messageInput.value = '';
        clearFieldError(contactInput, contactError);
        if (consentCheckbox) {
            consentCheckbox.checked = false;
        }
    }

    /**
     * Get timezone
     */
    function getTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            return null;
        }
    }

    // Validate contact field on blur
    if (contactInput && contactError) {
        contactInput.addEventListener('blur', function() {
            const value = contactInput.value.trim();
            if (value) {
                const validation = validateContact(value);
                if (!validation.valid) {
                    showFieldError(contactInput, contactError, validation.message);
                } else {
                    clearFieldError(contactInput, contactError);
                }
            } else {
                clearFieldError(contactInput, contactError);
            }
        });

        // Clear error on input
        contactInput.addEventListener('input', function() {
            if (contactInput.classList.contains('error')) {
                const value = contactInput.value.trim();
                if (value) {
                    const validation = validateContact(value);
                    if (validation.valid) {
                        clearFieldError(contactInput, contactError);
                    }
                }
            }
        });
    }

    /**
     * Handle form submission
     */
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous status
        clearStatus();

        // Get form values
        const name = nameInput.value.trim();
        const contact = contactInput ? contactInput.value.trim() : '';
        const message = messageInput.value.trim();
        const consent = consentCheckbox ? consentCheckbox.checked : false;

        // Basic validation
        if (!name || !contact || !message) {
            showStatus('Please fill in all fields.', true);
            if (!contact && contactInput) {
                showFieldError(contactInput, contactError, 'Contact information is required.');
            }
            return;
        }

        // Consent validation
        if (!consent) {
            showStatus('Please accept the Privacy Policy to continue.', true);
            if (consentCheckbox) {
                consentCheckbox.focus();
            }
            return;
        }

        // Contact validation (email OR phone)
        const contactValidation = validateContact(contact);
        if (!contactValidation.valid) {
            showFieldError(contactInput, contactError, contactValidation.message);
            contactInput.focus();
            return;
        }
        clearFieldError(contactInput, contactError);

        // Prepare payload
        const payload = {
            name: name,
            contact: contact,
            contactType: contactValidation.type || 'unknown',
            message: message,
            privacyConsent: consent,
            page: window.location.href,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: getTimezone(),
            ts: new Date().toISOString(),
            source: 'azuretower_contact_form'
        };

        // Set loading state
        setLoading(true);

        // Create AbortController for timeout
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => {
            abortController.abort();
        }, REQUEST_TIMEOUT);

        try {
            // Send request
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload),
                signal: abortController.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                // Success
                clearForm();
                showStatus('Thank you! We\'ll contact you soon.', false);
            } else {
                // Server error
                showStatus('Something went wrong. Please try again.', true);
            }
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                showStatus('Request timed out. Please try again.', true);
            } else {
                // Network or other error
                showStatus('Something went wrong. Please try again.', true);
            }
        } finally {
            // Reset loading state
            setLoading(false);
        }
    });
})();
