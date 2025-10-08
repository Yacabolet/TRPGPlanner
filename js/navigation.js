// === PROGRESS & NAVIGATION ===

function updateProgress() {
    const actualTotal = totalPages;
    const progress = (currentPage / actualTotal) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Step ${currentPage} of ${actualTotal}`;
    console.log(`Progress updated: ${currentPage}/${actualTotal} (${progress}%)`);
}

function checkCharacterBrowseNeeded() {
    const characterCreation = document.querySelector('input[name="characterCreation"]:checked');
    console.log('Checking character browse needed, selected:', characterCreation ? characterCreation.value : 'none');
    
    const previousShowCharacterBrowse = showCharacterBrowse;
    
    if (characterCreation && (characterCreation.value === 'premade' || characterCreation.value === 'either')) {
        showCharacterBrowse = true;
        totalPages = 9; // Updated from 8 to 9
        populateCharacters();
        console.log('Character browse enabled, totalPages set to 9');
    } else {
        showCharacterBrowse = false;
        totalPages = 8; // Updated from 7 to 8
        const page8 = document.getElementById('page8');
        page8.classList.remove('active');
        console.log('Character browse disabled, totalPages set to 8');
    }
    
    if (previousShowCharacterBrowse !== showCharacterBrowse) {
        if (currentPage > totalPages) {
            currentPage = totalPages;
            console.log('Adjusted current page to', currentPage, 'due to settings change');
        }
    }
    
    saveCurrentPage();
}

function showPage(pageNum) {
    // Hide all pages
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });
    
    const header = document.querySelector('.header');
    const progressContainer = document.querySelector('.progress-container');
    const container = document.querySelector('.container');
    
    // Handle final page (beyond totalPages)
    if (pageNum > totalPages) {
        document.getElementById('finalPage').classList.add('active');
        header.style.display = 'none';
        progressContainer.style.display = 'none';
        container.classList.add('no-header');
        
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').textContent = 'Go Back';
        document.getElementById('backBtn').onclick = () => {
            currentPage = totalPages;
            showPage(currentPage);
        };
        
        document.getElementById('continueBtn').style.display = 'block';
        document.getElementById('continueBtn').textContent = 'Submit';
        document.getElementById('continueBtn').onclick = () => {
            submitForm();
        };
        
        document.getElementById('resetBtn').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    // Show/hide header based on page
    if (pageNum === 1) {
        header.style.display = 'block';
        container.classList.remove('no-header');
    } else {
        header.style.display = 'none';
        container.classList.add('no-header');
    }
    progressContainer.style.display = 'block';
    
    // Reset navigation button handlers
    document.getElementById('backBtn').onclick = goBack;
    document.getElementById('continueBtn').onclick = goNext;
    
    // Determine which page content to show
    let targetPageId;
    if (pageNum === 8) {
        // Page 8 is either character browse or preferences depending on showCharacterBrowse
        targetPageId = showCharacterBrowse ? 'page8' : 'page9';
    } else if (pageNum === 9 && showCharacterBrowse) {
        targetPageId = 'page9';
    } else {
        targetPageId = `page${pageNum}`;
    }
    
    // Show current page
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update double session question visibility
        if (targetPageId === 'page9') {
            updateDoubleSessionQuestion();
        }
        
        // Populate character grid
        if (targetPageId === 'page8' && showCharacterBrowse) {
            populateCharacters();
        }
    } else {
        console.error(`Page ${targetPageId} not found!`);
    }
    
    // Update navigation buttons
    const backBtn = document.getElementById('backBtn');
    const continueBtn = document.getElementById('continueBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    backBtn.style.display = pageNum === 1 ? 'none' : 'block';
    if (backBtn.style.display === 'block') backBtn.textContent = 'Go Back';
    
    continueBtn.style.display = 'block';
    continueBtn.textContent = 'Continue';
    continueBtn.disabled = false;
    resetBtn.style.display = 'block';
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log(`Showing page ${pageNum} (${targetPageId}) of ${totalPages}`);
}

function goNext() {
    if (!validateCurrentPage()) return;
    
    saveFormData();
    
    // Special handling for availability page
    if (currentPage === 2) {
        const { hasAvailability } = checkAvailability();
        if (!hasAvailability) {
            document.getElementById('finalMessage').textContent = 
                "Unfortunately it seems you have no availability during any of my potential timeslots, thank you for your time either way. If my schedule changes and I look for more players I'll let you know.";
            showPage(totalPages + 1);
            return;
        }
    }
    
    // Special handling for character preferences page (now page 7)
    if (currentPage === 7) {
        checkCharacterBrowseNeeded();
        currentPage = 8;
        saveCurrentPage();
        showPage(currentPage);
        return;
    }
    
    // Normal navigation
    if (currentPage < totalPages) {
        currentPage++;
        saveCurrentPage();
        showPage(currentPage);
    } else {
        showPage(totalPages + 1);
    }
}

function goBack() {
    if (currentPage > 1) {
        // Special handling for going back from different pages
        if (currentPage === 8 && !showCharacterBrowse) {
            currentPage = 7;
        } else if (currentPage === 9 && showCharacterBrowse) {
            currentPage = 8;
        } else {
            currentPage--;
        }
        saveCurrentPage();
        showPage(currentPage);
    }
}

function resetForm() {
    if (!confirm('Are you sure you want to reset the form? All your answers will be lost.')) return;
    
    clearSavedData();
    currentPage = 1;
    totalPages = 8; // Updated from 7 to 8
    showCharacterBrowse = false;
    
    document.getElementById('recruitmentForm').reset();
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    const timezoneOverride = document.getElementById('timezoneOverride');
    if (timezoneOverride) timezoneOverride.selectedIndex = 0;
    
    const timezoneSearch = document.getElementById('timezoneSearch');
    if (timezoneSearch) timezoneSearch.value = '';
    
    setTimeout(() => {
        displayTimeslots();
        document.querySelectorAll('.timeslot-item').forEach(timeslot => {
            timeslot.querySelectorAll('label[data-value]').forEach(label => label.classList.remove('selected'));
            const unavailable = timeslot.querySelector('label[data-value="unavailable"]');
            if (unavailable) unavailable.classList.add('selected');
        });
    }, 100);
    
    showPage(1);
    console.log('Form reset');
}