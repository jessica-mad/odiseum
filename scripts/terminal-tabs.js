// ============================================
// TERMINAL TABS - ODISEUM V2.0
// Sistema de tabs para el terminal (Consola + Tripulación)
// ============================================

/* === CAMBIAR ENTRE TABS === */
function switchTerminalTab(tabName) {
    // Ocultar todos los contenidos de tabs
    const allContents = document.querySelectorAll('.terminal-tab-content');
    allContents.forEach(content => content.classList.remove('active'));

    // Desactivar todos los botones de tabs (desktop y móvil)
    const allTabs = document.querySelectorAll('.terminal-tab, .mobile-terminal-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));

    // Activar el tab seleccionado (desktop)
    const selectedContent = document.getElementById(`terminal-content-${tabName}`);
    const selectedTab = document.getElementById(`tab-${tabName}`);

    // También activar para móvil
    const selectedContentMobile = document.getElementById(`terminal-content-${tabName}-mobile`);

    if (selectedContent) selectedContent.classList.add('active');
    if (selectedContentMobile) selectedContentMobile.classList.add('active');
    if (selectedTab) selectedTab.classList.add('active');

    // Activar el botón móvil correspondiente
    const mobileTabs = document.querySelectorAll('.mobile-terminal-tab');
    mobileTabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(tabName === 'console' ? 'consola' : 'tripulación')) {
            tab.classList.add('active');
        }
    });

    // Si es el tab de tripulación, actualizar las fichas
    if (tabName === 'crew') {
        updateTerminalCrewCards();
    }
}

/* === ACTUALIZAR FICHAS DE TRIPULANTES EN TERMINAL === */
function updateTerminalCrewCards() {
    // Desktop
    const container = document.getElementById('terminal-crew-cards');
    if (container && Array.isArray(crewMembers)) {
        container.innerHTML = '';
        crewMembers.forEach(crew => {
            const card = createTerminalCrewCard(crew);
            container.appendChild(card);
        });
    }

    // Móvil
    const mobileContainer = document.getElementById('mobile-crew-cards');
    if (mobileContainer && Array.isArray(crewMembers)) {
        mobileContainer.innerHTML = '';
        crewMembers.forEach(crew => {
            const card = createTerminalCrewCard(crew);
            mobileContainer.appendChild(card);
        });
    }
}

/* === CREAR FICHA DE TRIPULANTE PARA TERMINAL === */
function createTerminalCrewCard(crew) {
    const card = document.createElement('div');
    card.className = 'terminal-crew-card';
    card.onclick = () => openCrewManagementPopup(crew.name);

    // Determinar color de estado
    let statusIcon = '❤️';
    if (!crew.isAlive) {
        statusIcon = '💀';
    } else if (crew.state === 'Despierto') {
        statusIcon = '⚡';
    } else if (crew.state === 'Encapsulado') {
        statusIcon = '💤';
    }

    // Información básica
    const roleLabel = crew.getRoleLabel ? crew.getRoleLabel() : '';
    const state = crew.state || 'Desconocido';
    const age = crew.biologicalAge ? crew.biologicalAge.toFixed(1) : crew.initialAge;

    // HTML de la card
    card.innerHTML = `
        <div class="terminal-crew-card-header">
            <span class="terminal-crew-name">${roleLabel} ${crew.name}</span>
            <span class="terminal-crew-status">${statusIcon}</span>
        </div>

        <div class="terminal-crew-info">
            <div class="terminal-crew-info-line">
                <span class="terminal-crew-info-label">ESTADO:</span>
                <span class="terminal-crew-info-value">${state}</span>
            </div>
            <div class="terminal-crew-info-line">
                <span class="terminal-crew-info-label">EDAD:</span>
                <span class="terminal-crew-info-value">${age} años</span>
            </div>
            <div class="terminal-crew-info-line">
                <span class="terminal-crew-info-label">POSICIÓN:</span>
                <span class="terminal-crew-info-value">${crew.position}</span>
            </div>
        </div>

        ${crew.isAlive && crew.state === 'Despierto' ? createTerminalCrewStats(crew) : ''}
    `;

    return card;
}

/* === CREAR BARRAS DE STATS PARA FICHA === */
function createTerminalCrewStats(crew) {
    const stats = [
        { label: 'SALUD', value: crew.healthNeed || 0, icon: '❤️' },
        { label: 'COMIDA', value: crew.foodNeed || 0, icon: '🍽️' },
        { label: 'HIGIENE', value: crew.wasteNeed || 0, icon: '🚿', inverted: true },
        { label: 'DESCANSO', value: crew.restNeed || 0, icon: '😴' }
    ];

    let html = '<div class="terminal-crew-stats">';

    stats.forEach(stat => {
        const value = stat.value;
        const displayValue = stat.inverted ? (100 - value) : value;

        // Determinar color
        let colorClass = '';
        if (stat.inverted) {
            // Para higiene: alto es malo
            if (value > 80) colorClass = 'low';
            else if (value > 50) colorClass = 'medium';
        } else {
            // Para otros: bajo es malo
            if (value < 30) colorClass = 'low';
            else if (value < 60) colorClass = 'medium';
        }

        html += `
            <div class="terminal-stat-bar">
                <span class="terminal-stat-label">${stat.icon}</span>
                <div class="terminal-stat-track">
                    <div class="terminal-stat-fill ${colorClass}" style="width: ${displayValue}%"></div>
                </div>
                <span class="terminal-stat-value">${Math.round(displayValue)}%</span>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

/* === INICIALIZACIÓN === */
// Actualizar las fichas periódicamente cuando el tab está activo
setInterval(() => {
    const crewTab = document.getElementById('terminal-content-crew');
    if (crewTab && crewTab.classList.contains('active')) {
        updateTerminalCrewCards();
    }
}, 5000); // Actualizar cada 5 segundos

console.log('[Terminal Tabs] Sistema cargado');
