// === CHARACTERS ===

function populateCharacters() {
    const grid = document.getElementById('characterGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!premadeCharacters.length || premadeCharacters[0].name.startsWith('[')) {
        grid.innerHTML = `
            <div class="character-placeholder">
                Premade character options will be displayed here once you provide the character details.
                <br><br>
                For now, this page serves as a placeholder to demonstrate the workflow.
            </div>
        `;
    } else {
        premadeCharacters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="character-name">${character.name}</div>
                <div class="character-class">${character.class}</div>
                <div class="character-description">${character.description}</div>
                <input type="checkbox" name="preferredCharacters" value="${character.id}" style="margin-top: 15px;">
                <label style="margin-left: 5px;">Interested in this character</label>
            `;
            
            card.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = card.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
                card.classList.toggle('selected', card.querySelector('input[type="checkbox"]').checked);
            });
            
            grid.appendChild(card);
        });
    }
}