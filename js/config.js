// === CONFIGURATION & CONSTANTS ===

// Google Apps Script URL for form submission
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyH_UK9KVJPG-9EBmiNVadFu53aJwCmDcaRS_RADM5EKXGOhx17l1TQ-Guywxa8-xvtA/exec';

// Session times in EST
const sessionTimesEST = [
    { day: 'Monday', time: '13:00', label: 'Monday 1pm EST' },
    { day: 'Thursday', time: '13:00', label: 'Thursday 1pm EST' },
    { day: 'Friday', time: '13:00', label: 'Friday 1pm EST' },
    { day: 'Tuesday', time: '01:00', label: 'Tuesday 1am EST' },
    { day: 'Thursday', time: '01:00', label: 'Thursday 1am EST (Late Night)' },
    { day: 'Friday', time: '01:00', label: 'Friday 1am EST (Late Night)' },
    { day: 'Saturday', time: '01:00', label: 'Saturday 1am EST (Late Night)' }
];

// Premade character data
const premadeCharacters = [
    {
        id: 'char1',
        name: '[Character Name 1]',
        class: '[Class/Role]',
        description: '[Character description and personality details will go here]'
    },
    {
        id: 'char2', 
        name: '[Character Name 2]',
        class: '[Class/Role]',
        description: '[Character description and personality details will go here]'
    }
];