// === VALIDATION ===

function validateCurrentPage() {
    const currentPageEl = document.getElementById(`page${currentPage}`);
    const requiredFields = currentPageEl.querySelectorAll('[required]');
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    let isValid = true;
    let firstError = null;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = currentPageEl.querySelectorAll(`input[name="${field.name}"]`);
            const checked = Array.from(radioGroup).some(radio => radio.checked);
            
            if (!checked) {
                isValid = false;
                if (!firstError) firstError = field.closest('.form-group');
                
                const formGroup = field.closest('.form-group');
                if (!formGroup.querySelector('.error-message')) {
                    const error = document.createElement('div');
                    error.className = 'error-message';
                    error.textContent = 'This field is required.';
                    formGroup.appendChild(error);
                }
            }
        } else if (!field.value.trim()) {
            isValid = false;
            if (!firstError) firstError = field;
            
            const formGroup = field.closest('.form-group');
            if (!formGroup.querySelector('.error-message')) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = 'This field is required.';
                formGroup.appendChild(error);
            }
        }
    });
    
    if (!isValid && firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

function checkAvailability() {
    const timeslots = document.querySelectorAll('input[name^="timeslot_"]:checked');
    let hasAvailability = false;
    let availableCount = 0;
    
    timeslots.forEach(slot => {
        if (['preferred', 'possible', 'possible_earlier', 'possible_later'].includes(slot.value)) {
            hasAvailability = true;
            availableCount++;
        }
    });
    
    console.log('Availability check:', availableCount, 'slots available');
    return { hasAvailability, availableCount };
}

function updateDoubleSessionQuestion() {
    const { availableCount } = checkAvailability();
    const doubleSessionGroup = document.getElementById('doubleSessionGroup');
    
    if (doubleSessionGroup) {
        doubleSessionGroup.style.display = availableCount >= 2 ? 'block' : 'none';
    }
}