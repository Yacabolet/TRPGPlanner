// === CHARACTERS ===

let currentCharacterIndex = 0;

function populateCharacters() {
    const container = document.getElementById('characterGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!premadeCharacters.length || premadeCharacters[0].name.startsWith('[')) {
        container.innerHTML = `
            <div class="character-placeholder">
                Premade character options will be displayed here once you provide the character details.
                <br><br>
                For now, this page serves as a placeholder to demonstrate the workflow.
            </div>
        `;
        return;
    }
    
    // Create carousel container
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'character-carousel-wrapper';
    
    // Create navigation arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.innerHTML = '‹';
    prevBtn.type = 'button';
    prevBtn.onclick = () => navigateCharacter(-1);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.innerHTML = '›';
    nextBtn.type = 'button';
    nextBtn.onclick = () => navigateCharacter(1);
    
    // Create character display area
    const characterDisplay = document.createElement('div');
    characterDisplay.className = 'character-display';
    characterDisplay.id = 'characterDisplay';
    
    // Create counter
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.id = 'characterCounter';
    
    // Assemble carousel
    carouselWrapper.appendChild(prevBtn);
    carouselWrapper.appendChild(characterDisplay);
    carouselWrapper.appendChild(nextBtn);
    container.appendChild(counter);
    container.appendChild(carouselWrapper);
    
    // Display first character
    displayCharacter(currentCharacterIndex);
}

function navigateCharacter(direction) {
    currentCharacterIndex += direction;
    
    // Wrap around
    if (currentCharacterIndex < 0) {
        currentCharacterIndex = premadeCharacters.length - 1;
    } else if (currentCharacterIndex >= premadeCharacters.length) {
        currentCharacterIndex = 0;
    }
    
    displayCharacter(currentCharacterIndex);
}

function displayCharacter(index) {
    const display = document.getElementById('characterDisplay');
    const counter = document.getElementById('characterCounter');
    
    if (!display || !premadeCharacters[index]) return;
    
    const character = premadeCharacters[index];
    
    // Update counter
    counter.textContent = `Character ${index + 1} of ${premadeCharacters.length}`;
    
    // Build character card
    const card = document.createElement('div');
    card.className = 'character-card';
    
    // Add image if provided
    let imageHTML = '';
    if (character.imageUrl && character.imageUrl.trim()) {
        imageHTML = `
            <div class="character-image-container">
                <img src="${character.imageUrl}" alt="${character.name}" class="character-image">
            </div>
        `;
    }
    
    // Build strengths list
    let strengthsHTML = '';
    if (character.strengths && character.strengths.length > 0) {
        strengthsHTML = '<div style="margin-top: 15px; font-size: 0.9em;"><strong>Key Strengths:</strong><ul style="margin: 8px 0 0 20px; line-height: 1.6;">';
        character.strengths.forEach(strength => {
            strengthsHTML += `<li>${strength}</li>`;
        });
        strengthsHTML += '</ul></div>';
    }
    
    // Build unique mechanic section
    let mechanicHTML = '';
    if (character.uniqueMechanic) {
        mechanicHTML = `
            <div style="margin-top: 15px; padding: 12px; background: rgba(218, 165, 32, 0.1); border-radius: 6px; border-left: 3px solid #DAA520; font-size: 0.9em;">
                <strong style="color: #DAA520;">Unique Mechanic:</strong><br>
                <span style="opacity: 0.9;">${character.uniqueMechanic}</span>
            </div>
        `;
    }
    
    // Build ideal for section
    let idealForHTML = '';
    if (character.idealFor) {
        idealForHTML = `
            <div style="margin-top: 12px; font-size: 0.85em; font-style: italic; opacity: 0.8;">
                <strong>Ideal for:</strong> ${character.idealFor}
            </div>
        `;
    }
    
    card.innerHTML = `
        ${imageHTML}
        <div class="character-name">${character.name}</div>
        <div class="character-class">${character.class}</div>
        ${character.playStyle ? `<div style="font-size: 0.9em; color: #DAA520; margin-bottom: 10px;">⚔️ ${character.playStyle}</div>` : ''}
        <div class="character-description">${character.description}</div>
        ${strengthsHTML}
        ${mechanicHTML}
        ${idealForHTML}
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(139, 69, 19, 0.3); display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="char_${character.id}" name="preferredCharacters" value="${character.id}" style="width: auto; margin: 0; transform: scale(1.3);">
            <label for="char_${character.id}" style="margin: 0; cursor: pointer; user-select: none;">I'm interested in this character</label>
        </div>
    `;
    
    // Clear and update display
    display.innerHTML = '';
    display.appendChild(card);
    
    // Restore checkbox state if previously selected
    const checkbox = card.querySelector('input[type="checkbox"]');
    const savedData = getSavedCharacterSelections();
    if (savedData.includes(character.id)) {
        checkbox.checked = true;
    }
    
    // Make card clickable
    card.addEventListener('click', (e) => {
        if (e.target.type !== 'checkbox' && e.target.tagName !== 'LABEL') {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
    
    // Save selection when changed
    checkbox.addEventListener('change', () => {
        saveCharacterSelection(character.id, checkbox.checked);
    });
}

function getSavedCharacterSelections() {
    try {
        const savedData = localStorage.getItem('dnd_form_data');
        if (savedData) {
            const formData = JSON.parse(savedData);
            return formData.preferredCharacters || [];
        }
    } catch (e) {
        console.warn('Could not load saved character selections:', e);
    }
    return [];
}

function saveCharacterSelection(characterId, isSelected) {
    try {
        const savedData = localStorage.getItem('dnd_form_data');
        let formData = savedData ? JSON.parse(savedData) : {};
        
        if (!formData.preferredCharacters) {
            formData.preferredCharacters = [];
        }
        
        if (isSelected && !formData.preferredCharacters.includes(characterId)) {
            formData.preferredCharacters.push(characterId);
        } else if (!isSelected) {
            formData.preferredCharacters = formData.preferredCharacters.filter(id => id !== characterId);
        }
        
        localStorage.setItem('dnd_form_data', JSON.stringify(formData));
    } catch (e) {
        console.warn('Could not save character selection:', e);
    }
}