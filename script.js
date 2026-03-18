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
const TILES_ORDER_KEY = 'bingoTilesOrder';
const CLICKED_TILES_KEY = 'bingoProgress';
const NAME_KEY = 'bingoPlayerName';

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
 * Get or create tile order - persists across page reloads via cookie
 * @returns {Array} Ordered activities for tiles
 */
function getTileOrder() {
    const savedOrder = getCookie(TILES_ORDER_KEY);
    
    if (savedOrder) {
        try {
            return JSON.parse(decodeURIComponent(savedOrder));
        } catch (error) {
            console.error('Failed to parse saved tile order:', error);
        }
    }
    
    // Create new order if none exists
    const newOrder = shuffleArray(ACTIVITIES).slice(0, TILES_TO_SHOW);
    setCookie(TILES_ORDER_KEY, JSON.stringify(newOrder));
    return newOrder;
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

    // Restore clicked state from cookie
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
 * Initialize bingo grid with saved or new tile order
 */
function initializeBingoGrid() {
    const gridElement = document.getElementById('bingoGrid');
    const selectedActivities = getTileOrder();

    selectedActivities.forEach(activity => {
        const tile = createTile(activity);
        gridElement.appendChild(tile);
    });
}

/**
 * Save player name to cookie
 */
function saveName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name) {
        setCookie(NAME_KEY, name);
    } else {
        // Clear cookie if name is empty
        setCookie(NAME_KEY, '', -1);
    }
}

/**
 * Load player name from cookie and set up event listeners
 */
function initializeName() {
    const nameInput = document.getElementById('nameInput');
    
    // Load saved name
    const savedName = getCookie(NAME_KEY);
    if (savedName) {
        nameInput.value = decodeURIComponent(savedName);
    }
    
    // Save name on input change
    nameInput.addEventListener('blur', saveName);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveName();
            nameInput.blur();
        }
    });
}

/**
 * Set a cookie value
 * @param {string} key - Cookie key
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration (default: 365)
 */
function setCookie(key, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = key + '=' + encodeURIComponent(value) + ';' + expires + ';path=/';
}

/**
 * Get a cookie value
 * @param {string} key - Cookie key
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(key) {
    const name = key + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return null;
}

/**
 * Save current progress (clicked tiles) to cookie
 */
function saveProgress() {
    const clickedTiles = document.querySelectorAll('.tile.clicked');
    const completedActivities = Array.from(clickedTiles).map(tile => tile.textContent);
    setCookie(CLICKED_TILES_KEY, JSON.stringify(completedActivities));
}

/**
 * Get saved progress from cookie
 * @returns {Array} List of completed activities
 */
function getSavedProgress() {
    const saved = getCookie(CLICKED_TILES_KEY);
    try {
        return saved ? JSON.parse(decodeURIComponent(saved)) : [];
    } catch (error) {
        console.error('Failed to load saved progress:', error);
        return [];
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeName();
    initializeBingoGrid();
});
