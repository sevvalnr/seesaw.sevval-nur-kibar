// DOM Elements
const plank = document.getElementById('plank');
const seesawContainer = document.getElementById('seesawContainer');
const leftWeightDisplay = document.getElementById('leftWeight');
const rightWeightDisplay = document.getElementById('rightWeight');
const angleDisplay = document.getElementById('angleDisplay');
const resetBtn = document.getElementById('resetBtn');

// Constants
const MAX_ANGLE = 30;
const DISTANCE_DISPLAY_DURATION = 1000; //  seconds
const PLANK_STABILITY_FACTOR = 5000; 
const DAMPING_FACTOR = 0.15

let PLANK_LENGTH = 500;
let PIVOT_X = PLANK_LENGTH / 2;

// State
let objects = [];
let currentAngle = 0;


function updatePlankDimensions() {
    const rect = plank.getBoundingClientRect();
    PLANK_LENGTH = rect.width;
    PIVOT_X = PLANK_LENGTH / 2;
}
function updateSeesaw() {
    updatePlankDimensions();
    
    let leftTorque = 0;
    let rightTorque = 0;
    let leftWeight = 0;
    let rightWeight = 0;

    objects.forEach(obj => {
        const distanceFromPivot = Math.abs(obj.position - PIVOT_X);
        const torque = obj.weight * distanceFromPivot;
        
        if (obj.position < PIVOT_X) {
            leftTorque += torque;
            leftWeight += obj.weight;
        } else {
            rightTorque += torque;
            rightWeight += obj.weight;
        }
    });

    let targetAngle = (rightTorque - leftTorque) / 10;
    targetAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, targetAngle));
    
    currentAngle += (targetAngle - currentAngle) * DAMPING_FACTOR;

    plank.style.transform = `rotate(${currentAngle}deg)`;
    
    document.querySelectorAll('.object').forEach(objElement => {
        objElement.style.transform = `rotate(${-currentAngle}deg)`;
    });

    leftWeightDisplay.textContent = leftWeight.toFixed(1) + ' kg';
    rightWeightDisplay.textContent = rightWeight.toFixed(1) + ' kg';
    angleDisplay.textContent = `Angle: ${currentAngle.toFixed(1)}°`;
}
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
function showDistance(clickX, clickY) {
    updatePlankDimensions();
    
    //distance from center
    const distanceFromCenter = Math.abs(clickX - PIVOT_X);
    const side = clickX < PIVOT_X ? 'LEFT' : 'RIGHT';
    const indicator = document.createElement('div');

    indicator.className = 'distance-indicator';
    indicator.textContent = `${distanceFromCenter.toFixed(1)}px (${side})`;
    indicator.style.left = clickX + 'px';
    indicator.style.top = (clickY - 60) + 'px';
    
    plank.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, DISTANCE_DISPLAY_DURATION);
}
function renderObjects() {
    const existingObjects = plank.querySelectorAll('.object');
    existingObjects.forEach(obj => obj.remove());

    objects.forEach(obj => {
        const objElement = document.createElement('div');
        objElement.className = 'object';
        objElement.style.backgroundColor = obj.color;
        objElement.style.left = obj.position + 'px';
        objElement.textContent = obj.weight;
        objElement.title = `Weight: ${obj.weight} kg`;
        
        // click to remove object
        objElement.addEventListener('click', function(e) {
            e.stopPropagation();
            objects = objects.filter(o => o.id !== obj.id);
            renderObjects();
            updateSeesaw();
            saveState();
        });
        plank.appendChild(objElement);
    });
}
plank.addEventListener('click', function(e) {
    updatePlankDimensions(); 
    const rect = plank.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const weight = Math.floor(Math.random() * 10) + 1;
    
    showDistance(clickX, clickY);
    const obj = {
        id: Date.now(),
        position: clickX,
        weight: weight,
        color: getRandomColor(weight)
    };
    
    objects.push(obj);
    renderObjects();
    updateSeesaw();
    saveState();
});
function updateSeesaw() {
    updatePlankDimensions(); 
    let leftTorque = 0;
    let rightTorque = 0;
    let leftWeight = 0;
    let rightWeight = 0;

    objects.forEach(obj => {
        const distance = Math.abs(obj.position - PIVOT_X);
        const torque = obj.weight * distance;

        if (obj.position < PIVOT_X) {
            leftTorque += torque;
            leftWeight += obj.weight;
        } else {
            rightTorque += torque;
            rightWeight += obj.weight;
        }
    });

    // Calculate angle
    const torqueDiff = rightTorque - leftTorque;
    currentAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, torqueDiff / 10));
    // Update display
    plank.style.transform = `rotate(${currentAngle}deg)`;
    leftWeightDisplay.textContent = leftWeight.toFixed(1) + ' kg';
    rightWeightDisplay.textContent = rightWeight.toFixed(1) + ' kg';
    angleDisplay.textContent = `Angle: ${currentAngle.toFixed(1)}°`;
}
resetBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the seesaw?')) {
        objects = [];
        currentAngle = 0; 
        renderObjects();
        updateSeesaw();
        saveState();
    }
});

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        updatePlankDimensions();
        renderObjects();
        updateSeesaw();
    }, 250);
});
function animate() {
    updateSeesaw();
    requestAnimationFrame(animate);
}

updatePlankDimensions();
loadState();
animate();