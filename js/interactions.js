// === INTERACTIVE ELEMENTS ===

function setupInteractivity() {
    document.addEventListener('click', function(e) {
        // Handle radio and checkbox option clicks
        const option = e.target.closest('.radio-option, .checkbox-option');
        if (option && e.target.type !== 'radio' && e.target.type !== 'checkbox') {
            e.preventDefault();
            const input = option.querySelector('input[type="radio"], input[type="checkbox"]');
            if (input.type === 'radio') {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
                updateRadioSelections(input.name);
            } else {
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change'));
                updateCheckboxSelection(option);
            }
            return false;
        }
        
        // Handle rating label clicks
        const ratingLabel = e.target.closest('.rating-inputs label');
        if (ratingLabel && e.target.type !== 'radio') {
            e.preventDefault();
            const input = ratingLabel.querySelector('input[type="radio"]');
            if (input) {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
                updateRadioSelections(input.name);
            }
            return false;
        }
    });
    
    // Handle input change events
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            updateRadioSelections(e.target.name);
            
            // Special handling for character creation changes
            if (e.target.name === 'characterCreation') {
                checkCharacterBrowseNeeded();
                updateProgress();
            }
        } else if (e.target.type === 'checkbox') {
            updateCheckboxSelection(e.target.closest('.checkbox-option'));
        }
    });
}

function updateRadioSelections(groupName) {
    // Skip timeslot groups - they handle their own visual state
    if (groupName.startsWith('timeslot_')) return;
    
    // Remove selected class from all options in this group
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
        const option = radio.closest('.radio-option');
        if (option) option.classList.remove('selected');
        const ratingLabel = radio.closest('.rating-inputs label');
        if (ratingLabel) ratingLabel.classList.remove('selected');
    });
    
    // Add selected class to checked option
    const checkedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
    if (checkedRadio) {
        const option = checkedRadio.closest('.radio-option');
        if (option) option.classList.add('selected');
        const ratingLabel = checkedRadio.closest('.rating-inputs label');
        if (ratingLabel) ratingLabel.classList.add('selected');
    }
}

function updateCheckboxSelection(option) {
    if (!option) return;
    const checkbox = option.querySelector('input[type="checkbox"]');
    if (checkbox?.checked) {
        option.classList.add('selected');
    } else {
        option.classList.remove('selected');
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Enter key to continue (but not when typing in text fields)
        if (e.key === 'Enter' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn.style.display !== 'none' && !continueBtn.disabled) {
                continueBtn.click();
            }
        }
    });
}