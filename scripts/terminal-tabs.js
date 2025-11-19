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

        // DESKTOP: Crear contenedor vacío (lazy loading - se llena al hacer clic)
        const content = document.createElement('div');
        content.className = 'terminal-tab-content';
        content.id = `terminal-content-crew-${crew.id}`;
        content.dataset.crewId = crew.id;
        content.dataset.loaded = 'false';
        contentContainer.appendChild(content);

        // MÓVIL: Crear contenedor vacío (lazy loading)
        if (mobileContentContainer) {
            const mobileContent = document.createElement('div');
            mobileContent.className = 'terminal-tab-content';
            mobileContent.id = `terminal-content-crew-${crew.id}-mobile`;
            mobileContent.dataset.crewId = crew.id;
            mobileContent.dataset.loaded = 'false';
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

    // LAZY LOADING: Cargar contenido solo la primera vez
    if (selectedContent && selectedContent.dataset.loaded === 'false') {
        const crewId = parseInt(selectedContent.dataset.crewId);
        const crew = crewMembers.find(c => c.id === crewId);
        if (crew) {
            selectedContent.appendChild(createFullCrewProfile(crew));
            selectedContent.dataset.loaded = 'true';
        }
    }

    if (selectedContentMobile && selectedContentMobile.dataset.loaded === 'false') {
        const crewId = parseInt(selectedContentMobile.dataset.crewId);
        const crew = crewMembers.find(c => c.id === crewId);
        if (crew) {
            selectedContentMobile.appendChild(createFullCrewProfile(crew));
            selectedContentMobile.dataset.loaded = 'true';
        }
    }

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
            <span class="crew-compact-status" data-crew-status>${statusIcon}</span>
        </div>

        <!-- INFO: [emoji] ! [Edad inicial] ! [Edad actual] ! [Actividad] ! [Ubicación] -->
        <div class="crew-compact-info" data-crew-info>
            ${roleLabel} ! ${crew.initialAge}a ! ${age}a ! ${activity} ! 📍 ${location}
        </div>

        <!-- PENSAMIENTO: texto completo -->
        <div class="crew-compact-thought" data-crew-thought>
            ${thought}
        </div>

        <!-- NECESIDADES (solo si está vivo) -->
        ${crew.isAlive ? createCompactCrewNeeds(crew) : ''}

        <!-- GESTOR DE TAREAS (solo si está despierto) -->
        ${createTaskManager(crew)}

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
            <div class="need-bar-advanced" data-need="${need.label}">
                <button class="need-bar-icon-btn" ${buttonDisabled} ${buttonOnClick}>
                    ${need.icon}
                </button>
                <div class="need-bar-track">
                    <div class="need-bar-fill-advanced ${colorClass}" data-need-fill style="width: ${percentage}%"></div>
                </div>
                <span class="need-bar-percent" data-need-percent>${Math.round(percentage)}%</span>
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

/* === CREAR GESTOR DE TAREAS === */
function createTaskManager(crew) {
    if (!crew.isAlive || crew.state !== 'Despierto') return '';

    let html = '<div class="crew-task-manager">';

    // SECCIÓN 1: Tareas de Supervivencia (automáticas)
    html += '<div class="task-section">';
    html += '<h3 class="task-section-title">📋 Tareas de Supervivencia</h3>';
    html += '<div class="task-list">';

    // Tarea actual o próxima
    if (crew.currentTask) {
        const taskIcon = getTaskIcon(crew.currentTask.type);
        html += `
            <div class="task-item active">
                <span class="task-icon">${taskIcon}</span>
                <span class="task-description">${crew.currentTask.description}</span>
                <span class="task-status">⏳ En curso</span>
            </div>
        `;
    }

    // Tareas en cola
    if (crew.taskQueue && crew.taskQueue.length > 0) {
        crew.taskQueue.slice(0, 3).forEach((task, index) => {
            const taskIcon = getTaskIcon(task.type);
            html += `
                <div class="task-item queued">
                    <span class="task-icon">${taskIcon}</span>
                    <span class="task-description">${task.description}</span>
                    <span class="task-status">⏸️ En cola</span>
                </div>
            `;
        });
    }

    if (!crew.currentTask && (!crew.taskQueue || crew.taskQueue.length === 0)) {
        html += '<div class="task-item empty">Sin tareas pendientes</div>';
    }

    html += '</div>'; // task-list
    html += '</div>'; // task-section

    // SECCIÓN 2: Acciones de Rol
    html += '<div class="task-section">';
    html += '<h3 class="task-section-title">⚡ Acciones de Rol</h3>';
    html += '<div class="role-actions">';
    html += getRoleActionsHTML(crew);
    html += '</div>'; // role-actions
    html += '</div>'; // task-section

    html += '</div>'; // crew-task-manager
    return html;
}

/* === OBTENER ICONO DE TAREA === */
function getTaskIcon(taskType) {
    const icons = {
        'bathroom': '🚽',
        'eat': '🍲',
        'medical': '❤️',
        'rest': '😴',
        'entertainment': '🎮',
        'work': '⚙️',
        'repair': '🔧',
        'research': '🔬',
        'harvest': '🌱',
        'cook': '🍳'
    };
    return icons[taskType] || '📌';
}

/* === OBTENER HTML DE ACCIONES POR ROL === */
function getRoleActionsHTML(crew) {
    switch(crew.role) {
        case 'captain':
            return `
                <button class="role-action-btn" onclick="sendCrewToBridge('${crew.id}')">
                    🎮 Ir a Control
                </button>
                <div class="role-action-info">
                    El liderazgo solo se aplica cuando está en el puente de mando
                </div>
            `;

        case 'doctor':
            return `
                <button class="role-action-btn" onclick="doctorInvestigate('${crew.id}')">
                    🔬 Investigar
                </button>
                <button class="role-action-btn" onclick="doctorHarvestMedicine('${crew.id}')"
                    ${!canHarvestGreenhouse() ? 'disabled' : ''}>
                    🌱 Recolectar Medicina
                </button>
                <div class="role-action-info">
                    Investiga para generar Datos. Cosecha medicina del invernadero cuando esté listo.
                </div>
            `;

        case 'engineer':
            return getEngineerRepairManagerHTML(crew);

        case 'navigator':
            return getNavigatorPushControlHTML(crew);

        case 'cook':
            return `
                <button class="role-action-btn" onclick="chefCook('${crew.id}')">
                    🍳 Cocinar
                </button>
                <button class="role-action-btn" onclick="chefHarvestFood('${crew.id}')"
                    ${!canHarvestGreenhouse() ? 'disabled' : ''}>
                    🌱 Cosechar Alimentos
                </button>
                <div class="role-action-info">
                    Cocina para preparar raciones. Cosecha alimentos del invernadero cuando esté listo.
                </div>
            `;

        default:
            return '<div class="role-action-info">Sin acciones especiales</div>';
    }
}

/* === GESTOR DE REPARACIONES DEL INGENIERO === */
function getEngineerRepairManagerHTML(crew) {
    if (typeof shipMapSystem === 'undefined') return '<div class="role-action-info">Sistema de reparaciones no disponible</div>';

    // Obtener zonas que necesitan reparación
    const damagedZones = Object.entries(shipMapSystem.zones)
        .filter(([key, zone]) => zone.integrity < 100)
        .sort((a, b) => a[1].integrity - b[1].integrity); // Ordenar por más dañadas primero

    if (damagedZones.length === 0) {
        return '<div class="role-action-info">✅ Todas las zonas están en perfecto estado</div>';
    }

    let html = '<div class="repair-queue">';

    damagedZones.forEach(([zoneKey, zone], index) => {
        const percentage = Math.round(zone.integrity);
        const isRepairing = zone.beingRepaired;
        const statusClass = percentage < 20 ? 'critical' : percentage < 50 ? 'warning' : 'damaged';

        html += `
            <div class="repair-item ${statusClass} ${isRepairing ? 'active' : ''}">
                <span class="repair-icon">${zone.icon}</span>
                <span class="repair-name">${zone.name}</span>
                <span class="repair-integrity">${percentage}%</span>
                ${isRepairing ?
                    `<button class="repair-cancel-btn" onclick="cancelRepair('${zoneKey}')">❌</button>` :
                    `<button class="repair-start-btn" onclick="startRepair('${zoneKey}')">⚙️ Reparar</button>`
                }
            </div>
        `;
    });

    html += '</div>';
    return html;
}

/* === CONTROL DE PUSH DEL NAVEGANTE === */
function getNavigatorPushControlHTML(crew) {
    // Verificar si existe el sistema de push (lo crearemos después)
    const pushCount = crew.pushCount || 0;
    const maxPushes = 5;
    const pushCooldown = crew.pushCooldown || 0;
    const canPush = pushCount < maxPushes && pushCooldown <= 0;

    let html = '<div class="navigator-push-control">';

    // Indicador de pushes usados
    html += '<div class="push-counter">';
    for (let i = 0; i < maxPushes; i++) {
        html += `<span class="push-dot ${i < pushCount ? 'used' : 'available'}">${i < pushCount ? '🔥' : '⚪'}</span>`;
    }
    html += '</div>';

    // Botón de PUSH
    html += `
        <button class="role-action-btn push-btn ${!canPush ? 'disabled' : ''}"
            onclick="navigatorPush('${crew.id}')"
            ${!canPush ? 'disabled' : ''}>
            🚀 PUSH (${pushCount}/${maxPushes})
        </button>
    `;

    // Info de cooldown
    if (pushCooldown > 0) {
        html += `<div class="role-action-info">⏳ Cooldown: ${pushCooldown} ticks</div>`;
    } else if (pushCount >= maxPushes) {
        html += `<div class="role-action-info">⚠️ PUSH agotado</div>`;
    } else {
        html += `<div class="role-action-info">Acelera la nave. Consume más combustible.</div>`;
    }

    html += '</div>';
    return html;
}

/* === VERIFICAR SI SE PUEDE COSECHAR === */
function canHarvestGreenhouse() {
    if (typeof shipMapSystem === 'undefined') return false;
    const greenhouse = shipMapSystem.zones.greenhouse;
    return greenhouse && greenhouse.isReady && greenhouse.cooldownProgress >= 100;
}

/* === ACTUALIZAR PERFIL DE TRIPULANTE (SELECTIVO - SIN DESTRUIR DOM) === */
function updateCrewProfileSelective(container, crew) {
    if (!container || !crew) return false;

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

    // Actualizar estado (emoji)
    const statusEl = container.querySelector('[data-crew-status]');
    if (statusEl) statusEl.textContent = statusIcon;

    // Actualizar info
    const infoEl = container.querySelector('[data-crew-info]');
    if (infoEl) infoEl.textContent = `${roleLabel} ! ${crew.initialAge}a ! ${age}a ! ${activity} ! 📍 ${location}`;

    // Actualizar pensamiento
    const thoughtEl = container.querySelector('[data-crew-thought]');
    if (thoughtEl) thoughtEl.textContent = thought;

    // Actualizar barras de necesidades (solo si está vivo)
    if (crew.isAlive) {
        const needs = [
            { label: 'alimentación', value: crew.foodNeed || 0, max: 100, inverse: false },
            { label: 'salud', value: crew.healthNeed || 0, max: 100, inverse: false },
            { label: 'higiene', value: crew.wasteNeed || 0, max: 100, inverse: true },
            { label: 'descanso', value: crew.restNeed || 0, max: 100, inverse: false },
            { label: 'entretenimiento', value: crew.entertainmentNeed || 0, max: 100, inverse: false }
        ];

        needs.forEach(need => {
            const needBar = container.querySelector(`[data-need="${need.label}"]`);
            if (!needBar) return;

            const percentage = (need.value / need.max) * 100;
            let colorClass = 'good';

            if (need.inverse) {
                if (percentage > 80) colorClass = 'critical';
                else if (percentage > 60) colorClass = 'warning';
            } else {
                if (percentage < 20) colorClass = 'critical';
                else if (percentage < 40) colorClass = 'warning';
            }

            // Actualizar fill (barra y clase)
            const fillEl = needBar.querySelector('[data-need-fill]');
            if (fillEl) {
                fillEl.style.width = `${percentage}%`;
                fillEl.className = `need-bar-fill-advanced ${colorClass}`;
            }

            // Actualizar porcentaje
            const percentEl = needBar.querySelector('[data-need-percent]');
            if (percentEl) percentEl.textContent = `${Math.round(percentage)}%`;
        });
    }

    // TODO: Actualizar log si hay nuevas entradas (más complejo, lo dejamos para después)

    return true;
}

/* === ACTUALIZAR PERFIL DE TRIPULANTE === */
function updateCrewProfile(crewId) {
    const crew = crewMembers.find(c => c.id === crewId);
    if (!crew) return;

    // Actualizar desktop
    const content = document.getElementById(`terminal-content-crew-${crewId}`);
    if (content) {
        // Intentar actualización selectiva primero
        const profile = content.querySelector('.crew-profile-compact');
        if (profile && updateCrewProfileSelective(profile, crew)) {
            // Actualización selectiva exitosa
        } else if (content.dataset.loaded === 'true') {
            // El perfil debería existir pero no está, recrearlo
            content.innerHTML = '';
            content.appendChild(createFullCrewProfile(crew));
        }
        // Si loaded='false', no hacer nada (se cargará cuando se haga clic)
    }

    // Actualizar móvil
    const mobileContent = document.getElementById(`terminal-content-crew-${crewId}-mobile`);
    if (mobileContent) {
        // Intentar actualización selectiva primero
        const profileMobile = mobileContent.querySelector('.crew-profile-compact');
        if (profileMobile && updateCrewProfileSelective(profileMobile, crew)) {
            // Actualización selectiva exitosa
        } else if (mobileContent.dataset.loaded === 'true') {
            // El perfil debería existir pero no está, recrearlo
            mobileContent.innerHTML = '';
            mobileContent.appendChild(createFullCrewProfile(crew));
        }
        // Si loaded='false', no hacer nada (se cargará cuando se haga clic)
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

/* ========================================
   FUNCIONES DE ACCIONES POR ROL
   ======================================== */

/* === CAPITÁN: IR A CONTROL === */
function sendCrewToBridge(crewId) {
    const crew = crewMembers.find(c => c.id == crewId);
    if (!crew || !crew.isAlive || crew.state !== 'Despierto') {
        console.warn('Capitán no disponible para ir a control');
        return;
    }

    // Forzar target al puente de mando
    if (typeof shipMapSystem !== 'undefined') {
        shipMapSystem.crewTargets[crew.id] = 'bridge';
        console.log(`👨‍✈️ ${crew.name} se dirige al puente de mando`);
        crew.addToPersonalLog('Me dirijo al puente de mando para liderar');
    }
}

/* === DOCTOR: INVESTIGAR (GENERAR DATOS) === */
function doctorInvestigate(crewId) {
    const crew = crewMembers.find(c => c.id == crewId);
    if (!crew || !crew.isAlive || crew.state !== 'Despierto') {
        console.warn('Doctor no disponible para investigar');
        return;
    }

    // Verificar si está en la enfermería
    if (typeof shipMapSystem !== 'undefined') {
        const pos = shipMapSystem.crewLocations[crew.id];
        if (pos) {
            const cellType = shipMapSystem.grid[pos.row]?.[pos.col];
            const currentZone = shipMapSystem.getCellTypeToZoneName(cellType, pos.row, pos.col);

            if (currentZone === 'medbay') {
                // Generar datos
                const dataGenerated = 10;
                if (typeof Data !== 'undefined') {
                    Data.add(dataGenerated);
                    console.log(`🔬 ${crew.name} investigó y generó ${dataGenerated} de Datos`);
                    crew.addToPersonalLog(`Investigué y generé ${dataGenerated} de Datos`);
                    new Notification(`${crew.name} generó ${dataGenerated} de Datos`, 'SUCCESS');
                }
            } else {
                console.warn('El doctor debe estar en la enfermería para investigar');
                new Notification('El doctor debe estar en la enfermería para investigar', 'ALERT');
            }
        }
    }
}

/* === DOCTOR: COSECHAR MEDICINA === */
function doctorHarvestMedicine(crewId) {
    const crew = crewMembers.find(c => c.id == crewId);
    if (!crew || !crew.isAlive || crew.state !== 'Despierto') {
        console.warn('Doctor no disponible');
        return;
    }

    // Usar el sistema existente del mapa
    if (typeof shipMapSystem !== 'undefined') {
        shipMapSystem.harvestGreenhouse('medicine');
        console.log(`🌱 ${crew.name} cosechó medicina del invernadero`);
        crew.addToPersonalLog('Cosech\u00e9 medicina del invernadero');
    }
}

/* === INGENIERO: CANCELAR REPARACIÓN === */
function cancelRepair(zoneKey) {
    if (typeof shipMapSystem !== 'undefined') {
        const zone = shipMapSystem.zones[zoneKey];
        if (zone && zone.beingRepaired) {
            zone.beingRepaired = false;
            zone.repairProgress = 0;
            zone.repairTimeNeeded = 0;

            const engineer = crewMembers.find(c => c.role === 'engineer' && c.isAlive);
            if (engineer) {
                engineer.currentActivity = 'idle';
                engineer.addToPersonalLog(`Cancelé la reparación de ${zone.name}`);
            }

            shipMapSystem.updateRoomsStatus();
            updateActiveProfiles(); // Actualizar la ficha del ingeniero
            console.log(`🔧 Reparación de ${zone.name} cancelada`);
        }
    }
}

/* === NAVEGANTE: PUSH (ACELERAR NAVE) === */
function navigatorPush(crewId) {
    const crew = crewMembers.find(c => c.id == crewId);
    if (!crew || !crew.isAlive || crew.state !== 'Despierto') {
        console.warn('Navegante no disponible');
        return;
    }

    // Inicializar sistema de push si no existe
    if (crew.pushCount === undefined) crew.pushCount = 0;
    if (crew.pushCooldown === undefined) crew.pushCooldown = 0;

    const maxPushes = 5;

    if (crew.pushCount >= maxPushes) {
        new Notification('PUSH agotado. Ya se usaron los 5 PUSH disponibles', 'ALERT');
        return;
    }

    if (crew.pushCooldown > 0) {
        new Notification(`PUSH en cooldown: ${crew.pushCooldown} ticks restantes`, 'ALERT');
        return;
    }

    // Aplicar PUSH
    crew.pushCount++;
    crew.pushCooldown = 30; // 30 ticks de cooldown

    // Aumentar velocidad de la nave
    if (typeof gameLoop !== 'undefined' && gameLoop.currentSpeed !== undefined) {
        const speedBoost = 10; // +10% de velocidad
        gameLoop.currentSpeed = Math.min(200, gameLoop.currentSpeed + speedBoost);

        // Aumentar consumo de combustible
        const fuelPenalty = 1.5; // 50% más de consumo
        if (typeof RESOURCES_CONFIG !== 'undefined') {
            RESOURCES_CONFIG.fuel.consumeRate *= fuelPenalty;
        }

        console.log(`🚀 ${crew.name} activó PUSH! Velocidad: ${gameLoop.currentSpeed}%`);
        crew.addToPersonalLog(`Activé PUSH! Velocidad aumentada (${crew.pushCount}/${maxPushes})`);
        new Notification(`🚀 PUSH activado! Velocidad: ${gameLoop.currentSpeed}% (${crew.pushCount}/${maxPushes})`, 'SUCCESS');
    }

    updateActiveProfiles();
}

/* === CHEF: COCINAR === */
function chefCook(crewId) {
    const crew = crewMembers.find(c => c.id == crewId);
    if (!crew || !crew.isAlive || crew.state !== 'Despierto') {
        console.warn('Chef no disponible');
        return;
    }

    // Verificar si está en la cocina
    if (typeof shipMapSystem !== 'undefined') {
        const pos = shipMapSystem.crewLocations[crew.id];
        if (pos) {
            const cellType = shipMapSystem.grid[pos.row]?.[pos.col];
            const currentZone = shipMapSystem.getCellTypeToZoneName(cellType, pos.row, pos.col);

            if (currentZone === 'kitchen') {
                // Verificar si hay suficiente comida en recursos
                if (typeof Food !== 'undefined' && Food.quantity >= 20) {
                    Food.consume(20);

                    // Crear raciones (por ahora, mantener la comida en recursos)
                    // TODO: Crear sistema de raciones en la cocina
                    const portionsCreated = 5;
                    Food.add(portionsCreated);

                    console.log(`🍳 ${crew.name} cocinó ${portionsCreated} raciones`);
                    crew.addToPersonalLog(`Cociné ${portionsCreated} raciones de alimento`);
                    new Notification(`${crew.name} cocinó ${portionsCreated} raciones`, 'SUCCESS');
                } else {
                    new Notification('No hay suficiente comida para cocinar (mínimo 20)', 'ALERT');
                }
            } else {
                console.warn('El chef debe estar en la cocina para cocinar');
                new Notification('El chef debe estar en la cocina para cocinar', 'ALERT');
            }
        }
    }
}

/* === CHEF: COSECHAR ALIMENTOS === */
function chefHarvestFood(crewId) {
    const crew = crewMembers.find(c => c.id == crewId);
    if (!crew || !crew.isAlive || crew.state !== 'Despierto') {
        console.warn('Chef no disponible');
        return;
    }

    // Usar el sistema existente del mapa
    if (typeof shipMapSystem !== 'undefined') {
        shipMapSystem.harvestGreenhouse('food');
        console.log(`🌱 ${crew.name} cosechó alimentos del invernadero`);
        crew.addToPersonalLog('Cosech\u00e9 alimentos del invernadero');
    }
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
