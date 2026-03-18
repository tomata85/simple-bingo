/**
 * Koh Lanta Bingo 2026
 * A mobile-friendly bingo game to track activities during Koh Lanta trip
 */

// Activities to complete
const ACTIVITIES = [
    'Sunset at Lym\'s', 'Mem\'s coffee corner', 'Coffee at Escape cafe',
    'Coffee at Slowbar Caffetteria', 'Eat at Bun noodles', 'Eat at Spring rolls',
    'Swim in Secret beach or Beautiful beach', 'Dance in Pangea',
    'Sing Kareoke at Free Descent', 'Dance at Korner Bar',
    'Eat at Indira Fusion', 'Eat at Yang', 'Have a smoothie at Fullfil',
    'Visit Lanta Noi', 'Visit Old Town', 'Hike National Park',
    'Visit the Buddhist Center', 'Chill at Why Not Bar', 'Dance at Horizon Bar',
    'Have breakfast in Tuesday morning', 'Attend a quiz',
    'Eat at Aleena Minimart', 'Walk through Long Beach',
    'Chill at Sanctuary', 'Go to New Moon Party'
];

const TILES_TO_SHOW = 25;
const STORAGE_KEY = 'bingoProgress';

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create and render bingo tile
 * @param {string} activity - Activity text
 * @returns {HTMLElement} Tile element
 */
function createTile(activity) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = activity;

    // Restore clicked state from storage
    const savedActivities = getSavedProgress();
    if (savedActivities.includes(activity)) {
        tile.classList.add('clicked');
    }

    // Add click handler
    tile.addEventListener('click', () => {
        tile.classList.toggle('clicked');
        saveProgress();
    });

    return tile;
}

/**
 * Initialize bingo grid with random activities
 */
function initializeBingoGrid() {
    const gridElement = document.getElementById('bingoGrid');
    const selectedActivities = shuffleArray(ACTIVITIES).slice(0, TILES_TO_SHOW);

    selectedActivities.forEach(activity => {
        const tile = createTile(activity);
        gridElement.appendChild(tile);
    });
}

/**
 * Save current progress to local storage
 */
function saveProgress() {
    const clickedTiles = document.querySelectorAll('.tile.clicked');
    const completedActivities = Array.from(clickedTiles).map(tile => tile.textContent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedActivities));
}

/**
 * Get saved progress from local storage
 * @returns {Array} List of completed activities
 */
function getSavedProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load saved progress:', error);
        return [];
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeBingoGrid);
