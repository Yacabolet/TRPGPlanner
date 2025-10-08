// === FORM PERSISTENCE ===

function setupFormPersistence() {
    document.addEventListener('input', saveFormData);
    document.addEventListener('change', saveFormData);
    window.addEventListener('beforeunload', saveCurrentPage);
}

function saveFormData() {
    // IMPORTANT: Read existing data first to preserve character selections
    let formData = {};
    try {
        const savedData = localStorage.getItem('dnd_form_data');
        if (savedData) {
            formData = JSON.parse(savedData);
        }
    } catch (e) {
        console.warn('Could not read existing form data:', e);
    }
    
    const form = document.getElementById('recruitmentForm');
    
    // Save text inputs and textareas
    form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
        if (input.name && input.value) formData[input.name] = input.value;
    });
    
    // Save timezone search
    const timezoneSearch = document.getElementById('timezoneSearch');
    if (timezoneSearch?.value) formData.timezoneSearch = timezoneSearch.value;
    
    // Save radio buttons
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        if (radio.name) formData[radio.name] = radio.value;
    });
    
    // Save checkboxes (but preserve preferredCharacters which is handled separately)
    const checkboxGroups = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        // Skip character checkboxes - they're handled by saveCharacterSelection()
        if (checkbox.name === 'preferredCharacters') return;
        
        if (checkbox.name) {
            if (!checkboxGroups[checkbox.name]) checkboxGroups[checkbox.name] = [];
            checkboxGroups[checkbox.name].push(checkbox.value);
        }
    });
    Object.assign(formData, checkboxGroups);
    
    // Save select dropdowns
    form.querySelectorAll('select').forEach(select => {
        if (select.name && select.value) formData[select.name] = select.value;
    });
    
    try {
        localStorage.setItem('dnd_form_data', JSON.stringify(formData));
        localStorage.setItem('dnd_form_timestamp', Date.now().toString());
    } catch (e) {
        console.warn('Could not save form data:', e);
    }
}

function saveCurrentPage() {
    try {
        localStorage.setItem('dnd_current_page', currentPage.toString());
        localStorage.setItem('dnd_show_character_browse', showCharacterBrowse.toString());
        localStorage.setItem('dnd_total_pages', totalPages.toString());
    } catch (e) {
        console.warn('Could not save page progress:', e);
    }
}

function loadSavedProgress() {
    try {
        const timestamp = localStorage.getItem('dnd_form_timestamp');
        // Clear data older than 7 days
        if (!timestamp || (Date.now() - parseInt(timestamp)) > 7 * 24 * 60 * 60 * 1000) {
            clearSavedData();
            return;
        }
        
        const savedData = localStorage.getItem('dnd_form_data');
        if (savedData) restoreFormData(JSON.parse(savedData));
        
        const savedPage = localStorage.getItem('dnd_current_page');
        if (savedPage) currentPage = parseInt(savedPage);
        
        const savedShowCharBrowse = localStorage.getItem('dnd_show_character_browse');
        if (savedShowCharBrowse) showCharacterBrowse = savedShowCharBrowse === 'true';
        
        const savedTotalPages = localStorage.getItem('dnd_total_pages');
        if (savedTotalPages) totalPages = parseInt(savedTotalPages);
        
    } catch (e) {
        console.warn('Could not load saved form data:', e);
        clearSavedData();
    }
}

function restoreFormData(formData) {
    const form = document.getElementById('recruitmentForm');
    
    // Restore text inputs and textareas
    Object.keys(formData).forEach(name => {
        const input = form.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
        if (input && typeof formData[name] === 'string') input.value = formData[name];
    });
    
    // Restore radio buttons
    Object.keys(formData).forEach(name => {
        const radio = form.querySelector(`input[type="radio"][name="${name}"][value="${formData[name]}"]`);
        if (radio) {
            radio.checked = true;
            updateRadioSelections(name);
        }
    });
    
    // Restore checkboxes
    Object.keys(formData).forEach(name => {
        if (Array.isArray(formData[name])) {
            formData[name].forEach(value => {
                const checkbox = form.querySelector(`input[type="checkbox"][name="${name}"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    updateCheckboxSelection(checkbox.closest('.checkbox-option'));
                }
            });
        }
    });
    
    // Restore select dropdowns
    Object.keys(formData).forEach(name => {
        const select = form.querySelector(`select[name="${name}"]`);
        if (select && typeof formData[name] === 'string') select.value = formData[name];
    });
    
    // Restore timezone
    if (formData.timezone) {
        const timezoneSelect = document.getElementById('timezoneOverride');
        if (timezoneSelect) {
            timezoneSelect.value = formData.timezone;
            displayTimeslots();
        }
    }
    
    if (formData.timezoneSearch) {
        const timezoneSearch = document.getElementById('timezoneSearch');
        if (timezoneSearch) timezoneSearch.value = formData.timezoneSearch;
    }
    
    // Check character browse after restoring
    setTimeout(() => {
        if (document.querySelector('input[name="characterCreation"]:checked')) {
            checkCharacterBrowseNeeded();
        }
    }, 100);
}

function clearSavedData() {
    try {
        localStorage.removeItem('dnd_form_data');
        localStorage.removeItem('dnd_current_page');
        localStorage.removeItem('dnd_form_timestamp');
        localStorage.removeItem('dnd_show_character_browse');
        localStorage.removeItem('dnd_total_pages');
    } catch (e) {
        console.warn('Could not clear saved data:', e);
    }
}

// Expose clear function for debugging
window.clearFormData = clearSavedData;