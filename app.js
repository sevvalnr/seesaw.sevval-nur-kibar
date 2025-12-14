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