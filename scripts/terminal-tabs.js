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
    container.className = 'crew-profile-compact';

    // Determinar estado e icono
    let statusIcon = '❤️';
    if (!crew.isAlive) {
        statusIcon = '💀';
    } else if (crew.state === 'Despierto') {
        statusIcon = '⚡';
    } else if (crew.state === 'Encapsulado') {
        statusIcon = '💤';
    }

    // Información básica
    const roleLabel = crew.getRoleLabel ? crew.getRoleLabel() : '👤';
    const age = crew.biologicalAge ? crew.biologicalAge.toFixed(0) : crew.initialAge;
    const location = crew.getCurrentLocation ? crew.getCurrentLocation() : 'Nave';
    const activity = crew.currentActivity || 'Sin actividad';
    const thought = crew.getCurrentThought ? crew.getCurrentThought() : '💭 ...';

    // Generar HTML del perfil compacto
    container.innerHTML = `
        <!-- HEADER: [Rol + Nombre] [emoji estado] -->
        <div class="crew-compact-header">
            <span class="crew-compact-name">${roleLabel} ${crew.name}</span>
            <span class="crew-compact-status">${statusIcon}</span>
        </div>

        <!-- INFO: [emoji] ! [Edad inicial] ! [Edad actual] ! [Actividad] ! [Ubicación] -->
        <div class="crew-compact-info">
            ${roleLabel} ! ${crew.initialAge}a ! ${age}a ! ${activity} ! 📍 ${location}
        </div>

        <!-- PENSAMIENTO: marquesina -->
        <div class="crew-compact-thought">
            <div class="thought-marquee">${thought}</div>
        </div>

        <!-- NECESIDADES (solo si está vivo) -->
        ${crew.isAlive ? createCompactCrewNeeds(crew) : ''}

        <!-- LOG PERSONAL -->
        ${createCrewPersonalLog(crew)}
    `;

    return container;
}

/* === CREAR NECESIDADES COMPACTAS === */
function createCompactCrewNeeds(crew) {
    const isAwake = crew.state === 'Despierto';

    // Todas las necesidades del tripulante
    const needs = [
        { icon: '🍲', label: 'alimentación', value: crew.foodNeed || 0, max: 100 },
        { icon: '❤️', label: 'salud', value: crew.healthNeed || 0, max: 100 },
        { icon: '🚽', label: 'higiene', value: crew.wasteNeed || 0, max: 100, inverse: true },
        { icon: '😴', label: 'descanso', value: crew.restNeed || 0, max: 100 },
        { icon: '🎮', label: 'entretenimiento', value: crew.entertainmentNeed || 0, max: 100 }
    ];

    let html = '<div class="crew-compact-needs">';

    needs.forEach(need => {
        const percentage = (need.value / need.max) * 100;
        let colorClass = 'good';

        if (need.inverse) {
            if (percentage > 80) colorClass = 'critical';
            else if (percentage > 60) colorClass = 'warning';
        } else {
            if (percentage < 20) colorClass = 'critical';
            else if (percentage < 40) colorClass = 'warning';
        }

        // Botón desactivado si está despierto
        const buttonDisabled = isAwake ? 'disabled' : '';
        const buttonOnClick = isAwake ? '' : `onclick="event.stopPropagation(); quickManage('${crew.name}', '${need.label}')"`;

        html += `
            <div class="need-bar-advanced">
                <button class="need-bar-icon-btn" ${buttonDisabled} ${buttonOnClick}>
                    ${need.icon}
                </button>
                <div class="need-bar-track">
                    <div class="need-bar-fill-advanced ${colorClass}" style="width: ${percentage}%"></div>
                </div>
                <span class="need-bar-percent">${Math.round(percentage)}%</span>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

/* === CREAR LOG PERSONAL === */
function createCrewPersonalLog(crew) {
    let html = '<div class="crew-log-container">';

    if (Array.isArray(crew.personalLog) && crew.personalLog.length > 0) {
        // Mostrar últimas 10 entradas (más recientes primero)
        const recentEntries = crew.personalLog.slice(-10).reverse();

        recentEntries.forEach(entry => {
            // Usar la fecha formateada si existe, si no mostrar el año
            const dateLabel = entry.date || `AÑO ${entry.year || 0}`;

            html += `
                <div class="crew-log-entry">
                    <span class="crew-log-year">${dateLabel}</span>
                    <span class="crew-log-text">${entry.entry}</span>
                </div>
            `;
        });
    } else {
        html += '<div class="crew-log-entry"><span class="crew-log-text">Sin entradas...</span></div>';
    }

    html += '</div>';
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
