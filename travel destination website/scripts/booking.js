// Booking form functionality
document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const submitBtn = document.getElementById('submit-booking');

    let currentStep = 0;

    // Initialize date inputs with min date as today
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });

    // Show current step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });

        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index <= stepIndex);
            indicator.classList.toggle('completed', index < stepIndex);
        });

        currentStep = stepIndex;
    }

    // Next button handlers
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (validateCurrentStep()) {
                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                }
            }
        });
    });

    // Previous button handlers
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Form validation
    function validateCurrentStep() {
        const currentStepElement = steps[currentStep];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#f5576c';

                // Reset border color on input
                input.addEventListener('input', function () {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateCurrentStep()) {
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';

            // Simulate form submission
            setTimeout(() => {
                // Get form data
                const formData = new FormData(bookingForm);
                const data = Object.fromEntries(formData.entries());

                // Save to localStorage (in a real app, this would be sent to a server)
                localStorage.setItem('bookingData', JSON.stringify(data));

                // Show success message
                document.getElementById('booking-form-container').style.display = 'none';
                document.getElementById('success-message').style.display = 'block';

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                showNotification('Booking request submitted successfully!', 'success');
            }, 2000);
        });
    }

    // Calculate total price based on selections
    const travelerSelect = document.getElementById('travelers');
    const daysInput = document.getElementById('duration');
    const budgetSelect = document.getElementById('budget');

    function updateEstimate() {
        if (!travelerSelect || !daysInput || !budgetSelect) return;

        const travelers = parseInt(travelerSelect.value) || 1;
        const days = parseInt(daysInput.value) || 7;
        const budgetLevel = budgetSelect.value;

        let basePrice = 0;
        switch (budgetLevel) {
            case 'budget':
                basePrice = 500;
                break;
            case 'moderate':
                basePrice = 1000;
                break;
            case 'luxury':
                basePrice = 2500;
                break;
        }

        const estimate = basePrice * travelers * (days / 7);
        const estimateElement = document.getElementById('price-estimate');

        if (estimateElement) {
            estimateElement.textContent = `$${Math.round(estimate).toLocaleString()}`;
        }
    }

    if (travelerSelect) travelerSelect.addEventListener('change', updateEstimate);
    if (daysInput) daysInput.addEventListener('input', updateEstimate);
    if (budgetSelect) budgetSelect.addEventListener('change', updateEstimate);

    // Initialize
    showStep(0);
    updateEstimate();
});
