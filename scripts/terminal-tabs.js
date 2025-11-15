// ============================================
// TERMINAL TABS - ODISEUM V2.0
// Sistema de tabs para el terminal (Consola + Fichas individuales de tripulantes)
// ============================================

/* === GENERAR TABS DE TRIPULANTES === */
function generateCrewTabs() {
    if (!Array.isArray(crewMembers) || crewMembers.length === 0) return;

    // Contenedor de tabs desktop
    const tabsContainer = document.getElementById('terminal-tabs-container');
    // Contenedor de tabs móvil
    const mobileTabsContainer = document.getElementById('mobile-tabs-container');

    // Contenedor de contenidos desktop
    const contentContainer = document.getElementById('crew-tabs-content-container');
    // Contenedor de contenidos móvil
    const mobileContentContainer = document.getElementById('mobile-crew-tabs-content-container');

    if (!tabsContainer || !contentContainer) return;

    // Limpiar tabs y contenidos previos (excepto el tab de consola)
    const existingCrewTabs = document.querySelectorAll('[data-crew-tab]');
    existingCrewTabs.forEach(tab => tab.remove());

    if (contentContainer) contentContainer.innerHTML = '';
    if (mobileContentContainer) mobileContentContainer.innerHTML = '';

    // Generar un tab por cada tripulante
    crewMembers.forEach(crew => {
        // Obtener emoji del rol
        const roleConfig = ROLE_CONFIG[crew.role] || {};
        const emoji = roleConfig.emoji || '👤';

        // DESKTOP: Crear botón de tab
        const tabBtn = document.createElement('button');
        tabBtn.className = 'terminal-tab';
        tabBtn.id = `tab-crew-${crew.id}`;
        tabBtn.dataset.crewTab = crew.id;
        tabBtn.onclick = () => switchTerminalTab(`crew-${crew.id}`);
        tabBtn.textContent = emoji;
        tabBtn.title = crew.name;
        tabsContainer.appendChild(tabBtn);

        // MÓVIL: Crear botón de tab
        if (mobileTabsContainer) {
            const mobileTabBtn = document.createElement('button');
            mobileTabBtn.className = 'mobile-terminal-tab';
            mobileTabBtn.dataset.crewTab = crew.id;
            mobileTabBtn.onclick = () => switchTerminalTab(`crew-${crew.id}`);
            mobileTabBtn.textContent = emoji;
            mobileTabsContainer.appendChild(mobileTabBtn);
        }

        // DESKTOP: Crear contenido de tab
        const content = document.createElement('div');
        content.className = 'terminal-tab-content';
        content.id = `terminal-content-crew-${crew.id}`;
        content.appendChild(createFullCrewProfile(crew));
        contentContainer.appendChild(content);

        // MÓVIL: Crear contenido de tab
        if (mobileContentContainer) {
            const mobileContent = document.createElement('div');
            mobileContent.className = 'terminal-tab-content';
            mobileContent.id = `terminal-content-crew-${crew.id}-mobile`;
            mobileContent.appendChild(createFullCrewProfile(crew));
            mobileContentContainer.appendChild(mobileContent);
        }
    });

    console.log(`[Terminal Tabs] ${crewMembers.length} tabs de tripulantes generados`);
}

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
    if (tabName !== 'console') {
        const crewId = tabName.replace('crew-', '');
        const mobileTabBtn = document.querySelector(`.mobile-terminal-tab[data-crew-tab="${crewId}"]`);
        if (mobileTabBtn) mobileTabBtn.classList.add('active');
    } else {
        const consoleTabMobile = document.querySelector('.mobile-terminal-tab:not([data-crew-tab])');
        if (consoleTabMobile) consoleTabMobile.classList.add('active');
    }
}

/* === CREAR PERFIL COMPLETO DE TRIPULANTE === */
function createFullCrewProfile(crew) {
    const container = document.createElement('div');
    container.className = 'crew-profile-full';

    // Determinar estado e icono
    let statusIcon = '❤️';
    let statusClass = 'alive';
    if (!crew.isAlive) {
        statusIcon = '💀';
        statusClass = 'dead';
    } else if (crew.state === 'Despierto') {
        statusIcon = '⚡';
        statusClass = 'awake';
    } else if (crew.state === 'Encapsulado') {
        statusIcon = '💤';
        statusClass = 'asleep';
    }

    // Información básica
    const roleLabel = crew.getRoleLabel ? crew.getRoleLabel() : '';
    const state = crew.state || 'Desconocido';
    const age = crew.biologicalAge ? crew.biologicalAge.toFixed(1) : crew.initialAge;
    const location = crew.getCurrentLocation ? crew.getCurrentLocation() : 'Nave';
    const activity = crew.currentActivity || 'Sin actividad';
    const thought = crew.getCurrentThought ? crew.getCurrentThought() : '💭 ...';

    // Generar HTML del perfil
    container.innerHTML = `
        <div class="crew-profile-header ${statusClass}">
            <div class="crew-profile-avatar">${roleLabel}</div>
            <div class="crew-profile-title">
                <h2>${crew.name}</h2>
                <div class="crew-profile-subtitle">${crew.position} ${statusIcon}</div>
            </div>
        </div>

        <div class="crew-profile-main">
            <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
            <div class="crew-profile-section">
                <div class="crew-profile-section-title">&gt; INFORMACIÓN</div>
                <div class="crew-profile-info-grid">
                    <div class="crew-info-item">
                        <span class="crew-info-label">ESTADO:</span>
                        <span class="crew-info-value ${statusClass}">${state}</span>
                    </div>
                    <div class="crew-info-item">
                        <span class="crew-info-label">EDAD INICIAL:</span>
                        <span class="crew-info-value">${crew.initialAge} años</span>
                    </div>
                    <div class="crew-info-item">
                        <span class="crew-info-label">EDAD BIOLÓGICA:</span>
                        <span class="crew-info-value">${age} años</span>
                    </div>
                    <div class="crew-info-item">
                        <span class="crew-info-label">AÑOS DESPIERTO:</span>
                        <span class="crew-info-value">${crew.yearsAwake || 0} años</span>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN: UBICACIÓN Y ACTIVIDAD -->
            <div class="crew-profile-section">
                <div class="crew-profile-section-title">&gt; ESTADO ACTUAL</div>
                <div class="crew-profile-info-grid">
                    <div class="crew-info-item">
                        <span class="crew-info-label">📍 UBICACIÓN:</span>
                        <span class="crew-info-value">${location}</span>
                    </div>
                    <div class="crew-info-item">
                        <span class="crew-info-label">🔧 ACTIVIDAD:</span>
                        <span class="crew-info-value">${activity}</span>
                    </div>
                    <div class="crew-info-item full-width">
                        <span class="crew-info-label">PENSAMIENTO:</span>
                        <span class="crew-info-value thought">${thought}</span>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN: NECESIDADES (solo si está vivo) -->
            ${crew.isAlive ? createCrewNeedsSection(crew) : ''}

            <!-- SECCIÓN: LOG PERSONAL (últimas 10 entradas) -->
            ${createCrewPersonalLog(crew)}
        </div>
    `;

    return container;
}

/* === CREAR SECCIÓN DE NECESIDADES === */
function createCrewNeedsSection(crew) {
    const needs = [
        { label: 'SALUD', value: crew.healthNeed || 0, icon: '❤️' },
        { label: 'COMIDA', value: crew.foodNeed || 0, icon: '🍽️' },
        { label: 'AGUA', value: 100, icon: '💧' }, // Placeholder
        { label: 'HIGIENE', value: crew.wasteNeed || 0, icon: '🚿', inverted: true },
        { label: 'DESCANSO', value: crew.restNeed || 0, icon: '😴' },
        { label: 'ENTRET.', value: crew.entertainmentNeed || 0, icon: '🎮' }
    ];

    let html = '<div class="crew-profile-section">';
    html += '<div class="crew-profile-section-title">&gt; NECESIDADES</div>';
    html += '<div class="crew-needs-grid">';

    needs.forEach(need => {
        const value = need.value;
        const displayValue = need.inverted ? (100 - value) : value;

        // Determinar color
        let colorClass = '';
        if (need.inverted) {
            if (value > 80) colorClass = 'low';
            else if (value > 50) colorClass = 'medium';
        } else {
            if (value < 30) colorClass = 'low';
            else if (value < 60) colorClass = 'medium';
        }

        html += `
            <div class="crew-need-bar">
                <div class="crew-need-header">
                    <span class="crew-need-icon">${need.icon}</span>
                    <span class="crew-need-label">${need.label}</span>
                    <span class="crew-need-value">${Math.round(displayValue)}%</span>
                </div>
                <div class="crew-need-track">
                    <div class="crew-need-fill ${colorClass}" style="width: ${displayValue}%"></div>
                </div>
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

/* === CREAR LOG PERSONAL === */
function createCrewPersonalLog(crew) {
    let html = '<div class="crew-profile-section">';
    html += '<div class="crew-profile-section-title">&gt; LOG PERSONAL (Últimas 10 entradas)</div>';
    html += '<div class="crew-log-container">';

    if (Array.isArray(crew.personalLog) && crew.personalLog.length > 0) {
        // Mostrar últimas 10 entradas (más recientes primero)
        const recentEntries = crew.personalLog.slice(-10).reverse();

        recentEntries.forEach(entry => {
            html += `
                <div class="crew-log-entry">
                    <span class="crew-log-year">AÑO ${entry.year || 0}</span>
                    <span class="crew-log-text">${entry.entry}</span>
                </div>
            `;
        });
    } else {
        html += '<div class="crew-log-entry"><span class="crew-log-text">Sin entradas en el log personal</span></div>';
    }

    html += '</div></div>';
    return html;
}

/* === ACTUALIZAR PERFIL DE TRIPULANTE === */
function updateCrewProfile(crewId) {
    const crew = crewMembers.find(c => c.id === crewId);
    if (!crew) return;

    // Actualizar desktop
    const content = document.getElementById(`terminal-content-crew-${crewId}`);
    if (content) {
        content.innerHTML = '';
        content.appendChild(createFullCrewProfile(crew));
    }

    // Actualizar móvil
    const mobileContent = document.getElementById(`terminal-content-crew-${crewId}-mobile`);
    if (mobileContent) {
        mobileContent.innerHTML = '';
        mobileContent.appendChild(createFullCrewProfile(crew));
    }
}

/* === ACTUALIZAR TODOS LOS PERFILES ACTIVOS === */
function updateActiveProfiles() {
    const activeContents = document.querySelectorAll('.terminal-tab-content.active[id^="terminal-content-crew-"]');
    activeContents.forEach(content => {
        const crewId = parseInt(content.id.replace('terminal-content-crew-', '').replace('-mobile', ''));
        if (!isNaN(crewId)) {
            updateCrewProfile(crewId);
        }
    });
}

/* === INICIALIZACIÓN === */
// Generar tabs cuando la tripulación esté cargada
window.addEventListener('load', () => {
    setTimeout(() => {
        if (Array.isArray(crewMembers) && crewMembers.length > 0) {
            generateCrewTabs();
        }
    }, 1000); // Esperar a que se cargue todo
});

// Actualizar perfiles cada 3 segundos
setInterval(() => {
    updateActiveProfiles();
}, 3000);

console.log('[Terminal Tabs] Sistema de fichas individuales cargado');
