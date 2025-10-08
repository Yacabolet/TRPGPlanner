// === FORM SUBMISSION ===

function submitForm() {
    const continueBtn = document.getElementById('continueBtn');
    const originalText = continueBtn.textContent;
    continueBtn.textContent = 'Submitting...';
    continueBtn.disabled = true;
    
    try {
        const formData = collectFormData();
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(() => {
            showSuccessMessage();
            clearSavedData();
        })
        .catch(error => {
            console.error('Submission error:', error);
            showErrorMessage();
            continueBtn.textContent = originalText;
            continueBtn.disabled = false;
        });
    } catch (error) {
        console.error('Data collection error:', error);
        showErrorMessage();
        continueBtn.textContent = originalText;
        continueBtn.disabled = false;
    }
}

function collectFormData() {
    const form = document.getElementById('recruitmentForm');
    const data = {};
    
    // Collect text inputs
    form.querySelectorAll('input[type="text"], input[type="email"], textarea, select').forEach(input => {
        if (input.name && input.value.trim()) data[input.name] = input.value.trim();
    });
    
    // Collect radio buttons
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        if (radio.name) data[radio.name] = radio.value;
    });
    
    // Collect checkboxes
    const checkboxGroups = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.name) {
            if (!checkboxGroups[checkbox.name]) checkboxGroups[checkbox.name] = [];
            checkboxGroups[checkbox.name].push(checkbox.value);
        }
    });
    Object.assign(data, checkboxGroups);
    
    // IMPORTANT: Get character selections from localStorage since carousel only shows one at a time
    try {
        const savedData = localStorage.getItem('dnd_form_data');
        if (savedData) {
            const formData = JSON.parse(savedData);
            // Include character selections from localStorage if they exist
            if (formData.preferredCharacters && formData.preferredCharacters.length > 0) {
                data.preferredCharacters = formData.preferredCharacters;
            }
        }
    } catch (e) {
        console.warn('Could not retrieve character selections from localStorage:', e);
    }
    
    // Convert arrays to comma-separated strings for Google Sheets compatibility
    Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
            // Special handling for character preferences - convert IDs to readable names
            if (key === 'preferredCharacters') {
                const characterNames = data[key].map(id => {
                    const character = premadeCharacters.find(char => char.id === id);
                    return character ? character.name : id;
                });
                data[key] = characterNames.join(', ');
            } else {
                // For other arrays, just join with commas
                data[key] = data[key].join(', ');
            }
        }
    });
    
    return data;
}

function showSuccessMessage() {
    document.getElementById('finalMessage').innerHTML = `
        <div style="color: #4CAF50; font-size: 1.4em; margin-bottom: 20px;">
            ✅ Form Submitted Successfully!
        </div>
        <p>Thank you for your time, your response has been recorded!</p>
    `;
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('continueBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
}

function showErrorMessage() {
    document.getElementById('finalMessage').innerHTML = `
        <div style="color: #ff6b6b; font-size: 1.4em; margin-bottom: 20px;">
            ❌ Submission Failed
        </div>
        <p>There was a problem submitting your form.</p>
        <ul style="text-align: left; margin: 20px 0;">
            <li>Network connection issues</li>
            <li>Browser security settings</li>
            <li>Temporary server problems</li>
        </ul>
        <div style="margin-top: 30px; padding: 20px; background: rgba(255, 107, 107, 0.1); border-radius: 8px;">
            <strong>What to do:</strong><br>
            • Try Submit again<br>
            • Check your internet connection<br>
            • Contact me on Discord if problems persist
        </div>
    `;
    
    document.getElementById('backBtn').style.display = 'block';
    document.getElementById('backBtn').textContent = 'Try Again';
    document.getElementById('backBtn').onclick = () => {
        currentPage = totalPages;
        showPage(currentPage);
    };
}