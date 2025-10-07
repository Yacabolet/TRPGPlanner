// === INITIALIZATION ===

window.addEventListener('load', function() {
    console.log('Initializing TRPG Recruitment Form...');
    
    // Initialize all modules
    initTimezone();
    setupInteractivity();
    setupKeyboardNavigation();
    setupFormPersistence();
    setupUserCheck();
    loadSavedProgress();
    
    // Show initial page
    showPage(currentPage);
    
    console.log('Form initialized successfully');
});