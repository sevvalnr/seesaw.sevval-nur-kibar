// DOM Elements
const plank = document.getElementById('plank');
const seesawContainer = document.getElementById('seesawContainer');
const leftWeightDisplay = document.getElementById('leftWeight');
const rightWeightDisplay = document.getElementById('rightWeight');
const angleDisplay = document.getElementById('angleDisplay');
const resetBtn = document.getElementById('resetBtn');

// Constants
const MAX_ANGLE = 30;
const DISTANCE_DISPLAY_DURATION = 2000; // 2 seconds

// State
let objects = [];
let currentAngle = 0;

// saved state from localStorage
function loadState() {
    const saved = localStorage.getItem('seesawState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            objects = state.objects || [];
            renderObjects();
            updateSeesaw();
        } catch (e) {
            console.error('Error loading state:', e);
        }
    }
}

// Save state to localStorage
function saveState() {
    const state = {
        objects: objects
    };
    localStorage.setItem('seesawState', JSON.stringify(state));
}

//random color generator
function getRandomColor(weight) {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', 
        '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'
    ];
    return colors[Math.floor(weight) % colors.length];
}