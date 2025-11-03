/* ============================================
   ICON LOADER - PIXELARTICONS INTEGRATION
   ============================================ */

/**
 * Creates an SVG icon element from pixelarticons
 * @param {string} iconName - Name of the icon (without .svg)
 * @param {number} size - Size in pixels (24, 48, 72, or 96 recommended)
 * @param {string} color - Color for the icon (default: currentColor)
 * @returns {HTMLImageElement} - Image element with the icon
 */
function createIcon(iconName, size = 24, color = null) {
    const img = document.createElement('img');
    img.src = `node_modules/pixelarticons/svg/${iconName}.svg`;
    img.width = size;
    img.height = size;
    img.alt = iconName;
    img.classList.add('pixelart-icon');

    if (color) {
        img.style.filter = `brightness(0) saturate(100%) ${getColorFilter(color)}`;
    }

    return img;
}

/**
 * Gets CSS filter for color conversion
 * @param {string} color - Hex color code
 * @returns {string} - CSS filter string
 */
function getColorFilter(color) {
    // Simple color filter - for terminal green
    if (color === '#00ff41' || color === 'terminal-green') {
        return 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)';
    }
    return '';
}

/**
 * Icon map for game resources and UI elements
 */
const GAME_ICONS = {
    // Resources
    energy: 'zap',
    food: 'drop',
    water: 'drop',
    oxygen: 'device-vibrate',
    medicine: 'heart',
    data: 'chart',
    fuel: 'drop-full',

    // Navigation
    ship: 'ship',
    map: 'map',
    target: 'bullseye',
    check: 'check',
    alert: 'alert',
    warning: 'warning-box',
    info: 'info-box',

    // Crew
    user: 'user',
    users: 'users',

    // UI
    close: 'close',
    menu: 'menu',
    chevronUp: 'chevron-up',
    chevronDown: 'chevron-down',
    chevronLeft: 'chevron-left',
    chevronRight: 'chevron-right',
    arrowUp: 'arrow-up',
    arrowDown: 'arrow-down',
    arrowLeft: 'arrow-left',
    arrowRight: 'arrow-right',

    // Status
    clock: 'clock',
    calendar: 'calendar-today',
    book: 'book',
    bookmark: 'bookmark',

    // Special
    moon: 'moon',
    star: 'moon-star',
    battery: 'battery-full',
    batteryLow: 'battery-1',
    bed: 'bed'
};

/**
 * Creates an icon using the game icon map
 * @param {string} key - Key from GAME_ICONS
 * @param {number} size - Size in pixels
 * @param {string} color - Color for the icon
 * @returns {HTMLImageElement} - Icon element
 */
function createGameIcon(key, size = 24, color = null) {
    const iconName = GAME_ICONS[key] || 'check';
    return createIcon(iconName, size, color);
}

/**
 * Replaces emoji with pixelarticon
 * @param {HTMLElement} element - Element containing emoji
 * @param {string} iconKey - Icon key from GAME_ICONS
 * @param {number} size - Size in pixels
 */
function replaceEmojiWithIcon(element, iconKey, size = 24) {
    element.innerHTML = '';
    const icon = createGameIcon(iconKey, size, 'terminal-green');
    element.appendChild(icon);
}
