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
    const roleConfig = ROLE_CONFIG[crew.role] || {};
    const emoji = roleConfig.emoji || '👤';
    const roleName = roleConfig.label || crew.role.toUpperCase();
    const initialAge = crew.initialAge;
    const yearsAwake = crew.yearsAwake ? crew.yearsAwake.toFixed(1) : '0.0';
    const biologicalAge = crew.biologicalAge ? crew.biologicalAge.toFixed(0) : crew.initialAge;
    const location = crew.getCurrentLocation ? crew.getCurrentLocation() : 'Nave';
    const activity = crew.currentActivity || 'Sin actividad';
    const thought = crew.getCurrentThought ? crew.getCurrentThought() : '💭 ...';

    // Generar HTML del perfil reorganizado según nuevo diseño
    container.innerHTML = `
        <!-- BLOQUE 1: EMOJI + INFORMACIÓN BÁSICA (2 columnas: 1/4 + 3/4) -->
        <div class="crew-header-block">
            <!-- Columna 1: Emoji (1/4) -->
            <div class="crew-emoji-column">
                <span class="crew-main-emoji">${emoji}</span>
                <span class="crew-status-icon" data-crew-status>${statusIcon}</span>
            </div>

            <!-- Columna 2: Información (3/4) -->
            <div class="crew-info-column">
                <!-- Línea 1: ROL Nombre - XX años + YY años despierto = ZZ biológicos -->
                <div class="crew-info-line-1" data-crew-header>
                    <strong>${roleName}</strong> ${crew.name} - ${initialAge}a + ${yearsAwake}a despierto = ${biologicalAge}a biológicos
                </div>

                <!-- Línea 2: Pensamiento en marquesina -->
                <div class="crew-thought-marquee" data-crew-thought>
                    ${thought}
                </div>

                <!-- Línea 3: Actividad en ubicación -->
                <div class="crew-activity-line" data-crew-activity>
                    ${activity} en ${location}
                </div>
            </div>
        </div>

        <!-- BLOQUE 2: NECESIDADES Y ACCIONES (2 columnas: 1/2 + 1/2) -->
        <div class="crew-task-grid">
            <!-- Columna 1: NECESIDADES (1/2) -->
            <div class="task-grid-column">
                <h3 class="task-column-title">NECESIDADES</h3>
                ${crew.isAlive ? createCompactCrewNeeds(crew) : '<div class="crew-dead-message">Tripulante fallecido</div>'}
            </div>

            <!-- Columna 2: ACCIONES DE ROL (1/2) -->
            <div class="task-grid-column">
                <h3 class="task-column-title">ACCIONES DE ROL</h3>
                ${createRoleActionsSection(crew)}
            </div>
        </div>

        <!-- BLOQUE 3: LOG DE ACTIVIDAD (1/1) -->
        <div class="crew-entries-section">
            <h3 class="section-title">ENTRADAS</h3>
            ${createCrewPersonalLog(crew)}
        </div>
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
                <button class="need-bar-icon-btn" data-need-name="${need.label}" ${buttonDisabled} ${buttonOnClick}>
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

/* === CREAR SECCIÓN DE TAREAS DE SUPERVIVENCIA === */
function createSurvivalTasksSection(crew) {
    if (!crew.isAlive || crew.state !== 'Despierto') {
        return '<div class="task-item empty">Tripulante no disponible</div>';
    }

    let html = '<div class="task-list">';

    // Tarea actual
    if (crew.currentTask) {
        const taskIcon = getTaskIcon(crew.currentTask.type);
        html += `
            <div class="task-item active">
                <span class="task-icon">${taskIcon}</span>
                <span class="task-description">${crew.currentTask.description}</span>
                <span class="task-status">⏳</span>
            </div>
        `;
    }

    // Tareas en cola
    if (crew.taskQueue && crew.taskQueue.length > 0) {
        crew.taskQueue.slice(0, 2).forEach((task, index) => {
            const taskIcon = getTaskIcon(task.type);
            html += `
                <div class="task-item queued">
                    <span class="task-icon">${taskIcon}</span>
                    <span class="task-description">${task.description}</span>
                    <span class="task-status">⏸️</span>
                </div>
            `;
        });
    }

    if (!crew.currentTask && (!crew.taskQueue || crew.taskQueue.length === 0)) {
        html += '<div class="task-item empty">Sin tareas programadas</div>';
    }

    html += '</div>';
    return html;
}

/* === CREAR SECCIÓN DE ACCIONES DE ROL === */
function createRoleActionsSection(crew) {
    if (!crew.isAlive) {
        return '<div class="role-action-info">Tripulante fallecido</div>';
    }

    if (crew.state !== 'Despierto') {
        return '<div class="role-action-info">Tripulante encapsulado</div>';
    }

    let html = '<div class="role-actions">';
    html += getRoleActionsHTML(crew);
    html += '</div>';
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

/* === CREAR BARRA DE ACCIÓN (ESTILO NECESIDADES CON COOLDOWN) === */
function createActionBar(icon, actionName, cooldownCurrent, cooldownMax, isEnabled, onClickFunc, dataAction = null) {
    // Calcular porcentaje de disponibilidad (100% = listo, 0% = acaba de usar)
    const percentage = cooldownMax > 0
        ? Math.max(0, ((cooldownMax - cooldownCurrent) / cooldownMax) * 100)
        : 100;

    // Determinar clase de color
    let colorClass = 'good';
    if (percentage < 100) {
        if (percentage < 30) colorClass = 'critical';
        else if (percentage < 70) colorClass = 'warning';
    }

    // Determinar si está disabled
    const isDisabled = !isEnabled || cooldownCurrent > 0;

    // Atributo data-action para poder encontrar y actualizar la barra
    const dataAttr = dataAction ? `data-action="${dataAction}"` : '';

    return `
        <button class="action-bar ${isDisabled ? 'disabled' : ''}"
                onclick="event.stopPropagation(); ${isDisabled ? '' : onClickFunc}"
                ${isDisabled ? 'disabled' : ''}
                ${dataAttr}>
            <span class="action-bar-icon" data-action-name="${actionName}">${icon}</span>
            <span class="action-bar-name">${actionName}</span>
            <div class="action-bar-track">
                <div class="action-bar-fill ${colorClass}" style="width: ${percentage}%"></div>
            </div>
            <span class="action-bar-percent">${Math.round(percentage)}%</span>
        </button>
    `;
}

/* === OBTENER HTML DE ACCIONES POR ROL === */
function getRoleActionsHTML(crew) {
    let html = '';

    switch(crew.role) {
        case 'captain':
            html += createActionBar(
                '🎮',
                'Ir a Control',
                crew.actionCooldowns.goToBridge,
                ROLE_ACTION_COOLDOWNS.goToBridge,
                true,
                `sendCrewToBridge('${crew.id}')`,
                'goToBridge'
            );
            break;

        case 'doctor':
            // Investigar
            html += createActionBar(
                '🔬',
                'Investigar',
                crew.actionCooldowns.investigate,
                ROLE_ACTION_COOLDOWNS.investigate,
                true,
                `doctorInvestigate('${crew.id}')`,
                'investigate'
            );
            // Cosechar Medicina
            html += createActionBar(
                '🌱',
                'Recolectar Medicina',
                crew.actionCooldowns.harvestMedicine,
                ROLE_ACTION_COOLDOWNS.harvestMedicine,
                canHarvestGreenhouse(),
                `doctorHarvestMedicine('${crew.id}')`,
                'harvestMedicine'
            );
            break;

        case 'engineer':
            return getEngineerRepairManagerHTML(crew);

        case 'navigator':
            return getNavigatorPushControlHTML(crew);

        case 'cook':
            // Cocinar
            html += createActionBar(
                '🍳',
                'Cocinar',
                crew.actionCooldowns.cook,
                ROLE_ACTION_COOLDOWNS.cook,
                true,
                `chefCook('${crew.id}')`,
                'cook'
            );
            // Cosechar Alimentos
            html += createActionBar(
                '🌱',
                'Cosechar Alimentos',
                crew.actionCooldowns.harvestFood,
                ROLE_ACTION_COOLDOWNS.harvestFood,
                canHarvestGreenhouse(),
                `chefHarvestFood('${crew.id}')`,
                'harvestFood'
            );
            break;

        default:
            html = '<div class="role-action-info">Sin acciones especiales</div>';
    }

    return html;
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
        const isEnabled = crew.state === 'Despierto';

        // Determinar clase de color según integridad
        let colorClass = 'good';
        if (percentage < 20) colorClass = 'critical';
        else if (percentage < 50) colorClass = 'warning';

        if (isRepairing) {
            // Mostrar barra de cancelación cuando está reparando
            html += createActionBar(
                zone.icon,
                `${zone.name} (reparando)`,
                0, // sin cooldown
                100,
                isEnabled,
                `cancelRepair('${zoneKey}')`
            );
        } else {
            // Mostrar barra de inicio de reparación
            html += createActionBar(
                zone.icon,
                `Reparar ${zone.name}`,
                0, // sin cooldown
                100,
                isEnabled,
                `startRepair('${zoneKey}')`
            );
        }
    });

    html += '</div>';
    return html;
}

/* === CONTROL DE PUSH DEL NAVEGANTE === */
function getNavigatorPushControlHTML(crew) {
    const pushCount = crew.pushCount || 0;
    const maxPushes = ROLE_ACTION_COOLDOWNS.maxPushes;
    const canPush = pushCount < maxPushes;

    let html = '';

    // Indicador de pushes usados (encima de la barra)
    html += '<div class="push-counter">';
    for (let i = 0; i < maxPushes; i++) {
        html += `<span class="push-dot ${i < pushCount ? 'used' : 'available'}">${i < pushCount ? '🔥' : '⚪'}</span>`;
    }
    html += '</div>';

    // Barra de acción de PUSH
    html += createActionBar(
        '🚀',
        `PUSH (${pushCount}/${maxPushes})`,
        crew.actionCooldowns.push,
        ROLE_ACTION_COOLDOWNS.push,
        canPush,
        `navigatorPush('${crew.id}')`,
        'push'
    );

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
    const roleConfig = ROLE_CONFIG[crew.role] || {};
    const roleName = roleConfig.label || crew.role.toUpperCase();
    const initialAge = crew.initialAge;
    const yearsAwake = crew.yearsAwake ? crew.yearsAwake.toFixed(1) : '0.0';
    const biologicalAge = crew.biologicalAge ? crew.biologicalAge.toFixed(0) : crew.initialAge;
    const location = crew.getCurrentLocation ? crew.getCurrentLocation() : 'Nave';
    const activity = crew.currentActivity || 'Sin actividad';
    const thought = crew.getCurrentThought ? crew.getCurrentThought() : '💭 ...';

    // Actualizar estado (emoji)
    const statusEl = container.querySelector('[data-crew-status]');
    if (statusEl) statusEl.textContent = statusIcon;

    // Actualizar header (línea 1)
    const headerEl = container.querySelector('[data-crew-header]');
    if (headerEl) headerEl.innerHTML = `<strong>${roleName}</strong> ${crew.name} - ${initialAge}a + ${yearsAwake}a despierto = ${biologicalAge}a biológicos`;

    // Actualizar pensamiento
    const thoughtEl = container.querySelector('[data-crew-thought]');
    if (thoughtEl) thoughtEl.textContent = thought;

    // Actualizar actividad
    const activityEl = container.querySelector('[data-crew-activity]');
    if (activityEl) activityEl.textContent = `${activity} en ${location}`;

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

    // Actualizar cooldowns de acciones de rol
    if (crew.isAlive && crew.actionCooldowns && typeof ROLE_ACTION_COOLDOWNS !== 'undefined') {
        // Mapeo de acciones a cooldowns máximos
        const actionCooldownMap = {
            'goToBridge': ROLE_ACTION_COOLDOWNS.goToBridge,
            'investigate': ROLE_ACTION_COOLDOWNS.investigate,
            'harvestMedicine': ROLE_ACTION_COOLDOWNS.harvestMedicine,
            'startRepair': ROLE_ACTION_COOLDOWNS.startRepair,
            'push': ROLE_ACTION_COOLDOWNS.push,
            'cook': ROLE_ACTION_COOLDOWNS.cook,
            'harvestFood': ROLE_ACTION_COOLDOWNS.harvestFood
        };

        Object.keys(actionCooldownMap).forEach(actionKey => {
            const cooldownCurrent = crew.actionCooldowns[actionKey] || 0;
            const cooldownMax = actionCooldownMap[actionKey];

            if (cooldownMax === 0) return; // Sin cooldown, no actualizar

            // Calcular porcentaje de disponibilidad
            const percentage = cooldownMax > 0
                ? Math.max(0, ((cooldownMax - cooldownCurrent) / cooldownMax) * 100)
                : 100;

            // Determinar clase de color
            let colorClass = 'good';
            if (percentage < 100) {
                if (percentage < 30) colorClass = 'critical';
                else if (percentage < 70) colorClass = 'warning';
            }

            // Buscar barra de acción con data-action attribute
            const actionBar = container.querySelector(`[data-action="${actionKey}"]`);
            if (!actionBar) return;

            // Actualizar fill
            const fillEl = actionBar.querySelector('.action-bar-fill');
            if (fillEl) {
                fillEl.style.width = `${percentage}%`;
                fillEl.className = `action-bar-fill ${colorClass}`;
            }

            // Actualizar porcentaje
            const percentEl = actionBar.querySelector('.action-bar-percent');
            if (percentEl) percentEl.textContent = `${Math.round(percentage)}%`;

            // Actualizar estado disabled del botón
            const isDisabled = crew.state !== 'Despierto' || cooldownCurrent > 0;
            if (isDisabled) {
                actionBar.setAttribute('disabled', 'true');
                actionBar.classList.add('disabled');
            } else {
                actionBar.removeAttribute('disabled');
                actionBar.classList.remove('disabled');
            }
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

    // Verificar cooldown
    if (crew.actionCooldowns.investigate > 0) {
        new Notification(`Investigar en cooldown: ${Math.ceil(crew.actionCooldowns.investigate * 0.5)}s restantes`, 'ALERT');
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

                    // Establecer cooldown
                    crew.actionCooldowns.investigate = ROLE_ACTION_COOLDOWNS.investigate;
                    updateActiveProfiles(); // Actualizar UI
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

    const maxPushes = ROLE_ACTION_COOLDOWNS.maxPushes;

    // Verificar si se agotaron los PUSH
    if (crew.pushCount >= maxPushes) {
        new Notification('PUSH agotado. Ya se usaron los 5 PUSH disponibles', 'ALERT');
        return;
    }

    // Verificar cooldown
    if (crew.actionCooldowns.push > 0) {
        new Notification(`PUSH en cooldown: ${Math.ceil(crew.actionCooldowns.push * 0.5)}s restantes`, 'ALERT');
        return;
    }

    // Aplicar PUSH
    crew.pushCount++;
    crew.actionCooldowns.push = ROLE_ACTION_COOLDOWNS.push; // Establecer cooldown

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

    // Verificar cooldown
    if (crew.actionCooldowns.cook > 0) {
        new Notification(`Cocinar en cooldown: ${Math.ceil(crew.actionCooldowns.cook * 0.5)}s restantes`, 'ALERT');
        return;
    }

    // Verificar si está en la cocina
    if (typeof shipMapSystem !== 'undefined') {
        const pos = shipMapSystem.crewLocations[crew.id];
        if (pos) {
            const cellType = shipMapSystem.grid[pos.row]?.[pos.col];
            const currentZone = shipMapSystem.getCellTypeToZoneName(cellType, pos.row, pos.col);

            if (currentZone === 'kitchen') {
                const kitchen = shipMapSystem.zones.kitchen;

                // Verificar si la cocina está averiada
                if (kitchen.isBroken) {
                    new Notification('La cocina está averiada. No se puede cocinar', 'ALERT');
                    return;
                }

                // Verificar cooldown de la cocina
                if (kitchen.cookCooldown > 0) {
                    new Notification(`Cocina en cooldown: ${kitchen.cookCooldown} ticks restantes`, 'ALERT');
                    return;
                }

                // Calcular coste según bonificación del chef
                let cookCost = kitchen.chefCookCost; // Base: 20 Food
                let rationsCreated = kitchen.chefRationsCreated; // Base: 6 raciones

                // Aplicar bonificaciones del chef si está despierto
                if (crew.configStats && crew.configStats.foodConsumption) {
                    cookCost = Math.ceil(cookCost * crew.configStats.foodConsumption);
                    // Chef eficiente crea más raciones
                    if (crew.configStats.foodConsumption < 1.0) {
                        rationsCreated = Math.ceil(rationsCreated * 1.2); // +20% más raciones
                    }
                }

                // Verificar si hay suficiente comida en recursos
                if (typeof Food !== 'undefined' && Food.quantity >= cookCost) {
                    Food.consume(cookCost);

                    // Crear raciones en la cocina
                    kitchen.rations = Math.min(kitchen.maxRations, kitchen.rations + rationsCreated);
                    kitchen.cookCooldown = kitchen.cookCooldownDuration;

                    console.log(`🍳 ${crew.name} cocinó ${rationsCreated} raciones (${cookCost} Food). Total: ${kitchen.rations}/${kitchen.maxRations}`);
                    crew.addToPersonalLog(`Cociné ${rationsCreated} raciones (${cookCost} Food)`);
                    new Notification(`${crew.name} cocinó ${rationsCreated} raciones. Disponibles: ${kitchen.rations}`, 'SUCCESS');

                    // Establecer cooldown personal del chef
                    crew.actionCooldowns.cook = ROLE_ACTION_COOLDOWNS.cook;
                    updateActiveProfiles(); // Actualizar UI
                    Food.updateResourceUI();
                } else {
                    new Notification(`No hay suficiente comida para cocinar (mínimo ${cookCost})`, 'ALERT');
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
