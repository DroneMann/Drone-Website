/**
 * New Perspective Drone Photography - Form Validation and Submission
 * Created: June 2025
 * 
 * This script handles:
 * 1. Form validation for the contact form
 * 2. Email submission using FormSubmit.co
 * 3. User experience enhancements
 */

// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    // Get the contact form element
    const contactForm = document.getElementById('contact-form');
    
    // Set up form action for FormSubmit.co
    contactForm.setAttribute('action', 'https://formsubmit.co/newperspectivedronephotography@gmail.com');
    contactForm.setAttribute('method', 'POST');
    
    // Add hidden fields for FormSubmit configuration
    const formSubmitConfig = [
        { name: '_subject', value: 'New Drone Photography Request' },
        { name: '_captcha', value: 'true' },
        { name: '_template', value: 'table' },
        { name: '_next', value: window.location.href + '?submission=success' }
    ];
    
    formSubmitConfig.forEach(config => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = config.name;
        hiddenField.value = config.value;
        contactForm.appendChild(hiddenField);
    });
    
    // Initialize date picker for the date field
    initializeDatePicker();
    
    // Set up form validation
    setupFormValidation();
    
    // Check for success message in URL (after form submission)
    checkForSuccessMessage();
});

/**
 * Initialize the date picker for the preferred shoot date field
 */
function initializeDatePicker() {
    const dateField = document.getElementById('date');
    
    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateField.setAttribute('min', formattedDate);
    
    // Add event listener for date changes
    dateField.addEventListener('change', () => {
        validateField(dateField);
    });
}

/**
 * Set up form validation for all fields
 */
function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('.submit-button');
    
    // Get all form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const addressField = document.getElementById('address');
    const dateField = document.getElementById('date');
    
    // Add real-time validation as users type
    const fields = [nameField, emailField, phoneField, addressField, dateField];
    fields.forEach(field => {
        field.addEventListener('input', () => {
            validateField(field);
            updateSubmitButtonState();
        });
        
        field.addEventListener('blur', () => {
            validateField(field);
            updateSubmitButtonState();
        });
    });
    
    // Form submission handler
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Validate all fields before submission
        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // If all validations pass, submit the form
        if (isValid) {
            contactForm.submit();
        }
    });
    
    // Initial validation check and button state
    updateSubmitButtonState();
}

/**
 * Validate a specific form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    // Clear previous error messages
    clearErrorForField(field);
    
    let isValid = true;
    const value = field.value.trim();
    
    // Check for required fields
    if (field.hasAttribute('required') && value === '') {
        showError(field, 'This field is required');
        isValid = false;
    } else {
        // Field-specific validations
        switch (field.id) {
            case 'email':
                // Email validation
                if (value !== '' && !isValidEmail(value)) {
                    showError(field, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
                
            case 'phone':
                // Phone validation (optional field)
                if (value !== '' && !isValidPhone(value)) {
                    showError(field, 'Please enter a valid phone number');
                    isValid = false;
                }
                break;
                
            case 'address':
                // Wisconsin address validation
                if (value !== '' && !isWisconsinAddress(value)) {
                    showError(field, 'Address must be in Wisconsin');
                    isValid = false;
                }
                break;
                
            case 'date':
                // Date validation
                if (value !== '') {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        showError(field, 'Please select a future date');
                        isValid = false;
                    }
                }
                break;
        }
    }
    
    // Update field styling based on validation
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    
    return isValid;
}

/**
 * Display an error message for a field
 * @param {HTMLElement} field - The field with an error
 * @param {string} message - The error message to display
 */
function showError(field, message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

/**
 * Clear error messages for a specific field
 * @param {HTMLElement} field - The field to clear errors for
 */
function clearErrorForField(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Update the submit button state based on form validity
 */
function updateSubmitButtonState() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('.submit-button');
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    let allFilled = true;
    requiredFields.forEach(field => {
        if (field.value.trim() === '') {
            allFilled = false;
        }
    });
    
    // Enable/disable submit button
    submitButton.disabled = !allFilled;
    
    // Update button styling
    if (allFilled) {
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    } else {
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
    }
}

/**
 * Check if the URL contains a success parameter and display a message
 */
function checkForSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submission') === 'success') {
        // Create success message
        const contactSection = document.getElementById('contact');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; text-align: center;">
                <h3 style="color: #155724;">Thank you for your submission!</h3>
                <p>We've received your request and will contact you shortly.</p>
            </div>
        `;
        
        // Insert at the top of the contact section
        const container = contactSection.querySelector('.container');
        container.insertBefore(successMessage, container.firstChild);
        
        // Scroll to the success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Remove the success parameter from the URL
        const url = new URL(window.location);
        url.searchParams.delete('submission');
        window.history.replaceState({}, '', url);
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
function isValidPhone(phone) {
    // Allow various formats: (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * Check if an address is in Wisconsin
 * @param {string} address - The address to check
 * @returns {boolean} - Whether the address is in Wisconsin
 */
function isWisconsinAddress(address) {
    // Check for Wisconsin or WI in the address
    const wisconsinRegex = /\b(wisconsin|wi)\b/i;
    return wisconsinRegex.test(address);
}

// Add CSS for form validation styling
const formStyles = document.createElement('style');
formStyles.textContent = `
    .form-group input.valid,
    .form-group textarea.valid {
        border-color: #28a745;
    }
    
    .form-group input.invalid,
    .form-group textarea.invalid {
        border-color: #ff6b6b;
    }
`;
document.head.appendChild(formStyles);