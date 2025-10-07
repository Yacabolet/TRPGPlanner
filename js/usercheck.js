// === USER CHECKING ===

function setupUserCheck() {
    const discordInput = document.getElementById('discordUsername');
    let checkTimeout;
    
    discordInput.addEventListener('input', function() {
        clearTimeout(checkTimeout);
        const statusDiv = document.getElementById('userCheckStatus');
        statusDiv.style.display = 'none';
        
        checkTimeout = setTimeout(() => {
            if (this.value.trim().length > 2) checkExistingUser(this.value.trim());
        }, 1000);
    });
    
    discordInput.addEventListener('blur', function() {
        if (this.value.trim().length > 2) {
            clearTimeout(checkTimeout);
            checkExistingUser(this.value.trim());
        }
    });
}

function checkExistingUser(discordUsername) {
    const statusDiv = document.getElementById('userCheckStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<span style="color: #DAA520;">🔍 Checking for previous responses...</span>';
    
    fetch(`${GOOGLE_SCRIPT_URL}?discord=${encodeURIComponent(discordUsername)}`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response => response.json())
    .then(result => {
        if (result.found && result.data) {
            statusDiv.innerHTML = '<span style="color: #4CAF50;">✅ Previous responses found and loaded!</span>';
            loadExistingUserData(result.data);
        } else {
            statusDiv.innerHTML = '<span style="color: #666;">ℹ️ New user - no previous responses found.</span>';
            setTimeout(() => statusDiv.style.display = 'none', 3000);
        }
    })
    .catch(error => {
        console.warn('Error checking existing user:', error);
        statusDiv.innerHTML = '<span style="color: #ff6b6b;">⚠️ Unable to check for previous responses.</span>';
        setTimeout(() => statusDiv.style.display = 'none', 5000);
    });
}

function loadExistingUserData(userData) {
    const form = document.getElementById('recruitmentForm');
    clearSavedData();
    
    // Load text inputs
    Object.keys(userData).forEach(name => {
        const input = form.querySelector(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
        if (input && typeof userData[name] === 'string' && userData[name].trim()) {
            input.value = userData[name];
        }
    });
    
    // Load radio buttons
    Object.keys(userData).forEach(name => {
        if (typeof userData[name] === 'string' && userData[name].trim()) {
            const radio = form.querySelector(`input[type="radio"][name="${name}"][value="${userData[name]}"]`);
            if (radio) {
                radio.checked = true;
                updateRadioSelections(name);
            }
        }
    });
    
    // Load checkboxes
    Object.keys(userData).forEach(name => {
        if (Array.isArray(userData[name]) && userData[name].length > 0) {
            // Clear existing selections
            form.querySelectorAll(`input[type="checkbox"][name="${name}"]`).forEach(cb => {
                cb.checked = false;
                const option = cb.closest('.checkbox-option');
                if (option) option.classList.remove('selected');
            });
            
            // Set new selections
            userData[name].forEach(value => {
                const checkbox = form.querySelector(`input[type="checkbox"][name="${name}"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    updateCheckboxSelection(checkbox.closest('.checkbox-option'));
                }
            });
        }
    });
    
    // Load timezone and timeslots
    if (userData.timezone) {
        const timezoneSelect = document.getElementById('timezoneOverride');
        if (timezoneSelect) {
            timezoneSelect.value = userData.timezone;
            
            setTimeout(() => {
                displayTimeslots();
                setTimeout(() => {
                    for (let i = 0; i <= 6; i++) {
                        const timeslotValue = userData[`timeslot_${i}`];
                        if (timeslotValue && timeslotValue !== 'unavailable') {
                            const radio = document.querySelector(`input[name="timeslot_${i}"][value="${timeslotValue}"]`);
                            if (radio) {
                                radio.checked = true;
                                const timeslotDiv = radio.closest('.timeslot-item');
                                if (timeslotDiv) {
                                    timeslotDiv.querySelectorAll('label[data-value]').forEach(l => l.classList.remove('selected'));
                                    const selectedLabel = radio.closest('label[data-value]');
                                    if (selectedLabel) selectedLabel.classList.add('selected');
                                }
                            }
                        }
                    }
                }, 200);
            }, 300);
        }
    }
    
    // Load character creation preference
    setTimeout(() => {
        if (userData.characterCreation) {
            const charRadio = form.querySelector(`input[name="characterCreation"][value="${userData.characterCreation}"]`);
            if (charRadio) {
                charRadio.checked = true;
                updateRadioSelections('characterCreation');
                checkCharacterBrowseNeeded();
            }
        }
    }, 400);
    
    // Save loaded data
    setTimeout(() => saveFormData(), 600);
}