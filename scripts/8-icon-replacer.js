/* ============================================
   ICON REPLACER - Replace emojis with pixelarticons on page load
   ============================================ */

/**
 * Replace resource icons with pixelarticons
 */
function replaceResourceIcons() {
    // Map of resource strip elements to icon names
    const resourceIconMap = {
        'energy': 'zap',
        'food': 'drop',
        'water': 'drop',
        'oxygen': 'device-vibrate',
        'medicine': 'heart',
        'data': 'chart-bar',
        'fuel': 'drop-full'
    };

    // Replace resource strip icons
    const resourceChips = document.querySelectorAll('.resource-chip');
    resourceChips.forEach((chip, index) => {
        const iconElement = chip.querySelector('.resource-icon');
        if (iconElement) {
            const resourceKeys = Object.keys(resourceIconMap);
            if (index < resourceKeys.length) {
                const iconName = resourceIconMap[resourceKeys[index]];
                const icon = createIcon(iconName, 24, 'terminal-green');
                iconElement.innerHTML = '';
                iconElement.appendChild(icon);
            }
        }
    });
}

/**
 * Replace desktop icons with pixelarticons
 */
function replaceDesktopIcons() {
    const desktopIconMap = {
        'icon-resources-management': 'archive',
        'icon-crews-management': 'users',
        'icon-trip-management': 'ship',
        'icon-logbook': 'book'
    };

    Object.keys(desktopIconMap).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const iconElement = element.querySelector('.icon-image');
            if (iconElement) {
                const iconName = desktopIconMap[id];
                const icon = createIcon(iconName, 48, 'terminal-green');
                iconElement.innerHTML = '';
                iconElement.appendChild(icon);
            }
        }
    });
}

/**
 * Replace voyage endpoint icons
 */
function replaceVoyageIcons() {
    const planetIcons = document.querySelectorAll('.planet-icon');
    planetIcons.forEach((iconElement, index) => {
        // Keep emoji for planets as they are distinctive
        // But we could replace with custom planet SVGs later
    });
}

/**
 * Replace crew sidebar header icon
 */
function replaceSidebarIcons() {
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    if (sidebarHeader && sidebarHeader.textContent.includes('🚀')) {
        const icon = createIcon('ship', 24, 'terminal-green');
        sidebarHeader.innerHTML = '';
        sidebarHeader.appendChild(icon);
        sidebarHeader.appendChild(document.createTextNode(' TRIPULACIÓN'));
    }
}

/**
 * Main function to replace all icons on page load
 */
function replaceAllIcons() {
    console.log('Replacing emojis with pixelarticons...');

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                replaceResourceIcons();
                replaceDesktopIcons();
                replaceVoyageIcons();
                replaceSidebarIcons();
            }, 100);
        });
    } else {
        setTimeout(() => {
            replaceResourceIcons();
            replaceDesktopIcons();
            replaceVoyageIcons();
            replaceSidebarIcons();
        }, 100);
    }
}

// Auto-replace icons when script loads
replaceAllIcons();
